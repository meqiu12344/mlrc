'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Wizard from './components/Wizard';
import Results from './components/Results';
import { FormData, Recommendation } from './types';
import { generateRecommendation } from './utils/recommendations';

export default function Home() {
  const [screen, setScreen] = useState<'hero' | 'wizard' | 'results'>('hero');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    budget: 0,
    riskTolerance: null,
    driveLocation: null,
    passengers: null,
    priority: null,
    carAttitude: null,
    annualMileage: null,
    parkingType: null,
    mechanicalSkills: null,
    terrainType: null,
    carAge: null,
    brandPreference: null,
    trunkNeeds: null,
    transmission: null,
    towing: null,
    winterConditions: null,
    fuelType: null,
    acceleration: null,
    heightClearance: null,
    plannedOwnership: null
  });
  const [recommendation, setRecommendation] = useState<Recommendation[] | null>(null);

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

  const handleComplete = () => {
    const result = generateRecommendation(formData);
    setRecommendation(result);
    setScreen('results');
  };

  const handleRestart = () => {
    setFormData({
      budget: 0,
      riskTolerance: null,
      driveLocation: null,
      passengers: null,
      priority: null,
      carAttitude: null,
      annualMileage: null,
      parkingType: null,
      mechanicalSkills: null,
      terrainType: null,
      carAge: null,
      brandPreference: null,
      trunkNeeds: null,
      transmission: null,
      towing: null,
      winterConditions: null,
      fuelType: null,
      acceleration: null,
      heightClearance: null,
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
        
        {screen === 'results' && recommendation && (
          <Results recommendations={recommendation} onRestart={handleRestart} />
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
