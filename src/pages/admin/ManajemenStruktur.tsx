import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { supabase } from '../../services/supabase';
import { useStrukturOrganisasi, type StrukturOrganisasi } from '../../services/useStrukturOrganisasi';

type StatCard = {
	label: string;
	value: number | string;
	accent: string;
};

export default function ManajemenStruktur() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('struktur');
	const [search, setSearch] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [confirmState, setConfirmState] = useState({
		open: false,
		title: 'Konfirmasi',
		message: '',
		onConfirm: () => {},
	});
	
	const { data: items, loading, error: fetchError } = useStrukturOrganisasi();

	useEffect(() => {
		if (fetchError) {
			setError(fetchError);
		}
	}, [fetchError]);

	const stats: StatCard[] = useMemo(() => {
		const total = items.length;
		const leaders = items.filter(i => !i.parent_id).length;
		const staff = items.filter(i => i.parent_id).length;
		return [
			{ label: 'Total Pegawai', value: total, accent: 'text-blue-600' },
			{ label: 'Pimpinan', value: leaders, accent: 'text-emerald-600' },
			{ label: 'Staff', value: staff, accent: 'text-purple-600' },
		];
	}, [items]);

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

	// Filter items based on search
	const filteredItems = useMemo(() => {
		if (!search.trim()) return items;
		const searchLower = search.toLowerCase();
		return items.filter(item => 
			item.nama.toLowerCase().includes(searchLower) ||
			item.jabatan.toLowerCase().includes(searchLower) ||
			(item.nomor_nip && item.nomor_nip.toLowerCase().includes(searchLower))
		);
	}, [items, search]);

	// Pagination logic
	const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedItems = filteredItems.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleDeletePegawai = async (id: string, nama: string) => {
		setConfirmState({
			open: true,
			title: 'Hapus Pegawai',
			message: `Apakah Anda yakin ingin menghapus "${nama}"?`,
			onConfirm: async () => {
				try {
					if (!supabase) return;

					const { error: deleteError } = await supabase
						.from('struktur_organisasi')
						.delete()
						.eq('id', id);

					if (deleteError) throw deleteError;

					window.location.reload();
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Gagal menghapus data pegawai';
					setError(message);
				} finally {
					setConfirmState((prev) => ({ ...prev, open: false }));
				}
			},
		});
	};

	// Helper function to get parent name
	const getParentName = (parentId: string | null) => {
		if (!parentId) return '-';
		const parent = items.find(item => item.id === parentId);
		return parent ? parent.nama : 'Tidak ditemukan';
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
								placeholder="Cari pegawai..."
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
								<h2 className="text-2xl font-bold">Manajemen Struktur Organisasi</h2>
								<p className="text-sm text-gray-500">Kelola data pegawai dan struktur organisasi</p>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => navigate('/admin/tambah-struktur')}
									className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
								>
									➕ Tambah Pegawai
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

						{/* Table */}
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
										<tr>
											<th className="px-4 py-3">Foto</th>
											<th className="px-4 py-3">Nama</th>
											<th className="px-4 py-3">Jabatan</th>
											<th className="px-4 py-3">NIP</th>
											<th className="px-4 py-3">Atasan</th>
											<th className="px-4 py-3">Urutan</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{loading && (
											<tr>
												<td colSpan={7} className="px-4 py-6 text-center text-gray-500">Memuat data...</td>
											</tr>
										)}
										{!loading && paginatedItems.length === 0 && (
											<tr>
												<td colSpan={7} className="px-4 py-6 text-center text-gray-500">
													{search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data pegawai'}
												</td>
											</tr>
										)}
										{!loading && paginatedItems.map((item) => (
											<tr key={item.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													{item.foto_url ? (
														<img
															src={item.foto_url}
															alt={item.nama}
															className="w-10 h-10 rounded-full object-cover"
															onError={(e) => {
																(e.target as HTMLImageElement).src = '/placeholder-avatar.png';
															}}
														/>
													) : (
														<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
															{item.nama.charAt(0).toUpperCase()}
														</div>
													)}
												</td>
												<td className="px-4 py-3 font-medium">{item.nama}</td>
												<td className="px-4 py-3 text-gray-600">{item.jabatan}</td>
												<td className="px-4 py-3 text-gray-600">{item.nomor_nip || '-'}</td>
												<td className="px-4 py-3 text-gray-600">{getParentName(item.parent_id)}</td>
												<td className="px-4 py-3 text-center">{item.urutan}</td>
												<td className="px-4 py-3">
													<div className="flex items-center justify-center gap-2">
														<button
															onClick={() => navigate(`/admin/edit-struktur/${item.id}`)}
															className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
														>
															Edit
														</button>
														<button
															onClick={() => handleDeletePegawai(item.id, item.nama)}
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

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
									<p className="text-sm text-gray-600">
										Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredItems.length)} dari {filteredItems.length} pegawai
									</p>
									<div className="flex gap-2">
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
										>
											Previous
										</button>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
											<button
												key={page}
												onClick={() => handlePageChange(page)}
												className={`px-3 py-1 border rounded text-sm ${
													currentPage === page
														? 'bg-emerald-500 text-white border-emerald-500'
														: 'border-gray-300 hover:bg-gray-50'
												}`}
											>
												{page}
											</button>
										))}
										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
										>
											Next
										</button>
									</div>
								</div>
							)}
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
