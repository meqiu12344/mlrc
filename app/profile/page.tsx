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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">Witaj, {user.name}!</h1>
                <p className="text-blue-100 mb-1 break-all text-sm sm:text-base">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition w-full sm:w-auto text-sm sm:text-base whitespace-nowrap"
              >
                Wyloguj się
              </button>
            </div>
          </div>

          {/* Statystyki */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-sm text-gray-600 mb-1">Wszystkie raporty</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{savedReports.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-sm text-gray-600 mb-1">Ostatni raport</div>
              <div className="text-base sm:text-lg font-bold text-green-600">
                {savedReports.length > 0 
                  ? savedReports[0].createdAt.toLocaleDateString('pl-PL')
                  : 'Brak'
                }
              </div>
            </div>
          </div>

          {/* Lista zapisanych raportów */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Twoje raporty</h2>
            </div>

            {loadingReports ? (
              <div className="px-4 sm:px-6 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Ładowanie raportów...</p>
              </div>
            ) : savedReports.length === 0 ? (
              <div className="px-4 sm:px-6 py-12 text-center">
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Nie masz jeszcze żadnych zapisanych raportów</p>
                <button
                  onClick={() => router.push('/wizard')}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Utwórz pierwszy raport
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {savedReports.map((report) => (
                  <div key={report.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                            {report.name || `Raport z ${new Date(report.createdAt).toLocaleDateString('pl-PL')}`}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                            ✓ Zapisany
                          </span>
                          { report.isPremium ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 whitespace-nowrap">
                              ⭐ Premium
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 whitespace-nowrap">
                              🆓 Darmowy
                            </span>
                          ) }
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                          <p className="break-words">📅 Data: {new Date(report.createdAt).toLocaleString('pl-PL', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                          <p>💰 Budżet: {report.requirements.recommendedBudget?.toLocaleString('pl-PL')} PLN</p>
                          <p>🚗 Bagażnik: {report.requirements.recommendedTrunkCapacity}L</p>
                          {report.requirements.recommendedSegments && (
                            <p className="break-words">📊 Segmenty: {report.requirements.recommendedSegments.join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition flex-1 sm:flex-none whitespace-nowrap"
                        >
                          👁️ Otwórz
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition flex-1 sm:flex-none whitespace-nowrap"
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
        </div>
      </main>
    </div>
  );
}
