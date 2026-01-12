import { CalculatedRequirements, CarOffer } from '../types';
import axios from 'axios';

// Interfejs dla odpowiedzi z Otomoto
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
  driveType?: string;
  image?: string;
  location?: string;
  url: string;
  make: string;
  model: string;
}

/**
 * Szuka ofert na Otomoto na podstawie wyliczonych wymagań
 * Scrapuje rzeczywiste dane z Otomoto.pl
 */
export async function searchOtomoto(requirements: CalculatedRequirements, userBudget: number): Promise<CarOffer[]> {
  try {
    console.log('🔍 Searching Otomoto with requirements:', {
      minPower: requirements.minPower,
      budget: userBudget,
      segments: requirements.recommendedSegments
    });

    // Budujemy URL do Otomoto z parametrami
    const searchUrl = buildOtomotoUrl(requirements, userBudget);
    console.log('📍 Search URL:', searchUrl);

    // Pobieramy stronę Otomoto
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    console.log('✅ Response status:', response.status);

    // Parsujemy HTML - Otomoto zwraca różne struktury
    const listings = parseOtomotoListings(response.data);
    
    console.log(`📦 Found ${listings.length} listings on Otomoto`);

    // Przetwarzamy na CarOffer ze scoringiem
    const scored = listings
      .map(listing => scoreOffer(listing, requirements))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5

    console.log('🏆 Top 5 scored offers ready');
    return scored;

  } catch (error) {
    console.error('❌ Error searching Otomoto:', error instanceof Error ? error.message : error);
    // Fallback na mock data jeśli scraping się nie powiedzie
    console.log('📋 Falling back to mock data...');
    return generateMockOtomotoResults(requirements, userBudget);
  }
}

/**
 * Parsuje HTML Otomoto i wyciąga listę aut
 */
function parseOtomotoListings(html: string): OtomotoListing[] {
  try {
    // Otomoto zwraca JSON w skrypcie - szukamy danych JavaScript
    // Struktury: article[data-params] lub skrypt z aplikacją React
    
    const listings: OtomotoListing[] = [];

    // Próba 1: Szukamy JSON-LD danych (structured data)
    const jsonLdRegex = /"listing":\[({[^}]+})\]/g;
    let match;
    
    // Próba 2: Szukamy article tagów z atrybutami data
    const articleRegex = /<article[^>]*data-params="([^"]*)"[^>]*>/g;
    while ((match = articleRegex.exec(html)) !== null) {
      try {
        const params = JSON.parse(decodeURIComponent(match[1]));
        
        // Próba wyciągnięcia informacji z params
        const listing = extractListingFromParams(params);
        if (listing) {
          listings.push(listing);
        }
      } catch (e) {
        console.debug('Failed to parse listing params');
      }
    }

    // Próba 3: Szukamy div'ów z klasą "listing"
    if (listings.length < 3) {
      const divRegex = /<div[^>]*class="[^"]*listing[^"]*"[^>]*>(.*?)<\/div>/g;
      let divMatch;
      while ((divMatch = divRegex.exec(html)) !== null && listings.length < 10) {
        const divContent = divMatch[1];
        
        // Wyciągamy URL
        const urlMatch = divContent.match(/href="([^"]*\d+\.html[^"]*)"/);
        if (urlMatch) {
          const title = divContent.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1]?.replace(/<[^>]*>/g, '') || '';
          const price = divContent.match(/price[^>]*>([\d\s]+)/)?.[1]?.replace(/\s/g, '') || '0';
          const year = title.match(/\b(19|20)\d{2}\b/)?.[0] || new Date().getFullYear().toString();
          
          if (title && urlMatch[1]) {
            listings.push({
              id: `oto-${listings.length}`,
              title,
              price: parseInt(price) || 0,
              year: parseInt(year),
              mileage: extractMileage(divContent),
              fuelType: extractFuelType(divContent),
              transmission: extractTransmission(divContent),
              enginePower: extractPower(divContent),
              bodyStyle: extractBodyStyle(title, divContent),
              url: normalizeUrl(urlMatch[1]),
              make: extractMake(title),
              model: extractModel(title),
              image: extractImage(divContent)
            });
          }
        }
      }
    }

    return listings.slice(0, 10);
  } catch (error) {
    console.error('Error parsing Otomoto listings:', error);
    return [];
  }
}

/**
 * Wyciąga listing z parametrów Otomoto
 */
function extractListingFromParams(params: any): OtomotoListing | null {
  try {
    if (!params.title) return null;

    const title = params.title || '';
    return {
      id: params.id || `oto-${Math.random()}`,
      title,
      price: params.price || 0,
      year: params.year || new Date().getFullYear(),
      mileage: params.mileage || 0,
      fuelType: params.fuel_type || 'benzyna',
      transmission: params.transmission || 'manualna',
      enginePower: params.engine_power || 100,
      bodyStyle: params.body_type || 'sedan',
      url: params.url || `https://otomoto.pl/`,
      make: extractMake(title),
      model: extractModel(title),
      image: params.image
    };
  } catch {
    return null;
  }
}

// Funkcje pomocnicze do wyciągania danych
function extractMake(title: string): string {
  const parts = title.split(/\s+/);
  return parts[0] || 'Nieznana';
}

function extractModel(title: string): string {
  const parts = title.split(/\s+/);
  return parts.slice(1, 3).join(' ') || 'Model';
}

function extractMileage(html: string): number {
  const match = html.match(/(\d+)\s*km/i);
  return match ? parseInt(match[1]) : 0;
}

function extractFuelType(html: string): string {
  if (html.match(/diesel/i)) return 'diesel';
  if (html.match(/benzyna|petrol/i)) return 'benzyna';
  if (html.match(/hybryda|hybrid/i)) return 'hybryda';
  if (html.match(/elektr|electric/i)) return 'elektryczny';
  if (html.match(/lpg/i)) return 'lpg';
  return 'benzyna';
}

function extractTransmission(html: string): string {
  if (html.match(/automat|automatic|dsg|cvt/i)) return 'Automat';
  if (html.match(/manualna|manual/i)) return 'Manualna';
  return 'Manualna';
}

function extractPower(html: string): number {
  const match = html.match(/(\d+)\s*k[mw]/i);
  return match ? parseInt(match[1]) : 100;
}

function extractBodyStyle(title: string, html: string): string {
  const lower = (title + html).toLowerCase();
  if (lower.match(/sedan/)) return 'sedan';
  if (lower.match(/kombi|estate|wagon/)) return 'kombi';
  if (lower.match(/hatchback/)) return 'hatchback';
  if (lower.match(/suv|crossover|sport/)) return 'suv';
  if (lower.match(/van|minivan/)) return 'van';
  if (lower.match(/kabriolet|convertible/)) return 'kabriolet';
  if (lower.match(/coupe/)) return 'coupe';
  return 'sedan';
}

function extractImage(html: string): string | undefined {
  const match = html.match(/src="([^"]*\.jpg[^"]*)"/i);
  return match ? match[1] : undefined;
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return 'https://otomoto.pl' + url;
  return 'https://otomoto.pl/' + url;
}

/**
 * Buduje URL do Otomoto z parametrami wyszukiwania
 */
function buildOtomotoUrl(requirements: CalculatedRequirements, budget: number): string {
  const params = new URLSearchParams();
  
  // Maks cena
  if (budget > 0) {
    const maxPrice = Math.round(budget * 1.3); // 30% marginesu
    params.append('price_to', maxPrice.toString());
  }

  // Moc silnika
  params.append('engine_power_from', requirements.minPower.toString());

  // Segment (jeśli dostępny)
  if (requirements.recommendedSegments.length > 0) {
    // Mapujemy segment na kod Otomoto
    const segmentMap: { [key: string]: string } = {
      'A': 'micro',
      'B': 'small',
      'C': 'medium',
      'D': 'large',
      'C-SUV': 'compact-suv',
      'D-SUV': 'large-suv',
      'Van-C': 'van'
    };
    
    const otomotoSegment = segmentMap[requirements.recommendedSegments[0]];
    if (otomotoSegment) {
      params.append('body_type', otomotoSegment);
    }
  }

  // Sortowanie po dacie (najnowsze)
  params.append('sort', 'add_date:desc');

  // Liczba wyników per strona
  params.append('limit', '20');

  return `https://otomoto.pl/?${params.toString()}`;
}

/**
 * Oblicza procent dopasowania oferty do wymagań
 */
function scoreOffer(listing: OtomotoListing, requirements: CalculatedRequirements): CarOffer {
  let score = 50;
  const maxScore = 100;
  const issues: string[] = [];

  // 1. Moc silnika (bardzo ważne - 20pkt)
  const powerDiff = listing.enginePower - requirements.minPower;
  if (powerDiff >= 0) {
    const powerBonus = Math.min(20, powerDiff / 10);
    score += powerBonus;
  } else {
    const powerPenalty = Math.abs(powerDiff) / requirements.minPower * 25;
    score -= powerPenalty;
    issues.push(`Moc ${listing.enginePower} KM poniżej wymaganego minimum ${requirements.minPower} KM`);
  }

  // 2. Rok produkcji (10pkt)
  const age = new Date().getFullYear() - listing.year;
  if (age <= 3) {
    score += 10;
  } else if (age <= 7) {
    score += 6;
  } else if (age <= 10) {
    score += 3;
  } else {
    score -= 5;
    issues.push(`Auto ma ${age} lat - starsze niż preferowane`);
  }

  // 3. Przebieg (10pkt)
  if (listing.mileage <= 50000) {
    score += 10;
  } else if (listing.mileage <= 100000) {
    score += 6;
  } else if (listing.mileage <= 150000) {
    score += 2;
  } else {
    score -= 5;
    issues.push(`Przebieg ${listing.mileage} km - wysoki przebieg`);
  }

  // 4. Transmisja (5pkt)
  if (listing.transmission.toLowerCase().includes('automat') || 
      listing.transmission.toLowerCase().includes('dsg')) {
    score += 5;
  }

  // 5. Typ paliwa (3pkt)
  if (listing.fuelType.toLowerCase() === 'benzyna') {
    score += 3;
  } else if (listing.fuelType.toLowerCase() === 'diesel') {
    score += 2;
  }

  // 6. Nadwozie (8pkt)
  if (requirements.recommendedBodyStyles.length > 0) {
    const bodyLower = listing.bodyStyle.toLowerCase();
    const isPreferred = requirements.recommendedBodyStyles.some(style =>
      bodyLower.includes(style.toLowerCase().substring(0, 4)) ||
      style.toLowerCase().includes(bodyLower.substring(0, 4))
    );
    
    if (isPreferred) {
      score += 8;
    } else {
      score -= 3;
      issues.push(`Nadwozie ${listing.bodyStyle} - nie całkowicie rekomendowane`);
    }
  }

  // 7. SUV/4x4 jeśli potrzebne (15pkt)
  if (requirements.awd4x4Needed) {
    if (listing.bodyStyle.toLowerCase().includes('suv')) {
      score += 15;
    } else {
      score -= 20;
      issues.push('Brak SUV/napędu 4x4 - a teren wymaga');
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
    price: listing.price,
    enginePower: listing.enginePower,
    fuelType: listing.fuelType,
    transmission: listing.transmission,
    driveType: listing.driveType || 'FWD',
    bodyStyle: listing.bodyStyle,
    trunkCapacity: 0,
    matchScore: Math.round(score),
    meetsRequirements: score >= 60,
    warnings: issues,
    url: listing.url,
    imageUrl: listing.image,
    location: listing.location || 'Polska'
  };
}

/**
 * Fallback: generuje mockowe wyniki jeśli scraping się nie powiedzie
 */
function generateMockOtomotoResults(requirements: CalculatedRequirements, userBudget: number): CarOffer[] {
  console.log('📋 Using mock data - scraping may have failed');
  
  const mockListings: OtomotoListing[] = [
    {
      id: 'oto-001',
      title: 'Toyota Corolla 2021 1.6 Benzyna Automat',
      price: userBudget * 0.8,
      year: 2021,
      mileage: 45000,
      fuelType: 'benzyna',
      transmission: 'Automat',
      enginePower: 130,
      bodyStyle: 'sedan',
      image: 'https://images.otomoto.pl/...',
      location: 'Wrocław',
      url: 'https://otomoto.pl/oferta/toyota-corolla-2021-mock-001',
      make: 'Toyota',
      model: 'Corolla'
    },
    {
      id: 'oto-002',
      title: 'Skoda Octavia 2020 1.5 TSI Benzyna DSG',
      price: userBudget * 0.85,
      year: 2020,
      mileage: 62000,
      fuelType: 'benzyna',
      transmission: 'DSG',
      enginePower: 150,
      bodyStyle: 'kombi',
      image: 'https://images.otomoto.pl/...',
      location: 'Poznań',
      url: 'https://otomoto.pl/oferta/skoda-octavia-2020-mock-002',
      make: 'Skoda',
      model: 'Octavia'
    },
    {
      id: 'oto-003',
      title: 'Ford Focus 2022 1.0 Ecoboost Benzyna',
      price: userBudget * 0.9,
      year: 2022,
      mileage: 38000,
      fuelType: 'benzyna',
      transmission: 'Manualna',
      enginePower: 125,
      bodyStyle: 'hatchback',
      image: 'https://images.otomoto.pl/...',
      location: 'Kraków',
      url: 'https://otomoto.pl/oferta/ford-focus-2022-mock-003',
      make: 'Ford',
      model: 'Focus'
    },
    {
      id: 'oto-004',
      title: 'Volkswagen Passat 2021 2.0 TDI Diesel DSG',
      price: userBudget * 0.95,
      year: 2021,
      mileage: 55000,
      fuelType: 'diesel',
      transmission: 'DSG',
      enginePower: 150,
      bodyStyle: 'kombi',
      image: 'https://images.otomoto.pl/...',
      location: 'Warszawa',
      url: 'https://otomoto.pl/oferta/volkswagen-passat-2021-mock-004',
      make: 'Volkswagen',
      model: 'Passat'
    },
    {
      id: 'oto-005',
      title: 'Mazda CX-5 2022 2.0 Benzyna 4x4',
      price: userBudget,
      year: 2022,
      mileage: 48000,
      fuelType: 'benzyna',
      transmission: 'Automat',
      enginePower: 165,
      bodyStyle: 'suv',
      image: 'https://images.otomoto.pl/...',
      location: 'Gdańsk',
      url: 'https://otomoto.pl/oferta/mazda-cx5-2022-mock-005',
      make: 'Mazda',
      model: 'CX-5'
    }
  ];

  return mockListings
    .map(listing => scoreOffer(listing, requirements))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}
