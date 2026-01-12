'use client';

import { useState } from 'react';
import { CalculatedRequirements, CarOffer } from '../types';
import { useAuth } from '../context/AuthContext';
import { useFormContext } from '../context/FormContext';

interface ResultsProps {
  requirements: CalculatedRequirements;
  offers: CarOffer[];
  onRestart: () => void;
}

export default function Results({ requirements, offers, onRestart }: ResultsProps) {
  const [reportSaved, setReportSaved] = useState(false);
  const { user, saveReport } = useAuth();
  const { formData } = useFormContext();

  const handleSaveReport = async () => {
    if (!user) {
      alert('Musisz być zalogowany, aby zapisać raport');
      return;
    }

    try {
      await saveReport({
        isPaid: true,
        formData,
        requirements,
        offers,
        title: `Raport z ${new Date().toLocaleDateString('pl-PL')}`,
      });
      setReportSaved(true);
      alert('Raport został zapisany w Twoim profilu!');
    } catch (error: any) {
      alert(error.message || 'Wystąpił błąd podczas zapisywania raportu');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-[#faf5f5] rounded-full mb-6">
            <svg className="w-12 h-12 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Twoje Idealne Auto
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Przeanalizowaliśmy Twoje codzienne potrzeby i wyliczyliśmy optymalne parametry
          </p>

          {/* Save Report Button */}
          {user && !reportSaved && (
            <div className="mt-6">
              <button
                onClick={() => handleSaveReport()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                💾 Zapisz raport w profilu
              </button>
            </div>
          )}
          {reportSaved && (
            <div className="mt-6 inline-block px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              ✓ Raport zapisany w profilu
            </div>
          )}
        </div>

        {/* KOMPLEKSOWA ANALIZA - JEDEN KONTENER */}
        <div className="bg-gradient-to-br from-[#faf5f5] via-white to-blue-50 rounded-3xl p-8 md:p-12 mb-8 border-2 border-[#b85450] shadow-lg">
          {/* SEKCJA 1: Rekomendacje Algorytmu */}
          <div className="mb-10">
            <h2 className="text-3xl font-light text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Inteligentne Rekomendacje</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Pojemność silnika */}
              {requirements.optimalEngineSize && (
                <div className="bg-white p-6 rounded-xl border-2 border-[#b85450] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">🔧</span>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Silnik</div>
                  </div>
                  <div className="text-4xl font-bold text-[#b85450] mb-1">
                    {(requirements.optimalEngineSize / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {requirements.optimalEngineSize}cc • {requirements.recommendedPower} KM
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {requirements.engineSizeReasoning}
                  </p>
                </div>
              )}

              {/* Rodzaj paliwa */}
              {requirements.recommendedFuelType && (
                <div className="bg-white p-6 rounded-xl border-2 border-blue-400 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">⛽</span>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Paliwo</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-3">
                    {requirements.recommendedFuelType}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {requirements.fuelTypeReasoning}
                  </p>
                </div>
              )}

              {/* Typ nadwozia */}
              {requirements.recommendedBodyStyle && (
                <div className="bg-white p-6 rounded-xl border-2 border-green-400 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">🚗</span>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Nadwozie</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-3">
                    {requirements.recommendedBodyStyle}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {requirements.bodyStyleReasoning}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEKCJA 2: Twój Profil */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <h3 className="text-2xl font-light text-gray-900 mb-5 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <span>Twój Profil</span>
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">💰 Dochód</div>
                <div className="text-xl font-bold text-gray-900">{formData.monthlyIncome.toLocaleString()} zł</div>
              </div>

              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">🚗 Przebieg</div>
                <div className="text-xl font-bold text-gray-900">{formData.dailyKmDriven} km/dzień</div>
                <div className="text-xs text-gray-600">≈ {(formData.dailyKmDriven * 250).toLocaleString()} km/rok</div>
              </div>

              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">👨‍👩‍👧‍👦 Rodzina</div>
                <div className="text-xl font-bold text-gray-900">
                  {formData.householdSize} {formData.householdSize === 1 ? 'os.' : formData.householdSize < 5 ? 'os.' : 'os.'}
                </div>
                {formData.childrenCount > 0 && (
                  <div className="text-xs text-gray-600">{formData.childrenCount} {formData.childrenCount === 1 ? 'dziecko' : 'dzieci'}</div>
                )}
              </div>

              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">⭐ Priorytet</div>
                <div className="text-lg font-bold text-gray-900">
                  {formData.mainConcern === 'economy' ? 'Oszczędność' : 
                   formData.mainConcern === 'reliability' ? 'Niezawodność' : 
                   formData.mainConcern === 'comfort' ? 'Komfort' : 
                   formData.mainConcern === 'space' ? 'Przestrzeń' : 'Różne'}
                </div>
              </div>
            </div>

            {/* Warunki kompaktowo */}
            <div className="mt-4 bg-white/80 p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase">Warunki użytkowania</div>
              <div className="grid md:grid-cols-4 gap-3 text-sm">
                {formData.winterConditions && (
                  <div className="flex items-center gap-2">
                    <span>❄️</span>
                    <span className="text-gray-700">
                      {formData.winterConditions === 'none' ? 'Łagodne zimy' : 
                       formData.winterConditions === 'mild' ? 'Normalne zimy' : 
                       formData.winterConditions === 'regular' ? 'Śnieżne zimy' : 
                       'Ekstremalne zimy'}
                    </span>
                  </div>
                )}
                {formData.roadType && (
                  <div className="flex items-center gap-2">
                    <span>🛣️</span>
                    <span className="text-gray-700">
                      {formData.roadType === 'paved' ? 'Asfalt' : 
                       formData.roadType === 'occasional-dirt' ? 'Czasem szutry' : 
                       'Często szutry'}
                    </span>
                  </div>
                )}
                {formData.hilliness && (
                  <div className="flex items-center gap-2">
                    <span>⛰️</span>
                    <span className="text-gray-700">
                      {formData.hilliness === 'flat' ? 'Płaski teren' : 
                       formData.hilliness === 'moderate' ? 'Pagórkowaty' : 
                       'Górzysty'}
                    </span>
                  </div>
                )}
                {formData.dailyCommuteCongestion && (
                  <div className="flex items-center gap-2">
                    <span>🚦</span>
                    <span className="text-gray-700">
                      {formData.dailyCommuteCongestion === 'light' ? 'Lekkie korki' : 
                       formData.dailyCommuteCongestion === 'moderate' ? 'Umiarkowane korki' : 
                       'Ciężkie korki'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEKCJA 3: Potrzeby transportowe - kompaktowo */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 className="text-2xl font-light text-gray-900 mb-5 flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <span>Co będziesz przewozić</span>
            </h3>
            
            <div className="bg-white/80 p-5 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                {formData.weeklyGroceries && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">
                      Zakupy: {formData.weeklyGroceries === 'small' ? '1-2 torby' : 
                               formData.weeklyGroceries === 'medium' ? '3-5 toreb' : 
                               formData.weeklyGroceries === 'large' ? 'Pełny wózek' : 'Hurtowe'}
                    </span>
                  </div>
                )}
                {formData.sportsEquipment && formData.sportsEquipment !== 'none' && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">
                      Sport: {formData.sportsEquipment === 'small' ? 'Mały sprzęt' : 
                              formData.sportsEquipment === 'bikes' ? 'Rowery' : 
                              formData.sportsEquipment === 'large' ? 'Duży sprzęt' : 'Różny'}
                    </span>
                  </div>
                )}
                {formData.petTransport && formData.petTransport !== 'none' && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">
                      Zwierzę: {formData.petTransport === 'small' ? 'Małe' : 
                                formData.petTransport === 'medium' ? 'Średnie' : 
                                formData.petTransport === 'large' ? 'Duże' : 'Różne'}
                    </span>
                  </div>
                )}
                {formData.strollerType && formData.strollerType !== 'none' && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">
                      Wózek: {formData.strollerType === 'compact' ? 'Kompaktowy' : 'Duży/Gondola'}
                    </span>
                  </div>
                )}
                {formData.longTripsPerYear > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">Dalekie trasy: {formData.longTripsPerYear}x/rok</span>
                  </div>
                )}
                {formData.trailerNeeded && formData.trailerNeeded !== 'never' && (
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">
                      Przyczepa: {formData.trailerNeeded === 'occasionally' ? 'Czasem (750kg)' : 'Regularnie (1500kg)'}
                    </span>
                  </div>
                )}
                {formData.childSeats > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span className="text-gray-700">Foteliki ISOFIX: {formData.childSeats}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEKCJA 4: Dodatkowe informacje - kompaktowo */}
          <div>
            <h3 className="text-2xl font-light text-gray-900 mb-5 flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              <span>Inne informacje</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-3 font-semibold uppercase">Doświadczenie</div>
                <div className="space-y-2 text-sm">
                  {formData.mechanicalSkills && (
                    <div className="text-gray-700">
                      🔧 Naprawy: {formData.mechanicalSkills === 'none' ? 'Tylko warsztat' : 
                                   formData.mechanicalSkills === 'basic' ? 'Podstawowe' : 'Zaawansowane'}
                    </div>
                  )}
                  {formData.plannedOwnership && (
                    <div className="text-gray-700">
                      ⏱️ Okres: {formData.plannedOwnership === 'short' ? '1-3 lata' : 
                                 formData.plannedOwnership === 'medium' ? '3-7 lat' : '7+ lat'}
                    </div>
                  )}
                  {formData.accelerationImportance && (
                    <div className="text-gray-700">
                      ⚡ Przyspieszanie: {formData.accelerationImportance === 'low' ? 'Mało ważne' : 
                                         formData.accelerationImportance === 'medium' ? 'Średnio' : 'Bardzo ważne'}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-3 font-semibold uppercase">Twoje Decyzje</div>
                <div className="space-y-2 text-sm">
                  {formData.fuelTypePreference && (
                    <div className="text-gray-700">
                      ⛽ Paliwo: {formData.fuelTypePreference === 'open' ? '🤖 Algorytm' : '🎯 Własny wybór'}
                    </div>
                  )}
                  {formData.bodyStylePreference && (
                    <div className="text-gray-700">
                      🚗 Nadwozie: {formData.bodyStylePreference === 'open' ? '🤖 Algorytm' : '🎯 Własny wybór'}
                    </div>
                  )}
                  {formData.engineSizePreference && (
                    <div className="text-gray-700">
                      🔧 Silnik: {formData.engineSizePreference === 'open' ? '🤖 Algorytm' : '🎯 Własny wybór'}
                    </div>
                  )}
                  {formData.olxRegion && (
                    <div className="text-gray-700">📍 Region: {formData.olxRegion}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROCZNE KOSZTY I EKONOMIA */}
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-amber-300">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <span>Roczne Koszty Utrzymania</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <div className="text-xs text-gray-500 mb-2 uppercase">Paliwo rocznie</div>
              <div className="text-3xl font-bold text-amber-600">{requirements.estimatedAnnualCosts.fuel.toLocaleString()} zł</div>
              <div className="text-xs text-gray-600 mt-1">{(requirements.usageProfile.annualMileage / 100 * 6).toFixed(0)} L/rok</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <div className="text-xs text-gray-500 mb-2 uppercase">Ubezpieczenie + serwis</div>
              <div className="text-3xl font-bold text-amber-600">{(requirements.estimatedAnnualCosts.insurance + requirements.estimatedAnnualCosts.maintenance).toLocaleString()} zł</div>
              <div className="text-xs text-gray-600 mt-1">OC/AC + przeglądy</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <div className="text-xs text-gray-500 mb-2 uppercase">Naprawy i części</div>
              <div className="text-3xl font-bold text-amber-600">{requirements.estimatedAnnualCosts.repairs.toLocaleString()} zł</div>
              <div className="text-xs text-gray-600 mt-1">Średnie naprawy/rok</div>
            </div>

            <div className="bg-white p-5 rounded-xl border-2 border-amber-500">
              <div className="text-xs text-gray-500 mb-2 uppercase font-bold">RAZEM ROCZNIE</div>
              <div className="text-4xl font-bold text-amber-700">{requirements.estimatedAnnualCosts.total.toLocaleString()} zł</div>
              <div className="text-xs text-gray-600 mt-1">≈ {Math.round(requirements.estimatedAnnualCosts.total / 12)} zł/miesiąc</div>
            </div>
          </div>
        </div>

        {/* BEZPIECZEŃSTWO I KOMFORT */}
        <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-red-300">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <span>Bezpieczeństwo i Komfort</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-red-200">
              <h3 className="font-semibold text-gray-900 mb-3">Systemy Bezpieczeństwa</h3>
              <ul className="space-y-2">
                {requirements.recommendedSafetyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-red-200">
              <h3 className="font-semibold text-gray-900 mb-3">Elementy Komfortu</h3>
              <ul className="space-y-2">
                {requirements.comfortFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold">★</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {requirements.familyNeeds && (
              <div className="bg-white p-5 rounded-xl border border-red-200 md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3">👨‍👩‍👧 Dla Rodziny</h3>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Foteliki dziecięce</div>
                    <div className="text-gray-700">{requirements.familyNeeds.childSeatCompatibility}</div>
                  </div>
                  {requirements.familyNeeds.rearLegroom && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Przestrzeń na tylnej kanapie</div>
                      <div className="text-gray-700">{requirements.familyNeeds.rearLegroom}</div>
                    </div>
                  )}
                  {requirements.familyNeeds.sunRoof && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Dodatki</div>
                      <div className="text-gray-700">Panoramiczny dach</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AKCESORIA I SPECJALNE POTRZEBY */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-green-300">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🛠️</span>
            <span>Rekomendowane Akcesoria i Akcje</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Akcesoria Dodatkowe</h3>
              <ul className="space-y-2">
                {requirements.recommendedAccessories.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600">📦</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Aktywność i Sport</h3>
              <ul className="space-y-2">
                {requirements.activityRecommendations.map((activity, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600">⚙️</span>
                    <span className="text-gray-700">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Opony i Paliwo</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Rozmiar opon</div>
                  <div className="text-gray-700">{requirements.tireRecommendations.recommendedSize}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Opony zimowe</div>
                  <div className="text-gray-700">{requirements.tireRecommendations.winterTiresRequired ? 'Wymagane' : 'Opcjonalne'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Spalanie (miasto)</div>
                  <div className="text-gray-700">max. {requirements.maxFuelConsumption} L/100km</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Niezawodność</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Polecane marki</div>
                  <div className="text-gray-700">{requirements.reliabilityInfo.recommendedBrands.join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Dostępność części</div>
                  <div className="text-gray-700">{requirements.reliabilityInfo.partsAvailability}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Serwis</div>
                  <div className="text-gray-700">{requirements.reliabilityInfo.serviceNetworkSize}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REKOMENDACJE NA PODSTAWIE STYLU ŻYCIA */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-purple-300">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <span>Personalne Rekomendacje</span>
          </h2>
          
          <div className="bg-white p-6 rounded-xl border border-purple-200">
            <div className="space-y-3">
              {requirements.lifestyleRecommendations.map((recommendation, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                  <span className="text-purple-600 text-xl">→</span>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALTERNATYWNE MODELE */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-blue-300">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🚗</span>
            <span>Alternatywne Modele</span>
          </h2>
          
          <div className="bg-white p-5 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600 mb-3">Poniżej znajdziesz konkurencyjne modele w podobnym segmencie:</p>
            <div className="grid md:grid-cols-4 gap-3">
              {requirements.competitorModels.map((model, i) => (
                <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-gray-900">{model}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EKOLOGIA I EMISJE */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-green-400">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            <span>Ekologia i Emisje CO₂</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-green-300">
              <div className="text-xs text-gray-500 mb-2">Emisja CO₂</div>
              <div className="text-3xl font-bold text-green-600">{requirements.environmentalInfo.co2Emissions}</div>
              <div className="text-xs text-gray-600">g/km (szacunkowo)</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-green-300">
              <div className="text-xs text-gray-500 mb-2">Standard europejski</div>
              <div className="text-2xl font-bold text-green-600">{requirements.environmentalInfo.euStandard}</div>
              <div className="text-xs text-gray-600">Zaawansowane oczyszczanie</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-green-300">
              <div className="text-xs text-gray-500 mb-2">Poziom emisji</div>
              <div className="text-xl font-bold text-green-600">{requirements.environmentalInfo.pollutantLevel}</div>
              <div className="text-xs text-gray-600">Dla środowiska</div>
            </div>
          </div>
        </div>

        {/* FULL ANALYSIS */}
        <div className="bg-linear-to-r from-[#faf5f5] to-white rounded-2xl p-8 md:p-12 mb-8 border-2 border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-gray-900 flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Szczegóły Techniczne
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Budżet */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Rekomendowany budżet</div>
              <div className="text-2xl font-medium text-gray-900">
                {requirements.recommendedBudget > 0 
                  ? `${(requirements.recommendedBudget / 1000).toFixed(0)}k zł`
                  : 'Nie określono'}
              </div>
            </div>

            {/* Segment */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Rekomendowany segment</div>
              <div className="text-2xl font-medium text-gray-900">
                {requirements.recommendedSegments[0] || 'Dowolny'}
              </div>
            </div>

            {/* Moc */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Minimalna moc</div>
              <div className="text-2xl font-medium text-gray-900">
                min. {requirements.minPower} KM
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-light">
            {requirements.reasoning.segment}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 mt-8">
            {/* Bagażnik */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Bagażnik</div>
              <div className="text-2xl font-medium text-gray-900">
                {requirements.minTrunkCapacity} - {requirements.recommendedTrunkCapacity}L
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {requirements.reasoning.trunk}
              </div>
            </div>

            {/* Przyspieszenie */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Przyspieszenie 0-100</div>
              <div className="text-2xl font-medium text-gray-900">
                {'<'} {requirements.maxAcceleration}s
              </div>
            </div>

            {/* Miejsca */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Miejsca siedzące</div>
              <div className="text-2xl font-medium text-gray-900">
                min. {requirements.minSeats}
                {requirements.thirdRowNeeded && <span className="text-base ml-2">(7-osobowe)</span>}
              </div>
            </div>

            {/* Spalanie */}
            <div className="p-4 bg-white rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Spalanie (miasto)</div>
              <div className="text-2xl font-medium text-gray-900">
                max. {requirements.maxFuelConsumption}L/100km
              </div>
            </div>

            {/* Prześwit */}
            {requirements.minGroundClearance > 140 && (
              <div className="p-4 bg-white rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Prześwit</div>
                <div className="text-2xl font-medium text-gray-900">
                  min. {requirements.minGroundClearance}mm
                </div>
              </div>
            )}

            {/* Holowanie */}
            {requirements.towingCapacity > 0 && (
              <div className="p-4 bg-white rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Masa holownicza</div>
                <div className="text-2xl font-medium text-gray-900">
                  min. {requirements.towingCapacity}kg
                </div>
              </div>
            )}

            {/* Koszty miesięczne */}
            {requirements.maxMonthlyCost > 0 && (
              <div className="p-4 bg-white rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Miesięczny koszt</div>
                <div className="text-2xl font-medium text-gray-900">
                  ~{requirements.maxMonthlyCost} zł/mies.
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  paliwo + ubezpieczenie + rata
                </div>
              </div>
            )}
          </div>

          {/* Additional features */}
          {requirements.reasoning.features.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">Ważne funkcje:</div>
              <ul className="space-y-1">
                {requirements.reasoning.features.map((feat, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#b85450] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* OFFERS SECTION */}
        {offers && offers.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Aktualne Oferty
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Znaleźliśmy {offers.length} ofert które pasują do Twoich wymagań
              </p>
            </div>

            <div className="space-y-6">
              {offers.map((offer) => {
                const matchColor = offer.matchScore >= 85 ? 'bg-green-50 border-green-200' :
                                   offer.matchScore >= 70 ? 'bg-blue-50 border-blue-200' :
                                   offer.matchScore >= 60 ? 'bg-yellow-50 border-yellow-200' :
                                   'bg-red-50 border-red-200';

                const matchBgColor = offer.matchScore >= 85 ? 'bg-green-100 text-green-700' :
                                     offer.matchScore >= 70 ? 'bg-blue-100 text-blue-700' :
                                     offer.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-red-100 text-red-700';

                return (
                  <div key={offer.id} className={`border-2 rounded-2xl p-8 md:p-10 transition-all hover:shadow-md ${matchColor}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-light text-gray-900">
                          {offer.make} {offer.model}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {offer.year} • {offer.mileage.toLocaleString()} km {offer.location && `• ${offer.location}`}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className={`px-6 py-3 rounded-full text-center ${matchBgColor} font-semibold text-lg`}>
                          {offer.matchScore}%
                        </div>
                        <p className="text-xs text-gray-500 mt-2">dopasowanie</p>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-white/60 rounded-xl">
                      <div className="text-3xl font-semibold text-[#b85450] mb-1">
                        {offer.price.toLocaleString()} zł
                      </div>
                      <div className="text-sm text-gray-600">
                        Cena rynkowa na Otomoto
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Paliwo</div>
                        <div className="font-medium text-gray-900">{offer.fuelType}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Moc</div>
                        <div className="font-medium text-gray-900">{offer.enginePower} KM</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Skrzynia</div>
                        <div className="font-medium text-gray-900">{offer.transmission}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Napęd</div>
                        <div className="font-medium text-gray-900">{offer.driveType}</div>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-white/60 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-3">Porównanie z Twoimi wymaganiami:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className={`text-lg mt-0 ${offer.enginePower >= requirements.minPower ? 'text-green-600' : 'text-red-600'}`}>
                            {offer.enginePower >= requirements.minPower ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            Moc {offer.enginePower} KM (wymagane min. {requirements.minPower} KM)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lg text-blue-600">→</span>
                          <span className="text-sm text-gray-700">
                            Szacunkowy roczny koszt eksploatacji: ~{Math.round((offer.enginePower / 100) * 4500)} zł
                          </span>
                        </li>
                      </ul>
                    </div>

                    {offer.warnings && offer.warnings.length > 0 && (
                      <div className="mb-6 p-4 bg-amber-100/50 border border-amber-300 rounded-xl">
                        <h4 className="font-medium text-amber-900 mb-2">Uwagi:</h4>
                        <ul className="space-y-1">
                          {offer.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-amber-800">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {offer.url && (
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-[#b85450] text-white rounded-full hover:bg-[#a04946] transition-colors font-medium text-center"
                        >
                          Przejdź do oferty →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-16">
          <button
            onClick={onRestart}
            className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-full font-medium hover:border-[#b85450] hover:text-[#b85450] transition-colors"
          >
            Nowa analiza
          </button>
        </div>
      </div>
    </div>
  );
}
