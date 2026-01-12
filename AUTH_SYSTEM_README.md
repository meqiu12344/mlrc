# System Logowania i Profilu Użytkownika - Dokumentacja

## Przegląd

Projekt został rozszerzony o pełny system autentykacji i zarządzania profilem użytkownika, który umożliwia:
- Rejestrację i logowanie użytkowników
- Zapisywanie raportów (zarówno bezpłatnych jak i premium)
- Przeglądanie historii raportów w profilu
- Zarządzanie zapisanymi raportami

## Nowe Pliki i Komponenty

### 1. AuthContext (`app/context/AuthContext.tsx`)
Kontekst zarządzający stanem autentykacji w aplikacji.

**Funkcje:**
- `login(email, password)` - logowanie użytkownika
- `register(email, password, name)` - rejestracja nowego użytkownika
- `logout()` - wylogowanie użytkownika
- `saveReport(report)` - zapisywanie raportu do profilu
- `getSavedReports()` - pobieranie wszystkich raportów użytkownika
- `deleteReport(reportId)` - usuwanie raportu

**Przykład użycia:**
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, saveReport } = useAuth();
  
  if (user) {
    // Użytkownik zalogowany
    console.log(user.name, user.email);
  }
}
```

### 2. AuthModal (`app/components/AuthModal.tsx`)
Modal do logowania i rejestracji użytkowników.

**Props:**
- `onClose: () => void` - funkcja zamykająca modal
- `initialMode?: 'login' | 'register'` - tryb początkowy (domyślnie 'login')

### 3. Strona Profilu (`app/profile/page.tsx`)
Strona profilu użytkownika z listą zapisanych raportów.

**Funkcjonalności:**
- Wyświetlanie informacji o użytkowniku
- Statystyki (liczba raportów, raporty bezpłatne/premium)
- Lista wszystkich zapisanych raportów
- Możliwość otwarcia, usunięcia raportu
- Informacja o premium dla użytkowników darmowych

### 4. Rozszerzone Typy (`app/types.ts`)
Dodane nowe typy:

```typescript
// Użytkownik
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isPremium: boolean;
}

// Zapisany raport
interface SavedReport {
  id: string;
  userId: string;
  createdAt: Date;
  isPaid: boolean; // Czy raport premium został zakupiony
  formData: FormData;
  requirements: CalculatedRequirements;
  offers: CarOffer[];
  title?: string;
}

// Dane logowania
interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}
```

## Aktualizacje Istniejących Komponentów

### Header (`app/components/Header.tsx`)
Dodano:
- Przycisk "Zaloguj się" dla niezalogowanych użytkowników
- Menu użytkownika z opcjami:
  - 📊 Mój profil
  - ✨ Nowy raport
  - 🚪 Wyloguj się
- Integracja z AuthModal

### Results (`app/components/Results.tsx`)
Dodano:
- Przycisk "💾 Zapisz raport w profilu" (widoczny tylko dla zalogowanych)
- Automatyczne oznaczanie czy raport jest płatny (premium) czy bezpłatny
- Potwierdzenie zapisania raportu

### Layout (`app/layout.tsx`)
Dodano `AuthProvider` obok `FormProvider`:
```tsx
<AuthProvider>
  <FormProvider>
    {children}
  </FormProvider>
</AuthProvider>
```

### ResultsPage (`app/results/page.tsx`)
Dodano:
- Ładowanie raportów z profilu (przez sessionStorage)
- Możliwość przeglądania zapisanych raportów

## Przechowywanie Danych

**UWAGA:** Obecnie dane są przechowywane w `localStorage` przeglądarki:
- `users` - tablica wszystkich użytkowników
- `user` - aktualnie zalogowany użytkownik
- `savedReports` - wszystkie zapisane raporty

**Dla produkcji należy:**
1. Zastąpić localStorage backendem z bazą danych
2. Dodać hashowanie haseł (np. bcrypt)
3. Dodać JWT tokeny dla autentykacji
4. Dodać walidację po stronie serwera
5. Dodać rate limiting dla logowania

## Przepływ Użytkownika

### Scenariusz 1: Nowy Użytkownik
1. Użytkownik otwiera aplikację
2. Klika "Zaloguj się" → "Nie masz konta? Zarejestruj się"
3. Wypełnia formularz rejestracji
4. Po rejestracji jest automatycznie zalogowany
5. Przechodzi przez wizard i tworzy raport
6. Klika "💾 Zapisz raport w profilu"
7. Raport jest dostępny w profilu

### Scenariusz 2: Powracający Użytkownik
1. Użytkownik otwiera aplikację
2. Klika "Zaloguj się"
3. Loguje się swoimi danymi
4. Klika swoje imię w prawym górnym rogu → "📊 Mój profil"
5. Widzi listę wszystkich swoich raportów
6. Klika "Otwórz" przy dowolnym raporcie
7. Jest przekierowany do strony wyników z danymi z raportu

### Scenariusz 3: Użytkownik Niezalogowany
1. Użytkownik może normalnie korzystać z aplikacji
2. Może tworzyć raporty
3. Nie może ich zapisywać (przycisk "Zapisz" pojawi się tylko po zalogowaniu)

## Funkcje Premium

System jest przygotowany na rozróżnienie między:
- **Raporty bezpłatne** (`isPaid: false`) - podstawowe dane
- **Raporty premium** (`isPaid: true`) - pełne dane po zakupie raportu

W profilu użytkownika wyświetlane są statystyki:
- Wszystkie raporty
- Raporty bezpłatne
- Raporty premium

## Testowanie

### Testowanie Rejestracji
```
1. Kliknij "Zaloguj się"
2. Kliknij "Nie masz konta? Zarejestruj się"
3. Wpisz:
   - Imię: Jan
   - Email: jan@example.com
   - Hasło: test123
4. Kliknij "Zarejestruj się"
```

### Testowanie Logowania
```
1. Kliknij "Zaloguj się"
2. Wpisz dane utworzonego konta
3. Kliknij "Zaloguj się"
```

### Testowanie Zapisywania Raportów
```
1. Zaloguj się
2. Przejdź przez wizard
3. Na stronie wyników kliknij "💾 Zapisz raport w profilu"
4. Przejdź do profilu
5. Sprawdź czy raport jest na liście
```

### Testowanie Otwierania Raportów
```
1. W profilu kliknij "Otwórz" przy dowolnym raporcie
2. Powinieneś zobaczyć stronę wyników z danymi z tego raportu
```

## Dalszy Rozwój

### Priorytetowe
1. [ ] Backend API (Node.js/Express lub Next.js API routes)
2. [ ] Baza danych (PostgreSQL/MongoDB)
3. [ ] Hashowanie haseł
4. [ ] JWT tokeny
5. [ ] Walidacja email (potwierdzenie)

### Przydatne
6. [ ] Resetowanie hasła
7. [ ] Edycja profilu
8. [ ] Zmiana hasła
9. [ ] Usuwanie konta
10. [ ] Eksport raportów do PDF
11. [ ] Udostępnianie raportów

### Nice to Have
13. [ ] Social login (Google, Facebook)
14. [ ] Powiadomienia email
15. [ ] Historia wyszukiwań
16. [ ] Ulubione oferty
17. [ ] Porównywarka raportów

## Bezpieczeństwo

⚠️ **Obecna implementacja NIE jest bezpieczna dla produkcji!**

Brakujące elementy bezpieczeństwa:
- Hasła przechowywane w plain text
- Brak walidacji po stronie serwera
- Brak rate limitingu
- Brak HTTPS
- Brak CSRF protection
- Brak XSS protection

## Wsparcie

W razie pytań lub problemów:
1. Sprawdź Console przeglądarki (F12)
2. Sprawdź czy dane są w localStorage
3. Wyczyść localStorage i spróbuj ponownie: `localStorage.clear()`
