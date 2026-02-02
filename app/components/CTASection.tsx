'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';

interface CTASectionProps {
  onStartClick?: () => void;
}

export default function CTASection({ onStartClick }: CTASectionProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
              Gotowy na 
              <span className="font-semibold"> świadomą decyzję?</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Twój raport przygotowuje się w kilka minut. Zawiera wszystko czego potrzebujesz do kupienia idealnego samochodu.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Proces w 100% bezpieczny i poufny',
                'Możliwość powrotu do każdego kroku',
                'Raport dostępny na zawsze',
                'Gwarancja zwrotu pieniędzy 14 dni'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#b85450] flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartClick}
                className="px-8 py-4 bg-gradient-to-r from-[#b85450] to-[#9d4540] text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Rozpocznij teraz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-full font-semibold text-lg hover:border-[#b85450] hover:text-[#b85450] transition-all duration-300"
              >
                Dowiedz się więcej
              </button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#b85450] to-[#9d4540] rounded-3xl p-12 text-white shadow-2xl">
              <div className="space-y-8">
                <div className="border-b border-white/20 pb-8">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">
                    Co dostajesz:
                  </h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      Spersonalizowany raport PDF
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      Rekomendacje konkretnych modeli
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      Szacunek kosztów eksploatacji
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      Porady negocjacyjne
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-3">Czas do pełnej decyzji:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light">20</span>
                    <span className="text-white/70">minut</span>
                  </div>
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-3">Średnie oszczędności:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light">12 000</span>
                    <span className="text-white/70">zł</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-full px-6 py-4 shadow-xl border-4 border-[#faf5f5]">
              <div className="text-center">
                <span className="text-2xl font-extrabold text-[#b85450]">25 zł</span>
                <p className="text-xs text-gray-500 mt-1">Jednorazowo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
