/* Report, for each class the two topic apps use, whether the merged
   stylesheet defines it anywhere in a selector. */
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(R, 'styles.css'), 'utf8');

const files = ['src/identity/app.js', 'src/frac/app.js'];
const used = new Map();
for (const f of files) {
  const s = fs.readFileSync(path.join(R, f), 'utf8');
  for (const m of s.matchAll(/el\('[a-z]+',\s*'([^']+)'/g))
    m[1].split(/\s+/).forEach(c => used.set(c, f));
  for (const m of s.matchAll(/className\s*=\s*'([^']+)'/g))
    m[1].split(/\s+/).forEach(c => used.set(c, f));
  for (const m of s.matchAll(/classList\.(?:add|toggle|remove)\('([^']+)'/g))
    used.set(m[1], f);
  for (const m of s.matchAll(/'([a-z-]*(?:lvl|done|tried|ok|bad|mid)[a-z-]*)'/g))
    used.set(m[1], f);
}
/* dynamic class names the apps build by concatenation */
['lvl1', 'lvl2', 'qcell', 'solved', 'tried', 'picked-wrong', 'reveal-ok']
  .forEach(c => { if (!used.has(c)) used.set(c, '(dynamic)'); });

const missing = [];
for (const [c, f] of [...used].sort()) {
  if (!c) continue;
  const rx = new RegExp('\\.' + c.replace(/[-/]/g, '\\-') + '\\b');
  if (!rx.test(css)) missing.push(c + '  (' + path.basename(f) + ')');
}
console.log('used:', used.size, '| missing from styles.css:', missing.length);
console.log(missing.join('\n'));
