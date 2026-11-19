/* ==========================================================================
   01 · Cook · Samsung Food   (budget 390 s)
   Spec: specs/samsung.md (v2). Roadmap boxes / crumbs: Understand → Sense → Rank → Check → Act.
   House style (Nov 2026 restyle): weight hierarchy, hatched focal boxes, teaching doodles only,
   no source text on slides (caveats live in the notes, citations in 99-refs.js).
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/samsung/';
  var VID = 'assets/video/samsung/';
  var STEPS = ['Understand', 'Sense', 'Rank', 'Check', 'Act'];

  /* ---------- local helpers (KIT §4: helpers live inside the section) ---------- */

  /** Rounded-rectangle path drawn with the rough.js wobble (phone frames). */
  function rr(x, y, w, h, r, o) {
    var d = 'M' + (x + r) + ' ' + y + ' H' + (x + w - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) +
      ' V' + (y + h - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w - r) + ' ' + (y + h) +
      ' H' + (x + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + h - r) +
      ' V' + (y + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + ' Z';
    return Kit.rough.path(d, o);
  }
  /** SVG <text>. o: {size, fill, anchor, cls, weight, ls} */
  function tx(x, y, s, o) {
    o = o || {};
    return '<text class="' + (o.cls || '') + '" x="' + x + '" y="' + y + '" font-size="' + (o.size || 36) +
      '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.fill ? ' fill="' + o.fill + '"' : '') + ' font-weight="' + (o.weight || 600) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + '>' + Kit.esc(s) + '</text>';
  }
  function svg(cls, inner) {
    return '<svg class="sm-svg ' + cls + '" width="1920" height="1080" viewBox="0 0 1920 1080">' + inner + '</svg>';
  }
  /** ML / rule tag: says whether a step is learned or written by hand. */
  function tag(kind, x, y, cls, text) {
    return div('sm-tag ' + kind + ' ' + (cls || ''), x, y, 0, text || (kind === 'ml' ? 'ML' : 'rule'));
  }
  /** Absolutely positioned block. */
  function div(cls, x, y, w, inner, extra) {
    return '<div class="' + cls + '" style="left:' + x + 'px;top:' + y + 'px;' + (w ? 'width:' + w + 'px;' : '') +
      (extra || '') + '">' + inner + '</div>';
  }

  /* ---------- phone video (the player from PR #1, made reusable) ----------
     A clip inside a hand-drawn phone frame. A click on the phone plays or pauses it; → and Space
     still advance the deck, because nothing here binds keys. If the file is missing the <video>
     fires `error` and the "clip coming" card shows instead: drop the file in and it plays. */
  function phoneVideo(file, x, y, w, h) {
    var p = 16;
    return svg('sm-phone-svg',
      '<g class="sm-frame">' + rr(x - p, y - p, w + p * 2, h + p * 2, 40,
        { seed: 11, w: 'heavy', fill: 'var(--sec-t)', fillStyle: 'hachure', hachureGap: 36, fillOpacity: .1 }) + '</g>') +
      div('sm-vid', x, y, w,
        '<video class="sm-vid-el" src="' + VID + file + '" muted playsinline preload="auto"></video>' +
        '<div class="sm-vid-play"><i></i><span class="t-label">Play</span></div>' +
        '<div class="sm-vid-ph"><div class="t-label dim">Clip coming</div></div>',
        'height:' + h + 'px;');
  }
  /** Wire one phone video up and tear it down with the slide. */
  function wireVideo(ctx) {
    var vid = ctx.q('.sm-vid-el'), box = ctx.q('.sm-vid'), ph = ctx.q('.sm-vid-ph'), play = ctx.q('.sm-vid-play');
    if (!vid) return;
    var onError = function () { vid.style.display = 'none'; ph.classList.add('on'); play.classList.add('off'); };
    var onPlay = function () { play.classList.add('off'); };
    var onPause = function () { play.classList.remove('off'); };
    var onClick = function () {
      if (ph.classList.contains('on')) return;
      if (vid.paused) {
        if (vid.ended) vid.currentTime = 0;
        var p = vid.play();
        if (p && p['catch']) p['catch'](function () { });
      } else vid.pause();
    };
    vid.addEventListener('error', onError);
    vid.addEventListener('play', onPlay);
    vid.addEventListener('pause', onPause);
    box.addEventListener('click', onClick);
    if (vid.error) onError();
    ctx.cleanup(function () {
      box.removeEventListener('click', onClick);
      vid.removeEventListener('error', onError);
      vid.removeEventListener('play', onPlay);
      vid.removeEventListener('pause', onPause);
      try { vid.pause(); vid.currentTime = 0; } catch (e) { }
    });
  }

  /* ================================================================ 1 · DEMO */
  var DEMO = {
    id: 'demo',
    title: 'Demo',
    heading: 'Demo',
    budgetSec: 30,
    html: function () {
      return phoneVideo('card-scan.mp4', 810, 300, 300, 650) +
        svg('sm-demo-svg',
          '<g class="sm-ain">' + Kit.rough.arrow(690, 548, 782, 586, { seed: 12, w: 'normal', head: 20, bend: 14 }) + '</g>' +
          '<g class="sm-aout">' + Kit.rough.arrow(1138, 586, 1230, 548, { seed: 13, w: 'normal', head: 20, bend: 14 }) + '</g>' +
          '<g class="dd-cap">' + Kit.doodle.underline(1246, 742, 400, { seed: 201 }) + '</g>') +
        div('sm-col', 120, 470, 540, '<div class="t-caps dim">Input</div><div class="t-body sm-ct">Photo of a recipe card</div>') +
        div('sm-col', 1240, 470, 560, '<div class="t-caps dim">Output</div><div class="t-body sm-ct">Structured recipe</div>') +
        div('t-h2 sm-demo-cap', 1240, 648, 560, 'Photo in, recipe out.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      wireVideo(ctx);
      gsap.set(qa('.sm-demo-cap, .dd-cap'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.sm-col'), { at: .25, stagger: .12 });
      Kit.draw(tl, qa('.sm-frame .rp'), { at: .5, duration: .9 });
      Kit.draw(tl, qa('.sm-ain .rp, .sm-aout .rp'), { at: .9, duration: .5, stagger: .08 });
      Kit.fade(tl, q('.sm-vid'), { at: 1.1 });

      // [click 1] the one-line summary of the whole scan
      ctx.pause();
      Kit.show(tl, q('.sm-demo-cap'), { y: 18 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: '<', duration: .5 });
    },
    notes:
      'Let\'s start by seeing what it actually does. You point your phone at a handwritten recipe card, and a few seconds later the app ' +
      'has a recipe it can work with. This is a feature Samsung shipped in July 2025. ' +
      '[click] So photo in, structured recipe out. The rest of this section is basically what\'s going on behind that wait.'
  };

  /* ============================================================= 2 · PROBLEM */
  var SRC = [
    { t: 'Taste', s: 'saves, searches', dy: 0 },
    { t: 'Recipes', s: 'what could be cooked', dy: 16 },
    { t: 'Food List', s: 'what is in the kitchen', dy: -12 },
    { t: 'Health goals', s: 'calories, diet', dy: 12 },
    { t: 'Appliances', s: 'what the oven can do', dy: -8 }
  ];
  var PX = [120, 465, 810, 1155, 1500], PW = 286, PH = 210, PY = 430;
  // top-left corner of the loop box in each of the four gaps between the five cards
  var GAPS = [[412, 475], [757, 469], [1101, 467], [1446, 469]];
  var PROBLEM = {
    id: 'problem',
    title: 'The meal-planning problem',
    heading: 'The meal-planning problem',
    budgetSec: 35,
    html: function () {
      var frames = '', cards = '', lines = '';
      SRC.forEach(function (s, i) {
        frames += '<g class="sm-sf f' + i + '" style="transform:rotate(' + (i % 2 ? 1.2 : -1.4) + 'deg);transform-origin:' +
          (PX[i] + PW / 2) + 'px ' + (PY + s.dy + PH / 2) + 'px">' +
          Kit.rough.rect(PX[i], PY + s.dy, PW, PH, { seed: 21 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .13, hachureGap: 24 }) + '</g>';
        cards += div('sm-sc c' + i, PX[i], PY + s.dy, PW,
          '<div class="t-body sm-st">' + s.t + '</div><div class="t-label dim sm-ss">' + Kit.esc(s.s) + '</div>',
          'height:' + PH + 'px;transform:rotate(' + (i % 2 ? 1.2 : -1.4) + 'deg);');
        lines += '<g class="sm-jl j' + i + '">' + Kit.rough.line(PX[i] + PW / 2, PY + s.dy + PH + 14, 960, 846,
          { seed: 31 + i, w: 'fine', stroke: C.text3, rough: .5 }) + '</g>';
      });
      return svg('sm-prob-svg', frames + lines +
        '<g class="sm-hub">' + Kit.rough.circle(960, 920, 150, { seed: 36, w: 'normal', stroke: C.text2 }) +
          tx(960, 936, '?', { size: 60, anchor: 'middle', fill: C.text2, weight: 700, cls: 'disp' }) + '</g>' +
        // one rust loop per gap: the callout says "none of these talk", so every gap is marked
        GAPS.map(function (g, i) {
          return '<g class="sm-gap">' + Kit.doodle.circle(g[0], g[1], 48, 136,
            { seed: 202 + i, color: 'var(--rust-t)', w: 'heavy', rx: 24, ry: 68 }) + '</g>';
        }).join('') +
        '<g class="sm-gapa">' + Kit.rough.arrow(1186, 356, 1136, 455, { seed: 37, w: 'normal', stroke: C.rustT, head: 18, bend: 14 }) + '</g>') +
        div('t-h2 c-rust sm-q', 120, 296, 940, 'What should I cook tonight?') +
        div('callout sm-gk', 1180, 292, 540, 'five separate sources') +
        cards;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-sf, .sm-sc, .sm-gk, .sm-gap, .sm-gapa, .sm-jl, .sm-hub'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.show(tl, q('.sm-q'), { at: .3, y: 20 });

      // [click 1] the five sources land, scattered and unconnected
      ctx.pause();
      tl.addLabel('s');
      tl.to(qa('.sm-sf'), { autoAlpha: 1, duration: .01, stagger: .12 }, 's');
      Kit.draw(tl, qa('.sm-sf .rp'), { at: 's', duration: .45, stagger: .12 });
      Kit.drop(tl, qa('.sm-sc'), { at: 's+=.15', stagger: .12 });

      // [click 2] the gaps between them are the point
      ctx.pause();
      tl.addLabel('g');
      Kit.show(tl, q('.sm-gk'), { at: 'g', y: 10 });
      tl.to(qa('.sm-gap, .sm-gapa'), { autoAlpha: 1, duration: .01 }, 'g+=.2');
      Kit.draw(tl, qa('.sm-gapa .rp'), { at: 'g+=.2', duration: .35 });
      Kit.draw(tl, qa('.sm-gap .rp'), { at: 'g+=.35', duration: .45, stagger: .1 });

      // [click 3] joining them up is the whole product
      ctx.pause();
      tl.addLabel('h');
      tl.to(qa('.sm-jl'), { autoAlpha: 1, duration: .01, stagger: .08 }, 'h');
      Kit.draw(tl, qa('.sm-jl .rp'), { at: 'h', duration: .55, stagger: .08 });
      tl.to(q('.sm-hub'), { autoAlpha: 1, duration: .01 }, 'h+=.6');
      Kit.draw(tl, qa('.sm-hub .rp'), { at: 'h+=.6', duration: .5 });
    },
    notes:
      'So what problem is Samsung actually trying to solve? It\'s the question of what should I cook tonight, which sounds pretty ' +
      'simple.' +
      '[click] But the answer needs 5 things: what the household likes, what recipes exist, what\'s actually in the kitchen, the health ' +
      'goals, and what the oven can do.' +
      '[click] A recipe app knows the catalogue but has no idea what\'s in your fridge. And a fridge camera knows a bit about your ' +
      'fridge but nothing about your taste.' +
      '[click] So Samsung\'s idea is that holding several of these at once is worth more than doing any one of them really well.'
  };

  /* ============================================================== 3 · SYSTEM */
  var PARTS = [
    { t: 'Understand', s: 'vision-language model', chip: 'id: flour' },
    { t: 'Sense', s: 'image recognition', chip: 'apple × 4', who: 'Gemini' },
    { t: 'Rank', s: 'collaborative filtering', chip: 'top 3' },
    { t: 'Check', s: 'LLM + rules', chip: '✓ nut-free', who: 'OpenAI' },
    { t: 'Act', s: 'sequence labeling + rules', chip: '180 °C' }
  ];
  var BX = [120, 465, 810, 1155, 1500], BW = 300, BH = 196, BY = 272;
  // Crops, not whole phone screens: at this width only a fragment stays legible (reviewer, Nov 2026).
  // Each label names what its crop evidences, so the shopping-list row is not captioned "Food graph".
  var EVID = [
    { img: 'ev-fields.webp', x: 160, y: 845, w: 420, h: 140, lab: 'Understand', alt: 'A typed ingredient row from the scan' },
    { img: 'ev-list.webp', x: 680, y: 858, w: 420, h: 115, lab: 'grams from the graph', alt: 'The shopping-list row: flour 15.6 g' },
    { img: 'ev-like.webp', x: 1200, y: 865, w: 420, h: 101, lab: 'Rank', alt: 'The "You may also like" header' }
  ];
  var SYSTEM = {
    id: 'system',
    title: 'How Samsung Food works',
    heading: 'How Samsung Food works',
    budgetSec: 45,
    html: function () {
      var frames = '', cards = '', arrows = '', chips = '', who = '';
      PARTS.forEach(function (p, i) {
        frames += '<g class="sm-pf f' + i + '">' + Kit.rough.rect(BX[i], BY, BW, BH,
          { seed: 41 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .15, hachureGap: 22 }) + '</g>';
        cards += div('sm-pc p' + i, BX[i], BY, BW,
          '<div class="t-h2 sm-pt">' + p.t + '</div><div class="t-label dim sm-ps">' + Kit.esc(p.s) + '</div>',
          'height:' + BH + 'px;');
        chips += '<g class="sm-ch h' + i + '">' + tx(BX[i] + BW / 2, 506, p.chip, { size: 28, anchor: 'middle', fill: C.tealT, cls: 'mono', weight: 500 }) + '</g>';
        arrows += '<g class="sm-pa a' + i + '">' + Kit.rough.arrow(BX[i] + BW / 2, 522, BX[i] + BW / 2, 550,
          { seed: 51 + i, w: 'normal', head: 16 }) + '</g>';
        if (p.who) who += div('t-label c-rust sm-pw w' + i, BX[i] + 22, BY + 140, BW - 44, p.who);
      });
      var evid = '', elab = '';
      EVID.forEach(function (e, i) {
        evid += Kit.photo(IMG + e.img, { x: e.x, y: e.y, w: e.w, h: e.h, framed: true, cls: 'sm-ev e' + i, alt: e.alt });
        elab += div('t-label c-rust sm-el l' + i, e.x, 790, 420, e.lab);
      });
      return svg('sm-sys-svg', frames + arrows + chips +
        '<g class="sm-bus">' + Kit.rough.line(270, 556, 1650, 556, { seed: 60, w: 'heavy' }) +
          Kit.rough.arrow(960, 562, 960, 586, { seed: 59, w: 'heavy', head: 24 }) + '</g>' +
        '<g class="sm-hubb">' + Kit.rough.rect(600, 592, 720, 158,
          { seed: 61, w: 'heavy', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .2, hachureGap: 20 }) +
          tx(960, 660, 'Food graph', { size: 52, anchor: 'middle', fill: C.text, cls: 'disp', weight: 700 }) +
          tx(960, 702, 'ingredient IDs · nutrition', { size: 28, anchor: 'middle', fill: C.text2, cls: 'mono', weight: 500 }) +
          tx(960, 736, 'allergens · Food List', { size: 28, anchor: 'middle', fill: C.text2, cls: 'mono', weight: 500 }) + '</g>' +
        '<g class="dd-cap">' + Kit.doodle.underline(1366, 752, 410, { seed: 203, color: 'var(--rust-t)' }) + '</g>') +
        cards + who + evid + elab +
        div('t-h2 sm-sw', 1360, 600, 440, 'Swap models. Keep the graph.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-pf, .sm-pc, .sm-pa, .sm-ch, .sm-ev, .sm-el, .sm-sw, .sm-pw, .sm-bus, .dd-cap'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.sm-hubb .rp'), { at: .3, duration: .9 });
      tl.fromTo(qa('.sm-hubb text'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .1 }, .8);

      // [click 1] the five parts
      ctx.pause();
      tl.addLabel('p');
      tl.to(qa('.sm-pf'), { autoAlpha: 1, duration: .01, stagger: .16 }, 'p');
      Kit.draw(tl, qa('.sm-pf .rp'), { at: 'p', duration: .45, stagger: .16 });
      Kit.show(tl, qa('.sm-pc'), { at: 'p+=.15', y: 16, stagger: .16, duration: .45 });

      // [click 2] what travels between them is typed data, not prose
      ctx.pause();
      tl.addLabel('t');
      Kit.show(tl, qa('.sm-ch'), { at: 't', y: 10, stagger: .1, duration: .35 });
      tl.to(qa('.sm-pa'), { autoAlpha: 1, duration: .01, stagger: .1 }, 't+=.2');
      Kit.draw(tl, qa('.sm-pa .rp'), { at: 't+=.2', duration: .35, stagger: .1 });
      tl.to(q('.sm-bus'), { autoAlpha: 1, duration: .01 }, 't+=.8');
      Kit.draw(tl, qa('.sm-bus .rp'), { at: 't+=.8', duration: .6, stagger: .25 });

      // [click 3] four of these were on screen in the demo
      ctx.pause();
      tl.addLabel('e');
      Kit.drop(tl, qa('.sm-ev'), { at: 'e', stagger: .18, from: -120 });
      Kit.show(tl, qa('.sm-el'), { at: 'e+=.4', y: 10, stagger: .18, duration: .4 });

      // [click 4] the named models are the replaceable part
      ctx.pause();
      tl.addLabel('s');
      Kit.show(tl, qa('.sm-pw'), { at: 's', y: 10, stagger: .14, duration: .4 });
      tl.to(qa('.f1 .rp:not(.rp-hatch), .f3 .rp:not(.rp-hatch)'), { stroke: C.rustT, duration: .4 }, 's');
      Kit.show(tl, q('.sm-sw'), { at: 's+=.4', y: 16 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, 's+=.9');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: 's+=.9', duration: .5 });
    },
    notes:
      'So how does Samsung Food actually work? The key thing is that Samsung doesn\'t build one big model. It builds a system of parts ' +
      'around one shared food graph. ' +
      '[click] There are five parts here: understand, sense, rank, check and act, and each one uses a different kind of model.' +
      '[click] What flows between the parts is structured data, like an ingredient ID, a quantity with a unit, or a temperature. ' +
      '[click] You actually already saw these 3 parts in the demo.' +
      '[click] And the models themselves are swappable. Gemini runs the 2026 fridge camera, and Samsung\'s terms also allow OpenAI for ' +
      'recipes, so either one could be replaced next year while the graph and the rules stay the same.'
  };

  /* ============================================================== 4 · INPUTS */
  var SPELL = ['plain flour', 'all-purpose flour', 'AP flour', '1 tbsp flour'];
  var INPUTS = {
    id: 'inputs',
    title: 'The food graph',
    heading: 'The food graph',
    budgetSec: 40,
    html: function () {
      var chipF = '', chips = '', conv = '';
      SPELL.forEach(function (s, i) {
        var y = 556 + i * 72;
        chipF += '<g class="sm-spf s' + i + '">' + Kit.rough.rect(120, y, 370, 62, { seed: 71 + i, w: 'fine', stroke: C.text3 }) + '</g>';
        chips += div('sm-sp q' + i, 120, y, 370, '<span class="t-mono">' + Kit.esc(s) + '</span>', 'height:62px;');
        conv += '<g class="sm-cv v' + i + '">' + Kit.rough.arrow(502, y + 31, 586, 700,
          { seed: 81 + i, w: 'normal', head: 15, bend: 16 - i * 11, stroke: C.text2 }) + '</g>';
      });
      return svg('sm-in-svg',
        chipF + conv +
        '<g class="sm-node">' + Kit.rough.rect(600, 632, 230, 136,
          { seed: 91, w: 'heavy', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .2, hachureGap: 18 }) +
          tx(715, 712, 'flour', { size: 52, anchor: 'middle', fill: C.text, cls: 'disp', weight: 700 }) + '</g>' +
        // the Food List is built from EVERY detection, so both labels feed one collector line
        '<g class="sm-fcol">' +
          Kit.rough.line(1066, 710, 1632, 710, { seed: 101, w: 'fine', stroke: C.text2 }) +
          Kit.rough.line(1066, 690, 1066, 710, { seed: 102, w: 'fine', stroke: C.text2 }) +
          Kit.rough.line(1632, 692, 1632, 710, { seed: 103, w: 'fine', stroke: C.text2 }) + '</g>' +
        '<g class="sm-fla">' + Kit.rough.arrow(1349, 712, 1349, 736, { seed: 97, w: 'heavy', head: 18 }) + '</g>' +
        '<g class="sm-strip">' + Kit.rough.rect(120, 892, 1680, 118,
          { seed: 98, w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .16, hachureGap: 26 }) +
          tx(960, 968, 'Food graph', { size: 52, anchor: 'middle', fill: C.text, cls: 'disp', weight: 700 }) + '</g>' +
        '<g class="sm-fa1">' + Kit.rough.arrow(715, 844, 760, 886, { seed: 99, w: 'heavy', head: 22 }) + '</g>' +
        '<g class="sm-fa2">' + Kit.rough.arrow(1349, 872, 1310, 888, { seed: 100, w: 'heavy', head: 22 }) + '</g>') +
        // the running example's own card, typed: this crop carries the `1 tbsp flour` row the chips below name
        Kit.photo(IMG + 'card-rows.webp', { x: 120, y: 300, w: 420, h: 244, rot: -2, framed: true, cls: 'sm-card', alt: 'The scanned card, typed: 1 egg, 1 tbsp flour' }) +
        Kit.photo(IMG + 'fridge-shelf.jpg', { x: 980, y: 296, w: 760, h: 334, framed: true, cls: 'sm-shelf', alt: 'An open fridge shelf seen from above' }) +
        chips +
        div('callout sm-oc', 552, 540, 440, 'one name, many spellings') +
        div('t-mono sm-g', 600, 788, 230, '<span class="sm-gv">0</span>') +
        div('t-label c-teal sm-dl d1', 966, 644, 200, 'apple') +
        div('t-label c-rust sm-dl d2', 1512, 644, 240, 'unknown item') +
        div('sm-flist', 1139, 740, 420, '<div class="t-body">Food List</div><div class="t-label dim">a best guess</div>') +
        // detection marks sit ON the photo, so they go in an overlay layer (KIT §6).
        // Each box is tight on one object: the apples, and the upper of the two plain containers.
        Kit.overlay(
          '<g class="sm-box-a">' + Kit.rough.rect(1009, 316, 113, 232, { seed: 95, w: 'normal', stroke: C.tealT, overshoot: 0 }) + '</g>' +
          '<g class="sm-box-b">' + Kit.rough.rect(1544, 314, 183, 145, { seed: 96, w: 'normal', stroke: C.rustT, overshoot: 0 }) + '</g>' +
          '<g class="dd-unk">' + Kit.doodle.circle(1512, 646, 240, 24, { seed: 204, color: 'var(--rust-t)', w: 'heavy', rx: 148, ry: 32 }) + '</g>');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-cv, .sm-node, .sm-oc, .sm-g, .sm-box-a, .sm-box-b, .sm-dl, .sm-fcol, .sm-fla, .sm-flist, .sm-strip, .sm-fa1, .sm-fa2, .dd-unk'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.drop(tl, qa('.sm-card, .sm-shelf'), { at: .2, stagger: .14 });
      Kit.draw(tl, qa('.sm-spf .rp'), { at: .6, duration: .4, stagger: .08 });
      Kit.show(tl, qa('.sm-sp'), { at: .65, y: 14, stagger: .08, duration: .4 });

      // [click 1] four spellings, one entity
      ctx.pause();
      tl.addLabel('c');
      tl.to(qa('.sm-cv'), { autoAlpha: 1, duration: .01, stagger: .09 }, 'c');
      Kit.draw(tl, qa('.sm-cv .rp'), { at: 'c', duration: .4, stagger: .09 });
      tl.to(q('.sm-node'), { autoAlpha: 1, duration: .01 }, 'c+=.5');
      Kit.draw(tl, qa('.sm-node .rp'), { at: 'c+=.5', duration: .5 });
      Kit.show(tl, q('.sm-oc'), { at: 'c+=.8', y: 10 });

      // [click 2] the camera names what it can, and says so when it cannot
      ctx.pause();
      tl.addLabel('d');
      tl.to(qa('.sm-box-a, .sm-box-b'), { autoAlpha: 1, duration: .01, stagger: .2 }, 'd');
      Kit.draw(tl, qa('.sm-box-a .rp'), { at: 'd', duration: .45 });
      Kit.draw(tl, qa('.sm-box-b .rp'), { at: 'd+=.2', duration: .45 });
      Kit.show(tl, qa('.sm-dl'), { at: 'd+=.4', y: 10, stagger: .18, duration: .4 });
      tl.to(q('.dd-unk'), { autoAlpha: 1, duration: .01 }, 'd+=.75');
      Kit.draw(tl, qa('.dd-unk .rp'), { at: 'd+=.75', duration: .5 });
      // both labels, not just the rust one, collect into the Food List
      tl.to(qa('.sm-fcol, .sm-fla, .sm-flist'), { autoAlpha: 1, duration: .01 }, 'd+=1.1');
      Kit.draw(tl, qa('.sm-fcol .rp'), { at: 'd+=1.1', duration: .4 });
      Kit.draw(tl, qa('.sm-fla .rp'), { at: 'd+=1.4', duration: .3 });
      Kit.show(tl, q('.sm-flist'), { at: 'd+=1.55', y: 14 });

      // [click 3] both lanes end in the same place
      ctx.pause();
      tl.addLabel('f');
      tl.to(q('.sm-strip'), { autoAlpha: 1, duration: .01 }, 'f');
      Kit.draw(tl, qa('.sm-strip .rp'), { at: 'f', duration: .7 });
      tl.to(qa('.sm-fa1, .sm-fa2'), { autoAlpha: 1, duration: .01 }, 'f+=.3');
      Kit.draw(tl, qa('.sm-fa1 .rp, .sm-fa2 .rp'), { at: 'f+=.3', duration: .4, stagger: .12 });
      Kit.show(tl, q('.sm-g'), { at: 'f+=.5', y: 10 });
      Kit.count(tl, q('.sm-gv'), { to: 15.6, decimals: 1, suffix: ' g', duration: .9, at: 'f+=.6' });
    },
    notes:
      'Let\'s start with how food gets into that graph. There are two inputs here (recipe card on the left and fridge camera on the ' +
      'right), and they both end up in the food graph.' +
      '[click] One multimodal model call reads the recipe card, but what comes out is initially a string e.g. "AP flour" which needs ' +
      'to be mapped to an ingredient ID so that it can be linked to the food graph. Whisk, the startup Samsung bought and turned into ' +
      'Samsung Food, maps ingredients to more than 140,000 store items.' +
      '[click] The second input is the fridge camera. It has a set number of known items and anything it can\'t place, it labels as an ' +
      'unknown item.' +
      '[click] Every detection feeds into the Food List which is then mapped to an ingredient ID, and both inputs end up in the Food ' +
      'graph. '
  };
  Kit.withCrumbs(INPUTS, STEPS, [0, 1]);

  /* ============================================================ 5 · RETRIEVE */
  var HIDDEN = [
    { t: 'salt', x: 620, w: 160 },
    { t: 'oil', x: 806, w: 140 },
    { t: 'oven temperature', x: 972, w: 360 },
    { t: 'step order', x: 1358, w: 250 }
  ];
  var RETRIEVE = {
    id: 'retrieve',
    title: 'Recipe retrieval',
    heading: 'Recipe retrieval',
    budgetSec: 40,
    html: function () {
      var chipF = '', chips = '';
      HIDDEN.forEach(function (h, i) {
        chipF += '<g class="sm-hf g' + i + '">' + Kit.rough.rect(h.x, 436, h.w, 70, { seed: 111 + i, w: 'fine', stroke: C.rustT }) + '</g>';
        chips += div('sm-hc n' + i, h.x, 436, h.w, '<span class="t-label c-rust">' + h.t + '</span>', 'height:70px;');
      });
      return phoneVideo('dish-retrieve.mp4', 174, 300, 300, 650) +
        svg('sm-rt-svg',
          '<g class="sm-wbox">' + Kit.rough.rect(600, 296, 1200, 250, { seed: 121, w: 'fine', stroke: C.text3 }) + '</g>' +
          chipF +
          '<g class="sm-fbox">' + Kit.rough.rect(600, 596, 1200, 404,
            { seed: 122, w: 'heavy', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .16, hachureGap: 26 }) + '</g>' +
          '<g class="dd-ok">' + Kit.doodle.mark(1700, 666, 34, 'check', { seed: 205, color: 'var(--rust-t)' }) + '</g>') +
        div('t-caps faint sm-wk', 640, 334, 700, 'Generate a recipe') +
        div('t-body dim sm-wl', 640, 382, 900, 'Has to guess what the photo hides') +
        chips +
        div('t-caps c-teal sm-fk', 640, 638, 700, 'Retrieve a recipe') +
        div('bignum sm-fn', 640, 690, 520, '<div class="t-num sm-fv">0</div>') +
        div('t-body sm-fl1', 1180, 744, 580, 'finds the right recipe among 1,000') +
        div('t-label faint sm-fl2', 1180, 820, 580, 'only returns recipes that exist') +
        div('t-body sm-rs s1', 640, 900, 400, 'image recognition' + tag('ml', 0, 0, 'in')) +
        div('t-body sm-rs s2', 1150, 900, 520, 'embedding search' + tag('ml', 0, 0, 'in')) +
        svg('sm-rs-svg', '<g class="sm-rsa">' + Kit.rough.arrow(1020, 922, 1130, 922, { seed: 124, w: 'normal', head: 16 }) + '</g>');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      wireVideo(ctx);
      gsap.set(qa('.sm-wbox, .sm-wk, .sm-wl, .sm-hf, .sm-hc, .sm-fbox, .sm-fk, .sm-fn, .sm-fl1, .sm-fl2, .dd-ok, .sm-rs, .sm-rsa'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.sm-frame .rp'), { at: .3, duration: .9 });
      Kit.fade(tl, q('.sm-vid'), { at: .9 });

      // [click 1] what a dish photo cannot tell you
      ctx.pause();
      tl.addLabel('w');
      tl.to(q('.sm-wbox'), { autoAlpha: 1, duration: .01 }, 'w');
      Kit.draw(tl, qa('.sm-wbox .rp'), { at: 'w', duration: .6 });
      Kit.show(tl, qa('.sm-wk, .sm-wl'), { at: 'w+=.2', y: 12, stagger: .1, duration: .4 });
      tl.to(qa('.sm-hf'), { autoAlpha: 1, duration: .01, stagger: .12 }, 'w+=.5');
      Kit.draw(tl, qa('.sm-hf .rp'), { at: 'w+=.5', duration: .3, stagger: .12 });
      Kit.show(tl, qa('.sm-hc'), { at: 'w+=.55', y: 10, stagger: .12, duration: .35 });

      // [click 2] so the shipped feature searches instead
      ctx.pause();
      tl.addLabel('f');
      tl.to(q('.sm-fbox'), { autoAlpha: 1, duration: .01 }, 'f');
      Kit.draw(tl, qa('.sm-fbox .rp'), { at: 'f', duration: .8 });
      Kit.show(tl, q('.sm-fk'), { at: 'f+=.3', y: 12 });
      Kit.show(tl, q('.sm-fn'), { at: 'f+=.45', y: 16 });
      Kit.count(tl, q('.sm-fv'), { to: 87.5, decimals: 1, suffix: '%', duration: 1.1, at: 'f+=.5' });
      Kit.show(tl, qa('.sm-fl1, .sm-fl2'), { at: 'f+=.9', y: 12, stagger: .12, duration: .4 });
      tl.to(q('.dd-ok'), { autoAlpha: 1, duration: .01 }, 'f+=1.4');
      Kit.draw(tl, qa('.dd-ok .rp'), { at: 'f+=1.4', duration: .4 });
      Kit.show(tl, q('.sm-rs.s1'), { at: 'f+=1.6', y: 10, duration: .4 });
      tl.to(q('.sm-rsa'), { autoAlpha: 1, duration: .01 }, 'f+=1.9');
      Kit.draw(tl, qa('.sm-rsa .rp'), { at: 'f+=1.9', duration: .3 });
      Kit.show(tl, q('.sm-rs.s2'), { at: 'f+=2.1', y: 10, duration: .4 });
    },
    notes:
      'Now what if you point the app at a finished dish instead of a recipe card? It recognises the food, and then it looks for ' +
      'existing recipes that use it.' +
      '[click] Finding a recipe from a just a photo of a dish means guessing everything the camera can\'t see, like the salt, the oil, ' +
      'the oven temperature and the order of the steps.' +
      '[click] Searching only ever returns recipes that already exist. You can see this in the clip, where the pozole recipe lists ' +
      'salt and olive oil that the camera never saw. There are two ML steps here. \n1. Image recognition names the food, and then\n2. ' +
      'embedding search finds the recipe. \nThe rough intuition for embedding search is that you turn both photos and recipes into ' +
      'embeddings in one shared space, so that a dish and its recipe land close together, and then you just return the closest recipe. ' +
      'The best research system for this picks the right recipe 7 out of 8 times. '
  };
  Kit.withCrumbs(RETRIEVE, STEPS, 1);

  /* ================================================================ 6 · RANK */
  // the order the score alone gives; the boost then lifts `Apple crumble` (index 2) into the first slot
  var RES = ['Carrot soup', 'Kale salad', 'Apple crumble'];
  var RSLOT = 212, RW = 206;
  var RANK = {
    id: 'rank',
    title: 'Filtering and ranking',
    heading: 'Filtering and ranking',
    budgetSec: 60,
    html: function () {
      var resF = '', resC = '';
      RES.forEach(function (t, i) {
        resF += '<g class="sm-rf r' + i + '">' + Kit.rough.rect(320 + i * RSLOT, 924, RW, 86, { seed: 141 + i, w: 'fine', stroke: C.tealT }) + '</g>';
        resC += div('sm-rc c' + i, 320 + i * RSLOT, 924, RW, '<span class="t-label">' + t + '</span>', 'height:86px;');
      });
      return svg('sm-rk-svg',
        '<g class="sm-s1">' + Kit.rough.rect(200, 364, 760, 140,
          { seed: 131, w: 'heavy', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .16, hachureGap: 24 }) + '</g>' +
        '<g class="sm-s2">' + Kit.rough.rect(260, 556, 640, 140, { seed: 132, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .13, hachureGap: 24 }) + '</g>' +
        '<g class="sm-s3">' + Kit.rough.rect(320, 748, 520, 130, { seed: 133, w: 'normal', stroke: C.text2 }) + '</g>' +
        '<g class="sm-fa f1">' + Kit.rough.arrow(580, 512, 580, 548, { seed: 134, w: 'heavy', head: 20 }) + '</g>' +
        '<g class="sm-fa f2">' + Kit.rough.arrow(580, 704, 580, 740, { seed: 135, w: 'heavy', head: 20 }) + '</g>' +
        '<g class="sm-fa f3">' + Kit.rough.arrow(580, 886, 580, 912, { seed: 136, w: 'heavy', head: 20 }) + '</g>' +
        resF +
        '<g class="sm-ko">' + Kit.rough.rect(1160, 380, 520, 120, { seed: 137, w: 'normal', stroke: C.text3 }) + '</g>' +
        '<g class="sm-koa">' + Kit.rough.arrow(975, 434, 1145, 434, { seed: 138, w: 'heavy', head: 24, stroke: C.rustT }) + '</g>' +
        '<g class="dd-x">' + Kit.doodle.mark(1420, 440, 56, 'x', { seed: 206, color: 'var(--rust-t)' }) + '</g>' +
        '<g class="sm-bar b1"><rect x="1300" y="668" width="400" height="26" rx="13" fill="' + C.teal + '"/></g>' +
        '<g class="sm-bar b2"><rect x="1300" y="736" width="150" height="26" rx="13" fill="' + C.teal + '"/></g>' +
        '<g class="sm-lift">' + Kit.rough.arrow(286, 1006, 286, 944, { seed: 139, w: 'normal', head: 18, stroke: C.rustT }) + '</g>' +
        '<g class="dd-cap">' + Kit.doodle.underline(1166, 932, 500, { seed: 207, color: 'var(--rust-t)' }) + '</g>') +
        div('t-h2 sm-top', 200, 296, 900, '<span class="sm-tv">0</span> recipes') +
        div('t-caps c-rust sm-sk k1', 240, 404, 500, 'Hard filter') + tag('rule', 830, 400, 'sm-sk k1') +
        div('t-body sm-sl l1', 240, 448, 600, 'nut allergy') +
        div('t-caps c-teal sm-sk k2', 300, 596, 500, 'Score') +
        div('t-body sm-sl l2', 300, 640, 600, 'collaborative filtering') + tag('ml', 790, 592, 'sm-sk k2') +
        div('t-caps dim sm-sk k3', 360, 788, 500, 'Boost') +
        div('t-body sm-sl l3', 360, 828, 520, 'apples, use by Thursday') + tag('ml', 740, 784, 'sm-sk k3', 'ML feature') +
        div('t-body sm-kot', 1180, 420, 480, 'Taffy Apple Salad') +
        div('t-caps faint sm-sg', 1160, 600, 640, 'Learned from') +
        div('t-label sm-bl g1', 1160, 662, 130, 'save') +
        div('t-label sm-bl g2', 1160, 730, 130, 'view') +
        resC +
        div('t-h2 sm-cap', 1160, 846, 640, 'Filter, then rank.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-s1, .sm-s2, .sm-s3, .sm-sk, .sm-sl, .sm-fa, .sm-rf, .sm-rc, .sm-ko, .sm-kot, .sm-koa, .dd-x, .sm-sg, .sm-bl, .sm-bar, .sm-lift, .sm-cap, .dd-cap'), { autoAlpha: 0 });
      gsap.set(qa('.sm-bar rect'), { scaleX: 0, transformOrigin: '0% 50%' });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.show(tl, q('.sm-top'), { at: .25, y: 16 });
      Kit.count(tl, q('.sm-tv'), { to: 160000, commas: true, suffix: '+', duration: 1.2, at: .3 });

      // [click 1] the hard filter throws a recipe out
      ctx.pause();
      tl.addLabel('h');
      tl.to(q('.sm-s1'), { autoAlpha: 1, duration: .01 }, 'h');
      Kit.draw(tl, qa('.sm-s1 .rp'), { at: 'h', duration: .6 });
      Kit.show(tl, qa('.k1, .l1'), { at: 'h+=.3', y: 12, stagger: .1, duration: .4 });
      tl.to(qa('.sm-koa, .sm-ko'), { autoAlpha: 1, duration: .01 }, 'h+=.8');
      Kit.draw(tl, qa('.sm-koa .rp'), { at: 'h+=.8', duration: .4 });
      Kit.draw(tl, qa('.sm-ko .rp'), { at: 'h+=1', duration: .4 });
      tl.fromTo(q('.sm-kot'), { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: .5, ease: Kit.ease.out }, 'h+=1');
      tl.to(q('.dd-x'), { autoAlpha: 1, duration: .01 }, 'h+=1.4');
      Kit.draw(tl, qa('.dd-x .rp'), { at: 'h+=1.4', duration: .4, stagger: .08 });

      // [click 2] soft preferences go into a score, learned from weak signals
      ctx.pause();
      tl.addLabel('s');
      tl.to(qa('.sm-fa.f1, .sm-s2'), { autoAlpha: 1, duration: .01 }, 's');
      Kit.draw(tl, qa('.sm-fa.f1 .rp'), { at: 's', duration: .3 });
      Kit.draw(tl, qa('.sm-s2 .rp'), { at: 's+=.2', duration: .5 });
      Kit.show(tl, qa('.k2, .l2'), { at: 's+=.4', y: 12, stagger: .1, duration: .4 });
      Kit.show(tl, qa('.sm-sg, .sm-bl'), { at: 's+=.7', y: 10, stagger: .1, duration: .35 });
      tl.to(qa('.sm-bar'), { autoAlpha: 1, duration: .01 }, 's+=.8');
      tl.to(q('.b1 rect'), { scaleX: 1, duration: .6, ease: 'power2.out' }, 's+=.9');
      tl.to(q('.b2 rect'), { scaleX: 1, duration: .6, ease: 'power2.out' }, 's+=1.1');

      // [click 3] context nudges the score
      ctx.pause();
      tl.addLabel('b');
      tl.to(qa('.sm-fa.f2, .sm-s3'), { autoAlpha: 1, duration: .01 }, 'b');
      Kit.draw(tl, qa('.sm-fa.f2 .rp'), { at: 'b', duration: .3 });
      Kit.draw(tl, qa('.sm-s3 .rp'), { at: 'b+=.2', duration: .5 });
      Kit.show(tl, qa('.k3, .l3'), { at: 'b+=.4', y: 12, stagger: .1, duration: .4 });
      // the three survivors land in the order the score alone gives
      tl.to(q('.sm-fa.f3'), { autoAlpha: 1, duration: .01 }, 'b+=.8');
      Kit.draw(tl, qa('.sm-fa.f3 .rp'), { at: 'b+=.8', duration: .3 });
      tl.to(qa('.sm-rf'), { autoAlpha: 1, duration: .01, stagger: .12 }, 'b+=1');
      Kit.draw(tl, qa('.sm-rf .rp'), { at: 'b+=1', duration: .35, stagger: .12 });
      Kit.show(tl, qa('.sm-rc'), { at: 'b+=1.05', y: 12, stagger: .12, duration: .4 });

      // [click 4] the boost fires: the apple dish moves to the front, and the rule behind all of it
      ctx.pause();
      tl.addLabel('o');
      tl.to(qa('.sm-rf.r2, .sm-rc.c2'), { x: -2 * RSLOT, duration: .7, ease: Kit.ease.out }, 'o');
      tl.to(qa('.sm-rf.r0, .sm-rc.c0, .sm-rf.r1, .sm-rc.c1'), { x: RSLOT, duration: .7, ease: Kit.ease.out }, 'o');
      tl.to(qa('.sm-rf.r2 .rp:not(.rp-hatch)'), { stroke: C.rustT, duration: .4 }, 'o+=.4');
      tl.to(q('.sm-lift'), { autoAlpha: 1, duration: .01 }, 'o+=.6');
      Kit.draw(tl, qa('.sm-lift .rp'), { at: 'o+=.6', duration: .4 });
      Kit.show(tl, q('.sm-cap'), { at: 'o+=1', y: 14 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, 'o+=1.4');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: 'o+=1.4', duration: .5 });
    },
    notes:
      'Next is ranking, which is how the app decides what to recommend. We start with every recipe in the catalogue, and let\'s say ' +
      'this household has a nut allergy.' +
      '[click] The first step here isn\'t ML at all, it\'s just a rule. Our demo recipe has peanuts, so it should never show up, no ' +
      'matter how good a match it is.' +
      '[click] The scoring is where the ML comes in, with a recommender system. The usual technique is called collaborative filtering. ' +
      'It learns a taste profile for each person and each recipe from what people saved and viewed, and the score is how well the two ' +
      'profiles match. The intuition is that if people with similar taste to you saved a recipe, you\'ll probably like it too, even if ' +
      'you\'ve never seen it. People rarely actually rate recipes, so a save counts for more than a view. ' +
      '[click] So the top three come out in score order. In addition, samsung\'s meal plans feature favours ingredients that are close ' +
      'to their use-by date.' +
      '[click] So the apple dish moves to the front. The general pattern here is to filter with rules first, and then rank with ML.'
  };
  Kit.withCrumbs(RANK, STEPS, 2);

  /* =============================================================== 7 · CHECK */
  var GATES = [
    { t: 'Allergens', r: 'no nuts left', m: 'ok' },
    { t: 'Nutrition', r: 'recomputed: 310 kcal', m: 'bad' },
    { t: 'Units', r: 'scaled in code', m: 'ok' },
    { t: 'Servings', r: 'ask the user', m: 'ask' }
  ];
  var GY = [300, 480, 660, 840], GH = 150;
  var DRAFT = ['peanuts → sunflower seeds', 'serves: 0', '≈ 220 kcal'];
  var CHECK = {
    id: 'check',
    title: 'Checking LLM output',
    heading: 'Checking LLM output',
    budgetSec: 70,
    html: function () {
      var gF = '', gC = '', gM = '';
      GATES.forEach(function (g, i) {
        gF += '<g class="sm-gf f' + i + '">' + Kit.rough.rect(980, GY[i], 820, GH,
          { seed: 151 + i, w: i === 1 ? 'heavy' : 'normal', stroke: i === 1 ? C.rustT : C.text2 }) + '</g>';
        gM += '<g class="sm-gm m' + i + '">' + (g.m === 'ok'
          ? Kit.doodle.mark(1030, GY[i] + GH / 2, 26, 'check', { seed: 161 + i, color: 'var(--sec-t)' })
          : g.m === 'bad'
            ? Kit.doodle.mark(1030, GY[i] + GH / 2, 24, 'x', { seed: 161 + i, color: 'var(--rust-t)' })
            : tx(1030, GY[i] + GH / 2 + 16, '?', { size: 48, anchor: 'middle', fill: C.text2, weight: 700 })) + '</g>';
        gC += div('sm-gc g' + i, 1080, GY[i], 700,
          '<span class="t-body sm-gt">' + g.t + '</span><span class="t-label sm-gr' + (g.m === 'bad' ? ' c-rust' : ' dim') + '">' + Kit.esc(g.r) + '</span>',
          'height:' + GH + 'px;');
      });
      var lines = DRAFT.map(function (l, i) {
        return div('t-mono sm-dr r' + i, 160, 500 + i * 58, 580, Kit.esc(l));
      }).join('');
      return svg('sm-ck-svg',
        '<g class="sm-draft">' + Kit.rough.rect(120, 390, 640, 300,
          { seed: 171, w: 'heavy', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .13, hachureGap: 26 }) + '</g>' +
        gF + gM +
        '<g class="sm-back">' + Kit.rough.arrow(970, 560, 780, 620, { seed: 172, w: 'heavy', head: 24, bend: 40, stroke: C.rustT }) + '</g>' +
        '<g class="sm-ca">' + Kit.rough.arrow(430, 724, 540, 650, { seed: 173, w: 'normal', head: 16, bend: 14, stroke: C.rustT }) + '</g>' +
        '<g class="dd-last">' + Kit.doodle.underline(126, 940, 670, { seed: 208 }) + '</g>') +
        div('chip sm-req', 120, 296, 0, '<span class="dot"></span>Make it nut-free') +
        div('t-caps c-rust sm-dk', 160, 428, 500, 'LLM draft') + lines +
        div('callout sm-cc', 140, 726, 420, 'LLMs guess numbers') +
        div('t-h2 sm-last', 120, 862, 760, 'The LLM drafts. Code checks.') +
        Kit.photo(IMG + 'still-servings.webp', { x: 1560, y: 876, w: 230, h: 62, framed: true, cls: 'sm-sv', alt: 'The servings field, left at 0 persons' }) +
        gC;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-draft, .sm-dk, .sm-dr, .sm-gf, .sm-gc, .sm-gm, .sm-back, .sm-cc, .sm-ca, .sm-last, .dd-last, .sm-sv'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.show(tl, q('.sm-req'), { at: .3, y: 14 });

      // [click 1] the model writes a draft
      ctx.pause();
      tl.addLabel('d');
      tl.to(q('.sm-draft'), { autoAlpha: 1, duration: .01 }, 'd');
      Kit.draw(tl, qa('.sm-draft .rp'), { at: 'd', duration: .7 });
      Kit.show(tl, q('.sm-dk'), { at: 'd+=.3', y: 10 });
      tl.fromTo(qa('.sm-dr'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: .35, stagger: .18 }, 'd+=.5');

      // [click 2] two gates read the graph and pass
      ctx.pause();
      tl.addLabel('p');
      [0, 2].forEach(function (i, k) {
        tl.to(q('.sm-gf.f' + i), { autoAlpha: 1, duration: .01 }, 'p+=' + k * .35);
        Kit.draw(tl, qa('.sm-gf.f' + i + ' .rp'), { at: 'p+=' + k * .35, duration: .4 });
        Kit.show(tl, q('.sm-gc.g' + i), { at: 'p+=' + (k * .35 + .1), y: 10, duration: .4 });
        tl.to(q('.sm-gm.m' + i), { autoAlpha: 1, duration: .01 }, 'p+=' + (k * .35 + .3));
        Kit.draw(tl, qa('.sm-gm.m' + i + ' .rp'), { at: 'p+=' + (k * .35 + .3), duration: .3 });
      });

      // [click 3] the nutrition gate fails and sends the draft back
      ctx.pause();
      tl.addLabel('n');
      tl.to(q('.sm-gf.f1'), { autoAlpha: 1, duration: .01 }, 'n');
      Kit.draw(tl, qa('.sm-gf.f1 .rp'), { at: 'n', duration: .45 });
      Kit.show(tl, q('.sm-gc.g1'), { at: 'n+=.15', y: 10, duration: .4 });
      tl.to(q('.sm-gm.m1'), { autoAlpha: 1, duration: .01 }, 'n+=.4');
      Kit.draw(tl, qa('.sm-gm.m1 .rp'), { at: 'n+=.4', duration: .3, stagger: .06 });
      tl.to(q('.sm-dr.r2'), { color: C.rustT, textDecoration: 'line-through', duration: .4 }, 'n+=.6');
      tl.to(q('.sm-back'), { autoAlpha: 1, duration: .01 }, 'n+=.8');
      Kit.draw(tl, qa('.sm-back .rp'), { at: 'n+=.8', duration: .5 });
      Kit.show(tl, q('.sm-cc'), { at: 'n+=1.1', y: 10 });
      tl.to(q('.sm-ca'), { autoAlpha: 1, duration: .01 }, 'n+=1.1');
      Kit.draw(tl, qa('.sm-ca .rp'), { at: 'n+=1.1', duration: .35 });

      // [click 4] a missing field goes to the user
      ctx.pause();
      tl.addLabel('a');
      tl.to(q('.sm-gf.f3'), { autoAlpha: 1, duration: .01 }, 'a');
      Kit.draw(tl, qa('.sm-gf.f3 .rp'), { at: 'a', duration: .45 });
      Kit.show(tl, q('.sm-gc.g3'), { at: 'a+=.15', y: 10, duration: .4 });
      tl.to(q('.sm-gm.m3'), { autoAlpha: 1, duration: .4 }, 'a+=.35');
      Kit.drop(tl, q('.sm-sv'), { at: 'a+=.5' });
      Kit.show(tl, q('.sm-last'), { at: 'a+=.9', y: 16 });
      tl.to(q('.dd-last'), { autoAlpha: 1, duration: .01 }, 'a+=1.3');
      Kit.draw(tl, qa('.dd-last .rp'), { at: 'a+=1.3', duration: .5 });
    },
    notes:
      'Next is checking the output of an LLM. LLMs are great at writing fluent text, and Samsung\'s Personalize feature uses one to ' +
      'adapt a recipe to a diet. ' +
      '[click] Here we can see a draft recipe for Taffy Apple salad from the LLM. There is a hard rule about a peanut allergy so it ' +
      'has replaced peanuts with sunflower seeds and is drafting a serving count and a calorie figure. ' +
      '[click] The first check is allergens which is verified through the food graph. Units are next which are scaled using code. \n ' +
      '\nSTOP HERE' +
      '[click] Here the nutrition check fails. In a 2025 benchmark, general-purpose models were off on nutrition by 24 to 44%, so you ' +
      'recompute it from the linked ingredients and send the draft back to the model.\n\n'
  };
  Kit.withCrumbs(CHECK, STEPS, 3);

  /* ================================================================= 8 · ACT */
  var SPANS = [
    { t: 'Bake', x: 150, tag: 'Action', tagx: 206 },
    { t: 'at 180°', x: 300, tag: 'Temp', tagx: 388 },
    { t: 'for 25 minutes.', x: 520, tag: 'Time', tagx: 672 }
  ];
  var JSONL = ['device: oven', 'action: bake', 'temp_c: 180', 'min: 25', 'confirm: true'];
  var ACT = {
    id: 'act',
    title: 'Oven commands',
    heading: 'Oven commands',
    budgetSec: 30,
    html: function () {
      var words = '', tags = '';
      SPANS.forEach(function (s, i) {
        words += tx(s.x, 392, s.t, { size: 52, fill: C.text, cls: 'disp', weight: 600 });
        tags += '<g class="sm-tg t' + i + '">' +
          Kit.rough.line(s.tagx, 410, s.tagx, 440, { seed: 181 + i, w: 'fine', stroke: C.tealT }) +
          tx(s.tagx, 478, s.tag.toUpperCase(), { size: 28, anchor: 'middle', fill: C.tealT, weight: 700, ls: '.1em' }) + '</g>';
      });
      var lines = JSONL.map(function (l, i) {
        return div('t-mono sm-jl2 j' + i, 164, 624 + i * 60, 520, Kit.esc(l));
      }).join('');
      return svg('sm-act-svg', words + tags +
        '<g class="sm-da">' + Kit.rough.arrow(250, 502, 250, 556, { seed: 184, w: 'heavy', head: 22 }) + '</g>' +
        '<g class="sm-jbox">' + Kit.rough.rect(120, 560, 600, 430,
          { seed: 185, w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .15, hachureGap: 26 }) + '</g>' +
        '<g class="sm-ga">' + Kit.rough.arrow(736, 770, 806, 770, { seed: 186, w: 'heavy', head: 22 }) + '</g>' +
        '<g class="sm-gate">' + Kit.rough.rect(820, 690, 380, 160, { seed: 187, w: 'normal', stroke: C.text2 }) + '</g>' +
        '<g class="sm-oa">' + Kit.rough.arrow(1216, 770, 1286, 770, { seed: 188, w: 'heavy', head: 22 }) + '</g>' +
        '<g class="sm-oven">' + Kit.rough.rect(1310, 650, 300, 250, { seed: 189, w: 'heavy', stroke: C.tealT }) +
          Kit.rough.line(1336, 722, 1584, 722, { seed: 190, w: 'normal', stroke: C.tealT }) +
          Kit.rough.circle(1556, 686, 26, { seed: 191, w: 'fine', stroke: C.tealT }) +
          Kit.rough.rect(1352, 760, 216, 106, { seed: 192, w: 'fine', stroke: C.text3, overshoot: 0 }) + '</g>' +
        // the gate has two outcomes, so the passing path gets a visible result too
        '<g class="sm-lit">' + Kit.rough.rect(1356, 764, 208, 98,
          { seed: 194, w: 'fine', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .34, hachureGap: 14, overshoot: 0 }) + '</g>' +
        '<g class="dd-pass">' + Kit.doodle.mark(1152, 800, 26, 'check', { seed: 195, color: 'var(--sec-t)' }) + '</g>' +
        '<g class="sm-rej">' + Kit.rough.arrow(1110, 684, 1290, 452, { seed: 193, w: 'normal', head: 18, bend: 36, stroke: C.rustT }) + '</g>' +
        '<g class="dd-rx">' + Kit.doodle.mark(1476, 418, 30, 'x', { seed: 209, color: 'var(--rust-t)' }) + '</g>') +
        div('t-caps dim sm-ak', 120, 296, 700, 'One recipe step') +
        lines +
        div('t-body sm-gt2', 840, 756, 340, 'Range check') + tag('rule', 1090, 704, 'sm-gtag') +
        tag('ml', 470, 290, 'sm-tg-ml', 'ML · sequence labeling') +
        div('t-label faint sm-ovl', 1310, 926, 300, 'the oven') +
        div('chip sm-conf', 820, 900, 0, '<span class="dot"></span>user confirms') +
        div('callout sm-rk2', 1290, 326, 460, 'out of range') +
        div('t-mono sm-rv', 1290, 400, 240, '1,800');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-tg, .sm-tg-ml, .sm-gtag, .sm-da, .sm-jbox, .sm-jl2, .sm-ga, .sm-gate, .sm-gt2, .sm-oa, .sm-oven, .sm-lit, .dd-pass, .sm-ovl, .sm-conf, .sm-rej, .sm-rv, .sm-rk2, .dd-rx'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.sm-ak'), { at: .25 });
      tl.fromTo(qa('.sm-act-svg text.disp'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .12 }, .35);

      // [click 1] every span is a slot
      ctx.pause();
      tl.addLabel('t');
      tl.to(qa('.sm-tg'), { autoAlpha: 1, duration: .01, stagger: .14 }, 't');
      Kit.show(tl, q('.sm-tg-ml'), { at: 't+=.5', y: 8, duration: .35 });
      Kit.draw(tl, qa('.sm-tg .rp'), { at: 't', duration: .3, stagger: .14 });

      // [click 2] the slots become a typed command
      ctx.pause();
      tl.addLabel('j');
      tl.to(qa('.sm-da, .sm-jbox'), { autoAlpha: 1, duration: .01 }, 'j');
      Kit.draw(tl, qa('.sm-da .rp'), { at: 'j', duration: .3 });
      Kit.draw(tl, qa('.sm-jbox .rp'), { at: 'j+=.2', duration: .7 });
      tl.fromTo(qa('.sm-jl2'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .3, stagger: .12 }, 'j+=.5');

      // [click 3] nothing reaches the oven until it is checked and confirmed
      ctx.pause();
      tl.addLabel('g');
      tl.to(qa('.sm-ga, .sm-gate'), { autoAlpha: 1, duration: .01 }, 'g');
      Kit.draw(tl, qa('.sm-ga .rp'), { at: 'g', duration: .3 });
      Kit.draw(tl, qa('.sm-gate .rp'), { at: 'g+=.2', duration: .45 });
      Kit.show(tl, qa('.sm-gt2, .sm-gtag'), { at: 'g+=.4', y: 10 });
      tl.to(q('.sm-rej'), { autoAlpha: 1, duration: .01 }, 'g+=.7');
      Kit.draw(tl, qa('.sm-rej .rp'), { at: 'g+=.7', duration: .45 });
      Kit.show(tl, qa('.sm-rv, .sm-rk2'), { at: 'g+=1', y: 12, stagger: .1, duration: .4 });
      tl.to(q('.dd-rx'), { autoAlpha: 1, duration: .01 }, 'g+=1.3');
      Kit.draw(tl, qa('.dd-rx .rp'), { at: 'g+=1.3', duration: .3, stagger: .06 });
      tl.to(qa('.sm-oa, .sm-oven'), { autoAlpha: 1, duration: .01 }, 'g+=1.4');
      Kit.draw(tl, qa('.sm-oa .rp'), { at: 'g+=1.4', duration: .3 });
      Kit.draw(tl, qa('.sm-oven .rp'), { at: 'g+=1.6', duration: .5, stagger: .1 });
      // the other half of the gate: 180 passes, so the check marks and the oven window lights
      tl.to(q('.dd-pass'), { autoAlpha: 1, duration: .01 }, 'g+=2');
      Kit.draw(tl, qa('.dd-pass .rp'), { at: 'g+=2', duration: .3 });
      tl.to(q('.sm-lit'), { autoAlpha: 1, duration: .01 }, 'g+=2.1');
      Kit.draw(tl, qa('.sm-lit .rp'), { at: 'g+=2.1', duration: .5 });
      Kit.show(tl, qa('.sm-ovl, .sm-conf'), { at: 'g+=2.4', y: 10, stagger: .12, duration: .4 });
    },
    notes:
      'The last part is acting on the recipe. Samsung can send settings to a SmartThings oven, and turn recipe text into device ' +
      'commands.' +
      '[click] So an ML model tags each word of something like "Bake at 180" as an action, a temperature or a duration. This technique ' +
      'is called sequence labeling, where instead of one label for the whole sentence, you get one label per word.' +
      '[click] Those tagged pieces then become a typed object, kind of like a little form with an action field, a temperature field ' +
      'and a time field, so the oven never has to interpret a sentence.' +
      '[click] Then a simple rule checks that object against this oven\'s limits and starts the oven.'
  };
  Kit.withCrumbs(ACT, STEPS, 4);

  /* =========================================================== 9 · TAKEAWAYS */
  // one row per takeaway: number · rule · tag · one line (KIT §7)
  var TK = [
    ['01', 'Build a system, not one model', 'system design', 'Typed data between parts lets you swap any model.'],
    ['02', 'Guardrails are important.', 'validation', 'Allergens, nutrition and oven settings are computed.']
  ];
  var MARKS = [['Cook', 'teal'], ['Find', 'olive'], ['Mix', 'saffron'], ['Sell', 'cranberry'], ['Next', 'plum']];
  var TAKE = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 40,
    html: function () {
      var rows = TK.map(function (r, i) {
        return '<div class="tk-row t' + i + '" style="top:' + (344 + i * 256) + 'px">' +
          '<div class="t-h2 tk-n">' + r[0] + '</div>' +
          '<div class="tk-body"><div class="t-h2 tk-rule">' + Kit.esc(r[1]) + '</div>' +
            '<div class="t-caps c-teal tk-tag">' + r[2] + '</div>' +
            '<div class="t-body dim tk-line">' + Kit.esc(r[3]) + '</div></div>' +
        '</div>';
      }).join('');
      var strip = MARKS.map(function (m, i) {
        return (i ? '<span class="tk-sep">·</span>' : '') +
          '<span class="tk-tok k' + i + (i === 0 ? ' tk-on' : '') + '"><span class="t-caps">' + m[0] + '</span></span>';
      }).join('');
      return '<div class="sm-bg" style="background-image:url(' + IMG + 'cookbook.jpg)"></div><div class="sm-veil"></div>' +
        svg('sm-tk-svg',
          '<g class="dd-t0">' + Kit.doodle.underline(252, 416, 1120, { seed: 210 }) + '</g>' +
          '<g class="dd-t1">' + Kit.doodle.underline(252, 672, 700, { seed: 211 }) + '</g>') +
        rows + '<div class="tk-strip">' + strip + '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.t0 > *, .t1 > *, .dd-t0, .dd-t1'), { autoAlpha: 0 });
      gsap.set(qa('.tk-tok:not(.tk-on) .t-caps'), { color: C.text3 });
      tl.fromTo(q('.sm-bg'), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: .9, ease: 'power3.out' }, 0);
      Kit.rise(tl, qa('.hd > *'), { at: .2, stagger: .1 });
      Kit.fade(tl, q('.tk-strip'), { at: .5 });

      ctx.pause();
      Kit.show(tl, qa('.t0 > *'), { y: 18, stagger: .08, duration: .5 });
      tl.to(q('.dd-t0'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-t0 .rp'), { at: '<', duration: .5 });

      ctx.pause();
      Kit.show(tl, qa('.t1 > *'), { y: 18, stagger: .08, duration: .5 });
      tl.to(q('.dd-t1'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-t1 .rp'), { at: '<', duration: .5 });
      tl.to(q('.k1 .t-caps'), { color: C.oliveT, duration: .5 }, '>-.1');
    },
    notes:
      ' Two takeaways from this section.' +
      '[click] #1, The selling point is the unique interconnected system they have built not the ML Model itself.  ' +
      '[click] #2,  02 — GUARDRAILS are important. Code checks the allergens, nutrition and the oven ' +
      'settings.\n\n\n----------------------------------------------------\n\nSamsung reported over 6 million users in July 2024.'
  };

  Deck.section({
    id: 'samsung', order: 1, num: '01', kicker: 'Cook', title: 'Samsung Food', color: 'teal',
    toss: 'assets/img/intro/card.webp',
    opener: {
      id: 'opener', budgetSec: 10,
      notes:
        'Our first application is Samsung Food, which is all about cooking. The idea is that it helps a household decide what to cook ' +
        'tonight, and then it connects that choice to the kitchen itself.'
    },
    slides: [DEMO, PROBLEM, SYSTEM, INPUTS, RETRIEVE, RANK, CHECK, ACT, TAKE]
  });
})();
