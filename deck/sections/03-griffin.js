/* ==========================================================================
   03 · Interact — Tavus Griffin   (budget 6:30 = 390 s)
   open 20 · demo 70 · cascade 50 · overview 40 · diffusion 55 · stream 30
   · distill 60 · results 35 · takeaway 30   = 390
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* Demo link (for now: a Griffin demo video on YouTube; swap for a live demo room later). */
  var GRIFFIN_DEMO_URL = 'https://www.youtube.com/watch?v=lHw6yoyPkpo';

  var IMG = 'assets/img/griffin/';
  var VID = 'assets/video/griffin/';

  /* local helpers ------------------------------------------------------- */
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      ' font-family="' + (o.mono ? 'JetBrains Mono' : 'Archivo') + '"' +
      ' font-size="' + (o.size || 28) + '" font-weight="' + (o.w || 600) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      (o.stretch ? ' style="font-stretch:' + o.stretch + '"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      ' fill="' + (o.fill || C.text) + '"' +
      (o.cls ? ' class="' + o.cls + '"' : '') + '>' + s + '</text>';
  }
  /* Mono numerals, proportional units. A mono font gives ' s' and '.' a full cell
     each, which reads as two tokens and as '2 . 4%'. These spans fix the spacing
     without touching the global type scale. */
  function num(v, unit) {
    return String(v).replace('.', '<span class="dp">.</span>') +
      (unit ? '<span class="u">' + unit + '</span>' : '');
  }
  /* Kit.count writes textContent, so it cannot carry the spans. Same tween, innerHTML. */
  function countHTML(tl, el, o) {
    var obj = { v: o.from || 0 }, d = o.decimals || 0;
    var put = function () { el.innerHTML = num(obj.v.toFixed(d), o.suffix); };
    put();
    return tl.to(obj, { v: o.to, duration: o.duration || 1.2, ease: o.ease || 'power2.out',
      onUpdate: put }, o.at);
  }
  function marker(id, color, size) {
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="' + (size || 4) +
      '" markerHeight="' + (size || 4) + '" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + color + '"/></marker>';
  }

  /* ======================================================================
     1 · OPEN — section opener (20 s, 1 click)
     ====================================================================== */
  var OPEN = {
    id: 'open',
    title: 'Tavus Griffin',
    budgetSec: 20,
    html: function () {
      var sw = [C.purple, C.magenta, C.sky];
      function ln(s) {
        return '<span class="ln" style="display:block;overflow:hidden;padding:0 24px 10px 6px;margin-left:-6px">' +
          '<span style="display:inline-block">' + s + '</span></span>';
      }
      return '' +
        '<div class="op-bg" style="position:absolute;inset:0;background:url(' + IMG + 'opener.jpg) right 10% / cover no-repeat"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 34%,rgba(30,27,28,.72) 50%,rgba(30,27,28,0) 66%)"></div>' +
        '<header class="hd"><div class="tag t-caps"><i></i><b>03 · Interact</b><span class="sep">/</span><span>Tavus Griffin</span></div></header>' +
        '<div class="op-sw" style="position:absolute;left:132px;top:262px;display:flex;gap:14px">' +
          sw.map(function (c) { return '<span style="display:block;width:58px;height:30px;border-radius:8px;background:' + c + ';transform:skewX(-12deg)"></span>'; }).join('') +
        '</div>' +
        '<h1 class="t-hero" style="position:absolute;left:120px;top:322px;font-stretch:112%">' +
          ln('Tavus') + ln('Griffin<span style="color:var(--purple)">.</span>') +
        '</h1>' +
        '<p class="op-sub t-h2" style="position:absolute;left:120px;top:752px;width:900px;font-weight:500;font-stretch:100%;color:var(--text-2)">' +
          'A face generated live from one photo.</p>';
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(q('.op-sub'), { autoAlpha: 0 });

      tl.from(q('.op-bg'), { autoAlpha: 0, scale: 1.10, duration: 2.2, ease: 'power2.out', transformOrigin: '72% 50%' }, 0);
      Kit.rise(tl, q('.hd .tag'), { at: .15 });
      Kit.slideIn(tl, qa('.op-sw span'), { at: .3, x: 520, stagger: .06, duration: .9 });
      tl.from(qa('.ln > span'), { yPercent: 115, duration: 1.0, ease: 'expo.out', stagger: .12 }, .5);
      ctx.pause();

      // ---- click 1: the claim lands after the room has looked at the image ----
      Kit.show(tl, q('.op-sub'), { y: 24, duration: .7 });

      if (ctx.mode === 'show') {
        gsap.to(q('.op-bg'), { scale: 1.03, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
      }
    },
    notes:
      'Our salesperson can price and it can answer. Part three is interaction: a face on a call. ' +
      'In October, Tavus announced a model called Griffin — so far only a cut-down preview is out.' +
      '[click] Griffin builds a face from one photo and draws it live during the call, room and shadows ' +
      'included.'
  };

  /* ======================================================================
     2 · DEMO — Tavus's launch video, played in-deck (70 s, 2 clicks; ~44 s of video)
     The clip plays from CLIP_IN to CLIP_OUT when Rey clicks the frame.
     ====================================================================== */
  var CHIPS = ['A thumbs-up on request', 'Someone walks into shot', 'Her breathing slows'];
  var CLIP_IN = 28, CLIP_OUT = 72;   // seconds: "…believe that you're AI?" → end of the breathing beat

  var DEMO = {
    id: 'demo',
    title: 'Demo',
    heading: 'Demo',
    budgetSec: 70,
    html: function () {
      return '' +
        '<div class="dm-frame" style="position:absolute;left:120px;top:300px;width:1100px;height:619px">' +
          '<video class="dm-vid" playsinline preload="auto" poster="' + VID + 'griffin-intro-poster.jpg" src="' + VID + 'griffin-intro.mp4"></video>' +
          '<div class="dm-ph">' +
            '<div class="t-h2">Griffin demo</div>' +
            '<div class="t-label dim" style="margin-top:16px">Open the video on YouTube →</div>' +
          '</div>' +
        '</div>' +

        '<div class="dm-card" style="position:absolute;left:1280px;top:420px;width:520px;height:370px;padding:28px">' +
          '<div class="t-caps faint">Watch for</div>' +
          '<div class="dm-chips">' +
            CHIPS.map(function (s) { return '<div class="ch"><i></i><span class="t-body">' + s + '</span></div>'; }).join('') +
          '</div>' +
        '</div>' +

        '<a class="dm-btn t-label" href="' + GRIFFIN_DEMO_URL + '" target="_blank" rel="noopener"' +
          ' style="left:1280px;top:830px;width:520px;height:60px">Watch on YouTube&nbsp;<span>↗</span></a>' +

        '<div class="dm-q t-h2 c-purple" style="position:absolute;left:1280px;top:420px;width:520px;height:370px">' +
          '<span>Every frame is drawn live, fast enough that you can interrupt it.</span></div>' +

        Kit.src('Clip: Tavus, “Introducing Griffin” launch video (YouTube), 0:28–1:12. Tavus’s own edited recording.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var vid = q('.dm-vid'), frame = q('.dm-frame'), ph = q('.dm-ph');

      gsap.set([q('.dm-card'), qa('.dm-chips .ch'), q('.dm-q')], { autoAlpha: 0 });

      // no clip on disk → the slide still looks finished (KIT §10)
      var onErr = function () { vid.style.display = 'none'; ph.classList.add('on'); };
      vid.addEventListener('error', onErr);

      // stop at the end of the excerpt
      var onTime = function () { if (vid.currentTime >= CLIP_OUT) vid.pause(); };
      vid.addEventListener('timeupdate', onTime);

      // Rey clicks the frame to play / pause (not a deck step). First play jumps to CLIP_IN.
      var onClick = function () {
        if (ph.classList.contains('on')) return;
        if (vid.paused) {
          if (vid.currentTime < CLIP_IN || vid.currentTime >= CLIP_OUT) vid.currentTime = CLIP_IN;
          var p = vid.play(); if (p && p.catch) p.catch(function () {});
        } else vid.pause();
      };
      frame.addEventListener('click', onClick);
      ctx.cleanup(function () {
        frame.removeEventListener('click', onClick);
        vid.removeEventListener('error', onErr);
        vid.removeEventListener('timeupdate', onTime);
        try { vid.pause(); } catch (e) {}
      });

      // ---- entrance: the stage, nothing to read yet ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, [frame, q('.dm-btn')], { at: .25, stagger: .1 });
      ctx.pause();

      // ---- click 1: the card arrives with the three moments to watch for ----
      Kit.show(tl, q('.dm-card'), { y: 20, duration: .5 });
      Kit.show(tl, qa('.dm-chips .ch'), { y: 18, stagger: .08, duration: .45, at: '-=.25' });
      ctx.pause();

      // ---- click 2: the card is replaced by the one question that survives ----
      Kit.swap(tl, q('.dm-card'), q('.dm-q'));
    },
    notes:
      'I would rather show you this. Tavus’s own launch video: their CEO on a video call with a coworker. ' +
      'One of the two faces is generated live.' +
      '[click] Three things to watch: a thumbs-up on request, someone walking into shot, and her breathing ' +
      'slowing when he asks.' +
      ' — [Click the video frame to play. It starts at 0:28 and stops by itself at 1:12, about 44 seconds. ' +
      'Click again to pause.] — ' +
      '[click] She was the generated one. Their own edit, so their best take. ' +
      'Now: how do you draw a frame that fast?'
  };

  /* ======================================================================
     3 · CASCADE — the CVI pipeline Griffin replaced (50 s, 4 clicks)
     ====================================================================== */
  /* Tavus's CVI pipeline, in order. Widths are illustrative proportions of the
     published 2.8–3.5 s total; per-stage times are not published. */
  var CS_S = 460;                       // px per second on the cascade time axis
  var CS_END = 1606;                    // right edge of the last stage box
  var BOX = [
    { k: 'Raven',   t: 'perception',       x: 180,  w: 230, f: '#3C4C96' },
    { k: 'Sparrow', t: 'turn-taking',      x: 410,  w: 230, f: '#4053A1' },
    { k: 'LLM',     t: 'writes the reply', x: 640,  w: 460, f: '#4D6BB1' },
    { k: 'TTS',     t: 'voices it',        x: 1100, w: 230, f: '#518CC8' },
    { k: 'Phoenix', t: 'draws the face',   x: 1330, w: 276, f: '#9A4198' }
  ];

  var CASCADE = {
    id: 'cascade',
    title: 'The old pipeline',
    heading: 'The old pipeline',
    budgetSec: 50,
    html: function () {
      function X(t) { return 180 + t * CS_S; }
      var ticks = '', i;
      for (i = 0; i <= 3; i++) {
        ticks += '<g class="tk"><line x1="' + X(i) + '" y1="360" x2="' + X(i) + '" y2="348" stroke="#6E6560" stroke-width="3"/>' +
          txt(X(i), 338, i + 's', { mono: true, size: 28, w: 500, anchor: 'middle', fill: i === 0 ? C.text : C.text3 }) + '</g>';
      }
      var boxes = BOX.map(function (b, k) {
        return '<g class="bx b' + k + '">' +
          '<rect class="br" x="' + b.x + '" y="150" width="' + (b.w - 4) + '" height="80" rx="12" fill="' + b.f + '"/>' +
          txt(b.x + (b.w - 4) / 2, 200, b.k, { size: 28, w: 700, anchor: 'middle', fill: C.text, cls: 'bl bn' }) +
          txt(b.x + (b.w - 4) / 2, 262, b.t, { size: 28, w: 700, ls: '0', stretch: '82%', anchor: 'middle', fill: C.text3, cls: 'bl bs' }) +
        '</g>';
      }).join('');

      return '' +
        '<svg class="cs" width="1680" height="530" viewBox="0 0 1680 530" style="position:absolute;left:120px;top:290px;overflow:visible">' +
          '<defs>' + marker('csOrange', C.orange) + '</defs>' +
          '<g class="cs-time">' +
            txt(0, 30, 'YOU', { size: 28, w: 700, ls: '3', fill: C.text3 }) +
            '<rect class="yb" x="0" y="48" width="180" height="60" rx="12" fill="#353032"/>' +
            txt(90, 86, 'you talk', { size: 28, w: 600, anchor: 'middle', fill: C.text2, cls: 'yb-t' }) +
            '<line class="stop" x1="180" y1="40" x2="180" y2="310" stroke="' + C.text3 + '" stroke-width="2" stroke-dasharray="6 8"/>' +
            txt(192, 30, 'you stop', { size: 28, w: 700, fill: C.text }) +
            txt(0, 134, 'AVATAR', { size: 28, w: 700, ls: '3', fill: C.text3 }) +
            txt((180 + CS_END) / 2, 134, 'Cascaded avatars like this: 2.8 – 3.5 s', { size: 36, w: 700, anchor: 'middle', fill: C.purpleT, cls: 'meas' }) +
            boxes +
            '<path class="mbr" d="M180,282 L180,292 L' + CS_END + ',292 L' + CS_END + ',282" fill="none" stroke="' + C.purpleT + '" stroke-width="3"/>' +
            '<line class="xax" x1="60" y1="360" x2="1620" y2="360" stroke="#6E6560" stroke-width="3"/>' +
            ticks +
            '<g class="pin">' +
              '<line x1="594" y1="360" x2="594" y2="426" stroke="' + C.orange + '" stroke-width="4"/>' +
              '<circle cx="594" cy="426" r="8" fill="' + C.orange + '"/>' +
              txt(614, 420, 'a person answers here', { size: 28, w: 700, fill: C.orangeT }) +
            '</g>' +
            '<path class="dbr" d="M594,452 L594,462 L' + CS_END + ',462 L' + CS_END + ',452" fill="none" stroke="' + C.text3 + '" stroke-width="2"/>' +
            txt((594 + CS_END) / 2, 502, 'dead air', { size: 28, w: 700, anchor: 'middle', fill: C.text2, cls: 'dbr-t' }) +
          '</g>' +
          /* click 4: one model takes over the first three stages. The band floats
             ABOVE the axis and points down at the three boxes with a bracket, so it
             never reads as a stage with a duration of its own. Sits outside .cs-time
             so it stays at full strength when the timeline dims. */
          '<g class="cs-ccm">' +
            '<rect class="ccm-br" x="180" y="44" width="' + (CS_END - 180) + '" height="80" rx="12" fill="' + C.orange +
              '" fill-opacity=".96" stroke="' + C.orangeT + '" stroke-width="3"/>' +
            txt((180 + CS_END) / 2, 96, 'One model and two streaming generators replace all five',
                { size: 36, w: 800, anchor: 'middle', fill: '#1E1B1C', cls: 'ccm-t' }) +
            '<path class="ccm-bk" d="M180,132 L180,142 L' + CS_END + ',142 L' + CS_END + ',132" fill="none" stroke="' + C.orange + '" stroke-width="3"/>' +
            '<line class="ccm-bk" x1="' + (180 + CS_END) / 2 + '" y1="142" x2="' + (180 + CS_END) / 2 +
              '" y2="146" stroke="' + C.orange + '" stroke-width="4" marker-end="url(#csOrange)"/>' +
          '</g>' +
        '</svg>' +

        '<div class="cs-chip c1" style="left:120px"><i></i><span class="t-body">Only ~40% of pauses mean “your turn”</span></div>' +
        '<div class="cs-chip c2" style="left:984px"><i></i><span class="t-body">It could not gesture or move its body</span></div>' +

        Kit.src('Stage names: Tavus CVI docs. 40% of pauses: Tavus Sparrow-2. ' +
                'Latencies: NVIDIA VideoFDB (Gemini-2.5 cascades, not Tavus).', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var boxes = qa('.bx');

      gsap.set([qa('.bx'), q('.meas'), q('.mbr'), q('.pin'), q('.dbr'), q('.dbr-t'), qa('.cs-chip'),
                q('.stop'), q('.cs-ccm')], { autoAlpha: 0 });

      // ---- entrance: set the clock at zero ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, q('.xax'), { at: .25, duration: .8 });
      Kit.fade(tl, qa('.tk'), { at: .5, stagger: .04 });
      Kit.fade(tl, [q('.yb'), q('.yb-t')], { at: .55 });
      // dashed guide: fade it in. drawSVG would animate to the dash pattern's
      // first dash and leave a 6 px stub (KIT §4 gotcha, tl.from edition).
      Kit.show(tl, q('.stop'), { y: 0, at: .7, duration: .5 });
      ctx.pause();

      // ---- click 1: each stage waits for the one before it ----
      boxes.forEach(function (g, k) {
        var r = g.querySelector('.br');
        tl.set(g, { autoAlpha: 1 });
        tl.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power2.out', svgOrigin: BOX[k].x + ' 190' });
        tl.fromTo(g.querySelectorAll('.bl'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 }, '-=.12');
      });
      tl.to([q('.meas')], { autoAlpha: 1, duration: .45 }, '+=.1');
      tl.fromTo(q('.mbr'), { autoAlpha: 1, drawSVG: '0%' }, { autoAlpha: 1, drawSVG: '100%', duration: .6 }, '<');
      ctx.pause();

      // ---- click 2: the gap, measured rather than stated ----
      tl.fromTo(q('.pin'), { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: .45, ease: Kit.ease.back });
      tl.fromTo(q('.dbr'), { autoAlpha: 1, drawSVG: '0%' }, { autoAlpha: 1, drawSVG: '100%', duration: .7, ease: 'power2.out' }, '-=.1');
      tl.to(q('.dbr-t'), { autoAlpha: 1, duration: .4 }, '-=.2');
      ctx.pause();

      // ---- click 3: two further problems, not part of the timeline ----
      tl.to(q('.cs-time'), { opacity: .6, duration: .45 });
      Kit.show(tl, qa('.cs-chip'), { y: 22, stagger: .12, at: '-=.2' });
      ctx.pause();

      // ---- click 4: one model takes over the first three stages ----
      // the band floats above the axis and brackets the three boxes, so it is a
      // callout about them, not a stage with a duration of its own
      tl.to(q('.cs-time'), { opacity: .55, duration: .4 });
      tl.to(qa('.cs-chip'), { opacity: .55, duration: .4 }, '<');
      // nothing stale: the two durations already measured leave the screen
      tl.to([q('.meas'), q('.mbr'), q('.dbr'), q('.dbr-t')], { autoAlpha: 0, duration: .3 }, '<');
      tl.to(q('.cs-ccm'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.ccm-br'), { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power2.out', svgOrigin: '180 84' }, '<');
      tl.fromTo(qa('.ccm-bk'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .45, stagger: .08 }, '-=.25');
      tl.fromTo(qa('.ccm-t'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .35 }, '-=.35');
    },
    notes:
      'Before Griffin, Tavus ran a pipeline of five specialists. You stop talking. ' +
      'Stage widths here are illustrative; the per-stage times are not published.' +
      '[click] Raven reads your face. Sparrow decides you have finished. A language model writes the reply, ' +
      'text-to-speech voices it, Phoenix draws the face. Each stage waits for the one before. Systems built ' +
      'this way measure about three seconds — that range is for cascades built on Gemini, not for Tavus’s ' +
      'own stack.' +
      '[click] A person answers in under a second. The rest is dead air, and you feel it.' +
      '[click] Two more problems. Only four pauses in ten mean “your turn”, so it talks over you. And the ' +
      'renderer worked from a face model, so it could not gesture.' +
      '[click] Griffin replaces all five: one model does the thinking, two streaming generators make the ' +
      'sound and the picture.'
  };

  /* ======================================================================
     4 · OVERVIEW — one CCM, two streaming generators (40 s, 2 clicks)
     ====================================================================== */
  var OVERVIEW = {
    id: 'overview',
    title: 'Griffin architecture',
    heading: 'Griffin architecture',
    budgetSec: 40,
    html: function () {
      return '' +
        '<svg class="ov" width="1680" height="660" viewBox="0 0 1680 660" style="position:absolute;left:120px;top:296px;overflow:visible">' +
          '<defs>' +
            marker('ovA', C.text2) + marker('ovO', C.orange, 4.5) + marker('ovP', C.purpleT) +
            '<clipPath id="ovClipPh"><rect x="1095" y="420" width="110" height="146" rx="10"/></clipPath>' +
            '<clipPath id="ovClipOut"><rect x="1380" y="130" width="280" height="230" rx="14"/></clipPath>' +
          '</defs>' +

          // --- loop-back arc (click 2): the output reaches you, and the camera and
          //     mic never stop feeding the CCM. Routed over the top so nothing is crossed.
          '<g class="ov-loop">' +
            '<path class="ov-arc" d="M1520,124 C1520,24 1340,10 1000,10 C520,10 112,22 110,316" fill="none" ' +
              'stroke="' + C.orange + '" stroke-width="6" stroke-dasharray="10 10" marker-end="url(#ovO)"/>' +
            txt(960, 56, 'you see it', { size: 28, w: 700, anchor: 'middle', fill: C.orangeT, cls: 'ov-arc-t' }) +
          '</g>' +

          // --- you (sits low-left, under the headline, so the frame is not bottom-heavy on the right) ---
          '<g class="ov-you">' +
            '<rect x="0" y="330" width="220" height="170" rx="18" fill="' + C.surface + '"/>' +
            txt(110, 392, 'you', { size: 36, w: 700, anchor: 'middle' }) +
            txt(110, 444, 'camera', { size: 28, w: 500, anchor: 'middle', fill: C.text3 }) +
            txt(110, 482, 'mic', { size: 28, w: 500, anchor: 'middle', fill: C.text3 }) +
          '</g>' +
          '<path class="ov-in a" d="M232,382 C330,382 320,222 414,222" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +
          '<path class="ov-in b" d="M232,450 C340,450 330,292 414,292" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +
          /* the label belongs to the two input arrows: they are the leg that never stops */
          txt(262, 548, 'it keeps watching you while it talks', { size: 28, w: 600, fill: C.orangeT, cls: 'ov-in-t' }) +

          // --- the CCM: perceives and decides ---
          '<g class="ov-dir">' +
            '<rect x="430" y="130" width="460" height="240" rx="20" fill="' + C.purple + '" fill-opacity=".22" stroke="' + C.purpleT + '" stroke-width="3"/>' +
            txt(660, 192, 'CCM', { size: 52, w: 800, anchor: 'middle', fill: C.purpleT }) +
            txt(660, 238, 'Continuous Conversational Model', { size: 28, w: 500, stretch: '88%', anchor: 'middle', fill: C.text2 }) +
            txt(660, 292, 'perceives and decides', { size: 28, w: 600, anchor: 'middle', fill: C.text }) +
            txt(660, 332, 're-decides several times a second', { size: 28, w: 500, stretch: '88%', anchor: 'middle', fill: C.text3 }) +
          '</g>' +

          // --- CCM → the two generators ---
          '<path class="ov-out a" d="M894,205 C936,205 936,190 967,190" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +
          '<path class="ov-out b" d="M894,300 C936,300 936,332 967,332" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +

          '<g class="ov-voice">' +
            '<rect x="975" y="130" width="350" height="120" rx="16" fill="' + C.surface + '"/>' +
            txt(1150, 186, 'Speech generator', { size: 36, w: 700, anchor: 'middle' }) +
            txt(1150, 226, 'Tavec audio codec', { size: 28, w: 500, anchor: 'middle', fill: C.text3 }) +
          '</g>' +
          '<g class="ov-pic">' +
            '<rect x="975" y="272" width="350" height="120" rx="16" fill="' + C.surface + '"/>' +
            txt(1150, 328, 'Video generator', { size: 36, w: 700, anchor: 'middle' }) +
            txt(1150, 368, 'streaming diffusion', { size: 28, w: 500, anchor: 'middle', fill: C.text3 }) +
          '</g>' +
          '<path class="ov-topic" d="M1333,330 C1353,330 1355,302 1372,288" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +

          // --- the one photo, feeding the video generator ---
          '<g class="ov-photo">' +
            '<image href="' + IMG + 'portrait.jpg" x="1095" y="420" width="110" height="146" ' +
              'preserveAspectRatio="xMidYMid slice" clip-path="url(#ovClipPh)"/>' +
            '<rect x="1095" y="420" width="110" height="146" rx="10" fill="none" stroke="' + C.line + '" stroke-width="2"/>' +
            txt(1150, 606, 'one photo', { size: 28, w: 600, anchor: 'middle', fill: C.text3 }) +
          '</g>' +
          '<path class="ov-pharr" d="M1150,416 L1150,400" fill="none" stroke="' + C.text2 + '" stroke-width="6" marker-end="url(#ovA)"/>' +

          // --- output frame: a different moment of the same identity, so "generated"
          //     is visible rather than claimed ---
          '<g class="ov-out-frame">' +
            '<image href="' + IMG + 'portrait-talk.jpg" x="1380" y="130" width="280" height="230" ' +
              'preserveAspectRatio="xMidYMid slice" clip-path="url(#ovClipOut)" opacity=".62"/>' +
            '<rect class="ov-scan" x="1380" y="130" width="280" height="26" fill="' + C.purpleT + '" opacity=".55" clip-path="url(#ovClipOut)"/>' +
            '<rect x="1380" y="130" width="280" height="230" rx="14" fill="none" stroke="' + C.purpleT + '" stroke-width="3"/>' +
            txt(1520, 404, 'every pixel', { size: 28, w: 700, anchor: 'middle', fill: C.purpleT }) +
            txt(1520, 438, 'generated', { size: 28, w: 700, anchor: 'middle', fill: C.purpleT }) +
          '</g>' +
        '</svg>' +

        Kit.src('Drawn from Tavus’s own architecture figure. Both portraits are generated and fictional.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      gsap.set([qa('.ov-out'), q('.ov-photo'), q('.ov-pharr'), q('.ov-voice'), q('.ov-pic'),
                q('.ov-topic'), q('.ov-out-frame'), q('.ov-loop'), q('.ov-in-t')], { autoAlpha: 0 });
      gsap.set(q('.ov-scan'), { autoAlpha: 0 });

      // ---- entrance: input flows in continuously, then a decision ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.from(q('.ov-you'), { autoAlpha: 0, y: 24, duration: .6, ease: Kit.ease.out }, .25);
      Kit.draw(tl, [q('.ov-in.a'), q('.ov-in.b')], { at: .5, duration: .5, stagger: .1 });
      tl.from(q('.ov-dir'), { autoAlpha: 0, scale: .94, duration: .7, ease: Kit.ease.out, svgOrigin: '660 250' }, .7);
      ctx.pause();

      // ---- click 1: trace the whole data path in narration order ----
      tl.to(qa('.ov-out'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(qa('.ov-out'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, stagger: .15 }, '<');
      tl.to([q('.ov-voice'), q('.ov-pic')], { autoAlpha: 1, duration: .45, stagger: .12 }, '-=.35');
      tl.to(q('.ov-photo'), { autoAlpha: 1, duration: .45 }, '-=.15');
      tl.to(q('.ov-pharr'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.ov-pharr'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .5 }, '<');
      tl.to(q('.ov-topic'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.ov-topic'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .35 }, '<');
      tl.to(q('.ov-out-frame'), { autoAlpha: 1, duration: .5 }, '-=.1');
      // one scan sweep: the frame is painted, not pasted
      tl.fromTo(q('.ov-scan'), { autoAlpha: 1, attr: { y: 130 } }, { attr: { y: 334 }, duration: .9, ease: 'power1.inOut' }, '-=.25');
      tl.to(q('.ov-scan'), { autoAlpha: 0, duration: .3 });
      ctx.pause();

      // ---- click 2: full duplex is a loop — the one thing a box diagram can't show ----
      tl.to(q('.ov-loop'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.ov-arc'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut' }, '<');
      // the input arrows light up: the loop closes through the camera and mic
      tl.to(qa('.ov-in'), { stroke: C.orange, duration: .5 }, '-=.35');
      tl.fromTo([q('.ov-arc-t'), q('.ov-in-t')], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .1 }, '-=.3');
    },
    notes:
      'Griffin stops queueing. One model, the Continuous Conversational Model, watches your camera and listens ' +
      'to your mic. It replaces Raven, Sparrow and the language model, and it re-decides several times a second ' +
      'instead of once per turn.' +
      '[click] It streams text and controls to two generators: a speech generator built on Tavus’s own audio ' +
      'codec, Tavec, and a video generator that paints frames with streaming diffusion, from one photo. ' +
      'The generated voice drives the mouth.' +
      '[click] You see the result, and the camera and mic never stop feeding the model. ' +
      'That loop is why you can interrupt it.'
  };

  /* ======================================================================
     5 · DIFFUSION — static to a frame, and back (55 s, 3 clicks)
     ====================================================================== */
  var DF_X = function (i) { return 170 + i * 268; };        // frame left
  var DF_CX = function (i) { return DF_X(i) + 120; };       // frame centre

  var DIFFUSION = {
    id: 'diffusion',
    title: 'Diffusion',
    heading: 'Diffusion',
    budgetSec: 55,
    html: function () {
      var slots = '', imgs = '', ticks = '', steer = '', i;
      for (i = 0; i < 6; i++) {
        slots += '<div class="df-slot" style="left:' + DF_X(i) + 'px"></div>';
        imgs += '<img class="df-f f' + i + '" src="' + IMG + 'noise-' + i + '.jpg" alt="" style="left:' + DF_X(i) + 'px">';
        /* the cleaner neighbour, stacked on top and faded in on the reverse pass */
        if (i > 0) imgs += '<img class="df-g g' + i + '" src="' + IMG + 'noise-' + (i - 1) + '.jpg" alt="" style="left:' + DF_X(i) + 'px">';
        ticks += txt(DF_CX(i), 654, i === 0 ? 'clean' : i === 5 ? 'static' : '+ noise',
          { mono: true, size: 28, w: 500, anchor: 'middle', fill: C.text3, cls: 'df-t' });
        /* one tick arrow under every frame: the steering enters at every step */
        steer += '<line class="df-tick" x1="' + DF_CX(i) + '" y1="790" x2="' + DF_CX(i) + '" y2="762" ' +
          'stroke="' + C.purpleT + '" stroke-width="4" marker-end="url(#dfA)"/>';
      }
      return '' +
        slots + imgs +
        '<svg class="df" width="1920" height="1080" viewBox="0 0 1920 1080" ' +
          'style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible">' +
          '<defs>' + marker('dfA', C.purpleT) + '</defs>' +
          ticks +
          '<line class="df-rail" x1="170" y1="682" x2="1750" y2="682" stroke="' + C.line + '" stroke-width="6" stroke-linecap="round"/>' +
          '<polygon class="df-head" points="0,-15 24,0 0,15" fill="' + C.text2 + '" transform="translate(0,682)"/>' +
          txt(960, 730, 'adding noise is easy', { size: 36, w: 700, anchor: 'middle', fill: C.text, cls: 'df-l1' }) +
          txt(960, 730, 'the model learns one job: take a little noise back out',
            { size: 36, w: 700, anchor: 'middle', fill: C.purpleT, cls: 'df-l2' }) +
          '<line class="df-bus" x1="290" y1="790" x2="1630" y2="790" stroke="' + C.purpleT + '" stroke-width="4"/>' +
          steer +
          '<line class="df-feed" x1="466" y1="840" x2="466" y2="792" stroke="' + C.purpleT + '" stroke-width="4"/>' +
          '<line class="df-feed" x1="1456" y1="840" x2="1456" y2="792" stroke="' + C.purpleT + '" stroke-width="4"/>' +
        '</svg>' +
        '<div class="df-chip t-body" style="left:226px;width:480px">the voice <span class="faint ar">→</span> the mouth</div>' +
        '<div class="df-chip t-body" style="left:1156px;width:600px">the CCM’s controls <span class="faint ar">→</span> the expression</div>' +

        Kit.src('Diffusion refines random noise into a sample step by step (Yin et al., <em>DMD2</em>, 2024). Portrait and noise strip are our own illustration.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var imgs = qa('.df-f'), ghosts = qa('.df-g'), labs = qa('.df-t');
      var head = q('.df-head'), rail = q('.df-rail');
      var st = { pos: 0, rev: 0 };

      function render() {
        var rev = st.rev >= .5;
        for (var i = 0; i < 6; i++) {
          // forward: each slot appears as the head reaches it. reverse: every slot
          // stays at full strength and cross-fades to its cleaner neighbour, so the
          // strip gets cleaner rather than dimmer.
          imgs[i].style.opacity = (rev || i === 0) ? 1 : Math.max(0, Math.min(1, st.pos - i + 1));
          if (i > 0) ghosts[i - 1].style.opacity = rev ? Math.max(0, Math.min(1, i - st.pos)) : 0;
          var lab = i === 0 ? 'clean' : rev ? '− noise' : (i === 5 ? 'static' : '+ noise');
          if (labs[i].textContent !== lab) labs[i].textContent = lab;
        }
        gsap.set(head, { x: DF_CX(st.pos), scaleX: rev ? -1 : 1 });
      }
      var R = { onUpdate: render };
      render();

      gsap.set([head, q('.df-l2'), q('.df-bus'), qa('.df-tick'), qa('.df-feed'), qa('.df-chip')], { autoAlpha: 0 });
      gsap.set(q('.df-l1'), { autoAlpha: 0 });

      // ---- entrance: one real thing, and five empty slots ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      tl.from(imgs[0], { autoAlpha: 0, y: 20, duration: .6, ease: Kit.ease.out }, .3);
      Kit.fade(tl, qa('.df-slot'), { at: .45, stagger: .05 });
      ctx.pause();

      // ---- click 1: the forward process, left to right ----
      tl.to(head, { autoAlpha: 1, duration: .25 });
      tl.fromTo(rail, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'none' }, '<');
      tl.to(st, Object.assign({ pos: 5, duration: 1.3, ease: 'none' }, R), '<');
      tl.to(qa('.df-slot'), { autoAlpha: 0, duration: .4 }, '-=.5');
      tl.to(q('.df-l1'), { autoAlpha: 1, duration: .4 }, '-=.4');
      ctx.pause();

      // ---- click 2: the same strip, reversed — generation IS training run backwards ----
      tl.to(st, Object.assign({ rev: 1, duration: .01 }, R));
      Kit.swap(tl, q('.df-l1'), q('.df-l2'));
      tl.to(st, Object.assign({ pos: 0, duration: 1.6, ease: 'power1.inOut' }, R), '<');
      ctx.pause();

      // ---- click 3: the steering enters at every step ----
      Kit.show(tl, qa('.df-chip'), { y: 20, stagger: .12 });
      tl.to([q('.df-bus'), qa('.df-tick'), qa('.df-feed')], { autoAlpha: 1, duration: .01 }, '-=.3');
      tl.fromTo(qa('.df-feed'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .3, stagger: .08 }, '<');
      tl.fromTo(q('.df-bus'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: .6, ease: 'power2.out' }, '-=.1');
      tl.fromTo(qa('.df-tick'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .3, stagger: .05 }, '-=.35');
      tl.to(rail, { stroke: C.purple, duration: .5 }, '-=.3');
    },
    notes:
      'The video generator is a diffusion model, the same method behind almost every AI image you have seen. ' +
      'Here is one frame.' +
      '[click] Add a little random noise. Then a little more. Then more, until it is pure static. That direction ' +
      'is easy — anybody can wreck a picture, and we know exactly how much noise we added.' +
      '[click] So we train a network on the one job that is hard: look at a noisy frame, and take a little of ' +
      'that noise back out. Do that over and over, and you walk backwards from static to a face. That is diffusion.' +
      '[click] And at every step you can steer it. The voice it is speaking shapes the mouth. The CCM’s ' +
      'controls shape the expression.'
  };

  /* ======================================================================
     6 · STREAM — why diffusion cannot stream (30 s, 2 clicks)
     ====================================================================== */
  var STREAM = {
    id: 'stream',
    title: 'The streaming problem',
    heading: 'The streaming problem',
    budgetSec: 30,
    html: function () {
      // right card: seven frames, local coords inside an 800×520 card.
      // the arcs point INTO 'now': the model reads its neighbours to draw it.
      var fr = '', arcs = '', qs = '', clips = '', k, x;
      for (k = 0; k < 7; k++) {
        x = 113 + k * 84;
        fr += '<g class="sf f' + k + '">' +
          '<rect x="' + x + '" y="160" width="70" height="94" rx="8" fill="' + C.bg + '"/>';
        if (k <= 3) {
          clips += '<clipPath id="stF' + k + '"><rect x="' + x + '" y="160" width="70" height="94" rx="8"/></clipPath>';
          fr += '<image href="' + IMG + 'portrait.jpg" x="' + x + '" y="160" width="70" height="94" ' +
            'preserveAspectRatio="xMidYMid slice" clip-path="url(#stF' + k + ')" opacity="' + (k === 3 ? '.42' : '.92') + '"/>';
        }
        fr += '<rect x="' + x + '" y="160" width="70" height="94" rx="8" fill="none" stroke="' +
          (k === 3 ? C.orange : '#6E6560') + '" stroke-width="' + (k === 3 ? 3 : 2) + '"/></g>';
        if (k > 3) qs += txt(x + 35, 222, '?', { size: 36, w: 800, anchor: 'middle', fill: C.text3, cls: 'sq q' + k });
      }
      [2, 1, 0].forEach(function (t) {
        var a = 386, b = 113 + t * 84 + 35;
        arcs += '<path class="sa past" d="M' + b + ',258 Q' + ((a + b) / 2) + ',' + (258 + (a - b) * .22) + ' ' + a + ',258" fill="none" stroke="' + C.text2 + '" stroke-width="3" marker-end="url(#stA)"/>';
      });
      [4, 5, 6].forEach(function (t) {
        var a = 414, b = 113 + t * 84 + 35;
        arcs += '<path class="sa fut" d="M' + b + ',258 Q' + ((a + b) / 2) + ',' + (258 + (b - a) * .22) + ' ' + a + ',258" fill="none" stroke="' + C.text2 + '" stroke-width="3" stroke-dasharray="8 8" marker-end="url(#stB)"/>';
      });
      // one grey cross over the fan of arcs that cannot exist yet
      arcs += '<g class="sx" stroke="' + C.text3 + '" stroke-width="5" stroke-linecap="round">' +
        '<line x1="508" y1="268" x2="536" y2="296"/><line x1="536" y1="268" x2="508" y2="296"/></g>';

      return '' +
        // ---- left card: too many passes ----
        '<div class="st-card a" style="left:120px">' +
          '<h3 class="t-h2">Many passes per frame</h3>' +
          '<svg width="800" height="400" viewBox="0 0 800 400" style="position:absolute;left:0;top:100px;overflow:visible">' +
            '<defs>' + marker('stP', C.purpleT, 4) +
              '<clipPath id="stIc"><rect x="225" y="50" width="150" height="200" rx="12"/></clipPath>' +
            '</defs>' +
            '<g class="st-icg">' +
              '<rect x="225" y="50" width="150" height="200" rx="12" fill="' + C.bg + '"/>' +
              '<image href="' + IMG + 'noise-3.jpg" x="225" y="50" width="150" height="200" ' +
                'preserveAspectRatio="xMidYMid slice" clip-path="url(#stIc)"/>' +
              '<image class="st-ic2" href="' + IMG + 'noise-1.jpg" x="225" y="50" width="150" height="200" ' +
                'preserveAspectRatio="xMidYMid slice" clip-path="url(#stIc)" opacity="0"/>' +
              '<rect class="st-ic" x="225" y="50" width="150" height="200" rx="12" fill="none" stroke="#6E6560" stroke-width="2"/>' +
            '</g>' +
            '<path class="st-loop" d="M208,242 A130,130 0 1 1 392,242" fill="none" stroke="' + C.purpleT + '" stroke-width="6" marker-end="url(#stP)"/>' +
          '</svg>' +
          '<div class="st-count t-num">×1</div>' +
          '<div class="st-sub t-label">video needs many frames a second</div>' +
        '</div>' +

        // ---- right card: it peeks at the future ----
        '<div class="st-card b" style="left:1000px">' +
          '<h3 class="t-h2">It needs future frames</h3>' +
          '<svg width="800" height="400" viewBox="0 0 800 400" style="position:absolute;left:0;top:60px;overflow:visible">' +
            '<defs>' + marker('stA', C.text2, 3.5) + marker('stB', C.text2, 3.5) + clips + '</defs>' +
            txt(400, 140, 'now', { size: 28, w: 700, anchor: 'middle', fill: C.orangeT }) +
            fr + qs + arcs +
          '</svg>' +
          '<div class="st-sub t-label">on a live call those frames do not exist yet</div>' +
        '</div>' +

        '<div class="st-concl t-h2">Griffin needs few steps and past frames only.</div>' +

        Kit.src('Many denoising passes and bidirectional attention over the whole clip (Yin et al., <em>CausVid</em>). ×50 is CausVid’s teacher, not Griffin’s.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      gsap.set([q('.st-loop'), q('.st-count'), qa('.st-sub'), qa('.sa'), qa('.sq'), q('.sx'), q('.st-concl')], { autoAlpha: 0 });

      // ---- entrance: exactly two obstacles, stated as a pair ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, [q('.st-card.a h3'), q('.st-card.b h3')], { at: .25, stagger: .1 });
      Kit.fade(tl, q('.st-icg'), { at: .5 });
      Kit.fade(tl, qa('.sf'), { at: .5, stagger: .05 });
      ctx.pause();

      // ---- click 1: both halves show a failure ----
      tl.to(q('.st-loop'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.st-loop'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power1.inOut' }, '<');
      tl.to(q('.st-count'), { autoAlpha: 1, duration: .2 }, '<');
      Kit.count(tl, q('.st-count'), { from: 1, to: 50, prefix: '×', duration: 1.1, at: '<' });
      // the arrows must reach forward before the future can be taken away from them
      tl.to(qa('.sa'), { autoAlpha: 1, duration: .01 }, '<');
      tl.fromTo(qa('.sa'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, stagger: .08 }, '<');
      // the frame resolves one notch cleaner as the loop completes: the passes do something
      tl.to(q('.st-ic2'), { attr: { opacity: 1 }, duration: 1.1, ease: 'none' }, '<');
      tl.to(qa('.f4, .f5, .f6'), { opacity: .22, duration: .4 }, '+=.15');
      tl.to(qa('.sq'), { autoAlpha: 1, duration: .4, stagger: .07 }, '<');
      tl.to(qa('.sa.fut'), { opacity: .45, duration: .4 }, '<');
      tl.to(q('.sx'), { autoAlpha: 1, duration: .4 }, '<+.2');
      tl.to(qa('.st-sub'), { autoAlpha: 1, duration: .4 }, '-=.2');
      ctx.pause();

      // ---- click 2: two problems become one requirement ----
      tl.to(qa('.st-card'), { opacity: .62, duration: .45 });
      tl.fromTo(q('.st-concl'), { autoAlpha: 0, y: 54 }, { autoAlpha: 1, y: 0, duration: .6, ease: Kit.ease.out }, '-=.25');
    },
    notes:
      'Two things stop that from running on a live call.' +
      '[click] First, every frame costs many network passes. One published model used fifty, and ' +
      'video needs many frames a second. Second, a normal video model reads the whole clip at once, including ' +
      'the frames after the one it is drawing. On a live call those frames do not exist yet.' +
      '[click] So Griffin needs a model that takes few steps and only looks backwards. ' +
      'Fifty is a published model’s number; Griffin’s is not public.'
  };

  /* ======================================================================
     7 · DISTILL — teacher to student (60 s, 4 clicks)
     ====================================================================== */
  var DISTILL = {
    id: 'distill',
    title: 'Distillation',
    heading: 'Distillation',
    budgetSec: 60,
    html: function () {
      var frames = '', k;
      for (k = 0; k < 12; k++) {
        frames += '<div class="ds-fr k' + k + '" style="left:' + (180 + k * 110) + 'px">' +
          '<div class="fill"></div><div class="err"></div></div>';
      }

      return '' +
        '<div class="ds-card a">' +
          '<div class="k t-caps faint">Teacher</div>' +
          '<div class="s t-body">many steps</div>' +
          '<div class="n t-num" style="color:var(--text-2)">×50</div>' +
        '</div>' +
        '<div class="ds-card b">' +
          '<div class="k t-caps c-purple">Student</div>' +
          '<div class="s t-body">few steps</div>' +
          '<div class="n t-num c-purple">×50</div>' +
        '</div>' +
        '<div class="ds-bar ghost"></div>' +
        '<div class="ds-bar"></div>' +
        '<div class="ds-tcap t-label">whole clip at once</div>' +
        '<div class="ds-cap t-label c-purple">one frame at a time</div>' +
        frames +
        '<div class="ds-key">' +
          '<div class="t-label" style="color:var(--orange-t)">answer key</div>' +
          '<div class="t-label faint" style="margin-top:8px">real frames to copy from</div>' +
        '</div>' +
        '<div class="ds-lab l1 t-label">its own mistakes pile up</div>' +
        '<div class="ds-lab l2 t-label">Self-Forcing: it trains on its own frames</div>' +

        '<svg class="ds-ov" width="1920" height="1080" viewBox="0 0 1920 1080" ' +
          'style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible">' +
          '<defs>' + marker('dsA', C.text2, 4) + marker('dsO', C.orange, 4) + '</defs>' +
          txt(960, 436, 'copy what it produces, not how', { size: 28, w: 700, anchor: 'middle', fill: C.text2, cls: 'ds-at' }) +
          '<line class="ds-arr" x1="762" y1="480" x2="1158" y2="480" stroke="' + C.text2 + '" stroke-width="8" marker-end="url(#dsA)"/>' +
          /* short tick from the label down onto the first frame that drifts */
          '<line class="ds-tick" x1="890" y1="742" x2="890" y2="754" stroke="' + C.text2 + '" stroke-width="3"/>' +
          '<path class="ds-fb" d="M1490,888 C1490,948 180,948 180,888" fill="none" stroke="' + C.orange + '" stroke-width="5" marker-end="url(#dsO)"/>' +
        '</svg>' +

        Kit.src('Three-stage distillation named by Tavus: DMD2, teacher forcing, Self-Forcing (Yin et al. 2024; Huang et al. 2025). 50→4 is CausVid’s.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var errs = qa('.ds-fr .err'), fills = qa('.ds-fr .fill');
      var st = { err: 0, drain: 0 };

      function render() {
        for (var k = 0; k < 12; k++) {
          var base = k < 6 ? 0 : (k - 5) / 6;               // accumulates left → right
          var drained = Math.max(0, Math.min(1, st.drain * 13 - (11 - k)));
          var a = base * st.err * (1 - drained);
          // drift is shown by the picture itself: the face slips, blurs and loses
          // colour. the red tint only reinforces it.
          errs[k].style.opacity = a * .4;
          fills[k].style.filter = 'saturate(' + (1 - .9 * a).toFixed(3) +
            ') brightness(' + (1 - .16 * a).toFixed(3) + ') blur(' + (a * 2.2).toFixed(2) + 'px)';
          fills[k].style.transform = 'translate(' + (a * 13 * (k % 2 ? 1 : -1)).toFixed(2) + 'px,' +
            (a * 8).toFixed(2) + 'px) scale(' + (1 + .14 * a).toFixed(3) + ')';
        }
      }
      var R = { onUpdate: render };
      render();

      gsap.set(q('.ds-bar.ghost'), { autoAlpha: 0 });
      gsap.set([q('.ds-arr'), q('.ds-at'), q('.ds-key'), q('.ds-lab.l1'), q('.ds-tick'),
                q('.ds-lab.l2'), q('.ds-fb'), q('.ds-cap'), qa('.ds-fr')], { autoAlpha: 0 });
      gsap.set(qa('.ds-card.b > *'), { autoAlpha: 0 });

      // ---- entrance: the empty outline poses the question ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.ds-card.a'), { at: .25 });
      tl.from(qa('.ds-card.a > *, .ds-bar:not(.ghost), .ds-tcap'), { autoAlpha: 0, y: 18, duration: .5, stagger: .08 }, .45);
      Kit.rise(tl, q('.ds-card.b'), { at: .6 });
      ctx.pause();

      // ---- click 1: fewer steps, measured in the same place the 50 sits ----
      tl.to(q('.ds-arr'), { autoAlpha: 1, duration: .01 });
      tl.fromTo(q('.ds-arr'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .6, ease: 'power2.out' }, '<');
      tl.to(q('.ds-at'), { autoAlpha: 1, duration: .4 }, '-=.3');
      tl.to(q('.ds-card.b'), { borderColor: C.purpleT, borderStyle: 'solid', backgroundColor: C.surface, duration: .5 }, '-=.2');
      tl.to(qa('.ds-card.b .k, .ds-card.b .s, .ds-card.b .n'), { autoAlpha: 1, duration: .35, stagger: .08 }, '-=.3');
      Kit.count(tl, q('.ds-card.b .n'), { from: 50, to: 4, prefix: '×', duration: 1.0, ease: 'power2.inOut' });
      ctx.pause();

      // ---- click 2: whole clip becomes a stream of frames, one at a time ----
      tl.to(q('.ds-bar:not(.ghost)'), { x: 1060, duration: .8, ease: 'power2.inOut' });
      tl.to(q('.ds-bar.ghost'), { autoAlpha: .32, duration: .5 }, '<+.2');
      tl.to(q('.ds-bar:not(.ghost)'), { autoAlpha: 0, duration: .3 });
      tl.addLabel('roll', '-=.15');
      tl.to(qa('.ds-fr'), { autoAlpha: 1, duration: .25, stagger: .07 }, 'roll');
      tl.to(q('.ds-cap'), { autoAlpha: 1, duration: .35 }, 'roll+=.2');
      ctx.pause();

      // ---- click 3: in training the real frames sit beside it ----
      Kit.show(tl, q('.ds-key'), { y: 0, duration: .45 });
      ctx.pause();

      // ---- click 4: take the key away and watch the error accumulate ----
      tl.to(q('.ds-key'), { x: 420, autoAlpha: 0, duration: .8, ease: 'power2.in' });
      tl.to(st, Object.assign({ err: 1, duration: 1.1, ease: 'power1.inOut' }, R), '-=.55');
      Kit.show(tl, q('.ds-lab.l1'), { y: 14, duration: .4, at: '-=.3' });
      tl.to(q('.ds-tick'), { autoAlpha: 1, duration: .3 }, '-=.2');
      ctx.pause();

      // ---- click 5: its own output becomes its training input ----
      tl.to(st, Object.assign({ drain: 1, duration: 1.0, ease: 'none' }, R));
      tl.to(q('.ds-fb'), { autoAlpha: 1, duration: .01 }, '<');
      tl.fromTo(q('.ds-fb'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .9, ease: 'power2.inOut' }, '<');
      tl.to(q('.ds-tick'), { autoAlpha: 0, duration: .3 }, '-=.6');
      Kit.swap(tl, q('.ds-lab.l1'), q('.ds-lab.l2'), { at: '-=.5' });
    },
    notes:
      'So how do you get a big, slow, future-peeking model to run live? You teach a student.' +
      '[click] The student lands in a handful of steps where the teacher lands in fifty — copying the teacher’s ' +
      'results, not its route.' +
      '[click] Then you cut up the clip: instead of the whole video at once, it makes one frame at a time, each ' +
      'built from the one before — the same shape as the shopping assistant writing one word at a time.' +
      '[click] In training it always had the real frames beside it, like an answer key.' +
      '[click] On a live call the key is gone, so it builds on its own slightly-wrong frames. Errors pile up ' +
      'and the face drifts.' +
      '[click] The fix, Self-Forcing, is to practice without the key: generate your own frames, then get graded ' +
      'on the result. It learns to recover from its own mistakes.'
  };

  /* ======================================================================
     8 · RESULTS — the live user study (35 s, 3 clicks)
     ====================================================================== */
  function shuffled(n, seed) {
    var a = [], i, j, t, s = seed;
    for (i = 0; i < n; i++) a.push(i);
    for (i = n - 1; i > 0; i--) { s = (s * 1103515245 + 12345) & 0x7fffffff; j = s % (i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var LIT_A = shuffled(54, 7).slice(0, 26);

  var RESULTS = {
    id: 'results',
    title: 'User study',
    heading: 'User study',
    budgetSec: 35,
    html: function () {
      function grid(n, ox, cls, lit, litFill, litRing) {
        var s = '', i, cx, cy;
        for (i = 0; i < n; i++) {
          cx = ox + 19 + (i % 9) * 58;
          cy = 411 + Math.floor(i / 9) * 58;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="19" fill="' + C.line + '" fill-opacity=".5"/>';
          if (lit.indexOf(i) >= 0) {
            s += '<circle class="' + cls + ' d' + i + '" cx="' + cx + '" cy="' + cy + '" r="19" fill="' + litFill + '"' +
              (litRing ? ' stroke="' + litRing + '" stroke-width="2"' : '') + '/>';
          }
        }
        return s;
      }
      return '' +
        '<svg class="rs" width="1920" height="1080" viewBox="0 0 1920 1080" ' +
          'style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible">' +
          grid(54, 160, 'la', LIT_A, C.purple, C.purpleT) +
          grid(41, 760, 'lb', [22], C.text2, null) +
        '</svg>' +

        '<div class="rs-lab t-caps" style="left:160px">Griffin-Lite · 54 people</div>' +
        '<div class="rs-sublab t-label" style="left:160px">a research preview, not the full model</div>' +
        '<div class="rs-num t-num c-purple" style="left:160px">' + num(0, '%') + '</div>' +
        '<div class="rs-cap rs-capa t-label" style="left:160px">thought their partner was human</div>' +

        '<div class="rs-lab t-caps" style="left:760px">Old system · 41 people</div>' +
        '<div class="rs-num rs-numb t-num dim" style="left:760px">' + num(0, '%') + '</div>' +
        '<div class="rs-cap rs-capb t-label" style="left:760px">thought the same</div>' +

        /* the caveats Rey speaks, on screen; then the one number he argues, then
           the render latency demoted under it so nobody reads 0.43 s as the reply */
        '<div class="rs-chip">' +
          '<div class="t-label">Tavus’s own study</div>' +
          '<div class="t-label">One-minute calls</div>' +
          '<div class="t-label">No human comparison</div>' +
        '</div>' +
        '<div class="rs-card k2">' +
          '<div class="v t-num">' + num('1.9', 's') + '</div>' +
          '<div class="c t-label">Griffin’s reply. A person answers in 0.9 s</div>' +
        '</div>' +
        '<div class="rs-sub">' +
          '<div class="v t-h2">' + num('0.43', 's') + '</div>' +
          '<div class="c t-label">drawing the picture only,<br>not the thinking</div>' +
        '</div>' +

        Kit.src('Live study: 26 of 54 vs 1 of 41. Latency 0.43 s: Tavus. Replies 1.89 s vs 0.90 s: NVIDIA VideoFDB.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      gsap.set([qa('.la'), qa('.lb'), q('.rs-chip'), q('.rs-card'), q('.rs-sub'),
                q('.rs-capa'), q('.rs-capb')], { autoAlpha: 0 });
      // the readouts start hidden: a bare "0%" under both grids reads as a result
      gsap.set(qa('.rs-num'), { autoAlpha: 0 });

      // ---- entrance: both populations first, so 54 vs 41 is read as a quantity ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, qa('.rs-lab'), { at: .3, stagger: .1 });
      Kit.fade(tl, q('.rs'), { at: .35, duration: .6 });
      ctx.pause();

      // ---- click 1: individual people, not a bar ----
      var la = qa('.la');
      tl.to(la, { autoAlpha: 1, duration: .3, stagger: { each: .025, from: 'random' } });
      tl.to(q('.rs-num'), { autoAlpha: 1, duration: .3 }, '<');
      countHTML(tl, q('.rs-num'), { from: 0, to: 48, suffix: '%', duration: .9, at: '<' });
      tl.to(q('.rs-capa'), { autoAlpha: 1, duration: .35 }, '-=.2');
      ctx.pause();

      // ---- click 2: one lonely dot is the comparison ----
      tl.to(qa('.lb'), { autoAlpha: 1, duration: .45 });
      tl.to(q('.rs-numb'), { autoAlpha: 1, duration: .3 }, '<');
      countHTML(tl, q('.rs-numb'), { from: 0, to: 2.4, decimals: 1, suffix: '%', duration: .8, at: '<' });
      tl.to(q('.rs-capb'), { autoAlpha: 1, duration: .35 }, '-=.2');
      ctx.pause();

      // ---- click 3: the slide ends on the caveats and the limitation, not the boast ----
      Kit.show(tl, [q('.rs-chip'), q('.rs-card'), q('.rs-sub')], { y: 26, stagger: .14 });
    },
    notes:
      'Tavus ran their own test. Fifty-four people had a one-minute video call, then said whether their ' +
      'partner might be a machine. What they tested is Griffin-Lite, a cut-down preview; the full model is ' +
      'not out.' +
      '[click] Twenty-six of them, forty-eight percent, thought they had talked to a person.' +
      '[click] With Tavus’s old system: one person in forty-one.' +
      '[click] So read it with those caveats. And Griffin still replies slower than we do: one-point-nine ' +
      'seconds against nine tenths. The point-four-three is the picture alone, not the thinking.'
  };

  /* ======================================================================
     9 · TAKEAWAY — three lessons, then the chip row (30 s, 2 clicks)
     CANONICAL SECTION CLOSER — pixel-identical to airbnb/takeaways and
     rufus/takeaways apart from text, image and section colour.
     ====================================================================== */
  var THRU = [
    { t: 'Price', cls: 'tk-price' },
    { t: 'Assist', cls: 'tk-assist' },
    { t: 'Interact', cls: 'tk-interact' },
    { t: 'Negotiate', cls: 'tk-neg' }
  ];
  var TKROWS = [
    ['01', 'Diffusion', 'Remove noise step by step<br>and a frame appears.'],
    ['02', 'Distillation', 'A small student copies<br>a big teacher.'],
    ['03', 'Evaluation', 'A believability score is not<br>a quality measure.']
  ];

  var TAKEAWAY = {
    id: 'takeaway',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 30,
    html: function () {
      var rows = TKROWS.map(function (r, i) {
        return '<div class="tk-row r' + i + '" style="top:' + (285 + i * 190) + 'px">' +
          '<div class="n t-mono">' + r[0] + '</div>' +
          '<div class="rule"></div>' +
          '<div class="tg t-caps">' + r[1] + '</div>' +
          '<div class="ln t-h2">' + r[2] + '</div>' +
        '</div>';
      }).join('');
      var strip = THRU.map(function (k, i) {
        return (i ? '<span class="sep t-caps">·</span>' : '') +
          '<span class="tok ' + k.cls + '"><span class="bg"></span><span class="tx t-caps">' + k.t + '</span></span>';
      }).join('');
      return '' +
        '<img class="tk-img" src="' + IMG + 'opener.jpg" alt="">' +
        '<div class="tk-veil"></div>' +
        rows +
        '<div class="thru">' + strip + '</div>' +
        Kit.src('Tavus’s live study: 26 of 54 vs 1 of 41, one-minute calls, no control arm.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var slab = q('.tk-interact .bg');

      // strip: PRICE and ASSIST already slabbed, INTERACT unfilled at entrance, NEGOTIATE not reached
      gsap.set(qa('.thru .tx'), { color: C.text3 });
      gsap.set(q('.tk-price .bg'), { backgroundColor: C.red, skewX: -12 });
      gsap.set(q('.tk-assist .bg'), { backgroundColor: C.blue, skewX: -12 });
      gsap.set([q('.tk-price .tx'), q('.tk-assist .tx')], { color: '#FFFFFF' });
      gsap.set(slab, { backgroundColor: C.purple, skewX: -12, scaleX: 0, transformOrigin: 'left center' });
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
      tl.to(q('.tk-interact .tx'), { color: '#FFFFFF', duration: .4 }, '<+.2');
      tl.to(q('.tk-neg .tx'), { color: C.greenT, duration: .5 }, '<+.1');
    },
    notes:
      'Three things to keep. One: diffusion makes realistic images and video, and the clean-up passes are what ' +
      'make it slow.' +
      '[click] Two: distillation. Train a small student to copy a big teacher, and the same model streams live.' +
      '[click] Three: the study measured whether people were fooled, not whether it was good. Half were fooled ' +
      'in one-minute calls, and replies still take twice as long as ours. Next: the company that built it.'
  };

  Deck.section({
    id: 'griffin', order: 3, num: '03', kicker: 'Interact', title: 'Tavus Griffin',
    slides: [OPEN, DEMO, CASCADE, OVERVIEW, DIFFUSION, STREAM, DISTILL, RESULTS, TAKEAWAY]
  });
})();
