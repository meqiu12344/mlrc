// Dane wejściowe - codzienne sytuacje użytkownika
export interface FormData {
  // Sytuacja finansowa
  monthlyIncome: number; // Miesięczny dochód gospodarstwa
  maxMonthlyPayment: number | null; // Maks. rata miesięczna
  
  // Codzienna jazda
  dailyCommute: 'none' | 'short' | 'medium' | 'long' | null; // <5km, 5-20km, 20-50km, >50km
  commuteType: 'city' | 'highway' | 'mixed' | null;
  parkingAtWork: 'none' | 'parking' | 'street' | 'tight' | null;
  parkingAtHome: 'garage' | 'driveway' | 'street' | null;
  
  // Rodzina i pasażerowie
  householdSize: number; // Liczba osób w gospodarstwie
  childrenCount: number; // Liczba dzieci
  childSeats: number; // Ile fotelików dziecięcych
  elderlyPassengers: boolean; // Czy przewożone osoby starsze
  
  // Typowe przewożone rzeczy
  weeklyGroceries: 'small' | 'medium' | 'large' | null; // 2-3 torby, 5-7 toreb, 10+ toreb
  sportsEquipment: 'none' | 'small' | 'large' | null; // Brak, rowery/narty, kajaki/deski
  petTransport: 'none' | 'small' | 'large' | null; // Brak, mały pies, duży pies/kilka
  strollerType: 'none' | 'compact' | 'large' | null;
  
  // Dłuższe wyjazdy
  longTripsPerYear: number; // Ile razy rocznie jazda >300km
  vacationStyle: 'none' | 'light' | 'family' | 'camping' | null; // Bagaż wakacyjny
  
  // Warunki i teren
  winterConditions: 'none' | 'mild' | 'regular' | 'extreme' | null; // Śnieg
  roadType: 'paved' | 'occasional-dirt' | 'regular-dirt' | null;
  hilliness: 'flat' | 'moderate' | 'mountainous' | null;
  
  // Styl życia
  weekendActivities: 'home' | 'city' | 'nature' | 'active' | null;
  trailerNeeded: 'never' | 'occasionally' | 'regularly' | null;
  
  // Priorytety
  mainConcern: 'economy' | 'reliability' | 'comfort' | 'space' | null;
  mechanicalSkills: 'none' | 'basic' | 'advanced' | null;
  plannedOwnership: 'short' | 'medium' | 'long' | null; // <3, 3-7, >7 lat
}

// Wyliczone parametry techniczne - wynik analizy
export interface CalculatedRequirements {
  // Wymiary i przestrzeń
  minTrunkCapacity: number; // Litry
  recommendedTrunkCapacity: number;
  minSeats: number;
  thirdRowNeeded: boolean;
  
  // Osiągi
  minPower: number; // KM
  maxAcceleration: number; // sekundy 0-100
  cityDriving: number; // % czasu w mieście (0-100)
  
  // Możliwości
  towingCapacity: number; // kg
  minGroundClearance: number; // mm
  awd4x4Needed: boolean;
  
  // Ekonomia
  maxBudget: number; // PLN
  recommendedBudget: number;
  maxMonthlyCost: number; // Rata + paliwo + ubezpieczenie
  maxFuelConsumption: number; // L/100km miasto
  
  // Inne
  winterTiresNeeded: boolean;
  reliabilityPriority: 'low' | 'medium' | 'high';
  recommendedSegments: string[]; // ['C', 'C-SUV', 'Van']
  recommendedBodyStyles: string[]; // ['Kombi', 'SUV', 'Van']
  
  // Uzasadnienia - dlaczego takie parametry
  reasoning: {
    trunk: string;
    power: string;
    budget: string;
    segment: string;
    features: string[];
  };
}

// Stary typ dla kompatybilności z bazą danych (tymczasowe)
export interface Recommendation {
  make: string;
  model: string;
  year: string;
  segment: string;
  bodyStyle: string;
  fuelType: string;
  enginePower: number;
  transmission: string;
  driveType: string;
  trunkCapacity: string | number;
  fuelConsumptionCity: string | number;
  fuelConsumptionHighway?: string | number;
  acceleration0to100: string | number;
  towingCapacity?: string | number;
  groundClearance?: string | number;
  reliabilityRating: number;
  matchScore: number;
  reasonForRecommendation?: string[];
  warnings?: string[];
}

// Znalezione oferty (przygotowane pod API)
export interface CarOffer {
  id: string;
  source: 'otomoto' | 'autoscout24' | 'database'; // Źródło
  
  // Podstawowe dane
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  
  // Parametry techniczne
  enginePower: number;
  fuelType: string;
  transmission: string;
  driveType: string;
  trunkCapacity: number;
  
  // Ocena dopasowania
  matchScore: number; // 0-100%
  meetsRequirements: boolean;
  warnings: string[];
  
  // Link do oferty
  url?: string;
  imageUrl?: string;
  location?: string;
}
