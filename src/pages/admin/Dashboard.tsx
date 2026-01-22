import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

type SectionKey = 'penduduk' | 'wilayah' | 'fasilitas' | 'galeri';

type DataRecord = {
  id?: string | number;
  nama?: string;
  keterangan?: string;
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
    { id: 1, nama: 'Total Penduduk', keterangan: 'Placeholder data' },
    { id: 2, nama: 'Penduduk Laki-laki', keterangan: 'Placeholder data' },
  ],
  wilayah: [
    { id: 3, nama: 'RW 01', keterangan: 'Lingkungan A' },
    { id: 4, nama: 'RT 02', keterangan: 'Lingkungan A' },
  ],
  fasilitas: [
    { id: 5, nama: 'Sekolah Dasar', keterangan: 'Fasilitas Pendidikan' },
    { id: 6, nama: 'Puskesmas', keterangan: 'Fasilitas Kesehatan' },
  ],
  galeri: [
    { id: 7, nama: 'Foto Kegiatan 1', keterangan: 'Dokumentasi' },
    { id: 8, nama: 'Video Profil', keterangan: 'Dokumentasi' },
  ],
};

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [data, setData] = useState<Record<SectionKey, DataRecord[]>>(emptyData);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setError(null);

      if (!supabase) {
        // Supabase not configured, use fallback so UI is populated.
        setData(fallbackData);
        setLoading(false);
        return;
      }

      try {
        const tables: SectionKey[] = ['penduduk', 'wilayah', 'fasilitas', 'galeri'];
        const results = await Promise.all(
          tables.map(async (table) => {
            const { data: rows, error: tableError } = await supabase!
              .from(table)
              .select('*')
              .order('created_at', { ascending: false });

            if (tableError) throw new Error(`${table}: ${tableError.message}`);
            return { table, rows: rows as DataRecord[] };
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
      } finally {
        if (isMounted) setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <AdminSidebar activeKey={activeNav} onSelect={setActiveNav} onLogout={handleLogout} />

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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total Penduduk" value={stats.penduduk} color="blue" delta="+5.2%" />
              <StatCard label="Data Terverifikasi" value={stats.wilayah} color="green" delta="+12" />
              <StatCard label="Agenda Bulan Ini" value={stats.fasilitas} color="purple" delta="+3" />
              <StatCard label="UMKM Terdaftar" value={stats.galeri} color="amber" delta="+8" />
            </div>

            {/* Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Aktivitas Terbaru</h3>
                    <p className="text-sm text-gray-500">Ringkasan aktivitas terakhir</p>
                  </div>
                  {loading && <span className="text-xs text-gray-500">Memuat...</span>}
                </div>
                <ul className="divide-y divide-gray-200">
                  {buildActivityFeed(data).map((item, idx) => (
                    <li key={idx} className="px-5 py-3 flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </li>
                  ))}
                  {buildActivityFeed(data).length === 0 && (
                    <li className="px-5 py-4 text-sm text-gray-500">Belum ada aktivitas.</li>
                  )}
                </ul>
              </section>

              <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <p className="text-sm text-gray-500">Akses cepat ke tindakan utama</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="border border-dashed border-gray-300 rounded-lg py-6 px-3 hover:border-teal-500 hover:bg-teal-50 transition"
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
  color: 'blue' | 'green' | 'purple' | 'amber';
  delta?: string;
};

const colorMap: Record<StatCardProps['color'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
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
  { label: 'Tambah Berita', icon: '➕' },
  { label: 'Buat Acara', icon: '🗓️' },
  { label: 'Upload Galeri', icon: '🖼️' },
  { label: 'Export Data', icon: '📤' },
];

const buildActivityFeed = (data: Record<SectionKey, DataRecord[]>) => {
  const items: { title: string; time: string }[] = [];
  if (data.penduduk.length) items.push({ title: 'Data penduduk diperbarui', time: '1 jam lalu' });
  if (data.galeri.length) items.push({ title: 'Foto galeri diunggah', time: '3 jam lalu' });
  if (data.fasilitas.length) items.push({ title: 'Fasilitas baru ditambahkan', time: '2 jam lalu' });
  if (data.wilayah.length) items.push({ title: 'Wilayah terverifikasi', time: '5 menit lalu' });
  return items.slice(0, 6);
};