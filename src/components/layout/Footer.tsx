import { Link } from 'react-router-dom';
import { useGaleri } from '../../services/useGaleri';
import type { GalleryItemFromDB } from '../../services/useGaleri';

const Footer = () => {
  const { data: galleryItems, loading: galleryLoading, error: galleryError } = useGaleri();
  const previewItems = (galleryItems || []).slice(0, 3);
  
  // Create loading placeholders with proper type
  const loadingPlaceholders: (GalleryItemFromDB | null)[] = [null, null, null];

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
          </div>

          {/* Center Section - Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              KANTOR TERKAIT
            </h3>
            <div className="space-y-4 text-sm text-gray-200">
              <p className="leading-relaxed">
                Kantor Kelurahan Baju Bodoa di Jl. Taqdir No. 118 Maros, Lingkungan Kassi Kebo, Kec. Maros, Kab. Maros, Sulawesi Selatan 90511
              </p>
            </div>
          </div>

          {/* Right Section - Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                ALBUM GALERI
              </h3>
              <Link to="/galeri" className="text-sm font-semibold text-white hover:text-emerald-200 transition">
                Lihat semua →
              </Link>
            </div>
            <p className="text-gray-200 text-sm mb-4">Tiga unggahan terbaru dari halaman galeri.</p>

            {galleryError && (
              <div className="text-sm text-red-100 bg-red-700/40 border border-red-500/40 rounded px-3 py-2 mb-3">
                Galeri tidak dapat dimuat.
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {(galleryLoading ? loadingPlaceholders : previewItems).map((item, index) => (
                <Link
                  key={item?.id ?? `placeholder-${index}`}
                  to="/galeri"
                  className="group aspect-square bg-gray-600 rounded-lg overflow-hidden hover:opacity-90 transition relative"
                >
                  {item ? (
                    <>
                      <img
                        src={item.url}
                        alt={item.judul}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Gambar';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center px-2 text-center text-xs font-semibold">
                        {item.judul}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full animate-pulse bg-gray-500/60" />
                  )}
                </Link>
              ))}
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
