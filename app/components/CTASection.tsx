'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';

interface CTASectionProps {
  onStartClick?: () => void;
}

export default function CTASection({ onStartClick }: CTASectionProps) {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
              {t(language, 'cta.title')} 
              <span className="font-semibold"> {t(language, 'cta.titleHighlight')}</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t(language, 'cta.subtitle')}
            </p>

            <div className="space-y-4 mb-10">
              {[
                t(language, 'cta.feature1'),
                t(language, 'cta.feature2'),
                t(language, 'cta.feature3'),
                t(language, 'cta.feature4')
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
                {t(language, 'cta.ctaButton')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-full font-semibold text-lg hover:border-[#b85450] hover:text-[#b85450] transition-all duration-300"
              >
                {t(language, 'cta.learnMore')}
              </button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#b85450] to-[#9d4540] rounded-3xl p-12 text-white shadow-2xl">
              <div className="space-y-8">
                <div className="border-b border-white/20 pb-8">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">
                    {t(language, 'cta.includes')}
                  </h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      {t(language, 'cta.item1')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      {t(language, 'cta.item2')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      {t(language, 'cta.item3')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      {t(language, 'cta.item4')}
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-3">{t(language, 'cta.timeLabel')}:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light">20</span>
                    <span className="text-white/70">{t(language, 'cta.timeUnit')}</span>
                  </div>
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-3">{t(language, 'cta.savingsLabel')}:</p>
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
                <span className="text-2xl font-extrabold text-[#b85450]">{t(language, 'price')}</span>
                <p className="text-xs text-gray-500 mt-1">{t(language, 'priceOnce')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
