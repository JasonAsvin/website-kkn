import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

type UploadFile = {
	id: string;
	file: File;
	progress: number;
	status: 'pending' | 'uploading' | 'done' | 'error';
};

export default function TambahGaleri() {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState('galeri');
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [judul, setJudul] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);

	const totalSize = useMemo(() => files.reduce((acc, f) => acc + f.file.size, 0), [files]);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files?.length) {
			addFiles(Array.from(e.dataTransfer.files));
		}
	};

	const addFiles = (newFiles: File[]) => {
		const mapped = newFiles.map((file) => ({
			id: `${file.name}-${file.size}-${Date.now()}`,
			file,
			progress: 0,
			status: 'pending' as const,
		}));
		setFiles((prev) => [...prev, ...mapped]);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			addFiles(Array.from(e.target.files));
		}
	};

	const handleUpload = async () => {
		if (!files.length) {
			setError('Tambahkan minimal satu foto');
			return;
		}
		if (!judul.trim()) {
			setError('Judul harus diisi');
			return;
		}
		setError(null);
		setUploading(true);

		try {
			for (const fileItem of files) {
				updateFile(fileItem.id, { status: 'uploading', progress: 5 });

				// Upload to Supabase Storage if configured
				if (supabase) {
					const path = `${Date.now()}-${fileItem.file.name}`;
					const { error: uploadError } = await supabase.storage.from('galeri_foto').upload(path, fileItem.file, {
						cacheControl: '3600',
						upsert: false,
					});
					if (uploadError) throw uploadError;

					const { data: publicUrl } = supabase.storage.from('galeri_foto').getPublicUrl(path);

				    const { error: insertError } = await supabase.from('galeri_kelurahan').insert({
                        judul: judul,
                        url: publicUrl?.publicUrl || '',
                        ukuran_file: formatSize(fileItem.file.size),
                    });
                    if (insertError) throw insertError;
				} else {
					// Simulated progress for fallback
					await new Promise((res) => setTimeout(res, 300));
				}

				updateFile(fileItem.id, { status: 'done', progress: 100 });
			}

			alert('Upload selesai');
			handleUploadSuccess();
			navigate('/admin/manajemen-galeri');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Gagal upload foto';
			setError(message);
			updateFileAll({ status: 'error' });
		} finally {
			setUploading(false);
		}
	};

	const handleUploadSuccess = () => {
		setJudul('');
		setFiles([]);
	};

	const updateFile = (id: string, changes: Partial<UploadFile>) => {
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...changes } : f)));
	};

	const updateFileAll = (changes: Partial<UploadFile>) => {
		setFiles((prev) => prev.map((f) => ({ ...f, ...changes })));
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id));
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
							<h2 className="text-2xl font-bold">Upload Foto Baru</h2>
							<p className="text-sm text-gray-500">Upload dan kelola foto untuk galeri kelurahan</p>
						</div>

						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
								{error}
							</div>
						)}

						{/* Dropzone */}
						<div
							onDrop={handleDrop}
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-white hover:border-emerald-500 transition"
						>
							<div className="text-4xl mb-3">⬆</div>
							<p className="font-semibold text-gray-700">Upload Foto</p>
							<p className="text-sm text-gray-500 mb-4">Drag & drop foto di sini atau klik untuk memilih file</p>
							<input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-input" />
							<label
								htmlFor="file-input"
								className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
							>
								Pilih file
							</label>
							<p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, GIF - Maks 5MB per file</p>
						</div>

						{/* Files list */}
						{files.length > 0 && (
							<div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
								<p className="text-sm font-semibold text-gray-800">File yang akan diupload ({files.length})</p>
								<div className="space-y-3">
									{files.map((item) => (
										<div key={item.id} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
											<div className="h-10 w-10 rounded bg-emerald-200 flex items-center justify-center text-lg">🖼️</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-800 truncate">{item.file.name}</p>
												<p className="text-xs text-gray-500">{formatSize(item.file.size)}</p>
												<div className="h-2 bg-gray-100 rounded mt-2 overflow-hidden">
													<div
														className={`h-full transition-all ${item.status === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}
														style={{ width: `${item.progress}%` }}
													/>
												</div>
											</div>
											<div className="text-xs text-gray-500 w-20 text-right">
												{item.status === 'uploading' && 'Uploading'}
												{item.status === 'done' && 'Selesai'}
												{item.status === 'error' && 'Gagal'}
												{item.status === 'pending' && 'Siap'}
											</div>
											<button
												onClick={() => removeFile(item.id)}
												className="text-red-500 hover:text-red-600 text-lg"
												aria-label="Remove"
											>
												×
											</button>
										</div>
									))}
								</div>
								<div className="text-xs text-gray-500">Total size: {formatSize(totalSize)}</div>
							</div>
						)}

						{/* Settings */}
						<div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
							<div>
							<label className="block text-sm font-semibold text-gray-900 mb-2">Judul <span className="text-red-500">*</span></label>
							<input
								type="text"
								value={judul}
								onChange={(e) => setJudul(e.target.value)}
								placeholder="Masukkan judul foto..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3">
							<button
								onClick={handleUpload}
								disabled={uploading}
								className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-semibold"
							>
								{uploading ? 'Mengunggah...' : '⬆ Upload Foto'}
							</button>
							<button
								onClick={() => navigate('/admin/manajemen-galeri')}
								className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-semibold"
							>
								Batal
							</button>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

function formatSize(bytes: number) {
	if (!bytes) return '0 MB';
	const mb = bytes / (1024 * 1024);
	return `${mb.toFixed(2)} MB`;
}
