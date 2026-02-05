import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

type NavItem = {
  key: string;
  label: string;
  icon: string;
  path: string;
};

type AdminSidebarProps = {
  activeKey: string;
  onSelect: (key: string) => void;
};

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
  { key: 'struktur', label: 'Struktur Organisasi', icon: '🏢', path: '/admin/manajemen-struktur' },
  { key: 'wilayah', label: 'Wilayah Administratif', icon: '🗺️', path: '/admin/manajemen-wilayah' },
  { key: 'penduduk', label: 'Penduduk', icon: '👥', path: '/admin/manajemen-penduduk' },
  { key: 'fasilitas', label: 'Fasilitas', icon: '🏛️', path: '/admin/manajemen-fasilitas' },
  { key: 'galeri', label: 'Galeri', icon: '🖼️', path: '/admin/manajemen-galeri' },
  { key: 'aset', label: 'Manajemen Aset', icon: '🖼️', path: '/admin/manajemen-aset' },
  { key: 'konten-web', label: 'Konten Web', icon: '📝', path: '/admin/manajemen-konten' },
];

export default function AdminSidebar({ activeKey, onSelect }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleNavClick = (key: string, path: string) => {
    onSelect(key);
    navigate(path);
  };

const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('isAuthenticated');
  navigate('/admin');
};

  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col border-r border-gray-800 h-screen sticky top-0">
      {/* Header */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
        <div className="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg">
          <img 
            src="/Kabupaten_Maros.png" 
            alt="Logo Kabupaten Maros" 
            className="h-16 w-16 object-contain"
            onError={(e) => {
            // Fallback jika logo tidak ada
            e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div>
          <p className="text-sm text-white/70">Kelurahan Baju Bodoa</p>
          <p className="text-base font-semibold">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item.key, item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeKey === item.key
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
