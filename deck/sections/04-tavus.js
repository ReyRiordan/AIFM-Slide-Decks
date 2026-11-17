/* ==========================================================================
   04 · The company — Tavus   (budget 2:45 = 165 s)
   Flow: origin + founders (40) → timeline (45) → company snapshot (50)
         → bridge into section 04, Negotiate+ (30)
   Spec: specs/tavus.md   ·   Contract: KIT.md
   Real Tavus imagery (logo wordmark, founder photos) is the sanctioned
   exception to KIT §2.6; every asset is credited in its Kit.src footer.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  var MAG_FILL = 'rgba(182,86,160,.55)';
  var MAG_FILL_HI = 'rgba(182,86,160,.8)';

  /* Tavus wordmark, single path, taken from the SVG the tavus.io header loads
     (assets/img/tavus/tavus-logo.svg). Inlined so it can take currentColor. */
  var LOGO_D = 'M59.7617 11.1172L63.1035 0.849609H75.6729V11.7812C75.6729 13.1128 76.4444 14.0839 77.7119 14.084C78.9796 14.084 79.7519 13.1129 79.752 11.7812V0.849609H86.2559V12.1699C86.2557 17.1637 82.7551 20.2988 77.7119 20.2988C72.6689 20.2987 69.1691 17.1636 69.1689 12.1699V3.32324L63.4072 19.7471H56.0322L49.4863 0.849609H56.9717L59.7617 11.1172ZM94.1211 0.298828C97.2046 0.298828 99.628 1.51976 101.335 3.62793L96.957 7.70508C95.9385 6.51243 95.1676 5.90234 94.0664 5.90234C93.3233 5.90235 92.8001 6.15174 92.7998 6.62305C92.7998 7.12233 93.4056 7.23377 93.9287 7.34473C98.3062 8.23238 101.61 9.59164 101.61 13.9189C101.61 17.7746 98.4165 20.2987 93.7363 20.2988C90.2399 20.2988 87.4867 18.9119 85.8623 16.3877L90.0742 12.4766C90.9552 13.7248 92.4974 14.6953 94.1768 14.6953C94.8923 14.6953 95.443 14.5292 95.4434 14.0303C95.4434 13.531 94.8375 13.3639 94.3145 13.2529C89.7168 12.3098 86.7432 10.7011 86.7432 6.79004C86.7432 2.768 90.1843 0.298998 94.1211 0.298828ZM19.877 11.7236L17.543 12.6455L18.6602 14.3447L17.543 15.2178L18.6602 15.8975L17.543 17.1592L18.0283 19.7793H0V0.804688H16.1104L19.877 11.7236ZM38.4844 6.95508H33.8135V19.7471H27.3281V6.95508H22.6572V0.849609H38.4844V6.95508ZM55.0186 19.7471H47.6162L47.0107 17.2227H42.1133L41.3975 19.7471H34.5459L41.1221 0.849609H48.4697L55.0186 19.7471ZM1.00391 18.7754H8.88672L8.5752 16.9795L9.69141 15.7178L8.5752 15.0381L9.69141 14.165L8.5752 12.6455L11.1357 11.915L7.62598 1.80859H1.00391V18.7754ZM43.5713 12.0049H45.7451L44.7549 7.87012L43.5713 12.0049ZM14.0312 6.41992C13.3522 6.42002 12.8019 6.97137 12.8018 7.65039C12.8019 8.32938 13.3522 8.87979 14.0312 8.87988C14.7103 8.87988 15.2615 8.32944 15.2617 7.65039C15.2616 6.97132 14.7104 6.41992 14.0312 6.41992ZM6.57812 8.74023H4.33008V6.49316H6.57812V8.74023Z';

  /** Tavus wordmark, top right of a content slide. w px wide, aspect 102:21. */
  function logo(x, y, w) {
    return '<svg class="tvlogo" width="' + w + '" height="' + Math.round(w * 21 / 102) +
      '" viewBox="0 0 102 21" style="position:absolute;left:' + x + 'px;top:' + y + 'px">' +
      '<path d="' + LOGO_D + '" fill="currentColor"/></svg>';
  }

  /* ======================================================================
     1 · ORIGIN — where the company came from         (40 s, 3 clicks)
     Steps: 0 the 200 · 1 +450% · 2 founders · 3 automate it
     ====================================================================== */
  var COLS = 20, ROWS = 10, TW = 36, TH = 22, GAP = 12;
  var STEPX = TW + GAP, STEPY = TH + GAP;

  var ORIGIN = {
    id: 'origin',
    title: 'Origin',
    heading: 'Origin',
    budgetSec: 40,
    html: function () {
      var tiles = '';
      for (var i = 0; i < COLS * ROWS; i++) {
        var c = i % COLS, r = Math.floor(i / COLS);
        tiles += '<i class="tile" style="left:' + (c * STEPX) + 'px;top:' + (r * STEPY) + 'px;background:' +
          ((i + 1) % 7 === 0 ? MAG_FILL_HI : MAG_FILL) + '"></i>';
      }
      function founder(cls, file, name, role) {
        return '<figure class="fp ' + cls + '">' +
          '<img src="assets/img/tavus/' + file + '" alt="' + name + '">' +
          '<figcaption><span class="t-label fname">' + name + '</span>' +
          '<span class="t-caps frole">' + role + '</span></figcaption>' +
        '</figure>';
      }
      return '' +
        logo(1600, 90, 200) +

        // ---- left column: the 200 ----
        '<div class="t-num big200" style="position:absolute;left:120px;top:300px;color:var(--magenta-t)">0</div>' +
        '<div class="t-label cap200" style="position:absolute;left:120px;top:462px;color:var(--text-2)">sales videos, recorded by hand in one night</div>' +
        '<div class="grid" style="position:absolute;left:120px;top:560px;width:' + (COLS * STEPX - GAP) + 'px;height:' + (ROWS * STEPY - GAP) + 'px">' + tiles + '</div>' +

        // ---- the merge payoff (hidden until step 3) ----
        // the arrow runs from the 200 and its caption into the one surviving tile
        '<svg class="marrow" style="position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;overflow:visible">' +
          '<path class="mline" d="M300 530 C 300 572, 288 586, 272 608" fill="none" stroke="' + C.text3 + '" stroke-width="3"/>' +
          '<path class="mhead" d="M268 618 L 256 596 L 282 598 Z" fill="' + C.text3 + '"/>' +
        '</svg>' +
        '<div class="merged" style="position:absolute;left:150px;top:620px;width:300px;height:190px"></div>' +
        '<div class="mlab t-h2" style="position:absolute;left:530px;top:660px">1 recording</div>' +
        '<div class="mlab t-label" style="position:absolute;left:530px;top:730px;color:var(--text-2)">→ 200 personalized videos</div>' +

        // ---- right column: the payoff on top, the two founders under it ----
        founder('fa', 'founder-raza.jpg', 'Hassaan Raza', 'CEO') +
        founder('fb', 'founder-favret.jpg', 'Quinn Favret', 'COO') +
        '<div class="t-num pay450" style="position:absolute;left:1140px;top:300px;color:var(--orange-t)">+0%</div>' +
        '<div class="t-label payl" style="position:absolute;left:1140px;top:462px;color:var(--text-2)">more replies</div>' +

        Kit.src('The 200 videos and the reply figure come from the founders. Logo: Tavus. Photos: Y Combinator.', 'Self-reported');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var tiles = qa('.tile');

      gsap.set([q('.merged'), qa('.mlab'), q('.fa'), q('.fb'), q('.pay450'), q('.payl')], { autoAlpha: 0 });
      gsap.set([q('.mline'), q('.mhead')], { autoAlpha: 0 });
      gsap.set(q('.mline'), { drawSVG: '0%' });

      // ---- STEP 0: two hundred, by hand ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.tvlogo'), { at: .3, duration: .7 });
      Kit.count(tl, q('.big200'), { to: 200, duration: 1.4, at: .25 });
      tl.from(tiles, { autoAlpha: 0, scale: .4, duration: .35, ease: 'power2.out', stagger: .006 }, .25);
      Kit.rise(tl, q('.cap200'), { at: .5, y: 18 });
      ctx.pause();

      // ---- STEP 1: the payoff of the 200 ----
      tl.to(q('.pay450'), { autoAlpha: 1, duration: .2 });
      Kit.count(tl, q('.pay450'), { to: 450, prefix: '+', suffix: '%', duration: 1.2, at: '<' });
      Kit.show(tl, q('.payl'), { y: 14, at: '-=.3' });
      ctx.pause();

      // ---- STEP 2: the two founders who ran it ----
      tl.fromTo([q('.fa'), q('.fb')], { autoAlpha: 0, x: 360 },
        { autoAlpha: 1, x: 0, duration: .8, ease: Kit.ease.out, stagger: .12 });
      ctx.pause();

      // ---- STEP 3: automate it — 200 hand-made things become one recording ----
      tl.to(tiles, {
        x: function (i) { return -(i % COLS) * STEPX; },
        y: function (i) { return -Math.floor(i / COLS) * STEPY; },
        scale: .2, autoAlpha: 0, duration: .9, ease: 'power2.inOut',
        stagger: { amount: .5, from: 'end' }
      });
      tl.to([q('.big200'), q('.cap200')], { color: C.text3, duration: .6 }, '<');
      Kit.show(tl, q('.merged'), { y: 0, duration: .5, ease: Kit.ease.back }, '-=.2');
      tl.to([q('.mline'), q('.mhead')], { autoAlpha: 1, duration: .2 }, '<');
      tl.to(q('.mline'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' }, '<');
      Kit.show(tl, qa('.mlab'), { y: 20, stagger: .1, at: '-=.25' });
    },

    notes:
      'Let\'s look more at our company Tavus, which created Griffin. Tavus is an AI research lab in San Francisco. It all started when ' +
      'the founders were running a product studio, and they tried recording 200 sales videos in one night as an experiment.' +
      '[click] Replies went up 450% according to them, which convinced them that personalized video was a really good sales strategy.' +
      '[click] As for the founders, Raza did engineering at Apple and Google, and Favret is a Thiel fellow that left UMichto start ' +
      'companies.' +
      '[click] But basically based on this experiment and their background, the core idea of Tavus became to record one video and then ' +
      'synthesize the other 199. This direction is what got them into Y-Combinator in 2021.'
  };

  /* ======================================================================
     2 · TIMELINE — three product eras                (45 s, 3 clicks)
     Steps: 0 the rail + 2021 · 1 2024 · 2 three models · 3 they become one
     NOTE: Phoenix / Raven / Sparrow appear here for the FIRST and ONLY time in
     the deck — the Griffin section deliberately never names them (see specs/griffin.md
     "Deliberately cut"). Do not rewrite this slide as a recap, and do not cut it
     without also fixing Griffin's hand-off.
     ====================================================================== */
  var PIVOT = {
    id: 'pivot',
    title: 'Timeline',
    heading: 'Timeline',
    budgetSec: 45,
    html: function () {
      var RY = 440, NODES = [300, 900, 1150, 1620], MCY = 662;
      var MODELS = [
        { x: 500, name: 'Phoenix', job: 'draws the face' },
        { x: 860, name: 'Raven', job: 'watches and listens' },
        { x: 1220, name: 'Sparrow', job: 'decides when to speak' }
      ];
      var YEARS = [
        { x: 300, y: '2021', lab: 'recorded, then sent' },
        { x: 900, y: '2024', lab: 'live, two-way' },
        { x: 1150, y: '2025', lab: 'three models' },
        { x: 1620, y: '2026', lab: 'research preview', open: true }
      ];
      var nodes = YEARS.map(function (n, i) {
        var dot = n.open
          ? '<circle class="dot" cx="' + n.x + '" cy="' + RY + '" r="15" fill="' + C.bg + '" stroke="' + C.magenta + '" stroke-width="4" stroke-dasharray="7 6"/>'
          : '<circle class="dot" cx="' + n.x + '" cy="' + RY + '" r="16" fill="' + C.magenta + '"/>';
        return '<g class="nd nd' + i + '">' +
          '<text class="yr" x="' + n.x + '" y="396" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="700" letter-spacing="3" fill="' + C.magentaT + '">' + n.y + '</text>' +
          dot +
          '<text class="lb" x="' + n.x + '" y="498" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + (n.open ? C.text2 : C.text) + '">' + n.lab + '</text>' +
        '</g>';
      }).join('');
      var circles = MODELS.map(function (m, i) {
        return '<g class="mc mc' + i + '">' +
          '<circle cx="' + m.x + '" cy="' + MCY + '" r="96" fill="rgba(182,86,160,.14)" stroke="' + C.magenta + '" stroke-width="4"/>' +
          '<text x="' + m.x + '" y="' + (MCY + 12) + '" text-anchor="middle" font-family="Archivo" font-size="36" font-weight="750" fill="' + C.text + '">' + m.name + '</text>' +
          '<text x="' + m.x + '" y="' + (MCY + 136) + '" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text2 + '">' + m.job + '</text>' +
        '</g>';
      }).join('');
      return '' +
        logo(1600, 90, 200) +
        '<svg class="pv" viewBox="0 0 1920 1080" style="position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;overflow:visible">' +
          '<line class="rail" x1="220" y1="' + RY + '" x2="1700" y2="' + RY + '" stroke="' + C.line + '" stroke-width="3"/>' +
          '<line class="seg1" x1="' + NODES[0] + '" y1="' + RY + '" x2="' + NODES[1] + '" y2="' + RY + '" stroke="' + C.magenta + '" stroke-width="5"/>' +
          '<line class="seg2" x1="' + NODES[1] + '" y1="' + RY + '" x2="' + NODES[2] + '" y2="' + RY + '" stroke="' + C.magenta + '" stroke-width="5"/>' +
          '<line class="seg3" x1="' + NODES[2] + '" y1="' + RY + '" x2="' + NODES[3] + '" y2="' + RY + '" stroke="' + C.magenta + '" stroke-width="5"/>' +
          nodes +
          // tether: the 2025 node owns the three model circles
          '<g class="tether" stroke="' + C.magenta + '" stroke-width="3" fill="none" opacity=".75">' +
            '<path class="tdrop" d="M1150 516 V 540"/>' +
            '<path class="tbrk" d="M500 556 V 540 H 1220 V 556"/>' +
          '</g>' +
          circles +
          '<text class="shipped" x="860" y="874" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.magentaT + '">what customers run today</text>' +
          '<g class="gr">' +
            '<circle cx="1620" cy="' + MCY + '" r="96" fill="rgba(182,86,160,.12)" stroke="' + C.magenta + '" stroke-width="4" stroke-dasharray="11 9"/>' +
            '<text x="1620" y="' + (MCY + 12) + '" text-anchor="middle" font-family="Archivo" font-size="36" font-weight="750" fill="' + C.text + '">Griffin</text>' +
          '</g>' +
          '<text class="grcap" x="1620" y="' + (MCY + 136) + '" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text2 + '">not shipped yet</text>' +
          '<text class="grcap2" x="1620" y="' + (MCY + 176) + '" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text3 + '">(the last section)</text>' +
        '</svg>' +
        Kit.src('Timeline: CVI launch Aug 2024, three models Mar 2025, Griffin preview Oct 2026. 2021 is Tavus’s own founding year; press says 2020.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      gsap.set([q('.nd1'), q('.nd2'), q('.nd3'), qa('.mc'), q('.gr'), q('.grcap'), q('.grcap2'),
        q('.shipped'), q('.tether')], { autoAlpha: 0 });
      gsap.set([q('.seg1'), q('.seg2'), q('.seg3')], { drawSVG: '0%' });

      // ---- STEP 0: the axis of time ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.tvlogo'), { at: .3, duration: .7 });
      Kit.draw(tl, q('.rail'), { at: .2, duration: .9 });
      Kit.fade(tl, q('.nd0'), { at: .9, duration: .6 });
      ctx.pause();

      // ---- STEP 1: recorded video becomes a live call ----
      tl.to(q('.seg1'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' });
      tl.fromTo(q('.nd1 .dot'), { scale: 0 }, { scale: 1, duration: .5, ease: Kit.ease.back }, '-=.25');
      tl.to(q('.nd1'), { autoAlpha: 1, duration: .4 }, '<');
      tl.from(qa('.nd1 .yr, .nd1 .lb'), { y: 14, duration: .5, ease: Kit.ease.out, stagger: .08 }, '<');
      ctx.pause();

      // ---- STEP 2: 2025, and the three specialist models it shipped ----
      tl.to(q('.seg2'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' });
      tl.fromTo(q('.nd2 .dot'), { scale: 0 }, { scale: 1, duration: .5, ease: Kit.ease.back }, '-=.25');
      tl.to(q('.nd2'), { autoAlpha: 1, duration: .4 }, '<');
      tl.from(qa('.nd2 .yr, .nd2 .lb'), { y: 14, duration: .5, ease: Kit.ease.out, stagger: .08 }, '<');
      tl.to(q('.tether'), { autoAlpha: 1, duration: .35 }, '-=.15');
      tl.to(qa('.mc'), { autoAlpha: 1, duration: .45, stagger: .12 }, '<+.15');
      tl.fromTo(qa('.mc'), { scale: .6 }, { scale: 1, duration: .55, ease: Kit.ease.back, stagger: .12 }, '<');
      ctx.pause();

      // ---- STEP 3: one model previewed, next to the three that still ship ----
      tl.to(q('.seg3'), { drawSVG: '100%', duration: .6, ease: 'power2.inOut' });
      tl.to(q('.nd3'), { autoAlpha: 1, duration: .4 }, '<+.25');
      tl.from(qa('.nd3 .yr, .nd3 .lb'), { y: 14, duration: .5, ease: Kit.ease.out, stagger: .08 }, '<');
      tl.fromTo(q('.gr'), { autoAlpha: 0, scale: .55 }, { autoAlpha: 1, scale: 1, duration: .7, ease: Kit.ease.out }, '-=.2');
      tl.to([q('.grcap'), q('.grcap2')], { autoAlpha: 1, duration: .5, stagger: .12 }, '-=.25');
      tl.to(q('.shipped'), { autoAlpha: 1, duration: .5 }, '<');
    },

    notes:
      'Let\'s look at the evolution of their product over time. V1 was asynchronous, you recorded one video, the model copied it with ' +
      'the right name in each, and then the videos would get sent out automatically.' +
      '[click] In 2024 they threw away that async idea and their initial customers to do live two-way video agents, where the ' +
      'salesperson would directly do a live call with the customer.' +
      '[click] By 2025 they had improved their system but it was still the old sequential pipeline I went over, with the Phoenix, ' +
      'Raven, and Sparrow models. Note that a lot of their customers still run this system.' +
      '[click] And finally in October of this year they previewed the Griffin model, which is what we saw the demo for. This isn\'t ' +
      'actually rolled out fully yet, it\'s still in testing.'
  };

  /* ======================================================================
     3 · SNAPSHOT — money, reach, proof, competitors   (50 s, 2 clicks)
     Steps: 0 money + reach · 1 the customer case (+ the flag, last) · 2 competitors
     ====================================================================== */
  var SNAPSHOT = {
    id: 'snapshot',
    title: 'Company snapshot',
    heading: 'Company snapshot',
    budgetSec: 50,
    html: function () {
      var rivals = ['Anam', 'HeyGen', 'Synthesia', '+ a dozen more'];
      return '' +
        logo(1600, 90, 200) +

        // ---- stat row ----
        '<div class="stat s1" style="position:absolute;left:120px;top:300px;width:820px">' +
          '<div class="t-num n64" style="color:var(--magenta-t)">$0M</div>' +
          '<div class="t-label sub" style="position:absolute;left:0;top:152px;color:var(--text-2)">raised · Sequoia, Scale, CRV</div>' +
        '</div>' +
        '<div class="stat s2" style="position:absolute;left:1000px;top:300px;width:800px">' +
          '<div class="t-num n150" style="color:var(--magenta-t)">0K</div>' +
          '<div class="t-label sub" style="position:absolute;left:0;top:152px;color:var(--text-2)">developers and businesses</div>' +
        '</div>' +
        '<span class="sdiv" style="position:absolute;left:960px;top:300px;width:2px;height:170px;background:var(--line)"></span>' +

        // ---- customer case card ----
        '<div class="card casecard" style="position:absolute;left:120px;top:540px;width:1320px;height:300px">' +
          '<div class="t-h2 ctitle">Qualified built an AI sales rep on Tavus</div>' +
          '<div class="cstat ca"><div class="t-num cnum" style="color:var(--orange-t)">0×</div>' +
            '<div class="t-label clab" style="color:var(--text-2)">more conversations</div></div>' +
          '<div class="cstat cb"><div class="t-num cnum" style="color:var(--orange-t)">0×</div>' +
            '<div class="t-label clab" style="color:var(--text-2)">more meetings booked</div></div>' +
        '</div>' +

        // ---- competitors ----
        '<div class="crowd" style="position:absolute;left:120px;top:890px;display:flex;gap:18px">' +
          rivals.map(function (c, i) {
            return '<span class="cchip' + (i === rivals.length - 1 ? ' last' : '') + '"><b class="t-label">' + c + '</b></span>';
          }).join('') +
        '</div>' +

        Kit.src('Funding: round announcements. Users and customer results: Tavus. Competitors: vendor pages. Logo: Tavus.', 'Self-reported');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      gsap.set([q('.casecard'), qa('.cchip')], { autoAlpha: 0 });

      // ---- STEP 0: money and reach ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.tvlogo'), { at: .3, duration: .7 });
      Kit.count(tl, q('.n64'), { to: 64, prefix: '$', suffix: 'M', duration: 1.3, at: .25 });
      Kit.count(tl, q('.n150'), { to: 150, suffix: 'K', duration: 1.3, at: .4 });
      Kit.rise(tl, qa('.stat .sub'), { at: 1.3, y: 16, stagger: .12 });
      Kit.fade(tl, q('.sdiv'), { at: 1.3 });
      ctx.pause();

      // ---- STEP 1: the customer case — number first, then who measured it ----
      Kit.show(tl, q('.casecard'), { y: 32, duration: .6 });
      tl.to([q('.s1'), q('.s2'), q('.sdiv')], { opacity: .78, duration: .5 }, '<');
      Kit.count(tl, q('.ca .cnum'), { to: 2, suffix: '×', duration: .9, at: '-=.2' });
      Kit.count(tl, q('.cb .cnum'), { to: 6, suffix: '×', duration: .9, at: '<+.2' });
      ctx.pause();

      // ---- STEP 2: the field fills up ----
      tl.to(qa('.cchip'), { autoAlpha: 1, duration: .5, stagger: .07 });
      tl.from(qa('.cchip'), { x: 420, duration: .9, ease: Kit.ease.out, stagger: .07 }, '<');
    },

    notes:
      'In terms of how the financials are looking, they\'ve done a series A and series B, and raised $64m. They report 150k users, and ' +
      'it\'s unclear how many of them are paying customers.' +
      '[click] The most concrete success we can point to here is that Qualified, a sales software company, built an AI sales rep on ' +
      'this and reports 2x the conversations and 6x the meetings booked. Obviously this is not a rigorous study with a control group, ' +
      'but it\'s at least something.' +
      '[click] Perhaps most important is that they have a lot of competition like Anam, HeyGEn, and Synthesia. This is positive for ' +
      'this domain of live AI sales agents overall, but less positive for Tavus.'
  };

  /* ======================================================================
     4 · BRIDGE — into section 04, Negotiate+          (30 s, 1 click)
     Full-bleed statement slide. The throughline strip is the deck's canonical
     one (geometry in specs/airbnb.md § takeaways); the fourth marker,
     NEGOTIATE+, arrives here for the first time.
     ====================================================================== */
  var BRIDGE = {
    id: 'bridge',
    title: 'Bridge into Negotiate+',
    budgetSec: 30,
    html: function () {
      function tok(word, color, cls) {
        return '<span class="tk slab' + (cls ? ' ' + cls : '') + '" style="background:' + color + '"><b class="t-caps">' + word + '</b></span>';
      }
      var sep = '<span class="tk sep">·</span>';
      return '' +
        '<div class="pk-bg" style="position:absolute;inset:0;background:url(assets/img/tavus/peacock.jpg) right 8% center / cover no-repeat"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 36%,rgba(30,27,28,.72) 52%,rgba(30,27,28,0) 70%)"></div>' +

        // three lines so the longest word stays clear of the peacock's neck
        '<div class="t-h1 bl1" style="position:absolute;left:120px;top:340px;width:760px">The AI<br>salesperson<br>is built.</div>' +

        '<div class="strip" style="position:absolute;left:120px;top:820px;display:flex;align-items:center">' +
          tok('PRICE', 'var(--red)') + sep + tok('ASSIST', 'var(--blue)') + sep + tok('INTERACT', 'var(--purple)') + sep +
          tok('NEGOTIATE+', 'var(--green)', 'next') +
        '</div>' +

        Kit.src('The founders say Tavus is Turkish for peacock.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var strip = qa('.strip .tk');
      var done = strip.slice(0, 5);                  // PRICE · ASSIST · INTERACT (+ separators)
      var nextSep = strip[5], nextTok = q('.strip .next');

      gsap.set([q('.bl1')].concat(strip), { autoAlpha: 0 });

      // ---- STEP 0: the peacock and the name ----
      tl.from(q('.pk-bg'), { autoAlpha: 0, scale: 1.06, duration: 2.0, ease: 'power2.out', transformOrigin: '72% 50%' }, 0);
      Kit.fade(tl, q('.src'), { at: 1.0, duration: .8 });
      if (ctx.mode === 'show') {
        gsap.to(q('.pk-bg'), { scale: 1.03, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.4, transformOrigin: '72% 50%' });
      }
      ctx.pause();

      // ---- STEP 1: the payoff line, then the markers and the one still ahead ----
      Kit.show(tl, q('.bl1'), { y: 30, duration: .9 });
      tl.fromTo(done, { autoAlpha: 0, y: 18, scale: .8 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: Kit.ease.back, stagger: .09 }, '+=.25');
      tl.to(nextSep, { autoAlpha: 1, duration: .3 }, '+=.3');
      tl.fromTo(nextTok, { autoAlpha: 0, y: 18, scale: .7 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: Kit.ease.back }, '<');
      // three done, the fourth is the one still ahead
      tl.to(done, { opacity: .5, duration: .4 }, '<+.3');
    },

    notes:
      'As a final little note, the company name Tavus means peacock in Turkish, which is why we have a nice looking peacock on this ' +
      'slide.' +
      '[click] Anyway, we\'ve built the AI salesperson that can price, assist, and interact. Let\'s look at our future markets for what ' +
      'might be next, which is negotiation and beyond.'
  };

  Deck.section({
    id: 'tavus', order: 4, num: '—', kicker: 'Company', title: 'Tavus',
    slides: [ORIGIN, PIVOT, SNAPSHOT, BRIDGE]
  });
})();
