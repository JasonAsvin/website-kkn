import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src="/Kabupaten_Maros.png" 
                alt="Logo Kabupaten Maros" 
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  // Fallback jika logo tidak ada
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-white leading-tight">Kelurahan Baju Bodoa</h1>
              <p className="text-sm text-gray-300 leading-tight mt-0.5">Kabupaten Maros</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
              >
                Home
              </button>
              {/* Profil Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap flex items-center gap-2"
                >
                  Profil
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-0 w-48 bg-gray-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => {
                      navigate('/profil-kelurahan');
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
                  >
                    Profil Kelurahan
                  </button>
                  <button
                    onClick={() => {
                      navigate('/struktur-organisasi');
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
                  >
                    Struktur Organisasi
                  </button>
                  <button
                    onClick={() => {
                      navigate('/visi-misi');
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
                  >
                    Visi & Misi
                  </button>
                  <button
                    onClick={() => {
                      navigate('/infografis');
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
                  >
                    Infografis
                  </button>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
              >
                Galeri
              </button>
              <button
                onClick={() => scrollToSection('news')}
                className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
              >
                Berita
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
              >
                Acara
              </button>
              <button
                onClick={() => scrollToSection('umkm')}
                className="text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap"
              >
                UMKM
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700 shadow-lg">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Home
            </button>
            {/* Mobile Profil Dropdown */}
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center justify-between"
              >
                Profil
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="pl-4 space-y-1">
                  <button
                    onClick={() => {
                      navigate('/profil-kelurahan');
                      setIsProfileOpen(false);
                      setIsOpen(false);
                    }}
                    className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-sm w-full text-left"
                  >
                    Profil Kelurahan
                  </button>
                  <button
                    onClick={() => {
                      navigate('/struktur-organisasi');
                      setIsProfileOpen(false);
                      setIsOpen(false);
                    }}
                    className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-sm w-full text-left"
                  >
                    Struktur Organisasi
                  </button>
                  <button
                    onClick={() => {
                      navigate('/visi-misi');
                      setIsProfileOpen(false);
                      setIsOpen(false);
                    }}
                    className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-sm w-full text-left"
                  >
                    Visi & Misi
                  </button>
                  <button
                    onClick={() => {
                      navigate('/infografis');
                      setIsProfileOpen(false);
                      setIsOpen(false);
                    }}
                    className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-sm w-full text-left"
                  >
                    Infografis
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Galeri
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Berita
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Acara
            </button>
            <button
              onClick={() => scrollToSection('umkm')}
              className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              UMKM
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
