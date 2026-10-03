import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { SpeechService } from '../services/speechService';
import {
  BookmarkCheck,
  Trash2,
  Volume2,
  VolumeX,
  Share2,
  Calendar,
  Sprout,
  CheckCircle2,
} from 'lucide-react';

export const SavedAdvice: React.FC = () => {
  const { savedAdviceList, removeSavedAdvice, language, setCurrentScreen } = useApp();
  const t = translations[language];

  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (playingId === id) {
      SpeechService.stopSpeaking();
      setPlayingId(null);
    } else {
      SpeechService.speak(
        text,
        language,
        () => setPlayingId(id),
        () => setPlayingId(null)
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
          <span>{t.savedAdvice}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          உங்கள் வயலுக்காக நீங்கள் குறித்து வைத்த முக்கிய விவசாய வழிகாட்டுதல்கள்
        </p>
      </div>

      {savedAdviceList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm text-slate-500">
          <BookmarkCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-800 text-base mb-1">{t.noSavedYet}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            குரல் ஆலோசனையின் போது "சேமிக்க" பொத்தானை அழுத்தி பயனுள்ள உரங்களை இங்கு குறித்து வைக்கலாம்.
          </p>
          <button
            onClick={() => setCurrentScreen('voice')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition"
          >
            ஆலோசனை கேட்க செல்ல
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedAdviceList.map((item) => {
            const adviceText = typeof item.advice === 'string' ? item.advice : item.advice?.summary || item.rawText;
            const steps = typeof item.advice === 'object' && item.advice ? (item.advice as any).immediateSteps : [];

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.crop}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(item.id, adviceText + ' ' + (steps?.join('. ') || ''))}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center gap-1"
                    >
                      {playingId === item.id ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                      <span className="hidden sm:inline">{playingId === item.id ? 'நிறுத்து' : 'கேட்க'}</span>
                    </button>
                    <button
                      onClick={() => removeSavedAdvice(item.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                  ❓ "{item.question}"
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed">
                  {adviceText}
                </p>

                {steps && steps.length > 0 && (
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs">
                    <strong className="text-emerald-900 block font-bold mb-1">
                      ✓ செய்ய வேண்டிய முக்கிய வழிகள்:
                    </strong>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-950">
                      {steps.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
