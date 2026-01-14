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
  const [disableAutoSave, setDisableAutoSave] = useState(false);
  const [reportId, setReportId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    if (!user) {
      router.push('/login');
      return;
    }

    // NAJPIERW sprawdź czy jest raport w sessionStorage
    const viewingReportStr = sessionStorage.getItem('viewingReport');
    
    if (viewingReportStr) {
      try {
        console.log('Ładowanie raportu z sessionStorage...');
        const savedReport: SavedReport = JSON.parse(viewingReportStr);
        setFormData(savedReport.formData);
        setRequirements(savedReport.requirements);
        setReportId(savedReport.id); // Przekaż ID zapisanego raportu
        // Otwieramy istniejący raport – włącz tryb tylko-do-odczytu (bez autozapisu)
        setDisableAutoSave(true);
        // Offers są generowane na żywo, nie przechowujemy ich
        sessionStorage.removeItem('viewingReport');
        console.log('Raport załadowany z sessionStorage');
        setIsLoading(false);
      } catch (error) {
        console.error('Błąd ładowania raportu:', error);
        sessionStorage.removeItem('viewingReport');
        router.push('/');
      }
    } else if (!requirements) {
      // Brak danych - kieruj na home
      console.log('Brak danych raportu, kierowanie na home');
      router.push('/');
    } else {
      // Mamy requirements z kontekstu (przeszliśmy przez kreator)
      console.log('Dane z kontekstu dostępne');
      setIsLoading(false);
    }
  }, [user, router, setFormData, setRequirements]);

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
          disableAutoSave={disableAutoSave}
          reportId={reportId}
        />
      </main>
    </div>
  );
}
