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

    /* No source text on slides in this deck (Rey, Nov 2026): sources live in the References appendix, caveats in the notes.
     Kept as a no-op so an old call cannot put a footer back. */
  Kit.src = function () { return ''; };

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
     Kit.rough.* return SVG markup strings (<path class="rp">), so they work inside html() templates.
     Every call takes o.seed (default derived from the shape) so a shape looks the same on every render and in print.
     Opts: w ('heavy' 7 | 'normal' 4 | 'fine' 2 px; default normal) or sw (explicit px, wins over w),
       stroke (default chalk; any CSS color incl. 'var(--sec-t)'), rough (roughness, default 1.1, scaled by Kit.SKETCH),
       bow (bowing), fill + fillStyle ('hachure'|'solid'|'zigzag'|'cross-hatch'), cls, attrs (raw attr string),
       sketch:false (one clean pass, no ghost stroke), ghostOpacity.
     Doodle look: each shape is drawn twice, a main pass plus a thinner, looser, half-transparent "ghost" pass (class rp-ghost).
     Animate with Kit.draw(tl, el.querySelectorAll('.rp')) — ghost passes draw on with the main ones. */
  Kit.SKETCH = { rough: 2.1, bow: 2.4, ghostW: .6, ghostOpacity: .75, ghostRough: 1.9, overshoot: 14 };
  Kit.W = { heavy: 9, normal: 5, fine: 2.5 };
  var _gen = null;
  function gen() { if (!_gen && window.rough) _gen = window.rough.generator(); return _gen; }
  function _seed(o, k) { if (o.seed != null) return o.seed; var h = 7; for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 2147483; return h + 1; }
  function rnd2(seed) { seed = (seed % 2147483646) + 1; return function () { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }; }
  function _f(n) { return Math.round(n * 10) / 10; }
  function _sw(o) { return o.sw || Kit.W[o.w] || Kit.W.normal; }
  function _opts(o, key) {
    var r = (o.rough != null ? o.rough : 1.1) * Kit.SKETCH.rough;
    return { seed: _seed(o, key), roughness: r, bowing: o.bow != null ? o.bow : Kit.SKETCH.bow,
      stroke: '#000', strokeWidth: _sw(o), fill: o.fill, fillStyle: o.fillStyle || 'hachure',
      fillWeight: o.fillWeight || 2.2, hachureGap: o.hachureGap || 14, hachureAngle: o.hachureAngle != null ? o.hachureAngle : -41,
      disableMultiStroke: true, preserveVertices: true, curveFitting: .9 };
  }
  function _paths(drawable, o, ghost) {
    var g = gen(); if (!g) return '';
    var stroke = o.stroke || Kit.color.chalk;
    return g.toPaths(drawable).map(function (p) {
      var isFill = p.fill && p.fill !== 'none' && (!p.stroke || p.stroke === 'none');
      // hachure / zigzag fill lines come back as strokes in the fill color (the outline uses the '#000' sentinel)
      if (!isFill && (!p.stroke || p.stroke === 'none')) return '';
      var isHatch = !isFill && p.stroke !== '#000';
      if (ghost && (isFill || isHatch)) return '';
      var col = isHatch ? p.stroke : stroke, colVar = col.indexOf('var(') === 0;
      // CSS vars can't go in presentation attributes: write them as inline style (with a chalk attribute fallback).
      var strokeAttr = isFill ? 'none' : (colVar ? Kit.color.chalk : col);
      return '<path class="rp' + (isFill ? ' rp-fill' : '') + (isHatch ? ' rp-hatch' : '') + (ghost ? ' rp-ghost' : '') + (o.cls ? ' ' + o.cls : '') + '" d="' + p.d +
        '" stroke="' + strokeAttr + '"' + (colVar && !isFill ? ' style="stroke:' + col + '"' : '') +
        (isHatch ? ' opacity="' + (o.fillOpacity != null ? o.fillOpacity : .35) + '"' : '') +
        ' stroke-width="' + p.strokeWidth + '" fill="' + (isFill ? p.fill : 'none') + '"' +
        (o.attrs ? ' ' + o.attrs : '') + '/>';
    }).join('');
  }
  /** Draw a shape: main pass + ghost pass. make(opts) returns a rough drawable. */
  function _shape(o, key, make) {
    var g = gen(); if (!g) return '';
    var main = _paths(make(_opts(o, key)), o);
    if (o.sketch === false || _sw(o) < 1.6) return main;
    var go = _opts(o, key);
    go.seed = go.seed + 101; go.roughness = go.roughness * Kit.SKETCH.ghostRough; go.strokeWidth = Math.max(1.2, _sw(o) * Kit.SKETCH.ghostW);
    go.fill = undefined;
    var ghost = _paths(make(go), o, true);
    var op = o.ghostOpacity != null ? o.ghostOpacity : Kit.SKETCH.ghostOpacity;
    return main + ghost.replace(/<path /g, '<path opacity="' + op + '" ');
  }
  Kit.rough = {
    line: function (x1, y1, x2, y2, o) {
      o = o || {}; var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      if (o.bow == null && len > 220) o = Object.assign({}, o, { bow: Kit.SKETCH.bow * 220 / len });   // long strokes stay straight-ish
      return _shape(o, 'l' + x1 + y1 + x2 + y2, function (op) { return gen().line(x1, y1, x2, y2, op); });
    },
    /** Rectangle drawn as 4 separate strokes whose ends overshoot the corners (o.overshoot px, default Kit.SKETCH.overshoot;
        0 = closed rough.js rectangle). o.fill / o.hatch:true add a hachure shading inside (o.fillOpacity, default .35). */
    rect: function (x, y, w, h, o) {
      o = o || {}; var key = 'r' + x + y + w + h, sd = _seed(o, key);
      var fill = o.fill || (o.hatch ? (o.hatch === true ? (o.stroke || Kit.color.chalk) : o.hatch) : null), out = '';
      if (fill) out += _paths(gen().rectangle(x, y, w, h, Object.assign(_opts(o, key), { fill: fill, stroke: 'none', strokeWidth: 0 })), o);
      var e = o.overshoot != null ? o.overshoot : Kit.SKETCH.overshoot;
      if (!e) return out + _shape(Object.assign({}, o, { fill: undefined }), key, function (op) { return gen().rectangle(x, y, w, h, op); });
      var r = rnd2(sd), J = function (k) { return (r() - .3) * k; };
      var L = function (x1, y1, x2, y2, k) { return Kit.rough.line(_f(x1), _f(y1), _f(x2), _f(y2), Object.assign({}, o, { fill: undefined, hatch: undefined, seed: sd + k })); };
      return out +
        L(x - e * .6 - J(e), y + J(4), x + w + J(e), y + J(5), 1) +
        L(x + w + J(4), y - J(e) * .7, x + w + J(5), y + h + e * .5 + J(e), 2) +
        L(x + w + e * .5 + J(e), y + h + J(4), x - J(e), y + h + J(5), 3) +
        L(x + J(4), y + h + e * .6 + J(e), x + J(5), y - e * .4 - J(e), 4);
    },
    ellipse: function (cx, cy, w, h, o) { o = o || {}; return _shape(o, 'e' + cx + cy + w + h, function (op) { return gen().ellipse(cx, cy, w, h, op); }); },
    circle: function (cx, cy, d, o) { o = o || {}; return _shape(o, 'c' + cx + cy + d, function (op) { return gen().circle(cx, cy, d, op); }); },
    path: function (d, o) { o = o || {}; return _shape(o, 'p' + d, function (op) { return gen().path(d, op); }); },
    curve: function (pts, o) { o = o || {}; return _shape(o, 'v' + pts.join(), function (op) { return gen().curve(pts, op); }); },
    linear: function (pts, o) { o = o || {}; return _shape(o, 'n' + pts.join(), function (op) { return gen().linearPath(pts, op); }); },
    /** Arrow from (x1,y1) to (x2,y2); o.bend bends it (px, + = left of travel); head size o.head (default 22 + weight). */
    arrow: function (x1, y1, x2, y2, o) {
      o = o || {}; var bend = o.bend || 0, head = o.head || (16 + _sw(o) * 2);
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var cx = mx - dy / L * bend, cy = my + dx / L * bend;
      var body = Kit.rough.path('M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2, o);
      var ang = Math.atan2(y2 - cy, x2 - cx), a1 = ang + Math.PI * 0.8, a2 = ang - Math.PI * 0.84;
      var hd = 'M' + (x2 + Math.cos(a1) * head) + ' ' + (y2 + Math.sin(a1) * head) + ' L' + x2 + ' ' + y2 + ' L' + (x2 + Math.cos(a2) * head * 1.1) + ' ' + (y2 + Math.sin(a2) * head * 1.1);
      return body + Kit.rough.path(hd, Object.assign({}, o, { seed: _seed(o, 'h' + x2 + y2) }));
    }
  };

  /* ---------------- deck 2: doodles ----------------
     Kit.doodle.* return SVG markup (rough paths, class "rp dd") for margin doodles that POINT AT the focal thing:
     circle it, underline it, sparkle beside it, steam over a dish, tape a photo down. 1–3 per slide; never behind teaching content.
     Default color is the section tint (var(--sec-t)); pass color:'var(--rust-t)' (or Kit.color.rustT) for the focus accent.
     Common opts: seed, color, w ('heavy'|'normal'|'fine'), rot (deg, about the doodle's center). Animate with Kit.draw like any .rp. */
  function _dd(o, def) { o = Object.assign({ w: def || 'normal' }, o || {}); o.stroke = o.color || o.stroke || 'var(--sec-t)'; o.cls = 'dd' + (o.cls ? ' ' + o.cls : ''); return o; }
  function _rot(markup, o, cx, cy) { return o.rot ? '<g transform="rotate(' + o.rot + ' ' + cx + ' ' + cy + ')">' + markup + '</g>' : markup; }
  Kit.doodle = {
    /** Five-point star centered at (cx,cy), radius r. */
    star: function (cx, cy, r, o) {
      o = _dd(o); var pts = [];
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; pts.push([_f(cx + Math.cos(a) * rr), _f(cy + Math.sin(a) * rr)]); }
      pts.push(pts[0]);
      return _rot(Kit.rough.linear(pts, o), o, cx, cy);
    },
    /** Four-point twinkle, plus two small dots of chalk dust. */
    sparkle: function (cx, cy, r, o) {
      o = _dd(o); var k = r * .18;
      var d = 'M' + cx + ' ' + (cy - r) + ' Q' + (cx + k) + ' ' + (cy - k) + ' ' + (cx + r) + ' ' + cy + ' Q' + (cx + k) + ' ' + (cy + k) + ' ' + cx + ' ' + (cy + r) +
        ' Q' + (cx - k) + ' ' + (cy + k) + ' ' + (cx - r) + ' ' + cy + ' Q' + (cx - k) + ' ' + (cy - k) + ' ' + cx + ' ' + (cy - r);
      return _rot(Kit.rough.path(d, o) +
        Kit.rough.circle(cx + r * 1.15, cy - r * .9, Math.max(5, r * .14), Object.assign({}, o, { sketch: false, seed: (o.seed || 3) + 7 })), o, cx, cy);
    },
    /** Little "+" sparkles: a cluster of 3 crosses around (cx,cy). */
    twinkles: function (cx, cy, r, o) {
      o = _dd(o, 'fine'); var out = '', P = [[0, 0, 1], [r * 1.1, -r * .7, .6], [r * .5, r * .9, .45]];
      P.forEach(function (p, i) { var s = r * .45 * p[2], x = cx + p[0], y = cy + p[1];
        out += Kit.rough.line(x - s, y, x + s, y, Object.assign({}, o, { seed: (o.seed || 5) + i * 2 })) + Kit.rough.line(x, y - s, x, y + s, Object.assign({}, o, { seed: (o.seed || 5) + i * 2 + 1 })); });
      return out;
    },
    /** Wavy line from x to x+w at height y. o.amp (default 12), o.waves (default w/60). */
    squiggle: function (x, y, w, o) {
      o = _dd(o); var amp = o.amp || 12, n = o.waves || Math.max(2, Math.round(w / 60)), pts = [];
      for (var i = 0; i <= n * 4; i++) pts.push([_f(x + w * i / (n * 4)), _f(y + Math.sin(i * Math.PI / 2) * amp)]);
      return Kit.rough.curve(pts, o);
    },
    /** Hand underline under a word: a slightly rising stroke that doubles back (x..x+w at y). */
    underline: function (x, y, w, o) {
      o = _dd(o, 'heavy'); var r = o.seed || 11;
      return Kit.rough.curve([[x, y + 4], [x + w * .5, y - 3], [x + w, y - 6], [x + w * .82, y + 6], [x + w * .25, y + 10]], Object.assign({ rough: .6 }, o, { seed: r }));
    },
    /** Loose loop around a box (x,y,w,h): overshoots past its start, like circling something on a page. */
    circle: function (x, y, w, h, o) {
      // an ellipse through the box corners has radii w/2·√2, h/2·√2; pad adds breathing room on top
      o = _dd(o); var pad = o.pad != null ? o.pad : 14, cx = x + w / 2, cy = y + h / 2, rx = Math.min(w / 2 * 1.3, w / 2 + 40) + pad, ry = Math.min(h / 2 * 1.3, h / 2 + 30) + pad, pts = [];
      var a0 = -2.3, turns = 1.12, n = 28, s = o.seed || 13;
      for (var i = 0; i <= n; i++) { var a = a0 + i / n * Math.PI * 2 * turns, j = 1 + .05 * Math.sin(i * 1.7 + s) - (i / n) * .06;
        pts.push([_f(cx + Math.cos(a) * rx * j), _f(cy + Math.sin(a) * ry * j)]); }
      return Kit.rough.curve(pts, Object.assign({ rough: .5 }, o));
    },
    /** Steam over a dish: n wavy rising lines starting at (x,y) baseline, h tall. */
    steam: function (x, y, h, o) {
      o = _dd(o); var n = o.n || 3, gap = o.gap || 34, out = '';
      for (var k = 0; k < n; k++) { var bx = x + (k - (n - 1) / 2) * gap, hh = h * (k === (n - 1) / 2 ? 1 : .78), pts = [];
        for (var i = 0; i <= 6; i++) pts.push([_f(bx + Math.sin(i * 1.3 + k) * 10), _f(y - hh * i / 6)]);
        out += Kit.rough.curve(pts, Object.assign({}, o, { seed: (o.seed || 17) + k })); }
      return out;
    },
    /** Motion swoosh: 3 parallel arcs trailing behind a point moving from (x1,y1) toward (x2,y2). */
    swoosh: function (x1, y1, x2, y2, o) {
      o = _dd(o, 'fine'); var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L, ny = dx / L, out = '';
      [-1, 0, 1].forEach(function (k, i) { var off = k * 16, sh = Math.abs(k) * .22;
        out += Kit.rough.path('M' + _f(x1 + nx * off + dx * sh) + ' ' + _f(y1 + ny * off + dy * sh) + ' Q' + _f((x1 + x2) / 2 + nx * (off + 22)) + ' ' + _f((y1 + y2) / 2 + ny * (off + 22)) + ' ' + _f(x2 + nx * off) + ' ' + _f(y2 + ny * off),
          Object.assign({}, o, { seed: (o.seed || 19) + i })); });
      return out;
    },
    /** Starburst: n short rays around a circle of radius r (emphasis "pop"). */
    burst: function (cx, cy, r, o) {
      o = _dd(o); var n = o.n || 9, out = '';
      for (var i = 0; i < n; i++) { var a = (o.from != null ? o.from : 0) + i / n * Math.PI * 2, r1 = r, r2 = r + (o.len || r * .45) * (i % 2 ? .7 : 1);
        out += Kit.rough.line(_f(cx + Math.cos(a) * r1), _f(cy + Math.sin(a) * r1), _f(cx + Math.cos(a) * r2), _f(cy + Math.sin(a) * r2), Object.assign({}, o, { seed: (o.seed || 23) + i })); }
      return out;
    },
    /** Rays on one side only (like "!" marks): k rays fanning out from (cx,cy) toward angle deg. */
    rays: function (cx, cy, r, deg, o) {
      o = _dd(o); var out = '', base = deg * Math.PI / 180;
      [-.5, 0, .5].forEach(function (d, i) { var a = base + d;
        out += Kit.rough.line(_f(cx + Math.cos(a) * r), _f(cy + Math.sin(a) * r), _f(cx + Math.cos(a) * (r + (o.len || 34) * (i === 1 ? 1.2 : 1))), _f(cy + Math.sin(a) * (r + (o.len || 34) * (i === 1 ? 1.2 : 1))), Object.assign({}, o, { seed: (o.seed || 29) + i })); });
      return out;
    },
    /** Heart (use sparingly). */
    heart: function (cx, cy, s, o) {
      o = _dd(o);
      var d = 'M' + cx + ' ' + (cy + s * .9) + ' C' + (cx - s * 1.5) + ' ' + (cy - s * .1) + ' ' + (cx - s * .6) + ' ' + (cy - s * 1.1) + ' ' + cx + ' ' + (cy - s * .35) +
        ' C' + (cx + s * .6) + ' ' + (cy - s * 1.1) + ' ' + (cx + s * 1.5) + ' ' + (cy - s * .1) + ' ' + cx + ' ' + (cy + s * .9);
      return _rot(Kit.rough.path(d, o), o, cx, cy);
    },
    /** Loopy arrow: travels from (x1,y1) to (x2,y2) with one curl in the middle. */
    loopArrow: function (x1, y1, x2, y2, o) {
      o = _dd(o); var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, r = o.loop || 26, up = o.flip ? 1 : -1;
      var pts = [[x1, y1], [mx - r * 1.6, my + up * r * .2], [mx, my + up * r * 1.6], [mx + r * .9, my + up * r * .6], [mx - r * .4, my - up * r * .3], [mx + r * 1.8, my + up * r * .1], [x2, y2]];
      var g = Kit.rough.curve(pts.map(function (p) { return [_f(p[0]), _f(p[1])]; }), o);
      var ang = Math.atan2(y2 - (my + up * r * .1), x2 - (mx + r * 1.8)), h = o.head || 22;
      var hd = 'M' + _f(x2 + Math.cos(ang + 2.5) * h) + ' ' + _f(y2 + Math.sin(ang + 2.5) * h) + ' L' + x2 + ' ' + y2 + ' L' + _f(x2 + Math.cos(ang - 2.5) * h) + ' ' + _f(y2 + Math.sin(ang - 2.5) * h);
      return g + Kit.rough.path(hd, Object.assign({}, o, { seed: (o.seed || 31) + 5 }));
    },
    /** Loose sketch frame around a box or photo: two offset, overshooting rectangles. */
    outline: function (x, y, w, h, o) {
      o = _dd(o, 'fine'); var p = o.pad != null ? o.pad : 14;
      return Kit.rough.linear([[x - p - 10, y - p], [x + w + p, y - p + 3], [x + w + p - 2, y + h + p], [x - p, y + h + p - 2], [x - p + 2, y - p - 12]], Object.assign({ rough: 1.2 }, o));
    },
    /** Strip of masking tape (translucent fill + rough outline), centered (cx,cy), length L, rotated rot. */
    tape: function (cx, cy, L, o) {
      o = _dd(o, 'fine'); var h = o.h || 38, x = cx - L / 2, y = cy - h / 2, z = 6;
      var d = 'M' + x + ' ' + y + ' L' + (x + L) + ' ' + y + ' L' + (x + L - z) + ' ' + (y + h * .33) + ' L' + (x + L) + ' ' + (y + h * .66) + ' L' + (x + L - z) + ' ' + (y + h) +
        ' L' + x + ' ' + (y + h) + ' L' + (x + z) + ' ' + (y + h * .66) + ' L' + x + ' ' + (y + h * .33) + ' Z';
      var fillCol = o.fill || 'rgba(236,214,170,.62)';   // warm masking tape; works on framed photos (on a transparent cut-out, put it where the photo is opaque)
      return _rot('<path class="dd-tape" d="' + d + '" fill="' + fillCol + '" stroke="none"/>' + Kit.rough.path(d, Object.assign({ rough: .5, sketch: false }, o)), Object.assign({ rot: -8 }, o), cx, cy);
    },
    /** Small chalk "x" or check mark. kind: 'x' | 'check'. */
    mark: function (cx, cy, s, kind, o) {
      o = _dd(o, 'heavy');
      if (kind === 'check') return Kit.rough.linear([[cx - s, cy], [cx - s * .3, cy + s * .7], [cx + s, cy - s * .8]], o);
      return Kit.rough.line(cx - s, cy - s, cx + s, cy + s, o) + Kit.rough.line(cx + s, cy - s, cx - s, cy + s, Object.assign({}, o, { seed: (o.seed || 37) + 1 }));
    },
    /* ---- little food doodles for margins (s = rough size in px, ~60–140). Each takes rot. ---- */
    /** Spoon, bowl up-left, handle down-right. */
    spoon: function (cx, cy, s, o) {
      o = _dd(o); return _rot(Kit.rough.ellipse(cx, cy - s * .3, s * .42, s * .58, Object.assign({}, o, { seed: (o.seed || 51) })) +
        Kit.rough.curve([[cx, cy - s * .01], [cx - s * .03, cy + s * .3], [cx + s * .02, cy + s * .62]], Object.assign({}, o, { seed: (o.seed || 51) + 1 })), Object.assign({ rot: 30 }, o), cx, cy);
    },
    /** Fork: handle plus four tines. */
    fork: function (cx, cy, s, o) {
      o = _dd(o); var out = Kit.rough.line(cx, cy - s * .05, cx, cy + s * .6, Object.assign({}, o, { seed: (o.seed || 53) }));
      out += Kit.rough.path('M' + (cx - s * .18) + ' ' + (cy - s * .55) + ' L' + (cx - s * .18) + ' ' + (cy - s * .15) + ' Q' + cx + ' ' + (cy + s * .05) + ' ' + (cx + s * .18) + ' ' + (cy - s * .15) + ' L' + (cx + s * .18) + ' ' + (cy - s * .55), Object.assign({}, o, { seed: (o.seed || 53) + 1 }));
      [-.06, .06].forEach(function (k, i) { out += Kit.rough.line(cx + s * k, cy - s * .55, cx + s * k, cy - s * .12, Object.assign({}, o, { w: 'fine', seed: (o.seed || 53) + 2 + i })); });
      return _rot(out, Object.assign({ rot: 20 }, o), cx, cy);
    },
    /** Whisk: handle and three wire loops. */
    whisk: function (cx, cy, s, o) {
      o = _dd(o); var out = Kit.rough.line(cx, cy + s * .15, cx, cy + s * .65, Object.assign({}, o, { seed: (o.seed || 57) }));
      [.12, .24, .34].forEach(function (k, i) {
        out += Kit.rough.path('M' + (cx - s * .04) + ' ' + (cy + s * .15) + ' C' + (cx - s * k * 1.6) + ' ' + (cy - s * .2) + ' ' + (cx - s * k) + ' ' + (cy - s * .62) + ' ' + cx + ' ' + (cy - s * .62) +
          ' C' + (cx + s * k) + ' ' + (cy - s * .62) + ' ' + (cx + s * k * 1.6) + ' ' + (cy - s * .2) + ' ' + (cx + s * .04) + ' ' + (cy + s * .15), Object.assign({}, o, { w: i ? 'fine' : o.w, seed: (o.seed || 57) + 1 + i }));
      });
      return _rot(out, Object.assign({ rot: 25 }, o), cx, cy);
    },
    /** Herb sprig: a curved stem with leaves. */
    sprig: function (cx, cy, s, o) {
      o = _dd(o); var out = Kit.rough.curve([[cx - s * .1, cy + s * .55], [cx, cy], [cx + s * .12, cy - s * .55]], Object.assign({}, o, { seed: (o.seed || 61) }));
      [[-.04, .3, -1], [.02, .02, 1], [.06, -.28, -1], [.1, -.5, 1]].forEach(function (L, i) {
        var bx = cx + s * L[0], by = cy + s * L[1], d = L[2], tx = bx + d * s * .36, ty = by - s * .16;
        out += Kit.rough.path('M' + bx + ' ' + by + ' Q' + (bx + d * s * .12) + ' ' + (by - s * .22) + ' ' + tx + ' ' + ty + ' Q' + (bx + d * s * .26) + ' ' + (by + s * .04) + ' ' + bx + ' ' + by,
          Object.assign({}, o, { w: 'fine', seed: (o.seed || 61) + 1 + i }));
      });
      return _rot(out, o, cx, cy);
    },
    /** Carrot: tapered root with a leafy top. */
    carrot: function (cx, cy, s, o) {
      o = _dd(o); var out = Kit.rough.path('M' + (cx - s * .16) + ' ' + (cy - s * .3) + ' Q' + (cx - s * .12) + ' ' + (cy + s * .2) + ' ' + cx + ' ' + (cy + s * .6) + ' Q' + (cx + s * .12) + ' ' + (cy + s * .2) + ' ' + (cx + s * .16) + ' ' + (cy - s * .3) + ' Z', Object.assign({}, o, { seed: (o.seed || 67) }));
      out += Kit.rough.line(cx - s * .1, cy - s * .05, cx - s * .02, cy - s * .02, Object.assign({}, o, { w: 'fine', seed: (o.seed || 67) + 1 }));
      out += Kit.rough.line(cx + s * .02, cy + s * .2, cx + s * .09, cy + s * .23, Object.assign({}, o, { w: 'fine', seed: (o.seed || 67) + 2 }));
      [-.14, 0, .14].forEach(function (k, i) { out += Kit.rough.curve([[cx + s * k * .4, cy - s * .3], [cx + s * k, cy - s * .48], [cx + s * k * 1.6, cy - s * .62]], Object.assign({}, o, { w: 'fine', seed: (o.seed || 67) + 3 + i })); });
      return _rot(out, Object.assign({ rot: -30 }, o), cx, cy);
    },
    /** Cooking pot with handles and steam. */
    pot: function (cx, cy, s, o) {
      o = _dd(o); var w = s * .9, h = s * .5, x = cx - w / 2, y = cy - h / 2 + s * .1;
      var out = Kit.rough.path('M' + x + ' ' + y + ' L' + (x + s * .04) + ' ' + (y + h) + ' Q' + cx + ' ' + (y + h + s * .08) + ' ' + (x + w - s * .04) + ' ' + (y + h) + ' L' + (x + w) + ' ' + y, Object.assign({}, o, { seed: (o.seed || 71) }));
      out += Kit.rough.line(x - s * .08, y, x + w + s * .08, y, Object.assign({}, o, { seed: (o.seed || 71) + 1 }));
      out += Kit.rough.line(x - s * .16, y + h * .25, x, y + h * .25, Object.assign({}, o, { seed: (o.seed || 71) + 2 })) + Kit.rough.line(x + w, y + h * .25, x + w + s * .16, y + h * .25, Object.assign({}, o, { seed: (o.seed || 71) + 3 }));
      return _rot(out + Kit.doodle.steam(cx, y - s * .08, s * .42, Object.assign({}, o, { w: 'fine', gap: s * .2, seed: (o.seed || 71) + 4 })), o, cx, cy);
    },
    /** Leaf (single), pointing up-right. */
    leaf: function (cx, cy, s, o) {
      o = _dd(o); var d = 'M' + (cx - s * .4) + ' ' + (cy + s * .4) + ' Q' + (cx - s * .4) + ' ' + (cy - s * .3) + ' ' + (cx + s * .4) + ' ' + (cy - s * .4) + ' Q' + (cx + s * .3) + ' ' + (cy + s * .4) + ' ' + (cx - s * .4) + ' ' + (cy + s * .4);
      return _rot(Kit.rough.path(d, Object.assign({}, o, { seed: (o.seed || 73) })) + Kit.rough.line(cx - s * .4, cy + s * .4, cx + s * .2, cy - s * .2, Object.assign({}, o, { w: 'fine', seed: (o.seed || 73) + 1 })), o, cx, cy);
    },
    /** Small dots/specks of chalk dust scattered in a box. */
    dust: function (x, y, w, h, o) {
      o = _dd(o, 'fine'); var n = o.n || 7, s = o.seed || 41, out = '';
      for (var i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; var rx = s / 233280; s = (s * 9301 + 49297) % 233280; var ry = s / 233280;
        out += Kit.rough.circle(_f(x + rx * w), _f(y + ry * h), 4 + (i % 3) * 2, Object.assign({}, o, { sketch: false, seed: s % 997 + 1 })); }
      return out;
    }
  };

  /** Full-stage SVG layer for doodles that must sit ON TOP of photos (section <svg>s come before Kit.photo imgs in html()).
      Put it last in html(): Kit.overlay(Kit.doodle.steam(...) + ...). cls lets you target it. */
  Kit.overlay = function (markup, cls) {
    return '<svg class="ovl' + (cls ? ' ' + cls : '') + '" width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible">' + markup + '</svg>';
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
