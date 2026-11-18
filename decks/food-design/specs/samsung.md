# Spec: section 01 · Read · Samsung Food

**Owner files:** `sections/01-samsung.js`, `css/sections/samsung.css`, `assets/img/samsung/`, `specs/samsung.md`
**Budget:** **390 s** (plan: 390 s) = 45 + 45 + 30 + 70 + 45 + 45 + 45 + 30 + 35
**Built:** `read` lost one click and 5 s (see below); everything else follows this spec.
**Reviewed:** see "Review fixes" at the end for the changes made after the build.
**Section color:** `teal` (`--sec` = `#2F7A74`, `--sec-t` = `#79C7BC`). Focus accent: `rust` `#D2643A` / `--rust-t` `#F08A5D`.
**Kicker:** `Read`. Section title: `Samsung Food`.
**Slide order:** `DEMO, PROBLEM, APPROACH, READ, PARSE, LINK, ERRORS, DISH, TAKEAWAYS`
**Sources:** `sources/samsung-food.md` only. Sections used: "The short version", "What Samsung actually ships", "The problem it solves", "How it works at a high level", "Deep dive 1", "Deep dive 2", "Deep dive 3", "Evaluation and failure modes".
`sources/drafts/app1-samsung-draft.pdf` is a secondary teammate draft and is **not** a source for any number on a slide. Where the two disagree, the report wins.

---

## Story spine (approve before building)

1. **Problem.** A recipe on a cookbook page or a handwritten card is pixels. Every feature in Samsung Food — ingredient search, nutrition, serving changes, the shopping list, oven settings — needs a typed record instead, and typing one by hand takes over 50 fields.
2. **Why this technique.** The input is a document, not a dish. So the task is information extraction from a visually rich document, then entity normalization against a food database. Reading a page is a far easier problem than imagining a recipe, which is why this is the feature Samsung ships and inverse cooking is not.
3. **How it works, in 4 steps.** **Read** (pixels to text) → **Sort** (which text is title, ingredients, steps) → **Parse** (one ingredient line into quantity, unit, name, note) → **Link** (every spelling of one ingredient to one entity). Samsung has not published this pipeline; it is the standard decomposition, marked Inferred on screen.
4. **Results.** Samsung publishes no accuracy figures for the scanner, so this section has no product results slide. The `dish` slide uses published research numbers instead, labeled Research: an ingredient F1 of 49.27 for the best dish-photo system, and 55.47% of generated recipes judged to match the photo against 80.33% for the real recipe.
5. **Takeaways.** (1) Structure is what makes data usable: a record you can compute with beats text you can read. (2) The two architectures fail in two different ways — a chain misreads what is there, one big model writes what is not there — so check both and keep a person at the end.

**Roadmap cards and crumb names (exact):** `Read` · `Sort` · `Parse` · `Link`.

---

## Slides

| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `demo` | Recipe from a photo | 45 | 1 | — |
| `problem` | The recipe problem | 45 | 3 | — |
| `approach` | How the scanner works | 30 | 4 | — |
| `read` | Reading the page | 70 | 4 | Read |
| `parse` | Parsing ingredient lines | 45 | 4 | Sort + Parse |
| `link` | Linking to a food graph | 45 | 3 | Link |
| `errors` | Two kinds of error | 45 | 3 | — |
| `dish` | Recipes from a dish photo | 30 | 2 | — |
| `takeaways` | Takeaways | 35 | 2 | — |

**Crumb mechanics.** `Kit.crumbs(steps, cur)` now accepts an array, so `parse` uses `Kit.withCrumbs(def, STEPS, [1, 2])` and no local helper is needed.

**Generated images (3 generations, 4 files).** All photoreal, on the same dark slate, warm side light from upper left, no readable text, no logos, no hands.
- `assets/img/samsung/recipe-card.jpg` — a worn handwritten index card, slightly curled, on dark slate. The handwriting is illegible looping ink, so no words are generated.
- `assets/img/samsung/cookbook.jpg` — an open cookbook spread, used full-bleed under the `takeaways` veil. Printed matter is out of focus.
- `assets/img/samsung/page.jpg` — a portrait crop of the same generation, used as the `ONE PAGE` tile on `read`.
- `assets/img/samsung/dish.jpg` — a finished stew in a shallow bowl, shot from above, ingredients not identifiable.

All diagrams are code-drawn SVG with the rough.js wobble in cream strokes that draw themselves on. Caveat is used only for the four short doodle callouts named below.

---

## Per slide

### 1 · `demo` — 45 s — "Recipe from a photo"

**The one idea:** point the camera at a written recipe and an editable recipe comes back.

**On screen.** Placeholder; Rey picks the demo later. A framed empty phone-shaped area, cream rough.js stroke, 2 px, rounded 36: x 760, y 280, w 400, h 640. Inside, the area stays empty slate with a centred `t-label` `demo` in Caveat, rust, rotated −4°, plus a small Caveat arrow curving to the frame's top edge. Left column x 120, w 560: `t-label` caps `INPUT` at y 330 and the line `A photo of a written recipe` at y 390. Right column x 1280, w 520: caps `OUTPUT` at y 330 and `An editable recipe in the app` at y 390. Body text total: 11 words.

**Build.** Entrance: the two column labels fade in, then the phone frame draws itself on (stroke-dashoffset, .9 s), then the `demo` callout and its arrow. `[click]` 1: the caption `Photo in, record out.` rises at x 760, y 950, centred under the frame and clear of the footer.

**Spoken only.** The feature shipped 30 July 2025, in app versions iOS 5.48.0 and Android 2.46.0. Basic accounts get three free scans, then it needs the paid Food+ tier. The user can add extra pages when a recipe runs over one page. Demo first, because the rest of the section explains what happens during the wait.

**Source.** `Kit.src('Samsung Food Help Center; App Store version history, 30 Jul 2025', 'Confirmed')`. Report, "What Samsung actually ships": "Add recipe from photo … Shipped 30 Jul 2025 (iOS 5.48.0, Android 2.46.0); 3 free scans, then Food+" [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674) [\[15\]](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/). No numbers on screen.

**Open:** when Rey supplies the clip or the live capture, this slide gets a real credit line and the placeholder frame becomes a `<video>`.

---

### 2 · `problem` — 45 s — "The recipe problem"

**The one idea:** a photographed recipe is pixels, and pixels cannot be computed with.

**On screen.**
- Left: `recipe-card.jpg` dropped onto the slate at x 120, y 320, w 720, h 480, tilted −3° with a soft shadow. Caps label `A PHOTO` at x 120, y 272.
- Middle: a rough.js arrow, x 870 → x 1020 at y 560, drawn on.
- Right: a JSON card (JetBrains Mono 28, cream on `--surface`) at x 1060, y 320, w 740, h 400. It starts with empty values:
  `{ "title": —, "yield": —, "ingredients": [ ], "steps": [ ] }`. Caps label `A RECORD` at x 1060, y 272.
- Rust chip under the card at x 1060, y 760: `50+ fields, typed by hand`.
- Bottom strip, five small cards at y 860, h 110, x 120 / 460 / 800 / 1140 / 1480, w 320: `Search` · `Nutrition` · `Servings` · `Shopping list` · `Oven`. Dim until the last click.

Body text on screen: the two caps labels, the chip, the five card words. Under 12 words.

**Build.** Entrance: the photo drops in with its tilt, `A PHOTO` fades. `[click]` 1: the arrow draws and the empty JSON card rises with `A RECORD`. `[click]` 2: the `50+ fields, typed by hand` chip appears in rust. `[click]` 3: the five bottom cards light in teal, one 60 ms after another.

**Spoken only.** Samsung's own pitch is the recipes "open in dozens of tabs". Web import is the easy case and even that breaks: Samsung's help center warns that not every recipe site carries metadata it can read, and a cookbook page or a grandparent's index card has none at all. Before the New York Times automated it, contractors typed recipes into a form field by field; an average recipe needed over 50 fields and complex ones over 100. Samsung's own Recipe Builder has the same shape: title, source, photo, description, then each ingredient in turn. Ingredient search runs across more than 42,000 products in 26 languages, which only works because each ingredient is a known entity.

**Source.** `Kit.src('NYT recipe structuring, via Digital Humanities Now; Samsung Food brand page', 'Confirmed')`. "50+ fields" from the report, "Structuring a recipe by hand is slow": "An average recipe needed over 50 fields, and complex ones over 100" [\[34\]](https://digitalhumanitiesnow.org/?p=64609) — Confirmed (research/press, not Samsung). The five downstream cards from "Structure is what unlocks the rest of the product": search across "42,000+ products in 26 languages" [\[3\]](https://apps.apple.com/ca/app/id1133637674), nutrition by "matching ingredients to a food database" [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), "change servings, swap ingredients" [\[3\]](https://apps.apple.com/ca/app/id1133637674), "Shopping lists built from a recipe's ingredients" [\[7\]](https://news.samsung.com/ca/samsung-announces-global-launch-of-samsung-food-an-ai-powered-personalized-food-and-recipe-service), "sending settings to a SmartThings oven" [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) — all Confirmed. The JSON card's field names are illustrative; label the card `illustrative schema` in the footer.

---

### 3 · `approach` — 30 s — "How the scanner works"

**The one idea:** four steps turn a page into a record, and each one can fail on its own.

**On screen.** Four roadmap cards at y 380, w 380, h 420, x 120 / 545 / 970 / 1395. Each card: step number in mono, the step name in Fraunces (`t-h2`), the question it answers in `t-body`, and the technique name in `t-label` teal.

| # | Step | Question | Technique |
|---|---|---|---|
| 1 | Read | What does the page say? | OCR or a vision-language model |
| 2 | Sort | Which text is which? | Layout analysis |
| 3 | Parse | What is in this line? | Sequence labeling |
| 4 | Link | Which ingredient is this? | Entity normalization |

Caption at x 120, y 870: `Samsung has not published its pipeline.` with an `Inferred` tag in rust beside it.

**Build.** Entrance: the caption and four empty card outlines draw on, so the intermediate state never looks like a failed render. `[click]` 1–4: one card fills per click, left to right. The four names here are the exact crumb strings used by `read`, `parse` and `link`.

**Spoken only.** The user taps a button and waits. Behind that wait, these four things happen. Samsung does disclose two matching facts: that deep-learning NLP structures recipe content, and that one of its patents runs recipe text through several natural language understanding models to find its semantic elements. The rest of this section is the standard way to build each step, not Samsung's published design.

**Source.** `Kit.src('Standard decomposition; Samsung Food brand page; Samsung patent US20230134600A1', 'Inferred')`. Report, "What happens behind the button (Inferred)": the six stages and "Samsung has not published the scanner's architecture… They match what Samsung does disclose: deep-learning NLP structures recipe content [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), and a Samsung patent describes running recipe text through several natural language understanding (NLU) models" [\[13\]](https://9235.net/patent/US2023134600A1.html). No numbers.

---

### 4 · `read` — 70 s — "Reading the page" — crumb `Read`

**The one idea:** either chain specialist models that read characters first, or let one model look at the page and write the record directly.

**On screen.** One source tile and two lanes. The multimodal split (vision encoder, projector, language model) was cut from the slide and moved into the spoken notes, because the slide was carrying two teaching ideas at once.
- Source tile: `page.jpg` at x 120, y 430, w 220, h 300, tilted -2, with caps `ONE PAGE` above it at y 382. A drawn arrow feeds each lane.
- **Path A** lane. Caps `PATH A · A CHAIN` at x 400, y 286. Four rough.js boxes at y 350, h 120, w 290, x 400 / 740 / 1080 / 1420, joined by drawn arrows: `OCR` -> `Layout` -> `Parse` -> `Link`. On click 2 the OCR box opens, through a drawn bracket, into two boxes at y 520: `encoder / looks at pixels` and `decoder / writes characters`, with a Caveat callout `pixels in, characters out` at x 1118 and an arrow back to the decoder box.
- **Path B** lane. Caps `PATH B · ONE MODEL` at x 400, y 676. One rust-outlined box at x 400, y 740, w 630, h 130: `One model, one pass`. Arrow to a mono JSON chip at x 1120, y 740, w 680.
- The failure modes land on each lane's caption row, right-aligned to x 1800: teal `fails by misreading a character` on Path A, rust `fails by inventing a line` on Path B.
- The `PATH B · ONE MODEL` label appears with Path B's content on click 3, not in the entrance, so the encoder/decoder inset is never mistaken for Path B.

Body text is labels only; no line runs past 7 words.

**Build.** Entrance: the page tile drops in, both lane labels fade, the Path A feed arrow draws. `[click]` 1: Path A's four boxes and arrows draw left to right. `[click]` 2: the OCR box opens into encoder and decoder, with the Caveat callout. `[click]` 3: the Path B feed arrow, the single box and the JSON chip draw in rust. `[click]` 4: the two failure lines appear and Path A's arrows pick up a rust dot at each join, to show where an error is passed on.

**Spoken only.** Optical character recognition turns images of text into machine-readable text. The modern version, TrOCR from Microsoft in 2021, uses a pre-trained image Transformer as the encoder and a pre-trained text Transformer as the decoder, and it beat the older designs on both printed and handwritten text. The intuition is machine translation where the source language is pixels. Handwriting matters, because Samsung markets turning handwritten recipes into digital ones. Donut, from NAVER CLOVA in 2022, skips OCR: it maps a document image straight to structured output, and the paper's own figure turns a receipt photo into nested JSON. A general multimodal model such as LLaVA goes further: a vision encoder cuts the image into patches, a small projector translates those patches into the same space the language model uses for words, and then the language model writes an answer. The projector teaches the image to speak a dialect the language model already understands. For a scanner you lower the sampling temperature, because you want the most likely tokens when copying text off a page. Samsung does not name its model. Its terms say it may use OpenAI to generate and adapt recipes, so a plausible design is a hosted multimodal model for the draft and Samsung's own deterministic parsing afterwards — a teaching hypothesis, not a fact.

**Source.** `Kit.src('TrOCR (AAAI 2023) · Donut (ECCV 2022) · LLaVA-1.5 (2023); Samsung has not named its model', 'Inferred')`. Report, "Deep dive 1 / Stage 2": "TrOCR (Microsoft, 2021)… pre-trained image Transformer as the encoder and a pre-trained text Transformer as the decoder" [\[27\]](https://arxiv.org/abs/2109.10282v5). "Deep dive 2 / Skipping OCR entirely": "Donut… maps a document image straight to structured output" [\[28\]](https://arxiv.org/abs/2111.15664v3). "Multimodal large language models": the vision encoder, projector and language model split [\[29\]](https://arxiv.org/abs/2310.03744). The "errors propagate" dot from "The weakness": "The Donut authors list three costs of OCR-first pipelines… OCR errors propagating into later steps" [\[28\]](https://arxiv.org/abs/2111.15664v3). The "may use OpenAI" line from "What Samsung probably runs (Inferred, unverified)" [\[5\]](https://samsungfood.com/policy/terms/). No numbers on screen. Both paths are marked Inferred for Samsung; name no Samsung model.

---

### 5 · `parse` — 45 s — "Parsing ingredient lines" — crumbs `Sort` + `Parse`

**The one idea:** an ingredient line has a tiny grammar, so a model can tag every word in it.

**On screen.**
- Left, the Sort half: a rough.js page sketch at x 120, y 320, w 460, h 580, with three blocks drawn as stacks of cream rules. Block labels land on click 1, in teal: `title`, `ingredients`, `method`.
- Right, the Parse half, x 700, w 1100. The example line in JetBrains Mono 36 at y 400: `1 pound carrots, young ones if possible`. Per-token tags in `t-label` 28 directly under each span at y 470: `QTY` `UNIT` `NAME` `COMMENT`. Four typed field rows at y 560 / 650 / 740 / 830, each `label : value` with a 160 px confidence bar at the right edge (x 1640).
- Nothing else. Body text is the line plus eight label words.

**Build.** Entrance: the page sketch draws on with unlabeled blocks. `[click]` 1: the three block labels land (this is `Sort`). `[click]` 2: the ingredients block's first line lifts out of the sketch and lands in mono on the right. `[click]` 3: the four token tags appear under their words, one 80 ms after another. `[click]` 4: the four typed fields assemble, each with its confidence bar filling.

**Spoken only.** The New York Times open-sourced a tagger that turns exactly this line into quantity one, unit pound, name carrots and the comment "young ones if possible". It uses a conditional random field, which labels every word while taking its neighbours' labels into account, so "cup" after a number is almost certainly a unit. It was trained on lines people had tagged by hand. A newer open-source package does the same thing, trained on 60,000 ingredient sentences, and returns a confidence score for every field — which is what makes the review step on the next slide possible. Sorting is harder than it sounds: one competing scanner app tells its users that a two-column ingredient list needs two separate selections. Think of it as parsing a web page with every HTML tag stripped out.

**Source.** `Kit.src('NYT ingredient-phrase-tagger; Ingredient Parser (60,000 tagged sentences)', 'Confirmed')`. Report, "Stage 4": "The New York Times' open-source tagger turns `1 pound carrots, young ones if possible` into quantity `1`, unit `pound`, name `carrots` and comment `young ones if possible`" [\[30\]](https://github.com/NYTimes/ingredient-phrase-tagger); "A newer open-source package uses the same idea, trained on 60,000 ingredient sentences, and returns a confidence score for each field" [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html). "Stage 3": the two-column warning [\[36\]](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-the-Recipe-Scanner). The confidence-bar lengths are illustrative; mark them so in the footer.

---

### 6 · `link` — 45 s — "Linking to a food graph" — crumb `Link`

**The one idea:** four spellings become one entity, and only the entity can be looked up.

**On screen.**
- Four mono chips at x 120, w 480, h 76, at y 340 / 440 / 540 / 640: `plain flour`, `all-purpose flour`, `AP flour`, `2 c. flour`.
- Four drawn arrows converging on one teal entity node at x 760, y 440, w 260, h 180, labeled `flour` in Fraunces with a small `id` line in mono.
- Three output cards at x 1100, w 700, h 160, at y 330 / 520 / 710: `Nutrition`, `A store product`, `Oven settings`. Each card carries one `t-label` line: `per 100 g`, `from 140,000+ items`, `time and temperature`.
- Caveat callout above the node: `one name, many spellings`.

**Build.** Entrance: the four chips rise. `[click]` 1: the arrows draw and converge; the entity node appears. `[click]` 2: the `140,000+` figure counts up on the middle card (`Kit.count`). `[click]` 3: the three output cards light in teal, top to bottom.

**Spoken only.** Whisk is the company Samsung bought in 2019 and rebranded as Samsung Food in 2023, and this is the layer it built. By 2019 its app already pulled the title, photo and ingredients out of saved recipe pages into structured fields. It describes an ontology of products and maps ingredients to more than 140,000 store items. Today Samsung Food matches ingredients to a food database to show nutrition, and its terms mention an open-source food products database. The scale of the mess is worth a number: the Inverse Cooking authors started with 16,823 raw ingredient names in Recipe1M and had to merge, cluster and strip plurals and rare items to get down to 1,488 usable ones. One last caution: a temperature or a time read off a photo should be range-checked before it is allowed to drive an oven.

**Source.** `Kit.src('Whisk platform documentation; Samsung Food brand page', 'Confirmed')`. Report, "Stage 5": "It describes an ontology of products and maps ingredients to more than 140,000 store items" [\[20\]](https://docs.whisk.com/); "Samsung Food matches ingredients to a food database to show nutrition" [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). Spoken-only 16,823 → 1,488 from the same section [\[24\]](https://arxiv.org/pdf/1812.06164) (Research). The four flour spellings are the report's own example list; the `id` line on the node is illustrative.

---

### 7 · `errors` — 45 s — "Two kinds of error"

**The one idea:** a chain misreads what is on the page; one big model writes what is not on it.

**On screen.** Two panels and one strip.
- Left panel, x 120, y 320, w 800, h 460, teal rule. Caps `MISREAD`. Mono before/after: `½ tsp salt` → `12 tsp salt`, the `12` in rust. Under it one line: `Everything after it is correct. The recipe is ruined.` (9 words.)
- Right panel, x 980, y 320, w 820, h 460, rust rule. Caps `INVENTED`. Three cream lines of a recipe, then a fourth in rust marked with a Caveat `not on the page` callout and an arrow.
- Bottom strip, x 120, y 830, w 1680, h 130: three items in a row — `confidence per field` · `low-confidence fields flagged` · `the user saves and edits`.

**Build.** Entrance: both panel headers and their empty rules draw on. `[click]` 1: the left panel's misread plays — `½` flips to `12` and the sodium readout beside it reads `190 mg → 4,560 mg`, so the consequence is a visible change rather than a bare number. `[click]` 2: the right panel's three real lines appear, then the fourth rust line slides in with its callout. `[click]` 3: the bottom strip fills left to right, ending on the user.

**Spoken only.** This is the trade-off between the two paths, stated as failures. In a chain, a mistake early on poisons everything after it: the parser tags the wrong number perfectly, the nutrition is computed perfectly, and the dish is still inedible. A single large model rarely misreads a character, but it writes fluent text that was never on the page. FIRE's authors call hallucination a critical challenge for this whole family of systems. The mitigations differ: per-field confidence scores are natural in a chain and hard to calibrate for a large model, so for the model you check each output line against the text actually found in the image and keep the sampling temperature low. In both cases Samsung's flow ends the same way, with a recipe the user saves and can then edit. A good interface makes the uncertain fields obvious instead of burying them.

**Source.** `Kit.src('Donut (ECCV 2022) on error propagation; FIRE (WACV 2024) on hallucination; Samsung Food Help Center', 'Confirmed; the ½ → 12 example is illustrative')`. Report, "The weakness: errors propagate": "An illustrative example: if OCR reads '½ tsp salt' as '12 tsp salt', the parser tags it perfectly, the nutrition is computed perfectly, and the recipe is still ruined" [\[28\]](https://arxiv.org/abs/2111.15664v3) [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html) — the report marks this **illustrative**. Hallucination row of the trade-off table and "FIRE's authors call hallucination 'a critical challenge'" [\[25\]](https://arxiv.org/pdf/2308.14391). The review step from "Safety and accuracy": "The human is the last validator. Samsung's flow ends with the user saving a recipe they can then edit" [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[2\]](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder). The wrong sodium readout is illustrative and is labeled `illustrative` on screen.

---

### 8 · `dish` — 30 s — "Recipes from a dish photo"

**The one idea:** writing a recipe from a photo of the finished dish is still research, and Samsung does not ship it.

This slide carries the section's results-type content. Samsung publishes no accuracy numbers for its scanner, so both numbers here are **Research**, not product results, and the flag says so.

**On screen.**
- `dish.jpg` at x 120, y 320, w 560, h 420, tilted −3°, with a Caveat callout `what is in it?`.
- Two big numbers, `t-num` mono, at x 760, y 360 and x 1280, y 360, each with one plain label under it at y 520, w 460:
  - `49.3` · `ingredient F1, best system`, with `100 = a perfect ingredient list.` under it in `--text-3`, so the scale of an undefined term is readable
  - `55%` · `generated recipes judged to match the photo`
  - Under the second, in `--text-3`: `the real recipe scored 80%`.
- One teal line at x 760, y 740, w 1040: `Samsung's dish-photo feature finds existing recipes.` (7 words.)

**Build.** Entrance: the dish photo drops in with its callout, and the heading sets the question. `[click]` 1: both numbers count up with `Kit.count`, labels fading in behind them, and the 80% reference line appears in `--text-3` so the 55% is never read as good. `[click]` 2: the Samsung line lands in teal, and the dish photo dims.

**Spoken only.** Four things make this hard: salt, oil and spices are never visible; mozzarella and cheddar look the same under melted cheese; a photo shows the result, not the oven temperature or the order of the steps; and many different recipes produce dishes that look identical, so scoring against one true recipe punishes correct answers. FIRE does not predict quantities at test time at all, and an unseen dish produced an unrelated recipe. What Samsung actually ships under the name Image-to-Recipe is recognition plus retrieval: it recognizes meals and food items in a photo and then finds existing recipes for them. That is the safe version, and it is limited to recipes already in the collection.

**Source.** `Kit.src('FIRE, WACV 2024 · Inverse Cooking, CVPR 2019 · Samsung Newsroom, CES 2024', 'Research; not Samsung results')`. Report, "Deep dive 3": "The research systems covered here reach an ingredient F1 score of about 49%" and FIRE's "ingredient IoU 32.59 and F1 49.27" [\[25\]](https://arxiv.org/pdf/2308.14391); "When users judged whether a recipe matched the image, real recipes succeeded 80.33% of the time, generated ones 55.47% and retrieved ones 48.81%" [\[24\]](https://arxiv.org/pdf/1812.06164). The Samsung line from "Two meanings of 'image-to-recipe'": Image-to-Recipe "recognizes meals and multiple food items from photographs" and then explores existing dishes [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024) — Confirmed. Round 49.27 to `49.3` and 55.47 to `55%` on screen; say the exact figures nowhere.

**Do not claim** that Samsung generates a recipe from a dish photo. The report is explicit: "No public Samsung source says the app generates a new recipe from a dish photo."

---

### 9 · `takeaways` — 35 s — "Takeaways"

**The one idea:** two lessons that hold outside Samsung Food.

**On screen.** `cookbook.jpg` full-bleed behind a dark veil (85% `--bg`), two numbered rows at y 420 and y 660, each: index in mono, a teal tag, and one headline line in Fraunces.

| # | Tag | Row |
|---|---|---|
| 01 | Document understanding | Structure is what makes data usable. |
| 02 | Two failure modes | Chains misread. Big models invent. Check both. |

Marker strip at y 900: `READ · FIND · MIX · SELL`, with `READ` filled teal and `FIND` tinted olive on the second click.

**Build.** Entrance: the veiled image and the marker strip. `[click]` 1: row 01. `[click]` 2: row 02, then `FIND` tints on the strip.

**Spoken only.** Neither row is a Samsung fact. Row one is why any product does extraction at all: a record you can compute with beats text you can read, and the product features follow from the record, not from the photo. Row two is the architecture choice in one line, and the reason both options keep a person at the end. Hand-off: that is reading. Next, finding — Shiru.

**Source.** No numbers. No `Kit.src` needed beyond the image credit if one applies (the image is generated; label it `illustration`).

---

## Cross-section hooks

**Assumed from earlier:** only the intro agenda's markers (Read · Find · Mix · Sell). No ML vocabulary at all. This section defines, from zero: record, OCR, encoder, decoder, layout analysis, sequence labeling, entity normalization, confidence, hallucination.

**Set up for later sections**
1. **Food turned into data.** The recipe card becomes a typed record here; Shiru turns a protein into a vector and Giuseppe turns a recipe into a point. The throughline starts on `problem`.
2. **Encoder and decoder.** Named here on `read`. Shiru's `learn` and Giuseppe's `map` both reuse the pair without re-teaching it.
3. **Research numbers are not product results.** Established on `dish`, so the Shiru and NotCo results slides can use the same flagging without explanation.
4. **The marker strip geometry** is defined on this section's `takeaways` and copied by Shiru, Giuseppe, NotCo and Future.
5. **Visual grammar:** teal = this section and anything confirmed, rust = the one thing to look at and anything wrong or invented, `--text-3` = a reference value you are not supposed to admire.

## Deliberately cut

| Cut | Why |
|---|---|
| The Whisk recommender and user embeddings (the draft's slides 3–4) | Twomey et al. 2020 is Cookpad research, not Whisk or Samsung. Cut, not reframed. |
| The other five Samsung photo and video features (Vision AI Food List, Video to Recipe, TVs, Samsung Health Scan meal) | Only "Add recipe from photo" is this section's subject. One spoken sentence names Image-to-Recipe on `dish`. |
| Capture and clean-up (de-skew, de-curl, contrast) | Real but not a teaching idea. One spoken clause on `read` at most. |
| The four research waves on inverse cooking (Recipe1M retrieval, Inverse Cooking, FIRE, LLaVA-Chef) as slides | 30 s buys two numbers and a conclusion, not four architectures. |
| Set prediction, IoU, perplexity, BLEU and ROUGE | Vocabulary the audience cannot use in one talk. "F1" gets one spoken sentence. |
| The privacy section and the six-million-user figure | The user figure is draft-only and is not in the report. Privacy has no room. |
| The full evaluation table | `errors` teaches the two failures instead. |

## Checklist
- [ ] Headings match the plan's heading map: Recipe from a photo · The recipe problem · How the scanner works · Reading the page · Parsing ingredient lines · Linking to a food graph · Two kinds of error · Recipes from a dish photo · Takeaways.
- [ ] `read`, `parse` and `link` carry crumbs with the exact step names `Read`, `Sort`, `Parse`, `Link`; `parse` lights two.
- [ ] Every number has a `Kit.src` footer; the `dish` numbers carry the `Research` flag; `½ → 12`, the sodium readout, the confidence bars and the JSON field names are marked illustrative.
- [ ] `[click]` count equals `ctx.pause()` count: 1 / 3 / 4 / 4 / 4 / 3 / 3 / 2 / 2.
- [ ] `budgetSec` sums to 390 (plan 390), and notes run about 135 words per minute.
- [ ] No Samsung model is named. No claim that the app writes a recipe from a dish photo. Twomey 2020 appears nowhere.
- [ ] All CSS scoped under `.slide[data-sec="samsung"]`.
- [ ] Every build step screenshotted at 1920×1080; print mode checked; `agent-browser errors` empty.

---

## Review fixes (reviewer pass)

Layout, wording and notes only. No claim, number or source footer changed.

1. `read` — the `PATH B · ONE MODEL` label now appears on click 3 with its own content. In the entrance it sat under the encoder/decoder inset, so that inset read as Path B's contents.
2. `read` — the bracket that opens the `OCR` box now forks into **both** the encoder and the decoder box; it previously stopped short of the encoder.
3. `read` — the two failure lines are right-aligned to x 1800 and reworded to `fails by misreading a character` / `fails by inventing a line`, so each reads as a statement about its lane rather than a label on the box above it.
4. `errors` — the sodium readout shows the change (`190 mg → 4,560 mg`). It previously showed only the wrong value, with nothing to compare it to.
5. `errors` — the `INVENTED` panel's four lines are set at 32 px and respread (y 474 / 528 / 582 / 640), with the callout and its arrow moved to match. The panel was visibly half empty.
6. `dish` — `F1` was an undefined term in the audience's first encounter with it. The label is shortened to `ingredient F1, best system` and a `--text-3` line under the number gives the scale: `100 = a perfect ingredient list.`
7. Notes — `link` and `errors` ran at 121 and 116 wpm. One sentence was added to each (the Recipe1M 16,823 → 1,488 clean-up on `link`, per-field confidence on `errors`). Every slide now runs 130–140 wpm and `budgetSec` still sums to 390.

## Deck-wide QA pass (v1)

- `takeaways`: the marker strip listed four markers (READ · FIND · MIX · SELL). It now lists all
  five, READ · FIND · MIX · SELL · NEXT, matching Find, Mix and the intro agenda.
- `takeaways`: the strip tokens take the same 10/20 px padding and 12 px radius as the Find and Mix
  strips; the active READ pill is no longer a 999 px capsule.
