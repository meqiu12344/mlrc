# 🚗 MLRC - Inteligentny Doradca Zakupu Samochodu

Aplikacja webowa pomagająca użytkownikom znaleźć idealne auto na podstawie ich codziennych potrzeb i stylu życia.

## ✨ Funkcje

- 🎯 **Inteligentny Kreator** - zadaje pytania o codzienne potrzeby zamiast parametrów technicznych
- 🔥 **Firebase Authentication** - bezpieczne konta użytkowników z hashowaniem haseł
- 💾 **Automatyczne Zapisywanie** - raporty zapisują się automatycznie na profilu użytkownika
- 📊 **Szczegółowa Analiza** - kompleksowe wymagania techniczne i rekomendacje
- 👤 **Profil Użytkownika** - zarządzanie zapisanymi raportami
- 💳 **Integracja Stripe** - płatności za funkcje premium (opcjonalne)

## 🚀 Szybki Start

### 1. Instalacja

```bash
npm install
```

### 2. Konfiguracja Firebase

**WAŻNE**: Musisz skonfigurować Firebase przed uruchomieniem aplikacji!

1. Przeczytaj szczegółową instrukcję: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**
2. Utwórz projekt Firebase
3. Skopiuj `.env.local.example` do `.env.local`
4. Uzupełnij dane Firebase w `.env.local`

```bash
cp .env.local.example .env.local
# Edytuj .env.local i dodaj swoje klucze Firebase
```

### 3. Uruchomienie

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 📁 Struktura Projektu

```
app/
├── components/       # Komponenty React (Header, Footer, Results, itd.)
├── context/          # Context API (AuthContext, FormContext)
├── lib/              # Konfiguracja Firebase i inne biblioteki
├── utils/            # Funkcje pomocnicze (calculator, recommendations)
├── wizard/           # Kreator pytań
├── results/          # Strona wyników
├── profile/          # Profil użytkownika
└── api/              # API routes (Stripe webhooks)
```

## 🔐 Bezpieczeństwo

- ✅ Hasła **automatycznie hashowane** przez Firebase Authentication
- ✅ Reguły Firestore chronią dane użytkowników
- ✅ Tylko właściciel ma dostęp do swoich raportów
- ✅ `.env.local` w `.gitignore` - klucze nie są commitowane

## 📚 Dokumentacja

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Pełna instrukcja konfiguracji Firebase
- **[QUICK_START.md](./QUICK_START.md)** - Szybki start dla developerów
- **[AUTH_SYSTEM_README.md](./AUTH_SYSTEM_README.md)** - System autentykacji
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Integracja płatności

## 🛠️ Technologie

- **Next.js 16** (Turbopack) - React framework
- **TypeScript** - Statyczne typowanie
- **Tailwind CSS** - Stylowanie
- **Firebase** - Authentication + Firestore Database
- **Stripe** - Płatności (opcjonalne)

## 📝 Licencja

MIT

---

**Instrukcje szczegółowe znajdziesz w [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**
