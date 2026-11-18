/* ==========================================================================
   Lecture deck — slide engine (classic script, no modules, works from file://)

   Sections register themselves:
     Deck.section({ id, order, num, kicker, title, color, toss?, opener?, slides: [ slideDef, ... ] })
       color: palette token name from css/theme.css ('red' → --red fills, --red-t text) or a hex.
              The engine sets --sec / --sec-t on every slide of the section.
       toss:  optional image path (a transparent food cut-out) that drops onto the section's opener card.
       opener: optional { id: 'opener', budgetSec, notes } → an engine-made title-card slide at the section's start.

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
    el.className = 'slide' + (def.theme === 'light' ? ' light' : '') + (def._opener ? ' opener' : '');
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
     One idea throughout: a soft, ragged chalk-eraser edge that sweeps left → right.
     Every forward step (~0.9 s): the old slide is erased off the top of the new one; a faint chalk-dust haze rides the edge.
     Into a section opener slide (see "section openers" below): the opener's own entrance scribbles over the old slide.
     Back navigation and jumps are instant. Pressing → mid-transition skips to the end. */
  var T_IN = 0.9;
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
  /* Eraser mask: an image 3 stages wide. Left third transparent, right third opaque, a ragged, blurred edge in the middle
     (slanted, like an eraser dragged at an angle). Sliding mask-position moves the edge across the element. */
  var ERASE = null, EW = W * 3, EDGE = W * 1.5;
  function eraserMask() {
    if (ERASE) return ERASE;
    var r = rnd(4242), pts = [], y, x;
    for (y = -40; y <= H + 40; y += 26) { x = EDGE + (y - H / 2) * -0.18 + (r() - .5) * 70 + Math.sin(y / 90) * 26; pts.push(Math.round(x) + ',' + y); }
    var poly = pts.join(' ') + ' ' + EW + ',' + (H + 40) + ' ' + EW + ',-40';
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + EW + "' height='" + H + "'><filter id='b' x='-5%' y='-5%' width='110%' height='110%'>" +
      "<feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='2' seed='7'/><feDisplacementMap in='SourceGraphic' scale='60'/><feGaussianBlur stdDeviation='14'/></filter>" +
      "<polygon points='" + poly + "' fill='white' filter='url(%23b)'/></svg>";
    ERASE = 'url("data:image/svg+xml;utf8,' + svg.replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E') + '")';
    return ERASE;
  }
  /** Tween that erases `el` left → right with the chalk edge. Returns a timeline-ready tween; cleans its mask at the end. */
  function eraseTween(el, dur, ease) {
    var st = el.style, m = eraserMask(), o = { x: -(EW - W) };
    var apply = function () { st.webkitMaskPosition = st.maskPosition = o.x + 'px 0'; };
    st.webkitMaskImage = st.maskImage = m; st.webkitMaskSize = st.maskSize = EW + 'px ' + H + 'px';
    st.webkitMaskRepeat = st.maskRepeat = 'no-repeat'; apply();
    return gsap.to(o, { x: 0, duration: dur, ease: ease || 'power1.inOut', onUpdate: apply });
  }
  function clearMask(el) { var st = el.style; st.webkitMaskImage = st.maskImage = ''; st.webkitMaskPosition = st.maskPosition = ''; }
  /** A faint chalk-dust haze that rides the eraser edge (same timing as eraseTween). */
  function dustTween(parent, dur, ease) {
    var d = document.createElement('div'); d.className = 'erase-dust'; parent.appendChild(d);
    var o = { x: -(EW - W) };
    var apply = function () { d.style.transform = 'translateX(' + (o.x + EDGE - 160) + 'px) skewX(10deg)'; };
    apply();
    return { el: d, tween: gsap.to(o, { x: 0, duration: dur, ease: ease || 'power1.inOut', onUpdate: apply }) };
  }

  function transition(old, L, secChange, dir, playEntrance) {
    var start = function () { if (playEntrance && live === L) playTo(0); };
    if (!old) { start(); return; }
    if (dir !== 'fwd' || MODE !== 'show' || !window.DrawSVGPlugin) { unmount(old); start(); return; }
    var sw = document.getElementById('sweep');
    sw.innerHTML = ''; clearMask(sw);

    if (slides[L.index].def._opener) {
      // into a section opener: its own entrance scribbles over the old slide, which is dropped once covered
      L.el.style.zIndex = 2; old.el.style.zIndex = 1;
      start();
      transitioning = gsap.timeline({ onComplete: function () { L.el.style.zIndex = ''; transitioning = null; } })
        .add(function () { unmount(old); }, OPENER_COVER);
      return;
    }
    // everywhere else: the old slide sits on top and is erased away to reveal the new one underneath
    old.el.style.zIndex = 2; L.el.style.zIndex = 1;
    var dust = dustTween(sw, T_IN);
    transitioning = gsap.timeline({ onComplete: function () { unmount(old); L.el.style.zIndex = ''; sw.innerHTML = ''; transitioning = null; } })
      .add(eraseTween(old.el, T_IN), 0)
      .add(dust.tween, 0)
      .add(start, T_IN * .55);
  }

  /* ---------------- section openers ----------------
     A section with `opener: { id: 'opener', budgetSec, notes }` gets an engine-made first slide: the title card.
     Entrance: the section color is scribbled over the previous slide, "NN · Title" appears, the kicker is chalk-written
     stroke by stroke and underlined, and the section's `toss` cut-out drops in beside it. It then HOLDS, so the speaker can
     introduce the section; the next click erases it into the section's first slide with the normal eraser edge. */
  var OPENER_COVER = .8;
  function hashStr(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 99991; return h + 11; }
  function openerHtml(ctx) {
    var sec = ctx.sec, col = secColor(sec), tint = secTint(sec), sd = hashStr(sec.id) * 7919;
    var hasToss = !!sec.toss, wx = hasToss ? W / 2 - 170 : W / 2, ink = '#1E2124';
    var p = function (cls, d, c, w, extra) { return '<path class="' + cls + '" d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>'; };
    return '<svg class="op-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<rect class="op-solid" x="0" y="0" width="' + W + '" height="' + H + '" fill="' + col + '"/>' +
      p('op-base', zigzag(sd, 46, 260, 60), col, 112) +
      p('op-tex1', zigzag(sd + 3, 64, 300, 200), 'rgba(0,0,0,.14)', 6) +
      p('op-tex2', zigzag(sd + 5, 90, 220, 260), tint, 4, ' opacity=".5"') +
      '<text class="op-num" x="' + wx + '" y="' + (H / 2 - 150) + '" text-anchor="middle" fill="' + ink + '">' + esc((sec.num ? sec.num + ' · ' : '') + (sec.title || '')) + '</text>' +
      '<text class="op-word" x="' + wx + '" y="' + (H / 2 + 90) + '" text-anchor="middle" fill="' + ink + '" stroke="' + ink + '" stroke-width="4" stroke-dasharray="2600" stroke-dashoffset="0">' + esc(sec.kicker || sec.title || '') + '</text>' +
      p('op-ul', 'M' + (wx - 230) + ' ' + (H / 2 + 150) + ' Q' + wx + ' ' + (H / 2 + 128) + ' ' + (wx + 250) + ' ' + (H / 2 + 140), ink, 10) +
      '</svg>' + (hasToss ? '<img class="op-toss" src="' + sec.toss + '" alt="" style="left:' + (W / 2 + 330) + 'px;top:' + (H / 2 - 210) + 'px">' : '');
  }
  function openerBuild(ctx) {
    var tl = ctx.tl, q = ctx.q, ink = '#1E2124';
    tl.fromTo(q('.op-base'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .75, ease: 'power2.inOut' }, 0)
      .fromTo(q('.op-tex1'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .75, ease: 'power2.inOut' }, .08)
      .fromTo(q('.op-tex2'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .75, ease: 'power2.inOut' }, .14)
      .fromTo(q('.op-solid'), { opacity: 0 }, { opacity: 1, duration: .01 }, OPENER_COVER)
      .fromTo(q('.op-num'), { opacity: 0 }, { opacity: 1, duration: .3 }, .55)
      .fromTo(q('.op-word'), { attr: { 'stroke-dashoffset': 2600, fill: 'rgba(30,33,36,0)' } }, { attr: { 'stroke-dashoffset': 0 }, duration: .8, ease: 'power1.inOut' }, .5)
      .to(q('.op-word'), { attr: { fill: ink }, duration: .3 }, 1.15)
      .fromTo(q('.op-ul'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .3, ease: 'power2.out' }, 1.25);
    var toss = q('.op-toss');
    if (toss) tl.fromTo(toss, { y: -1500, rotation: -25, autoAlpha: 0 }, { y: 0, rotation: 8, autoAlpha: 1, duration: .6, ease: 'back.out(1.5)' }, .7);   // hidden until it drops (no corner peeking in early)
  }
  function makeOpener(sec) {
    var o = sec.opener === true ? {} : sec.opener;
    return { id: o.id || 'opener', title: o.title || (sec.kicker + ' · ' + (sec.title || '')), budgetSec: o.budgetSec || 10, notes: o.notes || '',
      html: openerHtml, build: openerBuild, _opener: true };
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
    sections.forEach(function (sec) { if (sec.opener && !(sec.slides[0] && sec.slides[0]._opener)) sec.slides.unshift(makeOpener(sec)); });
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
  Deck._transition = function () { return transitioning; };   // QA hook: seek a running transition
  Deck.go = function (i) { go(i, 'start', i > cur ? 'fwd' : 'back'); };
  Deck.state = function () { return { index: cur, step: step, steps: live ? nSteps(live) : 0, id: live ? slides[cur].sec.id + '/' + slides[cur].def.id : null, animating: !!pending || !!transitioning }; };
  Deck.finishStep = function () { settle(); if (transitioning) transitioning.progress(1); };
})();
