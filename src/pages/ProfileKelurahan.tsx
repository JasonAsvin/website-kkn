import { useEffect } from 'react';
import { useKontenWeb } from '../services/useKontenWeb';

const ProfileKelurahan = () => {
  const { data: kontenWeb } = useKontenWeb();

  const profilText = kontenWeb?.teks_profil?.trim() || '';
  const profilParagraphs = profilText.split(/\n+/).filter(Boolean);

  const batasWilayah = [
    { label: 'Utara', value: kontenWeb?.batas_utara || '' },
    { label: 'Selatan', value: kontenWeb?.batas_selatan || '' },
    { label: 'Timur', value: kontenWeb?.batas_timur || '' },
    { label: 'Barat', value: kontenWeb?.batas_barat || '' },
  ].filter(item => item.value);

  const dataUmum = [
    { label: 'Luas Wilayah', value: kontenWeb?.luas_wilayah },
    { label: 'Kode Kemendagri', value: kontenWeb?.kode_kemendagri },
    { label: 'Kode BPS', value: kontenWeb?.kode_bps },
    { label: 'Kode Pos', value: kontenWeb?.kode_pos },
  ].filter(item => item.value);

  const geografisText = kontenWeb?.teks_geografis?.trim() || '';

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
          {profilParagraphs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tentang Kelurahan Baju Bodoa</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {profilParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout: Batas Wilayah & Data Umum */}
          {(batasWilayah.length > 0 || dataUmum.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Batas Wilayah */}
              {batasWilayah.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Batas Wilayah</h2>
                  <div className="space-y-1">
                    {batasWilayah.map((item, index, arr) => (
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
              )}

              {/* Data Umum */}
              {dataUmum.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Umum</h2>
                  <div className="space-y-4">
                    {dataUmum.map((item, index) => (
                      <div key={index} className={`flex justify-between items-center py-3 ${index !== dataUmum.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <span className="text-gray-700 font-medium">{item.label}</span>
                        <span className="text-gray-600 font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Letak Geografis - Map Section */}
          {geografisText && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Letak Geografis</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {geografisText}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileKelurahan;
