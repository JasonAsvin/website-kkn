import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { supabase } from '../../services/supabase';
import type { KontenWeb } from '../../services/useKontenWeb';

const emptyForm: KontenWeb = {
  teks_sambutan: '',
  teks_profil: '',
  batas_utara: '',
  batas_selatan: '',
  batas_timur: '',
  batas_barat: '',
  luas_wilayah: '',
  kode_kemendagri: '',
  kode_bps: '',
  kode_pos: '',
  teks_geografis: '',
  teks_visi: '',
  teks_misi: '',
  teks_motto: '',
};

export default function ManajemenKontenWeb() {
  const [activeNav, setActiveNav] = useState('konten-web');
  const [form, setForm] = useState<KontenWeb>(emptyForm);
  const [recordId, setRecordId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadKonten();
  }, []);

  const loadKonten = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { data, error: fetchError } = await supabase
        .from('konten_web')
        .select('*')
        .limit(1);

      if (fetchError) throw fetchError;

      const row = Array.isArray(data) ? data[0] : null;
      if (row) {
        setRecordId(row.id ?? null);
        setForm({
          ...emptyForm,
          ...row,
        });
      } else {
        setRecordId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat konten web';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof KontenWeb, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const payload: KontenWeb = {
        teks_sambutan: form.teks_sambutan?.trim() || null,
        teks_profil: form.teks_profil?.trim() || null,
        batas_utara: form.batas_utara?.trim() || null,
        batas_selatan: form.batas_selatan?.trim() || null,
        batas_timur: form.batas_timur?.trim() || null,
        batas_barat: form.batas_barat?.trim() || null,
        luas_wilayah: form.luas_wilayah?.trim() || null,
        kode_kemendagri: form.kode_kemendagri?.trim() || null,
        kode_bps: form.kode_bps?.trim() || null,
        kode_pos: form.kode_pos?.trim() || null,
        teks_geografis: form.teks_geografis?.trim() || null,
        teks_visi: form.teks_visi?.trim() || null,
        teks_misi: form.teks_misi?.trim() || null,
        teks_motto: form.teks_motto?.trim() || null,
      };

      if (recordId) {
        const { error: updateError } = await supabase
          .from('konten_web')
          .update(payload)
          .eq('id', recordId);

        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('konten_web')
          .insert(payload)
          .select('*')
          .limit(1);

        if (insertError) throw insertError;
        const row = Array.isArray(inserted) ? inserted[0] : null;
        if (row?.id) setRecordId(row.id);
      }

      setSuccess('Konten web berhasil disimpan.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan konten web';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <AdminSidebar activeKey={activeNav} onSelect={setActiveNav} />

        <div className="flex-1 flex flex-col">
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

          <main className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Manajemen Konten Web</h2>
              <p className="text-sm text-gray-500">Ubah teks konten di Beranda, Profil Kelurahan, dan Pemerintahan</p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Memuat konten...</div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Beranda</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Sambutan</label>
                    <textarea
                      className="w-full min-h-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_sambutan || ''}
                      onChange={(e) => updateField('teks_sambutan', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profil Kelurahan</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Profil</label>
                    <textarea
                      className="w-full min-h-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_profil || ''}
                      onChange={(e) => updateField('teks_profil', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Gunakan baris baru untuk membuat paragraf.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batas Utara</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.batas_utara || ''}
                        onChange={(e) => updateField('batas_utara', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batas Selatan</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.batas_selatan || ''}
                        onChange={(e) => updateField('batas_selatan', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batas Timur</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.batas_timur || ''}
                        onChange={(e) => updateField('batas_timur', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batas Barat</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.batas_barat || ''}
                        onChange={(e) => updateField('batas_barat', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Luas Wilayah</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.luas_wilayah || ''}
                        onChange={(e) => updateField('luas_wilayah', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Kemendagri</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.kode_kemendagri || ''}
                        onChange={(e) => updateField('kode_kemendagri', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode BPS</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.kode_bps || ''}
                        onChange={(e) => updateField('kode_bps', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Pos</label>
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.kode_pos || ''}
                        onChange={(e) => updateField('kode_pos', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Geografis</label>
                    <textarea
                      className="w-full min-h-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_geografis || ''}
                      onChange={(e) => updateField('teks_geografis', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pemerintahan</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Visi</label>
                    <textarea
                      className="w-full min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_visi || ''}
                      onChange={(e) => updateField('teks_visi', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Misi</label>
                    <textarea
                      className="w-full min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_misi || ''}
                      onChange={(e) => updateField('teks_misi', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Motto</label>
                    <textarea
                      className="w-full min-h-[80px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={form.teks_motto || ''}
                      onChange={(e) => updateField('teks_motto', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium disabled:opacity-60"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
