/* ==========================================================================
   — · References   (untimed appendix, budgetSec 0)
   Light-theme slides, two columns, grouped by section. Never presented; exported with the PDF.
   List only sources actually cited on a slide (Kit.src footers or slide text).
   ========================================================================== */
(function () {
  'use strict';

  var COL_X = [120, 980], COL_W = 820, COL_TOP = 290;

  function column(x, title, items) {
    return '<div class="rf-col" style="position:absolute;left:' + x + 'px;top:' + COL_TOP + 'px;width:' + COL_W + 'px">' +
      '<div class="t-caps rf-head">' + title + '</div>' +
      items.map(function (t) { return '<div class="rf-item">' + t + '</div>'; }).join('') +
      '</div>';
  }

  function refSlide(id, title, heading, cols) {
    return {
      id: id, title: title, heading: heading, theme: 'light', budgetSec: 0,
      html: function () { return cols.map(function (c) { return column(c[0], c[1], c[2]); }).join(''); },
      build: function (ctx) { Kit.fade(ctx.tl, ctx.qa('.hd > *, .rf-col'), { duration: .4, stagger: .05 }); },
      notes: 'Appendix, not presented. Sources cited on the slides, grouped by section.'
    };
  }

  var EXAMPLE = [
    'Author, <i>Title of the paper or post</i>, Venue, Year',
    'Company blog, <i>Post title</i>, Month Year'
  ];

  Deck.section({
    id: 'refs', order: 99, num: '—', kicker: 'References', title: '', color: 'teal',
    sweep: ['teal', 'charcoal', 'teal', 'charcoal', 'teal', 'charcoal'],
    slides: [
      refSlide('refs-1', 'References', 'References', [
        [COL_X[0], '01 · Example section', EXAMPLE]
      ])
    ]
  });
})();
