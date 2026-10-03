import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { SupportedLanguage } from '../types';
import { SpeechService } from '../services/speechService';
import { Globe, Volume2, CheckCircle2 } from 'lucide-react';

export const LanguageSettings: React.FC = () => {
  const { language, setLanguage } = useApp();
  const t = translations[language];

  const langs: {
    code: SupportedLanguage;
    name: string;
    tamilName: string;
    greeting: string;
    description: string;
  }[] = [
    {
      code: 'ta',
      name: 'தமிழ் (Tamil)',
      tamilName: 'தமிழ் - தாய்மொழி & முதன்மை மொழி',
      greeting: 'வணக்கம்! உழவன் குரலுக்கு உங்களை அன்போடு வரவேற்கிறோம்.',
      description: 'முழுமையான தமிழ் குரல் மற்றும் உரை அனுபவம்.',
    },
    {
      code: 'en',
      name: 'English',
      tamilName: 'ஆங்கிலம் (English)',
      greeting: 'Vanakkam! Welcome to Uzhavan Kural, your voice of the soil.',
      description: 'English voice, advisory texts and prompts.',
    },
    {
      code: 'hi',
      name: 'हिन्दी (Hindi)',
      tamilName: 'இந்தி (Hindi)',
      greeting: 'नमस्ते! उड़वन कुरल में आपका स्वागत है।',
      description: 'कृषि सलाह और आवाज समर्थन।',
    },
    {
      code: 'te',
      name: 'తెలుగు (Telugu)',
      tamilName: 'தெலுங்கு (Telugu)',
      greeting: 'నమస్కారం! ఉళవన్ కురల్ కు స్వాగతం.',
      description: 'వ్యవసాయ సలహాలు మరియు గొంతు మద్దతు.',
    },
    {
      code: 'kn',
      name: 'ಕನ್ನಡ (Kannada)',
      tamilName: 'கன்னடம் (Kannada)',
      greeting: 'ನಮಸ್ಕಾರ! ಉಳವನ್ ಕುರಲ್ ಗೆ ಸ್ವಾಗತ.',
      description: 'ಕೃಷಿ ಸಲಹೆ ಮತ್ತು ಧ್ವನಿ ಬೆಂಬಲ.',
    },
    {
      code: 'ml',
      name: 'മലയാളം (Malayalam)',
      tamilName: 'மலையாளம் (Malayalam)',
      greeting: 'നമസ്കാരം! ഉഴവൻ കുരലിലേക്ക് സ്വാഗതം.',
      description: 'കാർഷിക ഉപദേശങ്ങളും ശബ്ദ സഹായവും.',
    },
  ];

  const handleTestVoice = (langCode: SupportedLanguage, text: string) => {
    SpeechService.speak(text, langCode);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
          <Globe className="w-6 h-6 text-emerald-700" />
          <span>{t.languageSettings} (Select Language)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும். குரல் மற்றும் திரைப் பதில்கள் இந்த மொழியிலேயே தோன்றும்.
        </p>
      </div>

      <div className="space-y-3">
        {langs.map((l) => {
          const isSelected = language === l.code;
          return (
            <div
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-600 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-emerald-700 text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{l.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{l.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestVoice(l.code, l.greeting);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 text-xs font-bold transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>குரல் சோதனை (Listen)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
