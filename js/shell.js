/* ==========================================================================
   shell.js — Math Lab: the shared frame around both chapters

   Identities & Factorization and Algebraic Fractions & Formulas were built
   as two separate apps with heavily overlapping global names (F, Poly, BANK,
   SETS, LEARN, rnd, engine helpers...). Rather than rewrite two verified
   question banks, each chapter is loaded into its own scope and this shell
   provides everything they used to provide for themselves:

     * one progress record for the whole site
     * the header (chapter switcher, XP, theme) and footer
     * routing:  #/<chapter>/<path>   e.g. #/frac/q/q29
     * rewriting in-chapter links (#/home -> #/frac/home)
   ========================================================================== */

/* ----------------------------------------------------------- state ----- */
var STORE_KEY = 'mathlab_v1';

/* Union of the two chapters' state shapes: Identity Lab tracks `attempted`,
   Fraction Lab tracks `tried`. Extra keys are harmless. */
var DEFAULTS = {
  xp: 0, streak: 0, bestStreak: 0,
  solved: {}, tried: {}, attempted: {}, skills: {}
};

var __ML = {
  DEFAULTS: DEFAULTS,
  topics: {},          // filled in by each chapter bundle
  current: null,       // which chapter is mounted right now
  state: null,         // { theme, identity: {...}, frac: {...} }
  save: save
};

/* `prefix` is read by each chapter's nav() at call time, so it always
   points at whichever chapter is on screen. */
Object.defineProperty(__ML, 'prefix', {
  get: function () { return '#/' + (__ML.current || 'identity'); }
});

var CHAPTERS = {
  identity: {
    id: 'identity',
    nav: 'Identities & Factorization',
    short: 'Identities',
    blurb: 'Expand, factorise and prove identities — Pearson 2A, Add. Rev. Ex. 2',
    source: 'Book 2A · Chapter 2',
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="2" y="2" width="9" height="9" rx="2" fill="var(--acc)"/>' +
      '<rect x="13" y="2" width="9" height="9" rx="2" fill="var(--acc2)" opacity=".85"/>' +
      '<rect x="2" y="13" width="9" height="9" rx="2" fill="var(--acc2)" opacity=".85"/>' +
      '<rect x="13" y="13" width="9" height="9" rx="2" fill="var(--acc)"/></svg>'
  },
  frac: {
    id: 'frac',
    nav: 'Algebraic Fractions & Formulas',
    short: 'Fractions',
    blurb: 'Simplify, add, substitute and change the subject — Pearson 2A, Add. Rev. Ex. 3',
    source: 'Book 2A · Chapter 3',
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M4 3h16v4H4z" rx="1" fill="var(--acc2)"/>' +
      '<path d="M9 10h11v11H9z" rx="1" fill="var(--acc)" opacity=".85"/>' +
      '<path d="M3 11h4v10H3z" rx="1" fill="var(--acc2)" opacity=".55"/></svg>'
  }
};
var ORDER = ['identity', 'frac'];

function freshChapter() { return JSON.parse(JSON.stringify(DEFAULTS)); }

function load() {
  var s = null;
  try { s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { s = null; }
  if (!s || typeof s !== 'object') s = {};
  var st = {
    theme: (s.theme === 'light' || s.theme === 'dark') ? s.theme : 'dark',
    identity: Object.assign(freshChapter(), s.identity || {}),
    frac: Object.assign(freshChapter(), s.frac || {})
  };
  return st;
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(__ML.state)); } catch (e) { /* private mode */ }
}
__ML.state = load();
document.documentElement.dataset.theme = __ML.state.theme;
window.__ML = __ML;

/* ------------------------------------------------------ tiny helpers --- */
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined && html !== null) e.innerHTML = html;
  return e;
}
function inert(s) { return String(s).replace(/&(?!amp;|lt;|gt;|#\d+;)/g, '&amp;').replace(/</g, '&lt;'); }
function pct(done, total) { return total ? Math.round(done / total * 100) : 0; }

/* Per-chapter progress. Identity Lab stores solved values as the strings
   'solved' / 'helped'; Fraction Lab stores truthy values. Both count. */
function chapterStats(id) {
  var st = __ML.state[id], ch = __ML.topics[id];
  if (!ch) return { done: 0, total: 0, pct: 0, xp: 0, notes: 0 };
  var BANK = ch.BANK;
  var ids = Array.isArray(BANK) ? BANK.map(function (q) { return q.id; }) : Object.keys(BANK);
  var done = 0;
  ids.forEach(function (i) { if (st.solved[i]) done++; });
  return {
    done: done,
    total: ids.length,
    pct: pct(done, ids.length),
    xp: st.xp || 0,
    notes: (ch.LEARN || []).length
  };
}
function totals() {
  var t = { done: 0, total: 0, xp: 0, notes: 0 };
  ORDER.forEach(function (id) {
    var s = chapterStats(id);
    t.done += s.done; t.total += s.total; t.xp += s.xp; t.notes += s.notes;
  });
  t.pct = pct(t.done, t.total);
  return t;
}

/* ---------------------------------------------------------- header ---- */
function navActive(path) {
  if (!path) return '#/home';
  var head = String(path).split('/')[0];
  if (head === 'learn') return '#/learn';
  if (head === 'practice' || head === 'q' || head === 'smart') return '#/practice';
  if (head === 'progress') return '#/progress';
  return '#/home';
}
function renderHeader(current, path) {
  var h = el('header', 'topbar');
  var logo = el('a', 'logo');
  logo.href = '#/';
  logo.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<rect x="2" y="2" width="9" height="9" rx="2" fill="var(--acc)"/>' +
    '<rect x="13" y="2" width="9" height="9" rx="2" fill="var(--acc2)" opacity=".85"/>' +
    '<rect x="2" y="13" width="9" height="9" rx="2" fill="var(--acc2)" opacity=".85"/>' +
    '<rect x="13" y="13" width="9" height="9" rx="2" fill="var(--acc)"/></svg><span>Math&nbsp;Lab</span>';

  /* chapter switcher — always visible, so jumping chapters is one click */
  var sw = el('div', 'chap-switch');
  ORDER.forEach(function (id) {
    var c = CHAPTERS[id];
    var b = el('a', 'chap-pill' + (id === current ? ' on' : ''));
    b.href = '#/' + id + '/home';
    b.textContent = c.nav;
    sw.appendChild(b);
  });

  var navEl = el('nav', 'topnav');
  if (current) {
    var act = navActive(path);
    [['#/home', 'Home'], ['#/learn', 'Learn'], ['#/practice', 'Practice'], ['#/progress', 'Progress']]
      .forEach(function (pair) {
        var a = el('a', 'navlink' + (pair[0] === act ? ' active' : ''));
        a.href = '#/' + current + pair[0].slice(1);
        a.textContent = pair[1];
        navEl.appendChild(a);
      });
  }

  var right = el('div', 'topright');
  var t = totals();
  right.appendChild(el('span', 'chip', 'XP ' + t.xp));
  if (current) {
    var st = chapterStats(current);
    right.appendChild(el('span', 'chip', st.done + '/' + st.total));
  }
  var th = el('button', 'theme-btn');
  th.textContent = __ML.state.theme === 'dark' ? '☀️' : '🌙';
  th.title = 'Switch light / dark';
  th.onclick = function () {
    __ML.state.theme = __ML.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = __ML.state.theme;
    save();
    route();
  };
  right.appendChild(th);

  h.append(logo, sw, navEl, right);
  return h;
}
function renderFooter() {
  var f = el('footer', 'foot');
  f.innerHTML = 'Math Lab · Identities &amp; Factorization and Algebraic Fractions &amp; Formulas ' +
    '(Pearson 2A, Additional Revision Exercises 2 &amp; 3) · works offline · ' +
    'progress is stored on this device only';
  return f;
}

/* ------------------------------------------------------- routing ------ */
var appEl = null;

function mountChapter(id, path) {
  var ch = CHAPTERS[id], topic = __ML.topics[id];
  if (!topic) { viewLanding(); return; }
  __ML.current = id;
  appEl.innerHTML = '';
  appEl.appendChild(renderHeader(id, path));
  var host = el('div', 'chapter-host');
  host.setAttribute('data-topic', id);
  appEl.appendChild(host);
  appEl.appendChild(renderFooter());
  topic.mount(host);
  topic.route(path);
  /* the answer pad: show each chapter's own letters, and put the caret in
     the first answer box (both chapters focus too early to do it themselves) */
  if (window.__ML.refreshKeypad) window.__ML.refreshKeypad();
  if (window.__ML.focusAnswerBox) setTimeout(window.__ML.focusAnswerBox, 60);
}

function route() {
  var h = String(location.hash || '#/').replace(/^#\/?/, '');
  var parts = h.split('/');
  var head = parts[0];
  window.scrollTo(0, 0);
  __ML.current = null;
  if (head === '' || head === 'home') return viewLanding();
  if (head === 'progress') return viewProgress();
  if (CHAPTERS[head]) {
    __ML.current = head;
    var rest = parts.slice(1).join('/');
    return mountChapter(head, rest || 'home');
  }
  viewLanding();
}

/* In-chapter markup uses relative hashes (#/home). Rewrite them on the way
   out so the browser lands on #/frac/home. */
document.addEventListener('click', function (e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  var tgt = e.target;
  if (!tgt || !tgt.closest) return;
  var a = tgt.closest('a[href^="#/"]');
  if (!a) return;
  var host = a.closest('[data-topic]');
  if (!host) return;                       // header/shell links are already absolute
  var t = host.getAttribute('data-topic');
  var href = a.getAttribute('href');
  if (href === '#/' + t || href.indexOf('#/' + t + '/') === 0) return;
  e.preventDefault();
  location.hash = '#/' + t + href.slice(1);
}, true);

/* ------------------------------------------------- landing page ------- */
function ringSvg(p, big, small) {
  var r = 52, c = 2 * Math.PI * r, off = c * (1 - p / 100);
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

function viewLanding() {
  appEl.innerHTML = '';
  appEl.appendChild(renderHeader(null, null));

  var main = el('main', 'content');
  var t = totals();

  var hero = el('section', 'hero');
  hero.appendChild(el('h1', null, 'Math Lab'));
  hero.appendChild(el('p', null,
    'Two chapters of Book 2A, in one place. Read a summary, try the workbook questions, ' +
    'ask for a hint when you get stuck — and if you get one wrong, the app writes you a ' +
    'fresh question of the same type to try again.'));
  var row = el('div', 'home-top');
  var b1 = el('a', 'btn primary'); b1.href = '#/identity/home'; b1.textContent = '▶ Smart practice';
  var b2 = el('a', 'btn'); b2.href = '#/progress'; b2.textContent = 'My progress';
  row.append(b1, b2);
  hero.appendChild(row);
  main.appendChild(hero);

  var ring = el('div', 'home-ring');
  ring.innerHTML = ringSvg(t.pct, t.done + '/' + t.total, 'questions mastered');
  ring.appendChild(el('p', null, '<i>' + t.done + ' of ' + t.total + ' questions done · ' +
    t.xp + ' XP · ' + t.notes + ' summary notes</i>'));
  main.appendChild(ring);

  var grid = el('div', 'learn-grid');
  ORDER.forEach(function (id) {
    var c = CHAPTERS[id], s = chapterStats(id);
    var card = el('a', 'card learn-card');
    card.href = '#/' + id + '/home';
    card.innerHTML =
      '<div class="learn-ic">' + c.icon + '</div>' +
      '<h3>' + c.nav + '</h3>' +
      '<p>' + c.blurb + '</p>' +
      '<div class="set-meta"><span>' + c.source + '</span> <span>' +
      s.done + ' / ' + s.total + ' mastered</span></div>' +
      '<progress value="' + s.pct + '" max="100" style="margin-top:10px"></progress>' +
      '<small>' + s.notes + ' summary notes · ' + s.xp + ' XP</small>';
    grid.appendChild(card);
  });
  main.appendChild(grid);

  var how = el('section', 'card how');
  how.appendChild(el('h2', null, '🛈 How this works'));
  var ol = document.createElement('ol');
  [
    '<b>Pick a chapter</b> — Identities &amp; Factorization, or Algebraic Fractions &amp; Formulas.',
    '<b>Read a summary</b> — each one covers a single skill with worked examples.',
    '<b>Try the practice set</b> — the real workbook questions, in order.',
    '<b>Stuck?</b> Ask for a hint. They arrive one step at a time, so you still do the thinking.',
    '<b>Got it wrong?</b> The app writes you a <b>brand-new similar question</b> of the same type.',
    '<b>Really stuck?</b> Reveal the full step-by-step solution.'
  ].forEach(function (x) { var li = document.createElement('li'); li.innerHTML = x; ol.appendChild(li); });
  how.appendChild(ol);
  main.appendChild(how);

  appEl.appendChild(main);
  appEl.appendChild(renderFooter());
}

/* ------------------------------------------------- combined progress --- */
function viewProgress() {
  appEl.innerHTML = '';
  appEl.appendChild(renderHeader(null, 'progress'));
  var main = el('main', 'content');
  var t = totals();

  main.appendChild(el('h1', 'page-title', '📊 My progress'));
  main.appendChild(el('p', 'page-sub',
    'Everything is stored on this device only — nothing is sent anywhere.'));

  var top = el('section', 'card');
  top.innerHTML = ringSvg(t.pct, t.done + '/' + t.total, 'overall');
  top.appendChild(el('p', 'set-meta', '<b>' + t.xp + ' XP</b> earned · ' +
    t.done + ' of ' + t.total + ' questions mastered across both chapters'));
  main.appendChild(top);

  ORDER.forEach(function (id) {
    var c = CHAPTERS[id], s = chapterStats(id), st = __ML.state[id];
    var card = el('section', 'card');
    card.innerHTML =
      '<h2><a href="#/' + id + '/home">' + c.nav + '</a></h2>' +
      '<div class="set-meta"><span>' + c.source + '</span> <span>' +
      s.done + ' / ' + s.total + ' mastered · ' + s.xp + ' XP · best streak ' +
      (st.bestStreak || 0) + '</span></div>' +
      '<progress value="' + s.pct + '" max="100" style="margin-top:10px"></progress>';

    /* weakest skills, straight from the chapter's own skill tallies */
    var sk = st.skills || {};
    var rows = Object.keys(sk).map(function (k) {
      var v = sk[k] || { a: 0, c: 0 };
      return { k: k, a: v.a || 0, c: v.c || 0, p: v.a ? Math.round(v.c / v.a * 100) : 0 };
    }).filter(function (r) { return r.a > 0; }).sort(function (x, y) { return x.p - y.p; }).slice(0, 4);

    if (rows.length) {
      var box = el('div', 'list-row');
      var ul = document.createElement('div');
      ul.style.flex = '1';
      rows.forEach(function (r) {
        var line = el('div', 'set-meta');
        line.innerHTML = '<span>' + inert(r.k) + '</span> <span>' + r.c + '/' + r.a + ' · ' + r.p + '%</span>';
        var pg = document.createElement('progress');
        pg.value = r.p; pg.max = 100; pg.style.marginTop = '4px';
        ul.appendChild(line); ul.appendChild(pg);
      });
      box.appendChild(ul);
      card.appendChild(box);
    }

    var go = el('a', 'btn');
    go.href = '#/' + id + '/practice';
    go.textContent = 'Practise this chapter →';
    card.appendChild(go);
    main.appendChild(card);
  });

  appEl.appendChild(main);
  appEl.appendChild(renderFooter());
}

/* ---------------------------------------------------------- boot ------ */
function boot() {
  appEl = document.getElementById('app');
  if (!appEl) return;
  window.addEventListener('hashchange', route);
  route();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* handy while debugging in the console */
window.__ML.CHAPTERS = CHAPTERS;
window.__ML.stats = chapterStats;
window.__ML.totals = totals;
