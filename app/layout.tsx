import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { FormProvider } from "./context/FormContext";
import { AuthProvider } from "./context/AuthContext";
import { SchemaOrgHome } from "./lib/schema-org";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Little Red Car - Raport do kupna samochodu | Narzędzie decyzyjne",
  description: "Raport decyzyjny do kupna samochodu - Analiza potrzeb, rekomendacje modeli, szacowanie kosztów. Ponad 50 000 zadowolonych kupujących. Zacznij bezpłatnie!",
  keywords: "raport kupna samochodu, kalkulator samochodu, porównanie samochodów, jak wybrać samochód, analiza potrzeb, rekomendacje aut, wybór samochodu",
  authors: [{ name: "My Little Red Car" }],
  creator: "My Little Red Car",
  publisher: "My Little Red Car",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://myliitleredcar.pl",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://myliitleredcar.pl",
    siteName: "My Little Red Car",
    title: "My Little Red Car - Raport do kupna samochodu",
    description: "Narzędzie decyzyjne które pomaga wybrać idealny samochód. Ponad 50 000 zadowolonych kupujących. Zaznaj średnio 12 000 zł.",
    images: [
      {
        url: "https://myliitleredcar.pl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Little Red Car - Narzędzie do wyboru samochodu",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Little Red Car - Raport do kupna samochodu",
    description: "Narzędzie decyzyjne które pomaga wybrać idealny samochód",
    images: ["https://myliitleredcar.pl/og-image.jpg"],
    creator: "@myliitleredcar",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#b85450" />
        <meta name="msapplication-TileColor" content="#b85450" />
        <SchemaOrgHome />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <FormProvider>
            {children}
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

