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
    { num: 1, text: 'Farmer opens Uzhavan Kural', action: () => setCurrentScreen('welcome') },
    { num: 2, text: 'Selects Tamil-first interface (தமிழ்)', action: () => setLanguage('ta') },
    { num: 3, text: 'Location set to Karur, Tamil Nadu', action: () => setFarmerProfile({ ...farmerProfile, district: 'Karur', village: 'Thottiyam' }) },
    { num: 4, text: 'Selects main crop as Paddy (நெல்)', action: () => setFarmerProfile({ ...farmerProfile, mainCrop: 'Paddy' }) },
    { num: 5, text: 'Opens Voice Assistant with Large Microphone', action: () => setCurrentScreen('voice') },
    { num: 6, text: 'Asks: "என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது"', action: () => setCurrentScreen('voice') },
    { num: 7, text: 'Voice converted to text via speech pipeline' },
    { num: 8, text: 'AI detects language (Tamil) and agronomic intent' },
    { num: 9, text: 'RAG retrieves verified TNAU & soil health docs' },
    { num: 10, text: 'Local weather verified (rain check before fertilizer)' },
    { num: 11, text: 'Gemini 3.8 Flash structures actionable advice' },
    { num: 12, text: 'Tamil structured response displayed' },
    { num: 13, text: 'Text-to-speech speaks advice in clear Tamil' },
    { num: 14, text: 'Farmer asks follow-up on water drainage' },
    { num: 15, text: 'Opens Live Mandi Market Prices (சந்தை விலை)', action: () => setCurrentScreen('market') },
    { num: 16, text: 'Opens Agricultural Weather Advisory (வானிலை)', action: () => setCurrentScreen('weather') },
    { num: 17, text: 'Demonstrates Multimodal Crop Health (பயிர் நலம்)', action: () => setCurrentScreen('crop-health') },
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
