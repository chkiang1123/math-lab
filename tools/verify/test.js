/* Headless test: run every generator 300x, validate output */
const fs = require('fs');
const vm = require('vm');
const ctx = { console, Math, window: {}, document: undefined };
vm.createContext(ctx);
for (const f of ['engine.js', 'gens.js', 'data.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx, { filename: f });
}
const { BANK, SETS } = vm.runInContext('({ BANK, SETS })', ctx);
const gens = ['genIdentity','genFindAB','genFindABC','genExpandDiffSq','genExpandSq','genFactorCommon','genFactorBinom','genFactorGrouping','genFactorDiffSq','genFactorPerfectSq','genL2','genSubstitution','genTwoSquares','genNumTrick','genGivenSum','genMcqIdentity','genMcqConstants','genMcqExpand','genMcqFactor','genMcqHasFactor','genMcqFactorOf'];

let fails = 0;
function check(g, name) {
  const errs = [];
  if (!g || !g.kind) { return ['no object']; }
  if (g.kind === 'multi') {
    if (!g.parts || !g.parts.length) return ['multi needs parts'];
    g.parts.forEach((p, i) => {
      if (!p.q || !String(p.q).includes('$')) errs.push('part ' + i + ' bad q');
      if (!p.hints || !p.hints.length) errs.push('part ' + i + ' no hints');
      if (!p.steps || !p.steps.length) errs.push('part ' + i + ' no steps');
      if (p.kind === 'text' && (!p.accept || !p.accept.length)) errs.push('part ' + i + ' no accept');
      if (p.kind === 'numeric' && typeof p.answer !== 'number') errs.push('part ' + i + ' no answer');
      if (p.kind === 'mcq' && (!p.options || p.options.filter(o => o.correct).length !== 1)) errs.push('part ' + i + ' mcq bad');
    });
    return errs;
  }
  if (!g.q || typeof g.q !== 'string' || g.q.length < 5) errs.push('bad q');
  if (!g.hints || !g.hints.length) errs.push('no hints');
  if (!g.steps || !g.steps.length) errs.push('no steps');
  if (g.kind === 'text' && (!g.accept || !g.accept.length)) errs.push('no accept');
  if (g.kind === 'constants' && (!g.vars || !g.values || g.vars.length !== g.values.length)) errs.push('bad constants');
  if (g.kind === 'mcq') {
    if (!g.options || g.options.length !== 4) errs.push('mcq needs 4 options');
    else if (g.options.filter(o => o.correct).length !== 1) errs.push('mcq needs exactly 1 correct');
  }
  return errs;
}
// per named gen
for (const name of gens) {
  const fn = ctx[name];
  if (typeof fn !== 'function') { console.log('MISSING GEN:', name); fails++; continue; }
  for (let i = 0; i < 300; i++) {
    let g;
    try { g = fn(); } catch (e) { console.log('THROW', name, i, e.message); fails++; break; }
    const errs = check(g, name);
    if (errs.length) { console.log('FAIL', name, 'iter', i, errs.join('; '), JSON.stringify(g).slice(0, 300)); fails++; break; }
  }
}
// per-question gens (if defined directly)
for (const [id, q] of Object.entries(BANK)) {
  if (typeof q.gen === 'function' && !gens.includes(q.gen.name)) {
    for (let i = 0; i < 100; i++) {
      let g; try { g = q.gen(); } catch (e) { console.log('THROW qgen', id, e.message); fails++; break; }
      const errs = check(g, id);
      if (errs.length) { console.log('FAIL qgen', id, errs.join('; ')); fails++; break; }
    }
  }
}
// verify every static question has required fields
for (const [id, q] of Object.entries(BANK)) {
  const errs = [];
  if (!q.q) errs.push('no q');
  if (!q.hints || !q.hints.length) errs.push('no hints');
  if (!q.steps && q.kind !== 'multi') errs.push('no steps');
  if (q.kind === 'text' && (!q.accept || !q.accept.length)) errs.push('no accept');
  if (q.kind === 'constants' && q.vars.length !== q.values.length) errs.push('bad values');
  if (q.kind === 'mcq' && q.options.filter(o => o.correct).length !== 1) errs.push('mcq bad');
  if (q.kind === 'multi') q.parts.forEach((p, i) => {
    if (!p.hints || !p.hints.length) errs.push('part' + i + ' no hints');
    if (!p.steps || !p.steps.length) errs.push('part' + i + ' no steps');
  });
  if (errs.length) { console.log('STATIC FAIL', id, errs.join('; ')); fails++; }
}
// sanity: answer-checker roundtrip on a few known answers
const t = (inp, acc) => ctx.checkText(inp, acc);
const r1 = t('(3x-5z)(2y+z)', ['(2y+z)(3x-5z)']);
const r2 = t('2q(p^2+4)(p-2)(p+2)', ['2q(p^2+4)(p+2)(p-2)']);
const r3 = t('25u²−16', ['25u^2-16']);
const r4 = t('-2y^2(7x-2)', ['2y^2(2-7x)']) || t('2y^2(2-7x)', ['-2y^2(7x-2)']);
const r5 = t('(x+4y)^2', ['(x+4y)^2']) && t('(x+4y)(x+4y)', ['(x+4y)^2']);
const r6 = t('16/3a^2-3b^2', ['16/3a^2-3b^2']) && t('(16/3)a^2-3b^2', ['16/3a^2-3b^2']);
console.log('checker:', [r1, r2, r3, r4, r5, r6].join(','));
if (![r1, r2, r3, r4, r5, r6].every(Boolean)) fails++;
console.log(fails === 0 ? 'ALL TESTS PASSED' : fails + ' FAILURES');
process.exit(fails ? 1 : 0);
