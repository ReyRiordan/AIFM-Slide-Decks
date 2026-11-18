# Plan: "Food, Decoded", deck 2 (AI in food design)

## Context
This is a new ~27-minute lecture deck for students with no ML background. It is built from `template/` following HANDOFF.md. The sources are at the repo root: 5 research reports (Samsung image-to-recipe, Shiru, Giuseppe, NotCo company, market opportunities) and 3 App PDF slide drafts. The PDFs are secondary. When they conflict with the reports, the reports win. For example, Twomey 2020 is Cookpad research, not Whisk, so it is not cited as Samsung evidence. Aesthetic references: Jula packaging (autumn folk palette, warm serif lettering) and a magazine spread (line doodles plus real food photo cut-outs). This plan covers HANDOFF steps 1–7: set up the deck, write the plan and specs, build the design kit, and build two approval slides. It stops at gate 2.

## Locked decisions (from /grill-me)
| Area | Decision |
|---|---|
| Folder / branch | `decks/food-design/`, branch `deck/food-design` |
| Order | Intro → Samsung Food → Shiru → NotCo Giuseppe → NotCo (company) → Future |
| Budgets | Intro 1:00 · Read 6:30 · Find 6:30 · Mix 6:30 · Sell 2:45 · Next 3:45 = 27:00 |
| Throughline | Food turned into data, more abstract each section: recipe card → typed record, protein → vector, recipe → point on a map |
| Markers | Cook · Find · Mix · Sell · Next (Read until the Nov 2026 redo) |
| Title | **Food, Decoded**. Subtitle: *How AI reads, finds and mixes what we eat* |
| Samsung focus | "Add recipe from photo" scanner (document understanding), not the whole system |
| Samsung demo | Placeholder slide for now; decide later |
| Canvas | Dark slate stone `#2A2E31` (faint texture), raised `#33383C`, cream ink `#F3EBDD`. A light "paper" variant is opt-in per slide only |
| Palette | teal `#2F7A74`/t `#79C7BC` (Read) · olive `#8A9A4B`/t `#BCCB7C` (Find) · saffron `#E2A43B`/t `#F2C46E` (Mix) · cranberry `#A8443A`/t `#E58A7E` (Sell) · plum `#7E4E6B`/t `#C99BB7` (Next) · rust `#D2643A`/t `#F08A5D` = focus accent. Check every text tint at ≥4.5:1 on the bg and adjust if one fails |
| Type | Fraunces (variable, SOFT/WONK axes) for headings and big numbers · Figtree for labels and body · Caveat for doodle callouts only · JetBrains Mono for JSON, sequences and data only. Self-hosted |
| Imagery | Photoreal GPT food on matching slate under warm side light · all diagrams in code-drawn SVG with a hand-drawn wobble (rough.js, vendored) in cream strokes · decorative doodles are GPT line art traced to SVG with potrace |
| Motion | Lines draw themselves on (stroke-dashoffset), and photos "drop" onto the slate with a slight tilt and shadow. Every animation shows a change or a relationship |
| Real assets | Credited real logos (small) and real product photos for results (NotMilk carton, OleoPro, Samsung Food app). No GPT imitations of real products. No founder photos. Generic generated food is labeled "illustration" where it could be mistaken for real |
| Gate-2 slides | Title slide + Giuseppe `map` |

## Section spines (approved)
**Intro (1:00).** The title slide is a photoreal autumn dish on slate, with cream doodles drawing on around it. The agenda follows the deck 1 pattern: three cut-outs (recipe card, protein/bean, mixing bowl) lock in one per click as Read · Find · Mix, then Sell · Next.

**Read · Samsung Food (6:30, teal).**
1 Demo placeholder 0:45 · 2 Problem: a recipe trapped in pixels; the app needs 50+ typed fields 0:45 · 3 Roadmap: Read → Sort → Parse → Link 0:30 · 4 Read: OCR chain vs one model that looks, then writes JSON 1:15 · 5 Parse: "1 pound carrots, young ones if possible" → qty/unit/name/note 0:45 · 6 Link: flour synonyms → one entity → nutrition/shopping/oven 0:45 · 7 Two failure modes: ½→12 tsp vs an invented line; confidence + user review 0:45 · 8 Dish photo → recipe is still research (~49% ingredient F1) 0:30 · 9 Takeaways 0:35
Takeaways: structure is what makes data usable · chains misread and big models invent, so check both.

**Find · Shiru (6:30, olive).**
1 Problem: food relies on a few animal proteins; millions untested; one lab test takes weeks 0:45 · 2 Roadmap: Learn → Embed → Search → Filter 0:30 · 3 Learn: hidden letters ↔ hidden words, no labels (inferred, standard method) 1:15 · 4 Embed: protein → ~1,000 numbers; proteins that behave alike sit close even with different letters 0:45 · 5 Search: start at brazzein → nearest neighbors 0:45 · 6 Filter: works? makeable? safe? funnel 77M → dozens → 1, lab results feed back 1:00 · 7 Result: OleoPro (AI selected; potato protein + oil); 33M → 77M database 0:50 · 8 Takeaways 0:40
Takeaways: pre-train on unlabeled data when labels cost weeks each · embedding search finds what letter-matching misses, but only near what already works.

**Mix · NotCo Giuseppe (6:30, saffron).**
1 Problem: milk = ? a bowl of plants; 830 ingredients → ~4×10²² ten-ingredient sets; each try is a cook-and-taste cycle 0:45 · 2 Roadmap: Map → Decode → Score → Steer 0:30 · 3 Map: squeeze each recipe to a point and rebuild it; neighbors are similar recipes; no holes 1:15 · 4 Score: decode a point → ingredient list; the solver picks amounts; the gap to milk is the score 0:50 · 5 Steer: a trail of tries homes in on milk (Bayesian optimization) 0:50 · 6 Rule: plants only → animal ingredients blanked before decoding 0:40 · 7 Result: NotMilk = pineapple + cabbage (lactones); the first batch came out green; 10 → 2 months (NotCo claim) 0:55 · 8 Takeaways 0:45
Takeaways: learn the space, then search it with a score · put rules inside the search, not after it.
Spoken only: ingredient vectors ("like Shiru's proteins"), the flavor classifier, the recipe-writing GPT.

**Sell · NotCo (2:45, cranberry).**
1 Origin: Chile 2015; Muchnick (CEO) + Pichara (CTO, built Giuseppe, named after Arcimboldo); NotMayo first; $1.5B valuation 2021 0:40 · 2 Pivot timeline: Kraft Heinz JV 2022 → Concept Quant 2025 → 2026 sells AR/UY/BR, closes MX; Chile only 0:50 · 3 Snapshot: 7 of the top 20 food companies (Forbes); Ferrero cocoa swaps across 30k recipes; ~half of revenue from AI (estimate) 0:45 · 4 Bridge: "The AI outlived the milk. Who else needs it?" 0:30

**Next · Future (3:45, plum).**
1 "The great reformulation": 5 forces at once (GLP-1 12.4% of US consumers, dye rules, cocoa swings, tariffs, health plans paying for food) 1:00 · 2 Bet 1: a reformulation engine for mid-sized makers ("formula insurance") 0:45 · 3 Bet 2: "Will they notice?" Synthetic consumers reach ~90% of human reliability on concepts, but taste prediction ranks the favorite first only 33% of the time 0:45 · 4 Don't build: robot chefs (Zume ~$500M, Picnic shut down) 0:30 · 5 Close: card → record, protein → vector, recipe → point; Read · Find · Mix + a question 0:45
Spoken only: medically tailored meals.

## Execution
1. `git checkout -b deck/food-design`; `cp -r template decks/food-design`. Copy the 5 reports into `decks/food-design/sources/` with short kebab names. Move the 3 PDFs into `sources/drafts/` and note that they are secondary. Move the 2 reference JPGs into `design/refs/`. Read `decks/food-design/KIT.md` in full before touching code.
2. Write `plans/01-plan.md` (this plan, with a heading map: one plain sentence-case heading of ≤6 words per slide) and `specs/<id>.md` for intro, samsung, shiru, giuseppe, notco and future from `specs/_section-template.md`. Each spec holds the spine, slide table, per-slide on-screen text, builds and the source line for every number. **Gate 1:** Rey approves the specs.
3. Design kit: download Fraunces, Figtree, Caveat and JetBrains Mono (TTF/woff2) and rough.js into the deck (the only network step). Update `css/theme.css` (palette names, tints, fonts, slate texture) and `Kit.color`'s list in `js/kit.js` if the token names change. Add helpers to `kit.js` for a rough.js stroke and draw-on animation (`Kit.draw`) and a photo drop (`Kit.drop`), and document them in KIT.md. Write `design/style-prefix.txt` for photoreal food on slate and a doodle line-art prefix.
4. Generate images with gpt-image-bridge: the title dish and the Map slide's ingredient/dish cut-outs. Regenerate until good, then convert to JPEG/PNG.
5. Build the title slide (`sections/00-intro.js`) and Giuseppe `map` (`sections/03-giuseppe.js`, `css/sections/giuseppe.css`), with notes at 135 wpm and `[click]` per pause. Remove the example section.
6. Run `python3 tools/capture.py <unit> qa/gate2/` and `Read` every build step. `agent-browser errors` must be empty. **Gate 2:** show Rey and stop.

## Verification
- `index.html` opens from `file://` with Wi-Fi off; fonts, rough.js and images load.
- Every build step is screenshotted at 1920×1080: no overlap, no half-empty slide, the content zone stays within y 268–990, and `?print` shows the final state.
- Contrast: every text tint ≥4.5:1 on `#2A2E31` (checked with a quick script).
- Every number on the two slides traces to a `sources/` report line and has a `Kit.src` footer.
- Do not push. Commit on the branch only.

## Heading map
Section ids and files: `intro` (`00-intro.js`) · `samsung` (`01-samsung.js`) · `shiru` (`02-shiru.js`) · `giuseppe` (`03-giuseppe.js`) · `notco` (`04-notco.js`) · `future` (`05-future.js`). Crumb names match each roadmap's card titles exactly.

| Section | id | Heading | budgetSec | Crumbs |
|---|---|---|---|---|
| Intro | `title` | (none: title slide) | 20 | — |
| Intro | `agenda` | Agenda | 40 | — |
| Cook | `demo` | Recipe from a photo | 30 | — |
| Cook | `problem` | One question, five sources | 35 | — |
| Cook | `system` | How Samsung Food fits together | 45 | — |
| Cook | `inputs` | Turning inputs into data | 40 | Understand, Sense |
| Cook | `retrieve` | Find, don't invent | 40 | Sense |
| Cook | `rank` | Filters and scores | 60 | Rank |
| Cook | `check` | Models propose, rules check | 70 | Check |
| Cook | `act` | From words to oven settings | 30 | Act |
| Cook | `takeaways` | Takeaways | 40 | — |
| Find | `problem` | The protein problem | 45 | — |
| Find | `approach` | How Shiru searches | 30 | — |
| Find | `learn` | Proteins as language | 75 | Learn |
| Find | `embed` | Proteins as vectors | 45 | Embed |
| Find | `search` | Nearest-neighbor search | 45 | Search |
| Find | `filter` | Three filters | 60 | Filter |
| Find | `results` | Results | 50 | — |
| Find | `takeaways` | Takeaways | 40 | — |
| Mix | `problem` | The formulation problem | 45 | — |
| Mix | `approach` | How Giuseppe works | 30 | — |
| Mix | `map` | The recipe map | 75 | Map |
| Mix | `score` | Scoring a candidate | 50 | Decode, Score |
| Mix | `steer` | Steering the search | 50 | Steer |
| Mix | `rules` | Diet rules | 40 | Decode |
| Mix | `results` | Results | 55 | — |
| Mix | `takeaways` | Takeaways | 45 | — |
| Sell | `origin` | Where NotCo came from | 40 | — |
| Sell | `pivot` | From food to software | 50 | — |
| Sell | `today` | NotCo today | 45 | — |
| Sell | `bridge` | (none: statement slide) | 30 | — |
| Next | `question` | (none: statement slide) | 20 | — |
| Next | `personal` | Food for one person | 45 | — |
| Next | `tailor` | A loop aimed at one person | 35 | — |
| Next | `backup` | When an ingredient fails | 45 | — |
| Next | `library` | Backups before the shock | 35 | — |
| Next | `summary` | Summary | 45 | — |

**Redo (Nov 2026):** Samsung's marker is now **Cook** (was Read) and the section is rebuilt as a system of parts; Future is rebuilt around the two directions. See `specs/samsung.md` and `specs/future.md` (v2). Cook roadmap boxes: Understand · Sense · Rank · Check · Act around a central Food graph.
