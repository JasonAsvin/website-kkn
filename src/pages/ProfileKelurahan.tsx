import { useEffect } from 'react';

const ProfileKelurahan = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Kelurahan</h1>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Tentang Kelurahan Baju Bodoa */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tentang Kelurahan Baju Bodoa</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Baju Bodoa adalah nama sebuah kelurahan yang berada di wilayah Kecamatan Maros Baru, Kabupaten Maros, Provinsi Sulawesi Selatan, Indonesia dan mayoritas berpenduduk Suku Makassar.
              </p>
              <p>
                Adat dan budaya di Kelurahan Baju Bodoa sangat dipengaruhi oleh tradisi turun-temurun dari Kerajaan Marusu.
                Eksistensi kerajaan ini masih ada hingga saat ini dan bertempat di Istana Balla Lompoa Karaeng Marusu. Salah satu tradisi yang selalu dilakukan setiap tahun adalah Katto Bokko.
                Katto Bokko merupakan upacara adat budaya tahunan Kerajaan Marusu yang melibatkan komponen masyarakat dan dilakukan sebelum melakukan panen raya.
              </p>
            </div>
          </div>

          {/* Two Column Layout: Batas Wilayah & Data Umum */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batas Wilayah */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Batas Wilayah</h2>
              <div className="space-y-1">
                {[
                  { label: "Utara", value: "Kelurahan Allepolea (Kecamatan Lau)" },
                  { label: "Selatan", value: "Kelurahan Pallantikang dan Sungai Maros" },
                  { label: "Timur", value: "Kelurahan Baji Pamai" },
                  { label: "Barat", value: "Kelurahan Alliritengae dan Kelurahan Turikale (Kecamatan Turikale)" },
                ].map((item, index, arr) => (
                  <div 
                    key={index} 
                    className={`grid grid-cols-3 py-4 ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <span className="text-gray-700 font-semibold col-span-1">{item.label}</span>
                    <span className="text-gray-600 col-span-2 text-right lg:text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Umum */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Umum</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Luas Wilayah</span>
                  <span className="text-gray-600 font-semibold">3,76 km²</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">Kode Kemendagri</span>
                  <span className="text-gray-600 font-semibold">73.09.04.1003</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">Kode BPS</span>
                  <span className="text-gray-600 font-semibold">7308020013</span>
                </div>                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">Kode Pos</span>
                  <span className="text-gray-600 font-semibold">90515</span>
                </div>
              </div>
            </div>
          </div>

          {/* Letak Geografis - Map Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Letak Geografis</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Kelurahan Baju Bodoa berstatus sebagai kelurahan definitif dan tergolong pula sebagai kelurahan swasembada.
              Kelurahan Baju Bodoa memiliki luas wilayah 3,76 km² dan terletak pada wilayah dataran rendah dengan ketinggian 0-10 mdpl.
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
        </div>
      </div>
    </div>
  );
};

export default ProfileKelurahan;
