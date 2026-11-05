/* ==========================================================================
   00 · Intro — title, definition, agenda   (budget 1:00 total)
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* ---------- Title ---------- */
  var TITLE = {
    id: 'title',
    title: 'Title — AI for Automated Selling',
    budgetSec: 15,
    html: function () {
      var sw = [C.red, C.orange, C.magenta, C.purple, C.blue, C.green];
      return '' +
        '<div class="ttl-bg" style="position:absolute;inset:0;background:url(assets/img/title-hero.jpg) right 12% / cover no-repeat"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 34%,rgba(30,27,28,.72) 50%,rgba(30,27,28,0) 66%)"></div>' +
        '<div class="ttl-sw" style="position:absolute;left:132px;top:196px;display:flex;gap:14px">' +
          sw.map(function (c) { return '<span style="display:block;width:58px;height:30px;border-radius:8px;background:' + c + ';transform:skewX(-12deg)"></span>'; }).join('') +
        '</div>' +
        '<h1 class="t-hero ttl-h" style="position:absolute;left:120px;top:250px;font-stretch:106%;font-size:132px;line-height:1.0">' +
          '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">AI for</span></span>' +
          '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">Automated</span></span>' +
          '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">Selling<span style="color:var(--orange)">.</span></span></span>' +
        '</h1>' +
        '<p class="ttl-sub t-h2" style="position:absolute;left:120px;top:716px;width:1060px;font-weight:500;font-stretch:100%;color:var(--text-2)">' +
          'How AI <b class="w c-red">prices</b>, <b class="w c-blue">assists</b> and <b class="w c-purple">interacts</b>' +
        '</p>' +
        '<div class="ttl-by t-label" style="position:absolute;left:120px;top:888px;color:var(--text-2)">' +
          '<b style="color:var(--text)">Rey · Emin · Ashiqa · Anika · Nolan</b>' +
        '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      tl.from(q('.ttl-bg'), { autoAlpha: 0, scale: 1.12, x: 80, duration: 2.4, ease: 'power2.out', transformOrigin: '75% 50%' }, 0);
      Kit.slideIn(tl, qa('.ttl-sw span'), { at: .25, x: 520, stagger: .06, duration: .9 });
      tl.from(qa('.ln > span'), { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .12 }, .45);
      Kit.rise(tl, q('.ttl-sub'), { at: 1.05, y: 24 });
      tl.from(qa('.ttl-sub .w'), { color: '#C9C0BA', duration: .6, stagger: .18 }, 1.35);
      Kit.fade(tl, q('.ttl-by'), { at: 1.6 });
      if (ctx.mode === 'show') {
        // ambient: very slow drift of the hero so the title never feels frozen
        gsap.to(q('.ttl-bg'), { scale: 1.035, x: -14, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
      }
    },
    notes:
      'Hi everyone, I\'m Rey, presenting for our group. Our topic is AI for automated selling. ' +
      'Three real products: one sets a price, one helps a shopper pick, one talks to you on video. ' +
      'No machine-learning background needed.'
  };

  /* ---------- shared chip shape (definition cards + agenda rows) ---------- */
  function chipStyle(color, left, top) {
    return 'position:absolute;left:' + left + 'px;top:' + top +
      'px;width:72px;height:38px;border-radius:10px;background:' + color + ';transform:skewX(-12deg)';
  }

  /* ======================================================================
     DEFINITION — what automated selling means (0:20)
     Steps: 1 the three seller-side jobs
     ====================================================================== */
  var DEFINITION = {
    id: 'definition',
    title: 'Automated selling',
    heading: 'Automated selling',
    budgetSec: 20,
    html: function () {
      var col = [C.red, C.blue, C.purple];
      var tint = ['c-red', 'c-blue', 'c-purple'];
      var mark = ['Price', 'Assist', 'Interact'];
      var job = ['Sets the price', 'Helps you pick', 'Talks to you'];
      var x = [120, 700, 1280];

      var out =
        '<p class="df-def t-h2" style="position:absolute;left:120px;top:304px;width:1560px;font-weight:600;color:var(--text)">' +
          'Software that does <b style="color:var(--orange);font-weight:800">any part</b> of the seller\'s job.' +
        '</p>' +
        '<div class="df-cap t-caps" style="position:absolute;left:120px;top:502px;color:var(--text-3)">Three of those parts</div>';

      for (var i = 0; i < 3; i++) {
        // flex column: chip, job, marker. An extra wrapped line pushes the
        // marker down instead of landing on top of it.
        out += '<div class="df-card df-card' + i + '" style="left:' + x[i] + 'px">' +
          '<div class="df-chip" style="background:' + col[i] + '"></div>' +
          '<div class="df-job t-h2">' + job[i] + '</div>' +
          '<div class="df-mark t-caps ' + tint[i] + '">' + mark[i] + '</div>' +
        '</div>';
      }
      return out;
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var cards = qa('.df-card');

      gsap.set(cards, { autoAlpha: 0 });
      gsap.set(q('.df-cap'), { autoAlpha: 0 });

      // entrance: the heading, then the one sentence, parked near the optical
      // centre so the slide is not three quarters black while Rey reads it
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.fromTo(q('.df-def'), { autoAlpha: 0, y: 186 },
        { autoAlpha: 1, y: 166, duration: .7, ease: Kit.ease.out }, .3);

      // step 1: the sentence moves up and the three jobs take the space it leaves
      ctx.pause();
      tl.to(q('.df-def'), { y: 0, duration: .55, ease: 'power3.inOut' });
      Kit.show(tl, q('.df-cap'), { y: 12, duration: .35, at: '-=.2' });
      tl.fromTo(cards, { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', stagger: .12 }, '-=.15');
    },

    notes:
      'First, the term. Automated selling is software that takes over part of what a salesperson does. ' +
      'Not the whole job, any part of it. ' +
      '[click] A seller sets the price, helps you pick, and talks to you face to face. ' +
      'Each of those three is a shipped product, and a section of this talk.'
  };

  /* ======================================================================
     AGENDA — the salesperson assembles, one section per click (0:25)
     Steps: 1 Price (body + price tag) · 2 Assist (speech bubble) · 3 Interact (head)
     THE AGENDA MOTIF. The Future unit's `assembled` close reuses this
     geometry verbatim: rowY 368/518/668/818, chip (130,rowY) 72×38,
     number x232, label x330, sub-caption x330 (+48). If one moves, both move.
     ====================================================================== */
  var ROW_Y = [368, 518, 668, 818];
  var ROW_X_CHIP = 130, ROW_X_NUM = 232, ROW_X_LAB = 330;

  var AGENDA = {
    id: 'agenda',
    title: 'Agenda',
    heading: 'Agenda',
    budgetSec: 25,
    html: function () {
      var col = [C.red, C.blue, C.purple];
      var num = ['01', '02', '03', ''];
      var lab = ['PRICE', 'ASSIST', 'INTERACT', 'What’s next'];
      var sub = ['Airbnb Smart Pricing', 'Amazon Rufus', 'Tavus Griffin', ''];

      // three masked cut-outs of one render, stacked in the same frame so they
      // line up pixel for pixel when all three are in place
      var IMG = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:right center';
      var names = ['price', 'assist', 'interact'];
      // a dim grey copy of each part marks the slot it will fill, so the stage is
      // never blank and the audience can see what is still missing
      var ghost = names.map(function (p) {
        return '<img class="ag-ghost ag-ghost-' + p + '" src="assets/img/intro/part-' + p + '.png" alt="" style="' + IMG + '">';
      }).join('');
      var part = names.map(function (p) {
        return '<img class="ag-part ag-' + p + '" src="assets/img/intro/part-' + p + '.png" alt="" style="' + IMG + '">';
      }).join('');

      // a soft red pool behind the price tag, lit on click 1 so the eye lands on
      // the one thing in the render that says "price"
      var tagGlow = '<div class="ag-tagglow" style="position:absolute;left:1600px;top:620px;width:300px;height:300px;' +
        'border-radius:50%;background:radial-gradient(circle,' + C.red + ' 0%,rgba(0,0,0,0) 68%)"></div>';

      var out =
        '<div class="ag-art" style="position:absolute;inset:0">' + ghost + tagGlow + part + '</div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,rgba(30,27,28,.92) 32%,rgba(30,27,28,0) 54%)"></div>' +
        '<div class="ag-fg" style="position:absolute;inset:0">';

      for (var i = 0; i < 4; i++) {
        var muted = i === 3;
        out += '<div class="ag-row ag-row' + i + '" style="position:absolute;inset:0">' +
          // row 4 is a coda, not a numbered section: no chip, no number, no sub-line
          (muted ? '' : '<div style="' + chipStyle(col[i], ROW_X_CHIP, ROW_Y[i]) + '"></div>') +
          (num[i] ? '<div class="t-h2 t-mono" style="position:absolute;left:' + ROW_X_NUM + 'px;top:' + (ROW_Y[i] - 10) + 'px;color:var(--text-2)">' + num[i] + '</div>' : '') +
          '<div class="t-h2" style="position:absolute;left:' + ROW_X_LAB + 'px;top:' + (ROW_Y[i] - 14) +
            'px;font-style:italic;font-weight:850;font-stretch:115%;white-space:nowrap' + (muted ? ';color:var(--text-3)' : '') + '">' + lab[i] + '</div>' +
          (sub[i] ? '<div class="t-label" style="position:absolute;left:' + ROW_X_LAB + 'px;top:' + (ROW_Y[i] + 48) +
            'px;white-space:nowrap;color:var(--text-2)">' + sub[i] + '</div>' : '') +
        '</div>';
      }
      return out + '</div>';
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var rows = qa('.ag-row');
      var parts = [q('.ag-price'), q('.ag-assist'), q('.ag-interact')];
      var ghosts = [q('.ag-ghost-price'), q('.ag-ghost-assist'), q('.ag-ghost-interact')];
      var col = [C.red, C.blue, C.purple];
      // each part enters from the direction it belongs to: torso up, bubble in
      // from the left, head down onto the shoulders
      var from = [{ y: 220 }, { x: -260 }, { y: -240 }];

      gsap.set(parts, { autoAlpha: 0 });
      gsap.set(ghosts, { autoAlpha: 0 });
      gsap.set(rows, { autoAlpha: 0 });
      gsap.set(q('.ag-tagglow'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      // entrance: the empty outline of the whole figure
      tl.fromTo(ghosts, { autoAlpha: 0 }, { autoAlpha: .55, duration: .8, ease: 'power1.out', stagger: .12 }, .25);

      for (var i = 0; i < 3; i++) {
        ctx.pause();
        var at = tl.duration();
        var p = parts[i], c = col[i];
        // the part that arrived last hands its glow over to this one
        if (i > 0) tl.to(parts[i - 1], { filter: 'drop-shadow(0 0 0px ' + col[i - 1] + ')', duration: .6, ease: 'power2.inOut' }, at + .4);
        // the slot it filled stops being a slot
        tl.to(ghosts[i], { autoAlpha: 0, duration: .3, ease: 'power1.out' }, at + .3);
        tl.fromTo(p, Object.assign({ autoAlpha: 0 }, from[i]),
          { autoAlpha: 1, x: 0, y: 0, duration: .62, ease: 'power3.out' }, at);
        // the part locks, then holds a low glow in the section colour so the
        // chip beside the row still points at something once the motion stops
        tl.fromTo(p, { filter: 'drop-shadow(0 0 0px ' + c + ')' },
          { filter: 'drop-shadow(0 0 54px ' + c + ')', duration: .22, ease: 'power2.out' }, at + .5);
        tl.to(p, { filter: 'drop-shadow(0 0 28px ' + c + ')', duration: .7, ease: 'power2.inOut' }, at + .72);
        if (i === 0) tl.fromTo(q('.ag-tagglow'), { autoAlpha: 0, scale: .82 },
          { autoAlpha: .5, scale: 1, duration: .7, ease: 'power2.out', transformOrigin: '50% 50%' }, at + .5);
        if (i === 1) tl.to(q('.ag-tagglow'), { autoAlpha: .16, duration: .6, ease: 'power2.inOut' }, at + .4);
        Kit.show(tl, rows[i], { y: 18, duration: .4, at: at + .18 });
      }

      // the fourth row is not a section yet, so it arrives quietly after the figure
      Kit.show(tl, rows[3], { y: 14, duration: .5, at: '-=.1' });
    },

    notes:
      'Here is the plan. The grey outline is the salesperson we build, one part per section. ' +
      '[click] Price: Airbnb Smart Pricing sets the nightly rate. ' +
      '[click] Assist: Amazon Rufus, the shopping assistant in the Amazon app. ' +
      '[click] Interact: Tavus Griffin puts a face on a live video call. ' +
      'The last row is where this goes next, and I come back to it.'
  };

  Deck.section({
    id: 'intro', order: 0, num: '00', kicker: 'Intro', title: '',
    slides: [TITLE, DEFINITION, AGENDA]
  });
})();
