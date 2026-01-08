import { FormData, Recommendation } from "../types";

// Tymczasowo zwracamy pustą tablicę - później dodamy prawdziwą integrację z API
export function generateRecommendation(data: FormData): Recommendation[] {
  console.log("FormData received:", data);
  
  // Tymczasowo zwracamy pustą tablicę
  // W przyszłości tutaj będzie:
  // 1. Wywołanie calculateRequirements()
  // 2. Zapytanie do API Otomoto/AutoScout24 z wymaganymi parametrami
  // 3. Scoring i filtrowanie wyników
  
  return [];
}
