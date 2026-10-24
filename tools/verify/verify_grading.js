/* For every question in the bank, confirm that
   (a) the stored `ans` converts to a rational expression, and
   (b) students' plausible alternative forms are accepted, wrong ones rejected. */
const fs = require('fs'), vm = require('vm');
const ctx = vm.createContext({ module: undefined, console });
vm.runInContext(fs.readFileSync(__dirname + '/../js/engine.js', 'utf8'), ctx, { filename: 'engine.js' });
vm.runInContext(fs.readFileSync(__dirname + '/../js/data.js', 'utf8'), ctx, { filename: 'data.js' });
const BANK = vm.runInContext('BANK', ctx);
const { ratFromExpr, checkAnswer, checkNumber, F, Poly, ratToLatex } = vm.runInContext(
  '({ratFromExpr, checkAnswer, checkNumber, F, Poly, ratToLatex})', ctx);

let fail = 0, tested = 0;
for (const q of BANK) {
  if (q.type !== 'expr') continue;
  let R;
  try { R = ratFromExpr(q.ans); }
  catch (e) { console.log('CONVERT FAIL', q.id, q.ans, e.message); fail++; continue; }
  // the answer itself must be accepted
  const r = checkAnswer(q.ans, R);
  tested++;
  if (!r.ok) { console.log('SELF REJECT', q.id, q.ans); fail++; continue; }
  // an equivalent written differently must also pass
  const alt = q.ans.replace(/\/(\d+)/g, (m, n) => '/(' + n + ')');
  if (alt !== q.ans && !checkAnswer(alt, R).ok) { console.log('ALT REJECT', q.id, alt); fail++; }
  // an obviously different answer must be refused
  if (checkAnswer(q.ans + '+1', R).ok) { console.log('WRONG ACCEPTED', q.id, q.ans + '+1'); fail++; }
}
/* numeric answers */
for (const q of BANK) {
  if (q.type !== 'num') continue;
  const v = String(q.ans).includes('/') ? (() => { const [a, b] = q.ans.split('/'); return F(Number(a), Number(b)); })() : F(Number(q.ans));
  tested++;
  if (!checkNumber(q.ans, v).ok) { console.log('NUM SELF REJECT', q.id, q.ans); fail++; }
  if (checkNumber(String(Number(q.ans) + 1 || 999), v).ok) { console.log('NUM WRONG ACCEPTED', q.id); fail++; }
}
console.log('grading pairs tested:', tested);
console.log(fail === 0 ? 'GRADING OK' : ('GRADING FAILURES: ' + fail));
process.exit(fail ? 1 : 0);
