import { useEffect } from 'react';

const VisionMission = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visi & Misi</h1>
          <p className="text-xl text-gray-600">Kelurahan Baju Bodoa</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Visi */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 className="text-3xl font-bold">Visi</h2>
            </div>
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed text-center font-semibold">
                  Terwujudnya Kelurahan Baju Bodoa yang maju, aman, sejahtera, dan berdikari 
                  dalam meningkatkan kualitas hidup masyarakat
                </p>
              </div>
              
              {/* Visi Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Aspek Pembangunan</p>
                  <p className="text-gray-700">Peningkatan infrastruktur dan fasilitas dasar yang berkelanjutan</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Aspek Sosial</p>
                  <p className="text-gray-700">Terwujudnya masyarakat yang beriman, sehat, dan sejahtera</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Aspek Ekonomi</p>
                  <p className="text-gray-700">Berkembangnya ekonomi lokal dan pemberdayaan UMKM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <h2 className="text-3xl font-bold">Misi</h2>
            </div>
            <div className="p-8">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Meningkatkan Pelayanan Pemerintah</p>
                    <p className="text-gray-700">
                      Memberikan pelayanan yang responsif, transparan, dan akuntabel kepada masyarakat
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Meningkatkan Kualitas Pendidikan</p>
                    <p className="text-gray-700">
                      Mendukung akses pendidikan yang berkualitas dan merata untuk seluruh masyarakat
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Meningkatkan Kesehatan Masyarakat</p>
                    <p className="text-gray-700">
                      Menjamin akses kesehatan yang terjangkau dan layanan kesehatan berkualitas
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    4
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Mengembangkan Ekonomi Lokal</p>
                    <p className="text-gray-700">
                      Memberdayakan UMKM dan mendorong pertumbuhan ekonomi berkelanjutan
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    5
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Memperkuat Keamanan & Ketertiban</p>
                    <p className="text-gray-700">
                      Mewujudkan lingkungan yang aman, nyaman, dan tertib bagi seluruh masyarakat
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
                    6
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Menjaga Lingkungan & Keberlanjutan</p>
                    <p className="text-gray-700">
                      Melestarikan lingkungan dan pembangunan berkelanjutan untuk generasi mendatang
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Nilai-Nilai Organisasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-semibold text-gray-900">Integritas</p>
                  <p className="text-gray-600 text-sm">Jujur dan konsisten dalam setiap tindakan</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900">Fokus pada Pelayanan</p>
                  <p className="text-gray-600 text-sm">Mengutamakan kepuasan dan kesejahteraan masyarakat</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-semibold text-gray-900">Inovasi</p>
                  <p className="text-gray-600 text-sm">Selalu mencari cara baru untuk meningkatkan kinerja</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <span className="text-2xl">🤲</span>
                <div>
                  <p className="font-semibold text-gray-900">Akuntabilitas</p>
                  <p className="text-gray-600 text-sm">Bertanggung jawab atas setiap keputusan dan tindakan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
