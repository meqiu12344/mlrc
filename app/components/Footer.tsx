'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#b85450] flex items-center justify-center">
                <span className="text-white font-bold text-sm">🚗</span>
              </div>
              <span className="text-lg font-semibold text-white">My Little Red Car</span>
            </div>
            <p className="text-sm font-light text-gray-500">
              Narzędzie decyzyjne dla świadomych kupujących samochodów
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
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">Kompania</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors font-light">O nas</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Kariera</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Kontakt</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">Inne</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors font-light">Polityka prywatności</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Warunki użytkowania</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-light">Ciasteczka</a></li>
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-3.93 9.96 9.96 0 01-2.83.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.002 1.413-.103.249-.129.597-.129.946v5.446h-3.554s.05-8.836 0-9.759h3.554v1.381c.43-.664 1.195-1.61 2.902-1.61 2.12 0 3.709 1.384 3.709 4.362v5.626zM5.337 9.433c-1.144 0-1.915-.761-1.915-1.714 0-.957.77-1.715 1.959-1.715 1.188 0 1.914.758 1.939 1.715 0 .953-.751 1.714-1.983 1.714zm1.946 11.019H3.39V9.694h3.893v10.758zM22.224 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.224 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
