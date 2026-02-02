'use client';

import { TrendingUp, DollarSign, Clock, Shield, Brain, CheckCircle } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Zaoszczędź średnio 12 000 zł',
      description: 'Unika nierozsądnych wyborów i dodatkowych kosztów dzięki świadomej decyzji'
    },
    {
      icon: Clock,
      title: 'Oszczędź czasu poszukiwań',
      description: 'Zamiast szukać przez miesiące bez kierunku, wiesz dokładnie co szukasz'
    },
    {
      icon: Brain,
      title: 'Zrozum swoje rzeczywiste potrzeby',
      description: 'Uświadom sobie, co naprawdę jest dla Ciebie ważne, a co to tylko moda'
    },
    {
      icon: Shield,
      title: 'Kup z pewnością siebie',
      description: 'Zmniejsz żal po zakupie dzięki świadomemu wyborowi'
    },
    {
      icon: TrendingUp,
      title: 'Lepsza wartość residualna',
      description: 'Samochody wybrane celowo mają lepszą wartość na rynku wtórnym'
    },
    {
      icon: CheckCircle,
      title: 'Wsparcie przy wyborze',
      description: 'Konkretne modele i warianty zamiast ogólnych rad'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white" id="cechy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Dlaczego nasz raport <span className="font-semibold">zmienia decyzje</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Konkretne korzyści, które uzyskujesz kupując raport
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
            Co zawiera Twój raport:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Analiza Twoich rzeczywistych potrzeb',
              'Wyliczenie optymalnych parametrów',
              'Konkretne modele dostępne na rynku',
              'Szacowanie kosztów eksploatacji',
              'Ranking wariantów pod względem Twoich priorytetów',
              'Porady na temat negocjowania ceny',
              'Wskazówki dotyczące inspekcji przed kupnem',
              'Informacje o gwarancjach i ubezpieczeniach'
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
