/* ==========================================================================
   03 · Mix · NotCo Giuseppe   (budget 390 s)
   Spec: specs/giuseppe.md. Roadmap cards / crumbs: Map → Decode → Score → Steer.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/giuseppe/';
  var STEPS = ['Map', 'Decode', 'Score', 'Steer'];

  /* deterministic pseudo-random numbers, so dots land in the same place in show, print and preview */
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  function svgOpen(cls) { return '<svg class="gp-svg ' + (cls || '') + '" width="1920" height="1080" viewBox="0 0 1920 1080">'; }

  /* -------------------------------------------------------------- PROBLEM */
  var SLOTS = [[715, 490], [790, 490], [865, 490], [940, 490], [1015, 490], [1090, 490], [760, 578], [835, 578], [910, 578], [985, 578]];

  var PROBLEM = {
    id: 'problem',
    title: 'The formulation problem',
    heading: 'The formulation problem',
    budgetSec: 45,
    html: function () {
      var slots = SLOTS.map(function (s, i) {
        return '<g class="pr-slot s' + i + '">' + Kit.rough.circle(s[0], s[1], 62, { seed: 40 + i, w: 'fine', stroke: C.text3, rough: 1.4 }) +
          '<text class="disp f-faint" x="' + s[0] + '" y="' + (s[1] + 13) + '" text-anchor="middle" font-size="36">?</text></g>';
      }).join('');
      var svg = svgOpen() +
        '<g class="pr-eq">' + Kit.rough.line(470, 472, 548, 472, { seed: 31, w: 'normal' }) + Kit.rough.line(470, 516, 548, 516, { seed: 32, w: 'normal' }) + '</g>' +
        '<g class="pr-bowl">' + Kit.rough.ellipse(900, 430, 520, 86, { seed: 34, w: 'heavy', rough: .9 }) +
          Kit.rough.path('M640 430 L672 600 Q900 702 1128 600 L1160 430', { seed: 33, w: 'heavy', rough: .9 }) + '</g>' +
        '<g class="pr-slots">' + slots + '</g>' +
        '<g class="pr-arr">' + Kit.rough.arrow(1352, 498, 1352, 570, { seed: 35, w: 'normal', stroke: C.rustT, head: 20 }) + '</g>' +
        '<g class="pr-box">' + Kit.rough.rect(140, 806, 1660, 192, { seed: 36, w: 'normal', stroke: C.text3 }) + '</g>' +
        
        '<g class="dd-huge">' + Kit.doodle.circle(1298, 602, 396, 112, { seed: 212, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
        '<g class="dd-test">' + Kit.doodle.underline(1362, 944, 386, { seed: 213 }) + '</g>' +
        '<g class="dd-spoon">' + Kit.doodle.fork(528, 664, 196, { seed: 214, rot: 14 }) + '</g>' +
      '</svg>';
      return svg +
        Kit.photo(IMG + 'milk.webp', { x: 150, y: 296, w: 250, rot: -4, cls: 'pr-milk', alt: 'glass of milk' }) +
        Kit.overlay('<g class="dd-fresh">' + Kit.doodle.twinkles(376, 348, 66, { seed: 211, w: 'normal' }) + '</g>') +
        '<div class="t-caps pr-k">A handful of plants</div>' +
        '<div class="pr-n n1"><div class="t-num c-saffron"><span class="v">0</span></div>' +
          '<div class="t-label dim">ingredients in the patent’s example</div></div>' +
        '<div class="pr-n n2"><div class="t-num c-rust">4 × 10<sup>22</sup></div>' +
          '<div class="t-label dim">ways to pick ten of them</div></div>' +
        '<div class="pr-test">' +
          '<div class="t-caps faint">The real test</div>' +
          '<div class="t-mono pr-mono">20+ chefs · 100+ recipes a month</div>' +
          '<div class="t-body">Cook it. Taste it. Rate it.</div>' +
        '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.pr-n, .pr-test, .pr-arr, .pr-box, .dd-fresh, .dd-huge, .dd-test, .dd-spoon'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.drop(tl, q('.pr-milk'), { at: .15 });
      Kit.draw(tl, qa('.pr-eq .rp'), { at: .5, duration: .4 });
      Kit.draw(tl, qa('.pr-bowl .rp'), { at: .55, duration: .8 });
      Kit.fade(tl, q('.pr-k'), { at: .6 });
      tl.fromTo(qa('.pr-slot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, stagger: .05, ease: 'power1.out' }, .9);
      tl.to(q('.dd-fresh'), { autoAlpha: 1, duration: .01 }, .7);
      Kit.draw(tl, qa('.dd-fresh .rp'), { at: .7, duration: .4, stagger: .03 });
      tl.to(q('.dd-spoon'), { autoAlpha: 1, duration: .01 }, 1.0);
      Kit.draw(tl, qa('.dd-spoon .rp'), { at: 1.0, duration: .6 });

      // [click 1] the catalog
      ctx.pause();
      Kit.show(tl, q('.n1'), { y: 18 });
      Kit.count(tl, q('.n1 .v'), { from: 0, to: 830, duration: 1.1, at: '<' });

      // [click 2] the combinations, tied to the ten empty slots
      ctx.pause();
      tl.addLabel('comb');
      tl.to(q('.pr-arr'), { autoAlpha: 1, duration: .01 }, 'comb');
      Kit.draw(tl, qa('.pr-arr .rp'), { at: 'comb', duration: .4 });
      Kit.show(tl, q('.n2'), { at: 'comb+=.3', y: 18 });
      SLOTS.forEach(function (s, i) {
        tl.to(q('.s' + i), { scale: 1.22, svgOrigin: s[0] + ' ' + s[1], duration: .16, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 'comb+=' + (.5 + i * .06));
      });
      tl.to(q('.dd-huge'), { autoAlpha: 1, duration: .01 }, 'comb+=.9');
      Kit.draw(tl, qa('.dd-huge .rp'), { at: 'comb+=.9', duration: .8 });

      // [click 3] the real test is a person cooking
      ctx.pause();
      tl.addLabel('test');
      tl.to(q('.pr-box'), { autoAlpha: 1, duration: .01 }, 'test');
      Kit.draw(tl, qa('.pr-box .rp'), { at: 'test', duration: .6 });
      Kit.show(tl, q('.pr-test'), { at: 'test+=.2', y: 20 });
      tl.to(q('.dd-test'), { autoAlpha: 1, duration: .01 }, 'test+=.8');
      Kit.draw(tl, qa('.dd-test .rp'), { at: 'test+=.8', duration: .5 });
    },
    notes:
      'Here is the problem Giuseppe was built for. Rebuild cow’s milk out of plants: a handful of them, and the right amount of each. ' +
      '[click] One NotCo patent works through an example catalog of eight hundred and thirty ingredients. ' +
      '[click] Pick ten of those, and there are about forty thousand billion billion possible sets. That count is my arithmetic, not a NotCo figure. ' +
      '[click] And you cannot check them on a computer: the real test is a person cooking it and tasting it. ' +
      'NotCo’s kitchen gets through about a hundred recipes a month, so the number of tries is the bottleneck.'
  };

  /* ------------------------------------------------------------- APPROACH */
  var AP = [
    { step: 'Map', q: 'Where do recipes live?', tech: 'Variational autoencoder' },
    { step: 'Decode', q: 'Which ingredients?', tech: 'RNN decoder' },
    { step: 'Score', q: 'How much, and how close?', tech: 'Quantity solver' },
    { step: 'Steer', q: 'Where next?', tech: 'Bayesian optimization' }
  ];
  var APX = [120, 560, 1000, 1440], APW = 360, APY = 322, APH = 436;

  var APPROACH = {
    id: 'approach',
    title: 'How Giuseppe works',
    heading: 'How Giuseppe works',
    budgetSec: 30,
    html: function () {
      var svg = svgOpen() +
        AP.map(function (c, i) {
          return '<g class="ap-b b' + i + '">' + Kit.rough.rect(APX[i], APY, APW, APH,
            { seed: 60 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .16, hachureGap: 22 }) + '</g>';
        }).join('') +
        [1, 2, 3].map(function (i) {
          return '<g class="ap-a a' + i + '">' + Kit.rough.arrow(APX[i - 1] + APW + 2, 540, APX[i] - 2, 540, { seed: 70 + i, w: 'heavy', head: 26 }) + '</g>';
        }).join('') +
        '<g class="ap-loop">' + Kit.rough.arrow(APX[3] + APW / 2, 806, APX[1] + APW / 2, 806, { seed: 75, w: 'heavy', stroke: C.saffronT, head: 26, bend: -74 }) + '</g>' +
        '<g class="dd-loop">' + Kit.doodle.underline(1090, 916, 182, { seed: 221 }) + '</g>' +
        '<g class="dd-whisk">' + Kit.doodle.pot(252, 884, 156, { seed: 222 }) + '</g>' +
      '</svg>';
      var cards = AP.map(function (c, i) {
        return '<div class="ap-card c' + i + '" style="left:' + APX[i] + 'px">' +
          '<div class="t-caps faint">Step ' + (i + 1) + '</div>' +
          '<div class="t-h2 ap-name">' + c.step + '</div>' +
          '<div class="t-body dim ap-q">' + c.q + '</div>' +
          '<div class="t-label ap-tech"><span class="d"></span>' + c.tech + '</div>' +
        '</div>';
      }).join('');
      return svg + cards + '<div class="t-caps ap-loop-l">One loop</div>' +
        '<div class="callout ap-many">hundreds of times</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ap-a, .ap-loop, .ap-loop-l, .dd-loop, .ap-many, .dd-whisk'), { autoAlpha: 0 });
      gsap.set(qa('.c1 > *, .c2 > *, .c3 > *, .b1, .b2, .b3'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.b0 .rp'), { at: .3, duration: .6 });
      tl.to(q('.dd-whisk'), { autoAlpha: 1, duration: .01 }, .8);
      Kit.draw(tl, qa('.dd-whisk .rp'), { at: .8, duration: .7, stagger: .03 });
      Kit.show(tl, qa('.c0 > *'), { at: .5, y: 16, stagger: .07, duration: .45 });

      [1, 2, 3].forEach(function (i) {
        ctx.pause();
        tl.addLabel('s' + i);
        tl.to(q('.a' + i), { autoAlpha: 1, duration: .01 }, 's' + i);
        Kit.draw(tl, qa('.a' + i + ' .rp'), { at: 's' + i, duration: .35 });
        tl.to(q('.b' + i), { autoAlpha: 1, duration: .01 }, 's' + i + '+=.3');
        Kit.draw(tl, qa('.b' + i + ' .rp'), { at: 's' + i + '+=.3', duration: .5 });
        Kit.show(tl, qa('.c' + i + ' > *'), { at: 's' + i + '+=.45', y: 16, stagger: .07, duration: .45 });
        if (i === 3) {
          tl.to(q('.ap-loop'), { autoAlpha: 1, duration: .01 }, 's3+=1.0');
          Kit.draw(tl, qa('.ap-loop .rp'), { at: 's3+=1.0', duration: .7 });
          Kit.show(tl, q('.ap-loop-l'), { at: 's3+=1.3', y: 12 });
          tl.to(q('.dd-loop'), { autoAlpha: 1, duration: .01 }, 's3+=1.6');
          Kit.draw(tl, qa('.dd-loop .rp'), { at: 's3+=1.6', duration: .45 });
          Kit.show(tl, q('.ap-many'), { at: 's3+=1.5', y: 10 });
        }
      });
    },
    notes:
      'Giuseppe does four things. Everything here is from NotCo’s patents; they have never confirmed it is what runs today. ' +
      'First, map: learn where recipes live. ' +
      '[click] Second, decode: read any point back out as an ingredient list. ' +
      '[click] Third, score: a solver picks how much of each, and how far it lands from milk. ' +
      '[click] Fourth, steer: that score chooses where to try next. Those three repeat, hundreds of times, no cooking.'
  };

  /* ------------------------------------------------------------------ MAP */
  // map square in stage px; inner area is inset 20 px
  var MX = 700, MY = 290, MS = 540, IN = 20;
  /* a projector turns map coordinates u,v in [0,1] into stage px for a square at (ox, oy) of side sz */
  function proj(ox, oy, sz) { return function (u, v) { return [ox + IN + u * (sz - 2 * IN), oy + IN + v * (sz - 2 * IN)]; }; }
  var mp = proj(MX, MY, MS);
  var CLUSTERS = [
    { name: 'sauces', u: .30, v: .70, s: .085, n: 34, lab: [722, 812] },
    { name: 'dairy', u: .78, v: .24, s: .065, n: 28, lab: [1112, 336] },
    { name: 'baked goods', u: .78, v: .78, s: .06, n: 24, lab: [1060, 812] }
  ];
  var P = mp(.33, .74), A = mp(.18, .54), B = mp(.42, .51), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  // keep scatter dots out of text: [x0, y0, x1, y1] in stage px
  var KEEP_OUT = [[704, 296, 990, 400], [970, 540, 1180, 610], [704, 780, 860, 830], [1040, 780, 1236, 830], [1100, 300, 1236, 346]];
  var CUTS = [
    { img: 'tomato.webp', x: 130, y: 330, w: 190, rot: -5, name: 'tomato' },
    { img: 'garlic.webp', x: 350, y: 322, w: 175, rot: 6, name: 'garlic' },
    { img: 'basil.webp', x: 190, y: 500, w: 230, rot: -3, name: 'basil' }
  ];
  var ENC = [628, 560];   // encoder wedge centre
  var DEC = [1310, 560];  // decoder wedge centre

  function mapDots(p, o) {
    p = p || mp; o = o || {};
    var rs = o.rs || 1, op = o.op != null ? o.op : 1;
    var r = rng(4242), out = '';
    CLUSTERS.forEach(function (c, ci) {
      for (var i = 0; i < c.n; i++) {
        var u = Math.min(.97, Math.max(.03, c.u + gauss(r) * c.s)), v = Math.min(.97, Math.max(.03, c.v + gauss(r) * c.s));
        var pt = p(u, v);
        out += '<circle class="gp-dot k' + ci + '" cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="' + (5 * rs).toFixed(1) + '" fill="' + C.chalk + '" opacity="' + (.55 * op).toFixed(2) + '"/>';
      }
    });
    for (var j = 0; j < 40; j++) {
      var q = p(.04 + r() * .92, .04 + r() * .92);
      if (p === mp && KEEP_OUT.some(function (k) { return q[0] > k[0] && q[0] < k[2] && q[1] > k[1] && q[1] < k[3]; })) continue;
      out += '<circle class="gp-dot k3" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (4.5 * rs).toFixed(1) + '" fill="' + C.chalk + '" opacity="' + (.28 * op).toFixed(2) + '"/>';
    }
    return out;
  }

  function wedge(x0, y0, x1, h0, h1, o) {
    // trapezoid from height h0 at x0 to h1 at x1, centred on y0
    var d = 'M' + x0 + ' ' + (y0 - h0 / 2) + ' L' + x1 + ' ' + (y0 - h1 / 2) + ' L' + x1 + ' ' + (y0 + h1 / 2) + ' L' + x0 + ' ' + (y0 + h0 / 2) + ' Z';
    return Kit.rough.path(d, o);
  }

  var MAP = {
    id: 'map',
    title: 'The recipe map',
    heading: 'The recipe map',
    budgetSec: 75,
    html: function () {
      var ghosts = CUTS.map(function (c, i) {
        return Kit.photo(IMG + c.img, { x: c.x, y: c.y, w: c.w, rot: c.rot, cls: 'gp-ghost', alt: '' });
      }).join('');
      var cuts = CUTS.map(function (c, i) {
        return '<div class="gp-cut c' + i + '" style="left:' + c.x + 'px;top:' + c.y + 'px;width:' + c.w + 'px">' +
          Kit.photo(IMG + c.img, { x: 0, y: 0, w: c.w, rot: c.rot, alt: c.name }) + '</div>';
      }).join('');
      var svg = '<svg class="gp-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        // map border
        '<g class="gp-border">' + Kit.rough.rect(MX, MY, MS, MS, { seed: 7, w: 'normal', rough: .9 }) + '</g>' +
        // encoder / decoder wedges: cream outline + saffron overlay that lights up when data passes through
        '<g class="gp-enc">' + wedge(586, ENC[1], 672, 230, 70, { seed: 8, w: 'heavy' }) + '</g>' +
        '<g class="gp-enc-on">' + wedge(586, ENC[1], 672, 230, 70, { seed: 8, w: 'heavy', stroke: C.saffron, fill: C.saffron, fillStyle: 'hachure', hachureGap: 12, fillWeight: 2 }) + '</g>' +
        '<g class="gp-dec">' + wedge(1268, DEC[1], 1354, 70, 230, { seed: 9, w: 'heavy' }) + '</g>' +
        '<g class="gp-dec-on">' + wedge(1268, DEC[1], 1354, 70, 230, { seed: 9, w: 'heavy', stroke: C.saffron, fill: C.saffron, fillStyle: 'hachure', hachureGap: 12, fillWeight: 2 }) + '</g>' +
        '<text class="t-caps gp-wl" x="690" y="716" text-anchor="end" font-size="24">ENCODER</text>' +
        '<text class="t-caps gp-wl" x="1252" y="716" font-size="24">DECODER</text>' +
        // map interior
        '<g class="gp-dots">' + mapDots() + '</g>' +
        CLUSTERS.map(function (c, i) {
          return '<text class="gp-clab k' + i + '" x="' + c.lab[0] + '" y="' + c.lab[1] + '" font-size="28" font-weight="600">' + c.name + '</text>';
        }).join('') +
        // decode path: P → decoder → rebuilt list
        '<g class="gp-out">' + Kit.rough.curve([[P[0] + 16, P[1] - 4], [1010, 690], [1160, 640], [1300, 566]], { seed: 14, w: 'heavy', stroke: C.saffronT }) +
          Kit.rough.arrow(1356, 560, 1392, 470, { seed: 15, w: 'heavy', stroke: C.saffronT, head: 22, bend: -14 }) + '</g>' +
        // neighbours A, B and the chord between them
        '<g class="gp-chord">' + Kit.rough.line(A[0], A[1], B[0], B[1], { seed: 16, w: 'fine', stroke: C.text2 }) + '</g>' +
        '<g class="gp-nb">' +
          '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="11" fill="' + C.saffron + '" stroke="#1E2124" stroke-width="3"/>' +
          '<circle cx="' + B[0] + '" cy="' + B[1] + '" r="11" fill="' + C.saffron + '" stroke="#1E2124" stroke-width="3"/>' +
          '<text class="gp-pl" x="' + (A[0] - 16) + '" y="' + (A[1] - 18) + '" text-anchor="end" font-size="30" font-weight="800" fill="' + C.saffronT + '">A</text>' +
          '<text class="gp-pl" x="' + (B[0] + 16) + '" y="' + (B[1] - 18) + '" font-size="30" font-weight="800" fill="' + C.saffronT + '">B</text>' +
        '</g>' +
        '<g class="gp-m">' +
          '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="11" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>' +
          '<text class="gp-pl" x="' + M[0] + '" y="' + (M[1] - 22) + '" text-anchor="middle" font-size="30" font-weight="800" fill="' + C.rustT + '">M</text>' +
        '</g>' +
        // our recipe's point P
        '<g class="gp-p"><circle cx="' + P[0] + '" cy="' + P[1] + '" r="13" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>' +
          '<text class="gp-pl" x="' + (P[0] + 20) + '" y="' + (P[1] + 34) + '" font-size="30" font-weight="800" fill="' + C.rustT + '">P</text></g>' +
        // doodle callouts' arrows
        '<g class="gp-c1a">' + Kit.rough.arrow(770, 392, (A[0] + M[0]) / 2 - 4, (A[1] + M[1]) / 2 - 14, { seed: 17, w: 'normal', stroke: C.rustT, head: 18, bend: 16 }) + '</g>' +
        '<g class="gp-c2a">' + Kit.rough.arrow(990, 566, M[0] + 20, M[1] + 12, { seed: 18, w: 'normal', stroke: C.rustT, head: 18, bend: -18 }) + '</g>' +
        // doodles: loop the one recipe, swoosh it into the encoder, twinkle the in-between point
        '<g class="dd-rec">' + Kit.doodle.circle(186, 402, 296, 296, { seed: 231 }) + '</g>' +
        '<g class="dd-sw">' + Kit.doodle.swoosh(348, 486, 572, 550, { seed: 232, w: 'normal' }) + '</g>' +
        '<g class="dd-sprig">' + Kit.doodle.sprig(248, 952, 136, { seed: 234, rot: 16 }) + '</g>' +
        '<g class="dd-m">' + Kit.doodle.underline(1400, 918, 392, { seed: 233, color: 'var(--rust-t)' }) + '</g>' +
      '</svg>';

      var left = '<div class="t-caps gp-k gp-k1">One recipe</div>' + ghosts + cuts +
        '<div class="t-mono gp-list gp-in">' + CUTS.map(function (c) { return '<div>' + c.name + '</div>'; }).join('') + '</div>';
      var right = '<div class="t-caps gp-k gp-k2">Rebuilt</div>' +
        '<div class="t-mono gp-list gp-rb">' + CUTS.map(function (c) { return '<div>' + c.name + '</div>'; }).join('') + '</div>' +
        '<div class="gp-rows">' +
          '<div class="gp-row ra"><b class="c-saffron">A</b><span class="t-mono">tomato · onion</span></div>' +
          '<div class="gp-row rb"><b class="c-saffron">B</b><span class="t-mono">tomato · cream</span></div>' +
          '<div class="gp-row rm"><b class="c-rust">M</b><span class="t-mono">tomato · onion · cream</span></div>' +
        '</div>';
      var caps = ['One recipe becomes one point.', 'Decode: the same list comes back.', 'Trained on recipes people have made.',
        'Nearby points, nearly the same list.', 'A point in between still decodes.'];
      return svg + left + right +
        '<div class="callout gp-c1">one swap apart</div>' +
        '<div class="callout gp-c2">no holes</div>' +
        caps.map(function (t, i) { return '<div class="t-body gp-cap cap' + i + '">' + t + '</div>'; }).join('');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { sq: 0 };
      var cuts = qa('.gp-cut'), ghosts = qa('.gp-ghost');
      // centre of each cut-out at rest, in stage px
      var starts = CUTS.map(function (c) { return [c.x + c.w / 2, c.y + c.w * .45]; });
      function render() {
        var t = st.sq;
        cuts.forEach(function (el, i) {
          var s = starts[i], k = ENC, e = P;
          // quadratic Bézier: rest → encoder → P
          var x = (1 - t) * (1 - t) * s[0] + 2 * (1 - t) * t * k[0] + t * t * e[0];
          var y = (1 - t) * (1 - t) * s[1] + 2 * (1 - t) * t * k[1] + t * t * e[1];
          gsap.set(el, { x: x - s[0], y: y - s[1], scale: 1 - .9 * t, autoAlpha: t > .98 ? 0 : 1 - .35 * t });
        });
        gsap.set(ghosts, { autoAlpha: .28 * Math.min(1, t * 2.5) });
      }
      render();

      gsap.set(qa('.gp-enc-on, .gp-dec-on, .gp-p, .gp-dots, .gp-clab, .gp-nb, .gp-m, .gp-rows .gp-row, .gp-rb > div, .callout, .gp-cap, .gp-c1a, .gp-c2a, .dd-sw, .dd-m, .dd-sprig'), { autoAlpha: 0 });

      // entrance
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.gp-k1, .gp-in, .gp-wl, .gp-k2'), { at: .2, stagger: .04 });
      Kit.drop(tl, qa('.gp-cut img'), { at: .15, stagger: .08 });
      Kit.draw(tl, qa('.dd-rec .rp'), { at: .55, duration: .8 });
      tl.to(q('.dd-sprig'), { autoAlpha: 1, duration: .01 }, .9);
      Kit.draw(tl, qa('.dd-sprig .rp'), { at: .9, duration: .7, stagger: .03 });
      Kit.draw(tl, qa('.gp-border .rp, .gp-enc .rp, .gp-dec .rp'), { at: .3, duration: .8 });
      tl.fromTo(qa('.gp-out .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);
      tl.fromTo(qa('.gp-chord .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);

      // [click 1] squeeze: the recipe travels through the encoder and becomes point P
      ctx.pause();
      tl.to(qa('.gp-enc-on'), { autoAlpha: 1, duration: .3 }, 'sq');
      tl.to(q('.dd-rec'), { autoAlpha: 0, duration: .3 }, 'sq');
      tl.to(q('.dd-sw'), { autoAlpha: 1, duration: .01 }, 'sq+=.1');
      Kit.draw(tl, qa('.dd-sw .rp'), { at: 'sq+=.1', duration: .4, stagger: .04 });
      tl.to(q('.dd-sw'), { autoAlpha: 0, duration: .5 }, 'sq+=1.0');
      tl.to(st, { sq: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: render }, 'sq');
      tl.to(qa('.gp-in > div'), { color: C.saffronT, duration: .3, stagger: .05 }, 'sq');
      tl.fromTo(q('.gp-p'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2)' }, 'sq+=1.0');
      tl.to(qa('.gp-enc-on'), { autoAlpha: 0, duration: .4 }, 'sq+=1.1');
      Kit.show(tl, q('.cap0'), { at: 'sq+=.9', y: 12 });

      // [click 2] rebuild: P read back out through the decoder
      ctx.pause();
      tl.addLabel('rb');
      tl.to(q('.cap0'), { autoAlpha: 0, duration: .25 }, 'rb');
      tl.to(qa('.gp-dec-on'), { autoAlpha: 1, duration: .3 }, 'rb+=.3');
      tl.to(qa('.gp-out .rp'), { drawSVG: '100%', duration: .7, ease: 'power2.inOut', stagger: .1 }, 'rb');
      tl.fromTo(qa('.gp-rb > div'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: .3, stagger: .25, ease: Kit.ease.out }, 'rb+=.7');
      tl.to(qa('.gp-rb > div'), { color: C.saffronT, duration: .25, stagger: .25 }, 'rb+=.7');
      tl.to(qa('.gp-dec-on'), { autoAlpha: 0, duration: .4 }, 'rb+=1.3');
      Kit.show(tl, q('.cap1'), { at: 'rb+=.5', y: 12 });

      // [click 3] clusters: the map is learned from real recipes
      ctx.pause();
      tl.addLabel('cl');
      tl.to(q('.cap1'), { autoAlpha: 0, duration: .25 }, 'cl');
      tl.to(qa('.gp-out .rp'), { opacity: .35, duration: .4 }, 'cl');
      tl.to(qa('.gp-in > div, .gp-rb > div'), { color: C.text, duration: .4 }, 'cl');
      tl.fromTo(q('.gp-dots'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .7 }, 'cl');
      tl.fromTo(qa('.gp-clab'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .1 }, 'cl+=.5');
      Kit.show(tl, q('.cap2'), { at: 'cl+=.4', y: 12 });

      // [click 4] neighbours: nearby points, nearly the same list
      ctx.pause();
      tl.addLabel('nb');
      tl.to(q('.cap2'), { autoAlpha: 0, duration: .25 }, 'nb');
      tl.fromTo(q('.gp-nb'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, 'nb');
      tl.to(qa('.gp-chord .rp'), { drawSVG: '100%', duration: .5 }, 'nb+=.2');
      tl.fromTo(qa('.ra, .rb'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .15 }, 'nb+=.3');
      tl.fromTo(q('.gp-c1'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, 'nb+=.6');
      tl.fromTo(q('.gp-c1a'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, 'nb+=.6');
      Kit.draw(tl, qa('.gp-c1a .rp'), { at: 'nb+=.6', duration: .5 });
      Kit.show(tl, q('.cap3'), { at: 'nb+=.5', y: 12 });

      // [click 5] no holes: a point between A and B still decodes
      ctx.pause();
      tl.addLabel('m');
      tl.to(q('.cap3'), { autoAlpha: 0, duration: .25 }, 'm');
      tl.fromTo(q('.gp-m'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)' }, 'm');
      tl.fromTo(q('.rm'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: .4 }, 'm+=.3');
      tl.fromTo(q('.gp-c2'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, 'm+=.5');
      tl.fromTo(q('.gp-c2a'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, 'm+=.5');
      Kit.draw(tl, qa('.gp-c2a .rp'), { at: 'm+=.5', duration: .5 });
      tl.to(q('.dd-m'), { autoAlpha: 1, duration: .01 }, 'm+=.7');
      Kit.draw(tl, qa('.dd-m .rp'), { at: 'm+=.7', duration: .4, stagger: .03 });
      Kit.show(tl, q('.cap4'), { at: 'm+=.4', y: 12 });
    },
    notes:
      'First step: the map. The model behind this is called an autoencoder: two networks joined at a narrow waist. ' +
      '[click] The encoder takes one recipe — tomato, garlic, basil — and squeezes the whole list into one point. Call it P. ' +
      '[click] The decoder does the reverse: it reads P back out as a list, one ingredient at a time, and training rewards getting the same list back. ' +
      '[click] Train that on thousands of recipes people have cooked, and similar recipes end up near each other. Sauces together, dairy together. ' +
      'I am drawing this flat; the real map has far more dimensions, and these clusters are made up. ' +
      '[click] Points close together decode to nearly the same list. A is tomato and onion, B is tomato and cream. One swap apart. ' +
      '[click] Training keeps the map evenly filled, so a point between A and B, like M, still decodes into a sensible recipe: tomato, onion and cream. No holes. ' +
      'The map knows which ingredients go together. It does not know what tastes like milk.'
  };
  Kit.withCrumbs(MAP, STEPS, 0);

  /* ---------------------------------------------------------------- SCORE */
  var SC_ING = ['pineapple juice', 'cabbage juice', 'chicory root', 'coconut'];
  var SC_PCT = [.62, .18, .12, .08];                      // illustrative proportions
  var SC_FEAT = ['protein', 'fat', 'sugar', 'calcium', 'viscosity'];
  var SC_TICK = [.42, .58, .50, .66, .38];                // where milk sits on each track
  var SC_OFF = [92, -74, 64, -56, 80];                    // the blend's first-guess gap, in px
  var BAR_X = 810, BAR_W = 320, FT_X = 1470, FT_W = 320;
  var SMP = proj(140, 404, 260);

  var SCORE = {
    id: 'score',
    title: 'Scoring a candidate',
    heading: 'Scoring a candidate',
    budgetSec: 50,
    html: function () {
      var rowY = [404, 484, 564, 644];
      var ftY = [452, 516, 580, 644, 708];
      var sp = SMP(.33, .74);
      var svg = svgOpen() +
        // left: the point on the map, decoded through the wedge
        '<g class="sc-map">' + Kit.rough.rect(140, 404, 260, 260, { seed: 80, w: 'normal' }) + '</g>' +
        '<g class="sc-dots">' + mapDots(SMP, { rs: .55, op: .5 }) + '</g>' +
        '<circle class="sc-p" cx="' + sp[0] + '" cy="' + sp[1] + '" r="9" fill="' + C.rust + '" stroke="#1E2124" stroke-width="2"/>' +
        '<g class="sc-dec">' + wedge(438, 534, 498, 70, 200, { seed: 81, w: 'heavy', fill: C.saffron, fillStyle: 'hachure', hachureGap: 18, fillOpacity: .3 }) + '</g>' +
        // centre: the solver's proportions
        SC_ING.map(function (n, i) {
          return '<text class="mono sc-n n' + i + '" x="540" y="' + (rowY[i] + 10) + '" font-size="28" fill="' + C.text + '">' + n + '</text>' +
            '<rect class="sc-tr" x="' + BAR_X + '" y="' + (rowY[i] - 14) + '" width="' + BAR_W + '" height="28" rx="6" fill="rgba(0,0,0,.22)"/>' +
            '<rect class="sc-fill f' + i + '" x="' + BAR_X + '" y="' + (rowY[i] - 14) + '" width="0" height="28" rx="6" fill="' + C.saffron + '"/>' +
            '<text class="mono sc-pct f-saffron p' + i + '" x="1250" y="' + (rowY[i] + 10) + '" text-anchor="end" font-size="28">0%</text>';
        }).join('') +
        '<text class="t-caps sc-tot-l f-faint" x="810" y="712" font-size="24">TOTAL</text>' +
        '<text class="mono sc-tot f-dim" x="1250" y="714" text-anchor="end" font-size="28">100%</text>' +
        // right: the target's measured profile, and the gap to it
        SC_FEAT.map(function (f, i) {
          var tx = FT_X + FT_W * SC_TICK[i];
          return '<text class="sc-fl f-dim" x="1300" y="' + (ftY[i] + 9) + '" font-size="28">' + f + '</text>' +
            '<line class="sc-track" x1="' + FT_X + '" y1="' + ftY[i] + '" x2="' + (FT_X + FT_W) + '" y2="' + ftY[i] + '" stroke="' + C.line + '" stroke-width="3"/>' +
            '<line class="sc-span g' + i + '" x1="' + tx + '" y1="' + ftY[i] + '" x2="' + (tx + SC_OFF[i]) + '" y2="' + ftY[i] + '" stroke="' + C.rust + '" stroke-width="7"/>' +
            '<line class="sc-tick t' + i + '" x1="' + tx + '" y1="' + (ftY[i] - 17) + '" x2="' + tx + '" y2="' + (ftY[i] + 17) + '" stroke="' + C.chalk + '" stroke-width="4"/>' +
            '<circle class="sc-mk m' + i + '" cx="' + (tx + SC_OFF[i]) + '" cy="' + ftY[i] + '" r="9" fill="' + C.rustT + '"/>';
        }).join('') +
        // what the two marks on each track mean
        '<g class="sc-leg">' +
          '<line x1="1472" y1="396" x2="1472" y2="420" stroke="' + C.chalk + '" stroke-width="4"/>' +
          '<text class="f-dim" x="1490" y="418" font-size="24">milk</text>' +
          '<circle cx="1584" cy="409" r="9" fill="' + C.rustT + '"/>' +
          '<text class="f-rust" x="1602" y="418" font-size="24">this blend</text>' +
        '</g>' +
        // doodles: loop the target photo, loop the score it is measured against
        '<g class="dd-pot">' + Kit.doodle.leaf(248, 790, 170, { seed: 243, rot: -18 }) + '</g>' +
        '<g class="dd-milk">' + Kit.doodle.circle(1294, 276, 76, 140, { seed: 241 }) + '</g>' +
        '<g class="dd-score">' + Kit.doodle.circle(1300, 782, 272, 124, { seed: 242, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
      '</svg>';
      return svg +
        '<div class="t-caps sc-k sc-k1">Decode</div>' +
        '<div class="t-caps sc-k sc-k2">Solver · how much of each</div>' +
        '<div class="t-caps sc-k sc-k3">Target · milk</div>' +
        Kit.photo(IMG + 'milk.webp', { x: 1294, y: 274, w: 74, rot: -3, cls: 'sc-milk', alt: 'glass of milk' }) +
        '<div class="sc-score"><div class="t-num c-rust"><span class="v">0.41</span></div>' +
          '<div class="t-label dim sc-sl">leftover distance to the target — lower is closer</div></div>' +
        '<div class="t-body sc-cap">Model picks which. Solver picks how much.</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { amt: 0, gap: 1 };
      var fills = qa('.sc-fill'), pcts = qa('.sc-pct'), mks = qa('.sc-mk'), spans = qa('.sc-span');
      var sv = q('.sc-score .v');
      function render() {
        SC_PCT.forEach(function (f, i) {
          fills[i].setAttribute('width', (BAR_W * f * st.amt).toFixed(1));
          pcts[i].textContent = Math.round(f * st.amt * 100) + '%';
        });
        SC_OFF.forEach(function (o, i) {
          var tx = FT_X + FT_W * SC_TICK[i], x = tx + o * st.gap;
          mks[i].setAttribute('cx', x.toFixed(1));
          spans[i].setAttribute('x2', x.toFixed(1));
        });
        sv.textContent = (0.04 + (st.gap - .1) / .9 * 0.37).toFixed(2);
      }
      render();

      gsap.set(qa('.sc-tot-l, .sc-tot, .sc-cap, .dd-score, .dd-pot'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.sc-k1, .sc-k2, .sc-k3'), { at: .15, stagger: .04 });
      Kit.draw(tl, qa('.dd-milk .rp'), { at: .8, duration: .7 });
      tl.to(q('.dd-pot'), { autoAlpha: 1, duration: .01 }, 1.0);
      Kit.draw(tl, qa('.dd-pot .rp'), { at: 1.0, duration: .7, stagger: .02 });
      Kit.draw(tl, qa('.sc-map .rp, .sc-dec .rp'), { at: .25, duration: .7 });
      Kit.fade(tl, qa('.sc-dots, .sc-p'), { at: .5 });
      tl.fromTo(qa('.sc-n'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .35, stagger: .1 }, .6);
      Kit.fade(tl, qa('.sc-tr'), { at: .7, stagger: .1 });
      Kit.drop(tl, q('.sc-milk'), { at: .5 });
      Kit.fade(tl, qa('.sc-fl, .sc-track, .sc-tick'), { at: .8, stagger: .02 });
      Kit.fade(tl, q('.sc-leg'), { at: 1.0 });
      Kit.fade(tl, qa('.sc-mk, .sc-span'), { at: 1.0, stagger: .03 });
      Kit.fade(tl, q('.sc-score'), { at: 1.1 });

      // [click 1] the solver picks the amounts
      ctx.pause();
      tl.to(st, { amt: 1, duration: 1.0, ease: 'power2.out', onUpdate: render }, 'a');
      Kit.show(tl, qa('.sc-tot-l, .sc-tot'), { at: 'a+=.7', y: 10, stagger: .06, duration: .4 });

      // [click 2] the gap to milk closes, and what is left is the score
      ctx.pause();
      tl.to(st, { gap: .1, duration: 1.2, ease: 'power2.inOut', onUpdate: render }, 'g');
      tl.to(q('.dd-score'), { autoAlpha: 1, duration: .01 }, 'g+=1.1');
      Kit.draw(tl, qa('.dd-score .rp'), { at: 'g+=1.1', duration: .8 });

      // [click 3] the division of labour
      ctx.pause();
      Kit.show(tl, q('.sc-cap'), { y: 16 });
    },
    notes:
      'Steps two and three. Our point goes through the decoder and comes back as four ingredients. ' +
      '[click] A solver picks how much of each. The proportions must be positive and add up to one hundred percent. ' +
      'The percentages on screen are made up. ' +
      '[click] Milk is described by the same measured features as every ingredient, so how close this is to milk is a distance. The solver shrinks it; what is left is the score. Lower is closer. ' +
      '[click] One warning: this assumes a blend behaves like the average of its parts. True for protein, false for taste. So a second model, trained on chefs’ ratings, scores flavour.'
  };
  Kit.withCrumbs(SCORE, STEPS, [1, 2]);

  /* ---------------------------------------------------------------- STEER */
  var TMX = 420, TMY = 282, TMS = 580;
  var tmp = proj(TMX, TMY, TMS);
  var TRY = [
    { u: .30, v: .70, s: '0.41', off: [-108, 12] },
    { u: .45, v: .58, s: '0.33', off: [20, 40] },
    { u: .32, v: .82, s: '0.37', off: [-108, 6] },
    { u: .60, v: .44, s: '0.19', off: [-108, 10] },
    { u: .70, v: .32, s: '0.09', off: [22, 42] },
    { u: .75, v: .26, s: '0.04', off: [-112, -16] }
  ];
  var STAR = tmp(.82, .17);
  var STEER_CARDS = [
    ['01 Predict', 'guess the score everywhere'],
    ['02 Pick', 'promising, or unexplored'],
    ['03 Update', 'every score reshapes the guess']
  ];

  var STEER = {
    id: 'steer',
    title: 'Steering the search',
    heading: 'Steering the search',
    budgetSec: 50,
    html: function () {
      var pts = TRY.map(function (t) { return tmp(t.u, t.v); });
      var trail = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L');
      var star = (function () {
        var d = '', R = 26, r = 11;
        for (var i = 0; i < 10; i++) {
          var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
          d += (i ? 'L' : 'M') + (STAR[0] + Math.cos(a) * rad).toFixed(1) + ' ' + (STAR[1] + Math.sin(a) * rad).toFixed(1) + ' ';
        }
        return d + 'Z';
      })();
      var svg = svgOpen() +
        '<defs><radialGradient id="gpHeat"><stop offset="0%" stop-color="' + C.saffron + '" stop-opacity=".55"/>' +
          '<stop offset="100%" stop-color="' + C.saffron + '" stop-opacity="0"/></radialGradient></defs>' +
        '<g class="st-border">' + Kit.rough.rect(TMX, TMY, TMS, TMS, { seed: 7, w: 'heavy', rough: .9 }) + '</g>' +
        '<circle class="st-heat" cx="' + (STAR[0] - 10) + '" cy="' + (STAR[1] + 30) + '" r="156" fill="url(#gpHeat)"/>' +
        '<g class="st-leg"><circle cx="236" cy="430" r="62" fill="url(#gpHeat)"/></g>' +
        '<g class="st-dots">' + mapDots(tmp, { rs: .9, op: .45 }) + '</g>' +
        '<path class="st-trail" d="' + trail + '" fill="none" stroke="' + C.text2 + '" stroke-width="3" stroke-dasharray="6 7"/>' +
        '<g class="st-star"><path d="' + star + '" fill="' + C.rust + '" stroke="#1E2124" stroke-width="2"/>' +
          '<text class="f-rust" x="' + (STAR[0] + 34) + '" y="' + (STAR[1] + 10) + '" font-size="28" font-weight="700">milk</text></g>' +
        TRY.map(function (t, i) {
          var p = tmp(t.u, t.v);
          return '<g class="st-try y' + i + '">' +
            '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="10" fill="' + (i === TRY.length - 1 ? C.rust : C.saffron) + '" stroke="#1E2124" stroke-width="2.5"/>' +
            '<text class="mono st-badge ' + (i === TRY.length - 1 ? 'f-rust' : 'f-dim') + '" x="' + (p[0] + t.off[0]).toFixed(1) +
              '" y="' + (p[1] + t.off[1]).toFixed(1) + '" font-size="28">' + t.s + '</text></g>';
        }).join('') +
        '<g class="st-c3a">' + Kit.rough.arrow(676, 884, tmp(.32, .82)[0] + 22, tmp(.32, .82)[1] + 20, { seed: 91, w: 'normal', stroke: C.rustT, head: 22, bend: 16, bow: .8 }) + '</g>' +
        STEER_CARDS.map(function (c, i) {
          return '<g class="st-b sb' + i + '">' + Kit.rough.rect(1120, 300 + i * 176, 680, 138,
            { seed: 95 + i, w: 'normal', hatch: 'var(--sec-t)', fillOpacity: .14, hachureGap: 24 }) + '</g>';
        }).join('') +
        '<g class="dd-win">' + Kit.doodle.twinkles(STAR[0] - 78, STAR[1] - 64, 48, { seed: 251, color: 'var(--rust-t)', w: 'normal' }) + '</g>' +
        '<g class="dd-carrot">' + Kit.doodle.carrot(246, 836, 148, { seed: 252 }) + '</g>' +
      '</svg>';
      return svg +
        STEER_CARDS.map(function (c, i) {
          return '<div class="st-card sc' + i + '" style="top:' + (300 + i * 176) + 'px">' +
            '<div class="t-caps c-saffron">' + c[0] + '</div><div class="t-label dim">' + c[1] + '</div></div>';
        }).join('') +
        '<div class="callout st-c3">worse — back off</div>' +
        '<div class="t-caps st-lk">Its guess</div>' +
        '<div class="t-label dim st-ll">where good scores probably are</div>' +
        '<div class="t-body st-cap">Bayesian optimization:<br>learn where to try next.</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { k: 0 };
      var tries = qa('.st-try'), trail = q('.st-trail');
      var len = trail.getTotalLength ? trail.getTotalLength() : 1000;
      var seg = len / (TRY.length - 1);
      function render() {
        tries.forEach(function (el, i) {
          var o = Math.max(0, Math.min(1, st.k - i));
          gsap.set(el, { autoAlpha: o });
        });
        var shown = Math.max(0, Math.min(len, (st.k - 1) * seg));
        trail.setAttribute('stroke-dasharray', shown + ' ' + (len + 10));
      }
      render();
      gsap.set(qa('.st-heat, .st-leg, .st-lk, .st-ll, .st-c3, .st-c3a, .st-cap, .sc1 > *, .sc2 > *, .sb1, .sb2, .dd-win, .dd-carrot'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.draw(tl, qa('.st-border .rp'), { at: .2, duration: .8 });
      tl.to(q('.dd-carrot'), { autoAlpha: 1, duration: .01 }, .9);
      Kit.draw(tl, qa('.dd-carrot .rp'), { at: .9, duration: .7, stagger: .02 });
      Kit.fade(tl, q('.st-dots'), { at: .6 });
      tl.fromTo(q('.st-star'), { autoAlpha: 0, scale: 0, transformOrigin: STAR[0] + 'px ' + STAR[1] + 'px' },
        { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, .7);
      Kit.draw(tl, qa('.sb0 .rp'), { at: .5, duration: .5 });
      Kit.show(tl, qa('.sc0 > *'), { at: .7, y: 12, stagger: .06, duration: .4 });
      tl.to(st, { k: 2, duration: .6, ease: 'none', onUpdate: render }, .9);

      // [click 1] a try that scores worse, so the search backs off
      ctx.pause();
      tl.addLabel('w');
      tl.to(st, { k: 4, duration: 1.1, ease: 'none', onUpdate: render }, 'w');
      tl.to(q('.st-c3a'), { autoAlpha: 1, duration: .01 }, 'w+=.5');
      Kit.draw(tl, qa('.st-c3a .rp'), { at: 'w+=.5', duration: .5 });
      Kit.show(tl, q('.st-c3'), { at: 'w+=.5', y: 10 });
      tl.to(q('.sb1'), { autoAlpha: 1, duration: .01 }, 'w+=.2');
      Kit.draw(tl, qa('.sb1 .rp'), { at: 'w+=.2', duration: .5 });
      Kit.show(tl, qa('.sc1 > *'), { at: 'w+=.4', y: 12, stagger: .06, duration: .4 });

      // [click 2] the belief about where good scores live
      ctx.pause();
      tl.addLabel('h');
      tl.to(qa('.st-heat, .st-leg'), { autoAlpha: 1, duration: .8 }, 'h');
      Kit.show(tl, qa('.st-lk, .st-ll'), { at: 'h+=.3', y: 10, stagger: .08, duration: .4 });
      tl.to(q('.sb2'), { autoAlpha: 1, duration: .01 }, 'h+=.2');
      Kit.draw(tl, qa('.sb2 .rp'), { at: 'h+=.2', duration: .5 });
      Kit.show(tl, qa('.sc2 > *'), { at: 'h+=.4', y: 12, stagger: .06, duration: .4 });

      // [click 3] the last tries land on the target
      ctx.pause();
      tl.addLabel('f');
      tl.to(st, { k: 6, duration: 1.1, ease: 'none', onUpdate: render }, 'f');
      tl.to(q('.dd-win'), { autoAlpha: 1, duration: .01 }, 'f+=1.0');
      Kit.draw(tl, qa('.dd-win .rp'), { at: 'f+=1.0', duration: .5, stagger: .02 });
      Kit.show(tl, q('.st-cap'), { at: 'f+=.6', y: 14 });
    },
    notes:
      'Step four. The star is where milk sits. The search does not know that; it only gets a score back for each point it tries. ' +
      'Flat drawing again, and these six tries are invented. ' +
      '[click] Try three scores worse than try two, so the search backs away from that direction. That is what makes it a search and not a straight line. ' +
      '[click] Underneath, it keeps a guess about where good scores live, and every result reshapes it. That is Bayesian optimization: predict, pick, update. ' +
      '[click] It picks the next point by trading promising against unexplored, and closes in. No cooking yet: only when a formula scores well do chefs make it.'
  };
  Kit.withCrumbs(STEER, STEPS, 3);

  /* ---------------------------------------------------------------- RULES */
  var DICT = [
    { n: 'chicken', a: true }, { n: 'tuna', a: true }, { n: 'milk', a: true }, { n: 'egg', a: true },
    { n: 'cabbage' }, { n: 'pineapple' }, { n: 'coconut' }
  ];
  var VEC = ['0.21  0.08  0.44  0.17  0.63', '0.33  0.71  0.12  0.40  0.28', '0.18  0.52  0.37  0.09  0.74',
    '0.46  0.25  0.60  0.31  0.11', '0.07  0.39  0.22  0.68  0.45', '0.55  0.14  0.81  0.26  0.33', '0.29  0.63  0.18  0.52  0.07'];
  var ZERO = '0.00  0.00  0.00  0.00  0.00';

  var RULES = {
    id: 'rules',
    title: 'Diet rules',
    heading: 'Diet rules',
    budgetSec: 40,
    html: function () {
      var rowY = DICT.map(function (d, i) { return 418 + i * 64; });
      var svg = svgOpen() +
        '<g class="ru-box">' + Kit.rough.rect(130, 364, 700, 556, { seed: 100, w: 'normal', stroke: C.text3 }) + '</g>' +
        DICT.map(function (d, i) {
          return '<text class="mono ru-n r' + i + '" x="160" y="' + rowY[i] + '" font-size="28">' + d.n + '</text>' +
            '<text class="mono ru-v f-dim v' + i + '" x="372" y="' + rowY[i] + '" font-size="28">' + VEC[i] + '</text>' +
            (d.a ? '<g class="ru-strike k' + i + '">' + Kit.rough.line(152, rowY[i] - 9, 812, rowY[i] - 9, { seed: 110 + i, w: 'normal', stroke: C.rustT, bow: .4, rough: .7 }) + '</g>' : '');
        }).join('') +
        '<text class="mono ru-more f-faint" x="160" y="' + (418 + 7 * 64) + '" font-size="28">… 823 more</text>' +
        // lane A: masked decoder
        '<g class="ru-mask">' + Kit.rough.rect(918, 362, 38, 128, { seed: 120, w: 'heavy', stroke: C.rustT, fill: C.rust, fillStyle: 'hachure', hachureGap: 8 }) + '</g>' +
        '<g class="ru-ba">' + Kit.rough.rect(966, 362, 240, 128, { seed: 121, w: 'heavy', hatch: 'var(--sec-t)', fillOpacity: .13, hachureGap: 22 }) + '</g>' +
        '<g class="ru-aa">' + Kit.rough.arrow(1218, 426, 1282, 426, { seed: 122, w: 'normal', head: 20 }) + '</g>' +
        // lane B: no mask
        '<g class="ru-bb">' + Kit.rough.rect(966, 694, 240, 128, { seed: 123, w: 'fine', stroke: C.text3 }) + '</g>' +
        '<g class="ru-ab">' + Kit.rough.arrow(1218, 758, 1282, 758, { seed: 124, w: 'fine', head: 16, stroke: C.text3 }) + '</g>' +
        '<g class="ru-x">' + Kit.rough.line(1298, 760, 1762, 760, { seed: 125, w: 'heavy', stroke: C.rustT, bow: .4, rough: .7 }) + '</g>' +
        '<g class="dd-ok">' + Kit.doodle.mark(1238, 556, 34, 'check', { seed: 261 }) + '</g>' +
        '<g class="dd-no">' + Kit.doodle.mark(1238, 910, 28, 'x', { seed: 262, color: 'var(--rust-t)' }) + Kit.doodle.fork(1684, 962, 128, { seed: 263, rot: 16 }) + '</g>' +
      '</svg>';
      return svg +
        '<div class="t-caps ru-k1">Ingredient dictionary · 830 rows</div>' +
        '<div class="t-body ru-cap">Blank the row and the decoder cannot reach it.</div>' +
        '<div class="t-caps ru-mk">Mask</div>' +
        '<div class="t-label ru-dec ru-da">Decoder</div>' +
        '<div class="t-label ru-dec ru-db">Decoder</div>' +
        '<div class="t-mono ru-out ru-oa">cabbage · pineapple · coconut</div>' +
        '<div class="chip ru-chip ru-ca"><span class="dot"></span>every try is usable</div>' +
        '<div class="t-caps faint ru-k2">Without the mask</div>' +
        '<div class="t-mono ru-out ru-ob">cabbage · <b class="c-rust">chicken</b> · coconut</div>' +
        '<div class="chip ru-chip ru-cb"><span class="dot"></span>a wasted try</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ru-strike, .ru-mask, .ru-mk, .ru-aa, .ru-cap, .ru-oa, .ru-ca, .ru-k2, .ru-bb, .ru-ab, .ru-db, .ru-ob, .ru-x, .ru-cb, .dd-ok, .dd-no'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.ru-k1'), { at: .15 });
      Kit.draw(tl, qa('.ru-box .rp'), { at: .25, duration: .8 });
      tl.fromTo(qa('.ru-n, .ru-v'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .3, stagger: .03 }, .4);
      Kit.fade(tl, q('.ru-more'), { at: .9 });
      Kit.draw(tl, qa('.ru-ba .rp'), { at: .6, duration: .6 });
      Kit.fade(tl, q('.ru-da'), { at: .8 });

      // [click 1] blank the animal rows, and the decoder can only propose plants
      ctx.pause();
      tl.addLabel('m');
      Kit.show(tl, q('.ru-cap'), { at: 'm', y: 10 });
      tl.to(q('.ru-aa'), { autoAlpha: 1, duration: .01 }, 'm+=.7');
      Kit.draw(tl, qa('.ru-aa .rp'), { at: 'm+=.7', duration: .4 });
      DICT.forEach(function (d, i) {
        if (!d.a) return;
        tl.to(q('.v' + i), { autoAlpha: 0, duration: .2 }, 'm+=' + (i * .08));
        tl.add(function () { q('.v' + i).textContent = ZERO; q('.v' + i).classList.add('f-faint'); q('.r' + i).classList.add('f-faint'); }, 'm+=' + (i * .08 + .2));
        tl.to(q('.v' + i), { autoAlpha: 1, duration: .25 }, 'm+=' + (i * .08 + .22));
        tl.to(q('.k' + i), { autoAlpha: 1, duration: .01 }, 'm+=' + (i * .08 + .25));
        Kit.draw(tl, qa('.k' + i + ' .rp'), { at: 'm+=' + (i * .08 + .25), duration: .35 });
      });
      tl.fromTo(q('.ru-mask'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: .5, ease: Kit.ease.out }, 'm+=.5');
      Kit.show(tl, q('.ru-mk'), { at: 'm+=.6', y: 10 });
      Kit.show(tl, q('.ru-oa'), { at: 'm+=.8', y: 12 });
      Kit.show(tl, q('.ru-ca'), { at: 'm+=1.0', y: 12 });
      tl.to(q('.dd-ok'), { autoAlpha: 1, duration: .01 }, 'm+=1.2');
      Kit.draw(tl, qa('.dd-ok .rp'), { at: 'm+=1.2', duration: .35 });

      // [click 2] what the alternative costs
      ctx.pause();
      tl.addLabel('b');
      Kit.show(tl, q('.ru-k2'), { at: 'b', y: 10 });
      tl.to(qa('.ru-bb, .ru-ab'), { autoAlpha: 1, duration: .01 }, 'b+=.1');
      Kit.draw(tl, qa('.ru-bb .rp, .ru-ab .rp'), { at: 'b+=.1', duration: .5 });
      Kit.show(tl, qa('.ru-db, .ru-ob'), { at: 'b+=.3', y: 10, stagger: .08 });
      tl.to(q('.ru-x'), { autoAlpha: 1, duration: .01 }, 'b+=.8');
      Kit.draw(tl, qa('.ru-x .rp'), { at: 'b+=.8', duration: .4, stagger: .1 });
      Kit.show(tl, q('.ru-cb'), { at: 'b+=1.1', y: 12 });
      tl.to(q('.dd-no'), { autoAlpha: 1, duration: .01 }, 'b+=1.3');
      Kit.draw(tl, qa('.dd-no .rp'), { at: 'b+=1.3', duration: .35, stagger: .05 });
    },
    notes:
      'NotMilk has to be plant-only, and that rule is not applied at the end. Every ingredient is a row of numbers. ' +
      '[click] For a vegan product, the animal rows are zeroed before the decoder chooses. It picks the row closest to its state, and zeros can never win, so chicken is unreachable. Language models use the same trick. ' +
      '[click] The alternative is to propose anything and throw away whatever has chicken in it. Every thrown-away candidate costs one of your few tries. ' +
      'Masking rather than filtering afterwards is my reading of the patents.'
  };
  Kit.withCrumbs(RULES, STEPS, 1);   // the mask acts at the decoder

  /* -------------------------------------------------------------- RESULTS */
  var RCUTS = [
    { img: 'pineapple.webp', n: 'pineapple juice', rot: -4 },
    { img: 'cabbage.webp', n: 'cabbage juice', rot: 3 },
    { img: 'chicory.webp', n: 'chicory root', rot: -3 },
    { img: 'coconut.webp', n: 'coconut', rot: 4 }
  ];

  var RESULTS = {
    id: 'results',
    title: 'Results',
    heading: 'Results',
    budgetSec: 55,
    html: function () {
      var cuts = RCUTS.map(function (c, i) {
        return Kit.photo(IMG + c.img, { x: 130 + i * 235, y: 352, w: 200, rot: c.rot, cls: 'rs-cut q' + i, alt: c.n }) +
          '<div class="t-label rs-lab l' + i + '" style="left:' + (130 + i * 235) + 'px">' + c.n + '</div>';
      }).join('');
      var svg = svgOpen() +
        '<g class="rs-arr">' + Kit.rough.arrow(1046, 470, 1152, 470, { seed: 130, w: 'heavy', head: 28, stroke: C.saffronT }) + '</g>' +
        // the product, drawn rather than photographed: a plain gable-top carton, no brand marks
        '<g class="rs-pack">' +
          Kit.rough.path('M1212 440 L1212 700 L1428 700 L1428 440 Z', { seed: 133, w: 'heavy' }) +
          Kit.rough.path('M1212 440 L1258 378 L1382 378 L1428 440', { seed: 134, w: 'heavy' }) +
          Kit.rough.line(1258, 378, 1382, 378, { seed: 136, w: 'heavy' }) +
          Kit.rough.rect(1240, 512, 160, 96, { seed: 135, w: 'normal', stroke: C.saffronT, overshoot: 8, hatch: C.saffron, fillOpacity: .5, hachureGap: 15 }) +
        '</g>' +
        '<g class="rs-ca">' + Kit.doodle.underline(134, 642, 428, { seed: 131, color: 'var(--rust-t)' }) + '</g>' +
        '<g class="rs-cb">' + Kit.rough.arrow(1532, 848, 1436, 708, { seed: 132, w: 'fine', head: 16, stroke: C.rustT, bend: -18 }) + '</g>' +
        '<g class="dd-pack">' + Kit.doodle.sparkle(1498, 384, 44, { seed: 272, w: 'normal' }) + Kit.doodle.twinkles(1160, 404, 40, { seed: 273 }) + '</g>' +
        '<g class="dd-spoon">' + Kit.doodle.sprig(272, 886, 158, { seed: 275, rot: -12 }) + '</g>' +
        '<g class="dd-fast">' + Kit.rough.ellipse(848, 824, 486, 192, { seed: 274, w: 'heavy', stroke: C.rustT, rough: .55, bow: 1.1, cls: 'dd' }) + '</g>' +
      '</svg>';
      return svg + cuts +
        '<div class="t-caps rs-k">Giuseppe’s answer for milk</div>' +
        '<div class="t-label rs-pl">NotMilk, 2020</div>' +
        '<div class="callout rs-c1">pineapple + cabbage → lactones</div>' +
        '<div class="t-label dim rs-c1l">aroma compounds found in dairy</div>' +
        '<div class="callout rs-c2">the first batch came out green</div>' +
        '<div class="t-label dim rs-c2l">the score does not model colour</div>' +
        '<div class="rs-num"><div class="t-num c-saffron">10 → <span class="v">10</span></div>' +
          '<div class="t-label dim">months to develop a milk product</div></div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.rs-pack, .rs-pl, .rs-arr, .rs-c1, .rs-c1l, .rs-ca, .rs-c2, .rs-c2l, .rs-cb, .rs-num, .dd-pack, .dd-fast, .dd-spoon'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.rs-k'), { at: .2 });
      Kit.drop(tl, qa('.rs-cut'), { at: .3, stagger: .12 });
      tl.fromTo(qa('.rs-lab'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .12 }, .6);
      tl.to(q('.dd-spoon'), { autoAlpha: 1, duration: .01 }, 1.0);
      Kit.draw(tl, qa('.dd-spoon .rp'), { at: 1.0, duration: .6 });

      // [click 1] why those two, and what chefs made of it
      ctx.pause();
      tl.addLabel('p');
      Kit.show(tl, q('.rs-c1'), { at: 'p', y: 10 });
      tl.to(q('.rs-ca'), { autoAlpha: 1, duration: .01 }, 'p');
      Kit.draw(tl, qa('.rs-ca .rp'), { at: 'p', duration: .45 });
      Kit.show(tl, q('.rs-c1l'), { at: 'p+=.35', y: 10 });
      tl.to(q('.rs-arr'), { autoAlpha: 1, duration: .01 }, 'p+=.6');
      Kit.draw(tl, qa('.rs-arr .rp'), { at: 'p+=.6', duration: .45 });
      tl.to(q('.rs-pack'), { autoAlpha: 1, duration: .01 }, 'p+=.9');
      Kit.draw(tl, qa('.rs-pack .rp'), { at: 'p+=.9', duration: .7, stagger: .05 });
      Kit.show(tl, q('.rs-pl'), { at: 'p+=1.4', y: 10 });
      tl.to(q('.dd-pack'), { autoAlpha: 1, duration: .01 }, 'p+=1.5');
      Kit.draw(tl, qa('.dd-pack .rp'), { at: 'p+=1.5', duration: .45, stagger: .03 });

      // [click 2] the speed-up NotCo claims
      ctx.pause();
      tl.addLabel('n');
      Kit.show(tl, q('.rs-num'), { at: 'n', y: 16 });
      Kit.count(tl, q('.rs-num .v'), { from: 10, to: 2, duration: 1.0, at: 'n+=.2' });
      tl.to(q('.dd-fast'), { autoAlpha: 1, duration: .01 }, 'n+=1.1');
      Kit.draw(tl, qa('.dd-fast .rp'), { at: 'n+=1.1', duration: .8 });

      // [click 3] what the score could not see
      ctx.pause();
      tl.addLabel('g');
      Kit.show(tl, q('.rs-c2'), { at: 'g', y: 10 });
      tl.to(q('.rs-cb'), { autoAlpha: 1, duration: .01 }, 'g');
      Kit.draw(tl, qa('.rs-cb .rp'), { at: 'g', duration: .45 });
      Kit.show(tl, q('.rs-c2l'), { at: 'g+=.35', y: 10 });
    },
    notes:
      'They gave Giuseppe the measured profile of cow’s milk, and this is what came back. Pineapple juice, cabbage juice, chicory root and coconut. Nobody would have written that down. ' +
      '[click] NotCo says the first two were picked to make lactones, the aroma compounds that make dairy smell like dairy. Chefs refined it into the product you can buy. ' +
      '[click] NotCo also says the second time they made a milk, it took two months instead of ten. That is their own figure, with no control group. ' +
      'The carton is my drawing, not their packaging. ' +
      '[click] And the honest part: the first batch came out green. Colour is not in the score. The search optimised what it could measure, and a person had to catch the rest.'
  };

  /* ------------------------------------------------------------ TAKEAWAYS */
  var TK = [
    ['01', 'Learn the space, then search it', 'generate + score', 'A score aims a generative model at a target.'],
    ['02', 'Put the rules inside the search', 'constrained decoding', 'Block a choice before it is made, not after.']
  ];
  var MARKS = [['Read', 'teal'], ['Find', 'olive'], ['Mix', 'saffron'], ['Sell', 'cranberry'], ['Next', 'plum']];
  var TKP = proj(1348, 352, 448);

  var TAKEAWAYS = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 45,
    html: function () {
      var pts = TRY.map(function (t) { return TKP(t.u, t.v); });
      var trail = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L');
      var svg = svgOpen('tk-svg') +
        '<g class="tk-map">' + Kit.rough.rect(1348, 352, 448, 448, { seed: 7, w: 'normal', rough: 1.1 }) + '</g>' +
        mapDots(TKP, { rs: .7, op: .7 }) +
        '<path d="' + trail + '" fill="none" stroke="' + C.saffronT + '" stroke-width="2.5" stroke-dasharray="5 6"/>' +
        pts.map(function (p, i) {
          return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="7" fill="' + (i === pts.length - 1 ? C.rust : C.saffron) + '"/>';
        }).join('') +
        '<g class="dd-hit">' + Kit.doodle.circle(pts[pts.length - 1][0] - 28, pts[pts.length - 1][1] - 28, 56, 56, { seed: 281, color: 'var(--rust-t)' }) + '</g>' +
        '<g class="dd-whisk">' + Kit.doodle.pot(1572, 916, 148, { seed: 284 }) + '</g>' +
        '<g class="dd-u0">' + Kit.doodle.underline(252, 416, 700, { seed: 282 }) + '</g>' +
        '<g class="dd-u1">' + Kit.doodle.underline(252, 672, 692, { seed: 283 }) + '</g>' +
      '</svg>';
      var rows = TK.map(function (r, i) {
        return '<div class="tk-row t' + i + '" style="top:' + (344 + i * 256) + 'px">' +
          '<div class="t-h2 tk-n">' + r[0] + '</div>' +
          '<div class="tk-body"><div class="t-h2 tk-rule">' + r[1] + '</div>' +
            '<div class="t-caps c-saffron tk-tag">' + r[2] + '</div>' +
            '<div class="t-body dim tk-line">' + r[3] + '</div></div>' +
        '</div>';
      }).join('');
      var strip = MARKS.map(function (m, i) {
        return (i ? '<span class="tk-sep">·</span>' : '') +
          '<span class="tk-tok k' + i + (i === 2 ? ' tk-on' : '') + '"><span class="t-caps">' + m[0] + '</span></span>';
      }).join('');
      return svg + rows + '<div class="tk-strip">' + strip + '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.t0 > *, .t1 > *'), { autoAlpha: 0 });
      gsap.set(qa('.dd-u0, .dd-u1, .dd-hit, .dd-whisk'), { autoAlpha: 0 });
      gsap.set(qa('.tk-tok:not(.tk-on) .t-caps'), { color: C.text3 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.tk-svg'), { at: .2 });
      Kit.fade(tl, q('.tk-strip'), { at: .4 });
      tl.to(q('.dd-hit'), { autoAlpha: 1, duration: .01 }, .7);
      Kit.draw(tl, qa('.dd-hit .rp'), { at: .7, duration: .6 });
      tl.to(q('.dd-whisk'), { autoAlpha: 1, duration: .01 }, .9);
      Kit.draw(tl, qa('.dd-whisk .rp'), { at: .9, duration: .7, stagger: .03 });

      // [click 1] lesson one
      ctx.pause();
      Kit.show(tl, qa('.t0 > *'), { y: 18, stagger: .08, duration: .5 });
      tl.to(q('.dd-u0'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-u0 .rp'), { at: '<', duration: .5 });

      // [click 2] lesson two, and the hand-off to the next section
      ctx.pause();
      Kit.show(tl, qa('.t1 > *'), { y: 18, stagger: .08, duration: .5 });
      tl.to(q('.dd-u1'), { autoAlpha: 1, duration: .01 }, '>-.2');
      Kit.draw(tl, qa('.dd-u1 .rp'), { at: '<', duration: .5 });
      tl.to(q('.k3 .t-caps'), { color: C.cranberryT, duration: .5 }, '>-.1');
    },
    notes:
      'Two things to take away from this section. ' +
      '[click] One: when the thing you are choosing is a list, learn a space you can move through, then search it with a score. The same shape shows up in drug design, where molecules go in and a predictor scores them. The score is what aims a generative model at a target. ' +
      '[click] Two: put the hard rules inside the search, not after it. Blocking a choice before it is made costs nothing; filtering afterwards costs you tries you cannot afford. ' +
      'That is Mix. Next: what happened to the company that built this.'
  };

  Deck.section({
    id: 'giuseppe', order: 3, num: '03', kicker: 'Mix', title: 'NotCo Giuseppe', color: 'saffron',
    toss: 'assets/img/giuseppe/tomato.webp',
    slides: [PROBLEM, APPROACH, MAP, SCORE, STEER, RULES, RESULTS, TAKEAWAYS]
  });
})();
