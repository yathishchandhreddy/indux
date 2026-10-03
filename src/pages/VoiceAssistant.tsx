import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { SpeechService } from '../services/speechService';
import { ApiClient } from '../services/apiClient';
import { ChatMessage, StructuredAdvice } from '../types';
import { AudioWaveform } from '../components/AudioWaveform';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  CloudSun,
  AlertTriangle,
  Send,
  HelpCircle,
} from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'thinking' | 'answer';

interface PipelineStep {
  label: string;
  done: boolean;
  active: boolean;
}

export const VoiceAssistant: React.FC = () => {
  const {
    farmerProfile,
    language,
    weatherData,
    activeConversation,
    addMessage,
    saveAdvice,
    isDemoMode,
    setCurrentScreen,
    speakingMessageId,
    setSpeakingMessageId,
  } = useApp();

  const t = translations[language];
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [showPipeline, setShowPipeline] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new responses
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, voiceState]);

  // Clean up any ongoing TTS on unmount
  useEffect(() => {
    return () => {
      SpeechService.stopSpeaking();
      SpeechService.stopListening();
    };
  }, []);

  // Quick inquiry sample questions matching Demo Scenario 1 & 2
  const quickQuestions = [
    { text: 'என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது. என்ன செய்யலாம்?', topic: '🌾 இலைகள் மஞ்சளாதல் (Paddy Yellowing)', icon: '🌾' },
    { text: 'நாளைக்கு மழை வருமா?', topic: '🌧 நாளைக்கு மழை வருமா?', icon: '🌧' },
    { text: 'தண்ணீர் பாய்ச்சலாமா?', topic: '💧 தண்ணீர் பாய்ச்சலாமா?', icon: '💧' },
    { text: 'நெல் விலை என்ன?', topic: '💰 நெல் விலை என்ன?', icon: '💰' },
    { text: 'உரம் எப்போது போடலாம்?', topic: '🌱 உரம் எப்போது போடலாம்?', icon: '🌱' },
    { text: 'பூச்சி பிரச்சனை', topic: '🐛 பூச்சி பிரச்சனை', icon: '🐛' },
  ];

  // Pipeline simulation helper
  const updatePipelineSteps = (stepIdx: number) => {
    const defaultSteps = [
      { label: '🎤 குரல் பதிவு செய்யப்பட்டது (Voice captured)', done: false, active: false },
      { label: '✓ பேச்சு உரையாக மாற்றப்பட்டது (Speech understood)', done: false, active: false },
      { label: '✓ தமிழ் மொழி கண்டறியப்பட்டது (Tamil detected)', done: false, active: false },
      { label: '✓ வானிலை சரிபார்க்கப்பட்டது (Weather checked)', done: false, active: false },
      { label: '✓ வேளாண் அறிவுத்தளம் தேடப்பட்டது (Knowledge retrieved)', done: false, active: false },
      { label: '✓ ஆலோசனை உருவாக்கப்பட்டது (Advice generated)', done: false, active: false },
    ];

    setPipelineSteps(
      defaultSteps.map((step, idx) => ({
        ...step,
        done: idx < stepIdx,
        active: idx === stepIdx,
      }))
    );
  };

  // Start voice listening
  const handleStartListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setVoiceState('listening');
    setShowPipeline(true);
    updatePipelineSteps(0);

    const started = SpeechService.startListening(
      language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          handleProcessVoiceInput(text);
        }
      },
      (error) => {
        setErrorMessage(error);
        setVoiceState('idle');
        setShowPipeline(false);
      },
      () => {
        // onEnd
        if (voiceState === 'listening' && !transcript) {
          setVoiceState('idle');
          setShowPipeline(false);
        }
      }
    );

    if (!started) {
      setVoiceState('idle');
      setShowPipeline(false);
    }
  };

  // Stop listening manually
  const handleStopListening = () => {
    SpeechService.stopListening();
    if (transcript.trim()) {
      handleProcessVoiceInput(transcript);
    } else {
      setVoiceState('idle');
      setShowPipeline(false);
    }
  };

  // Process the spoken or typed inquiry through Uzhavan Kural pipeline
  const handleProcessVoiceInput = async (inputText: string) => {
    const question = inputText.trim();
    if (!question) {
      setVoiceState('idle');
      setShowPipeline(false);
      return;
    }

    setVoiceState('processing');
    updatePipelineSteps(1);

    // Add farmer question to message history immediately
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'farmer',
      text: question,
      language,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    // Simulate pipeline step visual milestones
    setTimeout(() => {
      updatePipelineSteps(2);
      setVoiceState('thinking');
    }, 450);

    setTimeout(() => {
      updatePipelineSteps(3);
    }, 850);

    setTimeout(() => {
      updatePipelineSteps(4);
    }, 1250);

    const isWeatherQuery = /மழை|வானிலை|rain|weather|தண்ணீர்/i.test(question);
    const isMarketQuery = /விலை|price|சந்தை|market|மண்டி/i.test(question);

    try {
      const result = await ApiClient.sendChatMessage({
        message: question,
        conversationHistory: activeConversation,
        farmerProfile,
        weatherContext: weatherData,
        marketContext: { crop: farmerProfile.mainCrop, district: farmerProfile.district },
        language,
        isDemo: isDemoMode,
      });

      updatePipelineSteps(5);
      setVoiceState('answer');

      const isDemoWeather = isWeatherQuery && (!weatherData?.isLive || weatherData?.isDemo);
      const isDemoMarket = isMarketQuery;

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: result.response,
        structuredAdvice: result.structuredAdvice,
        sourcesRetrieved: result.sourcesRetrieved,
        language: (result as any).detectedLanguage || language,
        timestamp: new Date().toISOString(),
        isDemoData: isDemoWeather || isDemoMarket,
        demoDataType: isDemoWeather ? 'weather' : isDemoMarket ? 'market' : undefined,
      };

      addMessage(assistantMsg);

      // Auto-read response aloud using Tamil TTS voice
      const speechSummary = result.audioText || `${result.response}. ${result.structuredAdvice?.immediateSteps?.slice(0, 2).join('. ') || ''}`;
      SpeechService.speak(
        speechSummary,
        language,
        () => setSpeakingMessageId(assistantMsg.id),
        () => setSpeakingMessageId(null)
      );

      // Hide pipeline panel after brief display
      setTimeout(() => setShowPipeline(false), 2500);
    } catch (err: any) {
      console.error('Advisory failed:', err);
      setErrorMessage('AI சேவை தற்காலிகமாக இணைக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      setVoiceState('idle');
      setShowPipeline(false);
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      SpeechService.stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      SpeechService.speak(
        text,
        language,
        () => setSpeakingMessageId(msgId),
        () => setSpeakingMessageId(null)
      );
    }
  };

  const handleSaveAdvice = (msg: ChatMessage) => {
    const prevUserMsg = activeConversation.find(
      (m, idx) => m.sender === 'farmer' && activeConversation[idx + 1]?.id === msg.id
    );

    saveAdvice({
      question: prevUserMsg?.text || 'விவசாய ஆலோசனை',
      rawText: msg.text,
      advice: msg.structuredAdvice || msg.text,
      crop: farmerProfile.mainCrop,
      language,
      category: 'general',
    });

    setSaveSuccessMsg(t.savedSuccess);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const cleanFarmerName = farmerProfile.name?.replace(/\(.*?\)/g, '').trim() || 'ரவி';
  const greetingName = /ravi/i.test(farmerProfile.name) || /ரவி/.test(farmerProfile.name) ? 'ரவி' : cleanFarmerName;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-24 min-h-[calc(100vh-64px)] flex flex-col justify-between">
      {/* Header Context Bar with Demo Greeting */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
            <span>வணக்கம் {greetingName} 👋</span>
          </h2>
          <p className="text-sm font-bold text-emerald-800 mt-1">
            உங்கள் விவசாயத்திற்கு என்ன உதவி வேண்டும்?
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 text-emerald-900 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {farmerProfile.district}, {farmerProfile.state}
            </span>
            <span>•</span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {farmerProfile.mainCrop} ({farmerProfile.farmSizeAcres} {t.acres})
            </span>
          </div>
        </div>

        {weatherData && (
          <div
            onClick={() => setCurrentScreen('weather')}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border cursor-pointer transition ${
              weatherData.isDemo
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            }`}
          >
            <CloudSun className="w-6 h-6 text-amber-500" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold block leading-tight">
                  {weatherData.temperature}°C
                </span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${weatherData.isDemo ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
                  {weatherData.isDemo ? 'DEMO WEATHER' : 'LIVE'}
                </span>
              </div>
              <span className="text-[10px] font-medium opacity-80 block truncate max-w-[110px]">
                {weatherData.condition}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 space-y-4 mb-4">
        {activeConversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'farmer' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Farmer Question */}
            {msg.sender === 'farmer' ? (
              <div className="max-w-[90%] sm:max-w-xl bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-3xl rounded-tr-none px-5 py-3.5 shadow-md border border-emerald-600">
                <div className="flex items-center gap-1.5 mb-1 text-emerald-200 text-xs font-bold">
                  <Mic className="w-3.5 h-3.5 text-amber-300" />
                  <span>🎙 நீங்கள் கேட்டது:</span>
                </div>
                <p className="text-sm sm:text-base font-semibold leading-relaxed font-serif">
                  "{msg.text}"
                </p>
              </div>
            ) : (
              /* Uzhavan Kural Structured Response */
              <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-200/80 animate-in fade-in slide-in-from-bottom-2">
                {/* Assistant Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-base shadow">
                      🌾
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 font-serif">
                        உழவன் குரல் ஆலோசனை
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Gemini 3.8 Flash • உழவன் வேளாண் நுண்ணறிவு
                      </span>
                    </div>
                  </div>

                  {/* Audio read button with exact label requested: 🔊 கேளுங்கள் */}
                  <button
                    onClick={() => handleSpeakText(msg.id, msg.text + '. ' + (msg.structuredAdvice?.immediateSteps?.join('. ') || ''))}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      speakingMessageId === msg.id
                        ? 'bg-amber-500 text-slate-900 animate-pulse'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    {speakingMessageId === msg.id ? (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-900" />
                        <span>⏹️ நிறுத்து</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-700" />
                        <span>🔊 கேளுங்கள்</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Clear DEMO DATA transparency notices if live API unavailable */}
                {msg.isDemoData && msg.demoDataType === 'weather' && (
                  <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse mt-0.5 shrink-0"></span>
                    <div>
                      <strong className="block font-black text-amber-900 tracking-wide text-xs">
                        🟡 DEMO WEATHER DATA
                      </strong>
                      <span className="text-[11px] text-amber-900/90 font-medium">
                        நேரலை வானிலை API சாவி இல்லாததால் கரூர் பகுதிக்கான மாதிரி வானிலை முன்னறிவிப்பு அடிப்படையில் இந்த ஆலோசனை வழங்கப்பட்டுள்ளது.
                      </span>
                    </div>
                  </div>
                )}

                {msg.isDemoData && msg.demoDataType === 'market' && (
                  <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse mt-0.5 shrink-0"></span>
                    <div>
                      <strong className="block font-black text-amber-900 tracking-wide text-xs">
                        🟡 DEMO MARKET DATA
                      </strong>
                      <span className="text-[11px] text-amber-900/90 font-medium">
                        நேரலை Agmarknet API சாவி இல்லாததால் மாதிரி மண்டி விலைகளின் அடிப்படையில் இந்த தகவல் வழங்கப்பட்டுள்ளது.
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary narrative */}
                <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed font-serif">
                  {msg.text}
                </p>

                {/* Exact 4 Required Structured Sections */}
                {msg.structuredAdvice && (
                  <div className="mt-4 space-y-3">
                    {/* 1. 🌾 சாத்தியமான காரணங்கள் */}
                    {msg.structuredAdvice.possibleCauses && msg.structuredAdvice.possibleCauses.length > 0 && (
                      <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200">
                        <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span>🌾 சாத்தியமான காரணங்கள்</span>
                        </h5>
                        <ul className="text-xs sm:text-sm text-amber-950 space-y-1.5 list-disc pl-4 font-medium">
                          {msg.structuredAdvice.possibleCauses.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. 💧 இப்போது என்ன செய்யலாம் */}
                    {msg.structuredAdvice.immediateSteps && msg.structuredAdvice.immediateSteps.length > 0 && (
                      <div className="bg-emerald-50/80 rounded-2xl p-3.5 border border-emerald-200">
                        <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span>💧 இப்போது என்ன செய்யலாம்</span>
                        </h5>
                        <ul className="text-xs sm:text-sm text-emerald-950 space-y-1.5 font-medium">
                          {msg.structuredAdvice.immediateSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-bold text-emerald-700 shrink-0">✓</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. 🔎 என்ன கவனிக்க வேண்டும் */}
                    {msg.structuredAdvice.whatToMonitor && msg.structuredAdvice.whatToMonitor.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs sm:text-sm text-slate-800">
                        <h5 className="text-slate-900 block mb-1.5 font-bold text-xs uppercase flex items-center gap-1.5">
                          <span>🔎 என்ன கவனிக்க வேண்டும்:</span>
                        </h5>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                          {msg.structuredAdvice.whatToMonitor.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 4. 👨‍🌾 எப்போது நிபுணரை அணுக வேண்டும் */}
                    {msg.structuredAdvice.whenToSeekExpert && (
                      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950">
                        <h5 className="text-blue-900 block mb-1 font-bold text-xs flex items-center gap-1.5">
                          <span>👨‍🌾 எப்போது நிபுணரை அணுக வேண்டும்:</span>
                        </h5>
                        <p className="font-medium">{msg.structuredAdvice.whenToSeekExpert}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sources Retrieved Badge */}
                {msg.sourcesRetrieved && msg.sourcesRetrieved.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-800">வேளாண் அறிவுத்தளம்:</span>
                    {msg.sourcesRetrieved.map((src, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700">
                        {src.title || src.source}
                      </span>
                    ))}
                  </div>
                )}

                {/* Response Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSaveAdvice(msg)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.saveAdvice}</span>
                  </button>

                  <button
                    onClick={() => handleStartListening()}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition"
                  >
                    <Mic className="w-3.5 h-3.5 text-amber-600" />
                    <span>தொடர் கேள்வி கேட்க</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Second Demo Scenario Follow-up Prompt Box with Quick Question Buttons */}
        {activeConversation.length > 1 && (
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 rounded-3xl p-4 sm:p-5 border border-emerald-200/90 text-center shadow-sm animate-in fade-in space-y-3">
            <span className="text-sm sm:text-base font-bold text-emerald-950 font-serif block">
              இன்னும் ஏதாவது கேட்க விரும்புகிறீர்களா?
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { text: 'நாளைக்கு மழை வருமா?', label: '🌧 நாளைக்கு மழை வருமா?' },
                { text: 'தண்ணீர் பாய்ச்சலாமா?', label: '💧 தண்ணீர் பாய்ச்சலாமா?' },
                { text: 'நெல் விலை என்ன?', label: '💰 நெல் விலை என்ன?' },
                { text: 'உரம் எப்போது போடலாம்?', label: '🌱 உரம் எப்போது போடலாம்?' },
                { text: 'பூச்சி பிரச்சனை', label: '🐛 பூச்சி பிரச்சனை' },
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessVoiceInput(q.text)}
                  className="bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 hover:border-emerald-500 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
                >
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Execution Display */}
        {showPipeline && (
          <div className="w-full max-w-md mx-auto bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-700/80 shadow-lg animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>உழவன் குரல் நேரலை செயலாக்கம்</span>
              </span>
              <span className="text-[10px] text-emerald-400">Gemini 3.8 Flash RAG</span>
            </div>
            <div className="space-y-1.5 text-xs font-medium">
              {pipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 transition ${
                    step.done
                      ? 'text-emerald-300'
                      : step.active
                      ? 'text-amber-300 font-bold animate-pulse'
                      : 'text-emerald-700/60'
                  }`}
                >
                  <span className="w-4 text-center">
                    {step.done ? '✓' : step.active ? '▶' : '○'}
                  </span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Save Success Notice */}
      {saveSuccessMsg && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] underline font-bold"
          >
            சரி
          </button>
        </div>
      )}

      {/* Quick Questions Horizontal Scroll matching Demo Scenario */}
      <div className="mb-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="font-serif">இன்னும் ஏதாவது கேட்க விரும்புகிறீர்களா? (Quick Demo Questions)</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            1-Click Demo
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessVoiceInput(q.text)}
              className="shrink-0 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-400 rounded-2xl px-3.5 py-2 text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <span>{q.icon}</span>
              <span>{q.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Central Large Microphone Control Area */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100 flex flex-col items-center justify-center text-center">
        {/* 1-Click Live Hackathon Demo Story 1 Trigger */}
        <div className="w-full max-w-md mb-3">
          <button
            onClick={() => handleProcessVoiceInput('என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது. என்ன செய்யலாம்?')}
            className="w-full bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 hover:from-amber-100 hover:to-emerald-100 border border-amber-300 hover:border-emerald-400 rounded-2xl p-2.5 sm:p-3 text-left transition shadow-sm group flex items-center justify-between gap-2"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block flex items-center gap-1">
                <span>⚡ நேரலை டெமோ குரல் சோதனை (Demo Voice Query):</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-950 font-serif line-clamp-1">
                "என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது. என்ன செய்யலாம்?"
              </span>
            </div>
            <span className="shrink-0 bg-emerald-700 group-hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow transition">
              கேட்க (Ask)
            </span>
          </button>
        </div>

        {/* Dynamic status title matching exact voice UX */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
            {voiceState === 'idle' && 'உங்கள் விவசாயத்திற்கு என்ன உதவி வேண்டும்?'}
            {voiceState === 'listening' && 'கேட்கிறேன்...'}
            {voiceState === 'processing' && 'உங்கள் கேள்வியை புரிந்துகொள்கிறேன்...'}
            {voiceState === 'thinking' && 'சிறந்த ஆலோசனையைத் தேடுகிறேன்...'}
            {voiceState === 'answer' && 'இதோ உங்கள் ஆலோசனை...'}
          </h3>
          {transcript && (
            <p className="text-xs text-emerald-800 font-serif italic mt-1 max-w-md mx-auto">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Real-time Waveform */}
        <AudioWaveform state={voiceState} />

        {/* Central Large Mic Button */}
        <div className="relative my-2">
          {/* Animated pulse rings when listening */}
          {voiceState === 'listening' && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-pulse-ring" />
          )}

          <button
            onClick={() => {
              if (voiceState === 'listening') {
                handleStopListening();
              } else {
                handleStartListening();
              }
            }}
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl transform active:scale-95 ${
              voiceState === 'listening'
                ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-900 ring-8 ring-amber-100 shadow-amber-300/60'
                : 'bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white ring-8 ring-emerald-50 shadow-emerald-700/40 hover:scale-105'
            }`}
          >
            {voiceState === 'listening' ? (
              <MicOff className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Mic className="w-10 h-10 text-amber-300" />
            )}
            <span className="text-[11px] font-bold mt-1 text-white">
              {voiceState === 'listening' ? 'நிறுத்து' : t.tapToSpeak}
            </span>
          </button>
        </div>

        {/* Bottom alternative toggle: Type instead */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-300 transition"
          >
            {showTextInput ? 'குரலில் கேட்க (Use Voice)' : t.typeInstead}
          </button>
        </div>

        {/* Inline text input fallback */}
        {showTextInput && (
          <div className="w-full mt-3 flex items-center gap-2 max-w-lg animate-in fade-in">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customText.trim()) {
                  handleProcessVoiceInput(customText);
                  setCustomText('');
                }
              }}
              placeholder={t.typeYourQuestion}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm font-medium outline-none"
            />
            <button
              onClick={() => {
                if (customText.trim()) {
                  handleProcessVoiceInput(customText);
                  setCustomText('');
                }
              }}
              disabled={!customText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow transition"
            >
              <span>{t.send}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
