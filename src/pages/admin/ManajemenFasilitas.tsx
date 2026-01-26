import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { supabase } from '../../services/supabase';
import { useFasilitas } from '../../services/useFasilitas';
import type { Facility } from '../../types/infografis';

const categoryConfig = {
	'Sekolah': { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-100', icon: '🏫' },
	'Fasilitas Kesehatan': { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-100', icon: '🏥' },
	'Tempat Ibadah': { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', icon: '🕌' },
	'Kantor Pelayanan': { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', icon: '🏛️' },
};

export default function ManajemenFasilitas() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('fasilitas');
	const { data: allFasilitas, loading, error } = useFasilitas();
	const [search, setSearch] = useState('');
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [confirmState, setConfirmState] = useState({
		open: false,
		title: 'Konfirmasi',
		message: '',
		onConfirm: () => {},
	});

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

	// Group and filter facilities by category
	const facilitiesByCategory = useMemo(() => {
		const grouped: Record<string, Facility[]> = {
			Sekolah: [],
			'Fasilitas Kesehatan': [],
			'Tempat Ibadah': [],
			'Kantor Pelayanan': [],
		};

		allFasilitas.forEach((facility) => {
			const category = facility.kategori as keyof typeof grouped;
			if (category in grouped) {
				if (search.trim() === '' || 
					facility.nama_fasilitas.toLowerCase().includes(search.toLowerCase()) ||
					facility.alamat.toLowerCase().includes(search.toLowerCase())) {
					grouped[category].push(facility);
				}
			}
		});

		return grouped;
	}, [allFasilitas, search]);

	const handleDeleteFasilitas = async (id: string | undefined, namaFasilitas: string) => {
		if (!id) return;

		setConfirmState({
			open: true,
			title: 'Hapus Fasilitas',
			message: `Apakah Anda yakin ingin menghapus "${namaFasilitas}"?`,
			onConfirm: async () => {
				try {
					if (!supabase) return;

					const { error: deleteError } = await supabase
						.from('fasilitas_umum')
						.delete()
						.eq('id', id);

					if (deleteError) throw deleteError;

					window.location.reload();
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Gagal menghapus fasilitas';
					setDeleteError(message);
				} finally {
					setConfirmState((prev) => ({ ...prev, open: false }));
				}
			},
		});
	};

	const stats = [
		{
			label: 'Total Fasilitas',
			value: allFasilitas.length,
			accent: 'text-blue-600',
		},
		{
			label: 'Sekolah',
			value: facilitiesByCategory.Sekolah.length,
			accent: 'text-yellow-600',
		},
		{
			label: 'Fasilitas Kesehatan',
			value: facilitiesByCategory['Fasilitas Kesehatan'].length,
			accent: 'text-red-600',
		},
		{
			label: 'Tempat Ibadah',
			value: facilitiesByCategory['Tempat Ibadah'].length,
			accent: 'text-blue-600',
		},
		{
			label: 'Kantor Pelayanan',
			value: facilitiesByCategory['Kantor Pelayanan'].length,
			accent: 'text-purple-600',
		},	
    ];

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
								placeholder="Cari fasilitas..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>

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
					</header>

					{/* Content */}
					<main className="p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold">Manajemen Fasilitas</h2>
								<p className="text-sm text-gray-500">Kelola data fasilitas umum kelurahan</p>
							</div>
							<button
								onClick={() => navigate('/admin/tambah-fasilitas')}
								className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
							>
								➕ Tambah Fasilitas
							</button>
						</div>

						{deleteError && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{deleteError}
							</div>
						)}

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{/* Total Fasilitas - Standalone */}
						<div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
							<p className="text-xs text-gray-500">Total Fasilitas</p>
							<p className="text-xl font-semibold text-blue-600">{allFasilitas.length}</p>
						</div>

						{/* Category Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							{stats.slice(1).map((stat) => (
								<div key={stat.label} className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
									<p className="text-xs text-gray-500">{stat.label}</p>
									<p className={`text-xl font-semibold ${stat.accent}`}>{stat.value}</p>
								</div>
							))}
						</div>

						{/* Facilities by Category */}
						<div className="space-y-4">
							{loading ? (
								<div className="text-center py-12 text-gray-500">Memuat data fasilitas...</div>
							) : (
								Object.entries(facilitiesByCategory).map(([category, facilities]) => {
									const config = categoryConfig[category as keyof typeof categoryConfig];
									return (
										<div
											key={category}
											className={`border-l-4 ${config.border} rounded-lg overflow-hidden bg-white shadow-sm`}
										>
											{/* Category Header */}
											<div className={`${config.header} px-6 py-3 flex items-center justify-between`}>
												<div className="flex items-center gap-3">
													<span className="text-2xl">{config.icon}</span>
													<div>
														<h3 className="font-bold text-gray-800">{category}</h3>
														<p className="text-sm text-gray-600">Total: {facilities.length}</p>
													</div>
												</div>
											</div>

											{/* Category Content */}
											{facilities.length === 0 ? (
												<div className="px-6 py-4 text-gray-500 text-sm">
													Tidak ada data {category.toLowerCase()}.
												</div>
											) : (
												<div className="divide-y divide-gray-100">
													{facilities.map((facility) => (
														<div
															key={facility.id}
														className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between"
													>
														<div className="flex-1">
															<p className="font-semibold text-gray-800">{facility.nama_fasilitas}</p>
															<p className="text-sm text-gray-500">{facility.alamat}</p>
															<p className="text-xs text-gray-400 mt-1">Lingkungan: {facility.lingkungan}</p>
														</div>
														<div className="flex items-center gap-2">
																<button
																	onClick={() => navigate(`/admin/edit-fasilitas/${facility.id}`)}
																	className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
																	title="Edit"
																>
																	Edit
																</button>
																<button
																	onClick={() => handleDeleteFasilitas(facility.id, facility.nama_fasilitas)}
																	className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
																	title="Hapus"
																>
																	Hapus
																</button>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									);
								})
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
