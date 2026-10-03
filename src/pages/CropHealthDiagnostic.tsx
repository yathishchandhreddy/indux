import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { ApiClient } from '../services/apiClient';
import { SpeechService } from '../services/speechService';
import {
  Camera,
  Upload,
  Mic,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Building,
  Image as ImageIcon,
} from 'lucide-react';

export const CropHealthDiagnostic: React.FC = () => {
  const { farmerProfile, language, saveAdvice } = useApp();
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string>('என் நெல் பயிரில் அடி இலைகள் மஞ்சளாக மாறி நுனி காய்ந்து வருகிறது.');
  const [cropName, setCropName] = useState<string>(farmerProfile.mainCrop);
  const [diagnosing, setDiagnosing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      SpeechService.stopListening();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    SpeechService.startListening(
      language,
      (text) => {
        setSymptoms(text);
      },
      (err) => {
        console.warn(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const runDiagnosis = async () => {
    if (!symptoms.trim() && !selectedImage) return;

    setDiagnosing(true);
    try {
      const res = await ApiClient.diagnoseCropHealth({
        imageBase64: selectedImage || undefined,
        symptoms,
        cropName,
        language,
      });

      setDiagnosisResult(res.diagnosis);
    } catch (e) {
      console.error(e);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      SpeechService.speak(
        text,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif flex items-center gap-2">
          <span>{t.cropHealthTitle}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          பயிர் இலையின் புகைப்படத்தை எடுத்தோ அல்லது அறிகுறிகளை குரலில் விவரித்தோ தீர்வு பெறலாம்
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Input Section */}
        <div className="lg:col-span-6 space-y-4">
          {/* Photo capture / Upload card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>{t.uploadCropImage}</span>
            </h3>

            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 max-h-56 bg-slate-900 group">
                <img
                  src={selectedImage}
                  alt="Crop preview"
                  className="w-full h-56 object-cover object-center"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Take Photo */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <Camera className="w-6 h-6 text-emerald-700" />
                  <span className="text-xs font-bold">{t.takePhoto}</span>
                  <span className="text-[10px] text-emerald-600">கேமரா</span>
                </button>

                {/* Upload File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50 text-slate-700 flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <Upload className="w-6 h-6 text-slate-600" />
                  <span className="text-xs font-bold">கேலரி (Gallery)</span>
                  <span className="text-[10px] text-slate-500">புகைப்படம்</span>
                </button>
              </div>
            )}

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Symptom Description & Voice input */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>{t.describeSymptoms}</span>
              </label>

              <button
                type="button"
                onClick={handleVoiceRecord}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition ${
                  isRecording
                    ? 'bg-amber-500 text-slate-900 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'கேட்கிறேன்...' : 'குரலில் விவரிக்க'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="எ.கா: இலைகளில் மஞ்சள் புள்ளிகள் உள்ளன, தண்டுப் பகுதியில் புழு துளைத்த தடம் உள்ளது..."
              className="w-full p-3 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm font-medium outline-none resize-none"
            />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">பயிர்:</span>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-none flex-1"
              />
            </div>

            <button
              onClick={runDiagnosis}
              disabled={diagnosing || (!symptoms.trim() && !selectedImage)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{diagnosing ? 'ஆராய்ச்சி செய்கிறது (Analyzing)...' : 'நோய் கண்டறிந்து தீர்வு பெறுக'}</span>
            </button>
          </div>
        </div>

        {/* Right Diagnostic Result Section */}
        <div className="lg:col-span-6">
          {diagnosisResult ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-200 animate-in fade-in space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    🌱
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 font-serif">
                      பயிர் நலம் பகுப்பாய்வு முடிவு
                    </h4>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      {diagnosisResult.confidenceAssessment || 'Visual inspection guidance'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeak(diagnosisResult.summary + '. ' + (diagnosisResult.immediateSteps?.join('. ') || ''))}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-900 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'நிறுத்து' : 'கேட்க'}</span>
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed">
                {diagnosisResult.summary}
              </p>

              {/* Possible Causes */}
              {diagnosisResult.possibleCauses && (
                <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>சாத்தியமான காரணங்கள் (Possible Causes)</span>
                  </h5>
                  <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4">
                    {diagnosisResult.possibleCauses.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate Low-Risk Steps */}
              {diagnosisResult.immediateSteps && (
                <div className="bg-emerald-50/80 rounded-2xl p-3.5 border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>உடனடி குறைந்த ஆபத்து தீர்வுகள் (Immediate Steps)</span>
                  </h5>
                  <ul className="text-xs text-emerald-950 space-y-1.5">
                    {diagnosisResult.immediateSteps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-emerald-700 shrink-0">✓</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Observations needed */}
              {diagnosisResult.whatToMonitor && (
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs text-slate-700">
                  <strong className="block font-bold text-slate-900 mb-1">
                    👁 கவனிக்க வேண்டிய அறிகுறிகள்:
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {diagnosisResult.whatToMonitor.map((obs: string, idx: number) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Agricultural Extension Officer Caution */}
              {diagnosisResult.whenToSeekExpert && (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-blue-900 mb-0.5">
                      வேளாண் அலுவலர் வழிகாட்டல்:
                    </strong>
                    <p>{diagnosisResult.whenToSeekExpert}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-sm text-slate-500 h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                பாதுகாப்பான வேளாண் நுண்ணறிவு
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                உழவன் குரல் ஆய்வகம் தன்னிச்சையாக உறுதிப்படுத்தாத நோய்களை கற்பனை செய்யாது.
                அறிகுறிகளை ஆய்வு செய்து பாதுகாப்பான இயற்கை முறைகள் மற்றும் கள வழிகாட்டலை வழங்கும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
