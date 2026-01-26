import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useKepalaKelurahanImage = () => {
  const [kepalaUrl, setKepalaUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const bucket = import.meta.env.VITE_SUPABASE_ASSETS_BUCKET || 'galeri_foto';
        const filePath = 'pemerintahan/Kepala_Kelurahan.png';

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        
        if (!isMounted) return;

        if (data?.publicUrl) {
          // Add cache buster to ensure fresh image
          const bustedUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
          setKepalaUrl(bustedUrl);
          setError(null);
        } else {
          setError('URL gambar tidak tersedia');
          setKepalaUrl('');
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Gagal memuat gambar kepala kelurahan';
        setError(message);
        setKepalaUrl('');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, []);

  return { kepalaUrl, loading, error };
};
