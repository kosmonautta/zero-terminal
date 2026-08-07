/*

THE 18 KINDLINGS — ARCHIVE TERMINAL

Three body-diagrams (BRAIN / NERVE / FRAME) act as the group selector for
HARD LOCK (BRN), RED SHIFT (NRV), and NEGATIVE BOX (FRM). Selecting a group
populates the kindling grid; selecting a kindling opens its full ritual
record (Self: Nibble/Feed/Devour tabs, plus standalone Living and Dead
Demand blocks). The Four Keeps can filter the grid across all groups.

*/

// ===================== DATA =====================

const GROUPS = {
    BRN: { label: "HARD LOCK", body: "BRAIN", tagline: "The mind breaks first. Let it." },
    NRV: { label: "RED SHIFT", body: "NERVE", tagline: "Nerves don't care whose signal they follow." },
    FRM: { label: "NEGATIVE BOX", body: "FRAME", tagline: "Bodies lie. Shadows don't." }
};

const KEEPS = [
    { key: "Black Nail", desc: "Desecrated iron, permanently cold. Pins, anchors, fixes, binds. Drawn to warmth." },
    { key: "Black Thread", desc: "Drawn from grave-cloth. Connects, stitches, bridges, claims. Light barely survives it." },
    { key: "Red Salt", desc: "Dried blood, brimstone, firestone, ground fine. Ignition. What burns becomes Red Shift." },
    { key: "Red Bone", desc: "Bone, offered through Kindling — from the self, from another, from the dead. Break a finger, use the fragment in a rite: it Kindles, and if unconsumed, stays changed. Permanently red. Carry enough rites and it accumulates — veteran Doomers hold Red Bone loose in their own skeletons, and elder ones develop whole red sections, load-bearing, unmistakable. No autopsy explains it. No chemical bleaches it out. The coloration isn't painted or stained or mineralized. The bone itself has changed, and it doesn't change back." }
];

const KINDLINGS = [
{ id:1, group:"BRN", name:"Remove the Righteous Eyes", quote:"You will not need them again.", theme:"Perception, ESP sensitivity, witnessing.", keep:"black nail, black thread",
  self:{
    nibble:{ action:"Nails through the lids. Not the eye. Never the eye.", effect:"See through walls, briefly. Immune to Surprise. Advantage on Initiative.", demand:"The nails stay. No blinking. Anything needing clear sight costs you." },
    feed:{ action:"Thread through the lids, pulled shut.", effect:"Feel the Static directly. Advantage on all BRN.", demand:"Blind, mundane-blind, for as long as the thread holds. Cut it, lose it — nothing carries forward." },
    devour:{ action:"No nail. No thread. Just the asking.", effect:"See the Static outright. See every mind nearby, walls or no walls.", demand:"Permanent. Nothing grows back." }
  },
  living:{ action:"Nail, then thread, driven into someone else's eyes.", effect:"Blind them. Or wear their sight instead.", demand:"Every hour behind their eyes, yours go a little darker." },
  dead:{ action:"Same, on a corpse.", effect:"A permanent Witness — see through it, always.", demand:"None owed by you. The corpse carries this one." }
},
{ id:2, group:"BRN", name:"Silence the Holy Tongue", quote:"Every prayer leaves through the mouth. Close it.", theme:"ESP output, amplifies offensive Hard Lock.", keep:"black thread",
  self:{
    nibble:{ action:"Three stitches, one knot, pulled free before you speak again.", effect:"BRN Kindlings can't be interrupted. Ignore Concentration checks.", demand:"The thread scars. Each use costs a fraction more silence to buy back." },
    feed:{ action:"Six stitches, held until torn loose.", effect:"Offensive BRN Kindlings hit harder, spread wider.", demand:"No speech until the stitches tear. No shouting for help. No last words." },
    devour:{ action:"Sewn through, permanently, knot buried under skin.", effect:"Thought becomes Static outright — offensive BRN reaches its ceiling, range and area both.", demand:"Speech gone. Forever." }
  },
  living:{ action:"Thread through another's lips, against their will.", effect:"Silences them; strips one spoken memory or command loose in the process.", demand:"Their silence borrows against yours — your own voice thins with each theft, until strangers hear the corpse in your throat before they hear you." },
  dead:{ action:"Sew a corpse's mouth shut, then open it again along the same stitches.", effect:"It answers what's asked. Names it shouldn't know.", demand:"None from you. The dead already paid theirs." }
},
{ id:3, group:"BRN", name:"Split the Skull", quote:"Thought was never meant to stay quiet.", theme:"Clairvoyance, Concentration.", keep:"black nail",
  self:{
    nibble:{ action:"Nail to the temple, warmed by your own Noise.", effect:"Read intent. Predict one creature's next move.", demand:"A headache that doesn't fade on its own." },
    feed:{ action:"Nail flat to the brow, held through one counted breath.", effect:"Hold two Concentration Kindlings at once.", demand:"Nosebleeds. Migraines that stack, scene to scene, until you rest properly." },
    devour:{ action:"Driven in below the hairline. Permanent.", effect:"Futures, seen constantly, passively.", demand:"The present grows harder to trust. Every choice feels already made." }
  },
  living:{ action:"Nail to another's temple, their birth-name spoken once.", effect:"Force hallucination. Rewrite a decision. Fracture identity, briefly.", demand:"Their fracture echoes back — you carry a sliver of it until the scene ends." },
  dead:{ action:"Nail through a corpse's skull, temple to temple.", effect:"Walk its last memories like rooms.", demand:"None. The memories were already spent." }
},
{ id:4, group:"BRN", name:"Static Lance", quote:"Point. Release.", theme:"Pure offense.", keep:"Red Salt",
  self:{
    nibble:{ action:"Charge at the palm, released.", effect:"Bolt strikes one target.", demand:"A burn across the palm that doesn't heal by nightfall." },
    feed:{ action:"Charge arced hand to hand before release.", effect:"Bolt pierces, strikes a line.", demand:"The burn spreads up the forearm. Grip weakens for the scene." },
    devour:{ action:"The current never fully discharges. Permanent.", effect:"Bolt splits, strikes several at once, full force.", demand:"You hum, faintly, always. Static devices near you fail. People notice." }
  },
  living:{ action:"Charge forced into another's closed fist.", effect:"Damage lands as a mental wound, armor and flesh both useless against it.", demand:"Feedback — you take a fraction of what they take, every time." },
  dead:{ action:"Charge driven into a corpse, left to settle.", effect:"Cast future Lances from its location instead of your own.", demand:"None. It's already spent everything it had." }
},
{ id:5, group:"BRN", name:"Command the Hollow", quote:"The dead do what they're told.", theme:"Corpse puppetry. Requires a prepared Witness (see Remove the Righteous Eyes, Dead Demand).", keep:"black thread",
  self:{
    nibble:{ action:"One thread, finger to wrist, one command given.", effect:"The Witness performs one small action.", demand:"A pull behind your own sternum, faint, forgettable." },
    feed:{ action:"Threads to both wrists and the jaw, worked like strings.", effect:"It walks. It repeats short phrases fed through the jaw-thread.", demand:"You feel what it feels — cold, stillness, nothing — for as long as you hold the strings." },
    devour:{ action:"Threads sewn into your own fingers, permanently. It moves when you move, untouched.", effect:"It speaks and carries itself with your cadence — near-perfect impersonation.", demand:"One permanent point of BRN, spent per hour run. No refund." }
  },
  living:{ action:"An unnoticed thread looped around a living finger, pulled once.", effect:"Force one sentence, one action, against their will.", demand:"They remember the pull, even without seeing the thread. Word gets around." },
  dead:{ action:"The full set of threads, sewn permanently into an already-prepared Witness.", effect:"Full Vessel — see, hear, speak, act through it, at will, at no further cost.", demand:"None, so long as the body holds together. When it doesn't, you feel it end." }
},
{ id:6, group:"BRN", name:"Strip to the Bone", quote:"Flesh is fuel.", theme:"Self-consumption, kinetic overdrive.", keep:"Red Salt",
  self:{
    nibble:{ action:"Powder rubbed into the forearms, sparked.", effect:"Ignore exhaustion. Minor boost to output.", demand:"Hunger food doesn't touch for the rest of the day." },
    feed:{ action:"Powder packed along the ribs, ignited against bare skin.", effect:"Increased strike damage.", demand:"You visibly thin, in front of witnesses, muscle and fat gone before their eyes." },
    devour:{ action:"A fistful swallowed, ignited from within. Permanent.", effect:"Near-skeletal, moving and striking with immense force — large permanent gains to damage and speed.", demand:"You never look fed again." }
  },
  living:{ action:"Powder forced into another's mouth, ignited.", effect:"Their body cannibalizes itself, ongoing damage, movements turned violent and yours to direct.", demand:"You taste it too — ash and iron, every round it burns." },
  dead:{ action:"Chest cavity packed, ignited.", effect:"Rises as a Husk, one action of extreme force — then gone, no remains.", demand:"None. There's nothing left to owe." }
},
{ id:7, group:"NRV", name:"Faster! Faster! Faster!", quote:"Outrun your own signal.", theme:"Movement, extra actions.", keep:"Red Salt", manifests:"one body blurs into three, red trails stacking where the last stride hasn't caught up yet.",
  self:{
    nibble:{ action:"Charge built in the legs, released before it sparks.", effect:"Double movement speed — a red pop at every heel strike.", demand:"Legs shake for the rest of the scene, faint but visible." },
    feed:{ action:"Two charges, released together.", effect:"Two full actions; the ground between each smears red before it settles.", demand:"Joints ache like they've run twice as far. They have." },
    devour:{ action:"The charge never fully discharges. Permanent.", effect:"Four full actions, blinking between each — a red afterimage stands at every point you left, fading slow.", demand:"You can't sit still anymore. Ever." }
  },
  living:{ action:"Charge forced into another's legs, triggered from range.", effect:"Their movement becomes yours — they lose what you gain.", demand:"You feel their stumble land in your own knees, after." },
  dead:{ action:"Lingering charge driven into a corpse's legs before it stiffens.", effect:"Blink to its location at will, all scene.", demand:"None. It isn't going anywhere either way." }
},
{ id:8, group:"NRV", name:"Exchange Footsteps", quote:"Pay the road.", theme:"Teleportation.", keep:"Red Salt", manifests:"the ground between old step and new stretches red, then snaps shut behind you like nothing crossed it at all.",
  self:{
    nibble:{ action:"A pinch of Red Salt struck alight at your heel, toward a point you can see.", effect:"Short blink — a red pop marks the point you left.", demand:"The burn mark fades. So does feeling in your feet, briefly." },
    feed:{ action:"Two pinches, two points, lit in the same breath.", effect:"Double range, one free blink per round; a thin red seam lingers at both crossings.", demand:"Vertigo that lingers a full round after landing." },
    devour:{ action:"A grain burned on every threshold you cross, forever.", effect:"Chain unlimited blinks, so long as each point is visible — the road behind you stays a red smear for a breath after.", demand:"You're never fully sure which step is real anymore." }
  },
  living:{ action:"Red Salt struck against another's heel, forced.", effect:"Swap two creatures' positions outright.", demand:"Whatever ground they stood on, you feel underfoot for a moment — wrong, borrowed." },
  dead:{ action:"Salt burned into the ground beneath a corpse's feet, left undisturbed.", effect:"Permanent Anchor — travel to it from anywhere.", demand:"None. Corpses don't need their feet." }
},
{ id:9, group:"NRV", name:"Drink the Lightning", quote:"Teach the nerves what thunder feels like.", theme:"Single-target electrical offense.", keep:"black nail", manifests:"the strike arrives before the crackle does — the pop and the Doppler-smear trail half a beat behind, like the sky is catching up.",
  self:{
    nibble:{ action:"Nail held between the palms until it hums.", effect:"Bolt strikes one target — a red crack in the air, gone before the sound of it arrives.", demand:"Hands numb through the next action." },
    feed:{ action:"Two nails crossed, arced before release.", effect:"Bolt chains to a second target, a stretched red afterimage strung between them.", demand:"Numbness climbs to the elbow. Fine work with the hands is off the table." },
    devour:{ action:"The nail swallowed. Permanent.", effect:"Every enemy nearby, struck at once — the whole room strobes red for a full second.", demand:"Metal near you sparks unprompted. It gets you noticed in the wrong rooms." }
  },
  living:{ action:"A nail pressed into another's palm, their hand closed around it.", effect:"They conduct — every bolt you throw this scene chains through them.", demand:"The chain runs both ways. Some of it comes back to you." },
  dead:{ action:"Nail driven into a corpse's palm.", effect:"Lightning Rod — storms and future casts converge there.", demand:"None. It's already grounded." }
},
{ id:10, group:"NRV", name:"The Static Storm", quote:"Make the sky answer to you.", theme:"Area lightning, artillery.", keep:"Red Salt", manifests:"the whole sky reddens before it commits, powder sparks drifting up to meet the bolt halfway down.",
  self:{
    nibble:{ action:"Static built across the whole body, released skyward.", effect:"One bolt, one point, area damage — the sky reddens a beat before it lands.", demand:"Ears ring the rest of the scene." },
    feed:{ action:"Held through a full breath, timed to the gap before thunder.", effect:"A second automatic strike, next turn; the red afterglow hasn't cleared before it hits again.", demand:"The ringing becomes a headache that doesn't quit." },
    devour:{ action:"A permanent charge, carried in the heartbeat.", effect:"Sustained storm, random strikes, all scene — the sky stays permanently red-tinged for as long as it holds.", demand:"Metal, glass, anything fragile nearby — it isn't always the enemy that gets hit." }
  },
  living:{ action:"Charge forced into another, held in place.", effect:"Storm converges entirely on them.", demand:"Holding them there costs your full attention — nothing else gets yours until it's done." },
  dead:{ action:"Standing charge driven into a corpse, arms raised.", effect:"Permanent Storm Well, once per scene, free.", demand:"None. It's already been struck once." }
},
{ id:11, group:"NRV", name:"Cut the Strings", quote:"The body mistakes Static for commands.", theme:"Control movement.", keep:"black thread", manifests:"the limb moves a half-beat before the thought does — a thin red afterimage catching up to where the body already went.",
  self:{
    nibble:{ action:"One knot against the skin, pulled loose.", effect:"Ignore restraints and bindings — a faint red echo trails a beat behind the limb.", demand:"Skin left raw where the knot sat." },
    feed:{ action:"Thread wound around a limb, tightened with every action.", effect:"That limb keeps working past what should disable it; the echo thickens to a visible smear.", demand:"When the scene ends, so does the limb — it needs real rest, not a bandage." },
    devour:{ action:"Thread sewn beneath the skin. Permanent.", effect:"Keep moving past what would be fatal, for the rest of the scene — a red afterimage trails every motion, permanent, unhidden.", demand:"Every scene you survive this way shortens the ones after it." }
  },
  living:{ action:"Thread tied to another's wrist, pulled taut from range.", effect:"Force one action or movement, against their will.", demand:"Whatever they were forced to do, your own hands twitch with it after." },
  dead:{ action:"Thread knotted around a corpse's wrist.", effect:"A Marionette — repeats its last living motion, forever, until destroyed.", demand:"None. It's already stopped needing rest." }
},
{ id:12, group:"NRV", name:"Strike From Everywhere", quote:"Arrive already finished.", theme:"Multi-attack via blink.", keep:"Red Salt", manifests:"four afterimages hang in the air a full second after the last hit lands — the world hasn't finished believing you moved.",
  self:{
    nibble:{ action:"A spark carries you to a target, striking on arrival.", effect:"Blink and strike once — a single red pop where you left.", demand:"Disorientation on landing — one round, half-blind." },
    feed:{ action:"A second charge held ready before the first fires.", effect:"Blink-strike two targets in sequence — two afterimages hang a beat too long.", demand:"The disorientation doubles, stacks with the first." },
    devour:{ action:"The charge sits permanently, always primed.", effect:"Blink-strike up to four targets in one action — four afterimages stacked in the air, none of them fading in time.", demand:"You start arriving places a half-second before you mean to. It shows." }
  },
  living:{ action:"Charge driven into another, marking them.", effect:"Blink to them, strike from any angle, ignore their first reaction.", demand:"Their mark lingers on your own skin until the scene ends." },
  dead:{ action:"Permanent charge driven into a corpse.", effect:"A Beacon — blink-strike anyone near it, once per scene, free.", demand:"None. It isn't reacting to anything anymore." }
},
{ id:13, group:"FRM", name:"Borrow the Shadow", quote:"Leave the body behind.", theme:"Failsafe — reactive swap, shadow travel.", keep:"Red Salt", manifests:"the shadow folds instead of stretching, a corner of it lifting like cloth in the same instant you trade places with what's underneath.",
  self:{
    nibble:{ action:"The edge of your shadow traced in powder, a Shade planted and left standing.", effect:"Once per scene, as a reaction to being struck, swap places with the Shade instantly — the blow lands on empty ground where you stood.", demand:"The Shade holds for one exchange only. Miss the moment and it's wasted — powder burned, nothing left to swap into." },
    feed:{ action:"Traced again at dusk, when shadows run longest, and given a few seconds of you to hold onto.", effect:"The swap now unwinds the last wound you took, same as it never landed. Usable twice per scene.", demand:"What gets unwound doesn't disappear — it catches up all at once when the scene ends, and you lose a round to it, dazed." },
    devour:{ action:"Burned into the ground where your shadow always falls, permanently — it stops falling there.", effect:"The swap is no longer limited — always ready, on top of full shadow travel: move bodily through your own shadow and emerge from any other you can see.", demand:"You cast no shadow at all anymore. Nothing left to swap into but the last one you set down." }
  },
  living:{ action:"Another's shadow traced and one edge ignited.", effect:"Their speed halved, yours doubled, rest of the scene.", demand:"When it ends, the drag catches up all at once — one round, slowed, same as they were." },
  dead:{ action:"A corpse's shadow traced at the moment of death, burned into the ground.", effect:"A permanent doorway — shadow-travel to and from it, always.", demand:"None. Its shadow was the last thing it had to give." }
},
{ id:14, group:"FRM", name:"The Creeping Gloom", quote:"Every shadow is a blade waiting for permission.", theme:"Shadow strikes.", keep:"black nail", manifests:"the shadow moves a beat before the strike lands, silhouette detached and already finished before the body follows through.",
  self:{
    nibble:{ action:"A nail driven into the nearest dark corner.", effect:"A tendril lashes out, strikes one target — detached from the corner a full beat before it hits.", demand:"The corner stays cold after. You'll feel it passing by again." },
    feed:{ action:"A second nail, driven into the target's own shadow.", effect:"Strikes ignore cover and distance — the shadow moves independent of anything blocking it.", demand:"Their shadow remembers you now — the next attack this scene costs nothing, the one after costs double." },
    devour:{ action:"A nail into your own shadow. Permanent.", effect:"Every shadow in the area strikes at once — silhouettes peeling off walls and floors in the same instant.", demand:"Your own shadow is armed, always — friend or stranger, it doesn't check." }
  },
  living:{ action:"A nail driven into another's shadow directly.", effect:"Their shadow turns on them automatically, every round, until destroyed or lit.", demand:"Its hunger doesn't end clean — it lingers near you after, restless." },
  dead:{ action:"A nail through a corpse's shadow, left standing.", effect:"A standing Sentinel, striking anyone but you.", demand:"None. It has nowhere else to be." }
},
{ id:15, group:"FRM", name:"Make the Dark Cut", quote:"Light it. Let what's left do the cutting.", theme:"Shadow strikes from flash and afterimage.", keep:"Red Salt", manifests:"the light doesn't fade so much as get redirected — sent sideways into a blade-shaped absence that does the actual cutting.",
  self:{
    nibble:{ action:"A line of powder struck alight.", effect:"A residual blade slashes one target as the light fades — the cut lands where the light should have been.", demand:"Your own eyes ache in bright light for the rest of the scene." },
    feed:{ action:"Ignited in a wider arc.", effect:"The blade sweeps a line, striking all in front of you — a stretch of nothing where the flare used to be.", demand:"The ache becomes real pain — disadvantage in any lit space." },
    devour:{ action:"Both hands coated, permanently, never fully burned off.", effect:"Every strike leaves a following shadow-blade, striking twice — a second cut arriving from an angle the first one never traveled.", demand:"You flinch from light now, reflexively." }
  },
  living:{ action:"Powder rubbed into another's shadow, ignited.", effect:"Their shadow cuts at them or anyone near, each round, until put out.", demand:"The light it took to arm it burns your eyes too — disadvantage on your next attack." },
  dead:{ action:"Powder packed into a corpse's eyes and mouth, ignited.", effect:"Its shadow permanently arms itself against anyone who disturbs the grave.", demand:"None. Its eyes were done seeing anyway." }
},
{ id:16, group:"FRM", name:"The Hollow Rib", quote:"Bone remembers weight it was never built for.", theme:"Momentum, density.", keep:"black nail", manifests:"the impact lands at an angle the body never traveled through — struck from a shadow that got there first.",
  self:{
    nibble:{ action:"A nail carried in a closed fist, weight matched to your stride.", effect:"Next strike, increased force — it lands at an angle your arm didn't swing through.", demand:"The hand carrying it goes numb until the scene ends." },
    feed:{ action:"The nail swallowed.", effect:"Resist knockback; strikes shockwave outward from a point beside you, not from your fist.", demand:"Every meal after tastes faintly of iron, for days." },
    devour:{ action:"The nail replaces a rib. Permanent.", effect:"Momentum becomes a crushing blow — charges and dashes hit like falling buildings, the impact arriving a beat before your body does.", demand:"Breathing never feels quite complete again." }
  },
  living:{ action:"A nail pressed to another's chest until breath comes hard around it.", effect:"Their defense drops, yours rises, rest of the scene.", demand:"Their labored breath echoes in your own chest until the scene ends." },
  dead:{ action:"A nail driven into a corpse, buried.", effect:"Nearby Negative Box Kindlings hit harder, as long as the grave stays undisturbed.", demand:"None. It's already carrying more than it can feel." }
},
{ id:17, group:"FRM", name:"Wear Their Face", quote:"Identity has a price.", theme:"Disguise, voice, presence.", keep:"Red Bone", manifests:"nothing visible — the only tell is a silhouette that doesn't quite sit still against a wall, like its shadow hasn't agreed to the new face yet.",
  self:{
    nibble:{ action:"A shard of your own bone, pressed under the skin of the cheek.", effect:"Avoid casual recognition — your shadow lags a half-beat behind the new face.", demand:"Your own face feels wrong to you, briefly, every time you touch it after." },
    feed:{ action:"The shard moved to the throat, worked in as you speak.", effect:"Unplaceable — voice and presence both; the lag becomes a visible flicker at the edges.", demand:"Your real voice takes longer to come back each time you use this." },
    devour:{ action:"The shard Kindles, permanently, fused into the jaw.", effect:"Featureless — unreadable to magic, memory, and sight alike; no shadow lag left to notice, because there's nothing underneath to catch up.", demand:"No one remembers your face anymore. Not even the people who loved it." }
  },
  living:{ action:"A shard taken from another and pressed briefly under your own skin.", effect:"Steal their appearance, voice, presence, rest of the scene.", demand:"When it ends, you forget one small true thing about your own face. It doesn't come back." },
  dead:{ action:"A shard of corpse-bone, fused under your own skin before burial.", effect:"Perfect impersonation, briefly inheriting memory and mannerism.", demand:"None. The dead don't need to remember themselves anymore." }
},
{ id:18, group:"FRM", name:"Second Corpse", quote:"One body survives. One remembers.", theme:"Shade doubles, damage transfer.", keep:"black thread", manifests:"two silhouettes on the ground where one body stands, moving a half-step out of sync with each other and with you.",
  self:{
    nibble:{ action:"Thread knotted into a small likeness, set beside your shadow.", effect:"A Shade forms; damage this round splits between you and it — a second silhouette on the ground, half a step out of sync.", demand:"You feel every hit it takes, dull, delayed, like it happened to you yesterday." },
    feed:{ action:"The likeness burned, ash falling into the shadow's shape.", effect:"The Shade can be targeted independently; carries out one Kindling from its own position — its silhouette detaches fully, moves on its own line.", demand:"Whatever it does, you're spent as if you'd done it yourself." },
    devour:{ action:"The likeness sewn under your own skin, your name knotted in. Permanent.", effect:"The Shade acts as a second, fully independent body, rest of the scene — two shadows, neither one lagging behind the other anymore.", demand:"Split attention, split self — you're never fully anywhere, the whole scene through." }
  },
  living:{ action:"A likeness of a living victim knotted and burned over their shadow.", effect:"Their Shade — whatever happens to it happens to them, including its destruction.", demand:"You feel the tether the whole time it's active — their pulse, faint, alongside yours." },
  dead:{ action:"A likeness of a corpse knotted, buried beneath the body.", effect:"Its shadow animates and separates, acting independently while the body stays still.", demand:"None. It has nowhere left to feel this from." }
}
];

const SYNERGIES = [
    { text:"[[1]] (Dead Demand: Witness) + [[5]] (Dead Demand: Vessel) — one corpse, sight and speech both.", ids:[1,5] },
    { text:"[[9]] (Living Demand: conductor) + [[10]] — a storm chained through a marked conductor.", ids:[9,10] },
    { text:"[[6]] + [[16]] — burn to bone, hit like the bone is the weapon.", ids:[6,16] },
    { text:"[[13]] + [[14]] / [[15]] — arrive already striking, from inside a blade you made.", ids:[13,14,15] },
    { text:"[[12]] + [[18]] — split the strikes, split the cost.", ids:[12,18] }
];

// ===================== STATE =====================

let state = {
    activeGroup: "BRN",
    keepFilter: null,
    activeKindling: null,
    activeStage: "nibble"
};

// ===================== SVG BODY DIAGRAMS =====================

const BODY_PATH = "M138,99 L98,121 L55,109 L12,133 L14,175 L95,167 L118,175 L112,263 L90,275 L52,453 L36,477 L64,477 L86,453 L150,293 L214,453 L236,477 L264,477 L248,453 L210,275 L188,263 L182,175 L205,167 L286,175 L288,133 L245,109 L202,121 L162,99 Z";

function headMarkup(){
    return `
        <rect x="134" y="8" width="32" height="24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>
        <path d="M142,14 L142,20 M142,14 L147,14 M158,14 L158,20 M158,14 L153,14 M142,32 L142,26 M142,32 L147,32 M158,32 L158,26 M158,32 L153,32" stroke="rgba(255,255,255,0.55)" stroke-width="1" fill="none"/>
        <circle cx="150" cy="20" r="3" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <line x1="150" y1="32" x2="150" y2="43" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
        <circle cx="150" cy="70" r="27" fill="none" stroke="var(--stroke, #fff)" stroke-width="1.4" stroke-dasharray="var(--head-dash, none)"/>
        <rect x="140" y="93" width="20" height="8" fill="none" stroke="var(--stroke, #fff)" stroke-width="1.4" stroke-dasharray="var(--head-dash, none)"/>
    `;
}

function brainSVG(){
    return `
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="60" x2="288" y2="60" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <line x1="12" y1="485" x2="288" y2="485" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        ${headMarkup()}
        <path d="${BODY_PATH}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="1.5,4.5" stroke-linecap="round"/>
    </svg>`;
}

function nerveSVG(){
    // skeleton + nervous system overlay on a dimmer dashed silhouette
    const ribs = [130,148,166,184].map(y => {
        const w = 44 - (y-130)*0.12;
        return `<path d="M${150-w},${y} Q150,${y-10} ${150+w},${y}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>`;
    }).join("");
    return `
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="60" x2="288" y2="60" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <line x1="12" y1="485" x2="288" y2="485" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        ${headMarkup()}
        <path d="${BODY_PATH}" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="1.5,5.5" opacity="0.55"/>

        <!-- spine -->
        <line x1="150" y1="99" x2="150" y2="270" stroke="#fff" stroke-width="1.5"/>
        ${ribs}
        <!-- pelvis -->
        <path d="M124,263 Q150,278 176,263" fill="none" stroke="#fff" stroke-width="1.3"/>
        <circle cx="128" cy="264" r="4" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="172" cy="264" r="4" fill="none" stroke="#fff" stroke-width="1"/>

        <!-- arm bones -->
        <line x1="98" y1="121" x2="55" y2="137" stroke="#fff" stroke-width="1.3"/>
        <line x1="55" y1="137" x2="14" y2="154" stroke="#fff" stroke-width="1.3"/>
        <circle cx="98" cy="121" r="4" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="55" cy="137" r="3.5" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="14" cy="154" r="4" fill="#fff"/>

        <line x1="202" y1="121" x2="245" y2="137" stroke="#fff" stroke-width="1.3"/>
        <line x1="245" y1="137" x2="286" y2="154" stroke="#fff" stroke-width="1.3"/>
        <circle cx="202" cy="121" r="4" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="245" cy="137" r="3.5" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="286" cy="154" r="4" fill="#fff"/>

        <!-- leg bones -->
        <line x1="112" y1="263" x2="95" y2="340" stroke="#fff" stroke-width="1.3"/>
        <line x1="95" y1="340" x2="69" y2="453" stroke="#fff" stroke-width="1.3"/>
        <circle cx="112" cy="263" r="4" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="95" cy="340" r="3.5" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="69" cy="453" r="4" fill="#fff"/>

        <line x1="188" y1="263" x2="205" y2="340" stroke="#fff" stroke-width="1.3"/>
        <line x1="205" y1="340" x2="231" y2="453" stroke="#fff" stroke-width="1.3"/>
        <circle cx="188" cy="263" r="4" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="205" cy="340" r="3.5" fill="none" stroke="#fff" stroke-width="1"/>
        <circle cx="231" cy="453" r="4" fill="#fff"/>

        <!-- nerve branch fan (thin, offset from bone lines) -->
        <path d="M150,150 Q120,150 98,121" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.7"/>
        <path d="M150,150 Q180,150 202,121" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.7"/>
        <path d="M150,250 Q128,255 112,263" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.7"/>
        <path d="M150,250 Q172,255 188,263" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.7"/>
    </svg>`;
}

function frameSVG(){
    return `
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="halftoneDots" width="5" height="5" patternUnits="userSpaceOnUse">
                <rect width="5" height="5" fill="#000"/>
                <circle cx="1.3" cy="1.3" r="1.15" fill="rgba(255,255,255,0.92)"/>
            </pattern>
            <clipPath id="bodyClip"><path d="${BODY_PATH}"/></clipPath>
        </defs>
        <line x1="12" y1="60" x2="288" y2="60" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <line x1="12" y1="485" x2="288" y2="485" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <rect x="134" y="8" width="32" height="24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>
        <path d="M142,14 L142,20 M142,14 L147,14 M158,14 L158,20 M158,14 L153,14 M142,32 L142,26 M142,32 L147,32 M158,32 L158,26 M158,32 L153,32" stroke="rgba(255,255,255,0.55)" stroke-width="1" fill="none"/>
        <circle cx="150" cy="20" r="3" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <line x1="150" y1="32" x2="150" y2="43" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>

        <circle cx="150" cy="70" r="27" fill="url(#halftoneDots)" stroke="#fff" stroke-width="1.4"/>
        <rect x="140" y="93" width="20" height="8" fill="url(#halftoneDots)" stroke="#fff" stroke-width="1.4"/>
        <rect x="0" y="0" width="300" height="500" fill="url(#halftoneDots)" clip-path="url(#bodyClip)"/>
        <path d="${BODY_PATH}" fill="none" stroke="#fff" stroke-width="1.6"/>
    </svg>`;
}

// ===================== RENDER =====================

function scramble(text){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-—";
    return text.split("").map(c => (c === " " ? c : (Math.random() < 0.55 ? alphabet[Math.floor(Math.random()*alphabet.length)] : c))).join("");
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
            glitchTimer = setTimeout(step, 35);
        } else {
            el.textContent = finalText;
            el.classList.remove("shake");
        }
    }
    step();
}

function renderKeeps(){
    const grid = document.getElementById("keepsGrid");
    grid.innerHTML = KEEPS.map(k => `
        <div class="keep-card${state.keepFilter === k.key ? " active" : ""}" data-keep="${k.key}">
            <div class="keep-name">${k.key}</div>
            <div class="keep-desc">${k.desc}</div>
        </div>
    `).join("");
    grid.querySelectorAll(".keep-card").forEach(el => {
        el.addEventListener("click", () => {
            const key = el.getAttribute("data-keep");
            state.keepFilter = (state.keepFilter === key) ? null : key;
            state.activeKindling = null;
            renderAll();
        });
    });
    renderKeepFilterNote();
}

function renderKeepFilterNote(){
    const note = document.getElementById("keepFilterNote");
    if(state.keepFilter){
        note.innerHTML = `FILTERING BY: ${state.keepFilter.toUpperCase()} <button type="button" id="clearKeepBtn">CLEAR</button>`;
        document.getElementById("clearKeepBtn").addEventListener("click", () => {
            state.keepFilter = null;
            renderAll();
        });
    } else {
        note.textContent = "";
    }
}

function renderDiagrams(){
    const row = document.getElementById("diagramRow");
    const svgFns = { BRN: brainSVG, NRV: nerveSVG, FRM: frameSVG };
    row.innerHTML = Object.keys(GROUPS).map(gKey => {
        const g = GROUPS[gKey];
        const active = (!state.keepFilter && state.activeGroup === gKey);
        return `
        <div class="scan-frame${active ? " active" : ""}" data-group="${gKey}">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            <div class="tick-col left" data-side="left"></div>
            <div class="tick-col right" data-side="right"></div>
            <div class="frame-head">
                <div class="fh-label">${g.body}</div>
                <div class="fh-sub">${g.label}</div>
            </div>
            ${svgFns[gKey]()}
            <div class="frame-code">${gKey}·${String(KINDLINGS.filter(k=>k.group===gKey).length).padStart(2,"0")}</div>
        </div>`;
    }).join("");

    row.querySelectorAll(".tick-col").forEach(col => {
        let ticks = "";
        for(let i=0;i<16;i++){
            ticks += `<div class="tick ${i % 3 === 0 ? "long" : "short"}"></div>`;
        }
        col.innerHTML = ticks;
    });

    row.querySelectorAll(".scan-frame").forEach(el => {
        el.addEventListener("click", () => {
            state.activeGroup = el.getAttribute("data-group");
            state.keepFilter = null;
            state.activeKindling = null;
            renderAll();
            document.getElementById("kindlingGrid").scrollIntoView({ behavior:"smooth", block:"start" });
        });
    });
}

function activeList(){
    if(state.keepFilter){
        return KINDLINGS.filter(k => k.keep.toLowerCase().includes(state.keepFilter.toLowerCase()));
    }
    return KINDLINGS.filter(k => k.group === state.activeGroup);
}

function renderBanner(){
    const banner = document.getElementById("activeGroupBanner");
    if(state.keepFilter){
        banner.innerHTML = `SHOWING: <strong>${activeList().length} KINDLING${activeList().length===1?"":"S"}</strong> REQUIRING ${state.keepFilter.toUpperCase()}, ACROSS ALL GROUPS`;
    } else {
        const g = GROUPS[state.activeGroup];
        banner.innerHTML = `ACTIVE GROUP: <strong>${g.body} — ${g.label} (${state.activeGroup})</strong> · "${g.tagline}"`;
    }
}

function renderGrid(){
    const grid = document.getElementById("kindlingGrid");
    const list = activeList();
    grid.innerHTML = list.map(k => `
        <div class="kindling-card${state.activeKindling === k.id ? " active" : ""}" data-id="${k.id}">
            <div class="kc-num">${String(k.id).padStart(2,"0")} · ${k.group}${state.keepFilter ? " · " + GROUPS[k.group].label : ""}</div>
            <div class="kc-name">${k.name}</div>
            <div class="kc-quote">"${k.quote}"</div>
            <div class="kc-meta">KEEP: ${k.keep}</div>
        </div>
    `).join("");
    grid.querySelectorAll(".kindling-card").forEach(el => {
        el.addEventListener("click", () => {
            const id = parseInt(el.getAttribute("data-id"), 10);
            state.activeKindling = (state.activeKindling === id) ? null : id;
            state.activeStage = "nibble";
            renderGrid();
            renderDetail();
            if(state.activeKindling){
                document.getElementById("detailPanel").scrollIntoView({ behavior:"smooth", block:"start" });
            }
        });
    });
}

function selectKindling(id){
    const k = KINDLINGS.find(x => x.id === id);
    if(!k) return;
    state.keepFilter = null;
    state.activeGroup = k.group;
    state.activeKindling = id;
    state.activeStage = "nibble";
    renderAll();
    document.getElementById("detailPanel").scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderDetail(){
    const panel = document.getElementById("detailPanel");
    const k = KINDLINGS.find(x => x.id === state.activeKindling);
    if(!k){
        panel.classList.remove("show");
        panel.innerHTML = "";
        return;
    }
    panel.classList.add("show");
    const stages = ["nibble","feed","devour"];
    panel.innerHTML = `
        <div class="detail-eyebrow">${GROUPS[k.group].body} · ${GROUPS[k.group].label} (${k.group}) — RITUAL ${String(k.id).padStart(2,"0")}/18</div>
        <div class="detail-name" id="detailName">${k.name.toUpperCase()}</div>
        <div class="detail-quote">"${k.quote}"</div>
        <div class="tag-row">
            <div class="tag">THEME: ${k.theme}</div>
            <div class="tag">KEEP: ${k.keep}</div>
        </div>
        ${k.manifests ? `<div class="manifest-line">MANIFESTS: ${k.manifests}</div>` : ""}

        <div class="stage-block">
            <h3 style="margin-bottom:10px;">Self</h3>
            <div class="stage-tabs" id="stageTabs">
                ${stages.map(s => `<button type="button" class="stage-tab${state.activeStage===s?" active":""}" data-stage="${s}">${s}</button>`).join("")}
            </div>
            <div class="stage-body" id="stageBody"></div>
        </div>

        <div class="demand-block living">
            <div class="demand-head">Living Demand</div>
            <div class="stage-row"><div class="stage-label">Rite</div><div class="stage-text">${k.living.action}</div></div>
            <div class="stage-row"><div class="stage-label">Effect</div><div class="stage-text">${k.living.effect}</div></div>
            <div class="stage-row"><div class="stage-label">Demand</div><div class="stage-text demand">${k.living.demand}</div></div>
        </div>

        <div class="demand-block dead">
            <div class="demand-head">Dead Demand</div>
            <div class="stage-row"><div class="stage-label">Rite</div><div class="stage-text">${k.dead.action}</div></div>
            <div class="stage-row"><div class="stage-label">Effect</div><div class="stage-text">${k.dead.effect}</div></div>
            <div class="stage-row"><div class="stage-label">Demand</div><div class="stage-text demand">${k.dead.demand}</div></div>
        </div>

        <button type="button" class="detail-close" id="closeDetailBtn">CLOSE RECORD</button>
    `;

    renderStageBody(k);

    panel.querySelectorAll(".stage-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            state.activeStage = btn.getAttribute("data-stage");
            panel.querySelectorAll(".stage-tab").forEach(b => b.classList.toggle("active", b === btn));
            renderStageBody(k);
            revealText(document.getElementById("detailName"), k.name.toUpperCase());
        });
    });

    document.getElementById("closeDetailBtn").addEventListener("click", () => {
        state.activeKindling = null;
        renderGrid();
        renderDetail();
    });
}

function renderStageBody(k){
    const body = document.getElementById("stageBody");
    const s = k.self[state.activeStage];
    body.innerHTML = `
        <div class="stage-row"><div class="stage-label">Rite</div><div class="stage-text">${s.action}</div></div>
        <div class="stage-row"><div class="stage-label">Effect</div><div class="stage-text">${s.effect}</div></div>
        <div class="stage-row"><div class="stage-label">Demand</div><div class="stage-text demand">${s.demand}</div></div>
    `;
}

function renderSynergies(){
    const list = document.getElementById("synergyList");
    list.innerHTML = SYNERGIES.map(s => {
        let html = s.text;
        s.ids.forEach(id => {
            const k = KINDLINGS.find(x => x.id === id);
            html = html.replace(`[[${id}]]`, `<span class="sk" data-id="${id}">${k.name}</span>`);
        });
        return `<li class="synergy-item">${html}</li>`;
    }).join("");
    list.querySelectorAll(".sk").forEach(el => {
        el.addEventListener("click", () => selectKindling(parseInt(el.getAttribute("data-id"),10)));
    });
}

function renderAll(){
    renderKeeps();
    renderDiagrams();
    renderBanner();
    renderGrid();
    renderDetail();
}

document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    renderSynergies();
});

console.log("KINDLING ARCHIVE ONLINE — 18 RITUALS LOADED");
