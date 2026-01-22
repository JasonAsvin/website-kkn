type NavItem = {
  key: string;
  label: string;
  icon: string;
};

type AdminSidebarProps = {
  activeKey: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
};

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'penduduk', label: 'Data Penduduk', icon: '👥' },
  { key: 'berita', label: 'Berita', icon: '📄' },
  { key: 'galeri', label: 'Galeri', icon: '🖼️' },
  { key: 'umkm', label: 'UMKM', icon: '🏪' },
  { key: 'pengaturan', label: 'Pengaturan', icon: '⚙️' },
];

export default function AdminSidebar({ activeKey, onSelect, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
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
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
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
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
