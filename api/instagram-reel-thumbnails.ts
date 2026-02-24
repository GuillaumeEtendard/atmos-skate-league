import type { VercelRequest, VercelResponse } from '@vercel/node';

const REEL_URLS = [
  'https://www.instagram.com/atmos.gear/reel/DUtfvoeD2pi/',
  'https://www.instagram.com/deeps.rollerskate/reel/DVJUMjsjAk9/',
  'https://www.instagram.com/atmos.gear/reel/DVDiYucE7rA/',
  'https://www.instagram.com/atmos.gear/reel/DU8rKxBD9T0/',
  'https://www.instagram.com/atmos.gear/reel/DU3hjmfApa4/',
  'https://www.instagram.com/atmos.gear/reel/DUxg5CLCM6Y/',
];

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchThumbnailForUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': BROWSER_UA,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(
      /<meta\s+property="og:image"\s+content="([^"]+)"/i
    );
    if (match?.[1]) return match[1].replace(/&amp;/g, '&');
    return null;
  } catch {
    return null;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = await Promise.all(
      REEL_URLS.map(async (permalink) => {
        const thumbnailUrl = await fetchThumbnailForUrl(permalink);
        return { permalink, thumbnailUrl };
      })
    );

    return res.status(200).json(results);
  } catch (err) {
    console.error('instagram-reel-thumbnails error:', err);
    return res.status(500).json({ error: 'Failed to fetch thumbnails' });
  }
}
