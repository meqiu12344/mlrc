'use client';

import { Recommendation, CalculatedRequirements, CarOffer } from '../types';

interface ResultsProps {
  recommendations: Recommendation[];
  requirements: CalculatedRequirements;
  offers: CarOffer[];
  onRestart: () => void;
}

export default function Results({ recommendations, requirements, offers, onRestart }: ResultsProps) {
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
            Twoje Idealne Auto
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Przeanalizowaliśmy Twoje codzienne potrzeby i wyliczyliśmy optymalne parametry
          </p>
        </div>

        {/* Calculated Requirements Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Wyliczone Parametry Techniczne
          </h2>

          {/* Grid with calculated parameters */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Bagażnik */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Bagażnik</div>
              <div className="text-2xl font-medium text-gray-900">
                {requirements.minTrunkCapacity} - {requirements.recommendedTrunkCapacity}L
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {requirements.reasoning.trunk}
              </div>
            </div>

            {/* Moc */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Moc silnika</div>
              <div className="text-2xl font-medium text-gray-900">
                min. {requirements.minPower} KM
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {requirements.reasoning.power}
              </div>
            </div>

            {/* Budżet */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Budżet</div>
              <div className="text-2xl font-medium text-gray-900">
                {requirements.recommendedBudget > 0 
                  ? `${(requirements.recommendedBudget / 1000).toFixed(0)}k zł`
                  : 'Nie określono'}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {requirements.reasoning.budget}
              </div>
            </div>

            {/* Przyspieszenie */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Przyspieszenie 0-100</div>
              <div className="text-2xl font-medium text-gray-900">
                &lt; {requirements.maxAcceleration}s
              </div>
            </div>

            {/* Miejsca */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Miejsca siedzące</div>
              <div className="text-2xl font-medium text-gray-900">
                min. {requirements.minSeats}
                {requirements.thirdRowNeeded && <span className="text-base ml-2">(7-osobowe)</span>}
              </div>
            </div>

            {/* Spalanie */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Spalanie (miasto)</div>
              <div className="text-2xl font-medium text-gray-900">
                max. {requirements.maxFuelConsumption}L/100km
              </div>
            </div>

            {/* Prześwit */}
            {requirements.minGroundClearance > 140 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Prześwit</div>
                <div className="text-2xl font-medium text-gray-900">
                  min. {requirements.minGroundClearance}mm
                </div>
              </div>
            )}

            {/* Holowanie */}
            {requirements.towingCapacity > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Masa holownicza</div>
                <div className="text-2xl font-medium text-gray-900">
                  min. {requirements.towingCapacity}kg
                </div>
              </div>
            )}

            {/* Koszty miesięczne */}
            {requirements.maxMonthlyCost > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Miesięczny koszt</div>
                <div className="text-2xl font-medium text-gray-900">
                  ~{requirements.maxMonthlyCost} zł/mies.
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  paliwo + ubezpieczenie + rata
                </div>
              </div>
            )}
          </div>

          {/* Segment recommendation */}
          {requirements.recommendedSegments.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">Polecane segmenty:</div>
              <div className="flex flex-wrap gap-2">
                {requirements.recommendedSegments.map((seg, i) => (
                  <span key={i} className="px-3 py-1 bg-[#b85450] text-white text-sm rounded-full">
                    {seg}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">{requirements.reasoning.segment}</div>
            </div>
          )}

          {/* Additional features */}
          {requirements.reasoning.features.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Ważne funkcje:</div>
              <ul className="space-y-1">
                {requirements.reasoning.features.map((feat, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#b85450] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendations List */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Dopasowane Modele z Naszej Bazy</h2>
          <p className="text-sm text-gray-500 mb-6">
            Poniżej przykładowe modele z naszej bazy danych. Wkrótce dodamy integrację z Otomoto i AutoScout24 dla prawdziwych ofert.
          </p>
        </div>

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
              </div>

              {/* Car Name */}
              <h2 className="text-3xl font-light text-gray-900 mb-2">
                {rec.make} {rec.model}
              </h2>
              <p className="text-gray-500 mb-8">{rec.year}</p>

              {/* Specs Grid */}
              <div className="grid md:grid-cols-3 gap-x-8 gap-y-6 mb-8">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Segment</div>
                  <div className="text-base text-gray-900">{rec.segment}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nadwozie</div>
                  <div className="text-base text-gray-900">{rec.bodyStyle}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Typ Paliwa</div>
                  <div className="text-base text-gray-900">{rec.fuelType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Moc</div>
                  <div className="text-base text-gray-900">{rec.enginePower} KM</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Przyspieszenie 0-100</div>
                  <div className="text-base text-gray-900">
                    {rec.acceleration0to100 !== 'N/A' ? `${rec.acceleration0to100}s` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bagażnik</div>
                  <div className="text-base text-gray-900">
                    {rec.trunkCapacity !== 'N/A' ? `${rec.trunkCapacity}L` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Spalanie (miasto)</div>
                  <div className="text-base text-gray-900">
                    {rec.fuelConsumptionCity !== 'N/A' ? `${rec.fuelConsumptionCity}L` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Skrzynia Biegów</div>
                  <div className="text-base text-gray-900">{rec.transmission}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Napęd</div>
                  <div className="text-base text-gray-900">{rec.driveType}</div>
                </div>
                {rec.towingCapacity !== 'N/A' && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Masa Holownicza</div>
                    <div className="text-base text-gray-900">{rec.towingCapacity}kg</div>
                  </div>
                )}
                {rec.groundClearance !== 'N/A' && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Prześwit</div>
                    <div className="text-base text-gray-900">{rec.groundClearance}mm</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Niezawodność</div>
                  <div className="text-base text-gray-900">{rec.reliabilityRating}/10</div>
                </div>
              </div>

              {/* Pros */}
              {rec.reasonForRecommendation && rec.reasonForRecommendation.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Zalety dla Twoich potrzeb:</h3>
                  <ul className="space-y-2">
                    {rec.reasonForRecommendation.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {rec.warnings && rec.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Uwagi:</h3>
                  <ul className="space-y-1">
                    {rec.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-amber-700">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full hover:border-[#b85450] hover:text-[#b85450] transition-colors font-light"
          >
            Zacznij od nowa
          </button>
        </div>
      </div>

      {/* OFERTY Z OTOMOTO */}
      {offers && offers.length > 0 && (
        <div className="bg-slate-50 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-white rounded-full mb-6">
                <svg className="w-12 h-12 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                Aktualne Oferty na Otomoto
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Znaleźliśmy {offers.length} ofert które pasują do Twoich wymagań. Procent wyświetla jak dobrze auto dopasowuje się do Twoich potrzeb.
              </p>
            </div>

            <div className="space-y-6">
              {offers.map((offer, index) => {
                // Kolory dopasowania
                const matchColor = offer.matchScore >= 85 ? 'bg-green-50 border-green-200' :
                                   offer.matchScore >= 70 ? 'bg-blue-50 border-blue-200' :
                                   offer.matchScore >= 60 ? 'bg-yellow-50 border-yellow-200' :
                                   'bg-red-50 border-red-200';

                const matchBgColor = offer.matchScore >= 85 ? 'bg-green-100 text-green-700' :
                                     offer.matchScore >= 70 ? 'bg-blue-100 text-blue-700' :
                                     offer.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-red-100 text-red-700';

                return (
                  <div key={offer.id} className={`border-2 rounded-2xl p-8 md:p-10 transition-all hover:shadow-md ${matchColor}`}>
                    {/* Header z ocena */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-light text-gray-900">
                          {offer.make} {offer.model}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {offer.year} • {offer.mileage.toLocaleString()} km {offer.location && `• ${offer.location}`}
                        </p>
                      </div>

                      {/* Procent dopasowania */}
                      <div className="text-right">
                        <div className={`px-6 py-3 rounded-full text-center ${matchBgColor} font-semibold text-lg`}>
                          {offer.matchScore}%
                        </div>
                        <p className="text-xs text-gray-500 mt-2">dopasowanie</p>
                      </div>
                    </div>

                    {/* Cena */}
                    <div className="mb-6 p-4 bg-white/60 rounded-xl">
                      <div className="text-3xl font-semibold text-[#b85450] mb-1">
                        {offer.price.toLocaleString()} zł
                      </div>
                      <div className="text-sm text-gray-600">
                        Cena rynkowa na Otomoto
                      </div>
                    </div>

                    {/* Spec Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Paliwo</div>
                        <div className="font-medium text-gray-900">{offer.fuelType}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Moc</div>
                        <div className="font-medium text-gray-900">{offer.enginePower} KM</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Skrzynia</div>
                        <div className="font-medium text-gray-900">{offer.transmission}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Napęd</div>
                        <div className="font-medium text-gray-900">{offer.driveType}</div>
                      </div>
                    </div>

                    {/* Porównanie z wymaganiami */}
                    <div className="mb-6 p-4 bg-white/60 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-3">Porównanie z Twoimi wymaganiami:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className={`text-lg mt-0 ${offer.enginePower >= requirements.minPower ? 'text-green-600' : 'text-red-600'}`}>
                            {offer.enginePower >= requirements.minPower ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            Moc {offer.enginePower} KM 
                            {offer.enginePower >= requirements.minPower 
                              ? ` (wymagane min. ${requirements.minPower} KM)` 
                              : ` (wymagane min. ${requirements.minPower} KM)`}
                          </span>
                        </li>
                        {requirements.awd4x4Needed && (
                          <li className="flex items-start gap-2">
                            <span className={`text-lg mt-0 ${offer.driveType.toLowerCase().includes('suv') || offer.driveType.toLowerCase().includes('4x4') ? 'text-green-600' : 'text-red-600'}`}>
                              {offer.driveType.toLowerCase().includes('suv') || offer.driveType.toLowerCase().includes('4x4') ? '✓' : '✗'}
                            </span>
                            <span className="text-sm text-gray-700">
                              Napęd 4x4/AWD (wymagane)
                            </span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <span className="text-lg text-blue-600">→</span>
                          <span className="text-sm text-gray-700">
                            Szacunkowy roczny koszt eksploatacji: ~{Math.round((offer.enginePower / 100) * 4500)} zł
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Ostrzeżenia */}
                    {offer.warnings && offer.warnings.length > 0 && (
                      <div className="mb-6 p-4 bg-amber-100/50 border border-amber-300 rounded-xl">
                        <h4 className="font-medium text-amber-900 mb-2">Uwagi:</h4>
                        <ul className="space-y-1">
                          {offer.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-amber-800">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Przycisk */}
                    <div className="flex gap-3">
                      {offer.url && (
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-[#b85450] text-white rounded-full hover:bg-[#a04946] transition-colors font-medium text-center"
                        >
                          Przejdź do oferty na Otomoto →
                        </a>
                      )}
                      <button
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-colors font-medium"
                      >
                        Porównaj
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info */}
            <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>ℹ️ Informacja:</strong> Oferty są z Otomoto i aktualizowane w czasie rzeczywistym. 
                Procent dopasowania bierze pod uwagę moc, wiek, przebieg, typ nadwozia i inne wyliczone wymagania. 
                Zalecamy kliknięcie w każdą ofertę aby zobaczyć pełny opis i zdjęcia.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
