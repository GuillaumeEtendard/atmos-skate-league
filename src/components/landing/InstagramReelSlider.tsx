import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Instagram, Volume2, VolumeX } from 'lucide-react';
import { INSTAGRAM_REELS } from '@/data/instagramReels';
import SectionTitle from './SectionTitle';

function PrevArrow({ onClick }: { onClick?: React.MouseEventHandler }) {
  return (
    <button
      type="button"
      aria-label="Précédent"
      onClick={onClick}
      className="absolute left-0 md:left-[-48px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#ffd600]/20 hover:border-[#ffd600]/50 transition-all duration-200"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: React.MouseEventHandler }) {
  return (
    <button
      type="button"
      aria-label="Suivant"
      onClick={onClick}
      className="absolute right-0 md:right-[-48px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#ffd600]/20 hover:border-[#ffd600]/50 transition-all duration-200"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  );
}

function getSlidesToShow() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 600) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
}

export default function InstagramReelSlider() {
  const [muted, setMuted] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const onResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'linear',
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ bottom: '-44px' }}>
        <ul className="flex items-center justify-center gap-2 m-0 p-0 list-none">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <button
        type="button"
        className="block w-2 h-2 rounded-full bg-white/30 hover:bg-[#ffd600] transition-all duration-300"
        style={{ padding: 0, border: 'none', background: 'transparent' }}
      />
    ),
  };

  return (
    <section className="section-container texture-overlay relative overflow-hidden py-6 md:py-10">
      <div className="relative mx-auto w-full max-w-screen-xl md:px-20">

        {false && <>
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 md:mb-20 flex flex-col items-center text-center"
          >
            <SectionTitle>
              Nos <span className="text-gradient-yellow">Reels</span> Instagram
            </SectionTitle>
            <p className="mt-3 text-white/60 text-sm md:text-base max-w-md">
              Suivez l'action en direct sur notre compte Instagram
            </p>
          </motion.div>
        </>
        }

        {/* Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {INSTAGRAM_REELS.map((reel) => (
              <div key={reel.permalink} className="px-2 md:px-3 outline-none">
                <a
                  href={reel.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full overflow-hidden rounded-2xl bg-black aspect-[9/16] shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_32px_rgba(255,214,0,0.15)] transition-shadow duration-300 group"
                >
                  <video
                    src={reel.videoUrl}
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-[2] bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />

                  {/* Username badge */}
                  <div className="absolute bottom-3 left-3 z-[4] flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Instagram className="w-3 h-3 text-white/80" />
                    <span className="text-[11px] font-medium text-white/90">@{reel.username}</span>
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href="https://www.instagram.com/atmosskateleague/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors group"
          >
            <Instagram className="w-4 h-4" />
            <span className="underline underline-offset-2 group-hover:text-[#ffd600] transition-colors">
              @atmosskateleague
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
