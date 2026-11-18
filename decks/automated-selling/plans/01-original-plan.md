# Plan: "Built to Sell" — animated HTML lecture deck

## Context
Rey is giving a ≤30-minute talk to students with no ML background. It covers AI in automated selling: three applications (Airbnb Smart Pricing, Amazon Rufus/Alexa for Shopping, Tavus Griffin), one company (Tavus) and future markets. The main goal is to **teach specific ML techniques through the applications**. Sources are the five research reports at the repo root; only a small fraction of their content will be used. The palette comes from `color-inspo.png`: overlapping translucent slanted panels in red, magenta, purple, green, two blues, teal and charcoal, with an orange-red accent. The deck must be visually striking and full of motion, but **clarity always wins over spectacle**.

Workflow: build a design kit + title slide + one hard content slide → Rey approves → a multi-agent workflow builds the rest → automated QA → Rey reviews the full deck.

## Locked decisions
| Area | Decision |
|---|---|
| Format | Custom HTML/JS deck, offline, no build step, opens by double-click (classic scripts, no ES modules). GSAP vendored locally. Presenter window with notes and timer. PDF export fallback |
| Math | Visual-first. Exactly **one** equation in the whole talk (the Airbnb loss), revealed after its interactive visual |
| Presenter | Rey alone. Full spoken-script speaker notes with timing cues (~135 wpm) |
| Time | 27:00 target + 3:00 buffer. Intro 1:00 · Airbnb 6:30 · Rufus 6:30 · Griffin 6:30 · Tavus 2:45 · Future 3:45 (includes close) |
| Order / throughline | Airbnb → Rufus → Griffin → Tavus → Future. "An AI salesperson, assembled": **price → words → face → negotiator** |
| Title | **Built to Sell** — *How AI learns to price, talk, and show its face* (presenter: Rey Riordan; course/date placeholder) |
| Canvas | Dark warm charcoal (#1E1B1C–#2A2627) to start; any slide can flip to warm off-white via one class if clarity needs it |
| Type | Archivo (variable, width axis): expanded black italic for titles (echoes the logo slant), normal width for labels. JetBrains Mono for numbers, prices, timings and the equation. Fonts self-hosted woff2 |
| Imagery | GPT image gen (`~/.claude/skills/gpt-image-bridge/bin/gpt-image-2`), style = translucent glossy 3D "glass" objects in palette colors on charcoal. Use freely and regenerate until excellent (quota is not a concern). Images are **never** used for exact diagrams; those are code-drawn SVG/GSAP. No real logos, brand UIs or real people |
| Concept order | Within each app, follow data flow (e.g., Airbnb: trees before loss) |
| Demos | Griffin **live** (cold open of the Griffin section), with Tavus's public Griffin clips embedded as backup (with credit). Rufus = real capture from Rey's own Amazon account (cropped of personal info), replayed in-deck |
| Sources | Small source footer on every data slide; "self-reported" flagged where true; references appendix after the close (not timed) |

## Section flows

### Intro (1:00)
Title slide (glass "salesperson" built from slanted palette panels; panels slide and overlap in). Hook: "In the last week, an AI probably priced, pitched or sold you something." Three flashes (a nightly price, a shopping answer, a face on a call) snap together into the salesperson silhouette, which becomes the agenda: Price → Words → Face → Future.

### Airbnb Smart Pricing — "Price" (6:30, color: red)
1. Problem: "what should tonight cost?" Listings are unique, demand shifts daily, Airbnb can only suggest, and the right price is never observed (1:00)
2. Overview: booking-chance model → price-suggestion model → host min/max. The textbook demand curve failed in A/B tests (0:30)
3. Gradient-boosted trees: one tree → each new tree fixes the last one's mistakes → P(book) (1:00)
4. **Custom loss (core, the approval slide):** booked at P → interval [P, c₂P]; unbooked at P → [c₁P, P]. Draggable price widget showing the flat-bottom valley. Both sides are needed (otherwise the model learns "free nights"). Then THE equation `max(0, L − f) + max(0, f − U)`. Worked numbers: booked at $100 → [$100, $110]; c₁ = 0.9 and c₂ = 1.1 marked as illustrative (2:00)
5. Results: nightly price −5.7%, revenue +8.6% (independent, *Marketing Science* 2021) (1:15)
6. Takeaways (0:45)

Cut: fairness twist, eval metrics, strategy-model parameters, revenue ≠ profit.

### Amazon Rufus / Alexa for Shopping — "Words" (6:30, color: blue)
1. Problem: search handles "find me X", not "what should I buy?"; no product is titled "cold-weather golf" (0:45)
2. Overview + Rey's Amazon capture: a shopping-trained LLM that gathers evidence, uses tools and learns from thumbs (1:00)
3. **RAG (core):** weights are frozen, but prices and reviews change hourly, so the model fetches evidence and writes from it. The source depends on the question: durability → reviews, size → catalog, delivery → live API (1:30)
4. Tool calling: think → call tool → observe → repeat. "The LLM proposes, ordinary software disposes" (Auto Buy) (0:45)
5. Learning from thumbs: feedback → reward model → nudge the model. Trap: optimizing for approval → flattery and overselling (1:00)
6. Results: 400M+ customers, ~$12B incremental annualized sales (Amazon's claim). One line on why "users buy 60% more" is selection bias (0:55)
7. Takeaways (0:35)

Cut: pretraining mix, serving/chips, ads (moved to Future).

### Tavus Griffin — "Face" (6:30, color: purple)
1. Setup line ("every pixel you're about to see is generated, live, from one photo") → **live demo**, students try interrupting (2:00)
2. Problem: older avatars felt robotic: walkie-talkie cascade (waits for silence; only ~40% of pauses mean "your turn") + stiff 3D face (0:45)
3. Overview: one "director" + voice/video "crews"; one photo → full video (0:30)
4. **Diffusion (core):** noise → face, step by step. Why it can't stream: too many steps, and it looks at future frames that don't exist yet (1:30)
5. **Distillation:** teacher → student; many steps → few; whole clip → frame by frame; answer-key analogy for Self-Forcing (1:00)
6. Results: 48% (26/54) thought it was human vs 2.4%; 0.43 s render latency; flagged self-reported (0:30)
7. Takeaways → straight into Tavus (0:15)

Accuracy rule: Griffin's end-to-end reaction is ≈1.9 s (humans ≈0.9 s, cascades 2.8–3.5 s). Never claim human speed.
Diffusion visual: a generated *fictional* portrait with Gaussian noise added programmatically (a true forward process), played in reverse and labeled as an illustration.
Cut: DMD2/GAN details, compressed history, codec and CCM internals.

### Tavus — the company (2:45, color: magenta)
1. Origin + a little on the founders: Hassaan Raza (CEO; ex-Apple/Google PM, UT Austin CS) and Quinn Favret (COO; Thiel Fellow). They recorded 200 personalized prospecting videos in one night, got +450% replies, and automated it → Tavus v1 (YC S21) (0:40)
2. Pivot: personalized video → real-time video agents (2024) → Griffin. Visual: Phoenix (renders), Raven (perceives) and Sparrow (turn-taking) merge into one Griffin. "Tavus" is Turkish for peacock, which gives a glass-peacock motif (0:45)
3. Snapshot: ~$64M raised (Sequoia, CRV), 150K developers, AI sales agents like Qualified's AI SDR (2× conversations, 6× meetings, self-reported), crowded field (Anam, HeyGen) (0:50)
4. Bridge: "The AI salesperson exists. What happens when it's everywhere?" (0:30)

### Future markets — "Negotiator" (3:45 incl. close, color: green)
The focus is where things are going, not where they are now.
1. Hook: Vending-Bench, where an AI gets $500 and a vending machine for a simulated year. The best model ends at ~$16.5K, rising ~$850 a month, against ~$63K for a "good human". It also fakes price histories and joins cartels (0:40)
2. Three shifts ahead (2:15):
   - **Selling *to* agents:** buyer agents haggle with seller agents, and the weaker agent quietly pays ~2% more. "Agent-experience optimization" replaces SEO. Today-anchor: Walmart/Pactum negotiating with 2,000 suppliers at once
   - **The salesperson moves into your assistant:** sponsored agents in ChatGPT. Whose side is your agent on? This creates a market for "fiduciary" buyer agents
   - **Everyone gets their own price:** personalized pricing and algorithmic collusion; regulators are racing to keep up
   - Quick maturity strip placing all four markets (AI SDRs, haggling, x402 micropayments, AI-tuned microtransactions) from today to tomorrow, plus "the money is in the trust layer" (audits, agent wallets, insurance)
3. Close: the assembled salesperson (price → words → face → negotiator) + one question for the room (0:50)

## Design system (written once in Phase 1 as `deck/KIT.md`, the contract for every builder)
- **Tokens:** hexes sampled from `color-inspo.png` with PIL. Section colors: Airbnb red, Rufus blue, Griffin purple, Tavus magenta, Future green; orange-red is the "focus" accent (equation, key number). Colors that must be told apart also differ in lightness and carry labels; never rely on red vs green alone.
- **Signature motion:** slanted translucent panels sweep across on section transitions and blend where they overlap (`mix-blend-mode: screen` on dark). Builds advance on → / Space / clicker; ambient loops stay subtle. One easing family, durations 0.4–0.9 s.
- **Clarity rules:** one idea per slide; ≤ ~12 words of body text; big numbers over bullets; heading position fixed across slides; labels ≥ 28px at 1920×1080.
- **Image prompt prefix:** shared style string (glass, palette hexes, charcoal backdrop, soft studio light, 16:9) so all generated images match.

## Architecture
```
deck/
  index.html          # stage (1920×1080, scaled to fit), loads everything as classic <script>s
  presenter.html      # notes + timer + next-slide preview, synced via BroadcastChannel
  KIT.md              # design + API contract for builders
  css/theme.css       # tokens, dark/light variants, type scale, @font-face
  css/components.css  # panels, cards, big-number, timeline, source footer
  js/vendor/gsap.min.js
  js/engine.js        # registry Deck.section(id, slides[]); slide = {id, html, steps[], notes, budgetSec};
                      # hash routing (#/airbnb/loss), build steps, transitions, print/PDF mode (final state per slide)
  js/components/*.js  # reusable animated pieces (panel sweep, counter, pipeline-flow, tree-grow…)
  sections/00-intro.js 01-airbnb.js 02-rufus.js 03-griffin.js 04-tavus.js 05-future.js 99-refs.js
  assets/{img,video,fonts,capture}/
```
Estimated ~40–50 slides, many with multi-step builds.

## Execution
### Phase 1: foundation + approval gate (main thread)
1. Sample palette → tokens; download Archivo + JetBrains Mono woff2 and GSAP into `deck/` (only network step).
2. Build engine, theme, components, presenter view and `KIT.md`.
3. Generate the title hero image (iterate until excellent).
4. Build **Title slide** and **Airbnb custom-loss slide** (all builds, draggable widget, equation reveal, speaker notes).
5. Screenshot both at 1920×1080 (agent-browser), including build states, and show Rey. **Stop for approval**; iterate on feedback.

### Phase 2: workflow (after approval; load `workflow-authoring` skill first)
- **Build (parallel, 5 agents):** Intro+Close · Airbnb · Rufus · Griffin · Tavus+Future. Each reads `KIT.md` + its report + this plan's section flow, and writes its own `sections/*.js`, images and notes sized to its time budget.
- **Before/alongside:** Rufus capture in the main thread (needs Rey's logged-in Chrome via claude-in-chrome; query "What do I need for cold-weather golf?" plus a product-page question). Crop personal info; rebuild as an in-deck replay. Griffin backup: download Tavus's public Griffin demo clips from tavus.io/griffin with credit.
- **Review (2 agents):** (a) visual/clarity QA: screenshot every slide and build step, check overflow, contrast and text density, and confirm no console errors or network requests; (b) fact + timing: every number vs the reports, self-reported flags present, notes word count within ±10% of budget at 135 wpm.
- **Fix (1 agent),** then Rey reviews the full deck.

## Verification
- Open `deck/index.html` from disk with Wi-Fi off: all slides, fonts, images and videos load.
- Step through every build with the keyboard, test hash deep links, and check the presenter window syncs with the timer.
- Screenshot pass at 1920×1080 and at a 1280×720 projector size; check the light-variant slides.
- Timing: sum of `budgetSec` = 27:00; per-section notes word counts within ±10%.
- Fact check: every on-slide number traced to a report line.
- PDF export renders each slide's final state legibly.
- Live-demo slide: the launch link opens in a new tab and the backup clip plays on keypress.
