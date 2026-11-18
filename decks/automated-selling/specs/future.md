# SPEC — 04 · Negotiate / What’s next (`sections/05-future.js`)

Rebuilt in the Nov 2026 fix pass. This file describes what is built, not what was planned.

**Files owned:** `sections/05-future.js`, `css/sections/future.css`, `assets/img/future/`, `specs/future.md`
**Section:** `id: 'future'`, `num: '04'`, `kicker: 'Negotiate'`, `title: 'What’s next'` (echoes the intro agenda’s muted fourth row)
**Color:** Future green (`--sec` `#53B754`, `--sec-t` `#84D484`). Focus accent: `--orange` / `Kit.color.orangeT`.
**Budget: 225 s.** Notes total 507 words ≈ 225 s at 135 wpm.

| # | id | heading | budgetSec | clicks |
|---|---|---|---|---|
| 1 | `vending` | Vending-Bench | 22 | 2 |
| 2 | `leaderboard` | Vending-Bench leaderboard | 30 | 2 |
| 3 | `cheats` | Deception in Vending-Bench | 18 | 2 |
| 4 | `arms-race` | Agent-to-agent negotiation | 40 | 4 |
| 5 | `pricing` | Personalized pricing | 25 | 2 |
| 6 | `payments` | Payments: HTTP 402 | 40 | 4 |
| 7 | `assembled` | *(statement, no heading)* Summary | 25 | 4 |
| 8 | `question` | *(statement, no heading)* closing question | 25 | 1 |
| | | | **225** | |

Changes from the previous build: `vending` is now setup only (its results moved to the new `leaderboard`
slide); `shift-buyers` became `arms-race`; `shift-price` became `pricing`; `shift-assistant` and `maturity`
were deleted; `payments` is new; `assembled` is now a plain Summary with the markers PRICE / ASSIST /
INTERACT / NEGOTIATE; `question` ends on "How do you feel about that?".

---

## 1 · `vending` — Vending-Bench (22 s · 2 clicks)

**One idea:** the benchmark hands a model a whole small business and grades exactly one number.

Sub-line "One vending machine. One simulated year." at (120, 290). SVG at (120, 430), 1680 × 420:
`$500` start block, an arrow, a `#353032` job panel at y 52, 880 × 300 (`finds suppliers`,
`negotiates by email`, `pays invoices`, `sets prices`), an orange arrow, and the score block
"the final bank balance".

Steps: 0 money, the panel title and four faint dots at the job positions · 1 the panel and the four
job labels · 2 the score. No empty framed box is ever on screen: the panel arrives with its content.
The score beat sets up `cheats` and calls back to Airbnb's "the objective is a choice".

Source: Andon Labs, Vending-Bench 2. Flag `Simulated benchmark`.

## 2 · `leaderboard` — Vending-Bench leaderboard (30 s · 2 clicks)

**One idea:** the models tripled in a year and are still far below a competent person.

Ranked horizontal bars, **one series, one hue** (dataviz skill): no gridlines, no legend, values
direct-labelled at the tips, recessive reference markers. Bars are rounded at the data end only
(`rx=10` plus a square `.cap` rect at the baseline).

Scale: `x = 430 + dollars × 0.0180`, so $63,000 lands at x 1564 inside the 1680-wide SVG at (120, 340).
Rows: top 60, pitch 62, bar height 40.

Live data, fetched 4 Nov 2026 from `https://andonlabs.com/evals/vending-bench-2` (top 8 of 73):

| # | Model | Final balance |
|---|---|---|
| 1 | Gemini 4 Carbon | $16,484 |
| 2 | GPT-6 Astra | $15,515 |
| 3 | GPT-6 Sol | $14,428 |
| 4 | Gemini 4 Argon | $13,718 |
| 5 | Muse Wonder Full | $12,292 |
| 6 | Claude Opus 5 | $11,182 |
| 7 | Claude Sonnet 5.5 | $11,165 |
| 8 | Claude Opus 4.7 | $10,937 |

Caps sub-line "Final balance after one simulated year" at (120, 290), so the bars carry their unit.

Reference markers: Nov 2025 leader $5,500 (Gemini 3 Pro, Sherwood) in grey; Andon's $63,000 human
estimate, labelled "a good human operator: $63,000 a year", with "the leader reaches a quarter of that".
The $63,000 rule is drawn at s0 in line grey and unlabelled, so the bars are read against the full
scale from the first beat; it turns orange and gains its labels at s2.

Steps: 0 the ranking, on the full scale · 1 the Nov 2025 marker · 2 the human marker.
**Refresh before the talk:** re-fetch the page, update `LB`, and change the access date in `Kit.src`.

## 3 · `cheats` — Deception in Vending-Bench (18 s · 3 clicks)

**One idea:** profit was the only thing scored, so the models bought profit with the tactics consumer law polices.

Sub-line "Scored only on the final balance." Two cards at y 430, 800 wide, flex columns, min-height 200:
"Lying to a supplier" / "Invented a price history", "Price-fixing with rivals" / "Joined price cartels".
Card B's sub-line says where the cartel result comes from in plain words ("when several models ran machines
side by side"), because the earlier slide said one model runs the machine alone.
The caps labels are plain words, not the negotiation jargon ANCHORING / COLLUSION.
Punchline at y 745: "Nobody asked for this. **Profit was the only score.**"
Steps: 0 the cause and card A · 1 card B · 2 the punchline.
Source: Andon Labs, Vending-Bench 2 and Arena (24 Sep 2026).

## 4 · `arms-race` — Agent-to-agent negotiation (40 s · 4 clicks)

**One idea:** when both sides send an agent, the gap between the two agents turns into money.

Two skewed nodes (BUYER AGENT, SELLER AGENT) at 36, offer (y 136) and counter (y 264) arrows, one mono
price readout at y 240 driven by a state object and a pure `renderPrice()` (KIT §4), a 28 caps label at
y 186 above it that `renderPrice()` switches between ASKING PRICE and SETTLED PRICE so the number is
never bare, a `weaker agent` pill and a `+2%` tag. At step 2 the buyer is the subject, so it is
**re-tinted red, never dimmed**; the seller drops to .7 instead. Two cards below (820 × 200 at x 120 and x 980):
"2,000 suppliers at once" (Walmart via Pactum) and "Suppliers want agents". Pactum's 3% saving is not on
screen: it is a different quantity from the 2% buyer gap and reads as a contradiction next to it.
Prices $150 → $118 → $120.40 are **illustrative** and carry the on-screen `ILLUSTRATIVE PRICES` tag.

Steps: 0 two agents · 1 they haggle · 2 the weaker agent pays 2% more · 3 Pactum today · 4 both sides automate.
Sources: Zhu et al. (2025) via Stanford HAI; Walmart and Pactum (Fox Business, Retail Dive). Flag `Pactum: self-reported`.

## 5 · `pricing` — Personalized pricing (25 s · 2 clicks)

**One idea:** a model can quote one price per shopper, and that is what the new state laws are aimed at.

Sub-line "The seller sets one price per shopper.", then a 36 px caption "Same product. Same minute." at
(120, 368) in `--text-3`. The caption is a left-aligned DOM line on the slide's text margin, not a centred
label inside the SVG. Three **identical** drawn shoppers (the figures must not
differ by object: that would argue the price gap comes from what they buy). What differs is a 28 caps line
under each naming what the seller knows: COMPARES PRICES / NEW VISITOR / ALWAYS PAYS FULL PRICE. The signals
are chosen so the direction of each price reads on first sight, with no narration.
All start at $44 and diverge to $39 / $44 / $52, each with a 28 caps rank word underneath
(LOWEST / BASE / HIGHEST) so the meaning survives without hue; only $52 takes the orange accent.
The in-figure `ILLUSTRATIVE PRICES` tag is gone — the footer ends with "Prices are illustrative."
Card `US regulation`: `Maryland: banned · 26 states: 50+ bills · FTC: policy proposed`,
at (120, 862), 1680 × 110, matching the heading and footer margin.
Steps: 0 one posted price · 1 the prices diverge and the rank words land · 2 the law.
Source: Sidley Austin (Oct 2026).

## 6 · `payments` — Payments: HTTP 402 (40 s · 4 clicks)

**One idea:** there is already a payment handshake built for software buyers, and almost nobody uses it.

Two-lane sequence diagram (BUYER'S AGENT, SELLER'S SERVER) at (120, 300), 1680 × 530, lifelines 70 → 500,
five messages on an even 90 px pitch (y 110 / 200 / 290 / 380 / 470), all five mono because mono means
"what is on the wire": `GET /article` → `402 Payment Required · $0.10` → `POST /pay $0.10 USDC` →
`GET /article again` → `200 OK, here is the article`. USDC is glossed once, by a 28 px
"a digital dollar" right-aligned to the end of USDC, 30 px under that wire label.
Each line colour has its own arrow marker (sky / green / orange), so no arrowhead disagrees with its line.
Card at (120, 830), 1680 × 140, flex row: `$28,000 a day` and "all x402 payments, 3 Nov 2026" on the
left, `6 MAJOR BACKERS` on the right. The six names live in the `Kit.src` footer.

Steps: 0 the request · 1 the 402 · 2 pay and retry · 3 the content · 4 volume and backers.
Sources: Artemis x402 dashboard (3 Nov 2026); x402 Foundation (14 Jul 2026, 40 members). $0.10 is illustrative;
the measured average is near ten cents. Card-network rails (Visa Intelligent Commerce, Mastercard Agent Pay)
are mentioned in the speaker notes only.

## 7 · `assembled` — Summary (25 s · 4 clicks)

Statement slide, no engine heading. Caps line "Summary", then four rows:

Each row is three elements: colour chip, caps word, one sub-line. There is no mono index.

| Row | Label | Sub |
|---|---|---|
| 01 red | PRICE | learned what price would book |
| 02 blue | ASSIST | looks things up before answering |
| 03 purple | INTERACT | makes a face fast enough to talk |
| 04 green | NEGOTIATE | both sides are software |

The sub-lines are plain words a student can follow; the technical names stay in the speaker notes.

**Geometry is the intro agenda's, copied, not re-derived** (`specs/intro.md` § "Motif definition for reuse"):
`ROW_Y = 368 / 518 / 668 / 818`, chip (130, rowY) 72 × 38 radius 10 skewed −12°, label `t-h2` italic 850
stretch 115% at x 232 top rowY − 14, sub `t-label` at x 232 top rowY + 48 (moved left from x 330 when the
mono index was cut, which buys the nowrap sub-lines ~100 px of clear width).
Background `assets/img/salesperson-assembled.jpg`, `right 6% / cover`, opacity .42 → 1 on the last click.
Scrim: solid to 50 %, zero at 74 %, so every sub-line sits on flat background.
If the intro moves a constant, move it here too.

## 8 · `question` — the close (25 s · 1 click)

Statement slide over `assets/img/future/two-agents.jpg`.
Lines: "An agent sells to you." / "Your agent buys for you." then, in orange, "How do you feel" / "about that?"
Setup boxes are 1240 wide at x 150, so the longest line keeps ~10 % spare. Scrim: solid to 60 %,
zero at 84 %, so the whole left column is on flat colour and no glyph lands on the ghost bust's face.
Footer line: the five names and "references follow", so `99-refs.js` must follow this section.
**No ambient drift.** The slide holds through Q&A, so a still image is the right state; a loop would
move the bust under the text for the whole of it.

---

## Verification

Screenshots of every build step: `qa/future/<id>-s<k>.png` (build) and `qa/fix/future-r3/future/`
(Nov 2026 review fix pass, via `qa/capture.py`). `agent-browser errors`
is empty, print mode (`index.html?print`) shows every final state, and back-navigation re-seeks the
`arms-race` price readout correctly.

## Deliberately cut

Project Vend; MakeMePay, Persuade Me If You Can and Magentic Marketplace (three more studies saying what the
2% figure says); market-size forecasts; the EU microtransactions market and the Digital Fairness Act; sponsored
agents inside assistants; fiduciary buyer agents; the x402 chargeback, salami-overcharging and replay risks;
the 100 m transactions meme-coin correction; Gartner's 10-to-1 and 17% figures; agent-run shops.
