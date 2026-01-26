import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { supabase } from '../../services/supabase';
import { usePopulationByLingkungan } from '../../services/usePopulationByLingkungan';

export default function ManajemenPenduduk() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('penduduk');
	const { data: populationData, loading, error } = usePopulationByLingkungan();
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

	const handleDeletePenduduk = async (id: string | undefined, namaLingkungan: string) => {
		if (!id) return;

		setConfirmState({
			open: true,
			title: 'Hapus Data Penduduk',
			message: `Apakah Anda yakin ingin menghapus data penduduk "${namaLingkungan}"?`,
			onConfirm: async () => {
				try {
					if (!supabase) return;

					const { error: deleteError } = await supabase
						.from('total_penduduk')
						.delete()
						.eq('id', id);

					if (deleteError) throw deleteError;

					window.location.reload();
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Gagal menghapus data penduduk';
					setDeleteError(message);
				} finally {
					setConfirmState((prev) => ({ ...prev, open: false }));
				}
			},
		});
	};

	// Calculate totals
	const totals = populationData?.reduce((acc, curr) => ({
		total: acc.total + (curr.jumlah_penduduk || 0),
		male: acc.male + (curr.penduduk_lakilaki || 0),
		female: acc.female + (curr.penduduk_perempuan || 0)
	}), { total: 0, male: 0, female: 0 }) || { total: 0, male: 0, female: 0 };

	const stats = [
		{
			label: 'Total Penduduk',
			value: totals.total.toLocaleString('id-ID'),
			accent: 'text-emerald-600',
		},
		{
			label: 'Laki-laki',
			value: totals.male.toLocaleString('id-ID'),
			accent: 'text-blue-600',
		},
		{
			label: 'Perempuan',
			value: totals.female.toLocaleString('id-ID'),
			accent: 'text-pink-600',
		},
		{
			label: 'Lingkungan',
			value: populationData?.length || 0,
			accent: 'text-teal-600',
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
					</header>

					{/* Content */}
					<main className="p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold">Data Penduduk</h2>
								<p className="text-sm text-gray-500">Kelola data penduduk per lingkungan</p>
							</div>
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

						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							{stats.map((stat) => (
								<div key={stat.label} className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
									<p className="text-xs text-gray-500">{stat.label}</p>
									<p className={`text-xl font-semibold ${stat.accent}`}>{stat.value}</p>
								</div>
							))}
						</div>

						{/* Population Data by Lingkungan */}
						<div className="space-y-4">
							{loading ? (
								<div className="text-center py-12 text-gray-500">Memuat data penduduk...</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{populationData && populationData.length > 0 ? (
										populationData.map((lingkungan) => (
											<div
												key={lingkungan.id}
												className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
											>
												{/* Header */}
												<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-gray-200">
													<h3 className="font-bold text-gray-900 text-lg">{lingkungan.nama_lingkungan}</h3>
												</div>

												{/* Content */}
												<div className="p-6 space-y-4">
													{/* Total */}
													<div className="flex justify-between items-center pb-3 border-b border-gray-200">
														<span className="text-gray-600">Total Penduduk</span>
														<span className="font-bold text-emerald-600 text-xl">
															{lingkungan.jumlah_penduduk.toLocaleString('id-ID')}
														</span>
													</div>

													{/* Male */}
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-500 flex items-center gap-2">
															<span className="text-blue-500">♂</span> Laki-laki
														</span>
														<span className="font-semibold text-blue-600">
															{lingkungan.penduduk_lakilaki.toLocaleString('id-ID')}
														</span>
													</div>

													{/* Female */}
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-500 flex items-center gap-2">
															<span className="text-pink-500">♀</span> Perempuan
														</span>
														<span className="font-semibold text-pink-600">
															{lingkungan.penduduk_perempuan.toLocaleString('id-ID')}
														</span>
													</div>

													{/* Progress bars */}
													<div className="pt-3 border-t border-gray-200">
														<div className="text-xs text-gray-500 mb-2">Komposisi Gender</div>
														<div className="flex gap-2">
															<div className="flex-1">
																<div className="h-2 bg-blue-200 rounded-full overflow-hidden">
																	<div
																		className="h-full bg-blue-500"
																		style={{
																			width: `${(lingkungan.penduduk_lakilaki / lingkungan.jumlah_penduduk) * 100}%`,
																		}}
																	/>
																</div>
																<p className="text-xs text-gray-500 mt-1">
																	{((lingkungan.penduduk_lakilaki / lingkungan.jumlah_penduduk) * 100).toFixed(1)}%
																</p>
															</div>
															<div className="flex-1">
																<div className="h-2 bg-pink-200 rounded-full overflow-hidden">
																	<div
																		className="h-full bg-pink-500"
																		style={{
																			width: `${(lingkungan.penduduk_perempuan / lingkungan.jumlah_penduduk) * 100}%`,
																		}}
																	/>
																</div>
																<p className="text-xs text-gray-500 mt-1">
																	{((lingkungan.penduduk_perempuan / lingkungan.jumlah_penduduk) * 100).toFixed(1)}%
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* Actions */}
												<div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
													<button
														onClick={() => navigate(`/admin/edit-penduduk/${lingkungan.id}`)}
														className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
														title="Edit"
													>
														Edit
													</button>
													<button
														onClick={() => handleDeletePenduduk(lingkungan.id?.toString(), lingkungan.nama_lingkungan)}
														className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
														title="Hapus"
													>
														Hapus
													</button>
												</div>
											</div>
										))
									) : (
										<div className="col-span-full text-center py-12 text-gray-500">
											Belum ada data penduduk.
										</div>
									)}
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
