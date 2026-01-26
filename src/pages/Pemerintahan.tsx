import { useEffect, useState } from 'react';
import { useStrukturOrganisasi } from '../services/useStrukturOrganisasi';
import { useStrukturImage } from '../hooks/useStrukturImage';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useBuildTree } from '../services/useBuildTree';
import { TreeNodeComponent } from '../components/common/TreeNodeComponent';
import { VisionMissionMotto } from '../components/common/VisionMissionMotto';
import { Modal } from '../components/common/Modal';

const Pemerintahan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [strukturImageError, setStrukturImageError] = useState<string | null>(null);
  const { strukturUrl, loading: strukturLoading, error: strukturError } = useStrukturImage();
  const { data: strukturData, loading: strukturDataLoading, error: strukturDataError } = useStrukturOrganisasi();
  const treeData = useBuildTree(strukturData);

  useLockBodyScroll(isModalOpen || showDetailModal);

  useEffect(() => {
    window.scrollTo(0, 0);
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
          <VisionMissionMotto
            type="vision"
            title="Visi"
            content="Terwujudnya masyarakat Kelurahan Baju Bodoa sebagai masyarakat yang bermartabat, untuk mencapai masyarakat yang makmur dan sejahtera"
          />

          {/* Misi */}
          <VisionMissionMotto
            type="mission"
            title="Misi"
            content="Melibatkan masyarakat berpartisipasi dalam hal pembangunan sosial dan ekonomi, serta meningkatkan disiplin dan etos kerja aparat kelurahan dalam memberikan pelayanan prima kepada masyarakat"
          />

          {/* Motto */}
          <VisionMissionMotto
            type="motto"
            title="Motto"
            content='Kami melayani anda dengan "GERCEP"'
            subtitle="Gerakan Cepat dan Akurat"
          />

          {/* Struktur Organisasi */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Struktur Organisasi</h2>
            
            {(strukturError || strukturImageError) && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error loading struktur organisasi: {strukturError || strukturImageError}</p>
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
                {/* Trigger: Clicking this image opens the modal */}
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-zoom-in w-full flex justify-center group relative"
                >
                  <img
                    src={strukturUrl}
                    alt="Struktur Organisasi"
                    className="w-full max-w-4xl rounded-lg shadow-lg transition transform hover:brightness-95"
                    onError={() => {
                      setStrukturImageError("File gambar tidak ditemukan di server.");
                    }}
                  />
                  {/* Subtle "Enlarge" hint like the Galeri hover effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                    <span className="bg-white/80 px-4 py-2 rounded-full text-sm font-medium">Klik untuk memperbesar</span>
                  </div>
                </div>

                {/* Lightbox Modal */}
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  contentClassName="max-w-full max-h-[90vh] rounded-md shadow-2xl object-contain"
                >
                  {strukturUrl && (
                    <img
                      src={strukturUrl}
                      alt="Enlarged Struktur Organisasi"
                      className="max-w-full max-h-[90vh] rounded-md shadow-2xl object-contain"
                    />
                  )}
                </Modal>

                {/* Lihat Selengkapnya Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowDetailModal(true)}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
                  >
                    Lihat Selengkapnya
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Detail Struktur Modal */}
          <Modal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            contentClassName="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowDetailModal(false)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {strukturDataError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                  <p>Error loading data: {strukturDataError}</p>
                </div>
              )}

              {strukturDataLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading data struktur organisasi...</p>
                </div>
              ) : strukturData.length > 0 ? (
                <div className="space-y-2">
                  {treeData.map((rootNode) => (
                    <TreeNodeComponent key={rootNode.id} node={rootNode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data struktur organisasi.
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Pemerintahan;
