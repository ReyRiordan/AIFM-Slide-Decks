/* ==========================================================================
   Kit — shared helpers for slide builders. Reuse before inventing.
   All timeline helpers take (tl, targets, opts) and respect opts.at (GSAP position param).
   ========================================================================== */
(function () {
  'use strict';
  var Kit = (window.Kit = {});

  Kit.ease = { out: 'expo.out', soft: 'power2.out', inOut: 'power3.inOut', back: 'back.out(1.6)' };
  Kit.color = {
    red: '#EE3538', orange: '#EF5A35', magenta: '#B656A0', purple: '#9A4198', green: '#53B754',
    blue: '#4D6BB1', sky: '#518CC8', cobalt: '#286EA8', navy: '#4053A1', teal: '#2C8C7E', charcoal: '#353032',
    // text-safe tints on dark
    redT: '#FF7A7C', orangeT: '#FF8A66', magentaT: '#E08FCB', purpleT: '#CC8AD0', greenT: '#84D484',
    blueT: '#94AEE6', skyT: '#8EC0F0', tealT: '#62CDBB',
    bg: '#1E1B1C', bg2: '#2A2627', surface: '#353032', line: '#4A4345', text: '#F4EFEA', text2: '#C9C0BA', text3: '#9A908A'
  };

  Kit.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /** Source footer. text may contain <em>. flag: e.g. 'Self-reported' */
  Kit.src = function (text, flag) {
    return '<div class="src">' + (flag ? '<span class="flag">' + Kit.esc(flag) + '</span>&nbsp;&nbsp;' : '') + text + '</div>';
  };

  /** "Where we are" marker, top-right of a content slide: steps = ['Booking chance', 'Price', …], cur = 0-based index.
      Ties a technique slide back to the section's roadmap. Static on purpose: it orients, it does not teach. */
  Kit.crumbs = function (steps, cur) {
    return '<div class="crumbs">' + steps.map(function (t, i) {
      return (i ? '<i>→</i>' : '') + '<span class="cr' + (i === cur ? ' on' : '') + '"><b>' + (i + 1) + '</b>' + Kit.esc(t) + '</span>';
    }).join('') + '</div>';
  };
  /** Wrap a slide def so its html also renders Kit.crumbs(steps, cur). Returns the def. */
  Kit.withCrumbs = function (def, steps, cur) {
    var h = def.html;
    def.html = function (ctx) { return (typeof h === 'function' ? h(ctx) : (h || '')) + Kit.crumbs(steps, cur); };
    return def;
  };

  /** Slanted panels (inspo motif). items: [{x,y,w,h,color,opacity,glass,cls}] → HTML string */
  Kit.panels = function (items) {
    return items.map(function (p) {
      return '<div class="panel' + (p.glass === false ? '' : ' glass') + (p.cls ? ' ' + p.cls : '') + '" style="left:' + p.x + 'px;top:' + p.y +
        'px;width:' + p.w + 'px;height:' + p.h + 'px;background:' + p.color + (p.opacity != null ? ';opacity:' + p.opacity : '') + '"></div>';
    }).join('');
  };

  /** Standard entrance: rise + fade. */
  Kit.rise = function (tl, targets, o) {
    o = o || {};
    return tl.from(targets, { y: o.y != null ? o.y : 36, autoAlpha: 0, duration: o.duration || .7, ease: o.ease || Kit.ease.out,
      stagger: o.stagger != null ? o.stagger : .08 }, o.at);
  };
  /** Show an element that starts hidden (fromTo, so it is safe for elements hidden by default). */
  Kit.show = function (tl, targets, o) {
    o = o || {};
    return tl.fromTo(targets, { autoAlpha: 0, y: o.y != null ? o.y : 28 },
      { autoAlpha: 1, y: 0, duration: o.duration || .6, ease: o.ease || Kit.ease.out, stagger: o.stagger || 0 }, o.at);
  };
  /** Fade only. */
  Kit.fade = function (tl, targets, o) {
    o = o || {};
    return tl.from(targets, { autoAlpha: 0, duration: o.duration || .5, ease: o.ease || 'power1.out', stagger: o.stagger || 0 }, o.at);
  };
  /** Slanted panel wipe-in from the right (signature motion). */
  Kit.slideIn = function (tl, targets, o) {
    o = o || {};
    return tl.from(targets, { x: o.x != null ? o.x : 420, autoAlpha: 0, duration: o.duration || .9, ease: o.ease || Kit.ease.out,
      stagger: o.stagger != null ? o.stagger : .07 }, o.at);
  };
  /** Swap: fade out a, fade in b at the same spot. */
  Kit.swap = function (tl, a, b, o) {
    o = o || {};
    tl.to(a, { autoAlpha: 0, y: -16, duration: .3, ease: 'power1.in' }, o.at);
    return tl.fromTo(b, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, ease: Kit.ease.out }, '>-0.05');
  };

  /** Count a number up inside el. o: {from,to,decimals,prefix,suffix,duration,at,ease} */
  Kit.count = function (tl, el, o) {
    var obj = { v: o.from || 0 }, d = o.decimals || 0;
    var fmt = function (v) {
      var s = v.toFixed(d);
      if (o.commas) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (o.prefix || '') + s + (o.suffix || '');
    };
    el.textContent = fmt(obj.v);
    return tl.to(obj, { v: o.to, duration: o.duration || 1.2, ease: o.ease || 'power2.out',
      onUpdate: function () { el.textContent = fmt(obj.v); } }, o.at);
  };

  /** Draw SVG strokes (uses DrawSVGPlugin). */
  Kit.draw = function (tl, targets, o) {
    o = o || {};
    return tl.from(targets, { drawSVG: '0%', duration: o.duration || .9, ease: o.ease || 'power2.inOut', stagger: o.stagger || 0 }, o.at);
  };

  /** Convert a pointer event to SVG user coordinates (robust to stage scaling). */
  Kit.svgPoint = function (svg, evt) {
    var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  /** Simple horizontal drag on an SVG element. onMove(xSvg). Returns detach fn. */
  Kit.dragX = function (svg, handle, onMove, onEnd) {
    var dragging = false;
    var down = function (e) { dragging = true; handle.setPointerCapture && handle.setPointerCapture(e.pointerId); e.preventDefault(); e.stopPropagation(); };
    var move = function (e) { if (!dragging) return; onMove(Kit.svgPoint(svg, e).x); };
    var up = function () { if (dragging && onEnd) onEnd(); dragging = false; };
    handle.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return function () { handle.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  };

  if (window.gsap) {
    var plug = [];
    ['DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'SplitText', 'CustomEase', 'Draggable'].forEach(function (n) { if (window[n]) plug.push(window[n]); });
    gsap.registerPlugin.apply(gsap, plug);
    gsap.defaults({ overwrite: 'auto' });
  }
})();
