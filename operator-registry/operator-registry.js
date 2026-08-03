/*

OPERATOR REGISTRY — CHARACTER SHEET LOGIC
BUILD: 2026-08-04-d
Now with inventory card management (hex, knot, routine)

*/

const REGISTRY_KEY = "operatorRegistry.v1";
const HEX_KEY = "hexGraveCards";
const KNOT_KEY = "linkKnotCards";
const ROUTINE_KEY = "routineCards";
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

// ===== LOAD/SAVE FUNCTIONS =====

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

function saveState(){
    try{
        window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(state));
    } catch(err){
        console.error("OPERATOR REGISTRY — failed to save state", err);
    }
}

// ===== CARD MANAGEMENT FUNCTIONS =====

function loadCards(key){
    try{
        const raw = window.localStorage.getItem(key);
        if(raw){
            console.log(`✅ Loaded ${key}:`, JSON.parse(raw));
        } else {
            console.log(`⚠️ No data found for ${key}`);
        }
        return raw ? JSON.parse(raw) : [];
    } catch(err){
        console.error(`Failed to load cards from ${key}`, err);
        return [];
    }
}

function saveCards(key, cards){
    try{
        window.localStorage.setItem(key, JSON.stringify(cards));
    } catch(err){
        console.error(`Failed to save cards to ${key}`, err);
    }
}

function deleteCard(key, cardId){
    const cards = loadCards(key);
    const filtered = cards.filter(c => c.id !== cardId);
    saveCards(key, filtered);
    return filtered;
}

// Debug function to check all localStorage keys
function debugLocalStorage(){
    console.log("=== LOCALSTORAGE DEBUG ===");
    console.log("All keys:", Object.keys(localStorage));
    console.log(`Hex Key (${HEX_KEY}):`, localStorage.getItem(HEX_KEY));
    console.log(`Knot Key (${KNOT_KEY}):`, localStorage.getItem(KNOT_KEY));
    console.log(`Routine Key (${ROUTINE_KEY}):`, localStorage.getItem(ROUTINE_KEY));
    console.log(`Registry Key (${REGISTRY_KEY}):`, localStorage.getItem(REGISTRY_KEY));
    console.log("=== END DEBUG ===");
}

let state = loadState();

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

function byId(id){
    const el = document.getElementById(id);
    if(!el) console.warn("OPERATOR REGISTRY — element #" + id + " not found");
    return el;
}

function on(id, evt, handler){
    const el = byId(id);
    if(el) el.addEventListener(evt, handler);
    return el;
}

// ===== RENDER FUNCTIONS =====

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
    } catch(err){
        console.error("OPERATOR REGISTRY — renderReadings failed", err);
    }
}

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

function renderInventory(){
    const container = byId("inventoryContainer");
    if(!container) return;
    
    // Debug: Check what's in localStorage
    debugLocalStorage();
    
    // Load cards from all three sources
    const hexCards = loadCards(HEX_KEY);
    const knotCards = loadCards(KNOT_KEY);
    const routineCards = loadCards(ROUTINE_KEY);
    
    console.log(`📦 Hex cards: ${hexCards.length}, Knot cards: ${knotCards.length}, Routine cards: ${routineCards.length}`);
    
    // Calculate total used slots
    const totalSlots = hexCards.length + knotCards.length + routineCards.length;
    state.capacity.used = totalSlots;
    const capUsedEl = byId("capUsed");
    if(capUsedEl) capUsedEl.value = totalSlots;
    renderCapacity();
    saveState();
    
    let html = '';
    
    // Hex Cards
    if(hexCards.length > 0){
        html += `<div class="inventory-section"><h3>Hex Cards (${hexCards.length})</h3><div class="card-grid">`;
        hexCards.forEach(card => {
            const details = card.rolls ? 
                card.rolls.map(r => `${r.label}: ${r.name}`).join(' · ') : 
                (card.description || '');
            html += `
                <div class="card-item" data-type="hex" data-id="${card.id}">
                    <div class="card-header">
                        <span class="card-name">${card.name || 'Unnamed Hex'}</span>
                        <button class="remove-card-btn" data-type="hex" data-id="${card.id}">✕</button>
                    </div>
                    <div class="card-details">
                        ${card.code ? `<div class="card-tag">${card.code}</div>` : ''}
                        ${details ? `<div class="card-desc">${details}</div>` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    
    // Knot Cards
    if(knotCards.length > 0){
        html += `<div class="inventory-section"><h3>Knot Cards (${knotCards.length})</h3><div class="card-grid">`;
        knotCards.forEach(card => {
            html += `
                <div class="card-item" data-type="knot" data-id="${card.id}">
                    <div class="card-header">
                        <span class="card-name">${card.name || 'Unnamed Knot'}</span>
                        <button class="remove-card-btn" data-type="knot" data-id="${card.id}">✕</button>
                    </div>
                    <div class="card-details">
                        ${card.output ? `<div class="card-desc">${card.output}</div>` : ''}
                        ${card.noise ? `<div class="card-desc noise">${card.noise}</div>` : ''}
                        ${card.type ? `<div class="card-tag">${card.type.toUpperCase()}</div>` : ''}
                        ${card.d ? `<div class="card-tag">D${card.d}</div>` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    
    // Routine Cards
    if(routineCards.length > 0){
        html += `<div class="inventory-section"><h3>Routine Cards (${routineCards.length})</h3><div class="card-grid">`;
        routineCards.forEach(card => {
            html += `
                <div class="card-item" data-type="routine" data-id="${card.id}">
                    <div class="card-header">
                        <span class="card-name">${card.callsign || card.name || 'Unnamed Routine'}</span>
                        <button class="remove-card-btn" data-type="routine" data-id="${card.id}">✕</button>
                    </div>
                    <div class="card-details">
                        ${card.code ? `<div class="card-tag">${card.code}</div>` : ''}
                        ${card.sequence ? `<div class="card-desc">${card.sequence.join(' → ')}</div>` : ''}
                        ${card.size ? `<div class="card-tag">${card.size}U</div>` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    
    if(!hexCards.length && !knotCards.length && !routineCards.length){
        html = `<div class="empty-inventory">No cards in inventory. Create cards on their respective pages.</div>`;
    }
    
    container.innerHTML = html;
    
    // Add event listeners to remove buttons
    container.querySelectorAll('.remove-card-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const type = this.dataset.type;
            const id = this.dataset.id;
            let key;
            switch(type){
                case 'hex': key = HEX_KEY; break;
                case 'knot': key = KNOT_KEY; break;
                case 'routine': key = ROUTINE_KEY; break;
                default: return;
            }
            if(confirm(`Remove this ${type} card from inventory?`)){
                deleteCard(key, id);
                renderInventory();
                renderCapacity();
            }
        });
    });
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

// ===== BIND FUNCTIONS =====

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

function bindCapacityInputs(){
    [["capBaseline","baseline"],["capExpanded","expanded"]].forEach(([id, key]) => {
        const el = byId(id);
        if(!el) return;
        const handler = (e) => {
            state.capacity[key] = Number(e.target.value) || 0;
            renderCapacity();
            renderInventory();
            saveState();
        };
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);
    });
}

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
    console.log("OPERATOR REGISTRY ONLINE — BUILD 2026-08-04-d");
    
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
            renderInventory();
            renderProcedures();
            saveState();
        });
    } catch(err){
        console.error("OPERATOR REGISTRY — reset binding failed", err);
    }
    
    renderReadings();
    renderCapacity();
    renderInventory();
    renderProcedures();
    
    window.addEventListener('storage', (e) => {
        if(e.key === HEX_KEY || e.key === KNOT_KEY || e.key === ROUTINE_KEY){
            renderInventory();
            renderCapacity();
        }
    });
});

console.log("OPERATOR REGISTRY LOADED — Inventory management active");
console.log("READINGS HOLD. PALE ABSORBS. THE FIELD DOES NOT.");
