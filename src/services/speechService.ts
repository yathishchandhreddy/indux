import { SupportedLanguage } from '../types';

// Declare Web Speech API types for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export class SpeechService {
  private static recognition: any = null;
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static mediaRecorder: MediaRecorder | null = null;
  private static audioChunks: Blob[] = [];

  // Map app languages to BCP-47 locale tags
  public static getLocale(lang: SupportedLanguage): string {
    switch (lang) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'en':
      default: return 'en-IN';
    }
  }

  // Check microphone permissions
  public static async checkMicrophonePermission(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after check
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch (e) {
      return false;
    }
  }

  // Start Voice Recognition (Speech to Text)
  public static startListening(
    lang: SupportedLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Browser does not support direct Web Speech Recognition. You can type instead.');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getLocale(lang);

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        if (finalText) {
          onResult(finalText, true);
        } else if (interimText) {
          onResult(interimText, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          onError('No speech detected. Please tap and speak again.');
        } else {
          onError(`Voice recognition error: ${event.error}. You can type your question.`);
        }
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      onError(err.message || 'Could not start speech recognition');
      return false;
    }
  }

  // Stop Voice Recognition
  public static stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  // Text to Speech (TTS)
  public static speak(
    text: string,
    lang: SupportedLanguage,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onError) onError('Speech synthesis not available');
      return;
    }

    const synth = window.speechSynthesis;

    // Cancel any active utterance
    try {
      synth.cancel();
      if (synth.paused) {
        synth.resume();
      }
    } catch (e) {
      // ignore
    }

    // Clean text of markdown asterisks, hashtags, urls, or technical formatting for smooth speech
    const cleanText = text
      .replace(/[*#_~`\[\]]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[🌾💧🔎👨‍🌾🌧💰🌱🐛👋🎙️🔊]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLocale = this.getLocale(lang);
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Slightly slower, natural cadence for rural agricultural advisory
    utterance.pitch = 1.0;

    const setVoiceAndSpeak = () => {
      try {
        const voices = synth.getVoices();
        // Priority: exact locale match (e.g. ta-IN) -> language match (e.g. ta) -> Indian English or default
        const matchingVoice =
          voices.find(v => v.lang === targetLocale) ||
          voices.find(v => v.lang.startsWith(lang)) ||
          voices.find(v => v.lang.includes('IN'));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      } catch {}

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('TTS utterance error:', e);
        if (onEnd) onEnd();
        if (onError) onError(e);
      };

      synth.speak(utterance);
    };

    const voices = synth.getVoices();
    if (voices.length > 0) {
      setVoiceAndSpeak();
    } else {
      // Handle asynchronous voice loading in Chromium
      const handleVoicesChanged = () => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        setVoiceAndSpeak();
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
      // Fallback timeout in case voiceschanged doesn't trigger
      setTimeout(() => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        setVoiceAndSpeak();
      }, 250);
    }
  }

  // Stop speaking
  public static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Check if currently speaking
  public static isSpeaking(): boolean {
    return Boolean(this.synth?.speaking);
  }
}
