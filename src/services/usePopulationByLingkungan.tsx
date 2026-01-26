import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface PopulationByLingkungan {
  id?: string;
  nama_lingkungan: string;
  jumlah_penduduk: number;
  penduduk_lakilaki: number;
  penduduk_perempuan: number;
}

interface UsePopulationByLingkunganReturn {
  data: PopulationByLingkungan[];
  loading: boolean;
  error: string | null;
}

export const usePopulationByLingkungan = (): UsePopulationByLingkunganReturn => {
  const [data, setData] = useState<PopulationByLingkungan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const { data: populationData, error: fetchError } = await supabase
          .from('total_penduduk')
          .select('*')
          .order('id', { ascending: true });

        if (ignore) return;

        if (fetchError) {
          setError(fetchError.message || 'Unknown error');
        } else if (populationData) {
          setData(populationData as PopulationByLingkungan[]);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error fetching population by lingkungan:', message);
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
