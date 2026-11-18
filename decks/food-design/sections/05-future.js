/* ==========================================================================
   05 · Next · Future   (budget 225 s) — the closing section.
   Spec: specs/future.md (v2, two directions). No roadmap and no crumbs:
   this section leads with the problem and points back at Giuseppe's loop
   and Samsung's hard filter, then closes the talk.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/future/';

  function svgOpen(cls) { return '<svg class="fu-svg ' + (cls || '') + '" width="1920" height="1080" viewBox="0 0 1920 1080">'; }

  /* ----------------------------------------------------------- QUESTION */
  var QTAG = [
    { x: 500, t: 'for one person' },
    { x: 1000, t: 'for a factory' }
  ];
  var QTW = 420, QTY = 790, QTH = 96;

  var QUESTION = {
    id: 'question',
    title: 'Two futures',
    budgetSec: 20,
    html: function () {
      var svg = svgOpen() +
        '<g class="dd-q">' + Kit.doodle.underline(548, 656, 824, { seed: 301, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
        QTAG.map(function (g, i) {
          return '<g class="fu-qt q' + i + '">' + Kit.rough.rect(g.x, QTY, QTW, QTH,
            { seed: 304 + i, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .22, hachureGap: 20 }) + '</g>';
        }).join('') +
      '</svg>';
      var labs = QTAG.map(function (g, i) {
        return '<div class="t-h2 fu-qtl l' + i + '" style="left:' + g.x + 'px;width:' + QTW + 'px">' + g.t + '</div>';
      }).join('');
      return svg +
        '<div class="t-h1 fu-q1">Change what’s in it.</div>' +
        '<div class="t-h1 fu-q2">Keep what people love.</div>' + labs;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.fu-q2, .dd-q, .fu-qt, .fu-qtl'), { autoAlpha: 0 });

      Kit.rise(tl, q('.fu-q1'), { at: .1, y: 26, duration: .7 });

      // [click 1] the half people forget
      ctx.pause();
      tl.addLabel('b');
      Kit.show(tl, q('.fu-q2'), { at: 'b', y: 26, duration: .6 });
      tl.to(q('.dd-q'), { autoAlpha: 1, duration: .01 }, 'b+=.6');
      Kit.draw(tl, qa('.dd-q .rp'), { at: 'b+=.6', duration: .6 });

      // [click 2] the two markets that open from it
      ctx.pause();
      tl.addLabel('t');
      QTAG.forEach(function (g, i) {
        var at = 't+=' + (i * .2);
        tl.to(q('.q' + i), { autoAlpha: 1, duration: .01 }, at);
        Kit.draw(tl, qa('.q' + i + ' .rp'), { at: at, duration: .5 });
        Kit.show(tl, q('.l' + i), { at: 't+=' + (i * .2 + .2), y: 14, duration: .45 });
      });
    },
    notes:
      'NotCo asked who else needs the engine. Here is the answer. Anyone who has to change a recipe ' +
      '[click] without losing the people who buy it. ' +
      '[click] That opens two markets. One person’s needs, or one factory’s supply. ' +
      'In both, AI helps decide which recipes are worth making and testing.'
  };

  /* ----------------------------------------------------------- PERSONAL */
  var KEEP = [
    { y: 320, t: 'cocoa aroma' },
    { y: 400, t: 'snap' },
    { y: 480, t: 'smooth melt' }
  ];

  var PERSONAL = {
    id: 'personal',
    title: 'Food for one person',
    heading: 'Food for one person',
    budgetSec: 45,
    html: function () {
      var keepArr = KEEP.map(function (k, i) {
        return '<g class="pe-ka ka' + i + '">' + Kit.rough.arrow(560, k.y + 10, 470, k.y + 24,
          { seed: 310 + i, w: 'fine', stroke: C.plumT, head: 14, bend: i === 1 ? 0 : (i ? 10 : -10) }) + '</g>';
      }).join('');
      var svg = svgOpen() +
        keepArr +
        '<g class="pe-card">' + Kit.rough.rect(140, 660, 580, 250,
          { seed: 316, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .18, hachureGap: 22 }) + '</g>' +
        '<g class="pe-rule">' + Kit.rough.line(1020, 512, 1520, 512, { seed: 317, w: 'fine', stroke: C.text3 }) + '</g>' +
        '<g class="dd-w">' + Kit.doodle.circle(1030, 610, 500, 160, { seed: 318, color: 'var(--rust-t)', w: 'heavy', rx: 302, ry: 76 }) + '</g>' +
        '<g class="pe-ca">' + Kit.rough.arrow(1252, 822, 1214, 776, { seed: 319, w: 'normal', stroke: C.rustT, head: 16, bend: -12 }) + '</g>' +
      '</svg>';
      var keeps = KEEP.map(function (k, i) {
        return '<div class="callout pe-k k' + i + '" style="top:' + (k.y - 14) + 'px">' + k.t + '</div>';
      }).join('');
      return svg +
        Kit.photo(IMG + 'cocoa-bar.webp', { x: 150, y: 300, w: 300, rot: -4, cls: 'pe-bar', alt: 'dark chocolate bar snapped in two' }) +
        keeps +
        '<div class="t-caps pe-ct">Care plan</div>' +
        '<div class="t-body pe-cl c1">carbs per serving</div>' +
        '<div class="t-body pe-cl c2">no peanuts</div>' +
        Kit.photo(IMG + 'dates.webp', { x: 1540, y: 290, w: 250, rot: 5, cls: 'pe-dates', alt: 'Medjool dates and date purée' }) +
        '<div class="t-caps pe-st">The swap</div>' +
        '<div class="t-mono pe-eq e1">− 10 g sugar</div>' +
        '<div class="t-mono pe-eq e2">+ 10 g date purée</div>' +
        '<div class="pe-res r1"><span class="t-body pe-rl">sugar</span>' +
          '<span class="t-mono pe-rv"><span class="v">0</span></span></div>' +
        '<div class="pe-res r2"><span class="t-body pe-rl">water</span>' +
          '<span class="t-mono pe-rv c-rust"><span class="v">0</span></span></div>' +
        '<div class="callout pe-c1">softer snap</div>' +
        '<div class="callout pe-c2">shorter shelf life</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.pe-k, .pe-ka, .pe-card, .pe-ct, .pe-cl, .pe-dates, .pe-st, .pe-eq, .pe-rule, .pe-res, .dd-w, .pe-ca, .pe-c1, .pe-c2'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.drop(tl, q('.pe-bar'), { at: .2 });
      KEEP.forEach(function (k, i) {
        tl.to(q('.ka' + i), { autoAlpha: 1, duration: .01 }, .6 + i * .18);
        Kit.draw(tl, qa('.ka' + i + ' .rp'), { at: .6 + i * .18, duration: .4 });
        Kit.show(tl, q('.k' + i), { at: .62 + i * .18, y: 10, duration: .4 });
      });

      // [click 1] the limits the care team sets
      ctx.pause();
      tl.addLabel('p');
      tl.to(q('.pe-card'), { autoAlpha: 1, duration: .01 }, 'p');
      Kit.draw(tl, qa('.pe-card .rp'), { at: 'p', duration: .6 });
      Kit.show(tl, qa('.pe-ct, .c1, .c2'), { at: 'p+=.25', y: 14, stagger: .1, duration: .45 });

      // [click 2] the swap that looks obvious
      ctx.pause();
      tl.addLabel('s');
      Kit.drop(tl, q('.pe-dates'), { at: 's' });
      Kit.show(tl, q('.pe-st'), { at: 's+=.2', y: 12, duration: .4 });
      Kit.show(tl, qa('.e1, .e2'), { at: 's+=.35', y: 16, stagger: .12, duration: .45 });

      // [click 3] what the swap really does
      ctx.pause();
      tl.addLabel('r');
      tl.to(q('.pe-rule'), { autoAlpha: 1, duration: .01 }, 'r');
      Kit.draw(tl, qa('.pe-rule .rp'), { at: 'r', duration: .4 });
      Kit.show(tl, q('.r1'), { at: 'r+=.15', y: 16, duration: .45 });
      Kit.count(tl, q('.r1 .v'), { to: 3.4, decimals: 1, prefix: '−', suffix: ' g', duration: .8, at: 'r+=.25' });
      Kit.show(tl, q('.r2'), { at: 'r+=.5', y: 16, duration: .45 });
      Kit.count(tl, q('.r2 .v'), { to: 2.1, decimals: 1, prefix: '+', suffix: ' g', duration: .8, at: 'r+=.6' });
      tl.to(q('.dd-w'), { autoAlpha: 1, duration: .01 }, 'r+=1.3');
      Kit.draw(tl, qa('.dd-w .rp'), { at: 'r+=1.3', duration: .7 });
      tl.to(q('.pe-ca'), { autoAlpha: 1, duration: .01 }, 'r+=1.7');
      Kit.draw(tl, qa('.pe-ca .rp'), { at: 'r+=1.7', duration: .4 });
      Kit.show(tl, qa('.pe-c1, .pe-c2'), { at: 'r+=1.8', y: 10, stagger: .15, duration: .45 });
    },
    notes:
      'A person picks a food they love and names what has to stay: the cocoa aroma, the snap, the smooth melt. ' +
      '[click] Their care team sets the limits. ' +
      '[click] Dates look like the obvious sugar swap. But dates are two-thirds sugar themselves. ' +
      'Per hundred grams, sixty-six and a half grams of sugars and twenty-one grams of water. ' +
      '[click] So ten grams of purée for ten grams of sugar removes only about three and a half grams of sugar, and adds two grams of water. ' +
      'That water softens the snap and shortens shelf life. One change, three problems. ' +
      'For diabetes the check is total carbohydrate against the plan, not “contains dates”.'
  };

  /* ------------------------------------------------------------- TAILOR */
  /* the loop echoes Giuseppe's steer loop; `check plan` is a hard filter, as on Samsung's rank */
  var LOOP = [
    { k: 'propose', x: 180, y: 360 },
    { k: 'check plan', x: 620, y: 360 },
    { k: 'taste', x: 620, y: 800 },
    { k: 'learn', x: 180, y: 800 }
  ];
  var LBW = 300, LBH = 100;
  /* the target sits in the middle of the loop: centre x 550, centre y 630 */
  var TGX = 400, TGY = 570, TGW = 300, TGH = 120;

  var TAILOR = {
    id: 'tailor',
    title: 'A loop aimed at one person',
    heading: 'A loop aimed at one person',
    budgetSec: 35,
    html: function () {
      var fl = { w: 'heavy', head: 24, rough: 1.0 };
      var svg = svgOpen() +
        LOOP.map(function (b, i) {
          return '<g class="ta-b b' + i + '">' + Kit.rough.rect(b.x, b.y, LBW, LBH, { seed: 330 + i, w: 'normal' }) + '</g>';
        }).join('') +
        '<g class="ta-ar">' +
          Kit.rough.arrow(490, 410, 614, 410, Object.assign({ seed: 336 }, fl)) +
          Kit.rough.arrow(770, 466, 770, 794, Object.assign({ seed: 337 }, fl)) +
          Kit.rough.arrow(614, 850, 490, 850, Object.assign({ seed: 338 }, fl)) +
          Kit.rough.arrow(330, 794, 330, 466, Object.assign({ seed: 339 }, fl)) +
        '</g>' +
        '<g class="ta-t">' + Kit.rough.rect(TGX, TGY, TGW, TGH,
          { seed: 340, w: 'heavy', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .28, hachureGap: 18 }) + '</g>' +
        // the target feeds the two steps that use it: propose and taste
        '<g class="ta-ta">' +
          Kit.rough.arrow(470, 564, 424, 472, { seed: 345, w: 'fine', stroke: C.plumT, head: 13, bend: -10 }) +
          Kit.rough.arrow(652, 696, 700, 790, { seed: 346, w: 'fine', stroke: C.plumT, head: 13, bend: -10 }) +
        '</g>' +
        // the hard filter: the same rust-heavy band Samsung's rank uses
        '<g class="ta-f">' + Kit.rough.rect(620, 360, LBW, LBH,
          { seed: 341, w: 'heavy', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .22, hachureGap: 16 }) + '</g>' +
        '<g class="ta-fa">' + Kit.rough.arrow(952, 312, 902, 350, { seed: 342, w: 'normal', stroke: C.rustT, head: 16, bend: 12 }) + '</g>' +
        '<g class="ta-card">' + Kit.rough.rect(1060, 330, 740, 190,
          { seed: 343, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .18, hachureGap: 22 }) + '</g>' +
        '<g class="dd-31">' + Kit.doodle.circle(1060, 604, 330, 150, { seed: 344, color: 'var(--rust-t)', w: 'heavy', rx: 196, ry: 92 }) + '</g>' +
      '</svg>';
      var boxes = LOOP.map(function (b, i) {
        return '<div class="t-body ta-n n' + i + '" style="left:' + b.x + 'px;top:' + (b.y + 30) + 'px;width:' + LBW + 'px">' + b.k + '</div>';
      }).join('');
      return svg + boxes +
        '<div class="t-h2 ta-tl">your bar</div>' +
        '<div class="callout ta-c1">like Giuseppe, aimed at you</div>' +
        '<div class="callout ta-c2">a rule, not a score</div>' +
        '<div class="t-caps ta-ft">First buyers</div>' +
        '<div class="t-h2 ta-fb">medically tailored meals</div>' +
        '<div class="ta-num"><div class="t-num c-rust"><span class="v">0</span></div>' +
          '<div class="t-body dim ta-nl">fewer hospital stays</div>' +
          '<div class="t-label faint ta-ns">Massachusetts Medicaid</div></div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ta-t, .ta-ta, .ta-tl, .ta-c1, .ta-f, .ta-fa, .ta-c2, .ta-card, .ta-ft, .ta-fb, .ta-num, .dd-31'), { autoAlpha: 0 });
      // the card opens as a labelled, still-empty slot at click 1; click 3 fills it

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.ta-b .rp'), { at: .25, duration: .7, stagger: .06 });
      Kit.fade(tl, qa('.ta-n'), { at: .5, stagger: .07 });
      Kit.draw(tl, qa('.ta-ar .rp'), { at: .7, duration: .5, stagger: .08 });

      // [click 1] the target in the middle, and where the deck already taught this
      ctx.pause();
      tl.addLabel('t');
      tl.to(q('.ta-t'), { autoAlpha: 1, duration: .01 }, 't');
      Kit.draw(tl, qa('.ta-t .rp'), { at: 't', duration: .55 });
      Kit.show(tl, q('.ta-tl'), { at: 't+=.25', y: 14, duration: .45 });
      tl.to(q('.ta-ta'), { autoAlpha: 1, duration: .01 }, 't+=.5');
      Kit.draw(tl, qa('.ta-ta .rp'), { at: 't+=.5', duration: .45, stagger: .1 });
      Kit.show(tl, q('.ta-c1'), { at: 't+=.8', y: 10, duration: .45 });
      // the buyer card's frame opens here so the right half is never dead
      tl.to(q('.ta-card'), { autoAlpha: 1, duration: .01 }, 't+=.9');
      Kit.draw(tl, qa('.ta-card .rp'), { at: 't+=.9', duration: .6 });
      Kit.show(tl, q('.ta-ft'), { at: 't+=1.1', y: 12, duration: .4 });

      // [click 2] the care plan is a filter, not a weight
      ctx.pause();
      tl.addLabel('f');
      tl.to(q('.ta-f'), { autoAlpha: 1, duration: .01 }, 'f');
      Kit.draw(tl, qa('.ta-f .rp'), { at: 'f', duration: .55 });
      tl.to(q('.n1'), { color: C.rustT, duration: .4 }, 'f+=.3');
      tl.to(q('.ta-fa'), { autoAlpha: 1, duration: .01 }, 'f+=.45');
      Kit.draw(tl, qa('.ta-fa .rp'), { at: 'f+=.45', duration: .4 });
      Kit.show(tl, q('.ta-c2'), { at: 'f+=.45', y: 10, duration: .45 });

      // [click 3] who pays for it first
      ctx.pause();
      tl.addLabel('m');
      Kit.show(tl, q('.ta-fb'), { at: 'm', y: 16, duration: .45 });
      Kit.show(tl, q('.ta-num'), { at: 'm+=.6', y: 18, duration: .5 });
      Kit.count(tl, q('.ta-num .v'), { to: 31, suffix: '%', duration: .9, at: 'm+=.7' });
      tl.to(q('.dd-31'), { autoAlpha: 1, duration: .01 }, 'm+=1.5');
      Kit.draw(tl, qa('.dd-31 .rp'), { at: 'm+=1.5', duration: .7 });
    },
    notes:
      'Same loop as Giuseppe, aimed at one person. ' +
      '[click] Their bar is the target, and every round proposes, tastes and learns. ' +
      '[click] The care plan is not a score. It is a filter, like Samsung’s allergy rule: a candidate that breaks it never appears. ' +
      'Bodies differ too, so this would learn per person. ' +
      '[click] Start where someone already pays. Massachusetts Medicaid members who got medically tailored meals had thirty-one percent fewer hospital stays. ' +
      'That funding is fragile. North Carolina suspended its programme last year.'
  };

  /* ------------------------------------------------------------- BACKUP */
  var ROLE = [
    { x: 200, y: 676, t: 'fat: snap + melt', ax: [628, 714, 782, 722] },
    { x: 200, y: 800, t: 'roasted aroma', ax: [628, 838, 782, 824] },
    { x: 1300, y: 676, t: 'colour + bitterness', ax: [1292, 714, 1138, 722] },
    { x: 1300, y: 800, t: 'coating flow', ax: [1292, 838, 1138, 824] }
  ];
  var RW = 420, RH = 76;

  var BACKUP = {
    id: 'backup',
    title: 'When an ingredient fails',
    heading: 'When an ingredient fails',
    budgetSec: 45,
    html: function () {
      var svg = svgOpen() +
        '<g class="bk-ax">' +
          Kit.rough.line(170, 600, 1800, 600, { seed: 350, w: 'fine', stroke: C.text3 }) +
          Kit.rough.line(170, 330, 170, 600, { seed: 351, w: 'fine', stroke: C.text3 }) +
        '</g>' +
        '<g class="bk-line">' + Kit.rough.curve([[200, 560], [400, 505], [580, 432], [760, 400], [940, 448], [1120, 512], [1300, 546], [1420, 550]],
          { seed: 352, w: 'heavy', stroke: C.plumT }) + '</g>' +
        '<g class="bk-eu">' + Kit.rough.line(1500, 340, 1500, 600, { seed: 353, w: 'normal', stroke: C.rustT }) + '</g>' +
        ROLE.map(function (r, i) {
          return '<g class="bk-chip c' + i + '">' + Kit.rough.rect(r.x, r.y, RW, RH,
            { seed: 356 + i, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .18, hachureGap: 18 }) + '</g>' +
            '<g class="bk-ca a' + i + '">' + Kit.rough.arrow(r.ax[0], r.ax[1], r.ax[2], r.ax[3],
              { seed: 362 + i, w: 'fine', stroke: C.plumT, head: 14, bend: i % 2 ? -10 : 10 }) + '</g>';
        }).join('') +
        '<g class="dd-jobs">' + Kit.doodle.underline(700, 1000, 520, { seed: 368, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
      '</svg>';
      var chips = ROLE.map(function (r, i) {
        return '<div class="t-body bk-ct t' + i + '" style="left:' + r.x + 'px;top:' + (r.y + 18) + 'px;width:' + RW + 'px">' + r.t + '</div>';
      }).join('');
      return svg + chips +
        '<div class="t-caps bk-k">Cocoa price</div>' +
        '<div class="t-mono bk-peak">$12,000+ / t</div>' +
        '<div class="t-label faint bk-peakl">December 2024</div>' +
        '<div class="t-mono bk-fall">~70%</div>' +
        '<div class="callout bk-both">both ways, fast</div>' +
        '<div class="t-caps bk-eul">EU forest rule</div>' +
        '<div class="t-label bk-eud">30 Dec 2026</div>' +
        Kit.photo(IMG + 'biscuit.webp', { x: 790, y: 636, w: 340, rot: -3, cls: 'bk-bis', alt: 'chocolate-coated biscuit with a bite taken out' }) +
        '<div class="t-h2 bk-jobs">cocoa does four jobs</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.bk-line, .bk-peak, .bk-peakl, .bk-fall, .bk-both, .bk-eu, .bk-eul, .bk-eud, .bk-chip, .bk-ca, .bk-ct, .bk-bis, .bk-jobs, .dd-jobs'), { autoAlpha: 0 });
      gsap.set(qa('.bk-line .rp, .bk-eu .rp'), { drawSVG: '0%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.bk-k'), { at: .2 });
      Kit.draw(tl, qa('.bk-ax .rp'), { at: .3, duration: .7 });

      // [click 1] the price goes up, then down, just as fast
      ctx.pause();
      tl.addLabel('p');
      tl.to(q('.bk-line'), { autoAlpha: 1, duration: .01 }, 'p');
      tl.to(qa('.bk-line .rp'), { drawSVG: '100%', duration: 1.4, ease: 'power1.inOut' }, 'p');
      Kit.show(tl, qa('.bk-peak, .bk-peakl'), { at: 'p+=.6', y: 12, stagger: .1, duration: .45 });
      Kit.show(tl, q('.bk-fall'), { at: 'p+=1.2', y: 12, duration: .45 });
      Kit.show(tl, q('.bk-both'), { at: 'p+=1.4', y: 10, duration: .45 });

      // [click 2] the date the rule lands
      ctx.pause();
      tl.addLabel('e');
      tl.to(q('.bk-eu'), { autoAlpha: 1, duration: .01 }, 'e');
      tl.to(qa('.bk-eu .rp'), { drawSVG: '100%', duration: .5 }, 'e');
      Kit.show(tl, qa('.bk-eul, .bk-eud'), { at: 'e+=.2', y: 14, stagger: .1, duration: .45 });

      // [click 3] one ingredient, four jobs
      ctx.pause();
      tl.addLabel('r');
      Kit.drop(tl, q('.bk-bis'), { at: 'r' });
      ROLE.forEach(function (x, i) {
        var at = 'r+=' + (.4 + i * .22);
        tl.to(q('.c' + i), { autoAlpha: 1, duration: .01 }, at);
        Kit.draw(tl, qa('.c' + i + ' .rp'), { at: at, duration: .4 });
        Kit.show(tl, q('.t' + i), { at: at, y: 10, duration: .4 });
        tl.to(q('.a' + i), { autoAlpha: 1, duration: .01 }, at + '+=.15');
        Kit.draw(tl, qa('.a' + i + ' .rp'), { at: at + '+=.15', duration: .35 });
      });
      Kit.show(tl, q('.bk-jobs'), { at: 'r+=1.5', y: 16, duration: .5 });
      tl.to(q('.dd-jobs'), { autoAlpha: 1, duration: .01 }, 'r+=1.9');
      Kit.draw(tl, qa('.dd-jobs .rp'), { at: 'r+=1.9', duration: .5 });
    },
    notes:
      'Now the factory. ' +
      '[click] Cocoa futures topped twelve thousand dollars a tonne in December 2024, then fell about seventy percent. ' +
      'A manufacturer has to move both ways, and fast. ' +
      '[click] And from the end of December 2026, the EU deforestation rule applies to large and medium companies. ' +
      'Cocoa farming has been linked to forest loss in Côte d’Ivoire and Ghana. ' +
      '[click] But you cannot just swap cocoa out. In a coating it does four jobs: it sets the snap and the melt, it gives the roasted aroma, ' +
      'it sets colour and bitterness, and it changes how the coating flows on the line. A substitute has to pass all four.'
  };

  /* ------------------------------------------------------------ LIBRARY */
  var CHECKS = ['taste', 'shelf life', 'line', 'label'];
  var CKX = [180, 316, 516, 632];
  var CARDY = [320, 490, 660];
  var CDW = 620, CDH = 150;
  var CARDN = ['Coating A', 'Filling B', 'Colour C'];
  /* land per tonne of oil: palm short, the alternative more than twice as long (illustrative of the >2x ratio) */
  var LANDX = 1040, LANDY = [524, 650], LANDW = [240, 560];

  var LIBRARY = {
    id: 'library',
    title: 'Backups before the shock',
    heading: 'Backups before the shock',
    budgetSec: 35,
    html: function () {
      var cards = CARDY.map(function (y, i) {
        return '<g class="lb-card d' + i + '">' + Kit.rough.rect(140, y, CDW, CDH,
          { seed: 370 + i, w: i ? 'fine' : 'normal', stroke: i ? C.text3 : C.chalk }) + '</g>' +
          CHECKS.map(function (c, j) {
            return '<text class="lb-cl" x="' + CKX[j] + '" y="' + (y + 134) + '" font-size="24">' + c + '</text>' +
              '<g class="lb-ck m' + i + '_' + j + '">' + Kit.doodle.mark(CKX[j] + 24, y + 92, 24, 'check',
                { seed: 380 + i * 4 + j, color: 'var(--sec-t)' }) + '</g>';
          }).join('');
      }).join('');
      var bars = LANDY.map(function (y, i) {
        return '<g class="lb-bar lb' + i + '">' + Kit.rough.rect(LANDX, y, LANDW[i], 50,
          { seed: 394 + i, w: 'normal', stroke: i ? C.rustT : C.plumT, hatch: i ? 'var(--rust-t)' : 'var(--sec-t)', fillOpacity: .3, hachureGap: 14 }) + '</g>';
      }).join('');
      var svg = svgOpen() + cards +
        '<g class="lb-tag">' + Kit.rough.rect(140, 836, 560, 120,
          { seed: 390, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .2, hachureGap: 20 }) + '</g>' +
        bars +
        '<g class="dd-keep">' + Kit.doodle.underline(1044, 856, 580, { seed: 396, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
      '</svg>';
      var names = CARDY.map(function (y, i) {
        return '<div class="t-body lb-n d' + i + '" style="top:' + (y + 16) + 'px">' + CARDN[i] + '</div>';
      }).join('');
      return svg + names +
        '<div class="t-caps lb-k">Backup library</div>' +
        '<div class="callout lb-c1">tested before it’s needed</div>' +
        '<div class="t-body lb-tn">ChoViva · sunflower seeds</div>' +
        '<div class="t-label dim lb-ts">Nestlé Germany, April 2026</div>' +
        Kit.photo(IMG + 'sunflower.webp', { x: 726, y: 826, w: 150, rot: 6, cls: 'lb-sun', alt: 'roasted sunflower seeds' }) +
        '<div class="t-caps lb-lk">Land for the same oil</div>' +
        '<div class="t-body lb-bl b0">oil palm</div>' +
        '<div class="t-body lb-bl b1">soy or rapeseed</div>' +
        '<div class="t-hand lb-ans">keep palm, change the source</div>' +
        Kit.photo(IMG + 'palm.webp', { x: 1540, y: 300, w: 250, rot: -5, cls: 'lb-palm', alt: 'oil palm fruit' });
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.lb-ck, .lb-c1, .lb-tag, .lb-tn, .lb-ts, .lb-sun, .lb-lk, .lb-bar, .lb-bl, .lb-palm, .lb-ans, .dd-keep'), { autoAlpha: 0 });
      gsap.set(qa('.lb-bar'), { scaleX: 0, transformOrigin: LANDX + 'px 50%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.lb-k'), { at: .2 });
      Kit.draw(tl, qa('.lb-card .rp'), { at: .3, duration: .6, stagger: .12 });
      Kit.fade(tl, qa('.lb-n, .lb-cl'), { at: .6, stagger: .03 });

      // [click 1] one formula earns its place, check by check
      ctx.pause();
      tl.addLabel('c');
      CHECKS.forEach(function (c, j) {
        var at = 'c+=' + (j * .3);
        tl.to(q('.m0_' + j), { autoAlpha: 1, duration: .01 }, at);
        Kit.draw(tl, qa('.m0_' + j + ' .rp'), { at: at, duration: .3 });
      });
      Kit.show(tl, q('.lb-c1'), { at: 'c+=1.1', y: 10, duration: .45 });

      // [click 2] it already sells
      ctx.pause();
      tl.addLabel('v');
      tl.to(q('.lb-tag'), { autoAlpha: 1, duration: .01 }, 'v');
      Kit.draw(tl, qa('.lb-tag .rp'), { at: 'v', duration: .5 });
      Kit.show(tl, qa('.lb-tn, .lb-ts'), { at: 'v+=.2', y: 14, stagger: .1, duration: .45 });
      Kit.drop(tl, q('.lb-sun'), { at: 'v+=.3' });

      // [click 3] the answer the search has to be allowed to give
      ctx.pause();
      tl.addLabel('l');
      Kit.drop(tl, q('.lb-palm'), { at: 'l' });
      Kit.show(tl, q('.lb-lk'), { at: 'l+=.15', y: 12, duration: .4 });
      LANDY.forEach(function (y, i) {
        tl.to(q('.lb' + i), { autoAlpha: 1, duration: .01 }, 'l+=' + (.3 + i * .25));
        tl.to(q('.lb' + i), { scaleX: 1, duration: .7, ease: 'power2.out' }, 'l+=' + (.3 + i * .25));
        Kit.show(tl, q('.b' + i), { at: 'l+=' + (.3 + i * .25), y: 10, duration: .4 });
      });
      Kit.show(tl, q('.lb-ans'), { at: 'l+=1.3', y: 14, duration: .5 });
      tl.to(q('.dd-keep'), { autoAlpha: 1, duration: .01 }, 'l+=1.7');
      Kit.draw(tl, qa('.dd-keep .rp'), { at: 'l+=1.7', duration: .5 });
    },
    notes:
      'The same search, role by role. ' +
      '[click] The best few get tested early, and a formula enters the library only after tasting, shelf-life, line and label checks. ' +
      '[click] This already sells. Planet A Foods raised thirty million dollars for its sunflower-seed cocoa, and Nestlé Germany launched a line with it in April. ' +
      '[click] Oil palm gives more than twice the oil per hectare of soy or rapeseed, so swapping it out can use more land. ' +
      'And making palm deforestation-free would cut its emissions by ninety-two percent. ' +
      'So the software has to be allowed to say: keep palm, change the source.'
  };

  /* ------------------------------------------------------------ SUMMARY */
  var SUM = [
    { num: '01', k: 'Cook', color: 'teal', pre: 'a kitchen', rest: ' becomes a graph' },
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
      var svg = svgOpen() +
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
        '<div class="t-h2 su-line1">A model chose what’s in it.</div>' +
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
      'Four sections, all doing the same thing. ' +
      '[click] Cook: a kitchen became a graph. ' +
      '[click] Find: a protein became a vector, a list of numbers you can search. ' +
      '[click] Mix: a whole recipe became a point on a map. ' +
      '[click] And Sell: the engine was worth more than the milk. ' +
      'Each step made food more abstract, which is what let a machine search it. ' +
      'None of it removes the cook: the camera cannot see salt, the protein search only finds what is near something that works, ' +
      'and every swap still needs a human tasting. ' +
      '[click] Both futures end the same way, with something people choose again. A model chose what is in it. Would you notice?'
  };

  Deck.section({
    id: 'future', order: 5, num: '05', kicker: 'Next', title: 'Future', color: 'plum',
    toss: 'assets/img/future/cocoa-bar.webp',
    opener: {
      id: 'opener', budgetSec: 10,
      notes:
        'Last section: Next. Two futures for this work. Food fitted to one person, and formulas that survive a supply shock.'
    },
    slides: [QUESTION, PERSONAL, TAILOR, BACKUP, LIBRARY, SUMMARY]
  });
})();
