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

export default function Wizard({ formData, currentStep, onUpdate, onNext, onBack, onComplete }: WizardProps) {
  const totalSteps = 20;
  const progress = (currentStep / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.budget > 0;
      case 2: return formData.riskTolerance !== null;
      case 3: return formData.driveLocation !== null;
      case 4: return formData.passengers !== null;
      case 5: return formData.priority !== null;
      case 6: return formData.carAttitude !== null;
      case 7: return formData.annualMileage !== null;
      case 8: return formData.parkingType !== null;
      case 9: return formData.mechanicalSkills !== null;
      case 10: return formData.terrainType !== null;
      case 11: return formData.carAge !== null;
      case 12: return formData.brandPreference !== null;
      case 13: return formData.trunkNeeds !== null;
      case 14: return formData.transmission !== null;
      case 15: return formData.towing !== null;
      case 16: return formData.winterConditions !== null;
      case 17: return formData.fuelType !== null;
      case 18: return formData.acceleration !== null;
      case 19: return formData.heightClearance !== null;
      case 20: return formData.plannedOwnership !== null;
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
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-50">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Krok {currentStep} z {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b85450] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaki jest Twój maksymalny budżet na zakup?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Pamiętaj, by zostawić 10-15% na serwis i przegląd po zakupie
              </p>
              <div>
                <input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => onUpdate('budget', parseInt(e.target.value) || 0)}
                  placeholder="Np. 40000"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-xl 
                           focus:border-[#b85450] focus:outline-none transition-colors"
                />
                <p className="text-sm text-gray-400 mt-2">Podaj kwotę w PLN</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jak reagujesz na niespodziewane wydatki serwisowe?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('riskTolerance', 'high')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.riskTolerance === 'high'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Akceptuję ryzyko</p>
                  <p className="text-sm text-gray-600">
                    W zamian za lepszą klasę lub wyposażenie
                  </p>
                </button>
                <button
                  onClick={() => onUpdate('riskTolerance', 'medium')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.riskTolerance === 'medium'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Wolę coś prostszego</p>
                  <p className="text-sm text-gray-600">
                    Tanie i przewidywalne w naprawie
                  </p>
                </button>
                <button
                  onClick={() => onUpdate('riskTolerance', 'low')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.riskTolerance === 'low'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Budżet jest sztywny</p>
                  <p className="text-sm text-gray-600">
                    Awaria to dla mnie poważny problem
                  </p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Gdzie będziesz głównie jeździć?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('driveLocation', 'city')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.driveLocation === 'city'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Tylko miasto</p>
                  <p className="text-sm text-gray-600">Krótkie odcinki, korki, parkowanie</p>
                </button>
                <button
                  onClick={() => onUpdate('driveLocation', 'mixed')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.driveLocation === 'mixed'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Mieszane</p>
                  <p className="text-sm text-gray-600">Miasto + dłuższe trasy</p>
                </button>
                <button
                  onClick={() => onUpdate('driveLocation', 'highway')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.driveLocation === 'highway'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Głównie długie trasy</p>
                  <p className="text-sm text-gray-600">Autostrady, pokonywanie dużych dystansów</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Ile osób podróżuje na co dzień?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('passengers', 'solo')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.passengers === 'solo'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">1-2 osoby</p>
                  <p className="text-sm text-gray-600">Ja lub czasem z jednym pasażerem</p>
                </button>
                <button
                  onClick={() => onUpdate('passengers', 'small-family')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.passengers === 'small-family'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Rodzina 2+1 lub 2+2</p>
                  <p className="text-sm text-gray-600">Potrzebny bagażnik na wózek, zakupy</p>
                </button>
                <button
                  onClick={() => onUpdate('passengers', 'large-family')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.passengers === 'large-family'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Duża rodzina</p>
                  <p className="text-sm text-gray-600">Częsty przewóz dużych gabarytów, więcej osób</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Co jest dla Ciebie absolutnie najważniejsze?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('priority', 'economy')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.priority === 'economy'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Niskie koszty</p>
                  <p className="text-sm text-gray-600">Utrzymanie i spalanie to priorytet</p>
                </button>
                <button
                  onClick={() => onUpdate('priority', 'comfort')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.priority === 'comfort'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Komfort</p>
                  <p className="text-sm text-gray-600">Cisza i wygoda w trasie</p>
                </button>
                <button
                  onClick={() => onUpdate('priority', 'safety')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.priority === 'safety'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Bezpieczeństwo</p>
                  <p className="text-sm text-gray-600">Solidność i ochrona</p>
                </button>
                <button
                  onClick={() => onUpdate('priority', 'emotions')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.priority === 'emotions'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Emocje</p>
                  <p className="text-sm text-gray-600">Wygląd i radość z jazdy</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaki jest Twój stosunek do motoryzacji?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('carAttitude', 'tool')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.carAttitude === 'tool'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Auto to narzędzie</p>
                  <p className="text-sm text-gray-600">Jak AGD – ma działać i tyle</p>
                </button>
                <button
                  onClick={() => onUpdate('carAttitude', 'passion')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.carAttitude === 'passion'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Lubię dbać o samochód</p>
                  <p className="text-sm text-gray-600">To dla mnie coś więcej</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Ile kilometrów przejedziesz rocznie?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('annualMileage', 'low')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.annualMileage === 'low'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Poniżej 15 000 km/rok</p>
                  <p className="text-sm text-gray-600">Głównie weekendy i krótkie trasy</p>
                </button>
                <button
                  onClick={() => onUpdate('annualMileage', 'medium')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.annualMileage === 'medium'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">15 000 - 25 000 km/rok</p>
                  <p className="text-sm text-gray-600">Codzienny dojazd do pracy, typowe użytkowanie</p>
                </button>
                <button
                  onClick={() => onUpdate('annualMileage', 'high')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.annualMileage === 'high'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Powyżej 25 000 km/rok</p>
                  <p className="text-sm text-gray-600">Długie trasy, służbowe podróże</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Gdzie parkujesz auto na co dzień?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('parkingType', 'garage')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.parkingType === 'garage'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Garaż lub zadaszenie</p>
                  <p className="text-sm text-gray-600">Auto jest chronione przed pogodą</p>
                </button>
                <button
                  onClick={() => onUpdate('parkingType', 'street')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.parkingType === 'street'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Ulica/parking otwarty</p>
                  <p className="text-sm text-gray-600">Auto stoi na zewnątrz</p>
                </button>
                <button
                  onClick={() => onUpdate('parkingType', 'mixed')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.parkingType === 'mixed'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Różnie</p>
                  <p className="text-sm text-gray-600">W domu garaż, w pracy na zewnątrz</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaka jest Twoja wiedza mechaniczna?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('mechanicalSkills', 'none')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.mechanicalSkills === 'none'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Żadna</p>
                  <p className="text-sm text-gray-600">Wszystko zlecam serwisowi</p>
                </button>
                <button
                  onClick={() => onUpdate('mechanicalSkills', 'basic')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.mechanicalSkills === 'basic'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Podstawowa</p>
                  <p className="text-sm text-gray-600">Potrafię wymienić żarówkę, olej, filtr</p>
                </button>
                <button
                  onClick={() => onUpdate('mechanicalSkills', 'advanced')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.mechanicalSkills === 'advanced'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Zaawansowana</p>
                  <p className="text-sm text-gray-600">Sam wykonuję większość napraw</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Gdzie mieszkasz i jeździsz?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('terrainType', 'flat')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.terrainType === 'flat'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Teren płaski</p>
                  <p className="text-sm text-gray-600">Niziny, równe drogi</p>
                </button>
                <button
                  onClick={() => onUpdate('terrainType', 'hilly')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.terrainType === 'hilly'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Teren pagórkowaty/górski</p>
                  <p className="text-sm text-gray-600">Częste podjazdy, serpentyny</p>
                </button>
                <button
                  onClick={() => onUpdate('terrainType', 'mixed')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.terrainType === 'mixed'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Mieszany teren</p>
                  <p className="text-sm text-gray-600">Różne warunki</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 11 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaki wiek samochodu Cię interesuje?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('carAge', 'new')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.carAge === 'new'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Do 3 lat</p>
                  <p className="text-sm text-gray-600">Nowe/prawie nowe, z gwarancją</p>
                </button>
                <button
                  onClick={() => onUpdate('carAge', 'young')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.carAge === 'young'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">3-8 lat</p>
                  <p className="text-sm text-gray-600">Używane w średnim wieku</p>
                </button>
                <button
                  onClick={() => onUpdate('carAge', 'old')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.carAge === 'old'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Powyżej 8 lat</p>
                  <p className="text-sm text-gray-600">Starsze, budżetowe</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 12 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Czy masz preferencje co do producenta?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('brandPreference', 'japanese')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.brandPreference === 'japanese'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Japońskie</p>
                  <p className="text-sm text-gray-600">Toyota, Honda, Mazda, Subaru - niezawodność</p>
                </button>
                <button
                  onClick={() => onUpdate('brandPreference', 'german')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.brandPreference === 'german'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Niemieckie</p>
                  <p className="text-sm text-gray-600">VW, Audi, BMW, Mercedes - prestiż i jakość</p>
                </button>
                <button
                  onClick={() => onUpdate('brandPreference', 'french')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.brandPreference === 'french'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Francuskie</p>
                  <p className="text-sm text-gray-600">Renault, Peugeot, Citroën - komfort i styl</p>
                </button>
                <button
                  onClick={() => onUpdate('brandPreference', 'any')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.brandPreference === 'any'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Nie mam preferencji</p>
                  <p className="text-sm text-gray-600">Interesuje mnie najlepszy stosunek jakości do ceny</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 13 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Ile miejsca potrzebujesz w bagażniku?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Pomyśl o typowych zakupach, walizkach czy sprzęcie sportowym
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('trunkNeeds', 'small')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.trunkNeeds === 'small'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Mały (250-350 litrów)</p>
                  <p className="text-sm text-gray-600">Zakupy dla 1-2 osób, mała walizka kabinowa</p>
                </button>
                <button
                  onClick={() => onUpdate('trunkNeeds', 'medium')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.trunkNeeds === 'medium'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Średni (400-500 litrów)</p>
                  <p className="text-sm text-gray-600">2 duże walizki, wózek dziecięcy, większe zakupy</p>
                </button>
                <button
                  onClick={() => onUpdate('trunkNeeds', 'large')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.trunkNeeds === 'large'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Duży (550-700 litrów)</p>
                  <p className="text-sm text-gray-600">3-4 walizki, sprzęt sportowy, meble do złożenia</p>
                </button>
                <button
                  onClick={() => onUpdate('trunkNeeds', 'xl')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.trunkNeeds === 'xl'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Bardzo duży (750+ litrów)</p>
                  <p className="text-sm text-gray-600">Bagaż dla całej rodziny, duże przedmioty, wyprawy</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 14 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaka skrzynia biegów Cię interesuje?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('transmission', 'manual')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.transmission === 'manual'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Manualna</p>
                  <p className="text-sm text-gray-600">Niższe koszty, lepsza kontrola, tańsza naprawa</p>
                </button>
                <button
                  onClick={() => onUpdate('transmission', 'automatic')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.transmission === 'automatic'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Automatyczna</p>
                  <p className="text-sm text-gray-600">Wygoda w korkach, komfort jazdy</p>
                </button>
                <button
                  onClick={() => onUpdate('transmission', 'no-preference')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.transmission === 'no-preference'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Bez preferencji</p>
                  <p className="text-sm text-gray-600">Oba typy mi odpowiadają</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 15 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Czy planujesz holować przyczepę?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('towing', 'none')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.towing === 'none'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Nie</p>
                  <p className="text-sm text-gray-600">Nie potrzebuję holowania</p>
                </button>
                <button
                  onClick={() => onUpdate('towing', 'light')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.towing === 'light'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Lekka przyczepa (do 750 kg)</p>
                  <p className="text-sm text-gray-600">Mała przyczepa bagażowa, przyczepka rowerowa</p>
                </button>
                <button
                  onClick={() => onUpdate('towing', 'heavy')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.towing === 'heavy'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Ciężka przyczepa (powyżej 750 kg)</p>
                  <p className="text-sm text-gray-600">Przyczepa kempingowa, łódź, koń mechaniczny</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 16 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jakie warunki zimowe w Twoim regionie?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('winterConditions', 'mild')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.winterConditions === 'mild'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Łagodne</p>
                  <p className="text-sm text-gray-600">Rzadkie opady śniegu, głównie deszcz, +5°C do -5°C</p>
                </button>
                <button
                  onClick={() => onUpdate('winterConditions', 'harsh')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.winterConditions === 'harsh'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Ostre</p>
                  <p className="text-sm text-gray-600">Regularne opady śniegu, oblodzenia, -5°C do -15°C</p>
                </button>
                <button
                  onClick={() => onUpdate('winterConditions', 'extreme')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.winterConditions === 'extreme'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Ekstremalne</p>
                  <p className="text-sm text-gray-600">Ciężkie warunki, zaspy, poniżej -15°C</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 17 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jaki rodzaj napędu preferujesz?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('fuelType', 'petrol')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.fuelType === 'petrol'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Benzyna</p>
                  <p className="text-sm text-gray-600">Prostsza mechanika, tańszy serwis</p>
                </button>
                <button
                  onClick={() => onUpdate('fuelType', 'diesel')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.fuelType === 'diesel'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Diesel</p>
                  <p className="text-sm text-gray-600">Ekonomiczny na długich trasach</p>
                </button>
                <button
                  onClick={() => onUpdate('fuelType', 'hybrid')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.fuelType === 'hybrid'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Hybryda</p>
                  <p className="text-sm text-gray-600">Oszczędność w mieście, nowoczesna technologia</p>
                </button>
                <button
                  onClick={() => onUpdate('fuelType', 'electric')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.fuelType === 'electric'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Elektryczny</p>
                  <p className="text-sm text-gray-600">Zero emisji, niskie koszty eksploatacji</p>
                </button>
                <button
                  onClick={() => onUpdate('fuelType', 'any')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.fuelType === 'any'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Dowolny</p>
                  <p className="text-sm text-gray-600">Najważniejszy stosunek ceny do możliwości</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 18 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jak ważne są dla Ciebie osiągi?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Czas rozpędzania od 0 do 100 km/h
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('acceleration', 'slow-ok')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.acceleration === 'slow-ok'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Spokojne (&gt;11 sekund)</p>
                  <p className="text-sm text-gray-600">Ekonomia ważniejsza niż przyspieszanie</p>
                </button>
                <button
                  onClick={() => onUpdate('acceleration', 'moderate')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.acceleration === 'moderate'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Umiarkowane (8-11 sekund)</p>
                  <p className="text-sm text-gray-600">Wystarczające do pewnego wyprzedzania</p>
                </button>
                <button
                  onClick={() => onUpdate('acceleration', 'fast')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.acceleration === 'fast'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Dynamiczne (&lt;8 sekund)</p>
                  <p className="text-sm text-gray-600">Chcę mieć mocę i przyjemność z jazdy</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 19 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jakiego prześwitu potrzebujesz?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Wysokość nadwozia od podłoża - ważne dla krawężników, polnych dróg
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('heightClearance', 'low')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.heightClearance === 'low'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Niski (&lt;150 mm)</p>
                  <p className="text-sm text-gray-600">Tylko asfaltem, sportowe prowadzenie</p>
                </button>
                <button
                  onClick={() => onUpdate('heightClearance', 'standard')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.heightClearance === 'standard'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Standardowy (150-180 mm)</p>
                  <p className="text-sm text-gray-600">Normalne drogi, wysoki krawężnik OK</p>
                </button>
                <button
                  onClick={() => onUpdate('heightClearance', 'high')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.heightClearance === 'high'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Wysoki (&gt;180 mm)</p>
                  <p className="text-sm text-gray-600">Drogi polne, śnieg, tereny trudne</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 20 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Jak długo planujesz użytkować auto?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => onUpdate('plannedOwnership', 'short')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.plannedOwnership === 'short'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Krótko (do 3 lat)</p>
                  <p className="text-sm text-gray-600">Planuję wymianę, wartość odsprzedaży ważna</p>
                </button>
                <button
                  onClick={() => onUpdate('plannedOwnership', 'medium')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.plannedOwnership === 'medium'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Średnio (3-7 lat)</p>
                  <p className="text-sm text-gray-600">Standardowe użytkowanie</p>
                </button>
                <button
                  onClick={() => onUpdate('plannedOwnership', 'long')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    formData.plannedOwnership === 'long'
                      ? 'border-[#b85450] bg-[#faf5f5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">Długo (ponad 7 lat)</p>
                  <p className="text-sm text-gray-600">Do końca życia auta, niezawodność kluczowa</p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ← Wstecz
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              canProceed()
                ? 'bg-[#b85450] text-white hover:bg-[#a04946] shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Zobacz rekomendację' : 'Dalej →'}
          </button>
        </div>
      </div>
    </div>
  );
}
