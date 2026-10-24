/* Pull the CSS rules identity-lab needs that are absent from the merged
   (frac-lab based) stylesheet, and print them for review. */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', '..', 'identity-lab', 'styles.css');
const css = fs.readFileSync(SRC, 'utf8');

const want = ['const-in', 'const-lab', 'const-row', 'danger', 'home-top',
  'math-inline', 'math-display', 'sim', 'text-in', 'wide', 'xp-chip',
  'feedback', 'mcq-list', 'mcq-opt', 'reveal-ok', 'picked-wrong',
  'fb-ok', 'fb-bad', 'fb-title', 'fb-sub', 'fb-ans', 'hint', 'step',
  'crumb', 'qcard', 'qtext', 'skill-tag', 'setbar', 'dot', 'qgrid'];


/* crude rule splitter — good enough for flat, non-nested CSS */
const rules = [];
const re = /([^{}]+)\{([^{}]*)\}/g;
let m;
while ((m = re.exec(css))) rules.push({ sel: m[1].trim().replace(/\s+/g, ' '), body: m[2].trim() });

const out = [];
for (const w of want) {
  const rx = new RegExp('\\.' + w + '\\b');
  const hit = rules.filter(r => rx.test(r.sel));
  out.push(hit.length
    ? '/* --- ' + w + ' --- */\n' + hit.map(r => r.sel + ' {\n  ' + r.body + '\n}').join('\n')
    : '/* no rule found: ' + w + ' */');
}
console.log(out.join('\n\n'));
