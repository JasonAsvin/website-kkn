interface Official {
  name: string;
  position: string;
  image?: string;
}

const Officials = () => {
  const officials: Official[] = [
    {
      name: 'Budi Santoso, S.Sos',
      position: 'Kepala Desa',
    },
    {
      name: 'Siti Aminah, S.AP',
      position: 'Sekretaris Desa',
    },
    {
      name: 'Ahmad Fauzi, SE',
      position: 'Kaur Keuangan',
    },
    {
      name: 'Dewi Lestari, S.Pd',
      position: 'Kaur Umum',
    },
    {
      name: 'Rudi Hartono',
      position: 'Kaur Pembangunan',
    },
    {
      name: 'Sri Wahyuni',
      position: 'Kaur Kesejahteraan',
    },
  ];

  return (
    <section id="officials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Struktur Pemerintahan Desa
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Perangkat Desa yang melayani dan bekerja untuk kemajuan Desa Makmur
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {officials.map((official, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-64 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{official.name}</h3>
                <p className="text-blue-600 font-medium">{official.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Officials;
