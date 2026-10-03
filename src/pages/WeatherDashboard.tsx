import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  AlertCircle,
  Sparkles,
  RefreshCw,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';

export const WeatherDashboard: React.FC = () => {
  const {
    weatherData,
    farmerProfile,
    language,
    refreshWeather,
    setCurrentScreen,
    addMessage,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [activeAdviceTopic, setActiveAdviceTopic] = useState<string | null>(null);
  const [adviceModalText, setAdviceModalText] = useState<{ title: string; content: string } | null>(null);

  const t = translations[language];

  const handleRefresh = async () => {
    setLoading(true);
    await refreshWeather();
    setLoading(false);
  };

  const generateWeatherAdvice = async (topic: 'irrigation' | 'spraying' | 'fertilizer' | 'rain') => {
    setActiveAdviceTopic(topic);

    let prompt = '';
    let title = '';

    if (topic === 'irrigation') {
      title = t.shouldIrrigate;
      prompt = `தற்போது வெப்பநிலை ${weatherData?.temperature || 29}°C, ஈரப்பதம் ${weatherData?.humidity || 65}%, வானிலை ${weatherData?.condition || 'Clear'}. என் ${farmerProfile.mainCrop} பயிருக்கு இன்று தண்ணீர் பாய்ச்சலாமா?`;
    } else if (topic === 'spraying') {
      title = t.canSpray;
      prompt = `தற்போது காற்றின் வேகம் ${weatherData?.windSpeed || 10} km/h, வானிலை ${weatherData?.condition || 'Clear'}. என் ${farmerProfile.mainCrop} பயிருக்கு இன்று பூச்சி மருந்து அல்லது இலைவழி உரம் தெளிக்கலாமா?`;
    } else if (topic === 'fertilizer') {
      title = t.applyFertilizer;
      prompt = `என் ${farmerProfile.mainCrop} பயிருக்கு தற்போது மேலுரம் இடலாமா? அடுத்த 24 மணி நேர வானிலைக்கு ஏற்ப ஆலோசனை தரவும்.`;
    } else {
      title = t.rainRisk;
      prompt = `என் பகுதியில் மழை ஆபத்து உள்ளதா? அறுவடை அல்லது உரம் இடுவதற்கு ஏதேனும் பாதிப்பு ஏற்படுமா?`;
    }

    try {
      const res = await ApiClient.sendChatMessage({
        message: prompt,
        conversationHistory: [],
        farmerProfile,
        weatherContext: weatherData,
        language,
        isDemo: true,
      });

      setAdviceModalText({
        title,
        content: res.response + (res.structuredAdvice?.immediateSteps ? `\n\nவழிமுறை:\n• ` + res.structuredAdvice.immediateSteps.join('\n• ') : ''),
      });
    } catch (e) {
      setAdviceModalText({
        title,
        content: 'வானிலை ஆலோசனை பெற முடியவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து முயற்சிக்கவும்.',
      });
    } finally {
      setActiveAdviceTopic(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
            <span>{t.weatherTitle}</span>
            {weatherData?.isLive ? (
              <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>🟢 LIVE WEATHER</span>
              </span>
            ) : (
              <span className="bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>🟡 DEMO WEATHER</span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{farmerProfile.district}, {farmerProfile.state}</span>
            <span className="text-slate-400">•</span>
            <span>{weatherData?.isLive ? 'OpenWeatherMap நேரலை இணைப்பு' : 'மாதிரி பருவநிலை தரவு (Demonstration Data)'}</span>
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>புதுப்பி (Refresh)</span>
        </button>
      </div>

      {/* Clear Transparency Banner */}
      {!weatherData?.isLive && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-5 text-amber-950 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-amber-900 mb-0.5">🟡 DEMO WEATHER DATA</strong>
            <p>
              நேரலை OpenWeatherMap API சாவி இல்லாததால், கரூர் மாவட்டத்திற்கான மாதிரி விவசாய வானிலை விபரங்கள் காட்டப்படுகின்றன. 
              இந்த மதிப்புகள் மாதிரி மதிப்பீட்டிற்கானவை மட்டுமே; நிஜ நேரலை தரவுகளாக தவறாக கருத வேண்டாம்.
            </p>
          </div>
        </div>
      )}

      {/* Main Weather Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/80 mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Temperature & Condition */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-amber-400/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <CloudSun className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-sans text-white tracking-tight">
                  {weatherData?.temperature ?? 29}
                </span>
                <span className="text-2xl font-bold text-amber-300">°C</span>
              </div>
              <p className="text-sm font-semibold text-emerald-200 mt-0.5">
                {weatherData?.condition || 'Partly Cloudy (பகுதி மேகமூட்டம்)'}
              </p>
              <span className="text-xs text-emerald-300/80">
                உணரப்படுவது: {weatherData?.feelsLike ?? 31}°C
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-emerald-700/80 pt-4 md:pt-0 md:pl-6 text-center">
            <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
              <Droplets className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-300 uppercase block font-semibold">ஈரப்பதம்</span>
              <strong className="text-sm font-bold text-white">{weatherData?.humidity ?? 68}%</strong>
            </div>

            <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
              <Wind className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-300 uppercase block font-semibold">காற்று</span>
              <strong className="text-sm font-bold text-white">{weatherData?.windSpeed ?? 12} km/h</strong>
            </div>

            <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/50">
              <CloudRain className="w-4 h-4 text-amber-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-300 uppercase block font-semibold">மழை வாய்ப்பு</span>
              <strong className="text-sm font-bold text-amber-300">{weatherData?.rainProbability ?? 20}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Agricultural Decision Insights (4 Real Interactive AI Triggers) */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>விவசாய வானிலை முடிவுகள் (Ask AI Weather Guidance)</span>
        </h3>
        <p className="text-xs text-slate-500 -mt-1.5 mb-3">
          வானிலை நிலவரத்தை கொண்டு பயிர் மேலாண்மைக்கான உடனடி ஆலோசனையை பெற அழுத்தவும்:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Decision 1: Irrigate */}
          <button
            onClick={() => generateWeatherAdvice('irrigation')}
            disabled={activeAdviceTopic !== null}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800">
              {t.shouldIrrigate}
            </h4>
            <span className="text-[11px] text-slate-500 mt-1 block">பாசன நேரம் அறிய</span>
          </button>

          {/* Decision 2: Spray */}
          <button
            onClick={() => generateWeatherAdvice('spraying')}
            disabled={activeAdviceTopic !== null}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800">
              {t.canSpray}
            </h4>
            <span className="text-[11px] text-slate-500 mt-1 block">மருந்து தெளிக்க</span>
          </button>

          {/* Decision 3: Fertilizer */}
          <button
            onClick={() => generateWeatherAdvice('fertilizer')}
            disabled={activeAdviceTopic !== null}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Thermometer className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800">
              {t.applyFertilizer}
            </h4>
            <span className="text-[11px] text-slate-500 mt-1 block">மேலுரமிடும் நேரம்</span>
          </button>

          {/* Decision 4: Rain Risk */}
          <button
            onClick={() => generateWeatherAdvice('rain')}
            disabled={activeAdviceTopic !== null}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <CloudRain className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800">
              {t.rainRisk}
            </h4>
            <span className="text-[11px] text-slate-500 mt-1 block">மழை முன்னெச்சரிக்கை</span>
          </button>
        </div>
      </div>

      {/* Weather Advice Modal Dialog */}
      {adviceModalText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-emerald-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{adviceModalText.title}</span>
              </div>
              <button
                onClick={() => setAdviceModalText(null)}
                className="text-xs bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed whitespace-pre-line">
              {adviceModalText.content}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setAdviceModalText(null)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
              >
                புரிந்தது (Understood)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Day Forecast Cards */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>அடுத்த 4 நாட்கள் வானிலை முன்னறிவிப்பு (Forecast)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(weatherData?.forecast || [
            { day: 'இன்று (Today)', date: 'Oct 3', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy' },
            { day: 'நாளை (Tomorrow)', date: 'Oct 4', tempMax: 33, tempMin: 25, condition: 'Scattered Clouds' },
            { day: 'நாள் 3 (Oct 5)', date: 'Oct 5', tempMax: 30, tempMin: 23, condition: 'Light Rain', rainProbability: 65 },
            { day: 'நாள் 4 (Oct 6)', date: 'Oct 6', tempMax: 31, tempMin: 24, condition: 'Sunny' },
          ]).map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center"
            >
              <span className="text-xs font-bold text-slate-800 block truncate">{f.day}</span>
              <span className="text-[10px] text-slate-500 block mb-2">{f.date}</span>
              <CloudSun className="w-7 h-7 text-amber-500 mx-auto my-1" />
              <div className="text-xs font-bold text-slate-900 mt-2">
                <span>{f.tempMax}°</span>
                <span className="text-slate-400 font-normal ml-1">/ {f.tempMin}°</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block truncate mt-0.5">
                {f.condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
