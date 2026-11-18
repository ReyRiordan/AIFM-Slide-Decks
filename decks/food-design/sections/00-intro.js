/* ==========================================================================
   00 · Intro — title, agenda   (budget 40 s total)
   TEMPLATE: replace the text, keep the patterns.
   - TITLE: full-bleed, no `heading`, entrance only, ambient drift only in show mode.
   - AGENDA: one row per section, added one click at a time. The last row is a muted
     "What's next" so the agenda never previews the closing section.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  var TITLE = {
    id: 'title',
    title: 'Title',
    budgetSec: 15,
    html: function () {
      var sw = [C.red, C.orange, C.magenta, C.purple, C.blue, C.green];
      return '' +
        // Put a generated hero image here (assets/img/title-hero.jpg) and uncomment:
        // '<div class="ttl-bg" style="position:absolute;inset:0;background:url(assets/img/title-hero.jpg) right 12% / cover no-repeat"></div>' +
        Kit.panels([
          { x: 1180, y: 120, w: 300, h: 840, color: C.blue, cls: 'ttl-p' },
          { x: 1400, y: 60, w: 300, h: 840, color: C.magenta, cls: 'ttl-p' },
          { x: 1620, y: 180, w: 300, h: 840, color: C.green, cls: 'ttl-p' }
        ]) +
        '<div class="ttl-sw" style="position:absolute;left:132px;top:196px;display:flex;gap:14px">' +
          sw.map(function (c) { return '<span style="display:block;width:58px;height:30px;border-radius:8px;background:' + c + ';transform:skewX(-12deg)"></span>'; }).join('') +
        '</div>' +
        '<h1 class="t-hero" style="position:absolute;left:120px;top:250px;font-stretch:106%;font-size:132px;line-height:1.0">' +
          '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">Deck title</span></span>' +
          '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">goes here<span style="color:var(--orange)">.</span></span></span>' +
        '</h1>' +
        '<p class="ttl-sub t-h2" style="position:absolute;left:120px;top:560px;width:1000px;font-weight:500;font-stretch:100%;color:var(--text-2)">' +
          'One plain subtitle that names the parts' +
        '</p>' +
        '<div class="ttl-by t-label" style="position:absolute;left:120px;top:720px;color:var(--text)"><b>Presenter names</b></div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      Kit.slideIn(tl, qa('.ttl-p'), { at: 0, x: 600, stagger: .1 });
      Kit.slideIn(tl, qa('.ttl-sw span'), { at: .25, x: 520, stagger: .06, duration: .9 });
      tl.from(qa('.ln > span'), { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .12 }, .45);
      Kit.rise(tl, q('.ttl-sub'), { at: 1.0, y: 24 });
      Kit.fade(tl, q('.ttl-by'), { at: 1.3 });
      if (ctx.mode === 'show') {
        // ambient drift: allowed on image-led slides only, very slow
        gsap.to(qa('.ttl-p'), { x: -12, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
      }
    },
    notes:
      'Hi everyone. Today\'s topic is the deck title. This one sentence says what the talk is about.'
  };

  /* AGENDA: rows match the section markers exactly (num · kicker · section title). */
  var ROWS = [
    { num: '01', kicker: 'Marker', title: 'Example section', color: 'blue' },
    { num: '02', kicker: 'Marker', title: 'Second section', color: 'magenta' },
    { num: '03', kicker: 'Marker', title: 'Third section', color: 'green' }
  ];
  var AGENDA = {
    id: 'agenda',
    title: 'Agenda',
    heading: 'Agenda',
    budgetSec: 25,
    html: function () {
      return ROWS.map(function (r, i) {
        return '<div class="ag-row r' + i + '" style="top:' + (330 + i * 150) + 'px">' +
          '<span class="ag-chip" style="background:' + C[r.color] + '"></span>' +
          '<span class="t-mono ag-n">' + r.num + '</span>' +
          '<span class="t-h2 ag-k" style="color:' + C[r.color + 'T'] + '">' + r.kicker + '</span>' +
          '<span class="t-body dim ag-t">' + r.title + '</span>' +
        '</div>';
      }).join('') +
      '<div class="ag-row ag-next" style="top:' + (330 + ROWS.length * 150) + 'px">' +
        '<span class="ag-chip" style="background:var(--surface)"></span>' +
        '<span class="t-h2 faint ag-k">What\'s next</span>' +
      '</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      // rows after the first start hidden, so they are revealed with Kit.show (never from())
      gsap.set(qa('.ag-row:not(.r0)'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.r0'), { at: .3 });
      for (var i = 1; i < ROWS.length; i++) {
        ctx.pause();
        Kit.show(tl, q('.r' + i));
      }
      ctx.pause();
      Kit.show(tl, q('.ag-next'));
    },
    notes:
      'Here\'s the plan. First, the example section, which shows what this part of the system does.' +
      '[click] Second, the next section.' +
      '[click] Third, the last product section.' +
      '[click] And at the end, what comes next.'
  };

  Deck.section({
    id: 'intro', order: 0, num: '00', kicker: 'Intro', title: '', color: 'orange',
    sweep: ['orange', 'red', 'magenta', 'purple', 'blue', 'green'],
    slides: [TITLE, AGENDA]
  });
})();
