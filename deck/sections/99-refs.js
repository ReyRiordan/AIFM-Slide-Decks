/* ==========================================================================
   — · References   (untimed appendix, budgetSec 0)
   Three light-theme slides, two columns each, grouped by section.
   Never presented — exported with the PDF. No animation beyond one fade.
   Lists only sources actually cited on a slide (Kit.src footers or slide text).
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
      notes: 'Appendix — not presented. Sources cited on the slides, grouped by section.'
    };
  }

  /* ---- 01 · Price (Airbnb Smart Pricing) ---- */
  var PRICE = [
    'Ye et al., <i>Customized Regression Model for Airbnb Dynamic Pricing</i>, KDD 2018',
    'Colyer, <i>the morning paper</i> on Ye et al., 2018',
    'Zhang, Mehta, Singh &amp; Srinivasan, <i>Marketing Science</i>, 2021',
    'Huang, <i>Pricing Frictions and Platform Remedies</i>, 2021',
    'Airbnb blog, Jun 2015, via TravelPulse; Airbnb Help Centre: Smart Pricing',
    'Google, <i>Intro to Gradient Boosted Decision Trees</i>; <i>Gradient boosting</i> (Decision Forests course)',
    'Friedman, <i>Greedy Function Approximation: A Gradient Boosting Machine</i>, Annals of Statistics, 2001',
    'Grinsztajn et al., <i>Tree-based models on tabular data</i>, 2022'
  ];

  /* ---- 02 · Assist (Rufus / Alexa for Shopping) ---- */
  var ASSIST = [
    'Amazon, <i>Amazon Rufus</i> launch note, Feb 2024',
    'Amazon Science, <i>The technology behind Rufus</i>, Oct 2024',
    'Amazon, <i>Alexa for Shopping</i>, 13 May 2026',
    'Amazon, SIGIR 2026 industry paper on the Rufus agent (abstract only)',
    'AWS, <i>How Rufus scales… with Amazon Bedrock</i>, 2025',
    'Amazon Q3 2026 results; Q4 2025 earnings, via Modern Retail'
  ];

  /* ---- 03 · Interact (Tavus Griffin) ---- */
  var INTERACT = [
    'Tavus Research, <i>Griffin: The First Human Interaction Model</i>, 1 Oct 2026',
    'Tavus, <i>Introducing Griffin</i>, tavus.io/griffin, and its launch video, 0:28–1:12 (the CCM, the Tavec codec, streaming diffusion)',
    'Tavus, <i>Conversational Video Interface overview</i> (Raven, Sparrow, TTS, Phoenix)',
    'Tavus, <i>Sparrow-2</i>, Aug 2026 (turn-taking, the 40% figure)',
    'Mazumdar et al. (NVIDIA), <i>VideoFDB</i>, 2026 (reply times)',
    'Yin et al., <i>Improved Distribution Matching Distillation</i> (DMD2), 2024',
    'Yin et al., <i>CausVid</i>, 2024 (50-step teacher, 4-step student)',
    'Huang et al., <i>Self Forcing</i>, NeurIPS 2025',
    'Garg (CellCog), <i>Griffin and the 48% Video Turing Test</i>, 2026'
  ];

  /* ---- Tavus, the company ---- */
  var COMPANY = [
    'Tavus, <i>$6.1M seed led by Sequoia</i>, Mar 2023',
    'Maginative, <i>Tavus raises $18M</i> (Series A, Scale), Mar 2024',
    'Business Wire, <i>Tavus raises $40M</i> (Series B, CRV), Nov 2025',
    'Tavus, Conversational Video Interface launch, Aug 2024',
    'Tavus, AI pages: 150,000 developers; Qualified’s Piper results',
    'Founder bios via Y Combinator, Welcome to the Jungle and HubSpot; rivals via Anam and HeyGen pages',
    'Tavus wordmark (SVG), from the tavus.io site header, read 4 Nov 2026',
    'Y Combinator, Tavus company page: founder photos of Hassaan Raza and Quinn Favret, read 4 Nov 2026'
  ];

  /* ---- 04 · Negotiate — benchmarks and studies ---- */
  var EVIDENCE = [
    'Andon Labs, <i>Vending-Bench 2</i> leaderboard, read 4 Nov 2026 (top 8 of 73)',
    'Andon Labs, <i>Vending-Bench Arena</i> (multi-agent games, cartels)',
    'Andon Labs, <i>Opus 5.5, GPT-6 Sol and Grok 4.7 on Vending-Bench</i>, 24 Sep 2026',
    'Sherwood News, <i>Gemini 3 … running a vending machine</i>, Nov 2025 (the ≈$5,500 leader)',
    'Zhu et al., <i>The Automated but Risky Game</i>, arXiv 2506.00073, 2025',
    'Stanford HAI, <i>The Art of the Automated Negotiation</i> (the ≈2% gap)'
  ];

  /* ---- 04 · Negotiate — markets, law and payments ---- */
  var MARKETS = [
    'Fox Business, <i>Walmart using AI to negotiate cost and purchase terms with vendors</i> (Pactum)',
    'Retail Dive, <i>The startup that’s automating supplier negotiations for Walmart</i>',
    'Sidley, <i>From Disclosures to Prohibitions</i>, Oct 2026 (Maryland’s ban, state bills, the FTC Section 5 proposal)',
    'Artemis, x402 dashboard, read 3 Nov 2026',
    'Yahoo Finance, <i>x402 Foundation activated</i>, 14 Jul 2026 (40 members)'
  ];

  Deck.section({
    id: 'refs', order: 99, num: '—', kicker: 'References', title: '',
    slides: [
      refSlide('refs-1', 'References 1 — price, assist', 'References', [
        [COL_X[0], '01 · Price', PRICE],
        [COL_X[1], '02 · Assist', ASSIST]
      ]),
      refSlide('refs-2', 'References 2 — interact, the company', 'References, continued', [
        [COL_X[0], '03 · Interact', INTERACT],
        [COL_X[1], 'Tavus, the company', COMPANY]
      ]),
      refSlide('refs-3', 'References 3 — negotiate', 'References, continued', [
        [COL_X[0], '04 · Negotiate — benchmarks', EVIDENCE],
        [COL_X[1], '04 · Negotiate — markets and law', MARKETS]
      ])
    ]
  });
})();
