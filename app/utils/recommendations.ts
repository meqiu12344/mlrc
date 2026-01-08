import { FormData, Recommendation } from "../types";

// Mapowanie potrzeb bagażnikowych na litry
const trunkCapacityMap = {
  small: { min: 250, max: 350, label: "250-350 litrów" },
  medium: { min: 400, max: 500, label: "400-500 litrów" },
  large: { min: 550, max: 700, label: "550-700 litrów" },
  xl: { min: 750, max: 1000, label: "750+ litrów" }
};

// Baza samochodów z bardzo szczegółowymi danymi
interface CarModel {
  name: string;
  segment: string;
  bodyStyle: string;
  trunkMin: number;
  trunkMax: number;
  accelerationTime: number; // 0-100 km/h w sekundach
  towingCapacity: number; // kg
  groundClearance: number; // mm
  enginePower: number; // KM
  fuelTypes: string[];
  transmission: string[];
  driveType: string;
  winterCapability: number; // 1-10
  reliability: number; // 1-10
  cityFriendly: number; // 1-10
  priceCategory: "budget" | "mid" | "premium";
}

const carDatabase: CarModel[] = [
  // Segment A - Miejskie miniautka
  {
    name: "Toyota Aygo / Peugeot 108 / Citroën C1",
    segment: "A",
    bodyStyle: "Hatchback 3/5-drzwiowy",
    trunkMin: 196,
    trunkMax: 780,
    accelerationTime: 13.8,
    towingCapacity: 0,
    groundClearance: 135,
    enginePower: 72,
    fuelTypes: ["benzyna"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 4,
    reliability: 9,
    cityFriendly: 10,
    priceCategory: "budget"
  },
  {
    name: "Fiat 500",
    segment: "A",
    bodyStyle: "Hatchback 3-drzwiowy",
    trunkMin: 185,
    trunkMax: 550,
    accelerationTime: 12.9,
    towingCapacity: 0,
    groundClearance: 140,
    enginePower: 69,
    fuelTypes: ["benzyna", "elektryczny"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 4,
    reliability: 7,
    cityFriendly: 10,
    priceCategory: "mid"
  },
  {
    name: "Volkswagen Up! / Škoda Citigo / Seat Mii",
    segment: "A",
    bodyStyle: "Hatchback 3/5-drzwiowy",
    trunkMin: 251,
    trunkMax: 951,
    accelerationTime: 13.2,
    towingCapacity: 0,
    groundClearance: 145,
    enginePower: 75,
    fuelTypes: ["benzyna", "elektryczny"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 5,
    reliability: 8,
    cityFriendly: 10,
    priceCategory: "mid"
  },

  // Segment B - Małe auta miejskie i uniwersalne
  {
    name: "Toyota Yaris",
    segment: "B",
    bodyStyle: "Hatchback 5-drzwiowy",
    trunkMin: 286,
    trunkMax: 947,
    accelerationTime: 9.7,
    towingCapacity: 450,
    groundClearance: 145,
    enginePower: 116,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 9,
    cityFriendly: 9,
    priceCategory: "mid"
  },
  {
    name: "Volkswagen Polo",
    segment: "B",
    bodyStyle: "Hatchback 5-drzwiowy",
    trunkMin: 355,
    trunkMax: 1125,
    accelerationTime: 9.9,
    towingCapacity: 600,
    groundClearance: 140,
    enginePower: 110,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 8,
    cityFriendly: 9,
    priceCategory: "mid"
  },
  {
    name: "Renault Clio",
    segment: "B",
    bodyStyle: "Hatchback 5-drzwiowy",
    trunkMin: 391,
    trunkMax: 1069,
    accelerationTime: 11.0,
    towingCapacity: 500,
    groundClearance: 135,
    enginePower: 100,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 7,
    cityFriendly: 9,
    priceCategory: "mid"
  },
  {
    name: "Mazda 2",
    segment: "B",
    bodyStyle: "Hatchback 5-drzwiowy",
    trunkMin: 280,
    trunkMax: 950,
    accelerationTime: 10.5,
    towingCapacity: 480,
    groundClearance: 145,
    enginePower: 90,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 8,
    cityFriendly: 9,
    priceCategory: "mid"
  },
  {
    name: "Honda Jazz / Fit",
    segment: "B",
    bodyStyle: "Hatchback 5-drzwiowy",
    trunkMin: 354,
    trunkMax: 1314,
    accelerationTime: 10.2,
    towingCapacity: 450,
    groundClearance: 150,
    enginePower: 109,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 9,
    cityFriendly: 9,
    priceCategory: "mid"
  },

  // Segment B SUV - Małe crossovery
  {
    name: "Nissan Juke",
    segment: "B-SUV",
    bodyStyle: "SUV kompaktowy",
    trunkMin: 422,
    trunkMax: 1305,
    accelerationTime: 10.4,
    towingCapacity: 500,
    groundClearance: 170,
    enginePower: 114,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Renault Captur",
    segment: "B-SUV",
    bodyStyle: "SUV kompaktowy",
    trunkMin: 536,
    trunkMax: 1275,
    accelerationTime: 11.2,
    towingCapacity: 650,
    groundClearance: 180,
    enginePower: 100,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Mazda CX-3",
    segment: "B-SUV",
    bodyStyle: "SUV kompaktowy",
    trunkMin: 350,
    trunkMax: 1260,
    accelerationTime: 9.2,
    towingCapacity: 600,
    groundClearance: 160,
    enginePower: 121,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 8,
    cityFriendly: 8,
    priceCategory: "mid"
  },

  // Segment C - Kompakty rodzinne
  {
    name: "Toyota Corolla",
    segment: "C",
    bodyStyle: "Hatchback / Sedan / Kombi",
    trunkMin: 361,
    trunkMax: 1606,
    accelerationTime: 8.0,
    towingCapacity: 725,
    groundClearance: 135,
    enginePower: 184,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 10,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Volkswagen Golf",
    segment: "C",
    bodyStyle: "Hatchback / Kombi",
    trunkMin: 381,
    trunkMax: 1642,
    accelerationTime: 8.5,
    towingCapacity: 750,
    groundClearance: 145,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel", "hybryda", "elektryczny"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 8,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Mazda 3",
    segment: "C",
    bodyStyle: "Hatchback / Sedan",
    trunkMin: 334,
    trunkMax: 1022,
    accelerationTime: 8.1,
    towingCapacity: 680,
    groundClearance: 140,
    enginePower: 186,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 9,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Honda Civic",
    segment: "C",
    bodyStyle: "Hatchback / Sedan",
    trunkMin: 420,
    trunkMax: 1267,
    accelerationTime: 7.8,
    towingCapacity: 650,
    groundClearance: 140,
    enginePower: 182,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 9,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Ford Focus",
    segment: "C",
    bodyStyle: "Hatchback / Sedan / Kombi",
    trunkMin: 375,
    trunkMax: 1653,
    accelerationTime: 9.0,
    towingCapacity: 800,
    groundClearance: 145,
    enginePower: 125,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 8,
    priceCategory: "mid"
  },
  {
    name: "Škoda Octavia",
    segment: "C",
    bodyStyle: "Hatchback / Kombi",
    trunkMin: 600,
    trunkMax: 1700,
    accelerationTime: 8.7,
    towingCapacity: 1200,
    groundClearance: 145,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 8,
    cityFriendly: 7,
    priceCategory: "mid"
  },

  // Segment C SUV - Kompaktowe SUV-y
  {
    name: "Toyota RAV4",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 580,
    trunkMax: 1690,
    accelerationTime: 8.1,
    towingCapacity: 1650,
    groundClearance: 195,
    enginePower: 218,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 9,
    cityFriendly: 7,
    priceCategory: "mid"
  },
  {
    name: "Mazda CX-5",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 522,
    trunkMax: 1638,
    accelerationTime: 7.7,
    towingCapacity: 1800,
    groundClearance: 210,
    enginePower: 194,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 8,
    cityFriendly: 7,
    priceCategory: "mid"
  },
  {
    name: "Volkswagen Tiguan",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 615,
    trunkMax: 1655,
    accelerationTime: 8.6,
    towingCapacity: 2000,
    groundClearance: 200,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 7,
    cityFriendly: 7,
    priceCategory: "mid"
  },
  {
    name: "Nissan Qashqai",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 504,
    trunkMax: 1593,
    accelerationTime: 9.9,
    towingCapacity: 1500,
    groundClearance: 190,
    enginePower: 140,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 7,
    cityFriendly: 7,
    priceCategory: "mid"
  },
  {
    name: "Honda CR-V",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 497,
    trunkMax: 1694,
    accelerationTime: 8.8,
    towingCapacity: 1500,
    groundClearance: 198,
    enginePower: 193,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 9,
    cityFriendly: 7,
    priceCategory: "mid"
  },
  {
    name: "Škoda Karoq",
    segment: "C-SUV",
    bodyStyle: "SUV",
    trunkMin: 521,
    trunkMax: 1630,
    accelerationTime: 8.4,
    towingCapacity: 1800,
    groundClearance: 188,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 8,
    cityFriendly: 7,
    priceCategory: "mid"
  },

  // Segment D - Klasa średnia wyższa
  {
    name: "Toyota Camry",
    segment: "D",
    bodyStyle: "Sedan",
    trunkMin: 524,
    trunkMax: 524,
    accelerationTime: 8.3,
    towingCapacity: 750,
    groundClearance: 145,
    enginePower: 218,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["automatic"],
    driveType: "Napęd na przód",
    winterCapability: 6,
    reliability: 9,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Volkswagen Passat",
    segment: "D",
    bodyStyle: "Sedan / Kombi",
    trunkMin: 586,
    trunkMax: 1780,
    accelerationTime: 8.1,
    towingCapacity: 2000,
    groundClearance: 145,
    enginePower: 190,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Mazda 6",
    segment: "D",
    bodyStyle: "Sedan / Kombi",
    trunkMin: 480,
    trunkMax: 1648,
    accelerationTime: 7.6,
    towingCapacity: 1800,
    groundClearance: 145,
    enginePower: 194,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 8,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Škoda Superb",
    segment: "D",
    bodyStyle: "Sedan / Kombi",
    trunkMin: 625,
    trunkMax: 1950,
    accelerationTime: 7.7,
    towingCapacity: 2000,
    groundClearance: 145,
    enginePower: 190,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 8,
    cityFriendly: 6,
    priceCategory: "mid"
  },

  // Vany rodzinne
  {
    name: "Volkswagen Touran",
    segment: "Van-C",
    bodyStyle: "Van kompaktowy 5+2",
    trunkMin: 743,
    trunkMax: 1980,
    accelerationTime: 9.3,
    towingCapacity: 2000,
    groundClearance: 155,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Ford S-Max / Galaxy",
    segment: "Van-D",
    bodyStyle: "Van 7-osobowy",
    trunkMin: 700,
    trunkMax: 2200,
    accelerationTime: 9.0,
    towingCapacity: 2100,
    groundClearance: 150,
    enginePower: 190,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 5,
    priceCategory: "mid"
  },
  {
    name: "Renault Scenic / Grand Scenic",
    segment: "Van-C",
    bodyStyle: "Van kompaktowy 5+2",
    trunkMin: 572,
    trunkMax: 1919,
    accelerationTime: 10.5,
    towingCapacity: 1800,
    groundClearance: 165,
    enginePower: 140,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 7,
    reliability: 6,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Citroën C4 SpaceTourer / Grand SpaceTourer",
    segment: "Van-C",
    bodyStyle: "Van kompaktowy 5+2",
    trunkMin: 537,
    trunkMax: 1851,
    accelerationTime: 10.9,
    towingCapacity: 1700,
    groundClearance: 160,
    enginePower: 130,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód",
    winterCapability: 7,
    reliability: 6,
    cityFriendly: 6,
    priceCategory: "mid"
  },

  // Segment D SUV - Duże SUV-y
  {
    name: "Toyota Highlander",
    segment: "D-SUV",
    bodyStyle: "SUV 7-osobowy",
    trunkMin: 332,
    trunkMax: 2076,
    accelerationTime: 8.0,
    towingCapacity: 2270,
    groundClearance: 203,
    enginePower: 248,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 9,
    reliability: 9,
    cityFriendly: 5,
    priceCategory: "premium"
  },
  {
    name: "Volkswagen Touareg",
    segment: "D-SUV",
    bodyStyle: "SUV",
    trunkMin: 810,
    trunkMax: 1800,
    accelerationTime: 5.9,
    towingCapacity: 3500,
    groundClearance: 220,
    enginePower: 340,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["automatic"],
    driveType: "4x4",
    winterCapability: 9,
    reliability: 7,
    cityFriendly: 5,
    priceCategory: "premium"
  },
  {
    name: "Škoda Kodiaq",
    segment: "D-SUV",
    bodyStyle: "SUV 5/7-osobowy",
    trunkMin: 270,
    trunkMax: 2065,
    accelerationTime: 7.8,
    towingCapacity: 2500,
    groundClearance: 194,
    enginePower: 190,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 8,
    cityFriendly: 6,
    priceCategory: "mid"
  },
  {
    name: "Mazda CX-9",
    segment: "D-SUV",
    bodyStyle: "SUV 7-osobowy",
    trunkMin: 230,
    trunkMax: 2016,
    accelerationTime: 7.4,
    towingCapacity: 2000,
    groundClearance: 220,
    enginePower: 231,
    fuelTypes: ["benzyna"],
    transmission: ["automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 8,
    reliability: 8,
    cityFriendly: 5,
    priceCategory: "mid"
  },

  // SUV-y terenowe
  {
    name: "Jeep Wrangler",
    segment: "SUV-Terrain",
    bodyStyle: "SUV terenowy",
    trunkMin: 548,
    trunkMax: 1968,
    accelerationTime: 7.9,
    towingCapacity: 2267,
    groundClearance: 276,
    enginePower: 272,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "4x4",
    winterCapability: 10,
    reliability: 6,
    cityFriendly: 3,
    priceCategory: "premium"
  },
  {
    name: "Toyota Land Cruiser / 4Runner",
    segment: "SUV-Terrain",
    bodyStyle: "SUV terenowy",
    trunkMin: 621,
    trunkMax: 2109,
    accelerationTime: 7.8,
    towingCapacity: 3500,
    groundClearance: 230,
    enginePower: 309,
    fuelTypes: ["benzyna", "diesel"],
    transmission: ["automatic"],
    driveType: "4x4",
    winterCapability: 10,
    reliability: 10,
    cityFriendly: 3,
    priceCategory: "premium"
  },
  {
    name: "Subaru Forester / Outback",
    segment: "C-SUV",
    bodyStyle: "SUV / Kombi terenowe",
    trunkMin: 561,
    trunkMax: 1775,
    accelerationTime: 9.1,
    towingCapacity: 1870,
    groundClearance: 220,
    enginePower: 154,
    fuelTypes: ["benzyna", "hybryda"],
    transmission: ["automatic"],
    driveType: "4x4 (stały)",
    winterCapability: 10,
    reliability: 9,
    cityFriendly: 7,
    priceCategory: "mid"
  },

  // Kompaktowe sportbacki
  {
    name: "Audi A3 Sportback",
    segment: "C",
    bodyStyle: "Sportback",
    trunkMin: 380,
    trunkMax: 1200,
    accelerationTime: 7.3,
    towingCapacity: 750,
    groundClearance: 140,
    enginePower: 150,
    fuelTypes: ["benzyna", "diesel", "hybryda"],
    transmission: ["manual", "automatic"],
    driveType: "Napęd na przód / 4x4",
    winterCapability: 7,
    reliability: 7,
    cityFriendly: 8,
    priceCategory: "premium"
  }
];

export function generateRecommendation(data: FormData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Mapowanie wartości FormData na nazwy używane w bazie
  const fuelTypeMap: {[key: string]: string} = {
    'petrol': 'benzyna',
    'diesel': 'diesel',
    'hybrid': 'hybryda',
    'electric': 'elektryczny',
    'any': 'any'
  };
  
  // Zamieniamy wartości na te ze słownika
  const normalizedData = {
    ...data,
    fuelType: data.fuelType ? fuelTypeMap[data.fuelType] || data.fuelType : null
  };
  
  // Debug log
  console.log("FormData:", normalizedData);
  console.log("Total cars in database:", carDatabase.length);
  
  // 1. Określenie wymagań bagażnikowych
  const trunkReq = normalizedData.trunkNeeds ? trunkCapacityMap[normalizedData.trunkNeeds] : null;
  
  // 2. Określenie wymagań holowniczych
  const towingReq = normalizedData.towing === "heavy" ? 750 : normalizedData.towing === "light" ? 300 : 0;
  
  // 3. Określenie wymagań zimowych (punktacja)
  const winterReq = normalizedData.winterConditions === "extreme" ? 8 : 
                    normalizedData.winterConditions === "harsh" ? 6 : 3;
  
  // 4. Określenie wymagań przyspieszenia
  const accelerationReq = normalizedData.acceleration === "fast" ? 8.0 : 
                         normalizedData.acceleration === "moderate" ? 11.0 : 100.0;
  
  // 5. Określenie wymagań prześwitu
  const clearanceReq = normalizedData.heightClearance === "high" ? 180 : 
                       normalizedData.heightClearance === "standard" ? 150 : 0;

  // Filtrowanie bazy aut
  let filteredCars = carDatabase.filter(car => {
    // TWARDE FILTRY - muszą być spełnione
    
    // Filtr holowania - jeśli potrzeba, to musi być
    if (towingReq > 0 && car.towingCapacity < towingReq) return false;
    
    // Filtr typu paliwa - jeśli nie "any" i nie null, to musi być dostępny
    if (normalizedData.fuelType && normalizedData.fuelType !== "any" && normalizedData.fuelType !== null) {
      if (!car.fuelTypes.includes(normalizedData.fuelType)) return false;
    }
    
    // Filtr skrzyni biegów - jeśli nie "no-preference" i nie null, musi być dostępny
    if (normalizedData.transmission && normalizedData.transmission !== "no-preference" && normalizedData.transmission !== null) {
      if (!car.transmission.includes(normalizedData.transmission)) return false;
    }

    return true;
  });
  
  console.log("Filtered cars:", filteredCars.length);

  // Scoring system - punktowanie aut
  const scoredCars = filteredCars.map(car => {
    let score = 0;
    
    // Punkty za główne użytkowanie
    if (normalizedData.driveLocation === "city") {
      score += car.cityFriendly * 10;
    } else if (normalizedData.driveLocation === "mixed") {
      score += (car.cityFriendly * 5) + (car.winterCapability * 5);
    } else if (normalizedData.driveLocation === "highway") {
      score += (10 - car.cityFriendly) * 8;
    }
    
    // Punkty za liczbę pasażerów
    if (normalizedData.passengers === "large-family") {
      if (car.segment.includes("Van") || car.bodyStyle.includes("7-osobowy")) {
        score += 30;
      }
    } else if (normalizedData.passengers === "solo") {
      if (car.segment === "A" || car.segment === "B") {
        score += 20;
      }
    }
    
    // Punkty za rodzaj podróży
    if (normalizedData.annualMileage === "high") {
      score += car.reliability * 8;
      if (car.trunkMax > 500) score += 15;
    } else if (normalizedData.annualMileage === "medium") {
      score += car.reliability * 5;
    }
    
    // Punkty za częstotliwość użycia
    if (normalizedData.annualMileage === "high") {
      score += car.reliability * 10;
      score += car.cityFriendly * 5;
    } else if (normalizedData.annualMileage === "medium") {
      score += car.reliability * 7;
    }
    
    // Punkty za budżet
    if (normalizedData.budget < 30000) {
      if (car.priceCategory === "budget") score += 25;
      if (car.priceCategory === "mid") score += 10;
    } else if (normalizedData.budget >= 30000 && normalizedData.budget < 70000) {
      if (car.priceCategory === "mid") score += 20;
      if (car.priceCategory === "budget") score += 10;
    } else if (normalizedData.budget >= 70000) {
      if (car.priceCategory === "premium") score += 15;
      if (car.priceCategory === "mid") score += 20;
    }
    
    // Punkty za parking
    if (normalizedData.parkingType === "street") {
      score += car.cityFriendly * 8;
      if (car.segment === "A" || car.segment === "B") score += 20;
    } else if (normalizedData.parkingType === "mixed") {
      score += car.cityFriendly * 6;
      if (car.segment === "A" || car.segment === "B" || car.segment === "C") score += 15;
    }
    
    // Punkty za umiejętności mechaniczne
    if (normalizedData.mechanicalSkills === "none") {
      score += car.reliability * 12;
    } else if (normalizedData.mechanicalSkills === "basic") {
      score += car.reliability * 8;
    }
    
    // Punkty za teren
    if (normalizedData.terrainType === "hilly" || normalizedData.terrainType === "mixed") {
      if (car.segment.includes("SUV") || car.driveType.includes("4x4")) {
        score += 35;
      }
      score += car.groundClearance / 10;
    }
    
    // Punkty za preferowany wiek auta
    if (normalizedData.carAge === "new") {
      score += car.reliability * 5; // Nowe są bardziej niezawodne
    } else if (normalizedData.carAge === "young") {
      if (car.reliability >= 8) score += 25; // Używane - ważna niezawodność
    } else if (normalizedData.carAge === "old") {
      if (car.reliability >= 9) score += 30; // Stare - kluczowa niezawodność
    }
    
    // Punkty za bagażnik (dokładne dopasowanie)
    if (trunkReq) {
      if (car.trunkMax >= trunkReq.min && car.trunkMax <= trunkReq.max + 200) {
        score += 30; // Idealny bagażnik
      } else if (car.trunkMax >= trunkReq.min) {
        score += 15; // Większy niż wymagany - też OK
      } else if (car.trunkMax >= trunkReq.min * 0.8) {
        score += 5; // Trochę za mały, ale do przejścia
      }
    }
    
    // Punkty za przyspieszenie
    if (car.accelerationTime <= accelerationReq) {
      score += 15; // Spełnia wymagania
    } else if (car.accelerationTime <= accelerationReq + 2) {
      score += 8; // Nieznacznie wolniejszy
    }
    
    // Punkty za prześwit
    if (car.groundClearance >= clearanceReq) {
      score += 10; // Spełnia wymagania
    } else if (clearanceReq > 0 && car.groundClearance >= clearanceReq * 0.9) {
      score += 5; // Blisko wymaganego
    }
    
    // Punkty za zdolności zimowe
    if (car.winterCapability >= winterReq) {
      score += 12; // Spełnia wymagania
    } else if (car.winterCapability >= winterReq - 1) {
      score += 6; // Prawie OK
    }
    
    // Punkty za planowany czas posiadania
    if (normalizedData.plannedOwnership === "long") {
      score += car.reliability * 12; // Niezawodność najważniejsza
    } else if (normalizedData.plannedOwnership === "medium") {
      score += car.reliability * 7;
    }
    
    // Punkty za preferowaną markę (jeśli jakieś Toyota/Honda/Mazda/VW/Škoda)
    if (normalizedData.brandPreference === "japanese") {
      if (car.name.includes("Toyota") || car.name.includes("Honda") || 
          car.name.includes("Mazda") || car.name.includes("Nissan") ||
          car.name.includes("Subaru")) {
        score += 20;
      }
    } else if (normalizedData.brandPreference === "german") {
      if (car.name.includes("Volkswagen") || car.name.includes("Audi")) {
        score += 20;
      }
    } else if (normalizedData.brandPreference === "french") {
      if (car.name.includes("Renault") || car.name.includes("Peugeot") || 
          car.name.includes("Citroën")) {
        score += 20;
      }
    }
    
    return { car, score };
  });

  // Sortowanie po punktach
  scoredCars.sort((a, b) => b.score - a.score);

  // Wybór top 3-5 rekomendacji
  const topCars = scoredCars.slice(0, 5);

  // Generowanie szczegółowych rekomendacji
  topCars.forEach((item, index) => {
    const car = item.car;
    
    // Generowanie ostrzeżeń
    const warnings: string[] = [];
    
    if (normalizedData.driveLocation === "city" && car.cityFriendly < 7) {
      warnings.push("Może być mniej komfortowy w ruchu miejskim");
    }
    
    if (normalizedData.parkingType === "street" && car.segment.includes("D")) {
      warnings.push("Duże wymiary mogą utrudniać parkowanie na ulicy");
    }
    
    if (normalizedData.mechanicalSkills === "none" && car.reliability < 8) {
      warnings.push("Może wymagać częstszych wizyt w warsztacie");
    }
    
    if (normalizedData.budget < 40000 && car.priceCategory === "premium") {
      warnings.push("Może przekraczać zakładany budżet");
    }
    
    if (towingReq > 0 && car.towingCapacity < towingReq + 200) {
      warnings.push(`Masa holownicza na granicy wymagań (${car.towingCapacity} kg)`);
    }
    
    if (trunkReq && car.trunkMax < trunkReq.min + 100) {
      warnings.push(`Bagażnik na dolnej granicy wymagań (${car.trunkMax}L)`);
    }

    // Generowanie sugestii
    const suggestions: string[] = [];
    
    if (car.fuelTypes.includes("hybryda")) {
      suggestions.push("Wersja hybrydowa zmniejszy koszty eksploatacji");
    }
    
    if (car.driveType.includes("4x4") && normalizedData.terrainType !== "hilly") {
      suggestions.push("Napęd 4x4 opcjonalny - w Twoim przypadku może być zbędny");
    }
    
    if (car.transmission.includes("manual") && normalizedData.driveLocation === "city") {
      suggestions.push("Rozważ wersję z automatem dla większego komfortu w mieście");
    }
    
    if (car.bodyStyle.includes("Kombi") && normalizedData.annualMileage === "high") {
      suggestions.push("Wersja Kombi zapewni więcej miejsca na bagaże");
    }
    
    if (car.segment.includes("SUV") && data.heightClearance === "low") {
      suggestions.push("Wysoki prześwit może być niepotrzebny - rozważ wersję bez napędu 4x4");
    }
    
    if (data.plannedOwnership === "long" && car.reliability >= 9) {
      suggestions.push("Wysoka niezawodność sprawdzi się przy długoterminowym użytkowaniu");
    }

    // Generowanie matchScore
    const maxScore = Math.max(...scoredCars.map(s => s.score));
    const matchScore = Math.round((item.score / maxScore) * 100);

    // Generowanie rekomendacji
    recommendations.push({
      type: car.segment,
      reasoning: `${car.name} idealnie pasuje do Twoich potrzeb. ${
        matchScore > 90 ? "Prawie idealne dopasowanie!" :
        matchScore > 75 ? "Bardzo dobre dopasowanie." :
        matchScore > 60 ? "Dobre dopasowanie z drobnymi kompromisami." :
        "Dopasowanie z pewnymi ograniczeniami."
      }`,
      models: [car.name],
      warnings,
      suggestions,
      matchScore,
      segment: car.segment,
      bodyStyle: car.bodyStyle,
      trunkCapacity: `${car.trunkMin}-${car.trunkMax} litrów`,
      accelerationTime: `${car.accelerationTime} s (0-100 km/h)`,
      towingCapacity: car.towingCapacity > 0 ? `${car.towingCapacity} kg` : "Brak możliwości holowania",
      groundClearance: `${car.groundClearance} mm`,
      enginePower: `${car.enginePower} KM`,
      fuelTypes: car.fuelTypes.join(", "),
      transmissionType: car.transmission.join(" / "),
      driveType: car.driveType,
      winterCapability: `${car.winterCapability}/10`,
      reliability: `${car.reliability}/10`,
      cityFriendly: `${car.cityFriendly}/10`,
      priceCategory: car.priceCategory === "budget" ? "Budżetowa" : 
                     car.priceCategory === "mid" ? "Średnia" : "Premium"
    });
  });

  // Jeśli nie znaleziono żadnych pasujących aut
  if (recommendations.length === 0) {
    recommendations.push({
      type: "Brak dopasowania",
      reasoning: "Niestety, nie znaleźliśmy samochodu idealnie pasującego do wszystkich Twoich wymagań. Rozważ kompromis w niektórych kategoriach.",
      models: [],
      warnings: ["Twoje wymagania mogą być zbyt restrykcyjne"],
      suggestions: [
        "Rozważ złagodzenie wymagań dotyczących bagażnika",
        "Być może niektóre funkcje nie są absolutnie konieczne",
        "Skonsultuj się z dealerem w sprawie indywidualnej konfiguracji"
      ],
      matchScore: 0,
      segment: "N/A",
      bodyStyle: "N/A",
      trunkCapacity: "N/A",
      accelerationTime: "N/A",
      towingCapacity: "N/A",
      groundClearance: "N/A",
      enginePower: "N/A",
      fuelTypes: "N/A",
      transmissionType: "N/A",
      driveType: "N/A",
      winterCapability: "N/A",
      reliability: "N/A",
      cityFriendly: "N/A",
      priceCategory: "N/A"
    });
  }

  return recommendations;
}
