import React from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import {
  Home,
  Mic,
  Sprout,
  CloudSun,
  TrendingUp,
  MoreHorizontal,
  Activity,
} from 'lucide-react';
import { translations } from '../i18n/translations';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, language } = useApp();
  const t = translations[language];

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; isVoice?: boolean }[] = [
    { id: 'welcome', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'farm', label: t.myFarm, icon: <Sprout className="w-5 h-5" /> },
    {
      id: 'voice',
      label: 'Ask',
      icon: <Mic className="w-6 h-6 text-white" />,
      isVoice: true,
    },
    { id: 'weather', label: t.weather, icon: <CloudSun className="w-5 h-5" /> },
    { id: 'market', label: t.marketPrices, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;

          if (item.isVoice) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen('voice')}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 transform group-active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-500 ring-4 ring-amber-100 shadow-amber-300/50'
                      : 'bg-gradient-to-tr from-emerald-700 to-emerald-600 ring-4 ring-white shadow-emerald-700/30'
                  }`}
                >
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 mt-0.5">
                  குரல் (Ask)
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-emerald-700 font-medium'
              }`}
            >
              <div className={`${isActive ? 'scale-110 transition transform' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
