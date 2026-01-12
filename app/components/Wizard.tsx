'use client';

import { FormData } from '../types';

interface WizardProps {
  formData: FormData;
  currentStep: number;
  onUpdate: (field: keyof FormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const totalSteps = 32;

export default function Wizard({ formData, currentStep, onUpdate, onNext, onBack, onComplete }: WizardProps) {
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: return formData.monthlyIncome > 0;
      case 2: return formData.dailyCommute !== null;
      case 3: return formData.commuteType !== null;
      case 4: return formData.dailyCommuteCongestion !== null;
      case 5: return formData.dailyKmDriven >= 0;
      case 6: return formData.accelerationImportance !== null;
      case 7: return formData.parkingAtHome !== null;
      case 8: return formData.parkingAtWork !== null;
      case 9: return formData.householdSize >= 1;
      case 10: return true; // childrenCount can be 0
      case 11: return true; // elderlyPassengers is boolean
      case 12: return formData.weeklyGroceries !== null;
      case 13: return formData.sportsEquipment !== null;
      case 14: return formData.petTransport !== null;
      case 15: return true; // strollerType can be null if no kids
      case 16: return true; // longTripsPerYear can be 0
      case 17: return formData.vacationStyle !== null;
      case 18: return formData.trunkFrequency !== null;
      case 19: return formData.winterConditions !== null;
      case 20: return formData.roadType !== null;
      case 21: return formData.hilliness !== null;
      case 22: return formData.weekendActivities !== null;
      case 23: return formData.trailerNeeded !== null;
      case 24: return formData.mainConcern !== null;
      case 25: return formData.mechanicalSkills !== null;
      case 26: return formData.plannedOwnership !== null;
      case 27: return formData.maxMonthlyPayment !== null || formData.monthlyIncome > 0;
      case 28: return formData.childSeats >= 0;
      case 29: return formData.fuelTypePreference !== null;
      case 30: return formData.bodyStylePreference !== null;
      case 31: return formData.engineSizePreference !== null;
      case 32: return formData.olxRegion !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pytanie {currentStep} z {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b85450] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          
          {/* Step 1: Monthly Income */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile zarabiasz miesięcznie?
              </h2>
              <p className="text-gray-600 mb-8">Podaj swoje dochody netto (na rękę)</p>
              <div className="space-y-4">
                <input
                  type="number"
                  value={formData.monthlyIncome || ''}
                  onChange={(e) => onUpdate('monthlyIncome', parseFloat(e.target.value) || 0)}
                  placeholder="np. 5000"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
                />
                <p className="text-sm text-gray-500">
                  To pomoże oszacować realistyczny budżet na auto i koszty miesięczne
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Daily Commute */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak daleko dojeżdżasz do pracy?
              </h2>
              <p className="text-gray-600 mb-8">Jeden kierunek</p>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie dojeżdżam / praca zdalna', desc: '0 km' },
                  { value: 'short', label: 'Blisko', desc: '< 10 km' },
                  { value: 'medium', label: 'Średnio daleko', desc: '10-40 km' },
                  { value: 'long', label: 'Daleko', desc: '> 40 km' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('dailyCommute', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.dailyCommute === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Commute Type */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czym głównie jeździsz do pracy?
              </h2>
              <p className="text-gray-600 mb-8">Dominujący typ drogi</p>
              <div className="space-y-3">
                {[
                  { value: 'city', label: 'Miasto', desc: 'Ulice, korki, częste zatrzymywania' },
                  { value: 'mixed', label: 'Mieszane', desc: 'Część miasto, część trasa' },
                  { value: 'highway', label: 'Autostrada/Trasa', desc: 'Głównie szybka jazda' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('commuteType', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.commuteType === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Daily Commute Congestion */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jaki jest poziom ruchu w Twoim dojeździe?
              </h2>
              <p className="text-gray-600 mb-8">Od tego zależy zużycie paliwa i komfort</p>
              <div className="space-y-3">
                {[
                  { value: 'light', label: 'Lekki ruch', desc: 'Płynna jazda, rzadko korki' },
                  { value: 'moderate', label: 'Umiarkowany', desc: 'Czasem korki, czasem płynnie' },
                  { value: 'heavy', label: 'Ciężki ruch', desc: 'Niemal zawsze korki, zatory' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('dailyCommuteCongestion', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.dailyCommuteCongestion === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Daily KM Driven */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile kilometrów dziennie jeździsz?
              </h2>
              <p className="text-gray-600 mb-8">Razem wszystkie trasy (praca, zakupy, sport)</p>
              <div className="space-y-4">
                <input
                  type="number"
                  min="0"
                  value={formData.dailyKmDriven || ''}
                  onChange={(e) => onUpdate('dailyKmDriven', parseInt(e.target.value) || 0)}
                  placeholder="np. 50"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
                />
                <p className="text-sm text-gray-500">
                  To wpłynie na wybór typu paliwa (dzienne km × 250 dni roboczych = roczny przebieg)
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Acceleration Importance */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak ważne jest szybkie przyspieszanie?
              </h2>
              <p className="text-gray-600 mb-8">Czy lubisz dynamiczną jazdę czy wolisz oszczędną?</p>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Mało ważne', desc: 'Oszczędność paliwa na pierwszym miejscu' },
                  { value: 'medium', label: 'Średnio ważne', desc: 'Balans między osiągami a ekonomią' },
                  { value: 'high', label: 'Bardzo ważne', desc: 'Chcę dynamiczne przyspieszanie' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('accelerationImportance', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.accelerationImportance === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Parking at Home */}
          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Gdzie parkujesz w domu?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'garage', label: 'Garaż', desc: 'Zamknięty garaż' },
                  { value: 'driveway', label: 'Podjazd/Parking strzeżony', desc: 'Własne miejsce' },
                  { value: 'street', label: 'Ulica', desc: 'Parkowanie na ulicy' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('parkingAtHome', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.parkingAtHome === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Parking at Work */}
          {currentStep === 8 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Gdzie parkujesz w pracy?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie dotyczy', desc: 'Nie dojeżdżam do pracy' },
                  { value: 'parking', label: 'Parking firmowy', desc: 'Duże miejsce' },
                  { value: 'street', label: 'Ulica', desc: 'Trzeba szukać miejsca' },
                  { value: 'tight', label: 'Ciasne miejsce', desc: 'Małe miejsca parkingowe' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('parkingAtWork', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.parkingAtWork === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: Household Size */}
          {currentStep === 9 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile osób mieszka w Twoim domu?
              </h2>
              <p className="text-gray-600 mb-8">Uwzględnij siebie, partnera, dzieci, rodziców</p>
              <input
                type="number"
                min="1"
                value={formData.householdSize || 1}
                onChange={(e) => onUpdate('householdSize', parseInt(e.target.value) || 1)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
              />
            </div>
          )}

          {/* Step 10: Children Count */}
          {currentStep === 10 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile masz dzieci?
              </h2>
              <p className="text-gray-600 mb-8">Dzieci poniżej 18 lat</p>
              <input
                type="number"
                min="0"
                value={formData.childrenCount || 0}
                onChange={(e) => onUpdate('childrenCount', parseInt(e.target.value) || 0)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
              />
            </div>
          )}

          {/* Step 11: Elderly Passengers */}
          {currentStep === 11 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy regularnie wozisz osoby starsze?
              </h2>
              <p className="text-gray-600 mb-8">Rodzice, dziadkowie - którym trudniej wsiadać/wysiadać</p>
              <div className="space-y-3">
                {[
                  { value: true, label: 'Tak', desc: 'Ważna łatwość wsiadania' },
                  { value: false, label: 'Nie', desc: '' }
                ].map(opt => (
                  <button
                    key={opt.value.toString()}
                    onClick={() => onUpdate('elderlyPassengers', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.elderlyPassengers === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-gray-500">{opt.desc}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 12: Weekly Groceries */}
          {currentStep === 12 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak duże robisz zakupy tygodniowe?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'small', label: 'Małe', desc: '2-3 torby / mały wózek' },
                  { value: 'medium', label: 'Średnie', desc: '5-7 toreb / pełny wózek' },
                  { value: 'large', label: 'Duże', desc: '10+ toreb / zakupy dla rodziny na tydzień' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('weeklyGroceries', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.weeklyGroceries === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 13: Sports Equipment */}
          {currentStep === 13 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy przewozisz sprzęt sportowy?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie', desc: 'Nie uprawiam sportów wymagających sprzętu' },
                  { value: 'small', label: 'Drobny sprzęt', desc: 'Narty, snowboard, kije golfowe' },
                  { value: 'large', label: 'Duży sprzęt', desc: 'Rowery, kajaki, deski surfingowe' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('sportsEquipment', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.sportsEquipment === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 14: Pet Transport */}
          {currentStep === 14 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy przewozisz zwierzęta?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie mam zwierząt', desc: '' },
                  { value: 'small', label: 'Małe zwierzę', desc: 'Kot, mały pies (klatka/transporter)' },
                  { value: 'large', label: 'Duży pies', desc: 'Wymaga dużo miejsca w bagażniku' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('petTransport', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.petTransport === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-gray-500">{opt.desc}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 15: Stroller Type */}
          {currentStep === 15 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy używasz wózka dziecięcego?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie używam', desc: 'Brak dzieci lub starsze dzieci' },
                  { value: 'compact', label: 'Kompaktowy wózek', desc: 'Spacerówka - składa się łatwo' },
                  { value: 'large', label: 'Duży wózek', desc: 'Gondola, wózek głęboki' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('strollerType', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.strollerType === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 16: Long Trips */}
          {currentStep === 16 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile razy rocznie jeździsz na dłuższe trasy?
              </h2>
              <p className="text-gray-600 mb-8">Trasy powyżej 200 km (wakacje, rodzina, wyjazdy)</p>
              <input
                type="number"
                min="0"
                value={formData.longTripsPerYear || 0}
                onChange={(e) => onUpdate('longTripsPerYear', parseInt(e.target.value) || 0)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
                placeholder="np. 10"
              />
            </div>
          )}

          {/* Step 17: Vacation Style */}
          {currentStep === 17 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jaki masz styl wakacji?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie jeżdżę na wakacje', desc: '' },
                  { value: 'light', label: 'Lekkie pakowanie', desc: 'Hotel/apartament - minimum bagażu' },
                  { value: 'family', label: 'Wyjazd rodzinny', desc: 'Walizki dla wszystkich' },
                  { value: 'camping', label: 'Camping/outdoor', desc: 'Namiot, śpiwory, sprzęt turystyczny' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('vacationStyle', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.vacationStyle === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-gray-500">{opt.desc}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 18: Trunk Frequency */}
          {currentStep === 18 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak często używasz bagażnika do maximum?
              </h2>
              <p className="text-gray-600 mb-8">Czy potrzebujesz dużej pojemności regularnie?</p>
              <div className="space-y-3">
                {[
                  { value: 'rare', label: 'Rzadko', desc: 'Kilka razy w roku' },
                  { value: 'occasional', label: 'Czasem', desc: 'Raz na miesiąc lub dwa' },
                  { value: 'often', label: 'Często', desc: 'Niemal co tydzień' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('trunkFrequency', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.trunkFrequency === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 19: Winter Conditions */}
          {currentStep === 19 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak wyglądają warunki zimowe tam gdzie mieszkasz?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Łagodne zimy', desc: 'Rzadko pada śnieg' },
                  { value: 'mild', label: 'Normalne zimy', desc: 'Czasem śnieg, odśnieżane drogi' },
                  { value: 'regular', label: 'Śnieżne zimy', desc: 'Regularnie śnieg i lód' },
                  { value: 'extreme', label: 'Ekstremalne zimy', desc: 'Góry, duże opady, drogi nieodśnieżane' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('winterConditions', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.winterConditions === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 20: Road Type */}
          {currentStep === 20 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jakimi drogami jeździsz?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'paved', label: 'Tylko asfalt', desc: 'Miasto i drogi asfaltowe' },
                  { value: 'occasional-dirt', label: 'Czasem szutry', desc: 'Okazjonalnie drogi gruntowe' },
                  { value: 'regular-dirt', label: 'Regularnie szutry', desc: 'Często drogi gruntowe, pola, las' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('roadType', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.roadType === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 21: Hilliness */}
          {currentStep === 21 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jaki jest teren w okolicy?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'flat', label: 'Płaski', desc: 'Równiny, brak wzniesień' },
                  { value: 'moderate', label: 'Pagórkowaty', desc: 'Delikatne wzniesienia' },
                  { value: 'mountainous', label: 'Górzysty', desc: 'Strome podjazdy, góry' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('hilliness', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.hilliness === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 22: Weekend Activities */}
          {currentStep === 22 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Co robisz w weekendy?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'home', label: 'Głównie w domu', desc: 'Netflix, dom, okolica' },
                  { value: 'city', label: 'Miasto', desc: 'Restauracje, kino, zakupy' },
                  { value: 'nature', label: 'Na łonie natury', desc: 'Las, jeziora, góry' },
                  { value: 'active', label: 'Aktywnie', desc: 'Sport, wycieczki, przygody' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('weekendActivities', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.weekendActivities === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 23: Trailer Needed */}
          {currentStep === 23 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy potrzebujesz holować przyczepę?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'never', label: 'Nie', desc: 'Nie planuję holowania' },
                  { value: 'occasionally', label: 'Czasem', desc: 'Mała przyczepa bagażowa (do 750 kg)' },
                  { value: 'regularly', label: 'Regularnie', desc: 'Przyczepa kempingowa/łódź (1500+ kg)' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('trailerNeeded', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.trailerNeeded === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 24: Main Concern */}
          {currentStep === 24 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Co jest dla Ciebie najważniejsze?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'economy', label: 'Oszczędność', desc: 'Niskie koszty eksploatacji' },
                  { value: 'reliability', label: 'Niezawodność', desc: 'Mało usterek, wysokie oceny' },
                  { value: 'comfort', label: 'Komfort', desc: 'Wygoda jazdy i wyposażenie' },
                  { value: 'space', label: 'Przestronność', desc: 'Dużo miejsca dla rodziny' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('mainConcern', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.mainConcern === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 25: Mechanical Skills */}
          {currentStep === 25 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy masz umiejętności mechaniczne?
              </h2>
              <p className="text-gray-600 mb-8">Czy potrafisz sam naprawiać drobne usterki?</p>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Nie, wszystko warsztat', desc: 'Potrzebuję auta niezawodnego' },
                  { value: 'basic', label: 'Podstawowe', desc: 'Wymiana oleju, filtrów' },
                  { value: 'advanced', label: 'Zaawansowane', desc: 'Potrafię naprawiać większość rzeczy' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('mechanicalSkills', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.mechanicalSkills === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 26: Planned Ownership */}
          {currentStep === 26 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Jak długo planujesz używać tego auta?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'short', label: '1-3 lata', desc: 'Krótkoterminowo' },
                  { value: 'medium', label: '3-7 lat', desc: 'Średnioterminowo' },
                  { value: 'long', label: 'Powyżej 7 lat', desc: 'Na długo' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('plannedOwnership', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.plannedOwnership === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 27: Monthly Payment */}
          {currentStep === 27 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile maksymalnie możesz płacić miesięcznie?
              </h2>
              <p className="text-gray-600 mb-8">Tylko rata kredytu/leasingu (jeśli planujesz finansowanie)</p>
              <input
                type="number"
                value={formData.maxMonthlyPayment || ''}
                onChange={(e) => onUpdate('maxMonthlyPayment', parseInt(e.target.value) || null)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
                placeholder="np. 1500 (zostaw puste jeśli kupujesz za gotówkę)"
              />
              <p className="text-sm text-gray-500 mt-4">
                Możesz pominąć jeśli planujesz zakup za gotówkę - użyjemy Twojego miesięcznego dochodu
              </p>
            </div>
          )}

          {/* Step 28: Child Seats */}
          {currentStep === 28 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Ile fotelików dziecięcych potrzebujesz?
              </h2>
              <p className="text-gray-600 mb-8">Ważne dla mocowań ISOFIX</p>
              <input
                type="number"
                min="0"
                max="3"
                value={formData.childSeats || 0}
                onChange={(e) => onUpdate('childSeats', parseInt(e.target.value) || 0)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b85450] focus:outline-none text-lg"
              />
              <p className="text-sm text-gray-500 mt-4">
                Większość aut ma 2 mocowania ISOFIX w tylnej kanapie
              </p>
            </div>
          )}

          {/* Step 29: Fuel Type Preference */}
          {currentStep === 29 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy masz preferencję co do paliwa?
              </h2>
              <p className="text-gray-600 mb-8">Wybierz czy chcesz otwartą rekomendację czy konkretne paliwo</p>
              <div className="space-y-3">
                {[
                  { value: 'open', label: '🤖 Niech algorytm zdecyduje', desc: 'Rekomendacja na podstawie Twoich nawyków' },
                  { value: 'specified', label: '🎯 Mam preferencję', desc: 'Chcę wybrać konkretne paliwo' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('fuelTypePreference', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.fuelTypePreference === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 30: Body Style Preference */}
          {currentStep === 30 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy masz preferencję co do typu nadwozia?
              </h2>
              <p className="text-gray-600 mb-8">Wybierz czy chcesz otwartą rekomendację czy konkretny typ</p>
              <div className="space-y-3">
                {[
                  { value: 'open', label: '🤖 Niech algorytm zdecyduje', desc: 'Rekomendacja na podstawie Twoich potrzeb' },
                  { value: 'specified', label: '🎯 Mam preferencję', desc: 'Chcę wybrać konkretny typ nadwozia' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('bodyStylePreference', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.bodyStylePreference === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 31: Engine Size Preference */}
          {currentStep === 31 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Czy masz preferencję co do pojemności silnika?
              </h2>
              <p className="text-gray-600 mb-8">Algorytm obliczy optymalną pojemność - czy chcesz jej słuchać?</p>
              <div className="space-y-3">
                {[
                  { value: 'open', label: '🤖 Zaufam algorytmowi', desc: 'Rekomendacja na podstawie Twoich nawyków' },
                  { value: 'specified', label: '🎯 Mam preferencję', desc: 'Chcę konkretną pojemność (np. mały silnik)' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate('engineSizePreference', opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.engineSizePreference === opt.value
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 32: OLX Region */}
          {currentStep === 32 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                W jakim regionie szukać ofert na OLX?
              </h2>
              <p className="text-gray-600 mb-8">Wybierz województwem gdzie będziemy szukać ogłoszeń</p>
              <div className="space-y-3">
                {[
                  'Dolnośląskie', 'Kujawsko-Pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie',
                  'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie',
                  'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-Mazurskie', 'Wielkopolskie',
                  'Zachodniopomorskie'
                ].map(region => (
                  <button
                    key={region}
                    onClick={() => onUpdate('olxRegion', region)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.olxRegion === region
                        ? 'border-[#b85450] bg-[#faf5f5]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{region}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <button
              onClick={onBack}
              className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-full hover:border-gray-300 transition-colors font-light"
            >
              Wstecz
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex-1 px-8 py-3 rounded-full font-light transition-all ${
              isCurrentStepValid()
                ? 'bg-[#b85450] text-white hover:bg-[#a04946]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Zobacz wyniki' : 'Dalej'}
          </button>
        </div>
      </div>
    </div>
  );
}
