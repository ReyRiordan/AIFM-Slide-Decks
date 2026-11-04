# Spec — Section 01 · Price · Airbnb Smart Pricing

**Owner file:** `sections/01-airbnb.js` (+ `css/sections/airbnb.css`, `assets/img/airbnb/`)
**Budget:** **400 s** = 60 + 30 + 35 + 35 + **120** + 75 + 45
**Section color:** red (`--sec` / `--sec-t`). Focus accent: orange.
**Slide order:** `PROBLEM, TREE, BOOST, GBTUSE, LOSS, RESULTS, TAKEAWAYS`
**Kicker:** `Price`. Section title: `Airbnb Smart Pricing`.

Headings follow the fix-pass heading map in
`/Users/reyriordan/.claude/plans/let-s-do-a-comprehensive-async-shell.md`: plain topic labels,
sentence case, no metaphors, puns or teaser questions.

| id | heading | budgetSec | pauses |
|---|---|---|---|
| `problem` | The pricing problem | 60 | 3 |
| `tree` | Decision trees | 30 | 2 |
| `boost` | Boosting | 35 | 3 |
| `gbt-use` | Gradient boosting at Airbnb | 35 | 3 |
| `loss` | The loss function | 120 | 6 |
| `results` | Results | 75 | 2 |
| `takeaways` | Takeaways | 45 | 2 |

The teaching arc, one line each:

1. **problem** — the right price is never revealed; the only feedback is the host's price and one bit.
2. **tree** — a tree is a short list of yes/no questions; one night routes down it to a booking chance.
3. **boost** — many small trees added together, each trained on what the running total still gets wrong.
4. **gbt-use** — "gradient" is the direction and size of the error; Airbnb runs one model per market,
   price is an input, and the booking chance feeds the price model.
5. **loss** — each outcome becomes a no-penalty price range; the loss penalises distance outside it.
6. **results** — nightly rate −5.7%, daily revenue +8.6%, independently measured.
7. **takeaways** — boosted trees on tables, design the loss, the objective is a choice.

---

## 1 · `problem` — 60 s

**The one idea:** Airbnb never learns what a night was worth. It sees the host's price and one bit.

On screen: price card (`ONE LISTING, ONE NIGHT` / `$ ?`), three wall cards under
`WHY HOTEL PRICING FAILS HERE`, five night tiles under `WHAT AIRBNB GETS BACK`, and the caption
`Booked or empty. Never the right price.`

Build: entrance (the question) → walls → prices → outcome glyphs + caption.

Spoken only, not on screen: Airbnb tried the textbook route and its own A/B tests showed no revenue gain.

Source: Ye et al., KDD 2018 via Colyer, 2018. Dates and prices are illustrative.

## 2 · `tree` — 30 s

**The one idea:** a tree is a short list of yes/no questions, and the leaf holds a booking chance.

Layout: label `A SHORT LIST OF YES/NO QUESTIONS` at y 280; SVG tree (1120×580) at x 120, y 340,
four rows at local y 40 / 206 / 372 / 538; legend `Each leaf gives a booking chance.` at y 922;
right column at x 1300 (`One night` card, `This tree says` card) and `One tree is a rough guess.` at y 860.

Tree: `Within 7 days?` → no → `35%`; yes → `Saturday?` → no → `55%`; yes → `Price above the median?`
→ yes → `50%`, no → `80%`.

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
`how wrong it still is`), then two notes at y 780 and 870.

State: `st.k` (trees added) and `st.in` (entrance growth). `pred = target + (50 − target) · r^k`, with a
per-night `r` between 0.62 and 0.70.

Build: entrance (flat guess, five gaps) → tree 1 → tree 2 → 200 trees.

Source: Google, Introduction to Gradient Boosted Decision Trees; Ye et al., KDD 2018 (via Colyer, 2018).
The five nights and the shrinking gaps are illustrative.

## 4 · `gbt-use` — 35 s

**The one idea:** the gradient is the direction and size of the error, and Airbnb's model turns a price
into a booking chance.

Layout: label `THE ERROR ON EACH NIGHT` at y 280; SVG (840×420) at x 120, y 340 with a zero line at
local y 210 and five arrows at local x 300 / 410 / 520 / 630 / 740, numbered 1-5 at local y 340;
caption `Each arrow is one night: which way, and how far` at local y 415; chip `A new tree is trained
to follow the arrows` at y 800.
Right column at x 960, width 840: `One per market`, `The chance a night books`, `Price is one of the
inputs` ($150 → 62%, $180 → 41%), then the chip `Booking chance → the price model` at y 906.

State: `st.g`, the arrow length as a fraction of the full error. `render()` redraws each shaft and head. The head is a fixed 26 px, and an arrow is never drawn shorter
than its own head, so small errors stay readable.

Build: entrance (arrows) → a tree follows them and they shrink to 35% → the two model cards → the
what-if prices and the hand-off chip.

No formula on this slide. The one equation in the talk is the loss, on the next slide.

Source: Google, Gradient boosting; Friedman, 2001; Ye et al., KDD 2018 (via Colyer, 2018) for one model
per market and price as an input feature. Arrow sizes and the two what-if prices are illustrative.

## 5 · `loss` — 120 s

The visual is unchanged from the approved build: the price axis, the no-penalty band, the valley, the
draggable suggestion, the booked → not-booked flip, the both-sides overlay, and the equation card.
The fix pass changed only the heading (`The loss function`) and three labels (`What happened`,
`Prices the night supports`, `The loss, in symbols`).

Source: Ye et al., KDD 2018 (via Colyer, 2018). Zone widths (×0.9, ×1.1) are illustrative.

## 6 · `results` — 75 s

Two numbers (−5.7% nightly price, +8.6% daily revenue), the causal chain, and the self-reported versus
independent contrast. Unchanged apart from the heading.

Source: Zhang, Mehta, Singh & Srinivasan, Marketing Science (2021). Airbnb's 4× claim is company-reported
and correlational, and carries the `Self-reported` flag.

## 7 · `takeaways` — 45 s

Canonical section closer: image, veil, three numbered rows, marker strip. The strip reads
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
| `pipeline` ("Two models and a dial") and the old `trees` slide | Fix-pass decision; replaced by tree / boost / gbt-use. The A/B-test failure survives as one spoken sentence in `problem`. |
| The fairness twist (71.3% gap reduction among adopters) | A 3-minute topic. It cannot be done honestly in 30 seconds. |
| Offline metrics: price decrease recall, booking regret | A fourth evaluation idea would bury the loss. |
| The strategy model's internals: P × V, θ₁, θ₂, asymmetric exponential form | A second equation is banned by the kit. |
| Revenue ≠ profit as a slide | One spoken sentence at the end of `results`. |
| Price Tips versus Smart Pricing, the 2012–2026 timeline, Aerosolve, micro-neighbourhoods | Product history, not technique. |
| Cold start and the listing → market → global fallback chain | Good pattern, no room. |
| Censoring, ε-insensitive loss, SPO and decision-focused losses | Vocabulary for a different audience. |
| Shrinkage ν, log loss, Friedman's function-space gradient descent | `gbt-use` teaches the arrow, not the derivation. |

## Build checklist

- [x] `budgetSec` values are `60, 30, 35, 35, 120, 75, 45` (sum 400).
- [x] Slide array order is `PROBLEM, TREE, BOOST, GBTUSE, LOSS, RESULTS, TAKEAWAYS`.
- [x] Every `ctx.pause()` has a matching `[click]`: 3 / 2 / 3 / 3 / 6 / 2 / 2.
- [x] All CSS scoped under `.slide[data-sec="airbnb"]`.
- [x] Hidden-by-default elements revealed with `Kit.show` / `tl.to`, never `tl.from` / `Kit.rise`.
- [x] Every state-driven visual uses a state object plus a pure `render()` with `onUpdate: render`.
- [x] Every build step screenshot read in `qa/airbnb/`; print mode checked; `agent-browser errors` empty.
