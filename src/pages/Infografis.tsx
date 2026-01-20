import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type PopulationData = {
  jumlah_penduduk: number;
  penduduk_perempuan: number;
  penduduk_lakilaki: number;
};

type AgeStat = {
  rentang_umur: string;
  penduduk: number;
};

type WilayahTotal = {
  total_lingkungan: number;
  total_rw: number;
  total_rt: number;
};

type Lingkungan = {
  id?: string;
  nama_lingkungan: string;
};

type RW = {
  id?: string;
  nama_rw: string;
  nama_lingkungan: string;
};

type RT = {
  id?: string;
  nama_rt: string;
  nama_rw: string;
  nama_lingkungan: string;
};

type Facility = {
  id?: string;
  nama_fasilitas: string;
  alamat: string;
  lingkungan: string;
  kategori: string;
};

const Infografis = () => {
  // Helper function to categorize schools by education level
  const categorizeSchools = (schools: Facility[]) => {
    const categories = [
      {
        name: 'Pendidikan Anak Usia Dini (PAUD)',
        prefixes: ['KB', 'RA', 'TK'],
        schools: [] as Facility[]
      },
      {
        name: 'Pendidikan Dasar',
        prefixes: ['MI', 'SD', 'UPTD SD'],
        schools: [] as Facility[]
      },
      {
        name: 'Pendidikan Menengah Pertama',
        prefixes: ['MTs', 'SMP'],
        schools: [] as Facility[]
      },
      {
        name: 'Pendidikan Menengah Atas',
        prefixes: ['MA', 'SMA'],
        schools: [] as Facility[]
      }
    ];

    schools.forEach(school => {
      for (const category of categories) {
        // Check if school name starts with any of the prefixes
        const matchingPrefix = category.prefixes.find(prefix => 
          school.nama_fasilitas.toUpperCase().startsWith(prefix.toUpperCase())
        );
        if (matchingPrefix) {
          category.schools.push(school);
          break;
        }
      }
    });

    return categories;
  };

  const [populationData, setPopulationData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ageStats, setAgeStats] = useState<AgeStat[]>([]);
  const [loadingAgeStats, setLoadingAgeStats] = useState(true);
  const [ageStatsError, setAgeStatsError] = useState<string | null>(null);

  // Wilayah Administratif state
  const [wilayahTotal, setWilayahTotal] = useState<WilayahTotal | null>(null);
  const [lingkunganList, setLingkunganList] = useState<Lingkungan[]>([]);
  const [rwList, setRwList] = useState<RW[]>([]);
  const [rtList, setRtList] = useState<RT[]>([]);
  const [loadingWilayah, setLoadingWilayah] = useState(true);
  const [wilayahError, setWilayahError] = useState<string | null>(null);

  // Toggle state for collapsible sections
  const [expandLingkungan, setExpandLingkungan] = useState(false);
  const [expandRw, setExpandRw] = useState(false);
  const [expandRt, setExpandRt] = useState(false);

  // Fasilitas Umum state
  const [fasilitasData, setFasilitasData] = useState<Facility[]>([]);
  const [loadingFasilitas, setLoadingFasilitas] = useState(true);
  const [fasilitasError, setFasilitasError] = useState<string | null>(null);

  // Toggle state for facility categories
  const [expandSekolah, setExpandSekolah] = useState(false);
  const [expandKesehatam, setExpandKesehatam] = useState(false);
  const [expandIbadah, setExpandIbadah] = useState(false);
  const [expandKantor, setExpandKantor] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchPopulationData = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('total_penduduk')
          .select('jumlah_penduduk, penduduk_perempuan, penduduk_lakilaki')
          .maybeSingle();

        if (ignore) return;

        if (fetchError) {
          console.error('Supabase fetch error:', fetchError);
          setError(fetchError.message);
        } else if (data) {
          setPopulationData(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching population data:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPopulationData();

    return () => {
      ignore = true;
    };
  }, []);

  // Fetch age statistics (statistik_umur)
  useEffect(() => {
    if (!supabase) {
      setAgeStatsError('Supabase not configured');
      setLoadingAgeStats(false);
      return;
    }

    let ignore = false;

    const fetchAgeStats = async () => {
      try {
        setLoadingAgeStats(true);
        const { data, error: fetchError } = await supabase
          .from('statistik_umur')
          .select('rentang_umur, penduduk')
          .order('id', { ascending: true });

        if (ignore) return;

        if (fetchError) {
          console.error('Supabase fetch error (statistik_umur):', fetchError);
          setAgeStatsError(fetchError.message);
          setAgeStats([]);
        } else {
          setAgeStats(Array.isArray(data) ? data : []);
          setAgeStatsError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching age stats:', err);
          setAgeStatsError(err instanceof Error ? err.message : 'Unknown error');
          setAgeStats([]);
        }
      } finally {
        if (!ignore) {
          setLoadingAgeStats(false);
        }
      }
    };

    fetchAgeStats();

    return () => {
      ignore = true;
    };
  }, []);

  // Fetch Wilayah Administratif data
  useEffect(() => {
    if (!supabase) {
      setWilayahError('Supabase not configured');
      setLoadingWilayah(false);
      return;
    }

    let ignore = false;

    const fetchWilayahData = async () => {
      try {
        setLoadingWilayah(true);

        // Fetch all data
        const { data: rtData, error: rtError } = await supabase
          .from('wilayah_administratif')
          .select('id, nama_rt, nama_rw, nama_lingkungan')
          .order('nama_rw', { ascending: true });

        if (ignore) return;

        if (rtError) {
          setWilayahError(rtError.message || 'Unknown error');
        } else if (rtData) {
          setRtList(rtData);

          // Calculate unique lingkungan
          const uniqueLingkungan = Array.from(
            new Set(rtData.map(item => item.nama_lingkungan))
          )
            .filter(Boolean)
            .sort()
            .map((nama, idx) => ({ id: `${idx + 1}`, nama_lingkungan: nama }));
          setLingkunganList(uniqueLingkungan);

          // Calculate unique RW with their lingkungan
          const rwMap = new Map<string, string>();
          rtData.forEach(item => {
            if (item.nama_rw && !rwMap.has(item.nama_rw)) {
              rwMap.set(item.nama_rw, item.nama_lingkungan);
            }
          });
          const uniqueRw = Array.from(rwMap.entries())
            .sort(([rwA], [rwB]) => {
              const numA = parseInt(rwA.match(/\d+/)?.[0] || '0');
              const numB = parseInt(rwB.match(/\d+/)?.[0] || '0');
              return numA - numB;
            })
            .map(([rw, lingkungan], idx) => ({
              id: `rw-${idx + 1}`,
              nama_rw: rw,
              nama_lingkungan: lingkungan
            }));
          setRwList(uniqueRw);

          // Calculate totals
          setWilayahTotal({
            total_lingkungan: uniqueLingkungan.length,
            total_rw: uniqueRw.length,
            total_rt: rtData.length
          });

          setWilayahError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching wilayah data:', err);
          setWilayahError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!ignore) {
          setLoadingWilayah(false);
        }
      }
    };

    fetchWilayahData();

    return () => {
      ignore = true;
    };
  }, []);

  // Fetch Fasilitas Umum data
  useEffect(() => {
    if (!supabase) {
      setFasilitasError('Supabase not configured');
      setLoadingFasilitas(false);
      return;
    }

    let ignore = false;

    const fetchFasilitasData = async () => {
      try {
        setLoadingFasilitas(true);

        const { data, error: fetchError } = await supabase
          .from('fasilitas_umum')
          .select('id, nama_fasilitas, alamat, lingkungan, kategori')
          .order('kategori', { ascending: true });

        if (ignore) return;

        if (fetchError) {
          setFasilitasError(fetchError.message || 'Unknown error');
        } else if (data) {
          setFasilitasData(data);
          setFasilitasError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching fasilitas data:', err);
          setFasilitasError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!ignore) {
          setLoadingFasilitas(false);
        }
      }
    };

    fetchFasilitasData();

    return () => {
      ignore = true;
    };
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
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading data: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Penduduk */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Total Penduduk</p>
                  <p className="text-5xl font-bold mb-2">
                    {populationData?.jumlah_penduduk.toLocaleString('id-ID') || '0'}
                  </p>
                  <p className="text-blue-100">jiwa</p>
                </div>

                {/* Penduduk Perempuan */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Perempuan</p>
                  <p className="text-5xl font-bold mb-2">
                    {populationData?.penduduk_perempuan.toLocaleString('id-ID') || '0'}
                  </p>
                  <p className="text-pink-100">jiwa</p>
                </div>

                {/* Penduduk Laki-laki */}
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition">
                  <p className="text-sm font-semibold opacity-90 mb-2">Penduduk Laki-laki</p>
                  <p className="text-5xl font-bold mb-2">
                    {populationData?.penduduk_lakilaki.toLocaleString('id-ID') || '0'}
                  </p>
                  <p className="text-cyan-100">jiwa</p>
                </div>
              </div>
            )}

              {/* Jumlah Penduduk berdasarkan Umur */}
                <div className="bg-white rounded-lg shadow-lg mt-4 p-8 border-t-4 border-blue-500">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Jumlah Penduduk berdasarkan Umur</h3>

                  {ageStatsError && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                      <p>Error loading umur data: {ageStatsError}</p>
                    </div>
                  )}

                  {loadingAgeStats ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Loading umur data...</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 bg-gray-50 text-gray-700 font-semibold px-4 py-3 border-b">
                        <div>Rentang Umur</div>
                        <div className="text-right">Jumlah</div>
                      </div>
                      {ageStats.length > 0 ? (
                        ageStats.map((row, idx) => (
                          <div
                            key={`${row.rentang_umur}-${idx}`}
                            className="grid grid-cols-2 items-center px-4 py-3 border-b last:border-b-0"
                          >
                            <div className="text-gray-900">{row.rentang_umur}</div>
                            <div className="text-gray-900 text-right">
                              {Number(row.penduduk).toLocaleString('id-ID')}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500">Tidak ada data umur.</div>
                      )}
                    </div>
                  )}
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
                {/* Lingkungan/Dusun Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandLingkungan(!expandLingkungan)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏘️</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Lingkungan</p>
                        <p className="text-sm text-gray-600">Total: {wilayahTotal?.total_lingkungan || 0}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandLingkungan ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandLingkungan && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      {lingkunganList.length > 0 ? (
                        <ul className="space-y-2">
                          {lingkunganList.map((item) => (
                            <li key={item.id || item.nama_lingkungan} className="flex items-center gap-2 text-gray-700">
                              <span className="text-teal-600">▸</span> {item.nama_lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data lingkungan.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* RW Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandRw(!expandRw)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏘️</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">RW (Rukun Warga)</p>
                        <p className="text-sm text-gray-600">Total: {wilayahTotal?.total_rw || 0}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandRw ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandRw && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      {rwList.length > 0 ? (
                        <ul className="space-y-2">
                          {rwList.map((item) => (
                            <li key={item.id || item.nama_rw} className="flex items-center gap-2 text-gray-700">
                              <span className="text-green-600">▸</span> {item.nama_rw} - {item.nama_lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data RW.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* RT Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandRt(!expandRt)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏘️</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">RT (Rukun Tetangga)</p>
                        <p className="text-sm text-gray-600">Total: {wilayahTotal?.total_rt || 0}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandRt ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandRt && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      {rtList.length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(
                            rtList.reduce((acc, item) => {
                              const rwMatch = item.nama_rw?.match(/\d+/);
                              const rwNumber = rwMatch ? rwMatch[0].padStart(3, '0') : '000';
                              const normalizedRW = `RW ${rwNumber}`;

                              if (!acc[normalizedRW]) acc[normalizedRW] = [];
                              acc[normalizedRW].push(item);
                              return acc;
                            }, {} as Record<string, RT[]>)
                          )
                            .sort(([rwA], [rwB]) => {
                              const numA = parseInt(rwA.match(/\d+/)?.[0] || '0');
                              const numB = parseInt(rwB.match(/\d+/)?.[0] || '0');
                              return numA - numB;
                            })
                            .map(([rw, items]) => (
                              <div key={rw}>
                                <p className="font-semibold text-emerald-700 mb-2"> {rw.padStart(3, '0')}</p>
                                <ul className="space-y-1 ml-4">
                                  {items
                                    .sort((a, b) => {
                                      const numA = parseInt(a.nama_rt.match(/\d+/)?.[0] || '0');
                                      const numB = parseInt(b.nama_rt.match(/\d+/)?.[0] || '0');
                                      return numA - numB;
                                    })
                                    .map((item) => (
                                      <li key={item.id || item.nama_rt} className="flex items-center gap-2 text-gray-700">
                                        <span className="text-emerald-600">▸</span> {item.nama_rt} / {item.nama_rw} - {item.nama_lingkungan}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Tidak ada data RT.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map Placeholder
            <div className="mt-8 p-6 bg-gray-100 rounded-lg flex items-center justify-center min-h-64">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 13V9m0 0L9 5" />
                </svg>
                <p className="text-gray-500 font-semibold">Peta Wilayah Administratif</p>
                <p className="text-gray-400 text-sm">Visualisasi peta akan ditampilkan segera</p>
              </div>
            </div> */}
          </div>

          {/* Fasilitas Umum */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">🏛️</span>
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
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandSekolah(!expandSekolah)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏫</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Sekolah</p>
                        <p className="text-sm text-gray-600">Total: {fasilitasData.filter(f => f.kategori === 'Sekolah').length}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandSekolah ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandSekolah && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto pb-4">
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
                                              <span className="text-yellow-600">▸</span> {item.nama_fasilitas}, {item.alamat}, {item.lingkungan}
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
                    </div>
                  )}
                </div>

                {/* Fasilitas Kesehatan Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandKesehatam(!expandKesehatam)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏥</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Fasilitas Kesehatan</p>
                        <p className="text-sm text-gray-600">Total: {fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').length}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandKesehatam ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandKesehatam && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
                      {fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Fasilitas Kesehatan').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-red-600">▸</span> {item.nama_fasilitas}, {item.alamat}, {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Fasilitas Kesehatan.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Tempat Ibadah Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandIbadah(!expandIbadah)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🕌</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Tempat Ibadah</p>
                        <p className="text-sm text-gray-600">Total: {fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').length}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandIbadah ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandIbadah && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
                      {fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Tempat Ibadah').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-indigo-600">▸</span> {item.nama_fasilitas}, {item.alamat}, {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Tempat Ibadah.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Kantor Pelayanan Section */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandKantor(!expandKantor)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🏢</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Kantor Pelayanan</p>
                        <p className="text-sm text-gray-600">Total: {fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').length}</p>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandKantor ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandKantor && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
                      {fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').length > 0 ? (
                        <ul className="space-y-2">
                          {fasilitasData.filter(f => f.kategori === 'Kantor Pelayanan').map((item) => (
                            <li key={item.id || item.nama_fasilitas} className="flex items-center gap-2 text-gray-700">
                              <span className="text-violet-600">▸</span> {item.nama_fasilitas}, {item.alamat}, {item.lingkungan}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Tidak ada data Kantor Pelayanan.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
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
