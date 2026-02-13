import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragScroll } from '@/hooks/use-drag-scroll';

// Format block images
import kotrKingLogo from '@/assets/kotr-king-logo-new.png';
import qotrQueenLogo from '@/assets/qotr-queen-logo-new.png';
import mixteVsLogo from '@/assets/mixte-vs-logo.png';
import atmosElectricLogo from '@/assets/atmos-electric-logo.png';
type FormatType = 'king' | 'queen' | 'mixte' | 'electric';
interface FormatBlockProps {
  title: string;
  type: FormatType;
  children: React.ReactNode;
  hasElectricEffect?: boolean;
  className?: string;
  image?: string;
  imageSize?: 'normal' | 'large';
}
const typeStyles = {
  king: {
    gradient: 'from-[#FFA500]/30 to-transparent',
    border: 'border-[#FFA500]/50 hover:border-[#FFA500]',
    glow: 'hover:shadow-[0_0_30px_-5px_#FFA500]',
    accent: '#FFA500'
  },
  queen: {
    gradient: 'from-[#B065FF]/30 to-transparent',
    border: 'border-[#B065FF]/50 hover:border-[#B065FF]',
    glow: 'hover:shadow-[0_0_30px_-5px_#B065FF]',
    accent: '#B065FF'
  },
  mixte: {
    gradient: 'from-[#FF0000]/30 to-transparent',
    border: 'border-[#FF0000]/50 hover:border-[#FF0000]',
    glow: 'hover:shadow-[0_0_30px_-5px_#FF0000]',
    accent: '#FF0000'
  },
  electric: {
    gradient: 'from-[#00BFFF]/30 to-transparent',
    border: 'border-[#00BFFF]/50 hover:border-[#00BFFF]',
    glow: 'hover:shadow-[0_0_30px_-5px_#00BFFF]',
    accent: '#00BFFF'
  }
};
const FormatBlock = ({
  title,
  type,
  children,
  hasElectricEffect = false,
  className,
  image,
  imageSize = 'normal'
}: FormatBlockProps) => {
  const styles = typeStyles[type];
  const imageSizeClasses = imageSize === 'large' ? 'w-40 h-40 md:w-48 md:h-48' : 'w-28 h-28 md:w-32 md:h-32';
  return <div className={cn('group relative flex flex-col rounded-xl border bg-card p-5 md:p-8 text-center h-full transition-all duration-300', styles.border, styles.glow, className)}>
      {/* Background Gradient */}
      <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-t opacity-50', styles.gradient)} />

      {/* Floating particles effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none rounded-b-xl">
        <div className="absolute bottom-2 left-4 w-1 h-1 rounded-full animate-float" style={{
        animationDelay: '0s',
        backgroundColor: `${styles.accent}99`
      }} />
        <div className="absolute bottom-6 left-12 w-1.5 h-1.5 rounded-full animate-float" style={{
        animationDelay: '0.5s',
        backgroundColor: `${styles.accent}66`
      }} />
        <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full animate-float" style={{
        animationDelay: '1s',
        backgroundColor: `${styles.accent}80`
      }} />
        <div className="absolute bottom-8 right-16 w-0.5 h-0.5 rounded-full animate-float" style={{
        animationDelay: '1.5s',
        backgroundColor: `${styles.accent}B3`
      }} />
        <div className="absolute bottom-3 left-1/2 w-1 h-1 rounded-full animate-float" style={{
        animationDelay: '2s',
        backgroundColor: `${styles.accent}73`
      }} />
      </div>

      {/* Electric effect for Atmos Riders */}
      {hasElectricEffect && <>
          {/* Animated electric border glow */}
          <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
        boxShadow: `inset 0 0 25px -10px rgba(0,191,255,0.4)`,
        animation: 'electricPulse 2s ease-in-out infinite'
      }} />
          
          {/* Flickering overlay */}
          <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(0,191,255,0.1) 0%, transparent 50%, rgba(0,191,255,0.15) 100%)',
        animation: 'electricFlicker 0.15s infinite'
      }} />
          
          {/* Static noise texture */}
          <div className="absolute inset-0 rounded-xl opacity-15 pointer-events-none mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: 'staticNoise 0.1s steps(3) infinite'
      }} />
          
          {/* Main lightning bolt - animated */}
          <svg className="absolute top-2 left-2 w-6 h-6 opacity-70" viewBox="0 0 24 24" fill="#00BFFF" style={{
        animation: 'lightningFlash 1.5s ease-in-out infinite'
      }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          
          {/* Secondary lightning bolts */}
          <svg className="absolute bottom-3 right-2 w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="#00BFFF" style={{
        animation: 'lightningFlash 1.8s ease-in-out infinite',
        animationDelay: '0.3s'
      }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <svg className="absolute top-1/2 right-1 w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="#00BFFF" style={{
        animation: 'lightningFlash 2.2s ease-in-out infinite',
        animationDelay: '0.7s'
      }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <svg className="absolute bottom-1/3 left-1 w-3 h-3 opacity-40" viewBox="0 0 24 24" fill="#00BFFF" style={{
        animation: 'lightningFlash 1.6s ease-in-out infinite',
        animationDelay: '1s'
      }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          
          {/* Electric spark particles */}
          <div className="absolute top-[20%] left-[25%] w-1.5 h-1.5 bg-[#00BFFF] rounded-full" style={{
        animation: 'sparkle 0.8s ease-in-out infinite',
        boxShadow: '0 0 6px 2px #00BFFF'
      }} />
          <div className="absolute top-[40%] right-[15%] w-1 h-1 bg-[#00BFFF] rounded-full" style={{
        animation: 'sparkle 1.2s ease-in-out infinite',
        animationDelay: '0.2s',
        boxShadow: '0 0 4px 1px #00BFFF'
      }} />
          <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-white rounded-full" style={{
        animation: 'sparkle 1s ease-in-out infinite',
        animationDelay: '0.5s',
        boxShadow: '0 0 5px 2px #00BFFF'
      }} />
          <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 bg-[#00BFFF] rounded-full" style={{
        animation: 'sparkle 0.9s ease-in-out infinite',
        animationDelay: '0.8s',
        boxShadow: '0 0 6px 2px #00BFFF'
      }} />
          <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-white rounded-full" style={{
        animation: 'sparkle 1.1s ease-in-out infinite',
        animationDelay: '0.3s',
        boxShadow: '0 0 4px 1px #00BFFF'
      }} />
          
          {/* Electric arc lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{
        animation: 'electricFlicker 0.2s infinite'
      }}>
            <line x1="10%" y1="20%" x2="30%" y2="35%" stroke="#00BFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="70%" y1="15%" x2="85%" y2="40%" stroke="#00BFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="15%" y1="70%" x2="35%" y2="85%" stroke="#00BFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="65%" y1="75%" x2="90%" y2="60%" stroke="#00BFFF" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </>}

      {/* Square Image Holder */}
      <div className={`relative z-10 mx-auto mb-4 flex items-center justify-center overflow-hidden ${imageSizeClasses}`}>
        {image ? <img src={image} alt={title} className="w-full h-full object-contain" /> : <span className="text-muted-foreground text-xs uppercase tracking-wider opacity-50">Image</span>}
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-xl md:text-2xl font-bold uppercase tracking-wide mb-4" style={{
      color: styles.accent
    }}>
        {title}
      </h3>

      {/* Body Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center space-y-3 text-sm md:text-base leading-relaxed text-foreground/80">
        {children}
      </div>
    </div>;
};
// Sur mobile : 3 slides (King, Queen, Mixte+Atmos Riders empilés)
const eventSlides = ['king', 'queen', 'mixte-electric'] as const;
const EventExplanation = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useDragScroll(sliderRef);
  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.85 + 16;
    sliderRef.current.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  };
  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? eventSlides.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };
  const goToNext = () => {
    const newIndex = activeIndex === eventSlides.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.85 + 16;
    const newIndex = Math.round(sliderRef.current.scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < eventSlides.length) {
      setActiveIndex(newIndex);
    }
  };
  return <section id="event-explanation" className="section-container texture-overlay relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="mb-8 md:mb-12 text-center text-3xl font-bold uppercase tracking-wide text-foreground md:text-5xl">
          <span className="text-gradient-yellow drop-shadow-[0_0_30px_hsl(45_100%_50%/0.3)]">LES QUALIFICATIONS</span>
        </h2>

        {/* Content */}
        <div className="mb-10 md:mb-16 space-y-3 text-center text-base text-foreground/80 md:text-xl max-w-3xl mx-auto">
          <p className="text-pretty">
            Une compétition intense où <span className="font-bold text-[#ffd600]">20 participants</span> s'affrontent dans une série de courses à élimination.
            Les courses se déroulent en <span className="font-bold text-[#ffd600]">3 phases</span>, où seuls les <span className="font-bold text-[#ffd600]">3 plus rapides</span> se qualifient pour la phase suivante.
          </p>
            <p className="text-pretty">
            La course finale couronne le <span className="text-gradient-yellow font-bold">Roi</span> ou la <span className="text-gradient-yellow font-bold">Reine</span> de la Route.
          </p>
        </div>

        {/* Format Cards - Mobile Slider / Desktop Grid */}
        <div ref={sliderRef} onScroll={handleScroll} onPointerDown={drag.onPointerDown} onPointerMove={drag.onPointerMove} onPointerUp={drag.onPointerUp} onPointerCancel={drag.onPointerCancel} onPointerLeave={drag.onPointerLeave} className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory cursor-grab select-none active:cursor-grabbing" style={{
        WebkitOverflowScrolling: 'touch'
      }}>
          {/* Block 1: King of the Road */}
          <div className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center">
            <FormatBlock title="KING OF THE ROAD" type="king" image={kotrKingLogo} imageSize="large">
              <p>
                La course qui va révéler les Rois de la Route. Ouverte à tous les styles et toutes les configs de Rollers.
              </p>
              <p>
                Vous roulez avec votre <span className="font-bold text-[#FFA500]">PROPRE</span> paire — tout est permis, sauf l'électrique.
              </p>
              <p className="mt-2 text-foreground">
              x2 Courses <span className="font-bold text-[#FFA500]">HOMMES</span>
              </p>
            </FormatBlock>
          </div>

          {/* Block 2: Queen of the Road */}
          <div className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center">
            <FormatBlock title="QUEEN OF THE ROAD" type="queen" image={qotrQueenLogo} imageSize="large">
              <p>
                La course qui va révéler les Reines de la Route. Ouverte à tous les styles et toutes les configs de Rollers.
              </p>
              <p>
                Vous roulez avec votre <span className="font-bold text-[#B065FF]">PROPRE</span> paire — tout est permis, sauf l'électrique.
              </p>
              <p className="mt-2 text-foreground">
                x2 Courses <span className="font-bold text-[#B065FF]">FEMMES</span>
              </p>
            </FormatBlock>
          </div>

          {/* Block 3 + 4 sur mobile : Course Mixte et Atmos Riders un en dessous de l'autre */}
          <div className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center flex flex-col gap-4">
            <FormatBlock title="COURSE MIXTE" type="mixte" image={mixteVsLogo} imageSize="large">
              <p>
                Ouverte à toutes et tous, sans distinction de genre !
              </p>
            </FormatBlock>
            <FormatBlock title="ATMOS RIDERS" type="electric" hasElectricEffect image={atmosElectricLogo} imageSize="large">
              <p>
                Course exclusive en Rollers électriques pour nos clients !
              </p>
            </FormatBlock>
          </div>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex justify-center items-center gap-6 mt-6">
          <button onClick={goToPrev} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Slide précédente">
            <ChevronLeft className="w-5 h-5 text-[#ffd600]" />
          </button>
          <span className="text-muted-foreground text-sm">{activeIndex + 1} / {eventSlides.length}</span>
          <button onClick={goToNext} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Slide suivante">
            <ChevronRight className="w-5 h-5 text-[#ffd600]" />
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Block 1: King of the Road */}
          <FormatBlock title="KING OF THE ROAD" type="king" image={kotrKingLogo} imageSize="large">
            <p>
              La course qui va révéler les Rois de la Route. Ouverte à tous les styles et toutes les configs de Rollers.
            </p>
            <p>
              Vous roulez avec votre <span className="font-bold text-[#FFA500]">PROPRE</span> paire — tout est permis, sauf l'électrique.
            </p>
            <p className="mt-2 text-foreground">
              x2 Courses <span className="font-bold text-[#FFA500]">HOMMES</span>
            </p>
          </FormatBlock>

          {/* Block 2: Queen of the Road */}
          <FormatBlock title="QUEEN OF THE ROAD" type="queen" image={qotrQueenLogo} imageSize="large">
            <p>
              La course qui va révéler les Reines de la Route. Ouverte à tous les styles et toutes les configs de Rollers.
            </p>
            <p>
              Vous roulez avec votre <span className="font-bold text-[#B065FF]">PROPRE</span> paire — tout est permis, sauf l'électrique.
            </p>
            <p className="mt-2 text-foreground">
              x2 Courses <span className="font-bold text-[#B065FF]">FEMMES</span>
            </p>
          </FormatBlock>

          {/* Right column: Course Mixte + Atmos Riders stacked */}
          <div className="flex flex-col gap-4">
            {/* Block 3: Course Mixte */}
            <FormatBlock title="COURSE MIXTE" type="mixte" image={mixteVsLogo}>
              <p>
                Ouverte à toutes et tous, sans distinction de genre !
              </p>
            </FormatBlock>

            {/* Block 4: Atmos Riders */}
            <FormatBlock title="ATMOS RIDERS" type="electric" hasElectricEffect image={atmosElectricLogo}>
              <p>
                Course exclusive en Rollers électriques pour nos clients !
              </p>
            </FormatBlock>
          </div>
        </div>
      </div>
    </section>;
};
export default EventExplanation;