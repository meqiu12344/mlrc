"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, updateReportPremium } = useAuth();
  const [status, setStatus] = useState<'checking' | 'paid' | 'unpaid' | 'error'>('checking');

  useEffect(() => {
    // Poczekaj aż user się załaduje
    if (isLoading) return;
    
    if (!user) {
      setStatus('error');
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error('verify failed');
        const data = await res.json();
        if (data.paid && data.reportId) {
          // Zaktualizuj raport jako premium w bazie danych
          await updateReportPremium(data.reportId);
          setStatus('paid');
        } else {
          setStatus('unpaid');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    verify();
  }, [searchParams, updateReportPremium, user, isLoading]);

  const goToResults = () => router.push('/results');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="bg-white/90 border border-emerald-100 shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center">
        {status === 'checking' && (
          <>
            <div className="mb-4 text-emerald-600 font-semibold">Potwierdzamy płatność...</div>
            <div className="animate-pulse text-sm text-gray-600">Prosimy o chwilę cierpliwości</div>
          </>
        )}
        {status === 'paid' && (
          <>
            <div className="text-3xl mb-3">✅</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Płatność potwierdzona</h1>
            <p className="text-gray-600 mb-6">Pełny raport został odblokowany.</p>
            <button onClick={goToResults} className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
              Wróć do raportu
            </button>
          </>
        )}
        {status === 'unpaid' && (
          <>
            <div className="text-3xl mb-3">ℹ️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Płatność nie została ukończona</h1>
            <p className="text-gray-600 mb-6">Spróbuj ponownie, aby odblokować raport.</p>
            <button onClick={goToResults} className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition">
              Wróć do raportu
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-3xl mb-3">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Błąd weryfikacji</h1>
            <p className="text-gray-600 mb-6">Nie udało się potwierdzić płatności. Sprawdź link lub spróbuj ponownie.</p>
            <button onClick={goToResults} className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition">
              Wróć do raportu
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <div className="bg-white/90 border border-emerald-100 shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center">
          <div className="mb-4 text-emerald-600 font-semibold">Ładowanie...</div>
        </div>
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
