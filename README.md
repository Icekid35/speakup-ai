# SpeakUp.ai

> **Helping people become better speakers with the power of Google Gemma 4.**

SpeakUp.ai is an AI communication coach that helps people improve the way they speak, present, and communicate.

Whether you're preparing for a job interview, defending your final-year project, pitching investors, or giving a presentation, SpeakUp.ai watches how you communicate—not just what you say—and gives practical feedback to help you improve.

Unlike traditional AI assistants that only analyze text, SpeakUp.ai combines speech, vision, and conversational AI to evaluate your words, voice, body language, eye contact, posture, and overall delivery.

The goal isn't just to help you write better scripts. It's to help you become a better communicator.

Built with **Google Gemma 4**, SpeakUp.ai can analyze presentation videos, simulate realistic interviews, provide spoken feedback, and even run locally using LiteRT for fast, private, on-device coaching.

---

# Why We Built SpeakUp.ai

Good communication changes lives.

It helps students defend years of research with confidence. It helps job seekers perform better in interviews. It helps founders convince investors. It helps professionals present ideas clearly.

The problem is that most people don't have access to a personal communication coach before these important moments.

Today's AI tools can rewrite your script or fix your grammar, but they can't tell you if you're avoiding eye contact, speaking too fast, relying on filler words, or looking nervous while presenting.

Communication is more than words. It's how those words are delivered.

That's exactly what SpeakUp.ai was built to solve.

Using Google Gemma 4, SpeakUp.ai combines speech understanding, visual reasoning, and conversational intelligence to coach people the way a real presentation coach or interviewer would.

Instead of simply telling users what they did wrong, it explains why, shows them how to improve, and lets them practice until they feel confident.

Our goal is simple: **Make high-quality communication coaching available to anyone with a laptop.**

---

### A Day with SpeakUp.ai

Sarah has her final-year project defense tomorrow. 

She knows her project inside out, but every time she presents, she speaks too quickly, avoids eye contact, and fills every pause with "um." 

She uploads her presentation to SpeakUp.ai. 

Within minutes, the AI points out exactly where her confidence drops, rewrites parts of her script to sound more natural, and walks her through a realistic mock defense with follow-up questions.

By the time she enters the examination room, she's no longer rehearsing what to say—she's focused on delivering it confidently.

That's the experience we wanted to build.

---

# Why Google Gemma 4?

SpeakUp.ai was designed around Google Gemma 4 from the beginning.

We wanted an AI that could do more than rewrite text—we wanted one that could understand communication the way people do.

When someone gives a presentation, we naturally pay attention to multiple things at once:
- What they're saying
- How they're saying it
- Whether they sound confident
- Their facial expressions
- Their posture
- Whether their body language matches their words

This requires reasoning across different types of information simultaneously. Gemma 4's multimodal capabilities made this possible.

For our project, Gemma 4 serves as the reasoning engine behind every major feature. It analyzes presentation transcripts, interprets visual observations extracted from video frames, conducts realistic interviews, rewrites presentation scripts, and generates personalized coaching based on the user's overall performance.

Another reason we chose Gemma 4 is its ability to run locally through LiteRT.

Many students, researchers, and professionals practice presentations containing confidential information that should never leave their device. Running Gemma locally allows SpeakUp.ai to provide private AI coaching without requiring an internet connection or sending sensitive videos to external servers.

Cloud models remain available whenever users want larger models, but local inference ensures the application remains accessible, affordable, and privacy-friendly.

---

# How SpeakUp.ai Works

Although SpeakUp.ai feels like a single AI assistant, it is actually made up of several specialized components working together.

The process begins when a user uploads a presentation video or starts an interactive interview session.

For presentation analysis:
1. The uploaded video is processed using FFmpeg to separate audio from video frames.
2. Faster-Whisper generates an accurate transcript of everything the speaker says.
3. Important video frames are extracted and sent to Gemma 4 for visual analysis.
4. Gemma combines both the transcript and visual observations to understand the presentation as a whole.
5. SpeakUp.ai generates detailed coaching, presentation scores, body language feedback, and an improved version of the user's script.

For interview practice:
1. Gemma acts as a realistic interviewer or examiner.
2. The user answers naturally using their microphone.
3. SpeakUp.ai automatically detects when the speaker has finished talking.
4. Gemma evaluates the response and generates an intelligent follow-up question.
5. At the end of the session, users receive a complete performance report together with spoken feedback highlighting strengths and areas for improvement.

This creates a natural conversation without requiring users to constantly press buttons or manually control the interview flow.

---

# What SpeakUp.ai Can Do

### Presentation Coach
Upload a presentation and receive detailed feedback on your speech, delivery, confidence, pacing, body language, and overall communication style.

Instead of simply pointing out mistakes, SpeakUp.ai explains why they matter and suggests practical improvements.

---

### AI Interview & Thesis Examiner
Practice realistic interviews for:
- Job interviews
- Final-year project defenses
- Thesis presentations
- Scholarship interviews
- Startup investor pitches

The AI responds like a real interviewer by asking follow-up questions based on your previous answers rather than following a fixed script.

---

### AI Script Improvement
SpeakUp.ai rewrites presentations to make them clearer, more persuasive, and easier to deliver while preserving the speaker's original message and intent.

---

### Body Language Analysis
Using Gemma 4's visual reasoning capabilities, SpeakUp.ai evaluates posture, eye contact, facial expressions, and presentation confidence to identify habits that may affect communication.

---

### Spoken AI Feedback
At the end of every coaching session, SpeakUp.ai doesn't just display results—it explains them.

Users receive a spoken performance review summarizing their strengths, weaknesses, and personalized recommendations for improvement.

---

### Local AI Support
SpeakUp.ai can run entirely on-device using Google Gemma 4 through LiteRT.

This allows users to practice presentations privately, even without an internet connection, making the application especially useful for students, professionals, and organizations working with sensitive information.

---

## System Architecture

To support real-time audio interaction and local multimodal processing, SpeakUp.ai is divided into a high-performance web client and an edge-capable server pipeline.

```mermaid
flowchart TD
    subgraph Client ["Client Interface (React + TypeScript)"]
        UI["SpeakUp Dashboard"]
        Viewfinder["Light-Mode Video Viewfinder"]
        Orb["Active Voice Practice Orb"]
        Timeline["Precision Timeline Selector"]
    end

    subgraph Backend ["Edge API Gateway (Express Server)"]
        AnalyzeEP["/api/analyze Endpoint"]
        StepEP["/api/interview-step Endpoint"]
        SummaryEP["/api/interview-summary Endpoint"]
    end

    subgraph Processing ["Multimodal Processing Pipeline"]
        FFmpeg["FFmpeg Audio/Frame Demuxer"]
        Whisper["Faster-Whisper ASR Engine"]
    end

    subgraph Gemma4 ["Google Gemma 4 Reasoning Core"]
        LocalGemma["Local Gemma 4 E2B (LiteRT Local Server)"]
        CloudGemma31B["Gemma 4 31B IT (Cloud API)"]
        CloudGemma26B["Gemma 4 26B A4B IT (Cloud API)"]
    end

    subgraph AudioEngine ["Speech Synthesis Pipeline"]
        MacSay["Native PCM Audio Encoder (macOS say)"]
    end

    UI -->|Upload Video| AnalyzeEP
    UI -->|Voice Input Stream| StepEP
    
    AnalyzeEP --> FFmpeg
    FFmpeg -->|Extract Frames| Gemma4
    FFmpeg -->|Extract Audio| Whisper
    Whisper -->|Full Spoken Transcript| Gemma4
    
    Gemma4 -->|1. Holistic Script Doctor Rewrite| Gemma4
    Gemma4 -->|2. Align Segment Phrasing| UI
    
    StepEP --> Gemma4
    SummaryEP --> Gemma4
    Gemma4 -->|Spoken Feedback Text| MacSay
    MacSay -->|PCM Audio Output| Orb
```

### End-to-End Request Flow
1. **Presentation Ingestion**: The user uploads or records a presentation video in the dashboard interface.
2. **Asynchronous Demuxing**: The server extracts raw audio as mono-channel 16kHz PCM WAV (optimal for transcribers) and extracts video frames at fixed intervals.
3. **ASR Transcription**: Faster-Whisper processes the audio file, outputting exact timestamps and word groups.
4. **Holistic Gemma Evaluation**: Rather than analyzing chunks out-of-context, the server packages the whole transcript and frame data into a single request. Gemma constructs a cohesive rewritten script and aligns segments.
5. **Real-time Voice Dialog**: During the mock interview stage, voice responses are submitted hands-free. Gemma routes these dynamically to create contextual follow-up questions.

### Design Rationale
We designed the architecture around **minimizing inference roundtrips** and **maximizing context windows**. By performing speech recognition and frame extraction locally on the server, we avoid sending huge payloads. When Cloud APIs are active, only compressed frame buffers and clean text transcripts are transmitted, keeping network overhead minimal and latency low.

---

## Inside the AI Pipeline

SpeakUp.ai's pipeline behaves like an executive editor and performance coach. Here's a deep-dive look at the engineering under the hood:

### Video Processing & Frame Extraction
We use FFmpeg to sample frames at regular intervals based on the total video duration. This reduces visual noise and avoids feeding redundant frames to Gemma 4's vision decoder, which preserves computing resources during local execution.
```bash
ffmpeg -y -ss {timestamp} -i video.mp4 -vframes 1 -q:v 2 frame.jpg
```

### Whisper Transcription
We integrate `faster-whisper` because it runs up to 4x faster than standard OpenAI Whisper implementations with the same accuracy. This gives us sub-second transcription for short recordings.

### Holistic Prompt Engineering
To prevent fragmented segment rewrites (a common issue in traditional clip coaches), we use a structured prompt that passes the full transcript alongside the segment boundaries:
```
INSTRUCTIONS:
1. First, professionally rewrite the ENTIRE spoken script. The new script should flow naturally from start to finish as one continuous speech.
2. Align/assign the appropriate section of this new professional script to the corresponding timeline segment ("better_phrasing" field).
```

### Model Routing
The application dynamically routes queries:
* **Local Mode**: Uses `gemma-4-e2b` running locally on port `9379`.
* **Production/Cloud Mode**: Routes larger reasoning tasks to `gemma-4-31b-it` or `gemma-4-26b-a4b` via Google Cloud API key credentials.

### Conversation Memory & Context Management
During active mock interviews, we maintain an incremental conversational history. Each turn is appraised against the **STAR (Situation, Task, Action, Result)** model, enabling the examiner to ask highly relevant follow-up questions instead of static pre-written cues.

---

## Why Local AI Matters

On-device inference is not just a feature—it is a necessity for making technology accessible and private.

*   **Privacy & Data Ownership**: Executive pitches, research paper defense material, and medical presentations contain valuable intellectual property. On-device execution ensures that sensitive data never leaves the user's laptop.
*   **Accessible Education (Low Bandwidth & Africa)**: In regions with low connectivity, downloading massive models or constantly calling cloud APIs is impossible. SpeakUp.ai can run entirely offline with `APP_MODE=local`, enabling students globally to access coaching.
*   **Zero Marginal Cost**: Standard API-driven coaches charge per minute of video analyzed. SpeakUp.ai runs locally for free, making unlimited practices viable for everyone.
*   **Low Latency Edge Interaction**: Hands-free conversation requires low response latency. Running the model on the local device minimizes network roundtrips, making conversation feel immediate.

---

## How We Used Gemma 4

We designed SpeakUp.ai around Gemma 4's key strengths rather than treating the LLM as a generic text box.

| Feature | Gemma Capability | Why It Matters |
| :--- | :--- | :--- |
| **Multimodal Presentation Analysis** | Joint Vision & Text Processing | Evaluates visual posture cues, gestures, and eye contact simultaneously with spoken words. |
| **Holistic Script Doctor** | Long Context Reasoner | Rewrites complete presentation scripts cohesively before assigning sections to individual timeline segments. |
| **Interactive Defense Examiner** | Chat & Roleplay Logic | Simulates academic panels (thesis boards, PhD examiners) with dynamic, context-aware follow-up questions. |
| **On-device Speech Diagnosis** | LiteRT Local Inference | Allows the complete coach workspace to run offline on standard consumer hardware. |

---

## Technical Implementation

Below is a directory map showing where crucial features are implemented:

*   **API Router & Local/Cloud Selection**:
    See `queryAI()` inside [server.ts](server.ts#L61-L105).
*   **Local OpenAI-Compatible Client**:
    See `queryGemma()` inside [server.ts](server.ts#L21-L58). This manages the POST request payloads sent to the local `LITERT_SERVER_URL`.
*   **Gemma 4 Vision Posture & Eye Contact Analysis**:
    See `extractVisionObservation()` inside [server.ts](server.ts#L370-L409).
*   **Holistic Script Doctor Rewrite**:
    See the `/api/analyze` post route inside [server.ts](server.ts#L977-L1112).
*   **STAR Interview Turn Processing & Audio Loop**:
    See the `/api/interview-step` post route inside [server.ts](server.ts#L1220-L1255).
*   **Spoken Examiner Debrief Report**:
    See the `/api/interview-summary` post route inside [server.ts](server.ts#L1290-L1350).
*   **Dynamic Client Viewfinder & Video Control**:
    See [VideoStage.tsx](components/VideoStage.tsx).
*   **Interactive Evaluation Dashboard**:
    See [AnalysisView.tsx](components/AnalysisView.tsx).

---

## Getting Started (Quick & Easy Setup)

Running SpeakUp.ai takes less than 2 minutes.

---

### Step 1: Clone & Install Dependencies

```bash
# 1. Clone the repository
git clone https://github.com/Icekid35/speakup-ai.git
cd speakup-ai

# 2. Install Node dependencies
npm install

# 3. Setup Python Virtual Environment for Speech & Local ASR
python3 -m venv .venv
source .venv/bin/activate
pip install faster-whisper edge-tts
```

---

### Step 2: Configure API Key

Copy the environment template:
```bash
cp .env.example .env
```

Open `.env` and add your free Gemini API key (get a free key at [aistudio.google.com](https://aistudio.google.com/)):
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Tip:** You can also enter or change your API key anytime directly inside the application UI by clicking the model badge in the top right corner!

---

### Step 3: Launch the Application

```bash
npm run dev
```

Open **`http://localhost:3000`** in your browser. That's it!

---

### Running Gemma 4 Locally with LiteRT

This guide shows you how to install and run **Google Gemma 4** locally using **LiteRT** on macOS and Windows.

#### Requirements

- Python 3.12+
- Internet connection (first download only)

---

#### 1. Install Python 3.12

##### macOS

```bash
brew install python@3.12
python3.12 --version
```

##### Windows

Download and install Python 3.12 from:
[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)

Verify:
```powershell
python --version
```

---

#### 2. Install LiteRT

##### macOS

```bash
brew install uv

uv python install 3.12

uv tool install --python 3.12 litert-lm

uv tool update-shell

exec zsh
```

Verify:
```bash
litert-lm --help
```

##### Windows

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

uv python install 3.12

uv tool install --python 3.12 litert-lm
```

Restart PowerShell or Command Prompt, then verify:
```powershell
litert-lm --help
```

---

#### 3. Install Hugging Face CLI

##### macOS

```bash
uv tool install huggingface-hub

hf --version
```

##### Windows

```powershell
uv tool install huggingface-hub

hf --version
```

---

#### 4. Login to Hugging Face

1. Create a free account at [https://huggingface.co](https://huggingface.co)
2. Accept the Gemma model license at [https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm](https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm)
3. Create a **Read** access token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

Login:
```bash
hf auth login
```

---

#### 5. Download Gemma 4

##### GPU

```bash
litert-lm run \
  --from-huggingface-repo=litert-community/gemma-4-E2B-it-litert-lm \
  gemma-4-E2B-it.litertlm \
  --backend=gpu \
  --prompt="Hello"
```

##### CPU

```bash
litert-lm run \
  --from-huggingface-repo=litert-community/gemma-4-E2B-it-litert-lm \
  gemma-4-E2B-it.litertlm \
  --backend=cpu \
  --prompt="Hello"
```

---

#### 6. Import the Model

```bash
litert-lm import \
  --from-huggingface-repo=litert-community/gemma-4-E2B-it-litert-lm \
  gemma-4-E2B-it.litertlm \
  gemma4-e2b
```

Verify:
```bash
litert-lm list
```

---

#### 7. Start the Local Server

```bash
litert-lm serve
```

The OpenAI-compatible API will be available at:
`http://127.0.0.1:9379/v1`

---

#### Everyday Usage

Once everything is installed, simply run:

```bash
litert-lm serve
```
or on Windows:
```powershell
litert-lm serve
```

That's all you need to start your local Gemma server.

---

### Launching the Application

Start the local server and dev environment:
```bash
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## Future Vision

We want to expand SpeakUp.ai beyond basic presentation coaching:

*   **Integrated Virtual Coach**: Real-time delivery evaluation overlay during Google Meet, Zoom, and MS Teams meetings.
*   **Edge Mobile Application**: Mobile companion app utilizing on-device Gemma models for low-latency feedback.
*   **Sales & Negotiations Training**: Specialized scenarios for customer negotiations, pitches, and board review preparation.
*   **Global Access (African Languages)**: Localized speech model training to support non-English presentations and dialects.
*   **Accessibility Mode**: Specialized features for public speaking training for people with speech impediments or high anxiety.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.