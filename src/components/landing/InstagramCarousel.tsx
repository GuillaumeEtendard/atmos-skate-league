import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INSTAGRAM_REEL_URLS, REEL_THUMBNAILS, getUsernameFromReelUrl } from '@/data/instagramReels';
import SectionTitle from './SectionTitle';

export interface InstagramPost {
  id: string;
  mediaType: 'VIDEO' | 'IMAGE';
  mediaUrl?: string;
  thumbnailUrl: string;
  permalink: string;
  caption?: string;
  likeCount: number;
  commentsCount: number;
  username: string;
  avatarUrl?: string;
}

const PLACEHOLDER_THUMBNAIL =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop';

const INSTAGRAM_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="currentColor" fillRule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Zm4.803-11.305a.8.8 0 0 0 0-1.386l-6.6-3.81a.8.8 0 0 0-1.2.693v7.62a.8.8 0 0 0 1.2.694l6.6-3.81Z" clipRule="evenodd" />
  </svg>
);

const VIDEO_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="currentColor" fillRule="evenodd" d="M2 7.25h3.614L9.364 2H6a4 4 0 0 0-4 4v1.25Zm20 0h-6.543l3.641-5.097A4.002 4.002 0 0 1 22 6v1.25ZM2 8.75h20V18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8.75Zm5.457-1.5L11.207 2h6.157l-3.75 5.25H7.457Zm7.404 7.953a.483.483 0 0 0 0-.837l-3.985-2.3a.483.483 0 0 0-.725.418v4.601c0 .372.403.605.725.419l3.985-2.301Z" clipRule="evenodd" />
  </svg>
);

function buildPostsFromReelUrls(thumbnailMap: Record<string, string> = {}): InstagramPost[] {
  const map = { ...REEL_THUMBNAILS, ...thumbnailMap };
  return INSTAGRAM_REEL_URLS.map((permalink, i) => ({
    id: String(i + 1),
    mediaType: 'VIDEO' as const,
    thumbnailUrl: map[permalink] ?? PLACEHOLDER_THUMBNAIL,
    permalink,
    likeCount: 0,
    commentsCount: 0,
    username: getUsernameFromReelUrl(permalink),
  }));
}

const defaultPosts = buildPostsFromReelUrls();

interface InstagramCarouselProps {
  title?: React.ReactNode;
  posts?: InstagramPost[];
  /** Instagram profile URL for "Follow" link */
  profileUrl?: string;
  className?: string;
}

const InstagramCarousel = ({
  title = null,
  posts: postsProp,
  profileUrl = 'https://www.instagram.com/atmosskateleague/',
  className = '',
}: InstagramCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const [postsWithThumbnails, setPostsWithThumbnails] = useState<InstagramPost[]>(
    () => postsProp ?? defaultPosts
  );
  const posts = postsProp ?? postsWithThumbnails;

  useEffect(() => {
    if (postsProp != null) return;
    let cancelled = false;
    (async () => {
      try {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const res = await fetch(`${base}/api/instagram-reel-thumbnails`);
        if (!res.ok || cancelled) return;
        const data: { permalink: string; thumbnailUrl: string | null }[] = await res.json();
        const map: Record<string, string> = {};
        for (const item of data) {
          if (item.thumbnailUrl) map[item.permalink] = item.thumbnailUrl;
        }
        if (!cancelled) setPostsWithThumbnails(buildPostsFromReelUrls(map));
      } catch {
        // keep placeholder thumbnails
      }
    })();
    return () => { cancelled = true; };
  }, [postsProp]);

  useEffect(() => {
    if (posts.length === 0) return;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let rafId: number | null = null;
    let attempts = 0;

    const tick = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + el.clientWidth * 0.85;
      el.scrollTo({ left: next >= max ? 0 : next, behavior: 'smooth' });
    };

    const tryStart = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 0) {
        intervalId = setInterval(tick, 4000);
        return;
      }
      if (++attempts < 120) {
        rafId = requestAnimationFrame(tryStart);
      }
    };

    rafId = requestAnimationFrame(tryStart);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (intervalId != null) clearInterval(intervalId);
    };
  }, [posts.length]);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, posts.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollTo({
      left: el.scrollLeft + (direction === 'left' ? -step : step),
      behavior: 'smooth',
    });
  };

  if (posts.length === 0) return null;

  return (
    <section
      className={cn('section-container texture-overlay relative overflow-hidden py-16 md:py-24', className)}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div ref={containerRef} className="relative mx-auto w-full max-w-[100%] px-0 md:px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-full text-center mb-8 md:mb-10"
        >
          <h3 className="text-3xl md:text-5xl font-extrabold leading-tight text-white pb-4 md:pb-5 m-0 box-border">
            {title}
          </h3>
        </motion.div>

        {/* Carousel */}
        <div className="relative overflow-hidden w-full">
          <div
            ref={trackRef}
            className="flex gap-3.5 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide will-change-transform md:ml-[-14px]"
            style={{
              scrollSnapType: 'x mandatory',
              overscrollBehaviorX: 'contain',
            }}
          >
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:min-w-[calc(25%+3.5px)] md:w-[calc(25%+3.5px)] md:pl-3.5 box-border select-none snap-center"
              >
                <div className="group relative w-full overflow-hidden rounded-xl md:rounded-[12px] bg-black/20 aspect-[9/16]">
                  {/* Media */}
                  <img
                    src={post.thumbnailUrl}
                    alt={post.caption ?? 'Instagram reel'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 select-none"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src !== PLACEHOLDER_THUMBNAIL) el.src = PLACEHOLDER_THUMBNAIL;
                    }}
                  />

                  {/* Video badge */}
                  {post.mediaType === 'VIDEO' && (
                    <div className="absolute top-3 right-3 z-[2] p-2 text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]">
                      {VIDEO_ICON}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-[1] flex flex-col justify-end p-4 md:p-6 bg-transparent opacity-0 group-hover:opacity-100 group-hover:bg-black/35 transition-all duration-200 text-white">
                    <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
                      <span className="text-white opacity-90">{INSTAGRAM_ICON}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Arrow buttons - visible on desktop hover */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-[3] w-10 h-10 md:w-10 md:h-10 rounded-full border-0 bg-white/60 backdrop-blur-sm text-black flex items-center justify-center transition-opacity duration-200 min-w-0 shadow-none',
              showArrows && canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible',
              !canScrollLeft && 'opacity-20 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-[3] w-10 h-10 md:w-10 md:h-10 rounded-full border-0 bg-white/60 backdrop-blur-sm text-black flex items-center justify-center transition-opacity duration-200 min-w-0 shadow-none',
              showArrows && canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible',
              !canScrollRight && 'opacity-20 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Follow CTA */}
        <div className="mt-6 text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white/90 hover:text-white underline underline-offset-2 transition-colors"
          >
            @atmosskateleague
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramCarousel;
