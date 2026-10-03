import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { MarketPriceRecord } from '../types';
import { ApiClient } from '../services/apiClient';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  Calendar,
  Filter,
  ArrowRight,
  Info,
  DollarSign,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const MarketPrices: React.FC = () => {
  const { farmerProfile, language, setCurrentScreen, addMessage } = useApp();
  const t = translations[language];

  const [prices, setPrices] = useState<MarketPriceRecord[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [sourceNotice, setSourceNotice] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [marketAdviceModal, setMarketAdviceModal] = useState<string | null>(null);
  const [analyzingMarket, setAnalyzingMarket] = useState<boolean>(false);

  const crops = [
    { id: 'all', label: 'அனைத்து பயிர்கள் (All Crops)' },
    { id: 'Paddy', label: 'Paddy (நெல்)' },
    { id: 'Sugarcane', label: 'Sugarcane (கரும்பு)' },
    { id: 'Banana', label: 'Banana (வாழை)' },
    { id: 'Cotton', label: 'Cotton (பருத்தி)' },
    { id: 'Groundnut', label: 'Groundnut (நிலக்கடலை)' },
    { id: 'Maize', label: 'Maize (மக்காச்சோளம்)' },
    { id: 'Tomato', label: 'Tomato (தக்காளி)' },
    { id: 'Onion', label: 'Onion (சின்ன வெங்காயம்)' },
    { id: 'Chilli', label: 'Chilli (மிளகாய்)' },
    { id: 'Coconut', label: 'Coconut (தென்னை)' },
  ];

  const districts = [
    { id: 'all', label: 'அனைத்து மாவட்டங்கள் (All Districts)' },
    { id: 'Karur', label: 'Karur (கரூர்)' },
    { id: 'Thanjavur', label: 'Thanjavur (தஞ்சாவூர்)' },
    { id: 'Dindigul', label: 'Dindigul (திண்டுக்கல்)' },
    { id: 'Erode', label: 'Erode (ஈரோடு)' },
    { id: 'Madurai', label: 'Madurai (மதுரை)' },
    { id: 'Salem', label: 'Salem (சேலம்)' },
    { id: 'Chennai', label: 'Chennai (கோயம்பேடு)' },
    { id: 'Coimbatore', label: 'Coimbatore (பொள்ளாச்சி)' },
    { id: 'Ramanathapuram', label: 'Ramanathapuram (பரமக்குடி)' },
    { id: 'Perambalur', label: 'Perambalur (பெரம்பலூர்)' },
  ];

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedDistrict]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getMarketPrices(selectedCrop, selectedDistrict);
      setPrices(res.data);
      setSourceNotice(res.sourceNotice);
      setIsConfigured(res.configured);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAIMarket = async (record?: MarketPriceRecord, customPrompt?: string) => {
    setAnalyzingMarket(true);
    const targetCrop = record ? record.crop : farmerProfile.mainCrop;
    const targetMkt = record ? record.marketName : 'Demo Market (மாதிரி சந்தை)';

    const question = customPrompt || `இந்த மாதிரி சந்தை விலையில் (சராசரி ₹${record?.modalPrice || 2480}/குவிண்டால்) நான் என்ன செய்யலாம்? சந்தை விலை வாய்ப்புகளை எவ்வாறு அணுகுவது என விளக்கவும். (இது மாதிரி சந்தை விலை என்பதால் நிஜ நேரலை விலையாக தவறாக கருதக் கூடாது என தெளிவுபடுத்தவும்).`;

    try {
      const res = await ApiClient.sendChatMessage({
        message: question,
        conversationHistory: [],
        farmerProfile,
        marketContext: record || prices[0],
        language,
        isDemo: true,
      });

      setMarketAdviceModal(res.response + (res.structuredAdvice?.immediateSteps ? `\n\nசந்தை விற்பனை வழிகாட்டல்:\n• ` + res.structuredAdvice.immediateSteps.join('\n• ') : ''));
    } catch (e) {
      setMarketAdviceModal('சந்தை AI ஆலோசனை தற்போது பெற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setAnalyzingMarket(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
            <span>{t.marketTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ஒழுங்குமுறை விற்பனைக்கூடம் & உழவர் சந்தைகளின் தினசரி விலை விபரங்கள்
          </p>
        </div>

        {/* Global Ask AI button */}
        <button
          onClick={() => handleAskAIMarket()}
          disabled={analyzingMarket}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition transform active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>{analyzingMarket ? 'ஆராய்ச்சி செய்கிறது...' : 'சந்தை பற்றி AI-யிடம் கேட்க'}</span>
        </button>
      </div>

      {/* Source & Transparency Banner */}
      <div className="bg-slate-100 rounded-2xl p-3.5 mb-5 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-bold">
            {isConfigured ? '🟢 நேரலை சந்தை தகவல் (Live Agmarknet Data)' : '🟡 DEMO MARKET DATA - மாதிரி சந்தை விலைகள்'}
          </strong>
          <span>{sourceNotice}</span>
        </div>
      </div>

      {/* Featured Hackathon Demo Market Card as explicitly requested */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/80 mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-700/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🟡 DEMO MARKET DATA
              </span>
              <span className="text-[11px] text-emerald-300">
                (ஹேக்கத்தான் மாதிரி சந்தை)
              </span>
            </div>
            <h3 className="text-2xl font-black font-serif text-white flex items-center gap-2">
              <span>🌾 நெல் (Paddy)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-emerald-200 mt-1">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>📍 தமிழ்நாடு (Tamil Nadu)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>🏪 Demo Market (மாதிரி சந்தை)</span>
              </span>
            </div>
          </div>

          {/* Action button requested: இந்த விலையில் நான் என்ன செய்யலாம்? */}
          <button
            onClick={() =>
              handleAskAIMarket(
                {
                  id: 'demo-featured',
                  crop: 'Paddy',
                  cropTamil: 'நெல்',
                  variety: 'பொன்னி',
                  state: 'Tamil Nadu',
                  district: 'Karur',
                  marketName: 'Demo Market',
                  minPrice: 2280,
                  maxPrice: 2650,
                  modalPrice: 2480,
                  priceDate: 'Today',
                  trend: 'up',
                  source: 'demo',
                },
                'இந்த மாதிரி சந்தை விலையில் (குறைந்த விலை ₹2,280, சராசரி விலை ₹2,480, அதிகபட்ச விலை ₹2,650) ஒரு விவசாயியாக நான் என்ன செய்யலாம்? தானியத்தை காய வைத்து நல்ல விலைக்கு விற்பது அல்லது ஒழுங்குமுறை கூடத்தில் விற்பது பற்றி ஆலோசனை கூறவும். (இது மாதிரி சந்தை விலை என்பதை தெளிவுபடுத்தவும்).'
              )
            }
            disabled={analyzingMarket}
            className="self-start sm:self-center px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition transform active:scale-95 flex items-center gap-2 border-2 border-amber-300"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>இந்த விலையில் நான் என்ன செய்யலாம்?</span>
          </button>
        </div>

        {/* 3 Prices: Min, Modal, Max */}
        <div className="grid grid-cols-3 gap-3 pt-4 text-center">
          <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-700/60">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">குறைந்த விலை (Min)</span>
            <strong className="text-sm sm:text-base font-bold text-white">₹2,280</strong>
            <span className="text-[9px] text-emerald-400 block">/குவிண்டால்</span>
          </div>

          <div className="bg-emerald-950/90 p-3 rounded-2xl border-2 border-amber-400/80 shadow-inner">
            <span className="text-[10px] text-amber-300 uppercase block font-black">சராசரி விலை (Modal)</span>
            <strong className="text-base sm:text-xl font-black text-amber-300">₹2,480</strong>
            <span className="text-[9px] text-amber-200/90 block font-bold">/குவிண்டால்</span>
          </div>

          <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-700/60">
            <span className="text-[10px] text-emerald-300 uppercase block font-semibold">அதிகபட்ச விலை (Max)</span>
            <strong className="text-sm sm:text-base font-bold text-white">₹2,650</strong>
            <span className="text-[9px] text-emerald-400 block">/குவிண்டால்</span>
          </div>
        </div>

        <p className="text-[10px] text-emerald-300/80 mt-3 text-center italic font-sans">
          * குறிப்பு: இந்த விலைகள் ஹேக்கத்தான் மாதிரி மதிப்பீட்டிற்கானவை மட்டுமே (DEMO MARKET DATA). நேரலை உழவர் சந்தை விலைகளாக கருத வேண்டாம்.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            பயிர் தேர்வு (Select Crop)
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-emerald-600 bg-white"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            மாவட்டம் தேர்வு (Select District)
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-emerald-600 bg-white"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Market Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          சந்தை விலைகளை ஏற்றுகிறது...
        </div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm text-slate-500">
          <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">சந்தை விபரங்கள் கிடைக்கவில்லை</h4>
          <p className="text-xs text-slate-500 mt-1">வேறு பயிர் அல்லது மாவட்டத்தை தேர்வு செய்யவும்.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prices.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {record.cropTamil}
                    </h3>
                    <span className="text-xs text-slate-500">
                      ரகம்: {record.variety}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      record.trend === 'up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : record.trend === 'down'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {record.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                    {record.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
                    {record.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{record.trend.toUpperCase()}</span>
                  </span>
                </div>

                {/* Mandi Name & Location */}
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-3">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{record.marketName}</span>
                </div>

                {/* 3 Prices: Min, Modal (Primary), Max in ₹/quintal */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">குறைந்த விலை</span>
                    <strong className="text-xs font-bold text-slate-700">₹{record.minPrice}</strong>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] text-emerald-800 block uppercase font-bold">சராசரி விலை</span>
                    <strong className="text-sm font-black text-emerald-900">₹{record.modalPrice}</strong>
                    <span className="text-[9px] text-slate-400 block">/குவிண்டால்</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">அதிகபட்ச விலை</span>
                    <strong className="text-xs font-bold text-slate-700">₹{record.maxPrice}</strong>
                  </div>
                </div>

                {record.arrivalVolumeTonnes && (
                  <span className="text-[11px] text-slate-500 block mb-2">
                    📦 இன்றைய வரத்து: {record.arrivalVolumeTonnes} டன்கள்
                  </span>
                )}
              </div>

              {/* Action Button: Ask AI about this specific market */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{record.priceDate}</span>
                <button
                  onClick={() => handleAskAIMarket(record)}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>இந்த சந்தை பற்றி கேட்க</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Market Advice Dialog */}
      {marketAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-emerald-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>உழவன் குரல் சந்தை ஆலோசனை</span>
              </div>
              <button
                onClick={() => setMarketAdviceModal(null)}
                className="text-xs bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed whitespace-pre-line">
              {marketAdviceModal}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setMarketAdviceModal(null)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
              >
                புரிந்தது (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
