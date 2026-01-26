import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface StrukturOrganisasi {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string | null;
  nomor_nip: string | null;
  parent_id: string | null;
  urutan: number;
}

interface UseStrukturOrganisasiReturn {
  data: StrukturOrganisasi[];
  loading: boolean;
  error: string | null;
}

export const useStrukturOrganisasi = (): UseStrukturOrganisasiReturn => {
  const [data, setData] = useState<StrukturOrganisasi[]>([]);
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
          .select('id, nama, jabatan, foto_url, nomor_nip, parent_id, urutan')
          .order('parent_id', { ascending: true, nullsFirst: true })
          .order('urutan', { ascending: true });

        if (ignore) return;

        if (strukturError) {
          console.error('Struktur organisasi fetch error:', strukturError);
          setError(strukturError.message);
          setData([]);
        } else {
          setData((strukturData as StrukturOrganisasi[]) || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to fetch struktur organisasi';
          console.error('Struktur organisasi error:', message);
          setError(message);
          setData([]);
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
