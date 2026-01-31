import { supabase } from '@/lib/supabase';

const BUCKET = 'uploads';

/** Max dimension (width or height) after resize. Keeps uploads small enough. */
const MAX_DIMENSION = 1920;
/** Target max file size before we resize (bytes). ~2MB */
const RESIZE_IF_LARGER_THAN = 2 * 1024 * 1024;
/** Max file size we accept (bytes). ~20MB - over this we reject and ask for a link. */
const MAX_FILE_SIZE = 20 * 1024 * 1024;
/** JPEG quality when compressing (0–1). */
const JPEG_QUALITY = 0.88;

/**
 * Resize/compress image in browser to reduce file size. Returns blob as JPEG.
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      let width = w;
      let height = h;
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        if (w >= h) {
          width = MAX_DIMENSION;
          height = Math.round((h * MAX_DIMENSION) / w);
        } else {
          height = MAX_DIMENSION;
          width = Math.round((w * MAX_DIMENSION) / h);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else resolve(file);
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Upload a file to Supabase Storage and return the public URL.
 * Large images are resized/compressed before upload to avoid size limits.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 20MB. Use a smaller image or paste a link instead.`
    );
  }

  let blob: Blob = file;
  const isImage = file.type.startsWith('image/');
  if (isImage && file.size > RESIZE_IF_LARGER_THAN) {
    blob = await compressImage(file);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext === 'png' || ext === 'webp' || ext === 'gif' ? ext : 'jpg'}`;
  const path = `${folder}/${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType: blob instanceof File ? blob.type : 'image/jpeg',
  });

  if (error) {
    if (error.message?.toLowerCase().includes('file size') || error.message?.toLowerCase().includes('limit')) {
      throw new Error('File is too large for the server. Try a smaller image or paste an image link instead.');
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
