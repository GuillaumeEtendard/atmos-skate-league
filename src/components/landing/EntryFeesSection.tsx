import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from './SectionTitle';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import jerseyBlackNight from '@/assets/jersey-black-night.png';
import jerseyYellowThunder from '@/assets/jersey-yellow-thunder.png';
import jerseyWhiteSky from '@/assets/jersey-white-sky.png';

type GlowColor = 'purple' | 'yellow' | 'blue';

interface JerseyCardProps {
  image: string;
  glowColor: GlowColor;
  teamName: string;
}

const glowStyles: Record<GlowColor, {
  shadow: string;
  hoverShadow: string;
  bgGradient: string;
}> = {
  purple: {
    shadow: '0 0 40px -10px rgba(168, 85, 247, 0.5)',
    hoverShadow: '0 0 60px -5px rgba(168, 85, 247, 0.7), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
  },
  yellow: {
    shadow: '0 0 40px -10px rgba(255, 214, 0, 0.5)',
    hoverShadow: '0 0 60px -5px rgba(255, 214, 0, 0.7), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(255, 214, 0, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
  },
  blue: {
    shadow: '0 0 40px -10px rgba(125, 211, 252, 0.5)',
    hoverShadow: '0 0 60px -5px rgba(125, 211, 252, 0.7), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(125, 211, 252, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
  },
};

const JerseyCard = ({ image, glowColor, teamName }: JerseyCardProps) => {
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
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -6;
    const rotateYValue = (mouseX / (rect.width / 2)) * 6;
    
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
        className="relative overflow-hidden rounded-3xl aspect-[3/4] bg-card/50 backdrop-blur-sm"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '20px' : '0'}) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform',
          boxShadow: isHovered ? styles.hoverShadow : styles.shadow,
          background: styles.bgGradient,
        }}
      >
        {/* Jersey image */}
        <img 
          src={image} 
          alt={`Maillot ${teamName}`}
          className="absolute inset-0 w-full h-full object-contain p-4"
          style={{
            transform: isHovered 
              ? `scale(1.08) translateX(${rotateY * 0.5}px) translateY(${-rotateX * 0.5}px)` 
              : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />

        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Shine effect */}
        <div 
          className="absolute inset-x-0 top-0 h-1/3 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 100%)',
            transition: 'opacity 0.5s ease',
          }}
        />
      </div>
    </motion.div>
  );
};

const MainCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleInscription = () => {
    const planningSection = document.getElementById('planning');
    if (planningSection) {
      planningSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-3xl p-5 md:p-12 backdrop-blur-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(30, 30, 40, 0.9) 50%, rgba(168, 85, 247, 0.1) 100%)',
        boxShadow: isHovered 
          ? '0 0 80px -10px rgba(168, 85, 247, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          : '0 0 50px -15px rgba(168, 85, 247, 0.4)',
        transition: 'box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-3 md:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
          <Ticket className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
          <span className="text-purple-300 font-semibold text-xs md:text-sm uppercase tracking-wider">Offre spéciale</span>
        </div>
        
        <p 
          className="text-3xl md:text-5xl font-black text-[#fff]"
          style={{
            textShadow: '0 0 40px rgba(255, 214, 0, 0.5)',
          }}
        >
          35 € seulement !
        </p>
        
        <p className="text-sm md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
          On t'offre <span className="font-bold text-[#ffd600]">le maillot de ton choix</span> d'une valeur de 35 €. Tu le recois en main propre le jour de la compétition. <span className="font-semibold text-foreground">C'est comme si l'inscription était&nbsp;gratuite&nbsp;!</span>
        </p>
        
        <Button
          size="lg"
          className="mt-2 md:mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-sm md:text-lg px-6 py-4 md:px-8 md:py-6 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
          onClick={handleInscription}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Je m'inscris !
        </Button>
      </div>

      {/* Decorative glow corners */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
    </motion.div>
  );
};

const jerseys = [
  { image: jerseyBlackNight, glowColor: 'purple' as const, teamName: 'Black Night' },
  { image: jerseyYellowThunder, glowColor: 'yellow' as const, teamName: 'Yellow Thunder' },
  { image: jerseyWhiteSky, glowColor: 'blue' as const, teamName: 'White Sky' },
];

const EntryFeesSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const drag = useDragScroll(sliderRef as React.RefObject<HTMLDivElement>);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / jerseys.length));
    setActiveIndex(Math.min(idx, jerseys.length - 1));
  }, []);

  const goToPrev = () => {
    const el = sliderRef.current;
    if (!el) return;
    const w = el.scrollWidth / jerseys.length;
    el.scrollTo({ left: Math.max(0, el.scrollLeft - w), behavior: 'smooth' });
  };
  const goToNext = () => {
    const el = sliderRef.current;
    if (!el) return;
    const w = el.scrollWidth / jerseys.length;
    el.scrollTo({ left: Math.min(el.scrollWidth, el.scrollLeft + w), behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle>🎟️ Inscription</SectionTitle>
        
        {/* Main Card */}
        <div className="mb-12 md:mb-16">
          <MainCard />
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
          {jerseys.map((jersey, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
              <JerseyCard {...jersey} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: scroll horizontal fluide (momentum), snap doux à l'arrêt */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onPointerLeave={drag.onPointerLeave}
          className="md:hidden scrollbar-hide flex snap-x gap-4 overflow-x-auto overflow-y-visible px-4 pb-4 cursor-grab select-none active:cursor-grabbing scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x proximity' }}
        >
          {jerseys.map((jersey, index) => (
            <div key={index} className="min-w-[75vw] flex-shrink-0 snap-center">
              <JerseyCard {...jersey} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center items-center gap-6 mt-6">
          <button onClick={goToPrev} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Précédent">
            <ChevronLeft className="w-5 h-5 text-[#ffd600]" />
          </button>
          <span className="text-muted-foreground text-sm">{activeIndex + 1} / {jerseys.length}</span>
          <button onClick={goToNext} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Suivant">
            <ChevronRight className="w-5 h-5 text-[#ffd600]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EntryFeesSection;
