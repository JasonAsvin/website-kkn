interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
}

const News = () => {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Pembukaan Program Bantuan Sosial untuk Warga Desa',
      date: '25 Desember 2025',
      excerpt:
        'Pemerintah desa membuka program bantuan sosial bagi warga yang membutuhkan. Program ini mencakup bantuan sembako dan modal usaha.',
      category: 'Sosial',
    },
    {
      id: 2,
      title: 'Musyawarah Desa Tahun 2026',
      date: '20 Desember 2025',
      excerpt:
        'Musyawarah desa telah dilaksanakan dengan agenda pembahasan program kerja dan anggaran tahun 2026.',
      category: 'Pemerintahan',
    },
    {
      id: 3,
      title: 'Perbaikan Jalan Desa Selesai Dilaksanakan',
      date: '15 Desember 2025',
      excerpt:
        'Proyek perbaikan jalan sepanjang 2 km telah selesai dan dapat digunakan oleh warga untuk aktivitas sehari-hari.',
      category: 'Infrastruktur',
    },
    {
      id: 4,
      title: 'Pelatihan UMKM untuk Meningkatkan Ekonomi Desa',
      date: '10 Desember 2025',
      excerpt:
        'Diadakan pelatihan pembuatan produk olahan pangan dan pemasaran digital bagi pelaku UMKM di desa.',
      category: 'Ekonomi',
    },
    {
      id: 5,
      title: 'Gotong Royong Bersih Desa',
      date: '5 Desember 2025',
      excerpt:
        'Kegiatan gotong royong rutin bulanan dilaksanakan dengan partisipasi aktif dari seluruh warga desa.',
      category: 'Lingkungan',
    },
    {
      id: 6,
      title: 'Festival Budaya Desa Makmur 2025',
      date: '1 Desember 2025',
      excerpt:
        'Festival budaya tahunan menampilkan kesenian tradisional dan produk lokal dari desa untuk memperkenalkan potensi desa.',
      category: 'Budaya',
    },
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Berita & Pengumuman
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan dan perkembangan Desa Makmur
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-green-400 to-blue-500 h-48 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-500">{news.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{news.excerpt}</p>
                <button className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition">
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Lihat Semua Berita
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
