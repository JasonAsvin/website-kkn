import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useStrukturImage = () => {
  const [strukturUrl, setStrukturUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadStrukturFromStorage = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
        const filePath = import.meta.env.VITE_SUPABASE_STRUKTUR_PATH || 'pemerintahan/Bagan_Struktur_Baju_Bodoa.png';

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (ignore) return;

        if (!data?.publicUrl) {
          throw new Error('Public URL tidak tersedia untuk struktur organisasi.');
        }

        // Add cache busting timestamp
        const timestamp = new Date().getTime();
        const bustedUrl = `${data.publicUrl}?t=${timestamp}`;

        setStrukturUrl(bustedUrl);
        setError(null);
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Gagal memuat struktur organisasi.';
          setError(message);
          setStrukturUrl(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadStrukturFromStorage();
    return () => {
      ignore = true;
    };
  }, []);

  return { strukturUrl, loading, error };
};
