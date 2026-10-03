import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_GUIDE } from '../data/agriculturalKnowledge';
import { CropGuide } from '../types';
import {
  Sprout,
  Droplets,
  Calendar,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ThermometerSun,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const CropAdvisory: React.FC = () => {
  const { farmerProfile, setFarmerProfile, setCurrentScreen, addMessage, language } = useApp();
  const [selectedCropId, setSelectedCropId] = useState<string>('paddy');

  const selectedCrop = CROPS_GUIDE.find((c) => c.id === selectedCropId) || CROPS_GUIDE[0];

  const handleAskAboutCrop = (questionText: string) => {
    setCurrentScreen('voice');
  };

  const handleSetAsMyCrop = (crop: CropGuide) => {
    setFarmerProfile({
      ...farmerProfile,
      mainCrop: crop.name.split(' / ')[0],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
          <span>பயிர் கையேடு & ஆலோசனை (Crop Advisory)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          தமிழ்நாட்டின் முக்கிய பயிர்களின் வளர்ச்சிப் பருவம், பாசன முறை, மற்றும் பொதுவான பிரச்சனைகள்
        </p>
      </div>

      {/* Horizontal Crop Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
        {CROPS_GUIDE.map((crop) => (
          <button
            key={crop.id}
            onClick={() => setSelectedCropId(crop.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 border ${
              selectedCropId === crop.id
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            <span>🌾</span>
            <span>{crop.tamilName}</span>
          </button>
        ))}
      </div>

      {/* Selected Crop Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Crop Stages & Profile */}
        <div className="lg:col-span-8 space-y-4">
          {/* Hero Banner for crop */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider">
                {selectedCrop.category}
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5 font-serif">
                {selectedCrop.tamilName}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                பயிர் காலம்: சுமார் {selectedCrop.growthDurationDays} நாட்கள் • மண்: {selectedCrop.suitableSoils.join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetAsMyCrop(selectedCrop)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-500/60 transition"
              >
                என் முதன்மை பயிராக மாற்று
              </button>
            </div>
          </div>

          {/* Growth Stages Timeline */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>வளர்ச்சிப் பருவங்கள் & பராமரிப்பு (Growth Stages)</span>
            </h4>

            <div className="space-y-3">
              {selectedCrop.stages.map((st, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-emerald-50/50 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-bold text-emerald-950 font-serif">
                      {i + 1}. {st.stageName}
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      {st.durationDays}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 mt-1.5">
                    <div className="flex items-start gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{st.waterRequirement}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{st.keyTasks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Diseases & Remedies */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>பொதுவான நோய்கள் & தடுப்பு முறைகள் (Diseases & Control)</span>
            </h4>

            <div className="space-y-3">
              {selectedCrop.commonDiseases.map((d, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs sm:text-sm font-bold text-amber-950">
                      {d.tamilName}
                    </strong>
                    <span className="text-[10px] text-amber-800">{d.name}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>அறிகுறிகள்:</strong> {d.symptoms}
                  </p>
                  <p className="text-xs text-emerald-900 mt-1 font-medium bg-white/70 p-2 rounded-xl border border-amber-200/50">
                    <strong>தீர்வு:</strong> {d.remedy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Queries & Weather Guidance */}
        <div className="lg:col-span-4 space-y-4">
          {/* Ask AI Suggested Questions */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>இப்பயிர் பற்றி AI-யிடம் கேட்க</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              கீழே உள்ள கேள்விகளில் ஒன்றை தொட்டு உழவன் குரல் நேரலை பதிலை குரலில் கேட்கலாம்:
            </p>

            <div className="space-y-2">
              {selectedCrop.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAboutCrop(q)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-800 transition flex items-center justify-between group"
                >
                  <span className="pr-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Fertilizer & Climate Specs */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                உர பரிந்துரை (NPK Schedule)
              </span>
              <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {selectedCrop.fertilizerSchedule}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                ஏதுவான தட்பவெப்பம் (Ideal Climate)
              </span>
              <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {selectedCrop.idealWeather}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
