# Spec: section 01 · Cook · Samsung Food (v2, system redo)

**Owner files:** `sections/01-samsung.js`, `css/sections/samsung.css`, `assets/img/samsung/`, `assets/video/samsung/`, `specs/samsung.md`
**Budget:** **390 s** = 30 + 35 + 45 + 40 + 40 + 60 + 70 + 30 + 40 (+ 10 s opener)
**Section color:** `teal` (`--sec` `#2F7A74`, `--sec-t` `#79C7BC`). Focus accent: `rust` (`--rust` `#D2643A` / `--rust-t` `#F08A5D`).
**Kicker:** `Cook` (was `Read`). Section title: `Samsung Food`.
**Slide order:** `DEMO, PROBLEM, SYSTEM, INPUTS, RETRIEVE, RANK, CHECK, ACT, TAKEAWAYS`
**Sources:** `sources/samsung-system.md` (primary: "The short version", "What Samsung has shipped", "The problem", "The architecture", Deep dives 1–5, "How to measure", "The moat"). `sources/samsung-food.md` for scanner ship facts. `sources/future-markets.md` §3 for the 160,000+ recipe count.
**Replaces:** the v1 scanner-pipeline spec (OCR → layout → parse → link). v1 slides `approach`, `read`, `parse`, `link`, `errors`, `dish` are deleted. The v1 `link` spelling-chips visual is reused inside `inputs`.

House rules (from the Nov 2026 restyle, unchanged): stroke weight is hierarchy (`heavy` on the focal shape, `normal` for arrows, `fine` for secondary); hatched focal boxes; one or two doodles per slide, each marking what is said at that click; **no source text on slides** (caveats go in notes, citations in `99-refs.js`); content zone y 268–1030.

---

## Story spine (approve before building)

1. **Problem.** "What should I cook tonight?" looks like one question, but the answer depends on five sources that normally never talk: taste, recipes, what is in the kitchen, health goals, and what the appliances can do.
2. **Why a system, not one model.** No single model holds all five. Samsung uses different models for different jobs (Gemini for the fridge camera, and its terms allow OpenAI for recipe generation), and they are swappable. What lasts is the system around them: one shared **food graph**, **typed data** passed between parts, and **rules** that check what models produce.
3. **How it fits together, in 5 parts.** **Understand** (recipes and photos → food-graph entities) → **Sense** (fridge and phone camera → the Food List) → **Rank** (filter, score, boost) → **Check** (a model proposes, rules verify) → **Act** (steps → a typed oven command). These five names are the roadmap boxes and the crumb strings.
4. **Results.** Samsung publishes no accuracy figures for any part. The section uses two research numbers, both spoken as research: nutrition estimates from general LLMs were off by 23.5–43.6% (on `check`); the best photo-to-recipe retrieval finds the right recipe among 1,000 candidates 87.5% of the time (on `retrieve`).
5. **Takeaways.** (1) The models are parts; the system is the product. (2) Models propose; rules decide.

**Running example.** The real card-scan demo: a handwritten "Taffy Apple Salad" card becomes a typed recipe. Moments from the clip come back as evidence: ingredient icons and aisle groups, `1 tbsp flour` → `flour 15.6 g` on the shopping list, `Health Score 6.1`, "You may also like", and two hooks: servings came back as `0 persons`, and the recipe contains **peanuts**.

**Roadmap boxes and crumb names (exact):** `Understand` · `Sense` · `Rank` · `Check` · `Act`. Centre node: `Food graph`.

---

## Slides

| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `demo` | Demo | 30 | 1 | — |
| `problem` | The meal-planning problem | 35 | 3 | — |
| `system` | How Samsung Food works | 45 | 4 | — |
| `inputs` | The food graph | 40 | 3 | Understand + Sense |
| `retrieve` | Recipe retrieval | 40 | 2 | Sense |
| `rank` | Filtering and ranking | 60 | 4 | Rank |
| `check` | Checking LLM output | 70 | 4 | Check |
| `act` | Oven commands | 30 | 3 | Act |
| `takeaways` | Takeaways | 40 | 2 | — |
| | | **390** | **26** | |

Crumbs: `Kit.withCrumbs(def, STEPS, i)`; `inputs` lights two (`[0, 1]`).

**Media.**
- `assets/video/samsung/card-scan.mp4`: the card-scan clip (26 s, currently `samsung-food-demo.mp4` in PR #1).
- `assets/video/samsung/dish-retrieve.mp4`: the dish-photo clip (arriving at the repo root in a new PR). Filenames are lower-case; rename when moving.
- Stills cut from the card-scan clip with `ffmpeg` into `assets/img/samsung/`: `still-fields.webp` (typed ingredients), `still-list.webp` (shopping list with `flour 15.6g`), `still-health.webp` (Health Score 6.1 + "You may also like"). Cropped to the phone screen, no status bar.
- Generated (gpt-image-bridge, photoreal on slate): `fridge-shelf.jpg`, an open fridge shelf from a high angle with produce and two plain containers, no branding, no text.
- Keep `assets/img/intro/card.webp` (the section-opener toss and the intro agenda use it).

**Video player.** Reuse PR #1's player (`.sm-demo-video`, click to play/pause/replay, missing-file fallback) as a small local helper `phoneVideo(src, x, y, h)` used by both `demo` and `retrieve`. Presenter clicks (→) must still advance the deck; only a click on the phone toggles the video.

---

## Per slide

### 1 · `demo` · 30 s · "Demo"
**The one idea:** point a phone at a handwritten card, and a working recipe comes back.
**On screen.** Phone-framed video centred (the PR #1 frame). Left caps `INPUT` / `A handwritten card`; right caps `OUTPUT` / `A recipe the app can use`. Body: 8 words.
**Build.** Entrance: labels, the phone frame draws on. Rey clicks the phone to play. `[click]` 1: caption `Photo in, recipe out.` with an underline doodle.
**Spoken only.** Shipped 30 July 2025; three free scans, then Food+. "Watch what happens after the scan: icons, aisles, a health score, recommendations. That's more than reading. The rest of this section is about everything behind that wait."
**Source.** `samsung-food.md` "What Samsung actually ships"; `samsung-system.md` shipped-features table (Add recipe from photo).

### 2 · `problem` · 35 s · "The meal-planning problem"
**The one idea:** "what should I cook?" needs five sources that never talk to each other.
**On screen.** A rust question in Fraunces at the top: `What should I cook tonight?` Five rough cards in a row: `Taste` · `Recipes` · `Food List` · `Health goals` · `Appliances`, each with one `t-label` line: `saves, searches` · `structured recipes` · `what's in the kitchen` · `calories, diet` · `what the oven can do`. Body: about 12 words beyond the card names.
**Build.** Entrance: the question. `[click]` 1: the five cards drop in, scattered and slightly tilted, with gaps between them (disconnected). `[click]` 2: Caveat `none of these talk` with a rust loop round the gaps. `[click]` 3: thin dashed lines start joining the cards toward a centre point, which sets up `system`.
**Spoken only.** A classic recipe app knows the catalog but not the household; a fridge camera knows some inventory but not taste or goals. Samsung's bet is that owning several sources at once beats any one alone. In ML terms this is ranking under hard rules, learned from weak signals.
**Source.** `samsung-system.md` "Five disconnected sources" table.

### 3 · `system` · 45 s · "How Samsung Food works" (roadmap)
**The one idea:** five parts, each with its own kind of model, share one food graph and pass typed data, not free text.
**On screen.** Centre: a hatched teal node `Food graph` with a mono sub-line `ingredient IDs · nutrition · allergens · Food List`. Five boxes around it in a row below or an arc: `Understand`, `Sense`, `Rank`, `Check`, `Act`, each with one `t-label` line naming its model family: `language + vision models` · `image recognition` · `recommender` · `LLM + rules` · `parsing + rules`. Arrows box ↔ graph carry small mono chips of typed data: `id: flour`, `apple × 4`, `top 3`, `✓ nut-free`, `180 °C`. Caption on the last click: `Swap any model. Keep the system.`
**Build.** Entrance: the graph node draws on. `[click]` 1: the five boxes draw on left to right. `[click]` 2: the arrows and typed chips appear (the hand-offs). `[click]` 3: three stills from the card-scan clip fly to their boxes (fields → Understand, `flour 15.6 g` → graph, "You may also like" → Rank), which says "you already saw four of these." `[click]` 4: the caption lands with a rust underline; small `Gemini` and `OpenAI` text labels hang off Sense and Check and get a cross-swap doodle.
**Spoken only.** Samsung publishes product behaviour, not its architecture; this diagram is my reconstruction from what it ships, matched to published research. The design rule is structured hand-offs: a model may write prose for the user, but what flows between parts is an ingredient ID, a quantity with a unit, a temperature in °C. That is what lets one part check another. Gemini runs the 2026 fridge camera; the terms allow OpenAI for recipes. Both could be swapped next year; the graph and the rules would stay.
**Source.** `samsung-system.md` "The architecture" table and "structured hand-offs"; "The provider boundary".

### 4 · `inputs` · 40 s · "The food graph" · crumbs Understand + Sense
**The one idea:** every input, a card or a fridge shelf, ends as the same thing: entries in the food graph.
**On screen.** Left lane: the card still → four spelling chips (`plain flour`, `all-purpose flour`, `AP flour`, `1 tbsp flour`) converging on one entity node `flour` (reused v1 `link` geometry) → `15.6 g` in mono. Right lane: `fridge-shelf.jpg` → detection boxes on two items, labels `apple` and `unknown item` (rust) → `Food List` card. Both lanes arrow into a strip at the bottom: `Food graph`.
**Build.** Entrance: both input images drop in. `[click]` 1: the spelling chips converge on `flour`; Caveat `one name, many spellings`. `[click]` 2: the fridge boxes draw; `unknown item` in rust with a loop doodle. `[click]` 3: both lanes feed the graph strip; `15.6 g` counts in.
**Spoken only.** A multimodal model can now read the card in one call, which is what the demo did. But its "AP flour" is still a string, not an ID, so it still has to be linked to the graph before nutrition or shopping work. Whisk, which Samsung bought in 2019, maps ingredients to over 140,000 store items. The fridge camera recognised 33 fresh foods, then 37 plus 50 user-named packaged items, all on the appliance; in 2026 Samsung rebuilt it on Gemini in the cloud to cover more. Anything it cannot place is listed as "unknown item", and saying "I don't know" is a feature. The Food List is an estimate: door bins, the freezer and food eaten from the bag never pass the camera.
**Source.** Deep dive 1 "The photo path" and "Step 2/3" (140,000+); Deep dive 3 table (33 → 37 + 50, Gemini, "unknown item", blind spots). `15.6 g` is observed in the demo clip.

### 5 · `retrieve` · 40 s · "Recipe retrieval" · crumb Sense
**The one idea:** given a dish photo, Samsung finds real recipes instead of writing a new one, because a photo hides most of the recipe.
**On screen.** Phone-framed dish clip on the left. Right, two short columns. `WRITE A RECIPE` (dim): what the photo hides, four rust chips `salt` · `oil` · `oven temperature` · `step order`. `FIND A RECIPE` (teal): `87.5%` with the label `right recipe, out of 1,000`, and a `--text-3` line `only finds what's already there`.
**Build.** Entrance: the phone frame; Rey plays the clip. `[click]` 1: the `WRITE` column with its four hidden-ingredient chips. `[click]` 2: the `FIND` column with `87.5%` counting up; a rust check doodle beside `FIND`.
**Spoken only.** Samsung's Image-to-Recipe recognises the food, then looks for existing dishes that use it. That's a design choice, not a limitation. Generating a recipe from a dish photo means guessing what the camera cannot see, and errors cascade: a wrong food label upstream gives a confidently wrong recipe downstream. Retrieval only returns recipes that exist and have been cooked. The cost is that it can't produce a dish it has never seen. Research numbers, not Samsung's.
**Clip (arrived, 20 s).** A photo of a bowl of pozole → the app opens an existing **Red Pozole** recipe credited to `lyukum.com` (19 ingredients, Health Score 8.7, "You may also like"). The found recipe lists `½ tsp kosher salt` and `1 tbsp olive oil`, the very things the photo hides: say so in the notes ("the salt is there because a person wrote this recipe, not because the camera saw it"). Optional on-screen tie: on click 1, tick `salt` and `oil` in the WRITE column with a still of those two lines.
**Source.** Deep dive 3 "Where Samsung sits" and "Approach 1" (SIMMER 2026, 87.5% R@1 among 1,000); "Approach 3" (semantic error propagation). **Note:** the plan listed "55% vs 80%" here; it is dropped because the same study scored *retrieved* recipes lower (48.81%), which would contradict the slide's point.

### 6 · `rank` · 60 s · "Filtering and ranking" · crumb Rank · DEEP
**The one idea:** rules are filters, preferences are scores, and the two must stay separate.
**On screen.** A vertical funnel, left. Top: `160,000+ recipes`. Stage 1 `HARD FILTER` (rust, heavy): `nut allergy`. A `Taffy Apple Salad` card is knocked out sideways with a rust cross. Stage 2 `SCORE`: `taste · time`, with a small two-bar inset `save` (long) > `view` (short). Stage 3 `BOOST`: `apples, use by Thursday ↑`. Bottom: three result cards. Right side, one caption on the last click: `A filter can't be outscored.`
**Build.** Entrance: the funnel outline and `160,000+`. `[click]` 1: the hard filter; the salad card slides out and is crossed. `[click]` 2: the score stage and the save > view inset. `[click]` 3: the boost lifts one card. `[click]` 4: top 3 land; the caption with a rust underline.
**Spoken only.** Our demo recipe has peanuts. For a household with a nut allergy it must never appear, however well it matches their taste, so allergies and diets are a filter, not a weight. Taste and cooking time are soft: they go into the score. Context shifts the score: Samsung's meal plans favour ingredients near their use-by date. Where does taste come from? People rarely rate recipes, so the system reads clues: a save says more than a view, but a saved recipe may never be cooked. You are roughly the average of what you've cooked; Shiru, next, makes that idea precise. Samsung publishes the inputs to "Tailored for You", not the model. The household here is illustrative.
**Source.** "The ML framing: constrained contextual ranking" (filters vs score vs boosts; use-by from [10]); "The signal problem: implicit feedback" (Hu, Koren and Volinsky; Cookpad). `160,000+ recipes` from `future-markets.md` §3. The allergy household and the Thursday date are illustrative.

### 7 · `check` · 70 s · "Checking LLM output" · crumb Check · DEEP
**The one idea:** a language model drafts the change; deterministic checks that read the food graph decide whether it ships.
**On screen.** Left: a request chip `Make it nut-free`. A rust-hatched box `LLM draft`: three mono lines `peanuts → sunflower seeds`, `serves: 0`, `≈ 220 kcal`. Right: four gate boxes in a column, each with a result: `Allergens` ✓ `no nuts left` · `Nutrition` ✗ `recomputed: 310 kcal` · `Units` ✓ `scaled in code` · `Servings` ? `ask the user`. A return arrow from the failed gate back to the draft. Bottom line: `The model never has the last word.`
**Build.** Entrance: the request chip. `[click]` 1: the draft box and its three lines type on. `[click]` 2: the allergen and units gates pass (teal checks). `[click]` 3: the nutrition gate fails: `220` struck, `310` in rust; the loop-back arrow draws; Caveat `models guess numbers`. `[click]` 4: the servings gate asks the user (the `0 persons` still from the demo appears beside it); the bottom line lands with an underline.
**Spoken only.** Samsung confirms that "Personalize" uses generative AI to adapt recipes to diets. What sits after the model is my inference, but it's the defensible design. Allergens: US law lists nine major allergens; a miss is a safety incident, so it's a lookup in the graph, not the model's opinion. Nutrition: in a 2025 benchmark, general-purpose models' nutrition estimates were off by 23.5 to 43.6 percent, so you recompute from linked ingredient data. Units: arithmetic is exact in code and unreliable as text prediction. And remember the demo left servings at zero: when a field is missing, the honest move is to ask. A failed check sends the draft back or falls back to the original. Retrieval reduces made-up content, but only checks make a generated recipe true. The calorie figures here are illustrative.
**Source.** Deep dive 4 (Personalize [4][53]; gates table: nine allergens [62][63], nutrition 23.5–43.6% [51], units; "retrieval is not validation"). `0 persons` is observed in the demo. 220 / 310 kcal and the sunflower swap are illustrative.

### 8 · `act` · 30 s · "Oven commands" · crumb Act
**The one idea:** only a typed, range-checked command reaches the oven, never the model's text.
**On screen.** A recipe line in Fraunces: `Bake at 180° for 25 minutes.` Tags under spans: `ACTION` `TEMP` `TIME`. Arrow to a mono JSON card: `device: oven`, `action: bake`, `temp_c: 180`, `min: 25`, `confirm: true`. Arrow to a gate `range check` then a small oven icon.
**Build.** Entrance: the recipe line. `[click]` 1: the three tags. `[click]` 2: the JSON card assembles. `[click]` 3: the range check passes (a ghosted `1,800` bounces off in rust) and the oven lights; the user-confirm chip appears.
**Spoken only.** Samsung confirms recipes can send settings to a SmartThings oven, and its patents describe turning recipe text into device commands. "Bake at 180" is tagged the same way as an ingredient line. The command is checked against the oven's limits and plausibility, 180 not 1,800, and starting a cycle needs the user's confirmation. If the dish has poultry, the plan must still reach 165 °F inside.
**Source.** Deep dive 5 (slots table, JSON, safety boundary, 165 °F [60]); [4] [13] [14].

### 9 · `takeaways` · 40 s · "Takeaways"
**On screen.** Pilot row grammar (`tk-row/tk-n/tk-body/tk-rule/tk-tag/tk-line`), rows at y 344 and 600, marker strip at y 930 with `Cook` on.
| # | Tag | Rule | Line |
|---|---|---|---|
| 01 | Architecture | The models are parts. The system is the product. | Swap the model; keep the graph. |
| 02 | Safety | Models propose. Rules decide. | Allergens, numbers, ovens: checked in code. |
**Build.** Entrance: veiled background and strip. `[click]` 1: row 01. `[click]` 2: row 02, then `Find` tints.
**Spoken only.** Samsung reported over six million users as of July 2024 and charges $6.99 a month for Food+, but it publishes no accuracy figures; adoption is not accuracy. Its advantage is the layer around the models. Hand-off: Samsung helps decide what to cook with what you have. Next, Shiru: finding new ingredients.

---

## Cross-section changes (Read → Cook)
- `sections/00-intro.js`: agenda row 01 kicker `Cook`; notes line rewritten ("First, Cook. Samsung Food helps a household decide what to cook, and connects the choice to the kitchen.").
- Takeaways marker strips: `01-samsung.js`, `02-shiru.js` (line ~626), `03-giuseppe.js` (MARKS), `04-notco.js` if present, change `Read` → `Cook`.
- `sections/05-future.js` summary row 01: `Cook` · `a kitchen` + ` becomes a graph`.
- `sections/99-refs.js`: column title `01 · Cook · Samsung Food`; replace READ_A/READ_B with the citations used above.
- Encoder/decoder are no longer introduced here; Giuseppe's `map` already teaches them from scratch (checked).

## Deliberately cut
| Cut | Why |
|---|---|
| OCR / layout / CRF tagging internals | One multimodal call now does the reading; one spoken sentence on `inputs` |
| Dish-photo generation research (Inverse Cooking, FIRE) as a slide | Samsung doesn't ship it; `retrieve` gives the design reason in one slide |
| Cookpad embeddings, LightFM, cold start | Vectors are Shiru's job; one spoken setup line on `rank` |
| Recipe flow graphs | `act` uses the slot table only |
| Privacy and moat as slides | Spoken on `takeaways` |

## Checklist
- [ ] Headings match the heading map above; crumbs use `Understand · Sense · Rank · Check · Act`.
- [ ] Both clips play from `file://`; presenter → still advances; missing-file fallback works.
- [ ] No source text on slides; illustrative values said to be illustrative in notes.
- [ ] Never claims Samsung generates a recipe from a dish photo; never names a model for a stage Samsung hasn't disclosed except Gemini (fridge) and OpenAI (terms).
- [ ] `[click]` = `ctx.pause()`: 1 / 3 / 4 / 3 / 2 / 4 / 4 / 3 / 2.
- [ ] `budgetSec` sums to 390; notes ≈ 135 wpm (≈ 880 words + opener).
- [ ] CSS scoped under `.slide[data-sec="samsung"]`; old v1 CSS and unused assets removed.
- [ ] Every build step captured at 1920×1080; `agent-browser errors` empty.

## Copy pass (Nov 2026, Rey: "simpler, clearer, straight to the point")
Headings now follow deck 1 and the other sections: plain topic labels or technique names (Demo · The meal-planning problem · How Samsung Food works · The food graph · Recipe retrieval · Filtering and ranking · Checking LLM output · Oven commands · Takeaways). Slogan captions replaced with literal ones: `Swap models. Keep the graph.`, `Filter, then rank.`, `The LLM drafts. Code checks.`; WRITE/FIND → `Generate a recipe` / `Retrieve a recipe`. Takeaways follow the Giuseppe grammar: `Build a system, not one model` (system design) and `Check LLM output with code` (validation). "LLM" is defined in the `check` notes.
