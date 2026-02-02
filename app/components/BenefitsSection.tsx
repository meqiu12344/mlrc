'use client';

import { TrendingUp, DollarSign, Clock, Shield, Brain, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';

export default function BenefitsSection() {
  const { language } = useLanguage();
  const benefits = [
    {
      icon: DollarSign,
      title: t(language, 'benefits.save12k.title'),
      description: t(language, 'benefits.save12k.desc')
    },
    {
      icon: Clock,
      title: t(language, 'benefits.time.title'),
      description: t(language, 'benefits.time.desc')
    },
    {
      icon: Brain,
      title: t(language, 'benefits.understand.title'),
      description: t(language, 'benefits.understand.desc')
    },
    {
      icon: Shield,
      title: t(language, 'benefits.confidence.title'),
      description: t(language, 'benefits.confidence.desc')
    },
    {
      icon: TrendingUp,
      title: t(language, 'benefits.value.title'),
      description: t(language, 'benefits.value.desc')
    },
    {
      icon: CheckCircle,
      title: t(language, 'benefits.support.title'),
      description: t(language, 'benefits.support.desc')
    }
  ];

  return (
    <section className="py-20 px-6 bg-white" id="cechy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {t(language, 'benefits.title')} <span className="font-semibold">{t(language, 'benefits.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t(language, 'benefits.subtitle')}
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
            {t(language, 'benefits.includes')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              t(language, 'benefits.item1'),
              t(language, 'benefits.item2'),
              t(language, 'benefits.item3'),
              t(language, 'benefits.item4'),
              t(language, 'benefits.item5'),
              t(language, 'benefits.item6'),
              t(language, 'benefits.item7'),
              t(language, 'benefits.item8')
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
