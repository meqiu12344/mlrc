'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { BarChart3, Save, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jeśli użytkownik jest już zalogowany, przekieruj go w efekcie
  useEffect(() => {
    if (user) {
      router.push('/wizard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name) {
          setError('Podaj swoje imię');
          setIsLoading(false);
          return;
        }
        await register(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Jeśli użytkownik się loguje, nie renderuj nic (useEffect przesunie go do /wizard)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
      <Header 
        onLogoClick={() => router.push('/')}
        onContactClick={() => router.push('/')}
      />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-linear-to-r from-[#b85450] to-[#9d4540] px-8 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-light text-white mb-2">
                {mode === 'login' ? 'Zaloguj się' : 'Dołącz do nas'}
              </h1>
              <p className="text-white/80 text-sm">
                {mode === 'login' 
                  ? 'Wróć do swoich raportów' 
                  : 'Stwórz swoje konto i zacznij analizować samochody'}
              </p>
            </div>

            {/* Form Section */}
            <div className="px-8 py-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field (Register) */}
                {mode === 'register' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Imię
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b85450] focus:border-transparent outline-none transition"
                      placeholder="Jan Kowalski"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b85450] focus:border-transparent outline-none transition"
                    placeholder="twoj@email.com"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                    Hasło
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b85450] focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  {mode === 'register' && (
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 znaków</p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#b85450] to-[#9d4540] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Proszę czekać...
                    </span>
                  ) : (
                    mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">lub</span>
                  </div>
                </div>

                {/* Mode Switch */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-3">
                    {mode === 'login' 
                      ? 'Nie masz jeszcze konta?' 
                      : 'Masz już konto?'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setError('');
                      setEmail('');
                      setPassword('');
                      setName('');
                    }}
                    className="text-[#b85450] hover:text-[#9d4540] font-semibold transition"
                  >
                    {mode === 'login' ? 'Zarejestruj się tutaj' : 'Zaloguj się tutaj'}
                  </button>
                </div>
              </form>

              {/* Back to Home */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition flex items-center justify-center gap-2 w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Powrót do strony głównej
                </button>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <BarChart3 className="w-8 h-8 text-gray-900" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Personalizowane raporty</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Save className="w-8 h-8 text-gray-900" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Zapisz swoje analizy</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Lock className="w-8 h-8 text-gray-900" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Bezpieczne konto</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
