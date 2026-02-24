/**
 * Instagram reel URLs for the landing carousel.
 * Thumbnails are loaded via the /api/instagram-reel-thumbnails API when available.
 */
export const INSTAGRAM_REEL_URLS = [
  'https://www.instagram.com/atmos.gear/reel/DUtfvoeD2pi/',
  'https://www.instagram.com/deeps.rollerskate/reel/DVJUMjsjAk9/',
  'https://www.instagram.com/atmos.gear/reel/DVDiYucE7rA/',
  'https://www.instagram.com/atmos.gear/reel/DU8rKxBD9T0/',
  'https://www.instagram.com/atmos.gear/reel/DU3hjmfApa4/',
  'https://www.instagram.com/atmos.gear/reel/DUxg5CLCM6Y/',
] as const;

export function getUsernameFromReelUrl(url: string): string {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split('/').filter(Boolean);
    // /atmos.gear/reel/CODE or /deeps.rollerskate/reel/CODE
    if (pathParts.length >= 1) return pathParts[0];
  } catch {
    // ignore
  }
  return 'instagram';
}
