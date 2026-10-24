/* ==========================================================================
   keypad.js — tap-to-enter answer pad for Math Lab

   Lives in the shell rather than inside a chapter so both apps get it for
   free: it watches for focus landing on any answer field (.ans-in,
   .const-in, .text-in) and floats a keypad above the page footer.

   Everything the pad inserts is plain ASCII that BOTH engines already
   accept — '*', '/', '^', '-', '+', '(', ')' — so nothing downstream had to
   change. The Fraction chapter converts them for marking, and the Identity
   chapter strips '*' and normalises unicode, so either way it marks fine.
   ========================================================================== */
(function () {
  'use strict';

  var OPEN_KEY = 'mathlab_keypad_open';

  /* Letters each chapter actually uses, most common first. */
  var VARS = {
    identity: ['x', 'y', 'a', 'b', 'p', 'q', 's', 'h', 'm', 'k', 't', 'z', 'n', 'c', 'v', 'u'],
    frac: ['x', 'y', 'a', 'b', 'c', 'm', 'n', 'p', 'q', 'k', 'h', 'v', 'u', 'r', 'd', 't', 'π']
  };

  /* [ label , what gets inserted ] */
  var GRID = [
    [['(', '('], [')', ')'], ['^', '^'], ['⌫', null]],
    [['7', '7'], ['8', '8'], ['9', '9'], ['÷', '/']],
    [['4', '4'], ['5', '5'], ['6', '6'], ['×', '*']],
    [['1', '1'], ['2', '2'], ['3', '3'], ['−', '-']],
    [['0', '0'], ['.', '.'], ['+', '+'], ['Clr', 'clear']]
  ];

  var INPUT_SEL = 'input.ans-in, input.const-in, input.text-in';
  var panel = null, target = null, open = true, dismissed = false;

  try {
    open = localStorage.getItem(OPEN_KEY) !== '0';
    /* An explicit "hide" is remembered for the session, so students with a
       real keyboard are not nagged back on every focus. Tapping the pad's
       floating button clears it again. */
    dismissed = open === false;
  } catch (e) { open = true; dismissed = false; }

  /* Both chapters build their answer box before it is attached to the DOM,
     so their own focus() silently does nothing. Focus it here instead — and
     lift it just above the docked pad so students can see what they tap. */
  function focusAnswerBox() {
    var box = document.querySelector(INPUT_SEL);
    if (!box || box === target) return;
    try { box.focus({ preventScroll: true }); } catch (e) { box.focus(); }
    target = box;
    refreshVars();
    if (open) liftAbovePad(box);
  }
  function liftAbovePad(box) {
    if (!box.getBoundingClientRect || !panel) return;
    var b = box.getBoundingClientRect();
    var padTop = panel.getBoundingClientRect().top;
    var gap = 22;
    var hidden = b.bottom - (padTop - gap);
    if (hidden <= 0) return;
    try { window.scrollBy({ top: -hidden, behavior: 'smooth' }); }
    catch (e) { window.scrollBy(0, -hidden); }
  }

  /* ------------------------------------------------------------ utils -- */
  function setOpen(v) {
    open = v;
    dismissed = !v;
    try { localStorage.setItem(OPEN_KEY, v ? '1' : '0'); } catch (e) { /* ignore */ }
    apply();
  }
  function current() {
    /* drop a stale reference left behind by a re-render */
    if (target && !document.body.contains(target)) target = null;
    return target;
  }
  function fire(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function insert(text) {
    var t = current();
    if (!t) return;
    var s = t.selectionStart, e = t.selectionEnd;
    if (s === null || s === undefined) s = e = t.value.length;
    t.value = t.value.slice(0, s) + text + t.value.slice(e);
    var p = s + text.length;
    try { t.setSelectionRange(p, p); } catch (err) { /* not supported */ }
    try { t.focus(); } catch (err) { /* ignore */ }
    fire(t);
  }
  function backspace() {
    var t = current();
    if (!t) return;
    var s = t.selectionStart, e = t.selectionEnd;
    if (s === null || s === undefined) s = e = t.value.length;
    if (s === e) s = Math.max(0, s - 1);
    t.value = t.value.slice(0, s) + t.value.slice(e);
    try { t.setSelectionRange(s, s); t.focus(); } catch (err) { /* ignore */ }
    fire(t);
  }
  function clear() {
    var t = current();
    if (!t) return;
    t.value = '';
    try { t.focus(); } catch (err) { /* ignore */ }
    fire(t);
  }
  function submit() {
    var t = current();
    if (!t) return;
    var zone = t.closest('.answer-zone') || t.parentNode;
    if (!zone) return;
    var btns = Array.prototype.slice.call(zone.querySelectorAll('button'));
    for (var i = 0; i < btns.length; i++) {
      if (/check/i.test(btns[i].textContent || '')) { btns[i].click(); break; }
    }
    /* the pad floats, so make sure the feedback is actually on screen */
    setTimeout(function () {
      var fb = document.querySelector('.fb, .feedback > div');
      if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 80);
  }

  /* ------------------------------------------------------------ build -- */
  function keyBtn(label, text, cls) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kp-key' + (cls ? ' ' + cls : '');
    b.textContent = label;
    /* keep the caret in the answer box — without this the blur would fire
       before the click and the pad would lose its target */
    var keep = function (e) { e.preventDefault(); };
    b.addEventListener('mousedown', keep);
    b.addEventListener('touchstart', keep, { passive: false });
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (text === null) backspace();
      else if (text === 'clear') clear();
      else insert(text);
    });
    return b;
  }

  function build() {
    panel = document.createElement('div');
    panel.className = 'kp';

    var head = document.createElement('div');
    head.className = 'kp-head';
    var title = document.createElement('span');
    title.className = 'kp-title';
    title.innerHTML = '⌨ Answer pad <small>— tap instead of typing</small>';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'kp-close';
    close.title = 'Hide the pad';
    close.textContent = '✕';
    close.addEventListener('click', function () { setOpen(false); });
    head.append(title, close);
    panel.appendChild(head);

    var vars = document.createElement('div');
    vars.className = 'kp-vars';
    var vlab = document.createElement('span');
    vlab.className = 'kp-vars-lab';
    vlab.textContent = 'letters';
    vars.appendChild(vlab);
    var list = document.createElement('div');
    list.className = 'kp-vars-list';
    vars.appendChild(list);
    panel.appendChild(vars);
    panel._vars = list;

    var grid = document.createElement('div');
    grid.className = 'kp-grid';
    GRID.forEach(function (row) {
      row.forEach(function (pair) {
        var isOp = pair[1] !== null && !/^[0-9.]$/.test(pair[1]);
        var isFn = pair[1] === null || pair[1] === 'clear';
        grid.appendChild(keyBtn(pair[0], pair[1], isFn ? 'kp-fn' : (isOp ? 'kp-op' : '')));
      });
    });
    panel.appendChild(grid);

    var go = document.createElement('button');
    go.type = 'button';
    go.className = 'kp-check';
    go.innerHTML = '✓ Check my answer';
    go.addEventListener('mousedown', function (e) { e.preventDefault(); });
    go.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    go.addEventListener('click', function (e) { e.preventDefault(); submit(); });
    panel.appendChild(go);

    document.body.appendChild(panel);

    /* collapsed state -> small floating re-open button */
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'kp-fab';
    fab.title = 'Show the answer pad';
    fab.textContent = '⌨';
    fab.addEventListener('click', function () { setOpen(true); });
    document.body.appendChild(fab);
    panel._fab = fab;

    apply();
  }

  function apply() {
    if (!panel) return;
    panel.classList.toggle('kp-hidden', !open);
    panel._fab.classList.toggle('kp-hidden', open);
    document.body.classList.toggle('kp-docked', open);
  }

  function refreshVars() {
    if (!panel || !panel._vars) return;
    var topic = window.__ML && window.__ML.current;
    var wanted = (topic && VARS[topic]) || VARS.identity;
    var seen = {};
    var list = panel._vars;
    list.innerHTML = '';
    /* anything already typed stays available even if it is off-list */
    var extra = [];
    if (target && target.value) {
      (target.value.match(/[a-zA-Zπ]/g) || []).forEach(function (c) { extra.push(c); });
    }
    wanted.concat(extra).forEach(function (v) {
      if (seen[v]) return;
      seen[v] = 1;
      list.appendChild(keyBtn(v, v, 'kp-var'));
    });
  }

  /* ------------------------------------------------------------ wiring - */
  function init() {
    build();
    refreshVars();

    document.addEventListener('focusin', function (e) {
      var el = e.target;
      if (!el || !el.matches || !el.matches(INPUT_SEL)) return;
      target = el;
      refreshVars();
      if (!open && !dismissed) setOpen(true);
      if (open) liftAbovePad(el);
    });

    /* re-render clears these; nothing to do until the next focus */
    document.addEventListener('focusout', function (e) {
      var el = e.target;
      if (el === target) refreshVars();
    });

    /* used by the shell when it swaps chapters / renders a question */
    window.__ML.refreshKeypad = refreshVars;
    window.__ML.focusAnswerBox = focusAnswerBox;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
