import type { Album, SiteSettings } from '@/types/album';
import type { Database } from '@/types/database';

type AlbumRow = Database['public']['Tables']['albums']['Row'];
type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export function mapAlbumRowToAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    coverImageUrl: row.cover_image_url,
    externalAlbumUrl: row.external_album_url,
    description: row.description,
    eventDate: row.event_date,
    createdAt: row.created_at.split('T')[0],
    location: row.location,
    tags: row.tags ?? [],
    featured: row.featured,
    visibility: row.visibility as 'public' | 'unlisted',
    viewCount: row.view_count,
    clickCount: row.click_count,
  };
}

export function mapAlbumToRow(
  album: Omit<Album, 'id' | 'createdAt' | 'viewCount' | 'clickCount'> | Partial<Album>
): Database['public']['Tables']['albums']['Insert'] {
  return {
    title: album.title!,
    slug: album.slug!,
    cover_image_url: album.coverImageUrl!,
    external_album_url: album.externalAlbumUrl!,
    description: album.description ?? '',
    event_date: album.eventDate!,
    location: album.location ?? '',
    tags: album.tags ?? [],
    featured: album.featured ?? false,
    visibility: (album.visibility as 'public' | 'unlisted') ?? 'public',
    ...(album.id && { id: album.id }),
    ...(album.viewCount !== undefined && { view_count: album.viewCount }),
    ...(album.clickCount !== undefined && { click_count: album.clickCount }),
  };
}

export function mapSiteSettingsRowToSettings(row: SiteSettingsRow): SiteSettings {
  const links = (row.social_links ?? {}) as Record<string, string | undefined>;
  return {
    photographerName: row.photographer_name,
    tagline: row.tagline,
    logoUrl: row.logo_url ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    location: row.location ?? undefined,
    aboutMe: row.about_me ?? undefined,
    aboutImageUrl: row.about_image_url ?? undefined,
    socialLinks: {
      instagram: links.instagram,
      tiktok: links.tiktok,
      youtube: links.youtube,
      website: links.website,
    },
    accentColor: row.accent_color,
    darkModeDefault: row.dark_mode_default,
  };
}

export function mapSettingsToRow(settings: Partial<SiteSettings>): Database['public']['Tables']['site_settings']['Update'] {
  const row: Database['public']['Tables']['site_settings']['Update'] = {};
  if (settings.photographerName !== undefined) row.photographer_name = settings.photographerName;
  if (settings.tagline !== undefined) row.tagline = settings.tagline;
  if (settings.logoUrl !== undefined) row.logo_url = settings.logoUrl || null;
  if (settings.email !== undefined) row.email = settings.email || null;
  if (settings.phone !== undefined) row.phone = settings.phone || null;
  if (settings.location !== undefined) row.location = settings.location || null;
  if (settings.aboutMe !== undefined) row.about_me = settings.aboutMe || null;
  if (settings.aboutImageUrl !== undefined) row.about_image_url = settings.aboutImageUrl || null;
  if (settings.socialLinks !== undefined) row.social_links = settings.socialLinks as Record<string, unknown>;
  if (settings.accentColor !== undefined) row.accent_color = settings.accentColor;
  if (settings.darkModeDefault !== undefined) row.dark_mode_default = settings.darkModeDefault;
  return row;
}
