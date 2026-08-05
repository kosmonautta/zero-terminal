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

// Per-star jitter keyframes — generated once at load, not per render, so a
// star's motion stays consistent while you're looking at it. Each star gets its own
// @keyframes rule with its own random number of stops, its own random hold points
// in time (not evenly spaced — that's what makes the interval between jumps feel
// random instead of metronomic), and its own random displacement at each stop, in a
// random direction. A hard "steps(1,end)" timing function means each jump is an
// instant snap rather than an eased glide, plus its own duration and a negative
// delay so nothing starts in phase. That's what makes it read as fast and erratic
// rather than a smooth drift.
//
// This jitter only ever plays on a star AFTER it has been clicked onto the field
// (lit) and BEFORE its current selection resolves into a known formation (settled).
// Unselected stars sit completely still — no animation at all — until chosen.
function randRange(min, max){
    return min + Math.random() * (max - min);
}

function buildJitterKeyframe(name){
    const stops = 7 + Math.floor(Math.random() * 6); // 7–12 hops per cycle

    // random, non-uniform hold points along the timeline (sorted, deduped) —
    // this is what gives random INTERVALS between jumps, not just random
    // positions at evenly-divided ticks
    const pcts = new Set([0, 100]);
    while(pcts.size < stops){
        pcts.add(Math.floor(randRange(4, 97)));
    }
    const sorted = [...pcts].sort((a, b) => a - b);

    let body = "";
    sorted.forEach(pct => {
        if(pct === 0 || pct === 100){
            body += `${pct}%{ transform:translate(0px,0px); opacity:0.45; }`;
        } else {
            // random direction + random distance every hop
            const dx = randRange(-5.5, 5.5).toFixed(2);
            const dy = randRange(-5.5, 5.5).toFixed(2);
            const op = randRange(0.25, 0.95).toFixed(2);
            body += `${pct}%{ transform:translate(${dx}px,${dy}px); opacity:${op}; }`;
        }
    });
    return `@keyframes ${name}{ ${body} }`;
}

const jitterParams = {};
let starKeyframeCSS = "";
AFTERIMAGES.forEach(a => {
    const jitterName = `jitter_${a.code}`;
    starKeyframeCSS += buildJitterKeyframe(jitterName);
    jitterParams[a.code] = {
        jitterName,
        jdur: randRange(0.5, 1.6).toFixed(2), // fast full cycle
        jdelay: -randRange(0, 1.6).toFixed(2)
    };
});

(function injectStarKeyframes(){
    const styleEl = document.createElement("style");
    styleEl.textContent = starKeyframeCSS;
    document.head.appendChild(styleEl);
})();

let selected = []; // names, in the order they were added

// ===== CARD SAVING =====

function loadCharted(){
    try{
        const raw = window.localStorage.getItem(CONSTELLATION_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch(err){
        console.error("Failed to load charted formations", err);
        return [];
    }
}

function saveCharted(cards){
    try{
        window.localStorage.setItem(CONSTELLATION_KEY, JSON.stringify(cards));
    } catch(err){
        console.error("Failed to save charted formations", err);
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
    const jp = jitterParams[star.code];
    if(jp){
        if(settled){
            // shared calm animation, driven by the .field-star.settled CSS rule —
            // no need for per-star variety once it's no longer erratic
        } else if(lit){
            // clicked onto the field but not yet part of a resolved formation:
            // erratic per-star jitter
            body.style.animation = `${jp.jitterName} ${jp.jdur}s steps(1, end) ${jp.jdelay}s infinite`;
        } else {
            // not yet clicked: perfectly static
            body.style.animation = "none";
        }
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

        const cards = loadCharted();
        if(!cards.find(c => c.name === match.name)){
            cards.push({ name: match.name, mechanicName: match.mechanicName });
            saveCharted(cards);
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
    document.getElementById("statCharted").textContent = loadCharted().length + " / " + TOTAL_FORMATIONS;
    updateResultPanel();
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
