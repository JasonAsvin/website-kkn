import { Link } from 'react-router-dom';
import { useWilayahAdministratif } from '../services/useWilayahAdministratif';
import { usePopulationByLingkungan } from '../services/usePopulationByLingkungan';
import { useKepalaKelurahanImage } from '../hooks/useKepalaKelurahanImage';

const Home = () => {
  const { wilayahTotal, rtList, loading: wilayahLoading } = useWilayahAdministratif();
  const { data: populationData, loading: populationLoading } = usePopulationByLingkungan();
  const { kepalaUrl, loading: kepalaLoading } = useKepalaKelurahanImage();

  // Calculate totals
  const totalPenduduk = populationData.reduce((sum, item) => sum + (item.jumlah_penduduk || 0), 0);
  const totalKetuaRT = rtList.filter(rt => rt.nama_ketua).length;
  const totalLingkungan = wilayahTotal?.total_lingkungan || 0;
  const totalRTRW = `${wilayahTotal?.total_rt || 0} / ${wilayahTotal?.total_rw || 0}`;

  const isLoading = wilayahLoading || populationLoading;

  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-20 min-h-screen flex items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url("/Kelurahan_Bajubodoa.jpg")',
        }}
      >
        <div className="text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4">
            Selamat Datang di <br /> Kelurahan Baju Bodoa
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-200">
            Kecamatan Maros Baru, Kabupaten Maros
          </p>
        </div>
      </section>

      {/* Sambutan Kepala Kelurahan */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-14">
            Sambutan Kepala Kelurahan
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-14">
            <div className="flex-shrink-0">
              <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {kepalaLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Memuat...</span>
                  </div>
                ) : kepalaUrl ? (
                  <img
                    src={kepalaUrl}
                    alt="Kepala Kelurahan"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';
                    }}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    alt="Kepala Kelurahan"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="max-w-3xl text-center lg:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Hasdar. L, SE
              </h3>
              <p className="text-sm text-blue-600 mb-4">
                Kepala Kelurahan Baju Bodoa
              </p>
              <p className="text-gray-700 mb-3">
                Assalamu'alaikum Warahmatullahi Wabarakatuh,
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Selamat datang di Website Resmi Kelurahan Baju Bodoa.
                Website ini diharapkan dapat menjadi sarana untuk mempermudah akses data kependudukan, fasilitas umum,
                dan transparansi kegiatan wilayah bagi seluruh warga.
                
                Semoga website ini dapat bermanfaat dan menjadi jembatan komunikasi antara pemerintah dan masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Grid on the LEFT */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: isLoading ? '...' : totalKetuaRT.toLocaleString('id-ID'), label: "Ketua RT" },
                  { value: isLoading ? '...' : totalPenduduk.toLocaleString('id-ID'), label: "Penduduk" },
                  { value: isLoading ? '...' : totalLingkungan.toString(), label: "Lingkungan" },
                  { value: isLoading ? '...' : totalRTRW, label: "RT / RW" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl py-8 text-center hover:shadow-md transition"
                  >
                    <div className="text-3xl font-bold text-blue-600">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text on the RIGHT */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-6 uppercase">
                Profil Kelurahan Baju Bodoa
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Data statistik terkini Kelurahan Baju Bodoa mencakup jumlah Ketua RT, total penduduk, 
                jumlah lingkungan, serta pembagian RT dan RW di wilayah kelurahan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jelajahi Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text on the LEFT */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-6 uppercase">
                Jelajahi Kelurahan
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Melalui website ini Anda dapat menjelajahi segala hal yang terkait dengan kelurahan. 
                Profil, infografis, UMKM, berita, dan acara terkait dengan kelurahan.
              </p>
            </div>

            {/* Grid on the RIGHT */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "🏛️", title: "Profil Kelurahan", desc: "Profil dan sejarah kelurahan", link: "/profil-kelurahan" },
                  { icon: "👔", title: "Pemerintahan", desc: "Struktur pemerintahan kelurahan", link: "/pemerintahan" },
                  { icon: "📊", title: "Infografis", desc: "Data statistik kelurahan", link: "/infografis" },
                  { icon: "🖼️", title: "Galeri", desc: "Dokumentasi kegiatan kelurahan", link: "/galeri" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.link}
                    className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl hover:border-blue-300 transition-all h-40 flex flex-col justify-center group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
