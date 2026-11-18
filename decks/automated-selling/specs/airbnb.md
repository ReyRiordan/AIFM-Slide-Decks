# Spec — Section 01 · Price · Airbnb Smart Pricing

**Owner file:** `sections/01-airbnb.js` (+ `css/sections/airbnb.css`, `assets/img/airbnb/`)
**Budget:** **425 s** = 60 + 30 + 35 + 20 + 55 + **120** + 60 + 45 (the review pass moved 15 s from `gbt-use` to `price-model` along with the three deployment cards)
**Section color:** red (`--sec` / `--sec-t`). Focus accent: orange.
**Slide order:** `PROBLEM, TREE, BOOST, GBTUSE, PRICEMODEL, LOSS, RESULTS, TAKEAWAYS`
**Kicker:** `Price`. Section title: `Airbnb Smart Pricing`.

Headings follow the fix-pass heading map in
`/Users/reyriordan/.claude/plans/let-s-do-a-comprehensive-async-shell.md`: plain topic labels,
sentence case, no metaphors, puns or teaser questions.

| id | heading | budgetSec | pauses |
|---|---|---|---|
| `problem` | The pricing problem | 60 | 3 |
| `tree` | Decision trees | 30 | 2 |
| `boost` | Boosting | 35 | 3 |
| `gbt-use` | Gradient boosting at Airbnb | 20 | 1 |
| `price-model` | The price model | 55 | 4 |
| `loss` | The loss function | 120 | 6 |
| `results` | Results | 60 | 2 |
| `takeaways` | Takeaways | 45 | 2 |

The teaching arc, one line each:

1. **problem** — the right price is never revealed; the only feedback is the host's price and one bit.
2. **tree** — a tree is a short list of yes/no questions; one night routes down it to a small nudge.
3. **boost** — many small trees added together, each trained on what the running total still gets wrong.
   The gaps shrink but never close.
4. **gbt-use** — "gradient" is the direction and size of the error, and a new tree follows the arrows.
5. **price-model** — what the booking model hands over (one model per market, a booking chance, price as
   an input), then the price model: it scales the host's price by an adjustment driven by booking chance
   (and area demand), with two settings per listing for the loss to tune.
6. **loss** — each outcome becomes a no-penalty price range; the loss penalises the price model's
   suggestion for its distance outside it.
7. **results** — nightly rate −5.7%, daily revenue +8.6%, independently measured.
8. **takeaways** — boosted trees on tables, design the loss, the objective is a choice.

---

## 1 · `problem` — 60 s

**The one idea:** Airbnb never learns what a night was worth. It sees the host's price and one bit.

On screen: price card (`ONE LISTING, ONE NIGHT` / `$ ?`), three wall cards under
`WHY HOTEL PRICING FAILS HERE` (x 1060, w 740) — each states a consequence, including
`Airbnb can only suggest, never test`, five night tiles under `WHAT AIRBNB GETS BACK`, and the caption
`Booked or empty. Never the right price.`

Build: entrance (the question) → walls → prices → outcome glyphs + caption. Each tile's outcome slot
holds a dimmed dash from the start, so the intermediate state never looks like a failed render.

Spoken only, not on screen: Airbnb tried the textbook route and its own A/B tests showed no revenue gain.

Source: Ye et al., KDD 2018 via Colyer, 2018. Dates and prices are illustrative.

## 2 · `tree` — 30 s

**The one idea:** a tree is a short list of yes/no questions, and the leaf holds a small nudge to the booking chance.

Layout: label `A SHORT LIST OF YES/NO QUESTIONS` at y 280; SVG tree (1120×580) at x 120, y 340,
four rows at local y 40 / 206 / 372 / 538; legend `Each leaf gives a small nudge to the booking chance.` at
y 922; right column at x 1240, width 560 (`One night` card, `This tree nudges` card) and `One tree is a rough
guess.` at y 860.

Tree: `Within 7 days?` → no → `−9%`; yes → `Saturday?` → no → `+2%`; yes → `Price above the median?`
→ yes → `+6%`, no → `+11%`. A leaf is an adjustment, not a whole probability, so hundreds of them can add up.

State: `st.p` 0 → 3, the distance the example night has travelled. `render()` sets each trace segment's
`stroke-dashoffset`, the node outline colour, and the answer readout.

Build: entrance (tree plus the `One night` card) → route the night in three timed hops, then the answer
→ the rough-guess line.

Source: Ye et al., KDD 2018 (via Colyer, 2018) for the GBM; Google's Decision Forests course for the
tree. Questions and leaf values are illustrative.

## 3 · `boost` — 35 s

**The one idea:** boosted means many small trees added together, each one trained on what is still wrong.

Layout: label `CHANCE THIS NIGHT BOOKS` at y 280; SVG (1120×620) at x 120, y 330 with five rows at
local y 60 / 165 / 270 / 375 / 480. Each row: night label, track line, blue prediction bar (h 30), teal
target tick, and the orange gap drawn 56 px below the row top so it never overlays the bar.
Right column at x 1300: `Trees added` counter card, a three-item legend (`model's guess`, `what happened`,
`how wrong it still is`), then `Each new tree is trained on the orange gaps.` (y 780) and
`The gaps shrink. They never close.` (y 870).

State: `st.k` (trees added) and `st.in` (entrance growth). `pred = target + (50 − target) · (F + (1 − F)·r^k)`,
with a per-night `r` between 0.62 and 0.70 and a floor `F = .24`, so 200 trees land at about 88% on booked
nights and 12% on empty ones. The gaps narrow to a sliver and stop: shrinkage exists so the model does not
overfit, and the next slide re-scores a night at 62% and 41%.

Build: entrance (flat guess, five gaps) → tree 1 → tree 2 → 200 trees.

Source: Google, Introduction to Gradient Boosted Decision Trees; Ye et al., KDD 2018 (via Colyer, 2018).
The five nights and the shrinking gaps are illustrative.

## 4 · `gbt-use` — 20 s

**The one idea:** the gradient is the direction and size of the error, and a new tree follows those arrows.

Layout: label `HOW TO FIX EACH NIGHT` at y 280 and the line `Each arrow is one night: which way, and how far`
at y 326; SVG (1500×520) at x 120, y 392 with a zero line at local y 380 and five arrows at local
x 420 / 700 / 980 / 1260 / 1540, numbered 1-5 at local y 570. Left of the zero line, three stacked keys say
which way an arrow points: `↑ guess higher` (sky), `0 = exactly right` and `↓ guess lower` (red). They match
Rey's line "Up means guess higher, down means lower", so the arrows cannot be read as the error itself.
Chip `A new tree follows the arrows` at x 1240, y 290, revealed on the click.

State: `st.g`, the arrow length as a fraction of the full error. `render()` redraws each shaft and head. The head is a fixed 26 px, and an arrow is never drawn shorter
than its head plus a 12 px shaft, so even the smallest error still reads as an arrow.

Build: entrance (arrows) → a tree follows them and they shrink to 60%. Two steps, one click.

The deployment facts (one model per market, the booking chance, price as an input) moved to the front of
`price-model`, where the pipeline strip needs them as setup.

No formula on this slide. The one equation in the talk is the loss, two slides later.

Source: Friedman, 2001 (boosting as gradient descent in function space). Arrow sizes are illustrative.

## 5 · `price-model` — 55 s

**The one idea:** there are two models. The trees give a booking chance; a second, small model turns it
into a price by scaling the host's own price, and it has just two settings per listing for the loss to tune.

Why it exists: students asked how trees that predict booking chance connect to a loss that grades a price.
This reverses the fix-pass cut of "Two models and a dial".

Layout:
- Step 0, the hand-over: caps `WHAT THE BOOKING MODEL GIVES US` at y 280 and three cards at y 400
  (w 540, min-height 360, x 120 / 690 / 1260): `Where it runs` / `One model per market` / `Tokyo and Tahoe
  differ`; `What it outputs` / `The chance a night books` / `for one listing, one night`; `What goes in` /
  `Price is an input` / `$150 → 62% · $180 → 41%`. They leave upward on the first click, and the three facts
  stay on screen for the rest of the slide as one 28 px line at x 120, y 418:
  `One model per market · The chance a night books · Price is an input` (so the printed final state still
  carries what the footer and the pipeline's `80% chance` label lean on).
- Pipeline strip, boxes at y 282 (h 120): `Booking model` / `the trees` (x 120, w 330, dim) → `80%` `chance` →
  `Price model` / `host's price $100 + area demand` (x 690, w 520, orange outline) → `$112` `suggested` →
  `The loss` / `grades it, next slide` (x 1410, w 390, dashed). Arrows and their labels are one SVG at y 276.
- Curve SVG (1060×520) at x 120, y 464: caps `PRICE ADJUSTMENT`; y-axis ×0.80–×1.20, x-axis `booking chance`
  0–100%; dashed ×1.00 line labelled `host's price, unchanged` (label sits top-left, where the line never goes);
  the orange line, an ✕ where it crosses ×1.00, and two nights (`Sat` at 80%, `Tue` at 30%) with guides to the axis.
- Right column x 1250, w 550: card `Two nights at $100` (`Busy Sat · 80%  ×1.12 → $112`,
  `Quiet Tue · 30%  ×0.92 → $92`), then `Setting 1 · where it crosses ×1.00` (y 690) and
  `Setting 2 · how steep — up and down differ` (y 792, the asymmetry named on screen, not only in the notes), then the chip `The loss tunes both, per listing` (y 900).

State: `st = { n: .5, s: .4, c: 0, d: 0 }` (crossing point, steepness, line draw-in, nights' opacity).
The adjustment is asymmetric, because a price rise and a price cut of the same size do not have mirror-image
effects: above the crossing point `1 + .397·s·((q−n)/(1−n))^.55`, below it `1 − .478·s·((n−q)/n)^.95`. At the
default settings that still reads ×1.12 at 80% and ×0.92 at 30%. The y-axis spans ×0.75–×1.25 (ticks ×0.80–×1.20)
so neither end of the curve clips while Setting 2 moves. `render()` redraws the path, the ✕, both nights, the card
readouts and the pipeline's `$112`. Nights are red when raised (≥ ×1.00) and sky when lowered.

Build: the hand-over cards → pipeline, left to right → curve + two nights + card → Setting 1 (n .5 → .62 → .5:
$112/$92 → $107/$87 and back), then Setting 2 (s .4 → .52 → .4) → hand-off chip.

No formula on screen. `×1.12 → $112` is worked arithmetic, a pseudo-diagram under KIT §2.5.

Source: Airbnb report "Deep dive 3" (Ye et al., KDD 2018, via Colyer, 2018): suggestion = calendar price × V;
inputs booking probability and demand score; θ₁ (how fast prices grow or shrink) and θ₂ (where the calendar price
is left unchanged) learned per listing. Curve shape, chances and multipliers are illustrative; the real model
uses a demand-adjusted booking chance and an asymmetric exponential curve.

## 6 · `loss` — 120 s

The visual: the price axis, the no-penalty band, the valley, the draggable suggestion, the
booked → not-booked flip, the both-sides overlay, and the equation card.
The fix pass changed only the heading (`The loss function`) and three labels (`What happened`,
`Prices the night supports`, `The loss, in symbols`). The price-model pass renamed the readout
`Model says` → `Price model`, opened the notes with "Now we grade the price model's suggestion", and added
one closing sentence: training adjusts each listing's two settings until its total penalty is smallest.
The review pass stacked the `.c3` readout (`SUGGESTED` / `PENALTY`, 76 px mono, label column 272 px and
both values left-aligned at the same x, penalty carries a `$` so it is not a bare integer)
so the card clears y 990 and the two numbers can never be read as one; dimmed `.c1`–`.c3` with the chart
on step 5, so the arrows own that beat; and hid the `◂ drag ▸` hint until a pointer moves over the chart.
The review pass (Rey lifted the "LOSS visual stays" lock for this) redrew the zone as a 90 px band sitting on
the axis, with dashed teal edges running faintly to the top of the plot and `no penalty` inside the band, so the
first frame of the zone can no longer read as one enormous penalty column. On step 6 the edges brighten and
pick up teal `L` and `U` labels, and the equation card states `L and U are the zone's two edges` above
`penalty =`, before either term is read. The unbooked sub-line reads `at most $100, and $100 already failed`.

Source: Ye et al., KDD 2018 (via Colyer, 2018). Zone widths (×0.9, ×1.1) are illustrative.

## 7 · `results` — 60 s

Two numbers (−5.7% nightly price, +8.6% daily revenue), the causal chain, and the self-reported versus
independent contrast. The self-reported card is set in `--text-3` and states the verdict
(`A correlation, not a result`); the independent card keeps full contrast and its teal rule.

Source: Zhang, Mehta, Singh & Srinivasan, Marketing Science (2021). Airbnb's 4× claim is company-reported
and correlational, and carries the `Self-reported` flag.

## 8 · `takeaways` — 45 s

Canonical section closer: image, veil, three numbered rows, marker strip. Each row is index + label +
two-line headline only; rows sit at `285 + i * 190`. No sub-line: the detail lives in the notes. The strip reads
**PRICE · ASSIST · INTERACT · NEGOTIATE**, with `PRICE` filled and `ASSIST` tinted on the last click.

Rows: `Boosted trees` / `Custom loss` / `Objectives`.
Hand-off line in the notes: "That is pricing. Next: Assist."

Source: Grinsztajn et al., 2022 (arXiv 2207.08815) for row 01; Huang, 2021 for row 03.

---

## Cross-section hooks

**Assumed from earlier sections:** the markers Price · Assist · Interact · Negotiate, introduced in the
intro agenda. No ML vocabulary at all. This section defines "model", "tree", "boosting", "gradient" and
"loss" from zero.

**Set up for later sections**

1. **The objective is a choice.** Rufus reuses it in `thumbs` / `trap`, Griffin in distillation, Future
   in Vending-Bench.
2. **Trained on the mistakes.** Griffin's diffusion slide can lean on the same move without re-teaching it.
3. **Self-reported versus independent.** First shown here; Rufus and Tavus depend on it.
4. **Visual grammar:** teal = no penalty / what happened, red = too high, sky = too low, orange = the one
   thing to look at, and the marker strip, whose geometry is defined on `takeaways` and copied by Rufus,
   Griffin and Tavus.
5. **No opener slide and no opener image, on purpose.** The intro's agenda names
   "01 PRICE · Airbnb Smart Pricing" a few seconds earlier. The section's one image lands on `takeaways`.

## Deliberately cut

| Cut | Why |
|---|---|
| `pipeline` ("Two models and a dial") and the old `trees` slide | Fix-pass decision; replaced by tree / boost / gbt-use. The A/B-test failure survives as one spoken sentence in `problem`. The two-model idea came back as `price-model` (see §5). |
| The fairness twist (71.3% gap reduction among adopters) | A 3-minute topic. It cannot be done honestly in 30 seconds. |
| Offline metrics: price decrease recall, booking regret | A fourth evaluation idea would bury the loss. |
| The strategy model's symbols: P × V, θ₁, θ₂, φ, the asymmetric exponential form | A second equation is banned by the kit. `price-model` shows the behaviour instead: a curve with two plain-language settings. |
| Revenue ≠ profit as a slide | One spoken sentence at the end of `results`. |
| Price Tips versus Smart Pricing, the 2012–2026 timeline, Aerosolve, micro-neighbourhoods | Product history, not technique. |
| Cold start and the listing → market → global fallback chain | Good pattern, no room. |
| Censoring, ε-insensitive loss, SPO and decision-focused losses | Vocabulary for a different audience. |
| Shrinkage ν, log loss, Friedman's function-space gradient descent | `gbt-use` teaches the arrow, not the derivation. Shrinkage shows up only as the floor under the shrinking gaps on `boost`. |

## Build checklist

- [x] `budgetSec` values are `60, 30, 35, 20, 55, 120, 60, 45` (sum 425).
- [x] Slide array order is `PROBLEM, TREE, BOOST, GBTUSE, PRICEMODEL, LOSS, RESULTS, TAKEAWAYS`.
- [x] Every `ctx.pause()` has a matching `[click]`: 3 / 2 / 3 / 1 / 4 / 6 / 2 / 2.
- [x] All CSS scoped under `.slide[data-sec="airbnb"]`.
- [x] Hidden-by-default elements revealed with `Kit.show` / `tl.to`, never `tl.from` / `Kit.rise`.
- [x] Every state-driven visual uses a state object plus a pure `render()` with `onUpdate: render`.
- [x] Every build step screenshot read in `qa/airbnb/`; print mode checked; `agent-browser errors` empty.
