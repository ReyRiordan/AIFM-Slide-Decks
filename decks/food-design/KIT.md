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
5. **Honesty.** Every number traces to a report line and has a source footer (`Kit.src`). Company-run results get `Kit.src(text, 'Self-reported')`. Mark illustrative values as illustrative. Never invent statistics or quotes. Name the real technique: a live API lookup is a tool call, not retrieval.
6. **At most one equation in the whole talk**, revealed after its visual. Pseudo-diagrams such as `noise → face` are fine.
7. **Images of real things.** This deck (plan, approved): small real logos and real product photos for results are allowed, credited in `Kit.src`. Never generate an imitation of a real product, package or brand UI. No founder or other real-person photos. Generated food is generic and its footer says so (`Kit.src('… illustration', 'Generated')`). Rey's own captures and demo clips are always allowed.

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
Deck.section({ id, order, num, kicker, title, color, sweep?, slides: [ ... ] });
slide = { id, title, heading?, theme?: 'dark'|'light', budgetSec, html: string|(ctx)=>string, build(ctx), notes }
```
- `color` is a palette token name from `css/theme.css` (`'blue'` sets `--sec: var(--blue)` and `--sec-t: var(--blue-t)` on every slide of the section). `sweep` is an optional list of 6 token names for the section-change sweep.
- To add a section, add its `<link>` and `<script>` to `index.html`.
- `heading` makes the engine render the standard header (section tag + `t-h1` title) at a fixed position. Use it on every content slide. Leave it out only for full-bleed openers, statements and the title.
- **Content zone:** y 268 → 990 px, x 120 → 1800 px. The source footer is pinned at the bottom (≈ y 1010–1040). Keep the right-hand side of the content zone from colliding with the footer.
- `build(ctx)`: add tweens to `ctx.tl` and call `ctx.pause()` between clicks. Everything before the first pause is the entrance and plays automatically. Back-navigation seeks instantly. Print and preview show the final state.
- **Hidden elements:** `tl.from()` and `Kit.rise()` animate *to the current value*. On an element hidden with `gsap.set(…, {autoAlpha:0})` they animate 0 → 0. For hidden-by-default elements use `Kit.show()` (a fromTo) or `tl.to(…, {autoAlpha:1})`.
- **Interactive or state-driven visuals:** keep a state object, write one pure `render()` function, and tween the state with `onUpdate: render` (see `example/mechanism`). Back-navigation and print mode are then correct with no extra code.
- Ambient loops: `if (ctx.mode === 'show') gsap.to(...)`, created inside `build`, so they are cleaned up automatically.
- Draggable widgets: use `Kit.dragX` and `Kit.svgPoint` (they handle stage scaling). Register teardown with `ctx.cleanup(fn)`.
- Keyboard: → / Space / PageDown go forward and ← goes back (clicker-compatible). Don't bind keys yourself.

## 6. Kit helpers (`js/components/kit.js`)
`Kit.rise`, `Kit.show`, `Kit.fade`, `Kit.swap(a,b)`, `Kit.count(tl, el, {to, prefix, suffix, decimals, commas})`, `Kit.draw` (SVG strokes draw on),
`Kit.src(text, flag)`, `Kit.esc`, `Kit.color.*` (palette tokens: `teal olive saffron cranberry plum rust`, `chalk`, `bg`…, plus `<name>T` text tints).
`Kit.crumbs(steps, cur)` and `Kit.withCrumbs(def, steps, cur)` draw the "where we are" marker, top right on the section-tag row. `cur` is an index or an array of indices (`[1,2]` lights two steps). Every section has a roadmap slide, and every technique slide after it is wrapped with `Kit.withCrumbs`. The step names must match the roadmap's card titles exactly.

**Deck 2 additions (the hand-drawn look):**
- `Kit.rough.line / rect / ellipse / circle / path / curve / arrow(…, o)` return SVG markup (`<path class="rp">`) drawn by rough.js, so diagrams look hand-drawn in cream chalk. Put them inside an `<svg>` in `html()`. Options: `seed` (keep shapes identical across renders; pass one per shape), `sw` stroke width (default 3), `rough` (default 1.1), `stroke` (default chalk), `fill` + `fillStyle` (`hachure` default, `solid`), `arrow` takes `bend` and `head`. Animate with `Kit.draw(tl, el.querySelectorAll('.rp'))`. Text stays real SVG/HTML text, never rough.
- `Kit.photo(src, {x,y,w,h,rot,cls,framed,alt})` → `<img class="photo">` with a soft drop shadow. Transparent cut-outs are `.webp`; `framed:true` for rectangular photos.
- `Kit.drop(tl, targets, {at, stagger, rot})`: the signature photo motion (falls a little, settles). Safe on hidden elements. If something else also moves the photo (a state-driven render), wrap the img in a div and move the div.
- `Kit.slideIn` and `Kit.panels` (deck 1's slanted glass panels) still exist but are **not part of this deck's look**. Don't use them.
GSAP plugins loaded: DrawSVG, MorphSVG, MotionPath, SplitText, CustomEase, Draggable. rough.js is vendored (`js/vendor/rough.min.js`).
Reference slide for this deck's grammar: `sections/03-giuseppe.js` `map` (state + render, cut-outs that travel, rough diagram, Caveat callouts, captions swapped per click).

## 7. Slide-type patterns
Every section uses the same shape for these slide types:
- **Roadmap** (after the problem slide): one card per step, added one per click, each with the question it answers and the technique's name.
- **Results:** at most two big numbers (`.bignum`, `Kit.count`), each with one plain label saying what it measures. Date the results and say who measured them. Self-reported numbers get the flag.
- **Takeaways:** exactly 2 rows (number · rule · tag · one line), one per click. Each row is a lesson that transfers beyond the product: when to use the technique, or what it is good or bad at. No product facts and no empty half-slide.
- **Summary** (closing section): one row per section marker, in the agenda's colors and order.

## 8. Visual system
- **Canvas:** dark slate stone `--bg #2A2E31` with a faint grain (built into `.slide`). Cards/tiles in `--surface` or `rgba(0,0,0,.16)`. `theme:'light'` (warm paper) only if clearly easier to read; use it sparingly.
- **Palette (autumn, from `design/refs/jula-packaging.jpg`):** section colors teal (Read · Samsung), olive (Find · Shiru), saffron (Mix · Giuseppe), cranberry (Sell · NotCo), plum (Next · Future). **`--rust` is the focus accent**: the one thing to look at. `--chalk` (cream) is the default stroke for every diagram. Every fill has a `-t` text tint ≥ 4.5:1 on `--bg`.
- **Text on slate always uses the `-t` tints** (`c-teal`, `c-rust`… or `Kit.color.tealT`). Raw palette colors are for fills only. Colors that must be told apart need labels or different lightness, never hue alone.
- **Type scale (the only sizes):** `t-hero` 168 · `t-h1` 76 · `t-h2` 52 · `t-body` 36 · `t-label` 28 · `t-caps` 28 · `t-num` 132 · `t-hand` 44 · footer 22. No text under 28 px except the source footer (SVG caps labels may use 24 with letter-spacing).
- **Fonts:** Fraunces (`--display`; headings `t-hero t-h1 t-h2`, big numbers `t-num`). Figtree (`--font`; labels, body, chips, SVG text). Caveat (`--hand`; `.callout` / `t-hand` / `<text class="hand">`) **only for short doodle callouts** (≤ 4 words, rust tint, slight tilt, with a rough arrow). JetBrains Mono (`--mono`) only for JSON, sequences, ingredient lists, code-like data.
- **Look:** realistic, appetizing food photos (generated cut-outs) dropped onto the slate + cream hand-drawn rough.js diagrams that draw themselves on. Think cookbook page with chalk notes. No slanted panels, no glass, no gradients inside diagrams.
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
- The notes carry what the slide leaves out (the extra sentence, the caveat), so the slide stays sparse. They connect each slide to the section's problem and roadmap.
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
