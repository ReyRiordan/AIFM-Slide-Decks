/* ==========================================================================
   00 · Intro — title, agenda   (budget 60 s total)
   Spec: specs/intro.md
   - TITLE: full-bleed photo, no `heading`, entrance only, ambient drift only in show mode.
   - AGENDA: three cut-outs + rows lock in one per click; last row is a muted "What's next".
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/intro/';

  /* Cream doodles around the dish, drawn with rough.js so they look hand-made and can draw themselves on. */
  function titleDoodles() {
    var o = { sw: 3, rough: 1.3, cls: 'dd' };
    function spark(x, y, r, seed) {
      return Kit.rough.line(x, y - r, x, y + r, Object.assign({ seed: seed }, o)) +
        Kit.rough.line(x - r, y, x + r, y, Object.assign({ seed: seed + 1 }, o)) +
        Kit.rough.line(x - r * .6, y - r * .6, x + r * .6, y + r * .6, Object.assign({ seed: seed + 2, sw: 2 }, o)) +
        Kit.rough.line(x + r * .6, y - r * .6, x - r * .6, y + r * .6, Object.assign({ seed: seed + 3, sw: 2 }, o));
    }
    return '<svg class="ttl-dd" width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0">' +
      spark(668, 150, 30, 21) + spark(752, 232, 16, 31) + spark(600, 268, 11, 41) +
      Kit.rough.curve([[124, 588], [300, 572], [480, 580], [664, 566]], { seed: 51, sw: 6, rough: .8, stroke: C.rust, cls: 'dd' }) +
    '</svg>';
  }

  var TITLE = {
    id: 'title',
    title: 'Title',
    budgetSec: 20,
    html: function () {
      return '' +
        '<div class="ttl-bg" style="background-image:url(' + IMG + 'title-dish.jpg)"></div>' +
        '<div class="ttl-shade"></div>' +
        titleDoodles() +
        '<h1 class="t-hero ttl-h">' +
          '<span class="ln"><span>Food,</span></span>' +
          '<span class="ln"><span>Decoded<b class="c-rust">.</b></span></span>' +
        '</h1>' +
        '<p class="t-h2 ttl-sub">How AI reads, finds and mixes what we eat</p>' +
        '<div class="t-label ttl-by">Rey Riordan</div>' +
        Kit.src('Food photo: illustration', 'Generated');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      tl.fromTo(q('.ttl-bg'), { autoAlpha: 0, y: -30, rotation: -1.5, scale: 1.03 },
        { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: .9, ease: 'power3.out' }, 0);
      tl.from(qa('.ln > span'), { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .12 }, .35);
      Kit.rise(tl, q('.ttl-sub'), { at: .9, y: 24 });
      Kit.fade(tl, qa('.ttl-by, .src'), { at: 1.15 });
      Kit.draw(tl, qa('.ttl-dd .rp'), { at: 1.2, duration: .7, stagger: .06 });
      if (ctx.mode === 'show') {
        gsap.to(q('.ttl-bg'), { x: -10, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5 });
      }
    },
    notes:
      'Hi everyone, I\'m Rey. Today is about AI in food design. ' +
      'We\'ll look at four real products, and each one teaches a real machine learning technique. ' +
      'No math background needed. Every technique starts from a food problem you can picture.'
  };

  /* AGENDA: rows match the section markers exactly (num · kicker · section title). */
  var ROWS = [
    { num: '01', kicker: 'Read', title: 'Samsung Food', color: 'teal', img: 'card.webp', x: 170, w: 400, rot: -4 },
    { num: '02', kicker: 'Find', title: 'Shiru', color: 'olive', img: 'beans.webp', x: 760, w: 380, rot: 3 },
    { num: '03', kicker: 'Mix', title: 'NotCo Giuseppe', color: 'saffron', img: 'bowl.webp', x: 1320, w: 380, rot: -2 },
    { num: '04', kicker: 'Sell', title: 'NotCo', color: 'cranberry' }
  ];
  var ROW_Y = 560, ROW_STEP = 86;
  var AGENDA = {
    id: 'agenda',
    title: 'Agenda',
    heading: 'Agenda',
    budgetSec: 40,
    html: function () {
      var props = ROWS.filter(function (r) { return r.img; }).map(function (r, i) {
        return Kit.photo(IMG + r.img, { x: r.x, y: 268, w: r.w, rot: r.rot, cls: 'ag-prop p' + i, alt: r.title });
      }).join('');
      var rows = ROWS.map(function (r, i) {
        return '<div class="ag-row r' + i + '" style="top:' + (ROW_Y + i * ROW_STEP) + 'px">' +
          '<span class="ag-rule" style="background:' + C[r.color] + '"></span>' +
          '<span class="ag-in">' +
            '<span class="ag-chip" style="background:' + C[r.color] + '"></span>' +
            '<span class="t-mono ag-n">' + r.num + '</span>' +
            '<span class="t-h2 ag-k" style="color:' + C[r.color + 'T'] + '">' + r.kicker + '</span>' +
            '<span class="t-body dim ag-t">' + r.title + '</span>' +
          '</span>' +
        '</div>';
      }).join('');
      var next = '<div class="ag-row ag-next" style="top:' + (ROW_Y + ROWS.length * ROW_STEP) + 'px">' +
        '<span class="ag-rule" style="background:var(--surface)"></span>' +
        '<span class="ag-in"><span class="ag-chip" style="background:var(--surface)"></span>' +
        '<span class="t-mono ag-n"></span><span class="t-h2 faint ag-k">What\'s next</span></span>' +
      '</div>';
      return props + rows + next + Kit.src('Food photos: illustration', 'Generated');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ag-prop, .ag-in'), { autoAlpha: 0 });
      gsap.set(qa('.ag-rule'), { opacity: .18 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, qa('.ag-rule, .src'), { at: .2, stagger: .05 });
      function lock(i, sel) {
        tl.addLabel('l' + i);
        if (sel.prop) Kit.drop(tl, q('.p' + sel.prop[0]), { at: 'l' + i });
        tl.to(q(sel.row + ' .ag-rule'), { opacity: 1, duration: .4 }, 'l' + i);
        tl.fromTo(q(sel.row + ' .ag-in'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, 'l' + i + '+=.1');
      }
      for (var i = 0; i < ROWS.length; i++) {
        ctx.pause();
        lock(i, { row: '.r' + i, prop: ROWS[i].img ? [i] : null });
      }
      ctx.pause();
      tl.to(q('.ag-next .ag-rule'), { opacity: 1, duration: .4 });
      tl.fromTo(q('.ag-next .ag-in'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, '<.1');
    },
    notes:
      'Here\'s the plan. Each section turns food into data, one step more abstract than the last. ' +
      '[click] First, Read. Samsung Food takes a photo of a recipe card and turns it into a record a computer can use. ' +
      '[click] Second, Find. Shiru turns proteins into lists of numbers and searches them for new ingredients. ' +
      '[click] Third, Mix. NotCo\'s Giuseppe turns whole recipes into points on a map and searches for new ones. ' +
      '[click] Then Sell: what NotCo did with that AI. ' +
      '[click] And we\'ll finish with what comes next.'
  };

  Deck.section({
    id: 'intro', order: 0, num: '00', kicker: 'Intro', title: '', color: 'rust',
    slides: [TITLE, AGENDA]
  });
})();
