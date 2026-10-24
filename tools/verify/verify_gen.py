"""Cross-check every generated question/answer pair with sympy."""
import json, re, sys
import sympy as sp
from sympy.parsing.sympy_parser import (parse_expr, standard_transformations,
                                        convert_xor, implicit_multiplication_application)

TR = standard_transformations + (convert_xor, implicit_multiplication_application)


def latex2sym(s):
    s = s.replace('\\dfrac', '\\frac').replace('\\tfrac', '\\frac')
    s = s.replace('\\left', '').replace('\\right', '')
    s = s.replace('\\times', '*').replace('\\cdot', '*').replace('\\div', '/')
    s = s.replace('\\pi', 'pi')
    s = re.sub(r'\\text\s*{[^}]*}', '', s)
    s = s.replace('\\quad', ' ').replace('\\,', ' ').replace('\\;', ' ')
    s = s.replace('$', '')
    # \frac{A}{B} -> ((A)/(B))
    for _ in range(8):
        m = re.search(r'\\frac\s*{', s)
        if not m:
            break
        i = m.end() - 1
        depth, j, a = 0, i, ''
        while j < len(s):
            if s[j] == '{':
                depth += 1
            elif s[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            a += s[j]
            j += 1
        a = a[1:]
        k = j + 1
        while k < len(s) and s[k] == ' ':
            k += 1
        if k >= len(s) or s[k] != '{':
            break
        depth, b, m2 = 0, '', k
        while m2 < len(s):
            if s[m2] == '{':
                depth += 1
            elif s[m2] == '}':
                depth -= 1
                if depth == 0:
                    break
            b += s[m2]
            m2 += 1
        b = b[1:]
        s = s[:m.start()] + '((' + a + ')/(' + b + '))' + s[m2 + 1:]
    s = re.sub(r'\^{([^{}]*)}', r'**(\1)', s)
    s = re.sub(r'\^(\d)', r'**\1', s)
    s = s.replace('{', '(').replace('}', ')')
    # every variable is a single letter: split runs of letters (mu -> m*u)
    s = re.sub(r'(?<=[A-Za-z])(?=[A-Za-z])', '*', s)
    return s


def to_expr(s):
    return parse_expr(latex2sym(s), transformations=TR, evaluate=True)


items = json.load(open('/tmp/gens.json'))
bad = 0
checked = 0
skipped = 0
reasons = {}
for it in items:
    if it['kind'] != 'expr':
        skipped += 1
        continue
    body = it['body']
    ans = it['ansTex']
    try:
        if it['family'] == 'subject' or (it.get('target') and '=' in body):
            lhs, rhs = body.split('=', 1)
            tgt = it['target']
            if not tgt:
                skipped += 1
                continue
            e = sp.simplify(to_expr(lhs) - to_expr(rhs))
            e = e.subs(sp.Symbol(tgt), to_expr(ans))
            ok = sp.simplify(e) == 0
        else:
            d = sp.simplify(sp.together(to_expr(body) - to_expr(ans)))
            ok = sp.simplify(d) == 0
    except Exception as ex:
        reasons[str(ex)[:60]] = reasons.get(str(ex)[:60], 0) + 1
        skipped += 1
        continue
    checked += 1
    if not ok:
        bad += 1
        if bad <= 12:
            print('MISMATCH', it['gen'], 'hard' if it['hard'] else '', '|', body, '=>', ans)
print('checked %d, mismatches %d, skipped %d' % (checked, bad, skipped))
if reasons:
    print('skip reasons:', reasons)
sys.exit(1 if bad else 0)
