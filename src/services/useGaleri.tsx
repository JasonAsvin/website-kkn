import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type GalleryItemFromDB = {
  id: number;
  judul: string;
  url: string;
  ukuran_file: string;
  created_at: string;
};

type UseGalleryReturn = {
  data: GalleryItemFromDB[];
  loading: boolean;
  error: string | null;
};

export const useGaleri = (): UseGalleryReturn => {
  const [data, setData] = useState<GalleryItemFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchGallery = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const { data: galleryData, error: galleryError } = await supabase
          .from('galeri_kelurahan')
          .select('*')
          .order('created_at', { ascending: false });

        if (ignore) return;

        if (galleryError) {
          console.error('Gallery fetch error:', galleryError);
          setError(galleryError.message);
          setData([]);
        } else {
          setData((galleryData as GalleryItemFromDB[]) || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to fetch gallery data';
          console.error('Gallery error:', message);
          setError(message);
          setData([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchGallery();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
