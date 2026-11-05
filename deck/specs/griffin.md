# Spec — 03 · Interact · Tavus Griffin

> **Fix pass (Nov 2026).** Kicker is **Interact**. Headings follow the heading map in
> `~/.claude/plans/let-s-do-a-comprehensive-async-shell.md`, which overrides this spec wherever they differ.
> `cascade` and `overview` now carry Tavus's real model names. Budgets below are the current ones.

**Owner file:** `sections/03-griffin.js` · `css/sections/griffin.css` · `assets/img/griffin/` · `assets/video/griffin/`
**Section color:** purple (`--sec: #9A4198`, `--sec-t: #CC8AD0`). Text on dark always uses `-t` tints / `c-purple`.
**Budget:** 6:30 = **390 s**. Nine slides. Budgets below sum to exactly 390.

| # | id | heading | budgetSec | clicks |
|---|---|---|---|---|
| 1 | `open` | *(no heading — full-bleed opener: "Tavus Griffin")* | 20 | 1 |
| 2 | `demo` | Demo | 70 | 2 |
| 3 | `cascade` | The old pipeline | 50 | 4 |
| 4 | `overview` | Griffin architecture | 40 | 2 |
| 5 | `diffusion` | Diffusion | 55 | 3 |
| 6 | `stream` | The streaming problem | 30 | 2 |
| 7 | `distill` | Distillation | 60 | 4 |
| 8 | `results` | User study | 35 | 3 |
| 9 | `takeaway` | Takeaways | 30 | 2 |
| | | | **390** | |

> **Budget change (fix pass, Nov 2026):** `cascade` 45 → **50** (a fourth click for the CCM band) and
> `overview` 30 → **40** (real component names take longer to say). Paid for by `demo` 90 → **70**
> (the clip is 44 s and the talk around it is short), `results` 40 → **35** and `takeaway` 40 → **30**.
> Sum unchanged at 390.

**Hard accuracy rules for this section**
- Never claim Griffin reacts at human speed. End-to-end median **1,892 ms** vs **~900 ms** for humans (NVIDIA VideoFDB). The **0.43 s** figure is the *video generator alone*, audio-in to pixels-on-screen — always label it that way.
- The 48% study is **Tavus-run**: every slide carrying it gets `Kit.src(…, 'Self-reported')`.
- Griffin's own denoising step count and frame rate are **not disclosed**. Any "50 steps → 4 steps" number on screen must be labelled as the published precedent (CausVid), illustrative.
- The portrait used in the diffusion slides is **generated and fictional**, and is labelled on screen as an illustration. The noise is added by us; Griffin's internals are not being shown.

---

## Slide 1 · `open` — section opener

- **id** `open` · **title** `Tavus Griffin` · no `heading` (full-bleed opener) · **budgetSec 20** · theme dark
- **ONE IDEA:** Everything on a Griffin call — face, room, shadows — is generated live from one photograph.

**On-screen content**
- Section tag, top-left: `03 · INTERACT / TAVUS GRIFFIN` (standard kicker styling, purple)
- Hero, `t-hero`, two lines: **Tavus** / **Griffin.** (period in `var(--purple)`)
- Subline, `t-h2` weight 500, `--text-2`: **A face generated live from one photo.**
- No source footer (no numbers on screen).

**Layout (1920×1080)**
- Background image `assets/img/griffin/opener.jpg`, `right 10% / cover`, with the same left-to-right charcoal gradient scrim as the TITLE slide (`#1E1B1C` 0→34%, `.72` at 50%, transparent at 66%) so text stays legible.
- Swatch row of 3 slanted chips (purple, magenta, sky) at x 132, y 262, 58×30, skewX(-12deg).
- Hero at x 120, y 322 (two lines). Subline at x 120, y 752, width 900.

**Build steps**
- *(entrance, auto)* Image drifts in (scale 1.10 → 1.0, 2.2 s), swatches slide in from the right, "Tavus" and "Griffin." rise line by line. **Why:** this is the section's one atmospheric beat; the motion is the standard opener entrance, nothing new to read.
- **[click 1]** Subline fades up. **Why:** the claim lands *after* the audience has looked at the image, so the sentence reframes what they just saw instead of competing with it.
- Ambient: `if (ctx.mode === 'show')` a 14 s yoyo scale 1.0 → 1.03 on the image only. Permitted (image-led opener), very slow.

**Image — REQUIRED** → `assets/img/griffin/opener.jpg` (generate PNG, convert to JPEG q90)
Subject prompt (style prefix from `design/style-prefix.txt` is appended automatically):
> A human head and shoulders in three-quarter view, constructed entirely from eight thin leaning rounded-rectangle glass slabs in violet and magenta that overlap and blend where they cross; the facial features are only suggested by the edges of the slabs, never drawn; one slab lifts slightly away from the rest, as if the face is being assembled; the figure occupies the right third of the frame; leave the left 55% of the frame as clean empty charcoal negative space.
Size `1536x1024`. **Why it earns its place:** the section is about a face that is *constructed*, and this is the only place in the deck that states the metaphor without words. Regenerate if it reads as a real person, contains text, or fills the left third.

**Speaker notes (20 s ≈ 43 words)**
> Our salesperson can price and it can answer. Part three is interaction: a face on a call. In October, Tavus announced a model called Griffin — so far only a cut-down preview is out. **[click]** Griffin builds a face from one photo and draws it live, during the call, room and shadows included.

**Sources**
- "generated live from one reference image": report ¶122 — "Every pixel of every frame is generated from one reference image, including the movement of the chair, cast shadows and the background." [1] Tavus. Self-reported (a product claim, not a measurement — no number on screen, so no footer needed).
- Announcement date Oct 1 2026: report ¶7. Spoken only, as "in October".

---

## Slide 2 · `demo` — the live demo

- **id** `demo` · **title** `Demo` · **heading** `Demo` · **budgetSec 70** · 2 clicks
- **Built as shipped:** Tavus's launch video plays in-deck (0:28–1:12, ~44 s), a **Watch for** card lists three moments, and click 2 swaps the card for the line **Every frame is drawn live, fast enough that you can interrupt it.**
- **ONE IDEA:** Experience the thing before it is explained — and leave with the question the rest of the section answers.

**On-screen content**
- Device frame containing the backup clip or a placeholder.
- Placeholder text (when no clip file): `Griffin demo` / `Rey launches the live call →` / `Backup clip: assets/video/griffin/griffin-demo.mp4`
- Right column card, `t-caps` header **WATCH FOR**, three chips (`t-body`):
  1. `A thumbs-up on request`
  2. `Someone walks into shot`
  3. `Her breathing slows`
- Launch button (`<a target="_blank">`): **Launch live demo ↗**
- Closing line (click 2), `t-h2`: **Every frame is drawn live, fast enough that you can interrupt it.**
- Right column geometry: the **Watch on YouTube** button is top-aligned with the video frame (y 300, 520x104); the card (and the closing line that replaces it) is bottom-aligned with it (y 549, 520x370). The card is hidden at the entrance and arrives with its chips on click 1, so the entrance never shows an empty card.
- Footer: `Kit.src('Live demo: tavus.io/griffin. Backup clip: Tavus, tavus.io/griffin.')`

**Layout**
- `GRIFFIN_DEMO_URL = 'https://www.tavus.io/griffin'` as a const at the top of the file (Rey replaces it).
- Device frame: x 120, y 300, 1180×664 (16:9), radius 24, 3 px `--line` border, `--bg2` fill, inner 12 px padding.
  - Inside: `<video muted playsinline>` filling the frame, `onerror` → `display:none` and reveal the sibling `.ph` placeholder block (centred, `t-h2` + two `t-label` lines in `--text-3`).
- Right column: x 1360, width 440.
  - "Try to break it" card: y 300, h 330, padding 28. Chips stacked, gap 18, each a `--surface` pill with a purple left bar 6 px.
  - Launch button: x 1360, y 672, 440×104, radius 18, fill `var(--purple)`, label `t-h2` weight 700 in `--text`. Hover: brightness 1.12. Keyboard-focusable.
  - Spare space y 800–960 reserved for the closing line? **No** — closing line goes full width underneath the frame instead (see below), so this stays empty.
- Closing line (click 2): x 120, y 992… **too low.** Correct placement: the line replaces the "Try to break it" card — it fades out and the line appears at x 1360, y 300, width 440, `t-h2`, `--purple-t`, 4 lines. This keeps everything inside the content zone.

**Build steps**
- *(entrance)* Heading + device frame + launch button rise together. **Why:** the frame is the stage; nothing to read yet.
- **[click 1]** The three "try to break it" chips stagger in (0.08 s apart). **Why:** these are instructions the room acts on immediately; staggering them makes Rey's three spoken prompts land one at a time instead of as a wall.
- *(Rey clicks the launch button with the mouse — not a deck step — runs the call, then returns to this tab. If the live demo fails, press `v` is **not** bound; Rey clicks the video frame, which plays the backup clip via a click handler on the frame. Register any handler teardown with `ctx.cleanup`.)*
- **[click 2]** Chips swap out, the question swaps in (`Kit.swap`). **Why:** it closes the demo on exactly one thought and hands it to the next slide; the swap in place shows it is a *replacement*, not an addition.

**Images:** none. The demo itself is the visual.

**Speaker notes (70 s = ~63 spoken words ≈ 28 s, plus the 44 s clip. The word count is deliberately below 135 wpm — the timing reviewer must not "fix" it.)**
> I would rather show you this. It is Tavus's own launch video: their CEO on a video call with a coworker. One of the two faces is generated live. **[click]** Three things to watch: a thumbs-up on request, someone walking into his shot, and her breathing slowing down when he asks.
>
> *[Click the video frame to play. It starts at 0:28 and stops by itself at 1:12, about 44 seconds. Click again to pause. Watch the clock here: this is the single easiest place in the talk to lose a minute.]*
>
> **[click]** She was the generated one. It is their own edit, so it is their best take. The rest of this section is how you draw a frame that fast.

**Sources**
- No numeric claims on screen. The backup clip is credited in the footer per KIT §10.

---

## Slide 3 · `cascade` — the problem

- **id** `cascade` · **title** `The old pipeline` · **heading** `The old pipeline` · **budgetSec 50** · 4 clicks
- **ONE IDEA:** Tavus's CVI pipeline ran five named specialists in a queue after you went silent, so the reply arrived seconds late — and Griffin's CCM replaces the first three.

**On-screen content**
- Lane labels: `YOU`, `THE AVATAR`
- Five stage boxes, the real CVI model name inside each and its job under it (28 px, `--text-3`, stretch 82%):
  `Raven` (perception) · `Sparrow` (turn-taking) · `LLM` (writes the reply) · `TTS` (voices it) · `Phoenix` (draws the face).
  Box x/width: 180/165, 345/165, 510/330, 840/165, 1005/198 — illustrative proportions of the published 2.8–3.5 s total.
- **Click 4:** an orange band wipes in above all five boxes: **One model and two streaming generators replace all five**, bracketed down onto the whole cascade. The band does not name the CCM; the overview slide introduces that acronym with its expansion. The band sits outside `.cs-time`, so it stays at full strength while the timeline is dimmed.
- Measurement label: **Cascaded avatars like this: 2.8 – 3.5 s** (the range is for Gemini-2.5 cascades on VideoFDB, not for Tavus's own stack)
- Human pin: **a person answers at ≈ 0.9 s**
- Bracket label between them: **dead air**
- Two chips (click 3): `Only ~40% of pauses mean “your turn”` · `It could not gesture or move its body`
- Footer: `Kit.src('Stage names: Tavus CVI docs. 40% of pauses: Tavus Sparrow-2. Latencies: NVIDIA VideoFDB (Gemini-2.5 cascades, not Tavus).', 'Self-reported')`

**Layout — SVG at left 120, top 296, 1680×500 (viewBox `0 0 1680 500`)**
- Time map: `X(t) = 180 + t * 330`, t in seconds, 0 → 4.0 s (x 180 → 1500).
- Axis line y = 400, x 60 → 1560, stroke `#6E6560` 3 px. Ticks + labels at t = 0,1,2,3,4 → `0s 1s 2s 3s 4s`, JetBrains Mono 28, `--text-3`; the `0s` tick is `--text`.
- **YOU lane**, y 60, h 70: grey rounded block from x 60 to X(0)=180, label `you talk` (Archivo 28, `--text-2`), then a vertical dashed line at X(0) from y 50 to y 400 in `--text-3`, label above: `you stop` (28, `--text`).
- **AVATAR lane**, y 170, h 84: four boxes, radius 12, each labelled inside (Archivo 30 weight 700, `--text`) with the `t-caps` technical name at y+112 under the box:
  | box | t-start | t-end | x-start | width | fill |
  |---|---|---|---|---|---|
  | Raven | 0.00 | 0.50 | 180 | 165 | `#3C4C96` |
  | Sparrow | 0.50 | 1.00 | 345 | 165 | `#4053A1` |
  | LLM | 1.00 | 2.00 | 510 | 330 | `#4D6BB1` |
  | TTS | 2.00 | 2.50 | 840 | 165 | `#518CC8` |
  | Phoenix | 2.50 | 3.10 | 1005 | 198 | `#9A4198` |
  (Boxes abut with a 4 px gap; the lightness steps upward so they read as a queue, and labels carry the meaning — never hue alone.)
- Measurement label: at x 1215, y 212, Archivo 32 weight 700, `--purple-t`, anchored start: `Cascaded avatars like this: 2.8 – 3.5 s`. A bracket under the boxes from X(0) to X(3.1) at y 276.
- **Human pin**: at X(0.9) = 477, a 4 px `--orange` vertical line from y 400 up to y 320, with a 14 px orange dot at the top and label at x 495, y 312, Archivo 30 weight 700, `--orange-t`: `a person answers here`.
- **Dead-air bracket**: from X(0.9) to X(3.1) at y 436 (below the axis), thin `--text-3` bracket, centred label at y 476, Archivo 30 weight 700, `--text-2`: `dead air`.
- **Chips** (HTML, not SVG): two cards at y 846, h 100, radius 16, `--surface`; left x 120 w 816, right x 984 w 816. Each: a 6 px purple left bar + `t-body` text, vertically centred.

**Build steps**
- *(entrance)* Axis, ticks, YOU block and the "you stop" dashed line appear. **Why:** sets the clock at zero so every later duration is read against the same origin.
- **[click 1]** The four stage boxes wipe in left to right, each starting only when the previous one finishes (`scaleX` from 0, transform-origin left, 0.35 s each, chained), then the `2.8 – 3.5 s` label fades in. **Why:** the sequential wipe *is* the lesson — you literally watch each stage wait for the one before it. A simultaneous fade-in would destroy the point.
- **[click 2]** The orange human pin drops in at 0.9 s and the "dead air" bracket draws outward from it to 3.1 s. **Why:** the comparison only means something as a gap, so the bracket is drawn as a measured distance rather than stated as a number.
- **[click 3]** Timeline dims to 0.3 opacity; the two chips rise. **Why:** dimming signals "these are two *further* problems, not part of the timeline"; without the dim the eye keeps scanning the chart.

**Images:** none — this is a measured diagram, so it must be code (KIT §6).

**Speaker notes (50 s ≈ 115 words)**
> Before Griffin, Tavus ran a pipeline of five specialists. You stop talking. **[click]** Raven reads your face. Sparrow decides you have finished. A language model writes the reply, text-to-speech voices it, and Phoenix draws a face to match. Each stage waits for the one before it, and the chain measures about three seconds. **[click]** A person answers in under a second. The rest is dead air, and you feel it. **[click]** Two more problems. It starts talking when you go quiet, but only four pauses in ten hand over the turn. And the renderer worked from a face model, so it could not gesture or move its body. **[click]** Griffin replaces the first three stages with one model, the CCM. That is the next slide.

**Sources**
- 2.8–3.5 s vs ≈0.9 s: report ¶32 — "cascaded avatar systems built from Gemini 2.5 plus a separate face renderer took 2.8 to 3.5 seconds to react, against about 0.9 seconds for humans." NVIDIA VideoFDB numbers republished by Tavus → footer flag `Self-reported (Tavus analysis)`.
- Four-stage cascade (ASR → LLM → TTS → avatar): report ¶30.
- ~40% of pauses: report ¶24 — "across more than one million silences … the chance that a pause marked a real hand-off of the floor plateaued at about 40%." Tavus, Sparrow-2. Self-reported.
- Frozen body: report ¶40 — "Earlier Tavus renderers relied heavily on 3D face priors … put hand gestures, large body movements and changing backgrounds out of reach." Tavus.
- Box durations (0.5 / 1.1 / 0.6 / 0.9 s) are **illustrative proportions** summing into the published 2.8–3.5 s range; per-stage times are not published. No per-stage number appears on screen, so nothing illustrative is asserted.

---

## Slide 4 · `overview` — the architecture in one picture

- **id** `overview` · **title** `Griffin architecture` · **heading** `Griffin architecture` · **budgetSec 40** · 2 clicks
- **ONE IDEA:** One model keeps deciding several times a second while two streaming generators turn its decisions into voice and pixels — and it never stops watching.

**On-screen content**
- Left node: **you** (labels `camera` / `mic`)
- Centre node (x 430, y 130, 460×240): **CCM** (52 px) / `Continuous Conversational Model` / `perceives and decides` / `re-decides several times a second`
- Right nodes (x 1000, 300×120 each): **Speech generator** / `Tavec audio codec`, and **Video generator** / `streaming diffusion`
- Reference-photo node (x 1080, y 420) feeding **Video generator**, labelled `one photo`
- Output: a frame labelled `every pixel generated`
- Loop-back arrow label (click 2): **it keeps watching you while it talks**
- Footer: `Kit.src('Architecture after Tavus\'s own figure: a conversational model deciding at sub-second intervals, plus streaming speech and video generators.', 'Self-reported')`

**Layout — SVG at left 120, top 300, 1680×600 (viewBox `0 0 1680 600`)**
- **you** node: rounded rect x 0, y 180, 220×180, `--surface`, label `you` Archivo 34 weight 700 centred at y 250; two small sub-labels `camera` / `mic` at y 300 / 340 (28, `--text-3`).
- Two parallel arrows x 230 → 420 at y 240 and y 300, `--text-2`, 6 px, arrowheads right.
- **CCM** node: rounded rect x 430, y 130, 460×240, fill `#9A4198` at 0.22 opacity, 3 px `--purple-t` stroke. Label `CCM` Archivo 52 weight 800 `--purple-t` centred y 192; then `Continuous Conversational Model` (28, `--text-2`, stretch 88%) at y 238, `perceives and decides` (28, `--text`) at y 292, and `re-decides several times a second` (28, `--text-3`, stretch 88%) at y 332.
- Two arrows from x 860 at y 215 and y 325, curving to x 1040.
- **voice** node: x 1050, y 150, 260×110, `--surface`, label `voice` 34 centred.
- **picture** node: x 1050, y 290, 260×110, `--surface`, label `picture` 34 centred.
- **one photo** node: 150×190 thumbnail of `assets/img/griffin/portrait.jpg` at x 1050, y 430, radius 12, with caption under at y 650… *out of the viewBox* → place the photo at x 860, y 440, 150×190 with a short arrow up-right into `picture`; caption `one photo` at x 935, y 660 → **use viewBox height 700** (SVG 1680×700, top 300, bottom 1000 — the last 10 px sit under the content zone, so set top 288 instead). Final: SVG at left 120, **top 288**, 1680×700.
- Output frame: x 1380, y 170, 280×230, radius 14, 3 px `--purple-t` stroke, filled with a dimmed copy of `portrait.jpg` plus a thin purple scan highlight; caption `every pixel generated` at x 1520, y 440 (Archivo 28, `--purple-t`, centred, two lines).
- **Loop-back arc** (click 2): a curve from the output frame's top (1520, 124) routed over the top of the diagram down into the **you** box (110, 316), stroke `--orange` 6 px, dashed 10/10, arrowhead at the **you** end; the two input arrows turn orange at the same time, so the cycle closes through the camera and the mic. Label centred under the arc at (700, 86), Archivo 30 weight 700, `--orange-t`: `it keeps watching you while it talks`. The report says the user's reaction feeds back into the CCM, so the arc must not point at the CCM from the output frame.
- **Speech to video link** (click 1): a short hook, `.ov-v2p`, from the speech generator's lower-left to the video generator's upper-left. The generated voice drives lip sync, which is what the diffusion slide's `the voice → the mouth` chip refers to.

**Build steps**
- *(entrance)* `you` node + the two input arrows + the CCM node rise and draw. **Why:** establishes that input flows *continuously* in before anything is decided.
- **[click 1]** Arrows draw from the CCM to **Speech generator** and **Video generator** (staggered 0.15 s), the photo thumbnail fades in and its arrow draws into **Video generator**, then the output frame fades up with the scan highlight sweeping once top-to-bottom. **Why:** one continuous motion traces the whole data path in the order Rey narrates it; the single scan sweep shows the frame being *painted*, not pasted.
- **[click 2]** The orange loop-back arc draws (`Kit.draw`, 0.9 s) and its label fades in. **Why:** full-duplex is a *loop*, and a loop is the one thing a static box diagram cannot show. This is the slide's load-bearing animation.

**Images:** reuses `assets/img/griffin/portrait.jpg` (generated on slide 5 — see below). No new generation. **Why it earns its place:** it makes "one photo in, full video out" literal, and establishes the face that the diffusion slide then destroys and rebuilds, so the two slides read as one story.

**Speaker notes (40 s ≈ 85 words)**
> Griffin stops queueing. One model, the Continuous Conversational Model, watches your camera and listens to your mic. It replaces Raven, Sparrow and the language model, and it re-decides several times a second instead of once per turn. **[click]** It streams text and controls to two generators: a speech generator built on Tavus's own audio codec, Tavec, and a video generator that paints frames with streaming diffusion, from one photo. The generated voice drives the mouth. **[click]** You see the result, and the camera and mic never stop feeding the model. That loop is why you can interrupt it.

**Sources**
- CCM + two streaming generators: report ¶90 and ¶102–105 — "A Continuous Conversational Modeling (CCM) engine perceives and decides. An Audio-Visual Generation engine … turns those signals into sound and pixels." Tavus. Self-reported.
- Sub-second re-decision: report ¶109 — "Griffin's CCM re-assesses the conversation at regular sub-second intervals." (Exact interval **not disclosed** — the slide says "several times a second", never a number.)
- Full duplex / keeps perceiving while speaking: report ¶96, ¶256.
- One reference image → all pixels: report ¶49, ¶122, ¶209.
- "CCM", "Tavec" and the generator names **are** on screen (fix pass). "Miniturn" and "PAL" stay off — jargon with no payoff for this audience.

---

## Slide 5 · `diffusion` — the core technique, part 1

- **id** `diffusion` · **title** `Diffusion` · **heading** `Diffusion` · **budgetSec 55** · 3 clicks
- **ONE IDEA:** Destroying an image with noise is easy, so you train a model to undo one small step of it — and then you can walk backwards from pure static to a face.

**On-screen content**
- Six-frame filmstrip (the generated portrait at six noise levels).
- Forward label: **adding noise is easy**
- Reverse label: **the model learns one job: take a little noise back out**
- Two conditioning chips (click 3), each centred under its own arrow into the rail (x 466 and x 1456): `the voice → the mouth` · `the CCM's controls → the expression`
- Footer: `Kit.src('Diffusion: a generator that starts from random noise and refines it step by step into a realistic sample (Yin et al., DMD2, 2024). The portrait is generated and fictional; the noise sequence is our own illustration.')`

**Layout**
- Filmstrip: six frames, each **240×320**, gap 28 → total width 1580. x from **170** to 1750; y **330 → 650**. Radius 10, 2 px `--line` border.
  - Frame files, left → right: `noise-0.jpg` (clean) … `noise-5.jpg` (pure static).
  - Under each frame, a 28 px `--text-3` JetBrains Mono tick label: `clean` under frame 1, `+ noise` under frames 2–5, `static` under frame 6.
- Direction bar: a 1580 px horizontal rail at y **706**, 6 px, `--line`, with a travelling arrowhead. Label centred under it at y **752**, Archivo 32 weight 700.
- Conditioning chips (click 3): two pills at y **812**, h 76, centred under frames 2–3 (x 300, w 500) and frames 4–5 (x 900, w 560), each with a short arrow rising from the pill into the rail. `t-body`, `--text`.
- Disclaimer line: x 170, y **930**, `t-label`, `--text-3`.

**Build steps**
- *(entrance)* Only frame 1 (the clean portrait) is visible, centred-left at its strip position; the other five slots are empty outlines. Heading rises. **Why:** start from one real thing, so the audience knows what is being destroyed.
- **[click 1]** Frames 2 → 6 fade in one at a time, left to right (0.22 s apart), the rail draws left-to-right behind them, and the label `adding noise is easy` fades in. **Why:** the left-to-right sequence *is* the forward process; seeing the face dissolve in steps is what makes "noise is added gradually" concrete rather than abstract.
- **[click 2]** The rail arrowhead flips and travels **right to left**; as it passes each frame, that frame brightens to full opacity while the frames to its right dim to 0.35, ending on frame 1 at full brightness. Label swaps to `the model learns one job: take a little noise back out`. **Why:** this is the single most important motion in the section — reversing the same strip shows that generation is literally the training process run backwards. Nothing static could carry it.
- **[click 3]** Two conditioning pills rise with short arrows into the rail; the rail tints purple. **Why:** shows *where* the steering enters (at every step, not at the end), which is the point that makes lip-sync and expression possible.

**Images — REQUIRED** → `assets/img/griffin/portrait.jpg` + `noise-0.jpg` … `noise-5.jpg`

**(a) The portrait. This is a deliberate exception to the KIT §7 glass style prefix** — the slide needs a plausible video-call frame, so generate it **without** `style-prefix.txt`, with this full prompt:
> Head-and-shoulders portrait of a completely fictional invented person in their mid-thirties, neutral friendly expression, looking straight into the camera as if on a video call. Soft studio key light from the upper left, gentle violet rim light on the left shoulder, deep warm charcoal #1E1B1C seamless background with no horizon line, shallow depth of field. Natural skin, simple plain dark top. Photographic, editorial, calm. Head centred with room above it. No text, no letters, no logos, no watermark.

Size `1024x1024`. **Read the PNG and judge it**: regenerate if it resembles a recognisable public figure, has warped hands/ears/teeth, carries text, or the background is not charcoal. **Why it earns its place:** the forward/reverse noise strip is the only way to teach diffusion visually, and it needs a real raster image; a drawn SVG face cannot be noised.

**(b) The noise sequence.** Generate programmatically — a true forward diffusion process with one fixed noise field, so the six frames read as one continuous sequence. Script lives in the scratchpad, **not** in the project; run with `python3 -I`:
```python
from PIL import Image
import numpy as np
D = '/Users/reyriordan/Documents/AIFM_Task5/deck/assets/img/griffin/'
im = Image.open(D + 'portrait-src.png').convert('RGB')
# centre-crop to 3:4 then resize to the on-slide size x2 for crispness
w, h = im.size; side = min(w, int(h * 0.75))
im = im.crop(((w - side)//2, 0, (w + side)//2, min(h, int(side/0.75)))).resize((480, 640), Image.LANCZOS)
x0 = np.asarray(im).astype(np.float32)
eps = np.random.default_rng(7).normal(128.0, 56.0, x0.shape).astype(np.float32)  # ONE fixed field
for i, ab in enumerate([1.0, 0.92, 0.70, 0.40, 0.14, 0.02]):   # alpha-bar schedule
    x = np.sqrt(ab) * x0 + np.sqrt(1.0 - ab) * eps
    Image.fromarray(np.clip(x, 0, 255).astype(np.uint8)).save(D + 'noise-%d.jpg' % i, quality=90)
```
Keep `portrait-src.png` out of the shipped assets (or leave it; it is small). Also save frame 0 as `portrait.jpg` for slides 4 and 7.

**Speaker notes (123 words ≈ 55 s)**
> The video generator is a diffusion model, the same method behind almost every AI image you have seen. Here is one frame. **[click]** Add a little random noise. Then a little more. Then more, until it is pure static. That direction is easy — anybody can wreck a picture, and we know exactly how much noise we added. **[click]** So we train a network on the one job that is hard: look at a noisy frame, and take a little of that noise back out. Do that over and over, and you walk backwards from static to a face. That is diffusion. **[click]** And at every step you can steer it. The voice it is speaking shapes the mouth. The CCM's controls shape the expression.

**Sources**
- Definition of diffusion: report glossary ¶343 — "A generator that starts from random noise and refines it, step by step, into a realistic sample" [9].
- Steering by audio and controls: report ¶260 — "The generated speech drives lip sync; the CCM's controls drive nonverbal behavior such as gesturing, looking away or changing emotion." Tavus.
- The strip itself is **our illustration** and says so on screen. No claim is made that Griffin's internal noise schedule looks like this.

---

## Slide 6 · `stream` — the core technique, part 2

- **id** `stream` · **title** `The streaming problem` · **heading** `The streaming problem` · **budgetSec 30** · 2 clicks
- **ONE IDEA:** A normal video diffusion model is too slow *and* needs frames from the future, so neither property survives a live call.

**On-screen content**
- Left card header: **Many passes per frame** · body: one frame icon, a circular arrow, a counter **×50** · sub-label `video needs many frames a second`
- Right card header: **It needs future frames** · body: a 7-frame row, arrows from frame 4 to frames 1–3 and 5–7 · sub-label (click 1) `on a live call those frames do not exist yet`
- Conclusion strip (click 2): **Griffin needs few steps and past frames only.**
- Footer: `Kit.src('Video diffusion needs many denoising passes and bidirectional attention over the whole clip (Yin et al., CausVid). The 50-step figure is CausVid\'s teacher — illustrative; Griffin\'s step count is not published.')`

**Layout**
- Left card: x 120, y 300, 800×520, `--surface`, radius 20, padding 36.
  - Header `t-h2` at top. Frame icon: 180×240 rounded rect centred at (520, 520) page coords, `--bg2` fill with a 2 px `--line` border.
  - A circular arrow (radius 150, 270° arc) around the frame icon, stroke `--purple-t` 6 px, arrowhead at the end.
  - Counter `×50` in `t-num` (132 px, JetBrains Mono, `--purple-t`) to the right of the circle at x 700, y 560.
  - Sub-label `t-label` `--text-2` at the card's bottom, y 760.
- Right card: x 1000, y 300, 800×520, same treatment.
  - Seven frames, each 70×94, gap 14, centred row at y 470 (x 1060 → 1740). Frame 4 (x 1312) is outlined `--orange` 3 px and labelled `now` above it (28 px, `--orange-t`).
  - Arrows from frame 4: three short solid arcs to frames 3, 2, 1 (stroke `--text-2`), three dashed arcs to frames 5, 6, 7 (stroke `--text-2`, dash 8/8).
  - Sub-label `t-label` at y 700, `--text-2`.
- Conclusion strip: x 120, y 866, 1680×104, radius 18, fill `var(--purple)` at 0.18 opacity with a 3 px `--purple-t` left bar; text `t-h2` weight 700 `--text`, left-aligned at x 160.

**Build steps**
- *(entrance)* Both card headers + the left card's frame icon and the right card's frame row appear. **Why:** the two obstacles are stated as a pair from the start, so the audience knows there are exactly two.
- **[click 1]** Left: the circular arrow sweeps around the frame while the counter runs **1 → 50** (`Kit.count`, 1.1 s). Right: the three future-pointing dashed arcs draw, then frames 5–7 cross-fade into `?` glyphs and the dashed arcs recolour to `--red-t`. **Why:** both halves show a *failure* — the counter makes the cost felt by running rather than being stated, and the arrows must reach forward before the future can be taken away from them. **(Cut in spec review: a 0.25 s shake on the arcs. The `?` glyphs and the recolour already say "these don't exist"; the shake was alarm for its own sake, which KIT §2.3 does not allow on teaching content.)**
- **[click 2]** Both cards dim to 0.45; the conclusion strip slides up from y 920 → 866 and fades in. **Why:** dimming turns two problems into one requirement, which is literally the brief the next slide satisfies.

**Images:** none.

**Speaker notes (30 s ≈ 73 words)**
> Two things stop that from running on a live call. **[click]** First, every frame costs many network passes. One published model used fifty, and video needs many frames a second. Second, a normal video model reads the whole clip at once, including the frames after the one it is drawing. On a live call those frames do not exist yet. **[click]** So Griffin needs a model that takes few steps and only looks backwards.

**Sources**
- Bidirectional attention / whole clip / viewer waits: report ¶213 — "Most video diffusion transformers use bidirectional attention: every frame attends to every other frame, including future ones. Generating one frame therefore means processing the whole clip" [13].
- Many denoising passes: report ¶213 — "Diffusion also needs many denoising passes, each a full forward pass through the network" [9].
- The `×50` number: report ¶218 — CausVid "distilled a 50-step teacher into a 4-step causal student" [13]. **Griffin's own step count is not disclosed** (report ¶241). On-screen label and footer both mark it illustrative.
- Griffin's frame rate is not disclosed, so the slide says "video needs many frames a second" and never names a rate.

---

## Slide 7 · `distill` — distillation and Self-Forcing

- **id** `distill` · **title** `Distillation` · **heading** `Distillation` · **budgetSec 60** · 5 clicks
- **ONE IDEA:** You don't rebuild the big model — you train a small one to copy its results in a few steps, one frame at a time, and then make it practise without the answer key.

**On-screen content**
- Teacher card: **TEACHER** · `many steps` `×50` · `whole clip at once`
- Student card: **STUDENT** · `few steps` `×4` · `one frame at a time`
- Arrow label: **copy what it produces, not how**
- Answer-key card (click 3): **answer key** · sub `real frames to copy from`
- Drift label (click 3): **its own mistakes pile up**
- Self-Forcing label (click 4): **Self-Forcing: it trains on its own frames**
- Footer: `Kit.src('Three-stage distillation named by Tavus: DMD2, teacher forcing, Self-Forcing (Yin et al. 2024; Huang et al., NeurIPS 2025). Step counts shown are CausVid\'s 50→4 — illustrative; Griffin\'s are not published.')`

**Layout**
- Teacher card: x 120, y 300, 620×380, `--surface`, radius 20, padding 34.
  - `TEACHER` `t-caps` `--text-3`. `many steps` `t-body`. `×50` `t-num` 132 px mono, `--text-2`. Bottom: a **single solid bar** 520×34, radius 8, `--text-3`, with the caption `whole clip at once` (`t-label`, `--text-3`).
- Student card: x 1180, y 300, 620×380, same geometry.
  - `STUDENT` `t-caps` `--purple-t`. `few steps` `t-body`. `×4` `t-num` 132 px mono, `--purple-t`. Bottom: the same 520×34 bar, but **split into 8 chunks** of 58 px with 8 px gaps, fill `var(--purple)`, caption `one frame at a time` (`t-label`, `--purple-t`).
  - At entrance the student card is an **outline only** (3 px dashed `--line`, contents hidden).
- Arrow: x 760 → 1160, y 480, 8 px, `--text-2`, arrowhead right. Label above at (960, 440), Archivo 30 weight 700, `--text-2`, centred: `copy what it produces, not how`.
- **Rollout strip**: 12 frames, each 100×134, gap 10, from x 180 to 1500, y **726 → 860**. Each frame is a flat `--bg2` rounded rect with a thin purple scan line (no imagery — these stand for frames, not pictures).
- **Answer-key card** (click 3): x 1540, y 726, 260×134, radius 14, 2 px dashed `--orange`, label `answer key` (Archivo 30, `--orange-t`) and sub `real frames to copy from` (24 → use 28 px, `--text-3`).
- Labels under the strip at y 904, `t-label`, swapped between steps.

**Build steps**
- *(entrance)* Teacher card fills in; student card appears as an empty dashed outline. **Why:** the empty outline poses the question — what has to change to fit in there?
- **[click 1]** The arrow draws left→right; the student card's border goes solid and its `few steps` line appears, with the number counting **50 → 4** (`Kit.count`, 1.0 s, mono). **Why:** the counting-down number makes "fewer steps" a measured change rather than an adjective, and it changes *in the same place* the teacher's 50 sits, so the comparison is unmissable.
- **[click 2]** The teacher's single solid bar flies across and lands in the student card, where it **splits into 8 chunks** which then emit, one at a time, into the rollout strip below (frames 1 → 12 fill left to right, 0.09 s apart). **Why:** one continuous motion shows the single structural change — whole clip becomes a stream — and connects the student card to the rollout strip that the next two clicks depend on.
- **[click 3]** The answer-key card fades in beside the strip, then **slides off the right edge and disappears**; as it goes, frames 7 → 12 take on a progressively stronger red tint and each one's scan line slips a few px further out of alignment, and the label `its own mistakes pile up` fades in. **Why:** removing the key and watching the later frames degrade in the same sweep is cause-and-effect in one gesture; it is exposure bias made visible, which no static diagram achieves. The misalignment *accumulates* left to right, which is the point — **(cut in spec review: a settling vertical jitter on the frames. A wobble reads as "glitchy render", not "error accumulating", and it was motion that resolved to nothing.)**
- **[click 4]** The red tint drains back to purple frame by frame (right to left, 0.07 s apart), a small orange feedback arc draws from the strip's right end back to its left end, and the label swaps to `Self-Forcing: it trains on its own frames`. **Why:** the loop arc shows the model's *own output* becoming its training input, which is the whole idea of Self-Forcing.

**Images:** none (the rollout frames are abstract placeholders, deliberately not pictures — they stand for "a frame", and filling them with faces would invite the audience to read quality into them).

**Speaker notes (143 words ≈ 64 s)**
> So how do you get a big, slow, future-peeking model to run live? You teach a student. **[click]** The student lands in a handful of steps where the teacher lands in fifty — copying the teacher's *results*, not its route. **[click]** Then you cut up the clip: instead of the whole video at once, it makes one frame at a time, each built from the one before — the same shape as the shopping assistant writing one word at a time. **[click]** But in training it always had the real frames beside it, like an answer key. On a live call the key is gone, so it builds on its own slightly-wrong frames. Errors pile up, and the face drifts. **[click]** The fix — Self-Forcing — is to practise without the key: generate your own frames, then get graded on the result. It learns to recover from its own mistakes.

**Sources**
- Three-stage recipe (DMD2 → teacher forcing → Self-Forcing): report ¶215–219, named explicitly by Tavus.
- "produce in a few steps what the teacher produces in many" / match the output distribution rather than the path: report ¶217 — "DMD trains the student to match the teacher's output distribution rather than copy its exact path from noise to image." Supports the on-screen line "copy what it produces, not how".
- Teacher forcing on ground-truth frames: report ¶218.
- Exposure bias and the answer-key analogy: report ¶219 and ¶221 — "a student who only ever practised with the answer key beside them, versus one who practised by working from their own earlier answers and learning to catch their own errors."
- Self-Forcing trains on its own rollouts and scores the whole sequence: report ¶219 [10].
- 50 → 4: CausVid, report ¶218. Illustrative; Griffin's counts undisclosed (¶241). Footer says so.
- **Deliberately absent:** DMD2's GAN loss, the 500× inference-cost claim, "robust teacher forcing", compressed history/FramePack.

---

## Slide 8 · `results` — what it achieved, honestly

- **id** `results` · **title** `User study` · **heading** `User study` · **budgetSec 35** · 3 clicks
- **ONE IDEA:** Half the people in a one-minute call thought Griffin was a person — a twenty-fold jump on the old system, in a study the company ran on itself.

**On-screen content**
- Left grid label: `GRIFFIN-LITE · 54 PEOPLE`, sub-line `a research preview, not the full model` → big number **48%** · caption `thought their partner was human`
- Right grid label: `OLD SYSTEM · 41 PEOPLE` → big number **2.4%**
- Right column (click 3), top to bottom:
  - caveat chip (dashed outline): `Tavus's own study` · `One-minute calls` · `No human comparison`
  - card **1.9 s** / `Griffin's reply. A person answers in 0.9 s`
  - demoted line **0.43 s** / `drawing the picture only, not the thinking`
- Footer: `Kit.src('Live study: 26 of 54 vs 1 of 41. Latency 0.43 s: Tavus. Replies 1.89 s vs 0.90 s: NVIDIA VideoFDB.', 'Self-reported')`

**Layout**
- **Grid A**: 54 dots, 9 columns × 6 rows, dot radius 19, pitch 58. Origin x 160, y 392 → block 522×348 (x 160–682, y 392–740).
  - Label above at x 160, y 352, `t-caps`, `--text-3`.
  - Big number under at x 160, y 790, `t-num` 132 px, `--purple-t`; caption `t-label` `--text-2` at y 892, width 520.
- **Grid B**: 41 dots, 9 columns × 5 rows (last row 5 dots, left-aligned), origin x 760, same pitch → block ends x 1282, y 682.
  - Label, big number (`--text-2`, not purple) and caption in the same vertical rhythm: number at x 760, y 790.
- Unlit dot: fill `--line` at 0.5 opacity. Lit dot: fill `var(--purple)` with a 2 px `--purple-t` ring (grid A) / `--text-2` fill (grid B, so the 1 dot reads as "barely anyone" without a second hue).
- **Right column** (click 3): x 1400, width 400. Two cards, y 392 (h 200) and y 624 (h 200), `--surface`, radius 18, padding 28. Each: `t-num` scaled to 96 px + `t-label` `--text-2` caption.

**Build steps**
- *(entrance)* Both grids appear unlit, with their labels. Heading rises. **Why:** showing both populations first makes the two grids comparable *as quantities* before any result is revealed — the audience sees 54 vs 41 and knows the samples are small.
- **[click 1]** 26 of the 54 dots light purple in a scattered order (random stagger, 0.025 s apart, 0.9 s total) while `48%` counts up from 0. **Why:** the scattered fill reads as "individual people", not a bar; the counter and the dots resolve together so the percentage is anchored to a count.
- **[click 2]** Exactly 1 dot lights in grid B, `2.4%` counts up. **Why:** the near-empty grid beside the half-full one is the comparison; one lonely dot is more honest and more memorable than a 20× bar.
- **[click 3]** The two timing cards rise on the right. **Why:** they are the counterweight to the headline, so they arrive last and separately — the slide ends on the limitation, not the boast.

**Images:** none.

**Speaker notes (85 words ≈ 38 s)**
> Tavus ran a test. Fifty-four people had a one-minute video call, then were asked whether their partner might be a machine. **[click]** Twenty-six of them, forty-eight percent, thought they had talked to a person. **[click]** With Tavus's previous system: one person in forty-one. **[click]** Now the caveats. Tavus ran this themselves, the calls lasted a minute, and nobody talked to a real human. Griffin also still replies slower than we do: one-point-nine seconds against nine tenths. And point-four-three is the picture alone, not the thinking.

**Sources**
- 26/54 = 48%, 1/41 = 2.4%: report ¶14 and ¶292. Tavus-run. **Self-reported.**
- Study framing (asked only at the end, primes belief): report ¶299. Spoken, not on screen.
- No human control arm, one-minute calls, small sample: report ¶292, ¶307, ¶313.
- 0.43 s = video generator average latency, audio arriving → effect on screen, on H100: report ¶229, ¶233. Tavus-run. Label on screen says `audio in → pixels on screen`, never "response time".
- 1,892 ms vs 900 ms: report ¶274 — NVIDIA VideoFDB generation track. Independent; rounded to 1.9 s and 0.9 s on screen.
- **Not used:** VideoFDB rubric scores (3.73/3.83/3.92), TOR alignment, FID/DOVER/THEval/LSE-C table, the 35–61% confidence interval (available in notes if a student asks).

---

## Slide 9 · `takeaway` — hand into Tavus

- **id** `takeaway` · **title** `Takeaways` · **heading** `Takeaways` · **budgetSec 30** · 2 clicks
- **Built as shipped:** the canonical three-row closer (Diffusion / Distillation / Evaluation) over the opener image, with the chip row **PRICE · ASSIST · INTERACT · NEGOTIATE**; INTERACT's purple slab wipes in on click 2.
- **ONE IDEA:** Three lessons travel beyond avatars: diffusion buys realism with time, distillation buys the time back, and a believability score is not a quality measure.

**On-screen content**
- Three numbered rows, the canonical closer shared with `airbnb/takeaways` and `rufus/takeaways` (same markup and CSS; only the text, the image and `--sec` differ):
  | # | tag | line (`t-h2`) | sub (`t-label`) |
  |---|---|---|---|
  | 01 | USE IT WHEN · DIFFUSION | Diffusion makes realistic images and video, slowly. | Many clean-up passes per frame: good quality, high cost. |
  | 02 | THE MOVE · DISTILLATION | Distillation trains a small student to copy a big teacher. | Fewer steps, nearly the same face, fast enough to stream. |
  | 03 | WATCH OUT · EVALUATION | A believability score is not a quality measure. | 48% fooled in one-minute calls, and replies still take twice as long. |
- Throughline strip at x 120, y 890: `PRICE` on a red slab · `ASSIST` on a blue slab · `INTERACT`, whose purple slab wipes in on click 2 · `NEGOTIATE`, which turns `--green-t` at the same moment.
- `opener.jpg` bleeds in from x 1140 under a left-to-right veil.
- Footer: `Kit.src('Row 03: Tavus's own live study — 26 of 54 vs 1 of 41, one-minute calls, no human control arm. Reply time 1.89 s vs 0.90 s for a person: NVIDIA VideoFDB.', 'Self-reported')`

**Build steps**
- *(entrance)* Image and veil fade in, the header rises, row 01 rises, the strip fades in with `PRICE` and `ASSIST` already slabbed.
- **[click 1]** Row 02 shows (`Kit.show`, never `from()` — rows 02 and 03 are hidden by default).
- **[click 2]** Row 03 shows; `INTERACT`'s slab wipes in from the left and `NEGOTIATE` turns green. **Why:** the section closes with the same gesture Airbnb and Rufus end on, and the green is the next section's colour arriving early.

**Images:** reuses `assets/img/griffin/opener.jpg`.

**Speaker notes (30 s ≈ 73 words)**
> Three things to keep. One: diffusion makes realistic images and video, and the clean-up passes are what make it slow. **[click]** Two: distillation. Train a small student to copy a big teacher, and the same model streams live. **[click]** Three: the study measured whether people were fooled, not whether it was good. Half were fooled in one-minute calls, and replies still take twice as long as ours. Next: the company that built it.

**Sources:** row 03 repeats slide 8's study and latency numbers, with the same `Self-reported` flag. Rows 01 and 02 restate slides 5 and 7 and carry no new numbers.

---

## Cross-section hooks

**This section assumes (from earlier sections):**
1. **Airbnb** — that a model is *trained* by being graded on something, and that training data is not the same as what you see at run time. The distillation slide leans on this: the student is graded against the teacher, then against its own rollouts.
2. **Airbnb** — "the only equation in the talk" has already happened. Griffin uses **no** formulas; `noise → face` pseudo-diagrams only (KIT §5).
3. **Rufus** — that a generative model produces output *one piece at a time*, left to right, and that this is what makes streaming possible. Slide 7's notes now make the callback explicitly ("the same shape as the shopping assistant writing one word at a time"), and **Rufus's `rag` notes have been edited to say "one word at a time" so the callback has something to call back to.** If that phrase leaves the Rufus notes, this clause must go too.
4. **Rufus** — that latency is a product constraint, not a detail. Slide 3 escalates it from "slow answer" to "broken conversation".
5. **Intro** — the Price → Assist → Interact → Negotiate strip exists and is styled; slide 9 reuses it.

**This section sets up:**
1. **Tavus (04)** — slide 9's last line hands off to the Tavus origin slide. Tavus owns the ~$64M raised (never "$70M" — the report marks that figure unexplained), 150K developers and the AI-sales-rep use case. **Changed in the fix pass:** this section now names Raven, Sparrow, Phoenix and CVI on `cascade`, and the CCM and Tavec on `overview`. The Tavus section must not re-introduce them as new; it can refer back. "PAL" and "miniturn" stay off screen.
2. **Tavus (04)** — the "self-reported" pattern is established here (slide 8); Tavus's business numbers can lean on it with one word rather than a fresh explanation.
3. **Future (05)** — slide 8's 48% is the factual basis for the trust/disclosure question. If the Future section wants a one-line callback, the line is "half the room couldn't tell". Griffin's safety discussion is **not** on a slide; it lives in Rey's note on slide 8 and belongs to the Future section's trust-layer beat.
4. **Future (05)** — "the face can be cloned from one photo and ten seconds of voice" is a Griffin fact (report ¶201, ¶320) deliberately left out here; it is handed to Future as ammunition.

---

## Deliberately cut

| Cut | Why |
|---|---|
| Tavec internals (40 values, 100 fps, 28.42M params, ViSQOL 4.242, 2,193× real time) | A second technique with no payoff after diffusion. The name appears as the speech generator's sub-label on slide 4; nothing more. |
| Continuous vs codebook latents, EnCodec, vector quantization | Depends on understanding tokenization; no room, no need. |
| Flow matching, autoregressive diffusion transformer for speech | Same reason — one generative technique taught properly beats two taught badly. |
| DMD2 internals: GAN loss, dropped regression loss, 500× inference cut | Per the section direction. The student just has to "land where the teacher lands". |
| Compressed history / FramePack context window | A real and interesting trick, but it answers a question (memory over long calls) the audience hasn't asked. |
| CCM internals: miniturns, input token streams, phase table, Moshi | The name plus "perceives and decides, re-decides several times a second" carries the whole idea for this audience. |
| ~~The CVI pipeline and the three specialist models~~ | **Reinstated in the fix pass.** `cascade` names Raven, Sparrow, LLM, TTS and Phoenix; version numbers and per-model internals stay cut. |
| VideoFDB rubric scores, TOR alignment, the five-model latency table (FID / DOVER / THEval / LSE-C) | One number per claim. 0.43 s is the only row that survives. |
| The 35–61% confidence interval and the 2.4% / 2% / 3% discrepancy | Kept in Rey's head for Q&A; on screen it would crowd out the simpler "they ran it themselves". |
| Safety, disclosure features, consent for cloned identities | One spoken sentence at most; the argument belongs to the Future section. |
| WebRTC, Daily, Baseten, Cerebrium, H100s, Queen Mary University | Infrastructure, not a technique. |
| Griffin-Lite vs full Griffin distinction | On screen on `results` as the label sub-line `a research preview, not the full model`, and in the `open` and `results` notes. |

---

## Build checklist for the implementer

1. Generate `opener.png` and `portrait-src.png` **in parallel in the background** (KIT §7), `Read` both, regenerate until they pass, then convert to JPEG q90.
2. Run the noise script, `Read` `noise-0.jpg` and `noise-5.jpg` to confirm frame 0 is clean and frame 5 is unrecognisable static.
3. Attempt to download a public Griffin clip into `assets/video/griffin/griffin-demo.mp4`. If it fails, ship the placeholder — the slide must look finished either way (KIT §10).
4. Scope all CSS under `.slide[data-sec="griffin"]` in `css/sections/griffin.css`.
5. Hidden-by-default elements use `Kit.show` / `tl.to(…, {autoAlpha:1})`, never `tl.from` / `Kit.rise` (KIT §4 gotcha). Slides 5, 7 and 8 all have state-driven visuals — use the LOSS pattern: one state object, one pure `render()`, tween with `onUpdate: render`.
6. QA with `--session bts-griffin`, screenshot **every** step of every slide (23 states + 9 print states), `Read` each, fix, repeat. `agent-browser --session bts-griffin errors` must be empty.
7. Confirm notes word counts (fix pass): roughly **43 / 63 + 44 s of clip / 115 / 85 / 123 / 73 / 143 / 85 / 73**. The `demo` slide is intentionally far under 135 wpm because the clip runs for 44 s; do not "fix" it. Every other slide is within about ±8% of 135 wpm × `budgetSec`.


---

## Fix pass (Nov 2026) — what changed, and why the spec above is superseded where they disagree

Reviewed by a student reviewer and a design reviewer; the notes below record the deltas. The code in
`sections/03-griffin.js` and `css/sections/griffin.css` is the source of truth.

- **takeaway** — canonical closer. The `.sb` sub-line is gone from all three rows; rows re-pitch to
  `285 + i * 190`; the marker strip stays at left 120 / top 890; the footer is one line. Identical in
  `01-airbnb.js` and `02-rufus.js`.
- **cascade** — the time axis rescales to 460 px/s, so the five stage boxes now fill the frame out to
  x 1606 instead of stopping at x 1203. Box x/width: 180/230, 410/230, 640/460, 1100/230, 1330/276.
  Click 4 floats the orange band **above** the axis (x 180, y 44, 1426×80) with a bracket pointing down
  at all five boxes, so it can no longer be read as a duration; the measurement caption and the
  dead-air bracket leave the screen on that step, `.cs-time` and both chips dim to 0.55, and the three
  stage names stay readable under the bracket. Chips move up to top 820. Footer is one line.
- **overview** — `you see it` labels the return arc; `it keeps watching you while it talks` now labels the
  two input arrows, which is the leg it describes. The output frame uses `portrait-talk.jpg`, a second
  moment of the same identity, so "every pixel generated" has visible evidence. The one-photo thumbnail
  shrinks to 110×146. The unlabelled speech→video hook is deleted; the fact stays in the notes.
- **diffusion** — the reverse pass keeps every slot at full opacity and cross-fades each slot to its
  cleaner neighbour (`.df-g` overlay images), so the strip resolves instead of dimming; captions flip to
  `− noise`. The two point arrows become a bus under the rail with a tick arrow under **every** frame,
  fed from both chips. The frame row moves up to top 300 to make room.
- **stream** — the arcs point **into** `now` (the model reads its neighbours to draw it). Past frames and
  the `now` frame carry the real portrait; the loop frame resolves from `noise-3` to `noise-1` as the loop
  completes. Unavailable future frames are grey, not red: grey `?`, dimmed dashed arcs and one grey cross.
- **distill** — the eight-chunk strip inside the Student card is deleted; `one frame at a time` moves onto
  the bottom row, which is now the single frames picture, hidden until click 2 and filled with the
  portrait. Drift is shown by the picture (offset, blur, desaturation) with the red tint as reinforcement
  only; `its own mistakes pile up` sits over the drifting end with a tick down to the first drifting frame.
  Click 3 now holds the answer key beside the clean row and click 4 removes it — **5 clicks**.
- **results** — mono numerals keep their grid, but the unit (`s`, `%`) is set in Archivo at 0.58 em and the
  decimal point is tightened, so `0.43 s` and `2.4%` stop reading as separate tokens.
- **demo** — the purple "Watch on YouTube" button becomes a quiet outline chip docked under the Watch-for
  card; the poster is re-cut to the call area with no burnt-in subtitle.
- **every slide** — one rendered footer line. Method caveats moved into the speaker notes.

## Fix pass round 2 (Nov 2026)
- **Type scale, every slide** — every string is now on 28/36/52/76/168 (mono 132, footer 22). Snapped:
  cascade stage names, `a person answers here` and `dead air` 30 → 28; overview `you see it` 30 → 28,
  `you` 34 → 36, `Speech generator` / `Video generator` 32 → 36; stream `?` 44 → 36; distill `answer key`
  30 → 28 (the inline `font-size` is gone, it is a plain `t-label`).
- **overview** — the two generator cards widen from 300 to 350 (x 975) so `Speech generator` at 36 px
  fills 87% of its card instead of 100%; the two CCM→generator arrows end at x 967 and the
  video→output arrow starts at x 1333.
- **results** — only two numbers carry the accent: **48%** (the claim) and **1.9 s** (the honest
  comparison against a person's 0.9 s). `1.9 s` leads the right column under the caveat chip, and
  `0.43 s` sits beneath it at `t-h2` in `var(--text-2)` — supporting detail, not a claim.
