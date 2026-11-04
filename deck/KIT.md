# KIT — builder contract for "Built to Sell"

> **Fix pass (Nov 2026) overrides everything below where they conflict.** The decisions, heading map and budgets are in
> `/Users/reyriordan/.claude/plans/let-s-do-a-comprehensive-async-shell.md`. Read it first. In short: markers are **Price · Assist · Interact · Negotiate**;
> every heading is a plain topic label (sentence case, ≤ ~6 words, no metaphors, puns or teaser questions); all on-screen text and notes
> follow `.claude/skills/technical-writing` and `.claude/skills/anti-slop`; headings on TITLE and LOSS change too (their visuals stay).

Read this whole file before planning or building. The approved reference slides are
`sections/00-intro.js` (TITLE) and `sections/01-airbnb.js` (LOSS). Match their quality, structure and restraint.
Screenshots of every build step are in `design/approval/`.

## 1. The talk
- A 27-minute lecture, given by Rey alone, to students with **no ML background**. The main goal is to **teach real ML techniques through real products**.
- Automated selling = software that automates any part of the seller's job.
- Throughline: an AI salesperson, assembled piece by piece: **Price → Assist → Interact**, then **Negotiate**.
  Airbnb (Price) → Rufus (Assist) → Griffin (Interact) → Tavus (the company behind Griffin) → Future (Negotiate: agent selling capability, the negotiation arms race, payment infrastructure such as HTTP 402).
  The intro previews only the first three parts plus a muted "What's next" row; section 4 is introduced at the Tavus bridge.
- The full plan, with every section's beats and time budgets: `/Users/reyriordan/.claude/plans/i-want-to-create-async-hearth.md`. **Follow your section's beats and budget.**
- Source reports are at the repo root (`../*.md`). Use only facts from them. Most of each report gets cut.

## 2. Non-negotiable principles
1. **Clarity beats spectacle.** If a viewer could misread a slide, fix the slide.
2. **One idea per slide.** At most ~12 words of body text on screen. Prefer big numbers, diagrams and labels to sentences. Never use bullet lists of prose.
3. **Animation must earn its place.** Every motion must show a *change*, *relationship*, *sequence* or *cause* the audience needs to follow (e.g., the zone sliding when the outcome flips). Decorative motion is limited to (a) entrances of ≤ .9 s and (b) the engine's section sweep. No looping motion behind teaching content. Ambient drift is allowed only on image-led slides (title, section openers), and must be very slow and subtle.
4. **Honesty.** Every number is traceable to a report line, with a source footer (`Kit.src`). Company-run results get `Kit.src(text, 'Self-reported')`. Mark illustrative values as illustrative. Never invent statistics or quotes.
5. **Exactly one equation in the whole talk.** It's the Airbnb loss, and it already exists. No other formulas. Pseudo-diagrams such as `noise → face` are fine.
6. **Exception (fix pass):** the Tavus section uses Tavus's real logo and a photo of its founders, each credited with `Kit.src`. Otherwise: no real company logos, brand UIs, or images of real people. Describe products in words and diagrams. Rey's own captures and demo clips are the exception.

## 3. Files you own (and the only files you may edit)
| Unit | Files |
|---|---|
| intro | `sections/00-intro.js`, `sections/99-refs.js`, `css/sections/intro.css`, `css/sections/refs.css`, `assets/img/intro/`, `specs/intro.md` |
| airbnb | `sections/01-airbnb.js`, `css/sections/airbnb.css`, `assets/img/airbnb/`, `specs/airbnb.md` |
| rufus | `sections/02-rufus.js`, `css/sections/rufus.css`, `assets/img/rufus/`, `specs/rufus.md` |
| griffin | `sections/03-griffin.js`, `css/sections/griffin.css`, `assets/img/griffin/`, `assets/video/griffin/`, `specs/griffin.md` |
| tavus | `sections/04-tavus.js`, `css/sections/tavus.css`, `assets/img/tavus/`, `specs/tavus.md` |
| future | `sections/05-future.js`, `css/sections/future.css`, `assets/img/future/`, `specs/future.md` |

**Never edit** `js/engine.js`, `js/components/kit.js`, `css/theme.css`, `css/components.css`, `index.html`, `presenter.html` or another unit's files. If you need a helper, define it inside your own section file's IIFE. Scope all CSS under `.slide[data-sec="<id>"]`. **Keep the existing TITLE and LOSS slides unchanged** (the intro and airbnb units add slides around them).

## 4. Slide API (see the header of `js/engine.js`)
```js
Deck.section({ id, order, num, kicker, title, slides: [ ... ] });   // already declared in your file
slide = { id, title, heading?, theme?: 'dark'|'light', budgetSec, html: string|(ctx)=>string, build(ctx), notes }
```
- `heading` makes the engine render the standard header (section tag + `t-h1` title) at a fixed position. Use it on every content slide. Leave it out only for full-bleed openers, statements and the title.
- **Content zone:** y 268 → 990 px, x 120 → 1800 px. The source footer (`Kit.src`) is pinned at the bottom (≈ y 1010–1040).
- `build(ctx)`: add tweens to `ctx.tl`, and call `ctx.pause()` between clicks. Everything before the first pause is the entrance and plays automatically. Back-navigation seeks instantly. Print/preview shows the final state.
- **Gotcha (learned the hard way):** `tl.from()` / `Kit.rise()` animate *to the current value*. Never use them on an element you've hidden with `gsap.set(…, {autoAlpha:0})`, because it would animate 0 → 0. For hidden-by-default elements use `Kit.show()` (a fromTo) or `tl.to(…, {autoAlpha:1})`.
- **Interactive or state-driven visuals:** keep a state object, write one pure `render()` function, and tween the state with `onUpdate: render` (see LOSS). This makes back-navigation and print mode correct for free.
- Ambient loops: `if (ctx.mode === 'show') gsap.to(...)`, created inside `build`, so they're cleaned up automatically.
- Draggable or clickable widgets: use `Kit.dragX` / `Kit.svgPoint` (stage-scale safe). Register any teardown with `ctx.cleanup(fn)`.
- Keyboard: → / Space / PageDown go forward and ← goes back (clicker-compatible). Don't bind keys yourself.

## 5. Kit helpers (`js/components/kit.js`)
`Kit.rise`, `Kit.show`, `Kit.fade`, `Kit.slideIn`, `Kit.swap(a,b)`, `Kit.count(tl, el, {to, prefix, suffix, decimals, commas})`, `Kit.draw` (SVG strokes),
`Kit.panels([{x,y,w,h,color}])` (slanted inspo panels), `Kit.src(text, flag)`, `Kit.esc`, `Kit.color.*` (palette plus text-safe tints).
GSAP plugins loaded: DrawSVG, MorphSVG, MotionPath, SplitText, CustomEase, Draggable.

## 6. Visual system
- Canvas: dark charcoal `--bg #1E1B1C`; cards `--surface #353032`. A slide can use `theme:'light'` (off-white) if that is genuinely clearer. Use it sparingly.
- **Type scale (the only sizes):** `t-hero` 168 · `t-h1` 76 · `t-h2` 52 · `t-body` 36 · `t-label` 28 · `t-caps` 28 · `t-num` 132 (mono) · footer 22. No text under 28 px except the source footer. In SVG, set `font-family="Archivo"` or `"JetBrains Mono"` and sizes ≥ 28.
- Fonts: Archivo (titles: heavy italic, wide; body: normal). JetBrains Mono for prices, numbers, times and code-ish labels.
- Section colors: `var(--sec)` fills / `var(--sec-t)` text. Airbnb red, Rufus blue, Griffin purple, Tavus magenta, Future green, intro orange. Orange `--orange` is the **focus accent**: the one thing to look at.
- **Color for text on dark: always use the `-t` tints** (`c-red`, `c-blue`, … classes or `Kit.color.redT` etc.); raw palette colors are for fills only. Colors that must be told apart need labels or different lightness, never hue alone.
- Signature motif: slanted (-12°) rounded panels, translucent where they overlap. Use them for section openers and framing, not inside diagrams.
- Diagrams are **always code** (SVG/HTML), never generated images.

## 7. Generated images (GPT image bridge, quota is not a concern: regenerate until excellent)
```bash
P="$(cat /Users/reyriordan/Documents/AIFM_Task5/deck/design/style-prefix.txt)"
~/.claude/skills/gpt-image-bridge/bin/gpt-image-2 "<SUBJECT + composition; where to leave negative space>. $P" \
  /Users/reyriordan/Documents/AIFM_Task5/deck/assets/img/<unit>/<name>.png --size 1536x1024
```
- A call takes a few minutes. Run calls in the background (the Bash tool's `run_in_background: true`), several in parallel, and keep working on code meanwhile. Use `--timeout 600` if needed.
- **Always `Read` the PNG and judge it.** Regenerate if it's generic, off-palette, cluttered, or contains text or artifacts. Then convert it to JPEG with Python PIL (quality 90) and reference `assets/img/<unit>/<name>.jpg`.
- Style: translucent glossy 3D glass objects in the palette on charcoal (see the title hero `assets/img/title-hero.jpg`, plus `assets/img/salesperson-assembled.jpg`, which is available to every unit). Images serve as section openers and metaphor moments. They never contain text, logos or real people.
- Use images where they add meaning or atmosphere (a section opener, a metaphor). 1–3 per section is typical.

## 8. Speaker notes
- A natural spoken script in Rey's voice ("Here's the trick…"). Write `[click]` exactly where each `ctx.pause()` happens, so a slide with N pauses has N markers.
- Length: 135 words per minute × `budgetSec`. Each section's `budgetSec` values must sum to its budget in the plan (±5 s).
- Notes can carry what the slide leaves out (the extra sentence or caveat), so the slide can stay sparse.

## 9. Verify your own work (required): look at it, then fix it
Use **your own isolated browser session**. Pass `--session bts-<unit>` on **every** agent-browser command (shell state does not persist between calls):
```bash
S="--session bts-<unit>"; D=/Users/reyriordan/Documents/AIFM_Task5/deck
agent-browser $S set viewport 1920 1080
agent-browser $S open "file://$D/index.html?r=$RANDOM#/<sec>/<slideId>"   # change r= to force a reload
agent-browser $S eval "Deck.finishStep(); Deck.next()"    # advance one click
agent-browser $S eval "Deck.finishStep(); JSON.stringify(Deck.state())"
agent-browser $S screenshot $D/qa/<unit>/<slideId>-s<k>.png
agent-browser $S errors        # must be empty
agent-browser $S close         # when finished
```
Screenshot **every build step of every slide**, `Read` each one, and fix overflow, collisions, illegible text, misaligned or empty-looking layouts, and anything confusing. Repeat until it's right. Also check print mode (`index.html?print`) for your slides' final states. Mid-animation frames can be checked with a short `sleep` after `Deck.next()`.

## 10. Demo placeholders
- **Rufus capture (not captured yet):** build one slide with a 16:9 device-style frame. If `assets/capture/rufus-demo.mp4` exists, it plays muted inline (check with `onerror`); otherwise show a tidy placeholder ("Rufus demo: Rey's capture goes here", plus the planned query, "What do I need for cold-weather golf?"). Budget it inside the Rufus overview beat.
- **Griffin live demo:** the slide has a big "Launch live demo" link (`target="_blank"`) to a URL constant at the top of `03-griffin.js` (`GRIFFIN_DEMO_URL = 'https://www.tavus.io/griffin'`, which Rey will replace). A backup clip of Tavus's public Griffin demo plays when clicked, with credit ("Clip: Tavus, tavus.io/griffin"). Try to download a public clip into `assets/video/griffin/`. If that's impossible, keep a clean placeholder plus the link.
