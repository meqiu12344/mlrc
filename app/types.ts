export interface FormData {
  budget: number;
  riskTolerance: 'high' | 'medium' | 'low' | null;
  driveLocation: 'city' | 'mixed' | 'highway' | null;
  passengers: 'solo' | 'small-family' | 'large-family' | null;
  priority: 'economy' | 'comfort' | 'safety' | 'emotions' | null;
  carAttitude: 'tool' | 'passion' | null;
  annualMileage: 'low' | 'medium' | 'high' | null;
  parkingType: 'garage' | 'street' | 'mixed' | null;
  mechanicalSkills: 'none' | 'basic' | 'advanced' | null;
  terrainType: 'flat' | 'hilly' | 'mixed' | null;
  carAge: 'new' | 'young' | 'old' | null;
  brandPreference: 'japanese' | 'german' | 'french' | 'any' | null;
  
  // Dodatkowe szczegółowe pytania
  trunkNeeds: 'small' | 'medium' | 'large' | 'xl' | null; // 300L, 450L, 600L, 800L+
  transmission: 'manual' | 'automatic' | 'no-preference' | null;
  towing: 'none' | 'light' | 'heavy' | null; // brak, <750kg, >750kg
  winterConditions: 'mild' | 'harsh' | 'extreme' | null;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'any' | null;
  acceleration: 'slow-ok' | 'moderate' | 'fast' | null; // >11s, 8-11s, <8s do 100
  heightClearance: 'low' | 'standard' | 'high' | null; // <150mm, 150-180mm, >180mm
  plannedOwnership: 'short' | 'medium' | 'long' | null; // <3 lata, 3-7 lat, >7 lat
}

export interface Recommendation {
  type: string;
  reasoning: string;
  models: string[];
  warnings: string[];
  suggestions: string[];
  matchScore: number;
  segment: string;
  bodyStyle: string;
  trunkCapacity: string;
  accelerationTime: string;
  towingCapacity: string;
  groundClearance: string;
  enginePower: string;
  fuelTypes: string;
  transmissionType: string;
  driveType: string;
  winterCapability: string;
  reliability: string;
  cityFriendly: string;
  priceCategory: string;
}
