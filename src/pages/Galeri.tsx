import { useEffect } from 'react';
import { useGaleri } from '../services/useGaleri';

const Gallery = () => {
  const { data: galleryItems, loading, error } = useGaleri();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Galeri Foto</h1>
          <p className="text-xl text-gray-600">
            Dokumentasi kegiatan dan potret kehidupan di Kelurahan Baju Bodoa
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error loading gallery: {error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        )}

        {!loading && galleryItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada foto di galeri.</p>
          </div>
        )}

        {!loading && galleryItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.judul}
                  className="h-64 w-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 h-64 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                <div className="w-full p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{item.judul}</h3>
                  {item.deskripsi && <p className="text-sm text-gray-200">{item.deskripsi}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Lihat Semua Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
