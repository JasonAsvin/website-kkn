import { useEffect } from 'react';

const ProfileKelurahan = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profil Kelurahan</h1>
          <p className="text-xl text-gray-600">Kelurahan Baju Bodoa</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Nama Kelurahan */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nama Kelurahan</h2>
            <p className="text-lg text-gray-700">Kelurahan Baju Bodoa</p>
          </div>

          {/* Wilayah Administratif */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wilayah Administratif</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold">Kecamatan:</span>
                <span>Maros</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold">Kabupaten/Kota:</span>
                <span>Kabupaten Maros</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Provinsi:</span>
                <span>Sulawesi Selatan</span>
              </div>
            </div>
          </div>

          {/* Letak Geografis */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Letak Geografis</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Kelurahan Baju Bodoa terletak di Kecamatan Maros, Kabupaten Maros, Provinsi Sulawesi Selatan. 
              Kelurahan ini berada di daerah yang strategis dengan akses mudah menuju pusat kota Maros dan 
              dilintasi oleh jalur transportasi utama.
            </p>
            
            {/* Map Embed */}
            <div className="w-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm">
              <iframe
                title="Peta Kelurahan Baju Bodoa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31797.379451550296!2d119.53465975505098!3d-4.993970078864467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbef8873c40682f%3A0x69621cc180440e79!2sBaju%20Bodoa%2C%20Maros%20Baru%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1768382980005!5m2!1sen!2sid"
                width="100%"
                height="450"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Luas Wilayah */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Luas Wilayah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                <p className="text-gray-600 font-semibold mb-2">Total Luas Wilayah</p>
                <p className="text-4xl font-bold text-orange-600">XX km²</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <p className="text-gray-600 font-semibold mb-2">Ketinggian Rata-rata</p>
                <p className="text-4xl font-bold text-blue-600">XX m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileKelurahan;
