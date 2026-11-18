# Spec — Section 03 · Mix · NotCo Giuseppe

**Owner files:** `sections/03-giuseppe.js`, `css/sections/giuseppe.css`, `assets/img/giuseppe/`, `specs/giuseppe.md`
**Budget:** **390 s** = 45 + 30 + 75 + 50 + 50 + 40 + 55 + 45
**Section color:** `saffron` (`--sec` = `#E2A43B`, `--sec-t` = `#F2C46E`). Focus accent: `rust` (`--rust` `#D2643A`, `--rust-t` `#F08A5D`).
**Kicker:** `Mix`. Section title: `NotCo Giuseppe`.
**Slide order:** `PROBLEM, APPROACH, MAP, SCORE, STEER, RULES, RESULTS, TAKEAWAYS`
**Roadmap cards and crumb names:** `Map` → `Decode` → `Score` → `Steer` (exactly these four strings, in `STEPS`).

**Sources:** `sources/giuseppe.md` only. Sections used: §1 (the problem, why it is hard), §3 (the stages),
§4 (ingredients and targets as vectors), §5 (the VAE and its latent space), §6 (the scoring layer and the
search loop), §7 (rules, masks, flavor generator, recipe generator), §8 (NotMilk, claimed speed-ups),
§9 (limitations), §10 (transferable lessons).
`sources/drafts/app3-notco-draft.pdf` is a secondary teammate draft. Where it differs from the report, the
report wins. Two differences matter and the report's version is used below: the draft says the diet filter
blocks ingredients "at this moment" of decoding, while the report is precise that masking zeroes rows of the
ingredient embedding matrix *before* the decoder's argmax; and the draft puts "300,000 edible plants" at the
center of the problem slide, while the report attributes that figure to NotCo's CEO in a press interview and
gives the patent's own 830-ingredient example as the only vocabulary size in the patents.

**Honesty labels that apply to the whole section** *(rewritten Nov 2026: no source text on slides.
`Kit.src` is a no-op, provenance chips and the "Drawn in 2-D" lines are gone, and every caveat below is
spoken from the notes instead. References still live in `99-refs.js`.)*

1. The architecture comes from patents filed in 2020 and 2021. `approach` says it once, out loud:
   "Everything here is from NotCo's patents; they have never confirmed it is what runs today."
   Never say "Giuseppe runs" on a mechanism slide; say "the patent describes".
2. The NotMilk speed-up is a NotCo claim: `results` notes say "their own figure, with no control group",
   and that the carton is a drawing, not their packaging.
3. The recipe map is drawn in 2-D: `map` and `steer` notes say so ("I am drawing this flat…",
   "Flat drawing again, and these six tries are invented").
4. Illustrative values (scores, proportions, dot positions) are called out in the notes:
   `problem` ("that count is my arithmetic"), `score` ("the percentages on screen are made up"),
   `rules` ("masking rather than filtering afterwards is my reading of the patents").

**Restyle (Nov 2026) — this section is the deck-wide doodle pilot**

- **Stroke weight is hierarchy.** Every diagram uses at least two of `w: 'heavy'` (9) / `'normal'` (5) /
  `'fine'` (2.5); no `sw:` numbers are left in the section. Heavy goes on the focal shape: the bowl
  (`problem`), the one-loop arrow (`approach`), the encoder/decoder wedges and the decode path (`map`),
  the decoder wedge (`score`), the map border (`steer`), the masked decoder and the mask (`rules`),
  the carton (`results`). Fine goes on supporting boxes, cards and the dictionary frame.
- **1–3 `Kit.doodle` marks per slide**, drawn on with `Kit.draw` after the thing they point at, in
  `var(--sec-t)` (saffron) or `var(--rust-t)`; the diagram itself stays cream chalk. Per slide:
  `problem` twinkles on the milk, a rust loop round `4 × 10²²`, an underline under "Cook it. Taste it.";
  `approach` an underline under "One loop" plus the Caveat "hundreds of times";
  `map` a loop round the three cut-outs (fades as they fly), a swoosh into the encoder, an underline
  under the rebuilt `M` row; `score` a loop round the milk cut-out and round the `0.04` score;
  `steer` twinkles beside the star; `rules` a check beside "every try is usable" and an x beside
  "a wasted try"; `results` a rust loop round the pineapple + cabbage pair and round `10 → 2`, plus a
  sparkle on the carton; `takeaways` underlines under each rule and a loop round the final point.
- **Hatched focal boxes.** `Kit.rough.rect(..., {hatch:'var(--sec-t)', fillOpacity})` shades the four step
  cards (.16), the three Bayesian-optimization cards (.14), the masked decoder (.13) and the carton's label
  panel (.5); the decoder wedge on `score` carries a saffron hachure fill.
- **One food doodle per slide in the dead corner**, section saffron unless noted: `fork` (problem),
  `pot` (approach), `sprig` (map), `leaf` (score), `carrot` (steer), `fork` (rules), `sprig` (results),
  `pot` (takeaways). `spoon` and `whisk` were tried and cut: at slide scale they read as a lollipop
  and a hot-air balloon.
- **Content zone now runs to y 1030** (no footer): the bottom band of every slide was re-laid out to use it.

---

## Story spine (approve before building)

1. **Problem.** To make milk without a cow you must pick a handful of plants out of a large catalog, and the
   right amount of each, and the only real test is a person cooking and tasting the result. The patent's own
   example vocabulary of 830 ingredients already allows about 4 × 10²² ten-ingredient sets, and NotCo's
   kitchen can test about 100 recipes a month.
2. **Why this technique.** A list of combinations cannot be searched. So the patent learns a *continuous*
   map of recipes, where a search can move in small steps, and replaces cooking with a number that can be
   computed: how far a blend lands from the target food's measured profile.
3. **How it works, four steps** (the roadmap cards and the crumb names).
   **Map** — a variational autoencoder squeezes each real recipe into one point and rebuilds it.
   **Decode** — any point reads back out as an ingredient list, one ingredient at a time.
   **Score** — a solver picks the amount of each ingredient and reports the leftover distance to the target.
   **Steer** — Bayesian optimization uses past scores to choose the next point to try.
4. **Results.** For cow's milk the proposed formula was pineapple juice, cabbage juice, chicory root and
   coconut; chefs refined it into NotMilk. NotCo says a milk product took 2 months the second time, down
   from 10. The first batch came out green.
5. **Takeaways.** Learn the space, then search it with a score. Put the rules inside the search, not after it.

---

## Slides

| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `problem` | The formulation problem | 45 | 3 | — |
| `approach` | How Giuseppe works | 30 | 3 | — (this slide *is* the roadmap) |
| `map` | The recipe map | 75 | 5 | `Map` |
| `score` | Scoring a candidate | 50 | 3 | `Decode`, `Score` |
| `steer` | Steering the search | 50 | 3 | `Steer` |
| `rules` | Diet rules | 40 | 2 | `Steer` |
| `results` | Results | 55 | 3 | — |
| `takeaways` | Takeaways | 45 | 2 | — |

Sum: 390 s. Notes at 135 wpm: 101 · 68 · 169 · 113 · 113 · 90 · 124 · 101 words (879 total).

**Build note for the kit.** `score` lights two crumb steps at once (`Decode` and `Score`). `Kit.crumbs(steps, cur)`
accepts an array of indices (approved and shipped), so `score` is wrapped with `Kit.withCrumbs(SCORE, STEPS, [1, 2])`.

---

## Per slide

### 1 · `problem` — The formulation problem · 45 s · 3 pauses

**The one idea.** Copying milk with plants is a search over an enormous number of combinations, and every
real try costs a cook-and-taste cycle.

**On screen.** Heading `The formulation problem`.
- A photoreal glass of cow's milk, cut out, dropped on the slate at x 150, y 300, w 380 (lands with a ~4°
  tilt and a soft shadow).
- A hand-drawn `=` in cream (rough.js, two wobbly strokes) at x 600, y 480, 90 × 60.
- An empty bowl drawn in code at x 760, y 320, 520 × 360: a rough.js ellipse with 10 dashed circular slots
  inside it, each 64 px, each holding a dim `?` in Fraunces.
- Caps label over the bowl: `A HANDFUL OF PLANTS` (x 760, y 288).
- Below, a counting row at y 740: `830` (t-num, saffron) with the label `ingredients in the patent's
  example`, then a rough arrow, then `4 × 10²²` (t-num, rust) with the label `ways to pick 10`.
- Bottom right card, x 1280, y 740, w 520: caps `THE REAL TEST`, then `20+ chefs · 100+ recipes a month`
  (JetBrains Mono) and one line: `Cook it. Taste it. Rate it.`

Body text on screen, counted: `A handful of plants` · `ingredients in the patent's example` · `ways to pick
10` · `Cook it. Taste it. Rate it.` — 4 short labels, 20 words in all, none of them a prose sentence beyond
the three-word caption. Only two labels are visible before the first click.

**Build.**
- Entrance: header rises; the milk glass drops in; the `=` draws itself; the bowl and its 10 empty slots
  draw themselves on, stagger .04. No numbers yet.
- [click 1] The 830 figure counts up (`Kit.count`) with its label.
- [click 2] The rough arrow draws, then `4 × 10²²` writes on in rust. The 10 empty slots pulse once, in
  sequence, to tie the exponent to the ten slots in the bowl.
- [click 3] The `THE REAL TEST` card rises; the mono line counts in.

**Spoken only.** NotCo's CEO frames the catalog as about 300,000 plants against the roughly 200 the Western
diet uses, which is a press-interview figure rather than a patent one, so the slide shows the patent's number
instead. The target is not one property but many at once: nutrition, flavor, mouthfeel, appearance, and
behaving like milk when baked or steamed. The CEO's line "if you change one thing, you change everything
else". The patents' own complaint about trial and error: slow, and wasteful of physical ingredients. A recipe
that works in a test kitchen can still fail at factory scale.

**Source.**
- `830` ingredients: "The only vocabulary size I found in the patents is 830 ingredients, in an example
  ([US 11,982,661])" — `sources/giuseppe.md` §9, and §1: "the 830-ingredient vocabulary in one NotCo patent
  example". Link: https://patents.justia.com/patent/11982661
- `4 × 10²²`: "allows about 4 × 10²² different 10-ingredient sets, before amounts are chosen (my arithmetic:
  830 choose 10)" — §1. **This is the report author's arithmetic, not a NotCo or patent figure.** Verified
  here: `python3 -c "import math; print(math.comb(830,10))"` → `40493139890087522536195`, which is
  4.049 × 10²². The footer must say so.
- `20+ chefs · 100+ recipes a month`: "NotCo's 20-plus food scientists and chefs test more than 100 recipes a
  month ([Tech Brew, 2021])" — §1. Link:
  https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes
- Footer: `Kit.src('830-ingredient example: US 11,982,661. 4×10²² = 830 choose 10, the report author\'s arithmetic. Kitchen throughput: Tech Brew, 2021 (NotCo).')`

---

### 2 · `approach` — How Giuseppe works · 30 s · 3 pauses

**The one idea.** Four steps, in a loop: learn a map of recipes, read a point back as a list, score the
list, and let the score choose the next point.

**On screen.** Heading `How Giuseppe works`. Four cards at y 330, h 420, w 400, at x 120 · 555 · 990 · 1425,
with a rough.js arrow between each pair at y 530 (x 500, 935, 1370). Card contents, top to bottom: caps
`STEP n`; the step name in Fraunces (t-h2); the question it answers (t-body, dim); a chip with the
technique's name.

| Card | Step | Question it answers | Chip |
|---|---|---|---|
| 1 | `Map` | Where do recipes live? | Variational autoencoder |
| 2 | `Decode` | Which ingredients? | RNN decoder |
| 3 | `Score` | How much, and how close? | Quantity solver |
| 4 | `Steer` | Where next? | Bayesian optimization |

Under the cards, one return arrow curves from card 4 back to card 2 (y 790, drawn in saffron), with the
caps label `ONE LOOP` at x 900, y 830.

**Build.**
- Entrance: header, then card 1 rises.
- [click 1] Arrow 1 draws, card 2 rises.
- [click 2] Arrow 2 draws, card 3 rises.
- [click 3] Arrow 3 draws, card 4 rises, then the return arrow draws and `ONE LOOP` fades in.

Every technique slide after this one is wrapped in `Kit.withCrumbs(def, STEPS, k)` with
`STEPS = ['Map', 'Decode', 'Score', 'Steer']`.

**Spoken only.** Giuseppe is not one model but an assembly line of them: one describes ingredients, one
proposes combinations, one scores them, one predicts flavor, one writes the cooking steps, and chefs close
the loop. The next four slides cover the core four. The three parts we skip get one sentence each later.
Name the division of labor once here, because it is the section's lesson: the model picks which ingredients,
the solver picks how much, and the score turns "does this resemble milk?" into a number.

**Source.** §3 "The stages", items 3, 4 and 5, all from US 11,164,069. Footer:
`Kit.src('Structure: US 11,164,069 (patented design; production use not confirmed).')`

---

### 3 · `map` — The recipe map · 75 s · 5 pauses · crumb `Map`

**This is the gate-2 approval slide.** It gets built first, by hand, and it defines the section's visual
grammar: the map square, the cream rough.js stroke that draws itself on, the photoreal cut-outs that drop
onto the slate, and the saffron/rust split (saffron = the section, rust = the one thing to look at).

**The one idea.** The model squeezes each real recipe into a single point and rebuilds it from that point,
so recipes that use similar ingredients sit near each other, and even a point between two recipes decodes
into a sensible recipe.

#### Layout (content zone y 268–990, x 120–1800)

| Element | Position | Notes |
|---|---|---|
| Header (section tag + `t-h1 The recipe map`) + crumbs | engine's fixed header row | `Kit.withCrumbs(MAP, STEPS, 0)` |
| `.gp-recipe` left panel | x 120, y 300, w 440, h 400 | caps `ONE RECIPE` at y 300; three cut-outs below |
| cut-out: tomato | x 130, y 348, w 200 | drops with −5° tilt |
| cut-out: garlic bulb | x 350, y 348, w 190 | drops with +6° tilt |
| cut-out: basil sprig | x 180, y 520, w 230 | drops with −3° tilt |
| `.gp-list-in` mono list | x 130, y 700, w 420 | `tomato · garlic · basil` on three lines, 28 px mono |
| `.gp-enc` encoder wedge | x 572 → 636, y 420–640 | rough.js trapezoid narrowing left to right; caps `ENCODER` centred under it at y 660 |
| `.gp-map` map square (SVG 660 × 660) | x 640, y 300 | rough.js border in cream, 2 px, draws itself on; no axis ticks and no numbers, because the axes have no units |
| `.gp-dec` decoder wedge | x 1304 → 1368, y 420–640 | mirrored trapezoid, widening left to right; caps `DECODER` at y 660 |
| `.gp-list-out` mono list | x 1380, y 420, w 420 | caps `REBUILT` at y 380; four lines write on one at a time |
| `.gp-cap` caption slot | x 640, y 898, w 660 | one line at a time, t-body, centred under the map; swapped with `Kit.swap` |
| `.gp-note` honesty line | x 640, y 950 | `Drawn in 2-D. The real space has more dimensions.` t-label, `--text-3` |
| footer | y ≈ 1010 | `Kit.src(...)`, see Source below |

Map interior, in map coordinates u, v ∈ [0, 1] mapped to the SVG's 660 × 660 box with a 40 px inset:

| Thing | u, v | Style |
|---|---|---|
| cluster `sauces` (34 dots) | centred .30, .62, spread .11 | cream dots r 5, 55% opacity; label `sauces` in Figtree 28 px at the cluster's top edge |
| cluster `dairy` (30 dots) | centred .72, .28, spread .10 | same |
| cluster `baked goods` (28 dots) | centred .62, .78, spread .12 | same |
| scatter (28 dots) | spread over the square | 30% opacity, so the space reads as filled, not as three islands |
| point `P` (our tomato sauce) | .33, .58 | rust, r 11, inside the `sauces` cluster |
| neighbour `A` | .26, .50 | saffron, r 10 |
| neighbour `B` | .42, .47 | saffron, r 10 |
| midpoint `M` | .34, .485 | rust, r 10, revealed last |
| `A`–`B` dashed chord | — | cream dashed, 2 px |

Chips for `A`, `B` and `M` are 300 px wide, 28 px mono, anchored outside the cluster so they never cover a
dot: `A` at x 672, y 352; `B` at x 980, y 352; `M` at x 820, y 790.
Chip contents (illustrative recipes, flagged in the footer): `A: tomato · onion · basil` ·
`B: tomato · cream · basil` · `M: tomato · onion · cream · basil`.

#### State and render()

Motion on this slide is state-driven, per KIT §5.

```
st = {
  sq:   0,   // 0 → 1  the three cut-outs travel through the encoder and collapse into P
  pt:   0,   // 0 → 1  P's radius and opacity
  out:  0,   // 0 → 4  how many lines of the rebuilt list are written
  cl:   0,   // 0 → 1  cluster dots and cluster labels
  nb:   0,   // 0 → 1  A, B, their chips and the dashed chord
  mid:  0    // 0 → 1  M, its chip, and the "no holes" callout
}
```

`render()` is pure and reads only `st`:
1. For each cut-out *i*, position = point at `st.sq` along its own cream rough path from its resting place,
   through the encoder wedge, to `P`; scale = `1 − .88 · st.sq`; opacity = `1 − st.sq`. The three paths are
   fixed `<path>` elements; use `MotionPath` through `render`, not a separate tween per element, so a
   back-navigation seek is exact.
2. `P`: `r = 11 * st.pt`, opacity `st.pt`.
3. Rebuilt list: line *j* is visible when `st.out > j`; its opacity is `clamp(st.out − j, 0, 1)`.
4. Cluster dots and the three cluster labels: opacity `= st.cl * (dot's own base opacity)`.
5. `A`, `B`, the chord and both chips: opacity `st.nb`; the chord's `stroke-dashoffset` runs
   `len → 0` as `st.nb` goes 0 → 1, so the chord draws itself.
6. `M`, its chip and the Caveat callout: opacity `st.mid`; `M`'s `r = 10 * st.mid`.

Every click tweens `st` with `onUpdate: render`. Print mode and back-navigation then need no extra code.

#### Build

- **Entrance** (auto, ≤ .9 s of decorative motion): header and crumbs rise. The three cut-outs drop onto the
  slate with their tilts, stagger .08. The map square's rough border draws itself on
  (`stroke-dashoffset`, .8 s). `.gp-note` fades in. Caption slot is empty. Map interior is empty.
- **[click 1] Squeeze.** `st.sq` 0 → 1 over .9 s, then `st.pt` 0 → 1 over .3 s. The encoder wedge brightens
  to saffron while the cut-outs pass through it. Caption: `One recipe becomes one point.`
- **[click 2] Rebuild.** A cream path draws from `P` out through the decoder wedge, then `st.out` 0 → 3 in
  three steps of .25 s, writing `tomato`, `garlic`, `basil`. Caption: `Decode: the same list comes back.`
  The left list's three lines flash saffron once, in step with the right list, so "same list" is visible
  rather than asserted.
- **[click 3] Clusters.** `st.cl` 0 → 1 over .7 s; the three cluster labels fade in last. `P` keeps its rust
  fill, so the audience sees that our recipe sits inside `sauces`. Caption:
  `Trained on recipes people have made.`
- **[click 4] Neighbours.** `st.nb` 0 → 1. `A` and `B` light up, the chord draws between them, and both chips
  appear. Caption: `Nearby points, nearly the same list.` A Caveat doodle callout appears beside the chord:
  `one swap apart`.
- **[click 5] No holes.** `st.mid` 0 → 1. `M` appears on the chord between `A` and `B` and its chip writes
  on. Caveat callout under the map: `no holes`. Caption: `A point in between still decodes.`

Five pauses, five `[click]` markers.

#### Spoken only

An autoencoder is two networks joined at a narrow waist: the encoder squeezes, the decoder rebuilds, and
training minimises the rebuild error. Each ingredient arrives as a short vector of numbers, the same move
Shiru used for proteins one section ago, built from USDA nutrient records, NotCo's own lab measurements and
a language model's reading of the ingredient's name. The encoder *sums* those vectors, which is why the order
of the list does not matter. The decoder writes the list out one ingredient at a time, picking at each step
the dictionary row closest to its current state, exactly how a language model picks the next word. The
"variational" part is what buys the no-holes property: the encoder returns a small cloud rather than a single
point, and training pulls all the clouds toward one shared shape, so the space stays evenly filled and a
random point still decodes into something plausible. What the map knows is which ingredients co-occur in
recipes people have cooked. What it does not know is whether any of it tastes like milk. That is the next
slide's job.

#### Source

- Encoder, bag-of-embedded-ingredients, order invariance: §5 "The encoder takes a recipe's ingredient set,
  looks up each ingredient's 64-number embedding, and **sums** them into a 'bag of embedded ingredients'
  ([US 11,164,069])" and "Summing makes the encoding **order-invariant**".
- Decoder, one ingredient at a time by nearest row: §5 "At each step, the RNN's hidden state is compared with
  every row of the ingredient embedding matrix by cosine similarity, and the closest ingredient wins (an
  argmax)".
- Nearby points decode to similar outputs, random points to plausible ones (the "no holes" property): §5 "The
  result is a space where nearby points decode to similar outputs and random points decode to plausible ones,
  which is exactly what a search needs" ([Kingma & Welling, 2013](https://arxiv.org/abs/1312.6114)). The
  report marks the plain-autoencoder "holes" intuition as *(inferred, standard ML intuition)*, so the slide
  says only what the VAE gives, and the notes carry the comparison.
- Interpolation between two points as a known behaviour of this architecture: §5 "This is the same pattern as
  a sentence VAE, which generates a sentence word by word from a latent code and can interpolate between
  sentences ([Bowman et al., 2016](https://arxiv.org/abs/1511.06349))".
- What the map does and does not know: §5 "So the latent space encodes **which ingredients co-occur in
  recipes people have made**. It does not encode whether a combination tastes like milk *(inferred)*."
- Patent links: https://patents.justia.com/patent/11164069 · https://patents.justia.com/patent/11205101
- Footer: `Kit.src('Architecture: US 11,164,069 (patented design; production use not confirmed). Clusters, recipes and positions are illustrative.')`

---

### 4 · `score` — Scoring a candidate · 50 s · 3 pauses · crumbs `Decode` + `Score`

**The one idea.** Decode a point into an ingredient list, let a solver choose the amounts, and the leftover
distance to milk's measured profile is the score. The model picks which; the solver picks how much.

**On screen.** Heading `Scoring a candidate`.
- Left, x 120, w 420: a 240 × 240 thumbnail of the map at y 300 with the rust point on it, then the decoder
  wedge at y 560, then the decoded list in 28 px mono at y 620: four lines, `pineapple juice`,
  `cabbage juice`, `chicory root`, `coconut`.
- Centre, x 640, w 560: caps `SOLVER · HOW MUCH OF EACH` at y 300. Four horizontal bars, one per ingredient,
  at y 360 / 450 / 540 / 630, each 440 px of track with a saffron fill and a mono percentage at its right
  end. A mono total under them at y 720: `100%`.
- Right, x 1300, w 500: the milk cut-out at x 1300, y 290, w 200, with caps `TARGET PROFILE` beside it.
  Below, five named feature rows at y 520 / 578 / 636 / 694 / 752: `protein`, `fat`, `sugar`, `calcium`,
  `viscosity`. Each row is a 320 px track with a cream target tick and a blend marker; the span between
  marker and tick is drawn in rust.
- Score readout, x 1300, y 820: `0.04` in t-num mono, with the label `leftover distance to the target`
  and, under it, `lower is closer`.
- Caption, x 640, y 900: `Model picks which. Solver picks how much.`

**State and render().** `st = { amt: 0, gap: 1, score: .41 }`. `render()` sets each bar's width to
`amt * target_i`, writes each percentage, places each blend marker at `tick_i + gap * offset_i`, redraws the
five rust spans, and writes the score readout. `gap` 1 → 0.1 is the solver closing in; the score readout is
tweened through `st.score` with `Kit.count`.

**Build.**
- Entrance: header and crumbs; the map thumbnail with its rust point; the decoder wedge draws; the four
  decoded lines write on, stagger .12; the target column appears, the milk cut-out drops, and the five
  feature ticks draw. All four bars are at zero width, with their tracks visible, so the frame never looks
  like a failed render.
- [click 1] `st.amt` 0 → 1: the four bars grow to 62% / 18% / 12% / 8% (illustrative), percentages count up,
  and the `100%` total writes on.
- [click 2] `st.gap` 1 → .1: the five blend markers slide toward their ticks, the rust spans shrink to
  slivers, and the score counts 0.41 → 0.04.
- [click 3] The caption rises, and the `lower is closer` line fades in.

No formula on screen. The section's one honest shorthand is the readout `0.04`, not an equation.

**Spoken only.** The target food is described with the same measured features as every ingredient, which is
what makes "how close is this to milk?" a distance rather than an opinion. Inside the solver this is a small
constrained least-squares problem: proportions are non-negative and add to one, and disallowed ingredients
are pinned to zero. The big assumption is that a blend behaves like the weighted average of its parts. That
holds for protein grams, which add up by mass. It does not hold for flavour, aroma, colour or texture. So
there is a second model for taste: a classifier trained on chef-rated recipes predicts a formula's flavour
profile on five labels, salty, sweet, bitter, sour and umami, each from 1 to 5, and the gap to the target's
profile is added to the score. A user can push the score around too: raise the fat target, weight one feature
more, ask for protein, water and fibre in a set ratio.

**Source.**
- Solver and score: §6 "Given a decoded ingredient list, the solver looks for proportions x that make the
  weighted mix of ingredient feature vectors as close as possible to the target's feature vector"; "The
  minimum value itself is the score: lower means closer to the target" ([US 11,164,069]).
- Constraints: §6 "proportions of allowed ingredients sum to 1, disallowed ingredients get exactly 0, and
  nothing is negative".
- The score value `0.04`: chosen inside the real filter band in the patent example, §3 "a salmon project had
  418 stored candidates, which a user narrowed to 98 by filtering on score (0.02 to 0.05) and ingredient
  count (8 to 11) ([US 11,205,101](https://patents.justia.com/patent/11205101))". The starting value 0.41 and
  the four proportions are illustrative.
- Linear-mixing assumption: §6 "The formula treats a blend's features as the weighted average of its
  ingredients' features. That holds well for nutrients such as protein grams, which add up by mass, but not
  for flavor, aroma or texture *(inferred)*."
- Flavor classifier and its labels: §7 "Salty, sweet, bitter, sour and umami, each at an intensity from 1
  (very low) to 5 (very high) ([US 11,205,101])".
- Footer: `Kit.src('Solver and score: US 11,164,069. Score band 0.02–0.05 from the patent example in US 11,205,101. Patented design; production use not confirmed. Proportions and the 0.41 start are illustrative.')`

---

### 5 · `steer` — Steering the search · 50 s · 3 pauses · crumb `Steer`

**The one idea.** Each score tells the search where to look next, so a numbered trail of tries closes in on
the target instead of sampling at random.

**On screen.** Heading `Steering the search`.
- The map square again, 660 × 660, at x 560, y 300, with the cluster dots at 25% opacity so the trail owns
  the slide. Same geometry as `map`, so the audience recognises it.
- A rust star marks milk's own position at u .72, v .28 (inside the `dairy` cluster), labelled `milk` in
  28 px Figtree.
- Eight numbered tries, each a dot r 9 with a mono score badge beside it, joined by a thin cream line in
  order. Positions and scores (illustrative):

  | n | u, v | score |
  |---|---|---|
  | 1 | .30, .60 | 0.41 |
  | 2 | .44, .52 | 0.33 |
  | 3 | .35, .72 | 0.37 |
  | 4 | .58, .42 | 0.19 |
  | 5 | .64, .36 | 0.12 |
  | 6 | .69, .33 | 0.09 |
  | 7 | .71, .30 | 0.05 |
  | 8 | .73, .28 | 0.04 |

- A belief overlay: a soft radial saffron blob centred on u .70, v .30, drawn under the dots, revealed on
  click 2.
- Right column, x 1280, w 520: three small cards at y 320 / 480 / 640, each caps label + one short line:
  `01 PREDICT` / `guess the score everywhere` · `02 PICK` / `promising, or unexplored` ·
  `03 UPDATE` / `every score reshapes the guess`.
- Caption at x 1280, y 820: `Bayesian optimization: learn where to try next.`
- Honesty line under the map at y 962: `Drawn in 2-D. The real space has more dimensions.`

**State and render().** `st = { k: 0, heat: 0 }`. `k` is how many tries are shown, tweened as a float;
`render()` shows try *i* when `k > i`, sets its opacity to `clamp(k − i, 0, 1)`, draws the connecting line's
`stroke-dashoffset` from the same `k`, and sets the belief blob's opacity to `st.heat`. The final badge turns
rust when `k ≥ 8`.

**Build.**
- Entrance: header and crumbs; the faint clusters; the milk star draws itself on; tries 1 and 2 appear with
  their badges (`st.k` 0 → 2); card `01` rises.
- [click 1] `st.k` 2 → 5. Try 3 scores *worse* than try 2, and the line visibly backs off before heading
  toward the star, so the search reads as a search and not a straight line. Card `02` rises. A Caveat callout
  beside try 3: `worse — back off`.
- [click 2] `st.heat` 0 → 1: the belief blob fades in over the good region. Card `03` rises.
- [click 3] `st.k` 5 → 8: tries 6, 7 and 8 land beside the star, the final badge `0.04` turns rust, and the
  caption rises.

**Spoken only.** Bayesian optimization is for functions that are expensive to evaluate. It fits a cheap
statistical stand-in to the scores it has already seen, usually a Gaussian process, which predicts both a
score and how unsure it is about that score. Then a rule called an acquisition function picks the next point,
trading off exploring where it knows little against exploiting where it already looks good. It works best in
spaces of about twenty dimensions or fewer, which is exactly why a compact learned map is the right place to
run it. There is a second, simpler mode in the patent: local search, which encodes a real dairy-milk recipe
and samples its neighbours. The patent does not say which surrogate model, which acquisition function, or how
many dimensions the map has.

**Source.**
- Local and global search: §6 "**Local search.** Encode a real recipe for the target, for example a
  dairy-milk recipe, into the latent space, then sample and decode points nearby"; "**Global search.**
  Bayesian optimization is the primary method described... Each evaluated pair of (latent point, score) guides
  the choice of the next point ([US 11,164,069])".
- Definition: §6 "It builds a cheap statistical stand-in for the unknown score function, usually a Gaussian
  process, along with its uncertainty. An 'acquisition function' then picks the next point to evaluate by
  trading off exploring uncertain regions against exploiting known good ones
  ([Frazier, 2018](https://arxiv.org/abs/1807.02811))."
- The 20-dimension rule of thumb, and what is unpublished: §6 "It works best on continuous spaces of about 20
  dimensions or fewer"; "NotCo's patents do not name the surrogate model, the acquisition function or the
  latent dimension."
- Footer: `Kit.src('Bayesian optimization in US 11,164,069; definition from Frazier, 2018. Patented design; production use not confirmed. The eight tries, their positions and scores are illustrative.')`

---

### 6 · `rules` — Diet rules · 40 s · 2 pauses · crumb `Steer`

**The one idea.** "Plants only" is enforced by blanking the animal ingredients out of the decoder's
dictionary before it picks, so a forbidden ingredient can never be proposed.

**On screen.** Heading `Diet rules`.
- Left, x 120, w 760: caps `INGREDIENT DICTIONARY · 830 ROWS` at y 300. A grid of 140 dots (14 columns × 10
  rows, 44 px pitch) at y 360–760, each dot r 12, cream at 60%. Eight of them sit together on the top row and
  carry 28 px labels: `chicken`, `tuna`, `milk`, `egg` on the four leftmost (the other four stay unlabelled,
  so the grid does not turn into a word list). Caption under the grid at y 800:
  `Blank the row and the decoder cannot reach it.`
- Right, x 1000, w 800: two lanes.
  - Lane A, y 320: a `DECODER` box (240 × 120) with the mask glyph on its input side, an arrow, and a
    plant-only list in mono (`cabbage · pineapple · coconut`), then a saffron chip: `every try is usable`.
  - Lane B, y 640, dimmed to `--text-3`: the same `DECODER` box with no mask, an arrow, a list containing
    `chicken`, a rust ✕ over the whole candidate, and the chip: `a wasted try`.
- Caps divider between the lanes at y 600: `WITHOUT THE MASK`.

**Build.**
- Entrance: header and crumbs; the dictionary grid draws on, stagger .01, with the four animal rows labelled;
  lane A's decoder box and empty output appear.
- [click 1] The eight animal dots fade to `--text-3` and a thin rust strike draws through each. The mask
  glyph snaps onto the decoder's input. Lane A's plant-only list writes on and its chip rises.
- [click 2] Lane B appears, already dimmed: the unmasked decoder proposes a list with `chicken`, the rust ✕
  draws over it, and the `a wasted try` chip rises.

**Spoken only.** The mask works because of how the decoder picks: it compares its state against every row of
the ingredient dictionary and takes the closest, so a row of zeros can never win. Language models use the
same trick, called constrained decoding, to keep generated text inside a format. Filtering after the fact
would be the obvious alternative, and the reason to prefer masking is that the search would otherwise spend
its evaluations on candidates it is going to throw away. That reason is my reading, not something the patents
state. One side effect is worth naming: the map was learned from recipes that include dairy, so it knows
what dairy-like ingredient sets look like, and forcing plant-only output makes the decoder fill those
dairy-shaped regions with the nearest plants it is allowed. That is one way to describe how pineapple and
cabbage end up standing in for milk.

**Source.**
- Masking: §7 table, "Decoder mask | Ingredient embedding matrix, before the decoder's argmax | Hard: the
  ingredient can never be generated | Animal-based rows, such as chicken and tuna, set to zero for vegan
  output ([US 11,164,069]; [US 11,205,101])".
- Why mask rather than filter: §7 "If forbidden ingredients were removed only at the end, the search would
  waste many evaluations on candidates that get thrown away *(inferred)*." **Inferred: it goes in the notes
  with "that reason is my reading", and the footer marks it.** The dimmed lane B is labelled `a wasted try`
  with no claim about how many.
- The dairy-shaped-regions side effect: §7 "forcing plant-only output makes the decoder fill those dairy-like
  regions with the nearest plant ingredients *(inferred; the patents do not discuss this)*." Spoken only, and
  flagged as our reading when spoken.
- 830 rows: as on `problem`, US 11,982,661's example vocabulary.
- Footer: `Kit.src('Decoder mask: US 11,164,069 and US 11,205,101. 830-row example: US 11,982,661. Patented design; production use not confirmed. Why mask rather than filter afterwards is the report\'s reasoning (inferred).')`

---

### 7 · `results` — Results · 55 s · 3 pauses

**The one idea.** Given milk's molecular profile, the search proposed pineapple juice, cabbage juice,
chicory root and coconut; chefs turned that into a product, and NotCo says the second milk took 2 months
instead of 10.

**On screen.** Heading `Results`.
- Caps label at x 120, y 300: `GIUSEPPE'S ANSWER FOR MILK`.
- Four photoreal cut-outs in a row at y 350, each ~210 wide, at x 130 / 370 / 610 / 850, dropping with
  alternating tilts, each with a 28 px label under it at y 580: `pineapple juice`, `cabbage juice`,
  `chicory root`, `coconut`.
- A rough arrow at x 1090, y 430 → the credited NotMilk carton photo at x 1180, y 320, w 340 (a real photo,
  sourced and credited; no generated imitation).
- Big number block at x 120, y 700: `10 → 2` in t-num mono, saffron, with the label
  `months to develop a milk product` and the chip `NotCo's own figure`.
- Caveat doodle callout beside the carton at x 1560, y 420: `the first batch came out green`, with one
  28 px line under it: `the score does not model colour`.
- A second Caveat callout appears under the cut-outs on click 1, at x 300, y 630:
  `pineapple + cabbage → lactones`, with the 28 px line `aroma compounds found in dairy`.

**Build.**
- Entrance: header; the caps label; the four cut-outs drop, stagger .1, with their labels.
- [click 1] The lactones callout draws on (the Caveat line writes, then its explanatory line fades in). The
  rough arrow draws and the carton photo drops in.
- [click 2] The big number counts `10 → 2` (`Kit.count` on the second figure) with its label and the
  `NotCo's own figure` chip.
- [click 3] The green-batch callout draws on, with its one line about colour.

**Spoken only.** The loop does not end at the score. Chefs cooked the top candidates and recorded flavour
intensities plus colour, smell, texture and aftertaste, and those reviews go into a database that retrains
the flavour model, so the part of the objective a computer cannot measure is learned from the people who can.
A winning formula still needs instructions, and the patent hands that to a GPT-2-style language model that
writes one cooking action at a time and lets a person edit each step before the next one is generated.
Two caveats on the speed-up: there is no control group, so the team's own growing experience is mixed into
it, and NotCo attributes the gain to more data reaching the algorithm with each product. NotCo publishes no
accuracy benchmark for the score or the flavour model at all.

**Source.**
- The formula: §8 "The formula included pineapple juice, cabbage juice, chicory root and coconut, fortified
  with vitamins and plant proteins to match milk's nutrition ([The Batch, 2020])". Link:
  https://www.deeplearning.ai/the-batch/got-model
- The input: §8 "NotCo scientists gave Giuseppe the molecular characteristics of cow's milk, and it searched
  a database for plant ingredients that together replicate milk's physical and chemical properties".
- Lactones: §8 "NotCo says Giuseppe identified the pair as a way to generate lactones, aroma compounds found
  in dairy ([FoodNavigator, 2022])". Link:
  https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/
- `10 → 2` months: §8 table, "A milk product, later version | 2 months, down from 10 months the first time |
  NotCo's website, cited in an editor's note ([Tech Brew, 2021])". **NotCo claim**, so the footer carries the
  `Self-reported` flag.
- Green first batch: §8 "The first NotMilk came out green; the algorithm had to learn that some ingredients
  change color ([Food Processing, 2022])". Link:
  https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050
- Colour is not in the score: §9 "The score assumes linear mixing... That suits nutrition but not flavor,
  aroma, color or texture *(inferred)*." The on-screen line says what the score does not model, which the
  green batch demonstrates.
- Footer: `Kit.src('Formula: The Batch, 2020. Lactones: FoodNavigator, 2022. 10 → 2 months: NotCo via Tech Brew, 2021. Green first batch: Food Processing, 2022. Carton photo: <credit to be filled when the asset is sourced>.', 'Self-reported')`

---

### 8 · `takeaways` — Takeaways · 45 s · 2 pauses

**The one idea.** Two lessons that transfer past food: make a discrete choice continuous and then search it
with a score, and enforce the hard rules inside the search.

**On screen.** Heading `Takeaways`. Exactly two rows, at y 330 and y 560, in the shared format
`number · rule · tag · one line`, w 1560:

| # | Rule | Tag | One line |
|---|---|---|---|
| 01 | Learn the space, then search it | generate + score | A score aims a generative model at a target. |
| 02 | Put the rules inside the search | constrained decoding | Block a choice before it is made, not after. |

Marker strip at y 860: `READ · FIND · MIX · SELL · NEXT`, with `MIX` filled saffron and `SELL` tinted
cranberry on the last click. A shrunk copy of the map with its search trail sits at x 1440, y 300, 320 × 320,
at 40% opacity, as the section's closing image rather than a generated photo.

**Build.** Entrance: header, the strip with `MIX` filled, the shrunk map. [click 1] row 01 rises.
[click 2] row 02 rises, then `SELL` tints.

**Spoken only.** Row 01 is the pattern, not the product: the same shape appears in molecule design, where an
autoencoder turns molecules into vectors, a predictor scores them, and the search runs in the learned space.
Row 02's limit is worth saying out loud: a score you can read tells a scientist which property a candidate
misses, and a learned reward does not. Hand-off line: that is Mix. Next, what happened to the company that
built it.

**Source.** §10 "Transferable lessons", items 1, 2 and 3; §10 "The closest relative: latent-space molecule
design" ([Gómez-Bombarelli et al., 2018](https://arxiv.org/abs/1610.02415)) for the spoken comparison.
Footer: `Kit.src('Lessons: report section 10. Molecule-design comparison: Gómez-Bombarelli et al., 2018.')`

---

## Images this section needs

Generated with gpt-image-bridge and `design/style-prefix.txt` (the photoreal variant: generic food on the
same slate `#2A2E31`, warm side light from the upper left, soft shadow, cut-out friendly with clean edges and
space around the subject, no text, no logos, no hands, no packaging). All land in `assets/img/giuseppe/`.

| File | Prompt subject | Used on |
|---|---|---|
| `milk.png` | a plain glass of cow's milk, three-quarter view, single object, centred | `problem`, `score` |
| `tomato.png` | one ripe tomato with its stem, single object | `map` |
| `garlic.png` | one garlic bulb, single object | `map` |
| `basil.png` | a small sprig of fresh basil, single object | `map` |
| `pineapple.png` | one fresh pineapple ring, single object, top-down | `results` |
| `cabbage.png` | one wedge of green cabbage, cut face toward the light | `results` |
| `chicory.png` | one chicory root, washed, single object | `results` |
| `coconut.png` | one halved coconut, cut face toward the light | `results` |

Not generated, sourced: a real credited photo of a NotMilk carton for `results`. KIT §2.7 and the plan's
"Real assets" row allow a real product photo with a credit, and forbid a generated imitation. Rey supplies
or approves the photo and its credit line, and the `results` footer has a placeholder for it.

Everything else on the eight slides is code-drawn SVG with a rough.js wobble in cream strokes: the map
square, the clusters, the trail, the encoder and decoder wedges, the bowl, the dictionary grid, the bars, the
feature tracks and every arrow. Caveat appears in five places only, all of them short doodle callouts:
`one swap apart`, `no holes`, `worse — back off`, `the first batch came out green`,
`pineapple + cabbage → lactones`.

---

## Deliberately cut

| Cut | Why |
|---|---|
| The least-squares formula for the score | KIT §2.6 allows one equation in the whole talk, and this section does not need it. `score` shows the five feature gaps closing and one readout instead. |
| The gradient version of the delta score (differentiating through the decoder) | A second scoring mode would cost `score` its one idea. The black-box version is what the trail on `steer` illustrates. |
| MMD, β-VAE, Wasserstein autoencoders, the reparameterisation trick | Vocabulary a no-ML audience cannot use. The no-holes property is taught as behaviour on `map`, which is what the search depends on. |
| The 64-number ingredient embedding and the three separate spaces | One sentence in `map`'s notes, tied back to Shiru's proteins. Three named spaces on screen would bury the map. |
| The flavour classifier as its own slide | One block of spoken content on `score`. It is a supervised classifier, which the Samsung and Shiru sections already cover. |
| The GPT-2 recipe generator as its own slide | One sentence in `results`' notes. The section's technique is the search, not the text model. |
| The 2024 sensory transformer and the "discernment layer" | Later architecture, and the report cannot say whether it replaces the VAE search or sits beside it. |
| The 418-candidate salmon example as a slide | Its useful part, the real score band 0.02–0.05, is reused as `score`'s readout and footer. |
| "300,000 plants versus 200 in the Western diet" | A press-interview figure. `problem` uses the patent's own 830-ingredient example, and the comparison stays spoken. |
| Kitchen-versus-factory scale-up, and the 35 commercial agreements | Business facts. They belong to the `notco` section. |

---

## Cross-section hooks

**Assumed from earlier sections.** The markers Read · Find · Mix · Sell · Next, from the intro agenda. From
Shiru: what an embedding is, that similar things sit close together in a learned space, and nearest-neighbour
search. `map` leans on that once ("the same move Shiru used for proteins") and does not re-teach it. From
Samsung: that a model can write structured output.

**Set up for later sections.** The `notco` section opens on the company that built this, so `takeaways` ends
on "what happened to the company that built it". `future` reuses "learn the space, then search it with a
score" for the reformulation-engine bet, and reuses the green-batch caveat for parity testing.

**Visual grammar this section defines** (and `gate 2` approves): the map square with its rough cream border,
saffron for the section's own parts, rust for the one thing to look at, cut-outs that drop with a slight
tilt, mono for every number, and Caveat for short callouts only.

---

## Checklist

- [x] Headings match the plan's heading map exactly: `The formulation problem`, `How Giuseppe works`,
      `The recipe map`, `Scoring a candidate`, `Steering the search`, `Diet rules`, `Results`, `Takeaways`.
- [x] `STEPS = ['Map', 'Decode', 'Score', 'Steer']`, identical to the roadmap cards, and every slide after
      `approach` is wrapped in `Kit.withCrumbs`.
- [x] No source text on any slide: no `Kit.src` call, no provenance chip, no "Drawn in 2-D" line.
      Every number still traces to `sources/giuseppe.md` and is cited in `99-refs.js`.
- [x] `4 × 10²²` is spoken as my arithmetic (830 choose 10), not a company figure.
- [x] The patents caveat is spoken once, on `approach`; `results` speaks the self-reported `10 → 2`
      and the drawn carton; `map` and `steer` speak the 2-D drawing and the invented points.
- [x] Every diagram uses at least two stroke weights, and every slide carries 1–3 doodles that point at
      its focal thing, none of them across teaching text.
- [x] `[click]` count equals `ctx.pause()` count: 3 / 3 / 5 / 3 / 3 / 2 / 3 / 2.
- [x] `budgetSec` sums to 390, and each slide's notes run about 135 words per minute.
- [x] `map`, `score` and `steer` each use one state object and one pure `render()` with `onUpdate: render`.
- [x] Hidden-by-default elements use `Kit.show` or `tl.to`, never `tl.from` or `Kit.rise` (KIT §5).
- [x] All CSS scoped under `.slide[data-sec="giuseppe"]`.
- [x] Every build step screenshotted at 1920×1080 and read; print mode checked; `agent-browser errors` empty.


---

## As built (Nov 18) — changes from this spec

Rey approved the specs with "full freedom to split or simplify". The section's budget is unchanged at 390 s
and the slide list, headings, crumb steps and pause counts (3 / 3 / 5 / 3 / 3 / 2 / 3 / 2) are as specified.
What differs:

| Slide | Change | Why |
|---|---|---|
| `problem` | The ten empty slots sit inside a rough.js bowl (rim ellipse + wall), and `THE REAL TEST` became a full-width strip along the bottom instead of a card at the right. | The right column holds the two numbers, so the bottom strip balances the slide instead of leaving a half-empty lower left. |
| `score` | One column, not two: the four decoded ingredients *are* the solver's bar labels. Left of them, a 240 px map thumbnail with the rust point feeds a decoder wedge. The target column (milk cut-out, five feature tracks) and the score readout sit at the right. | The spec's separate "decoded list" and "bars" columns repeated the same four words twice and pushed the score readout into the footer. |
| `steer` | Six tries instead of eight, positions re-fitted to the map's real cluster coordinates (`dairy` is at u .78, v .24, so the milk star is at .82, .17). Build: entrance shows tries 1–2, click 1 → 4, click 2 the belief blob, click 3 → 6. | Eight 28 px score badges could not be placed around the tail of the trail without overlapping. Six keeps every badge legible and still shows the worse-then-back-off step. |
| `rules` | The dictionary is seven named rows of a feature matrix (`chicken`, `tuna`, `milk`, `egg`, `cabbage`, `pineapple`, `coconut`) plus `… 823 more`, not a 140-dot grid. Masking blanks the four animal rows to `0.00  0.00  0.00  0.00  0.00`, dims them and strikes them in rust. | A dot grid could not carry readable 28 px labels, and "the row is set to zeros" is the actual mechanism, so showing numbers going to zero teaches it directly. |
| `results` | The carton is drawn in rough.js (plain gable-top carton, no brand marks) and labelled `NotMilk, 2020`. The footer says `Carton: illustration, not a product photo.` | No official NotCo press photo of a NotMilk carton with clear reuse terms was found; the closest are SIG-credited images. **TODO for Rey:** supply a credited photo and swap `.rs-pack` for `Kit.photo(..., {framed: true})` if he wants a real one. |
| `takeaways` | The row number is 44 px mono (not `t-num`), and the shrunk map carries the six-try trail at 372 px. | A 132 px row number dwarfed the rule it labels. |

**Images.** Generated this round with gpt-image-bridge and `design/style-cutout.txt`: `cabbage.webp`,
`chicory.webp`, `coconut.webp` (raws in `design/raw/giuseppe-*.png`). Reused: `milk.webp` (`problem`, `score`),
`pineapple.webp` (`results`), and `tomato / garlic / basil` on `map`. No full scene is used in this section.

**Helpers added inside the section IIFE** (no shared file was touched): `proj(ox, oy, sz)` returns a map-coordinate
projector, so `score`, `steer` and `takeaways` reuse the map square's geometry; `mapDots(proj, {rs, op})` draws the
same deterministic dot field at any size. The `map` slide's output is pixel-identical to the gate-2 version.

## Review pass (Nov 18) — fixes applied after the build

| Slide | Fix |
|---|---|
| `score` | Added a legend above the target tracks (`\| milk` · `● this blend`) so the cream tick and the rust dot are named. Without it the two marks on each track were unexplained. |
| `steer` | The `0.37` badge sat on top of the dashed trail; moved to the left of its dot (`off [-108, 6]`). The belief blob is now explained by a legend in the empty left column: a swatch of the same gradient under `ITS GUESS · where good scores probably are`, revealed with the blob on click 2. The caption breaks as two balanced lines. |
| `rules` | The big rust ✗ crossed straight through `cabbage · chicken · coconut` and made it unreadable; it is now a single rough strike-through, matching the dictionary's blanked rows. The caption *Blank the row and the decoder cannot reach it.* and the lane-A arrow now appear on click 1 instead of at the entrance, where the caption pre-empted the animation and the arrow pointed at nothing. |
| `approach` | Notes trimmed from 152 to ~142 wpm, in line with the rest of the section. |

Still open for Rey: the generated `chicory.webp` reads like parsnips; the `rules` crumb lights **Steer** per the
heading map although masking happens at the decoder; and the section's notes average ~141 wpm rather than 135.

## Deck-wide QA pass (v1)

- `takeaways`: the active MIX token on the marker strip was a 18 %-opacity tint that did not render
  as a pill. It is now a solid saffron pill with dark text (a `.tk-on` class in
  `css/sections/giuseppe.css`), matching the READ pill on Samsung and the FIND pill on Shiru.
- `takeaways`: the strip moved from y 846 to y 900, the height the other two sections use.
