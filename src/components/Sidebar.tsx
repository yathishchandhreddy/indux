import React from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import { translations } from '../i18n/translations';
import {
  Home,
  Mic,
  MessageSquare,
  Sprout,
  CloudSun,
  TrendingUp,
  Activity,
  Layers,
  History as HistoryIcon,
  BookmarkCheck,
  Settings as SettingsIcon,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, language, farmerProfile } = useApp();
  const t = translations[language];

  const menuItems: { id: ScreenId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'welcome', label: 'முகப்பு (Home)', icon: <Home className="w-5 h-5" /> },
    { id: 'voice', label: t.askUzhavanKural, icon: <Mic className="w-5 h-5 text-amber-500" />, badge: 'Voice AI' },
    { id: 'text', label: 'எழுதி கேட்க (Ask by Text)', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'farm', label: t.myFarm, icon: <Sprout className="w-5 h-5" /> },
    { id: 'crop-health', label: t.cropHealth, icon: <Activity className="w-5 h-5 text-emerald-600" />, badge: 'Photo AI' },
    { id: 'weather', label: t.weather, icon: <CloudSun className="w-5 h-5 text-amber-600" /> },
    { id: 'market', label: t.marketPrices, icon: <TrendingUp className="w-5 h-5 text-blue-600" /> },
    { id: 'crop-guide', label: 'பயிர் கையேடு (Crops)', icon: <Layers className="w-5 h-5" /> },
    { id: 'history', label: t.history, icon: <HistoryIcon className="w-5 h-5" /> },
    { id: 'saved', label: t.savedAdvice, icon: <BookmarkCheck className="w-5 h-5 text-amber-600" /> },
    { id: 'settings', label: t.settings, icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'about', label: t.about, icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-64px)] p-4 shrink-0 shadow-sm">
      {/* Quick Farmer Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-3.5 rounded-2xl border border-emerald-200/70 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow">
            {farmerProfile.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-emerald-950 truncate">{farmerProfile.name}</h4>
            <p className="text-xs text-emerald-700 font-medium truncate">
              {farmerProfile.district} • {farmerProfile.mainCrop}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge ? (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-4 h-4 text-emerald-200" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer agrarian quote */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center font-serif italic">
        "சுழன்றும்ஏர்ப் பின்னது உலகம்"
        <div className="text-[10px] text-slate-400 font-sans not-italic mt-0.5">
          திருக்குறள் • உழவு
        </div>
      </div>
    </aside>
  );
};
