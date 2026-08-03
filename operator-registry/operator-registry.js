/*

OPERATOR REGISTRY — CHARACTER SHEET LOGIC
BUILD: 2026-08-03-d

Persists the whole sheet to localStorage under REGISTRY_KEY so an
Operator's Readings, capacity, and procedure list survive a page
reload. Everything recalculates live: Pale from Readings, the
36-point allocation check, capacity overflow, and per-procedure
rolls (1d20 unstamped, 2d20-best stamped) against the linked
Reading. Procedures are fixed to the 9 entries in Article V.

IMPORTANT: this file must be paired with the matching
operatorregistry.html delivered alongside it. If you mix an old
HTML with a new JS (or vice versa), a single missing element used
to crash the whole init and silently break everything downstream
(readings, pale, procedures — all of it). That's fixed below: every
binding step is isolated and null-checked, so one missing piece
only logs a warning instead of taking the rest of the page down
with it.

If you don't see "BUILD: 2026-08-03-d" printed in the console on
load, the browser is serving a cached copy of this file — hard
refresh (Ctrl/Cmd+Shift+R), or open DevTools > Network, check
"Disable cache", and reload.

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
    void el.offsetWidth;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 350);
}

// tiny helpers so a missing element WARNS instead of crashing the
// whole init — this is the actual fix for "nothing works at all"
function byId(id){
    const el = document.getElementById(id);
    if(!el) console.warn("OPERATOR REGISTRY — element #" + id + " not found (HTML/JS version mismatch?)");
    return el;
}

function on(id, evt, handler){
    const el = byId(id);
    if(el) el.addEventListener(evt, handler);
    return el;
}

// ---------- readings ----------

const lastPaleShown = { BRN: null, FRM: null, NRV: null };
let lastBudgetUsedShown = null;

function renderReadings(){

    try{

        ["BRN","FRM","NRV"].forEach(key => {

            const val = state.readings[key];
            const inputEl = byId("reading" + key);
            const paleEl = byId("pale" + key);
            const flagEl = byId("flag" + key);

            if(!inputEl || !paleEl || !flagEl) return;

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

        const usedEl = byId("budgetUsed");
        const remainingEl = byId("budgetRemaining");
        const budgetRow = byId("budgetRow");

        if(usedEl) usedEl.textContent = used;
        if(remainingEl) remainingEl.textContent = remaining;
        if(budgetRow) budgetRow.classList.toggle("bad", remaining !== 0);

        if(lastBudgetUsedShown !== null && lastBudgetUsedShown !== used){
            flash(budgetRow);
        }
        lastBudgetUsedShown = used;

    } catch(err){
        console.error("OPERATOR REGISTRY — renderReadings failed", err);
    }

}

function bindReadingInputs(){

    ["BRN","FRM","NRV"].forEach(key => {

        const el = byId("reading" + key);
        if(!el) return;

        const handler = (e) => {
            state.readings[key] = Number(e.target.value) || 0;
            renderReadings();
            renderProcedures();
            saveState();
        };

        el.addEventListener("input", handler);
        el.addEventListener("change", handler);

    });

}

// ---------- capacity ----------

function renderCapacity(){

    try{

        const baseEl = byId("capBaseline");
        const expEl = byId("capExpanded");
        const usedEl = byId("capUsed");
        const totalEl = byId("capTotal");
        const readout = byId("capacityReadout");

        if(baseEl) baseEl.value = state.capacity.baseline;
        if(expEl) expEl.value = state.capacity.expanded;
        if(usedEl) usedEl.value = state.capacity.used;

        const total = state.capacity.baseline + state.capacity.expanded;
        const remaining = total - state.capacity.used;

        if(totalEl) totalEl.textContent = total;

        if(readout){
            if(remaining < 0){
                readout.innerHTML = 'OVERFLOW DENIED — OVER BY <strong>' + Math.abs(remaining) + '</strong>';
                readout.classList.add("overflow");
            } else {
                readout.innerHTML = 'REMAINING: <strong>' + remaining + '</strong>';
                readout.classList.remove("overflow");
            }
        }

    } catch(err){
        console.error("OPERATOR REGISTRY — renderCapacity failed", err);
    }

}

function bindCapacityInputs(){

    [["capBaseline","baseline"],["capExpanded","expanded"],["capUsed","used"]].forEach(([id, key]) => {

        const el = byId(id);
        if(!el) return;

        const handler = (e) => {
            state.capacity[key] = Number(e.target.value) || 0;
            renderCapacity();
            saveState();
        };

        el.addEventListener("input", handler);
        el.addEventListener("change", handler);

    });

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

    try{

        const body = byId("procBody");
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

    } catch(err){
        console.error("OPERATOR REGISTRY — renderProcedures failed", err);
    }

}

// ---------- init ----------

document.addEventListener("DOMContentLoaded", () => {

    console.log("OPERATOR REGISTRY ONLINE — BUILD 2026-08-03-d");

    try{
        const nameEl = byId("opName");
        const kindEl = byId("opKind");
        if(nameEl) nameEl.value = state.name;
        if(kindEl) kindEl.value = state.kind;
        if(nameEl) nameEl.addEventListener("input", (e) => { state.name = e.target.value; saveState(); });
        if(kindEl) kindEl.addEventListener("change", (e) => { state.kind = e.target.value; saveState(); });
    } catch(err){
        console.error("OPERATOR REGISTRY — identity init failed", err);
    }

    try{
        bindCapacityInputs();
    } catch(err){
        console.error("OPERATOR REGISTRY — capacity binding failed", err);
    }

    try{
        bindReadingInputs();
    } catch(err){
        console.error("OPERATOR REGISTRY — reading binding failed", err);
    }

    try{
        on("resetBtn", "click", () => {
            const ok = window.confirm("RESET THE ENTIRE SHEET? THIS CANNOT BE UNDONE.");
            if(!ok) return;
            state = defaultState();
            const nameEl = byId("opName");
            const kindEl = byId("opKind");
            if(nameEl) nameEl.value = state.name;
            if(kindEl) kindEl.value = state.kind;
            renderReadings();
            renderCapacity();
            renderProcedures();
            saveState();
        });
    } catch(err){
        console.error("OPERATOR REGISTRY — reset binding failed", err);
    }

    renderReadings();
    renderCapacity();
    renderProcedures();

});

console.log("READINGS HOLD. PALE ABSORBS. THE FIELD DOES NOT.");
