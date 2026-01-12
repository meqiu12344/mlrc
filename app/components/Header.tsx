'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onLogoClick?: () => void;
  onContactClick?: () => void;
}

export default function Header({ onLogoClick, onContactClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNavigateToSection = (sectionId: string) => {
    if (pathname === '/') {
      // Jeśli jesteśmy na stronie głównej, scrolluj do sekcji
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Jeśli jesteśmy na innej stronie, przekieruj na stronę główną z hash
      router.push(`/#${sectionId}`);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#b85450] flex items-center justify-center">
              <span className="text-white font-bold text-sm">🚗</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">MLRC</span>
          </button>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-12">
            <button 
              onClick={() => handleNavigateToSection('jak-dziala')}
              className="text-gray-700 hover:text-[#b85450] transition-colors font-light"
            >
              Jak to działa
            </button>
            <button 
              onClick={() => handleNavigateToSection('cechy')}
              className="text-gray-700 hover:text-[#b85450] transition-colors font-light"
            >
              Cechy
            </button>
            <button 
              onClick={() => handleNavigateToSection('kontakt')}
              className="text-gray-700 hover:text-[#b85450] transition-colors font-light"
            >
              Kontakt
            </button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#b85450] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      📊 Mój profil
                    </button>
                    <button
                      onClick={() => router.push('/wizard')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      ✨ Nowy raport
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Wyloguj się
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 text-gray-700 hover:text-[#b85450] transition-colors font-medium text-sm"
                >
                  Zaloguj się
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="px-8 py-2 bg-[#b85450] text-white rounded-full font-medium 
                           hover:bg-[#a04946] transition-colors text-sm"
                >
                  Zacznij
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
