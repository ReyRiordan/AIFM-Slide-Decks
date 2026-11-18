# Fix pass: "Built to Sell" deck (deck/)

## Context
Rey reviewed the full deck. The main problems:
- On-screen copy, especially the headings, is cute and metaphor-heavy ("One director, two crews", "Talking to a walkie-talkie").
- The section markers ("Words", "Face") don't describe what the products do.
- The intro hook ("Last week, an AI sold you something") is out.
- Several visuals are weak: the Rufus overview icons, the tool-calling loop, the Auto Buy slide, and the static agenda image.
- The future section drifts into "whose side is the agent on".

This pass rewrites the copy, rebuilds those slides, adds real Tavus imagery and the live Vending-Bench leaderboard, and refocuses the future section on three things: capability growth, the negotiation arms race, and payment infrastructure. Rey asked for a **workflow** to run it.

## Decisions (agreed in the interview)
- **Markers:** Price · Assist · Interact · Negotiate. "Assist" covers answering, recommending, reminders and Auto Buy.
- **Heading style:** pure topic labels, sentence case, about 6 words or fewer. No metaphors, puns or teaser questions. Section tags already say which section a slide is in, so repeating "Results" or "Takeaways" across sections is fine. Body labels and subtitles get the same plain treatment. Apply `.claude/skills/technical-writing` and `.claude/skills/anti-slop` to every on-screen string and every speaker note.
- **Intro:**
  - The hook is deleted.
  - A new definition slide: automated selling is software that automates any part of the seller's job.
  - The agenda shows Price, Assist and Interact assembling, plus a muted fourth row reading only "What's next". It never previews the future angle.
  - Section 4 is introduced at the Tavus bridge.
- **Agenda visual:** a masked, three-part assembly of the salesperson image: body + price tag (Price), speech bubble (Assist), head/face (Interact). Each part slides in and locks on the click that adds its row. The base image can be regenerated freely, e.g. as three aligned layers or one image designed for clean masks.
- **Airbnb:** cut "Two models and a dial" and the current tree slide. Add three slides: **Decision trees** / **Boosting** / **Gradient boosting at Airbnb**.
- **Rufus:**
  - Overview cards get concrete mini-previews (source chips; `getDelivery(item, zip) → "Thu"`; 👍 👎) and plain card titles.
  - The evidence slide is renamed RAG, with labeled steps Retrieve → Add to prompt → Generate over the existing diagram.
  - Tool calling becomes a three-lane sequence diagram (Shopper · Model · Store software).
  - Auto Buy becomes a 6-month price line with a target; the glossy image is dropped.
  - The demo is re-recorded zoomed out, with the scroll sped up.
- **Griffin:**
  - The overview is labeled with real names: CCM (Continuous Conversational Model), Speech generator (Tavec codec), Video generator (streaming diffusion).
  - The old-pipeline slide is labeled Raven → Sparrow → LLM → TTS → Phoenix, with a note that the CCM replaces Raven, Sparrow and the LLM.
- **Tavus:** use the real Tavus logo and a founders photo (Hassaan Raza, Quinn Favret), each with a credit line. This is an explicit exception to KIT §2.6.
- **Future:**
  - Keep: Vending-Bench setup, a **new live leaderboard** slide, and the deception slide (kept as its own slide).
  - Rework: "Your customer is an agent" becomes the negotiation arms race, and personalized pricing is reframed as a seller capability.
  - Add: an **HTTP 402 / x402** infrastructure slide.
  - Cut: "Whose side is your assistant on" and "Four markets on one clock".
  - Close: the assembled recap (4 markers), then the question slide: agents selling to you, agents buying for you. How do you feel about that?

## Heading map (the builders use these exactly; the reviewer may adjust only for clarity)
| Section · slide | New heading |
|---|---|
| Intro · title | "AI for Automated Selling". Subtitle: "How AI prices, assists and interacts" |
| Intro · definition (new, replaces hook) | Automated selling |
| Intro · agenda | Agenda |
| 01 Price · problem | The pricing problem |
| 01 · tree (new) | Decision trees |
| 01 · boost (new) | Boosting |
| 01 · gbt-use (new) | Gradient boosting at Airbnb |
| 01 · loss | The loss function |
| 01 · results / takeaways | Results / Takeaways |
| 02 Assist · opener | "Amazon Rufus". Subtitle: "Amazon's shopping assistant" |
| 02 · problem / overview / demo | The problem / How Rufus works / Demo |
| 02 · rag | Retrieval-augmented generation (RAG) |
| 02 · react / dispose | Tool calling / Auto Buy |
| 02 · thumbs / trap | Learning from ratings / Optimizing for approval |
| 02 · results / takeaways | Results / Takeaways |
| 03 Interact · open | "Tavus Griffin". Subtitle: "A face generated live from one photo" |
| 03 · demo / cascade / overview | Demo / The old pipeline / Griffin architecture |
| 03 · diffusion / stream / distill | Diffusion / The streaming problem / Distillation |
| 03 · results / takeaway | User study / Takeaways |
| Tavus · origin / pivot / snapshot | Origin / Timeline / Company snapshot |
| Tavus · bridge | Statement slide introducing section 4 (no "whose side" framing) |
| 04 Negotiate · vending / leaderboard (new) | Vending-Bench / Vending-Bench leaderboard |
| 04 · cheats | Deception in Vending-Bench |
| 04 · arms race (was shift-buyers) | Agent-to-agent negotiation |
| 04 · personalized price | Personalized pricing |
| 04 · infra (new) | Payments: HTTP 402 |
| 04 · assembled / question | Summary / closing question (statement slide) |

## Budgets (the talk stays about 27 min)
- **Intro, 60 s:** title 15, definition 20, agenda 25.
- **Airbnb, 400 s** (was 390): problem 60, tree 30, boost 35, gbt-use 35, loss 120, results 75, takeaways 45.
- **Future, 225 s:** vending 22, leaderboard 30, cheats 18, arms race 40, personalized pricing 25, HTTP 402 40, summary 25, question 25.
- **Rufus, Griffin and Tavus:** keep their totals, and rebalance inside each section if needed.

## Step 0: main thread, before the workflow
1. **Re-record the Rufus demo.** Use agent-browser with Rey's Chrome profile at about 67% page zoom, asking "What do I need for cold-weather golf?" in the Alexa for Shopping panel. Crop out account details.
2. **Re-encode the clip with ffmpeg:**
   - "Thinking/Searching" at about 1.5×.
   - Product scroll at about 3×.
   - Output: `assets/capture/rufus-demo.mp4` and the poster.
   - Keep the previous clip as `rufus-demo-old.mp4` until the new one is approved.
3. **Update `deck/KIT.md`:**
   - New throughline and markers.
   - The heading style rule.
   - The Tavus image exception to §2.6.
   - Delete the "keep TITLE/LOSS unchanged" rule for headings; visuals stay.
   - The heading map and budgets above.

## Workflow (8 agents, 2 phases)
**Phase 1, Build:** six agents in parallel. Each owns its KIT §3 files and uses its own `--session bts-<unit>`, and each screenshots and fixes every build step as KIT §9 requires.
1. **intro**
   - `00-intro.js`: title subtitle, definition slide, agenda with the masked assembly.
   - Regenerate the salesperson art via gpt-image-bridge if masks need it.
   - Hand the agenda geometry to the future agent through `KIT.md`; the rows can stay at 368/518/668/818.
2. **airbnb**
   - `01-airbnb.js`: remove `pipeline` and `trees` and add tree, boost and gbt-use. The visuals are state + `render()` (the LOSS pattern).
   - "Gradient" is explained with no formula: per night, the error's direction and size are shown as arrows, and each new tree is trained to follow those arrows.
   - "Use": one model per city, price as an input that lets Airbnb ask "what if $150? $180?", and booking chance flows into the price model. This leads into the loss slide.
   - Source: Airbnb report §Deep dive 1.
3. **rufus**
   - `02-rufus.js`: overview previews, RAG labels, the tool-calling sequence diagram, and the Auto Buy price line (6 months, ≤30 min; AWS source, Self-reported).
   - Demo slide: fit the new clip's aspect ratio with `object-fit:contain`.
   - Retitle everything; the kicker becomes Assist.
4. **griffin**
   - `03-griffin.js`: real component labels on `overview` and `cascade`. Source: Griffin report lines on CCM, CVI, Raven, Sparrow and Phoenix.
   - Kicker becomes Interact; retitle everything.
5. **tavus**
   - `04-tavus.js`: fetch the logo (SVG preferred) and a founders photo from tavus.io or the press kit into `assets/img/tavus/`, with credits in `Kit.src`.
   - Origin slide: replace the name cards with the photo.
   - Logo on the section slides.
   - Rewrite `bridge` to introduce section 4.
6. **future**
   - `05-future.js`: fetch the current leaderboard from andonlabs.com/evals/vending-bench-2 and build a ranked bar chart (top ~8, with the Nov 2025 leader and the ~$63k human line as references; follow the dataviz skill).
   - Rework the arms race slide: ~2% gap, Pactum's 2,000 suppliers, suppliers running the same bot.
   - Reframe personalized pricing.
   - New 402 slide: request → 402 + price → agent pays (USDC) → retry → content; backers; ~$28k/day real volume.
   - Delete `shift-assistant` and `maturity`.
   - New summary rows and the closing question.

**Phase 2, Integrate:** two agents, run in sequence.

7. **copy + consistency reviewer**
   - Grep for stale markers (`Words`, `Face`, `Negotiator`, `talk`, "whose side") across `sections/`, `index.html` `<title>`, `presenter.html` and the takeaway chips.
   - Check every heading against the map and run anti-slop/technical-writing over all on-screen text and notes.
   - Check `[click]` counts against `ctx.pause()` and budget sums.
   - Update `99-refs.js` with new sources: the Andon leaderboard with its access date, x402/Artemis, and the Tavus image credits.
8. **QA**
   - Screenshot every step of every slide plus print mode.
   - Rebuild `qa/contact-sheet.png`.
   - Fix overflow, collisions and errors; `agent-browser errors` must be empty.
   - Report the remaining issues.

## Verification
- Open `deck/index.html` and step through the whole deck. There must be no console errors, and back-navigation must seek correctly on the rebuilt slides.
- `index.html?print` shows the final states.
- `qa/contact-sheet.png`: check that every heading follows the map, no slide shows the old markers, and the agenda assembles over 3 clicks.
- `grep -rniE "words|face|negotiator|whose side|walkie|crew" deck/sections` should return only legitimate uses.
- Budget sums match the targets above, and the `[click]` markers match the pauses.
- The Rufus demo plays zoomed out with a fast scroll; the Tavus logo and founders photo render with credits; the leaderboard values match andonlabs.com on the day of the build.
