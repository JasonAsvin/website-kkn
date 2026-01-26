import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Lingkungan, RW, RT, WilayahTotal } from '../types/infografis';

export const useWilayahAdministratif = () => {
  const [wilayahTotal, setWilayahTotal] = useState<WilayahTotal | null>(null);
  const [lingkunganList, setLingkunganList] = useState<Lingkungan[]>([]);
  const [rwList, setRwList] = useState<RW[]>([]);
  const [rtList, setRtList] = useState<RT[]>([]);
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
        const { data: rtData, error: rtError } = await client
          .from('wilayah_administratif')
          .select('id, nama_ketua, nama_rt, nama_rw, nama_lingkungan')
          .order('nama_rw', { ascending: true });

        if (ignore) return;

        if (rtError) {
          setError(rtError.message || 'Unknown error');
        } else if (rtData) {
          setRtList(rtData);

          const uniqueLingkungan = Array.from(
            new Set(rtData.map(item => item.nama_lingkungan))
          )
            .filter(Boolean)
            .sort()
            .map((nama, idx) => ({ id: `${idx + 1}`, nama_lingkungan: nama }));
          setLingkunganList(uniqueLingkungan);

          const rwMap = new Map<string, string>();
          rtData.forEach(item => {
            if (item.nama_rw && !rwMap.has(item.nama_rw)) {
              rwMap.set(item.nama_rw, item.nama_lingkungan);
            }
          });
          const uniqueRw = Array.from(rwMap.entries())
            .sort(([rwA], [rwB]) => {
              const numA = parseInt(rwA.match(/\d+/)?.[0] || '0');
              const numB = parseInt(rwB.match(/\d+/)?.[0] || '0');
              return numA - numB;
            })
            .map(([rw, lingkungan], idx) => ({
              id: `rw-${idx + 1}`,
              nama_rw: rw,
              nama_lingkungan: lingkungan
            }));
          setRwList(uniqueRw);

          setWilayahTotal({
            total_lingkungan: uniqueLingkungan.length,
            total_rw: uniqueRw.length,
            total_rt: rtData.length
          });

          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching wilayah data:', err);
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

  return { wilayahTotal, lingkunganList, rwList, rtList, loading, error };
};
