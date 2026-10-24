/* ==========================================================================
   app.js — Fraction Lab SPA
   Algebraic Fractions and Formulas · Pearson 2A · Additional Revision Ex. 3
   ========================================================================== */

/* ------------------------------------------------------------ state ----- */
/* In the merged site the shell owns persistence so both chapters share one
   progress record. `store` is injected before this bundle is used. */
var store = window.__ML.state.frac;
const DEFAULTS = window.__ML.DEFAULTS;   // shape template, owned by the shell
function save() { window.__ML.save(); }

const SKILLS = {
  cancel: 'Simplifying & cancelling',
  mulDiv: 'Multiplying & dividing',
  addSub: 'Adding & subtracting',
  subst: 'Substitution',
  subject: 'Changing the subject',
  change: 'Reasoning & word problems',
  mcqSimplify: 'Multiple choice',
  mcqSubject: 'Multiple choice',
  mcqSubst: 'Multiple choice',
  subjectMcq: 'Multiple choice',
  addSubMcq: 'Multiple choice',
  cancelMcq: 'Multiple choice',
  mulDivMcq: 'Multiple choice',
  substMcq: 'Multiple choice',
  substSolve: 'Substitution',
  word: 'Reasoning & word problems'
};
function skillKey(fam) { return fam in SKILLS ? fam : 'cancel'; }
function skillName(fam) { return SKILLS[fam] || SKILLS[skillKey(fam)]; }

/* ------------------------------------------------- maths rendering ------ */
function hasKatex() { return typeof katex !== 'undefined'; }
function renderRich(el, text) {
  String(text).split('\n').forEach((line, i) => {
    if (i > 0) el.appendChild(document.createElement('br'));
    line.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_)/g).forEach(seg => {
      if (!seg) return;
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
        el.appendChild(Object.assign(document.createElement('strong'), { textContent: seg.slice(2, -2) }));
      } else if ((seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) ||
                 (seg.startsWith('_') && seg.endsWith('_') && seg.length > 2)) {
        el.appendChild(Object.assign(document.createElement('em'), { textContent: seg.slice(1, -1) }));
      } else el.appendChild(document.createTextNode(seg));
    });
  });
}
function paint(node, src, display) {
  if (hasKatex()) {
    try { katex.render(src, node, { displayMode: !!display, throwOnError: false, strict: 'ignore' }); return; }
    catch (e) { /* fall through */ }
  }
  node.textContent = src;
}
function renderMathInto(el, text) {
  el.innerHTML = '';
  const segs = String(text).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  for (const seg of segs) {
    if (!seg) continue;
    if (seg.startsWith('$$')) {
      const d = document.createElement('div'); d.className = 'math-display';
      paint(d, seg.slice(2, -2), true); el.appendChild(d);
    } else if (seg.startsWith('$')) {
      const s = document.createElement('span');
      paint(s, seg.slice(1, -1), false); el.appendChild(s);
    } else renderRich(el, seg);
  }
}
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined && html !== null) renderMathInto(e, html);
  return e;
}
/* render a bare LaTeX snippet as display maths */
function mathBox(latex) {
  const d = el('div', 'math-display');
  paint(d, latex, true);
  return d;
}

/* -------------------------------------------- live answer preview ------ */
function previewTex(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  try { return texAST(parseExpr(s)); } catch (e) { return null; }
}

/* ------------------------------------------------- question shapes ----- */
function numToF(ans) {
  const t = String(ans).trim();
  const neg = t.startsWith('-');
  const body = neg ? t.slice(1) : t;
  if (body.includes('/')) { const [a, b] = body.split('/'); return F((neg ? -1 : 1) * Number(a), Number(b)); }
  return F(Number(t));
}
function fromBank(q) {
  return {
    key: q.id,
    label: q.n,
    lvl: q.lvl,
    fam: q.fam,
    ctx: q.ctx || null,
    prompt: q.prompt,
    kind: q.type,
    opts: q.opts || null,
    expected: q.type === 'expr' ? ratFromExpr(q.ans)
      : q.type === 'num' ? numToF(q.ans)
        : q.type === 'mcq' ? Number(q.ans) : q.ans,
    ansTex: q.ansTex,
    hints: q.hints || [],
    steps: (q.steps || []).map(s => ({ m: s.m, n: s.n }))
  };
}
function fromGen(g, fam, hard) {
  return {
    key: null,
    label: null,
    lvl: hard ? 2 : 1,
    fam: fam,
    ctx: g.prompt || null,
    prompt: g.body,
    kind: g.kind === 'mcq' ? 'mcq' : (g.kind === 'num' ? 'num' : 'expr'),
    opts: g.options || null,
    expected: g.kind === 'mcq' ? g.correct : (g.kind === 'num' ? (g.ansNum || numToF(g.ansTex)) : g.ans),
    ansTex: g.ansTex,
    hints: g.hints || [],
    steps: (g.steps || []).map(s => ({ m: s, n: null }))
  };
}
function isCorrect(rq, val) {
  try {
    if (rq.kind === 'expr') return checkAnswer(val, rq.expected).ok;
    if (rq.kind === 'num') return checkNumber(val, rq.expected).ok;
    if (rq.kind === 'yn') return val === rq.expected;
    if (rq.kind === 'mcq') return Number(val) === Number(rq.expected);
  } catch (e) { /* treat as wrong */ }
  return false;
}

/* --------------------------------------------------------- copy -------- */
const PRAISE = [
  'Nice — that’s correct!', 'Correct! You’ve got the method down.',
  'Yes! Clean and accurate.', 'That’s it — well worked.',
  'Correct. You made that look easy.', 'Spot on. Keep that streak alive!'
];
const PRAISE_SIM = [
  'Correct! The practice paid off.', 'Yes — you nailed the similar question.',
  'That’s right. Same idea, new numbers.', 'Well done — now you own this type.'
];
const NUDGE = [
  'Not quite — but this is exactly how you get better.',
  'Close. Check your signs — that’s where most marks slip.',
  'Not yet. Look again at what you are allowed to cancel.',
  'Not quite. Try the similar question below to build it up step by step.',
  'Careful — compare term by term with the worked method.'
];
const NUDGE_MCQ = [
  'Not that one. Try substituting a value to test the options.',
  'Close — re-check the signs in each option.',
  'Not quite. Simplify the question first, then match.'
];
function pickA(a) { return a[Math.floor(Math.random() * a.length)]; }

/* -------------------------------------------------------- router ------- */
/* The shell owns location.hash and hands each chapter the part of the path
   that belongs to it; `app` is the container the shell gives us to draw in.
   All in-chapter hashes stay relative (#/home) and the shell rewrites them
   to #/frac/home, so none of the code below had to change. */
var app = null;
var __path = 'home';
function nav(h) { location.hash = window.__ML.prefix + String(h).replace(/^#\/?/, '/'); }
function route() {
  const h = String(__path || 'home').replace(/^\/+/, '');
  const parts = h.split('/');
  window.scrollTo(0, 0);
  if (parts[0] === '' || parts[0] === 'home') return viewHome();
  if (parts[0] === 'learn') return parts[1] ? viewLearnNote(parts[1]) : viewLearn();
  if (parts[0] === 'practice') return parts[1] ? viewSet(parts[1]) : viewPractice();
  if (parts[0] === 'q') return viewQuestion(parts[1]);
  if (parts[0] === 'smart') return viewQuestionSmart();
  if (parts[0] === 'progress') return viewProgress();
  viewHome();
}

/* ---------------------------------------------------- layout bits ----- */
function setOf(qid) { return SETS.find(s => s.ids.indexOf(qid) > -1); }
function setProgress(s) {
  const done = s.ids.filter(i => store.solved[i]).length;
  return { done: done, total: s.ids.length, pct: Math.round(done / s.ids.length * 100) };
}
function overall() {
  const total = BANK.length;
  const done = BANK.filter(q => store.solved[q.id]).length;
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}
function ringSvg(pct, big, small) {
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return '<svg width="132" height="132" viewBox="0 0 132 132" style="display:block;margin:0 auto">' +
    '<circle cx="66" cy="66" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="11"/>' +
    '<circle cx="66" cy="66" r="' + r + '" fill="none" stroke="url(#gr)" stroke-width="11" ' +
    'stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" ' +
    'transform="rotate(-90 66 66)"/><defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="var(--acc)"/><stop offset="100%" stop-color="var(--acc2)"/>' +
    '</linearGradient></defs><text x="66" y="63" text-anchor="middle" fill="var(--fg)" ' +
    'font-size="21" font-weight="800" font-family="inherit">' + big + '</text>' +
    '<text x="66" y="82" text-anchor="middle" fill="var(--fg2)" font-size="11.5" ' +
    'font-family="inherit">' + small + '</text></svg>';
}
/* The shell renders the shared header (chapter switcher, XP, theme) and the
   footer, so `wrap` only has to fill the main column. */
function wrap(active, ...children) {
  app.innerHTML = '';
  const main = el('main', 'content');
  children.forEach(c => main.appendChild(c));
  app.appendChild(main);
}

/* ============================== HOME ================================== */
function viewHome() {
  const o = overall();
  const hero = el('section', 'hero');
  hero.appendChild(el('h1', null, 'Master **Algebraic Fractions & Formulas**'));
  hero.appendChild(el('p', 'hero-sub', 'Read the notes, practise every workbook question — and whenever you get stuck you get a hint, a step-by-step solution, and a fresh similar question to try.'));
  const row = el('div', 'btn-row');
  const b1 = el('button', 'btn primary big'); b1.textContent = '▶ Smart practice'; b1.onclick = () => nav('#/smart');
  const b2 = el('button', 'btn big'); b2.textContent = '📖 Start with the notes'; b2.onclick = () => nav('#/learn');
  const b3 = el('button', 'btn big ghost'); b3.textContent = '🏋️ All practice sets'; b3.onclick = () => nav('#/practice');
  row.append(b1, b2, b3);
  hero.appendChild(row);

  const ring = el('div', 'home-ring');
  ring.innerHTML = ringSvg(o.pct, o.done + '/' + o.total, 'questions mastered');
  ring.appendChild(el('p', null, '_' + o.done + ' of ' + o.total + ' questions done · ' + store.xp + ' XP · best streak ' + store.bestStreak + '_'));

  const cols = el('div', 'home-cols');
  const lc = el('section', 'card');
  lc.appendChild(el('h2', null, '📖 Learn — the 7 summaries'));
  LEARN.forEach(u => {
    const r = el('a', 'list-row');
    r.href = '#/learn/' + u.id;
    r.innerHTML = '<span class="ic">' + u.icon + '</span><span><span class="nm">' +
      u.title.replace(/^\d+\.\s*/, '') + '</span><br><small>' + u.summary + '</small></span>';
    lc.appendChild(r);
  });
  const pc = el('section', 'card');
  pc.appendChild(el('h2', null, '🏋️ Practice sets'));
  SETS.forEach(s => {
    const p = setProgress(s);
    const r = el('a', 'list-row');
    r.href = '#/practice/' + s.id;
    r.innerHTML = '<span class="ic">' + s.icon + '</span><span style="flex:1"><span class="nm">' + s.title +
      '</span> <span class="set-lvl lvl' + s.lvl + '">' + (s.lvl === 1 ? 'Level 1' : 'Level 2') + '</span><br><small>' +
      s.blurb + '</small><br><progress value="' + p.pct + '" max="100"></progress></span>' +
      '<span style="font-size:12.5px;color:var(--fg2)">' + p.done + '/' + p.total + '</span>';
    pc.appendChild(r);
  });
  cols.append(lc, pc);

  const how = el('section', 'card how');
  how.appendChild(el('h2', null, '🛈 How this works'));
  const ol = document.createElement('ol');
  [
    '**Read a summary** — each one covers one skill, with worked examples.',
    '**Try the practice set** — the real workbook questions, in order.',
    '**Stuck? Ask for a hint** — hints arrive one step at a time, so you still do the thinking.',
    '**Still stuck?** Reveal the full step-by-step solution.',
    '**Got it wrong?** The app writes you a **brand-new similar question** of the same type so you can try again straight away.'
  ].forEach(t => { const li = document.createElement('li'); renderMathInto(li, t); ol.appendChild(li); });
  how.appendChild(ol);
  wrap('#/home', hero, ring, cols, how);
}

/* ============================== LEARN ================================= */
function viewLearn() {
  const t = el('div', null);
  t.appendChild(el('h1', 'page-title', '📖 Summary notes'));
  t.appendChild(el('p', 'page-sub', 'Seven short units — everything you need before you start the exercises.'));
  const grid = el('div', 'learn-grid');
  LEARN.forEach(u => {
    const c = el('a', 'card learn-card');
    c.href = '#/learn/' + u.id;
    const s = setProgress(SETS.find(x => x.id === u.practice) || SETS[0]);
    c.innerHTML = '<div class="learn-ic">' + u.icon + '</div><h3>' + u.title.replace(/^\d+\.\s*/, '') + '</h3><p>' + u.summary + '</p>' +
      '<div class="set-meta"><span>→ ' + (s.done + '/' + s.total + ' practised') + '</span></div>';
    grid.appendChild(c);
  });
  t.appendChild(grid);
  wrap('#/learn', t);
}
function viewLearnNote(id) {
  const idx = LEARN.findIndex(u => u.id === id);
  if (idx < 0) return viewLearn();
  const u = LEARN[idx];
  const box = el('section', 'card');
  const top = el('div', null);
  top.appendChild(el('a', 'backlink', '← All notes'));
  top.firstChild.href = '#/learn';
  box.appendChild(top);
  box.appendChild(el('h1', 'page-title', u.icon + '  ' + u.title));
  box.appendChild(el('p', 'page-sub', u.summary));

  const body = el('div', 'learn-body');
  (u.body || []).forEach(b => {
    if (b.h) body.appendChild(el('h3', 'note-h', b.h));
    if (b.formula) {
      const f = el('div', 'formula');
      paint(f, b.formula.replace(/^\$|\$$/g, ''), true);
      body.appendChild(f);
    }
    if (b.p) body.appendChild(el('p', 'note-p', b.p));
    if (b.example) {
      const exWrap = el('div', 'example');
      exWrap.appendChild(el('div', 'ex-label', 'Worked example'));
      renderMathInto(exWrap, b.example);
      body.appendChild(exWrap);
    }
  });
  box.appendChild(body);

  const set = SETS.find(s => s.id === u.practice);
  const row = el('div', 'btn-row');
  if (set) {
    const p = el('button', 'btn primary'); p.textContent = '🏋️ Practise this →';
    p.onclick = () => nav('#/practice/' + set.id);
    row.appendChild(p);
  }
  const q = el('button', 'btn'); q.textContent = '🎲 Smart practice';
  q.onclick = () => nav('#/smart');
  row.appendChild(q);
  box.appendChild(row);

  const navrow = el('div', 'learn-nav');
  if (idx > 0) {
    const p = el('a', 'btn ghost'); p.href = '#/learn/' + LEARN[idx - 1].id;
    p.textContent = '← ' + LEARN[idx - 1].title.replace(/^\d+\.\s*/, '');
    navrow.appendChild(p);
  }
  if (idx < LEARN.length - 1) {
    const n = el('a', 'btn ghost'); n.href = '#/learn/' + LEARN[idx + 1].id;
    n.style.marginLeft = 'auto';
    n.textContent = LEARN[idx + 1].title.replace(/^\d+\.\s*/, '') + ' →';
    navrow.appendChild(n);
  }
  wrap('#/learn', box, navrow);
}

/* ============================= PRACTICE =============================== */
function viewPractice() {
  const t = el('div', null);
  t.appendChild(el('h1', 'page-title', '🏋️ Practice sets'));
  t.appendChild(el('p', 'page-sub', 'Every question from the workbook, grouped by the skill it tests.'));
  const row = el('div', 'btn-row');
  const sm = el('button', 'btn teal'); sm.textContent = '▶ Smart practice — pick the best next question for me';
  sm.onclick = () => nav('#/smart');
  row.appendChild(sm);
  t.appendChild(row);

  const grid = el('div', 'prac-grid');
  SETS.forEach(s => {
    const p = setProgress(s);
    const c = el('a', 'card set-card');
    c.href = '#/practice/' + s.id;
    c.innerHTML = '<span class="set-lvl lvl' + s.lvl + '">' + (s.lvl === 1 ? 'Level 1' : 'Level 2') + '</span>' +
      '<h3>' + s.icon + '  ' + s.title + '</h3><p>' + s.blurb + '</p>' +
      '<progress value="' + p.pct + '" max="100"></progress>' +
      '<div class="set-meta" style="margin-top:6px"><span>' + p.done + ' / ' + p.total + ' mastered</span></div>';
    grid.appendChild(c);
  });
  t.appendChild(grid);
  wrap('#/practice', t);
}
/* Turn a short LaTeX snippet into readable plain text for list previews,
   e.g. "\frac{ab}{cd}=2 [d]"  ->  "(ab)/(cd) = 2 [d]" */
function texToPlainShort(s) {
  let t = String(s || '');
  t = t.replace(/\s*\$([^$]*)\$\s*/g, ' $1 ');        // unwrap inline maths
  for (let i = 0; i < 8; i++) {                          // \frac{a}{b} -> (a)/(b)
    const m = t.match(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/);
    if (!m) break;
    t = t.slice(0, m.index) + '(' + m[1] + ')/(' + m[2] + ')' + t.slice(m.index + m[0].length);
  }
  t = t.replace(/\\times/g, ' × ').replace(/\\div/g, ' ÷ ')
       .replace(/\\quad/g, '  ')
       .replace(/\\text\s*\{([^{}]*)\}/g, '$1')
       .replace(/\\pi/g, 'π').replace(/\\left|\\right|\\!/g, '')
       .replace(/\\[a-zA-Z]+/g, '')
       .replace(/[\{\}]/g, '')
       .replace(/\s+/g, ' ').trim();
  return t.length > 46 ? t.slice(0, 44) + '…' : t;
}
function shortPreview(q) {
  const src = q.prompt || '';
  return src.replace(/\\text\s*\{[^}]*\}/g, '').replace(/\\quad/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 34);
}
function viewSet(sid) {
  const s = SETS.find(x => x.id === sid);
  if (!s) return viewPractice();
  const p = setProgress(s);
  const box = el('section', 'card');
  const top = el('div', null);
  const back = el('a', 'backlink', '← All sets');
  back.href = '#/practice';
  top.appendChild(back);
  box.appendChild(top);
  box.appendChild(el('h1', 'page-title', s.icon + '  ' + s.title));
  box.appendChild(el('p', 'page-sub', s.blurb));
  const meta = el('div', 'set-meta');
  meta.appendChild(el('span', 'set-lvl lvl' + s.lvl, s.lvl === 1 ? 'Level 1' : 'Level 2'));
  meta.appendChild(el('span', null, p.done + ' / ' + p.total + ' mastered'));
  box.appendChild(meta);
  const bar = document.createElement('progress');
  bar.value = p.pct; bar.max = 100; bar.style.marginTop = '10px';
  box.appendChild(bar);

  const grid = el('div', 'qgrid');
  s.ids.forEach(id => {
    const q = BANK_BY_ID[id];
    if (!q) return;
    const done = !!store.solved[id];
    const tried = store.tried[id];
    const c = el('button', 'qcell' + (done ? ' done' : (tried ? ' tried' : '')));
    c.innerHTML = '<span class="qn">' + (done ? '✓ ' : (tried ? '· ' : '')) + q.n + '</span>';
    c.appendChild(el('span', 'mini-preview', texToPlainShort(q.prompt)));
    c.onclick = () => nav('#/q/' + id);
    grid.appendChild(c);
  });
  box.appendChild(grid);

  const row = el('div', 'btn-row');
  const firstUndone = s.ids.find(i => !store.solved[i]);
  const st = el('button', 'btn primary');
  st.textContent = firstUndone ? '▶ Start: question ' + BANK_BY_ID[firstUndone].n : '✓ Set complete';
  st.onclick = () => firstUndone ? nav('#/q/' + firstUndone) : nav('#/practice');
  row.appendChild(st);
  box.appendChild(row);
  wrap('#/practice', box);
}

/* ============================ QUESTION VIEW =========================== */
let S = null;
function viewQuestion(qid) {
  const q = BANK_BY_ID[qid];
  if (!q) return viewPractice();
  S = { id: qid, similar: null, hintsUsed: 0, stepIdx: 0, usedSteps: false, attempts: 0, fromSet: true };
  draw();
}
function viewQuestionSmart() {
  const qid = pickSmart();
  if (!qid) return viewPractice();
  S = { id: qid, similar: null, hintsUsed: 0, stepIdx: 0, usedSteps: false, attempts: 0, fromSet: false };
  draw();
}
function pickSmart() {
  /* weakest skill first (needs >=2 attempts), then unsolved, then anything */
  const skillOrder = Object.keys(SKILLS)
    .filter(k => k.indexOf('Mcq') < 0 || k === 'mcq')
    .map(k => ({ k, acc: (function () { const s = store.skills[k]; return s && s.a >= 2 ? s.c / s.a : 0.75; })() }))
    .sort((a, b) => a.acc - b.acc).map(x => x.k);
  const unsolvedIn = list => list.filter(id => !store.solved[id]);
  for (const fam of skillOrder) {
    const pool = unsolvedIn(BANK.filter(q => q.fam === fam).map(q => q.id));
    if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  }
  const rest = unsolvedIn(BANK.map(q => q.id));
  if (rest.length) return rest[Math.floor(Math.random() * rest.length)];
  return BANK[Math.floor(Math.random() * BANK.length)].id;
}
function cur() { return S.similar || fromBank(BANK_BY_ID[S.id]); }

function draw() {
  const rq = cur();
  const base = BANK_BY_ID[S.id];
  const cont = el('div', 'qwrap');

  /* breadcrumb */
  const crumb = el('div', 'crumb');
  if (S.similar) {
    const a = el('a', null, '← Back to question ' + base.n);
    a.href = '#/q/' + base.id;
    crumb.appendChild(a);
  } else {
    const a = el('a', null, S.fromSet ? '← Practice sets' : '← Smart practice');
    a.href = S.fromSet ? '#/practice' : '#/home';
    crumb.appendChild(a);
    const set = setOf(S.id);
    crumb.appendChild(document.createTextNode('  ·  ' + (set ? set.title + '  ·  ' : '') + 'Question ' + base.n));
  }
  cont.appendChild(crumb);

  const card = el('section', 'card qcard');
  if (S.similar) card.appendChild(el('div', 'sim-banner', '🎯 **Fresh similar question** — same idea, new numbers. Take your time.'));
  else if (S.attempts > 0) card.appendChild(el('div', 'retry-banner', 'Attempt ' + (S.attempts + 1) + ' — no penalty. Wrong answers are information.'));

  card.appendChild(el('div', 'skill-tag',
    (rq.lvl === 2 ? 'Level 2' : 'Level 1') + '  ·  ' + (S.similar ? 'Similar practice' : skillName(base.fam))));

  if (rq.ctx) card.appendChild(el('div', 'qctx', rq.ctx));
  if (!S.similar) {
    /* bank prompts are either raw LaTeX or English with $…$ maths inside */
    if (isStandaloneTex(rq.prompt)) {
      const mb = el('div', 'qmath');
      paint(mb, stripOuterDollars(rq.prompt), true);
      card.appendChild(mb);
    } else {
      card.appendChild(el('div', 'qdir', rq.prompt));
    }
  } else {
    card.appendChild(el('div', 'qdir', rq.prompt && rq.prompt.length > 90 ? rq.prompt : ''));
    const mb = el('div', 'qmath');
    const bodyTex = String(rq.prompt || '').replace(/^\$|\$$/g, '');
    paint(mb, bodyTex, true);
    card.appendChild(mb);
  }

  const zone = el('div', 'answer-zone');
  card.appendChild(zone);
  const hintZone = el('div', 'hint-zone'); card.appendChild(hintZone);
  const fbZone = el('div', 'feedback'); card.appendChild(fbZone);
  const stepZone = el('div', 'step-zone'); card.appendChild(stepZone);
  cont.appendChild(card);

  buildInput(rq, zone, hintZone, fbZone, stepZone);
  drawHints(hintZone);
  drawSteps(rq, stepZone);

  /* navigation dots */
  if (!S.similar) {
    const set = setOf(S.id);
    if (set) {
      const bar = el('div', 'setbar');
      set.ids.forEach((id, i) => {
        const cls = 'dot' + (id === S.id ? ' cur' : '') + (store.solved[id] ? ' done' : (store.tried[id] ? ' tried' : ''));
        const d = el('a', cls);
        d.href = '#/q/' + id;
        d.textContent = String(i + 1);
        d.title = 'Question ' + BANK_BY_ID[id].n;
        bar.appendChild(d);
      });
      cont.appendChild(bar);
    }
  }
  wrap('#/practice', cont);
}

/* True when the prompt is written in LaTeX rather than English prose:
   strip out any $…$ chunks, and if a LaTeX command is still there it is maths.
   (Checking for long letter runs does NOT work — "frac" itself is four letters.) */
function isStandaloneTex(p) {
  const rest = String(p).replace(/\$[^$]*\$/g, '');
  return /\\[a-zA-Z]+/.test(rest);
}
function stripOuterDollars(s) { return String(s).trim().replace(/^\$|\$$/g, ''); }

/* ------- input builders ------- */
function buildInput(rq, zone, hintZone, fbZone, stepZone) {
  zone.innerHTML = '';
  if (rq.kind === 'mcq') {
    const list = el('div', 'mcq-list');
    (rq.opts || []).forEach((o, i) => {
      const b = el('button', 'mcq-opt');
      const letter = el('span', 'opt-letter', 'ABCD'[i] + '.');
      b.appendChild(letter);
      paint(b.appendChild(document.createElement('span')), o, false);
      b.onclick = () => {
        if (zone.dataset.locked) return;
        zone.dataset.locked = '1';
        grade(rq, i, zone, fbZone, stepZone, b);
      };
      list.appendChild(b);
    });
    zone.appendChild(list);
    return;
  }
  if (rq.kind === 'yn') {
    const row = el('div', 'btn-row');
    const y = el('button', 'btn big yes'); y.textContent = '✓ Yes, I agree';
    const n = el('button', 'btn big no'); n.textContent = '✗ No, I disagree';
    y.onclick = () => grade(rq, 'yes', zone, fbZone, stepZone);
    n.onclick = () => grade(rq, 'no', zone, fbZone, stepZone);
    row.append(y, n);
    zone.appendChild(row);
    zone.appendChild(el('p', 'tips', '_Say what you think first — then compare with the reasoning in the solution._'));
    return;
  }
  /* text entry: expression or number */
  const box = el('div', 'textin-box');
  const inp = document.createElement('input');
  inp.className = 'ans-in';
  inp.autocomplete = 'off'; inp.spellcheck = false;
  inp.placeholder = rq.kind === 'num'
    ? 'Type a number, e.g.  42   or  19/36'
    : 'e.g.  2y/(1-2y)   or   (x-5y)/((3x+y)(x-y))   or   -3/2';
  const prev = el('div', 'preview', '_Your answer will appear here in proper maths notation as you type._');
  inp.addEventListener('input', () => {
    prev.innerHTML = '';
    const t = previewTex(inp.value);
    if (t) { paint(prev, t, true); }
    else if (inp.value.trim()) { prev.textContent = inp.value; }
    else { renderMathInto(prev, '_Your answer will appear here in proper maths notation as you type._'); }
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') check.click(); });
  const check = el('button', 'btn primary', 'Check my answer');
  check.onclick = () => grade(rq, inp.value, zone, fbZone, stepZone);
  box.append(inp, prev);
  const row = el('div', 'ans-row');
  row.appendChild(check);
  box.appendChild(row);
  zone.appendChild(box);
  zone.appendChild(el('p', 'tips', rq.kind === 'num'
    ? '_Fractions are fine: type 19/36. Answers left in terms of π can be written 243pi._'
    : '_Use * for multiply, / for divide, ^ for powers. Brackets matter: 3/2b means 3/(2b). Equivalent forms are accepted._'));
  setTimeout(() => { try { inp.focus(); } catch (e) { } }, 30);
}

/* ------- hints ------- */
function drawHints(zone) {
  const rq = cur();
  zone.innerHTML = '';
  for (let i = 0; i < S.hintsUsed && i < rq.hints.length; i++) {
    zone.appendChild(el('div', 'hint', '💡 ' + rq.hints[i]));
  }
  if (S.hintsUsed < rq.hints.length) {
    const b = el('button', 'btn small hint');
    b.textContent = S.hintsUsed === 0 ? '💡 Give me a hint' : '💡 Another hint (' + (rq.hints.length - S.hintsUsed) + ' left)';
    b.onclick = () => { S.hintsUsed++; drawHints(zone); };
    zone.appendChild(b);
  }
}

/* ------- steps ------- */
function drawSteps(rq, zone) {
  zone.innerHTML = '';
  if (S.stepIdx === 0) return;
  const box = el('div', 'steps-box');
  box.appendChild(el('div', 'steps-title', 'Step-by-step solution'));
  for (let i = 0; i < S.stepIdx && i < rq.steps.length; i++) {
    const st = rq.steps[i];
    const row = el('div', 'step');
    const m = st.m || '';
    if (/^\$/.test(m) && /\$$/.test(m)) renderMathInto(row, m);
    else {
      const dv = el('div', 'math-display');
      paint(dv, String(m).replace(/^\$|\$$/g, ''), true);
      row.appendChild(dv);
    }
    if (st.n) row.appendChild(el('div', 'step-note', st.n));
    box.appendChild(row);
    void m;
  }
  zone.appendChild(box);
}
function revealSteps(rq, zone, fbZone) {
  S.usedSteps = true;
  if (S.stepIdx === 0) S.stepIdx = 1;
  else S.stepIdx = Math.min(S.stepIdx + 1, rq.steps.length);
  drawSteps(rq, zone);
  if (S.stepIdx >= rq.steps.length) {
    const after = el('div', 'btn-row');
    const back = el('button', 'btn primary');
    back.textContent = '🔁 Now I’ll try it again';
    back.onclick = () => { draw(); };
    after.appendChild(back);
    zone.appendChild(after);
  }
}

/* ------- grading ------- */
function grade(rq, val, zone, fbZone, stepZone) {
  S.attempts++;
  const ok = isCorrect(rq, val);
  record(ok, rq);
  feedback(ok, rq, val, zone, fbZone, stepZone);
}
function record(ok, rq) {
  const key = rq.key || 'sim:' + S.id;
  const base = BANK_BY_ID[S.id];
  const fam = base ? base.fam : rq.fam;
  if (base) store.tried[base.id] = true;
  store.skills[fam] = store.skills[fam] || { a: 0, c: 0 };
  store.skills[fam].a++;
  if (ok) store.skills[fam].c++;
  if (ok) {
    store.streak++;
    store.bestStreak = Math.max(store.bestStreak, store.streak);
    if (!S.similar) {
      if (!store.solved[S.id]) {
        const gain = S.usedSteps ? 2 : (S.hintsUsed > 0 ? 5 : 10);
        store.xp += gain;
        store.solved[S.id] = (S.usedSteps || S.hintsUsed) ? 'helped' : 'solved';
      }
    } else store.xp += 3;
  } else store.streak = 0;
  void key;
  save();
}
function feedback(ok, rq, val, zone, fbZone, stepZone) {
  fbZone.innerHTML = '';
  const box = el('div', 'fb ' + (ok ? 'fb-ok' : 'fb-bad'));
  if (ok) {
    box.appendChild(el('div', 'fb-title', pickA(S.similar ? PRAISE_SIM : PRAISE)));
    const row = el('div', 'btn-row');
    if (S.similar) {
      const back = el('button', 'btn');
      back.textContent = '↩ Back to question ' + BANK_BY_ID[S.id].n;
      back.onclick = () => { S.similar = null; S.hintsUsed = 0; S.stepIdx = 0; S.usedSteps = false; draw(); };
      row.appendChild(back);
      const more = el('button', 'btn teal');
      more.textContent = '🎯 Another similar question';
      more.onclick = () => serveSimilar(true);
      row.appendChild(more);
    }
    row.appendChild(nextBtn());
    box.appendChild(row);
    if (rq.ansTex) {
      const a = el('div', 'fb-ans');
      renderMathInto(a, '**Answer:** $' + rq.ansTex + '$');
      box.appendChild(a);
    }
    const teach = el('button', 'btn small ghost');
    teach.textContent = '📖 See the full method';
    teach.onclick = () => { S.usedSteps = true; S.stepIdx = rq.steps.length; drawSteps(rq, stepZone); };
    row.appendChild(teach);
    fbZone.appendChild(box);
    return;
  }
  /* wrong */
  box.appendChild(el('div', 'fb-title', pickA(rq.kind === 'mcq' ? NUDGE_MCQ : NUDGE)));
  if (rq.kind === 'mcq' && val !== null && val !== undefined) {
    const opts = zone.querySelectorAll('.mcq-opt');
    opts.forEach((b, i) => {
      if (i === Number(rq.expected)) b.classList.add('reveal-ok');
      else if (i === Number(val)) b.classList.add('picked-wrong');
    });
  }
  const row = el('div', 'btn-row');
  const sim = el('button', 'btn primary');
  sim.textContent = '🎯 Give me a similar question';
  sim.onclick = () => serveSimilar(false);
  const again = el('button', 'btn');
  again.textContent = '🔁 Let me retry';
  again.onclick = () => { draw(); };
  const steps = el('button', 'btn ghost');
  steps.textContent = '👀 Show me the method';
  steps.onclick = () => revealSteps(rq, stepZone, fbZone);
  row.append(sim, again, steps);
  box.appendChild(row);
  box.appendChild(el('p', 'fb-sub', '_Nothing counts against you here. The similar question uses the same idea with different numbers — do that one, then come back._'));
  fbZone.appendChild(box);
}
function serveSimilar(keepGoing) {
  const base = BANK_BY_ID[S.id];
  const hard = base.lvl === 2 || S.attempts >= 2;
  let fam = base.fam;
  if (fam === 'change') fam = 'word';
  let g = null;
  for (let i = 0; i < 40; i++) {
    try { g = genSimilar(fam, !!hard); } catch (e) { g = null; }
    if (g) break;
  }
  if (!g) { try { g = genSimilar('cancel', false); } catch (e) { g = null; } }
  if (!g) { draw(); return; }
  S.similar = fromGen(g, fam, hard);
  S.hintsUsed = 0; S.stepIdx = 0; S.usedSteps = false;
  if (keepGoing) S.attempts = 0;
  draw();
}
function nextBtn() {
  if (S.similar) {
    return el('button', 'btn ghost');
  }
  const set = setOf(S.id);
  if (set) {
    const i = set.ids.indexOf(S.id);
    if (i > -1 && i < set.ids.length - 1) {
      const b = el('button', 'btn primary');
      b.textContent = 'Next question →';
      b.onclick = () => nav('#/q/' + set.ids[i + 1]);
      return b;
    }
    const d = el('button', 'btn primary');
    d.textContent = '🏁 Set done — back to sets';
    d.onclick = () => nav('#/practice');
    return d;
  }
  const b = el('button', 'btn primary');
  b.textContent = '▶ Next smart question';
  b.onclick = () => nav('#/smart');
  return b;
}

/* ============================= PROGRESS =============================== */
function viewProgress() {
  const o = overall();
  const box = el('div', null);
  box.appendChild(el('h1', 'page-title', '📊 Your progress'));
  box.appendChild(el('p', 'page-sub', 'Stored locally on this device — nothing leaves your browser.'));

  const stats = el('div', 'prog-top');
  const accuracy = (function () {
    let a = 0, c = 0;
    for (const k in store.skills) { a += store.skills[k].a; c += store.skills[k].c; }
    return a ? Math.round(c / a * 100) : 0;
  })();
  [['Questions mastered', o.done + '/' + o.total], ['Accuracy', accuracy + '%'],
  ['Best streak', String(store.bestStreak)], ['XP', String(store.xp)]]
    .forEach(([lbl, num]) => {
      const s = el('div', 'stat');
      s.appendChild(el('div', 'stat-num', num));
      s.appendChild(el('div', 'stat-lbl', lbl));
      stats.appendChild(s);
    });
  box.appendChild(stats);

  const ring = el('div', 'home-ring');
  ring.innerHTML = ringSvg(o.pct, o.pct + '%', 'of the workbook');
  box.appendChild(ring);

  const skillsCard = el('section', 'card');
  skillsCard.appendChild(el('h2', null, '🎯 Skill by skill'));
  const seen = {};
  BANK.forEach(q => { seen[skillName(q.fam)] = seen[skillName(q.fam)] || skillKey(q.fam); });
  Object.keys(seen).forEach(nm => {
    const famKeys = Object.keys(SKILLS).filter(k => SKILLS[k] === nm);
    let a = 0, c = 0;
    famKeys.forEach(k => { const s = store.skills[k]; if (s) { a += s.a; c += s.c; } });
    const pct = a ? Math.round(c / a * 100) : 0;
    const row = el('div', 'skill-row');
    row.appendChild(el('div', 'skill-name', nm));
    const pr = document.createElement('progress');
    pr.value = pct; pr.max = 100;
    row.appendChild(pr);
    row.appendChild(el('div', 'skill-val', a ? pct + '% of ' + a : 'not tried'));
    skillsCard.appendChild(row);
  });
  box.appendChild(skillsCard);

  const setCard = el('section', 'card');
  setCard.appendChild(el('h2', null, '🏋️ Practice sets'));
  SETS.forEach(s => {
    const p = setProgress(s);
    const row = el('a', 'list-row');
    row.href = '#/practice/' + s.id;
    row.innerHTML = '<span class="ic">' + s.icon + '</span><span style="flex:1"><span class="nm">' + s.title +
      '</span><br><progress value="' + p.pct + '" max="100"></progress></span><span style="font-size:12.5px;color:var(--fg2)">' +
      p.done + '/' + p.total + '</span>';
    setCard.appendChild(row);
  });
  box.appendChild(setCard);

  const row = el('div', 'btn-row');
  const reset = el('button', 'btn');
  reset.textContent = '🗑 Reset all progress';
  reset.onclick = () => {
    if (confirm('Clear your XP, streaks and every completed question in this chapter on this device?')) {
      /* wipe in place — the shell (and the progress page) hold a live
         reference to this exact object, so it must not be replaced */
      Object.keys(store).forEach(k => { delete store[k]; });
      Object.assign(store, DEFAULTS);
      save(); nav('#/home'); route();
    }
  };
  row.appendChild(reset);
  box.appendChild(row);

  wrap('#/progress', box);
}

/* ---------------------------------------------------------- exports ----- */
/* The shell drives this chapter through these three entry points. */
var __api = {
  mount: function (host) { app = host; },
  route: function (path) { __path = path || 'home'; route(); },
  unmount: function () { app = null; }
};
