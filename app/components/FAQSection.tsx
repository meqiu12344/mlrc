'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';

export default function FAQSection() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Czy raport jest dostosowany do mojej sytuacji?',
      answer: 'Tak! Raport jest w 100% spersonalizowany. System zadaje Ci pytania o budżet, sposób użytkowania, priorytety i wiele więcej, aby stworzyć raport dokładnie dla Ciebie.'
    },
    {
      question: 'Czy mogę użyć raportu wiele razy lub go zaktualizować?',
      answer: 'Tak! Gdy zmienią się Twoje warunki (np. wzrost budżetu), możesz wygenerować nowy raport. Raport pozostaje dostępny na zawsze w Twoim koncie.'
    },
    {
      question: 'Ile czasu zajmuje wygenerowanie raportu?',
      answer: 'Samo wypełnienie ankiety zajmuje około 15-20 minut. Raport generuje się automatycznie i jest gotowy do przeczytania od razu.'
    },
    {
      question: 'Jakie modele są zawarte w raporcie?',
      answer: 'Raport obejmuje wszystkie popularne modele dostępne na polskim rynku wtórnym i nowym. Uwzględnia się dostępność, cenę i stan techniczny.'
    },
    {
      question: 'Czy mogę rozmawiać z ekspertem?',
      answer: 'Raport zawiera wszystkie informacje potrzebne do samodzielnej decyzji. Jeśli będziesz mieć pytania, możesz skontaktować się z nami przez formularz kontaktowy.'
    },
    {
      question: 'Co jeśli zmienię zdanie po zakupie raportu?',
      answer: 'Oferujemy 14-dniową gwarancję zwrotu pieniędzy, bez pytań. Jeśli raport nie będzie spełniać Twoich oczekiwań, zwrócimy 100% pieniędzy.'
    },
    {
      question: 'Czy moje dane są bezpieczne?',
      answer: 'Tak. Wszystkie dane są szyfrowane i przechowywane w zgodzie z RODO. Nigdy nie sprzedajemy Twoich danych osobom trzecim.'
    },
    {
      question: 'Ile kosztuje raport?',
      answer: 'Raport Premium kosztuje 25 zł (jednorazowo, na zawsze). To znacznie mniej niż jednorazowe oszczędności, jakie możesz zyskać dzięki mądrzejszej decyzji.'
    }
  ];

  return (
    <section className="py-20 px-6 bg-[#faf5f5]" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {t(language, 'faq.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t(language, 'faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#b85450] transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#faf5f5] transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-left">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-[#b85450] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-[#faf5f5] border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#b85450] to-[#9d4540] rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-light mb-3">
            Nie znalazłeś odpowiedzi na swoje pytanie?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Nasz zespół chętnie Ci pomoże
          </p>
          <a 
            href="#kontakt"
            className="inline-block px-8 py-3 bg-white text-[#b85450] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Skontaktuj się z nami
          </a>
        </div>
      </div>
    </section>
  );
}
