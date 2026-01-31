import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

type Asset = {
	id: string;
	name: string;
	description: string;
	bucketPath: string;
	currentUrl: string;
	uploadingFile: File | null;
	uploadingProgress: number;
	uploadingStatus: 'idle' | 'uploading' | 'done' | 'error';
};

export default function ManajemenAset() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('aset');
	const [assets, setAssets] = useState<Asset[]>([
		{
			id: 'bagan-struktur',
			name: 'Bagan Struktur Organisasi',
			description: 'Tampil di halaman Pemerintahan',
			bucketPath: 'pemerintahan/Bagan_Struktur_Baju_Bodoa.png',
			currentUrl: '',
			uploadingFile: null,
			uploadingProgress: 0,
			uploadingStatus: 'idle',
		},
		{
			id: 'pembagian-wilayah',
			name: 'Peta Pembagian Wilayah',
			description: 'Tampil di bagian Wilayah Administratif pada halaman Infografis',
			bucketPath: 'pemerintahan/Pembagian_Wilayah.png',
			currentUrl: '',
			uploadingFile: null,
			uploadingProgress: 0,
			uploadingStatus: 'idle',
		},
		{
			id: 'kepala-kelurahan',
			name: 'Foto Kepala Kelurahan',
			description: 'Tampil di halaman Beranda (Homepage)',
			bucketPath: 'pemerintahan/Kepala_Kelurahan.png',
			currentUrl: '',
			uploadingFile: null,
			uploadingProgress: 0,
			uploadingStatus: 'idle',
		},
	]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load current images from Supabase
	useEffect(() => {
		loadAssets();
	}, []);

    const client = supabase;
	const loadAssets = async () => {
		try {
			setLoading(true);
			setError(null);

			if (!client) {
				throw new Error('Supabase client not configured');
			}

			const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
			const updatedAssets = await Promise.all(
				assets.map(async (asset) => {
					try {
						const { data } = client.storage.from(bucket).getPublicUrl(asset.bucketPath);
                        const timestamp = new Date().getTime(); // Generates a unique number
                        const bustedUrl = `${data?.publicUrl}?t=${timestamp}`;
						return {
							...asset,
							currentUrl: bustedUrl || '',
						};
					} catch (err) {
						console.error(`Error loading ${asset.id}:`, err);
						return asset;
					}
				})
			);

			setAssets(updatedAssets);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal memuat aset';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handleFileSelect = (assetId: string, file: File | null) => {
		// Validate file
		if (file) {
			if (!file.type.startsWith('image/')) {
				setError('File harus berupa gambar');
				return;
			}

			if (file.size > 10 * 1024 * 1024) {
				setError('Ukuran file maksimal 10MB');
				return;
			}
		}

		setAssets((prev) =>
			prev.map((asset) =>
				asset.id === assetId
					? {
							...asset,
							uploadingFile: file,
						}
					: asset
			)
		);
		setError(null);
	};

const handleUpload = async (assetId: string) => {
	const asset = assets.find((a) => a.id === assetId);
	if (!asset || !asset.uploadingFile) return;

	try {
		setAssets(prev => prev.map(a => a.id === assetId ? { ...a, uploadingStatus: 'uploading' } : a));

		const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
		const file = asset.uploadingFile;
		
		// Use the EXACT original path to ensure we overwrite the correct file
		const filePath = asset.bucketPath; 

		// 1. Upload with UPSERT (no need to manually delete first)
		const { error: uploadError } = await supabase!.storage
			.from(bucket)
			.upload(filePath, file, { 
				upsert: true,
				contentType: file.type // Ensure correct mime-type
			});

		if (uploadError) throw uploadError;

		// 2. Get Public URL with Cache Buster
		const { data } = supabase!.storage.from(bucket).getPublicUrl(filePath);
		const publicUrl = `${data?.publicUrl}?t=${new Date().getTime()}`;

		setAssets((prev) =>
			prev.map((a) =>
				a.id === assetId
					? {
						...a,
						currentUrl: publicUrl,
						uploadingFile: null,
						uploadingStatus: 'done',
					}
					: a
			)
		);

		setTimeout(() => {
			setAssets((prev) =>
				prev.map((a) =>
					a.id === assetId
						? {
								...a,
								uploadingStatus: 'idle',
								uploadingProgress: 0,
							}
						: a
				)
			);
		}, 2000);

		alert('Aset berhasil diperbarui');
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Gagal upload aset';
		setError(message);
		setAssets((prev) =>
			prev.map((a) =>
				a.id === assetId
					? {
							...a,
							uploadingStatus: 'error',
						}
					: a
			)
		);
	}
};

	const handleCancel = (assetId: string) => {
		setAssets((prev) =>
			prev.map((asset) =>
				asset.id === assetId
					? {
							...asset,
							uploadingFile: null,
							uploadingProgress: 0,
							uploadingStatus: 'idle',
						}
					: asset
			)
		);
		setError(null);
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
							<h2 className="text-2xl font-bold">Manajemen Aset</h2>
							<p className="text-sm text-gray-500">Kelola gambar yang ditampilkan di halaman publik</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{loading ? (
							<div className="text-center py-12 text-gray-500">Memuat aset...</div>
						) : (
							<div className="space-y-6">
								{assets.map((asset) => (
									<div
										key={asset.id}
										className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
									>
										{/* Header */}
										<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-gray-200">
											<h3 className="font-bold text-gray-900 text-lg">{asset.name}</h3>
											<p className="text-sm text-gray-600 mt-1">{asset.description}</p>
										</div>

										{/* Content */}
										<div className="p-6 space-y-4">
											{/* Current Image */}
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-3">
													Gambar Saat Ini
												</label>
												{asset.currentUrl ? (
													<div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
														<img
															src={asset.currentUrl}
															alt={asset.name}
															className="w-full h-auto max-h-96 object-contain"
														/>
													</div>
												) : (
													<div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 p-8 text-center text-gray-500">
														Gambar tidak ditemukan
													</div>
												)}
											</div>

											{/* Upload Section */}
											<div className="border-t border-gray-200 pt-4">
												<label className="block text-sm font-semibold text-gray-700 mb-3">
													Ganti Gambar
												</label>

												{asset.uploadingFile ? (
													<div className="space-y-3">
														<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
															<div className="flex items-center gap-3 mb-3">
																<div className="h-12 w-12 rounded bg-emerald-200 flex items-center justify-center text-xl">
																	🖼️
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium text-gray-800 truncate">
																		{asset.uploadingFile.name}
																	</p>
																	<p className="text-xs text-gray-500">
																		{(asset.uploadingFile.size / 1024 / 1024).toFixed(2)} MB
																	</p>
																</div>
															</div>

															{/* Progress bar */}
															<div className="space-y-2">
																<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
																	<div
																		className={`h-full transition-all ${
																			asset.uploadingStatus === 'done'
																				? 'bg-emerald-500'
																				: asset.uploadingStatus === 'error'
																					? 'bg-red-500'
																					: 'bg-emerald-500'
																		}`}
																		style={{ width: `${asset.uploadingProgress}%` }}
																	/>
																</div>
																<p className="text-xs text-gray-600">
																	{asset.uploadingProgress}% - {asset.uploadingStatus}
																</p>
															</div>
														</div>

														<div className="flex gap-2">
															<button
																onClick={() => handleUpload(asset.id)}
																disabled={asset.uploadingStatus === 'uploading'}
																className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-medium transition"
															>
																{asset.uploadingStatus === 'uploading' ? 'Mengupload...' : 'Upload'}
															</button>
															<button
																onClick={() => handleCancel(asset.id)}
																disabled={asset.uploadingStatus === 'uploading'}
																className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition"
															>
																Batal
															</button>
														</div>
													</div>
												) : (
													<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition cursor-pointer bg-gray-50">
														<input
															type="file"
															accept="image/*"
															onChange={(e) => handleFileSelect(asset.id, e.target.files?.[0] || null)}
															className="hidden"
															id={`file-input-${asset.id}`}
														/>
														<label
															htmlFor={`file-input-${asset.id}`}
															className="cursor-pointer block space-y-2"
														>
															<div className="text-4xl">⬆️</div>
															<div>
																<p className="font-semibold text-gray-700">Pilih atau drag gambar di sini</p>
																<p className="text-sm text-gray-500 mt-1">
																	Format: JPG, PNG, GIF - Maksimal 10MB
																</p>
															</div>
														</label>
													</div>
												)}
											</div>

											{/* File Path Info */}
											<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
												<p className="text-xs font-mono text-blue-900 break-all">
													📁 {asset.bucketPath}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
