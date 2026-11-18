# AI in Food Formulation: Deep Research Report

Nov 18, 2026 · @Rey Riordan

## Executive summary

AI formulation is a constrained, multi-objective inverse-design problem with expensive, noisy labels. The winning systems will not be one big model. They will be a closed loop that joins a generator, physics-aware property models, a sensory model, and an optimizer that decides which few samples are worth making next.

**What is already proven (2023–2026).**

- **Molecule-to-aroma prediction works.** A graph neural network trained on about 5,000 odorants predicted odor profiles for 400 unseen molecules as reliably as a trained panelist ([Lee et al., Science 2023](https://doi.org/10.1126/science.ade4401)).
- **Bayesian optimization cuts formulation rounds.** Expert-guided Bayesian optimization lifted a plant-based Greek yogurt's sensory score by 29% in 10 iterations over five days ([The Plant Base](https://www.theplantbasemag.com/news/food-system-innovations-launches-ai-focused-food-intelligence-lab-to-accelerate-sustainable-protein)). Multi-task versions now fuse GC-MS chemistry with panel data ([Food Chemistry 2026](https://doi.org/10.1016/j.foodchem.2026.149493)).
- **Personal food responses are predictable.** A model trained on 800 people and 46,898 meals predicted each person's post-meal glucose and was validated in a separate 100-person cohort ([Zeevi et al., Cell 2015](https://pubmed.ncbi.nlm.nih.gov/26590418/)).
- **Generative design reaches consumer parity in some cases.** A diffusion model sampled one million burger formulations; several AI-designed burgers matched or beat a Big Mac in blind tests ([Tac & Kuhl, arXiv 2026](https://arxiv.org/pdf/2607.09529)).

**Why now.** Cocoa futures topped $12,000 per tonne in December 2024, then fell about 70% ([ConfectioneryNews](https://www.confectionerynews.com/Article/2026/03/03/cocoa-prices-crash-after-2024-record-highs-as-demand-slump-hits-global-chocolate-market/)). The EU deforestation regulation applies to large and medium operators from 30 December 2026 ([European Commission](https://trade.ec.europa.eu/access-to-markets/en/news/delay-until-december-2026-and-other-developments-implementation-eudr-regulation)). Massachusetts Medicaid members who received medically tailored meals had 31% fewer hospitalizations ([CT Mirror / Stateline](https://ctmirror.org/2026/07/09/massachusetts-food-as-medicine-medicaid/)).

**The grounded big vision.** Three engines, each buildable from methods that exist today:

1. **A sensory foundation model** that maps formula + process → instrument readouts (GC-MS, texture, melt) → predicted panel perception, trained on pooled panel data.
2. **Self-driving pilot lines** that run multi-fidelity Bayesian optimization day and night, spending panel time only on candidates the cheap signals already favor.
3. **A per-person "digital eater" model** that predicts liking and metabolic response, so that each portion can be a safe, slightly different variant that learns from what the person eats and reorders.

The moat is the closed-loop data each loop produces, not a general-purpose language model. Language models are useful as planners and literature readers, but they do not optimize measurable targets on their own.

## Formulation as a machine-learning problem

A formula is a point in a mixture space, and the job is to find the point that best satisfies a brief. Writing it down this way is what keeps the AI from being hand-wavy: every component below is a model with a defined input, output and training signal.

- **Decision variables x:** ingredient fractions (they sum to 1, so x lives on a simplex) plus process settings p such as roast temperature, conche time or extrusion moisture.
- **Predicted properties ŷ(x, p):** sensory attributes, nutrition per serving, cost per kg, water activity, shelf life, line performance, land use and deforestation risk per kg.
- **Hard constraints gₖ:** allergens, legal composition rules, label claims, supplier availability, a person's care-plan limits.
- **Utility U:** how the brief trades off the soft objectives, such as closeness to the reference product against cost and land use.

```latex
\max_{x \in \Delta,\; p \in P} \; U\big(\hat{y}(x,p)\big) \quad \text{subject to} \quad g_k(x,p) \le 0 \;\; \text{for all } k
```

**Why it is hard.**

- **The space is huge.** With 146 candidate burger ingredients, there are more than 2¹⁴⁶ possible ingredient sets before any quantities are chosen ([Tac & Kuhl](https://arxiv.org/pdf/2607.09529)).
- **Labels are expensive and noisy.** Nectar's benchmark puts each product in front of at least 100 consumers in blind tests ([The Spoon](https://thespoon.tech/we-talked-with-nectar-about-their-plans-to-build-an-ai-for-better-tasting-alt-proteins)). Panels drift and disagree.
- **Ingredients interact.** The same aroma molecule is released differently from a fat-rich coating than from a dry bar. Single-ingredient properties do not add up linearly.
- **Process matters as much as recipe.** Roast, particle size and tempering change the product even when x stays fixed.

**The key design idea: a fidelity ladder.** Signals differ in cost and in how close they are to what people experience. A good loop uses cheap signals to decide when to pay for expensive ones (multi-fidelity Bayesian optimization).

| Fidelity | Signal | Turnaround | What it can rule out |
| --- | --- | --- | --- |
| 0 — compute | Property, physics and sensory models | Seconds | Infeasible or off-target formulas |
| 1 — instrument | GC-MS aroma profile, texture analyzer, DSC melt curve, rheology | Hours | Wrong melt, wrong aroma balance |
| 2 — trained panel | Descriptive sensory scores against the reference | Days | Noticeable sensory gaps |
| 3 — consumers | Blind preference, repurchase intent | Weeks | Products people would not buy again |

&#91;embedded content: design-make-test-learn loop · 6 stages\]

The loop runs clockwise. The "Learn" step is where value compounds: each measured sample retrains the property and preference models used in the next round.

## The technical building blocks

Every piece of the loop already exists in some form. What is mature is single-molecule prediction and small-batch optimization. What is missing is mixture-level perception and food-specific lab automation.

| Building block | Concrete method | Evidence today | Gap to close |
| --- | --- | --- | --- |
| Aroma prediction | Graph neural network maps molecular structure to an odor embedding ("principal odor map") | Matched trained-panel profiles on 400 unseen odorants ([Science 2023](https://doi.org/10.1126/science.ade4401)); Osmo raised $130M in total to commercialize it ([Pulse 2.0](https://pulse2.com/osmo-70-million-series-b-closed-for-ai-based-olfaction-platform/amp/)) | Predicting **mixtures** in a food matrix, where molecules mask and boost each other |
| Taste prediction | Fingerprint-based classifiers and regressors for sweetness | e-Sweet: 0.91 accuracy separating 530 sweeteners from 850 non-sweet molecules ([Frontiers in Chemistry 2019](https://www.frontiersin.org/journals/chemistry/articles/10.3389/fchem.2019.00035/full)) | Temporal profile (onset, lingering), bitterness masking |
| Fat and texture physics | Solid–liquid equilibrium thermodynamics from triglyceride composition, plus ML on the residual error | Solid fat content predicted within 4.4–5.4 percentage points across 256 measurements ([Teles dos Santos et al.](https://core.ac.uk/download/163104906.pdf)) | Polymorphism and crystallization kinetics during real cooling |
| Surrogate models + Bayesian optimization | Gaussian processes choose the next batch to test; multi-task and multi-objective variants | 144-experiment cookie optimization ([Google Research](https://research.google/pubs/pub46507/)); meat-analogue texture via multi-objective BO ([J. Food Eng. 2025](https://doi.org/10.1016/j.jfoodeng.2025.112566)); GC-MS + sensory fused ([Food Chemistry 2026](https://doi.org/10.1016/j.foodchem.2026.149493)) | Scaling past \~20 variables; mixing discrete ingredient choice with continuous amounts |
| Generative proposal | Diffusion over ingredient sets (discrete) and amounts (continuous); LLMs as planners | 1M sampled burgers; some matched a Big Mac in blind tests ([Tac & Kuhl](https://arxiv.org/pdf/2607.09529)) | LLMs produce plausible text but do not optimize measured targets |
| Sensory foundation model | Model trained on pooled panel data + instrument readouts to predict liking | Nectar tested 122 plant-based meats with at least 100 consumers each; a $2M grant funds a predictive model ([The Spoon](https://thespoon.tech/we-talked-with-nectar-about-their-plans-to-build-an-ai-for-better-tasting-alt-proteins)) | Data volume; cultural and regional variation in liking |
| Self-driving lab | Robots prepare and measure samples; optimizer closes the loop | Robotic cappuccino-foam optimization with computer vision ([arXiv 2024](https://arxiv.org/html/2409.11499v2)); general formulation SDLs at Toronto ([Acceleration Consortium](https://acceleration.utoronto.ca/sdls/sdl5-formulations)) | No published end-to-end food SDL that includes taste |

**How the blocks compose.** Each block does the job it is best at, and none is asked to do everything.

1. **An LLM writes the plan, not the numbers.** It reads the brief, supplier sheets and literature, and proposes which ingredient roles to fill (fat phase, aroma source, bulking agent). It also translates panel comments into structured attributes.
2. **A generator proposes candidates.** A diffusion or variational model samples ingredient sets and amounts from the learned distribution of feasible formulas.
3. **A constraint solver enforces the hard rules.** Allergens, legal limits and care-plan limits are exact checks, never learned guesses.
4. **Property models screen.** Physics models (fat phase behaviour, water activity) and ML models (aroma, taste, texture) predict each candidate's properties, with uncertainty.
5. **Bayesian optimization picks what to make.** It favours candidates that are either likely good or highly informative, and it decides which fidelity level to spend on each.
6. **Everything measured goes back into training.** The surrogate models, the sensory model and the generator are all updated.

**The big step that makes it work: perception as a learned embedding.** Today's systems mostly optimize instrument numbers that proxy for taste. The leap is a shared embedding where a GC-MS trace, a texture curve and a panel score are all points in one space. Then "taste like the original" becomes a measurable distance, and every instrument reading carries information about perception.

## Market 1 future: personalized formulation

The end state is a "digital eater" model for each person: a small set of learned parameters that predicts what they will like and how their body will respond. It sits on top of a shared population model, so it starts working from the first meal. The care team's limits stay hard constraints that no model can override.

**The models involved.**

| Model | Inputs | Output | Training signal | Status |
| --- | --- | --- | --- | --- |
| Nutrition calculator | Formula, ingredient composition database | Carbs, sugars, fiber, sodium per serving | None needed: it is arithmetic | Mature; must be exact, not learned |
| Population sensory model | Formula, process, instrument readouts | Predicted attribute scores and liking | Panel and consumer tests | Emerging (see building blocks) |
| Personal preference offsets | A person's ratings, reorders, plate waste | Shift from the population's liking for each attribute | That person's feedback | Standard hierarchical Bayesian method; new in food |
| Glycemic response model | Meal composition, person's history, optional CGM and microbiome | Predicted post-meal glucose curve | Continuous glucose monitor data | Validated in research cohorts |
| Shelf-life model | Water activity, pH, preservation, packaging | Predicted days to failure | Storage studies | Kinetic models + ML; must be confirmed by real storage tests |

**Evidence on the glycemic side.** Zeevi et al. measured glucose every 5 minutes for 7 days in 800 people and found large differences in response to identical meals ([Cell 2015](https://www.wisdom.weizmann.ac.il/~eran/zeevi_cell_2015.pdf)). PREDICT 1 (1,002 adults, including identical twins) found the gut microbiome explained 6.0% of glycemic variance, against 15.4% for meal macronutrients ([Nature Medicine 2020](https://doi.org/10.1038/s41591-020-0934-0)). That supports the brief's approach: microbiome data is an optional extra input, not the core of the product.

### Worked example: the date-sweetened cocoa bar

The brief: keep the reference bar's cocoa aroma, snap and melt; cut sugar; fit a person's carbohydrate target per serving; no peanuts. Here is how the problem looks to the optimizer.

**Why dates are not a simple swap.** USDA lists Medjool dates at 66.5 g sugars, 6.7 g fiber and 21.3 g water per 100 g ([USDA FoodData Central](https://fdc.nal.usda.gov/food-details/168191/nutrients)). Replacing 10 g of table sugar with 10 g of date purée removes only about 3.4 g of sugar, and it adds about 2.1 g of water. That water raises water activity, which shortens shelf life and softens the snap.

So the AI must solve a coupled problem:

- **Variables:** date purée, sucrose, cocoa mass, cocoa butter, a soluble fiber, a protein, a binder; bake or drying time.
- **Hard constraints:** sugars and total carbohydrate per serving within the care plan; water activity below the shelf-stability threshold; no listed allergens; cost per bar below target.
- **Objective:** smallest predicted sensory distance to the reference, using the population model plus this person's preference offsets.
- **Expected behaviour:** the optimizer will likely pair dates with a fiber or protein bulking agent and extend drying, because dates alone cannot cut sugar far without breaking texture and shelf life.

**How the loop personalizes safely.** A contextual bandit chooses which variant each person receives next. It only picks from a pre-approved safe set: every variant already satisfies the care plan and food-safety checks. Each delivery returns a rating, reorder and plate-waste signal (and CGM data when the person consents), which updates that person's model overnight.

### Dream big: the recipe compiler

At full scale, a person's brief compiles into per-portion production instructions. A depositing line or 3D printer then makes each portion to its exact formula and texture.

- **Where 3D printing earns its place:** texture-modified diets. Researchers have validated the IDDSI dysphagia texture scale for 3D-printed dishes with patients ([Nutrients 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12736333/)). An ML model can map a paste's rheology to its printability and IDDSI level before printing.
- **What limits it:** clinicians report printing and cleaning time as real barriers ([ASHA 2022](https://pubs.asha.org/doi/full/10.1044/2022_AJSLP-21-00391)). Printing should follow the software, not lead it.
- **Learning across providers without pooling health data:** federated learning lets each meal provider train on its own records and share only model updates.

**Market context in one line.** Massachusetts Medicaid members who received medically tailored meals had 31% fewer hospitalizations and 20% fewer emergency visits ([CT Mirror / Stateline](https://ctmirror.org/2026/07/09/massachusetts-food-as-medicine-medicaid/)). Funding remains fragile: North Carolina suspended its program in 2025 over budget concerns ([KFF Health News](https://cobbcountycourier.com/2026/09/cost-saving-medicaid-meal-deliveries-threatened-by-cuts-policy-uncertainty/)).

## Market 2 future: the prequalified backup-formula library

A backup-formula library is an options portfolio: pay to qualify alternatives before a shock, then switch fast when one hits. AI earns its keep in three places: deciding which products need backups, finding candidates that work, and predicting which candidates will pass the expensive qualification gates.

**The pipeline, step by step.**

1. **Forecast exposure.** Quantile forecasts of price and availability per ingredient, built from weather, crop-yield signals, port arrivals and stocks. For example, Ivory Coast port arrivals were 55,317 t in the week to 8 November 2026, against 107,139 t a year earlier ([Barchart via Webull](https://www.webull.com/news/15906785419915264)). The output is a probability that each ingredient breaches a cost threshold within a set horizon.
2. **Prioritize products.** Rank products by expected disruption cost minus qualification cost. Only the most exposed products get backup campaigns.
3. **Break each ingredient into roles.** Cocoa in a coating is really four jobs: fat phase, roasted aroma, colour and bitterness, coating flow. Each job gets a measurable spec, so substitutes can be matched role by role.
4. **Search and co-optimize recipe and process.** Bayesian optimization runs over blend ratios and process settings together. For roasted seed ingredients, the roast itself creates the cocoa-like aroma.
5. **Predict gate outcomes.** Classifiers estimate each candidate's chance of passing shelf-life, line, bloom and labelling checks. Expensive gates run only on likely passes.
6. **Score land use and deforestation risk per kg of finished product.** Use sourcing-region risk from satellite maps and supplier traceability data.

### Example 1: a lower-cocoa coating, role by role

| Role | Measured spec | Model | Candidate sources |
| --- | --- | --- | --- |
| Fat phase: snap and melt | Solid fat content curve; DSC melt peak; tempering behaviour | Phase-equilibrium thermodynamics + ML residual | Cocoa butter equivalents; fermentation-made cocoa butter equivalent ([C16 Biosciences](https://vegconomist.com/fermentation/c16-biosciences-debuts-fermented-cocoa-butter-equivalent-first-food-ingredient/)) |
| Roasted cocoa aroma | GC-MS and GC-olfactometry profile against the reference's key odorants | Odor embedding + Bayesian optimization over roast time and temperature | Roasted sunflower seed ([Planet A Foods, ChoViva](https://planet-a-foods.com/en/portfolio/chocolate)); grape seed ([Cargill and Voyage Foods, NextCoa](https://www.foodnavigator-usa.com/Article/2026/05/28/cargill-launches-cocoa-free-chocolate-alternative-nextcoa/)) |
| Colour and bitterness | Colorimetry; panel bitterness score | Regression on roast level and blend | Roast degree, partial cocoa retention |
| Coating flow and stability | Viscosity at enrobing temperature; bloom during storage | Rheology model + pass/fail classifier | Emulsifier level, particle size |

**Why the aroma target is tractable.** A GC-olfactometry study identified 38 key odorants that separate dark chocolates by sensory category, led by furanones, pyranones, lactones, a pyrrole and a pyrazine ([Deuscher et al., Molecules 2020](https://doi.org/10.3390/molecules25081809)). That gives the optimizer a concrete chemical target. It can then use an odor-embedding model to judge whether a different molecule mix would smell close enough.

**Commercial proof that substitutes can scale.** Planet A Foods raised $30M to grow ChoViva capacity from 2,000 to over 15,000 tonnes a year ([World Fund](https://worldfund.vc/articles/planet-a-foods-raises-30m-series-b-to-industrialize-and-solidify-its-position)). Nestlé Germany launched a ChoViva product line in April 2026 ([Munich Startup](https://www.munich-startup.de/en/news/planet-a-foods-partners-with-nestle-choviva-in-new-choco-crossies)). NotCo now runs as an AI licensing company with more than 35 commercial agreements ([Just Food](https://www.just-drinks.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals/)).

### Example 2: palm oil in a biscuit filling

The spec is the filling's solid fat content at several temperatures: firm on the shelf, spreadable at room temperature, melted in the mouth. Phase-equilibrium models can predict that curve for any oil blend before mixing.

The environmental objective needs care. Replacing palm oil with other vegetable oils leaves global emissions roughly unchanged but increases deforestation; making palm oil deforestation-free would cut its emissions by 92% ([Science of the Total Environment 2024](https://pubmed.ncbi.nlm.nih.gov/38145678/)). Oil palm yields more than twice as much oil per hectare as soy or rapeseed ([Wageningen University via Food Ingredients First](https://www.foodingredientsfirst.com/news/wur-palm-oil-efficiency-sustainability.html)). So the optimizer must be allowed to answer "keep palm, change the source".

The right output is a Pareto front, not a single winner. It shows sensory distance, cost, land per kg and deforestation risk side by side for each candidate, and the manufacturer chooses the trade-off.

### Dream big: always-on formula hedging

- **Risk-triggered campaigns.** When an ingredient's breach probability crosses a threshold, the system queues a qualification campaign on a self-driving pilot line automatically.
- **Factory offsets.** Each production line gets learned correction terms, just as each person does in Market 1. A formula qualified in one plant then transfers to another with a few confirmation runs.
- **Traceability as a model input.** Deep learning on satellite imagery already maps cocoa farms across Côte d'Ivoire and Ghana, trained on more than 100,000 georeferenced farms ([Kalischek et al., Nature Food 2023](https://doi.org/10.1038/s43016-023-00751-8)). Linking such maps to supplier lots turns deforestation risk into a per-batch number. The EU deforestation regulation makes that number commercially relevant from 30 December 2026 ([European Commission](https://trade.ec.europa.eu/access-to-markets/en/news/delay-until-december-2026-and-other-developments-implementation-eudr-regulation)).

## Roadmap

The path to the dream-big system is gated by two validations, not by calendar time. Everything in the "Now" column is buildable with published methods today. Dates for later phases are this report's projections.

&#91;embedded content: roadmap · 3 lanes, 3 phases, 2 gates; dates after 2027 are projections\]

**Gate 1** is passed when a model that predicts panel scores from instrument data beats the median trained panelist on held-out products. That turns most panel sessions into cheap instrument runs. **Gate 2** is passed when a robot can prepare, measure and send samples for taste testing with no manual reformulation between rounds.

## Hard limits and open problems

AI can rank and prune candidates, but it cannot replace physical proof. Real storage tests, allergen verification, regulatory approval and repeat purchase remain the final judges. The limits below are where an overconfident system would fail first.

| Limit | Why it matters | Credible mitigation |
| --- | --- | --- |
| Scarce, siloed data | Formulation and sensory data sit in private files with inconsistent standards; no shared multimodal food benchmark exists ([Tac & Kuhl](https://arxiv.org/pdf/2607.09529)) | Pre-competitive open datasets such as the Food Intelligence Lab's ([Food Ingredients First](https://www.foodingredientsfirst.com/news/ai-food-intelligence-lab-sustainable-protein-development.html)); federated training |
| Noisy sensory labels | Panels drift, and liking varies by culture and region | Reference samples in every session; model panelists as random effects; region-specific preference offsets |
| Mixtures and food matrix | Odor models are strongest on single molecules; in food, molecules mask and boost each other | Train on headspace measured from real products, not on recipe lists |
| Instrument–perception gap | Instrument texture readings do not always predict what people perceive | Learn the mapping from paired instrument and panel data; keep panels in the loop |
| Scale-up | Pilot batches behave differently from full production lines | Line-specific correction terms plus confirmation runs before approval |
| Optimizing the model, not the food | Pushing hard on predicted liking exploits model errors (Goodhart's law) | Uncertainty penalties; fixed human hold-out tests the optimizer never sees |
| Novel ingredients and labels | New ingredients need premarket approval; cell-cultured cocoa maker Celleste Bio is seeking it in the US, EU, Israel and UK ([Bakery & Snacks](https://www.bakeryandsnacks.com/Article/2026/04/28/chocolate-alternatives-move-mainstream-with-nestle-mondelez-barry-callebaut/)). Reformulated products may lose a legal product name | Encode approval status and naming rules as hard constraints |
| Health data and claims | Personal health data needs consent and protection; microbiome testing is not yet established for most clinical uses ([international consensus](https://pubmed.ncbi.nlm.nih.gov/39647502/)) | Care-team limits as hard constraints; no health claims without clinical evidence; on-device or federated learning |
| Language-model errors | LLMs write fluent recipes that can be chemically or legally wrong | Use LLMs for planning and reading only; every number passes through exact calculators and physical tests |

## Sources

**AI and ML methods**

- [Lee et al., A principal odor map unifies diverse tasks in olfactory perception, Science 2023](https://doi.org/10.1126/science.ade4401)
- [Tac & Kuhl, Artificial Intelligence and the Generative Science of Food Formulation, arXiv 2026](https://arxiv.org/pdf/2607.09529)
- [Moitra & Sculley, Bayesian Optimization for a Better Dessert, Google Research 2017](https://research.google/pubs/pub46507/)
- [Choy et al., Multi-task Bayesian optimisation of yeast-derived meaty flavours, Food Chemistry 2026](https://doi.org/10.1016/j.foodchem.2026.149493)
- [Theng et al., Multi-objective Bayesian optimisation of meat-analogue texture, J. Food Engineering 2025](https://doi.org/10.1016/j.jfoodeng.2025.112566)
- [Zheng et al., e-Sweet sweetness prediction, Frontiers in Chemistry 2019](https://www.frontiersin.org/journals/chemistry/articles/10.3389/fchem.2019.00035/full)
- [Teles dos Santos et al., Solid fat content prediction by solid–liquid equilibrium](https://core.ac.uk/download/163104906.pdf)
- [Robotic optimization of powdered beverages, arXiv 2024](https://arxiv.org/html/2409.11499v2)
- [Acceleration Consortium formulations self-driving lab](https://acceleration.utoronto.ca/sdls/sdl5-formulations)
- [Food System Innovations Food Intelligence Lab, The Plant Base](https://www.theplantbasemag.com/news/food-system-innovations-launches-ai-focused-food-intelligence-lab-to-accelerate-sustainable-protein)
- [Nectar sensory dataset interview, The Spoon](https://thespoon.tech/we-talked-with-nectar-about-their-plans-to-build-an-ai-for-better-tasting-alt-proteins)
- [Osmo Series B, Pulse 2.0](https://pulse2.com/osmo-70-million-series-b-closed-for-ai-based-olfaction-platform/amp/)

**Personalized nutrition**

- [Zeevi et al., Personalized Nutrition by Prediction of Glycemic Responses, Cell 2015](https://pubmed.ncbi.nlm.nih.gov/26590418/)
- [Berry et al., PREDICT 1, Nature Medicine 2020](https://doi.org/10.1038/s41591-020-0934-0)
- [USDA FoodData Central, Medjool dates](https://fdc.nal.usda.gov/food-details/168191/nutrients)
- [IDDSI and 3D food printing, Nutrients 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12736333/)
- [Allied health views on 3D food printing, ASHA 2022](https://pubs.asha.org/doi/full/10.1044/2022_AJSLP-21-00391)
- [International consensus on microbiome testing](https://pubmed.ncbi.nlm.nih.gov/39647502/)
- [Massachusetts Medicaid medically tailored meals results, CT Mirror / Stateline](https://ctmirror.org/2026/07/09/massachusetts-food-as-medicine-medicaid/)
- [Medicaid meal programs under budget pressure, KFF Health News](https://cobbcountycourier.com/2026/09/cost-saving-medicaid-meal-deliveries-threatened-by-cuts-policy-uncertainty/)

**Supply resilience and land use**

- [Kalischek et al., Cocoa plantations are associated with deforestation in Côte d'Ivoire and Ghana, Nature Food 2023](https://doi.org/10.1038/s43016-023-00751-8)
- [Deuscher et al., Key aroma compounds of dark chocolates, Molecules 2020](https://doi.org/10.3390/molecules25081809)
- [Replacing palm oil with other vegetable oils, Science of the Total Environment 2024](https://pubmed.ncbi.nlm.nih.gov/38145678/)
- [Wageningen palm oil land-efficiency study, Food Ingredients First](https://www.foodingredientsfirst.com/news/wur-palm-oil-efficiency-sustainability.html)
- [Cocoa price spike and crash, ConfectioneryNews](https://www.confectionerynews.com/Article/2026/03/03/cocoa-prices-crash-after-2024-record-highs-as-demand-slump-hits-global-chocolate-market/)
- [Ivory Coast port arrivals, Barchart via Webull](https://www.webull.com/news/15906785419915264)
- [EUDR application delayed to 30 December 2026, European Commission](https://trade.ec.europa.eu/access-to-markets/en/news/delay-until-december-2026-and-other-developments-implementation-eudr-regulation)
- [Planet A Foods Series B, World Fund](https://worldfund.vc/articles/planet-a-foods-raises-30m-series-b-to-industrialize-and-solidify-its-position)
- [Nestlé and ChoViva, Munich Startup](https://www.munich-startup.de/en/news/planet-a-foods-partners-with-nestle-choviva-in-new-choco-crossies)
- [Cargill NextCoa, FoodNavigator-USA](https://www.foodnavigator-usa.com/Article/2026/05/28/cargill-launches-cocoa-free-chocolate-alternative-nextcoa/)
- [C16 Biosciences fermented cocoa butter equivalent, vegconomist](https://vegconomist.com/fermentation/c16-biosciences-debuts-fermented-cocoa-butter-equivalent-first-food-ingredient/)
- [NotCo AI commercial agreements, Just Drinks](https://www.just-drinks.com/newsletters/notco-sells-brazil-assets-in-wake-of-argentina-uruguay-disposals/)
- [Alt-chocolate regulation and Celleste Bio, Bakery & Snacks](https://www.bakeryandsnacks.com/Article/2026/04/28/chocolate-alternatives-move-mainstream-with-nestle-mondelez-barry-callebaut/)
