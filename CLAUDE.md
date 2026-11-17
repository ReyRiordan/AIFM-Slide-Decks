# Built to Sell — "AI for Automated Selling" lecture deck

A 27-minute lecture Rey gives solo to students with no ML background. It teaches real ML techniques through real products,
assembling an "AI salesperson" piece by piece: **Price** (Airbnb) → **Assist** (Amazon Rufus) → **Interact** (Tavus Griffin)
→ Tavus the company → **Negotiate+** (the future of agent selling).

The deck is static HTML/CSS/JS built on GSAP. It has no build step and opens directly from `file://`.

## Where things are
| Path | What |
|---|---|
| `*.md` (repo root) | Source research reports. The only allowed source of facts and numbers. |
| `deck/index.html` | The deck. `deck/presenter.html` is the speaker view (press **P**). |
| `deck/KIT.md` | **Full builder rules: slide API, type scale, colors, animation rules, notes and QA procedure. Read it before editing slides.** |
| `deck/js/engine.js` | Slide engine (navigation, steps, print mode). Its header documents the slide API. |
| `deck/js/components/kit.js` | Shared helpers (`Kit.rise`, `Kit.count`, `Kit.src`, `Kit.color`, …). |
| `deck/sections/NN-*.js` | One file per section: `00-intro`, `01-airbnb`, `02-rufus`, `03-griffin`, `04-tavus`, `05-future`, `99-refs`. |
| `deck/css/theme.css`, `components.css` | Global tokens and components. Section CSS is in `css/sections/<id>.css`, scoped to `.slide[data-sec="<id>"]`. |
| `deck/specs/<id>.md` | Per-section beats, time budgets and checklists. |
| `deck/assets/` | `img/<section>/`, `video/`, `capture/` (Rey's demo captures) and `fonts/`. |
| `deck/design/` | Image style prompt (`style-prefix.txt`), approval screenshots and `contact-sheet.png` (all slides on one page). |
| `deck/qa/` | Scratch output for QA screenshots. Gitignored. |
| `deck/AI-for-Automated-Selling.pdf` | Exported PDF of the deck. |
| `~/.claude/plans/i-want-to-create-async-hearth.md` | Original talk plan (beats and budgets). Outside the repo. |
| `~/.claude/plans/let-s-do-a-comprehensive-async-shell.md` | Fix-pass decisions. These override `KIT.md` where they conflict. Outside the repo. |

## Key rules (details in `deck/KIT.md`)
- Clarity first. One idea per slide, ≤ ~12 words of body text, no prose bullets. Every animation must show a change or relationship.
- Every number traces to a source report and has a `Kit.src(...)` footer. Never invent stats or quotes.
- Exactly one equation in the talk: the Airbnb loss.
- On-screen text and speaker notes follow `.claude/skills/technical-writing` and `.claude/skills/anti-slop`.
- Speaker notes mark each `ctx.pause()` with `[click]`. Length is about 135 words per minute of `budgetSec`.

## Run and check
- Local: open `deck/index.html`. Use `#/<section>/<slideId>` to jump to a slide and `?print` to see every slide in its final state.
- Keys: → / Space next · ← back · P presenter · F fullscreen · B blackout.
- QA: screenshot each build step at 1920×1080 with `agent-browser` into `deck/qa/` and check that `agent-browser errors` is empty (KIT.md §9).
- Asset paths are case-sensitive on the host, so match filename case exactly.

## Hosting
- Private GitHub repo: `ReyRiordan/ai-automated-selling-deck`. Vercel serves it with Root Directory `deck`.
- Pushing to `main` redeploys the live site automatically. Other branches get preview URLs.
- `deck/.vercelignore` keeps `KIT.md`, `specs/`, `design/` and `qa/` off the public site.
