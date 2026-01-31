import { useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '@/types/album';
import { defaultSettings } from '@/data/seedData';

const SETTINGS_STORAGE_KEY = 'albumhub_settings';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    } else {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    }
    setLoading(false);
  }, []);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  }, [settings]);

  return { settings, loading, updateSettings };
}
