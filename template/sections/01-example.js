/* ==========================================================================
   01 · Example section — one slide per pattern   (budget 180 s total)
   TEMPLATE: copy a pattern, then delete this file. Patterns, in story-spine order:
     problem   heading + click steps (one reason per click)
     approach  roadmap; every technique slide after it carries Kit.withCrumbs(STEPS, k)
     mechanism interactive state + render(), tweened and draggable (the LOSS pattern)
     results   big number with Kit.count and a Kit.src(..., 'Self-reported') footer
     takeaways the shared 2-row pattern: transferable lessons, not product facts
   Every value below is a placeholder. Real numbers must come from sources/*.md.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* ======================================================================
     PROBLEM — heading + click steps (30 s)
     Steps: 0 the question · 1 reason one · 2 reason two
     ====================================================================== */
  var PROBLEM = {
    id: 'problem',
    title: 'The problem',
    heading: 'The problem',
    budgetSec: 30,
    html: function () {
      return '' +
        '<div class="t-h2 ex-q" style="position:absolute;left:120px;top:300px;width:1500px">State the question the product must answer</div>' +
        ['First reason it is hard', 'Second reason it is hard'].map(function (t, i) {
          return '<div class="card ex-why w' + i + '" style="position:absolute;left:' + (120 + i * 860) + 'px;top:520px;width:800px">' +
            '<div class="t-caps faint">Reason ' + (i + 1) + '</div>' +
            '<div class="t-body" style="margin-top:12px">' + t + '</div>' +
          '</div>';
        }).join('');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ex-why'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.ex-q'), { at: .3 });
      ctx.pause();
      Kit.show(tl, q('.w0'));
      ctx.pause();
      Kit.show(tl, q('.w1'));
    },
    notes:
      'Start with the problem, in the audience\'s words. Say why it matters before any technique appears.' +
      '[click] The first reason it is hard.' +
      '[click] The second reason. These reasons are what the techniques later solve.'
  };

  /* ======================================================================
     APPROACH — the roadmap (30 s). Step names must match the crumbs exactly.
     ====================================================================== */
  var STEPS = ['Step one', 'Step two'];
  var CARDS = [
    { q: 'What this step answers', tech: 'Technique name' },
    { q: 'What this step answers', tech: 'Technique name' }
  ];
  var APPROACH = {
    id: 'approach',
    title: 'How it works',
    heading: 'How it works',
    budgetSec: 30,
    html: function () {
      return CARDS.map(function (c, i) {
        var x = 120 + i * 860;
        return (i ? '<div class="ex-arr t-h2" style="position:absolute;left:' + (x - 70) + 'px;top:440px">→</div>' : '') +
          '<div class="card ex-ap ap' + i + '" style="position:absolute;left:' + x + 'px;top:300px;width:780px">' +
            '<div class="t-caps faint">Step ' + (i + 1) + '</div>' +
            '<div class="t-h2" style="margin-top:10px">' + STEPS[i] + '</div>' +
            '<div class="t-body dim" style="margin-top:14px">' + c.q + '</div>' +
            '<div class="chip" style="margin-top:28px"><span class="dot"></span>' + c.tech + '</div>' +
          '</div>';
      }).join('') +
      Kit.src('Source for the structure: report, section name.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ap1, .ex-arr'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.ap0'), { at: .25 });
      ctx.pause();
      Kit.show(tl, qa('.ex-arr, .ap1'), { stagger: .12 });
    },
    notes:
      'The product solves this in two steps. Step one answers the first question.' +
      '[click] Step two uses that answer. Every slide after this one shows which step we are on, top right.'
  };

  /* ======================================================================
     MECHANISM — state + render() (60 s). The LOSS pattern:
       keep one state object, write one pure render(), tween the state with onUpdate: render.
       Back-navigation and print mode are then correct for free.
     Steps: 0 the line · 1 the threshold moves · 2 drag it yourself
     ====================================================================== */
  var SW = 1500, SH = 420, X0 = 60, X1 = 1440, BASE = 250;
  function X(v) { return X0 + v * (X1 - X0); }
  var POINTS = [.08, .17, .29, .36, .48, .55, .63, .71, .84, .93];

  var MECH = {
    id: 'mechanism',
    title: 'A threshold',
    heading: 'A threshold',
    budgetSec: 60,
    html: function () {
      return '' +
        '<svg class="mx" width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '" style="position:absolute;left:210px;top:330px;overflow:visible">' +
          '<line x1="' + X0 + '" y1="' + BASE + '" x2="' + X1 + '" y2="' + BASE + '" stroke="' + C.line + '" stroke-width="4"/>' +
          '<text x="' + X0 + '" y="' + (BASE + 60) + '" font-family="JetBrains Mono" font-size="28" fill="' + C.text3 + '">0.0</text>' +
          '<text x="' + X1 + '" y="' + (BASE + 60) + '" text-anchor="end" font-family="JetBrains Mono" font-size="28" fill="' + C.text3 + '">1.0</text>' +
          POINTS.map(function (p, i) { return '<circle class="pt" data-i="' + i + '" cx="' + X(p) + '" cy="' + BASE + '" r="18"/>'; }).join('') +
          '<g class="th" style="cursor:ew-resize">' +
            '<rect class="th-hit" y="20" width="80" height="' + (BASE + 20) + '" fill="transparent"/>' +
            '<line class="th-line" y1="60" y2="' + (BASE + 30) + '" stroke="' + C.orange + '" stroke-width="6"/>' +
            '<text class="th-val" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="30" font-weight="700" fill="' + C.orangeT + '"></text>' +
          '</g>' +
        '</svg>' +
        '<div class="t-h2 ex-read" style="position:absolute;left:120px;top:800px"><span class="ex-n t-mono c-orange"></span> of 10 above the line</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var svg = q('svg.mx'), pts = qa('.pt');
      var st = { t: .5 };                      // threshold position, 0..1
      function render() {
        var x = X(st.t), n = 0;
        q('.th-line').setAttribute('x1', x); q('.th-line').setAttribute('x2', x);
        q('.th-hit').setAttribute('x', x - 40);
        q('.th-val').setAttribute('x', x); q('.th-val').textContent = st.t.toFixed(2);
        pts.forEach(function (c, i) {
          var on = POINTS[i] >= st.t; if (on) n++;
          c.setAttribute('fill', on ? C.blue : C.surface);
          c.setAttribute('stroke', on ? C.blueT : C.line); c.setAttribute('stroke-width', 3);
        });
        q('.ex-n').textContent = n;
      }
      var R = { onUpdate: render };
      render();

      var detach = Kit.dragX(svg, q('.th'), function (x) {
        st.t = Math.max(0, Math.min(1, (x - X0) / (X1 - X0)));
        render();
      });
      ctx.cleanup(detach);

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, [svg, q('.ex-read')], { at: .3 });
      ctx.pause();
      tl.to(st, Object.assign({ t: .25, duration: 1.2, ease: 'power2.inOut' }, R));
      ctx.pause();
      tl.to(st, Object.assign({ t: .6, duration: 1.0, ease: 'power2.inOut' }, R));
    },
    notes:
      'Each dot is one example, placed by its score. The orange line is the threshold. Everything to the right of it counts.' +
      '[click] Move the threshold down and more examples count. That is the trade-off this step controls.' +
      '[click] Move it back up and fewer count. You can drag the line yourself here.'
  };

  /* ======================================================================
     RESULTS — big number + source flag (30 s)
     ====================================================================== */
  var RESULTS = {
    id: 'results',
    title: 'Results',
    heading: 'Results',
    budgetSec: 30,
    html: function () {
      return '' +
        '<div class="bignum" style="position:absolute;left:120px;top:330px">' +
          '<span class="t-num ex-big">+0%</span>' +
          '<span class="t-label">What the number measures, in plain words</span>' +
        '</div>' +
        '<div class="bignum" style="position:absolute;left:980px;top:330px">' +
          '<span class="t-num ex-big2">0</span>' +
          '<span class="t-label">A second result with its unit</span>' +
        '</div>' +
        Kit.src('Company blog post, month year.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.bignum')[1], { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.bignum')[0], { at: .25 });
      Kit.count(tl, q('.ex-big'), { to: 12.5, decimals: 1, prefix: '+', suffix: '%', at: .4 });
      ctx.pause();
      Kit.show(tl, qa('.bignum')[1]);
      Kit.count(tl, q('.ex-big2'), { to: 100, suffix: 'M', at: '<' });
    },
    notes:
      'The headline result. Say who measured it. This one is the company\'s own number, so the footer flags it as self-reported.' +
      '[click] A second result, if it adds something the first one does not.'
  };

  /* ======================================================================
     TAKEAWAYS — the shared pattern: 2 rows, one line each, transferable.
     Each row says when to use the technique or what it is good or bad at.
     ====================================================================== */
  var TK = [
    ['01', 'When to use it', 'One line the student can use beyond this product'],
    ['02', 'Where it breaks', 'One line on the technique\'s limit']
  ];
  var TAKEAWAYS = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 30,
    html: function () {
      return TK.map(function (r, i) {
        return '<div class="tk-row r' + i + '" style="top:' + (355 + i * 210) + 'px">' +
          '<div class="n t-mono">' + r[0] + '</div><div class="rule"></div>' +
          '<div class="tg t-caps">' + r[1] + '</div>' +
          '<div class="ln t-h2">' + r[2] + '</div>' +
        '</div>';
      }).join('');
    },
    build: function (ctx) {
      var tl = ctx.tl, qa = ctx.qa;
      gsap.set(qa('.r1 > *'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.r0 > *'), { at: .3, stagger: .07 });
      ctx.pause();
      Kit.show(tl, qa('.r1 > *'), { stagger: .07 });
    },
    notes:
      'Two things to take away, beyond this product. First, when this technique is the right tool.' +
      '[click] Second, where it stops working.'
  };

  Deck.section({
    id: 'example', order: 1, num: '01', kicker: 'Marker', title: 'Example section', color: 'blue',
    slides: [
      PROBLEM, APPROACH,
      Kit.withCrumbs(MECH, STEPS, 0),
      RESULTS, TAKEAWAYS
    ]
  });
})();
