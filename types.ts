export enum TravelStyle {
  RELAXED = 'Relaxed',
  ADVENTURE = 'Adventure',
  CULTURAL = 'Cultural',
  LUXURY = 'Luxury',
  BUDGET = 'Budget'
}

export enum TransportMode {
  FLIGHT = 'Flight',
  TRAIN = 'Train',
  BUS = 'Bus',
  CAR = 'Car',
  WALK = 'Walk'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost?: string;
}

export interface DayPlan {
  dayNumber: number;
  dailyQuote: string; // Humorous quote in Eng/Hindi/Hinglish
  theme: string;
  summary: string;
  activities: Activity[];
}

export interface Itinerary {
  destinationName: string;
  coordinates: Coordinates;
  originCoordinates: Coordinates;
  durationDays: number;
  totalEstimatedCost: string;
  currency: string;
  exchangeRateInfo: string;
  overview: string;
  days: DayPlan[];
  packingTips: string[];
  precautions: string[];
  youtubeSearchTerms: string[];
  secretTips: string[]; // Hidden gems
  bookingSuggestions: {
    hotelArea: string;
    transportType: string;
  };
  transportMode: TransportMode; // Added for map routing
}

export interface TripFormData {
  origin: string;
  destination: string;
  days: number;
  budget: string;
  style: TravelStyle[];
  travelers: string;
  transportMode: TransportMode;
}

export interface User {
  email: string;
  name: string;
  password?: string; // In real app, this would be hashed
  profilePic?: string; // Base64 or URL
  dob?: string;
  bio?: string;
}

export interface SavedTrip {
  id: string;
  date: string;
  destination: string;
  data: Itinerary;
}