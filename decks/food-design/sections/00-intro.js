/* ==========================================================================
   00 · Intro — title, agenda   (budget 60 s total)
   Spec: specs/intro.md
   - TITLE: full-bleed photo, no `heading`, entrance only, ambient drift only in show mode.
     One doodle: a heavy rust underline under the talk's promise.
   - AGENDA: three cut-outs + rows lock in one per click; a rust loop marks the row being talked about;
     last row is a muted "What's next".
   - No source footers anywhere: sources live in 99-refs.js, caveats in the notes (KIT §2.5).
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/intro/';

  var TITLE = {
    id: 'title',
    title: 'Title',
    budgetSec: 20,
    html: function () {
      return '' +
        '<div class="ttl-bg" style="background-image:url(' + IMG + 'title-dish.jpg)"></div>' +
        '<div class="ttl-shade"></div>' +
        '<h1 class="t-hero ttl-h">' +
          '<span class="ln"><span>Food,</span></span>' +
          '<span class="ln"><span>Decoded<b class="c-rust">.</b></span></span>' +
        '</h1>' +
        '<svg class="ttl-svg" width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;overflow:visible">' +
          '<g class="dd-promise">' + Kit.doodle.underline(132, 612, 616, { seed: 21, color: 'var(--rust-t)', w: 'heavy' }) + '</g>' +
        '</svg>' +
        '<p class="t-h2 ttl-sub">How AI reads, finds and mixes what we eat</p>' +
        '<div class="t-label ttl-by">Rey Riordan</div>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(q('.dd-promise'), { autoAlpha: 0 });
      tl.fromTo(q('.ttl-bg'), { autoAlpha: 0, y: -30, rotation: -1.5, scale: 1.03 },
        { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: .9, ease: 'power3.out' }, 0);
      tl.from(qa('.ln > span'), { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .12 }, .35);
      Kit.rise(tl, q('.ttl-sub'), { at: .9, y: 24 });
      Kit.fade(tl, q('.ttl-by'), { at: 1.15 });
      tl.to(q('.dd-promise'), { autoAlpha: 1, duration: .01 }, 1.2);
      Kit.draw(tl, qa('.dd-promise .rp'), { at: 1.2, duration: .6, stagger: .05 });
      if (ctx.mode === 'show') {
        gsap.to(q('.ttl-bg'), { x: -10, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5 });
      }
    },
    notes:
      'Hi everyone, I\'m Rey. Today is about AI in food design. ' +
      'Four real products, and each one teaches a real machine learning technique. No math background needed. ' +
      'One note on the pictures: every bit of food you will see is generated, so none of it is a real product shot.'
  };

  /* AGENDA: rows match the section markers exactly (num · kicker · section title). */
  var ROWS = [
    { num: '01', kicker: 'Read', title: 'Samsung Food', color: 'teal', img: 'card.webp', x: 170, w: 400, rot: -4 },
    { num: '02', kicker: 'Find', title: 'Shiru', color: 'olive', img: 'beans.webp', x: 760, w: 380, rot: 3 },
    { num: '03', kicker: 'Mix', title: 'NotCo Giuseppe', color: 'saffron', img: 'bowl.webp', x: 1320, w: 380, rot: -2 },
    { num: '04', kicker: 'Sell', title: 'NotCo', color: 'cranberry' }
  ];
  var ROW_Y = 566, ROW_STEP = 92;
  function cy(i) { return ROW_Y + i * ROW_STEP + 34; }      // vertical centre of row i
  function ruleY(i) { return ROW_Y + i * ROW_STEP + 74; }

  var AGENDA = {
    id: 'agenda',
    title: 'Agenda',
    heading: 'Agenda',
    budgetSec: 40,
    html: function () {
      var props = ROWS.filter(function (r) { return r.img; }).map(function (r, i) {
        return Kit.photo(IMG + r.img, { x: r.x, y: 268, w: r.w, rot: r.rot, cls: 'ag-prop p' + i, alt: r.title });
      }).join('');

      /* hand-drawn structure: one rule per row, a hatched number tile per product row */
      var svg = '<svg class="ag-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
        ROWS.map(function (r, i) {
          return '<g class="ag-rule rl' + i + '">' +
            Kit.rough.line(120, ruleY(i), 1800, ruleY(i), { seed: 300 + i, w: 'normal', stroke: C[r.color + 'T'] }) + '</g>';
        }).join('') +
        '<g class="ag-rule rl4">' + Kit.rough.line(120, ruleY(4), 1800, ruleY(4), { seed: 304, w: 'fine', stroke: C.text3 }) + '</g>' +
        ROWS.map(function (r, i) {
          return '<g class="ag-tile tl' + i + '">' +
            Kit.rough.rect(120, cy(i) - 32, 82, 64, { seed: 310 + i, w: 'normal', stroke: C[r.color + 'T'],
              hatch: C[r.color + 'T'], fillOpacity: .3, hachureGap: 13 }) +
            '<text class="mono" x="161" y="' + (cy(i) + 11) + '" text-anchor="middle" font-size="30" fill="' + C[r.color + 'T'] + '">' + r.num + '</text>' +
          '</g>';
        }).join('') +
        '<g class="dd-cur">' + Kit.doodle.circle(238, cy(0) - 36, 196, 60, { seed: 320, pad: 2, w: 'heavy' }) + '</g>' +
      '</svg>';

      var rows = ROWS.map(function (r, i) {
        return '<div class="ag-in i' + i + '" style="top:' + (cy(i) - 34) + 'px">' +
          '<span class="t-h2 ag-k" style="color:' + C[r.color + 'T'] + '">' + r.kicker + '</span>' +
          '<span class="t-body dim ag-t">' + r.title + '</span>' +
        '</div>';
      }).join('');
      var next = '<div class="ag-in i4" style="top:' + (cy(4) - 34) + 'px">' +
        '<span class="t-h2 faint ag-k">What\'s next</span></div>';

      return svg + props + rows + next;
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ag-prop, .ag-in, .ag-tile, .dd-cur'), { autoAlpha: 0 });
      gsap.set(qa('.ag-rule'), { opacity: .2 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, qa('.ag-rule .rp'), { at: .2, duration: .6, stagger: .04 });

      for (var i = 0; i < ROWS.length; i++) {
        ctx.pause();
        (function (i) {
          var L = 'l' + i;
          tl.addLabel(L);
          if (ROWS[i].img) Kit.drop(tl, q('.p' + i), { at: L });
          tl.to(q('.rl' + i), { opacity: 1, duration: .4 }, L);
          tl.to(q('.tl' + i), { autoAlpha: 1, duration: .01 }, L);
          Kit.draw(tl, qa('.tl' + i + ' .rp'), { at: L, duration: .4 });
          tl.fromTo(q('.i' + i), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, L + '+=.1');
          if (i === 0) {
            tl.to(q('.dd-cur'), { autoAlpha: 1, duration: .01 }, L + '+=.45');
            Kit.draw(tl, qa('.dd-cur .rp'), { at: L + '+=.45', duration: .6 });
          } else {
            tl.to(q('.dd-cur'), { y: i * ROW_STEP, duration: .5, ease: Kit.ease.inOut }, L + '+=.1');
          }
        })(i);
      }

      ctx.pause();
      tl.addLabel('nx');
      tl.to(q('.dd-cur'), { autoAlpha: 0, duration: .4 }, 'nx');
      tl.to(q('.rl4'), { opacity: .7, duration: .4 }, 'nx');
      tl.fromTo(q('.i4'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: Kit.ease.out }, 'nx+=.1');
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
