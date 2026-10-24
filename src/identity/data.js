/* ============================================================
   data.js — question bank (Additional Revision Exercise 2:
   Identities and Factorization, Junior Secondary Maths in Action)
   kinds: identity | constants | text | numeric | mcq | multi
   Each question: q (with $…$ math), answer info, hints, steps, gen
   ============================================================ */

const SKILLS = {
  id1: 'Recognising identities',
  id2: 'Finding unknown constants',
  ex1: 'Expanding — difference of squares',
  ex2: 'Expanding — perfect squares',
  fa1: 'Factorising — common factors',
  fa2: 'Factorising — grouping',
  fa3: 'Factorising — difference of squares',
  fa4: 'Factorising — perfect squares',
  ch1: 'Challenge problems'
};

const BANK = {};
function Q(id, obj) { obj.id = id; BANK[id] = obj; }

/* ---------------- LEVEL 1 ---------------- */
Q('q1', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'yes',
  q: 'Determine whether this equation is an identity:\n$$8(x+3) = 4(2x+6)$$',
  hints: ['An identity is true for **every** value of $x$.', 'Expand both sides separately and compare.'],
  steps: ['LHS $= 8(x+3) = 8x + 24$', 'RHS $= 4(2x+6) = 8x + 24$', '$\\because$ LHS $=$ RHS for all values of $x$, it **is an identity**.'],
  gen: genIdentity
});
Q('q2', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'yes',
  q: 'Determine whether this equation is an identity:\n$$3(7x+1) - 5(4x-1) = x+8$$',
  hints: ['Expand carefully — watch the sign in front of $5(4x-1)$.', '$-5 \\times -1 = +5$.'],
  steps: ['LHS $= 3(7x+1) - 5(4x-1) = 21x + 3 - 20x + 5 = x + 8$', 'RHS $= x + 8$', '$\\because$ LHS $=$ RHS for all $x$, it **is an identity**.'],
  gen: genIdentity
});
Q('q3', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'no',
  q: 'Determine whether this equation is an identity:\n$$2(3-5x) - 5x = -5(3x-1)$$',
  hints: ['Expand both sides fully before judging.', 'Compare the constant terms at the end.'],
  steps: ['LHS $= 2(3-5x) - 5x = 6 - 10x - 5x = 6 - 15x$', 'RHS $= -5(3x-1) = -15x + 5$', '$\\because$ LHS $\\neq$ RHS ($6 \\neq 5$), it is **not an identity**.'],
  gen: genIdentity
});
Q('q4', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'yes',
  q: 'Determine whether this equation is an identity:\n$$(3x-2)^2 = (2-3x)^2$$',
  hints: ['What happens to a square when both signs inside flip?', '$(2-3x) = -(3x-2)$, and $(-1)^2 = 1$.'],
  steps: ['LHS $= (3x-2)^2 = 9x^2 - 12x + 4$', 'RHS $= (2-3x)^2 = 9x^2 - 12x + 4$', '$\\because$ LHS $=$ RHS for all $x$, it **is an identity**.'],
  gen: genIdentity
});
Q('q5', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'no',
  q: 'Determine whether this equation is an identity:\n$$3(x+y)(x-y) = 3x^2 + 3y^2$$',
  hints: ['Expand the left side first — which identity gives $(x+y)(x-y)$?', 'Check the **sign** of the $y^2$ term.'],
  steps: ['LHS $= 3(x+y)(x-y) = 3(x^2 - y^2) = 3x^2 - 3y^2$', 'RHS $= 3x^2 + 3y^2$', '$\\because$ LHS $\\neq$ RHS, it is **not an identity**.'],
  gen: genIdentity
});
Q('q6', {
  level: 1, skill: 'id1', kind: 'identity', answer: 'no',
  q: 'Determine whether this equation is an identity:\n$$(x+8y)(3x+5y) = 3x^2 + 30xy + 40y^2$$',
  hints: ['Expand the product using FOIL.', 'Add the two middle contributions to get the $xy$ coefficient.'],
  steps: ['LHS $= 3x^2 + 5xy + 24xy + 40y^2 = 3x^2 + 29xy + 40y^2$', 'RHS $= 3x^2 + 30xy + 40y^2$', '$\\because$ $29 \\neq 30$, it is **not an identity**.'],
  gen: genIdentity
});

Q('q7', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [-4, -10],
  q: 'Find the constants $A$ and $B$:\n$$3(Ax-3) \\equiv -12x + B + 1$$',
  hints: ['Expand the left side: $3Ax - 9$.', 'Compare the $x$ coefficients to get $A$, then the constants to get $B$.'],
  steps: ['LHS $= 3Ax - 9 = -12x + (B+1)$', 'Compare $x$: $3A = -12 \\Rightarrow A = -4$', 'Compare constants: $B + 1 = -9 \\Rightarrow B = -10$'],
  gen: genFindAB
});
Q('q8', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [9, 2],
  q: 'Find the constants $A$ and $B$:\n$$(3x-2)^2 + 8x \\equiv Ax^2 - 4x + 2B$$',
  hints: ['Expand $(3x-2)^2$ first.', 'Combine the $x$ terms before comparing.'],
  steps: ['$(3x-2)^2 = 9x^2 - 12x + 4$', 'LHS $= 9x^2 - 12x + 4 + 8x = 9x^2 - 4x + 4$', 'Compare: $A = 9$, and $2B = 4 \\Rightarrow B = 2$'],
  gen: genFindAB
});
Q('q9', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [1, 24],
  q: 'Find the constants $A$ and $B$:\n$$4Ax(x+1) - Bx \\equiv -20x + 4x^2$$',
  hints: ['Expand $4Ax(x+1) = 4Ax^2 + 4Ax$.', 'Compare $x^2$ first to find $A$, then use the $x$ terms for $B$.'],
  steps: ['LHS $= 4Ax^2 + 4Ax - Bx = 4Ax^2 + (4A-B)x$', 'Compare $x^2$: $4A = 4 \\Rightarrow A = 1$', 'Compare $x$: $4A - B = -20 \\Rightarrow 4 - B = -20 \\Rightarrow B = 24$'],
  gen: genFindAB
});
Q('q10', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [3, -14],
  q: 'Find the constants $A$ and $B$:\n$$(Ax+4)(x-6) \\equiv 3x^2 + Bx - 24$$',
  hints: ['Expand the left side with FOIL.', 'The $x^2$ coefficient gives $A$ immediately.'],
  steps: ['LHS $= Ax^2 - 6Ax + 4x - 24 = Ax^2 + (4-6A)x - 24$', 'Compare $x^2$: $A = 3$', 'Compare $x$: $B = 4 - 6(3) = -14$'],
  gen: genFindAB
});
Q('q11', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [3, -5],
  q: 'Find the constants $A$ and $B$:\n$$(3x+B)(Ax+5) \\equiv 9x^2 - 25$$',
  hints: ['Expand: $3Ax^2 + (15 + AB)x + 5B$.', 'There is **no** $x$ term on the right — so the $x$ coefficient must be $0$.'],
  steps: ['LHS $= 3Ax^2 + (15+AB)x + 5B$', 'Compare $x^2$: $3A = 9 \\Rightarrow A = 3$', 'Compare constants: $5B = -25 \\Rightarrow B = -5$', 'Check $x$: $15 + AB = 15 - 15 = 0$ ✓'],
  gen: genFindAB
});
Q('q12', {
  level: 1, skill: 'id2', kind: 'constants', vars: ['A', 'B'], values: [2, -9],
  q: 'Find the constants $A$ and $B$:\n$$(2x-1)^2 + 2Ax - 10 \\equiv 4x^2 + B$$',
  hints: ['Expand $(2x-1)^2 = 4x^2 - 4x + 1$.', 'The right side has no $x$ term — the $x$ terms on the left must cancel.'],
  steps: ['LHS $= 4x^2 - 4x + 1 + 2Ax - 10 = 4x^2 + (2A-4)x - 9$', 'Compare $x$: $2A - 4 = 0 \\Rightarrow A = 2$', 'Compare constants: $B = -9$'],
  gen: genFindAB
});

Q('q13', {
  level: 1, skill: 'ex1', kind: 'text', accept: ['25u^2-16'], ansTex: '25u^2 - 16',
  q: 'Expand:\n$$(5u+4)(5u-4)$$',
  hints: ['Same terms, opposite signs → $(A+B)(A-B)$.', '$A = 5u$, $B = 4$: the answer is $A^2 - B^2$.'],
  steps: ['$(5u+4)(5u-4) = (5u)^2 - 4^2$', '$= 25u^2 - 16$'],
  gen: genExpandDiffSq
});
Q('q14', {
  level: 1, skill: 'ex1', kind: 'text', accept: ['x^2-9y^2'], ansTex: 'x^2 - 9y^2',
  q: 'Expand:\n$$(x-3y)(x+3y)$$',
  hints: ['Difference of squares pattern.', '$B = 3y$, so $B^2 = 9y^2$.'],
  steps: ['$(x-3y)(x+3y) = x^2 - (3y)^2$', '$= x^2 - 9y^2$'],
  gen: genExpandDiffSq
});
Q('q15', {
  level: 1, skill: 'ex1', kind: 'text', accept: ['20f^2-5'], ansTex: '20f^2 - 5',
  q: 'Expand:\n$$5(2f+1)(2f-1)$$',
  hints: ['Expand the brackets first, then multiply by $5$.', '$(2f)^2 - 1^2 = 4f^2 - 1$.'],
  steps: ['$5(2f+1)(2f-1) = 5\\left[(2f)^2 - 1^2\\right]$', '$= 5(4f^2 - 1) = 20f^2 - 5$'],
  gen: genExpandDiffSq
});
Q('q16', {
  level: 1, skill: 'ex1', kind: 'text', accept: ['16/3a^2-3b^2', '(16/3)a^2-3b^2', '16a^2/3-3b^2'], ansTex: '\\dfrac{16}{3}a^2 - 3b^2',
  q: 'Expand:\n$$\\frac{1}{3}(4a+3b)(4a-3b)$$',
  hints: ['Expand $(4a+3b)(4a-3b)$ first.', 'Then multiply every term by $\\frac{1}{3}$.'],
  steps: ['$\\frac{1}{3}(4a+3b)(4a-3b) = \\frac{1}{3}\\left[(4a)^2 - (3b)^2\\right]$', '$= \\frac{1}{3}(16a^2 - 9b^2) = \\dfrac{16}{3}a^2 - 3b^2$'],
  gen: genExpandDiffSq
});
Q('q17', {
  level: 1, skill: 'ex2', kind: 'text', accept: ['16x^2+24x+9'], ansTex: '16x^2 + 24x + 9',
  q: 'Expand:\n$$(4x+3)^2$$',
  hints: ['Use $(A+B)^2 = A^2 + 2AB + B^2$.', '$A = 4x$, $B = 3$; $2AB = 24x$.'],
  steps: ['$(4x+3)^2 = (4x)^2 + 2(4x)(3) + 3^2$', '$= 16x^2 + 24x + 9$'],
  gen: genExpandSq
});
Q('q18', {
  level: 1, skill: 'ex2', kind: 'text', accept: ['9p^2-30pq+25q^2'], ansTex: '9p^2 - 30pq + 25q^2',
  q: 'Expand:\n$$(3p-5q)^2$$',
  hints: ['Use $(A-B)^2 = A^2 - 2AB + B^2$.', '$2AB = 2(3p)(5q) = 30pq$, with a minus sign.'],
  steps: ['$(3p-5q)^2 = (3p)^2 - 2(3p)(5q) + (5q)^2$', '$= 9p^2 - 30pq + 25q^2$'],
  gen: genExpandSq
});
Q('q19', {
  level: 1, skill: 'ex2', kind: 'text', accept: ['25y^2-60y+36'], ansTex: '25y^2 - 60y + 36',
  q: 'Expand:\n$$(-5y+6)^2$$',
  hints: ['$(-5y+6)^2 = (5y-6)^2$ — flipping both signs changes nothing.', 'Then use $(A-B)^2$.'],
  steps: ['$(-5y+6)^2 = (-5y)^2 + 2(-5y)(6) + 6^2$', '$= 25y^2 - 60y + 36$'],
  gen: genExpandSq
});
Q('q20', {
  level: 1, skill: 'ex2', kind: 'text', accept: ['64h^2+48hk+9k^2'], ansTex: '64h^2 + 48hk + 9k^2',
  q: 'Expand:\n$$(-8h-3k)^2$$',
  hints: ['Both signs are negative — the middle term becomes positive.', '$(-8h)^2 = 64h^2$, $(-3k)^2 = 9k^2$.'],
  steps: ['$(-8h-3k)^2 = (-8h)^2 + 2(-8h)(-3k) + (-3k)^2$', '$= 64h^2 + 48hk + 9k^2$'],
  gen: genExpandSq
});

Q('q21', {
  level: 1, skill: 'fa1', kind: 'text', accept: ['-4b(5a+2c)', '4b(-5a-2c)'], ansTex: '-4b(5a+2c)',
  q: 'Factorise:\n$$-20ab - 8bc$$',
  hints: ['Find the biggest number dividing both coefficients, and the letter common to both terms.', 'HCF of $20$ and $8$ is $4$; both terms contain $b$.'],
  steps: ['$-20ab - 8bc = -4b(5a) - 4b(2c)$', '$= -4b(5a + 2c)$'],
  gen: genFactorCommon
});
Q('q22', {
  level: 1, skill: 'fa1', kind: 'text', accept: ['-2y^2(7x-2)', '2y^2(2-7x)'], ansTex: '-2y^2(7x-2)',
  q: 'Factorise:\n$$-14xy^2 + 4y^2$$',
  hints: ['Both terms contain $y^2$; the HCF of $14$ and $4$ is $2$.', 'Taking out $-2y^2$ keeps the leading sign neat.'],
  steps: ['$-14xy^2 + 4y^2 = -2y^2(7x) + -2y^2(-2)$', '$= -2y^2(7x - 2)$  (equivalently $2y^2(2 - 7x)$)'],
  gen: genFactorCommon
});
Q('q23', {
  level: 1, skill: 'fa1', kind: 'text', accept: ['(y+4)(x+2)', '(x+2)(y+4)'], ansTex: '(y+4)(x+2)',
  q: 'Factorise:\n$$x(y+4) + 2(y+4)$$',
  hints: ['A whole bracket appears in both terms — treat it as one quantity.', 'Factor out $(y+4)$.'],
  steps: ['Both terms contain $(y+4)$.', '$= (y+4)(x+2)$'],
  gen: genFactorBinom
});
Q('q24', {
  level: 1, skill: 'fa1', kind: 'text', accept: ['-(h-k)^2', '-(k-h)^2'], ansTex: '-(h-k)^2',
  q: 'Factorise:\n$$h(k-h) + k(h-k)$$',
  hints: ['$h - k = -(k-h)$ — rewrite the second bracket so both match.', 'Then take out the common bracket $(k-h)$.'],
  steps: ['$h(k-h) + k(h-k) = h(k-h) - k(k-h)$', '$= (k-h)(h-k)$', '$= -(h-k)^2$'],
  gen: genFactorBinom
});
Q('q25', {
  level: 1, skill: 'fa2', kind: 'text', accept: ['(p+q)(s-t)', '(s-t)(p+q)'], ansTex: '(p+q)(s-t)',
  q: 'Factorise:\n$$sp + sq - tp - tq$$',
  hints: ['Group in pairs: $(sp + sq) - (tp + tq)$.', 'Factor each pair, then take out the common bracket.'],
  steps: ['Group: $(sp + sq) - (tp + tq)$', '$= s(p+q) - t(p+q)$', '$= (p+q)(s-t)$'],
  gen: genFactorGrouping
});
Q('q26', {
  level: 1, skill: 'fa2', kind: 'text', accept: ['(r-s)(2s+t)', '(2s+t)(r-s)'], ansTex: '(r-s)(2s+t)',
  q: 'Factorise:\n$$2rs - 2s^2 + rt - st$$',
  hints: ['Group: $(2rs - 2s^2) + (rt - st)$.', 'First pair: $2s(r-s)$; second pair: $t(r-s)$.'],
  steps: ['Group: $(2rs - 2s^2) + (rt - st)$', '$= 2s(r-s) + t(r-s)$', '$= (r-s)(2s+t)$'],
  gen: genFactorGrouping
});
Q('q27', {
  level: 1, skill: 'fa2', kind: 'text', accept: ['(2y+z)(3x-5z)', '(3x-5z)(2y+z)'], ansTex: '(2y+z)(3x-5z)',
  q: 'Factorise:\n$$6xy + 3xz - 10yz - 5z^2$$',
  hints: ['Group the 1st & 2nd terms together, and the 3rd & 4th together.', '$3x(2y+z) - 5z(2y+z)$.'],
  steps: ['Group: $(6xy + 3xz) - (10yz + 5z^2)$', '$= 3x(2y+z) - 5z(2y+z)$', '$= (2y+z)(3x-5z)$'],
  gen: genFactorGrouping
});
Q('q28', {
  level: 1, skill: 'fa2', kind: 'text', accept: ['(z-s)(3y+rx)', '(3y+rx)(z-s)'], ansTex: '(z-s)(3y+rx)',
  q: 'Factorise:\n$$3yz - rxz - 3ys + rxz$$'.replace('rxz - 3ys + rxz', 'rxs - 3ys + rxz'),
  hints: ['Group terms sharing $z$, and terms sharing $s$.', '$(3yz - rxs) - (3ys - rxz)$ → factor each pair.'],
  steps: ['Rewrite: $3yz - 3ys + rxz - rxs$', '$= 3y(z-s) + rx(z-s)$', '$= (z-s)(3y + rx)$'],
  gen: genFactorGrouping
});
Q('q29', {
  level: 1, skill: 'fa3', kind: 'text', accept: ['(3m+1)(3m-1)', '(3m-1)(3m+1)'], ansTex: '(3m+1)(3m-1)',
  q: 'Factorise:\n$$9m^2 - 1$$',
  hints: ['$9m^2 = (3m)^2$ and $1 = 1^2$.', 'Use $A^2 - B^2 = (A+B)(A-B)$.'],
  steps: ['$9m^2 - 1 = (3m)^2 - 1^2$', '$= (3m+1)(3m-1)$'],
  gen: genFactorDiffSq
});
Q('q30', {
  level: 1, skill: 'fa3', kind: 'text', accept: ['(7a+8b)(7a-8b)', '(7a-8b)(7a+8b)'], ansTex: '(7a+8b)(7a-8b)',
  q: 'Factorise:\n$$49a^2 - 64b^2$$',
  hints: ['$49a^2 = (7a)^2$, $64b^2 = (8b)^2$.', 'Apply the difference of squares identity.'],
  steps: ['$49a^2 - 64b^2 = (7a)^2 - (8b)^2$', '$= (7a+8b)(7a-8b)$'],
  gen: genFactorDiffSq
});
Q('q31', {
  level: 1, skill: 'fa3', kind: 'text', accept: ['(5t+4s)(5t-4s)', '(5t-4s)(5t+4s)'], ansTex: '(5t+4s)(5t-4s)',
  q: 'Factorise:\n$$-16s^2 + 25t^2$$',
  hints: ['Flip the order so the positive term comes first: $25t^2 - 16s^2$.', '$25t^2 = (5t)^2$, $16s^2 = (4s)^2$.'],
  steps: ['$-16s^2 + 25t^2 = 25t^2 - 16s^2$', '$= (5t)^2 - (4s)^2$', '$= (5t+4s)(5t-4s)$'],
  gen: genFactorDiffSq
});
Q('q32', {
  level: 1, skill: 'fa3', kind: 'text', accept: ['2(7x+2)(7x-2)', '2(7x-2)(7x+2)'], ansTex: '2(7x+2)(7x-2)',
  q: 'Factorise:\n$$-8 + 98x^2$$',
  hints: ['Take out the common factor $2$ first.', 'Then you get $2(49x^2 - 4)$ — a difference of squares.'],
  steps: ['$-8 + 98x^2 = 2(49x^2 - 4)$', '$= 2\\left[(7x)^2 - 2^2\\right]$', '$= 2(7x+2)(7x-2)$'],
  gen: genFactorDiffSq
});
Q('q33', {
  level: 1, skill: 'fa4', kind: 'text', accept: ['(2x+1)^2', '(2x+1)(2x+1)'], ansTex: '(2x+1)^2',
  q: 'Factorise:\n$$4x^2 + 4x + 1$$',
  hints: ['First term $(2x)^2$, last term $1^2$ — check the middle: $2(2x)(1) = 4x$ ✓.', 'Perfect square!'],
  steps: ['$4x^2 + 4x + 1 = (2x)^2 + 2(2x)(1) + 1^2$', '$= (2x+1)^2$'],
  gen: genFactorPerfectSq
});
Q('q34', {
  level: 1, skill: 'fa4', kind: 'text', accept: ['-(h-10)^2', '-(10-h)^2'], ansTex: '-(h-10)^2',
  q: 'Factorise:\n$$-100 - h^2 + 20h$$',
  hints: ['Take out $-1$ first and reorder: $-(h^2 - 20h + 100)$.', 'Now the bracket is a perfect square.'],
  steps: ['$-100 - h^2 + 20h = -(h^2 - 20h + 100)$', '$h^2 - 20h + 100 = (h-10)^2$', '$= -(h-10)^2$'],
  gen: genFactorPerfectSq
});
Q('q35', {
  level: 1, skill: 'fa4', kind: 'text', accept: ['(7x-3y)^2', '(7x-3y)(7x-3y)'], ansTex: '(7x-3y)^2',
  q: 'Factorise:\n$$49x^2 - 42xy + 9y^2$$',
  hints: ['$49x^2 = (7x)^2$, $9y^2 = (3y)^2$.', 'Check the middle: $2(7x)(3y) = 42xy$ ✓ with a minus sign.'],
  steps: ['$49x^2 - 42xy + 9y^2 = (7x)^2 - 2(7x)(3y) + (3y)^2$', '$= (7x-3y)^2$'],
  gen: genFactorPerfectSq
});
Q('q36', {
  level: 1, skill: 'fa4', kind: 'text', accept: ['(5m+6n)^2', '(5m+6n)(5m+6n)'], ansTex: '(5m+6n)^2',
  q: 'Factorise:\n$$60mn + 25m^2 + 36n^2$$',
  hints: ['Reorder: $25m^2 + 60mn + 36n^2$.', '$25m^2 = (5m)^2$, $36n^2 = (6n)^2$, and $2(5m)(6n) = 60mn$ ✓.'],
  steps: ['$60mn + 25m^2 + 36n^2 = (5m)^2 + 2(5m)(6n) + (6n)^2$', '$= (5m+6n)^2$'],
  gen: genFactorPerfectSq
});

/* ---------------- LEVEL 2 ---------------- */
Q('q37', {
  level: 2, skill: 'id1', kind: 'identity', answer: 'no',
  q: 'Determine whether this equation is an identity:\n$$(2x+5y)^2 - 4y(x+4y) = (2x+3y)^2 - 4xy$$',
  hints: ['Expand each side completely — there are $y^2$ and $xy$ terms on both.', 'Compare all three types of term: $x^2$, $xy$, $y^2$.'],
  steps: ['LHS $= 4x^2 + 20xy + 25y^2 - 4xy - 16y^2 = 4x^2 + 16xy + 9y^2$', 'RHS $= 4x^2 + 12xy + 9y^2 - 4xy = 4x^2 + 8xy + 9y^2$', '$\\because$ $16 \\neq 8$, it is **not an identity**.'],
  gen: genIdentity
});
Q('q38', {
  level: 2, skill: 'id1', kind: 'identity', answer: 'yes',
  q: 'Determine whether this equation is an identity:\n$$(x+4y)^2 - (4x+y)^2 = -15(x-y)(x+y)$$',
  hints: ['Use $A^2 - B^2 = (A+B)(A-B)$ instead of expanding both squares.', '$(A+B) = 5x+5y$ and $(A-B) = -3x+3y$.'],
  steps: ['LHS $= [(x+4y)+(4x+y)][(x+4y)-(4x+y)]$', '$= (5x+5y)(-3x+3y) = -15(x+y)(x-y)$', 'RHS $= -15(x-y)(x+y)$  ✓', '$\\because$ LHS $=$ RHS for all $x, y$, it **is an identity**.'],
  gen: genIdentity
});
Q('q39', {
  level: 2, skill: 'id2', kind: 'constants', vars: ['A', 'B', 'C'], values: [4, 1, -4],
  q: 'Find the constants $A$, $B$ and $C$:\n$$(Ax-4)(x^2+Bx+1) \\equiv 4x^3 + C$$',
  hints: ['Expand fully — you will get $x^3$, $x^2$, $x$ and constant terms.', 'There is no $x^2$ or $x$ term on the right: both of those coefficients must be $0$.'],
  steps: ['LHS $= Ax^3 - 4x^2 + ABx^2 - 4Bx + Ax - 4$', '$= Ax^3 + (-4+AB)x^2 + (A-4B)x - 4$', 'Compare $x^3$: $A = 4$', 'Compare $x^2$: $-4 + AB = 0 \\Rightarrow B = 1$', 'Compare constant: $C = -4$'],
  gen: genFindABC
});
Q('q40', {
  level: 2, skill: 'id2', kind: 'constants', vars: ['A', 'B', 'C'], values: [-3, 9, 2],
  q: 'Find the constants $A$, $B$ and $C$:\n$$Ax(x+1) + B(x^2-1) - C(x-1) \\equiv 6x^2 - 5x - 7$$',
  hints: ['Substitution trick: put $x = 1$, then $x = -1$, then $x = 0$.', 'At $x = 1$ the last two brackets vanish; at $x = -1$ the first and last vanish.'],
  steps: ['Put $x = 1$: $A(1)(2) = 6 - 5 - 7 = -6 \\Rightarrow A = -3$', 'Put $x = -1$: $-3(-1)(0) + B(0) - C(-2) = 6 + 5 - 7 = 4 \\Rightarrow 2C = 4 \\Rightarrow C = 2$', 'Put $x = 0$: $0 + B(-1) - 2(-1) = -7 \\Rightarrow -B + 2 = -7 \\Rightarrow B = 9$'],
  gen: genFindABC
});
Q('q41', {
  level: 2, skill: 'id2', kind: 'constants', vars: ['A', 'B', 'C'], values: [4, -2, -10],
  q: 'Find the constants $A$, $B$ and $C$:\n$$(Ax-B)(2x-5) \\equiv 8(x^2 - 2x) + C$$',
  hints: ['First simplify the right side: $8x^2 - 16x + C$.', 'Expand the left side and compare coefficients.'],
  steps: ['RHS $= 8x^2 - 16x + C$', 'LHS $= 2Ax^2 - 5Ax - 2Bx + 5B = 2Ax^2 + (-5A-2B)x + 5B$', 'Compare $x^2$: $2A = 8 \\Rightarrow A = 4$', 'Compare $x$: $-20 - 2B = -16 \\Rightarrow B = -2$', 'Compare constant: $C = 5B = -10$'],
  gen: genFindABC
});
Q('q42', {
  level: 2, skill: 'ex1', kind: 'text', accept: ['25x^4-1'], ansTex: '25x^4 - 1',
  q: 'Expand:\n$$(5x^2-1)(1+5x^2)$$',
  hints: ['Rewrite as $(5x^2-1)(5x^2+1)$.', 'Difference of squares with $A = 5x^2$, $B = 1$.'],
  steps: ['$(5x^2-1)(1+5x^2) = (5x^2-1)(5x^2+1)$', '$= (5x^2)^2 - 1 = 25x^4 - 1$'],
  gen: genExpandDiffSq
});
Q('q43', {
  level: 2, skill: 'ex1', kind: 'text', accept: ['4u^2-36v^4'], ansTex: '4u^2 - 36v^4',
  q: 'Expand:\n$$(6v^2+2u)(-6v^2+2u)$$',
  hints: ['Rewrite the second bracket as $(2u - 6v^2)$ and the first as $(2u + 6v^2)$.', '$(2u)^2 - (6v^2)^2$.'],
  steps: ['$(6v^2+2u)(-6v^2+2u) = (2u+6v^2)(2u-6v^2)$', '$= (2u)^2 - (6v^2)^2$', '$= 4u^2 - 36v^4$'],
  gen: genExpandDiffSq
});
Q('q44', {
  level: 2, skill: 'ex1', kind: 'text', accept: ['p^2/4-9q^2', '1/4p^2-9q^2', '(1/4)p^2-9q^2'], ansTex: '\\dfrac{1}{4}p^2 - 9q^2',
  q: 'Expand:\n$$(p-6q)\\left(\\frac{p}{4}+\\frac{6q}{4}\\right)$$',
  hints: ['Factor $\\frac{1}{4}$ out of the second bracket: $\\frac{1}{4}(p + 6q)$.', 'Then use $(p-6q)(p+6q) = p^2 - 36q^2$.'],
  steps: ['$(p-6q)\\left(\\frac{p}{4}+\\frac{6q}{4}\\right) = \\frac{1}{4}(p-6q)(p+6q)$', '$= \\frac{1}{4}(p^2 - 36q^2)$', '$= \\dfrac{1}{4}p^2 - 9q^2$'],
  gen: genExpandDiffSq
});
Q('q45', {
  level: 2, skill: 'ex1', kind: 'text', accept: ['s^2/6-2/3t^2', '1/6s^2-2/3t^2', '(1/6)s^2-2/3t^2', 's^2/6-2t^2/3'], ansTex: '\\dfrac{1}{6}s^2 - \\dfrac{2}{3}t^2',
  q: 'Expand:\n$$(-s-2t)\\left(\\frac{t}{3}-\\frac{s}{6}\\right)$$',
  hints: ['Factor $-\\frac{1}{6}$ out of the second bracket: $\\frac{t}{3} - \\frac{s}{6} = -\\frac{1}{6}(s - 2t)$.', 'The first bracket: $-s-2t = -(s+2t)$.'],
  steps: ['$(-s-2t)\\left(\\frac{t}{3}-\\frac{s}{6}\\right) = -(s+2t) \\cdot \\left(-\\frac{1}{6}\\right)(s-2t) = \\frac{1}{6}(s+2t)(s-2t)$', '$= \\frac{1}{6}(s^2 - 4t^2)$', '$= \\dfrac{1}{6}s^2 - \\dfrac{2}{3}t^2$'],
  gen: genExpandDiffSq
});
Q('q46', {
  level: 2, skill: 'ex2', kind: 'text', accept: ['25a^4-70a^2b+49b^2'], ansTex: '25a^4 - 70a^2b + 49b^2',
  q: 'Expand:\n$$(5a^2-7b)^2$$',
  hints: ['$A = 5a^2$ so $A^2 = 25a^4$.', '$2AB = 2(5a^2)(7b) = 70a^2b$, minus.'],
  steps: ['$(5a^2-7b)^2 = (5a^2)^2 - 2(5a^2)(7b) + (7b)^2$', '$= 25a^4 - 70a^2b + 49b^2$'],
  gen: genExpandSq
});
Q('q47', {
  level: 2, skill: 'ex2', kind: 'text', accept: ['4c^4+28abc^2+49a^2b^2'], ansTex: '4c^4 + 28abc^2 + 49a^2b^2',
  q: 'Expand:\n$$(-2c^2-7ab)^2$$',
  hints: ['Both signs negative → middle term positive.', '$(-2c^2)^2 = 4c^4$, $2(-2c^2)(-7ab) = 28ab\\,c^2$.'],
  steps: ['$(-2c^2-7ab)^2 = (-2c^2)^2 + 2(-2c^2)(-7ab) + (-7ab)^2$', '$= 4c^4 + 28ab\\,c^2 + 49a^2b^2$'],
  gen: genExpandSq
});
Q('q48', {
  level: 2, skill: 'ex2', kind: 'text', accept: ['225/4s^2+30s+4', '(225/4)s^2+30s+4', '225s^2/4+30s+4'], ansTex: '\\dfrac{225}{4}s^2 + 30s + 4',
  q: 'Expand:\n$$\\left[6\\left(\\frac{5s}{4}+\\frac{1}{3}\\right)\\right]^2$$',
  hints: ['Multiply inside first: $6 \\cdot \\frac{5s}{4} = \\frac{15s}{2}$ and $6 \\cdot \\frac{1}{3} = 2$.', 'Then expand $\\left(\\frac{15s}{2} + 2\\right)^2$.'],
  steps: ['$\\left[6\\left(\\frac{5s}{4}+\\frac{1}{3}\\right)\\right]^2 = \\left(\\frac{15s}{2}+2\\right)^2$', '$= \\left(\\frac{15s}{2}\\right)^2 + 2\\left(\\frac{15s}{2}\\right)(2) + 2^2$', '$= \\dfrac{225}{4}s^2 + 30s + 4$'],
  gen: genExpandSq
});
Q('q49', {
  level: 2, skill: 'ex2', kind: 'text', accept: ['u^4-8u^2v^2+16v^4'], ansTex: 'u^4 - 8u^2v^2 + 16v^4',
  q: 'Expand:\n$$\\left[(u+2v)(u-2v)\\right]^2$$',
  hints: ['Expand inside the square brackets first: difference of squares.', 'Then square the result — it is itself a perfect square.'],
  steps: ['$(u+2v)(u-2v) = u^2 - 4v^2$', '$\\left(u^2 - 4v^2\\right)^2 = (u^2)^2 - 2(u^2)(4v^2) + (4v^2)^2$', '$= u^4 - 8u^2v^2 + 16v^4$'],
  gen: genExpandSq
});
Q('q50', {
  level: 2, skill: 'fa2', kind: 'text', accept: ['pq(q-2p)(p+q)', 'pq(p+q)(q-2p)'], ansTex: 'pq(q-2p)(p+q)',
  q: 'Factorise:\n$$p^2(q^2 - 2pq) + q^2(pq - 2p^2)$$',
  hints: ['Factor each chunk separately first.', '$p^2(q^2-2pq) = p^2q(q - 2p)$ and $q^2(pq-2p^2) = pq^2(q-2p)$.'],
  steps: ['$p^2(q^2 - 2pq) = p^2q(q - 2p)$', '$q^2(pq - 2p^2) = pq^2(q - 2p)$', '$= pq(q-2p)(p + q)$'],
  gen: genL2
});
Q('q51', {
  level: 2, skill: 'fa1', kind: 'text', accept: ['ab(5a-1)(a+b)', 'ab(5a-1)(b+a)', 'ab(a+b)(5a-1)', 'ab(b+a)(5a-1)'], ansTex: 'ab(5a-1)(a+b)',
  q: 'Factorise:\n$$a(5ab^2 - b^2) - b(a^2 - 5a^3)$$',
  hints: ['Factor inside each bracket first: $5ab^2 - b^2 = b^2(5a-1)$.', '$a^2 - 5a^3 = a^2(1 - 5a) = -a^2(5a-1)$.', 'Both chunks now contain $(5a-1)$ — and what remains shares $ab$.'],
  steps: ['$a(5ab^2 - b^2) = ab^2(5a-1)$', '$-b(a^2 - 5a^3) = -a^2b(1-5a) = +a^2b(5a-1)$', '$= (5a-1)(ab^2 + a^2b)$', '$= ab(5a-1)(b + a)$'],
  gen: genL2
});
Q('q52', {
  level: 2, skill: 'fa2', kind: 'text', accept: ['2(x-y)(2a+7b)', '2(2a+7b)(x-y)', '(x-y)(4a+14b)', '(4a+14b)(x-y)'], ansTex: '2(x-y)(2a+7b)',
  q: 'Factorise:\n$$4ax - 4ay + 14bx - 14by$$',
  hints: ['Every coefficient is even — take out $2$ first.', 'Then group: $2[2a(x-y) + 7b(x-y)]$.'],
  steps: ['$4ax - 4ay + 14bx - 14by = 2(2ax - 2ay + 7bx - 7by)$', '$= 2[(2ax - 2ay) + (7bx - 7by)]$', '$= 2[2a(x-y) + 7b(x-y)]$', '$= 2(x-y)(2a+7b)$'],
  gen: genL2
});
Q('q53', {
  level: 2, skill: 'fa2', kind: 'text', accept: ['3(x-3y)(x+2z)', '3(x+2z)(x-3y)'], ansTex: '3(x-3y)(x+2z)',
  q: 'Factorise:\n$$3x^2 - 18yz - 9xy + 6xz$$',
  hints: ['Take out the common factor $3$ first.', 'Then group: $3[x^2 - 3xy + 2xz - 6yz]$.'],
  steps: ['$3x^2 - 18yz - 9xy + 6xz = 3(x^2 - 6yz - 3xy + 2xz)$', 'Reorder: $3[x^2 - 3xy + 2xz - 6yz]$', '$= 3[x(x-3y) + 2z(x-3y)]$', '$= 3(x-3y)(x+2z)$'],
  gen: genL2
});
Q('q54', {
  level: 2, skill: 'fa2', kind: 'text', accept: ['(x-y+1)(5k+7)', '(5k+7)(x-y+1)'], ansTex: '(x-y+1)(5k+7)',
  q: 'Factorise:\n$$5kx + 7x - 5ky - 7y + 5k + 7$$',
  hints: ['Group into three pairs, each containing $5k$ or $7$.', '$5k(x - y + 1) + 7(x - y + 1)$.'],
  steps: ['$= 5k(x - y + 1) + 7(x - y + 1)$', '$= (x - y + 1)(5k + 7)$'],
  gen: genL2
});
Q('q55', {
  level: 2, skill: 'fa2', kind: 'text', accept: ['(x+3y-z)(2h+k)', '(2h+k)(x+3y-z)'], ansTex: '(x+3y-z)(2h+k)',
  q: 'Factorise:\n$$2hx + kx + 3ky + 6hy - 2hz - kz$$',
  hints: ['Group terms with $2h$, terms with $k$.', '$2h(x + 3y - z) + k(x + 3y - z)$.'],
  steps: ['$= 2h(x + 3y - z) + k(x + 3y - z)$', '$= (x + 3y - z)(2h + k)$'],
  gen: genL2
});
Q('q56', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['a^3(a+1)(a-1)', 'a^3(a-1)(a+1)'], ansTex: 'a^3(a+1)(a-1)',
  q: 'Factorise:\n$$a^5 - a^3$$',
  hints: ['Take out the common factor $a^3$ first.', '$a^2 - 1$ is a difference of squares.'],
  steps: ['$a^5 - a^3 = a^3(a^2 - 1)$', '$= a^3(a+1)(a-1)$'],
  gen: genL2
});
Q('q57', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['3q^3(2p+5)(2p-5)', '3q^3(2p-5)(2p+5)'], ansTex: '3q^3(2p+5)(2p-5)',
  q: 'Factorise:\n$$12p^2q^3 - 75q^3$$',
  hints: ['Common factor: $3q^3$.', '$4p^2 - 25$ is a difference of squares.'],
  steps: ['$12p^2q^3 - 75q^3 = 3q^3(4p^2 - 25)$', '$= 3q^3\\left[(2p)^2 - 5^2\\right]$', '$= 3q^3(2p+5)(2p-5)$'],
  gen: genL2
});
Q('q58', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['(2a+3)(2a-1)', '(2a-1)(2a+3)'], ansTex: '(2a+3)(2a-1)',
  q: 'Factorise:\n$$(2a+1)^2 - 4$$',
  hints: ['$4 = 2^2$ — difference of squares with $A = 2a+1$, $B = 2$.', '$(A+B)(A-B)$.'],
  steps: ['$(2a+1)^2 - 4 = (2a+1)^2 - 2^2$', '$= (2a+1+2)(2a+1-2)$', '$= (2a+3)(2a-1)$'],
  gen: genL2
});
Q('q59', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['7(6-h)(4+h)', '7(4+h)(6-h)', '-7(h-6)(h+4)', '-7(h+4)(h-6)'], ansTex: '7(6-h)(4+h)',
  q: 'Factorise:\n$$175 - 7(1-h)^2$$',
  hints: ['Take out the factor $7$ first: $7\\left[25 - (1-h)^2\\right]$.', '$25 = 5^2$ — difference of squares.'],
  steps: ['$175 - 7(1-h)^2 = 7\\left[25 - (1-h)^2\\right]$', '$= 7\\left[5 + (1-h)\\right]\\left[5 - (1-h)\\right]$', '$= 7(6-h)(4+h)$'],
  gen: genL2
});
Q('q60', {
  level: 2, skill: 'fa4', kind: 'text', accept: ['(2k-1)^2', '(2k-1)(2k-1)'], ansTex: '(2k-1)^2',
  q: 'Factorise:\n$$4(k-2)^2 - 12(2-k) + 9$$',
  hints: ['$-12(2-k) = +12(k-2)$ — make both middle signs match.', 'Let $T = k-2$: the expression becomes $4T^2 + 12T + 9$.'],
  steps: ['$4(k-2)^2 - 12(2-k) + 9 = 4(k-2)^2 + 12(k-2) + 9$', '$= [2(k-2)]^2 + 2 \\cdot 2(k-2) \\cdot 3 + 3^2$', '$= [2(k-2) + 3]^2$', '$= (2k - 1)^2$'],
  gen: genL2
});
Q('q61', {
  level: 2, skill: 'fa4', kind: 'text', accept: ['-5(h+7)^2', '-5(h+7)(h+7)'], ansTex: '-5(h+7)^2',
  q: 'Factorise:\n$$-45 - 30(h+4) - 5(h+4)^2$$',
  hints: ['Take out $-5$ first: $-5\\left[9 + 6(h+4) + (h+4)^2\\right]$.', 'The bracket is a perfect square in $(h+4)$.'],
  steps: ['$-45 - 30(h+4) - 5(h+4)^2 = -5\\left[9 + 6(h+4) + (h+4)^2\\right]$', '$9 = 3^2$ and $6(h+4) = 2 \\cdot 3 \\cdot (h+4)$', '$= -5\\left[(h+4) + 3\\right]^2$', '$= -5(h+7)^2$'],
  gen: genL2
});
Q('q62', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['(p+2q)(p-2q-2)', '(p-2q-2)(p+2q)'], ansTex: '(p+2q)(p-2q-2)',
  q: 'Factorise:\n$$p^2 - 4q^2 - 2p - 4q$$',
  hints: ['Group $p^2 - 4q^2$ — a difference of squares.', 'Both parts share the bracket $(p + 2q)$.'],
  steps: ['$p^2 - 4q^2 - 2p - 4q = (p^2 - 4q^2) - 2(p + 2q)$', '$= (p+2q)(p-2q) - 2(p+2q)$', '$= (p+2q)(p-2q-2)$'],
  gen: genL2
});
Q('q63', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['(p-3+q)(p-3-q)', '(p+q-3)(p-q-3)', '(p-3-q)(p-3+q)'], ansTex: '(p-3+q)(p-3-q)',
  q: 'Factorise:\n$$p^2 - 6p + 9 - q^2$$',
  hints: ['The first three terms form a perfect square.', '$(p-3)^2 - q^2$ — then difference of squares.'],
  steps: ['$p^2 - 6p + 9 - q^2 = (p-3)^2 - q^2$', '$= (p-3+q)(p-3-q)$'],
  gen: genL2
});
Q('q64', {
  level: 2, skill: 'fa4', kind: 'text', accept: ['(2a+4b+1)(2a-4b-1)', '(2a-4b-1)(2a+4b+1)'], ansTex: '(2a+4b+1)(2a-4b-1)',
  q: 'Factorise:\n$$4a^2 - 16b^2 - 8b - 1$$',
  hints: ['Group the last three terms: $16b^2 + 8b + 1$ is a perfect square.', '$4a^2 - (4b+1)^2$ — difference of squares.'],
  steps: ['$4a^2 - 16b^2 - 8b - 1 = 4a^2 - (16b^2 + 8b + 1)$', '$= 4a^2 - (4b+1)^2$', '$= [2a + (4b+1)][2a - (4b+1)]$', '$= (2a+4b+1)(2a-4b-1)$'],
  gen: genL2
});
Q('q65', {
  level: 2, skill: 'fa3', kind: 'text', accept: ['2q(p^2+4)(p+2)(p-2)', '2q(p^2+4)(p-2)(p+2)', '2q(p+2)(p-2)(p^2+4)', '2q(p-2)(p+2)(p^2+4)'], ansTex: '2q(p^2+4)(p+2)(p-2)',
  q: 'Factorise:\n$$2p^4q - 32q$$',
  hints: ['Common factor: $2q$.', '$p^4 - 16$ is a difference of squares **twice**.'],
  steps: ['$2p^4q - 32q = 2q(p^4 - 16)$', '$= 2q(p^2 + 4)(p^2 - 4)$', '$p^2 - 4 = (p+2)(p-2)$', '$= 2q(p^2+4)(p+2)(p-2)$'],
  gen: genL2
});

/* ---------------- CHALLENGE (66–70) ---------------- */
Q('q66', {
  level: 2, skill: 'ch1', kind: 'multi',
  q: 'Challenge — substitution with a perfect square',
  hints: ['Start with part (a): it is a perfect square.'],
  steps: [],
  parts: [
    { label: '(a)', q: 'Factorise $x^2 + 8xy + 16y^2$.', kind: 'text', accept: ['(x+4y)^2', '(x+4y)(x+4y)'],
      hints: ['Is the middle term $2 \\times x \\times 4y$?', 'Perfect square: $A^2 + 2AB + B^2$.'],
      steps: ['$16y^2 = (4y)^2$ and the middle term is $2(x)(4y) = 8xy$ ✓', '$x^2 + 8xy + 16y^2 = (x+4y)^2$'] },
    { label: '(b)', q: 'Hence, factorise $(m-n)^2 + 8(m-n)(2m+n) + 16(2m+n)^2$.', kind: 'text', accept: ['9(3m+n)^2', '(9m+3n)^2', '9(3m+n)(3m+n)', '(9m+3n)(9m+3n)'],
      hints: ['Compare with (a): $x$ is playing the role of $(m-n)$, and $4y$ the role of $4(2m+n)$.', 'The answer from (a) becomes $[(m-n) + 4(2m+n)]^2$.', 'Simplify inside the bracket, then look for a common factor.'],
      steps: ['Using (a) with $x = m-n$ and $y = 2m+n$:', '$= [(m-n) + 4(2m+n)]^2$', '$= (m - n + 8m + 4n)^2 = (9m + 3n)^2$', '$= 9(3m+n)^2$'] }
  ],
  gen: genSubstitution
});
Q('q67', {
  level: 2, skill: 'ch1', kind: 'multi',
  q: 'Challenge — difference of squares in disguise',
  hints: ['Part (a) is the most famous identity of all.'],
  steps: [],
  parts: [
    { label: '(a)', q: 'Expand $(m+n)(m-n)$.', kind: 'text', accept: ['m^2-n^2'],
      hints: ['This is $(A+B)(A-B)$ with $A=m$, $B=n$.'],
      steps: ['$(m+n)(m-n) = m^2 - mn + mn - n^2 = m^2 - n^2$'] },
    { label: '(b)', q: 'Using the result of (a), expand $(2p+q-3r)(2p+q+3r)$.', kind: 'text', accept: ['4p^2+4pq+q^2-9r^2'],
      hints: ['Treat the whole of $(2p+q)$ as one quantity.', 'It becomes $(M-N)(M+N)$ with $M = 2p+q$, $N = 3r$.'],
      steps: ['Let $M = 2p+q$ and $N = 3r$. Then the product is $(M-N)(M+N) = M^2 - N^2$.', '$M^2 = (2p+q)^2 = 4p^2 + 4pq + q^2$', '$N^2 = 9r^2$', 'Answer: $4p^2 + 4pq + q^2 - 9r^2$'] }
  ],
  gen: genTwoSquares
});
Q('q68', {
  level: 2, skill: 'ch1', kind: 'multi',
  q: 'Challenge — the substitution chain',
  hints: ['Follow the steps in order — each part feeds the next.'],
  steps: [],
  parts: [
    { label: '(a)(i)', q: 'Expand $(a-1)^2$.', kind: 'text', accept: ['a^2-2a+1'],
      hints: ['Perfect square identity.'],
      steps: ['$(a-1)^2 = a^2 - 2a + 1$'] },
    { label: '(a)(ii)', q: 'Hence, expand $(2x+3y-1)^2$.', kind: 'text', accept: ['4x^2+12xy+9y^2-4x-6y+1'],
      hints: ['Put $a = 2x+3y$ into the result of (a)(i).', 'Expand $(2x+3y)^2$ with the perfect-square identity.'],
      steps: ['Put $a = 2x+3y$: $(2x+3y-1)^2 = (2x+3y)^2 - 2(2x+3y) + 1$', '$(2x+3y)^2 = 4x^2 + 12xy + 9y^2$', '$= 4x^2 + 12xy + 9y^2 - 4x - 6y + 1$'] },
    { label: '(b)', q: 'Hence, or otherwise, expand $(2x+3y+2)(2x+3y-4)$.', kind: 'text', accept: ['4x^2+12xy+9y^2-4x-6y-8'],
      hints: ['Write each bracket as $(2x+3y-1) + $ something.', '$(2x+3y+2) = (2x+3y-1)+3$ and $(2x+3y-4) = (2x+3y-1)-3$.'],
      steps: ['$(2x+3y+2)(2x+3y-4) = [(2x+3y-1)+3][(2x+3y-1)-3]$', '$= (2x+3y-1)^2 - 9$', '$= (4x^2 + 12xy + 9y^2 - 4x - 6y + 1) - 9$', '$= 4x^2 + 12xy + 9y^2 - 4x - 6y - 8$'] }
  ],
  gen: null
});
Q('q69', {
  level: 2, skill: 'ch1', kind: 'multi',
  q: 'Challenge — mental arithmetic with identities',
  hints: ['Part (a) chains difference of squares twice.'],
  steps: [],
  parts: [
    { label: '(a)', q: 'Expand $(x^2+1)(x+1)(x-1)$.', kind: 'text', accept: ['x^4-1'],
      hints: ['Multiply $(x+1)(x-1)$ first.', 'You get another difference of squares: $(x^2+1)(x^2-1)$.'],
      steps: ['$(x+1)(x-1) = x^2 - 1$', '$(x^2+1)(x^2-1) = (x^2)^2 - 1 = x^4 - 1$'] },
    { label: '(b)', q: 'Hence, find the value of $101 \\times 11 \\times 9$ without using a calculator.', kind: 'numeric', answer: 9999,
      hints: ['$101 = 10^2 + 1$, $11 = 10 + 1$, $9 = 10 - 1$.', 'So the product is $10^4 - 1$.'],
      steps: ['$101 \\times 11 \\times 9 = (10^2+1)(10+1)(10-1)$', '$= 10^4 - 1 = 10000 - 1$', '$= 9999$'] }
  ],
  gen: genNumTrick
});
Q('q70', {
  level: 2, skill: 'ch1', kind: 'multi',
  q: 'Cross-topic challenge — geometry meets identities',
  hints: ['Use the perfect-square identities with the given values.'],
  steps: [],
  parts: [
    { label: '(a)', q: 'It is given that $x^2 + y^2 = 62$ and $xy = 30$. Find the values of $(x+y)^2$ and $(x-y)^2$.', kind: 'constants', vars: ['(x+y)^2', '(x-y)^2'], values: [122, 2],
      hints: ['$(x \\pm y)^2 = x^2 + y^2 \\pm 2xy$.', 'Substitute the two given values.'],
      steps: ['$(x+y)^2 = x^2 + y^2 + 2xy = 62 + 2(30) = 122$', '$(x-y)^2 = x^2 + y^2 - 2xy = 62 - 2(30) = 2$'] },
    { label: '(b)(i)', q: 'A square $ABCD$ has side $4x^2$ cm. $E$ and $F$ lie on $AD$ and $CD$ respectively with $AE = CF = 4y^2$ cm. Express the area of $\\triangle DEF$ in terms of $x$ and $y$, and factorise your result.', kind: 'text', accept: ['8(x+y)^2(x-y)^2', '8(x-y)^2(x+y)^2'],
      hints: ['$DE = DC - EC$. Find $DE$ and $DF$ in terms of $x$ and $y$.', '$DE = DF = 4x^2 - 4y^2 = 4(x^2 - y^2) = 4(x+y)(x-y)$.', 'Area $= \\frac{1}{2} \\times DE \\times DF$.'],
      steps: ['$DE = DF = 4x^2 - 4y^2 = 4(x+y)(x-y)$', 'Area $= \\frac{1}{2} \\times 4(x+y)(x-y) \\times 4(x+y)(x-y)$', '$= 8(x+y)^2(x-y)^2\\ \\text{cm}^2$'] },
    { label: '(b)(ii)', q: 'Using the results of (a) and (b)(i), find the area of $\\triangle DEF$.', kind: 'numeric', answer: 1952,
      hints: ['Area $= 8(x+y)^2(x-y)^2$ — use your answers from (a).', '$8 \\times 122 \\times 2$'],
      steps: ['Area $= 8 \\times 122 \\times 2 = 1952\\ \\text{cm}^2$'] }
  ],
  gen: genGivenSum
});

/* ---------------- MCQs ---------------- */
Q('m1', {
  level: 1, skill: 'id1', kind: 'mcq',
  q: 'Which of the following is an identity?',
  options: [
    { tex: 'x = 0', correct: false },
    { tex: '(x-y)^2 = x^2 - y^2', correct: false },
    { tex: 'x^2 + y^2 = (x-y)(x+y)', correct: false },
    { tex: '2x^2 + 2x(1+2x) = 2x(3x+1)', correct: true }
  ],
  hints: ['An identity is true for **every** value of $x$.', 'Expand both sides of each option and compare.', 'In option D: LHS $= 2x^2 + 2x + 4x^2 = 6x^2 + 2x$; RHS $= 6x^2 + 2x$ ✓'],
  steps: ['Option A: only true for $x=0$ — an equation, not an identity.', 'Option B: LHS $= x^2 - 2xy + y^2 \\neq$ RHS (missing $-2xy$).', 'Option C: RHS $= x^2 - y^2 \\neq$ LHS.', 'Option D: LHS $= 2x^2 + 2x + 4x^2 = 6x^2 + 2x =$ RHS ✓ — identity.'],
  gen: () => genMcqIdentity(false)
});
Q('m2', {
  level: 1, skill: 'id1', kind: 'mcq',
  q: 'Which of the following is NOT an identity?',
  options: [
    { tex: '5(x+2)+3 = 5x+13', correct: false },
    { tex: '3x+12 = 3(x+4)+x', correct: true },
    { tex: '2(9x-6) = 3(6x-4)', correct: false },
    { tex: '(x-3)^2 = x^2 - 6x + 9', correct: false }
  ],
  hints: ['Three of these are true for all $x$ — find the one that is not.', 'Check option B: expand the right side.'],
  steps: ['A: $5x + 13 = 5x + 13$ ✓', 'B: RHS $= 3x + 12 + x = 4x + 12 \\neq 3x + 12$ — NOT an identity.', 'C: $18x - 12 = 18x - 12$ ✓', 'D: perfect square expansion ✓'],
  gen: () => genMcqIdentity(true)
});
Q('m3', {
  level: 1, skill: 'id2', kind: 'mcq',
  q: 'If $A$ and $B$ are constants such that\n$$2x^2 + Ax + B \\equiv (x+3)(2x-1) + 4,$$\nthen',
  options: [
    { tex: 'A = 5,\\ B = 4', correct: false },
    { tex: 'A = 5,\\ B = 1', correct: true },
    { tex: 'A = 7,\\ B = 4', correct: false },
    { tex: 'A = 7,\\ B = 1', correct: false }
  ],
  hints: ['Expand $(x+3)(2x-1) + 4$.', 'Compare the $x$ coefficient and the constant.'],
  steps: ['RHS $= 2x^2 + 5x - 3 + 4 = 2x^2 + 5x + 1$', 'Compare: $A = 5$, $B = 1$'],
  gen: genMcqConstants
});
Q('m4', {
  level: 1, skill: 'id2', kind: 'mcq',
  q: 'If $A$ and $B$ are constants such that\n$$(x-2)(x+A) \\equiv (x+1)^2 - B,$$\nthen $B =$',
  options: [
    { tex: '-9', correct: false },
    { tex: '4', correct: false },
    { tex: '8', correct: false },
    { tex: '9', correct: true }
  ],
  hints: ['Substitution shortcut: try $x = 2$ — the left side becomes $0$.', '$0 = (2+1)^2 - B$.'],
  steps: ['Put $x = 2$: LHS $= 0$, so $0 = 9 - B \\Rightarrow B = 9$', 'Check with $x = 0$: $-2A = 1 - 9 = -8 \\Rightarrow A = 4$ ✓'],
  gen: genMcqConstants
});
Q('m5', {
  level: 1, skill: 'id2', kind: 'mcq',
  q: 'If $p$ and $q$ are constants such that\n$$6x(px+3) + 2 \\equiv 12x^2 + 2(qx+1) + px,$$\nthen $q =$',
  options: [
    { tex: '2', correct: false },
    { tex: '8', correct: true },
    { tex: '9', correct: false },
    { tex: '10', correct: false }
  ],
  hints: ['Expand both sides and compare $x^2$ coefficients to find $p$ first.', 'Then compare the $x$ coefficients.'],
  steps: ['LHS $= 6px^2 + 18x + 2$', 'RHS $= 12x^2 + (2q+p)x + 2$', 'Compare $x^2$: $6p = 12 \\Rightarrow p = 2$', 'Compare $x$: $18 = 2q + 2 \\Rightarrow q = 8$'],
  gen: genMcqConstants
});
Q('m6', {
  level: 1, skill: 'ex1', kind: 'mcq',
  q: '$$(x+2y)\\left(\\frac{x}{3} - \\frac{2y}{3}\\right) =$$',
  options: [
    { tex: '\\dfrac{x^2}{3} - \\dfrac{4}{3}y^2', correct: true },
    { tex: '\\dfrac{x^2}{9} - \\dfrac{4}{9}y^2', correct: false },
    { tex: '\\dfrac{x^2}{3} - \\dfrac{4}{3}xy + \\dfrac{4}{3}y^2', correct: false },
    { tex: '\\dfrac{x^2}{9} - \\dfrac{4}{9}xy + \\dfrac{4}{9}y^2', correct: false }
  ],
  hints: ['Factor $\\frac{1}{3}$ from the second bracket.', 'Then it is $(x+2y)(x-2y) \\div 3$.'],
  steps: ['$\\left(\\frac{x}{3} - \\frac{2y}{3}\\right) = \\frac{1}{3}(x - 2y)$', '$\\frac{1}{3}(x+2y)(x-2y) = \\frac{1}{3}(x^2 - 4y^2)$', '$= \\dfrac{x^2}{3} - \\dfrac{4}{3}y^2$'],
  gen: genMcqExpand
});
Q('m7', {
  level: 1, skill: 'ex2', kind: 'mcq',
  q: '$$(3a-2b)^2 =$$',
  options: [
    { tex: '9a^2 - 4b^2', correct: false },
    { tex: '9a^2 - 6ab + 4b^2', correct: false },
    { tex: '9a^2 - 12ab + 4b^2', correct: true },
    { tex: '3a^2 - 12ab + 2b^2', correct: false }
  ],
  hints: ['Perfect square: $(A-B)^2 = A^2 - 2AB + B^2$.', '$2AB = 2(3a)(2b) = 12ab$.'],
  steps: ['$(3a-2b)^2 = 9a^2 - 2(3a)(2b) + 4b^2$', '$= 9a^2 - 12ab + 4b^2$'],
  gen: genMcqExpand
});
Q('m8', {
  level: 1, skill: 'ex1', kind: 'mcq',
  q: '$$(2a+3b)^2 - (2a-3b)^2 =$$',
  options: [
    { tex: '0', correct: false },
    { tex: '18b^2', correct: false },
    { tex: '12ab', correct: false },
    { tex: '24ab', correct: true }
  ],
  hints: ['Use $A^2 - B^2 = (A+B)(A-B)$ instead of expanding.', '$(A+B) = 4a + ...$ wait: $(2a+3b)+(2a-3b) = 4a$, and $(A-B) = 6b$.'],
  steps: ['$= [(2a+3b)+(2a-3b)][(2a+3b)-(2a-3b)]$', '$= (4a)(6b) = 24ab$'],
  gen: genMcqExpand
});
Q('m9', {
  level: 1, skill: 'fa2', kind: 'mcq',
  q: 'Factorise $a(b+c) - bc - b^2$.',
  options: [
    { tex: '(b+c)(a-b)', correct: true },
    { tex: '(b+c)(a+b)', correct: false },
    { tex: '(b-c)(a+b)', correct: false },
    { tex: '(b-c)(a-b)', correct: false }
  ],
  hints: ['Rewrite $-bc - b^2 = -b(c+b)$.', 'Both parts share $(b+c)$.'],
  steps: ['$a(b+c) - bc - b^2 = a(b+c) - b(c+b)$', '$= (b+c)(a-b)$'],
  gen: genMcqFactorOf
});
Q('m10', {
  level: 1, skill: 'fa2', kind: 'mcq',
  q: 'Factorise $2xy + 3xz + 6yz + x^2$.',
  options: [
    { tex: '(x+2z)(x+3y)', correct: true },
    { tex: '(x+3z)(x+2y)', correct: false },
    { tex: '(2y+3z)(x+2z)', correct: false },
    { tex: '(2y+3z)(x+3z)', correct: false }
  ],
  hints: ['Group terms sharing $x$: $(x^2 + 2xy) + (3xz + 6yz)$.', '$x(x+2y) + 3z(x+2y)$.'],
  steps: ['Reorder: $x^2 + 2xy + 3xz + 6yz$', '$= x(x+2y) + 3z(x+2y)$', '$= (x+2y)(x+3z)$'],
  gen: genMcqFactor
});
Q('m11', {
  level: 1, skill: 'fa4', kind: 'mcq',
  q: 'Factorise $16x^2 + 24xy + 9y^2$.',
  options: [
    { tex: '(4x+3y)^2', correct: true },
    { tex: '(4x-3y)^2', correct: false },
    { tex: '(16x+9y)^2', correct: false },
    { tex: '(16x-9y)^2', correct: false }
  ],
  hints: ['$16x^2 = (4x)^2$, $9y^2 = (3y)^2$.', 'The middle term is $+2(4x)(3y) = 24xy$ — both signs positive.'],
  steps: ['$16x^2 + 24xy + 9y^2 = (4x)^2 + 2(4x)(3y) + (3y)^2$', '$= (4x+3y)^2$'],
  gen: genMcqFactor
});
Q('m12', {
  level: 1, skill: 'fa2', kind: 'mcq',
  q: 'Factorise $4x^2 - 25y^2 - 4x + 10y$.',
  options: [
    { tex: '(2x+5y)(2x-5y-2)', correct: false },
    { tex: '(2x+5y)(2x+5y-2)', correct: false },
    { tex: '(2x-5y)(2x-5y-2)', correct: false },
    { tex: '(2x-5y)(2x+5y-2)', correct: true }
  ],
  hints: ['Group: $4x^2 - 25y^2$ is a difference of squares; $-4x + 10y = -2(2x-5y)$.', 'Both parts share $(2x-5y)$.'],
  steps: ['$(4x^2 - 25y^2) - (4x - 10y) = (2x-5y)(2x+5y) - 2(2x-5y)$', '$= (2x-5y)(2x+5y-2)$'],
  gen: genMcqFactor
});
Q('m13', {
  level: 1, skill: 'fa3', kind: 'mcq',
  q: 'Which of the following expressions has/have a factor $x-3$?\n\nI. $-2x-6$\\quad II. $x^2-9$\\quad III. $9x^2-18x+9$',
  options: [
    { tex: '\\text{I only}', correct: false },
    { tex: '\\text{II only}', correct: true },
    { tex: '\\text{I and III only}', correct: false },
    { tex: '\\text{II and III only}', correct: false }
  ],
  hints: ['$(x-3)$ is a factor exactly when substituting $x=3$ gives $0$.', 'Check each of I, II, III at $x = 3$.'],
  steps: ['I: $-2(3)-6 = -12 \\neq 0$ — no.', 'II: $9 - 9 = 0$ ✓ (in fact $x^2 - 9 = (x-3)(x+3)$).', 'III: $9(x-1)^2$ at $x=3$ gives $36 \\neq 0$ — no.', 'Answer: II only.'],
  gen: genMcqHasFactor
});
Q('m14', {
  level: 1, skill: 'ch1', kind: 'mcq',
  q: 'Which of the following is a factor of $3(a+b) - b^2 + a^2$?',
  options: [
    { tex: 'a-b', correct: false },
    { tex: 'a+b', correct: true },
    { tex: '3+a+b', correct: false },
    { tex: '3-a+b', correct: false }
  ],
  hints: ['Group $a^2 - b^2$ as a difference of squares.', '$3(a+b) + (a+b)(a-b)$ — take out the common bracket.'],
  steps: ['$3(a+b) - b^2 + a^2 = 3(a+b) + (a+b)(a-b)$', '$= (a+b)(3 + a - b)$', 'So $(a+b)$ is a factor.'],
  gen: genMcqFactorOf
});

/* ---------------- PRACTICE SETS ---------------- */
const SETS = [
  { id: 's1', title: 'Identities: yes or no?', level: 1, desc: 'Test whether an equation is true for all values — or only for some.', ids: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] },
  { id: 's2', title: 'Finding the unknowns A and B', level: 1, desc: 'Expand, compare coefficients, solve for the letters.', ids: ['q7', 'q8', 'q9', 'q10', 'q11', 'q12'] },
  { id: 's3', title: 'Expanding: difference of squares', level: 1, desc: '$(A+B)(A-B) = A^2 - B^2$', ids: ['q13', 'q14', 'q15', 'q16'] },
  { id: 's4', title: 'Expanding: perfect squares', level: 1, desc: '$(A \\pm B)^2 = A^2 \\pm 2AB + B^2$', ids: ['q17', 'q18', 'q19', 'q20'] },
  { id: 's5', title: 'Factorising: common factors', level: 1, desc: 'Pull out what the terms share — numbers, letters, whole brackets.', ids: ['q21', 'q22', 'q23', 'q24'] },
  { id: 's6', title: 'Factorising: grouping in pairs', level: 1, desc: 'Four terms? Split them into two pairs.', ids: ['q25', 'q26', 'q27', 'q28'] },
  { id: 's7', title: 'Factorising: difference of squares', level: 1, desc: '$A^2 - B^2 = (A+B)(A-B)$', ids: ['q29', 'q30', 'q31', 'q32'] },
  { id: 's8', title: 'Factorising: perfect squares', level: 1, desc: '$A^2 \\pm 2AB + B^2 = (A \\pm B)^2$', ids: ['q33', 'q34', 'q35', 'q36'] },
  { id: 's9', title: 'Level 2: identities & unknowns', level: 2, desc: 'Harder identities and three unknowns $A$, $B$, $C$.', ids: ['q37', 'q38', 'q39', 'q40', 'q41'] },
  { id: 's10', title: 'Level 2: expanding', level: 2, desc: 'Squares of bigger expressions, fractions, fourth powers.', ids: ['q42', 'q43', 'q44', 'q45', 'q46', 'q47', 'q48', 'q49'] },
  { id: 's11', title: 'Level 2: factorising', level: 2, desc: 'Combine all your tools — sometimes twice in one question.', ids: ['q50', 'q51', 'q52', 'q53', 'q54', 'q55', 'q56', 'q57', 'q58', 'q59', 'q60', 'q61', 'q62', 'q63', 'q64', 'q65'] },
  { id: 's12', title: 'Challenge problems', level: 2, desc: 'Multi-step problems — the kind that turn up as the last questions in exams.', ids: ['q66', 'q67', 'q68', 'q69', 'q70'] },
  { id: 's13', title: 'Multiple Choice Sprint', level: 1, desc: '14 exam-style MCQs covering the whole chapter.', ids: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14'] }
];

/* LEARN units live in learn.js */
