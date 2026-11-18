# KIT: builder contract for a lecture deck

Every agent that builds or edits slides reads this whole file first. It is the only rulebook. Process, lessons and tools are in `../../HANDOFF.md`.
The deck's plan (sections, beats, budgets, heading map) is in `plans/`, and each section's story spine and slide list are in `specs/<id>.md`.

Reference implementations: `sections/01-example.js` shows one slide per pattern. The archived deck `decks/automated-selling/` has the full-scale versions (see HANDOFF §7).

## 1. The talk format
- A ~27-minute lecture, given by Rey alone, to students with **no ML background**. The goal is to **teach real ML techniques through real products**.
- The deck has an intro, three or four product sections and a closing section. A references appendix follows, and it isn't presented.
- The intro agenda lists the product sections plus a muted "What's next" row. It never previews the closing section's angle.
- Source reports are in `sources/`. Use only facts from them. Most of each report gets cut.

## 2. Non-negotiable principles
1. **Clarity beats spectacle.** If a viewer could misread a slide, fix the slide. Easy to understand matters more than visually stunning.
2. **One idea per slide.** At most ~12 words of body text on screen. Prefer big numbers, diagrams and labels to sentences. Never use bullet lists of prose.
3. **The story comes before the technique.** Each section follows its story spine: problem, why this technique, how it works in N steps, results, takeaway. Never open a technique slide without the reason it is needed. Define every term the first time it appears ("gradient", "boosted").
4. **Animation must earn its place.** Every motion shows a change, a relationship, a sequence or a cause. Reveal reasons and parts one per click. Decorative motion is limited to entrances of ≤ .9 s and the engine's section sweep. No looping motion behind teaching content. Slow ambient drift is allowed only on image-led slides (title, section openers).
5. **Honesty.** Every number traces to a report line in `sources/` and is cited in the References appendix (`99-refs.js`). **No source text on slides** (Rey, Nov 2026): no footer, no `Kit.src`, no "Inferred / Illustrative / Self-reported / Estimate" chips. Caveats are said aloud: the speaker notes carry them ("Samsung hasn't published this, so this is my reconstruction", "these numbers are made up to show the idea", "NotCo's own figure"). Never invent statistics or quotes. Name the real technique: a live API lookup is a tool call, not retrieval.
6. **At most one equation in the whole talk**, revealed after its visual. Pseudo-diagrams such as `noise → face` are fine.
7. **Images of real things.** This deck (plan, approved): small real logos and real product photos for results are allowed, credited in References. Never generate an imitation of a real product, package or brand UI. No founder or other real-person photos. Generated food is generic (References notes that food photos are generated). Rey's own captures and demo clips are always allowed.

## 3. Text rules
- **Headings** are plain topic labels: sentence case, ≤ ~6 words, no metaphors, puns or teaser questions. "The loss function", not "Grading a price nobody sees". The section tag already names the section, so repeated headings such as "Results" and "Takeaways" are fine.
- **Section markers** (the `kicker`) name what the section's product does, and must cover everything in it ("Assist", not "Answer", when the section also covers reminders and buying).
- Body labels and subtitles get the same plain treatment.
- All on-screen text and speaker notes follow `.claude/skills/technical-writing` and `.claude/skills/anti-slop`.
- The heading map in the plan is the source of truth. Builders use it exactly. A reviewer may change a heading only for clarity, and must report the change.

## 4. Files you own
One builder unit per section. A unit owns `sections/NN-<id>.js`, `css/sections/<id>.css`, `assets/img/<id>/` and `specs/<id>.md`. The intro unit also owns `99-refs.js` and `refs.css`.

**Never edit** `js/engine.js`, `js/components/kit.js`, `css/theme.css`, `css/components.css`, `index.html`, `presenter.html` or another unit's files. If you need a helper, define it inside your own section file's IIFE. Scope all CSS under `.slide[data-sec="<id>"]`. A change to a shared file needs Rey's approval.

## 5. Slide API (see the header of `js/engine.js`)
```js
Deck.section({ id, order, num, kicker, title, color, toss?, slides: [ ... ] });
slide = { id, title, heading?, theme?: 'dark'|'light', budgetSec, html: string|(ctx)=>string, build(ctx), notes }
```
- `color` is a palette token name from `css/theme.css` (`'blue'` sets `--sec: var(--blue)` and `--sec-t: var(--blue-t)` on every slide of the section). `toss` is a transparent food cut-out (`assets/img/…webp`) that drops onto the section's opener card. Every forward step uses the chalk-eraser transition (engine-owned; nothing to do per slide).
- To add a section, add its `<link>` and `<script>` to `index.html`.
- `opener: { id: 'opener', budgetSec: 10, notes }` on a section makes the engine add a **section opener slide** first: the title card (section-color scribble over the previous slide, "NN · Title", the kicker chalk-written, the `toss` cut-out dropped in). It holds for the speaker's one- or two-sentence intro; the next click erases it into the section. Its notes live in the section def and the script editor edits them like any slide's.
- `heading` makes the engine render the standard header (section tag + `t-h1` title) at a fixed position. Use it on every content slide. Leave it out only for full-bleed openers, statements and the title.
- **Content zone:** y 268 → 1030 px, x 120 → 1800 px. There is no footer; keep ~40 px clear above the progress bar.
- `build(ctx)`: add tweens to `ctx.tl` and call `ctx.pause()` between clicks. Everything before the first pause is the entrance and plays automatically. Back-navigation seeks instantly. Print and preview show the final state.
- **Hidden elements:** `tl.from()` and `Kit.rise()` animate *to the current value*. On an element hidden with `gsap.set(…, {autoAlpha:0})` they animate 0 → 0. For hidden-by-default elements use `Kit.show()` (a fromTo) or `tl.to(…, {autoAlpha:1})`.
- **Interactive or state-driven visuals:** keep a state object, write one pure `render()` function, and tween the state with `onUpdate: render` (see `example/mechanism`). Back-navigation and print mode are then correct with no extra code.
- Ambient loops: `if (ctx.mode === 'show') gsap.to(...)`, created inside `build`, so they are cleaned up automatically.
- Draggable widgets: use `Kit.dragX` and `Kit.svgPoint` (they handle stage scaling). Register teardown with `ctx.cleanup(fn)`.
- Keyboard: → / Space / PageDown go forward and ← goes back (clicker-compatible). Don't bind keys yourself.

## 6. Kit helpers (`js/components/kit.js`)
`Kit.rise`, `Kit.show`, `Kit.fade`, `Kit.swap(a,b)`, `Kit.count(tl, el, {to, prefix, suffix, decimals, commas})`, `Kit.draw` (SVG strokes draw on),
`Kit.esc` (`Kit.src` is a no-op in this deck: don't call it), `Kit.color.*` (palette tokens: `teal olive saffron cranberry plum rust`, `chalk`, `bg`…, plus `<name>T` text tints).
`Kit.crumbs(steps, cur)` and `Kit.withCrumbs(def, steps, cur)` draw the "where we are" marker, top right on the section-tag row. `cur` is an index or an array of indices (`[1,2]` lights two steps). Every section has a roadmap slide, and every technique slide after it is wrapped with `Kit.withCrumbs`. The step names must match the roadmap's card titles exactly.

**Deck 2 additions (the hand-drawn look):**
- `Kit.rough.line / rect / ellipse / circle / path / curve / linear / arrow(…, o)` return SVG markup (`<path class="rp">`) drawn by rough.js, so diagrams look hand-drawn in chalk. Put them inside an `<svg>` in `html()`. Every shape is drawn as a loose main pass plus a thinner half-transparent **ghost pass** (`.rp-ghost`); `sketch:false` gives one pass. Global looseness lives in `Kit.SKETCH`.
  - **Weight is hierarchy.** `w: 'heavy'` (9 px) for the main flow / the thing the slide is about, `'normal'` (5 px, default) for supporting structure, `'fine'` (2.5 px) for detail and minor ticks. Use at least two weights on every diagram. `sw` (px) still overrides — avoid thin explicit `sw` values; they bring the neat look back. Fine strokes stay chalk or `--text-3`, never `--line` (invisible on slate).
  - `Kit.rough.rect` draws 4 strokes whose ends overshoot the corners (`overshoot` px; `0` = closed box). `hatch:true` (chalk) or `hatch:'var(--sec-t)'` shades the inside with hachure (`fillOpacity`, default .35): use it for cards, the focal box, bars, masks.
  - Other options: `seed` (one per shape, keeps renders identical), `rough` (default 1.1, multiplied by `Kit.SKETCH.rough`), `bow`, `stroke` (default chalk; CSS vars like `'var(--sec-t)'` work), `fill` + `fillStyle`, `arrow` takes `bend` and `head`. Animate with `Kit.draw(tl, el.querySelectorAll('.rp'))`. Text stays real SVG/HTML text, never rough.
- `Kit.doodle.*` margin doodles (same markup, class `rp dd`, default color `var(--sec-t)`): `star(cx,cy,r)`, `sparkle(cx,cy,r)`, `twinkles(cx,cy,r)`, `squiggle(x,y,w,{amp,waves})`, `underline(x,y,w)`, `circle(x,y,w,h,{pad})` (loop around a box), `steam(x,y,h,{n,gap})`, `swoosh(x1,y1,x2,y2)`, `burst(cx,cy,r,{n,len})`, `rays(cx,cy,r,deg)`, `heart(cx,cy,s)`, `loopArrow(x1,y1,x2,y2,{loop,flip})`, `outline(x,y,w,h,{pad})` (sketch frame), `tape(cx,cy,L,{rot,h})`, `mark(cx,cy,s,'x'|'check')`, `dust(x,y,w,h,{n})`, and food doodles `fork sprig carrot pot leaf spoon whisk (cx,cy,s)`, which are **not used on slides** (decorative; see §8). They exist only for a diagram where the object itself is the content. All take `seed`, `color`, `w`, `rot`. `circle` already pads to clear a box's corners. `tape` is for framed photos (on a cut-out, only over opaque pixels).
- `Kit.overlay(markup)` → a full-stage SVG layer; put it last in `html()` for marks that must sit **on top of** photos (an arrow or loop that lands on an image). Draw them on with `Kit.draw` *after* the thing they point at appears.
- `Kit.photo(src, {x,y,w,h,rot,cls,framed,alt})` → `<img class="photo">` with a soft drop shadow. Transparent cut-outs are `.webp`; `framed:true` for rectangular photos.
- `Kit.drop(tl, targets, {at, stagger, rot})`: the signature photo motion (falls a little, settles). Safe on hidden elements. If something else also moves the photo (a state-driven render), wrap the img in a div and move the div.
- `Kit.slideIn` and `Kit.panels` (deck 1's slanted glass panels) still exist but are **not part of this deck's look**. Don't use them.
GSAP plugins loaded: DrawSVG, MorphSVG, MotionPath, SplitText, CustomEase, Draggable. rough.js is vendored (`js/vendor/rough.min.js`).
Reference section for this deck's grammar: `sections/03-giuseppe.js` (the restyle pilot), esp. `map` (state + render, cut-outs that travel, rough diagram, Caveat callouts, captions swapped per click).

## 7. Slide-type patterns
Every section uses the same shape for these slide types:
- **Roadmap** (after the problem slide): one card per step, added one per click, each with the question it answers and the technique's name.
- **Results:** at most two big numbers (`.bignum`, `Kit.count`), each with one plain label saying what it measures. Date the results on the slide if it fits a label ("March 2026"); who measured them and whether it is self-reported goes in the notes.
- **Takeaways:** exactly 2 rows (number · rule · tag · one line), one per click. Each row is a lesson that transfers beyond the product: when to use the technique, or what it is good or bad at. No product facts and no empty half-slide.
- **Summary** (closing section): one row per section marker, in the agenda's colors and order.

## 8. Visual system
- **Canvas:** dark slate stone `--bg #2A2E31` with a faint grain (built into `.slide`). Cards/tiles in `--surface` or `rgba(0,0,0,.16)`. `theme:'light'` (warm paper) only if clearly easier to read; use it sparingly.
- **Palette (autumn, from `design/refs/jula-packaging.jpg`):** section colors teal (Read · Samsung), olive (Find · Shiru), saffron (Mix · Giuseppe), cranberry (Sell · NotCo), plum (Next · Future). **`--rust` is the focus accent**: the one thing to look at. `--chalk` (cream) is the default stroke for every diagram. Every fill has a `-t` text tint ≥ 4.5:1 on `--bg`.
- **Text on slate always uses the `-t` tints** (`c-teal`, `c-rust`… or `Kit.color.tealT`). Raw palette colors are for fills only. Colors that must be told apart need labels or different lightness, never hue alone.
- **Type scale (the only sizes):** `t-hero` 168 · `t-h1` 76 · `t-h2` 52 · `t-body` 36 · `t-label` 28 · `t-caps` 28 · `t-num` 132 · `t-hand` 44. No text under 28 px (SVG caps labels may use 24 with letter-spacing). References slides may use 22.
- **Fonts:** Fraunces (`--display`; headings `t-hero t-h1 t-h2`, big numbers `t-num`). Figtree (`--font`; body, data labels, chips, axis labels). Caveat (`--hand`; `.callout` / `t-hand` / `<text class="hand">`) for **every short annotation**: callouts, arrow labels, asides, margin notes (≤ ~5 words each, slight tilt, section tint or rust, usually with a rough arrow). Headings, body, numbers and data labels never go in Caveat. JetBrains Mono (`--mono`) only for JSON, sequences, ingredient lists, code-like data.
- **Look: fun, doodly chalkboard.** Realistic, appetizing food cut-outs dropped onto the slate + loose, hand-drawn rough.js diagrams with real weight variety that draw themselves on. Think a food magazine page a cook has scribbled all over in chalk (`design/refs/magazine-doodles.jpg`). No slanted panels, no glass, no gradients inside diagrams.
- **Doodles must teach (Rey, Nov 2026).** A doodle marks the thing the speaker is talking about at that moment: a loop around the key number, an underline under the key phrase, a check or x that carries meaning, a swoosh that shows motion, a callout arrow. Color pulls the eye, so a doodle that doesn't help learning is a defect. **No decorative doodles:** no food doodles in margins, no sparkles/twinkles/stars that only decorate a photo, no loops around things that aren't the point. The fun comes from the line quality (weights, wobble, hatching, overshoot), Caveat annotations and meaningful marks. Never behind or across teaching text, never looping.
- **Chalk colors:** the main diagram stays cream chalk. Doodles and annotations use the section tint (`var(--sec-t)`) or rust (`var(--rust-t)`, the focus accent). No other hues on one slide.
- Diagrams are **always code** (SVG or HTML), never generated images. Label real component names. A symbol that doesn't mean something gets cut.
- Fill the slide. A half-empty slide or a label overlapping another element is a defect.

## 9. Generated images
Two prompt suffixes in `design/`: `style-cutout.txt` (one isolated object on a **transparent** background — the default for food props) and `style-prefix.txt` (a full scene on slate, for openers and the title).
```bash
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
$G "<ONE object + angle>. $(cat design/style-cutout.txt)" $PWD/design/raw/<name>.png --size 1024x1024 --timeout 600
python3 tools/cutout.py design/raw/<name>.png assets/img/<unit>/<name>.webp 900     # clamps alpha, trims, resizes
$G "<scene + where to leave empty slate>. $(cat design/style-prefix.txt)" $PWD/design/raw/<name>.png --size 1536x1024
```
- A call takes a few minutes. Run calls in the background, several in parallel, and keep working meanwhile.
- **Always `Read` the PNG and judge it** (composite a cut-out on `#2A2E31` to check its edges). Regenerate if it is generic, unappetizing, off-palette, cluttered, or contains text or artifacts. Quota is not a concern. Scenes → JPEG (PIL, quality 88); cut-outs → WebP via `tools/cutout.py`.
- Food cut-outs are the deck's grammar and don't count against a cap; full scenes stay at 1–3 per section. Images never contain text, logos, brand packaging or real people.

## 10. Speaker notes
- A natural spoken script in Rey's voice. Write `[click]` exactly where each `ctx.pause()` happens, so a slide with N pauses has N markers.
- Length: about 135 words per minute of `budgetSec`. A section's `budgetSec` values sum to its budget in the plan (±5 s).
- The notes carry what the slide leaves out (the extra sentence, the caveat, the "who measured this" and "this is illustrative"), so the slide stays sparse. Since slides carry no source marks, every caveat that used to be a flag must be said in the notes. They connect each slide to the section's problem and roadmap.
- Keep `notes` a plain `'…' + '…'` string literal. The script editor (`tools/script-editor.py`) reads and writes it.
- **Rey owns the script.** If Rey edited a slide's notes, change the slide to match them, not the notes. Never edit notes while Rey has the script editor open.

## 11. Verify your own work: look at it, then fix it
Use your own browser session. Pass `--session <deck>-<unit>` on **every** agent-browser command:
```bash
S="--session <deck>-<unit>"; D="$(pwd)"            # run from the deck folder
agent-browser $S set viewport 1920 1080
agent-browser $S open "file://$D/index.html?r=$RANDOM#/<sec>/<slideId>"   # change r= to force a reload
agent-browser $S eval "Deck.finishStep(); Deck.next()"    # advance one click
agent-browser $S eval "Deck.finishStep(); JSON.stringify(Deck.state())"
agent-browser $S screenshot qa/<unit>/<slideId>-s<k>.png
agent-browser $S errors        # must be empty
agent-browser $S close
```
Or capture a whole unit at once: `python3 tools/capture.py <unit|all> qa/<run>/` saves every build step, the print state and a `manifest.json`.
`Read` every screenshot and fix overflow, collisions, illegible text, half-empty layouts and anything confusing. Repeat until it is right. Also check print mode (`index.html?print`).
