import { FarmerProfile, ChatMessage, WeatherData, MarketPriceRecord, StructuredAdvice } from '../types';

export interface HealthStatus {
  status: string;
  services: {
    gemini: { configured: boolean; model: string };
    openweather: { configured: boolean };
    agmarknet: { configured: boolean };
    bhashini: { configured: boolean };
    whisper: { configured: boolean };
  };
}

export class ApiClient {
  private static isOffline(): boolean {
    return typeof navigator !== 'undefined' && !navigator.onLine;
  }

  // Health check
  static async checkHealth(): Promise<HealthStatus> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check error');
      return await res.json();
    } catch (err) {
      return {
        status: 'degraded',
        services: {
          gemini: { configured: false, model: 'gemini-3.8-flash' },
          openweather: { configured: false },
          agmarknet: { configured: false },
          bhashini: { configured: false },
          whisper: { configured: false },
        },
      };
    }
  }

  // Weather
  static async getWeather(city: string = 'Karur', lat?: number, lon?: number): Promise<{
    configured: boolean;
    isLive: boolean;
    message?: string;
    data: WeatherData | null;
  }> {
    if (this.isOffline()) {
      const cached = localStorage.getItem('uzhavan_cached_weather');
      if (cached) {
        return {
          configured: false,
          isLive: false,
          message: 'Offline mode: displaying cached weather data.',
          data: JSON.parse(cached),
        };
      }
    }

    try {
      const query = lat && lon ? `lat=${lat}&lon=${lon}` : `city=${encodeURIComponent(city)}`;
      const res = await fetch(`/api/weather?${query}`);
      const json = await res.json();
      if (json.data) {
        localStorage.setItem('uzhavan_cached_weather', JSON.stringify(json.data));
      }
      return json;
    } catch (e: any) {
      const cached = localStorage.getItem('uzhavan_cached_weather');
      return {
        configured: false,
        isLive: false,
        message: 'Weather service temporarily unreachable.',
        data: cached ? JSON.parse(cached) : null,
      };
    }
  }

  // Market Prices
  static async getMarketPrices(crop?: string, district?: string): Promise<{
    configured: boolean;
    source: 'live' | 'benchmark' | 'demo';
    sourceNotice: string;
    data: MarketPriceRecord[];
  }> {
    try {
      const params = new URLSearchParams();
      if (crop) params.append('crop', crop);
      if (district) params.append('district', district);

      const res = await fetch(`/api/market-prices?${params.toString()}`);
      return await res.json();
    } catch (e) {
      return {
        configured: false,
        source: 'benchmark',
        sourceNotice: 'Offline / local benchmark prices',
        data: [],
      };
    }
  }

  // Chat & Advisory
  static async sendChatMessage(params: {
    message: string;
    conversationHistory: ChatMessage[];
    farmerProfile: FarmerProfile | null;
    weatherContext?: any;
    marketContext?: any;
    language: string;
    isDemo: boolean;
  }): Promise<{
    success: boolean;
    isDemo: boolean;
    response: string;
    structuredAdvice: StructuredAdvice;
    sourcesRetrieved?: any[];
    audioText?: string;
  }> {
    if (this.isOffline()) {
      return {
        success: false,
        isDemo: true,
        response: 'நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். சேமித்த ஆலோசனைகள் மற்றும் வரலாற்றை அணுகலாம்.',
        structuredAdvice: {
          summary: 'You are currently offline. Live AI calls require an active internet connection.',
          immediateSteps: ['Check internet connectivity', 'Review saved advice tab'],
          whatToMonitor: ['Network status'],
          whenToSeekExpert: 'Call Kisan Call Center (1800-180-1551) directly for urgent voice support.',
        },
      };
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Chat API error (${res.status})`);
      }

      return await res.json();
    } catch (e: any) {
      console.error('Chat error:', e);
      throw e;
    }
  }

  // Crop Health Diagnostic
  static async diagnoseCropHealth(payload: {
    imageBase64?: string;
    mimeType?: string;
    symptoms: string;
    cropName: string;
    language: string;
  }) {
    const res = await fetch('/api/crop-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  // RAG Search
  static async searchRAG(query: string, crop?: string) {
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, crop }),
      });
      return await res.json();
    } catch (e) {
      return { results: [] };
    }
  }
}
