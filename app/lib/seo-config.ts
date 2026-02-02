// SEO Configuration for My Little Red Car
export const seoConfig = {
  siteName: "My Little Red Car",
  baseUrl: "https://myliitleredcar.pl",
  description:
    "Raport decyzyjny do kupna samochodu - Analiza potrzeb, rekomendacje modeli, szacowanie kosztów. Ponad 50 000 zadowolonych kupujących.",
  keywords: [
    "raport kupna samochodu",
    "kalkulator samochodu",
    "porównanie samochodów",
    "jak wybrać samochód",
    "analiza potrzeb",
    "rekomendacje aut",
    "wybór samochodu",
    "narzędzie do wyboru samochodu",
    "guide kupna samochodu",
  ],
  defaultImage: "https://myliitleredcar.pl/og-image.jpg",
  twitterHandle: "@myliitleredcar",
  locale: "pl_PL",
  countryCode: "PL",

  pages: {
    home: {
      title: "My Little Red Car - Raport do kupna samochodu | Narzędzie decyzyjne",
      description:
        "Raport decyzyjny do kupna samochodu - Analiza potrzeb, rekomendacje modeli, szacowanie kosztów. Ponad 50 000 zadowolonych kupujących. Zacznij bezpłatnie!",
      keywords: [
        "raport kupna samochodu",
        "narzędzie wyboru samochodu",
        "jak wybrać samochód",
        "analiza potrzeb samochodowych",
      ],
    },
    wizard: {
      title: "Zacznij pracować nad raportem - My Little Red Car",
      description:
        "Odpowiedz na proste pytania i otrzymaj spersonalizowany raport do kupna samochodu. Proces trwa 15-20 minut.",
      keywords: [
        "ankieta samochodowa",
        "quiz wyboru samochodu",
        "generator raportu",
      ],
    },
    profile: {
      title: "Mój profil - My Little Red Car",
      description: "Zarządzaj swoimi zapisanymi raportami i profilami.",
      keywords: ["profil użytkownika", "moje raporty"],
    },
    results: {
      title: "Wyniki analizy - My Little Red Car",
      description:
        "Twój spersonalizowany raport z rekomendacjami i analizą kosztów.",
      keywords: ["wyniki analizy", "rekomendacje samochodów", "koszty"],
    },
  },

  social: {
    facebook: "https://www.facebook.com/myliitleredcar",
    twitter: "https://www.twitter.com/myliitleredcar",
    linkedin: "https://www.linkedin.com/company/myliitleredcar",
  },

  contact: {
    email: "kontakt@myliitleredcar.pl",
    phone: "+48-123-456-789",
  },
};

export const generateMetaTags = (
  page: keyof typeof seoConfig.pages,
  overrides?: { title?: string; description?: string; image?: string }
) => {
  const pageConfig = seoConfig.pages[page];

  return {
    title: overrides?.title || pageConfig.title,
    description: overrides?.description || pageConfig.description,
    keywords: pageConfig.keywords?.join(", "),
    openGraph: {
      title: overrides?.title || pageConfig.title,
      description: overrides?.description || pageConfig.description,
      image: overrides?.image || seoConfig.defaultImage,
      type: "website",
      locale: seoConfig.locale,
      siteName: seoConfig.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: overrides?.title || pageConfig.title,
      description: overrides?.description || pageConfig.description,
      image: overrides?.image || seoConfig.defaultImage,
      creator: seoConfig.twitterHandle,
    },
  };
};
