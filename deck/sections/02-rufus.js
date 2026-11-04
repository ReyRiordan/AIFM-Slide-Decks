/* ==========================================================================
   02 · Assist — Amazon Rufus / Alexa for Shopping   (budget 6:30 = 390 s)
   Flow: opener 12 · problem 34 · overview 34 · demo 26 · rag 80 · react 36 ·
         dispose 30 · thumbs 32 · trap 24 · results 46 · takeaways 36  = 390
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
     · NEGOTIATE not reached (--text-3). */
  var THRU = [
    { t: 'Price', cls: 'tk-price' },
    { t: 'Assist', cls: 'tk-assist' },
    { t: 'Interact', cls: 'tk-interact' },
    { t: 'Negotiate', cls: '' }
  ];
  function stripHtml() {
    return '<div class="thru">' + THRU.map(function (k, i) {
      return (i ? '<span class="sep t-caps">·</span>' : '') +
        '<span class="tok ' + k.cls + '"><span class="bg"></span><span class="tx t-caps">' + k.t + '</span></span>';
    }).join('') + '</div>';
  }

  var RENAME = 'Amazon renamed Rufus to <em>Alexa for Shopping</em> on 13 May 2026. Amazon says the same engine still powers parts of it.';

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
      'Part two. Our salesperson can price. Now it has to assist: answer the shopper’s questions, ' +
      'recommend, remind, and buy. Amazon’s assistant is the biggest one anybody has documented.'
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
      'Type “cold-weather golf” into a search box. ' +
      '[click] Nothing comes back. No product carries that title, so a keyword matcher has nothing to match. ' +
      '[click] A shop assistant would know what you meant: base layers, a jacket, gloves. ' +
      'Those are three searches you would have to know to run. ' +
      '[click] That is the gap. Search finds a product you can already name. It cannot tell you what to buy. ' +
      'This is Amazon’s own framing, and the reason Rufus exists.'
  };

  /* ======================================================================
     3 · OVERVIEW — how Rufus works (34 s, 3 clicks)
     Each card is a small preview of the slide that explains it, so the
     audience can see where the next five minutes are going.
     ====================================================================== */
  var OVERVIEW = {
    id: 'overview', title: 'How Rufus works',
    heading: 'How Rufus works', budgetSec: 34,
    html: function () {
      // card 1 · the three evidence sources it can read (previews the RAG slide)
      var chips = [
        { t: 'reviews', col: C.tealT },
        { t: 'listing', col: C.skyT },
        { t: 'delivery', col: C.orangeT }
      ].map(function (c, i) {
        return '<div class="t-label" style="position:absolute;left:28px;top:' + (206 + i * 80) + 'px;height:66px;padding:0 30px;' +
          'display:inline-flex;align-items:center;border-radius:33px;background:' + C.bg + ';border:2px solid ' + c.col + ';color:' + c.col + '">' + c.t + '</div>';
      }).join('');
      // card 2 · one tool call and its result (previews the tool-calling slide)
      var callv = '<div class="t-mono" style="position:absolute;left:28px;top:248px;font-size:28px;color:var(--sky-t)">getDelivery(item, zip)</div>' +
        '<div class="t-mono" style="position:absolute;left:68px;top:312px;font-size:36px;color:var(--teal-t)">&#8594; "Thu"</div>';
      // card 3 · the two buttons under every answer (previews the ratings slide)
      var rate = '<div style="position:absolute;left:28px;top:270px;width:130px;height:84px;border-radius:20px;background:' + C.bg +
          ';border:3px solid ' + C.tealT + ';display:flex;align-items:center;justify-content:center">' + thumb('up', C.tealT, 48) + '</div>' +
        '<div style="position:absolute;left:178px;top:270px;width:130px;height:84px;border-radius:20px;background:' + C.bg +
          ';border:3px solid ' + C.text3 + ';display:flex;align-items:center;justify-content:center">' + thumb('down', C.text3, 48) + '</div>';

      var cards = [
        { tag: '01', t: 'Looks it up', body: chips },
        { tag: '02', t: 'Calls tools', body: callv },
        { tag: '03', t: 'Learns from ratings', body: rate }
      ];
      var h = '';
      cards.forEach(function (c, i) {
        var x = [120, 740, 1360][i];
        h += '<div class="oc oc' + i + '" ' + at(x, 400, 'width:440px;height:460px;border-radius:28px;background:var(--surface);border:3px solid transparent') + '>' +
          '<div class="t-mono" style="position:absolute;left:28px;top:24px;font-size:28px;color:var(--text-3)">' + c.tag + '</div>' +
          '<div class="t-h2" style="position:absolute;left:28px;top:70px;width:384px">' + c.t + '</div>' +
          c.body +
        '</div>';
      });
      h += '<div class="ofoc t-label" ' + at(148, 352, 'color:var(--orange-t)') + '>start here</div>';
      return h + Kit.src('Amazon Science, “The technology behind Rufus”, Oct 2024; AWS, “How Rufus scales… with Amazon Bedrock”, 2025. The tool call shown is illustrative. ' + RENAME);
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
      'Amazon trained Rufus on its own shopping data: the catalogue, the reviews, the community questions. ' +
      'Three parts do the work. First, it looks things up. Reviews, the product listing, a live delivery service. ' +
      '[click] Second, it calls tools. It writes a request like getDelivery, and ordinary software runs it. ' +
      '[click] Third, every answer carries a thumbs-up and a thumbs-down, and those ratings feed back into training. ' +
      '[click] We start with looking things up, because that idea is everywhere now.'
  };

  /* ======================================================================
     4 · DEMO — Rey's capture (26 s, 1 click)
     The frame sizes itself from the clip's own videoWidth/videoHeight, so a
     re-recording at any aspect ratio fits the content zone with no cropping.
     ====================================================================== */
  var DEMO_SRC = 'assets/capture/rufus-demo.mp4';
  var DV_BOX = { x: 120, y: 290, maxW: 820, maxH: 690, gap: 56 };   // the clip is fitted inside this box
  var DV_FALLBACK = { w: 558, h: 663 };                             // used until the metadata arrives
  var DEMO = {
    id: 'demo', title: 'Demo',
    heading: 'Demo', budgetSec: 26,
    html: function () {
      return '' +
      '<div class="dv-frame" ' + at(DV_BOX.x, DV_BOX.y, 'width:' + (DV_FALLBACK.w + 8) + 'px;height:' + (DV_FALLBACK.h + 8) +
        'px;border-radius:24px;background:var(--bg2);border:4px solid var(--sec);overflow:hidden;cursor:pointer') + '>' +
        '<video class="dv-vid" src="' + DEMO_SRC + '" muted playsinline preload="auto" poster="assets/capture/rufus-demo-poster.jpg" ' +
          'style="position:absolute;left:0;top:0;width:' + DV_FALLBACK.w + 'px;height:' + DV_FALLBACK.h + 'px;object-fit:contain;display:none"></video>' +
        '<div class="dv-ph" style="position:absolute;inset:0;background:#2A2627;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">' +
          '<div class="t-h2" style="color:var(--text-2)">Rufus demo</div>' +
          '<div class="t-label" style="color:var(--text-3);font-weight:500">capture missing</div>' +
        '</div>' +
      '</div>' +

      '<div class="dv-ask" ' + at(800, 300, 'width:1000px') + '>' +
        '<div class="t-caps" style="color:var(--text-2)">I asked</div>' +
        '<div class="t-mono" style="margin-top:14px;font-size:44px;line-height:1.3;color:var(--orange-t)">“What do I need for<br>cold-weather golf?”</div>' +
      '</div>' +

      '<div class="dv-watch" ' + at(800, 560, 'width:1000px') + '>' +
        '<div class="t-caps" style="color:var(--text-2)">Watch for</div>' +
        '<div class="dv-w dv-w0" style="margin-top:22px;display:flex;gap:22px;align-items:baseline">' +
          '<span class="t-mono" style="font-size:36px;color:var(--text-3)">1</span>' +
          '<span class="t-body">It <b class="c-blue">searches</b> before it writes</span></div>' +
        '<div class="dv-w dv-w1" style="margin-top:22px;display:flex;gap:22px;align-items:baseline">' +
          '<span class="t-mono" style="font-size:36px;color:var(--text-3)">2</span>' +
          '<span class="t-body">Then <b class="c-blue">real products</b>, grouped by layer</span></div>' +
        '<div class="dv-w dv-w2" style="margin-top:22px;display:flex;gap:22px;align-items:baseline">' +
          '<span class="t-mono" style="font-size:36px;color:var(--text-3)">3</span>' +
          '<span class="t-body">No product title says any of this</span></div>' +
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
      tl.add(function () { if (ok && ctx.mode === 'show') { try { v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} } });
      tl.set(q('.dv-watch'), { autoAlpha: 1 });
      Kit.show(tl, qa('.dv-w'), { y: 16, stagger: .15, duration: .45 });
    },
    notes:
      'Here is the real thing, in my own account. ' +
      '[click] Same question. Watch the start: it searches before it writes anything. ' +
      'Then a short answer and real products, grouped by layer. Base layers, vests, gloves. ' +
      'No product title says “cold-weather golf”. That search step is the next slide.'
  };

  /* ======================================================================
     5 · RAG — retrieval-augmented generation (80 s, 5 clicks) · CORE
     State object + one pure render(), tweened with onUpdate — so back-nav
     and print mode are correct for free (KIT §4).
     The three numbered steps light in order: Retrieve → Add to prompt → Generate.
     ====================================================================== */
  var TILE = [
    { y: 470, caps: 'REVIEWS',  sub: 'how it feels in use',     col: C.teal,   tint: C.tealT },
    { y: 600, caps: 'LISTING',  sub: 'facts the seller typed',  col: C.sky,    tint: C.skyT },
    { y: 730, caps: 'LIVE API', sub: 'price, stock, delivery',  col: C.orange, tint: C.orangeT }
  ];
  var QA = [
    { q: '“Is this cordless drill easy to hold?”', a: ['Reviewers say the', 'grip is bulky for', 'small hands.'], f: ['2 of 2,318 reviews'] },
    { q: '“Is this jacket machine washable?”',     a: ['The listing says:', 'machine wash cold.'],               f: ['the listing:', 'Care instructions'] },
    { q: '“Will it get here by Friday?”',          a: ['It arrives Thursday.'],                                  f: ['the delivery service,', 'just now'] }
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
      // answer card
      h += '<div class="rabg" ' + at(1120, 450, 'width:680px;height:430px;border-radius:28px;background:var(--surface)') + '></div>' +
        '<div class="ra-caps t-caps" ' + at(1148, 490, 'color:var(--text-3)') + '>Answer</div>';
      QA.forEach(function (d, i) {
        h += '<div class="ra ra' + i + ' t-h2" ' + at(1148, 532, 'width:624px') + '>' + d.a.join('<br>') + '</div>';
      });
      h += '<div class="rfrom">' +
        '<div ' + at(1148, 714, 'width:624px;height:1px;background:' + C.line) + '></div>' +
        '<div class="t-caps" ' + at(1148, 740, 'color:var(--text-3)') + '>From</div>';
      QA.forEach(function (d, i) {
        h += '<div class="rf rf' + i + '" ' + at(1148, 786, 'width:624px;font-size:32px;font-weight:500;line-height:1.2') + '>' + d.f.join('<br>') + '</div>';
      });
      h += '</div>';
      // ticker
      h += '<div class="rtick" ' + at(120, 892, 'width:1680px;height:64px;border-radius:16px;background:#2A2627') + '>' +
        '<div class="t-label" style="position:absolute;left:24px;top:18px;font-weight:500;color:var(--text-3)">the store, this hour</div>' +
        '<div class="t-mono" style="position:absolute;left:360px;top:16px;font-size:32px;color:var(--text-2)">price <span class="tk tk0">$89</span></div>' +
        '<div class="t-mono" style="position:absolute;left:700px;top:16px;font-size:32px;color:var(--text-3)">·</div>' +
        '<div class="t-mono" style="position:absolute;left:820px;top:16px;font-size:32px;color:var(--text-2)">in stock <span class="tk tk1">12</span></div>' +
        '<div class="t-mono" style="position:absolute;left:1160px;top:16px;font-size:32px;color:var(--text-3)">·</div>' +
        '<div class="t-mono" style="position:absolute;left:1280px;top:16px;font-size:32px;color:var(--text-2)">reviews <span class="tk tk2">2,311</span></div>' +
      '</div>';
      // closing line
      h += '<div class="rcl t-h2" ' + at(120, 862, 'width:1680px;line-height:1.08') + '>Rufus runs these three steps on every question.<br>' +
        '<span style="color:var(--orange-t)">Picking the source is learned.</span></div>';
      // arrows + chips + barrier
      var svg = '' +
        '<path class="arrC" d="M420,378 C420,444 560,470 648,496" fill="none" stroke="' + C.text3 + '" stroke-width="4" marker-end="url(#rgC)"/>' +
        '<path class="arrA" d="M580,530 C620,530 620,635 660,635" fill="none" stroke="' + C.tealT + '" stroke-width="4" marker-end="url(#rgA)"/>' +
        '<path class="arrB" d="M1040,635 L1112,635" fill="none" stroke="' + C.blue + '" stroke-width="4" marker-end="url(#rgB)"/>' +
        '<g class="barrier">' +
          '<line x1="660" y1="818" x2="1040" y2="818" stroke="' + C.orangeT + '" stroke-width="3" stroke-dasharray="8 10"/>' +
          '<text x="850" y="864" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.orangeT + '">can’t see this</text>' +
        '</g>' +
        '<g class="chips">' +
          '<rect class="chip chip0" x="0" y="0" width="80" height="18" rx="9" fill="' + C.teal + '"/>' +
          '<rect class="chip chip1" x="0" y="0" width="80" height="18" rx="9" fill="' + C.teal + '"/>' +
          '<rect class="chip chip2" x="0" y="0" width="80" height="18" rx="9" fill="' + C.teal + '"/>' +
        '</g>';
      h += svgOverlay(svg, head('rgA', C.tealT) + head('rgB', C.blue) + head('rgC', C.text3));
      return h + Kit.src('Amazon Science, Oct 2024: Rufus pulls from reviews, the catalogue and community Q&amp;A, and calls Stores APIs. Source selection is the hard part. Values illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var tiles = qa('.rt'), chips = qa('.chip');
      var arrA = q('.arrA'), arrB = q('.arrB');
      var cols = [TILE[0].col, TILE[1].col, TILE[2].col];
      var tints = [TILE[0].tint, TILE[1].tint, TILE[2].tint];

      var st = { q: 0, lit: 0, litOn: 0, tiles: 0, tick: 0, bar: 0, fly: 0, chip: 0, pulse: 0,
                 ans: 0, from: 0, tickOut: 0, close: 0, s0: 0, s1: 0, s2: 0 };

      function pt(t) {                                 // chip flight: quadratic bezier tile → prompt slot
        var y0 = 530 + st.lit * 130, x0 = 566;
        var cx = 620, cy = 620, x1 = 0, y1 = 716;      // x1 filled per chip
        return function (i) {
          x1 = 714 + i * 96;
          var u = 1 - t;
          return { x: u * u * x0 + 2 * u * t * cx + t * t * x1, y: u * u * y0 + 2 * u * t * cy + t * t * y1 };
        };
      }

      function render() {
        var lit = st.lit, litCol = mix3(cols, lit), litTint = mix3(tints, lit);
        // the three named steps
        [st.s0, st.s1, st.s2].forEach(function (v, i) {
          var el = q('.rs' + i);
          el.style.color = mix(C.text3, C.orangeT, v);
          el.style.opacity = .5 + .5 * v;
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
        // chips
        var f = pt(st.fly);
        chips.forEach(function (c, i) {
          var p = f(i), s = 1 + .22 * st.pulse;
          c.setAttribute('x', p.x - 40 * (s - 1));
          c.setAttribute('y', p.y - 9 * (s - 1));
          c.setAttribute('width', 80 * s);
          c.setAttribute('height', 18 * s);
          c.setAttribute('fill', litCol);
          c.style.opacity = st.chip;
        });
        q('.rslot-t').style.opacity = 1 - st.chip;
        // ticker values
        var v = st.tick;
        q('.tk0').textContent = '$' + Math.round(89 - 10 * v);
        q('.tk1').textContent = String(Math.round(12 - 9 * v));
        q('.tk2').textContent = String(Math.round(2311 + 7 * v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // answer + from
        QA.forEach(function (d, i) {
          q('.ra' + i).style.opacity = wt(st.q, i) * st.ans;
          q('.rf' + i).style.opacity = wt(st.q, i) * st.from;
          q('.rf' + i).style.color = litTint;
          q('.rq' + i).style.opacity = wt(lit, i);
        });
        q('.rfrom').style.opacity = st.from;
        // ticker in / out, barrier, closing line
        var tk = q('.rtick');
        tk.style.opacity = st.tick * (1 - st.tickOut);
        tk.style.transform = 'translateY(' + (40 * (1 - st.tick)) + 'px)';
        q('.barrier').style.opacity = st.bar * (1 - st.tickOut);
        q('.rcl').style.opacity = st.close;
        q('.rcl').style.transform = 'translateY(' + (20 * (1 - st.close)) + 'px)';
      }
      var R = { onUpdate: render, onComplete: render };
      render();

      // ---- entrance (step 0)
      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.slideIn(tl, [q('.rqbg'), q('.rq0')], { at: .15, x: -160, duration: .8 });
      Kit.rise(tl, q('.rm'), { at: .5, y: 26, duration: .6 });
      Kit.rise(tl, [q('.rabg'), q('.ra-caps')], { at: .7, y: 24, duration: .6, stagger: .06 });
      tl.set(arrB, { autoAlpha: 0 });
      Kit.draw(tl, q('.arrC'), { at: .95, duration: .6 });
      ctx.pause();

      // ---- 1 · the store moves, and the frozen model cannot see it
      tl.to(st, Object.assign({ tick: 1, duration: .9, ease: 'power2.out' }, R));
      tl.to(st, Object.assign({ bar: 1, duration: .45 }, R), '-=.2');
      ctx.pause();

      // ---- 2 · step 1 Retrieve, then step 2 Add to prompt
      tl.to(st, Object.assign({ tiles: 1, duration: .55, ease: Kit.ease.out }, R));
      tl.to(st, Object.assign({ s0: 1, duration: .35 }, R), '<');
      tl.to(st, Object.assign({ litOn: 1, duration: .4 }, R));
      tl.to(st, Object.assign({ chip: 1, duration: .2 }, R));
      tl.to(st, Object.assign({ s1: 1, duration: .35 }, R), '<');
      tl.to(st, Object.assign({ fly: 1, duration: .85, ease: 'power2.inOut' }, R), '-=.1');
      ctx.pause();

      // ---- 3 · step 3 Generate, and the answer says where it came from
      tl.set(arrB, { autoAlpha: 1 });
      Kit.draw(tl, arrB, { duration: .45 });
      tl.to(st, Object.assign({ s2: 1, duration: .35 }, R), '<');
      tl.to(st, Object.assign({ ans: 1, duration: .5 }, R), '-=.1');
      tl.to(st, Object.assign({ from: 1, duration: .45 }, R), '+=.15');
      tl.to(st, Object.assign({ pulse: 1, duration: .3, yoyo: true, repeat: 1 }, R), '<');
      ctx.pause();

      // ---- 4 · different question, different source
      tl.to(st, Object.assign({ q: 1, lit: 1, duration: .6, ease: 'power2.inOut' }, R));
      ctx.pause();

      // ---- 5 · a third kind: live data, the thing it could not see
      tl.to(st, Object.assign({ q: 2, lit: 2, duration: .6, ease: 'power2.inOut' }, R));
      tl.to(st, Object.assign({ tickOut: 1, duration: .4 }, R), '-=.2');
      tl.to(st, Object.assign({ close: 1, duration: .5, ease: Kit.ease.out }, R), '-=.1');
    },
    notes:
      // LOAD-BEARING: the phrase "one word at a time" below is called back by Griffin's distillation slide. Do not cut it.
      'Is this cordless drill easy to hold? ' +
      'The model was trained months ago. Everything it knows froze then. ' +
      '[click] The store does not hold still. Prices, stock and reviews change by the hour. ' +
      'Answer from memory and you answer from an old snapshot, confidently. ' +
      '[click] So it does three things, in this order. Step one, retrieve. “Easy to hold” is about feel, so it fetches customer reviews. ' +
      'Step two, add to prompt: that evidence is pasted in next to your question. ' +
      '[click] Step three, generate. The frozen model writes the answer from the evidence in front of it, one word at a time, ' +
      'and it can say where the claim came from. That is retrieval-augmented generation. Frozen weights, fresh evidence. ' +
      '[click] Change the question. Is this jacket machine washable? That is a fact off the listing. ' +
      'Same three steps, different source. ' +
      '[click] Will it get here by Friday? Neither of those. That is a live call to the delivery service, answered as you ask. ' +
      'Rufus runs these three steps on every question, and Amazon says the hard part is choosing the source. The system has to learn that.'
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
        Kit.src('Amazon, SIGIR 2026 industry paper (abstract only; the full text is paywalled): the Rufus agent follows a ReAct-style framework pairing LLM reasoning with deterministic backend services. AWS, 2025, describes the same split. Function name, arguments and result are illustrative.');
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
      'How does the model call a tool? It does not run code. Read this top to bottom. ' +
      '[click] The shopper asks whether the parcel arrives by Friday. ' +
      '[click] The model cannot know. So instead of prose, it writes a request: a function name and two arguments. ' +
      '[click] Store software runs that function against the real delivery system and hands back one value. Thursday. ' +
      '[click] Now the model writes the sentence. That is the split: the model writes the request, ordinary software runs it. ' +
      'Amazon says Rufus works this way.'
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
      var pts = PRICES.map(function (p, i) { return px(i).toFixed(1) + ',' + py(p).toFixed(1); }).join(' ');
      var ty = py(TARGET).toFixed(1);

      var h = '';
      // axis labels
      h += '<div class="pz-y t-caps" ' + at(PX0, 384, 'color:var(--text-3)') + '>price</div>';
      h += '<div class="pz-x t-caps" ' + at(PX0, 828, 'width:' + (PX1 - PX0) + 'px;text-align:center;color:var(--text-3)') + '>six months</div>';
      h += '<div class="pz-t t-mono" ' + at(PX0 + 14, 596, 'font-size:32px;color:var(--orange-t)') + '>target $70</div>';
      // the record the model writes, once
      h += '<div class="pz-rec" ' + at(1340, 400, 'width:460px;height:300px;border-radius:28px;background:var(--surface)') + '>' +
        '<div class="t-caps" style="position:absolute;left:28px;top:26px;color:var(--text-3)">The record</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:90px;font-size:32px;color:var(--text)">item: golf gloves</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:150px;font-size:32px;color:var(--orange-t)">target: $70</div>' +
        '<div class="t-mono" style="position:absolute;left:28px;top:210px;font-size:32px;color:var(--text)">expires: 6 months</div>' +
      '</div>';
      h += '<div class="pz-code t-label" ' + at(1340, 732, 'width:440px;color:var(--text-2);font-weight:500') + '>Plain code checks the price. The model is not running.</div>';
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
        Kit.src('AWS, “How Rufus scales… with Amazon Bedrock”, 2025: the model writes a record in a price-alert service, conventional software watches the price, requests stay active for six months, and purchases complete within 30 minutes of the target. The price line is illustrative.', 'Self-reported');
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
      'Auto Buy. You tell it to buy these gloves when they drop to seventy dollars. ' +
      '[click] The model writes one record and stops. Item, target price, expires in six months. ' +
      '[click] From there, plain code checks the price. No model is running for those six months. ' +
      '[click] The price crosses the target, and the purchase completes within thirty minutes. ' +
      'The step that spends your money is code you can read and audit.'
  };

  /* ======================================================================
     8 · THUMBS — learning from ratings (32 s, 3 clicks)
     ====================================================================== */
  var THUMBS = {
    id: 'thumbs', title: 'Learning from ratings',
    heading: 'Learning from ratings', budgetSec: 32,
    html: function () {
      var boxes = [
        { caps: 'What shoppers do', t: '', s: 'few answers get rated' },
        { caps: 'A second model', t: 'Predicts the rating', s: 'it grades every answer' },
        { caps: 'The writer', t: 'Trained toward high scores', s: 'with a limit on how far it moves' }
      ];
      var h = '';
      boxes.forEach(function (b, i) {
        var x = [120, 730, 1340][i];
        h += '<div class="tb tb' + i + '" ' + at(x, 400, 'width:460px;height:340px;border-radius:28px;background:var(--surface)') + '>' +
          '<div class="t-caps" style="position:absolute;left:28px;top:28px;width:404px;color:var(--text-3)">' + b.caps + '</div>' +
          (b.t ? '<div class="t-h2" style="position:absolute;left:28px;top:86px;width:404px">' + b.t + '</div>' : '') +
          '<div class="t-label" style="position:absolute;left:28px;top:266px;width:404px;color:var(--text-2);font-weight:500">' + b.s + '</div>' +
        '</div>';
      });
      // the two buttons under every answer, drawn as SVG (same icon as the overview)
      h += '<div class="tg-up" ' + at(148, 490, 'width:130px;height:84px;border-radius:20px;background:' + C.bg + ';border:3px solid ' + C.tealT +
        ';display:flex;align-items:center;justify-content:center') + '>' + thumb('up', C.tealT, 48) + '</div>';
      h += '<div class="tg-dn" ' + at(298, 490, 'width:130px;height:84px;border-radius:20px;background:' + C.bg + ';border:3px solid ' + C.text3 +
        ';display:flex;align-items:center;justify-content:center') + '>' + thumb('down', C.text3, 48) + '</div>';
      h += '<div class="tr-lab t-label" ' + at(660, 872, 'width:600px;text-align:center;color:var(--text-3);font-weight:500') + '>new answers, new ratings</div>';
      var svg =
        '<path class="tf tf0" d="M580,570 L724,570" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#thA)"/>' +
        '<path class="tf tf1" d="M1190,570 L1334,570" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#thA)"/>' +
        // solid, not dashed: DrawSVG overwrites stroke-dasharray, so a dashed path cannot also be drawn
        '<path class="tret" d="M1570,740 L1570,820 Q1570,840 1550,840 L370,840 Q350,840 350,820 L350,746" fill="none" stroke="' + C.text3 +
          '" stroke-width="3" marker-end="url(#thB)"/>';
      return h + svgOverlay(svg, head('thA', C.blue) + head('thB', C.text3)) +
        Kit.src('Amazon says customers mark answers liked or disliked and that Rufus learns from that through reinforcement learning; the reward design, the algorithm and the update cadence are unpublished. The pipeline shown is the standard RLHF recipe.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set([q('.tb1'), q('.tb2'), q('.tr-lab')], { autoAlpha: 0 });
      gsap.set(qa('.tf'), { autoAlpha: 0 });
      gsap.set(q('.tret'), { autoAlpha: 0 });

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.tb0'), { at: .15, y: 36, duration: .6 });
      tl.from(qa('.tg-up, .tg-dn'), { scale: .7, autoAlpha: 0, transformOrigin: '50% 50%', duration: .4, ease: Kit.ease.back, stagger: .12 }, '-=.2');
      ctx.pause();

      // ---- 1 · ratings → grader
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
      'Last part. Every Rufus answer carries a thumbs-up and a thumbs-down. ' +
      '[click] Few shoppers press them, so you cannot train on them directly. Instead a second model learns to predict the rating, ' +
      'and grades every answer. ' +
      '[click] Then you train the writer toward answers the grader scores highly, with a limit so it does not drift into nonsense. ' +
      '[click] New answers, new ratings, round again. Compare Airbnb: there we wrote the grader by hand. Here it is learned from people.'
  };

  /* ======================================================================
     9 · TRAP — optimizing for approval (24 s, 2 clicks)
     ====================================================================== */
  var TRAP = {
    id: 'trap', title: 'Optimizing for approval',
    heading: 'Optimizing for approval', budgetSec: 24,
    html: function () {
      var cols = [
        { x: 580, pill: 'reward approval', word: 'flattery', tint: C.skyT },
        { x: 1340, pill: 'reward purchases', word: 'overselling', tint: C.orangeT }
      ];
      var h = '';
      cols.forEach(function (c, i) {
        h += '<div class="tp tp' + i + '">' +
          '<div class="tp-pill" style="position:absolute;left:' + (c.x - 240) + 'px;top:400px;width:480px;height:88px;border-radius:44px;background:var(--surface);' +
            'border:2px solid ' + C.line + ';display:flex;align-items:center;justify-content:center;font-size:36px;color:var(--text-2)">' + c.pill + '</div>' +
          '<div class="tp-card" style="position:absolute;left:' + (c.x - 270) + 'px;top:620px;width:540px;height:180px;border-radius:24px;background:var(--surface);' +
            'border:3px solid ' + c.tint + ';display:flex;align-items:center;justify-content:center">' +
            '<span class="t-h1" style="color:' + c.tint + '">' + c.word + '</span></div>' +
        '</div>';
      });
      h += '<div class="tp-cl t-h2" ' + at(120, 882, 'width:1680px') + '>For the retailer, <span style="color:var(--orange-t)">overselling looks like success</span>.</div>';
      var svg =
        '<path class="tpa tpa0" d="M580,504 L580,606" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#tpA)"/>' +
        '<path class="tpa tpa1" d="M1340,504 L1340,606" fill="none" stroke="' + C.blue + '" stroke-width="5" marker-end="url(#tpA)"/>';
      return h + svgOverlay(svg, head('tpA', C.blue)) +
        Kit.src('Reward-hacking failure modes are the report’s analysis, not an Amazon disclosure.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q;
      gsap.set([q('.tp1'), q('.tp-cl')], { autoAlpha: 0 });
      gsap.set([q('.tpa0'), q('.tpa1')], { autoAlpha: 0 });

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.tp0').querySelector('.tp-pill'), { at: .15, y: 24, duration: .5 });
      tl.set(q('.tpa0'), { autoAlpha: 1 });
      Kit.draw(tl, q('.tpa0'), { duration: .4 });
      Kit.rise(tl, q('.tp0').querySelector('.tp-card'), { y: 24, duration: .5, at: '-=.1' });
      ctx.pause();

      // ---- 1 · the same mechanism, a different input
      tl.set(q('.tp1'), { autoAlpha: 1 });
      Kit.show(tl, q('.tp1').querySelector('.tp-pill'), { y: 24, duration: .5 });
      tl.set(q('.tpa1'), { autoAlpha: 1 });
      Kit.draw(tl, q('.tpa1'), { duration: .4 });
      Kit.show(tl, q('.tp1').querySelector('.tp-card'), { y: 24, duration: .5, at: '-=.1' });
      ctx.pause();

      // ---- 2 · weight moves to the uncomfortable case
      tl.to(q('.tp1').querySelector('.tp-card'), { borderWidth: 5, duration: .3 });
      tl.to(q('.tp0'), { opacity: .5, duration: .35 }, '<');
      Kit.show(tl, q('.tp-cl'), { y: 18, duration: .5, at: '<' });
    },
    notes:
      'There is a trap in that loop. Reward approval, and the model learns flattery. It tells you what you want to hear. ' +
      '[click] Reward purchases, and it learns to oversell. ' +
      '[click] Notice which way that second one points. For the retailer, overselling looks like success. ' +
      'The reward and the business interest agree. That is the uncomfortable part.'
  };

  /* ======================================================================
     10 · RESULTS — Amazon's own numbers (46 s, 3 clicks)
     ====================================================================== */
  var RESULTS = {
    id: 'results', title: 'Results',
    heading: 'Results', budgetSec: 46,
    html: function () {
      function card(cls, x, numCls, caps, sub, extra) {
        return '<div class="' + cls + '" ' + at(x, 320, 'width:800px;height:300px;border-radius:28px;background:var(--surface)') + '>' +
          '<div class="' + numCls + ' t-num" style="position:absolute;left:40px;top:40px"></div>' +
          '<div class="t-caps" style="position:absolute;left:40px;top:200px;color:var(--text-3)">' + caps + '</div>' +
          '<div class="t-label" style="position:absolute;left:40px;top:244px;color:var(--text-2);font-weight:500;width:720px">' + sub + '</div>' +
          (extra || '') + '</div>';
      }
      var h =
        card('ra-a', 120, 'num-a', 'Customers', 'in the 12 months to Sept 2026',
          '<div class="t-mono" style="position:absolute;left:360px;top:196px;width:400px;text-align:right;font-size:32px;color:var(--blue-t)">interactions +570%</div>') +
        card('ra-b', 980, 'num-b', 'Incremental sales', 'annualized, Amazon’s own estimate (Q4 2025)');
      h += '<div class="ra-chip" ' + at(120, 680, 'width:1680px;height:110px;border-radius:24px;background:#2A2627;border:2px solid ' + C.line) + '>' +
        '<div class="ra-q t-h2" style="position:absolute;left:40px;top:28px;width:1600px;color:var(--text-2)">“Users are 60% more likely to complete a purchase.”</div></div>';
      h += '<div class="ra-badge t-caps" ' + at(140, 648, 'padding:8px 18px;border-radius:999px;background:var(--bg);border:2px solid var(--orange-t);color:var(--orange-t)') + '>Selection bias</div>';
      // two-group picture
      var dots = '';
      [[1230, C.orangeT], [1560, C.text3]].forEach(function (g, gi) {
        for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) {
          dots += '<circle class="dot dg' + gi + '" cx="' + (g[0] - 68 + c * 34) + '" cy="' + (706 + r * 34) + '" r="10" fill="' + g[1] + '"/>';
        }
      });
      h += '<div class="ra-pic">' +
        '<div class="t-label" ' + at(1080, 652, 'width:300px;text-align:center;color:var(--orange-t);font-weight:500') + '>already shopping</div>' +
        '<div class="t-label" ' + at(1410, 652, 'width:300px;text-align:center;color:var(--text-3);font-weight:500') + '>just browsing</div>' +
        '<div class="t-caps" ' + at(1080, 854, 'width:300px;text-align:center;color:var(--text-2)') + '>opened it</div>' +
        '<div class="t-caps" ' + at(1410, 854, 'width:300px;text-align:center;color:var(--text-3)') + '>didn’t</div>' +
      '</div>';
      h += '<div class="ra-verdict t-h2" ' + at(120, 806, 'width:980px;font-stretch:100%') + '>They were <span style="color:var(--orange-t)">already closer to buying</span>.</div>';
      h += '<div class="ra-fix t-label" ' + at(120, 884, 'width:940px;color:var(--text-2);font-weight:500') + '>A clean test hides the feature from a random slice of customers.</div>';
      return h + svgOverlay(dots) +
        Kit.src('Amazon Q3 2026 results and Q4 2025 earnings call, via the report’s timeline. All figures company-reported, unaudited, published without a method. The $12B figure is for Rufus (Q4 2025); no comparable figure was given for Alexa for Shopping in Oct 2026.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var nb = q('.num-b'); nb.style.color = C.orangeT;
      gsap.set([q('.ra-b'), q('.ra-chip'), q('.ra-badge'), q('.ra-verdict'), q('.ra-fix')], { autoAlpha: 0 });
      gsap.set(q('.ra-pic'), { autoAlpha: 0 });
      gsap.set(qa('.dot'), { autoAlpha: 0 });
      q('.num-a').textContent = '0';
      nb.textContent = '~$0B';

      Kit.rise(tl, q('.hd'), { y: 24 });
      Kit.rise(tl, q('.ra-a'), { at: .15, y: 32, duration: .6 });
      Kit.count(tl, q('.num-a'), { to: 400, suffix: 'M+', duration: .9, at: '-=.3' });
      Kit.fade(tl, q('.ra-a').querySelector('.t-mono'), { at: '-=.1' });
      ctx.pause();

      // ---- 1 · the second company number
      Kit.show(tl, q('.ra-b'), { y: 32, duration: .55 });
      Kit.count(tl, nb, { to: 12, prefix: '~$', suffix: 'B', duration: .9, at: '-=.25' });
      ctx.pause();

      // ---- 2 · the quote lands as a quote
      Kit.show(tl, q('.ra-chip'), { y: 28, duration: .55 });
      ctx.pause();

      // ---- 3 · demote the claim, show who opened it
      tl.to(q('.ra-chip'), { width: 900, opacity: .45, duration: .5, ease: 'power2.inOut' });
      // the quote keeps its words but gives up its size, so it still fits the smaller chip
      tl.to(q('.ra-q'), { fontSize: 36, width: 820, top: 14, duration: .5, ease: 'power2.inOut' }, '<');
      Kit.show(tl, q('.ra-badge'), { y: 14, duration: .35, ease: Kit.ease.back, at: '<' });
      tl.set(q('.ra-pic'), { autoAlpha: 1 });
      tl.to(qa('.dg0'), { autoAlpha: 1, duration: .25, stagger: .02 }, '-=.2');
      tl.to(qa('.dg1'), { autoAlpha: 1, duration: .25, stagger: .02 }, '-=.25');
      Kit.show(tl, [q('.ra-verdict'), q('.ra-fix')], { y: 18, duration: .5, stagger: .12, at: '-=.1' });
    },
    notes:
      'Does it work? Amazon says over four hundred million customers used it in twelve months, with interactions up five hundred and seventy percent. ' +
      '[click] And nearly twelve billion dollars in extra annualized sales. Every one is Amazon’s own number, unaudited, published without a method. ' +
      '[click] This one deserves a harder look. Users are sixty percent more likely to complete a purchase. ' +
      '[click] Who opens a shopping assistant? People already researching a purchase. ' +
      'So that gap mixes the assistant’s effect with who opened it. Statisticians call it selection bias. ' +
      'A clean test hides the feature from a random slice of customers. Amazon has not said whether it did that.'
  };

  /* ======================================================================
     11 · TAKEAWAYS — what travels beyond Rufus (36 s, 2 clicks)
     CANONICAL SECTION CLOSER — pixel-identical to airbnb/takeaways and
     griffin/takeaway apart from text, image and section colour.
     ====================================================================== */
  var TKROWS = [
    ['01', 'RAG', 'Facts change faster than<br>you can retrain. Fetch them.',
      'Frozen weights, fresh evidence.'],
    ['02', 'Tool calling', 'Let the model write the request.<br>Let plain code run it.',
      'Costly or irreversible steps stay in code.'],
    ['03', 'Learning from ratings', 'Reward approval and<br>you get flattery.',
      'A model chases the signal, not your intent.']
  ];

  var TAKEAWAYS = {
    id: 'takeaways', title: 'Takeaways',
    heading: 'Takeaways', budgetSec: 36,
    html: function () {
      var rows = TKROWS.map(function (r, i) {
        return '<div class="tk-row r' + i + '" style="top:' + (268 + i * 210) + 'px">' +
          '<div class="n t-mono">' + r[0] + '</div>' +
          '<div class="rule"></div>' +
          '<div class="tg t-caps">' + r[1] + '</div>' +
          '<div class="ln t-h2">' + r[2] + '</div>' +
          '<div class="sb t-label">' + r[3] + '</div>' +
        '</div>';
      }).join('');
      return '' +
        '<img class="tk-img" src="assets/img/rufus/opener.jpg" alt="" style="object-position:62% center">' +
        '<div class="tk-veil"></div>' +
        rows +
        stripHtml() +
        Kit.src('Section recap. Retrieval and tool calling: Amazon Science, Oct 2024; Amazon, SIGIR 2026. ' +
                'Reward hacking is the report’s analysis, not an Amazon disclosure.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var slab = q('.tk-assist .bg');

      // strip: PRICE already slabbed, ASSIST unfilled at entrance, the rest tertiary
      gsap.set(qa('.thru .tx'), { color: C.text3 });
      gsap.set(q('.tk-price .bg'), { backgroundColor: C.red, skewX: -12 });
      gsap.set(q('.tk-price .tx'), { color: '#FFFFFF' });
      gsap.set(slab, { backgroundColor: C.blue, skewX: -12, scaleX: 0, transformOrigin: 'left center' });
      // rows 2 and 3 are hidden by default, so they are revealed with Kit.show (never from())
      gsap.set([qa('.r1 > *'), qa('.r2 > *')], { autoAlpha: 0 });

      // ---- entrance: image, veil, header, row 01, strip ----
      tl.from([q('.tk-img'), q('.tk-veil')], { autoAlpha: 0, duration: .9, ease: 'power2.out' }, 0);
      Kit.rise(tl, qa('.hd > *'), { at: .15, stagger: .1 });
      Kit.rise(tl, qa('.r0 > *'), { at: .45, stagger: .07, duration: .6 });
      Kit.fade(tl, q('.thru'), { at: .7, duration: .5 });
      ctx.pause();

      // ---- click 1: the second lesson ----
      Kit.show(tl, qa('.r1 > *'), { stagger: .07, duration: .5 });
      ctx.pause();

      // ---- click 2: the third lesson, and the throughline moves on ----
      Kit.show(tl, qa('.r2 > *'), { stagger: .07, duration: .5 });
      tl.to(slab, { scaleX: 1, duration: .5, ease: Kit.ease.out }, '<+.1');
      tl.to(q('.tk-assist .tx'), { color: '#FFFFFF', duration: .4 }, '<+.2');
      tl.to(q('.tk-interact .tx'), { color: C.purpleT, duration: .5 }, '<+.1');
    },
    notes:
      'Three things that outlive Rufus. One: when the facts move faster than you can retrain, do not retrain. ' +
      'Fetch. Think of a help desk, or a policy that changed last week. Frozen weights, fresh evidence. ' +
      '[click] Two: let the model write the request, and let plain code run it. Anything costly or irreversible stays in code. ' +
      '[click] Three: reward approval and you get flattery. The model chases the signal you wrote down, not your intent. ' +
      'Our salesperson can price and it can assist. Next it interacts, on video, in real time.'
  };

  Deck.section({
    id: 'rufus', order: 2, num: '02', kicker: 'Assist', title: 'Amazon Rufus',
    slides: [OPENER, PROBLEM, OVERVIEW, DEMO, RAG, REACT, DISPOSE, THUMBS, TRAP, RESULTS, TAKEAWAYS]
  });
})();
