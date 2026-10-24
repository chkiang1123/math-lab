/* ============================================================
   gens.js — similar-question generators
   Each generator returns a fresh question object:
   { q, kind, answer?, values?, accept?, options?, hints, steps }
   kinds: 'identity' | 'constants' | 'text' | 'mcq' | 'multi'
   ============================================================ */

const VARS1 = ['x', 'y', 'u', 'v', 'f', 'h', 'k', 'm', 'p', 'q', 's', 't', 'a', 'b'];

/* ---------- shared step builders ---------- */
function cmpSteps(lhsTex, rhsTex, lhsPoly, rhsPoly, v = 'x') {
  const same = lhsPoly.equals(rhsPoly);
  const steps = [
    'Expand the **left-hand side (LHS)**:\n$$\\text{LHS} = ' + lhsTex + ' = ' + lhsPoly.toLatex() + '$$',
    'Expand the **right-hand side (RHS)**:\n$$\\text{RHS} = ' + rhsTex + ' = ' + rhsPoly.toLatex() + '$$',
    same
      ? '$\\because$ LHS $=$ RHS for **all** values of $' + v + '$, the equation **is an identity** $\\equiv$.'
      : '$\\because$ LHS $\\neq$ RHS (they only match for particular values of $' + v + '$), the equation is **not an identity**.'
  ];
  return { same, steps };
}

/* ============================================================
   1. IDENTITY CHECK  (Q1–6, 37–38, MCQ 1–2)
   ============================================================ */
function genIdentity() {
  const style = pick(['linear', 'linear', 'product', 'square', 'square']);
  if (style === 'linear') {
    const q = nz(1, 5), r = nz(1, 6), k = nz(1, 3);
    const a = k * q, pTrue = k * r;
    const isId = Math.random() < 0.5;
    let p = pTrue;
    if (!isId) { do { p = pTrue + pick([-3, -2, -1, 1, 2, 3]); } while (p === pTrue); }
    if (p === 0) p = pTrue + 2;
    const lhs = Poly.c(a).mul(Poly.v('x').add(Poly.c(p)));
    const rhs = Poly.c(k).mul(Poly.c(q).mul(Poly.v('x')).add(Poly.c(r)));
    const lhsTex = binomTex(a, 'x', p), rhsTex = k + binomTex(q, 'x', r).slice(0);
    const r2 = k + '\\left(' + (q === 1 ? '' : q) + 'x' + (r < 0 ? ' - ' + (-r) : ' + ' + r) + '\\right)';
    const { same, steps } = cmpSteps(lhsTex, r2, lhs, rhs);
    return {
      kind: 'identity',
      q: 'Is this equation an identity?\n$$' + lhsTex + ' = ' + r2 + '$$',
      answer: same ? 'yes' : 'no', hints: identityHints(), steps, src: 'genIdentity-linear'
    };
  }
  if (style === 'product') {
    const a = nz(1, 4), b = nz(1, 4), c = nz(1, 4), d = nz(1, 4);
    const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X));
    const prod = Poly.monomial({ [X]: 1 }, a).add(Poly.monomial({ [Y]: 1 }, b))
      .mul(Poly.monomial({ [X]: 1 }, c).add(Poly.monomial({ [Y]: 1 }, d)));
    const isId = Math.random() < 0.5;
    let disp = prod;
    if (!isId) {
      const mid = prod.coeffOf({ [X]: 1, [Y]: 1 });
      const tweak = fAdd(mid, F(nz(1, 3) * (Math.random() < 0.5 ? 1 : -1)));
      disp = prod.sub(Poly.monomial({ [X]: 1, [Y]: 1 }, mid)).add(Poly.monomial({ [X]: 1, [Y]: 1 }, tweak));
    }
    const ltex = binom2Tex(a, X, b, Y) + binom2Tex(c, X, d, Y);
    const rtex = disp.toLatex();
    const { same, steps } = cmpSteps(ltex, rtex, prod, disp);
    return {
      kind: 'identity',
      q: 'Is this equation an identity?\n$$' + ltex + ' = ' + rtex + '$$',
      answer: same ? 'yes' : 'no', hints: identityHints(), steps, src: 'genIdentity-product'
    };
  }
  // square style
  const a = nz(2, 5), b = nz(2, 5);
  const isId = Math.random() < 0.5;
  const X = pick(VARS1);
  const lhs = Poly.c(a).mul(Poly.v(X)).sub(Poly.c(b)).pow(2);
  let rhsTex, rhs;
  if (isId) { rhs = Poly.c(b).sub(Poly.c(a).mul(Poly.v(X))).pow(2); rhsTex = binomTex(b, X, -a); }
  else { rhs = Poly.c(a).sub(Poly.c(b).mul(Poly.v(X))).pow(2); rhsTex = binomTex(a, X, -b); }
  const lhsTex = binomTex(a, X, -b);
  const { same, steps } = cmpSteps(lhsTex, rhsTex, lhs, rhs, X);
  return {
    kind: 'identity',
    q: 'Is this equation an identity?\n$$' + lhsTex + '^2 = ' + rhsTex + '^2$$'.replace('^^', '^'),
    answer: same ? 'yes' : 'no', hints: identityHints(), steps, src: 'genIdentity-square'
  };
}
function identityHints() {
  return [
    'An identity must be true for **every** value of the letter — not just one.',
    'Expand **both sides** completely, then compare term by term.',
    'If every coefficient matches, it is an identity. If even one term differs, it is not.'
  ];
}

/* ============================================================
   2. FIND UNKNOWN CONSTANTS  (Q7–12, 39–41, MCQ 3–5)
   ============================================================ */
function genFindAB() {
  const style = pick(['T1', 'T2', 'T3', 'T4']);
  if (style === 'T1') {
    const q = nz(2, 6), p = nz(1, 5), r = nz(1, 9) * (Math.random() < 0.5 ? 1 : -1);
    const A = q, B = r - q * p;
    const lhsTex = 'A\\left(' + (p < 0 ? 'x - ' + (-p) : 'x + ' + p) + '\\right) + B';
    const rhsTex = (q) + 'x' + (r < 0 ? ' - ' + (-r) : ' + ' + r);
    const steps = [
      'Expand the LHS, keeping $A$ and $B$ as letters:\n$$A(x ' + (p < 0 ? '- ' + (-p) : '+ ' + p) + ') + B = Ax ' + (A * p < 0 ? '- ' + (-A * p) : '+ ' + (A * p)) + ' + B$$',
      'Compare the **coefficients of $x$** on both sides:\n$$A = ' + A + '$$',
      'Compare the **constant terms**:\n$$' + (A * p) + ' + B = ' + r + '\\;\\Rightarrow\\; B = ' + r + ' - ' + (A * p) + ' = ' + B + '$$'
    ];
    return { kind: 'constants', vars: ['A', 'B'], values: [A, B], q: 'Find the constants $A$ and $B$:\n$$' + lhsTex + ' \\equiv ' + rhsTex + '$$', hints: constHints(), steps, src: 'genFindAB-T1' };
  }
  if (style === 'T2') {
    const a = nz(2, 4), b = nz(1, 4), c = nz(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    const A = a * a, d = 2 * a * b + c, B = b * b;
    const lhsTex = binomTex(a, 'x', -b) + '^2' + (c < 0 ? ' - ' + (-c) : ' + ' + c) + 'x';
    const rhsTex = A + 'x^2 ' + (d < 0 ? '-' : '+') + ' ' + Math.abs(d) + 'x + B';
    const mid = 2 * a * b;
    const steps = [
      'Expand the perfect square:\n$$' + binomTex(a, 'x', -b) + '^2 = ' + (a * a) + 'x^2 ' + (mid < 0 ? '-' : '+') + ' ' + Math.abs(mid) + 'x + ' + (b * b) + '$$',
      'Add the $x$-term:\n$$\\text{LHS} = ' + (a * a) + 'x^2 ' + (d < 0 ? '-' : '+') + ' ' + Math.abs(d) + 'x + ' + (b * b) + '$$',
      'Compare like terms: $A = ' + A + '$, and $B = ' + B + '$.'
    ];
    return { kind: 'constants', vars: ['A', 'B'], values: [A, B], q: 'Find the constants $A$ and $B$:\n$$' + lhsTex + ' \\equiv ' + rhsTex + '$$'.replace('$ $', '$$'), hints: constHints(), steps, src: 'genFindAB-T2' };
  }
  if (style === 'T3') {
    const p = nz(1, 6) * (Math.random() < 0.5 ? 1 : -1), q = nz(1, 6) * (Math.random() < 0.5 ? 1 : -1);
    const A = p + q, B = p * q;
    const f1 = '(' + (p < 0 ? 'x - ' + (-p) : 'x + ' + p) + ')', f2 = '(' + (q < 0 ? 'x - ' + (-q) : 'x + ' + q) + ')';
    const steps = [
      'Expand the product:\n$$' + f1 + f2 + ' = x^2 ' + (A < 0 ? '-' : '+') + ' ' + Math.abs(A) + 'x ' + (B < 0 ? '-' : '+') + ' ' + Math.abs(B) + '$$',
      'Compare the coefficient of $x$: $$A = ' + A + '$$',
      'Compare the constant: $$B = ' + B + '$$'
    ];
    return { kind: 'constants', vars: ['A', 'B'], values: [A, B], q: 'Find the constants $A$ and $B$:\n$$' + f1 + f2 + ' \\equiv x^2 + Ax + B$$', hints: constHints(), steps, src: 'genFindAB-T3' };
  }
  // T4: Ax(x+1)+B(x-1) ≡ px²+qx+r
  const A = nz(1, 5) * (Math.random() < 0.5 ? 1 : -1), B = nz(1, 6) * (Math.random() < 0.5 ? 1 : -1);
  const p = A, q = A + B, r = -B;
  const steps = [
    'Expand the LHS:\n$$Ax(x+1) + B(x-1) = Ax^2 + (A+B)x - B$$',
    'Compare coefficients of $x^2$: $$A = ' + p + '$$',
    'Compare coefficients of $x$: $$A + B = ' + q + '\\;\\Rightarrow\\; B = ' + q + ' - ' + p + ' = ' + B + '$$',
    'Check the constant: $-B = ' + r + '$ ✓'
  ];
  return { kind: 'constants', vars: ['A', 'B'], values: [A, B], q: 'Find the constants $A$ and $B$:\n$$Ax(x+1) + B(x-1) \\equiv ' + p + 'x^2 ' + (q < 0 ? '-' : '+') + ' ' + Math.abs(q) + 'x ' + (r < 0 ? '-' : '+') + ' ' + Math.abs(r) + '$$', hints: constHints(), steps, src: 'genFindAB-T4' };
}
function genFindABC() {
  const A = nz(2, 4), p = nz(1, 5) * (Math.random() < 0.5 ? 1 : -1), q = nz(1, 5) * (Math.random() < 0.5 ? 1 : -1);
  const B = A * (p + q), C = A * p * q;
  const f1 = '(Ax ' + (p < 0 ? '- ' + (-p) : '+ ' + p) + ')', f2 = '(x ' + (q < 0 ? '- ' + (-q) : '+ ' + q) + ')';
  const steps = [
    'Expand step by step:\n$$(Ax ' + (p < 0 ? '- ' + (-p) : '+ ' + p) + ')(x ' + (q < 0 ? '- ' + (-q) : '+ ' + q) + ') = Ax^2 + A(' + (p + q < 0 ? '(' + (p + q) + ')' : p + q) + ')x + ' + A + '\\cdot(' + (p * q) + ')$$',
    'Compare the coefficient of $x$: $$B = ' + B + '$$',
    'Compare the constant term: $$C = ' + C + '$$'
  ];
  return { kind: 'constants', vars: ['A', 'B', 'C'], values: [A, B, C], q: 'Find the constants $A$, $B$ and $C$:\n$$' + f1 + f2 + ' \\equiv Ax^2 + Bx + C$$', hints: constHints(), steps, src: 'genFindABC' };
}
function constHints() {
  return [
    'Expand the side with the letters $A$, $B$ (treat them like numbers), then **compare coefficients** term by term.',
    'The $x^2$ coefficients match each other, the $x$ coefficients match each other, and the constants match each other.',
    'Form a small equation for each letter and solve it.'
  ];
}

/* ============================================================
   3. EXPAND — DIFFERENCE OF SQUARES  (Q13–16, 42–45)
   ============================================================ */
function genExpandDiffSq() {
  const X = pick(VARS1); let Y = pick(VARS1.filter(v => v !== X));
  const a = nz(1, 7), b = nz(1, 7);
  const outer = pick([null, null, F(1, nz(2, 4)), F(nz(2, 5))]);
  const p = Poly.c(a).mul(Poly.v(X)).add(Poly.c(b).mul(Poly.v(Y)));
  const n = Poly.c(a).mul(Poly.v(X)).sub(Poly.c(b).mul(Poly.v(Y)));
  let ans = p.mul(n); // a²X² - b²Y²
  let prefix = '', prefixTex = '';
  if (outer) { ans = ans.scale(outer); prefixTex = fLatex(outer); prefix = fPlain(outer); }
  const t1 = binom2Tex(a, X, b, Y), t2 = binom2Tex(a, X, -b, Y);
  const qTex = (outer && !fIsInt(outer) ? prefixTex : (outer ? prefix : '')) + t1 + t2;
  const A = a + X, B = b + Y;
  const steps = [
    'Spot the pattern $(\\,A+B\\,)(\\,A-B\\,)$ with $A = ' + a + X + '$ and $B = ' + b + Y + '$' + (outer ? ', and the outside factor $' + prefixTex + '$' : '') + '.',
    'Apply the identity $(A+B)(A-B) = A^2 - B^2$:\n$$= ' + (outer && !fIsInt(outer) ? prefixTex : (outer ? prefix : '')) + '\\left[' + (a * a) + X + '^2 - ' + (b * b) + Y + '^2\\right]$$',
    'Answer: $$' + ans.toLatex() + '$$'
  ];
  const hints = [
    'Look at the two brackets — same two terms, but one sign is different. That is $(A+B)(A-B)$.',
    'Use $(A+B)(A-B) = A^2 - B^2$. Here $A = ' + a + X + '$ and $B = ' + b + Y + '$.',
    'Square each term: $(' + a + X + ')^2 = ' + (a * a) + X + '^2$ and $(' + b + Y + ')^2 = ' + (b * b) + Y + '^2$' + (outer ? ', then multiply by the outside factor.' : '.')
  ];
  const plain = ans.toPlain();
  const accept = [plain];
  if (!fIsInt(ans.sortedTerms()[0].c)) {
    accept.push(plain.replace(/^(-?)(\d+)\/(\d+)/, '$1($2/$3)'));
    const m = plain.match(/^(-?)(\d+)\/(\d+)(.+)$/);
    if (m) accept.push(m[1] + m[2] + m[4] + '/' + m[3]);
  }
  return { kind: 'text', q: 'Expand:\n$$' + qTex + '$$', accept, ansTex: ans.toLatex(), hints, steps, src: 'genExpandDiffSq' };
}

/* ============================================================
   4. EXPAND — PERFECT SQUARES  (Q17–20, 46–49)
   ============================================================ */
function genExpandSq() {
  const X = pick(VARS1); const Y = pick(VARS1.filter(v => v !== X));
  const a = nz(1, 7), b = nz(1, 7);
  const sign = Math.random() < 0.5 ? 1 : -1;
  const negLead = Math.random() < 0.35;
  // expression (±aX ± bY)²
  const inner = Poly.c((negLead ? -a : a) * 1).mul(Poly.v(X)).add(Poly.c(sign * (negLead ? -b : b)).mul(Poly.v(Y)));
  const ans = inner.pow(2);
  const innerTex = binom2Tex(negLead ? -a : a, X, sign * b * (negLead ? -1 : 1), Y);
  const qTex = innerTex + '^2';
  const A = a + X, B = b + Y;
  const midSign = sign * (negLead ? -1 : 1) > 0 ? '+' : '-';
  let step1 = 'Use the identity $(A ' + (sign > 0 ? '+' : '-') + ' B)^2 = A^2 ' + (sign > 0 ? '+' : '-') + ' 2AB + B^2$.';
  if (negLead) step1 += ' First note that $' + innerTex + '^2 = ' + binom2Tex(a, X, -sign * b, Y) + '^2$ (a square is unchanged if both signs flip).';
  const steps = [
    step1,
    'Here $A = ' + a + X + '$ and $B = ' + b + Y + '$, so $A^2 = ' + (a * a) + X + '^2$, $2AB = ' + (2 * a * b) + X + Y + '$, $B^2 = ' + (b * b) + Y + '^2$.',
    'Answer: $$' + ans.toLatex() + '$$'
  ];
  const hints = [
    'This is a perfect square: $(A \\pm B)^2 = A^2 \\pm 2AB + B^2$.',
    'Take $A = ' + a + X + '$ and $B = ' + b + Y + '$. Don\u2019t forget the middle term $2AB = ' + (2 * a * b) + X + Y + '$!',
    'Square the coefficients too: $(' + a + X + ')^2 = ' + (a * a) + X + '^2$.'
  ];
  return { kind: 'text', q: 'Expand:\n$$' + qTex + '$$', accept: [ans.toPlain()], ansTex: ans.toLatex(), hints, steps, src: 'genExpandSq' };
}

/* ============================================================
   5. FACTORISE — COMMON FACTOR  (Q21–24)
   ============================================================ */
function genFactorCommon() {
  if (Math.random() < 0.5) {
    // numeric common factor: g(±aX ± bY ± cZ) shown expanded
    const g = nz(2, 9);
    const a = nz(1, 7), b = nz(1, 7);
    const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X));
    const s1 = pick([1, -1]), s2 = pick([1, -1]);
    const inner = Poly.monomial({ [X]: 1 }, s1 * a).add(Poly.monomial({ [Y]: 1 }, s2 * b));
    const ans = inner.scale(g);
    const qTex = ans.toLatex();
    const innerPlain = inner.toPlain();
    const steps = [
      'Find the highest common factor of the coefficients: it is $' + g + '$.',
      'Factor it out: $$' + qTex + ' = ' + g + '(' + inner.toLatex() + ')$$',
      'Check by expanding back: $' + g + '\\times' + '$ each term returns the original expression ✓'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + qTex + '$$', accept: [g + '(' + innerPlain + ')', innerPlain + ')(-1)'].slice(0, 1).concat([g + '(' + innerPlain + ')']), ansTex: g + '(' + inner.toLatex() + ')', hints: ['All the coefficients share the factor $' + g + '$ — pull it outside the bracket.', 'Divide each term by $' + g + '$: the first term becomes $' + (Math.abs(ans.sortedTerms()[0].c.n / ans.sortedTerms()[0].c.d) / g) + X + '$…', 'Answer: $' + g + '(' + inner.toLatex() + ')$'], steps, src: 'genFactorCommon' };
  }
  // shared-variable pattern: c1·XY ± c2·YZ → Y(c1X ± c2Z)
  const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X)), Z = pick(VARS1.filter(v => v !== X && v !== Y));
  const c1 = nz(1, 7) * pick([1, -1]), c2 = nz(1, 7) * pick([1, -1]);
  const t1 = Poly.monomial({ [X]: 1, [Y]: 1 }, c1), t2 = Poly.monomial({ [Y]: 1, [Z]: 1 }, c2);
  const expr = t1.add(t2);
  const inner = Poly.monomial({ [X]: 1 }, c1).add(Poly.monomial({ [Z]: 1 }, c2));
  const ansPlain = Y + '(' + inner.toPlain() + ')';
  const qTex = expr.toLatex();
  const steps = [
    'Both terms contain the letter $' + Y + '$ — that is the common factor.',
    'Factor it out: $$' + qTex + ' = ' + Y + '(' + inner.toLatex() + ')$$',
    'Quick check: $' + Y + '(' + inner.toLatex() + ')$ expands back to the original expression ✓'
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + qTex + '$$', accept: [ansPlain], ansTex: Y + '(' + inner.toLatex() + ')', hints: ['Which letter appears in **both** terms? That is your common factor.', 'The common factor is $' + Y + '$. Divide each term by it.', 'Answer: $' + Y + '(' + inner.toLatex() + ')$'], steps, src: 'genFactorCommon-var' };
}

/* ============================================================
   6. FACTORISE — COMMON BINOMIAL  (Q23–24)
   ============================================================ */
function genFactorBinom() {
  const W = pick(['(y + 4)', '(x - 3)', '(k + 5)', '(2m + 1)', '(3p - 2)', '(a + 6)']);
  const innerVar = W[1];
  const m = nz(1, 5), n = nz(1, 5);
  const sum = m + n;
  const qTex = m + W + ' + ' + n + W;
  const ansTex = W + '(' + m + ' + ' + n + ')'.replace(/(\d+ \+ \d+)/, '$1');
  const steps = [
    'Both terms contain the bracket $' + W + '$ — treat it like a single quantity.',
    'Factor it out: $$' + m + W + ' + ' + n + W + ' = ' + W + '(' + m + ' + ' + n + ')$$',
    'Simplify what is left: $' + m + ' + ' + n + ' = ' + sum + '$, so the answer is $' + W.slice(0) + '(' + sum + ')$'.replace(W.slice(0), W)
  ];
  steps[2] = 'Simplify: $' + m + ' + ' + n + ' = ' + sum + '$, so the answer is $' + W + '(' + sum + ')$.';
  return { kind: 'text', q: 'Factorise:\n$$' + m + W + ' + ' + n + W + '$$', accept: [W + '(' + sum + ')'], ansTex: W + '(' + sum + ')', hints: ['Look for a bracket that appears in **both** terms.', 'Factor out ' + W + ' — whatever multiplies it goes inside the new bracket.', 'Answer: $' + W + '(' + sum + ')$'], steps, src: 'genFactorBinom' };
}

/* ============================================================
   7. FACTORISE — GROUPING  (Q25–28, MCQ 9–10, 12)
   ============================================================ */
function genFactorGrouping() {
  const X = pick(VARS1); let Y = pick(VARS1.filter(v => v !== X)); let Z = pick(VARS1.filter(v => v !== X && v !== Y));
  let a = nz(1, 5) * pick([1, -1]), b = nz(1, 5) * pick([1, -1]);
  const c = nz(1, 5) * pick([1, -1]), d = nz(1, 5) * pick([1, -1]);
  let F1 = Poly.monomial({ [X]: 1 }, a).add(Poly.monomial({ [Z]: 1 }, b));
  const F2 = Poly.monomial({ [Y]: 1 }, c).add(Poly.monomial({ [Z]: 1 }, d));
  let expr = F1.mul(F2);
  const order0 = [Poly.key({ [X]: 1, [Y]: 1 }), Poly.key({ [X]: 1, [Z]: 1 }), Poly.key({ [Y]: 1, [Z]: 1 }), Poly.key({ [Z]: 2 })];
  if (expr.sortedTerms(order0)[0].c.n < 0) { // flip F1's signs so the product leads positive
    a = -a; b = -b;
    F1 = Poly.monomial({ [X]: 1 }, a).add(Poly.monomial({ [Z]: 1 }, b));
    expr = F1.mul(F2);
  }
  const order = order0;
  const qTex = expr.toLatex(order);
  const t = expr.sortedTerms(order);
  const g1 = Poly.monomial(t[0].m, t[0].c).add(Poly.monomial(t[1].m, t[1].c));
  const g2 = Poly.monomial(t[2].m, t[2].c).add(Poly.monomial(t[3].m, t[3].c));
  // factors of each group
  const f1 = commonOf(g1), f2 = commonOf(g2);
  const ansTex = '(' + F2.toLatex().replace(/^\+/, '').replace(/-\s*\d/, m => m.replace(' - ', ' - ')) + ')(' + F1.toLatex().replace(/^\+/, '') + ')';
  const A = '(' + F2.toLatex().replace(/^\+/, '') + ')', B = '(' + F1.toLatex().replace(/^\+/, '') + ')';
  const steps = [
    'Group the terms in pairs:\n$$(' + g1.toLatex() + ') + (' + g2.toLatex() + ')$$',
    'Factor each group: $$' + g1.toLatex() + ' = ' + f1 + B + '\\qquad ' + g2.toLatex() + ' = ' + f2 + B + '$$',
    'Both groups now share the bracket $' + B + '$:\n$$= ' + B + A + '$$'
  ];
  const hints = [
    'Four terms? Try **grouping in pairs** — put two terms that share a letter together.',
    'Group as $(' + g1.toLatex() + ') + (' + g2.toLatex() + ')$, then factor each pair.',
    'Each group contains the bracket $' + B + '$ — pull it out.'
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + qTex + '$$', accept: [A + B, B + A], ansTex: A + B, hints, steps, src: 'genFactorGrouping' };
}
/* find the common monomial factor of a 2-term group, return its tex */
function commonOf(g) {
  const ts = g.sortedTerms();
  let cm = { ...ts[0].m }, cc = ts[0].c;
  for (const t of ts) {
    for (const v in cm) if (!(t.m[v])) delete cm[v];
    for (const v in cm) cm[v] = Math.min(cm[v], t.m[v] || 0);
    // numeric gcd
  }
  const nums = ts.map(t => Math.abs(t.c.n));
  const g0 = nums.reduce((x, y) => gcd(x, y), nums[0]);
  const dens = ts.map(t => t.c.d);
  const dl = dens.reduce((x, y) => x * y / gcd(x, y), 1);
  const sgnAll = ts.every(t => t.c.n > 0) ? 1 : (ts.every(t => t.c.n < 0) ? -1 : 1);
  let monoTex = '';
  for (const v of Object.keys(cm).sort()) monoTex += (cm[v] ? v + (cm[v] > 1 ? '^{' + cm[v] + '}' : '') : '');
  const num = Math.abs(g0) / dl;
  let coeffTex = (num === 1 ? '' : String(num));
  if (sgnAll < 0) coeffTex = '-' + coeffTex;
  if (!monoTex && num === 1) return sgnAll < 0 ? '-' : '';
  return coeffTex + monoTex;
}

/* ============================================================
   8. FACTORISE — DIFFERENCE OF SQUARES  (Q29–32)
   ============================================================ */
function genFactorDiffSq() {
  const style = pick(['plain', 'negLead', 'commonFac']);
  const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X));
  const a = nz(2, 9), b = nz(2, 9);
  if (style === 'plain') {
    const expr = Poly.monomial({ [X]: 2 }, a * a).sub(Poly.monomial({ [Y]: 2 }, b * b));
    const ansTex = '(' + a + X + ' + ' + b + Y + ')(' + a + X + ' - ' + b + Y + ')';
    return finishDiffSq(expr, ansTex, X, Y, a, b);
  }
  if (style === 'negLead') {
    const expr = Poly.monomial({ [X]: 2 }, -(a * a)).add(Poly.monomial({ [Y]: 2 }, b * b));
    const ansTex = '(' + b + Y + ' + ' + a + X + ')(' + b + Y + ' - ' + a + X + ')';
    return finishDiffSq(expr, ansTex, X, Y, a, b, true);
  }
  // common factor first: g(b²X² − a²) or g(a² − b²X²)
  const g = nz(2, 5), bb = nz(2, 6);
  const flip = Math.random() < 0.5;
  const expr = (flip ? -1 : 1) * g * (b * b) === 0 ? null : null;
  const exprP = Poly.c(flip ? -g : g).mul(Poly.monomial({ [X]: 2 }, b * b).sub(Poly.c(a * a)));
  const ansTex = g + '(' + (flip ? a + ' - ' + b + X : b + X + ' + ' + a) + (flip ? ')(' + b + X + ' + ' + a + ')' : ')(' + b + X + ' - ' + a + ')');
  const finalTex = flip ? g + '(' + a + ' + ' + b + X + ')(' + a + ' - ' + b + X + ')' : g + '(' + b + X + ' + ' + a + ')(' + b + X + ' - ' + a + ')';
  const steps = [
    'First take out the common factor $' + g + '$:\n$$= ' + g + '(' + (flip ? a * 0 : '') + (flip ? '' : '') + (flip ? a - a + a + ' - ' + b * b + X + '^2' : b * b + X + '^2 - ' + a) + ')$$',
    'The bracket is a difference of squares: $' + (flip ? a : b * b + X + '^2') + '$ and $' + (flip ? b * b + X + '^2' : a) + '$ are both perfect squares.',
    'Apply $A^2 - B^2 = (A+B)(A-B)$:\n$$= ' + finalTex + '$$'
  ];
  const hints = [
    'All the terms share the factor $' + g + '$ — take it out first.',
    'Now you have $A^2 - B^2$ inside the bracket. Identify $A$ and $B$.',
    'Apply $(A+B)(A-B)$.'
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + exprP.toLatex() + '$$', accept: [finalTex], ansTex: finalTex, hints, steps, src: 'genFactorDiffSq-cf' };
}
function finishDiffSq(expr, ansTex, X, Y, a, b, negLead = false) {
  const steps = [
    'Write each term as a perfect square: $$' + expr.toLatex() + ' = (' + a + X + ')^2 - (' + b + Y + ')^2$$',
    'Apply the identity $A^2 - B^2 = (A+B)(A-B)$ with $A = ' + a + X + '$ and $B = ' + b + Y + '$.',
    'Answer: $$' + ansTex + '$$'
  ];
  const hints = [
    'Both terms are perfect squares — this is $A^2 - B^2$.',
    'Here $A = ' + a + X + '$ and $B = ' + b + Y + '$.',
    'Use $A^2 - B^2 = (A+B)(A-B)$.'
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints, steps, src: 'genFactorDiffSq' };
}

/* ============================================================
   9. FACTORISE — PERFECT SQUARE  (Q33–36)
   ============================================================ */
function genFactorPerfectSq() {
  const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X));
  const a = nz(2, 7), b = nz(2, 7);
  const sign = pick([1, -1]);
  const negAll = Math.random() < 0.4;
  const scale = negAll ? -1 : 1;
  const square = Poly.c(a).mul(Poly.v(X)).add(Poly.c(b).mul(Poly.v(Y))).pow(2);
  const expr = square.scale(scale);
  if (!expr.equals(square.scale(scale))) throw new Error('perfsq self-check failed');
  const bracketTex = binom2Tex(a, X, sign * b, Y);
  const ansTex = (negAll ? '-' : '') + bracketTex + '^2';
  const A = a + X, B = b + Y;
  const steps = [
    (negAll ? 'Every term is negative — take out the common factor $-1$ first:' : 'Check the pattern: first and last terms are perfect squares, and the middle term is $2AB$.'),
    negAll ? '$$' + expr.toLatex() + ' = -\\left(' + Poly.c(a).mul(Poly.v(X)).add(Poly.c(b).mul(Poly.v(Y))).pow(2).scale(sign).toLatex() + '\\right)$$' : '$$A = ' + a + X + ',\\quad B = ' + b + Y + ',\\quad 2AB = ' + (2 * a * b * sign > 0 ? '' : '-') + (2 * a * b) + X + Y + '$$',
    'Apply $A^2 ' + (sign > 0 ? '+' : '-') + ' 2AB + B^2 = (A ' + (sign > 0 ? '+' : '-') + ' B)^2$:',
    'Answer: $$' + ansTex + '$$'
  ];
  const hints = [
    'Is the first term a square? Is the last term a square? Is the middle term $2AB$?',
    'Here $A = ' + a + X + '$ and $B = ' + b + Y + '$, and the middle term is $' + (sign > 0 ? '+' : '-') + (2 * a * b) + X + Y + '$ — it fits' + (negAll ? ' once you factor out $-1$.' : '.'),
    'Use $(A ' + (sign > 0 ? '+' : '-') + ' B)^2 = A^2 ' + (sign > 0 ? '+' : '-') + ' 2AB + B^2$' + (negAll ? ' with a minus sign in front.' : '.')
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints, steps, src: 'genFactorPerfectSq' };
}

/* ============================================================
   10. LEVEL-2 COMPOSITE FACTORISING  (Q56–65)
   ============================================================ */
function genL2() {
  const style = pick(['pow', 'sqDiff', 'kSqDiff', 'groupDiff', 'groupSq', 'fourth']);
  const X = pick(['x', 'p', 'm', 'a', 'h', 'k']);
  if (style === 'pow') {
    // k·Y³((aX)²−b²)  e.g. 12p²q³−75q³
    const Y = pick(['q', 'y', 'z', 'n'].filter(v => v !== X));
    const g = pick([2, 3, 4]), a = nz(2, 5), b = nz(2, 6);
    const expr = Poly.c(g).mul(Poly.monomial({ [X]: 2, [Y]: 3 }, a * a)).sub(Poly.c(g * b * b).mul(Poly.monomial({ [Y]: 3 }, 1)));
    const ansTex = g + Y + '^3(' + a + X + ' + ' + b + ')(' + a + X + ' - ' + b + ')';
    const steps = [
      'Common factor first: $' + g + Y + '^3$ appears in both terms.',
      '$$= ' + g + Y + '^3\\left(' + (a * a) + X + '^2 - ' + (b * b) + '\\right)$$',
      'The bracket is $A^2 - B^2$ with $A = ' + a + X + '$, $B = ' + b + '$:\n$$= ' + ansTex + '$$'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints: ['What is common to **both** terms? (Coefficient and powers.)', 'Factor out $' + g + Y + '^3$ — then look at what remains.', 'The bracket is a difference of squares.'], steps, src: 'genL2-pow' };
  }
  if (style === 'sqDiff') {
    // (aX+b)² − c²  or k[d² − (aX+b)²]
    const a = nz(1, 3), b = nz(1, 4), c = nz(2, 7);
    const outerK = Math.random() < 0.5 ? nz(2, 7) : 1;
    const lin = binomTex(a, X, b);
    const expr = Poly.c(outerK).mul(Poly.c(a).mul(Poly.v(X)).add(Poly.c(b)).pow(2).sub(Poly.c(c * c)));
    const A = lin.slice(1, -1), Bs = String(c);
    const ansTex = outerK === 1
      ? (Math.random() < 0.5 ? '(' + A + ' + ' + c + ')(' + A + ' - ' + c + ')' : '(' + A + ' - ' + c + ')(' + A + ' + ' + c + ')')
      : outerK + '(' + A + ' + ' + c + ')(' + A + ' - ' + c + ')';
    const steps = [
      'This is $A^2 - B^2$ with $A = ' + A + '$ and $B = ' + c + '$' + (outerK !== 1 ? ', and an outside factor $' + outerK + '$' : '') + '.',
      'Apply $A^2 - B^2 = (A+B)(A-B)$:\n$$= ' + ansTex + '$$'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints: ['Can you see a **square minus a square**? (The number ' + c + ' = ' + c + '².)', 'Take $A = ' + A + '$ and $B = ' + c + '$.', 'Use $(A+B)(A-B)$' + (outerK !== 1 ? ' and keep the factor ' + outerK + ' outside.' : '.')], steps, src: 'genL2-sqDiff' };
  }
  if (style === 'kSqDiff') {
    // a²(X−p)² + 2ac(X−p) + c²  displayed with optional sign trick in the middle
    const a = pick([2, 3, 4]), c = pick([1, 3, 5]), p = nz(1, 4);
    const lin = Poly.v(X).sub(Poly.c(p));
    const expr = lin.pow(2).scale(a * a).add(lin.scale(2 * a * c)).add(Poly.c(c * c));
    const midFlip = Math.random() < 0.5;
    const qTex = (a * a) + '(' + X + ' - ' + p + ')^2 ' + (midFlip ? '- ' + (2 * a * c) + '(' + p + ' - ' + X + ')' : '+ ' + (2 * a * c) + '(' + X + ' - ' + p + ')') + ' + ' + (c * c);
    const innerTex = a + '(' + X + ' - ' + p + ')' + (c === 1 ? ' + 1' : ' + ' + c);
    const steps = [
      midFlip ? 'Rewrite the middle term: $- ' + (2 * a * c) + '(' + p + ' - ' + X + ') = + ' + (2 * a * c) + '(' + X + ' - ' + p + ')$.' : 'Look at the powers of $(' + X + ' - ' + p + ')$ — it appears squared and once.',
      'Let $T = ' + X + ' - ' + p + '$. The expression becomes $' + (a * a) + 'T^2 + ' + (2 * a * c) + 'T + ' + (c * c) + '$.',
      'This is a perfect square: $' + (a * a) + 'T^2 + ' + (2 * a * c) + 'T + ' + (c * c) + ' = (' + a + 'T + ' + c + ')^2$.',
      'Substitute back: $$= (' + innerTex + ')^2$$'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + qTex + '$$', accept: ['(' + innerTex + ')^2'], ansTex: '(' + innerTex + ')^2', hints: ['Spot how $(' + X + ' - ' + p + ')$ appears in two terms — call it $T$.', 'The expression is a **perfect square** in $T$: first term $' + (a * a) + 'T^2$, last term $' + (c * c) + ' = ' + c + '^2$.', 'It becomes $(' + a + 'T + ' + c + ')^2$ — now put $T = ' + X + ' - ' + p + '$ back.'], steps, src: 'genL2-kSqDiff' };
  }
  if (style === 'groupDiff') {
    // X² − a²Y² − cX − acY = (X+aY)(X−aY−c)
    const Y = pick(['y', 'q', 'n', 'b'].filter(v => v !== X));
    const a = pick([2, 3, 4]), c = nz(2, 5);
    const expr = Poly.monomial({ [X]: 2 }, 1).sub(Poly.monomial({ [Y]: 2 }, a * a)).sub(Poly.monomial({ [X]: 1 }, c)).sub(Poly.monomial({ [X]: 1, [Y]: 1 }, a * c));
    const order = [Poly.key({ [X]: 2 }), Poly.key({ [Y]: 2 }), Poly.key({ [X]: 1 }), Poly.key({ [X]: 1, [Y]: 1 })];
    const qTex = expr.toLatex(order);
    const ansTex = '(' + X + ' + ' + a + Y + ')(' + X + ' - ' + a + Y + ' - ' + c + ')';
    const steps = [
      'Group: the first two terms form a difference of squares:\n$$' + X + '^2 - ' + (a * a) + Y + '^2 = (' + X + ' + ' + a + Y + ')(' + X + ' - ' + a + Y + ')$$',
      'The last two terms share $-' + c + '$: $$-' + c + X + ' - ' + (a * c) + Y + ' = -' + c + '(' + X + ' + ' + a + Y + ')$$',
      'Both parts contain $(' + X + ' + ' + a + Y + ')$:\n$$= (' + X + ' + ' + a + Y + ')(' + X + ' - ' + a + Y + ' - ' + c + ')$$'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + qTex + '$$', accept: [ansTex], ansTex, hints: ['Split the four terms into two pairs: $X^2 - ' + (a * a) + Y + '^2$ and the remaining two.', 'Factor each pair — do they share a bracket?', 'Common bracket: $(' + X + ' + ' + a + Y + ')$.'], steps, src: 'genL2-groupDiff' };
  }
  if (style === 'groupSq') {
    // (aX)² − (bY+c)² style written as four terms then regroup: X² − b²Y² − 2bcY − c² → (X+bY+c)(X−bY−c)? use groupDiff instead. Use perfect square minus square:
    const Y = pick(['y', 'q', 'n', 'b'].filter(v => v !== X));
    const a = pick([2, 3, 4]), b = pick([1, 2, 3]), c = nz(1, 5);
    const expr = Poly.monomial({ [X]: 2 }, a * a).sub(Poly.c(b).mul(Poly.v(Y)).add(Poly.c(c)).pow(2));
    const A = a + X, B = b + Y + ' + ' + c;
    const ansTex = '(' + A + ' + ' + B + ')(' + A + ' - ' + B + ')';
    const steps = [
      'Write the second part as a square: $(' + b + Y + ' + ' + c + ')^2$.',
      'The expression is $A^2 - B^2$ with $A = ' + A + '$ and $B = ' + b + Y + ' + ' + c + '$.',
      'Apply $A^2 - B^2 = (A+B)(A-B)$:\n$$= ' + ansTex + '$$'
    ];
    return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints: ['Group the last three terms — they form a perfect square.', 'It is $A^2 - B^2$ with $A = ' + A + '$ and $B = ' + b + Y + ' + ' + c + '$.', 'Use $(A+B)(A-B)$.'], steps, src: 'genL2-groupSq' };
  }
  // fourth: 2q(p⁴−16) style
  const Y = pick(['q', 'y', 'n'].filter(v => v !== X));
  const g = nz(2, 5), r = nz(1, 4);
  const expr = Poly.c(g).mul(Poly.v(X, 4)).sub(Poly.c(g * Math.pow(r, 4))).mul(Poly.monomial({ [Y]: 1 }, 1));
  const ansTex = g + Y + '(' + X + '^2 + ' + (r * r) + ')(' + X + ' + ' + r + ')(' + X + ' - ' + r + ')';
  const steps = [
    'Common factor: $' + g + Y + '$.',
    '$$= ' + g + Y + '(' + X + '^4 - ' + (r * r * r * r) + ') = ' + g + Y + '\\left[(' + X + '^2)^2 - (' + (r * r) + ')^2\\right]$$',
    'Difference of squares: $= ' + g + Y + '(' + X + '^2 + ' + (r * r) + ')(' + X + '^2 - ' + (r * r) + ')$',
    '$' + X + '^2 - ' + (r * r) + '$ is itself a difference of squares:\n$$= ' + ansTex + '$$'
  ];
  return { kind: 'text', q: 'Factorise:\n$$' + expr.toLatex() + '$$', accept: [ansTex], ansTex, hints: ['Take out the common factor $' + g + Y + '$ first.', '$' + X + '^4 - ' + (r ** 4) + '$ is a difference of squares **twice over**.', 'Keep factorising until nothing factors further. $' + X + '^2 + ' + (r * r) + '$ cannot be factorised.'], steps, src: 'genL2-fourth' };
}

/* ============================================================
   11. MULTI-PART CHALLENGES  (Q66–70)
   ============================================================ */
function genSubstitution() { // Q66 style: perfect square, then substitute
  const a = pick([2, 4, 6]);
  const q1 = 'x^2 + ' + (2 * a) + 'xy + ' + (a * a) + 'y^2';
  const bracketTex = '(m - n) + ' + a + '(2m + n)';
  const cM = 1 + 2 * a, cN = a - 1;
  const inner = cM + 'm ' + (cN < 0 ? '- ' + (-cN) : '+ ' + cN) + 'n';
  const g = gcd(cM, cN);
  const ans2Plain = g > 1 ? g + '(' + (cM / g) + 'm ' + (cN < 0 ? '- ' + (-cN / g) : '+ ' + (cN / g)) + 'n)^2' : '(' + inner + ')^2';
  const hints1 = ['Check: is the middle term $2 \\times x \\times ' + a + 'y$?', 'It is a perfect square: $A^2 + 2AB + B^2$.'];
  const steps1 = ['$A = x$, $B = ' + a + 'y$, and the middle term is $2 \\times x \\times ' + a + 'y = ' + (2 * a) + 'xy$ ✓', 'So $' + q1 + ' = (x + ' + a + 'y)^2$.'];
  const hints2 = ['Compare with part (a): $x$ plays the role of $m - n$, and $' + a + 'y$ plays the role of $' + a + '(2m + n)$.', 'Substitute into $(x + ' + a + 'y)^2$.', 'Collect like terms inside the bracket, then check for a common factor.'];
  const steps2 = [
    'Put $x = m - n$ and $y = 2m + n$ into $(x + ' + a + 'y)^2$:\n$$= \\left[' + bracketTex + '\\right]^2$$',
    'Simplify inside the bracket:\n$$= \\left(' + inner + '\\right)^2$$',
    g > 1 ? 'Factor out the common coefficient $' + g + '$:\n$$= ' + ans2Plain + '$$' : 'Answer: $$' + ans2Plain + '$$'
  ];
  return {
    kind: 'multi',
    q: 'Follow-up challenge (same method as Q66)',
    parts: [
      { label: '(a)', q: 'Factorise $x^2 + ' + (2 * a) + 'xy + ' + (a * a) + 'y^2$.', kind: 'text', accept: ['(x+' + a + 'y)^2'], hints: hints1, steps: steps1 },
      { label: '(b)', q: 'Hence, factorise $(m-n)^2 + ' + a + '(m-n)(2m+n) + ' + (a * a) + '(2m+n)^2$.', kind: 'text', accept: [ans2Plain, '(' + inner + ')^2'], hints: hints2, steps: steps2 }
    ],
    src: 'genSubstitution'
  };
}
function genTwoSquares() { // Q67 style
  const a = nz(1, 3), b = nz(1, 3), R = pick(['r', 'z']);
  const A = 'x' + (a === 1 ? '' : '') + (a === 1 ? '' : '') ;
  const Atex = 'x + ' + (a === 1 ? '' : a) + 'y - ' + b + R;
  const AtexClean = 'x' + (a === 1 ? ' + y' : ' + ' + a + 'y') + (b === 1 ? ' - ' + R : ' - ' + b + R);
  const Aonly = 'x' + (a === 1 ? ' + y' : ' + ' + a + 'y');
  const steps1 = ['Apply $(m+n)(m-n) = m^2 - n^2$ directly.'];
  const hints1 = ['This is exactly $(m+n)(m-n)$ — read it carefully.'];
  const steps2 = [
    'Treat $' + Aonly + '$ as one quantity, $M$, and $' + (b === 1 ? R : b + R) + '$ as $N$.',
    'Then the product is $(M+N)(M-N) = M^2 - N^2$.',
    '$M^2 = (' + Aonly + ')^2 = x^2 ' + (2 * a === 2 ? '+ 2xy' : '+ ' + (2 * a) + 'xy') + ' + ' + (a * a) + 'y^2$ and $N^2 = ' + (b * b === 1 ? R : b * b + R) + '^2$.',
    'Answer: $$x^2 + ' + (2 * a) + 'xy + ' + (a * a) + 'y^2 - ' + (b * b === 1 ? '' : b * b) + R + '^2$$'
  ];
  const ans2Plain = 'x^2+' + (2 * a) + 'xy+' + (a * a) + 'y^2-' + (b * b === 1 ? '' : b * b) + R + '^2';
  return {
    kind: 'multi',
    q: 'Follow-up challenge (same method as Q67)',
    parts: [
      { label: '(a)', q: 'Expand $(m+n)(m-n)$.', kind: 'text', accept: ['m^2-n^2'], hints: hints1, steps: steps1 },
      { label: '(b)', q: 'Using (a), expand $(' + AtexClean + ')(' + Aonly.replace(/([+-])/, '$1') + ' + ' + (b === 1 ? R : b + R) + ')$.', kind: 'text', accept: [ans2Plain], hints: ['Let $M = ' + Aonly + '$ and $N = ' + (b === 1 ? R : b + R) + '$ — then this is $(M+N)(M-N)$.', 'Use $M^2 - N^2$.', 'Expand $M^2$ with the perfect-square identity.'], steps: steps2 }
    ],
    src: 'genTwoSquares'
  };
}
function genNumTrick() { // Q69 style
  const n = pick([9, 10, 11, 12, 15, 20]);
  const val = Math.pow(n, 4) - 1;
  const tex = (n * n + 1) + ' \\times ' + (n + 1) + ' \\times ' + (n - 1);
  const steps1 = [
    'First pair the last two brackets with the difference-of-squares identity:\n$$(x+1)(x-1) = x^2 - 1$$',
    'Then apply it again:\n$$(x^2+1)(x^2-1) = (x^2)^2 - 1^2 = x^4 - 1$$'
  ];
  const steps2 = [
    'Match the pattern $(n^2+1)(n+1)(n-1)$ with the result of (a): it equals $n^4 - 1$ with $n = ' + n + '$.',
    '$$' + tex + ' = ' + n + '^4 - 1 = ' + (n * n * n * n) + ' - 1$$'
  ];
  return {
    kind: 'multi',
    q: 'Follow-up challenge (same method as Q69)',
    parts: [
      { label: '(a)', q: 'Expand $(x^2+1)(x+1)(x-1)$.', kind: 'text', accept: ['x^4-1'], hints: ['Multiply $(x+1)(x-1)$ first.', 'You get another difference of squares!'], steps: steps1 },
      { label: '(b)', q: 'Hence, find the value of $' + tex + '$ without a calculator.', kind: 'numeric', answer: val, hints: ['Compare with part (a) with $x = ' + n + '$.', 'It is $' + n + '^4 - 1$. $' + n + '^2 = ' + (n * n) + '$, so $' + n + '^4 = ' + (n * n * n * n) + '$.'], steps: steps2 }
    ],
    src: 'genNumTrick'
  };
}
function genGivenSum() { // Q70 style
  const P = pick([2, 3, 4, 6, 5]);
  const S = 2 * P + pick([50, 52, 56, 62, 70]);
  const V1 = S + 2 * P, V2 = S - 2 * P;
  const area = 8 * V1 * V2;
  return {
    kind: 'multi',
    q: 'Follow-up challenge (same method as Q70)',
    parts: [
      { label: '(a)', q: 'It is given that $x^2 + y^2 = ' + S + '$ and $xy = ' + P + '$. Find the values of $(x+y)^2$ and $(x-y)^2$.', kind: 'constants', vars: ['(x+y)^2', '(x-y)^2'], values: [V1, V2], hints: ['Use $(x \\pm y)^2 = x^2 + y^2 \\pm 2xy$.', 'Substitute $x^2+y^2 = ' + S + '$ and $xy = ' + P + '$.'], steps: ['$(x+y)^2 = x^2 + y^2 + 2xy = ' + S + ' + 2(' + P + ') = ' + V1 + '$', '$(x-y)^2 = x^2 + y^2 - 2xy = ' + S + ' - 2(' + P + ') = ' + V2 + '$'] },
      { label: '(b)(i)', q: 'A square $ABCD$ has side $4x^2$ cm; $E$ on $AD$ and $F$ on $CD$ with $AE = CF = 4y^2$ cm. Show that the area of $\\triangle DEF$ is $8(x+y)^2(x-y)^2\\ \\text{cm}^2$.', kind: 'mcq', options: [{ tex: '8(x+y)^2(x-y)^2\\ \\text{cm}^2', correct: true }, { tex: '8(x+y)^2(x-y)^4\\ \\text{cm}^2', correct: false }, { tex: '4(x+y)^2(x-y)^2\\ \\text{cm}^2', correct: false }, { tex: '8(x^2+y^2)^2\\ \\text{cm}^2', correct: false }], hints: ['$\\triangle DEF$ is right-angled with $DE = DC - CE$. Find $DE$ and $DF$ in terms of $x$ and $y$.', '$DE = DF = 4x^2 - 4y^2 = 4(x^2 - y^2) = 4(x+y)(x-y)$.', 'Area $= \\frac{1}{2} \\times DE \\times DF = \\frac{1}{2}[4(x+y)(x-y)]^2 = 8(x+y)^2(x-y)^2$.'], steps: ['$DE = DF = 4x^2 - 4y^2 = 4(x+y)(x-y)$', 'Area $= \\frac{1}{2} \\times 4(x+y)(x-y) \\times 4(x+y)(x-y) = 8(x+y)^2(x-y)^2\\ \\text{cm}^2$'] },
      { label: '(b)(ii)', q: 'Hence, find the area of $\\triangle DEF$.', kind: 'numeric', answer: area, hints: ['Use your answers: area $= 8(x+y)^2(x-y)^2$.', '$8 \\times ' + V1 + ' \\times ' + V2 + '$'], steps: ['Area $= 8 \\times ' + V1 + ' \\times ' + V2 + ' = ' + area + '\\ \\text{cm}^2$'] }
    ],
    src: 'genGivenSum'
  };
}

/* ============================================================
   12. MCQ GENERATORS
   ============================================================ */
function verifyIdentity2(lhs, rhs) { // numeric spot check
  const pts = [[2, 3], [-1, 4], [3, -2]];
  return pts.every(([x, y]) => Math.abs(lhs.evalAt({ x, y }) - rhs.evalAt({ x, y })) < 1e-9);
}
function genMcqIdentity(notMode = false) {
  // build 4 statements, exactly one is (not) an identity
  const a = nz(2, 5), b = nz(2, 5), p = nz(1, 5), q = nz(1, 5), k = nz(2, 5);
  const cands = [];
  // true identities
  cands.push({ tex: a + '(x + ' + p + ') \\equiv ' + a + 'x + ' + (a * p), poly: Poly.c(a).mul(Poly.v('x').add(Poly.c(p))), disp: Poly.c(a).mul(Poly.v('x')).add(Poly.c(a * p)), isId: true });
  cands.push({ tex: '(x + ' + p + ')(x - ' + p + ') \\equiv x^2 - ' + (p * p), poly: Poly.v('x').add(Poly.c(p)).mul(Poly.v('x').sub(Poly.c(p))), disp: Poly.v('x', 2).sub(Poly.c(p * p)), isId: true });
  cands.push({ tex: k + '(x + ' + p + ') - ' + k + 'x \\equiv ' + (k * p), poly: Poly.c(k).mul(Poly.v('x').add(Poly.c(p))).sub(Poly.c(k).mul(Poly.v('x'))), disp: Poly.c(k * p), isId: true });
  // non-identities
  cands.push({ tex: '(x + ' + p + ')^2 \\equiv x^2 + ' + (p * p), poly: Poly.v('x').add(Poly.c(p)).pow(2), disp: Poly.v('x', 2).add(Poly.c(p * p)), isId: false });
  cands.push({ tex: b + '(x + ' + q + ') \\equiv ' + a + 'x + ' + (b * q), poly: Poly.c(b).mul(Poly.v('x')).add(Poly.c(b * q)), disp: Poly.c(a).mul(Poly.v('x')).add(Poly.c(b * q)), isId: false });
  cands.push({ tex: k + '(x + ' + p + ') \\equiv ' + k + 'x + ' + p, poly: Poly.c(k).mul(Poly.v('x')).add(Poly.c(k * p)), disp: Poly.c(k).mul(Poly.v('x')).add(Poly.c(p)), isId: false });
  cands.push({ tex: '(x + ' + p + ')(x + ' + q + ') \\equiv x^2 + ' + (p * q), poly: Poly.v('x').add(Poly.c(p)).mul(Poly.v('x').add(Poly.c(q))), disp: Poly.v('x', 2).add(Poly.c(p * q)), isId: false });
  const identityCands = cands.filter(c => c.isId === !notMode);
  const otherCands = cands.filter(c => c.isId === notMode);
  const chosen = pick(identityCands);
  const others = shuffle(otherCands).slice(0, 3);
  const opts = shuffle([chosen, ...others]);
  return {
    kind: 'mcq',
    q: (notMode ? 'Which of the following is **NOT** an identity?' : 'Which of the following is an identity?'),
    options: opts.map(o => ({ tex: o.tex, correct: o === chosen })),
    hints: ['An identity is true for **every** value of $x$. Expand each option and compare.', 'Try substituting a couple of values of $x$ to eliminate options quickly — but confirm the survivor by expanding.', 'Check the middle terms carefully after expanding.'],
    steps: opts.map(o => {
      const ok = verifyIdentity2(o.poly, o.disp);
      return '$' + o.tex + '$ — expand the left side: $' + o.poly.toLatex() + '$ vs right side $' + o.disp.toLatex() + '$. This is ' + (ok ? '' : '**not** ') + 'an identity.';
    }),
    src: 'genMcqIdentity'
  };
}
function genMcqConstants() {
  const g = genFindAB();
  const idx = rnd(0, g.values.length - 1);
  const target = g.vars[idx], correct = g.values[idx];
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const d = pick([1, -1, 2, -2, 3, -3]);
    const v = correct + d;
    if (v !== correct) wrongs.add(v);
  }
  return {
    kind: 'mcq',
    q: g.q + '\n\nWhat is the value of $' + target + '$?',
    options: shuffle([{ tex: String(correct), correct: true }, ...[...wrongs].map(w => ({ tex: String(w), correct: false }))]),
    hints: g.hints, steps: [...g.steps, 'So $' + target + ' = ' + correct + '$.'],
    src: 'genMcqConstants'
  };
}
function genMcqExpand() {
  const X = pick(VARS1); const Y = pick(VARS1.filter(v => v !== X));
  if (Math.random() < 0.5) { // perfect square
    const a = nz(2, 5), b = nz(2, 5), s = pick([1, -1]);
    const correct = Poly.c(a).mul(Poly.v(X)).add(Poly.c(s * b).mul(Poly.v(Y))).pow(2);
    const wrongs = [
      correct.sub(Poly.monomial({ [X]: 1, [Y]: 1 }, 2 * a * b * s).add(Poly.monomial({ [X]: 1, [Y]: 1 }, a * b * s))), // 2ab→ab
      correct.sub(Poly.monomial({ [X]: 1, [Y]: 1 }, 2 * a * b * s).add(Poly.monomial({ [X]: 1, [Y]: 1 }, -2 * a * b * s))), // sign flip
      Poly.monomial({ [X]: 2 }, a * a).add(Poly.monomial({ [Y]: 2 }, b * b)) // no middle
    ];
    const qTex = binom2Tex(a, X, s * b, Y) + '^2';
    return mcqFromPoly('Expand $' + qTex + '$', correct, wrongs, ['Use $(A \\pm B)^2 = A^2 \\pm 2AB + B^2$.', 'Here $A = ' + a + X + '$ and $B = ' + b + Y + '$.', 'The middle term is $2AB = ' + (2 * a * b) + X + Y + '$ — check its sign!']);
  }
  // difference of squares with fraction
  const a = nz(1, 4), b = nz(1, 4), n = pick([3, 4, 6]);
  const correct = Poly.c(F(1, n)).mul(Poly.monomial({ [X]: 2 }, a * a).sub(Poly.monomial({ [Y]: 2 }, b * b)));
  const wrongs = [
    Poly.c(F(1, n * n)).mul(Poly.monomial({ [X]: 2 }, a * a).sub(Poly.monomial({ [Y]: 2 }, b * b))),
    Poly.c(F(1, n)).mul(Poly.monomial({ [X]: 2 }, a * a).add(Poly.monomial({ [Y]: 2 }, b * b))),
    Poly.c(F(1, n)).mul(Poly.monomial({ [X]: 2 }, a * a).sub(Poly.monomial({ [X]: 1, [Y]: 1 }, b * b)).sub(Poly.monomial({ [Y]: 2 }, b * b)))
  ];
  const qTex = binom2Tex(a, X, b, Y) + binom2Tex(a, X, -b, Y);
  return mcqFromPoly('Expand $' + qTex + ' \\div ' + n + '$', correct, wrongs, ['First ignore the $\\div ' + n + '$: it is $(A+B)(A-B) = A^2 - B^2$.', '$A^2 - B^2 = ' + (a * a) + X + '^2 - ' + (b * b) + Y + '^2$. Then divide every term by $' + n + '$.', 'Watch the denominators — each term is divided by $' + n + '$.']);
}
function mcqFromPoly(qText, correct, wrongs, hints) {
  return {
    kind: 'mcq', q: qText,
    options: shuffle([{ tex: correct.toLatex(), correct: true }, ...wrongs.map(w => ({ tex: w.toLatex(), correct: false }))]),
    hints, steps: ['Expand carefully using the identity.', 'The correct expansion is $$' + correct.toLatex() + '$$'],
    src: 'genMcqExpand'
  };
}
function genMcqFactor() {
  const style = pick(['diffsq', 'grouping', 'perfsq', 'binsq']);
  const X = pick(VARS1), Y = pick(VARS1.filter(v => v !== X));
  if (style === 'diffsq') {
    const a = nz(2, 6), b = nz(2, 6);
    const correct = '(' + a + X + ' + ' + b + Y + ')(' + a + X + ' - ' + b + Y + ')';
    const wrongs = ['(' + a + X + ' - ' + b + Y + ')(' + a + X + ' - ' + b + Y + ')', '(' + a + X + ' + ' + b + Y + ')(' + a + X + ' + ' + b + Y + ')', '(' + a + 'X - ' + b + Y + ')('.replace('X', X) + (a + 1) + X + ' + ' + b + Y + ')'];
    const q = Poly.monomial({ [X]: 2 }, a * a).sub(Poly.monomial({ [Y]: 2 }, b * b));
    return mcqFromTex('Factorise $' + q.toLatex() + '$.', correct, wrongs, ['Both terms are perfect squares: $A^2 - B^2$.', '$A = ' + a + X + '$, $B = ' + b + Y + '$.', '$A^2 - B^2 = (A+B)(A-B)$ — check the signs in each option.']);
  }
  if (style === 'perfsq') {
    const a = nz(2, 5), b = nz(2, 5);
    const correct = '(' + a + X + ' + ' + b + Y + ')^2';
    const wrongs = ['(' + a + X + ' - ' + b + Y + ')^2', '(' + (a * a) + X + ' + ' + (b * b) + Y + ')^2', '(' + a + X + ' + ' + b + 'Y)('.replace('Y)', Y + ')') + a + X + ' - ' + b + Y + ')'];
    const q = Poly.c(a).mul(Poly.v(X)).add(Poly.c(b).mul(Poly.v(Y))).pow(2);
    return mcqFromTex('Factorise $' + q.toLatex() + '$.', correct, wrongs, ['Check the middle term: it is $+2AB$, so both brackets have the **same** sign.', 'Here $A = ' + a + X + '$ and $B = ' + b + Y + '$.', 'It is $(A + B)^2$.']);
  }
  if (style === 'grouping') {
    const g = genFactorGrouping();
    const A = g.ansTex.split(')(');
    const correct = g.ansTex;
    const f1 = A[0] + ')', f2 = '(' + A[1];
    const wrongs = [f1.replace(/(\+|-)/, m => m === '+' ? '-' : '+') + f2, f1 + f2.replace(/(?<=\()(\+|-)/, m => m === '+' ? '-' : '+'), f1.replace(/(\+|-)/g, m => m === '+' ? '-' : '+') + f2.replace(/(?<=\()(\+|-)/, m => m === '+' ? '-' : '+')];
    return mcqFromTex(g.q.replace(/\n\$\$/, ' $').replace('$$', '$'), correct, wrongs, g.hints);
  }
  // binsq: (A)² − c² with linear A
  const a = nz(2, 4), b = nz(1, 4), c = nz(2, 6);
  const lin = a + X + (b < 0 ? ' - ' + (-b) : ' + ' + b);
  const correct = '(' + lin + ' + ' + c + ')(' + lin + ' - ' + c + ')';
  const wrongs = ['(' + lin + ' + ' + c + ')(' + lin + ' + ' + c + ')', '(' + lin + ' - ' + c + ')(' + lin + ' - ' + c + ')', '(' + lin + ' + ' + c + ')(-' + lin + ' + ' + c + ')'];
  const q = Poly.c(a).mul(Poly.v(X)).add(Poly.c(b)).pow(2).sub(Poly.c(c * c));
  return mcqFromTex('Factorise $' + q.toLatex() + '$.', correct, wrongs, ['This is $A^2 - B^2$ with $A = ' + lin + '$ and $B = ' + c + '$.', 'Use $(A+B)(A-B)$ — the two brackets differ only in the middle sign.', 'Check: expanding option D gives $B^2 - A^2$, not $A^2 - B^2$.']);
}
function mcqFromTex(qText, correct, wrongs, hints) {
  return {
    kind: 'mcq', q: qText,
    options: shuffle([{ tex: correct, correct: true }, ...wrongs.map(w => ({ tex: w, correct: false }))]),
    hints, steps: ['Work through the method.', 'The answer is $$' + correct + '$$'],
    src: 'genMcqFactor'
  };
}
function genMcqHasFactor() {
  const r = nz(2, 5);
  const design = pick(['IIonly', 'IIandIII']);
  const I = nz(2, 5) + 'x + ' + (nz(2, 5) * r);
  const II = 'x^2 - ' + (r * r);
  const III = design === 'IIandIII' ? (nz(2, 4)) + '(x - ' + r + ')^2' : (nz(2, 4)) + '(x - ' + (r + 1) + ')^2';
  const correctAns = design === 'IIonly' ? 'II only' : 'II and III only';
  const opts = shuffle(['I only', 'II only', 'I and III only', 'II and III only']);
  return {
    kind: 'mcq',
    q: 'Which of the following expressions has/have a factor $x - ' + r + '$?\n\nI. $' + I + '$\n\nII. $' + II + '$\n\nIII. $' + III + '$',
    options: opts.map(o => ({ tex: o, correct: o === correctAns })),
    hints: ['A polynomial has factor $(x - ' + r + ')$ exactly when it equals $0$ at $x = ' + r + '$.', 'Substitute $x = ' + r + '$ into each expression.', 'II: $' + r + '^2 - ' + (r * r) + ' = 0$ ✓. Check I and III the same way.'],
    steps: [
      'Substitute $x = ' + r + '$ (the root of $x - ' + r + '$) into each expression:',
      'I: $' + I.replace(/\s\+\s/g, ' + ') + ' $ at $x=' + r + '$ gives $' + (nz(2, 5) * r + 2 * nz(2, 5)) + '\\neq 0$ — not a factor.',
      'II: $' + II + '$ at $x = ' + r + '$ gives $0$ — factor ✓. III: $' + III + '$ at $x = ' + r + '$ gives ' + (design === 'IIandIII' ? '$0$ — factor ✓.' : '$' + (nz(2, 4)) + '\\neq 0$ — not a factor.'),
      'Answer: ' + correctAns + '.'
    ],
    src: 'genMcqHasFactor'
  };
}
function genMcqFactorOf() {
  const m = pick(['m', 'p', 'k']), n = pick(['n', 'q', 't']);
  const k = nz(1, 5);
  const correct = m + ' + ' + n;
  const wrongs = [m + ' - ' + n, k + ' + ' + m + ' + ' + n, k + ' - ' + m + ' + ' + n];
  const opts = shuffle([{ tex: correct, correct: true }, ...wrongs.map(w => ({ tex: w, correct: false }))]);
  return {
    kind: 'mcq',
    q: 'Which of the following is a factor of $' + k + '(' + m + ' + ' + n + ') - ' + n + '^2 + ' + m + '^2$?',
    options: opts,
    hints: ['Group $' + m + '^2 - ' + n + '^2$ as a difference of squares.', '$' + k + '(' + m + ' + ' + n + ') + (' + m + ' + ' + n + ')(' + m + ' - ' + n + ')$', 'Factor out the common bracket $(' + m + ' + ' + n + ')$.'],
    steps: [
      'Rearrange: $' + k + '(' + m + ' + ' + n + ') + (' + m + '^2 - ' + n + '^2)$',
      'Difference of squares: $= ' + k + '(' + m + ' + ' + n + ') + (' + m + ' + ' + n + ')(' + m + ' - ' + n + ')$',
      'Common factor $(' + m + ' + ' + n + ')$: $= (' + m + ' + ' + n + ')(' + k + ' + ' + m + ' - ' + n + ')$',
      'So $(' + m + ' + ' + n + ')$ is a factor.'
    ],
    src: 'genMcqFactorOf'
  };
}
