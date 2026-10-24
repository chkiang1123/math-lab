/* ============================================================
   learn.js — summary notes (student-facing)
   Revision Exercise 3 · Algebraic Fractions and Formulas
   Math uses $…$ (inline) and $$…$$ (display), rendered by app.js
   Blocks:  { h, p }  heading + prose
            { h, formula }  heading + a boxed formula
            { example, type:'ex' }  worked example
   ============================================================ */

const LEARN = [
  {
    id: 'u1', title: '1. Simplifying by cancelling', icon: '✂️',
    summary: 'Factorise the top and the bottom first — cancelling terms that are not factors is the #1 mistake.',
    body: [
      { h: 'The rule', formula: '\\frac{A \\times C}{B \\times C} = \\frac{A}{B}\\quad (C \\neq 0)',
        p: 'You may only cancel a **factor** of the whole numerator against a **factor** of the whole denominator. A factor is something the whole expression is *multiplied* by.' },
      { example: '$\\dfrac{15a^6b^3}{9a^3b^4}$\nNumbers: $15 \\div 9$, HCF is 3 → $\\frac{5}{3}$\n$a$: $\\frac{a^6}{a^3} = a^{6-3} = a^3$\n$b$: $\\frac{b^3}{b^4} = \\frac{1}{b}$\nAnswer: $\\frac{5a^3}{3b}$', type: 'ex' },
      { h: 'Never do this', p: '$\\dfrac{x+2}{x+3} \\neq \\dfrac{2}{3}$ and $\\dfrac{a+b}{a} \\neq b$. Nothing is being *multiplied* there, so nothing cancels. Test it with a number: put $a=2, b=5$ and you get $\\frac{7}{2}$, not $5$.' },
      { h: 'Denominator with two terms', p: 'Take out the common factor first, then cancel:\n$\\dfrac{8xy}{4x-8xy} = \\dfrac{8xy}{4x(1-2y)} = \\dfrac{2y}{1-2y}$' },
      { h: 'The sign-flip trick', p: 'This is the move that unlocks Level 1 question 4:\n$(p-3q) = -(3q-p)$\n$\\dfrac{p^2-3pq}{15q-5p} = \\dfrac{p(p-3q)}{5(3q-p)} = \\dfrac{-p(3q-p)}{5(3q-p)} = -\\dfrac{p}{5}$\nWhenever two brackets have the **same letters in reverse order with all signs flipped**, one is minus the other.' },
      { h: 'Check yourself', p: 'Substitute a number for each letter into the question and into your answer. If they disagree, you cancelled something you were not allowed to.' }
    ],
    practice: 's1'
  },
  {
    id: 'u2', title: '2. Multiplying & dividing', icon: '✖️',
    summary: 'Turn division into multiply-by-the-flip, then cancel BEFORE you multiply.',
    body: [
      { h: 'Multiply', formula: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}',
        p: 'Top × top, bottom × bottom. But **cancel first** — it keeps the numbers small.' },
      { h: 'Divide', formula: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
        p: 'Keep – Change – Flip: keep the first fraction, change ÷ to ×, flip the second. Never flip the first one.' },
      { example: '$\\dfrac{3x-9}{7} \\div \\dfrac{xy-3y}{14xy}$\n$= \\dfrac{3(x-3)}{7} \\times \\dfrac{14xy}{y(x-3)}$\nCancel $(x-3)$ and $y$:\n$= \\dfrac{3 \\times 14x}{7} = 6x$', type: 'ex' },
      { h: 'The four-step routine', p: '① Factorise **everything** you can.\n② Turn every ÷ into × by flipping.\n③ Cancel common factors across top and bottom.\n④ Multiply out what is left.' },
      { h: 'Watch: hidden minus signs', p: '$\\dfrac{5m-5n}{10n^2} \\times \\dfrac{mn}{n-m}$\nHere $n-m = -(m-n)$, and $(m-n)$ cancels with $5(m-n)$ above, leaving a **minus**:\n$= -\\dfrac{5mn}{10n^2} = -\\dfrac{m}{2n}$\nAlways pause and ask "is this bracket the negative of that one?"' },
      { h: 'Watch: three-part chains', p: 'For $\\frac{a}{b} \\times \\frac{c}{d} \\div \\frac{e}{f}$, work **left to right**. Only the fraction directly after a ÷ gets flipped.' },
      { h: 'Watch: $q^4$ is really $\\frac{q^4}{1}$', p: 'A bare term multiplying a fraction goes on the top: $\\cdots \\times q^4 = \\cdots \\times \\frac{q^4}{1}$' }
    ],
    practice: 's2'
  },
  {
    id: 'u3', title: '3. Adding & subtracting', icon: '➕',
    summary: 'Same denominator required. Find the L.C.M., top up each fraction, then combine.',
    body: [
      { h: 'The rule', formula: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}',
        p: 'The denominator does **not** get added. Only the numerators combine, and they sit over the common denominator.' },
      { h: 'Finding the L.C.M.', p: 'When denominators share nothing, multiply them: $\\frac{3}{a+2b} - \\frac{4}{3a}$ → L.C.M. $= 3a(a+2b)$.\nWhen one divides the other, just top up: $\\frac{3h}{4(h-3k)} - \\frac{2h}{h-3k}$ → L.C.M. $= 4(h-3k)$.' },
      { example: '$\\dfrac{4}{3x+y} - \\dfrac{1}{x-y}$\nL.C.M. $= (3x+y)(x-y)$\n$= \\dfrac{4(x-y) - (3x+y)}{(3x+y)(x-y)}$\n$= \\dfrac{4x - 4y - 3x - y}{(3x+y)(x-y)}$\n$= \\dfrac{x-5y}{(3x+y)(x-y)}$', type: 'ex' },
      { h: 'Trap: the minus belongs to the WHOLE bracket', p: 'In $4(x-y) - (3x+y)$, that minus hits **both** $3x$ and $+y$. Students write $-3x+y$ and lose the mark. When in doubt, insert brackets: $-\\,(3x+y)$.' },
      { h: 'Opposite denominators', p: '$d - c = -(c-d)$ and $3-2y = -(2y-3)$. Spotting this turns a subtraction into an addition (or vice versa):\n$\\dfrac{cd}{c-d} + \\dfrac{d^2}{d-c} = \\dfrac{cd-d^2}{c-d} = \\dfrac{d(c-d)}{c-d} = d$' },
      { h: 'A whole number joining in', p: 'Write $1$ as $\\dfrac{\\text{L.C.M.}}{\\text{L.C.M.}}$:\n$\\dfrac{p}{p-q} + \\dfrac{3q}{4q-4p} - 1 = \\dfrac{4p - 3q - 4(p-q)}{4(p-q)} = \\dfrac{q}{4(p-q)}$' },
      { h: 'Perfect-square denominators', p: '$k^2 - 10k + 25 = (k-5)^2$, and $2m^2-12mn+18n^2 = 2(m-3n)^2$. Always check whether a quadratic denominator is a square before finding an L.C.M. — it saves a lot of work.' },
      { h: 'Always finish the job', p: 'After combining, factorise the new numerator and see if it cancels with the denominator. Leaving $\\frac{9}{6b}$ instead of $\\frac{3}{2b}$ loses marks.' }
    ],
    practice: 's3'
  },
  {
    id: 'u4', title: '4. Substitution', icon: '🔢',
    summary: 'Replace every letter by its number, then solve the equation that is left behind.',
    body: [
      { h: 'Straight substitution', p: 'Put the numbers in **exactly where the letter was**, keeping brackets:\n$v = u + 10t$, with $u=2, t=4$ → $v = 2 + 10(4) = 42$.\n$S = 5(r-r^2)$, with $r=4$ → $S = 5(4-16) = -60$. Note $r^2$ means $(4)^2$, **not** $(-4)^2$.' },
      { h: 'Order of operations matters', p: 'Indices first, then × and ÷ , then + and −. In $S = 2uv - \\frac{vt^2}{3}$, the $t^2$ is worked out before anything else.' },
      { h: 'When the unknown is in the denominator', p: '$x = \\dfrac{30-y}{2yz}$ with $x=-1, y=2$. Substitute, then **solve**:\n$-1 = \\dfrac{28}{4z}$ → multiply by $4z$ → $-4z = 28$ → $z = -7$.' },
      { example: '$(a+c)(b+c)(a+b) = (c-2a)(c-b)$, with $a=-1, b=2$.\nSubstitute **before** expanding:\n$(-1+c)(2+c)(1) = (c+2)(c-2)$\n$(c-1)(c+2) = (c+2)(c-2)$\nExpand: $c^2+c-2 = c^2-4$\nCancel $c^2$: $c = -2$', type: 'ex' },
      { h: 'Substituting into fractions with negative values', p: '$\\dfrac{d}{ef^2} + \\dfrac{f}{d^2e} = 1$ with $d=3, f=-2$:\n$f^2 = (-2)^2 = +4$ — the square makes it positive, but the $f$ on the top stays $-2$.\n$\\dfrac{3}{4e} - \\dfrac{2}{9e} = 1$ → L.C.M. $36e$ → $\\dfrac{27-8}{36e} = 1$ → $e = \\dfrac{19}{36}$.' },
      { h: 'Leaving answers in terms of π', p: 'If the question says "leave your answer in terms of $\\pi$", treat $\\pi$ like a letter and never multiply it out:\n$A = 3\\pi(9)^2 = 243\\pi$ cm²  ✓    not  $763.4$ cm²  ✗' },
      { h: 'Units', p: 'Match the units given in the question — cm², cm³, J, kg, $ . A number without the right unit is an incomplete answer.' }
    ],
    practice: 's4'
  },
  {
    id: 'u5', title: '5. Changing the subject', icon: '🔁',
    summary: 'Clear fractions, collect the target letter on one side, factorise it out, then divide.',
    body: [
      { h: 'What "subject" means', p: 'The subject of a formula is the letter that stands **alone on one side**. In $v = u + 10t$, the subject is $v$. Making $t$ the subject means rearranging to $t = \\frac{v-u}{10}$.' },
      { h: 'Step 1 — clear any fractions', p: 'Multiply through by the denominator.\n$\\frac{ab}{cd} = 2$ → multiply by $d$ → $\\frac{ab}{c} = 2d$ → $d = \\frac{ab}{2c}$' },
      { h: 'Step 2 — collect the target letter', p: 'Move every term containing the target letter to one side and everything else to the other side.' },
      { h: 'Step 3 — factorise it out', p: 'This is the step students skip. Once the letter appears twice, factorise:\n$ps - r(s-1) = 2(s+1)+p$\n$ps - rs + r = 2s + 2 + p$\n$ps - rs - 2s = 2 + p - r$\n$s(p-r-2) = p-r+2$ ← factorise\n$s = \\dfrac{p-r+2}{p-r-2}$' },
      { example: 'Make $S$ the subject of $T = \\dfrac{1+S}{S} - 2R$.\n$T + 2R = \\dfrac{1+S}{S}$\n$S(T+2R) = 1 + S$\n$S(T+2R) - S = 1$\n$S(T+2R-1) = 1$\n$S = \\dfrac{1}{T+2R-1}$', type: 'ex' },
      { h: 'Step 4 — tidy signs', p: 'Multiply top and bottom by $-1$ if it makes the answer cleaner.\n$m = \\dfrac{2(n+1)}{1-n} = -\\dfrac{2(n+1)}{n-1}$ — both are correct.' },
      { h: 'The target appears on both sides', p: 'In $y = \\frac{x}{1-x}$ (make $x$ the subject):\n$y(1-x) = x$ → $y - yx = x$ → $y = x + xy$ → $y = x(y+1)$ → $x = \\frac{y}{y+1}$.\nNote the trick: put the $x$-terms on the side that makes them **positive**.' },
      { h: 'Checking', p: 'Pick numbers. In $T = \\frac{1+S}{S}-2R$ with $S=\\frac{1}{T+2R-1}$: put $T=4, R=1$, so $S = \\frac{1}{5}$. Back-substitute: $\\frac{1+1/5}{1/5} - 2 = 6 - 2 = 4$ ✓. Ten seconds, catches everything.' }
    ],
    practice: 's5'
  },
  {
    id: 'u6', title: '6. Explaining & reasoning (EYA)', icon: '💭',
    summary: 'For "Do you agree? Explain your answer." — always build your answer on the formula you just found.',
    body: [
      { h: 'The three-sentence template', p: '① Write down the formula from part (a).\n② Say what the change does to each part of it.\n③ Finish with "therefore …" and answer the actual question (agree / disagree / yes / no).' },
      { example: '$n = \\dfrac{k+1}{m+2}$, where $k$ and $m$ are both positive. Is $n$ positive?\n$k > 0 \\Rightarrow k+1 > 0$\n$m > 0 \\Rightarrow m+2 > 0$\npositive ÷ positive = positive\n$\\therefore\\ n$ is positive.', type: 'ex' },
      { h: 'Worked example: does halving one thing halve another?', p: 'Mary says halving the participants halves the cost. Test it algebraically:\nOriginal: $E = 50m + 1000$\nHalved $m$: $E_{\\text{new}} = 50\\left(\\frac{m}{2}\\right) + 1000 = 25m + 1000$\nHalf of the original: $\\frac{1}{2}E = 25m + 500$\nThese are **not** equal → the claim is disagreed.\nKey insight: the fixed part ($1000$) does not halve.' },
      { h: 'Worked example: "what is the change?"', p: 'If $h = 2k-4$ and $k$ increases by 5:\n$h_{\\text{new}} = 2(k+5) - 4 = 2k + 6$\nChange $= (2k+6) - (2k-4) = 10$\n$\\therefore$ $h$ is **increased by 10**. Notice it does not depend on $k$ at all — a nice thing to comment on.' },
      { h: 'Direction arguments', p: 'For "if $y$ decreases, does $x$ decrease?":\n$x = \\dfrac{10y+1}{4}$\n$y \\downarrow \\Rightarrow 10y \\downarrow \\Rightarrow 10y+1 \\downarrow \\Rightarrow \\dfrac{10y+1}{4} \\downarrow$\nMultiplying by a **positive** number and adding keep the order. Multiplying by a **negative** number would reverse it.' },
      { h: 'Always finish with a number check', p: 'Before concluding "yes the area is greater than 500 cm²", actually compute it: $400 + 11(10) = 510$ cm². An explanation without a number is rarely a full answer.' }
    ],
    practice: 's6'
  },
  {
    id: 'u7', title: '7. Exam technique & common traps', icon: '📝',
    summary: 'The mistakes that cost the most marks — and how to dodge them.',
    body: [
      { h: 'Trap 1: cancelling terms instead of factors', p: '$\\frac{x+2}{x+3}$ cannot be simplified. Rule: if a plus or minus sign is *inside* the part you want to remove, you cannot.' },
      { h: 'Trap 2: forgetting to flip the second fraction', p: 'In $A \\div B$, only $B$ flips. Write the × step out explicitly — never do it in your head.' },
      { h: 'Trap 3: the minus sign in front of a bracket', p: '$4(x-y) - (3x+y) = 4x - 4y - 3x - y$. Every term inside gets flipped. This single slip ruins most add/subtract questions.' },
      { h: 'Trap 4: adding denominators', p: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}$, not $\\frac{2}{5}$. Same for algebra — the denominator stays put.' },
      { h: 'Trap 5: stopping one step too early', p: 'Always ask "can this be factorised further / cancelled further?" Leaving $\\frac{9}{6b}$ loses the final mark.' },
      { h: 'Trap 6: losing π', p: 'If it says "leave your answer in terms of π", using 3.14 is wrong even if the arithmetic is right.' },
      { h: 'MCQ strategy', p: 'You do not have to simplify fully. Substitute one convenient value (often 1 or 2) into the question and into each option — only the correct option matches. Much faster than full algebra.' },
      { h: 'The 10-second check', p: 'Substitute a number into both the original expression and your answer. If they match, you are almost certainly right. This is the single highest-value habit you can build.' },
      { h: 'Showing working', p: 'In this topic the working *is* the answer. Even if the final line is wrong, correct factorising and correct L.C.M. steps earn most of the marks.' }
    ],
    practice: 's7'
  }
];

if (typeof module !== 'undefined') module.exports = { LEARN };
