## 💡 Inspiration

> **The gap between "I know my material" and "I can deliver it with confidence" changes lives.**

Every year, students defend projects they've spent months building, graduates prepare for job interviews, and founders pitch ideas they've poured their hearts into. Yet many still miss life-changing opportunities—not because they lack knowledge, but because communicating under pressure is difficult.

The truth is, communication is a skill that most people are expected to have but very few are ever taught.

Professional coaching is expensive, practice usually requires another person, and meaningful feedback is hard to get. By the time the presentation, interview, or defense arrives, many people are simply hoping for the best.

That's why I built **SpeakUp.ai**.

SpeakUp.ai is an AI communication coach powered by **Google Gemma 4** that helps people improve presentations, project defenses, and job interviews by analyzing not just **what they say**, but **how they say it**.

Our goal is simple:

**Make high-quality communication coaching accessible to anyone with a laptop.**

---

# 🔧 How We Built It

### Google Gemma 4 at the Core

SpeakUp.ai was designed around **Google Gemma 4** from the very beginning.

Rather than using an LLM as a simple chatbot, we built the entire coaching experience around Gemma's ability to reason across multiple types of information simultaneously.

We used:

- **Gemma 4 E2B + LiteRT** for fast, private, offline coaching that runs entirely on the user's device.
- **Gemma 4 31B IT** for high-quality cloud reasoning and advanced multimodal analysis.
- **Gemma 4 26B A4B IT** as an efficient production model that balances quality and performance.

Gemma acts as the reasoning engine behind every major feature—from presentation analysis and script improvement to interview simulation and personalized coaching.

---

### From Video to Personalized Coaching

When a user uploads a presentation, SpeakUp.ai performs a complete multimodal analysis.

1. **FFmpeg** separates the video's audio and visual frames.
2. **Faster-Whisper** generates a highly accurate transcript of everything the user says.
3. The transcript and selected video frames are sent together to **Google Gemma 4**.
4. Gemma evaluates the presentation as one complete speech, analyzing confidence, pacing, posture, eye contact, body language, and communication style.
5. Finally, SpeakUp.ai generates an improved presentation script, personalized coaching, performance scores, and spoken feedback.

Instead of reviewing isolated clips, the AI understands the presentation as a complete story—making the feedback feel much more like a real communication coach.

---

### Prompt Engineering

One of our biggest challenges wasn't getting Gemma to answer questions—it was getting it to coach people naturally.

Early versions produced generic advice like *"maintain eye contact"* or *"slow down."* While technically correct, that wasn't the experience we wanted.

We redesigned our prompts so Gemma first understands the user's entire presentation before evaluating individual moments. This produces coaching that is consistent, contextual, and much closer to the feedback a human communication coach would provide.

---

### Technologies Used

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | Express.js + TypeScript |
| AI Models | Google Gemma 4 (LiteRT + Google Cloud API) |
| Speech Recognition | Faster-Whisper |
| Video Processing | FFmpeg |
| Text-to-Speech | Microsoft Edge Neural TTS |
| Deployment | Vercel + Local Node.js |

---

### AI Interview Simulator

Communication isn't only about presentations.

SpeakUp.ai also includes an AI interviewer that conducts realistic job interviews, thesis defenses, and startup pitch sessions.

Instead of asking questions from a fixed script, Gemma remembers previous answers, asks intelligent follow-up questions, evaluates responses using the STAR framework, and provides a detailed coaching report at the end of every session.

The result feels much closer to talking with a real interviewer than chatting with a traditional AI assistant.

---

## 🎯 The Prototype

🌐 **Live Demo:** https://speakup-ai-tawny.vercel.app/

💻 **GitHub Repository:** https://github.com/Icekid35/speakup-ai

---

## 😤 Challenges We Ran Into

Building SpeakUp.ai pushed us to solve problems across speech recognition, multimodal reasoning, local AI, and real-time interaction.

### Teaching AI to Coach, Not Just Answer

The hardest challenge wasn't building an AI that could analyze presentations—it was building one that could coach people naturally.

Our earliest versions generated generic feedback that sounded robotic and repetitive. Through multiple iterations of prompt engineering, we redesigned the reasoning process so Gemma first understands the user's complete presentation before giving personalized, contextual advice.

The difference was dramatic. Instead of isolated comments, the feedback became structured, actionable, and much closer to what a real communication coach would say.

### Reliable Speech Processing

Accurate coaching starts with accurate transcription.

We built a local speech pipeline using FFmpeg and Faster-Whisper to ensure users receive reliable transcripts before analysis. This significantly improved the quality of Gemma's reasoning compared to sending raw video directly for multimodal analysis.

### Running AI Locally

Supporting offline coaching introduced another challenge.

We integrated **Gemma 4 E2B through LiteRT**, allowing presentations and interviews to be analyzed locally without sending sensitive recordings to the cloud. This improves privacy, reduces latency, and makes SpeakUp.ai usable even in environments with limited internet connectivity.

### Creating Natural Conversations

Real interviews aren't scripted.

To make our AI examiner feel realistic, we designed it to remember previous answers, generate contextual follow-up questions, and evaluate responses using the STAR framework. The result is a dynamic conversation instead of a fixed list of interview questions.

---

## 🌍 Why This Matters

Communication is one of the few skills that every student, graduate, entrepreneur, researcher, and professional depends on.

Yet access to quality communication coaching remains expensive and out of reach for many people.

By combining **Google Gemma 4**, multimodal reasoning, and local inference with LiteRT, SpeakUp.ai makes personalized communication coaching accessible to anyone with a laptop.

We believe confidence shouldn't depend on where you live or whether you can afford a personal coach.

Everyone deserves the chance to be heard.