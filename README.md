# Math Lab

Practice platform for two chapters of Pearson *Mathematics* Book 2A, merged
into one site:

| Chapter | Source | Questions |
|---|---|---|
| **Identities & Factorization** | Additional Revision Exercise 2 | 84 |
| **Algebraic Fractions & Formulas** | Additional Revision Exercise 3 | 81 |

Each chapter keeps everything the original apps had — 7 student-oriented
summary notes, practice sets, hints that arrive one step at a time, full
step-by-step solutions, and auto-generated **similar questions** when a
student gets one wrong — plus a shared home page, a combined progress page
and a chapter switcher in the header.

## Layout

```
index.html          generated single-file bundle (deploy entry)
index.dev.html      multi-file development entry
styles.css          one design system for both chapters
js/
  shell.js          shared frame: state, header, routing, landing + progress
  topics/
    identity.js     generated — see tools/build_topics.py
    frac.js         generated — see tools/build_topics.py
src/
  identity/         engine.js gens.js data.js learn.js app.js   (original code)
  frac/             engine.js gens.js data.js learn.js app.js   (original code)
vendor/katex/       KaTeX, so the site works fully offline
tools/              build + verification scripts
```

The two chapters were built as separate apps whose globals collide badly
(`F`, `Poly`, `BANK`, `SETS`, `LEARN`, `rnd`, `parseExpr`…). Rather than
rewrite two verified question banks, each chapter is wrapped into its own
IIFE by `tools/build_topics.py` and driven by the shell through three entry
points: `mount(host)`, `route(path)`, `unmount()`.

## Build

```
python3 tools/build_topics.py     # wrap src/<chapter>/*.js -> js/topics/<chapter>.js
python3 tools/build_single.py     # inline everything into index.html
```

`build_single.py` also inlines KaTeX and base64-encodes its woff2 fonts, so
`index.html` (≈970 KB) is fully standalone.

Edit `src/<chapter>/*.js` or `js/shell.js`, never the generated bundles.

## Verification

- Identity chapter: `tools/verify/test.js`, `test-accept.js`, `test-answers.js`
- Fraction chapter: `tools/verify/verify_bank.js`, `verify_grading.js`,
  `verify_answers.py` (sympy cross-check), `verify_gen.py` (generator fuzz)
- Every answer in the bank is checked symbolically with sympy: 0 mismatches
- Full browser sweep: all 165 questions render with 0 KaTeX errors and a
  complete answer UI; all 13 summary notes render clean

## Rebuilding after edits

1. edit `src/<chapter>/*.js` (or `js/shell.js`, `styles.css`)
2. `python3 tools/build_single.py`
3. redeploy
