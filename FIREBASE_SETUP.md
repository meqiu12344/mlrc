# 🔥 Instrukcja Konfiguracji Firebase

## ✅ Co zostało zaimplementowane

### 1. **Firebase Authentication**
- ✅ Rejestracja użytkowników z automatycznym hashowaniem haseł
- ✅ Logowanie z weryfikacją poświadczeń
- ✅ Wylogowanie
- ✅ Obserwacja stanu autentykacji w czasie rzeczywistym

### 2. **Firestore Database**
- ✅ Automatyczne zapisywanie raportów po ich wygenerowaniu
- ✅ Przechowywanie danych użytkowników (imię, email, data utworzenia, status premium)
- ✅ Zarządzanie raportami (odczyt, zapis, usuwanie)
- ✅ Filtrowanie raportów według userId

### 3. **Bezpieczeństwo**
- ✅ Hasła są automatycznie hashowane przez Firebase Auth
- ✅ Dane użytkowników chronione regułami Firestore
- ✅ Brak przechowywania haseł w bazie danych

---

## 🚀 Kroki Konfiguracji Firebase

### Krok 1: Utwórz Projekt Firebase

1. Przejdź na [Firebase Console](https://console.firebase.google.com/)
2. Kliknij **"Add project"** lub **"Dodaj projekt"**
3. Podaj nazwę projektu (np. "mlrc-car-finder")
4. (Opcjonalnie) Wyłącz Google Analytics jeśli nie potrzebujesz
5. Kliknij **"Create project"**

### Krok 2: Dodaj Aplikację Web

1. W konsoli Firebase, kliknij ikonę **</>** (Web)
2. Podaj nazwę aplikacji (np. "MLRC Web App")
3. **NIE** zaznaczaj "Firebase Hosting" (jeśli nie planujesz hostować na Firebase)
4. Kliknij **"Register app"**
5. **SKOPIUJ** konfigurację która się pojawi:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Krok 3: Dodaj Konfigurację do .env.local

1. W katalogu projektu, utwórz plik `.env.local` (jeśli nie istnieje)
2. Dodaj następujące zmienne (zastąp wartościami z Firebase Console):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. **WAŻNE**: Plik `.env.local` jest w `.gitignore` - NIE commituj go do GitHub!

### Krok 4: Włącz Authentication

1. W Firebase Console, przejdź do **Authentication** w menu bocznym
2. Kliknij **"Get started"**
3. Wybierz **"Email/Password"** jako metodę logowania
4. Włącz **Email/Password** (pierwszy przełącznik)
5. Kliknij **"Save"**

### Krok 5: Utwórz Firestore Database

1. W Firebase Console, przejdź do **Firestore Database**
2. Kliknij **"Create database"**
3. Wybierz lokalizację (np. `europe-west1` dla Europy)
4. Wybierz **"Start in production mode"** (ustawimy reguły za chwilę)
5. Kliknij **"Create"**

### Krok 6: Skonfiguruj Reguły Firestore

1. W Firestore Database, przejdź do zakładki **"Rules"**
2. Zastąp domyślne reguły następującymi:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reguły dla kolekcji users
    match /users/{userId} {
      // Użytkownik może czytać tylko swoje dane
      allow read: if request.auth != null && request.auth.uid == userId;
      // Użytkownik może tworzyć swój dokument podczas rejestracji
      allow create: if request.auth != null && request.auth.uid == userId;
      // Użytkownik może aktualizować tylko swoje dane
      allow update: if request.auth != null && request.auth.uid == userId;
      // Nie pozwalaj na usuwanie (można rozszerzyć w przyszłości)
      allow delete: if false;
    }
    
    // Reguły dla kolekcji reports
    match /reports/{reportId} {
      // Każdy zalogowany użytkownik może czytać tylko swoje raporty
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      // Użytkownik może tworzyć raport z własnym userId
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      // Użytkownik może usuwać tylko swoje raporty
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
      // Użytkownik może aktualizować tylko swoje raporty
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Kliknij **"Publish"**

### Krok 7: Struktura Bazy Danych

Firebase automatycznie utworzy kolekcje przy pierwszym zapisie. Oto struktura:

#### Kolekcja `users`:
```
users/
  {userId}/
    - email: string
    - name: string
    - createdAt: timestamp
    - isPremium: boolean
```

#### Kolekcja `reports`:
```
reports/
  {reportId}/
    - userId: string (referencja do users)
    - createdAt: timestamp
    - name: string
    - formData: object (wypełniony formularz)
    - requirements: object (wyliczone wymagania)
```

---

## 🧪 Testowanie

### 1. Uruchom Development Server

```bash
npm run dev
```

### 2. Przetestuj Rejestrację

1. Przejdź na `http://localhost:3000`
2. Kliknij "Zaloguj się" → "Załóż konto"
3. Zarejestruj nowego użytkownika
4. Sprawdź w Firebase Console → Authentication czy użytkownik został utworzony
5. Sprawdź w Firebase Console → Firestore → users czy dokument użytkownika istnieje

### 3. Przetestuj Zapisywanie Raportów

1. Zaloguj się
2. Wypełnij formularz kreatora i wygeneruj raport
3. Raport powinien być **automatycznie zapisany**
4. Sprawdź:
   - Notification "Raport automatycznie zapisany"
   - Profil użytkownika → powinien być widoczny raport
   - Firebase Console → Firestore → reports → powinien istnieć dokument

### 4. Przetestuj Wylogowanie

1. Wyloguj się
2. Spróbuj wejść na `/profile` - powinieneś być przekierowany
3. Zaloguj się ponownie - dane powinny być zachowane

---

## 🔧 Funkcje Projektu

### Automatyczne Zapisywanie Raportów
- ✅ Raport jest automatycznie zapisywany gdy użytkownik jest zalogowany
- ✅ Notification informuje o statusie zapisu
- ✅ Możliwość ręcznego ponownego zapisu (backup)

### Profil Użytkownika
- ✅ Lista wszystkich zapisanych raportów
- ✅ Podgląd szczegółów raportu
- ✅ Usuwanie raportów
- ✅ Statystyki (liczba raportów, ostatni raport)

### Bezpieczeństwo
- ✅ Hasła hashowane przez Firebase Auth
- ✅ Reguły Firestore chronią dane użytkowników
- ✅ Tylko właściciel ma dostęp do swoich raportów

---

## 🔐 Migracja Danych z LocalStorage

Jeśli masz istniejących użytkowników w LocalStorage, musisz:

1. **NIE** usuwaj LocalStorage - użytkownicy stracą dane
2. Opcja 1: Poproś użytkowników o ponowną rejestrację w Firebase
3. Opcja 2: Stwórz skrypt migracyjny (wymaga więcej pracy)

**Rekomendacja**: Rozpocznij od nowa z Firebase dla czystego startu.

---

## ❓ Rozwiązywanie Problemów

### Błąd: "Firebase not configured"
- Sprawdź czy `.env.local` istnieje i ma poprawne wartości
- Zrestartuj development server po dodaniu `.env.local`
- Upewnij się że wszystkie zmienne zaczynają się od `NEXT_PUBLIC_`

### Błąd: "Permission denied" lub "Missing or insufficient permissions"
- **NAJCZĘSTSZY PROBLEM!** Sprawdź reguły Firestore w Firebase Console
- Przejdź do **Firestore Database → Rules**
- Upewnij się że reguły są dokładnie takie jak podane w Kroku 6
- Kliknij **"Publish"** aby zapisać reguły
- **WAŻNE**: Po zmianie reguł odczekaj ~30 sekund zanim zastosujesz się
- Sprawdź w konsoli przeglądarki (F12) szczegóły błędu

### Błąd zapisywania raportu: "Nie udało się zapisać raportu"
1. **Otwórz Console w przeglądarce** (F12 → Console)
2. Szukaj szczegółowych logów:
   - `"Zapisywanie raportu..."`
   - `"Dane do zapisu:"`
   - Szczegółowy komunikat błędu
3. Najczęstsze przyczyny:
   - **Brak uprawnień**: Sprawdź reguły Firestore (zobacz wyżej)
   - **Użytkownik niezalogowany**: Sprawdź czy `user` nie jest `null`
   - **Błędne dane**: Sprawdź strukturę `formData` i `requirements`
4. Sprawdź w Firebase Console → Firestore → Data czy kolekcja `reports` istnieje
5. Jeśli kolekcja nie istnieje, utwórz ją ręcznie:
   - Kliknij **"Start collection"**
   - Nazwa: `reports`
   - Dodaj testowy dokument z polami: `userId`, `name`, `createdAt`

### Błąd: "Failed to get document because the client is offline"
- Sprawdź połączenie internetowe
- Firebase automatycznie buforuje dane offline
- Po powrocie online dane zostaną zsynchronizowane

### Użytkownik nie może się zarejestrować
- Sprawdź czy Email/Password Authentication jest włączona w Firebase Console
- Sprawdź console w przeglądarce pod kątem błędów
- Upewnij się że hasło ma min. 6 znaków (wymóg Firebase)

### Raporty nie zapisują się
1. **Sprawdź console przeglądarki** - szukaj czerwonych błędów
2. **Sprawdź Network tab** - czy request do Firestore się wykonuje
3. **Sprawdź reguły Firestore**:
```javascript
// Reguła dla reports - MUSI być dokładnie tak:
match /reports/{reportId} {
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```
4. **Sprawdź czy userId zgadza się**:
   - W console: `console.log('User ID:', user.id)`
   - Porównaj z Firebase Auth UID

### Debugowanie - Co sprawdzić w Console przeglądarki:

```javascript
// Otwórz Console (F12) i wpisz:
console.log('User:', user);
console.log('FormData:', formData);
console.log('Requirements:', requirements);
```

Jeśli widzisz `undefined` - dane nie są dostępne.

### Problem: "createdAt" nie zapisuje się jako timestamp
- Używamy `serverTimestamp()` - to prawidłowe
- Timestamp pojawi się dopiero po zapisie w bazie
- Przy odczycie konwertujemy: `data.createdAt?.toDate()`
- Zrestartuj development server po dodaniu `.env.local`

### Błąd: "Permission denied"
- Sprawdź reguły Firestore - upewnij się że są poprawnie skonfigurowane
- Sprawdź czy użytkownik jest zalogowany (`user !== null`)

### Użytkownik nie może się zarejestrować
- Sprawdź czy Email/Password Authentication jest włączona w Firebase Console
- Sprawdź console w przeglądarce pod kątem błędów

### Raporty nie zapisują się
- Sprawdź reguły Firestore dla kolekcji `reports`
- Sprawdź czy `userId` w raporcie zgadza się z `request.auth.uid`
- Sprawdź console w przeglądarce

---

## 📚 Dodatkowe Zasoby

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## ✨ Następne Kroki (Opcjonalne)

1. **Email Verification**: Dodaj weryfikację email przy rejestracji
2. **Password Reset**: Dodaj funkcję resetowania hasła
3. **Social Login**: Dodaj logowanie przez Google/Facebook
4. **Cloud Functions**: Automatyzuj zadania backendowe
5. **Storage**: Dodaj możliwość przesyłania zdjęć aut
6. **Hosting**: Wdróż aplikację na Firebase Hosting

---

**Powodzenia! 🚀**
