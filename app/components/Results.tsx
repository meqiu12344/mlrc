'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { CalculatedRequirements, CarOffer, CarModel } from '../types';
import { useAuth } from '../context/AuthContext';
import { Car, BarChart3, Wallet, Home, Star, Snowflake, Wind, Zap, Info, Clock, DollarSign, Shield, Wrench, Settings, Download, ChevronDown, Lock, Fuel, Target, Save, MapPin, CheckCircle, Gauge, Lightbulb, Droplets } from 'lucide-react';
import { useFormContext } from '../context/FormContext';
 

interface ResultsProps {
  requirements: CalculatedRequirements;
  onRestart: () => void;
  disableAutoSave?: boolean;
  reportId?: string;
}

export default function Results({ requirements, onRestart, disableAutoSave = false, reportId: initialReportId }: ResultsProps) {
  const [reportSaved, setReportSaved] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [reportId, setReportId] = useState<string | undefined>(initialReportId);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [recommendedCars, setRecommendedCars] = useState<CarModel[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-amber-500/10 to-orange-600/10 blur-3xl rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-rose-500/10 to-pink-600/10 blur-3xl rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* STICKY PAYMENT BANNER - tylko gdy brak dostępu */}
      {!hasAccess && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md border-b border-indigo-400/30 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Lock className="w-6 h-6 text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">Odblokuj pełną analizę techniczną</p>
                  <p className="text-indigo-100 text-xs sm:text-sm">Wszystkie podzespoły, komponenty i szczegóły</p>
                </div>
              </div>
              <button
                onClick={startCheckout}
                disabled={checkoutLoading}
                className="whitespace-nowrap px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition disabled:opacity-60 shadow-lg hover:shadow-xl"
              >
                {checkoutLoading ? 'Łączenie...' : 'Zapłać 10 € →'}
              </button>
            </div>
            {checkoutError && (
              <p className="text-sm text-red-200 mt-2 text-center">{checkoutError}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 relative">
        {/* HERO HEADER */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex p-3 sm:p-4 md:p-5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-6 sm:mb-8 shadow-2xl shadow-blue-500/40">
            <Car className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Twoje Idealne Auto
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light px-4 mb-8">
            Analiza wszystkich podzespołów dostosowana do Twojego stylu życia
          </p>
          
          {user && reportSaved && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-400/50 text-green-300 rounded-xl font-medium">
              <CheckCircle className="w-5 h-5" />
              Raport zapisany w profilu
            </div>
          )}
          {user && autoSaving && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl font-medium">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Zapisywanie raportu...
            </div>
          )}
        </div>

        {/* QUICK SPECS - GŁÓWNE PARAMETRY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16">
          <div className="group relative bg-gradient-to-br from-blue-600/40 to-cyan-600/40 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Pojemność</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{(requirements.optimalEngineSize / 1000).toFixed(1)}L</div>
              <div className="text-xs text-blue-200 mt-1">{requirements.optimalEngineSize}cc</div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-amber-600/40 to-orange-600/40 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">Moc</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{requirements.minPower}+</div>
              <div className="text-xs text-amber-200 mt-1">KM</div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-600/40 to-emerald-600/40 backdrop-blur-xl p-6 rounded-2xl border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2">Paliwo</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{requirements.recommendedFuelType}</div>
              <div className="text-xs text-green-200 mt-1">Rekomendowane</div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">Nadwozie</div>
              <div className="text-xl sm:text-2xl font-black text-white">{requirements.recommendedBodyStyle}</div>
              <div className="text-xs text-purple-200 mt-1">Typ</div>
            </div>
          </div>
        </div>

        {/* SEKCJE DLA LAIKÓW - PROSTE WYJAŚNIENIA */}
        <div className="space-y-8 mb-16">

          {/* 1. SERCE AUTA */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-rose-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Serce auta: Jaki silnik i napęd?</h2>
            </div>

            <div className="space-y-6">
              {/* Rodzaj paliwa */}
              <div className="bg-rose-500/20 backdrop-blur-sm border border-rose-400/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Fuel className="w-8 h-8 text-rose-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">Rodzaj paliwa: {requirements.recommendedFuelType}</h3>
                    <p className="text-slate-200 mb-4">{requirements.fuelTypeReasoning}</p>
                    <div className="bg-rose-600/30 border border-rose-400/30 rounded-xl p-4">
                      <p className="text-sm text-rose-100">
                        <strong>💡 Dlaczego to ważne?</strong> Wybór złego silnika do stylu jazdy to najprostsza droga do drogich awarii. 
                        {requirements.recommendedFuelType === 'Diesel' && " Diesel zapcha się w mieście (filtr DPF), ale na trasie jest niezawodny i ekonomiczny."}
                        {requirements.recommendedFuelType === 'Benzyna' && " Benzyna to uniwersalny wybór - działa wszędzie, tańsza w serwisie."}
                        {requirements.recommendedFuelType === 'Hybrid' && " Hybryda oszczędza paliwo w mieście (do 40%), ale na autostradzie spalanie rośnie."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skrzynia biegów */}
              {requirements.transmissionSystem && (
                <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <Settings className="w-8 h-8 text-amber-300 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">Skrzynia biegów</h3>
                      <p className="text-slate-200 mb-2">
                        {requirements.transmissionSystem.type.includes('Automatyczna') ? 
                          "Automatyczna skrzynia biegów - idealna dla miasta i długich tras." :
                          "Manualna skrzynia biegów - pełna kontrola nad autem."
                        }
                      </p>
                      <div className="bg-amber-600/30 border border-amber-400/30 rounded-xl p-4 mt-3">
                        <p className="text-sm text-amber-100">
                          <strong>💡 Dlaczego to ważne?</strong> 
                          {requirements.transmissionSystem.type.includes('Automatyczna') ? 
                            " Automat to ogromny wzrost komfortu - brak stresu przy ruszaniu pod górę czy w korku. Samochód sam zmienia biegi, Ty skupiasz się na drodze." :
                            " Manualna skrzynia daje pełną kontrolę i jest tańsza w serwisie, ale wymaga wprawy w korkach i na rampach."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Łatwość wyprzedzania */}
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">Łatwość wyprzedzania</h3>
                    <p className="text-slate-200">
                      {requirements.minPower > 150 ? 
                        "Auto ma dużo mocy - wyprzedzanie będzie szybkie i bezpieczne. Przy wjeździe na autostradę nie będziesz czuć stresu." :
                        requirements.minPower > 120 ?
                        "Auto ma wystarczającą moc do bezpiecznego wyprzedzania. Spokojnie wjedziesz na pas szybkiego ruchu." :
                        "Auto ma umiarkowaną moc - wyprzedzanie wymaga planowania. To jednak w zupełności wystarczy do codziennej jazdy."
                      }
                    </p>
                    <div className="bg-blue-600/30 border border-blue-400/30 rounded-xl p-4 mt-3">
                      <p className="text-sm text-blue-100">
                        <strong>💡 Co to oznacza?</strong> Zamiast mówić o „niutonometrach", sprawdzamy, czy auto „zbiera się" sprawnie. 
                        To daje poczucie bezpieczeństwa przy wjeżdżaniu na trasę szybkiego ruchu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. KOMFORT I CODZIENNOŚĆ */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Komfort i codzienność</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* System multimedialny */}
              {requirements.interiorComfort && (
                <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-6 h-6 text-cyan-300 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">System multimedialny</h3>
                  </div>
                  <p className="text-slate-200 text-sm mb-3">{requirements.interiorComfort.infotainment}</p>
                  <div className="bg-cyan-600/30 border border-cyan-400/30 rounded-lg p-3">
                    <p className="text-xs text-cyan-100">
                      <strong>💡 Must-have:</strong> Apple CarPlay i Android Auto to absolutna podstawa. 
                      Nie musisz uczyć się fabrycznej nawigacji - masz swoje Mapy Google i Spotify na ekranie auta.
                    </p>
                  </div>
                </div>
              )}

              {/* Reflektory */}
              {requirements.lightingSystem && (
                <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Oświetlenie</h3>
                  </div>
                  <p className="text-slate-200 text-sm mb-3">{requirements.lightingSystem.headlights}</p>
                  <div className="bg-yellow-600/30 border border-yellow-400/30 rounded-lg p-3">
                    <p className="text-xs text-yellow-100">
                      <strong>💡 Dlaczego LED?</strong> Widzisz więcej i wcześniej. 
                      Dobre światła LED drastycznie zmniejszają zmęczenie wzroku w nocy i poprawiają bezpieczeństwo.
                    </p>
                  </div>
                </div>
              )}

              {/* Klimatyzacja */}
              {requirements.interiorComfort && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Snowflake className="w-6 h-6 text-green-300 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Klimatyzacja</h3>
                  </div>
                  <p className="text-slate-200 text-sm mb-3">{requirements.interiorComfort.airConditioning}</p>
                  <div className="bg-green-600/30 border border-green-400/30 rounded-lg p-3">
                    <p className="text-xs text-green-100">
                      <strong>💡 Koniec kłótni:</strong> Klimatyzacja dwustrefowa rozwiązuje problem „mi jest zimno, a tobie gorąco". 
                      Każdy ustawia swoją temperaturę.
                    </p>
                  </div>
                </div>
              )}

              {/* Czujniki parkowania */}
              {requirements.interiorComfort && (
                <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Target className="w-6 h-6 text-purple-300 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Asystent parkowania</h3>
                  </div>
                  <p className="text-slate-200 text-sm mb-3">{requirements.interiorComfort.parkingSensors}</p>
                  <div className="bg-purple-600/30 border border-purple-400/30 rounded-lg p-3">
                    <p className="text-xs text-purple-100">
                      <strong>💡 Bez stresu:</strong> Kluczowe dla osób bojących się uszkodzenia auta w ciasnych miejscach. 
                      Auto pika i pokazuje odległość od przeszkód.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. BEZPIECZEŃSTWO */}
          {requirements.safetySystemsDetailed && (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Bezpieczeństwo i wsparcie kierowcy</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Poduszki powietrzne</h3>
                  <p className="text-slate-200 text-sm mb-3">{requirements.safetySystemsDetailed.airbags} - chronią wszystkich pasażerów w razie wypadku</p>
                  <div className="bg-red-600/30 border border-red-400/30 rounded-lg p-3">
                    <p className="text-xs text-red-100">
                      <strong>💡 Ochrona 360°:</strong> Poduszki przednie, boczne i kurtyny powietrzne tworzą „kokon bezpieczeństwa" wokół wszystkich pasażerów.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Czujniki martwego pola</h3>
                  <p className="text-slate-200 text-sm mb-3">{requirements.safetySystemsDetailed.blindSpotMonitor || "System monitoruje martwe pole"}</p>
                  <div className="bg-orange-600/30 border border-orange-400/30 rounded-lg p-3">
                    <p className="text-xs text-orange-100">
                      <strong>💡 Światełko ratuje życie:</strong> Światełko w lusterku mówi „nie zjeżdżaj teraz, bo ktoś tam jest". 
                      Bardzo uspokaja początkujących kierowców.
                    </p>
                  </div>
                </div>

                <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Hamowanie awaryjne</h3>
                  <p className="text-slate-200 text-sm mb-3">{requirements.safetySystemsDetailed.collisionWarning || "System ostrzega przed kolizją"}</p>
                  <div className="bg-pink-600/30 border border-pink-400/30 rounded-lg p-3">
                    <p className="text-xs text-pink-100">
                      <strong>💡 Auto hamuje za Ciebie:</strong> Jeśli się zagapisz w korku, auto samo zahamuje. 
                      Może zapobiec kolizji lub zmniejszyć jej skutki.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Kontrola stabilności (ESP)</h3>
                  <p className="text-slate-200 text-sm mb-3">{requirements.safetySystemsDetailed.esp}</p>
                  <div className="bg-indigo-600/30 border border-indigo-400/30 rounded-lg p-3">
                    <p className="text-xs text-indigo-100">
                      <strong>💡 Zapobiega poślizgom:</strong> System koryguje tor jazdy, gdy auto zaczyna wpadać w poślizg. 
                      Szczególnie przydatne zimą i na mokrej drodze.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PRAKTYCZNOŚĆ LIFESTYLE'OWA */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-emerald-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Praktyczność dopasowana do Twojego życia</h2>
            </div>

            <div className="space-y-4">
              {/* ISOFIX dla rodzin */}
              {formData.childrenCount > 0 && requirements.interiorSeating && (
                <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-600/40 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👶</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">ISOFIX - dla rodziców</h3>
                      <p className="text-slate-200 text-sm mb-3">{requirements.interiorSeating.childSeatPoints}</p>
                      <div className="bg-emerald-600/30 border border-emerald-400/30 rounded-lg p-3">
                        <p className="text-xs text-emerald-100">
                          <strong>💡 Najprostszy montaż fotelika:</strong> ISOFIX to metalowe zaciski - klikniesz fotelik i gotowe. 
                          Bez szarpania pasów i zastanawiania się, czy dobrze zapiąłeś.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prześwit */}
              {requirements.minGroundClearance > 160 && (
                <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-600/40 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">Wysoki prześwit ({requirements.minGroundClearance}mm)</h3>
                      <p className="text-slate-200 text-sm mb-3">Łatwiejsze wsiadanie i brak strachu przed wysokimi krawężnikami</p>
                      <div className="bg-teal-600/30 border border-teal-400/30 rounded-lg p-3">
                        <p className="text-xs text-teal-100">
                          <strong>💡 Dla seniorów i aktywnych:</strong> Wyższe auto to łatwiejsze wsiadanie (bez kucania). 
                          Plus możesz wjechać na drogi gruntowe bez obawy o zdarcie podwozia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bagażnik w walizkach */}
              {requirements.bodyExterior && (
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/40 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🧳</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">Pojemność bagażnika: {requirements.bodyExterior.trunkSize}</h3>
                      <p className="text-slate-200 text-sm mb-3">
                        {requirements.minTrunkCapacity > 500 ? "Zmieścisz 4-5 dużych walizek i wózek dziecięcy" :
                         requirements.minTrunkCapacity > 400 ? "Zmieścisz 3 duże walizki i torby na zakupy" :
                         "Zmieścisz 2 walizki i torby na weekendowy wyjazd"}
                      </p>
                      <div className="bg-blue-600/30 border border-blue-400/30 rounded-lg p-3">
                        <p className="text-xs text-blue-100">
                          <strong>💡 W praktyce:</strong> Zamiast litrów, mówimy o walizkach - tak łatwiej wyobrazić sobie, ile się zmieści.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tapicerka dla właścicieli psów */}
              {requirements.interiorSeating && (
                <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-600/40 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🐕</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">Tapicerka łatwa w czyszczeniu</h3>
                      <p className="text-slate-200 text-sm mb-3">{requirements.interiorSeating.seatMaterial}</p>
                      <div className="bg-amber-600/30 border border-amber-400/30 rounded-lg p-3">
                        <p className="text-xs text-amber-100">
                          <strong>💡 Dla właścicieli psów/dzieci:</strong> Ekoskóra lub skóra to błogosławieństwo - 
                          wystarczy wilgotna ścierka. Rozlany sok czy błoto z łap psa? Bez problemu!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. KOSZTY I "ŚWIĘTY SPOKÓJ" */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-violet-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Koszty i „Święty spokój"</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Koszty serwisowe */}
              {requirements.recommendedMaintenance && (
                <div className="bg-violet-500/20 backdrop-blur-sm border border-violet-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Przewidywane koszty serwisowe</h3>
                  <div className="text-3xl font-black text-white mb-2">
                    {requirements.estimatedAnnualCosts.maintenance + requirements.estimatedAnnualCosts.repairs} zł/rok
                  </div>
                  <p className="text-slate-300 text-sm mb-4">
                    Ranking: {requirements.estimatedAnnualCosts.maintenance < 1500 ? "🟢 Niskie" : 
                              requirements.estimatedAnnualCosts.maintenance < 2500 ? "🟡 Średnie" : "🔴 Wysokie"}
                  </p>
                  <div className="bg-violet-600/30 border border-violet-400/30 rounded-lg p-3">
                    <p className="text-xs text-violet-100">
                      <strong>💡 Co to oznacza:</strong> To średni koszt przeglądu, oleju, filtrów i drobnych napraw. 
                      {requirements.estimatedAnnualCosts.maintenance < 1500 && " Twój wybór to ekonomiczne auto w utrzymaniu!"}
                    </p>
                  </div>
                </div>
              )}

              {/* Dostępność części */}
              {requirements.reliabilityInfo && (
                <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Dostępność części</h3>
                  <div className="text-2xl font-bold text-white mb-2">{requirements.reliabilityInfo.partsAvailability}</div>
                  <p className="text-slate-300 text-sm mb-4">Sieć serwisowa: {requirements.reliabilityInfo.serviceNetworkSize}</p>
                  <div className="bg-purple-600/30 border border-purple-400/30 rounded-lg p-3">
                    <p className="text-xs text-purple-100">
                      <strong>💡 Ważne pytanie:</strong> Czy naprawi to każdy mechanik, czy tylko wyspecjalizowany serwis? 
                      Popularne marki (Toyota, VW, Ford) mają serwisy wszędzie.
                    </p>
                  </div>
                </div>
              )}

              {/* Spalanie */}
              {requirements.emissionControl && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Spalanie paliwa</h3>
                  <div className="text-3xl font-black text-white mb-2">{requirements.emissionControl.fuelConsumption}</div>
                  <p className="text-slate-300 text-sm mb-4">
                    Koszt paliwa rocznie: ~{Math.round(requirements.estimatedAnnualCosts.fuel)} zł
                  </p>
                  <div className="bg-green-600/30 border border-green-400/30 rounded-lg p-3">
                    <p className="text-xs text-green-100">
                      <strong>💡 Czy to dużo?</strong> To średnie spalanie przy Twoim stylu jazdy ({requirements.usageProfile.drivingPattern}). 
                      Koszt wyliczony dla Twoich tras.
                    </p>
                  </div>
                </div>
              )}

              {/* Utrata wartości */}
              <div className="bg-rose-500/20 backdrop-blur-sm border border-rose-400/40 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Utrata wartości</h3>
                <p className="text-slate-200 text-sm mb-4">
                  {requirements.reliabilityInfo?.recommendedBrands.includes("Toyota") || requirements.reliabilityInfo?.recommendedBrands.includes("Honda") ?
                    "🟢 Toyota i Honda trzymają wartość najlepiej - po 3 latach stracisz ~30-35%." :
                    "🟡 Standardowa utrata wartości - po 3 latach auto będzie warte ~50-60% ceny zakupu."
                  }
                </p>
                <div className="bg-rose-600/30 border border-rose-400/30 rounded-lg p-3">
                  <p className="text-xs text-rose-100">
                    <strong>💡 Dlaczego to ważne:</strong> Czy auto będzie łatwo sprzedać za 3-4 lata? 
                    Popularne modele (Golf, Corolla, Octavia) sprzedają się najszybciej.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* PODZESPOŁY - WSZYSTKIE KOMPONENTY */}
        <Paywall>
        <div className="space-y-8">

          {/* SILNIK */}
          {requirements.engineComponents && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/40">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Silnik</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                    <div className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-3">Typ i pojemność</div>
                    <div className="text-3xl font-bold text-white mb-2">{requirements.engineComponents.type}</div>
                    <div className="text-slate-300">{requirements.engineComponents.displacement} • {requirements.engineComponents.power}</div>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                    <div className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-3">Moment obrotowy</div>
                    <div className="text-3xl font-bold text-white mb-2">{requirements.engineComponents.torque}</div>
                    <div className="text-slate-300">Maksymalny moment</div>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                    <div className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-3">Turbosprężarka</div>
                    <div className="text-white font-semibold">{requirements.engineComponents.turbo}</div>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl p-6">
                    <div className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-3">Zasilanie paliwa</div>
                    <div className="text-white font-semibold">{requirements.engineComponents.fuelInjection}</div>
                  </div>
                </div>
                <div className="mt-6 bg-blue-600/30 border border-blue-400/30 rounded-2xl p-6">
                  <p className="text-slate-200">{requirements.engineComponents.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* UKŁAD NAPĘDOWY */}
          {requirements.transmissionSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/40">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Układ Napędowy</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6">
                    <div className="text-amber-300 text-sm font-bold uppercase tracking-wider mb-3">Skrzynia biegów</div>
                    <div className="text-2xl font-bold text-white mb-2">{requirements.transmissionSystem.type}</div>
                    <div className="text-slate-300">{requirements.transmissionSystem.gears}</div>
                  </div>
                  <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6">
                    <div className="text-amber-300 text-sm font-bold uppercase tracking-wider mb-3">Napęd</div>
                    <div className="text-2xl font-bold text-white">{requirements.transmissionSystem.driveType}</div>
                  </div>
                  {requirements.transmissionSystem.transferBox && (
                    <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6">
                      <div className="text-amber-300 text-sm font-bold uppercase tracking-wider mb-3">Reduktor</div>
                      <div className="text-white">{requirements.transmissionSystem.transferBox}</div>
                    </div>
                  )}
                </div>
                <div className="mt-6 bg-amber-600/30 border border-amber-400/30 rounded-2xl p-6">
                  <p className="text-slate-200">{requirements.transmissionSystem.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* ZAWIESZENIE */}
          {requirements.suspensionSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-teal-500/30 hover:border-teal-400/60 transition-all duration-300 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg shadow-teal-500/40">
                    <Wind className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Zawieszenie</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/40 rounded-2xl p-6">
                    <div className="text-teal-300 text-sm font-bold uppercase tracking-wider mb-3">Przód</div>
                    <div className="text-white font-semibold">{requirements.suspensionSystem.frontType}</div>
                  </div>
                  <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/40 rounded-2xl p-6">
                    <div className="text-teal-300 text-sm font-bold uppercase tracking-wider mb-3">Tył</div>
                    <div className="text-white font-semibold">{requirements.suspensionSystem.rearType}</div>
                  </div>
                  <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/40 rounded-2xl p-6">
                    <div className="text-teal-300 text-sm font-bold uppercase tracking-wider mb-3">Sprężyny</div>
                    <div className="text-white">{requirements.suspensionSystem.springType}</div>
                  </div>
                  <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/40 rounded-2xl p-6">
                    <div className="text-teal-300 text-sm font-bold uppercase tracking-wider mb-3">Prześwit</div>
                    <div className="text-2xl font-bold text-white">{requirements.suspensionSystem.rideHeight}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HAMULCE */}
          {requirements.brakingSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-rose-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg shadow-red-500/40">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Hamulce</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Hamulce przednie</div>
                    <div className="text-white font-semibold">{requirements.brakingSystem.frontBrakes}</div>
                  </div>
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Hamulce tylne</div>
                    <div className="text-white font-semibold">{requirements.brakingSystem.rearBrakes}</div>
                  </div>
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Wzmacniacz</div>
                    <div className="text-white">{requirements.brakingSystem.servoType}</div>
                  </div>
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Systemy ABS/ESP</div>
                    <div className="space-y-1">
                      <div className="text-white">✓ {requirements.brakingSystem.abs}</div>
                      <div className="text-white">✓ {requirements.brakingSystem.esp}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-red-600/30 border border-red-400/30 rounded-2xl p-6">
                  <p className="text-slate-200">{requirements.brakingSystem.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* KIEROWNICA */}
          {requirements.steeringSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/40">
                    <Gauge className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Kierownica</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6">
                    <div className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-3">Typ</div>
                    <div className="text-white font-semibold">{requirements.steeringSystem.type}</div>
                  </div>
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6">
                    <div className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-3">Wspomaganie</div>
                    <div className="text-white font-semibold">{requirements.steeringSystem.assistType}</div>
                  </div>
                </div>
                <div className="mt-6 bg-purple-600/30 border border-purple-400/30 rounded-2xl p-6">
                  <p className="text-slate-200">{requirements.steeringSystem.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* KOŁA I OPONY */}
          {requirements.wheelTireSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-amber-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/40">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Koła i Opony</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                    <div className="text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">Rozmiar kół</div>
                    <div className="text-3xl font-bold text-white">{requirements.wheelTireSystem.wheelSize}</div>
                    <div className="text-slate-300 mt-2">{requirements.wheelTireSystem.wheelType}</div>
                  </div>
                  <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                    <div className="text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">Rozmiar opon</div>
                    <div className="text-2xl font-bold text-white">{requirements.wheelTireSystem.tireWidth}/{requirements.wheelTireSystem.aspectRatio}</div>
                    <div className="text-slate-300">R{requirements.wheelTireSystem.wheelSize}</div>
                  </div>
                  <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                    <div className="text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">Typ opon</div>
                    <div className="text-white font-semibold">{requirements.wheelTireSystem.tireType}</div>
                  </div>
                  <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-2xl p-6">
                    <div className="text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">Marka</div>
                    <div className="text-white font-semibold">{requirements.wheelTireSystem.recommendedBrand}</div>
                  </div>
                </div>
                <div className="mt-6 bg-orange-600/30 border border-orange-400/30 rounded-2xl p-6">
                  <p className="text-slate-200">Opony zimowe: {requirements.wheelTireSystem.winterTires}</p>
                </div>
              </div>
            </div>
          )}

          {/* WYMIARY I NADWOZIE */}
          {requirements.bodyExterior && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-500/40">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Wymiary i Nadwozie</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Długość</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.length}</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Szerokość</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.width}</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Wysokość</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.height}</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Rozstaw osi</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.wheelbase}</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Drzwi</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.doors}</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 rounded-2xl p-6">
                    <div className="text-green-300 text-sm font-bold uppercase tracking-wider mb-3">Bagażnik</div>
                    <div className="text-2xl font-bold text-white">{requirements.bodyExterior.trunkSize}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOTELE */}
          {requirements.interiorSeating && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-amber-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg shadow-yellow-500/40">
                    <Home className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Fotele i Wnętrze</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-2xl p-6">
                    <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider mb-3">Liczba siedzeń</div>
                    <div className="text-white font-semibold">{requirements.interiorSeating.seats}</div>
                  </div>
                  <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-2xl p-6">
                    <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider mb-3">Fotele przednie</div>
                    <div className="text-white font-semibold">{requirements.interiorSeating.frontSeats}</div>
                  </div>
                  <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-2xl p-6">
                    <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider mb-3">ISOFIX</div>
                    <div className="text-white font-semibold">{requirements.interiorSeating.childSeatPoints}</div>
                  </div>
                  <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-2xl p-6">
                    <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider mb-3">Grzanie siedzeń</div>
                    <div className="text-white">{requirements.interiorSeating.heatingCooling}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KOMFORT WNĘTRZA */}
          {requirements.interiorComfort && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/40">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Komfort i Technologia</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-2xl p-6">
                    <div className="text-cyan-300 text-sm font-bold uppercase tracking-wider mb-3">Klimatyzacja</div>
                    <div className="text-white font-semibold">{requirements.interiorComfort.airConditioning}</div>
                  </div>
                  <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-2xl p-6">
                    <div className="text-cyan-300 text-sm font-bold uppercase tracking-wider mb-3">Parkowanie</div>
                    <div className="text-white font-semibold">{requirements.interiorComfort.parkingSensors}</div>
                  </div>
                  <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-2xl p-6">
                    <div className="text-cyan-300 text-sm font-bold uppercase tracking-wider mb-3">Infotainment</div>
                    <div className="text-white font-semibold">{requirements.interiorComfort.infotainment}</div>
                  </div>
                  <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-2xl p-6">
                    <div className="text-cyan-300 text-sm font-bold uppercase tracking-wider mb-3">System audio</div>
                    <div className="text-white font-semibold">{requirements.interiorComfort.soundSystem}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BEZPIECZEŃSTWO */}
          {requirements.safetySystemsDetailed && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-rose-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/40">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Systemy Bezpieczeństwa</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-400/40 rounded-2xl p-6">
                    <div className="text-pink-300 text-sm font-bold uppercase tracking-wider mb-3">Poduszki powietrzne</div>
                    <div className="text-white font-semibold">{requirements.safetySystemsDetailed.airbags}</div>
                    <div className="text-slate-300 text-sm mt-2">Przednie, boczne, kurtyny</div>
                  </div>
                  <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-400/40 rounded-2xl p-6">
                    <div className="text-pink-300 text-sm font-bold uppercase tracking-wider mb-3">Stabilizacja</div>
                    <div className="space-y-1">
                      <div className="text-white">✓ {requirements.safetySystemsDetailed.esp}</div>
                      <div className="text-white">✓ {requirements.safetySystemsDetailed.asr}</div>
                    </div>
                  </div>
                  <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-400/40 rounded-2xl p-6 md:col-span-2">
                    <div className="text-pink-300 text-sm font-bold uppercase tracking-wider mb-3">Systemy pomocnicze</div>
                    <div className="text-slate-200">{requirements.safetySystemsDetailed.description}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OŚWIETLENIE */}
          {requirements.lightingSystem && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/40">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Oświetlenie</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/40 rounded-2xl p-6">
                    <div className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-3">Przednie</div>
                    <div className="text-white font-semibold">{requirements.lightingSystem.headlights}</div>
                  </div>
                  <div className="bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/40 rounded-2xl p-6">
                    <div className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-3">Tylne</div>
                    <div className="text-white font-semibold">{requirements.lightingSystem.rearLights}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMISJA I EKOLOGIA */}
          {requirements.emissionControl && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-lime-500/30 hover:border-lime-400/60 transition-all duration-300 shadow-2xl shadow-lime-500/20 hover:shadow-lime-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-600/5 to-green-600/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl shadow-lg shadow-lime-500/40">
                    <Droplets className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Emisja i Ekologia</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-lime-500/20 backdrop-blur-sm border border-lime-400/40 rounded-2xl p-6">
                    <div className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-3">Norma EU</div>
                    <div className="text-2xl font-bold text-white">{requirements.emissionControl.euStandard}</div>
                  </div>
                  <div className="bg-lime-500/20 backdrop-blur-sm border border-lime-400/40 rounded-2xl p-6">
                    <div className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-3">Emisja CO₂</div>
                    <div className="text-2xl font-bold text-white">{requirements.emissionControl.co2Emissions}</div>
                  </div>
                  <div className="bg-lime-500/20 backdrop-blur-sm border border-lime-400/40 rounded-2xl p-6 md:col-span-2">
                    <div className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-3">Układ wydechowy</div>
                    <div className="text-slate-200">{requirements.emissionControl.exhaustSystem}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KONSERWACJA */}
          {requirements.recommendedMaintenance && (
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-600/30 hover:border-red-500/60 transition-all duration-300 shadow-2xl shadow-red-600/20 hover:shadow-red-600/40">
              <div className="absolute inset-0 bg-gradient-to-br from-red-700/5 to-rose-700/5 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl shadow-lg shadow-red-600/40">
                    <Wrench className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Konserwacja Pojazdu</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Wymiana oleju</div>
                    <div className="text-white font-semibold">{requirements.recommendedMaintenance.oilChanges}</div>
                  </div>
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Filtry</div>
                    <div className="text-white font-semibold">{requirements.recommendedMaintenance.filterChanges}</div>
                  </div>
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Opony</div>
                    <div className="text-white font-semibold">{requirements.recommendedMaintenance.tireRotation}</div>
                  </div>
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Hamulce</div>
                    <div className="text-white font-semibold">{requirements.recommendedMaintenance.brakePadReplacement}</div>
                  </div>
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6 md:col-span-2">
                    <div className="text-red-300 text-sm font-bold uppercase tracking-wider mb-3">Koszt roczny</div>
                    <div className="text-slate-200">{requirements.recommendedMaintenance.description}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </Paywall>

        {/* NOWA ANALIZA BUTTON */}
        <div className="text-center mt-16 md:mt-20">
          <button
            onClick={onRestart}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            Nowa analiza ➡
          </button>
        </div>
      </div>
    </div>
  );
}
