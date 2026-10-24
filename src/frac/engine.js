/* ============================================================================
   engine.js — exact rational arithmetic, multivariate polynomials, rational
   expressions, an expression parser for student input, and random-point
   equivalence checking.

   Design note: answers are never computed by symbolic simplification. They are
   known by construction (we build the question from its answer) and accepted
   by evaluating both sides exactly at random rational points.
   ========================================================================== */

/* ------------------------------------------------------------------ fractions */
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
function F(n, d = 1) {
  if (d === 0) throw new Error('division by zero');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}
const fAdd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
const fDiv = (a, b) => (b.n === 0 ? null : F(a.n * b.d, a.d * b.n));
const fNeg = a => ({ n: -a.n, d: a.d });
const fEq = (a, b) => a.n === b.n && a.d === b.d;
const fIsZero = a => a.n === 0;
const fIsInt = a => a.d === 1;
const fPow = (a, k) => { let r = F(1); for (let i = 0; i < k; i++) r = fMul(r, a); return r; };
function fAbs(a) { return a.n < 0 ? fNeg(a) : a; }

/* --------------------------------------------------------------- polynomials */
class Poly {
  constructor() { this.terms = new Map(); }
  static key(m) { return Object.keys(m).sort().map(v => v + '^' + m[v]).join('*'); }
  static zero() { return new Poly(); }
  static const(c) {
    const p = new Poly();
    const cf = (typeof c === 'number') ? F(c) : c;
    if (!fIsZero(cf)) p.terms.set('', { m: {}, c: cf });
    return p;
  }
  static var(name, e = 1) { return Poly.mon({ [name]: e }, F(1)); }
  static mon(m, c) {
    const p = new Poly();
    if (typeof c === 'number') c = F(c);
    if (fIsZero(c)) return p;
    const mm = {};
    let has = false;
    for (const k in m) if (m[k]) { mm[k] = m[k]; has = true; }
    p.terms.set(Poly.key(mm), { m: mm, c });
    return p;
  }
  clone() { const p = new Poly(); for (const [k, t] of this.terms) p.terms.set(k, { m: { ...t.m }, c: t.c }); return p; }
  isZero() { return this.terms.size === 0; }
  isConst() { return this.terms.size <= 1 && (this.terms.size === 0 || this.terms.get('') !== undefined); }
  constValue() { if (this.isZero()) return F(0); const t = this.terms.get(''); return t ? t.c : null; }
  vars() {
    const s = new Set();
    for (const t of this.terms.values()) for (const k in t.m) s.add(k);
    return s;
  }
  set(key, m, c) { if (fIsZero(c)) this.terms.delete(key); else this.terms.set(key, { m, c }); return this; }
  addTerm(m, c) {
    const k = Poly.key(m);
    const cur = this.terms.get(k);
    const nc = cur ? fAdd(cur.c, c) : c;
    return this.set(k, m, nc);
  }
  add(o) { const r = this.clone(); for (const t of o.terms.values()) r.addTerm(t.m, t.c); return r; }
  neg() { const r = new Poly(); for (const [k, t] of this.terms) r.terms.set(k, { m: { ...t.m }, c: fNeg(t.c) }); return r; }
  sub(o) { return this.add(o.neg()); }
  scale(f) { const r = new Poly(); if (fIsZero(f) || this.isZero()) return r; for (const [k, t] of this.terms) r.terms.set(k, { m: { ...t.m }, c: fMul(t.c, f) }); return r; }
  mul(o) {
    const r = new Poly();
    for (const a of this.terms.values()) for (const b of o.terms.values()) {
      const m = { ...a.m };
      for (const k in b.m) m[k] = (m[k] || 0) + b.m[k];
      for (const k in m) if (!m[k]) delete m[k];
      r.addTerm(m, fMul(a.c, b.c));
    }
    return r;
  }
  pow(n) { if (n === 0) return Poly.const(1); let r = Poly.const(1); for (let i = 0; i < n; i++) r = r.mul(this); return r; }
  degIn(v) { let d = 0; for (const t of this.terms.values()) if (t.m[v] > d) d = t.m[v]; return d; }
  /* write p as A*v + B (fails conceptually if v-degree > 1; caller must ensure) */
  splitLinear(v) {
    const A = new Poly(), B = new Poly();
    for (const t of this.terms.values()) {
      const e = t.m[v] || 0;
      const m = { ...t.m };
      delete m[v];
      if (e === 0) B.addTerm(m, t.c);
      else if (e === 1) A.addTerm(m, t.c);
      else return null;
    }
    return { A, B };
  }
  /* pull out the numeric content and any monomial common to every term */
  factorCommon() {
    if (this.isZero()) return { c: F(1), m: {}, rest: this.clone() };
    const ts = this.sorted();
    let numG = 0, denL = 1;
    for (const t of ts) {
      numG = numG ? gcd(numG, Math.abs(t.c.n)) : Math.abs(t.c.n);
      denL = (denL * t.c.d) / gcd(denL, t.c.d);
    }
    const sign = ts[0].c.n < 0 ? -1 : 1;
    const c = fMul(F(numG, denL), F(sign));
    let mexp = null;
    for (const t of ts) {
      if (mexp === null) { mexp = {}; for (const k in t.m) mexp[k] = t.m[k]; }
      else for (const k in mexp) mexp[k] = Math.min(mexp[k], t.m[k] || 0);
    }
    for (const k in mexp) if (!mexp[k]) delete mexp[k];
    const s = { c, m: mexp, rest: this.scale(fDiv(F(1), c)) };
    if (Object.keys(s.m).length) {
      const r2 = new Poly();
      for (const t of this.terms.values()) {
        const m = {};
        for (const k in t.m) { const e = t.m[k] - (s.m[k] || 0); if (e) m[k] = e; }
        r2.addTerm(m, fDiv(t.c, c));
      }
      s.rest = r2;
    }
    return s;
  }
  norm() {
    // returns {sign, poly} where poly has a positive leading coefficient
    if (this.isZero() || this.isConst()) return { sign: 1, poly: this.clone() };
    const lead = this.sorted()[0].c.n;
    return lead < 0 ? { sign: -1, poly: this.scale(F(-1)) } : { sign: 1, poly: this.clone() };
  }
  polyKey() {
    return [...this.terms.values()]
      .map(t => Poly.key(t.m) + ':' + t.c.n + '/' + t.c.d)
      .sort().join('|');
  }
  /* exact division by (leadingVar - g) style monic-in-v factors is done in gens */
  eval(env) {
    let total = F(0);
    for (const t of this.terms.values()) {
      let v = t.c;
      for (const k in t.m) {
        const base = env[k];
        if (base === undefined) return null;
        v = fMul(v, fPow(base, t.m[k]));
      }
      total = fAdd(total, v);
    }
    return total;
  }
  sorted() {
    const arr = [...this.terms.values()];
    const keyOf = t => Object.keys(t.m).sort().join(',');
    arr.sort((x, y) => {
      const dx = Object.values(x.m).reduce((a, b) => a + b, 0);
      const dy = Object.values(y.m).reduce((a, b) => a + b, 0);
      if (dx !== dy) return dy - dx;
      return keyOf(x).localeCompare(keyOf(y));
    });
    return arr;
  }
  toAST() {
    const ts = this.sorted();
    if (!ts.length) return astNum(0);
    let ast = null;
    ts.forEach((t, i) => {
      if (i === 0) ast = monToAST(t.m, t.c);
      else if (t.c.n < 0) ast = { k: '-', a: ast, b: monToAST(t.m, fAbs(t.c)) };
      else ast = { k: '+', a: ast, b: monToAST(t.m, t.c) };
    });
    return ast;
  }
  toLatex() { return texAST(this.toAST()); }
  toPlain() { return plainAST(this.toAST()); }
}

function monToAST(m, coeff) {
  const parts = [];
  if (!fEq(coeff, F(1)) || Object.keys(m).length === 0) parts.push(astNum(coeff));
  for (const k of Object.keys(m).sort()) parts.push(m[k] === 1 ? astVar(k) : { k: '^', a: astVar(k), b: astNum(m[k]) });
  if (!parts.length) return astNum(1);
  return parts.reduce((a, b) => ({ k: '*', a, b }));
}

/* -------------------------------------------------- rational expressions */
function rat(num, den) { return { n: num, d: den || Poly.const(1) }; }
const ratNum = p => rat(p, Poly.const(1));
const ratConst = c => rat(Poly.const(c), Poly.const(1));
const ratVar = v => rat(Poly.var(v), Poly.const(1));
function ratMul(a, b) { return rat(a.n.mul(b.n), a.d.mul(b.d)); }
function ratDiv(a, b) { return rat(a.n.mul(b.d), a.d.mul(b.n)); }
function ratAdd(a, b) { return rat(a.n.mul(b.d).add(b.n.mul(a.d)), a.d.mul(b.d)); }
function ratSub(a, b) { return rat(a.n.mul(b.d).sub(b.n.mul(a.d)), a.d.mul(b.d)); }
function ratPow(a, k) { return rat(a.n.pow(k), a.d.pow(k)); }
function ratScale(a, f) { return rat(a.n.scale(typeof f === 'number' ? F(f) : f), a.d); }
function ratIsConst(a) { return a.n.isConst() && a.d.isConst(); }
function ratEval(a, env) {
  const n = a.n.eval(env), d = a.d.eval(env);
  if (n === null || d === null || fIsZero(d)) return null;
  return fDiv(n, d);
}
function ratVars(a) { const s = new Set([...a.n.vars(), ...a.d.vars()]); return [...s]; }
function gcf(a, b) { return F(gcd(Math.abs(a.n), Math.abs(b.n)), (a.d * b.d) / gcd(a.d, b.d)); }
function ratClean(a) {
  if (a.n.isZero()) return rat(Poly.const(0), Poly.const(1));
  // pull content + monomial out of numerator and denominator, then cancel common pieces
  const nf = a.n.factorCommon(), df = a.d.factorCommon();
  const g = gcf(nf.c, df.c);
  let nc = fDiv(nf.c, g), dc = fDiv(df.c, g);
  const shared = {};
  for (const k in nf.m) if (df.m[k]) shared[k] = Math.min(nf.m[k], df.m[k]);
  const nrem = {}, drem = {};
  for (const k in nf.m) { const e = nf.m[k] - (shared[k] || 0); if (e) nrem[k] = e; }
  for (const k in df.m) { const e = df.m[k] - (shared[k] || 0); if (e) drem[k] = e; }
  let nP = Poly.mon(nrem, nc).mul(nf.rest);
  let dP = Poly.mon(drem, dc).mul(df.rest);
  if (dP.isConst()) {
    const dv = dP.constValue() || F(1);
    if (dv.n < 0) { nP = nP.scale(F(-1)); dP = dP.scale(F(-1)); }
  }
  return rat(nP, dP);
}
function isOne(p) { return p.isConst() && fEq(p.constValue() || F(0), F(1)); }
function leadingNegative(p) {
  if (p.isZero()) return false;
  if (p.isConst()) { const c = p.constValue(); return c !== null && c.n < 0; }
  return p.sorted()[0].c.n < 0;
}
function ratToAST(a) {
  let n = a.n, d = a.d;
  let negated = false;
  if (leadingNegative(d)) { n = n.scale(F(-1)); d = d.scale(F(-1)); }
  if (isOne(d)) return n.toAST();
  if (leadingNegative(n)) { n = n.scale(F(-1)); negated = true; }
  const core = { k: '/', a: n.toAST(), b: d.toAST() };
  return negated ? { k: 'neg', a: core } : core;
}
function ratToLatex(a) { return texAST(ratToAST(a)); }
function ratToPlain(a) { return plainAST(ratToAST(a)); }

/* --------------------------------------------- exact division by linear factors */
function asLinearIn(p) {
  for (const v of [...p.vars()]) {
    if (p.degIn(v) !== 1) continue;
    const s = p.splitLinear(v);
    if (s) return { v, A: s.A, B: s.B };
  }
  return null;
}
function divideMonic(N, v, root, a) {
  const maxd = N.degIn(v);
  const C = [];
  for (let k = 0; k <= maxd; k++) C.push(new Poly());
  for (const t of N.terms.values()) {
    const e = t.m[v] || 0;
    const m = { ...t.m };
    delete m[v];
    C[e].addTerm(m, t.c);
  }
  let remainder = C[maxd].clone();
  const Q = new Array(maxd).fill(null);
  for (let k = maxd - 1; k >= 0; k--) {
    Q[k] = remainder.clone();
    remainder = C[k].add(root.mul(remainder));
  }
  if (!remainder.isZero()) return null;
  let out = new Poly();
  for (let k = 0; k < maxd; k++) {
    if (Q[k].isZero()) continue;
    for (const t of Q[k].terms.values()) {
      const m = { ...t.m };
      m[v] = (m[v] || 0) + k;
      out.addTerm(m, t.c);
    }
  }
  return out.scale(fDiv(F(1), a));
}
function divideLinear(N, D) {
  const info = asLinearIn(D);
  if (!info || !info.A.isConst()) return null;
  const a = info.A.constValue();
  if (a === null || fIsZero(a)) return null;
  const root = info.B.scale(fDiv(F(-1), a));      // D = a*(v - root)
  return divideMonic(N, info.v, root, a);
}
/* cancel every known factor shared between a numerator and a denominator */
function reduceKnown(num, den, pool) {
  let n = num.clone(), d = den.clone();
  let changed = true, guard = 0;
  while (changed && guard++ < 12) {
    changed = false;
    for (const f of pool) {
      if (f.isZero() || f.isConst()) continue;
      const nq = divideLinear(n, f);
      if (!nq) continue;
      const dq = divideLinear(d, f);
      if (dq) { n = nq; d = dq; changed = true; continue; }
      if (d.isConst()) {                          // denominator is just a number
        const dv = d.constValue();
        const g = gcd(Math.abs(dv.n), 1);         // keep n/d form, try integer part
        const trial = divideMonic(n, null, null, null);
        void trial; void g;
      }
    }
  }
  return rat(n, d);
}

/* --------------------------------------------------------------- random tools */
let SEED = 1;
function srand(s) { SEED = s >>> 0 || 1; }
function rnd(n) { // 0..n-1 deterministic-friendly
  SEED = (SEED * 1664525 + 1013904223) >>> 0;
  return Math.floor((SEED / 4294967296) * n);
}
function ri(a, b) { return a + rnd(b - a + 1); }
function pick(arr) { return arr[rnd(arr.length)]; }
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function nz(a, b) { // non-zero in [a,b]
  let v; do { v = ri(a, b); } while (v === 0); return v;
}
const VARS_POOL = ['a', 'b', 'c', 'd', 'f', 'g', 'h', 'k', 'm', 'n', 'p', 'q', 'r', 's', 'u', 'v', 'x', 'y', 'z'];
function pickVars(n, avoid) {
  const pool = VARS_POOL.filter(v => !(avoid || []).includes(v));
  return shuffle(pool).slice(0, n);
}

/* ------------------------------------------------------------------ AST + TeX */
const astNum = f => ({ k: 'n', v: (typeof f === 'number' ? F(f) : f) });
const astVar = v => ({ k: 'v', v });
const PREC = { '+': 1, '-': 1, '*': 2, '/': 5, '^': 4, 'neg': 3, 'n': 9, 'v': 9 };

function wrapIf(e, parentPrec, side) {
  // returns latex for e, parenthesised if needed
  const t = texAST(e);
  const p = PREC[e.k] || 9;
  if (p < parentPrec || (p === parentPrec && side === 'right' && (e.k === '-'))) {
    return (e.k === '/' || e.k === '^' || e.k === 'n' || e.k === 'v') ? t : '\\left(' + t + '\\right)';
  }
  return t;
}
function texNum(f) {
  if (f.d === 1) return String(f.n);
  return '\\dfrac{' + f.n + '}{' + f.d + '}';
}
function multiplyTex(parts) {
  // parts: array of latex strings already rendered at prec 2
  return parts.join('');
}
function flattenMul(e) {
  if (e.k === '*') return [...flattenMul(e.a), ...flattenMul(e.b)];
  return [e];
}
function texAST(e) {
  switch (e.k) {
    case 'n': return texNum(e.v);
    case 'v': return SYMBOL[e.v] || e.v;
    case 'neg': return '-' + wrapIf(e.a, 3);
    case '+': return wrapIf(e.a, 1) + ' + ' + wrapIf(e.b, 1, 'right');
    case '-': return wrapIf(e.a, 1) + ' - ' + wrapIf(e.b, 1, 'right');
    case '^': return wrapIf(e.a, 4) + '^{' + texAST(e.b) + '}';
    case '/': return '\\dfrac{' + texAST(e.a) + '}{' + texAST(e.b) + '}';
    case '*': {
      const parts = flattenMul(e);
      // numeric factors first
      const nums = [], rest = [];
      for (const p of parts) {
        if (p.k === 'n') nums.push(p.v);
        else if (p.k === 'neg' && p.a.k === 'n') { nums.push(fNeg(p.a.v)); }
        else rest.push(p);
      }
      let s = '';
      if (nums.length) {
        const prod = nums.reduce((x, y) => fMul(x, y), F(1));
        const neg = prod.n < 0;
        const absProd = neg ? fNeg(prod) : prod;
        const showOne = rest.length === 0 || !fEq(absProd, F(1));
        s = (neg ? '-' : '') + (showOne ? texNum(absProd) : '');
      }
      s += rest.map(p => wrapIf(p, 2)).join('');
      return s || '1';
    }
  }
  return '?';
}
const SYMBOL = { pi: '\\pi', 'π': '\\pi' };

function flattenMulPlain(e) {
  if (e.k === '*') return [...flattenMulPlain(e.a), ...flattenMulPlain(e.b)];
  return [e];
}
function plainNum(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
function plainAST(e) {
  switch (e.k) {
    case 'n': return plainNum(e.v);
    case 'v': return e.v === 'pi' || e.v === 'π' ? 'pi' : e.v;
    case 'neg': return '-' + (PREC[e.a.k] < 3 ? '(' + plainAST(e.a) + ')' : plainAST(e.a));
    case '+': return plainAST(e.a) + ' + ' + (PREC[e.b.k] <= 1 && e.b.k === '-' ? '(' + plainAST(e.b) + ')' : plainAST(e.b));
    case '-': return plainAST(e.a) + ' - ' + (PREC[e.b.k] <= 1 ? '(' + plainAST(e.b) + ')' : plainAST(e.b));
    case '^': return (PREC[e.a.k] < 4 ? '(' + plainAST(e.a) + ')' : plainAST(e.a)) + '^' + plainAST(e.b);
    case '/': return '(' + plainAST(e.a) + ')/(' + plainAST(e.b) + ')';
    case '*': {
      const parts = flattenMulPlain(e);
      const nums = [], rest = [];
      for (const p of parts) {
        if (p.k === 'n') nums.push(p.v);
        else if (p.k === 'neg' && p.a.k === 'n') nums.push(fNeg(p.a.v));
        else rest.push(p);
      }
      let s = '';
      if (nums.length) {
        const prod = nums.reduce((x, y) => fMul(x, y), F(1));
        const neg = prod.n < 0;
        const absP = neg ? fNeg(prod) : prod;
        const showOne = rest.length === 0 || !fEq(absP, F(1));
        s = (neg ? '-' : '') + (showOne ? plainNum(absP) : '');
      }
      s += rest.map(p => (PREC[p.k] < 2 ? '(' + plainAST(p) + ')' : plainAST(p))).join('*');
      return s || '1';
    }
  }
  return '?';
}

/* ------------------------------------------------------------- input parser */
function preprocess(s) {
  if (s === null || s === undefined) return '';
  s = String(s);
  s = s.replace(/\\d?frac\s*/g, '\\frac');
  // \frac{a}{b} -> ((a)/(b))  (repeat for nesting)
  for (let pass = 0; pass < 12; pass++) {
    const idx = s.indexOf('\\frac');
    if (idx < 0) break;
    const before = s.slice(0, idx);
    let i = idx + 5;
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s[i] !== '{') { s = before + s.slice(idx + 5); break; }
    let depth = 0, j = i, a = '';
    for (; j < s.length; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') { depth--; if (!depth) break; }
      a += s[j];
    }
    a = a.slice(1);
    let k = j + 1;
    while (k < s.length && /\s/.test(s[k])) k++;
    if (s[k] !== '{') { s = before + '(' + a + ')' + s.slice(j + 1); break; }
    let depth2 = 0, b = '', m = k;
    for (; m < s.length; m++) {
      if (s[m] === '{') depth2++;
      else if (s[m] === '}') { depth2--; if (!depth2) break; }
      b += s[m];
    }
    b = b.slice(1);
    s = before + '((' + a + ')/(' + b + '))' + s.slice(m + 1);
  }
  s = s.replace(/\\sqrt\s*{([^{}]*)}/g, '(($1)^0.5)');
  s = s.replace(/\\left|\\right|\\displaystyle|\\,\\;\\!|\\ /g, ' ');
  s = s.replace(/\\,/g, ' ').replace(/\\;/g, ' ').replace(/\\!/g, ' ');
  s = s.replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/');
  s = s.replace(/\\pi/g, 'π');
  s = s.replace(/\\text\s*{([^{}]*)}/g, '$1');
  s = s.replace(/[{}]/g, '');
  s = s.replace(/≤|≤/g, '<=').replace(/≥/g, '>=');
  s = s.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/·/g, '*');
  s = s.replace(/\^?°/g, '');
  return s;
}

function tokenize(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const t = s.slice(i, j);
      if ((t.match(/\./g) || []).length > 1) throw new Error('bad number');
      let f;
      if (t.indexOf('.') >= 0) {
        const [ip, fp] = t.split('.');
        f = F(parseInt((ip || '0') + fp, 10), Math.pow(10, fp.length));
      } else f = F(parseInt(t, 10));
      out.push({ t: 'num', v: f });
      i = j; continue;
    }
    if (/[a-zA-Zπ]/.test(ch)) {
      let j = i;
      while (j < s.length && /[a-zA-Zπ]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const letters = [...word];
      for (const L of letters) out.push({ t: 'var', v: L === 'π' ? 'pi' : L });
      i = j; continue;
    }
    if ('+-*/^()'.indexOf(ch) >= 0) { out.push({ t: 'op', v: ch }); i++; continue; }
    i++;
  }
  return out;
}

function insertImplicit(ts) {
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const cur = ts[i];
    if (i > 0) {
      const prev = ts[i - 1];
      const need =
        ((prev.t === 'num' || prev.t === 'var' || (prev.t === 'op' && prev.v === ')')) &&
          (cur.t === 'var' || (cur.t === 'op' && cur.v === '('))) ||
        ((prev.t === 'op' && prev.v === ')') && cur.t === 'num');
      if (need) out.push({ t: 'op', v: '#' });
    }
    out.push(cur);
  }
  return out;
}

function parseExpr(src) {
  const ts = insertImplicit(tokenize(preprocess(src)));
  let pos = 0;
  const peek = () => ts[pos];
  const eat = v => { if (ts[pos] && ts[pos].t === 'op' && ts[pos].v === v) { pos++; return true; } return false; };
  function primary() {
    const t = peek();
    if (!t) throw new Error('unexpected end');
    if (t.t === 'op' && t.v === '(') { pos++; const e = expr(); if (!eat(')')) throw new Error('missing )'); return e; }
    if (t.t === 'op' && (t.v === '-' || t.v === '+')) {
      pos++; const e = primary();
      return t.v === '-' ? { k: 'neg', a: e } : e;
    }
    if (t.t === 'num') { pos++; return astNum(t.v); }
    if (t.t === 'var') { pos++; return astVar(t.v); }
    throw new Error('unexpected token');
  }
  function power() {
    const base = primary();
    const t = peek();
    if (t && t.t === 'op' && t.v === '^') {
      pos++;
      let ex;
      const nx = peek();
      if (nx && nx.t === 'op' && nx.v === '-') { pos++; ex = { k: 'neg', a: power() }; }
      else ex = power();
      return { k: '^', a: base, b: ex };
    }
    return base;
  }
  /* juxtaposition binds tighter than * and / : 3/2b means 3/(2b) */
  function juxtap() {
    let a = power();
    while (peek() && peek().t === 'op' && peek().v === '#') { pos++; a = { k: '*', a, b: power() }; }
    return a;
  }
  function term() {
    let a = juxtap();
    for (;;) {
      const t = peek();
      if (!t || t.t !== 'op') break;
      if (t.v === '*') { pos++; a = { k: '*', a, b: juxtap() }; }
      else if (t.v === '/') { pos++; a = { k: '/', a, b: juxtap() }; }
      else break;
    }
    return a;
  }
  function expr() {
    let a = term();
    for (;;) {
      const t = peek();
      if (!t || t.t !== 'op') break;
      if (t.v === '+') { pos++; a = { k: '+', a, b: term() }; }
      else if (t.v === '-') { pos++; a = { k: '-', a, b: term() }; }
      else break;
    }
    return a;
  }
  const e = expr();
  if (pos !== ts.length) throw new Error('trailing input');
  return e;
}

/* ------------------------------------------------- numeric evaluation of AST */
function evalAST(e, env) {
  switch (e.k) {
    case 'n': return e.v;
    case 'v': { const v = env[e.v]; return v === undefined ? null : v; }
    case 'neg': { const a = evalAST(e.a, env); return a === null ? null : fNeg(a); }
    case '+': { const a = evalAST(e.a, env), b = evalAST(e.b, env); return (a === null || b === null) ? null : fAdd(a, b); }
    case '-': { const a = evalAST(e.a, env), b = evalAST(e.b, env); return (a === null || b === null) ? null : fSub(a, b); }
    case '*': { const a = evalAST(e.a, env), b = evalAST(e.b, env); return (a === null || b === null) ? null : fMul(a, b); }
    case '/': { const a = evalAST(e.a, env), b = evalAST(e.b, env); return (a === null || b === null || fIsZero(b)) ? null : fDiv(a, b); }
    case '^': {
      const a = evalAST(e.a, env), n = evalAST(e.b, env);
      if (a === null || n === null || !fIsInt(n)) return null;
      const k = n.n;
      if (k >= 0) return fPow(a, k);
      let r = F(1);
      for (let i = 0; i < -k; i++) r = fMul(r, a);
      return fIsZero(r) ? null : F(r.d, r.n);
    }
  }
  return null;
}
function astVars(e, acc = new Set()) {
  switch (e.k) {
    case 'v': acc.add(e.v); break;
    case 'neg': astVars(e.a, acc); break;
    case '+': case '-': case '*': case '/': case '^': astVars(e.a, acc); astVars(e.b, acc); break;
  }
  return acc;
}

/* ------------------------------------------------------- equivalence checking */
const TEST_POINTS = [F(2), F(3), F(-2), F(5), F(-3), F(1, 2), F(-1, 2), F(7), F(-5), F(4), F(1, 3), F(-1, 3), F(11), F(-7)];
function sameRational(a, b, varList, trials) {
  trials = trials || 14;
  let ok = 0, tries = 0;
  while (tries < trials * 4 && ok < trials) {
    tries++;
    const env = {};
    for (const v of varList) env[v] = TEST_POINTS[rnd(TEST_POINTS.length)];
    const x = a.eval(env), y = b.eval(env);
    if (x === null || y === null) continue;
    if (!fEq(x, y)) return false;
    ok++;
  }
  return ok >= trials;
}
function sameAST(aAST, bAST, extraVars) {
  const vars = [...new Set([...astVars(aAST), ...astVars(bAST), ...(extraVars || [])])];
  let ok = 0, tries = 0;
  while (tries < 60 && ok < 12) {
    tries++;
    const env = {};
    for (const v of vars) env[v] = TEST_POINTS[rnd(TEST_POINTS.length)];
    const x = evalAST(aAST, env), y = evalAST(bAST, env);
    if (x === null || y === null) continue;
    if (!fEq(x, y)) return false;
    ok++;
  }
  return ok >= 12;
}
/* student answer (string) vs expected rational expression */
function checkAnswer(input, expectedRat, extraVars) {
  let a;
  try { a = parseExpr(input); } catch (e) { return { ok: false, err: 'parse', src: null }; }
  const vars = [...new Set([...astVars(a), ...ratVars(expectedRat), ...(extraVars || [])])];
  let ok = 0, tries = 0;
  while (tries < 80 && ok < 10) {
    tries++;
    const env = {};
    for (const v of vars) env[v] = TEST_POINTS[rnd(TEST_POINTS.length)];
    const x = evalAST(a, env);
    const y = ratEval(expectedRat, env);
    if (x === null || y === null) continue;
    if (!fEq(x, y)) return { ok: false, src: a };
    ok++;
  }
  return { ok: ok >= 10, src: a };
}
/* Build an exact rational expression out of a parsed AST.
   Used to turn a stored reference answer (plain string) into something
   checkAnswer() can compare against. */
function astToRat(e) {
  switch (e.k) {
    case 'n': return ratConst(e.v);
    case 'v': return ratVar(e.v);
    case 'neg': return ratMul(ratConst(F(-1)), astToRat(e.a));
    case '+': return ratAdd(astToRat(e.a), astToRat(e.b));
    case '-': return ratSub(astToRat(e.a), astToRat(e.b));
    case '*': return ratMul(astToRat(e.a), astToRat(e.b));
    case '/': return ratDiv(astToRat(e.a), astToRat(e.b));
    case '^': {
      const n = evalAST(e.b, {});
      if (n === null || !fIsInt(n)) throw new Error('non-integer exponent in answer');
      const base = astToRat(e.a);
      return n.n >= 0 ? ratPow(base, n.n) : ratPow(ratDiv(ratConst(F(1)), base), -n.n);
    }
  }
  throw new Error('cannot convert node ' + e.k);
}
/* Reference answer (plain-text, e.g. "-2a/b") -> reduced rational expression. */
function ratFromExpr(s) { return ratClean(astToRat(parseExpr(s))); }

/* numeric-only comparison */
function checkNumber(input, valueF) {
  let a;
  try { a = parseExpr(input); } catch (e) { return { ok: false, err: 'parse' }; }
  const v = evalAST(a, {});
  if (v === null) return { ok: false };
  return { ok: fEq(v, valueF) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    F, fAdd, fSub, fMul, fDiv, fNeg, fEq, fIsZero, fPow, fIsInt, fAbs,
    Poly, rat, ratNum, ratConst, ratVar, ratMul, ratDiv, ratAdd, ratSub, ratPow,
    ratClean, ratToAST, ratToLatex, ratToPlain, ratEval, ratVars, ratIsConst,
    astToRat, ratFromExpr,
    isOne, srand, rnd, ri, pick, shuffle, nz, pickVars, VARS_POOL,
    astNum, astVar, texAST, plainAST, parseExpr, evalAST, astVars, checkAnswer, checkNumber, sameAST,
    asLinearIn, divideLinear, divideMonic, reduceKnown
  };
}
