import Script from 'next/script'

export function SchemaOrgHome() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://myliitleredcar.pl/#organization',
        name: 'My Little Red Car',
        url: 'https://myliitleredcar.pl',
        sameAs: [
          'https://www.facebook.com/myliitleredcar',
          'https://www.twitter.com/myliitleredcar',
          'https://www.linkedin.com/company/myliitleredcar',
        ],
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'pl-PL',
          '@id': 'https://myliitleredcar.pl/#/schema/logo/image/',
          url: 'https://myliitleredcar.pl/logo.png',
          contentUrl: 'https://myliitleredcar.pl/logo.png',
          width: 500,
          height: 500,
          caption: 'My Little Red Car',
        },
        image: {
          '@id': 'https://myliitleredcar.pl/#/schema/logo/image/',
        },
        description: 'Narzędzie decyzyjne do kupna samochodu - raport, analiza potrzeb, rekomendacje modeli',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+48-123-456-789',
          contactType: 'Customer Support',
          email: 'kontakt@myliitleredcar.pl',
          availableLanguage: ['pl'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://myliitleredcar.pl/#website',
        url: 'https://myliitleredcar.pl',
        name: 'My Little Red Car',
        description: 'Narzędzie decyzyjne do kupna samochodu',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://myliitleredcar.pl/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'pl',
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://myliitleredcar.pl/#localbusiness',
        name: 'My Little Red Car',
        image: 'https://myliitleredcar.pl/logo.png',
        description: 'Raport do kupna samochodu - Analiza potrzeb, rekomendacje modeli, szacowanie kosztów',
        url: 'https://myliitleredcar.pl',
        telephone: '+48-123-456-789',
        email: 'kontakt@myliitleredcar.pl',
        areaServed: 'PL',
        priceRange: '99 zł',
      },
      {
        '@type': 'Product',
        '@id': 'https://myliitleredcar.pl/#product',
        name: 'Raport do kupna samochodu',
        description: 'Spersonalizowany raport zawierający analizę potrzeb, rekomendacje modeli i szacunek kosztów eksploatacji',
        image: 'https://myliitleredcar.pl/logo.png',
        brand: {
          '@type': 'Brand',
          name: 'My Little Red Car',
        },
        offers: {
          '@type': 'Offer',
          url: 'https://myliitleredcar.pl',
          priceCurrency: 'PLN',
          price: '99',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'My Little Red Car',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '1200',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://myliitleredcar.pl/#faqpage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Czy raport jest dostosowany do mojej sytuacji?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tak! Raport jest w 100% spersonalizowany. System zadaje Ci pytania o budżet, sposób użytkowania, priorytety i wiele więcej.',
            },
          },
          {
            '@type': 'Question',
            name: 'Ile czasu zajmuje wygenerowanie raportu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Samo wypełnienie ankiety zajmuje około 15-20 minut. Raport generuje się automatycznie i jest gotowy do przeczytania od razu.',
            },
          },
          {
            '@type': 'Question',
            name: 'Ile kosztuje raport?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Raport Premium kosztuje 99 zł (jednorazowo, na zawsze). To znacznie mniej niż jednorazowe oszczędności.',
            },
          },
        ],
      },
    ],
  }

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      strategy="afterInteractive"
    />
  )
}
