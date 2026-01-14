'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { CalculatedRequirements, CarOffer } from '../types';
import { useAuth } from '../context/AuthContext';
import { useFormContext } from '../context/FormContext';
 

interface ResultsProps {
  requirements: CalculatedRequirements;
  offers: CarOffer[];
  onRestart: () => void;
  disableAutoSave?: boolean;
  reportId?: string; // ID zapisanego raportu (jeśli otwieramy istniejący)
}

export default function Results({ requirements, offers, onRestart, disableAutoSave = false, reportId: initialReportId }: ResultsProps) {
  const [reportSaved, setReportSaved] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [reportId, setReportId] = useState<string | undefined>(initialReportId);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { user, saveReport, updateReportPremium, getSavedReports } = useAuth();
  const { formData } = useFormContext();
  const hasAutoSavedRef = useRef(false); // chroni przed wielokrotnym autozapisem

  // Jeśli wchodzimy z istniejącym raportem, ustaw stan zapisany
  useEffect(() => {
    if (initialReportId) {
      setReportSaved(true);
      setReportId(initialReportId);
    }
  }, [initialReportId]);
 
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user || !reportId) {
        setHasAccess(false);
        return;
      }
      
      try {
        const reports = await getSavedReports();
        const currentReport = reports.find(r => r.id === reportId);
        setHasAccess(currentReport?.isPremium || false);
      } catch (e) {
        console.error('Nie udało się sprawdzić statusu premium', e);
        setHasAccess(false);
      }
    };
    
    checkPremiumStatus();
  }, [user, reportId, getSavedReports]);

  const startCheckout = async () => {
    if (!reportId) {
      setCheckoutError('Najpierw zapisz raport, aby odblokować płatność.');
      return;
    }
    
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/create-checkout-session', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Brak adresu płatności');
      window.location.href = data.url;
    } catch (error) {
      console.error('Błąd płatności', error);
      setCheckoutError('Nie udało się uruchomić płatności. Spróbuj ponownie.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const Paywall = ({ children }: { children: ReactNode }) => (
    <div className="relative">
      <div className={hasAccess ? '' : 'blur-sm pointer-events-none select-none'}>{children}</div>
      {!hasAccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md border border-indigo-200 shadow-2xl rounded-2xl p-6 max-w-md text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Odblokuj pełny raport</h3>
            <p className="text-gray-600 text-sm">Za 10 € zobaczysz wszystkie sekcje, analizy i rekomendacje.</p>
            {checkoutError && <p className="text-sm text-rose-600">{checkoutError}</p>}
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60"
            >
              {checkoutLoading ? 'Łączenie z płatnością...' : 'Odblokuj za 10 €'}
            </button>
            <p className="text-xs text-gray-500">Bez zakładania subskrypcji. Jednorazowa płatność.</p>
          </div>
        </div>
      )}
    </div>
  );


  // Automatyczne zapisywanie raportu dla zalogowanych użytkowników (tylko raz)
  useEffect(() => {
    const autoSaveReport = async () => {
      if (!user || disableAutoSave) return;
      if (reportSaved || autoSaving || hasAutoSavedRef.current) return;

      hasAutoSavedRef.current = true; // blokada przed kolejnym wywołaniem
      setAutoSaving(true);
      try {
        console.log('Rozpoczynam automatyczne zapisywanie raportu...');
        const savedReportId = await saveReport({
          formData,
          requirements,
          name: `Raport z ${new Date().toLocaleDateString('pl-PL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
        });
        console.log('Raport zapisany pomyślnie z ID:', savedReportId);
        setReportId(savedReportId);
        setReportSaved(true);
      } catch (error: any) {
        console.error('Błąd automatycznego zapisywania:', error);
        console.error('Szczegóły błędu:', error.message);
        hasAutoSavedRef.current = false; // pozwól spróbować ponownie ręcznie
      } finally {
        setAutoSaving(false);
      }
    };

    autoSaveReport();
  }, [user, disableAutoSave, reportSaved, autoSaving, formData, requirements, saveReport]);

  const handleSaveReport = async () => {
    if (!user) return;
    if (reportSaved && reportId) {
      alert('Raport jest już zapisany.');
      return;
    }
    
    setAutoSaving(true);
    try {
      const savedReportId = await saveReport({
        formData,
        requirements,
        name: `Raport z ${new Date().toLocaleDateString('pl-PL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
      });
      setReportId(savedReportId);
      setReportSaved(true);
      hasAutoSavedRef.current = true;
      alert('Raport zapisany pomyślnie!');
    } catch (error: any) {
      console.error('Błąd zapisywania:', error);
      alert('Wystąpił błąd podczas zapisywania raportu.');
    } finally {
      setAutoSaving(false);
    }
  };

  const calculateMatchPercentage = (offer: any, requirements: CalculatedRequirements): number => {
    let matches = 0;
    let totalChecks = 0;

    // Sprawdzenie ceny
    totalChecks++;
    if (offer.price >= requirements.recommendedBudget * 0.8 && offer.price <= requirements.recommendedBudget * 1.2) {
      matches += 1;
    } else if (offer.price >= requirements.recommendedBudget * 0.6 && offer.price <= requirements.recommendedBudget * 1.4) {
      matches += 0.7;
    }

    // Sprawdzenie mocy
    totalChecks++;
    if (offer.power >= requirements.minPower) {
      matches += 1;
    } else if (offer.power >= requirements.minPower * 0.85) {
      matches += 0.6;
    }

    // Sprawdzenie paliwa
    totalChecks++;
    if (offer.fuel.toLowerCase().includes(requirements.recommendedFuelType.toLowerCase())) {
      matches += 1;
    } else {
      matches += 0.3;
    }

    // Sprawdzenie roku
    totalChecks++;
    const carAge = new Date().getFullYear() - offer.year;
    if (carAge <= 5) {
      matches += 1;
    } else if (carAge <= 10) {
      matches += 0.7;
    } else {
      matches += 0.3;
    }

    // Sprawdzenie przebiegu
    totalChecks++;
    const avgMileagePerYear = 10000;
    const expectedMileage = carAge * avgMileagePerYear;
    if (offer.mileage <= expectedMileage * 1.2) {
      matches += 1;
    } else if (offer.mileage <= expectedMileage * 1.5) {
      matches += 0.7;
    } else {
      matches += 0.3;
    }

    const percentage = Math.round((matches / totalChecks) * 100);
    return Math.min(100, percentage);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-rose-400/20 to-pink-500/20 blur-3xl rounded-full animate-pulse" style={{animationDelay: '2s'}} />
        <div className="hidden lg:block absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 blur-3xl rounded-full animate-pulse" style={{animationDelay: '3s'}} />
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 relative">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/50">
          <div className="inline-flex p-3 sm:p-4 md:p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 md:mb-8 shadow-lg shadow-indigo-500/30 transform hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Twoje Idealne Auto
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium px-2">
            Przeanalizowaliśmy Twoje codzienne potrzeby i wyliczyliśmy optymalne parametry
          </p>

          {/* Auto-saved notification */}
          {user && reportSaved && (
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Raport automatycznie zapisany w Twoim profilu
            </div>
          )}
          {user && autoSaving && (
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Zapisywanie raportu...
            </div>
          )}
          {!user && (
            <div className="mt-6 inline-block px-6 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-medium">
              💡 Zaloguj się, aby automatycznie zapisywać raporty
            </div>
          )}

          {/* Manual Save Button (backup) */}
          {user && !reportSaved && !autoSaving && (
            <div className="mt-4">
              <button
                onClick={() => handleSaveReport()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                💾 Zapisz raport ponownie
              </button>
            </div>
          )}
        </div>

        {/* KOMPLEKSOWA ANALIZA - JEDEN KONTENER */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-10 lg:p-16 mb-6 sm:mb-8 md:mb-12 border border-white/50 shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-shadow duration-500">
          {/* SEKCJA 1: Rekomendacje Algorytmu */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/30 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Inteligentne Rekomendacje
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
              {/* Pojemność silnika */}
              {requirements.optimalEngineSize && (
                <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-rose-300 shadow-lg hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-rose-400/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg shadow-md">
                        <span className="text-xl sm:text-2xl">🔧</span>
                      </div>
                      <div className="text-xs text-rose-700 font-bold uppercase tracking-wider">Silnik</div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {(requirements.optimalEngineSize / 1000).toFixed(1)}
                    </div>
                    <div className="text-xs sm:text-sm text-rose-700 font-semibold mb-3 sm:mb-4">
                      {requirements.optimalEngineSize}cc • {requirements.recommendedPower} KM
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {requirements.engineSizeReasoning}
                    </p>
                  </div>
                </div>
              )}

              {/* Rodzaj paliwa */}
              {requirements.recommendedFuelType && (
                <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-blue-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                        <span className="text-xl sm:text-2xl">⛽</span>
                      </div>
                      <div className="text-xs text-blue-700 font-bold uppercase tracking-wider">Paliwo</div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                      {requirements.recommendedFuelType}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {requirements.fuelTypeReasoning}
                    </p>
                  </div>
                </div>
              )}

              {/* Typ nadwozia */}
              {requirements.recommendedBodyStyle && (
                <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-emerald-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                        <span className="text-xl sm:text-2xl">🚗</span>
                      </div>
                      <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Nadwozie</div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                      {requirements.recommendedBodyStyle}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {requirements.bodyStyleReasoning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Paywall>
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
                      ⛽ Paliwo: {
                        formData.fuelTypePreference === 'open'
                          ? `${requirements.recommendedFuelType} (rekomendacja)`
                          : '🎯 Własny wybór'
                      }
                    </div>
                  )}
                  {formData.bodyStylePreference && (
                    <div className="text-gray-700">
                      🚗 Nadwozie: {
                        formData.bodyStylePreference === 'open'
                          ? `${(requirements.recommendedBodyStyles || []).join(', ') || requirements.recommendedBodyStyle}`
                          : '🎯 Własny wybór'
                      }
                    </div>
                  )}
                  {formData.engineSizePreference && (
                    <div className="text-gray-700">
                      🔧 Silnik: {
                        formData.engineSizePreference === 'open'
                          ? `${requirements.optimalEngineSize} cc, ~${requirements.recommendedPower} KM`
                          : '🎯 Własny wybór'
                      }
                    </div>
                  )}
                  {formData.olxRegion && (
                    <div className="text-gray-700">📍 Region: {formData.olxRegion}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </Paywall>
        </div>

        {/* ROCZNE KOSZTY I EKONOMIA */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl">💰</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Roczne Koszty Utrzymania
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border-2 border-amber-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2 sm:mb-3">Paliwo rocznie</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">{requirements.estimatedAnnualCosts.fuel.toLocaleString()} zł</div>
              <div className="text-xs sm:text-sm text-amber-700 font-semibold">{(requirements.usageProfile.annualMileage / 100 * 6).toFixed(0)} L/rok</div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border-2 border-blue-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-2 sm:mb-3">Ubezpieczenie + serwis</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{(requirements.estimatedAnnualCosts.insurance + requirements.estimatedAnnualCosts.maintenance).toLocaleString()} zł</div>
              <div className="text-xs sm:text-sm text-blue-700 font-semibold">OC/AC + przeglądy</div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border-2 border-purple-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-2 sm:mb-3">Naprawy i części</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{requirements.estimatedAnnualCosts.repairs.toLocaleString()} zł</div>
              <div className="text-xs sm:text-sm text-purple-700 font-semibold">Średnie naprawy/rok</div>
            </div>

            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border-2 border-emerald-400 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-xs text-emerald-700 font-black uppercase tracking-wider mb-2 sm:mb-3">RAZEM ROCZNIE</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{requirements.estimatedAnnualCosts.total.toLocaleString()} zł</div>
                <div className="text-xs sm:text-sm text-emerald-700 font-bold">≈ {Math.round(requirements.estimatedAnnualCosts.total / 12)} zł/miesiąc</div>
              </div>
            </div>
          </div>
        </div>
        </Paywall>

        {/* BEZPIECZEŃSTWO I KOMFORT */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-red-500/10 hover:shadow-red-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg sm:rounded-xl shadow-lg shadow-red-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🛡️</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Bezpieczeństwo i Komfort
            </h2>
          </div>
          
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
        </Paywall>

        {/* AKCESORIA I SPECJALNE POTRZEBY */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg shadow-teal-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🛠️</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Rekomendowane Akcesoria i Akcje
            </h2>
          </div>
          
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
        </Paywall>

        {/* REKOMENDACJE NA PODSTAWIE STYLU ŻYCIA */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:pb-10 md:pt-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🎯</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Personalne Rekomendacje
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
            <div className="space-y-4">
              {requirements.lifestyleRecommendations.map((recommendation, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-purple-200/50 last:border-b-0">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg shadow-md flex-shrink-0">
                    <span className="text-white text-sm font-bold">→</span>
                  </div>
                  <p className="text-gray-800 font-medium leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Paywall>

        {/* EKOLOGIA I EMISJE */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🌍</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ekologia i Emisje CO₂
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-7 rounded-2xl border-2 border-emerald-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-3">Emisja CO₂</div>
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{requirements.environmentalInfo.co2Emissions}</div>
              <div className="text-sm text-emerald-700 font-semibold">g/km (szacunkowo)</div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-7 rounded-2xl border-2 border-blue-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-3">Standard europejski</div>
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{requirements.environmentalInfo.euStandard}</div>
              <div className="text-sm text-blue-700 font-semibold">Zaawansowane oczyszczanie</div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-7 rounded-2xl border-2 border-purple-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-3">Poziom emisji</div>
              <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{requirements.environmentalInfo.pollutantLevel}</div>
              <div className="text-sm text-purple-700 font-semibold">Dla środowiska</div>
            </div>
          </div>
        </div>
        </Paywall>

        {/* FULL ANALYSIS */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 mb-6 sm:mb-8 md:mb-10 border border-white/50 shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
        </Paywall>

        {/* ALTERNATYWNE MODELE */}
        <Paywall>
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-10 lg:p-16 mb-6 sm:mb-8 md:mb-12 border border-white/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-shadow duration-500">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
            <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl md:text-4xl">🚗</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Przykładowe Modele
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {[
              { model: 'Toyota Corolla', variant: '2020 | 45k km', year: 2020, mileage: 45000, price: 65000, fuel: 'Benzyna', engine: '1.6L', power: 130, color: 'from-blue-500 to-blue-600' },
              { model: 'Honda Civic', variant: '2019 | 62k km', year: 2019, mileage: 62000, price: 58000, fuel: 'Benzyna', engine: '1.5L', power: 128, color: 'from-indigo-500 to-indigo-600' },
              { model: 'Mazda3', variant: '2021 | 32k km', year: 2021, mileage: 32000, price: 72000, fuel: 'Benzyna', engine: '2.0L', power: 150, color: 'from-purple-500 to-purple-600' },
              { model: 'Hyundai i30', variant: '2018 | 78k km', year: 2018, mileage: 78000, price: 45000, fuel: 'Diesel', engine: '1.6L', power: 110, color: 'from-cyan-500 to-blue-500' },
            ]
            .map((offer) => ({
              ...offer,
              matchPercentage: calculateMatchPercentage(offer, requirements)
            }))
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .map((offer, i) => {
              const matchColor = offer.matchPercentage >= 80 ? 'text-green-600' : offer.matchPercentage >= 60 ? 'text-yellow-600' : 'text-orange-600';
              const matchBgColor = offer.matchPercentage >= 80 ? 'bg-green-50 border-green-200' : offer.matchPercentage >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-orange-50 border-orange-200';
              
              return (
              <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${offer.color} h-24 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-10 -mt-10 opacity-10 group-hover:scale-150 transition-transform duration-300"></div>
                  {/* Match percentage badge */}
                  <div className={`absolute top-4 right-4 ${matchBgColor} border rounded-lg px-3 py-2`}>
                    <div className="text-xs font-bold text-gray-700">Zgodność</div>
                    <div className={`text-xl font-bold ${matchColor}`}>{offer.matchPercentage}%</div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative -mt-12 px-6 pb-6 pt-4">
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{offer.model}</div>
                    <div className="text-sm text-gray-500 font-medium">{offer.variant}</div>
                  </div>

                  {/* Price highlight */}
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-4 border border-orange-200">
                    <div className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Cena</div>
                    <div className="text-3xl font-bold text-orange-600">{(offer.price / 1000).toFixed(0)}k zł</div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <span>⛽</span> Paliwo
                      </div>
                      <div className="text-sm font-bold text-gray-900">{offer.fuel}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <span>⚙️</span> Silnik
                      </div>
                      <div className="text-sm font-bold text-gray-900">{offer.engine}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <span>🏎️</span> Moc
                      </div>
                      <div className="text-sm font-bold text-gray-900">{offer.power} KM</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <span>📊</span> Przebieg
                      </div>
                      <div className="text-sm font-bold text-gray-900">{(offer.mileage / 1000).toFixed(0)}k km</div>
                    </div>
                  </div>

                  {/* Button */}
                  <button className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform group-hover:shadow-lg bg-gradient-to-r ${offer.color} hover:opacity-90`}>
                    Pokaż ofertę →
                  </button>
                </div>
              </div>
            );
            })}
          </div>        
        </div>
        </Paywall>

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
