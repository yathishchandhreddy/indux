import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import {
  Mic,
  Sprout,
  CloudSun,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Volume2,
} from 'lucide-react';

export const WelcomeLanding: React.FC = () => {
  const {
    setCurrentScreen,
    language,
    farmerProfile,
    setShowDemoWalkthrough,
    weatherData,
  } = useApp();
  const t = translations[language];

  return (
    <div className="min-h-[calc(100vh-64px)] pb-16 flex flex-col justify-between">
      {/* Agricultural Sunrise Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Decorative farm dawn illumination */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent" />
        
        {/* Subtle decorative crop silhouettes in SVG */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-15 pointer-events-none flex items-end justify-around">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="text-3xl text-emerald-200">🌾</div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold text-amber-300 mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ungal Vivasayathukku Oru Kural • Your Farm, Your Voice</span>
          </div>

          {/* Main Titles */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif text-white drop-shadow">
            உழவன் குரல்
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-2 font-sans tracking-wide">
            UZHAVAN KURAL
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/90 font-medium mt-1">
            The Voice of the Soil — Your AI-powered agricultural voice companion
          </p>

          <p className="text-base sm:text-lg text-emerald-100 font-medium max-w-2xl mx-auto mt-4 leading-relaxed font-serif">
            "உங்கள் விவசாயத்திற்கு அறிவும் ஆலோசனையும் — உங்கள் குரலில்."
          </p>

          {/* Core Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentScreen('voice')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 font-extrabold text-base shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 border-2 border-amber-300"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <span>{t.startSpeaking} (Start Speaking)</span>
            </button>

            <button
              onClick={() => setShowDemoWalkthrough(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition border border-emerald-600/80 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>{t.exploreFeatures} & Walkthrough</span>
            </button>
          </div>

          {/* Live snapshot strip */}
          <div className="mt-10 max-w-2xl mx-auto bg-emerald-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xl">📍</span>
              <div>
                <span className="font-bold text-white block">
                  {farmerProfile.village}, {farmerProfile.district}
                </span>
                <span className="text-[11px] text-emerald-300">
                  பயிர்: {farmerProfile.mainCrop} ({farmerProfile.farmSizeAcres} ஏக்கர்)
                </span>
              </div>
            </div>
            {weatherData && (
              <div className="flex items-center gap-2 text-right border-l border-emerald-800 pl-4">
                <div>
                  <span className="font-bold text-amber-300 block text-sm">
                    {weatherData.temperature}°C
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    {weatherData.condition}
                  </span>
                </div>
                <CloudSun className="w-6 h-6 text-amber-400" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Voice AI */}
          <div
            onClick={() => setCurrentScreen('voice')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>குரல் வழி ஆலோசனை</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              தமிழில் பேசி நோய், உரம், பூச்சி தாக்குதல் மற்றும் கள ஆலோசனைகளை நொடியில் பெறலாம்.
            </p>
          </div>

          {/* Card 2: Crop Health AI */}
          <div
            onClick={() => setCurrentScreen('crop-health')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>பயிர் நலம் & நோய்</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              இலையின் படத்தை பதிவேற்றி சாத்தியமான காரணங்கள் மற்றும் உடனடி பாதுகாப்பு வழிகளை அறியவும்.
            </p>
          </div>

          {/* Card 3: Mandi Market Prices */}
          <div
            onClick={() => setCurrentScreen('market')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>மண்டி & சந்தை விலை</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              ஒழுங்குமுறை விற்பனைக்கூடம் மற்றும் உழவர் சந்தைகளின் தினசரி விலைகள் & AI சந்தை ஆலோசனை.
            </p>
          </div>

          {/* Card 4: Agricultural Weather */}
          <div
            onClick={() => setCurrentScreen('weather')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>விவசாய வானிலை</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              மழை வாய்ப்பு, பாசன நேரம் மற்றும் உரம்/மருந்து தெளிப்பதற்கான உடனடி வானிலை எச்சரிக்கைகள்.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural Wisdom & Mission Quote */}
      <section className="max-w-4xl mx-auto px-4 mt-10 text-center">
        <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-200/60 shadow-sm">
          <p className="text-base sm:text-lg font-serif font-semibold text-emerald-950 italic">
            "சுழன்றும்ஏர்ப் பின்னது உலகம் அதனால் உழந்தும் உழவே தலை"
          </p>
          <p className="text-xs text-emerald-800 font-medium mt-2 max-w-xl mx-auto">
            (குறள் 1031) பல தொழில்களால் இயங்கினாலும், உலகம் உழவுக்குப் பின்னால்தான் சுற்றுகிறது. எனவே வருந்தி உழைத்தாலும் உழவுத் தொழிலே முதன்மையானது.
          </p>
        </div>
      </section>
    </div>
  );
};
