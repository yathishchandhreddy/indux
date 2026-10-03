import React, { useState } from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { SupportedLanguage } from '../types';
import {
  Sprout,
  Globe,
  HelpCircle,
  User,
  CloudSun,
  Menu,
  X,
  Volume2,
  BookmarkCheck,
  History as HistoryIcon,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    farmerProfile,
    language,
    setLanguage,
    currentScreen,
    setCurrentScreen,
    weatherData,
    isDemoMode,
    setIsDemoMode,
    setShowDemoWalkthrough,
    setShowOnboarding,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[language];

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  ];

  const handleNav = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleNav('welcome')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition transform">
              <Sprout className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  உழவன் குரல்
                </span>
                <span className="hidden sm:inline-block text-xs bg-emerald-800 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-700">
                  Uzhavan Kural
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 -mt-0.5 truncate max-w-[200px] sm:max-w-none">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Greeting & Contextual Weather */}
          <div className="hidden md:flex items-center gap-4 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-800/80">
            <div className="text-left">
              <span className="text-xs text-emerald-300 font-medium block">
                {t.vanakkam}, <strong className="text-white font-semibold">{farmerProfile.name}</strong>
              </span>
              <span className="text-[11px] text-emerald-400">
                {farmerProfile.village ? `${farmerProfile.village}, ` : ''}{farmerProfile.district} • {farmerProfile.mainCrop}
              </span>
            </div>
            {weatherData && (
              <div
                onClick={() => handleNav('weather')}
                className="flex items-center gap-1.5 pl-3 border-l border-emerald-800 cursor-pointer hover:text-amber-300 transition"
                title="View detailed weather"
              >
                <CloudSun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-amber-200">{weatherData.temperature}°C</span>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Demo Walkthrough Button */}
            <button
              onClick={() => setShowDemoWalkthrough(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm transition transform hover:-translate-y-0.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">Demo Walkthrough</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-emerald-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                <span className="uppercase font-semibold">{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.selectLanguage}
                  </div>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                        language === l.code ? 'bg-emerald-100/70 font-bold text-emerald-800' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] text-slate-400">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Farmer Profile quick trigger */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700 transition"
              title="Edit Farm Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-emerald-800 text-emerald-100 hover:bg-emerald-700 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800 px-4 py-3 space-y-2">
          <div className="pb-2 border-b border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
            <span>
              {farmerProfile.name} • {farmerProfile.district} ({farmerProfile.mainCrop})
            </span>
            {weatherData && (
              <span className="font-bold text-amber-300">{weatherData.temperature}°C {weatherData.condition}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <button
              onClick={() => handleNav('voice')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'voice' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{t.askUzhavanKural}</span>
            </button>
            <button
              onClick={() => handleNav('crop-health')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'crop-health' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>{t.cropHealth}</span>
            </button>
            <button
              onClick={() => handleNav('weather')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'weather' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>{t.weather}</span>
            </button>
            <button
              onClick={() => handleNav('market')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'market' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>{t.marketPrices}</span>
            </button>
            <button
              onClick={() => handleNav('farm')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'farm' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>{t.myFarm}</span>
            </button>
            <button
              onClick={() => handleNav('crop-guide')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'crop-guide' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>பயிர் கையேடு (Crops)</span>
            </button>
            <button
              onClick={() => handleNav('saved')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'saved' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>{t.savedAdvice}</span>
            </button>
            <button
              onClick={() => handleNav('history')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                currentScreen === 'history' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-900 text-emerald-100'
              }`}
            >
              <HistoryIcon className="w-4 h-4 text-emerald-300" />
              <span>{t.history}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
