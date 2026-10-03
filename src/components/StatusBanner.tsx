import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { translations } from '../i18n/translations';

export const StatusBanner: React.FC = () => {
  const { isOffline, isDemoMode, setIsDemoMode, language } = useApp();
  const t = translations[language];

  if (isOffline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>{t.offlineNotice}: {t.offlineDesc}</span>
        </div>
        <span className="text-[11px] bg-amber-800/80 px-2 py-0.5 rounded font-mono">OFFLINE</span>
      </div>
    );
  }

  if (isDemoMode) {
    return (
      <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-100 px-4 py-2 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-black text-amber-300 bg-emerald-900/90 border border-emerald-700 px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 DEMO MODE</span>
          </span>
          <span className="hidden sm:inline text-emerald-200">
            Gemini 3.8 Flash AI • Browser Voice (Web Speech) • Demo Agromet & Mandi Data
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl transition border border-emerald-600"
          >
            Switch to Live API Mode
          </button>
        </div>
      </div>
    );
  }

  return null;
};
