'use client';

import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const testimonials = [
    {
      author: 'Magdalena K.',
      role: 'Kupujący z Warszawy',
      text: 'Przed tym narzędziem miałam chaos w głowie. Te pytania naprawdę pokazały mi, czego naprawdę potrzebuję. Kupiłam samochód z pewnością siebie.',
      rating: 5,
      detail: 'Zaoszczędziłam 15 tys. zł dzięki wyeliminowaniu niepotrzebnych opcji'
    },
    {
      author: 'Paweł M.',
      role: 'Inżynier z Krakowa',
      text: 'Myślałem, że znam się na samochodach. Raport okazał się oczkiem w głowie - pokazał rzeczy, o których nie myślałem.',
      rating: 5,
      detail: 'Raport zmienił moją decyzję w ostatniej chwili - wybrałem lepszy model'
    },
    {
      author: 'Anna P.',
      role: 'Pierwszy samochód z Poznania',
      text: 'Jako osobę kupującą samochód po raz pierwszy, ta analiza była bezcenna. Nie czułam się zagubiona w liczbach.',
      rating: 5,
      detail: 'Teraz śpię spokojnie wiedząc, że wybrałam dobrze'
    },
    {
      author: 'Marek L.',
      role: 'Przedsiębiorca z Gdańska',
      text: 'Dla mojej firmy znaleźć van o optymalnych parametrach to był problem. Raport rozwiązał go w godzinę.',
      rating: 5,
      detail: 'Zmniejszyłem koszty operacyjne o 8% dzięki lepszemu wyborowi'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#faf5f5]" id="opinie">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {t(language, 'testimonials.title')} <span className="font-semibold">{t(language, 'testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t(language, 'testimonials.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-[#b85450]/30 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b85450] text-[#b85450]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="bg-[#faf5f5] p-3 rounded-lg mb-4 border-l-4 border-[#b85450]">
                <p className="text-sm text-gray-600 italic">
                  ✓ {testimonial.detail}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#b85450] to-[#9d4540] rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-light mb-4">
            Będziesz następnym zadowolonym kupującym
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nasze narzędzie już pomogło tysiącom ludzi podjąć lepsze decyzje zakupowe.
            Twoja historia może być następna.
          </p>
        </div>
      </div>
    </section>
  );
}
