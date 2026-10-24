"""Cross-check every 'expr' answer in data.js against sympy.

  * simplify  — the maths simplifies to `ans`
  * subject   — solving the formula for the target letter gives `ans`
The target letter comes from the `[x]` marker, or from "make x the subject".
Reads /tmp/bank.json (dumped by node).
"""
import json, re, sympy as sp

data = json.load(open('/tmp/bank.json'))
ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

def grab_math(s):
    """Return the longest $...$ maths fragment of a prose string."""
    t = s.replace('\\$', '\x01')          # literal dollar sign
    parts = re.findall(r'\$([^$]*)\$', t)
    parts = [p.replace('\x01', '\\$') for p in parts]
    if not parts:
        return None
    with_eq = [p for p in parts if '=' in p]
    pool = with_eq or parts
    return max(pool, key=len)

def prose_left(s):
    t = re.sub(r'\\text\s*\{[^{}]*\}', ' ', s)
    t = re.sub(r'\$[^$]*\$', ' ', t.replace('\\$', '\x01'))
    t = re.sub(r'\\[a-zA-Z]+', ' ', t)
    return re.search(r'[A-Za-z]{3,}', t) is not None

def latex2sym(s):
    s = re.sub(r'\\text\s*\{[^{}]*\}', ' ', s)
    s = s.replace('\\dfrac', '\\frac').replace('\\tfrac', '\\frac')
    s = s.replace('\\left', '').replace('\\right', '')
    s = s.replace('\\times', '*').replace('\\div', '/').replace('\\cdot', '*')
    s = s.replace('\\pi', '@PI@')
    s = s.replace('\\quad', ' ').replace('\\,', '').replace('\\;', '').replace('\\!', '')
    s = s.replace('^\\circ', '')
    for _ in range(12):
        m = re.search(r'\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}', s)
        if not m: break
        s = s[:m.start()] + '((' + m.group(1) + ')/(' + m.group(2) + '))' + s[m.end():]
    s = s.replace('{', '(').replace('}', ')')
    s = re.sub(r'\^\s*\(([^()]*)\)', r'**(\1)', s)
    s = re.sub(r'\^(\w)', r'**(\1)', s)
    s = re.sub(r'(?<=[0-9)])\s*\(', '*(', s)
    s = re.sub(r'\)\s*\(', ')*(', s)
    s = re.sub(r'(?<=[0-9)])(?=[A-Za-z])', '*', s)
    s = re.sub(r'(?<=[A-Za-z])(?=[A-Za-z])', '*', s)
    s = re.sub(r'(?<=[A-Za-z])(?=\()', '*', s)
    s = re.sub(r'@PI@\s*(?=[A-Za-z0-9(])', '@PI@*', s)
    s = s.replace('@PI@', 'pi')
    return s.replace('$', ' ').strip()

def sympify(s):
    loc = {c: sp.Symbol(c) for c in ALPHA}
    loc['pi'] = sp.pi
    return sp.sympify(s, locals=loc)

ok = skip = bad = 0
for q in data:
    if q.get('type') != 'expr':
        continue
    prompt, ans = q['prompt'], q['ans']

    # ---- find the target letter ----
    target = None
    m = re.search(r'\[([a-zA-Z])\]\s*$', prompt)
    if m:
        target = m.group(1)
    else:
        m = re.search(r'[Mm]ake\s+\$?([a-zA-Z])\$?\s+the subject', prompt)
        if m:
            target = m.group(1)

    # ---- find the maths ----
    src = None
    marker = re.search(r'\[([a-zA-Z])\]\s*$', prompt)
    if target is None:
        if prose_left(prompt):
            src = None
        else:
            src = re.sub(r'\\text\s*\{[^{}]*\}', '', prompt)
    if target is not None:
        src = grab_math(q.get('ctx', '')) or grab_math(prompt)
        if src is None and not prose_left(prompt):
            src = prompt[:marker.start()] if marker else prompt
        if src:
            src = src.strip().rstrip('.').strip()
            src = re.sub(r'\[[a-zA-Z]\]\s*$', '', src).strip()
    if src is None:
        print('SKIP(no maths)', q['id']); skip += 1; continue

    try:
        if target:
            if '=' not in src:
                print('SKIP(no =)', q['id']); skip += 1; continue
            lhs, rhs = src.split('=', 1)
            L, R = sympify(latex2sym(lhs)), sympify(latex2sym(rhs))
            sol = sp.solve(sp.Eq(L, R), sp.Symbol(target))
            if not sol:
                print('SKIP(no sol)', q['id']); skip += 1; continue
            got = sp.simplify(sol[0])
            # apply any "where a = 3 and b = -2" style bindings from the context
            # only accept a binding whose value ends the clause (k = 5.) — this
            # avoids reading "P = 100n" as "P = 100".
            binds = re.findall(r'([a-zA-Z])\s*=\s*(-?\d+)(?![0-9a-zA-Z+\-*/^])', q.get('ctx', '') or '')
            if binds:
                got = sp.simplify(got.subs({sp.Symbol(k): sp.Rational(int(v)) for k, v in binds}))
        else:
            src = src.rstrip('.').strip()
            got = sp.simplify(sympify(latex2sym(src)))
        exp = sp.simplify(sympify(latex2sym(ans)))
        if sp.simplify(got - exp) == 0:
            ok += 1
        else:
            bad += 1
            print('MISMATCH', q['id'], '| got', got, '| expected', exp)
    except Exception as e:
        print('SKIP', q['id'], type(e).__name__, str(e)[:80]); skip += 1

print('\nchecked', ok, '| mismatch', bad, '| skipped', skip)
