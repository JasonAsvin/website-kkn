import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

export default function EditPenduduk() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [activeNav, setActiveNav] = useState('penduduk');
	const [namaLingkungan, setNamaLingkungan] = useState('');
	const [jumlahPenduduk, setJumlahPenduduk] = useState('');
	const [pendudukLakilaki, setPendudukLakilaki] = useState('');
	const [pendudukPerempuan, setPendudukPerempuan] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetchingData, setFetchingData] = useState(true);

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

	useEffect(() => {
		const fetchData = async () => {
			if (!id || !supabase) return;

			try {
				const { data, error: fetchError } = await supabase
					.from('total_penduduk')
					.select('*')
					.eq('id', id)
					.single();

				if (fetchError) throw fetchError;

				if (data) {
					setNamaLingkungan(data.nama_lingkungan);
					setJumlahPenduduk(data.jumlah_penduduk.toString());
					setPendudukLakilaki(data.penduduk_lakilaki.toString());
					setPendudukPerempuan(data.penduduk_perempuan.toString());
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Gagal memuat data';
				setError(message);
			} finally {
				setFetchingData(false);
			}
		};

		fetchData();
	}, [id]);

	// Auto-calculate total when male or female changes
	useEffect(() => {
		const male = parseInt(pendudukLakilaki) || 0;
		const female = parseInt(pendudukPerempuan) || 0;
		setJumlahPenduduk((male + female).toString());
	}, [pendudukLakilaki, pendudukPerempuan]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!namaLingkungan.trim()) {
			setError('Nama lingkungan harus diisi');
			return;
		}

		const male = parseInt(pendudukLakilaki) || 0;
		const female = parseInt(pendudukPerempuan) || 0;
		const total = male + female;

		if (total < 0) {
			setError('Jumlah penduduk tidak valid');
			return;
		}

		setLoading(true);

		try {
			if (!supabase) {
				throw new Error('Supabase client not configured');
			}

			const { error: updateError } = await supabase
				.from('total_penduduk')
				.update({
					nama_lingkungan: namaLingkungan,
					jumlah_penduduk: total,
					penduduk_lakilaki: male,
					penduduk_perempuan: female,
				})
				.eq('id', id);

			if (updateError) throw updateError;

			alert('Data penduduk berhasil diperbarui');
			navigate('/admin/manajemen-penduduk');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memperbarui data';
			setError(message);
		} finally {
			setLoading(false);
		}
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
					</header>

					{/* Content */}
					<main className="p-6 space-y-6">
						<div>
							<h2 className="text-2xl font-bold">Edit Data Penduduk</h2>
							<p className="text-sm text-gray-500">Perbarui data penduduk lingkungan</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{fetchingData ? (
							<div className="text-center py-12">
								<p className="text-gray-500">Memuat data...</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
								<div>
									<label className="block text-sm font-semibold text-gray-900 mb-2">
										Nama Lingkungan <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={namaLingkungan}
										onChange={(e) => setNamaLingkungan(e.target.value)}
										placeholder="Masukkan nama lingkungan..."
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">
											Penduduk Laki-laki <span className="text-red-500">*</span>
										</label>
										<input
											type="number"
											value={pendudukLakilaki}
											onChange={(e) => setPendudukLakilaki(e.target.value)}
											placeholder="0"
											min="0"
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">
											Penduduk Perempuan <span className="text-red-500">*</span>
										</label>
										<input
											type="number"
											value={pendudukPerempuan}
											onChange={(e) => setPendudukPerempuan(e.target.value)}
											placeholder="0"
											min="0"
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-900 mb-2">
										Total Penduduk
									</label>
									<input
										type="text"
										value={parseInt(jumlahPenduduk).toLocaleString('id-ID')}
										disabled
										className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
									/>
									<p className="text-xs text-gray-500 mt-1">Total otomatis dihitung dari jumlah laki-laki dan perempuan</p>
								</div>

								{/* Actions */}
								<div className="flex gap-3 pt-4">
									<button
										type="submit"
										disabled={loading}
										className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-semibold transition"
									>
										{loading ? 'Menyimpan...' : '✓ Simpan Perubahan'}
									</button>
									<button
										type="button"
										onClick={() => navigate('/admin/manajemen-penduduk')}
										className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-semibold transition"
									>
										Batal
									</button>
								</div>
							</form>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
