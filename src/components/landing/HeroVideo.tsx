import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import kotrLogo from '@/assets/kotr-logo.png';
const HeroVideo = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const scrollToNext = () => {
    const nextSection = document.getElementById('event-explanation');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video ref={videoRef} autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/compressed/hero-background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Noise Texture */}
      <div className="texture-overlay absolute inset-0" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 flex h-full flex-col items-center justify-center gap-[16rem] px-4 text-center md:gap-16 lg:gap-20">
        {/* Logo */}
        <div 
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <img alt="King of the Road" className="h-32 w-auto drop-shadow-2xl md:h-44 lg:h-52" src="/atmos-uploads/3e08aa7c-2882-4c9e-aba3-b9d830611a35.png" />
        </div>

        {/* Title + Button (moins d'espace entre les deux) */}
        <div className="flex flex-col items-center gap-[2rem] text-center">
          <h1 
            className="text-5xl font-bold uppercase tracking-wider text-foreground md:text-7xl lg:text-8xl"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(15px)',
              transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.15s, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.15s',
            }}
          >
            LA 1ÈRE LIGUE DE <span className="text-gradient-yellow">ROLLERS</span>
          </h1>

          <div 
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(15px)',
              transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.45s, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.45s',
            }}
          >
            <Button size="lg" className="btn-gradient-yellow rounded-full px-10 py-6 text-lg" onClick={scrollToNext}>
              JE PARTICIPE !
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToNext} 
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" 
        aria-label="Scroll to next section"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(15px)',
          transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.6s, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.6s',
        }}
      >
        <ChevronDown className="h-10 w-10 animate-bounce text-foreground/60" />
      </button>
    </section>;
};
export default HeroVideo;