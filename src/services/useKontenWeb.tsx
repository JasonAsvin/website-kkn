import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type KontenWeb = {
  id?: string | number;
  teks_sambutan?: string | null;
  teks_profil?: string | null;
  batas_utara?: string | null;
  batas_selatan?: string | null;
  batas_timur?: string | null;
  batas_barat?: string | null;
  luas_wilayah?: string | null;
  kode_kemendagri?: string | null;
  kode_bps?: string | null;
  kode_pos?: string | null;
  teks_geografis?: string | null;
  teks_visi?: string | null;
  teks_misi?: string | null;
  teks_motto?: string | null;
};

interface UseKontenWebReturn {
  data: KontenWeb | null;
  loading: boolean;
  error: string | null;
}

export const useKontenWeb = (): UseKontenWebReturn => {
  const [data, setData] = useState<KontenWeb | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchKonten = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const { data: kontenData, error: kontenError } = await supabase
          .from('konten_web')
          .select('*')
          .limit(1);

        if (ignore) return;

        if (kontenError) {
          console.error('Konten web fetch error:', kontenError);
          setError(kontenError.message);
          setData(null);
        } else {
          const firstRow = Array.isArray(kontenData) ? kontenData[0] : null;
          setData((firstRow as KontenWeb) || null);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to fetch konten web';
          console.error('Konten web error:', message);
          setError(message);
          setData(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchKonten();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
