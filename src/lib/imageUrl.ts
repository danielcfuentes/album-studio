/**
 * Convert Google Drive share links to direct image URLs for use in <img src>.
 * Drive share links like .../file/d/FILE_ID/view don't work as image sources;
 * we need .../uc?export=view&id=FILE_ID
 */
export function toDirectImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();

  // Google Drive: extract file ID and convert to direct view URL for <img src>
  // Matches: .../file/d/FILE_ID/view, .../open?id=FILE_ID, .../uc?id=..., .../thumbnail?id=...
  // Already direct: .../uc?export=view&id=... → leave as-is
  if (trimmed.includes('drive.google.com/uc?export=view')) return trimmed;

  const driveMatch =
    trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/drive\.google\.com\/thumbnail\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  return trimmed;
}
