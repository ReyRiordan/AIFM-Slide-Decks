# Spec — section 05 · Next · Future

**Owner files:** `sections/05-future.js`, `css/sections/future.css`, `assets/img/future/`, `specs/future.md`
**Budget:** **225 s** = 60 (`forces`) + 45 (`engine`) + 45 (`parity`) + 30 (`avoid`) + 45 (`summary`)
**Section color:** `plum` (`--sec` `#7E4E6B`, `--sec-t` `#C99BB7`). Focus accent: `rust` (`--rust` `#D2643A` / `--rust-t` `#F08A5D`).
**Kicker:** `Next`. Section title: `Future` (it echoes the intro agenda's muted fifth row).
**Sources:** `sources/future-markets.md` (Market backdrop; §3 AI chef; §4 Supply-shock reformulation; §5 Virtual tasting panel; Recommendation). The NotCo facts reused here are sourced in `specs/notco.md`.

**Section registration**

```js
Deck.section({ id: 'future', order: 5, num: '05', kicker: 'Next', title: 'Future',
               color: 'plum', slides: [ FORCES, ENGINE, PARITY, AVOID, SUMMARY ] });
```

This is the closing section. It teaches no new technique: it spends the two techniques the deck already taught. **No roadmap slide and no `Kit.withCrumbs`.** `99-refs.js` must follow it, and the `summary` footer says so.

Dark theme throughout. Diagrams are code-drawn SVG with a rough.js cream wobble that draws itself on. Two generated photoreal images, dropped with a slight tilt. No logos in this section: the companies named on `avoid` appear as plain text.

**Restyle (Nov 2026) — matched to the Giuseppe doodle pilot**

- **Stroke weight is hierarchy.** No `sw:` numbers are left. Heavy goes on the focal shape: the cream
  formula slab (`forces`), the loop arrows and the score box (`engine`), the verdict card (`parity`),
  the money cross-outs and the Chef Robotics band (`avoid`). Normal carries the column arrows and the
  callout arrows; fine carries the dead-company cards and the panel divider. Long straight strokes
  (the cross-outs, the divider) pass `bow: .4, rough: .7` so they stay straight.
- **Hatched focal boxes.** `hatch` + a low `fillOpacity`: the score box (.15, `--sec-t`), the
  mid-sized-makers card (.2, `--sec-t`), the formula-insurance wedge (.14, `--rust-t`), the verdict
  card (.1, `--rust-t`) and the Chef Robotics band (.12, `--rust-t`). The `svg .rp-fill` rule in
  `css/sections/future.css` only paints solid fills (the formula slab); hatch comes back as
  `.rp-hatch` strokes and is unaffected.
- **Doodles must teach.** One per click, marking what the speaker is saying:
  `forces` a rust arrow and the Caveat `bending under all five` on the sagging slab;
  `engine` the Caveat `only this changes` with a rust arrow into the score box, and a rust underline
  under `Same engine. New score.`;
  `parity` a rust loop round `90%`, the Caveat `barely above chance` with an arrow to the chance rule,
  and a rust check beside `Will they notice?`;
  `avoid` the three rust cross-outs through the money raised;
  `summary` a rust underline under `Would you notice?`. Nothing decorative, no food doodles.
- **No source text.** Every `Kit.src(...)` call is gone (no provenance chips were used in this
  section). The caveats they carried are spoken: the GLP-1 share is a market estimate, the gap card is
  a trade report's reading, and the 90% figure is one study run with a toothpaste maker.
- **Content zone runs to y 1030** (no footer): the bar on `forces` sits at y 866–928 so the sag and its
  callout fill the bottom band; `engine`'s loop and caption moved down; `parity`'s verdict card is now
  806–990; `avoid` gained the rust Chef Robotics band at 700–950. Notes: 135 · 104 · 112 · 69 · 98 =
  518 words for 225 s.
- **`summary` (Rey, round 5).** The recap rows now copy the intro agenda exactly: a hatched,
  overshooting `Kit.rough.rect` number tile in the section tint (`fillOpacity` .3) and a
  `Kit.rough.line` rule under each row in the same tint, kicker in `t-h2`, one line of recap text.
  Rows are compact (y 300, step 76, rules to x 1180) because they are recap, not the hero. The close
  is the hero: `A model chose what's in it.` in `t-h2` at y 682 and `Would you notice?` at 132 px in
  `--rust-t` at y 762, with one rust underline. On the last click the tiles, rows and rules drop to
  .4 / .3 and the plate photo lifts to .62, so the empty plate becomes the stage for the question.

---

## Story spine (approve before building)

1. **The forces.** Five pressures hit food companies at the same time, so formulas are being redesigned across the industry. This is the demand, not a trend line.
2. **Bet 1 — the reformulation engine (ties to Mix).** Giuseppe's loop, pointed at a different target. Large firms license NotCo; mid-sized makers face the same pressure without the budget. The wedge is pre-computed backup formulas: "formula insurance".
3. **Bet 2 — parity testing (ties to the limits of taste prediction).** Synthetic consumers already screen concepts at about 90% of human test–retest reliability, while predicting which product people like best is near chance. The answerable question is narrower: will buyers notice the change?
4. **What not to build.** The robot chef. Money raised and lost is on the record, and the useful robots are already funded, in factories.
5. **Close.** One row per marker, each carrying the throughline — card → record, protein → vector, recipe → point — and one question for the room.

## Slides

| # | id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|---|
| 1 | `forces` | Five forces at once | 60 | 5 | — |
| 2 | `engine` | A reformulation engine | 45 | 3 | — |
| 3 | `parity` | Parity testing | 45 | 3 | — |
| 4 | `avoid` | What not to build | 30 | 2 | — |
| 5 | `summary` | Summary | 45 | 5 | — |
| | | | **225** | **18** | |

---

## 1 · `forces` — Five forces at once (60 s · 5 clicks)

**The one idea:** five separate pressures are pushing on the same thing, the formula, and all of them arrived at once.

### On screen

Five columns push down onto one bar.

| column | caps name | number (mono) | label |
|---|---|---|---|
| 1 | `WEIGHT-LOSS DRUGS` | `12.4%` | `of US consumers, up from 5.8% in 2024` |
| 2 | `DYE RULES` | `6 dyes` | `FDA target, end of 2026` |
| 3 | `COCOA` | `$12,931 → $6,771` | `per tonne, peak to Aug 2026` |
| 4 | `TARIFFS` | *(no number)* | `a top planning risk` |
| 5 | `HEALTH PLANS` | `13 states` | `pay for food as treatment` |

Sub-line at the top: `TRADE PRESS CALLS 2026 "THE GREAT REFORMULATION"`. Bar label: `one formula`.

Body text on screen: 22 words across five labels, none of them a sentence.

### Layout

- Sub-line `t-caps`, `--text-3`, at **(120, 290)**.
- SVG, 1680 × 660, at **(120, 320)**. Local coordinates below.
  - Five columns, each 300 wide, left edges at local x 0 / 345 / 690 / 1035 / 1380.
  - Per column: caps name at local y 40 (28 px, `--text-2`), mono number at local y 90 (52 px, `--plum-t`; column 4 leaves this line empty), label at local y 160 (28 px, `--text-3`, two lines, max width 290).
  - Arrow per column: a rough.js cream stroke from local y 250 down to y 470, arrowhead at the bottom, 3 px.
  - The bar: a cream rough.js rect from local (0, 500) to (1680, 560), label `one formula` centered inside it in `t-label`, `--bg` on cream.
  - A small generated image `assets/img/future/candy.jpg`, 180 × 180, dropped at local (690 + 60, 20) behind column 2's text at 70% opacity, rotated 3°. It is the only image here and it carries the dye column.
- Nothing extends below y 900, so the footer stays clear.

### Build

- **Entrance:** the bar draws itself and `one formula` lands. Nothing else is on screen, so the bar is clearly the subject.
- **Clicks 1–5:** one column per click, in the table's order. Each click writes the caps name, counts the number in (`Kit.count` where it is a single value), draws the arrow down to the bar, and **deepens the bar's bow by 6 px** (a `state.load` value 0 → 5 driving a pure `render()` that redraws the bar path). The bow is the point: the slide shows accumulation, not a list.
- The candy image drops in with click 2 only.

### Spoken only

- GLP-1 users cut grocery spending 5.3% and savoury snacks 10.1%; 75% prioritize protein and 69% fibre. The Hartman advice is to reformulate rather than add a "GLP-1 friendly" badge.
- The dye target is voluntary, but Red 3 is formally revoked with January 2027 compliance, West Virginia bans the major dyes from January 2028, and more than 75 state bills were filed last year. Natural colors fade with heat, light and pH, carry flavor, cost more, and blue is the hardest shade to match.
- Cocoa moves both ways: Nestlé cut cocoa so far in the UK that Toffee Crisp could no longer be called chocolate, and when prices fell Hershey said it would add cocoa back.
- The Supreme Court struck down the IEEPA tariffs on 20 February 2026, and tariffs are still a top planning risk.
- Medicare's MAHA ELEVATE model is $100M for up to 30 organizations, first cohort autumn 2026, and it cannot pay for the food itself.
- **Medically tailored meals (spoken only, in full):** the third opportunity in the report is a design engine for medically tailored meals. More than 6 million people have diet-sensitive conditions these meals could help, one study put first-year savings from nationwide programs at $32.1 billion, and today a registered dietitian hand-builds every menu. It is the best health-care option but the slowest sale, so it stays in the notes.

### Source

- 12.4%: "About 12.4% of US consumers now take GLP-1 drugs, up from 5.8% in 2024. Users cut grocery spending 5.3% and savory snacks 10.1%; 75% prioritize protein and 69% fiber" — `future-markets.md`, Market backdrop ([FoodNavigator, Hartman data](https://www.foodnavigator.com/Article/2026/03/02/glp-1s-impact-on-food-packaging-and-product-strategy/)).
- 6 dyes: "The FDA wants six petroleum dyes out by end-2026. That target is voluntary, but Red 3 is formally revoked (January 2027 compliance), West Virginia bans the major dyes statewide from January 2028, and more than 75 state dye bills were filed last year" — same section ([Food Industry Executive](https://foodindustryexecutive.com/2026/06/the-reality-of-reformulating-out-of-synthetic-dyes/)).
- Cocoa: "Cocoa fell more than 50% from its US$12,931/t peak, then spiked to US$6,771/t in late August 2026 and was rising again in October" — same section ([ConfectioneryNews](https://www.confectionerynews.com/Article/2026/10/06/the-future-of-cocoa-climate-change-supply-risks-and-the-new-era-of-volatility/)). The on-screen `$12,931 → $6,771` is peak, then the late-August 2026 spike after the fall; the notes must say that the arrow is not one continuous decline.
- Tariffs: "tariffs and sourcing remain a top planning risk for manufacturers" — same section ([Food Industry Executive](https://foodindustryexecutive.com/2026/02/food-exec-brief-tariff-whiplash-reformulation-pressure-and-the-glp-1-mandate/)).
- 13 states: "13 states have approved Medicaid waivers for Food is Medicine services" — same section ([Episcopal Health Foundation](https://www.episcopalhealth.org/wp-content/uploads/2026/05/MA-and-NC-Medicaid-Results_Texas-MCO-NMDOH-LC-Slides.pdf)).
- The quoted phrase: "Trade press is calling 2026 'the great reformulation' ([Food Processing](https://www.foodprocessing.com/business-of-food-beverage/industry-outlook/podcast/55343616/2026-a-turning-point-for-processors-on-health-tech-and-consumer-trends))".
- `Kit.src('GLP-1: Hartman via FoodNavigator, Mar 2026. Dyes: Food Industry Executive, Jun 2026. Cocoa: ConfectioneryNews, Oct 2026. Medicaid: Episcopal Health Foundation, 2026. Candy: illustration.')`.

### Images

- `candy.jpg` — subject: a small scatter of brightly colored candy shells, strong reds, blues and yellows, on the deck's slate under warm side light. Generic, no branding, no text.

---

## 2 · `engine` — A reformulation engine (45 s · 3 clicks)

**The one idea:** the first bet is Giuseppe's loop with a different score, sold to the makers who cannot build it themselves.

### On screen

| element | exact text |
|---|---|
| caps sub-line | `BET 1` |
| loop labels (reused from Mix) | `point on the map` → `decode` → `score` → `steer` |
| score box, before | `how close to milk` |
| score box, after | `cost · label · shelf life · allergens` |
| gap card | `THE GAP` / `same pressure, a fraction of the IT budget` |
| wedge card (rust) | `Formula insurance` / `backup formulas, computed before the shock` |

Body text on screen: 17 words, counting the score box's four constraint words.

### Layout

- `BET 1` — `t-caps`, `--plum-t`, at **(120, 290)**.
- Loop SVG, 1040 × 420, at **(120, 350)**: the Mix `steer` loop redrawn small, same shapes and same four labels, in cream rough strokes, running clockwise. The `score` box sits at local (620, 230), 380 × 120, so it has room to grow when its label changes.
- Right column, x 1240 → 1800.
  - Gap card at **(1240, 350)**, 560 × 200.
  - Wedge card at **(1240, 600)**, 560 × 240, rust outline, title in `--rust-t`.
- Caption at **(120, 840)**: `Same engine. New score.` — `t-h2`, `--text`.

### Build

- **Entrance:** the loop draws itself with the Mix labels, the `score` box reading `how close to milk`. The audience should recognize it before anything changes.
- **Click 1:** the gap card rises. This names the buyer before the product.
- **Click 2:** the `score` box's label swaps to `cost · label · shelf life · allergens` (`Kit.swap`), the box widens to fit, and the caption `Same engine. New score.` lands. One change, and it is the whole teaching point of the slide.
- **Click 3:** the wedge card rises in rust.

### Spoken only

- The report's verdict: the reformulation engine is the strongest demand pull of any idea it scored, and it is the one I would build first.
- Who is already there: NotCo licenses Giuseppe to large firms; Proxy Foods AI raised a $6M seed in August 2026; AKA Foods raised $17.2M; NobleAI sells science-based AI for reformulation; Ingredion models which ingredients a tariff would hit.
- It works when it is tried: McCormick reports flavor development 20 to 25% shorter, and Unilever built a Knorr paste in about half the usual time.
- Why "insurance": cocoa halved and then spiked again inside two years, so brands need to move both ways fast. Pre-qualified backup formulas are the thing to sell.
- The moat is the outcome data: every validated swap records whether it passed shelf life, whether consumers noticed, and whether it caused a label error.
- The risks: customer data is messy, lab validation costs money, and ingredient suppliers such as Cargill and Ingredion give formulation help away to sell ingredients. Swaps also create new risk — a reformulated plant-based chocolate bar drew a Class I recall in January 2026 for undeclared hazelnut.
- Shelf-life prediction and allergen change control are the two modules worth building in, which is why they are already in the score box.

### Source

- The bet: "**Build the reformulation engine first, add parity testing second** … All three are software-led, have buyers under deadline pressure now, and have funded competitors but no default tool" — `future-markets.md`, Recommendation.
- The gap card's words are a quotation: "Mid-sized manufacturers face the same pressure with 'a fraction of the IT budget,' and their data sits across ERPs, plant systems and spreadsheets ([Food Industry Executive](https://foodindustryexecutive.com/2026/02/food-exec-brief-tariff-whiplash-reformulation-pressure-and-the-glp-1-mandate/))" — §4.
- Formula insurance: "**Wedge offer:** 'Formula insurance': pre-qualified backup formulas for a brand's most exposed products (cocoa, dyes, tariffed inputs), refreshed as prices and rules move" — Recommendation §1.
- The score box's constraints: "Upload a formula, constraints and supplier list; get ranked substitute formulas with predicted cost, nutrition, shelf-life risk, allergen and label changes, and a change-control record" — Recommendation §1.
- McCormick and Unilever: "McCormick reports 20 to 25% shorter flavor development, and Unilever built a Knorr paste in about half the usual time ([Complete AI Training](https://completeaitraining.com/news/ai-cuts-food-rd-time-but-humans-still-decide-what-tastes/))" — §4.
- `Kit.src('Opportunity assessment and the "formula insurance" wedge: market report, Nov 2026, from Food Industry Executive (Feb 2026) and the sources cited there.')`.

### Images

None. The loop is code-drawn and must match the Mix section's shapes.

---

## 3 · `parity` — Parity testing (45 s · 3 clicks)

**The one idea:** models can already screen concepts, they cannot rank what people will like best, and the question in between — will buyers notice? — is the one worth selling.

### On screen

| element | exact text |
|---|---|
| caps sub-line | `BET 2` |
| panel A caps | `SCREENING CONCEPTS` |
| panel A number | `90%` / `of human test-retest reliability` |
| panel B caps | `PREDICTING THE FAVORITE` |
| panel B bars | `33%` `ranked first` · `67%` `in the top three` |
| panel B reference | `about 36% by chance (top three)` |
| verdict card (rust) | `Will they notice?` / `parity, not liking` |

Body text on screen: 17 words. The two panels are one chart grammar: one series, one hue, values direct-labeled, the chance line a recessive dashed cream rule.

### Layout

- `BET 2` — `t-caps`, `--plum-t`, at **(120, 290)**.
- Panel A, x 120 → 880, y 350 → 700: caps label at the top, a single horizontal bar from x 140 to x 820 at y 470 (height 40, `--plum`, rounded at the data end only), `90%` direct-labeled at the tip in mono 52 px, the caption under the bar at y 560.
- Panel B, x 960 → 1800, y 350 → 700: the same bar grammar, two bars at y 440 and y 530 scaled on the same 0–100% axis as panel A, `33%` and `67%` direct-labeled at their tips. The chance rule is a dashed cream vertical at 36% of the axis, drawn behind the bars, labeled `about 36% by chance (top three)` at y 640 in 28 px `--text-3`.
- A vertical hairline at x 920 separates the panels, so the two are read as different questions, not one scale of goodness.
- Verdict card at **(120, 760)**, 1680 × 170, rust outline: the question in `t-h1` `--rust-t` on the left, `parity, not liking` in `t-label` on the right.

### Build

- **Entrance:** both panel titles and the empty 0–100% axis of each panel, plus the dashed chance rule in panel B. No framed box is ever empty of content: the axes and the chance rule are content.
- **Click 1:** panel A's bar grows to 90% and its caption lands.
- **Click 2:** panel B's two bars grow to 33% and 67%, the chance rule turns rust and takes its label. The relationship on screen is the gap between 67% and 36%, and how small it is next to panel A.
- **Click 3:** the verdict card rises.

### Spoken only

- Panel A's evidence: LLM "synthetic consumers" reached 90% of human test-retest reliability across 57 product surveys with 9,300 human responses (PyMC Labs and Colgate-Palmolive). BCG reports 92% accuracy predicting real choices for a new beverage, and Ipsos has validated digital twins for concept screening.
- Panel B's benchmark: 21,000-plus sensory evaluations of 215 plant-based products, from the Food Intelligence Lab.
- UC Davis sensory scientist Julien Delarue says predicting perception from a complex mixture is not possible with current approaches. That is the honest reading of panel B.
- Why parity is the tractable middle: it has clear ground truth from standard difference tests, it is narrower than predicting liking for something new, and it sells to the same buyer as bet 1 — every reformulation needs evidence that loyal buyers will not notice.
- The competition is NielsenIQ, which bought Analytical Flavor Systems in 2025, and Ipsos. Sell it as narrowing what goes to human panels, not as replacing them.

### Source

- 90%: "LLM 'synthetic consumers' reached 90% of human test-retest reliability across 57 product surveys with 9,300 human responses ([PyMC Labs and Colgate-Palmolive paper](https://arxiv.org/html/2510.08338v2))" — `future-markets.md` §5. Note the precise claim: **90% of human test-retest reliability**, not 90% accuracy.
- 33 / 67 / 36: "On a benchmark of 21,000+ sensory evaluations of 215 plant-based products, the Food Intelligence Lab's model ranked the humans' favorite first 33% of the time and in its top three 67% of the time, against about 36% by chance ([IFT](https://www.ift.org/food-technology-magazine/can-ai-predict-deliciousness))" — §5. **Flag:** the report does not say which of the two figures the 36% baseline belongs to. Read in context it is the top-three comparison (a 36% chance of landing in a top three implies roughly eight candidates; a 36% chance of a correct first pick would not), so the slide labels it `about 36% by chance (top three)` and never pairs it with the 33%. If Rey wants the stronger framing, the alternative is to show only `67% vs about 36% by chance`. **This needs Rey's call.**
- The bet: "**The gap:** Parity prediction, meaning will consumers notice that a product was reformulated? It is narrower than predicting liking for something new, has clear ground truth from standard difference tests, and sells to the same buyers as idea 4" — §5.
- `Kit.src('Concept screening: PyMC Labs and Colgate-Palmolive, 57 surveys, 9,300 human responses. Taste ranking: Food Intelligence Lab, 215 plant-based products, 21,000+ evaluations, via IFT.')`.

### Images

None.

---

## 4 · `avoid` — What not to build (30 s · 2 clicks)

**The one idea:** the robot chef has a graveyard behind it, and the robots that do work are already funded and already inside factories.

### On screen

| element | exact text |
|---|---|
| caps sub-line | `THE ONE I WOULD NOT START` |
| card 1 | `Zume` / `~$500M raised` / `collapsed; assets sold to Miso Robotics, Jun 2026` |
| card 2 | `Picnic` / `~$50M raised` / `wound down May 2026` |
| card 3 | `Karakuri` / `sold for £350,000` |
| closing line (rust) | `In food plants, the robots work.` |
| closing number | `$43.1M` / `Chef Robotics Series A · 44M+ servings` |

Body text on screen: 19 words, all of them outcomes.

### Layout

- `THE ONE I WOULD NOT START` — `t-caps`, `--text-3`, at **(120, 290)**.
- Three cards at y 350, 540 × 300, at x 120 / 690 / 1260. Each: name in `t-h2`, money in mono 52 px `--text-2`, outcome in `t-label` `--text-3`.
- Closing line at **(120, 720)**, `t-h2`, `--rust-t`; the closing number at **(120, 800)**, mono 76 px, with its label in `t-label` to the right, baseline aligned.

### Build

- **Entrance:** card 1 complete (name, money, outcome).
- **Click 1:** cards 2 and 3 land in sequence (.2 s stagger), and all three money figures dim to `--text-3` while a cream rough stroke crosses each card's money line. The change is money in, nothing out.
- **Click 2:** the closing line and `$43.1M` land in rust, and the three cards drop to 55% opacity. The contrast is the point: the same robots, a different place.

### Spoken only

- Picnic left one customer with a $250,000 "robot aquarium". It had raised about $50M.
- The consumer end is worse, not better: Samsung Food offers more than 160,000 recipes in 104 countries and is free, LG's oven camera identifies more than 85 dishes, and startups are competing with free. That is the app from the first section of this talk.
- Chef Robotics is the counterexample worth naming: $43.1M Series A for meal-assembly robots inside food plants, more than 44 million servings reported. That model works and is already being built out.
- What else I would not start: standalone 3D food printing hardware, and new-ingredient discovery without a fermentation partner and a long runway.

### Source

- Zume: "Zume collapsed after raising about $500M, and Karakuri sold for £350,000 ([Yahoo Finance UK](https://uk.finance.yahoo.com/news/ocado-backed-robot-chef-sold-160603841.html)). Miso Robotics bought Zume's assets in June 2026 ([Dealroom](https://dealroom.co/news/137782-miso-robotics-acquires-pizza-robotics-pioneer-zume/))" — `future-markets.md` §3.
- Picnic: "Pizza-robot maker [Picnic](https://www.geekwire.com/2026/robot-pizza-startup-runs-out-of-dough-picnic-shuts-down-sells-assets-to-mystery-buyer/) (about $50M raised) wound down in May 2026, leaving one customer with a $250,000 'robot aquarium'" — §3.
- Chef Robotics: "[Chef Robotics](https://www.therobotreport.com/chef-robotics-brings-in-43m-to-deploy-more-food-assembly-robots/) raised a $43.1M Series A for meal-assembly robots in food plants and reports more than 44 million servings ([Pulse 2.0](https://pulse2.com/chef-robotics-43-million-series-a-raised-for-ai-enabled-robotic-systems-for-meal-assembly))" — §3.
- Samsung Food: "[Samsung Food](https://news.samsung.com/ca/samsung-announces-global-launch-of-samsung-food-an-ai-powered-personalized-food-and-recipe-service) offers 160,000+ recipes in 104 countries and sends them to Samsung ovens" — §3.
- `Kit.src('Zume, Picnic, Karakuri and Chef Robotics figures: GeekWire, Dealroom, Yahoo Finance UK and The Robot Report, 2026.')`.

### Images

None. A photo would soften a slide whose job is three failures stated plainly.

---

## 5 · `summary` — Summary (45 s · 5 clicks) · the deck's close

**The one idea:** every section did the same thing, turning food into something a machine can search, and the room should decide how it feels about that.

Rendered with the engine heading `Summary` (the plan's heading map lists it), then four rows and the question.

### On screen

Four rows, one per section marker, in the agenda's colors and order. Each row is a color chip, the marker word, and one sub-line carrying the throughline.

| row | chip | marker | sub-line |
|---|---|---|---|
| 1 | teal | `READ` | `a recipe card becomes a typed record` |
| 2 | olive | `FIND` | `a protein becomes a vector` |
| 3 | saffron | `MIX` | `a recipe becomes a point on a map` |
| 4 | cranberry | `SELL` | `the engine outlived the food` |

Then the close, in two lines: `A model chose what's in it.` / `Would you notice?` (the second in rust).

`Next` has no row. It is the muted "What's next" row in the agenda and the section the room is sitting in.

### Layout

- **The row geometry is the intro agenda's, copied, not re-derived.** `specs/intro.md` owns the constants; this slide reuses `ROW_Y`, the chip size and skew, and the label and sub-line x positions. If the intro moves a constant, move it here too. **Open item:** `specs/intro.md` does not exist yet, so the builder of this section must take the numbers from the intro section file at build time rather than inventing them.
- Working values until the intro spec lands: rows at y 368 / 498 / 628 / 758; chip 72 × 38, radius 10, skewed −12°, at x 130; marker in `t-h2` at x 232; sub-line in `t-label` `--text-2` at x 232, 48 px under the marker's top.
- Close lines at **(120, 880)** and **(120, 950)**, `t-h2` then `t-h1` in `--rust-t`.
- Background `assets/img/future/close-table.jpg`, `right 8% / cover`, opacity .30, lifting to .55 on the last click. Scrim solid to 52% of the width, zero at 78%, so every sub-line sits on flat slate.
- Footer: the five source-report names plus `references follow`, so `99-refs.js` must follow this section.

### Build

- **Entrance:** the heading and the four empty chips in their colors, at 35% opacity. The shape of the agenda is recognizable before any word lands.
- **Clicks 1–4:** one row per click. The chip comes to full opacity, the marker word and its sub-line write on, and the matching half of the sub-line (`card`, `protein`, `recipe`) is tinted in the row's color so the three transformations read as one pattern.
- **Click 5:** both close lines rise, the background image lifts to .55, and the four rows drop to 70% so the question owns the frame.

### Spoken only

- The throughline in one sentence: each section made food more abstract, from a typed record to a vector to a point on a map, and each step is what let a machine search it.
- Where the limits are: the scanner invents lines, the protein search only finds what is near something that already works, and the taste model cannot rank a favorite. None of this removes the cook.
- The close is a question for the room, not a claim. Hold the slide through Q&A.

### Source

- No new facts. The sub-lines restate what each section taught, and their evidence is cited in `specs/samsung.md`, `specs/shiru.md`, `specs/giuseppe.md` and `specs/notco.md`.
- `Kit.src('Sources: Samsung Food, Shiru, Giuseppe, NotCo and market reports, Nov 2026. References follow. Table: illustration.')`.

### Images

- `close-table.jpg` — subject: an overhead of a plain dark plate with a few raw ingredients beside it (a bean, a leaf, a pod) on the deck's slate, warm side light, generous empty space on the left two thirds. No text, no branding, no hands.

### Closing question (settled)

Rey chose `A model chose what's in it.` / `Would you notice?`, which ties back to the parity slide.

---

## Build notes (as built)

The section was built to this spec with these changes. Budgets, slide count, clicks and every number are unchanged (225 s, 5 / 3 / 3 / 2 / 5 clicks).

- **`forces`:** the bar is a cream rough.js slab that **sags** under each click (`state.load` → a redrawn path), instead of a rect whose bow deepens; the label `ONE FORMULA` rides the sag. The cocoa number is set on two lines (`$12,931` / `→ $6,771`) so it fits a 300 px column, and the tariffs column shows a cream em dash in the number slot so the five columns keep one grid. The candy is a **cut-out** (`candy.webp`), not a `.jpg` behind the text: it drops beside the dye column's arrow at (446, 650), where it collides with nothing.
- **`engine`:** the score box is drawn at its final width (540 px) from the start and only its text swaps, so no box has to grow; the new score is set on two lines (`cost · label` / `shelf life · allergens`). The box's outline turns saffron on the swap, which ties it back to Mix. The loop runs clockwise: `point on the map` → `decode` → `score` → `steer`.
- **`parity`:** both panels share one grammar — a 0–100% cream track, one plum bar, the value direct-labelled at the tip. Panel A's single bar is vertically centred against panel B's two, and panel A carries its evidence line (`57 surveys, 9,300 human responses`) where panel B carries the chance label. The chance rule is drawn as **two dashed segments**, one beside each bar, so it never crosses a label; `33%` is set clear of it. Rey's call stands: the baseline is labelled `about 36% by chance (top three)` and is never paired with the 33%.
- **`avoid`:** the three cards share one grammar (name / figure / one outcome line). Karakuri's figure is its sale price, so the cream cross-out stroke falls only on the two **raised** figures, Zume's and Picnic's; all three figures dim. `$43.1M` is set in Fraunces at 76 px rather than mono, since mono is reserved for data in this deck. The Miso Robotics sale and Picnic's "robot aquarium" moved to the notes.
- **`summary`:** the row geometry is copied from `sections/00-intro.js` (`.ag-*`): rule, 26 px round chip, mono number, `t-h2` marker in a 360 px column, sub-line in the product-name slot. The markers keep the agenda's casing (`Read`, not `READ`), the numbers `01`–`04` are kept, and the throughline replaces the product name. Rows sit at y 330 + 92 i to leave the close its own space.

## Review pass (as fixed)

- **`engine`:** the gap card's tag is `Mid-sized makers`, not `The gap`, so the slide names the buyer instead of an abstraction (the body line is unchanged and still quotes §4).
- **`parity`:** only one dashed chance rule is drawn, beside the `in the top three` bar, and it is drawn over the bars (y 610 → 672) so the 67% vs about 36% comparison is visible. The rule beside the `33%` bar is gone: the source does not support a 36% baseline for a first-place pick, and Rey's call is that the baseline is never paired with 33%. `33%` is direct-labelled at its bar tip.
- **`parity`:** panel A's caption `of human test-retest reliability` moved below the bar and now lands with the number on click 1, so the slide never shows a dangling `of …` over an empty track. The panel's small line defines the term in plain words: `the same human, asked twice` (the `57 surveys, 9,300 human responses` evidence stays in the source footer).
- **`avoid`:** the cross-out strokes sit on the money line (y 492 → 476) and are cut to each figure's width, so they no longer clip the company name above.

## Cross-section hooks

**Assumed from earlier sections:** the markers Read · Find · Mix · Sell · Next and their colors; the Giuseppe loop (point → decode → score → steer), reused on `engine`; the limits of taste prediction from the Mix section; Samsung Food from the Read section, named once in `avoid`'s notes; and the NotCo bridge question, which `forces` answers.

**Set up for nothing.** This is the last section before the references appendix.

## Deliberately cut

| Cut | Why |
|---|---|
| Medically tailored meals as a slide | A third bet needs its own problem, buyer and evidence. It survives as spoken-only content on `forces`. |
| 3D food printing and dysphagia meals | A niche with hardware barriers; the report itself calls it a module of another idea. |
| AI-discovered functional ingredients (idea 6) | The Shiru section already taught it. Repeating it as a "bet" would read as a second Shiru. |
| Digital flavor and aroma design, Osmo's $70M | "Watch, don't start" is not a teaching point worth 30 seconds. |
| Shelf-life prediction and allergen change control as slides | Both appear as two words inside `engine`'s new score box, which is where the report puts them. |
| The nine-idea scoring table and the 2×2 | A table of judgements is not one idea per slide. |
| Market-size forecasts | None are in the report, and the deck does not need them. |

## Checklist

- [ ] Headings match the plan's heading map: `Five forces at once`, `A reformulation engine`, `Parity testing`, `What not to build`, `Summary`.
- [ ] No roadmap and no `Kit.withCrumbs` in this section (by design; the plan lists no crumbs for Next).
- [ ] Every number has a `Kit.src` footer: 12.4%, 6 dyes, $12,931 → $6,771, 13 states, 90%, 33% / 67% / 36%, ~$500M, ~$50M, £350,000, $43.1M.
- [ ] The 36% baseline is labeled as the top-three comparison and never paired with the 33%.
- [ ] `[click]` count equals `ctx.pause()` count: 5 / 3 / 3 / 2 / 5.
- [ ] `budgetSec` sums to 225, and the notes run about 135 words per minute (≈ 506 words total).
- [ ] `summary` row geometry is copied from the intro agenda, not re-derived.
- [ ] `99-refs.js` follows this section and the `summary` footer says so.
- [ ] Both generated images are photoreal generic food on slate, carry no text, and are labeled as illustrations in the footer.
- [ ] All CSS scoped under `.slide[data-sec="future"]`.
- [ ] Hidden-by-default elements use `Kit.show` or `tl.to`, never `tl.from` / `Kit.rise`.
- [ ] Every build step screenshotted at 1920×1080, `agent-browser errors` empty, print mode shows each final state.

## Deck-wide QA pass (v1)

- `forces`, tariffs column: the number slot held a cream em dash, which read as missing data on a
  projector. It now reads **Feb 2026** with the label "struck down, still a top risk"
  (future-markets.md, line 32: the Supreme Court struck down the IEEPA tariffs on 20 Feb 2026, but
  tariffs stay a top planning risk). The spoken note already said this and is unchanged. The dead
  `.fu-dash` rule was removed from `css/sections/future.css`.
- `forces`, sub-line: straight quotes around "the great reformulation" became curly quotes, matching
  the rest of the deck.
