# UZHAVAN KURAL (உழவன் குரல்) — The Voice of the Soil
> **"Ungal Vivasayathukku Oru Kural" / "Your Farm, Your Voice"**
> *"உங்கள் விவசாயத்திற்கு அறிவும் ஆலோசனையும் — உங்கள் குரலில்."*

An AI-powered, multilingual, voice-first agricultural advisory assistant designed primarily for Indian and Tamil Nadu farmers, delivering a rich Tamil-first experience, real-time agromet weather, mandi market intelligence, crop health diagnosis, and RAG-grounded agricultural recommendations.

---

## 1. System Architecture

```
                  ┌──────────────────────────────────────────────────┐
                  │                 FARMER (VOICE/UI)                │
                  │   Tamil • English • Hindi • Telugu • Kannada     │
                  └─────────────────────────┬────────────────────────┘
                                            │
                                            ▼
                  ┌──────────────────────────────────────────────────┐
                  │              VOICE & SPEECH PIPELINE             │
                  │  • Browser Web Speech API (Native ta-IN STT/TTS) │
                  │  • Whisper Speech-to-Text Adapter                │
                  │  • High-Fidelity Tamil SpeechSynthesis           │
                  │  • Bhashini Translation & TTS Adapter            │
                  └─────────────────────────┬────────────────────────┘
                                            │
                                            ▼
                  ┌──────────────────────────────────────────────────┐
                  │         EXPRESS FULL-STACK BACKEND (/api/*)       │
                  ├──────────────────────────────────────────────────┤
                  │  • POST /api/chat        • POST /api/crop-health │
                  │  • GET  /api/weather     • GET  /api/market      │
                  │  • POST /api/rag/search  • GET  /api/health      │
                  └──────┬──────────────────┬─────────────────┬──────┘
                         │                  │                 │
        ┌────────────────▼───┐     ┌────────▼───────┐    ┌────▼──────────────┐
        │   GEMINI 3.8 FLASH │     │ OPENWEATHERMAP │    │ AGMARKNET MANDI   │
        │  • Agricultural AI │     │  • Temperature │    │  • Modal / Min /  │
        │  • Crop Diagnostics│     │  • Humidity    │    │    Max Prices     │
        │  • JSON Structured │     │  • Rain Risk   │    │  • Karur, Erode,  │
        │    Farm Advice     │     │  • Spray Timing│    │    Dindigul, etc. │
        └────────┬───────────┘     └────────────────┘    └───────────────────┘
                 │
        ┌────────▼────────────────────────────────────────┐
        │        RAG KNOWLEDGE ARCHITECTURE               │
        │  • TNAU (Tamil Nadu Agricultural University)    │
        │  • Organic Solutions (Panchagavya, NSKE 5%)    │
        │  • Agrarian Thirukkural Couplets (Chapter 104)  │
        │  • Tamil Nadu Uzhavan App & PM-KISAN Schemes    │
        └─────────────────────────────────────────────────┘
```

---

## 2. Key Features

1. **Voice-First Tamil Assistant**:
   - Central large microphone button with animated audio waveforms.
   - States: `IDLE`, `LISTENING` (கேட்கிறேன்...), `PROCESSING`, `THINKING`, `ANSWER`.
   - Real-time speech-to-text with auto Tamil detection and immediate text-to-speech audio feedback.
2. **AI Agricultural Advisory Engine**:
   - Powered by Google Gemini (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK.
   - Grounded in verified agronomic practices; strictly avoids dangerous chemical hallucinations.
   - Four-part structured output:
     1. *What may be happening* (சாத்தியமான காரணங்கள்)
     2. *What to do now* (இப்போது செய்ய வேண்டியவை)
     3. *What to monitor* (கவனிக்க வேண்டியவை)
     4. *When to consult an expert* (வேளாண்மை அலுவலர் வழிகாட்டல்)
3. **Multimodal Crop Health & Leaf Diagnostic**:
   - Upload leaf photos or capture directly with device camera.
   - Identifies yellowing, rice blast, stem borer, anthracnose, and nutrient deficiencies.
   - Emphasizes low-risk biological remedies (Panchagavya, Neem seed kernel extract NSKE, Trichoderma).
4. **Agromet Weather Dashboard**:
   - OpenWeatherMap integration displaying temperature, humidity, wind, and rain probabilities.
   - Interactive decision triggers: *"Should I irrigate?"*, *"Is it suitable to spray?"*, *"Should I apply fertilizer?"*, *"Rain risk"*.
5. **Mandi Market Prices**:
   - Live Agmarknet adapter and daily Tamil Nadu Regulated Market & Uzhavar Sandhai benchmarks.
   - Modal, minimum, and maximum prices for Paddy, Sugarcane, Banana, Cotton, Maize, Groundnut, Tomato, Chilli, Onion, Coconut.
   - *"Ask AI about this market"* capability for price negotiation guidance.
6. **Crop Advisory Guide (10 Major Crops)**:
   - Comprehensive stage-by-stage guidance, water requirements, and suggested inquiries.
7. **Offline-Resilient Architecture**:
   - LocalStorage and service caching for zero-connectivity situations in rural fields.
   - Graceful offline banner and access to saved advice and previous conversations.
8. **Hackathon 17-Step Demo Walkthrough**:
   - Interactive modal guide allowing judges to evaluate the entire 17-step flow in 1-click.

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root:

```bash
# Gemini AI API Key (Required for AI responses and multimodal vision)
# AI Studio automatically injects this from user secrets
GEMINI_API_KEY="your-gemini-api-key"
VITE_GEMINI_API_KEY=""

# OpenWeatherMap API Key (For live weather & rain probability)
OPENWEATHER_API_KEY="your-openweathermap-api-key"
VITE_OPENWEATHER_API_KEY=""

# Bhashini API Key (For Indian government language translation & TTS)
BHASHINI_API_KEY=""

# Whisper API Key (For backend speech transcription fallback)
WHISPER_API_KEY=""

# Agmarknet / APMC API Key (For live mandi price feeds)
AGMARKNET_API_KEY=""

# App URL for hosting
APP_URL="http://localhost:3000"
```

---

## 4. How APIs and Pipelines Work

### A. Google Gemini Integration
- Initialized in `server.ts` via `@google/genai`:
  ```ts
  import { GoogleGenAI } from '@google/genai';
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  ```
- Uses `gemini-3.8-flash` with JSON mime-type schema enforcing structured agricultural outputs and language localization.
- Multimodal leaf diagnosis accepts base64 images and generates preliminary visual indications.

### B. Weather Service (OpenWeatherMap)
- Handled server-side at `/api/weather`.
- Converts raw meteorological data into agricultural advice (e.g., wind > 15 km/h warns against spraying, rain chance > 50% warns against nitrogen top-dressing).
- When unconfigured, clearly returns `configured: false` with sample seasonal benchmarks rather than deceiving the farmer with fake data.

### C. Speech-to-Text (STT)
- Primary: Client-side Web Speech Recognition with locale `ta-IN` (Tamil), `hi-IN` (Hindi), `te-IN`, `kn-IN`, `ml-IN`, `en-IN`.
- Backend: `/api/transcribe` ready to connect Whisper API when `WHISPER_API_KEY` is provided.

### D. Text-to-Speech (TTS)
- Uses client-side Web SpeechSynthesis selecting native Tamil voices at an optimal agricultural pace (rate 0.95).
- Structure allows immediate plug-in of Bhashini TTS via `/api/speak`.

### E. Market Prices (Agmarknet)
- Handled via `/api/market-prices`.
- Transparently indicates whether prices originate from live Agmarknet APMC APIs or Tamil Nadu Regulated Market benchmarks.

### F. RAG Knowledge System
- Curated vector-style chunk retrieval (`/api/rag/search`) matching query terms, crop, and problem categories.
- Covers TNAU guidelines, organic pest remedies, government subsidies, and Thirukkural couplets.

---

## 5. Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start full-stack dev server (Express on port 3000 with Vite middleware)
npm run dev
```

Visit: `http://localhost:3000`

---

## 6. Building for Production

```bash
# Build the client assets
npm run build

# Start production server
npm run start
```

---

## 7. Demo Mode vs. Live Mode

- **Demo Mode**: Enabled by default for hackathons. Uses verified agricultural datasets, pre-indexed RAG documents, and sample mandi prices so evaluators can test complete flows even without third-party weather/mandi keys.
- **Live Mode**: Toggleable from the top status banner or Settings. Directly connects to live OpenWeatherMap and Agmarknet APIs.
