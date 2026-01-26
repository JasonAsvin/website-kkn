import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

type SectionKey = 'penduduk' | 'wilayah' | 'fasilitas' | 'galeri' ;

type DataRecord = {
  id?: string | number;
  nama?: string;
  nama_lingkungan?: string;
  nama_fasilitas?: string;
  judul?: string;
  created_at?: string;
};

const emptyData: Record<SectionKey, DataRecord[]> = {
  penduduk: [],
  wilayah: [],
  fasilitas: [],
  galeri: [],
};

const fallbackData: Record<SectionKey, DataRecord[]> = {
  penduduk: [
    { id: 1, nama_lingkungan: 'Kassikebo' },
    { id: 2, nama_lingkungan: 'Betang' },
  ],
  wilayah: [
    { id: 3, nama: 'RT 001' },
    { id: 4, nama: 'RT 002' },
  ],
  fasilitas: [
    { id: 5, nama_fasilitas: 'Sekolah Dasar' },
    { id: 6, nama_fasilitas: 'Puskesmas' },
  ],
  galeri: [
    { id: 7, judul: 'Kegiatan Kelurahan' },
    { id: 8, judul: 'Dokumentasi' },
  ],
};

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [data, setData] = useState<Record<SectionKey, DataRecord[]>>(emptyData);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    return (Object.keys(data) as SectionKey[]).reduce(
      (acc, key) => {
        acc[key] = data[key].length;
        return acc;
      },
      { penduduk: 0, wilayah: 0, fasilitas: 0, galeri: 0 } as Record<SectionKey, number>
    );
  }, [data]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setError(null);

      if (!supabase) {
        // Supabase not configured, use fallback so UI is populated.
        setData(fallbackData);
        return;
      }

      try {
        const tableMapping: Record<SectionKey, string> = {
          penduduk: 'total_penduduk',
          wilayah: 'wilayah_administratif',
          fasilitas: 'fasilitas_umum',
          galeri: 'galeri_kelurahan',
        };
        
        const results = await Promise.all(
          (Object.keys(tableMapping) as SectionKey[]).map(async (key) => {
            const tableName = tableMapping[key];
            const { data: rows, error: tableError } = await supabase!
              .from(tableName)
              .select('*');

            if (tableError) throw new Error(`${tableName}: ${tableError.message}`);
            return { table: key, rows: rows as DataRecord[] };
          })
        );

        if (!isMounted) return;
        const merged = { ...emptyData } as Record<SectionKey, DataRecord[]>;
        results.forEach((result) => {
          merged[result.table as SectionKey] = result.rows || [];
        });
        setData(merged);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Gagal memuat data dashboard.';
        setError(message);
        setData(fallbackData);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      localStorage.removeItem('isAuthenticated');
      navigate('/admin');
    }
  };

  const handleNavSelect = (key: string) => {
    setActiveNav(key);
    // Navigate to different pages based on selected nav item
    if (key === 'berita') {
      navigate('/admin/manajemen-berita');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <AdminSidebar activeKey={activeNav} onSelect={handleNavSelect} onLogout={handleLogout} />

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="text-gray-400">🔎</div>
              <input
                type="text"
                placeholder="Cari..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </header>

          {/* Content */}
          <main className="p-6 space-y-6">
            {/* Heading */}
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-sm text-gray-500">Selamat datang di Admin Panel Kelurahan Baju Bodoa</p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Stats and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats (Left - taking 1 column) */}
              <div className="space-y-4">
                <StatCard label="Lingkungan" value={stats.penduduk} color="blue" />
                <StatCard label="Wilayah RT/RW" value={stats.wilayah} color="green" />
                <StatCard label="Fasilitas Umum" value={stats.fasilitas} color="purple" />
                <StatCard label="Foto Galeri" value={stats.galeri} color="amber" />
              </div>

              {/* Quick Actions (Right - taking 2 columns) */}
              <section className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <p className="text-sm text-gray-500">Akses cepat ke tindakan utama</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className="border border-dashed border-gray-300 rounded-lg py-6 px-3 hover:border-emerald-500 hover:bg-emerald-50 transition"
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <p className="text-sm font-semibold text-gray-800">{action.label}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'teal';
  delta?: string;
};

const colorMap: Record<StatCardProps['color'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
};

const StatCard = ({ label, value, color, delta }: StatCardProps) => (
  <div className={`border rounded-lg p-4 ${colorMap[color]} flex items-start justify-between`}> 
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    {delta && <span className="text-xs font-semibold text-gray-500">{delta}</span>}
  </div>
);

const quickActions = [
  { label: 'Tambah Fasilitas', icon: '🏢', path: '/admin/tambah-fasilitas' },
  { label: 'Upload Galeri', icon: '🖼️', path: '/admin/tambah-galeri' },
  { label: 'Kelola Penduduk', icon: '👥', path: '/admin/manajemen-penduduk' },
  { label: 'Kelola Wilayah', icon: '🗺️', path: '/admin/manajemen-wilayah' },
];
