import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { supabase } from '../../services/supabase';
import type { RT } from '../../types/infografis';

type StatCard = {
	label: string;
	value: number | string;
	accent: string;
};

export default function ManajemenWilayah() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('wilayah');
	const [items, setItems] = useState<RT[]>([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedLingkungan] = useState<string>('all');
	const [expandedLingkungan, setExpandedLingkungan] = useState<Set<string>>(new Set());
	const [confirmState, setConfirmState] = useState({
		open: false,
		title: 'Konfirmasi',
		message: '',
		onConfirm: () => {},
	});

	useEffect(() => {
		loadWilayah();
	}, []);

	const loadWilayah = async () => {
		try {
			setLoading(true);
			setError(null);

			if (!supabase) {
				throw new Error('Supabase not initialized');
			}

			const { data, error: fetchError } = await supabase
				.from('wilayah_administratif')
				.select('*')
				.order('nama_lingkungan', { ascending: true })
				.order('nama_rw', { ascending: true })
				.order('nama_rt', { ascending: true });

			if (fetchError) throw fetchError;
			setItems((data as RT[]) || []);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memuat data wilayah';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			if (supabase) {
				await supabase.auth.signOut();
			}
		} finally {
			localStorage.removeItem('isAuthenticated');
			navigate('/admin/login');
		}
	};

    const LINGKUNGAN_ORDER = ["Kassikebo", "Betang", "Masembo"];

	// Group data by Lingkungan
	const groupedByLingkungan = useMemo(() => {
		const groups = new Map<string, RT[]>();
		items.forEach(item => {
			const lingkungan = item.nama_lingkungan || 'Tidak Ada Lingkungan';
			if (!groups.has(lingkungan)) {
				groups.set(lingkungan, []);
			}
			groups.get(lingkungan)!.push(item);
		});
		return groups;
	}, [items]);



	// Stats
	const stats: StatCard[] = useMemo(() => {
		const totalRT = items.length;
		const totalRW = new Set(items.map(i => i.nama_rw)).size;
		const totalLingkungan = new Set(items.map(i => i.nama_lingkungan)).size;
		return [
			{ label: 'Total RT', value: totalRT, accent: 'text-blue-600' },
			{ label: 'Total RW', value: totalRW, accent: 'text-emerald-600' },
			{ label: 'Total Lingkungan', value: totalLingkungan, accent: 'text-purple-600' },
		];
	}, [items]);

	// Filter by search and selected lingkungan
    const filteredGroups = useMemo(() => {
        const filtered = new Map<string, RT[]>();
        
        // 1. Fill the map with filtered data
        groupedByLingkungan.forEach((rtList, lingkungan) => {
            if (selectedLingkungan !== 'all' && lingkungan !== selectedLingkungan) return;

            if (search.trim()) {
                const searchLower = search.toLowerCase();
                const matchingItems = rtList.filter(item =>
                    item.nama_rt.toLowerCase().includes(searchLower) ||
                    item.nama_rw.toLowerCase().includes(searchLower) ||
                    item.nama_ketua.toLowerCase().includes(searchLower) ||
                    lingkungan.toLowerCase().includes(searchLower)
                );
                if (matchingItems.length > 0) filtered.set(lingkungan, matchingItems);
            } else {
                filtered.set(lingkungan, rtList);
            }
        });

        // 2. Sort the Map by converting to array and back to Map
        const sortedEntries = Array.from(filtered.entries()).sort(([a], [b]) => {
            const indexA = LINGKUNGAN_ORDER.indexOf(a);
            const indexB = LINGKUNGAN_ORDER.indexOf(b);

            // If both are in our custom list, sort by list index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only A is in list, A comes first
            if (indexA !== -1) return -1;
            // If only B is in list, B comes first
            if (indexB !== -1) return 1;
            // If neither is in list, use alphabetical
            return a.localeCompare(b);
        });

        return new Map(sortedEntries);
    }, [groupedByLingkungan, selectedLingkungan, search]);

	const toggleLingkungan = (lingkungan: string) => {
		setExpandedLingkungan(prev => {
			const newSet = new Set(prev);
			if (newSet.has(lingkungan)) {
				newSet.delete(lingkungan);
			} else {
				newSet.add(lingkungan);
			}
			return newSet;
		});
	};



	const handleDeleteRT = async (id: string, namaRT: string) => {
		setConfirmState({
			open: true,
			title: 'Hapus RT',
			message: `Apakah Anda yakin ingin menghapus "${namaRT}"?`,
			onConfirm: async () => {
				try {
					if (!supabase) return;

					const { error: deleteError } = await supabase
						.from('wilayah_administratif')
						.delete()
						.eq('id', id);

					if (deleteError) throw deleteError;

					setItems(prev => prev.filter(item => item.id !== id));
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Gagal menghapus data';
					setError(message);
				} finally {
					setConfirmState((prev) => ({ ...prev, open: false }));
				}
			},
		});
	};

	return (
		<div className="min-h-screen bg-gray-100 text-gray-900">
			<div className="flex min-h-screen">
				<AdminSidebar activeKey={activeNav} onSelect={setActiveNav} onLogout={handleLogout} />

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
							<span className="text-gray-400">🔎</span>
							<input
								type="text"
								placeholder="Cari RT, RW, atau Ketua..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
					</header>

					{/* Content */}
					<main className="p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold">Manajemen Wilayah Administratif</h2>
								<p className="text-sm text-gray-500">Kelola data RT, RW, dan Lingkungan</p>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => navigate('/admin/tambah-wilayah')}
									className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
								>
									➕ Tambah RT
								</button>
							</div>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							{stats.map((stat) => (
								<div key={stat.label} className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
									<p className="text-xs text-gray-500">{stat.label}</p>
									<p className={`text-xl font-semibold ${stat.accent}`}>{stat.value}</p>
								</div>
							))}
						</div>

						{/* Grouped by Lingkungan */}
						<div className="space-y-4">
							{loading && (
								<div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
									Memuat data...
								</div>
							)}

							{!loading && filteredGroups.size === 0 && (
								<div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
									{search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data wilayah administratif'}
								</div>
							)}

							{!loading && Array.from(filteredGroups.entries()).map(([lingkungan, rtList]) => {
								const isExpanded = expandedLingkungan.has(lingkungan);
								
								return (
									<div key={lingkungan} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
										{/* Lingkungan Header */}
										<div
											onClick={() => toggleLingkungan(lingkungan)}
											className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition"
										>
											<div className="flex items-center gap-3">
												<span className="text-2sm transition-transform">{isExpanded ? '▼' : '▶'}</span>
												<div>
													<h3 className="text-lg font-bold">Lingkungan {lingkungan}</h3>
													<p className="text-sm text-emerald-100">
														{rtList.length} RT • {new Set(rtList.map(rt => rt.nama_rw)).size} RW
													</p>
												</div>
											</div>
										</div>

										{/* RT Table */}
										{isExpanded && (
											<div className="overflow-x-auto">
												<table className="min-w-full text-sm">
													<thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
														<tr>
															<th className="px-4 py-3">RT</th>
															<th className="px-4 py-3">RW</th>
															<th className="px-4 py-3">Ketua RT</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-100">
														{rtList.map((item) => (
															<tr key={item.id} className="hover:bg-gray-50">
																<td className="px-4 py-3 font-medium">{item.nama_rt}</td>
																<td className="px-4 py-3 text-gray-600">{item.nama_rw}</td>
																<td className="px-4 py-3 text-gray-600">{item.nama_ketua}</td>
																<td className="px-4 py-3">
																	<div className="flex items-center justify-end gap-2">
																		<button
																			onClick={() => navigate(`/admin/edit-wilayah/${item.id}`)}
																			className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
																		>
																			Edit
																		</button>
																		<button
																			onClick={() => handleDeleteRT(item.id!, item.nama_rt)}
																			className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
																		>
																			Hapus
																		</button>
																	</div>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</main>
				</div>
			</div>

			<ConfirmDialog
				open={confirmState.open}
				title={confirmState.title}
				message={confirmState.message}
				onConfirm={confirmState.onConfirm}
				onCancel={() => setConfirmState((prev) => ({ ...prev, open: false }))}
				confirmText="Hapus"
				cancelText="Batal"
			/>
		</div>
	);
}
