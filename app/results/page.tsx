'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Results from '../components/Results';
import Header from '../components/Header';
import { useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import { SavedReport } from '../types';

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { requirements, offers, resetForm, setFormData, setRequirements, setOffers } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    if (!user) {
      router.push('/login');
      return;
    }

    // Sprawdź czy jest raport do wyświetlenia w sessionStorage
    const viewingReportStr = sessionStorage.getItem('viewingReport');
    
    if (viewingReportStr) {
      try {
        const savedReport: SavedReport = JSON.parse(viewingReportStr);
        setFormData(savedReport.formData);
        setRequirements(savedReport.requirements);
        setOffers(savedReport.offers);
        sessionStorage.removeItem('viewingReport');
        setIsLoading(false);
      } catch (error) {
        console.error('Błąd ładowania raportu:', error);
        router.push('/');
      }
    } else if (!requirements) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [requirements, router, user, setFormData, setRequirements, setOffers]);

  // Jeśli brakuje danych, pokaż loading
  if (isLoading || !requirements) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  const handleRestart = () => {
    resetForm();
    router.push('/');
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

      <main className="pt-20">
        <Results 
          requirements={requirements}
          offers={offers}
          onRestart={handleRestart}
        />
      </main>
    </div>
  );
}
