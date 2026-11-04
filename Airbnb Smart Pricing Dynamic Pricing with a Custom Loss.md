# Airbnb Smart Pricing: Dynamic Pricing with a Custom Loss

Nov 4, 2026 · @Rey Riordan

## Summary

Airbnb Smart Pricing is the best real-world case for teaching how to design a loss function when the true target can never be observed. Airbnb wants the "optimal" price for every listing-night, but it only ever sees whether a night booked at the price the host actually charged ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

The system has three stages: a gradient-boosted classifier predicts booking probability, a regression "strategy model" turns that into a price using a custom loss, and a personalisation layer adjusts the result ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing)). The custom loss is the intellectual core. It converts one-sided evidence ("this night did not book at $150, so $150 was too high") into an interval of acceptable prices, and penalises suggestions that fall outside it ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

The textbook approach failed first. Airbnb tried estimating a demand curve and maximising price × demand, but online A/B tests showed this often did not raise host revenue ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). That failure is what motivated the custom loss.

The case also has an independent outcome study. A 2021 *Marketing Science* paper found adopters' nightly rates fell 5.7% while daily revenue rose 8.6%. Among adopters, the Black–white host revenue gap shrank by more than 71%, but because Black hosts adopted far less, the overall gap grew ([7](https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Algorithm-Meant-to-Eliminate-Racial-Disparities-in-Airbnb-Revenue-Fails-to-Enhance-Revenue-Equality)).

**What students should take away:** learning from censored, partial feedback; designing a loss and offline metrics without ground truth; why predict-then-optimise can fail; how gradient boosted trees work; and why a race-blind model is not automatically fair.

*A note on sources.* The KDD 2018 paper ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing)) sits behind the ACM Digital Library. Where this report describes its internals, it cites Adrian Colyer's detailed walkthrough of the paper ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)), which reproduces its equations and figures. Numbers in brackets link to the References section.

## What it is

Smart Pricing is one of two host tools built on the same pricing engine; the other is Price Tips ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The key design constraint is that hosts, not Airbnb, stay in control of the final price ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

| Tool | What the host sees | Who sets the final price | Introduced |
| --- | --- | --- | --- |
| Price Tips | A calendar showing the predicted chance each night books at the host's current price; clicking a night shows more detail and a suggested price ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) | The host, who may accept or ignore each tip | Daily, dynamic tips from June 2015 ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)) |
| Smart Pricing | A toggle plus a minimum and a maximum price ([5](https://www.travelpulse.com/news/technology/airbnb-aims-to-make-hosting-easier-boost-revenue-with-smart-pricing)) | Airbnb's suggestion, applied automatically to every available night if it falls within the host's range ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) | Announced November 2015 at the Airbnb Open in Paris ([5](https://www.travelpulse.com/news/technology/airbnb-aims-to-make-hosting-easier-boost-revenue-with-smart-pricing)) |

**How it looks today.** Airbnb's current Help Centre page says Smart Pricing uses hundreds of factors about the listing and its area to move the nightly price with demand, inside a range the host sets ([6](https://www.airbnb.ca/help/article/1168)). Hosts can override any night with a custom price without turning the feature off ([6](https://www.airbnb.ca/help/article/1168)). Some settings interact with it in ways that matter for students thinking about system boundaries ([6](https://www.airbnb.ca/help/article/1168)):

- Discounts such as early-bird offers can push the price a guest pays below the host's Smart Pricing minimum.
- Weekly, monthly and trip-length discounts override Smart Pricing, and weekend pricing requires turning it off.
- Airbnb may temporarily switch Smart Pricing off during disasters, emergencies or unrest, to prevent extreme price changes and comply with local law.

That last rule is a useful reminder: a deployed pricing model sits inside legal and ethical guardrails that the model itself does not learn.

## Where it came from

Smart Pricing grew out of a static price-tip tool Airbnb began building in 2012, and the version described in the KDD 2018 paper had been in production for more than a year when it was published ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The original motivation was usability: in focus groups, would-be hosts got stuck at the price field, and some gave up on listing ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)).

| When | Milestone |
| --- | --- |
| 2026 | Airbnb's Help Centre still documents Smart Pricing as a min/max-bounded automatic pricing toggle ([6](https://www.airbnb.ca/help/article/1168)) |
| Oct 2021 | Zhang, Mehta, Singh and Srinivasan publish an independent study of the algorithm's revenue and racial-equity effects in *Marketing Science* ([7](https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Algorithm-Meant-to-Eliminate-Racial-Disparities-in-Airbnb-Revenue-Fails-to-Enhance-Revenue-Equality), [8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)) |
| Aug 2018 | Peng Ye and seven co-authors present "Customized Regression Model for Airbnb Dynamic Pricing" at KDD 2018 in London ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing)) |
| Nov 2015 | Smart Pricing launches: hosts set a min and max, and Airbnb adjusts rates automatically using location, season and local events ([5](https://www.travelpulse.com/news/technology/airbnb-aims-to-make-hosting-easier-boost-revenue-with-smart-pricing)) |
| Jun 2015 | Price Tips become dynamic, with a new tip each day for each future available night; Airbnb open-sources Aerosolve, the ML package behind them ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm), [4](https://airbnb.io/aerosolve/)) |
| Mid-2014 | Work starts on a system that learns from whether its tips led to bookings, using a classifier that predicts booked or not booked ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)) |
| 2013 | First static price-tip tool rolls out, based on comparable nearby listings ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)) |
| 2012 | Airbnb starts building pricing tools for hosts ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)) |

Two threads from the early years carry into the 2018 design. First, the booking classifier: the idea of predicting "will this night book?" and learning from outcomes dates from 2014 ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)). Second, a preference for interpretable models. Aerosolve was pitched as ML "built for humans", using additive models that engineers could inspect and nudge with prior beliefs ([4](https://airbnb.io/aerosolve/)). The 2018 strategy model keeps that spirit: it has only two learned parameters per listing ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

The first-generation tool also taught an early lesson about features. Expanding-radius comparisons mixed neighbourhoods on opposite sides of a river, so Airbnb had a cartographer draw neighbourhood boundaries and later learned micro-neighbourhoods from booking data ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)).

## The problem it solves

Smart Pricing solves a pricing problem where every product is unique, demand moves daily, and the seller cannot run its own price experiments. Each of those three facts breaks a different assumption of textbook revenue management.

### The textbook approach

Classic revenue management, the kind airlines and hotel chains use, assumes many identical units. By watching how demand for those units responds to price, you estimate a demand curve F(P), then pick the price that maximises P × F(P) ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Airlines and hotels have adjusted prices this way for decades ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)).

### Why it breaks at Airbnb

1. **No two listings are alike.** Each listing has its own location, size, decor and host, so there is no pool of identical units to learn a demand curve from ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing)). Even similar nearby properties differ in things like the number of five-star reviews ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). In practice the demand function depends on price, time and the specific listing, F(P, t, id) ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).
2. **Demand shifts over time.** It varies with seasonality and regional events, with different seasonal patterns by country ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). It also changes as the night approaches: shorter lead time means fewer remaining chances to be booked ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Some events, like a World Cup in a host's city, have no historical data at all ([3](https://spectrum.ieee.org/the-secret-of-airbnbs-pricing-algorithm)).
3. **Airbnb can only suggest.** Hosts control the final price and adopt suggestions only partially, so Airbnb cannot freely try different prices and observe the market's response ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### What failed first

Airbnb did try the textbook route. Scoring the booking model at a range of candidate prices yields an estimated demand curve per listing-night ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). But online A/B tests showed that maximising revenue directly on that curve often failed to improve host revenue, so the team looked for alternatives ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The paper's conclusion leaves the door open: with a more accurate demand curve, the authors may revisit direct revenue maximisation ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

The paper reports the failure rather than diagnosing it. A general explanation from the operations-research literature is that standard ML minimises prediction error, not the quality of the decision built on the prediction ([10](https://arxiv.org/abs/1710.08005v1)). A demand model can be accurate on average and still have the wrong slope near the price that matters, and an argmax over that curve amplifies the error. This mismatch is the motivation for "decision-focused" losses such as Elmachtoub and Grigas's SPO loss ([10](https://arxiv.org/abs/1710.08005v1)). Airbnb's custom loss is an early industrial example of the same idea.

### The deeper problem: the target is never observed

The "optimal price" for a listing-night is never revealed, even after the fact ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Airbnb sees only whether the night booked and at what price. Statisticians call this kind of partial observation *censoring*: a value is known to lie above, below or between some bounds, but not exactly where ([11](<https://en.wikipedia.org/wiki/Censoring_(statistics)>)).

- A night that **did not book** at price P suggests the right price was below P, but not by how much.
- A night that **did book** at P means a lower suggestion would have left money on the table; a higher price might also have worked.

The rest of the system is built to learn from exactly this one-sided evidence ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

## Deep dive 1: gradient boosted trees for booking probability

Stage one is a binary classifier that answers one question per listing-night: how likely is this night to be booked? Airbnb uses Gradient Boosting Machines (GBMs) for it, training a separate model for each market ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The paper gives only brief details of this model because its focus is the strategy model in stage two ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### What goes in

| Feature group | Examples given in the paper ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| --- | --- |
| Listing | Nightly price, room type, guest capacity, bedrooms and bathrooms, amenities, location, reviews, historical occupancy, whether Instant Book is on |
| Temporal | Seasonality (day of year, day of week), calendar gaps between check-in and check-out, days between now and the night in question (lead time) |
| Supply and demand | Available listings nearby, listing views, search and contact rates |

Two design choices are worth pointing out to students. First, **one model per market**: demand behaves differently in Tokyo and Tahoe, so local models can specialise. Dense markets benefit most from these location-based models and are sampled at a higher rate than the global default ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Second, **price is an input feature**. That lets Airbnb ask "what if" questions by re-scoring the same night at different prices, which traces out an estimated demand curve ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### Building block: the decision tree

A decision tree makes a prediction by asking a short series of yes/no questions about the features, then reading off a value stored in the leaf it lands in. In gradient boosting, each tree is deliberately kept small and "weak"; Google's teaching example uses trees of depth 3 ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).

An illustrative tree for booking probability (not from the paper) might ask: is the night within 7 days? Is it a Saturday? Is the price above the neighbourhood median? Each path ends in a leaf with a small adjustment to the booking score. One such tree is a crude rule of thumb. Hundreds added together become a precise model.

### Boosting: each tree fixes the last one's mistakes

Gradient boosting builds a "strong" model as a sum of many "weak" ones, usually small trees ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)). Training is iterative:

1. Start with a trivial model, such as a constant prediction for every row ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).
2. Measure how wrong the current model is on each training example. This target for the next tree is called the *pseudo-response* ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).
3. Fit a new small tree to predict that error ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).
4. Add a scaled-down copy of the new tree to the model, so the ensemble moves a little toward the right answer ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).
5. Repeat until a stopping rule triggers, such as a maximum number of trees or rising error on a validation set ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).

In Google's notation, each round updates the strong model F by subtracting a shrunken weak model f ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)):

```latex
F_{i+1} = F_i - \nu \, f_i
```

The factor ν is the *shrinkage*, and it plays the same role as a learning rate in a neural network: smaller values learn more slowly but overfit less. A value of 0.1 is common ([12](https://developers.google.com/machine-learning/decision-forests/intro-to-gbdt?authuser=1)).

### Why it is called *gradient* boosting

For regression with squared error, "how wrong" is just the signed difference between prediction and label. For classification that shortcut works poorly. Instead, each new tree is trained to predict the *gradient of the loss* with respect to the current model's output, using a loss such as log loss for classification ([13](https://developers.google.com/machine-learning/decision-forests/gradient-boosting)). With squared error the gradient happens to equal twice the signed error, which is why the simple version works for regression ([13](https://developers.google.com/machine-learning/decision-forests/gradient-boosting)).

This is Friedman's key insight from 2001: boosting is gradient descent, but in the space of functions rather than the space of parameters ([14](https://projecteuclid.org/euclid.aos/1013203451)). A neural network nudges its weights downhill on the loss. A GBM instead adds a whole new function (a tree) that points downhill. Because the recipe only needs a gradient, it works with any differentiable loss ([14](https://projecteuclid.org/euclid.aos/1013203451)). Modern libraries add refinements, such as a Newton step that uses the second derivative to set each leaf's value ([13](https://developers.google.com/machine-learning/decision-forests/gradient-boosting)).

### Why GBMs suit this problem

- **Tabular, mixed-type data.** Booking data is a table of prices, counts, categories and dates. On medium-sized tabular benchmarks, tree-based models such as XGBoost still beat deep learning even before counting their speed advantage ([15](https://arxiv.org/abs/2207.08815)).
- **Interactions for free.** A path through a tree combines conditions (short lead time *and* weekend *and* high local search volume) without anyone hand-coding the interaction.
- **Messy data.** Friedman described boosted trees as robust and especially suited to data that is less than clean ([14](https://projecteuclid.org/euclid.aos/1013203451)).
- **A proven tool at Airbnb.** Replacing a hand-tuned search scoring function with a GBDT produced one of the largest step improvements in bookings in Airbnb's history ([16](https://arxiv.org/abs/1810.09591v2)).

### The limit that shaped the whole system

A classifier that is good at predicting *whether* a night books is not automatically good at predicting *how bookings change as price changes*. Airbnb found its estimated listing-night demand curves were not accurate enough to set prices from directly ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). One likely reason, offered here as interpretation rather than a claim from the paper: the model learns from prices hosts chose themselves, and those choices are correlated with listing quality and expected demand. So stage one's output, the booking probability q, becomes just one input to stage two rather than the final answer ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

## Deep dive 2: the custom loss

The strategy model is trained with a loss that is zero whenever its suggested price falls inside an interval of "reasonable" prices built from what actually happened, and grows with distance outside that interval ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The interval replaces the ground-truth label that a normal regression would need but this problem never provides.

### Step 1: turn each outcome into an interval

Every historical listing-night gives one of two outcomes, and each outcome supports a different one-sided conclusion ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

| Outcome at price P | What it tells us | Lower bound L | Upper bound U |
| --- | --- | --- | --- |
| Booked | Any suggestion below P would have left money on the table; something a bit higher might also have booked | P, the booked price | c₂ × P, with c₂ > 1 |
| Not booked | A suggestion at or above P would probably also have failed; a lower one might have booked | c₁ × P, with 0 < c₁ < 1 | P, the calendar price |

All four bounds come from the paper as summarised by Colyer ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The constants c₁ and c₂ say how far from the observed price the "right" price is allowed to be. They are hyperparameters: the published summaries do not report their values.

### Step 2: penalise suggestions that leave the interval

For listing-night i, with features x and suggested price f(x), the per-example loss is ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)):

```latex
\ell_i = \max\big(0,\; L_i - f_\theta(x_i)\big) + \max\big(0,\; f_\theta(x_i) - U_i\big)
```

Training picks the parameters θ that minimise the sum of ℓ over all listing-nights. In words: inside the interval the loss is zero; below it, the loss is how far below L you are; above it, how far above U ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). At most one of the two terms is ever non-zero.

### A worked example

The constants below are illustrative (c₁ = 0.9, c₂ = 1.1), chosen only to make the arithmetic easy.

| Night | Interval \[L, U\] | Suggest $85 | Suggest $95 | Suggest $105 | Suggest $120 |
| --- | --- | --- | --- | --- | --- |
| Booked at $100 | \[$100, $110\] | loss 15 | loss 5 | loss 0 | loss 10 |
| Not booked at $100 | \[$90, $100\] | loss 5 | loss 0 | loss 5 | loss 20 |

Read across the rows and the logic is visible. On the booked night, $95 is penalised because the guest already paid $100. On the unbooked night, $105 is penalised because $100 already failed. Summed over millions of nights, booked nights pull suggestions up and unbooked nights pull them down.

### Why this shape works

- **It uses only observable facts.** Whether a night booked, and at what price, are the only inputs to the interval ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).
- **Both sides are needed.** If you only rewarded lower suggestions on unbooked nights, the best model would offer free accommodation every night ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The booked-night bound stops that collapse.
- **The flat bottom is honest.** The data cannot distinguish between prices inside the interval, so the loss does not pretend to.
- **It is a familiar loss in disguise.** Support vector regression uses an ε-insensitive loss: zero when the error is within ε, linear beyond it ([17](https://www.ise.ncsu.edu/fuzzy-neural/wp-content/uploads/sites/9/2022/08/SVR-Tutorial.pdf)). Airbnb's version keeps the zero-then-linear shape but replaces a symmetric tube around a known label with an asymmetric interval around censored evidence. Statisticians would call each training example interval-censored: the true value lies somewhere between two bounds ([11](<https://en.wikipedia.org/wiki/Censoring_(statistics)>)).

### What the gradient looks like

This follows directly from the formula. The loss is piecewise linear in the suggestion, so its slope is simple: −1 when the suggestion is below L (push the price up), +1 when above U (push it down), and 0 inside (leave it alone). That is the same "follow the gradient of the loss" signal that gradient boosting uses to fit each new tree ([13](https://developers.google.com/machine-learning/decision-forests/gradient-boosting)). Airbnb did not plug this loss into a GBM, though. It used the loss to fit a small, structured model, described next ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

## Deep dive 3: the model the loss trains

The strategy model does not predict a price from scratch. It multiplies the host's own calendar price P by a learned adjustment factor V, so the suggestion is P × V ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The paper calls this an asymmetric exponential form that raises or lowers the calendar price by an amount learned from data ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### Inputs and parameters

| Symbol | What it is | Learned or fixed |
| --- | --- | --- |
| P | The host's calendar price for the night | Input ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| q | Booking probability from the stage-one GBM | Input ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| D | A demand score computed for a cluster of similar listings from extra demand signals the GBM does not fully capture | Input ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| θ₁ | How fast suggested prices grow or shrink | Learned per listing ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| θ₂ | The point at which the model suggests the original calendar price unchanged | Learned per listing ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| φ\_H, φ\_L | Constants between 1 and 2 that set how sharply the curve bends for increases (H) and decreases (L) | Fixed ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |

The full equation is reproduced in Colyer's summary ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). For a conceptual course, the behaviour matters more than the algebra: when the booking probability and demand are high, V rises above 1 and the price goes up; when they are low, V drops below 1 and the price comes down.

### Why asymmetric?

The authors use different curvature constants for increases and decreases so that training can learn the two directions separately. Their reasoning is that markets react to supply and demand non-linearly, so a price cut and a price rise of the same size do not have mirror-image effects ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### Why such a small model?

Only θ₁ and θ₂ are learned, and they are learned separately for each of more than 4 million active listings ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Three reasons make that a sensible trade-off:

- **Little data per listing.** A single listing has at most a few hundred nights of history a year, enough to fit two numbers reliably but not a large model.
- **The heavy lifting is already done.** The GBM in stage one has already absorbed hundreds of features into q; stage two only has to map q and D to a price change.
- **Predictable behaviour.** A two-parameter curve anchored on the host's own price cannot produce wild suggestions, and engineers can read its parameters. That echoes Airbnb's earlier emphasis on interpretable, human-adjustable models ([4](https://airbnb.io/aerosolve/)).

### Cold start and recency

A new listing has too few examples to fit its own θs, so Airbnb also prepares market-level and global-level fallback parameters ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Training puts most weight on the latest booking behaviour so that seasonal shifts show up quickly ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The listing → market → global hierarchy is a reusable pattern for any per-entity model.

### What the output looks like

The authors inspected suggestions generated on 8 February 2018 for the next 120 nights in Tokyo and in Lake Tahoe. Both markets showed strong weekly patterns. Tokyo also showed a sharp spike from late March to early April, matching cherry-blossom season ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The model was never told about cherry blossoms; it picked the event up from demand signals. The figure is reproduced in Colyer's summary and makes a strong slide ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

## Evaluation without ground truth

With no true optimal price to compare against, accuracy and RMSE are meaningless here, so the team defined two offline metrics that each check one side of the censored evidence: price decrease recall (PDR) and booking regret (BR) ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). They mirror the two halves of the loss.

| Metric | Computed over | Definition | Better when | Paper's toy example |
| --- | --- | --- | --- | --- |
| Price decrease recall (PDR) | Unbooked nights | Share of unbooked nights where the suggested price was below the price the host advertised | Higher | 3 of 5 unbooked nights got a lower suggestion, so PDR = 0.6 ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |
| Booking regret (BR) | Booked nights | For each booked night, how far the suggestion fell below the booked price as a percentage (zero if it did not); then take the median | Lower | Regrets of 14%, 5%, 6%, 0% and 0% give BR = 5% ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) |

### Why you need both

Each metric is trivial to game on its own. Suggesting $0 for every night gives a perfect PDR, which is why booking regret exists ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). A later Airbnb paper on pricing Experiences reused these metrics and made the point concrete: a "price everything at zero" baseline scored PDR = 1.0 and BR = 1.0, while a "use the average price" baseline had near-zero regret but very low PDR ([18](https://arxiv.org/pdf/1911.05887)). The authors concluded that the metrics trade off against each other and must be read as a set ([18](https://arxiv.org/pdf/1911.05887)). The analogy for students is precision and recall: pushing one up tends to push the other down.

### Why the median?

BR uses the median rather than the mean ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). A reasonable reading is robustness: a handful of extreme nights cannot dominate the score. The flip side is that the median ignores the size of the worst misses, which is why the Experiences paper added a dollar-weighted variant ([18](https://arxiv.org/pdf/1911.05887)).

### What the evaluation showed

Offline, the strategy model significantly improved both PDR and BR over a naive strategy that priced directly off the GBM's demand curves. The one exception was booking regret on one of the paper's datasets, labelled (a) ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). Online, A/B tests showed the strategy model beat direct revenue maximisation ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)).

### Limits of these metrics

Both are proxies built on the same assumption as the loss: that an unbooked night at P would also have stayed unbooked at any higher price ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The Experiences paper notes two further gaps. A well-priced item can still go unbooked because a stronger competitor appeared in the same search, and not every unbooked item needs to sell for the best overall outcome ([18](https://arxiv.org/pdf/1911.05887)). Offline metrics are therefore a filter, and online A/B tests on real revenue remain the final judge ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing)).

## Results: what the evidence says

The best independent evidence says Smart Pricing works the way its design predicts: adopters' prices went down and their revenue went up ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)). Whether that is good for a given host depends on their costs, which the algorithm does not see ([21](https://chicagobooth.edu/-/media/Research/Kilts/docs/qme2021-paper54---Pricing-Frictions-and-Platform-Remedies-The-Case-of-Airbnb)).

| Source | Type | Finding |
| --- | --- | --- |
| Ye et al., KDD 2018 ([1](https://www.kdd.org/kdd2018/accepted-papers/view/customized-regression-model-for-airbnb-dynamic-pricing), [2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)) | Company-reported, A/B tests | In production for more than a year; the first strategy-model launch produced significant gains in bookings and booking value for hosts who adopted suggestions. No effect sizes published. |
| Airbnb blog, June 2015, via TravelPulse ([5](https://www.travelpulse.com/news/technology/airbnb-aims-to-make-hosting-easier-boost-revenue-with-smart-pricing)) | Company-reported, observational | Hosts who priced within 5% of the tip were four times more likely to be booked. This is a correlation, not a causal effect. |
| Zhang, Mehta, Singh and Srinivasan, *Marketing Science* 2021 ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)) | Independent, quasi-natural experiment | Among adopters, average nightly rate fell 5.7% and average daily revenue rose 8.6%. |
| Huang, 2021 working paper ([21](https://chicagobooth.edu/-/media/Research/Kilts/docs/qme2021-paper54---Pricing-Frictions-and-Platform-Remedies-The-Case-of-Airbnb)) | Independent, structural model of San Francisco | If all hosts were put on a seller-revenue-maximising algorithm, prices would be 26% lower and 56% of sellers would be worse off on profit. This is a simulation of a stylised algorithm, not of Smart Pricing itself. |

### Reading the independent study carefully

Zhang and colleagues used Airbnb's introduction of the tool and hosts' voluntary adoption as a quasi-natural experiment ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)). According to Harvard's write-up, many hosts had been overpricing their properties, and the algorithm corrected prices similarly for hosts of every race ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). Lower prices raised occupancy enough to lift revenue ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). The secondary sources describe the sample differently: Harvard cites 2,118 properties in seven US cities from 2015 to 2017, while Toronto's Rotman School cites just over 9,000 properties across about 400 neighbourhoods in seven large cities ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap), [20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)). Harvard's write-up also gives the price drop as 5.8% rather than the abstract's 5.7% ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). Use the journal abstract's figures when in doubt ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)).

### Revenue is not profit

The deeper critique concerns the objective. Airbnb takes a fixed percentage of each booking, so its own payoff tracks host *revenue* ([21](https://chicagobooth.edu/-/media/Research/Kilts/docs/qme2021-paper54---Pricing-Frictions-and-Platform-Remedies-The-Case-of-Airbnb)). Hosts care about *profit*, and every stay costs them cleaning time, wear and hassle. Huang estimates a median marginal cost of about $37 to $38 per night in San Francisco, against a median price of $150 ([21](https://chicagobooth.edu/-/media/Research/Kilts/docs/qme2021-paper54---Pricing-Frictions-and-Platform-Remedies-The-Case-of-Airbnb)). A revenue-maximising price is therefore lower than a host's profit-maximising price.

Host forum threads echo this. An official Airbnb community post stated that the goal of Smart Pricing is to raise a host's chance of getting booked, and many hosts replied that its suggestions were consistently below what they could achieve ([19](https://community.withairbnb.com/t5/Community-Center-Updates/How-Smart-Pricing-Works/m-p/551734)). Treat those replies as anecdotes, not evidence. Still, they line up with both the 5.7% price drop and Huang's model.

One nuance for careful readers: Huang describes Ye et al.'s method as estimating demand and then solving for the revenue-maximising price ([21](https://chicagobooth.edu/-/media/Research/Kilts/docs/qme2021-paper54---Pricing-Frictions-and-Platform-Remedies-The-Case-of-Airbnb)). The paper itself says that direct approach failed in A/B tests and was replaced by the custom-loss strategy model ([2](https://blog.acolyer.org/2018/10/03/customized-regression-model-for-airbnb-dynamic-pricing/)). The custom loss still has no term for host costs, so the revenue-versus-profit critique survives the correction.

## The fairness twist

Smart Pricing narrowed the Black–white revenue gap by 71.3% for hosts who used it, yet the gap across all hosts grew after launch, because Black hosts adopted the tool far less often ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)). The same race-blind model looked fair at the individual level and widened inequality at the population level.

| Quantity | Value | Source |
| --- | --- | --- |
| Daily revenue gap before the algorithm, white minus Black hosts, controlling for host, property and location | $12.16 | [8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295) |
| Demand for Black-owned properties relative to similar white-owned ones | About 20% lower | [9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap) |
| Extra revenue per night after adopting: Black hosts vs white hosts | $13.92 vs $5.22 | [20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb) |
| Reduction in the gap among adopters | 71.3% | [8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295) |
| Likelihood of adoption, Black hosts relative to white hosts | 41% lower | [9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap) |
| Share of properties in the sample owned by Black hosts | 9% | [9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap) |

### How both things can be true

The two findings come from different units of analysis. For an individual Black host, turning the tool on helped more than it helped a comparable white host ([20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)). For the population, what matters is who turned it on, and white hosts did so much more often ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). The researchers say it is unclear why fewer Black hosts used the tool ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). Mehta also stresses that the results point to guest discrimination against Black-hosted listings, not to bias in Airbnb's algorithm ([20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)).

### Why race-blind can still be suboptimal

The study confirms that the algorithm's recommendations are not affected by the host's race ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)). In the ML fairness literature, this is *fairness through unawareness*: a model counts as fair if it never explicitly uses the protected attribute ([22](https://proceedings.neurips.cc/paper/6995-counterfactual-fairness.pdf)). Kusner and colleagues warn that, depending on how the protected attribute relates to the data, some fairness definitions can actually increase discrimination ([22](https://proceedings.neurips.cc/paper/6995-counterfactual-fairness.pdf)).

Airbnb is a concrete case. If Black and white hosts face different demand curves, as the data suggest, a single race-blind model may price suboptimally for both groups ([7](https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Algorithm-Meant-to-Eliminate-Racial-Disparities-in-Airbnb-Revenue-Fails-to-Enhance-Revenue-Equality)). The authors argue the cost falls more heavily on Black hosts ([8](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1295)). Mehta's summary: the prices land closer to white hosts' optimum, so the model is "blind but it's not fair" ([20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)).

Link this back to the architecture. The booking model is trained on outcomes produced by guests, and guest behaviour carries the bias ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)). Removing race from the features does not remove its effect from the labels.

### What the authors recommend

- **Use race, directly or through correlated socioeconomic variables.** The researchers say this would further shrink the gap, though using a protected attribute this way is not currently permitted by US policy ([7](https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Algorithm-Meant-to-Eliminate-Racial-Disparities-in-Airbnb-Revenue-Fails-to-Enhance-Revenue-Equality)). Mehta adds that the law should change in special cases where this can be shown to help ([20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)).
- **Target adoption.** If Airbnb wants to close the gap by encouraging adoption, Zhang suggests focusing on Black hosts in lower socioeconomic-status neighbourhoods ([7](https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Algorithm-Meant-to-Eliminate-Racial-Disparities-in-Airbnb-Revenue-Fails-to-Enhance-Revenue-Equality)). She calls persuasion more practical than redesigning the algorithm ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)).
- **Address guest bias at the source.** One idea is masking host profile photos until a booking is complete, with the caveat that guests might infer race from names or decor instead ([9](https://www.library.hbs.edu/working-knowledge/white-airbnb-hosts-earn-more-can-ai-shrink-the-racial-gap)).

### A methods note worth raising in class

The researchers inferred each host's race by applying a deep learning model to profile photos ([20](https://www-2.rotman.utoronto.ca/insightshub/ai-analytics-big-data/racial-airbnb)). Auditing an ML system often requires another ML system, and that second system has its own error rates and ethical questions.
