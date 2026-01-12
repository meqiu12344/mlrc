import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormProvider } from "./context/FormContext";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Little Red Car - Kupno samochodu bez stresu",
  description: "Narzędzie decyzyjne, które pomaga uporządkować myśli przed zakupem samochodu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
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

