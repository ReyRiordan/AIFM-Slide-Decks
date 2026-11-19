# Lecture decks

Rey's animated HTML lecture decks. Each deck is a ~27-minute talk to students with no ML background that teaches real ML techniques through real products.
A deck is static HTML/CSS/JS built on GSAP. It has no build step and opens directly from `file://`.

Food design deck live site: https://aifm-slide-decks-food-design.vercel.app/#/intro/title

**Read `HANDOFF.md` first.** It covers how to start a deck, the process and its approval gates, the lessons from deck 1, and the tools.

## Where things are
| Path | What |
|---|---|
| `HANDOFF.md` | Process, lessons, tools, hosting. Read first. |
| `template/` | Starter deck. `cp -r template decks/<name>` to begin. |
| `decks/<name>/` | One deck. Each is self-contained: there is no shared runtime between decks. |
| `decks/<name>/KIT.md` | **Builder rules: slide API, text rules, type scale, colors, animation, notes and QA. Read it before editing slides.** |
| `decks/<name>/sources/` | Research reports. The only allowed source of facts and numbers. |
| `decks/<name>/plans/` | Approved plans: sections, beats, budgets, heading map. |
| `decks/<name>/specs/<id>.md` | Per-section story spine, slide list and checklist. |
| `decks/<name>/sections/NN-*.js` | One file per section. `css/sections/<id>.css` is scoped to `.slide[data-sec="<id>"]`. |
| `decks/<name>/tools/` | `script-editor.py` (slide + notes side by side) and `capture.py` (screenshot every build step). |
| `decks/automated-selling/` | Deck 1, "AI for Automated Selling". Archived: don't edit it. |

## Key rules (details in each deck's `KIT.md`)
- Clarity first. One idea per slide, ≤ ~12 words of body text, no prose bullets. Every animation shows a change or a relationship.
- Story before technique: problem → roadmap → technique slides with crumbs → results → 2 takeaways.
- Headings are plain topic labels in sentence case, ≤ ~6 words.
- Every number traces to a report in `sources/`. Never invent stats or quotes. In food-design (since Nov 2026) slides carry **no** source text or provenance flags: citations go in the References appendix and caveats in the speaker notes. Other decks follow their own KIT.
- On-screen text follows `.claude/skills/technical-writing` and `.claude/skills/anti-slop`. Speaker notes follow Rey's spoken voice from the automated-selling deck (food-design KIT §10).
- Speaker notes mark each `ctx.pause()` with `[click]`. Rey owns the script: match slides to his notes.
- Free reign over GPT image generation until all images are perfect (use GPT image bridge skill).

## Run and check (from a deck folder)
- Open `index.html`. Use `#/<section>/<slideId>` to jump to a slide and `?print` to see every slide in its final state.
- Keys: → / Space next · ← back · P presenter · F fullscreen · B blackout.
- QA: `python3 tools/capture.py <unit|all> qa/<run>/`, then `Read` the screenshots. `agent-browser errors` must be empty (KIT §11).
- Script: `python3 tools/script-editor.py`.
- Asset paths are case-sensitive on the host, so match filename case exactly.

## Hosting
- Private GitHub repo `ReyRiordan/AIFM-Slide-Decks`. Each hosted deck is its own Vercel project with Root Directory `decks/<name>` (HANDOFF §6).
- Pushing to `main` redeploys. Work on a branch and push only when Rey asks.
