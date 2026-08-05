// ============================================================
//  BANNING AND KINDLING — terminal logic
//  Mechanic: roll 2d4 against the matrix to Ban a Bale.
//  Atmosphere: layered static (canvas), glitch bursts, cryptic
//  status text, and a chaotic organic Pyre for Kindling.
//
//  NOTE ON STORAGE KEYS: baleCards / dreadCards are kept as the
//  literal localStorage key names (unchanged) so the operator
//  registry page can keep reading them.
// ============================================================

const BALE_KEY = "baleCards";
const DREAD_KEY = "dreadCards";

const CATEGORIES = ["HARD LOCK", "RED SHIFT", "LOST TRACK", "SHADOWBOX"];

const MATRIX = {
    1: {
        "HARD LOCK": {
            bale: { name: "FALLOW", effect: "Choose an area nearby. Everyone inside takes a HEAVY FRM Hit and is hurled to just outside its edge.",
                cost: "HAZE FRM Hit to you, or knocked prone — the Lock doesn't spare the hand that pulled it." },
            dread: { name: "BLACK FALLOW", effect: "The chosen area is erased outright; everyone inside takes a HYPER FRM Hit instead.",
                cost: "HEAVY FRM Hit to you, no save." }
        },
        "RED SHIFT": {
            bale: { name: "KERN", effect: "Blink to a point you can see, no reaction provoked. Everything nearby is dragged toward it; anyone caught in the pull takes a HEAVY FRM Hit.",
                cost: "HAZE NRV Hit — the pull spends your next reaction." },
            dread: { name: "BLACK KERN", effect: "Everything nearby collapses toward the point, HYPER FRM Hit on collision.",
                cost: "HEAVY NRV Hit — you're at the center same as everyone." }
        },
        "LOST TRACK": {
            bale: { name: "DREAR", effect: "A pressure wave rolls out from you — every enemy nearby takes a HAZE NRV Hit and is pushed directly away, no traceable source.",
                cost: "HAZE NRV Hit to you — you don't remember casting it until someone tells you." },
            dread: { name: "DEEP DREAR", effect: "HEAVY NRV Hit, everyone thrown well clear of you, still no visible cause.",
                cost: "HEAVY NRV Hit — you lose the whole exchange, not just the cast." }
        },
        "SHADOWBOX": {
            bale: { name: "FEN", effect: "Split off a shade double of a target in sight. Anyone who strikes it lands the Hit — HAZE FRM — on the real target instead, wherever they are.",
                cost: "HAZE FRM Hit to you when the binding is cut, by time or by force." },
            dread: { name: "BLACK FEN", effect: "The shade holds for the rest of the scene; anyone can strike it to land a HEAVY FRM Hit on the real target from anywhere.",
                cost: "HEAVY FRM Hit to you if it's ever destroyed early." }
        }
    },
    2: {
        "HARD LOCK": {
            bale: { name: "BOLT", effect: "Accelerate your own mass, close the distance to any visible enemy instantly, and slam into them for a HEAVY FRM Hit; they're hurled clear.",
                cost: "HAZE FRM Hit to you on landing — you're still the thing that just got fired." },
            dread: { name: "DEAD BOLT", effect: "Ram every visible enemy in sequence, one HEAVY FRM Hit each, before the round ends.",
                cost: "HEAVY FRM Hit to you once the sequence stops." }
        },
        "RED SHIFT": {
            bale: { name: "WOLD", effect: "Swap positions with any creature in sight, any distance, no reaction provoked either way.",
                cost: "HAZE NRV Hit — you're the one who has to reassemble first." },
            dread: { name: "DEAD WOLD", effect: "Place every creature anywhere you choose within sight, no reactions provoked anywhere.",
                cost: "HEAVY NRV Hit — your own landing spot isn't yours to pick." }
        },
        "LOST TRACK": {
            bale: { name: "FORLORN", effect: "Remove a target entirely until the start of their next turn, then place them anywhere you choose.",
                cost: "HAZE NRV Hit — allies can't reach you for aid during that span." },
            dread: { name: "LAST FORLORN", effect: "Every enemy banished until the end of the scene, then redistributed by the Static.",
                cost: "HEAVY NRV Hit — you're off the grid the same span." }
        },
        "SHADOWBOX": {
            bale: { name: "GLOOM", effect: "Split off a shade double where you stand; you may immediately move anywhere nearby. Attacks against \u201cyou\u201d this exchange strike the double.",
                cost: "HAZE NRV Hit if the double is destroyed before your next turn." },
            dread: { name: "TOTAL GLOOM", effect: "Every ally gets a shade for the round; the field fills with echoes enemies can't sort from real.",
                cost: "HEAVY NRV Hit to you if your own double falls." }
        }
    },
    3: {
        "HARD LOCK": {
            bale: { name: "WANE", effect: "Reach into a target's near future and detonate it early — their next HAZE Hit lands as HEAVY, or their next HEAVY Hit lands as HYPER.",
                cost: "The same escalation is loaded on you — your next Hit taken escalates one step, whenever it lands." },
            dread: { name: "FINAL WANE", effect: "Every Hit, from anyone, escalates one tier for the rest of the scene. Once this scene, rewrite a Hit that already landed a tier worse.",
                cost: "The escalation applies to you too, permanently, and the rewrite can be turned back on a Hit you already took." }
        },
        "RED SHIFT": {
            bale: { name: "WITHER", effect: "Blink to touch or target a creature, no reaction provoked, then mark them: every Hit they take before your next turn is increased one tier.",
                cost: "HAZE NRV Hit to you the instant the mark lands." },
            dread: { name: "TRUE WITHER", effect: "Every Hit inflicted for the rest of the scene is upgraded one tier.",
                cost: "HEAVY NRV Hit, permanently in effect on you too." }
        },
        "LOST TRACK": {
            bale: { name: "ORDEAL", effect: "Force BRN, NRV, and FRM tests on a target. Each failure is a HAZE Hit to the matching Attribute.",
                cost: "You take the same three tests, hidden from you until they resolve." },
            dread: { name: "FINAL ORDEAL", effect: "Every enemy takes all three HAZE tests before further tests can escalate them.",
                cost: "You take them too, unwarned." }
        },
        "SHADOWBOX": {
            bale: { name: "GRIM", effect: "Bind a target to a shade double only you can see and strike. Your next Hit against the double lands on them instead, undefended.",
                cost: "HAZE Hit (BRN) — your next attack roll against anyone else suffers." },
            dread: { name: "GRIM HOUR", effect: "The bound double takes every Hit you land for the rest of the scene, all undefended.",
                cost: "The link is permanent this fight — whatever finally destroys the double reaches back to you too, full severity." }
        }
    },
    4: {
        "HARD LOCK": {
            bale: { name: "SUNDER", effect: "A line cuts through everyone standing between two points you choose. Everything it crosses takes a HEAVY Hit (Attribute of your choice) and is knocked aside.",
                cost: "HAZE Hit, same Attribute, to you." },
            dread: { name: "GREAT SUNDER", effect: "The fault becomes a wall for the rest of the scene; crossing it costs a HYPER Hit.",
                cost: "You don't choose which side you're on when it closes." }
        },
        "RED SHIFT": {
            bale: { name: "RIVEN", effect: "Open two linked fractures that stay open for the rest of the scene. Anything entering one exits the other at full speed, no reaction provoked.",
                cost: "HAZE FRM Hit to you the first time each scene it's used." },
            dread: { name: "OPEN RIVEN", effect: "Anyone crossing the breach can be redirected anywhere visible, any time, for the rest of the scene.",
                cost: "HEAVY FRM Hit if the Static redirects you through it instead." }
        },
        "LOST TRACK": {
            bale: { name: "CINDER", effect: "Detonate every anomaly or hazard clinging near a target — everyone close to them takes a HEAVY FRM Hit, no identifiable epicenter.",
                cost: "HAZE FRM Hit to you, untraceable for the rest of the scene." },
            dread: { name: "CINDER RAIN", effect: "The area around every combatant becomes hazardous for the rest of the scene; ending a turn anywhere costs a HAZE FRM Hit.",
                cost: "Including wherever you're standing, always." }
        },
        "SHADOWBOX": {
            bale: { name: "BLIGHT", effect: "Seed shade motes on everyone you choose. Your next offensive working relays through their mote onto them too.",
                cost: "You're wearing a mote too — there's a real chance your own next casting relays back onto you." },
            dread: { name: "DEEP BLIGHT", effect: "Every casting for the rest of the scene relays through a mote onto another bound target automatically.",
                cost: "Permanent exposure — your own mote is always live too." }
        }
    }
};

const noiseChars = [
    "░", "▒", "▓", "█", "▀", "▄", "▌", "▐", "▖", "▗", "▘", "▝", "▚", "▞",
    "■", "□", "▪", "▫", "◆", "◇", "▲", "△", "▼", "▽", "●", "○",
    "─", "│", "┼", "┤", "├", "┬", "┴", "╬", "╫", "╪",
    "⠿", "⠶", "⠛", "⠹", "⠭", "⠽", "⠾", "⠷",
    "#", "%", "&", "*", "/", "\\", "~", "^"
];

// Cryptic status lines — read out in order as the roll closes in
const ROLL_PHRASES = [
    "THE MATRIX SITS DARK",
    "SOMETHING TICKS BEHIND THE GRID",
    "THE STATIC CROSSES ROW AND COLUMN",
    "THE PATTERN HUNTS FOR A SEAM",
    "BONE SHOWS THROUGH THE CELLS",
    "THE GRID NEARLY AGREES WITH ITSELF",
    "HOLD — THE MATRIX IS CHOOSING"
];

let baleCards = [];
let dreadCards = [];
let cardCounter = 0;
let dreadCounter = 0;
let kindlingActive = false;
let rollInFlight = false;

// ===== persistence =====

function loadCards(key) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error("Failed to load " + key, err);
        return [];
    }
}

function saveCards(key, cards) {
    try {
        window.localStorage.setItem(key, JSON.stringify(cards));
    } catch (err) {
        console.error("Failed to save " + key, err);
    }
}

function saveBales() { saveCards(BALE_KEY, baleCards); }
function saveDreads() { saveCards(DREAD_KEY, dreadCards); }

// ===== log =====

function addLog(text) {
    const panel = document.getElementById("logPanel");
    const empty = panel.querySelector(".log-empty");
    if (empty) empty.remove();
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<span class="le-tag">&gt;&gt;</span>${text}`;
    panel.prepend(entry);
}

// ===== card rendering =====

function renderGrids() {
    const baleGrid = document.getElementById("baleGrid");
    const dreadGrid = document.getElementById("dreadGrid");

    if (baleCards.length === 0) {
        baleGrid.innerHTML = '<div class="grid-empty">NO BALES ON FILE — BAN ONE FROM THE OSSUARY</div>';
    } else {
        baleGrid.innerHTML = baleCards.map(c => renderBaleCardHTML(c)).join("");
    }

    if (dreadCards.length === 0) {
        dreadGrid.innerHTML = '<div class="grid-empty">NO DREADS KINDLED YET</div>';
    } else {
        dreadGrid.innerHTML = dreadCards.map(c => renderDreadCardHTML(c)).join("");
    }

    bindCardEvents();
}

function renderBaleCardHTML(card) {
    const fixedClass = card.fixed ? " fixed" : "";
    return `
        <div class="op-card bale-card${fixedClass}" data-id="${card.id}">
            <div class="oc-coord">${card.row} / ${card.category}</div>
            <div class="oc-name">${card.name}</div>
            <div class="oc-field"><span class="oc-label">Effect</span>${card.effect}</div>
            <div class="oc-field"><span class="oc-label">Cost</span>${card.cost}</div>
            <div class="oc-controls">
                ${card.fixed
                    ? `<button class="btn small" data-act="kindle" data-id="${card.id}">KINDLE</button>`
                    : `<button class="btn small" data-act="fix-bale" data-id="${card.id}">FIX</button>`}
            </div>
        </div>
    `;
}

function renderDreadCardHTML(card) {
    return `
        <div class="op-card dread-card" data-id="${card.id}">
            <div class="oc-coord">${card.row} / ${card.category}</div>
            <div class="oc-name">${card.name}</div>
            <div class="oc-field"><span class="oc-label">Effect</span>${card.effect}</div>
            <div class="oc-field"><span class="oc-label">Cost</span>${card.cost}</div>
            <div class="oc-controls">
                <button class="btn small" data-act="fix-dread" data-id="${card.id}">FIX DREAD</button>
            </div>
        </div>
    `;
}

function renderChosenBaleHTML(bale) {
    return `
        <div class="op-card bale-card just-banned" style="max-width:420px;margin:0 auto;border-color:var(--fg);">
            <div class="oc-coord">${bale.row} / ${bale.category}</div>
            <div class="oc-name">${bale.name}</div>
            <div class="oc-field"><span class="oc-label">Effect</span>${bale.effect}</div>
            <div class="oc-field"><span class="oc-label">Cost</span>${bale.cost}</div>
        </div>
    `;
}

function bindCardEvents() {
    document.querySelectorAll('[data-act="fix-bale"]').forEach(btn => {
        btn.addEventListener("click", () => fixBale(btn.dataset.id));
    });
    document.querySelectorAll('[data-act="kindle"]').forEach(btn => {
        btn.addEventListener("click", () => startKindle(btn.dataset.id));
    });
    document.querySelectorAll('[data-act="fix-dread"]').forEach(btn => {
        btn.addEventListener("click", () => fixDread(btn.dataset.id));
    });
}

// ===== FIX Bale =====

function fixBale(id) {
    const card = baleCards.find(c => c.id === id);
    if (!card || card.fixed) return;
    card.fixed = true;
    saveBales();
    addLog(`BALE FIXED — ${card.name} SPENT. AVAILABLE TO KINDLE.`);
    renderGrids();
}

// ===== FIX Dread =====

function fixDread(id) {
    const card = dreadCards.find(c => c.id === id);
    if (!card) return;
    dreadCards = dreadCards.filter(c => c.id !== id);
    saveDreads();
    addLog(`DREAD FIXED — ${card.name} RESOLVED. COST PAID IN FULL. NOTHING REMAINS.`);
    renderGrids();
}

// ===== per-cell noise (fine ossuary grain on the matrix itself) =====

function updateCellNoise() {
    const cells = document.querySelectorAll('.dread-cell .cell-noise');
    cells.forEach(el => {
        let text = '';
        for (let i = 0; i < 48; i++) {
            text += noiseChars[Math.floor(Math.random() * noiseChars.length)];
            if (i % 8 === 7) text += '\n';
        }
        el.textContent = text;
    });
}

// ===== full-panel static (canvas — pixels, not text) =====

function startStaticLoop() {
    const canvas = document.getElementById("ossuaryStatic");
    if (!canvas) return;
    canvas.width = 240;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");

    function drawFrame() {
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255 | 0;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    drawFrame();
    setInterval(drawFrame, 90);
}

// ===== glitch bursts (scanline / vhs-line / flash-stripe) =====

function triggerGlitch(container, intensity = 1) {
    if (!container) return;

    const scan = document.createElement("div");
    scan.className = "scanline";
    scan.style.left = Math.random() * 100 + "%";
    scan.style.width = (10 + Math.random() * 90) + "%";
    scan.style.animationDuration = (0.05 + Math.random() * 0.1) + "s";
    container.appendChild(scan);
    setTimeout(() => scan.remove(), 260);

    for (let i = 0; i < 2 * intensity; i++) {
        const line = document.createElement("div");
        line.className = "vhs-line";
        line.style.left = Math.random() * 100 + "%";
        line.style.background = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.5})`;
        container.appendChild(line);
        setTimeout(() => line.remove(), 150);
    }

    for (let i = 0; i < 2 * intensity; i++) {
        const stripe = document.createElement("div");
        stripe.className = "flash-stripe";
        stripe.style.top = Math.random() * 100 + "%";
        stripe.style.background = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.6})`;
        stripe.style.animationDuration = (0.12 + Math.random() * 0.15) + "s";
        container.appendChild(stripe);
        setTimeout(() => stripe.remove(), 320);
    }
}

// ===== cryptic status text =====

function crypticRollStatus(progress) {
    const clamped = Math.min(1, Math.max(0, progress));
    const idx = Math.min(ROLL_PHRASES.length - 1, Math.floor(clamped * (ROLL_PHRASES.length - 1)));
    return "STATUS: " + ROLL_PHRASES[idx];
}

// ===== BANNING (2d4 roll against the matrix) =====

function performBan() {
    if (rollInFlight || kindlingActive) return;
    rollInFlight = true;

    const banBtn = document.getElementById("banBtn");
    const banStatus = document.getElementById("banStatus");
    const panel = document.getElementById("ossuaryPanel");
    const glitchContainer = document.getElementById("ossuaryGlitch");

    banBtn.disabled = true;

    document.querySelectorAll('#matrixBody td, #matrixBody th, .overdrive-grid thead th').forEach(el => {
        el.classList.remove('highlighted');
    });

    panel.classList.add('awaiting-roll');
    const noiseInterval = setInterval(updateCellNoise, 70);

    let rolls = 0;
    const maxRolls = 9 + Math.floor(Math.random() * 6);

    const rollInterval = setInterval(() => {
        const randRow = 1 + Math.floor(Math.random() * 4);
        const randCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        document.querySelectorAll('#matrixBody td, #matrixBody th, .overdrive-grid thead th').forEach(el => el.classList.remove('highlighted'));
        const cell = document.getElementById(`cell-${randRow}-${randCat}`);
        if (cell) cell.classList.add('highlighted');
        document.getElementById(`row-${randRow}`).querySelector('th').classList.add('highlighted');
        document.getElementById(`th-${randCat}`).classList.add('highlighted');

        rolls++;
        banStatus.textContent = crypticRollStatus(rolls / maxRolls);
        if (rolls % 4 === 0) triggerGlitch(glitchContainer, 1);

        if (rolls >= maxRolls) {
            clearInterval(rollInterval);
            clearInterval(noiseInterval);

            const finalRow = 1 + Math.floor(Math.random() * 4);
            const finalCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

            document.querySelectorAll('#matrixBody td, #matrixBody th, .overdrive-grid thead th').forEach(el => {
                el.classList.remove('highlighted');
            });
            panel.classList.remove('awaiting-roll');

            const finalCell = document.getElementById(`cell-${finalRow}-${finalCat}`);
            if (finalCell) finalCell.classList.add('highlighted');
            document.getElementById(`row-${finalRow}`).querySelector('th').classList.add('highlighted');
            document.getElementById(`th-${finalCat}`).classList.add('highlighted');

            triggerGlitch(glitchContainer, 3);
            setTimeout(() => triggerGlitch(glitchContainer, 2), 150);

            const pair = MATRIX[finalRow][finalCat];
            cardCounter++;
            const bale = {
                id: "bale" + Date.now() + "_" + cardCounter,
                row: finalRow,
                category: finalCat,
                name: pair.bale.name,
                effect: pair.bale.effect,
                cost: pair.bale.cost,
                fixed: false
            };
            baleCards.push(bale);
            saveBales();

            addLog(`BALE BANNED — ${bale.name} (${bale.row} / ${bale.category}).`);
            banStatus.textContent = `STATUS: THE STATIC YIELDED — ${bale.name}`;

            const display = document.getElementById("chosenBaleDisplay");
            display.innerHTML = renderChosenBaleHTML(bale);
            setTimeout(() => { display.innerHTML = ''; }, 4200);

            banBtn.disabled = false;
            rollInFlight = false;
            renderGrids();
        }
    }, 110 + Math.random() * 70);
}

// ===== KINDLE — the pyre: organic blob, embers, mild shake (kept) =====

function spawnEmbers(stage, count, leftPercent, bottomPercent) {
    for (let i = 0; i < count; i++) {
        const ember = document.createElement("span");
        ember.className = "ember";
        const size = 4 + Math.random() * 7;
        ember.style.width = size + "px";
        ember.style.height = size + "px";
        const jitterX = (Math.random() - 0.5) * 46;
        const jitterY = (Math.random() - 0.5) * 14;
        ember.style.left = `calc(${leftPercent}% + ${jitterX}px)`;
        ember.style.bottom = `calc(${bottomPercent}% + ${jitterY}px)`;
        ember.style.setProperty("--dx", ((Math.random() - 0.5) * 100) + "px");
        ember.style.background = Math.random() > 0.5 ? "var(--ember)" : "var(--ember-dim)";
        ember.style.animationDuration = (0.7 + Math.random() * 0.9) + "s";
        stage.appendChild(ember);
        ember.addEventListener("animationend", () => ember.remove());
    }
}

function startKindle(id) {
    if (kindlingActive || rollInFlight) return;
    const card = baleCards.find(c => c.id === id);
    if (!card || !card.fixed) return;
    kindlingActive = true;

    const wrap = document.getElementById("pyreWrap");
    const stage = document.getElementById("pyreStage");
    const blob = document.getElementById("pyreBlob");
    const reveal = document.getElementById("pyreReveal");
    const pyreStatus = document.getElementById("pyreStatus");

    wrap.classList.add("active");
    stage.classList.remove("settling");
    stage.classList.add("burning");
    reveal.classList.remove("active");
    reveal.innerHTML = "";

    pyreStatus.textContent = `STATUS: KINDLING ${card.name} — DRIVING PAST THRESHOLD`;
    addLog(`KINDLING INITIATED — ${card.name} DRIVEN INTO OVERDRIVE.`);

    const emberInterval = setInterval(() => spawnEmbers(stage, 2, 50, 50), 90);

    function stokeBlob() {
        blob.style.filter = "brightness(1.6)";
        clearTimeout(stokeBlob._t);
        stokeBlob._t = setTimeout(() => { blob.style.filter = ""; }, 180);
    }

    function stokeHandler(e) {
        if (!kindlingActive) return;
        const rect = stage.getBoundingClientRect();
        const leftPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const bottomPercent = 100 - ((e.clientY - rect.top) / rect.height) * 100;
        spawnEmbers(stage, 6, leftPercent, bottomPercent);
        stokeBlob();
    }
    stage.addEventListener("click", stokeHandler);

    setTimeout(() => {
        if (kindlingActive) pyreStatus.textContent = "STATUS: THE SHAPE GIVES WAY";
    }, 1000);

    setTimeout(() => {
        clearInterval(emberInterval);
        stage.removeEventListener("click", stokeHandler);
        stage.classList.remove("burning");
        stage.classList.add("settling");

        const pair = MATRIX[card.row][card.category];
        dreadCounter++;
        const dread = {
            id: "dread" + Date.now() + "_" + dreadCounter,
            row: card.row,
            category: card.category,
            name: pair.dread.name,
            effect: pair.dread.effect,
            cost: pair.dread.cost,
            fromBaleId: card.id
        };
        dreadCards.push(dread);
        saveDreads();

        baleCards = baleCards.filter(c => c.id !== id);
        saveBales();

        reveal.innerHTML = renderDreadCardHTML(dread);
        reveal.classList.add("active");

        pyreStatus.textContent = `STATUS: KINDLED — ${dread.name} BURNED CLEAR`;
        addLog(`DREAD KINDLED — ${dread.name} (${dread.row} / ${dread.category}). BALE SPENT.`);

        kindlingActive = false;
        renderGrids();

        setTimeout(() => {
            wrap.classList.remove("active");
            stage.classList.remove("settling");
            reveal.classList.remove("active");
            reveal.innerHTML = "";
            pyreStatus.textContent = "STATUS: IDLE";
        }, 2600);
    }, 2000);
}

// ===== init =====

document.addEventListener("DOMContentLoaded", () => {
    baleCards = loadCards(BALE_KEY);
    dreadCards = loadCards(DREAD_KEY);
    renderGrids();

    document.getElementById("banBtn").addEventListener("click", performBan);

    startStaticLoop();
    updateCellNoise();

    console.log("BANNING AND KINDLING TERMINAL ONLINE");
    console.log("ROLL 2D4 AGAINST THE MATRIX. FEED THE PYRE.");
});
