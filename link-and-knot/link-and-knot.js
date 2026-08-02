/*

LINK AND KNOT — STABILITY TERMINAL

CORE_KNOTS and BROKEN_KNOTS mirror the Ultrabrief reference tables.
Each entry carries a "shift" — how far, and in which direction, the
Link moves along the -3..+3 axis when that knot is Hewed. Negative
shift pulls toward the Break Band, positive pulls toward the Keen
Band. Most entries use the table's default (Core: +1, Broken: -1);
entries that state their own movement in the source text carry that
value instead (Quickened: -1, Dampen: +1, Overclock: -2, Ghost
Fault: -3).

LINK STATE is a single integer clamped to [-3, 3], plus a running
inventory of held (Hewed, not yet Fixed) knots and a session log.

*/

const CORE_KNOTS = [
    { d: 1,  name: "Replay",     output: "Repeat the hit on the same target at one tier lower.", shift: 1 },
    { d: 2,  name: "Delay",      output: "Resolve next turn at one tier higher.", shift: 1 },
    { d: 3,  name: "Split",      output: "Divide into 2 targets, each takes damage at one tier lower.", shift: 1 },
    { d: 4,  name: "Focus",      output: "Increase damage one tier.", shift: 1 },
    { d: 5,  name: "Extend",     output: "Double reach; cannot increase tier this turn.", shift: 1 },
    { d: 6,  name: "Bore",       output: "Ignore half the Pale.", shift: 1 },
    { d: 7,  name: "Mark Chain", output: "If target was hit this turn → increase damage one tier.", shift: 1 },
    { d: 8,  name: "Quickened",  output: "Resolve hit twice at the same tier.", shift: -1 },
    { d: 9,  name: "Anchor",     output: "Target cannot move until your next turn.", shift: 1 },
    { d: 10, name: "Dampen",     output: "Decrease damage one tier.", shift: 1 },
    { d: 11, name: "Sweep",      output: "All targets in an area take damage at the lowest tier.", shift: 1 },
    { d: 12, name: "Silent",     output: "Undetectable, no damage tier change.", shift: 1 }
];

const BROKEN_KNOTS = [
    { d: 1,  name: "Over-Replay",    output: "Repeat the hit on the same target at the same tier.", noise: "HAZE HIT to linked Reading.", shift: -1 },
    { d: 2,  name: "Slip Delay",     output: "Resolve next turn at one tier higher; cannot be reacted to.", noise: "HAZE HIT to linked Reading.", shift: -1 },
    { d: 3,  name: "Fracture Split", output: "Split into 3 targets, all take damage one tier lower.", noise: "HAZE HIT to linked Reading.", shift: -1 },
    { d: 4,  name: "Overfocus",      output: "Increase damage two tiers (capped at HYPER HIT).", noise: "HARD HIT to linked Reading.", shift: -1 },
    { d: 5,  name: "Overextend",     output: "Triple reach at one tier higher.", noise: "Next hit against you is one tier higher.", shift: -1 },
    { d: 6,  name: "Hollow Bore",    output: "Ignore the Pale; one tier higher.", noise: "HARD HIT to linked Reading.", shift: -1 },
    { d: 7,  name: "Cascade Mark",   output: "Next hit on target at two tiers higher.", noise: "If unused next turn → HYPER HIT to linked Reading.", shift: -1 },
    { d: 8,  name: "Overclock",      output: "Resolve hit twice at one tier higher.", noise: "Skip next turn + HAZE HIT to linked Reading.", shift: -2 },
    { d: 9,  name: "Lingering Tear", output: "Deal damage over time (next two turns); decaying tier.", noise: "HAZE HIT to linked Reading every turn your damage lingers.", shift: -1 },
    { d: 10, name: "Rend",           output: "Target cannot move or take any actions until your next turn.", noise: "HARD HIT to linked Reading; movement halved next turn.", shift: -1 },
    { d: 11, name: "Wide Sweep",     output: "All targets in an area take damage one tier higher.", noise: "Includes unintended targets.", shift: -1 },
    { d: 12, name: "Ghost Fault",    output: "Unavoidable; at the highest tier.", noise: "HYPER HIT to linked Reading.", shift: -3 }
];

let linkValue = 0;
let inventory = [];      // held knots: { uid, type, d, name, output, noise, shift }
let hewedCount = 0;
let logEntries = [];     // { text, cls }
let uidCounter = 0;

const glitchAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-—";

function scramble(text){
    return text
        .split("")
        .map(c => (c === " " ? c : (Math.random() < 0.55 ? glitchAlphabet[Math.floor(Math.random() * glitchAlphabet.length)] : c)))
        .join("");
}

let glitchTimer = null;

function revealText(el, finalText){
    if(glitchTimer) clearTimeout(glitchTimer);
    el.classList.add("shake");
    let frame = 0;
    function step(){
        if(frame < 3){
            el.textContent = finalText === "" ? "" : scramble(finalText);
            frame++;
            glitchTimer = setTimeout(step, 40);
        } else {
            el.textContent = finalText;
            el.classList.remove("shake");
        }
    }
    step();
}

function clamp(v){
    return Math.max(-3, Math.min(3, v));
}

function bandLabel(v){
    if(v === 3) return { name: "LOCK", sub: "LINK RIGID · BROKEN KNOTS SUPPRESSED · REACH DIES", cls: "lock" };
    if(v === -3) return { name: "RUPTURE", sub: "FORCED BACKLASH · EFFECTS OVERFIRE OR MISROUTE", cls: "rupture" };
    if(v > 0) return { name: "KEEN BAND", sub: "STABLE · PRECISE · LOW COLLATERAL", cls: "keen" };
    if(v < 0) return { name: "BREAK BAND", sub: "UNSTABLE · OUTPUT SPIKES · COST BUILDS", cls: "break" };
    return { name: "ZERO", sub: "EQUILIBRIUM · NO MODIFIERS", cls: "zero" };
}

// ---------- rendering ----------

function renderAxis(){
    const track = document.getElementById("axisTrack");
    track.innerHTML = "";
    for(let v = -3; v <= 3; v++){
        const cell = document.createElement("div");
        cell.className = "axis-cell";
        if(v === 0) cell.classList.add("zero-col");
        if(v === linkValue) cell.classList.add("current");
        let tag = "";
        if(v === 3) tag = "LOCK";
        else if(v === -3) tag = "RUPTURE";
        else if(v === 0) tag = "ZERO";
        cell.innerHTML = (v > 0 ? "+" + v : v) + (tag ? `<span class="cell-tag">${tag}</span>` : "");
        track.appendChild(cell);
    }
}

function renderBandReadout(){
    const wrap = document.getElementById("bandReadout");
    const statusEl = document.getElementById("brStatus");
    const nameEl = document.getElementById("brName");
    const subEl = document.getElementById("brSub");

    const band = bandLabel(linkValue);

    wrap.classList.remove("flag-lock", "flag-rupture");
    if(band.cls === "lock") wrap.classList.add("flag-lock");
    if(band.cls === "rupture") wrap.classList.add("flag-rupture");

    statusEl.textContent = "STATUS: LINK AT " + (linkValue > 0 ? "+" + linkValue : linkValue);
    revealText(nameEl, band.name);
    subEl.textContent = band.sub;
}

function renderStats(){
    document.getElementById("statValue").textContent = linkValue > 0 ? "+" + linkValue : String(linkValue);
    document.getElementById("statHeld").textContent = inventory.length;
    document.getElementById("statHewed").textContent = hewedCount;
}

function renderInventory(){
    const grid = document.getElementById("invGrid");
    grid.innerHTML = "";

    if(inventory.length === 0){
        grid.innerHTML = '<div class="inv-empty">NO KNOTS HELD</div>';
        return;
    }

    inventory.forEach(k => {
        const card = document.createElement("div");
        card.className = "knot-card" + (k.type === "broken" ? " broken" : "");
        card.innerHTML = `
            <div>
                <div class="kc-tag">${k.type === "broken" ? "BROKEN" : "CORE"} · D12:${k.d}</div>
                <div class="kc-name">${k.name}</div>
                <div class="kc-output">${k.output}${k.noise ? "<br>NOISE: " + k.noise : ""}</div>
            </div>
            <button class="btn small kc-fix" type="button">FIX (SPEND)</button>
        `;
        card.querySelector(".kc-fix").addEventListener("click", () => {
            inventory = inventory.filter(x => x.uid !== k.uid);
            addLog(`FIXED — ${k.name.toUpperCase()} SPENT AND REMOVED FROM INVENTORY.`, "");
            renderAll();
        });
        grid.appendChild(card);
    });
}

function renderLog(){
    const panel = document.getElementById("logPanel");
    panel.innerHTML = "";

    if(logEntries.length === 0){
        panel.innerHTML = '<div class="log-empty">NO ACTIVITY LOGGED</div>';
        return;
    }

    // most recent first
    for(let i = logEntries.length - 1; i >= 0; i--){
        const entry = logEntries[i];
        const row = document.createElement("div");
        row.className = "log-entry" + (entry.cls ? " " + entry.cls : "");
        row.innerHTML = `<span class="le-tag">[${String(i + 1).padStart(2, "0")}]</span>${entry.text}`;
        panel.appendChild(row);
    }
}

function addLog(text, cls){
    logEntries.push({ text, cls: cls || "" });
}

function renderReferenceTables(){
    const coreBody = document.getElementById("coreRefBody");
    coreBody.innerHTML = CORE_KNOTS.map(k => `
        <tr><td>${k.d}</td><td>${k.name}</td><td>${k.output}</td><td>${k.shift > 0 ? "+" + k.shift : k.shift} (KEEN)</td></tr>
    `).join("");

    const brokenBody = document.getElementById("brokenRefBody");
    brokenBody.innerHTML = BROKEN_KNOTS.map(k => `
        <tr><td>${k.d}</td><td>${k.name}</td><td>${k.output}</td><td>${k.noise}</td><td>${k.shift} (BREAK)</td></tr>
    `).join("");
}

function renderAll(){
    renderAxis();
    renderBandReadout();
    renderStats();
    renderInventory();
    renderLog();
    updateControlAvailability();
}

function updateControlAvailability(){
    document.getElementById("hewBrokenBtn").disabled = (linkValue === 3);
    document.getElementById("nudgePlusBtn").disabled = (linkValue === 3);
    document.getElementById("nudgeMinusBtn").disabled = (linkValue === -3);
    document.getElementById("driftBtn").disabled = (linkValue === 0);
}

// ---------- roll result panel ----------

function showResult(statusText, nameText, bodyHtml, subText){
    document.getElementById("resultStatus").textContent = statusText;
    revealText(document.getElementById("resultName"), nameText);
    document.getElementById("resultBody").innerHTML = bodyHtml;
    document.getElementById("resultSub").textContent = subText;
}

// ---------- actions ----------

function hewKnot(type){

    const table = type === "core" ? CORE_KNOTS : BROKEN_KNOTS;
    const roll = Math.floor(Math.random() * 12) + 1;
    const knot = table.find(k => k.d === roll);

    // Lock suppresses Broken Knots
    if(type === "broken" && linkValue === 3){
        addLog(`SUPPRESSED — D12:${roll} (${knot.name.toUpperCase()}) BLOCKED. LINK LOCKED AT +3.`, "suppressed");
        showResult(
            "STATUS: BROKEN KNOT SUPPRESSED",
            "LOCK",
            `<p>The link is rigid. <strong>${knot.name}</strong> (d12:${roll}) failed to take hold.</p>`,
            "NO KNOT ADDED · NO LINK SHIFT"
        );
        renderAll();
        return;
    }

    hewedCount++;

    const before = linkValue;
    linkValue = clamp(linkValue + knot.shift);
    const after = linkValue;

    const uid = "k" + (++uidCounter);
    inventory.push({ uid, type, d: roll, name: knot.name, output: knot.output, noise: knot.noise, shift: knot.shift });

    let flagCls = "";
    let flagNote = "";
    if(after === 3 && before !== 3){
        flagCls = "lock";
        flagNote = " LINK REACHES LOCK (+3).";
    } else if(after === -3 && before !== -3){
        flagCls = "rupture";
        flagNote = " LINK REACHES RUPTURE (−3).";
    }

    const shiftStr = knot.shift > 0 ? "+" + knot.shift : String(knot.shift);
    addLog(
        `HEWED ${type === "core" ? "CORE" : "BROKEN"} — D12:${roll} ${knot.name.toUpperCase()} — LINK ${shiftStr} → ${before > 0 ? "+" + before : before} to ${after > 0 ? "+" + after : after}.${flagNote}`,
        flagCls
    );

    const bodyHtml = `
        <p>${knot.output}</p>
        ${knot.noise ? `<p class="noise-line">NOISE: ${knot.noise}</p>` : ""}
    `;

    showResult(
        `STATUS: ${type === "core" ? "CORE" : "BROKEN"} KNOT HEWED — D12:${roll}`,
        knot.name.toUpperCase(),
        bodyHtml,
        `LINK SHIFT ${shiftStr} · NOW AT ${after > 0 ? "+" + after : after}${flagNote ? " ·" + flagNote : ""}`
    );

    renderAll();

}

function driftTowardZero(){
    if(linkValue === 0) return;
    const before = linkValue;
    linkValue = linkValue > 0 ? linkValue - 1 : linkValue + 1;
    addLog(`DRIFT — NO INPUT. LINK DRIFTS TOWARD ZERO: ${before > 0 ? "+" + before : before} → ${linkValue > 0 ? "+" + linkValue : linkValue}.`, "");
    showResult("STATUS: DRIFT APPLIED", "", "", `LINK NOW AT ${linkValue > 0 ? "+" + linkValue : linkValue}`);
    renderAll();
}

function nudge(delta){
    const before = linkValue;
    linkValue = clamp(linkValue + delta);
    if(linkValue === before) return;
    addLog(`MANUAL ADJUST — LINK ${delta > 0 ? "+1" : "−1"}: ${before > 0 ? "+" + before : before} → ${linkValue > 0 ? "+" + linkValue : linkValue}.`, "");
    renderAll();
}

function resetSession(){
    linkValue = 0;
    inventory = [];
    hewedCount = 0;
    logEntries = [];
    showResult("STATUS: IDLE — NO KNOT HEWED", "", "", "");
    addLog("SESSION RESET. LINK RETURNED TO ZERO. INVENTORY CLEARED.", "");
    renderAll();
}

// ---------- init ----------

document.addEventListener("DOMContentLoaded", () => {

    renderReferenceTables();
    renderAll();

    document.getElementById("hewCoreBtn").addEventListener("click", () => hewKnot("core"));
    document.getElementById("hewBrokenBtn").addEventListener("click", () => hewKnot("broken"));
    document.getElementById("driftBtn").addEventListener("click", driftTowardZero);
    document.getElementById("nudgePlusBtn").addEventListener("click", () => nudge(1));
    document.getElementById("nudgeMinusBtn").addEventListener("click", () => nudge(-1));
    document.getElementById("resetBtn").addEventListener("click", resetSession);

});

console.log("LINK AND KNOT TERMINAL ONLINE");
console.log("HEW THE KNOTS. WATCH THE LINK.");
