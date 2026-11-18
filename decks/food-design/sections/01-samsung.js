/* ==========================================================================
   01 · Read · Samsung Food   (budget 390 s)
   Spec: specs/samsung.md. Roadmap cards / crumbs: Read → Sort → Parse → Link.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/samsung/';
  var STEPS = ['Read', 'Sort', 'Parse', 'Link'];

  /* ---------- local helpers (KIT §4: helpers live inside the section) ---------- */

  /** Rounded-rectangle path, drawn with the rough.js wobble. */
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
  /** Absolutely positioned block. */
  function div(cls, x, y, w, inner, extra) {
    return '<div class="' + cls + '" style="left:' + x + 'px;top:' + y + 'px;' + (w ? 'width:' + w + 'px;' : '') +
      (extra || '') + '">' + inner + '</div>';
  }

  /* ================================================================ 1 · DEMO */
  var DEMO = {
    id: 'demo',
    title: 'Recipe from a photo',
    heading: 'Recipe from a photo',
    budgetSec: 45,
    html: function () {
      var g = svg('sm-demo-svg',
        '<g class="sm-frame">' + rr(760, 280, 400, 640, 36, { seed: 11, sw: 3, rough: .8 }) + '</g>' +
        '<g class="sm-ain">' + Kit.rough.arrow(640, 452, 742, 492, { seed: 12, sw: 3, head: 16, bend: 14 }) + '</g>' +
        '<g class="sm-aout">' + Kit.rough.arrow(1178, 492, 1280, 452, { seed: 13, sw: 3, head: 16, bend: 14 }) + '</g>' +
        '<g class="sm-ak">' + Kit.rough.arrow(1018, 610, 1082, 352, { seed: 14, sw: 2.6, stroke: C.rustT, head: 15, bend: 44 }) + '</g>');
      return g +
        div('sm-col', 120, 330, 500, '<div class="t-caps dim">Input</div><div class="t-body sm-ct">A photo of a written recipe</div>') +
        div('sm-col', 1280, 330, 500, '<div class="t-caps dim">Output</div><div class="t-body sm-ct">An editable recipe in the app</div>') +
        div('callout sm-kq', 830, 568, 0, 'demo clip') +
        div('t-body sm-demo-cap', 660, 946, 600, 'Photo in, record out.') +
        Kit.src('Samsung Food Help Center; App Store version history, 30 Jul 2025', 'Confirmed');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-demo-cap'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.sm-col'), { at: .25, stagger: .12 });
      Kit.draw(tl, qa('.sm-frame .rp'), { at: .5, duration: .9 });
      Kit.draw(tl, qa('.sm-ain .rp, .sm-aout .rp'), { at: .9, duration: .5, stagger: .08 });
      Kit.fade(tl, q('.sm-kq'), { at: 1.2 });
      Kit.draw(tl, qa('.sm-ak .rp'), { at: 1.25, duration: .5 });
      Kit.fade(tl, q('.src'), { at: 1.3 });

      ctx.pause();
      Kit.show(tl, q('.sm-demo-cap'), { y: 18 });
    },
    notes:
      'Let\'s start with the thing itself. You point your phone at a recipe, and a few seconds later it is in the app: a title, an ingredient list, steps you can edit. ' +
      'Samsung shipped this in July. Basic accounts get three free scans, then it needs the paid tier. ' +
      'If the recipe runs over one page, you add a second photo and it stitches them together. ' +
      '[click] Photo in, record out. That is the promise. ' +
      'The rest of this section is what happens during those few seconds of waiting, because every single step in there can go wrong, and each one fails in its own way.'
  };

  /* ============================================================= 2 · PROBLEM */
  var DOWNSTREAM = ['Search', 'Nutrition', 'Servings', 'Shopping list', 'Oven'];
  var PROBLEM = {
    id: 'problem',
    title: 'The recipe problem',
    heading: 'The recipe problem',
    budgetSec: 45,
    html: function () {
      var json = [
        '{',
        '  "title":       "",',
        '  "yield":       "",',
        '  "ingredients": [],',
        '  "steps":       [],',
        '  "nutrition":   ""',
        '}'
      ].map(function (l) { return '<div>' + Kit.esc(l) + '</div>'; }).join('');
      var cards = DOWNSTREAM.map(function (t, i) {
        return div('sm-dcard d' + i, 120 + i * 340, 860, 320, '<span class="t-label">' + t + '</span>');
      }).join('');
      return svg('sm-prob-svg', '<g class="sm-parrow">' + Kit.rough.arrow(876, 560, 1020, 560, { seed: 21, sw: 3.4, head: 20, bend: -10 }) + '</g>') +
        '<div class="t-caps dim sm-pk sm-pk1">A photo</div>' +
        Kit.photo(IMG + 'recipe-card.jpg', { x: 120, y: 320, w: 720, h: 480, rot: -3, framed: true, cls: 'sm-card', alt: 'A handwritten recipe card' }) +
        '<div class="t-caps dim sm-pk sm-pk2">A record</div>' +
        div('card sm-json', 1060, 320, 740, '<div class="t-mono">' + json + '</div>', 'height:400px;') +
        div('sm-chip-rust', 1060, 762, 0, '50+ fields, typed by hand') +
        cards +
        Kit.src('NYT recipe structuring, via Digital Humanities Now; Samsung Food brand page. The record is an illustrative schema.', 'Confirmed');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-json, .sm-pk2, .sm-chip-rust'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.sm-pk1'), { at: .2 });
      Kit.drop(tl, q('.sm-card'), { at: .25, rot: -3 });
      Kit.fade(tl, q('.src'), { at: .6 });
      tl.fromTo(qa('.sm-parrow .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);

      ctx.pause();
      tl.addLabel('r');
      tl.to(qa('.sm-parrow .rp'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, 'r');
      Kit.show(tl, q('.sm-pk2'), { at: 'r+=.2', y: 0 });
      Kit.show(tl, q('.sm-json'), { at: 'r+=.3', y: 22 });

      ctx.pause();
      Kit.show(tl, q('.sm-chip-rust'), { y: 16 });

      ctx.pause();
      tl.to(qa('.sm-dcard'), { opacity: 1, y: 0, duration: .45, stagger: .06, ease: Kit.ease.out });
      tl.to(qa('.sm-dcard .t-label'), { color: C.tealT, duration: .4, stagger: .06 }, '<');
    },
    notes:
      'Here is the problem underneath it. On the left is a photo. To a computer that is a grid of coloured dots, and nothing in it can be searched or added up. ' +
      '[click] What the app needs is a record: named fields with values in them. ' +
      '[click] Filling that in by hand is slow. Before the New York Times automated its own archive, people typed recipes into a form, field by field. An average recipe needed over fifty fields. ' +
      '[click] And every feature depends on that record. Ingredient search runs over forty-two thousand products. Nutrition, servings, the shopping list, the oven. None of them read the photo.'
  };

  /* ============================================================ 3 · APPROACH */
  var ROAD = [
    { n: '1', step: 'Read', q: 'What does the page say?', tech: 'OCR or a vision-language model' },
    { n: '2', step: 'Sort', q: 'Which text is which?', tech: 'Layout analysis' },
    { n: '3', step: 'Parse', q: 'What is in this line?', tech: 'Sequence labeling' },
    { n: '4', step: 'Link', q: 'Which ingredient is this?', tech: 'Entity normalization' }
  ];
  var APPROACH = {
    id: 'approach',
    title: 'How the scanner works',
    heading: 'How the scanner works',
    budgetSec: 30,
    html: function () {
      var frames = ROAD.map(function (r, i) {
        return '<g class="sm-rf f' + i + '">' + rr(120 + i * 425, 380, 380, 420, 24, { seed: 31 + i, sw: 3, rough: .9 }) + '</g>';
      }).join('');
      var cards = ROAD.map(function (r, i) {
        return div('sm-rcard rc' + i, 120 + i * 425, 380, 380,
          '<div class="t-mono sm-rn">' + r.n + '</div>' +
          '<div class="t-h2 sm-rs">' + r.step + '</div>' +
          '<div class="t-body sm-rq">' + Kit.esc(r.q) + '</div>' +
          '<div class="t-label sm-rt c-teal">' + Kit.esc(r.tech) + '</div>');
      }).join('');
      return svg('sm-road-svg', frames) + cards +
        div('sm-inf', 120, 866, 1200, '<span class="t-body dim">Samsung has not published its pipeline.</span><span class="flag sm-flag-rust">Inferred</span>') +
        Kit.src('Standard decomposition; Samsung Food brand page; Samsung patent US20230134600A1', 'Inferred');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-rcard'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.sm-rf .rp'), { at: .2, duration: .7, stagger: .1 });
      Kit.fade(tl, qa('.sm-inf, .src'), { at: .5, stagger: .06 });
      for (var i = 0; i < ROAD.length; i++) {
        ctx.pause();
        Kit.show(tl, q('.rc' + i), { y: 18, duration: .5 });
      }
    },
    notes:
      'You tap the button and you wait. Four things have to happen in that wait. ' +
      '[click] One, read: get the characters off the page. ' +
      '[click] Two, sort: which text is the title, which is the ingredients, which is the method. ' +
      '[click] Three, parse: pull the quantity and the name out of one line. ' +
      '[click] Four, link: decide which real ingredient that name is. Samsung has published none of this.'
  };

  /* ================================================================ 4 · READ */
  var CHAIN = ['OCR', 'Layout', 'Parse', 'Link'];
  var READ = {
    id: 'read',
    title: 'Reading the page',
    heading: 'Reading the page',
    budgetSec: 70,
    html: function () {
      var boxes = '', arrows = '', dots = '';
      CHAIN.forEach(function (t, i) {
        var x = 400 + i * 340;
        boxes += '<g class="sm-cb b' + i + '">' + rr(x, 350, 290, 120, 20, { seed: 41 + i, sw: 3, rough: .9 }) +
          tx(x + 145, 422, t, { size: 36, anchor: 'middle', fill: C.text }) + '</g>';
        if (i < 3) {
          arrows += '<g class="sm-ca a' + i + '">' + Kit.rough.arrow(x + 298, 410, x + 332, 410, { seed: 51 + i, sw: 3, head: 14 }) + '</g>';
          dots += '<circle class="sm-dot d' + i + '" cx="' + (x + 315) + '" cy="' + 410 + '" r="9" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>';
        }
      });
      var inset =
        '<g class="sm-inset">' +
          Kit.rough.line(545, 474, 545, 498, { seed: 61, sw: 2.6, stroke: C.text2 }) +
          Kit.rough.line(545, 498, 885, 498, { seed: 62, sw: 2.6, stroke: C.text2 }) +
          Kit.rough.line(885, 498, 885, 516, { seed: 63, sw: 2.6, stroke: C.text2 }) +
          Kit.rough.line(545, 498, 545, 516, { seed: 68, sw: 2.6, stroke: C.text2 }) +
          rr(400, 520, 290, 120, 20, { seed: 64, sw: 3, rough: .9, stroke: C.text2 }) +
          rr(740, 520, 290, 120, 20, { seed: 65, sw: 3, rough: .9, stroke: C.text2 }) +
          tx(545, 566, 'encoder', { size: 28, anchor: 'middle', fill: C.tealT, weight: 700 }) +
          tx(545, 606, 'looks at pixels', { size: 28, anchor: 'middle', fill: C.text2, weight: 500 }) +
          tx(885, 566, 'decoder', { size: 28, anchor: 'middle', fill: C.tealT, weight: 700 }) +
          tx(885, 606, 'writes characters', { size: 28, anchor: 'middle', fill: C.text2, weight: 500 }) +
          Kit.rough.arrow(698, 580, 732, 580, { seed: 66, sw: 3, head: 14, stroke: C.text2 }) +
        '</g>' +
        '<g class="sm-ik">' + Kit.rough.arrow(1104, 566, 1042, 580, { seed: 67, sw: 2.6, stroke: C.rustT, head: 14, bend: -12 }) + '</g>';
      var pathB =
        '<g class="sm-bb">' + rr(400, 740, 630, 130, 20, { seed: 71, sw: 3.4, rough: .9, stroke: C.rustT }) +
          tx(715, 818, 'One model, one pass', { size: 36, anchor: 'middle', fill: C.text }) +
          Kit.rough.arrow(1040, 805, 1104, 805, { seed: 72, sw: 3, head: 16, stroke: C.rustT }) + '</g>';
      var feeds =
        '<g class="sm-feed">' + Kit.rough.arrow(352, 500, 394, 430, { seed: 81, sw: 2.6, head: 14, bend: 10, stroke: C.text2 }) + '</g>' +
        '<g class="sm-feed2">' + Kit.rough.arrow(352, 672, 394, 760, { seed: 82, sw: 2.6, head: 14, bend: -10, stroke: C.text2 }) + '</g>';
      return svg('sm-read-svg', feeds + boxes + arrows + inset + pathB + '<g class="sm-dots">' + dots + '</g>') +
        '<div class="t-caps dim sm-pagek">One page</div>' +
        Kit.photo(IMG + 'page.jpg', { x: 120, y: 430, w: 220, h: 300, rot: -2, framed: true, cls: 'sm-page', alt: 'A cookbook page' }) +
        div('t-caps sm-lane l1', 400, 286, 700, 'Path A · a chain') +
        div('t-caps sm-lane l2', 400, 676, 700, 'Path B · one model') +
        div('t-label sm-fail f1 c-teal', 1100, 288, 700, 'fails by misreading a character') +
        div('t-label sm-fail f2 c-rust', 1100, 678, 700, 'fails by inventing a line') +
        div('card sm-jchip', 1120, 740, 680, '<div class="t-mono"><div>{ "title": "…",</div><div>&nbsp;&nbsp;"ingredients": [ … ] }</div></div>', 'height:130px;') +
        div('callout sm-ck', 1118, 528, 0, 'pixels in, characters out') +
        Kit.src('TrOCR (AAAI 2023) · Donut (ECCV 2022); Samsung has not named its model. The record is illustrative.', 'Inferred');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-cb, .sm-ca, .sm-inset, .sm-ik, .sm-bb, .sm-jchip, .sm-ck, .sm-fail, .sm-dots, .sm-feed2, .sm-lane.l2'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.sm-pagek'), { at: .2 });
      Kit.drop(tl, q('.sm-page'), { at: .2, rot: -2 });
      Kit.fade(tl, q('.sm-lane.l1'), { at: .5 });
      Kit.draw(tl, qa('.sm-feed .rp'), { at: .6, duration: .5, stagger: .08 });
      Kit.fade(tl, q('.src'), { at: .7 });

      // [click 1] the chain draws, left to right
      ctx.pause();
      tl.addLabel('ch');
      tl.to(qa('.sm-cb'), { autoAlpha: 1, duration: .01, stagger: .22 }, 'ch');
      Kit.draw(tl, qa('.sm-cb .rp'), { at: 'ch', duration: .45, stagger: .22 });
      tl.to(qa('.sm-ca'), { autoAlpha: 1, duration: .01, stagger: .22 }, 'ch+=.3');
      Kit.draw(tl, qa('.sm-ca .rp'), { at: 'ch+=.3', duration: .3, stagger: .11 });

      // [click 2] the OCR box opens into encoder and decoder
      ctx.pause();
      tl.addLabel('oc');
      tl.to(q('.sm-inset'), { autoAlpha: 1, duration: .01 }, 'oc');
      Kit.draw(tl, qa('.sm-inset .rp'), { at: 'oc', duration: .55, stagger: .05 });
      tl.to(q('.b0 .rp'), { stroke: C.tealT, duration: .4 }, 'oc');
      Kit.show(tl, q('.sm-ck'), { at: 'oc+=.7', y: 10 });
      tl.to(q('.sm-ik'), { autoAlpha: 1, duration: .01 }, 'oc+=.7');
      Kit.draw(tl, qa('.sm-ik .rp'), { at: 'oc+=.7', duration: .4 });

      // [click 3] path B: one model writes the record
      ctx.pause();
      tl.addLabel('pb');
      Kit.show(tl, q('.sm-lane.l2'), { at: 'pb', y: 0, duration: .35 });
      tl.to(qa('.sm-feed2, .sm-bb'), { autoAlpha: 1, duration: .01 }, 'pb+=.1');
      Kit.draw(tl, qa('.sm-feed2 .rp'), { at: 'pb+=.1', duration: .4 });
      Kit.draw(tl, qa('.sm-bb .rp'), { at: 'pb+=.2', duration: .6, stagger: .06 });
      Kit.show(tl, q('.sm-jchip'), { at: 'pb+=.5', y: 18 });

      // [click 4] the two failure modes, and where a chain passes an error on
      ctx.pause();
      tl.addLabel('tr');
      Kit.show(tl, qa('.sm-fail'), { at: 'tr', y: 0, stagger: .18 });
      tl.to(q('.sm-dots'), { autoAlpha: 1, duration: .01 }, 'tr+=.2');
      tl.fromTo(qa('.sm-dot'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .35, stagger: .12, ease: 'back.out(2)' }, 'tr+=.2');
    },
    notes:
      'Step one, read. There are two ways to do it, and they are different designs. ' +
      '[click] Path A is a chain of specialists. One model reads characters off the image, the next finds the layout, the next parses the lines, the last links the ingredients. ' +
      '[click] That first box is optical character recognition. The modern version, TrOCR from Microsoft, is two halves: an encoder that looks at pixels, and a decoder that writes characters. Translation, where the source language is a picture. That matters here, because people photograph handwriting. ' +
      '[click] Path B skips all of it. One model looks at the page and writes the record in one pass. Donut did that in 2022, straight from a receipt image to JSON. ' +
      '[click] And they fail differently. The chain misreads a character. The one model invents a line. In a chain, a wrong character at the first join is passed down every join after it. Samsung does not say which path it uses.'
  };
  Kit.withCrumbs(READ, STEPS, 0);

  /* =============================================================== 5 · PARSE */
  var LINE = '1 pound carrots, young ones if possible';
  var CH = 21.6, X0 = 700, LY = 404;      // mono advance at 36 px, line origin
  function cx(a, b) { return X0 + (a + b) / 2 * CH; }
  // tx = where the tag sits, nudged apart from its span centre so the four tags never touch
  var TOKENS = [
    { t: 'QTY', a: 0, b: 1, tx: 697 }, { t: 'UNIT', a: 2, b: 7, tx: 812 },
    { t: 'NAME', a: 8, b: 15, tx: 968 }, { t: 'COMMENT', a: 17, b: 39, tx: 1305 }
  ];
  var FIELDS = [
    { k: 'quantity', v: '1', c: .98 }, { k: 'unit', v: 'pound', c: .95 },
    { k: 'name', v: 'carrots', c: .93 }, { k: 'comment', v: 'young ones if possible', c: .71 }
  ];
  var PARSE = {
    id: 'parse',
    title: 'Parsing ingredient lines',
    heading: 'Parsing ingredient lines',
    budgetSec: 45,
    html: function () {
      // left: a sketched page with three blocks
      var rules = '';
      function rule(x1, x2, y, w, cls, seed) {
        rules += '<g class="' + cls + '">' + Kit.rough.line(x1, y, x2, y, { seed: seed, sw: w, stroke: C.text2, rough: 1.4 }) + '</g>';
      }
      rule(160, 400, 394, 7, 'sm-ru rt', 91);
      [466, 502, 538, 574].forEach(function (y, i) { rule(160, i === 0 ? 430 : 424 + (i % 2) * 26, y, 4, 'sm-ru ri ri' + i, 101 + i); });
      [666, 700, 734, 768, 802].forEach(function (y, i) { rule(160, 470 + (i % 3) * 24, y, 3.4, 'sm-ru rm', 111 + i); });
      var tags = TOKENS.map(function (t, i) {
        return '<g class="sm-tk k' + i + '">' +
          Kit.rough.line(X0 + t.a * CH + 2, 452, X0 + t.b * CH - 2, 452, { seed: 121 + i, sw: 3, stroke: C.tealT }) +
          Kit.rough.line(cx(t.a, t.b), 456, t.tx, 478, { seed: 125 + i, sw: 2, stroke: C.tealT, rough: .6 }) +
          tx(t.tx, 508, t.t, { size: 28, anchor: 'middle', fill: C.tealT, weight: 700, ls: '.1em' }) + '</g>';
      }).join('');
      var fields = FIELDS.map(function (f, i) {
        return div('sm-fr r' + i, 700, 570 + i * 80, 1100,
          '<span class="t-label dim sm-fk">' + f.k + '</span>' +
          '<span class="t-mono sm-fv">' + Kit.esc(f.v) + '</span>' +
          '<span class="sm-bar"><i style="background:' + (f.c < .8 ? C.rust : C.teal) + '"></i></span>');
      }).join('');
      return svg('sm-parse-svg',
        '<g class="sm-page2">' + rr(120, 320, 460, 580, 18, { seed: 90, sw: 3, rough: .9 }) + '</g>' + rules + tags) +
        div('t-label sm-bl b0 c-teal', 160, 348, 300, 'title') +
        div('t-label sm-bl b1 c-teal', 160, 420, 300, 'ingredients') +
        div('t-label sm-bl b2 c-teal', 160, 620, 300, 'method') +
        div('t-mono sm-line', X0, LY, 1100, Kit.esc(LINE)) +
        fields +
        Kit.src('NYT ingredient-phrase-tagger; Ingredient Parser (60,000 tagged sentences). Confidence bars are illustrative.', 'Confirmed');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-bl, .sm-line, .sm-tk, .sm-fr'), { autoAlpha: 0 });
      gsap.set(qa('.sm-bar i'), { scaleX: 0, transformOrigin: '0% 50%' });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.sm-page2 .rp'), { at: .2, duration: .7 });
      Kit.draw(tl, qa('.sm-ru .rp'), { at: .4, duration: .35, stagger: .03 });
      Kit.fade(tl, q('.src'), { at: .6 });

      // [click 1] Sort: the three blocks get names
      ctx.pause();
      Kit.show(tl, qa('.sm-bl'), { y: 10, stagger: .12, duration: .45 });

      // [click 2] one ingredient line lifts out of the page
      ctx.pause();
      tl.addLabel('lf');
      tl.to(q('.ri0 .rp'), { stroke: C.rustT, duration: .3 }, 'lf');
      tl.fromTo(q('.sm-line'), { autoAlpha: 0, x: -540, y: 62, scale: .55 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .85, ease: 'power2.inOut' }, 'lf+=.2');
      tl.to(q('.ri0 .rp'), { stroke: C.text2, duration: .4 }, 'lf+=.9');

      // [click 3] every word gets a tag
      ctx.pause();
      tl.addLabel('tg');
      tl.to(qa('.sm-tk'), { autoAlpha: 1, duration: .01, stagger: .1 }, 'tg');
      Kit.draw(tl, qa('.sm-tk .rp'), { at: 'tg', duration: .3, stagger: .1 });
      tl.fromTo(qa('.sm-tk text'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .1 }, 'tg+=.15');

      // [click 4] the typed fields assemble, with a confidence each
      ctx.pause();
      tl.addLabel('fl');
      Kit.show(tl, qa('.sm-fr'), { at: 'fl', y: 14, stagger: .14, duration: .4 });
      FIELDS.forEach(function (f, i) {
        tl.to(q('.r' + i + ' .sm-bar i'), { scaleX: f.c, duration: .5, ease: 'power2.out' }, 'fl+=' + (.25 + i * .14));
      });
    },
    notes:
      'Steps two and three. Sorting first: you have to know which part of the page is which. ' +
      '[click] Title, ingredients, method. Harder than it sounds. One rival app warns that a two-column list has to be selected twice. ' +
      '[click] Now take one line out of the ingredient block. ' +
      '[click] An ingredient line has a tiny grammar, so a model can label every word in it: quantity, unit, name, comment. The Times open-sourced a tagger that does exactly this, trained on lines people had tagged by hand. ' +
      '[click] Out comes a typed record, with a confidence for every field. Watch that last bar.'
  };
  Kit.withCrumbs(PARSE, STEPS, [1, 2]);

  /* ================================================================ 6 · LINK */
  var SPELLINGS = ['plain flour', 'all-purpose flour', 'AP flour', '2 c. flour'];
  var OUTS = [
    { t: 'Nutrition', s: 'per 100 g' },
    { t: 'A store product', s: 'from <b class="sm-cnt">0</b> items', count: true },
    { t: 'Oven settings', s: 'time and temperature' }
  ];
  var LINK = {
    id: 'link',
    title: 'Linking to a food graph',
    heading: 'Linking to a food graph',
    budgetSec: 45,
    html: function () {
      var chips = SPELLINGS.map(function (s, i) {
        return div('sm-sp s' + i, 120, 340 + i * 100, 480, '<span class="t-mono">' + Kit.esc(s) + '</span>');
      }).join('');
      var conv = '', fan = '';
      SPELLINGS.forEach(function (s, i) {
        conv += '<g class="sm-cv c' + i + '">' + Kit.rough.arrow(614, 378 + i * 100, 748, 530, { seed: 131 + i, sw: 2.8, head: 14, bend: 18 - i * 12, stroke: C.text2 }) + '</g>';
      });
      [400, 610, 820].forEach(function (y, i) {
        fan += '<g class="sm-fn n' + i + '">' + Kit.rough.arrow(1032, 530, 1092, y, { seed: 141 + i, sw: 2.8, head: 14, bend: 14 - i * 14, stroke: C.tealT }) + '</g>';
      });
      var node = '<g class="sm-node">' + rr(760, 440, 260, 180, 22, { seed: 151, sw: 3.4, stroke: C.tealT }) +
        '<text class="disp" x="890" y="528" font-size="52" font-weight="700" text-anchor="middle" fill="' + C.text + '">flour</text>' +
        '<text class="mono" x="890" y="576" font-size="28" text-anchor="middle" fill="' + C.text3 + '">id 20081</text></g>';
      var cards = OUTS.map(function (o, i) {
        return div('sm-out o' + i, 1100, 320 + i * 210, 700,
          '<div class="t-body sm-ot">' + o.t + '</div><div class="t-label dim sm-os">' + o.s + '</div>', 'height:160px;');
      }).join('');
      return svg('sm-link-svg', conv + node + fan) + chips + cards +
        div('callout sm-lk', 688, 330, 0, 'one name, many spellings') +
        svg('sm-link-svg2', '<g class="sm-lka">' + Kit.rough.arrow(886, 392, 896, 432, { seed: 161, sw: 2.6, stroke: C.rustT, head: 13, bend: 10 }) + '</g>') +
        Kit.src('Whisk platform documentation; Samsung Food brand page. The entity id is illustrative.', 'Confirmed');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-cv, .sm-node, .sm-fn, .sm-out, .sm-lk, .sm-lka'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.show(tl, qa('.sm-sp'), { at: .25, y: 18, stagger: .1, duration: .5 });
      Kit.fade(tl, q('.src'), { at: .6 });

      // [click 1] four spellings converge on one entity
      ctx.pause();
      tl.addLabel('cv');
      tl.to(qa('.sm-cv'), { autoAlpha: 1, duration: .01, stagger: .1 }, 'cv');
      Kit.draw(tl, qa('.sm-cv .rp'), { at: 'cv', duration: .45, stagger: .1 });
      tl.to(q('.sm-node'), { autoAlpha: 1, duration: .01 }, 'cv+=.5');
      Kit.draw(tl, qa('.sm-node .rp'), { at: 'cv+=.5', duration: .5 });
      tl.fromTo(qa('.sm-node text'), { autoAlpha: 0, scale: .7, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: .4, stagger: .1, ease: 'back.out(2)' }, 'cv+=.7');
      Kit.show(tl, q('.sm-lk'), { at: 'cv+=.9', y: 8 });
      tl.to(q('.sm-lka'), { autoAlpha: 1, duration: .01 }, 'cv+=.9');
      Kit.draw(tl, qa('.sm-lka .rp'), { at: 'cv+=.9', duration: .35 });

      // [click 2] the three things the entity unlocks
      ctx.pause();
      tl.addLabel('ot');
      tl.to(qa('.sm-fn'), { autoAlpha: 1, duration: .01, stagger: .12 }, 'ot');
      Kit.draw(tl, qa('.sm-fn .rp'), { at: 'ot', duration: .4, stagger: .12 });
      Kit.show(tl, qa('.sm-out'), { at: 'ot+=.2', y: 16, stagger: .14, duration: .45 });

      // [click 3] the size of the catalogue behind one match
      ctx.pause();
      Kit.count(tl, q('.sm-cnt'), { to: 140000, commas: true, suffix: '+', duration: 1.1 });
      tl.to(q('.o1 .sm-os'), { color: C.tealT, duration: .4 }, '<');
    },
    notes:
      'Step four, and it is the one that makes the record worth having. The same ingredient is written four ways on four pages. ' +
      '[click] Linking means deciding that all four are the same thing, and attaching them to one entry in a food database. This is the layer Whisk built, the company Samsung bought and renamed Samsung Food. ' +
      'One research dataset cut sixteen thousand ingredient names down to fifteen hundred. ' +
      '[click] Only then can you look anything up: nutrition, a product you can buy, a time and a temperature for the oven. ' +
      '[click] Whisk maps ingredients to more than a hundred and forty thousand store items.'
  };
  Kit.withCrumbs(LINK, STEPS, 3);

  /* ============================================================== 7 · ERRORS */
  var STRIP = ['confidence per field', 'low-confidence fields flagged', 'the user saves and edits'];
  var ERRORS = {
    id: 'errors',
    title: 'Two kinds of error',
    heading: 'Two kinds of error',
    budgetSec: 45,
    html: function () {
      var tiles = '', links = '';
      STRIP.forEach(function (t, i) {
        tiles += div('sm-st t' + i, 120 + i * 570, 800, 520, '<span class="t-label">' + t + '</span>', 'height:110px;');
        if (i < 2) links += '<g class="sm-sa">' + Kit.rough.arrow(652 + i * 570, 855, 678 + i * 570, 855, { seed: 171 + i, sw: 2.8, head: 13, stroke: C.text2 }) + '</g>';
      });
      var inv = ['2 cups flour', '1 tsp baking soda', '180 g butter'].map(function (t, i) {
        return '<text class="mono sm-iv v' + i + '" x="1020" y="' + (474 + i * 54) + '" font-size="32" fill="' + C.text + '">' + Kit.esc(t) + '</text>';
      }).join('') +
        '<text class="mono sm-iv4" x="1020" y="640" font-size="32" fill="' + C.rustT + '">1 tsp vanilla extract</text>';
      return svg('sm-err-svg',
        '<g class="sm-p1">' + rr(120, 320, 800, 420, 22, { seed: 181, sw: 3, stroke: C.tealT }) + '</g>' +
        '<g class="sm-p2">' + rr(980, 320, 820, 420, 22, { seed: 182, sw: 3, stroke: C.rustT }) + '</g>' +
        '<g class="sm-mis">' + Kit.rough.arrow(448, 452, 506, 452, { seed: 183, sw: 3, head: 16, stroke: C.rustT }) + '</g>' +
        inv +
        '<g class="sm-iva">' + Kit.rough.arrow(1500, 648, 1436, 636, { seed: 184, sw: 2.6, head: 14, bend: -10, stroke: C.rustT }) + '</g>' +
        links) + tiles +
        div('t-caps c-teal sm-ph p1', 160, 362, 600, 'Misread') +
        div('t-caps c-rust sm-ph p2', 1020, 362, 600, 'Invented') +
        div('t-mono sm-ms a', 160, 430, 280, '&frac12; tsp salt') +
        div('t-mono sm-ms b', 540, 430, 360, '<b class="c-rust">12</b> tsp salt') +
        div('sm-na', 160, 524, 740, '<span class="t-label dim">sodium</span><span class="t-mono sm-nav0">190 mg</span>' +
          '<span class="t-label dim sm-narr">&rarr;</span><span class="t-mono sm-nav">190 mg</span><span class="flag sm-flag-sm">Illustrative</span>') +
        div('t-body sm-mline', 160, 608, 700, 'Everything after it is correct. The recipe is ruined.') +
        div('callout sm-ik2', 1512, 602, 0, 'not on the page') +
        Kit.src('Donut (ECCV 2022) on error propagation; FIRE (WACV 2024) on hallucination', 'Confirmed; examples illustrative');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-ms.b, .sm-mis, .sm-na, .sm-mline, .sm-iv, .sm-iv4, .sm-iva, .sm-ik2, .sm-st, .sm-sa'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.sm-p1 .rp, .sm-p2 .rp'), { at: .2, duration: .7, stagger: .1 });
      Kit.fade(tl, qa('.sm-ph'), { at: .4, stagger: .1 });
      Kit.show(tl, q('.sm-ms.a'), { at: .5, y: 10 });
      Kit.fade(tl, q('.src'), { at: .7 });

      // [click 1] one character flips, and the number downstream follows it
      ctx.pause();
      tl.addLabel('ms');
      tl.to(q('.sm-mis'), { autoAlpha: 1, duration: .01 }, 'ms');
      Kit.draw(tl, qa('.sm-mis .rp'), { at: 'ms', duration: .35 });
      Kit.show(tl, q('.sm-ms.b'), { at: 'ms+=.3', y: 0 });
      Kit.show(tl, q('.sm-na'), { at: 'ms+=.7', y: 10 });
      Kit.count(tl, q('.sm-nav'), { to: 4560, commas: true, suffix: ' mg', duration: .9, at: 'ms+=1.1' });
      tl.to(q('.sm-nav'), { color: C.rustT, duration: .4 }, 'ms+=1.1');
      Kit.show(tl, q('.sm-mline'), { at: 'ms+=1.5', y: 12 });

      // [click 2] three real lines, then one the model wrote
      ctx.pause();
      tl.addLabel('iv');
      tl.fromTo(qa('.sm-iv'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .3, stagger: .14 }, 'iv');
      tl.fromTo(q('.sm-iv4'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .45 }, 'iv+=.7');
      Kit.show(tl, q('.sm-ik2'), { at: 'iv+=.9', y: 8 });
      tl.to(q('.sm-iva'), { autoAlpha: 1, duration: .01 }, 'iv+=.9');
      Kit.draw(tl, qa('.sm-iva .rp'), { at: 'iv+=.9', duration: .35 });

      // [click 3] what both paths do about it
      ctx.pause();
      tl.addLabel('st');
      Kit.show(tl, qa('.sm-st'), { at: 'st', y: 14, stagger: .3, duration: .45 });
      tl.to(qa('.sm-sa'), { autoAlpha: 1, duration: .01, stagger: .3 }, 'st+=.3');
      Kit.draw(tl, qa('.sm-sa .rp'), { at: 'st+=.3', duration: .3, stagger: .3 });
    },
    notes:
      'So the choice between those two paths is a choice between two failures. ' +
      '[click] In a chain, an early mistake poisons everything after it. Read a half as a twelve, and the parser tags the twelve perfectly, the nutrition is computed perfectly, and the dish is inedible. ' +
      '[click] A big model rarely misreads a character. It writes a fluent line that was never on the page. The FIRE authors call hallucination a critical challenge. ' +
      '[click] Confidence per field comes free in a chain, and is much harder from one big model. ' +
      'The defences differ, but both end the same way: the last validator is a person.'
  };

  /* ================================================================ 8 · DISH */
  var DISH = {
    id: 'dish',
    title: 'Recipes from a dish photo',
    heading: 'Recipes from a dish photo',
    budgetSec: 30,
    html: function () {
      return svg('sm-dish-svg', '<g class="sm-dk">' + Kit.rough.arrow(372, 806, 436, 742, { seed: 191, sw: 2.6, stroke: C.rustT, head: 14, bend: 14 }) + '</g>') +
        Kit.photo(IMG + 'dish.jpg', { x: 120, y: 320, w: 560, h: 420, rot: -3, framed: true, cls: 'sm-dish', alt: 'A finished stew' }) +
        div('callout sm-dq', 140, 790, 0, 'what is in it?') +
        div('bignum sm-bn n1', 760, 340, 460, '<div class="t-num sm-v1">0</div><div class="t-label">ingredient F1, best system</div>') +
        div('bignum sm-bn n2', 1300, 340, 500, '<div class="t-num sm-v2">0</div><div class="t-label">generated recipes judged to match the photo</div>') +
        div('t-label faint sm-ref sm-ref1', 760, 614, 460, '100 = a perfect ingredient list.') +
        div('t-label faint sm-ref', 1300, 614, 500, 'The real recipe scored 80%.') +
        div('t-h2 c-teal sm-dline', 760, 742, 1040, 'Samsung\'s dish-photo feature finds existing recipes.') +
        Kit.src('FIRE, WACV 2024 · Inverse Cooking, CVPR 2019 · Samsung Newsroom, CES 2024. Dish photo: illustration.', 'Research; not Samsung results');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-bn, .sm-ref, .sm-dline'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.drop(tl, q('.sm-dish'), { at: .2, rot: -3 });
      Kit.show(tl, q('.sm-dq'), { at: .7, y: 10 });
      Kit.draw(tl, qa('.sm-dk .rp'), { at: .75, duration: .4 });
      Kit.fade(tl, q('.src'), { at: .8 });

      ctx.pause();
      tl.addLabel('n');
      Kit.show(tl, qa('.sm-bn'), { at: 'n', y: 16, stagger: .25, duration: .4 });
      Kit.count(tl, q('.sm-v1'), { to: 49.3, decimals: 1, duration: 1.1, at: 'n+=.2' });
      Kit.count(tl, q('.sm-v2'), { to: 55, suffix: '%', duration: 1.1, at: 'n+=.45' });
      Kit.show(tl, qa('.sm-ref'), { at: 'n+=1.4', y: 10, stagger: .1 });

      ctx.pause();
      tl.addLabel('d2');
      tl.to(q('.sm-dish'), { opacity: .4, duration: .5 }, 'd2');
      Kit.show(tl, q('.sm-dline'), { at: 'd2', y: 14 });
    },
    notes:
      'One thing Samsung does not do: look at a photo of a finished dish and write you the recipe. ' +
      '[click] The best published system gets about half the ingredients right. Salt and oil are never visible. And when people judged whether a generated recipe matched the photo, they said yes about half the time, against eighty per cent for the real recipe. ' +
      '[click] What Samsung ships is recognition plus search.'
  };

  /* =========================================================== 9 · TAKEAWAYS */
  var MARKERS = [
    { k: 'Read', c: 'teal' }, { k: 'Find', c: 'olive' }, { k: 'Mix', c: 'saffron' },
    { k: 'Sell', c: 'cranberry' }, { k: 'Next', c: 'plum' }
  ];
  var TAKE = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 35,
    html: function () {
      var rows = [
        { n: '01', tag: 'Document understanding', line: 'Structure is what makes data usable.' },
        { n: '02', tag: 'Two failure modes', line: 'Chains misread. Big models invent. Check both.' }
      ].map(function (r, i) {
        return div('sm-tk-row tr' + i, 120, 420 + i * 240, 1600,
          '<div class="sm-tk-h"><span class="t-mono sm-tn">' + r.n + '</span><span class="t-caps c-teal">' + r.tag + '</span></div>' +
          '<div class="t-h2 sm-tl">' + Kit.esc(r.line) + '</div>');
      }).join('');
      var mk = MARKERS.map(function (m, i) {
        return '<span class="sm-mk m' + i + '" style="--mc:' + C[m.c] + ';--mct:' + C[m.c + 'T'] + '">' + m.k + '</span>';
      }).join('<i class="sm-mkd">·</i>');
      return '<div class="sm-bg" style="background-image:url(' + IMG + 'cookbook.jpg)"></div><div class="sm-veil"></div>' +
        rows + div('sm-strip', 120, 900, 1600, mk) +
        Kit.src('Cookbook photo: illustration', 'Generated');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-tk-row'), { autoAlpha: 0 });
      tl.fromTo(q('.sm-bg'), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: .9, ease: 'power3.out' }, 0);
      Kit.rise(tl, qa('.hd > *'), { at: .2, stagger: .1 });
      Kit.fade(tl, qa('.sm-strip, .src'), { at: .5, stagger: .06 });

      ctx.pause();
      Kit.show(tl, q('.tr0'), { y: 18 });

      ctx.pause();
      Kit.show(tl, q('.tr1'), { y: 18 });
      tl.to(q('.m1'), { color: C.oliveT, duration: .5 }, '>-.2');
    },
    notes:
      'Two things to take away, and neither of them is a fact about Samsung. ' +
      '[click] First: structure is what makes data usable. A record you can compute with beats text you can read. ' +
      '[click] Second: the two designs fail in two ways. A chain misreads what is on the page. One big model writes what is not. Check for both, and keep a person at the end. ' +
      'That is reading. Next: finding something that does not exist yet.'
  };

  Deck.section({
    id: 'samsung', order: 1, num: '01', kicker: 'Read', title: 'Samsung Food', color: 'teal',
    toss: 'assets/img/intro/card.webp',
    opener: {
      id: 'opener', budgetSec: 10,
      notes:
        'Section one: Read. A recipe written for people has to become a record a computer can use, and Samsung Food does that from a single photo.'
    },
    slides: [DEMO, PROBLEM, APPROACH, READ, PARSE, LINK, ERRORS, DISH, TAKE]
  });
})();
