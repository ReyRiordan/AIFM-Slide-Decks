# Review and improvement pass: "Built to Sell" deck

## Context
Rey wants a full critical review and fix pass over the deck, run as a multi-agent workflow. Each section gets two reviewers:
- a **student** (no ML background) who flags anything confusing or wrong, in the content or the visuals;
- a **visual/design** reviewer who flags clutter, bad spacing, overlaps and weak visuals.

Fixers then apply the fixes. Known issues the run must catch, which also serve as calibration:
1. On the intro agenda, the "Assist" label overlaps other text.
2. The takeaway slides are too cluttered.
3. The Rufus RAG slide is overwhelming, and its "live API" source is a tool call, not retrieval. The Rufus report supports this: it says delivery questions are answered "from a live API" and frames Rufus as "RAG with tool calls".

Minor fixes and direct upgrades proceed without Rey. Big content or structure changes come to Rey for approval first.

## Decisions (agreed in the interview)
- **Approval line.** Fixers apply these without asking: layout, spacing, overlaps, decluttering, label wording, cutting redundant elements, animation timing, and image restyles that keep the image's subject and role.
  These are **gated** (they go to Rey first): any change to a claim, fact or teaching point; adding, removing, reordering or merging slides; changing a diagram's concept; budget shifts over about 10 s; anything that needs a change to `engine.js`, `kit.js`, `theme.css`, `components.css`, `index.html` or `presenter.html`.
- **Screenshots.** A scripted capture (bash plus agent-browser, no LLM) runs once, before Run 1. Both reviewers in a section use the same images. A reviewer can open its own session (`bts-rev-<unit>-<role>`) only to check motion. Fixers and re-checkers always use their own sessions.
- **Student lens.** Pass 1 is naive: the student reads the screenshots and treats the speaker notes as Rey's narration. Pass 2 checks each "seems wrong" suspicion against the section's source report and confirms or drops it. Fix-pass decisions are settled: the heading map, the markers and the one-equation rule (from `~/.claude/plans/let-s-do-a-comprehensive-async-shell.md`). A reviewer may flag one only if it hurts clarity, and that finding is gated.
- **Consistency.** A barrier follows the reviews. One triage agent merges and dedupes the findings, sorts each into auto or gated, and writes shared patterns for slide types that repeat across sections (Takeaways, Results, Summary). Every fixer follows those patterns.
- **Verify.** Per section: fixer, then a fresh re-check, then at most one fix-up round. After all sections, one deck-wide QA agent runs. Expect about 26–32 agents. That is above the default guideline of about 10, as Rey's design requires.
- **Git.** Work happens on a `review-pass` branch from `main`. After each run I commit, one commit per section. Nothing is pushed without Rey's OK, because pushing to `main` redeploys the live site.

## Units and file ownership (KIT §3)
The units are `intro` (which also owns `99-refs`), `airbnb`, `rufus`, `griffin`, `tavus` and `future`. Each unit's files are disjoint, so the six fixers run in parallel without worktrees. Each fixer edits only its own `sections/NN-*.js`, `css/sections/<id>.css`, `assets/img/<id>/` and `specs/<id>.md`.

## Step 0: main thread, after plan approval
1. Run `git checkout -b review-pass`.
2. Write `deck/qa/capture.sh <unit|all> <outdir>`. The `qa/` folder is gitignored. For each slide the script does this:
   - Opens `index.html` in session `bts-cap-<unit>` at 1920×1080.
   - Runs `Deck.go(i)` and `Deck.finishStep()`, then saves `s0`.
   - Steps through the slide with `Deck.next()` and `Deck.finishStep()`, saving `s1…sN`. N is `Deck.state().steps`. Before running it at scale, I confirm on one slide that N equals the slide's `ctx.pause()` count.
   - Saves a final-state screenshot from `?print`.
   - Writes `manifest.json`, with one record per slide: unit, slide id, heading, budgetSec, notes, step count, image paths. It gets the notes from `Deck.slides[i].def`.
   - Runs `agent-browser errors` and records the output.
3. Run `capture.sh all deck/qa/review/`. Then I spot-check a few images, including the intro agenda and the Rufus RAG slide, to confirm the capture works.

## Run 1 workflow (`review-fix-pass`)
1. **Review** (12 agents, `parallel`).
   - Agents: unit × {student, design}. Each reads `deck/qa/review/<unit>/manifest.json` and Reads every image. KIT §2 and §6 are the rubric: one idea per slide, ≤12 words of body text, type scale ≥28 px, `-t` tints, the content zone and footer position.
   - Rey's three known issues go in the prompt as examples of the severity and specificity expected.
   - Schema: `findings[]`, each with `{slideId, step, role, severity: high|med|low, category, screenshot, problem, suggestedFix, sourceEvidence?}`. Categories: overlap, clutter, spacing, legibility, weak-visual, confusing, wrong, notes-mismatch, motion.
2. **Triage** (1 agent, barrier). The agent receives all findings and returns, per unit:
   - `auto[]`: deduped findings, merged where both reviewers saw the same problem.
   - `gated[]`: each with the proposed change, a before/after description, the reason, source evidence and the slides affected.
   - `sharedPatterns`: a short spec for the Takeaways, Results and Summary slide types.

   The agent must confirm that each of Rey's three known issues is covered. If one is missing, it adds it as a finding.
3. **Fix** (`pipeline` over the 6 units, no barrier between stages).
   - **Fixer.** Works in its own `--session bts-fix-<unit>` and applies `auto[]` plus `sharedPatterns`. Rules:
     - Follow the KIT §4 gotchas (`Kit.show` for hidden elements; state + `render()`).
     - Update speaker notes so they match what's on screen. Keep one `[click]` per `ctx.pause()` and keep the length at about 135 words per minute of `budgetSec`.
     - Apply `technical-writing` and `anti-slop` to every string it changes.
     - Screenshot every step and fix until clean (KIT §9).
     - Leave gated items alone.
     - If an auto fix turns out to need a gated change, add it to `escalated[]`.
   - **Re-check.** A fresh agent that sees none of the fixer's reasoning runs `capture.sh <unit> deck/qa/recheck/<unit>/`. It gets the triage list and reports regressions, misses and new defects.
   - **Fix-up.** One more fixer round, only if the re-check found issues.
4. **QA** (1 agent).
   - Runs `capture.sh all deck/qa/final/` and rebuilds `deck/design/contact-sheet.png`.
   - Checks print mode, `agent-browser errors`, `[click]` counts against `ctx.pause()` counts, and budget sums per section against the plan (±5 s).
   - Fixes only trivial defects, and reports everything else.
5. **Returns** the gated and escalated proposals per unit, fix summaries per unit, and the QA report.

After Run 1: I commit per section, then show Rey a table of gated proposals for approval (approve, edit or reject each one).

## Run 2 workflow (`apply-approved`)
A `pipeline` over the units that have approved items. The stages are the same as Run 1's: fixer, fresh re-check, one fix-up round. A deck-wide QA agent runs at the end. Then I commit per section, and Rey decides whether to push the branch for a preview or merge to `main`.

## Verification
- `deck/qa/final/` and the contact sheet show no overlaps or clutter. The three known issues are visibly resolved, or gated with Rey's decision applied in Run 2.
- `agent-browser errors` is empty on every slide. `?print` shows the final states. Back-navigation seeks correctly on every edited slide (the QA agent steps backward through them).
- `[click]` markers match `ctx.pause()` counts, and section budgets sum to the plan's values.
- `git diff main --stat` touches only unit-owned files, unless Rey approved a gated change to a shared file.
