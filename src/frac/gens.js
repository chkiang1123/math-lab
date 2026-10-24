/* ============================================================================
   gens.js — similar-question generators.

   Every question is built OUT OF its answer, so the answer can never be wrong:
     * product families multiply known factors together (no division needed)
     * add/subtract families build the L.C.M. from a known factor multiset
     * "make the subject" families are solved with exact rational arithmetic
   ========================================================================== */

const D2 = '\\dfrac';

/* ---------- factor-multiset bookkeeping ------------------------------------ */
function keyMon(p) { return p.polyKey(); }
function msAdd(ms, p, e) {
  const k = keyMon(p);
  ms.set(k, (ms.get(k) || { p, e: 0 }));
  ms.get(k).e += e;
  return ms;
}
function msProduct(ms, extra) {
  let out = typeof extra === 'number' ? Poly.const(extra) : (extra || Poly.const(1));
  for (const v of ms.values()) if (v.e > 0) out = out.mul(v.p.pow(v.e));
  return out;
}
function msSubset(ms, take) {           // multiset of the SAME pieces, fewer copies
  const out = new Map();
  const all = [...ms.values()];
  for (const v of all) {
    let n = Math.min(v.e, take--);
    if (n > 0) msAdd(out, v.p, n);
    if (take <= 0) break;
  }
  return out;
}
function msComplement(ms, sub) {
  const out = new Map();
  for (const [k, v] of ms) {
    const use = sub.has(k) ? sub.get(k).e : 0;
    if (v.e - use > 0) msAdd(out, v.p, v.e - use);
  }
  return out;
}

/* ---------- random small helpers ------------------------------------------ */
function smallP(vs, allowLinear) {
  if (allowLinear && rnd(2)) return linForm([pick(vs), pick(vs)]);
  let p = Poly.mon({ [pick(vs)]: 1 }, F(1));
  return p;
}
function linForm(vs) {
  let a, b, tries = 0;
  do { a = nz(-4, 4); b = nz(-4, 4); tries++; } while (tries < 12 && (a === 0 && b === 0));
  let p = Poly.var(vs[0], 1).scale(F(a));
  if (vs[1] && vs[1] !== vs[0]) p = p.add(Poly.var(vs[1], 1).scale(F(b)));
  return p.factorCommon().rest;
}
function fracTex(f) { return f.d === 1 ? String(f.n) : D2 + '{' + f.n + '}{' + f.d + '}'; }

/* Does this LaTeX snippet need brackets once it becomes a factor? */
function wrapNeeded(s) {
  s = String(s);
  if (/^[+-]/.test(s)) return true;
  let depth = 0, signs = 0;
  for (const ch of s) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (depth === 0 && (ch === '+' || ch === '-')) signs++;
  }
  return signs > 0;
}
/* Render "a × b", adding brackets so multi-term factors stay intact. */
function mulTex(a, b) {
  const A = wrapNeeded(a) ? '(' + a + ')' : a;
  const B = wrapNeeded(b) ? '(' + b + ')' : b;
  return A + '\\times ' + B;
}

/* ========================================================================== */
/* 1. cancel common factors out of ONE fraction                               */
/* ========================================================================== */
function G_cancel(o) {
  o = o || {};
  const hard = !!o.hard;
  for (let attempt = 0; attempt < 60; attempt++) {
    const vs = pickVars(ri(1, hard ? 3 : 2));
    const kindP = hard ? rnd(3) : (rnd(2) ? 0 : 1);
    let P;
    if (kindP === 0) P = Poly.mon({ [pick(vs)]: ri(1, 2) }, F(nz(2, 6)));
    else if (kindP === 1) P = Poly.const(nz(2, 6));
    else P = linForm([vs[0], vs[1] || vs[0]]);
    const mk = () => {
      if (rnd(3) === 0) return Poly.mon({ [pick(vs)]: ri(1, 2) }, F(rnd(2) ? 1 : 2));
      return linForm([pick(vs), pick(vs)]);
    };
    let A = mk(), B = mk();
    if (hard && rnd(3) === 0) B = P.scale(F(ri(1, 2)));
    if (A.isZero() || B.isZero() || P.isZero()) continue;
    if (A.polyKey() === B.polyKey()) continue;
    const neg = rnd(4) === 0;
    const num = P.mul(A);
    const den = P.mul(B).scale(neg ? F(-1) : F(1));
    if (num.vars().size === 0 || den.vars().size === 0) continue;
    if (num.terms.size + den.terms.size < 3 && !hard) continue;
    const Beff = B.scale(neg ? F(-1) : F(1));
    const ans = ratClean(rat(A, Beff));
    if (ans.n.isZero()) continue;
    const body = D2 + '{' + num.toLatex() + '}{' + den.toLatex() + '}';
    const steps = [
      'Factorise the numerator and the denominator separately.',
      '$' + num.toLatex() + ' = ' + mulTex(P.toLatex(), A.toLatex()) + '$',
      '$' + den.toLatex() + ' = ' + (neg ? '-' : '') + mulTex(P.toLatex(), B.toLatex()) + '$',
      'Cancel the common factor $' + P.toLatex() + '$.',
      '$' + body + ' = ' + ratToLatex(ans) + '$'
    ];
    return {
      kind: 'expr', family: 'cancel',
      prompt: 'Simplify the following expression.',
      body: body, ans: ans, ansTex: ratToLatex(ans),
      hints: [
        'Neither line is a product yet — factorise first.',
        'The same block $' + P.toLatex() + '$ is hiding inside both lines.'
      ],
      steps: steps
    };
  }
  return G_cancel(o);
}

/* ========================================================================== */
/* 2. multiply / divide algebraic fractions                                   */
/* ========================================================================== */
function G_mulDiv(o) {
  o = o || {};
  const hard = !!o.hard;
  for (let attempt = 0; attempt < 80; attempt++) {
    const vs = pickVars(ri(2, hard ? 3 : 2));
    const pool = [];
    for (const v of vs) pool.push(Poly.var(v, 1));
    for (let i = 0; i < (hard ? 3 : 1); i++) pool.push(linForm([pick(vs), pick(vs)]));
    const nFrac = hard ? ri(2, 3) : 2;
    const groups = [];
    for (let i = 0; i < nFrac; i++) groups.push({ top: [], bot: [] });
    // deliberate cancellations
    const cancelN = hard ? ri(2, 3) : ri(1, 2);
    for (let i = 0; i < cancelN; i++) {
      const f = pick(pool);
      const flipame = rnd(3) === 0;
      const gi = rnd(nFrac), gj = rnd(nFrac);
      groups[gi].top.push(f);
      groups[gj].bot.push(flipame ? f.scale(F(-1)) : f);
    }
    // whatever is left becomes the answer
    const resN = hard ? ri(1, 2) : 1;
    for (let i = 0; i < resN; i++) groups[rnd(nFrac)].top.push(pick(pool));
    if (hard && rnd(2)) groups[rnd(nFrac)].bot.push(pick(pool));
    if (groups.every(g => g.top.length === 0)) continue;
    if (groups.every(g => g.bot.length === 0)) continue;
    const ops = [];
    for (let i = 1; i < nFrac; i++) ops.push(rnd(2) ? '\\times' : '\\div');
    const eff = groups.map((g, i) => {
      const flipped = i > 0 && ops[i - 1] === '\\div';
      return flipped ? { top: g.bot, bot: g.top } : { top: g.top, bot: g.bot };
    });
    let numP = Poly.const(1), denP = Poly.const(1);
    for (const g of eff) {
      for (const f of g.top) numP = numP.mul(f);
      for (const f of g.bot) denP = denP.mul(f);
    }
    const normVals = pool.map(f => f.norm().poly);
    const red = reduceKnown(numP, denP, normVals);
    const ans = ratClean(red);
    if (ans.n.isZero()) continue;
    const shown = groups.map(g => {
      const top = g.top.reduce((a, b) => a.mul(b), Poly.const(1));
      const bot = g.bot.reduce((a, b) => a.mul(b), Poly.const(1));
      return { top, bot };
    });
    if (shown.some(s => s.top.isZero())) continue;
    const body = shown.map(s => D2 + '{' + s.top.toLatex() + '}{' + s.bot.toLatex() + '}')
      .reduce((acc, s, i) => i === 0 ? s : acc + ' ' + ops[i - 1] + ' ' + s, '');
    const hasDiv = ops.includes('\\div');
    const steps = [
      hasDiv ? 'To divide by a fraction, multiply by its reciprocal — turn it upside down and change $\\div$ to $\\times$.'
        : 'Multiply the numerators together and the denominators together.',
      'Cancel every factor that appears both above and below the line.',
      '$' + body + ' = ' + ratToLatex(ans) + '$'
    ];
    return {
      kind: 'expr', family: 'mulDiv',
      prompt: 'Simplify the following expression.',
      body: body, ans: ans, ansTex: ratToLatex(ans),
      hints: [
        hasDiv ? 'Rewrite the division as multiplication by the flipped fraction first.' : 'You can cancel across the multiplication before you multiply out.',
        'Never cancel part of a sum — only whole factors may be cancelled.'
      ],
      steps: steps
    };
  }
  return G_mulDiv(o);
}

/* ========================================================================== */
/* 3. add / subtract algebraic fractions                                      */
/* ========================================================================== */
function G_addSub(o) {
  o = o || {};
  const hard = !!o.hard;
  for (let attempt = 0; attempt < 80; attempt++) {
    const vs = pickVars(ri(1, hard ? 3 : 2));
    const nTerm = hard ? (rnd(3) === 0 ? 3 : 2) : 2;
    /* build the L.C.M.'s factor multiset */
    const lcm = new Map();
    msAdd(lcm, Poly.const(pick([2, 3, 4, 5, 6])), 1);
    if (rnd(2)) msAdd(lcm, Poly.const(pick([2, 3])), 1);
    const nPieces = hard ? ri(1, 2) : 1;
    for (let i = 0; i < nPieces; i++) {
      const p = (hard && rnd(2)) ? linForm([vs[0], vs[1] || vs[0]]) : Poly.var(vs[i % vs.length], 1);
      msAdd(lcm, p, hard && rnd(4) === 0 ? 2 : 1);
    }
    const lcmEntries = [...lcm.values()];
    let L = Poly.const(1);
    for (const v of lcmEntries) L = L.mul(v.p.pow(v.e));
    /* each denominator takes a sub-multiset of the L.C.M. pieces */
    const terms = [];
    for (let i = 0; i < nTerm; i++) {
      const sub = new Map();
      for (const v of lcmEntries) {
        let e = ri(0, v.e);
        if (e > 0) msAdd(sub, v.p, e);
      }
      if (sub.size === 0) msAdd(sub, lcmEntries[0].p, 1);
      let den = msProduct(sub, 1);
      const flipS = rnd(4) === 0;
      if (flipS) den = den.scale(F(-1));
      terms.push({ den, denMS: sub, flipS });
    }
    /* pick numerators */
    for (const t of terms) {
      const nk = rnd(3);
      if (nk === 0) t.num = Poly.const(nz(2, 9));
      else if (nk === 1) t.num = Poly.mon({ [pick(vs)]: 1 }, F(nz(1, 6)));
      else t.num = linForm([vs[vs.length - 1], vs[0]]);
      t.sign = 1;
    }
    for (let i = 1; i < terms.length; i++) terms[i].sign = rnd(2) ? 1 : -1;
    /* if there are denominators with the same multiset, force a shared piece */
    const knows = lcmEntries.map(v => v.p.norm().poly);
    /* combine */
    let acc = Poly.const(0);
    const detail = [];
    for (const t of terms) {
      const comp = msComplement(lcm, t.denMS);
      let mult = msProduct(comp, 1);
      if (t.flipS) mult = mult.scale(F(-1));
      const contrib = t.num.mul(mult).scale(F(t.sign));
      detail.push(D2 + '{' + t.num.toLatex() + '}{' + t.den.toLatex() + '} = ' +
        D2 + '{' + contrib.toLatex() + '}{' + L.toLatex() + '}');
      acc = acc.add(contrib);
    }
    if (acc.isZero() || L.isZero()) continue;
    let red = ratClean(rat(acc, L));
    const red2 = reduceKnown(red.n, red.d, knows);
    const ans = ratClean(red2);
    if (ans.n.isZero()) continue;
    const body = terms.map((t, i) =>
      (i === 0 ? '' : (t.sign > 0 ? ' + ' : ' - ')) + D2 + '{' + t.num.toLatex() + '}{' + t.den.toLatex() + '}'
    ).join('');
    const steps = [
      'Find the L.C.M. of the denominators: $' + L.toLatex() + '$.',
      ...detail,
      'Combine into a single fraction: $' + D2 + '{' + acc.toLatex() + '}{' + L.toLatex() + '}$.',
      'Simplify: $' + ratToLatex(ans) + '$'
    ];
    return {
      kind: 'expr', family: 'addSub',
      prompt: 'Simplify the following expression.',
      body: body, ans: ans, ansTex: ratToLatex(ans),
      hints: [
        'The denominators are not the same, so find their L.C.M. first.',
        'The L.C.M. of the denominators is $' + L.toLatex() + '$.'
      ],
      steps: steps
    };
  }
  return G_addSub(o);
}

/* ========================================================================== */
/* 4. substitution into a formula                                             */
/* ========================================================================== */
function G_subst(o) {
  o = o || {};
  const hard = !!o.hard;
  for (let attempt = 0; attempt < 40; attempt++) {
    const vs = pickVars(hard ? ri(2, 3) : 2);
    const target = pick(vs);
    const others = vs.filter(v => v !== target);
    const vals = {};
    for (const v of others) vals[v] = nz(-4, 6);
    const env = {};
    for (const v of others) env[v] = F(vals[v]);
    const shape = hard ? rnd(3) : rnd(2);
    let rhs;
    if (shape === 0) {
      rhs = ratNum(Poly.const(nz(1, 12)));
      for (const v of others) rhs = ratAdd(rhs, ratScale(ratVar(v), F(nz(-9, 12))));
    } else if (shape === 1) {
      rhs = ratNum(Poly.const(nz(1, 6)));
      for (const v of others) rhs = ratAdd(rhs, ratScale(ratVar(v), F(nz(-6, 9))));
      if (hard) rhs = ratAdd(rhs, ratScale(ratPow(ratVar(others[0]), 2), F(nz(1, 3))));
    } else {
      rhs = ratDiv(ratNum(Poly.const(nz(2, 30))), ratVar(others[0]));
      for (let i = 1; i < others.length; i++) rhs = ratAdd(rhs, ratScale(ratVar(others[i]), F(nz(-6, 9))));
    }
    const denomV = rhs.d.eval(env);
    const numV = rhs.n.eval(env);
    if (denomV === null || numV === null || fIsZero(denomV)) continue;
    const ans = fDiv(numV, denomV);
    if (!fIsInt(ans)) continue;
    if (Math.abs(ans.n) > 200) continue;
    const subs = Object.entries(vals).map(([v, x]) => v + ' = ' + x).join(',\\ ');
    const body = '$' + target + ' = ' + ratToLatex(rhs) + '$\\quad [' + target + ']\\ \\text{ if } ' + subs;
    const steps = ['Put the given numbers into the formula.'];
    for (const v of others) steps.push('$' + v + ' = ' + vals[v] + '$');
    steps.push('$' + target + ' = ' + ratToLatex(rhs)
      .replace(new RegExp('\\b(' + others.join('|') + ')\\b', 'g'), (m, g1) => '(' + vals[g1] + ')') + '$');
    steps.push('$' + target + ' = ' + fracTex(ans) + '$');
    return {
      kind: 'num', family: 'subst', ansNum: ans,
      prompt: 'In the following formula, find the value of the letter in the brackets by substitution.',
      body: body, ans: Poly.const(ans), ansTex: fracTex(ans),
      hints: ['Replace every other letter by its number first.', 'Then just do the arithmetic carefully.'],
      steps: steps
    };
  }
  return G_subst(o);
}

/* substitution where the unknown sits inside the equation (Level 2 style) */
function G_substSolve(o) {
  o = o || {};
  for (let attempt = 0; attempt < 40; attempt++) {
    const vs = pickVars(3);
    const [x, a, b] = vs;
    const A = F(nz(2, 6));
    const Bp = Poly.const(nz(-9, 9)).add(Poly.var(a, 1).scale(F(nz(-6, 9))));
    const Cp = Poly.const(nz(-9, 9)).add(Poly.var(b, 1).scale(F(nz(-6, 9))));
    const lhs = rat(Poly.var(x, 1).scale(A).add(Bp), Poly.const(1));
    const rhs = ratNum(Cp);
    const vals = { [a]: nz(-3, 5), [b]: nz(-3, 5) };
    const env = { [a]: F(vals[a]), [b]: F(vals[b]) };
    const Bv = Bp.eval(env), Cv = Cp.eval(env);
    if (Bv === null || Cv === null) continue;
    const ans = fDiv(fSub(Cv, Bv), A);
    if (!fIsInt(ans) || Math.abs(ans.n) > 40) continue;
    const body = '$' + ratToLatex(lhs) + ' = ' + ratToLatex(rhs) + '$\\quad [' + x + ']\\ \\text{ if } ' +
      a + ' = ' + vals[a] + ' \\text{ and } ' + b + ' = ' + vals[b];
    const steps = ['Substitute $' + a + ' = ' + vals[a] + '$ and $' + b + ' = ' + vals[b] + '$ into the formula.',
      'Then solve the resulting equation for $' + x + '$.',
      '$' + x + ' = ' + fracTex(ans) + '$'];
    return {
      kind: 'num', family: 'substSolve', ansNum: ans,
      prompt: 'In the following formula, find the value of the letter in the brackets by substitution.',
      body: body, ans: Poly.const(ans), ansTex: fracTex(ans),
      hints: ['Put the numbers in first — then it is just an equation.', 'Keep the letter in brackets on one side.'],
      steps: steps
    };
  }
  return null;
}

/* ========================================================================== */
/* 5. change the subject                                                      */
/* ========================================================================== */
function solveFor(lhsRat, rhsRat, target) {
  const diff = ratSub(lhsRat, rhsRat);
  const s = diff.n.splitLinear(target);
  if (!s || s.A.isZero()) return null;
  const ans = ratClean(rat(s.B.scale(F(-1)), s.A));
  /* verify: put the answer back into the equation at random points */
  const vars = [...new Set([...ratVars(diff), ...ratVars(ans)])].filter(v => v !== target);
  let ok = 0, tries = 0;
  while (tries < 40 && ok < 6) {
    tries++;
    const env = {};
    for (const v of vars) env[v] = TEST_POINTS[rnd(TEST_POINTS.length)];
    const xv = ratEval(ans, env);
    if (xv === null) continue;
    env[target] = xv;
    const d = ratEval(diff, env);
    if (d === null) continue;
    if (!fIsZero(d)) return null;
    ok++;
  }
  if (ok < 6) return null;
  return ans;
}
const SUBJ = {
  /* ---- level 1 templates ---- */
  s1(o) {                                   //  P / (c·x) = k        [x]
    const [x, a, b] = o.vs, c = F(nz(2, 6)), k = F(nz(2, 9));
    const lhs = rat(Poly.var(a, 1).mul(Poly.var(b, 1)), Poly.const(1).mul(Poly.var(x, 1)).scale(c));
    return { lhs, rhs: ratNum(Poly.const(k.n)), x };
  },
  s2(o) {                                   //  a = k - c·b·x        [x]
    const [x, a, b] = o.vs;
    const rhs = Poly.const(nz(1, 15)).sub(Poly.var(b, 1).mul(Poly.var(x, 1)).scale(F(nz(2, 7))));
    return { lhs: ratVar(a), rhs: ratNum(rhs), x };
  },
  s3(o) {                                   //  x·a + x·b = k        [x]
    const [x, a, b] = o.vs, k = F(ri(1, 5), pick([1, 2, 3]));
    const lhs = rat(Poly.var(x, 1).mul(Poly.var(a, 1).add(Poly.var(b, 1))), Poly.const(1));
    return { lhs, rhs: ratNum(Poly.const(k)), x };
  },
  s4(o) {                                   //  c(α·x + β·y) = k + δ·x   [x]
    const [x, y] = o.vs, c = F(nz(2, 4)), A = F(nz(2, 4)), B = F(nz(1, 4)), k = F(nz(1, 9)), D = F(nz(1, 4));
    const lhs = ratNum(Poly.var(x, 1).scale(A).add(Poly.var(y, 1).scale(B)).scale(c));
    const rhs = ratNum(Poly.const(k.n).add(Poly.var(x, 1).scale(D)));
    return { lhs, rhs, x };
  },
  s5(o) {                                   //  E = (p·u)/x - q        [x]
    const [x, a, b] = o.vs;
    const lhs = ratVar(a);
    const n = Poly.var(b, 1).scale(F(nz(2, 6))).sub(Poly.const(nz(1, 6)).mul(Poly.var(x, 1)));
    return { lhs, rhs: rat(n, Poly.var(x, 1)), x };
  },
  s6(o) {                                   //  p/x + q/y = k         [x]
    const [x, a, b] = o.vs;
    const lhs = ratAdd(rat(Poly.const(nz(1, 6)), Poly.var(x, 1)), rat(Poly.const(nz(1, 5)), Poly.var(a, 1)));
    return { lhs, rhs: ratNum(Poly.const(nz(2, 9))), x };
  },
  /* ---- level 2 templates ---- */
  h1(o) {                                   //  y = x / (c - x)       [x]
    const [x, y] = o.vs, c = F(nz(2, 9));
    const rhs = rat(Poly.var(x, 1), Poly.const(c.n).sub(Poly.var(x, 1)));
    return { lhs: ratVar(y), rhs, x };
  },
  h2(o) {                                   //  (x + a)/(x + b) = n   [x]
    const [x, y, z] = o.vs;
    const a = nz(-9, 9);
    let b = nz(-9, 9);
    while (b === a) b = nz(-9, 9);
    const lhs = rat(Poly.var(x, 1).add(Poly.const(a)), Poly.var(x, 1).add(Poly.const(b)));
    return { lhs, rhs: ratVar(y), x };
  },
  h3(o) {                                   //  T = (k + x)/x - c·y   [x]
    const [x, y, z] = o.vs;
    const rhs = ratSub(rat(Poly.const(nz(1, 6)).add(Poly.var(x, 1)), Poly.var(x, 1)),
      ratNum(Poly.var(y, 1).scale(F(nz(1, 4)))));
    return { lhs: ratVar(z || 'T'), rhs, x };
  },
  h4(o) {                                   //  p·x - r(x - 1) = 2(x + 1) + p   [x]
    const [x, p, r] = o.vs;
    const lhs = ratNum(Poly.var(x, 1).mul(Poly.var(p, 1))
      .sub(Poly.var(x, 1).sub(Poly.const(1)).mul(Poly.var(r, 1))));
    const rhs = ratNum(Poly.const(2).mul(Poly.var(x, 1).add(Poly.const(1))).add(Poly.var(p, 1)));
    return { lhs, rhs, x };
  },
  h5(o) {                                   //  (g - x)/x - f/a = -k/a   [x]
    const [x, g, f, a] = o.vs;
    const lhs = ratSub(rat(Poly.var(g, 1).sub(Poly.var(x, 1)), Poly.var(x, 1)),
      rat(Poly.var(f, 1), Poly.var(a, 1)));
    const rhs = rat(Poly.const(-nz(1, 4)), Poly.var(a, 1));
    return { lhs, rhs, x };
  },
  h6(o) {                                   //  αu/(βx) = (γu - δx)/(εx) - ζ   [x]
    const [x, u] = o.vs;
    const al = F(nz(2, 5)), be = F(nz(1, 4)), ga = F(nz(2, 5)), de = F(nz(1, 4)), ep = F(nz(2, 6));
    const lhs = rat(Poly.var(u, 1).scale(al), Poly.var(x, 1).scale(be));
    const rhs = ratSub(rat(Poly.var(u, 1).scale(ga).sub(Poly.var(x, 1).scale(de)), Poly.var(x, 1).scale(ep)),
      ratNum(Poly.const(nz(1, 5))));
    return { lhs, rhs, x };
  }
};

function G_subject(o) {
  o = o || {};
  const hard = !!o.hard;
  const names = hard
    ? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    : ['s1', 's2', 's3', 's4', 's5', 's6'];
  for (let attempt = 0; attempt < 60; attempt++) {
    const name = pick(names);
    const vs = pickVars(hard ? 4 : 3);
    const built = SUBJ[name]({ vs });
    const ans = solveFor(built.lhs, built.rhs, built.x);
    if (!ans) continue;
    if (ans.n.isZero()) continue;
    if (isOne(ans.d) && ans.n.isConst()) continue;           // too trivial
    const body = ratToLatex(built.lhs) + ' = ' + ratToLatex(built.rhs);
    const steps = [
      'Clear any fractions by multiplying through by the common denominator.',
      'Collect the terms containing $' + built.x + '$ on one side.',
      'Factorise $' + built.x + '$ out.',
      'Divide to leave $' + built.x + '$ alone: $' + built.x + ' = ' + ratToLatex(ans) + '$'
    ];
    return {
      kind: 'expr', family: 'subject',
      prompt: 'Make $' + built.x + '$ the subject of the formula.',
      body: body, ans: ans, ansTex: ratToLatex(ans),
      hints: [
        'Fractions first: multiply the whole equation by the denominator.',
        'Gather the $' + built.x + '$ terms together, then factorise.'
      ],
      steps: steps
    };
  }
  return null;
}

/* ========================================================================== */
/* 6. word problems with numeric answers                                      */
/* ========================================================================== */
function G_word(o) {
  o = o || {};
  const kind = pick(['bus', 'energy', 'heat', 'paper', 'party', 'hemisphere']);
  const rate = pick([50, 60, 80, 100, 120, 150]);
  const fixed = pick([100, 200, 250, 300, 400]);
  const n = ri(5, 40);
  switch (kind) {
    case 'bus': {
      const P = rate * n - fixed;
      return {
        kind: 'num', family: 'word', ansNum: F(n),
        prompt: 'The income \\$$P$ of the driver of a tour bus is calculated by ' +
          '$P = ' + rate + 'n - ' + fixed + '$, where $n$ is the number of passengers.',
        body: '(b) The driver has an income of \\$$' + P + '$. Find the number of passengers.',
        ans: Poly.const(n), ansTex: String(n),
        hints: ['Substitute $P = ' + P + '$ into the formula.', 'Solve the equation step by step.'],
        steps: ['$' + P + ' = ' + rate + 'n - ' + fixed + '$',
          '$' + rate + 'n = ' + (P + fixed) + '$', '$n = ' + n + '$']
      };
    }
    case 'energy': {
      const v = ri(2, 9);
      const m = ri(10, 80);
      const E = (m * v * v) / 2;
      if (m * v * v % 2) return G_word(o);
      return {
        kind: 'num', family: 'word', ansNum: F(m),
        prompt: 'The kinetic energy $E$ joules of a running person of mass $m$ kg running at $v$ m/s is $E = \\dfrac{mv^{2}}{2}$.',
        body: '(b) A person running at $' + v + '$ m/s has kinetic energy $' + E + '$ J. How heavy is the person?',
        ans: Poly.const(m), ansTex: String(m),
        hints: ['Substitute $E = ' + E + '$ and $v = ' + v + '$.', '$m = \\dfrac{2E}{v^{2}}$.'],
        steps: ['$m = \\dfrac{2E}{v^{2}}$', '$m = \\dfrac{2(' + E + ')}{' + v + '^{2}} = ' + m + '$']
      };
    }
    case 'heat': {
      const m = ri(1, 5), dT = ri(50, 200) * 2, c = ri(400, 900);
      const extra = ri(50, 200);
      const E = m * c * (dT + extra);
      return {
        kind: 'num', family: 'word', ansNum: F(E),
        prompt: 'When a metal block of $m$ kg is heated so that its temperature rises by $T-t$ °C, its internal energy rises by $E$ joules: $E = mc(T-t)$.',
        body: '(b)(i) A $' + m + '$ kg block whose temperature rises by $' + dT + '$ °C gains $' + (m * c * dT) + '$ J. Find $c$.' +
          '\\newline (ii) If the temperature rises a further $' + extra + '$ °C, find the overall increase in internal energy.',
        ans: Poly.const(E), ansTex: String(E),
        hints: ['First use the given rise to find $c$.', 'Then use $T-t = ' + (dT + extra) + '$.'],
        steps: ['$c = \\dfrac{E}{m(T-t)} = \\dfrac{' + (m * c * dT) + '}{' + m + '(' + dT + ')} = ' + c + '$',
          '$E = ' + m + '(' + c + ')(' + (dT + extra) + ') = ' + E + '$']
      };
    }
    case 'paper': {
      const A1 = pick([20, 25, 30, 40]), k = ri(5, 20), base = pick([200, 300, 400, 500]);
      // area is base + k x over x + 7 ; solve (base + kx)/(x+7) = A1
      // x = (base - 7*A1)/(A1 - k)
      const x0 = ri(3, 30);
      const base2 = A1 * (x0 + 7) - k * x0;
      if (A1 === k || base2 <= 0) return G_word(o);
      return {
        kind: 'num', family: 'word', ansNum: F(x0),
        prompt: 'A sheet of paper of area $(' + base2 + ' + ' + k + 'x)$ cm$^{2}$ is cut evenly into $(x+7)$ pieces. Each small piece has area $A$ cm$^{2}$.',
        body: '(a)(i) Express $A$ in terms of $x$.\\newline (ii) Make $x$ the subject of the formula.\\newline (b)(i) If $A = ' + A1 + '$, find $x$.',
        ans: Poly.const(x0), ansTex: String(x0),
        hints: ['$A = \\dfrac{' + base2 + ' + ' + k + 'x}{x+7}$.', 'Then cross-multiply to reach $x$.'],
        steps: ['$A = \\dfrac{' + base2 + ' + ' + k + 'x}{x+7}$',
          '$A(x+7) = ' + base2 + ' + ' + k + 'x$', '$x = \\dfrac{' + base2 + ' - 7A}{A - ' + k + '}$',
          '$x = \\dfrac{' + base2 + ' - 7(' + A1 + ')}{' + A1 + ' - ' + k + '} = ' + x0 + '$']
      };
    }
    case 'party': {
      const k1 = ri(2, 9), per = pick([30, 40, 50, 60]), base1 = pick([100, 200, 300, 500]);
      const m0 = ri(5, 30);
      const E = per * m0 + base1 * k1;
      return {
        kind: 'num', family: 'word', ansNum: F(k1),
        prompt: 'The total expenditure \\$$E$ for a party with $m$ participants is $E = ' + per + 'm + ' + base1 + 'k$, where $k$ is a constant.',
        body: '(a) For $' + m0 + '$ participants the expenditure is \\$$' + E + '$. Find $k$.\\newline (b)(i) Make $m$ the subject.',
        ans: Poly.const(k1), ansTex: String(k1),
        hints: ['Substitute $E = ' + E + '$ and $m = ' + m0 + '$.', 'Then solve for $k$.'],
        steps: ['$' + E + ' = ' + per + '(' + m0 + ') + ' + base1 + 'k$',
          '$' + base1 + 'k = ' + (E - per * m0) + '$', '$k = ' + k1 + '$']
      };
    }
    default: {
      const r = ri(2, 12);
      const A = 3 * r * r;
      const V = (2 * r * r * r) / 3;
      if ((2 * r * r * r) % 3) return G_word(o);
      return {
        kind: 'expr', family: 'word',
        prompt: 'The total surface area $A$ cm$^{2}$ of a hemisphere of radius $r$ cm is $A = 3\\pi r^{2}$, and its volume is $V = \\dfrac{2}{3}\\pi r^{3}$.',
        body: '(a) If $r = ' + r + '$, find $A$, leaving your answer in terms of $\\pi$.',
        ans: rat(Poly.const(A).mul(Poly.var('pi', 1)), Poly.const(1)),
        ansTex: A + '\\pi',
        hints: ['Put $r = ' + r + '$ into $A = 3\\pi r^{2}$.', 'Keep $\\pi$ as a symbol — do not replace it by a number.'],
        steps: ['$A = 3\\pi(' + r + ')^{2}$', '$A = ' + A + '\\pi$']
      };
    }
  }
}

/* ========================================================================== */
/* 7. wrap any generator as a 4-option multiple choice question               */
/* ========================================================================== */
function mutateAST(a) {
  const kinds = ['sign', 'swap', 'coef', 'drop'];
  let tries = 0;
  while (tries++ < 20) {
    const k = pick(kinds);
    const nodes = [];
    (function walk(n, path) {
      nodes.push({ n, path });
      if (n.a) walk(n.a, path.concat('a'));
      if (n.b) walk(n.b, path.concat('b'));
    })(a, []);
    const choice = pick(nodes);
    const clone = deepClone(a);
    let ptr = clone;
    for (const step of choice.path) ptr = ptr[step];
    const target = ptr;
    if (k === 'sign' && (target.k === '+' || target.k === '-')) {
      const src = choice.path.length ? getAt(clone, choice.path.slice(0, -1)) : null;
      // flip + / - by rebuilding
      if (choice.path.length) {
        const parent = getAt(clone, choice.path.slice(0, -1));
        const last = choice.path[choice.path.length - 1];
        if (target.k === '+') parent[last] = { k: '-', a: target.a, b: target.b };
        else parent[last] = { k: '+', a: target.a, b: target.b };
        return clone;
      }
      if (a.k === '+') return { k: '-', a: target.a, b: target.b };
      return { k: '+', a: target.a, b: target.b };
    }
    if (k === 'swap' && ptr.k === '/') {
      ptr.k = '/'; const tmp = ptr.a; ptr.a = ptr.b; ptr.b = tmp;
      return clone;
    }
    if (k === 'coef') {
      if (ptr.k === 'n') { ptr.v = F(pick([2, 3, 4, 5])); return clone; }
      if (ptr.k === '*') {
        for (const q of flattenM(ptr)) if (q.k === 'n') { q.v = F(pick([2, 3, 4])); return clone; }
      }
    }
    if (k === 'drop' && ptr.k === '*') {
      const parts = flattenM(ptr);
      if (parts.length > 1) {
        const idx = pick(parts.map((_, i) => i));
        const left = parts.filter((_, i) => i !== idx).reduce((x, y) => ({ k: '*', a: x, b: y }));
        if (choice.path.length) {
          const parent = getAt(clone, choice.path.slice(0, -1));
          parent[choice.path[choice.path.length - 1]] = left;
        }
        return choice.path.length ? clone : left;
      }
    }
  }
  return null;
}
function flattenM(e) { return e.k === '*' ? [...flattenM(e.a), ...flattenM(e.b)] : [e]; }
function getAt(root, path) { let x = root; for (const p of path) x = x[p]; return x; }
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function G_mcq(o) {
  o = o || {};
  const makers = [G_cancel, G_mulDiv, G_addSub, G_subject];
  for (let attempt = 0; attempt < 40; attempt++) {
    const maker = o.from || pick(makers);
    const item = maker(o);
    if (!item || item.kind !== 'expr') continue;
    const base = ratToAST(item.ans);
    const seen = new Set([texAST(base)]);
    const opts = [texAST(base)];
    let guard = 0;
    while (opts.length < 4 && guard++ < 60) {
      const m = mutateAST(base);
      if (!m) continue;
      let t;
      try { t = texAST(m); } catch (e) { continue; }
      if (seen.has(t)) continue;
      // must be genuinely different
      if (sameAST(m, base)) continue;
      seen.add(t);
      opts.push(t);
    }
    if (opts.length < 4) continue;
    const order = shuffle([0, 1, 2, 3]);
    const options = opts.map((_, i) => opts[order[i]]);
    const correct = order.indexOf(0);
    return {
      kind: 'mcq', family: item.family + 'Mcq',
      prompt: item.prompt,
      body: item.body,
      options: options, correct: correct,
      ansTex: opts[0],
      hints: item.hints.slice(0, 1).concat(['Try each option by working it out from scratch.']),
      steps: item.steps
    };
  }
  return G_mcq(o);
}

const FAMILIES = {
  cancel: { hard: [G_cancel, G_cancel], easy: [G_cancel] },
  cancelFactor: [G_cancel],
  mulDiv: [G_mulDiv],
  addSub: [G_addSub],
  subst: [G_subst],
  subject: [G_subject],
  word: [G_word],
  mcqSimplify: [G_mcq],
  mcqSubject: [G_mcq]
};

function genSimilar(family, hard) {
  const o = { hard: !!hard };
  if (family === 'cancelFactor') family = 'cancel';
  const map = {
    cancel: () => G_cancel(o),
    cancelFactor: () => G_cancel(o),
    mulDiv: () => G_mulDiv(o),
    addSub: () => G_addSub(o),
    subst: () => G_subst(o),
    subject: () => G_subject(o),
    word: () => G_word(o),
    change: () => G_word(o),
    bracketSimplify: () => G_mulDiv(o),
    mcqSimplify: () => G_mcq({}),
    mcqSubject: () => G_mcq({ from: G_subject }),
    mcqSubst: () => G_mcq({})
  };
  const f = map[family] || map.cancel;
  for (let i = 0; i < 30; i++) {
    const r = f();
    if (r) return r;
  }
  return G_cancel(o);
}

if (typeof module !== 'undefined') {
  module.exports = {
    G_cancel, G_mulDiv, G_addSub, G_subst, G_subject, G_word, G_mcq, genSimilar,
    linForm, solveFor, fracTex
  };
}
