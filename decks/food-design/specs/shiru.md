# Spec — Section 02 · Find · Shiru

**Owner files:** `sections/02-shiru.js`, `css/sections/shiru.css`, `assets/img/shiru/`
**Budget:** **390 s** = 45 (`problem`) + 30 (`approach`) + 75 (`learn`) + 45 (`embed`) + 45 (`search`) + 60 (`filter`) + 50 (`results`) + 40 (`takeaways`)
**Section color:** olive (`--sec` / `--sec-t` = `--olive` / `--olive-t`). Focus accent: rust (`--rust` / `--rust-t`).
**Kicker:** `Find`. Section title: `Shiru`.
**Slide order:** `PROBLEM, APPROACH, LEARN, EMBED, SEARCH, FILTER, RESULTS, TAKEAWAYS`
**Roadmap cards and crumb names:** `Learn` · `Embed` · `Search` · `Filter` (identical strings in `approach`'s cards and in every `Kit.withCrumbs` call).
**Sources:** `sources/shiru.md` only. Sections used: "The problem: a search problem disguised as a food problem", "How the solution works, at a high level", "Deep dive 1: reading proteins as a language", "Deep dive 2: embeddings and similarity search", "Deep dive 3: predicting function from a few hundred labels", "Deep dive 4: can we make it, and is it safe?", "What has actually come out of it", "Confirmed, inferred, or unknown", "Limitations and open questions".
`sources/drafts/app2-shiru-draft.pdf` is a secondary teammate draft and is not cited. Where it differs, the report wins (see "Draft corrections" at the end).

## Story spine (approve before building)

1. **Problem.** Food leans on a handful of animal proteins; nature has made millions more that nobody has tested in food, and one physical test takes weeks, so you cannot screen them all.
2. **Why this technique.** The property you want is labelled on a few hundred proteins, and letter-by-letter search misses relatives below ~25% identity. Pre-training on unlabelled sequences plus distance in a learned space gives you a ranking over millions without new labels.
3. **How it works, in four steps.** **Learn** (fill in hidden letters across millions of sequences, no lab labels) → **Embed** (one protein becomes ~1,000 numbers; different letters can land close together) → **Search** (query with a protein that already does the job, take its nearest neighbours) → **Filter** (works? makeable? safe? — 77M down to a couple of dozen, then the lab, and every lab result goes back into the models).
4. **Results.** Searchable database 33M+ sequences (May 2024) → 77M+ (March 2026), company releases. OleoPro, in commercial production since April 2025: AI picked the proteins, and the ingredient is potato protein plus ordinary unsaturated oil, claimed at over 90% less saturated fat than the solid fats it replaces (self-reported).
5. **Takeaways.** (1) When one label costs weeks, pre-train on the unlabelled data first; a few hundred labels only work on top of a learned representation. (2) Embedding search finds relatives that letter-matching misses, but it only looks near what already works.

## Slides

| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `problem` | The protein problem | 45 | 2 | — |
| `approach` | How Shiru searches | 30 | 4 | — |
| `learn` | Proteins as language | 75 | 4 | Learn |
| `embed` | Proteins as vectors | 45 | 3 | Embed |
| `search` | Nearest-neighbor search | 45 | 3 | Search |
| `filter` | Three filters | 60 | 4 | Filter |
| `results` | Results | 50 | 2 | — |
| `takeaways` | Takeaways | 40 | 2 | — |

Headings are copied from the plan's heading map. `Nearest-neighbor search` keeps the plan's US spelling; the rest of the deck's prose uses the report's spelling in footers only.

---

## 1 · `problem` — 45 s · 2 pauses

**The one idea:** a handful of animal proteins do the jobs food needs, millions of other proteins have never been tested in food, and one test takes weeks.

**On screen**
- Caps label `WHAT FOOD LEANS ON` at x 120, y 288.
- Two photo cut-outs on the slate, each tilted ~3°, drop-on with a soft shadow: egg (x 120, y 348, w 360, h 300) and glass of milk (x 520, y 348, w 300, h 300).
- Under each, one mono label at 28 px: `egg white · binds and sets` (x 120, y 672) and `milk casein · creamy` (x 520, y 672).
- Caps label `WHAT NOBODY HAS TESTED` at x 1000, y 288, with the legume/plant cut-out (x 1000, y 348, w 800, h 420).
- Olive line under it at x 1000, y 800: `Millions more proteins. Almost none tried in food.`
- Rust chip at x 1000, y 884 (w 540, h 84): `One lab test: weeks` with the sub-label `express · purify · assay in a recipe` at 28 px, y 952.
- Footer: `Kit.src('Shiru report: the problem; cost of one test from US 11,439,159 B2. Food photos are illustrations.')`

Body-text count: 14 words in the two full lines, which is at the top of the budget. If the capture reads busy, cut `express · purify · assay in a recipe` to the notes.

**Build**
- Entrance: the two caps labels, then the egg and the milk drop in (0.45 s apart) with their labels.
- `[click] 1`: the legume cut-out drops in and the olive line writes on. The two animal props dim to 55%, so the contrast of "two we use" against "millions we have not" is the change on screen.
- `[click] 2`: the rust chip scales in and a short rust rule draws from the chip to the legume photo, labelling the cost of touching any one of those candidates.

**Spoken only:** what "function" means in food (gelling, foaming, emulsifying, solubility, heat and pH stability), that gelatin is the third animal workhorse, that plant proteins are cheap and abundant but worse at these jobs, and that fewer than a quarter of candidates even survive expression and purification. Close with the restatement: this is a search problem, and the next slide is the search.

**Source:** report, "Modern food depends on a very small cast of proteins… Egg white binds and sets, gelatin gels, milk casein makes things creamy. Nature has produced millions of other proteins, and the overwhelming majority have never been tested in a food application." Cost of one test: the report's table row "Cost of one physical test | weeks: the protein must be expressed, purified and assayed in a recipe | [US 11,439,159 B2](https://patents.google.com/patent/US11439159)". The egg, milk and legume images are generated illustrations and carry no number.

## 2 · `approach` — 30 s · 4 pauses

**The one idea:** four steps turn "which protein does this job?" into a search you can run on a computer.

**On screen**
Four cards in one row inside the content zone: y 360, h 480, w 390, at x 120 / 560 / 1000 / 1440. Each card holds, top to bottom: the step number in mono (`01`–`04`), the step title (`Learn` / `Embed` / `Search` / `Filter`) at `t-h2`, the question it answers at 28 px in `--text-2`, and the technique name at 28 px in olive.

| Card | Question | Technique |
|---|---|---|
| `Learn` | `How do you learn with no lab data?` | `Fill in hidden letters` |
| `Embed` | `How do you compare two proteins?` | `Embeddings` |
| `Search` | `Which proteins behave like this one?` | `Nearest-neighbor search` |
| `Filter` | `Which few are worth testing?` | `Learned filters, then the lab` |

- Footer: `Kit.src('Shiru report: how the solution works, four stages with one feedback loop')`

**Build**
- Entrance: the heading and four empty card outlines in `--line`, so the final width is set from the first frame and nothing shifts.
- `[click] 1`–`[click] 4`: one card fills per click (olive rule draws across its top, then the text rises). Filled cards stay bright; the remaining outlines stay dim.

**Spoken only:** that only step 1 is expensive, and it is paid once for the whole database; that steps 2 to 4 are the same shape as any search engine ("embed once, query many times"); and the promise that the four crumbs in the top right will say where we are.

**Source:** report, "The pipeline has four stages, and only the first is expensive to build." No numbers on this slide.

## 3 · `learn` — 75 s · 4 pauses · crumb `Learn`

**The one idea:** hide some of the letters and train the model to put them back. The sentence and the protein are the same exercise, and neither needs a lab.

**On screen**
Two stacked panels, same width, so the parallel is visible at a glance.
- Caps label `A SENTENCE` at x 120, y 288. Panel 1 (x 120, y 334, w 1560, h 180): the sentence in Figtree at `t-h2`, `Egg white ▢▢▢▢ when you ▢▢▢▢ it.` Each mask is a 110 × 72 cream-stroke box with a rough.js wobble.
- Caps label `A PROTEIN` at x 120, y 560. Panel 2 (x 120, y 606, w 1560, h 180): the sequence in JetBrains Mono at `t-h2`, 24 residues with two masked runs: `M K A L I V T ▢ ▢ S D K Y L F N ▢ E Q R V T W`. A 28 px note under the panel at y 800: `20 letters · a few hundred long · illustrative fragment`.
- Right-side readout chip at x 1240, y 288 (w 440): `About 15% of positions hidden` with a 28 px `inferred` tag in `--text-3` beside it.
- Closing olive line at x 120, y 870: `No lab labels. The answer is the letter you hid.`
- Second line at x 120, y 930 in `--text-2`: `To guess it, the model learns which parts touch when the protein folds.`
- Footer: `Kit.src('Rives et al., PNAS 2021; masking share from the ESM-2 reference (NVIDIA BioNeMo). Shiru has not published its model, so masked pre-training at ~15% is inferred standard practice. Sequence is illustrative.')`

The two closing lines are 21 words together, over the 12-word budget for one block. Keep them as two separate reveals (clicks 3 and 4) so no single state carries both, and cut the second to `It has to learn which parts touch when the protein folds.` if the capture reads dense.

**Build**
- Entrance: caps label `A SENTENCE` and panel 1, masks already drawn.
- `[click] 1`: panel 2 writes on, residue by residue (0.02 s stagger), with its two masks drawn last. The hidden-letters chip appears. Now both exercises are on screen side by side, unanswered.
- `[click] 2`: the sentence's two masks fill (`sets`, `heat`), typed in cream.
- `[click] 3`: the protein's two masks fill (`G`, `P`) in olive, and the first closing line writes on. The change to watch is that the same move answers both panels.
- `[click] 4`: two faint rust arcs draw between residues that sit far apart in the string, and the second line appears: distant positions constrain each other, so filling blanks forces the model to pick up structure.

**Spoken only:** the word "transformer" and that this is the training trick behind text models (BERT by name, once); that the model is trained on tens of millions of sequences; that structure and function show up in the representation as a by-product, far enough that later models predict a crystal structure from one sequence; and the honesty note that Shiru never uses the words "language model" in its patent, so this slide is the standard method, not a disclosure. Meta's ESM family named once, spoken only.

**Source:** report, "The training objective is the one introduced for BERT… Roughly 15% of tokens are selected at random and the model must reconstruct them from the surrounding context", and the ESM-2 masking split (80% mask, 10% random, 10% unchanged). Co-evolution: "Two residues that sit next to each other in the folded structure co-evolve: if one mutates, the other must compensate or the protein breaks." Status: the report's table marks "Masked language modelling as the pre-training objective, ~15% of residues masked" as **Inferred**. Alphabet size and typical length: the report's language-versus-protein table (20 amino acids; 100–1,000 residues). The sequence fragment and the two filled letters are illustrative.

## 4 · `embed` — 45 s · 3 pauses · crumb `Embed`

**The one idea:** every protein becomes about a thousand numbers, and two proteins that share few letters can still land next to each other.

**On screen**
- Left column, x 120, w 740. Caps label `TWO SEQUENCES` at y 288. Sequence `A` at y 340 and sequence `B` at y 420, both JetBrains Mono 28 px, 28 residues each, with the ~5 shared positions tinted olive and the rest cream. Readout under them at y 490: `letters in common: 18%` (mono, rust), tagged `illustrative`.
- Each sequence gets a number strip under it on click: a 700 × 44 row of 12 mono values (`0.41 −0.08 1.27 …`) ending in `… ×1,024`, at y 560 (A) and y 640 (B). A 28 px note at y 700: `one protein → about 1,000 numbers` with an `inferred` tag.
- Right column: the map SVG at x 960, y 300, 840 × 620. A code-drawn rough.js frame, no axes ticks, one caps label inside the top edge: `A FLAT PICTURE OF A 1,000-NUMBER SPACE` plus `illustrative` in `--text-3`. Points are 18 px circles.
- Points: `A` at local (250, 400) and `B` at local (310, 350), close together, both olive with labels. `C` at local (720, 120), far away, rust, labelled `C · 71% of letters match A`.
- Caption under the map at x 960, y 952: `Different letters. Same neighbourhood.`
- Footer: `Kit.src('US 11,439,159 B2 (fixed-size embeddings from models trained on unlabelled data) · Rost 1999, the twilight zone · ~1,000 dimensions inferred from public models (1,024 ProtT5, 1,280 ESM-1b). Sequences and map are illustrative.')`

**Build**
- Entrance: the two sequences with their shared letters tinted, the `18%` readout, and the empty map frame drawing itself on.
- `[click] 1`: each sequence collapses into its number strip (the letters fly together into the row), and the `about 1,000 numbers` note appears.
- `[click] 2`: `A` and `B` travel from their strips into the map and settle close together. This is the surprise: two strings with 18% of letters in common sit side by side.
- `[click] 3`: `C` appears with 71% letter overlap against `A` and drops at the far corner, then the caption writes on. Letter overlap and map distance disagree, and that is the whole point of changing the metric.

**Spoken only:** that a transformer gives one vector per letter and the standard move is to average them into one vector per protein; that the twilight zone is real (below about 25% identity, fewer than 10% of aligned pairs are genuinely related, so alignment has nothing left to work with); and that this pass over the whole database is a one-time batch job, which is why the catalogue is the company's asset. Also the forward hook: Giuseppe squeezes a whole recipe to a point the same way.

**Source:** report, "Every sequence in the corpus is passed through a pre-trained protein language model and stored as a single vector of roughly a thousand numbers"; "Typical dimensionalities are 1,024 for ProtT5 and 1,280 for ESM-1b"; the report marks "Embedding dimensionality on the order of 1,000" as **Inferred**. Patent wording: "variable-length sequences and their features are encoded into a fixed-size representation, and those vector representations are then compared against each other." Twilight zone: "below about 25% identity fewer than 10% of aligned pairs are genuinely related, while above roughly 30% identity about 90% are ([Rost, *Protein Engineering*, 1999](https://www.biostat.wisc.edu/~kbroman/teaching/statgen/2004/refs/rost1.pdf))". The sequences, the 18% and 71% overlaps, the map layout and the sample numbers are illustrative.

## 5 · `search` — 45 s · 3 pauses · crumb `Search`

**The one idea:** the query is a protein that already does the job, and the answer is its nearest neighbours — a couple of dozen out of 77 million.

**On screen**
- The same map, now full width: SVG at x 120, y 320, 1160 × 620, holding ~400 faint cream points. Caps label `THE DATABASE, AS POINTS` at x 120, y 288.
- Query point `brazzein` at local (520, 300), rust, 26 px, with a 28 px mono label `brazzein · a known sweet protein`.
- An expanding rust ring around it; the points inside it turn olive and get a count readout.
- Readout card at x 1340, w 460, y 320: `77,000,000` in `t-num` (mono, `Kit.count`) over the label `points in the index`, then on click `24` in `t-num` over `returned for one query`.
- Right column, x 1340, y 700: comparison chip (w 460, h 230) titled `ON PAIRS TOO DISTANT TO ALIGN`: two mono rows, `embedding search 57.5%` (olive) and `letter-by-letter 34.5%` (`--text-2`), with the 28 px label `top-1 accuracy, 2022 benchmark`.
- Caveat line at x 120, y 952 in `--text-2`: `On long, multi-part proteins, alignment still wins.`
- Footer: `Kit.src('Schütze et al., Frontiers in Bioinformatics 2022 (57.5% vs 34.5% top-1 below 20% identity; alignment better on full-length multi-domain sets) · Hume, AgFunderNews May 2024 (a query yields a couple of dozen candidates) · 77M+: company release, Mar 2026. The index type and cosine distance are inferred standard practice.')`

**Build**
- Entrance: the point cloud fades in and the `77,000,000` counter runs up from 0 (0.9 s).
- `[click] 1`: the query point lights rust and its label writes on. Nothing else changes yet, so the query reads as one point among millions.
- `[click] 2`: the ring grows outward and stops; the points it swept turn olive one by one, and the `24` counter lands. The funnel's first drop, 77 million to two dozen, happens in one motion.
- `[click] 3`: the comparison chip rises and the caveat line appears under the map.

**Spoken only:** that a customer can also query with a description instead of a sequence; that Hume's example is entering elastin and getting proteins with the same functionality; that the two dozen is set by what a lab can physically test in a quarter, not by the model; that production systems use an approximate index because an exhaustive scan is linear in corpus size, and that this is inferred, since Shiru discloses nothing about it; and the honest reading of the benchmark — embedding search complements alignment rather than replacing it, a nuance missing from company messaging.

**Source:** report, "A customer supplies either a protein that already does the job — the main egg-white protein, say, or the sweet protein brazzein… the system returns its nearest neighbours in the same space." Shortlist size: "A typical query, she says, yields a couple of dozen candidates" ([AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins)). Benchmark: "nearest-neighbour search over ProtT5 embeddings reached 57.5% normalised top-1 accuracy against 34.5% for the alignment-based tool MMseqs2… On full-length, multi-domain proteins the ranking reversed" ([Schütze et al., 2022](https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2022.1033775/full)). Index: the report marks "Approximate nearest-neighbour index (e.g. HNSW/FAISS), cosine distance" as **Inferred**. The 24 is the report's "couple of dozen" made concrete; mark it `illustrative` next to the counter if Rey prefers, otherwise keep the label `returned for one query` and say "a couple of dozen" aloud. The point cloud is illustrative.

## 6 · `filter` — 60 s · 4 pauses · crumb `Filter`

**The one idea:** three learned filters cut the shortlist, the lab cuts it to one, and every lab result — including every failure — goes back into the filters.

**On screen**
A left-to-right funnel across the content zone, drawn as one rough.js SVG at x 120, y 300, 1680 × 520. The funnel outline narrows from h 420 at the left edge to h 120 at the right.
- Stage numbers in mono above the funnel at y 300.
- Inlet label at x 150, y 430: `77M+` in `t-num` (mono), with `sequences` at 28 px under it.
- Three gates as vertical cream rules at local x 420 / 760 / 1100, each with its question above the funnel and its model under it:

| Gate | Question (above, `t-h2`) | What it predicts (below, 28 px) |
|---|---|---|
| 1 | `Works?` | `gels · dissolves · tastes sweet` |
| 2 | `Makeable?` | `can a microbe make it and release it` |
| 3 | `Safe?` | `does it look like a known allergen` |

- Outlet label at local x 1380: `dozens` (`t-h2`, olive), then the lab block at x 1480, y 640 (w 320, h 200): caps `LAB`, with `express · purify · assay` at 28 px, and `1 ingredient` in rust to its right at x 1720 — keep this column above y 960 so it clears the footer.
- A rust loop arrow curves from the lab block back over the funnel to gate 1, labelled `every result, including failures` at x 700, y 332.
- Note under the gate row at x 120, y 884 in `--text-2`: `Trained on a few hundred measured proteins` with a 28 px `inferred` tag.
- Closing olive line at x 120, y 940: `The lab, not the model, sets the pace.`
- Footer: `Kit.src('US 11,439,159 B2 (multi-objective ranking, allergenicity screening, and the loop that returns assay results to the training set) · Hume, AgFunderNews May 2024 (Expressor; a couple of dozen candidates). "A few hundred labels" is inferred.', 'Self-reported')`

**Build**
- Entrance: the funnel outline draws itself on left to right, with the `77M+` inlet counting up. All three gates are present as dim rules from the first frame, so nothing jumps later.
- `[click] 1`: gate 1 brightens, its question and model label appear, and the stream of points inside the funnel thins visibly at that rule.
- `[click] 2`: gate 2 the same way. Say on screen what it predicts: whether a microbe can make the protein and release it.
- `[click] 3`: gate 3 brightens, and the `dozens` outlet label lands. The three narrowings are now one picture.
- `[click] 4`: the lab block drops in, `1 ingredient` appears, the rust loop arrow draws backwards to gate 1, and the closing line writes on.

**Spoken only:** that these three predictors are small supervised models sitting on the frozen embedding, which is the whole payoff of step 1; the irony that the regulator's allergen screen is the letter-by-letter identity test Shiru's search is built to beat (35% identity over 80 residues, or six residues in a row); that the patent deliberately keeps failures, because in a search where almost everything fails the negative examples are the more useful half; that the textbook name for the loop is active learning; and that the best-gelling protein is worthless if yeast will not secrete it, so the shortlist is the top of a combined score, not of any one ranking.

**Source:** report, "Three kinds of predictor score the retrieved candidates: function… producibility… and safety"; "These are small supervised models trained on the few hundred proteins Shiru has physically measured"; "Computation narrows millions to dozens; the laboratory narrows dozens to one; and the laboratory step, not the model, sets the pace of the whole operation." Loop: the patent's claim 1 as summarised in "Ranking and the discovery flywheel", including "the patent is explicit that failures are kept". Expressor: "predicts expression potential… intended to generalise across host organisms" and secretion making purification cheaper. Allergen rule: FAO/WHO, "more than 35% identity to a known allergen over a window of 80 amino acids, or shares six contiguous amino acids with one" (spoken only). The report marks "Supervised heads trained on a few hundred lab-measured proteins" as **Inferred**. The flag on the footer covers the `77M+` company figure.

## 7 · `results` — 50 s · 2 pauses

**The one idea:** the search produced a real ingredient on the shelf, and it is worth being exact about which part the model did.

**On screen**
- Left column, x 120, w 760. Caps label `THE SEARCHABLE DATABASE` at y 288. Big number at y 340: `77M+` in `t-num` (mono, `Kit.count` with suffix), label under it at y 500: `natural protein sequences, March 2026`, and a second 28 px line at y 548 in `--text-2`: `33M+ in May 2024`. A thin olive bar pair under the two figures (w 300 → w 700) makes the growth a change rather than two numbers.
- Right column, x 1000, w 800. Real credited OleoPro product photo at y 320 (w 520, h 360), tilted ~2°, with the caption `OleoPro · in commercial production since April 2025` at 28 px, y 700.
- Second big number at x 1560, y 340: `>90%` in `t-num` (rust), with the label `less saturated fat than the solid fats it replaces` at 28 px wrapped in w 320, y 500, and a `Self-reported` tag at y 600.
- Honest line across the bottom at x 120, y 900, olive, `t-h2`: `AI picked the proteins.` and under it at y 960 in `--text-2`: `Potato protein and ordinary oil did the rest.`
- Footer: `Kit.src('GlobeNewswire 18 Mar 2026 (77M+) · BusinessWire 1 May 2024 (33M+) · Milling MEA 2025 (>90% less saturated fat) · Protein Production Technology Apr 2025 (commercial production) · Griffith Foods 2023. Product photo: <credit>.', 'Self-reported')`

At most two big numbers, per KIT §7: `77M+` and `>90%`. No third.

**Build**
- Entrance: the `77M+` counter runs up and the two olive bars grow, so the 33M → 77M jump is visible before any word is spoken.
- `[click] 1`: the OleoPro photo drops onto the slate, the `>90%` number counts in with its `Self-reported` tag, and the caption appears.
- `[click] 2`: the two closing lines write on, and the `>90%` number dims to 60%. The last thing on screen is the correction, not the claim.

**Spoken only:** what OleoPro physically is (liquid oil trapped in a protein network, so it behaves like a solid fat, solid at room temperature and browning when cooked); that Shiru says its scientists used AI to scan and select nearly 10,000 formulations and puts the discovery phase at under three months, against a traditional route the company describes as roughly half a decade and more than a quarter of a billion dollars — all company figures with no independent check; the CEO's "a team of 50 scientists a decade" line as the before-picture, flagged as her framing; that no accuracy, hit rate or validated new sweet protein has ever been published; and the sweet-protein programme with Ajinomoto as the live test of the thesis.

**Source:** report, "Its searchable database held more than 33 million natural protein sequences in May 2024 and more than 77 million by March 2026." OleoPro: "A structured fat: plant protein plus unsaturated liquid oil, solid at room temperature, browning when cooked, claimed at [over 90% less saturated fat](https://millingmea.com/ai-integrated-firm-shiru-develops-plant-based-proteins/) than conventional solid fats | Launched Mar 2023; commercial production Apr 2025." The potato basis: "Public descriptions identify the protein in the commercial products as potato protein — an existing, commercially available plant protein — structured with ordinary unsaturated oil through a proprietary process." Honest reading: "the model narrowed a search space, and conventional food science and process engineering did the rest." The report's status table lists the 90% saturated-fat reduction and the "50 scientists a decade" line under **Company claims**, so both carry the flag.

**Asset to source (not generated):** one real OleoPro photograph, with Rey's approval and a credit in the footer, per KIT §2.7 and the plan's "Real assets" row. No generated imitation of the product. If no usable photo clears, fall back to a code-drawn cross-section of an oleogel (oil droplets held in a protein network) labelled `diagram`, and move the photo to an open question.

## 8 · `takeaways` — 40 s · 2 pauses

**The one idea:** two lessons that outlive Shiru: pre-train when labels are expensive, and know what embedding search will and will not find.

**On screen**
Canonical closer: section image or veil behind, two numbered rows, marker strip.
- Row 1 at y 360 (h 190): `01` in mono, label `Pre-training`, headline `When one label costs weeks, learn the data first.`
- Row 2 at y 560 (h 190): `02` in mono, label `Embedding search`, headline `It finds what letters miss — only near what already works.` Write the dash as a new clause if the capture looks cramped: `It finds what letters miss. Only near what already works.`
- Marker strip at x 120, y 900: `READ · FIND · MIX · SELL · NEXT`, with `FIND` filled olive and `MIX` tinted saffron on the last click.
- Footer: `Kit.src('Shiru report: executive summary and limitations')`

No product facts in the rows, and no third row (HANDOFF §3.1).

**Build**
- Entrance: the strip with `FIND` filled.
- `[click] 1`: row 1 rises.
- `[click] 2`: row 2 rises, and `MIX` tints on the strip as the hand-off.

**Spoken only:** the hand-off to the next section — once you have new ingredients, the question becomes how to combine them into a recipe, which is NotCo. Also the structural limit behind row 2: the model sees one molecule, while gelling and foaming depend on pH, heat, processing and every other ingredient, which is why the lab cannot leave the loop, and why starting from a known-good protein is conservative by construction.

**Source:** report, "Self-supervised pre-training is what makes the labels sufficient… the pre-trained representation is what lets a few hundred labels support a model over 77 million candidates"; "Changing the metric space changes what 'similar' means"; "Retrieval bias toward the known. Starting from a known-good protein and retrieving neighbours is conservative by construction." No numbers on screen.

---

## Generated images

Three, all photoreal food or props on the matching slate under warm side light, each dropping on with a slight tilt. Prefix from `design/style-prefix.txt` (the file still holds the template's glass-render prefix and has to be rewritten for this deck in plan step 3). No text, no logos, no hands.

| File | Subject |
|---|---|
| `assets/img/shiru/egg.jpg` | One brown egg beside a cracked egg white in a small ceramic dish, on dark slate, warm side light, negative space to the right |
| `assets/img/shiru/milk.jpg` | A plain glass of milk on dark slate, warm side light, single soft shadow, negative space to the right |
| `assets/img/shiru/legumes.jpg` | A loose crowd of beans, peas, lentils and a few green leaves scattered across dark slate, shot from above, filling the frame |

`takeaways` reuses `legumes.jpg` behind the veil rather than adding a fourth image.

## Cross-section hooks

**Assumed from earlier sections:** the markers `Read · Find · Mix · Sell · Next` from the intro agenda; the self-reported-versus-independent distinction, first shown in the Samsung section; "model", "trained" and "labels" already defined there.

**Defined here, for later use:** "embedding" and "a point in space", which Giuseppe's `map` slide reuses for recipes; the funnel-plus-lab-loop shape, which Giuseppe's `steer` slide echoes with cook-and-taste cycles; and the throughline step "protein → vector", restated on the closing summary.

## Deliberately cut

| Cut | Why |
|---|---|
| Homology-aware clustering before train/test splits | The best ML lesson in the report, and it needs its own 60 s. No room, and it does not serve the section's spine. |
| Ensembling: BLAST in the ranking, the NeurIPS localisation paper, the GNN-plus-language-model result | A second modelling idea on top of four steps. One spoken clause on `filter` at most. |
| Expressor's enrichment figure (above 0.80 versus below 0.20) | Needs the accuracy-versus-enrichment distinction explained first. Spoken only, if time allows. |
| Funding, valuation, Series A/B, TIME award, WEF, layoffs, the platform-pivot story | Company history, not technique. The Sell section carries that kind of material for NotCo. |
| uPro, prebiotics with Ingredion, the sweet-protein programme as a slide | `results` already has two numbers. Sweet proteins survive as the spoken open question. |
| Mean pooling, cosine versus Euclidean, HNSW internals, the 70 GPU-days and 400 GB arithmetic | Mechanics below the level the section teaches. |
| FAO/WHO allergen thresholds on screen | Spoken only on `filter`, where it is an aside about the regulator, not a step. |
| The multi-domain weakness as its own slide | One line on `search`, which is where the benchmark already is. |
| "5–15 years to 1–2 years" | A company claim that duplicates what the `>90%` figure and the "50 scientists" line already carry. |

## Draft corrections (teammate PDF versus report)

| Draft says | Spec uses, from the report |
|---|---|
| OleoPro has "80 to 90% less saturated fat" | `>90%` — "claimed at over 90% less saturated fat than conventional solid fats", flagged self-reported |
| "plant protein plus plant oil" | Potato protein, an existing commercial plant protein, plus ordinary unsaturated oil |
| Funnel: "millions → thousands → hundreds tested → one" | 77M+ → a couple of dozen → the lab → 1 |
| Database "more than 33 million" as the current figure | 33M+ in May 2024, 77M+ in March 2026 |
| Three takeaway lines | Two rows (HANDOFF §3.1) |
| Brazzein "from a West African fruit" | Not in the report; the slide says only `a known sweet protein` |

## Checklist

- [x] Headings match the plan's heading map: `The protein problem`, `How Shiru searches`, `Proteins as language`, `Proteins as vectors`, `Nearest-neighbor search`, `Three filters`, `Results`, `Takeaways`.
- [x] `learn`, `embed`, `search` and `filter` are wrapped with `Kit.withCrumbs(def, ['Learn','Embed','Search','Filter'], n)`, and the four names match `approach`'s card titles character for character.
- [x] Every number has a `Kit.src` footer. `77M+`, `33M+` and `>90%` carry `'Self-reported'` (the "50 scientists" line was cut from the notes).
- [x] Every inferred claim is marked on screen or in the footer: the ~15% masking (`learn`), the ~1,000 numbers (`embed`), the approximate index (`search`, footer), the few-hundred labels (`filter`).
- [x] Illustrative values are labelled: the sequence fragments, the 18% and 73% letter overlaps, the map layouts, the point clouds, the `24`.
- [x] `[click]` count equals `ctx.pause()` count: 2 / 4 / 4 / 3 / 3 / 4 / 2 / 2.
- [x] `budgetSec` sums to 390. Notes run ~915 words against the 878-word target (+4%) after the review pass.
- [x] All CSS scoped under `.slide[data-sec="shiru"]`.
- [x] Hidden-by-default elements revealed with `Kit.show` or `tl.to`, never `tl.from` or `Kit.rise`.
- [x] Right-hand columns on `filter` and `results` clear the footer.
- [x] Every build step screenshotted at 1920x1080 in `qa/final/shiru/`, print mode checked, console errors empty in show and print.

## Build changes (what the built section does differently)

| Slide | Change | Why |
|---|---|---|
| `problem` | The rust cost chip sits at the lower left (x 120, y 820) and the rough arrow runs from it to the legume pile, instead of the chip sitting under the legumes. Milk cut-out reused from `assets/img/giuseppe/milk.webp`. | The right column could not hold the legume photo, the olive line and the chip without collisions. |
| `approach` | Four cards at x 120 / 552 / 984 / 1416, w 384, y 364, h 462. | 4 x 390 + gaps overran the x-1800 content edge. |
| `learn` | The `~15% of positions hidden` readout moved from the top right (y 288) to the `A PROTEIN` caps row (y 536), where nothing else sits. The fragment is 22 residues with 2 masks. The two co-evolution arcs are nested, not crossing. Note reworded to `alphabet of 20 ...`. | At y 288 the readout overlapped panel 1; "20 letters" read as a length, not an alphabet. |
| `embed` | Sequence C is shown on the left column as well as on the map, its overlap with A is **73%** (16 of 22 illustrative residues), and the payoff line moved to the lower left instead of under the map. Each sequence swaps in place into its number strip. | The left column was half empty below y 740; 71% is not reachable with a 22-residue fragment. The footer still marks both overlaps illustrative. |
| `search` | `77M+` and `24` are `Kit.count` counters in `t-num`, not the literal `77,000,000` (which does not fit 460 px at 132 px). `a couple of dozen` moved to the spoken notes; the `24` carries an `illustrative` flag. The comparison tile title is `LOW LETTER OVERLAP`. | Type scale and the y-990 floor. |
| `filter` | Gates at x 680 / 980 / 1280 (was 420 / 760 / 1100 local), one-line predictor labels, and the loop label is two lines at the left of the arc. | The labels overlapped each other and the loop arrow crossed the `Works?` / `Makeable?` text. |
| `results` | Uses a real credited OleoPro press photograph (Shiru company image, via AgFunderNews), so the code-drawn oleogel fallback was not needed. Right column restacked: photo, caption, `>90%`, label + `Self-reported`. `Griffith Foods 2023` dropped from the footer. | The spec's asset-to-source path cleared; the footer had to stay two lines. |
| `takeaways` | Reuses the `legumes.webp` cut-out at 30% opacity instead of a bleed image plus veil. | Cut-outs are this deck's grammar; no veil gradient is needed on slate. |
| Images | `assets/img/shiru/egg.webp` and `legumes.webp` are transparent cut-outs, not the three JPEG scenes the spec listed; milk is reused from the giuseppe section. | KIT 9: cut-outs are the default for food props. |

## Review pass (reviewer + fixer)

| Slide | Fix |
|---|---|
| `problem` | `WHAT NOBODY HAS TESTED` now arrives with the legume pile on click 1, so the right half is never a labelled void. Notes: "fewer than a quarter even survive purification" corrected to "only about a quarter", which is what `sources/shiru.md` (49% expression x 52% purification) supports. |
| `approach` | Card height 516 -> 462 (top 364) to close the dead band between the question and the technique line. Notes: the closing line no longer claims a crumb marker that this slide does not show. |
| `learn` | The payoff line now names the visual: "The arcs mark letters that touch once the chain folds." (was a 13-word sentence that never mentioned the arcs). |
| `search` | The `brazzein` label moved above the expanding ring (centred at x 790, y 452) so it no longer crosses the dashed circle; the dot-cloud exclusion box moved with it. Comparison tile title `TOO DISTANT TO ALIGN` -> `LOW LETTER OVERLAP` (one line, plain words). Caveat and notes now say "letter matching" rather than "alignment", matching the word used in the tile. |
| notes | Trimmed `approach`, `embed`, `results` and `takeaways`; the section now runs ~915 words (878 target). `[click]` counts still equal `ctx.pause()` counts (2 / 4 / 4 / 3 / 3 / 4 / 2 / 2) and budgets are unchanged. |

## Deck-wide QA pass (v1)

- `approach` notes trimmed from 76 to 69 words (152 → 138 wpm, the only slide in the deck outside
  the 115–150 wpm band). No on-screen change, no change to the [click] count or the budget.
