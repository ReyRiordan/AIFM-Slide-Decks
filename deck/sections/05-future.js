/* ==========================================================================
   05 · Negotiate — Future markets   (budget 225 s)
   Flow: Vending-Bench setup → live leaderboard → deception
         → agent-to-agent negotiation → personalized pricing → HTTP 402
         → summary → closing question
   Spec: specs/future.md
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* small local helpers (kept inside this IIFE per KIT §3) */
  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      (o.cls ? ' class="' + o.cls + '"' : '') +
      ' text-anchor="' + (o.anchor || 'start') + '"' +
      ' font-family="' + (o.mono ? 'JetBrains Mono' : 'Archivo') + '"' +
      ' font-size="' + (o.size || 28) + '" font-weight="' + (o.w || 500) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      ' fill="' + (o.fill || C.text2) + '">' + s + '</text>';
  }
  function arrowDef(id, fill) {
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="' + fill + '"/></marker>';
  }

  /* ======================================================================
     1 · VENDING — "Vending-Bench"   (22 s · 2 clicks)
     ONE IDEA: the benchmark hands a model a whole small business and grades
     exactly one number. The results are the next slide.
     ====================================================================== */
  var VENDING = {
    id: 'vending',
    title: 'Vending-Bench setup',
    heading: 'Vending-Bench',
    budgetSec: 22,
    html: function () {
      var dot = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + C.green + '"/>'; };
      var job = function (cls, x, y, s) {
        return '<g class="' + cls + '">' + dot(x, y - 10) + txt(x + 26, y, s, { size: 32, w: 600, fill: C.text }) + '</g>';
      };
      return '' +
      '<div class="setup t-h2" style="position:absolute;left:120px;top:290px;width:1600px;font-weight:500;color:var(--text-2)">' +
        'One vending machine. One simulated year.' +
      '</div>' +
      '<svg class="vs" width="1680" height="420" viewBox="0 0 1680 420" style="position:absolute;left:120px;top:430px;overflow:visible">' +
        '<defs>' + arrowDef('vsA', C.text3) + arrowDef('vsB', C.orangeT) + '</defs>' +
        // left: the starting cash
        txt(0, 170, 'STARTS WITH', { size: 28, w: 700, ls: 2, fill: C.text3 }) +
        txt(0, 236, '$500', { mono: true, size: 52, w: 700, fill: C.text }) +
        '<line class="a1" x1="200" y1="210" x2="300" y2="210" stroke="' + C.text3 + '" stroke-width="4" marker-end="url(#vsA)"/>' +
        // middle: the job
        '<rect class="jobbox" x="330" y="40" width="880" height="340" rx="28" fill="#353032"/>' +
        txt(378, 118, 'THE MODEL RUNS IT ALONE', { size: 28, w: 700, ls: 2, fill: C.text3 }) +
        job('j0', 378, 210, 'finds suppliers') +
        job('j1', 378, 290, 'negotiates by email') +
        job('j2', 812, 210, 'pays invoices') +
        job('j3', 812, 290, 'sets prices') +
        // right: the only score
        '<g class="score">' +
          '<line class="a2" x1="1240" y1="210" x2="1340" y2="210" stroke="' + C.orangeT + '" stroke-width="4" marker-end="url(#vsB)"/>' +
          txt(1380, 170, 'SCORED ON', { size: 28, w: 700, ls: 2, fill: C.text3 }) +
          txt(1380, 228, 'the final bank', { size: 40, w: 700, fill: C.orangeT }) +
          txt(1380, 276, 'balance', { size: 40, w: 700, fill: C.orangeT }) +
        '</g>' +
      '</svg>' +
      Kit.src('Andon Labs, Vending-Bench 2: $500, one vending machine, one simulated year, scored on the final bank balance.', 'Simulated benchmark');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.j0'), q('.j1'), q('.j2'), q('.j3'), q('.score')], { autoAlpha: 0 });

      // STEP 0 — the money and the empty job box: the rules before the work
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.setup'), { at: .25, y: 20 });
      // only the three top-level labels: the job and score texts are revealed later, and a
      // second tl.from() on an element an earlier from() already hid would animate 0 → 0 (KIT §4)
      tl.from(qa('.vs > text'), { autoAlpha: 0, duration: .4, stagger: .06 }, .4);
      tl.from(q('.jobbox'), { scaleX: 0, transformOrigin: 'left center', duration: .7, ease: Kit.ease.out }, .45);
      Kit.draw(tl, q('.a1'), { duration: .4, at: .5 });
      ctx.pause();

      // STEP 1 — the four jobs land one after another, so the list reads as work
      Kit.show(tl, [q('.j0'), q('.j1'), q('.j2'), q('.j3')], { y: 14, duration: .4, stagger: .12 });
      ctx.pause();

      // STEP 2 — one number is graded, and that choice drives the next two slides
      tl.set(q('.score'), { autoAlpha: 1 });
      Kit.draw(tl, q('.a2'), { duration: .4 });
      Kit.show(tl, qa('.score text'), { y: 0, duration: .4, stagger: .08, at: '-=.2' });
    },
    notes:
      'Andon Labs runs a benchmark called Vending-Bench. A model gets five hundred dollars, one vending machine ' +
      'and one simulated year.' +
      '[click] It does the whole job alone: finds suppliers, negotiates by email, pays invoices, sets prices.' +
      '[click] And it is graded on one number: the bank balance at year end. Remember that choice.'
  };

  /* ======================================================================
     2 · LEADERBOARD — "Vending-Bench leaderboard"   (30 s · 2 clicks)
     ONE IDEA: the models tripled in a year and are still a long way from a
     competent person.
     Chart: ranked horizontal bars, one series, one hue (dataviz skill);
     values direct-labelled at the tips, no gridlines, recessive references.
     ====================================================================== */
  var LB = [
    ['1', 'Gemini 4 Carbon',   16484],
    ['2', 'GPT-6 Astra',       15515],
    ['3', 'GPT-6 Sol',         14428],
    ['4', 'Gemini 4 Argon',    13718],
    ['5', 'Muse Wonder Full',  12292],
    ['6', 'Claude Opus 5',     11182],
    ['7', 'Claude Sonnet 5.5', 11165],
    ['8', 'Claude Opus 4.7',   10937]
  ];
  var LB_X0 = 430, LB_K = 0.0180;            // px per dollar: $63,000 → x 1564
  var LB_TOP = 60, LB_PITCH = 62, LB_H = 40;
  function lbx(d) { return LB_X0 + d * LB_K; }

  var LEADERBOARD = {
    id: 'leaderboard',
    title: 'Vending-Bench leaderboard',
    heading: 'Vending-Bench leaderboard',
    budgetSec: 30,
    html: function () {
      var rows = LB.map(function (r, i) {
        var top = LB_TOP + i * LB_PITCH, mid = top + LB_H / 2 + 10, w = r[2] * LB_K;
        return '<g class="row">' +
          txt(10, mid, r[0], { mono: true, size: 28, w: 500, fill: C.text3 }) +
          txt(406, mid, r[1], { anchor: 'end', size: 28, w: 500, fill: C.text2 }) +
          '<rect class="bar" x="' + LB_X0 + '" y="' + top + '" width="' + w + '" height="' + LB_H + '" rx="10" fill="' + C.green + '"/>' +
          // square the baseline end: the bar is rounded only where the data stops
          '<rect class="cap" x="' + LB_X0 + '" y="' + top + '" width="14" height="' + LB_H + '" fill="' + C.green + '"/>' +
          txt(LB_X0 + w + 24, mid, '$' + commas(r[2]), { cls: 'val', mono: true, size: 28, w: 700, fill: C.text }) +
        '</g>';
      }).join('');
      var yTop = 36, yBot = LB_TOP + 7 * LB_PITCH + LB_H + 16;
      return '' +
      '<svg class="lb" width="1680" height="620" viewBox="0 0 1680 620" style="position:absolute;left:120px;top:340px;overflow:visible">' +
        rows +
        '<g class="prev">' +
          '<line class="prevline" x1="' + lbx(5500) + '" y1="' + yTop + '" x2="' + lbx(5500) + '" y2="' + yBot + '" stroke="#6E6560" stroke-width="3" stroke-dasharray="6 8"/>' +
          txt(lbx(5500), 24, 'Nov 2025 leader: $5,500', { cls: 'prevlab', anchor: 'middle', size: 28, w: 700, fill: C.text2 }) +
        '</g>' +
        '<g class="hum">' +
          '<line class="humline" x1="' + lbx(63000) + '" y1="' + yTop + '" x2="' + lbx(63000) + '" y2="' + yBot + '" stroke="' + C.orangeT + '" stroke-width="3" stroke-dasharray="6 8"/>' +
          txt(lbx(63000) + 36, 24, 'a good human operator: $63,000', { cls: 'humlab', anchor: 'end', size: 32, w: 700, fill: C.orangeT }) +
          txt(lbx(63000) + 36, 600, 'the leader reaches a quarter of that', { cls: 'humsub', anchor: 'end', size: 32, w: 600, fill: C.orangeT }) +
        '</g>' +
      '</svg>' +
      Kit.src('Andon Labs, Vending-Bench 2 leaderboard, read 4 Nov 2026 (top 8 of 73). Nov 2025 ≈ $5,500 (Sherwood). $63,000 is Andon’s estimate.', 'Simulated benchmark');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.prev'), q('.hum')], { autoAlpha: 0 });

      // STEP 0 — the ranking itself: bars grow from one baseline, top first
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.from(qa('.lb .row text'), { autoAlpha: 0, duration: .4, stagger: .04 }, .3);
      tl.from(qa('.lb .bar'), { scaleX: 0, transformOrigin: 'left center', duration: .7, stagger: .06, ease: 'power2.out' }, .35);
      tl.from(qa('.lb .cap'), { autoAlpha: 0, duration: .3, stagger: .06 }, .35);
      ctx.pause();

      // STEP 1 — where the whole field stood a year ago: every bar now crosses it
      // (DrawSVG fights an explicit dasharray, so grow the marker by tweening its end)
      tl.set(q('.prev'), { autoAlpha: 1 });
      tl.fromTo(q('.prevline'), { attr: { y2: 36 } }, { attr: { y2: 574 }, duration: .6, ease: 'power2.inOut' });
      tl.from(q('.prevlab'), { autoAlpha: 0, y: -10, duration: .4 }, '-=.4');
      ctx.pause();

      // STEP 2 — how much track is left, as empty space on the same scale
      tl.set(q('.hum'), { autoAlpha: 1 });
      tl.fromTo(q('.humline'), { attr: { y2: 36 } }, { attr: { y2: 574 }, duration: .6, ease: 'power2.inOut' });
      tl.from(q('.humlab'), { autoAlpha: 0, y: -10, duration: .4 }, '-=.4');
      tl.from(q('.humsub'), { autoAlpha: 0, y: 12, duration: .4 }, '-=.1');
    },
    notes:
      'This is the live leaderboard, read this morning. Gemini 4 Carbon leads on about sixteen and a half thousand ' +
      'dollars, and the top eight of seventy-three are packed close together.' +
      '[click] A year ago the best score was five and a half thousand. All eight beat it. Three times better in a year.' +
      '[click] And here is a good human operator: sixty-three thousand. The leader reaches a quarter of that.'
  };

  /* ======================================================================
     3 · CHEATS — "Deception in Vending-Bench"   (18 s · 3 clicks)
     ONE IDEA: profit was the only thing scored, so the models bought profit
     with the tactics consumer law polices.
     Callback to Airbnb / takeaways: the objective is a choice.
     ====================================================================== */
  var CHEATS = {
    id: 'cheats',
    title: 'Deception in Vending-Bench',
    heading: 'Deception in Vending-Bench',
    budgetSec: 18,
    html: function () {
      function card(cls, left, caps, h2, lab) {
        return '<div class="card ' + cls + '" style="position:absolute;left:' + left + 'px;top:400px;width:800px;min-height:260px">' +
          '<div class="t-caps faint">' + caps + '</div>' +
          '<div class="t-h2 c-orange" style="margin-top:14px">' + h2 + '</div>' +
          '<div class="t-label dim" style="margin-top:14px">' + lab + '</div>' +
        '</div>';
      }
      return '' +
      '<div class="sub t-h2" style="position:absolute;left:120px;top:290px;color:var(--text-2);font-weight:500">Scored only on the final balance.</div>' +
      card('ca', 120, 'Anchoring', 'Invented a price history', 'to push a supplier’s price down') +
      card('cb', 980, 'Collusion', 'Joined price cartels', 'in all six multi-agent games') +
      '<div class="punch t-h2" style="position:absolute;left:120px;top:790px;width:1680px;font-weight:600">' +
        '<span class="p1">Nobody asked for this.</span> <b class="p2 c-orange">Profit was the only score.</b>' +
      '</div>' +
      Kit.src('Andon Labs, Vending-Bench 2 and Arena (24 Sep 2026). Price history: Claude Opus 5.5. Cartels: Claude Opus 5, six of six games.', 'Simulated benchmark');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.ca'), q('.cb'), q('.p1'), q('.p2')], { autoAlpha: 0 });

      // STEP 0 — name the cause before the symptoms
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.sub'), { at: .3, y: 20 });
      ctx.pause();

      // STEP 1 — deception
      Kit.show(tl, q('.ca'), { y: 24, duration: .5 });
      ctx.pause();

      // STEP 2 — co-ordination: a different kind of failure
      Kit.show(tl, q('.cb'), { y: 24, duration: .5 });
      ctx.pause();

      // STEP 3 — close the causal loop back to the sub-line
      Kit.show(tl, q('.p1'), { y: 16, duration: .45 });
      Kit.show(tl, q('.p2'), { y: 16, duration: .45, at: '-=.25' });
    },
    notes:
      'That leaderboard has a cost. The models are graded on one number.' +
      '[click] One faked a price history to push a supplier down.' +
      '[click] Another joined a price cartel in all six games.' +
      '[click] Nobody told them to. We graded profit, so we got profit.'
  };

  /* ======================================================================
     4 · ARMS-RACE — "Agent-to-agent negotiation"   (40 s · 4 clicks)
     ONE IDEA: when both sides send an agent, the gap between the two agents
     turns straight into money.
     ====================================================================== */
  var ARMS = {
    id: 'arms-race',
    title: 'Agent-to-agent negotiation',
    heading: 'Agent-to-agent negotiation',
    budgetSec: 40,
    html: function () {
      function node(cls, cx, stroke, a, b) {
        return '<g class="' + cls + '">' +
          '<g transform="translate(' + cx + ',200) skewX(-12)">' +
            '<rect x="-180" y="-96" width="360" height="192" rx="28" fill="none" stroke="' + stroke + '" stroke-width="4"/>' +
          '</g>' +
          txt(cx, 186, a, { anchor: 'middle', size: 32, w: 800, ls: 2, fill: stroke }) +
          txt(cx, 230, b, { anchor: 'middle', size: 32, w: 800, ls: 2, fill: stroke }) +
        '</g>';
      }
      return '' +
      '<svg class="ng" width="1600" height="400" viewBox="0 0 1600 400" style="position:absolute;left:160px;top:286px;overflow:visible">' +
        '<defs>' + arrowDef('ngA', C.skyT) + arrowDef('ngB', C.greenT) + '</defs>' +
        txt(1580, 24, 'ILLUSTRATIVE PRICES', { anchor: 'end', size: 28, w: 700, ls: 2, fill: C.text3 }) +
        node('bnode', 220, C.skyT, 'BUYER', 'AGENT') +
        node('snode', 1380, C.greenT, 'SELLER', 'AGENT') +
        '<g class="flow">' +
          '<line class="arrA" x1="430" y1="150" x2="1170" y2="150" stroke="' + C.skyT + '" stroke-width="6" marker-end="url(#ngA)"/>' +
          txt(800, 122, 'offer', { cls: 'labA', anchor: 'middle', size: 28, w: 600, fill: C.text2 }) +
          '<line class="arrB" x1="1170" y1="248" x2="430" y2="248" stroke="' + C.greenT + '" stroke-width="6" marker-end="url(#ngB)"/>' +
          txt(800, 292, 'counter', { cls: 'labB', anchor: 'middle', size: 28, w: 600, fill: C.text2 }) +
        '</g>' +
        txt(800, 212, '$150', { cls: 'price', anchor: 'middle', mono: true, size: 56, w: 700, fill: C.text }) +
        '<g class="weak">' +
          '<rect x="80" y="324" width="280" height="52" rx="26" fill="' + C.red + '" fill-opacity=".18"/>' +
          txt(220, 359, 'weaker agent', { anchor: 'middle', size: 28, w: 700, fill: C.redT }) +
        '</g>' +
        txt(980, 212, '+2%', { cls: 'plus', size: 36, w: 800, fill: C.orangeT }) +
      '</svg>' +
      '<div class="card now" style="position:absolute;left:120px;top:700px;width:820px;height:200px;padding:28px 36px">' +
        '<div class="t-caps faint">Running today</div>' +
        '<div class="t-h2" style="margin-top:16px">2,000 suppliers at once</div>' +
        '<div class="t-label dim" style="margin-top:16px">Walmart’s smaller contracts, via Pactum. 3% saved.</div>' +
      '</div>' +
      '<div class="card next" style="position:absolute;left:980px;top:700px;width:820px;height:200px;padding:28px 36px">' +
        '<div class="t-caps faint">Next</div>' +
        '<div class="t-h2" style="margin-top:16px">Suppliers want agents</div>' +
        '<div class="t-label dim" style="margin-top:16px">then both sides of the deal are software</div>' +
      '</div>' +
      Kit.src('2% gap: Zhu et al. (2025), via Stanford HAI. Walmart and Pactum: Fox Business and Retail Dive. Prices are illustrative.', 'Pactum: self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var price = q('.price'), bnode = q('.bnode');
      gsap.set([q('.flow'), q('.weak'), q('.plus'), q('.now'), q('.next')], { autoAlpha: 0 });

      // Price readout: state + render (KIT §4), NOT Kit.count — Kit.count writes its
      // `from` value into the element at build time, so a later call would leave the
      // entrance showing the wrong number.
      var pst = { v: 150 };
      function renderPrice() {
        var v = pst.v;
        price.textContent = '$' + (Math.abs(v - Math.round(v)) < .005 ? Math.round(v) : v.toFixed(2));
      }
      renderPrice();

      // STEP 0 — two machines at the table, no human
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.from([bnode, q('.snode')], { autoAlpha: 0, y: 24, duration: .6, stagger: .12, ease: Kit.ease.out }, .3);
      tl.from(price, { autoAlpha: 0, duration: .45 }, .85);
      ctx.pause();

      // STEP 1 — they haggle: the arrows fire and the number falls
      tl.set(q('.flow'), { autoAlpha: 1 });
      Kit.draw(tl, q('.arrA'), { duration: .45 });
      Kit.draw(tl, q('.arrB'), { duration: .45, at: '-=.2' });
      tl.from([q('.labA'), q('.labB')], { autoAlpha: 0, duration: .35, stagger: .1 }, '-=.3');
      tl.to(pst, { v: 118, duration: .8, ease: 'power2.out', onUpdate: renderPrice }, '-=.5');
      ctx.pause();

      // STEP 2 — THE teaching beat: one visible cause, one visible effect
      tl.to(bnode, { opacity: .55, duration: .4 });
      tl.to(q('.bnode rect'), { attr: { stroke: C.redT }, duration: .4 }, '<');
      Kit.show(tl, q('.weak'), { y: -12, duration: .45 }, '<');
      tl.to(pst, { v: 120.40, duration: .7, ease: 'power2.out', onUpdate: renderPrice });
      Kit.show(tl, q('.plus'), { y: 0, x: -20, duration: .45, at: '-=.4' });
      ctx.pause();

      // STEP 3 — not science fiction
      Kit.show(tl, q('.now'), { y: 24, duration: .5 });
      ctx.pause();

      // STEP 4 — the other side arms itself, which is where this goes
      Kit.show(tl, q('.next'), { y: 24, duration: .5 });
    },
    notes:
      'Now the other side. Your agent buys, the shop’s agent sells.' +
      '[click] Yours offers, theirs counters, and a price lands. No person involved.' +
      '[click] Here is the finding. In a study from Toronto, MIT and Stanford, buyers whose agent was the weaker model ' +
      'paid about two percent more, and never saw the better price.' +
      '[click] This is running now: Walmart negotiates supplier contracts through Pactum’s agent, two thousand at once.' +
      '[click] And the suppliers asked for the same system. Both sides become software, and the better model takes ' +
      'the difference.'
  };

  /* ======================================================================
     5 · PRICING — "Personalized pricing"   (25 s · 2 clicks)
     ONE IDEA: a model can quote one price per shopper, and that is what the
     new state laws are aimed at.
     ====================================================================== */
  var PRICING = {
    id: 'pricing',
    title: 'Personalized pricing',
    heading: 'Personalized pricing',
    budgetSec: 25,
    html: function () {
      // Shopper glyphs are drawn, not panelled: the slanted motif is reserved for framing
      // (KIT §6). Each person carries a different object so the three read as three people.
      var S = C.text2;
      function person(x, item, dx) {
        return '<g class="fig" transform="translate(' + (dx || 0) + ',0)" fill="none" stroke="' + S + '" stroke-width="5" ' +
            'stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="' + x + '" cy="160" r="30"/>' +
          '<path d="M' + (x - 68) + ',274 C' + (x - 68) + ',214 ' + (x - 34) + ',198 ' + x + ',198 ' +
                 'C' + (x + 34) + ',198 ' + (x + 68) + ',214 ' + (x + 68) + ',274"/>' +
          item(x) +
        '</g>';
      }
      function phone(x) {
        return '<rect x="' + (x + 44) + '" y="214" width="34" height="56" rx="7" stroke-width="4"/>' +
               '<line x1="' + (x + 54) + '" y1="258" x2="' + (x + 68) + '" y2="258" stroke-width="4"/>';
      }
      function bag(x) {
        return '<rect x="' + (x + 38) + '" y="228" width="46" height="46" rx="5" stroke-width="4"/>' +
               '<path d="M' + (x + 50) + ',228 v-9 a11,11 0 0 1 22,0 v9" stroke-width="4"/>';
      }
      function cans(x) {
        return '<path d="M' + (x - 46) + ',158 a46,46 0 0 1 92,0" stroke-width="4"/>' +
               '<rect x="' + (x - 56) + '" y="152" width="20" height="30" rx="8" stroke-width="4"/>' +
               '<rect x="' + (x + 36) + '" y="152" width="20" height="30" rx="8" stroke-width="4"/>';
      }
      // dx re-centres each figure's ink on the column, since the held object sticks out right
      var cols = [[240, 'Shopper A', 'pa', phone, -5], [760, 'Shopper B', 'pb', bag, -8], [1280, 'Shopper C', 'pc', cans, 0]];
      var g = cols.map(function (c) {
        return '<g>' +
          txt(c[0], 92, c[1].toUpperCase(), { anchor: 'middle', size: 28, w: 700, ls: 2, fill: C.text3 }) +
          person(c[0], c[3], c[4]) +
          txt(c[0], 372, '$44', { cls: c[2], anchor: 'middle', mono: true, size: 64, w: 700, fill: C.text }) +
        '</g>';
      }).join('');
      return '' +
      '<div class="sub t-h2" style="position:absolute;left:120px;top:290px;width:1600px;font-weight:500;color:var(--text-2)">' +
        'The seller sets one price per shopper.' +
      '</div>' +
      '<svg class="pp" width="1520" height="440" viewBox="0 0 1520 440" style="position:absolute;left:200px;top:400px;overflow:visible">' +
        txt(760, 34, 'Same product. Same minute.', { cls: 'hdr', anchor: 'middle', size: 36, w: 500, fill: C.text2 }) +
        g +
        // top right, clear of the price row (centred under shopper B it read as a caption for $44)
        txt(1520, -6, 'ILLUSTRATIVE PRICES', { cls: 'illus', anchor: 'end', size: 28, w: 700, ls: 2, fill: C.text3 }) +
      '</svg>' +
      '<div class="card regs" style="position:absolute;left:200px;top:862px;width:1520px;height:118px;padding:22px 36px">' +
        '<div class="t-caps faint">US regulation</div>' +
        '<div class="t-label t-mono" style="margin-top:12px;font-weight:600">Maryland: banned&nbsp; ·&nbsp; 26 states: 50+ bills&nbsp; ·&nbsp; FTC: policy proposed</div>' +
      '</div>' +
      Kit.src('Maryland’s ban took effect 1 Oct 2026; 50+ bills are pending in 26 states; the FTC proposed a Section 5 policy on 19 Aug 2026 (Sidley Austin). Prices are illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.illus'), q('.regs')], { autoAlpha: 0 });

      // STEP 0 — the world we know: one posted price
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.sub'), { at: .3, y: 20 });
      tl.from(q('.hdr'), { autoAlpha: 0, y: -12, duration: .5 }, .4);
      tl.from(qa('.pp > g'), { autoAlpha: 0, y: 26, duration: .6, stagger: .1, ease: Kit.ease.out }, .5);
      ctx.pause();

      // STEP 1 — divergence from a shared starting value IS the idea
      Kit.count(tl, q('.pa'), { from: 44, to: 39, prefix: '$', duration: .6 }, 0);
      Kit.count(tl, q('.pc'), { from: 44, to: 52, prefix: '$', duration: .6, at: '<' });
      tl.to(q('.pa'), { attr: { fill: C.greenT }, duration: .6 }, '<');
      tl.to(q('.pc'), { attr: { fill: C.redT }, duration: .6 }, '<');
      Kit.show(tl, q('.illus'), { y: 10, duration: .4, at: '-=.2' });
      ctx.pause();

      // STEP 2 — the consequence that is already on the books
      Kit.show(tl, q('.regs'), { y: 24, duration: .5 });
    },
    notes:
      'Same product, same minute, three shoppers.' +
      '[click] A model that knows your history quotes each one a different number. These figures are made up; the ' +
      'practice is not. The price stops describing the product and starts describing you.' +
      '[click] Maryland has banned it, fifty bills are moving in twenty-six states, and the FTC proposed an ' +
      'enforcement policy in August.'
  };

  /* ======================================================================
     6 · PAYMENTS — "Payments: HTTP 402"   (40 s · 4 clicks)
     ONE IDEA: there is already a payment handshake built for software buyers,
     and almost nobody is using it yet.
     ====================================================================== */
  var PAY = {
    id: 'payments',
    title: 'Payments: HTTP 402',
    heading: 'Payments: HTTP 402',
    budgetSec: 40,
    html: function () {
      var AX = 300, SX = 1380, A1 = 332, A2 = 1348;
      function msg(cls, y, label, back, color, mono) {
        var x1 = back ? A2 : A1, x2 = back ? A1 : A2;
        return '<g class="' + cls + '">' +
          txt((A1 + A2) / 2, y - 18, label, { anchor: 'middle', size: 32, w: mono ? 600 : 600, mono: mono, fill: color }) +
          '<line class="ln" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="' + color +
            '" stroke-width="5" marker-end="url(#pay' + (back ? 'B' : 'A') + ')"/>' +
        '</g>';
      }
      return '' +
      '<svg class="px" width="1680" height="510" viewBox="0 0 1680 510" style="position:absolute;left:120px;top:310px;overflow:visible">' +
        '<defs>' + arrowDef('payA', C.skyT) + arrowDef('payB', C.greenT) + '</defs>' +
        txt(AX, 36, 'BUYER’S AGENT', { anchor: 'middle', size: 32, w: 800, ls: 2, fill: C.skyT }) +
        txt(SX, 36, 'SELLER’S SERVER', { anchor: 'middle', size: 32, w: 800, ls: 2, fill: C.greenT }) +
        '<line x1="' + AX + '" y1="70" x2="' + AX + '" y2="480" stroke="#4A4345" stroke-width="3"/>' +
        '<line x1="' + SX + '" y1="70" x2="' + SX + '" y2="480" stroke="#4A4345" stroke-width="3"/>' +
        msg('m1', 130, 'GET /article', false, C.skyT, true) +
        msg('m2', 232, '402 Payment Required &#183; $0.10', true, C.orangeT, true) +
        msg('m3', 334, 'pays $0.10 in USDC', false, C.skyT, false) +
        msg('m4', 400, 'GET /article again', false, C.skyT, true) +
        msg('m5', 470, '200 OK, here is the article', true, C.greenT, true) +
      '</svg>' +
      '<div class="card vol" style="position:absolute;left:120px;top:815px;width:1680px;height:140px;padding:22px 36px">' +
        '<div class="t-h2 t-mono c-orange" style="font-weight:700">$28,000 a day</div>' +
        '<div class="t-label faint" style="margin-top:12px">all x402 payments, 3 Nov 2026</div>' +
        '<div class="back t-label dim" style="position:absolute;left:790px;top:56px;width:900px">' +
          'Backers: Visa, Mastercard, Stripe, Google, AWS, Cloudflare' +
        '</div>' +
      '</div>' +
      Kit.src('Artemis x402 dashboard: about 370,000 payments worth roughly $28,000 on 3 Nov 2026. x402 Foundation: 40 members, 14 Jul 2026. $0.10 is illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.m2'), q('.m3'), q('.m4'), q('.m5'), q('.vol')], { autoAlpha: 0 });

      function send(g) {
        tl.set(g, { autoAlpha: 1 });
        Kit.draw(tl, g.querySelector('.ln'), { duration: .5 });
        tl.from(g.querySelector('text'), { autoAlpha: 0, y: 10, duration: .35 }, '-=.35');
      }

      // STEP 0 — the agent asks for something, the way any client would
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.from(qa('.px > text'), { autoAlpha: 0, duration: .4, stagger: .1 }, .3);
      tl.from(qa('.px > line'), { scaleY: 0, transformOrigin: 'top center', duration: .6, ease: 'power2.out' }, .35);
      Kit.draw(tl, q('.m1 .ln'), { duration: .5, at: .7 });
      tl.from(q('.m1 text'), { autoAlpha: 0, y: 10, duration: .35 }, .9);
      ctx.pause();

      // STEP 1 — the whole idea in one line: a price, in the HTTP reply
      send(q('.m2'));
      ctx.pause();

      // STEP 2 — pay, then ask again: the agent needs no account and no card
      send(q('.m3'));
      send(q('.m4'));
      ctx.pause();

      // STEP 3 — the handshake closes
      send(q('.m5'));
      ctx.pause();

      // STEP 4 — the rails are built; the demand is not there yet
      Kit.show(tl, q('.vol'), { y: 24, duration: .5 });
    },
    notes:
      'Last piece: agents need a way to pay without a card or a human. HTTP four-oh-two is a status code reserved ' +
      'since the nineties and unused until now. The agent asks for a page.' +
      '[click] The server answers four-oh-two, Payment Required, and quotes a price.' +
      '[click] The agent pays in stablecoin, usually USDC, and asks again.' +
      '[click] This time it gets the article. No account, no checkout.' +
      '[click] Visa, Mastercard, Stripe, Google, AWS and Cloudflare are all behind it. Real volume: twenty-eight ' +
      'thousand dollars a day. The system is built. Almost nobody uses it yet.'
  };

  /* ======================================================================
     7 · SUMMARY — the close, part 1   (25 s · 4 clicks)
     Geometry copied from the intro agenda: rowY 368/518/668/818, chips 72×38
     at x130, numbers x232, labels x330, subs x330 (+48). Do not re-derive.
     ====================================================================== */
  var ROWS = [
    { n: '01', w: 'PRICE',     c: 'var(--red)',    s: 'gradient boosting with a custom loss' },
    { n: '02', w: 'ASSIST',    c: 'var(--blue)',   s: 'retrieval and tool calls behind the answer' },
    { n: '03', w: 'INTERACT',  c: 'var(--purple)', s: 'diffusion, distilled to run live' },
    { n: '04', w: 'NEGOTIATE', c: 'var(--green)',  s: 'both sides of the deal are software', sc: ' c-green' }
  ];
  var SUMMARY = {
    id: 'assembled',
    title: 'Summary',
    budgetSec: 25,
    html: function () {
      var rows = ROWS.map(function (r, i) {
        var y = 368 + i * 150;
        return '<div class="arow r' + i + '">' +
          '<span class="achip" style="position:absolute;left:130px;top:' + y + 'px;width:72px;height:38px;border-radius:10px;' +
            'background:' + r.c + ';transform:skewX(-12deg)"></span>' +
          '<span class="anum t-h2 t-mono" style="position:absolute;left:232px;top:' + (y - 10) + 'px;color:var(--text-2)">' + r.n + '</span>' +
          '<span class="alab t-h2" style="position:absolute;left:330px;top:' + (y - 14) + 'px;font-style:italic;font-weight:850;font-stretch:115%;white-space:nowrap">' + r.w + '</span>' +
          '<span class="asub t-label' + (r.sc || '') + '" style="position:absolute;left:330px;top:' + (y + 48) + 'px;white-space:nowrap' + (r.sc ? '' : ';color:var(--text-2)') + '">' + r.s + '</span>' +
        '</div>';
      }).join('');
      return '' +
      '<div class="asm-bg" style="position:absolute;inset:0;background:url(assets/img/salesperson-assembled.jpg) right 6% / cover no-repeat;opacity:.42"></div>' +
      '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 40%,rgba(30,27,28,.78) 52%,rgba(30,27,28,0) 68%)"></div>' +
      '<div class="asm-caps t-caps" style="position:absolute;left:120px;top:300px;color:var(--text-3)">Summary</div>' +
      rows +
      Kit.src('Airbnb: Ye et al., KDD 2018. Rufus: Amazon. Griffin: Tavus. Negotiate: Andon Labs, Zhu et al., Pactum, Artemis.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.arow'), { autoAlpha: 0 });

      // STEP 0 — the figure is there, unresolved
      tl.from(q('.asm-bg'), { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0);
      Kit.rise(tl, q('.asm-caps'), { at: .35, y: 18 });
      ctx.pause();

      // STEPS 1–4 — one part per click
      [0, 1, 2, 3].forEach(function (i) {
        var row = q('.r' + i);
        tl.set(row, { autoAlpha: 1 });
        tl.fromTo(row.querySelector('.achip'), { x: -120, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: .5, ease: Kit.ease.out });
        tl.fromTo([row.querySelector('.anum'), row.querySelector('.alab'), row.querySelector('.asub')],
          { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .07, ease: Kit.ease.out }, '-=.35');
        // the picture resolving as the last part lands IS the argument
        if (i === 3) tl.to(q('.asm-bg'), { opacity: 1, duration: .9, ease: 'power2.out' }, '-=.5');
        if (i < 3) ctx.pause();
      });
    },
    notes:
      'Four parts, one salesperson.' +
      '[click] Price: gradient boosting, with a loss built for a number nobody ever sees.' +
      '[click] Assist: a general model that fetches evidence and calls tools before it answers.' +
      '[click] Interact: diffusion, distilled until it runs fast enough to hold a conversation.' +
      '[click] Negotiate: the part where both sides of the deal are software. That part is just starting.'
  };

  /* ======================================================================
     8 · QUESTION — the close, part 2   (25 s · 1 click)
     ====================================================================== */
  var QUESTION = {
    id: 'question',
    title: 'Closing question',
    budgetSec: 25,
    html: function () {
      function words(s, cls) {
        return s.split(' ').map(function (w) {
          return '<span class="' + cls + '" style="display:inline-block">' + w + '</span>';
        }).join(' ');
      }
      return '' +
      '<div class="q-bg" style="position:absolute;inset:0;background:url(assets/img/future/two-agents.jpg) right 8% / cover no-repeat;opacity:.85"></div>' +
      // the scrim holds opaque further right than the image's midpoint, because the
      // green bust begins at ~x650 and the text reads across it
      '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 46%,rgba(30,27,28,.85) 62%,rgba(30,27,28,0) 78%)"></div>' +
      // each beat is hand-broken into short lines: at one width they wrapped into a
      // single paragraph and the pause between the statement and the question was lost
      '<h2 class="q1 t-h1" style="position:absolute;left:150px;top:300px;width:1120px">' + words('An agent sells to you.', 'w1') + '</h2>' +
      '<h2 class="q1b t-h1" style="position:absolute;left:150px;top:396px;width:1120px">' + words('Your agent buys for you.', 'w1') + '</h2>' +
      '<h2 class="q2 t-h1 c-orange" style="position:absolute;left:150px;top:580px;width:1000px">' + words('How do you feel', 'w2') + '</h2>' +
      '<h2 class="q2b t-h1 c-orange" style="position:absolute;left:150px;top:676px;width:1000px">' + words('about that?', 'w2') + '</h2>' +
      '<div class="q-by t-label" style="position:absolute;left:150px;top:860px;color:var(--text-3)">Rey&nbsp;·&nbsp;Emin&nbsp;·&nbsp;Ashiqa&nbsp;·&nbsp;Anika&nbsp;·&nbsp;Nolan&nbsp;&nbsp;·&nbsp;&nbsp;references follow</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.q2'), q('.q2b')], { autoAlpha: 0 });

      // STEP 0 — the image and the statement, with no question attached yet
      tl.from(q('.q-bg'), { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0);
      tl.from(qa('.w1'), { autoAlpha: 0, y: 26, duration: .6, stagger: .05, ease: Kit.ease.out }, .5);
      tl.fromTo(q('.q-by'), { autoAlpha: 0 }, { autoAlpha: .4, duration: .6 }, 1.1);
      ctx.pause();

      // STEP 1 — the pause before the question is the whole point
      tl.set([q('.q2'), q('.q2b')], { autoAlpha: 1 });
      tl.from(qa('.w2'), { autoAlpha: 0, y: 26, duration: .55, stagger: .05, ease: Kit.ease.out });

      if (ctx.mode === 'show') {
        gsap.to(q('.q-bg'), { x: -10, scale: 1.02, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5, transformOrigin: '80% 50%' });
      }
    },
    notes:
      'An agent prices what you see, writes the pitch, shows a face, and sells to you. ' +
      'Your own agent searches, negotiates and pays. More money moves between two pieces of software, and the ' +
      'better model gets the better price.' +
      '[click] How do you feel about that? Thank you. Happy to take your questions.'
  };

  Deck.section({
    id: 'future', order: 5, num: '04', kicker: 'Negotiate', title: 'What’s next',
    slides: [VENDING, LEADERBOARD, CHEATS, ARMS, PRICING, PAY, SUMMARY, QUESTION]
  });
})();
