import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

export default function TambahWilayah() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	
	const [activeNav, setActiveNav] = useState('wilayah');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form fields
	const [namaRT, setNamaRT] = useState('');
	const [namaRW, setNamaRW] = useState('');
	const [namaLingkungan, setNamaLingkungan] = useState('');
	const [namaKetua, setNamaKetua] = useState('');

	// Suggested Lingkungan options from existing data
	const [existingLingkungan, setExistingLingkungan] = useState<string[]>([]);
	const [existingRW, setExistingRW] = useState<string[]>([]);

	useEffect(() => {
		loadExistingOptions();
		if (isEditMode && id) {
			loadWilayahData(id);
		}
	}, [isEditMode, id]);

	const loadExistingOptions = async () => {
		try {
			if (!supabase) return;

			const { data, error: fetchError } = await supabase
				.from('wilayah_administratif')
				.select('nama_lingkungan, nama_rw');

			if (fetchError) throw fetchError;

			if (data) {
				const uniqueLingkungan = Array.from(new Set(data.map(d => d.nama_lingkungan).filter(Boolean))).sort();
				const uniqueRW = Array.from(new Set(data.map(d => d.nama_rw).filter(Boolean))).sort();
				setExistingLingkungan(uniqueLingkungan as string[]);
				setExistingRW(uniqueRW as string[]);
			}
		} catch (err) {
			console.error('Error loading options:', err);
		}
	};

	const loadWilayahData = async (wilayahId: string) => {
		try {
			setLoading(true);
			if (!supabase) throw new Error('Supabase not initialized');

			const { data, error: fetchError } = await supabase
				.from('wilayah_administratif')
				.select('*')
				.eq('id', wilayahId)
				.single();

			if (fetchError) throw fetchError;

			if (data) {
				setNamaRT(data.nama_rt || '');
				setNamaRW(data.nama_rw || '');
				setNamaLingkungan(data.nama_lingkungan || '');
				setNamaKetua(data.nama_ketua || '');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memuat data';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validation
		if (!namaRT.trim()) {
			setError('Nama RT harus diisi');
			return;
		}
		if (!namaRW.trim()) {
			setError('Nama RW harus diisi');
			return;
		}
		if (!namaLingkungan.trim()) {
			setError('Nama Lingkungan harus diisi');
			return;
		}
		if (!namaKetua.trim()) {
			setError('Nama Ketua RT harus diisi');
			return;
		}

		try {
			setLoading(true);
			setError(null);

			if (!supabase) throw new Error('Supabase not initialized');

			const wilayahData = {
				nama_rt: namaRT.trim(),
				nama_rw: namaRW.trim(),
				nama_lingkungan: namaLingkungan.trim(),
				nama_ketua: namaKetua.trim(),
			};

			if (isEditMode && id) {
				// Update existing
				const { error: updateError } = await supabase
					.from('wilayah_administratif')
					.update(wilayahData)
					.eq('id', id);

				if (updateError) throw updateError;
				alert('Data wilayah berhasil diupdate');
			} else {
				// Insert new
				const { error: insertError } = await supabase
					.from('wilayah_administratif')
					.insert([wilayahData]);

				if (insertError) throw insertError;
				alert('Data wilayah berhasil ditambahkan');
			}

			navigate('/admin/manajemen-wilayah');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
			setError(message);
		} finally {
			setLoading(false);
		}
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
					</header>

					{/* Content */}
					<main className="p-6 space-y-6">
						<div>
							<h2 className="text-2xl font-bold">
								{isEditMode ? 'Edit Data RT' : 'Tambah RT Baru'}
							</h2>
							<p className="text-sm text-gray-500">
								{isEditMode ? 'Update informasi RT' : 'Tambahkan RT baru ke wilayah administratif'}
							</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
							{/* Lingkungan */}
							<div>
								<label htmlFor="lingkungan" className="block text-sm font-medium text-gray-700 mb-2">
									Lingkungan <span className="text-red-500">*</span>
								</label>
								<div className="flex gap-2">
									<input
										id="lingkungan"
										type="text"
										value={namaLingkungan}
										onChange={(e) => setNamaLingkungan(e.target.value)}
										className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
										placeholder="Contoh: Kassikebo"
										list="lingkungan-options"
										required
									/>
									<datalist id="lingkungan-options">
										{existingLingkungan.map(l => (
											<option key={l} value={l} />
										))}
									</datalist>
								</div>
								<p className="mt-1 text-xs text-gray-500">
									Pilih dari daftar atau ketik nama baru: {existingLingkungan.join(', ')}
								</p>
							</div>

							{/* RW */}
							<div>
								<label htmlFor="rw" className="block text-sm font-medium text-gray-700 mb-2">
									Nama RW <span className="text-red-500">*</span>
								</label>
								<input
									id="rw"
									type="text"
									value={namaRW}
									onChange={(e) => setNamaRW(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Contoh: RW 01"
									list="rw-options"
									required
								/>
								<datalist id="rw-options">
									{existingRW.map(rw => (
										<option key={rw} value={rw} />
									))}
								</datalist>
								<p className="mt-1 text-xs text-gray-500">
									Format: RW 01, RW 02, dll.
								</p>
							</div>

							{/* RT */}
							<div>
								<label htmlFor="rt" className="block text-sm font-medium text-gray-700 mb-2">
									Nama RT <span className="text-red-500">*</span>
								</label>
								<input
									id="rt"
									type="text"
									value={namaRT}
									onChange={(e) => setNamaRT(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Contoh: RT 001"
									required
								/>
								<p className="mt-1 text-xs text-gray-500">
									Format: RT 001, RT 002, dll.
								</p>
							</div>

							{/* Ketua RT */}
							<div>
								<label htmlFor="ketua" className="block text-sm font-medium text-gray-700 mb-2">
									Nama Ketua RT <span className="text-red-500">*</span>
								</label>
								<input
									id="ketua"
									type="text"
									value={namaKetua}
									onChange={(e) => setNamaKetua(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Contoh: Bapak/Ibu [Nama Lengkap]"
									required
								/>
							</div>

							{/* Submit Buttons */}
							<div className="flex gap-3 pt-4 border-t border-gray-200">
								<button
									type="submit"
									disabled={loading}
									className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Menyimpan...' : isEditMode ? 'Update Data' : 'Tambah RT'}
								</button>
								<button
									type="button"
									onClick={() => navigate('/admin/manajemen-wilayah')}
									className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
								>
									Batal
								</button>
							</div>
						</form>
					</main>
				</div>
			</div>
		</div>
	);
}
