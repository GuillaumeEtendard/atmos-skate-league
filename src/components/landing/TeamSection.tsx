import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import teamBlackNight from '@/assets/team-black-night-photo.png';
import teamYellowThunder from '@/assets/team-yellow-thunder-photo.png';
import teamWhiteSky from '@/assets/team-white-sky-photo.png';

type GlowColor = 'purple' | 'yellow' | 'blue';

interface TeamCardProps {
  image: string;
  glowColor: GlowColor;
}

const glowStyles: Record<GlowColor, {
  shadow: string;
  hoverShadow: string;
}> = {
  purple: {
    shadow: '0 0 40px -10px rgba(168, 85, 247, 0.4)',
    hoverShadow: '0 0 60px -5px rgba(168, 85, 247, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  yellow: {
    shadow: '0 0 40px -10px rgba(255, 214, 0, 0.4)',
    hoverShadow: '0 0 60px -5px rgba(255, 214, 0, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  blue: {
    shadow: '0 0 40px -10px rgba(125, 211, 252, 0.4)',
    hoverShadow: '0 0 60px -5px rgba(125, 211, 252, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
};

const TeamCard = ({ image, glowColor }: TeamCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const styles = glowStyles[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -8;
    const rotateYValue = (mouseX / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      ref={cardRef}
      className="group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative overflow-hidden rounded-3xl aspect-[3/4]"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '20px' : '0'}) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform',
          boxShadow: isHovered ? styles.hoverShadow : styles.shadow,
        }}
      >
        {/* Full format image */}
        <img 
          src={image} 
          alt="Team"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: isHovered 
              ? `scale(1.08) translateX(${rotateY * 0.5}px) translateY(${-rotateX * 0.5}px)` 
              : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />

        {/* Subtle vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Top shine effect */}
        <div 
          className="absolute inset-x-0 top-0 h-1/3 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)',
            transition: 'opacity 0.5s ease',
          }}
        />
      </div>
    </motion.div>
  );
};

const teams = [
  { image: teamBlackNight, glowColor: 'purple' as const },
  { image: teamYellowThunder, glowColor: 'yellow' as const },
  { image: teamWhiteSky, glowColor: 'blue' as const },
];

const TeamSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const drag = useDragScroll(sliderRef as React.RefObject<HTMLDivElement>);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / teams.length));
    setActiveIndex(Math.min(idx, teams.length - 1));
  }, []);

  const goToPrev = () => {
    const el = sliderRef.current;
    if (!el) return;
    const w = el.scrollWidth / teams.length;
    el.scrollTo({ left: Math.max(0, el.scrollLeft - w), behavior: 'smooth' });
  };
  const goToNext = () => {
    const el = sliderRef.current;
    if (!el) return;
    const w = el.scrollWidth / teams.length;
    el.scrollTo({ left: Math.min(el.scrollWidth, el.scrollLeft + w), behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle>Teams</SectionTitle>
        
        {/* Explanatory Text */}
        <div className="text-center mt-6 mb-12 md:mb-16 max-w-2xl mx-auto space-y-3">
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-pretty">
            À chaque course, seuls les <span className="font-bold text-[#ffd600]">3 meilleurs</span> gagnent leur place pour l'<span className="font-bold text-[#ffd600]">event</span> de fin de saison.
          </p>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-pretty">
            Le <span className="font-bold text-[#ffd600]">1er</span> choisit sa team, le <span className="font-bold text-[#ffd600]">2e</span> choisit parmi les restantes, le <span className="font-bold text-[#ffd600]">3e</span> prend la dernière.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
          {teams.map((team, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
              <TeamCard {...team} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onPointerLeave={drag.onPointerLeave}
          className="md:hidden scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 touch-pan-x cursor-grab select-none active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {teams.map((team, index) => (
            <div key={index} className="min-w-[75vw] flex-shrink-0 snap-center">
              <TeamCard {...team} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center items-center gap-6 mt-6">
          <button onClick={goToPrev} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Précédent">
            <ChevronLeft className="w-5 h-5 text-[#ffd600]" />
          </button>
          <span className="text-muted-foreground text-sm">{activeIndex + 1} / {teams.length}</span>
          <button onClick={goToNext} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Suivant">
            <ChevronRight className="w-5 h-5 text-[#ffd600]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
