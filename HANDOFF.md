# Handoff: how we build lecture decks

Read this first in any session that starts or works on a deck. It covers how to start a deck, the process, what Rey corrected while we built deck 1, and the tools.
The builder rules (slide API, type scale, text rules, QA) are in `template/KIT.md`. Every deck has its own copy of that file.

Deck 1, "AI for Automated Selling", is archived in `decks/automated-selling/`. It ran Nov 4–17, 2026, over 8 sessions. Its plans are in `decks/automated-selling/plans/`.

## 1. Start a new deck
1. Copy the template: `cp -r template decks/<name>`. Use a short kebab-case name.
2. Put the research reports in `decks/<name>/sources/`, one Markdown file per product or topic.
3. Run `/grill-me` to settle the topic and the products. It also settles the section markers, the time budgets, the palette, and which real images (logos, photos) Rey approves.
4. Save the approved plan as `decks/<name>/plans/01-plan.md`. It holds the sections, the beats, the budgets and the heading map.
5. Write the **story spine** for each section in `specs/<id>.md`, using `specs/_section-template.md`, and get Rey's approval (gate 1).
6. Set the palette in `css/theme.css` and `design/style-prefix.txt`, and the section `color` values in each `Deck.section`.
7. Build the title slide and the hardest content slide by hand, and get Rey's approval (gate 2).
8. Run the multi-agent build (section 2, step 5).
9. Add a CLAUDE.md row for the new deck if anything about it differs from the template.

Delete `sections/01-example.js` and `css/sections/example.css` once the real sections exist, and remove their lines from `index.html`.

## 2. Process
Each numbered step ends at a gate or a commit. Rey approves the plan of every multi-agent workflow before it runs, including the number of agents.

1. **Interview** with `/grill-me`. Ask one question at a time, with a recommended answer.
2. **Research reports** in `sources/`. They are the only allowed source of facts.
3. **Story spine and heading map** (gate 1). This step was missing in deck 1. The slides came first and the story was repaired on day 13. Settle the problem, why the technique fits, the N steps, the results and the 2-3 takeaways before anyone draws a slide.
4. **Design kit and 2 approval slides** (gate 2): one title slide and one hard teaching slide, screenshotted at every build step.
5. **Multi-agent build.** One agent per section, each owning disjoint files (KIT §4), so they run in parallel without worktrees. Each agent uses its own `--session` and screenshots and fixes every build step (KIT §11).
6. **Review run.** It is the deck 1 plan `plans/03-review-pass.md`, and it worked well:
   - `tools/capture.py all qa/review/` once. Every reviewer reads the same screenshots.
   - Two reviewers per section: a **student** with no ML background, who flags anything confusing or wrong, and a **design** reviewer, who flags clutter, overlaps and weak visuals.
   - One triage agent merges the findings and sorts them into **auto** and **gated**. It also writes shared patterns for the repeated slide types.
   - Per section: a fixer, then a fresh re-checker that sees none of the fixer's reasoning, then at most one fix-up. A deck-wide QA agent runs last.
   - Gated items go to Rey as a table: approve, edit or reject. Narrow it down to what needs his attention.
7. **Rey edits the script** in the script editor (section 5). Change the slides to match his notes.
8. **Final QA, PDF export, and push** to deploy.

**Gated changes** go to Rey before anyone makes them: any change to a claim, a fact or a teaching point; adding, removing, reordering or merging slides; changing a diagram's concept; budget shifts over about 10 s; any change to a shared file (`engine.js`, `kit.js`, `theme.css`, `components.css`, `index.html`, `presenter.html`). Layout, spacing, overlaps, decluttering, label wording and animation timing are **auto**.

**Git.** Work on a branch and commit one section per commit. Merge to `main` only when Rey says so. Push only when Rey asks, because pushing `main` redeploys the live site.

## 3. Lessons from deck 1
These come from Rey's corrections across the 8 sessions. The first six came up more than once.

1. **Takeaways get cluttered.** Raised on Nov 4, Nov 5 and Nov 17. The fix: exactly 2 rows, one line each, in one shared format. Each row is a lesson that transfers beyond the product: when to use the technique, and what it is good or bad at. On Nov 17 every section's third takeaway was cut, and the remaining rows were moved so no large empty area was left.
2. **The ML story must follow the problem.** Rey on Nov 17: "the script and content are completely disconnected from the problem framing and key takeaways. We just jump straight into decision trees with no reasoning about why." The fix was a roadmap slide after each problem slide and `Kit.withCrumbs` on every technique slide. Define each term ("gradient", "boosted") and make a multi-model structure explicit. Rey asked "what are the two settings specifically?" because the slide didn't say.
3. **Overlaps and empty space.** The intro "Assist" label overlapped other text. One slide had an empty right half, and a headline ran into an image. Screenshot every build step and `Read` the screenshots.
4. **Headings and markers.** Rey called the first round of titles "yucky" and asked for "simple, boring, clear, direct". The headings became plain topic labels. The markers changed twice, from Price · Words · Face to Price · Assist · Interact · Negotiate+, because each marker had to cover everything its section does.
5. **Cut what can't be taught in the time.** Deck 1 cut the fairness twist, the "whose side is your agent on" angle, the third distillation stage and the HTTP 402 slide. If a concept needs more than its slide's budget to explain, cut it.
6. **Visuals must mean something.** The symbols on the Rufus overview and a circular diagram were "kinda bad". The first RAG slide was "overwhelming". Label real component names (CCM, Tavec, Raven, Sparrow, Phoenix), use concrete mini-previews, and reveal reasons one per click.
7. **Rey checks the technical details.** He caught that a live delivery API is a tool call, not retrieval (RAG). He asked how diffusion uses the conversation model's input, and what "plausibility grading" means. Get each mechanism exactly right, and use current data where it exists (the live Vending-Bench leaderboard).
8. **Put the demo first** in a section when there is one. "Demo first is easiest and most engaging."
9. **Easy to understand beats visually stunning.** Animation has to show something. The agenda assembly moves because a static image didn't connect the parts.
10. **Rey owns the script.** "You can adjust the slide, no need on the script." Don't rewrite his notes unless he asks.
11. **The intro stays short.** The hook ("Last week, an AI sold you something") was deleted. The definition slide was merged into the agenda because the two were redundant.

## 4. Content rules
KIT §2, §3 and §7 have the full list. In short:
- One idea per slide, ≤ ~12 words of body text, no prose bullets.
- Headings: plain topic labels, sentence case, ≤ ~6 words.
- Every number has a `Kit.src` footer. Self-reported results are flagged. Illustrative values are marked.
- At most one equation in the talk.
- Each section: problem → roadmap → technique slides with crumbs → results → 2 takeaways.
- Notes: about 135 words per minute, and one `[click]` per `ctx.pause()`.
- All text follows `.claude/skills/technical-writing` and `.claude/skills/anti-slop`.

## 5. Tools
Every deck folder has the same `tools/`.

**Script editor.** Run `python3 decks/<name>/tools/script-editor.py`, then open `http://localhost:8765/tools/editor.html` (it opens automatically; set `PORT` to change the port).
- The live slide is on the left and its notes are on the right. Each `[click]` starts a new paragraph, and stepping the slide moves the cursor to the matching paragraph.
- It shows the word count against the slide's budget at 135 wpm, and the `[click]` count against the slide's clicks.
- It autosaves 1.5 s after typing stops, and `⌘S` saves. Saving rewrites the `notes` string in `sections/NN-*.js` and checks the round trip before it writes.
- If the notes changed on disk since the editor loaded them, the save is refused as a conflict. Agents must not edit notes while Rey's editor tab is open.
- Rey asked for it on Nov 17: "is there any way where I can have the script in an easy to edit manner and corresponding slide view up in front of me at the same time?"

**Capture.** `python3 decks/<name>/tools/capture.py <unit|all> <outdir>` screenshots every build step of every slide (`<id>-s<k>.png`), the print state (`<id>-print.png`) and a `manifest.json` with headings, budgets, notes and console errors. It reads the units from the deck. Write output under the deck's `qa/` folder, which git ignores. Build `design/contact-sheet.png` from the print screenshots with PIL.

**Presenting.** Open `index.html`. → / Space next, ← back, **P** presenter window (notes, timer, next slide), **F** fullscreen, **B** blackout. `#/<section>/<slideId>` jumps to a slide.

**PDF.** Open `index.html?print` in Chrome and print to PDF. The `@page` rule makes each slide a 1920×1080 page in its final state.

**Images.** Use gpt-image-bridge with `design/style-prefix.txt` (KIT §9). Regenerate until the image is good, then convert to JPEG.

**Demo captures.** Deck 1 recorded the Rufus demo by driving Rey's logged-in Chrome with agent-browser at about 67% page zoom, cropped out the account details, and then used ffmpeg to play the waiting at about 1.5× and the scrolling at about 3×. A live demo (Griffin) gets a big launch button that opens in a new tab, with a credited backup clip.

## 6. Hosting
Deck 1's Vercel project served `deck/`, which no longer exists, so its next deploy fails and the last good deploy stays up. Delete that project in the Vercel dashboard when it's no longer needed.

To host a new deck:
1. In Vercel, add a new project from the GitHub repo.
2. Set **Root Directory** to `decks/<name>`. Framework: Other. No build command.
3. To skip deploys when another deck changes, set **Ignored Build Step** to `git diff HEAD^ HEAD --quiet -- .`.

Each deck's `.vercelignore` keeps `KIT.md`, `specs/`, `design/`, `plans/`, `sources/`, `qa/` and `tools/` off the public site. Pushing `main` redeploys. Asset paths are case-sensitive on the host.

## 7. Deck 1 slides worth copying
All in `decks/automated-selling/sections/`:
- `01-airbnb.js` `loss`: the full state + `render()` pattern, with a draggable price, a zone that moves when the outcome flips, and the one equation revealed last.
- `01-airbnb.js` `approach`: the roadmap, and `Kit.withCrumbs` on the technique slides after it.
- `01-airbnb.js` `boost`: a technique explained with no formula, one tree per click.
- `02-rufus.js` `react`: a three-lane sequence diagram (Shopper · Model · Store software).
- `02-rufus.js` `rag`: labeled steps (Retrieve → Add to prompt → Generate) over one diagram.
- `03-griffin.js` `diffusion`: a generated portrait with real noise added in code, played in reverse.
- `05-future.js` `leaderboard`: a ranked bar chart with a human reference line.
- `00-intro.js` `agenda`: three masked cut-outs of one image that lock in one per click.
- Any section's `takeaways`: the 2-row pattern.

## 8. Pitfalls
- `tl.from()` and `Kit.rise()` on an element hidden with `gsap.set(…, {autoAlpha:0})` animate from 0 to 0, so the element never appears. Use `Kit.show()`.
- Filenames are case-sensitive on Vercel and not on macOS. A wrong case works locally and breaks online.
- The script editor first failed because of a relative path. Run it with the path to the script, from any folder.
- Two writers on the same notes conflict. If you change notes while Rey's editor tab is open, his next save is refused, and his edits are at risk.
- The right-hand column of a slide can run into the source footer. Keep the content zone (y 268 → 990) and check the print state.
- Pushing `main` deploys. Ask before pushing.
