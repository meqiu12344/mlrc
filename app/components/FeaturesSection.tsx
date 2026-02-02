'use client';

import { Car, Zap, DollarSign, Users, BriefcaseBusiness, ShieldQuestionMark } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="cechy" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-gray-900 mb-4">
            Dlaczego My Little Red Car?
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Rozwiąż problem niezdecydowania przed zakupem samochodu
          </p>
        </div>

        {/* Problem - Solution Grid */}
        <div className="grid md:grid-cols-2 gap-16 mb-32">
          {/* Left Side - Problem */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Problem</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Zbyt wiele opcji</h4>
                  <p className="text-gray-600 font-light">Na rynku dostępne są tysiące samochodów - jak wybrać ten odpowiedni?</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Brak jasnych kryteriów</h4>
                  <p className="text-gray-600 font-light">Nie wiesz, na co zwrócić uwagę - budżet, wydajność, design czy bezpieczeństwo?</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emocjonalne decyzje</h4>
                  <p className="text-gray-600 font-light">Kupujesz na emocji, bez analizy swoich rzeczywistych potrzeb i możliwości finansowych</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ryzyko błędu</h4>
                  <p className="text-gray-600 font-light">Bez profesjonalnej oceny możesz kupić auto z ukrytymi problemami lub nie spełniające Twoich potrzeb</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Solution */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Nasza solucja</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Inteligentna analiza</h4>
                  <p className="text-gray-600 font-light">Nasz wizard zadaje proste pytania o Twoim stylu życia i potrzebach, aby znaleźć idealne auto</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personalne rekomendacje</h4>
                  <p className="text-gray-600 font-light">Otrzymujesz listy samochodów dostosowanych do Twoich potrzeb i budżetu z wyjaśnieniami</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Profesjonalne raporty</h4>
                  <p className="text-gray-600 font-light">Szczegółowe raporty konkretnych pojazdów - historia, stan techniczny, realna cena rynkowa</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Spokojne zakupy</h4>
                  <p className="text-gray-600 font-light">Kupujesz świadomie, bez strachu i wątpliwości - z pełną wiedzą o wyborze</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Whom Section */}
        <div className="bg-gradient-to-r from-[#f5f0f0] to-[#faf5f5] rounded-2xl p-12 md:p-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-12 text-center">Dla kogo jest My Little Red Car?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Persona 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <Users className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Rodziny</h4>
              <p className="text-gray-600 font-light">
                Szukają bezpiecznego, spacernistanego samochodu dla całej rodziny. Potrzebują większej przestrzeni i niezawodności.
              </p>
            </div>

            {/* Persona 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <BriefcaseBusiness className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Pracownicy biurowi</h4>
              <p className="text-gray-600 font-light">
                Potrzebują auta na codzienne dojeżdżanie, ekonomiczne i wygodne. Liczą się koszty paliwa i serwisu.
              </p>
            </div>

            {/* Persona 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <Car className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Entuzjaści samochodów</h4>
              <p className="text-gray-600 font-light">
                Chcą samochodu z charakterem, wydajnym i wygodnym. Szukają idealnego balansu między stylem a funkcjonalnością.
              </p>
            </div>

            {/* Persona 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <Zap className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Osoby aktywne</h4>
              <p className="text-gray-600 font-light">
                Podróżują, grają w sporty, bywają w trudnych warunkach. Potrzebują auto wszechstronne i wytrzymałe.
              </p>
            </div>

            {/* Persona 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <DollarSign className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Świadomi budżetu</h4>
              <p className="text-gray-600 font-light">
                Mają ograniczony budżet i chcą maksimum wartości. Szukają najlepszych ofert za rozsądne pieniądze.
              </p>
            </div>

            {/* Persona 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                <ShieldQuestionMark className="w-10 h-10 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Pierwsi kupujący</h4>
              <p className="text-gray-600 font-light">
                Bez doświadczenia, zagubjeni w wyborze. Potrzebują przewodnika, którego da się zaufać.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
