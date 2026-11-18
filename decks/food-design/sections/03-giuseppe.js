/* ==========================================================================
   03 · Mix · NotCo Giuseppe   (budget 390 s)
   Spec: specs/giuseppe.md. Roadmap cards / crumbs: Map → Decode → Score → Steer.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/giuseppe/';
  var STEPS = ['Map', 'Decode', 'Score', 'Steer'];
  var PATENT = 'Architecture: US 11,164,069 (patented design; production use not confirmed).';

  /* deterministic pseudo-random numbers, so dots land in the same place in show, print and preview */
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  /* ------------------------------------------------------------------ MAP */
  // map square in stage px; inner area is inset 20 px
  var MX = 700, MY = 290, MS = 540, IN = 20;
  function mp(u, v) { return [MX + IN + u * (MS - 2 * IN), MY + IN + v * (MS - 2 * IN)]; }
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

  function mapDots() {
    var r = rng(4242), out = '';
    CLUSTERS.forEach(function (c, ci) {
      for (var i = 0; i < c.n; i++) {
        var u = Math.min(.97, Math.max(.03, c.u + gauss(r) * c.s)), v = Math.min(.97, Math.max(.03, c.v + gauss(r) * c.s));
        var p = mp(u, v);
        out += '<circle class="gp-dot k' + ci + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5" fill="' + C.chalk + '" opacity=".55"/>';
      }
    });
    for (var j = 0; j < 40; j++) {
      var q = mp(.04 + r() * .92, .04 + r() * .92);
      if (KEEP_OUT.some(function (k) { return q[0] > k[0] && q[0] < k[2] && q[1] > k[1] && q[1] < k[3]; })) continue;
      out += '<circle class="gp-dot k3" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="4.5" fill="' + C.chalk + '" opacity=".28"/>';
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
        '<g class="gp-border">' + Kit.rough.rect(MX, MY, MS, MS, { seed: 7, sw: 3, rough: .9 }) + '</g>' +
        // encoder / decoder wedges: cream outline + saffron overlay that lights up when data passes through
        '<g class="gp-enc">' + wedge(586, ENC[1], 672, 230, 70, { seed: 8, sw: 3 }) + '</g>' +
        '<g class="gp-enc-on">' + wedge(586, ENC[1], 672, 230, 70, { seed: 8, sw: 4, stroke: C.saffron, fill: C.saffron, fillStyle: 'hachure', hachureGap: 12, fillWeight: 2 }) + '</g>' +
        '<g class="gp-dec">' + wedge(1268, DEC[1], 1354, 70, 230, { seed: 9, sw: 3 }) + '</g>' +
        '<g class="gp-dec-on">' + wedge(1268, DEC[1], 1354, 70, 230, { seed: 9, sw: 4, stroke: C.saffron, fill: C.saffron, fillStyle: 'hachure', hachureGap: 12, fillWeight: 2 }) + '</g>' +
        '<text class="t-caps gp-wl" x="690" y="716" text-anchor="end" font-size="24">ENCODER</text>' +
        '<text class="t-caps gp-wl" x="1252" y="716" font-size="24">DECODER</text>' +
        // map interior
        '<g class="gp-dots">' + mapDots() + '</g>' +
        CLUSTERS.map(function (c, i) {
          return '<text class="gp-clab k' + i + '" x="' + c.lab[0] + '" y="' + c.lab[1] + '" font-size="28" font-weight="600">' + c.name + '</text>';
        }).join('') +
        // decode path: P → decoder → rebuilt list
        '<g class="gp-out">' + Kit.rough.curve([[P[0] + 16, P[1] - 4], [1010, 690], [1160, 640], [1300, 566]], { seed: 14, sw: 3, stroke: C.saffronT }) +
          Kit.rough.arrow(1356, 560, 1392, 470, { seed: 15, sw: 3, stroke: C.saffronT, head: 16, bend: -14 }) + '</g>' +
        // neighbours A, B and the chord between them
        '<g class="gp-chord">' + Kit.rough.line(A[0], A[1], B[0], B[1], { seed: 16, sw: 2.5, stroke: C.text2 }) + '</g>' +
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
        '<g class="gp-c1a">' + Kit.rough.arrow(770, 392, (A[0] + M[0]) / 2 - 4, (A[1] + M[1]) / 2 - 14, { seed: 17, sw: 2.6, stroke: C.rustT, head: 15, bend: 16 }) + '</g>' +
        '<g class="gp-c2a">' + Kit.rough.arrow(990, 566, M[0] + 20, M[1] + 12, { seed: 18, sw: 2.6, stroke: C.rustT, head: 15, bend: -18 }) + '</g>' +
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
        caps.map(function (t, i) { return '<div class="t-body gp-cap cap' + i + '">' + t + '</div>'; }).join('') +
        '<div class="t-label faint gp-note">Drawn in 2-D. The real space has more dimensions.</div>' +
        Kit.src(PATENT + ' Clusters, recipes and positions are illustrative.');
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

      gsap.set(qa('.gp-enc-on, .gp-dec-on, .gp-p, .gp-dots, .gp-clab, .gp-nb, .gp-m, .gp-rows .gp-row, .gp-rb > div, .callout, .gp-cap, .gp-c1a, .gp-c2a'), { autoAlpha: 0 });

      // entrance
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.gp-k1, .gp-in, .gp-wl, .gp-k2, .gp-note, .src'), { at: .2, stagger: .04 });
      Kit.drop(tl, qa('.gp-cut img'), { at: .15, stagger: .08 });
      Kit.draw(tl, qa('.gp-border .rp, .gp-enc .rp, .gp-dec .rp'), { at: .3, duration: .8 });
      tl.fromTo(qa('.gp-out .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);
      tl.fromTo(qa('.gp-chord .rp'), { drawSVG: '0%' }, { drawSVG: '0%', duration: .01 }, 0);

      // [click 1] squeeze: the recipe travels through the encoder and becomes point P
      ctx.pause();
      tl.to(qa('.gp-enc-on'), { autoAlpha: 1, duration: .3 }, 'sq');
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
      Kit.show(tl, q('.cap4'), { at: 'm+=.4', y: 12 });
    },
    notes:
      'First step: the map. The model behind this is called an autoencoder: two networks joined at a narrow waist. ' +
      '[click] The encoder takes one recipe, here tomato, garlic and basil, and squeezes the whole ingredient list into a single point. Call it P. ' +
      '[click] The decoder does the reverse. It reads P back out as an ingredient list, one ingredient at a time, and training rewards it for getting the same list back. ' +
      '[click] Train that on thousands of recipes people have actually cooked, and similar recipes end up near each other. Sauces sit together, dairy sits together. ' +
      '[click] So points close together decode to nearly the same list. A is tomato and onion, B is tomato and cream. One swap apart. ' +
      '[click] And here is the property the search needs. The training keeps the map evenly filled, so a point between A and B, like M, still decodes into a sensible recipe: tomato, onion and cream. No holes. ' +
      'What the map knows is which ingredients go together. It does not know whether anything tastes like milk. That\'s the next step.'
  };
  Kit.withCrumbs(MAP, STEPS, 0);

  Deck.section({
    id: 'giuseppe', order: 3, num: '03', kicker: 'Mix', title: 'NotCo Giuseppe', color: 'saffron',
    sweep: ['saffron', 'rust', 'saffron', 'charcoal', 'saffron', 'olive'],
    slides: [MAP]
  });
})();
