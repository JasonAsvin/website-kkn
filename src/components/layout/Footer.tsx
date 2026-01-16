const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-800 to-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Section - About & Social */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <img 
                  src="/logo-desa.png" 
                  alt="Logo Desa" 
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold uppercase">Kelurahan Baju Bodoa</h3>
            </div>
            <p className="text-gray-200 text-sm mb-6 leading-relaxed">
              Website Resmi Pemerintah Kelurahan Baju Bodoa, Kecamatan Maros, Kabupaten Maros
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-teal-800 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-teal-800 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-teal-800 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Center Section - Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              HUBUNGI KAMI
            </h3>
            <div className="space-y-4 text-sm text-gray-200">
              <p className="leading-relaxed">
                Bulo Wattang, Kec. Panca Rijang, Kabupaten Sidenreng Rappang, Sulawesi Selatan 91651, Desa Bulo Wattang, Kecamatan Panca Rijang, Kabupaten Sidenreng Rappang, Provinsi Sulawesi Selatan, Indonesia, 91651.
              </p>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email: pemdesbulowattang@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Right Section - Gallery */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ALBUM GALERI
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop" 
                  alt="Gallery 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop" 
                  alt="Gallery 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop" 
                  alt="Gallery 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-600 mt-10 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Kelurahan Baju Bodoa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
