/* ==========================================================================
   — · References   (untimed appendix, budgetSec 0)
   Light-theme slides, two columns, grouped by section. Never presented; exported with the PDF.
   Slides carry no source marks (KIT §2.5), so this appendix is the whole citation trail: every source
   behind a number, a claim or a mechanism anywhere in the deck, plus the image and figure caveats.
   ========================================================================== */
(function () {
  'use strict';

  var COL_X = [120, 980], COL_W = 800, COL_TOP = 300;

  function column(x, title, items) {
    return '<div class="rf-col" style="position:absolute;left:' + x + 'px;top:' + COL_TOP + 'px;width:' + COL_W + 'px">' +
      '<div class="t-caps rf-head">' + title + '</div>' +
      items.map(function (t) { return '<div class="rf-item">' + t + '</div>'; }).join('') +
      '</div>';
  }

  function refSlide(id, cols) {
    return {
      id: id, title: 'References', heading: 'References', theme: 'light', budgetSec: 0,
      html: function () { return cols.map(function (c) { return column(c[0], c[1], c[2]); }).join(''); },
      build: function (ctx) { Kit.fade(ctx.tl, ctx.qa('.hd > *, .rf-col'), { duration: .4, stagger: .05 }); },
      notes: 'Appendix, not presented. Every source behind the deck, grouped by section, plus the image and figure caveats.'
    };
  }

  /* ---- 01 · Read · Samsung Food ------------------------------------------ */
  var READ_A = [
    'Samsung Food Help Center, <i>Saving recipes</i>',
    'App Store, <i>Samsung Food 5.48.0</i>, Jul 2025',
    'Samsung US, <i>Samsung Food brand page</i>',
    'Samsung Newsroom, <i>Image-to-Recipe</i>, CES 2024',
    'Samsung, patent US20230134600A1, 2023',
    'Whisk, <i>Whisk Platform documentation</i>'
  ];
  var READ_B = [
    'Digital Humanities Now, <i>NYT recipe CRFs</i>',
    'The New York Times, <i>ingredient-phrase-tagger</i>',
    'Ingredient Parser docs, 60,000 sentences',
    'Li et al., <i>TrOCR</i>, AAAI 2023',
    'Kim et al., <i>Donut</i>, ECCV 2022',
    'Chhikara et al., <i>FIRE</i>, WACV 2024',
    'Salvador et al., <i>Inverse Cooking</i>, CVPR 2019'
  ];

  /* ---- 02 · Find · Shiru ------------------------------------------------- */
  var FIND = [
    'Hume et al., patent US 11,439,159 B2, 2022',
    'AgFunderNews, <i>Shiru’s protein platform</i>, May 2024',
    'BusinessWire, <i>Protein marketplace</i>, May 2024',
    'GlobeNewswire, <i>Ingredion and Shiru</i>, Mar 2026',
    'Milling MEA, <i>Shiru plant proteins</i>, 2025',
    'Protein Production Technology, <i>OleoPro</i>, Apr 2025',
    'Rives et al., <i>Protein language models</i>, PNAS 2021',
    'Schütze et al., <i>Nearest-neighbour embedding search</i>, Frontiers in Bioinformatics, 2022',
    'Rost, <i>Twilight zone of alignments</i>, 1999',
    'NVIDIA, <i>BioNeMo ESM-2 overview</i>'
  ];

  /* ---- 03 · Mix · NotCo Giuseppe ----------------------------------------- */
  var MIX = [
    'NotCo, patent US 11,164,069, 2021',
    'NotCo, patent US 11,205,101, 2021',
    'NotCo, patent US 11,982,661, 2024',
    'The Batch, <i>How NotMilk used AI</i>, Nov 2020',
    'Tech Brew, <i>The evolution of Giuseppe</i>, Aug 2021',
    'FoodNavigator, <i>NotCo raises $70m</i>, Dec 2022',
    'Food Processing, <i>AI in food production</i>, Dec 2022',
    'Frazier, <i>Bayesian optimization</i>, 2018',
    'Gómez-Bombarelli et al., <i>Chemical design</i>, 2018'
  ];

  /* ---- 04 · Sell · NotCo ------------------------------------------------- */
  var SELL = [
    'IDB, <i>Not Company profile</i> (NotMayo share)',
    'multiples.vc, <i>NotCo funding and investors</i>',
    'BusinessWire, <i>NotCo $235M Series D</i>, Jul 2021',
    'Food Dive, <i>Kraft Heinz JV</i>, Feb 2022',
    'Bloomberg Línea, <i>North America handover</i>, Feb 2025',
    'FoodNavigator, <i>NotCo opens up its AI</i>, Apr 2025',
    'Just Food, <i>Molinos buys Argentina, Uruguay</i>, 2026',
    'Forbes Chile, <i>Brazil sold to Ferrara</i>, Sep 2026',
    'The Plant Base, <i>Brazil sale, Mexico</i>, Sep 2026',
    'Forbes Chile, Mar 2026, via FEN U. de Chile',
    'Mobile Time, <i>NotCo’s B2B AI work</i>, May 2025'
  ];

  /* ---- 05 · Next · Future ------------------------------------------------ */
  var NEXT = [
    'FoodNavigator, <i>GLP-1s and groceries</i>, Mar 2026',
    'Food Industry Executive, <i>Dye removal</i>, Jun 2026',
    'ConfectioneryNews, <i>The future of cocoa</i>, Oct 2026',
    'Food Industry Executive, <i>Tariffs</i>, Feb 2026',
    'Episcopal Health Foundation, <i>Medicaid</i>, 2026',
    'PyMC Labs and Colgate-Palmolive, arXiv, 2026',
    'IFT, <i>Can AI predict deliciousness?</i>',
    'GeekWire, <i>Picnic shuts down</i>, 2026',
    'Dealroom, <i>Miso Robotics acquires Zume</i>, 2026',
    'Yahoo Finance UK, <i>Robot chef sold</i>, 2026',
    'The Robot Report, <i>Chef Robotics raises $43M</i>, 2026'
  ];

  /* ---- research reports + image notes ------------------------------------ */
  var REPORTS = [
    '<i>Samsung Food: recipes from a photo</i>, Nov 2026',
    '<i>Shiru: protein discovery by search</i>, Nov 2026',
    '<i>NotCo Giuseppe: formula generation</i>, Nov 2026',
    '<i>NotCo: the company</i>, Nov 2026',
    '<i>AI in food design: opportunities</i>, Nov 2026',
    'Each report lists its own sources in full.'
  ];
  var NOTES = [
    'Every food photo in this deck is a generated illustration, not a product shot.',
    'OleoPro product photo: Shiru, via AgFunderNews.',
    'The NotMilk carton is a drawing, not a photo.',
    'No logos, brand packs or real people appear.',
    'Every diagram is drawn in code with rough.js.',
    'Figures from Samsung, Shiru and NotCo are self-reported and not independently checked.',
    'Values called illustrative are made up to show the shape of a result; they are not measurements.',
    'Mechanisms read off patents are inferred: the companies have not confirmed what runs today.',
    'The combination count and the revenue split are the report author’s own arithmetic.'
  ];

  Deck.section({
    id: 'refs', order: 99, num: '—', kicker: 'References', title: '', color: 'teal',
    slides: [
      refSlide('refs-1', [
        [COL_X[0], '01 · Read · Samsung Food', READ_A],
        [COL_X[1], '01 · Read · parsing and research', READ_B]
      ]),
      refSlide('refs-2', [
        [COL_X[0], '02 · Find · Shiru', FIND],
        [COL_X[1], '03 · Mix · NotCo Giuseppe', MIX]
      ]),
      refSlide('refs-3', [
        [COL_X[0], '04 · Sell · NotCo', SELL],
        [COL_X[1], '05 · Next · Future', NEXT]
      ]),
      refSlide('refs-4', [
        [COL_X[0], 'Research reports, Nov 2026', REPORTS],
        [COL_X[1], 'Images, diagrams and figures', NOTES]
      ])
    ]
  });
})();
