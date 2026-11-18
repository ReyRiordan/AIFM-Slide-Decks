/* ==========================================================================
   05 · Next · Future   (budget 225 s) — the closing section.
   Spec: specs/future.md. No roadmap and no crumbs: this section spends the
   two techniques the deck already taught, then closes the talk.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/future/';

  /* ------------------------------------------------------------- FORCES */
  var COLX = [120, 465, 810, 1155, 1500];
  var FORCE = [
    { name: 'Weight-loss drugs', num: { to: 12.4, dec: 1, suffix: '%' }, lab: 'of US shoppers, up from 5.8% in 2024' },
    { name: 'Dye rules', num: { to: 6, dec: 0, suffix: ' dyes' }, lab: 'FDA target, end of 2026' },
    { name: 'Cocoa', html: '$12,931<br>→ $6,771', lab: 'per tonne, peak to Aug 2026' },
    { name: 'Tariffs', html: 'Feb 2026', lab: 'struck down, still a top risk' },
    { name: 'Health plans', num: { to: 13, dec: 0, suffix: ' states' }, lab: 'pay for food as treatment' }
  ];
  var BAR_X0 = 120, BAR_X1 = 1800, BAR_T = 800, BAR_B = 860;

  function barPath(b) {
    return 'M' + BAR_X0 + ' ' + BAR_T + ' Q960 ' + (BAR_T + b * 1.7) + ' ' + BAR_X1 + ' ' + BAR_T +
      ' L' + BAR_X1 + ' ' + BAR_B + ' Q960 ' + (BAR_B + b * 1.7) + ' ' + BAR_X0 + ' ' + BAR_B + ' Z';
  }

  var FORCES = {
    id: 'forces',
    title: 'Five forces at once',
    heading: 'Five forces at once',
    budgetSec: 60,
    html: function () {
      var cols = FORCE.map(function (f, i) {
        var num = f.html != null ? f.html : '';
        return '<div class="t-caps fu-name n' + i + '" style="left:' + COLX[i] + 'px">' + f.name + '</div>' +
          '<div class="t-mono fu-num v' + i + '" style="left:' + COLX[i] + 'px">' + num + '</div>' +
          '<div class="t-label fu-lab l' + i + '" style="left:' + COLX[i] + 'px">' + f.lab + '</div>';
      }).join('');
      var arrows = FORCE.map(function (f, i) {
        var cx = COLX[i] + 150;
        return '<g class="fu-arr a' + i + '">' + Kit.rough.arrow(cx, 668, cx, 778, { seed: 60 + i * 3, sw: 3, head: 17 }) + '</g>';
      }).join('');
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        arrows +
        '<g class="fu-bar"></g>' +
        '<text class="fu-barlab" x="960" y="838" text-anchor="middle">ONE FORMULA</text>' +
      '</svg>';
      return '<div class="t-caps fu-sub">Trade press calls 2026 “the great reformulation”</div>' +
        svg + cols +
        Kit.photo(IMG + 'candy.webp', { x: 446, y: 650, w: 140, rot: 8, cls: 'fu-candy', alt: 'coloured candy shells' }) +
        Kit.src('GLP-1: Hartman via FoodNavigator, Mar 2026. Dyes: Food Industry Executive, Jun 2026. ' +
          'Cocoa: ConfectioneryNews, Oct 2026. Medicaid: Episcopal Health Foundation, 2026. Candy: illustration (generated).');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { load: 0 }, bar = q('.fu-bar'), lab = q('.fu-barlab');
      function render() {
        bar.innerHTML = Kit.rough.path(barPath(st.load * 8), { seed: 31, sw: 3, stroke: C.chalk, fill: C.chalk, fillStyle: 'solid' });
        gsap.set(lab, { y: st.load * 8 * .85 });
      }
      render();

      gsap.set(qa('.fu-name, .fu-num, .fu-lab, .fu-arr, .fu-candy'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.fu-sub, .src'), { at: .25, stagger: .08 });
      Kit.show(tl, q('.fu-bar'), { at: .3, y: 30, duration: .7 });
      Kit.fade(tl, q('.fu-barlab'), { at: .5, duration: .5 });

      FORCE.forEach(function (f, i) {
        ctx.pause();
        var L = 'f' + i;
        tl.addLabel(L);
        Kit.show(tl, q('.n' + i), { at: L, y: 16, duration: .4 });
        Kit.show(tl, q('.v' + i), { at: L + '+=.12', y: 16, duration: .4 });
        if (f.num) Kit.count(tl, q('.v' + i), { to: f.num.to, decimals: f.num.dec, suffix: f.num.suffix, duration: .7, at: L + '+=.12' });
        Kit.show(tl, q('.l' + i), { at: L + '+=.2', y: 14, duration: .4 });
        if (i === 1) Kit.drop(tl, q('.fu-candy'), { at: L + '+=.1' });
        tl.to(q('.a' + i), { autoAlpha: 1, duration: .01 }, L + '+=.35');
        Kit.draw(tl, qa('.a' + i + ' .rp'), { at: L + '+=.35', duration: .5 });
        tl.to(st, { load: i + 1, duration: .6, ease: 'power2.out', onUpdate: render }, L + '+=.6');
      });
    },
    notes:
      'One formula sits at the bottom of this slide: the recipe for a product on a shelf. ' +
      'Five separate pressures are pushing on it at once. ' +
      '[click] Weight-loss drugs. One in eight American shoppers takes one. They buy less, and they want protein, so brands redesign the product rather than add a badge. ' +
      '[click] Colour. The FDA wants six petroleum dyes gone by the end of this year. Natural colours fade, carry flavour, and blue is hardest to match. ' +
      '[click] Cocoa fell by half from its peak, then spiked again. Not one smooth decline: formulas have to move both ways now. ' +
      '[click] Tariffs. The court struck the big ones down in February, and sourcing is still a top planning risk. ' +
      '[click] And thirteen states let Medicaid pay for food as treatment. Five pressures, one formula, and it is bending.'
  };

  /* ------------------------------------------------------------- ENGINE */
  var ENGINE = {
    id: 'engine',
    title: 'A reformulation engine',
    heading: 'A reformulation engine',
    budgetSec: 45,
    html: function () {
      var o = { sw: 3, rough: 1.0 };
      function box(x, y, w, h, seed, cls, opt) {
        return '<g class="' + cls + '">' + Kit.rough.rect(x, y, w, h, Object.assign({ seed: seed }, o, opt || {})) + '</g>';
      }
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        '<g class="fu-loop">' +
          Kit.rough.rect(140, 360, 330, 96, Object.assign({ seed: 11 }, o)) +
          Kit.rough.rect(820, 360, 260, 96, Object.assign({ seed: 12 }, o)) +
          Kit.rough.rect(140, 560, 260, 96, Object.assign({ seed: 13 }, o)) +
          Kit.rough.arrow(478, 408, 808, 408, { seed: 14, sw: 3, head: 17 }) +
          Kit.rough.arrow(950, 466, 950, 548, { seed: 15, sw: 3, head: 17 }) +
          Kit.rough.arrow(610, 642, 412, 616, { seed: 16, sw: 3, head: 17, bend: 10 }) +
          Kit.rough.arrow(270, 550, 290, 466, { seed: 17, sw: 3, head: 17, bend: 10 }) +
        '</g>' +
        '<g class="fu-sbox">' + Kit.rough.rect(620, 560, 540, 170, Object.assign({ seed: 18 }, o)) + '</g>' +
        box(1240, 360, 560, 210, 21, 'fu-gap') +
        box(1240, 620, 560, 230, 22, 'fu-wedge', { stroke: C.rust }) +
      '</svg>';
      var nodes =
        '<div class="t-body fu-node" style="left:140px;top:388px;width:330px">point on the map</div>' +
        '<div class="t-body fu-node" style="left:820px;top:388px;width:260px">decode</div>' +
        '<div class="t-body fu-node" style="left:140px;top:588px;width:260px">steer</div>' +
        '<div class="t-caps fu-tag" style="left:652px;top:588px">Score</div>' +
        '<div class="t-body fu-score s1">how close to milk</div>' +
        '<div class="t-body fu-score s2">cost · label<br>shelf life · allergens</div>';
      var cards =
        '<div class="t-caps fu-tag g1" style="left:1276px;top:404px">Mid-sized makers</div>' +
        '<div class="t-body fu-cardb g2" style="left:1276px;top:450px">same pressure, a fraction of the IT budget</div>' +
        '<div class="t-h2 fu-cardh w1" style="left:1276px;top:664px;color:' + C.rustT + '">Formula insurance</div>' +
        '<div class="t-label fu-cardb w2" style="left:1276px;top:744px">backup formulas, computed before the shock</div>';
      return '<div class="t-caps fu-bet">Bet 1</div>' + svg + nodes + cards +
        '<div class="t-h2 fu-cap">Same engine. New score.</div>' +
        Kit.src('Opportunity assessment and the "formula insurance" wedge: market report, Nov 2026, ' +
          'built on Food Industry Executive, Feb 2026 and the sources cited there.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.s2, .fu-gap, .g1, .g2, .fu-wedge, .w1, .w2, .fu-cap'), { autoAlpha: 0 });
      gsap.set(qa('.fu-gap .rp, .fu-wedge .rp'), { drawSVG: '0%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.fu-bet, .src'), { at: .2, stagger: .08 });
      Kit.draw(tl, qa('.fu-loop .rp, .fu-sbox .rp'), { at: .25, duration: .8, stagger: .05 });
      Kit.fade(tl, qa('.fu-node, .fu-tag:not(.g1), .s1'), { at: .6, stagger: .06 });

      // [click 1] name the buyer before the product
      ctx.pause();
      tl.addLabel('gap');
      tl.to(q('.fu-gap'), { autoAlpha: 1, duration: .01 }, 'gap');
      tl.to(qa('.fu-gap .rp'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, 'gap');
      Kit.show(tl, qa('.g1, .g2'), { at: 'gap+=.25', y: 16, stagger: .08, duration: .5 });

      // [click 2] the one change that matters: the score
      ctx.pause();
      tl.addLabel('sw');
      Kit.swap(tl, q('.s1'), q('.s2'), { at: 'sw' });
      tl.fromTo(qa('.fu-sbox .rp'), { stroke: C.chalk }, { stroke: C.saffronT, duration: .4 }, 'sw+=.3');
      Kit.show(tl, q('.fu-cap'), { at: 'sw+=.5', y: 20, duration: .5 });

      // [click 3] the wedge
      ctx.pause();
      tl.addLabel('wd');
      tl.to(q('.fu-wedge'), { autoAlpha: 1, duration: .01 }, 'wd');
      tl.to(qa('.fu-wedge .rp'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, 'wd');
      Kit.show(tl, qa('.w1, .w2'), { at: 'wd+=.25', y: 18, stagger: .08, duration: .5 });
    },
    notes:
      'So what would I build? The first bet is the loop you just saw, pointed somewhere else. ' +
      'Same map, same decoder, same steering. ' +
      '[click] The buyer is not the giant that can license Giuseppe. It is the mid-sized maker with the same deadline and a fraction of the IT budget, whose recipes live in spreadsheets. ' +
      '[click] And only one thing changes: the score. Not how close to milk, but cost, label, shelf life and allergens. Same engine, new score. ' +
      '[click] The product I would sell is insurance. Backup formulas for the ingredients most likely to move, computed before the shock, not after it.'
  };

  /* ------------------------------------------------------------- PARITY */
  var AX = 560, PA = 140, PB = 980;
  function bar(x, y, pct, cls) {
    return '<rect class="fu-bar2 ' + cls + '" x="' + x + '" y="' + y + '" width="' + (AX * pct) + '" height="40" rx="6" fill="' + C.plum + '"/>';
  }
  function track(x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="' + AX + '" height="40" rx="6" fill="' + C.chalk + '" opacity=".10"/>';
  }
  var PARITY = {
    id: 'parity',
    title: 'Parity testing',
    heading: 'Parity testing',
    budgetSec: 45,
    html: function () {
      var chx = PB + AX * .36;
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        '<line x1="920" y1="350" x2="920" y2="700" stroke="' + C.line + '" stroke-width="2"/>' +
        track(PA, 539) + track(PB, 479) + track(PB, 614) +
        bar(PA, 539, .90, 'bA') + bar(PB, 479, .33, 'b1') + bar(PB, 614, .67, 'b2') +
        '<line class="fu-chance" x1="' + chx + '" y1="610" x2="' + chx + '" y2="672" stroke="' + C.chalk +
          '" stroke-width="3" stroke-dasharray="12 9" opacity=".45"/>' +
        '<text class="fu-bignum nA" x="' + (PA + AX * .90 + 22) + '" y="573">90%</text>' +
        '<text class="fu-bignum n1" x="' + (PB + AX * .33 + 22) + '" y="513">33%</text>' +
        '<text class="fu-bignum n2" x="' + (PB + AX * .67 + 22) + '" y="648">67%</text>' +
        '<g class="fu-vcard">' + Kit.rough.rect(120, 760, 1680, 170, { seed: 41, sw: 3, rough: 1.0, stroke: C.rust }) + '</g>' +
      '</svg>';
      return '<div class="t-caps fu-bet">Bet 2</div>' + svg +
        '<div class="t-caps fu-ptitle" style="left:120px">Screening concepts</div>' +
        '<div class="t-caps fu-ptitle" style="left:960px">Predicting the favorite</div>' +
        '<div class="t-label fu-rlab cA" style="left:140px;top:596px">of human test-retest reliability</div>' +
        '<div class="t-label fu-rlab c1" style="left:980px;top:438px">ranked first</div>' +
        '<div class="t-label fu-rlab c2" style="left:980px;top:573px">in the top three</div>' +
        '<div class="t-label fu-foot2 fA" style="left:140px">the same human, asked twice</div>' +
        '<div class="t-label fu-foot2 fB" style="left:980px">about 36% by chance (top three)</div>' +
        '<div class="t-h1 fu-vq">Will they notice?</div>' +
        '<div class="t-label fu-vt">parity, not liking</div>' +
        Kit.src('Concept screening: PyMC Labs and Colgate-Palmolive, 57 surveys, 9,300 human responses. ' +
          'Taste ranking: Food Intelligence Lab, 215 plant-based products, 21,000+ evaluations, via IFT.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.fu-bignum, .cA, .fA, .fB, .fu-vcard, .fu-vq, .fu-vt'), { autoAlpha: 0 });
      gsap.set(qa('.fu-vcard .rp'), { drawSVG: '0%' });
      gsap.set(qa('.bA, .b1, .b2'), { scaleX: 0, transformOrigin: '0% 50%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.fu-bet, .fu-ptitle, .fu-rlab, .fu-chance, .src'), { at: .2, stagger: .05 });

      // [click 1] concept screening already works
      ctx.pause();
      tl.addLabel('a');
      tl.to(q('.bA'), { scaleX: 1, duration: .8, ease: 'power2.out' }, 'a');
      tl.to(q('.nA'), { autoAlpha: 1, duration: .3 }, 'a+=.5');
      Kit.count(tl, q('.nA'), { to: 90, suffix: '%', duration: .7, at: 'a+=.2' });
      Kit.show(tl, qa('.cA, .fA'), { at: 'a+=.6', y: 14, stagger: .08, duration: .45 });

      // [click 2] ranking a favourite is near chance
      ctx.pause();
      tl.addLabel('b');
      tl.to(qa('.b1, .b2'), { scaleX: 1, duration: .8, ease: 'power2.out', stagger: .15 }, 'b');
      tl.to(qa('.n1, .n2'), { autoAlpha: 1, duration: .3, stagger: .15 }, 'b+=.5');
      Kit.count(tl, q('.n1'), { to: 33, suffix: '%', duration: .7, at: 'b+=.2' });
      Kit.count(tl, q('.n2'), { to: 67, suffix: '%', duration: .7, at: 'b+=.35' });
      tl.to(qa('.fu-chance'), { stroke: C.rustT, opacity: 1, duration: .4 }, 'b+=.8');
      Kit.show(tl, q('.fB'), { at: 'b+=.8', y: 14, duration: .45 });

      // [click 3] the question that is worth selling
      ctx.pause();
      tl.addLabel('v');
      tl.to(q('.fu-vcard'), { autoAlpha: 1, duration: .01 }, 'v');
      tl.to(qa('.fu-vcard .rp'), { drawSVG: '100%', duration: .7, ease: 'power2.inOut' }, 'v');
      Kit.show(tl, qa('.fu-vq, .fu-vt'), { at: 'v+=.3', y: 20, stagger: .08, duration: .5 });
    },
    notes:
      'The second bet comes from a limit we met in the Mix section. Can a model taste? ' +
      '[click] For screening ideas, close enough. Ask a language model to answer a survey as a shopper, and it reaches ninety per cent of the reliability you get from asking the same human twice. ' +
      '[click] For ranking, no. On twenty-one thousand real tastings it put the human favourite first a third of the time, and in its top three two thirds, against about thirty-six per cent by chance. ' +
      '[click] So ask the narrower question. Not what will they love, but will they notice we changed it. That one has a right answer.'
  };

  /* -------------------------------------------------------------- AVOID */
  var DEAD = [
    { x: 120, name: 'Zume', money: '~$500M', out: 'raised; collapsed, Jun 2026', cross: 202 },
    { x: 690, name: 'Picnic', money: '~$50M', out: 'raised; wound down, May 2026', cross: 170 },
    { x: 1260, name: 'Karakuri', money: '£350,000', out: 'what the whole company sold for', cross: 0 }
  ];
  var AVOID = {
    id: 'avoid',
    title: 'What not to build',
    heading: 'What not to build',
    budgetSec: 30,
    html: function () {
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        DEAD.map(function (d, i) {
          return '<g class="fu-card k' + i + '">' + Kit.rough.rect(d.x, 350, 540, 272, { seed: 51 + i * 4, sw: 3, rough: 1.0 }) + '</g>' +
            (d.cross ? '<g class="fu-x x' + i + '">' + Kit.rough.line(d.x + 28, 492, d.x + 28 + d.cross, 476, { seed: 71 + i, sw: 4, stroke: C.text3 }) + '</g>' : '');
        }).join('') +
      '</svg>';
      var cards = DEAD.map(function (d, i) {
        return '<div class="t-h2 fu-cname m' + i + '" style="left:' + (d.x + 36) + 'px;top:392px">' + d.name + '</div>' +
          '<div class="t-mono fu-cmoney m' + i + '" style="left:' + (d.x + 36) + 'px;top:452px">' + d.money + '</div>' +
          '<div class="t-label fu-cout m' + i + '" style="left:' + (d.x + 36) + 'px;top:540px">' + d.out + '</div>';
      }).join('');
      return '<div class="t-caps fu-sub">The one I would not start</div>' + svg + cards +
        '<div class="t-h2 fu-work">In food plants, the robots work.</div>' +
        '<div class="fu-chef"><b class="t-h1">$43.1M</b><span class="t-label">Chef Robotics Series A · 44M+ servings reported</span></div>' +
        Kit.src('Zume, Picnic, Karakuri and Chef Robotics figures: GeekWire, Dealroom, Yahoo Finance UK and The Robot Report, 2026.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.k1, .k2, .m1, .m2, .fu-x, .fu-work, .fu-chef'), { autoAlpha: 0 });
      gsap.set(qa('.fu-x .rp'), { drawSVG: '0%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.fu-sub, .src'), { at: .2, stagger: .08 });
      Kit.draw(tl, qa('.k0 .rp'), { at: .3, duration: .7 });
      Kit.fade(tl, qa('.m0'), { at: .5, stagger: .08 });

      // [click 1] the other two, then the money crossed out
      ctx.pause();
      tl.addLabel('d');
      [1, 2].forEach(function (i, j) {
        var at = 'd+=' + (j * .25);
        tl.to(q('.k' + i), { autoAlpha: 1, duration: .01 }, at);
        Kit.draw(tl, qa('.k' + i + ' .rp'), { at: at, duration: .5 });
        Kit.show(tl, qa('.m' + i), { at: 'd+=' + (j * .25 + .15), y: 16, stagger: .06, duration: .4 });
      });
      tl.to(qa('.fu-cmoney'), { color: C.text3, duration: .4 }, 'd+=.9');
      tl.to(qa('.fu-x'), { autoAlpha: 1, duration: .01 }, 'd+=.9');
      tl.to(qa('.fu-x .rp'), { drawSVG: '100%', duration: .45, stagger: .12 }, 'd+=.9');

      // [click 2] the same robots, a different place
      ctx.pause();
      tl.addLabel('w');
      tl.to(qa('.fu-card, .fu-cname, .fu-cmoney, .fu-cout, .fu-x'), { opacity: .55, duration: .5 }, 'w');
      Kit.show(tl, q('.fu-work'), { at: 'w+=.1', y: 20, duration: .5 });
      Kit.show(tl, q('.fu-chef'), { at: 'w+=.35', y: 20, duration: .5 });
    },
    notes:
      'One thing I would not start: the robot chef. ' +
      '[click] Zume raised half a billion dollars and collapsed. Picnic raised fifty million and wound down in May. Karakuri, which Ocado backed, sold for three hundred and fifty thousand pounds. Money in, nothing out. ' +
      '[click] The robots that work are already inside food factories, assembling meals, and they are funded. At the consumer end, Samsung Food gives the app away.'
  };

  /* ------------------------------------------------------------ SUMMARY */
  var SUM = [
    { num: '01', k: 'Read', color: 'teal', pre: 'a recipe card', rest: ' becomes a typed record' },
    { num: '02', k: 'Find', color: 'olive', pre: 'a protein', rest: ' becomes a vector' },
    { num: '03', k: 'Mix', color: 'saffron', pre: 'a recipe', rest: ' becomes a point on a map' },
    { num: '04', k: 'Sell', color: 'cranberry', pre: 'the engine', rest: ' outlived the food' }
  ];
  var SROW_Y = 330, SROW_STEP = 92;
  var SUMMARY = {
    id: 'summary',
    title: 'Summary',
    heading: 'Summary',
    budgetSec: 45,
    html: function () {
      var rows = SUM.map(function (r, i) {
        return '<div class="su-row s' + i + '" style="top:' + (SROW_Y + i * SROW_STEP) + 'px">' +
          '<span class="su-rule" style="background:' + C[r.color] + '"></span>' +
          '<span class="su-in">' +
            '<span class="su-chip" style="background:' + C[r.color] + '"></span>' +
            '<span class="t-mono su-n">' + r.num + '</span>' +
            '<span class="t-h2 su-k" style="color:' + C[r.color + 'T'] + '">' + r.k + '</span>' +
            '<span class="t-body dim su-t"><b style="font-weight:600;color:' + C[r.color + 'T'] + '">' + r.pre + '</b>' + r.rest + '</span>' +
          '</span>' +
        '</div>';
      }).join('');
      return '<div class="su-bg" style="background-image:url(' + IMG + 'close-table.jpg)"></div>' +
        '<div class="su-scrim"></div>' + rows +
        '<div class="t-h2 su-line1">A model chose what\'s in it.</div>' +
        '<div class="t-h1 su-line2">Would you notice?</div>' +
        Kit.src('Sources: Samsung Food, Shiru, Giuseppe, NotCo and the market report, Nov 2026. ' +
          'References follow. Table photo: illustration (generated).');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.su-in'), { autoAlpha: 0 });
      gsap.set(qa('.su-rule'), { opacity: .18 });
      gsap.set(qa('.su-line1, .su-line2'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.su-bg, .su-rule, .src'), { at: .2, stagger: .04 });

      SUM.forEach(function (r, i) {
        ctx.pause();
        var L = 'r' + i;
        tl.addLabel(L);
        tl.to(q('.s' + i + ' .su-rule'), { opacity: 1, duration: .4 }, L);
        tl.fromTo(q('.s' + i + ' .su-in'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, L + '+=.1');
      });

      // [click 5] the question owns the frame
      ctx.pause();
      tl.addLabel('q');
      tl.to(qa('.su-row'), { opacity: .7, duration: .5 }, 'q');
      tl.to(q('.su-bg'), { opacity: .55, duration: .8 }, 'q');
      Kit.show(tl, q('.su-line1'), { at: 'q+=.15', y: 24, duration: .5 });
      Kit.show(tl, q('.su-line2'), { at: 'q+=.45', y: 24, duration: .6 });
    },
    notes:
      'So, four sections, and every one of them did the same thing. ' +
      '[click] Read: a recipe card became a typed record. ' +
      '[click] Find: a protein became a vector, a list of numbers you can search. ' +
      '[click] Mix: a whole recipe became a point on a map. ' +
      '[click] And Sell: the engine turned out to be worth more than the milk. ' +
      'Each step made food more abstract, and that is exactly what let a machine search it. None of it removes the cook. ' +
      '[click] Which leaves you with this. A model chose what is in it. Would you notice?'
  };

  Deck.section({
    id: 'future', order: 5, num: '05', kicker: 'Next', title: 'Future', color: 'plum',
    toss: 'assets/img/future/candy.webp',
    slides: [FORCES, ENGINE, PARITY, AVOID, SUMMARY]
  });
})();
