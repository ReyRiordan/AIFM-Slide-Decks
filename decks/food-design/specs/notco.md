# Spec — section 04 · Sell · NotCo

**Owner files:** `sections/04-notco.js`, `css/sections/notco.css`, `assets/img/notco/`, `specs/notco.md`
**Budget:** **165 s** = 40 (`origin`) + 50 (`pivot`) + 45 (`today`) + 30 (`bridge`)
**Section color:** `cranberry` (`--sec` `#A8443A`, `--sec-t` `#E58A7E`). Focus accent: `rust` (`--rust` `#D2643A` / `--rust-t` `#F08A5D`, the kit's focus-accent slot).
**Kicker:** `Sell`. Section title: `NotCo`.
**Sources:** `sources/notco-company.md` (Summary; Founders and origin; History and timeline; Technology: Giuseppe and NotCo AI; Partnerships and markets; Challenges), `sources/giuseppe.md` §2 (context and timeline), §8 (adoption by other companies).

**Section registration**

```js
Deck.section({ id: 'notco', order: 4, num: '04', kicker: 'Sell', title: 'NotCo',
               color: 'cranberry', slides: [ ORIGIN, PIVOT, TODAY, BRIDGE ] });
```

This section follows the Giuseppe section, which already taught the technique (the recipe map, the score, the search, the diet rules). It teaches **no new ML**. It is the company story, told in four fast slides, and it hands over to Next. There is **no roadmap slide and no `Kit.withCrumbs`** here: there are no steps to track.

Dark theme throughout. Diagrams are code-drawn SVG with a rough.js wobble in cream strokes that draw themselves on (`Kit.draw`). The three generated images are photoreal generic food on matching slate, dropped in with a slight tilt (`Kit.drop`). No founder photos. **As built, the section uses no logo at all:** the Ferrero card names the company in the deck's own type, so nothing on screen imitates a brand mark.

**Built-state changes from the plan below (Nov 18, built under Rey's "full freedom"):**
1. `pivot` drops the shared 2022 → 2026 time axis. Placing five markets on a real time axis crowded four of them into 2026, and an axis that chips were not aligned to would have been misleading. The two lanes are now separated by a cream rough rule, and every date is written on the chip or its exit tag.
2. `pivot` splits `Argentina + Uruguay` into two chips, so all six market names fit on one line each (the two-line chip collided with its own strike-through). Both carry the same exit tag, and both are struck in the same beat, so the slide still shows four exits.
3. `pivot` drops the connector from `US + Canada` down to the Kraft Heinz JV chip. The JV (2022) and the hand-over of US sales (2025) are different events, and one line between them read as cause.
4. `origin` gives each founder row a thin cranberry rule, which carries the left column across the page.
5. `bridge` drops the rough arrow leaving the frame on click 1: on a statement slide it read as decoration. The image fades to 50% instead.

**Review pass (Nov 18, reviewer):**
6. `origin`: the `$1.5B` chip is painted after the photo (its own dark plate, then its own `<svg>`, then the text). The chip's cranberry outline was hidden behind the plate and the photo, so only a stray stroke showed at the top right.
7. `pivot`: the US and Canada exit tag reads `Kraft Heinz sells it, Feb 2025`. `to Kraft Heinz` read as a sale; the source says Kraft Heinz took over *selling* the brand there.
8. `pivot`: `Kraft Heinz JV` is written out as `Kraft Heinz joint venture`. "JV" is not a term this audience knows.
9. `today`: the Ferrero card's frame is drawn on click 1 with its two lines, not at the entrance, so no empty box ever sits on the slide. `Ferrero` alone captions the photo until then.
10. `today`: the grouping bracket moved from y 798 to y 842 and the `the AI business` callout from y 824 to y 876, so the bracket no longer reads as an underline of `of revenue, from AI`.
11. `today` notes gain one sentence (NotCo's largest contract, $30M over 18 months) to bring the section's script closer to the 135 wpm target.
12. The four exits run left to right by geography, not strictly by date (Mexico's month is deliberately unstated on screen), so nothing on the slide claims date order.

**Restyle (Nov 2026) — matched to the `giuseppe` doodle pilot**

- **Stroke weight is hierarchy.** No `sw:` numbers are left; the local `tileRect` helper now takes
  `w` / `hatch` / `fillOpacity`. Heavy goes on what the slide is about: the `$1.5B` chip (`origin`),
  the AI lane's three cards (`pivot`), the Ferrero card (`today`). Normal carries the supporting
  structure (the NotMayo card, the Giuseppe arrow, the food-market tiles, the exit strike-throughs,
  the grouping bracket). Fine is detail only: the two founder rules and the lane divider, in `--text-3`.
  Long straight strokes — the strike-throughs, the founder rules and the divider — pass `bow: .4, rough: .7`.
- **Hatched focal boxes.** `hatch: 'var(--sec-t)'` shades the NotMayo card (.14), the `$1.5B` chip (.2,
  a small panel), the three AI cards (.14) and the Ferrero card (.12).
- **Doodles must teach.** Each one marks what the speaker says at that click, in rust or the section
  tint, and nothing else is drawn: `origin` a rust ellipse round `8%` (click 2) and the existing Caveat
  callout + arrow to `Giuseppe` (click 1); `pivot` a cranberry underline under `Giuseppe is the product.`
  (click 4) — the market exits are already carried by the rust strike-throughs; `today` a rust underline
  under `7 of 20` (click 2) and one under `~half` (click 3); `bridge` a rust ellipse round `90%` (click 1)
  and a cranberry underline under `Who else needs it?` (click 2). No food doodles, no sparkles, no loops round photos.
- **No source text.** Every `Kit.src` call is deleted, as are the `ESTIMATE` chip on `today` and the
  `SELF-REPORTED` chip on `bridge` (and their CSS). The caveats are now spoken: the 8% share comes from
  press, not NotCo (`origin`); Mexico is a press report NotCo has never confirmed (`pivot`); the revenue
  split is an estimate (`today`, already in the notes); the 90% figure is NotCo's own and unchecked (`bridge`).
- **Content zone runs to y 1030** (no footer): `pivot`'s closing caption carries its underline at y 988,
  and `today`'s two numbers are spaced down the full column (352 / 686) so it ends level with the Ferrero card.

**Round 2 (Rey, after the first restyle):**

- `today`: the `the AI business` bracket and its Caveat are **cut** — Rey read the bracket as floating,
  with nothing clearly grouped above it. Each number now carries its own rust underline and its own plain
  label, which is the grouping. Click 3 still reveals `~half`, so the pause count is unchanged (3).
- `bridge` was "quite empty and boring", so the 90% figure became the slide's visual: the milk photo
  (280 px, captioned `the food business`) → a heavy chalk arrow → `90%` in cranberry with a rust ellipse,
  → a split bar for `NOTCO AI REQUESTS · 2025`: a heavy, sec-tint-hatched segment labelled `not plant-based`
  (90%) and a fine `--text-3` sliver labelled `plant-based` through a fine leader tick. The scrim and the
  full-height dim photo are gone. Beats unchanged: entrance = the two statement lines + the photo,
  click 1 = the whole split (the number counts up), click 2 = `Who else needs it?` with its underline.
  The 90/10 split is the source figure; no other number was invented.
- **Layout fixes found in QA:** the six food tiles are 250 px on a 286 px pitch (was 268 on 282), so the
  overshooting corners no longer merge into one bar; the `8%` label moved to x 1384 to clear its ellipse;
  `7 of 20` takes an underline rather than a loop, because an ellipse round a wide, short number at the
  x 120 margin always breaks the margin or crosses the glyphs.

## Story spine (approve before building)

The arc is **the AI outlived the milk**.

1. **Problem (for the company, not for the ML):** NotCo built Giuseppe to design its own food. The food business is the part that failed.
2. **Why this slot in the talk:** the audience has just watched Giuseppe design milk from pineapple and cabbage. The obvious next question is what happened to the company that did it.
3. **How the story runs:** 2015 Santiago, a mayo brand with an AI → 2022–2025 the AI gets sold to other food makers → 2026 almost every food market is sold or closed, Chile aside → today Giuseppe is the product.
4. **Results (the snapshot, two numbers):** 7 of the 20 largest packaged-goods companies work with NotCo (Forbes, March 2026); about half of revenue comes from AI (estimate).
5. **Hand-off:** the technique outlived the product it was built for, so who else needs it? That question opens Next.

No takeaways slide: the transferable lessons for this technique were taken on the Giuseppe `takeaways` slide. This section ends on the bridge.

## Slides

| # | id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|---|
| 1 | `origin` | Where NotCo came from | 40 | 3 | — |
| 2 | `pivot` | From food to software | 50 | 4 | — |
| 3 | `today` | NotCo today | 45 | 3 | — |
| 4 | `bridge` | *(none: statement slide)* | 30 | 2 | — |
| | | | **165** | **12** | |

---

## 1 · `origin` — Where NotCo came from (40 s · 3 clicks)

**The one idea:** NotCo started as a food brand, and Giuseppe existed to design that brand's products.

### On screen

| element | exact text |
|---|---|
| caps sub-line | `SANTIAGO, CHILE` |
| big year | `2015` |
| founder row A | `Matías Muchnick` / `co-founder, CEO` |
| founder row B | `Karim Pichara` / `co-founder, CTO · built Giuseppe` |
| doodle callout (Caveat) | `painted faces out of vegetables` |
| product card | `NotMayo, 2017` / `chickpea and lupin` |
| big number | `8%` / `of Chile's mayo market in eight months` |
| valuation chip | `$1.5B` / `valuation, July 2021` |

Body text on screen: 14 words outside names, labels and numbers. No sentences.

### Layout (content zone y 268–990, x 120–1800)

- Left column, x 120 → 1040.
  - `SANTIAGO, CHILE` — `t-caps`, `--text-3`, at **(120, 290)**.
  - `2015` — `t-num` (132 px, JetBrains Mono), `--cranberry-t`, at **(120, 322)**.
  - Founder rows at **(120, 520)** and **(120, 660)**: name in `t-body`, role in `t-label` `--text-2` 44 px below. No photos, no portraits, no silhouettes.
  - Caveat callout at **(640, 700)**, rotated −4°, `--text-2`, with a rough.js cream arrow from the callout to the word `Giuseppe` in row B. The callout is the only handwritten text on the slide.
- Right column, x 1140 → 1800.
  - Generated image `assets/img/notco/chickpeas.jpg` at **(1140, 300)**, 660 × 400, dropped with a 2° tilt and a soft shadow.
  - Product card `NotMayo, 2017` / `chickpea and lupin` at **(1140, 740)**, 660 × 110.
  - `8%` — `t-num`, `--cranberry-t`, at **(1140, 860)** with its label in `t-label` to its right, baseline aligned.
  - `$1.5B` chip at **(1500, 300)**, 300 × 120, cranberry outline, mono value plus `t-label` caption. It lands last, over the image's top-right corner, so the final frame reads 2015 → 2017 → 2021 left to right.

### Build

- **Entrance:** `SANTIAGO, CHILE` and `2015` rise; both founder rows fade in (`Kit.rise`, stagger .08).
- **Click 1:** the Caveat callout writes on and its arrow draws to `Giuseppe` (relationship: the CTO built the thing the last section just explained).
- **Click 2:** the chickpeas image drops in with its tilt, the product card slides up under it, and `8%` counts 0 → 8 (`Kit.count`).
- **Click 3:** the `$1.5B` chip lands and the year `2015` dims to `--text-3`, so the slide ends on the money, not the founding.

### Spoken only

- Pablo Zamora was the third co-founder, a plant biologist; he stepped back to adviser in March 2020 and then left. `notco-company.md` credits Pichara **and** Zamora with building Giuseppe; the Giuseppe report credits Pichara. The slide says Pichara, and the notes name Zamora.
- Muchnick had already built and sold a plant-based mayo brand, Eggless, and saw at UC Berkeley that pharma used computation for formulation while food R&D ran on trial and error.
- The painter is Giuseppe Arcimboldo. The notes name him; the doodle does not, because the name is not the point.
- NotMayo launched in 40 Chilean stores.
- Funding: roughly $425–450M of equity in total; Bezos Expeditions' first Latin American investment was the $30M Series B in March 2019.

### Source

- 2015, Santiago: "Founded | 2015, Santiago, Chile; offices in San Francisco, Santiago, Buenos Aires, São Paulo" — `notco-company.md`, Facts table. Also `giuseppe.md` §2: "NotCo was co-founded in 2015 by Matías Muchnick, Karim Pichara and Pablo Zamora ([FEN UChile](https://fen.uchile.cl/?p=34542))". **Flag:** `giuseppe.md` notes that sources disagree, with The Plant Base giving 2016. The slide uses 2015, the figure both reports lead with.
- Roles: "Matías Muchnick | Co-founder, CEO since founding"; "Karim Pichara | Co-founder, CTO … leads the NotCo AI business" — `notco-company.md`, Founders table.
- Giuseppe's name: "Pichara, co-founder and CTO, created Giuseppe, which is named after the painter Giuseppe Arcimboldo ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes))" — `giuseppe.md` §2. The doodle's wording comes from `notco-company.md`: "the painter Giuseppe Arcimboldo, who composed faces from vegetables".
- NotMayo: "NotMayo | Mar 2017, Chile | Egg-free mayo from chickpea and lupin; the first product, about 8% of Chile's mayo market within eight months" — `notco-company.md`, Consumer product lines. Timeline: "Mar 2017 | NotMayo launches in 40 Chilean stores and takes about 8% share in eight months ([IDB](https://fairlac.iadb.org/en/not-company))".
- $1.5B: "Jul 2021 | $235M Series D led by Tiger Global; valued at $1.5B" — `notco-company.md`, History and timeline.
- `Kit.src('NotMayo took about 8% of Chile\'s mayo market in eight months (IDB). Valuation: $235M Series D, July 2021. Chickpeas: illustration.')`. The 8% is a press figure, not a company claim, so it carries no flag; the image caption carries `illustration`.

### Images

- `chickpeas.jpg` — subject: a small heap of dried chickpeas, a few spilled, on the deck's slate under warm side light. Generic, no packaging, no text.

---

## 2 · `pivot` — From food to software (50 s · 4 clicks)

**The one idea:** between 2022 and 2026 NotCo sold or closed nearly every food market it ran and kept the AI.

### On screen

Two lanes against one shared time axis. The axis runs `2022` → `2026`.

| element | exact text |
|---|---|
| lane label, above axis | `FOOD` |
| lane label, below axis | `AI` |
| food chips (above) | `Chile` · `Argentina + Uruguay` · `Brazil` · `Mexico` · `US + Canada` |
| exit tags | `sold to Molinos, Jun 2026` · `sold to Ferrara, Sep 2026` · `closed, 2026 (reported)` · `Kraft Heinz sells it, Feb 2025` |
| AI chips (below) | `Kraft Heinz joint venture, 2022` · `NotCo AI unit · Concept Quant, 2025` · `Barry Callebaut, Nov 2025` |
| closing caption | `One food market left.` / `Giuseppe is the product.` |

Body text on screen: 8 words in the caption. Everything else is a place, a date or a buyer.

### Layout

- Caps sub-line `WHAT NOTCO RUNS ITSELF` at **(120, 290)**.
- SVG, 1680 × 560, at **(120, 350)**. Local coordinates below.
  - Time axis: a cream rough.js line from local (300, 300) to (1660, 300), year ticks at local x 300 / 640 / 980 / 1320 / 1660 labeled `2022` … `2026` in mono 28 px under the line.
  - `FOOD` at local (0, 60), `AI` at local (0, 420), both `t-caps` `--text-3`.
  - Food chips sit above the axis in a column-free row: five chips 300 × 76 at local y 90, x 120 / 440 / 760 / 1080 / 1400. Each exit tag renders as a 28 px line 34 px under its chip.
  - AI chips sit below the axis: three chips 420 × 76 at local y 400, left edges aligned to their year on the axis (2022 → local x 300, 2025 → local x 980, Nov 2025 → local x 1180, nudged right to clear the previous chip).
  - Closing caption at **(120, 940)**, two `t-h2` lines, the second in `--cranberry-t`.
- The caption's two lines and the footer share the x 120 margin. Nothing in the right half of the SVG extends below y 930, so the footer stays clear.

### Build

- **Entrance:** the axis draws itself left to right, `FOOD` and the five food chips fade in at full contrast. The lane reads as a company that sells food in five places.
- **Click 1:** the `Kraft Heinz JV, 2022` chip rises below the axis, and a cream connector draws from the `US + Canada` chip down to it.
- **Click 2:** `NotCo AI unit · Concept Quant, 2025` and `Barry Callebaut, Nov 2025` rise in sequence (one click, .25 s stagger).
- **Click 3:** the exits strike through in date order — `US + Canada`, then `Argentina + Uruguay`, `Mexico`, `Brazil` — each chip dropping to `--text-3` as a cream rough stroke crosses it and its exit tag lands. `Chile` re-tints to `--cranberry-t`. This is the beat of the slide: the top lane empties while the bottom lane fills.
- **Click 4:** the closing caption rises.

### Spoken only

- Why the strike-throughs are not all the same thing: Argentina and Uruguay were **sold** to Molinos, Brazil was **sold** to Ferrara, Mexico was reportedly **closed** with no buyer, and in the US and Canada Kraft Heinz took over selling the brand. The screen says which is which in the tags; the notes say it out loud.
- Chile is under pressure too: press reports a year-end 2026 deadline to show profit, and a May 2026 Supreme Court ruling bars "milk" wording and cow imagery on the packs.
- The cuts: about 6% of staff in August 2022, 11% in December 2024, and 16 managers in July 2026, mostly science and culinary. Software engineering was spared.
- Revenue peaked near $100M in 2022 and was about $65–75M in 2025.

### Source

- Kraft Heinz JV: "Feb 2022 | Forms The Kraft Heinz Not Company JV, controlled by Kraft Heinz ([Food Dive](https://www.fooddive.com/news/kraft-heinz-enters-joint-venture-with-notco/619224/))" — `notco-company.md`.
- Kraft Heinz takes over US and Canada sales: "Feb 2025 | Closes New York office; Kraft Heinz takes over selling NotCo products in the US and Canada" — `notco-company.md`.
- NotCo AI as its own unit: "2025 | NotCo AI set up as its own unit with separate team and brand ([Ex-Ante](https://www.ex-ante.cl/?p=375679))" — `notco-company.md`.
- Concept Quant: "Apr 2025 | Launches Concept Quant, a B2B portal into Giuseppe ([FoodNavigator](https://www.foodnavigator.com/Article/2025/04/09/notco-leverages-ai-to-help-cpg-brands-innovate-more-quickly-and-accurately/))" — `notco-company.md`. **Flag:** `giuseppe.md` dates the launch March 2025 from the same FoodNavigator article. The chip says `2025` with no month.
- Barry Callebaut: "Nov 2025 | Barry Callebaut signs on to use NotCo AI for chocolate development" — `notco-company.md`.
- Argentina and Uruguay: "Jun 2026 | Agrees to sell Argentina and Uruguay food business to Molinos Río de la Plata ([Just Food](https://www.just-food.com/newsletters/molinos-notco-argentina-uruguay-acquisition))" — `notco-company.md`.
- Brazil: "Sep 2026 | Sells Brazil business … to local group Ferrara ([Vegconomist](https://vegconomist.com/investments-finance/investments-acquisitions/notco-sells-brazil-operation-ferrara-three-months-after-molinos-deal/))" — `notco-company.md`.
- Mexico: "Mar 2026 | Mexico consumer business reportedly shut without a buyer; NotCo has not confirmed ([The Plant Base](https://www.theplantbasemag.com/news/notco-sells-brazil-operations-to-ferrara-reportedly-shuts-down-mexico-business))" — `notco-company.md`. **Flag:** `giuseppe.md` §2 puts the same report in September 2026 ("Diario Financiero reported that NotCo closed its Mexico business without a buyer. NotCo declined to comment."). The reports disagree on the month, so the tag reads `closed, 2026 (reported)` with no month, and the footer says NotCo has not confirmed it.
- Chile only: "By November 2026 it runs its food business directly only in Chile" — `notco-company.md`, Partnerships and markets.
- `Kit.src('Dates from company announcements and press, 2022–Sep 2026. Mexico: reported, not confirmed by NotCo.', 'Press reports')`.

### Images

None. This slide is code-drawn.

---

## 3 · `today` — NotCo today (45 s · 3 clicks)

**The one idea:** Giuseppe is now sold to the food giants NotCo used to compete with, and the work is mostly not plant-based.

### On screen

| element | exact text |
|---|---|
| caps sub-line | `WHO BUYS GIUSEPPE NOW` |
| example card title | `Ferrero` (set in the deck's display face, not a logo) |
| example card line | `cocoa substitutes across 30,000 recipes a year` |
| example card date | `after the 2024 cocoa price surge` |
| big number A | `7 of 20` / `largest packaged-goods companies` |
| big number B | `~half` / `of revenue, from AI` |
| estimate tag | `ESTIMATE` |

Body text on screen: 15 words across the two labels and the card line. No sentences.

### Layout

- `WHO BUYS GIUSEPPE NOW` — `t-caps`, `--text-3`, at **(120, 290)**.
- Left column, x 120 → 1000.
  - `7 of 20` — `t-num`, `--cranberry-t`, at **(120, 340)**; label in `t-label` `--text-2` at **(120, 480)**, two lines, max width 860.
  - `~half` — `t-num`, `--cranberry-t`, at **(120, 640)**; label at **(120, 780)**; the `ESTIMATE` tag is a 28 px caps pill at **(430, 660)**, `--text-3` outline, sitting to the right of the number so it cannot be read as part of it.
- Right column, x 1080 → 1800.
  - Generated image `assets/img/notco/cocoa.jpg` at **(1080, 320)**, 720 × 420, dropped with a −2° tilt.
  - Example card at **(1080, 770)**, 720 × 190: the Ferrero wordmark at 44 px high, top left; the card line in `t-label`; the date line in 28 px `--text-3`.
- The right column ends at y 960, clear of the footer.

### Build

- **Entrance:** the sub-line, then the cocoa image drops in with the empty-free example card already carrying the Ferrero wordmark (no framed box ever appears without content).
- **Click 1:** the card's two lines write on, so the concrete job lands before any aggregate number.
- **Click 2:** `7 of 20` counts up and its label lands.
- **Click 3:** `~half` and the `ESTIMATE` tag land together, and a rough.js cream bracket draws under the two numbers to group them as "the AI business".

### Spoken only

- Scale behind the two numbers: NotCo says it has live programs with 20 of the world's top CPG companies, more than 35 commercial agreements, and work with 10 of the 15 largest food companies; 80 projects with 30 of the largest companies, more than 70% completed successfully. These are company figures and "successfully" is not defined.
- A typical project is about $300K; the largest is $30M over 18 months, won against Palantir, Microsoft, OpenAI and Anthropic. Claimed gross margin is 70–80% and the AI business grew 300% in 2025 (Forbes).
- The work: cocoa substitution, sugar reduction, replacing synthetic dyes (50-plus active color projects), GLP-1-era reformulation, fragrance. Clients can run Giuseppe in their own cloud with their own data.
- The caveat: total revenue has fallen, the accounts are private, and the $1.5B valuation is about 20 times 2025 revenue.

### Source

- 7 of 20: "Forbes reported in March 2026 that 7 of the world's 20 largest packaged-goods companies work with NotCo. Ferrero asked it to find substitute ingredients across more than 30,000 annual recipes after the 2024 cocoa price surge ([FEN UChile](https://fen.uchile.cl/?p=34542))" — `giuseppe.md` §8, Adoption by other companies. Same sentence in the §2 timeline: "Mar 2026 | Forbes reported that 7 of the world's 20 largest packaged-goods companies work with NotCo, including Ferrero after the 2024 cocoa price surge". **Note:** this is a Forbes figure reported via FEN UChile, so it is attributed to Forbes on screen's footer, not flagged self-reported. It is **not** in `notco-company.md`, whose own client claims are different numbers (20 of the top CPG companies; 10 of the 15 largest food companies) and are company claims.
- Ferrero, 30,000 recipes: same line. On screen the wording is "across 30,000 recipes a year", matching the report's "more than 30,000 annual recipes". Use `30,000+` if the typography allows.
- About half of revenue from AI: "Revenue | About $65–75M in 2025 (estimates), down from about $100M in 2022; roughly half from AI" — `notco-company.md`, Facts table; "Share of sales | About half of total revenue | La Tercera" — NotCo AI by the numbers.
- `Kit.src('Client reach: Forbes, March 2026, via FEN U. de Chile. Revenue split: about half of $65–75M in 2025, an estimate (PitchBook via La Tercera; Forbes). Logo: Ferrero. Cocoa pod: illustration.', 'Forbes · estimate')`.

### Images

- `cocoa.jpg` — subject: one split cocoa pod with wet beans visible, on the deck's slate under warm side light. Generic, no packaging, no text.

---

## 4 · `bridge` — statement, no heading (30 s · 2 clicks)

**The one idea:** the technique outlived the product it was built for, so the question for the last section is who else needs it.

No engine heading (`heading` is omitted). This is a statement slide, like deck 1's `question`.

### On screen

| element | exact text |
|---|---|
| line 1 | `The food business is almost gone.` |
| line 2 | `The AI it built is the product.` |
| line 3 (rust) | `Who else needs it?` |
| support line | `90% of its AI requests are no longer plant-based` |
| flag | `SELF-REPORTED` |

### Layout

- Text column, x 150 → 1120.
  - Line 1 at **(150, 380)** and line 2 at **(150, 470)**, both `t-h2`, `--text`.
  - Support line at **(150, 580)**, `t-label`, `--text-2`, with the `SELF-REPORTED` pill 28 px caps immediately after it.
  - Line 3 at **(150, 720)**, `t-h1`, `--rust-t`. The box is 1000 px wide, so the longest line keeps about 10% spare.
- Right, generated image `assets/img/notco/glass-milk.jpg` at **(1240, 300)**, 500 × 560, dropped with a 3° tilt, at 85% opacity.
- Scrim solid to 56% of the width, zero at 80%, so no glyph lands on the glass.

### Build

- **Entrance:** the image drops in; lines 1 and 2 rise.
- **Click 1:** the support line and its flag land, and the image fades to 35% while a rough.js cream arrow draws from the glass to the right edge of the stage. The change on screen is the product receding and the method leaving the frame.
- **Click 2:** `Who else needs it?` rises in rust.

### Spoken only

- The Chilean Supreme Court ruling of May 2026 bars "milk" wording and cow imagery on the packs in NotCo's last directly run market, and forced affected packs off shelves within 15 days. That is why line 1 is not an exaggeration.
- Pichara's own framing: "from design, we are an AI company". In 2022 Muchnick said NotCo felt like "the Apple of food".
- The hand-off sentence: the next section asks which jobs this kind of engine is worth building for, and which it is not.

### Source

- 90% of B2B requests: "**Use cases:** mostly not plant-based any more; a NotCo executive put that at 90% of B2B requests in 2025 ([Mobile Time](https://www.mobiletime.com.br/noticias/16/05/2025/notco-vertical-b2b-ia/))" — `notco-company.md`, What NotCo AI sells. Company claim, so `'Self-reported'`.
- Line 1 rests on the 2026 exits sourced on `pivot`, plus "By November 2026 it runs its food business directly only in Chile".
- Line 2 rests on "in 2026 it is the product, and the brand rides on partners" — `notco-company.md`, Where they're going.
- `Kit.src('NotCo executive, 2025, via Mobile Time. Glass of plant milk: illustration, not a NotCo product.', 'Self-reported')`.

### Images

- `glass-milk.jpg` — subject: a plain glass of pale, slightly creamy plant drink on the deck's slate under warm side light, no carton, no branding, no text. The footer states it is an illustration and not a NotCo product, since this is the one image on the slide that could be mistaken for one.

---

## Cross-section hooks

**Assumed from earlier sections:** the markers Read · Find · Mix · Sell · Next; Giuseppe as the formulation engine, the recipe map, the score against a target, and NotMilk's pineapple-and-cabbage formula. No new ML vocabulary.

**Set up for Next:** the bridge's question. Next answers it with two bets, and its `engine` slide reuses the Giuseppe loop with a new score.

## Deliberately cut

| Cut | Why |
|---|---|
| Full funding history, investor names, celebrity backers | Not technique and not needed for the arc; one spoken sentence on the Bezos round. |
| The leadership table, hires and departures | Three slides' worth of names for a 165-second section. |
| Plant-based category decline ($1B US alt-meat, −10%) | Belongs to a market story the deck does not tell. Spoken only, if at all. |
| Missed profitability targets, the full cuts timeline | One spoken sentence on `pivot`. |
| The 31 patents, 13 US AI patents | The Giuseppe section already carries the patents that matter. |
| GLP Booster the ingredient | The GLP-1 force is taught on Next `forces`. |

## Checklist

- [x] Headings match the plan's heading map: `Where NotCo came from`, `From food to software`, `NotCo today`, and no heading on `bridge`.
- [x] No roadmap and no `Kit.withCrumbs` in this section (by design; the plan lists no crumbs for Sell).
- [x] No source text on screen: no `Kit.src` call and no provenance chip. Every number is still cited in the References appendix, and its caveat is spoken in the notes.
- [x] `[click]` count equals `ctx.pause()` count: 3 / 4 / 3 / 2.
- [x] `budgetSec` sums to 165, and the notes run about 135 words per minute (376 words ≈ 167 s).
- [x] All three generated images are photoreal generic food on slate and carry no text. They are credited as generated in the References appendix.
- [x] No logo is used. `Ferrero` is set in the deck's own type and the Ferrero work is credited in the `today` footer.
- [x] All CSS scoped under `.slide[data-sec="notco"]`.
- [x] Hidden-by-default elements use `Kit.show` or `tl.to`, never `tl.from` / `Kit.rise`.
- [x] Every build step screenshotted at 1920×1080, `agent-browser errors` empty, print mode shows each final state.
