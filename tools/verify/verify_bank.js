/* Structural + numeric checks on js/data.js */
const fs = require('fs'), vm = require('vm');
const ctx = vm.createContext({ module: undefined, console });
vm.runInContext(fs.readFileSync(__dirname + '/../js/engine.js','utf8'), ctx, {filename:'engine.js'});
vm.runInContext(fs.readFileSync(__dirname + '/../js/data.js','utf8'), ctx, {filename:'data.js'});
const { BANK, SETS } = vm.runInContext('({BANK:BANK, SETS:SETS})', ctx);
const parseExpr = vm.runInContext('parseExpr', ctx);
const evalAST  = vm.runInContext('evalAST', ctx);
const astVars  = vm.runInContext('astVars', ctx);
const F        = vm.runInContext('F', ctx);

let fail = 0, warn = 0;
const seen = new Set();
for (const q of BANK) {
  if (seen.has(q.id)) { console.log('DUP id', q.id); fail++; }
  seen.add(q.id);
  for (const k of ['id','n','lvl','fam','type','prompt','ans','hints','steps'])
    if (q[k] === undefined) { console.log('MISSING', k, 'in', q.id); fail++; }
  if (!Array.isArray(q.hints) || q.hints.length === 0) { console.log('BAD hints', q.id); fail++; }
  if (!Array.isArray(q.steps) || q.steps.length === 0) { console.log('BAD steps', q.id); fail++; }
  for (const s of q.steps) if (typeof s.m !== 'string') { console.log('BAD step', q.id); fail++; }

  if (q.type === 'expr') {
    let ast;
    try { ast = parseExpr(q.ans); } catch (e) { console.log('PARSE FAIL', q.id, q.ans, e.message); fail++; continue; }
    // must contain at least one variable of the prompt (sanity: not a constant)
    try {
      const pv = astVars(parseExpr(q.prompt.replace(/\\text\{[^}]*\}/g,'').replace(/\\[a-zA-Z]+/g,'')));
      const av = astVars(ast);
      if (pv.length && av.length && !av.some(v => pv.includes(v))) { console.log('VARS MISMATCH', q.id, pv, av); warn++; }
    } catch(e) { /* prompt may not be parseable; skip */ }
    // numeric evaluate at a point (must not throw)
    try {
      const env = {}; for (const v of astVars(ast)) env[v] = F(3);
      evalAST(ast, env);
    } catch (e) { console.log('EVAL FAIL', q.id, q.ans, e.message); fail++; }
  } else if (q.type === 'num') {
    if (!/^-?\d+(\/\d+)?$/.test(String(q.ans).trim())) { console.log('NUM FORMAT', q.id, JSON.stringify(q.ans)); warn++; }
  } else if (q.type === 'yn') {
    if (!['yes','no'].includes(q.ans)) { console.log('YN FORMAT', q.id, q.ans); fail++; }
  } else if (q.type === 'mcq') {
    const i = Number(q.ans);
    if (!(i >= 0 && i < q.opts.length)) { console.log('MCQ INDEX', q.id, q.ans, q.opts && q.opts.length); fail++; }
    if (!q.opts || q.opts.length !== 4) { console.log('MCQ OPTS', q.id); fail++; }
    const letters = ['A','B','C','D'];
    if (q.ansTex !== letters[i]) { console.log('MCQ LETTER', q.id, q.ansTex, 'expected', letters[i]); fail++; }
  }
}

/* SETS integrity */
let inSets = new Set();
for (const s of SETS) for (const id of s.ids) {
  if (!seen.has(id)) { console.log('SET REF MISSING', s.id, id); fail++; }
  if (inSets.has(id)) { console.log('Q IN TWO SETS', id); warn++; }
  inSets.add(id);
}
for (const q of BANK) if (!inSets.has(q.id)) { console.log('Q NOT IN ANY SET', q.id); warn++; }

console.log('\nBANK size', BANK.length, '| SETS', SETS.length);
console.log('missing-from-sets:', BANK.filter(q=>!inSets.has(q.id)).map(q=>q.id).join(',') || 'none');
console.log(fail === 0 ? 'BANK STRUCTURE OK' : ('BANK FAILURES: ' + fail));
console.log('warnings:', warn);
process.exit(fail ? 1 : 0);
