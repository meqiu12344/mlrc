import { FormData, CalculatedRequirements } from "../types";

export function calculateRequirements(data: FormData): CalculatedRequirements {
  const reasoning = {
    trunk: "",
    power: "",
    budget: "",
    segment: "",
    features: [] as string[],
    fuelType: "",
    bodyStyle: ""
  };

  // === BAGAŻNIK ===
  let trunkMin = 250;
  let trunkRec = 400;
  
  // Bazowa pojemność na liczbę osób
  if (data.householdSize >= 5) {
    trunkMin = 450;
    trunkRec = 600;
    reasoning.trunk = `Rodzina ${data.householdSize}-osobowa wymaga dużo miejsca. `;
  } else if (data.householdSize >= 3) {
    trunkMin = 350;
    trunkRec = 500;
    reasoning.trunk = `Rodzina ${data.householdSize}-osobowa potrzebuje średniego bagażnika. `;
  }
  
  // Zakupy tygodniowe
  if (data.weeklyGroceries === 'large') {
    trunkMin += 100;
    trunkRec += 150;
    reasoning.trunk += "Duże cotygodniowe zakupy dodają +150L. ";
  } else if (data.weeklyGroceries === 'medium') {
    trunkMin += 50;
    trunkRec += 100;
  }
  
  // Wózek dziecięcy
  if (data.strollerType === 'large') {
    trunkMin += 100;
    trunkRec += 100;
    reasoning.trunk += "Duży wózek wymaga +100L (składany zajmuje ~80-120L). ";
  } else if (data.strollerType === 'compact') {
    trunkMin += 50;
    trunkRec += 50;
  }
  
  // Sprzęt sportowy
  if (data.sportsEquipment === 'large') {
    trunkMin += 200;
    trunkRec += 300;
    reasoning.trunk += "Kajaki/deski/rowery wymagają +300L lub relingi dachowe. ";
    reasoning.features.push("Relingi dachowe lub box dachowy");
  } else if (data.sportsEquipment === 'small') {
    trunkMin += 100;
    trunkRec += 150;
    reasoning.trunk += "Narty/snowboard wymagają +150L. ";
  }
  
  // Pies
  if (data.petTransport === 'large') {
    trunkMin += 150;
    trunkRec += 200;
    reasoning.trunk += "Duży pies potrzebuje +200L w klatce transportowej. ";
  } else if (data.petTransport === 'small') {
    trunkMin += 50;
    trunkRec += 80;
  }
  
  // Wakacje
  if (data.vacationStyle === 'camping') {
    trunkMin += 300;
    trunkRec += 400;
    reasoning.trunk += "Kemping wymaga namiotu, śpiworów, sprzętu +400L. ";
  } else if (data.vacationStyle === 'family') {
    trunkMin += 200;
    trunkRec += 250;
    reasoning.trunk += "Wyjazd rodzinny = walizki dla wszystkich +250L. ";
  }

  // === MIEJSCA SIEDZĄCE ===
  let minSeats = Math.max(5, data.householdSize);
  let thirdRowNeeded = data.householdSize > 5 || 
                       (data.householdSize === 5 && data.childrenCount >= 3);
  
  if (thirdRowNeeded) {
    reasoning.features.push("3. rząd siedzeń (7 miejsc) - rodzina powyżej 5 osób");
  }

  // === MOC I PRZYSPIESZENIE ===
  let minPower = 90;
  let maxAccel = 12.0;
  
  // Teren górzysty wymaga więcej mocy
  if (data.hilliness === 'mountainous') {
    minPower = 130;
    maxAccel = 10.0;
    reasoning.power = "Góry wymagają min. 130 KM dla pewnego wyprzedzania pod górkę. ";
  } else if (data.hilliness === 'moderate') {
    minPower = 110;
    maxAccel = 11.0;
    reasoning.power = "Pagórkowaty teren wymaga min. 110 KM. ";
  }
  
  // Obciążenie (rodzina + bagaż)
  const totalWeight = data.householdSize * 75 + (trunkRec * 0.5); // kg
  if (totalWeight > 500) {
    minPower += 20;
    maxAccel -= 1;
    reasoning.power += `Obciążenie ~${Math.round(totalWeight)}kg wymaga +20 KM. `;
  }
  
  // Autostrada
  if (data.commuteType === 'highway' || data.longTripsPerYear > 10) {
    minPower = Math.max(minPower, 120);
    maxAccel = Math.min(maxAccel, 10.0);
    reasoning.power += "Częsta jazda autostradą = min. 120 KM dla bezpiecznego wyprzedzania. ";
  }

  // === HOLOWANIE ===
  let towingCapacity = 0;
  
  if (data.trailerNeeded === 'regularly') {
    towingCapacity = 1500;
    reasoning.features.push("Masa holownicza min. 1500 kg (przyczepa kempingowa/łódź)");
  } else if (data.trailerNeeded === 'occasionally') {
    towingCapacity = 750;
    reasoning.features.push("Masa holownicza min. 750 kg (mała przyczepa)");
  }

  // === PRZEŚWIT ===
  let minClearance = 140;
  let awd4x4 = false;
  
  if (data.roadType === 'regular-dirt') {
    minClearance = 180;
    awd4x4 = true;
    reasoning.features.push("Napęd 4x4 i prześwit >180mm - regularne drogi gruntowe");
  } else if (data.roadType === 'occasional-dirt') {
    minClearance = 160;
    reasoning.features.push("Prześwit >160mm - okazjonalne drogi gruntowe");
  }
  
  if (data.winterConditions === 'extreme') {
    minClearance = Math.max(minClearance, 180);
    awd4x4 = true;
    reasoning.features.push("Napęd 4x4 - ekstremalne warunki zimowe");
  } else if (data.winterConditions === 'regular') {
    minClearance = Math.max(minClearance, 160);
    reasoning.features.push("Opcjonalnie 4x4 - regularne opady śniegu");
  }

  // === BUDŻET ===
  const maxMonthly = data.maxMonthlyPayment || 0;
  let maxBudget = 0;
  let recBudget = 0;
  
  // Jeśli podano ratę, zakładamy kredyt na 5 lat (60 rat)
  if (maxMonthly > 0) {
    // Przy oprocentowaniu ~8% efektywna cena to rata * 48
    maxBudget = Math.round(maxMonthly * 48);
    recBudget = Math.round(maxMonthly * 42); // Zostaw zapas 10%
    
    reasoning.budget = `Przy racie ${maxMonthly} zł/mies. możesz kupić auto do ~${maxBudget.toLocaleString()} zł (kredyt 5 lat, ~8% oprocentowania). `;
  } else {
    // Jeśli nie podano raty, ustalamy domyślny budżet na podstawie standardowych założeń
    maxBudget = 80000; // Domyślny budżet
    recBudget = 60000;
    reasoning.budget = `Domyślny budżet to ${recBudget.toLocaleString()} zł. Możesz go zmienić podając ratę lub negocjując cenę.`;
  }
  
  // Koszty miesięczne (paliwo + ubezpieczenie + serwis)
  const dailyKm = data.dailyCommute === 'long' ? 100 : 
                  data.dailyCommute === 'medium' ? 40 :
                  data.dailyCommute === 'short' ? 10 : 5;
  const monthlyKm = dailyKm * 22 + (data.longTripsPerYear * 600 / 12);
  const fuelCostPerMonth = (monthlyKm / 100) * 7 * 6.5; // 7L/100km, 6.5zł/L
  const insurancePerMonth = 200; // Średnio
  const servicePerMonth = 100; // Średnio
  
  const maxMonthlyCost = fuelCostPerMonth + insurancePerMonth + servicePerMonth + (maxMonthly || 0);

  // === OSZCZĘDNOŚĆ PALIWA ===
  let maxFuelConsumption = 8.0; // L/100km miasto
  
  if (monthlyKm > 2000) {
    maxFuelConsumption = 6.5;
    reasoning.features.push(`${Math.round(monthlyKm)} km/mies. = kluczowa ekonomia paliwa (<6.5L/100km)`);
  } else if (monthlyKm > 1000) {
    maxFuelConsumption = 7.5;
  }

  // === TYP PALIWA ===
  let recommendedFuelType = 'Benzyna';
  
  // Diesellogika dla wysokiego kilometrażu
  if (monthlyKm > 1500) {
    recommendedFuelType = 'Diesel';
    reasoning.fuelType = `Wysokie kilometry (${Math.round(monthlyKm)} km/mies.) wskazują na diesel - niższe spalanie (6-7 L/100km) i niższy koszt paliwa. `;
  } else if (monthlyKm > 800 && data.mainConcern !== 'economy') {
    recommendedFuelType = 'Diesel';
    reasoning.fuelType = `Średnie kilometry (${Math.round(monthlyKm)} km/mies.) - diesel jest ekonomiczniejszy długoterminowo. `;
  } else if (monthlyKm > 2000 && recBudget > 120000) {
    recommendedFuelType = 'Hybrid';
    reasoning.fuelType = `Bardzo wysokie kilometry (${Math.round(monthlyKm)} km/mies.) i wyższy budżet - hybrydaofertuje najniższe spalanie (5-6 L/100km). `;
  } else {
    reasoning.fuelType = `Umiarkowany kilometraż (${Math.round(monthlyKm)} km/mies.) - benzyna wystarczająca i tańsza w kupnie. `;
  }

  // === SEGMENT I NADWOZIE ===
  const segments: string[] = [];
  const bodyStyles: string[] = [];
  
  if (thirdRowNeeded) {
    segments.push('Van-C', 'D-SUV');
    bodyStyles.push('Van 7-osobowy', 'SUV 7-osobowy');
    reasoning.segment = "7 miejsc wymaga vana lub dużego SUV-a. ";
  } else if (trunkRec > 600) {
    segments.push('C', 'C-SUV', 'D');
    bodyStyles.push('Kombi', 'SUV');
    reasoning.segment = `Bagażnik ${trunkRec}L wymaga dużego auta (segment C/D). `;
  } else if (trunkRec > 450) {
    segments.push('B', 'C', 'B-SUV', 'C-SUV');
    bodyStyles.push('Hatchback', 'Kombi', 'SUV kompaktowy');
    reasoning.segment = `Bagażnik ${trunkRec}L = kompakt lub małe SUV. `;
  } else {
    segments.push('A', 'B');
    bodyStyles.push('Hatchback');
    reasoning.segment = "Mały bagażnik pozwala na kompaktowe auto. ";
  }
  
  if (awd4x4) {
    const suvIndex = segments.indexOf('C');
    if (suvIndex !== -1) {
      segments.splice(suvIndex + 1, 0, 'C-SUV');
    }
  }

  // Przypisz najrekomendowansze nadwozie
  reasoning.bodyStyle = bodyStyles.length > 0 
    ? `Rekomendowane nadwozia: ${bodyStyles.join(', ')}. ${
        trunkRec > 600 ? 'Duża pojemność wymaga Vana, Kombi lub dużego SUV-a. ' :
        trunkRec > 450 ? 'Średnie zapotrzebowanie wymaga kompaktu, Kombi lub SUV-a. ' :
        'Mały bagażnik pozwala na kompaktowe hatchbacki. '
      }${awd4x4 ? 'Napęd 4x4 preferuje SUV-y. ' : ''}`
    : '';

  let cityPercent = 50;
  if (data.commuteType === 'city') cityPercent = 80;
  else if (data.commuteType === 'highway') cityPercent = 20;
  else if (data.commuteType === 'mixed') cityPercent = 50;

  // === NIEZAWODNOŚĆ ===
  let reliabilityPriority: 'low' | 'medium' | 'high' = 'medium';
  
  if (data.mechanicalSkills === 'none' && data.plannedOwnership === 'long') {
    reliabilityPriority = 'high';
    reasoning.features.push("Wysoka niezawodność priorytetem - brak umiejętności + długie użytkowanie");
  } else if (data.mechanicalSkills === 'none' || data.plannedOwnership === 'long') {
    reliabilityPriority = 'high';
  } else if (data.mainConcern === 'reliability') {
    reliabilityPriority = 'high';
  }

  // === FUNKCJE DODATKOWE ===
  if (data.childrenCount > 0) {
    reasoning.features.push(`ISOFIX na ${Math.min(data.childSeats, 3)} foteliki`);
  }
  
  if (data.elderlyPassengers) {
    reasoning.features.push("Wysokie siedzenia (łatwy wsiad/wysiad dla seniorów)");
  }
  
  if (data.parkingAtHome === 'street' || data.parkingAtWork === 'street') {
    reasoning.features.push("Czujniki parkowania - parkowanie na ulicy");
  }

  const winterTires = data.winterConditions !== 'none' && data.winterConditions !== null;

  const result: CalculatedRequirements = {
    // Wymiary i przestrzeń
    minTrunkCapacity: trunkMin,
    recommendedTrunkCapacity: trunkRec,
    minSeats,
    thirdRowNeeded,
    
    // Osiągi i silnik
    minPower,
    recommendedPower: Math.max(minPower, Math.round(minPower * 1.3)), // +30% do minimum
    optimalEngineSize: minPower > 150 ? 2000 : minPower > 120 ? 1600 : minPower > 100 ? 1400 : 1200,
    engineSizeReasoning: minPower > 150 ? "Duża moc wymaga pojemnego silnika (~2.0L)" : minPower > 120 ? "Średnia moc wymaga ~1.6L" : "Mniejsza pojemność wystarczająca",
    maxAcceleration: maxAccel,
    cityDriving: cityPercent,
    
    // Możliwości
    towingCapacity,
    minGroundClearance: minClearance,
    awd4x4Needed: awd4x4,
    
    // Ekonomia
    maxBudget,
    recommendedBudget: recBudget,
    maxMonthlyCost: Math.round(maxMonthlyCost),
    maxFuelConsumption,
    
    // REKOMENDACJE
    recommendedFuelType,
    fuelTypeReasoning: reasoning.fuelType,
    recommendedBodyStyle: bodyStyles[0] || "Sedan",
    bodyStyleReasoning: reasoning.bodyStyle,
    
    // Inne
    winterTiresNeeded: winterTires,
    reliabilityPriority,
    recommendedSegments: segments,
    recommendedBodyStyles: bodyStyles,
    preferredFuelTypes: recommendedFuelType === 'Diesel' ? ['diesel', 'benzyna'] : recommendedFuelType === 'Hybrid' ? ['hybrid', 'diesel'] : ['benzyna', 'diesel'],
    olxSearchRegion: data.olxRegion || "",
    
    // Uzasadnienia
    reasoning,
    
    // Koszty roczne
    estimatedAnnualCosts: {
      fuel: Math.round(monthlyKm * 12 / 100 * 7 * 6.5),
      insurance: 200 * 12,
      maintenance: 100 * 12,
      repairs: 50 * 12,
      total: 0 // Wyliczone poniżej
    },
    
    // Specyfika użytkowania
    usageProfile: {
      primaryUse: thirdRowNeeded ? "Rodzina" : awd4x4 ? "Aktywny styl" : "Codzienna jazda",
      drivingPattern: cityPercent > 70 ? "Głównie miasto" : cityPercent < 30 ? "Głównie droga" : "Mieszane",
      annualMileage: Math.round(monthlyKm * 12),
      dailyUsage: `${Math.round(dailyKm)} km dziennie`
    },
    
    // Bezpieczeństwo
    safetyRequirements: data.childrenCount > 0 ? ["ISOFIX", "Poduszki powietrzne"] : ["ABS", "ESP"],
    recommendedSafetyFeatures: ["ABS", "ESP", "ASR", "Poduszki powietrzne (min. 6)"],
    
    // Komfort
    comfortFeatures: ["Klimatyzacja", "Podgrzewane przednie siedzenia"],
    
    // Rodzina
    familyNeeds: data.childrenCount > 0 ? {
      childSeatCompatibility: `ISOFIX na ${Math.min(data.childSeats, 3)} miejscach`,
      rearDoorWidth: "Min. 70cm dla wygodnego zainstalowania fotelika",
      rearLegroom: "Min. 700mm dla komfortu dzieci"
    } : undefined,
    
    // Aktywności
    activityRecommendations: 
      data.sportsEquipment === 'large' ? ["Relingi dachowe", "Box dachowy"] :
      awd4x4 ? ["Napęd 4x4", "Zwiększony prześwit"] : [],
    
    // Niezawodność
    reliabilityInfo: {
      recommendedBrands: ["Toyota", "Honda", "Mazda", "Volkswagen"],
      partsAvailability: recBudget > 100000 ? "Łatwo dostępne" : "Średnio dostępne",
      serviceNetworkSize: "Duża"
    },
    
    // Opony
    tireRecommendations: {
      seasonalTires: true,
      allSeasonTires: data.winterConditions === 'none' || data.winterConditions === null,
      winterTiresRequired: data.winterConditions !== 'none' && data.winterConditions !== null,
      recommendedSize: "205/55R16"
    },
    
    // Akcesoria
    recommendedAccessories: [
      ...(data.childrenCount > 0 ? ["Ochraniacz fotela"] : []),
      ...(awd4x4 ? ["Lina holownicza"] : []),
      "Maskownica - przód",
      "Dywaniki"
    ],
    
    // Konkurencja
    competitorModels: ["Volkswagen Golf", "Toyota Corolla", "Mazda3", "Ford Focus"],
    
    // Ekologia
    environmentalInfo: {
      co2Emissions: Math.round(maxFuelConsumption * 23.2), // 1L benzyny = ~23.2kg CO2
      euStandard: "Euro 6d",
      pollutantLevel: recommendedFuelType === 'Hybrid' ? "Nisko" : recommendedFuelType === 'Diesel' ? "Średnio" : "Średnio"
    },
    
    // Rekomendacje lifestyle'u
    lifestyleRecommendations: [
      ...reasoning.features,
      monthlyKm > 1500 ? "Wysokie kilometry - przeanalizuj koszt długoterminowy" : "",
      thirdRowNeeded ? "Rodzina powinna rozważyć vana lub dużego SUV-a" : "",
      awd4x4 ? "Aktywny styl życia wymaga dobrej drażliwości terenowej" : ""
    ].filter(r => r !== ""),
    
    // === PODZESPOŁY I KOMPONENTY SAMOCHODU ===
    engineComponents: {
      type: recommendedFuelType === 'Diesel' ? "Silnik Diesel" : recommendedFuelType === 'Hybrid' ? "Silnik Hybrid (benzyna + silnik elektryczny)" : "Silnik Benzynowy",
      displacement: minPower > 150 ? "1800-2000cc" : minPower > 120 ? "1500-1600cc" : minPower > 100 ? "1200-1400cc" : "1000-1200cc",
      power: `${minPower}-${minPower + 40} KM`,
      torque: `${minPower > 150 ? 300 : minPower > 120 ? 250 : minPower > 100 ? 200 : 150}-${minPower > 150 ? 350 : minPower > 120 ? 300 : minPower > 100 ? 250 : 200} Nm`,
      fuelInjection: "Bezpośrednia wtrysk (DPF dla diesla)",
      turbo: minPower > 100 ? "Turbosprężarka/Supersprężarka (mocny silnik)" : "Naturalne ssanie",
      valveTrain: "16V DOHC (dwuwałkowy)",
      cooling: `Chłodnica ${recommendedFuelType === 'Diesel' ? "wzmocniona" : "standardowa"} + wentylator elektryczny`,
      description: recommendedFuelType === 'Diesel' ? 
        `Silnik Diesel 4-cylindrowy, ekonomiczny, wysoka wydajność na długich trasach. Charakterystyka: niskie spalanie (5-7L/100km), wysoki moment obrotowy, dłuższa żywotność.` :
        recommendedFuelType === 'Hybrid' ?
        `Silnik Hybrid łączący benzynę z silnikiem elektrycznym. Automatyczne przełączanie pomiędzy nimi. Oszczędność paliwa do 5-6L/100km, niska emisja CO2, cicha jazda w mieście.` :
        `Silnik benzynowy, wszechstronny, niskie spalanie w mieście (6.5-8L/100km), łatwy w obsłudze, niższe podatki i ubezpieczenie.`
    },
    
    transmissionSystem: {
      type: minPower > 130 ? "Automatyczna skrzynia biegów (8-10 biegów)" : "Manualna lub Automatyczna CVT",
      gears: minPower > 130 ? "8-10 biegów (zmniejsza spalanie)" : "5-6 biegów",
      driveType: awd4x4 ? "Napęd 4x4 / AWD z reduktorem" : "Napęd przedni (oszczędny)",
      transferBox: awd4x4 ? "Transfer Case z możliwością wyboru trybu (2H/4H/4L)" : "Brak",
      differentialType: awd4x4 ? "Różniczek ograniczony (LSD)" : "Standardowy",
      description: awd4x4 ?
        `Napęd 4x4 o ${minClearance}mm prześwicie. Automatyczne przełączanie między osiami. Skrzynia malejąca dla jazdy terenowej.` :
        `Napęd przedni - maksymalna przestrzeń wnętrza, łatwiejsze kierowanie, niższe zużycie paliwa. Idealne dla miasta i tras.`
    },
    
    suspensionSystem: {
      frontType: awd4x4 ? "Niezależne zawieszenie typu double wishbone" : "Niezależne zawieszenie MacPherson",
      rearType: thirdRowNeeded ? "Wielowahaczowe zawieszenie" : awd4x4 ? "Wielowahaczowe zawieszenie sztywne" : "Proste zawieszenie wielowahaczowe",
      springType: "Sprężyny stalowe ze stopniowaniem zmiennym",
      dampersType: minClearance > 160 ? "Amortyzatory terenowe ze wzmocnieniem" : "Amortyzatory hydrauliczne",
      stabilizers: "Drążek przeciwprzechwytowy przód/tył",
      rideHeight: `${minClearance}mm prześwit (${awd4x4 ? 'wzmocniony dla terenu' : 'standardowy dla drogi'})`,
      description: awd4x4 ?
        `Zawieszenie terenowe z wzmocnionym prześwitem ${minClearance}mm. Zapewnia przejezdność na drogach gruntowych, brodzeniu w wodzie, pokonywaniu przeszkód. Amortyzatory o zdecydowanie wyższej sztywności.` :
        `Zawieszenie komfortowe, zoptymalizowane do jazdy po asfalcie. Dobrze tłumi nierówności, zapewnia stabilność na łukach, łagodna jazda dla pasażerów.`
    },
    
    brakingSystem: {
      frontBrakes: "Tarczowe hamulce wentylowane (drążki o zmiennym przekroju)",
      rearBrakes: "Tarczowe hamulce wentylowane / Hamulce bębnowe",
      servoType: "Wzmacniacz hamulca hydrauliczny ABS/EBD",
      abs: "ABS (Anti-lock Braking System) - do 16 kanałów",
      esp: "ESP/ESC (Elektroniczna kontrola stabilności)",
      assistanceSystems: ["ABS", "EBD", "BA (Brake Assist)", "EBA (Emergency Brake Assist)"],
      handBrake: "Hamulec ręczny elektroniczny",
      padType: "Opłatki ceramiczne (mniejszy hałas, mniejsze zużycie)",
      description: `System hamulcowy ${minPower > 150 ? 'wzmocniony' : 'standardowy'} z pełnym systemem stabilizacji. ABS zapobiega blokowaniu kół, ESP kontroluje przesunięcia boczne, Brake Assist skraca drogę hamowania w nagłych sytuacjach.`
    },
    
    steeringSystem: {
      type: "Układ kierowniczy wspomagany elektrycznie",
      assistType: "Sterowanie zmiennym wspomacnieniem (twardsze na autostradzie, miększe w mieście)",
      turnsRequired: minPower > 150 ? "2.8 zwroty koła (szybsze przesławianie)" : "3.0-3.2 zwroty koła",
      wheelSensitivity: awd4x4 ? "Zmienne w zależności od trybu jazdy" : "Stałe",
      description: `Elektryczne wspomaganie kierownicy zapewnia precyzję i bezpieczeństwo. Przy wyższych prędkościach system automatycznie zwiększa opór dla większej stabilności. Niższe spalanie dzięki braku hydraulicznego sprężarki.`
    },
    
    wheelTireSystem: {
      wheelSize: minPower > 150 ? "18-19 cali" : minPower > 120 ? "17-18 cali" : "16-17 cali",
      wheelType: "Felgi aluminiowe z pełnym pokryciem (zmniejszony opór powietrza)",
      tireWidth: "195-215 mm",
      aspectRatio: "55-65%",
      tireType: awd4x4 ? "Opony wszystkoterenowe M+S z wzmocnionym boczkiem" : "Opony drogowe o niskim oporze toczenia",
      winterTires: data.winterConditions !== 'none' ? "Obowiązkowe zimą - opony 3PMSF" : "Opcjonalne",
      tpms: "System kontroli ciśnienia w oponach (TPMS)",
      description: `205/55R16 z indeksem prędkości H/T. ${winterTires ? 'Opony zimowe 3PMSF obowiązkowe w Polsce od grudnia do lutego.' : 'Opony sezonowe lub całoroczne.'}`,
      recommendedBrand: awd4x4 ? "Michelin, Continental, Goodyear" : "Michelin, Continental, Bridgestone"
    },
    
    chassisBodyStructure: {
      bodyType: bodyStyles[0] || "Sedan",
      frametype: "Rama samochodu typu monocoque (całkowicie spawane)",
      reinforcedAreas: ["Piłary A/B/C (bezpieczeństwo boczne)", "Rama podłogi (sztywność skrętna)"],
      crumpleZones: ["Przednia część (pochłania energię zderzenia)", "Tylna część"],
      materials: `${awd4x4 ? 'Wzmocniona stal szybkoobcierająca' : 'Stal wysokowytrzymałościowa'} (AHSS)`,
      description: `Konstrukcja samochodowa zapewniająca bezpieczeństwo. Wzmocnione strefy zderzenia, sztywna klatka bezpieczeństwa. Całkowita masa pojazdu: ${thirdRowNeeded ? '1700-2000kg' : awd4x4 ? '1600-1800kg' : '1300-1500kg'}.`
    },
    
    bodyExterior: {
      length: thirdRowNeeded ? "4700-4900mm" : trunkRec > 600 ? "4500-4700mm" : trunkRec > 450 ? "4200-4400mm" : "3800-4100mm",
      width: awd4x4 ? "1850-1900mm" : "1800-1850mm",
      height: thirdRowNeeded ? "1700-1800mm" : awd4x4 ? "1600-1700mm" : "1450-1550mm",
      wheelbase: "2600-2800mm",
      groundClearance: `${minClearance}mm`,
      overhangs: "Krótkie zwisy dla jazdy terenowej",
      doors: thirdRowNeeded ? "5 drzwi" : "4-5 drzwi",
      trunkSize: `${trunkRec}L (przestawialne siedzenia dodają pojemności)`,
      roofRails: data.sportsEquipment === 'large' ? "Relingi dachowe z możliwością zainstalowania boxa/bagażnika" : "Opcjonalne",
      windshield: "Laminowana szyba przednia (osłabia hałas)",
      description: `Wymiary dostosowane do ${bodyStyles[0] || 'klasy samochodu'}. Duże przeszklenie dla lepszej widoczności. ${awd4x4 ? 'Owalne nadwozie zmniejszające opór powietrza.' : 'Aerodynamiczne kształty zmniejszające spalanie.'}`
    },
    
    interiorSeating: {
      seats: data.householdSize > 5 ? "7 siedzeń (3 rzędy)" : "5 siedzeń (2 rzędy)",
      frontSeats: "Foteliki sportowe z elektromagnetycznym wspomacnieniem",
      rearSeats: data.childrenCount > 0 ? "Fotele dziecięce z ochroną boczną" : "Wygodne kanapy",
      childSeatPoints: `ISOFIX na ${Math.min(data.childSeats, 3)} miejscach`,
      seatMaterial: "Tkanina wysokiej jakości / Częściowa skóra",
      lumbarSupport: "Wsparcie lędźwiowe przód",
      heatingCooling: "Ogrzewane przednie siedzenia (opcjonalnie tylne)",
      massage: minPower > 120 ? "Masaż foteli (opcjonalnie)" : "Brak",
      description: `Ergonomiczna konfiguracja siedzeń dla długich tras. Elektrycze regulacje, pamięć ustawień dla kierowcy. Foteliki dostosowane do ciężaru pasażerów.`
    },
    
    interiorComfort: {
      airConditioning: "Klimatyzacja automatyczna dwustrefowa",
      ventilation: "Przednie i tylne otwory wentylacyjne",
      cruiseControl: "Automatyczna kontrola prędkości (adaptacyjna)",
      parkingSensors: data.parkingAtHome === 'street' || data.parkingAtWork === 'street' ? "Czujniki parkowania przód/tył + kamera 360°" : "Czujniki przód/tył",
      steeringWheelControl: "Wielofunkcyjne sterowanie na kierownicy",
      infotainment: "System 7-8 cali z touchscreen, Apple CarPlay/Android Auto",
      soundSystem: "System audio 6-8 głośników z subwooferem",
      interior_lighting: "Automatyczne oświetlenie LED",
      description: `Nowoczesne wnętrze z systemem informacyjnym dostosowanym do potrzeb. Klimatyzacja ${data.householdSize > 3 ? 'multystrefowa' : 'dwustrefowa'} dla komfortu wszystkich pasażerów.`
    },
    
    safetySystemsDetailed: {
      airbags: "6-10 poduszek powietrznych",
      frontAirbags: "Przednie + boczne + kurtyny powietrzne",
      sideAirbags: "Poduszki boczne (tors + miednica)",
      curtainAirbags: "Kurtyny powietrzne na całej długości",
      kneeBag: "Poduszka chroniąca kolana",
      esp: "Elektroniczna kontrola stabilności",
      asr: "Elektroniczna kontrola trakcji",
      hill_start_assist: "Pomoc w starcie na podjeździe",
      hill_descent_control: awd4x4 ? "Kontrola zjazdów (dla terenów)" : "Brak",
      laneKeeping: "System utrzymywania pasa ruchu (Lane Keeping Assist)",
      collisionWarning: "Czujniki kolizji przednie/tylne",
      blindSpotMonitor: "Monitor martwych pól",
      parkingAssistant: data.parkingAtHome === 'street' || data.parkingAtWork === 'street' ? "Asystent parkowania (półautomatyczny/automatyczny)" : "Czujniki parkowania",
      description: `Kompleksowy system bezpieczeństwa biernego i czynnego. Airbagi chronią wszystkich pasażerów, elektroniczne systemy zapobiegają wypadkom poprzez monitorowanie drogi i reagowanie na zagrożenia.`
    },
    
    lightingSystem: {
      headlights: minPower > 120 ? "LED/Matrix LED (adaptacyjne oświetlenie dynamiczne)" : "LED/Halogen",
      lowBeam: "Automatyczne przyciemnianie w mieście",
      highBeam: "Dynamiczne światła drogowe",
      fogLights: awd4x4 ? "Dodatkowe światła w zbiorniku wodnym" : "LED",
      rearLights: "LED z dynamicznym efektem sekwencyjnym",
      drivingLights: awd4x4 ? "Dodatkowe światła terenowe na dachu" : "Brak",
      interiorLights: "LED ze ściemnianiem stopniowym",
      autoLighting: "Automatyczne włączanie/wyłączanie",
      description: `Zaawansowany system oświetlenia z automatyczną regulacją. LED gwarantuje 10x dłuższą żywotność niż tradycyjne żarówki i lepszą widoczność.`
    },
    
    emissionControl: {
      exhaustSystem: recommendedFuelType === 'Diesel' ? "Układ DPF (Diesel Particulate Filter) + AdBlue" : "Katalizator trójfazowy",
      euStandard: "Euro 6d",
      particleFilter: recommendedFuelType === 'Diesel' ? "Filtr cząstek stałych (DPF)" : "Filtr cząstek stałych (GPF)",
      noxReduction: "Katalityczne zmniejszenie NOx (SCR)",
      co2Emissions: `${Math.round(maxFuelConsumption * 23.2)}g/km`,
      fuelConsumption: `${Math.round(maxFuelConsumption * 10) / 10}L/100km (WLTP)`,
      description: `Nowoczesny system redukcji emisji. Spełnia najsurowsze normy EU6d. ${recommendedFuelType === 'Diesel' ? 'Układ AdBlue zmniejsza emisję NOx. Wymaga regularnego uzupełniania AdBlue (co ~15000 km).' : 'Katalizator chroni środowisko.'}`
    },
    
    powerSteeringElectronics: {
      steeringAssist: "Elektryczne wspomaganie z adaptacyjnym oporem",
      torqueSensitive: "Czujnik momentu (dynamiczny opór na autostradzie)",
      speedSensitive: "Czujnik prędkości (mniejszy opór w mieście)",
      steeringControl: "Elektroniczna kontrola stabilności (VDC)",
      description: "Precyzyjne sterowanie z minimalnym oporem. System automatycznie dostosowuje wspomaganie w zależności od prędkości i warunków jazdy."
    },
    
    batteryElectrical: {
      batteryCapacity: minPower > 130 ? "70-80 Ah" : "60-70 Ah",
      batteryVoltage: "12V / 24V (dla dużych silników)",
      alternator: minPower > 130 ? "150-180A" : "120-140A",
      starterMotor: `Rozrusznik ${minPower > 130 ? 'wzmocniony' : 'standardowy'}`,
      electricalBoxes: "Centrala elektryczna z bezpiecznikami PTC",
      description: `Bateria ${minPower > 130 ? 'wzmocniona' : 'standardowa'} zapewniająca niezawodny rozruch. Alternator generuje prąd do ładowania baterii i zasilania systemów.`
    },
    
    coolingHeatingSystem: {
      radiator: "Chłodnica aluminiowa z wachlarzem elektromagnetycznym",
      thermostat: "Elektroniczny termostat z regulacją temperatury",
      heater: "Grzejnik kabiny z elektroniczną kontrolą",
      ventilation: "Dwuwentylatorowy system wentylacji",
      description: `Układ chłodzenia gwarantuje optymalną temperaturę pracy silnika (80-95°C). System ogrzewania zapewnia komfort w zimę, podgrzewanie przedniej szyby i lusterek.`
    },
    
    recommendedMaintenance: {
      oilChanges: "Co 15000-20000 km lub 1 raz/rok",
      filterChanges: "Co 30000 km (powietrze), co 50000 km (kabina)",
      fluidChecks: "Co miesiąc (płyn do chłodnicy, płyn hamulcowy, płyn do spryskiwaczy)",
      tireRotation: "Co 15000 km",
      wheelAlignment: "Co 50000 km",
      brakePadReplacement: "Co 50000-80000 km",
      batteryReplacement: "Co 4-5 lat",
      sparkPlugs: recommendedFuelType === 'Diesel' ? "Co 100000 km (glow plugs)" : "Co 30000-60000 km",
      adblueRefill: recommendedFuelType === 'Diesel' ? "Co 15000 km (~20L)" : "Brak",
      description: `Regularna konserwacja gwarantuje długowieczność samochodu i oszczędność na remontach. Koszt roczny: ${100 * 12 + 50 * 12}zł.`
    }
  };
  
  // Wylicz całkowite koszty
  result.estimatedAnnualCosts.total = 
    result.estimatedAnnualCosts.fuel + 
    result.estimatedAnnualCosts.insurance + 
    result.estimatedAnnualCosts.maintenance + 
    result.estimatedAnnualCosts.repairs;
  
  return result;
};
