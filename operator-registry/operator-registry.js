/*

OPERATOR REGISTRY — CHARACTER SHEET LOGIC

Persists the whole sheet to localStorage under REGISTRY_KEY so an
Operator's Readings, capacity, and procedure list survive a page
reload. Everything recalculates live: Pale from Readings, the
36-point allocation check, capacity overflow, and per-procedure
rolls (1d20 unstamped, 2d20-best stamped) against the linked
Reading.

*/

const REGISTRY_KEY = "operatorRegistry.v1";
const READING_MIN = 8;
const READING_MAX = 16;
const READING_BUDGET = 36;

const DEFAULT_PROCEDURES = [
    { id: "archive-reading", name: "Archive Reading", desc: "Analysis, decoding.", reading: "BRN", stamped: false, nonstandard: false, locked: true },
    { id: "signal-trace", name: "Signal Trace", desc: "Tracking, reconstruction.", reading: "BRN", stamped: false, nonstandard: false, locked: true },
    { id: "anomaly-sense", name: "Anomaly Sense", desc: "Detection of irregularity.", reading: "BRN", stamped: false, nonstandard: false, locked: true },
    { id: "field-movement", name: "Field Movement", desc: "Traversal, positioning.", reading: "FRM", stamped: false, nonstandard: false, locked: true },
    { id: "manual-action", name: "Manual Action", desc: "Operation, manipulation.", reading: "FRM", stamped: false, nonstandard: false, locked: true },
    { id: "static-step", name: "Static Step", desc: "Movement through material-static discontinuities.", reading: "FRM", stamped: false, nonstandard: false, locked: true },
    { id: "stress-hold", name: "Stress Hold", desc: "Resistance to panic.", reading: "NRV", stamped: false, nonstandard: false, locked: true },
    { id: "pain-gate", name: "Pain Gate", desc: "Endurance under damage.", reading: "NRV", stamped: false, nonstandard: false, locked: true },
    { id: "pale-sense", name: "Pale Sense", desc: "Nervous perception of Pale interaction with Static.", reading: "NRV", stamped: false, nonstandard: false, locked: true }
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

let state = loadState();

function loadState(){

    try{

        const raw = window.localStorage.getItem(REGISTRY_KEY);
        if(!raw) return defaultState();

        const parsed = JSON.parse(raw);

        return {
            name: parsed.name || "",
            kind: parsed.kind || "",
            readings: Object.assign({ BRN: 12, FRM: 12, NRV: 12 }, parsed.readings || {}),
            capacity: Object.assign({ baseline: 6, expanded: 0, used: 0 }, parsed.capacity || {}),
            procedures: Array.isArray(parsed.procedures) && parsed.procedures.length
                ? parsed.procedures
                : DEFAULT_PROCEDURES.map(p => ({ ...p, lastResult: "" }))
        };

    } catch(err){

        return defaultState();

    }

}

function saveState(){

    try{
        window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(state));
    } catch(err){
        // storage unavailable — sheet still works for this session
    }

}

function pale(reading){
    const n = Number(reading) || 0;
    return Math.ceil(n / 2);
}

// ---------- readings ----------

function renderReadings(){

    ["BRN","FRM","NRV"].forEach(key => {

        const val = state.readings[key];

        document.getElementById("reading" + key).value = val;
        document.getElementById("pale" + key).textContent = pale(val);

        const flagEl = document.getElementById("flag" + key);

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

    const used = state.readings.BRN + state.readings.FRM + state.readings.NRV;
    const remaining = READING_BUDGET - used;

    document.getElementById("budgetUsed").textContent = used;
    document.getElementById("budgetRemaining").textContent = remaining;

    const budgetRow = document.getElementById("budgetRow");
    budgetRow.classList.toggle("bad", remaining !== 0);

}

["BRN","FRM","NRV"].forEach(key => {

    document.addEventListener("DOMContentLoaded", () => {

        document.getElementById("reading" + key).addEventListener("input", (e) => {
            state.readings[key] = Number(e.target.value) || 0;
            renderReadings();
            renderProcedures();
            saveState();
        });

    });

});

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
    body.innerHTML = "";

    state.procedures.forEach((proc) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="proc-name" data-label="PROCEDURE">
                ${proc.name}
                ${proc.desc ? '<span class="proc-tag">' + proc.desc + '</span>' : ""}
                ${proc.nonstandard ? '<span class="proc-tag">NON-STANDARD</span>' : ""}
            </td>
            <td class="proc-reading" data-label="READING">${proc.reading} · ${state.readings[proc.reading]}</td>
            <td data-label="STAMP">
                <button type="button" class="stamp-toggle ${proc.stamped ? "on" : ""}" data-act="stamp">
                    ${proc.stamped ? "STAMPED" : "UNSTAMPED"}
                </button>
            </td>
            <td data-label="ROLL">
                <button type="button" class="roll-btn" data-act="roll">RUN</button>
            </td>
            <td class="proc-result" data-label="RESULT">${proc.lastResult || "—"}</td>
            <td data-label="">${proc.locked ? "" : '<button type="button" class="remove-btn" data-act="remove" title="Remove">✕</button>'}</td>
        `;

        tr.querySelector('[data-act="stamp"]').addEventListener("click", () => {
            proc.stamped = !proc.stamped;
            renderProcedures();
            saveState();
        });

        tr.querySelector('[data-act="roll"]').addEventListener("click", () => {
            runProcedure(proc);
        });

        const removeBtn = tr.querySelector('[data-act="remove"]');
        if(removeBtn){
            removeBtn.addEventListener("click", () => {
                state.procedures = state.procedures.filter(p => p.id !== proc.id);
                renderProcedures();
                saveState();
            });
        }

        body.appendChild(tr);

    });

}

function addCustomProcedure(){

    const nameInput = document.getElementById("newProcName");
    const readingSelect = document.getElementById("newProcReading");
    const typeSelect = document.getElementById("newProcType");

    const name = nameInput.value.trim();
    if(name.length === 0) return;

    state.procedures.push({
        id: "custom-" + Date.now(),
        name: name,
        reading: readingSelect.value,
        stamped: false,
        nonstandard: typeSelect.value === "nonstandard",
        locked: false,
        lastResult: ""
    });

    nameInput.value = "";

    renderProcedures();
    saveState();

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

    document.getElementById("addProcBtn").addEventListener("click", addCustomProcedure);

    document.getElementById("newProcName").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            addCustomProcedure();
        }
    });

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

console.log("OPERATOR REGISTRY ONLINE");
console.log("READINGS HOLD. PALE ABSORBS. THE FIELD DOES NOT.");
