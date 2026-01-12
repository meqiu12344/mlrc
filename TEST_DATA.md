# 🧪 Dane Testowe

## Testowe Konta Użytkowników

Możesz użyć tych kont do testowania lub utworzyć własne:

### Użytkownik 1 - Jan Kowalski
```
Email: jan@test.pl
Hasło: test123
Imię: Jan
Status: Darmowy
```

### Użytkownik 2 - Anna Nowak (Premium)
```
Email: anna@test.pl
Hasło: test123
Imię: Anna
Status: Premium
```

## Jak dodać testowe dane?

### Opcja 1: Rejestracja przez UI
Najlepszy sposób - użyj formularza rejestracji w aplikacji.

### Opcja 2: Console przeglądarki (dla deweloperów)
Otwórz Console (F12) i wklej:

```javascript
// Dodaj testowych użytkowników
const testUsers = [
  {
    id: 'user_1',
    email: 'jan@test.pl',
    password: 'test123',
    name: 'Jan',
    createdAt: new Date().toISOString(),
    isPremium: false
  },
  {
    id: 'user_2',
    email: 'anna@test.pl',
    password: 'test123',
    name: 'Anna',
    createdAt: new Date().toISOString(),
    isPremium: true
  }
];

localStorage.setItem('users', JSON.stringify(testUsers));
console.log('✅ Użytkownicy testowi dodani!');
```

### Opcja 3: Dodaj przykładowe raporty
```javascript
// Przykładowy raport dla użytkownika Jan (user_1)
const testReport = {
  id: 'report_' + Date.now(),
  userId: 'user_1',
  createdAt: new Date().toISOString(),
  isPaid: false,
  title: 'Mój pierwszy raport',
  formData: {
    monthlyIncome: 8000,
    maxMonthlyPayment: 1500,
    dailyCommute: 'medium',
    commuteType: 'mixed',
    parkingAtWork: 'parking',
    parkingAtHome: 'garage',
    householdSize: 4,
    childrenCount: 2,
    childSeats: 2,
    elderlyPassengers: false,
    weeklyGroceries: 'large',
    sportsEquipment: 'small',
    petTransport: 'none',
    strollerType: 'compact',
    longTripsPerYear: 4,
    vacationStyle: 'family',
    winterConditions: 'regular',
    roadType: 'paved',
    hilliness: 'flat',
    weekendActivities: 'city',
    trailerNeeded: 'never',
    mainConcern: 'reliability',
    mechanicalSkills: 'basic',
    plannedOwnership: 'long'
  },
  requirements: {
    minTrunkCapacity: 450,
    recommendedTrunkCapacity: 550,
    minSeats: 5,
    thirdRowNeeded: false,
    minPower: 120,
    maxAcceleration: 12,
    cityDriving: 60,
    towingCapacity: 0,
    minGroundClearance: 150,
    awd4x4Needed: false,
    maxBudget: 80000,
    recommendedBudget: 70000,
    maxMonthlyCost: 2500,
    maxFuelConsumption: 8,
    winterTiresNeeded: true,
    reliabilityPriority: 'high',
    recommendedSegments: ['C', 'C-SUV'],
    recommendedBodyStyles: ['Kombi', 'SUV'],
    reasoning: {
      trunk: 'Potrzebujesz przestronnego bagażnika na zakupy rodzinne',
      power: 'Wystarczająca moc do bezpiecznego wyprzedzania',
      budget: 'Budżet oparty na Twoich dochodach',
      segment: 'Segment C lub C-SUV idealny dla rodziny',
      features: [
        'Isofix dla fotelików',
        'Duży bagażnik',
        'Klimatyzacja automatyczna',
        'System multimedialny'
      ]
    }
  },
  offers: [
    {
      id: 'offer_1',
      source: 'database',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 45000,
      price: 65000,
      enginePower: 122,
      fuelType: 'Hybrid',
      transmission: 'Automatyczna',
      driveType: 'FWD',
      trunkCapacity: 470,
      matchScore: 92,
      meetsRequirements: true,
      warnings: [],
      url: 'https://otomoto.pl',
      location: 'Warszawa'
    },
    {
      id: 'offer_2',
      source: 'database',
      make: 'Skoda',
      model: 'Octavia',
      year: 2019,
      mileage: 60000,
      price: 58000,
      enginePower: 150,
      fuelType: 'Diesel',
      transmission: 'Manualna',
      driveType: 'FWD',
      trunkCapacity: 600,
      matchScore: 88,
      meetsRequirements: true,
      warnings: ['Wyższy przebieg'],
      url: 'https://otomoto.pl',
      location: 'Kraków'
    }
  ]
};

// Dodaj raport
const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
reports.push(testReport);
localStorage.setItem('savedReports', JSON.stringify(reports));
console.log('✅ Przykładowy raport dodany!');
```

## Resetowanie Danych

### Wyczyść wszystko
```javascript
localStorage.clear();
console.log('✅ Wszystkie dane wyczyszczone!');
location.reload();
```

### Wyczyść tylko użytkowników
```javascript
localStorage.removeItem('users');
localStorage.removeItem('user');
console.log('✅ Użytkownicy usunięci!');
```

### Wyczyść tylko raporty
```javascript
localStorage.removeItem('savedReports');
console.log('✅ Raporty usunięte!');
```

## Sprawdzanie Danych

### Zobacz wszystkich użytkowników
```javascript
console.log('Użytkownicy:', JSON.parse(localStorage.getItem('users') || '[]'));
```

### Zobacz aktualnie zalogowanego
```javascript
console.log('Zalogowany:', JSON.parse(localStorage.getItem('user') || 'null'));
```

### Zobacz wszystkie raporty
```javascript
console.log('Raporty:', JSON.parse(localStorage.getItem('savedReports') || '[]'));
```

## Scenariusze Testowe

### Scenariusz 1: Nowy użytkownik, pierwszy raport
1. Zarejestruj się jako nowy użytkownik
2. Przejdź przez wizard
3. Zapisz raport (bezpłatny)
4. Sprawdź profil
5. Otwórz zapisany raport

### Scenariusz 2: Użytkownik z historią
1. Zaloguj się jako jan@test.pl
2. Stwórz 2-3 raporty (różne parametry)
3. Jeden kup jako premium
4. Sprawdź statystyki w profilu
5. Porównaj raporty

### Scenariusz 3: Premium użytkownik
1. Zaloguj się jako anna@test.pl (isPremium: true)
2. Stwórz raport
3. Kup pełną wersję
4. Zapisz jako premium
5. Sprawdź oznaczenie w profilu

### Scenariusz 4: Usuwanie raportów
1. Zaloguj się
2. Przejdź do profilu
3. Usuń jeden z raportów
4. Potwierdź usunięcie
5. Sprawdź czy zniknął z listy

## Debugowanie

### Problem: Nie mogę się zalogować
```javascript
// Sprawdź czy konto istnieje
const users = JSON.parse(localStorage.getItem('users') || '[]');
console.log('Konta:', users.map(u => u.email));
```

### Problem: Nie widzę raportów
```javascript
// Sprawdź ID użytkownika
const user = JSON.parse(localStorage.getItem('user'));
console.log('Moje ID:', user?.id);

// Sprawdź raporty tego użytkownika
const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
const myReports = reports.filter(r => r.userId === user?.id);
console.log('Moje raporty:', myReports);
```

### Problem: Duplikaty użytkowników
```javascript
// Usuń duplikaty
const users = JSON.parse(localStorage.getItem('users') || '[]');
const unique = users.filter((user, index, self) =>
  index === self.findIndex(u => u.email === user.email)
);
localStorage.setItem('users', JSON.stringify(unique));
console.log('✅ Duplikaty usunięte!');
```
