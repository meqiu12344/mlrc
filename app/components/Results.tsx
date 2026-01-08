'use client';

import { Recommendation } from '../types';

interface ResultsProps {
  recommendations: Recommendation[];
  onRestart: () => void;
}

export default function Results({ recommendations, onRestart }: ResultsProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-[#faf5f5] rounded-full mb-6">
            <svg className="w-12 h-12 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Twoje Rekomendacje
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Na podstawie 20 szczegółowych pytań przygotowaliśmy precyzyjną analizę
          </p>
        </div>

        {/* Recommendations List */}
        <div className="space-y-8">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {/* Match Score Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    rec.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                    rec.matchScore >= 75 ? 'bg-blue-100 text-blue-700' :
                    rec.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Dopasowanie: {rec.matchScore}%
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-[#b85450] text-white text-xs font-medium rounded-full">
                      TOP WYBÓR
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Segment: {rec.segment}
                </div>
              </div>

              {/* Car Name */}
              <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
                {rec.models[0]}
              </h2>

              {/* Reasoning */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {rec.reasoning}
              </p>

              {/* Detailed Specs - 3 Column Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Column 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">
                    Podstawowe Dane
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Typ nadwozia</span>
                      <span className="text-sm font-medium text-gray-900">{rec.bodyStyle}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Kategoria cenowa</span>
                      <span className="text-sm font-medium text-gray-900">{rec.priceCategory}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Napęd</span>
                      <span className="text-sm font-medium text-gray-900">{rec.driveType}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Skrzynia biegów</span>
                      <span className="text-sm font-medium text-gray-900">{rec.transmissionType}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Performance */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">
                    Osiągi i Możliwości
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Moc silnika</span>
                      <span className="text-sm font-medium text-gray-900">{rec.enginePower}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Przyspieszenie 0-100</span>
                      <span className="text-sm font-medium text-gray-900">{rec.accelerationTime}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Rodzaj paliwa</span>
                      <span className="text-sm font-medium text-gray-900">{rec.fuelTypes}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Masa holownicza</span>
                      <span className="text-sm font-medium text-gray-900">{rec.towingCapacity}</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Practical Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">
                    Praktyczne Cechy
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Pojemność bagażnika</span>
                      <span className="text-sm font-medium text-gray-900">{rec.trunkCapacity}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Prześwit</span>
                      <span className="text-sm font-medium text-gray-900">{rec.groundClearance}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Zdolności zimowe</span>
                      <span className="text-sm font-medium text-gray-900">{rec.winterCapability}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Miejska przyjazność</span>
                      <span className="text-sm font-medium text-gray-900">{rec.cityFriendly}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reliability Score */}
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Ocena niezawodności</span>
                  <span className="text-2xl font-bold text-[#b85450]">{rec.reliability}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#b85450] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${parseInt(rec.reliability) * 10}%` }}
                  ></div>
                </div>
              </div>


              {/* Warnings Section */}
              {rec.warnings.length > 0 && (
                <div className="bg-red-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-900 mb-2">Ostrzeżenia</h4>
                      <ul className="space-y-2">
                        {rec.warnings.map((warning, wIndex) => (
                          <li key={wIndex} className="text-sm text-red-800">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions Section */}
              {rec.suggestions.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Wskazówki</h4>
                      <ul className="space-y-2">
                        {rec.suggestions.map((suggestion, sIndex) => (
                          <li key={sIndex} className="text-sm text-blue-800">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="bg-[#faf5f5] rounded-2xl p-8 mb-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong className="font-medium">Pamiętaj:</strong> To narzędzie nie sprzedaje samochodów. 
            Pomaga Ci tylko uporządkować myśli i priorytetować potrzeby przed wizytą w salonie 
            lub przeglądaniem ogłoszeń.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Zawsze sprawdzaj historię konkretnego egzemplarza, stan techniczny i księgę serwisową. 
            Najlepszy typ auta w złym stanie to nadal zły zakup.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Wskazówka:</strong> Przy oględzinach zabierz zaufanego mechanika lub zamów inspekcję przedkupową 
            (koszt 300-500 zł może uchronić Cię przed wydatkiem tysięcy).
          </p>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 
                     text-gray-700 rounded-full font-medium hover:border-[#b85450] hover:text-[#b85450] 
                     transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Zacznij od nowa
          </button>
        </div>
      </div>
    </div>
  );
}
