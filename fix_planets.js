const fs = require('fs');
const file = require('path').join(__dirname, 'style.css');
let css = fs.readFileSync(file, 'utf8');

// Old block to replace (lines 1008-1048)
const OLD = `/* Spread planets evenly around the ring using CSS custom properties
   Each planet is rotated to its slice, then counter-rotated to face up.
   The ring rotation does the actual orbiting. */

/* \u2500\u2500 Skills ring: 5 planets, 72\u00b0 apart \u2500\u2500 */
.ring-skills .orbit-planet:nth-child(1) {
    transform: translateX(-50%) rotate(0deg) translateY(0);
}

.ring-skills .orbit-planet:nth-child(2) {
    transform: translateX(-50%) rotate(72deg) translateY(0);
}

.ring-skills .orbit-planet:nth-child(3) {
    transform: translateX(-50%) rotate(144deg) translateY(0);
}

.ring-skills .orbit-planet:nth-child(4) {
    transform: translateX(-50%) rotate(216deg) translateY(0);
}

.ring-skills .orbit-planet:nth-child(5) {
    transform: translateX(-50%) rotate(288deg) translateY(0);
}

/* \u2500\u2500 Projects ring: 4 planets, 90\u00b0 apart \u2500\u2500 */
.ring-projects .orbit-planet:nth-child(1) {
    transform: translateX(-50%) rotate(0deg) translateY(0);
}

.ring-projects .orbit-planet:nth-child(2) {
    transform: translateX(-50%) rotate(90deg) translateY(0);
}

.ring-projects .orbit-planet:nth-child(3) {
    transform: translateX(-50%) rotate(180deg) translateY(0);
}

.ring-projects .orbit-planet:nth-child(4) {
    transform: translateX(-50%) rotate(270deg) translateY(0);
}`;

const NEW = `/*
 * PLANET PLACEMENT using transform-origin technique.
 * Each planet sits at position top:-20px, left:50% on its ring.
 * transform-origin pivots the planet around the ring centre.
 * Rotating the planet places it at its starting angle.
 * The RING's animation then carries all planets in orbit.
 */

/* Skills ring: clamp width ~310px, radius ~155px */
.ring-skills .orbit-planet { transform-origin: 20px 175px; }
.ring-skills .orbit-planet:nth-child(1) { transform: rotate(  0deg); }
.ring-skills .orbit-planet:nth-child(2) { transform: rotate( 72deg); }
.ring-skills .orbit-planet:nth-child(3) { transform: rotate(144deg); }
.ring-skills .orbit-planet:nth-child(4) { transform: rotate(216deg); }
.ring-skills .orbit-planet:nth-child(5) { transform: rotate(288deg); }

/* Projects ring: clamp width ~410px, radius ~205px */
.ring-projects .orbit-planet { transform-origin: 18px 223px; }
.ring-projects .orbit-planet:nth-child(1) { transform: rotate(  0deg); }
.ring-projects .orbit-planet:nth-child(2) { transform: rotate( 90deg); }
.ring-projects .orbit-planet:nth-child(3) { transform: rotate(180deg); }
.ring-projects .orbit-planet:nth-child(4) { transform: rotate(270deg); }`;

// Normalise CRLF to LF for matching 
const cssNorm = css.replace(/\r\n/g, '\n');
const oldNorm = OLD.replace(/\r\n/g, '\n');

if (cssNorm.includes(oldNorm)) {
    const updated = cssNorm.replace(oldNorm, NEW);
    fs.writeFileSync(file, updated.replace(/\n/g, '\r\n'), 'utf8');
    console.log('SUCCESS: planet placement replaced');
} else {
    console.log('ERROR: block not found. Snippet of file around line 1008:');
    const lines = cssNorm.split('\n');
    console.log(lines.slice(1005, 1050).join('\n'));
}
