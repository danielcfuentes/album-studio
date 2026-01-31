import { useState, useEffect, useCallback, useMemo } from 'react';
import { Album } from '@/types/album';
import { supabase } from '@/lib/supabase';
import { mapAlbumRowToAlbum, mapAlbumToRow } from '@/lib/supabase-mappers';

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('albums')
      .select('*')
      .order('event_date', { ascending: false });
    if (err) {
      setError(err.message);
      setAlbums([]);
      setLoading(false);
      return;
    }
    setAlbums((data ?? []).map(mapAlbumRowToAlbum));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const createAlbum = useCallback(
    async (album: Omit<Album, 'id' | 'createdAt' | 'viewCount' | 'clickCount'>) => {
      const row = mapAlbumToRow({
        ...album,
        viewCount: 0,
        clickCount: 0,
      });
      const { data, error: err } = await supabase.from('albums').insert(row as never).select('*').single();
      if (err) throw err;
      const newAlbum = data ? mapAlbumRowToAlbum(data) : null;
      if (newAlbum) await fetchAlbums();
      return newAlbum;
    },
    [fetchAlbums]
  );

  const updateAlbum = useCallback(
    async (id: string, updates: Partial<Album>) => {
      const row = mapAlbumToRow(updates);
      const { error: err } = await supabase.from('albums').update(row as never).eq('id', id);
      if (err) throw err;
      await fetchAlbums();
    },
    [fetchAlbums]
  );

  const deleteAlbum = useCallback(
    async (id: string) => {
      const { error: err } = await supabase.from('albums').delete().eq('id', id);
      if (err) throw err;
      await fetchAlbums();
    },
    [fetchAlbums]
  );

  const getAlbumBySlug = useCallback(
    (slug: string) => albums.find((a) => a.slug === slug) ?? null,
    [albums]
  );

  const incrementViewCount = useCallback(async (id: string) => {
    await supabase.rpc('increment_album_view_count', { album_id: id } as never);
    setAlbums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a))
    );
  }, []);

  const incrementClickCount = useCallback(async (id: string) => {
    await supabase.rpc('increment_album_click_count', { album_id: id } as never);
    setAlbums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, clickCount: a.clickCount + 1 } : a))
    );
  }, []);

  const getPublicAlbums = useMemo(
    () => () => albums.filter((a) => a.visibility === 'public'),
    [albums]
  );

  const getFeaturedAlbums = useMemo(
    () => () => albums.filter((a) => a.featured && a.visibility === 'public'),
    [albums]
  );

  return {
    albums,
    loading,
    error,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumBySlug,
    incrementViewCount,
    incrementClickCount,
    getPublicAlbums,
    getFeaturedAlbums,
    refetch: fetchAlbums,
  };
}
