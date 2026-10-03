import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { ApiClient } from '../services/apiClient';
import { SpeechService } from '../services/speechService';
import { ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sprout,
  HelpCircle,
} from 'lucide-react';

export const AskByText: React.FC = () => {
  const {
    farmerProfile,
    language,
    weatherData,
    activeConversation,
    addMessage,
    saveAdvice,
    isDemoMode,
  } = useApp();

  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const quickTopics = [
    'நெல்லில் தண்டு துளைப்பான் தடுப்பது எப்படி?',
    'நாளை மழை வருமா, உரம் இடலாமா?',
    'பஞ்சகாவ்யா தயாரிக்கும் முறை என்ன?',
    'சின்ன வெங்காயம் பெரியதாக வர என்ன உரம் போட வேண்டும்?',
    'வேப்பங்கொட்டை கரைசல் (NSKE 5%) அளவு என்ன?',
  ];

  const handleSend = async (textToSend: string) => {
    const q = textToSend.trim();
    if (!q) return;

    setInputText('');
    setLoading(true);

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'farmer',
      text: q,
      language,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    try {
      const res = await ApiClient.sendChatMessage({
        message: q,
        conversationHistory: activeConversation,
        farmerProfile,
        weatherContext: weatherData,
        language,
        isDemo: isDemoMode,
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: res.response,
        structuredAdvice: res.structuredAdvice,
        sourcesRetrieved: res.sourcesRetrieved,
        language,
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMsg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      SpeechService.stopSpeaking();
      setSpeakingId(null);
    } else {
      SpeechService.speak(
        text,
        language,
        () => setSpeakingId(id),
        () => setSpeakingId(null)
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
          <span>எழுதி கேட்க (Ask by Text)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          உங்கள் விவசாயக் கேள்வியை தட்டச்சு செய்து விரிவான வேளாண் விளக்கம் பெறலாம்
        </p>
      </div>

      {/* Suggested Quick Topics */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {quickTopics.map((qt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qt)}
            className="shrink-0 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition"
          >
            {qt}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4 mb-4">
        {activeConversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'farmer' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'farmer' ? (
              <div className="max-w-[85%] bg-emerald-800 text-white p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm font-medium">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-2xl bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-emerald-900 font-serif">
                    🌾 உழவன் குரல் பதில்
                  </span>
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text + '. ' + (msg.structuredAdvice?.immediateSteps?.join('. ') || ''))}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{speakingId === msg.id ? 'நிறுத்து' : 'கேட்க'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-serif leading-relaxed mb-3">
                  {msg.text}
                </p>

                {msg.structuredAdvice && (
                  <div className="space-y-2 text-xs">
                    {msg.structuredAdvice.immediateSteps && (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <strong className="text-emerald-900 block font-bold mb-1">
                          ✓ இப்போது செய்ய வேண்டியவை:
                        </strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-emerald-950">
                          {msg.structuredAdvice.immediateSteps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="sticky bottom-16 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputText);
          }}
          placeholder="விவசாயக் கேள்வியை தட்டச்சு செய்க..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium outline-none focus:border-emerald-600"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={loading || !inputText.trim()}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition"
        >
          <span>{loading ? 'அனுப்புகிறது...' : t.send}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
