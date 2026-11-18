/* ==========================================================================
   04 · Sell · NotCo   (budget 165 s)
   Spec: specs/notco.md. No roadmap and no crumbs: this section teaches no new ML.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/notco/';

  /* a chalk tile: rough rectangle drawn behind HTML text. w is the stroke weight ('heavy'|'normal'|'fine'). */
  function tileRect(x, y, w, h, seed, o) {
    o = o || {};
    return Kit.rough.rect(x, y, w, h, { seed: seed, w: o.w || 'normal', rough: o.rough || .9, stroke: o.stroke || C.chalk,
      hatch: o.hatch, fillOpacity: o.fillOpacity, hachureGap: o.hachureGap || 22, cls: o.cls });
  }

  /* ---------------------------------------------------------------- ORIGIN */
  var ORIGIN = {
    id: 'origin',
    title: 'Origin',
    heading: 'Where NotCo came from',
    budgetSec: 40,
    html: function () {
      var svg = '<svg class="nc-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        '<g class="nc-o-rl">' +
          Kit.rough.line(120, 632, 1040, 632, { seed: 21, w: 'fine', stroke: C.text3, bow: .4, rough: .7 }) +
          Kit.rough.line(120, 752, 1040, 752, { seed: 22, w: 'fine', stroke: C.text3, bow: .4, rough: .7 }) + '</g>' +
        '<g class="nc-o-ar">' + Kit.rough.arrow(646, 806, 556, 718, { seed: 31, w: 'normal', stroke: C.rustT, head: 18, bend: 22 }) + '</g>' +
        '<g class="nc-o-crd">' + tileRect(1140, 676, 660, 124, 32, { hatch: 'var(--sec-t)', fillOpacity: .14 }) + '</g>' +
        '<g class="dd-pct">' + Kit.rough.ellipse(1230, 888, 252, 142, { seed: 211, w: 'heavy', stroke: C.rustT, rough: .55, bow: 1.1, cls: 'dd' }) + '</g>' +
      '</svg>';

      /* the chip sits on the photo, so its plate and outline are painted after it */
      var chip = '<div class="nc-o-chipbg"></div>' +
        '<svg class="nc-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="nc-o-chr">' + tileRect(1456, 292, 344, 124, 33, { stroke: C.cranberryT, w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .2, hachureGap: 18 }) + '</g>' +
        '</svg>' +
        '<div class="nc-o-chip">' +
          '<div class="t-h2 c-cranberry">$1.5B</div>' +
          '<div class="t-label dim">valuation, July 2021</div>' +
        '</div>';

      var left =
        '<div class="t-caps faint nc-o-place">Santiago, Chile</div>' +
        '<div class="t-num nc-o-year">2015</div>' +
        '<div class="nc-f nc-f1"><div class="t-body">Matías Muchnick</div><div class="t-label dim">co-founder, CEO</div></div>' +
        '<div class="nc-f nc-f2"><div class="t-body">Karim Pichara</div>' +
          '<div class="t-label dim">co-founder, CTO · built <span class="nc-g">Giuseppe</span></div></div>' +
        '<div class="callout nc-o-c">faces made of vegetables</div>';

      var right =
        Kit.photo(IMG + 'chickpeas.jpg', { x: 1140, y: 290, w: 660, h: 360, rot: 2, framed: true, cls: 'nc-o-img', alt: 'dried chickpeas' }) +
        '<div class="nc-o-card">' +
          '<div class="t-body">NotMayo, 2017</div>' +
          '<div class="t-label faint">chickpea and lupin</div>' +
        '</div>' +
        '<div class="t-num nc-o-pct">0%</div>' +
        '<div class="t-label dim nc-o-pctlab">of Chile\'s mayo market<br>in eight months</div>';

      return svg + left + right + chip;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.nc-o-ar, .nc-o-c, .nc-o-img, .nc-o-crd, .nc-o-card, .nc-o-pct, .nc-o-pctlab, .nc-o-chr, .nc-o-chipbg, .nc-o-chip, .dd-pct'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.rise(tl, qa('.nc-o-place, .nc-o-year'), { at: .15, stagger: .08 });
      Kit.rise(tl, qa('.nc-f1, .nc-f2'), { at: .35, stagger: .08 });
      Kit.draw(tl, qa('.nc-o-rl .rp'), { at: .45, duration: .6, stagger: .08 });

      // [click 1] the CTO built the engine the last section explained
      ctx.pause();
      tl.addLabel('c1');
      tl.to(q('.nc-g'), { color: C.rustT, duration: .35 }, 'c1');
      Kit.show(tl, q('.nc-o-c'), { at: 'c1', y: 14 });
      tl.to(q('.nc-o-ar'), { autoAlpha: 1, duration: .01 }, 'c1+=.25');
      Kit.draw(tl, qa('.nc-o-ar .rp'), { at: 'c1+=.25', duration: .5 });

      // [click 2] the first product, and the share it took
      ctx.pause();
      tl.addLabel('c2');
      Kit.drop(tl, q('.nc-o-img'), { at: 'c2' });
      tl.to(q('.nc-o-crd'), { autoAlpha: 1, duration: .01 }, 'c2+=.35');
      Kit.draw(tl, qa('.nc-o-crd .rp'), { at: 'c2+=.35', duration: .5 });
      Kit.show(tl, q('.nc-o-card'), { at: 'c2+=.5', y: 16 });
      tl.to(q('.nc-o-pct'), { autoAlpha: 1, duration: .3 }, 'c2+=.8');
      Kit.count(tl, q('.nc-o-pct'), { to: 8, suffix: '%', duration: 1.0, at: 'c2+=.8' });
      Kit.show(tl, q('.nc-o-pctlab'), { at: 'c2+=1.0', y: 14 });
      tl.to(q('.dd-pct'), { autoAlpha: 1, duration: .01 }, 'c2+=1.3');
      Kit.draw(tl, qa('.dd-pct .rp'), { at: 'c2+=1.3', duration: .7 });

      // [click 3] the money, and the founding year steps back
      ctx.pause();
      tl.addLabel('c3');
      tl.to(q('.nc-o-year'), { color: C.text3, duration: .5 }, 'c3');
      tl.to(q('.nc-o-chipbg'), { autoAlpha: 1, duration: .3 }, 'c3');
      tl.to(q('.nc-o-chr'), { autoAlpha: 1, duration: .01 }, 'c3');
      Kit.draw(tl, qa('.nc-o-chr .rp'), { at: 'c3', duration: .5 });
      Kit.show(tl, q('.nc-o-chip'), { at: 'c3+=.2', y: 16 });
    },
    notes:
      'NotCo starts in Santiago in 2015. Muchnick had already built and sold a plant-based mayo brand. Pichara is a computer scientist. ' +
      '[click] Pichara built the AI and named it Giuseppe, after Arcimboldo, the painter who made portraits out of vegetables. ' +
      '[click] The first product was NotMayo, chickpea and lupin. It took about eight percent of Chile\'s mayo market in eight months. ' +
      'That share comes from press reports, not from NotCo. ' +
      '[click] Four years later, investors valued the company at one and a half billion dollars. A food brand, with an AI designing its products.'
  };

  /* ----------------------------------------------------------------- PIVOT */
  var MK = [
    { name: 'US + Canada', tag: 'Kraft Heinz sells it, Feb 2025', grp: 0 },
    { name: 'Argentina', tag: 'sold to Molinos, Jun 2026', grp: 1 },
    { name: 'Uruguay', tag: 'sold to Molinos, Jun 2026', grp: 1 },
    { name: 'Mexico', tag: 'closed, 2026 (reported)', grp: 2 },
    { name: 'Brazil', tag: 'sold to Ferrara, Sep 2026', grp: 3 },
    { name: 'Chile', tag: 'still NotCo\'s', keep: true }
  ];
  var AI = [
    { name: 'Kraft Heinz joint venture', date: '2022' },
    { name: 'NotCo AI \u00b7 Concept Quant', date: '2025' },
    { name: 'Barry Callebaut', date: 'Nov 2025' }
  ];
  var MKX = [120, 406, 692, 978, 1264, 1550], MKW = 250, MKY = 340, MKH = 88;
  var AIX = [120, 670, 1220], AIW = 520, AIY = 664, AIH = 112;

  var PIVOT = {
    id: 'pivot',
    title: 'Pivot',
    heading: 'From food to software',
    budgetSec: 50,
    html: function () {
      var rects = MK.map(function (m, i) {
        return '<g class="nc-mk-r r' + i + '">' + tileRect(MKX[i], MKY, MKW, MKH, 40 + i) + '</g>';
      }).join('');
      var strikes = MK.map(function (m, i) {
        if (m.keep) return '';
        return '<g class="nc-mk-s s' + i + '">' +
          Kit.rough.line(MKX[i] + 12, MKY + MKH / 2 + 4, MKX[i] + MKW - 12, MKY + MKH / 2 - 4, { seed: 50 + i, w: 'normal', bow: .4, rough: .7, stroke: C.rustT }) + '</g>';
      }).join('');
      var aiRects = AI.map(function (a, i) {
        return '<g class="nc-ai-r a' + i + '">' + tileRect(AIX[i], AIY, AIW, AIH, 60 + i, { stroke: C.cranberryT, w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .14 }) + '</g>';
      }).join('');
      var svg = '<svg class="nc-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        rects + strikes + aiRects +
        '<g class="nc-rule">' + Kit.rough.line(120, 582, 1800, 582, { seed: 70, w: 'fine', bow: .4, rough: .7, stroke: C.text3 }) + '</g>' +
        '<g class="dd-cap">' + Kit.doodle.underline(676, 988, 568, { seed: 212 }) + '</g>' +
      '</svg>';

      var mk = MK.map(function (m, i) {
        return '<div class="nc-mk m' + i + '" style="left:' + MKX[i] + 'px">' +
          '<div class="t-body nc-mk-n">' + m.name + '</div>' +
          '<div class="t-label nc-mk-t' + (m.keep ? ' c-cranberry' : ' faint') + '">' + m.tag + '</div>' +
        '</div>';
      }).join('');
      var ai = AI.map(function (a, i) {
        return '<div class="nc-ai a' + i + '" style="left:' + AIX[i] + 'px">' +
          '<div class="t-body">' + a.name + '</div>' +
          '<div class="t-label faint">' + a.date + '</div>' +
        '</div>';
      }).join('');

      return svg +
        '<div class="t-caps faint nc-lane nc-lane1">Food · markets it runs itself</div>' + mk +
        '<div class="t-caps faint nc-lane nc-lane2">AI · what it sells to others</div>' + ai +
        '<div class="nc-cap">' +
          '<div class="t-h2">One food market left.</div>' +
          '<div class="t-h2 c-cranberry">Giuseppe is the product.</div>' +
        '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.nc-mk-s, .nc-mk-t, .nc-ai-r, .nc-ai, .nc-lane2, .nc-cap > div, .dd-cap'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.nc-lane1'), { at: .15 });
      Kit.draw(tl, qa('.nc-mk-r .rp'), { at: .25, duration: .6, stagger: .06 });
      Kit.show(tl, qa('.nc-mk-n'), { at: .35, y: 12, stagger: .06 });
      Kit.draw(tl, qa('.nc-rule .rp'), { at: .6, duration: .7 });

      // [click 1] the first AI deal appears under the line
      ctx.pause();
      tl.addLabel('a0');
      Kit.show(tl, q('.nc-lane2'), { at: 'a0', y: 10 });
      tl.to(q('.nc-ai-r.a0'), { autoAlpha: 1, duration: .01 }, 'a0+=.15');
      Kit.draw(tl, qa('.nc-ai-r.a0 .rp'), { at: 'a0+=.15', duration: .5 });
      Kit.show(tl, q('.nc-ai.a0'), { at: 'a0+=.3', y: 16 });

      // [click 2] the AI lane fills
      ctx.pause();
      tl.addLabel('a1');
      [1, 2].forEach(function (i, k) {
        var at = 'a1+=' + (k * .25);
        tl.to(q('.nc-ai-r.a' + i), { autoAlpha: 1, duration: .01 }, at);
        Kit.draw(tl, qa('.nc-ai-r.a' + i + ' .rp'), { at: at, duration: .5 });
        Kit.show(tl, q('.nc-ai.a' + i), { at: at + '+=.15', y: 16 });
      });

      // [click 3] the food lane empties, left to right, in date order
      ctx.pause();
      tl.addLabel('x');
      // one exit per group, left to right: US + Canada · Argentina and Uruguay (one deal) · Mexico · Brazil
      [[0], [1, 2], [3], [4]].forEach(function (grp, k) {
        var at = 'x+=' + (k * .4);
        grp.forEach(function (i) {
          tl.to(q('.nc-mk-s.s' + i), { autoAlpha: 1, duration: .01 }, at);
          Kit.draw(tl, qa('.nc-mk-s.s' + i + ' .rp'), { at: at, duration: .35 });
          tl.to(q('.m' + i + ' .nc-mk-n'), { color: C.text3, duration: .35 }, at);
          tl.to(qa('.nc-mk-r.r' + i + ' .rp'), { opacity: .3, duration: .35 }, at);
          Kit.show(tl, q('.m' + i + ' .nc-mk-t'), { at: at + '+=.1', y: 10 });
        });
      });
      tl.to(qa('.nc-mk-r.r5 .rp'), { stroke: C.cranberryT, duration: .4 }, 'x+=1.5');
      tl.to(q('.m5 .nc-mk-n'), { color: C.cranberryT, duration: .4 }, 'x+=1.5');
      Kit.show(tl, q('.m5 .nc-mk-t'), { at: 'x+=1.6', y: 10 });

      // [click 4] what is left
      ctx.pause();
      tl.addLabel('cap');
      Kit.show(tl, qa('.nc-cap > div'), { at: 'cap', y: 18, stagger: .12 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, 'cap+=.5');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: 'cap+=.5', duration: .5 });
    },
    notes:
      'Now watch the company. On top, the markets where NotCo sells its own food. ' +
      '[click] In 2022 it sets up a joint venture with Kraft Heinz. First time the AI works for somebody else. ' +
      '[click] Then it makes that a business: its own AI unit, a portal called Concept Quant, and a chocolate deal with Barry Callebaut. ' +
      '[click] And the food lane empties. Kraft Heinz takes over US sales. Argentina and Uruguay go to Molinos. ' +
      'Mexico is reportedly closed with no buyer; that one is press only, NotCo has never confirmed it. Brazil goes to Ferrara. ' +
      '[click] Chile is the only market it still runs. The AI is what is left.'
  };

  /* ----------------------------------------------------------------- TODAY */
  var TODAY = {
    id: 'today',
    title: 'Today',
    heading: 'NotCo today',
    budgetSec: 45,
    html: function () {
      var svg = '<svg class="nc-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        '<g class="nc-br">' + Kit.rough.path('M120 858 L120 882 L980 882 L980 858', { seed: 80, w: 'normal', bow: .4, rough: .7, stroke: C.chalk }) + '</g>' +
        '<g class="nc-t-crd">' + tileRect(1080, 724, 720, 226, 81, { w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .12, hachureGap: 26 }) + '</g>' +
        '<g class="dd-n1">' + Kit.doodle.underline(124, 496, 392, { seed: 213, color: 'var(--rust-t)' }) + '</g>' +
      '</svg>';

      var left =
        '<div class="t-caps faint nc-t-k">Who buys Giuseppe now</div>' +
        '<div class="t-num nc-t-n1"><span class="n">0</span> of 20</div>' +
        '<div class="t-label dim nc-t-l1">largest packaged-goods companies</div>' +
        '<div class="t-num nc-t-n2">~half</div>' +
        '<div class="t-label dim nc-t-l2">of revenue, from AI</div>' +
        '<div class="callout nc-t-c">the AI business</div>';

      var right =
        Kit.photo(IMG + 'cocoa.jpg', { x: 1080, y: 300, w: 720, h: 400, rot: -2, framed: true, cls: 'nc-t-img', alt: 'split cocoa pod' }) +
        '<div class="nc-t-card">' +
          '<div class="t-h2 nc-t-co">Ferrero</div>' +
          '<div class="t-label nc-t-cl">cocoa substitutes across 30,000+ recipes a year</div>' +
          '<div class="t-label faint nc-t-cd">after the 2024 cocoa price surge</div>' +
        '</div>';

      return svg + left + right;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.nc-t-img, .nc-t-crd, .nc-t-co, .nc-t-cl, .nc-t-cd, .nc-t-n1, .nc-t-l1, .nc-t-n2, .nc-t-l2, .nc-br, .nc-t-c, .dd-n1'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.nc-t-k'), { at: .15 });
      Kit.drop(tl, q('.nc-t-img'), { at: .25 });
      Kit.show(tl, q('.nc-t-co'), { at: .6, y: 14 });

      // [click 1] one concrete job, before any aggregate. The card is drawn
      // with its lines, so no empty frame ever sits on the slide.
      ctx.pause();
      tl.addLabel('j');
      tl.to(q('.nc-t-crd'), { autoAlpha: 1, duration: .01 }, 'j');
      Kit.draw(tl, qa('.nc-t-crd .rp'), { at: 'j', duration: .6 });
      Kit.show(tl, qa('.nc-t-cl, .nc-t-cd'), { at: 'j+=.3', y: 14, stagger: .18 });

      // [click 2] how many of the giants
      ctx.pause();
      tl.addLabel('n1');
      tl.to(q('.nc-t-n1'), { autoAlpha: 1, duration: .3 }, 'n1');
      Kit.count(tl, q('.nc-t-n1 .n'), { to: 7, duration: 1.0, at: 'n1' });
      Kit.show(tl, q('.nc-t-l1'), { at: 'n1+=.5', y: 14 });
      tl.to(q('.dd-n1'), { autoAlpha: 1, duration: .01 }, 'n1+=.9');
      Kit.draw(tl, qa('.dd-n1 .rp'), { at: 'n1+=.9', duration: .7 });

      // [click 3] how much of the money, and the two numbers grouped
      ctx.pause();
      tl.addLabel('n2');
      Kit.show(tl, q('.nc-t-n2'), { at: 'n2', y: 14 });
      Kit.show(tl, q('.nc-t-l2'), { at: 'n2+=.2', y: 14 });
      tl.to(q('.nc-br'), { autoAlpha: 1, duration: .01 }, 'n2+=.5');
      Kit.draw(tl, qa('.nc-br .rp'), { at: 'n2+=.5', duration: .6 });
      Kit.show(tl, q('.nc-t-c'), { at: 'n2+=.8', y: 12 });
    },
    notes:
      'So who pays for Giuseppe now? The companies NotCo used to compete with. ' +
      '[click] Ferrero is the clearest case. After cocoa prices spiked in 2024, it asked NotCo to find substitutes across more than thirty thousand recipes a year. ' +
      'Most of this work is no longer plant-based. It is cost and supply. ' +
      'NotCo says its largest single contract is thirty million dollars over eighteen months. ' +
      '[click] Forbes reported in March 2026 that seven of the twenty largest packaged-goods companies work with NotCo. ' +
      '[click] And about half the revenue now comes from the AI side. That one is an estimate, and total revenue has fallen since 2022.'
  };

  /* ---------------------------------------------------------------- BRIDGE */
  var BRIDGE = {
    id: 'bridge',
    title: 'Bridge',
    budgetSec: 30,
    html: function () {
      return '' +
        Kit.photo(IMG + 'glass-milk.jpg', { x: 1230, y: 250, w: 520, h: 582, rot: 3, framed: true, cls: 'nc-b-img', alt: 'glass of plant milk' }) +
        '<div class="nc-b-scrim"></div>' +
        '<div class="t-h2 nc-b-l1">The food business is almost gone.</div>' +
        '<div class="t-h2 nc-b-l2">The AI it built is the product.</div>' +
        '<div class="t-label dim nc-b-sup">90% of its AI requests are no longer plant-based</div>' +
        '<div class="t-h1 c-rust nc-b-l3">Who else needs it?</div>' +
        '<svg class="nc-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="dd-q">' + Kit.doodle.underline(150, 844, 596, { seed: 214 }) + '</g>' +
        '</svg>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.nc-b-img, .nc-b-sup, .nc-b-l3, .dd-q'), { autoAlpha: 0 });

      Kit.drop(tl, q('.nc-b-img'), { at: 0 });
      Kit.rise(tl, qa('.nc-b-l1, .nc-b-l2'), { at: .2, stagger: .12 });

      // [click 1] the claim behind it, and the product recedes
      ctx.pause();
      tl.addLabel('s');
      Kit.show(tl, q('.nc-b-sup'), { at: 's', y: 14 });
      tl.to(q('.nc-b-img'), { opacity: .5, duration: .8 }, 's');

      // [click 2] the question the next section answers
      ctx.pause();
      tl.addLabel('q');
      Kit.show(tl, q('.nc-b-l3'), { at: 'q', y: 20 });
      tl.to(q('.dd-q'), { autoAlpha: 1, duration: .01 }, 'q+=.5');
      Kit.draw(tl, qa('.dd-q .rp'), { at: 'q+=.5', duration: .5 });
    },
    notes:
      'So here is where NotCo lands. The food business is nearly gone, and the engine built to serve it is now the thing it sells. ' +
      '[click] The work has drifted, too. A NotCo executive said in 2025 that ninety percent of their requests are no longer plant-based. ' +
      'That is their own figure, unchecked. ' +
      '[click] Which leaves one question. If this engine is worth that much to Ferrero, who else needs one?'
  };

  Deck.section({
    id: 'notco', order: 4, num: '04', kicker: 'Sell', title: 'NotCo', color: 'cranberry',
    toss: 'assets/img/giuseppe/milk.webp',
    opener: {
      id: 'opener', budgetSec: 10,
      notes:
        'Section four: Sell. We have seen what Giuseppe does. Now, what NotCo did with it as a business.'
    },
    slides: [ORIGIN, PIVOT, TODAY, BRIDGE]
  });
})();
