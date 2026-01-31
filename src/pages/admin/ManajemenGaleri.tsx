import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { supabase } from '../../services/supabase';

type GaleriItem = {
	id: string;
	judul: string;
	url: string;
	ukuran_file?: string;
	created_at?: string;
};

type StatCard = {
	label: string;
	value: number | string;
	accent: string;
};

export default function ManajemenGaleri() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('galeri');
	const [items, setItems] = useState<GaleriItem[]>([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [confirmState, setConfirmState] = useState({
		open: false,
		title: 'Konfirmasi',
		message: '',
		onConfirm: () => {},
	});

	useEffect(() => {
		loadGaleri();
	}, [search]);

	const stats: StatCard[] = useMemo(() => {
		const total = items.length;
		const monthUploads = items.filter((i) => isThisMonth(i.created_at)).length;
		return [
			{ label: 'Total Foto', value: total, accent: 'text-blue-600' },
			{ label: 'Upload Bulan Ini', value: monthUploads, accent: 'text-emerald-600' },
			{ label: 'Total Dokumentasi', value: total, accent: 'text-purple-600' },
		];
	}, [items]);

	const loadGaleri = async () => {
		try {
			setLoading(true);
			setError(null);

			if (!supabase) {
				setItems(buildFallback());
				return;
			}

			let query = supabase.from('galeri_kelurahan').select('*').order('created_at', { ascending: false });

			if (search.trim()) {
				query = query.ilike('judul', `%${search}%`);
			}

			const { data, error: fetchError } = await query;
			if (fetchError) throw fetchError;
			setItems((data as GaleriItem[]) || []);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memuat galeri';
			setError(message);
			setItems(buildFallback());
		} finally {
			setLoading(false);
		}
	};

	// Pagination logic
	const totalPages = Math.ceil(items.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedItems = items.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleDeleteGaleri = async (id: string, judul: string) => {
		setConfirmState({
			open: true,
			title: 'Hapus Foto',
			message: `Apakah Anda yakin ingin menghapus "${judul}"?`,
			onConfirm: async () => {
				try {
					if (!supabase) return;

					const { error: deleteError } = await supabase
						.from('galeri_kelurahan')
						.delete()
						.eq('id', id);

					if (deleteError) throw deleteError;

					setItems((prev) => prev.filter((item) => item.id !== id));
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Gagal menghapus foto';
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
				<AdminSidebar activeKey={activeNav} onSelect={setActiveNav} />

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
								placeholder="Cari foto..."
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
							<h2 className="text-2xl font-bold">Manajemen Galeri</h2>
							<p className="text-sm text-gray-500">Kelola foto dan dokumentasi kegiatan kelurahan</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => navigate('/admin/tambah-galeri')}
								className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
							>
								⬆ Upload Foto
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
											<th className="px-4 py-3">Preview</th>
											<th className="px-4 py-3">Nama File</th>
											<th className="px-4 py-3">Tanggal Upload</th>
											<th className="px-4 py-3">Ukuran File</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{loading && (
											<tr>
												<td colSpan={7} className="px-4 py-6 text-center text-gray-500">Memuat data...</td>
											</tr>
										)}

			<ConfirmDialog
				open={confirmState.open}
				title={confirmState.title}
				message={confirmState.message}
				onConfirm={confirmState.onConfirm}
				onCancel={() => setConfirmState((prev) => ({ ...prev, open: false }))}
				confirmText="Hapus"
				cancelText="Batal"
			/>
									{!loading && paginatedItems.length === 0 && (
										<tr>
											<td colSpan={7} className="px-4 py-6 text-center text-gray-500">Belum ada data galeri</td>
										</tr>
									)}
									{!loading &&
										paginatedItems.map((item) => (
												<tr key={item.id} className="hover:bg-gray-50">
													<td className="px-4 py-3 align-middle">
														<div className="h-10 w-16 bg-emerald-200 rounded overflow-hidden flex items-center justify-center">
															{item.url ? (
																<img src={item.url} alt={item.judul} className="h-full w-full object-cover" />
															) : (
																<span className="text-lg">🖼️</span>
															)}
														</div>
													</td>
													<td className="px-4 py-3 align-middle">
														<div className="font-semibold text-gray-800">{item.judul}</div>

													</td>
													<td className="px-4 py-3 align-middle text-gray-600">
														{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
													</td>
													<td className="px-4 py-3 align-middle text-gray-700">
													{item.ukuran_file || '-'}
												</td>
												<td className="px-4 py-3 align-middle text-right space-x-2 flex justify-end">
													<button 
														onClick={() => navigate(`/admin/edit-galeri/${item.id}`)}
														className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs" 
														title="Edit"
													>
														Edit
													</button>
													<button 
														onClick={() => handleDeleteGaleri(item.id, item.judul)}
														className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs" 
														title="Hapus"
													>
														Hapus
													</button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
							
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
									<div className="text-sm text-gray-600">
										Menampilkan {startIndex + 1}-{Math.min(endIndex, items.length)} dari {items.length} entri
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											← Sebelumnya
										</button>
										<div className="flex gap-1">
											{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
												<button
													key={page}
													onClick={() => handlePageChange(page)}
													className={`px-3 py-1 rounded-lg text-sm ${
														currentPage === page
															? 'bg-emerald-500 text-white'
															: 'border border-gray-300 hover:bg-gray-50'
													}`}
												>
													{page}
												</button>
											))}
										</div>
										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Selanjutnya →
										</button>
									</div>
								</div>
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

function isThisMonth(dateString?: string) {
	if (!dateString) return false;
	const d = new Date(dateString);
	const now = new Date();
	return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function buildFallback(): GaleriItem[] {
	return Array.from({ length: 8 }).map((_, idx) => ({
		id: `demo-${idx}`,
		judul: `Kegiatan Gotong Royong ${idx + 1}`,
		deskripsi: 'Dokumentasi kegiatan gotong royong kelurahan',
		ukuran_file: `${(Math.random() * 5 + 0.5).toFixed(2)} MB`,
		created_at: new Date().toISOString(),
		url: '',
	}));
}
