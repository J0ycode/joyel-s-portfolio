const fs = require('fs');
const path = require('path');

// ── Clean HTML: remove orphaned lines 338-379 (0-indexed: 337-378) ──
const htmlFile = path.join(__dirname, 'index.html');
let htmlLines = fs.readFileSync(htmlFile, 'utf8').split('\n');
// Remove lines 338..379 (1-indexed), i.e., indices 337..378
htmlLines.splice(337, 42); // 379-338+1 = 42 lines
fs.writeFileSync(htmlFile, htmlLines.join('\n'), 'utf8');
console.log('HTML cleaned. New line count:', htmlLines.length);
