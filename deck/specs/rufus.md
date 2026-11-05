# Spec — 02 · Assist · Amazon Rufus / Alexa for Shopping

> **Rewritten for the Nov 2026 fix pass.** This file records what `sections/02-rufus.js` actually
> builds. The pre-build draft (metaphor headings, the old section marker, the icon-led overview,
> the circular ReAct loop, the Auto Buy image slide) is gone. The pass is specified in
> `~/.claude/plans/let-s-do-a-comprehensive-async-shell.md`, which overrides `KIT.md` where they differ.

**Owner files:** `sections/02-rufus.js`, `css/sections/rufus.css`, `assets/img/rufus/`, `specs/rufus.md`
**Section color:** blue (`--sec` `#4D6BB1`; text tints `blueT #94AEE6`, `skyT #8EC0F0`, `tealT #62CDBB`; focus accent `orange #EF5A35` / `orangeT #FF8A66`)
**Marker:** **Assist**. Throughline: Price · Assist · Interact · Negotiate.
**Budget:** 390 s (6:30), 11 slides. The table below sums to **390 s exactly**.
**Core concept:** RAG. **Supporting:** tool calling (ReAct), Auto Buy (the model writes a record, plain code acts), learning from ratings (RLHF) and the reward-hacking trap.
**Source report:** `../Amazon Rufus Alexa Shopping Anatomy of an LLM Sales Agent at Scale.md` (cited below as `R:n`).

| # | id | heading | pauses | sec |
|---|---|---|---|---|
| 1 | `opener` | *(none — image-led)*; hero "Amazon Rufus", sub "Amazon's shopping assistant." | 0 | 12 |
| 2 | `problem` | The problem | 3 | 34 |
| 3 | `overview` | How Rufus works | 3 | 34 |
| 4 | `demo` | Demo | 1 | 26 |
| 5 | `rag` | **Retrieval-augmented generation (RAG)** | 5 | 80 |
| 6 | `react` | Tool calling | 4 | 36 |
| 7 | `dispose` | Auto Buy | 3 | 30 |
| 8 | `thumbs` | Learning from ratings | 3 | 32 |
| 9 | `trap` | Optimizing for approval | 2 | 24 |
| 10 | `results` | Results | 3 | 46 |
| 11 | `takeaways` | Takeaways | 2 | 36 |

**Naming rule:** say and write **Rufus**. Slides that show a company number carry the rename in the
footer ("Amazon renamed Rufus to *Alexa for Shopping* on 13 May 2026." — R:19, R:35). Never present the two as
separate products. Headings are plain topic labels: sentence case, no metaphors, puns or questions.

---

## What each slide shows

### 1 · `opener` (12 s, 0 pauses)
Full-bleed `assets/img/rufus/opener.jpg` with the standard left scrim. Hand-written header tag
`02 · ASSIST` (no section title, because the hero repeats it). Swatch row, then `t-hero` "Amazon /
Rufus." with an orange full stop, and a `t-h2` sub "Amazon's shopping assistant." Ambient scale drift
only in `show` mode.

### 2 · `problem` (34 s, 3 pauses)
A search field typing `cold-weather golf`; empty result placeholders flash and clear; the verdict
"No product is called that."; three category chips fan out (golf base layers · jackets · gloves);
closing line "Search finds a product. It can't say what to buy." Query and categories are Amazon's
own (R: Rufus launch note).

### 3 · `overview` (34 s, 3 pauses)
Three cards, each a **preview of the slide that explains it**, revealed one per click, then card 01
takes the orange border and a "start here" label. One-line titles, and all three bodies start at the
same card-y (190) so the row reads as one grid.
- 01 **Looks it up** — three source chips (reviews teal · listing sky · delivery orange) that match the
  RAG tiles on slide 5.
- 02 **Calls tools** — `getDelivery(item, zip)` then `→ "Thu"`, the same call slide 6 animates.
- 03 **It learns** — thumbs-up and thumbs-down buttons, drawn by the local `thumb()` SVG
  helper (never an emoji font), reused on slide 8. The title names the mechanism (ratings feed
  back into training), not just the input.

Cards are 500 wide at x 120 / 710 / 1300, matching the `thumbs` card row, with a 440 px nowrap
title box so every one-line title keeps >= 10% slack.

### 4 · `demo` (26 s, 1 pause)
Rey's own capture at `assets/capture/rufus-demo.mp4`, with the poster and a "capture missing"
placeholder as fallback. **The frame sizes itself.** `build()` reads `videoWidth`/`videoHeight` on
`loadedmetadata` and fits the clip inside `DV_BOX` (x 120, y 290, max 820 × 690, `object-fit: contain`,
no cropping), then moves the "I asked" / "Watch for" column to `frame right + 56`. Any aspect ratio
works; a re-recording needs no code change. `DV_FALLBACK` (558 × 663) only covers the moment before
the metadata arrives. Clicking the frame pauses and replays; that is not a deck step.

### 5 · `rag` (80 s, 5 pauses) · CORE
State object + one pure `render()`, tweened with `onUpdate` (the LOSS pattern), so back-navigation and
print mode are correct for free. Three numbered steps sit above the three zones and light in order:
**1 Retrieve** over the source tiles, **2 Add to prompt** over the model box, **3 Generate** over the
answer card. Beats: the question arrives → the store ticker moves while the frozen model "can't see
this" → tiles appear, REVIEWS lights, evidence chips fly into the prompt slot → the answer is written
with a "From" line → the question changes to a listing fact → then to a live delivery call. Closing
line: "Rufus runs these three steps on every question. Picking the source is learned."
Tile captions are REVIEWS / LISTING / LIVE API, matching the overview chips.
The notes contain the phrase **"one word at a time"**, which Griffin's distillation slide calls back.

### 6 · `react` (36 s, 4 pauses)
A three-lane sequence diagram — **Shopper · Model · Store software** — with dashed lifelines and one
arrow per click, in time order: the question → `getDelivery(item, zip)` → a "runs it" marker on the
software lane and `"Thursday"` back → `"It arrives Thursday."` Caption: "The model writes the request.
Ordinary software runs it." Source: Amazon's SIGIR 2026 abstract (ReAct-style framework paired with
deterministic backend services, R:136) plus AWS 2025 (R:138). The function name, arguments and result
are illustrative and the footer says so.

### 7 · `dispose` (30 s, 3 pauses)
No image. A six-month price line (`PRICES`, illustrative) against a dashed target at $70.
Beats: axes → the model writes one record (item, target, expires in 6 months) and the target line
draws → plain code watches, the price line draws across six months → the line crosses, the marker
pulses, "bought within 30 minutes". The line **stops at the buy point**: the crossing ends the story. Closing line: "The model writes the record once. Code does the
waiting." Source: AWS 2025, flagged `Self-reported` (R:142: a record in a price-alert service,
requests active six months, purchase within 30 minutes of the target).

### 8 · `thumbs` (32 s, 3 pauses)
Three cards on one internal grid (caps label → two-line title → body band → sub-line), flex columns so
an extra line pushes rather than overlaps: two buttons per answer (the rating buttons sit in the body
band) → a second model that predicts the rating → the writer, trained for high scores with a cap on how
far it moves — then a return arrow, "new answers, new ratings". Card 01's sub-line
("few answers get rated") is held until click 1, where Rey makes that point. The footer says the reward
design is unpublished and that the pipeline shown is the standard RLHF recipe.

### 9 · `trap` (24 s, 2 pauses)
Two columns: reward approval → flattery; reward purchases → overselling. The second column takes the
weight and the line lands: "For the retailer, overselling looks like success." The footer marks this
as the report's analysis, not an Amazon disclosure.

### 10 · `results` (46 s, 3 pauses)
400M+ customers with interactions +570%, then ~$12B incremental sales, then the "60% more likely to
complete a purchase" quote, which is then demoted: a neutral Selection bias badge sitting clear above
the shrunken chip, two dot groups (already
shopping / just browsing), "They were already closer to buying." and "A clean test hides the feature
from a random slice of customers." All figures `Self-reported`.

### 11 · `takeaways` (36 s, 2 pauses)
The canonical section closer: image bleed, three numbered rows, and the throughline strip.
Rows: RAG (fetch instead of retraining) · Tool calling (the model writes the request, plain code runs
it) · Learning from ratings (reward approval and you get flattery). Three elements per row — index,
caps label, headline. **No sub-line**: that detail lives in the notes. The strip is
**PRICE · ASSIST · INTERACT · NEGOTIATE**: PRICE already slabbed red, ASSIST wipes in blue on the last
click, INTERACT turns `--purple-t`, NEGOTIATE stays `--text-3`. Keep this slide pixel-identical to
`airbnb/takeaways` and `griffin/takeaway` apart from text, image and section colour.

---

## Cross-section hooks

**What this section assumes from earlier sections**
1. **From the intro:** the throughline *Price → Assist → Interact → Negotiate*. Slide 1 opens with "Part two" and slide 11 closes with "it can price and it can assist. Next, it gets a face." If the intro's agenda wording changes, update both.
2. **From Airbnb:** that a model is **trained and then frozen**. Slide 5 step 0 leans on this ("trained months ago") and does not re-explain it.
3. **From Airbnb:** that a **loss / grader** is what tells a model it did badly. Slide 8's notes make the contrast explicit: "there, we hand-wrote the grader; here, the grader is learned from people." This line is the single most important inter-section hook in the deck — Airbnb must have landed the custom loss as a *hand-designed* object.
4. **From Airbnb's results slide:** the idea that a reported number has a method behind it. Slide 10 escalates this into selection bias. Airbnb's results are independent (*Marketing Science* 2021); Rufus's are self-reported — the contrast is deliberate and Rey should say it in one clause if Airbnb's slide sets it up.

**What this section sets up for later sections**
1. **For Griffin:** "one model, many calls out to other systems". Slide 6's sequence diagram is the *slow* version of the turn-taking problem Griffin has to solve in under two seconds.
2. **For Griffin/Tavus results:** the `Self-reported` flag and the selection-bias habit established on slide 10 are reused on Griffin's 48 %-thought-it-was-human number and Tavus's AI-SDR numbers. Griffin should not re-teach selection bias — just name it.
3. **For Future:** tool calling and Auto Buy are the direct ancestors of buyer agents. Future's "selling *to* agents" beat should be able to say "you've already seen an agent that books a purchase on your behalf".
4. **For Future:** **ads inside the assistant are deliberately cut here and handed to Future.** Future owns sponsored prompts and the shrinking of discovery from a page of results to a handful. If Future wants a hook, slide 4's demo is where the room last saw a short answer with five products in it.

---

## Deliberately cut

Everything below is in the report and does **not** appear in this section. Listed so the fact-checker doesn't flag omissions and so no one re-adds them.

| Cut | Why |
|---|---|
| Pretraining on a tuned **data mixture** (catalogue/reviews/Q&A/web weights) | A fourth technique; the section already teaches three. One clause survives as "trained on Amazon's own shopping data" on slide 3. Per Rey's direction. |
| Custom model → **routed portfolio** (Bedrock, Nova, Claude Sonnet), model cascade, 6× velocity | Interesting systems story, zero teaching value for a no-ML audience in 6:30. |
| **Query planner** and its 300 ms latency budget | Serving detail. |
| **Serving at scale**: 80,000+ Trainium/Inferentia chips, 3M tokens/min, P99 < 1 s, continuous batching, INT8 quantisation, load balancing, speculative/parallel decoding, multi-node inference | Rey's direction: cut serving and chips entirely. Also all vendor comparisons against unnamed alternatives. |
| **Structured streaming and hydration** | Overlaps the Auto Buy lesson ("keep volatile numbers out of the model's free text"). Available as a spoken aside only. |
| **Ads / sponsored prompts** (free beta → billable CPC, 20 % continue, +48 % conversion, $700M–$1.2B profit projections, 50-results-to-5 compression) | Moved to the Future section per the plan. |
| **JD.com analogue** (purchases as verifiable reward, NDCG@10, GRPO, next-message mining) | A second worked example of RL where one is enough; also not Amazon. |
| **DPO** as an alternative to reward models | One extra acronym for no gain. |
| SIGIR 2025 **fine-tuning** paper, clarifying questions, international serving | Paywalled abstract only; thin. |
| **Buy for Me** on third-party sites, Scheduled Actions, account memory, price history | Auto Buy alone carries the "proposes/disposes" lesson. |
| **Strategic context**: keeping shoppers off Google, robots.txt, the Perplexity lawsuit, Meta Muse, Jassy's "primary shopping agent" line | Business strategy, not ML. Future may use the agent-vs-agent parts. |
| **LLM-as-a-judge** evaluation, turns-per-conversation metrics | Slide 10 already carries the measurement caution. |
| The other adoption figures (350M, 300M, 250M, +115 %, +400 %, +140 %, +210 %, "40 %/50 % more per order") and the four cautions about changing windows and metrics | Slide 10 shows two numbers plus one claim. The window/metric caveats live in the notes if asked. |
| **Community Q&A** as a fourth evidence tile on slide 5 | Three tiles map exactly onto Amazon's own durability/dimensions/delivery example (R:120) and keep the diagram readable. Mentioned in the slide-3 spoken line instead. |

---

## Build and verification notes

1. **Verify per KIT §9** with `--session bts-rufus` (the CLI takes `--session` as a global flag before
   the command; in zsh an unquoted `$S` does **not** word-split, so export `AGENT_BROWSER_SESSION`
   instead). Screenshot every step of all 11 slides into `qa/rufus/`, `Read` each PNG, and fix before
   declaring done. The highest-risk frames are `rag` steps 4 and 5 (lit-state transfer plus text
   swaps) and `dispose` under back-navigation.
2. `rag` and the lit-state logic use a **state object + pure `render()`** tweened with
   `onUpdate: render`, exactly as LOSS does. Do not hand-animate the three question states.
3. KIT §4 gotcha: anything hidden with `gsap.set(..., {autoAlpha:0})` must be revealed with
   `Kit.show()` or `tl.to(..., {autoAlpha:1})`, never `tl.from()` / `Kit.rise()`.
4. Check `index.html?print` for every final state. A print-mode sweep that measures every text node
   for off-stage bounds and sub-28px sizes is the fastest way to catch regressions.
5. **Heading width:** "Retrieval-augmented generation (RAG)" is 1747 px at the default `t-h1`
   118% stretch and would wrap onto the question chip, so `css/sections/rufus.css` sets
   `font-stretch: 103%` for `[data-slide="rag"] .hd h1`. Leave that rule in place.
6. `assets/img/rufus/dispose.jpg` is no longer referenced; `opener.jpg` is used by `opener` and
   `takeaways`.
7. `budgetSec` must sum to **390**. If a slide grows, take the seconds from `overview` or
   `takeaways`, never from `rag`.
8. Notes run at 135 wpm against each slide's `budgetSec`, and the `[click]` markers match the
   `ctx.pause()` count exactly: 0 · 3 · 3 · 1 · 5 · 4 · 3 · 3 · 2 · 3 · 2.
9. The demo clip is owned by the main thread, not this unit. Do not edit `assets/capture/`. The slide
   fits whatever is dropped there.
