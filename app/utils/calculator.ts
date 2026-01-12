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
  } else if (data.monthlyIncome > 0) {
    // Zasada: auto nie powinno kosztować więcej niż 12 miesięcznych dochodów
    maxBudget = data.monthlyIncome * 12;
    recBudget = data.monthlyIncome * 8;
    reasoning.budget = `Przy dochodzie ${data.monthlyIncome} zł/mies. bezpieczny budżet to ${recBudget.toLocaleString()} zł. `;
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

  const result = {
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
    ].filter(r => r !== "")
  };
  
  // Wylicz całkowite koszty
  result.estimatedAnnualCosts.total = 
    result.estimatedAnnualCosts.fuel + 
    result.estimatedAnnualCosts.insurance + 
    result.estimatedAnnualCosts.maintenance + 
    result.estimatedAnnualCosts.repairs;
  
  return result;
};
