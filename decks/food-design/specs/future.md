# Spec: section 05 · Next · Future (v2, two directions)

**Owner files:** `sections/05-future.js`, `css/sections/future.css`, `assets/img/future/`, `specs/future.md`
**Budget:** **225 s** = 20 (`question`) + 45 (`personal`) + 35 (`tailor`) + 45 (`backup`) + 35 (`library`) + 45 (`summary`)
**Section color:** `plum` (`--sec` `#7E4E6B`, `--sec-t` `#C99BB7`). Focus accent: `rust`.
**Kicker:** `Next`. Section title: `Future`.
**Sources:** `sources/future-directions.md` (the two directions, examples, first markets) and `sources/formulation-report.md` (numbers: date composition, Medicaid result, cocoa prices, EU rule, cocoa's four roles, ChoViva, palm land use). `sources/future-markets.md` is no longer used by this section.
**Replaces:** v1 `forces`, `engine`, `parity`, `avoid`. GLP-1, dye rules, parity testing and robot chefs leave the deck. `summary` is kept and updated.

This section teaches no new technique. It **leads with the problem** and hints at AI only by pointing back to what the deck taught: Giuseppe's search loop and Samsung's rules-as-filters. No roadmap, no crumbs. `99-refs.js` follows it.

House rules as in the restyle: stroke weight is hierarchy, hatched focal boxes, teaching doodles only, no source text on slides.

---

## Story spine (approve before building)

1. **The question.** NotCo's bridge asked who else needs the engine. Answer: anyone asking "can we change what goes into a food and keep what people love?" Two markets open from that question.
2. **For one person.** Someone's favourite cocoa bar has to fit a care plan. Swapping an ingredient is never a simple swap: date purée cuts less sugar than you'd think and adds water, which softens the snap and shortens shelf life.
3. **AI hint, personal.** Giuseppe's loop, aimed at one person: their bar is the target, the care plan is a hard filter, and each tasting teaches the next round. First buyers: medically tailored meal providers.
4. **For a factory.** Cocoa prices swing hard and a new EU deforestation rule arrives on 30 Dec 2026. Cocoa in a coating does four jobs at once, so replacing it means replacing all four.
5. **AI hint, backups.** Search for substitutes role by role and qualify them *before* the shock. And let the search answer "keep the ingredient, change the source": swapping palm oil can use more land.
6. **Close.** One row per marker carrying the throughline, then the room's question.

## Slides

| # | id | heading | budgetSec | pauses |
|---|---|---|---|---|
| 1 | `question` | (none: statement slide) | 20 | 2 |
| 2 | `personal` | Personalized food | 45 | 3 |
| 3 | `tailor` | Personalized recipe search | 35 | 3 |
| 4 | `backup` | Supply shocks | 45 | 3 |
| 5 | `library` | Backup formulas | 35 | 3 |
| 6 | `summary` | Summary | 45 | 5 |
| | | | **225** | **19** |

```js
Deck.section({ id: 'future', order: 5, num: '05', kicker: 'Next', title: 'Future',
               color: 'plum', slides: [ QUESTION, PERSONAL, TAILOR, BACKUP, LIBRARY, SUMMARY ] });
```

**Generated images (gpt-image-bridge, photoreal on slate, warm side light, no text or branding).**
- `cocoa-bar.webp`: a dark chocolate bar snapped in two, cut-out with transparent background.
- `dates.webp`: three Medjool dates and a small dish of date purée, cut-out.
- `biscuit.webp`: a chocolate-coated biscuit with one bite out, cut-out.
- `palm.webp` + `sunflower.webp`: a small pile of palm fruit; roasted sunflower seeds. Cut-outs.
- `close-table.jpg` stays for `summary`. Delete `candy.webp` if nothing else uses it.

---

## 1 · `question` · 20 s · statement slide
**The one idea:** both futures start from one question.
**On screen.** Centre, Fraunces `t-h1`: `Change what's in it.` then, on click, `Keep what people love.` in `--rust-t`. Below on click 2, two plum tags: `for one person` · `for a factory`.
**Build.** Entrance: line 1. `[click]` 1: line 2 with an underline doodle. `[click]` 2: the two tags.
**Spoken only.** NotCo asked who else needs the engine. Anyone who has to change a recipe without losing the people who buy it. That opens two markets: food fitted to one person's needs, and formulas that survive supply shocks. In both, AI helps decide which recipes are worth making and testing.
**Source.** `future-directions.md` intro paragraph.

## 2 · `personal` · 45 s · "Personalized food"
**The one idea:** fitting a food to one person means changing it, and no swap changes only one thing.
**On screen.** Left: `cocoa-bar.webp` dropped, with three Caveat labels drawn to it: `cocoa aroma` · `snap` · `smooth melt` (what to keep). A plum card `CARE PLAN` with `carbs per serving` and `no peanuts`. Right: a swap equation in mono: `−10 g sugar  +10 g date purée`, then two result rows: `sugar  −3.4 g` (only) and `water  +2.1 g` (rust), with consequences `softer snap` · `shorter shelf life`.
**Build.** Entrance: the bar drops; the three keep-labels draw on. `[click]` 1: the care-plan card. `[click]` 2: `dates.webp` drops and the swap equation lands. `[click]` 3: the two result rows count in; rust loop round `+2.1 g water`, and the two consequence labels appear.
**Spoken only.** A person picks a food they love and names what must stay. Their care team sets limits. Dates look like the obvious sugar swap, but dates are two-thirds sugar themselves: per 100 grams, 66.5 grams of sugars and 21 grams of water. Replace 10 grams of sugar with 10 grams of purée and you remove only about 3.4 grams of sugar, and add about 2 grams of water. That water softens the snap and shortens shelf life. One change, three problems. For diabetes, the check is total carbohydrate against the care plan, not "contains dates".
**Source.** `future-directions.md` §1 and the cocoa-bar example; `formulation-report.md` "Why dates are not a simple swap" (USDA: 66.5 g sugars, 21.3 g water per 100 g; −3.4 g sugar, +2.1 g water).

## 3 · `tailor` · 35 s · "Personalized recipe search"
**The one idea:** the same search loop as Giuseppe, with one person's favourite as the target and their care plan as a filter.
**On screen.** Left: a small four-step loop in cream (`propose` → `check plan` → `taste` → `learn`), with `check plan` in rust heavy (a filter, as on Samsung's `rank`) and `your bar` as the target in the centre. Small saffron tag `Mix` and teal tag `Cook` beside the matching parts (the deck callback). Right: a plum card `FIRST BUYERS` / `medically tailored meals`, and a number `31%` / `fewer hospital stays` with a `--text-3` line `Massachusetts Medicaid`.
**Build.** Entrance: the loop draws on with its labels. `[click]` 1: the target `your bar` and the callback tags; Caveat `like Giuseppe, aimed at you`. `[click]` 2: the rust filter on `check plan`; Caveat `a rule, not a score`. `[click]` 3: the buyer card and `31%` counts in.
**Spoken only.** The AI ranks candidate recipes using ingredient properties and earlier tastings. Every candidate already passes the care plan, the way Samsung's allergy filter can't be outscored. Blind tastings measure how close each candidate is to the original, and the results feed the next round. Start where someone already pays: Massachusetts Medicaid members who got medically tailored meals had 31 percent fewer hospitalisations. Funding is fragile, though: North Carolina suspended its programme in 2025. Bodies differ too: in one study of 800 people, the same meal gave very different blood-sugar responses, which is why this would learn per person. Microbiome data stays optional.
**Source.** `future-directions.md` §1 "What the AI does", "First market"; `formulation-report.md` Market 1 (31% fewer hospitalisations [CT Mirror/Stateline], NC suspension, Zeevi 800 people, microbiome optional).

## 4 · `backup` · 45 s · "Supply shocks"
**The one idea:** a key ingredient can fail suddenly, and replacing it means replacing every job it does.
**On screen.** Top band: a rough price line for cocoa, rising to a peak labelled `$12,000+ / t` (Dec 2024) then falling `~70%`, with a rust marker `EU forest rule · 30 Dec 2026`. Below: `biscuit.webp` dropped; four role chips around the coating: `fat: snap + melt` · `roasted aroma` · `colour + bitterness` · `coating flow`.
**Build.** Entrance: the empty axis. `[click]` 1: the price line draws (rise, then fall) with its two labels; Caveat `both ways, fast`. `[click]` 2: the EU marker. `[click]` 3: the biscuit drops and the four role chips draw out from the coating; heading line under them `cocoa does four jobs`.
**Spoken only.** Cocoa futures topped 12,000 dollars a tonne in December 2024, then fell about 70 percent. A manufacturer needs to move both ways, fast. From the end of December 2026, the EU deforestation rule applies to large and medium companies, and cocoa farming has been linked to forest loss in Côte d'Ivoire and Ghana. But you can't just swap cocoa out. In a coating, cocoa sets the snap and melt, gives the roasted aroma, sets colour and bitterness, and changes how the coating flows on the line. A substitute has to pass all four.
**Source.** `formulation-report.md` "Why now" (>$12,000/t, ~70% fall; EUDR 30 Dec 2026) and Market 2 step 3 (four roles); `future-directions.md` §2 Example 1 (forest loss).

## 5 · `library` · 35 s · "Backup formulas"
**The one idea:** search for substitutes before the shock, and let the search say "keep it, change the source".
**On screen.** Left half: a shelf of three backup-formula cards, each with a check row `taste · shelf life · line · label`; one card fills with teal checks. A plum tag `ChoViva · sunflower seeds` with `Nestlé, 2026`. Right half: two cut-outs, `palm.webp` and `sunflower.webp`, with a land bar under each: palm short, the alternative more than twice as long. Rust Caveat answer: `keep palm, change the source`.
**Build.** Entrance: three empty backup cards. `[click]` 1: one card's checks fill one by one; Caveat `tested before it's needed`. `[click]` 2: the ChoViva tag. `[click]` 3: the palm comparison; the land bars grow; the rust answer lands with an underline.
**Spoken only.** The AI ranks alternatives on taste, texture, line performance, cost, sourcing and deforestation risk, role by role, the way Giuseppe scored a candidate against milk. The best few are tested while there's still time, and a formula enters the library only after tasting, shelf-life, production-line and labelling checks. This works commercially: Planet A Foods makes a sunflower-seed cocoa alternative, raised 30 million dollars to scale it, and Nestlé Germany launched a product line with it in April 2026. Now the twist. Oil palm gives more than twice the oil per hectare of soy or rapeseed, so swapping it out can use more land. Making palm deforestation-free would cut its emissions by 92 percent. So the right answer can be "keep palm, change the source", and the software has to be allowed to say so. First buyers: mid-sized manufacturers, for their most exposed products.
**Source.** `future-directions.md` §2 and "First market"; `formulation-report.md` Example 1 (Planet A $30M, Nestlé Germany April 2026), Example 2 (>2× oil per hectare; 92%). Land-bar lengths are illustrative of the ">2×" ratio.

## 6 · `summary` · 45 s · "Summary" (deck close, kept)
Keep the v1 build (agenda-geometry rows, close-table photo, `A model chose what's in it.` / `Would you notice?`). Changes:
- Row 01: kicker `Cook`, text `a kitchen` + ` becomes a graph` (was `Read` · `a recipe card becomes a typed record`).
- Notes: drop the parity and taste-model lines; the limits sentence becomes "the camera can't see salt, the protein search only finds what's near something that works, and every swap still needs a human tasting." The close ties back to `question`: "both futures end the same way: something people choose again."

---

## Cross-section hooks
**Assumed:** Giuseppe's loop and scoring (`tailor`, `library`); Samsung's hard filter (`tailor`); NotCo's bridge question (`question` answers it).
**Set up for:** nothing; `99-refs.js` follows. Update its Next column with the citations above and drop GLP-1, dyes, parity and robot-chef references.

## Deliberately cut
| Cut | Why |
|---|---|
| Five forces, GLP-1, dyes, tariffs | Rey: replace with the two directions |
| Parity testing, robot chefs | Same |
| Sensory foundation model, self-driving labs, digital eater | Technical "dream big" material; the brief is problem-first |
| Bayesian optimisation, Pareto fronts by name | Hinted through Giuseppe's loop; no new vocabulary |
| 3D printing | One spoken mention at most |

## Checklist
- [ ] Headings: (statement), Personalized food, Personalized recipe search, Supply shocks, Backup formulas, Summary.
- [ ] No roadmap or crumbs. No source text on slides.
- [ ] Every number traces to `future-directions.md` or `formulation-report.md`: 66.5 g, 3.4 g, 2.1 g, 31%, $12,000+, ~70%, 30 Dec 2026, $30M, 2×, 92%.
- [ ] `[click]` = `ctx.pause()`: 2 / 3 / 3 / 3 / 3 / 5.
- [ ] `budgetSec` sums to 225; notes ≈ 135 wpm (≈ 505 words).
- [ ] CSS scoped under `.slide[data-sec="future"]`; v1 CSS for removed slides deleted.
- [ ] Every build step captured at 1920×1080; `agent-browser errors` empty.

## Copy pass (Nov 2026, Rey: "simpler, clearer, straight to the point")
Headings: Personalized food · Personalized recipe search · Supply shocks · Backup formulas. Statement slide: `Change the recipe. / Keep the taste.` Callouts made literal: `hard filter`, `Giuseppe’s loop, your target`, `prices swing`, `EU forest law`, `Pre-tested backups`, `Land per tonne of oil`, `or keep palm, buy deforestation-free`.
