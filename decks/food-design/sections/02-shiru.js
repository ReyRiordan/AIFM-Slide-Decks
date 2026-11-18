/* ==========================================================================
   02 · Find · Shiru   (budget 390 s)
   Spec: specs/shiru.md. Roadmap cards / crumbs: Learn → Embed → Search → Filter.
   ========================================================================== */
(function () {
  'use strict';
  var C = Kit.color;
  var IMG = 'assets/img/shiru/';
  var STEPS = ['Learn', 'Embed', 'Search', 'Filter'];

  /* deterministic pseudo-random numbers, so dots land in the same place in show, print and preview */
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  /* ---------------------------------------------------------------- PROBLEM */
  var PROBLEM = {
    id: 'problem',
    title: 'The protein problem',
    heading: 'The protein problem',
    budgetSec: 45,
    html: function () {
      return '' +
        '<svg class="sh-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="pb-arrow">' + Kit.rough.arrow(742, 876, 1120, 804, { seed: 31, sw: 3, stroke: C.rustT, head: 18, bend: 46 }) + '</g>' +
        '</svg>' +
        '<div class="t-caps faint pb-k pb-k1">What food leans on</div>' +
        '<div class="pb-animal">' +
          Kit.photo(IMG + 'egg.webp', { x: 130, y: 350, w: 380, rot: -3, alt: 'egg' }) +
          Kit.photo('assets/img/giuseppe/milk.webp', { x: 640, y: 322, w: 200, rot: 2, alt: 'glass of milk' }) +
          '<div class="t-mono pb-lab pb-l1">egg white · binds and sets</div>' +
          '<div class="t-mono pb-lab pb-l2">milk casein · creamy</div>' +
        '</div>' +
        '<div class="t-caps faint pb-k pb-k2">What nobody has tested</div>' +
        Kit.photo(IMG + 'legumes.webp', { x: 1110, y: 336, w: 500, cls: 'pb-many', alt: 'beans, peas and lentils' }) +
        '<div class="t-body c-olive pb-line">Millions more proteins. Almost none tried in food.</div>' +
        '<div class="tile pb-cost">' +
          '<div class="t-h2 c-rust">One lab test: weeks</div>' +
          '<div class="t-label faint pb-cost-s">express · purify · assay in a recipe</div>' +
        '</div>' +
        Kit.src('Shiru report: the problem; cost of one test from US 11,439,159 B2. Food photos are illustrations.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.pb-many, .pb-line, .pb-cost, .pb-arrow, .pb-k2'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.pb-k1, .src'), { at: .2, stagger: .06 });
      Kit.drop(tl, qa('.pb-animal .photo'), { at: .3, stagger: .45 });
      Kit.show(tl, qa('.pb-l1'), { at: .55, y: 14 });
      Kit.show(tl, qa('.pb-l2'), { at: 1.0, y: 14 });

      // [click 1] the untested millions arrive, and the two workhorses dim
      ctx.pause();
      tl.addLabel('m');
      Kit.show(tl, q('.pb-k2'), { at: 'm', y: 10 });
      Kit.drop(tl, q('.pb-many'), { at: 'm' });
      tl.to(qa('.pb-animal'), { autoAlpha: .55, duration: .5 }, 'm+=.2');
      Kit.show(tl, q('.pb-line'), { at: 'm+=.45', y: 16 });

      // [click 2] the price of touching any one of them
      ctx.pause();
      tl.addLabel('c');
      tl.fromTo(q('.pb-cost'), { autoAlpha: 0, scale: .9, transformOrigin: '0% 50%' },
        { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' }, 'c');
      tl.to(q('.pb-arrow'), { autoAlpha: 1, duration: .01 }, 'c+=.3');
      Kit.draw(tl, qa('.pb-arrow .rp'), { at: 'c+=.3', duration: .6 });
    },
    notes:
      'Almost everything food does with protein rests on a tiny cast of animals. Egg white binds and sets. Milk casein makes things creamy. What ' +
      'you buy a protein for is behaviour: does it foam, does it gel. [click] Nature made millions of others, and almost none have ever been tried ' +
      'in food. Plant proteins are cheap, but worse at these jobs. [click] And testing one means growing it in a microbe, purifying it, baking it ' +
      'into a recipe. Weeks. Only about a quarter even survive that purification step, so you cannot screen millions. This is a search problem.'
  };

  /* --------------------------------------------------------------- APPROACH */
  var CARDS = [
    { q: 'How do you learn with no lab data?', tech: 'Fill in hidden letters' },
    { q: 'How do you compare two proteins?', tech: 'Embeddings' },
    { q: 'Which proteins behave like this one?', tech: 'Nearest-neighbor search' },
    { q: 'Which few are worth testing?', tech: 'Learned filters, then the lab' }
  ];
  var APPROACH = {
    id: 'approach',
    title: 'How Shiru searches',
    heading: 'How Shiru searches',
    budgetSec: 30,
    html: function () {
      return CARDS.map(function (c, i) {
        var x = 120 + i * 432;
        return '<div class="ap-card a' + i + '" style="left:' + x + 'px">' +
            '<div class="t-mono ap-n">0' + (i + 1) + '</div>' +
            '<div class="t-h2 ap-t">' + STEPS[i] + '</div>' +
            '<div class="t-label ap-q">' + c.q + '</div>' +
            '<div class="t-label ap-tech">' + c.tech + '</div>' +
          '</div>';
      }).join('') +
      Kit.src('Shiru report: how the solution works, four stages with one feedback loop.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ap-card > *'), { autoAlpha: 0 });
      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.ap-card, .src'), { at: .2, stagger: .06 });
      for (var i = 0; i < 4; i++) {
        ctx.pause();
        tl.addLabel('c' + i);
        tl.to(q('.a' + i), { borderColor: C.olive, backgroundColor: 'rgba(0,0,0,.16)', duration: .4 }, 'c' + i);
        Kit.show(tl, qa('.a' + i + ' > *'), { at: 'c' + i, stagger: .07, y: 18, duration: .45 });
      }
    },
    notes:
      'Four steps. Only the first one is expensive. [click] Learn. With no lab data, the model trains on raw sequences by filling in letters we ' +
      'hide. [click] Embed. Every protein becomes a list of numbers, so we compare points, not strings. [click] Search. Hand it a protein that ' +
      'works, get the nearest points back. [click] Filter. Models cut the shortlist, then the lab decides. The marker top right tracks the step.'
  };

  /* ------------------------------------------------------------------ LEARN */
  var SEQ_A = ['M', 'K', 'A', 'L', 'I', 'V', 'T', 'G', 'S', 'D', 'K', 'Y', 'L', 'F', 'N', 'P', 'E', 'Q', 'R', 'V', 'T', 'W'];
  var SEQ_B = ['A', 'E', 'Q', 'L', 'G', 'T', 'N', 'G', 'R', 'D', 'W', 'K', 'I', 'F', 'C', 'L', 'V', 'S', 'H', 'M', 'Y', 'T'];
  var SEQ_C = ['M', 'K', 'S', 'L', 'I', 'V', 'N', 'G', 'S', 'D', 'R', 'Y', 'L', 'F', 'Q', 'P', 'E', 'Q', 'H', 'V', 'T', 'Y'];
  var LN_X = 246, LN_STEP = 62, LN_Y = 700, MASK_I = [7, 15];

  var LEARN = {
    id: 'learn',
    title: 'Proteins as language',
    heading: 'Proteins as language',
    budgetSec: 75,
    html: function () {
      var res = SEQ_A.map(function (ch, i) {
        var x = LN_X + i * LN_STEP, m = MASK_I.indexOf(i);
        if (m < 0) return '<div class="t-mono ln-r" style="left:' + x + 'px">' + ch + '</div>';
        return '<div class="ln-m m' + m + '" style="left:' + (x - 10) + 'px">' +
          '<svg width="52" height="70" viewBox="0 0 52 70">' + Kit.rough.rect(3, 3, 46, 64, { seed: 61 + m, sw: 2.6 }) + '</svg>' +
          '<div class="t-mono ln-a c-olive">' + ch + '</div></div>';
      }).join('');

      var sentence = ['Egg', 'white', '@sets', 'when', 'you', '@heat', 'it.'].map(function (w) {
        if (w.charAt(0) !== '@') return '<span class="ln-w">' + w + '</span>';
        return '<span class="ln-sm"><svg width="150" height="76" viewBox="0 0 150 76">' +
          Kit.rough.rect(3, 3, 144, 70, { seed: 71 + w.length, sw: 2.6 }) + '</svg>' +
          '<span class="ln-sa">' + w.slice(1) + '</span></span>';
      }).join(' ');

      return '' +
        '<svg class="sh-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="ln-box1">' + Kit.rough.rect(120, 330, 1560, 170, { seed: 81, sw: 2.6, rough: .9, stroke: C.line }) + '</g>' +
          '<g class="ln-box2">' + Kit.rough.rect(120, 582, 1560, 210, { seed: 82, sw: 2.6, rough: .9, stroke: C.line }) + '</g>' +
          '<g class="ln-arc">' +
            Kit.rough.curve([[680, 736], [928, 760], [1176, 736]], { seed: 83, sw: 2.6, stroke: C.rustT }) +
            Kit.rough.curve([[432, 736], [928, 786], [1424, 736]], { seed: 84, sw: 2.2, stroke: C.rustT }) +
          '</g>' +
        '</svg>' +
        '<div class="t-caps faint ln-k ln-k1">A sentence</div>' +
        '<div class="t-h2 ln-sent">' + sentence + '</div>' +
        '<div class="t-caps faint ln-k ln-k2">A protein</div>' +
        '<div class="ln-chip"><span class="t-label dim">~15% of positions hidden</span><span class="flag">inferred</span></div>' +
        '<div class="ln-seq">' + res + '</div>' +
        '<div class="t-label faint ln-note">alphabet of 20 · a few hundred long · illustrative fragment</div>' +
        '<div class="t-h2 c-olive ln-p1">No lab labels. The answer is the letter you hid.</div>' +
        '<div class="t-body dim ln-p2">The arcs mark letters that touch once the chain folds.</div>' +
        Kit.src('Rives et al., <em>PNAS</em> 2021; masking share from the ESM-2 reference (NVIDIA BioNeMo). ' +
          'Shiru has not published its model, so masked pre-training at ~15% is inferred standard practice. Sequence is illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.ln-sa, .ln-a, .ln-chip, .ln-arc, .ln-p1, .ln-p2'), { autoAlpha: 0 });
      gsap.set(qa('.ln-box2 .rp, .ln-r, .ln-m, .ln-note'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.ln-k1, .ln-k2, .src'), { at: .2, stagger: .06 });
      Kit.draw(tl, qa('.ln-box1 .rp'), { at: .25, duration: .8 });
      Kit.show(tl, qa('.ln-sent .ln-w'), { at: .4, stagger: .06, y: 14 });
      tl.fromTo(qa('.ln-sm'), { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .4, stagger: .1 }, .5);

      // [click 1] the same exercise, written in protein
      ctx.pause();
      tl.addLabel('p');
      tl.to(qa('.ln-box2 .rp'), { autoAlpha: 1, duration: .01 }, 'p');
      Kit.draw(tl, qa('.ln-box2 .rp'), { at: 'p', duration: .7 });
      tl.to(qa('.ln-r'), { autoAlpha: 1, duration: .25, stagger: .022 }, 'p+=.2');
      tl.to(qa('.ln-m'), { autoAlpha: 1, duration: .3 }, 'p+=.85');
      Kit.show(tl, q('.ln-note'), { at: 'p+=.9', y: 10 });
      Kit.show(tl, q('.ln-chip'), { at: 'p+=1.0', y: 14 });

      // [click 2] fill the sentence
      ctx.pause();
      tl.addLabel('s');
      tl.fromTo(qa('.ln-sa'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .2, ease: Kit.ease.out }, 's');

      // [click 3] the same move fills the protein
      ctx.pause();
      tl.addLabel('g');
      tl.fromTo(qa('.ln-a'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .25, ease: Kit.ease.out }, 'g');
      Kit.show(tl, q('.ln-p1'), { at: 'g+=.5', y: 16 });

      // [click 4] why filling a blank forces the model to learn structure
      ctx.pause();
      tl.addLabel('a');
      tl.to(q('.ln-arc'), { autoAlpha: 1, duration: .01 }, 'a');
      Kit.draw(tl, qa('.ln-arc .rp'), { at: 'a', duration: .8, stagger: .15 });
      Kit.show(tl, q('.ln-p2'), { at: 'a+=.4', y: 14 });
    },
    notes:
      'Step one. No lab measurements, so we train on the sequences themselves. Here is a sentence with two words hidden. You can fill those in, and ' +
      'nobody labelled anything. [click] A protein is also a string. Twenty letters, the amino acids, a few hundred of them in a row. Same ' +
      'exercise: hide about fifteen in a hundred and ask the model to put them back. [click] You read the sentence and you say: sets, heat. You got ' +
      'that from the words around the gap. [click] The model does the same thing on the protein, and this is the trick. The supervision is free, ' +
      'because the answer is the letter we hid. The model is a transformer, and this is how the first big text models were trained. [click] And ' +
      'here is why it works. Two letters far apart in the string can touch once the chain folds, so they change together over evolution. To guess a ' +
      'hidden letter, the model has to pick up those pairs. Structure falls out of a spelling exercise.'
  };

  /* ------------------------------------------------------------------ EMBED */
  var EM = { x: 960, y: 300, w: 840, h: 600 };
  function emp(u, v) { return [EM.x + 30 + u * (EM.w - 60), EM.y + 60 + v * (EM.h - 110)]; }
  var PT_A = emp(.26, .62), PT_B = emp(.36, .50), PT_C = emp(.86, .12);

  var EMBED = {
    id: 'embed',
    title: 'Proteins as vectors',
    heading: 'Proteins as vectors',
    budgetSec: 45,
    html: function () {
      function seq(letters, cls, shared) {
        return letters.map(function (ch, i) {
          return '<span class="' + (shared && shared.indexOf(i) >= 0 ? 'hit' : '') + '">' + ch + '</span>';
        }).join('');
        }
      var sharedB = [], sharedC = [];
      SEQ_A.forEach(function (ch, i) { if (SEQ_B[i] === ch) sharedB.push(i); if (SEQ_C[i] === ch) sharedC.push(i); });
      var STRIPS = { A: '0.41 −0.08 1.27 0.06 −0.93 0.52 … ×1,024',
        B: '0.38 −0.11 1.19 0.09 −0.88 0.55 … ×1,024',
        C: '−1.42 0.73 0.08 −0.31 1.66 −0.24 … ×1,024' };

      function row(tag, color, letters, shared, k) {
        return '<div class="em-row r' + k + '">' +
          '<b class="em-tag" style="color:' + color + '">' + tag + '</b>' +
          '<span class="t-mono em-seq">' + seq(letters, '', shared) + '</span>' +
          '<span class="t-mono em-strip">' + STRIPS[tag] + '</span>' +
        '</div>';
      }

      var r = rng(99), cloud = '';
      for (var i = 0; i < 90; i++) {
        var p = emp(.06 + r() * .88, .10 + r() * .86);
        cloud += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" fill="' + C.chalk + '" opacity=".22"/>';
      }

      return '' +
        '<svg class="sh-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="em-frame">' + Kit.rough.rect(EM.x, EM.y, EM.w, EM.h, { seed: 91, sw: 3, rough: .9 }) + '</g>' +
          '<text class="t-caps em-ttl" x="' + (EM.x + 30) + '" y="' + (EM.y + 44) + '" font-size="24">A FLAT PICTURE OF A 1,000-NUMBER SPACE</text>' +
          '<g class="em-cloud">' + cloud + '</g>' +
          '<g class="em-ab">' +
            '<circle cx="' + PT_A[0] + '" cy="' + PT_A[1] + '" r="13" fill="' + C.olive + '" stroke="#1E2124" stroke-width="3"/>' +
            '<circle cx="' + PT_B[0] + '" cy="' + PT_B[1] + '" r="13" fill="' + C.olive + '" stroke="#1E2124" stroke-width="3"/>' +
            '<text class="em-pl" x="' + (PT_A[0] - 20) + '" y="' + (PT_A[1] + 10) + '" text-anchor="end" font-size="32" font-weight="800" fill="' + C.oliveT + '">A</text>' +
            '<text class="em-pl" x="' + (PT_B[0] + 20) + '" y="' + (PT_B[1] + 10) + '" font-size="32" font-weight="800" fill="' + C.oliveT + '">B</text>' +
          '</g>' +
          '<g class="em-c">' +
            '<circle cx="' + PT_C[0] + '" cy="' + PT_C[1] + '" r="13" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>' +
            '<text class="em-pl" x="' + (PT_C[0] - 22) + '" y="' + (PT_C[1] + 48) + '" text-anchor="end" font-size="28" font-weight="700" fill="' + C.rustT + '">C · 73% of letters match A</text>' +
          '</g>' +
        '</svg>' +
        '<div class="t-caps faint em-k em-k1">Two sequences</div>' +
        row('A', C.oliveT, SEQ_A, null, 0) +
        row('B', C.oliveT, SEQ_B, sharedB, 1) +
        '<div class="em-read"><span class="t-mono c-rust">A vs B: 18% of letters</span><span class="flag em-f">illustrative</span></div>' +
        '<div class="em-note"><span class="t-label dim">one protein → about 1,000 numbers</span><span class="flag em-f">inferred</span></div>' +
        '<div class="t-caps faint em-k em-k2">A third sequence</div>' +
        row('C', C.rustT, SEQ_C, sharedC, 2) +
        '<div class="t-h2 c-olive em-pay">Different letters. Same neighbourhood.</div>' +
        Kit.src('US 11,439,159 B2 (fixed-size embeddings from models trained on unlabelled data) · Rost 1999, the twilight zone · ' +
          '~1,000 dimensions inferred from public models (1,024 ProtT5, 1,280 ESM-1b). Sequences and map are illustrative.');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.em-strip, .em-note, .em-ab, .em-c, .em-k2, .r2, .em-pay'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.em-k1, .src'), { at: .2, stagger: .06 });
      Kit.show(tl, qa('.r0, .r1'), { at: .3, stagger: .12, y: 16 });
      Kit.show(tl, q('.em-read'), { at: .6, y: 12 });
      Kit.draw(tl, qa('.em-frame .rp'), { at: .35, duration: .9 });
      Kit.fade(tl, qa('.em-ttl, .em-cloud'), { at: .9, duration: .6, stagger: .1 });

      // [click 1] the letters collapse into numbers
      ctx.pause();
      tl.addLabel('n');
      tl.to(qa('.r0 .em-seq, .r1 .em-seq'), { autoAlpha: 0, scaleX: .6, transformOrigin: '0% 50%', duration: .5, ease: 'power2.in', stagger: .08 }, 'n');
      tl.fromTo(qa('.r0 .em-strip, .r1 .em-strip'), { autoAlpha: 0, scaleX: .6, transformOrigin: '0% 50%' },
        { autoAlpha: 1, scaleX: 1, duration: .5, stagger: .08, ease: Kit.ease.out }, 'n+=.4');
      Kit.show(tl, q('.em-note'), { at: 'n+=.7', y: 12 });

      // [click 2] A and B land next to each other
      ctx.pause();
      tl.addLabel('ab');
      tl.fromTo(q('.em-ab'), { autoAlpha: 0, scale: .6, transformOrigin: PT_A[0] + 'px ' + PT_A[1] + 'px' },
        { autoAlpha: 1, scale: 1, duration: .6, ease: 'back.out(1.8)' }, 'ab');

      // [click 3] C: lots of letters in common, nowhere near
      ctx.pause();
      tl.addLabel('c');
      Kit.show(tl, qa('.em-k2, .r2'), { at: 'c', stagger: .1, y: 16 });
      tl.fromTo(q('.em-c'), { autoAlpha: 0, scale: .6, transformOrigin: PT_C[0] + 'px ' + PT_C[1] + 'px' },
        { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(1.8)' }, 'c+=.35');
      Kit.show(tl, q('.em-pay'), { at: 'c+=.7', y: 16 });
    },
    notes:
      'Step two. Two proteins, as letters. They share about one letter in five, and by the old method that means nothing: below about a quarter ' +
      'matching, letter alignment cannot tell a relative from a stranger. [click] So we stop comparing letters. Each protein goes through the model ' +
      'once and comes out as about a thousand numbers, worked out once and stored. [click] Plot them, and A ' +
      'and B land next to each other, though their spelling barely overlaps. [click] Here is C. It shares nearly three quarters of its letters ' +
      'with A, and sits over there. Overlap and distance disagree, which is the reason to change what similar means.'
  };

  /* ----------------------------------------------------------------- SEARCH */
  var SM = { x: 120, y: 320, w: 1160, h: 560 };
  var QP = [SM.x + 520, SM.y + 280];
  var SEARCH = {
    id: 'search',
    title: 'Nearest-neighbor search',
    heading: 'Nearest-neighbor search',
    budgetSec: 45,
    html: function () {
      var r = rng(777), far = '', near = '';
      var block = [SM.x + 390, SM.y + 94, SM.x + 950, SM.y + 148];   // brazzein label box (above the ring)
      var i, p, dx, dy;
      for (i = 0; i < 420; i++) {
        p = [SM.x + 28 + r() * (SM.w - 56), SM.y + 70 + r() * (SM.h - 110)];
        dx = p[0] - QP[0]; dy = p[1] - QP[1];
        if (Math.sqrt(dx * dx + dy * dy) < 136) continue;
        if (p[0] > block[0] && p[0] < block[2] && p[1] > block[1] && p[1] < block[3]) continue;
        far += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" fill="' + C.chalk + '" opacity=".26"/>';
      }
      for (i = 0; i < 24; i++) {
        var a = r() * Math.PI * 2, rad = 34 + Math.sqrt(r()) * 78;
        p = [QP[0] + Math.cos(a) * rad, QP[1] + Math.sin(a) * rad];
        near += '<circle class="sr-n" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="6" fill="' + C.chalk + '" opacity=".4"/>';
      }
      return '' +
        '<svg class="sh-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="sr-frame">' + Kit.rough.rect(SM.x, SM.y, SM.w, SM.h, { seed: 101, sw: 3, rough: .9 }) + '</g>' +
          '<g class="sr-far">' + far + '</g>' + '<g class="sr-near">' + near + '</g>' +
          '<circle class="sr-ring" cx="' + QP[0] + '" cy="' + QP[1] + '" r="10" fill="none" stroke="' + C.rustT + '" stroke-width="3" stroke-dasharray="10 12"/>' +
          '<g class="sr-q"><circle cx="' + QP[0] + '" cy="' + QP[1] + '" r="14" fill="' + C.rust + '" stroke="#1E2124" stroke-width="3"/>' +
            '<text class="t-mono sr-ql" x="' + (QP[0] + 150) + '" y="' + (QP[1] - 148) + '" text-anchor="middle" font-size="28" fill="' + C.rustT + '">brazzein · a known sweet protein</text></g>' +
        '</svg>' +
        '<div class="t-caps faint sr-k">The database, as points</div>' +
        '<div class="bignum sr-b1"><div class="t-num sr-c1">0</div><div class="t-label">points in the index</div></div>' +
        '<div class="bignum sr-b2"><div class="t-num c-rust sr-c2">0</div>' +
          '<div class="sr-b2l"><span class="t-label">returned for one query</span><span class="flag">illustrative</span></div></div>' +
        '<div class="tile sr-cmp">' +
          '<div class="t-caps faint">Low letter overlap</div>' +
          '<div class="sr-bar"><span class="t-mono c-olive">embedding search</span><b class="t-mono c-olive">57.5%</b></div>' +
          '<div class="sr-bar"><span class="t-mono dim">letter-by-letter</span><b class="t-mono dim">34.5%</b></div>' +
          '<div class="t-label faint">top-1 accuracy, 2022</div>' +
        '</div>' +
        '<div class="t-body dim sr-cav">On long, multi-part proteins, letter matching still wins.</div>' +
        Kit.src('Schütze et al., <em>Frontiers in Bioinformatics</em> 2022 (57.5% vs 34.5% top-1 below 20% identity) · Hume, AgFunderNews May 2024 ' +
          '(a couple of dozen candidates) · 77M+: company release, Mar 2026. The index type is inferred. Point cloud is illustrative.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.sr-q, .sr-b2, .sr-cmp, .sr-cav'), { autoAlpha: 0 });
      gsap.set(q('.sr-ring'), { autoAlpha: 0 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.sr-k, .src'), { at: .2, stagger: .06 });
      Kit.draw(tl, qa('.sr-frame .rp'), { at: .25, duration: .9 });
      Kit.fade(tl, qa('.sr-far, .sr-near'), { at: .6, duration: .8 });
      Kit.show(tl, q('.sr-b1'), { at: .5, y: 16 });
      Kit.count(tl, q('.sr-c1'), { to: 77, suffix: 'M+', duration: 1.1, at: .6 });

      // [click 1] the query is one point among millions
      ctx.pause();
      tl.addLabel('q');
      tl.fromTo(q('.sr-q'), { autoAlpha: 0, scale: .4, transformOrigin: QP[0] + 'px ' + QP[1] + 'px' },
        { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, 'q');

      // [click 2] the neighbourhood, and the first drop in the funnel
      ctx.pause();
      tl.addLabel('r');
      tl.to(q('.sr-ring'), { autoAlpha: 1, duration: .2 }, 'r');
      tl.fromTo(q('.sr-ring'), { attr: { r: 10 } }, { attr: { r: 118 }, duration: .9, ease: 'power2.out' }, 'r');
      tl.to(qa('.sr-n'), { fill: C.olive, opacity: 1, attr: { r: 8 }, duration: .25, stagger: .022 }, 'r+=.35');
      Kit.show(tl, q('.sr-b2'), { at: 'r+=.4', y: 16 });
      Kit.count(tl, q('.sr-c2'), { to: 24, duration: .8, at: 'r+=.5' });

      // [click 3] what the benchmark actually says
      ctx.pause();
      tl.addLabel('b');
      Kit.show(tl, q('.sr-cmp'), { at: 'b', y: 20 });
      Kit.show(tl, q('.sr-cav'), { at: 'b+=.3', y: 12 });
    },
    notes:
      'Step three, and now it is geometry. Every protein in the database is a point. Seventy-seven million of them. [click] You query with ' +
      'something that already does the job. Here, brazzein, a protein that tastes sweet. [click] Back come its nearest neighbours: a couple of ' +
      'dozen. That is what a lab can physically test in a quarter, so the lab is the bottleneck, not the model. [click] Does the new metric help? ' +
      'On pairs that barely match letter for letter, embedding search got the top answer right fifty-seven per cent of the time, against ' +
      'thirty-four for letter matching. But on long, multi-part proteins the old tool wins.'
  };

  /* ----------------------------------------------------------------- FILTER */
  var FX0 = 440, FX1 = 1480, FT0 = 410, FT1 = 505, FB0 = 790, FB1 = 695;
  function ftop(x) { return FT0 + (FT1 - FT0) * (x - FX0) / (FX1 - FX0); }
  function fbot(x) { return FB0 + (FB1 - FB0) * (x - FX0) / (FX1 - FX0); }
  var GATES = [
    { x: 680, q: 'Works?', m: 'gels? dissolves?' },
    { x: 980, q: 'Makeable?', m: 'microbe can make it?' },
    { x: 1280, q: 'Safe?', m: 'like an allergen?' }
  ];

  var FILTER = {
    id: 'filter',
    title: 'Three filters',
    heading: 'Three filters',
    budgetSec: 60,
    html: function () {
      var gates = GATES.map(function (g, i) {
        return '<g class="fl-g g' + i + '">' + Kit.rough.line(g.x, ftop(g.x) - 14, g.x, fbot(g.x) + 14, { seed: 111 + i, sw: 3 }) + '</g>';
      }).join('');

      var r = rng(31337), segs = [[FX0 + 26, 668, 70], [696, 966, 30], [996, 1266, 14], [1296, FX1 - 20, 6]], dots = '';
      segs.forEach(function (s, k) {
        for (var i = 0; i < s[2]; i++) {
          var x = s[0] + r() * (s[1] - s[0]);
          var t = ftop(x) + 18, b = fbot(x) - 18;
          var y = t + r() * (b - t);
          dots += '<circle class="fl-d d' + k + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="' + C.chalk + '" opacity=".45"/>';
        }
      });

      return '' +
        '<svg class="sh-svg" width="1920" height="1080" viewBox="0 0 1920 1080">' +
          '<g class="fl-wall">' + Kit.rough.line(FX0, FT0, FX1, FT1, { seed: 121, sw: 3 }) + Kit.rough.line(FX0, FB0, FX1, FB1, { seed: 122, sw: 3 }) + '</g>' +
          gates +
          '<g class="fl-dots">' + dots + '</g>' +
          '<g class="fl-loop">' + Kit.rough.arrow(1560, 606, 686, 404, { seed: 131, sw: 3, stroke: C.rustT, head: 18, bend: 400 }) + '</g>' +
        '</svg>' +
        '<div class="bignum fl-in"><div class="t-num fl-c">0</div><div class="t-label">sequences in the index</div></div>' +
        GATES.map(function (g, i) {
          return '<div class="t-h2 fl-q q' + i + '" style="left:' + (g.x - 180) + 'px">' + g.q + '</div>' +
            '<div class="t-label dim fl-m m' + i + '" style="left:' + (g.x - 150) + 'px">' + g.m + '</div>';
        }).join('') +
        '<div class="t-label c-rust fl-loop-l">every result,<br>failures included</div>' +
        '<div class="t-h2 c-olive fl-out">dozens</div>' +
        '<div class="tile fl-lab"><div class="t-caps">Lab</div><div class="t-label dim fl-lab-s">express · purify · assay</div></div>' +
        '<div class="t-h2 c-rust fl-one">1 ingredient</div>' +
        '<div class="fl-note"><span class="t-label dim">Filters trained on a few hundred measured proteins</span><span class="flag">inferred</span></div>' +
        '<div class="t-h2 c-olive fl-pay">The lab, not the model, sets the pace.</div>' +
        Kit.src('US 11,439,159 B2 (multi-objective ranking, allergen screening, and the loop that returns assay results to training) · ' +
          'Hume, AgFunderNews May 2024 (Expressor) · 77M+: company release, Mar 2026. "A few hundred labels" is inferred.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.fl-q, .fl-m, .fl-out, .fl-lab, .fl-one, .fl-loop, .fl-loop-l, .fl-note, .fl-pay'), { autoAlpha: 0 });
      gsap.set(qa('.d1, .d2, .d3'), { autoAlpha: 0 });
      gsap.set(qa('.fl-g'), { opacity: .22 });

      Kit.rise(tl, qa('.hd > *, .crumbs'), { at: 0, stagger: .08 });
      Kit.fade(tl, q('.src'), { at: .2 });
      Kit.draw(tl, qa('.fl-wall .rp'), { at: .25, duration: 1.0 });
      Kit.draw(tl, qa('.fl-g .rp'), { at: .5, duration: .5, stagger: .08 });
      Kit.show(tl, q('.fl-in'), { at: .35, y: 16 });
      Kit.count(tl, q('.fl-c'), { to: 77, suffix: 'M+', duration: 1.1, at: .45 });
      Kit.fade(tl, qa('.d0'), { at: .9, duration: .6 });

      for (var i = 0; i < 3; i++) {
        ctx.pause();
        tl.addLabel('g' + i);
        tl.to(q('.g' + i), { opacity: 1, duration: .35 }, 'g' + i);
        Kit.show(tl, qa('.q' + i + ', .m' + i), { at: 'g' + i, stagger: .1, y: 14 });
        tl.to(qa('.d' + (i + 1)), { autoAlpha: .45, duration: .45, stagger: .02 }, 'g' + i + '+=.3');
      }
      Kit.show(tl, q('.fl-out'), { at: 'g2+=.6', y: 14 });

      // [click 4] the lab, and the loop back
      ctx.pause();
      tl.addLabel('L');
      Kit.drop(tl, q('.fl-lab'), { at: 'L' });
      Kit.show(tl, q('.fl-one'), { at: 'L+=.35', y: 14 });
      tl.to(q('.fl-loop'), { autoAlpha: 1, duration: .01 }, 'L+=.5');
      Kit.draw(tl, qa('.fl-loop .rp'), { at: 'L+=.5', duration: .9 });
      Kit.show(tl, q('.fl-loop-l'), { at: 'L+=.9', y: 12 });
      Kit.show(tl, qa('.fl-note, .fl-pay'), { at: 'L+=1.1', stagger: .15, y: 14 });
    },
    notes:
      'Step four. Seventy-seven million sequences go in, and three learned filters squeeze the stream. [click] Does it work? A small model predicts ' +
      'whether the protein gels or dissolves. These predictors are tiny, a few hundred measurements each, and they only work because they sit on ' +
      'top of the pre-trained model from step one. [click] Can we make it? Expressor predicts whether a microbe will produce the protein and push ' +
      'it out of the cell. [click] Is it safe? Does it look like a known allergen. The irony: the regulator\'s test is letter-by-letter matching, ' +
      'the exact method this pipeline was built to beat. [click] Out comes dozens, and the lab picks one. Every result goes back in, including the ' +
      'failures. Where nearly everything fails, the failures are the more useful half. The name for that loop is active learning.'
  };

  /* ---------------------------------------------------------------- RESULTS */
  var RESULTS = {
    id: 'results',
    title: 'Results',
    heading: 'Results',
    budgetSec: 50,
    html: function () {
      return '' +
        '<div class="t-caps faint rs-k">The searchable database</div>' +
        '<div class="bignum rs-b1"><div class="t-num rs-c1">0</div>' +
          '<div class="t-label">natural protein sequences, March 2026</div></div>' +
        '<div class="rs-bars">' +
          '<div class="rs-bar"><span class="t-label dim">May 2024</span><i style="width:197px"></i><b class="t-mono">33M+</b></div>' +
          '<div class="rs-bar"><span class="t-label dim">March 2026</span><i style="width:460px"></i><b class="t-mono">77M+</b></div>' +
        '</div>' +
        Kit.photo(IMG + 'oleopro.jpg', { x: 1180, y: 290, w: 560, h: 358, rot: -2, framed: true, cls: 'rs-ph', alt: 'OleoPro, a bowl of structured fat' }) +
        '<div class="t-label dim rs-cap">OleoPro · in production since April 2025</div>' +
        '<div class="rs-b2"><div class="t-num c-rust rs-c2">0</div>' +
          '<div class="rs-b2t"><span class="t-label">less saturated fat than the solid fats it replaces</span>' +
          '<span class="flag">Self-reported</span></div></div>' +
        '<div class="t-h2 c-olive rs-p1">AI picked the proteins.</div>' +
        '<div class="t-body dim rs-p2">Potato protein and ordinary oil did the rest.</div>' +
        Kit.src('GlobeNewswire 18 Mar 2026 (77M+) · BusinessWire 1 May 2024 (33M+) · Milling MEA 2025 (&gt;90% less saturated fat) · ' +
          'Protein Production Technology Apr 2025. Product photo: Shiru, via AgFunderNews.', 'Self-reported');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.rs-ph, .rs-cap, .rs-b2, .rs-p1, .rs-p2'), { autoAlpha: 0 });
      gsap.set(qa('.rs-bar i'), { scaleX: 0, transformOrigin: '0% 50%' });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      Kit.fade(tl, qa('.rs-k, .src'), { at: .2, stagger: .06 });
      Kit.show(tl, q('.rs-b1'), { at: .3, y: 18 });
      Kit.count(tl, q('.rs-c1'), { to: 77, suffix: 'M+', duration: 1.2, at: .4 });
      Kit.show(tl, qa('.rs-bar'), { at: .7, stagger: .15, y: 12 });
      tl.to(qa('.rs-bar i'), { scaleX: 1, duration: .8, stagger: .15, ease: Kit.ease.out }, .8);

      // [click 1] the product, and the claim
      ctx.pause();
      tl.addLabel('p');
      Kit.drop(tl, q('.rs-ph'), { at: 'p', rot: -2 });
      Kit.show(tl, q('.rs-cap'), { at: 'p+=.5', y: 12 });
      Kit.show(tl, q('.rs-b2'), { at: 'p+=.6', y: 16 });
      Kit.count(tl, q('.rs-c2'), { to: 90, prefix: '>', suffix: '%', duration: .9, at: 'p+=.7' });

      // [click 2] the correction is the last thing on screen
      ctx.pause();
      tl.addLabel('h');
      Kit.show(tl, qa('.rs-p1, .rs-p2'), { at: 'h', stagger: .2, y: 16 });
      tl.to(q('.rs-b2'), { autoAlpha: .6, duration: .5 }, 'h+=.2');
    },
    notes:
      'The searchable database went from thirty-three million sequences in twenty twenty-four to over seventy-seven million this year. That index ' +
      'is now the product: they sell access to it. [click] And this is OleoPro. Liquid oil held in a protein network, so it behaves like a solid ' +
      'fat: firm at room temperature, browning when you cook it. Over ninety per cent less saturated fat than what it replaces. That is the ' +
      'company\'s own number. [click] Now the honest version. The AI picked the proteins. It did not invent a molecule. What ' +
      'is in the jar is potato protein you can already buy, structured with ordinary oil. The model narrowed the search, and normal food science ' +
      'did the rest.'
  };

  /* -------------------------------------------------------------- TAKEAWAYS */
  var TKROWS = [
    ['01', 'Pre-training', 'When one label costs weeks,<br>learn the data first.'],
    ['02', 'Embedding search', 'It finds what letters miss.<br>Only near what already works.']
  ];
  var THRU = [
    { t: 'Read', cls: '' }, { t: 'Find', cls: 'tk-on' }, { t: 'Mix', cls: 'tk-next' },
    { t: 'Sell', cls: '' }, { t: 'Next', cls: '' }
  ];

  var TAKEAWAYS = {
    id: 'takeaways',
    title: 'Takeaways',
    heading: 'Takeaways',
    budgetSec: 40,
    html: function () {
      var rows = TKROWS.map(function (r, i) {
        return '<div class="tk-row r' + i + '" style="top:' + (360 + i * 200) + 'px">' +
          '<div class="n t-mono">' + r[0] + '</div><div class="rule"></div>' +
          '<div class="tg t-caps">' + r[1] + '</div><div class="ln t-h2">' + r[2] + '</div>' +
        '</div>';
      }).join('');
      var strip = THRU.map(function (k, i) {
        return (i ? '<span class="sep t-caps">·</span>' : '') + '<span class="tok ' + k.cls + ' t-caps">' + k.t + '</span>';
      }).join('');
      return Kit.photo(IMG + 'legumes.webp', { x: 1250, y: 300, w: 560, cls: 'tk-img', alt: '' }) +
        rows + '<div class="tk-thru">' + strip + '</div>' +
        Kit.src('Shiru report: executive summary and limitations. Food photo: illustration.', 'Generated');
    },
    build: function (ctx) {
      var tl = ctx.tl, q = ctx.q, qa = ctx.qa;
      gsap.set(qa('.r0 > *, .r1 > *'), { autoAlpha: 0 });
      gsap.set(q('.tk-next'), { color: C.text3 });

      Kit.rise(tl, qa('.hd > *'), { at: 0, stagger: .08 });
      tl.fromTo(q('.tk-img'), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: .3, scale: 1, duration: .9, ease: 'power2.out' }, 0);
      Kit.fade(tl, qa('.tk-thru, .src'), { at: .3, stagger: .06 });

      // [click 1] lesson one
      ctx.pause();
      Kit.show(tl, qa('.r0 > *'), { stagger: .07, duration: .5 });

      // [click 2] lesson two, and the hand-off to Mix
      ctx.pause();
      tl.addLabel('two');
      Kit.show(tl, qa('.r1 > *'), { at: 'two', stagger: .07, duration: .5 });
      tl.to(q('.tk-next'), { color: C.saffronT, duration: .5 }, 'two+=.4');
    },
    notes:
      'Two things to take from Shiru. [click] One. When a single label costs weeks, do not start by labelling. Train on the unlabelled data first, ' +
      'and a few hundred labels can then steer a model over seventy-seven million candidates. [click] Two. Embedding search finds relatives that ' +
      'letter matching cannot see, but it only looks near something that already works, so it finds analogues, not surprises. And it sees one ' +
      'molecule, while gelling depends on the whole recipe. That is why the lab never leaves. Next: once you have ingredients, how do you combine ' +
      'them? That is NotCo.'
  };

  Deck.section({
    id: 'shiru', order: 2, num: '02', kicker: 'Find', title: 'Shiru', color: 'olive',
    sweep: ['olive', 'rust', 'olive', 'charcoal', 'olive', 'saffron'],
    slides: [
      PROBLEM, APPROACH,
      Kit.withCrumbs(LEARN, STEPS, 0),
      Kit.withCrumbs(EMBED, STEPS, 1),
      Kit.withCrumbs(SEARCH, STEPS, 2),
      Kit.withCrumbs(FILTER, STEPS, 3),
      RESULTS, TAKEAWAYS
    ]
  });
})();
