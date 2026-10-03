import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import {
  Sprout,
  ShieldCheck,
  Cpu,
  Globe,
  HeartHandshake,
  BookOpen,
  Volume2,
  CheckCircle2,
} from 'lucide-react';

export const AboutUzhavanKural: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/80 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 mx-auto flex items-center justify-center font-bold text-3xl shadow mb-3">
          🌾
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
          உழவன் குரல்
        </h2>
        <h3 className="text-lg font-bold text-amber-300 font-sans tracking-wide mt-1">
          UZHAVAN KURAL — The Voice of the Soil
        </h3>
        <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-xl mx-auto font-serif">
          "உங்கள் விவசாயத்திற்கு ஒரு குரல் — உங்கள் தோழன்"
        </p>
      </div>

      {/* Thirukkural Couplet Section */}
      <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 text-center">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
          திருக்குறள் • உழவு (அதிகாரம் 104)
        </span>
        <blockquote className="text-base sm:text-lg font-serif font-bold text-emerald-950 italic mt-1">
          "சுழன்றும்ஏர்ப் பின்னது உலகம் அதனால்<br />உழந்தும் உழவே தலை"
        </blockquote>
        <p className="text-xs text-emerald-800 mt-2 max-w-lg mx-auto">
          விளக்கம்: உலகம் பல்வேறு தொழில்களால் இயங்கினாலும் உழவுத் தொழிலின் பின்னால்தான் சுற்றுகிறது; ஆகவே, எத்துணை வருத்தம் இருப்பினும் உழவுத் தொழிலே முதன்மையானது.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
          <span>எங்கள் நோக்கம் (Our Mission)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
          இந்திய விவசாயிகள், குறிப்பாக தமிழ்நாட்டு விவசாயிகள், எதிர்கொள்ளும் மொழித் தடைகள், வானிலை நிச்சயமற்ற தன்மை, பூச்சி மேலாண்மை குழப்பங்கள், மற்றும் சந்தை விலை அறியாமை ஆகியவற்றை அகற்றுவதே உழவன் குரலின் முதன்மை நோக்கம்.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
          விவசாயிகள் நீண்ட படிவங்களை நிரப்பவோ ஆங்கிலத்தில் தட்டச்சு செய்யவோ தேவையில்லை; தங்கள் இயல்பான தாய்மொழியான தமிழில் பேசினால் போதும் — செயற்கை நுண்ணறிவு உடனடியாக மண்ணின் குரலாக பதில் அளிக்கும்.
        </p>
      </div>

      {/* 4 Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Voice-First Experience</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            குரல் வழி பதிவு, தமிழ் பேச்சுணர்தல் (STT) மற்றும் மென்மையான பேச்சு வெளியீடு (TTS) வழியே கிராமப்புற விவசாயிகள் எளிதாக பயன்படுத்தலாம்.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Gemini 3.8 Flash + RAG</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            TNAU மற்றும் அதிகாரப்பூர்வ வேளாண் அறிவுத்தளங்களுடன் இணைக்கப்பட்ட கூகுள் ஜெமினி மாதிரியானது துல்லியமான, பாதுகாப்பான ஆலோசனைகளை வழங்குகிறது.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">பாதுகாப்பு & இயற்கை தீர்வுகள்</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            தன்னிச்சையான தவறான முடிவுகளைத் தவிர்த்து, பஞ்சகாவ்யா, வேப்பங்கொட்டை கரைசல் போன்ற இயற்கை பாதுகாப்பு முறைகளை முன்னிலைப்படுத்துகிறது.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">ஆஃப்லைன் தயார்நிலை (PWA)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            கிராமப்புறங்களில் இணையம் துண்டிக்கப்பட்டாலும் முந்தைய வரலாறு, வானிலை மற்றும் சேமித்த ஆலோசனைகளை காணும் திறன்.
          </p>
        </div>
      </div>
    </div>
  );
};
