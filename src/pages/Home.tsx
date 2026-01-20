const Home = () => {
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

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="text-center max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-14">
            Profil Kelurahan Baju Bodoa
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "1.234", label: "Kepala Keluarga" },
              { value: "4.567", label: "Penduduk" },
              { value: "12", label: "Dusun" },
              { value: "45", label: "RT / RW" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl py-6 text-center hover:shadow-md transition"
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
      </section>

      {/* Jelajahi Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-6">
            Jelajahi Kelurahan
          </h2>
          <p className="text-gray-600 text-center text-base md:text-lg max-w-2xl mx-auto mb-14">
            Melalui website ini Anda dapat menjelajahi profil, infografis, UMKM,
            berita, dan acara yang ada di Kelurahan Baju Bodoa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: "🏛️", title: "Profil Desa", desc: "Profil dan sejarah kelurahan" },
              { icon: "🖼️", title: "Galeri", desc: "Dokumentasi kegiatan kelurahan" },
              { icon: "🏪", title: "UMKM", desc: "Usaha masyarakat kelurahan" },
              { icon: "📰", title: "Berita", desc: "Informasi dan berita terbaru" },
              { icon: "📊", title: "Infografis", desc: "Data statistik kelurahan" },
              { icon: "🎉", title: "Acara", desc: "Agenda dan kegiatan mendatang" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition h-48 flex flex-col justify-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
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
              <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                  alt="Kepala Kelurahan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="max-w-3xl text-center lg:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Nama Lurah
              </h3>
              <p className="text-sm text-blue-600 mb-4">
                Kepala Kelurahan Baju Bodoa
              </p>
              <p className="text-gray-700 mb-3">
                Assalamu'alaikum Warahmatullahi Wabarakatuh,
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Selamat datang di Website Resmi Kelurahan Baju Bodoa. Website ini
                menjadi sarana informasi, pelayanan, serta transparansi kegiatan
                pemerintahan kelurahan. Semoga website ini dapat bermanfaat dan
                menjadi jembatan komunikasi antara pemerintah dan masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
