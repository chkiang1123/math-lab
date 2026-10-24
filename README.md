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
student gets one wrong — plus a shared home page, a combined progress page,
a chapter switcher in the header, and a **tap-to-enter answer pad** so
students can build an answer by clicking instead of typing.

## Answer pad

`js/keypad.js` floats a keypad above the page whenever an answer field is
focused. It lives in the shell, so both chapters get it without either app
knowing about it:

- digits, `.`, brackets, `^`, and `× ÷ − +` — which insert plain `* / - +`,
  the exact characters both marking engines already accept
- a row of the letters each chapter actually uses (Fraction chapter adds π)
- backspace, clear, and a Check button that presses the chapter's own
  submit button, then scrolls the feedback into view
- the focused answer box is lifted above the pad so it is never covered;
  both chapters focus their box before it is attached to the DOM, so the
  pad does that job for them
- hide it with ✕ (a floating ⌨ button brings it back); the choice is
  remembered per device

## Layout

```
index.html          generated single-file bundle (deploy entry)
index.dev.html      multi-file development entry
styles.css          one design system for both chapters
js/
  shell.js          shared frame: state, header, routing, landing + progress
  keypad.js         tap-to-enter answer pad (shared by both chapters)
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
