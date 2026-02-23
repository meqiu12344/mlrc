'use client';

import { TrendingUp, DollarSign, Clock, Shield, Brain, CheckCircle } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Zaoszczędź nawet 12 tys. zł',
      description: 'Dzięki mądrzejszym wyborom możesz zaoszczędzić znaczne kwoty na wyborze pojazdu'
    },
    {
      icon: Clock,
      title: 'Oszczędź czas',
      description: 'Zamiast godzin przeglądania ofert, masz konkretne rekomendacje w 15 minut'
    },
    {
      icon: Brain,
      title: 'Zrozumiej swoje potrzeby',
      description: 'System logicznych pytań pomaga Ci zidentyfikować, czego naprawdę potrzebujesz'
    },
    {
      icon: Shield,
      title: 'Kupuj z pewnością siebie',
      description: 'Wiesz dokładnie, dlaczego wybrałeś konkretny model'
    },
    {
      icon: TrendingUp,
      title: 'Zwiększ wartość decyzji',
      description: 'Długoterminowa satysfakcja z wyboru - nie żałujesz ani miesiąc, ani rok potem'
    },
    {
      icon: CheckCircle,
      title: 'Wsparcie na całej drodze',
      description: 'Raport zawiera wszystkie informacje potrzebne do samodzielnej decyzji'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white" id="cechy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Korzyści <span className="font-semibold">jakie zyskasz</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wszystko co musisz wiedzieć o wyborze samochodu, zebrané w jednym miejscu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="p-8 rounded-2xl border border-gray-200 hover:border-[#b85450] hover:shadow-xl hover:bg-[#faf5f5] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#b85450] to-[#9d4540] flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#faf5f5] to-white border border-gray-200 rounded-2xl p-10 md:p-14">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Raport zawiera:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Analiza Twoich rzeczywistych potrzeb',
              'Lista 5-10 najlepszych modeli',
              'Porównanie specyfikacji technicznych',
              'Średnie ceny na polskim rynku',
              'Typowe problemy każdego modelu',
              'Koszty utrzymania i eksploatacji',
              'Rekomendacje wersji i wyposażenia',
              'Porady na temat bezpieczeństwa'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#b85450] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
