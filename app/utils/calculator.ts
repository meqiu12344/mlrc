import { FormData, CalculatedRequirements } from "../types";

export function calculateRequirements(data: FormData): CalculatedRequirements {
  const reasoning = {
    trunk: "",
    power: "",
    budget: "",
    segment: "",
    features: [] as string[]
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

  // === PROCENT JAZDY MIEJSKIEJ ===
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

  return {
    minTrunkCapacity: trunkMin,
    recommendedTrunkCapacity: trunkRec,
    minSeats,
    thirdRowNeeded,
    
    minPower,
    maxAcceleration: maxAccel,
    cityDriving: cityPercent,
    
    towingCapacity,
    minGroundClearance: minClearance,
    awd4x4Needed: awd4x4,
    
    maxBudget,
    recommendedBudget: recBudget,
    maxMonthlyCost: Math.round(maxMonthlyCost),
    maxFuelConsumption,
    
    winterTiresNeeded: winterTires,
    reliabilityPriority,
    recommendedSegments: segments,
    recommendedBodyStyles: bodyStyles,
    
    reasoning
  };
}
