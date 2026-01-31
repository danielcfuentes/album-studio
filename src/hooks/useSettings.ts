import { useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '@/types/album';
import { supabase } from '@/lib/supabase';
import { mapSiteSettingsRowToSettings, mapSettingsToRow } from '@/lib/supabase-mappers';
import { SITE_SETTINGS_ID } from '@/lib/supabase-constants';

const DEFAULT_SETTINGS: SiteSettings = {
  photographerName: 'Jorge Zenteno',
  tagline: 'Photographer for @pasorunclub. Capturing the moment.',
  location: 'New York',
  socialLinks: {},
  accentColor: 'neutral',
  darkModeDefault: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SITE_SETTINGS_ID)
        .maybeSingle();
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (data) setSettings(mapSiteSettingsRowToSettings(data));
      else setSettings(DEFAULT_SETTINGS);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    const row = mapSettingsToRow(updates);
    const { error: err } = await supabase
      .from('site_settings')
      .update(row)
      .eq('id', SITE_SETTINGS_ID);
    if (err) throw err;
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  return { settings, loading, error, updateSettings };
}
