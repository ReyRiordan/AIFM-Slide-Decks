# Tavus Griffin: How a Human Interaction Model Works

Nov 4, 2026 · @Rey Riordan

## Summary

Griffin is a single real-time AI system that watches and listens to a person on a video call and, at the same moment, generates the voice, face and body of the character it is playing. Tavus calls it the first "Human Interaction Model" (HIM) and describes it as a full-duplex, video-to-video model [\[1\]](https://www.tavus.io/griffin). It was announced on October 1, 2026, and only a reduced version, Griffin-Lite, exists today as a research preview for selected testers [\[1\]](https://www.tavus.io/griffin) [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html).

The four ideas a CS student should take away:

- **The problem is timing and nonverbal behavior, not intelligence.** Earlier conversational avatars were cascades: speech recognition, then a language model, then speech synthesis, then face rendering, each waiting for the previous stage. They wait for the user to stop talking and react mostly to words, which makes the conversation feel mechanical [\[1\]](https://www.tavus.io/griffin).
- **The solution is concurrency.** Griffin replaces turn-by-turn processing with a conversational model that re-decides what to do several times a second, while streaming speech and video generators follow its decisions as they change [\[1\]](https://www.tavus.io/griffin).
- **The system has two engines and four learned parts.** A Continuous Conversational Modeling (CCM) engine perceives and decides. An Audio-Visual Generation engine turns its decisions into sound, through a streaming speech generator built on a compact audio codec called Tavec, and into pixels, through a streaming video diffusion generator [\[1\]](https://www.tavus.io/griffin).
- **The results are strong but self-reported in part.** In a Tavus-run study, 26 of 54 people (48%) who had a one-minute video call with Griffin-Lite believed it was human, against 2.4% (1 of 41) for the previous Tavus system [\[1\]](https://www.tavus.io/griffin). Griffin-Lite also topped both tracks of NVIDIA's independently scored VideoFDB benchmark [\[1\]](https://www.tavus.io/griffin) [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). The study is small, short and run by the company itself, a limitation outside commentators have flagged [\[12\]](https://cellcog.ai/blog/tavus-griffin/).

Tavus has published a technical blog post, not a peer-reviewed paper. Model sizes (other than the audio decoder), training data and the identity of any underlying language model are not disclosed, so parts of this report explain the published techniques Griffin names rather than Griffin's exact implementation.

## The problem: conversation is not a series of turns

The problem Griffin targets is that face-to-face conversation is a continuous, overlapping, multimodal signal, while most conversational AI treats it as a tidy exchange of text messages. Tavus's CEO frames the symptom as users having to "manage the machine": speaking in complete thoughts, avoiding pauses, and simplifying their language so the system keeps up [\[1\]](https://www.tavus.io/griffin). Four gaps cause this.

### 1. Silence is a weak signal for "your turn"

Most voice systems decide when to reply by waiting for silence, either with a fixed timer or with a classifier trained on the last few hundred milliseconds of audio [\[6\]](https://www.tavus.io/blog/sparrow-2). Tavus reports that across more than one million silences in natural conversations, the chance that a pause marked a real hand-off of the floor plateaued at about 40% [\[6\]](https://www.tavus.io/blog/sparrow-2). Most pauses are thinking, breathing or searching for a word.

Humans, meanwhile, are fast. On the TurnBench conversations Tavus analysed, the median human responder started speaking 48 ms before the other person finished, and more than half of human replies began in overlap [\[6\]](https://www.tavus.io/blog/sparrow-2). A silence-based system is stuck choosing between replying early and cutting people off, or waiting and leaving dead air [\[6\]](https://www.tavus.io/blog/sparrow-2).

### 2. Cascades add delay at every stage

A classic voice agent is a cascade: speech recognition (ASR) produces a transcript, a language model (LLM) writes a reply, and text-to-speech (TTS) speaks it. Each stage waits for the previous one, and the whole chain waits for the user to finish speaking before it starts [\[1\]](https://www.tavus.io/griffin). A video avatar adds a fourth stage that turns the finished audio into a moving face.

The cost shows in NVIDIA's VideoFDB results that Tavus republished. On the generation track, cascaded avatar systems built from Gemini 2.5 plus a separate face renderer took 2.8 to 3.5 seconds to react, against about 0.9 seconds for humans [\[1\]](https://www.tavus.io/griffin).

### 3. Words are only part of the message

People signal understanding, doubt and emotion through gaze, facial expression, tone and gesture. Most interactive systems perceive audio alone, so they miss those cues and the user's surroundings [\[1\]](https://www.tavus.io/griffin). On the output side, a face that keeps smiling while someone shares bad news, or that gives no sign it is thinking, breaks the illusion of being heard [\[1\]](https://www.tavus.io/griffin).

### 4. The rendered body could not move freely

Earlier Tavus renderers relied heavily on 3D face priors. That kept faces stable but put hand gestures, large body movements and changing backgrounds out of reach [\[1\]](https://www.tavus.io/griffin).

### How each gap maps to Griffin's design

| Gap in earlier systems | What people do instead | Griffin's design response |
| --- | --- | --- |
| Reply only after silence | Predict the end of a thought; overlap and backchannel ("mm-hm") | Re-decide speak, hold or yield at sub-second intervals, based on meaning rather than audio stopping [\[1\]](https://www.tavus.io/griffin) |
| Stages wait for each other | Listen, think and speak at once | Perception, decision and generation run concurrently, and generators stream output as decisions arrive [\[1\]](https://www.tavus.io/griffin) |
| Audio-only perception | Read faces, gaze and the room | The conversational model takes the user's video as input, including shared screens [\[1\]](https://www.tavus.io/griffin) |
| Face-only, 3D-prior rendering | Gesture, move, show emotion with the whole body | A diffusion video generator renders every pixel of the frame from one reference image [\[1\]](https://www.tavus.io/griffin) |

The end-to-end symptom is measurable. In Tavus's live study, only 2.4% of people who talked to the previous system (Phoenix-4.5 with Sparrow-2 and Raven-1) thought it was human [\[1\]](https://www.tavus.io/griffin).

## Background: Tavus and the pipeline Griffin replaces

Griffin succeeds Tavus's Conversational Video Interface (CVI), a pipeline of separate specialist models that pass results to one another. Griffin keeps their capabilities but merges them into one concurrent system [\[1\]](https://www.tavus.io/griffin) [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html).

### The company

Tavus is a San Francisco AI research company whose stated goal is "human computing": making talking to a machine feel like talking to a friend or coworker [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html). Its research team is led by Ioannis Patras and Maja Pantic, it has raised $70M from investors including CRV, Sequoia Capital, Scale Venture Partners and Y Combinator, and it says 150,000 developers and businesses use its models [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html). Tavus calls its on-screen characters PALs [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi).

### The CVI pipeline

CVI streams media over WebRTC (via Daily) and processes each user utterance through six layers in order [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi):

1. **Perception (Raven)** reads the user's expressions, gaze, background and any shared screen.
2. **Conversational flow (Sparrow)** decides when the user has finished and whether they are interrupting.
3. **Speech recognition (STT)** transcribes what was said.
4. **Language model (LLM)** writes the reply from the transcript and visual context; developers can bring their own.
5. **Text-to-speech (TTS)** voices the reply, using Cartesia by default, or ElevenLabs or Azure.
6. **Realtime face (Phoenix)** renders the PAL speaking that audio.

### The three specialist models

Griffin's release notes say it builds on the research behind three earlier models [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html). Knowing them makes Griffin's design easier to follow, because each one solved a slice of the problem in isolation.

| Model (release) | Job in CVI | How it works, briefly |
| --- | --- | --- |
| [Raven-1](https://www.tavus.io/blog/raven-1-bringing-emotional-intelligence-to-artificial-intelligence) (Feb 10, 2026) | Perception | Fuses audio and video into one representation of the user's state and outputs natural-language descriptions, such as "the user appears disengaged", that an LLM can read directly. Updates per sentence and keeps context no more than 300 ms stale [\[5\]](https://www.tavus.io/blog/raven-1-bringing-emotional-intelligence-to-artificial-intelligence). |
| [Sparrow-2](https://www.tavus.io/blog/sparrow-2) (Aug 27, 2026) | Turn-taking | An audio encoder feeds a six-layer causal transformer that updates its estimate of conversational state every 10 ms. Trained on 16,000 real and 2,000 synthetic conversations, it separates backchannels from interruptions and holds through pauses of 6 to 8 seconds [\[6\]](https://www.tavus.io/blog/sparrow-2). |
| [Phoenix-4.5](https://www.tavus.io/blog/phoenix-4-5) (Sep 10, 2026) | Rendering | Two models: an animator, a streaming diffusion transformer that turns the PAL's and the user's audio into motion codes, and a GAN-based renderer that paints the half-body frame from one reference image. Audio to video in 134 ms [\[4\]](https://www.tavus.io/blog/phoenix-4-5). |

Phoenix itself evolved in steps: Phoenix-1 modelled a person in 3D, Phoenix-2 reached real time, Phoenix-3 extended generation to the whole face, and Phoenix-4 added controllable emotion using 3D Gaussian splatting over a roughly 512×512 face region [\[4\]](https://www.tavus.io/blog/phoenix-4-5).

### Why the pipeline hit a ceiling

Each model was strong, but they still talked to each other through narrow interfaces. Raven hands the LLM text descriptions [\[5\]](https://www.tavus.io/blog/raven-1-bringing-emotional-intelligence-to-artificial-intelligence). Sparrow is only semi-duplex: it tracks whether the PAL is speaking, but the decision of what to say still lives in a separate LLM [\[6\]](https://www.tavus.io/blog/sparrow-2) [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi). Phoenix animates audio that TTS has already produced [\[4\]](https://www.tavus.io/blog/phoenix-4-5) [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi). So no single component decided what to say, when to say it and how to look while saying it. In the live study this stack, rendered by Phoenix-4.5, convinced 2.4% of people [\[1\]](https://www.tavus.io/griffin).

## How Griffin works: the high-level picture

Griffin splits the job between a director and two crews. One model watches, listens and keeps deciding what should happen next; two streaming generators turn its decisions into voice and video as they arrive [\[1\]](https://www.tavus.io/griffin). Nothing waits for a turn to end: perception, decision and generation all run at once [\[1\]](https://www.tavus.io/griffin).

### What a Human Interaction Model is

Tavus defines a Human Interaction Model as a model built to both understand and generate real-time, face-to-face interaction: it listens while it talks and attends to expressions and pauses as well as words [\[1\]](https://www.tavus.io/griffin). Three terms pin the idea down:

- **Full-duplex.** Information flows both ways at once, like a phone call rather than a walkie-talkie. Griffin keeps perceiving while it speaks, so it can be interrupted or nod along mid-sentence [\[1\]](https://www.tavus.io/griffin). Sparrow-2, by contrast, was semi-duplex: it tracked whether the PAL was talking, but a separate LLM wrote the reply [\[6\]](https://www.tavus.io/blog/sparrow-2).
- **Video-to-video.** The input is the user's camera, microphone and optionally their screen; the output is generated video of the PAL with its voice [\[1\]](https://www.tavus.io/griffin).
- **Real-time streaming.** Every stage produces output in small increments, so the PAL starts reacting before a full reply has been planned [\[1\]](https://www.tavus.io/griffin).

### Two engines, running concurrently

Tavus describes Griffin as a two-part system [\[1\]](https://www.tavus.io/griffin):

1. A **Continuous Conversational Modeling (CCM)** engine perceives the user's audio and video, decides when and how to respond, and emits signals describing what to say and how to say it.
2. An **Audio-Visual Generation** engine, made of a streaming speech generator and a streaming video generator, turns those signals into sound and pixels.

### From turns to ticks

The central change is when decisions get made. A cascade decides once per turn, after the user stops talking. Griffin's CCM re-assesses the conversation at regular sub-second intervals, which Tavus's diagram labels "miniturns", and at each one decides what to say next and how [\[1\]](https://www.tavus.io/griffin).

If you have written a game loop, the pattern is familiar: on every tick, read the inputs, update the state, emit actions. Because the decision is remade each tick from the meaning of what has been said, a pause for thought need not be read as the end of a turn [\[1\]](https://www.tavus.io/griffin).

&#91;embedded content: Griffin-Lite architecture · one conversational model, two streaming generators\]

Arrows show the main data flow, drawn from Tavus's own architecture figure [\[1\]](https://www.tavus.io/griffin). The loop on the left is what makes it full-duplex: the user's reaction feeds straight back into the CCM while the PAL is still talking.

### What this enables

Tavus groups the resulting behaviors into five capabilities, each shown in demo clips [\[1\]](https://www.tavus.io/griffin):

- **Behavior and emotion.** The PAL laughs, changes tone and shifts posture in response to what the person says and does.
- **Full-scene generation.** Every pixel of every frame is generated from one reference image, including the movement of the chair, cast shadows and the background.
- **Full-duplex conversation.** It can interrupt, backchannel or be interrupted without losing its place.
- **Visual perception.** It reacts to what it sees, for example coaching someone through a Rubik's cube from what is in their hands.
- **Temporal understanding.** It tracks how long a silence has lasted, what that silence means, and when to speak again on its own, for example while someone solders a circuit board.

## Deep dive: the four learned components

Griffin has four learned parts: one decision-maker and three pieces of generation machinery. Tavus documents the generators in much more detail than the decision-maker, so the depth of each subsection below follows what has actually been published [\[1\]](https://www.tavus.io/griffin).

| Component | Job | Input → output | Key published facts |
| --- | --- | --- | --- |
| Continuous Conversational Model (CCM) | Perceive and decide | Prompt, history, user audio and video → text plus control signals | Re-decides at sub-second intervals; controls words, tone, expression and gesture [\[1\]](https://www.tavus.io/griffin) |
| Tavec audio codec | Represent sound compactly | 48 kHz waveform ↔ 40 numbers per frame, 100 frames per second | Continuous, no codebooks; causal streaming decoder with 28.42M parameters [\[1\]](https://www.tavus.io/griffin) |
| Streaming speech generator | Produce the voice | CCM output plus about 10 s of reference voice → Tavec latents | Fast autoregressive diffusion transformer that streams as CCM output arrives [\[1\]](https://www.tavus.io/griffin) |
| Streaming video generator | Produce the pixels | Reference image, audio and controls → one video latent at a time → 720p frames | Diffusion transformer distilled in three stages: DMD2, teacher forcing, Self-Forcing [\[1\]](https://www.tavus.io/griffin) |

### Component 1: the Continuous Conversational Model (CCM)

The CCM is Griffin's decision-maker. It keeps a running picture of the conversation and, every fraction of a second, decides what the PAL should say and do next [\[1\]](https://www.tavus.io/griffin).

**What goes in.** Tavus's figure shows four input streams feeding shared processing: the PAL's system prompt as text tokens, the conversation history, the user's audio as audio tokens and the user's video as visual tokens [\[1\]](https://www.tavus.io/griffin). The video channel carries the user's face and gaze, their surroundings and any screen they share [\[1\]](https://www.tavus.io/griffin).

**What comes out.** The CCM emits text plus control signals. The text is what to say; the controls set how it is said and how the PAL behaves nonverbally, including emotional tone, stance, facial expression and gesture [\[1\]](https://www.tavus.io/griffin). The figure labels this stream "verbal/non-verbal tokens and controls" [\[1\]](https://www.tavus.io/griffin), which suggests, without confirming, that controls are emitted as tokens alongside words.

**When it decides.** Decisions happen at regular sub-second intervals, not once per turn. At each interval the CCM weighs what has been said and the user's verbal and nonverbal behavior [\[1\]](https://www.tavus.io/griffin). Turn-taking then falls out of the same mechanism: because the choice is conditioned on meaning, the model can take or yield the floor based on what is said rather than on when the audio stops [\[1\]](https://www.tavus.io/griffin).

**Behavior by phase.** Tavus's figure breaks a conversation into phases and lists what the CCM does in each [\[1\]](https://www.tavus.io/griffin):

| Phase | What the CCM does |
| --- | --- |
| User speaking | Tracks content, intent and nonverbal cues such as tone and gesture; anticipates the end of the turn |
| PAL responding | Generates speech, video and nonverbal behavior while still listening; allows natural overlap |
| User backchannels ("mm-hm") | Recognizes the feedback and keeps going, folding it into the response |
| User interrupts | Detects it in real time, stops, acknowledges and re-plans |
| Idle | Waits for the next input while showing engaged nonverbal behavior |
| Any phase | Can call a tool, and shifts demeanor according to the user's emotion |

**How one model can listen and talk at once.** Tavus has not published the CCM's internals. The closest open precedent is Moshi (Kyutai, 2024), which models its own speech and the user's speech as parallel streams, so it "always listens and always generates sound, either speech or silence" [\[8\]](https://arxiv.org/abs/2410.00037). Dropping explicit speaker turns is what lets such a model handle overlap and interruptions [\[8\]](https://arxiv.org/abs/2410.00037).

A useful mental model, offered as an analogy rather than a description of Griffin's code: on every tick the model reads the newest slice of each input stream and writes the newest slice of its output, where "say nothing yet" is a valid output. One design difference stands out. Moshi generates audio tokens itself [\[8\]](https://arxiv.org/abs/2410.00037), whereas Griffin's CCM hands text and controls to separate speech and video generators [\[1\]](https://www.tavus.io/griffin). That lets each generator be specialized and optimized for speed, but it means everything the CCM wants the voice and face to do must pass through the control interface.

**Why seeing matters, and why it is hard.** NVIDIA's VideoFDB authors found that current vision-speech models typically sample video at about 1 frame per second, too slowly for nonverbal cues that unfold within 1 to 2 seconds [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). They also found that adding video often made answers worse than audio alone, partly through "captioning collapse", where the model describes the user instead of conversing [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). On that benchmark's visual-grounding rubric, Griffin-Lite scored 3.92 against a human reference of 4.24, the highest of any model [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). Tavus does not state Griffin's video sampling rate.

**Lineage.** The CCM folds together what Raven-1 and Sparrow-2 did separately [\[1\]](https://www.tavus.io/griffin). Sparrow-2 showed that a small six-layer causal transformer can update conversational state every 10 ms [\[6\]](https://www.tavus.io/blog/sparrow-2), and Raven-1 fused audio and video into one perceptual representation [\[5\]](https://www.tavus.io/blog/raven-1-bringing-emotional-intelligence-to-artificial-intelligence). Whether the CCM reuses their encoders is not stated.

**Not disclosed:** the CCM's base model and size, its training data, the exact decision interval, how controls are encoded, and how tool calls are wired in.

### Component 2: Tavec, the audio codec

Tavec is how Griffin represents sound: a learned compressor that turns 48 kHz audio into a short sequence of continuous vectors the speech generator can predict, and turns them back into a waveform fast enough to stream [\[1\]](https://www.tavus.io/griffin).

**What it is.** Tavec is a convolutional autoencoder. An encoder squeezes audio into a compact latent and a decoder expands it back. Each latent frame holds 40 values, there are 100 frames per second, and there are no codebooks [\[1\]](https://www.tavus.io/griffin).

**Why compactness matters.** A minute of speech becomes 6,000 latent frames instead of 2.88 million raw samples [\[1\]](https://www.tavus.io/griffin). By our arithmetic, that is a sequence 480 times shorter (48,000 samples per second down to 100 frames) and 12 times fewer numbers overall. Sequence length is what makes transformers expensive, because attention cost grows quadratically with the number of positions [\[13\]](https://arxiv.org/html/2412.07772v4). Shortening the sequence is what makes it practical for a transformer to generate speech in real time.

**Continuous versus codebook codecs.** Many codecs used for generation, such as Meta's EnCodec, compress the encoder output with residual vector quantization: the vector is snapped to the nearest entry in a learned codebook, the leftover error is snapped by a second codebook, and so on, producing discrete tokens [\[15\]](https://arxiv.org/pdf/2210.13438). Discrete tokens let a language-model-style generator predict audio as if it were picking words from a vocabulary, which is how Moshi produces speech [\[8\]](https://arxiv.org/abs/2410.00037).

The catch is that snapping to a codebook is not differentiable, so training needs gradient approximations. Tavus says Tavec's continuous latents avoid those approximations, keep the whole audio pipeline differentiable, and suit straightforward regression-based flow matching (see Component 3) [\[1\]](https://www.tavus.io/griffin). An analogy: a codebook describes each color by picking from a fixed palette of names, while a continuous latent writes down the exact RGB value.

**Streaming by design.** The decoder is fully causal: each output sample depends only on latents that have already arrived. It also carries internal state from one chunk to the next, so streamed latents join into one seamless waveform, delivered in audio packets as small as 10 ms [\[1\]](https://www.tavus.io/griffin). Without that carried state, every chunk boundary would risk an audible discontinuity.

**Measured performance.** Tavus reports a decoder of 28.42M parameters that decodes 2,193 times faster than real time on an NVIDIA H100, and a ViSQOL MOS-LQO score of 4.242 [\[1\]](https://www.tavus.io/griffin). ViSQOL is an objective metric that predicts how listeners would rate audio quality; EnCodec's authors also used it [\[15\]](https://arxiv.org/pdf/2210.13438). The speed figure is decoder throughput; Tavus does not report per-stream latency or compare ViSQOL against other codecs on the same test set.

**Not disclosed:** encoder size, training data and head-to-head codec comparisons.

### Component 3: the streaming speech generator

The speech generator gives the PAL its voice. Tavus describes it as a fast autoregressive diffusion transformer that produces high-quality speech at conversational latency and clones a voice from about 10 seconds of audio [\[1\]](https://www.tavus.io/griffin).

**Unpacking "autoregressive diffusion transformer".** The phrase combines three ideas:

- **Autoregressive** means it produces the latent sequence left to right, each new chunk conditioned on everything before it, the way an LLM produces tokens. That is what makes streaming possible: it can emit the first chunk before it knows the last.
- **Diffusion** answers a problem created by Tavec. Because the latents are continuous vectors, there is no vocabulary to pick the most likely token from. Instead each new chunk starts as random noise and is refined into a plausible latent over a few steps, guided by the context. Li et al. showed this pattern for images: the autoregressive model produces a conditioning vector per token and a small diffusion network models that token's distribution, removing the need for vector-quantized tokenizers [\[14\]](https://proceedings.neurips.cc/paper_files/paper/2024/hash/66e226469f20625aaebddbe47f0ca997-Abstract.html).
- **Transformer** is the backbone that reads the context: the reference voice, the audio generated so far and the CCM's latest instructions.

Tavus does not say Griffin copies that specific design; it is the published precedent for the idea.

**Training by flow matching.** Tavus says Tavec's continuous latents support straightforward regression-based flow matching [\[1\]](https://www.tavus.io/griffin), which implies, though the post does not spell it out, that the generator is trained this way. Flow matching trains a network to regress a vector field: at any point on a path between noise and real data, it predicts which direction to move and how fast. The method is simulation-free and includes standard diffusion paths as special cases [\[11\]](https://arxiv.org/abs/2210.02747). Conceptually, the model learns a velocity map from noise to realistic audio, and generation simply follows that map for a few steps.

**Voice cloning as a prefix.** The generator takes an encoding of the reference clip as a prefix and then continues from it [\[1\]](https://www.tavus.io/griffin). This is the speech version of few-shot prompting an LLM: show the model an example of the voice, and it continues in the same voice. The post describes no per-voice fine-tuning step.

**Streaming in, as well as out.** It generates progressively as increments of output and controls arrive from the CCM, instead of waiting for the full utterance [\[1\]](https://www.tavus.io/griffin). A cascaded TTS engine, like the Cartesia, ElevenLabs or Azure options in Tavus's older CVI pipeline [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi), is handed text to speak. Here, because controls arrive alongside the words, the CCM can in principle shift the delivery mid-sentence, or simply stop feeding it when the user cuts in.

**Not disclosed:** model size, number of sampling steps, speech latency on its own, training data and language coverage.

### Component 4: the streaming video generator

The video generator paints every pixel of every frame: 720p video in real time, one latent at a time, from a single reference image plus streaming audio and the CCM's controls [\[1\]](https://www.tavus.io/griffin). It is the most thoroughly documented part of Griffin.

**Why a new renderer.** Earlier Tavus models leaned on 3D priors, which kept hand gestures, large body movements and dynamic backgrounds out of reach [\[1\]](https://www.tavus.io/griffin). Tavus set three requirements: react quickly to each incoming chunk of audio and controls, cope with controls that change fast, and hold visual quality, lip sync and identity over long generations. It notes that autoregressive latent video models typically give up at least one of these [\[1\]](https://www.tavus.io/griffin).

**Why ordinary video diffusion cannot stream.** Most video diffusion transformers use bidirectional attention: every frame attends to every other frame, including future ones. Generating one frame therefore means processing the whole clip, and the viewer waits for the entire sequence [\[13\]](https://arxiv.org/html/2412.07772v4). Diffusion also needs many denoising passes, each a full forward pass through the network [\[9\]](https://arxiv.org/abs/2405.14867). On a live call, future audio does not exist yet and every millisecond counts, so the generator must be causal (past frames only) and few-step.

**The three-stage recipe.** Tavus distilled a large, bidirectional, many-step diffusion model (the teacher) into a few-step autoregressive generator (the student) in three stages [\[1\]](https://www.tavus.io/griffin):

1. **Make it fast with Distribution Matching Distillation (DMD2).** The student learns to produce in a few steps what the teacher produces in many [\[1\]](https://www.tavus.io/griffin). DMD trains the student to match the teacher's output distribution rather than copy its exact path from noise to image; DMD2 drops a costly regression loss and adds a GAN loss against real data, and its authors report a 500× cut in inference cost while beating the teacher's image quality [\[9\]](https://arxiv.org/abs/2405.14867). After this stage Griffin's student is fast but not yet streaming: it generates a long video as one chunk [\[1\]](https://www.tavus.io/griffin).
2. **Make it causal with teacher forcing.** The student is converted into a model that generates one latent at a time in a few steps, trained with the reference image and real (ground-truth) previous frames as context [\[1\]](https://www.tavus.io/griffin). Teacher forcing means training each next-step prediction on the real history, the way LLMs train on real text [\[10\]](https://arxiv.org/abs/2506.08009). Tavus calls its version "robust teacher forcing" without further detail [\[1\]](https://www.tavus.io/griffin). The published precedent is CausVid, which adapted a bidirectional diffusion transformer into an autoregressive one and distilled a 50-step teacher into a 4-step causal student [\[13\]](https://arxiv.org/html/2412.07772v4).
3. **Make it stable with Self-Forcing.** At run time the model continues from its own slightly imperfect frames, not ground truth, so small errors compound. This is exposure bias [\[10\]](https://arxiv.org/abs/2506.08009). Self Forcing trains the model on its own rollouts and scores the whole generated sequence, so it learns to recover from its own mistakes; its authors report real-time streaming with sub-second latency on one GPU [\[10\]](https://arxiv.org/abs/2506.08009). Tavus trained on progressively longer rollouts, applied the DMD loss at the final step, and added a mechanism acting on the history frames to improve stability [\[1\]](https://www.tavus.io/griffin).

An analogy for stages 2 and 3: a student who only ever practised with the answer key beside them, versus one who practised by working from their own earlier answers and learning to catch their own errors.

**Managing memory with compressed history.** Tavus's figure shows how the context for each new latent is arranged: the reference image uncompressed, the oldest history highly compressed, intermediate history medium, the most recent history lightly compressed, then the noisy target [\[1\]](https://www.tavus.io/griffin).

&#91;embedded content: Video generator context window · history compressed by age\]

The effect is a context that stays bounded however long the call runs, while the freshest frames, which matter most for smooth motion and lip sync, keep the most detail. The same idea appears in FramePack, which compresses input frames by importance so the transformer's context length stays fixed regardless of video length [\[16\]](https://arxiv.org/html/2504.12626v2); Tavus does not say it uses FramePack.

**Measured results.** Tavus compared the generator against four published streaming diffusion models in an audio-to-video setting, where each gets speech and a reference image and must produce the talking face [\[1\]](https://www.tavus.io/griffin). Latency is the average time from audio arriving to its effect appearing on screen, on H100 GPUs [\[1\]](https://www.tavus.io/griffin).

| Model | Avg latency (s) ↓ | FID ↓ | DOVER ↑ | THEval ↑ | LSE-C (lip sync) ↑ |
| --- | --- | --- | --- | --- | --- |
| Griffin-Lite | **0.43** | **13.8** | **0.750** | **0.748** | 7.27 |
| AvatarForcing | 0.86 | 25.8 | 0.711 | 0.698 | **7.73** |
| LiveTalk | 0.945 | 24.2 | 0.636 | 0.667 | 7.05 |
| SoulX-FlashTalk | 1.44 | 21.4 | 0.583 | 0.696 | 6.79 |
| LiveAvatar | 1.45 | 20.9 | 0.702 | 0.657 | 6.61 |

Source: [\[1\]](https://www.tavus.io/griffin). Griffin-Lite's latency ranged from 0.27 s best case to 0.59 s worst case. Tavus calls FID and DOVER the two standard video-quality measures and THEval a recent framework built for talking heads; it argues LSE-C, where it placed second, rewards exaggerated mouth movement [\[1\]](https://www.tavus.io/griffin). These comparisons were run by Tavus, not independently.

**Not disclosed:** the teacher model's identity and size, the student's step count and frame rate, training data, and how the CCM's controls are injected into the generator.

## How the components connect

The four parts are joined by streams rather than hand-offs. Each consumes small increments from upstream and emits small increments downstream, so all four are busy at once on different slices of the same conversation [\[1\]](https://www.tavus.io/griffin).

### The data path

Following one increment through the system:

1. The user's audio and video stream in continuously, alongside the system prompt and conversation history [\[1\]](https://www.tavus.io/griffin).
2. At each sub-second interval, the CCM updates its picture of the conversation and emits the next increment of text and control signals [\[1\]](https://www.tavus.io/griffin).
3. The speech generator turns that increment into Tavec latents in the PAL's cloned voice [\[1\]](https://www.tavus.io/griffin).
4. The Tavec decoder converts the latents into waveform, in packets as small as 10 ms [\[1\]](https://www.tavus.io/griffin).
5. The video generator combines the reference image, the streaming audio and the CCM's controls into the next video latent, decoded to 720p frames [\[1\]](https://www.tavus.io/griffin).
6. Throughout, perception never pauses: the CCM keeps reading the user while the PAL speaks and while it is silent [\[1\]](https://www.tavus.io/griffin).

### Two paths into the face

The video generator receives two kinds of instruction. The generated speech drives lip sync; the CCM's controls drive nonverbal behavior such as gesturing, looking away or changing emotion [\[1\]](https://www.tavus.io/griffin). The second path is the important one.

NVIDIA's VideoFDB authors explain why. In a cascaded avatar, motion follows the produced speech only, so the avatar is effectively turn-based and cannot add a nod or smile while the user is talking [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). They conclude that closing the gap needs end-to-end models, or avatar layers that emit nonverbal motion independently of speech [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). Griffin's control channel is that independent path.

### A worked example

Tavus illustrates the CCM with a restaurant-booking exchange [\[1\]](https://www.tavus.io/griffin). The user asks for a table for four at an Italian restaurant tomorrow night; the PAL acknowledges and starts checking. Mid-sentence the user says "mm-hm", which the CCM treats as a backchannel, so the PAL carries on. Then the user cuts in to ask for sushi instead; the CCM stops the reply, re-plans, and the PAL comes back with two available times.

&#91;embedded content: Worked example · a backchannel versus an interruption\]

The same audio event, the user speaking while the PAL talks, leads to opposite decisions depending on what was said. A silence timer or voice-activity detector cannot make that distinction, which is why the decision lives in a model that understands content.

### Timing: where the time goes

Tavus reports the video generator alone adds an average of 0.43 s between audio arriving and its effect appearing on screen [\[1\]](https://www.tavus.io/griffin). End to end, Griffin is still slower than people. On VideoFDB its median response time was 1,892 ms on the generation track against 900 ms for humans, and 2,232 ms on the perception track against 1,400 ms; the open-source MiniCPM-o 4.5 responded in 720 ms [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/).

Where Griffin leads is choosing the right moment. VideoFDB's takeover-rate alignment measures how closely a model's decisions about when to speak match the reference conversations, and Griffin-Lite scored highest on both tracks, at 62.8% and 73.8% [\[1\]](https://www.tavus.io/griffin) [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). A caution for readers: latency is defined differently across benchmarks. Sparrow-2's TurnBench analysis found human replies starting 48 ms before the turn ends [\[6\]](https://www.tavus.io/blog/sparrow-2), while VideoFDB's human reference sits near a second, so the numbers are not directly comparable.

### Infrastructure

Tavus credits Baseten, Daily and Cerebrium for the infrastructure behind the preview, and Queen Mary University of London as a research collaborator [\[1\]](https://www.tavus.io/griffin). Daily also provides the WebRTC transport for Tavus's existing CVI [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi). Tavus's speed figures were measured on NVIDIA H100 GPUs [\[1\]](https://www.tavus.io/griffin); serving cost per conversation is not published.

## Evaluation, limitations and open questions

Griffin-Lite's results are strong on the one benchmark scored by a third party and striking in Tavus's own study, but the evidence base is thin: one company blog post, one company-run study and one external benchmark [\[1\]](https://www.tavus.io/griffin) [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) [\[12\]](https://cellcog.ai/blog/tavus-griffin/).

### The evidence at a glance

| Evaluation | Who ran it | Result | Caveat |
| --- | --- | --- | --- |
| [VideoFDB](https://research.nvidia.com/labs/amri/projects/video-fdb/) perception track | NVIDIA scored it with its own judge | 3.73 out of 5, against 4.20 for humans and 3.44 for the next system [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) | Median response 2,232 ms, slower than MiniCPM-o 4.5 at 720 ms [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) |
| VideoFDB generation track | NVIDIA | 3.83, against 3.92 for humans and 2.80 for the next system [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) | Only two cascaded baselines exist on this track; nonverbal-cue appropriateness 2.83 against 3.18 for humans [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) |
| Live "video Turing test" | Tavus, via an unnamed recruiting platform [\[12\]](https://cellcog.ai/blog/tavus-griffin/) | 26 of 54 (48%) judged their partner real, against 1 of 41 (2.4%) for Phoenix-4.5 [\[1\]](https://www.tavus.io/griffin) | One-minute calls, small sample, no outside evaluator [\[12\]](https://cellcog.ai/blog/tavus-griffin/) |
| Video generator comparison | Tavus | Fastest, and best on FID, DOVER and THEval among five streaming models [\[1\]](https://www.tavus.io/griffin) | Self-run; second on lip-sync metric LSE-C [\[1\]](https://www.tavus.io/griffin) |

VideoFDB uses 237 annotated clips from real two-person video calls covering 11 conversational dynamics, and an LM judge scores each rubric axis from 0 to 5 [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). One detail is worth noticing: Griffin-Lite beat the human reference on dyadic affect (4.40 against 4.14) while trailing it on nonverbal-cue appropriateness [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/). It matches emotion well but does not yet place nods and gestures as well as people do.

### Reading the Turing-test claim critically

Participants were told they would be matched with another participant for a one-minute call about what they were looking forward to that year. Only at the end of the survey were they asked whether it had crossed their mind that the partner might not be human [\[1\]](https://www.tavus.io/griffin). That framing primes belief that the partner is real [\[12\]](https://cellcog.ai/blog/tavus-griffin/).

Other details from the study [\[1\]](https://www.tavus.io/griffin):

- Those who said "real" averaged 79% confidence; those who said "AI" averaged 81%.
- Over half said the possibility never crossed their mind; those who did suspect tended to do so within the first 20 seconds.
- On a 7-point scale, participants rated naturalness 5.4, trustworthiness 5.6, wanting to talk again 5.8 and feeling listened to 5.5. Conversational flow scored lowest, at 4.9.

Three points for a statistically minded reader. First, by our calculation using a normal approximation, a 95% confidence interval around 26 of 54 runs from roughly 35% to 61%. Second, Tavus reports no arm in which participants spoke to real people under the same framing, so there is no baseline for how often a genuine human partner would be judged real. Third, the comparison figure for the previous system varies between sources: 2.4% in the study section, "a max 2%" in the summary, and under 3% on X [\[12\]](https://cellcog.ai/blog/tavus-griffin/).

### Known limitations

- **Response speed.** Griffin replies more slowly than humans on both VideoFDB tracks [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/).
- **Lite, not full.** What was tested is Griffin-Lite; Tavus says a more powerful model will follow [\[1\]](https://www.tavus.io/griffin).
- **Short horizons.** All live results come from one-minute calls [\[1\]](https://www.tavus.io/griffin). Long-conversation stability is the very problem Self-Forcing targets, but no long-call measurements are published.
- **Opacity.** There is no paper, no model card, no parameter counts beyond the audio decoder, and no price [\[1\]](https://www.tavus.io/griffin) [\[12\]](https://cellcog.ai/blog/tavus-griffin/).

### Safety and ethics

Tavus names the central risk itself: the properties that make Human Interaction Models natural interfaces also let them deceive people into believing they are not talking to AI [\[1\]](https://www.tavus.io/griffin). It says further alignment and safety work is needed, that it is building disclosure features and working with AI-safety organizations, and that Griffin-Lite is limited to selected testers for now [\[1\]](https://www.tavus.io/griffin) [\[2\]](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html).

Two capabilities sharpen the concern: a voice can be cloned from about 10 seconds of audio and a whole-scene identity rendered from one reference image [\[1\]](https://www.tavus.io/griffin). Tavus's published Griffin materials do not describe how consent for a cloned identity is verified.

### Open questions

- What model sits inside the CCM, and how large is it?
- How does quality hold up over 30-minute calls rather than one-minute ones?
- Would the 48% result replicate in an independent study with a human control arm?
- How does Griffin behave with several people on camera, a case Sparrow-2 explicitly handled for audio [\[6\]](https://www.tavus.io/blog/sparrow-2)?
- What will disclosure look like in the product when Griffin ships?

## Glossary

Key terms in alphabetical order, each tied to the source where it is used or defined.

| Term | Plain-language meaning | Source |
| --- | --- | --- |
| Autoregressive | Generates a sequence one piece at a time, each piece conditioned on the ones before it | [\[13\]](https://arxiv.org/html/2412.07772v4) |
| Backchannel | A short listener signal such as "mm-hm" that means "keep going", not "my turn" | [\[6\]](https://www.tavus.io/blog/sparrow-2) |
| Barge-in | The user interrupting while the system is speaking; Griffin chooses to continue, pause or stop | [\[1\]](https://www.tavus.io/griffin) |
| Bidirectional vs causal attention | Bidirectional: every frame sees past and future frames, so output cannot stream. Causal: each frame sees only the past | [\[13\]](https://arxiv.org/html/2412.07772v4) |
| Cascade | A pipeline of separate models (speech recognition, LLM, text-to-speech, avatar) run one after another | [\[1\]](https://www.tavus.io/griffin) [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi) |
| Codebook / vector quantization | Snapping a continuous vector to the nearest entry in a learned list, producing discrete tokens; residual VQ repeats this on the leftover error | [\[15\]](https://arxiv.org/pdf/2210.13438) |
| Continuous latent | A compressed representation made of real-valued numbers rather than token IDs; Tavec uses 40 per frame | [\[1\]](https://www.tavus.io/griffin) |
| Diffusion model | A generator that starts from random noise and refines it, step by step, into a realistic sample | [\[9\]](https://arxiv.org/abs/2405.14867) |
| Distillation (teacher → student) | Training a small or fast model to imitate a large or slow one | [\[9\]](https://arxiv.org/abs/2405.14867) |
| Distribution Matching Distillation (DMD, DMD2) | Distillation that matches the teacher's overall output distribution instead of copying its exact sampling path; DMD2 adds a GAN loss | [\[9\]](https://arxiv.org/abs/2405.14867) |
| Exposure bias | Errors that compound when a model trained on perfect history must continue from its own imperfect output | [\[10\]](https://arxiv.org/abs/2506.08009) |
| Flow matching | Training a network to predict the direction to move from noise toward data at every point along a path | [\[11\]](https://arxiv.org/abs/2210.02747) |
| Full-duplex | Both parties can send and receive at the same moment, like a phone call | [\[8\]](https://arxiv.org/abs/2410.00037) |
| Human Interaction Model (HIM) | Tavus's name for a model that both understands and generates real-time, face-to-face interaction | [\[1\]](https://www.tavus.io/griffin) |
| LM-as-judge | Using a language model, guided by a rubric, to score outputs; how VideoFDB grades responses | [\[3\]](https://research.nvidia.com/labs/amri/projects/video-fdb/) |
| Miniturn | Tavus's term for each sub-second decision step of the CCM | [\[1\]](https://www.tavus.io/griffin) |
| PAL | Tavus's name for an on-screen AI character | [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi) |
| Self-Forcing | Training a video model on its own generated history so it learns to recover from its own mistakes | [\[10\]](https://arxiv.org/abs/2506.08009) |
| Semi-duplex | Sparrow-2's design: it tracks its own speaking state but does not generate the reply itself | [\[6\]](https://www.tavus.io/blog/sparrow-2) |
| Takeover-rate (TOR) alignment | How closely a model's decisions about when to speak match the timing in reference human conversations | [\[1\]](https://www.tavus.io/griffin) |
| Teacher forcing | Training each next-step prediction on the real previous outputs rather than the model's own | [\[10\]](https://arxiv.org/abs/2506.08009) |
| WebRTC | The browser standard for real-time audio and video that carries Tavus calls | [\[7\]](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi) |

## Sources

Every bracketed number in this report links to one of these pages. Tavus's own materials (\[1\], \[2\], \[4\]–\[7\]) are primary but self-reported; \[3\] is the only independent evaluation. The academic papers explain techniques Griffin names or resembles: Tavus explicitly names DMD2 and Self-Forcing, and confirms nothing about the others.

| # | Source | Type |
| --- | --- | --- |
| 1 | Tavus Research, [Griffin: The First Human Interaction Model](https://www.tavus.io/griffin), October 1, 2026 | Primary, company research post |
| 2 | Tavus via Business Wire, [Tavus Introduces Griffin, the First Face-to-Face Human Interaction Model](https://finance.yahoo.com/technology/ai/articles/tavus-introduces-griffin-first-face-163000466.html), October 1, 2026 | Primary, press release |
| 3 | Mazumdar et al. (NVIDIA and David AI), [VideoFDB project page and leaderboard](https://research.nvidia.com/labs/amri/projects/video-fdb/), 2026 | Independent benchmark |
| 4 | Tavus, [Phoenix-4.5: A New State of the Art in Real-Time Human Rendering](https://www.tavus.io/blog/phoenix-4-5), September 10, 2026 | Primary, predecessor model |
| 5 | Tavus, [Raven-1: Bringing Emotional Intelligence to Artificial Intelligence](https://www.tavus.io/blog/raven-1-bringing-emotional-intelligence-to-artificial-intelligence), February 10, 2026 | Primary, predecessor model |
| 6 | Tavus, [Sparrow-2: Beyond Turn-Taking to Whole-Scene Conversational Understanding](https://www.tavus.io/blog/sparrow-2), August 27, 2026 | Primary, predecessor model |
| 7 | Tavus Docs, [What Is CVI?](https://docs.tavus.io/sections/conversational-video-interface/overview-cvi) | Primary, developer documentation |
| 8 | Défossez et al. (Kyutai), [Moshi: a speech-text foundation model for real-time dialogue](https://arxiv.org/abs/2410.00037), 2024 | Academic, full-duplex precedent |
| 9 | Yin et al. (MIT, Adobe), [Improved Distribution Matching Distillation for Fast Image Synthesis](https://arxiv.org/abs/2405.14867) (DMD2), 2024 | Academic, named by Tavus |
| 10 | Huang et al. (Adobe, UT Austin), [Self Forcing: Bridging the Train-Test Gap in Autoregressive Video Diffusion](https://arxiv.org/abs/2506.08009), NeurIPS 2025 | Academic, named by Tavus |
| 11 | Lipman et al. (Meta AI, Weizmann), [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747), ICLR 2023 | Academic, training objective background |
| 12 | Garg (CellCog), [Tavus Griffin and the 48% Video Turing Test, Explained](https://cellcog.ai/blog/tavus-griffin/), October 2, 2026 | Third-party analysis by a commercial AI company |
| 13 | Yin et al. (MIT, Adobe), [From Slow Bidirectional to Fast Autoregressive Video Diffusion Models](https://arxiv.org/html/2412.07772v4) (CausVid) | Academic, causal-conversion precedent |
| 14 | Li et al. (MIT, Google DeepMind, Tsinghua), [Autoregressive Image Generation without Vector Quantization](https://proceedings.neurips.cc/paper_files/paper/2024/hash/66e226469f20625aaebddbe47f0ca997-Abstract.html), NeurIPS 2024 | Academic, continuous-token precedent |
| 15 | Défossez et al. (Meta AI), [High Fidelity Neural Audio Compression](https://arxiv.org/pdf/2210.13438) (EnCodec), 2022 | Academic, codebook-codec contrast |
| 16 | Zhang and Agrawala (Stanford), [Packing Input Frame Context in Next-Frame Prediction Models for Video Generation](https://arxiv.org/html/2504.12626v2) (FramePack), 2025 | Academic, history-compression precedent |
