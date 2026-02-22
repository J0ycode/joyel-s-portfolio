const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'style.css');
let css = fs.readFileSync(cssFile, 'utf8').replace(/\r\n/g, '\n');

// ── Find the orbit block start and end markers ──
const START_MARKER = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   SOLAR ORBIT SYSTEM';
const END_MARKER = '/* \u2500\u2500 SCROLL HINT \u2500\u2500 */';

const startIdx = css.indexOf(START_MARKER);
const endIdx = css.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
    console.log('ERROR: markers not found');
    console.log('start found:', startIdx !== -1);
    console.log('end found:', endIdx !== -1);
    process.exit(1);
}

const NEW_ORBIT_CSS = `/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   PREMIUM SOLAR ORBIT SYSTEM
   Two concentric rings around the JJJ core.
   Inner = Skills (gold accent, 6 planets)
   Outer = Projects (indigo accent, 4 planets)
   GSAP drives all rotation (replaces CSS keyframes).
   Hover: slow ring, glow planet, show tooltip.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

/* \u2500\u2500 Core glow \u2500\u2500 */
.core-glow {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
    animation: coreGlow 4s ease-in-out infinite;
    pointer-events: none;
}
@keyframes coreGlow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.08); }
}

/* \u2500\u2500 Orbit ring containers \u2500\u2500 */
.orbit-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    /* GSAP will own rotation — no CSS animation here */
    will-change: transform;
    pointer-events: none; /* ring itself not interactive */
}

.orbit-ring.ring-skills {
    width:  clamp(220px, 60%, 300px);
    height: clamp(220px, 60%, 300px);
    border: 1px solid rgba(212, 175, 55, 0.25);
    box-shadow: 0 0 30px rgba(212,175,55,0.06) inset,
                0 0 60px rgba(212,175,55,0.04);
}

.orbit-ring.ring-projects {
    width:  clamp(300px, 82%, 400px);
    height: clamp(300px, 82%, 400px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 0 30px rgba(99,102,241,0.05) inset,
                0 0 60px rgba(99,102,241,0.04);
}

/* \u2500\u2500 Planet base \u2500\u2500 */
.orbit-planet {
    position: absolute;
    /* JS (GSAP) positions each planet via top/left + translate */
    width:  44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: all; /* planets ARE interactive */
    z-index: 10;
    /* Smooth hover transitions */
    transition: box-shadow 0.35s ease, background 0.35s ease;
}

/* Skills planets — gold theme */
.ring-skills .orbit-planet {
    background: rgba(12, 12, 18, 0.85);
    border: 1px solid rgba(212,175,55,0.45);
    box-shadow: 0 0 12px rgba(212,175,55,0.15),
                inset 0 1px 0 rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.ring-skills .orbit-planet:hover {
    background: rgba(212,175,55,0.12);
    border-color: rgba(212,175,55,0.9);
    box-shadow: 0 0 24px rgba(212,175,55,0.55),
                0 0 48px rgba(212,175,55,0.2),
                inset 0 1px 0 rgba(212,175,55,0.2);
}

/* Projects planets — indigo theme */
.ring-projects .orbit-planet {
    width: 40px;
    height: 40px;
    background: rgba(12, 12, 24, 0.85);
    border: 1px solid rgba(99,102,241,0.4);
    box-shadow: 0 0 12px rgba(99,102,241,0.15),
                inset 0 1px 0 rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.ring-projects .orbit-planet:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.9);
    box-shadow: 0 0 24px rgba(99,102,241,0.55),
                0 0 48px rgba(99,102,241,0.2),
                inset 0 1px 0 rgba(99,102,241,0.2);
}

/* \u2500\u2500 Planet icon \u2500\u2500 */
.planet-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.3s;
    /* GSAP keeps icon upright via counter-rotation on this element */
}

.ring-skills .planet-icon  { color: var(--gold); }
.ring-projects .planet-icon { color: #818cf8; }

.orbit-planet:hover .planet-icon {
    transform: scale(1.2);
}

/* \u2500\u2500 Glassmorphism tooltip \u2500\u2500 */
.planet-tooltip {
    position: absolute;
    /* Position above the planet by default; GSAP adjusts if near edge */
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%) translateY(6px);
    background: rgba(8, 8, 16, 0.88);
    border-radius: 10px;
    padding: 8px 14px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.3,0.64,1);
    z-index: 100;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* The tooltip inherits the planet's glow color via custom prop */
    border: 1px solid var(--tt-border, rgba(212,175,55,0.35));
    box-shadow: 0 8px 32px rgba(0,0,0,0.6),
                0 0 1px var(--tt-border, rgba(212,175,55,0.3));
}

.ring-skills .planet-tooltip  { --tt-border: rgba(212,175,55,0.4); }
.ring-projects .planet-tooltip { --tt-border: rgba(99,102,241,0.4); }

.orbit-planet:hover .planet-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Small notch under tooltip */
.planet-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--tt-border, rgba(212,175,55,0.3));
}

.pt-name {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
}

.ring-skills  .pt-name { color: var(--gold); }
.ring-projects .pt-name { color: #a5b4fc; }

.pt-desc {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.04em;
}

/* \u2500\u2500 Mobile card fallback \u2500\u2500 */
.orbit-mobile-cards {
    display: none; /* hidden on desktop; shown on mobile via media query */
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    width: 100%;
    padding: 0.5rem 0;
}

.omc-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.7rem 0.4rem;
    border-radius: 10px;
    background: rgba(12,12,18,0.8);
    border: 1px solid rgba(212,175,55,0.25);
    backdrop-filter: blur(8px);
    font-size: 0.65rem;
    color: var(--gold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 600;
    transition: transform 0.25s, box-shadow 0.25s;
}

.omc-card i { font-size: 1.2rem; }

.omc-card.proj {
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
}

.omc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(212,175,55,0.15);
}

.omc-card.proj:hover {
    box-shadow: 0 8px 24px rgba(99,102,241,0.2);
}

`;

const before = css.slice(0, startIdx);
const after = css.slice(endIdx);
const result = before + NEW_ORBIT_CSS + after;

fs.writeFileSync(cssFile, result.replace(/\n/g, '\r\n'), 'utf8');
console.log('CSS orbit block replaced successfully.');
console.log('New file size:', result.length, 'chars');
