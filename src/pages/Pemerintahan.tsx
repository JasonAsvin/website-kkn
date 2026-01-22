import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const Pemerintahan = () => {
  const [strukturUrl, setStrukturUrl] = useState<string | null>(null);
  const [strukturLoading, setStrukturLoading] = useState(true);
  const [strukturError, setStrukturError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadStrukturFromStorage = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
        const filePath = import.meta.env.VITE_SUPABASE_STRUKTUR_PATH || 'pemerintahan/Bagan_Struktur_Baju_Bodoa.png';

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (ignore) return;

        if (!data?.publicUrl) {
          throw new Error('Public URL tidak tersedia untuk struktur organisasi.');
        }

        setStrukturUrl(data.publicUrl);
        setStrukturError(null);
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Gagal memuat struktur organisasi.';
          setStrukturError(message);
          setStrukturUrl(null);
        }
      } finally {
        if (!ignore) setStrukturLoading(false);
      }
    };

    loadStrukturFromStorage();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pemerintahan</h1>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Visi */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Visi</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Terwujudnya masyarakat Kelurahan Baju Bodoa sebagai masyarakat yang bermartabat,
                untuk mencapai masyarakat yang makmur dan sejahtera
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Misi</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Melibatkan masyarakat berpartisipasi dalam hal pembangunan sosial dan ekonomi,
                serta meningkatkan disiplin dan etos kerja aparat kelurahan dalam memberikan
                pelayanan prima kepada masyarakat
              </p>
            </div>
          </div>

          {/* Motto */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Motto</h2>
            <div className="prose max-w-none">
              <p className="text-xl text-gray-900 leading-relaxed text-center font-semibold mb-2">
                Kami melayani anda dengan "GERCEP"
              </p>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Gerakan Cepat dan Akurat
              </p>
            </div>
          </div>

          {/* Struktur Organisasi */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Struktur Organisasi</h2>
            
            {strukturError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading struktur organisasi: {strukturError}</p>
              </div>
            )}

            {strukturLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading struktur organisasi...</p>
              </div>
            )}

            {!strukturLoading && !strukturUrl && !strukturError && (
              <div className="text-center py-12">
                <p className="text-gray-500">Struktur organisasi belum tersedia.</p>
              </div>
            )}

            {!strukturLoading && strukturUrl && (
              <div className="flex flex-col items-center">
                <a 
                  href={strukturUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cursor-zoom-in w-full flex justify-center"
                >
                <img
                  src={strukturUrl}
                  alt="Struktur Organisasi Kelurahan Baju Bodoa"
                  className="w-full max-w-4xl rounded-lg shadow-lg"
                  // Check if the image actually loads
                  onError={() => {
                    setStrukturError("File gambar tidak ditemukan di server.");
                    setStrukturUrl(null);
                  }}
                />
                </a>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Pemerintahan;
