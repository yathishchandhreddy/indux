import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../types';
import {
  X,
  User,
  MapPin,
  Sprout,
  Mic,
  Globe,
  CheckCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { SpeechService } from '../services/speechService';

export const OnboardingModal: React.FC = () => {
  const {
    farmerProfile,
    setFarmerProfile,
    showOnboarding,
    setShowOnboarding,
    language,
    setLanguage,
  } = useApp();

  const [name, setName] = useState(farmerProfile.name);
  const [village, setVillage] = useState(farmerProfile.village);
  const [district, setDistrict] = useState(farmerProfile.district);
  const [state, setState] = useState(farmerProfile.state || 'Tamil Nadu');
  const [mainCrop, setMainCrop] = useState(farmerProfile.mainCrop);
  const [farmSizeAcres, setFarmSizeAcres] = useState(farmerProfile.farmSizeAcres);
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(farmerProfile.preferredLanguage || language);
  const [locPermission, setLocPermission] = useState(farmerProfile.locationPermissionGranted);
  const [micPermission, setMicPermission] = useState(farmerProfile.microphonePermissionGranted);

  if (!showOnboarding) return null;

  const popularCrops = [
    { id: 'Paddy', label: 'Paddy / நெல்' },
    { id: 'Sugarcane', label: 'Sugarcane / கரும்பு' },
    { id: 'Banana', label: 'Banana / வாழை' },
    { id: 'Cotton', label: 'Cotton / பருத்தி' },
    { id: 'Groundnut', label: 'Groundnut / நிலக்கடலை' },
    { id: 'Maize', label: 'Maize / மக்காச்சோளம்' },
    { id: 'Tomato', label: 'Tomato / தக்காளி' },
    { id: 'Chilli', label: 'Chilli / மிளகாய்' },
    { id: 'Onion', label: 'Onion / சின்ன வெங்காயம்' },
    { id: 'Coconut', label: 'Coconut / தென்னை' },
  ];

  const districtsTN = [
    'Karur',
    'Thanjavur',
    'Dindigul',
    'Erode',
    'Madurai',
    'Salem',
    'Coimbatore',
    'Tiruchirappalli',
    'Tirunelveli',
    'Villupuram',
    'Cuddalore',
    'Namakkal',
    'Theni',
    'Perambalur',
  ];

  const handleRequestMic = async () => {
    const granted = await SpeechService.checkMicrophonePermission();
    setMicPermission(granted);
  };

  const handleSave = () => {
    setLanguage(prefLang);
    setFarmerProfile({
      ...farmerProfile,
      name: name.trim() || 'விவசாயி',
      village: village.trim() || 'Thottiyam',
      district: district.trim() || 'Karur',
      state: state.trim() || 'Tamil Nadu',
      preferredLanguage: prefLang,
      mainCrop,
      farmSizeAcres: Number(farmSizeAcres) || 2,
      locationPermissionGranted: locPermission,
      microphonePermissionGranted: micPermission,
    });
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-emerald-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              🌾
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">விவசாயி விபரம் (Farmer Profile)</h3>
              <p className="text-xs text-emerald-200">உங்கள் பண்ணை விவரங்களை எளிதாக அமைக்கவும்</p>
            </div>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="p-1.5 rounded-full hover:bg-emerald-700/80 text-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          {/* 1-Click Quick Hackathon Demo Profile: Ravi, Karur, Paddy, 2 Acres */}
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-3.5 rounded-2xl border border-amber-300 flex items-center justify-between gap-2 shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                <span>⚡ நேரலை டெமோ சுயவிவரம் (Live Demo Story Profile)</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                ரவி (Ravi) • கரூர் (Karur), தமிழ்நாடு • நெல் (Paddy) • 2 ஏக்கர் • தமிழ்
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setName('ரவி (Ravi)');
                setVillage('தொட்டியம்');
                setDistrict('Karur');
                setState('Tamil Nadu');
                setMainCrop('Paddy');
                setFarmSizeAcres(2);
                setPrefLang('ta');
                setLocPermission(true);
                setMicPermission(true);
              }}
              className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow transition"
            >
              தானாக நிரப்பு (Quick Fill)
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              விவசாயி பெயர் (Farmer Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="எ.கா: ரவி (Ravi)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium outline-none transition"
            />
          </div>

          {/* Location: Village & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                கிராமம் (Village)
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="எ.கா: தொட்டியம்"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                மாவட்டம் (District)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium outline-none transition bg-white"
              >
                {districtsTN.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-700" />
              முதன்மை பயிர் (Main Crop)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {popularCrops.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setMainCrop(c.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition border ${
                    mainCrop === c.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Farm Size in Acres */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              நிலத்தின் அளவு (Farm Size in Acres)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={farmSizeAcres}
                onChange={(e) => setFarmSizeAcres(Number(e.target.value))}
                className="w-32 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-bold outline-none transition"
              />
              <span className="text-sm font-semibold text-slate-600">ஏக்கர் (Acres)</span>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-700" />
              விருப்ப மொழி (Preferred Language)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'ta' as SupportedLanguage, name: 'தமிழ்' },
                { code: 'en' as SupportedLanguage, name: 'English' },
                { code: 'hi' as SupportedLanguage, name: 'हिन्दी' },
                { code: 'te' as SupportedLanguage, name: 'తెలుగు' },
                { code: 'kn' as SupportedLanguage, name: 'ಕನ್ನಡ' },
                { code: 'ml' as SupportedLanguage, name: 'മലയാളം' },
              ].map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setPrefLang(l.code)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    prefLang === l.code
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Microphone & Location Permissions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">மைக் அனுமதி (Microphone)</span>
                  <span className="text-[11px] text-slate-500">குரலில் பேசி கேள்வி கேட்க தேவை</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRequestMic}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  micPermission
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {micPermission ? '✓ அனுமதிக்கப்பட்டது' : 'அனுமதிக்கவும்'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">இருப்பிட அனுமதி (Location)</span>
                  <span className="text-[11px] text-slate-500">துல்லியமான வானிலை பெற</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocPermission(!locPermission)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  locPermission
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {locPermission ? 'YES' : 'NO'}
              </button>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>விபரங்களை சேமிக்கவும் (Save Profile)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
