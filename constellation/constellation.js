/*

CONSTELLATION — STARFIELD TERMINAL

AFTERIMAGES holds every named point of light: its code, its display
name, its fixed position on the field (x, y in a 600×340 space), and
a small rotation so the tic-tac silhouettes don't all sit perfectly
level. Position is fixed per afterimage so the same combination
always draws the same shape.

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
    { code: "AI-01", name: "Gimbal",            x: 60,  y: 60,  rot: 8   },
    { code: "AI-02", name: "Tic Tac",            x: 140, y: 110, rot: -15 },
    { code: "AI-03", name: "Ghost Return",       x: 230, y: 50,  rot: 20  },
    { code: "AI-04", name: "False Horizon",      x: 320, y: 140, rot: -5  },
    { code: "AI-05", name: "GoFast",             x: 410, y: 70,  rot: 12  },
    { code: "AI-06", name: "Fastwalker",         x: 500, y: 130, rot: -10 },
    { code: "AI-07", name: "Jellyfish",          x: 80,  y: 200, rot: 18  },
    { code: "AI-08", name: "Cold Core",          x: 170, y: 250, rot: -8  },
    { code: "AI-09", name: "Negative Parallax",  x: 260, y: 190, rot: 4   },
    { code: "AI-10", name: "Green Pyramid",      x: 350, y: 240, rot: -18 },
    { code: "AI-11", name: "Static Memory",      x: 440, y: 200, rot: 10  },
    { code: "AI-12", name: "Black Triangle",     x: 530, y: 250, rot: -4  },
    { code: "AI-13", name: "Split Echo",         x: 100, y: 290, rot: 16  },
    { code: "AI-14", name: "Observer Drift",     x: 200, y: 310, rot: -12 },
    { code: "AI-15", name: "Missing Frame",      x: 300, y: 300, rot: 6   },
    { code: "AI-16", name: "Dead Vector",        x: 390, y: 310, rot: -20 },
    { code: "AI-17", name: "Plasma Wake",        x: 480, y: 290, rot: 14  },
    { code: "AI-18", name: "Pressure Scar",      x: 30,  y: 150, rot: -6  },
    { code: "AI-19", name: "Mosul Orb",          x: 560, y: 180, rot: 9   }
];

const CONSTELLATIONS = [
    { name: "First Contact", requires: ["Gimbal", "Tic Tac"],
      mechanicName: "INITIAL LOCK",
      mechanicText: "The first Procedure you perform each scene is automatically Stamped." },

    { name: "False Dawn", requires: ["Ghost Return", "False Horizon"],
      mechanicName: "MISIDENTIFICATION",
      mechanicText: "The first attack against you each combat must be rerolled." },

    { name: "Null Vector", requires: ["GoFast", "Fastwalker"],
      mechanicName: "IMPOSSIBLE TRANSIT",
      mechanicText: "Once each round, your first movement ignores terrain, obstacles, engagement, and difficult terrain." },

    { name: "Still Sky", requires: ["Jellyfish", "Cold Core"],
      mechanicName: "STABLE FRAME",
      mechanicText: "Whenever you restore Pale, restore +1 additional Pale." },

    { name: "Parallax", requires: ["Negative Parallax", "Green Pyramid"],
      mechanicName: "IMPOSSIBLE GEOMETRY",
      mechanicText: "You may treat adjacent spaces as connected even if separated by walls, gaps, elevation, or other solid barriers." },

    { name: "Nimitz", requires: ["Gimbal", "Tic Tac", "GoFast"],
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

    { name: "Skyhook", requires: ["GoFast", "Dead Vector", "Black Triangle", "Fastwalker"],
      mechanicName: "FIRE CONTROL SOLUTION",
      mechanicText: "Once each combat, designate one visible creature as LOCKED. All your Procedures targeting that creature are Stamped. Attacks against it ignore cover. It cannot benefit from concealment." },

    { name: "Graveyard Orbit", requires: ["Tic Tac", "Jellyfish", "Negative Parallax", "Pressure Scar"],
      mechanicName: "ZERO INERTIA",
      mechanicText: "You are immune to forced movement. Whenever another creature would move you, you may instead move the same distance in any direction." },

    { name: "Majestic", requires: ["Gimbal", "Tic Tac", "GoFast", "Mosul Orb", "Ghost Return"],
      mechanicName: "SENSOR FUSION",
      mechanicText: "Every Procedure is treated as Stamped. Whenever you roll two d20, you may reroll one of them." },

    { name: "Constellation 46", requires: ["Green Pyramid", "Static Memory", "Missing Frame", "Observer Drift", "Split Echo"],
      mechanicName: "PATTERN COMPLETION",
      mechanicText: "Once each scene, declare that two visible phenomena are manifestations of the same anomaly. The GM must adjudicate them using one shared property for the remainder of the encounter." },

    { name: "Celestial Meridian", requires: ["GoFast", "Fastwalker", "Dead Vector", "Negative Parallax", "Plasma Wake"],
      mechanicName: "ABSOLUTE POSITION",
      mechanicText: "Your position cannot be altered by any effect except your own movement. You always choose exactly where your movement ends." },

    { name: "Omega Sky", requires: ["Gimbal", "Tic Tac", "GoFast", "Black Triangle", "Ghost Return", "Fastwalker"],
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

function drawStar(svg, star, lit){
    const g = ns("g");
    g.setAttribute("class", "field-star" + (lit ? " lit" : ""));
    g.setAttribute("transform", `translate(${star.x},${star.y}) rotate(${star.rot})`);

    const title = ns("title");
    title.textContent = star.name;
    g.appendChild(title);

    if(lit){
        const glow = ns("ellipse");
        glow.setAttribute("rx", 13);
        glow.setAttribute("ry", 7);
        glow.setAttribute("class", "star-glow");
        g.appendChild(glow);
    }

    const body = ns("ellipse");
    const isTicTac = star.name === "Tic Tac";
    body.setAttribute("rx", isTicTac ? 9 : 6.5);
    body.setAttribute("ry", isTicTac ? 4.2 : 3);
    body.setAttribute("class", "star-body");
    g.appendChild(body);

    if(lit){
        const label = ns("text");
        label.setAttribute("class", "star-label");
        label.setAttribute("y", -12);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("transform", `rotate(${-star.rot})`);
        label.textContent = star.name;
        g.appendChild(label);
    }

    g.addEventListener("click", () => toggle(star.name));
    svg.appendChild(g);
}

function renderField(){
    const svg = document.getElementById("starfield");
    const emptyEl = document.getElementById("fieldEmpty");
    svg.innerHTML = "";
    emptyEl.style.display = selected.length === 0 ? "flex" : "none";

    const match = findMatch();
    const closesLoop = !!match && selected.length > 2;

    for(let i = 0; i < selected.length - 1; i++){
        const a = afterimageByName[selected[i]];
        const b = afterimageByName[selected[i + 1]];
        drawLine(svg, a, b);
    }
    if(closesLoop){
        const a = afterimageByName[selected[selected.length - 1]];
        const b = afterimageByName[selected[0]];
        drawLine(svg, a, b, true);
    }

    AFTERIMAGES.forEach(star => {
        drawStar(svg, star, selected.includes(star.name));
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
