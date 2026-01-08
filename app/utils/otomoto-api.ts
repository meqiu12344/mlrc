import { CalculatedRequirements, CarOffer } from '../types';

// Interfejs dla odpowiedzi z Otomoto API
interface OtomotoListing {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  enginePower: number;
  bodyStyle: string;
  image?: string;
  location?: string;
  url: string;
  make: string;
  model: string;
}

// Mapowanie polskich nazw paliwa
const fuelTypeNormalization: { [key: string]: string } = {
  'benzyna': 'petrol',
  'diesel': 'diesel',
  'hybryda': 'hybrid',
  'elektryczny': 'electric',
  'petrol': 'petrol',
  'hybrid': 'hybrid',
  'electric': 'electric',
  'lpg': 'lpg'
};

// Mapowanie nadwozi
const bodyStyleNormalization: { [key: string]: string } = {
  'sedan': 'sedan',
  'kombi': 'estate',
  'hatchback': 'hatchback',
  'suv': 'suv',
  'van': 'van',
  'estate': 'estate',
  'coupe': 'coupe',
  'kabriolet': 'convertible'
};

/**
 * Szuka ofert na Otomoto na podstawie wyliczonych wymagań
 * Używa publicznego URL-a Otomoto z query parameters
 */
export async function searchOtomoto(requirements: CalculatedRequirements, userBudget: number): Promise<CarOffer[]> {
  try {
    // Budujemy parametry wyszukiwania
    const params = new URLSearchParams();
    
    // Budżet
    if (userBudget > 0) {
      const maxPrice = Math.round(userBudget * 1.2); // Dodajemy 20% marginesu
      params.append('price_to', maxPrice.toString());
    }
    
    // Moc silnika
    params.append('engine_power_from', requirements.minPower.toString());
    
    // Preferowana moc paliwa - szukamy benzyny dla universalności
    // Otomoto używa: benzyna, diesel, hybryda, elektryczny, lpg
    
    console.log('Searching Otomoto with params:', Object.fromEntries(params));
    
    // UWAGA: Otomoto nie ma publicznego REST API
    // Rozwiązanie: używamy web scraping'u lub mock'ujemy dane
    // Dla tej implementacji zwracamy mockowe dane oparte na wymaganiach
    
    return generateMockOtomotoResults(requirements, userBudget);
    
  } catch (error) {
    console.error('Error searching Otomoto:', error);
    return [];
  }
}

/**
 * Generuje mockowe wyniki z Otomoto na podstawie parametrów
 * W przyszłości to będzie prawdziwy scraping lub API
 */
function generateMockOtomotoResults(requirements: CalculatedRequirements, userBudget: number): CarOffer[] {
  const mockListings: OtomotoListing[] = [
    {
      id: 'oto-001',
      title: 'Toyota Corolla 2020 1.6 Benzyna Automat',
      price: userBudget * 0.8,
      year: 2020,
      mileage: 45000,
      fuelType: 'benzyna',
      transmission: 'Automat',
      enginePower: 130,
      bodyStyle: 'sedan',
      image: 'https://images.otomoto.pl/...',
      location: 'Wrocław',
      url: 'https://otomoto.pl/oferta/...',
      make: 'Toyota',
      model: 'Corolla'
    },
    {
      id: 'oto-002',
      title: 'Skoda Octavia 2019 1.5 TSI Benzyna DSG',
      price: userBudget * 0.85,
      year: 2019,
      mileage: 62000,
      fuelType: 'benzyna',
      transmission: 'DSG',
      enginePower: 150,
      bodyStyle: 'kombi',
      image: 'https://images.otomoto.pl/...',
      location: 'Poznań',
      url: 'https://otomoto.pl/oferta/...',
      make: 'Skoda',
      model: 'Octavia'
    },
    {
      id: 'oto-003',
      title: 'Ford Focus 2021 1.0 Ecoboost Benzyna',
      price: userBudget * 0.9,
      year: 2021,
      mileage: 38000,
      fuelType: 'benzyna',
      transmission: 'Manualna',
      enginePower: 125,
      bodyStyle: 'hatchback',
      image: 'https://images.otomoto.pl/...',
      location: 'Kraków',
      url: 'https://otomoto.pl/oferta/...',
      make: 'Ford',
      model: 'Focus'
    },
    {
      id: 'oto-004',
      title: 'Volkswagen Passat 2020 2.0 TDI Diesel DSG',
      price: userBudget * 0.95,
      year: 2020,
      mileage: 55000,
      fuelType: 'diesel',
      transmission: 'DSG',
      enginePower: 150,
      bodyStyle: 'kombi',
      image: 'https://images.otomoto.pl/...',
      location: 'Warszawa',
      url: 'https://otomoto.pl/oferta/...',
      make: 'Volkswagen',
      model: 'Passat'
    },
    {
      id: 'oto-005',
      title: 'Mazda CX-5 2021 2.0 Benzyna 4x4',
      price: userBudget,
      year: 2021,
      mileage: 48000,
      fuelType: 'benzyna',
      transmission: 'Automat',
      enginePower: 165,
      bodyStyle: 'suv',
      image: 'https://images.otomoto.pl/...',
      location: 'Gdańsk',
      url: 'https://otomoto.pl/oferta/...',
      make: 'Mazda',
      model: 'CX-5'
    }
  ];

  // Przetwarzamy na CarOffer ze scoringiem
  return mockListings
    .map(listing => scoreOffer(listing, requirements))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // Zwracamy top 5
}

/**
 * Oblicza procent dopasowania oferty do wymagań
 */
function scoreOffer(listing: OtomotoListing, requirements: CalculatedRequirements): CarOffer {
  let score = 50; // Bazowa punktacja
  const maxScore = 100;
  const issues: string[] = [];

  // 1. Moc silnika (ważne)
  if (listing.enginePower >= requirements.minPower) {
    const powerBonus = Math.min(15, (listing.enginePower - requirements.minPower) / 10);
    score += powerBonus;
  } else {
    const powerPenalty = (requirements.minPower - listing.enginePower) / requirements.minPower * 20;
    score -= powerPenalty;
    issues.push(`Moc ${listing.enginePower} KM poniżej wymaganego minimum ${requirements.minPower} KM`);
  }

  // 2. Rok produkcji (nowsze = lepiej)
  const age = new Date().getFullYear() - listing.year;
  if (age <= 5) {
    score += 10;
  } else if (age <= 10) {
    score += 5;
  } else {
    score -= 5;
    issues.push(`Auto ma ${age} lat - starsze niż preferowane`);
  }

  // 3. Przebieg (mniej = lepiej)
  if (listing.mileage <= 50000) {
    score += 10;
  } else if (listing.mileage <= 100000) {
    score += 5;
  } else {
    score -= 5;
    issues.push(`Przebieg ${listing.mileage} km - wyższy niż średnio w tej kategorii`);
  }

  // 4. Transmisja (automat jest preferowany dla komfortu)
  if (listing.transmission.toLowerCase().includes('automat') || 
      listing.transmission.toLowerCase().includes('dsg') ||
      listing.transmission.toLowerCase().includes('cvt')) {
    score += 5;
  }

  // 5. Typ paliwa
  if (listing.fuelType.toLowerCase().includes('benzyna')) {
    score += 3; // Benzyna uniwersalna
  } else if (listing.fuelType.toLowerCase().includes('diesel')) {
    score += 2; // Diesel oszczędzieć
  }

  // 6. Nadwozie
  if (requirements.recommendedBodyStyles.length > 0) {
    const bodyStyleLower = listing.bodyStyle.toLowerCase();
    const isPreferred = requirements.recommendedBodyStyles.some(style =>
      bodyStyleLower.includes(style.toLowerCase()) ||
      style.toLowerCase().includes(bodyStyleLower)
    );
    if (isPreferred) {
      score += 8;
    } else {
      score -= 5;
      issues.push(`Nadwozie ${listing.bodyStyle} - nie jest rekomendowane`);
    }
  }

  // 7. SUV/4x4 jeśli potrzebne
  if (requirements.awd4x4Needed) {
    if (listing.bodyStyle.toLowerCase().includes('suv') || 
        listing.title.toLowerCase().includes('4x4') ||
        listing.title.toLowerCase().includes('awd')) {
      score += 10;
    } else {
      score -= 15;
      issues.push('Brak napędu 4x4 - a teren wymaga');
    }
  }

  score = Math.max(0, Math.min(maxScore, score));

  return {
    id: listing.id,
    source: 'otomoto',
    make: listing.make,
    model: listing.model,
    year: listing.year,
    mileage: listing.mileage,
    price: Math.round(listing.price),
    enginePower: listing.enginePower,
    fuelType: listing.fuelType,
    transmission: listing.transmission,
    driveType: listing.bodyStyle,
    trunkCapacity: 0, // API Otomoto nie zawsze zawiera to
    matchScore: Math.round(score),
    meetsRequirements: score >= 60,
    warnings: issues,
    url: listing.url,
    imageUrl: listing.image,
    location: listing.location
  };
}

/**
 * Funkcja pomocnicza do budowania realistycznych parametrów dla scraping'u
 */
export function buildOtomotoSearchUrl(requirements: CalculatedRequirements, budget: number): string {
  const baseUrl = 'https://otomoto.pl/';
  
  const params = {
    // Budżet
    'price_to': Math.round(budget * 1.2),
    // Moc
    'engine_power_from': requirements.minPower,
    // Nadwozie
    'body_type': requirements.recommendedBodyStyles[0]?.toLowerCase() || '',
    // Sortowanie po dacie (najnowsze pierwsze)
    'sort': 'add_date:desc'
  };

  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return `${baseUrl}?${queryString}`;
}
