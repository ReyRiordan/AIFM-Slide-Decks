/* ==========================================================================
   05 · Next · Future   (budget 225 s) — the closing section.
   Spec: specs/future.md (v3). Each direction gets a problem slide and a
   technique slide built like Samsung's `system`: a pipeline of named parts,
   each with what it predicts or decides and one piece of evidence.
   No roadmap and no crumbs. No source text on slides (caveats live in notes).
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/future/';

  function svgOpen(cls) { return '<svg class="fu-svg ' + (cls || '') + '" width="1920" height="1080" viewBox="0 0 1920 1080">'; }

  /** SVG <text>. o: {size, fill, anchor, cls, weight, ls} */
  function tx(x, y, s, o) {
    o = o || {};
    return '<text class="' + (o.cls || '') + '" x="' + x + '" y="' + y + '" font-size="' + (o.size || 28) +
      '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.fill ? ' fill="' + o.fill + '"' : '') + ' font-weight="' + (o.weight || 600) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + '>' + Kit.esc(s) + '</text>';
  }
  /** Absolutely positioned block. */
  function div(cls, x, y, w, inner, extra) {
    return '<div class="' + cls + '" style="left:' + x + 'px;top:' + y + 'px;' + (w ? 'width:' + w + 'px;' : '') +
      (extra || '') + '">' + inner + '</div>';
  }

  /* ---- the shared pipeline grammar used by `tailor` and `library` ----------
     Four hatched boxes left to right. Each holds a plain technique name, the
     model family under it, what it predicts or decides, and (click 2) one
     measured result. Geometry is identical on both slides so the second
     pipeline reads as the same shape applied to a different problem.        */
  var PX = [140, 565, 990, 1415], PW = 360, PY = 276, PH = 420;
  var PIN = PW - 52;                                  // inner text width

  function pipeFrames(pfx, n, seed) {
    var out = '';
    for (var i = 0; i < n; i++) {
      out += '<g class="' + pfx + '-f f' + i + '">' + Kit.rough.rect(PX[i], PY, PW, PH,
        { seed: seed + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .14, hachureGap: 24 }) + '</g>';
      if (i < n - 1) {
        out += '<g class="' + pfx + '-a a' + i + '">' + Kit.rough.arrow(PX[i] + PW + 6, PY + 220, PX[i + 1] - 6, PY + 220,
          { seed: seed + 20 + i, w: 'heavy', head: 20 }) + '</g>';
      }
    }
    return out;
  }
  function pipeText(parts) {
    return parts.map(function (p, i) {
      return div('t-h2 fu-pt p' + i, PX[i] + 26, PY + 24, PIN, p.t) +
        div('t-label dim fu-pf p' + i, PX[i] + 26, PY + 142, PIN, p.m) +
        div('t-label fu-pd d' + i, PX[i] + 26, PY + 218, PIN, p.d) +
        (p.e ? div('t-label fu-pe e' + i, PX[i] + 26, PY + 300, PIN, p.e) : '');
    }).join('');
  }
  function pipeBuild(ctx, pfx, parts) {
    var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
    Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
    tl.to(qa('.' + pfx + '-f'), { autoAlpha: 1, duration: .01, stagger: .14 }, .2);
    Kit.draw(tl, qa('.' + pfx + '-f .rp'), { at: .2, duration: .5, stagger: .14 });
    Kit.show(tl, qa('.fu-pt'), { at: .35, y: 14, stagger: .14, duration: .45 });
    Kit.show(tl, qa('.fu-pf'), { at: .5, y: 10, stagger: .14, duration: .4 });
    tl.to(qa('.' + pfx + '-a'), { autoAlpha: 1, duration: .01, stagger: .12 }, 1.0);
    Kit.draw(tl, qa('.' + pfx + '-a .rp'), { at: 1.0, duration: .35, stagger: .12 });

    // [click 1] what each part predicts or decides
    ctx.pause();
    tl.addLabel('d');
    Kit.show(tl, qa('.fu-pd'), { at: 'd', y: 12, stagger: .14, duration: .45 });

    // [click 2] the parts that are already measured. The rust evidence text is
    // the only rust on the box: rust strokes are reserved for the deciding rule
    // (`tailor`'s care-plan band) and the answer (`library`'s keep-palm point).
    ctx.pause();
    tl.addLabel('e');
    Kit.show(tl, qa('.fu-pe'), { at: 'e', y: 12, stagger: .2, duration: .5 });
  }

  /* ----------------------------------------------------------- QUESTION
     The section's roadmap: one bar, two branches, and the technique chips
     that name the boxes on `tailor` and `library` (they work like crumbs). */
  var BRANCH = [
    { x: 150, t: 'for one person', s: 'a care plan forces the change',
      chips: ['taste model', 'blood-sugar model', 'search loop'] },
    { x: 1230, t: 'for a factory', s: 'a price shock forces the change',
      chips: ['price forecast', 'smell model', 'pass/fail predictor'] }
  ];
  var BRW = 540, BRY = 620, BRH = 320, CHW = 400, CHH = 58, CHY = [734, 798, 862];

  var QUESTION = {
    id: 'question',
    title: 'Two futures',
    budgetSec: 15,
    html: function () {
      var svg = svgOpen() +
        '<g class="dd-q">' + Kit.doodle.underline(668, 430, 584, { seed: 301, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
        '<g class="fu-br b0">' + Kit.rough.arrow(940, 470, 520, 598, { seed: 302, w: 'heavy', head: 22, bend: 16 }) + '</g>' +
        '<g class="fu-br b1">' + Kit.rough.arrow(980, 470, 1400, 598, { seed: 303, w: 'heavy', head: 22, bend: -16 }) + '</g>' +
        BRANCH.map(function (g, i) {
          return '<g class="fu-bp b' + i + '">' + Kit.rough.rect(g.x, BRY, BRW, BRH,
            { seed: 304 + i, w: 'normal', stroke: C.plumT, hatch: 'var(--sec-t)', fillOpacity: .16, hachureGap: 24 }) + '</g>' +
            g.chips.map(function (c, j) {
              return '<g class="fu-cf b' + i + ' c' + i + '_' + j + '">' + Kit.rough.rect(g.x + 34, CHY[j], CHW, CHH,
                { seed: 310 + i * 3 + j, w: 'fine', stroke: C.chalk, overshoot: 5 }) + '</g>';
            }).join('');
        }).join('') +
      '</svg>';
      var cols = BRANCH.map(function (g, i) {
        return div('t-h2 fu-bt b' + i, g.x + 34, BRY + 6, BRW - 68, g.t) +
          div('t-label dim fu-bs b' + i, g.x + 34, BRY + 68, BRW - 68, g.s) +
          g.chips.map(function (c, j) {
            return div('t-body fu-ch c' + i + '_' + j, g.x + 60, CHY[j] + 10, CHW - 52, c);
          }).join('');
      }).join('');
      return svg +
        '<div class="t-h1 fu-q1">Change the recipe.</div>' +
        '<div class="t-h1 fu-q2">Keep the taste.</div>' +
        Kit.photo(IMG + 'cocoa-bar.webp', { x: 760, y: 630, w: 400, rot: -4, cls: 'fu-bar', alt: 'dark chocolate bar snapped in two' }) +
        cols;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.dd-q, .fu-br, .fu-bp, .fu-cf, .fu-bt, .fu-bs, .fu-ch'), { autoAlpha: 0 });

      Kit.rise(tl, q('.fu-q1'), { at: .1, y: 24, duration: .6 });
      Kit.rise(tl, q('.fu-q2'), { at: .4, y: 24, duration: .6 });
      tl.to(q('.dd-q'), { autoAlpha: 1, duration: .01 }, .9);
      Kit.draw(tl, qa('.dd-q .rp'), { at: .9, duration: .55 });
      Kit.drop(tl, q('.fu-bar'), { at: 1.1 });

      BRANCH.forEach(function (g, i) {
        // [click] one branch, with the techniques its slide will name
        ctx.pause();
        var L = 'b' + i;
        tl.addLabel(L);
        tl.to(q('.fu-br.b' + i), { autoAlpha: 1, duration: .01 }, L);
        Kit.draw(tl, qa('.fu-br.b' + i + ' .rp'), { at: L, duration: .45 });
        tl.to(q('.fu-bp.b' + i), { autoAlpha: 1, duration: .01 }, L + '+=.3');
        Kit.draw(tl, qa('.fu-bp.b' + i + ' .rp'), { at: L + '+=.3', duration: .55 });
        Kit.show(tl, qa('.fu-bt.b' + i + ', .fu-bs.b' + i), { at: L + '+=.5', y: 14, stagger: .1, duration: .4 });
        g.chips.forEach(function (c, j) {
          var at = L + '+=' + (.8 + j * .18);
          tl.to(q('.c' + i + '_' + j + '.fu-cf'), { autoAlpha: 1, duration: .01 }, at);
          Kit.draw(tl, qa('.c' + i + '_' + j + '.fu-cf .rp'), { at: at, duration: .3 });
          Kit.show(tl, q('.fu-ch.c' + i + '_' + j), { at: at, y: 8, duration: .35 });
        });
      });
    },
    notes:
      'NotCo asked who else needs the engine. Two answers. ' +
      '[click] One person, where a care plan forces the change. ' +
      '[click] One factory, where a price shock does. ' +
      'Each box names the models. The next slide in each pair shows them working.'
  };

  /* ----------------------------------------------------------- PERSONAL */
  var KEEP = [
    { y: 320, t: 'cocoa aroma' },
    { y: 400, t: 'snap' },
    { y: 480, t: 'smooth melt' }
  ];

  var PERSONAL = {
    id: 'personal',
    title: 'Personalized food',
    heading: 'Personalized food',
    budgetSec: 35,
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
      'A person picks a food they love and names what has to stay: the cocoa aroma, the snap, the melt. ' +
      '[click] Their care team sets the limits. ' +
      '[click] Dates look like the obvious sugar swap. But dates are two-thirds sugar themselves, and a fifth water. ' +
      '[click] So ten grams of purée for ten grams of sugar cuts only three and a half grams of sugar, and adds two grams of water. ' +
      'That softens the snap and shortens shelf life. One change, three problems.'
  };

  /* ------------------------------------------------------------- TAILOR
     Four named techniques, left to right. The care plan sits under the two
     parts that decide, as a rust hard filter (Samsung's allergy rule), and
     every rating goes back into the taste model.                          */
  var TPARTS = [
    { t: 'Taste<br>model', m: 'one model for everyone, tuned to you', d: 'how close this tastes to your bar' },
    { t: 'Blood-sugar<br>model', m: 'regression', d: 'your glucose response to a recipe', e: '800 people · 46,898 meals' },
    { t: 'Search<br>loop', m: 'Bayesian optimization', d: 'which recipe to make and taste next', e: '+29% taste score in 10 rounds' },
    { t: 'Variant<br>picker', m: 'contextual bandit', d: 'which safe variant to send you next' }
  ];

  var TAILOR = {
    id: 'tailor',
    title: 'How AI could personalize food',
    heading: 'How AI could personalize food',
    budgetSec: 50,
    html: function () {
      var svg = svgOpen() +
        pipeFrames('ta', 4, 400) +
        '<g class="ta-band">' + Kit.rough.rect(990, 736, 640, 100,
          { seed: 430, w: 'heavy', stroke: C.rustT, hatch: 'var(--rust-t)', fillOpacity: .22, hachureGap: 16 }) + '</g>' +
        '<g class="ta-ba">' +
          Kit.rough.arrow(1170, 732, 1170, 702, { seed: 431, w: 'normal', stroke: C.rustT, head: 16 }) +
          Kit.rough.arrow(1560, 732, 1595, 702, { seed: 432, w: 'normal', stroke: C.rustT, head: 16, bend: 8 }) +
        '</g>' +
        '<g class="ta-ca">' + Kit.rough.arrow(962, 778, 1004, 784, { seed: 433, w: 'fine', stroke: C.rustT, head: 13, bend: -8 }) + '</g>' +
        '<g class="ta-fb">' +
          Kit.rough.linear([[1700, 702], [1700, 940], [330, 940], [330, 772]], { seed: 434, w: 'normal', stroke: C.plumT }) +
          Kit.rough.arrow(330, 778, 330, 706, { seed: 435, w: 'normal', stroke: C.plumT, head: 18 }) +
        '</g>' +
      '</svg>';
      return svg + pipeText(TPARTS) +
        div('t-body fu-bandt', 990, 752, 640, 'Care plan · hard filter') +
        div('t-label fu-bands', 990, 798, 640, 'every candidate already passes') +
        div('callout ta-c1', 640, 744, 320, 'a rule, not a score') +
        div('callout ta-c2', 660, 876, 440, 'your ratings + reorders');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ta-f, .ta-a, .fu-pt, .fu-pf, .fu-pd, .fu-pe, .ta-band, .ta-ba, .ta-ca, .ta-c1, .ta-c2, .ta-fb, .fu-bandt, .fu-bands'), { autoAlpha: 0 });

      pipeBuild(ctx, 'ta', TPARTS);

      // [click 3] the care plan is a filter, not a weight
      ctx.pause();
      tl.addLabel('f');
      tl.to(q('.ta-band'), { autoAlpha: 1, duration: .01 }, 'f');
      Kit.draw(tl, qa('.ta-band .rp'), { at: 'f', duration: .6 });
      Kit.show(tl, qa('.fu-bandt, .fu-bands'), { at: 'f+=.3', y: 12, stagger: .1, duration: .45 });
      tl.to(q('.ta-ba'), { autoAlpha: 1, duration: .01 }, 'f+=.6');
      Kit.draw(tl, qa('.ta-ba .rp'), { at: 'f+=.6', duration: .4, stagger: .12 });
      tl.to(q('.ta-ca'), { autoAlpha: 1, duration: .01 }, 'f+=.8');
      Kit.draw(tl, qa('.ta-ca .rp'), { at: 'f+=.8', duration: .3 });
      Kit.show(tl, q('.ta-c1'), { at: 'f+=.8', y: 10, duration: .45 });

      // [click 4] every tasting comes back round
      ctx.pause();
      tl.addLabel('b');
      tl.to(q('.ta-fb'), { autoAlpha: 1, duration: .01 }, 'b');
      Kit.draw(tl, qa('.ta-fb .rp'), { at: 'b', duration: 1.1, stagger: .1 });
      Kit.show(tl, q('.ta-c2'), { at: 'b+=.7', y: 10, duration: .45 });
    },
    notes:
      'Here is the AI behind it. Four parts. ' +
      '[click] A taste model predicts how close a candidate is to your bar: one hierarchical model, everyone’s taste plus your own offsets. ' +
      'A blood-sugar model predicts your glucose response. ' +
      'A search loop picks what to make and taste next. A bandit picks which variant you get. ' +
      '[click] Two of these are proven. Zeevi’s team trained on eight hundred people and forty-seven thousand meals, and predicted each person’s glucose. ' +
      'And Bayesian optimization lifted a plant-based yogurt’s sensory score twenty-nine percent in ten rounds. ' +
      '[click] The care plan is a hard filter, not a score, like Samsung’s allergy rule. ' +
      '[click] Your ratings and reorders go back in. First buyers: medically tailored meals, where Massachusetts Medicaid saw thirty-one percent fewer hospital stays.'
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
    title: 'Supply shocks',
    heading: 'Supply shocks',
    budgetSec: 35,
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
        '<div class="callout bk-both">prices swing</div>' +
        '<div class="t-caps bk-eul">EU forest law</div>' +
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
      '[click] Cocoa topped twelve thousand dollars a tonne in December 2024, then fell about seventy percent. ' +
      'A manufacturer has to move both ways, fast. ' +
      '[click] And from the end of December 2026, the EU forest law applies to large and medium companies. ' +
      '[click] But you cannot just swap cocoa out. In a coating it does four jobs: the snap and melt, the roasted aroma, ' +
      'colour and bitterness, and how the coating flows on the line. A substitute has to pass all four.'
  };

  /* ------------------------------------------------------------ LIBRARY
     The same pipeline shape, aimed at a supply shock. What comes out is a
     trade-off chart, not a winner: one point says keep the ingredient and
     change where it is bought.                                            */
  var LPARTS = [
    { t: 'Price<br>forecast', m: 'quantile forecast', d: 'the chance a price spikes', e: 'cocoa arrivals<br>55,317 t vs 107,139 t' },
    { t: 'Smell<br>model', m: 'graph neural network', d: 'does the substitute smell right', e: 'matched trained tasters on 400 new molecules' },
    { t: 'Search<br>loop', m: 'Bayesian optimization', d: 'which blend and roast to try next' },
    { t: 'Pass/fail<br>predictor', m: 'classifiers', d: 'which candidates pass the lab tests' }
  ];
  /* candidates: x = sensory distance from today's coating, y = forest risk (both: lower is better).
     FRONT is the trade-off curve; DOM are candidates another candidate already beats on both axes. */
  var FRONT = [[690, 770], [880, 810], [1040, 838], [1190, 866]];
  var DOM = [[810, 756], [980, 778], [1128, 814]];

  var LIBRARY = {
    id: 'library',
    title: 'How AI could build backups',
    heading: 'How AI could build backups',
    budgetSec: 50,
    html: function () {
      var svg = svgOpen() +
        pipeFrames('lb', 4, 450) +
        '<g class="lb-out">' + Kit.rough.arrow(1595, 706, 1595, 748, { seed: 480, w: 'heavy', head: 22 }) + '</g>' +
        '<g class="lb-ax">' +
          Kit.rough.line(520, 752, 520, 990, { seed: 481, w: 'fine', stroke: C.text3 }) +
          Kit.rough.line(520, 990, 1300, 990, { seed: 482, w: 'fine', stroke: C.text3 }) +
          tx(522, 736, 'forest risk · lower is better', { size: 24, fill: C.text3, ls: '.1em', cls: 'caps' }) +
          tx(1300, 1022, 'sensory distance · lower is better', { size: 24, fill: C.text3, ls: '.1em', anchor: 'end', cls: 'caps' }) +
        '</g>' +
        DOM.map(function (p, i) {
          return '<g class="lb-dim dt' + i + '">' + Kit.rough.circle(p[0], p[1], 20,
            { seed: 484 + i, w: 'fine', stroke: C.text3, fill: C.text3, fillStyle: 'solid', sketch: false }) + '</g>';
        }).join('') +
        '<g class="lb-dim dtl">' + tx(1165, 824, 'beaten on both', { size: 24, fill: C.text3 }) + '</g>' +
        '<g class="lb-front">' + Kit.rough.curve(FRONT, { seed: 492, w: 'normal', stroke: C.plumT }) + '</g>' +
        FRONT.map(function (p, i) {
          return '<g class="lb-dot dp' + i + '">' + Kit.rough.circle(p[0], p[1], 28,
            { seed: 488 + i, w: 'normal', stroke: C.plumT, fill: C.plumT, fillStyle: 'solid', sketch: false }) + '</g>';
        }).join('') +
        '<g class="lb-keep">' +
          Kit.rough.arrow(690, 790, 690, 912, { seed: 493, w: 'heavy', stroke: C.rustT, head: 18 }) +
          Kit.rough.circle(690, 930, 32, { seed: 494, w: 'normal', stroke: C.rustT, fill: C.rustT, fillStyle: 'solid', sketch: false }) +
        '</g>' +
        '<g class="lb-pa">' + Kit.rough.arrow(292, 884, 262, 860, { seed: 495, w: 'fine', stroke: C.rustT, head: 13, bend: 8 }) + '</g>' +
      '</svg>';
      return svg + pipeText(LPARTS) +
        div('t-caps lb-k', 1360, 756, 440, 'What comes out') +
        div('t-h2 lb-h', 1360, 792, 440, 'A trade-off, not a winner') +
        div('t-label dim lb-s', 1360, 912, 440, 'taste · cost · land · forest risk') +
        Kit.photo(IMG + 'palm.webp', { x: 155, y: 740, w: 150, rot: -5, cls: 'lb-palm', alt: 'oil palm fruit' }) +
        div('callout lb-c1', 130, 884, 380, 'more than 2× the oil per hectare of soy') +
        div('callout lb-c2', 740, 918, 580, 'keep palm, buy deforestation-free');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.lb-f, .lb-a, .lb-dim, .fu-pt, .fu-pf, .fu-pd, .fu-pe, .lb-out, .lb-ax, .lb-dot, .lb-front, .lb-keep, .lb-pa, .lb-k, .lb-h, .lb-s, .lb-palm, .lb-c1, .lb-c2'), { autoAlpha: 0 });

      pipeBuild(ctx, 'lb', LPARTS);

      // [click 3] what the whole pipeline hands back
      ctx.pause();
      tl.addLabel('o');
      tl.to(q('.lb-out'), { autoAlpha: 1, duration: .01 }, 'o');
      Kit.draw(tl, qa('.lb-out .rp'), { at: 'o', duration: .4 });
      Kit.show(tl, qa('.lb-k, .lb-h, .lb-s'), { at: 'o+=.2', y: 14, stagger: .12, duration: .45 });
      tl.to(q('.lb-ax'), { autoAlpha: 1, duration: .01 }, 'o+=.5');
      Kit.draw(tl, qa('.lb-ax .rp'), { at: 'o+=.5', duration: .5 });
      tl.to(qa('.lb-dim, .lb-dot'), { autoAlpha: 1, duration: .25, stagger: .07 }, 'o+=.8');
      tl.to(q('.lb-front'), { autoAlpha: 1, duration: .01 }, 'o+=1.4');
      Kit.draw(tl, qa('.lb-front .rp'), { at: 'o+=1.4', duration: .7 });

      // [click 4] the answer the search has to be allowed to give
      ctx.pause();
      tl.addLabel('k');
      Kit.drop(tl, q('.lb-palm'), { at: 'k' });
      tl.to(q('.lb-pa'), { autoAlpha: 1, duration: .01 }, 'k+=.3');
      Kit.draw(tl, qa('.lb-pa .rp'), { at: 'k+=.3', duration: .3 });
      Kit.show(tl, q('.lb-c1'), { at: 'k+=.3', y: 10, duration: .45 });
      tl.to(q('.lb-keep'), { autoAlpha: 1, duration: .01 }, 'k+=.7');
      Kit.draw(tl, qa('.lb-keep .rp'), { at: 'k+=.7', duration: .6, stagger: .1 });
      Kit.show(tl, q('.lb-c2'), { at: 'k+=1.2', y: 10, duration: .5 });
    },
    notes:
      'Same shape for the factory. ' +
      '[click] A price forecast gives the chance each ingredient spikes. A smell model asks if a substitute smells like cocoa. ' +
      'The search loop picks the next blend and roast. A pass-fail predictor flags the candidates worth testing. ' +
      '[click] Both are proven. Ivory Coast cocoa arrivals: fifty-five thousand tonnes in one week, against a hundred and seven thousand a year earlier. ' +
      'And a graph neural network matched trained tasters on four hundred new molecules. ' +
      '[click] What comes out is a trade-off, not a winner. ' +
      '[click] Oil palm gives more than twice the oil per hectare of soy or rapeseed, so swapping it out can use more land. ' +
      'Deforestation-free palm cuts emissions ninety-two percent. So it must be allowed to answer: keep palm, change the source.'
  };

  /* ------------------------------------------------------------ SUMMARY */
  var SUM = [
    { num: '01', k: 'Cook', color: 'teal', pre: 'a kitchen', rest: ' becomes a graph' },
    { num: '02', k: 'Find', color: 'olive', pre: 'a protein', rest: ' becomes a vector' },
    { num: '03', k: 'Mix', color: 'saffron', pre: 'a recipe', rest: ' becomes a point on a map' },
    { num: '04', k: 'Sell', color: 'cranberry', pre: 'the engine', rest: ' outlived the milk' }
  ];
  /* recap rows use the intro agenda's grammar: hatched number tile + a rule in the section tint */
  var SROW_Y = 300, SROW_STEP = 76, SRULE_X1 = 1180;
  function scy(i) { return SROW_Y + i * SROW_STEP + 28; }      // vertical centre of row i
  function sruleY(i) { return SROW_Y + i * SROW_STEP + 62; }

  var SUMMARY = {
    id: 'summary',
    title: 'Summary',
    heading: 'Summary',
    budgetSec: 40,
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
      '[click] Find: a protein became a vector. ' +
      '[click] Mix: a recipe became a point on a map. ' +
      '[click] And Sell: the engine outlived the milk. ' +
      'Each step made food more abstract, which is what let a machine search it. ' +
      'None of it removes the cook: the camera cannot see salt, the protein search only finds what is near a known hit, ' +
      'and every swap still needs a human tasting. ' +
      '[click] Both futures end the same way. A model chose what is in it. Would you notice?'
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
