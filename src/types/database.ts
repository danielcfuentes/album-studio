/**
 * Supabase database types (snake_case columns).
 * Run `npx supabase gen types typescript` after linking for auto-generated types.
 */
export type Json = Record<string, unknown>;

export interface Database {
  public: {
    Tables: {
      albums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          cover_image_url: string;
          external_album_url: string;
          description: string;
          event_date: string;
          created_at: string;
          location: string;
          tags: string[];
          featured: boolean;
          visibility: 'public' | 'unlisted';
          view_count: number;
          click_count: number;
        };
        Insert: {
          title: string;
          slug: string;
          cover_image_url: string;
          external_album_url: string;
          description?: string;
          event_date: string;
          location?: string;
          tags?: string[];
          featured?: boolean;
          visibility?: 'public' | 'unlisted';
          view_count?: number;
          click_count?: number;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['albums']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          photographer_name: string;
          tagline: string;
          logo_url: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          about_me: string | null;
          about_image_url: string | null;
          social_links: Json;
          accent_color: string;
          dark_mode_default: boolean;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
    };
    Functions: {
      increment_album_view_count: {
        Args: { album_id: string };
        Returns: void;
      };
      increment_album_click_count: {
        Args: { album_id: string };
        Returns: void;
      };
    };
  };
}
