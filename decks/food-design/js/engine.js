/* ==========================================================================
   Lecture deck — slide engine (classic script, no modules, works from file://)

   Sections register themselves:
     Deck.section({ id, order, num, kicker, title, color, toss?, slides: [ slideDef, ... ] })
       color: palette token name from css/theme.css ('red' → --red fills, --red-t text) or a hex.
              The engine sets --sec / --sec-t on every slide of the section.
       toss:  optional image path (a transparent food cut-out) that tumbles across the section-change scribble.

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
       Deck.section({ id, color: 'teal', ... })
     `color` is a palette token name from css/theme.css (--teal, --teal-t) or a raw hex. */
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim(); }
  function hexOf(c) { return !c ? '#888' : c.charAt(0) === '#' ? c : (cssVar(c) || '#888'); }
  function secColor(sec) { return hexOf(sec.color); }
  function secTint(sec) { var c = sec.color; return !c ? '#bbb' : c.charAt(0) === '#' ? c : (cssVar(c + '-t') || hexOf(c)); }
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

  /* ---------------- transitions (deck 2: chalk) ----------------
     Section change: a scribble in the new section's color fills the screen, the section's food cut-out (sec.toss)
     tumbles across, its kicker is chalked big in the middle, then an eraser wipes the scribble away (~1.25 s).
     Within a section: slate-colored eraser strokes smear over the old slide, then rub away to show the new one (~0.5 s).
     Back navigation is instant. */
  function rnd(seed) { seed = seed % 2147483647 || 1; return function () { seed = seed * 16807 % 2147483647; return seed / 2147483647; }; }
  /** Zig-zag stroke path covering the stage left→right. gap: horizontal step; slant: lean of each stroke. */
  function zigzag(seed, gap, slant, jit) {
    var r = rnd(seed), pad = 120, x = -pad - slant, top = true, d = 'M' + x + ' ' + (-pad);
    while (x < W + pad + slant) {
      x += gap * (0.8 + r() * 0.4); top = !top;
      var y = top ? -pad + (r() - .5) * jit : H + pad + (r() - .5) * jit;
      d += ' L' + Math.round(top ? x : x - slant) + ' ' + Math.round(y);
    }
    return d;
  }
  var XL = 'http://www.w3.org/2000/svg';
  function svgEl(tag, at) { var e = document.createElementNS(XL, tag); for (var k in at) e.setAttribute(k, at[k]); return e; }
  function stroke(d, col, w, extra) {
    var at = { d: d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    for (var k in extra || {}) at[k] = extra[k];
    return svgEl('path', at);
  }
  var tseed = 1;

  function transition(old, L, secChange, dir, playEntrance) {
    var start = function () { if (playEntrance && live === L) playTo(0); };
    if (!old) { start(); return; }
    if (dir === 'back' || MODE !== 'show' || !window.DrawSVGPlugin) { unmount(old); start(); return; }
    var sw = document.getElementById('sweep');
    sw.innerHTML = '';
    var svg = svgEl('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H });
    var id = 'swm' + (tseed++), sd = tseed * 7919;
    var mask = svgEl('mask', { id: id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H });
    mask.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff' }));
    var g = svgEl('g', { mask: 'url(#' + id + ')' });
    var defs = svgEl('defs', {}); defs.appendChild(mask); svg.appendChild(defs); svg.appendChild(g);
    sw.appendChild(svg);
    var finish = function () { sw.innerHTML = ''; transitioning = null; };
    gsap.set(L.el, { autoAlpha: 0 });

    if (secChange) {
      var sec = slides[L.index].sec, col = secColor(sec), tint = secTint(sec);
      var solid = svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: col, opacity: 0 });
      var base = stroke(zigzag(sd, 46, 260, 60), col, 112);
      var tex1 = stroke(zigzag(sd + 3, 70, 300, 200), 'rgba(0,0,0,.16)', 7);
      var tex2 = stroke(zigzag(sd + 5, 95, 220, 260), tint, 5, { opacity: .55 });
      var eraser = stroke(zigzag(sd + 9, 92, 200, 80), '#000', 210);
      mask.appendChild(eraser);
      [solid, base, tex1, tex2].forEach(function (n) { g.appendChild(n); });
      var word = svgEl('text', { x: W / 2, y: H / 2 + 70, 'text-anchor': 'middle', fill: '#1E2124',
        style: 'font-family:var(--hand);font-weight:700;font-size:250px' });
      word.textContent = sec.kicker || sec.title || '';
      g.appendChild(word);
      var toss = null;
      if (sec.toss) {
        toss = document.createElement('img'); toss.src = sec.toss; toss.className = 'toss';
        sw.appendChild(toss);
      }
      var T = gsap.timeline({ onComplete: finish });
      T.fromTo(base, { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, ease: 'power1.inOut' }, 0)
        .fromTo(tex1, { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, ease: 'power1.inOut' }, .06)
        .fromTo(tex2, { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, ease: 'power1.inOut' }, .1)
        .set(solid, { attr: { opacity: 1 } }, .52)
        .add(function () { unmount(old); gsap.set(L.el, { autoAlpha: 1 }); }, .52)
        .fromTo(word, { opacity: 0, scale: .5, rotation: -14, svgOrigin: (W / 2) + ' ' + (H / 2) },
          { opacity: 1, scale: 1, rotation: -4, duration: .4, ease: 'back.out(2)' }, .3)
        .fromTo(eraser, { drawSVG: '0%' }, { drawSVG: '100%', duration: .55, ease: 'power2.inOut' }, .82)
        .to(word, { opacity: 0, duration: .2 }, .82)
        .add(start, .95);
      if (toss) {
        T.fromTo(toss, { x: -420, y: 760, rotation: -60, autoAlpha: 1 },
          { duration: 1.0, ease: 'power1.inOut', rotation: 300,
            motionPath: { path: [{ x: 260, y: 160 }, { x: 900, y: -60 }, { x: 1500, y: 260 }, { x: 2050, y: 820 }], curviness: 1.4 } }, .05);
      }
      transitioning = T;
      return;
    }
    // within a section: eraser smear
    var bg = cssVar('bg') || '#2A2E31';
    var cover = svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: bg, opacity: 0 });
    var smear = stroke(zigzag(sd, 150, 340, 40), bg, 250);
    var dust = stroke(zigzag(sd + 2, 150, 340, 140), 'rgba(243,235,221,.07)', 60);
    var rub = stroke(zigzag(sd + 4, 160, -300, 60), '#000', 270);
    mask.appendChild(rub);
    [cover, smear, dust].forEach(function (n) { g.appendChild(n); });
    transitioning = gsap.timeline({ onComplete: finish })
      .fromTo(smear, { drawSVG: '0%' }, { drawSVG: '100%', duration: .24, ease: 'power1.in' }, 0)
      .fromTo(dust, { drawSVG: '0%' }, { drawSVG: '100%', duration: .24, ease: 'power1.in' }, .02)
      .set(cover, { attr: { opacity: 1 } }, .25)
      .add(function () { unmount(old); gsap.set(L.el, { autoAlpha: 1 }); }, .25)
      .fromTo(rub, { drawSVG: '0%' }, { drawSVG: '100%', duration: .3, ease: 'power1.out' }, .27)
      .add(start, .3);
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

  function onKey(e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0, 'start', 'back');
    else if (k === 'End') go(slides.length - 1, 'start', 'fwd');
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 'f' || k === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
    else if (k === 'b' || k === 'B' || k === '.') toggleBlack();
    else if (k === 'h' || k === 'H') { var h = document.getElementById('hint'); h.style.display = h.style.display === 'none' ? '' : 'none'; }
    else if (typeof Deck.onKey === 'function') Deck.onKey(e, live && live.ctx);
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
    sections.forEach(function (sec) { if (sec.toss) { var im = new Image(); im.src = sec.toss; } });   // preload transition cut-outs
    fit(); window.addEventListener('resize', fit);
    document.addEventListener('keydown', onKey);
    go(indexFromHash(), 'start', 'fwd');
    window.addEventListener('hashchange', function () { var i = indexFromHash(); if (i !== cur) go(i, 'start', i > cur ? 'fwd' : 'back'); });
    var hint = document.getElementById('hint');
    if (hint) hint.textContent = '→ next · ← back · P presenter · F fullscreen · B black';
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
  Deck._transition = function () { return transitioning; };   // QA hook: seek a running transition
  Deck.go = function (i) { go(i, 'start', i > cur ? 'fwd' : 'back'); };
  Deck.state = function () { return { index: cur, step: step, steps: live ? nSteps(live) : 0, id: live ? slides[cur].sec.id + '/' + slides[cur].def.id : null, animating: !!pending || !!transitioning }; };
  Deck.finishStep = function () { settle(); if (transitioning) transitioning.progress(1); };
})();
