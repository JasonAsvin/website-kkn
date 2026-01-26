import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';
import { useStrukturOrganisasi } from '../../services/useStrukturOrganisasi';

export default function TambahStruktur() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	
	const [activeNav, setActiveNav] = useState('struktur');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadingFoto, setUploadingFoto] = useState(false);

	// Form fields
	const [nama, setNama] = useState('');
	const [jabatan, setJabatan] = useState('');
	const [nip, setNip] = useState('');
	const [parentId, setParentId] = useState<string>('');
	const [urutan, setUrutan] = useState<number>(1);
	const [fotoUrl, setFotoUrl] = useState<string>('');
	const [fotoFile, setFotoFile] = useState<File | null>(null);
	const [fotoPreview, setFotoPreview] = useState<string>('');

	const { data: allPegawai } = useStrukturOrganisasi();

	// Load existing data in edit mode
	useEffect(() => {
		if (isEditMode && id) {
			loadPegawaiData(id);
		}
	}, [isEditMode, id]);

	const loadPegawaiData = async (pegawaiId: string) => {
		try {
			setLoading(true);
			if (!supabase) throw new Error('Supabase not initialized');

			const { data, error: fetchError } = await supabase
				.from('struktur_organisasi')
				.select('*')
				.eq('id', pegawaiId)
				.single();

			if (fetchError) throw fetchError;

			if (data) {
				setNama(data.nama || '');
				setJabatan(data.jabatan || '');
				setNip(data.nomor_nip || '');
				setParentId(data.parent_id || '');
				setUrutan(data.urutan || 1);
				setFotoUrl(data.foto_url || '');
				setFotoPreview(data.foto_url || '');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memuat data pegawai';
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

	const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setError('File harus berupa gambar');
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError('Ukuran file maksimal 5MB');
				return;
			}

			setFotoFile(file);
			setFotoPreview(URL.createObjectURL(file));
			setError(null);
		}
	};

	const uploadFoto = async (): Promise<string | null> => {
		if (!fotoFile || !supabase) return fotoUrl || null;

		try {
			setUploadingFoto(true);
			const fileExt = fotoFile.name.split('.').pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `struktur/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from('galeri_foto')
				.upload(filePath, fotoFile);

			if (uploadError) throw uploadError;

			const { data } = supabase.storage.from('galeri_foto').getPublicUrl(filePath);

			return data.publicUrl;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal upload foto';
			setError(message);
			return null;
		} finally {
			setUploadingFoto(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validation
		if (!nama.trim()) {
			setError('Nama harus diisi');
			return;
		}
		if (!jabatan.trim()) {
			setError('Jabatan harus diisi');
			return;
		}

		try {
			setLoading(true);
			setError(null);

			if (!supabase) throw new Error('Supabase not initialized');

			// Upload foto if new file selected
			let finalFotoUrl = fotoUrl;
			if (fotoFile) {
				const uploadedUrl = await uploadFoto();
				if (uploadedUrl) {
					finalFotoUrl = uploadedUrl;
				}
			}

			const pegawaiData = {
				nama: nama.trim(),
				jabatan: jabatan.trim(),
				nomor_nip: nip.trim() || null,
				parent_id: parentId || null,
				urutan: urutan,
				foto_url: finalFotoUrl || null,
			};

			if (isEditMode && id) {
				// Update existing
				const { error: updateError } = await supabase
					.from('struktur_organisasi')
					.update(pegawaiData)
					.eq('id', id);

				if (updateError) throw updateError;
				alert('Data pegawai berhasil diupdate');
			} else {
				// Insert new
				const { error: insertError } = await supabase
					.from('struktur_organisasi')
					.insert([pegawaiData]);

				if (insertError) throw insertError;
				alert('Data pegawai berhasil ditambahkan');
			}

			navigate('/admin/manajemen-struktur');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	// Filter parent options (exclude self in edit mode)
	const parentOptions = allPegawai.filter(p => p.id !== id);

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
							<h2 className="text-2xl font-bold">
								{isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
							</h2>
							<p className="text-sm text-gray-500">
								{isEditMode ? 'Update informasi pegawai' : 'Tambahkan pegawai ke struktur organisasi'}
							</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
							{/* Foto Upload */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Foto Pegawai
								</label>
								<div className="flex items-start gap-4">
									{fotoPreview && (
										<img
											src={fotoPreview}
											alt="Preview"
											className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
										/>
									)}
									<div className="flex-1">
										<input
											type="file"
											accept="image/*"
											onChange={handleFotoChange}
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
										/>
										<p className="mt-1 text-xs text-gray-500">Format: JPG, PNG. Maksimal 5MB</p>
									</div>
								</div>
							</div>

							{/* Nama */}
							<div>
								<label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
									Nama Lengkap <span className="text-red-500">*</span>
								</label>
								<input
									id="nama"
									type="text"
									value={nama}
									onChange={(e) => setNama(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									required
								/>
							</div>

							{/* Jabatan */}
							<div>
								<label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-2">
									Jabatan <span className="text-red-500">*</span>
								</label>
								<input
									id="jabatan"
									type="text"
									value={jabatan}
									onChange={(e) => setJabatan(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Contoh: Kepala Seksi"
									required
								/>
							</div>

							{/* NIP */}
							<div>
								<label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-2">
									Nomor Induk Pegawai (NIP)
								</label>
								<input
									id="nip"
									type="text"
									value={nip}
									onChange={(e) => setNip(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="Contoh: 198501012010011001"
								/>
							</div>

							{/* Parent Selection */}
							<div>
								<label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-2">
									Atasan / Parent
								</label>
								<select
									id="parent"
									value={parentId}
									onChange={(e) => setParentId(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
								>
									<option value="">-- Tidak ada atasan (Pimpinan Tertinggi) --</option>
									{parentOptions.map((pegawai) => (
										<option key={pegawai.id} value={pegawai.id}>
											{pegawai.nama} - {pegawai.jabatan}
										</option>
									))}
								</select>
								<p className="mt-1 text-xs text-gray-500">
									Pilih atasan langsung dari pegawai ini. Kosongkan jika pegawai adalah pimpinan tertinggi (Lurah).
								</p>
							</div>

							{/* Urutan */}
							<div>
								<label htmlFor="urutan" className="block text-sm font-medium text-gray-700 mb-2">
									Urutan
								</label>
								<input
									id="urutan"
									type="number"
									min="1"
									value={urutan}
									onChange={(e) => setUrutan(parseInt(e.target.value) || 1)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
								<p className="mt-1 text-xs text-gray-500">
									Menentukan urutan tampilan pada level yang sama. Angka lebih kecil akan muncul lebih dahulu.
								</p>
							</div>

							{/* Submit Buttons */}
							<div className="flex gap-3 pt-4 border-t border-gray-200">
								<button
									type="submit"
									disabled={loading || uploadingFoto}
									className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading || uploadingFoto ? 'Menyimpan...' : isEditMode ? 'Update Pegawai' : 'Tambah Pegawai'}
								</button>
								<button
									type="button"
									onClick={() => navigate('/admin/manajemen-struktur')}
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
