import { NextRequest, NextResponse } from 'next/server';

interface CarModel {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  bodyType: string;
  fuelType: string;
  power: number;
  torque: number;
  acceleration: number;
  trunkCapacity: number;
  trunkCapacityMax?: number;
  seats: number;
  hasThirdRow: boolean;
  length: number;
  width: number;
  height: number;
  fuelConsumption: number;
  co2: number;
  price: number;
  imageUrl: string;
  features: string[];
  rating: number;
}

type RequirementsPayload = {
  trunkRecommended?: number;
  trunkMinimum?: number;
  minimumPower?: number;
  maximumAcceleration?: number;
  minimumSeats?: number;
  thirdRowNeeded?: boolean;
  preferredFuelTypes?: string[];
  olxSearchRegion?: string;
};

const REGION_TO_WOJ_CODE: Record<string, string> = {
  'dolnoslaskie': '02',
  'kujawsko-pomorskie': '04',
  'lubelskie': '06',
  'lubuskie': '08',
  'lodzkie': '10',
  'łódzkie': '10',
  'malopolskie': '12',
  'małopolskie': '12',
  'mazowieckie': '14',
  'opolskie': '16',
  'podkarpackie': '18',
  'podlaskie': '20',
  'pomorskie': '22',
  'slaskie': '24',
  'śląskie': '24',
  'swietokrzyskie': '26',
  'świętokrzyskie': '26',
  'warminsko-mazurskie': '28',
  'warmińsko-mazurskie': '28',
  'wielkopolskie': '30',
  'zachodniopomorskie': '32'
};

const FUEL_TO_CEPIK: Record<string, string> = {
  benzyna: 'BENZYNA',
  diesel: 'OLEJ NAPĘDOWY',
  elektryczny: 'ELEKTRYCZNY',
  electric: 'ELEKTRYCZNY',
  lpg: 'GAZ PŁYNNY LPG'
};

function normalize(str?: string | null): string | null {
  if (!str) return null;
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function parseNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : typeof n === 'string' ? Number(n) : NaN;
  return Number.isFinite(num) ? num : 0;
}

function buildDateRange() {
  const now = new Date();
  const dateTo = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const from = new Date(now);
  from.setFullYear(now.getFullYear() - 10); // szersze okno czasowe, żeby łatwiej trafić wyniki
  const dateFrom = `${from.getFullYear()}${String(from.getMonth() + 1).padStart(2, '0')}${String(from.getDate()).padStart(2, '0')}`;
  return { dateFrom, dateTo };
}

function buildCepikUrl(params: { wojCode?: string | null; fuel?: string | null; dateFrom?: string | null; dateTo?: string | null }) {
  const base = new URL('https://api.cepik.gov.pl/pojazdy');
  if (params.wojCode) base.searchParams.set('wojewodztwo', params.wojCode);
  if (params.dateFrom) base.searchParams.set('data-od', params.dateFrom);
  if (params.dateTo) base.searchParams.set('data-do', params.dateTo);
  base.searchParams.set('pokaz-wszystkie-pola', 'true');
  base.searchParams.set('limit', '300');
  base.searchParams.set('page', '1');
  if (params.fuel) base.searchParams.append('filter[rodzaj-paliwa]', params.fuel);
  base.searchParams.append('sort', '-rok-produkcji');
  return base.toString();
}

function calculateMatchScore(car: CarModel, requirements: RequirementsPayload, cepikFuel?: string | null) {
  let score = 0;
  let maxScore = 0;

  // Moc (waga 40%) — łagodniejsze progi
  maxScore += 40;
  const minPower = requirements.minimumPower ?? 0;
  const hasPower = car.power > 0;
  const powerScore = !hasPower
    ? 25
    : car.power >= minPower
      ? 40
      : car.power >= minPower * 0.8
        ? 30
        : car.power >= minPower * 0.6
          ? 22
          : 15;
  score += powerScore;

  // Miejsca (waga 40%) — daj punkty nawet przy drobnych brakach
  maxScore += 40;
  const seatsNeeded = requirements.minimumSeats ?? 0;
  const seats = car.seats;
  const seatsMatch = seats >= seatsNeeded;
  const thirdRowNeeded = requirements.thirdRowNeeded;
  const thirdRowMatch = thirdRowNeeded ? car.hasThirdRow : true;
  const seatsScore = seats === 0
    ? 24
    : seatsMatch && thirdRowMatch
      ? 40
      : seatsMatch
        ? 32
        : seats + 1 >= seatsNeeded
          ? 26
          : 18;
  score += seatsScore;

  // Paliwo (waga 20%) — lekka preferencja, brak twardego filtra
  maxScore += 20;
  const fuelPref = requirements.preferredFuelTypes?.map(f => f.toLowerCase()) || [];
  const carFuel = (car.fuelType || '').toLowerCase();
  const fuelScore = fuelPref.length === 0
    ? 10
    : fuelPref.includes(carFuel)
      ? 20
      : cepikFuel && car.fuelType.toUpperCase() === cepikFuel
        ? 15
        : 10;
  score += fuelScore;

  return Math.round((score / maxScore) * 100);
}

function mapCepikToCar(item: any): CarModel {
  const attrs = item?.attributes || {};
  const seats = parseNumber(attrs['liczba-miejsc-ogolem']);
  return {
    id: item?.id || crypto.randomUUID(),
    brand: attrs['marka'] || 'Nieznana',
    model: attrs['model'] || '',
    variant: attrs['wariant'] || attrs['wersja'] || '',
    year: parseNumber(attrs['rok-produkcji']),
    bodyType: attrs['rodzaj-pojazdu'] || attrs['typ'] || 'Nieznany',
    fuelType: attrs['rodzaj-paliwa'] || '',
    power: parseNumber(attrs['moc-netto-silnika']),
    torque: parseNumber(attrs['moment-obrotowy-silnika']),
    acceleration: 0,
    trunkCapacity: parseNumber(attrs['pojemnosc-bagaznika']) || 0,
    trunkCapacityMax: undefined,
    seats,
    hasThirdRow: seats >= 7,
    length: parseNumber(attrs['dlugosc']),
    width: parseNumber(attrs['szerokosc']),
    height: parseNumber(attrs['wysokosc']),
    fuelConsumption: parseNumber(attrs['avg-zuzycie-paliwa']),
    co2: parseNumber(attrs['poziom-emisji-co2']),
    price: 0,
    imageUrl: '',
    features: [],
    rating: 0
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requirements } = body as { requirements?: RequirementsPayload };

    if (!requirements) {
      return NextResponse.json({ error: 'Brak wymagań w zapytaniu' }, { status: 400 });
    }

    const normalizedRegion = normalize(requirements.olxSearchRegion);
    const wojCode = normalizedRegion ? REGION_TO_WOJ_CODE[normalizedRegion] : null; // brak domyślnego regionu, żeby nie zawężać
    const fuelPref = (requirements.preferredFuelTypes?.[0] || '').toLowerCase();
    const cepikFuel = FUEL_TO_CEPIK[fuelPref];
    const { dateFrom, dateTo } = buildDateRange();
    const url = buildCepikUrl({ wojCode, fuel: null, dateFrom, dateTo });

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Nie udało się pobrać danych z CEPiK', details: text }, { status: 502 });
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.data) ? data.data : [];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Brak wyników z CEPiK dla podanych kryteriów' }, { status: 502 });
    }

    const carsWithScores = items.map(mapCepikToCar).map(car => ({
      ...car,
      rating: calculateMatchScore(car, requirements, cepikFuel)
    }));

    const sortedCars = carsWithScores.sort((a, b) => b.rating - a.rating).slice(0, 30);

    return NextResponse.json({ success: true, cars: sortedCars, totalCount: items.length });
  } catch (error: any) {
    console.error('Błąd API search-cars:', error);
    return NextResponse.json({ error: 'Błąd serwera', details: error?.message || String(error) }, { status: 500 });
  }
}
