# Amazon Rufus / Alexa Shopping: Anatomy of an LLM Sales Agent at Scale

Nov 4, 2026 · @Rey Riordan

## Verdict

Rufus, renamed **Alexa for Shopping** on 13 May 2026, is the LLM sales agent that earns its place as a case study: it is the largest publicly documented conversational shopping agent, and Amazon reports its scale and sales impact on earnings calls. Amazon says more than 400 million customers used it in the 12 months to September 2026, with interactions up 570% year on year [\[4\]](https://www.sec.gov/Archives/edgar/data/0001018724/000101872426000038/amzn-20260930xex991.htm).

The technical record is thin. Amazon's main description is one 5-minute Amazon Science blog post from October 2024 [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus), plus AWS engineering posts on serving. We found no peer-reviewed paper describing the system end to end, so every architectural claim below is either Amazon's own blog-level description or clearly marked as our interpretation.

What makes it worth studying is the combination of three ideas that CS students meet separately:

- **A domain-specific LLM** trained mainly on shopping data (catalogue, reviews, community Q&A) with a deliberately tuned data mixture [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).
- **Retrieval-augmented generation with tool calls** into live store systems, where the right evidence source changes from question to question [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).
- **Reinforcement learning from customer feedback**, using thumbs-up and thumbs-down signals at very large scale [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).

Around those sit two systems lessons, serving an LLM to millions at low latency and streaming structured answers into a shopping UI, and two open questions for discussion: how much of the reported lift is causal, and what happens when ads appear inside an assistant's answers.

**Naming in this report.** "Rufus" refers to the assistant from its February 2024 launch to May 2026, and to the engine Amazon says still powers parts of the experience. "Alexa for Shopping" refers to the merged product after 13 May 2026 [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant).

## What it is and where it came from

Rufus began as a chat assistant inside the Amazon Shopping app and grew into an agent that can act on a shopper's behalf. At launch, Amazon described five jobs: explain what to look for in a category, suggest products for an occasion ("what do I need for cold weather golf?"), compare product types, recommend items, and answer questions about the product page a shopper is viewing, using listing details, reviews and community Q&A [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus).

By 2026 the same assistant could also take actions. Alexa for Shopping can schedule recurring tasks ("add this sunscreen to my cart if the price drops to $10"), build carts from past orders, show up to a year of price history, and, through a feature called Buy for Me, complete purchases on other retailers' sites [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant). In the vocabulary of LLM systems, it moved from a retrieval-augmented question answerer to a tool-using agent.

The May 2026 rename merged Rufus's product knowledge with the personal memory of Alexa+, so a conversation started on an Echo speaker can continue in the shopping app [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant). MediaPost reports that Rufus technology still powers parts of the experience behind the scenes [\[9\]](https://www.mediapost.com/publications/article/415053/).

**Timeline (newest first)**

| Date | Milestone | Source |
| --- | --- | --- |
| 29 Oct 2026 | Q3 2026 results: 400M+ customers in the last 12 months, interactions up 570%; 100+ new account and list actions added | [\[4\]](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Third-Quarter-Results/) |
| 30 Jul 2026 | Q2 2026 results: 350M+ customers over 12 months; users spend over 40% more per order | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 13 May 2026 | Rufus renamed Alexa for Shopping; questions accepted in the main search bar; free for all signed-in US customers | [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant) |
| 1 May 2026 | Price history extended to 365 days | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 29 Apr 2026 | Q1 2026 call: monthly users up 115%, engagement up 400% | [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/) |
| 25 Mar 2026 | Sponsored prompts become billable at cost-per-click in the US | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 6 Feb 2026 | Q4 2025 results: 300M+ customers in 2025; nearly $12B incremental annualised sales | [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/) |
| 18 Nov 2025 | Account memory, 30- and 90-day price history, and Auto Buy at a target price | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 11 Nov 2025 | Sponsored prompts launch as a free beta | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 30 Oct 2025 | Q3 2025 results: 250M customers in 2025; on track for $10B+ incremental annualised sales | [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/) |
| 2024–2025 | Rolled out beyond the US to the UK, India, France, Germany, Italy, Spain and Canada | [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/) |
| 4 Oct 2024 | Amazon Science publishes its technical overview of Rufus | [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus) |
| 1 Feb 2024 | Beta launch to a small subset of US mobile-app customers, with thumbs-up/down feedback on answers | [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus) |

## The problem it solves

Rufus exists because keyword search answers "find me X" well but cannot answer "what should I buy?" Amazon frames the gap with questions a shopper might ask a sales associate in a physical store: "What do I need for cold-weather golf?", "What are the differences between trail shoes and running shoes?", "What are the best dinosaur toys for a five-year-old?" [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).

### The shopper's problem, in CS terms

It helps to split that gap into three sub-problems, each of which a classic search engine handles poorly. This decomposition is ours; the examples are Amazon's.

1. **Intent to catalogue mapping.** "Cold-weather golf" names an activity, not a product. The system has to expand it into shoppable categories, which Amazon says Rufus does by suggesting golf base layers, jackets and gloves [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus). A lexical matcher has no item titled "cold-weather golf" to return.
2. **Evidence synthesis.** Questions such as "is this cordless drill easy to hold?" are answered by reading listing details, reviews and community Q&A together [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus). A popular product can have thousands of reviews, far more than a shopper will read.
3. **Comparison and decision support.** "Lip gloss versus lip oil" or "drip versus pour-over" asks for a structured comparison across attributes, then a recommendation [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus).

A generative model can attempt all three in one conversational turn, and can ask follow-up questions when the intent is vague. That is the customer-facing case for an LLM here rather than a better ranking function.

### Amazon's strategic problem

The business problem is about where product research happens. Fortune describes Rufus as a way to keep shoppers inside Amazon rather than losing them to Google, where they may find competing retailers, or to chatbots such as ChatGPT [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/).

That concern sharpened as general-purpose agents began shopping on users' behalf. Amazon restricted AI crawlers in its robots.txt in 2025 and sued Perplexity in November 2025 over the shopping agent in its Comet browser [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/). In October 2026 Andy Jassy said Amazon expects Alexa for Shopping to be "the primary shopping agent customers use to shop Amazon", weeks after Amazon blocked Meta's Muse agent from its site [\[6\]](https://thenextweb.com/news/alexa-for-shopping-jassy-ai-shopping-agents-meta-muse).

Advertising explains much of the stake. Amazon's sponsored ads sit on pages a human looks at, and an outside agent that searches and checks out for a user never needs to show those pages [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/). An assistant Amazon controls keeps both the research and the ad inventory in-house.

## Deep dive 1: the model layer

Rufus launched on a shopping-specialised LLM that Amazon built itself, and by late 2025 it had become a routed portfolio: the custom model plus Amazon Nova and Anthropic's Claude Sonnet, chosen per query type [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). Both halves of that story teach something.

### Why build a custom model at all?

Amazon's stated reason is a cost-quality trade-off. Most off-the-shelf models it tried did poorly on its shopping evaluations, and the ones that did better were larger, slower and more expensive [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). The team wanted a model that was excellent in one domain rather than good at everything.

AWS describes the result only as a "multi-billion parameter" LLM [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/). Architecture, exact size and training-token counts have not been published.

### Domain pretraining and the data mixture

Amazon Science titles this part "Building a custom LLM from scratch". Rather than taking a general model and adapting it, the aim was to train it mainly on shopping data: the entire catalogue, customer reviews and community Q&A, plus public web information, with the contribution of each source curated deliberately [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus). Data preparation ran on Amazon EMR, a distributed data-processing service, with storage on S3 [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).

**The concept.** Pretraining teaches a model by asking it to predict the next token across a huge corpus, so the corpus largely decides what the model knows. A *data mixture* sets how often the model sees each source: upweight reviews and it absorbs more consumer experience, upweight the web and it keeps more general knowledge. Tuning those weights is one of the main levers a team has, and it is usually found by training smaller models on candidate mixtures and comparing them on evaluations.

The table below is our reading of what each source plausibly contributes. Amazon names the sources but not their roles or weights.

| Source | Named by Amazon | What it plausibly teaches (our interpretation) |
| --- | --- | --- |
| Product catalogue | Yes [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus) | Product types, attributes and the vocabulary of listings |
| Customer reviews | Yes [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus) | How products perform in use, common complaints, subjective qualities such as "comfortable" |
| Community Q&A | Yes [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus) | The shape of real shopper questions and good answers to them |
| Curated public web | Yes [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus) | Background knowledge, for example what cold-weather golf involves |

### Fine-tuning for conversation

Pretraining produces a model that continues text; turning it into an assistant needs fine-tuning. An Amazon industry paper at SIGIR 2025 describes a year of fine-tuning LLMs for Rufus, including how training data was collected, and applications to product recommendation, asking clarifying questions and serving international customers [\[11\]](https://doi.org/10.1145/3726302.3731955). We could read only its indexed abstract; the full text sits behind the ACM Digital Library.

### From one model to a routed portfolio

The in-house model had a velocity problem. Amazon wanted advanced reasoning, longer context and multi-step tasks, but each training iteration of its own LLM took weeks or months while stronger outside models kept arriving [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). Moving to Amazon Bedrock, AWS's managed model service, raised development velocity more than sixfold by Amazon's account [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/).

The portfolio is routed by difficulty. Open-ended tasks such as planning a camping trip or choosing a gift need deeper reasoning, several turns and tools like web search; a lookup such as "what is the wattage on this drill?" goes to a smaller, faster model [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). This is a *model cascade*: spend expensive compute only where it changes the answer.

A separate small model sits in front of generation. AWS describes a **query planner** that classifies each question and enhances retrieval, and the main LLM cannot start generating until it finishes, so it carries a 300 ms latency budget [\[12\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-doubled-their-inference-speed-and-handled-prime-day-traffic-with-aws-ai-chips-and-parallel-decoding/).

### How Amazon says it measures quality

Amazon lists LLM-as-a-judge scoring for answer accuracy, alongside latency, repeat engagement and the number of conversation turns per interaction [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). It has published no benchmark scores for the custom model.

## Deep dive 2: retrieval and tool calling

Rufus does not answer from memory alone: before it writes, it gathers evidence from Amazon's own systems, and in its agentic form it can call services that change things, such as a cart or a price alert. Amazon's summary is that it pulls from reviews, the catalogue and community Q&A and calls Stores APIs, and that which source matters most changes with the question [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus).

### Retrieval-augmented generation (RAG)

**The concept.** A model's weights are frozen at training time, but prices, stock and reviews change hourly. RAG fixes this by fetching relevant documents at query time and placing them in the prompt, so the model writes from fresh evidence rather than recall. It also lets an answer point to where its facts came from.

In Rufus, retrieval includes product information from Amazon search results matched to the customer's query [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/). The query planner shapes that retrieval by working out whether a question is keyword-style or conversational and what it is asking for [\[12\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-doubled-their-inference-speed-and-handled-prime-day-traffic-with-aws-ai-chips-and-parallel-decoding/). For questions that need outside knowledge, Amazon added Nova Web Grounding, which searches the web and cites sources, and says it significantly reduced answer defects [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/).

The hard part Amazon highlights is source selection. A question about durability is best answered from reviews, a question about dimensions from the catalogue, and a question about delivery from a live API [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus). Mapping each question to the right mix is itself a learned decision.

| Evidence source or tool | Example question it serves | Source |
| --- | --- | --- |
| Customer reviews | "Is this cordless drill easy to hold?" | [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus) |
| Catalogue and listing details | "Is this jacket machine washable?" | [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus) |
| Community Q&A | Specific product questions other shoppers have asked | [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus) |
| Search results | Candidate products for a recommendation | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| Order history | "When did I last order AA batteries?" | [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant) |
| Web search with citations | Planning, style advice, broad research | [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/) |
| Price-history and price-alert service | "Buy these headphones when they're 30% off" | [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/) |

### Tool calling: when to fetch, when to let the model decide

**The concept.** In tool calling, the model emits a structured request, such as a function name and arguments, instead of prose. The application runs the function and feeds the result back, and the model continues. Looping "think, call a tool, observe, think again" is the ReAct pattern.

Amazon's 2026 SIGIR paper says the Rufus shopping agent follows a ReAct-style framework, pairing LLM reasoning with deterministic backend services for retrieval, ranking and action execution [\[14\]](https://doi.org/10.1145/3805712.3808408). It reports that one agent supports product discovery, shopping question answering and agentic actions under real traffic [\[14\]](https://doi.org/10.1145/3805712.3808408). As with the 2025 paper, we reviewed only the indexed abstract and excerpts.

The AWS write-up adds a useful design detail: context is supplied in two ways. When the system already knows what is needed, for example order history for an order question, it injects that into the first request, which saves inference calls and makes behaviour more predictable; otherwise the model decides for itself when to call a tool [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). Prompt caching and parallel tool calls cut latency further [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/).

### Agentic actions: the LLM proposes, ordinary software disposes

Auto Buy shows how the agentic features are wired. The model creates a persistent record in a price-alert and auto-buy service, and conventional software then watches prices and acts on the record; purchases complete within 30 minutes of the target price being met, and requests stay active for six months [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/). The LLM never has to stay "awake" for six months, and the money-moving step runs in auditable, deterministic code.

The same split appears elsewhere. Scheduled Actions either notify the shopper or add items to the cart for review before checkout, and Buy for Me completes eligible purchases on other retailers' sites using the customer's primary address and card [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant). Personal context comes from account memory, such as pets, family members and dietary needs, which customers can view and correct by asking [\[3\]](https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant).

## Deep dive 3: reinforcement learning from customer feedback

This is the least documented of the three components. Amazon says customers can mark answers as liked or disliked, and that Rufus learns from that feedback through reinforcement learning so later answers improve [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus). The beta added a thumbs-up or thumbs-down on every answer plus optional free-text feedback [\[2\]](https://www.aboutamazon.com/news/retail/amazon-rufus). Amazon has not published the reward design, the algorithm or how often models are updated.

So this section does three things: explains the standard recipe, shows a published system that does something similar in e-commerce, and sets out the problems any such system must solve. The first and third parts are general background and our analysis, not Amazon disclosures.

### The standard recipe (general background)

Reinforcement learning from human feedback (RLHF) is usually described in four steps:

1. **Collect preferences.** Show people model answers and record which they prefer, or whether they approve.
2. **Train a reward model.** Fit a second model that predicts that human judgement from the question and answer.
3. **Optimise the policy.** Update the LLM to produce answers the reward model scores highly, while a penalty keeps it close to its previous behaviour so it does not drift into nonsense that happens to score well.
4. **Evaluate and redeploy,** then collect new feedback on the new model's answers.

Newer methods such as Direct Preference Optimization skip the explicit reward model and learn directly from preference pairs. Rufus's thumbs signal is a natural fit for step 1, though as a single approve or disapprove rather than a comparison between two answers.

### A published analogue: learning from shopping logs

Amazon has not published its method, but JD.com researchers have described one for their shopping agent, and it makes the ideas concrete [\[15\]](https://arxiv.org/html/2608.11604). Treat it as an illustration, not as how Rufus works.

- **Purchases as a verifiable reward.** Sessions that end in a purchase become training data, and the agent is rewarded by where the purchased item lands in its ranked recommendations, scored with NDCG@10 and optimised with GRPO, a policy-gradient method [\[15\]](https://arxiv.org/html/2608.11604).
- **Mining what users say next.** An LLM labels the user's next message as criticism, a missed constraint, a bare rejection or a comparison, and that label guides a corrected "teacher" response the model learns from token by token [\[15\]](https://arxiv.org/html/2608.11604).
- **Why both are needed.** The authors note that purchase signals are sparse and delayed, which makes it hard to tell which turn in a conversation deserved credit [\[15\]](https://arxiv.org/html/2608.11604).

### Problems any feedback loop must solve (our analysis)

- **Sparse and skewed signal.** Few shoppers rate answers, and those who do are not a random sample. A reward model trained on them learns the raters' tastes.
- **Noisy meaning.** A thumbs-down may judge the product, the price or the answer. The reward has to separate "bad answer" from "bad news".
- **Credit assignment.** In a five-turn conversation that ends in a purchase, which turn earned it? The same issue appears in the attribution debate later in this report.
- **Reward hacking.** A model optimised for approval can learn flattery; one optimised for purchases can learn to oversell. For a retailer the second risk is commercial as well as technical, because the reward and the business interest point the same way.

Amazon's own evaluation list, LLM-as-a-judge accuracy plus engagement measures such as repeat use and turns per conversation [\[10\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-scales-conversational-shopping-experiences-to-millions-of-amazon-customers-with-amazon-bedrock/), hints at the usual defence: combine several signals so no single one can be gamed. Whether those signals feed the RL reward directly is not disclosed.

## Serving at scale: chips, batching, decoding and streaming

Serving is the best-documented part of Rufus, because AWS uses it to showcase its own chips. On Prime Day 2024 Rufus ran on more than 80,000 Trainium and Inferentia chips across three AWS Regions, averaging 3 million tokens a minute while keeping 99th-percentile time to first response under one second [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/).

| Prime Day 2024 metric | Reported value | Source |
| --- | --- | --- |
| AI chips in service | 80,000+ (Inferentia2 and Trainium) | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| Throughput | \~3M tokens per minute | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| P99 latency to first response | < 1 second | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| Cost versus other evaluated options | 4.5x lower | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| Performance per watt versus other options | 54% better | [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/) |
| Query-planner latency budget | 300 ms | [\[12\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-doubled-their-inference-speed-and-handled-prime-day-traffic-with-aws-ai-chips-and-parallel-decoding/) |

All comparisons are against unnamed "other evaluated solutions", so treat them as vendor claims.

### Continuous batching

**The concept.** An LLM produces its answer one token at a time, and answers vary greatly in length. With *static batching*, a group of requests runs together until the longest one finishes, so short answers wait and slots sit idle. *Continuous batching* revisits the batch after every generated token: a finished request leaves at once and a waiting one takes its slot.

Amazon worked with AWS to bring continuous batching to Rufus, making routing decisions for new requests after each token [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus). AWS adds that it prioritises the *prefill* stage, where the prompt is processed, so time to first token stays under control even as concurrency rises; under static batching that delay grows linearly with batch size [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/). The stack ran vLLM inside NVIDIA's Triton Inference Server on AWS's Neuron SDK [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/).

### Other latency levers

- **Quantisation.** Weights stored as 8-bit integers (INT8, weight-only) shrink memory traffic, which dominates decoding cost [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/).
- **Load balancing.** Routing each request to the host with the fewest outstanding requests raised throughput fivefold over an earlier baseline [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/).
- **Parallel (speculative) decoding.** The query planner gained extra "decoding heads" that guess several future tokens at once; a tree-based attention step checks the guesses and keeps the ones the base model agrees with. AWS reports twice-as-fast generation and 50% lower inference cost [\[12\]](https://aws.amazon.com/blogs/machine-learning/how-rufus-doubled-their-inference-speed-and-handled-prime-day-traffic-with-aws-ai-chips-and-parallel-decoding/). The technique matches the open-source Medusa method, which the post points readers to.
- **Multi-node models.** When the model outgrew a single machine, Amazon split one model replica across several Trainium nodes: a leader runs the vLLM scheduler, followers execute their share, and prefill and decode use different parallelism schemes [\[16\]](https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/). AWS says this let a much larger model serve Prime Day traffic on tens of thousands of Trainium chips (the post appeared in August 2025) [\[16\]](https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/).

### Structured streaming and hydration

Rufus streams its answer token by token, so the shopper starts reading within a second while the rest is still being generated [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/). The model is also trained to emit markup that says how each part of the answer should be displayed, and a backend step Amazon calls **hydration** fills that markup with data from internal systems [\[1\]](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus). Several services, connected over gRPC, enrich the stream in real time with images and links [\[13\]](https://aws.amazon.com/blogs/machine-learning/scaling-rufus-the-amazon-generative-ai-powered-conversational-shopping-assistant-with-over-80000-aws-inferentia-and-aws-trainium-chips-for-prime-day/).

Why split the work this way? Our interpretation: the model decides *what* to show, such as "a product card for item X here", while trusted systems supply the facts that change or must be exact, such as price and stock. That keeps volatile numbers out of the model's free text, where they could be stale or hallucinated.

## Monetisation: ads inside the assistant

Amazon now sells placements inside Rufus's conversation, and it prices them through the same auction as its search ads. The main format is the **sponsored prompt**: a suggested question, shown in search results and on product pages, that opens a Rufus conversation about a particular product or brand [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/).

| Date | Step | Source |
| --- | --- | --- |
| 29 Apr 2026 | Jassy: nearly 20% of shoppers who interact with a brand prompt continue the conversation about that brand | [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/) |
| 25 Mar 2026 | Prompts become billable under existing cost-per-click bids in the US, with no separate bid | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 11 Nov 2025 | Sponsored Products and Sponsored Brands prompts launch as a free beta | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| Apr 2025 | Business Insider reports internal projections of $700M+ in indirect operating profit from Rufus in 2025, rising to $1.2B by 2027, including ads in responses | [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/) |

In July 2026 Jassy added that shoppers who click a sponsored prompt convert 48% more often and spend 21% more on average [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/). These are the same kind of user-versus-non-user comparisons discussed in the next section, so they say little about cause.

### Why ads change in an assistant

A search results page shows dozens of products and several labelled ad slots. An assistant's answer is a short list. Research firm Workflow Labs estimates Rufus compresses discovery from about 50 results to roughly five named products, a figure that is the firm's, not Amazon's [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/).

Jassy's view is that conversation creates more ad opportunities, not fewer: as an assistant narrows a request through questions, there are "multiple opportunities to surface relevant products", some organic and some sponsored [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/). The open question for students is where the boundary sits between an answer and an advertisement, and whether a shopper can always tell which they are reading.

## Success and adoption, and how to read the numbers

By Amazon's count the assistant's reach grew from 250 million customers in 2025 to more than 400 million over the 12 months to September 2026. Every figure here is company-reported, unaudited and published without a method [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/).

| Reported (quarter) | Name | Customers | Engagement growth, year on year | Purchase claim | Source |
| --- | --- | --- | --- | --- | --- |
| 29 Oct 2026 (Q3 2026) | Alexa for Shopping | 400M+ in last 12 months | Interactions +570% | US users spend 50% more per order | [\[4\]](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Third-Quarter-Results/), [\[6\]](https://thenextweb.com/news/alexa-for-shopping-jassy-ai-shopping-agents-meta-muse) |
| 30 Jul 2026 (Q2 2026) | Alexa for Shopping | 350M+ over 12 months | Active users nearly doubled; interactions more than 5x | Over 40% more per order | [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/) |
| 29 Apr 2026 (Q1 2026) | Rufus | Not reported | Monthly users +115%; engagement +400% | 60% more likely to complete a purchase | [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/) |
| 6 Feb 2026 (Q4 2025) | Rufus | 300M+ in calendar 2025 | Not reported | Nearly $12B incremental annualised sales | [\[8\]](https://www.modernretail.co/technology/amazon-says-its-ai-shopping-assistant-is-gaining-traction-with-rufus-users-up-115/) |
| 30 Oct 2025 (Q3 2025) | Rufus | 250M in 2025 to date | Monthly users +140%; interactions +210% | 60% more likely to complete; on track for $10B+ incremental annualised sales | [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/) |

### Four cautions when reading this table

1. **The windows change.** Early figures cover a calendar year; later ones a rolling 12 months that straddles the May 2026 rename. A rolling-window count also cannot be differenced into "new users per quarter" [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/).
2. **The metric changes.** The 2025 claim was about conversion, whether a shopping trip ends in a purchase. The 2026 claims are about order size, and the latest is limited to US customers [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/). Amazon has not said whether these are computed the same way.
3. **The sales figure has disappeared.** Amazon gave $10B and then $12B in incremental annualised sales for Rufus, but offered no comparable number for Alexa for Shopping in October 2026 [\[5\]](https://ppc.land/us-alexa-for-shopping-users-spend-50-more-per-order-amazon-says/).
4. **The attribution method is thinly sourced.** Fortune reports the sales estimate rests on an internal "downstream impact" metric using a seven-day rolling attribution window [\[7\]](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/). Fortune's link for the seven-day detail points to a third-party blog rather than to Amazon, so treat that specific detail as unconfirmed.

### Correlation versus causal lift

"Users are 60% more likely to buy" compares people who chose to open the assistant with people who did not. Shoppers who are already close to buying, researching an expensive item or simply more engaged are more likely to open it, so the gap mixes the assistant's effect with who uses it. Statisticians call this *selection bias*.

The clean way to measure lift is a randomised holdout: hide the assistant from a random slice of customers and compare everyone in each group, whether or not they would have used it. Amazon has not said whether its incremental-sales figures come from experiments like this. A seven-day attribution window, if that is the method, credits any purchase within a week of an interaction to the assistant, which tends to overstate impact for items people were going to buy anyway.
