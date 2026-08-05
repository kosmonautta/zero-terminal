/*

FINETUNING AND KINDLING — NICKING / KINDLING TERMINAL

MATRIX mirrors the Doomer dossier: four rows (1-4) crossed with
four categories (HARD LOCK, RED SHIFT, LOST TRACK, SHADOWBOX).
Each cell holds a Yoke (name, effect, cost) and the Flare it
Kindles into (name, effect, cost) — the pairing is fixed the
moment a Yoke is Nicked, same as the printed page.

FINETUNE rolls 1d4 for Row and 1d4 for Category, but the roll
itself is never shown as a bare number — the terminal reads it
back as noise collapsing across a signal field until one Yoke
cuts through clean. That resolved card is the only thing that
ever appears; there is no intermediate gallery of near-misses.

Cards persist to localStorage under YOKE_KEY / FLARE_KEY so
operator-registry.js can read an operator's held Yokes and Flares
independently of this page.

Lifecycle:
  Nicked   -> FINETUNE cuts a Yoke card. Stored in YOKE_KEY.
  Fixed    -> "FIX" flips the Yoke card to its spent (black) face.
              Still in YOKE_KEY, still occupies its slot.
  Kindled  -> "KINDLE" on a Fixed Yoke burns it through the pyre
              interface. The Yoke card is removed from YOKE_KEY;
              a Flare card is added to FLARE_KEY.
  Fixed    -> "FIX" on a Flare card pays its cost and the card is
              removed from FLARE_KEY outright. Nothing is left.

*/

const YOKE_KEY = "yokeCards";
const FLARE_KEY = "flareCards";

const CATEGORIES = ["HARD LOCK", "RED SHIFT", "LOST TRACK", "SHADOWBOX"];

const MATRIX = {
    1: {
        "HARD LOCK": {
            yoke: { name: "FALLOW", effect: "Choose an area nearby. Everyone inside takes a HEAVY FRM Hit and is hurled to just outside its edge.", cost: "HAZE FRM Hit to you, or knocked prone — the Lock doesn't spare the hand that pulled it." },
            flare: { name: "BLACK FALLOW", effect: "The chosen area is erased outright; everyone inside takes a HYPER FRM Hit instead.", cost: "HEAVY FRM Hit to you, no save." }
        },
        "RED SHIFT": {
            yoke: { name: "KERN", effect: "Blink to a point you can see, no reaction provoked. Everything nearby is dragged toward it; anyone caught in the pull takes a HEAVY FRM Hit.", cost: "HAZE NRV Hit — the pull spends your next reaction." },
            flare: { name: "BLACK KERN", effect: "Everything nearby collapses toward the point, HYPER FRM Hit on collision.", cost: "HEAVY NRV Hit — you're at the center same as everyone." }
        },
        "LOST TRACK": {
            yoke: { name: "DREAR", effect: "A pressure wave rolls out from you — every enemy nearby takes a HAZE NRV Hit and is pushed directly away, no traceable source.", cost: "HAZE NRV Hit to you — you don't remember casting it until someone tells you." },
            flare: { name: "DEEP DREAR", effect: "HEAVY NRV Hit, everyone thrown well clear of you, still no visible cause.", cost: "HEAVY NRV Hit — you lose the whole exchange, not just the cast." }
        },
        "SHADOWBOX": {
            yoke: { name: "FEN", effect: "Split off a shade double of a target in sight. Anyone who strikes it lands the Hit — HAZE FRM — on the real target instead, wherever they are.", cost: "HAZE FRM Hit to you when the binding is cut, by time or by force." },
            flare: { name: "BLACK FEN", effect: "The shade holds for the rest of the scene; anyone can strike it to land a HEAVY FRM Hit on the real target from anywhere.", cost: "HEAVY FRM Hit to you if it's ever destroyed early." }
        }
    },
    2: {
        "HARD LOCK": {
            yoke: { name: "BOLT", effect: "Accelerate your own mass, close the distance to any visible enemy instantly, and slam into them for a HEAVY FRM Hit; they're hurled clear.", cost: "HAZE FRM Hit to you on landing — you're still the thing that just got fired." },
            flare: { name: "DEAD BOLT", effect: "Ram every visible enemy in sequence, one HEAVY FRM Hit each, before the round ends.", cost: "HEAVY FRM Hit to you once the sequence stops." }
        },
        "RED SHIFT": {
            yoke: { name: "WOLD", effect: "Swap positions with any creature in sight, any distance, no reaction provoked either way.", cost: "HAZE NRV Hit — you're the one who has to reassemble first." },
            flare: { name: "DEAD WOLD", effect: "Place every creature anywhere you choose within sight, no reactions provoked anywhere.", cost: "HEAVY NRV Hit — your own landing spot isn't yours to pick." }
        },
        "LOST TRACK": {
            yoke: { name: "FORLORN", effect: "Remove a target entirely until the start of their next turn, then place them anywhere you choose.", cost: "HAZE NRV Hit — allies can't reach you for aid during that span." },
            flare: { name: "LAST FORLORN", effect: "Every enemy banished until the end of the scene, then redistributed by the Static.", cost: "HEAVY NRV Hit — you're off the grid the same span." }
        },
        "SHADOWBOX": {
            yoke: { name: "GLOOM", effect: "Split off a shade double where you stand; you may immediately move anywhere nearby. Attacks against \u201cyou\u201d this exchange strike the double.", cost: "HAZE NRV Hit if the double is destroyed before your next turn." },
            flare: { name: "TOTAL GLOOM", effect: "Every ally gets a shade for the round; the field fills with echoes enemies can't sort from real.", cost: "HEAVY NRV Hit to you if your own double falls." }
        }
    },
    3: {
        "HARD LOCK": {
            yoke: { name: "WANE", effect: "Reach into a target's near future and detonate it early — their next HAZE Hit lands as HEAVY, or their next HEAVY Hit lands as HYPER.", cost: "The same escalation is loaded on you — your next Hit taken escalates one step, whenever it lands." },
            flare: { name: "FINAL WANE", effect: "Every Hit, from anyone, escalates one tier for the rest of the scene. Once this scene, rewrite a Hit that already landed a tier worse.", cost: "The escalation applies to you too, permanently, and the rewrite can be turned back on a Hit you already took." }
        },
        "RED SHIFT": {
            yoke: { name: "WITHER", effect: "Blink to touch or target a creature, no reaction provoked, then mark them: every Hit they take before your next turn is increased one tier.", cost: "HAZE NRV Hit to you the instant the mark lands." },
            flare: { name: "TRUE WITHER", effect: "Every Hit inflicted for the rest of the scene is upgraded one tier.", cost: "HEAVY NRV Hit, permanently in effect on you too." }
        },
        "LOST TRACK": {
            yoke: { name: "ORDEAL", effect: "Force BRN, NRV, and FRM tests on a target. Each failure is a HAZE Hit to the matching Attribute.", cost: "You take the same three tests, hidden from you until they resolve." },
            flare: { name: "FINAL ORDEAL", effect: "Every enemy takes all three HAZE tests before further tests can escalate them.", cost: "You take them too, unwarned." }
        },
        "SHADOWBOX": {
            yoke: { name: "GRIM", effect: "Bind a target to a shade double only you can see and strike. Your next Hit against the double lands on them instead, undefended.", cost: "HAZE Hit (BRN) — your next attack roll against anyone else suffers." },
            flare: { name: "GRIM HOUR", effect: "The bound double takes every Hit you land for the rest of the scene, all undefended.", cost: "The link is permanent this fight — whatever finally destroys the double reaches back to you too, full severity." }
        }
    },
    4: {
        "HARD LOCK": {
            yoke: { name: "SUNDER", effect: "A line cuts through everyone standing between two points you choose. Everything it crosses takes a HEAVY Hit (Attribute of your choice) and is knocked aside.", cost: "HAZE Hit, same Attribute, to you." },
            flare: { name: "GREAT SUNDER", effect: "The fault becomes a wall for the rest of the scene; crossing it costs a HYPER Hit.", cost: "You don't choose which side you're on when it closes." }
        },
        "RED SHIFT": {
            yoke: { name: "RIVEN", effect: "Open two linked fractures that stay open for the rest of the scene. Anything entering one exits the other at full speed, no reaction provoked.", cost: "HAZE FRM Hit to you the first time each scene it's used." },
            flare: { name: "OPEN RIVEN", effect: "Anyone crossing the breach can be redirected anywhere visible, any time, for the rest of the scene.", cost: "HEAVY FRM Hit if the Static redirects you through it instead." }
        },
        "LOST TRACK": {
            yoke: { name: "CINDER", effect: "Detonate every anomaly or hazard clinging near a target — everyone close to them takes a HEAVY FRM Hit, no identifiable epicenter.", cost: "HAZE FRM Hit to you, untraceable for the rest of the scene." },
            flare: { name: "CINDER RAIN", effect: "The area around every combatant becomes hazardous for the rest of the scene; ending a turn anywhere costs a HAZE FRM Hit.", cost: "Including wherever you're standing, always." }
        },
        "SHADOWBOX": {
            yoke: { name: "BLIGHT", effect: "Seed shade motes on everyone you choose. Your next offensive working relays through their mote onto them too.", cost: "You're wearing a mote too — there's a real chance your own next casting relays back onto you." },
            flare: { name: "DEEP BLIGHT", effect: "Every casting for the rest of the scene relays through a mote onto another bound target automatically.", cost: "Permanent exposure — your own mote is always live too." }
        }
    }
};

const noiseChars = [
    "░","▒","▓","█","▀","▄","▌","▐","▖","▗","▘","▝","▚","▞",
    "■","□","▪","▫","◆","◇","▲","△","▼","▽","●","○",
    "─","│","┼","┤","├","┬","┴","╬","╫","╪",
    "⠿","⠶","⠛","⠹","⠭","⠽","⠾","⠷",
    "#","%","&","*","/","\\","~","^"
];
const emberChars = ["△","▲","♦","✦","✧","*","'","\"","~","·","°","∴","×","+"];

let yokeCards = [];
let flareCards = [];
let cardCounter = 0;
let flareCounter = 0;
let cutting = false;
let kindlingId = null;
let fieldResolved = false;
let ambientTimer = null;
const CUT_THRESHOLD = 10; // blade gap %, at or below which the signal cuts

// ===== persistence =====

function loadCards(key){
    try{
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch(err){
        console.error("Failed to load " + key, err);
        return [];
    }
}

function saveCards(key, cards){
    try{
        window.localStorage.setItem(key, JSON.stringify(cards));
    } catch(err){
        console.error("Failed to save " + key, err);
    }
}

function saveYokes(){ saveCards(YOKE_KEY, yokeCards); }
function saveFlares(){ saveCards(FLARE_KEY, flareCards); }

// ===== noise helpers =====

function noiseGlyph(pool){
    return pool[Math.floor(Math.random() * pool.length)];
}

function noiseLine(len, pool){
    let out = "";
    for(let i = 0; i < len; i++){
        const opacity = (0.2 + Math.random() * 0.8).toFixed(2);
        out += `<span style="opacity:${opacity}">${noiseGlyph(pool)}</span>`;
    }
    return out;
}

function noiseBlock(rows, cols, pool){
    let html = "";
    for(let r = 0; r < rows; r++){
        html += `<div class="noise-row">${noiseLine(cols, pool)}</div>`;
    }
    return html;
}

// ===== log =====

function addLog(text){
    const panel = document.getElementById("logPanel");
    const empty = panel.querySelector(".log-empty");
    if(empty) empty.remove();
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<span class="le-tag">&gt;&gt;</span>${text}`;
    panel.prepend(entry);
}

// ===== stats =====

function updateStats(){
    document.getElementById("statNicked").textContent = yokeCards.length;
    document.getElementById("statFixed").textContent = yokeCards.filter(c => c.fixed).length;
    document.getElementById("statFlares").textContent = flareCards.length;
}

// ===== ambient noise — the field is never quiet =====

function startAmbientNoise(){
    if(ambientTimer) return;
    ambientTimer = setInterval(() => {
        if(fieldResolved || cutting) return;
        const layer = document.getElementById("noiseLayer");
        if(layer) layer.innerHTML = noiseBlock(9, 34, noiseChars);
    }, 130);
}

// ===== blade pair — drag them together to cut the signal =====

function updateBladeVisual(){
    if(fieldResolved || cutting) return;
    const leftEl = document.getElementById("bladeLeft");
    const rightEl = document.getElementById("bladeRight");
    const left = Number(leftEl.value);
    const right = Number(rightEl.value);

    // keep the blades from crossing outright
    if(right < left + 2){
        rightEl.value = Math.min(100, left + 2);
    }

    const l = Number(leftEl.value);
    const r = Number(rightEl.value);
    document.getElementById("bladeLineLeft").style.left = l + "%";
    document.getElementById("bladeLineRight").style.left = r + "%";
    const gap = r - l;

    document.getElementById("signalStatus").textContent = gap <= CUT_THRESHOLD
        ? "STATUS: BLADES CLOSING — SIGNAL ABOUT TO CUT"
        : `STATUS: DRIFTING — GAP ${Math.max(gap, 0).toFixed(0)}%`;

    if(gap <= CUT_THRESHOLD){
        resolveCut();
    }
}

// ===== resolve — cut a Yoke out of the field =====

function resolveCut(){
    if(cutting || fieldResolved) return;
    cutting = true;
    document.getElementById("finetuneBtn").disabled = true;
    document.getElementById("bladeLeft").disabled = true;
    document.getElementById("bladeRight").disabled = true;
    document.getElementById("signalStatus").textContent = "STATUS: CUTTING SIGNAL — ROW / CATEGORY UNRESOLVED";
    addLog("FINETUNING INITIATED — FORCING ROW AND CATEGORY AGAINST THE STATIC.");

    const field = document.getElementById("signalField");
    field.classList.add("live");

    // one last burst of noise, faster, before it commits
    let burst = 0;
    const flicker = setInterval(() => {
        burst++;
        const layer = document.getElementById("noiseLayer");
        if(layer) layer.innerHTML = noiseBlock(9, 34, noiseChars);
    }, 40);

    setTimeout(() => {
        clearInterval(flicker);
        const row = 1 + Math.floor(Math.random() * 4);
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const pair = MATRIX[row][category];

        cardCounter++;
        const card = {
            id: "yoke" + Date.now() + "_" + cardCounter,
            row, category,
            name: pair.yoke.name,
            effect: pair.yoke.effect,
            cost: pair.yoke.cost,
            fixed: false
        };
        yokeCards.push(card);
        saveYokes();

        fieldResolved = true;
        field.classList.remove("live");
        field.classList.add("resolved");
        document.getElementById("noiseLayer").innerHTML = "";
        document.getElementById("bladeLineLeft").style.display = "none";
        document.getElementById("bladeLineRight").style.display = "none";
        document.getElementById("resolvedLayer").innerHTML = renderYokeCardHTML(card, true);
        document.getElementById("signalStatus").textContent = `STATUS: SIGNAL CUT — ${card.row} / ${card.category}`;
        document.getElementById("resetSignalBtn").style.display = "inline-block";
        addLog(`YOKE NICKED — ${card.name} (${card.row} / ${card.category}).`);

        cutting = false;
        renderGrids();
    }, 550);
}

function resetSignalField(){
    fieldResolved = false;
    cutting = false;
    const field = document.getElementById("signalField");
    field.classList.remove("resolved", "live");
    document.getElementById("resolvedLayer").innerHTML = "";
    document.getElementById("bladeLineLeft").style.display = "block";
    document.getElementById("bladeLineRight").style.display = "block";
    document.getElementById("bladeLeft").disabled = false;
    document.getElementById("bladeRight").disabled = false;
    document.getElementById("bladeLeft").value = 8;
    document.getElementById("bladeRight").value = 92;
    document.getElementById("finetuneBtn").disabled = false;
    document.getElementById("resetSignalBtn").style.display = "none";
    document.getElementById("signalStatus").textContent = "STATUS: DRIFTING — AWAITING BLADES";
    updateBladeVisual();
}

// ===== card markup =====

function renderYokeCardHTML(card, justCut){
    const fixedClass = card.fixed ? " fixed" : "";
    const cutClass = justCut ? " just-cut" : "";
    return `
        <div class="op-card yoke-card${fixedClass}${cutClass}" data-id="${card.id}">
            <div class="oc-coord">${card.row} / ${card.category}</div>
            <div class="oc-name">${card.name}</div>
            <div class="oc-field"><span class="oc-label">Effect</span>${card.effect}</div>
            <div class="oc-field"><span class="oc-label">Cost</span>${card.cost}</div>
            <div class="oc-controls">
                ${card.fixed
                    ? `<button class="btn small" data-act="kindle" data-id="${card.id}">KINDLE</button>`
                    : `<button class="btn small" data-act="fix-yoke" data-id="${card.id}">FIX</button>`}
            </div>
        </div>
    `;
}

function renderFlareCardHTML(card){
    return `
        <div class="op-card flare-card" data-id="${card.id}">
            <div class="oc-coord">${card.row} / ${card.category}</div>
            <div class="oc-name">${card.name}</div>
            <div class="oc-field"><span class="oc-label">Effect</span>${card.effect}</div>
            <div class="oc-field"><span class="oc-label">Cost</span>${card.cost}</div>
            <div class="oc-controls">
                <button class="btn small" data-act="fix-flare" data-id="${card.id}">FIX</button>
            </div>
        </div>
    `;
}

// ===== grids =====

function renderGrids(){
    const yokeGrid = document.getElementById("yokeGrid");
    const flareGrid = document.getElementById("flareGrid");

    if(yokeCards.length === 0){
        yokeGrid.innerHTML = '<div class="grid-empty">NO YOKES ON FILE — FINETUNE TO NICK ONE</div>';
    } else {
        yokeGrid.innerHTML = yokeCards.map(c => renderYokeCardHTML(c, false)).join("");
    }

    if(flareCards.length === 0){
        flareGrid.innerHTML = '<div class="grid-empty">NO FLARES BURNED YET</div>';
    } else {
        flareGrid.innerHTML = flareCards.map(c => renderFlareCardHTML(c)).join("");
    }

    updateStats();
    bindCardEvents();
}

function bindCardEvents(){
    document.querySelectorAll('[data-act="fix-yoke"]').forEach(btn => {
        btn.addEventListener("click", () => fixYoke(btn.dataset.id));
    });
    document.querySelectorAll('[data-act="kindle"]').forEach(btn => {
        btn.addEventListener("click", () => startKindle(btn.dataset.id));
    });
    document.querySelectorAll('[data-act="fix-flare"]').forEach(btn => {
        btn.addEventListener("click", () => fixFlare(btn.dataset.id));
    });
}

// ===== FIX (yoke) =====

function fixYoke(id){
    const card = yokeCards.find(c => c.id === id);
    if(!card || card.fixed) return;
    card.fixed = true;
    saveYokes();
    addLog(`YOKE FIXED — ${card.name} SPENT. AVAILABLE TO KINDLE.`);
    renderGrids();
}

// ===== KINDLE — the pyre =====

function startKindle(id){
    if(kindlingId) return;
    const card = yokeCards.find(c => c.id === id);
    if(!card || !card.fixed) return;
    kindlingId = id;

    const pyre = document.getElementById("pyreField");
    const pyreWrap = document.getElementById("pyreWrap");
    pyreWrap.classList.add("active");
    pyre.classList.add("burning");
    pyre.innerHTML = noiseBlock(9, 34, emberChars);
    document.getElementById("pyreStatus").textContent = `STATUS: KINDLING ${card.name} — DRIVING PAST THRESHOLD`;
    addLog(`KINDLING INITIATED — ${card.name} DRIVEN INTO OVERDRIVE.`);

    let tick = 0;
    const flicker = setInterval(() => {
        tick++;
        pyre.innerHTML = noiseBlock(9, 34, tick % 3 === 0 ? noiseChars : emberChars);
        pyre.style.filter = `brightness(${0.7 + Math.random() * 0.9}) contrast(${1 + Math.random() * 0.6})`;
    }, 45);

    setTimeout(() => {
        clearInterval(flicker);
        pyre.style.filter = "none";

        const pair = MATRIX[card.row][card.category];
        flareCounter++;
        const flare = {
            id: "flare" + Date.now() + "_" + flareCounter,
            row: card.row,
            category: card.category,
            name: pair.flare.name,
            effect: pair.flare.effect,
            cost: pair.flare.cost,
            fromYokeId: card.id
        };
        flareCards.push(flare);
        saveFlares();

        yokeCards = yokeCards.filter(c => c.id !== id);
        saveYokes();

        pyre.classList.remove("burning");
        pyre.classList.add("resolved");
        pyre.innerHTML = renderFlareCardHTML(flare);
        document.getElementById("pyreStatus").textContent = `STATUS: KINDLED — ${flare.name} BURNED CLEAR`;
        addLog(`FLARE KINDLED — ${flare.name} (${flare.row} / ${flare.category}). YOKE SPENT.`);

        kindlingId = null;
        renderGrids();

        setTimeout(() => {
            pyreWrap.classList.remove("active");
            pyre.classList.remove("resolved");
            pyre.innerHTML = "";
        }, 2400);
    }, 1400);
}

// ===== FIX (flare) — pays cost, card is gone =====

function fixFlare(id){
    const card = flareCards.find(c => c.id === id);
    if(!card) return;
    flareCards = flareCards.filter(c => c.id !== id);
    saveFlares();
    addLog(`FLARE FIXED — ${card.name} RESOLVED. COST PAID IN FULL. NOTHING REMAINS.`);
    renderGrids();
}

// ===== init =====

document.addEventListener("DOMContentLoaded", () => {
    yokeCards = loadCards(YOKE_KEY);
    flareCards = loadCards(FLARE_KEY);
    renderGrids();

    startAmbientNoise();
    document.getElementById("bladeLeft").addEventListener("input", updateBladeVisual);
    document.getElementById("bladeRight").addEventListener("input", updateBladeVisual);
    updateBladeVisual();

    document.getElementById("finetuneBtn").addEventListener("click", resolveCut);
    document.getElementById("resetSignalBtn").addEventListener("click", resetSignalField);
});

console.log("FINETUNING AND KINDLING TERMINAL ONLINE");
console.log("CUT THE SIGNAL. FEED THE PYRE.");
