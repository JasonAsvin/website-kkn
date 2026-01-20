interface GalleryItem {
  id: number;
  title: string;
  category: string;
}

const Gallery = () => {
  const galleryItems: GalleryItem[] = [
    { id: 1, title: 'Kantor Desa', category: 'Infrastruktur' },
    { id: 2, title: 'Kegiatan Gotong Royong', category: 'Kegiatan' },
    { id: 3, title: 'Pertemuan RT/RW', category: 'Pemerintahan' },
    { id: 4, title: 'Panen Raya', category: 'Pertanian' },
    { id: 5, title: 'Festival Budaya', category: 'Budaya' },
    { id: 6, title: 'Posyandu', category: 'Kesehatan' },
  ];

  const colors = [
    'from-purple-400 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-red-400 to-pink-500',
    'from-indigo-400 to-purple-500',
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Placeholder with gradient */}
              <div
                className={`bg-gradient-to-br ${colors[index]} h-64 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
              >
                <svg
                  className="w-24 h-24 text-white"
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                <div className="w-full p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
