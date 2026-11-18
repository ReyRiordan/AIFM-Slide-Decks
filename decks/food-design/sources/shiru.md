# Shiru Ingredient Discovery: Protein Language Models + Similarity Search

Nov 18, 2026 · @Rey Riordan

## Executive summary

Shiru turns food-ingredient discovery into a vector search problem: it represents millions of natural protein sequences as points in a high-dimensional space learned by a neural network, then retrieves the neighbours of a protein that already does the job.

The company, founded in 2019 by protein biochemist Jasmin Hume, runs a discovery engine called Flourish and a public-facing marketplace called [ProteinDiscovery.ai](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins). Its searchable database held [more than 33 million natural protein sequences in May 2024](https://www.businesswire.com/news/home/20240501914917/en/The-Protein-Discovery-Company-Shiru-Launches-World%E2%80%99s-First-Protein-Marketplace-and-Discovery-Platform) and [more than 77 million by March 2026](https://www.foodbev.com/news/ingredion-partners-with-shiru-on-ai-driven-protein-discovery).

The problem is a needle-in-a-haystack search under extreme label scarcity. Food relies on a handful of animal proteins — egg white for binding, gelatin for setting, casein for creaminess — while nature has produced millions of others whose behaviour in food nobody has ever measured. Measuring one takes weeks of wet-lab work, so exhaustive screening is impossible.

The machine-learning answer has three moving parts. A **protein language model**, pre-trained by filling in deliberately hidden amino acids across tens of millions of unlabelled sequences, learns a representation in which proteins that behave alike sit close together even when their letters differ. **Nearest-neighbour search** over those vectors retrieves candidates that classical letter-by-letter alignment would miss. **Small supervised heads** trained on the few hundred proteins Shiru has actually assayed predict function, producibility and allergenicity, and lab results feed back into retraining — what Shiru's patent calls a ["discovery flywheel"](https://patents.google.com/patent/US11439159).

Three things a computer scientist should take from this case:

1. **Self-supervised pre-training is what makes the labels sufficient.** Nothing else about the pipeline is unusual; the pre-trained representation is what lets a few hundred labels support a model over 77 million candidates.
2. **Changing the metric space changes what "similar" means.** Sequence identity below roughly 25% carries [almost no structural signal](https://www.biostat.wisc.edu/~kbroman/teaching/statgen/2004/refs/rost1.pdf); embedding distance still does.
3. **Retrieval is not the product.** Producibility, safety and cost filters — and a physical lab in the loop — do as much work as the search itself.

One caveat runs through the whole report: Shiru has not published its architectures, training data or accuracy figures. Sections marked *confirmed* rest on the company's patent, its NeurIPS workshop paper and direct quotations; sections marked *inferred* reconstruct the likely method from standard practice. A dedicated section below separates the two.

## The problem: a search problem disguised as a food problem

Modern food depends on a very small cast of proteins, and almost all of them come from animals. Egg white binds and sets, gelatin gels, milk casein makes things creamy. Nature has produced millions of other proteins, and the overwhelming majority have never been tested in a food application.

### What "function" means for a food protein

In food science a protein is valued for its *techno-functional* behaviour rather than its nutrition. The standard list is solubility, foaming, emulsification, gelation, and water- and oil-holding capacity, and all of them depend on how the molecule behaves in a given solvent or food matrix and on how it has been processed ([Zhang et al., *Foods*, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8621404)). Shiru's own patent lists a longer target set — gel formation, foaming, fat structuring, adhesion and film formation, emulsification, viscosity control, fibre and scaffold structure ([US 11,439,159 B2](https://patents.google.com/patent/US11439159)).

This is the commercial pain point for plant-based food: plant proteins are abundant and cheap but are comparatively poor at solubility, foaming, emulsifying and gelling, which limits how far they can be used ([Nikbakht Nasrabadi et al., *Foods*, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8391319)). Replacing egg white is not a matter of matching protein content; it is a matter of matching behaviour.

### Why brute force is impossible

Three numbers define the search space and the cost of evaluating a point in it.

| Quantity | Figure | Source |
| --- | --- | --- |
| Candidate natural proteins catalogued by Shiru | 77 million+ (March 2026); 33 million+ (May 2024) | [GlobeNewswire](https://lite.aol.com/tech/story/0022/20260318/9674147.htm), [BusinessWire](https://www.businesswire.com/news/home/20240501914917/en/The-Protein-Discovery-Company-Shiru-Launches-World%E2%80%99s-First-Protein-Marketplace-and-Discovery-Platform) |
| Proteins with experimental Gene Ontology function annotations | fewer than 0.5% of all known proteins | [Littmann et al., *Scientific Reports*, 2021](https://www.nature.com/articles/s41598-020-80786-0) |
| Cost of one physical test | weeks: the protein must be expressed, purified and assayed in a recipe | [US 11,439,159 B2](https://patents.google.com/patent/US11439159) |

Even getting a candidate *into* the lab is unreliable. In large-scale structural-genomics efforts there was "about 49% successful expression rate" for recombinant proteins, with 52% going on to purify successfully ([Thumuluri et al., *Bioinformatics*, 2022](https://academic.oup.com/bioinformatics/article/38/4/941/6444984)). Roughly a quarter of candidates survive expression and purification before anyone can even ask whether they gel.

Shiru's CEO frames the pre-AI baseline bluntly: what once took "a team of 50 scientists a decade", plus a measure of luck, she says can now be done in months ([GlobeNewswire, 18 March 2026](https://lite.aol.com/tech/story/0022/20260318/9674147.htm)).

### The computer-science restatement

Strip the biology away and the problem is familiar:

- **Corpus:** \~10⁸ items, each a variable-length string over a 20-symbol alphabet, typically a few hundred symbols long.
- **Labels:** \~10²–10³ items with the property you care about, each costing weeks of wet-lab work to obtain.
- **Query:** one known-good item ("the main egg-white protein") or a natural-language problem statement.
- **Goal:** return a ranked shortlist, small enough to test physically, that is enriched for the target property.
- **Hard constraint:** the exact-match and edit-distance metrics that the field has used since the 1990s miss most of the good answers.

That last constraint is the crux, and the next sections explain why embeddings fix it.

## Shiru at a glance

Shiru is a California ingredient-discovery company founded in 2019 by Jasmin Hume, a protein biochemist. It has raised about $36 million in total and runs two linked products: **Flourish**, the internal discovery engine, and **ProteinDiscovery.ai**, a web marketplace that exposes part of that engine to customers — described in the press as an ["Amazon for proteins"](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins).

The business model matters for understanding the AI. Customers do not need to arrive with a protein in mind; they arrive with a problem statement, such as a natural emulsifier that stays stable in acid, and the platform returns candidate sequences they can sample, test and license. A natural sequence cannot itself be patented, so the defensible asset is the *application* of a sequence to a use that was not obvious — which makes a search engine over nature, rather than a protein-design model, a coherent commercial strategy ([AgFunderNews, July 2024](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey)).

| Date | Milestone |
| --- | --- |
| 18 Mar 2026 | Global R&D partnership with [Ingredion](https://lite.aol.com/tech/story/0022/20260318/9674147.htm); platform now cited at 77 million+ sequences; first focus is natural prebiotics |
| 24 Jun 2025 | Named a [2025 Technology Pioneer](https://www.globenewswire.com/news-release/2025/06/24/3104052/0/en/Shiru-Named-2025-Technology-Pioneer-by-World-Economic-Forum.html) by the World Economic Forum |
| 24 Apr 2025 | [Commercial production](https://proteinproductiontechnology.com/post/shiru-begins-commercial-production-of-oleopro-and-upro-ingredients) of uPro and OleoPro begins; [30+ agreements signed](https://www.greenqueen.com.hk/shiru-oleopro-alternative-fat-ai-protein-discovery/) |
| 12 Nov 2024 | [$16M Series B](https://foodbusinessnews.net/articles/27204-ai-powered-ingredient-platform-company-raises-16-million) led by S2G Ventures, bringing total funding to $36M |
| 30 Oct 2024 | ProteinDiscovery.ai named a [TIME Best Invention of 2024](https://time.com/7094945/shiru-proteindiscovery-ai) |
| 31 Jul 2024 | [Sweet-protein partnership](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey) with Ajinomoto Health & Nutrition |
| 1 May 2024 | [ProteinDiscovery.ai launches](https://www.businesswire.com/news/home/20240501914917/en/The-Protein-Discovery-Company-Shiru-Launches-World%E2%80%99s-First-Protein-Marketplace-and-Discovery-Platform): 33 million+ molecules searchable by sequence, function and expression |
| 28 Jun 2023 | [Griffith Foods](https://griffithfoods.com/news/griffith-foods-partners-with-leading-biotech-startup-shiru-to-bring-best-in-class-alternative-protein-products-to-market/) becomes OleoPro's first revenue-generating customer |
| 13 Mar 2023 | [OleoPro launched](https://www.fooddive.com/news/shiru-oleopro-plant-based-fat-ingredient/645016/), the first ingredient from the platform |
| 3 Dec 2022 | [NeurIPS workshop paper](https://neurips.cc/virtual/2022/60285) on combining language models with graph neural networks |
| 13 Sep 2022 | [US Patent 11,439,159 B2](https://patents.google.com/patent/US11439159) granted on the discovery method |
| 31 Aug 2022 | [Puratos partnership](https://www.foodnavigator.com/Article/2022/08/31/Shiru-teams-up-with-Puratos-to-develop-next-generation-egg-replacers/) on next-generation egg replacers |
| Oct 2021 | [$17M Series A](https://foodbusinessnews.net/articles/27204-ai-powered-ingredient-platform-company-raises-16-million) led by S2G Ventures |

The company publishes almost nothing about its models. The two substantive technical disclosures are the 2022 patent and a four-page NeurIPS workshop paper; both are used heavily below.

## How the solution works, at a high level

&#91;embedded content: Shiru's discovery pipeline · 4 stages, one feedback loop\]

The pipeline has four stages, and only the first is expensive to build.

**1. Build the index, once.** Every sequence in the corpus is passed through a pre-trained protein language model and stored as a single vector of roughly a thousand numbers. This is a batch job over tens of millions of proteins, and it is the company's core asset: Shiru describes a database that grew from 33 million sequences in 2024 to [more than 77 million by 2026](https://lite.aol.com/tech/story/0022/20260318/9674147.htm).

**2. Retrieve, per query.** A customer supplies either a protein that already does the job — the main egg-white protein, say, or the sweet protein brazzein — or a description of the property they need. That query becomes a vector too, and the system returns its nearest neighbours in the same space. Crucially, neighbours in this space need not look alike as strings.

**3. Filter with learned models.** Three kinds of predictor score the retrieved candidates: function (will it gel, dissolve, taste sweet?), producibility (can a microbe manufacture it, and will it secrete it?), and safety (does it resemble a known allergen?). These are small supervised models trained on the few hundred proteins Shiru has physically measured — which is only possible because the embedding already encodes most of what matters.

**4. Test, and feed the results back.** The combined shortlist goes to the laboratory, where candidates are expressed in a microbe, purified and assayed in an actual recipe. Every result, including every failure, is added back to the training data. Shiru's patent calls this cycle a discovery flywheel, and the technical name for it is active learning.

The ratios are the thing to remember. Computation narrows millions to dozens; the laboratory narrows dozens to one; and the laboratory step, not the model, sets the pace of the whole operation.

## Deep dive 1: reading proteins as a language

A protein language model is a transformer trained to fill in hidden amino acids across tens of millions of sequences. That single trick — and the fact that it needs no laboratory labels — is what makes the rest of Shiru's pipeline possible.

### The input is a string over a 20-symbol alphabet

A protein is a chain of amino acids, each written as one of 20 letters, typically a few hundred long. The sequence determines how the chain folds in three dimensions, and the fold determines what the protein does. So in principle the sequence contains the answer to "does this gel like egg white?" — the difficulty is that the mapping from sequence to behaviour is not something anyone can write down.

The resemblance to natural language is real but partial:

|  | Natural language | Protein sequence |
| --- | --- | --- |
| Vocabulary | 10⁴–10⁵ word pieces | 20 amino acids |
| Sequence length | sentences, paragraphs | typically 100–1,000 residues |
| What constrains the data | grammar, meaning, convention | physics of folding, filtered by natural selection |
| Long-range dependencies | agreement, coreference | residues far apart in sequence that touch in 3D |
| Where the corpus comes from | the web | sequence databases built from genomes |

The fourth row is the one that does the work. Two residues that sit next to each other in the folded structure co-evolve: if one mutates, the other must compensate or the protein breaks. Those correlations are visible in the sequence data alone, and a model that predicts hidden residues well has to pick them up.

### Masked language modelling, applied to proteins

The training objective is the one introduced for BERT in natural-language processing. Roughly [15% of tokens are selected at random](https://www.cs.princeton.edu/courses/archive/fall22/cos597G/lectures/lec02.pdf) and the model must reconstruct them from the surrounding context. For ESM-2, the best-documented public protein model, [NVIDIA's reference implementation](https://docs.nvidia.com/bionemo-framework/2.6.3/main/developer-guide/bionemo-esm2/bionemo-esm2-Overview) describes 15% of positions as perturbed, of which 80% are replaced by a mask token, 10% by a random amino acid and 10% left unchanged; loss is computed only at those positions.

In pseudocode the whole objective fits in a few lines:

```
for sequence in corpus:                  # ~10^8 unlabelled sequences
    positions = sample(len(sequence), p=0.15)
    corrupted = corrupt(sequence, positions)   # 80% mask, 10% random, 10% keep
    logits    = transformer(corrupted)         # (length, 20) distribution per site
    loss      = cross_entropy(logits[positions], sequence[positions])
```

No biologist labels anything. Every position in every sequence is its own supervision signal, which is why the training set can be the whole of the known protein world. As the foundational paper on the approach puts it, to succeed the model must identify "dependencies between the masked site and the unmasked parts" of the sequence ([Rives et al., *PNAS*, 2021](https://www.pnas.org/doi/10.1073/pnas.2016239118)).

### What the model learns without being told

The striking empirical result is that structure and function appear in the representation as a by-product. Training on 86 billion amino acids across 250 million sequences, Rives and colleagues found that the representation space organises itself by the biochemical properties of amino acids — hydrophobic residues clustering apart from polar ones, with further organisation by molecular weight and charge — and, at larger scales, by secondary structure, tertiary contacts and remote homology, all recoverable by simple linear projections.

Scaling continued this trend. [Lin et al. (*Science*, 2023)](https://pubmed.ncbi.nlm.nih.gov/36927031/) trained ESM-2 up to 15 billion parameters and reported that an atomic-resolution picture of protein structure emerges in the learned representations, enabling structure prediction directly from a single sequence. [Hayes et al. (*Science*, 2025)](https://doi.org/10.1126/science.ads0018) extended the family to ESM3, a multimodal model reasoning jointly over sequence, structure and function.

The lesson for a CS student is the familiar emergence story from NLP, with an unusually clean ground truth: nobody has to argue about whether the model "understands" proteins, because you can test whether its representation predicts a crystal structure.

### What Shiru says about its own models

Shiru has never published its architecture. Three disclosures anchor the inference that a protein language model sits at the centre:

1. **The patent.** It describes encoding variable-length sequences into fixed-size matrices using word-bagging, autoencoders or encoder–decoder models, naming Seq2seq and Transformers, and specifies that models generating embeddings — a fixed-size vector for a sequence or a single residue — are trained on large amounts of unlabelled data ([US 11,439,159 B2](https://patents.google.com/patent/US11439159)).
2. **The NeurIPS paper.** Shiru researchers built a method combining language models trained on protein sequences with graph neural networks trained on predicted 3D structures ([Dubourg-Felonneau et al., 2022](https://neurips.cc/virtual/2022/60285)).
3. **The Expressor description.** Hume describes the producibility model as one that uses "protein language and structural representations" ([AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins)).

Whether Shiru trains its own model or fine-tunes a public one such as ESM is not disclosed.

## Deep dive 2: embeddings and similarity search

The pre-trained model is used only once per protein. Every sequence in the database is passed through it and reduced to a single fixed-length vector, and from then on the biology is a geometry problem.

### From a sequence to a point in space

A transformer produces one vector per residue, so a 300-residue protein comes out as a 300 × d matrix. To get one vector per protein, the standard move is to average those per-residue vectors across the sequence — exactly what Rives and colleagues describe, and what later embedding-search work does ([Schütze et al., *Frontiers in Bioinformatics*, 2022](https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2022.1033775/full)). Typical dimensionalities are 1,024 for ProtT5 and 1,280 for ESM-1b. Shiru's patent describes the same step in generic terms: variable-length sequences and their features are encoded into a fixed-size representation, and those vector representations are then compared against each other.

The practical consequence is the "embed once, query many times" pattern familiar from retrieval systems. The expensive, GPU-bound pass over the corpus happens offline; a customer's query is one forward pass plus a lookup.

### Why letters fail and vectors do not

For thirty years the standard tool for "find me proteins like this one" has been sequence alignment — BLAST and its faster descendants — which scores how well two strings line up letter by letter. The method has a well-characterised blind spot, named the *twilight zone* by Burkhard Rost: between roughly 20% and 35% pairwise identity the signal blurs, and below about 25% identity fewer than 10% of aligned pairs are genuinely related, while above roughly 30% identity about 90% are ([Rost, *Protein Engineering*, 1999](https://www.biostat.wisc.edu/~kbroman/teaching/statgen/2004/refs/rost1.pdf)).

This matters enormously for Shiru's problem. A plant protein that gels like egg white has no reason to resemble ovalbumin letter by letter; it needs to fold into something that behaves similarly. Shiru's VP of business development put the contrast plainly: the conventional approach is to take an egg protein folded a certain way and look for plant proteins that fold similarly, whereas Shiru uses "embeddings, which is based on natural language processing" to find database proteins that superficially have no connection to the target but are functionally linked ([FoodNavigator, 2022](https://www.foodnavigator.com/Article/2022/08/31/Shiru-teams-up-with-Puratos-to-develop-next-generation-egg-replacers/)).

&#91;embedded content: Sequence space vs embedding space · why alignment misses functional relatives\]

The switch of metric is the whole trick: alignment asks whether two proteins share ancestry letter by letter, while embedding distance asks whether the model places them in the same region of a space organised by structure and function.

The published evidence supports the claim — with an important caveat. On a benchmark of single-domain proteins below 20% pairwise identity, nearest-neighbour search over ProtT5 embeddings reached 57.5% normalised top-1 accuracy against 34.5% for the alignment-based tool MMseqs2, and it recovered a small set of true relationships that alignment could not align at all. On full-length, multi-domain proteins the ranking reversed: MMseqs2 scored better, and the best result came from combining the two ([Schütze et al., 2022](https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2022.1033775/full)). Embedding search is a complement to alignment, not a replacement — a nuance missing from most company messaging, Shiru's included.

The same pattern holds for function rather than homology: transferring Gene Ontology annotations by proximity in embedding space works for proteins whose sequences are too distant for conventional homology transfer ([Littmann et al., *Scientific Reports*, 2021](https://www.nature.com/articles/s41598-020-80786-0)).

### Mechanics of the search

Once proteins are points, retrieval is standard vector search:

- **Metric.** Cosine similarity is the usual choice; in the benchmark above it beat Euclidean distance slightly and consistently.
- **Index.** Exhaustive scan is linear in corpus size, so production systems use approximate nearest-neighbour structures. [HNSW](https://arxiv.org/abs/1603.09320) builds a hierarchy of proximity graphs with an exponentially decaying layer assignment and achieves logarithmic search scaling; [FAISS](https://arxiv.org/abs/1702.08734) is the common implementation. In the protein benchmark, index construction took 15 seconds and the search 77 seconds, at a cost of about 0.004 AUC1 against exhaustive search.
- **The real bottleneck is embedding, not search.** Generating embeddings ran at roughly 0.08 seconds per protein on a GPU. At that rate, embedding 77 million sequences is on the order of 70 GPU-days, and storing them at 1,280 dimensions in 32-bit floats is on the order of 400 GB (my arithmetic, for scale). This is why the catalogue is a precomputed asset rather than something rebuilt per query — and part of why a 77-million-protein index is a moat.

### What a query actually returns

On ProteinDiscovery.ai a user can search by sequence or by described properties, and the system returns functionally similar proteins; Hume's example is entering elastin and getting back other sequences with the same functionality. A typical query, she says, yields a couple of dozen candidates, which Shiru can then produce and validate in-house ([AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins)).

That number is worth dwelling on. The funnel does not stop at a thousand; it runs from 77 million to a few dozen, because the lab — not the GPU — is the scarce resource. The ranking step exists to produce a shortlist a human team can physically test in a quarter.

## Deep dive 3: predicting function from a few hundred labels

Similarity search answers "what resembles this?" It does not answer "will this gel at pH 4?" That question needs supervised models — and the whole point of the pre-trained embedding is that those models can be tiny.

### The transfer-learning argument

The pattern is the one every CS student knows from computer vision: freeze a large pre-trained encoder, train a small head on a small labelled set. The protein version is unusually well suited to it, because the labels are brutally expensive and the unlabelled corpus is enormous.

The published precedents are striking. [Biswas et al. (*Nature Methods*, 2021)](https://doi.org/10.1038/s41592-021-01100-y) built usable fitness predictors from as few as 24 assayed variants by sitting on top of a pre-trained sequence representation. [NetSolP](https://academic.oup.com/bioinformatics/article/38/4/941/6444984) predicts solubility and purification usability in *E. coli* directly from sequence using ESM representations. Shiru's problem has the same shape, with food assays in place of fitness measurements.

Shiru confirms that such models exist and what they predict — solubility, pH stability and taste performance among them ([Food Dive, 2024](https://www.fooddive.com/news/shiru-ceo-discusses-ai-protein-food-platform-flourish-jasmin-hume/733646/)) — but discloses neither training-set sizes nor accuracies.

### What the patent specifies

The patent is unusually concrete about the modelling toolbox, even though it is deliberately broad:

| Component | What US 11,439,159 B2 describes |
| --- | --- |
| Supervised learning | Classification (cross-entropy loss, AUROC) and regression (MSE, r²) over protein features |
| Deep learning | Multi-layer networks, with CNNs named as an example |
| Representation | Embeddings as fixed-size vectors per sequence or per residue, from models trained on unlabelled data; autoencoders and encoder–decoder architectures including Seq2seq and Transformers |
| Homology baseline | BLAST-based sequence comparison, run alongside rather than instead of the learned models |
| Ensembling | A weighted average of the component models, with weights tuned on held-out data |
| Inputs | Amino-acid sequence; 3D structure from crystallography or predicted (AlphaFold is cited); per-residue physicochemical indices; molecular weight, charge, isoelectric point, hydrophobicity, composition; categorical features such as protein family, cellular location and source organism; and the company's own assay results |
| Target functions | Gelation, foaming, emulsification, fat structuring, moisture retention, adhesion and film formation, viscosity, fibre and scaffold formation, antimicrobial activity |

Two things are worth noticing. First, the learned embedding is one input among several; physicochemical descriptors and structure are used alongside it, which is typical of real industrial pipelines and unlike the end-to-end purity of research papers. Second, BLAST never goes away — the classical method remains in the ensemble, which matches the benchmark evidence that alignment and embeddings have complementary failure modes.

### The evaluation trap, and how the patent avoids it

One detail in the patent deserves to be taught in every ML course. For train/test splits, proteins are first clustered by sequence or alignment similarity, and the split is then made *between clusters* rather than between individual proteins.

This is the protein equivalent of grouped cross-validation, and it exists because of a specific leakage failure. Protein databases are full of near-duplicates: the same enzyme from a hundred related species. A random split puts a protein in the training set and its close homolog in the test set, so the model scores well by recognising rather than generalising — and then collapses on anything genuinely novel, which is exactly the regime a discovery platform operates in. Homology-aware splitting is the difference between a benchmark number and a usable predictor.

### Ranking and the discovery flywheel

Candidates are scored on several axes at once and compiled into a ranked list — predicted function, predicted producibility, predicted safety — and the top of that list goes to the laboratory. The patent's claim 1 describes the loop explicitly: train a model on labelled examples; apply it to a database of uncharacterised natural proteins; rank the predictions; express and purify the top candidates; assay them for the target function; add the results back into the training data; select those above a threshold; and repeat until enough proteins qualify, then test them in an actual food preparation.

The feedback step is active learning in the textbook sense, and the patent is explicit that failures are kept, deliberately adding proteins that are unlikely to perform well. A model trained only on successes has no idea what failure looks like; in a search problem where almost everything fails, negative examples are the more informative half of the dataset.

The practical payoff Shiru claims from this loop is speed. For OleoPro, the company says its scientists used AI to scan and select "nearly 10,000 formulations", with the Chief Scientific Officer contrasting a traditional route of roughly half a decade and more than a quarter of a billion dollars with a few hundred thousand dollars and a matter of months ([Griffith Foods, 2023](https://griffithfoods.com/news/griffith-foods-partners-with-leading-biotech-startup-shiru-to-bring-best-in-class-alternative-protein-products-to-market/)). These are company figures with no independent verification.

## Deep dive 4: can we make it, and is it safe?

A protein that performs beautifully and cannot be manufactured is a research result, not an ingredient. Two more predictive layers decide whether a candidate is worth anything commercially, and they are where Shiru's pipeline differs most from an academic retrieval system.

### Expressor: predicting producibility

Most natural proteins of interest are not harvested from the plant that invented them; they are produced by precision fermentation, by inserting the gene into a microbial host — yeast, *E. coli* or a fungal system — and growing it in a tank. Yields vary wildly between proteins, and a protein the host secretes into the broth is far cheaper to purify than one that must be extracted from inside cells.

Shiru's model for this is called **Expressor**. Hume describes it as a predictive model built on protein language and structural representations that estimates expression potential, intended to generalise across host organisms and across protein families, and validated across a diverse set of proteins. Its output is a likelihood of successful expression: she cites a candidate scoring above 0.80 as roughly four times more likely to express than one below 0.20 ([AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins)).

Note what kind of claim that is. It is not an accuracy figure; it is an *enrichment* figure — a statement that the score usefully ranks candidates. For a screening funnel that is the honest metric, because the model's job is to reorder a shortlist, not to decide anything on its own.

This is also where Shiru's only peer-reviewed-style publication fits. Predicting where a protein ends up in a cell is informative both about its function and about its manufacturability, and Shiru researchers showed that language-model representations of sequence and graph-neural-network representations of predicted 3D structure capture different things, so that "ensembling them outperforms the reigning state of the art method" ([Dubourg-Felonneau et al., NeurIPS 2022 workshops](https://neurips.cc/virtual/2022/60285)). That is the same ensembling philosophy the patent describes, demonstrated on a public benchmark.

### Safety screening

The patent treats safety as a negative selection criterion applied during ranking: allergenicity is predicted algorithmically from published methods, immunogenicity is assessed through MHC-binding motifs and T- and B-cell epitopes, and toxicity is predicted, with the option to confirm experimentally. It also references the FDA's GRAS notification route for new food ingredients.

The regulatory baseline for allergenicity is worth stating precisely, because it is strikingly old-fashioned. The FAO/WHO and Codex approach flags a new protein if it shows [more than 35% identity to a known allergen over a window of 80 amino acids, or shares six contiguous amino acids with one](https://www.fao.org/4/y0820e/y0820e06.htm).

There is a nice irony here for a company selling embedding search. The regulator's screen is exactly the letter-by-letter alignment that Shiru's discovery method is designed to outperform. A candidate found *because* embeddings see past sequence identity must still be cleared by a test defined in terms of sequence identity. Being distant from known allergens in alignment space is, for regulatory purposes, a feature — though reviewers have long noted that the 35% threshold is conservative and produces false positives.

### Why these two filters change the search

Together, function, producibility and safety turn retrieval into a multi-objective ranking problem. The best-gelling protein in the database is useless if yeast will not secrete it or if it looks like a peanut allergen. In practice this means the shortlist that reaches the lab is not the top of any single model's ranking — it is the top of a combined score, which is the step where a discovery platform's judgement, rather than its neural network, is doing the work.

## What has actually come out of it

Two ingredients are in commercial production, a third programme is in development with a major partner, and the platform itself has become a product.

| Output | What it is | Status |
| --- | --- | --- |
| [OleoPro](https://www.fooddive.com/news/shiru-oleopro-plant-based-fat-ingredient/645016/) | A structured fat: plant protein plus unsaturated liquid oil, solid at room temperature, browning when cooked, claimed at [over 90% less saturated fat](https://millingmea.com/ai-integrated-firm-shiru-develops-plant-based-proteins/) than conventional solid fats | Launched Mar 2023; [commercial production Apr 2025](https://proteinproductiontechnology.com/post/shiru-begins-commercial-production-of-oleopro-and-upro-ingredients) |
| [uPro](https://millingmea.com/ai-integrated-firm-shiru-develops-plant-based-proteins/) | A structured protein from potato protein, used as a clean-label texturiser, emulsifier and thickener | Commercial production Apr 2025; [30+ agreements signed](https://www.greenqueen.com.hk/shiru-oleopro-alternative-fat-ai-protein-discovery/) |
| [Sweet proteins](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey) | Natural high-intensity sweeteners, up to 5,000× sweeter than sugar with no blood-glucose impact | Discovery partnership with Ajinomoto since Jul 2024 |
| [Prebiotics](https://lite.aol.com/tech/story/0022/20260318/9674147.htm) | Natural ingredients targeting gut-microbiome health | R&D partnership with Ingredion from Mar 2026 |
| [ProteinDiscovery.ai](https://time.com/7094945/shiru-proteindiscovery-ai) | The search platform sold as a service | Launched May 2024; TIME Best Invention 2024 |

### OleoPro deserves a close read

OleoPro is the flagship proof that the platform produces saleable products, and it is also the clearest illustration of what AI did and did not do.

What the AI contributed was selection. Shiru says its scientists used AI to scan and select nearly 10,000 formulations and then determine which molecules would combine into an ingredient with the oil-holding structure of animal fat ([Griffith Foods, 2023](https://griffithfoods.com/news/griffith-foods-partners-with-leading-biotech-startup-shiru-to-bring-best-in-class-alternative-protein-products-to-market/)). The discovery phase reportedly took [under three months](https://thespoon.tech/tag/novel-food-discovery).

What the AI did not do is invent a molecule. Public descriptions identify the protein in the commercial products as potato protein — an existing, commercially available plant protein — structured with ordinary unsaturated oil through a proprietary process. The product is an oleogel: a liquid oil trapped in a protein network so it behaves like a solid fat. Hume's own framing of the achievement is about speed and selection rather than novelty, and the company stresses that engineering a scalable process was a separate effort after the model had pointed at the right proteins.

This is the honest version of the "AI discovered an ingredient" story, and it is more instructive than the headline: the model narrowed a search space, and conventional food science and process engineering did the rest.

### Sweet proteins: the cleanest test of the thesis

The Ajinomoto programme is where the embedding-search argument is most directly on trial. About a dozen sweet proteins are known, several with practical flaws such as delayed onset, lingering aftertaste or poor stability during processing. Hume's stated hypothesis is that there are "much more than a dozen sweet proteins out there" and that the difficulty has always been finding them ([AgFunderNews, 2024](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey)).

That is a falsifiable prediction about the geometry of the embedding space: if proteins that trigger the sweet-taste receptor cluster together, then starting from a known sweet protein such as brazzein and retrieving neighbours should surface proteins never previously known to be sweet. Shiru has published a visualisation of exactly this claim — a cluster of predicted-sweet proteins in a 3D projection of functional attributes — but no results, no hit rates and no validated new sweet proteins have been disclosed as of this writing.

## Confirmed, inferred, or unknown

Shiru is a private company that treats its models as trade secrets. This table separates what the company or its patent actually states from what this report reconstructs from standard practice, so every technical claim above can be traced to its evidentiary status.

| Claim | Status | Evidence |
| --- | --- | --- |
| Searchable database of 77M+ natural protein sequences (33M+ in 2024) | Confirmed | [Company release, Mar 2026](https://lite.aol.com/tech/story/0022/20260318/9674147.htm); [BusinessWire, May 2024](https://www.businesswire.com/news/home/20240501914917/en/The-Protein-Discovery-Company-Shiru-Launches-World%E2%80%99s-First-Protein-Marketplace-and-Discovery-Platform) |
| Query by sequence or by desired properties returns functionally similar proteins | Confirmed | Hume, [AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins) |
| Method uses embeddings derived from natural-language-processing techniques | Confirmed | Lewis, [FoodNavigator, Aug 2022](https://www.foodnavigator.com/Article/2022/08/31/Shiru-teams-up-with-Puratos-to-develop-next-generation-egg-replacers/) |
| Fixed-size embeddings from models trained on unlabelled data; Transformers and Seq2seq named | Confirmed as disclosed method | [US 11,439,159 B2](https://patents.google.com/patent/US11439159) |
| Trained machine-learning models predict solubility, pH stability and taste | Confirmed | [Food Dive, Nov 2024](https://www.fooddive.com/news/shiru-ceo-discusses-ai-protein-food-platform-flourish-jasmin-hume/733646/) |
| Expressor predicts microbial expression from protein language and structural representations | Confirmed | Hume, [AgFunderNews, May 2024](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins) |
| Active-learning loop; assay failures returned to the training set | Confirmed as disclosed method | [US 11,439,159 B2](https://patents.google.com/patent/US11439159) |
| Homology-aware clustering before train/test splitting | Confirmed as disclosed method | [US 11,439,159 B2](https://patents.google.com/patent/US11439159) |
| Allergenicity, immunogenicity and toxicity predicted during ranking | Confirmed as disclosed method | [US 11,439,159 B2](https://patents.google.com/patent/US11439159) |
| Masked language modelling as the pre-training objective, \~15% of residues masked | **Inferred** | Standard for protein LMs ([ESM-2 reference](https://docs.nvidia.com/bionemo-framework/2.6.3/main/developer-guide/bionemo-esm2/bionemo-esm2-Overview)); the patent never uses the terms "language model" or "self-supervised" |
| Embedding dimensionality on the order of 1,000 | **Inferred** | Public models: 1,024 (ProtT5), 1,280 (ESM-1b) |
| Approximate nearest-neighbour index (e.g. HNSW/FAISS), cosine distance | **Inferred** | Standard practice at this corpus size; no Shiru disclosure |
| Supervised heads trained on a few hundred lab-measured proteins | **Inferred** | Consistent with low-N precedents; Shiru has published no training-set size |
| Which base model is used (in-house vs ESM or similar) | Unknown | No disclosure |
| Accuracy, precision or hit rate of any Shiru model | Unknown | No disclosure; the only public benchmark is the 2022 localisation paper |
| "5–15 years to 1–2 years"; "50 scientists a decade to months"; 90% saturated-fat reduction | Company claims | Press materials only; no independent verification |

A note on method for readers who want to check this report: the two load-bearing technical documents are the [granted patent](https://patents.google.com/patent/US11439159) (filed Nov 2021, granted Sep 2022, inventors Hume, Dubourg-Felonneau, Kunibe and Lee) and the [NeurIPS 2022 workshop paper](https://neurips.cc/virtual/2022/60285). Everything else about Shiru's internals comes from interviews and press releases, which are promotional sources and are treated as such throughout.

## Limitations and open questions

### The model sees a molecule; food is a system

The deepest limitation is a mismatch between what the input encodes and what the target depends on. A protein language model sees one sequence in isolation. Whether that protein gels, foams or emulsifies in a real product depends on its concentration, the pH, ionic strength, temperature history, processing method and every other ingredient in the formulation — which is precisely why food-science reviews define functionality in terms of behaviour in a matrix rather than as a property of the molecule ([Zhang et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8621404)).

So the function predictors are learning a projection of a context-dependent property onto a context-free input. That can work well enough to rank candidates, which is all the funnel requires, but it bounds how good such a model can ever be, and it is the structural reason the wet lab cannot be removed from the loop.

### Known weaknesses of the method itself

- **Multi-domain proteins.** Averaging residue vectors into one protein vector blurs proteins built from several independent domains, and embedding search measurably underperforms alignment on realistic full-length sets ([Schütze et al., 2022](https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2022.1033775/full)). Many food proteins are large and multi-domain.
- **Label scarcity does not disappear.** Transfer learning reduces the labels needed; it does not make a few hundred noisy assay results cover 77 million candidates. Performance away from the training clusters is the entire question, and no public evidence addresses it.
- **Nothing is independently benchmarked.** No accuracy figures, hit rates or validation sets have been published for any Flourish model. The claims in this report about Shiru's performance are the company's own.
- **Retrieval bias toward the known.** Starting from a known-good protein and retrieving neighbours is conservative by construction: it finds analogues of what already works and is unlikely to surface a mechanism nobody has thought of.

### Discovery is the cheap part

A shortlisted protein still has to be produced at tonnage economics, cleared for food safety — in the US typically through the GRAS route — and accepted by formulators and consumers. None of these are predicted by a function model, and all of them have killed ingredients that worked in the lab. The commercial record so far reflects this: Shiru's two commercial products are built on potato protein rather than on an exotic microbial protein requiring fermentation and a novel-food approval.

The business environment is a real constraint too. Shiru conducted layoffs at the end of 2023 to conserve cash ([AgFunderNews, Jul 2024](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey)), and the pivot from selling ingredients to selling platform access is as much a response to that pressure as it is a technology strategy.

### Open questions worth a research project

1. **Does embedding proximity predict *techno-functional* similarity?** The published evidence shows embeddings capture evolutionary and structural relatedness. Gelling, foaming and emulsifying are physical behaviours that are not obviously the same thing as biological function. This is the central assumption of the whole approach, and it is untested in public.
2. **What acquisition function should a discovery funnel use?** With weeks per label and a hard budget, the choice between exploiting the top of the ranking and exploring uncertain regions is a live active-learning question with real money attached.
3. **How should a multi-objective shortlist be built?** Combining function, expression likelihood and allergenicity scores into one ranking is a decision-theoretic problem that nobody in this space has published on.
4. **Where is the public benchmark?** Protein ML has CASP, CAFA and DeepLoc. Food functionality has no shared dataset, which is exactly why claims in this sector cannot be compared.

## Glossary for computer scientists

| Term | Meaning in this context |
| --- | --- |
| Amino acid / residue | The 20 symbols of the alphabet; a residue is one position in a sequence |
| Sequence | The protein as a string, typically 100–1,000 symbols |
| Fold / structure | The 3D shape the string collapses into; determines behaviour |
| Protein language model (pLM) | A transformer trained on protein sequences with a language-modelling objective |
| Masked language modelling (MLM) | Hide \~15% of positions, train the model to reconstruct them from context |
| Self-supervised | Supervision comes from the data itself, so no laboratory labels are needed |
| Embedding | A fixed-length vector representing a residue or a whole protein |
| Mean pooling | Averaging per-residue vectors to get one vector per protein |
| Cosine similarity | The usual distance measure between protein embeddings |
| ANN search (HNSW, FAISS) | Approximate nearest-neighbour index and library; sub-linear retrieval over millions of vectors |
| Homology | Shared evolutionary ancestry; traditionally detected by sequence alignment |
| BLAST / MMseqs2 | Classical alignment-based search tools, matching letter by letter |
| Twilight zone | 20–35% sequence identity, where alignment can no longer tell relatives from strangers |
| Transfer learning | Freeze a large pre-trained model, train a small head on few labels |
| Active learning | Choose the next examples to label so as to improve the model fastest |
| Techno-functional property | What food science cares about: gelling, foaming, emulsifying, solubility, heat and pH stability |
| Emulsifying | Holding oil and water together in a stable mixture |
| Gelation | Forming a solid network that holds other ingredients, as egg white does when cooked |
| Oleogel | Liquid oil trapped in a network so it behaves like a solid fat; OleoPro's physical form |
| Expression | Producing a protein by inserting its gene into a microbial host and fermenting |
| Secretion | The host exporting the protein out of the cell, which makes purification much cheaper |
| GRAS | "Generally recognised as safe": the US regulatory route for a new food ingredient |
| ESM | Meta's family of open protein language models; the best-documented public example |
| AlphaFold | Structure-prediction system; its database supplies predicted 3D structures as model input |

## Sources

All pages below were retrieved on 18 November 2026.

**Shiru primary and technical**

1. Hume J., Dubourg-Felonneau G., Kunibe A., Lee L. [*System for identifying and developing individual naturally-occurring proteins as food ingredients by machine learning and database mining combined with empirical testing for a target food function*](https://patents.google.com/patent/US11439159). US Patent 11,439,159 B2, granted 13 Sep 2022 (filed 5 Nov 2021; priority 22 Mar 2021).
2. Dubourg-Felonneau G., Abbasi A., Akiva E., Lee L. [*Improving Protein Subcellular Localization Prediction with Structural Prediction & Graph Neural Networks*](https://neurips.cc/virtual/2022/60285). NeurIPS 2022 workshops (LMRL).
3. [*Shiru presents a better AI approach for protein function prediction*](https://www.proteinproductiontechnology.com/post/shiru-presents-a-better-ai-approach-for-protein-function-prediction). Protein Production Technology, Nov 2022.

**Shiru interviews and announcements**

4. Watson E. [*Shiru harnesses AI to launch protein discovery platform: "It's like Amazon for proteins"*](https://agfundernews.com/shiru-harnesses-ai-to-launch-protein-discovery-platform-its-like-amazon-for-proteins). AgFunderNews, 1 May 2024 — Expressor, similarity search, query results.
5. Watson E. [*Shiru and Ajinomoto team up on AI-powered sweet protein discovery*](https://agfundernews.com/shiru-and-ajinomoto-team-up-on-ai-powered-sweet-protein-discovery-journey). AgFunderNews, 31 Jul 2024 — sweet proteins, patenting strategy, layoffs.
6. Watson E. [*Shiru teams up with Puratos to develop next generation egg replacers*](https://www.foodnavigator.com/Article/2022/08/31/Shiru-teams-up-with-Puratos-to-develop-next-generation-egg-replacers/). FoodNavigator, 31 Aug 2022 — embeddings and NLP.
7. Lawinski J. [*Shiru CEO discusses AI protein food platform Flourish*](https://www.fooddive.com/news/shiru-ceo-discusses-ai-protein-food-platform-flourish-jasmin-hume/733646/). Food Dive, 21 Nov 2024.
8. [*The Protein Discovery Company Shiru Launches World's First Protein Marketplace and Discovery Platform*](https://www.businesswire.com/news/home/20240501914917/en/The-Protein-Discovery-Company-Shiru-Launches-World%E2%80%99s-First-Protein-Marketplace-and-Discovery-Platform). BusinessWire, 1 May 2024.
9. [*Ingredion and Shiru Announce Partnership to Accelerate AI-Powered Functional Protein Discovery*](https://lite.aol.com/tech/story/0022/20260318/9674147.htm). GlobeNewswire, 18 Mar 2026.
10. [*Griffith Foods Partners With Shiru*](https://griffithfoods.com/news/griffith-foods-partners-with-leading-biotech-startup-shiru-to-bring-best-in-class-alternative-protein-products-to-market/). Griffith Foods, 28 Jun 2023 — formulation screening, cost and time claims.
11. [*Shiru launched OleoPro, a plant-based fat ingredient*](https://www.fooddive.com/news/shiru-oleopro-plant-based-fat-ingredient/645016/). Food Dive, Mar 2023.
12. [*Shiru begins commercial production of OleoPro and uPro*](https://proteinproductiontechnology.com/post/shiru-begins-commercial-production-of-oleopro-and-upro-ingredients). Protein Production Technology, 29 Apr 2025.
13. [*AI-integrated firm Shiru develops plant-based proteins*](https://millingmea.com/ai-integrated-firm-shiru-develops-plant-based-proteins/). Milling MEA, 2025 — uPro composition, saturated-fat claim.
14. [*Shiru Hits Commercial Scale With AI-Derived Structured Fat Ingredient*](https://www.greenqueen.com.hk/shiru-oleopro-alternative-fat-ai-protein-discovery/). Green Queen, 2025.
15. Pillay T. [*A Protein Marketplace: Shiru ProteinDiscovery.ai*](https://time.com/7094945/shiru-proteindiscovery-ai). TIME Best Inventions 2024, 30 Oct 2024.
16. [*AI-powered ingredient platform company raises $16 million*](https://foodbusinessnews.net/articles/27204-ai-powered-ingredient-platform-company-raises-16-million). Food Business News, Nov 2024 — Series A and B.
17. [*Shiru Named 2025 Technology Pioneer by World Economic Forum*](https://www.globenewswire.com/news-release/2025/06/24/3104052/0/en/Shiru-Named-2025-Technology-Pioneer-by-World-Economic-Forum.html). GlobeNewswire, 24 Jun 2025.

**Protein language models and embedding search**

18. Rives A. et al. [*Biological structure and function emerge from scaling unsupervised learning to 250 million protein sequences*](https://www.pnas.org/doi/10.1073/pnas.2016239118). PNAS 118(15), 2021.
19. Lin Z. et al. [*Evolutionary-scale prediction of atomic-level protein structure with a language model*](https://pubmed.ncbi.nlm.nih.gov/36927031/). Science 379(6637):1123–1130, 2023.
20. Hayes T. et al. [*Simulating 500 million years of evolution with a language model*](https://doi.org/10.1126/science.ads0018). Science 387:850–858, 2025.
21. Schütze K., Heinzinger M., Steinegger M., Rost B. [*Nearest neighbor search on embeddings rapidly identifies distant protein relations*](https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2022.1033775/full). Frontiers in Bioinformatics 2:1033775, 2022.
22. Littmann M. et al. [*Embeddings from deep learning transfer GO annotations beyond homology*](https://www.nature.com/articles/s41598-020-80786-0). Scientific Reports 11:1160, 2021.
23. Rost B. [*Twilight zone of protein sequence alignments*](https://www.biostat.wisc.edu/~kbroman/teaching/statgen/2004/refs/rost1.pdf). Protein Engineering 12(2):85–94, 1999.
24. Thumuluri V. et al. [*NetSolP: predicting protein solubility in Escherichia coli using language models*](https://academic.oup.com/bioinformatics/article/38/4/941/6444984). Bioinformatics 38(4):941–946, 2022.
25. Biswas S., Khimulya G., Alley E.C., Esvelt K.M., Church G.M. [*Low-N protein engineering with data-efficient deep learning*](https://doi.org/10.1038/s41592-021-01100-y). Nature Methods 18:389–396, 2021.
26. Malkov Y.A., Yashunin D.A. [*Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs*](https://arxiv.org/abs/1603.09320). arXiv:1603.09320, 2016.
27. Johnson J., Douze M., Jégou H. [*Billion-scale similarity search with GPUs*](https://arxiv.org/abs/1702.08734). arXiv:1702.08734, 2017.
28. NVIDIA. [*BioNeMo ESM-2 overview*](https://docs.nvidia.com/bionemo-framework/2.6.3/main/developer-guide/bionemo-esm2/bionemo-esm2-Overview) — masking percentages and transferability.
29. Chen D. [*Lecture 2: BERT (encoder-only models)*](https://www.cs.princeton.edu/courses/archive/fall22/cos597G/lectures/lec02.pdf). COS 597G, Princeton University, 2022 — the 15% masking convention.

**Food science and regulation**

30. Zhang Y., Sharan S., Rinnan Å., Orlien V. [*Survey on Methods for Investigating Protein Functionality and Related Molecular Characteristics*](https://pmc.ncbi.nlm.nih.gov/articles/PMC8621404). Foods 10(11):2848, 2021.
31. [*Plant protein functionality review*](https://pmc.ncbi.nlm.nih.gov/articles/PMC8391319). Foods, 2021 — poor functionality of plant proteins.
32. FAO/WHO. [*Evaluation of Allergenicity of Genetically Modified Foods — sequence homology criteria*](https://www.fao.org/4/y0820e/y0820e06.htm) — the 35%/80-residue and six-contiguous-residue rules.
