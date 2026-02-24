/**
 * Instagram reel URLs for the landing carousel.
 */
export const INSTAGRAM_REEL_URLS = [
  'https://www.instagram.com/atmos.gear/reel/DUtfvoeD2pi/',
  'https://www.instagram.com/deeps.rollerskate/reel/DVJUMjsjAk9/',
  'https://www.instagram.com/atmos.gear/reel/DVDiYucE7rA/',
  'https://www.instagram.com/atmos.gear/reel/DU8rKxBD9T0/',
  'https://www.instagram.com/atmos.gear/reel/DU3hjmfApa4/',
  'https://www.instagram.com/atmos.gear/reel/DUxg5CLCM6Y/',
] as const;

/** Thumbnail URL for each reel (permalink -> image URL). Missing reels use placeholder in the carousel. */
export const REEL_THUMBNAILS: Record<string, string> = {
  'https://www.instagram.com/atmos.gear/reel/DUtfvoeD2pi/':
    'https://instagram.fdxb5-1.fna.fbcdn.net/v/t51.82787-15/629145506_18091491788073123_9162718065700338632_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=MzgzMTg1ODQ3MDY3MzQxMDY1ODE4MDkxNDkxNzg1MDczMTIz.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=ijJNJs98QjIQ7kNvwEtsq8F&_nc_oc=AdkFxKMKyWcbAB_YK1lIYU3HqLyh5pz8LJ0bGQ2T_T8MG-ZeRLpbnrxOIRHYOXqyawM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb5-1.fna&_nc_gid=oSO5RjT0sPOGDFDKs4bDVg&oh=00_AfspJW-BBkZnXpzAsbkjXyroxwNhjyH43CDrxbGGh_oY3Q&oe=69A3F6E6',
  'https://www.instagram.com/deeps.rollerskate/reel/DVJUMjsjAk9/':
    'https://instagram.fdxb2-1.fna.fbcdn.net/v/t51.82787-15/642413889_17935366269171181_5181422053171392947_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=110&ig_cache_key=MzgzOTY4ODk4MTIwMjM0MDE1NzE3OTM1MzY2MjYzMTcxMTgx.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=oi300PpDSM0Q7kNvwGeqWxL&_nc_oc=Adkq7Nv0m7q54RJqvPlbPuEN8v2psuZ9mmhfF-O-WbJpMgEccjce6zYu2dbv9T9eL8k&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb2-1.fna&_nc_gid=oSO5RjT0sPOGDFDKs4bDVg&oh=00_AfsopEZZ1GEnmY9-mwxrTVIUWgjK_MpsBX-Lztx7j81G4w&oe=69A3FEAE',
  'https://www.instagram.com/atmos.gear/reel/DVDiYucE7rA/':
    'https://instagram.fdxb2-1.fna.fbcdn.net/v/t51.82787-15/639681216_18092303480073123_1907769393020219026_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=109&ig_cache_key=MzgzODA2MjU0MDE2MTc5MjcwNDE4MDkyMzAzNDc0MDczMTIz.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=anRu6riZeYoQ7kNvwG8YU9R&_nc_oc=AdkI6enxB2qvY2blmM2nVxPwUlsolL9f83C4hh-6JsYzVMqNA5gMMrq4ieNTXklKO0Q&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb2-1.fna&_nc_gid=oSO5RjT0sPOGDFDKs4bDVg&oh=00_AftYiKbpr20fnHeXG3YctacKySEpVQvQim29ExnY2UE0qw&oe=69A40A64',
  'https://www.instagram.com/atmos.gear/reel/DU8rKxBD9T0/':
    'https://instagram.fdxb5-1.fna.fbcdn.net/v/t51.82787-15/640261713_18092149520073123_7544430098461504160_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=MzgzNjEzMDgzODQzODcyODk0ODE4MDkyMTQ5NTE0MDczMTIz.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=lJunqxPSIdEQ7kNvwFNE1qd&_nc_oc=AdnUOt4pcl0rvSrSi00HL0ekNW3FfH24J2oMOVPeixbgkwivC2n7sKPmg_1bqpwt1WY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb5-1.fna&_nc_gid=mkDf_vD_WZVOjvVuiQeHiw&oh=00_Afv1XeP_C3t6w7e-Nxn6L8_R9LJhr4oyEwZilvw250Zf-g&oe=69A3FAB1',
  'https://www.instagram.com/atmos.gear/reel/DU3hjmfApa4/':
    'https://instagram.fdxb2-1.fna.fbcdn.net/v/t51.82787-15/628935731_18091887830073123_51159256650512468_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=MzgzNDY4MTE4OTc2ODI3MTU0NDE4MDkxODg3ODI0MDczMTIz.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=WyLn_3YkpKsQ7kNvwEAItj_&_nc_oc=Admn9cIR9rVMjsTzsaYSXsqkoWTAUikrdxQ5shy-G5as6nX8mhcVIWn21cxFb4mHK20&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb2-1.fna&_nc_gid=b1EA-6LCQG87G1jyzeVEFw&oh=00_AfshrPz_hJwZIQnA1IW5TGGHPY2gqIaisqtyadovT0zPrA&oe=69A404B7',
  'https://www.instagram.com/atmos.gear/reel/DUxg5CLCM6Y/':
    'https://instagram.fdxb2-1.fna.fbcdn.net/v/t51.82787-15/632076856_18091658855073123_5449618143099010301_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=MzgzMjk4OTQxNDcwMDE0MjIzMjE4MDkxNjU4ODUyMDczMTIz.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=I48PdkFm5d4Q7kNvwHqPbah&_nc_oc=AdmYMGev4d3rINWCfiOaUJkGbrSt13IZon3X9GO0R5EUa0ESkLX5bhs9T-Bo-gF4BfE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdxb2-1.fna&_nc_gid=C1dJ3w6YSfQj4FMEQSncPw&oh=00_Afvs-JWWxqFNhOvLFPIsvcy0PI0PbE2bytCar3mwWmoBnw&oe=69A3DD9C',
};

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
