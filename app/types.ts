// Dane wejściowe - codzienne sytuacje użytkownika
export interface FormData {
  // Sytuacja finansowa
  maxMonthlyPayment: number | null; // Maks. rata miesięczna
  
  // Codzienna jazda
  primaryUseLocation: 'city' | 'highway' | 'mixed' | null; // Gdzie najczęściej używane auto
  tripLength: 'short' | 'medium' | 'long' | null; // Jak długie trasy (do 10km, 10-30km, 30+km)
  annualKilometers: 'low' | 'medium' | 'high' | null; // Roczny przebieg (poniżej 10k, 10-20k, powyżej 20k)
  dailyCommute: 'none' | 'short' | 'medium' | 'long' | null; // <5km, 5-20km, 20-50km, >50km
  commuteType: 'city' | 'highway' | 'mixed' | null;
  parkingAtWork: 'none' | 'parking' | 'street' | 'tight' | null;
  parkingAtHome: 'garage' | 'driveway' | 'street' | null;
  dailyKmDriven: number; // Ile km dziennie
  accelerationImportance: 'low' | 'medium' | 'high' | null; // Czy lubi szybkie przyspieszanie
  parkingSkills: 'stressed' | 'confident' | 'easy' | null; // Umiejętności parkowania
  nightDriving: 'often' | 'rarely' | null; // Czy często jeździ po zmroku
  
  // Rodzina i pasażerowie
  householdSize: number; // Liczba osób w gospodarstwie
  childrenCount: number; // Liczba dzieci
  childSeats: number; // Ile fotelików dziecięcych
  elderlyPassengers: boolean; // Czy przewożone osoby starsze
  
  // Typowe przewożone rzeczy
  weeklyGroceries: 'small' | 'medium' | 'large' | null; // 2-3 torby, 5-7 toreb, 10+ toreb
  sportsEquipment: 'none' | 'small' | 'bikes' | 'large' | null; // Brak, małe, rowery/narty, kajaki/deski
  petTransport: 'none' | 'small' | 'medium' | 'large' | null; // Brak, mały pies, średni pies, duży pies/kilka
  strollerType: 'none' | 'compact' | 'large' | null;
  
  // Dłuższe wyjazdy
  longTripsPerYear: number; // Ile razy rocznie jazda >300km
  vacationStyle: 'none' | 'light' | 'family' | 'camping' | null; // Bagaż wakacyjny
  trunkFrequency: 'rare' | 'occasional' | 'often' | null; // Jak często używasz bagażnika do maksimum
  
  // Warunki i teren
  winterConditions: 'none' | 'mild' | 'regular' | 'extreme' | null; // Śnieg
  roadType: 'paved' | 'occasional-dirt' | 'regular-dirt' | null;
  hilliness: 'flat' | 'moderate' | 'mountainous' | null;
  
  // Styl życia
  weekendActivities: 'home' | 'city' | 'nature' | 'active' | null;
  trailerNeeded: 'never' | 'occasionally' | 'regularly' | null;
  dailyCommuteCongestion: 'light' | 'moderate' | 'heavy' | null; // Natężenie ruchu w codziennym dojeździe
  
  // Priorytety
  mainConcern: 'economy' | 'reliability' | 'comfort' | 'space' | null;
  mechanicalSkills: 'none' | 'basic' | 'advanced' | null;
  plannedOwnership: 'short' | 'medium' | 'long' | null; // <3, 3-7, >7 lat
  technologyPriority: 'carplay' | 'radio' | 'none' | null; // Priorytet technologii (CarPlay/Android Auto)
  servicePriority: 'cheap' | 'peace-of-mind' | null; // Priorytet przy serwisowaniu
  ownershipDuration: 'short' | 'long' | null; // Jak długo planuje trzymać (2-3 lata vs 5-10 lat)
}

// Wyliczone parametry techniczne - wynik analizy
export interface CalculatedRequirements {
  // Wymiary i przestrzeń
  minTrunkCapacity: number; // Litry
  recommendedTrunkCapacity: number;
  minSeats: number;
  thirdRowNeeded: boolean;
  
  // Osiągi i silnik
  minPower: number; // KM
  recommendedPower: number; // Rekomendowana pojemność
  optimalEngineSize: number; // cc - rekomendowana pojemność w cm³
  engineSizeReasoning: string; // Dlaczego ta pojemność
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
  
  // REKOMENDACJE - główne wyniki dla użytkownika
  recommendedFuelType: string; // 'benzyna', 'diesel', 'hybrid', 'lpg', 'elektryczny'
  fuelTypeReasoning: string; // Dlaczego ten typ paliwa
  recommendedBodyStyle: string; // 'sedan', 'kombi', 'suv', 'hatchback', 'minivan' itd
  bodyStyleReasoning: string; // Dlaczego ten typ nadwozia
  
  // Inne
  winterTiresNeeded: boolean;
  reliabilityPriority: 'low' | 'medium' | 'high';
  recommendedSegments: string[]; // ['C', 'C-SUV', 'Van']
  recommendedBodyStyles: string[]; // ['Kombi', 'SUV', 'Van']
  preferredFuelTypes: string[]; // ['benzyna', 'diesel', 'hybrid']
  
  // Uzasadnienia - dlaczego takie parametry
  reasoning: {
    trunk: string;
    power: string;
    budget: string;
    segment: string;
    features: string[];
    fuelType: string;
    bodyStyle: string;
  };

  // === SZCZEGÓŁOWE REKOMENDACJE DLA STYLU ŻYCIA ===
  
  // Koszty roczne
  estimatedAnnualCosts: {
    fuel: number; // Roczne spalanie
    insurance: number; // OC+AC szacunkowo
    maintenance: number; // Przeglądy, olej, filtry
    repairs: number; // Średnie naprawy
    total: number;
  };
  
  // Specyfika użytkowania
  usageProfile: {
    primaryUse: string; // "Dojazdy do pracy", "Rodzina", "Aktywny styl", itp.
    drivingPattern: string; // "Głównie miasto", "Mieszane", "Głównie droga"
    annualMileage: number; // Km rocznie
    dailyUsage: string; // Np. "5 dni w tygodniu, 20km dziennie"
  };
  
  // Rekomendacje bezpieczeństwa
  safetyRequirements: string[]; // Jakie systemy bezpieczeństwa są ważne
  recommendedSafetyFeatures: string[]; // ABS, ESP, ISOFIX, poduszki, itp.
  
  // Rekomendacje wygody/komfortu
  comfortFeatures: string[]; // Klimatyzacja, podgrzewane siedzenia, itp.
  
  // Specyfika dla rodziny
  familyNeeds?: {
    childSeatCompatibility: string; // Info o ISOFIX
    rearDoorWidth?: string; // Szerokość drzwi dla fotelika
    rearLegroom?: string; // Przestrzeń na nogi dla dzieci
    sunRoof?: boolean; // Przydatne dla zdrowia dzieci
  };
  
  // Specyfika dla aktywności
  activityRecommendations: string[]; // Np. roof bars, towing, 4WD, itp.
  
  // Niezawodność i części zamienne
  reliabilityInfo: {
    recommendedBrands: string[]; // Marki znane z niezawodności
    partsAvailability: string; // "Łatwo dostępne", "Trudno dostępne"
    serviceNetworkSize: string; // "Duża", "Średnia", "Mała"
  };
  
  // Opony i paliwo
  tireRecommendations: {
    seasonalTires: boolean;
    allSeasonTires: boolean;
    winterTiresRequired: boolean;
    recommendedSize?: string; // Np "205/55R16"
  };
  
  // Akcesoria rekomendowane
  recommendedAccessories: string[];
  
  // Porównanie do konkurencji
  competitorModels: string[]; // Alternatywne modele w podobnym przedziale
  
  // Informacje o emisji i ekologii
  environmentalInfo: {
    co2Emissions: number; // g/km szacunkowo
    euStandard: string; // Euro 6, Euro 5, itp.
    pollutantLevel: string; // "Nisko", "Średnio", "Wysoko"
  };
  
  // Szczegółowe rekomendacje na podstawie danych formularza
  lifestyleRecommendations: string[]; // Np. "Ze względu na dużo podroży, polecamy diesel", itp.
  
  // === PODZESPOŁY I KOMPONENTY SAMOCHODU ===
  engineComponents?: {
    type: string;
    displacement: string;
    power: string;
    torque: string;
    fuelInjection: string;
    turbo: string;
    valveTrain: string;
    cooling: string;
    description: string;
  };
  
  transmissionSystem?: {
    type: string;
    gears: string;
    driveType: string;
    transferBox: string;
    differentialType: string;
    description: string;
  };
  
  suspensionSystem?: {
    frontType: string;
    rearType: string;
    springType: string;
    dampersType: string;
    stabilizers: string;
    rideHeight: string;
    description: string;
  };
  
  brakingSystem?: {
    frontBrakes: string;
    rearBrakes: string;
    servoType: string;
    abs: string;
    esp: string;
    assistanceSystems: string[];
    handBrake: string;
    padType: string;
    description: string;
  };
  
  steeringSystem?: {
    type: string;
    assistType: string;
    turnsRequired: string;
    wheelSensitivity: string;
    description: string;
  };
  
  wheelTireSystem?: {
    wheelSize: string;
    wheelType: string;
    tireWidth: string;
    aspectRatio: string;
    tireType: string;
    winterTires: string;
    tpms: string;
    description: string;
    recommendedBrand: string;
  };
  
  chassisBodyStructure?: {
    bodyType: string;
    frametype: string;
    reinforcedAreas: string[];
    crumpleZones: string[];
    materials: string;
    description: string;
  };
  
  bodyExterior?: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    groundClearance: string;
    overhangs: string;
    doors: string;
    trunkSize: string;
    roofRails: string;
    windshield: string;
    description: string;
  };
  
  interiorSeating?: {
    seats: string;
    frontSeats: string;
    rearSeats: string;
    childSeatPoints: string;
    seatMaterial: string;
    lumbarSupport: string;
    heatingCooling: string;
    massage: string;
    description: string;
  };
  
  interiorComfort?: {
    airConditioning: string;
    ventilation: string;
    cruiseControl: string;
    parkingSensors: string;
    steeringWheelControl: string;
    infotainment: string;
    soundSystem: string;
    interior_lighting: string;
    description: string;
  };
  
  safetySystemsDetailed?: {
    airbags: string;
    frontAirbags: string;
    sideAirbags: string;
    curtainAirbags: string;
    kneeBag: string;
    esp: string;
    asr: string;
    hill_start_assist: string;
    hill_descent_control: string;
    laneKeeping: string;
    collisionWarning: string;
    blindSpotMonitor: string;
    parkingAssistant: string;
    description: string;
  };
  
  lightingSystem?: {
    headlights: string;
    lowBeam: string;
    highBeam: string;
    fogLights: string;
    rearLights: string;
    drivingLights: string;
    interiorLights: string;
    autoLighting: string;
    description: string;
  };
  
  emissionControl?: {
    exhaustSystem: string;
    euStandard: string;
    particleFilter: string;
    noxReduction: string;
    co2Emissions: string;
    fuelConsumption: string;
    description: string;
  };
  
  powerSteeringElectronics?: {
    steeringAssist: string;
    torqueSensitive: string;
    speedSensitive: string;
    steeringControl: string;
    description: string;
  };
  
  batteryElectrical?: {
    batteryCapacity: string;
    batteryVoltage: string;
    alternator: string;
    starterMotor: string;
    electricalBoxes: string;
    description: string;
  };
  
  coolingHeatingSystem?: {
    radiator: string;
    thermostat: string;
    heater: string;
    ventilation: string;
    description: string;
  };
  
  recommendedMaintenance?: {
    oilChanges: string;
    filterChanges: string;
    fluidChecks: string;
    tireRotation: string;
    wheelAlignment: string;
    brakePadReplacement: string;
    batteryReplacement: string;
    sparkPlugs: string;
    adblueRefill: string;
    description: string;
  };
}

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
  bodyStyle: string;
  trunkCapacity: number;
  
  // Ocena dopasowania
  matchScore: number; // 0-100%
  meetsRequirements: boolean;
  warnings: string[];
  
  // Link do oferty
  url?: string;
  imageUrl?: string;
  location?: string;
  region?: string; // Region OLX
}

// Użytkownik
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isPremium: boolean;
}

// Zapisany raport
export interface SavedReport {
  id: string;
  userId: string;
  createdAt: Date;
  formData: FormData;
  requirements: CalculatedRequirements;
  name?: string; // Nazwa raportu (generowana automatycznie lub podana przez użytkownika)
  isPremium: boolean; // Czy raport został odblokowany płatnością
}

// Dane logowania/rejestracji
export interface AuthCredentials {
  email: string;
  password: string;
  name?: string; // Tylko dla rejestracji
}

// Model samochodu z API
export interface CarModel {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  bodyType: string;
  fuelType: string;
  power: number; // KM
  torque: number; // Nm
  acceleration: number; // 0-100 km/h w sekundach
  trunkCapacity: number; // litry
  trunkCapacityMax?: number; // litry ze złożonymi siedzeniami
  seats: number;
  hasThirdRow: boolean;
  length: number; // mm
  width: number; // mm
  height: number; // mm
  fuelConsumption: number; // l/100km
  co2: number; // g/km
  price: number; // PLN
  imageUrl: string;
  features: string[];
  rating: number; // 0-100 (dopasowanie)
}
