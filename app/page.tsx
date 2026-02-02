'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Metadata } from 'next';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import BenefitsSection from './components/BenefitsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { useFormContext } from './context/FormContext';

export default function Home() {
  const router = useRouter();
  const { resetForm } = useFormContext();

  // Obsługa scrollowania do sekcji po załadowaniu strony z hash w URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleStart = () => {
    resetForm();
    router.push('/wizard');
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('kontakt');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLogoClick={() => router.push('/')}
        onContactClick={handleContactClick}
      />

      <main>
        <Hero onStartClick={handleStart} />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onStartClick={handleStart} />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
