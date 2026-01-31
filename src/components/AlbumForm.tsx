import { useState, useEffect } from 'react';
import { Album } from '@/types/album';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUrlOrUpload } from '@/components/ImageUrlOrUpload';

interface AlbumFormProps {
  album?: Album | null;
  onSubmit: (data: Omit<Album, 'id' | 'createdAt' | 'viewCount' | 'clickCount'>) => void;
  onCancel: () => void;
}

export function AlbumForm({ album, onSubmit, onCancel }: AlbumFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    coverImageUrl: '',
    externalAlbumUrl: '',
    description: '',
    eventDate: '',
    location: '',
    tags: '',
    featured: false,
    visibility: 'public' as 'public' | 'unlisted',
  });

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title,
        slug: album.slug,
        coverImageUrl: album.coverImageUrl,
        externalAlbumUrl: album.externalAlbumUrl,
        description: album.description,
        eventDate: album.eventDate,
        location: album.location,
        tags: album.tags.join(', '),
        featured: album.featured,
        visibility: album.visibility,
      });
    }
  }, [album]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!album) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, album]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      slug: formData.slug,
      coverImageUrl: formData.coverImageUrl,
      externalAlbumUrl: formData.externalAlbumUrl,
      description: formData.description,
      eventDate: formData.eventDate,
      location: formData.location,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: formData.featured,
      visibility: formData.visibility,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Album title"
            required
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="album-url-slug"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL: /albums/{formData.slug || 'your-album'}
          </p>
        </div>

        <div className="md:col-span-2">
          <ImageUrlOrUpload
            id="coverImageUrl"
            label="Cover image"
            value={formData.coverImageUrl}
            onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
            placeholder="Paste image URL or upload"
            required
            uploadFolder="albums"
            previewClassName="mt-2 w-full h-32 object-cover rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="externalAlbumUrl">External Album Link *</Label>
          <Input
            id="externalAlbumUrl"
            value={formData.externalAlbumUrl}
            onChange={(e) => setFormData({ ...formData, externalAlbumUrl: e.target.value })}
            placeholder="https://pixieset.com/your-album"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="eventDate">Event Date *</Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, State"
            required
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A brief description of the album..."
            required
            rows={3}
            className="mt-2 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="wedding, outdoor, spring (comma-separated)"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select
            value={formData.visibility}
            onValueChange={(v) => setFormData({ ...formData, visibility: v as 'public' | 'unlisted' })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Album</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {album ? 'Update Album' : 'Create Album'}
        </Button>
      </div>
    </form>
  );
}
