'use client';

import { Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <img 
              src="/logo.png" 
              alt="MLRC Logo" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm font-light text-gray-500">
              Profesjonalne raporty do wyborów samochodu
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">Produkt</h4>
            <ul className="space-y-3">
              <li><a href="#jak-dziala" className="hover:text-white transition-colors font-light">Jak to działa</a></li>
              <li><a href="#cechy" className="hover:text-white transition-colors font-light">Cechy</a></li>
              <li><a href="#cennik" className="hover:text-white transition-colors font-light">Cennik</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Bezpieczeństwo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">Firma</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors font-light">O nas</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Kariera</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Kontakt</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">Prawo</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors font-light">Polityka prywatności</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Warunki użytkowania</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Polityka plików cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Copyright */}
            <p className="text-sm text-gray-500 font-light">
              © {currentYear} My Little Red Car. Wszystkie prawa zastrzeżone.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
