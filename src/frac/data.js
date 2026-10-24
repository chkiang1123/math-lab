/* =========================================================================
   data.js — Question bank
   Pearson "Junior Secondary Mathematics in Action" 2A
   Additional Revision Exercise 3 — Algebraic Fractions and Formulas
   -------------------------------------------------------------------------
   Every answer below is transcribed from the official solution PDF and has
   been cross-checked with the symbolic engine (see tools/verify_bank.js).
   -------------------------------------------------------------------------
   Question object
     id      unique key
     n       printed question number, e.g. "1", "23(a)"
     lvl     1 | 2
     fam     generator family used to build a similar question
     type    'expr'  algebraic answer  (checked symbolically)
             'num'   numeric answer
             'yn'    agree / yes-no with a model explanation
             'mcq'   multiple choice
     ctx     shared context shown above the prompt (multi-part questions)
     prompt  the thing the student must answer (LaTeX allowed)
     ans     expected answer, in engine plain syntax
     ansTex  expected answer, pretty LaTeX
     hints   progressive hints (revealed one at a time)
     steps   step-by-step solution, [{m: LaTeX, n: note}]
   ========================================================================= */

const BANK = [

/* ---------------- LEVEL 1 · Simplify (1 – 12) ---------------- */

{
  id:'q1', n:'1', lvl:1, fam:'cancel', type:'expr',
  prompt:'-\\frac{14ab}{7b^2}',
  ans:'-2a/b', ansTex:'-\\frac{2a}{b}',
  hints:[
    'Factorise the numerator and the denominator separately first.',
    '$14ab = 2\\times 7\\times a\\times b$ and $7b^2 = 7\\times b\\times b$. What do they share?',
    'Cancel the common factor $7b$.'
  ],
  steps:[
    { m:'-\\frac{14ab}{7b^2}', n:'Write the fraction.' },
    { m:'=-\\frac{2\\times 7\\times a\\times b}{7\\times b\\times b}', n:'Factorise both parts.' },
    { m:'=-\\frac{2a}{b}', n:'Cancel the common factor $7b$.' }
  ]
},
{
  id:'q2', n:'2', lvl:1, fam:'cancel', type:'expr',
  prompt:'\\frac{15a^6b^3}{9a^3b^4}',
  ans:'5a^3/(3b)', ansTex:'\\frac{5a^3}{3b}',
  hints:[
    'Deal with the numbers, then the $a$’s, then the $b$’s.',
    '$\\frac{15}{9}=\\frac{5}{3}$,  $\\frac{a^6}{a^3}=a^{6-3}$,  $\\frac{b^3}{b^4}=\\frac{1}{b^{4-3}}$.',
    'Use the law $\\frac{x^m}{x^n}=x^{m-n}$.'
  ],
  steps:[
    { m:'\\frac{15a^6b^3}{9a^3b^4}', n:'Write the fraction.' },
    { m:'=\\frac{5}{3}\\times a^{6-3}\\times \\frac{1}{b^{4-3}}', n:'Cancel number, $a$ and $b$ separately.' },
    { m:'=\\frac{5a^3}{3b}', n:'Simplify the indices.' }
  ]
},
{
  id:'q3', n:'3', lvl:1, fam:'cancel', type:'expr',
  prompt:'\\frac{8xy}{4x-8xy}',
  ans:'2y/(1-2y)', ansTex:'\\frac{2y}{1-2y}',
  hints:[
    'The denominator has two terms — take out the common factor first.',
    '$4x-8xy = 4x(1-2y)$.',
    'Now $4x$ appears on the top and the bottom.'
  ],
  steps:[
    { m:'\\frac{8xy}{4x-8xy}', n:'Write the fraction.' },
    { m:'=\\frac{8xy}{4x(1-2y)}', n:'Factorise the denominator.' },
    { m:'=\\frac{2y}{1-2y}', n:'Cancel the common factor $4x$.' }
  ]
},
{
  id:'q4', n:'4', lvl:1, fam:'cancel', type:'expr',
  prompt:'\\frac{p^2-3pq}{15q-5p}',
  ans:'-p/5', ansTex:'-\\frac{p}{5}',
  hints:[
    'Factorise the top and the bottom.',
    '$p^2-3pq = p(p-3q)$ and $15q-5p = 5(3q-p)$.',
    'Notice that $3q-p = -(p-3q)$ — flipping the sign lets you cancel.'
  ],
  steps:[
    { m:'\\frac{p^2-3pq}{15q-5p}', n:'Write the fraction.' },
    { m:'=\\frac{p(p-3q)}{5(3q-p)}', n:'Factorise both parts.' },
    { m:'=\\frac{-p(3q-p)}{5(3q-p)}', n:'Rewrite $p-3q$ as $-(3q-p)$.  ' },
    { m:'=-\\frac{p}{5}', n:'Cancel the common factor $(3q-p)$.' }
  ]
},
{
  id:'q5', n:'5', lvl:1, fam:'mulDiv', type:'expr',
  prompt:'\\frac{8f^4}{3g^3}\\times\\frac{6g^6}{4f^2}',
  ans:'4f^2g^3', ansTex:'4f^2g^3',
  hints:[
    'For multiplication, multiply the tops together and the bottoms together.',
    'Cancel before you multiply: $8$ and $4$, $6$ and $3$.',
    'Then $f^4\\div f^2 = f^2$ and $g^6\\div g^3 = g^3$.'
  ],
  steps:[
    { m:'\\frac{8f^4}{3g^3}\\times\\frac{6g^6}{4f^2}', n:'Write the product.' },
    { m:'=\\frac{8\\times 6\\times f^4\\times g^6}{3\\times 4\\times g^3\\times f^2}', n:'Combine into one fraction.' },
    { m:'=\\frac{48}{12}\\times f^{4-2}\\times g^{6-3}', n:'Group numbers, $f$’s and $g$’s.' },
    { m:'=4f^2g^3', n:'Simplify.' }
  ]
},
{
  id:'q6', n:'6', lvl:1, fam:'mulDiv', type:'expr',
  prompt:'\\frac{5m-5n}{10n^2}\\times\\frac{mn}{n-m}',
  ans:'-m/(2n)', ansTex:'-\\frac{m}{2n}',
  hints:[
    'Factorise $5m-5n$.',
    '$5m-5n = 5(m-n)$, and $n-m = -(m-n)$ — that pair will cancel.',
    'Also cancel one $n$ between $mn$ and $n^2$.'
  ],
  steps:[
    { m:'\\frac{5m-5n}{10n^2}\\times\\frac{mn}{n-m}', n:'Write the product.' },
    { m:'=\\frac{5(m-n)}{10n^2}\\times\\frac{mn}{-(m-n)}', n:'Factorise; rewrite $n-m=-(m-n)$.' },
    { m:'=-\\frac{5mn}{10n^2}', n:'Cancel $(m-n)$.' },
    { m:'=-\\frac{m}{2n}', n:'Cancel $5$ and one $n$.' }
  ]
},
{
  id:'q7', n:'7', lvl:1, fam:'mulDiv', type:'expr',
  prompt:'\\frac{3x-9}{7}\\div\\frac{xy-3y}{14xy}',
  ans:'6x', ansTex:'6x',
  hints:[
    'To divide by a fraction, multiply by its reciprocal.',
    '$\\frac{a}{b}\\div\\frac{c}{d}=\\frac{a}{b}\\times\\frac{d}{c}$.',
    'Factorise $3x-9=3(x-3)$ and $xy-3y=y(x-3)$.'
  ],
  steps:[
    { m:'\\frac{3x-9}{7}\\div\\frac{xy-3y}{14xy}', n:'Write the expression.' },
    { m:'=\\frac{3(x-3)}{7}\\times\\frac{14xy}{y(x-3)}', n:'Invert the second fraction; factorise.' },
    { m:'=\\frac{3\\times 14xy}{7y}', n:'Cancel $(x-3)$ and $y$.' },
    { m:'=6x', n:'Simplify the numbers.' }
  ]
},
{
  id:'q8', n:'8', lvl:1, fam:'mulDiv', type:'expr',
  prompt:'\\frac{6+h}{k-h}\\div\\frac{h+6}{hk-k^2}',
  ans:'-k', ansTex:'-k',
  hints:[
    'Note that $6+h$ and $h+6$ are the same thing.',
    '$hk-k^2 = k(h-k)$, and $k-h = -(h-k)$.',
    'After cancelling you are left with $-k$.'
  ],
  steps:[
    { m:'\\frac{6+h}{k-h}\\div\\frac{h+6}{hk-k^2}', n:'Write the expression.' },
    { m:'=\\frac{h+6}{k-h}\\times\\frac{k(h-k)}{h+6}', n:'Invert and multiply; factorise $hk-k^2$.' },
    { m:'=\\frac{k(h-k)}{k-h}', n:'Cancel $(h+6)$.' },
    { m:'=-k', n:'Since $k-h=-(h-k)$.' }
  ]
},
{
  id:'q9', n:'9', lvl:1, fam:'addSub', type:'expr',
  prompt:'\\frac{4}{3b}+\\frac{1}{6b}',
  ans:'3/(2b)', ansTex:'\\frac{3}{2b}',
  hints:[
    'You need a common denominator. What is the L.C.M. of $3b$ and $6b$?',
    'The L.C.M. is $6b$. Multiply the first fraction by $\\frac{2}{2}$.',
    'Then add the numerators and reduce.'
  ],
  steps:[
    { m:'\\frac{4}{3b}+\\frac{1}{6b}', n:'Write the sum.' },
    { m:'=\\frac{4\\times 2}{3b\\times 2}+\\frac{1}{6b}', n:'L.C.M. of $3b$ and $6b$ is $6b$.' },
    { m:'=\\frac{8}{6b}+\\frac{1}{6b}', n:'Same denominator.' },
    { m:'=\\frac{9}{6b}', n:'Add the numerators.' },
    { m:'=\\frac{3}{2b}', n:'Divide top and bottom by 3.' }
  ]
},
{
  id:'q10', n:'10', lvl:1, fam:'addSub', type:'expr',
  prompt:'\\frac{5k}{6h}-\\frac{3k}{4h}',
  ans:'k/(12h)', ansTex:'\\frac{k}{12h}',
  hints:[
    'L.C.M. of $6h$ and $4h$?',
    'The L.C.M. of 6 and 4 is 12, so use $12h$.',
    '$\\frac{5k}{6h}=\\frac{10k}{12h}$ and $\\frac{3k}{4h}=\\frac{9k}{12h}$.'
  ],
  steps:[
    { m:'\\frac{5k}{6h}-\\frac{3k}{4h}', n:'Write the expression.' },
    { m:'=\\frac{10k}{12h}-\\frac{9k}{12h}', n:'L.C.M. of $6h$ and $4h$ is $12h$.' },
    { m:'=\\frac{k}{12h}', n:'Subtract the numerators.' }
  ]
},
{
  id:'q11', n:'11', lvl:1, fam:'addSub', type:'expr',
  prompt:'\\frac{3h}{4(h-3k)}-\\frac{2h}{h-3k}',
  ans:'5h/(4(3k-h))', ansTex:'\\frac{5h}{4(3k-h)}',
  hints:[
    'The second denominator divides into the first one — you only need to change one fraction.',
    'Multiply $\\frac{2h}{h-3k}$ by $\\frac{4}{4}$.',
    'The top becomes $3h-8h=-5h$; then tidy the sign.'
  ],
  steps:[
    { m:'\\frac{3h}{4(h-3k)}-\\frac{2h}{h-3k}', n:'Write the expression.' },
    { m:'=\\frac{3h}{4(h-3k)}-\\frac{8h}{4(h-3k)}', n:'L.C.M. is $4(h-3k)$.' },
    { m:'=\\frac{-5h}{4(h-3k)}', n:'Subtract the numerators.' },
    { m:'=\\frac{5h}{4(3k-h)}', n:'Multiply top and bottom by $-1$.' }
  ]
},
{
  id:'q12', n:'12', lvl:1, fam:'addSub', type:'expr',
  prompt:'\\frac{9}{2y-3}+\\frac{6y}{3-2y}',
  ans:'-3', ansTex:'-3',
  hints:[
    'Look carefully: $3-2y$ is the negative of $2y-3$.',
    'Rewrite $\\frac{6y}{3-2y}=-\\frac{6y}{2y-3}$.',
    'Then subtract and factorise the numerator.'
  ],
  steps:[
    { m:'\\frac{9}{2y-3}+\\frac{6y}{3-2y}', n:'Write the expression.' },
    { m:'=\\frac{9}{2y-3}-\\frac{6y}{2y-3}', n:'Since $3-2y=-(2y-3)$.' },
    { m:'=\\frac{9-6y}{2y-3}', n:'Same denominator.' },
    { m:'=\\frac{3(3-2y)}{2y-3}', n:'Factorise the numerator.' },
    { m:'=-3', n:'Since $3-2y=-(2y-3)$.' }
  ]
},

/* ---------------- LEVEL 1 · Substitution (13 – 16) ---------------- */

{
  id:'q13', n:'13', lvl:1, fam:'subst', type:'num',
  ctx:'$v = u + 10t$',
  prompt:'Find $v$ if $u=2$ and $t=4$.',
  ans:'42', ansTex:'42',
  hints:[
    'Replace each letter by its given number.',
    '$v = 2 + 10(4)$',
    'Multiply before you add.'
  ],
  steps:[
    { m:'v = u + 10t', n:'Write the formula.' },
    { m:'v = 2 + 10(4)', n:'Substitute $u=2$ and $t=4$.' },
    { m:'v = 2 + 40', n:'Multiply first.' },
    { m:'v = 42', n:'Add.' }
  ]
},
{
  id:'q14', n:'14', lvl:1, fam:'subst', type:'num',
  ctx:'$S = 5(r-r^2)$',
  prompt:'Find $S$ if $r=4$.',
  ans:'-60', ansTex:'-60',
  hints:[
    'Work out the bracket first.',
    '$r^2 = 16$, so the bracket is $4-16$.',
    'Then multiply by 5.'
  ],
  steps:[
    { m:'S = 5(r-r^2)', n:'Write the formula.' },
    { m:'S = 5(4-4^2)', n:'Substitute $r=4$.' },
    { m:'S = 5(4-16)', n:'Work out the index first.' },
    { m:'S = 5(-12)', n:'Work out the bracket.' },
    { m:'S = -60', n:'Multiply.' }
  ]
},
{
  id:'q15', n:'15', lvl:1, fam:'subst', type:'num',
  ctx:'$x = \\dfrac{30-y}{2yz}$',
  prompt:'Find $z$ if $x=-1$ and $y=2$.',
  ans:'-7', ansTex:'-7',
  hints:[
    'Here the unknown is inside the denominator — substitute, then solve the equation.',
    '$-1 = \\dfrac{30-2}{2(2)z} = \\dfrac{28}{4z}$',
    'Multiply both sides by $4z$ to get $-4z = 28$.'
  ],
  steps:[
    { m:'x = \\frac{30-y}{2yz}', n:'Write the formula.' },
    { m:'-1 = \\frac{30-2}{2(2)z}', n:'Substitute $x=-1$ and $y=2$.' },
    { m:'-1 = \\frac{28}{4z}', n:'Simplify the fraction.' },
    { m:'-4z = 28', n:'Multiply both sides by $4z$.' },
    { m:'z = -7', n:'Divide by $-4$.' }
  ]
},
{
  id:'q16', n:'16', lvl:1, fam:'subst', type:'num',
  ctx:'$S = 2uv-\\dfrac{vt^2}{3}$',
  prompt:'Find $u$ if $S=-10$, $v=3$ and $t=4$.',
  ans:'1', ansTex:'1',
  hints:[
    'Substitute all three numbers, then solve for $u$.',
    '$-10 = 2u(3) - \\dfrac{3(4^2)}{3} = 6u - 16$',
    'Add 16 to both sides, then divide by 6.'
  ],
  steps:[
    { m:'S = 2uv-\\frac{vt^2}{3}', n:'Write the formula.' },
    { m:'-10 = 2u(3)-\\frac{3(4)^2}{3}', n:'Substitute $S=-10$, $v=3$, $t=4$.' },
    { m:'-10 = 6u-16', n:'Simplify.' },
    { m:'6 = 6u', n:'Add 16 to both sides.' },
    { m:'u = 1', n:'Divide by 6.' }
  ]
},

/* ---------------- LEVEL 1 · Change of subject (17 – 22) ---------------- */

{
  id:'q17', n:'17', lvl:1, fam:'subject', type:'expr',
  prompt:'\\frac{ab}{cd}=2 \\quad [d]',
  ans:'ab/(2c)', ansTex:'\\frac{ab}{2c}',
  hints:[
    'Get $d$ out of the denominator first: multiply both sides by $d$.',
    '$\\frac{ab}{c}=2d$',
    'Now divide both sides by 2.'
  ],
  steps:[
    { m:'\\frac{ab}{cd}=2', n:'Write the formula.' },
    { m:'\\frac{ab}{c}=2d', n:'Multiply both sides by $d$.' },
    { m:'d = \\frac{ab}{2c}', n:'Divide both sides by 2.' }
  ]
},
{
  id:'q18', n:'18', lvl:1, fam:'subject', type:'expr',
  prompt:'a = 12-6bc \\quad [b]',
  ans:'(12-a)/(6c)', ansTex:'\\frac{12-a}{6c}',
  hints:[
    'Move the term without $b$ to the other side.',
    '$6bc = 12-a$',
    'Now divide by $6c$.'
  ],
  steps:[
    { m:'a = 12-6bc', n:'Write the formula.' },
    { m:'6bc = 12-a', n:'Rearrange so the $b$-term stands alone.' },
    { m:'b = \\frac{12-a}{6c}', n:'Divide both sides by $6c$.' }
  ]
},
{
  id:'q19', n:'19', lvl:1, fam:'subject', type:'expr',
  prompt:'ab+ac = \\frac{1}{3} \\quad [a]',
  ans:'1/(3(b+c))', ansTex:'\\frac{1}{3(b+c)}',
  hints:[
    '$a$ appears in two terms — factorise it out.',
    '$a(b+c) = \\frac{1}{3}$',
    'Now divide by $(b+c)$.'
  ],
  steps:[
    { m:'ab+ac = \\frac{1}{3}', n:'Write the formula.' },
    { m:'a(b+c) = \\frac{1}{3}', n:'Factorise the left side.' },
    { m:'a = \\frac{1}{3(b+c)}', n:'Divide both sides by $(b+c)$.' }
  ]
},
{
  id:'q20', n:'20', lvl:1, fam:'subject', type:'expr',
  prompt:'2(3a-b) = 5-a \\quad [a]',
  ans:'(5+2b)/7', ansTex:'\\frac{5+2b}{7}',
  hints:[
    'Expand the bracket first.',
    '$6a-2b = 5-a$',
    'Collect the $a$-terms on one side: $7a = 5+2b$.'
  ],
  steps:[
    { m:'2(3a-b) = 5-a', n:'Write the formula.' },
    { m:'6a-2b = 5-a', n:'Expand the bracket.' },
    { m:'7a = 5+2b', n:'Collect $a$-terms on the left.' },
    { m:'a = \\frac{5+2b}{7}', n:'Divide by 7.' }
  ]
},
{
  id:'q21', n:'21', lvl:1, fam:'subject', type:'expr',
  prompt:'E = \\frac{4u}{v}-2 \\quad [v]',
  ans:'4u/(E+2)', ansTex:'\\frac{4u}{E+2}',
  hints:[
    'Move the $-2$ away from the fraction first.',
    '$E+2 = \\dfrac{4u}{v}$',
    'Now swap $v$ and $(E+2)$.'
  ],
  steps:[
    { m:'E = \\frac{4u}{v}-2', n:'Write the formula.' },
    { m:'E+2 = \\frac{4u}{v}', n:'Add 2 to both sides.' },
    { m:'v(E+2) = 4u', n:'Multiply both sides by $v$.' },
    { m:'v = \\frac{4u}{E+2}', n:'Divide by $(E+2)$.' }
  ]
},
{
  id:'q22', n:'22', lvl:1, fam:'subject', type:'expr',
  prompt:'\\frac{4}{h}+\\frac{1}{k}=5 \\quad [h]',
  ans:'4k/(5k-1)', ansTex:'\\frac{4k}{5k-1}',
  hints:[
    'Isolate the fraction containing $h$.',
    '$\\frac{4}{h}=5-\\frac{1}{k}=\\frac{5k-1}{k}$',
    'Now invert both sides.'
  ],
  steps:[
    { m:'\\frac{4}{h}+\\frac{1}{k}=5', n:'Write the formula.' },
    { m:'\\frac{4}{h}=5-\\frac{1}{k}', n:'Move $\\frac{1}{k}$ to the right.' },
    { m:'\\frac{4}{h}=\\frac{5k}{k}-\\frac{1}{k}', n:'Common denominator $k$.' },
    { m:'\\frac{4}{h}=\\frac{5k-1}{k}', n:'Subtract.' },
    { m:'h = \\frac{4k}{5k-1}', n:'Invert both sides and multiply by 4.' }
  ]
},

/* ---------------- LEVEL 1 · Word problems (23 – 27) ---------------- */

{
  id:'q23a', n:'23(a)', lvl:1, fam:'subject', type:'expr',
  ctx:'Consider the formula $x = \\dfrac{1+3y}{4}$.',
  prompt:'Make $y$ the subject of the formula.',
  ans:'(4x-1)/3', ansTex:'\\frac{4x-1}{3}',
  hints:[
    'Clear the denominator first: multiply both sides by 4.',
    '$4x = 1+3y$',
    'Now move the 1 and divide by 3.'
  ],
  steps:[
    { m:'x = \\frac{1+3y}{4}', n:'Write the formula.' },
    { m:'4x = 1+3y', n:'Multiply both sides by 4.' },
    { m:'4x-1 = 3y', n:'Subtract 1 from both sides.' },
    { m:'y = \\frac{4x-1}{3}', n:'Divide by 3.' }
  ]
},
{
  id:'q23b', n:'23(b)', lvl:1, fam:'subst', type:'num',
  ctx:'Consider the formula $x = \\dfrac{1+3y}{4}$.',
  prompt:'If $x=4$, find the value of $y$.',
  ans:'5', ansTex:'5',
  hints:[
    'Use your answer from part (a) — it is the fastest way.',
    '$y = \\dfrac{4(4)-1}{3}$',
    'Work out the top, then divide by 3.'
  ],
  steps:[
    { m:'y = \\frac{4x-1}{3}', n:'Use the result of (a).' },
    { m:'y = \\frac{4(4)-1}{3}', n:'Substitute $x=4$.' },
    { m:'y = \\frac{15}{3}', n:'Simplify the numerator.' },
    { m:'y = 5', n:'Divide.' }
  ]
},
{
  id:'q24a', n:'24(a)', lvl:1, fam:'subject', type:'expr',
  ctx:'Consider the formula $mn-k = 1-2n$.',
  prompt:'Make $n$ the subject of the formula.',
  ans:'(k+1)/(m+2)', ansTex:'\\frac{k+1}{m+2}',
  hints:[
    'Collect both $n$-terms on the left side.',
    '$mn+2n = k+1$',
    'Factorise: $n(m+2) = k+1$, then divide.'
  ],
  steps:[
    { m:'mn-k = 1-2n', n:'Write the formula.' },
    { m:'mn+2n = k+1', n:'Collect the $n$-terms on the left.' },
    { m:'n(m+2) = k+1', n:'Factorise the left side.' },
    { m:'n = \\frac{k+1}{m+2}', n:'Divide by $(m+2)$.' }
  ]
},
{
  id:'q24b', n:'24(b)', lvl:1, fam:'subject', type:'yn',
  ctx:'Consider the formula $mn-k = 1-2n$. It is known that both $k$ and $m$ are positive.',
  prompt:'Is $n$ also positive? Explain your answer.',
  ans:'yes', ansTex:'Yes',
  hints:[
    'Look at $n=\\dfrac{k+1}{m+2}$ from part (a).',
    'If $k$ is positive, what sign is $k+1$? If $m$ is positive, what sign is $m+2$?',
    'A positive number divided by a positive number is…'
  ],
  steps:[
    { m:'n = \\frac{k+1}{m+2}', n:'From part (a).' },
    { m:'k>0 \\Rightarrow k+1>0', n:'If $k$ is positive then $k+1$ is positive.' },
    { m:'m>0 \\Rightarrow m+2>0', n:'If $m$ is positive then $m+2$ is positive.' },
    { m:'n = \\frac{\\text{positive}}{\\text{positive}} > 0', n:'A positive divided by a positive is positive.' },
    { m:'\\therefore\\ n\\ \\text{is positive}', n:'Conclusion.' }
  ]
},
{
  id:'q25a', n:'25(a)', lvl:1, fam:'subject', type:'expr',
  ctx:'The income **$P$** of the driver of a tour bus is given by $P = 100n-250$, where $n$ is the number of passengers.',
  prompt:'Make $n$ the subject of the formula.',
  ans:'(P+250)/100', ansTex:'\\frac{P+250}{100}',
  hints:[
    'Move the constant to the side with $P$.',
    '$P+250 = 100n$',
    'Divide by 100.'
  ],
  steps:[
    { m:'P = 100n-250', n:'Write the formula.' },
    { m:'P+250 = 100n', n:'Add 250 to both sides.' },
    { m:'n = \\frac{P+250}{100}', n:'Divide by 100.' }
  ]
},
{
  id:'q25b', n:'25(b)', lvl:1, fam:'subst', type:'num',
  ctx:'The income **$P$** of the driver of a tour bus is given by $P = 100n-250$, where $n$ is the number of passengers.',
  prompt:'The driver has an income of **\$2750**. Find the number of passengers.',
  ans:'30', ansTex:'30',
  hints:[
    'Use the formula from part (a) with $P=2750$.',
    '$n = \\dfrac{2750+250}{100}$',
    'So $n = \\dfrac{3000}{100}$.'
  ],
  steps:[
    { m:'n = \\frac{P+250}{100}', n:'Use the result of (a).' },
    { m:'n = \\frac{2750+250}{100}', n:'Substitute $P=2750$.' },
    { m:'n = \\frac{3000}{100}', n:'Add.' },
    { m:'n = 30', n:'Divide.' },
    { m:'\\therefore\\ \\text{There are 30 passengers.}', n:'Answer in words.' }
  ]
},
{
  id:'q26a', n:'26(a)', lvl:1, fam:'subject', type:'expr',
  ctx:'The kinetic energy $E$ (in joules) of a running person of mass $m$ kg is $E = \\dfrac{mv^2}{2}$, where $v$ m/s is the speed.',
  prompt:'Make $m$ the subject of the formula.',
  ans:'2E/v^2', ansTex:'\\frac{2E}{v^2}',
  hints:[
    'Multiply both sides by 2 to clear the denominator.',
    '$2E = mv^2$',
    'Now divide by $v^2$.'
  ],
  steps:[
    { m:'E = \\frac{mv^2}{2}', n:'Write the formula.' },
    { m:'2E = mv^2', n:'Multiply both sides by 2.' },
    { m:'m = \\frac{2E}{v^2}', n:'Divide by $v^2$.' }
  ]
},
{
  id:'q26b', n:'26(b)', lvl:1, fam:'subst', type:'num',
  ctx:'The kinetic energy $E$ (in joules) of a running person of mass $m$ kg is $E = \\dfrac{mv^2}{2}$, where $v$ m/s is the speed.',
  prompt:'The kinetic energy of a man who runs at 5 m/s is 625 J. How heavy is the man?',
  ans:'50', ansTex:'50 kg',
  hints:[
    'Use $m=\\dfrac{2E}{v^2}$ with $E=625$ and $v=5$.',
    '$m = \\dfrac{2(625)}{5^2} = \\dfrac{1250}{25}$',
    'Divide to get the mass in kg.'
  ],
  steps:[
    { m:'m = \\frac{2E}{v^2}', n:'Use the result of (a).' },
    { m:'m = \\frac{2(625)}{5^2}', n:'Substitute $E=625$, $v=5$.' },
    { m:'m = \\frac{1250}{25}', n:'Simplify.' },
    { m:'m = 50', n:'Divide.' },
    { m:'\\therefore\\ \\text{The man weighs 50 kg.}', n:'Answer in words.' }
  ]
},
{
  id:'q27a', n:'27(a)', lvl:1, fam:'subst', type:'expr',
  ctx:'The total surface area $A$ cm$^2$ of a hemisphere of radius $r$ cm is $A = 3\\pi r^2$.',
  prompt:'If the radius of the hemisphere is 9 cm, find the total surface area. (Leave your answer in terms of $\\pi$.)',
  ans:'243pi', ansTex:'243\\pi\\ \\text{cm}^2',
  hints:[
    'Substitute $r=9$ into $A=3\\pi r^2$.',
    '$A = 3\\pi(9)^2 = 3\\pi(81)$',
    'Multiply the numbers and keep $\\pi$ as a symbol.'
  ],
  steps:[
    { m:'A = 3\\pi r^2', n:'Write the formula.' },
    { m:'A = 3\\pi(9)^2', n:'Substitute $r=9$.' },
    { m:'A = 3\\pi(81)', n:'Work out the index.' },
    { m:'A = 243\\pi', n:'Multiply.' },
    { m:'\\therefore\\ \\text{Surface area} = 243\\pi\\ \\text{cm}^2', n:'Answer in words.' }
  ]
},
{
  id:'q27b', n:'27(b)', lvl:1, fam:'subst', type:'expr',
  ctx:'The volume $V$ cm$^3$ of a hemisphere is $V = \\dfrac{2}{3}\\pi r^3$.',
  prompt:'If the total surface area of a hemisphere is $243\\pi$ cm$^2$, find its volume. (Leave your answer in terms of $\\pi$.)',
  ans:'486pi', ansTex:'486\\pi\\ \\text{cm}^3',
  hints:[
    'From part (a), a surface area of $243\\pi$ cm$^2$ means $r=9$.',
    'Substitute $r=9$ into $V=\\frac{2}{3}\\pi r^3$.',
    '$V = \\frac{2}{3}\\pi(729) = 2\\pi(243)$.'
  ],
  steps:[
    { m:'A=243\\pi \\Rightarrow r=9', n:'By the result of (a).' },
    { m:'V = \\frac{2}{3}\\pi r^3', n:'Write the volume formula.' },
    { m:'V = \\frac{2}{3}\\pi(9)^3', n:'Substitute $r=9$.' },
    { m:'V = \\frac{2}{3}\\pi(729)', n:'Work out the index.' },
    { m:'V = 486\\pi', n:'Multiply.' },
    { m:'\\therefore\\ \\text{Volume} = 486\\pi\\ \\text{cm}^3', n:'Answer in words.' }
  ]
},

/* ---------------- LEVEL 2 · Simplify (28 – 33) ---------------- */

{
  id:'q28', n:'28', lvl:2, fam:'cancel', type:'expr',
  prompt:'\\frac{2ab-2a+3b^2-3b}{6b+4a}',
  ans:'(b-1)/2', ansTex:'\\frac{b-1}{2}',
  hints:[
    'Four terms on top — try factorising by grouping.',
    '$2ab-2a = 2a(b-1)$ and $3b^2-3b = 3b(b-1)$.',
    'So the top is $(b-1)(2a+3b)$, and the bottom is $2(2a+3b)$.'
  ],
  steps:[
    { m:'\\frac{2ab-2a+3b^2-3b}{6b+4a}', n:'Write the fraction.' },
    { m:'=\\frac{2a(b-1)+3b(b-1)}{2(3b+2a)}', n:'Group and factorise; factorise the denominator.' },
    { m:'=\\frac{(2a+3b)(b-1)}{2(2a+3b)}', n:'Factorise the numerator by grouping.' },
    { m:'=\\frac{b-1}{2}', n:'Cancel $(2a+3b)$.' }
  ]
},
{
  id:'q29', n:'29', lvl:2, fam:'cancel', type:'expr',
  prompt:'\\frac{m^2-9n^2}{2m^2-12mn+18n^2}',
  ans:'(m+3n)/(2(m-3n))', ansTex:'\\frac{m+3n}{2(m-3n)}',
  hints:[
    'The top is a difference of two squares: $m^2-(3n)^2$.',
    'Bottom: take out 2 first, then look for a perfect square.',
    '$2(m^2-6mn+9n^2) = 2(m-3n)^2$.'
  ],
  steps:[
    { m:'\\frac{m^2-9n^2}{2m^2-12mn+18n^2}', n:'Write the fraction.' },
    { m:'=\\frac{(m+3n)(m-3n)}{2(m^2-6mn+9n^2)}', n:'Difference of squares on top; factor out 2 below.' },
    { m:'=\\frac{(m+3n)(m-3n)}{2(m-3n)^2}', n:'Perfect square in the denominator.' },
    { m:'=\\frac{m+3n}{2(m-3n)}', n:'Cancel one $(m-3n)$.' }
  ]
},
{
  id:'q30', n:'30', lvl:2, fam:'mulDiv', type:'expr',
  prompt:'\\frac{20b+12a}{-2a+b}\\times\\frac{4a-2b}{3a+5b}',
  ans:'-8', ansTex:'-8',
  hints:[
    'Factorise everything you can before multiplying.',
    '$20b+12a = 4(5b+3a)$,  $4a-2b = 2(2a-b)$,  $-2a+b = -(2a-b)$.',
    'The $(2a-b)$ and the $(3a+5b)$ both cancel.'
  ],
  steps:[
    { m:'\\frac{20b+12a}{-2a+b}\\times\\frac{4a-2b}{3a+5b}', n:'Write the product.' },
    { m:'=\\frac{4(5b+3a)}{-(2a-b)}\\times\\frac{2(2a-b)}{3a+5b}', n:'Factorise each part.' },
    { m:'=\\frac{4(3a+5b)}{-(2a-b)}\\times\\frac{2(2a-b)}{3a+5b}', n:'Note $5b+3a = 3a+5b$.' },
    { m:'=-8', n:'Cancel $(2a-b)$ and $(3a+5b)$; $4\\times 2 = 8$.' }
  ]
},
{
  id:'q31', n:'31', lvl:2, fam:'mulDiv', type:'expr',
  prompt:'\\frac{2x^2-10x}{4x+4}\\div\\frac{8x-40}{1+x}',
  ans:'x/16', ansTex:'\\frac{x}{16}',
  hints:[
    'Turn the division into multiplication by the reciprocal.',
    'Factorise: $2x^2-10x = 2x(x-5)$, $4x+4 = 4(x+1)$, $8x-40 = 8(x-5)$.',
    'Remember $1+x$ and $x+1$ are the same.'
  ],
  steps:[
    { m:'\\frac{2x^2-10x}{4x+4}\\div\\frac{8x-40}{1+x}', n:'Write the expression.' },
    { m:'=\\frac{2x(x-5)}{4(x+1)}\\times\\frac{x+1}{8(x-5)}', n:'Invert and multiply; factorise.' },
    { m:'=\\frac{2x}{4}\\times\\frac{1}{8}', n:'Cancel $(x-5)$ and $(x+1)$.' },
    { m:'=\\frac{x}{16}', n:'Simplify: $\\frac{2}{32}=\\frac{1}{16}$.' }
  ]
},
{
  id:'q32', n:'32', lvl:2, fam:'mulDiv', type:'expr',
  prompt:'\\frac{p+5q}{pq^3}\\div\\frac{-4p-20q}{12p^2}\\times q^4',
  ans:'-3pq', ansTex:'-3pq',
  hints:[
    'Do the division first (left to right).',
    '$-4p-20q = -4(p+5q)$ — this cancels with the $(p+5q)$ on top.',
    '$\\frac{q^4}{q^3} = q$ and $\\frac{12p^2}{p} = 12p$; then $\\frac{12}{-4}=-3$.'
  ],
  steps:[
    { m:'\\frac{p+5q}{pq^3}\\div\\frac{-4p-20q}{12p^2}\\times q^4', n:'Write the expression.' },
    { m:'=\\frac{p+5q}{pq^3}\\times\\frac{12p^2}{-4(p+5q)}\\times q^4', n:'Invert and multiply; factorise $-4p-20q$.' },
    { m:'=\\frac{12p^2q^4}{-4pq^3}', n:'Cancel $(p+5q)$.' },
    { m:'=-3pq', n:'Simplify: $\\frac{12}{-4}=-3$, $\\frac{p^2}{p}=p$, $\\frac{q^4}{q^3}=q$.' }
  ]
},
{
  id:'q33', n:'33', lvl:2, fam:'mulDiv', type:'expr',
  prompt:'\\frac{12m-3n}{n^2}\\times\\frac{3mn}{mn+2m}\\div\\frac{4m-n}{n+2}',
  ans:'9/n', ansTex:'\\frac{9}{n}',
  hints:[
    'Factorise $12m-3n = 3(4m-n)$ and $mn+2m = m(n+2)$.',
    'After inverting the last fraction, $(4m-n)$ and $(n+2)$ both cancel.',
    'The numbers give $3\\times 3 = 9$.'
  ],
  steps:[
    { m:'\\frac{12m-3n}{n^2}\\times\\frac{3mn}{mn+2m}\\div\\frac{4m-n}{n+2}', n:'Write the expression.' },
    { m:'=\\frac{3(4m-n)}{n^2}\\times\\frac{3mn}{m(n+2)}\\times\\frac{n+2}{4m-n}', n:'Factorise; invert the last fraction.' },
    { m:'=\\frac{3(4m-n)}{n^2}\\times\\frac{3n}{n+2}\\times\\frac{n+2}{4m-n}', n:'Cancel $m$.' },
    { m:'=\\frac{9n}{n^2}', n:'Cancel $(4m-n)$ and $(n+2)$.' },
    { m:'=\\frac{9}{n}', n:'Cancel one $n$.' }
  ]
},

/* ---------------- LEVEL 2 · Add / subtract (34 – 39) ---------------- */

{
  id:'q34', n:'34', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{cd}{c-d}+\\frac{d^2}{d-c}',
  ans:'d', ansTex:'d',
  hints:[
    'Compare the two denominators: $d-c$ is the negative of $c-d$.',
    'Rewrite $\\frac{d^2}{d-c} = -\\frac{d^2}{c-d}$.',
    'Then $\\frac{cd-d^2}{c-d} = \\frac{d(c-d)}{c-d}$.'
  ],
  steps:[
    { m:'\\frac{cd}{c-d}+\\frac{d^2}{d-c}', n:'Write the expression.' },
    { m:'=\\frac{cd}{c-d}-\\frac{d^2}{c-d}', n:'Since $d-c=-(c-d)$.' },
    { m:'=\\frac{cd-d^2}{c-d}', n:'Same denominator.' },
    { m:'=\\frac{d(c-d)}{c-d}', n:'Factorise the numerator.' },
    { m:'=d', n:'Cancel $(c-d)$.' }
  ]
},
{
  id:'q35', n:'35', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{3}{a+2b}-\\frac{4}{3a}',
  ans:'(5a-8b)/(3a(a+2b))', ansTex:'\\frac{5a-8b}{3a(a+2b)}',
  hints:[
    'The two denominators have no common factor, so the L.C.M. is their product.',
    'L.C.M. $= 3a(a+2b)$.',
    'Top: $3(3a) - 4(a+2b) = 9a-4a-8b$.'
  ],
  steps:[
    { m:'\\frac{3}{a+2b}-\\frac{4}{3a}', n:'Write the expression.' },
    { m:'=\\frac{3(3a)}{3a(a+2b)}-\\frac{4(a+2b)}{3a(a+2b)}', n:'L.C.M. is $3a(a+2b)$.' },
    { m:'=\\frac{9a-4(a+2b)}{3a(a+2b)}', n:'Combine.' },
    { m:'=\\frac{9a-4a-8b}{3a(a+2b)}', n:'Expand.' },
    { m:'=\\frac{5a-8b}{3a(a+2b)}', n:'Collect like terms.' }
  ]
},
{
  id:'q36', n:'36', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{4}{3x+y}-\\frac{1}{x-y}',
  ans:'(x-5y)/((3x+y)(x-y))', ansTex:'\\frac{x-5y}{(3x+y)(x-y)}',
  hints:[
    'L.C.M. $= (3x+y)(x-y)$.',
    'Be careful with the minus sign — it applies to the whole of $(3x+y)$.',
    'Top: $4(x-y)-(3x+y) = 4x-4y-3x-y$.'
  ],
  steps:[
    { m:'\\frac{4}{3x+y}-\\frac{1}{x-y}', n:'Write the expression.' },
    { m:'=\\frac{4(x-y)}{(3x+y)(x-y)}-\\frac{3x+y}{(3x+y)(x-y)}', n:'L.C.M. is $(3x+y)(x-y)$.' },
    { m:'=\\frac{4(x-y)-(3x+y)}{(3x+y)(x-y)}', n:'Combine.' },
    { m:'=\\frac{4x-4y-3x-y}{(3x+y)(x-y)}', n:'Expand.' },
    { m:'=\\frac{x-5y}{(3x+y)(x-y)}', n:'Collect like terms.' }
  ]
},
{
  id:'q37', n:'37', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{3y}{(y-3)^2}-\\frac{y}{3-y}',
  ans:'y^2/(y-3)^2', ansTex:'\\frac{y^2}{(y-3)^2}',
  hints:[
    'Note that $3-y = -(y-3)$, so the second term becomes $+\\frac{y}{y-3}$.',
    'The L.C.M. is $(y-3)^2$.',
    'Top: $3y + y(y-3) = 3y + y^2 - 3y = y^2$.'
  ],
  steps:[
    { m:'\\frac{3y}{(y-3)^2}-\\frac{y}{3-y}', n:'Write the expression.' },
    { m:'=\\frac{3y}{(y-3)^2}+\\frac{y}{y-3}', n:'Since $3-y=-(y-3)$.' },
    { m:'=\\frac{3y}{(y-3)^2}+\\frac{y(y-3)}{(y-3)^2}', n:'L.C.M. is $(y-3)^2$.' },
    { m:'=\\frac{3y+y^2-3y}{(y-3)^2}', n:'Expand the second numerator.' },
    { m:'=\\frac{y^2}{(y-3)^2}', n:'Collect like terms.' }
  ]
},
{
  id:'q38', n:'38', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{p}{p-q}+\\frac{3q}{4q-4p}-1',
  ans:'q/(4(p-q))', ansTex:'\\frac{q}{4(p-q)}',
  hints:[
    'Write the $1$ as $\\frac{4(p-q)}{4(p-q)}$ so it shares the common denominator.',
    'Also $4q-4p = -4(p-q)$, so the middle term is negative.',
    'Top: $4p-3q-4(p-q) = 4p-3q-4p+4q$.'
  ],
  steps:[
    { m:'\\frac{p}{p-q}+\\frac{3q}{4q-4p}-1', n:'Write the expression.' },
    { m:'=\\frac{p}{p-q}-\\frac{3q}{4(p-q)}-1', n:'Since $4q-4p=-4(p-q)$.' },
    { m:'=\\frac{4p}{4(p-q)}-\\frac{3q}{4(p-q)}-\\frac{4(p-q)}{4(p-q)}', n:'L.C.M. is $4(p-q)$.' },
    { m:'=\\frac{4p-3q-4(p-q)}{4(p-q)}', n:'Combine.' },
    { m:'=\\frac{4p-3q-4p+4q}{4(p-q)}', n:'Expand.' },
    { m:'=\\frac{q}{4(p-q)}', n:'Collect like terms.' }
  ]
},
{
  id:'q39', n:'39', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\frac{3k}{k^2-10k+25}-\\frac{2}{k-5}',
  ans:'(k+10)/(k-5)^2', ansTex:'\\frac{k+10}{(k-5)^2}',
  hints:[
    'Is $k^2-10k+25$ a perfect square?',
    'Yes: $k^2-10k+25 = (k-5)^2$. So the L.C.M. is $(k-5)^2$.',
    'Top: $3k - 2(k-5) = 3k-2k+10$.'
  ],
  steps:[
    { m:'\\frac{3k}{k^2-10k+25}-\\frac{2}{k-5}', n:'Write the expression.' },
    { m:'=\\frac{3k}{(k-5)^2}-\\frac{2}{k-5}', n:'Factorise the first denominator.' },
    { m:'=\\frac{3k}{(k-5)^2}-\\frac{2(k-5)}{(k-5)^2}', n:'L.C.M. is $(k-5)^2$.' },
    { m:'=\\frac{3k-2(k-5)}{(k-5)^2}', n:'Combine.' },
    { m:'=\\frac{3k-2k+10}{(k-5)^2}', n:'Expand.' },
    { m:'=\\frac{k+10}{(k-5)^2}', n:'Collect like terms.' }
  ]
},

/* ---------------- LEVEL 2 · Substitution (40 – 41) ---------------- */

{
  id:'q40', n:'40', lvl:2, fam:'subst', type:'num',
  ctx:'$(a+c)(b+c)(a+b) = (c-2a)(c-b)$',
  prompt:'Find $c$ if $a=-1$ and $b=2$.',
  ans:'-2', ansTex:'-2',
  hints:[
    'Substitute $a=-1$ and $b=2$ into both sides before expanding.',
    'Left: $(-1+c)(2+c)(-1+2) = (c-1)(c+2)$.',
    'Right: $(c+2)(c-2)$. So $(c-1)(c+2) = (c+2)(c-2)$ — now divide by $(c+2)$.'
  ],
  steps:[
    { m:'(a+c)(b+c)(a+b)=(c-2a)(c-b)', n:'Write the formula.' },
    { m:'(-1+c)(2+c)(-1+2)=[c-2(-1)](c-2)', n:'Substitute $a=-1$, $b=2$.' },
    { m:'(c-1)(c+2)(1)=(c+2)(c-2)', n:'Simplify the brackets.' },
    { m:'(c-1)(c+2)=(c+2)(c-2)', n:'Since $\\times 1$ does nothing.' },
    { m:'c-1=c-2+? \\Rightarrow c^2+c-2=c^2-4', n:'Expand both sides.' },
    { m:'c = -2', n:'Cancel $c^2$: $c-2=-4$, so $c=-2$.' }
  ]
},
{
  id:'q41', n:'41', lvl:2, fam:'subst', type:'num',
  ctx:'$\\dfrac{d}{ef^2}+\\dfrac{f}{d^2e} = 1$',
  prompt:'Find $e$ if $d=3$ and $f=-2$.',
  ans:'19/36', ansTex:'\\frac{19}{36}',
  hints:[
    'Substitute first, then solve the equation in $e$.',
    '$\\frac{3}{e(-2)^2} + \\frac{-2}{(3)^2 e} = \\frac{3}{4e} - \\frac{2}{9e}$',
    'Common denominator $36e$: $\\frac{27}{36e}-\\frac{8}{36e}=\\frac{19}{36e}=1$.'
  ],
  steps:[
    { m:'\\frac{d}{ef^2}+\\frac{f}{d^2e}=1', n:'Write the formula.' },
    { m:'\\frac{3}{e(-2)^2}+\\frac{-2}{(3)^2e}=1', n:'Substitute $d=3$, $f=-2$.' },
    { m:'\\frac{3}{4e}-\\frac{2}{9e}=1', n:'Work out the indices.' },
    { m:'\\frac{27}{36e}-\\frac{8}{36e}=1', n:'L.C.M. of $4e$ and $9e$ is $36e$.' },
    { m:'\\frac{19}{36e}=1', n:'Subtract.' },
    { m:'e = \\frac{19}{36}', n:'Multiply by $36e$, then divide by 36.' }
  ]
},

/* ---------------- LEVEL 2 · Change of subject (42 – 47) ---------------- */

{
  id:'q42', n:'42', lvl:2, fam:'subject', type:'expr',
  prompt:'y = \\frac{x}{1-x} \\quad [x]',
  ans:'y/(y+1)', ansTex:'\\frac{y}{y+1}',
  hints:[
    'Multiply both sides by $(1-x)$ to clear the fraction.',
    '$y-yx = x$',
    'Collect the $x$-terms: $y = x(y+1)$.'
  ],
  steps:[
    { m:'y = \\frac{x}{1-x}', n:'Write the formula.' },
    { m:'y(1-x) = x', n:'Multiply by $(1-x)$.' },
    { m:'y-yx = x', n:'Expand.' },
    { m:'y = x+xy', n:'Move the $x$-terms to one side.' },
    { m:'y = x(y+1)', n:'Factorise.' },
    { m:'x = \\frac{y}{y+1}', n:'Divide by $(y+1)$.' }
  ]
},
{
  id:'q43', n:'43', lvl:2, fam:'subject', type:'expr',
  prompt:'\\frac{m-2}{m+2} = n \\quad [m]',
  ans:'-2(n+1)/(n-1)', ansTex:'-\\frac{2(n+1)}{n-1}',
  hints:[
    'Multiply both sides by $(m+2)$ first.',
    '$m-2 = n(m+2) = mn+2n$',
    'Collect $m$-terms on the left and factorise.'
  ],
  steps:[
    { m:'\\frac{m-2}{m+2} = n', n:'Write the formula.' },
    { m:'m-2 = n(m+2)', n:'Multiply by $(m+2)$.' },
    { m:'m-2 = mn+2n', n:'Expand.' },
    { m:'m-mn = 2n+2', n:'Collect $m$-terms on the left.' },
    { m:'m(1-n) = 2(n+1)', n:'Factorise both sides.' },
    { m:'m = \\frac{2(n+1)}{1-n} = -\\frac{2(n+1)}{n-1}', n:'Divide by $(1-n)$.' }
  ]
},
{
  id:'q44', n:'44', lvl:2, fam:'subject', type:'expr',
  prompt:'T = \\frac{1+S}{S}-2R \\quad [S]',
  ans:'1/(T+2R-1)', ansTex:'\\frac{1}{T+2R-1}',
  hints:[
    'Isolate the fraction: $T+2R = \\frac{1+S}{S}$.',
    'Multiply by $S$: $S(T+2R) = 1+S$.',
    'Now collect the $S$-terms and factorise.'
  ],
  steps:[
    { m:'T = \\frac{1+S}{S}-2R', n:'Write the formula.' },
    { m:'T+2R = \\frac{1+S}{S}', n:'Add $2R$ to both sides.' },
    { m:'S(T+2R) = 1+S', n:'Multiply by $S$.' },
    { m:'S(T+2R)-S = 1', n:'Collect $S$-terms on the left.' },
    { m:'S(T+2R-1) = 1', n:'Factorise.' },
    { m:'S = \\frac{1}{T+2R-1}', n:'Divide by $(T+2R-1)$.' }
  ]
},
{
  id:'q45', n:'45', lvl:2, fam:'subject', type:'expr',
  prompt:'ps-r(s-1) = 2(s+1)+p \\quad [s]',
  ans:'(p-r+2)/(p-r-2)', ansTex:'\\frac{p-r+2}{p-r-2}',
  hints:[
    'Expand both brackets first.',
    '$ps-rs+r = 2s+2+p$',
    'Collect the $s$-terms on the left, everything else on the right.'
  ],
  steps:[
    { m:'ps-r(s-1) = 2(s+1)+p', n:'Write the formula.' },
    { m:'ps-rs+r = 2s+2+p', n:'Expand the brackets.' },
    { m:'ps-rs-2s = 2+p-r', n:'Collect $s$-terms on the left.' },
    { m:'s(p-r-2) = p-r+2', n:'Factorise.' },
    { m:'s = \\frac{p-r+2}{p-r-2}', n:'Divide by $(p-r-2)$.' }
  ]
},
{
  id:'q46', n:'46', lvl:2, fam:'subject', type:'expr',
  prompt:'\\frac{g-b}{b}-\\frac{f}{a} = -\\frac{2}{a} \\quad [b]',
  ans:'ag/(a+f-2)', ansTex:'\\frac{ag}{a+f-2}',
  hints:[
    'Clear the denominators by multiplying by $ab$.',
    '$a(g-b)-bf = -2b$',
    'Collect the $b$-terms and factorise.'
  ],
  steps:[
    { m:'\\frac{g-b}{b}-\\frac{f}{a} = -\\frac{2}{a}', n:'Write the formula.' },
    { m:'a(g-b)-bf = -2b', n:'Multiply both sides by $ab$.' },
    { m:'ag-ab-bf = -2b', n:'Expand.' },
    { m:'ag = ab+bf-2b', n:'Collect $b$-terms on the right.' },
    { m:'ag = b(a+f-2)', n:'Factorise.' },
    { m:'b = \\frac{ag}{a+f-2}', n:'Divide by $(a+f-2)$.' }
  ]
},
{
  id:'q47', n:'47', lvl:2, fam:'subject', type:'expr',
  prompt:'\\frac{3u}{2v} = \\frac{2u-v}{5v}-2 \\quad [v]',
  ans:'-u/2', ansTex:'-\\frac{u}{2}',
  hints:[
    'Clear the denominators by multiplying everything by $10v$.',
    '$15u = 2(2u-v)-20v$',
    'Expand, collect the $v$-terms, then divide.'
  ],
  steps:[
    { m:'\\frac{3u}{2v} = \\frac{2u-v}{5v}-2', n:'Write the formula.' },
    { m:'15u = 2(2u-v)-20v', n:'Multiply both sides by $10v$.' },
    { m:'15u = 4u-2v-20v', n:'Expand.' },
    { m:'15u-4u = -22v', n:'Collect terms.' },
    { m:'11u = -22v', n:'Simplify.' },
    { m:'v = -\\frac{u}{2}', n:'Divide by $-22$.' }
  ]
},

/* ---------------- LEVEL 2 · Word problems (48 – 53) ---------------- */

{
  id:'q48a', n:'48(a)', lvl:2, fam:'subject', type:'expr',
  ctx:'Consider the formula $3 = \\dfrac{h+6}{k}+\\dfrac{h}{2k}$.',
  prompt:'Make $h$ the subject of the formula.',
  ans:'2k-4', ansTex:'2k-4',
  hints:[
    'Put the two fractions over the common denominator $2k$.',
    '$3 = \\dfrac{2(h+6)+h}{2k} = \\dfrac{3h+12}{2k}$',
    'Multiply by $2k$: $6k = 3h+12$, then divide by 3.'
  ],
  steps:[
    { m:'3 = \\frac{h+6}{k}+\\frac{h}{2k}', n:'Write the formula.' },
    { m:'3 = \\frac{2(h+6)}{2k}+\\frac{h}{2k}', n:'L.C.M. is $2k$.' },
    { m:'3 = \\frac{2h+12+h}{2k}', n:'Expand.' },
    { m:'3 = \\frac{3h+12}{2k}', n:'Collect like terms.' },
    { m:'6k = 3h+12', n:'Multiply by $2k$.' },
    { m:'6k = 3(h+4)', n:'Factorise.' },
    { m:'2k = h+4', n:'Divide by 3.' },
    { m:'h = 2k-4', n:'Subtract 4.' }
  ]
},
{
  id:'q48b', n:'48(b)', lvl:2, fam:'subject', type:'num',
  ctx:'Consider the formula $3 = \\dfrac{h+6}{k}+\\dfrac{h}{2k}$, so $h = 2k-4$.',
  prompt:'If the value of $k$ is increased by 5, write down the change in the value of $h$.',
  ans:'10', ansTex:'\\text{Increased by }10',
  hints:[
    'Work out the new $h$ when $k$ becomes $k+5$.',
    'New $h = 2(k+5)-4$.',
    'Compare it with the old value $2k-4$.'
  ],
  steps:[
    { m:'h = 2k-4', n:'From part (a).' },
    { m:'h_{\\text{new}} = 2(k+5)-4', n:'Replace $k$ by $k+5$.' },
    { m:'h_{\\text{new}} = 2k+10-4', n:'Expand.' },
    { m:'\\text{Change} = (2k+10-4)-(2k-4)', n:'New minus old.' },
    { m:'\\text{Change} = 10', n:'Simplify.' },
    { m:'\\therefore\\ h\\ \\text{is increased by }10', n:'Conclusion.' }
  ]
},
{
  id:'q49a', n:'49(a)', lvl:2, fam:'subject', type:'expr',
  ctx:'Consider the formula $6(x-2y)-1 = 2(x-y)$.',
  prompt:'Make $x$ the subject of the formula.',
  ans:'(10y+1)/4', ansTex:'\\frac{10y+1}{4}',
  hints:[
    'Expand both brackets first.',
    '$6x-12y-1 = 2x-2y$',
    'Collect the $x$-terms on the left.'
  ],
  steps:[
    { m:'6(x-2y)-1 = 2(x-y)', n:'Write the formula.' },
    { m:'6x-12y-1 = 2x-2y', n:'Expand the brackets.' },
    { m:'6x-2x = 12y-2y+1', n:'Collect $x$-terms on the left.' },
    { m:'4x = 10y+1', n:'Simplify.' },
    { m:'x = \\frac{10y+1}{4}', n:'Divide by 4.' }
  ]
},
{
  id:'q49b', n:'49(b)', lvl:2, fam:'subject', type:'yn',
  ctx:'Consider the formula $6(x-2y)-1 = 2(x-y)$, so $x = \\dfrac{10y+1}{4}$. Chris claims that if the value of $y$ decreases, then the value of $x$ will also decrease.',
  prompt:'Do you agree with Chris? Explain your answer.',
  ans:'yes', ansTex:'Yes, agree',
  hints:[
    'Look at $x = \\dfrac{10y+1}{4}$. What happens to $10y+1$ when $y$ gets smaller?',
    'If $y$ decreases, $10y$ decreases, so $10y+1$ decreases.',
    'Dividing a smaller number by 4 still gives a smaller number.'
  ],
  steps:[
    { m:'x = \\frac{10y+1}{4}', n:'From part (a).' },
    { m:'y\\downarrow \\Rightarrow 10y\\downarrow', n:'If $y$ decreases, $10y$ decreases.' },
    { m:'10y\\downarrow \\Rightarrow 10y+1\\downarrow', n:'Adding 1 keeps the order.' },
    { m:'\\frac{10y+1}{4}\\downarrow', n:'Dividing by 4 keeps the order.' },
    { m:'\\therefore\\ x\\ \\text{decreases; Chris’s claim is agreed.}', n:'Conclusion.' }
  ]
},
{
  id:'q50a', n:'50(a)', lvl:2, fam:'addSub', type:'expr',
  prompt:'\\text{Simplify } 5x\\left(\\frac{1}{x}-\\frac{1}{x-5}\\right).',
  ans:'25/(5-x)', ansTex:'\\frac{25}{5-x}',
  hints:[
    'Do the bracket first — the L.C.M. is $x(x-5)$.',
    '$\\frac{1}{x}-\\frac{1}{x-5} = \\frac{(x-5)-x}{x(x-5)} = \\frac{-5}{x(x-5)}$',
    'Then multiply by $5x$ and cancel the $x$.'
  ],
  steps:[
    { m:'5x\\left(\\frac{1}{x}-\\frac{1}{x-5}\\right)', n:'Write the expression.' },
    { m:'=5x\\left[\\frac{x-5}{x(x-5)}-\\frac{x}{x(x-5)}\\right]', n:'L.C.M. is $x(x-5)$.' },
    { m:'=5x\\left[\\frac{x-5-x}{x(x-5)}\\right]', n:'Combine.' },
    { m:'=5x\\left[\\frac{-5}{x(x-5)}\\right]', n:'Simplify the numerator.' },
    { m:'=\\frac{-25}{x-5}', n:'Cancel $x$.' },
    { m:'=\\frac{25}{5-x}', n:'Multiply top and bottom by $-1$.' }
  ]
},
{
  id:'q50bi', n:'50(b)(i)', lvl:2, fam:'subject', type:'expr',
  ctx:'Consider the formula $y = 5x\\left(\\dfrac{1}{x}-\\dfrac{1}{x-5}\\right)$.',
  prompt:'Using the result of (a), make $x$ the subject of the formula.',
  ans:'(5y-25)/y', ansTex:'\\frac{5y-25}{y}',
  hints:[
    'From (a), the right-hand side simplifies to $\\frac{25}{5-x}$.',
    'So $y = \\frac{25}{5-x}$. Multiply by $(5-x)$.',
    'Then collect the $x$-terms.'
  ],
  steps:[
    { m:'y = 5x\\left(\\frac{1}{x}-\\frac{1}{x-5}\\right)', n:'Write the formula.' },
    { m:'y = \\frac{25}{5-x}', n:'Use the result of (a).' },
    { m:'y(5-x) = 25', n:'Multiply by $(5-x)$.' },
    { m:'5y-xy = 25', n:'Expand.' },
    { m:'5y-25 = xy', n:'Collect the $x$-term.' },
    { m:'x = \\frac{5y-25}{y}', n:'Divide by $y$.' }
  ]
},
{
  id:'q50bii', n:'50(b)(ii)', lvl:2, fam:'subst', type:'num',
  ctx:'Consider the formula $y = 5x\\left(\\dfrac{1}{x}-\\dfrac{1}{x-5}\\right)$, so $x = \\dfrac{5y-25}{y}$.',
  prompt:'If $y=-1$, find the value of $x$.',
  ans:'30', ansTex:'30',
  hints:[
    'Substitute $y=-1$ into $x = \\dfrac{5y-25}{y}$.',
    '$x = \\dfrac{5(-1)-25}{-1} = \\dfrac{-30}{-1}$',
    'A negative divided by a negative is positive.'
  ],
  steps:[
    { m:'x = \\frac{5y-25}{y}', n:'From part (b)(i).' },
    { m:'x = \\frac{5(-1)-25}{-1}', n:'Substitute $y=-1$.' },
    { m:'x = \\frac{-5-25}{-1}', n:'Multiply.' },
    { m:'x = \\frac{-30}{-1}', n:'Add.' },
    { m:'x = 30', n:'Divide.' }
  ]
},
{
  id:'q51a', n:'51(a)', lvl:2, fam:'subject', type:'expr',
  ctx:'When a metal block of $m$ kg is heated from $t^\\circ$C to $T^\\circ$C, its internal energy increases by $E$ J, where $E = mc(T-t)$ and $c$ is a constant.',
  prompt:'Make $c$ the subject of the formula.',
  ans:'E/(m(T-t))', ansTex:'\\frac{E}{m(T-t)}',
  hints:[
    '$c$ is multiplied by $m$ and by $(T-t)$.',
    'Undo both by dividing.',
    'So $c = \\dfrac{E}{m(T-t)}$.'
  ],
  steps:[
    { m:'E = mc(T-t)', n:'Write the formula.' },
    { m:'c = \\frac{E}{m(T-t)}', n:'Divide both sides by $m(T-t)$.' }
  ]
},
{
  id:'q51bi', n:'51(b)(i)', lvl:2, fam:'subst', type:'num',
  ctx:'When a metal block of $m$ kg is heated from $t^\\circ$C to $T^\\circ$C, its internal energy increases by $E$ J, where $E = mc(T-t)$ and $c$ is a constant.',
  prompt:'A 2 kg block has its temperature increased by $200^\\circ$C and its internal energy increases by 360 000 J. Find the value of $c$.',
  ans:'900', ansTex:'900',
  hints:[
    'Here $m=2$, $T-t=200$ and $E=360\\,000$.',
    'Use $c = \\dfrac{E}{m(T-t)}$.',
    '$c = \\dfrac{360000}{2(200)} = \\dfrac{360000}{400}$.'
  ],
  steps:[
    { m:'c = \\frac{E}{m(T-t)}', n:'Use the result of (a).' },
    { m:'c = \\frac{360000}{2(200)}', n:'Substitute $E=360000$, $m=2$, $T-t=200$.' },
    { m:'c = \\frac{360000}{400}', n:'Multiply in the denominator.' },
    { m:'c = 900', n:'Divide.' }
  ]
},
{
  id:'q51bii', n:'51(b)(ii)', lvl:2, fam:'subst', type:'num',
  ctx:'When a metal block of $m$ kg is heated from $t^\\circ$C to $T^\\circ$C, its internal energy increases by $E$ J, where $E = mc(T-t)$ and $c$ is a constant.',
  prompt:'The 2 kg block is heated a further $150^\\circ$C. Find the overall increase in its internal energy.',
  ans:'630000', ansTex:'630\\,000\\ \\text{J}',
  hints:[
    'The total temperature rise is now $200+150 = 350^\\circ$C.',
    'Use $E = mc(T-t)$ with $m=2$, $c=900$ and $T-t=350$.',
    '$E = 2(900)(350)$.'
  ],
  steps:[
    { m:'T-t = 200+150 = 350', n:'Total temperature increase.' },
    { m:'E = mc(T-t)', n:'Write the formula.' },
    { m:'E = 2(900)(350)', n:'Substitute $m=2$, $c=900$, $T-t=350$.' },
    { m:'E = 630000', n:'Multiply.' },
    { m:'\\therefore\\ \\text{Increase} = 630000\\ \\text{J}', n:'Answer in words.' }
  ]
},
{
  id:'q52ai', n:'52(a)(i)', lvl:2, fam:'subject', type:'expr',
  ctx:'A sheet of paper with area $(400+11x)$ cm$^2$ is cut evenly into $(x+7)$ pieces, where $x$ is an integer. Denote the area of each small piece by $A$ cm$^2$.',
  prompt:'Express $A$ in terms of $x$.',
  ans:'(400+11x)/(x+7)', ansTex:'\\frac{400+11x}{x+7}',
  hints:[
    'Each small piece has the same area, so divide the total area by the number of pieces.',
    'Number of pieces $= x+7$.',
    'So $A = \\dfrac{400+11x}{x+7}$.'
  ],
  steps:[
    { m:'A = \\frac{\\text{total area}}{\\text{number of pieces}}', n:'Each piece is equal.' },
    { m:'A = \\frac{400+11x}{x+7}', n:'Substitute the given expressions.' }
  ]
},
{
  id:'q52aii', n:'52(a)(ii)', lvl:2, fam:'subject', type:'expr',
  ctx:'A sheet of paper with area $(400+11x)$ cm$^2$ is cut evenly into $(x+7)$ pieces. Denote the area of each small piece by $A$ cm$^2$, so $A = \\dfrac{400+11x}{x+7}$.',
  prompt:'Make $x$ the subject of the formula.',
  ans:'(400-7A)/(A-11)', ansTex:'\\frac{400-7A}{A-11}',
  hints:[
    'Multiply both sides by $(x+7)$ first.',
    '$A(x+7) = 400+11x \\Rightarrow Ax+7A = 400+11x$',
    'Collect the $x$-terms on one side, then factorise.'
  ],
  steps:[
    { m:'A = \\frac{400+11x}{x+7}', n:'From part (a)(i).' },
    { m:'A(x+7) = 400+11x', n:'Multiply by $(x+7)$.' },
    { m:'Ax+7A = 400+11x', n:'Expand.' },
    { m:'Ax-11x = 400-7A', n:'Collect $x$-terms on the left.' },
    { m:'x(A-11) = 400-7A', n:'Factorise.' },
    { m:'x = \\frac{400-7A}{A-11}', n:'Divide by $(A-11)$.' }
  ]
},
{
  id:'q52bi', n:'52(b)(i)', lvl:2, fam:'subst', type:'num',
  ctx:'A sheet of paper with area $(400+11x)$ cm$^2$ is cut evenly into $(x+7)$ pieces. The area of each small piece is $A$ cm$^2$.',
  prompt:'The area of each small piece is 30 cm$^2$. Find the value of $x$.',
  ans:'10', ansTex:'10',
  hints:[
    'Use $x = \\dfrac{400-7A}{A-11}$ from (a)(ii) with $A=30$.',
    '$x = \\dfrac{400-7(30)}{30-11} = \\dfrac{400-210}{19}$',
    'So $x = \\dfrac{190}{19}$.'
  ],
  steps:[
    { m:'x = \\frac{400-7A}{A-11}', n:'Use the result of (a)(ii).' },
    { m:'x = \\frac{400-7(30)}{30-11}', n:'Substitute $A=30$.' },
    { m:'x = \\frac{400-210}{19}', n:'Simplify.' },
    { m:'x = \\frac{190}{19}', n:'Subtract.' },
    { m:'x = 10', n:'Divide.' }
  ]
},
{
  id:'q52bii', n:'52(b)(ii)', lvl:2, fam:'subst', type:'yn',
  ctx:'A sheet of paper with area $(400+11x)$ cm$^2$ is cut evenly into $(x+7)$ pieces. The area of each small piece is 30 cm$^2$, so $x=10$.',
  prompt:'Is the area of the original sheet of paper greater than 500 cm$^2$? Explain your answer.',
  ans:'yes', ansTex:'Yes',
  hints:[
    'Work out the total area using $x=10$.',
    'Total area $= 400 + 11(10)$.',
    'Compare the result with 500.'
  ],
  steps:[
    { m:'\\text{Area} = 400+11x', n:'Total area of the sheet.' },
    { m:'\\text{Area} = 400+11(10)', n:'Substitute $x=10$.' },
    { m:'\\text{Area} = 400+110', n:'Multiply.' },
    { m:'\\text{Area} = 510\\ \\text{cm}^2', n:'Add.' },
    { m:'510 > 500', n:'Compare.' },
    { m:'\\therefore\\ \\text{Yes, it is greater than 500 cm}^2', n:'Conclusion.' }
  ]
},
{
  id:'q53a', n:'53(a)', lvl:2, fam:'subst', type:'num',
  ctx:'The total expenditure $E$ for holding a party with $m$ participants is $E = 50m+200k$, where $k$ is a constant. The total expenditure for 10 participants is **\$1500**.',
  prompt:'Find the value of $k$.',
  ans:'5', ansTex:'5',
  hints:[
    'Substitute $m=10$ and $E=1500$.',
    '$1500 = 50(10) + 200k$',
    'Work out $50(10)=500$, then solve for $k$.'
  ],
  steps:[
    { m:'E = 50m+200k', n:'Write the formula.' },
    { m:'1500 = 50(10)+200k', n:'Substitute $E=1500$, $m=10$.' },
    { m:'1500 = 500+200k', n:'Multiply.' },
    { m:'1000 = 200k', n:'Subtract 500.' },
    { m:'k = 5', n:'Divide by 200.' }
  ]
},
{
  id:'q53bi', n:'53(b)(i)', lvl:2, fam:'subject', type:'expr',
  ctx:'The total expenditure $E$ for holding a party with $m$ participants is $E = 50m+200k$, where $k=5$.',
  prompt:'Make $m$ the subject of the formula.',
  ans:'(E-1000)/50', ansTex:'\\frac{E-1000}{50}',
  hints:[
    'First put in $k=5$, so $E = 50m+1000$.',
    'Subtract 1000 from both sides.',
    'Then divide by 50.'
  ],
  steps:[
    { m:'E = 50m+200k', n:'Write the formula.' },
    { m:'E = 50m+200(5)', n:'Substitute $k=5$.' },
    { m:'E = 50m+1000', n:'Multiply.' },
    { m:'E-1000 = 50m', n:'Subtract 1000.' },
    { m:'m = \\frac{E-1000}{50}', n:'Divide by 50.' }
  ]
},
{
  id:'q53bii', n:'53(b)(ii)', lvl:2, fam:'subject', type:'yn',
  ctx:'The total expenditure $E$ for holding a party with $m$ participants is $E = 50m+1000$. Mary claims that the total expenditure will be halved if the number of participants is halved.',
  prompt:'Do you agree with Mary? Explain your answer.',
  ans:'no', ansTex:'No, disagree',
  hints:[
    'Halving the participants means replacing $m$ by $\\frac{m}{2}$.',
    'New expenditure $= 50\\left(\\frac{m}{2}\\right)+1000 = 25m+1000$.',
    'Half of the old expenditure is $\\frac{1}{2}(50m+1000) = 25m+500$. Are they the same?'
  ],
  steps:[
    { m:'E = 50m+1000', n:'Original expenditure for $m$ participants.' },
    { m:'E_{\\text{new}} = 50\\left(\\frac{m}{2}\\right)+1000', n:'Halve the number of participants.' },
    { m:'E_{\\text{new}} = 25m+1000', n:'Simplify.' },
    { m:'\\frac{1}{2}E = \\frac{1}{2}(50m+1000) = 25m+500', n:'Half of the original expenditure.' },
    { m:'25m+1000 \\neq 25m+500', n:'Compare.' },
    { m:'\\therefore\\ \\text{The expenditure will not be halved; Mary’s claim is disagreed.}', n:'Conclusion.' }
  ]
},

/* ---------------- Multiple Choice Questions ---------------- */

{
  id:'m1', n:'MC1', lvl:1, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{6r^6}{2r^2s^2} =',
  opts:['\\frac{3}{r^4s^2}','3r^4s^2','\\frac{3r^4}{s^2}','\\frac{r^4}{3s^2}'],
  ans:'2', ansTex:'C',
  hints:[
    'Simplify the numbers, then $r^6 \\div r^2$.',
    '$\\frac{6}{2}=3$ and $\\frac{r^6}{r^2}=r^4$.',
    'The $s^2$ stays in the denominator.'
  ],
  steps:[
    { m:'\\frac{6r^6}{2r^2s^2}', n:'Write the fraction.' },
    { m:'=\\frac{3r^{6-2}}{s^2}', n:'Cancel 2 and $r^2$.' },
    { m:'=\\frac{3r^4}{s^2}', n:'Simplify the index.' },
    { m:'\\therefore\\ \\text{Answer: C}', n:'Match with the options.' }
  ]
},
{
  id:'m2', n:'MC2', lvl:1, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{18x^2}{18x^2-12xy} =',
  opts:['\\frac{1}{3x-2y}','\\frac{3x}{3x-2y}','\\frac{3x}{2x-3y}','\\frac{1}{1-12xy}'],
  ans:'1', ansTex:'B',
  hints:[
    'Factorise the denominator first.',
    '$18x^2-12xy = 6x(3x-2y)$.',
    'Then cancel $6x$.'
  ],
  steps:[
    { m:'\\frac{18x^2}{18x^2-12xy}', n:'Write the fraction.' },
    { m:'=\\frac{18x^2}{6x(3x-2y)}', n:'Factorise the denominator.' },
    { m:'=\\frac{3x}{3x-2y}', n:'Cancel $6x$.' },
    { m:'\\therefore\\ \\text{Answer: B}', n:'Match with the options.' }
  ]
},
{
  id:'m3', n:'MC3', lvl:1, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{3y}{xy-x^2}\\div\\frac{xy}{3x-3y} =',
  opts:['-\\frac{(x-y)^2}{x^2}','-\\frac{x^2}{(x-y)^2}','-\\frac{1}{9}x^2y','-\\frac{9}{x^2}'],
  ans:'3', ansTex:'D',
  hints:[
    'Invert and multiply, then factorise.',
    '$xy-x^2 = x(y-x)$ and $3x-3y = 3(x-y)$.',
    'Note that $y-x = -(x-y)$ — that gives the minus sign.'
  ],
  steps:[
    { m:'\\frac{3y}{xy-x^2}\\div\\frac{xy}{3x-3y}', n:'Write the expression.' },
    { m:'=\\frac{3y}{x(y-x)}\\times\\frac{3(x-y)}{xy}', n:'Invert and multiply; factorise.' },
    { m:'=\\frac{3y}{-x(x-y)}\\times\\frac{3(x-y)}{xy}', n:'Since $y-x=-(x-y)$.' },
    { m:'=-\\frac{9y}{x^2y}', n:'Cancel $(x-y)$.' },
    { m:'=-\\frac{9}{x^2}', n:'Cancel $y$.' },
    { m:'\\therefore\\ \\text{Answer: D}', n:'Match with the options.' }
  ]
},
{
  id:'m4', n:'MC4', lvl:1, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{2x-2y}{x}\\times\\frac{x^3}{x-y}\\div\\frac{4x^2}{y} =',
  opts:['\\frac{y}{2}','2y','\\frac{8x^4}{y}','\\frac{1}{2y}'],
  ans:'0', ansTex:'A',
  hints:[
    'Factorise $2x-2y = 2(x-y)$.',
    'Invert the last fraction and multiply everything together.',
    'Cancel $(x-y)$ and $x^2$.'
  ],
  steps:[
    { m:'\\frac{2x-2y}{x}\\times\\frac{x^3}{x-y}\\div\\frac{4x^2}{y}', n:'Write the expression.' },
    { m:'=\\frac{2(x-y)}{x}\\times\\frac{x^3}{x-y}\\times\\frac{y}{4x^2}', n:'Factorise; invert the last fraction.' },
    { m:'=\\frac{2x^3y}{4x^3}', n:'Cancel $(x-y)$; combine powers of $x$.' },
    { m:'=\\frac{y}{2}', n:'Cancel $2x^3$.' },
    { m:'\\therefore\\ \\text{Answer: A}', n:'Match with the options.' }
  ]
},
{
  id:'m5', n:'MC5', lvl:2, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{5}{x-5}-\\frac{9}{x-9} =',
  opts:['\\frac{4x+90}{(5-x)(9-x)}','\\frac{4x+90}{(5-x)(x-9)}','\\frac{4x}{(5-x)(9-x)}','\\frac{4x}{(5-x)(x-9)}'],
  ans:'3', ansTex:'D',
  hints:[
    'L.C.M. $= (x-5)(x-9)$.',
    'Top: $5(x-9)-9(x-5) = 5x-45-9x+45$.',
    'That simplifies to $-4x$, and $(x-5)(x-9) = (5-x)(9-x)$… check the signs carefully.'
  ],
  steps:[
    { m:'\\frac{5}{x-5}-\\frac{9}{x-9}', n:'Write the expression.' },
    { m:'=\\frac{5(x-9)-9(x-5)}{(x-5)(x-9)}', n:'L.C.M. is $(x-5)(x-9)$.' },
    { m:'=\\frac{5x-45-9x+45}{(x-5)(x-9)}', n:'Expand.' },
    { m:'=\\frac{-4x}{(x-5)(x-9)}', n:'Collect like terms.' },
    { m:'=\\frac{4x}{(5-x)(x-9)}', n:'Note $-(x-5)(x-9) = (5-x)(x-9)$.' },
    { m:'\\therefore\\ \\text{Answer: D}', n:'Match with the options.' }
  ]
},
{
  id:'m6', n:'MC6', lvl:2, fam:'mcqSimplify', type:'mcq',
  prompt:'\\frac{1}{x+2}+\\frac{1}{2-x} =',
  opts:['0','\\frac{2x}{x^2-4}','\\frac{4}{x^2-4}','\\frac{4}{4-x^2}'],
  ans:'3', ansTex:'D',
  hints:[
    'Note that $2-x = -(x-2)$.',
    'So the expression is $\\frac{1}{x+2}-\\frac{1}{x-2}$, with L.C.M. $(x+2)(x-2)=x^2-4$.',
    'Top: $(x-2)-(x+2) = -4$, so the answer is $\\frac{-4}{x^2-4}=\\frac{4}{4-x^2}$.'
  ],
  steps:[
    { m:'\\frac{1}{x+2}+\\frac{1}{2-x}', n:'Write the expression.' },
    { m:'=\\frac{1}{x+2}-\\frac{1}{x-2}', n:'Since $2-x=-(x-2)$.' },
    { m:'=\\frac{x-2}{(x+2)(x-2)}-\\frac{x+2}{(x+2)(x-2)}', n:'L.C.M. is $(x+2)(x-2)$.' },
    { m:'=\\frac{x-2-x-2}{x^2-4}', n:'Combine; difference of squares below.' },
    { m:'=-\\frac{4}{x^2-4}', n:'Simplify the numerator.' },
    { m:'=\\frac{4}{4-x^2}', n:'Multiply top and bottom by $-1$.' },
    { m:'\\therefore\\ \\text{Answer: D}', n:'Match with the options.' }
  ]
},
{
  id:'m7', n:'MC7', lvl:2, fam:'mcqSubst', type:'mcq',
  ctx:'Consider $k = \\dfrac{h+3m}{m-2h}$.',
  prompt:'If $h=-4$ and $m=2$, then $k =$',
  opts:['-\\frac{1}{3}','-\\frac{5}{3}','\\frac{1}{10}','\\frac{1}{5}'],
  ans:'3', ansTex:'D',
  hints:[
    'Substitute both values into the fraction.',
    'Top: $-4+3(2) = 2$.',
    'Bottom: $2-2(-4) = 10$. So $k = \\frac{2}{10}$.'
  ],
  steps:[
    { m:'k = \\frac{h+3m}{m-2h}', n:'Write the formula.' },
    { m:'k = \\frac{-4+3(2)}{2-2(-4)}', n:'Substitute $h=-4$, $m=2$.' },
    { m:'k = \\frac{-4+6}{2+8}', n:'Multiply.' },
    { m:'k = \\frac{2}{10}', n:'Add.' },
    { m:'k = \\frac{1}{5}', n:'Reduce the fraction.' },
    { m:'\\therefore\\ \\text{Answer: D}', n:'Match with the options.' }
  ]
},
{
  id:'m8', n:'MC8', lvl:2, fam:'mcqSubst', type:'mcq',
  ctx:'Consider the formula $\\dfrac{1}{f}=\\dfrac{1}{u}+\\dfrac{1}{v}$.',
  prompt:'Find the value of $v$ if $f=10$ and $u=15$.',
  opts:['5','20','25','30'],
  ans:'3', ansTex:'D',
  hints:[
    'Substitute $f=10$ and $u=15$.',
    '$\\frac{1}{10} = \\frac{1}{15}+\\frac{1}{v}$, so $\\frac{1}{v} = \\frac{1}{10}-\\frac{1}{15}$.',
    'Use the common denominator 30: $\\frac{1}{v} = \\frac{3-2}{30}$.'
  ],
  steps:[
    { m:'\\frac{1}{f}=\\frac{1}{u}+\\frac{1}{v}', n:'Write the formula.' },
    { m:'\\frac{1}{10}=\\frac{1}{15}+\\frac{1}{v}', n:'Substitute $f=10$, $u=15$.' },
    { m:'\\frac{1}{v}=\\frac{1}{10}-\\frac{1}{15}', n:'Rearrange.' },
    { m:'\\frac{1}{v}=\\frac{3}{30}-\\frac{2}{30}', n:'Common denominator 30.' },
    { m:'\\frac{1}{v}=\\frac{1}{30}', n:'Subtract.' },
    { m:'v=30', n:'Invert both sides.' },
    { m:'\\therefore\\ \\text{Answer: D}', n:'Match with the options.' }
  ]
},
{
  id:'m9', n:'MC9', lvl:2, fam:'mcqSubst', type:'mcq',
  ctx:'The total surface area $A$ cm$^2$ of a right circular cylinder of base radius $r$ cm and height $h$ cm is $A = 2\\pi rh+2\\pi r^2$.',
  prompt:'If the total surface area is $36\\pi$ cm$^2$ and the base radius is 3 cm, then the height of the cylinder is',
  opts:['3 cm','4.5 cm','6 cm','9 cm'],
  ans:'0', ansTex:'A',
  hints:[
    'Substitute $A=36\\pi$ and $r=3$.',
    '$36\\pi = 2\\pi(3)h + 2\\pi(3)^2 = 6\\pi h + 18\\pi$',
    'Divide everything by $\\pi$ and solve for $h$.'
  ],
  steps:[
    { m:'A = 2\\pi rh+2\\pi r^2', n:'Write the formula.' },
    { m:'36\\pi = 2\\pi(3)h+2\\pi(3)^2', n:'Substitute $A=36\\pi$, $r=3$.' },
    { m:'36\\pi = 6\\pi h+18\\pi', n:'Simplify.' },
    { m:'18\\pi = 6\\pi h', n:'Subtract $18\\pi$ from both sides.' },
    { m:'h = 3', n:'Divide by $6\\pi$.' },
    { m:'\\therefore\\ \\text{Answer: A}', n:'Match with the options.' }
  ]
},
{
  id:'m10', n:'MC10', lvl:2, fam:'mcqSubject', type:'mcq',
  prompt:'\\text{If } m = \\frac{2+n}{7}, \\text{ then } n =',
  opts:['\\frac{7m}{2}','m-\\frac{2}{7}','7m-2','7m+2'],
  ans:'2', ansTex:'C',
  hints:[
    'Multiply both sides by 7 to clear the fraction.',
    '$7m = 2+n$',
    'Now subtract 2 from both sides.'
  ],
  steps:[
    { m:'m = \\frac{2+n}{7}', n:'Write the formula.' },
    { m:'7m = 2+n', n:'Multiply both sides by 7.' },
    { m:'n = 7m-2', n:'Subtract 2 from both sides.' },
    { m:'\\therefore\\ \\text{Answer: C}', n:'Match with the options.' }
  ]
},
{
  id:'m11', n:'MC11', lvl:2, fam:'mcqSubject', type:'mcq',
  prompt:'\\text{If } 2x = y(1-3x)+1, \\text{ then } x =',
  opts:['\\frac{y+1}{2+3y}','\\frac{y+1}{5}','\\frac{y+1}{2-3y}','\\frac{y+1}{3y-2}'],
  ans:'0', ansTex:'A',
  hints:[
    'Expand the bracket: $2x = y-3xy+1$.',
    'Collect the $x$-terms on the left: $2x+3xy = y+1$.',
    'Factorise: $x(2+3y) = y+1$.'
  ],
  steps:[
    { m:'2x = y(1-3x)+1', n:'Write the formula.' },
    { m:'2x = y-3xy+1', n:'Expand the bracket.' },
    { m:'2x+3xy = y+1', n:'Collect $x$-terms on the left.' },
    { m:'x(2+3y) = y+1', n:'Factorise.' },
    { m:'x = \\frac{y+1}{2+3y}', n:'Divide by $(2+3y)$.' },
    { m:'\\therefore\\ \\text{Answer: A}', n:'Match with the options.' }
  ]
},
{
  id:'m12', n:'MC12', lvl:2, fam:'mcqSubject', type:'mcq',
  prompt:'\\text{If } v = 3-\\frac{7}{u-5}, \\text{ then } u =',
  opts:['\\frac{22-5v}{3-v}','\\frac{8-5v}{3-v}','\\frac{22-5v}{3+v}','\\frac{8-5v}{3+v}'],
  ans:'0', ansTex:'A',
  hints:[
    'Isolate the fraction: $\\frac{7}{u-5} = 3-v$.',
    'Invert: $u-5 = \\frac{7}{3-v}$.',
    'Add 5, then put over a common denominator.'
  ],
  steps:[
    { m:'v = 3-\\frac{7}{u-5}', n:'Write the formula.' },
    { m:'\\frac{7}{u-5} = 3-v', n:'Rearrange so the fraction stands alone.' },
    { m:'u-5 = \\frac{7}{3-v}', n:'Invert both sides.' },
    { m:'u = \\frac{7}{3-v}+5', n:'Add 5 to both sides.' },
    { m:'u = \\frac{7}{3-v}+\\frac{5(3-v)}{3-v}', n:'Common denominator.' },
    { m:'u = \\frac{7+15-5v}{3-v}', n:'Expand.' },
    { m:'u = \\frac{22-5v}{3-v}', n:'Collect like terms.' },
    { m:'\\therefore\\ \\text{Answer: A}', n:'Match with the options.' }
  ]
}
];

/* -------------------------------------------------------------------------
   Practice sets — how the bank is grouped in the app.
   ------------------------------------------------------------------------- */
const SETS = [
  {
    id:'s1', lvl:1, title:'Simplify: Cancelling',
    icon:'✂️', fam:'cancel',
    blurb:'Factorise the top and the bottom, then cancel what they share.',
    ids:['q1','q2','q3','q4','q28','q29']
  },
  {
    id:'s2', lvl:1, title:'Multiply & Divide',
    icon:'✖️', fam:'mulDiv',
    blurb:'Turn division into multiplication by the reciprocal, then cancel first.',
    ids:['q5','q6','q7','q8','q30','q31','q32','q33']
  },
  {
    id:'s3', lvl:1, title:'Add & Subtract',
    icon:'➕', fam:'addSub',
    blurb:'Find the L.C.M. of the denominators, then combine the numerators.',
    ids:['q9','q10','q11','q12','q34','q35','q36','q37','q38','q39','q50a']
  },
  {
    id:'s4', lvl:1, title:'Substitution',
    icon:'🔢', fam:'subst',
    blurb:'Put the numbers in, then solve the equation that is left.',
    ids:['q13','q14','q15','q16','q23b','q25b','q26b','q27a','q27b','q40','q41','q50bii','q51bi','q51bii','q52bi','q53a']
  },
  {
    id:'s5', lvl:1, title:'Change of Subject',
    icon:'🔁', fam:'subject',
    blurb:'Clear fractions, collect the target letter, factorise, then divide.',
    ids:['q17','q18','q19','q20','q21','q22','q23a','q24a','q25a','q26a',
         'q42','q43','q44','q45','q46','q47','q48a','q49a','q50bi','q51a','q52ai','q52aii','q53bi']
  },
  {
    id:'s6', lvl:2, title:'Reasoning & Word Problems',
    icon:'💭', fam:'change',
    blurb:'Explain, compare and justify — the "EYA" style questions.',
    ids:['q24b','q48b','q49b','q52bii','q53bii']
  },
  {
    id:'s7', lvl:1, title:'Multiple Choice',
    icon:'✅', fam:'mcqSimplify',
    blurb:'Exam-style multiple choice — the same skills, against the clock.',
    ids:['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12']
  }
];

/* Look up a question by id. */
const BANK_BY_ID = {};
for (const q of BANK) BANK_BY_ID[q.id] = q;

if (typeof module !== 'undefined') {
  module.exports = { BANK, SETS, BANK_BY_ID };
}
