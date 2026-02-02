'use client';

import { useLanguage, type Language } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-white hover:border-[#b85450] transition-colors cursor-pointer text-gray-700"
        aria-label="Wybierz język / Choose language"
      >
        <option value="pl">Polski (PL)</option>
        <option value="en">English (EN)</option>
      </select>
    </div>
  );
}
