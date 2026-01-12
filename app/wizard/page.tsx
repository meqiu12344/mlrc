'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Wizard from '../components/Wizard';
import Header from '../components/Header';
import { useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import { calculateRequirements } from '../utils/calculator';
import { searchOtomoto } from '../utils/otomoto-api';

export default function WizardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    setRequirements,
    setOffers,
    resetForm
  } = useFormContext();

  // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    if (user === null) {
      // Użytkownik nie jest zalogowany, przekieruj do logowania
      router.push('/login');
    }
  }, [user, router]);

  const handleUpdate = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleComplete = async () => {
    const calculatedReqs = calculateRequirements(formData);
    setRequirements(calculatedReqs);
    
    const budget = calculatedReqs.recommendedBudget || formData.monthlyIncome * 10 || 50000;
    const otomotoOffers = await searchOtomoto(calculatedReqs, budget);
    setOffers(otomotoOffers);
    
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLogoClick={() => {
          resetForm();
          router.push('/');
        }}
        onContactClick={() => {
          resetForm();
          router.push('/');
        }}
      />

      {user ? (
        <main className="pt-20">
          <Wizard
            formData={formData}
            currentStep={currentStep}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </main>
      ) : (
        <main className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Sprawdzam autentykację...</p>
          </div>
        </main>
      )}
    </div>
  );
}
