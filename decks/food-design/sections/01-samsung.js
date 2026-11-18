/* ==========================================================================
   01 · Read · Samsung Food   (budget 390 s)
   Spec: specs/samsung.md. Roadmap cards / crumbs: Read → Sort → Parse → Link.
   Restyle (Nov 2026): weight hierarchy, hatched focal boxes, teaching doodles only,
   no source text on slides (caveats live in the notes).
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/samsung/';
  var STEPS = ['Read', 'Sort', 'Parse', 'Link'];

  /* ---------- local helpers (KIT §4: helpers live inside the section) ---------- */

  /** Rounded-rectangle path, drawn with the rough.js wobble (used where corners must read as rounded). */
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
        '<g class="sm-frame">' + rr(740, 300, 440, 630, 40,
          { seed: 11, w: 'heavy', fill: 'var(--sec-t)', fillStyle: 'hachure', hachureGap: 34, fillOpacity: .1 }) + '</g>' +
        '<g class="sm-ain">' + Kit.rough.arrow(628, 500, 724, 560, { seed: 12, w: 'normal', head: 20, bend: 16 }) + '</g>' +
        '<g class="sm-aout">' + Kit.rough.arrow(1196, 560, 1292, 500, { seed: 13, w: 'normal', head: 20, bend: 16 }) + '</g>' +
        '<g class="dd-cap">' + Kit.doodle.underline(800, 1008, 320, { seed: 201 }) + '</g>');
      return g +
        div('sm-col', 120, 380, 500, '<div class="t-caps dim">Input</div><div class="t-body sm-ct">A photo of a written recipe</div>') +
        div('sm-col', 1300, 380, 500, '<div class="t-caps dim">Output</div><div class="t-body sm-ct">An editable recipe in the app</div>') +
        div('callout sm-kq', 760, 596, 400, 'demo clip goes here') +
        div('t-body sm-demo-cap', 660, 952, 600, 'Photo in, record out.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-demo-cap, .dd-cap'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.sm-col'), { at: .25, stagger: .12 });
      Kit.draw(tl, qa('.sm-frame .rp'), { at: .5, duration: .9 });
      Kit.draw(tl, qa('.sm-ain .rp, .sm-aout .rp'), { at: .9, duration: .5, stagger: .08 });
      Kit.fade(tl, q('.sm-kq'), { at: 1.2 });

      ctx.pause();
      Kit.show(tl, q('.sm-demo-cap'), { y: 18 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: '<', duration: .5 });
    },
    notes:
      'Let\'s start with the thing itself. You point your phone at a recipe, and a few seconds later it is in the app: a title, an ingredient list, steps you can edit. ' +
      'Samsung shipped this in July. Basic accounts get three free scans, then it needs the paid tier. ' +
      'If the recipe runs over one page, you add a second photo and it stitches them together. ' +
      '[click] Photo in, record out. That is the promise. ' +
      'The rest of this section is what happens during those few seconds of waiting, because every step in there can go wrong, and each one fails in its own way.'
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
      var frames = '', cards = '';
      DOWNSTREAM.forEach(function (t, i) {
        frames += '<g class="sm-df d' + i + '">' + Kit.rough.rect(120 + i * 340, 866, 320, 116, { seed: 25 + i, w: 'fine', stroke: C.text3 }) + '</g>';
        cards += div('sm-dcard c' + i, 120 + i * 340, 866, 320, '<span class="t-label">' + t + '</span>');
      });
      return svg('sm-prob-svg',
        '<g class="sm-jbox">' + Kit.rough.rect(1060, 320, 740, 380, { seed: 22, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .13, hachureGap: 24 }) + '</g>' +
        '<g class="sm-parrow">' + Kit.rough.arrow(866, 540, 1024, 540, { seed: 21, w: 'heavy', head: 28, bend: -12 }) + '</g>' +
        frames +
        '<g class="dd-chip">' + Kit.doodle.circle(1060, 726, 380, 68, { seed: 202, color: 'var(--rust-t)', w: 'heavy', rx: 250, ry: 44 }) + '</g>' +
        '<g class="sm-darr">' + Kit.rough.arrow(360, 836, 290, 862, { seed: 26, w: 'normal', stroke: C.rustT, head: 18, bend: 14 }) + '</g>') +
        '<div class="t-caps dim sm-pk sm-pk1">A photo</div>' +
        Kit.photo(IMG + 'recipe-card.jpg', { x: 120, y: 320, w: 700, h: 440, rot: -3, framed: true, cls: 'sm-card', alt: 'A handwritten recipe card' }) +
        '<div class="t-caps dim sm-pk sm-pk2">A record</div>' +
        div('sm-json', 1060, 320, 740, '<div class="t-mono">' + json + '</div>', 'height:380px;') +
        div('sm-chip-rust', 1060, 726, 0, '50+ fields, typed by hand') +
        div('callout sm-dcall', 120, 790, 620, 'none of them read the photo') +
        cards;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-json, .sm-jbox, .sm-pk2, .sm-chip-rust, .dd-chip, .sm-dcall, .sm-darr'), { autoAlpha: 0 });
      gsap.set(qa('.sm-dcard'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.sm-pk1'), { at: .2 });
      Kit.drop(tl, q('.sm-card'), { at: .25, rot: -3 });
      tl.fromTo(qa('.sm-parrow .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);

      ctx.pause();
      tl.addLabel('r');
      tl.to(qa('.sm-parrow .rp'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, 'r');
      Kit.show(tl, q('.sm-pk2'), { at: 'r+=.2', y: 0 });
      tl.to(q('.sm-jbox'), { autoAlpha: 1, duration: .01 }, 'r+=.3');
      Kit.draw(tl, qa('.sm-jbox .rp'), { at: 'r+=.3', duration: .7 });
      Kit.show(tl, q('.sm-json'), { at: 'r+=.5', y: 22 });

      ctx.pause();
      Kit.show(tl, q('.sm-chip-rust'), { y: 16 });
      tl.to(q('.dd-chip'), { autoAlpha: 1, duration: .01 }, '>-.1');
      Kit.draw(tl, qa('.dd-chip .rp'), { at: '<', duration: .7 });

      ctx.pause();
      tl.addLabel('dn');
      Kit.draw(tl, qa('.sm-df .rp'), { at: 'dn', duration: .4, stagger: .06 });
      tl.to(qa('.sm-dcard'), { autoAlpha: 1, duration: .45, stagger: .06, ease: Kit.ease.out }, 'dn');
      tl.to(qa('.sm-dcard .t-label'), { color: C.tealT, duration: .4, stagger: .06 }, 'dn');
      Kit.show(tl, q('.sm-dcall'), { at: 'dn+=.5', y: 10 });
      tl.to(q('.sm-darr'), { autoAlpha: 1, duration: .01 }, 'dn+=.5');
      Kit.draw(tl, qa('.sm-darr .rp'), { at: 'dn+=.5', duration: .4 });
    },
    notes:
      'Here is the problem underneath it. On the left is a photo. To a computer that is a grid of coloured dots. Nothing in it can be searched. ' +
      '[click] What the app needs is a record: named fields with values. I made those field names up. ' +
      '[click] Filling it in by hand is slow. Before the New York Times automated its archive, people typed recipes in field by field. An average recipe needed over fifty fields. ' +
      '[click] And every feature depends on that record. Ingredient search runs over forty-two thousand products. Nutrition, servings, the shopping list, the oven. None of them read the photo.'
  };

  /* ============================================================ 3 · APPROACH */
  var ROAD = [
    { n: '1', step: 'Read', q: 'What does the page say?', tech: 'OCR or a vision-language model' },
    { n: '2', step: 'Sort', q: 'Which text is which?', tech: 'Layout analysis' },
    { n: '3', step: 'Parse', q: 'What is in this line?', tech: 'Sequence labeling' },
    { n: '4', step: 'Link', q: 'Which ingredient is this?', tech: 'Entity normalization' }
  ];
  var RX = [120, 560, 1000, 1440], RW = 360, RY = 322, RH = 500;
  var APPROACH = {
    id: 'approach',
    title: 'How the scanner works',
    heading: 'How the scanner works',
    budgetSec: 30,
    html: function () {
      var frames = ROAD.map(function (r, i) {
        return '<g class="sm-rf f' + i + '">' + Kit.rough.rect(RX[i], RY, RW, RH,
          { seed: 31 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .15, hachureGap: 22 }) + '</g>';
      }).join('');
      var arrows = [1, 2, 3].map(function (i) {
        return '<g class="sm-ra a' + i + '">' + Kit.rough.arrow(RX[i - 1] + RW + 4, 572, RX[i] - 4, 572,
          { seed: 36 + i, w: 'heavy', head: 26 }) + '</g>';
      }).join('');
      var cards = ROAD.map(function (r, i) {
        return div('sm-rcard rc' + i, RX[i], RY, RW,
          '<div class="t-caps faint sm-rn">Step ' + r.n + '</div>' +
          '<div class="t-h2 sm-rs">' + r.step + '</div>' +
          '<div class="t-body sm-rq">' + Kit.esc(r.q) + '</div>' +
          '<div class="t-label sm-rt c-teal">' + Kit.esc(r.tech) + '</div>');
      }).join('');
      return svg('sm-road-svg', frames + arrows +
        '<g class="dd-fail">' + Kit.doodle.underline(126, 962, 640, { seed: 203 }) + '</g>') +
        cards + div('t-h2 sm-aline', 120, 890, 1200, 'Each step can fail on its own.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-rcard, .sm-ra, .sm-aline, .dd-fail'), { autoAlpha: 0 });
      gsap.set(qa('.sm-rf.f1, .sm-rf.f2, .sm-rf.f3'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.f0 .rp'), { at: .25, duration: .7 });
      Kit.show(tl, q('.rc0'), { at: .5, y: 18, duration: .5 });
      for (var i = 1; i < ROAD.length; i++) {
        (function (i) {
          ctx.pause();
          tl.addLabel('s' + i);
          tl.to(q('.a' + i), { autoAlpha: 1, duration: .01 }, 's' + i);
          Kit.draw(tl, qa('.a' + i + ' .rp'), { at: 's' + i, duration: .3 });
          tl.to(q('.f' + i), { autoAlpha: 1, duration: .01 }, 's' + i + '+=.25');
          Kit.draw(tl, qa('.f' + i + ' .rp'), { at: 's' + i + '+=.25', duration: .5 });
          Kit.show(tl, q('.rc' + i), { at: 's' + i + '+=.4', y: 18, duration: .5 });
        })(i);
      }
      ctx.pause();
      Kit.show(tl, q('.sm-aline'), { y: 16 });
      tl.to(q('.dd-fail'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-fail .rp'), { at: '<', duration: .5 });
    },
    notes:
      'You tap the button and you wait. Four things happen in that wait. One, read: get the characters off the page. ' +
      '[click] Two, sort: which text is title, which is ingredients, which is method. ' +
      '[click] Three, parse: pull the quantity and name out of one line. ' +
      '[click] Four, link: decide which real ingredient that is. ' +
      '[click] Samsung has published none of this; the four steps are my reconstruction. Each can fail on its own.'
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
        boxes += '<g class="sm-cb b' + i + '">' + Kit.rough.rect(x, 352, 290, 130,
          { seed: 41 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .12, hachureGap: 24 }) +
          tx(x + 145, 428, t, { size: 36, anchor: 'middle', fill: C.text }) + '</g>';
        if (i < 3) {
          arrows += '<g class="sm-ca a' + i + '">' + Kit.rough.arrow(x + 302, 417, x + 336, 417, { seed: 51 + i, w: 'normal', head: 18 }) + '</g>';
          dots += '<circle class="sm-dot d' + i + '" cx="' + (x + 319) + '" cy="' + 417 + '" r="10" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>';
        }
      });
      var inset =
        '<g class="sm-inset">' +
          Kit.rough.line(545, 486, 545, 510, { seed: 61, w: 'fine', stroke: C.text3 }) +
          Kit.rough.line(545, 510, 885, 510, { seed: 62, w: 'fine', stroke: C.text3 }) +
          Kit.rough.line(885, 510, 885, 532, { seed: 63, w: 'fine', stroke: C.text3 }) +
          Kit.rough.line(545, 510, 545, 532, { seed: 68, w: 'fine', stroke: C.text3 }) +
          Kit.rough.rect(400, 546, 290, 130, { seed: 64, w: 'fine', stroke: C.text2 }) +
          Kit.rough.rect(740, 546, 290, 130, { seed: 65, w: 'fine', stroke: C.text2 }) +
          tx(545, 598, 'encoder', { size: 28, anchor: 'middle', fill: C.tealT, weight: 700 }) +
          tx(545, 638, 'looks at pixels', { size: 28, anchor: 'middle', fill: C.text2, weight: 500 }) +
          tx(885, 598, 'decoder', { size: 28, anchor: 'middle', fill: C.tealT, weight: 700 }) +
          tx(885, 638, 'writes characters', { size: 28, anchor: 'middle', fill: C.text2, weight: 500 }) +
          Kit.rough.arrow(700, 612, 732, 612, { seed: 66, w: 'fine', head: 14, stroke: C.text2 }) +
        '</g>' +
        '<g class="sm-ik">' + Kit.rough.arrow(1104, 598, 1042, 612, { seed: 67, w: 'fine', stroke: C.rustT, head: 14, bend: -12 }) + '</g>';
      var pathB =
        '<g class="sm-bb">' + Kit.rough.rect(400, 782, 630, 150,
            { seed: 71, w: 'heavy', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .12, hachureGap: 24 }) +
          tx(715, 868, 'One model, one pass', { size: 36, anchor: 'middle', fill: C.text }) +
          Kit.rough.arrow(1040, 857, 1104, 857, { seed: 72, w: 'heavy', head: 24, stroke: C.rustT }) + '</g>';
      var feeds =
        '<g class="sm-feed">' + Kit.rough.arrow(356, 520, 396, 440, { seed: 81, w: 'normal', head: 18, bend: 10, stroke: C.text2 }) + '</g>' +
        '<g class="sm-feed2">' + Kit.rough.arrow(356, 716, 396, 806, { seed: 82, w: 'normal', head: 18, bend: -10, stroke: C.text2 }) + '</g>';
      return svg('sm-read-svg', feeds + boxes + arrows + inset + pathB +
        '<g class="sm-jbox2">' + Kit.rough.rect(1120, 782, 680, 150, { seed: 73, w: 'fine', stroke: C.text3 }) + '</g>' +
        '<g class="sm-dots">' + dots + '</g>') +
        '<div class="t-caps dim sm-pagek">One page</div>' +
        Kit.photo(IMG + 'page.jpg', { x: 120, y: 440, w: 262, h: 357, rot: -2, framed: true, cls: 'sm-page', alt: 'A printed recipe page' }) +
        div('t-caps sm-lane l1', 400, 296, 700, 'Path A · a chain') +
        div('t-caps sm-lane l2', 400, 726, 700, 'Path B · one model') +
        div('t-label sm-fail f1 c-teal', 1100, 298, 700, 'fails by misreading a character') +
        div('t-label sm-fail f2 c-rust', 1100, 728, 700, 'fails by inventing a line') +
        div('sm-jchip', 1120, 782, 680, '<div class="t-mono"><div>{ "title": "…",</div><div>&nbsp;&nbsp;"ingredients": [ … ] }</div></div>', 'height:150px;') +
        div('callout sm-ck', 1118, 560, 0, 'pixels in, characters out');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-cb, .sm-ca, .sm-inset, .sm-ik, .sm-bb, .sm-jchip, .sm-jbox2, .sm-ck, .sm-fail, .sm-dots, .sm-feed2, .sm-lane.l2'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.sm-pagek'), { at: .2 });
      Kit.drop(tl, q('.sm-page'), { at: .2, rot: -2 });
      Kit.fade(tl, q('.sm-lane.l1'), { at: .5 });
      Kit.draw(tl, qa('.sm-feed .rp'), { at: .6, duration: .5, stagger: .08 });

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
      tl.to(qa('.b0 .rp:not(.rp-hatch)'), { stroke: C.tealT, duration: .4 }, 'oc');
      Kit.show(tl, q('.sm-ck'), { at: 'oc+=.7', y: 10 });
      tl.to(q('.sm-ik'), { autoAlpha: 1, duration: .01 }, 'oc+=.7');
      Kit.draw(tl, qa('.sm-ik .rp'), { at: 'oc+=.7', duration: .4 });

      // [click 3] path B: one model writes the record
      ctx.pause();
      tl.addLabel('pb');
      Kit.show(tl, q('.sm-lane.l2'), { at: 'pb', y: 0, duration: .35 });
      tl.to(qa('.sm-feed2, .sm-bb'), { autoAlpha: 1, duration: .01 }, 'pb+=.1');
      Kit.draw(tl, qa('.sm-feed2 .rp'), { at: 'pb+=.1', duration: .4 });
      Kit.draw(tl, qa('.sm-bb .rp'), { at: 'pb+=.2', duration: .6, stagger: .04 });
      tl.to(q('.sm-jbox2'), { autoAlpha: 1, duration: .01 }, 'pb+=.5');
      Kit.draw(tl, qa('.sm-jbox2 .rp'), { at: 'pb+=.5', duration: .45 });
      Kit.show(tl, q('.sm-jchip'), { at: 'pb+=.6', y: 18 });

      // [click 4] the two failure modes, and where a chain passes an error on
      ctx.pause();
      tl.addLabel('tr');
      Kit.show(tl, qa('.sm-fail'), { at: 'tr', y: 0, stagger: .18 });
      tl.to(q('.sm-dots'), { autoAlpha: 1, duration: .01 }, 'tr+=.2');
      tl.fromTo(qa('.sm-dot'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .35, stagger: .12, ease: 'back.out(2)' }, 'tr+=.2');
    },
    notes:
      'Step one, read. There are two ways to do it, and they are different designs. ' +
      '[click] Path A is a chain of specialists. One model reads characters off the image, the next finds the layout, the next parses lines, the last links ingredients. ' +
      '[click] That first box is optical character recognition. TrOCR, from Microsoft, is two halves: an encoder that looks at pixels, and a decoder that writes characters. Translation, where the source language is a picture. That matters, because people photograph handwriting. ' +
      '[click] Path B skips all of it. One model looks at the page and writes the record in one pass. Donut did that in 2022, straight from a receipt image to JSON. That record is my sketch. ' +
      '[click] They fail differently: the chain misreads a character, the one model invents a line. In a chain, a wrong character at the first join is passed down every join after. Samsung has never said which path it uses.'
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
  var FY = 586, FGAP = 94;
  var PARSE = {
    id: 'parse',
    title: 'Parsing ingredient lines',
    heading: 'Parsing ingredient lines',
    budgetSec: 45,
    html: function () {
      // left: a sketched page with three blocks
      var rules = '';
      function rule(x1, x2, y, wt, cls, seed) {
        rules += '<g class="' + cls + '">' + Kit.rough.line(x1, y, x2, y, { seed: seed, w: wt, stroke: C.text2, rough: 1.4 }) + '</g>';
      }
      rule(160, 400, 400, 'normal', 'sm-ru rt', 91);
      [484, 524, 564, 604].forEach(function (y, i) { rule(160, i === 0 ? 430 : 424 + (i % 2) * 26, y, 'fine', 'sm-ru ri ri' + i, 101 + i); });
      [700, 740, 780, 820, 860].forEach(function (y, i) { rule(160, 470 + (i % 3) * 24, y, 'fine', 'sm-ru rm', 111 + i); });
      var tags = TOKENS.map(function (t, i) {
        return '<g class="sm-tk k' + i + '">' +
          Kit.rough.line(X0 + t.a * CH + 2, 452, X0 + t.b * CH - 2, 452, { seed: 121 + i, w: 'normal', stroke: C.tealT }) +
          Kit.rough.line(cx(t.a, t.b), 456, t.tx, 478, { seed: 125 + i, w: 'fine', stroke: C.tealT, rough: .6 }) +
          tx(t.tx, 508, t.t, { size: 28, anchor: 'middle', fill: C.tealT, weight: 700, ls: '.1em' }) + '</g>';
      }).join('');
      var fields = FIELDS.map(function (f, i) {
        return div('sm-fr r' + i, 700, FY + i * FGAP, 1060,
          '<span class="t-label dim sm-fk">' + f.k + '</span>' +
          '<span class="t-mono sm-fv">' + Kit.esc(f.v) + '</span>' +
          '<span class="sm-bar"><i style="background:' + (f.c < .8 ? C.rust : C.teal) + '"></i></span>');
      }).join('');
      return svg('sm-parse-svg',
        '<g class="sm-page2">' + Kit.rough.rect(120, 330, 460, 600, { seed: 90, w: 'heavy' }) + '</g>' + rules + tags +
        '<g class="dd-low">' + Kit.doodle.circle(1592, FY + 3 * FGAP + 2, 176, 34, { seed: 204, color: 'var(--rust-t)', w: 'heavy', pad: 6 }) + '</g>') +
        div('t-label sm-bl b0 c-teal', 160, 356, 300, 'title') +
        div('t-label sm-bl b1 c-teal', 160, 436, 300, 'ingredients') +
        div('t-label sm-bl b2 c-teal', 160, 652, 300, 'method') +
        div('t-mono sm-line', X0, LY, 1100, Kit.esc(LINE)) +
        div('t-caps faint sm-conf', 1600, 536, 200, 'confidence') +
        fields;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-bl, .sm-line, .sm-tk, .sm-fr, .sm-conf, .dd-low'), { autoAlpha: 0 });
      gsap.set(qa('.sm-bar i'), { scaleX: 0, transformOrigin: '0% 50%' });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.sm-page2 .rp'), { at: .2, duration: .7 });
      Kit.draw(tl, qa('.sm-ru .rp'), { at: .4, duration: .35, stagger: .03 });

      // [click 1] Sort: the three blocks get names
      ctx.pause();
      Kit.show(tl, qa('.sm-bl'), { y: 10, stagger: .12, duration: .45 });

      // [click 2] one ingredient line lifts out of the page
      ctx.pause();
      tl.addLabel('lf');
      tl.to(qa('.ri0 .rp'), { stroke: C.rustT, duration: .3 }, 'lf');
      tl.fromTo(q('.sm-line'), { autoAlpha: 0, x: -540, y: 76, scale: .55 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .85, ease: 'power2.inOut' }, 'lf+=.2');
      tl.to(qa('.ri0 .rp'), { stroke: C.text2, duration: .4 }, 'lf+=.9');

      // [click 3] every word gets a tag
      ctx.pause();
      tl.addLabel('tg');
      tl.to(qa('.sm-tk'), { autoAlpha: 1, duration: .01, stagger: .1 }, 'tg');
      Kit.draw(tl, qa('.sm-tk .rp'), { at: 'tg', duration: .3, stagger: .1 });
      tl.fromTo(qa('.sm-tk text'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .1 }, 'tg+=.15');

      // [click 4] the typed fields assemble, with a confidence each
      ctx.pause();
      tl.addLabel('fl');
      Kit.show(tl, qa('.sm-conf, .sm-fr'), { at: 'fl', y: 14, stagger: .14, duration: .4 });
      FIELDS.forEach(function (f, i) {
        tl.to(q('.r' + i + ' .sm-bar i'), { scaleX: f.c, duration: .5, ease: 'power2.out' }, 'fl+=' + (.25 + i * .14));
      });
      tl.to(q('.dd-low'), { autoAlpha: 1, duration: .01 }, 'fl+=1.1');
      Kit.draw(tl, qa('.dd-low .rp'), { at: 'fl+=1.1', duration: .7 });
    },
    notes:
      'Steps two and three. Sorting first: you have to know which part of the page is which. ' +
      '[click] Title, ingredients, method. Harder than it sounds. One rival app warns that a two-column list must be selected twice. ' +
      '[click] Take one line out of the ingredient block. ' +
      '[click] An ingredient line has a tiny grammar, so a model can label every word: quantity, unit, name, comment. The Times open-sourced a tagger for exactly this, trained on hand-tagged lines. ' +
      '[click] Out comes a typed record with a confidence for every field. I made the bars up, but the shape is real: the comment is always the shakiest.'
  };
  Kit.withCrumbs(PARSE, STEPS, [1, 2]);

  /* ================================================================ 6 · LINK */
  var SPELLINGS = ['plain flour', 'all-purpose flour', 'AP flour', '2 c. flour'];
  var OUTS = [
    { t: 'Nutrition', s: 'per 100 g' },
    { t: 'A store product', s: 'from <b class="sm-cnt">0</b> items', count: true },
    { t: 'Oven settings', s: 'time and temperature' }
  ];
  var SPY = 380, SPG = 118, OTY = 340, OTG = 210, OTH = 170;
  var LINK = {
    id: 'link',
    title: 'Linking to a food graph',
    heading: 'Linking to a food graph',
    budgetSec: 45,
    html: function () {
      var spFrames = '', chips = '';
      SPELLINGS.forEach(function (s, i) {
        spFrames += '<g class="sm-spf p' + i + '">' + Kit.rough.rect(120, SPY + i * SPG, 480, 84, { seed: 171 + i, w: 'fine', stroke: C.text3 }) + '</g>';
        chips += div('sm-sp s' + i, 120, SPY + i * SPG, 480, '<span class="t-mono">' + Kit.esc(s) + '</span>');
      });
      var conv = '', fan = '', outFrames = '';
      SPELLINGS.forEach(function (s, i) {
        conv += '<g class="sm-cv c' + i + '">' + Kit.rough.arrow(618, SPY + i * SPG + 42, 744, 560,
          { seed: 131 + i, w: 'normal', head: 16, bend: 18 - i * 12, stroke: C.text2 }) + '</g>';
      });
      [425, 635, 845].forEach(function (y, i) {
        fan += '<g class="sm-fn n' + i + '">' + Kit.rough.arrow(1028, 560, 1092, y, { seed: 141 + i, w: 'normal', head: 16, bend: 14 - i * 14, stroke: C.tealT }) + '</g>';
        outFrames += '<g class="sm-of o' + i + 'f">' + Kit.rough.rect(1100, OTY + i * OTG, 700, OTH, { seed: 145 + i, w: 'fine', stroke: C.text3 }) + '</g>';
      });
      var node = '<g class="sm-node">' + Kit.rough.rect(760, 470, 260, 180,
          { seed: 151, w: 'heavy', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .18, hachureGap: 20 }) +
        '<text class="disp" x="890" y="558" font-size="52" font-weight="700" text-anchor="middle" fill="' + C.text + '">flour</text>' +
        '<text class="mono" x="890" y="606" font-size="28" text-anchor="middle" fill="' + C.text3 + '">id 20081</text></g>';
      var cards = OUTS.map(function (o, i) {
        return div('sm-out o' + i, 1100, OTY + i * OTG, 700,
          '<div class="t-body sm-ot">' + o.t + '</div><div class="t-label dim sm-os">' + o.s + '</div>', 'height:' + OTH + 'px;');
      }).join('');
      return svg('sm-link-svg', conv + outFrames + spFrames + node + fan) + chips + cards +
        div('callout sm-lk', 672, 366, 0, 'one name, many spellings') +
        div('t-body sm-lcap', 120, 868, 600, 'Four spellings, one entity.') +
        svg('sm-link-svg2',
          '<g class="sm-lka">' + Kit.rough.arrow(886, 428, 896, 462, { seed: 161, w: 'fine', stroke: C.rustT, head: 13, bend: 10 }) + '</g>' +
          '<g class="dd-cat">' + Kit.doodle.underline(1132, 700, 296, { seed: 205, color: 'var(--rust-t)' }) + '</g>' +
          '<g class="dd-one">' + Kit.doodle.underline(126, 930, 400, { seed: 206 }) + '</g>');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-cv, .sm-node, .sm-fn, .sm-out, .sm-of, .sm-lk, .sm-lka, .sm-lcap, .dd-cat, .dd-one'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.sm-spf .rp'), { at: .2, duration: .45, stagger: .1 });
      Kit.show(tl, qa('.sm-sp'), { at: .25, y: 18, stagger: .1, duration: .5 });

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
      Kit.show(tl, q('.sm-lcap'), { at: 'cv+=1.1', y: 12 });
      tl.to(q('.dd-one'), { autoAlpha: 1, duration: .01 }, 'cv+=1.3');
      Kit.draw(tl, qa('.dd-one .rp'), { at: 'cv+=1.3', duration: .5 });

      // [click 2] the three things the entity unlocks
      ctx.pause();
      tl.addLabel('ot');
      tl.to(qa('.sm-fn'), { autoAlpha: 1, duration: .01, stagger: .12 }, 'ot');
      Kit.draw(tl, qa('.sm-fn .rp'), { at: 'ot', duration: .4, stagger: .12 });
      tl.to(qa('.sm-of'), { autoAlpha: 1, duration: .01, stagger: .14 }, 'ot+=.15');
      Kit.draw(tl, qa('.sm-of .rp'), { at: 'ot+=.15', duration: .4, stagger: .14 });
      Kit.show(tl, qa('.sm-out'), { at: 'ot+=.2', y: 16, stagger: .14, duration: .45 });

      // [click 3] the size of the catalogue behind one match
      ctx.pause();
      Kit.count(tl, q('.sm-cnt'), { to: 140000, commas: true, suffix: '+', duration: 1.1 });
      tl.to(q('.o1 .sm-os'), { color: C.tealT, duration: .4 }, '<');
      tl.to(q('.dd-cat'), { autoAlpha: 1, duration: .01 }, '>-.1');
      Kit.draw(tl, qa('.dd-cat .rp'), { at: '<', duration: .7 });
    },
    notes:
      'Step four, the one that makes the record worth having. The same ingredient is written four ways on four pages. ' +
      '[click] Linking means deciding all four are the same thing, and attaching them to one entry in a food database. Whisk built this layer; Samsung bought Whisk and renamed it Samsung Food. The id is a stand-in. ' +
      'One dataset cut sixteen thousand ingredient names down to fifteen hundred. ' +
      '[click] Only then can you look anything up: nutrition, a product you can buy, a time and temperature for the oven. ' +
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
      var frames = '', tiles = '', links = '';
      STRIP.forEach(function (t, i) {
        frames += '<g class="sm-sf g' + i + '">' + Kit.rough.rect(120 + i * 570, 848, 520, 130, { seed: 175 + i, w: 'fine', stroke: C.text3 }) + '</g>';
        tiles += div('sm-st t' + i, 120 + i * 570, 848, 520, '<span class="t-label">' + t + '</span>', 'height:130px;');
        if (i < 2) links += '<g class="sm-sa">' + Kit.rough.arrow(656 + i * 570, 913, 682 + i * 570, 913, { seed: 171 + i, w: 'normal', head: 16, stroke: C.text2 }) + '</g>';
      });
      var inv = ['2 cups flour', '1 tsp baking soda', '180 g butter'].map(function (t, i) {
        return '<text class="mono sm-iv v' + i + '" x="1020" y="' + (474 + i * 54) + '" font-size="32" fill="' + C.text + '">' + Kit.esc(t) + '</text>';
      }).join('') +
        '<text class="mono sm-iv4" x="1020" y="640" font-size="32" fill="' + C.rustT + '">1 tsp vanilla extract</text>';
      return svg('sm-err-svg',
        '<g class="sm-p1">' + Kit.rough.rect(120, 320, 800, 420, { seed: 181, w: 'normal', stroke: C.tealT, hatch: 'var(--sec-t)', fillOpacity: .1, hachureGap: 28 }) + '</g>' +
        '<g class="sm-p2">' + Kit.rough.rect(980, 320, 820, 420, { seed: 182, w: 'normal', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .1, hachureGap: 28 }) + '</g>' +
        '<g class="sm-mis">' + Kit.rough.arrow(448, 452, 510, 452, { seed: 183, w: 'heavy', head: 22, stroke: C.rustT }) + '</g>' +
        inv +
        '<g class="sm-iva">' + Kit.rough.arrow(1500, 648, 1436, 636, { seed: 184, w: 'fine', head: 14, bend: -10, stroke: C.rustT }) + '</g>' +
        '<g class="dd-sod">' + Kit.doodle.circle(444, 532, 142, 38, { seed: 207, color: 'var(--rust-t)', w: 'heavy', rx: 92, ry: 40 }) + '</g>' +
        frames + links) + tiles +
        div('t-caps c-teal sm-ph p1', 160, 362, 600, 'Misread') +
        div('t-caps c-rust sm-ph p2', 1020, 362, 600, 'Invented') +
        div('t-mono sm-ms a', 160, 430, 280, '&frac12; tsp salt') +
        div('t-mono sm-ms b', 544, 430, 360, '<b class="c-rust">12</b> tsp salt') +
        div('sm-na', 160, 530, 740, '<span class="t-label dim">sodium</span><span class="t-mono sm-nav0">190 mg</span>' +
          '<span class="t-label dim sm-narr">&rarr;</span><span class="t-mono sm-nav">190 mg</span>') +
        div('t-body sm-mline', 160, 622, 700, 'Everything after it is correct. The recipe is ruined.') +
        div('callout sm-ik2', 1512, 602, 0, 'not on the page');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-ms.b, .sm-mis, .sm-na, .sm-mline, .sm-iv, .sm-iv4, .sm-iva, .sm-ik2, .sm-st, .sm-sa, .sm-sf, .dd-sod'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.sm-p1 .rp, .sm-p2 .rp'), { at: .2, duration: .7, stagger: .06 });
      Kit.fade(tl, qa('.sm-ph'), { at: .4, stagger: .1 });
      Kit.show(tl, q('.sm-ms.a'), { at: .5, y: 10 });

      // [click 1] one character flips, and the number downstream follows it
      ctx.pause();
      tl.addLabel('ms');
      tl.to(q('.sm-mis'), { autoAlpha: 1, duration: .01 }, 'ms');
      Kit.draw(tl, qa('.sm-mis .rp'), { at: 'ms', duration: .35 });
      Kit.show(tl, q('.sm-ms.b'), { at: 'ms+=.3', y: 0 });
      Kit.show(tl, q('.sm-na'), { at: 'ms+=.7', y: 10 });
      Kit.count(tl, q('.sm-nav'), { to: 4560, commas: true, suffix: ' mg', duration: .9, at: 'ms+=1.1' });
      tl.to(q('.sm-nav'), { color: C.rustT, duration: .4 }, 'ms+=1.1');
      tl.to(q('.dd-sod'), { autoAlpha: 1, duration: .01 }, 'ms+=1.9');
      Kit.draw(tl, qa('.dd-sod .rp'), { at: 'ms+=1.9', duration: .6 });
      Kit.show(tl, q('.sm-mline'), { at: 'ms+=1.6', y: 12 });

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
      tl.to(qa('.sm-sf'), { autoAlpha: 1, duration: .01, stagger: .3 }, 'st');
      Kit.draw(tl, qa('.sm-sf .rp'), { at: 'st', duration: .4, stagger: .3 });
      Kit.show(tl, qa('.sm-st'), { at: 'st+=.1', y: 14, stagger: .3, duration: .45 });
      tl.to(qa('.sm-sa'), { autoAlpha: 1, duration: .01, stagger: .3 }, 'st+=.35');
      Kit.draw(tl, qa('.sm-sa .rp'), { at: 'st+=.35', duration: .3, stagger: .3 });
    },
    notes:
      'So choosing between those paths is choosing between two failures. Both examples here are made up. ' +
      '[click] In a chain, an early mistake poisons everything after it. Read a half as a twelve: the parser tags it perfectly, the nutrition is computed perfectly, and the dish is inedible. ' +
      '[click] A big model rarely misreads a character. It writes a fluent line that was never on the page. The FIRE authors call hallucination a critical challenge. ' +
      '[click] Confidence per field comes free in a chain, and is much harder from one big model. ' +
      'The defences differ; both end the same way: the last validator is a person.'
  };

  /* ================================================================ 8 · DISH */
  var DISH = {
    id: 'dish',
    title: 'Recipes from a dish photo',
    heading: 'Recipes from a dish photo',
    budgetSec: 30,
    html: function () {
      return svg('sm-dish-svg',
        '<g class="sm-dk">' + Kit.rough.arrow(344, 868, 410, 800, { seed: 191, w: 'fine', stroke: C.rustT, head: 14, bend: 14 }) + '</g>' +
        '<g class="dd-f1">' + Kit.doodle.circle(780, 358, 260, 112, { seed: 208, color: 'var(--rust-t)', w: 'heavy', rx: 165, ry: 82 }) + '</g>' +
        '<g class="dd-dl">' + Kit.doodle.underline(786, 918, 560, { seed: 209 }) + '</g>') +
        Kit.photo(IMG + 'dish.jpg', { x: 120, y: 340, w: 600, h: 460, rot: -3, framed: true, cls: 'sm-dish', alt: 'A finished stew' }) +
        div('callout sm-dq', 124, 856, 0, 'what is in it?') +
        div('bignum sm-bn n1', 780, 352, 460, '<div class="t-num sm-v1">0</div><div class="t-label">ingredient F1, best system</div>') +
        div('bignum sm-bn n2', 1320, 352, 480, '<div class="t-num sm-v2">0</div><div class="t-label">generated recipes judged to match the photo</div>') +
        div('t-label faint sm-ref sm-ref1', 780, 646, 460, '100 = a perfect ingredient list.') +
        div('t-label faint sm-ref', 1320, 646, 480, 'The real recipe scored 80%.') +
        div('t-h2 c-teal sm-dline', 780, 790, 1020, 'Samsung\'s dish-photo feature finds existing recipes.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sm-bn, .sm-ref, .sm-dline, .dd-f1, .dd-dl'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.drop(tl, q('.sm-dish'), { at: .2, rot: -3 });
      Kit.show(tl, q('.sm-dq'), { at: .7, y: 10 });
      Kit.draw(tl, qa('.sm-dk .rp'), { at: .75, duration: .4 });

      ctx.pause();
      tl.addLabel('n');
      Kit.show(tl, qa('.sm-bn'), { at: 'n', y: 16, stagger: .25, duration: .4 });
      Kit.count(tl, q('.sm-v1'), { to: 49.3, decimals: 1, duration: 1.1, at: 'n+=.2' });
      Kit.count(tl, q('.sm-v2'), { to: 55, suffix: '%', duration: 1.1, at: 'n+=.45' });
      Kit.show(tl, qa('.sm-ref'), { at: 'n+=1.4', y: 10, stagger: .1 });
      tl.to(q('.dd-f1'), { autoAlpha: 1, duration: .01 }, 'n+=1.5');
      Kit.draw(tl, qa('.dd-f1 .rp'), { at: 'n+=1.5', duration: .7 });

      ctx.pause();
      tl.addLabel('d2');
      tl.to(q('.sm-dish'), { opacity: .4, duration: .5 }, 'd2');
      Kit.show(tl, q('.sm-dline'), { at: 'd2', y: 14 });
      tl.to(q('.dd-dl'), { autoAlpha: 1, duration: .01 }, 'd2+=.5');
      Kit.draw(tl, qa('.dd-dl .rp'), { at: 'd2+=.5', duration: .5 });
    },
    notes:
      'One thing Samsung does not do: look at a photo of a finished dish and write the recipe. ' +
      '[click] Both numbers are from research papers, not from Samsung. The best system gets about half the ingredients right; salt and oil are never visible. Asked whether a generated recipe matched its photo, people said yes about half the time, against eighty per cent for the real recipe. ' +
      '[click] What Samsung ships is recognition plus search.'
  };

  /* =========================================================== 9 · TAKEAWAYS */
  // one row per takeaway: number · rule · tag · one line (KIT §7, same grammar as the giuseppe pilot)
  var TK = [
    ['01', 'Structure is what makes data usable.', 'document understanding', 'A record you can compute with beats text you can read.'],
    ['02', 'Chains misread. Big models invent.', 'two failure modes', 'Check for both, and keep a person at the end.']
  ];
  var MARKS = [['Read', 'teal'], ['Find', 'olive'], ['Mix', 'saffron'], ['Sell', 'cranberry'], ['Next', 'plum']];
  var TAKE = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 35,
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
          '<g class="dd-t0">' + Kit.doodle.underline(252, 416, 844, { seed: 210 }) + '</g>' +
          '<g class="dd-t1">' + Kit.doodle.underline(252, 672, 800, { seed: 211 }) + '</g>') +
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
