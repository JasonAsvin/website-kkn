import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Facility } from '../types/infografis';

export const useFasilitas = () => {
  const [data, setData] = useState<Facility[]>([]);
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
          .from('fasilitas_umum')
          .select('id, nama_fasilitas, alamat, lingkungan, kategori')
          .order('kategori', { ascending: true });

        if (ignore) return;

        if (fetchError) {
          setError(fetchError.message || 'Unknown error');
        } else if (data) {
          setData(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching fasilitas data:', err);
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
