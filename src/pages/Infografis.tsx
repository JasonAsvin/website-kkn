import { useEffect, useState } from 'react';
import { usePopulationByLingkungan } from '../services/usePopulationByLingkungan';
import { useWilayahAdministratif } from '../services/useWilayahAdministratif';
import { useFasilitas } from '../services/useFasilitas';
import { categorizeSchools } from '../services/categorizeSchools';
import { supabase } from '../services/supabase';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Accordion } from '../components/common/Accordion';

const Infografis = () => {
  // Custom hooks for data fetching
  const { data: populationByLingkungan, loading: loadingByLingkungan, error: errorByLingkungan } = usePopulationByLingkungan();
  const { wilayahTotal, rtList, loading: loadingWilayah, error: wilayahError } = useWilayahAdministratif();
  const { data: fasilitasData, loading: loadingFasilitas, error: fasilitasError } = useFasilitas();

  const wilayahImageUrl = supabase?.storage
    .from('galeri_foto')
    .getPublicUrl('pemerintahan/Pembagian_Wilayah.png').data.publicUrl 
    ? `${supabase.storage.from('galeri_foto').getPublicUrl('pemerintahan/Pembagian_Wilayah.png').data.publicUrl}?t=${new Date().getTime()}`
    : '';

  // Calculate totals from populationByLingkungan
  const totals = populationByLingkungan?.reduce((acc, curr) => ({
    total: acc.total + (curr.jumlah_penduduk || 0),
    male: acc.male + (curr.penduduk_lakilaki || 0),
    female: acc.female + (curr.penduduk_perempuan || 0)
  }), { total: 0, male: 0, female: 0 }) || { total: 0, male: 0, female: 0 };

  // Toggle state for collapsible sections
  const [expandRt, setExpandRt] = useState(false);
  const [expandSekolah, setExpandSekolah] = useState(false);
  const [expandKesehatam, setExpandKesehatam] = useState(false);
  const [expandIbadah, setExpandIbadah] = useState(false);
  const [expandKantor, setExpandKantor] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  useEffect(() => {
    if (showMapModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMapModal]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Infografis Kelurahan</h1>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Jumlah Penduduk */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Jumlah Penduduk
            </h2>
            
            {errorByLingkungan && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading data: {errorByLingkungan}</p>
              </div>
            )}

            {loadingByLingkungan ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Penduduk */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Total Penduduk</p>
                  <p className="text-5xl font-bold mb-2">
                    {totals.total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-blue-100">jiwa</p>
                </div>

                {/* Penduduk Laki-laki */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Laki-laki</p>
                  <p className="text-5xl font-bold mb-2">
                    {totals.male.toLocaleString('id-ID')}
                  </p>
                  <p className="text-cyan-100">jiwa</p>
                </div>
                
                {/* Penduduk Perempuan */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Perempuan</p>
                  <p className="text-5xl font-bold mb-2">
                    {totals.female.toLocaleString('id-ID')}
                  </p>
                  <p className="text-pink-100">jiwa</p>
                </div>
              </div>
            )}
            
            {/* Penduduk Per Lingkungan */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Jumlah Penduduk Per Lingkungan</h3>

              {errorByLingkungan && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p>Error loading data: {errorByLingkungan}</p>
                </div>
              )}

              {loadingByLingkungan ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading data per lingkungan...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(populationByLingkungan || []).length > 0 ? (
                    populationByLingkungan.map((lingkungan) => (
                      <div key={lingkungan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">{lingkungan.nama_lingkungan}</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Total Penduduk</span>
                            <span className="font-bold text-emerald-600 text-lg">
                              {lingkungan.jumlah_penduduk.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="text-blue-500">♂</span> Laki-laki
                            </span>
                            <span className="font-semibold text-blue-600">
                              {lingkungan.penduduk_lakilaki.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="text-pink-500">♀</span> Perempuan
                            </span>
                            <span className="font-semibold text-pink-600">
                              {lingkungan.penduduk_perempuan.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Progress bars */}
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 mb-2">Komposisi Gender</div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{
                                      width: `${(lingkungan.penduduk_lakilaki / lingkungan.jumlah_penduduk) * 100}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {((lingkungan.penduduk_lakilaki / lingkungan.jumlah_penduduk) * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div className="flex-1">
                                <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-pink-500"
                                    style={{
                                      width: `${(lingkungan.penduduk_perempuan / lingkungan.jumlah_penduduk) * 100}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {((lingkungan.penduduk_perempuan / lingkungan.jumlah_penduduk) * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Tidak ada data penduduk per lingkungan.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Wilayah Administratif */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Wilayah Administratif
            </h2>

            {wilayahError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading wilayah data: {wilayahError}</p>
              </div>
            )}

            {loadingWilayah ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading wilayah data...</p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Struktur Wilayah */}
                <Accordion
                  title="Struktur Wilayah"
                  icon="🏘️"
                  isExpanded={expandRt}
                  onToggle={() => setExpandRt(!expandRt)}
                  color="emerald"
                >
                      {rtList.length > 0 ? (
                        <div className="space-y-6">
                          {Array.from(new Set(rtList.map(item => item.nama_lingkungan)))
                            .sort((a, b) => {
                              const preferred = ['Kassikebo', 'Betang', 'Masembo'];
                              const ia = preferred.indexOf(a);
                              const ib = preferred.indexOf(b);
                              if (ia !== -1 && ib !== -1) return ia - ib;
                              if (ia !== -1) return -1;
                              if (ib !== -1) return 1;
                              return a.localeCompare(b);
                            })
                            .map((lingkungan) => {
                              const lingkunganRts = rtList
                                .filter(item => item.nama_lingkungan === lingkungan)
                                .sort((a, b) => {
                                  const rwA = parseInt(a.nama_rw.match(/\d+/)?.[0] || '0');
                                  const rwB = parseInt(b.nama_rw.match(/\d+/)?.[0] || '0');
                                  const rtA = parseInt(a.nama_rt.match(/\d+/)?.[0] || '0');
                                  const rtB = parseInt(b.nama_rt.match(/\d+/)?.[0] || '0');
                                  return rwA !== rwB ? rwA - rwB : rtA - rtB;
                                });

                              return (
                                <div key={lingkungan} className="border border-gray-300 rounded-lg overflow-hidden">
                                  {/* Tab Header */}
                                  <div className="bg-emerald-100 px-4 py-3 border-b border-gray-300">
                                    <p className="font-semibold text-emerald-900">Lingkungan {lingkungan}</p>
                                  </div>

                                  {/* Table */}
                                  <div className="w-full overflow-x-auto overflow-y-hidden border-t border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                      <thead>
                                        <tr className="bg-emerald-50 border-b border-gray-300">
                                          <th className="px-4 py-2 text-left font-semibold text-gray-700 w-1/2">Ketua RT</th>
                                          <th className="px-4 py-2 text-center font-semibold text-gray-700 w-1/4">RT</th>
                                          <th className="px-4 py-2 text-center font-semibold text-gray-700 w-1/4">RW</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {lingkunganRts.map((item) => (
                                          <tr key={item.id || item.nama_rt} className="border-b border-gray-200 hover:bg-emerald-50 transition">
                                            <td className="px-4 py-2 text-gray-700 font-medium w-1/2">{item.nama_ketua}</td>
                                            <td className="px-4 py-2 text-gray-700 w-1/4 text-center">{item.nama_rt}</td>
                                            <td className="px-4 py-2 text-gray-700 w-1/4 text-center">{item.nama_rw}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Tidak ada data RT.</p>
                      )}
                </Accordion>

                {wilayahImageUrl && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      onClick={() => setShowMapModal(true)}
                      className="cursor-zoom-in w-full flex justify-center group relative"
                    >
                      <img
                        src={wilayahImageUrl}
                        alt="Peta Pembagian Wilayah"
                        className="w-full rounded-lg shadow-lg transition transform hover:brightness-95"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                        <span className="bg-white/80 px-4 py-2 rounded-full text-sm font-medium">Klik untuk memperbesar</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map Modal */}
          <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)}>
            <img
              src={wilayahImageUrl}
              alt="Peta Pembagian Wilayah"
              className="max-w-full max-h-[90vh] rounded-md shadow-2xl object-contain"
              loading="lazy"
            />
          </Modal>
          {/* Fasilitas Umum */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Fasilitas Umum
            </h2>

            {fasilitasError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading fasilitas data: {fasilitasError}</p>
              </div>
            )}

            {loadingFasilitas ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading fasilitas data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sekolah Section */}
                <Accordion
                  title="Sekolah"
                  icon="🏫"
                  isExpanded={expandSekolah}
                  onToggle={() => setExpandSekolah(!expandSekolah)}
                  subtitle={`Total: ${fasilitasData.filter(f => f.kategori === 'Sekolah').length}`}
                  color="yellow"
                >
                      {fasilitasData.filter(f => f.kategori === 'Sekolah').length > 0 ? (
                        <div className="space-y-4">
                          {categorizeSchools(fasilitasData.filter(f => f.kategori === 'Sekolah')).map((category, idx) => (
                            category.schools.length > 0 && (
                              <div key={idx} className="space-y-2">
                                <p className="font-semibold text-yellow-700 text-sm">&gt;{category.name}</p>
                                <div className="ml-4 space-y-2">
                                  {category.prefixes.map(prefix => {
                                    const prefixSchools = category.schools.filter(school => 
                                      school.nama_fasilitas.toUpperCase().startsWith(prefix.toUpperCase())
                                    );
                                    return prefixSchools.length > 0 && (
                                      <div key={prefix}>
                                        <p className="text-sm font-medium text-gray-700 mb-1">- {prefix}</p>
                                        <ul className="ml-4 space-y-1">
                                          {prefixSchools.map((item) => (
                                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-600 text-sm">
                                              <span className="text-yellow-600">▸</span> {item.nama_fasilitas}, {item.alamat}, Lingkungan {item.lingkungan}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Sekolah.</p>
                      )}
                </Accordion>

                {/* Fasilitas Kesehatan Section */}
                <Accordion
                  title="Fasilitas Kesehatan"
                  icon="🏥"
                  isExpanded={expandKesehatam}
                  onToggle={() => setExpandKesehatam(!expandKesehatam)}
                  subtitle={`Total: ${fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').length}`}
                  color="red"
                >
                      {fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-red-600">▸</span> {item.nama_fasilitas}, {item.alamat}, Lingkungan {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Fasilitas Kesehatan.</p>
                      )}
                </Accordion>

                {/* Tempat Ibadah Section */}
                <Accordion
                  title="Tempat Ibadah"
                  icon="🕌"
                  isExpanded={expandIbadah}
                  onToggle={() => setExpandIbadah(!expandIbadah)}
                  subtitle={`Total: ${fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').length}`}
                  color="indigo"
                >
                      {fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-indigo-600">▸</span> {item.nama_fasilitas}, {item.alamat}, Lingkungan {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Tempat Ibadah.</p>
                      )}
                </Accordion>

                {/* Kantor Pelayanan Section */}
                <Accordion
                  title="Kantor Pelayanan"
                  icon="🏢"
                  isExpanded={expandKantor}
                  onToggle={() => setExpandKantor(!expandKantor)}
                  subtitle={`Total: ${fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').length}`}
                  color="violet"
                >
                      {fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-violet-600">▸</span> {item.nama_fasilitas}, {item.alamat}, Lingkungan {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Kantor Pelayanan.</p>
                      )}
                </Accordion>
              </div>
            )}

          </div>

          {/* Informasi Tambahan */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
