/*

KERNEL — AMBIENT FX

Three independent, purely decorative effects for the gate page.
None of them touch verify() or ACCESS from terminal.js, and none
of them link anywhere — the Kernel is a threshold, not a menu.

  1. Ticker      — cycles through system callouts already seen
                    across the other nodes, tying the gate to the
                    same voice as everything behind it.
  2. Static band  — a strip of braille glyphs that flickers a
                    fraction of its characters on an interval,
                    standing in for "the Static" from the lore.
  3. Watch-mark   — a small bracket that eases toward the cursor
                    with lag, plus a coordinate label. Reinforces
                    "observation is a form of entry" concretely —
                    it really is tracking your pointer.

*/

// ---------- ticker ----------

const TICKER_PHRASES = [
    ">> CONTAINMENT HOLDING",
    ">> SOURCE UNRESOLVED",
    ">> OBSERVATION ACTIVE",
    ">> STATIC PRESSURE ELEVATED",
    ">> SIGNAL LOCK PARTIAL",
    ">> PARAMETERS HOLDING",
    ">> PATTERN DRIFT DETECTED",
    ">> RESPONSE INCONCLUSIVE"
];

const TICKER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ>-—/ ";

function scrambleTicker(text){
    return text
        .split("")
        .map(c => (c === " " ? c : (Math.random() < 0.5 ? TICKER_GLYPHS[Math.floor(Math.random() * TICKER_GLYPHS.length)] : c)))
        .join("");
}

function runTicker(){

    const el = document.getElementById("ticker");
    if(!el) return;

    let index = 0;

    function next(){

        index = (index + 1) % TICKER_PHRASES.length;
        const target = TICKER_PHRASES[index];

        let frame = 0;

        function step(){

            if(frame < 4){
                el.textContent = scrambleTicker(target);
                frame++;
                setTimeout(step, 45);
            } else {
                el.textContent = target;
            }

        }

        step();

    }

    setInterval(next, 4200);

}

// ---------- static band (braille noise) ----------

function runStaticBand(){

    const el = document.getElementById("staticBand");
    if(!el) return;

    const COUNT = 140;
    const chars = [];

    function randomBraille(){
        return String.fromCharCode(0x2800 + Math.floor(Math.random() * 256));
    }

    for(let i = 0; i < COUNT; i++){
        chars.push(randomBraille());
    }

    function render(){
        el.textContent = chars.join("");
    }

    render();

    setInterval(() => {

        for(let i = 0; i < chars.length; i++){
            if(Math.random() < 0.08){
                chars[i] = randomBraille();
            }
        }

        render();

    }, 180);

}

// ---------- watch-mark (cursor tracking) ----------

function runWatchMark(){

    const mark = document.getElementById("watchMark");
    const label = document.getElementById("watchLabel");
    if(!mark || !label) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let active = false;

    document.addEventListener("mousemove", (e) => {

        targetX = e.clientX;
        targetY = e.clientY;

        if(!active){
            active = true;
            mark.style.opacity = "1";
            label.style.opacity = "1";
        }

        label.textContent = "OBS // " + e.clientX + "," + e.clientY;

    });

    document.addEventListener("mouseleave", () => {
        mark.style.opacity = "0";
        label.style.opacity = "0";
    });

    function loop(){

        curX += (targetX - curX) * 0.12;
        curY += (targetY - curY) * 0.12;

        mark.style.transform = "translate(" + (curX - 7) + "px, " + (curY - 7) + "px)";
        label.style.transform = "translate(" + (curX + 14) + "px, " + (curY + 6) + "px)";

        requestAnimationFrame(loop);

    }

    loop();

}

document.addEventListener("DOMContentLoaded", () => {
    runTicker();
    runStaticBand();
    runWatchMark();
});
