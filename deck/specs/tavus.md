# Spec — 04 · Tavus (the company behind Griffin)

> **Fix pass, Nov 2026.** Headings follow the plan's heading map (Origin / Timeline / Company snapshot;
> the bridge is a statement slide with no heading). The section uses Tavus's real logo and real photos of the
> two founders, the sanctioned exception to KIT §2.6; every asset is credited in its `Kit.src` footer.
> The markers are PRICE · ASSIST · INTERACT · NEGOTIATE.

**Owner file:** `sections/04-tavus.js` · `css/sections/tavus.css` · `assets/img/tavus/`
**Section color:** magenta (`--sec` = `#B656A0`, `--sec-t` = `#E08FCB`). Focus accent stays orange.
**Section registration:**
```js
Deck.section({ id: 'tavus', order: 4, num: '04', kicker: 'Company', title: 'Tavus',
               slides: [ ORIGIN, PIVOT, SNAPSHOT, BRIDGE ] });
```
**Budget:** 165 s = 40 + 45 + 50 + 30. **4 slides, 10 clicks total** (3 / 3 / 2 / 2).

This section follows the Griffin section immediately. Griffin's *technology* is already taught
(diffusion, distillation, turn-taking, the 48 % study). This section is the **story of the company**:
one sales experiment that worked, a pivot, a snapshot, and the hand-off to Future. It teaches no new ML.
It therefore has to be fast, concrete and visually quiet — the audience is 20 minutes in and about
to get the last, speculative section.

Dark theme throughout (no `theme:'light'` slide here).

---

## Slide 1 — `origin`

| field | value |
|---|---|
| `id` | `origin` |
| `title` | `Origin` |
| `heading` | **Origin** |
| `budgetSec` | `40` |

**THE ONE IDEA:** Tavus exists because its founders did personalized selling by hand, it worked,
and the only way to keep doing it was to make a model do it.

### On-screen content (exact words)

| element | exact text |
|---|---|
| big number (left) | `200` |
| under it | `sales videos, recorded by hand in one night` |
| founder photo A | photo + `Hassaan Raza` / `CEO` |
| founder photo B | photo + `Quinn Favret` / `COO` |
| logo | Tavus wordmark, top right |
| payoff number (right) | `+450%` / `more replies` |
| after the merge (left) | `1 recording` / `thousands of variants` |
| chip (bottom right) | `Tavus · Y Combinator S21` |
| source footer | `Founders' account of the origin; the reply figure is theirs. Logo: Tavus. Photos: Y Combinator founder profiles.` with `Kit.src(…, 'Self-reported')` |

Body words on screen ≈ 11 excluding names and labels. No sentences.

### Layout (1920×1080, content zone y 268–990)

- **Left column, x 120 → 1070.**
  - `200` — `t-num` (132 px, JetBrains Mono), magenta tint `--magenta-t`, at **x 120, y 300**.
  - caption `sales videos, recorded by hand in one night` — `t-label`, `--text-2`, at **x 120, y 462**.
  - **tile grid** at **x 120, y 560**: 200 tiles, **20 columns × 10 rows**, each tile
    36 × 22 px, radius 6, `transform: skewX(-12deg)`, gap 12 px → block is 948 × 328 px
    (ends y 888). Tiles are flat fills, no glass: `rgba(182,86,160,.55)`, every 7th tile
    `rgba(182,86,160,.8)` so the block reads as many individual objects, not a texture.
  - **merged tile** (hidden until step 3): one slanted panel 240 × 150 px, radius 16,
    magenta glass, at **x 120, y 600**; to its right at **x 400, y 616**: `t-h2` `1 recording`
    and under it at y 686 `t-label` `--text-2` `thousands of variants`.
- **Right column, x 1140 → 1800 (width 660).**
  - two founder photos side by side at **y 300**, 200 × 200 each, radius 20, 2 px `--line` border,
    at **x 1140** and **x 1380**. The source files are 200 × 200, so they render 1:1 on the
    1920 × 1080 stage. Under each: name `t-label` at y 518, role `t-caps` in `--sec-t` at y 560.
    The founders' background lines live in the speaker notes, not on screen.
  - `+450%` — `t-num` 132 px in **orange** `--orange-t` at **x 1140, y 630**; the word
    `more replies` `t-label` `--text-2` at **x 1140, y 778**.
  - chip (step 3) at **x 1140, y 852**: pill 520 × 72, `--surface`, `t-label`
    `Tavus · Y Combinator S21`, with a magenta 10 px slanted bar at its left edge.
- **Logo**, 200 px wide, at **x 1600, y 90**, `color: var(--text-2)`, fading in with the entrance.

### Build steps (3 clicks)

0. **Entrance (auto):** heading rises; `200` counts 0 → 200 with `Kit.count` (1.4 s) while the
   grid tiles fade in in a `stagger: .006` wave left→right, finishing on the same beat.
   *Why:* the count and the filling grid make "two hundred, by hand" felt rather than read —
   it is the whole hook of the slide.
1. **[click] Founders.** The two photos slide in from the right (fromTo, x 360, stagger .12).
   *Why:* attaches the story to two real people before the numbers take over; entrance only, ≤ .9 s.
2. **[click] The payoff.** `+450%` counts up in orange, `more replies` fades under it.
   *Why:* the count ties the effort (left) to the result (right); orange marks the one number
   that explains why the company exists.
3. **[click] Automate it.** The 200 tiles converge on the grid's top-left corner and collapse into
   the single merged panel (`gsap.to(tiles, {x: dx, y: dy, scale:.2, autoAlpha:0, stagger:{amount:.5, from:'end'}})`
   then `Kit.show` the merged panel + its two labels); the chip fades in bottom-right.
   *Why:* this is the slide's argument in motion — 200 hand-made things become one recording
   plus a model. Nothing else on the slide can say it as fast.

No step is decoration. (Cut from an earlier draft: a "send" animation of tiles flying into an inbox.)

### Images
Two real photographs and one real logo, all sanctioned by the fix pass:
`assets/img/tavus/founder-raza.jpg`, `assets/img/tavus/founder-favret.jpg` (200 × 200, downloaded
from the founder profiles on the Y Combinator company page, `ycombinator.com/companies/tavus`,
4 Nov 2026) and `assets/img/tavus/tavus-logo.svg` (the wordmark the tavus.io header loads; the single
path is inlined in `04-tavus.js` so it can take `currentColor`). Everything else is a code-drawn grid.

### Speaker notes (94 words ≈ 40 s at 135 wpm)

> Tavus is an AI research lab in San Francisco. It started with one sales experiment. The two
> founders ran a product studio, and in one night they recorded two hundred sales videos by
> hand, one per name.
> `[click]` Raza ran engineering projects at Apple and programs at Google. Favret left the
> University of Michigan to start companies. He is a Thiel Fellow.
> `[click]` Replies went up four hundred and fifty percent. That is their own number.
> `[click]` So: record once, and let a model make the other hundred and ninety-nine.
> That is Tavus. Y Combinator, twenty twenty-one.

### Sources
| on screen | report line | self-reported? |
|---|---|---|
| 200 videos in one night; +450 % replies | Tavus report, *History → Origin*: "the founders recorded 200 personalized prospecting videos in one night and say response rates rose 450%. Automating that with AI became Tavus." | **Yes** — founders' claim ("say"). Footer flag required. |
| Hassaan Raza, CEO, CS at UT Austin, PM at Apple and Google | *Founders and leadership* table: "Studied computer science at UT Austin. Engineering project manager at Apple and technical program manager at Google" | No (biographical) |
| Quinn Favret, COO, left Michigan, Thiel Fellow 2023 | *Founders and leadership* table: "left the University of Michigan to build companies… Named a Thiel Fellow in 2023." | No |
| 1 recording → thousands of variants | *Version one*: "let a user record one video and generate thousands of variants" | No (product description) |
| Tavus · Y Combinator S21 | Timeline: "Summer 2021 — Joins Y Combinator's S21 batch" | No |

> Note for the builder: the report flags that sources disagree on the founding year (2020 vs 2021).
> **Do not put a founding year on screen.** "Y Combinator S21" is the safe, sourced fact.

---

## Slide 2 — `pivot`

| field | value |
|---|---|
| `id` | `pivot` |
| `title` | `Timeline` |
| `heading` | **Timeline** |
| `budgetSec` | `45` |

**THE ONE IDEA:** Tavus's whole history is one move repeated — collapse the sales video into
something live, then collapse the live pipeline into one model.

### On-screen content (exact words)

| element | exact text |
|---|---|
| rail node 1 | `2021` / `recorded, then sent` |
| rail node 2 | `2024` / `live, two-way` |
| rail node 3 | `2026` / `one model` |
| model circle 1 | `Phoenix` / `draws the face` |
| model circle 2 | `Raven` / `watches and listens` |
| model circle 3 | `Sparrow` / `decides when to speak` |
| merged circle | `Griffin` |
| merged caption | `the model in section 03` |
| source footer | `Tavus product timeline: Series A and developer API (Mar 2024), Conversational Video Interface (Aug 2024), Griffin research preview (Oct 1, 2026).` |

Body words ≈ 12.

### Layout

- **Timeline rail**, horizontal, at **y 360**, from **x 220 to x 1700**, 3 px `--line` stroke,
  drawn with `Kit.draw`. Three nodes: circles r 16 filled `--sec` at **x 300**, **x 960**, **x 1620**.
  - Year above each node at y 316 — `t-caps` JetBrains Mono, `--sec-t`.
  - Label below each node at y 418 — `t-label`, `--text`, centred on the node.
  - Node 3's year/label start hidden; revealed at step 3.
- **Model row**, SVG, centred under the rail. Three circles **r 96**, stroke 4 px `--sec`,
  fill `rgba(182,86,160,.14)`, centres at **(x 560, y 700)**, **(x 960, y 700)**, **(x 1360, y 700)**.
  - Model name inside each circle, `Archivo` 36 px bold, `--text`, centred at cy − 6.
  - One-word job under each circle at **cy + 140** (y 840), `t-label`, `--text-2`, centred.
- **Merged circle:** same centre as the middle circle **(960, 700)** but **r 132**, fill
  `rgba(182,86,160,.34)`, stroke 5 px `--sec`; label `Griffin` `Archivo` 52 px bold `--text`
  at y 694; caption `the model in section 03` `t-label` `--text-2` centred at **y 944**.
- Everything stays inside y 268–990 (bottom-most text baseline y 896).

### Build steps (3 clicks)

0. **Entrance (auto):** heading rises; the rail draws left → right (`Kit.draw`, .9 s); node 1
   and `2021 / recorded, then sent` fade in.
   *Why:* establishes the axis the rest of the slide moves along. The draw direction is the
   direction of time.
1. **[click] The pivot.** Node 2 pops in and `2024 / live, two-way` rises; the rail segment
   between node 1 and node 2 recolours from `--line` to `--sec` (`.6 s`).
   *Why:* the recolouring segment shows the move as a *change of state*, not a second bullet.
2. **[click] The three models.** The three circles scale in from .6 with a .12 stagger, labels
   under them.
   *Why:* these three names appear **for the first time here** — the Griffin section deliberately
   never says Phoenix, Raven or Sparrow (see that spec's "Deliberately cut"), so this slide owns them.
   One word of job per circle is the whole introduction they get; they exist only as the "before" of
   the next motion.
3. **[click] They become one.** The outer two circles tween to the centre and fade (`x → 960`,
   `scale → .7`, .8 s, `power3.inOut`) while the merged `Griffin` circle scales up from the
   middle one; node 3 + `2026 / one model` appear on the rail at the same beat; caption fades in.
   *Why:* the merge **is** the idea — three specialists becoming one model — and it also re-draws
   the link between the company's product history and the model the audience met five minutes ago.

### Images
**None.** This is an exact diagram, so by KIT §6 it must be code-drawn SVG.

### Speaker notes (≈ 102 words ≈ 45 s)

> Version one was asynchronous. You recorded one video, the model made thousands of copies with
> the right name in each, and they went out through a CRM while you slept.
> `[click]` In twenty twenty-four they threw that away. Series A, a developer API, then live two-way
> video agents. The salesperson stopped mailing you a video and started being on the call.
> They dropped their first customers to do it.
> `[click]` That took three models. Phoenix draws the face, Raven watches and listens, and Sparrow decides
> when to speak.
> `[click]` In October they collapsed all three into one. That one is Griffin, from the last section.

### Sources
| on screen | report line | self-reported? |
|---|---|---|
| 2021 · recorded, then sent | *Version one*: "record one video and generate thousands of variants… then sending them through a CRM" | No |
| 2024 · live, two-way | *The pivot*: "The March 2024 Series A came with a developer platform… Five months later it launched the Conversational Video Interface, live two-way video agents" | No |
| "walked away from early customers" (notes only) | *The pivot*: "A 2026 profile says Tavus deliberately walked away from early customers of the old product" | No (third-party profile) |
| Phoenix draws the face / Raven watches and listens / Sparrow decides when to speak | *The model family* table: Phoenix "Renders the face and body"; Raven "Perception"; Sparrow "Turn-taking: decides when to listen, wait or speak" | No |
| 2026 · one model · Griffin | *The model family*: Griffin "One model that perceives, decides and generates speech and video at once", Griffin-Lite (Oct 2026); timeline "Oct 1, 2026" | No |

---

## Slide 3 — `snapshot`

| field | value |
|---|---|
| `id` | `snapshot` |
| `title` | `Company snapshot` |
| `heading` | **Company snapshot** |
| `budgetSec` | `50` |

**THE ONE IDEA:** Tavus is a well-funded model company whose best sales proof belongs to a
customer, in a field that is filling up fast.

### On-screen content (exact words)

| element | exact text |
|---|---|
| stat 1 | `$64M` / `raised · Sequoia, Scale, CRV` |
| stat 2 | `150K` / `developers and businesses` |
| case card title | `Qualified built an AI sales rep on Tavus` |
| case stat A | `2×` / `more conversations` |
| case stat B | `6×` / `more meetings booked` |
| case card flag | `SELF-REPORTED` (chip, `t-caps`, orange text on `rgba(239,90,53,.16)`) |
| crowd label | `Competitors` |
| crowd chips | `Anam` · `HeyGen` · `Synthesia` · `Soul Machines` · `+ a dozen more` |
| source footer | `Funding: round announcements. Users and customer results: Tavus. Competitors: vendor pages. Logo: Tavus.` with `Kit.src(…, 'Self-reported')`. Keep it to one line: at 22 px it wraps past about 112 characters and then collides with the competitor chips. |

### Layout

- **Stat row, y 300 → 500.** Two blocks on a 2-column grid, x 120 (w 820) and x 1000 (w 800).
  - `$64M` and `150K` — `t-num` 132 px, `--magenta-t`, baseline-aligned at y 300.
  - sub-labels `t-label` `--text-2` at y 452, directly under each number.
  - A 2 px `--line` vertical divider at x 960, y 300 → 470.
- **Case card, x 120, y 540, w 1680, h 250.** `.card` on `--surface`, radius 24.
  - title `t-h2` at x 164, y 580. **Never write "SDR" on screen** — it is undefined jargon for this
    audience. "AI sales rep" is the on-screen wording everywhere in the deck.
  - two stat pairs inside, left-aligned at x 164 (`2×`) and x 560 (`6×`), `t-num` 112 px in
    **orange** `--orange-t`, baseline y 700; their labels `t-label` `--text-2` underneath at y 740.
  - `SELF-REPORTED` chip pinned at the card's top-right (x ≈ 1540, y 572), height 44.
- **Crowd row, y 850 → 950.** Label `Competitors` `t-label` `--text-3` at x 120, y 858.
  Five chips in a row starting x 120, y 900: slanted (`skewX(-12deg)`) pills, height 64,
  padding 0 28 px, gap 18, `--surface` fill with a 2 px `--line` border; text `t-label` `--text-2`
  un-skewed inside. The last chip `+ a dozen more` uses `--text-3`. Row must end before x 1800.

### Build steps (2 clicks)

0. **Entrance (auto):** heading rises; both big numbers count up (`Kit.count`, `$64M` with prefix,
   `150K` with suffix), sub-labels fade in after.
   *Why:* two numbers, counted, read as scale at a glance; no sentence needed.
1. **[click] The customer case.** The card rises in; `2×` and `6×` count up with a .2 s offset;
   the `SELF-REPORTED` chip fades in **last**, after the numbers land.
   *Why:* the deliberate late arrival of the flag is the teaching beat — you see the impressive
   number, then you see who measured it.
2. **[click] The crowd.** The five chips slide in from the right (`Kit.slideIn`, x 420, stagger .07)
   while the two top stats dim to opacity .45.
   *Why:* the chips arriving *into* the slide, crowding the space the stats occupied, is the point:
   the capability is becoming a commodity. The dim keeps one focus at a time.

### Images
**None.** Three code-drawn blocks; an image would fight the numbers for attention.

### Speaker notes (≈ 114 words ≈ 50 s)

> Sixty-four million dollars raised. Sequoia led the seed round, Scale led the Series A, and
> CRV led the Series B. A hundred and fifty thousand developers and businesses use the models.
> That count is Tavus's own, and nobody says how many of them pay.
> `[click]` The clearest sales result here is not Tavus's, it is a customer's. Qualified, a sales
> software company, built an AI sales rep on this and reports twice the conversations and six
> times the meetings booked. Read it like any vendor case study: no control group, and the
> vendor is the one publishing it.
> `[click]` And they have company. Anam is cheaper, HeyGen already has the customers, and the
> list keeps growing.

### Sources
| on screen | report line | self-reported? |
|---|---|---|
| `$64M` raised | *Funding*: "Tavus has disclosed about $64M across three priced rounds, plus Y Combinator's initial check." | No (disclosed rounds) |
| Sequoia, Scale, CRV | *Funding* table: Seed led by Sequoia Capital; Series A led by Scale Venture Partners; Series B led by CRV | No |
| `150K` developers and businesses | *Products and technology*: "Tavus says 150,000 developers and businesses use its models" | **Yes** |
| Qualified AI SDR, 2× conversations, 6× meetings | *Named deployments (all self-reported by Tavus)*: "Qualified … Piper, an AI SDR; reports 2x more conversations and 6x more meetings booked" | **Yes** — chip on card + footer flag |
| "how many of the 150,000 pay" (notes only) | *Open questions*: "What isn't disclosed. Revenue, valuation, headcount, and how many of the 150,000 claimed users pay." | n/a |
| Anam cheaper (notes) | *Competitors* table: "Cheaper entry ($12 a month, $0.16 per extra minute)" | Vendor marketing — notes say "its own benchmark"/"undercuts on price" only; **no latency numbers on screen** |
| HeyGen distribution | *Competitors* table: "Brings a large existing customer base into the category." | No |
| Synthesia, Soul Machines | *Competitors* table rows | No |

> Honesty guard: do **not** put Anam's latency claims (1.24 s vs 1.86 s) on screen or in notes —
> they are a competitor's own benchmark and would contradict the Griffin section's numbers.
> Do not show the $256M valuation (the report marks it low-confidence) or the $70M raised figure.

---

## Slide 4 — `bridge`

| field | value |
|---|---|
| `id` | `bridge` |
| `title` | `Bridge into Negotiate` |
| `heading` | *(none — full-bleed statement slide, like the title)* |
| `budgetSec` | `30` |

**THE ONE IDEA:** The three parts are built, and the next section is about the fourth one:
agents that sell without a human, and agents that buy.

### On-screen content (exact words)

| element | exact text |
|---|---|
| line 1 | `The AI salesperson is built.` |
| line 2 | `Agents that sell. Agents that buy.` |
| chip strip | `PRICE` · `ASSIST` · `INTERACT` · `NEGOTIATE` |
| source footer | `The founders say Tavus is Turkish for peacock.` |

### Layout

- **Full-bleed image** (see below) covering the slide, positioned `right 8% / cover`, plus the
  same left-to-right scrim used on the title slide:
  `linear-gradient(90deg,#1E1B1C 0%,#1E1B1C 36%,rgba(30,27,28,.72) 52%,rgba(30,27,28,0) 70%)`.
- **Line 1** `t-h1` (76 px), `--text`, at **x 120, y 400**, width 900 px (wraps to 2 lines).
- **Line 2** `t-h1` (76 px), `--orange-t`, at **x 120, y 620**, width 900 px (wraps to 2 lines).
- **Chip strip** at **x 120, y 890** — the deck's canonical throughline strip (geometry in
  `specs/airbnb.md` § takeaways; copy it, do not restyle it): `t-caps` 28, letter-spacing .08em,
  `·` separators in `--line`, each marker on a solid `skewX(-12deg)` slab. `PRICE` red,
  `ASSIST` blue, `INTERACT` purple, `NEGOTIATE` green. **`NEGOTIATE` takes `--bg` text, not
  `--text`:** white on `--green` measures about 2.3:1, and charcoal on `--green` about 6.5:1.
  The row ends near x 1020, inside the scrim.

### Build steps (2 clicks)

0. **Entrance (auto):** image fades and scales in (2.0 s, `scale 1.06 → 1`), line 1 rises, the
   footer fades last. Ambient: a very slow 14 s `yoyo` drift on the image, `ctx.mode === 'show'`
   only (allowed by KIT §2.3 on image-led slides).
1. **[click] The next section.** Line 1 dims to `--text-2`; line 2 rises in orange.
   *Why:* the dim-and-rise shows one statement handing off to the next.
2. **[click] The strip.** The three finished markers snap in left to right (.09 stagger,
   `back.out`); after a .3 s beat the separator and `NEGOTIATE` pop in green.
   *Why:* the beat separates what is built from what comes next, which is the slide's whole job.

### Images — **yes, one** (`assets/img/tavus/peacock.jpg`)

Kept from the first build: a stylized peacock in slanted translucent glass, facing left on the
right third of the frame, left half empty charcoal for the text. It carries the meaning of the
company's name, which the footer states, and gives the section's last slide the weight of a
chapter break. The subject prompt is in the git-less history of this file; regenerate only if the
image is replaced.

### Speaker notes (68 words ≈ 30 s)

> One last thing about the name. Tavus is Turkish for peacock, a bird whose whole job is display.
> `[click]` So the AI salesperson is built. It prices, it answers a shopper, and it looks you in
> the eye. What is left is negotiation.
> `[click]` And negotiation needs two sides. Sellers run agents that sell with no human in the
> loop, and buyers run agents that buy. That is the last section.

> **Hand-off rule:** this slide introduces section 04 and nothing more. Do not preview the
> vending-machine benchmark, the arms race or HTTP 402 — those are Future's own slides.

### Sources
| on screen | report line | self-reported? |
|---|---|---|
| Tavus is Turkish for peacock | *History → Origin*: "The name is Turkish for peacock." | No |
| everything else | the talk's own throughline — no data claims | n/a |

---

## Cross-section hooks

**This section assumes (from earlier sections):**
1. **Griffin (03)** has taught the one-model idea, the 0.9 s-human vs cascade latency framing and the
   48 %-of-54 study, and it ends on "it was built by a company worth meeting" in magenta.
   **Griffin does *not* name Phoenix, Raven or Sparrow** — it shows only a generic four-stage cascade,
   and it hands those three names to this section on purpose. Slide 2 therefore *introduces* them,
   with one word of job each, and must not be written as a recap.
2. **Intro (00)** has established the throughline **PRICE → ASSIST → INTERACT → NEGOTIATE**. Slide 4's
   chip strip uses the first three words and colours verbatim (red / blue / purple) and adds
   `NEGOTIATE` in green, its first appearance in the deck. The Future section's summary repeats all
   four; it must use the same four words and the same four colours.
3. The audience has already been taught, in Airbnb and Rufus, to treat a company's own numbers
   with suspicion. Slide 3 leans on that habit instead of re-explaining it.

**This section sets up (for later sections):**
1. **Future (05)** opens on an AI handed $500 and a vending machine. The bridge names the two sides
   of section 04 — agents that sell with no human, and agents that buy — and nothing else, so every
   Future slide still has its own question to answer.
2. `NEGOTIATE` first appears on slide 4's strip, in green with `--bg` text. Future's close (the
   assembled salesperson) repeats the same four markers in the same four colours.
3. "Selling to agents" in Future contrasts with this section's human-facing AI SDR (Qualified),
   so Future can say "and now the buyer isn't a person" without re-establishing the AI SDR.

---

## Deliberately cut

Facts in the report that this section does **not** use, and why:

- **PALs, PAL Maker, Charlie, AI Santa, consumer pricing tiers.** The talk is about selling; the
  consumer companion business is a second story and would cost 30 s.
- **Pricing ($22–$975/mo, $0.26–0.35/min) and unit economics.** Interesting, but it would pull the
  snapshot slide into a business-model discussion the budget can't finish.
- **Phoenix's lineage (NeRF → Gaussian splatting → learned renderer), Hummingbird, Tavec, VideoFDB.**
  Technology — owned by the Griffin section.
- **Research leadership (Maja Pantic, Ioannis Patras), board seats, team size (~30–200), the SoMa
  office, Forbes 30 Under 30, the HubSpot pitch win.** Résumé detail with no teaching value.
- **The $256M secondary-market valuation and the $70M-raised remark.** The report marks the first
  low-confidence and the second unexplained. Not usable under the honesty rule.
- **Customer logo list (Amazon, Deloitte, EY, Mayo Clinic, CVS, Salesforce…)** — the report itself
  says depth is unknown, and KIT §2.6 forbids logos anyway.
- **Final Round AI, Orum, ACTO, Delphi, CareFlick, Colleva deployments.** One case (Qualified) is
  enough; it is the only *sales* one, which is the talk's subject.
- **Anam's head-to-head latency and language numbers.** Competitor marketing; would also muddy the
  Griffin section's latency story.
- **Founding-year ambiguity (2020 vs 2021), the "it wasn't a pivot" framing from Raza, SOC 2 /
  HIPAA, deception-and-regulation risk.** The regulation point is the only one worth a sentence,
  and the Griffin section already carries it; the rest is noise at this budget.

---

## Build checklist for the implementer

- Scope all CSS under `.slide[data-sec="tavus"]` in `css/sections/tavus.css`.
- Slides 1–3 use `heading`; slide 4 has no heading (full-bleed statement).
- Hidden-by-default elements (merged tile, chip, node 3 labels, merged Griffin circle, case card,
  crowd chips, line 2, chip strip) must be revealed with `Kit.show` / `tl.to(…, {autoAlpha:1})`,
  never `Kit.rise` / `tl.from` — see KIT §4's gotcha.
- The 200 tiles should be generated in a loop in the `html` function, not hand-written, and the
  convergence tween in step 3 should target `ctx.qa('.tile')` with a positional stagger.
- Pause count per slide: `origin` 3, `pivot` 3, `snapshot` 2, `bridge` 2 → notes contain exactly
  3 / 3 / 2 / 2 `[click]` markers.
- QA with `--session bts-tavus`, screenshot every step of every slide plus `index.html?print`,
  `Read` each PNG, and check: the 200-tile block does not touch the right column, the founder
  background lines do not wrap, the crowd chip row ends before x 1800, and the bridge text sits
  entirely on the dark side of the scrim.
