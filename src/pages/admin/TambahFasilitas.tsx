import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

export default function TambahFasilitas() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('fasilitas');
	const [namaFasilitas, setNamaFasilitas] = useState('');
	const [alamat, setAlamat] = useState('');
	const [lingkungan, setLingkungan] = useState('');
	const [kategori, setKategori] = useState('Sekolah');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!namaFasilitas.trim()) {
			setError('Nama fasilitas harus diisi');
			return;
		}

		if (!alamat.trim()) {
			setError('Alamat harus diisi');
			return;
		}

		if (!lingkungan.trim()) {
			setError('Lingkungan harus diisi');
			return;
		}

		setLoading(true);

		try {
			if (!supabase) {
				throw new Error('Supabase client not configured');
			}

			const { error: insertError } = await supabase.from('fasilitas_umum').insert({
				nama_fasilitas: namaFasilitas,
				alamat: alamat,
				lingkungan: lingkungan,
				kategori: kategori,
			});

			if (insertError) throw insertError;

			alert('Fasilitas berhasil ditambahkan');
			navigate('/admin/manajemen-fasilitas');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal menambah fasilitas';
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
							<h2 className="text-2xl font-bold">Tambah Fasilitas Baru</h2>
							<p className="text-sm text-gray-500">Tambahkan data fasilitas baru ke database</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Nama Fasilitas <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={namaFasilitas}
									onChange={(e) => setNamaFasilitas(e.target.value)}
									placeholder="Masukkan nama fasilitas..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Alamat <span className="text-red-500">*</span>
								</label>
								<textarea
									value={alamat}
									onChange={(e) => setAlamat(e.target.value)}
									placeholder="Masukkan alamat fasilitas..."
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Lingkungan <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={lingkungan}
									onChange={(e) => setLingkungan(e.target.value)}
									placeholder="Masukkan lingkungan..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Kategori <span className="text-red-500">*</span>
								</label>
								<select
									value={kategori}
									onChange={(e) => setKategori(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
								>
									<option value="Sekolah">Sekolah</option>
									<option value="Fasilitas Kesehatan">Fasilitas Kesehatan</option>
									<option value="Tempat Ibadah">Tempat Ibadah</option>
									<option value="Kantor Pelayanan">Kantor Pelayanan</option>
								</select>
							</div>

							{/* Actions */}
							<div className="flex gap-3 pt-4">
								<button
									type="submit"
									disabled={loading}
									className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-semibold transition"
								>
									{loading ? 'Menyimpan...' : '✓ Tambah Fasilitas'}
								</button>
								<button
									type="button"
									onClick={() => navigate('/admin/manajemen-fasilitas')}
									className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-semibold transition"
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
