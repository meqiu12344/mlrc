'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Wizard from './components/Wizard';
import Results from './components/Results';
import { FormData, Recommendation, CalculatedRequirements, CarOffer } from './types';
import { generateRecommendation } from './utils/recommendations';
import { calculateRequirements } from './utils/calculator';
import { searchOtomoto } from './utils/otomoto-api';

export default function Home() {
  const [screen, setScreen] = useState<'hero' | 'wizard' | 'results'>('hero');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    monthlyIncome: 0,
    maxMonthlyPayment: null,
    dailyCommute: null,
    commuteType: null,
    parkingAtWork: null,
    parkingAtHome: null,
    householdSize: 1,
    childrenCount: 0,
    childSeats: 0,
    elderlyPassengers: false,
    weeklyGroceries: null,
    sportsEquipment: null,
    petTransport: null,
    strollerType: null,
    longTripsPerYear: 0,
    vacationStyle: null,
    winterConditions: null,
    roadType: null,
    hilliness: null,
    weekendActivities: null,
    trailerNeeded: null,
    mainConcern: null,
    mechanicalSkills: null,
    plannedOwnership: null
  });
  const [recommendation, setRecommendation] = useState<Recommendation[] | null>(null);
  const [requirements, setRequirements] = useState<CalculatedRequirements | null>(null);
  const [offers, setOffers] = useState<CarOffer[]>([]);

  const handleStart = () => {
    setScreen('wizard');
    setCurrentStep(1);
  };

  const handleUpdate = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    const calculatedReqs = calculateRequirements(formData);
    setRequirements(calculatedReqs);
    const result = generateRecommendation(formData);
    setRecommendation(result);
    
    // Pobieramy oferty z Otomoto
    const budget = calculatedReqs.recommendedBudget || formData.monthlyIncome * 10 || 50000;
    const otomotoOffers = await searchOtomoto(calculatedReqs, budget);
    setOffers(otomotoOffers);
    
    setScreen('results');
  };

  const handleRestart = () => {
    setFormData({
      monthlyIncome: 0,
      maxMonthlyPayment: null,
      dailyCommute: null,
      commuteType: null,
      parkingAtWork: null,
      parkingAtHome: null,
      householdSize: 1,
      childrenCount: 0,
      childSeats: 0,
      elderlyPassengers: false,
      weeklyGroceries: null,
      sportsEquipment: null,
      petTransport: null,
      strollerType: null,
      longTripsPerYear: 0,
      vacationStyle: null,
      winterConditions: null,
      roadType: null,
      hilliness: null,
      weekendActivities: null,
      trailerNeeded: null,
      mainConcern: null,
      mechanicalSkills: null,
      plannedOwnership: null
    });
    setCurrentStep(1);
    setRecommendation(null);
    setScreen('hero');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Logo Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#b85450] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-light text-gray-900">My Little Red Car</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {screen === 'hero' && <Hero onStartClick={handleStart} />}
        
        {screen === 'wizard' && (
          <Wizard
            formData={formData}
            currentStep={currentStep}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
        
        {screen === 'results' && recommendation && requirements && (
          <Results 
            recommendations={recommendation} 
            requirements={requirements}
            offers={offers}
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            To narzędzie nie sprzedaje samochodów ani nie współpracuje z salonami. 
            Powstało, by pomóc Ci myśleć jasno przed zakupem.
          </p>
        </div>
      </footer>
    </div>
  );
}
