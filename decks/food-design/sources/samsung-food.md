# Samsung Food: Recipes From a Photo — A Deep Research Report on Image-to-Recipe AI

Nov 18, 2026 · @Rey Riordan

## The short version

Samsung Food's documented "recipe from a photo" feature reads a photo of a **written** recipe (a cookbook page, a handwritten card, a screenshot) and turns it into a structured, editable recipe [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674). At heart it is a document-understanding problem, not "inverse cooking" from a picture of a finished dish.

- **Three different photo features get conflated.** "Add recipe from photo" scans written recipes (shipped July 2025) [\[15\]](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/). "Image-to-Recipe" recognizes a dish or ingredients and finds existing recipes (announced CES 2024) [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024). "Video to Recipe" turns cooking videos into steps (announced CES 2026) [\[11\]](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026).
- **No public Samsung source says the app generates a new recipe from a dish photo.** Academic systems that try reach an ingredient F1 score of only about 49% [\[24\]](https://arxiv.org/pdf/1812.06164) [\[25\]](https://arxiv.org/pdf/2308.14391).
- **Samsung discloses little about the models.** It says recipe content is structured with deep-learning NLP and that recipe personalization uses generative AI and LLMs [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). Its terms say it may use OpenAI to generate and adapt recipes [\[5\]](https://samsungfood.com/policy/terms/). The scanner's model is not named anywhere I found.
- **The payoff is downstream.** A structured recipe can drive ingredient search, nutrition, serving changes, guided cooking and oven settings [\[3\]](https://apps.apple.com/ca/app/id1133637674) [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/). A recipe left as a photo can do none of that.
- **One correction to the slide draft.** The multilingual recommender paper it cites as Whisk research (Twomey et al., 2020) was written by Cookpad employees on Cookpad data and never mentions Whisk [\[33\]](https://arxiv.org/pdf/2007.13440).

## What Samsung actually ships

The table lists six Samsung photo or video features related to food. Only one turns a still photo into a new saved recipe, and it works by reading text.

| Feature | Input | Output | Status | Evidence |
| --- | --- | --- | --- | --- |
| Add recipe from photo (Samsung Food) | Photo of a cookbook page, scan, handwritten recipe or screenshot; extra pages allowed | Digital recipe saved to the Recipe Box | Shipped 30 Jul 2025 (iOS 5.48.0, Android 2.46.0); 3 free scans, then Food+ | [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674) [\[15\]](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/) [\[16\]](https://sammyguru.com/samsung-food-app-now-lets-you-add-recipes-from-photos/) |
| Image-to-Recipe with Vision AI (Samsung Food) | Photo of a meal or several food items | Existing dishes that can be made with the recognized ingredients | Announced CES 2024, part of the paid Food+ tier | [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024) [\[9\]](https://news.samsung.com/global/ces-2024-cooking-for-a-crowd-how-oliver-paterson-uses-ai-and-samsung-food-to-spice-up-a-party) |
| Vision AI for the Food List (Samsung Food+) | Phone photo of food items | Items added to the Food List, which then drives recipe suggestions | Announced IFA 2024 | [\[10\]](https://news.samsung.com/us/upgraded-samsung-food-raises-bar-for-food-experiences-ifa-2024/) |
| Video to Recipe (Family Hub) | Recommended cooking videos | Easy-to-follow steps you can cook along with | Announced CES 2026; needs Wi-Fi and a Samsung account | [\[11\]](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026) |
| Samsung Food on TVs | Food shown on screen | A matching recipe | Announced CES 2025 for QN90F, QN80F and QN70F | [\[17\]](https://techcrunch.com/2025/01/05/samsungs-new-tvs-can-find-recipes-for-dishes-in-shows) |
| Scan meal (Samsung Health, not Samsung Food) | Photo of a meal | Food names, ingredients, portion sizes, calorie estimate | Found in testing, Nov 2026; not yet released | [\[18\]](https://www.sammobile.com/?p=16688942) |

### Two meanings of "image-to-recipe"

Samsung uses the phrase for **recognition plus retrieval**. Its CES 2024 release says Image-to-Recipe "recognizes meals and multiple food items from photographs" and then explores dishes that can be made with those ingredients [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024). The 2023 preview described the same idea: identify the dish, describe its ingredients, and link related recipes [\[6\]](https://news.samsung.com/global/meet-samsung-food-at-ifa-2023-the-ultimate-personalized-cooking-assistant).

Researchers often use the phrase for **generation**: writing a brand-new recipe for the pictured dish [\[24\]](https://arxiv.org/pdf/1812.06164). Keeping these apart is the single most important framing choice in this report. Your slide draft already flags this correctly.

### How to read the evidence in this report

- **Confirmed**: stated by Samsung or Samsung Food (newsroom, help center, app store listing, terms, patents).
- **Reported**: stated by press coverage, not by Samsung.
- **Research**: from peer-reviewed or preprint papers; shows what the technique can do, not what Samsung runs.
- **Inferred**: my reconstruction of a reasonable architecture. Samsung has not published one for the scanner.

## The problem it solves

Recipes arrive as pixels and loose prose, but every useful feature in a food app needs structured data. The photo scanner closes that gap for recipes that exist only on paper or in images.

### 1. Recipes are scattered, and paper has no metadata

Samsung frames the core pain as scattered recipes, the ones "open in dozens of tabs" [\[6\]](https://news.samsung.com/global/meet-samsung-food-at-ifa-2023-the-ultimate-personalized-cooking-assistant). Its pitch is to save any recipe "in a standard format," whether from a blog, an Instagram post or a family cookbook [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/).

Web import is the easy case, and even it is fragile. Samsung's help center warns that not every recipe site has metadata compatible with Samsung Food [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box). The standard web format for such metadata is schema.org Recipe markup, with fields such as `recipeIngredient` and `recipeInstructions` [\[32\]](https://support.google.com/webmasters/answer/173379). A cookbook page or a grandparent's index card has none of it, so the only input is a photo.

### 2. Structuring a recipe by hand is slow

Before the New York Times automated it, contractors typed recipes into a form field by field. An average recipe needed over 50 fields, and complex ones over 100 [\[34\]](https://digitalhumanitiesnow.org/?p=64609).

Samsung Food's manual path has the same shape. Its Recipe Builder asks for a title, source, photo, description and each ingredient in turn [\[2\]](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder). The scanner exists to skip that typing.

### 3. Structure is what unlocks the rest of the product

Once each ingredient is a known entity with a quantity and unit, the app can compute with it:

- **Search by ingredient** across 42,000+ products in 26 languages [\[3\]](https://apps.apple.com/ca/app/id1133637674).
- **Nutrition**, by matching ingredients to a food database [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/).
- **Customization**: change servings, swap ingredients, adjust nutrition [\[3\]](https://apps.apple.com/ca/app/id1133637674).
- **Shopping lists** built from a recipe's ingredients [\[7\]](https://news.samsung.com/ca/samsung-announces-global-launch-of-samsung-food-an-ai-powered-personalized-food-and-recipe-service).
- **Guided cooking and appliances**: step-by-step mode, timers, and sending settings to a SmartThings oven [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/).

### 4. Why Samsung cares

The scanner is a paid hook. Basic users get 3 free scans; more requires a Food+ subscription [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[16\]](https://sammyguru.com/samsung-food-app-now-lets-you-add-recipes-from-photos/). Every scanned recipe also becomes structured content that can flow to Samsung appliances [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/).

### The problem, stated as a CS task

Given an image of a document, produce a typed record that fits a recipe schema: title, yield, times, a list of parsed ingredients, and ordered steps. In ML terms this is **information extraction from visually rich documents**, followed by **entity normalization** against a food knowledge graph. The output must be correct enough to compute with, not just readable.

## How it works at a high level

The scanner is a pipeline from pixels to a typed recipe record, with the user as the final checker.

### What the user does (Confirmed)

Samsung's help center gives the flow [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box):

1. Open the Saved tab and tap the orange plus button.
2. Choose "Add recipe from photo" and allow camera access.
3. Tap the camera button to scan. Add more pages if the recipe runs over one page.
4. Tap Continue and wait while the recipe is scanned.
5. Tap Saved. The recipe can then be edited like any other [\[2\]](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder).

The wait in step 4 is where the AI runs. The edit in step 5 is the safety net.

### What happens behind the button (Inferred)

Samsung has not published the scanner's architecture. The stages below are the standard way to decompose the task. They match what Samsung does disclose: deep-learning NLP structures recipe content [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), and a Samsung patent describes running recipe text through several natural language understanding (NLU) models to find its semantic elements [\[13\]](https://9235.net/patent/US2023134600A1.html).

1. **Capture.** Take one or more photos; straighten, crop and clean them up.
2. **Read.** Turn pixels into text, either with optical character recognition (OCR) or with a vision-language model that reads the page directly.
3. **Segment.** Decide which text is the title, the ingredient list, the steps, and the extras (servings, times, notes).
4. **Parse.** Split each ingredient line into quantity, unit, name and preparation; pull times and temperatures out of steps.
5. **Normalize and link.** Map "plain flour" and "all-purpose flour" to one canonical ingredient, then to products and nutrition data.
6. **Validate and review.** Check that the record is complete and sensible, show it to the user, and save it.

There are two broad ways to build steps 2 to 4. A **classic pipeline** uses separate models for each step. A **multimodal model** does all three in one pass. The next two sections go deep on each.

&#91;embedded content: photo-to-recipe pipeline · 6 stages, 2 reading paths (inferred)\]

Path A chains specialist models; Path B reads the page in one pass. Either way, the draft is normalized against the food graph and checked by the user before it can drive search, nutrition, shopping or an oven.

## Deep dive 1: the classic pipeline for reading a recipe photo

The classic approach chains specialist models: read the characters, find the sections, tag each ingredient line, then link it to a food database. Each stage is easy to test on its own, but errors pile up from stage to stage.

### Stage 1: capture and clean-up

Phone photos of pages are tilted, curved at the spine and unevenly lit. A typical first step finds the page edges, corrects the perspective so the page looks flat, and evens out contrast (general technique). Samsung's scanner lets the user add extra pages when a recipe spills over [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box), so the system must also stitch pages into one recipe.

### Stage 2: optical character recognition (OCR)

OCR converts images of typed, handwritten or printed text into machine-encoded text [\[27\]](https://arxiv.org/abs/2109.10282v5). Older systems paired a convolutional network that looks at the image with a recurrent network that emits characters, plus a separate language model to fix mistakes afterwards [\[27\]](https://arxiv.org/abs/2109.10282v5).

TrOCR (Microsoft, 2021) is a good modern example. It uses a pre-trained image Transformer as the encoder and a pre-trained text Transformer as the decoder, and it beat earlier systems on both printed and handwritten text [\[27\]](https://arxiv.org/abs/2109.10282v5).

**The intuition:** the encoder "looks" at the image and the decoder "writes" one token at a time, exactly like machine translation, except the source language is pixels. Handwriting matters here because Samsung markets turning handwritten recipes into digital ones [\[3\]](https://apps.apple.com/ca/app/id1133637674) [\[15\]](https://www.sammobile.com/news/samsung-food-brings-easier-way-add-recipes/).

### Stage 3: layout, or which text is which

OCR returns words and their positions, not meaning. A recipe page mixes a title, a headnote, yield and times, an ingredient list and a method, often in two columns. A layout step groups words into blocks and labels each block.

This is harder than it sounds. One competing scanner app tells users that ingredients or steps printed in two columns need two separate selections in its manual mode [\[36\]](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-the-Recipe-Scanner). Think of it as parsing a web page with every HTML tag stripped out.

### Stage 4: ingredient-line parsing as sequence labeling

Each ingredient line is a tiny sentence with a predictable grammar. The New York Times' open-source tagger turns `1 pound carrots, young ones if possible` into quantity `1`, unit `pound`, name `carrots` and comment `young ones if possible` [\[30\]](https://github.com/NYTimes/ingredient-phrase-tagger).

It does this with a **conditional random field (CRF)** trained on lines that people had tagged by hand [\[30\]](https://github.com/NYTimes/ingredient-phrase-tagger). A CRF labels every token while taking its neighbours' labels into account, so "cup" after a number is very likely a unit. A newer open-source package uses the same idea, trained on 60,000 ingredient sentences, and returns a confidence score for each field [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html).

Steps get similar treatment. A Samsung patent describes applying recipe text to several NLU models to identify its semantic elements [\[13\]](https://9235.net/patent/US2023134600A1.html), as part of a method for generating data for cooking food.

### Stage 5: normalization and linking to a food graph

The same ingredient appears under many surface forms: "plain flour", "all-purpose flour", "AP flour", "2 c. flour". Normalization maps them to one canonical entity, which can then link to store products and nutrition data.

Whisk, the startup Samsung bought in 2019 and rebranded as Samsung Food in 2023 [\[17\]](https://techcrunch.com/2025/01/05/samsungs-new-tvs-can-find-recipes-for-dishes-in-shows), built exactly this layer. By 2019 its app was already extracting the title, photo and ingredients from saved recipe pages into structured fields [\[19\]](https://techcrunch.com/2019/12/17/whisks-a-i-powered-recipe-app-lets-you-send-the-ingredients-to-your-door). It describes an ontology of products and maps ingredients to more than 140,000 store items [\[20\]](https://docs.whisk.com/). Today Samsung Food matches ingredients to a food database to show nutrition [\[4\]](https://www.samsung.com/us/explore/brand/samsung-food/), and its terms mention an open-source food products database [\[5\]](https://samsungfood.com/policy/terms/).

A research example shows the scale of the problem. The Inverse Cooking authors started with 16,823 raw ingredient names in Recipe1M. Merging, clustering and removing plurals and rare items cut that to 1,488 [\[24\]](https://arxiv.org/pdf/1812.06164).

### The weakness: errors propagate

In a chain, a mistake early on poisons everything after it. The Donut authors list three costs of OCR-first pipelines: OCR's compute cost, its inflexibility across languages and document types, and OCR errors propagating into later steps [\[28\]](https://arxiv.org/abs/2111.15664v3).

An illustrative example: if OCR reads "½ tsp salt" as "12 tsp salt", the parser tags it perfectly, the nutrition is computed perfectly, and the recipe is still ruined. This is why per-field confidence scores [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html) and a user review step matter.

## Deep dive 2: the modern approach, one multimodal model

Since about 2022, a single vision-language model can read a page and write out the structured recipe in one pass. That collapses reading, layout and parsing into one learned step.

### Skipping OCR entirely: Donut

Donut (NAVER CLOVA, ECCV 2022) is an "OCR-free" document model. It is a Transformer trained with a plain cross-entropy objective that maps a document image straight to structured output [\[28\]](https://arxiv.org/abs/2111.15664v3). The paper's own figure shows a receipt image turned directly into nested JSON with item names, counts and prices [\[28\]](https://arxiv.org/abs/2111.15664v3).

**The intuition:** instead of predicting characters and then parsing them, the model learns to emit the target schema's tokens directly. The schema becomes part of the output vocabulary.

### Multimodal large language models

General-purpose models go one step further: one model that can both see and follow instructions. LLaVA is the standard open example. LLaVA-1.5 feeds images through a CLIP vision Transformer (CLIP-ViT-L-336px) and maps the result into the language model with a small MLP projection [\[29\]](https://arxiv.org/abs/2310.03744).

Conceptually, there are three parts:

1. **Vision encoder.** Cuts the image into patches and turns each patch into a vector.
2. **Projector.** Translates those vectors into the same embedding space the language model uses for word tokens.
3. **Language model.** Reads the "image tokens" alongside your text prompt and writes an answer, one token at a time.

A helpful analogy: the projector teaches the image to "speak" in a dialect the LLM already understands.

### Asking for structure, not prose

For a scanner, the prompt asks for a fixed schema, for example a title, servings, an ingredients list of `{quantity, unit, name, preparation}` objects, and ordered steps. Google's PaLM API demo did exactly this for recipes: a final prompt turned unstructured recipes into formatted JSON, with the sampling temperature lowered for the formatting step [\[35\]](https://developers.googleblog.com/en/generative-ai-food-coach-that-pairs-food-with-your-mood). Lower temperature makes the model pick its most likely tokens, which is what you want when copying text off a page.

### Trade-offs between the two approaches (Inferred)

| Concern | Classic pipeline | Multimodal model |
| --- | --- | --- |
| Typical error | Misreads a character; error is local and traceable | Writes plausible text that is not on the page (hallucination) |
| Odd layouts and handwriting | Needs a specialist model per problem | Generalizes better from broad pre-training |
| Confidence | Per-field scores are natural [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html) | Harder to get calibrated scores |
| Compute | Small models; can run on the phone | Large models; usually run in the cloud |
| Changing the schema | Retrain or rewrite a module | Change the prompt |

The hallucination row is the important one. FIRE's authors call hallucination "a critical challenge" for recipe generation by vision and language models [\[25\]](https://arxiv.org/pdf/2308.14391). Reading a page is far easier than imagining a recipe, but the failure mode is the same kind: fluent output that is not grounded in the image.

### What Samsung probably runs (Inferred, unverified)

Samsung does not name the scanner's model. Three public facts narrow it down:

- Samsung Food's terms say it "may use OpenAI" to enhance its services, including to generate and adapt recipes and suggest ingredient substitutions [\[5\]](https://samsungfood.com/policy/terms/).
- For the 2026 Family Hub fridge camera, Samsung says recognition is enhanced with Google Gemini and Google Cloud [\[12\]](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/). A Samsung executive described the earlier fridge system as on-device and the new one as matching against cloud data and reading labels [\[21\]](https://www.tomsguide.com/home/home-appliances/2026-could-be-a-tipping-point-for-the-smart-kitchen-according-to-samsung).
- The app already offers "AI-powered step-by-step instructions for any recipe" (v5.39.0, March 2025) [\[3\]](https://apps.apple.com/ca/app/id1133637674), so generative models are in the product.

A plausible design is a hybrid: a hosted multimodal model extracts a draft recipe, then Samsung's own deterministic parsing and food-graph linking clean and normalize it. Treat that as a teaching hypothesis, not a fact.

## Deep dive 3: recipes from a photo of the dish (inverse cooking)

Writing a recipe from a picture of finished food is a much harder, under-determined problem. The research systems covered here reach an ingredient F1 score of about 49%, and FIRE does not predict quantities at test time at all [\[25\]](https://arxiv.org/pdf/2308.14391).

### Why it is hard

- **Hidden ingredients.** Salt, oil, stock and spices are rarely visible. Ingredients are often occluded in cooked dishes, and food varies and deforms a lot within one dish type [\[24\]](https://arxiv.org/pdf/1812.06164).
- **Look-alikes.** Under melted cheese, mozzarella and cheddar are hard to tell apart [\[25\]](https://arxiv.org/pdf/2308.14391).
- **The process is invisible.** A photo shows the result, not the order of steps, the oven temperature or the timing.
- **Many answers are right.** Many different recipes produce dishes that look the same. Scoring against one "true" recipe punishes valid alternatives.

Research has attacked this in four waves. The first wave is the closest match to Samsung's Image-to-Recipe.

&#91;embedded content: dish photo to recipe · 3 research approaches\]

Retrieval is safe but limited to known recipes; the two generative families can write new recipes but must guess what the camera cannot see.

### Wave 1: retrieval with a shared embedding space (2017)

MIT and collaborators released **Recipe1M**, with over 1 million recipes and 800,000 food images [\[22\]](https://openaccess.thecvf.com/content_cvpr_2017/html/Salvador_Learning_Cross-Modal_Embeddings_CVPR_2017_paper.html). They trained one encoder per modality (ingredients, instructions, images) so that a recipe and its photo land close together in one vector space [\[23\]](https://pic2recipe.csail.mit.edu/). Given a new photo, you embed it and return the nearest recipe.

Adding a food-category classification objective improved retrieval to rival human performance [\[22\]](https://openaccess.thecvf.com/content_cvpr_2017/html/Salvador_Learning_Cross-Modal_Embeddings_CVPR_2017_paper.html). The space even supports arithmetic: v(chicken pizza) − v(pizza) + v(lasagna) should land near chicken lasagna [\[23\]](https://pic2recipe.csail.mit.edu/).

The limit is built in: retrieval can only return recipes already in the collection, so success depends on dataset size and diversity [\[25\]](https://arxiv.org/pdf/2308.14391). This is the family Samsung's Image-to-Recipe resembles (Inferred): recognize what is in the photo, then find existing recipes [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024).

### Wave 2: two-stage generation (Inverse Cooking, 2019)

Facebook AI Research and UPC built a system that writes a new recipe instead of fetching one [\[24\]](https://arxiv.org/pdf/1812.06164):

1. A ResNet-50 encoder turns the image into features.
2. An **ingredient decoder** predicts a *set* of ingredients. It is a Transformer whose per-step outputs are max-pooled, so the result does not depend on the order ingredients are listed in.
3. An **instruction decoder** (a 16-block Transformer) writes the title and steps while attending to both the image and the predicted ingredients.

**Why predict a set?** "Flour, eggs, sugar" and "sugar, eggs, flour" are the same list. A model trained to match an exact order gets punished for meaningless differences.

Results on the Recipe1M test set: ingredient IoU 32.11 and F1 48.61, against 19.85 and 33.13 for a retrieval baseline [\[24\]](https://arxiv.org/pdf/1812.06164). In a small user study, people guessing ingredients from photos scored F1 35.20, below the model's 49.08 [\[24\]](https://arxiv.org/pdf/1812.06164). When users judged whether a recipe matched the image, real recipes succeeded 80.33% of the time, generated ones 55.47% and retrieved ones 48.81% [\[24\]](https://arxiv.org/pdf/1812.06164).

Typical failures: stuffed tomatoes mistaken for stuffed peppers, and ingredients listed but never used in the steps [\[24\]](https://arxiv.org/pdf/1812.06164).

### Wave 3: off-the-shelf foundation models as parts (FIRE, 2024)

FIRE (USC and ISI, WACV 2024) swaps in pre-trained components [\[25\]](https://arxiv.org/pdf/2308.14391):

- **BLIP** generates the dish title.
- A **Vision Transformer** with an attention-based decoder predicts the ingredient set.
- **T5** (220M parameters) writes the instructions from the title and ingredients.

The gains over Inverse Cooking are small: ingredient IoU 32.59 and F1 49.27 [\[25\]](https://arxiv.org/pdf/2308.14391). The authors are candid about the limits. Quantities are not predicted at test time, an unseen dish (Pav Bhaji) produced an unrelated recipe, and BLEU and ROUGE scores fail to capture recipe accuracy [\[25\]](https://arxiv.org/pdf/2308.14391).

### Wave 4: multimodal LLMs tuned for food (LLaVA-Chef, 2024)

LLaVA-Chef (RPI, CIKM 2024) fine-tunes LLaVA in stages. It first refines how food-image embeddings map into the language space, then fine-tunes on recipe data with diverse prompts, then adds a custom loss to improve the generated text [\[26\]](https://arxiv.org/html/2408.16889). The authors report more detailed recipes with more precise ingredient mentions than earlier approaches. They conclude that domain-specific training "remains paramount" even for large general models [\[26\]](https://arxiv.org/html/2408.16889).

### Where Samsung sits

Samsung's public dish-photo features stop at recognition: Image-to-Recipe finds existing dishes [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024), and Samsung Health's Scan meal, still in testing, estimates food names, ingredients, portions and calories [\[18\]](https://www.sammobile.com/?p=16688942). SamMobile reports that Samsung itself says Scan meal's accuracy may vary with photo conditions [\[18\]](https://www.sammobile.com/?p=16688942).

Samsung does hold a patent on generating recipe information by analyzing the images, voice and text in cooking content [\[14\]](https://patents.google.com/patent/US12105943). A patent shows intent, not a shipped feature.

## Evaluation and failure modes

Samsung publishes no accuracy figures for its scanner, so any evaluation here is a proposal. The research on dish photos does publish numbers, and it shows that text-overlap scores miss what matters to a cook.

### Measuring a written-recipe scanner (Proposed)

Score the output field by field against a hand-checked version of the same recipe. The fields that break downstream features deserve the most weight.

| What to measure | Metric | Why it matters |
| --- | --- | --- |
| Reading | Character and word error rate | Baseline OCR quality, especially on handwriting |
| Sections | Share of lines put in the right section | A step filed as an ingredient breaks the shopping list |
| Quantity and unit | Exact-match accuracy per ingredient | A wrong unit silently breaks scaling and nutrition |
| Ingredient identity | Share linked to the correct canonical entity | Drives nutrition, allergens, search and shopping |
| Grounding | Share of output text actually present in the image | Catches hallucinated lines from generative models |
| User effort | Edits per scanned recipe | The metric a product team would actually watch |

### Measuring dish-photo generation (Research)

- **Ingredients as sets:** intersection over union (IoU) and F1 between predicted and true ingredient sets [\[24\]](https://arxiv.org/pdf/1812.06164) [\[25\]](https://arxiv.org/pdf/2308.14391).
- **Instructions as text:** perplexity, plus overlap scores such as BLEU and ROUGE-L [\[24\]](https://arxiv.org/pdf/1812.06164) [\[25\]](https://arxiv.org/pdf/2308.14391). FIRE's authors warn that these overlap scores fail to capture recipe accuracy and some hallucinations [\[25\]](https://arxiv.org/pdf/2308.14391).
- **Human judgment:** ask people whether a recipe matches the image. This is how Inverse Cooking showed generation beating retrieval [\[24\]](https://arxiv.org/pdf/1812.06164).

### Failure modes and mitigations

| Failure | Example | Mitigation |
| --- | --- | --- |
| Misread number or unit | "½ tsp" read as "12 tsp" (illustrative) | Flag low-confidence fields for review [\[31\]](https://ingredient-parser.readthedocs.io/en/latest/start/index.html); range-check quantities |
| Layout confusion | Two-column ingredient lists merged into one [\[36\]](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-the-Recipe-Scanner) | Layout-aware models; let users fix section boundaries |
| Hallucination | Model adds an ingredient that is not on the page or in the dish [\[25\]](https://arxiv.org/pdf/2308.14391) | Check every output line against the OCR text; low sampling temperature |
| Invisible ingredients | Cheese type under a melted topping [\[25\]](https://arxiv.org/pdf/2308.14391) | Present as a guess; ask the user |
| Unseen dishes | Pav Bhaji, absent from training data, gets an unrelated recipe [\[25\]](https://arxiv.org/pdf/2308.14391) | Broader, more diverse training data; abstain when unsure |
| Internal inconsistency | Ingredient listed but never used in the steps [\[24\]](https://arxiv.org/pdf/1812.06164) | Cross-check ingredient list against steps |
| Wrong entity link | "Cream" mapped to the wrong product (illustrative) | Show the linked product; let users correct it |

## Responsible AI, evidence gaps and open questions

A scanned recipe is not just text to read. Once structured, it feeds nutrition numbers, allergen-relevant ingredient lists and, potentially, appliance settings, so extraction errors can have real consequences.

### Safety and accuracy

- **The human is the last validator.** Samsung's flow ends with the user saving a recipe they can then edit [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[2\]](https://support.samsungfood.com/hc/en-us/articles/18365401619348-How-to-Create-Your-Own-Recipe-with-Recipe-Builder). A good interface makes uncertain fields obvious rather than burying them.
- **Accuracy varies by context.** For its Gemini-based fridge features, Samsung's own footnote says availability, functions and accuracy may vary by country, language and device model [\[11\]](https://news.samsung.com/ca/samsung-presents-your-companion-to-ai-living-at-the-first-look-during-ces-2026). The same caution reasonably applies to reading recipes in many languages and scripts.
- **Language should not reach hardware unchecked.** Samsung's patents describe turning recipe text into machine-usable cooking data [\[13\]](https://9235.net/patent/US2023134600A1.html) and appliance setting commands [\[14\]](https://patents.google.com/patent/US12105943). Any temperature or time read from a photo should be range-checked and confirmed before it drives an oven.

### Privacy

Recipe photos can include handwriting, names and family notes. Samsung Food's terms say OpenAI may be used to generate and adapt recipes, and that Samsung Food does not intend to share personal data with OpenAI [\[5\]](https://samsungfood.com/policy/terms/). The parts of the terms I could access do not say where scanned images are processed.

### What Samsung has not disclosed

- Which model reads the page, and whether it is the same model across platforms.
- Whether any processing happens on the phone, or all of it in the cloud.
- Accuracy on printed versus handwritten recipes, and which languages and scripts are supported.
- Whether user corrections are used to improve the models.

### Corrections to the slide draft

- **Confirmed:** the slide's warning is right. Samsung's scanner digitizes a photographed *written* recipe [\[1\]](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) [\[3\]](https://apps.apple.com/ca/app/id1133637674). Its dish-photo feature recognizes ingredients and finds existing recipes [\[8\]](https://news.samsung.com/us/samsung-to-showcase-how-enhanced-ai-connectivity-enable-expansive-kitchen-experiences-ces-2024).
- **Needs fixing:** the slide calls Twomey et al. (2020) "direct Whisk research." All four authors list Cookpad Ltd as their affiliation, the roughly 7 billion events come from Cookpad's platform, and the paper never mentions Whisk or Samsung [\[33\]](https://arxiv.org/pdf/2007.13440). It is good background on recipe recommendation, but not evidence about Samsung Food's internals.
- **Now verified:** the slide's claim that Samsung Food's terms mention OpenAI is confirmed by the terms text [\[5\]](https://samsungfood.com/policy/terms/).

## Glossary

| Term | Plain meaning |
| --- | --- |
| Conditional random field (CRF) | A sequence-labeling model that tags each token while considering its neighbours' tags |
| Cross-entropy | The standard training loss for predicting the next token or a class |
| Embedding | A vector that represents an item so similar items sit close together |
| Entity linking / normalization | Mapping different surface forms ("AP flour") to one canonical entry in a database |
| F1 | Harmonic mean of precision and recall; rewards getting the right items without extras |
| Hallucination | Fluent model output that is not supported by the input |
| Intersection over union (IoU) | Overlap of two sets divided by their combined size |
| Joint (cross-modal) embedding | One vector space shared by images and text, so a photo and its recipe land near each other |
| Layout analysis | Grouping text on a page into regions and labeling what each region is |
| Multimodal LLM | A language model that also accepts images, via a vision encoder and a projector |
| OCR | Optical character recognition: turning images of text into machine-readable text |
| Perplexity | How surprised a language model is by the true text; lower is better |
| Projector | The small layer that maps image features into a language model's token space |
| Retrieval | Answering by finding the closest existing item, not by generating a new one |
| Sequence labeling | Assigning a tag to every token in a sequence, such as QTY, UNIT or NAME |
| Set prediction | Predicting an unordered collection, so order does not count as an error |
| Vision Transformer (ViT) | A Transformer that treats image patches the way a text model treats words |

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
