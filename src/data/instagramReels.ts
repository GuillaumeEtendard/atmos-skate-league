/**
 * Instagram reel data.
 * videoUrl points to local files in /public/videos/ — permanent, no expiry.
 * posterUrl is the CDN thumbnail used as the <video poster>.
 */
export const INSTAGRAM_REELS = [
  {
    permalink: 'https://www.instagram.com/atmos.gear/reel/DUtfvoeD2pi/',
    username: 'atmos.gear',
    videoUrl: '/videos/compressed/DUtfvoeD2pi.mp4',
    posterUrl:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.82787-15/629145506_18091491788073123_9162718065700338632_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&oh=00_Afv_Tj4hyHRznKR37-TGFQXYmYk-WO3yoUdUW9DkTwlz9A&oe=69A42F26',
  },
  {
    permalink: 'https://www.instagram.com/deeps.rollerskate/reel/DVJUMjsjAk9/',
    username: 'deeps.rollerskate',
    videoUrl: '/videos/compressed/DVJUMjsjAk9_min.mp4',
    posterUrl:
      'https://scontent-iad3-2.cdninstagram.com/v/t51.71878-15/626264676_906745648505004_8860500759557334457_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&oh=00_AfsQrlhhdGR9t6oWSnMxwv_mLKCjs3Q9s-da9P4PkVxRcw&oe=69A428BB',
  },
  {
    permalink: 'https://www.instagram.com/atmos.gear/reel/DVDiYucE7rA/',
    username: 'atmos.gear',
    videoUrl: '/videos/compressed/DVDiYucE7rA_min.mp4',
    posterUrl:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.82787-15/639681216_18092303480073123_1907769393020219026_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&oh=00_AfvODkIxCnJx4T_QRoiKq4mdnhauOAl-oLceoes3FBzNvw&oe=69A40A64',
  },
  {
    permalink: 'https://www.instagram.com/atmos.gear/reel/DU8rKxBD9T0/',
    username: 'atmos.gear',
    videoUrl: '/videos/compressed/DU8rKxBD9T0_min.mp4',
    posterUrl:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.82787-15/640261713_18092149520073123_7544430098461504160_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&oh=00_AfsepLnZqivuRi1VhgF57nUPLcwhV8Gt6L7QuFZBODQJ7A&oe=69A3FAB1',
  },
  {
    permalink: 'https://www.instagram.com/atmos.gear/reel/DU3hjmfApa4/',
    username: 'atmos.gear',
    videoUrl: '/videos/compressed/DU3hjmfApa4_min.mp4',
    posterUrl:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.82787-15/628935731_18091887830073123_51159256650512468_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&oh=00_AftJhf-5KT697r6jaL0lVbIdNBldq5ZNAh_bYBiViac9Qw&oe=69A404B7',
  },
  {
    permalink: 'https://www.instagram.com/atmos.gear/reel/DUxg5CLCM6Y/',
    username: 'atmos.gear',
    videoUrl: '/videos/compressed/DUxg5CLCM6Y_min.mp4',
    posterUrl:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.82787-15/632076856_18091658855073123_5449618143099010301_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&oh=00_AftuHTGWLYS_KI2z-tXgL4orTmHlI4ciLiF-oiUB-XGUqQ&oe=69A415DC',
  },
] as const;

export type InstagramReel = (typeof INSTAGRAM_REELS)[number];

/** @deprecated use INSTAGRAM_REELS instead */
export const INSTAGRAM_REEL_URLS = INSTAGRAM_REELS.map((r) => r.permalink) as unknown as readonly string[];

/** @deprecated use INSTAGRAM_REELS instead */
export const REEL_THUMBNAILS: Record<string, string> = Object.fromEntries(
  INSTAGRAM_REELS.map((r) => [r.permalink, r.posterUrl])
);

export function getUsernameFromReelUrl(url: string): string {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 1) return pathParts[0];
  } catch {
    // ignore
  }
  return 'instagram';
}
