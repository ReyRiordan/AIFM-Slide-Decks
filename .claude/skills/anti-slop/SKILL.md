---
name: anti-slop
description: Catalog of AI-writing patterns to cut from any prose.
---

# Anti-slop

This skill lists the patterns that make prose read machine-written and says how to fix each. In the repo, `technical-writing` owns how sentences are written, and this catalog runs under it. On prose that goes outside the team, also give it a voice: have a view, vary sentence length, and say something specific.

## 1. Removal first

Before you add a word, decide what leaves: superseded text, a fact restated from its home, a rule a script already enforces, a dead reference, a section, a file. The draft is what survives plus what nothing removed covers.

## 2. Regenerate, don't patch

To rewrite a section, drop its old outline and write it again from what the reader needs. Old headings and old sentences pull the new text toward the superseded version. If the rewrite shares most of its phrasing with the old one, it was patched.

Leave an unchanged sentence alone. Rewording it costs the reader a second read for nothing.

## 3. Patterns

Fix each one where you find it. The examples show the shape. The lists are not complete.

1. **Puffery.** "pivotal moment", "testament to", "evolving landscape", "setting the stage for". State what happened.
2. **Superficial "-ing" phrases.** "..., highlighting its value", "ensuring reliability", "showcasing". Delete, or make it a sentence with a fact.
3. **Promotional language.** "vibrant", "groundbreaking", "renowned", "stunning". Describe it neutrally.
4. **Vague attributions.** "Experts believe", "Industry reports suggest". Name the source or delete.
5. **Formulaic challenges.** "Despite challenges, it continues to thrive." Give the specific fact.
6. **AI vocabulary.** Additionally, crucial, delve, enhance, fostering, garner, interplay, intricate, pivotal, showcase, underscore. Use the plain word (sections 4 and 5).
7. **Fancy "is".** "serves as", "stands as" become "is". "boasts", "features" become "has".
8. **"Not just X, but Y."** State Y. Negate only what the reader would otherwise assume. "Minted at creation" needs no "never lazily backfilled". Where the reader's default runs the other way, state the rule positively: "`isAdmin` is set only by the admin path."
9. **Rule of three.** Three items because three sounds complete. Use the real count.
10. **Synonym cycling.** "the gate", "the check", "the guard" for one thing. Pick one name and repeat it.
11. **False ranges.** "from setup to scale" where the ends aren't on one scale. List the topics.
12. **Boldface overuse.** Bold names a term or opens a list item. Don't bold every proper noun.
13. **Inline-header lists.** "**Performance:** Performance improved..." restates its label. Write it as prose. A bold lead-in that names the item and is followed by new detail is fine.
14. **Chatbot phrases.** "I hope this helps!", "Certainly!", "Let me know if...". Delete.
15. **Cutoff disclaimers.** "While specific details are limited...". Find the source or delete.
16. **Sycophancy.** "Great question! You're absolutely right!" Answer directly.
17. **Filler phrases.** "In order to" becomes "to". "Due to the fact that" becomes "because". "It is important to note that" goes. "We would love to show you a demo" becomes "Can we show you a demo?"
18. **Excessive hedging.** "could potentially be argued that it might" becomes "may".
19. **Generic conclusions.** "The future looks bright." State the plan or the fact, or end.
20. **Abstract metaphor nouns.** Use the concrete word:
    - substrate: base
    - wedge in: add
    - vector: way, method
    - gold-plating: more than the job needs
    - ratchet: the mechanism's real name, or "a limit that only tightens"
    - evacuate (code): move out
    - endgame: the last phase
    - surface, nexus, locus, north star, flywheel, scaffolding, paradigm: the thing they stand for

## 4. Word tiers

- **Tier 1, replace on sight:** delve, tapestry, leverage, robust, seamless, empower, unlock, streamline, navigate (abstract), realm, myriad, trajectory, crucially, notably.
- **Tier 2, academic filler, use the plainer word:** framework, intricacies, confluence, embodiment, boundless.
- **Tier 3, corporate filler, name what it does:** best-in-class, end-to-end, low-hanging fruit, bandwidth, operationalize, ecosystem. "Learnings" becomes "lessons".
- **Tier 4, auxiliary stacks, use the finite verb:** "can help reduce" becomes "reduces". Also "will be able to", "is designed to", "allows you to".

## 5. Plain speech

- **Say what it does, not how it feels.** "SQL you can read" names a feeling. "`.toSQL()` returns the exact string sent to the database" names the mechanism. If you can't restate a sentence as an instruction, a fact, or a number, cut it. If it could appear unchanged in another project's docs, it says nothing about this one.
- **Split dense sentences.** If the reader has to backtrack to parse one, break it in two or drop a clause.
- **Active voice.** Name the actor: "queries are validated" becomes "the compiler validates queries". Passive is fine when the actor is unknown or beside the point.
- **Cut adverbs.** "runs quickly" becomes the number. "significantly improves" becomes the measured change. An adverb propping up a verb means the verb is wrong.
- **The plain word.** "utilize" becomes "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if".

## 6. Marks

- Sentence-case headings.
- Straight quotes, not curly ones.
- No decorative emoji in headings, bullets, or prose.

## 7. Sources inline

Put each source where its claim is stated, never only in a list at the end. Link a web source on the words it supports. Cite anything else on the same clause, by author or key and section. Cite a source behind several sentences once, at its first claim.
