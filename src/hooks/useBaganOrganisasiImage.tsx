import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useBaganOrganisasiImage = () => {
  const [baganUrl, setBaganUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadBaganFromStorage = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
        const filePath = 'pemerintahan/Bagan_Organisasi.png';

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (ignore) return;

        if (!data?.publicUrl) {
          throw new Error('Public URL tidak tersedia untuk bagan organisasi.');
        }

        // Add cache busting timestamp
        const timestamp = new Date().getTime();
        const bustedUrl = `${data.publicUrl}?t=${timestamp}`;

        setBaganUrl(bustedUrl);
        setError(null);
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Gagal memuat bagan organisasi.';
          setError(message);
          setBaganUrl(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadBaganFromStorage();
    return () => {
      ignore = true;
    };
  }, []);

  return { baganUrl, loading, error };
};
