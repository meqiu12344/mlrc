'use client';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
            Kupno samochodu <br />
            <span className="font-medium">bez stresu</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light max-w-2xl mx-auto">
            Uporządkuj swoje potrzeby.
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto mb-12">
            To narzędzie decyzyjne, które pomaga Ci zrozumieć, czego naprawdę potrzebujesz. 
            Nie sprzedajemy samochodów – pomagamy Ci myśleć jasno.
          </p>
          
          <button
            onClick={onStartClick}
            className="inline-block px-12 py-4 bg-[#b85450] text-white rounded-full text-lg font-medium 
                     hover:bg-[#a04946] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Zacznij proces
          </button>
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-2xl font-light text-gray-800 mb-16">Jak to działa?</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#faf5f5] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Określ swoje realne potrzeby</h3>
              <p className="text-gray-600 leading-relaxed">
                Odpowiedz na proste pytania o budżet, sposób użytkowania i priorytety.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#faf5f5] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Przejdź przez logiczne pytania</h3>
              <p className="text-gray-600 leading-relaxed">
                Bez presji czasu. Możesz wrócić do każdego kroku.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#faf5f5] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Otrzymaj obiektywną rekomendację</h3>
              <p className="text-gray-600 leading-relaxed">
                Konkretne wskazówki oparte na Twoich odpowiedziach, nie na reklamie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
