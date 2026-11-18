/* ==========================================================================
   Kit — shared helpers for slide builders. Reuse before inventing.
   All timeline helpers take (tl, targets, opts) and respect opts.at (GSAP position param).
   ========================================================================== */
(function () {
  'use strict';
  var Kit = (window.Kit = {});

  Kit.ease = { out: 'expo.out', soft: 'power2.out', inOut: 'power3.inOut', back: 'back.out(1.6)' };
  /* Kit.color mirrors the palette tokens in css/theme.css, so a palette swap there reaches SVG/JS colors too.
     Fallbacks are deck 1's values. Text-safe tints are <name>T (e.g. Kit.color.redT). */
  Kit.color = (function () {
    var fallback = {
      teal: '#2F7A74', olive: '#8A9A4B', saffron: '#E2A43B', cranberry: '#A8443A', plum: '#7E4E6B', rust: '#D2643A',
      orange: '#D2643A', charcoal: '#33383C',
      tealT: '#79C7BC', oliveT: '#BCCB7C', saffronT: '#F2C46E', cranberryT: '#E58A7E', plumT: '#C99BB7', rustT: '#F08A5D', orangeT: '#F08A5D',
      bg: '#2A2E31', bg2: '#33383C', surface: '#383E42', line: '#545B60', text: '#F3EBDD', text2: '#CFC6B8', text3: '#A39C91', chalk: '#F3EBDD'
    };
    var css = getComputedStyle(document.documentElement), out = {};
    Object.keys(fallback).forEach(function (k) {
      var name = k.replace(/T$/, '-t').replace(/(\D)2$/, '$1-2').replace(/(\D)3$/, '$1-3');
      out[k] = css.getPropertyValue('--' + name).trim() || fallback[k];
    });
    return out;
  })();

  Kit.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /** Source footer. text may contain <em>. flag: e.g. 'Self-reported' */
  Kit.src = function (text, flag) {
    return '<div class="src">' + (flag ? '<span class="flag">' + Kit.esc(flag) + '</span>&nbsp;&nbsp;' : '') + text + '</div>';
  };

  /** "Where we are" marker, top-right of a content slide: steps = ['Step one', 'Step two', …], cur = 0-based index, or an array of indices to light several steps.
      Ties a technique slide back to the section's roadmap. Static on purpose: it orients, it does not teach. */
  Kit.crumbs = function (steps, cur) {
    var on = [].concat(cur);
    return '<div class="crumbs">' + steps.map(function (t, i) {
      return (i ? '<i>→</i>' : '') + '<span class="cr' + (on.indexOf(i) >= 0 ? ' on' : '') + '"><b>' + (i + 1) + '</b>' + Kit.esc(t) + '</span>';
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


  /* ---------------- deck 2: hand-drawn strokes (rough.js) ----------------
     Kit.rough.* return SVG markup strings (one or more <path class="rp">), so they work inside html() templates.
     Every call takes o.seed (default derived from the shape) so a shape looks the same on every render and in print.
     Common opts: stroke (default chalk), sw (stroke width, default 3), rough (roughness, default 1.1), bow (bowing, default 1),
     fill (hachure fill color, optional), fillStyle ('hachure'|'solid'|'zigzag'|'cross-hatch'), cls (extra class), attrs (raw attr string).
     Animate them on with Kit.draw(tl, el.querySelectorAll('.rp')). */
  var _gen = null;
  function gen() { if (!_gen && window.rough) _gen = window.rough.generator(); return _gen; }
  function _seed(o, k) { if (o.seed != null) return o.seed; var h = 7; for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 2147483; return h + 1; }
  function _opts(o, key) {
    return { seed: _seed(o, key), roughness: o.rough != null ? o.rough : 1.1, bowing: o.bow != null ? o.bow : 1,
      stroke: o.stroke || Kit.color.chalk, strokeWidth: o.sw || 3, fill: o.fill, fillStyle: o.fillStyle || 'hachure',
      fillWeight: o.fillWeight || 2, hachureGap: o.hachureGap || 9, hachureAngle: o.hachureAngle != null ? o.hachureAngle : -41,
      disableMultiStroke: o.single !== false, preserveVertices: true };
  }
  function _paths(drawable, o) {
    var g = gen(); if (!g) return '';
    return g.toPaths(drawable).map(function (p) {
      var isFill = p.fill && p.fill !== 'none' && (!p.stroke || p.stroke === 'none');
      return '<path class="rp' + (isFill ? ' rp-fill' : '') + (o.cls ? ' ' + o.cls : '') + '" d="' + p.d + '" stroke="' + (p.stroke || 'none') +
        '" stroke-width="' + p.strokeWidth + '" fill="' + (isFill ? p.fill : 'none') + '"' + (o.attrs ? ' ' + o.attrs : '') + '/>';
    }).join('');
  }
  Kit.rough = {
    line: function (x1, y1, x2, y2, o) { o = o || {}; return gen() ? _paths(gen().line(x1, y1, x2, y2, _opts(o, 'l' + x1 + y1 + x2 + y2)), o) : ''; },
    rect: function (x, y, w, h, o) { o = o || {}; return gen() ? _paths(gen().rectangle(x, y, w, h, _opts(o, 'r' + x + y + w + h)), o) : ''; },
    ellipse: function (cx, cy, w, h, o) { o = o || {}; return gen() ? _paths(gen().ellipse(cx, cy, w, h, _opts(o, 'e' + cx + cy + w + h)), o) : ''; },
    circle: function (cx, cy, d, o) { o = o || {}; return gen() ? _paths(gen().circle(cx, cy, d, _opts(o, 'c' + cx + cy + d)), o) : ''; },
    path: function (d, o) { o = o || {}; return gen() ? _paths(gen().path(d, _opts(o, 'p' + d)), o) : ''; },
    curve: function (pts, o) { o = o || {}; return gen() ? _paths(gen().curve(pts, _opts(o, 'v' + pts.join())), o) : ''; },
    /** Arrow from (x1,y1) to (x2,y2); o.bend bends it (px, + = left of travel); head size o.head (default 22). */
    arrow: function (x1, y1, x2, y2, o) {
      o = o || {}; var bend = o.bend || 0, head = o.head || 22;
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var cx = mx - dy / L * bend, cy = my + dx / L * bend;
      var body = Kit.rough.path('M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2, o);
      var ang = Math.atan2(y2 - cy, x2 - cx), a1 = ang + Math.PI * 0.82, a2 = ang - Math.PI * 0.82;
      var hd = 'M' + (x2 + Math.cos(a1) * head) + ' ' + (y2 + Math.sin(a1) * head) + ' L' + x2 + ' ' + y2 + ' L' + (x2 + Math.cos(a2) * head) + ' ' + (y2 + Math.sin(a2) * head);
      return body + Kit.rough.path(hd, Object.assign({}, o, { seed: _seed(o, 'h' + x2 + y2) }));
    }
  };

  /** Photo markup. src under assets/img/…; o: {x,y,w,h?,rot,cls,framed,alt}. Cut-outs are transparent PNGs; framed photos get a card shadow. */
  Kit.photo = function (src, o) {
    o = o || {};
    return '<img class="photo' + (o.framed ? ' framed' : '') + (o.cls ? ' ' + o.cls : '') + '" src="' + src + '" alt="' + Kit.esc(o.alt || '') +
      '" style="left:' + o.x + 'px;top:' + o.y + 'px;width:' + o.w + 'px;' + (o.h ? 'height:' + o.h + 'px;' : '') +
      (o.rot ? 'transform:rotate(' + o.rot + 'deg);' : '') + '">';
  };
  /** Signature motion: a photo drops onto the slate (falls a little, settles with a slight tilt). Safe on hidden elements (fromTo).
      o: {at, stagger, rot (final rotation, default keeps CSS), from (start y offset, default -70)} */
  Kit.drop = function (tl, targets, o) {
    o = o || {};
    var to = { autoAlpha: 1, y: 0, scale: 1, duration: o.duration || .75, ease: o.ease || 'back.out(1.4)', stagger: o.stagger || 0 };
    if (o.rot != null) to.rotation = o.rot;
    return tl.fromTo(targets, { autoAlpha: 0, y: o.from != null ? o.from : -70, scale: 1.06 }, to, o.at);
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
