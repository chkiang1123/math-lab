/* ============================================================
   engine.js — tiny fraction + multivariate polynomial engine
   Used to generate similar questions with guaranteed-correct
   answers and auto-built expansion steps.
   ============================================================ */

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
const fNeg = a => ({ n: -a.n, d: a.d });
const fIsZero = a => a.n === 0;
const fIsInt = a => a.d === 1;
const fEq = (a, b) => a.n === b.n && a.d === b.d;
function fLatex(a) {
  if (a.d === 1) return String(a.n);
  const s = a.n < 0 ? '-' : '';
  return s + '\\dfrac{' + Math.abs(a.n) + '}{' + a.d + '}';
}
function fPlain(a) {
  if (a.d === 1) return String(a.n);
  return a.n + '/' + a.d;
}

/* ---------- Polynomial: sparse map key -> {m: {var:exp}, c: Frac} ---------- */
class Poly {
  constructor() { this.terms = new Map(); }
  static key(m) { return Object.keys(m).sort().map(v => v + '^' + m[v]).join('*'); }
  static c(val) { // constant polynomial
    const p = new Poly();
    const cf = (typeof val === 'number') ? F(val) : val;
    if (!fIsZero(cf)) p.terms.set('', { m: {}, c: cf });
    return p;
  }
  static v(name, e = 1) { return Poly.monomial({ [name]: e }, F(1)); }
  static monomial(m, cf) {
    const p = new Poly();
    if (typeof cf === 'number') cf = F(cf);
    if (fIsZero(cf)) return p;
    const mm = {}; for (const k in m) if (m[k] !== 0) mm[k] = m[k];
    p.terms.set(Poly.key(mm), { m: mm, c: cf });
    return p;
  }
  add(o) {
    const r = new Poly();
    const keys = new Set([...this.terms.keys(), ...o.terms.keys()]);
    for (const k of keys) {
      const a = this.terms.get(k), b = o.terms.get(k);
      let c = F(0);
      if (a) c = fAdd(c, a.c);
      if (b) c = fAdd(c, b.c);
      if (!fIsZero(c)) r.terms.set(k, { m: { ...((a || b).m) }, c });
    }
    return r;
  }
  scale(f) {
    const cf = (typeof f === 'number') ? F(f) : f;
    const r = new Poly();
    for (const [k, t] of this.terms) r.terms.set(k, { m: { ...t.m }, c: fMul(t.c, cf) });
    return r;
  }
  neg() { return this.scale(F(-1)); }
  sub(o) { return this.add(o.neg()); }
  mul(o) {
    const r = new Poly();
    for (const [, a] of this.terms) for (const [, b] of o.terms) {
      const m = { ...a.m };
      for (const v in b.m) m[v] = (m[v] || 0) + b.m[v];
      const k = Poly.key(m);
      const ex = r.terms.get(k);
      const c = fMul(a.c, b.c);
      if (ex) { const nc = fAdd(ex.c, c); if (fIsZero(nc)) r.terms.delete(k); else ex.c = nc; }
      else r.terms.set(k, { m, c });
    }
    return r;
  }
  pow(n) { let r = Poly.c(1); for (let i = 0; i < n; i++) r = r.mul(this); return r; }
  coeffOf(m) { const t = this.terms.get(Poly.key(m)); return t ? t.c : F(0); }
  evalAt(env) {
    let s = 0;
    for (const [, t] of this.terms) {
      let v = t.c.n / t.c.d;
      for (const x in t.m) v *= Math.pow(env[x], t.m[x]);
      s += v;
    }
    return s;
  }
  isZero() { return this.terms.size === 0; }
  equals(o) {
    const keys = new Set([...this.terms.keys(), ...o.terms.keys()]);
    for (const k of keys) {
      const a = this.terms.get(k), b = o.terms.get(k);
      const ca = a ? a.c : F(0), cb = b ? b.c : F(0);
      if (!fEq(ca, cb)) return false;
    }
    return true;
  }
  /* default display order: total degree desc, then alphabetical key */
  sortedTerms(order) {
    const arr = [...this.terms.values()];
    if (order) {
      const idx = new Map(order.map((k, i) => [k, i]));
      arr.sort((a, b) => (idx.get(Poly.key(a.m)) ?? 99) - (idx.get(Poly.key(b.m)) ?? 99));
      return arr;
    }
    const deg = m => Object.values(m).reduce((s, e) => s + e, 0);
    arr.sort((a, b) => deg(b.m) - deg(a.m) || Poly.key(a.m).localeCompare(Poly.key(b.m)));
    return arr;
  }
  toLatex(order) {
    const ts = this.sortedTerms(order);
    if (!ts.length) return '0';
    let out = '';
    ts.forEach((t, i) => {
      let term = '';
      const a = t.c;
      const neg = a.n < 0;
      const abs = { n: Math.abs(a.n), d: a.d };
      let mono = '';
      const vs = Object.keys(t.m).sort();
      for (const v of vs) mono += v + (t.m[v] > 1 ? '^{' + t.m[v] + '}' : '');
      let coeffStr = '';
      if (!fIsInt(abs) ) {
        coeffStr = (abs.n === 1 ? '' : Math.abs(abs.n)) === '' && abs.n === 1
          ? '\\dfrac{' + abs.n + '}{' + abs.d + '}'
          : '\\dfrac{' + abs.n + '}{' + abs.d + '}';
        if (abs.n === 1) coeffStr = '\\dfrac{1}{' + abs.d + '}';
      } else if (abs.n !== 1 || mono === '') {
        coeffStr = String(abs.n);
      }
      term = coeffStr + (mono && !fIsInt(abs) && abs.n !== 1 ? '' : '') + mono;
      if (i === 0) out += (neg ? '-' : '') + term;
      else out += (neg ? ' - ' : ' + ') + term;
    });
    return out;
  }
  /* plain-text version for answer checking, e.g. "16/3x^2-3b^2" */
  toPlain(order) {
    const ts = this.sortedTerms(order);
    if (!ts.length) return '0';
    let out = '';
    ts.forEach((t, i) => {
      const a = t.c, neg = a.n < 0, abs = { n: Math.abs(a.n), d: a.d };
      let mono = '';
      for (const v of Object.keys(t.m).sort()) mono += v + (t.m[v] > 1 ? '^' + t.m[v] : '');
      let cs = '';
      if (!fIsInt(abs)) cs = (abs.n === 1 ? '' : abs.n) + '/' + abs.d;
      else if (abs.n !== 1 || mono === '') cs = String(abs.n);
      const term = cs + mono;
      if (i === 0) out += (neg ? '-' : '') + term;
      else out += (neg ? '-' : '+') + term;
    });
    return out;
  }
}

/* ---------- helpers ---------- */
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function nz(a, b) { let v = 0; while (v === 0) v = rnd(a, b); return v; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sgn(n) { return n < 0 ? '-' : '+'; }
/* "3x - 5y" inside parentheses: value + signed term */
function termIn(n, v, first = false) {
  if (first) return (n === 1 ? '' : n === -1 ? '-' : n) + v;
  return (n < 0 ? ' - ' : ' + ') + Math.abs(n === 1 || n === -1 ? (n === 1 ? 1 : 1) * 0 + Math.abs(n) : Math.abs(n)) * 0 + (Math.abs(n) === 1 ? '' : Math.abs(n)) + v;
}
/* build "(ax + b)" */
function binomTex(a, x, b, wrap = true) {
  let s = (a === 1 ? '' : a === -1 ? '-' : a) + x;
  if (b !== 0) s += (b < 0 ? ' - ' : ' + ') + Math.abs(b);
  return wrap ? '(' + s + ')' : s;
}
function binom2Tex(a, x, b, y) { // (ax + by)
  let s = (a === 1 ? '' : a === -1 ? '-' : a) + x;
  if (b !== 0) s += (b < 0 ? ' - ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + y;
  return '(' + s + ')';
}

/* ---------- answer normalisation & checking ---------- */
/* canonicalise "constant±term" → "term±constant" (same value, term-first) */
function innerSwap(s) {
  const m = String(s).match(/^([+-]?)(\d+(?:\/\d+)?)([+-])([a-z0-9].*)$/);
  if (!m) return s;
  const termSigned = (m[3] === '-' ? '-' : '') + m[4];
  const numSigned = (m[1] === '-' ? '-' : '') + m[2];
  return termSigned + (numSigned.startsWith('-') ? '' : '+') + numSigned;
}
function normAns(s) {
  let t = String(s || '').toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/\u00d7\u00b7/g, '*')
    .replace(/[\u00d7\u00b7]/g, '*')
    .replace(/\u00b2/g, '^2').replace(/\u00b3/g, '^3').replace(/\u2074/g, '^4').replace(/\u2075/g, '^5')
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/\((\-?\d+\/\d+)\)/g, '$1') // "(16/3)x^2" → "16/3x^2"
    .replace(/^\+/, '');
  t = innerSwap(t).replace(/\(([^()]*)\)/g, (m0, inner) => '(' + innerSwap(inner) + ')');
  return t;
}
/* negate a bracket's inner expression: -(2-7x) = -2+7x */
function flipSigns(s) { return '-' + s.replace(/-/g, '\u0001').replace(/\+/g, '-').replace(/\u0001/g, '+'); }
/* variants where a scalar sign is distributed into the bracket: -A(G) ↔ A(-G) */
function signDistribute(base) {
  const out = new Set([base]);
  const m = base.match(/^(-?)([^()]*?)\(([^()]*)\)(.*)$/);
  if (m) {
    const [, sign, scalar, inner, rest] = m;
    const flipped = flipSigns(inner);
    if (sign === '-') out.add(scalar + '(' + flipped + ')' + rest);
    else if (scalar) out.add('-' + scalar + '(' + flipped + ')' + rest);
  }
  return [...out];
}
/* all acceptable variants for a factorised answer */
function acceptVariants(ans) {
  const out = new Set();
  const base = normAns(ans);
  out.add(base);
  let cur = base;
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < base.length; i++) {
    if (base[i] === '(') { depth++; if (depth === 1) start = i; }
    if (base[i] === ')') { depth--; if (depth === 0) parts.push(base.slice(start, i + 1)); }
  }
  if (parts.length >= 2) {
    // multiply order permutations of factor groups (handle leading scalar)
    const lead = base.startsWith('-') ? '-' : (base.startsWith('+') ? '+' : '');
    let body = base.replace(/^[-+]/, '');
    // split body into scalar prefix (digits/… before first '(') and parenthesised groups
    const firstParen = body.indexOf('(');
    const scalar = firstParen > 0 ? body.slice(0, firstParen) : '';
    const groups = [];
    let d = 0, s0 = 0;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '(') { d++; if (d === 1) s0 = i; }
      if (body[i] === ')') { d--; if (d === 0) groups.push(body.slice(s0, i + 1)); }
    }
    const tail = body.slice((groups.length ? body.lastIndexOf(groups[groups.length - 1]) : 0) + groups[groups.length - 1].length);
    if (groups.length >= 2 && groups.length <= 3) {
      for (const perm of perms(groups)) {
        out.add(normAns(lead + scalar + perm.join('') + tail));
      }
    }
  }
  // expand ")^2" into repeated factor
  const m2 = base.match(/^(.*\))\^2$/);
  if (m2) out.add(normAns(m2[1] + m2[1]));
  // distribute scalar sign into the bracket, then re-normalise all variants
  for (const v of [...out]) signDistribute(v).forEach(x => out.add(x));
  for (const v of [...out]) out.add(normAns(v));
  return [...out];
}
function perms(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((x, i) => {
    perms([...arr.slice(0, i), ...arr.slice(i + 1)]).forEach(p => out.push([x, ...p]));
  });
  return out;
}
function checkText(input, acceptArr) {
  const v = normAns(input);
  if (!v) return false;
  let set = new Set();
  for (const a of acceptArr) for (const x of acceptVariants(a)) set.add(x);
  return set.has(v);
}
function checkNum(input, value) {
  const v = String(input || '').replace(/[\u2212]/g, '-').replace(/\s+/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(v)) return false;
  return Math.abs(parseFloat(v) - value) < 1e-9;
}
