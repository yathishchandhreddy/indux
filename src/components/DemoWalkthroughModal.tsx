import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Volume2,
  CloudSun,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const DemoWalkthroughModal: React.FC = () => {
  const {
    showDemoWalkthrough,
    setShowDemoWalkthrough,
    setCurrentScreen,
    setLanguage,
    setFarmerProfile,
    farmerProfile,
  } = useApp();

  if (!showDemoWalkthrough) return null;

  const demoSteps = [
    { num: 1, text: 'Open Uzhavan Kural (உழவன் குரல்)', action: () => setCurrentScreen('welcome') },
    { num: 2, text: 'Farmer Profile: ரவி (Ravi), Karur Tamil Nadu, Paddy, 2 acres, Tamil', action: () => setFarmerProfile({ ...farmerProfile, name: 'ரவி (Ravi)', district: 'Karur', village: 'தொட்டியம் (Thottiyam)', mainCrop: 'Paddy', farmSizeAcres: 2, preferredLanguage: 'ta' }) },
    { num: 3, text: 'Go to Voice Assistant: "வணக்கம் ரவி 👋" & Large Mic', action: () => setCurrentScreen('voice') },
    { num: 4, text: 'Farmer speaks: "என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது. என்ன செய்யலாம்?"', action: () => setCurrentScreen('voice') },
    { num: 5, text: 'Speech-to-text displays: 🎙 நீங்கள் கேட்டது: "என் நெல் வயலில்..."' },
    { num: 6, text: 'Gemini answers with 4 sections: 🌾 காரணங்கள், 💧 இப்போது செய்யலாம், 🔎 கவனிக்க, 👨‍🌾 நிபுணர்' },
    { num: 7, text: 'Click "🔊 கேளுங்கள்" to hear Tamil speech aloud via browser SpeechSynthesis' },
    { num: 8, text: 'Second scenario: "இன்னும் ஏதாவது கேட்க விரும்புகிறீர்களா?" → "நாளைக்கு மழை வருமா?"', action: () => setCurrentScreen('voice') },
    { num: 9, text: 'Weather guidance: 🟢 LIVE WEATHER or 🟡 DEMO WEATHER with agricultural rain impact', action: () => setCurrentScreen('weather') },
    { num: 10, text: 'Market Demo: 🌾 Paddy | 📍 Tamil Nadu | 🏪 Demo Market with "இந்த விலையில் நான் என்ன செய்யலாம்?"', action: () => setCurrentScreen('market') },
    { num: 11, text: 'Crop Health Diagnosis: Camera / leaf upload with multimodal Gemini vision', action: () => setCurrentScreen('crop-health') },
    { num: 12, text: 'Settings: 🟢 DEMO MODE toggle & Demo Control status for judges', action: () => setCurrentScreen('settings') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-emerald-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Hackathon 17-Step Demo Walkthrough</h3>
              <p className="text-xs text-emerald-200">
                Uzhavan Kural end-to-end voice-first agricultural workflow
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDemoWalkthrough(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700/80 text-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Quick Hackathon Evaluation:</strong> You can click any step below to instantly jump to that screen or preset. Uzhavan Kural integrates <strong>Gemini 3.8 Flash</strong>, RAG knowledge documents, real-time speech synthesis/recognition, OpenWeatherMap, and Agmarknet mandi benchmarks.
            </div>
          </div>

          <div className="space-y-2">
            {demoSteps.map((step) => (
              <div
                key={step.num}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {step.text}
                  </span>
                </div>
                {step.action && (
                  <button
                    onClick={() => {
                      step.action?.();
                      setShowDemoWalkthrough(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Language: Tamil (தமிழ்) • Primary Crop: Paddy
          </span>
          <button
            onClick={() => {
              setCurrentScreen('voice');
              setShowDemoWalkthrough(false);
            }}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow transition"
          >
            <Play className="w-4 h-4" />
            <span>Launch Voice Assistant Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
