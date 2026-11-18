/* ==========================================================================
   02 · Assist — Amazon Rufus / Alexa for Shopping   (budget 6:06 = 366 s)
   Flow: opener 12 · problem 34 · overview 40 · demo 26 · rag 80 · react 36 ·
         dispose 30 · thumbs 32 · results 46 · takeaways 30  = 366
   Spec: specs/rufus.md  ·  Contract: KIT.md  ·  Fix pass: the approved plan
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* ---------------- small local helpers (kept inside this IIFE) ---------------- */
  function at(x, y, extra) { return 'style="position:absolute;left:' + x + 'px;top:' + y + 'px;' + (extra || '') + '"'; }
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function wt(v, i) { return cl(1 - Math.abs(v - i)); }                 // triangular weight
  function hx(c) { c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
  function mix(a, b, t) {
    var A = hx(a), B = hx(b);
    return 'rgb(' + Math.round(A[0] + (B[0] - A[0]) * t) + ',' + Math.round(A[1] + (B[1] - A[1]) * t) + ',' + Math.round(A[2] + (B[2] - A[2]) * t) + ')';
  }
  function mix3(cols, v) {                                              // blend 3 colours by position v in [0,2]
    var r = 0, g = 0, b = 0, s = 0;
    for (var i = 0; i < 3; i++) { var w = wt(v, i); if (!w) continue; var A = hx(cols[i]); r += A[0] * w; g += A[1] * w; b += A[2] * w; s += w; }
    if (!s) s = 1;
    return 'rgb(' + Math.round(r / s) + ',' + Math.round(g / s) + ',' + Math.round(b / s) + ')';
  }
  function svgOverlay(inner, defs) {
    return '<svg class="ov" width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;overflow:visible;pointer-events:none">' +
      (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
  }
  function head(id, color) {                                            // arrowhead marker
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="' + color + '"/></marker>';
  }
  /* Thumb icon, drawn as SVG so it never depends on an emoji font.
     dir 'up' | 'down' (down is the same path, flipped). */
  function thumb(dir, col, size) {
    var g = '<g fill="none" stroke="' + col + '" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="4" y="22" width="11" height="20" rx="3"/>' +
      '<path d="M19,42 V23 L26,9 A4.5,4.5 0 0,1 31.5,14.5 L30,22 H41 A4,4 0 0,1 44.5,27 L42.5,38.5 A4.5,4.5 0 0,1 38,42 Z"/>' +
      '</g>';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48">' +
      (dir === 'down' ? '<g transform="translate(0,48) scale(1,-1)">' + g + '</g>' : g) + '</svg>';
  }
  /* The canonical throughline strip — identical markup/CSS to airbnb/takeaways
     and griffin/takeaway. Rufus state: PRICE done (red slab) · ASSIST current
     (blue slab wipes in on the last click) · INTERACT next (--purple-t)
     · NEGOTIATE+ not reached (--text-3). */
  var THRU = [
    { t: 'Price', cls: 'tk-price' },
    { t: 'Assist', cls: 'tk-assist' },
    { t: 'Interact', cls: 'tk-interact' },
    { t: 'Negotiate+', cls: '' }
  ];
  function stripHtml() {
    return '<div class="thru">' + THRU.map(function (k, i) {
      return (i ? '<span class="sep t-caps">·</span>' : '') +
        '<span class="tok ' + k.cls + '"><span class="bg"></span><span class="tx t-caps">' + k.t + '</span></span>';
    }).join('') + '</div>';
  }

  var RENAME = 'Rufus was renamed <em>Alexa for Shopping</em>, May 2026.';

  /* ======================================================================
     1 · OPENER — section opener (12 s, no clicks)
     ====================================================================== */
  var OPENER = {
    id: 'opener', title: 'Opener', budgetSec: 12,
    html: function () {
      return '' +
      '<div class="r-hero" style="position:absolute;inset:0;background:url(assets/img/rufus/opener.jpg) right 10% / cover no-repeat"></div>' +
      '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 40%,rgba(30,27,28,.82) 60%,rgba(30,27,28,0) 78%)"></div>' +
      '<header class="hd"><div class="tag t-caps"><i></i><b>02 · Assist</b></div></header>' +
      '<div class="r-sw" style="position:absolute;left:132px;top:262px;display:flex;gap:14px">' +
        [C.blue, C.sky, C.teal].map(function (c) {
          return '<span style="display:block;width:58px;height:30px;border-radius:8px;background:' + c + ';transform:skewX(-12deg)"></span>';
        }).join('') +
      '</div>' +
      '<h1 class="t-hero" ' + at(120, 316, 'font-stretch:106%') + '>' +
        '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">Amazon</span></span>' +
        '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px"><span style="display:inline-block">Rufus<span style="color:var(--orange)">.</span></span></span>' +
      '</h1>' +
      '<p class="r-sub t-h2" ' + at(120, 748, 'width:860px;font-weight:500;font-stretch:100%;color:var(--text-2)') + '>' +
        'Amazon’s shopping assistant.</p>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      tl.from(q('.r-hero'), { autoAlpha: 0, scale: 1.10, duration: 2.0, ease: 'power2.out', transformOrigin: '70% 50%' }, 0);
      Kit.rise(tl, q('.hd .tag'), { at: .15 });
      Kit.slideIn(tl, qa('.r-sw span'), { at: .3, x: 520, stagger: .06, duration: .9 });
      tl.from(qa('.ln > span'), { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .12 }, .45);
      Kit.rise(tl, q('.r-sub'), { at: 1.15, y: 24 });
      if (ctx.mode === 'show') {
        gsap.to(q('.r-hero'), { scale: 1.03, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.4 });
      }
    },
    notes:
      'Okay now our AI salesperson can price our products properly. Next we\'ll talk about how we can get it to be a helpful and ' +
      'dynamic shop assistant, using the biggest documented example of Amazon Rufus. Note that Rufus is now integrated into Amazon ' +
      'Alexa, but I will still call it Rufus here.'
  };

  /* ======================================================================
     2 · PROBLEM — what keyword search cannot do (34 s, 3 clicks)
     ====================================================================== */
  var PROBLEM = {
    id: 'problem', title: 'The problem',
    heading: 'The problem', budgetSec: 34,
    html: function () {
      var ph = '';
      [688, 880, 1072].forEach(function (x) {
        ph += '<rect class="ph" x="' + x + '" y="436" width="160" height="96" rx="16" fill="none" stroke="' + C.line + '" stroke-width="2" stroke-dasharray="10 10"/>';
      });
      var fan = '';
      [[743, 748], [1020, 748], [1237, 748]].forEach(function (p, i) {
        fan += '<path class="fan f' + i + '" d="M960,652 C960,700 ' + p[0] + ',700 ' + p[0] + ',' + p[1] + '" fill="none" stroke="' + C.blue +
          '" stroke-width="4" marker-end="url(#rpArr)"/>';
      });
      return '' +
      // search field
      '<div class="pq" ' + at(360, 300, 'width:1200px;height:96px;border-radius:48px;background:var(--surface);border:2px solid var(--line)') + '></div>' +
      '<svg class="mag" width="40" height="40" viewBox="0 0 40 40" ' + at(390, 328) + '>' +
        '<circle cx="17" cy="17" r="12" fill="none" stroke="' + C.text3 + '" stroke-width="3"/><line x1="26" y1="26" x2="35" y2="35" stroke="' + C.text3 + '" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>' +
      '<div class="pq-wrap" ' + at(460, 324, 'font-family:var(--mono);font-weight:500;font-size:36px;color:var(--text)') + '>' +
        '<span class="pq-text" style="display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom">cold-weather golf</span></div>' +
      // verdict
      '<div class="pv t-h2" ' + at(0, 568, 'width:1920px;text-align:center;color:var(--text)') + '>No product is called that.</div>' +
      // chips
      '<div class="pc" ' + at(588, 748, 'display:flex;gap:32px;align-items:center') + '>' +
        ['golf base layers', 'jackets', 'gloves'].map(function (t) {
          return '<span class="pchip" style="display:inline-flex;align-items:center;height:72px;padding:0 34px;border-radius:36px;background:#2A2627;border:2px solid var(--sec);color:var(--sky-t);font-size:36px;font-weight:600">' + t + '</span>';
        }).join('') +
      '</div>' +
      // closing line
      '<div class="pcl t-h2" ' + at(120, 876, 'width:1680px') + '>' +
        '<span style="color:var(--text-3)">Search finds a product.</span> <span style="color:var(--orange-t)">It can’t say what to buy.</span></div>' +
      svgOverlay(ph + fan, head('rpArr', C.blue)) +
      Kit.src('Query and category examples are Amazon’s own (Rufus launch note, 2024). “No product is called that” is the report’s reading of why keyword search fails.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.pv'), q('.pcl')], { autoAlpha: 0 });
      gsap.set(qa('.ph'), { autoAlpha: 0 });
      gsap.set(qa('.fan'), { autoAlpha: 0 });
      gsap.set(qa('.pchip'), { autoAlpha: 0 });

      Kit.rise(tl, ctx.q('.hd'), { y: 24 });
      Kit.slideIn(tl, [q('.pq'), q('.mag')], { at: .15, x: -140, duration: .8 });
      tl.from(q('.pq-text'), { width: 0, duration: .7, ease: 'steps(17)' }, .65);
      ctx.pause();

      // ---- 1 · nothing comes back
      tl.to(qa('.ph'), { autoAlpha: 1, duration: .25, stagger: .07 });
      tl.to(qa('.ph'), { autoAlpha: 0, duration: .5 }, '+=.35');
      Kit.show(tl, q('.pv'), { y: 14, duration: .5, at: '-=.3' });
      ctx.pause();

      // ---- 2 · translation into shoppable categories
      tl.set(qa('.fan'), { autoAlpha: 1 });
      Kit.draw(tl, qa('.fan'), { duration: .55, stagger: .1 });
      tl.fromTo(qa('.pchip'), { autoAlpha: 0, y: 18, scale: .9 }, { autoAlpha: 1, y: 0, scale: 1, duration: .45, ease: Kit.ease.back, stagger: .12 }, '-=.35');
      ctx.pause();

      // ---- 3 · the gap, named
      Kit.show(tl, q('.pcl'), { y: 20 });
    },
    notes:
      'Alright, so why do we need a whole AI shopping assistant? The example Amazon gives is someone searching up “cold-weather golf”.' +
      '[click] Simple keyword search is probably not going to give you optimal results because that\'s not a specific product or thing.' +
      '[click] A shop assistant would know what you meant: base layers, a jacket, gloves. And search those instead.' +
      '[click] So this is the gap according to Amazon, I will say the gap is narrow in this framing but you can see how maybe there ' +
      'are some benefits to having an interactive entity available to support shoppers.'
  };

  /* ======================================================================
     3 · OVERVIEW — how Rufus works (34 s, 3 clicks)
     Each card is a small preview of the slide that explains it, so the
     audience can see where the next five minutes are going.
     ====================================================================== */
  var OVERVIEW = {
    id: 'overview', title: 'How Rufus works',
    heading: 'How Rufus works', budgetSec: 40,
    html: function () {
      // card 1 · the three evidence sources it can read (previews the RAG slide)
      var chips = [
        { t: 'reviews', col: C.tealT },
        { t: 'listing', col: C.skyT },
        { t: 'community Q&A', col: C.purpleT }
      ].map(function (c, i) {
        return '<div class="t-label" style="position:absolute;left:28px;top:' + (190 + i * 72) + 'px;height:64px;padding:0 30px;' +
          'display:inline-flex;align-items:center;border-radius:33px;background:' + C.bg + ';border:2px solid ' + c.col + ';color:' + c.col + '">' + c.t + '</div>';
      }).join('');
      // card 2 · one tool call and its result (previews the tool-calling slide)
      var callv = '<div class="t-mono" style="position:absolute;left:28px;top:190px;font-size:28px;color:var(--sky-t)">getDelivery(item, zip)</div>' +
        '<div class="t-mono" style="position:absolute;left:68px;top:254px;font-size:36px;color:var(--teal-t)">&#8594; "Thu"</div>';
      // card 3 · the two buttons under every answer (previews the ratings slide)
      var rate = '<div style="position:absolute;left:28px;top:190px;width:130px;height:84px;border-radius:20px;background:' + C.bg +
          ';border:3px solid ' + C.tealT + ';display:flex;align-items:center;justify-content:center">' + thumb('up', C.tealT, 48) + '</div>' +
        '<div style="position:absolute;left:178px;top:190px;width:130px;height:84px;border-radius:20px;background:' + C.bg +
          ';border:3px solid ' + C.text3 + ';display:flex;align-items:center;justify-content:center">' + thumb('down', C.text3, 48) + '</div>';

      var cards = [
        { tag: '01', t: 'Looks it up', body: chips },
        { tag: '02', t: 'Calls tools', body: callv },
        { tag: '03', t: 'It learns', body: rate }
      ];
      var h = '';
      cards.forEach(function (c, i) {
        var x = [120, 710, 1300][i];
        h += '<div class="oc oc' + i + '" ' + at(x, 400, 'width:500px;height:430px;border-radius:28px;background:var(--surface);border:3px solid transparent') + '>' +
          '<div class="t-mono" style="position:absolute;left:28px;top:24px;font-size:28px;color:var(--text-3)">' + c.tag + '</div>' +
          '<div class="t-h2 oct" style="position:absolute;left:28px;top:70px;width:440px;white-space:nowrap">' + c.t + '</div>' +
          c.body +
        '</div>';
      });
      h += '<div class="ofoc t-label" ' + at(148, 352, 'color:var(--orange-t)') + '>start here</div>';
      return h + Kit.src('Amazon Science, “The technology behind Rufus”, Oct 2024; AWS on Amazon Bedrock, 2025. Tool call illustrative. ' + RENAME);
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q;
      gsap.set([q('.oc1'), q('.oc2'), q('.ofoc')], { autoAlpha: 0 });
      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.oc0'), { at: .2, y: 40, duration: .7 });
      ctx.pause();
      Kit.show(tl, q('.oc1'), { y: 40, duration: .7 });
      ctx.pause();
      Kit.show(tl, q('.oc2'), { y: 40, duration: .7 });
      ctx.pause();
      // focus: park two, go deep on one
      tl.to([q('.oc1'), q('.oc2')], { opacity: .62, duration: .5 });
      tl.to(q('.oc0'), { borderColor: C.orange, duration: .5 }, '<');
      Kit.show(tl, q('.ofoc'), { y: 12, duration: .4, at: '<' });
    },
    notes:
      'So what does a good shop assistant need? There are three parts of Rufus that we will be going over. First, it needs access to ' +
      'accurate and up to date facts beyond its training data, including customer reviews, the product listing, and questions other ' +
      'shoppers asked.' +
      '[click] Second, it has to interact with live systems, like delivery dates, so it calls tools. ' +
      '[click] Third, it has to get better over time, so it learns from shopper thumbs up or down feedback on its interactions.' +
      '[click] Let\'s start with the first part.'
  };

  /* ======================================================================
     4 · DEMO — Rey's capture (26 s, 1 click)
     The frame sizes itself from the clip's own videoWidth/videoHeight, so a
     re-recording at any aspect ratio fits the content zone with no cropping.
     ====================================================================== */
  var DEMO_SRC = 'assets/capture/rufus-demo.mp4';
  var DV_BOX = { x: 120, y: 290, maxW: 820, maxH: 690, gap: 56 };   // the clip is fitted inside this box
  var DV_FALLBACK = { w: 558, h: 663 };                             // used until the metadata arrives
  var DV_WATCH = [
    { t: 'It searches before it writes', sub: 'Part 1: it looks things up' },
    { t: 'Real products, grouped by layer', sub: 'Base layers · vests · gloves' },
    { t: 'No product is called “cold-weather golf”', sub: 'The gap keyword search could not close' }
  ];
  var DEMO = {
    id: 'demo', title: 'Demo',
    heading: 'Demo', budgetSec: 26,
    html: function () {
      return '' +
      '<div class="dv-frame" ' + at(DV_BOX.x, DV_BOX.y, 'width:' + (DV_FALLBACK.w + 8) + 'px;height:' + (DV_FALLBACK.h + 8) +
        'px;border-radius:24px;background:var(--bg2);border:4px solid var(--sec);overflow:hidden;cursor:pointer') + '>' +
        '<video class="dv-vid" src="' + DEMO_SRC + '" muted playsinline preload="auto" poster="assets/img/rufus/demo-poster.jpg" ' +
          'style="position:absolute;left:0;top:0;width:' + DV_FALLBACK.w + 'px;height:' + DV_FALLBACK.h + 'px;object-fit:contain;display:none"></video>' +
        '<div class="dv-ph" style="position:absolute;inset:0;background:#2A2627;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">' +
          '<div class="t-h2" style="color:var(--text-2)">Rufus demo</div>' +
          '<div class="t-label" style="color:var(--text-3);font-weight:500">capture missing</div>' +
        '</div>' +
      '</div>' +

      '<div class="dv-ask" ' + at(800, 296, 'width:1000px') + '>' +
        '<div class="t-caps" style="color:var(--text-2)">I asked</div>' +
        '<div class="t-mono" style="margin-top:14px;font-size:36px;line-height:1.3;color:var(--orange-t)">“What do I need for cold-weather golf?”</div>' +
      '</div>' +

      '<div class="dv-watch" ' + at(800, 446, 'width:1000px') + '>' +
        '<div class="t-caps" style="color:var(--text-2)">Watch for</div>' +
        DV_WATCH.map(function (w, i) {
          return '<div class="dv-w dv-w' + i + ' card">' +
            '<span class="dv-n t-mono">' + (i + 1) + '</span>' +
            '<div><div class="t-body">' + w.t + '</div><div class="t-label dv-sub">' + w.sub + '</div></div></div>';
        }).join('') +
      '</div>' +
      Kit.src('Screen capture from Rey’s own Amazon account (Alexa for Shopping panel, Nov 2026); account details cropped out.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var v = q('.dv-vid'), frame = q('.dv-frame'), ask = q('.dv-ask'), watch = q('.dv-watch'), ok = false;

      /* Fit any aspect ratio inside DV_BOX and move the text column to the
         right of whatever width that produces. */
      function fit(vw, vh) {
        if (!vw || !vh) return;
        var s = Math.min(DV_BOX.maxW / vw, DV_BOX.maxH / vh);
        var w = Math.round(vw * s), h = Math.round(vh * s);
        frame.style.width = (w + 8) + 'px';
        frame.style.height = (h + 8) + 'px';
        frame.style.top = (DV_BOX.y + Math.round((DV_BOX.maxH - h) / 2)) + 'px';
        v.style.width = w + 'px';
        v.style.height = h + 'px';
        var cx = DV_BOX.x + w + 8 + DV_BOX.gap, cw = 1800 - cx;
        ask.style.left = cx + 'px'; ask.style.width = cw + 'px';
        watch.style.left = cx + 'px'; watch.style.width = cw + 'px';
      }
      fit(DV_FALLBACK.w, DV_FALLBACK.h);

      v.onerror = function () { ok = false; };
      v.onloadedmetadata = function () {
        ok = true;
        fit(v.videoWidth, v.videoHeight);
        v.style.display = 'block';
        q('.dv-ph').style.display = 'none';
      };
      if (v.readyState >= 1) v.onloadedmetadata();
      // Rey can click the panel to pause / replay (not a deck step)
      var onClick = function () {
        if (!ok) return;
        if (v.paused) { if (v.ended) v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      };
      frame.addEventListener('click', onClick);
      ctx.cleanup(function () { frame.removeEventListener('click', onClick); try { v.pause(); v.currentTime = 0; } catch (e) {} });

      gsap.set(qa('.dv-watch, .dv-w'), { autoAlpha: 0 });
      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.dv-frame'), { at: .15, y: 24, duration: .7 });
      Kit.rise(tl, q('.dv-ask'), { at: .3, y: 20 });
      ctx.pause();

      // click 1: play the capture; the three things to watch for arrive with it
      // GSAP fires this callback in both directions: forward it plays the clip,
      // backward (← to the entrance) it stops and reloads so the poster shows again
      var playAt = tl.duration();
      tl.add(function () {
        if (!ok || ctx.mode !== 'show') return;
        try {
          if (tl.time() < playAt) { v.pause(); v.load(); return; }
          v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {});
        } catch (e) {}
      }, playAt);
      tl.set(q('.dv-watch'), { autoAlpha: 1 });
      Kit.show(tl, qa('.dv-w'), { y: 16, stagger: .15, duration: .45 });
    },
    notes:
      'Here Rufus/Alexa in action for the example we just went over of cold weather golf.' +
      '[click] Note how it searches before it writes anything, and then you get real products, grouped by layer: base layers, vests, ' +
      'gloves. We see how the problem was solved, and that initial search is what we care about now.'
  };

  /* ======================================================================
     5 · RAG — retrieval-augmented generation (80 s, 5 clicks) · CORE
     State object + one pure render(), tweened with onUpdate — so back-nav
     and print mode are correct for free (KIT §4).
     The three numbered steps light in order: Retrieve → Add to prompt → Generate.
     ====================================================================== */
  var TILE = [
    { y: 470, caps: 'REVIEWS',       sub: 'how it feels in use',       col: C.teal,   tint: C.tealT },
    { y: 600, caps: 'LISTING',       sub: 'facts the seller typed',    col: C.sky,    tint: C.skyT },
    { y: 730, caps: 'COMMUNITY Q&amp;A', sub: 'what other shoppers asked', col: C.purple, tint: C.purpleT }
  ];
  /* One worked question per source. `frag` is the fetched text that flies into
     the prompt slot, so the audience sees real words crossing, not a blob. */
  var QA = [
    { q: '“Is this cordless drill easy to hold?”', frag: '“bulky for small hands”', a: ['Reviewers say the', 'grip is bulky for', 'small hands.'] },
    { q: '“Is this jacket machine washable?”',     frag: '“machine wash cold”',     a: ['The listing says:', 'machine wash cold.'] },
    { q: '“Does the drill come with a battery?”',  frag: '“no battery included”',   a: ['Shoppers answered:', 'no battery included.'] }
  ];
  var STEPS = [
    { x: 120,  n: '1', t: 'Retrieve' },
    { x: 660,  n: '2', t: 'Add to prompt' },
    { x: 1120, n: '3', t: 'Generate' }
  ];

  var RAG = {
    id: 'rag', title: 'Retrieval-augmented generation (RAG)',
    heading: 'Retrieval-augmented generation (RAG)', budgetSec: 80,
    html: function () {
      var h = '';
      // question chip
      h += '<div class="rqbg" ' + at(120, 282, 'width:1080px;height:96px;border-radius:48px;background:var(--surface)') + '></div>';
      QA.forEach(function (d, i) {
        h += '<div class="rq rq' + i + '" ' + at(160, 282, 'width:1000px;height:96px;line-height:96px;font-size:36px;font-weight:600;color:var(--text)') + '>' + d.q + '</div>';
      });
      // the three named steps, sitting above the zone each one happens in
      STEPS.forEach(function (s, i) {
        h += '<div class="rs rs' + i + ' t-caps" ' + at(s.x, 404, 'white-space:nowrap;color:' + C.text3) + '>' +
          '<span style="font-family:var(--mono);margin-right:16px">' + s.n + '</span>' + s.t + '</div>';
      });
      // source tiles
      h += '<div class="rtiles">';
      TILE.forEach(function (t, i) {
        h += '<div class="rt rt' + i + '" ' + at(120, t.y, 'width:460px;height:120px;border-radius:20px;background:var(--surface);border:3px solid transparent') + '>' +
          '<div class="rt-caps t-caps" style="position:absolute;left:24px;top:22px;color:var(--text-2)">' + t.caps + '</div>' +
          '<div class="rt-sub t-label" style="position:absolute;left:24px;top:64px;font-weight:500;color:var(--text-3)">' + t.sub + '</div>' +
        '</div>';
      });
      h += '</div>';
      // model box
      h += '<div class="rm" ' + at(660, 490, 'width:380px;height:290px;border-radius:28px;background:#2A2627;border:3px solid var(--sec)') + '>' +
        '<div class="t-caps" style="position:absolute;left:0;top:16px;width:380px;text-align:center;color:var(--text-3)">The model</div>' +
        '<div class="t-h2" style="position:absolute;left:0;top:50px;width:380px;text-align:center">weights<br>frozen</div>' +
        '<div class="t-label" style="position:absolute;left:0;top:166px;width:380px;text-align:center;font-weight:500;color:var(--text-3)">trained months ago</div>' +
        '<svg width="44" height="44" viewBox="0 0 44 44" style="position:absolute;left:320px;top:14px">' +
          '<rect x="7" y="19" width="30" height="21" rx="5" fill="none" stroke="' + C.text3 + '" stroke-width="3"/>' +
          '<path d="M14,19 v-6 a8,8 0 0,1 16,0 v6" fill="none" stroke="' + C.text3 + '" stroke-width="3"/>' +
        '</svg>' +
        '<div class="rslot" style="position:absolute;left:24px;top:210px;width:332px;height:50px;border-radius:12px;border:2px dashed ' + C.line + '"></div>' +
        '<div class="rslot-t t-caps" style="position:absolute;left:24px;top:224px;width:332px;text-align:center;font-size:28px;color:var(--text-3)">the prompt</div>' +
      '</div>';
      // the fetched words, in flight from the lit tile to the prompt slot
      h += '<div class="rfly" ' + at(684, 700, 'width:332px;height:50px') + '>' +
        QA.map(function (d, i) {
          return '<div class="rfg rfg' + i + ' t-label" style="position:absolute;left:0;top:11px;width:332px;text-align:center;' +
            'font-weight:500;white-space:nowrap">' + d.frag + '</div>';
        }).join('') +
      '</div>';
      // answer card (drawn at step 3, with the text it holds)
      h += '<div class="rabg" ' + at(1120, 470, 'width:680px;height:300px;border-radius:28px;background:var(--surface)') + '></div>' +
        '<div class="ra-caps t-caps" ' + at(1148, 500, 'color:var(--text-3)') + '>Answer</div>';
      QA.forEach(function (d, i) {
        h += '<div class="ra ra' + i + ' t-h2" ' + at(1148, 548, 'width:624px') + '>' + d.a.join('<br>') + '</div>';
      });
      // closing line
      h += '<div class="rcl t-h2" ' + at(120, 900, 'width:1680px;color:var(--orange-t)') + '>Picking the source is learned.</div>';
      // arrows
      var svg = '' +
        '<path class="arrC" d="M420,378 C420,444 560,470 648,496" fill="none" stroke="' + C.text3 + '" stroke-width="4" marker-end="url(#rgC)"/>' +
        '<path class="arrA" d="M580,530 C620,530 620,635 660,635" fill="none" stroke="' + C.tealT + '" stroke-width="4" marker-end="url(#rgA)"/>' +
        '<path class="arrB" d="M1040,635 L1112,635" fill="none" stroke="' + C.blue + '" stroke-width="4" marker-end="url(#rgB)"/>';
      h += svgOverlay(svg, head('rgA', C.tealT) + head('rgB', C.blue) + head('rgC', C.text3));
      return h + Kit.src('Amazon Science, Oct 2024: Rufus pulls from reviews, the catalogue and community Q&amp;A. Source selection is the hard part. Examples illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var tiles = qa('.rt'), fly = q('.rfly');
      var arrA = q('.arrA'), arrB = q('.arrB');
      var cols = [TILE[0].col, TILE[1].col, TILE[2].col];
      var tints = [TILE[0].tint, TILE[1].tint, TILE[2].tint];

      var st = { q: 0, lit: 0, litOn: 0, tiles: 0, fly: 0, frag: 0, pulse: 0, card: 0, ans: 0, close: 0, s0: 0, s1: 0, s2: 0 };

      function render() {
        var lit = st.lit, litTint = mix3(tints, lit);
        // the three named steps
        [st.s0, st.s1, st.s2].forEach(function (v, i) {
          var el = q('.rs' + i);
          el.style.color = mix(C.text3, C.orangeT, v);
          el.style.opacity = v;
        });
        // tiles group
        q('.rtiles').style.opacity = st.tiles;
        q('.rtiles').style.transform = 'translateX(' + (-60 * (1 - st.tiles)) + 'px)';
        tiles.forEach(function (el, i) {
          var w = wt(lit, i) * st.litOn;
          el.style.background = mix(C.surface, cols[i], .18 * w);
          el.style.borderColor = w ? mix(C.surface, cols[i], w) : 'transparent';
          el.querySelector('.rt-caps').style.color = mix(C.text2, tints[i], w);
          el.querySelector('.rt-sub').style.color = mix(C.text3, C.text2, w);
        });
        // arrow A: origin slides down the tile column with the lit state
        var ay = 530 + lit * 130;
        arrA.setAttribute('d', 'M580,' + ay + ' C620,' + ay + ' 620,635 660,635');
        arrA.setAttribute('stroke', litTint);
        arrA.style.opacity = st.litOn;
        arrA.setAttribute('marker-end', st.litOn > .5 ? 'url(#rgA)' : '');
        q('#rgA').firstChild.setAttribute('fill', litTint);
        // the fetched words: start inside the lit tile, land in the prompt slot
        var u = 1 - st.fly, s = 1 + .18 * st.pulse;
        fly.style.transform = 'translate(' + (-534 * u) + 'px,' + ((-200 + 130 * lit) * u) + 'px) scale(' + s + ')';
        fly.style.opacity = st.frag * cl(st.fly * 2.2);
        q('.rslot-t').style.opacity = 1 - st.frag;
        // question, fetched words and answer all follow the same index
        QA.forEach(function (d, i) {
          var w = wt(st.q, i);
          q('.rq' + i).style.opacity = w;
          q('.rfg' + i).style.opacity = w;
          q('.rfg' + i).style.color = litTint;
          q('.ra' + i).style.opacity = w * st.ans;
        });
        // closing line
        q('.rcl').style.opacity = st.close;
        q('.rcl').style.transform = 'translateY(' + (20 * (1 - st.close)) + 'px)';
      }
      var R = { onUpdate: render, onComplete: render };
      render();

      // ---- entrance (step 0): the question and the frozen model
      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.slideIn(tl, [q('.rqbg'), q('.rq0')], { at: .15, x: -160, duration: .8 });
      Kit.rise(tl, q('.rm'), { at: .5, y: 26, duration: .6 });
      gsap.set([q('.rabg'), q('.ra-caps')], { autoAlpha: 0 });
      tl.set(arrB, { autoAlpha: 0 });
      Kit.draw(tl, q('.arrC'), { at: .95, duration: .6 });
      ctx.pause();

      // ---- 1 · step 1 Retrieve: three sources, one of them lights
      tl.to(st, Object.assign({ tiles: 1, duration: .55, ease: Kit.ease.out }, R));
      tl.to(st, Object.assign({ s0: 1, duration: .35 }, R), '<');
      tl.to(st, Object.assign({ litOn: 1, duration: .4 }, R));
      ctx.pause();

      // ---- 2 · step 2 Add to prompt: the fetched words cross into the prompt
      tl.to(st, Object.assign({ s1: 1, duration: .35 }, R));
      tl.to(st, Object.assign({ frag: 1, duration: .2 }, R), '<');
      tl.to(st, Object.assign({ fly: 1, duration: .85, ease: 'power2.inOut' }, R), '-=.1');
      ctx.pause();

      // ---- 3 · step 3 Generate: the answer card arrives with its answer
      tl.set(arrB, { autoAlpha: 1 });
      Kit.draw(tl, arrB, { duration: .45 });
      tl.to(st, Object.assign({ s2: 1, duration: .35 }, R), '<');
      Kit.show(tl, [q('.rabg'), q('.ra-caps')], { y: 24, duration: .5, stagger: .06, at: '-=.2' });
      tl.to(st, Object.assign({ ans: 1, duration: .5 }, R), '-=.1');
      tl.to(st, Object.assign({ pulse: 1, duration: .3, yoyo: true, repeat: 1 }, R), '<');
      ctx.pause();

      // ---- 4 · different question, different source
      tl.to(st, Object.assign({ q: 1, lit: 1, duration: .6, ease: 'power2.inOut' }, R));
      ctx.pause();

      // ---- 5 · a third source: what other shoppers asked
      tl.to(st, Object.assign({ q: 2, lit: 2, duration: .6, ease: 'power2.inOut' }, R));
      tl.to(st, Object.assign({ close: 1, duration: .5, ease: Kit.ease.out }, R), '-=.1');
    },
    notes:
      // LOAD-BEARING: the phrase "one word at a time" below is called back by Griffin's distillation slide. Do not cut it.
      'So why would a model need to look things up? The main answer is that its weights are frozen with some knowledge cutoff, so it ' +
      'doesn\'t have access to very specific and recent facts like hey is this cordless drill easy to hold. The solution is to use RAG, ' +
      'which we\'ve already gone over in many past presentations.' +
      '[click] So in this application of RAG there would be three sources that Rufus has access to, reviews, listing, and community ' +
      'Q&A, and based on this question Rufus would decide to retrieve from the reviews, RAG would retrieve certain relevant reviews as ' +
      'context (bulky for small hands), and Rufus would use that to answer.' +
      '[click] RAG would retrieve certain relevant reviews as context (bulky for small hands), ' +
      '[click] and Rufus would use that to answer.' +
      '[click] The interesting thing here is how agentic the RAG is, where if the question is different like "is this jacket machine ' +
      'washable", Rufus is the one that decides to retrieve from the listing.' +
      '[click] And so the model gets to choose the retrieval source itself, and this accurate decision making of source selection ' +
      'based on the user query is learned behavior.'
  };

  /* ======================================================================
     6 · REACT — tool calling, as a three-lane sequence (36 s, 4 clicks)
     Lanes: Shopper · Model · Store software. One arrow per click, in time order.
     ====================================================================== */
  var LANES = [
    { x: 380,  t: 'Shopper',        col: C.text2 },
    { x: 960,  t: 'Model',          col: C.blueT },
    { x: 1540, t: 'Store software', col: C.tealT }
  ];
  var MSGS = [
    { from: 0, to: 1, y: 480, col: C.blue,    t: '“Will it get here by Friday?”', mono: false },
    { from: 1, to: 2, y: 590, col: C.skyT,    t: 'getDelivery(item, zip)',        mono: true },
    { from: 2, to: 1, y: 700, col: C.tealT,   t: '“Thursday”',                    mono: true },
    { from: 1, to: 0, y: 810, col: C.orangeT, t: '“It arrives Thursday.”',        mono: false }
  ];

  var REACT = {
    id: 'react', title: 'Tool calling',
    heading: 'Tool calling', budgetSec: 36,
    html: function () {
      var h = '';
      // lane headers
      LANES.forEach(function (L, i) {
        h += '<div class="sq-lane sq-lane' + i + '" ' + at(L.x - 210, 300, 'width:420px;height:84px;border-radius:20px;background:var(--surface);' +
          'border:2px solid ' + L.col + ';display:flex;align-items:center;justify-content:center') + '>' +
          '<span class="t-caps" style="color:' + L.col + '">' + L.t + '</span></div>';
      });
      // "runs it" marker on the software lane, between the call and the result
      h += '<div class="sq-run" ' + at(1410, 618, 'width:260px;height:64px;border-radius:16px;background:var(--surface);border:2px solid ' + C.line +
        ';display:flex;align-items:center;justify-content:center') + '>' +
        '<span class="t-caps" style="color:var(--text-2)">runs it</span></div>';
      // message labels, each above its arrow
      MSGS.forEach(function (m, i) {
        var a = LANES[m.from].x, b = LANES[m.to].x;
        var left = Math.min(a, b), w = Math.abs(b - a);
        h += '<div class="sq-m sq-m' + i + (m.mono ? ' t-mono' : '') + '" ' +
          at(left, m.y - 58, 'width:' + w + 'px;text-align:center;font-size:36px;font-weight:' + (m.mono ? 500 : 600) + ';color:' + m.col) + '>' +
          (m.mono ? Kit.esc(m.t) : m.t) + '</div>';
      });
      // caption
      h += '<div class="sq-cap t-h2" ' + at(120, 872, 'width:1680px;text-align:center;color:var(--text-2)') + '>' +
        'The model writes the request. <span style="color:var(--orange-t)">Ordinary software runs it.</span></div>';
      // lifelines + arrows
      var svg = '';
      LANES.forEach(function (L, i) {
        svg += '<line class="sq-ll sq-ll' + i + '" x1="' + L.x + '" y1="392" x2="' + L.x + '" y2="848" stroke="' + C.line +
          '" stroke-width="3" stroke-dasharray="6 12"/>';
      });
      MSGS.forEach(function (m, i) {
        var a = LANES[m.from].x, b = LANES[m.to].x, d = b > a ? -10 : 10;
        svg += '<path class="sq-a sq-a' + i + '" d="M' + (a - d) + ',' + m.y + ' L' + (b + d) + ',' + m.y + '" fill="none" stroke="' + m.col +
          '" stroke-width="5" marker-end="url(#sqA' + i + ')"/>';
      });
      var defs = MSGS.map(function (m, i) { return head('sqA' + i, m.col); }).join('');
      return h + svgOverlay(svg, defs) +
        Kit.src('Amazon, SIGIR 2026 (abstract only): Rufus follows a ReAct-style loop pairing LLM reasoning with deterministic backend services. Call illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sq-a'), { autoAlpha: 0 });
      gsap.set(qa('.sq-m'), { autoAlpha: 0 });
      gsap.set(q('.sq-run'), { autoAlpha: 0 });
      gsap.set(q('.sq-cap'), { autoAlpha: 0 });

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, qa('.sq-lane'), { at: .15, y: 20, duration: .5, stagger: .12 });
      Kit.fade(tl, qa('.sq-ll'), { at: .5, duration: .5, stagger: .1 });
      ctx.pause();

      function send(i) {
        tl.set(q('.sq-a' + i), { autoAlpha: 1 });
        Kit.draw(tl, q('.sq-a' + i), { duration: .5 });
        Kit.show(tl, q('.sq-m' + i), { y: 14, duration: .4, at: '-=.3' });
      }

      // ---- 1 · the shopper asks
      send(0);
      ctx.pause();

      // ---- 2 · the model writes a call instead of prose
      send(1);
      ctx.pause();

      // ---- 3 · the software runs the call and returns a value
      Kit.show(tl, q('.sq-run'), { y: 12, duration: .35 });
      send(2);
      ctx.pause();

      // ---- 4 · the model writes the answer, and the caption names the split
      send(3);
      Kit.show(tl, q('.sq-cap'), { y: 16, duration: .5, at: '+=.1' });
    },
    notes:
      'Next up is tool calling for things that can\'t be simply retrieved from a document.' +
      '[click] For example, if the shopper asks whether the package will arrive by Friday, this is new information that isn\'t written ' +
      'down anywhere yet.' +
      '[click] So instead the model writes a request in the form of a function call to obtain this information from the Amazon server ' +
      'directly.' +
      '[click] And then the store software actually runs that function against the real delivery system and returns the output of ' +
      '"Thursday".' +
      '[click] And finally the model uses that output in its generated response. So in tool calling you\'re essentially allowing the ' +
      'model to run code by telling it "hey if you generate a request in this format, we\'ll take it and run it for you and give you ' +
      'the output". '
  };

  /* ======================================================================
     7 · DISPOSE — Auto Buy (30 s, 3 clicks)
     A six-month price line against a target the model wrote down once.
     ====================================================================== */
  var PX0 = 160, PX1 = 1240, PY_TOP = 420, PY_BOT = 800;        // plot box
  var PRICES = [98, 96, 99, 94, 92, 95, 90, 93, 88, 86, 89, 84, 87, 82, 80, 83, 78, 81, 76, 74, 77, 72, 74, 67, 64, 63];
  var TARGET = 70;
  function py(p) { return PY_BOT - (p - 50) / 50 * (PY_BOT - PY_TOP); }
  function px(i) { return PX0 + i * (PX1 - PX0) / (PRICES.length - 1); }

  var DISPOSE = {
    id: 'dispose', title: 'Auto Buy',
    heading: 'Auto Buy', budgetSec: 30,
    html: function () {
      var hit = -1;
      for (var i = 0; i < PRICES.length; i++) { if (PRICES[i] <= TARGET) { hit = i; break; } }
      // the line stops at the buy point: the crossing ends the story
      var pts = PRICES.slice(0, hit + 1).map(function (p, i) { return px(i).toFixed(1) + ',' + py(p).toFixed(1); }).join(' ');
      var ty = py(TARGET).toFixed(1);

      var h = '';
      // axis labels
      h += '<div class="pz-y t-caps" ' + at(PX0, 384, 'color:var(--text-3)') + '>price</div>';
      h += '<div class="pz-x t-caps" ' + at(PX0, 828, 'width:' + (PX1 - PX0) + 'px;text-align:center;color:var(--text-3)') + '>six months</div>';
      h += '<div class="pz-t t-mono" ' + at(PX0 + 14, 592, 'font-size:36px;color:var(--orange-t)') + '>target $70</div>';
      // the record the model writes, once
      h += '<div class="pz-rec" ' + at(1320, 400, 'width:480px;height:300px;border-radius:28px;background:var(--surface)') + '>' +
        '<div class="t-caps" style="position:absolute;left:28px;top:26px;color:var(--text-3)">The record</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:90px;font-size:36px;color:var(--text)">item: golf gloves</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:150px;font-size:36px;color:var(--orange-t)">target: $70</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:210px;font-size:36px;color:var(--text)">expires: 6 months</div>' +
      '</div>';
      h += '<div class="pz-code t-label" ' + at(1320, 732, 'width:460px;color:var(--text-2);font-weight:500') + '>Plain code checks the price. The model is not running.</div>';
      h += '<div class="pz-buy t-body" ' + at(660, 712, 'width:480px;text-align:right;color:var(--orange-t);font-weight:600') + '>bought within 30 minutes</div>';
      h += '<div class="pz-cl t-h2" ' + at(120, 888, 'width:1680px;color:var(--text-2)') + '>The model writes the record once. ' +
        '<span style="color:var(--orange-t)">Code does the waiting.</span></div>';

      var svg = '' +
        '<line class="pz-ax" x1="' + PX0 + '" y1="' + PY_BOT + '" x2="' + PX1 + '" y2="' + PY_BOT + '" stroke="' + C.line + '" stroke-width="3"/>' +
        '<line class="pz-ay" x1="' + PX0 + '" y1="' + PY_TOP + '" x2="' + PX0 + '" y2="' + PY_BOT + '" stroke="' + C.line + '" stroke-width="3"/>' +
        [1, 2, 3, 4, 5].map(function (m) {
          var x = PX0 + m * (PX1 - PX0) / 6;
          return '<line class="pz-tick" x1="' + x + '" y1="' + PY_BOT + '" x2="' + x + '" y2="' + (PY_BOT + 12) + '" stroke="' + C.line + '" stroke-width="3"/>';
        }).join('') +
        '<line class="pz-tgt" x1="' + PX0 + '" y1="' + ty + '" x2="' + PX1 + '" y2="' + ty + '" stroke="' + C.orangeT + '" stroke-width="3" stroke-dasharray="12 12"/>' +
        '<polyline class="pz-line" points="' + pts + '" fill="none" stroke="' + C.skyT + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<g class="pz-hit"><circle class="pz-ring" cx="' + px(hit).toFixed(1) + '" cy="' + py(PRICES[hit]).toFixed(1) + '" r="14" fill="none" stroke="' + C.orange + '" stroke-width="4"/>' +
        '<circle cx="' + px(hit).toFixed(1) + '" cy="' + py(PRICES[hit]).toFixed(1) + '" r="13" fill="' + C.orange + '"/></g>' +
        '<line class="pz-lead" x1="1150" y1="' + (py(PRICES[hit]) + 14).toFixed(1) + '" x2="1150" y2="724" stroke="' + C.orangeT + '" stroke-width="3"/>';

      return h + svgOverlay(svg) +
        Kit.src('AWS, 2025: the model writes a price-alert record; plain code watches six months and buys within 30 minutes. Price line illustrative.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.pz-rec'), q('.pz-t'), q('.pz-code'), q('.pz-buy'), q('.pz-cl'), q('.pz-hit'), q('.pz-lead')], { autoAlpha: 0 });
      gsap.set(q('.pz-tgt'), { autoAlpha: 0 });
      gsap.set(q('.pz-line'), { autoAlpha: 0 });

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.draw(tl, [q('.pz-ax'), q('.pz-ay')], { at: .15, duration: .6, stagger: .08 });
      Kit.fade(tl, [q('.pz-y'), q('.pz-x')], { at: .4, duration: .4, stagger: .08 });
      Kit.fade(tl, qa('.pz-tick'), { at: .5, duration: .3, stagger: .05 });
      ctx.pause();

      // ---- 1 · the model writes one record, and that sets the target line
      Kit.show(tl, q('.pz-rec'), { y: 28, duration: .55 });
      tl.fromTo(q('.pz-tgt'), { autoAlpha: 0, attr: { x2: PX0 } }, { autoAlpha: 1, attr: { x2: PX1 }, duration: .7, ease: 'power2.out' }, '-=.2');
      Kit.show(tl, q('.pz-t'), { y: 10, duration: .35, at: '-=.2' });
      ctx.pause();

      // ---- 2 · plain code watches the price for six months
      tl.set(q('.pz-line'), { autoAlpha: 1 });
      Kit.draw(tl, q('.pz-line'), { duration: 2.0, ease: 'none' });
      Kit.show(tl, q('.pz-code'), { y: 16, duration: .45, at: '-=1.6' });
      ctx.pause();

      // ---- 3 · the line crosses the target, and the purchase happens
      Kit.show(tl, q('.pz-hit'), { y: 0, duration: .3, ease: Kit.ease.back });
      tl.fromTo(q('.pz-ring'), { attr: { r: 14 }, opacity: 1 }, { attr: { r: 34 }, opacity: 0, duration: .7, ease: 'power2.out' }, '-=.1');
      tl.set(q('.pz-lead'), { autoAlpha: 1 });
      Kit.draw(tl, q('.pz-lead'), { duration: .3, at: '-=.5' });
      Kit.show(tl, q('.pz-buy'), { y: 12, duration: .4, at: '-=.1' });
      Kit.show(tl, q('.pz-cl'), { y: 18, duration: .5, at: '+=.1' });
    },
    notes:
      'And once you realize that it\'s just basically giving models API access, you can start to go for more interesting tools. The ' +
      'example here for Rufus is that a shopper can ask it to monitor the price of an item and auto buy it once it reaches a certain ' +
      'price.' +
      '[click] The model can just call this auto buy tool with the correct parameters of the item, target price, and expiration date.' +
      '[click] And from there, plain code takes over. The model is not running for those 6 months.' +
      '[click] Once the price crosses the target, and the purchase completes within thirty minutes. '
  };

  /* ======================================================================
     8 · THUMBS — learning from ratings (32 s, 3 clicks)
     ====================================================================== */
  var THUMBS = {
    id: 'thumbs', title: 'Learning from ratings',
    heading: 'Learning from ratings', budgetSec: 32,
    html: function () {
      // the two buttons under every answer, drawn as SVG (same icon as the overview)
      function btn(cls, dir, col) {
        return '<div class="' + cls + '" style="width:124px;height:80px;border-radius:20px;background:' + C.bg + ';border:3px solid ' + col +
          ';display:flex;align-items:center;justify-content:center">' + thumb(dir, col, 46) + '</div>';
      }
      var boxes = [
        { caps: 'What shoppers do', t: 'Two buttons<br>per answer', body: btn('tg-up', 'up', C.tealT) + btn('tg-dn', 'down', C.text3),
          s: 'few answers get rated' },
        { caps: 'A second model', t: 'Predicts<br>the rating', body: '', s: 'it grades every answer' },
        { caps: 'The writer', t: 'Trained for<br>high scores', body: '', s: 'with a cap on how far it moves' }
      ];
      var h = '';
      boxes.forEach(function (b, i) {
        var x = [120, 710, 1300][i];
        h += '<div class="tb tb' + i + '" ' + at(x, 380, 'width:500px;border-radius:28px;background:var(--surface);' +
          'padding:36px;display:flex;flex-direction:column;align-items:flex-start') + '>' +
          '<div class="t-caps" style="color:var(--text-3)">' + b.caps + '</div>' +
          '<div class="t-h2" style="margin-top:20px;line-height:1.1">' + b.t + '</div>' +
          '<div class="tb-body" style="margin-top:24px;height:80px;display:flex;gap:20px;align-items:center">' + b.body + '</div>' +
          '<div class="sb t-label" style="margin-top:24px;color:var(--text-2);font-weight:500">' + b.s + '</div>' +
        '</div>';
      });
      h += '<div class="tr-lab t-label" ' + at(660, 876, 'width:600px;text-align:center;color:var(--text-3);font-weight:500') + '>new answers, new ratings</div>';
      var svg =
        '<path class="tf tf0" d="M628,580 L700,580" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#thA)"/>' +
        '<path class="tf tf1" d="M1218,580 L1290,580" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#thA)"/>' +
        // solid, not dashed: DrawSVG overwrites stroke-dasharray, so a dashed path cannot also be drawn
        '<path class="tret" d="M1550,792 L1550,828 Q1550,848 1530,848 L390,848 Q370,848 370,828 L370,798" fill="none" stroke="' + C.text3 +
          '" stroke-width="3" marker-end="url(#thB)"/>';
      return h + svgOverlay(svg, head('thA', C.blue) + head('thB', C.text3)) +
        Kit.src('Amazon says shoppers mark answers liked or disliked and Rufus learns from that; the reward design is unpublished. Pipeline shown is standard RLHF.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.tb1'), q('.tb2'), q('.tr-lab'), q('.tb0 .sb')], { autoAlpha: 0 });
      gsap.set(qa('.tf'), { autoAlpha: 0 });
      gsap.set(q('.tret'), { autoAlpha: 0 });

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.tb0'), { at: .15, y: 36, duration: .6 });
      tl.from(qa('.tg-up, .tg-dn'), { scale: .7, autoAlpha: 0, transformOrigin: '50% 50%', duration: .4, ease: Kit.ease.back, stagger: .12 }, '-=.2');
      ctx.pause();

      // ---- 1 · few people press them, so a grader learns to predict the rating
      Kit.show(tl, q('.tb0 .sb'), { y: 10, duration: .35 });
      tl.set(q('.tf0'), { autoAlpha: 1 });
      Kit.draw(tl, q('.tf0'), { duration: .4 });
      Kit.show(tl, q('.tb1'), { y: 36, duration: .55, at: '-=.1' });
      ctx.pause();

      // ---- 2 · grader → nudge the writer
      tl.set(q('.tf1'), { autoAlpha: 1 });
      Kit.draw(tl, q('.tf1'), { duration: .4 });
      Kit.show(tl, q('.tb2'), { y: 36, duration: .55, at: '-=.1' });
      ctx.pause();

      // ---- 3 · the loop closes and never stops
      tl.set(q('.tret'), { autoAlpha: 1 });
      Kit.draw(tl, q('.tret'), { duration: .9 });
      Kit.show(tl, q('.tr-lab'), { y: 10, duration: .4, at: '-=.3' });
    },
    notes:
      'The last part is learning from human feedback. There\'ll be a thumbs up or down option for shoppers for every Rufus answer that ' +
      'they can press.' +
      '[click] The actual feedback here is sparse. So instead Amazon trains a second model to predict the rating, and that model ' +
      'grades every answer.' +
      '[click] And then they train Rufus to get high scores from this grader model, with some caps of course.' +
      '[click] And so you repeat this process and you continuously learn from human feedback to improve answer quality.'
  };

  /* ======================================================================
     10 · RESULTS — Amazon's own numbers (46 s, 3 clicks)
     ====================================================================== */
  var RESULTS = {
    id: 'results', title: 'Results',
    heading: 'Results', budgetSec: 46,
    html: function () {
      // One caps label carrying scope and period, one value, one caption.
      function card(cls, x, numCls, caps, cap, capMono) {
        return '<div class="' + cls + '" ' + at(x, 320, 'width:800px;height:300px;border-radius:28px;background:var(--surface)') + '>' +
          '<div class="' + numCls + ' t-num" style="position:absolute;left:40px;top:40px"></div>' +
          '<div class="rc-caps t-caps" style="position:absolute;left:40px;top:200px;width:720px;color:var(--text-3)">' + caps + '</div>' +
          '<div class="' + (capMono ? 't-mono' : 't-label') + '" style="position:absolute;left:40px;top:244px;width:720px;color:var(--text-2);font-weight:500' +
            (capMono ? ';font-size:36px' : '') + '">' + cap + '</div>' +
        '</div>';
      }
      var h =
        card('ra-a', 120, 'num-a', 'Customers · 12 months to Sept 2026',
          '<span class="ra-int" style="color:var(--blue-t)">interactions +570%</span>', true) +
        card('ra-b', 980, 'num-b', 'Incremental sales · Q4 2025', 'Amazon’s own estimate, annualized');
      h += '<div class="ra-chip" ' + at(120, 680, 'width:1680px;height:110px;border-radius:24px;background:#2A2627;border:2px solid ' + C.line) + '>' +
        '<div class="ra-q t-h2" style="position:absolute;left:40px;top:28px;width:1600px;color:var(--text-2)">“Users are 60% more likely to complete a purchase.”</div></div>';
      h += '<div class="ra-badge t-caps" ' + at(140, 622, 'padding:8px 18px;border-radius:999px;background:var(--bg);border:2px solid ' + C.line + ';color:var(--text-2)') + '>Selection bias</div>';
      h += '<div class="ra-verdict t-h2" ' + at(120, 850, 'width:1680px;font-stretch:100%') + '>They were <span style="color:var(--orange-t)">already closer to buying</span>.</div>';
      h += '<div class="ra-fix t-label" ' + at(120, 930, 'width:1680px;color:var(--text-2);font-weight:500') + '>A clean test hides the feature from a random slice of customers.</div>';
      return h +
        Kit.src('Amazon Q3 2026 results and the Q4 2025 earnings call. Unaudited, no method published. The $12B is for Rufus, Q4 2025.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q;
      var nb = q('.num-b'); nb.style.color = C.orangeT;
      gsap.set([q('.ra-b'), q('.ra-chip'), q('.ra-badge'), q('.ra-verdict'), q('.ra-fix')], { autoAlpha: 0 });
      q('.num-a').textContent = '0';
      nb.textContent = '~$0B';

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.ra-a'), { at: .15, y: 32, duration: .6 });
      Kit.count(tl, q('.num-a'), { to: 400, suffix: 'M+', duration: .9, at: '-=.3' });
      Kit.fade(tl, q('.ra-int'), { at: '-=.1' });
      ctx.pause();

      // ---- 1 · the second company number, a year older than the first
      Kit.show(tl, q('.ra-b'), { y: 32, duration: .55 });
      Kit.count(tl, nb, { to: 12, prefix: '~$', suffix: 'B', duration: .9, at: '-=.25' });
      ctx.pause();

      // ---- 2 · the quote lands as a quote
      Kit.show(tl, q('.ra-chip'), { y: 28, duration: .55 });
      ctx.pause();

      // ---- 3 · demote the claim and name what is wrong with it
      tl.to(q('.ra-chip'), { opacity: .45, duration: .5, ease: 'power2.inOut' });
      Kit.show(tl, q('.ra-badge'), { y: 14, duration: .35, ease: Kit.ease.back, at: '<' });
      Kit.show(tl, [q('.ra-verdict'), q('.ra-fix')], { y: 18, duration: .5, stagger: .12, at: '-=.1' });
    },
    notes:
      'So if you combine all of these parts into one system, does it actually work? Amazon says over 400M customers used it in 12 ' +
      'months, with interactions up 570%.' +
      '[click] And $12B in extra annualized sales. These are just Amazon\'s self reported numbers.' +
      '[click] They also report that users are 60% more likely to complete a purchase.' +
      '[click] We do have to note the selection bias here, because anyone that actually opens a shopping assistant was already close ' +
      'to buying. There was no clean test against a control group that did not have access to the assistant, so I wouldn\'t put much ' +
      'weight on this stat.'
  };

  /* ======================================================================
     11 · TAKEAWAYS — what travels beyond Rufus (30 s, 1 click)
     CANONICAL SECTION CLOSER — pixel-identical to airbnb/takeaways and
     griffin/takeaway apart from text, image and section colour.
     ====================================================================== */
  var TKROWS = [
    ['01', 'RAG', 'Facts change faster than<br>you can retrain. Fetch them.'],
    ['02', 'Tool calling', 'Let the model write the request.<br>Let plain code run it.']
  ];

  var TAKEAWAYS = {
    id: 'takeaways', title: 'Takeaways',
    heading: 'Takeaways', budgetSec: 30,
    html: function () {
      var rows = TKROWS.map(function (r, i) {
        return '<div class="tk-row r' + i + '" style="top:' + (355 + i * 190) + 'px">' +
          '<div class="n t-mono">' + r[0] + '</div>' +
          '<div class="rule"></div>' +
          '<div class="tg t-caps">' + r[1] + '</div>' +
          '<div class="ln t-h2">' + r[2] + '</div>' +
        '</div>';
      }).join('');
      return '' +
        '<img class="tk-img" src="assets/img/rufus/opener.jpg" alt="" style="object-position:62% center">' +
        '<div class="tk-veil"></div>' +
        rows +
        stripHtml() +
        Kit.src('Amazon Science, Oct 2024; Amazon, SIGIR 2026.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var slab = q('.tk-assist .bg');

      // strip: PRICE already slabbed, ASSIST unfilled at entrance, the rest tertiary
      gsap.set(qa('.thru .tx'), { color: C.text3 });
      gsap.set(q('.tk-price .bg'), { backgroundColor: C.red, skewX: -12 });
      gsap.set(q('.tk-price .tx'), { color: '#FFFFFF' });
      gsap.set(slab, { backgroundColor: C.blue, skewX: -12, scaleX: 0, transformOrigin: 'left center' });
      // row 2 is hidden by default, so they are revealed with Kit.show (never from())
      gsap.set(qa('.r1 > *'), { autoAlpha: 0 });

      // ---- entrance: image, veil, header, row 01, strip ----
      tl.from([q('.tk-img'), q('.tk-veil')], { autoAlpha: 0, duration: .9, ease: 'power2.out' }, 0);
      Kit.rise(tl, qa('.hd > *'), { at: .15, stagger: .1 });
      Kit.rise(tl, qa('.r0 > *'), { at: .45, stagger: .07, duration: .6 });
      Kit.fade(tl, q('.thru'), { at: .7, duration: .5 });
      ctx.pause();

      // ---- click 1: the second lesson, and the throughline moves on ----
      Kit.show(tl, qa('.r1 > *'), { stagger: .07, duration: .5 });
      tl.to(slab, { scaleX: 1, duration: .5, ease: Kit.ease.out }, '<+.1');
      tl.to(q('.tk-assist .tx'), { color: '#FFFFFF', duration: .4 }, '<+.2');
      tl.to(q('.tk-interact .tx'), { color: C.purpleT, duration: .5 }, '<+.1');
    },
    notes:
      'Anyway, here\'s two general takeaways from this application. #1 is reiterating the classic RAG lesson, where if there are facts ' +
      'that are changing faster than it\'s realistic to retrain then you should just retrieve them. ' +
      '[click] #2 is this tool calling idea where you let the model write the request, and let plain code run it. And really you ' +
      'should be trying to offload as much behavior as possible to deterministic code that your agent simply tool calls. \n\nOK, now our ' +
      'AI salesperson can price products and assist the shopper, we\'re getting somewhere, let\'s keep going.'
  };

  // the three parts from the overview slide; technique slides carry a marker for the one they explain
  var PARTS = ['Looks it up', 'Calls tools', 'Learns'];

  Deck.section({
    id: 'rufus', order: 2, num: '02', kicker: 'Assist', title: 'Amazon Rufus',
    slides: [OPENER, PROBLEM, OVERVIEW, DEMO,
      Kit.withCrumbs(RAG, PARTS, 0), Kit.withCrumbs(REACT, PARTS, 1), Kit.withCrumbs(DISPOSE, PARTS, 1),
      Kit.withCrumbs(THUMBS, PARTS, 2),
      RESULTS, TAKEAWAYS]
  });
})();
