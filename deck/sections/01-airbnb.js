/* ==========================================================================
   01 · Price — Airbnb Smart Pricing   (budget 425 s total)
   Flow: problem 60 → tree 30 → boost 35 → gbt-use 20 → price-model 55 → loss 120 → results 60 → takeaways 45
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;

  /* ======================================================================
     LOSS — the core teaching slide (120 s)
     Steps: 0 one booked night · 1 the zone · 2 the valley · 3 suggestion (draggable)
            4 flip to not-booked · 5 why both sides · 6 THE equation
     ====================================================================== */
  var P0 = 70, P1 = 130;                 // price axis range ($)
  var SW = 1040, SH = 560;               // svg size (px == user units)
  var X0 = 70, X1 = 1000, BASE = 400, TOP = 70, LMAX = 30;
  function X(p) { return X0 + (p - P0) * (X1 - X0) / (P1 - P0); }
  function Y(l) { return BASE - l * (BASE - TOP) / LMAX; }
  function lossAt(f, L, U) { return Math.max(0, L - f) + Math.max(0, f - U); }

  var LOSS = {
    id: 'loss',
    title: 'The loss function',
    heading: 'The loss function',
    budgetSec: 120,
    html: function () {
      var ticks = '';
      for (var p = P0; p <= P1; p += 10) {
        ticks += '<g class="tick"><line x1="' + X(p) + '" y1="' + BASE + '" x2="' + X(p) + '" y2="' + (BASE + 12) + '" stroke="#6E6560" stroke-width="3"/>' +
          '<text x="' + X(p) + '" y="' + (BASE + 50) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="500" fill="' + (p === 100 ? C.text : C.text3) + '">$' + p + '</text></g>';
      }
      return '' +
      '<svg class="lv" width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '" style="position:absolute;left:96px;top:282px;overflow:visible">' +
        '<defs>' +
          '<filter id="lvGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
          '<marker id="lvArrR" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + C.skyT + '"/></marker>' +
          '<marker id="lvArrL" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + C.redT + '"/></marker>' +
        '</defs>' +
        // y-axis label
        '<text class="ylab" x="' + (X0 - 30) + '" y="' + (TOP - 34) + '" font-family="Archivo" font-size="28" font-weight="700" letter-spacing="3" fill="' + C.text3 + '">PENALTY ↑</text>' +
        '<line class="yax" x1="' + (X0 - 30) + '" y1="' + (TOP - 14) + '" x2="' + (X0 - 30) + '" y2="' + BASE + '" stroke="#4A4345" stroke-width="3"/>' +
        // zone: a low band on the axis, with faint edges running up through the plot
        '<rect class="band" y="' + (BASE - 90) + '" height="90" rx="10" fill="' + C.teal + '" fill-opacity=".22"/>' +
        '<line class="bdL" y1="' + (TOP - 14) + '" y2="' + BASE + '" stroke="' + C.tealT + '" stroke-width="2" stroke-dasharray="8 10" opacity=".4"/>' +
        '<line class="bdU" y1="' + (TOP - 14) + '" y2="' + BASE + '" stroke="' + C.tealT + '" stroke-width="2" stroke-dasharray="8 10" opacity=".4"/>' +
        '<text class="bandlab" y="' + (BASE - 30) + '" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.tealT + '">no penalty</text>' +
        '<text class="edgeL" y="' + (BASE - 116) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="700" fill="' + C.tealT + '">L</text>' +
        '<text class="edgeU" y="' + (BASE - 116) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="700" fill="' + C.tealT + '">U</text>' +
        // valley
        '<g class="valley" filter="url(#lvGlow)">' +
          '<path class="wl" fill="none" stroke="' + C.skyT + '" stroke-width="9" stroke-linecap="round"/>' +
          '<path class="fl" fill="none" stroke="' + C.tealT + '" stroke-width="9" stroke-linecap="round"/>' +
          '<path class="wr" fill="none" stroke="' + C.redT + '" stroke-width="9" stroke-linecap="round"/>' +
        '</g>' +
        '<text class="lab-lo" x="' + X(71.5) + '" y="' + (BASE - 22) + '" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.skyT + '">too low</text>' +
        '<text class="lab-hi" x="' + X(128.5) + '" y="' + (BASE - 22) + '" text-anchor="end" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.redT + '">too high</text>' +
        // x axis
        '<line class="xax" x1="' + (X0 - 30) + '" y1="' + BASE + '" x2="' + (X1 + 24) + '" y2="' + BASE + '" stroke="#6E6560" stroke-width="3"/>' +
        ticks +
        // what happened (event chip on the axis at $100)
        '<g class="evt">' +
          '<rect x="' + (X(100) - 190) + '" y="' + (BASE + 70) + '" width="380" height="64" rx="32" fill="#353032"/>' +
          '<text class="evt-a" x="' + X(100) + '" y="' + (BASE + 112) + '" text-anchor="middle" font-family="Archivo" font-size="30" font-weight="700" fill="' + C.text + '">✓ Booked at $100</text>' +
          '<text class="evt-b" x="' + X(100) + '" y="' + (BASE + 112) + '" text-anchor="middle" font-family="Archivo" font-size="30" font-weight="700" fill="' + C.text + '">✕ Not booked at $100</text>' +
        '</g>' +
        // both-sides overlay (step 5)
        '<g class="both">' +
          '<line class="arr-up" x1="' + X(73) + '" y1="' + (TOP + 120) + '" x2="' + X(96.5) + '" y2="' + (TOP + 120) + '" stroke="' + C.skyT + '" stroke-width="10" stroke-linecap="round" marker-end="url(#lvArrR)"/>' +
          '<text class="arr-up-t" x="' + X(73) + '" y="' + (TOP + 172) + '" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.skyT + '">booked nights</text>' +
          '<text class="arr-up-t" x="' + X(73) + '" y="' + (TOP + 206) + '" font-family="Archivo" font-size="28" font-weight="500" fill="' + C.text2 + '">push prices up</text>' +
          '<line class="arr-dn" x1="' + X(127) + '" y1="' + (TOP + 120) + '" x2="' + X(103.5) + '" y2="' + (TOP + 120) + '" stroke="' + C.redT + '" stroke-width="10" stroke-linecap="round" marker-end="url(#lvArrL)"/>' +
          '<text class="arr-dn-t" x="' + X(127) + '" y="' + (TOP + 172) + '" text-anchor="end" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.redT + '">unbooked nights</text>' +
          '<text class="arr-dn-t" x="' + X(127) + '" y="' + (TOP + 206) + '" text-anchor="end" font-family="Archivo" font-size="28" font-weight="500" fill="' + C.text2 + '">push prices down</text>' +
        '</g>' +
        // suggestion (draggable)
        '<g class="sugg" style="cursor:ew-resize">' +
          '<rect class="hit" y="' + (TOP - 20) + '" width="80" height="' + (BASE - TOP + 60) + '" fill="transparent"/>' +
          '<line class="s-line" y1="' + (TOP - 14) + '" y2="' + BASE + '" stroke="' + C.text3 + '" stroke-width="2" stroke-dasharray="6 8"/>' +
          '<line class="s-bar" stroke-width="14" stroke-linecap="round"/>' +
          '<circle class="s-dot" r="13" fill="' + C.orange + '" stroke="#1E1B1C" stroke-width="4"/>' +
          '<circle class="s-knob" cy="' + BASE + '" r="22" fill="' + C.orange + '" stroke="' + C.text + '" stroke-width="4"/>' +
          '<text class="s-val" y="' + (TOP - 26) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="30" font-weight="700" fill="' + C.orangeT + '"></text>' +
        '</g>' +
        '<text class="draghint" y="' + (BASE - 40) + '" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text3 + '">◂ drag ▸</text>' +
      '</svg>' +

      // right column
      '<div class="rc" style="position:absolute;left:1214px;top:268px;width:586px;display:flex;flex-direction:column;gap:22px">' +
        '<div class="card c1" style="position:relative">' +
          '<div class="t-caps faint">What happened</div>' +
          '<div style="position:relative;height:64px;margin-top:10px">' +
            '<div class="t-h2 c1a" style="position:absolute;left:0;top:0;white-space:nowrap">This night <span class="c-teal">booked</span></div>' +
            '<div class="t-h2 c1b" style="position:absolute;left:0;top:0;white-space:nowrap">This night <span class="c-red">didn’t</span></div>' +
          '</div>' +
          '<div class="t-label dim" style="margin-top:6px">at a price of <span class="t-mono" style="color:var(--text)">$100</span></div>' +
        '</div>' +
        '<div class="card c2" style="position:relative">' +
          '<div class="t-caps faint">Prices the night supports</div>' +
          '<div style="position:relative;height:64px;margin-top:10px">' +
            '<div class="t-h2 t-mono c2a c-teal" style="position:absolute;left:0;top:0;white-space:nowrap">$100 – $110</div>' +
            '<div class="t-h2 t-mono c2b c-teal" style="position:absolute;left:0;top:0;white-space:nowrap">$90 – $100</div>' +
          '</div>' +
          '<div style="position:relative;height:34px;margin-top:6px">' +
            '<div class="t-label dim c2a" style="position:absolute;left:0;top:0;white-space:nowrap">at least $100, maybe a little more</div>' +
            '<div class="t-label dim c2b" style="position:absolute;left:0;top:0;white-space:nowrap">at most $100, and $100 already failed</div>' +
          '</div>' +
        '</div>' +
        '<div class="card c3">' +
          '<div class="rr"><span class="t-caps faint">Suggested</span>' +
            '<span class="t-num r-sugg" style="color:var(--orange-t)">$95</span></div>' +
          '<div class="rr"><span class="t-caps faint">Penalty</span>' +
            '<span class="t-num r-pen">$5</span></div>' +
          '<div class="t-label r-why" style="margin-top:10px;min-height:34px;white-space:nowrap"></div>' +
        '</div>' +
      '</div>' +

      // one-sided caution (step 5) — sits under the chart
      '<div class="t-label onlyone" style="position:absolute;left:120px;top:858px;width:1060px;color:var(--text-2)">' +
        'Use only unbooked nights, and the lowest-penalty price is <b class="c-orange">$0</b>. You need both.' +
      '</div>' +

      // THE equation (step 6) — replaces the right column as a stacked definition
      '<div class="card eqcard" style="position:absolute;left:1214px;top:268px;width:586px;display:flex;flex-direction:column;gap:18px;padding:36px 32px">' +
        '<div class="t-caps faint">The loss, in symbols</div>' +
        '<div class="t-label dim eqkey"><span class="t-mono c-teal">L</span> and <span class="t-mono c-teal">U</span> are the zone’s two edges</div>' +
        '<div class="eq">penalty =</div>' +
        '<div class="eqt"><div class="eq" style="color:var(--sky-t)">&nbsp;&nbsp;max(0, L − price)</div><div class="t-label c-sky" style="margin:6px 0 0 64px">how far below the zone</div></div>' +
        '<div class="eqt"><div class="eq" style="color:var(--red-t)">+ max(0, price − U)</div><div class="t-label c-red" style="margin:6px 0 0 64px">how far above the zone</div></div>' +
      '</div>' +

      // keep this line short: the right-hand card reaches down to y≈1040, so a
      // longer footer would run underneath it
      Kit.src('Interval loss: Ye et al., <em>KDD 2018</em> (via Colyer, 2018). Zone widths (×0.9, ×1.1) are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var svg = q('svg.lv');
      var st = { f: 85, t: 0, fl: 0, g: 0, s: 0 };   // f = suggestion $, t = booked→not booked, fl/g = floor & walls grow, s = suggestion visible
      var wl = q('.wl'), fl = q('.fl'), wr = q('.wr'), band = q('.band'), bandlab = q('.bandlab');
      var bdL = q('.bdL'), bdU = q('.bdU'), edgeL = q('.edgeL'), edgeU = q('.edgeU');
      var sLine = q('.s-line'), sBar = q('.s-bar'), sDot = q('.s-dot'), sKnob = q('.s-knob'), sVal = q('.s-val'), hit = q('.hit');
      var rSugg = q('.r-sugg'), rPen = q('.r-pen'), rWhy = q('.r-why'), hint = q('.draghint');

      function zone() { return [100 - 10 * st.t, 110 - 10 * st.t]; }
      function render() {
        var z = zone(), L = z[0], U = z[1];
        // band
        band.setAttribute('x', X(L)); band.setAttribute('width', Math.max(0, X(U) - X(L)));
        bandlab.setAttribute('x', (X(L) + X(U)) / 2);
        bdL.setAttribute('x1', X(L)); bdL.setAttribute('x2', X(L));
        bdU.setAttribute('x1', X(U)); bdU.setAttribute('x2', X(U));
        edgeL.setAttribute('x', X(L)); edgeU.setAttribute('x', X(U));
        // valley: floor grows from the zone centre, walls grow outward
        var mid = (L + U) / 2, h = (U - L) / 2 * st.fl;
        fl.setAttribute('d', 'M' + X(mid - h) + ',' + BASE + ' L' + X(mid + h) + ',' + BASE);
        var pl = L + (P0 - L) * st.g, pr = U + (P1 - U) * st.g;
        wl.setAttribute('d', 'M' + X(L) + ',' + BASE + ' L' + X(pl) + ',' + Y(lossAt(pl, L, U)));
        wr.setAttribute('d', 'M' + X(U) + ',' + BASE + ' L' + X(pr) + ',' + Y(lossAt(pr, L, U)));
        wl.style.opacity = st.g > 0 ? 1 : 0; wr.style.opacity = st.g > 0 ? 1 : 0; fl.style.opacity = st.fl > 0 ? 1 : 0;
        // suggestion
        var f = st.f, ls = lossAt(f, L, U), xf = X(f);
        sLine.setAttribute('x1', xf); sLine.setAttribute('x2', xf);
        sBar.setAttribute('x1', xf); sBar.setAttribute('x2', xf); sBar.setAttribute('y1', BASE); sBar.setAttribute('y2', Y(ls));
        var col = f < L ? C.skyT : f > U ? C.redT : C.tealT;
        sBar.setAttribute('stroke', col); sBar.style.opacity = ls > .05 ? 1 : 0;
        sDot.setAttribute('cx', xf); sDot.setAttribute('cy', Y(ls));
        sKnob.setAttribute('cx', xf); sVal.setAttribute('x', xf); sVal.textContent = '$' + Math.round(f);
        hit.setAttribute('x', xf - 40);
        hint.setAttribute('x', xf + 40);
        // readouts
        var pen = Math.round(ls);
        rSugg.textContent = '$' + Math.round(f);
        rPen.textContent = '$' + pen; rPen.style.color = pen === 0 ? C.tealT : col;
        var why;
        if (pen === 0) why = '<span class="c-teal">Inside the zone:</span> no penalty';
        else if (f < L) why = st.t < .5 ? '<span class="c-sky">Too low:</span> a guest already paid $100' : '<span class="c-sky">Too low:</span> $' + pen + ' under the zone';
        else why = st.t >= .5 ? '<span class="c-red">Too high:</span> $100 already failed' : '<span class="c-red">Too high:</span> $' + pen + ' over the zone';
        rWhy.innerHTML = why;
      }
      var R = { onUpdate: render };
      render();

      // ---- drag (works whenever the suggestion is visible) ----
      var detach = Kit.dragX(svg, q('.sugg'), function (x) {
        if (st.s < .5) return;
        var p = P0 + (x - X0) * (P1 - P0) / (X1 - X0);
        st.f = Math.max(72, Math.min(128, Math.round(p)));
        render();
        gsap.to(hint, { autoAlpha: 0, duration: .3 });
      });
      ctx.cleanup(detach);

      // the drag hint is an affordance for Rey, not for the room: it appears only
      // once a pointer actually moves over the chart, and never in print or preview
      var hinted = false;
      function showHint() {
        if (hinted || st.s < .5) return;
        hinted = true;
        gsap.to(hint, { autoAlpha: 1, duration: .3 });
      }
      svg.addEventListener('pointermove', showHint);
      ctx.cleanup(function () { svg.removeEventListener('pointermove', showHint); });

      // ---- initial hidden states ----
      // elements revealed by to() tweens start hidden; elements revealed by Kit.show/fromTo hide themselves
      gsap.set([hint, q('.both'), q('.lab-lo'), q('.lab-hi'), band, bdL, bdU, edgeL, edgeU,
                q('.evt-b'), q('.c1b'), qa('.c2b')], { autoAlpha: 0 });

      // ---- STEP 0: one booked night ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.draw(tl, [q('.xax'), q('.yax')], { at: .2, duration: .8 });
      Kit.fade(tl, [qa('.tick'), q('.ylab')], { at: .5, stagger: .03 });
      tl.from(q('.evt'), { y: 40, autoAlpha: 0, duration: .7, ease: Kit.ease.back }, .9);
      Kit.rise(tl, q('.c1'), { at: 1.0 });
      ctx.pause();

      // ---- STEP 1: the zone ----
      tl.set([band, bandlab], { autoAlpha: 1 });
      tl.fromTo(band, { attr: { width: 0 } }, { attr: { width: X(110) - X(100) }, duration: .8, ease: Kit.ease.out });
      tl.to([bdL, bdU], { autoAlpha: .4, duration: .4 }, '-=.35');
      Kit.show(tl, bandlab, { at: '-=.3', y: 10, duration: .4 });
      Kit.show(tl, q('.c2'), { at: '<' });
      ctx.pause();

      // ---- STEP 2: the valley ----
      tl.to(st, Object.assign({ fl: 1, duration: .6, ease: 'power2.out' }, R));
      tl.to(st, Object.assign({ g: 1, duration: 1.0, ease: 'power2.inOut' }, R));
      tl.to([q('.lab-lo'), q('.lab-hi')], { autoAlpha: 1, duration: .5, stagger: .15 }, '-=.4');
      ctx.pause();

      // ---- STEP 3: a suggestion you can drag ----
      tl.to(st, Object.assign({ s: 1, duration: .01 }, R));
      tl.fromTo(q('.sugg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 });
      Kit.show(tl, q('.c3'), { at: '<' });
      tl.to(st, Object.assign({ f: 121, duration: 1.6, ease: 'power2.inOut' }, R), '+=.2');
      tl.to(st, Object.assign({ f: 95, duration: 1.3, ease: 'power2.inOut' }, R));
      ctx.pause();

      // ---- STEP 4: flip — same night, not booked ----
      tl.to(hint, { autoAlpha: 0, duration: .2 });
      tl.to(st, Object.assign({ f: 105, duration: .8, ease: 'power2.inOut' }, R));
      tl.to([q('.evt-a'), q('.c1a')], { autoAlpha: 0, duration: .25 }, '+=.3');
      tl.to([q('.evt-b'), q('.c1b')], { autoAlpha: 1, duration: .35 });
      tl.to(st, Object.assign({ t: 1, duration: 1.1, ease: 'power3.inOut' }, R), '-=.1');
      tl.to(qa('.c2a'), { autoAlpha: 0, duration: .25 }, '<');
      tl.to(qa('.c2b'), { autoAlpha: 1, duration: .35 }, '<+.3');
      ctx.pause();

      // ---- STEP 5: why both sides ----
      tl.to([q('.valley'), q('.band'), q('.bandlab'), bdL, bdU, q('.sugg'), q('.lab-lo'), q('.lab-hi'),
             q('.c1'), q('.c2'), q('.c3')], { opacity: .22, duration: .4 });
      tl.to(q('.both'), { autoAlpha: 1, duration: .01 });
      Kit.draw(tl, [q('.arr-up'), q('.arr-dn')], { duration: .7, stagger: .25 });
      tl.from(qa('.arr-up-t, .arr-dn-t'), { autoAlpha: 0, y: 10, duration: .4, stagger: .08 }, '-=.3');
      Kit.show(tl, q('.onlyone'));
      ctx.pause();

      // ---- STEP 6: THE equation ----
      tl.to([q('.both'), q('.onlyone')], { autoAlpha: 0, duration: .35 });
      tl.to([q('.valley'), q('.band'), q('.bandlab'), q('.sugg'), q('.lab-lo'), q('.lab-hi')], { opacity: 1, duration: .4 }, '<');
      tl.to([q('.c1'), q('.c2'), q('.c3')], { autoAlpha: 0, x: 40, duration: .35, stagger: .06, ease: 'power2.in' }, '<');
      Kit.show(tl, q('.eqcard'), { y: 0, duration: .01 });
      Kit.show(tl, qa('.eqcard > *'), { y: 26, stagger: .14, at: '<' });
      tl.to([bdL, bdU], { autoAlpha: 1, duration: .4 }, '<');
      Kit.show(tl, [edgeL, edgeU], { y: 10, stagger: .12, duration: .4, at: '<' });
      tl.fromTo(q('.wl'), { attr: { 'stroke-width': 9 } }, { attr: { 'stroke-width': 14 }, duration: .3, yoyo: true, repeat: 1 }, '-=.4');
      tl.fromTo(q('.wr'), { attr: { 'stroke-width': 9 } }, { attr: { 'stroke-width': 14 }, duration: .3, yoyo: true, repeat: 1 }, '>');
    },

    notes:
      'Now we grade the price model’s suggestion. Airbnb never sees the right price for a night. It only ever sees what happened. ' +
      'Take one night: it booked at a hundred dollars.' +
      '[click] What does that tell us? The right price was at least a hundred, because a guest paid it. Maybe a bit more. ' +
      'So instead of one correct answer, we get a zone: about a hundred to a hundred and ten.' +
      '[click] Now we can grade any suggestion. Inside the zone: no penalty. Outside, the penalty grows with distance. ' +
      'Too low on the left, too high on the right. A valley with a flat floor, flat because the data honestly can’t tell those prices apart.' +
      '[click] Here is the price model’s suggestion. At ninety-five, the penalty is five dollars: too low, a guest already paid a hundred. ' +
      '(Optional: drag it into the zone and the penalty drops to zero.)' +
      '[click] Now flip the story. Same night, same price, but nobody booked. The zone slides down, to ninety through a hundred. ' +
      'And a suggestion of one-oh-five is now penalized, because a hundred already failed.' +
      '[click] Why do we need both kinds of nights? Booked nights push prices up. Unbooked nights push them down. ' +
      'Train on unbooked nights alone and the safest price is zero. Across millions of nights, the two pressures balance.' +
      '[click] And this is the only equation in the talk. L and U are the two edges of the zone, marked on the chart. ' +
      'The equation is just the picture in symbols: how far below the zone, plus how far above it. ' +
      'At most one of those is ever non-zero. That is Airbnb’s custom loss. Training adjusts each listing’s two settings until its total ' +
      'penalty is as small as possible. The zone widths I used are illustrative; Airbnb never published theirs.'
  };

  /* ======================================================================
     PROBLEM — the right price is never revealed (60 s)
     Steps: 0 the question · 1 three walls · 2 prices back · 3 one bit back
     ====================================================================== */
  var NIGHTS = [
    { d: 'Fri 12', p: '$120', ok: true },
    { d: 'Sat 13', p: '$140', ok: false },
    { d: 'Sun 14', p: '$95', ok: true },
    { d: 'Fri 19', p: '$160', ok: false },
    { d: 'Sat 20', p: '$110', ok: true }
  ];
  var WALLS = ['Every listing is one of a kind', 'Demand changes every day', 'Airbnb can only suggest, never test'];

  var PROBLEM = {
    id: 'problem',
    title: 'The pricing problem',
    heading: 'The pricing problem',
    budgetSec: 60,
    html: function () {
      var tiles = NIGHTS.map(function (n, i) {
        return '<div class="nt" style="left:' + (120 + i * 184) + 'px">' +
          '<div class="nt-d t-caps">' + n.d + '</div>' +
          '<div class="nt-p t-mono">' + n.p + '</div>' +
          '<div class="nt-s">' +
            '<span class="nt-x">–</span>' +
            '<span class="nt-g" style="color:' + (n.ok ? 'var(--teal-t)' : 'var(--red-t)') + '">' + (n.ok ? '✓' : '✕') + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
      var walls = WALLS.map(function (t, i) {
        return '<div class="wall card" style="top:' + (340 + i * 150) + 'px"><i></i><span class="t-body">' + t + '</span></div>';
      }).join('');
      return '' +
        '<div class="card pcard" style="position:absolute;left:120px;top:290px;width:620px;height:240px">' +
          '<div class="t-caps faint">One listing, one night</div>' +
          '<div class="t-num pq" style="margin-top:10px">' +
            '<span class="pq-d">$</span><span style="display:inline-block;width:40px"></span>' +
            '<span class="pq-q" style="color:var(--orange)">?</span>' +
          '</div>' +
        '</div>' +
        '<div class="t-caps faint striplab" style="position:absolute;left:120px;top:580px">What Airbnb gets back</div>' +
        tiles +
        '<div class="t-label ncap" style="position:absolute;left:120px;top:852px;width:920px;color:var(--text-2)">' +
          'Booked or empty. Never the right price.</div>' +
        '<div class="t-caps faint walllab" style="position:absolute;left:1060px;top:290px">Why hotel pricing fails here</div>' +
        walls +
        Kit.src('Why textbook revenue management breaks down here: Ye et al., <em>KDD 2018</em> (via Colyer, 2018). Dates and prices shown are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      // the outcome slot shows a dash until the outcome lands
      gsap.set(qa('.nt-g'), { autoAlpha: 0 });

      // ---- entrance: the question ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, q('.pcard'), { at: .25 });
      tl.from(q('.pq-d'), { scale: .9, autoAlpha: 0, duration: .5, ease: Kit.ease.out, transformOrigin: 'left bottom' }, .55);
      tl.from(q('.pq-q'), { scale: .9, autoAlpha: 0, duration: .55, ease: Kit.ease.back, transformOrigin: 'left bottom' }, .95);
      ctx.pause();

      // ---- click 1: three walls arrive one at a time ----
      Kit.fade(tl, q('.walllab'), { duration: .4 });
      Kit.slideIn(tl, qa('.wall'), { x: 60, stagger: .12, duration: .6, at: '-=.2' });
      ctx.pause();

      // ---- click 2: what comes back — the prices only ----
      Kit.fade(tl, q('.striplab'));
      Kit.rise(tl, qa('.nt'), { stagger: .07, duration: .55, at: '-=.25' });
      ctx.pause();

      // ---- click 3: …and one bit, replacing the empty slot's dash ----
      tl.to(qa('.nt-x'), { autoAlpha: 0, duration: .25, stagger: .08 });
      tl.fromTo(qa('.nt-g'), { scale: .3, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: .5, ease: Kit.ease.back, stagger: .08, transformOrigin: 'center center' }, '-=.4');
      Kit.fade(tl, q('.ncap'), { at: '-=.2' });
    },

    notes:
      'Start with the simplest question in the talk. A host has a room, and it is free tonight. What should it cost?' +
      '[click] A hotel answers that with a demand curve: two hundred near-identical rooms, and years of data on how ' +
      'bookings move with price. Airbnb has three problems with that. Every listing is one of a kind. Demand changes ' +
      'daily, and some events have no history at all. And Airbnb can only suggest. The host sets the final price, so Airbnb ' +
      'can never run a price experiment and watch what the market does. ' +
      'Airbnb did try the textbook route, and its own A/B tests showed it did not raise host revenue.' +
      '[click] So what does Airbnb get back? For every night, the price the host chose.' +
      '[click] And one bit. Booked, or empty. Nobody ever says what that night was really worth. ' +
      'Everything in the next five minutes exists because that number is missing.'
  };

  /* ======================================================================
     TREE — one decision tree, and one night routed through it (30 s)
     Steps: 0 the tree · 1 route one night · 2 one tree is rough
     ====================================================================== */
  var TR = {
    W: 1120, H: 580,
    rows: [40, 206, 372, 538],
    nodeH: 72
  };

  var TREE = {
    id: 'tree',
    title: 'Decision trees',
    heading: 'Decision trees',
    budgetSec: 30,
    html: function () {
      var R = TR.rows, h = TR.nodeH;
      function box(cls, cx, cy, w, label, leaf) {
        return '<g class="' + cls + '">' +
          '<rect class="bx" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="16" ' +
            'fill="' + C.surface + '" stroke="' + (leaf ? C.tealT : C.line) + '" stroke-width="2.5"/>' +
          '<text x="' + cx + '" y="' + (cy + (leaf ? 14 : 11)) + '" text-anchor="middle" ' +
            'font-family="' + (leaf ? 'JetBrains Mono' : 'Archivo') + '" font-size="' + (leaf ? 38 : 30) + '" ' +
            'font-weight="700" fill="' + (leaf ? C.tealT : C.text) + '">' + label + '</text>' +
        '</g>';
      }
      function edge(x1, y1, x2, y2) {
        return '<line class="ed" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + C.line + '" stroke-width="3"/>';
      }
      function elab(x, y, t, anchor) {
        return '<text class="elab" x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-family="Archivo" ' +
          'font-size="28" font-weight="600" fill="' + C.text3 + '">' + t + '</text>';
      }
      return '' +
        '<div class="t-caps faint tlab" style="position:absolute;left:120px;top:280px">A short list of yes-or-no questions</div>' +
        '<svg class="tvsvg" width="' + TR.W + '" height="' + TR.H + '" viewBox="0 0 ' + TR.W + ' ' + TR.H + '" ' +
          'style="position:absolute;left:120px;top:340px;overflow:visible">' +
          edge(430, R[0] + 36, 120, R[1] - 36) + edge(430, R[0] + 36, 720, R[1] - 36) +
          edge(720, R[1] + 36, 490, R[2] - 36) + edge(720, R[1] + 36, 880, R[2] - 36) +
          edge(880, R[2] + 36, 740, R[3] - 36) + edge(880, R[2] + 36, 1010, R[3] - 36) +
          elab(268, 128, 'no', 'end') + elab(600, 112, 'yes', 'start') +
          elab(598, 294, 'no', 'end') + elab(820, 276, 'yes', 'start') +
          // every node reads the same way: "no" goes left, "yes" goes right
          elab(796, 442, 'no', 'end') + elab(952, 460, 'yes', 'start') +
          '<path class="tr tr1" d="M430,' + (R[0] + 36) + ' L720,' + (R[1] - 36) + '" fill="none" stroke="' + C.orange + '" stroke-width="7" stroke-linecap="round"/>' +
          '<path class="tr tr2" d="M720,' + (R[1] + 36) + ' L880,' + (R[2] - 36) + '" fill="none" stroke="' + C.orange + '" stroke-width="7" stroke-linecap="round"/>' +
          '<path class="tr tr3" d="M880,' + (R[2] + 36) + ' L1010,' + (R[3] - 36) + '" fill="none" stroke="' + C.orange + '" stroke-width="7" stroke-linecap="round"/>' +
          box('q0', 430, R[0], 360, 'Within 7 days?') +
          box('lf35', 120, R[1], 180, '−9%', 1) +
          box('q1', 720, R[1], 260, 'Saturday?') +
          box('lf55', 490, R[2], 180, '+2%', 1) +
          box('q2', 880, R[2], 440, 'Price above the median?') +
          box('lf80', 740, R[3], 180, '+11%', 1) +
          box('lf50', 1010, R[3], 180, '+6%', 1) +
        '</svg>' +
        '<div class="t-label dim tleg" style="position:absolute;left:120px;top:922px">Each leaf gives a small nudge to the booking chance.</div>' +
        '<div class="rc" style="position:absolute;left:1240px;top:290px;width:560px;display:flex;flex-direction:column;gap:26px">' +
          '<div class="card exn">' +
            '<div class="t-caps faint">One night</div>' +
            '<div class="t-h2" style="margin-top:8px">Saturday</div>' +
            '<div class="t-label dim" style="margin-top:8px">in 4 days &middot; $180 &middot; median $150</div>' +
          '</div>' +
          '<div class="card ans">' +
            '<div class="t-caps faint">This tree nudges</div>' +
            '<div class="t-num av c-teal" style="font-size:112px;margin-top:10px">&mdash;</div>' +
          '</div>' +
        '</div>' +
        '<div class="t-label dim rough" style="position:absolute;left:1240px;top:780px;width:560px">One tree is a rough guess.</div>' +
        Kit.src('Airbnb scores booking chance with gradient boosting (Ye et al., <em>KDD 2018</em>, via Colyer, 2018). Questions and leaf values are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var segs = [q('.tr1'), q('.tr2'), q('.tr3')];
      var lens = segs.map(function (p) { return p.getTotalLength(); });
      var nodes = [q('.q0'), q('.q1'), q('.q2'), q('.lf50')];
      var av = q('.av');
      var st = { p: 0 };                       // 0 → 3: how far the night has travelled

      function render() {
        for (var i = 0; i < segs.length; i++) {
          var f = Math.max(0, Math.min(1, st.p - i));
          segs[i].style.strokeDasharray = lens[i];
          segs[i].style.strokeDashoffset = lens[i] * (1 - f);
          segs[i].style.opacity = f > 0 ? 1 : 0;
        }
        for (var k = 0; k < nodes.length; k++) {
          var on = st.p >= k - .001 && st.p > 0;
          var r = nodes[k].querySelector('.bx');
          r.setAttribute('stroke', on ? C.orange : (k === 3 ? C.tealT : C.line));
          r.setAttribute('stroke-width', on ? 5 : 2.5);
        }
        av.textContent = st.p >= 2.99 ? '+6%' : '—';
      }
      render();

      gsap.set([q('.ans'), q('.rough')], { autoAlpha: 0 });

      // ---- entrance: the tree itself ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.tlab'), { at: .25, duration: .4 });
      tl.from(q('.q0'), { autoAlpha: 0, y: -16, duration: .4, ease: Kit.ease.out }, .35);
      Kit.draw(tl, qa('.ed'), { duration: .5, stagger: .07, at: .6 });
      tl.from(qa('.elab'), { autoAlpha: 0, duration: .3, stagger: .05 }, '-=.35');
      tl.from([q('.lf35'), q('.q1'), q('.lf55'), q('.q2'), q('.lf80'), q('.lf50')],
        { autoAlpha: 0, scale: .85, duration: .4, ease: Kit.ease.back, stagger: .07, transformOrigin: 'center center' }, '-=.3');
      Kit.show(tl, q('.tleg'), { duration: .4, at: '-=.1' });
      Kit.rise(tl, q('.exn'), { duration: .5, at: '-=.3' });
      ctx.pause();

      // ---- click 1: route one night, question by question ----
      tl.to(st, { p: 1, duration: .5, ease: 'none', onUpdate: render });
      tl.to(st, { p: 2, duration: .5, ease: 'none', onUpdate: render }, '+=.35');
      tl.to(st, { p: 3, duration: .5, ease: 'none', onUpdate: render }, '+=.35');
      Kit.show(tl, q('.ans'), { duration: .5, at: '-=.1' });
      ctx.pause();

      // ---- click 2: one tree is not enough ----
      Kit.show(tl, q('.rough'), { duration: .5 });
    },

    notes:
      'A decision tree is a short list of yes/no questions about the night. Every path ends in a leaf, and the leaf ' +
      'holds a small nudge. On the right: a Saturday four days out, priced above the area median.' +
      '[click] Walk it down. Within seven days, yes. Saturday, yes. Above the median, yes. This tree nudges it up six points.' +
      '[click] One tree is a rough guess. Airbnb uses hundreds of them. The tree shape here follows Google’s ' +
      'Decision Forests course; the questions and the leaf values are mine.'
  };

  /* ======================================================================
     BOOST — many small trees, each trained on what is still wrong (35 s)
     Steps: 0 the gaps · 1 tree 1 · 2 tree 2 · 3 two hundred
     ====================================================================== */
  var BN = [
    { lab: 'Night 1 · booked', target: 100, r: .66 },
    { lab: 'Night 2 · empty',  target: 0,   r: .70 },
    { lab: 'Night 3 · booked', target: 100, r: .62 },
    { lab: 'Night 4 · booked', target: 100, r: .68 },
    { lab: 'Night 5 · empty',  target: 0,   r: .64 }
  ];
  var BX0 = 300, BX1 = 1060, BROW = [60, 165, 270, 375, 480];
  var FLOOR = .24;                        // gaps settle at 12 points, not at zero
  function BX(v) { return BX0 + v * (BX1 - BX0) / 100; }

  var BOOST = {
    id: 'boost',
    title: 'Boosting',
    heading: 'Boosting',
    budgetSec: 35,
    html: function () {
      var rows = BN.map(function (n, i) {
        var y = BROW[i], tx = BX(n.target);
        return '<g class="br b' + i + '">' +
          '<text x="0" y="' + (y + 24) + '" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text2 + '">' + n.lab + '</text>' +
          '<line class="trk" x1="' + BX0 + '" y1="' + (y + 15) + '" x2="' + BX1 + '" y2="' + (y + 15) + '" stroke="' + C.line + '" stroke-width="2"/>' +
          '<rect class="pb" x="' + BX0 + '" y="' + y + '" width="0" height="30" rx="8" fill="' + C.sky + '" fill-opacity=".9"/>' +
          '<line class="tg" x1="' + tx + '" y1="' + (y - 10) + '" x2="' + tx + '" y2="' + (y + 40) + '" stroke="' + C.tealT + '" stroke-width="6" stroke-linecap="round"/>' +
          '<line class="gp" y1="' + (y + 56) + '" y2="' + (y + 56) + '" stroke="' + C.orange + '" stroke-width="8" stroke-linecap="round"/>' +
        '</g>';
      }).join('');
      return '' +
        '<div class="t-caps faint blab" style="position:absolute;left:120px;top:280px">Chance this night books</div>' +
        '<svg class="bosvg" width="1120" height="620" viewBox="0 0 1120 620" style="position:absolute;left:120px;top:330px;overflow:visible">' +
          rows +
          '<text class="ax a0" x="' + BX0 + '" y="600" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="500" fill="' + C.text3 + '">0%</text>' +
          '<text class="ax a1" x="' + BX1 + '" y="600" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="500" fill="' + C.text3 + '">100%</text>' +
        '</svg>' +
        '<div class="rc" style="position:absolute;left:1300px;top:300px;width:500px;display:flex;flex-direction:column;gap:24px">' +
          '<div class="card tctr">' +
            '<div class="t-caps faint">Trees added</div>' +
            '<div class="t-num cnt" style="font-size:112px;margin-top:8px">0</div>' +
          '</div>' +
          '<div class="legend">' +
            '<div class="lg"><i style="background:' + C.sky + '"></i><span class="t-label dim">model&rsquo;s guess</span></div>' +
            '<div class="lg"><i style="background:' + C.tealT + '"></i><span class="t-label dim">what happened</span></div>' +
            '<div class="lg"><i style="background:' + C.orange + '"></i><span class="t-label dim">how wrong it still is</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="t-label dim bnote" style="position:absolute;left:1300px;top:780px;width:500px">Each new tree is trained on the orange gaps.</div>' +
        '<div class="t-label dim bsum" style="position:absolute;left:1300px;top:870px;width:500px">The gaps shrink. They never close.</div>' +
        Kit.src('Boosting procedure: Google, <em>Introduction to Gradient Boosted Decision Trees</em>. The five nights and the shrinking gaps are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var pbs = BN.map(function (_, i) { return q('.b' + i + ' .pb'); });
      var gps = BN.map(function (_, i) { return q('.b' + i + ' .gp'); });
      var cnt = q('.cnt');
      var st = { k: 0, in: 0 };                // k = trees added, in = entrance growth 0→1

      function pred(i) {
        var n = BN[i];
        // the shrink has a floor: hundreds of trees close most of the gap, never all of it
        return n.target + (50 - n.target) * (FLOOR + (1 - FLOOR) * Math.pow(n.r, st.k));
      }
      function render() {
        for (var i = 0; i < pbs.length; i++) {
          var p = pred(i) * st.in, t = BN[i].target;
          pbs[i].setAttribute('width', Math.max(0, BX(p) - BX0));
          var a = Math.min(BX(p), BX(t)), b = Math.max(BX(p), BX(t));
          gps[i].setAttribute('x1', a); gps[i].setAttribute('x2', b);
          gps[i].style.opacity = (b - a) > 4 ? 1 : 0;
        }
        cnt.textContent = Math.round(st.k);
      }
      render();

      gsap.set([q('.bnote'), q('.bsum')], { autoAlpha: 0 });

      // ---- entrance: five nights, one flat guess, five gaps ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, [q('.blab')].concat(qa('.trk, .ax')), { at: .25, stagger: .04 });
      tl.from(qa('.br text'), { autoAlpha: 0, x: -20, duration: .4, stagger: .06 }, .3);
      Kit.draw(tl, qa('.tg'), { at: .55, duration: .4, stagger: .06 });
      tl.to(st, { in: 1, duration: .7, ease: Kit.ease.out, onUpdate: render }, .8);
      Kit.rise(tl, q('.tctr'), { at: .9 });
      Kit.rise(tl, qa('.legend .lg'), { at: 1.0, stagger: .08, duration: .5 });
      ctx.pause();

      // ---- click 1: the first tree, fitted to the gaps ----
      Kit.show(tl, q('.bnote'), { duration: .45 });
      tl.to(st, { k: 1, duration: .9, ease: 'power2.inOut', onUpdate: render }, '-=.2');
      ctx.pause();

      // ---- click 2: the second tree ----
      tl.to(st, { k: 2, duration: .9, ease: 'power2.inOut', onUpdate: render });
      ctx.pause();

      // ---- click 3: two hundred of them ----
      tl.to(st, { k: 200, duration: 1.7, ease: 'power2.out', onUpdate: render });
      Kit.show(tl, q('.bsum'), { duration: .45, at: '-=.6' });
    },

    notes:
      'Boosted means many small trees added together. Five nights. Teal is what happened, booked or empty. ' +
      'Blue is the model’s guess, flat at the start. Orange is how wrong it is.' +
      '[click] The first tree is trained on those orange gaps, not on the outcomes. Add it, and every gap shrinks.' +
      '[click] The second tree is trained on what is left.' +
      '[click] Do that two hundred times. Each tree is a rough guess; hundreds together get close. ' +
      'The gaps shrink, and they never close. Closing them would just be memorizing these five nights.'
  };

  /* ======================================================================
     GBT-USE — what "gradient" means (20 s)
     Steps: 0 the arrows · 1 a tree follows them
     The deployment facts (one model per market, the booking chance, price as
     an input) moved to the front of price-model, where the pipeline needs them.
     ====================================================================== */
  var GA = [306, -140, 187, 351, -94];         // error direction and size, per night (illustrative)
  var GZERO = 380, GCOL = [420, 700, 980, 1260, 1540];

  var GBTUSE = {
    id: 'gbt-use',
    title: 'Gradient boosting at Airbnb',
    heading: 'Gradient boosting at Airbnb',
    budgetSec: 20,
    html: function () {
      var arrows = GA.map(function (v, i) {
        var x = GCOL[i];
        return '<g class="ar a' + i + '">' +
          '<line class="sh" x1="' + x + '" y1="' + GZERO + '" x2="' + x + '" y2="' + GZERO + '" ' +
            'stroke="' + (v > 0 ? C.skyT : C.redT) + '" stroke-width="13" stroke-linecap="butt"/>' +
          '<path class="hd2" fill="' + (v > 0 ? C.skyT : C.redT) + '"/>' +
        '</g>';
      }).join('');
      var nums = GA.map(function (v, i) {
        return '<text class="gnum" x="' + GCOL[i] + '" y="' + (GZERO + 190) + '" text-anchor="middle" ' +
          'font-family="JetBrains Mono" font-size="28" font-weight="500" fill="' + C.text3 + '">' + (i + 1) + '</text>';
      }).join('');
      return '' +
        '<div class="t-caps faint glab" style="position:absolute;left:120px;top:280px">How to fix each night</div>' +
        '<svg class="gsvg" width="1500" height="520" viewBox="0 0 1500 520" style="position:absolute;left:120px;top:392px;overflow:visible">' +
          '<line class="zl" x1="300" y1="' + GZERO + '" x2="1620" y2="' + GZERO + '" stroke="' + C.line + '" stroke-width="3"/>' +
          '<text class="zt" x="0" y="' + (GZERO + 10) + '" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text3 + '">0 = exactly right</text>' +
          '<text class="zt" x="0" y="' + (GZERO - 44) + '" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.skyT + '">&#8593; guess higher</text>' +
          '<text class="zt" x="0" y="' + (GZERO + 64) + '" font-family="Archivo" font-size="28" font-weight="700" fill="' + C.redT + '">&#8595; guess lower</text>' +
          arrows + nums +
        '</svg>' +
        '<div class="t-body gcap" style="position:absolute;left:120px;top:326px;width:1100px;color:var(--text-2)">' +
          'Each arrow is one night: which way, and how far</div>' +
        '<div class="chip gfix" style="position:absolute;left:1240px;top:290px"><span class="dot"></span>' +
          '<span>A new tree follows the arrows</span></div>' +
        Kit.src('Boosting as gradient descent in function space: Friedman, 2001. Arrow sizes are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var shafts = GA.map(function (_, i) { return q('.a' + i + ' .sh'); });
      var heads = GA.map(function (_, i) { return q('.a' + i + ' .hd2'); });
      var st = { g: 0 };                        // g = arrow length as a fraction of the full error

      var GHEAD = 26;                           // arrowhead length, constant so small errors stay legible
      function render() {
        for (var i = 0; i < GA.length; i++) {
          var x = GCOL[i], d = GA[i] > 0 ? 1 : -1;
          var len = Math.abs(GA[i] * st.g);
          var on = len > 1;
          var eff = Math.max(len, GHEAD + 12);  // always keep a visible shaft under the head
          var tip = GZERO - d * eff, base = GZERO - d * (eff - GHEAD);
          shafts[i].setAttribute('y2', base);
          shafts[i].style.opacity = on && eff > GHEAD + 2 ? 1 : 0;
          heads[i].style.opacity = on ? 1 : 0;
          heads[i].setAttribute('d',
            'M' + (x - GHEAD * .72) + ',' + base + ' L' + x + ',' + tip + ' L' + (x + GHEAD * .72) + ',' + base + ' z');
        }
      }
      render();

      gsap.set(q('.gfix'), { autoAlpha: 0 });

      // ---- entrance: one arrow per night, different directions and lengths ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.glab'), { at: .25, duration: .4 });
      Kit.draw(tl, q('.zl'), { at: .3, duration: .6 });
      Kit.fade(tl, qa('.zt'), { at: .5, duration: .4, stagger: .06 });
      Kit.fade(tl, qa('.gnum'), { at: .55, duration: .35, stagger: .05 });
      tl.to(st, { g: 1, duration: .8, ease: Kit.ease.out, onUpdate: render }, .65);
      Kit.fade(tl, q('.gcap'), { at: 1.1, duration: .4 });
      ctx.pause();

      // ---- click 1: a tree that follows the arrows shortens them ----
      Kit.show(tl, q('.gfix'), { duration: .45 });
      tl.to(st, { g: .6, duration: .9, ease: 'power2.inOut', onUpdate: render }, '-=.15');
    },

    notes:
      'Why gradient? Each night’s error has a direction and a size. Up means the model should guess higher, ' +
      'down means lower.' +
      '[click] Each new tree is trained to follow those arrows, so every round moves downhill on the error. ' +
      'That is the whole idea: gradient descent, one tree at a time.'
  };

  /* ======================================================================
     PRICE-MODEL — how the booking model is used, then booking chance → a price (55 s)
     Steps: 0 what the booking model gives us · 1 the two-model pipeline
            2 the adjustment curve + two nights · 3 the two settings · 4 the loss tunes them
     ====================================================================== */
  var PM = { host: 100, sat: .8, tue: .3 };     // host's price ($) and the two nights' booking chances (illustrative)
  var PX0 = 160, PX1 = 1000, PY0 = 420, PY1 = 70; // plot box, local svg units: x = chance 0→1, y = adjustment .75→1.25
  var PVLO = .75, PVHI = 1.25;
  function PX(q) { return PX0 + q * (PX1 - PX0); }
  function PY(v) { return PY0 - (v - PVLO) * (PY0 - PY1) / (PVHI - PVLO); }

  var PRICEMODEL = {
    id: 'price-model',
    title: 'The price model',
    heading: 'The price model',
    budgetSec: 55,
    html: function () {
      var yt = [.8, .9, 1, 1.1, 1.2].map(function (v) {
        return '<text class="pyt" x="' + (PX0 - 24) + '" y="' + (PY(v) + 10) + '" text-anchor="end" font-family="JetBrains Mono" ' +
          'font-size="28" font-weight="500" fill="' + (v === 1 ? C.text : C.text3) + '">×' + v.toFixed(2) + '</text>';
      }).join('');
      var xt = [0, .5, 1].map(function (q) {
        return '<text class="pxt" x="' + PX(q) + '" y="' + (PY0 + 46) + '" text-anchor="middle" font-family="JetBrains Mono" ' +
          'font-size="28" font-weight="500" fill="' + C.text3 + '">' + Math.round(q * 100) + '%</text>';
      }).join('');
      function night(cls, name) {
        return '<g class="pn ' + cls + '">' +
          '<line class="pg" y2="' + PY0 + '" stroke="' + C.text3 + '" stroke-width="2" stroke-dasharray="4 8"/>' +
          '<circle class="pd" r="13" stroke="#1E1B1C" stroke-width="4"/>' +
          '<text class="pl" font-family="Archivo" font-size="28" font-weight="700">' + name + '</text>' +
        '</g>';
      }
      function dep(cls, left, caps, title, body) {
        return '<div class="card dep ' + cls + '" style="left:' + left + 'px">' +
          '<div class="t-caps faint">' + caps + '</div>' +
          '<div class="t-h2 dt">' + title + '</div>' +
          '<div class="t-label dim db">' + body + '</div>' +
        '</div>';
      }
      return '' +
        // ---- step 0: what the booking model gives the price model ----
        '<div class="t-caps faint deplab" style="position:absolute;left:120px;top:280px">What the booking model gives us</div>' +
        dep('d1', 120, 'Where it runs', 'One model<br>per market', 'Tokyo and Tahoe differ') +
        dep('d2', 690, 'What it outputs', 'The chance<br>a night books', 'for one listing, one night') +
        dep('d3', 1260, 'What goes in', 'Price is<br>an input', '<span class="t-mono">$150</span> → 62% · <span class="t-mono">$180</span> → 41%') +

        // ---- pipeline strip: booking model → chance → PRICE MODEL → price → the loss ----
        '<div class="pm-box pm-a" style="left:120px;width:330px">' +
          '<div class="pm-t" style="color:var(--text-2)">Booking model</div><div class="t-label faint">the trees</div></div>' +
        '<div class="pm-box pm-b" style="left:690px;width:520px">' +
          '<div class="pm-t c-orange">Price model</div><div class="t-label dim">host’s price <span class="t-mono" style="color:var(--text)">$100</span> + area demand</div></div>' +
        '<div class="pm-box pm-c" style="left:1410px;width:390px">' +
          '<div class="pm-t" style="color:var(--text-2)">The loss</div><div class="t-label faint">grades it, next slide</div></div>' +
        '<svg class="pmflow" width="1920" height="140" viewBox="0 0 1920 140" style="position:absolute;left:0;top:276px;overflow:visible;pointer-events:none">' +
          '<defs><marker id="pmArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
            '<path d="M0,0 L10,5 L0,10 z" fill="' + C.text3 + '"/></marker></defs>' +
          '<line class="pa pa1" x1="466" y1="66" x2="674" y2="66" stroke="' + C.text3 + '" stroke-width="4"/>' +
          '<text class="pal pal1" x="570" y="46" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="700" fill="' + C.skyT + '">80%</text>' +
          '<text class="pal pal1" x="570" y="112" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text3 + '">chance</text>' +
          '<line class="pa pa2" x1="1226" y1="66" x2="1394" y2="66" stroke="' + C.text3 + '" stroke-width="4"/>' +
          '<text class="pal pal2 pp-out" x="1310" y="46" text-anchor="middle" font-family="JetBrains Mono" font-size="28" font-weight="700" fill="' + C.orangeT + '">$112</text>' +
          '<text class="pal pal2" x="1310" y="112" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text3 + '">suggested</text>' +
        '</svg>' +
        // the three deployment facts, kept on screen as one line once the cards go
        '<div class="t-label pmfacts">One model per market · The chance a night books · Price is an input</div>' +

        // ---- the adjustment curve ----
        '<svg class="pmsvg" width="1060" height="520" viewBox="0 0 1060 520" style="position:absolute;left:120px;top:464px;overflow:visible">' +
          '<defs><clipPath id="pmClip"><rect x="' + PX0 + '" y="' + (PY1 - 10) + '" width="' + (PX1 - PX0) + '" height="' + (PY0 - PY1 + 10) + '"/></clipPath></defs>' +
          '<text class="pylab" x="0" y="26" font-family="Archivo" font-size="28" font-weight="700" letter-spacing="3" fill="' + C.text3 + '">PRICE ADJUSTMENT</text>' +
          '<line class="pax" x1="' + PX0 + '" y1="' + PY0 + '" x2="' + PX1 + '" y2="' + PY0 + '" stroke="#6E6560" stroke-width="3"/>' +
          '<line class="pax" x1="' + PX0 + '" y1="' + PY0 + '" x2="' + PX0 + '" y2="' + (PY1 - 10) + '" stroke="#6E6560" stroke-width="3"/>' +
          yt + xt +
          '<text class="pxlab" x="' + ((PX0 + PX1) / 2) + '" y="' + (PY0 + 92) + '" text-anchor="middle" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text2 + '">booking chance</text>' +
          '<line class="p1" x1="' + PX0 + '" y1="' + PY(1) + '" x2="' + PX1 + '" y2="' + PY(1) + '" stroke="' + C.text3 + '" stroke-width="3" stroke-dasharray="10 10"/>' +
          '<text class="p1t" x="' + (PX0 + 16) + '" y="' + (PY(1) - 16) + '" font-family="Archivo" font-size="28" font-weight="600" fill="' + C.text2 + '">host’s price, unchanged</text>' +
          '<g clip-path="url(#pmClip)"><path class="pc" fill="none" stroke="' + C.orange + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>' +
          '<g class="px"><path stroke="' + C.orangeT + '" stroke-width="6" stroke-linecap="round" d="M-14,-14 L14,14 M14,-14 L-14,14"/></g>' +
          night('pn-sat', 'Sat') + night('pn-tue', 'Tue') +
        '</svg>' +

        // ---- right column: two nights, then the two settings ----
        '<div class="card pmn" style="position:absolute;left:1250px;top:448px;width:550px">' +
          '<div class="t-caps faint">Two nights at $100</div>' +
          '<div class="pr"><span class="t-label">Busy Sat · <span class="t-mono">80%</span></span><span class="pv"><span class="t-label t-mono rm-sat">×1.12</span> <span class="t-label faint">→</span> <b class="t-mono rp-sat">$112</b></span></div>' +
          '<div class="pr"><span class="t-label">Quiet Tue · <span class="t-mono">30%</span></span><span class="pv"><span class="t-label t-mono rm-tue">×0.92</span> <span class="t-label faint">→</span> <b class="t-mono rp-tue">$92</b></span></div>' +
        '</div>' +
        '<div class="ps ps1" style="top:690px"><i></i><div class="t-caps faint">Setting 1</div><div class="t-label">where it crosses ×1.00</div></div>' +
        '<div class="ps ps2" style="top:792px"><i></i><div class="t-caps faint">Setting 2</div><div class="t-label">how steep — up and down differ</div></div>' +
        '<div class="chip pmnx" style="position:absolute;left:1250px;top:900px"><span class="dot"></span>' +
          '<span>The loss tunes both, per listing</span></div>' +
        Kit.src('One model per market, price as an input, host’s price × a learned adjustment: Ye et al., <em>KDD 2018</em> (via Colyer, 2018). Numbers are illustrative.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var st = { n: .5, s: .4, c: 0, d: 0 };   // n = where it crosses ×1.00, s = steepness, c = curve draw-in, d = dots shown
      var line = q('.pc'), cross = q('.px');
      var NIGHTS2 = [
        { g: q('.pn-sat'), q: PM.sat, col: C.redT,  m: q('.rm-sat'), p: q('.rp-sat'), lab: 'end' },
        { g: q('.pn-tue'), q: PM.tue, col: C.skyT,  m: q('.rm-tue'), p: q('.rp-tue'), lab: 'start' }
      ];
      var out = q('.pp-out');

      // asymmetric: a rise and a cut of the same size are not mirror images, so the
      // two sides of the crossing point get their own exponent and their own reach
      function adj(x) {
        if (x >= st.n) return 1 + .397 * st.s * Math.pow((x - st.n) / (1 - st.n), .55);
        return 1 - .478 * st.s * Math.pow((st.n - x) / st.n, .95);
      }
      function render() {
        var pts = [], i;
        for (i = 0; i <= 60; i++) {
          var x = i / 60 * st.c;
          pts.push((i ? 'L' : 'M') + PX(x) + ',' + PY(adj(x)));
        }
        line.setAttribute('d', pts.join(' '));
        line.style.opacity = st.c > .001 ? 1 : 0;
        cross.setAttribute('transform', 'translate(' + PX(st.n) + ',' + PY(1) + ')');
        cross.style.opacity = st.c >= st.n ? 1 : 0;
        NIGHTS2.forEach(function (n) {
          var v = adj(n.q), x = PX(n.q), y = PY(v);
          var circ = n.g.querySelector('.pd'), guide = n.g.querySelector('.pg'), lab = n.g.querySelector('.pl');
          var col = v >= 1 ? C.redT : C.skyT;
          circ.setAttribute('cx', x); circ.setAttribute('cy', y); circ.setAttribute('fill', col);
          guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.setAttribute('y1', y + 16);
          lab.setAttribute('x', n.lab === 'end' ? x - 26 : x + 26); lab.setAttribute('y', y + (n.lab === 'end' ? -18 : 44));
          lab.setAttribute('text-anchor', n.lab); lab.setAttribute('fill', col);
          n.g.style.opacity = st.d;
          var price = Math.round(PM.host * v);
          n.m.textContent = '×' + v.toFixed(2);
          n.p.textContent = '$' + price; n.p.style.color = col;
          if (n.q === PM.sat) out.textContent = '$' + price;
        });
      }
      render();

      gsap.set([q('.pmn'), q('.ps1'), q('.ps2'), q('.pmnx'), q('.pmfacts')], { autoAlpha: 0 });
      gsap.set(qa('.pmsvg > :not(defs):not(.pn)'), { autoAlpha: 0 });   // the nights' opacity belongs to render()
      gsap.set(qa('.ps i'), { autoAlpha: 0 });
      // the arrows carry an end marker, which would still paint while the line is
      // dash-hidden, so they stay fully hidden until the pipeline step
      gsap.set([q('.pm-a'), q('.pm-b'), q('.pm-c'), q('.pa1'), q('.pa2')], { autoAlpha: 0 });

      // ---- entrance: what the booking model hands over ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.fade(tl, q('.deplab'), { at: .25, duration: .4 });
      Kit.rise(tl, qa('.dep'), { at: .4, stagger: .12, duration: .55 });
      ctx.pause();

      // ---- click 1: the two-model pipeline, left to right ----
      tl.to([q('.deplab'), qa('.dep')], { autoAlpha: 0, y: -24, duration: .4, stagger: .05, ease: 'power2.in' });
      Kit.show(tl, q('.pm-a'), { duration: .5, at: '-=.15' });
      tl.set(q('.pa1'), { autoAlpha: 1 }, '-=.15');
      Kit.draw(tl, q('.pa1'), { duration: .4, at: '<' });
      tl.set(q('.pa1'), { attr: { 'marker-end': 'url(#pmArr)' } });
      tl.from(qa('.pal1'), { autoAlpha: 0, y: 8, duration: .3 }, '-=.15');
      Kit.show(tl, q('.pm-b'), { duration: .5, at: '-=.1' });
      tl.set(q('.pa2'), { autoAlpha: 1 }, '-=.15');
      Kit.draw(tl, q('.pa2'), { duration: .4, at: '<' });
      tl.set(q('.pa2'), { attr: { 'marker-end': 'url(#pmArr)' } });
      tl.from(qa('.pal2'), { autoAlpha: 0, y: 8, duration: .3 }, '-=.15');
      Kit.show(tl, q('.pm-c'), { duration: .5, at: '-=.1' });
      Kit.show(tl, q('.pmfacts'), { duration: .45, at: '-=.2' });
      ctx.pause();

      // ---- click 2: the curve, then the two nights land on it ----
      tl.to(qa('.pmsvg > :not(defs):not(.pn)'), { autoAlpha: 1, duration: .4, stagger: .02 });
      tl.to(st, { c: 1, duration: 1.0, ease: 'power2.inOut', onUpdate: render }, '-=.1');
      tl.to(st, { d: 1, duration: .4, onUpdate: render });
      Kit.show(tl, q('.pmn'), { at: '<' });
      ctx.pause();

      // ---- click 3: the two settings, each one moved and put back ----
      Kit.show(tl, q('.ps1'), { duration: .4 });
      tl.to(q('.ps1 i'), { autoAlpha: 1, duration: .25 });
      tl.to(st, { n: .62, duration: .9, ease: 'power2.inOut', onUpdate: render });
      tl.to(st, { n: .5, duration: .9, ease: 'power2.inOut', onUpdate: render }, '+=.4');
      Kit.show(tl, q('.ps2'), { duration: .4 });
      tl.to(q('.ps2 i'), { autoAlpha: 1, duration: .25 });
      tl.to(st, { s: .52, duration: .9, ease: 'power2.inOut', onUpdate: render });
      tl.to(st, { s: .4, duration: .9, ease: 'power2.inOut', onUpdate: render }, '+=.4');
      ctx.pause();

      // ---- click 4: the hand-off to the loss ----
      Kit.show(tl, q('.pmnx'), { duration: .45 });
    },

    notes:
      'What do the trees hand over? One booking model per market, because Tokyo and Tahoe behave differently. ' +
      'Each one gives the chance a single night books. And price is an input, so they can re-score the same ' +
      'night at a hundred and eighty and watch that chance drop.' +
      '[click] A chance is not a price. So the price model takes over: it scales the host’s own price up or down.' +
      '[click] A busy Saturday at eighty percent: times one point one two, so a hundred becomes a hundred and twelve. ' +
      'A quiet Tuesday at thirty percent: ninety-two. And that eighty percent was read at the host’s own hundred dollars.' +
      '[click] Two settings: where the curve crosses the host’s price, and how steep it is. Up and down are not ' +
      'mirror images, so each direction is learned separately.' +
      '[click] Each listing learns its own two. The loss on the next slide is how.'
  };

  /* ======================================================================
     RESULTS — prices down, revenue up (60 s)
     Steps: 0 the two numbers · 1 the causal chain · 2 who measured it
     ====================================================================== */
  var RESULTS = {
    id: 'results',
    title: 'Results',
    heading: 'Results',
    budgetSec: 60,
    html: function () {
      function num(cls, left, caps, glyph, col, sub) {
        return '<div class="card rcard ' + cls + '" style="left:' + left + 'px">' +
          '<div class="t-caps faint">' + caps + '</div>' +
          '<div class="row"><span class="gl" style="color:var(--' + col + ')">' + glyph + '</span>' +
            '<span class="t-num val" style="color:var(--' + col + ')"></span></div>' +
          '<div class="t-label sub">' + sub + '</div>' +
        '</div>';
      }
      function chip(cls, left, w, t) {
        return '<div class="chip lnk ' + cls + '" style="left:' + left + 'px;width:' + w + 'px"><span class="dot"></span><span>' + t + '</span></div>';
      }
      return '' +
        num('rA', 120, 'Nightly price', '↓', 'sky-t', 'what adopters charged') +
        num('rB', 980, 'Daily revenue', '↑', 'teal-t', 'what adopters earned') +
        '<svg class="ressvg" width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;pointer-events:none">' +
          '<defs><marker id="resArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
            '<path d="M0,0 L10,5 L0,10 z" fill="' + C.text3 + '"/></marker></defs>' +
          '<line class="ca ca1" x1="600" y1="715" x2="660" y2="715" stroke="' + C.text3 + '" stroke-width="4"/>' +
          '<line class="ca ca2" x1="1220" y1="715" x2="1280" y2="715" stroke="' + C.text3 + '" stroke-width="4"/>' +
        '</svg>' +
        chip('k1', 120, 460, 'lower price') +
        chip('k2', 680, 520, 'more nights booked') +
        chip('k3', 1300, 440, 'more money') +
        '<div class="ev a">' +
          '<span class="flag">Self-reported</span>' +
          '<div class="t-label cl">Airbnb, 2015: 4× more likely to book<br>A correlation, not a result</div>' +
        '</div>' +
        '<div class="ev b">' +
          '<span class="flag">Independent</span>' +
          '<div class="t-label cl">Marketing Science, 2021:<br>adoption as a quasi-experiment</div>' +
        '</div>' +
        Kit.src('Zhang, Mehta, Singh &amp; Srinivasan, <em>Marketing Science</em> (2021): nightly rate −5.7%, daily revenue +8.6%. The 4× claim: Airbnb, 2015.');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;

      // ---- entrance: two numbers moving in opposite directions ----
      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .1 });
      Kit.rise(tl, qa('.rcard'), { at: .25, stagger: .1 });
      tl.from(qa('.rcard .gl'), { autoAlpha: 0, duration: .01 }, .3);
      Kit.count(tl, q('.rA .val'), { from: 0, to: 5.7, decimals: 1, prefix: '\u2212', suffix: '%', duration: 1.2, at: .55 });
      Kit.count(tl, q('.rB .val'), { from: 0, to: 8.6, decimals: 1, prefix: '+', suffix: '%', duration: 1.2, at: .55 });
      tl.to(qa('.rcard .gl'), { autoAlpha: 1, duration: .4, stagger: .1 }, 1.55);
      ctx.pause();

      // ---- click 1: why a price drop raised revenue ----
      Kit.rise(tl, q('.k1'), { y: 20, duration: .45 });
      Kit.draw(tl, q('.ca1'), { duration: .3 });
      tl.set(q('.ca1'), { attr: { 'marker-end': 'url(#resArr)' } });
      Kit.rise(tl, q('.k2'), { y: 20, duration: .45 });
      Kit.draw(tl, q('.ca2'), { duration: .3 });
      tl.set(q('.ca2'), { attr: { 'marker-end': 'url(#resArr)' } });
      Kit.rise(tl, q('.k3'), { y: 20, duration: .45 });
      ctx.pause();

      // ---- click 2: which number is independent ----
      Kit.rise(tl, qa('.ev'), { y: 60, duration: .6, stagger: .1 });
      tl.to(q('.ev.b'), { backgroundColor: '#3C3537', duration: .4 }, '-=.35');
    },

    notes:
      'So does it work? An independent study in Marketing Science in 2021 followed hosts who switched Smart Pricing on. ' +
      'Their nightly rate fell five point seven percent. Their daily revenue rose eight point six percent.' +
      '[click] Those two arrows point in opposite directions, and that is the whole story. A lot of hosts were overpricing. ' +
      'A lower price filled more nights, and the extra nights more than paid for the discount.' +
      '[click] That is not Airbnb’s own number. Airbnb claims hosts who priced within five percent of the tip were four times ' +
      'more likely to book. That is self-reported, and only a correlation. The study used the rollout as a quasi-experiment, so it is ' +
      'the number I quote. One caveat: this is revenue, not profit. The model never sees what a night costs the host in cleaning and hassle.'
  };

  /* ======================================================================
     TAKEAWAYS — what carries past Airbnb (45 s)
     Steps: 0 row 01 · 1 row 02 · 2 row 03 + the hand-off
     CANONICAL CLOSER: this layout (tk-img / tk-veil / three tk-rows / thru)
     is shared pixel-for-pixel by rufus/takeaways and griffin/takeaway.
     Only the text, the image and the section colour differ. Do not drift.
     ====================================================================== */
  var TKROWS = [
    ['01', 'Boosted trees', 'Data in rows and columns?<br>Start with boosted trees.'],
    ['02', 'Custom loss', 'No right answer to copy?<br>Grade what you can see.'],
    ['03', 'Objectives', 'A model exploits any gap<br>in its own score.']
  ];
  var THRU = [
    { t: 'Price', cls: 'tk-price' },
    { t: 'Assist', cls: 'tk-assist' },
    { t: 'Interact', cls: '' },
    { t: 'Negotiate', cls: '' }
  ];

  var TAKEAWAYS = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 45,
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
        '<img class="tk-img" src="assets/img/airbnb/nights-grid.jpg" alt="" style="object-position:58% center">' +
        '<div class="tk-veil"></div>' +
        rows +
        '<div class="thru">' + strip + '</div>' +
        Kit.src('Grinsztajn et al., 2022 (arXiv 2207.08815); Airbnb takes a cut of each booking (Huang, 2021).');
    },

    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      var slab = q('.tk-price .bg');

      // strip: PRICE unfilled at entrance, everything after it tertiary
      gsap.set(qa('.thru .tx'), { color: C.text3 });
      gsap.set(slab, { backgroundColor: C.red, skewX: -12, scaleX: 0, transformOrigin: 'left center' });
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
      tl.to(q('.tk-price .tx'), { color: '#FFFFFF', duration: .4 }, '<+.2');
      tl.to(q('.tk-assist .tx'), { color: C.blueT, duration: .5 }, '<+.1');
    },

    notes:
      'Three things to carry past Airbnb. One: if your data sits in rows and columns, start with boosted ' +
      'trees, not a neural network. They are strong on tables, fast to train and easy to inspect.' +
      '[click] Two: when there is no right answer to copy, grade what you can see. Booked or empty became ' +
      'a price range instead of a target, and that move works anywhere the label is missing.' +
      '[click] Three: a model exploits any gap in its own score. Grade only unbooked nights and zero dollars ' +
      'wins. Remember whose score it is. Airbnb optimizes revenue, and it takes a cut of revenue. ' +
      'That is pricing. Next: Assist.'
  };

  Deck.section({
    id: 'airbnb', order: 1, num: '01', kicker: 'Price', title: 'Airbnb Smart Pricing',
    slides: [
      PROBLEM, TREE, BOOST, GBTUSE, PRICEMODEL, LOSS, RESULTS, TAKEAWAYS
    ]
  });
})();
