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
      <div className="bg-emerald-950 border-b border-emerald-800/60 text-emerald-100 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-semibold text-amber-300">DEMO MODE ACTIVE</span>
          <span className="hidden sm:inline text-emerald-300/80">| Tamil-first agricultural benchmarks & Gemini RAG ready</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded transition font-medium"
          >
            Switch to Live API Mode
          </button>
        </div>
      </div>
    );
  }

  return null;
};
