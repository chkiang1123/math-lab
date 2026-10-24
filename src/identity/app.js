/* ============================================================
   app.js — Identity Lab SPA
   ============================================================ */

/* ---------- persistent state ---------- */
/* The shell owns persistence in the merged site so both chapters share one
   progress record. `store` is injected before this bundle is used. */
var store = window.__ML.state.identity;
const DEFAULT_STATE = window.__ML.DEFAULTS;   // shape template, owned by the shell
function save() { window.__ML.save(); }

/* ---------- math + markdown rendering ---------- */
function hasKatex() { return typeof katex !== 'undefined'; }
function renderMathInto(el, text) {
  el.innerHTML = '';
  const segs = String(text).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  for (const seg of segs) {
    if (!seg) continue;
    if (seg.startsWith('$$')) {
      const d = document.createElement('div');
      d.className = 'math-display';
      const src = seg.slice(2, -2);
      if (hasKatex()) { try { katex.render(src, d, { displayMode: true, throwOnError: false }); } catch (e) { d.textContent = src; } }
      else d.textContent = src;
      el.appendChild(d);
    } else if (seg.startsWith('$')) {
      const sp = document.createElement('span');
      sp.className = 'math-inline';
      const src = seg.slice(1, -1);
      if (hasKatex()) { try { katex.render(src, sp, { throwOnError: false }); } catch (e) { sp.textContent = src; } }
      else sp.textContent = src;
      el.appendChild(sp);
    } else {
      renderRichText(el, seg);
    }
  }
}
function renderRichText(el, text) {
  const lines = String(text).split('\n');
  lines.forEach((line, i) => {
    if (i > 0) el.appendChild(document.createElement('br'));
    const parts = line.split('**');
    parts.forEach((p, j) => {
      if (j % 2 === 1) { const s = document.createElement('strong'); s.textContent = p; el.appendChild(s); }
      else el.appendChild(document.createTextNode(p));
    });
  });
}
function texPlainToTex(s) { // for live answer preview
  return String(s).replace(/[\u2212]/g, '-').replace(/\*/g, '\\cdot ').replace(/\^(\d+)/g, '^{$1}');
}

/* ---------- microcopy ---------- */
const PRAISE = ['Nice work — that\u2019s correct!', 'Correct! You\u2019ve got the pattern down.', 'Yes! Clean and accurate.', 'That\u2019s it. Well spotted.', 'Correct — you made that look easy.'];
const NUDGE = [
  'Not quite — but this is exactly how learning works. Compare your answer with the method.',
  'Close! Check the signs — that\u2019s where most marks slip.',
  'Not yet. Look at the structure of the expression again.',
  'Not quite. Try a similar question first to warm up.'
];
function pickA(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ---------- router ---------- */
/* The shell owns location.hash and hands each chapter the part of the path
   that belongs to it; `app` is the container the shell gives us to draw in.
   In-chapter hashes stay relative (#/home) and the shell rewrites them to
   #/identity/home, so none of the code below had to change. */
var app = null;
var __path = 'home';
function nav(hash) { location.hash = window.__ML.prefix + String(hash).replace(/^#\/?/, '/'); }

function route() {
  const h = String(__path || 'home').replace(/^\/+/, '');
  const [head, arg] = h.split('/');
  window.scrollTo(0, 0);
  if (head === '' || head === 'home') return viewHome();
  if (head === 'learn') return viewLearn(arg);
  if (head === 'practice') return arg ? viewSet(arg) : viewPractice();
  if (head === 'q') return viewQuestion(arg);
  if (head === 'smart') return startSmart();
  if (head === 'progress') return viewProgress();
  viewHome();
}

/* ---------- shared layout bits ---------- */
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) renderMathInto(e, html); return e; }
function skillProgress(skill) {
  const s = store.skills[skill] || { a: 0, c: 0 };
  return s.a === 0 ? 0 : Math.round((s.c / s.a) * 100);
}
function header(active) {
  const h = el('header', 'topbar');
  const logo = el('a', 'logo');
  logo.href = '#/home';
  logo.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" rx="2" fill="var(--acc)"/><rect x="13" y="2" width="9" height="9" rx="2" fill="var(--acc2)" opacity="0.85"/><rect x="2" y="13" width="9" height="9" rx="2" fill="var(--acc2)" opacity="0.85"/><rect x="13" y="13" width="9" height="9" rx="2" fill="var(--acc)"/></svg><span>Identity&nbsp;Lab</span>';
  const navEl = el('nav', 'topnav');
  [['#/home', 'Home'], ['#/learn', 'Learn'], ['#/practice', 'Practice'], ['#/progress', 'Progress']].forEach(([href, label]) => {
    const a = el('a', 'navlink' + (href === active ? ' active' : ''));
    a.href = href; a.textContent = label;
    navEl.appendChild(a);
  });
  const right = el('div', 'topright');
  const xp = el('span', 'xp-chip', '$\\text{XP } ' + store.xp + '$');
  right.append(xp);
  h.append(logo, navEl, right);
  return h;
}
/* The shell renders the shared header (chapter switcher, XP, theme) and the
   footer, so `wrap` only has to fill the main column. */
function wrap(active, ...children) {
  app.innerHTML = '';
  const main = el('main', 'content');
  children.forEach(c => main.appendChild(c));
  app.appendChild(main);
}

/* ---------- HOME ---------- */
function viewHome() {
  const solvedCount = Object.values(store.solved).filter(s => s === 'solved' || s === 'helped').length;
  const total = Object.keys(BANK).length;
  const hero = el('section', 'hero');
  hero.appendChild(el('h1', null, 'Master **Identities & Factorization**'));
  hero.appendChild(el('p', 'hero-sub', 'Learn the patterns, practise the workbook questions, and when you get stuck — get hints, step-by-step solutions, and fresh similar questions to try.'));
  const heroBtns = el('div', 'btn-row');
  const b1 = el('button', 'btn primary'); b1.textContent = '▶ Smart Practice'; b1.onclick = () => nav('#/smart');
  const b2 = el('button', 'btn'); b2.textContent = '📖 Start with the notes'; b2.onclick = () => nav('#/learn');
  heroBtns.append(b1, b2);
  hero.appendChild(heroBtns);

  const ring = el('div', 'home-ring');
  const pct = total ? Math.round(solvedCount / total * 100) : 0;
  ring.innerHTML = ringSvg(pct, solvedCount + '/' + total, 'questions tried');

  const cols = el('div', 'home-cols');
  const learnCard = el('section', 'card');
  learnCard.appendChild(el('h2', null, '📖 Learn the patterns'));
  LEARN.forEach(u => {
    const row = el('a', 'list-row');
    row.href = '#/learn/' + u.id;
    row.innerHTML = '<span class="ic">' + u.icon + '</span><span><b>' + u.title.replace(/^\d+\.\s*/, '') + '</b><br><small>' + u.summary + '</small></span>';
    learnCard.appendChild(row);
  });
  const pracCard = el('section', 'card');
  pracCard.appendChild(el('h2', null, '🏋️ Practice sets'));
  SETS.forEach(s => {
    const done = s.ids.filter(id => store.solved[id]).length;
    const row = el('a', 'list-row');
    row.href = '#/practice/' + s.id;
    const lvl = s.level === 2 ? ' <span class="lvl">L2</span>' : '';
    row.innerHTML = '<span class="ic">' + (s.level === 2 ? '🔥' : '✏️') + '</span><span><b>' + s.title + lvl + '</b><br><progress value="' + done + '" max="' + s.ids.length + '"></progress> <small>' + done + '/' + s.ids.length + '</small></span>';
    pracCard.appendChild(row);
  });
  cols.append(learnCard, pracCard);
  const homeTop = el('div', 'home-top');
  homeTop.appendChild(ring);
  wrap('#/home', hero, homeTop, cols);
}
function ringSvg(pct, label, sub) {
  const r = 52, c = 2 * Math.PI * r;
  return '<svg width="140" height="140" viewBox="0 0 140 140"><circle cx="70" cy="70" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="70" cy="70" r="' + r + '" fill="none" stroke="var(--acc)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100) + ' ' + c + '" transform="rotate(-90 70 70)"/><text x="70" y="66" text-anchor="middle" fill="var(--fg)" font-size="22" font-weight="700">' + pct + '%</text><text x="70" y="88" text-anchor="middle" fill="var(--fg2)" font-size="11">' + label + '</text></svg><div class="ring-sub">' + sub + '</div>';
}

/* ---------- LEARN ---------- */
function viewLearn(unitId) {
  if (!unitId) {
    const head = el('h1', 'page-title', '📖 Summary notes');
    const grid = el('div', 'learn-grid');
    LEARN.forEach(u => {
      const c = el('a', 'card learn-card');
      c.href = '#/learn/' + u.id;
      c.innerHTML = '<div class="learn-ic">' + u.icon + '</div><h3>' + u.title + '</h3><p>' + u.summary + '</p>';
      grid.appendChild(c);
    });
    wrap('#/learn', head, grid);
    return;
  }
  const u = LEARN.find(x => x.id === unitId) || LEARN[0];
  const head = el('h1', 'page-title', u.icon + ' ' + u.title);
  head.prepend(el('a', 'backlink')); // placeholder
  const back = el('a', 'backlink'); back.href = '#/learn'; back.textContent = '← All notes';
  head.prepend(document.createTextNode(' '), back);
  const card = el('section', 'card learn-body');
  u.body.forEach(b => {
    if (b.h) card.appendChild(el('h3', 'note-h', b.h));
    if (b.formula) {
      const f = el('div', 'formula');
      renderMathInto(f, b.formula);
      card.appendChild(f);
    }
    if (b.p) card.appendChild(el('p', 'note-p', b.p));
    if (b.example) {
      const e = el('div', 'example');
      e.appendChild(el('div', 'ex-label', 'Worked example'));
      renderMathInto(e, b.example);
      card.appendChild(e);
    }
  });
  const actions = el('div', 'btn-row');
  const bp = el('button', 'btn primary');
  bp.textContent = '🏋️ Practise this now';
  bp.onclick = () => nav('#/practice/' + u.practice);
  actions.appendChild(bp);
  wrap('#/learn', head, card, actions);
}

/* ---------- PRACTICE ---------- */
let smartQueue = null;
function startSmart() {
  const ids = Object.keys(BANK);
  const wrong = ids.filter(id => store.attempted[id] && !store.solved[id]);
  const seen = ids.filter(id => store.solved[id]);
  const unseen = ids.filter(id => !store.attempted[id]);
  const score = id => (wrong.includes(id) ? 0 : unseen.includes(id) ? 1 : 2) + Math.random();
  smartQueue = ids.slice().sort((a, b) => score(a) - score(b)).slice(0, 8);
  smartQueue = { list: smartQueue, i: 0 };
  nav('#/q/' + smartQueue.list[0] + '?smart=1');
}
function viewPractice() {
  const head = el('h1', 'page-title', '🏋️ Practice sets');
  const sub = el('p', 'page-sub', 'Work through the workbook questions set by set. Get one wrong? You\u2019ll get a fresh similar question, hints, and a full step-by-step solution.');
  const grid = el('div', 'learn-grid');
  SETS.forEach(s => {
    const done = s.ids.filter(id => store.solved[id]).length;
    const c = el('a', 'card learn-card');
    c.href = '#/practice/' + s.id;
    c.innerHTML = '<div class="set-lvl lvl' + s.level + '">' + (s.level === 2 ? 'Level 2' : 'Level 1') + '</div><h3>' + s.title + '</h3><p>' + s.desc + '</p><progress value="' + done + '" max="' + s.ids.length + '"></progress><small>' + done + ' / ' + s.ids.length + ' solved</small>';
    grid.appendChild(c);
  });
  wrap('#/practice', head, sub, grid);
}
function viewSet(setId) {
  const s = SETS.find(x => x.id === setId) || SETS[0];
  const back = el('a', 'backlink'); back.href = '#/practice'; back.textContent = '← All sets';
  const head = el('h1', 'page-title', s.title);
  head.prepend(document.createTextNode(' '), back);
  const sub = el('p', 'page-sub', s.desc);
  const grid = el('div', 'qgrid');
  s.ids.forEach((id, i) => {
    const q = BANK[id];
    const st = store.solved[id];
    const c = el('a', 'qcell' + (st ? ' solved' : (store.attempted[id] ? ' tried' : '')));
    c.href = '#/q/' + id;
    c.innerHTML = '<span class="qn">' + (id[0] === 'm' ? 'MCQ ' + id.slice(1) : 'Q' + id.slice(1)) + '</span>' +
      (st === 'solved' ? ' <span class="badge ok">✓ solved</span>' : st === 'helped' ? ' <span class="badge mid">✓ with help</span>' : store.attempted[id] ? ' <span class="badge bad">retry</span>' : '');
    grid.appendChild(c);
  });
  wrap('#/practice', head, sub, grid);
}

/* ---------- QUESTION VIEW ---------- */
let S = null; // session state
function viewQuestion(qid) {
  const smart = /[?&]smart=1/.test(qid);
  qid = qid.split('?')[0];          // strip the query string BEFORE the lookup
  const q = BANK[qid];
  if (!q) return viewHome();
  S = { qid, phase: 'main', partIdx: 0, hints: 0, stepsShown: 0, attempts: 0, usedSteps: false, smart };
  drawMain(q);
}
function currentQObj() {
  return S.phase === 'similar' ? S.similarQ : BANK[S.qid];
}
function drawMain(q) {
  const parts = q.kind === 'multi' ? q.parts : [null];
  const part = parts[S.partIdx] || parts[0];
  const isSetQ = !S.smart;
  const container = el('div', 'qwrap');

  // breadcrumb
  const crumb = el('div', 'crumb');
  if (isSetQ) {
    const set = SETS.find(s => s.ids.includes(S.qid));
    if (set) {
      const a = el('a'); a.href = '#/practice/' + set.id; a.textContent = set.title;
      crumb.append(a, document.createTextNode(' · ' + (S.qid[0] === 'm' ? 'MCQ ' + S.qid.slice(1) : 'Question ' + S.qid.slice(1))));
    }
  } else {
    crumb.append(Object.assign(el('a'), { href: '#/q/' + S.qid, textContent: 'Back to original question' }));
  }

  const card = el('section', 'card qcard');
  if (S.phase === 'similar') {
    card.appendChild(el('div', 'sim-banner', '🎯 **Similar practice** — a fresh question of the same type. Take your time.'));
  }
  if (q.kind === 'multi') {
    card.appendChild(el('div', 'skill-tag', 'Multi-part challenge · part ' + part.label + ' (' + (S.partIdx + 1) + '/' + parts.length + ')'));
  } else {
    const skillName = SKILLS[q.skill || (BANK[S.qid] || {}).skill] || '';
    card.appendChild(el('div', 'skill-tag', (q.level === 2 ? 'Level 2' : 'Level 1') + ' · ' + skillName));
  }
  const qt = el('div', 'qtext');
  renderMathInto(qt, q.kind === 'multi' ? (S.partIdx === 0 ? q.q + '\n\n' + part.q : part.q) : q.q);
  card.appendChild(qt);

  const answerZone = el('div', 'answer-zone');
  buildAnswerUI(part || q, answerZone);
  card.appendChild(answerZone);

  const hintZone = el('div', 'hint-zone');
  card.appendChild(hintZone);
  const fbZone = el('div', 'feedback');
  card.appendChild(fbZone);
  const stepZone = el('div', 'step-zone');
  card.appendChild(stepZone);

  container.append(crumb, card);

  // set context bar
  if (isSetQ) {
    const set = SETS.find(s => s.ids.includes(S.qid));
    if (set) {
      const bar = el('div', 'setbar');
      set.ids.forEach((id, i) => {
        const dot = el('a', 'dot' + (id === S.qid ? ' cur' : '') + (store.solved[id] ? ' done' : ''));
        dot.href = '#/q/' + id; dot.textContent = i + 1;
        bar.appendChild(dot);
      });
      container.appendChild(bar);
    }
  }
  wrap('#/practice', container);

  /* ----- answer builders ----- */
  function buildAnswerUI(qo, zone) {
    zone.innerHTML = '';
    if (qo.kind === 'identity') {
      const row = el('div', 'btn-row');
      const y = el('button', 'btn big yes'); y.textContent = '✓ It is an identity';
      const n = el('button', 'btn big no'); n.textContent = '✗ Not an identity';
      y.onclick = () => grade(qo, 'yes');
      n.onclick = () => grade(qo, 'no');
      row.append(y, n);
      zone.appendChild(row);
    } else if (qo.kind === 'constants') {
      const row = el('div', 'const-row');
      qo.vars.forEach(v => {
        const lab = el('label', 'const-lab');
        renderMathInto(lab, '$' + v + ' = $');
        const inp = document.createElement('input');
        inp.className = 'const-in'; inp.dataset.var = v; inp.autocomplete = 'off';
        inp.placeholder = '?';
        lab.appendChild(inp);
        row.appendChild(lab);
      });
      const chk = el('button', 'btn primary'); chk.textContent = 'Check';
      chk.onclick = () => grade(qo, [...zone.querySelectorAll('.const-in')].map(i => i.value));
      row.appendChild(chk);
      zone.appendChild(row);
      zone.querySelector('input').focus();
    } else if (qo.kind === 'mcq') {
      const list = el('div', 'mcq-list');
      qo.options.forEach((o, i) => {
        const b = el('button', 'mcq-opt');
        renderMathInto(b, '$' + o.tex + '$');
        b.onclick = () => {
          if (zone.dataset.locked) return;
          zone.dataset.locked = '1';
          grade(qo, i);
        };
        list.appendChild(b);
      });
      zone.appendChild(list);
    } else if (qo.kind === 'numeric') {
      const row = el('div', 'const-row');
      const inp = document.createElement('input');
      inp.className = 'const-in wide'; inp.placeholder = 'Your answer'; inp.autocomplete = 'off';
      row.appendChild(inp);
      const chk = el('button', 'btn primary'); chk.textContent = 'Check';
      chk.onclick = () => grade(qo, inp.value);
      row.appendChild(chk);
      zone.appendChild(row);
      inp.focus();
    } else { // text: expand / factorise
      const box = el('div', 'textin-box');
      const inp = document.createElement('input');
      inp.className = 'text-in'; inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.placeholder = 'e.g.  (3x-5z)(2y+z)   or   9x^2 - 30pq + 25q^2';
      const prev = el('div', 'preview', '_Type your answer above — it will appear here in proper maths notation._');
      inp.addEventListener('input', () => {
        prev.innerHTML = '';
        if (inp.value.trim()) renderMathInto(prev, '$' + texPlainToTex(inp.value) + '$');
        else renderMathInto(prev, '_Type your answer above — it will appear here in proper maths notation._');
      });
      const chk = el('button', 'btn primary'); chk.textContent = 'Check';
      chk.onclick = () => grade(qo, inp.value);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') chk.click(); });
      box.append(inp, prev, chk);
      zone.appendChild(box);
      inp.focus();
    }
  }

  /* ----- grading ----- */
  function grade(qo, input) {
    S.attempts++;
    let ok = false;
    if (qo.kind === 'identity') ok = (input === qo.answer);
    else if (qo.kind === 'constants') {
      const vals = qo.values;
      ok = qo.vars.every((v, i) => checkNum(input[i], vals[i]));
    } else if (qo.kind === 'mcq') ok = qo.options[input].correct === true;
    else if (qo.kind === 'numeric') ok = checkNum(input, qo.answer);
    else ok = checkText(input, qo.accept);

    recordAttempt(ok);
    showFeedback(ok, qo, input);
  }

  function recordAttempt(ok) {
    const q = currentQObj();
    const skill = (BANK[S.qid] || {}).skill;
    store.attempted[S.qid] = true;
    if (skill) {
      store.skills[skill] = store.skills[skill] || { a: 0, c: 0 };
      store.skills[skill].a++;
      if (ok) store.skills[skill].c++;
    }
    if (ok) {
      store.streak++;
      store.bestStreak = Math.max(store.bestStreak, store.streak);
      if (S.phase === 'main' && !S.solved) {
        const gain = S.usedSteps ? 2 : (S.hints > 0 ? 5 : 10);
        store.xp += gain;
        if (!store.solved[S.qid]) store.solved[S.qid] = S.usedSteps ? 'helped' : (S.hints > 0 ? 'helped' : 'solved');
        else store.solved[S.qid] = store.solved[S.qid];
      } else if (S.phase === 'similar') {
        store.xp += 3;
      }
    } else {
      store.streak = 0;
    }
    save();
  }

  function showFeedback(ok, qo, input) {
    fbZone.innerHTML = '';
    const box = el('div', 'fb ' + (ok ? 'fb-ok' : 'fb-bad'));
    if (ok) {
      box.appendChild(el('div', 'fb-title', pickA(PRAISE)));
      if (S.phase === 'similar') box.appendChild(el('p', 'fb-sub', 'Similar question done — nice. You can go back to the original, or move on.'));
      const row = el('div', 'btn-row');
      if (S.phase === 'similar') {
        const back = el('button', 'btn'); back.textContent = '↩ Back to original question';
        back.onclick = () => { S.phase = 'main'; S.hints = 0; S.stepsShown = 0; S.usedSteps = false; drawMain(BANK[S.qid]); };
        row.appendChild(back);
      }
      const isMulti = BANK[S.qid].kind === 'multi';
      const parts = isMulti ? BANK[S.qid].parts : [null];
      if (S.phase === 'main' && isMulti && S.partIdx < parts.length - 1) {
        const nextP = el('button', 'btn primary'); nextP.textContent = 'Next part →';
        nextP.onclick = () => { S.partIdx++; S.hints = 0; S.stepsShown = 0; S.usedSteps = false; drawMain(BANK[S.qid]); };
        row.appendChild(nextP);
      } else {
        const nxt = nextButton();
        if (nxt) row.appendChild(nxt);
      }
      box.appendChild(row);
      if (qo.ansTex && qo.kind === 'text') { const a = el('div', 'fb-ans', 'Answer: $' + qo.ansTex + '$'); box.appendChild(a); }
    } else {
      box.appendChild(el('div', 'fb-title', pickA(NUDGE)));
      // show correct MCQ highlight
      if (qo.kind === 'mcq') {
        const opts = answerZone.querySelectorAll('.mcq-opt');
        opts.forEach((b, i) => { if (qo.options[i].correct) b.classList.add('reveal-ok'); });
        answerZone.dataset.locked = '1';
      }
      const row = el('div', 'btn-row');
      const sim = el('button', 'btn primary sim');
      sim.innerHTML = '🎯 Try a similar question';
      sim.onclick = serveSimilar;
      const tryAgain = el('button', 'btn'); tryAgain.textContent = '🔁 Let me try again';
      tryAgain.onclick = () => { fbZone.innerHTML = ''; drawMain(currentQObj()); };
      const steps = el('button', 'btn ghost'); steps.textContent = '👀 Show me step by step';
      steps.onclick = revealSteps;
      row.append(sim, tryAgain, steps);
      /* In smart practice a wrong answer used to dead-end here: the queue could
         only be advanced from the "correct" branch. Let students move on. */
      const skip = smartSkipButton();
      if (skip) row.appendChild(skip);
      box.appendChild(row);
      box.appendChild(el('p', 'fb-sub', 'Nothing is counted against you here — wrong answers are just information. Use the similar question to build up, or peek at the method.'));
    }
    fbZone.appendChild(box);
    if (ok) { revealStepsAvailable(); }
  }

  /* "Next smart question" for the wrong-answer branch. Returns null unless we're
     mid-queue in smart practice, so normal set practice is unaffected. */
  function smartSkipButton() {
    if (!S.smart || !smartQueue || S.phase !== 'main') return null;
    const qi = smartQueue.list.indexOf(S.qid);
    if (qi < 0 || qi >= smartQueue.list.length - 1) return null;
    const b = el('button', 'btn ghost'); b.textContent = '⏭ Next smart question';
    b.onclick = () => nav('#/q/' + smartQueue.list[qi + 1] + '?smart=1');
    return b;
  }

  function nextButton() {
    const isMulti = BANK[S.qid].kind === 'multi';
    if (isMulti && S.phase === 'main') return null;
    if (S.smart && smartQueue && S.phase === 'main') {
      const qi = smartQueue.list.indexOf(S.qid);
      if (qi > -1 && qi < smartQueue.list.length - 1) {
        const b = el('button', 'btn primary'); b.textContent = 'Next smart question →';
        b.onclick = () => nav('#/q/' + smartQueue.list[qi + 1] + '?smart=1');
        return b;
      }
    }
    const set = SETS.find(s => s.ids.includes(S.qid));
    if (set) {
      const qi = set.ids.indexOf(S.qid);
      if (qi < set.ids.length - 1) {
        const b = el('button', 'btn primary'); b.textContent = 'Next question →';
        b.onclick = () => nav('#/q/' + set.ids[qi + 1]);
        return b;
      }
      const done = el('button', 'btn primary'); done.textContent = '🏁 Set complete — back to sets';
      done.onclick = () => nav('#/practice');
      return done;
    }
    const b = el('button', 'btn'); b.textContent = '🏠 Home';
    b.onclick = () => nav('#/home');
    return b;
  }

  function serveSimilar() {
    const q = BANK[S.qid];
    let gen = q.gen || pickGenFor(q);
    let g;
    try { g = gen(); } catch (e) { g = null; }
    if (!g) {
      fbZone.innerHTML = '';
      const box = el('div', 'fb fb-bad');
      box.appendChild(el('div', 'fb-title', 'A fresh version of this exact question is not available — but you can retry it, or study the worked steps.'));
      const row = el('div', 'btn-row');
      const st = el('button', 'btn primary'); st.textContent = '👀 Show me step by step'; st.onclick = revealSteps;
      row.appendChild(st); box.appendChild(row); fbZone.appendChild(box);
      return;
    }
    S.phase = 'similar';
    S.similarQ = g;
    S.hints = 0; S.stepsShown = 0; S.usedSteps = false;
    drawMain(g);
  }

  /* ----- hints ----- */
  const hintBtn = el('button', 'btn hint');
  hintBtn.innerHTML = '💡 Give me a hint';
  hintZone.appendChild(hintBtn);
  hintBtn.onclick = () => {
    const q = currentQObj();
    const qo = q.kind === 'multi' ? q.parts[S.partIdx] : q;
    const hints = qo.hints || q.hints || [];
    if (S.hints < hints.length) {
      const h = el('div', 'hint');
      renderMathInto(h, hints[S.hints]);
      hintZone.insertBefore(h, hintBtn);
      S.hints++;
      if (S.hints >= hints.length) { hintBtn.disabled = true; hintBtn.innerHTML = '💡 No more hints — you\u2019ve got the full picture'; }
      else hintBtn.innerHTML = '💡 Another hint (' + (S.hints + 1) + '/' + hints.length + ')';
    }
  };

  function revealStepsAvailable() {
    const b = el('button', 'btn ghost'); b.textContent = '👀 Review the worked steps';
    b.onclick = revealSteps;
    hintZone.appendChild(b);
  }

  /* ----- steps ----- */
  function revealSteps() {
    S.usedSteps = true;
    const q = currentQObj();
    const qo = q.kind === 'multi' ? q.parts[S.partIdx] : q;
    const steps = (q.kind === 'multi' ? qo.steps : qo.steps) || [];
    if (!steps.length) { stepZone.appendChild(el('p', 'fb-sub', 'Work through parts in order — each step uses the previous one.')); return; }
    stepZone.innerHTML = '';
    const box = el('div', 'steps-box');
    box.appendChild(el('div', 'steps-title', 'Step-by-step solution'));
    stepZone.appendChild(box);
    let i = 0;
    const next = el('button', 'btn small primary'); next.textContent = 'Show next step';
    box.appendChild(next);
    function showNext() {
      if (i >= steps.length) { next.remove(); return; }
      const s = el('div', 'step');
      renderMathInto(s, steps[i]);
      box.insertBefore(s, next);
      i++;
      if (i >= steps.length) {
        next.textContent = 'Got it ✓';
        next.disabled = true;
        const retry = el('button', 'btn small');
        retry.textContent = S.phase === 'main' ? '🔁 Now I\u2019ll try the original again' : '↩ Back to question';
        retry.onclick = () => { if (S.phase === 'similar') { S.phase = 'main'; S.hints = 0; S.stepsShown = 0; S.usedSteps = false; drawMain(BANK[S.qid]); } else { fbZone.innerHTML = ''; drawMain(currentQObj()); } };
        box.appendChild(retry);
      }
    }
    next.onclick = showNext;
    showNext();
  }
}

/* fallback generator picker for static questions without a direct gen */
function pickGenFor(q) {
  const map = {
    id1: genIdentity, id2: genFindAB, ex1: genExpandDiffSq, ex2: genExpandSq,
    fa1: genFactorCommon, fa2: genFactorGrouping, fa3: genFactorDiffSq, fa4: genFactorPerfectSq, ch1: genL2
  };
  return map[q.skill] || genIdentity;
}

/* ---------- PROGRESS ---------- */
function viewProgress() {
  const head = el('h1', 'page-title', '📈 Your progress');
  const top = el('div', 'prog-top');
  const c1 = el('div', 'card stat');
  const totalTried = Object.values(store.attempted).filter(Boolean).length;
  const totalSolved = Object.values(store.solved).filter(v => v === 'solved').length;
  const totalHelped = Object.values(store.solved).filter(v => v === 'helped').length;
  c1.innerHTML = '<div class="stat-num">' + store.xp + '</div><div>XP earned</div>';
  const c2 = el('div', 'card stat');
  c2.innerHTML = '<div class="stat-num">' + totalSolved + '<small>+' + totalHelped + '</small></div><div>solved (+' + totalHelped + ' with help)</div>';
  const c3 = el('div', 'card stat');
  c3.innerHTML = '<div class="stat-num">' + store.bestStreak + '</div><div>best streak</div>';
  top.append(c1, c2, c3);

  const card = el('section', 'card');
  card.appendChild(el('h2', null, 'Skills'));
  Object.entries(SKILLS).forEach(([k, name]) => {
    const p = skillProgress(k);
    const s = store.skills[k] || { a: 0, c: 0 };
    const row = el('div', 'skill-row');
    row.innerHTML = '<div class="skill-name">' + name + '</div><progress value="' + p + '" max="100"></progress><span class="skill-val">' + (s.a ? p + '%' : 'not started') + '</span>';
    card.appendChild(row);
  });

  const strug = Object.keys(store.attempted).filter(id => store.attempted[id] && !store.solved[id]);
  if (strug.length) {
    card.appendChild(el('h2', null, '🔄 Questions to revisit'));
    const row = el('div', 'btn-row');
    strug.slice(0, 8).forEach(id => {
      const b = el('a', 'btn small'); b.href = '#/q/' + id;
      b.textContent = (id[0] === 'm' ? 'MCQ ' + id.slice(1) : 'Q' + id.slice(1));
      row.appendChild(b);
    });
    card.appendChild(row);
  }

  const reset = el('button', 'btn ghost danger'); reset.textContent = 'Reset this chapter’s progress';
  reset.onclick = () => {
    if (confirm('Reset all XP, streaks and solved questions for this chapter? This cannot be undone.')) {
      /* wipe in place — the shell (and the progress page) hold a live
         reference to this exact object, so it must not be replaced */
      Object.keys(store).forEach(k => { delete store[k]; });
      Object.assign(store, DEFAULT_STATE);
      save(); route();
    }
  };
  wrap('#/progress', head, top, card, reset);
}

/* ---------- exports ---------- */
/* The shell drives this chapter through these three entry points. */
var __api = {
  mount: function (host) { app = host; },
  route: function (path) { __path = path || 'home'; route(); },
  unmount: function () { app = null; }
};
