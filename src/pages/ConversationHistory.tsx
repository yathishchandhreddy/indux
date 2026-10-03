import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { ConversationRecord } from '../types';
import {
  History as HistoryIcon,
  Trash2,
  ExternalLink,
  Bookmark,
  Calendar,
  Sprout,
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export const ConversationHistory: React.FC = () => {
  const {
    conversations,
    deleteConversation,
    clearHistory,
    setActiveConversation,
    setCurrentScreen,
    saveAdvice,
    farmerProfile,
    language,
  } = useApp();

  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenConversation = (conv: ConversationRecord) => {
    setActiveConversation(conv.messages);
    setCurrentScreen('voice');
  };

  const handleSaveFromHistory = (conv: ConversationRecord) => {
    const assistantMsg = conv.messages.find((m) => m.sender === 'assistant');
    if (assistantMsg) {
      saveAdvice({
        question: conv.title,
        rawText: assistantMsg.text,
        advice: assistantMsg.structuredAdvice || assistantMsg.text,
        crop: conv.crop,
        language: conv.language,
        category: 'general',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
            <span>{t.history}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            உங்களின் முந்தைய குரல் மற்றும் உரை உரையாடல்களின் பதிவு
          </p>
        </div>

        {conversations.length > 0 && (
          <button
            onClick={clearHistory}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>அனைத்தையும் நீக்கு (Clear All)</span>
          </button>
        )}
      </div>

      {/* Search Filter */}
      {conversations.length > 0 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="வரலாற்றில் தேடுக..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium outline-none focus:border-emerald-600 bg-white"
          />
        </div>
      )}

      {/* Conversation List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm text-slate-500">
          <HistoryIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-800 text-base mb-1">{t.noHistoryYet}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            குரலில் அல்லது தட்டச்சு செய்து உங்கள் விவசாய கேள்விகளை கேட்கலாம்.
          </p>
          <button
            onClick={() => setCurrentScreen('voice')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition"
          >
            குரலில் பேசத் தொடங்குங்கள்
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {conv.crop}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{conv.date}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">
                  "{conv.title}"
                </h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleSaveFromHistory(conv)}
                  title="Bookmark Advice"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenConversation(conv)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200"
                >
                  <span>திறக்க (Open)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteConversation(conv.id)}
                  title="Delete"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
