# NotCo's Giuseppe: Generative Latent-Space Search for Recipe Formulation

Nov 18, 2026 · @Rey Riordan

## Summary

NotCo's Giuseppe turns "make milk without a cow" into a search problem. A generative autoencoder learns a continuous map of real recipes, and a scoring layer steers a search across that map toward the target food.

- **The problem.** Choosing which plants, and how much of each, will mimic an animal food means searching an enormous space of combinations. Every real test is a slow cook-and-taste cycle ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes); [US 11,164,069](https://patents.justia.com/patent/11164069)).
- **The generator.** Ingredients and the target food become feature vectors. A variational autoencoder (VAE) learns a latent space of ingredient sets from recipes, and its decoder turns any point back into an ingredient list ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- **The scoring layer.** A quantity solver picks the proportion of each ingredient and reports how far the blend lands from the target. A flavor classifier and user goals add terms to that score ([US 11,164,069](https://patents.justia.com/patent/11164069); [US 11,205,101](https://patents.justia.com/patent/11205101)).
- **The steering.** Bayesian optimization uses past scores to choose the next latent point to try. Diet rules are enforced by masking forbidden ingredients before the decoder chooses ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- **The proof point.** Given the molecular characteristics of cow's milk, Giuseppe proposed a formula with pineapple juice, cabbage juice, chicory root and coconut, which chefs then refined into NotMilk ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)).
- **The caveat.** The architecture comes from patents filed in 2020 and 2021. Patents describe possible designs, not proof of what runs today, and NotCo publishes no accuracy benchmarks.

**How to read this report.** Every factual claim links to the page it came from. Where I explain why a design choice makes sense and no source says so, the sentence is marked *(inferred)*. Speed and adoption figures are NotCo's own claims unless a source says otherwise.

## 1. The problem: formulation is an expensive search

Formulating a plant-based copy of an animal food means picking a handful of ingredients from a vast catalog, and the right amount of each, so the blend matches the target on many properties at once. Each guess is checked by cooking and tasting it, so guesses are expensive.

**Formula versus recipe.** NotCo's patents distinguish a *formula*, a set of ingredients with proportions, from a *recipe*, which adds the cooking process ([US 11,205,101](https://patents.justia.com/patent/11205101)). The target is an existing food, such as cow's milk, described by its nutritional, chemical and sensory properties ([US 11,164,069](https://patents.justia.com/patent/11164069)).

### Why it is hard

1. **The space is huge.** NotCo's CEO says AI lets the company draw on about 300,000 plants, while the Western diet uses around 200 ([Food Processing, 2022](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050)). Even the 830-ingredient vocabulary in one NotCo patent example ([US 11,982,661](https://patents.justia.com/patent/11982661)) allows about 4 × 10²² different 10-ingredient sets, before amounts are chosen (my arithmetic: 830 choose 10).
2. **The target has many dimensions.** A milk substitute must match nutrition, flavor, mouthfeel and appearance, and also behave like milk when baked or steamed ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)). NotCo's CEO sums up the coupling: "If you change one thing, you change everything else" ([FEN UChile, 2026](https://fen.uchile.cl/?p=34542)).
3. **Evaluation is slow.** The true test is a person cooking and tasting. NotCo's 20-plus food scientists and chefs test more than 100 recipes a month ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)), so the number of tries is the bottleneck.
4. **Kitchen success does not guarantee factory success.** Recipes that work in a test kitchen can fail at industrial scale because the equipment behaves differently ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)).

NotCo's patents describe the traditional trial-and-error approach as inefficient, slow to reach a single successful formula, and wasteful of physical resources ([US 11,164,069](https://patents.justia.com/patent/11164069)). For context, packaged-food innovation typically takes two to three years from concept to shelf ([FoodNavigator, 2025](https://www.foodnavigator.com/Article/2025/04/09/notco-leverages-ai-to-help-cpg-brands-innovate-more-quickly-and-accurately/)).

### The problem as a computer scientist sees it

Strip away the food and this is **black-box optimization over a discrete, combinatorial space with an expensive objective** *(inferred framing)*. There is no formula for "tastes like milk," the search space is sets of items rather than numbers, and each true evaluation costs human time.

Giuseppe's design attacks each part *(inferred)*:

- It makes the space **continuous**, by learning a latent space in which nearby points are similar ingredient sets.
- It makes the objective **cheap**, by scoring candidates against measured feature vectors instead of cooking them.
- It spends the **expensive** human evaluations only on the top-scoring candidates, and feeds the results back into the models.

## 2. NotCo and Giuseppe in context

NotCo is a Chilean food-tech company that built Giuseppe to design its own plant-based foods, and by late 2026 the AI platform had become the business. NotCo was co-founded in 2015 by Matías Muchnick, Karim Pichara and Pablo Zamora ([FEN UChile, 2026](https://fen.uchile.cl/?p=34542)). Pichara, co-founder and CTO, created Giuseppe, which is named after the painter Giuseppe Arcimboldo ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)).

| Date | Event | Source |
| --- | --- | --- |
| Sep 2026 | Sold its Brazil operation to Ferrara, a Brazilian investment group. NotCo called it "an important milestone for NotCo AI." | [Just Food](https://www.just-food.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals); [Forbes Chile](https://forbes.cl/negocios/2026-09-08/notco-ahora-vende-su-operacion-en-brasil-al-grupo-ferrara/) |
| Sep 2026 | Diario Financiero reported that NotCo closed its Mexico business without a buyer. NotCo declined to comment. | [The Plant Base](https://www.theplantbasemag.com/news/notco-sells-brazil-operations-to-ferrara-reportedly-shuts-down-mexico-business) |
| Jun 2026 | Sold its Argentina and Uruguay operations; the Argentina unit went to Molinos Río de la Plata. | [Just Food](https://www.just-food.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals); [Forbes Chile](https://forbes.cl/negocios/2026-09-08/notco-ahora-vende-su-operacion-en-brasil-al-grupo-ferrara/) |
| Mar 2026 | Forbes reported that 7 of the world's 20 largest packaged-goods companies work with NotCo, including Ferrero after the 2024 cocoa price surge. | [FEN UChile](https://fen.uchile.cl/?p=34542) |
| Mar 2025 | Launched Concept Quant, an end-to-end B2B offering built on Giuseppe. | [FoodNavigator](https://www.foodnavigator.com/Article/2025/04/09/notco-leverages-ai-to-help-cpg-brands-innovate-more-quickly-and-accurately/) |
| Sep 2024 | Giuseppe extended to generative flavor and fragrance, with a "discernment layer" that ranks generated ideas. | [The Spoon](https://thespoon.tech/from-data-scraping-to-discernment-layer-how-notcos-giuseppe-ai-has-evolved-over-the-past-decade) |
| May 2024 | Patent granted for a "sensory transformer" that generates ingredients from text descriptions of taste and texture. | [US 11,982,661](https://patents.justia.com/patent/11982661) |
| Dec 2022 | Raised $70M to open Giuseppe to other brands, ingredient suppliers and technology providers. | [FoodNavigator](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/) |
| Feb 2022 | Formed The Kraft Heinz Not Company, a joint venture controlled by Kraft Heinz. | [Food Dive](https://www.fooddive.com/news/kraft-heinz-enters-joint-venture-with-notco/619224/) |
| Nov–Dec 2021 | Patents granted for controllable formula generation and for the flavor and recipe feedback loop. | [US 11,164,069](https://patents.justia.com/patent/11164069); [US 11,205,101](https://patents.justia.com/patent/11205101) |
| Jul 2021 | Raised a $235M Series D at a $1.5B valuation. | [Tech Brew](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes) |
| Feb 2021 | US 10,915,818, "Latent space method of generating food formulas," granted. | [The Spoon](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/); [Justia listing](https://patents.justia.com/inventor/aadit-patel?page=2) |
| Late 2020 | NotMilk launched in the United States. | [The Spoon](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/) |
| 2015 | NotCo founded in Chile. | [FEN UChile](https://fen.uchile.cl/?p=34542) |

Sources disagree on the founding year: The Plant Base gives 2016 ([The Plant Base](https://www.theplantbasemag.com/news/notco-sells-brazil-operations-to-ferrara-reportedly-shuts-down-mexico-business)), while FoodNavigator gives 2015 ([FoodNavigator, 2022](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/)). Why this history matters for the technology: the formulation engine described below was built and patented while NotCo was a food brand, and it is now sold to other companies as a service.

## 3. How it works at a high level

Giuseppe is not one model but an assembly line of models: one describes ingredients, one proposes ingredient combinations, one scores them, one predicts flavor, one writes the cooking steps, and chefs close the loop. The patents call the core of this a *formula generator* ([US 11,164,069](https://patents.justia.com/patent/11164069); [US 11,205,101](https://patents.justia.com/patent/11205101)).

**What goes in.** A target food described by its features, the library of allowed ingredients, and any rules or goals, such as "plant-based only" or "more protein" ([US 11,164,069](https://patents.justia.com/patent/11164069)).

**What comes out.** Many candidate formulas, each with a score for how close it gets to the target; the best-scoring one is selected ([The Spoon, 2021](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/), quoting the patent abstract). In one patent example, a salmon project had 418 stored candidates, which a user narrowed to 98 by filtering on score (0.02 to 0.05) and ingredient count (8 to 11) ([US 11,205,101](https://patents.justia.com/patent/11205101)).

&#91;embedded content: Giuseppe's formula pipeline · 3 inputs, a 4-step search loop, chef feedback\]

Inputs feed a search loop that proposes, measures and steers; the best candidates go to chefs, whose ratings retrain the flavor model. Drawn from the descriptions in [US 11,164,069](https://patents.justia.com/patent/11164069) and [US 11,205,101](https://patents.justia.com/patent/11205101).

### The stages

1. **Representation model: ingredient fingerprints.** Each ingredient's nutrient, chemical and text features are compressed by an autoencoder into a short embedding, 64 numbers in the patent's example ([US 11,164,069](https://patents.justia.com/patent/11164069)).
2. **Target profile.** The food to imitate is described with the same nutrient and chemical features, so the target and every blend can be compared directly ([US 11,164,069](https://patents.justia.com/patent/11164069)).
3. **Prediction model: the recipe map.** A variational autoencoder learns a latent space from the ingredient sets of recipes, and its decoder turns latent points back into ingredient lists ([US 11,164,069](https://patents.justia.com/patent/11164069)).
4. **Quantity solver: the scoring layer.** For a decoded ingredient list, a constrained optimizer finds the proportions that bring the blend closest to the target. The leftover distance is the score ([US 11,164,069](https://patents.justia.com/patent/11164069)).
5. **Formula searcher: the steering.** Local search samples near the target's own position; global search uses Bayesian optimization to pick promising points from past scores ([US 11,164,069](https://patents.justia.com/patent/11164069)).
6. **Flavor generator.** A classifier predicts a formula's flavor profile; comparing it with the target's profile guides the searcher ([US 11,205,101](https://patents.justia.com/patent/11205101)).
7. **Recipe generator.** A GPT-2-style language model writes cooking steps one action at a time, and a user can edit each step before the next is generated ([US 11,205,101](https://patents.justia.com/patent/11205101)).
8. **Chef feedback.** Chefs cook candidates and record flavor intensities plus color, smell, texture and aftertaste. Those reviews go into a database that retrains the flavor generator ([US 11,205,101](https://patents.justia.com/patent/11205101)).

The split of labor is the key design idea *(inferred)*. The generative model answers "which ingredients belong together," the solver answers "how much of each," and the score turns "does this resemble milk?" into a number a search algorithm can use.

## 4. Deep dive: ingredients and targets as vectors

Everything in Giuseppe starts by turning each ingredient, and the target food, into vectors of numbers in a shared feature space. Once that is done, "how close is this blend to milk?" becomes a distance calculation.

### Where the numbers come from

- **Public nutrient and chemistry data.** The main input is a "USDA ingredient vector" of chemical, nutritional and molecular descriptors from the USDA's National Agricultural Library ([US 11,164,069](https://patents.justia.com/patent/11164069)). In the early days, with no budget for data, the team "literally scraped the USDA website," according to Aadit Patel, NotCo's SVP of AI Product and Engineering ([The Spoon, 2024](https://thespoon.tech/from-data-scraping-to-discernment-layer-how-notcos-giuseppe-ai-has-evolved-over-the-past-decade)).
- **Molecules and flavor.** The patent adds a binary vector of which molecules an ingredient contains, plus flavor features summed from those molecules, both from open databases ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- **Text.** A BERT embedding trained on recipes captures how an ingredient is used in cooking language ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- **NotCo's own lab measurements.** Infrared spectroscopy (FTIR), gas chromatography, texture analyzers and physicochemical tests such as viscosity and pH ([US 11,164,069](https://patents.justia.com/patent/11164069); [Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)). NotCo later built analytical labs in San Francisco and Santiago to generate more of this data ([The Spoon, 2024](https://thespoon.tech/from-data-scraping-to-discernment-layer-how-notcos-giuseppe-ai-has-evolved-over-the-past-decade)).

Gaps are common in such data; the patent fills a missing feature value with that feature's average ([US 11,164,069](https://patents.justia.com/patent/11164069)).

### Compressing features into an ingredient embedding

The raw features are long, partly missing and on different scales. A first autoencoder, the *representation model*, learns to compress each ingredient's features into a dense vector, 64 numbers in the patent's example, and rebuild them ([US 11,164,069](https://patents.justia.com/patent/11164069)). Its training loss weighs two reconstruction errors: one for the USDA features, which skips the missing values, and one for the BERT text embedding ([US 11,164,069](https://patents.justia.com/patent/11164069)).

Stacking every ingredient's 64-number vector gives the **ingredient vocabulary embedding matrix**: one row per ingredient ([US 11,164,069](https://patents.justia.com/patent/11164069)). Think of it like word embeddings, where "words" are ingredients *(inferred analogy)*. This matrix matters later, because the decoder chooses ingredients by comparing against its rows, and diet rules work by blanking rows out.

### The target lives in the same space

The target food is described with the same USDA-style features, so the solver can compare a blend against it directly ([US 11,164,069](https://patents.justia.com/patent/11164069)). Users can edit the target, for example raising fat from 13 g to 15 g per 100 g, and weight how much each feature matters ([US 11,164,069](https://patents.justia.com/patent/11164069)).

### Three spaces to keep apart

Students often blur these, so it helps to name them *(my summary of the patent's design)*:

| Space | What one point is | Built by | Used for |
| --- | --- | --- | --- |
| Feature space | An ingredient or food, as measured nutrient, chemical and flavor values | Data collection and lab work | Scoring: distance between a blend and the target |
| Ingredient embedding space (64 numbers) | One ingredient, compressed | Representation autoencoder | Choosing ingredients in the decoder; masking |
| Recipe latent space | A whole set of ingredients | Variational autoencoder trained on recipes | Searching for new combinations |

## 5. Deep dive: the generative autoencoder and its latent space

The generative heart of Giuseppe is a variational autoencoder (VAE) that compresses a recipe's ingredient set into a point in a continuous latent space, and decodes any point back into an ingredient list. NotCo's first latent-space patent, US 10,915,818, trains a VAE on ingredient sets extracted from recipes and uses a stacked recurrent neural network (RNN) as the decoder ([USPTO full text](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10915818)). Its continuation, [US 11,164,069](https://patents.justia.com/patent/11164069), spells out the design in more detail and is the source for the rest of this section.

### Autoencoders in one paragraph

An autoencoder is two networks joined at a narrow waist. The **encoder** squeezes an input into a short vector, the **decoder** rebuilds the input from it, and training minimizes the rebuild error. A plain autoencoder's waist can have "holes": regions that decode to nonsense, which makes it a poor place to search *(inferred, standard ML intuition)*.

A **variational** autoencoder fixes this. The encoder outputs a small probability cloud (a mean and a spread) rather than one point, and training pulls all the clouds toward a simple shared shape, usually a standard normal distribution ([Kingma & Welling, 2013](https://arxiv.org/abs/1312.6114)). The result is a space where nearby points decode to similar outputs and random points decode to plausible ones, which is exactly what a search needs.

### Giuseppe's encoder: a recipe as a bag of ingredients

- The encoder takes a recipe's ingredient set, looks up each ingredient's 64-number embedding, and **sums** them into a "bag of embedded ingredients" ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- Summing makes the encoding **order-invariant**: a list of flour, sugar, egg encodes the same as egg, flour, sugar. Ingredients are also shuffled during training ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- From that sum, the encoder outputs a mean and a standard deviation, and a latent code is sampled as mean + standard deviation × random noise ([US 11,164,069](https://patents.justia.com/patent/11164069)). This "reparameterization" lets training push gradients through a random sample ([Kingma & Welling, 2013](https://arxiv.org/abs/1312.6114)).

### Giuseppe's decoder: writing out ingredients one at a time

- The decoder is a stacked RNN of GRU cells (LSTM cells are named as an alternative). The latent code sets the RNN's starting state, and it emits ingredients one after another ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- At each step, the RNN's hidden state is compared with every row of the ingredient embedding matrix by cosine similarity, and the closest ingredient wins (an argmax) ([US 11,164,069](https://patents.justia.com/patent/11164069)).
- This is the same pattern as a sentence VAE, which generates a sentence word by word from a latent code and can interpolate between sentences ([Bowman et al., 2016](https://arxiv.org/abs/1511.06349)). Here a recipe plays the sentence and ingredients play the words *(inferred analogy)*.

Because the decoder picks ingredients by nearest match against the embedding matrix, blanking a row out removes that ingredient from every possible output. Section 7 shows how NotCo uses this for plant-only rules.

### Keeping the space smooth: the regularizer

The patent names a β-VAE or a Wasserstein autoencoder as the model, and an "MMD-VAE" training objective. That objective adds a maximum mean discrepancy (MMD) term, which compares the whole cloud of encoded recipes against the prior, to the usual reconstruction term ([US 11,164,069](https://patents.justia.com/patent/11164069)).

Why MMD? Research on the InfoVAE family found that VAEs paired with very flexible decoders, such as RNNs, tend to ignore the latent code, and proposed MMD as a simple, robust alternative regularizer ([Zhao, Song & Ermon, 2017](https://arxiv.org/abs/1706.02262)). An RNN decoder that ignored its code would make the latent space useless for search, which is a plausible reason for the choice *(inferred; the patent does not say why)*.

### What the map knows, and what it does not

The VAE learns from "open source and proprietary databases of ingredients and recipes" ([The Spoon, 2021](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/), quoting the patent abstract). The patents do not say how many recipes.

So the latent space encodes **which ingredients co-occur in recipes people have made**. It does not encode whether a combination tastes like milk *(inferred)*. That knowledge comes from the scoring layer in the next section.

## 6. Deep dive: the scoring layer and the search loop

The "scoring layer" is a constrained solver that finds the best proportions for a decoded ingredient list and reports how far the resulting blend lands from the target. A search algorithm then uses those scores to decide where in the latent space to look next ([US 11,164,069](https://patents.justia.com/patent/11164069)).

### Step 1: the quantity solver turns "which" into "how much"

Given a decoded ingredient list, the solver looks for proportions x that make the weighted mix of ingredient feature vectors as close as possible to the target's feature vector ([US 11,164,069](https://patents.justia.com/patent/11164069)). The constraints are simple: proportions of allowed ingredients sum to 1, disallowed ingredients get exactly 0, and nothing is negative ([US 11,164,069](https://patents.justia.com/patent/11164069)).

```latex
\text{score} = \min_{x}\; \Big\lVert\, t \;-\; \sum_i x_i\, f_i \Big\rVert^2 \quad \text{subject to}\quad \sum_i x_i = 1,\;\; x_i \ge 0
```

Here t is the target's feature vector and f\_i is ingredient i's feature vector. The minimum value itself is the score: lower means closer to the target ([US 11,164,069](https://patents.justia.com/patent/11164069)). For CS students, this is a small least-squares problem over the probability simplex, the kind any convex-optimization library solves quickly *(inferred)*.

**The big assumption: blends mix linearly.** The formula treats a blend's features as the weighted average of its ingredients' features. That holds well for nutrients such as protein grams, which add up by mass, but not for flavor, aroma or texture, which emerge from chemistry and processing *(inferred)*. The patent hints at this. It describes an optional extra stage, small neural networks or a transformer encoder, that re-represents ingredients and the target "to combine more linearly" and to stop any single ingredient from dominating ([US 11,164,069](https://patents.justia.com/patent/11164069)).

### Step 2: two flavors of score

The patent defines two versions of this "delta score" ([US 11,164,069](https://patents.justia.com/patent/11164069)):

- **Black-box version.** Decode a latent point to a concrete ingredient list, run the solver, read off the distance. Simple, but the search cannot see why a score changed.
- **Gradient version.** Use the decoder's output *probabilities* over the whole ingredient vocabulary as soft proportions, and measure distance from the target. Because every step is differentiable, the search can follow gradients through the decoder back into the latent space, using optimizers such as SGD or Adam.

### Step 3: searching the latent space

- **Local search.** Encode a real recipe for the target, for example a dairy-milk recipe, into the latent space, then sample and decode points nearby ([US 11,164,069](https://patents.justia.com/patent/11164069)). This finds close variations.
- **Global search.** Bayesian optimization is the primary method described; other black-box methods and gradient-based optimization are alternatives. Each evaluated pair of (latent point, score) guides the choice of the next point ([US 11,164,069](https://patents.justia.com/patent/11164069)).

**Bayesian optimization in brief.** It builds a cheap statistical stand-in for the unknown score function, usually a Gaussian process, along with its uncertainty. An "acquisition function" then picks the next point to evaluate by trading off exploring uncertain regions against exploiting known good ones ([Frazier, 2018](https://arxiv.org/abs/1807.02811)). It works best on continuous spaces of about 20 dimensions or fewer ([Frazier, 2018](https://arxiv.org/abs/1807.02811)), which is why a compact learned latent space is a natural fit *(inferred)*. NotCo's patents do not name the surrogate model, the acquisition function or the latent dimension.

### Step 4: adding user goals to the score

Users can add weighted terms to the function the searcher minimizes, which steers sampling toward different regions of the latent space ([US 11,164,069](https://patents.justia.com/patent/11164069)). The flavor term uses a separate flavor model; both are covered in section 7.

### The loop as pseudocode

An illustrative reconstruction from the patent text, not NotCo's code:

```python
# Illustrative only: reconstructed from the description in US 11,164,069
history = []
z = encoder(target_recipe).mean            # local search: start at the target's own position
for step in range(budget):
    ingredients = decoder(z, mask=forbidden)   # WHICH ingredients (masked: never animal-based)
    x, delta = quantity_solver(ingredients, target_features)  # HOW MUCH, plus distance
    score = delta + sum(w * term(ingredients, x) for w, term in user_controls)
    history.append((z, ingredients, x, score))
    z = bayes_opt.suggest(history)          # global search: pick the next promising point
candidates = sorted(history, key=lambda h: h[-1])   # best (lowest) scores go to chefs
```

The structure is the lesson: the model proposes, the solver measures, and the optimizer decides where to propose next.

## 7. Deep dive: rules, goals, flavor and the feedback loop

Rules and goals enter Giuseppe at three different points: hard masks before the decoder chooses, hard zeros inside the solver, and soft weighted terms added to the score. Flavor, which the solver cannot compute, comes from a separate model trained on chefs' ratings.

### Hard rules and soft goals

| Mechanism | Where it acts | Hard or soft | Example from the patents |
| --- | --- | --- | --- |
| Decoder mask | Ingredient embedding matrix, before the decoder's argmax | Hard: the ingredient can never be generated | Animal-based rows, such as chicken and tuna, set to zero for vegan output ([US 11,164,069](https://patents.justia.com/patent/11164069); [US 11,205,101](https://patents.justia.com/patent/11205101)) |
| Representation mask | Training loss of the ingredient autoencoder | Hard: restricts the candidate pool | Select plant-based candidates; can also drop unavailable or expensive ingredients ([US 11,164,069](https://patents.justia.com/patent/11164069)) |
| Solver constraint | Quantity solver | Hard: proportion fixed at 0 | Unavailable ingredients get exactly zero ([US 11,164,069](https://patents.justia.com/patent/11164069)) |
| Target vector control | Score | Soft | Change fat from 13 g to 15 g per 100 g; weight features by importance, 0 to ignore one ([US 11,164,069](https://patents.justia.com/patent/11164069)) |
| Feature ratio control | Score | Soft | Ask for protein, water and fiber in a 2:3:1 ratio ([US 11,164,069](https://patents.justia.com/patent/11164069)) |
| Ingredient combination control | Score | Soft | Favor pairings such as cabbage with pineapple, scored by their probability in the latent space ([US 11,164,069](https://patents.justia.com/patent/11164069)) |
| Flavor control | Score | Soft | Set sweetness or saltiness from 1 to 5; penalize the gap to the predicted flavor ([US 11,164,069](https://patents.justia.com/patent/11164069)) |

Why mask at generation rather than filter afterward? If forbidden ingredients were removed only at the end, the search would waste many evaluations on candidates that get thrown away *(inferred)*. Masking also produces an interesting effect. The latent space learned from recipes that include dairy, so it knows what dairy-like ingredient sets look like; forcing plant-only output makes the decoder fill those dairy-like regions with the nearest plant ingredients *(inferred; the patents do not discuss this)*.

### The flavor generator

The solver compares measured features, which works for nutrients but cannot predict taste. NotCo handles taste with a **flavor generator**: a classifier, trained on recipes with known flavor profiles, that predicts a formula's flavor profile ([US 11,205,101](https://patents.justia.com/patent/11205101)).

- **Labels.** Salty, sweet, bitter, sour and umami, each at an intensity from 1 (very low) to 5 (very high) ([US 11,205,101](https://patents.justia.com/patent/11205101)).
- **Structure.** A "certainty level classifier" per flavor category decides whether finer-grained flavor predictors are needed ([US 11,205,101](https://patents.justia.com/patent/11205101); [US 10,993,465](https://patents.justia.com/patent/10993465)).
- **Role in search.** The predicted profile is compared with the target's, and the gap steers the formula searcher toward latent regions where the target flavor occurs ([US 11,205,101](https://patents.justia.com/patent/11205101)).

NotCo has also described building a flavor dataset that maps volatile molecules to the words people use for flavor notes ([FoodNavigator, 2022](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/)).

### The feedback loop

Chefs cook the candidates and record flavor intensities plus color, smell, texture, aftertaste, photos and comments ([US 11,205,101](https://patents.justia.com/patent/11205101)). Reviewed recipes go into a "chef's recipes" database that trains the flavor generator, so its accuracy grows as the database grows ([US 11,205,101](https://patents.justia.com/patent/11205101)). For NotMilk, human testers rated prototypes for flavor, mouthfeel and visual appeal, and researchers entered the ratings to refine Giuseppe's training ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)).

In ML terms this is **human-in-the-loop labeling**: the part of the objective the computer cannot measure, taste, is learned from the people who can *(inferred framing)*. In the patents, the model retrained by this loop is the flavor generator, not the VAE.

### The recipe generator

A winning formula still needs cooking instructions. The patent describes an autoregressive transformer, such as GPT-2, pre-trained on internet text and then trained on existing recipes. It writes one action at a time, feeding each action back in as context, and stops when all ingredients are used ([US 11,205,101](https://patents.justia.com/patent/11205101)).

### How the design evolved

NotCo's patent family covers several approaches: direct prediction and latent-space search, both filed in mid-2020, and later a language-model approach. Newest first:

| Patent | Granted | What it adds |
| --- | --- | --- |
| [US 11,982,661](https://patents.justia.com/patent/11982661) | May 2024 | Sensory transformer: a BERT-style encoder reads a text description such as "creamy texture and sweet flavor" plus optional base ingredients; an attention decoder outputs probabilities over 830 example ingredients |
| [US 11,205,101](https://patents.justia.com/patent/11205101) | Dec 2021 | Flavor generator, GPT-2-style recipe generator, chef feedback loop |
| [US 11,164,069](https://patents.justia.com/patent/11164069) | Nov 2021 | Controllable generation: weighted user goals added to the search score |
| [US 10,993,465](https://patents.justia.com/patent/10993465) | May 2021 | Flavor classification with certainty-level classifiers |
| [US 10,957,424](https://patents.justia.com/patent/10957424) | Mar 2021 | A neural network that maps a target's features directly to ingredient proportions, plus an inverse network run backward |
| US 10,915,818 | Feb 2021 | Latent-space method: VAE over recipes, quantity solver, latent search ([The Spoon](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/)) |

By 2024, NotCo described a generative pipeline that produces many options, followed by a "discernment layer" that ranks them by factors such as scalability, cost and consumer preference ([The Spoon, 2024](https://thespoon.tech/from-data-scraping-to-discernment-layer-how-notcos-giuseppe-ai-has-evolved-over-the-past-decade)). That is the same propose-then-score pattern, applied at a larger scale.

## 8. Evidence and results

The best-documented output is NotMilk, whose unusual formula NotCo attributes to Giuseppe. Speed and adoption figures come from NotCo itself or from press interviews; I found no independent benchmark or peer-reviewed evaluation.

### NotMilk: the worked example

- **Input.** NotCo scientists gave Giuseppe the molecular characteristics of cow's milk, and it searched a database for plant ingredients that together replicate milk's physical and chemical properties ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)).
- **Output.** The formula included pineapple juice, cabbage juice, chicory root and coconut, fortified with vitamins and plant proteins to match milk's nutrition ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)).
- **Why pineapple and cabbage.** NotCo says Giuseppe identified the pair as a way to generate lactones, aroma compounds found in dairy ([FoodNavigator, 2022](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/)).
- **Human refinement.** Chefs cooked prototypes, testers rated them, and the final product was tested in baking and steaming ([The Batch, 2020](https://www.deeplearning.ai/the-batch/got-model)).
- **A failure along the way.** The first NotMilk came out green; the algorithm had to learn that some ingredients change color ([Food Processing, 2022](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050)). Color is exactly the kind of property a linear nutrient score does not capture *(inferred)*.

### Claimed speed-ups

| Product | Claimed development time | Who says so |
| --- | --- | --- |
| A milk product, later version | 2 months, down from 10 months the first time | NotCo's website, cited in an editor's note ([Tech Brew, 2021](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)) |
| NotChicken Nuggets | 2 months | NotCo, via [Food Processing, 2022](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050) |
| NotMayo, NotCo's first product | 18 months | NotCo, via [Food Processing, 2022](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050) |

NotCo attributes the speed-up to more data reaching the algorithm with each product ([Food Processing, 2022](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050)). These comparisons have no control group, so the team's growing experience is a confounder *(inferred)*.

### Adoption by other companies

- Kraft Heinz formed a joint venture with NotCo in 2022 to develop co-branded plant-based products ([Food Dive](https://www.fooddive.com/news/kraft-heinz-enters-joint-venture-with-notco/619224/)).
- Forbes reported in March 2026 that 7 of the world's 20 largest packaged-goods companies work with NotCo. Ferrero asked it to find substitute ingredients across more than 30,000 annual recipes after the 2024 cocoa price surge ([FEN UChile](https://fen.uchile.cl/?p=34542)).
- Under Concept Quant's enterprise model, clients can run a version of Giuseppe in their own cloud with their own data ([FEN UChile](https://fen.uchile.cl/?p=34542)).
- Partners also include Barry Callebaut for chocolate development and The Magnum Ice Cream Company ([The Plant Base](https://www.theplantbasemag.com/news/notco-sells-brazil-operations-to-ferrara-reportedly-shuts-down-mexico-business)).
- In September 2026, NotCo said it had over 35 commercial agreements, active work with 10 of the 15 largest food companies, and more than 70% of projects completed successfully ([Just Food](https://www.just-food.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals)). These are company figures, and "successfully" is not defined.

## 9. Limitations and open questions

The patents describe a coherent, plausible system, but they are not evidence of what runs in production today, and the numbers that would let anyone judge its accuracy are unpublished.

### What the evidence can and cannot support

| Claim | Evidence | Status |
| --- | --- | --- |
| Giuseppe proposed NotMilk's pineapple-and-cabbage formula | Trade press, citing NotCo ([The Batch](https://www.deeplearning.ai/the-batch/got-model); [FoodNavigator](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/)) | Company account, widely repeated |
| The formula generator uses a VAE, a quantity solver and Bayesian optimization | Patent text ([US 11,164,069](https://patents.justia.com/patent/11164069)) | Patented design; production use not confirmed |
| Chefs test 100-plus recipes a month and their ratings feed back | Interview with the CTO ([Tech Brew](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)) and patent ([US 11,205,101](https://patents.justia.com/patent/11205101)) | Company account plus patent |
| Development time fell from months to weeks | NotCo's own figures ([Tech Brew](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes); [Food Processing](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050)) | Company claim, no control group |
| How accurate the score or flavor model is | None found | Unknown |

### Technical limitations

- **Patents describe options, not one system.** The texts list alternatives at almost every step: β-VAE or Wasserstein autoencoder, GRU or LSTM, Bayesian or gradient-based search ([US 11,164,069](https://patents.justia.com/patent/11164069)). Which combination NotCo actually runs is not public.
- **The score assumes linear mixing.** The solver treats a blend as the weighted average of its parts ([US 11,164,069](https://patents.justia.com/patent/11164069)). That suits nutrition but not flavor, aroma, color or texture *(inferred)*, which is why the flavor model and chefs remain essential.
- **The map only knows past recipes.** The VAE learns co-occurrence from existing recipes ([US 11,164,069](https://patents.justia.com/patent/11164069)). Points far from any training recipe may decode into combinations the model has little basis for *(inferred)*.
- **Data coverage limits the "300,000 plants" story.** Ingredient features come mainly from USDA records and NotCo's lab tests, and missing values are filled with averages ([US 11,164,069](https://patents.justia.com/patent/11164069)). A plant with no measurements cannot be scored meaningfully *(inferred)*. The only vocabulary size I found in the patents is 830 ingredients, in an example ([US 11,982,661](https://patents.justia.com/patent/11982661)).
- **Kitchen is not factory.** Recipes that work in the kitchen can fail at industrial scale ([Tech Brew](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)). The scoring layer described in the patents does not model processing.
- **Humans stay in the loop.** The CTO describes Giuseppe as an "assistive technology" that learns from its mistakes ([Tech Brew](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes)).

### Open questions

- How large is the recipe training set, and how large is the latent space?
- Which surrogate model and acquisition function does the Bayesian optimization use?
- How often does a top-scoring candidate survive the chefs' tasting, and how has that rate changed?
- Does the 2024 sensory transformer replace the VAE search or sit beside it ([US 11,982,661](https://patents.justia.com/patent/11982661))?

## 10. Connections for CS students

Giuseppe is a food-domain instance of a general ML pattern: learn a continuous latent space of discrete objects, then optimize in that space against a score you can compute cheaply.

### The closest relative: latent-space molecule design

Gómez-Bombarelli and colleagues trained an autoencoder that converts discrete molecules to and from continuous vectors, added a predictor that estimates chemical properties from those vectors, and searched the space with gradient-based and Bayesian optimization ([Gómez-Bombarelli et al., 2018](https://arxiv.org/abs/1610.02415)). Mapping the pieces side by side makes Giuseppe easier to understand *(my comparison)*:

| Piece | Molecule design | Giuseppe |
| --- | --- | --- |
| Discrete object | A molecule, written as a SMILES string | A recipe's ingredient set |
| Encoder and decoder | VAE over SMILES text strings | Bag-of-ingredients encoder, RNN decoder |
| Score on a candidate | Property predictor trained on labeled molecules | Quantity solver distance, plus flavor classifier |
| Search | Gradient steps and Bayesian optimization | Local sampling and Bayesian optimization |
| Hard constraint | Decoded string must be a valid molecule | Decoded ingredients must be allowed (mask) |

### Other papers behind the parts

- **Variational autoencoders**: [Kingma & Welling, 2013](https://arxiv.org/abs/1312.6114).
- **VAEs with RNN decoders over sequences**: [Bowman et al., 2016](https://arxiv.org/abs/1511.06349), which shows interpolating between sentences in latent space.
- **MMD as a VAE regularizer**: [Zhao, Song & Ermon, 2017](https://arxiv.org/abs/1706.02262).
- **Bayesian optimization**: [Frazier, 2018](https://arxiv.org/abs/1807.02811), a readable tutorial.

### Transferable lessons

1. **Split the discrete choice from the continuous one.** Let a generative model pick *which* items, and an exact solver pick *how much*. Each tool does what it is good at.
2. **Enforce hard rules at generation time.** Masking options before the model picks, as Giuseppe does with its embedding matrix ([US 11,164,069](https://patents.justia.com/patent/11164069)), is the same idea as constrained decoding in language models *(inferred analogy)*.
3. **Prefer a readable score.** A distance in named features tells a scientist which property a candidate misses, unlike an opaque learned reward *(inferred)*.
4. **Learn what you cannot compute from people.** Taste has no formula, so NotCo learns it from chef ratings and spends human time only on top candidates ([US 11,205,101](https://patents.justia.com/patent/11205101)).

### A toy version you could build

*(My suggestion, not from any source.)* Collect a few thousand recipes as ingredient sets and attach nutrient vectors to each ingredient. Train a small VAE over the sets, write a non-negative least-squares solver for proportions, and pick a target such as a dairy product's nutrient vector. Then compare random latent sampling against Bayesian optimization on how quickly each finds a low score with dairy ingredients masked out.

## Glossary

Plain-language meanings as used in this report.

| Term | Meaning here |
| --- | --- |
| Acquisition function | The rule Bayesian optimization uses to pick the next point, balancing exploring unknown regions with exploiting good ones |
| Argmax | Picking the option with the highest score |
| Autoencoder | Two networks, an encoder that compresses and a decoder that rebuilds, trained to reproduce their input |
| Bayesian optimization | A search method for expensive functions that fits a statistical stand-in to past results and uses it to choose the next try |
| BERT | A transformer language model that turns text into vectors |
| Cosine similarity | How closely two vectors point in the same direction, from -1 to 1 |
| Embedding | A short vector of numbers that stands for an item, such as an ingredient |
| Formula | A set of ingredients with proportions |
| Gaussian process | A statistical model that predicts a function's value and its uncertainty at any point |
| GRU, LSTM, RNN | Recurrent networks that process or generate sequences one step at a time |
| Latent space | The compressed space inside an autoencoder where each point stands for an input |
| Masking | Blanking out options so a model cannot choose them |
| MMD (maximum mean discrepancy) | A way to measure how different two clouds of points are, used to keep the latent space well shaped |
| Prior | The simple distribution, usually a standard normal, that a VAE's latent space is pulled toward |
| Recipe | A formula plus the cooking process |
| Reparameterization | Writing a random sample as mean + spread × noise so that gradients can flow through it |
| Simplex | The set of non-negative proportions that add up to 1 |
| VAE (variational autoencoder) | An autoencoder whose encoder outputs a distribution, trained so the latent space is smooth and can be sampled |

## Sources

All pages below were opened while writing this report, except where noted. Patent pages are Justia's copies of the USPTO grants.

**NotCo patents**

- [US 11,164,069, Controllable formula generation](https://patents.justia.com/patent/11164069): filed Feb 4, 2021; granted Nov 2, 2021. A continuation-in-part of the application behind US 10,915,818, and the main technical source for sections 3 to 7.
- [US 11,205,101, Formula and recipe generation with feedback loop](https://patents.justia.com/patent/11205101): granted Dec 21, 2021.
- [US 11,982,661, Sensory transformer method of generating ingredients and formulas](https://patents.justia.com/patent/11982661): granted May 14, 2024.
- [US 10,957,424, Neural network method of generating food formulas](https://patents.justia.com/patent/10957424): filed Aug 10, 2020; granted Mar 23, 2021.
- [US 10,993,465, Method of classifying flavors](https://patents.justia.com/patent/10993465): seen in search results only.
- [US 10,915,818, Latent space method of generating food formulas](https://patents.google.com/patent/US10915818): filed Jul 8, 2020; granted Feb 9, 2021 ([Justia listing](https://patents.justia.com/inventor/aadit-patel?page=2)). The full-text page failed to load; its abstract is quoted in [The Spoon, 2021](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/), and its VAE with a stacked RNN decoder appears in the [USPTO full text](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10915818) as indexed by search.

**Press and company sources**

- [The Batch: Got Model? How NotMilk used AI](https://www.deeplearning.ai/the-batch/got-model), Nov 11, 2020.
- [The Spoon: NotCo granted U.S. patent for its AI technology](https://thespoon.tech/plant-based-food-producer-notco-granted-u-s-patent-for-its-ai-technology/), Mar 8, 2021.
- [Tech Brew: The evolution of Giuseppe](https://www.techbrew.com/stories/2021/08/18/evolution-giuseppe-ai-system-generates-fake-meat-dairy-recipes), Aug 18, 2021.
- [Food Dive: Kraft Heinz enters joint venture with NotCo](https://www.fooddive.com/news/kraft-heinz-enters-joint-venture-with-notco/619224/), Feb 23, 2022.
- [Food Processing: How AI is changing food production](https://www.foodprocessing.com.au/content/food-design-research/article/let-s-take-a-look-at-how-ai-is-changing-food-production-1385714050), Dec 9, 2022.
- [FoodNavigator: NotCo raises $70m to offer AI platform to wider industry](https://www.foodnavigator.com/Article/2022/12/12/NotCo-raises-70m-to-offer-AI-platform-to-wider-industry-and-exponentially-accelerate-the-transformation-of-the-plant-based-industry/), Dec 12, 2022.
- [The Spoon: From data-scraping to discernment layer](https://thespoon.tech/from-data-scraping-to-discernment-layer-how-notcos-giuseppe-ai-has-evolved-over-the-past-decade), Sep 4, 2024.
- [FoodNavigator: NotCo opens access to its AI technology](https://www.foodnavigator.com/Article/2025/04/09/notco-leverages-ai-to-help-cpg-brands-innovate-more-quickly-and-accurately/), Apr 9, 2025.
- [FEN UChile: Muchnick and NotCo headline Forbes feature](https://fen.uchile.cl/?p=34542), on the Forbes edition of Mar 22, 2026.
- [Forbes Chile: NotCo sells its Brazil operation to Ferrara](https://forbes.cl/negocios/2026-09-08/notco-ahora-vende-su-operacion-en-brasil-al-grupo-ferrara/), Sep 8, 2026 (in Spanish).
- [The Plant Base: NotCo sells Brazil operations to Ferrara](https://www.theplantbasemag.com/news/notco-sells-brazil-operations-to-ferrara-reportedly-shuts-down-mexico-business), Sep 10, 2026.
- [Just Food: NotCo sells Brazil assets after Argentina and Uruguay disposals](https://www.just-food.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals), Sep 11, 2026.

**Research papers**

- [Kingma & Welling, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114), 2013.
- [Bowman et al., Generating Sentences from a Continuous Space](https://arxiv.org/abs/1511.06349), CoNLL 2016.
- [Gómez-Bombarelli et al., Automatic chemical design using a data-driven continuous representation of molecules](https://arxiv.org/abs/1610.02415), ACS Central Science 2018.
- [Zhao, Song & Ermon, InfoVAE](https://arxiv.org/abs/1706.02262), 2017.
- [Frazier, A Tutorial on Bayesian Optimization](https://arxiv.org/abs/1807.02811), 2018.

**Starting material**

- "App3 NotCo: Generative latent-space search for recipe formulation," the outline supplied with the request (Nov 17, 2026). Its claims were re-checked against the sources above. The HBS Digital Initiative and Ecosistema Startup pages it lists could not be read, so nothing here relies on them.
