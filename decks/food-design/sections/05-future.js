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
  var BAR_X0 = 120, BAR_X1 = 1800, BAR_T = 866, BAR_B = 928;

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
        return '<g class="fu-arr a' + i + '">' + Kit.rough.arrow(cx, 690, cx, 846, { seed: 60 + i * 3, w: 'normal', head: 20 }) + '</g>';
      }).join('');
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        arrows +
        '<g class="fu-bar"></g>' +
        '<text class="fu-barlab" x="960" y="906" text-anchor="middle">ONE FORMULA</text>' +
        // doodle: the arrow that names what the sag means, on the last click
        '<g class="dd-bend">' + Kit.rough.arrow(1404, 1002, 1128, 958, { seed: 80, w: 'normal', stroke: C.rustT, head: 18, bend: 16 }) + '</g>' +
      '</svg>';
      return '<div class="t-caps fu-sub">Trade press calls 2026 “the great reformulation”</div>' +
        svg + cols +
        Kit.photo(IMG + 'candy.webp', { x: 446, y: 700, w: 140, rot: 8, cls: 'fu-candy', alt: 'coloured candy shells' }) +
        '<div class="callout fu-bend">bending under all five</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { load: 0 }, bar = q('.fu-bar'), lab = q('.fu-barlab');
      function render() {
        bar.innerHTML = Kit.rough.path(barPath(st.load * 8), { seed: 31, w: 'heavy', stroke: C.chalk, fill: C.chalk, fillStyle: 'solid' });
        gsap.set(lab, { y: st.load * 8 * .85 });
      }
      render();

      gsap.set(qa('.fu-name, .fu-num, .fu-lab, .fu-arr, .fu-candy, .dd-bend, .fu-bend'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.fu-sub'), { at: .25 });
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
        if (i === FORCE.length - 1) {
          tl.to(q('.dd-bend'), { autoAlpha: 1, duration: .01 }, L + '+=1.1');
          Kit.draw(tl, qa('.dd-bend .rp'), { at: L + '+=1.1', duration: .5 });
          Kit.show(tl, q('.fu-bend'), { at: L + '+=1.0', y: 12, duration: .45 });
        }
      });
    },
    notes:
      'One formula at the bottom: the recipe for a product on a shelf. ' +
      'Five pressures are pushing on it at once. ' +
      '[click] Weight-loss drugs. About one in eight American shoppers takes one — that share is a market estimate. ' +
      'They buy less and want protein, so brands redesign the product rather than add a badge. ' +
      '[click] Colour. The FDA wants six petroleum dyes gone by year’s end. Natural colours fade, carry flavour, and blue is hardest to match. ' +
      '[click] Cocoa fell by half from its peak, then spiked again. Not one smooth decline: formulas move both ways now. ' +
      '[click] Tariffs. The court struck the big ones down in February; sourcing is still a top planning risk. ' +
      '[click] And thirteen states let Medicaid pay for food as treatment. Five pressures, one formula, and it is bending.'
  };

  /* ------------------------------------------------------------- ENGINE */
  var ENGINE = {
    id: 'engine',
    title: 'A reformulation engine',
    heading: 'A reformulation engine',
    budgetSec: 45,
    html: function () {
      var o = { w: 'normal', rough: 1.0 };
      var fl = { w: 'heavy', head: 24, rough: 1.0 };     // the loop itself is the main flow
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        '<g class="fu-loop">' +
          Kit.rough.rect(140, 380, 330, 96, Object.assign({ seed: 11 }, o)) +
          Kit.rough.rect(820, 380, 260, 96, Object.assign({ seed: 12 }, o)) +
          Kit.rough.rect(140, 600, 260, 96, Object.assign({ seed: 13 }, o)) +
          Kit.rough.arrow(478, 428, 808, 428, Object.assign({ seed: 14 }, fl)) +
          Kit.rough.arrow(950, 486, 950, 588, Object.assign({ seed: 15 }, fl)) +
          Kit.rough.arrow(610, 684, 412, 658, Object.assign({ seed: 16, bend: 10 }, fl)) +
          Kit.rough.arrow(270, 590, 290, 486, Object.assign({ seed: 17, bend: 10 }, fl)) +
        '</g>' +
        '<g class="fu-sbox">' + Kit.rough.rect(620, 600, 540, 190,
          { seed: 18, w: 'heavy', rough: 1.0, hatch: 'var(--sec-t)', fillOpacity: .15, hachureGap: 24 }) + '</g>' +
        '<g class="fu-gap">' + Kit.rough.rect(1240, 360, 560, 220,
          { seed: 21, w: 'fine', rough: 1.0, stroke: C.text2, hatch: 'var(--sec-t)', fillOpacity: .2, hachureGap: 24 }) + '</g>' +
        '<g class="fu-wedge">' + Kit.rough.rect(1240, 640, 560, 280,
          { seed: 22, w: 'normal', rough: 1.0, stroke: C.rust, hatch: 'var(--rust-t)', fillOpacity: .14, hachureGap: 26 }) + '</g>' +
        // doodles: the arrow that says which part changes, and the line under the lesson
        '<g class="fu-ca">' + Kit.rough.arrow(442, 776, 606, 728, { seed: 24, w: 'normal', stroke: C.rustT, head: 18, bend: -14 }) + '</g>' +
        '<g class="dd-cap">' + Kit.doodle.underline(126, 930, 578, { seed: 25, color: 'var(--rust-t)' }) + '</g>' +
      '</svg>';
      var nodes =
        '<div class="t-body fu-node" style="left:140px;top:408px;width:330px">point on the map</div>' +
        '<div class="t-body fu-node" style="left:820px;top:408px;width:260px">decode</div>' +
        '<div class="t-body fu-node" style="left:140px;top:628px;width:260px">steer</div>' +
        '<div class="t-caps fu-tag" style="left:652px;top:628px">Score</div>' +
        '<div class="t-body fu-score s1">how close to milk</div>' +
        '<div class="t-body fu-score s2">cost · label<br>shelf life · allergens</div>';
      var cards =
        '<div class="t-caps fu-tag g1" style="left:1276px;top:404px">Mid-sized makers</div>' +
        '<div class="t-body fu-cardb g2" style="left:1276px;top:452px">same pressure, a fraction of the IT budget</div>' +
        '<div class="t-h2 fu-cardh w1" style="left:1276px;top:694px;color:' + C.rustT + '">Formula insurance</div>' +
        '<div class="t-label fu-cardb w2" style="left:1276px;top:790px">backup formulas, computed before the shock</div>';
      return '<div class="t-caps fu-bet">Bet 1</div>' + svg + nodes + cards +
        '<div class="callout fu-c1">only this changes</div>' +
        '<div class="t-h2 fu-cap">Same engine. New score.</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.s2, .fu-gap, .g1, .g2, .fu-wedge, .w1, .w2, .fu-cap, .fu-c1, .fu-ca, .dd-cap'), { autoAlpha: 0 });
      gsap.set(qa('.fu-gap .rp, .fu-wedge .rp'), { drawSVG: '0%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.fu-bet'), { at: .2 });
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
      tl.to(q('.fu-ca'), { autoAlpha: 1, duration: .01 }, 'sw+=.15');
      Kit.draw(tl, qa('.fu-ca .rp'), { at: 'sw+=.15', duration: .45 });
      Kit.show(tl, q('.fu-c1'), { at: 'sw+=.15', y: 10, duration: .45 });
      Kit.show(tl, q('.fu-cap'), { at: 'sw+=.5', y: 20, duration: .5 });
      tl.to(q('.dd-cap'), { autoAlpha: 1, duration: .01 }, 'sw+=.9');
      Kit.draw(tl, qa('.dd-cap .rp'), { at: 'sw+=.9', duration: .5 });

      // [click 3] the wedge
      ctx.pause();
      tl.addLabel('wd');
      tl.to(q('.fu-wedge'), { autoAlpha: 1, duration: .01 }, 'wd');
      tl.to(qa('.fu-wedge .rp'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, 'wd');
      Kit.show(tl, qa('.w1, .w2'), { at: 'wd+=.25', y: 18, stagger: .08, duration: .5 });
    },
    notes:
      'So what would I build? The first bet is the loop you just saw, pointed somewhere else: ' +
      'same map, same decoder, same steering. ' +
      '[click] The buyer is not the giant that can license Giuseppe, but the mid-sized maker with the same deadline and a fraction of the IT budget. ' +
      'That gap is a trade report’s reading, not a customer I have spoken to. ' +
      '[click] And only one thing changes: the score. Not how close to milk, but cost, label, shelf life and allergens. ' +
      '[click] The product I would sell is insurance: backup formulas for the ingredients most likely to move, computed before the shock.'
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
        '<g class="fu-div">' + Kit.rough.line(920, 350, 920, 700, { seed: 44, w: 'fine', stroke: C.text3, bow: .4, rough: .7 }) + '</g>' +
        track(PA, 539) + track(PB, 479) + track(PB, 614) +
        bar(PA, 539, .90, 'bA') + bar(PB, 479, .33, 'b1') + bar(PB, 614, .67, 'b2') +
        '<line class="fu-chance" x1="' + chx + '" y1="610" x2="' + chx + '" y2="672" stroke="' + C.chalk +
          '" stroke-width="3" stroke-dasharray="12 9" opacity=".45"/>' +
        '<text class="fu-bignum nA" x="' + (PA + AX * .90 + 22) + '" y="573">90%</text>' +
        '<text class="fu-bignum n1" x="' + (PB + AX * .33 + 22) + '" y="513">33%</text>' +
        '<text class="fu-bignum n2" x="' + (PB + AX * .67 + 22) + '" y="648">67%</text>' +
        '<g class="fu-vcard">' + Kit.rough.rect(120, 806, 1680, 184,
          { seed: 41, w: 'heavy', rough: 1.0, stroke: C.rust, hatch: 'var(--rust-t)', fillOpacity: .1, hachureGap: 30 }) + '</g>' +
        // doodles: loop the number that works, point at the gap that does not, check the question that has an answer
        '<g class="dd-90">' + Kit.doodle.circle(654, 534, 132, 58, { seed: 45, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
        '<g class="fu-cha">' + Kit.rough.arrow(1544, 560, 1196, 612, { seed: 46, w: 'normal', stroke: C.rustT, head: 18, bend: 22 }) + '</g>' +
        '<g class="dd-ok">' + Kit.doodle.mark(790, 892, 32, 'check', { seed: 47, color: 'var(--rust-t)' }) + '</g>' +
      '</svg>';
      return '<div class="t-caps fu-bet">Bet 2</div>' + svg +
        '<div class="callout fu-chc">barely above chance</div>' +
        '<div class="t-caps fu-ptitle" style="left:120px">Screening concepts</div>' +
        '<div class="t-caps fu-ptitle" style="left:960px">Predicting the favorite</div>' +
        '<div class="t-label fu-rlab cA" style="left:140px;top:596px">of human test-retest reliability</div>' +
        '<div class="t-label fu-rlab c1" style="left:980px;top:438px">ranked first</div>' +
        '<div class="t-label fu-rlab c2" style="left:980px;top:573px">in the top three</div>' +
        '<div class="t-label fu-foot2 fA" style="left:140px">the same human, asked twice</div>' +
        '<div class="t-label fu-foot2 fB" style="left:980px">about 36% by chance (top three)</div>' +
        '<div class="t-h1 fu-vq">Will they notice?</div>' +
        '<div class="t-label fu-vt">parity, not liking</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.fu-bignum, .cA, .fA, .fB, .fu-vcard, .fu-vq, .fu-vt, .dd-90, .fu-cha, .fu-chc, .dd-ok'), { autoAlpha: 0 });
      gsap.set(qa('.fu-vcard .rp'), { drawSVG: '0%' });
      gsap.set(qa('.bA, .b1, .b2'), { scaleX: 0, transformOrigin: '0% 50%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.fu-bet, .fu-ptitle, .fu-rlab, .fu-chance, .fu-div'), { at: .2, stagger: .05 });

      // [click 1] concept screening already works
      ctx.pause();
      tl.addLabel('a');
      tl.to(q('.bA'), { scaleX: 1, duration: .8, ease: 'power2.out' }, 'a');
      tl.to(q('.nA'), { autoAlpha: 1, duration: .3 }, 'a+=.5');
      Kit.count(tl, q('.nA'), { to: 90, suffix: '%', duration: .7, at: 'a+=.2' });
      Kit.show(tl, qa('.cA, .fA'), { at: 'a+=.6', y: 14, stagger: .08, duration: .45 });
      tl.to(q('.dd-90'), { autoAlpha: 1, duration: .01 }, 'a+=.9');
      Kit.draw(tl, qa('.dd-90 .rp'), { at: 'a+=.9', duration: .6 });

      // [click 2] ranking a favourite is near chance
      ctx.pause();
      tl.addLabel('b');
      tl.to(qa('.b1, .b2'), { scaleX: 1, duration: .8, ease: 'power2.out', stagger: .15 }, 'b');
      tl.to(qa('.n1, .n2'), { autoAlpha: 1, duration: .3, stagger: .15 }, 'b+=.5');
      Kit.count(tl, q('.n1'), { to: 33, suffix: '%', duration: .7, at: 'b+=.2' });
      Kit.count(tl, q('.n2'), { to: 67, suffix: '%', duration: .7, at: 'b+=.35' });
      tl.to(qa('.fu-chance'), { stroke: C.rustT, opacity: 1, duration: .4 }, 'b+=.8');
      Kit.show(tl, q('.fB'), { at: 'b+=.8', y: 14, duration: .45 });
      tl.to(q('.fu-cha'), { autoAlpha: 1, duration: .01 }, 'b+=1.1');
      Kit.draw(tl, qa('.fu-cha .rp'), { at: 'b+=1.1', duration: .4 });
      Kit.show(tl, q('.fu-chc'), { at: 'b+=1.1', y: 10, duration: .45 });

      // [click 3] the question that is worth selling
      ctx.pause();
      tl.addLabel('v');
      tl.to(q('.fu-vcard'), { autoAlpha: 1, duration: .01 }, 'v');
      tl.to(qa('.fu-vcard .rp'), { drawSVG: '100%', duration: .7, ease: 'power2.inOut' }, 'v');
      Kit.show(tl, qa('.fu-vq, .fu-vt'), { at: 'v+=.3', y: 20, stagger: .08, duration: .5 });
      tl.to(q('.dd-ok'), { autoAlpha: 1, duration: .01 }, 'v+=.8');
      Kit.draw(tl, qa('.dd-ok .rp'), { at: 'v+=.8', duration: .4 });
    },
    notes:
      'The second bet comes from a limit we met in Mix. Can a model taste? ' +
      '[click] For screening ideas, close enough. Ask a language model to answer a survey as a shopper, and it reaches ninety per cent of the reliability of the same human asked twice. ' +
      'That is one study, with a toothpaste maker. ' +
      '[click] For ranking, no. On twenty-one thousand real tastings it put the human favourite first a third of the time, and in its top three two thirds — about thirty-six per cent by chance. ' +
      '[click] So ask the narrower question: not what will they love, but will they notice we changed it. That has a right answer.'
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
          return '<g class="fu-card k' + i + '">' + Kit.rough.rect(d.x, 350, 540, 272, { seed: 51 + i * 4, w: 'fine', rough: 1.0, stroke: C.text3 }) + '</g>' +
            (d.cross ? '<g class="fu-x x' + i + '">' + Kit.rough.line(d.x + 28, 492, d.x + 28 + d.cross, 476,
              { seed: 71 + i, w: 'heavy', stroke: C.rustT, bow: .4, rough: .7 }) + '</g>' : '');
        }).join('') +
        '<g class="fu-work-b">' + Kit.rough.rect(120, 700, 1680, 250,
          { seed: 61, w: 'heavy', rough: 1.0, stroke: C.rust, hatch: 'var(--rust-t)', fillOpacity: .12, hachureGap: 30 }) + '</g>' +
      '</svg>';
      var cards = DEAD.map(function (d, i) {
        return '<div class="t-h2 fu-cname m' + i + '" style="left:' + (d.x + 36) + 'px;top:392px">' + d.name + '</div>' +
          '<div class="t-mono fu-cmoney m' + i + '" style="left:' + (d.x + 36) + 'px;top:452px">' + d.money + '</div>' +
          '<div class="t-label fu-cout m' + i + '" style="left:' + (d.x + 36) + 'px;top:540px">' + d.out + '</div>';
      }).join('');
      return '<div class="t-caps fu-sub">The one I would not start</div>' + svg + cards +
        '<div class="t-h2 fu-work">In food plants, the robots work.</div>' +
        '<div class="fu-chef"><b class="t-h1">$43.1M</b><span class="t-label">Chef Robotics Series A · 44M+ servings reported</span></div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.k1, .k2, .m1, .m2, .fu-x, .fu-work, .fu-chef, .fu-work-b'), { autoAlpha: 0 });
      gsap.set(qa('.fu-x .rp, .fu-work-b .rp'), { drawSVG: '0%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.fu-sub'), { at: .2 });
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
      tl.to(q('.fu-work-b'), { autoAlpha: 1, duration: .01 }, 'w');
      tl.to(qa('.fu-work-b .rp'), { drawSVG: '100%', duration: .7, ease: 'power2.inOut' }, 'w');
      Kit.show(tl, q('.fu-work'), { at: 'w+=.25', y: 20, duration: .5 });
      Kit.show(tl, q('.fu-chef'), { at: 'w+=.5', y: 20, duration: .5 });
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
  /* recap rows use the intro agenda's grammar: hatched number tile + a rule in the section tint */
  var SROW_Y = 300, SROW_STEP = 76, SRULE_X1 = 1180;
  function scy(i) { return SROW_Y + i * SROW_STEP + 28; }      // vertical centre of row i
  function sruleY(i) { return SROW_Y + i * SROW_STEP + 62; }

  var SUMMARY = {
    id: 'summary',
    title: 'Summary',
    heading: 'Summary',
    budgetSec: 45,
    html: function () {
      var svg = '<svg class="fu-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        SUM.map(function (r, i) {
          return '<g class="su-rule rl' + i + '">' +
            Kit.rough.line(120, sruleY(i), SRULE_X1, sruleY(i), { seed: 320 + i, w: 'normal', stroke: C[r.color + 'T'] }) + '</g>';
        }).join('') +
        SUM.map(function (r, i) {
          return '<g class="su-tile tl' + i + '">' +
            Kit.rough.rect(120, scy(i) - 26, 76, 52, { seed: 330 + i, w: 'normal', stroke: C[r.color + 'T'],
              hatch: C[r.color + 'T'], fillOpacity: .3, hachureGap: 12 }) +
            '<text class="mono" x="158" y="' + (scy(i) + 9) + '" text-anchor="middle" font-size="28" fill="' + C[r.color + 'T'] + '">' + r.num + '</text>' +
          '</g>';
        }).join('') +
        '<g class="dd-q">' + Kit.doodle.underline(128, 946, 980, { seed: 71, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
      '</svg>';
      var rows = SUM.map(function (r, i) {
        return '<div class="su-in i' + i + '" style="top:' + (scy(i) - 30) + 'px">' +
          '<span class="t-h2 su-k" style="color:' + C[r.color + 'T'] + '">' + r.k + '</span>' +
          '<span class="t-body dim su-t"><b style="font-weight:600;color:' + C[r.color + 'T'] + '">' + r.pre + '</b>' + r.rest + '</span>' +
        '</div>';
      }).join('');
      return '<div class="su-bg" style="background-image:url(' + IMG + 'close-table.jpg)"></div>' +
        '<div class="su-scrim"></div>' + svg + rows +
        '<div class="t-h2 su-line1">A model chose what\'s in it.</div>' +
        '<div class="t-h1 su-line2">Would you notice?</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.su-in, .su-tile'), { autoAlpha: 0 });
      gsap.set(qa('.su-rule'), { opacity: .2 });
      gsap.set(qa('.su-line1, .su-line2, .dd-q'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.su-bg'), { at: .2 });
      Kit.draw(tl, qa('.su-rule .rp'), { at: .25, duration: .6, stagger: .04 });

      SUM.forEach(function (r, i) {
        ctx.pause();
        var L = 'r' + i;
        tl.addLabel(L);
        tl.to(q('.rl' + i), { opacity: 1, duration: .4 }, L);
        tl.to(q('.tl' + i), { autoAlpha: 1, duration: .01 }, L);
        Kit.draw(tl, qa('.tl' + i + ' .rp'), { at: L, duration: .4 });
        tl.fromTo(q('.i' + i), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, L + '+=.1');
      });

      // [click 5] the question owns the frame: the recap recedes, the plate comes up
      ctx.pause();
      tl.addLabel('q');
      tl.to(qa('.su-in, .su-tile'), { opacity: .4, duration: .5 }, 'q');
      tl.to(qa('.su-rule'), { opacity: .3, duration: .5 }, 'q');
      tl.to(q('.su-bg'), { opacity: .62, duration: .9 }, 'q');
      Kit.show(tl, q('.su-line1'), { at: 'q+=.15', y: 24, duration: .5 });
      Kit.show(tl, q('.su-line2'), { at: 'q+=.45', y: 28, duration: .7 });
      tl.to(q('.dd-q'), { autoAlpha: 1, duration: .01 }, 'q+=1.1');
      Kit.draw(tl, qa('.dd-q .rp'), { at: 'q+=1.1', duration: .6 });
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
    opener: {
      id: 'opener', budgetSec: 10,
      notes:
        'Last section: Next. Food companies are being pushed to rewrite their recipes, and the techniques we have seen are about to matter much more.'
    },
    slides: [FORCES, ENGINE, PARITY, AVOID, SUMMARY]
  });
})();
