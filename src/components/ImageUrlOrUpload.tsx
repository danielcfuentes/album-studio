import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImage } from '@/lib/uploadImage';
import { toDirectImageUrl } from '@/lib/imageUrl';

interface ImageUrlOrUploadProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  uploadFolder: string;
  previewClassName?: string;
}

export function ImageUrlOrUpload({
  id,
  label,
  value,
  onChange,
  placeholder = 'Paste image URL or upload a file',
  required = false,
  uploadFolder,
  previewClassName = 'mt-2 w-full h-32 object-cover rounded-lg',
}: ImageUrlOrUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image (JPEG, PNG, WebP, or GIF).');
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file, uploadFolder);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required ? ' *' : ''}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="url"
          value={value}
          onChange={(e) => {
            setUploadError(null);
            const raw = e.target.value.trim();
            const direct = toDirectImageUrl(raw);
            onChange(direct);
          }}
          placeholder={placeholder}
          required={required}
          className="mt-0 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          title="Upload image"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload image"
        />
      </div>
      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}
      <p className="text-xs text-muted-foreground">
        Paste a link (Google Drive works — use “Get link” and set to “Anyone with the link”) or upload an image (max 20MB; large images are auto‑resized).
      </p>
      {value && (
        <img
          src={toDirectImageUrl(value)}
          alt="Preview"
          className={previewClassName}
          onError={() => {}}
        />
      )}
    </div>
  );
}
