import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import {
  Sprout,
  CloudSun,
  Droplets,
  TrendingUp,
  Mic,
  Edit3,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const MyFarm: React.FC = () => {
  const {
    farmerProfile,
    weatherData,
    setCurrentScreen,
    setShowOnboarding,
    language,
  } = useApp();

  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Farm Profile Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/80 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center shadow-md">
              {farmerProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-serif text-white">
                  {farmerProfile.name}
                </h2>
                <span className="text-[11px] bg-emerald-700 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                  சரிபார்க்கப்பட்ட விவசாயி
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {farmerProfile.village ? `${farmerProfile.village}, ` : ''}{farmerProfile.district}, {farmerProfile.state}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOnboarding(true)}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition backdrop-blur-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span>பண்ணை விபரங்களை திருத்த (Edit Farm)</span>
          </button>
        </div>

        {/* Farm Specs Strip */}
        <div className="mt-6 pt-4 border-t border-emerald-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">முதன்மை பயிர்</span>
            <strong className="text-sm font-bold text-amber-300">{farmerProfile.mainCrop}</strong>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">நிலத்தின் அளவு</span>
            <strong className="text-sm font-bold text-white">{farmerProfile.farmSizeAcres} ஏக்கர்</strong>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">மண் வகை</span>
            <strong className="text-xs font-bold text-white truncate block">களிமண் வண்டல்</strong>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">பாசன ஆதாரம்</span>
            <strong className="text-xs font-bold text-white truncate block">கிணறு & வாய்க்கால்</strong>
          </div>
        </div>
      </div>

      {/* 5 Core Feature Action Cards requested in Section 14 */}
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
        பண்ணை மேலாண்மை கருவிகள் (Farm Hub)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Card 1: My Crop */}
        <div
          onClick={() => setCurrentScreen('crop-guide')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
            <span>🌾 என் பயிர் (My Crop)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            {farmerProfile.mainCrop} வளர்ச்சி நிலைகள், உர அட்டவணை மற்றும் நோய் தடுப்பு வழிமுறைகள்.
          </p>
        </div>

        {/* Card 2: Weather */}
        <div
          onClick={() => setCurrentScreen('weather')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <CloudSun className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
            <span>🌦 பண்ணை வானிலை (Weather)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            தற்போதைய வெப்பநிலை: {weatherData?.temperature ?? 29}°C • மழை ஆபத்து: {weatherData?.rainProbability ?? 20}%.
          </p>
        </div>

        {/* Card 3: Irrigation */}
        <div
          onClick={() => setCurrentScreen('weather')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Droplets className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
            <span>💧 பாசன வழிகாட்டல் (Irrigation)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            மண்ணின் ஈரப்பதம் மற்றும் ஆவியாதல் நிலவரப்படி பாசன முடிவுகள் எடுக்க.
          </p>
        </div>

        {/* Card 4: Market */}
        <div
          onClick={() => setCurrentScreen('market')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
            <span>📈 சந்தை விலை (Market)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            {farmerProfile.district} ஒழுங்குமுறை விற்பனைக்கூடம் & உழவர் சந்தை அன்றாட விலைகள்.
          </p>
        </div>

        {/* Card 5: Ask Uzhavan Kural */}
        <div
          onClick={() => setCurrentScreen('voice')}
          className="bg-gradient-to-tr from-emerald-800 to-emerald-700 text-white rounded-2xl p-5 border border-emerald-600 shadow-md hover:shadow-lg transition cursor-pointer group sm:col-span-2 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  🗣 உழவன் குரலிடம் கேளுங்கள் (Ask Uzhavan Kural)
                </h4>
                <span className="text-xs text-emerald-200">24/7 குரல் வழி விவசாய வழிகாட்டி</span>
              </div>
            </div>
            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              உங்கள் நிலத்தில் தோன்றும் எந்தவொரு சந்தேகத்திற்கும் தமிழில் பேசி உடனடி தீர்வு பெறலாம்.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-end text-xs font-bold text-amber-300 group-hover:translate-x-1 transition transform">
            <span>பேசத் தொடங்குங்கள் →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
