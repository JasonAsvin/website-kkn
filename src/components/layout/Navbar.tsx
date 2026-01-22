import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (active: boolean, solid: boolean) => {
    const textColor = solid ? 'text-gray-800' : 'text-white';
    const hoverBg = solid ? 'hover:bg-gray-100' : 'hover:bg-gray-600';
    const underline = active ? 'underline decoration-2 underline-offset-8' : '';
    return `px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${textColor} ${hoverBg} ${underline}`.trim();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`shadow-lg fixed w-full top-0 z-50 transition-all duration-300 ${
      isHomepage
        ? isScrolled 
          ? 'bg-white text-gray-800'
          : 'bg-transparent text-white'
        : 'bg-white text-gray-800'
    }`}>
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
              <h1 className={`text-xl font-bold leading-tight ${isHomepage && !isScrolled ? 'text-white' : 'text-gray-800'}`}>Kelurahan Baju Bodoa</h1>
              <p className={`text-sm leading-tight mt-0.5 ${isHomepage && !isScrolled ? 'text-gray-300' : 'text-gray-600'}`}>Kabupaten Maros</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-8">
              <button
                onClick={() => {
                  navigate('/');
                  scrollToSection('home');
                }}
                className={`${
                  isHomepage && !isScrolled
                    ? linkClass(isActive('/'), false)
                    : linkClass(isActive('/'), true)
                }`}
              >
                Beranda
              </button>
              {/* Profil Dropdown */}
              <div className="relative group">
                <button
                  className={`${
                    isHomepage && !isScrolled
                      ? linkClass(isActive('/profil-kelurahan') || isActive('/pemerintahan'), false)
                      : linkClass(isActive('/profil-kelurahan') || isActive('/pemerintahan'), true)
                  } flex items-center gap-2`}
                >
                  Profil
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className={`absolute left-0 mt-0 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                  isHomepage && !isScrolled ? 'bg-gray-600' : 'bg-white border border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      navigate('/profil-kelurahan');
                      setIsProfileOpen(false);
                    }}
                    className={`block w-full text-left ${
                      isHomepage && !isScrolled
                        ? linkClass(isActive('/profil-kelurahan'), false)
                        : linkClass(isActive('/profil-kelurahan'), true)
                    }`}
                  >
                    Profil Kelurahan
                  </button>
                  <button
                    onClick={() => {
                      navigate('/pemerintahan');
                      setIsProfileOpen(false);
                    }}
                    className={`block w-full text-left ${
                      isHomepage && !isScrolled
                        ? linkClass(isActive('/pemerintahan'), false)
                        : linkClass(isActive('/pemerintahan'), true)
                    }`}
                  >
                    Pemerintahan
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate('/infografis')}
                className={`${
                  isHomepage && !isScrolled
                    ? linkClass(isActive('/infografis'), false)
                    : linkClass(isActive('/infografis'), true)
                }`}
              >
                Infografis
              </button>
              <button
                onClick={() => navigate('/galeri')}
                className={`${
                  isHomepage && !isScrolled
                    ? linkClass(isActive('/galeri'), false)
                    : linkClass(isActive('/galeri'), true)
                }`}
              >
                Galeri
              </button>
              <button
                onClick={() => navigate('/berita')}
                className={`${
                  isHomepage && !isScrolled
                    ? linkClass(isActive('/berita'), false)
                    : linkClass(isActive('/berita'), true)
                }`}
              >
                Berita
              </button>
              <button
                onClick={() => navigate('/umkm')}
                className={`${
                  isHomepage && !isScrolled
                    ? linkClass(isActive('/umkm'), false)
                    : linkClass(isActive('/umkm'), true)
                }`}
              >
                UMKM
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition focus:outline-none ${
                isHomepage && !isScrolled
                  ? 'text-white hover:bg-gray-600'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
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
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg ${
            isHomepage && !isScrolled ? 'bg-gray-700' : 'bg-white border-t border-gray-200'
          }`}>
            <button
                  onClick={() => {
                    navigate('/');
                    setIsOpen(false);
                    scrollToSection('home');
                  }}
                  className={`block w-full text-left ${
                    isHomepage && !isScrolled
                      ? linkClass(isActive('/'), false)
                      : linkClass(isActive('/'), true)
                  }`}
            >
              Home
            </button>
            {/* Mobile Profil Dropdown */}
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center justify-between ${
                      isHomepage && !isScrolled
                        ? 'text-white hover:bg-gray-600'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}
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
                    className={`block px-3 py-2 rounded-md text-sm w-full text-left ${
                      isHomepage && !isScrolled
                        ? linkClass(isActive('/profil-kelurahan'), false)
                        : linkClass(isActive('/profil-kelurahan'), true)
                    }`}
                  >
                    Profil Kelurahan
                  </button>
                  <button
                    onClick={() => {
                      navigate('/pemerintahan');
                      setIsProfileOpen(false);
                      setIsOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-sm w-full text-left ${
                      isHomepage && !isScrolled
                        ? linkClass(isActive('/pemerintahan'), false)
                        : linkClass(isActive('/pemerintahan'), true)
                    }`}
                  >
                    Pemerintahan
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                navigate('/infografis');
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                isHomepage && !isScrolled
                  ? linkClass(isActive('/infografis'), false)
                  : linkClass(isActive('/infografis'), true)
              }`}
            >
              Infografis
            </button>
            <button
              onClick={() => {
                navigate('/galeri');
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                isHomepage && !isScrolled
                  ? linkClass(isActive('/galeri'), false)
                  : linkClass(isActive('/galeri'), true)
              }`}
            >
              Galeri
            </button>
            <button
              onClick={() => {
                navigate('/berita');
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                isHomepage && !isScrolled
                  ? linkClass(isActive('/berita'), false)
                  : linkClass(isActive('/berita'), true)
              }`}
            >
              Berita
            </button>
            <button
              onClick={() => {
                navigate('/umkm');
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                isHomepage && !isScrolled
                  ? linkClass(isActive('/umkm'), false)
                  : linkClass(isActive('/umkm'), true)
              }`}
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
