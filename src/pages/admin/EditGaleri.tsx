import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';

type UploadFile = {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
};

export default function EditGaleri() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeNav, setActiveNav] = useState('galeri');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [judul, setJudul] = useState('');
  const [existingUrl, setExistingUrl] = useState('');
  const [existingSize, setExistingSize] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const totalSize = useMemo(() => files.reduce((acc, f) => acc + f.file.size, 0), [files]);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (itemId: string) => {
    try {
      setLoading(true);
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error: fetchError } = await supabase
        .from('galeri_kelurahan')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Data tidak ditemukan');

      setJudul(data.judul || '');
      setExistingUrl(data.url || '');
      setExistingSize(data.ukuran_file || '');
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const mapped = newFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    setFiles(mapped); // single file edit: replace selection
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles([e.target.files[0]]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) {
      addFiles([e.dataTransfer.files[0]]);
    }
  };

  const updateFile = (fileId: string, changes: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...changes } : f)));
  };

  const updateFileAll = (changes: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => ({ ...f, ...changes })));
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSave = async () => {
    if (!judul.trim()) {
      setError('Judul harus diisi');
      return;
    }
    if (!id) {
      setError('ID galeri tidak valid');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      if (!supabase) throw new Error('Supabase not initialized');

      let finalUrl = existingUrl;
      let finalSize = existingSize;

      if (files.length) {
        // upload new file
        const fileItem = files[0];
        updateFile(fileItem.id, { status: 'uploading', progress: 10 });

        const path = `${Date.now()}-${fileItem.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('galeri_foto')
          .upload(path, fileItem.file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from('galeri_foto').getPublicUrl(path);
        finalUrl = publicUrl?.publicUrl || finalUrl;
        finalSize = formatSize(fileItem.file.size);
        updateFile(fileItem.id, { status: 'done', progress: 100 });
      }

      const { error: updateError } = await supabase
        .from('galeri_kelurahan')
        .update({ judul: judul.trim(), url: finalUrl, ukuran_file: finalSize })
        .eq('id', id);
      if (updateError) throw updateError;

      alert('Data galeri berhasil diperbarui');
      navigate('/admin/manajemen-galeri');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui galeri';
      setError(message);
      updateFileAll({ status: 'error' });
    } finally {
      setUploading(false);
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
              <h2 className="text-2xl font-bold">Edit Foto Galeri</h2>
              <p className="text-sm text-gray-500">Perbarui judul atau ganti foto yang sudah ada</p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Preview existing */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Foto saat ini</p>
              <div className="flex items-center gap-4">
                <div className="h-24 w-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {existingUrl ? (
                    <img src={existingUrl} alt={judul} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-400">🖼️</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><span className="font-semibold text-gray-800">Judul:</span> {judul || '-'}</div>
                  <div><span className="font-semibold text-gray-800">Ukuran:</span> {existingSize || '-'}</div>
                </div>
              </div>
            </div>

            {/* Dropzone for new file (optional) */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:border-emerald-500 transition"
            >
              <div className="text-3xl mb-2">⬆</div>
              <p className="font-semibold text-gray-700">Ganti Foto (Opsional)</p>
              <p className="text-sm text-gray-500 mb-3">Drag & drop atau klik untuk memilih 1 file baru</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
              <label
                htmlFor="file-input"
                className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
              >
                Pilih file
              </label>
              <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, GIF - Maks 5MB</p>
            </div>

            {/* New file list */}
            {files.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-800">File baru ({files.length})</p>
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

            {/* Judul */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Judul <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan judul foto..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={uploading || loading}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-semibold"
              >
                {uploading ? 'Menyimpan...' : '💾 Simpan Perubahan'}
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
