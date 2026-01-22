import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { PopulationData } from '../types/infografis';

export const usePopulationData = () => {
  const [data, setData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    let ignore = false;
    
    const client = supabase;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await client
          .from('total_penduduk')
          .select('jumlah_penduduk, penduduk_perempuan, penduduk_lakilaki')
          .maybeSingle();

        if (ignore) return;

        if (fetchError) {
          console.error('Error fetching population data:', fetchError);
          setError(fetchError.message);
        } else if (data) {
          setData(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { ignore = true; };
  }, []);

  return { data, loading, error };
};
