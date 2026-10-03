export type SupportedLanguage = 'ta' | 'en' | 'hi' | 'te' | 'kn' | 'ml';

export interface FarmerProfile {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: SupportedLanguage;
  mainCrop: string;
  farmSizeAcres: number;
  soilType?: string;
  irrigationSource?: string;
  locationPermissionGranted: boolean;
  microphonePermissionGranted: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

export interface StructuredAdvice {
  summary: string;
  possibleCauses?: string[];
  immediateSteps: string[];
  whatToMonitor: string[];
  whenToSeekExpert: string;
  organicAlternatives?: string[];
  cautionNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'assistant';
  text: string;
  audioUrl?: string;
  language: SupportedLanguage;
  timestamp: string;
  structuredAdvice?: StructuredAdvice;
  sourcesRetrieved?: Array<{
    title: string;
    snippet: string;
    source: string;
    confidence?: number;
  }>;
  imageUrl?: string;
  topic?: string;
  weatherSnapshot?: string;
}

export interface ConversationRecord {
  id: string;
  title: string;
  date: string;
  language: SupportedLanguage;
  crop: string;
  messages: ChatMessage[];
  saved?: boolean;
}

export interface SavedAdviceItem {
  id: string;
  question: string;
  advice: StructuredAdvice | string;
  rawText: string;
  date: string;
  crop: string;
  language: SupportedLanguage;
  category: 'pest' | 'fertilizer' | 'weather' | 'market' | 'irrigation' | 'general';
}

export interface WeatherData {
  city: string;
  district: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  rainProbability?: number;
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProbability?: number;
  }>;
  agriculturalAdvice?: {
    irrigation: string;
    spraying: string;
    fertilizer: string;
    harvesting: string;
  };
  isLive: boolean;
  lastUpdated: string;
}

export interface MarketPriceRecord {
  id: string;
  crop: string;
  cropTamil: string;
  variety: string;
  state: string;
  district: string;
  marketName: string;
  minPrice: number; // in ₹/quintal
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  trend: 'up' | 'down' | 'stable';
  arrivalVolumeTonnes?: number;
  source: 'live' | 'benchmark' | 'demo';
}

export interface CropGuide {
  id: string;
  name: string;
  tamilName: string;
  category: string;
  growthDurationDays: number;
  suitableSoils: string[];
  stages: Array<{
    stageName: string;
    durationDays: string;
    waterRequirement: string;
    keyTasks: string;
  }>;
  commonDiseases: Array<{
    name: string;
    tamilName: string;
    symptoms: string;
    remedy: string;
  }>;
  fertilizerSchedule: string;
  idealWeather: string;
  suggestedQuestions: string[];
}

export interface RAGDocument {
  id: string;
  title: string;
  titleTamil: string;
  crop: string;
  category: string;
  content: string;
  contentTamil: string;
  source: string;
  tags: string[];
}
