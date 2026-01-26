import { useEffect, useState } from 'react';
import { useGaleri } from '../services/useGaleri';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import type { GalleryItemFromDB } from '../services/useGaleri';

const Gallery = () => {
  const { data: galleryItems, loading, error } = useGaleri();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryItemFromDB | null>(null);
  const itemsPerPage = 9;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = galleryItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20 pb-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Galeri Foto</h1>
          <p className="text-xl text-gray-600">
            Dokumentasi kegiatan dan lingkungan di sekitar Kelurahan Baju Bodoa
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            <p>Gagal memuat galeri: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">Belum ada foto di galeri kelurahan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-video w-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.judul}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia';
                    }}
                  />
                </div>

                {/* Overlay with Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="w-full p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold leading-tight break-words">
                      {item.judul}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Image Lightbox Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          contentClassName="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        >
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt={selectedImage.judul}
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
              />
              <div className="mt-4 text-center text-white w-full">
                <h2 className="text-2xl font-bold">{selectedImage.judul}</h2>
                <div className="flex gap-4 justify-center mt-2 text-sm text-gray-400">
                  <span>{new Date(selectedImage.created_at).toLocaleDateString('id-ID')}</span>
                  <span>•</span>
                  <span>{selectedImage.ukuran_file}</span>
                </div>
              </div>
            </>
          )}
        </Modal>

        {/* Pagination */}
        {!loading && galleryItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;