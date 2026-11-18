# Spec: section 00 · Intro · Title and agenda

**Owner files:** `sections/00-intro.js`, `css/sections/intro.css`, `assets/img/intro/`, `specs/intro.md`, plus `sections/99-refs.js` and `css/sections/refs.css` (KIT §4).
**Budget:** **60 s** = 20 + 40
**Section color:** none of its own. The agenda rows carry each section's token: `teal` · `olive` · `saffron` · `cranberry`, and the last row is muted. Focus accent: `rust`.
**Kicker:** none on the title slide; `Agenda` is a plain heading.
**Sources:** no facts and no numbers. Product names only: Samsung Food, Shiru, NotCo Giuseppe, NotCo.

---

## Story spine (approve before building)

The intro is not a section with a technique, so the five-part spine applies only loosely.

1. **Problem (one line, spoken):** food is being designed by software now, and the audience has never seen how.
2. **Why these four:** each one turns food into data one step further from the plate — a recipe card becomes a typed record, a protein becomes a vector, a recipe becomes a point on a map.
3. **How it works:** not here. The agenda names the four products and nothing else.
4. **Results:** none.
5. **Takeaway:** none. The closing section carries it.

**Rules this section follows.** The intro stays short (HANDOFF §3.11). The agenda lists the product sections plus a muted "What's next" row, and it never previews the closing section's angle (KIT §1). No ML vocabulary appears anywhere in it.

---

## Slides

| id | heading | budgetSec | pauses | crumbs step |
|---|---|---|---|---|
| `title` | (none: title slide) | 20 | 0 | — |
| `agenda` | Agenda | 40 | 5 | — |

**Generated images (2).** Photoreal, on the same dark slate `#2A2E31`, warm side light from upper left, no text, no logos, no hands, no people.
- `assets/img/intro/title-dish.jpg` — subject: an autumn dish in a shallow ceramic bowl — roast squash, herbs, seeds — shot three-quarters on dark slate stone, with loose props around it. Composition: the dish sits right of centre; leave the left third empty and unlit for the headline.
- `assets/img/intro/agenda-props.jpg` — subject: three props laid out on dark slate stone with clear space between them: a handwritten recipe card at the left, a still life of beans and peas at the centre, an empty metal mixing bowl at the right. Shot straight down, even spacing, hard enough edges to mask out. The builder cuts three masked crops from this one image (deck 1's `00-intro.js` `agenda` pattern, HANDOFF §7).

If the three props do not cut cleanly, fall back to three separate generations into the same folder: `card.jpg`, `protein.jpg`, `bowl.jpg`. Decide from the screenshot, not in advance.

Cream line doodles are GPT line art traced to SVG with potrace, drawn on with `stroke-dashoffset`. Caveat is used only for doodle callouts.

---

## Per slide

### 1 · `title` — 20 s

**The one idea:** this talk is about AI that reads, finds and mixes food.

**On screen.** No `heading` (full-bleed title, KIT §5).
- `title-dish.jpg` full-bleed, positioned `right 10% / cover`, with a left-to-right slate gradient over it so the left third stays dark enough for text.
- Headline, Fraunces heavy, two lines, x 120, y 300, `font-size` 132, `line-height` 1.0: `Food,` / `Decoded` with the period in rust.
- Subtitle `t-h2` at x 120, y 560, w 900, `--text-2`: `How AI reads, finds and mixes what we eat`.
- Byline `t-label` at x 120, y 720: `Rey Riordan`.
- Four cream doodles around the dish, traced SVG, 2 px: a steam curl above the bowl, a fork to its left, a small circling arrow lower right, and three seed ticks. They draw themselves on. No doodle crosses the headline column.

Body text on screen: 11 words, plus the title and the byline.

**Build.** Entrance only, no pauses.
1. The slate and its texture are there from the first frame.
2. The dish photo drops onto the slate: `y −30 → 0`, `rotate −1.5° → 0`, `scale 1.03 → 1`, shadow deepening, .9 s.
3. The two headline lines rise from a clipped mask, 120 ms apart.
4. Subtitle, then byline.
5. The four doodles draw on, 150 ms apart, last.
Ambient drift is allowed here (image-led slide, KIT §2.4): in `ctx.mode === 'show'` only, drift the photo 10 px over 14 s, yoyo. Nothing loops behind teaching content anywhere else in the deck.

**Spoken only.** Who Rey is, and the one-line frame: four real products, four real techniques, one question each. No hook sentence and no definition slide (deck 1 cut both).

**Source.** None. The dish is generated, so the footer carries `Kit.src('Illustration', 'Generated')`.

---

### 2 · `agenda` — 40 s

**The one idea:** four products, in the order food gets further from the plate, plus one more thing at the end.

**On screen.**
- Heading `Agenda` in the standard header position.
- A props band across the top of the content zone, y 280–520. Three masked cut-outs from `agenda-props.jpg`, each about 420 × 240, dropped with a slight tilt: recipe card at x 200 (tilt −3°), beans and peas at x 760 (tilt +2°), mixing bowl at x 1320 (tilt −2°). Each cut-out sits directly above its row and shares its colour as a thin rule beneath it.
- Five rows below, starting y 560, step 86 (560 / 646 / 732 / 818 / 904). Each row: a colour chip, the number in mono, the marker in Fraunces `t-h2` in that section's text tint, and the product name in `t-body` `--text-2`.

| # | Marker | Product | Colour |
|---|---|---|---|
| 01 | Read | Samsung Food | teal |
| 02 | Find | Shiru | olive |
| 03 | Mix | NotCo Giuseppe | saffron |
| 04 | Sell | NotCo | cranberry |
| — | What's next | (nothing) | muted `--surface` chip, `--text-3` text |

The last row says `What's next` and nothing else. It must not name the closing section's angle.

**Build.** Entrance: the heading, plus five faint row rules at their final positions, so the half-built state never reads as a failed render.
- `[click]` 1: the recipe-card cut-out drops in with its tilt, and row 01 locks in — chip, `01`, `Read` in teal, `Samsung Food`.
- `[click]` 2: the beans-and-peas cut-out drops in, row 02 locks in — `Find` in olive, `Shiru`.
- `[click]` 3: the mixing-bowl cut-out drops in, row 03 locks in — `Mix` in saffron, `NotCo Giuseppe`.
- `[click]` 4: row 04 locks in — `Sell` in cranberry, `NotCo`. No cut-out; the three props stay as they are, and the band's empty right edge is where the eye already is.
- `[click]` 5: the muted `What's next` row fades up in `--text-3`.

Each "lock in" is one motion: the row rule brightens to the section colour and the text slides 20 px in from the left behind it. The drop and the lock run together so a click is one event, not two.

**Spoken only.** What each marker means in one clause: reading a recipe off a page, finding a new protein, mixing a new product, and selling the software that did it. That the order is a progression — a recipe card becomes a record, a protein becomes a vector, a recipe becomes a point on a map — and that the last row is deliberately unnamed.

**Source.** None. No numbers. The cut-outs are generated: footer `Kit.src('Illustration', 'Generated')`.

---

## Cross-section hooks

**Set up for later sections**
1. **The four markers** `Read · Find · Mix · Sell` in this exact order and these exact colours. Every section's `takeaways` marker strip repeats them.
2. **The throughline**, stated once here in the notes and closed in the Future section's `summary`.
3. **The photo-drop motion** (`y −30 → 0`, slight tilt, shadow) is defined here and reused by every photoreal image in the deck. If a `Kit.drop` helper lands in `kit.js` at step 3 of the plan, this section is its first caller.
4. **The muted last row** is the deck's promise not to preview the close.

## Deliberately cut

| Cut | Why |
|---|---|
| A hook slide | Deck 1's hook was deleted; the intro stays short. |
| A "what is AI" definition slide | Deck 1 merged it into the agenda for being redundant. |
| The "Next" marker on the agenda | KIT §1: the agenda never previews the closing section's angle. |
| A fourth cut-out for Sell | Four props would crowd the band, and the Sell section is 2:45. |

## Checklist
- [ ] Headings match the plan's heading map: `title` has none, `agenda` is `Agenda`.
- [ ] Agenda rows match the section markers and colours exactly, in order, and the last row is muted.
- [ ] `[click]` count equals `ctx.pause()` count: 0 / 5.
- [ ] `budgetSec` sums to 60 and the notes run about 135 words per minute (about 45 words on `title`, about 90 on `agenda`).
- [ ] The agenda's five rows and the props band stay inside the content zone, y 268–990.
- [ ] No ML vocabulary, no numbers, no claims anywhere in this section.
- [ ] Ambient drift exists only on `title` and only in `ctx.mode === 'show'`.
- [ ] All CSS scoped under `.slide[data-sec="intro"]`.
- [ ] Every build step screenshotted at 1920×1080; print mode checked; `agent-browser errors` empty.
