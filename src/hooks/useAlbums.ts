import { useState, useEffect, useCallback } from 'react';
import { Album } from '@/types/album';
import { seedAlbums } from '@/data/seedData';

const ALBUMS_STORAGE_KEY = 'albumhub_albums';

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ALBUMS_STORAGE_KEY);
    if (stored) {
      setAlbums(JSON.parse(stored));
    } else {
      setAlbums(seedAlbums);
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(seedAlbums));
    }
    setLoading(false);
  }, []);

  const saveAlbums = useCallback((newAlbums: Album[]) => {
    setAlbums(newAlbums);
    localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(newAlbums));
  }, []);

  const createAlbum = useCallback((album: Omit<Album, 'id' | 'createdAt' | 'viewCount' | 'clickCount'>) => {
    const newAlbum: Album = {
      ...album,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
      clickCount: 0,
    };
    saveAlbums([newAlbum, ...albums]);
    return newAlbum;
  }, [albums, saveAlbums]);

  const updateAlbum = useCallback((id: string, updates: Partial<Album>) => {
    const updated = albums.map(album => 
      album.id === id ? { ...album, ...updates } : album
    );
    saveAlbums(updated);
  }, [albums, saveAlbums]);

  const deleteAlbum = useCallback((id: string) => {
    saveAlbums(albums.filter(album => album.id !== id));
  }, [albums, saveAlbums]);

  const getAlbumBySlug = useCallback((slug: string) => {
    return albums.find(album => album.slug === slug);
  }, [albums]);

  const incrementViewCount = useCallback((id: string) => {
    const updated = albums.map(album => 
      album.id === id ? { ...album, viewCount: album.viewCount + 1 } : album
    );
    saveAlbums(updated);
  }, [albums, saveAlbums]);

  const incrementClickCount = useCallback((id: string) => {
    const updated = albums.map(album => 
      album.id === id ? { ...album, clickCount: album.clickCount + 1 } : album
    );
    saveAlbums(updated);
  }, [albums, saveAlbums]);

  const getPublicAlbums = useCallback(() => {
    return albums.filter(album => album.visibility === 'public');
  }, [albums]);

  const getFeaturedAlbums = useCallback(() => {
    return albums.filter(album => album.featured && album.visibility === 'public');
  }, [albums]);

  return {
    albums,
    loading,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumBySlug,
    incrementViewCount,
    incrementClickCount,
    getPublicAlbums,
    getFeaturedAlbums,
  };
}
