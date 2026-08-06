/*

CONSTELLATION — STARFIELD TERMINAL

AFTERIMAGES holds every named point of light: its code, its display
name, and its fixed position on the field (x, y in a 600×340 space).
Position is fixed per afterimage so the same combination always
draws the same shape.

CONSTELLATIONS holds every known formation as an unordered set of
required afterimage names, plus the name of the mechanic it grants
and its effect text. Unlike a Routine, order never matters here —
only which points are present. The field is checked against this
table on every change: an exact set match reveals the formation. Six
or more unique points with no exact match still resolves — quietly —
into Constellation Zero.

To add a new afterimage or formation, add an entry to the relevant
array below. Nothing else needs to change — the catalog, the field,
and the matcher all read from these two arrays.

*/

const CONSTELLATION_KEY = "constellationCards";

const AFTERIMAGES = [
    { code: "AF-01", name: "Gimbal",            x: 60,  y: 60  },
    { code: "AF-02", name: "Green Pyramid",      x: 350, y: 240 },
    { code: "AF-03", name: "Jellyfish",          x: 80,  y: 200 },
    { code: "AF-04", name: "Halo",               x: 510, y: 20  },
    { code: "AF-05", name: "Tic Tac",            x: 140, y: 110 },
    { code: "AF-06", name: "Cold Core",          x: 170, y: 250 },
    { code: "AF-07", name: "White Ember",        x: 20,  y: 30  },
    { code: "AF-08", name: "Blackbody",          x: 580, y: 100 },
    { code: "AF-09", name: "Ghost Return",       x: 230, y: 50  },
    { code: "AF-10", name: "Split Echo",         x: 100, y: 290 },
    { code: "AF-11", name: "False Horizon",      x: 320, y: 140 },
    { code: "AF-12", name: "Coast Track",        x: 230, y: 280 },
    { code: "AF-13", name: "Gofast",             x: 410, y: 70  },
    { code: "AF-14", name: "Plasma Wake",        x: 480, y: 290 },
    { code: "AF-15", name: "Pressure Scar",      x: 30,  y: 150 },
    { code: "AF-16", name: "Shear Front",        x: 150, y: 20  },
    { code: "AF-17", name: "Fastwalker",         x: 500, y: 130 },
    { code: "AF-18", name: "Negative Parallax",  x: 260, y: 190 },
    { code: "AF-19", name: "Dead Vector",        x: 390, y: 310 },
    { code: "AF-20", name: "Blind Angle",        x: 380, y: 20  },
    { code: "AF-21", name: "Missing Frame",      x: 300, y: 300 },
    { code: "AF-22", name: "Observer Drift",     x: 200, y: 310 },
    { code: "AF-23", name: "Static Memory",      x: 440, y: 200 },
    { code: "AF-24", name: "Signal Bleed",       x: 30,  y: 320 },
    { code: "AF-25", name: "Black Triangle",     x: 530, y: 250 },
    { code: "AF-26", name: "Mosul Orb",          x: 560, y: 180 },
    { code: "AF-27", name: "Echelon",            x: 580, y: 320 },
    { code: "AF-28", name: "Angel Flight",       x: 10,  y: 190 }
];

const CONSTELLATIONS = [
    { name: "First Contact", requires: ["Gimbal", "Tic Tac"],
      mechanicName: "INITIAL LOCK",
      mechanicText: "The first Procedure you perform each scene is automatically Stamped." },

    { name: "False Dawn", requires: ["Ghost Return", "False Horizon"],
      mechanicName: "MISIDENTIFICATION",
      mechanicText: "The first attack against you each combat must be rerolled." },

    { name: "Null Vector", requires: ["Gofast", "Fastwalker"],
      mechanicName: "IMPOSSIBLE TRANSIT",
      mechanicText: "Once each round, your first movement ignores terrain, obstacles, engagement, and difficult terrain." },

    { name: "Still Sky", requires: ["Jellyfish", "Cold Core"],
      mechanicName: "STABLE FRAME",
      mechanicText: "Whenever you restore Pale, restore +1 additional Pale." },

    { name: "Parallax", requires: ["Negative Parallax", "Green Pyramid"],
      mechanicName: "IMPOSSIBLE GEOMETRY",
      mechanicText: "You may treat adjacent spaces as connected even if separated by walls, gaps, elevation, or other solid barriers." },

    { name: "Nimitz", requires: ["Gimbal", "Tic Tac", "Gofast"],
      mechanicName: "VECTOR LOCK",
      mechanicText: "Whenever you complete a Procedure, you may immediately move up to your full Movement without provoking reactions." },

    { name: "Blue Book", requires: ["Gimbal", "Green Pyramid", "Static Memory"],
      mechanicName: "CLASSIFICATION",
      mechanicText: "The first time you encounter an unknown anomaly, the GM must reveal one fundamental rule governing it (weakness, instinct, limitation, or operating principle)." },

    { name: "Silent Fleet", requires: ["Black Triangle", "Ghost Return", "Fastwalker"],
      mechanicName: "DISTRIBUTED PRESENCE",
      mechanicText: "After completing a Procedure, you may teleport to any space you occupied earlier this scene." },

    { name: "Mosaic", requires: ["Observer Drift", "Missing Frame", "Split Echo"],
      mechanicName: "CONTINUITY ERROR",
      mechanicText: "Once per scene, after any creature resolves an Action, choose to resolve its movement before the Action or after it, regardless of the original order." },

    { name: "Event Horizon", requires: ["Cold Core", "Plasma Wake", "Dead Vector"],
      mechanicName: "FRAME COLLAPSE",
      mechanicText: "The first time each scene one of your Pale values reaches 0, immediately restore that Pale to its maximum value." },

    { name: "Black Vault", requires: ["Gimbal", "Ghost Return", "Split Echo", "Static Memory"],
      mechanicName: "RECURSIVE OBSERVATION",
      mechanicText: "Every Procedure you Stamp remains Stamped for the rest of the scene." },

    { name: "Skyhook", requires: ["Gofast", "Dead Vector", "Black Triangle", "Fastwalker"],
      mechanicName: "FIRE CONTROL SOLUTION",
      mechanicText: "Once each combat, designate one visible creature as LOCKED. All your Procedures targeting that creature are Stamped. Attacks against it ignore cover. It cannot benefit from concealment." },

    { name: "Graveyard Orbit", requires: ["Tic Tac", "Jellyfish", "Negative Parallax", "Pressure Scar"],
      mechanicName: "ZERO INERTIA",
      mechanicText: "You are immune to forced movement. Whenever another creature would move you, you may instead move the same distance in any direction." },

    { name: "Majestic", requires: ["Gimbal", "Tic Tac", "Gofast", "Mosul Orb", "Ghost Return"],
      mechanicName: "SENSOR FUSION",
      mechanicText: "Every Procedure is treated as Stamped. Whenever you roll two d20, you may reroll one of them." },

    { name: "Constellation 46", requires: ["Green Pyramid", "Static Memory", "Missing Frame", "Observer Drift", "Split Echo"],
      mechanicName: "PATTERN COMPLETION",
      mechanicText: "Once each scene, declare that two visible phenomena are manifestations of the same anomaly. The GM must adjudicate them using one shared property for the remainder of the encounter." },

    { name: "Celestial Meridian", requires: ["Gofast", "Fastwalker", "Dead Vector", "Negative Parallax", "Plasma Wake"],
      mechanicName: "ABSOLUTE POSITION",
      mechanicText: "Your position cannot be altered by any effect except your own movement. You always choose exactly where your movement ends." },

    { name: "Omega Sky", requires: ["Gimbal", "Tic Tac", "Gofast", "Black Triangle", "Ghost Return", "Fastwalker"],
      mechanicName: "CONTINUOUS SOLUTION",
      mechanicText: "You exist in a permanent LOCK state. Every Procedure is automatically Stamped. Your movement never provokes reactions. The first time each scene you would lose a Reading, prevent that damage and instead lose an equal amount of Pale from any Reading of your choice." }
];

// Constellation Zero doesn't require a fixed set — any six unique points resolve it,
// as a quiet fallback once nothing more specific matches.
const CONSTELLATION_ZERO = {
    name: "Constellation Zero",
    minUnique: 6,
    mechanicName: "OBSERVER EFFECT",
    mechanicText: 'Once per session, after any die is rolled, declare: "That is not what was observed." Erase the roll completely. The action is replayed from the beginning with entirely new dice. Nothing from the original resolution remains.'
};

const TOTAL_FORMATIONS = CONSTELLATIONS.length + 1;

const afterimageByName = {};
AFTERIMAGES.forEach(a => afterimageByName[a.name] = a);

const nameByLower = {};
AFTERIMAGES.forEach(a => nameByLower[a.name.toLowerCase()] = a.name);

// Per-star jitter — driven directly from JS with a recursive setTimeout instead
// of a CSS @keyframes loop. A keyframe animation still has to interpolate through
// a fixed, repeating timeline, which is exactly what was reading as a sway no
// matter how the stops were randomized. This instead just picks a new random
// direction and distance, snaps the star straight there with NO transition, then
// waits a fresh random amount of time before doing it again — so both the
// distance/direction AND the interval between hops are re-rolled every single
// hop, forever, with no repeating pattern at all.
function randRange(min, max){
    return min + Math.random() * (max - min);
}

const jitterTimers = {}; // star code -> setTimeout id, for stars currently jittering

function stopJitter(code){
    if(jitterTimers[code]){
        clearTimeout(jitterTimers[code]);
        delete jitterTimers[code];
    }
}

function startJitter(code, body){
    stopJitter(code);
    function hop(){
        const dx = randRange(-3, 3).toFixed(2);
        const dy = randRange(-3, 3).toFixed(2);
        const op = randRange(0.45, 1).toFixed(2);
        body.style.transform = `translate(${dx}px,${dy}px)`;
        body.style.opacity = op;
        jitterTimers[code] = setTimeout(hop, randRange(55, 220)); // random interval every hop
    }
    hop();
}

let selected = []; // names, in the order they were added

// ===== CARD SAVING =====

// chartedCards is the in-memory source of truth for the current session.
// localStorage is a best-effort persistence layer on top of it: we load
// into chartedCards once at startup, and write back to storage on every
// change — but the UI always reads from chartedCards directly, never by
// reading storage back. That way, if localStorage is blocked or restricted
// (common inside sandboxed previews), charted formations still show up
// immediately in the log for the rest of the session; only cross-session
// persistence is lost, silently, which is the best that's possible there.
let chartedCards = [];

function loadCharted(){
    try{
        const raw = window.localStorage.getItem(CONSTELLATION_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch(err){
        console.error("Failed to load charted formations", err);
        return [];
    }
}

function persistCharted(){
    try{
        window.localStorage.setItem(CONSTELLATION_KEY, JSON.stringify(chartedCards));
    } catch(err){
        console.error("Failed to save charted formations (session log is unaffected)", err);
    }
}

// ===== MATCHING =====

function findMatch(){
    const set = new Set(selected);
    const exact = CONSTELLATIONS.find(c =>
        c.requires.length === set.size &&
        c.requires.every(name => set.has(name))
    );
    if(exact) return exact;
    if(set.size >= CONSTELLATION_ZERO.minUnique) return CONSTELLATION_ZERO;
    return null;
}

function toggle(name){
    const i = selected.indexOf(name);
    if(i === -1) selected.push(name);
    else selected.splice(i, 1);
    update();
}

// ===== RENDERING: FIELD =====

function ns(tag){
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function drawLine(svg, a, b, closing){
    const line = ns("line");
    line.setAttribute("x1", a.x);
    line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y);
    line.setAttribute("class", "field-line" + (closing ? " closing" : ""));
    svg.appendChild(line);
    requestAnimationFrame(() => line.classList.add("drawn"));
}

function drawStar(container, star, lit, settled){
    const g = ns("g");
    g.setAttribute("class", "field-star" + (lit ? " lit" : "") + (settled ? " settled" : ""));
    g.setAttribute("transform", `translate(${star.x},${star.y})`);

    const title = ns("title");
    title.textContent = `${star.code} — ${star.name}`;
    g.appendChild(title);

    if(settled){
        const glow = ns("circle");
        glow.setAttribute("r", 12);
        glow.setAttribute("class", "star-glow");
        g.appendChild(glow);
    }

    const body = ns("circle");
    body.setAttribute("r", 6.5);
    body.setAttribute("class", "star-body");
    body.setAttribute("filter", "url(#starGrain)");
    if(settled){
        // shared calm animation, driven by the .field-star.settled CSS rule —
        // no jitter once it's resolved into a formation
        stopJitter(star.code);
    } else if(lit){
        // clicked onto the field but not yet part of a resolved formation:
        // fast, erratic, random-direction/random-distance/random-interval jitter
        startJitter(star.code, body);
    } else {
        // not yet clicked: perfectly static
        stopJitter(star.code);
    }
    g.appendChild(body);

    if(lit){
        const label = ns("text");
        label.setAttribute("class", "star-label");
        label.setAttribute("y", -12);
        label.setAttribute("text-anchor", "middle");
        label.textContent = `${star.code} ${star.name}`;
        g.appendChild(label);
    }

    g.addEventListener("click", () => toggle(star.name));
    container.appendChild(g);
}

function renderField(){
    const content = document.getElementById("fieldContent");
    const emptyEl = document.getElementById("fieldEmpty");
    content.innerHTML = "";
    emptyEl.style.display = selected.length === 0 ? "flex" : "none";

    const match = findMatch();
    const closesLoop = !!match && selected.length > 2;

    for(let i = 0; i < selected.length - 1; i++){
        const a = afterimageByName[selected[i]];
        const b = afterimageByName[selected[i + 1]];
        drawLine(content, a, b);
    }
    if(closesLoop){
        const a = afterimageByName[selected[selected.length - 1]];
        const b = afterimageByName[selected[0]];
        drawLine(content, a, b, true);
    }

    AFTERIMAGES.forEach(star => {
        const lit = selected.includes(star.name);
        drawStar(content, star, lit, lit && !!match);
    });
}

// ===== RENDERING: CATALOG =====

function renderCatalog(){
    const root = document.getElementById("catalog");
    root.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "star-grid";
    const sorted = [...AFTERIMAGES].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(star => {
        const lit = selected.includes(star.name);
        const card = document.createElement("div");
        card.className = "star-card" + (lit ? " selected" : "");
        card.innerHTML = `
            <div class="sc-code">${star.code}</div>
            <div class="sc-name">${star.name}</div>
        `;
        card.addEventListener("click", () => toggle(star.name));
        grid.appendChild(card);
    });
    root.appendChild(grid);
}

// ===== RENDERING: CHARTED LOG =====

// Each charted card remembers the exact set of afterimage names that
// triggered it (`requires`), not just a lookup into CONSTELLATIONS — that
// way Constellation Zero, which has no fixed requirement, can still be
// re-projected onto the field from the log using whatever set charted it
// the first time.
function projectCharted(card){
    if(!card) return;
    let requires = card.requires;
    if(!Array.isArray(requires)){
        // Defensive fallback in case backfill missed it — reconstruct from
        // the known formation table when possible.
        const known = CONSTELLATIONS.find(c => c.name === card.name);
        requires = known ? known.requires : null;
    }
    if(!Array.isArray(requires) || requires.length === 0) return;
    selected = [...requires];
    update();
}

function renderChartedLog(){
    const root = document.getElementById("chartedLog");
    if(!root) return;

    if(chartedCards.length === 0){
        root.innerHTML = '<div class="log-empty">NO FORMATIONS CHARTED YET</div>';
        return;
    }

    const currentSet = new Set(selected);
    const grid = document.createElement("div");
    grid.className = "charted-grid";

    chartedCards.forEach(card => {
        const isActive = Array.isArray(card.requires) &&
            card.requires.length === currentSet.size &&
            card.requires.every(name => currentSet.has(name));

        const el = document.createElement("div");
        el.className = "const-card" + (isActive ? " active" : "");
        el.innerHTML = `
            <div class="cc-name">${card.name}</div>
            <div class="cc-mech">${card.mechanicName}</div>
        `;
        el.addEventListener("click", () => projectCharted(card));
        grid.appendChild(el);
    });

    root.innerHTML = "";
    root.appendChild(grid);
}

// ===== RESULT PANEL =====

function revealResult(text){
    const el = document.getElementById("resultName");
    el.classList.add("resolving");
    el.textContent = text;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.remove("resolving"));
    });
}

function updateResultPanel(){
    const statusEl = document.getElementById("resultStatus");
    const subEl = document.getElementById("resultSub");

    if(selected.length === 0){
        statusEl.textContent = "STATUS: SKY EMPTY";
        revealResult("");
        subEl.textContent = "";
        return;
    }

    const match = findMatch();
    if(match){
        statusEl.textContent = "STATUS: FORMATION CHARTED";
        revealResult(match.name.toUpperCase());
        subEl.textContent = `${match.mechanicName} — ${match.mechanicText}`;

        if(!chartedCards.find(c => c.name === match.name)){
            chartedCards.push({
                name: match.name,
                mechanicName: match.mechanicName,
                mechanicText: match.mechanicText,
                // Named formations keep their fixed requirement; Constellation
                // Zero has none, so it keeps whatever set charted it here.
                requires: Array.isArray(match.requires) ? [...match.requires] : [...selected]
            });
            persistCharted();
        }
    } else {
        statusEl.textContent = "STATUS: PATTERN UNRESOLVED";
        revealResult("UNCHARTED");
        subEl.textContent = "NO KNOWN FORMATION MATCHES THIS ARRANGEMENT.";
    }
}

// ===== UPDATE =====

function update(){
    renderField();
    renderCatalog();
    document.getElementById("statPoints").textContent = selected.length;
    updateResultPanel();
    document.getElementById("statCharted").textContent = chartedCards.length + " / " + TOTAL_FORMATIONS;
    renderChartedLog();
}

// ===== MANUAL INPUT =====

function parseManualInput(raw){
    return raw
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
    chartedCards = loadCharted();

    // Older saves (from before the log could re-project a formation) only
    // stored { name, mechanicName } — backfill 'requires' for those from the
    // known CONSTELLATIONS table so they become clickable too. Anything that
    // still can't be resolved (a pre-existing Constellation Zero entry, which
    // has no fixed set) is left alone; projectCharted() handles that case.
    let backfilled = false;
    chartedCards.forEach(card => {
        if(!Array.isArray(card.requires)){
            const known = CONSTELLATIONS.find(c => c.name === card.name);
            if(known){
                card.requires = [...known.requires];
                if(!card.mechanicText) card.mechanicText = known.mechanicText;
                backfilled = true;
            }
        }
    });
    if(backfilled) persistCharted();

    update();

    document.getElementById("clearBtn").addEventListener("click", () => {
        selected = [];
        update();
    });

    document.getElementById("buildBtn").addEventListener("click", () => {
        const raw = document.getElementById("manualInput").value;
        const tokens = parseManualInput(raw);
        const names = tokens.map(t => nameByLower[t.toLowerCase()]).filter(Boolean);
        selected = [...new Set(names)];
        update();
    });

    document.getElementById("manualInput").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            document.getElementById("buildBtn").click();
        }
    });
});

console.log("CONSTELLATION FIELD ONLINE");
console.log("PROJECT THE POINTS. THE SKY WILL TELL YOU WHAT IT IS, IF IT IS ANYTHING AT ALL.");
