# Samsung Food: Multimodal Food Intelligence and Connected Cooking — A Deep Research Report

Nov 18, 2026 · @Rey Riordan

## The short version

Samsung Food is a system of cooperating AI components, not one model. It answers one question: *given what I like, what I have and what I am trying to achieve, what should I cook, and can my kitchen help?* Samsung publishes product behavior but not its architecture. Each deep dive below therefore pairs what Samsung has disclosed with the closest published research for that stage.

- **Recipe understanding (NLP).** Samsung says its recipe content is structured with deep-learning NLP [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). Whisk, the company Samsung bought in 2019 [\[17\]](https://techcrunch.com/2025/01/05/samsungs-new-tvs-can-find-recipes-for-dishes-in-shows), maps ingredients to more than 140,000 store items [\[20\]](https://docs.whisk.com/).
- **Recommendation.** Samsung's "Tailored for You" recommends recipes from nutritional needs, chosen diets and past recipe preferences [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). The best public blueprint is a multilingual recipe recommender from **Cookpad, not Whisk**: about 18 million users and 4 million recipes, scored by a bilinear model over ingredient, cooking-skill and image features [\[33\]](https://arxiv.org/pdf/2007.13440).
- **Vision.** The fridge camera grew from 33 to 37 recognizable fresh foods, plus 50 user-named packaged items, all on-device [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature) [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/). In 2026 Samsung rebuilt it with Google Gemini to recognize more items and read labels [\[44\]](https://www.koreaherald.com/article/10640807).
- **Generation with validation.** Samsung says recipe personalization uses generative AI and LLMs [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), and its terms allow OpenAI [\[5\]](https://samsungfood.com/policy/terms/). In a 2025 benchmark, general-purpose models' nutrition estimates had weighted errors of 23.5% to 43.6% [\[51\]](https://arxiv.org/pdf/2508.09966). Numbers should come from calculators, not the model.
- **Action.** Structured recipe steps can be sent to compatible SmartThings ovens [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). Samsung patents describe turning recipe text into machine-usable cooking data and appliance setting commands [\[13\]](https://9235.net/patent/US2023134600A1.html) [\[14\]](https://patents.google.com/patent/US12105943).
- **The moat is context and execution.** Samsung reported over six million users as of July 2024 and charges $6.99 a month for Food+ [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). The foundation models underneath are replaceable parts.

## What Samsung has shipped, stage by stage

Every stage of the pipeline maps to at least one shipped or announced feature. The table is the evidence base for the deep dives.

| Pipeline stage | Feature | What it does | Evidence |
| --- | --- | --- | --- |
| Recipe understanding | Save from any source | Saves recipes from websites, social posts and family cookbooks "in a standard format"; ingredients can go straight to a shopping list [\[7\]](https://news.samsung.com/ca/samsung-announces-global-launch-of-samsung-food-an-ai-powered-personalized-food-and-recipe-service) | [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) |
| Recipe understanding | Add recipe from photo | Scans a cookbook page, handwritten card or screenshot into a recipe; shipped 30 Jul 2025, 3 free scans then Food+ [\[15\]](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/) [\[16\]](https://sammyguru.com/samsung-food-app-now-lets-you-add-recipes-from-photos/) | [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674) |
| Recommendation | Tailored for You | Weekly recipe and snack picks from nutritional needs, chosen diets and past preferences; 3 days a week free, 7 with Food+ | [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Recommendation | Personalized meal plans (Food+) | Plans built from the Food List, prioritizing ingredients near their use-by date | [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Vision | AI Vision Inside (fridge camera) | Recognized 37 fresh foods and 50 user-named packaged items on-device; Gemini-based version announced for 2026 | [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) |
| Vision | Vision AI for the Food List (phone) | Snap a photo of food items to add them to the Food List (Food+) | [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Vision | Image-to-Recipe | Recognizes meals and food items in photos, then finds dishes that use them (Food+); previewed at IFA 2023 [\[6\]](https://news.samsung.com/global/meet-samsung-food-at-ifa-2023-the-ultimate-personalized-cooking-assistant) and demoed with ingredient photos at CES 2024 [\[9\]](https://news.samsung.com/global/ces-2024-cooking-for-a-crowd-how-oliver-paterson-uses-ai-and-samsung-food-to-spice-up-a-party) | [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024) |
| Generation | Personalize | "Powered by Food AI"; adapts recipes to dietary requirements | [\[53\]](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024) [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) |
| Generation | AI step-by-step instructions | Generates guided steps for any recipe (v5.39.0, Mar 2025) | [\[3\]](https://apps.apple.com/ca/app/id1133637674) |
| Generation | Video to Recipe (Family Hub) | Turns recommended cooking videos into easy-to-follow steps; announced CES 2026 | [\[11\]](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026) |
| Health context | Tailored Meal Plan, nutrition goals | Uses the Samsung Health profile with consent; nutrition goals draw on WHO, US dietary guidelines and USDA sources | [\[53\]](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024) [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Action | Smart cooking with SmartThings | Guided cooking mode and sending settings to a compatible oven | [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) |

### How to read the evidence

- **Confirmed**: stated by Samsung or Samsung Food (newsroom, help center, app listing, terms, patents).
- **Reported**: stated by press coverage, not by Samsung.
- **Research**: from papers. Shows what a technique can do, not what Samsung runs.
- **Inferred**: a defensible teaching architecture reconstructed from product behavior. Samsung has not published one.

## The problem (Slide 1)

"What should I cook?" looks like one question, but its answer depends on five sources that normally never talk to each other. In ML terms it is a **contextual ranking problem under hard constraints**, learned from weak, indirect signals.

### Five disconnected sources

| Source | What it holds | Where Samsung gets it |
| --- | --- | --- |
| Taste | What the household likes and avoids | Saves, searches, plans and past recipe preferences [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Recipes | What could be cooked | Saved and imported recipes, structured by NLP [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) |
| Food List | What is actually in the kitchen | Fridge camera, phone photos and purchases added at checkout [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) |
| Health goals | Calorie, macronutrient and diet targets | Samsung Health profile, with consent [\[53\]](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024) |
| Appliances | What the kitchen can do automatically | SmartThings-connected ovens and Family Hub fridges [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/) |

A classic recipe app knows the catalog but not the household. A fridge camera knows some inventory but not taste or goals. Samsung's bet is that owning several of these sources at once produces better answers than any one alone.

### The ML framing: constrained contextual ranking

For a user *u* in context *c* (time of day, Food List, diet, goals), score every candidate recipe *r* and return the best few that pass the hard rules:

```latex
\text{recommend}(u, c) = \operatorname{top}_k \; \{\, s(u, r, c) \;:\; r \in \mathcal{R},\ \text{allowed}(r, u) \,\}
```

The split matters. **Hard constraints** such as allergies or a vegan diet are filters: a nut recipe for a nut-allergic user must never appear, however high it scores. **Soft preferences** such as cuisine or cooking time belong inside the score *s*. **Context boosts** shift the score; Samsung's meal plans, for example, prioritize ingredients near their use-by date [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/).

### The signal problem: implicit feedback

People rarely rate recipes. The system mostly sees views, saves, plans and shopping-list adds, which are clues rather than verdicts.

Hu, Koren and Volinsky's classic paper names the core issue: implicit data has no clear negative evidence, so it should be treated as preferences held with widely varying confidence [\[56\]](https://samuel-deng.github.io/math4ml_su24/project/Hu_et_al.pdf). Cookpad's recommender applied this to recipes, weighting ten interaction types by how strongly each predicts future cooking [\[33\]](https://arxiv.org/pdf/2007.13440). A save is a stronger signal than a view, but a saved recipe may still never be cooked.

## The architecture (Slide 2)

Samsung Food is a pipeline of specialist components that share one food graph. Each stage uses a different family of machine learning, and the stages pass structured data to each other, not free text.

| Stage | Input → output | ML family | Evidence |
| --- | --- | --- | --- |
| 1. Understand recipes | Web page, typed text or photo → canonical ingredients, quantities, actions | Sequence labeling, entity linking, vision-language models | Confirmed that NLP is used [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/); methods Inferred |
| 2. Food graph | Canonical ingredients → products, nutrition, allergens, diets | Knowledge graph, curated plus learned links | Whisk's product ontology [\[20\]](https://docs.whisk.com/) |
| 3. Represent users and recipes | Behavior and recipe features → vectors | Embeddings, hybrid matrix factorization | Research [\[33\]](https://arxiv.org/pdf/2007.13440) |
| 4. Retrieve and rank | User, context, Food List → ordered recipes | Two-stage recommender | Feature Confirmed [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/); model Inferred |
| 5. Observe the kitchen | Camera frames and phone photos → Food List updates | Image classification, detection, OCR, multimodal LLM | Confirmed [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature) |
| 6. Personalize with generation | Source recipe and constraints → adapted recipe or plan | LLM generation plus rule-based validators | Generation Confirmed [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/); validators Inferred |
| 7. Act through appliances | Structured steps → typed device settings | Semantic parsing, rules | Confirmed for ovens [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/); patents [\[13\]](https://9235.net/patent/US2023134600A1.html) [\[14\]](https://patents.google.com/patent/US12105943) |

The design principle is **structured hand-offs**. An LLM may write prose for the user, but what flows between stages is typed data: an ingredient ID, a quantity with a unit, a temperature in °C. That is what lets later stages check earlier ones.

&#91;embedded content: Samsung Food pipeline · 7 stages and a feedback loop (internals inferred)\]

Three understanding models turn raw inputs into structured data. The food graph and Food List are the shared state that the recommender, the LLM and the validation gates all read.

## Deep dive 1: understanding recipes (NLP and the food graph)

Before a recipe can be ranked, adapted or cooked, it has to become data: every ingredient a canonical entity with a quantity and unit, every step an action with parameters. Samsung confirms that recipe content is structured with deep-learning NLP [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). The methods below are the standard ways to do it (Research and Inferred).

### Where recipes come from

- **Web pages with markup.** Many recipe sites publish schema.org Recipe data with fields such as `recipeIngredient` and `recipeInstructions` [\[32\]](https://support.google.com/webmasters/answer/173379). Samsung's help center warns that not every site's metadata is compatible [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box).
- **Free text.** Blog posts without markup and social captions need the full NLP pipeline below.
- **Photos of written recipes.** The photo scanner, shipped July 2025 [\[3\]](https://apps.apple.com/ca/app/id1133637674), covered at the end of this section.

### Step 1: ingredient tagging as sequence labeling

Each ingredient line is a tiny sentence with a predictable grammar. The model assigns a tag to every token:

| Token | 1½ | cups | plain | flour | , | sifted |
| --- | --- | --- | --- | --- | --- | --- |
| Tag | QTY | UNIT | NAME | NAME | OTHER | PREP |

Doing this by hand is expensive. Before automating, the New York Times had staff type recipes into a form field by field, and an average recipe needed over 50 fields [\[34\]](https://digitalhumanitiesnow.org/?p=64609); Samsung Food's manual Recipe Builder similarly asks for each ingredient in turn [\[2\]](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder).

The New York Times solved this with a **conditional random field (CRF)** trained on lines tagged by hand. Its tagger turns `1 pound carrots, young ones if possible` into quantity, unit, name and comment fields [\[30\]](https://github.com/NYTimes/ingredient-phrase-tagger). A CRF scores the whole tag sequence at once, so it learns rules like "a unit usually follows a quantity." An open-source successor trained on 60,000 ingredient sentences returns a confidence score with each field [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html), which lets an app flag doubtful parses.

Modern systems stack a pre-trained Transformer under the CRF. A 2023 recipe-understanding framework, for example, tags entities with BERT, a BiLSTM and a CRF, then uses BERT again to predict relations between them [\[64\]](https://aclanthology.org/2023.findings-acl.261.pdf).

### Step 2: normalization, many strings to one entity

"Plain flour," "AP flour" and "all-purpose flour" must collapse into one entity. The scale is large: the Inverse Cooking authors reduced 16,823 raw ingredient names in Recipe1M to 1,488 by merging, clustering and dropping rare items [\[24\]](https://arxiv.org/pdf/1812.06164).

Cookpad's multilingual system shows a practical, unsupervised approach. It kept the top 1,500 ingredients per language, matched new strings by token overlap, and used FastText word-vector similarity to catch misspellings [\[33\]](https://arxiv.org/pdf/2007.13440). Because it needs no labels, it works for any language that separates words with spaces.

### Step 3: entity linking to the food graph

A canonical ingredient is only useful once it links to facts. Whisk describes an ontology of products that maps how food components connect, and maps ingredients to more than 140,000 store items [\[20\]](https://docs.whisk.com/). It enriches ingredient data with proprietary datasets on cooking impact, flavor, perishability and nutrition [\[20\]](https://docs.whisk.com/).

Whisk's app was already extracting the title, photo and ingredients from saved recipe pages into structured fields in 2019 [\[19\]](https://techcrunch.com/2019/12/17/whisks-a-i-powered-recipe-app-lets-you-send-the-ingredients-to-your-door).

In Samsung Food today, matching ingredients to a food database is what produces nutrition information [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). Its terms also mention an open-source food products database [\[5\]](https://samsungfood.com/policy/terms/). Allergen and diet labels can then be inherited from the graph rather than guessed per recipe (Inferred).

### Step 4: steps become actions

Instructions need a richer structure than a flat list of tags. The English Recipe Flow Graph corpus annotates 300 recipes with recipe-specific entities (actions, tools, ingredients, intermediate products) and a graph of how steps depend on each other [\[58\]](https://aclanthology.org/2020.lrec-1.638). Human annotators agreed at 82.3 to 90.5 F1, and trained models reached 71.1 to 87.5 F1 [\[58\]](https://aclanthology.org/2020.lrec-1.638). A Samsung patent likewise describes running recipe text through several NLU models to identify its semantic elements [\[13\]](https://9235.net/patent/US2023134600A1.html). Deep dive 5 follows this all the way to an oven.

### The photo path: now mostly one model call

The photo scanner adds a reading step in front of this pipeline. The older way chains OCR, layout analysis and tagging. TrOCR, for instance, pairs a pre-trained image Transformer encoder with a text Transformer decoder and handles printed and handwritten text [\[27\]](https://arxiv.org/abs/2109.10282v5).

Layout is the classic trap: one competing scanner app tells users that two-column ingredient lists need separate selections [\[36\]](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-the-Recipe-Scanner).

The modern way is a single vision-language model that reads the page and writes the structured recipe directly. Donut showed a Transformer mapping a document image straight to structured output with no separate OCR [\[28\]](https://arxiv.org/abs/2111.15664v3). General models such as LLaVA-1.5 feed CLIP image features through a small projection into a language model [\[29\]](https://arxiv.org/abs/2310.03744). Either way, the draft still has to go through normalization and linking, because a model's "AP flour" is not yet an ID in the food graph.

&#91;embedded content: photo-to-recipe pipeline · 6 stages, 2 reading paths (inferred)\]

Path A chains specialist models; Path B reads the page in one pass. Either way, the draft is normalized against the food graph and checked by the user before it can drive search, nutrition, shopping or an oven.

## Deep dive 2: the recommender learns a recipe map (Slide 3)

Ranking recipes for a household is the core of the product. Samsung discloses the recommender's inputs (nutritional needs, chosen diets and past recipe preferences) but not its model [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). Whisk's documentation says only that its system learns preferences when a user picks a recipe or product [\[20\]](https://docs.whisk.com/).

**Correction:** the most detailed public blueprint, Twomey et al. (RecSys 2020), comes from **Cookpad**, not Whisk. All four authors work at Cookpad, and the data is Cookpad's: about 18 million users, 4 million recipes and five languages (Arabic, English, Indonesian, Russian, Spanish) [\[33\]](https://arxiv.org/pdf/2007.13440). Treat it as how a comparable recipe company built this, not as Samsung's inherited code.

### Step 1: turn each recipe into a vector

Cookpad concatenated several feature families into one recipe vector [\[33\]](https://arxiv.org/pdf/2007.13440):

- **Normalized ingredients**, from the unsupervised normalizer in Deep dive 1.
- **Cooking skills**: ingredient–verb pairs such as onion–slice or eggs–beat, kept when their mutual information passes a threshold.
- **Image embeddings**: a DenseNet-201 trained self-supervised on about 1.5 million recipe photos. Its labels were the most common words in recipe titles across all five languages, mapped into one shared 300-dimensional space.
- **Text and metadata**: TF-IDF text reduced to 300 dimensions, plus about 14 features such as step count and cooking time.

**Why images help:** two recipes may share no words yet look alike, and a photo exists from the moment a recipe is posted. Image features let the model place a brand-new recipe on the map before anyone has interacted with it.

### Step 2: turn each user into a vector

A user's profile is the normalized average of the vectors of recipes they interacted with during a profile period [\[33\]](https://arxiv.org/pdf/2007.13440). You are, roughly, the centroid of what you cooked.

### Step 3: score with a bilinear model

Cookpad used LightFM, which scores a user–recipe pair as a dot product of their embeddings plus a bias for each [\[33\]](https://arxiv.org/pdf/2007.13440):

```latex
S(u, r) = f\left( \mathbf{x}_u^{\top} \mathbf{x}_r + b_u + b_r \right)
```

The key trick is that LightFM builds each user and item vector as the sum of the latent vectors of its features [\[55\]](https://arxiv.org/pdf/1507.08439). A new recipe made of known ingredients and a known look therefore gets a sensible vector immediately. Your slide's form, userᵀ × W × recipe, is the same idea: W is the learned low-rank matrix that decides which recipe features matter to which user features.

### Step 4: learn from implicit feedback

Cookpad weighted ten interaction types by how strongly each predicts future cooking [\[33\]](https://arxiv.org/pdf/2007.13440). This is the confidence idea from Hu, Koren and Volinsky: an observed action is a preference, held with more or less confidence [\[56\]](https://samuel-deng.github.io/math4ml_su24/project/Hu_et_al.pdf). Bayesian optimization then chose the model type, features and loss. Hybrid models, mixing behavior with content features, were selected every time over pure collaborative or pure content-based models [\[33\]](https://arxiv.org/pdf/2007.13440).

### Step 5: handle cold start

A new user has no history. Cookpad trained a separate "clickability" model, a three-layer neural network, on search results people clicked versus ones they saw and skipped. It combines the user's search query with recipe features [\[33\]](https://arxiv.org/pdf/2007.13440). More generally, the LightFM paper found hybrid models do at least as well as content-only models in cold-start settings, and better once any interaction data exists [\[55\]](https://arxiv.org/pdf/1507.08439). In Samsung Food, stated diets, nutrition goals and first saves play this role [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) (Inferred).

### How well it worked, and its limits

For English, Indonesian, Russian and Spanish, the personalization model's mAP@1 was about 0.28 to 0.41, against roughly 0.09 to 0.11 for random ranking [\[33\]](https://arxiv.org/pdf/2007.13440). Re-ranking search results improved mAP@1 by about 20% over the clickability model. But it could not beat the existing served order on recipe clicks, only on stronger actions such as bookmarks [\[33\]](https://arxiv.org/pdf/2007.13440). The authors call this early work with linear models, from one platform and without ablation studies [\[33\]](https://arxiv.org/pdf/2007.13440).

### At production scale: retrieve, then rank

Large recommenders split the job in two. YouTube's well-known design first runs a deep candidate-generation model to narrow the pool, then a separate deep ranking model to order what is left [\[57\]](https://research.google/pubs/pub45530) (Research). For Samsung Food the natural version is: filter by hard constraints and the Food List, generate candidates by embedding similarity, then rank with the full context (Inferred). That context is exactly what Samsung advertises: nutritional needs, diets and past preferences, plus use-by dates for Food+ users [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/).

## Deep dive 3: the fridge becomes a sensor (Slide 4)

Recommendations get better when the system knows what food is actually in the house. Samsung's fridge camera turns pixels into inventory events, and its move from a fixed 33-item vocabulary to cloud AI shows why production vision is harder than a demo.

### From 33 foods to Gemini

| When | What Samsung says it recognizes | Where it runs | Evidence |
| --- | --- | --- | --- |
| CES 2026 onward | More fresh and packaged foods via Google Gemini; reads handwritten or printed container labels | Cloud | [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) [\[44\]](https://www.koreaherald.com/article/10640807) |
| March 2025 | 37 fresh foods, plus up to 50 packaged items saved under user-chosen names | On-device | [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature) [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) |
| Before March 2025 | 33 fresh foods (the 2025 release says four were added) | On-device | [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature) |

Samsung states the recognition runs on deep-learning models that are updated periodically to improve accuracy [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature). Its footnotes are a useful list of real limits: the camera cannot see the door bins or freezer [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature), and anything it cannot recognize may be listed as an "unknown item" [\[43\]](https://news.samsung.com/uk/samsung-to-unveil-ai-vision-built-with-google-gemini-at-ces-2026).

### The recognition pipeline (Inferred)

1. **Capture on change.** A downward-facing camera watches items as they go in or come out [\[54\]](https://www.sammobile.com/?p=16650384).
2. **Detect.** Find the region of the frame that holds the item.
3. **Encode.** A convolutional network or Vision Transformer turns that region into a feature vector.
4. **Classify, or say "unknown."** Compare against the supported vocabulary; below a confidence threshold, output unknown rather than guess [\[43\]](https://news.samsung.com/uk/samsung-to-unveil-ai-vision-built-with-google-gemini-at-ces-2026).
5. **Track.** Turn "apple seen entering" and "apple seen leaving" into Food List add and remove events.
6. **Ask.** Let the user confirm or fix uncertain results.

The 50 user-named packaged items are a different, easier problem: recognizing *this exact box of cereal again* (instance recognition), not "cereal" in general.

### Closed vocabulary versus open vocabulary

The 33- and 37-item systems are **closed-set classifiers**: a model trained on a fixed list, small enough to run on the appliance, with everything else treated as unknown. That is a deliberate trade-off, because food is a long tail. The classic Food-101 benchmark already has 101 dishes and 101,000 images [\[37\]](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101), and its authors' own 2014 method reached 50.76% accuracy, beaten only by a convolutional network [\[38\]](https://mlanthology.org/eccv/2014/bossard2014eccv-food). Food2K, from 2021, has 2,000 categories and over a million images [\[39\]](https://arxiv.org/abs/2103.16107v1).

**Open-vocabulary** models remove the fixed list. CLIP learns from image–text pairs scraped from the web and classifies an image by comparing it with text prompts, with no task-specific training [\[40\]](https://arxiv.org/pdf/2103.00020). CLIP-based zero-shot methods report about 93% accuracy on Food-101 [\[41\]](https://arxiv.org/pdf/2510.03903). A multimodal LLM such as Gemini goes further still: it can name an unfamiliar item and read the text on its label [\[44\]](https://www.koreaherald.com/article/10640807).

The catch is where it runs. Samsung's own release frames the Gemini version as built to "unlock its existing limitations" and recognize more items [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/). That buys coverage at the cost of a cloud round trip, network dependence and sending kitchen images off the device.

A Samsung executive described the old system as on-device recognition, and the new one as matching food against data in the cloud and reading labels [\[21\]](https://www.tomsguide.com/home/home-appliances/2026-could-be-a-tipping-point-for-the-smart-kitchen-according-to-samsung).

### Why it is still hard

- **Fine-grained look-alikes.** In a 2025 study of six vision-language models, the best (Gemini 2.0 Flash) scored 85.8% on broad food categories, 74.7% with subcategories and 50.0% once cooking style was added [\[50\]](https://arxiv.org/pdf/2504.06925).
- **Distractions and clutter.** The same study saw models misled by backgrounds and shapes, for example whole-grain bread taken for croquettes, and scoring lower on images with several foods [\[50\]](https://arxiv.org/pdf/2504.06925).
- **Blind spots.** Door bins, the freezer, and food eaten straight from the bag never pass the camera [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature).

### The Food List is an estimate, not a database

Because every input is noisy, the Food List is best treated as a probabilistic belief about the kitchen. Confidence scores, an explicit unknown class and one-tap correction matter as much as top-1 accuracy. Samsung adds other noisy sensors to the same list: phone photos of groceries and purchases added at checkout (Food+) [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/).

This is also where a photo becomes recipes. Image-to-Recipe recognizes meals and food items in a photo, then looks for dishes that use them [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024). In pipeline terms, vision output becomes the context *c* for the recommender in Deep dive 2.

### Going further: a recipe from a photo of the dish (research, not shipped)

Could the camera skip the recipe catalog and write a recipe for whatever dish it sees? Researchers have tried three ways. Samsung's public features use only the first, recognition plus search.

&#91;embedded content: dish photo to recipe · 3 research approaches\]

Retrieval is safe but limited to known recipes; the two generative families can write new recipes but must guess what the camera cannot see.

#### Approach 1: retrieval in a shared embedding space

Train one encoder for food images and one for recipes so that a dish photo and its recipe land close together in a single vector space [\[23\]](https://pic2recipe.csail.mit.edu/). A new photo is answered with its nearest recipe. Recipe1M made this possible in 2017 with over a million recipes and 800,000 images [\[22\]](https://openaccess.thecvf.com/content_cvpr_2017/html/Salvador_Learning_Cross-Modal_Embeddings_CVPR_2017_paper.html).

Later work such as a 2021 hierarchical recipe Transformer simplified the design to standard high-performing text and image encoders [\[45\]](https://arxiv.org/pdf/2103.13061).

The standard test hides the true recipe among 1,000 candidates. **R@1** is how often it ranks first; **median rank (medR)** is its typical position, where random guessing gives about 500 [\[47\]](https://arxiv.org/pdf/1805.00900). Progress has been steep:

| Year | System | Idea | R@1 among 1,000 |
| --- | --- | --- | --- |
| 2026 | SIMMER | One multimodal-LLM embedding model for both images and recipes | 87.5% (previous best 81.8%) [\[49\]](https://arxiv.org/html/2604.15628) |
| 2022 | Transformer decoders with multimodal regularization | Transformer encoders with multimodal regularization | 66.9% [\[48\]](https://openaccess.thecvf.com/content/CVPR2022W/MULA/supplemental/Shukor_Transformer_Decoders_With_CVPRW_2022_supplemental.pdf) |
| 2017 | Recipe1M baseline | Joint embedding plus a food-category objective | 24.0%, as reported in a 2018 comparison [\[46\]](https://arxiv.org/pdf/1804.11146) |

Retrieval can only return recipes that already exist in the collection [\[25\]](https://arxiv.org/pdf/2308.14391). That is fine for Samsung's use, which is to find dishes to cook, not to invent them.

#### Approach 2: two-stage generation

Inverse Cooking (Facebook AI Research, 2019) writes a new recipe in two steps [\[24\]](https://arxiv.org/pdf/1812.06164):

1. A ResNet-50 encodes the image.
2. An ingredient decoder predicts an **unordered set**. Its per-step outputs are max-pooled, so listing order never counts as an error.
3. A 16-block Transformer writes the title and steps while attending to both the image and the predicted ingredients.

On Recipe1M it reached ingredient IoU 32.11 and F1 48.61, against 19.85 and 33.13 for retrieval [\[24\]](https://arxiv.org/pdf/1812.06164). In a small user study, people guessing ingredients from photos scored F1 35.20, below the model's 49.08. Judges accepted real recipes 80.33% of the time, generated ones 55.47% and retrieved ones 48.81% [\[24\]](https://arxiv.org/pdf/1812.06164).

FIRE (WACV 2024) swapped in BLIP for titles, a Vision Transformer for ingredients and T5 for instructions, for a small gain to F1 49.27 [\[25\]](https://arxiv.org/pdf/2308.14391). Its authors list the hard limits: no quantities at test time, an unrelated recipe for a dish absent from training (Pav Bhaji), and BLEU and ROUGE scores that miss whether a recipe is actually right [\[25\]](https://arxiv.org/pdf/2308.14391).

#### Approach 3: one multimodal-LLM call

Today you can hand a dish photo to a multimodal LLM and get a full recipe back in one call. The evidence says this is fluent but not reliable on what the camera cannot see:

- **Domain tuning still matters.** LLaVA-Chef fine-tuned LLaVA on recipe data in stages and concluded that domain-specific training "remains paramount" [\[26\]](https://arxiv.org/html/2408.16889).
- **Ingredients are partly guessed.** On a 1,000-photo real-world benchmark, GPT-4o's best ingredient F1 was 0.737 and Gemini 2.5 Pro's was 0.579 [\[51\]](https://arxiv.org/pdf/2508.09966). A fine-tuned specialist from the benchmark's own authors reached 0.883, so treat that comparison with care.
- **Process is mostly invisible.** Even the best model identified cooking style only about half the time, and the authors note it often cannot be determined from an image alone [\[50\]](https://arxiv.org/pdf/2504.06925).
- **Errors cascade.** A 2025 study of a classifier-then-Gemini pipeline formalized "semantic error propagation": a wrong food label upstream produces a confidently wrong recipe downstream [\[52\]](https://arxiv.org/html/2511.08215v1).

#### Where Samsung sits

Samsung's shipped dish-photo feature is Approach 1 in spirit: recognize, then search [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024). Samsung Health's "Scan meal," found in testing in November 2026, goes a step further and estimates food names, ingredients, portions and calories from a photo [\[18\]](https://www.sammobile.com/?p=16688942). Samsung also holds a patent on generating recipe information by analyzing the images, voice and text in cooking content [\[14\]](https://patents.google.com/patent/US12105943). A patent shows intent, not a product.

## Deep dive 4: generative AI adapts, rules keep it safe (Slide 5)

A language model can rewrite a recipe as vegan or plan a week of dinners in fluent prose, but it cannot be trusted to get allergens, arithmetic or cooking temperatures right. The defensible design is **retrieve, generate, then validate**. Samsung confirms the generation; the validation layer is Inferred.

### What Samsung's generative features do (Confirmed)

- **Personalize**, "powered by Food AI," adapts recipes to the user's dietary requirements [\[53\]](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024). Samsung says recipe personalization uses generative AI and LLMs [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/).
- **AI step-by-step instructions** can be generated for any recipe (v5.39.0, March 2025) [\[3\]](https://apps.apple.com/ca/app/id1133637674).
- **Meal plans** are built from the Food List, prioritizing ingredients near their use-by date [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/).

### Stage 1: ground the model in real data

Retrieval-augmented generation (RAG) pairs a model's built-in "parametric" memory with documents fetched at query time. In the original paper, this produced more specific and more factual text than a model working from its weights alone [\[59\]](https://arxiv.org/abs/2005.11401). For Samsung Food, the retrieved context would be the structured source recipe, the Food List, the user's diet and allergies, nutrition targets and serving count (Inferred). The model then edits something real instead of inventing a recipe from memory.

### Stage 2: generate a structured draft

The model proposes substitutions, rewritten steps or a weekly plan. To be checkable, it should return typed data (ingredient IDs, quantities, units) alongside any prose. Google's PaLM recipe demo, for example, used a final prompt to turn generated recipes into JSON and lowered the sampling temperature for that formatting step [\[35\]](https://developers.googleblog.com/en/generative-ai-food-coach-that-pairs-food-with-your-mood).

Substitution is a learnable pattern in its own right. A study of user-made substitutions found people tend to swap rare, allergenic, expensive or unhealthy ingredients for common, non-allergenic, cheaper or healthier ones [\[65\]](https://arxiv.org/pdf/2302.07960).

### Stage 3: deterministic gates

Every draft must pass rule-based checks that read the food graph, not the model's opinion (Inferred):

| Gate | What it checks | Why a rule, not the model |
| --- | --- | --- |
| Allergens | No ingredient, or ingredient inside a compound item, from the user's allergen list | US law names nine major allergens since sesame was added on 1 Jan 2023 [\[62\]](https://prnewswire.com/news-releases/learn-about-the-faster-act-with-new-resources-from-fda-302332827.html): milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy and sesame [\[63\]](https://www.thefdalawblog.com/?p=12535). A miss is a safety incident, not a style issue. |
| Nutrition | Recompute calories and macros from linked ingredient data | General models' nutrition estimates had weighted errors of 23.5% to 43.6% on a 2025 benchmark [\[51\]](https://arxiv.org/pdf/2508.09966). |
| Units and quantities | Scale servings and convert units in code | Arithmetic is cheap and exact in code, unreliable in token prediction. |
| Food safety | Meat and poultry steps still reach safe internal temperatures | US guidance: 165°F for all poultry, 160°F for ground meat, 145°F plus 3 minutes' rest for whole cuts [\[60\]](https://www.foodsafety.gov/print/pdf/node/10) [\[61\]](https://www.vdh.virginia.gov/content/uploads/sites/6/2023/07/Cook_to_a_Safe_Minimum_Internal_Temperature.pdf). |

A failed gate should send the draft back with the error, or fall back to the original recipe, and anything still uncertain goes to the user to confirm.

### The provider boundary

Samsung uses different model providers for different jobs. Gemini is confirmed for the 2026 fridge vision [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/). Samsung Food's terms say it may use OpenAI to generate and adapt recipes and suggest substitutions, and that it does not intend to share personal data with OpenAI [\[5\]](https://samsungfood.com/policy/terms/). Because the models are swappable, the durable engineering is the grounding and the gates around them.

**Teaching point:** retrieval reduces hallucination, but retrieval is not validation. Only structured checks can make a generated recipe *true*.

&#91;embedded content: retrieve, generate, validate · 4 deterministic gates (inferred)\]

The LLM never has the last word: every draft passes four rule-based checks that read the food graph, and a failure loops back for another draft or a fallback.

## Deep dive 5: from recipe text to oven command (Slide 6)

The most unusual part of Samsung Food is that language becomes physical action. Samsung confirms that settings can be sent from the app to a compatible oven [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), and Family Hub can send cooking measurements to cooktops [\[66\]](https://www.koreajoongangdaily.com/news/2025-12-31/business/guestReports/Samsungs-Bespoke-AI-aims-to-do-it-all-in-the-home/2490239). "Bake at 180 degrees for 25 minutes" must become a typed, validated device instruction, never a string an LLM sends straight to an oven.

### Step 1: semantic extraction

| Text span | Slot | Value |
| --- | --- | --- |
| "Bake" | action | bake |
| "at 180 degrees" | temperature | 180, unit °C (from the recipe's locale if not stated) |
| "for 25 minutes" | duration | 25 min |
| (implied by "bake") | device | oven |

This is the same sequence-labeling family as ingredient tagging, with recipe-specific entity types for actions, tools and durations [\[58\]](https://aclanthology.org/2020.lrec-1.638) [\[64\]](https://aclanthology.org/2023.findings-acl.261.pdf). Samsung's patent application describes applying recipe text to several NLU models to identify these semantic elements as part of generating cooking data [\[13\]](https://9235.net/patent/US2023134600A1.html).

### Step 2: state and sequence

"Then broil for two minutes" only makes sense if the system knows it follows the bake and applies to the same dish. Recipe flow graphs capture exactly this: steps link actions to ingredients, tools and intermediate products, with the order they must happen in [\[58\]](https://aclanthology.org/2020.lrec-1.638). Two differently worded recipes that do the same actions in the same order map to the same graph [\[58\]](https://aclanthology.org/2020.lrec-1.638), which is what a device controller needs.

### Step 3: device translation

The extracted step is mapped onto what this specific appliance supports: convert units, pick a supported mode, fill in missing details such as preheating, and flag anything it cannot do. Samsung's granted patent describes generating a setting command for the identified cooking device [\[14\]](https://patents.google.com/patent/US12105943). The output is a typed object, for example:

```json
{
  "device": "oven",
  "action": "bake",
  "temperature_c": 180,
  "duration_min": 25,
  "preheat": true,
  "requires_user_confirmation": true
}
```

### Step 4: the safety boundary (Inferred)

- **Range-check** every value against the device's limits and against plausibility (180 °C, not 1,800).
- **Reject** unsupported modes instead of approximating them silently.
- **Cross-check food safety**: if the dish contains poultry, the cooking plan should still reach 165°F internally [\[60\]](https://www.foodsafety.gov/print/pdf/node/10).
- **Confirm** consequential actions such as preheating or starting a cycle with the user.

The LLM may explain the step to the user in natural language. Only the validated parameter object reaches the hardware.

### Step 5: feedback, handled carefully

If a user turns the temperature down, that could reflect taste, a hotter-running oven, or an earlier parsing error. A good system logs the correction with its context and learns slowly from repeated patterns rather than overreacting to one change (Inferred).

## How to measure each part

Samsung publishes no accuracy figures for any stage, so each stage needs its own metric and the best public reference point comes from research. A system is only as reliable as its weakest stage, because errors flow downstream.

| Stage | What to measure | Published reference point | Typical failure |
| --- | --- | --- | --- |
| Recipe NLP | F1 per tagged field; share of ingredients linked to the right entity | Recipe entity and flow-graph models: 71.1 to 87.5 F1 [\[58\]](https://aclanthology.org/2020.lrec-1.638) | A misread unit silently breaks scaling and nutrition |
| Recommender | mAP@K or recall@K offline; saves, plans and cooks online | Cookpad: mAP@1 about 0.28 to 0.41 versus about 0.1 for random [\[33\]](https://arxiv.org/pdf/2007.13440) | Learning the app's own display order instead of taste [\[33\]](https://arxiv.org/pdf/2007.13440) |
| Fridge and phone vision | Per-class recall; unknown rate; user-correction rate | Best VLM: 85.8% on categories, 50.0% with cooking style [\[50\]](https://arxiv.org/pdf/2504.06925) | Look-alike foods; items the camera never sees |
| Photo to recipe retrieval | R@1 and median rank among 1,000 candidates | 87.5% R@1 [\[49\]](https://arxiv.org/html/2604.15628) | Can only return recipes already in the catalog |
| Generation | Gate pass rate; ingredient F1; nutrition error; human judgment | GPT-4o ingredient F1 0.737; nutrition error 23.5% to 43.6% across general models [\[51\]](https://arxiv.org/pdf/2508.09966) | Invented ingredients; wrong nutrition |
| Appliance actions | Share of commands passing validation; user override rate | None published | Unsupported or unsafe settings |

**Offline versus online.** Offline metrics on logged data are biased by whatever the app showed people in the first place. Cookpad's model beat a baseline on bookmarks and cook plans but could not beat the served order on raw clicks [\[33\]](https://arxiv.org/pdf/2007.13440). For a product like Samsung Food, the metric that matters most is whether a recommended recipe actually gets cooked, and that is the hardest one to observe.

## The moat, the flywheel and the limits (Slide 7)

Samsung does not need the world's best foundation model; it uses Google's Gemini for fridge vision, and its terms allow OpenAI for recipe generation [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) [\[5\]](https://samsungfood.com/policy/terms/). Its advantage is the layer around the model: a structured food graph, household context and hardware that can observe and act.

### Two flywheels and a business model

- **Data.** Searches, saves, plans, Food List corrections and shopping feed the recommender, which already uses past recipe preferences [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). Better picks drive more use, which produces more signal.
- **Hardware.** The app runs on any smartphone, and every Bespoke Family Hub model supports it [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). The free app makes a Samsung fridge or oven more useful, and the appliances feed context back to the app.
- **Business model.** Core planning is free; Food+ ($6.99 a month) adds full-week personalized plans, nutrition goals and the photo-based Food List [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/). Samsung reported over six million users as of July 2024, across 104 countries and eight languages [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/).

### The limits

- **Adoption is not accuracy.** Six million users says nothing about recommendation quality, retention, health impact or reduced food waste. Samsung publishes no evidence on any of these.
- **Sensitive data.** Tailored for You uses personal, profile, dietary and health data [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/), and the Samsung Health link requires consent [\[53\]](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024). Cloud vision means kitchen images leave the device.
- **Uneven accuracy.** Samsung's own footnote says Gemini-based features may vary in accuracy by country, language and device model [\[11\]](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026).
- **Physical consequences.** A vision miss, a hallucinated substitution or a misparsed temperature can affect allergies, health or an appliance. That is why confidence scores, rules, correction and human confirmation stay central.

### What Samsung has not disclosed

- Which model runs each stage, and whether app-side vision runs on the phone or in the cloud.
- Any accuracy figures for recognition, recommendation or generation.
- How user corrections feed back into training.

### Corrections to the slide plan

| Slide plan says | Evidence says | Suggested fix |
| --- | --- | --- |
| Twomey et al. is "direct Whisk research" (Slide 3, takeaway 1, source \[1\]) | All four authors work at Cookpad, the data is Cookpad's, and Whisk is never mentioned [\[33\]](https://arxiv.org/pdf/2007.13440) | "Published research from Cookpad, a comparable recipe platform" |
| "More than six million users by August 2024" | "Over six million users" as of July 2024, announced in August [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) | "Over six million users as of July 2024" |
| Earlier fridge recognition was not entirely on-device | Samsung says the 37 fresh and 50 packaged items were recognized on-device [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/); the service itself needed Wi-Fi and a Samsung account [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) | "Recognition ran on-device; the connected service needed a network" |
| 33 categories in 2024 | Supported: the 2025 release added four for a total of 37 [\[42\]](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature) | Keep |
| "40,000+" is searchable products, not visual classes | Supported: the app lists 42,000+ searchable products in 26 languages [\[3\]](https://apps.apple.com/ca/app/id1133637674) | Keep |
| Gemini is for fridge vision; terms mention OpenAI | Supported [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/) [\[5\]](https://samsungfood.com/policy/terms/) | Keep |
| The recipe scanner digitizes written recipes | Supported [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674) | Keep |

**Hand-off line, unchanged:** Shiru used AI to find ingredients, NotCo used AI to combine them, and Samsung Food uses AI to decide what a household should cook with them, then connects that choice to the home.

## Glossary

| Term | Plain meaning |
| --- | --- |
| Bilinear model | Scores a user–item pair as a product of their two vectors through a learned matrix |
| Candidate generation, ranking | Two-stage recommender: a cheap model narrows the pool, a heavier model orders it |
| Closed-set classifier | Recognizes only a fixed list of classes; everything else is "unknown" |
| Cold start | Recommending for a new user or item that has no interaction history |
| Conditional random field (CRF) | Sequence-labeling model that scores a whole tag sequence, not each token alone |
| Embedding | A vector that places similar things close together |
| Entity linking | Mapping a text mention ("AP flour") to one entry in a knowledge graph |
| F1 | Harmonic mean of precision and recall |
| Hallucination | Fluent model output not supported by the input |
| Hybrid recommender | Combines behavior data (collaborative) with item and user features (content) |
| Implicit feedback | Signals inferred from behavior (views, saves) rather than explicit ratings |
| Instance recognition | Recognizing one specific object again, such as a particular cereal box |
| mAP@K | Mean average precision over the top K results; rewards relevant items ranked high |
| Median rank, R@K | Retrieval metrics: typical position of the right answer; share of queries with it in the top K |
| Multimodal LLM | A language model that also takes images, via a vision encoder and a projector |
| Open-vocabulary model | Recognizes concepts described in text, not just a fixed label list (for example CLIP) |
| Recipe flow graph | Graph of a recipe's actions, ingredients, tools and the order they depend on |
| Retrieval-augmented generation (RAG) | Fetching relevant documents and giving them to the model before it writes |
| Sequence labeling | Assigning a tag to every token, such as QTY, UNIT or NAME |
| Set prediction | Predicting an unordered collection, so order is never counted as an error |
| Vision Transformer (ViT) | A Transformer that treats image patches the way a text model treats words |
| WMAPE | Weighted mean absolute percentage error; used here for nutrition estimates |
| Zero-shot | Doing a task without any training examples for it, usually by prompting |

## Sources

All pages accessed 18 November 2026. Numbers match the bracketed links in the text.

**Samsung and Samsung Food (primary)**

1. Samsung Food Help Center, [How to Save Recipes to Your Samsung Food Recipe Box](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box). Scan steps and the 3-free-scans note appear in the indexed version of this page.
2. Samsung Food Help Center, [How to Create Your Own Recipe with Recipe Builder](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder).
3. Apple App Store (Canada), [Samsung Food listing and version history](https://apps.apple.com/ca/app/id1133637674). Versions 5.39.0 (20 Mar 2025) and 5.48.0 (30 Jul 2025).
4. Samsung US, [Samsung Food brand page](https://www.samsung.com/us/explore/brand/samsung-food/), including footnote on NLP and generative AI.
5. Samsung Food, [Terms](https://samsungfood.com/policy/terms/), clause 13.3.1 on OpenAI.
6. Samsung Newsroom, [Meet Samsung Food at IFA 2023](https://news.samsung.com/global/meet-samsung-food-at-ifa-2023-the-ultimate-personalized-cooking-assistant), Sep 2023.
7. Samsung Newsroom Canada, [Global launch of Samsung Food](https://news.samsung.com/ca/samsung-announces-global-launch-of-samsung-food-an-ai-powered-personalized-food-and-recipe-service), Sep 2023.
8. Samsung Newsroom US, [Enhanced AI and connectivity at CES 2024](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024) (Image-to-Recipe), Dec 2023.
9. Samsung Newsroom, [CES 2024: Oliver Paterson uses AI and Samsung Food](https://news.samsung.com/global/ces-2024-cooking-for-a-crowd-how-oliver-paterson-uses-ai-and-samsung-food-to-spice-up-a-party), Jan 2024.
10. Samsung Newsroom US, [Upgraded Samsung Food at IFA 2024](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/), Aug 2024.
11. Samsung Newsroom Canada, [Your Companion to AI Living at CES 2026](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026) (Video to Recipe), Jan 2026.
12. Samsung Newsroom US, [AI Vision built with Google Gemini at CES 2026](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/), Dec 2025.
13. Samsung Electronics, patent application US20230134600A1, [Method and apparatus for providing personalized cooking service](https://9235.net/patent/US2023134600A1.html), published May 2023.
14. Samsung Electronics, patent US12105943B2, [Electronic device and control method therefor](https://patents.google.com/patent/US12105943), granted Oct 2024. Full text: [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12105943).

**Press coverage**

15. SamMobile, [Samsung Food brings an easier way to add recipes](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/), Aug 2025.
16. SammyGuru, [Samsung Food app now lets you add recipes from photos](https://sammyguru.com/samsung-food-app-now-lets-you-add-recipes-from-photos/), Aug 2025.
17. TechCrunch, [Samsung's new TVs can find recipes for dishes in shows](https://techcrunch.com/2025/01/05/samsungs-new-tvs-can-find-recipes-for-dishes-in-shows), Jan 2025.
18. SamMobile, [Samsung Health getting Galaxy AI feature that scans meals](https://www.sammobile.com/?p=16688942), Nov 2026.
19. TechCrunch, [Whisk's AI-powered recipe app](https://techcrunch.com/2019/12/17/whisks-a-i-powered-recipe-app-lets-you-send-the-ingredients-to-your-door), Dec 2019.
20. Whisk, [The Whisk Platform documentation](https://docs.whisk.com/).
21. Tom's Guide, ['2026 could be a tipping point' for the smart kitchen](https://www.tomsguide.com/home/home-appliances/2026-could-be-a-tipping-point-for-the-smart-kitchen-according-to-samsung), Jan 2026.

**Research and technical references**

22. Salvador et al., [Learning Cross-Modal Embeddings for Cooking Recipes and Food Images](https://openaccess.thecvf.com/content_cvpr_2017/html/Salvador_Learning_Cross-Modal_Embeddings_CVPR_2017_paper.html), CVPR 2017.
23. MIT CSAIL, [Recipe1M+ project page](https://pic2recipe.csail.mit.edu/).
24. Salvador et al., [Inverse Cooking: Recipe Generation from Food Images](https://arxiv.org/pdf/1812.06164), CVPR 2019.
25. Chhikara et al., [FIRE: Food Image to REcipe Generation](https://arxiv.org/pdf/2308.14391), WACV 2024.
26. Mohbat and Zaki, [LLaVA-Chef: A Multi-modal Generative Model for Food Recipes](https://arxiv.org/html/2408.16889), CIKM 2024.
27. Li et al., [TrOCR: Transformer-based Optical Character Recognition with Pre-trained Models](https://arxiv.org/abs/2109.10282v5), AAAI 2023.
28. Kim et al., [OCR-free Document Understanding Transformer (Donut)](https://arxiv.org/abs/2111.15664v3), ECCV 2022.
29. Liu et al., [Improved Baselines with Visual Instruction Tuning (LLaVA-1.5)](https://arxiv.org/abs/2310.03744), 2023.
30. The New York Times, [ingredient-phrase-tagger](https://github.com/NYTimes/ingredient-phrase-tagger) (GitHub).
31. [Ingredient Parser documentation](https://ingredient-parser.readthedocs.io/en/latest/start/index.html).
32. Google Search Central, [Recipe structured data](https://support.google.com/webmasters/answer/173379).
33. Twomey et al., [Towards Multi-Language Recipe Personalisation and Recommendation](https://arxiv.org/pdf/2007.13440), RecSys 2020 (Cookpad).
34. Digital Humanities Now, [summary of NYT's "Extracting Structured Data From Recipes Using Conditional Random Fields"](https://digitalhumanitiesnow.org/?p=64609).
35. Google for Developers blog, [Generative AI 'Food Coach' that pairs food with your mood](https://developers.googleblog.com/en/generative-ai-food-coach-that-pairs-food-with-your-mood), May 2023.
36. CookBook app help, [How to use the Recipe Scanner](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-the-Recipe-Scanner).

**Added for the pipeline deep dives (all accessed 18 November 2026)**

37. Bossard, Guillaumin and Van Gool, [Food-101 dataset page](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101), ETH Zürich, ECCV 2014.
38. Bossard et al., [Food-101: Mining Discriminative Components with Random Forests (abstract)](https://mlanthology.org/eccv/2014/bossard2014eccv-food), ECCV 2014.
39. Min et al., [Large Scale Visual Food Recognition (Food2K)](https://arxiv.org/abs/2103.16107v1), TPAMI 2023.
40. Radford et al., [Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/pdf/2103.00020), 2021.
41. [Zero-Shot Fine-Grained Image Classification Using Large Vision-Language Models](https://arxiv.org/pdf/2510.03903), 2025 (reports CLIP-based Food-101 results).
42. Samsung Newsroom, [New refrigerator lineup with screens and enhanced AI Vision Inside](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature), Mar 2025.
43. Samsung Newsroom UK, [AI Vision built with Google Gemini at CES 2026](https://news.samsung.com/uk/samsung-to-unveil-ai-vision-built-with-google-gemini-at-ces-2026), Dec 2025 (footnotes).
44. The Korea Herald, [Samsung's Bespoke AI refrigerator with Gemini](https://www.koreaherald.com/article/10640807), Dec 2025.
45. Salvador et al., [Revamping Cross-Modal Recipe Retrieval with Hierarchical Transformers](https://arxiv.org/pdf/2103.13061), CVPR 2021.
46. Carvalho et al., [Cross-Modal Retrieval in the Cooking Context (AdaMine)](https://arxiv.org/pdf/1804.11146), SIGIR 2018.
47. [Images & Recipes: Retrieval in the cooking context](https://arxiv.org/pdf/1805.00900), 2018 (metric definitions).
48. Shukor et al., [Transformer Decoders with Multimodal Regularization for Cross-Modal Food Retrieval (supplement)](https://openaccess.thecvf.com/content/CVPR2022W/MULA/supplemental/Shukor_Transformer_Decoders_With_CVPRW_2022_supplemental.pdf), CVPR Workshops 2022.
49. Gomi and Yanai, [SIMMER: Cross-Modal Food Image–Recipe Retrieval via MLLM-Based Embedding](https://arxiv.org/html/2604.15628), Apr 2026.
50. Romero-Tapiador et al., [Are Vision-Language Models Ready for Dietary Assessment?](https://arxiv.org/pdf/2504.06925), Apr 2025.
51. [January Food Benchmark (JFB)](https://arxiv.org/pdf/2508.09966), Aug 2025. Authors are from January AI, which built one of the compared models.
52. Anam, [Evaluating Gemini LLM in Food Image-Based Recipe and Nutrition Description](https://arxiv.org/html/2511.08215v1), Nov 2025.
53. Samsung Newsroom Canada, [Enhanced AI and connectivity at CES 2024](https://news.samsung.com/ca/samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024) (Personalize, Tailored Meal Plan), Dec 2023.
54. SamMobile, [Samsung's refrigerator with Gemini AI now available in Korea](https://www.sammobile.com/?p=16650384), Mar 2026.
55. Kula, [Metadata Embeddings for User and Item Cold-start Recommendations (LightFM)](https://arxiv.org/pdf/1507.08439), CBRecSys 2015.
56. Hu, Koren and Volinsky, [Collaborative Filtering for Implicit Feedback Datasets](https://samuel-deng.github.io/math4ml_su24/project/Hu_et_al.pdf), ICDM 2008.
57. Covington, Adams and Sargin, [Deep Neural Networks for YouTube Recommendations](https://research.google/pubs/pub45530), RecSys 2016.
58. Yamakata, Mori and Carroll, [English Recipe Flow Graph Corpus](https://aclanthology.org/2020.lrec-1.638), LREC 2020.
59. Lewis et al., [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), NeurIPS 2020.
60. FoodSafety.gov, [Cook to a Safe Minimum Internal Temperature (chart)](https://www.foodsafety.gov/print/pdf/node/10).
61. Virginia Department of Health, [Cook to a Safe Minimum Internal Temperature](https://www.vdh.virginia.gov/content/uploads/sites/6/2023/07/Cook_to_a_Safe_Minimum_Internal_Temperature.pdf) (reproduces the federal chart).
62. U.S. FDA via PR Newswire, [Learn About the FASTER Act with New Resources from FDA](https://prnewswire.com/news-releases/learn-about-the-faster-act-with-new-resources-from-fda-302332827.html), Jan 2025.
63. FDA Law Blog, [FASTER Law Adds Sesame as Major Food Allergen](https://www.thefdalawblog.com/?p=12535), Apr 2021.
64. [A framework for understanding English recipe texts with BERT, BiLSTM and CRF](https://aclanthology.org/2023.findings-acl.261.pdf), Findings of ACL 2023.
65. [Learning to Substitute Ingredients in Recipes](https://arxiv.org/pdf/2302.07960), 2023.
66. Korea JoongAng Daily, [Samsung's Bespoke AI aims to do it all in the home](https://www.koreajoongangdaily.com/news/2025-12-31/business/guestReports/Samsungs-Bespoke-AI-aims-to-do-it-all-in-the-home/2490239), Dec 2025.
