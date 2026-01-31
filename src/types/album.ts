export interface Album {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  externalAlbumUrl: string;
  description: string;
  eventDate: string;
  createdAt: string;
  location: string;
  tags: string[];
  featured: boolean;
  visibility: 'public' | 'unlisted';
  viewCount: number;
  clickCount: number;
}

export interface SiteSettings {
  photographerName: string;
  tagline: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  aboutMe?: string;
  aboutImageUrl?: string;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
  accentColor: string;
  darkModeDefault: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
