'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SavedReport } from '../types';

export default function ProfilePage() {
  const { user, isLoading, logout, getSavedReports, deleteReport } = useAuth();
  const router = useRouter();
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadReports = async () => {
      if (user) {
        setLoadingReports(true);
        try {
          const reports = await getSavedReports();
          setSavedReports(reports);
        } catch (error) {
          console.error('Błąd ładowania raportów:', error);
        } finally {
          setLoadingReports(false);
        }
      }
    };
    
    loadReports();
  }, [user, getSavedReports]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten raport?')) {
      try {
        await deleteReport(reportId);
        const reports = await getSavedReports();
        setSavedReports(reports);
      } catch (error) {
        console.error('Błąd usuwania raportu:', error);
        alert('Nie udało się usunąć raportu');
      }
    }
  };

  const handleViewReport = (report: SavedReport) => {
    // Załaduj dane raportu do kontekstu FormContext
    const { setFormData, setRequirements, setOffers } = require('../context/FormContext');
    
    // Przekieruj do strony wyników z danymi raportu
    // Możemy użyć sessionStorage do tymczasowego przechowania danych
    sessionStorage.setItem('viewingReport', JSON.stringify(report));
    router.push('/results');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLogoClick={() => router.push('/')}
        onContactClick={() => router.push('/')}
      />

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Nagłówek profilu */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Witaj, {user.name}!</h1>
                <p className="text-blue-100 mb-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isPremium ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white'
                  }`}>
                    {user.isPremium ? '✨ Premium' : 'Darmowy'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Wyloguj się
              </button>
            </div>
          </div>

          {/* Statystyki */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Wszystkie raporty</div>
              <div className="text-3xl font-bold text-gray-900">{savedReports.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Ostatni raport</div>
              <div className="text-lg font-bold text-green-600">
                {savedReports.length > 0 
                  ? savedReports[0].createdAt.toLocaleDateString('pl-PL')
                  : 'Brak'
                }
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-1">Konto premium</div>
              <div className="text-lg font-bold text-blue-600">
                {user.isPremium ? '✨ Aktywne' : 'Nieaktywne'}
              </div>
            </div>
          </div>

          {/* Lista zapisanych raportów */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Twoje raporty</h2>
            </div>

            {loadingReports ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Ładowanie raportów...</p>
              </div>
            ) : savedReports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych zapisanych raportów</p>
                <button
                  onClick={() => router.push('/wizard')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Utwórz pierwszy raport
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {savedReports.map((report) => (
                  <div key={report.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {report.name || `Raport z ${new Date(report.createdAt).toLocaleDateString('pl-PL')}`}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            ✓ Zapisany
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📅 Data: {new Date(report.createdAt).toLocaleString('pl-PL', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                          <p>💰 Budżet: {report.requirements.recommendedBudget?.toLocaleString('pl-PL')} PLN</p>
                          <p>🚗 Bagażnik: {report.requirements.recommendedTrunkCapacity}L</p>
                          {report.requirements.recommendedSegments && (
                            <p>📊 Segmenty: {report.requirements.recommendedSegments.join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          👁️ Otwórz
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informacja o premium */}
          {!user.isPremium && (
            <div className="mt-8 bg-linear-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✨</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Przejdź na Premium
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Uzyskaj dostęp do zaawansowanych analiz, większej liczby ofert i priorytetowego wsparcia.
                  </p>
                  <button className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                    Zobacz plany Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
