import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FarmerProfile,
  SupportedLanguage,
  ChatMessage,
  ConversationRecord,
  SavedAdviceItem,
  WeatherData,
} from '../types';
import { ApiClient } from '../services/apiClient';

export type ScreenId =
  | 'welcome'
  | 'voice'
  | 'text'
  | 'weather'
  | 'market'
  | 'crop-health'
  | 'crop-guide'
  | 'farm'
  | 'history'
  | 'saved'
  | 'language'
  | 'settings'
  | 'about';

interface AppContextType {
  farmerProfile: FarmerProfile;
  setFarmerProfile: (profile: FarmerProfile) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isOffline: boolean;
  weatherData: WeatherData | null;
  refreshWeather: () => Promise<void>;
  conversations: ConversationRecord[];
  activeConversation: ChatMessage[];
  setActiveConversation: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addMessage: (msg: ChatMessage) => void;
  savedAdviceList: SavedAdviceItem[];
  saveAdvice: (item: Omit<SavedAdviceItem, 'id' | 'date'>) => void;
  removeSavedAdvice: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearHistory: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  showDemoWalkthrough: boolean;
  setShowDemoWalkthrough: (val: boolean) => void;
  speakingMessageId: string | null;
  setSpeakingMessageId: (id: string | null) => void;
  quickAsk: (query: string) => void;
}

const DEFAULT_PROFILE: FarmerProfile = {
  id: 'farmer-default',
  name: 'Yathish',
  village: 'Thottiyam',
  district: 'Karur',
  state: 'Tamil Nadu',
  preferredLanguage: 'ta',
  mainCrop: 'Paddy',
  farmSizeAcres: 2,
  soilType: 'Clay Loam (களிமண் கலந்த வண்டல்)',
  irrigationSource: 'Borewell & River Channel (ஆற்றுப் பாசனம்)',
  locationPermissionGranted: true,
  microphonePermissionGranted: true,
  createdAt: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profile state with localStorage persistence
  const [farmerProfile, setFarmerProfileState] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('uzhavan_farmer_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('uzhavan_language');
      return (saved as SupportedLanguage) || 'ta';
    } catch {
      return 'ta';
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // default to true so first-time hackathon review has guaranteed rich data
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showDemoWalkthrough, setShowDemoWalkthrough] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Active chat session messages
  const [activeConversation, setActiveConversation] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-initial-welcome',
        sender: 'assistant',
        text: 'வணக்கம்! நான் உழவன் குரல். உங்கள் விவசாயப் பயிர்கள், பூச்சி மேலாண்மை, உரம், பாசனம் அல்லது சந்தை விலை பற்றி என்னிடம் குரலில் அல்லது எழுதி கேட்கலாம்.',
        language: 'ta',
        timestamp: new Date().toISOString(),
        structuredAdvice: {
          summary: 'வணக்கம்! நான் உங்கள் உழவன் குரல் விவசாயத் தோழன்.',
          immediateSteps: [
            'மைக் பொத்தானை அழுத்தி பேசத் தொடங்கலாம்',
            'கீழே உள்ள விரைவு கேள்விகளை தேர்ந்தெடுக்கலாம்',
            'பயிர் இலையின் புகைப்படத்தை பதிவேற்றி நோய் அறியலாம்',
          ],
          whatToMonitor: ['பயிரின் வளர்ச்சி நிலை மற்றும் வானிலை'],
          whenToSeekExpert: 'தேவைப்படும் போது அருகிலுள்ள வேளாண்மை உதவி அலுவலரை அணுகலாம்.',
        },
      },
    ];
  });

  // Conversation history
  const [conversations, setConversations] = useState<ConversationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('uzhavan_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved advice bookmarks
  const [savedAdviceList, setSavedAdviceList] = useState<SavedAdviceItem[]>(() => {
    try {
      const saved = localStorage.getItem('uzhavan_saved_advice');
      return saved ? JSON.parse(saved) : [
        {
          id: 'saved-sample-1',
          question: 'என் நெல் வயலில் இலைகள் மஞ்சளாக மாறுது. என்ன செய்யலாம்?',
          rawText: 'தழைச்சத்து பற்றாக்குறை அல்லது நீர் தேக்கத்தால் மஞ்சள் நிறமாகலாம். தண்ணீரை 2-3 நாட்கள் வடிய வைத்து, 1% யூரியா அல்லது 3% பஞ்சகாவ்யா தெளிக்கவும்.',
          advice: {
            summary: 'நெல்லில் இலை மஞ்சள் நிறமாவது தழைச்சத்து பற்றாக்குறை அல்லது அதிக நீர் தேக்கத்தால் ஏற்படலாம்.',
            immediateSteps: ['வயல் தண்ணீரை வடிய வைத்து காற்றோட்டம் தரவும்', '1% யூரியா அல்லது 3% பஞ்சகாவ்யா தெளிக்கவும்'],
            whatToMonitor: ['வேரின் ஆரோக்கியம் மற்றும் இலைகளின் பசுமை'],
            whenToSeekExpert: '3 நாட்களுக்குள் நிறம் மாறாவிட்டால் வேளாண் அலுவலரை அணுகவும்.',
          },
          date: 'Oct 2, 2026',
          crop: 'Paddy',
          language: 'ta',
          category: 'fertilizer',
        }
      ];
    } catch {
      return [];
    }
  });

  // Listen to online / offline network events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync profile & weather on initial load
  useEffect(() => {
    refreshWeather();
  }, [farmerProfile.district]);

  const refreshWeather = async () => {
    try {
      const res = await ApiClient.getWeather(farmerProfile.district || 'Karur');
      if (res.data) {
        setWeatherData(res.data);
      }
    } catch (e) {
      console.warn('Weather fetch failed in context:', e);
    }
  };

  const setFarmerProfile = (profile: FarmerProfile) => {
    setFarmerProfileState(profile);
    try {
      localStorage.setItem('uzhavan_farmer_profile', JSON.stringify(profile));
      fetch('/api/farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('uzhavan_language', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const addMessage = (msg: ChatMessage) => {
    setActiveConversation(prev => {
      const updated = [...prev, msg];
      // Sync to conversation history if assistant replied
      if (msg.sender === 'assistant') {
        const lastUser = prev[prev.length - 1];
        if (lastUser && lastUser.sender === 'farmer') {
          const record: ConversationRecord = {
            id: 'conv-' + Date.now(),
            title: lastUser.text.slice(0, 45) + (lastUser.text.length > 45 ? '...' : ''),
            date: new Date().toLocaleDateString('ta-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            language: msg.language,
            crop: farmerProfile.mainCrop,
            messages: [lastUser, msg],
          };
          setConversations(c => {
            const nextList = [record, ...c.slice(0, 49)];
            try {
              localStorage.setItem('uzhavan_conversations', JSON.stringify(nextList));
              fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: nextList }),
              }).catch(() => {});
            } catch {}
            return nextList;
          });
        }
      }
      return updated;
    });
  };

  const saveAdvice = (item: Omit<SavedAdviceItem, 'id' | 'date'>) => {
    const newItem: SavedAdviceItem = {
      ...item,
      id: 'saved-' + Date.now(),
      date: new Date().toLocaleDateString('ta-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setSavedAdviceList(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('uzhavan_saved_advice', JSON.stringify(updated));
        fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saved: updated }),
        }).catch(() => {});
      } catch {}
      return updated;
    });
  };

  const removeSavedAdvice = (id: string) => {
    setSavedAdviceList(prev => {
      const updated = prev.filter(i => i.id !== id);
      try {
        localStorage.setItem('uzhavan_saved_advice', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('uzhavan_conversations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setConversations([]);
    try {
      localStorage.removeItem('uzhavan_conversations');
    } catch {}
  };

  const quickAsk = (query: string) => {
    setCurrentScreen('voice');
    // will be handled by voice assistant view
  };

  return (
    <AppContext.Provider
      value={{
        farmerProfile,
        setFarmerProfile,
        language,
        setLanguage,
        currentScreen,
        setCurrentScreen,
        isDemoMode,
        setIsDemoMode,
        isOffline,
        weatherData,
        refreshWeather,
        conversations,
        activeConversation,
        setActiveConversation,
        addMessage,
        savedAdviceList,
        saveAdvice,
        removeSavedAdvice,
        deleteConversation,
        clearHistory,
        showOnboarding,
        setShowOnboarding,
        showDemoWalkthrough,
        setShowDemoWalkthrough,
        speakingMessageId,
        setSpeakingMessageId,
        quickAsk,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
