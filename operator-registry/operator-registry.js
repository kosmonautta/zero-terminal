/*

OPERATOR REGISTRY — CHARACTER SHEET LOGIC
BUILD: 2026-08-03-c

Persists the whole sheet to localStorage under REGISTRY_KEY so an
Operator's Readings, capacity, and procedure list survive a page
reload. Everything recalculates live: Pale from Readings, the
36-point allocation check, capacity overflow, and per-procedure
rolls (1d20 unstamped, 2d20-best stamped) against the linked
Reading.

Procedures are fixed to the 9 entries in Article V — no custom
procedures are created here. Every changed number (Pale, Allocated,
Remaining) briefly flashes so a change is never ambiguous.

If you don't see "BUILD: 2026-08-03-c" printed in the console on
load, the browser is serving a cached copy of this file — hard
refresh (Ctrl/Cmd+Shift+R) or bump the script's ?v= query string.

*/

const REGISTRY_KEY = "operatorRegistry.v1";
const READING_MIN = 8;
const READING_MAX = 16;
const READING_BUDGET = 36;

const DEFAULT_PROCEDURES = [
    { id: "archive-reading", name: "Archive Reading", desc: "Analysis, decoding.", reading: "BRN", stamped: false },
    { id: "signal-trace", name: "Signal Trace", desc: "Tracking, reconstruction.", reading: "BRN", stamped: false },
    { id: "anomaly-sense", name: "Anomaly Sense", desc: "Detection of irregularity.", reading: "BRN", stamped: false },
    { id: "field-movement", name: "Field Movement", desc: "Traversal, positioning.", reading: "FRM", stamped: false },
    { id: "manual-action", name: "Manual Action", desc: "Operation, manipulation.", reading: "FRM", stamped: false },
    { id: "static-step", name: "Static Step", desc: "Movement through material-static discontinuities.", reading: "FRM", stamped: false },
    { id: "stress-hold", name: "Stress Hold", desc: "Resistance to panic.", reading: "NRV", stamped: false },
    { id: "pain-gate", name: "Pain Gate", desc: "Endurance under damage.", reading: "NRV", stamped: false },
    { id: "pale-sense", name: "Pale Sense", desc: "Nervous perception of Pale interaction with Static.", reading: "NRV", stamped: false }
];

function defaultState(){
    return {
        name: "",
        kind: "",
        readings: { BRN: 12, FRM: 12, NRV: 12 },
        capacity: { baseline: 6, expanded: 0, used: 0 },
        procedures: DEFAULT_PROCEDURES.map(p => ({ ...p, lastResult: "" }))
    };
}

function loadState(){

    try{

        const raw = window.localStorage.getItem(REGISTRY_KEY);
        if(!raw) return defaultState();

        const parsed = JSON.parse(raw);

        // Procedures always come from DEFAULT_PROCEDURES (fixed list of 9).
        // We only carry over stamped/lastResult from whatever was saved,
        // by id, so a sheet saved before this build still maps cleanly
        // and nothing custom survives.
        const savedById = {};
        (Array.isArray(parsed.procedures) ? parsed.procedures : []).forEach(p => {
            if(p && p.id) savedById[p.id] = p;
        });

        const procedures = DEFAULT_PROCEDURES.map(p => ({
            ...p,
            stamped: savedById[p.id] ? !!savedById[p.id].stamped : false,
            lastResult: savedById[p.id] ? (savedById[p.id].lastResult || "") : ""
        }));

        return {
            name: parsed.name || "",
            kind: parsed.kind || "",
            readings: Object.assign({ BRN: 12, FRM: 12, NRV: 12 }, parsed.readings || {}),
            capacity: Object.assign({ baseline: 6, expanded: 0, used: 0 }, parsed.capacity || {}),
            procedures: procedures
        };

    } catch(err){

        console.error("OPERATOR REGISTRY — failed to load saved state, using defaults", err);
        return defaultState();

    }

}

let state = loadState();

function saveState(){

    try{
        window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(state));
    } catch(err){
        console.error("OPERATOR REGISTRY — failed to save state", err);
    }

}

function pale(reading){
    const n = Number(reading) || 0;
    return Math.ceil(n / 2);
}

function flash(el){
    if(!el) return;
    el.classList.remove("flash");
    // force reflow so re-adding the class retriggers the transition
    // even if the element was still mid-flash from a rapid change
    void el.offsetWidth;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 350);
}

// ---------- readings ----------

const lastPaleShown = { BRN: null, FRM: null, NRV: null };
let lastBudgetUsedShown = null;

function renderReadings(){

    ["BRN","FRM","NRV"].forEach(key => {

        const val = state.readings[key];

        const inputEl = document.getElementById("reading" + key);
        const paleEl = document.getElementById("pale" + key);
        const flagEl = document.getElementById("flag" + key);

        if(!inputEl || !paleEl || !flagEl){
            console.error("OPERATOR REGISTRY — missing DOM node for reading " + key);
            return;
        }

        // don't stomp on the field the user is actively typing in
        if(document.activeElement !== inputEl){
            inputEl.value = val;
        }

        const paleVal = pale(val);
        paleEl.textContent = paleVal;

        if(lastPaleShown[key] !== null && lastPaleShown[key] !== paleVal){
            flash(paleEl.closest(".rc-pale"));
        }
        lastPaleShown[key] = paleVal;

        if(val < READING_MIN){
            flagEl.textContent = "BELOW MINIMUM (" + READING_MIN + ")";
            flagEl.classList.add("bad");
        } else if(val > READING_MAX){
            flagEl.textContent = "ABOVE MAXIMUM (" + READING_MAX + ")";
            flagEl.classList.add("bad");
        } else {
            flagEl.textContent = "";
            flagEl.classList.remove("bad");
        }

    });

    const used = Number(state.readings.BRN || 0) + Number(state.readings.FRM || 0) + Number(state.readings.NRV || 0);
    const remaining = READING_BUDGET - used;

    const usedEl = document.getElementById("budgetUsed");
    const remainingEl = document.getElementById("budgetRemaining");
    const budgetRow = document.getElementById("budgetRow");

    if(usedEl) usedEl.textContent = used;
    if(remainingEl) remainingEl.textContent = remaining;
    if(budgetRow) budgetRow.classList.toggle("bad", remaining !== 0);

    if(lastBudgetUsedShown !== null && lastBudgetUsedShown !== used){
        flash(budgetRow);
    }
    lastBudgetUsedShown = used;

}

function bindReadingInputs(){

    ["BRN","FRM","NRV"].forEach(key => {

        const el = document.getElementById("reading" + key);

        if(!el){
            console.error("OPERATOR REGISTRY — could not find #reading" + key + " to bind");
            return;
        }

        const handler = (e) => {
            state.readings[key] = Number(e.target.value) || 0;
            renderReadings();
            renderProcedures();
            saveState();
        };

        // bound on both events defensively — some browsers only fire
        // "change" (not "input") for number-field spinner clicks
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);

    });

}

// ---------- capacity ----------

function renderCapacity(){

    document.getElementById("capBaseline").value = state.capacity.baseline;
    document.getElementById("capExpanded").value = state.capacity.expanded;
    document.getElementById("capUsed").value = state.capacity.used;

    const total = state.capacity.baseline + state.capacity.expanded;
    const remaining = total - state.capacity.used;

    document.getElementById("capTotal").textContent = total;

    const readout = document.getElementById("capacityReadout");

    if(remaining < 0){
        readout.innerHTML = 'OVERFLOW DENIED — OVER BY <strong>' + Math.abs(remaining) + '</strong>';
        readout.classList.add("overflow");
    } else {
        readout.innerHTML = 'REMAINING: <strong>' + remaining + '</strong>';
        readout.classList.remove("overflow");
    }

}

// ---------- procedures ----------

function rollDie20(){
    return 1 + Math.floor(Math.random() * 20);
}

function runProcedure(proc){

    const readingValue = state.readings[proc.reading] || 0;

    let rollText, rollTotal;

    if(proc.stamped){
        const a = rollDie20();
        const b = rollDie20();
        const best = Math.max(a, b);
        rollText = "2D20 (" + a + ", " + b + ") → BEST " + best;
        rollTotal = best;
    } else {
        const a = rollDie20();
        rollText = "1D20 → " + a;
        rollTotal = a;
    }

    const total = rollTotal + readingValue;

    proc.lastResult = total + "  —  " + rollText + " + " + proc.reading + " " + readingValue;

    renderProcedures();
    saveState();

}

function renderProcedures(){

    const body = document.getElementById("procBody");
    if(!body) return;
    body.innerHTML = "";

    ["BRN","FRM","NRV"].forEach(readingKey => {

        const groupProcs = state.procedures.filter(p => p.reading === readingKey);
        if(groupProcs.length === 0) return;

        const head = document.createElement("div");
        head.className = "reading-group-head";
        head.innerHTML = readingKey + ' <span class="rgh-val">READING ' + state.readings[readingKey] + '</span>';
        body.appendChild(head);

        groupProcs.forEach((proc) => {

            const row = document.createElement("div");
            row.className = "procedure-row";

            row.innerHTML = `
                <button type="button" class="stamp-dot ${proc.stamped ? "on" : ""}" data-act="stamp" title="Toggle Stamped"></button>
                <div class="proc-info">
                    <div class="proc-name-line">${proc.name}</div>
                    ${proc.desc ? '<span class="proc-desc">' + proc.desc + '</span>' : ""}
                </div>
                <div class="proc-actions">
                    <div class="proc-result">${proc.lastResult || "—"}</div>
                    <button type="button" class="roll-btn" data-act="roll">RUN</button>
                </div>
            `;

            row.querySelector('[data-act="stamp"]').addEventListener("click", () => {
                proc.stamped = !proc.stamped;
                renderProcedures();
                saveState();
            });

            row.querySelector('[data-act="roll"]').addEventListener("click", () => {
                runProcedure(proc);
            });

            body.appendChild(row);

        });

    });

}

// ---------- init ----------

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("opName").value = state.name;
    document.getElementById("opKind").value = state.kind;

    document.getElementById("opName").addEventListener("input", (e) => {
        state.name = e.target.value;
        saveState();
    });

    document.getElementById("opKind").addEventListener("change", (e) => {
        state.kind = e.target.value;
        saveState();
    });

    ["capBaseline","capExpanded","capUsed"].forEach((id, i) => {

        const key = ["baseline","expanded","used"][i];

        document.getElementById(id).addEventListener("input", (e) => {
            state.capacity[key] = Number(e.target.value) || 0;
            renderCapacity();
            saveState();
        });

    });

    bindReadingInputs();

    document.getElementById("resetBtn").addEventListener("click", () => {

        const ok = window.confirm("RESET THE ENTIRE SHEET? THIS CANNOT BE UNDONE.");
        if(!ok) return;

        state = defaultState();

        document.getElementById("opName").value = state.name;
        document.getElementById("opKind").value = state.kind;

        renderReadings();
        renderCapacity();
        renderProcedures();
        saveState();

    });

    renderReadings();
    renderCapacity();
    renderProcedures();

});

console.log("OPERATOR REGISTRY ONLINE — BUILD 2026-08-03-c");
console.log("READINGS HOLD. PALE ABSORBS. THE FIELD DOES NOT.");
