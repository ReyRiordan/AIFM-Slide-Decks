# Spec — Intro unit (`sections/00-intro.js`)

Budget: **1:00 (60 s)** across 2 slides. Section color: intro orange (`--orange` stays the focus accent).
Owner files: `sections/00-intro.js`, `css/sections/intro.css`, `assets/img/intro/`, `assets/img/salesperson-assembled.jpg`, `specs/intro.md`.

Running order: `title` → `agenda` (the definition opens the agenda slide; there is no separate definition slide).

The markers are **Price · Assist · Interact · Negotiate**. The intro shows only the first three, plus a muted
"What's next" row. Section 4 is introduced later, at the Tavus bridge.

---

## Slide 1 — `title`

- **id:** `title` · **heading:** none (full-bleed opener) · **budgetSec:** 15 · **pauses:** 0
- Hero image `assets/img/title-hero.jpg`, six color swatches, the three-line hero title, the byline.
- Subtitle: `How AI prices, assists and interacts`, with `prices` in `c-red`, `assists` in `c-blue`,
  `interacts` in `c-purple`. Those three tints are the contract the rest of the deck inherits:
  red = Price, blue = Assist, purple = Interact. Green is added later for Negotiate.
- The hero drifts very slowly in `show` mode only.

## Slide 2 — `agenda` (definition, then agenda)

- **id:** `agenda` · **heading:** `Agenda` · **budgetSec:** 45 · **pauses:** 3
- **Entrance:** the definition line `AI that does any part of the seller's job.` (`t-h2`, weight 600, `any part` in
  `--orange`) sits in the left column at x 120, y 470, width 880, beside the grey outline of the salesperson.
- **Click 1:** the line lifts out (`y -24`, fade) and the Price row and part arrive. Clicks 2 and 3 are unchanged.

Rows (geometry is a contract, see below):

| row | chip | number | label | sub-caption |
|---|---|---|---|---|
| 0 | red | `01` | `PRICE` | `Airbnb Smart Pricing` |
| 1 | blue | `02` | `ASSIST` | `Amazon Rufus` |
| 2 | purple | `03` | `INTERACT` | `Tavus Griffin` |
| 3 | none | none | `What's next` (`--text-3`, x 330) | none |

### The assembly

The salesperson is one render cut into three masked layers, stacked in the same frame:

| layer | file | marker | enters from |
|---|---|---|---|
| shoulders, tie, collar, price tag | `assets/img/intro/part-price.png` | Price | below (`y: 220`) |
| speech bubble | `assets/img/intro/part-assist.png` | Assist | the left (`x: -260`) |
| head and neck | `assets/img/intro/part-interact.png` | Interact | above (`y: -240`) |

Each `<img>` is `position:absolute;inset:0;object-fit:contain;object-position:right center`, so the three layers
line up pixel for pixel once all three are in place. Each click slides one layer in, spikes a `drop-shadow` glow
in that section's color, then settles it at `0 0 28px` and **holds** it until the next click, when the arriving
part takes the glow over. The held glow is what ties a row's colored chip to a part of the figure once the motion
stops; the last one (purple, on the head) stays lit in the final state and in print. Row 3, `What's next`, is a
coda: no chip, no number, no sub-line, just the label at x 330. It arrives at the tail of click 3.

Click 1 also lights `.ag-tagglow`, a 300 px red radial pool behind the price tag at (1600, 620), to autoAlpha .5,
then drops it to .16 on click 2. The tag is the only part of the render that says "price", so the pool puts the
eye on it.

The entrance draws the same three PNGs again as `.ag-ghost` layers at opacity .55 under
`filter: grayscale(1) brightness(2.4)` (`css/sections/intro.css`). They have to read as an empty outline on a
projector, so do not lower either value. They give the empty stage the outline of the
finished figure and show what is still missing. Each ghost fades out .3 s into the click that lands its colored
part, so the final state and print mode carry no grey residue.

### Regenerating the art

`assets/img/intro/salesperson-v2.png` is the lossless master, generated with the gpt-image-bridge (KIT §7).
`assets/img/intro/split-parts.py` writes `assets/img/salesperson-assembled.jpg` and the three part PNGs from it:

```bash
python3 -I /Users/reyriordan/Documents/AIFM_Task5/deck/assets/img/intro/split-parts.py
```

The script estimates per-pixel alpha by unmultiplying the known charcoal background (`#1E1B1C`), then splits the
result with two soft cuts: a horizontal cut at y ≈ 513 (the gap between the neck and the collar) and a vertical cut
at x ≈ 1030 (between the bubble and the head). The three masks sum to 1, so stacking the layers reproduces the
original render. To use a different base image, change the two cut coordinates to match its neck and bubble gaps.
`assets/img/intro/salesperson-v1-backup.jpg` is the previous render, kept in case the old framing is wanted back.

---

## Motif definition for reuse

`sections/05-future.js` copies this geometry for its closing Summary slide. **If one moves, both move.**

- `ROW_Y = [368, 518, 668, 818]`
- chip at x **130**, 72 × 38, radius 10, `transform: skewX(-12deg)`
- number (`t-h2 t-mono`) at x **232**, top `ROW_Y[i] - 10`
- label (`t-h2`, italic, weight 850, stretch 115%) at x **330**, top `ROW_Y[i] - 14`
- sub-caption (`t-label`) at x **330**, top `ROW_Y[i] + 48`

## Handoff to future

- The geometry constants above are unchanged. `sections/05-future.js` needs no edit for them.
- `assets/img/salesperson-assembled.jpg` was **regenerated** (same path, same 1536 × 1024 size). The new render has
  a cleaner head-to-shoulder gap and no floating shards, so the agenda can mask it into three parts. The figure sits
  a little larger and further right than the old one. The Summary slide still reads correctly with
  `right 6% / cover` at opacity .42; it crops the top of the speech bubble, which is fine at that opacity.
  If a looser crop is wanted, switch that slide to `object-fit: contain` or use `right center / cover`.
