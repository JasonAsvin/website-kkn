import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type StrukturOrganisasi = {
  id: string;
  url: string;
  keterangan?: string;
  created_at: string;
};

type UseStrukturOrganisasiReturn = {
  data: StrukturOrganisasi | null;
  loading: boolean;
  error: string | null;
};

export const useStrukturOrganisasi = (): UseStrukturOrganisasiReturn => {
  const [data, setData] = useState<StrukturOrganisasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchStruktur = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const { data: strukturData, error: strukturError } = await supabase
          .from('struktur_organisasi')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (ignore) return;

        if (strukturError) {
          console.error('Struktur organisasi fetch error:', strukturError);
          setError(strukturError.message);
          setData(null);
        } else {
          setData((strukturData as StrukturOrganisasi) || null);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to fetch struktur organisasi';
          console.error('Struktur organisasi error:', message);
          setError(message);
          setData(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchStruktur();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
