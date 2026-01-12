'use client';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-32 pt-32 bg-gradient-to-br from-white via-[#faf5f5] to-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero Header */}
        <div className="mb-20">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
            Kupno samochodu <br />
            <span className="font-semibold bg-gradient-to-r from-[#b85450] to-[#9d4540] bg-clip-text text-transparent">bez stresu i wątpliwości</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-6 font-light max-w-3xl mx-auto leading-relaxed">
            Zrozum swoje rzeczywiste potrzeby zanim kupisz samochód
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartClick}
              className="px-10 py-4 bg-gradient-to-r from-[#b85450] to-[#9d4540] text-white rounded-full text-lg font-semibold 
                       hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Zacznij bezpłatnie
            </button>
            <a 
              href="#jak-dziala"
              className="px-10 py-4 border-2 border-gray-300 text-gray-900 rounded-full text-lg font-semibold 
                       hover:border-[#b85450] hover:text-[#b85450] transition-all duration-300"
            >
              Dowiedz się więcej
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600 font-light">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#b85450]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401h-4.753c-.8 0-1.119.997-.556 1.617l3.84 2.939-1.831 4.401c-.321.772.128 1.693.684 1.693.556 0 .896-.225 1.217-.997l1.83-4.401 4.753 0c.8 0 1.119-.997.556-1.617l-3.84-2.939 1.831-4.401z" />
              </svg>
              <span>4.9/5 (1200+ opinii)</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Zaufane przez 50k+ kupujących</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>⏱ 15 minut aby znaleźć auto</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="jak-dziala" className="mt-32 scroll-mt-20">
          <h2 className="text-4xl font-light text-gray-900 mb-20">Jak to działa w 3 krokach</h2>
          
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
