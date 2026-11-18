# Spec: section NN · <Marker> · <Product>

Copy this file to `specs/<id>.md` for each section. Fill in the story spine and get Rey's approval before anyone builds a slide.

**Owner files:** `sections/NN-<id>.js`, `css/sections/<id>.css`, `assets/img/<id>/`
**Budget:** <total> s = <per-slide budgets, in order>
**Section color:** <palette token>. Focus accent: orange.
**Kicker:** `<Marker>`. Section title: `<Product>`.
**Sources:** `sources/<report>.md` (list the report sections you use)

## Story spine (approve before building)
One line each. The script follows this order, and every slide ties back to it.
1. **Problem:** what the product must answer, and why that is hard.
2. **Why this technique:** what about the problem makes the technique the right tool.
3. **How it works:** N steps. These are the roadmap cards and the crumb names.
4. **Results:** at most two numbers, with who measured them and when.
5. **Takeaway:** two lessons that transfer beyond this product.

## Slides
| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `problem` | The problem | | | — |
| `approach` | How <product> works | | | — |
| … | | | | |
| `results` | Results | | | — |
| `takeaways` | Takeaways | | 2 | — |

## Per slide
For each slide:
- **The one idea** (one sentence).
- **On screen:** the text and the visual, with ≤ ~12 words of body text.
- **Build:** the entrance, then what each click adds.
- **Spoken only:** what the notes carry that the slide leaves out.
- **Source:** the report line behind each number. Mark illustrative values.

## Checklist
- [ ] Headings match the plan's heading map.
- [ ] Each technique slide carries `Kit.withCrumbs` with the roadmap's step names.
- [ ] Every number has a `Kit.src` footer. Self-reported results are flagged.
- [ ] `[click]` count equals `ctx.pause()` count on every slide.
- [ ] `budgetSec` sums to the section budget (±5 s), and the notes run about 135 words per minute.
- [ ] Every build step screenshotted at 1920×1080: no overlap, no half-empty slide, `agent-browser errors` empty.
- [ ] Print mode shows each slide's final state.
