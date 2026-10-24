/* Verify static question LaTeX === stored accept answer (for expand/factorise questions) */
const fs = require('fs');
const vm = require('vm');
const ctx = { console, Math };
vm.createContext(ctx);
for (const f of ['engine.js', 'gens.js', 'data.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx, { filename: f });
}
const { BANK, Poly, F } = vm.runInContext('({ BANK, Poly, F })', ctx);

function polyKey(p) { return p.sortedTerms().map(t => Poly.key(t.m) + '#' + t.c.n + '/' + t.c.d).join('|'); }

/* --- minimal LaTeX polynomial parser (supports \frac, [], ^{}, cdot, times) --- */
function parseLatex(s) {
  s = s.replace(/\\left|\\right|\\,|\\quad/g, '').replace(/\s+/g, '');
  let i = 0;
  const isFrac = () => s.slice(i, i + 6) === '\\dfrac' || s.slice(i, i + 5) === '\\frac';
  const fracName = () => s.slice(i, i + 6) === '\\dfrac' ? 6 : 5;
  function readBrace() {
    if (s[i] !== '{') { return s[i++]; }
    let d = 0, start = i;
    for (let j = i; j < s.length; j++) {
      if (s[j] === '{') d++;
      if (s[j] === '}') { d--; if (d === 0) { const v = s.slice(start + 1, j); i = j + 1; return v; } }
    }
    throw new Error('unclosed brace in ' + s);
  }
  function expr() {
    let left = term();
    while (i < s.length && (s[i] === '+' || s[i] === '-')) {
      const op = s[i++];
      const r = term();
      left = op === '+' ? left.add(r) : left.sub(r);
    }
    return left;
  }
  function term() {
    let left = factor();
    for (;;) {
      if (i >= s.length) break;
      const c = s[i];
      if (c === '/') { // constant divisor: p^2/4
        i++;
        let n = '';
        while (i < s.length && s[i] >= '0' && s[i] <= '9') n += s[i++];
        left = left.scale(F(1, parseInt(n)));
        continue;
      }
      if (c === '\\') {
        if (s.slice(i, i + 5) === '\\cdot') { i += 5; left = left.mul(factor()); continue; }
        if (s.slice(i, i + 6) === '\\times') { i += 6; left = left.mul(factor()); continue; }
        if (isFrac()) { left = left.mul(factor()); continue; } // implicit: 2\frac{1}{2}
        break;
      }
      if (/[0-9a-zA-Z]/.test(c) || c === '(' || c === '[') { left = left.mul(factor()); continue; }
      break;
    }
    return left;
  }
  function factor() {
    let neg = false;
    while (s[i] === '-') { neg = !neg; i++; }
    if (s[i] === '+') i++;
    let base = atom();
    if (s[i] === '^') {
      i++;
      let e;
      if (s[i] === '{') { e = parseInt(readBrace()); }
      else { e = parseInt(s[i]); i++; }
      base = base.pow(e);
    }
    return neg ? base.neg() : base;
  }
  function atom() {
    const c = s[i];
    if (c >= '0' && c <= '9') {
      let n = '';
      while (i < s.length && s[i] >= '0' && s[i] <= '9') n += s[i++];
      return Poly.c(parseInt(n));
    }
    if (/[a-zA-Z]/.test(c)) { i++; return Poly.v(c); }
    if (c === '(' || c === '[') { i++; const e = expr(); if (s[i] !== ')' && s[i] !== ']') throw new Error('missing ) in ' + s); i++; return e; }
    if (isFrac()) {
      i += fracName();
      const numStr = readBrace(), denStr = readBrace();
      const num = parseLatex(numStr);
      const den = parseLatex(denStr);
      const dts = den.sortedTerms();
      if (dts.length !== 1 || Object.keys(dts[0].m).length > 0) throw new Error('non-constant denominator in ' + s);
      return num.scale(F(dts[0].c.d, dts[0].c.n)); // divide by denominator
    }
    throw new Error('unexpected ' + c + ' in ' + s);
  }
  const r = expr();
  if (i < s.length) throw new Error('trailing: ' + s.slice(i));
  return r;
}

function parsePlainLikeLatex(s) {
  // plain accepts like '25u^2-16', '16/3a^2-3b^2', '9(3m+n)^2'
  return parseLatex(s.replace(/\^(\d+)/g, '^{$1}'));
}

let fails = 0, checked = 0;
for (const [id, q] of Object.entries(BANK)) {
  if (q.kind !== 'text') continue;
  const m = q.q.match(/\$\$([^$]+)\$\$/);
  if (!m) { console.log('NO MATH', id); fails++; continue; }
  let qp, ap;
  try { qp = parseLatex(m[1]); } catch (e) { console.log('Q PARSE FAIL', id, e.message); fails++; continue; }
  try { ap = parsePlainLikeLatex(q.accept[0]); } catch (e) { console.log('A PARSE FAIL', id, q.accept[0], e.message); fails++; continue; }
  checked++;
  if (polyKey(qp) !== polyKey(ap)) {
    console.log('WRONG ANSWER', id, '| question:', m[1], '| stored:', q.accept[0]);
    fails++;
  }
}
console.log('checked ' + checked + ' questions');
console.log(fails === 0 ? 'ALL STATIC ANSWERS CORRECT' : fails + ' PROBLEMS');

/* ---- verify identity questions (LHS ?= RHS matches stored yes/no) ---- */
function polyEq(a, b) { return polyKey(a) === polyKey(b); }
let idFails = 0;
for (const [id, q] of Object.entries(BANK)) {
  if (q.kind !== 'identity') continue;
  const m = q.q.match(/\$\$([^$]+)\$\$/);
  if (!m) { console.log('NO MATH', id); idFails++; continue; }
  const [lhsS, rhsS] = m[1].split('=');
  let lhs, rhs;
  try { lhs = parseLatex(lhsS); rhs = parseLatex(rhsS); }
  catch (e) { console.log('ID PARSE FAIL', id, e.message); idFails++; continue; }
  const same = polyEq(lhs, rhs);
  const claimed = q.answer === 'yes';
  if (same !== claimed) { console.log('IDENTITY MISMATCH', id, 'actual:', same ? 'identity' : 'not identity', '| stored:', q.answer); idFails++; }
}
console.log(idFails === 0 ? 'ALL IDENTITY ANSWERS CORRECT' : idFails + ' IDENTITY PROBLEMS');
fails += idFails;

/* ---- verify constants questions: stored values must satisfy the identity ---- */
let cFails = 0;
for (const [id, q] of Object.entries(BANK)) {
  if (q.kind !== 'constants') continue;
  const m = q.q.match(/\$\$([^$]+)\$\$/);
  if (!m) { console.log('NO MATH', id); cFails++; continue; }
  const [lhsS, rhsS] = m[1].split(/\\equiv|=/);
  if (!rhsS) { continue; } // mcq-style questions handled separately
  let lhs, rhs;
  try { lhs = parseLatex(lhsS); rhs = parseLatex(rhsS); }
  catch (e) { console.log('CONST PARSE FAIL', id, e.message); cFails++; continue; }
  const envs = [[2, 3], [-1, 4], [5, -2]].map(([x, y]) => ({ x, y, A: q.values[0], B: q.values[1], C: q.values[2] || 0 }));
  const ok = envs.every(env => Math.abs(lhs.evalAt(env) - rhs.evalAt(env)) < 1e-9);
  if (!ok) { console.log('CONSTANTS MISMATCH', id, 'values:', q.values); cFails++; }
}
console.log(cFails === 0 ? 'ALL CONSTANTS VALUES CORRECT' : cFails + ' CONSTANTS PROBLEMS');
fails += cFails;

/* ---- verify MCQs: correct option matches question, distractors do not ---- */
let mFails = 0;
for (const [id, q] of Object.entries(BANK)) {
  if (q.kind !== 'mcq') continue;
  if (['m1', 'm2', 'm3', 'm4', 'm5', 'm13', 'm14'].includes(id)) continue; // non-equation MCQs
  const m = q.q.match(/\$\$([^$]+)\$\$/);
  if (!m) continue;
  const qS = m[1].replace(/=\s*$/, '');
  let qp;
  try { qp = parseLatex(qS); } catch (e) { console.log('MCQ Q PARSE FAIL', id, e.message); mFails++; continue; }
  for (const o of q.options) {
    let op;
    try { op = parseLatex(o.tex); } catch (e) { console.log('MCQ OPT PARSE FAIL', id, o.tex, e.message); mFails++; continue; }
    const eq = polyEq(qp, op);
    if (eq !== o.correct) { console.log('MCQ OPTION MISMATCH', id, o.tex, 'eq:', eq, 'marked correct:', o.correct); mFails++; }
  }
}
console.log(mFails === 0 ? 'ALL MCQ OPTIONS CONSISTENT' : mFails + ' MCQ PROBLEMS');
fails += mFails;

/* debug hook: node test-answers.js --debug 'expr' 'expr2' */
if (process.argv[2] === '--debug') {
  const a = parseLatex(process.argv[3]);
  const b = parsePlainLikeLatex(process.argv[4]);
  console.log('Q :', a.toLatex());
  console.log('A :', b.toLatex());
  console.log('equal:', polyKey(a) === polyKey(b));
}
