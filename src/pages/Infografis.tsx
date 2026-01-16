import { useEffect } from 'react';

const Infografis = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Infografis Kelurahan</h1>
          <p className="text-2xl text-blue-600 font-semibold">Kelurahan Baju Bodoa</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Jumlah Penduduk */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">👥</span>
              Jumlah Penduduk
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Penduduk */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Total Penduduk</p>
                <p className="text-5xl font-bold mb-2">XXXX</p>
                <p className="text-blue-100">jiwa</p>
              </div>

              {/* Penduduk Perempuan */}
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Perempuan</p>
                <p className="text-5xl font-bold mb-2">XXXX</p>
                <p className="text-pink-100">jiwa</p>
              </div>

              {/* Penduduk Laki-laki */}
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Laki-laki</p>
                <p className="text-5xl font-bold mb-2">XXXX</p>
                <p className="text-cyan-100">jiwa</p>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="mt-8 p-6 bg-gray-100 rounded-lg flex items-center justify-center min-h-64">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500 font-semibold">Grafik Statistik Penduduk</p>
                <p className="text-gray-400 text-sm">Visualisasi akan ditampilkan segera</p>
              </div>
            </div>
          </div>

          {/* Wilayah Administratif */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">🗂️</span>
              Wilayah Administratif
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RW */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Jumlah RW</p>
                <p className="text-5xl font-bold mb-2">XX</p>
                <p className="text-green-100">Rukun Warga</p>
              </div>

              {/* RT */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Jumlah RT</p>
                <p className="text-5xl font-bold mb-2">XXX</p>
                <p className="text-emerald-100">Rukun Tetangga</p>
              </div>

              {/* Dusun/Lingkungan */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-sm font-semibold opacity-90 mb-2">Jumlah Dusun/Lingkungan</p>
                <p className="text-5xl font-bold mb-2">XX</p>
                <p className="text-teal-100">Dusun</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 p-6 bg-gray-100 rounded-lg flex items-center justify-center min-h-64">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 13V9m0 0L9 5" />
                </svg>
                <p className="text-gray-500 font-semibold">Peta Wilayah Administratif</p>
                <p className="text-gray-400 text-sm">Visualisasi peta akan ditampilkan segera</p>
              </div>
            </div>
          </div>

          {/* Fasilitas Umum */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">🏛️</span>
              Fasilitas Umum
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sekolah */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-4xl mb-3">🏫</p>
                <p className="text-sm font-semibold opacity-90 mb-2">Sekolah</p>
                <p className="text-4xl font-bold mb-2">XX</p>
                <p className="text-yellow-100 text-sm">Gedung</p>
              </div>

              {/* Fasilitas Kesehatan */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-4xl mb-3">🏥</p>
                <p className="text-sm font-semibold opacity-90 mb-2">Fasilitas Kesehatan</p>
                <p className="text-4xl font-bold mb-2">XX</p>
                <p className="text-red-100 text-sm">Gedung</p>
              </div>

              {/* Tempat Ibadah */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-4xl mb-3">🕌</p>
                <p className="text-sm font-semibold opacity-90 mb-2">Tempat Ibadah</p>
                <p className="text-4xl font-bold mb-2">XX</p>
                <p className="text-indigo-100 text-sm">Gedung</p>
              </div>

              {/* Kantor Pelayanan */}
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition">
                <p className="text-4xl mb-3">🏢</p>
                <p className="text-sm font-semibold opacity-90 mb-2">Kantor Pelayanan</p>
                <p className="text-4xl font-bold mb-2">XX</p>
                <p className="text-violet-100 text-sm">Gedung</p>
              </div>
            </div>

            {/* Additional Facilities */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-semibold text-gray-900 mb-2">Fasilitas Lainnya</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Jalan Raya</li>
                  <li>• Sarana Air Bersih</li>
                  <li>• Listrik & Penerangan</li>
                  <li>• Telekomunikasi</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-semibold text-gray-900 mb-2">Infrastruktur Publik</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Pasar/Pusat Perdagangan</li>
                  <li>• Ruang Publik</li>
                  <li>• Sarana Olahraga</li>
                  <li>• Taman/Ruang Hijau</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
            <p className="text-center text-gray-700">
              <span className="font-semibold">Catatan:</span> Data infografis merupakan data terkini dan akan diperbarui secara berkala sesuai dengan perkembangan kelurahan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infografis;
