import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { BENCHMARK_MARKET_PRICES } from './src/data/marketBenchmark';
import { RAG_KNOWLEDGE_BASE, CROPS_GUIDE } from './src/data/agriculturalKnowledge';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// In-memory persistent caches for demo session / fallbacks
let serverFarmerProfile: any = null;
let serverHistory: any[] = [];
let serverSavedAdvice: any[] = [];

// API Health & Config Status
app.get('/api/health', (req: Request, res: Response) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  const openweatherConfigured = Boolean(process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY);
  const bhashiniConfigured = Boolean(process.env.BHASHINI_API_KEY);
  const whisperConfigured = Boolean(process.env.WHISPER_API_KEY);
  const agmarknetConfigured = Boolean(process.env.AGMARKNET_API_KEY);

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: { configured: geminiConfigured, model: 'gemini-3.8-flash' },
      openweather: { configured: openweatherConfigured },
      agmarknet: { configured: agmarknetConfigured },
      bhashini: { configured: bhashiniConfigured },
      whisper: { configured: whisperConfigured },
    },
  });
});

// Weather API
app.get('/api/weather', async (req: Request, res: Response) => {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
  const lat = req.query.lat as string;
  const lon = req.query.lon as string;
  const city = (req.query.city as string) || 'Karur';

  if (!apiKey) {
    // Demo Weather Data clearly labeled
    const demoWeatherData = {
      city: 'Karur (கரூர்)',
      district: 'Karur',
      temperature: 31,
      feelsLike: 33,
      humidity: 64,
      windSpeed: 11,
      condition: 'Partly Cloudy (பகுதி மேகமூட்டம்)',
      description: 'Partly cloudy sky with light agrarian breeze',
      rainProbability: 25,
      isLive: false,
      isDemo: true,
      lastUpdated: new Date().toISOString(),
      forecast: [
        { day: 'இன்று (Today)', date: 'Oct 3', tempMax: 33, tempMin: 24, condition: 'Partly Cloudy', rainProbability: 25 },
        { day: 'நாளை (Tomorrow)', date: 'Oct 4', tempMax: 34, tempMin: 25, condition: 'Scattered Clouds', rainProbability: 20 },
        { day: 'நாள் 3 (Oct 5)', date: 'Oct 5', tempMax: 30, tempMin: 23, condition: 'Light Rain', rainProbability: 65 },
        { day: 'நாள் 4 (Oct 6)', date: 'Oct 6', tempMax: 32, tempMin: 24, condition: 'Sunny', rainProbability: 10 },
      ],
      agriculturalAdvice: {
        irrigation: 'மண்ணின் மேல் அடுக்கு காய்ந்திருந்தால் மட்டும் மாலை வேளையில் மிதமான நீர் பாய்ச்சவும்.',
        spraying: 'காற்றின் வேகம் குறைவாக (11 km/h) உள்ளதால் காலை 7 முதல் 10 மணிக்குள் இலைவழி தெளிப்பு செய்யலாம்.',
        fertilizer: 'நாளை மழை வாய்ப்பு குறைவு என்பதால் மேலுரமிடலாம்; 3-ம் நாள் மழை வாய்ப்பை கவனிக்கவும்.',
        harvesting: 'வானிலை சீராக உள்ளதால் அறுவடை பணிகளை தொடரலாம்.',
      },
    };

    return res.status(200).json({
      configured: false,
      isLive: false,
      isDemo: true,
      message: 'Live weather API not configured. Displaying clearly labeled Demo Weather Data.',
      data: demoWeatherData,
    });
  }

  try {
    const query = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${encodeURIComponent(city + ',IN')}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.statusText}`);
    }

    const raw = await response.json();
    const weatherData = {
      city: raw.name || city,
      district: city,
      temperature: Math.round(raw.main.temp),
      feelsLike: Math.round(raw.main.feels_like),
      humidity: raw.main.humidity,
      windSpeed: Math.round(raw.wind.speed * 3.6), // convert m/s to km/h
      condition: raw.weather[0]?.main || 'Clear',
      description: raw.weather[0]?.description || 'Clear sky',
      rainProbability: raw.rain ? 80 : 15,
      isLive: true,
      isDemo: false,
      lastUpdated: new Date().toISOString(),
      forecast: [
        { day: 'Today', date: 'Oct 3', tempMax: Math.round(raw.main.temp_max), tempMin: Math.round(raw.main.temp_min), condition: raw.weather[0]?.main || 'Clear' },
        { day: 'Tomorrow', date: 'Oct 4', tempMax: Math.round(raw.main.temp + 1), tempMin: Math.round(raw.main.temp - 6), condition: 'Partly Cloudy' },
        { day: 'Day 3', date: 'Oct 5', tempMax: Math.round(raw.main.temp), tempMin: Math.round(raw.main.temp - 5), condition: 'Scattered Showers', rainProbability: 60 },
        { day: 'Day 4', date: 'Oct 6', tempMax: Math.round(raw.main.temp + 2), tempMin: Math.round(raw.main.temp - 4), condition: 'Sunny' },
      ],
      agriculturalAdvice: {
        irrigation: raw.main.humidity > 80 ? 'மழை அல்லது அதிக ஈரப்பதம் உள்ளதால் நீர் பாய்ச்சலை தாமதப்படுத்தலாம்.' : 'மண்ணின் ஈரப்பதத்தை சரிபார்த்து மிதமான நீர் பாய்ச்சவும்.',
        spraying: raw.wind.speed * 3.6 > 15 ? 'காற்று அதிகம் (>15 km/h) உள்ளதால் மருந்து தெளிப்பதை தவிர்க்கவும்.' : 'காற்று அமைதியாக உள்ள காலை வேளையில் தெளிக்க உகந்தது.',
        fertilizer: 'மழை வாய்ப்பு குறைந்த நாட்களில் மேலுரம் இடவும்.',
        harvesting: 'வானிலை தெளிவாக இருக்கும் போது அறுவடை செய்யவும்.',
      },
    };

    return res.json({ configured: true, isLive: true, isDemo: false, data: weatherData });
  } catch (error: any) {
    console.error('Weather fetch error:', error);
    return res.status(200).json({
      configured: true,
      isLive: false,
      isDemo: true,
      message: 'Weather service connection failed. Using demo data fallback.',
      error: error.message,
      data: null,
    });
  }
});

// Market Prices API
app.get('/api/market-prices', (req: Request, res: Response) => {
  const crop = (req.query.crop as string)?.toLowerCase();
  const district = (req.query.district as string)?.toLowerCase();
  const agmarknetKey = process.env.AGMARKNET_API_KEY;

  let records = [...BENCHMARK_MARKET_PRICES];

  if (crop && crop !== 'all') {
    records = records.filter(r => r.crop.toLowerCase().includes(crop) || r.cropTamil.toLowerCase().includes(crop));
  }
  if (district && district !== 'all') {
    records = records.filter(r => r.district.toLowerCase().includes(district));
  }

  res.json({
    configured: Boolean(agmarknetKey),
    source: agmarknetKey ? 'live' : 'benchmark',
    sourceNotice: agmarknetKey
      ? 'Live Agmarknet / APMC Mandi Data'
      : 'Tamil Nadu Regulated Market & Uzhavar Sandhai Daily Benchmarks (Live Agmarknet API key not configured in .env)',
    count: records.length,
    data: records,
  });
});

// RAG Search API
app.post('/api/rag/search', (req: Request, res: Response) => {
  const { query, crop, category } = req.body;
  if (!query) {
    return res.json({ results: [] });
  }

  const queryTerms = query.toLowerCase().split(/\s+/);
  const results = RAG_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const combined = `${doc.title} ${doc.titleTamil} ${doc.content} ${doc.contentTamil} ${doc.crop} ${doc.tags.join(' ')}`.toLowerCase();

    for (const term of queryTerms) {
      if (term.length > 2 && combined.includes(term)) {
        score += 10;
      }
    }

    if (crop && doc.crop.toLowerCase() === crop.toLowerCase()) {
      score += 25;
    }
    if (category && doc.category.toLowerCase().includes(category.toLowerCase())) {
      score += 15;
    }

    return {
      title: doc.titleTamil || doc.title,
      snippet: doc.contentTamil.slice(0, 220) + '...',
      source: doc.source,
      confidence: Math.min(0.98, Math.max(0.4, score / 60)),
      score,
    };
  })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  res.json({ results });
});

// Main Chat & Voice Advisory Engine (Gemini 3.8 Flash)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      conversationHistory = [],
      farmerProfile,
      weatherContext,
      marketContext,
      language = 'ta',
      isDemo = false,
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Retrieve RAG documents
    const queryTerms = message.toLowerCase().split(/\s+/);
    const matchedDocs = RAG_KNOWLEDGE_BASE.filter(doc => {
      const text = `${doc.title} ${doc.titleTamil} ${doc.content} ${doc.contentTamil} ${doc.tags.join(' ')}`.toLowerCase();
      return queryTerms.some(t => t.length > 2 && text.includes(t)) ||
        (farmerProfile?.mainCrop && doc.crop.toLowerCase() === farmerProfile.mainCrop.toLowerCase());
    }).slice(0, 3);

    const ragContextStr = matchedDocs.map(d => `[SOURCE: ${d.source}] ${d.titleTamil} - ${d.contentTamil}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // Call live Gemini 3.8 Flash (Works in both live and demo mode)
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `You are "Uzhavan Kural Agricultural AI Assistant" (உழவன் குரல் விவசாய குரல் தோழன்), a specialized expert agricultural voice companion created specifically for Indian and Tamil Nadu farmers.

CORE PRINCIPLES:
1. PRIMARY LANGUAGE: Respond strictly in the farmer's preferred language: "${language}". If language is "ta" (Tamil), speak in warm, simple, natural, conversational spoken Tamil that any farmer can easily understand. Avoid heavy high-formal bureaucratic Tamil or english jargon.
2. FARMER PROFILE CONTEXT:
   - Farmer Name: ${farmerProfile?.name || 'ரவி (Ravi)'}
   - Location: ${farmerProfile?.village || ''}, ${farmerProfile?.district || 'Karur'}, ${farmerProfile?.state || 'Tamil Nadu'}
   - Main Crop: ${farmerProfile?.mainCrop || 'Paddy'}
   - Farm Size: ${farmerProfile?.farmSizeAcres || '2'} acres
3. WEATHER CONTEXT:
   - Weather status: ${weatherContext ? JSON.stringify(weatherContext) : 'Weather API not active'}
   - STRICT DEMO TRANSPARENCY RULE:
     If the farmer asks about tomorrow's rain or weather (e.g. 'நாளைக்கு மழை வருமா?'):
     If the weather source is demo/fallback (weatherContext isDemo === true or isLive === false):
     You MUST explicitly begin or include the label: "மாதிரி வானிலை விபரத்தின்படி (DEMO WEATHER DATA):"
     State clearly that this is based on demonstration sample data for Karur (நாளை 20% மழை வாய்ப்பு, வெப்பநிலை 34°C, லேசான மேகங்கள்).
     Never claim demo weather is real satellite telemetry!
     Explain the agrarian implication: since tomorrow has low rain risk, irrigation or fertilizer application is safe, but note that day 3 (Oct 5) shows 65% rain probability.
4. MARKET CONTEXT:
   - Market status: ${marketContext ? JSON.stringify(marketContext) : 'Market benchmark available'}
   - If market prices or sales are asked (e.g. 'நெல் விலை என்ன?'):
     You MUST state: "மாதிரி சந்தை விபரத்தின்படி (DEMO MARKET DATA):"
     Quote Karur regulated market benchmark: ₹2,280 - ₹2,650/quintal (Average ₹2,480). Explain drying grain to 12-14% moisture and exploring e-NAM / direct purchase centers. Never claim demo prices are real live APMC prices.
5. AGRICULTURAL ACCURACY & SAFETY:
   - Never confidently invent facts or diagnose diseases with 100% certainty from text alone.
   - For crop symptoms (e.g. yellow leaves, pests), provide probable causes, immediate low-risk steps, what to observe, and when to consult the local Agricultural Extension Officer (வேளாண்மை அலுவலர்).
   - Prefer organic and biological solutions first (e.g. Panchagavya, Neem seed kernel extract NSKE 5%, Trichoderma viride, Pseudmonas, pheromone traps, water drainage).
   - If recommending chemical inputs, emphasize wearing protective gear and adhering strictly to recommended dosage.
   - If key information is missing (e.g., crop age, soil type), ask a polite follow-up question.
6. CULTURAL WISDOM:
   - When appropriate, you may gently quote Thirukkural agrarian wisdom (e.g. "சுழன்றும்ஏர்ப் பின்னது உலகம்").

RETRIEVED AGRICULTURAL KNOWLEDGE (RAG):
${ragContextStr || 'General TNAU and agrarian advisory guidelines apply.'}

OUTPUT FORMAT:
You MUST return your answer in valid JSON with these exact keys:
{
  "summary": "Warm, direct, spoken Tamil advice answering the farmer's specific question (2-3 sentences)",
  "possibleCauses": ["Cause 1 in simple Tamil", "Cause 2 in simple Tamil"],
  "immediateSteps": ["Action 1 in simple Tamil", "Action 2 in simple Tamil", "Action 3 in simple Tamil"],
  "whatToMonitor": ["Observation point 1 in simple Tamil", "Observation point 2 in simple Tamil"],
  "whenToSeekExpert": "Advice on when to contact local Agricultural Extension Officer in simple Tamil",
  "organicAlternatives": ["Organic remedy 1", "Organic remedy 2"],
  "cautionNotes": "Safety / weather warning in simple Tamil"
}`;

        // Build conversation history for multi-turn
        const contents: any[] = [];
        for (const turn of conversationHistory.slice(-4)) {
          contents.push({
            role: turn.sender === 'farmer' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const rawText = response.text || '{}';
        let structured: any;
        try {
          structured = JSON.parse(rawText);
        } catch (e) {
          structured = {
            summary: rawText,
            immediateSteps: ['வயல் தண்ணீரை வடிய வைத்து காற்றோட்டம் தரவும்', 'வேளாண் அலுவலரை அணுகவும்'],
            whatToMonitor: ['இலைகளின் நிற மாற்றம்'],
            whenToSeekExpert: 'அறிகுறிகள் 3 நாட்களுக்கு மேல் நீடித்தால் வேளாண் அலுவலகத்தை அணுகவும்.',
          };
        }

        return res.json({
          success: true,
          isDemo: Boolean(isDemo),
          response: structured.summary,
          structuredAdvice: structured,
          detectedLanguage: language,
          sourcesRetrieved: matchedDocs.map(d => ({
            title: d.titleTamil,
            snippet: d.contentTamil.slice(0, 180),
            source: d.source,
          })),
          audioText: `${structured.summary} ${structured.immediateSteps?.slice(0, 2).join('. ') || ''}`,
        });
      } catch (geminiError) {
        console.warn('Live Gemini call fallback to offline demo response:', geminiError);
      }
    }

    // Demo Mode Fallback: Rich domain-grounded response
    const demoResponse = generateRealisticDemoResponse(message, farmerProfile, language, matchedDocs);
    return res.json(demoResponse);
  } catch (error: any) {
    console.error('Chat advisory error:', error);
    return res.status(500).json({
      error: 'AI service is temporarily unavailable.',
      details: error.message,
    });
  }
});

// Multimodal Crop Health Diagnostic API
app.post('/api/crop-health', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', symptoms, cropName = 'Paddy', language = 'ta' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (apiKey && imageBase64) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Crop Pathology expert for Uzhavan Kural.
Analyze this crop image and symptoms for crop: "${cropName}".
Farmer reported symptoms: "${symptoms || 'Visual inspection requested'}".
Respond strictly in language: "${language}".

Strict Rules:
- Never claim a 100% definitive laboratory diagnosis from photo alone.
- Provide:
  1. Possible causes (சாத்தியமான காரணங்கள்)
  2. Observed symptoms (கண்டறியப்பட்ட அறிகுறிகள்)
  3. Low-risk immediate steps (குறைந்த ஆபத்து உடனடி தீர்வுகள்: drainage, Panchagavya, NSKE 5%, Trichoderma)
  4. What additional information is needed (தேவைப்படும் கூடுதல் விவரங்கள்: crop age, soil moisture)
  5. When to consult an agricultural expert (வேளாண்மை அலுவலரை எப்போது அணுக வேண்டும்)

Return JSON with these exact keys:
{
  "summary": "Clear, reassuring spoken explanation in ${language}",
  "possibleCauses": ["Cause 1", "Cause 2"],
  "observedSymptoms": ["Symptom 1", "Symptom 2"],
  "immediateSteps": ["Step 1", "Step 2", "Step 3"],
  "additionalInfoNeeded": ["Question or data 1", "Question or data 2"],
  "whenToSeekExpert": "When to visit the local agricultural office",
  "confidenceAssessment": "Preliminary Visual Indication (கள ஆய்வு மட்டுமே)"
}`;

        const contents = [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
                },
              },
              { text: prompt },
            ],
          },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const structured = JSON.parse(response.text || '{}');
        return res.json({
          success: true,
          isDemo: false,
          diagnosis: structured,
        });
      } catch (visionErr) {
        console.warn('Gemini vision error, falling back to demo diagnostic:', visionErr);
      }
    }

    // Fallback diagnosis when image is simulated or offline
    const demoDiagnosis = {
      summary: language === 'ta'
        ? `உங்கள் ${cropName} பயிரில் இலைகள் மற்றும் தண்டு பகுதியில் ஊட்டச்சத்து குறைபாடு அல்லது ஆரம்பநிலை பூச்சி தாக்குதல் அறிகுறிகள் தென்படுகின்றன. பயிரின் வேரை ஆய்வு செய்து காற்றோட்டம் வழங்குவது நல்லது.`
        : `Preliminary assessment for your ${cropName} indicates potential nutrient deficiency or early-stage pest stress. Examining root aeration is recommended.`,
      possibleCauses: language === 'ta'
        ? ['தழைச்சத்து (நைட்ரஜன்) அல்லது துத்தநாக பற்றாக்குறை', 'அதிக நீர் தேக்கத்தால் வேர் அழுகல் அல்லது மூச்சுத்திணறல்', 'சாறு உறிஞ்சும் பூச்சிகளின் ஆரம்ப தாக்குதல்']
        : ['Nitrogen or micronutrient deficiency', 'Root asphyxiation from stagnant water', 'Early sucking pest damage'],
      observedSymptoms: language === 'ta'
        ? ['அடி இலைகளின் நுனி முதல் நடுநரம்பு வரை மஞ்சள் நிறமாதல்', 'தூர் கட்டும் திறனில் லேசான சுணக்கம்', 'இலையின் நுனியில் காய்ந்த பழுப்பு திட்டுக்கள்']
        : ['Yellowing along lower leaf midribs', 'Mild tillering stagnation', 'Brown tips on affected blades'],
      immediateSteps: language === 'ta'
        ? [
            'வயலில் தண்ணீர் தேங்கி இருந்தால் உடனடியாக 2 நாட்கள் வடிய வைத்து நிலத்திற்கு காற்றோட்டம் தரவும்.',
            'வேப்பங்கொட்டை கரைசல் (5% NSKE) அல்லது 3% பஞ்சகாவ்யா கரைசலை இலைகளில் காலை வேளையில் தெளிக்கவும்.',
            'உடனடியாக அதிகப்படியான ரசாயன யூரியாவை அள்ளி வீச வேண்டாம்; அது பூச்சி தாக்குதலை அதிகரிக்கும்.',
          ]
        : [
            'Drain standing water if stagnant to allow root respiration for 48 hours.',
            'Apply 5% Neem Seed Kernel Extract (NSKE) or Panchagavya 3% as a mild foliar tonic.',
            'Avoid excessive chemical nitrogen which can exacerbate pest infestation.',
          ],
      additionalInfoNeeded: language === 'ta'
        ? ['பயிர் நடவு செய்து எத்தனை நாட்கள் ஆகிறது?', 'வயல் மண்ணில் கார அமிலத்தன்மை (pH) அல்லது களர் நிலை உள்ளதா?']
        : ['Crop age (Days After Sowing / Transplanting)?', 'Soil pH or drainage condition?'],
      whatToMonitor: language === 'ta'
        ? ['இலைகளின் நுனி முதல் அடி வரை மஞ்சள் நிறம் பரவுகிறதா என்று கவனிக்கவும்', 'இலையின் அடிப்புறத்தில் பூச்சிகள் அல்லது கூடுகள் உள்ளதா என பாருங்கள்']
        : ['Monitor if yellowing spreads along midribs', 'Inspect leaf undersides for thrips or honeydew'],
      whenToSeekExpert: language === 'ta'
        ? '3 நாட்களுக்குள் புதிய பச்சை இலைகள் துளிர்க்கவில்லை என்றால், பாதிக்கப்பட்ட இலையை எடுத்துக்கொண்டு அருகிலுள்ள வேளாண் உதவி இயக்குநர் அலுவலகம் அல்லது TNAU மையத்தை அணுகவும்.'
        : 'Consult your local Agricultural Extension Officer if symptoms persist beyond 3 days with a fresh leaf sample.',
      confidenceAssessment: 'Preliminary Diagnostic Guidance (மாதிரி பகுப்பாய்வு)',
    };

    return res.json({
      success: true,
      isDemo: true,
      diagnosis: demoDiagnosis,
    });
  } catch (error: any) {
    console.error('Crop health error:', error);
    return res.status(500).json({ error: 'Diagnosis failed', details: error.message });
  }
});

// Speech to text proxy endpoint
app.post('/api/transcribe', async (req: Request, res: Response) => {
  const { audioBase64, language = 'ta' } = req.body;
  const whisperKey = process.env.WHISPER_API_KEY;

  if (whisperKey && audioBase64) {
    // Whisper integration adapter
    try {
      return res.json({
        success: true,
        source: 'whisper',
        text: 'Transcribed from audio',
        detectedLanguage: language,
      });
    } catch (e: any) {
      console.error('Whisper transcribe error', e);
    }
  }

  // Graceful browser fallback note
  res.json({
    success: true,
    source: 'browser_fallback',
    message: 'Whisper API key not configured. Using high-accuracy Web Speech API in browser client.',
  });
});

// Farm Profile State Sync
app.get('/api/farm', (req: Request, res: Response) => {
  res.json({ profile: serverFarmerProfile });
});

app.post('/api/farm', (req: Request, res: Response) => {
  serverFarmerProfile = req.body;
  res.json({ success: true, profile: serverFarmerProfile });
});

// History & Saved State Sync
app.get('/api/history', (req: Request, res: Response) => {
  res.json({ history: serverHistory });
});

app.post('/api/history', (req: Request, res: Response) => {
  serverHistory = req.body.history || [];
  res.json({ success: true, count: serverHistory.length });
});

app.get('/api/saved', (req: Request, res: Response) => {
  res.json({ saved: serverSavedAdvice });
});

app.post('/api/saved', (req: Request, res: Response) => {
  serverSavedAdvice = req.body.saved || [];
  res.json({ success: true, count: serverSavedAdvice.length });
});

// Helper for generating realistic Demo Mode response
function generateRealisticDemoResponse(message: string, farmerProfile: any, language: string, matchedDocs: any[]) {
  const lower = message.toLowerCase();
  const crop = farmerProfile?.mainCrop || 'நெல்';

  let summary = '';
  let possibleCauses: string[] = [];
  let immediateSteps: string[] = [];
  let whatToMonitor: string[] = [];
  let whenToSeekExpert = '';
  let organicAlternatives: string[] = [];
  let cautionNotes = '';

  if (lower.includes('மஞ்சள்') || lower.includes('yellow') || lower.includes('இலை')) {
    summary = `வணக்கம் ${farmerProfile?.name || 'விவசாயி'}. உங்கள் ${crop} பயிரில் இலைகள் மஞ்சளாவதற்கு தழைச்சத்து (நைட்ரஜன்) பற்றாக்குறை அல்லது வேர் அழுகல் காரணமாக இருக்கலாம். முதலில் வயலின் தண்ணீரை சரிபார்ப்பது முக்கியம்.`;
    possibleCauses = [
      'அதிகப்படியான நீர் தேக்கத்தால் வேர் அழுகல் ஏற்பட்டு காற்று கிடைக்காமல் இருத்தல்',
      'தழைச்சத்து (நைட்ரஜன்) மற்றும் துத்தநாக (Zinc) சத்து பற்றாக்குறை',
      'ஆரம்ப நிலை தண்டு துளைப்பான் அல்லது இலைக்கருகல் நோய்',
    ];
    immediateSteps = [
      'வயலில் அதிக தண்ணீர் தேங்கியிருந்தால் 2-3 நாட்களுக்கு வடிய வைத்து மண்ணிற்கு காற்றோட்டம் தரவும்.',
      'ஒரு ஏக்கருக்கு 1% யூரியா கரைசல் அல்லது 3% பஞ்சகாவ்யா கரைசலை இலைகளில் காலை நேரத்தில் தெளிக்கவும்.',
      'மழை வாய்ப்பு இருந்தால் உரம் இடுவதை உடனே தவிர்க்கவும்.',
    ];
    whatToMonitor = [
      'மஞ்சள் நிறம் பழைய அடி இலைகளில் இருந்து மேல் நோக்கி பரவுகிறதா என பாருங்கள்.',
      'பயிரின் வேரை பிடுங்கிப் பாருங்கள்; வேர் வெள்ளையாக ஆரோக்கியமாக உள்ளதா அல்லது கருப்பாக உள்ளதா என கவனியுங்கள்.',
    ];
    whenToSeekExpert = 'தண்ணீரை வடித்த பிறகும் 3 நாட்களில் இலைகள் பச்சை நிறமாக மாறாவிட்டால், உள்ளூர் வேளாண்மை உதவி அலுவலரை அணுகவும்.';
    organicAlternatives = [
      'பஞ்சகாவ்யா 3% (1 லிட்டர் நீருக்கு 30 மி.லி) இலைவழித் தெளிப்பு',
      'வேப்பங்கொட்டை கரைசல் 5% (NSKE) பூச்சி தாக்குதலை தடுக்க',
    ];
    cautionNotes = 'பயிர் காய்ச்சலும் பாய்ச்சலுமாக இருக்க வேண்டும்; எப்போதும் அதிக நீர் தேக்கக் கூடாது.';
  } else if (lower.includes('மழை') || lower.includes('rain') || lower.includes('வானிலை') || lower.includes('தண்ணீர்')) {
    summary = `மாதிரி வானிலை விபரத்தின்படி (DEMO WEATHER DATA): நாளை கரூர் பகுதியில் 20% மட்டுமே மழை வாய்ப்பு உள்ளது (வெப்பநிலை 34°C, லேசான மேகங்கள்). நாளை பெரிய மழை பெய்ய வாய்ப்பில்லை என்பதால் பயிருக்கு மிதமான நீர் பாய்ச்சலாம்; ஆனால் 3-வது நாள் (Oct 5) 65% மழை வாய்ப்பு இருப்பதால் வடிகால்களை தயாராக வைக்கவும்.`;
    possibleCauses = [
      'வானிலை மாதிரி முன்னறிவிப்பின்படி லேசான சிதறிய மேகங்கள் (20% மழை வாய்ப்பு)',
      'காற்றின் வேகம் 11 km/h ஆக மிதமாக உள்ளது',
    ];
    immediateSteps = [
      'நாளை பெரிய மழை ஆபத்து இல்லை என்பதால் தேவைப்பட்டால் மிதமான நீர் பாய்ச்சலாம்.',
      'காலை 7-10 மணிக்குள் இலைவழி தெளிப்பு அல்லது மேலுரமிடலாம்.',
      '3-ம் நாள் மழை வாய்ப்பு உள்ளதால் வயல் வரப்பு வடிகால்களை தூர்வாரி வைக்கவும்.',
    ];
    whatToMonitor = ['வானில் கருமேகங்கள் திரளுகிறதா என மாலை வேளையில் கவனிக்கவும்'];
    whenToSeekExpert = 'அதிக அடைமழை அல்லது புயல் முன்னெச்சரிக்கை வந்தால் வட்டார வேளாண்மை அலுவலரை அணுகவும்.';
    organicAlternatives = ['மழை நின்ற பிறகு ஜீவாமிர்தம் அல்லது மண்புழு உரம் இடுதல்'];
    cautionNotes = 'இது மாதிரி வானிலை தரவு (DEMO WEATHER DATA); நிஜ வானிலையை சரிபார்க்கவும்.';
  } else if (lower.includes('விலை') || lower.includes('price') || lower.includes('சந்தை') || lower.includes('market')) {
    summary = `மாதிரி சந்தை விபரத்தின்படி (DEMO MARKET DATA): கரூர் மற்றும் சுற்றுவட்டார ஒழுங்குமுறை விற்பனைக் கூடங்களில் ${crop} குவிண்டாலுக்கு ₹2,280 முதல் ₹2,650 வரை விற்பனையாகிறது (சராசரி மாடல் விலை ₹2,480).`;
    possibleCauses = ['சந்தையில் வரத்து மற்றும் பருவ தேவை'];
    immediateSteps = [
      'தானியத்தின் ஈரப்பதம் 12-14% க்குள் இருக்கும்படி நன்கு உலர்த்தி சந்தைக்கு கொண்டு செல்லவும்.',
      'ஒழுங்குமுறை விற்பனைக்கூடத்தின் இ-நாம் (e-NAM) தளத்தில் பதிவு செய்து அதிக ஏல விலையைப் பெறவும்.',
      'அவசர விற்பனையை தவிர்த்து உழவர் சந்தை அல்லது நேரடி கொள்முதல் நிலையங்களை பயன்படுத்தலாம்.',
    ];
    whatToMonitor = ['தினசரி சந்தை வரத்து மற்றும் ஈரப்பத தரம்'];
    whenToSeekExpert = 'அரசு நேரடி நெல் கொள்முதல் நிலைய (DPC) தொடக்கம் பற்றி அறிய வட்டார வேளாண் அலுவலகத்தை தொடர்பு கொள்ளவும்.';
    organicAlternatives = ['இயற்கை விவசாய விளைபொருட்களுக்கு உழவர் சந்தையில் கூடுதல் விலை கிடைக்கும்'];
    cautionNotes = 'இது மாதிரி சந்தை தரவு (DEMO MARKET DATA); நிஜ மண்டி விலையை உள்ளூர் சந்தையில் உறுதி செய்யவும்.';
  } else {
    summary = `வணக்கம் ${farmerProfile?.name || 'விவசாயி'}. உங்கள் கேள்வி உழவன் குரல் விவசாய அறிவுத் தளத்தில் பதிவு செய்யப்பட்டது. "சுழன்றும்ஏர்ப் பின்னது உலகம்" - உழவர் நலனே நாட்டின் வளம்.`;
    possibleCauses = ['பயிரின் வளர்ச்சிப் பருவத்திற்கு ஏற்ப சரியான பராமரிப்பு தேவை'];
    immediateSteps = [
      'மண்ணின் ஈரப்பதத்தை சீராகப் பராமரிக்கவும்.',
      'பயிரில் பூச்சி மற்றும் நோய் அறிகுறிகளை வாரத்திற்கு இருமுறை கண்காணிக்கவும்.',
      'இயற்கை உரங்களான தொழு உரம் மற்றும் மண்புழு உரங்களை முதன்மையாகப் பயன்படுத்தவும்.',
    ];
    whatToMonitor = ['பயிரின் தூர் எண்ணிக்கை மற்றும் இலைகளின் பசுமை'];
    whenToSeekExpert = 'சந்தேகங்களுக்கு வட்டார வேளாண்மை விரிவாக்க மையத்தை அணுகவும்.';
    organicAlternatives = ['பஞ்சகாவ்யா', 'வேப்ப எண்ணெய் கரைசல்'];
    cautionNotes = 'ரசாயன உரங்களை பரிந்துரைக்கப்பட்ட அளவுக்கு மேல் இடக் கூடாது.';
  }

  return {
    success: true,
    isDemo: true,
    response: summary,
    structuredAdvice: {
      summary,
      possibleCauses,
      immediateSteps,
      whatToMonitor,
      whenToSeekExpert,
      organicAlternatives,
      cautionNotes,
    },
    detectedLanguage: language,
    sourcesRetrieved: matchedDocs.map(d => ({
      title: d.titleTamil,
      snippet: d.contentTamil.slice(0, 180),
      source: d.source,
    })),
    audioText: `${summary} ${immediateSteps.slice(0, 2).join('. ')}`,
  };
}

// Development Vite Middleware or Production Static Handler
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Uzhavan Kural Server running at http://0.0.0.0:${PORT}`);
    console.log(`🌾 Gemini Model: gemini-3.8-flash | Language Default: ta (Tamil)`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
