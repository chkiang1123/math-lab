/* Verify: all accept variants within each static question are mathematically equal */
const fs = require('fs');
const vm = require('vm');
const ctx = { console, Math };
vm.createContext(ctx);
for (const f of ['engine.js', 'gens.js', 'data.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx, { filename: f });
}
const { BANK, Poly, F } = vm.runInContext('({ BANK, Poly, F })', ctx);

/* ---- tiny recursive-descent parser for plain polynomial strings ---- */
function tokenize(s) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9]/.test(c)) { let n = ''; while (i < s.length && /[0-9]/.test(s[i])) n += s[i++]; t.push({ type: 'num', v: parseInt(n) }); continue; }
    if (/[a-z]/.test(c)) { t.push({ type: 'var', v: c }); i++; continue; }
    if ('+-/^()'.includes(c)) { t.push({ type: c }); i++; continue; }
    throw new Error('bad char ' + c);
  }
  return t;
}
function parse(s) {
  const toks = tokenize(s);
  let pos = 0;
  const peek = () => toks[pos];
  function expr() {
    let left = term();
    while (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = toks[pos++].type;
      const r = term();
      left = op === '+' ? left.add(r) : left.sub(r);
    }
    return left;
  }
  function term() {
    let left = factor();
    for (;;) {
      const p = peek();
      if (!p) break;
      if (p.type === 'num' || p.type === 'var' || p.type === '(') { left = left.mul(factor()); continue; }
      if (p.type === '/') {
        pos++;
        const d = factor(); // usually a constant
        const ds = d.isConst ? d : null;
        if (!ds) throw new Error('non-constant divisor');
        left = left.scale(F(1, ds.constVal));
        continue;
      }
      break;
    }
    return left;
  }
  function factor() {
    let neg = false;
    while (peek() && peek().type === '-') { neg = !neg; pos++; }
    let base = atom();
    if (peek() && peek().type === '^') {
      pos++;
      const e = toks[pos++].v;
      base = base.pow(e);
    }
    return neg ? base.neg() : base;
  }
  function atom() {
    const p = toks[pos++];
    if (!p) throw new Error('unexpected end');
    if (p.type === 'num') { const poly = Poly.c(p.v); poly.isConst = true; poly.constVal = p.v; return poly; }
    if (p.type === 'var') return Poly.v(p.v);
    if (p.type === '(') { const e = expr(); if (toks[pos++].type !== ')') throw new Error('missing )'); return e; }
    throw new Error('unexpected token ' + p.type);
  }
  const result = expr();
  if (pos !== toks.length) throw new Error('trailing tokens in: ' + s);
  return result;
}
function polyKey(p) { return p.sortedTerms().map(t => Poly.key(t.m) + '#' + t.c.n + '/' + t.c.d).join('|'); }

let fails = 0;
const groups = [];
for (const [id, q] of Object.entries(BANK)) {
  if (q.kind === 'text' && q.accept) groups.push([id, q.accept]);
  if (q.kind === 'multi') q.parts.forEach((p, i) => { if (p.kind === 'text' && p.accept) groups.push([id + ' part ' + p.label, p.accept]); });
}
for (const [id, lists] of groups) {
  if (lists.length < 2) continue;
  let ref;
  for (const a of lists) {
    let p;
    try { p = parse(a); } catch (e) { console.log('PARSE FAIL', id, a, e.message); fails++; continue; }
    if (ref === undefined) { ref = polyKey(p); continue; }
    if (polyKey(p) !== ref) { console.log('MISMATCH', id, a, 'vs', lists[0]); fails++; }
  }
}
console.log(fails === 0 ? 'ALL ACCEPT VARIANTS CONSISTENT' : fails + ' PROBLEMS');
process.exit(fails ? 1 : 0);
