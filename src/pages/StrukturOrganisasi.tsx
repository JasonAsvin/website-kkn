import { useEffect } from 'react';

const OrgStructure = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi</h1>
          <p className="text-xl text-gray-600">Kelurahan Baju Bodoa</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Org Chart */}
          <div className="flex flex-col items-center space-y-8">
            {/* Lurah */}
            <div className="w-full">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-8 py-4 shadow-md text-center">
                  <p className="text-sm font-semibold opacity-90">KEPALA KELURAHAN</p>
                  <p className="text-lg font-bold">Lurah</p>
                </div>
              </div>
              {/* Connector */}
              <div className="flex justify-center mt-4">
                <div className="w-1 h-8 bg-gray-400"></div>
              </div>
            </div>

            {/* Second Level */}
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sekertaris */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-gray-400"></div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-6 py-3 shadow-md text-center w-full">
                    <p className="text-sm font-semibold opacity-90">SEKRETARIS</p>
                    <p className="font-bold">Sekretaris</p>
                  </div>
                </div>

                {/* Kaur Pemerintahan */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-gray-400"></div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg px-6 py-3 shadow-md text-center w-full">
                    <p className="text-sm font-semibold opacity-90">KEPALA URUSAN</p>
                    <p className="font-bold">Pemerintahan</p>
                  </div>
                </div>

                {/* Kaur Pembangunan */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-gray-400"></div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg px-6 py-3 shadow-md text-center w-full">
                    <p className="text-sm font-semibold opacity-90">KEPALA URUSAN</p>
                    <p className="font-bold">Pembangunan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="w-full mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-gray-700 text-center">
                <span className="font-semibold">Catatan:</span> Struktur organisasi lengkap dengan data pegawai akan segera ditampilkan.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fungsi Organisasi</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">•</span>
                <span>Menjalankan fungsi pemerintahan kelurahan</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">•</span>
                <span>Melayani kebutuhan masyarakat</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">•</span>
                <span>Mengelola pembangunan kelurahan</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">•</span>
                <span>Membina organisasi kemasyarakatan</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tugas Pokok</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3">•</span>
                <span>Penyelenggaraan pemerintahan</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3">•</span>
                <span>Pemberdayaan masyarakat</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3">•</span>
                <span>Pembangunan infrastruktur</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3">•</span>
                <span>Layanan administrasi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgStructure;
