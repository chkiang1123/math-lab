/* ============================================================
   learn.js — summary notes (student-facing)
   Math uses $…$ (inline) and $$…$$ (display), rendered by app.js
   ============================================================ */

const LEARN = [
  {
    id: 'u1', title: '1. What is an identity?', icon: '⚖️',
    summary: 'An identity is an equation that is true for EVERY value of the letter — not just one.',
    body: [
      { h: 'Equation vs identity', p: 'An ordinary equation like $2x = 6$ is only true for one value ($x = 3$). An **identity** like $3(x+1) = 3x + 3$ is true no matter what value $x$ takes. We use the symbol $\\equiv$ (or "for all $x$") to show it is an identity.' },
      { h: 'How to check — Method 1: Expand & Compare', p: 'Expand both sides completely. If **every term matches** (all $x^2$ coefficients, all $x$ coefficients, all constants), it is an identity. If even one term differs, it is not.' },
      { example: 'Example: Is $2(3x-1) = 5x - 2 + x$ an identity?\nLHS $= 6x - 2$. RHS $= 6x - 2$. Every term matches → **identity** ✓', type: 'ex' },
      { h: 'How to check — Method 2: Substitute', p: 'Substitute an easy value like $x = 0$ or $x = 1$ into both sides. If they disagree, it is definitely **not** an identity. If they agree, try another value to be more confident — but the only proof is expanding.' },
      { h: 'Watch out', p: '$(3x-2)^2 = (2-3x)^2$ **is** an identity, because $2-3x = -(3x-2)$ and squaring removes the minus. But $(x-y)^2 = x^2 - y^2$ is **not** — the middle term $-2xy$ is missing.' },
      { h: 'Finding unknown constants', p: 'Identities often hide constants: $3(Ax - 3) \\equiv -12x + B + 1$. Expand, then **compare coefficients** of matching terms:\n- $x$ terms: $3A = -12 \\Rightarrow A = -4$\n- constants: $-9 = B + 1 \\Rightarrow B = -10$\n\nShortcut: substituting a clever value of $x$ (one that makes a bracket vanish) can give you a constant instantly.' }
    ],
    practice: 's1'
  },
  {
    id: 'u2', title: '2. Two product identities', icon: '⭐',
    summary: 'Two patterns appear everywhere: difference of squares and perfect squares. Memorise both.',
    body: [
      { h: 'Identity 1: Difference of squares', formula: '$(A+B)(A-B) \\equiv A^2 - B^2$', p: 'Same two terms, opposite signs in the middle. The answer is just the square of each term with a minus between — the middle terms cancel.' },
      { example: '$(5u+4)(5u-4) = (5u)^2 - 4^2 = 25u^2 - 16$', type: 'ex' },
      { h: 'Identity 2a: Perfect square (plus)', formula: '$(A+B)^2 \\equiv A^2 + 2AB + B^2$' },
      { h: 'Identity 2b: Perfect square (minus)', formula: '$(A-B)^2 \\equiv A^2 - 2AB + B^2$', p: 'The middle term is $2AB$ — the mistake students make most often is forgetting it, or halving it. $2 \\times A \\times B$, never $AB$.' },
      { example: '$(3p-5q)^2 = 9p^2 - 30pq + 25q^2$', type: 'ex' },
      { h: 'Negative brackets', p: '$(-5y+6)^2 = (5y-6)^2$ — flipping **both** signs changes nothing, because everything is squared. Flip first if it makes the bracket friendlier.' },
      { h: 'Squares of bigger things', p: 'The identities work with any expressions: $(5a^2 - 7b)^2$, or even $\\left[(u+2v)(u-2v)\\right]^2 = (u^2 - 4v^2)^2$ — expand inside first, then square the result.' }
    ],
    practice: 's3'
  },
  {
    id: 'u3', title: '3. Factorising I: common factors & grouping', icon: '🧗',
    summary: 'Factorising is expanding in reverse. Always ask: "what do these terms share?"',
    body: [
      { h: 'Step 1: Common numeric + letter factors', p: 'Find the HCF of the coefficients and every letter that appears in **all** terms:\n$-20ab - 8bc = -4b(5a + 2c)$\nCheck by expanding back.' },
      { h: 'Step 2: Common brackets', p: 'If a whole bracket repeats, treat it like a single letter:\n$x(y+4) + 2(y+4) = (y+4)(x+2)$' },
      { h: 'Sign flips', p: '$h - k = -(k-h)$. If brackets are opposites, rewrite one:\n$h(k-h) + k(h-k) = h(k-h) - k(k-h) = (k-h)(h-k) = -(h-k)^2$' },
      { h: 'Step 3: Grouping in pairs', p: 'Four terms with no obvious common factor? Split into two pairs and factor each:\n$sp + sq - tp - tq = s(p+q) - t(p+q) = (p+q)(s-t)$\nIf the two pairs do **not** produce the same bracket, try a different pairing.' },
      { example: '$6xy + 3xz - 10yz - 5z^2 = 3x(2y+z) - 5z(2y+z) = (2y+z)(3x-5z)$', type: 'ex' }
    ],
    practice: 's5'
  },
  {
    id: 'u4', title: '4. Factorising II: the two square patterns', icon: '🎯',
    summary: 'Work backwards from the product identities — recognise the pattern first.',
    body: [
      { h: 'Difference of squares', formula: '$A^2 - B^2 = (A+B)(A-B)$', p: 'Ask: are both terms perfect squares? $9m^2 = (3m)^2$, $1 = 1^2$, so $9m^2 - 1 = (3m+1)(3m-1)$.' },
      { h: 'Negative leading term', p: 'Flip first: $-16s^2 + 25t^2 = 25t^2 - 16s^2 = (5t+4s)(5t-4s)$.' },
      { h: 'Common factor first!', p: '$-8 + 98x^2$: take out $2$ **before** you look for squares: $2(49x^2 - 4) = 2(7x+2)(7x-2)$. Always remove common factors first.' },
      { h: 'Perfect squares', formula: '$A^2 \\pm 2AB + B^2 = (A \\pm B)^2$', p: 'Three-term test: ① first term a square ② last term a square ③ middle term $= 2AB$ (with the right sign). If all three hold, it factorises instantly.' },
      { example: '$49x^2 - 42xy + 9y^2$: $(7x)^2$, $(3y)^2$, middle $= 2(7x)(3y) = 42xy$ ✓ → $(7x-3y)^2$', type: 'ex' },
      { h: 'All-negative expressions', p: '$-100 - h^2 + 20h$: take out $-1$ first: $-(h^2 - 20h + 100) = -(h-10)^2$.' }
    ],
    practice: 's7'
  },
  {
    id: 'u5', title: '5. Level 2 toolkit', icon: '🛠️',
    summary: 'Harder questions stack two or three techniques. The order matters.',
    body: [
      { h: 'The golden order', p: '① Common factor → ② pair/group → ③ square patterns → ④ keep going until nothing factors further.' },
      { h: 'Powers of a letter', p: '$a^5 - a^3 = a^3(a^2 - 1) = a^3(a+1)(a-1)$ — common factor first, then difference of squares.' },
      { h: 'Fourth powers: difference of squares twice', p: '$2p^4q - 32q = 2q(p^4 - 16) = 2q(p^2+4)(p^2-4) = 2q(p^2+4)(p+2)(p-2)$.\nNote: $p^2 + 4$ cannot be factorised — stop there.' },
      { h: 'Squares of brackets', p: '$(2a+1)^2 - 4$: it is $A^2 - B^2$ with $A = 2a+1$, $B = 2$: $(2a+3)(2a-1)$.' },
      { h: 'Make the middle sign match', p: '$4(k-2)^2 - 12(2-k) + 9$: since $-12(2-k) = +12(k-2)$, let $T = k-2$:\n$4T^2 + 12T + 9 = (2T+3)^2 = (2k-1)^2$' },
      { h: 'Group, then squares', p: '$p^2 - 6p + 9 - q^2 = (p-3)^2 - q^2 = (p-3+q)(p-3-q)$ — perfect square first, then difference of squares.' },
      { h: 'Hence-type questions', p: 'When a question says "**hence**", it is telling you to reuse your previous answer. E.g. after showing $(x^2+1)(x+1)(x-1) = x^4 - 1$, you can compute $101 \\times 11 \\times 9 = (10^2+1)(10+1)(10-1) = 10^4 - 1 = 9999$ in your head.' }
    ],
    practice: 's11'
  },
  {
    id: 'u6', title: '6. Exam technique & common traps', icon: '📝',
    summary: 'The mistakes that cost the most marks — and how to dodge them.',
    body: [
      { h: 'Trap 1: forgetting the middle term', p: '$(3a-2b)^2 \\neq 9a^2 - 4b^2$. The middle term $-12ab$ is where most marks are lost. Write the identity down first, then substitute.' },
      { h: 'Trap 2: sign errors when expanding minus brackets', p: '$-5(4x-1) = -20x + 5$. Circle the minus and multiply **everything** inside by it.' },
      { h: 'Trap 3: stopping factorising too early', p: 'After every step, ask: "can this factor further?" $p^4 - 16$ factorises twice.' },
      { h: 'Trap 4: MCQ guessing without expanding', p: 'In MCQs, substituting one clever value (like the root of a bracket) can eliminate options in seconds. For "which has factor $x-3$?" — substitute $x = 3$; if you get $0$, it is a factor.' },
      { h: 'Trap 5: sign-flip decoys', p: 'MCQ options often include the right answer with wrong signs. After factorising, expand your answer back mentally to confirm the middle signs.' },
      { h: 'Checking answers', p: 'Factorising is easy to check: expand your answer. If you get back the original expression, it is right. Do this every time — it takes ten seconds.' }
    ],
    practice: 's13'
  }
];
