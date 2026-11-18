/* ==========================================================================
   Lecture deck — slide engine (classic script, no modules, works from file://)

   Sections register themselves:
     Deck.section({ id, order, num, kicker, title, color, sweep?, slides: [ slideDef, ... ] })
       color: palette token name from css/theme.css ('red' → --red fills, --red-t text) or a hex.
              The engine sets --sec / --sec-t on every slide of the section.
       sweep: optional list of 6 token names or hexes for the section-change panel sweep.

   slideDef = {
     id:        'loss',                  // unique within section → URL #/<section>/<slide>
     title:     'Custom loss',           // for presenter list
     heading:   'Grading a price…',      // optional → engine renders the standard header
     theme:     'dark' | 'light',        // default dark
     budgetSec: 120,                     // speaking time
     html:      string | (ctx) => string,
     build:     (ctx) => { … },          // add tweens to ctx.tl; call ctx.pause() between clicks
     notes:     'Spoken script… [click] next part…'
   }

   ctx = { el, q, qa, tl, pause, mode, cleanup(fn), sec, def }
     - Entrance = everything before the first ctx.pause(); it plays automatically.
     - Each ctx.pause() is one click. Back-navigation seeks instantly.
     - mode: 'show' | 'print' | 'preview'. In print/preview the slide is shown at its final state;
       skip ambient loops when ctx.mode !== 'show'.
   ========================================================================== */
(function () {
  'use strict';
  var W = 1920, H = 1080;
  var params = new URLSearchParams(location.search);
  var MODE = params.has('print') ? 'print' : params.has('preview') ? 'preview' : 'show';

  var Deck = (window.Deck = window.Deck || {});
  Deck._sections = [];
  Deck.mode = MODE;
  Deck.section = function (def) { Deck._sections.push(def); };

  /* Section colors come from each section def, never from this file:
       Deck.section({ id, color: 'red', sweep?: ['red', 'orange', ...], ... })
     `color` (and each `sweep` entry) is a palette token name from css/theme.css (--red, --red-t) or a raw hex.
     Without `sweep`, the section-change sweep alternates the section color with --orange and --charcoal. */
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim(); }
  function hexOf(c) { return !c ? '#888' : c.charAt(0) === '#' ? c : (cssVar(c) || '#888'); }
  function secColor(sec) { return hexOf(sec.color); }
  function secTint(sec) { var c = sec.color; return !c ? '#bbb' : c.charAt(0) === '#' ? c : (cssVar(c + '-t') || hexOf(c)); }
  function secSweep(sec) {
    var c = sec.color || 'orange';
    return (sec.sweep || [c, 'orange', c, 'charcoal', c, 'orange']).map(hexOf);
  }
  function secColors() { var m = {}; sections.forEach(function (s) { m[s.id] = secColor(s); }); return m; }

  var slides = [];       // { def, sec, index }
  var sections = [];
  var cur = -1, step = 0, live = null, pending = null, pendingTl = null, targetTime = 0;
  var stage, viewport, presenterWin = null;

  /* ---------------- build model ---------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function headerHtml(sec, def) {
    return '<header class="hd"><div class="tag t-caps"><i></i><b>' + esc(sec.num) + ' · ' + esc(sec.kicker) + '</b>' +
      (sec.title ? '<span class="sep">/</span><span>' + esc(sec.title) + '</span>' : '') + '</div>' +
      '<h1 class="t-h1">' + def.heading + '</h1></header>';
  }

  function mount(i, parent, mode) {
    var s = slides[i], def = s.def;
    var el = document.createElement('section');
    el.className = 'slide' + (def.theme === 'light' ? ' light' : '');
    el.setAttribute('data-sec', s.sec.id);
    el.setAttribute('data-slide', def.id);
    el.style.setProperty('--sec', secColor(s.sec));
    el.style.setProperty('--sec-t', def.theme === 'light' ? secColor(s.sec) : secTint(s.sec));  // light slides use the fill color for text
    var stops = [], cleanups = [];
    var tl = gsap.timeline({ paused: true });
    var ctx = {
      el: el, def: def, sec: s.sec, mode: mode, tl: tl,
      q: function (sel) { return el.querySelector(sel); },
      qa: function (sel) { return Array.prototype.slice.call(el.querySelectorAll(sel)); },
      // record a click point, then a tiny spacer so tweens added next never fire at the boundary itself
      pause: function () { stops.push(tl.duration()); tl.to({}, { duration: 0.02 }); },
      cleanup: function (fn) { cleanups.push(fn); }
    };
    var body = typeof def.html === 'function' ? def.html(ctx) : (def.html || '');
    el.innerHTML = (def.heading ? headerHtml(s.sec, def) : '') + body;
    parent.appendChild(el);
    var gctx = gsap.context(function () {
      if (def.build) {
        try { def.build(ctx); } catch (e) { console.error('[deck] build failed:', s.sec.id + '/' + def.id, e); }
      }
    }, el);
    // de-duplicate stops & drop a trailing stop equal to the end
    stops = stops.filter(function (t, k) { return k === 0 || t > stops[k - 1] + 1e-4; });
    return { el: el, tl: tl, stops: stops, ctx: ctx, gctx: gctx, cleanups: cleanups, index: i };
  }

  function unmount(L) {
    if (!L) return;
    L.cleanups.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    try { L.tl.kill(); L.gctx.kill(); } catch (e) {}
    if (L.el.parentNode) L.el.parentNode.removeChild(L.el);
  }

  function boundary(L, k) { return k < L.stops.length ? L.stops[k] : L.tl.duration(); }
  function nSteps(L) { return L.stops.length + 1; }

  function settle() {
    if (pending) { pending.kill(); pending = null; if (pendingTl) pendingTl.seek(targetTime, false); pendingTl = null; }
  }
  function playTo(k) {
    settle();
    var t = boundary(live, k);
    if (Math.abs(t - live.tl.time()) < 1e-3) { live.tl.seek(t, false); return; }
    targetTime = t; pendingTl = live.tl;
    pending = live.tl.tweenTo(t, { ease: 'none', onComplete: function () { pending = null; pendingTl = null; } });
  }

  /* ---------------- navigation ---------------- */
  function next() {
    if (!live) return;
    if (pending) { settle(); return; }               // first press finishes the running build
    if (step < nSteps(live) - 1) { step++; playTo(step); emit(); }
    else go(cur + 1, 'start', 'fwd');
  }
  function prev() {
    if (!live) return;
    settle();
    if (step > 0) { step--; live.tl.seek(boundary(live, step), false); emit(); }
    else if (cur > 0) go(cur - 1, 'end', 'back');
  }

  var transitioning = null;
  function go(i, at, dir) {
    if (i < 0 || i >= slides.length || i === cur) return;
    if (transitioning) { transitioning.progress(1); transitioning = null; }
    settle();
    var old = live, oldIdx = cur;
    cur = i;
    live = mount(i, stage, 'show');
    if (at === 'end') { step = nSteps(live) - 1; live.tl.seek(live.tl.duration(), false); }
    else { step = 0; }
    var secChange = old && slides[oldIdx].sec !== slides[i].sec && dir === 'fwd';
    transition(old, live, secChange, dir, at !== 'end');
    updateHash(); updateProgress(); emit();
  }

  function transition(old, L, secChange, dir, playEntrance) {
    var start = function () { if (playEntrance && live === L) playTo(0); };
    if (!old) { start(); return; }
    if (dir !== 'fwd') { unmount(old); start(); return; }   // back + navigator jumps are instant
    if (secChange) {
      var sw = document.getElementById('sweep');
      var cols = secSweep(slides[L.index].sec);
      sw.innerHTML = cols.map(function (c, k) {
        return '<div class="panel" style="left:' + (k * 330 - 120) + 'px;background:' + c + '"></div>';
      }).join('');
      var ps = sw.querySelectorAll('.panel');
      gsap.set(L.el, { autoAlpha: 0 });
      transitioning = gsap.timeline({ onComplete: function () { sw.innerHTML = ''; transitioning = null; } })
        .fromTo(ps, { x: 2300 }, { x: 0, duration: .5, ease: 'power3.in', stagger: .035 })
        .add(function () { unmount(old); gsap.set(L.el, { autoAlpha: 1 }); })
        .to(ps, { x: -2600, duration: .6, ease: 'power3.out', stagger: .035 })
        .add(start, '-=.45');
      return;
    }
    gsap.set(L.el, { autoAlpha: 0 });
    transitioning = gsap.timeline({ onComplete: function () { transitioning = null; } })
      .to(old.el, { autoAlpha: 0, duration: .3, ease: 'power1.in' })
      .add(function () { unmount(old); })
      .to(L.el, { autoAlpha: 1, duration: .35, ease: 'power1.out' })
      .add(start, '-=.3');
  }

  /* ---------------- chrome ---------------- */
  function buildProgress() {
    var p = document.getElementById('progress');
    p.innerHTML = sections.map(function (s) {
      var b = s.slides.reduce(function (a, d) { return a + (d.budgetSec || 0); }, 0) || 1;
      return '<div class="seg" style="flex:' + b + '"><span style="background:' + secColor(s) + '"></span></div>';
    }).join('');
  }
  function updateProgress() {
    var segs = document.querySelectorAll('#progress .seg > span');
    var s = slides[cur];
    sections.forEach(function (sec, k) {
      var w;
      if (sec.order < s.sec.order) w = 100;
      else if (sec.order > s.sec.order) w = 0;
      else w = 100 * (sec.slides.indexOf(s.def) + 1) / sec.slides.length;
      if (segs[k]) segs[k].style.width = w + '%';
    });
  }
  function updateHash() {
    var s = slides[cur];
    history.replaceState(null, '', '#/' + s.sec.id + '/' + s.def.id);
  }
  function indexFromHash() {
    var h = location.hash.replace(/^#\/?/, '');
    if (!h) return 0;
    if (/^\d+$/.test(h)) return Math.min(slides.length - 1, Math.max(0, parseInt(h, 10) - 1));
    var parts = h.split('/');
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].sec.id === parts[0] && (!parts[1] || slides[i].def.id === parts[1])) return i;
    }
    return 0;
  }
  function fit() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    var x = (window.innerWidth - W * s) / 2, y = (window.innerHeight - H * s) / 2;
    stage.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
  }

  /* ---------------- presenter link ---------------- */
  function meta() {
    return slides.map(function (s, i) {
      return { i: i, id: s.def.id, title: s.def.title || s.def.id, sec: s.sec.id, secTitle: s.sec.kicker + (s.sec.title ? ' — ' + s.sec.title : ''),
        budgetSec: s.def.budgetSec || 0, notes: s.def.notes || '' };
    });
  }
  function emit() {
    if (!presenterWin || presenterWin.closed || !live) return;
    presenterWin.postMessage({ ns: 'bts', type: 'state', index: cur, step: step, steps: nSteps(live), slides: meta(),
      colors: secColors() }, '*');
  }
  function openPresenter() {
    presenterWin = window.open('presenter.html', 'bts-presenter', 'width=1500,height=950');
    setTimeout(emit, 600);
  }
  window.addEventListener('message', function (e) {
    var m = e.data; if (!m || m.ns !== 'bts') return;
    if (e.source && e.source !== window) presenterWin = e.source;
    if (m.type === 'hello') emit();
    else if (m.type === 'next') next();
    else if (m.type === 'prev') prev();
    else if (m.type === 'goto') go(m.index, 'start', m.index > cur ? 'fwd' : 'back');
    else if (m.type === 'black') toggleBlack();
  });

  function toggleBlack() { var b = document.getElementById('blackout'); b.style.display = b.style.display === 'block' ? 'none' : 'block'; }

  /* ---------------- slide navigator ----------------
     G (or Esc) opens a grid of every slide grouped by section: type to filter, arrows to move, Enter or click to jump.
     Without the overlay: type a slide number then Enter (e.g. 1 2 Enter) to jump to slide 12. Jumps skip the transition. */
  var nav = null, navSel = 0, numBuf = '', numTimer = null;
  function jump(i) { if (i >= 0 && i < slides.length && i !== cur) go(i, 'start', 'jump'); }
  function navItems() { return nav ? Array.prototype.slice.call(nav.querySelectorAll('.nv-item:not(.nv-hide)')) : []; }
  function navMark() {
    var it = navItems(); navSel = Math.max(0, Math.min(navSel, it.length - 1));
    it.forEach(function (n, k) { n.classList.toggle('nv-sel', k === navSel); });
    if (it[navSel]) it[navSel].scrollIntoView({ block: 'nearest' });
  }
  function navFilter(q) {
    q = q.trim().toLowerCase();
    nav.querySelectorAll('.nv-item').forEach(function (n) {
      var hit = !q || n.getAttribute('data-k').indexOf(q) >= 0 || n.getAttribute('data-n') === q;
      n.classList.toggle('nv-hide', !hit);
    });
    nav.querySelectorAll('.nv-sec').forEach(function (g) { g.classList.toggle('nv-hide', !g.querySelector('.nv-item:not(.nv-hide)')); });
    navSel = 0; navMark();
  }
  function closeNav() { if (nav) { nav.remove(); nav = null; } }
  function openNav() {
    if (nav) { closeNav(); return; }
    nav = document.createElement('div'); nav.id = 'nav';
    nav.innerHTML = '<div class="nv-box"><div class="nv-top"><input class="nv-q" placeholder="Jump to… (type a title, section or number)" spellcheck="false">' +
      '<span class="nv-keys">↑↓ move · Enter go · Esc close</span></div><div class="nv-grid">' +
      sections.map(function (sec) {
        return '<div class="nv-sec" style="--c:' + secTint(sec) + '"><div class="nv-h">' + esc(sec.num) + ' · ' + esc(sec.kicker) +
          (sec.title ? ' <span>' + esc(sec.title) + '</span>' : '') + '</div>' +
          slides.filter(function (x) { return x.sec === sec; }).map(function (x) {
            var t = (x.def.heading || x.def.title || x.def.id).replace(/<[^>]*>/g, '');
            return '<div class="nv-item' + (x.index === cur ? ' nv-cur' : '') + '" data-i="' + x.index + '" data-n="' + (x.index + 1) +
              '" data-k="' + esc((t + ' ' + x.def.id + ' ' + sec.id + ' ' + sec.kicker + ' ' + (sec.title || '')).toLowerCase()) + '"><b>' + (x.index + 1) + '</b>' + esc(t) + '</div>';
          }).join('') + '</div>';
      }).join('') + '</div></div>';
    document.body.appendChild(nav);
    var q = nav.querySelector('.nv-q');
    q.addEventListener('input', function () { navFilter(q.value); });
    q.addEventListener('keydown', function (e) {
      var it = navItems();
      if (e.key === 'Escape') { e.preventDefault(); closeNav(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight' && !q.value) { e.preventDefault(); navSel++; navMark(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' && !q.value) { e.preventDefault(); navSel--; navMark(); }
      else if (e.key === 'Enter') { e.preventDefault(); var n = it[navSel]; if (n) { var i = +n.getAttribute('data-i'); closeNav(); jump(i); } }
      e.stopPropagation();
    });
    nav.addEventListener('click', function (e) {
      var n = e.target.closest('.nv-item');
      if (n) { var i = +n.getAttribute('data-i'); closeNav(); jump(i); }
      else if (!e.target.closest('.nv-box')) closeNav();
    });
    var all = navItems(); navSel = Math.max(0, all.findIndex(function (n) { return n.classList.contains('nv-cur'); })); navMark();
    q.focus();
  }

  function onKey(e) {
    var t = e.target;
    if (nav) return;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) {
      if (e.repeat) return;
      numBuf = (numBuf + k).slice(-3); clearTimeout(numTimer); numTimer = setTimeout(function () { numBuf = ''; showNum(); }, 2500); showNum(); return;
    }
    if (k === 'Enter' && numBuf) { e.preventDefault(); var n = parseInt(numBuf, 10) - 1; numBuf = ''; showNum(); jump(n); return; }
    if (numBuf && k !== 'Shift') { numBuf = ''; showNum(); }
    if (k === 'g' || k === 'G' || k === 'Escape') { e.preventDefault(); openNav(); }
    else if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
    else if (k === 'Home') jump(0);
    else if (k === 'End') jump(slides.length - 1);
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 'f' || k === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
    else if (k === 'b' || k === 'B' || k === '.') toggleBlack();
    else if (k === 'h' || k === 'H') { var h = document.getElementById('hint'); h.style.display = h.style.display === 'none' ? '' : 'none'; }
    else if (typeof Deck.onKey === 'function') Deck.onKey(e, live && live.ctx);
  }
  function showNum() {
    var b = document.getElementById('numbuf');
    if (!b) { b = document.createElement('div'); b.id = 'numbuf'; document.body.appendChild(b); }
    b.textContent = numBuf ? 'Go to slide ' + numBuf + ' ↵  (of ' + slides.length + ')' : '';
    b.style.display = numBuf ? '' : 'none';
  }

  /* ---------------- boot ---------------- */
  function collect() {
    sections = Deck._sections.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    slides = [];
    sections.forEach(function (sec) { sec.slides.forEach(function (def) { slides.push({ def: def, sec: sec, index: slides.length }); }); });
    Deck.slides = slides; Deck.sectionsSorted = sections;
  }

  function bootShow() {
    viewport = document.getElementById('viewport');
    stage = document.getElementById('stage');
    buildProgress();
    fit(); window.addEventListener('resize', fit);
    document.addEventListener('keydown', onKey);
    go(indexFromHash(), 'start', 'fwd');
    window.addEventListener('hashchange', function () { var i = indexFromHash(); if (i !== cur) go(i, 'start', i > cur ? 'fwd' : 'back'); });
    var hint = document.getElementById('hint');
    if (hint) hint.textContent = '→ next · ← back · G slides · 12↵ jump · P presenter · F fullscreen · B black';
    setTimeout(function () { if (hint) gsap.to(hint, { autoAlpha: 0, duration: 1 }); }, 4000);
  }

  function bootStatic(only) {
    document.body.classList.add('print');
    var vp = document.getElementById('viewport');
    var list = only == null ? slides.map(function (_, i) { return i; }) : [only];
    list.forEach(function (i) {
      var page = document.createElement('div'); page.className = 'printpage'; vp.appendChild(page);
      var L = mount(i, page, MODE);
      L.tl.progress(1, false);
    });
    if (MODE === 'preview') {
      var page = vp.querySelector('.printpage');
      var fitP = function () { var s = Math.min(innerWidth / W, innerHeight / H); page.style.transformOrigin = '0 0'; page.style.transform = 'scale(' + s + ')'; };
      document.body.style.overflow = 'hidden'; fitP(); addEventListener('resize', fitP);
    }
    document.documentElement.setAttribute('data-ready', '1');
  }

  Deck.boot = function () {
    collect();
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      if (MODE === 'show') bootShow();
      else bootStatic(MODE === 'preview' ? Math.max(0, Math.min(slides.length - 1, parseInt(params.get('preview'), 10) || 0)) : null);
      document.documentElement.setAttribute('data-ready', '1');
    });
  };

  // test/automation hooks
  Deck.next = function () { next(); };
  Deck.prev = function () { prev(); };
  Deck.go = function (i) { go(i, 'start', i > cur ? 'fwd' : 'back'); };
  Deck.state = function () { return { index: cur, step: step, steps: live ? nSteps(live) : 0, id: live ? slides[cur].sec.id + '/' + slides[cur].def.id : null, animating: !!pending || !!transitioning }; };
  Deck.finishStep = function () { settle(); if (transitioning) transitioning.progress(1); };
})();
