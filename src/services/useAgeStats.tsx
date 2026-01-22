import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { AgeStat } from '../types/infografis';

export const useAgeStats = () => {
  const [data, setData] = useState<AgeStat[]>([]);
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
          .from('statistik_umur')
          .select('rentang_umur, penduduk')
          .order('id', { ascending: true });

        if (ignore) return;

        if (fetchError) {
          console.error('Error fetching age stats:', fetchError);
          setError(fetchError.message);
          setData([]);
        } else {
          setData(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData([]);
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
