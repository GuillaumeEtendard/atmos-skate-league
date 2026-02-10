import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import aslLogoHorizontal from '@/assets/asl-logo-horizontal.png';
import aslLogoBlack from '@/assets/asl-logo-black.png';
import kotrQotrLogos from '@/assets/kotr-qotr-logos.png';
import teamLogos from '@/assets/team-logos.png';

// Map slide id to its logo and size class
const slideLogos: Record<number, { src: string; sizeClass: string; desktopSizeClass: string }> = {
  1: { src: aslLogoHorizontal, sizeClass: "h-16", desktopSizeClass: "h-20" },
  2: { src: kotrQotrLogos, sizeClass: "h-32", desktopSizeClass: "h-40" },
  3: { src: teamLogos, sizeClass: "h-32", desktopSizeClass: "h-40" },
  4: { src: teamLogos, sizeClass: "h-32", desktopSizeClass: "h-40" },
  5: { src: aslLogoBlack, sizeClass: "h-16", desktopSizeClass: "h-20" },
};

interface Slide {
  id: number;
  mainTitle: string;
  title: string;
  text: string[];
  location?: string;
  bgColor: string;
  textColor: "light" | "dark";
}

const slides: Slide[] = [
  {
    id: 1,
    mainTitle: "INTRO",
    title: "Une ligue, une vision",
    text: [
      "AtmosGear va créer son Rollerball… pour de vrai.",
      "La première compétition de roller électrique où deux équipes de cinq joueurs vont s'affronter en live, devant 2 000 personnes sur place et des milliers en streaming.",
      "Le but ? Remettre le roller au sommet et offrir à la communauté un vrai événement spectaculaire !"
    ],
    bgColor: "#232323",
    textColor: "light"
  },
  {
    id: 2,
    mainTitle: "PHASE 1",
    title: "Phase 1 – KOTR & QOTR",
    text: [
      "De mars à mai, les KOTR (King of the Road) et QOTR (Queen of the Road) servent de qualifications officielles.",
      "Les 18 meilleurs patineurs et patineuses de France sont sélectionnés pour accéder à l'Atmos Skate League."
    ],
    location: "Circuit de Karting Smile World – Bercy 2",
    bgColor: "#FFFFFF",
    textColor: "dark"
  },
  {
    id: 3,
    mainTitle: "PHASE 2",
    title: "Phase 2 – Constitution des équipes",
    text: [
      "En juin, les joueurs qualifiés intègrent les 4 équipes officielles :",
      "Black Night, Yellow Thunder, White Sky et All Star.",
      "Ces équipes formeront le roster final de l'ASL."
    ],
    location: "Circuit de Karting Smile World – Bercy 2",
    bgColor: "#FFB03B",
    textColor: "dark"
  },
  {
    id: 4,
    mainTitle: "PHASE 3",
    title: "Phase 3 – Bootcamps",
    text: [
      "De juillet à octobre, tous les joueurs se retrouvent 3 jours par mois pour s'entraîner, se préparer et créer une cohésion d'équipe forte."
    ],
    location: "Île-de-France",
    bgColor: "#232323",
    textColor: "light"
  },
  {
    id: 5,
    mainTitle: "PHASE 4",
    title: "Phase 4 – Main Event ASL",
    text: [
      "Octobre 2026.",
      "Le tournoi final de l'Atmos Skate League.",
      "L'affrontement ultime entre les équipes, devant le public et en live."
    ],
    location: "Aren'Ice – Cergy-Pontoise",
    bgColor: "#FFFFFF",
    textColor: "dark"
  }
];

const LeagueFormatSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const drag = useDragScroll(sliderRef);

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.85 + 16;
    sliderRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current || !isMobile) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = sliderRef.current.offsetWidth * 0.85 + 16; // 85vw + gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < slides.length) {
      setActiveIndex(newIndex);
    }
  };

  const currentSlide = slides[activeIndex];
  const isMainEvent = currentSlide.id === 5;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Section Title */}
      <div className="container mx-auto px-4 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center uppercase tracking-wider"
        >
          <span className="bg-gradient-to-r from-[#ffd600] via-yellow-400 to-[#ffd600] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,214,0,0.5)]">
            Le format de l'Atmos Skate League
          </span>
        </motion.h2>
      </div>

      {/* Carousel Container */}
      <div className="container mx-auto px-4 relative">
        {/* Mobile Swipeable Slider */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onPointerLeave={drag.onPointerLeave}
          className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory touch-pan-x cursor-grab select-none active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {slides.map((slide, idx) => {
            const isSlideMainEvent = slide.id === 5;
            const isDark = slide.textColor === "dark";
            const isDarkBg = slide.bgColor === "#232323";
            return (
              <div key={slide.id} className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center">
                <div 
                  className="relative min-h-[420px] rounded-2xl overflow-hidden"
                  style={{ backgroundColor: slide.bgColor }}
                >
                  {/* Glow Effect - no yellow on dark backgrounds */}
                  {!isDarkBg && (
                    <div className={cn(
                      "absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500",
                      isSlideMainEvent ? "bg-[#ffd600]/20" : "bg-[#ffd600]/10"
                    )} />
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                      <img 
                        src={slideLogos[slide.id].src} 
                        alt="Logo" 
                        className={`${slideLogos[slide.id].sizeClass} w-auto object-contain`}
                      />
                    </div>

                    {/* Title */}
                    <h3 className={cn(
                      "text-2xl font-black uppercase tracking-wide mb-4 text-center",
                      isDark ? "text-black" : "text-white"
                    )}>
                      {slide.title}
                    </h3>

                    {/* Text */}
                    <div className="space-y-2 mb-6">
                      {slide.text.map((paragraph, pIdx) => (
                        <p key={pIdx} className={cn(
                          "text-sm leading-relaxed text-center",
                          isDark ? "text-black/70" : "text-white/70"
                        )}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Location Pin */}
                    {slide.location && (
                      <div className={cn(
                        "flex items-center justify-center gap-2 pt-3 border-t",
                        isDark ? "border-black/10" : "border-white/20"
                      )}>
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                          isDark 
                            ? "bg-black/10" 
                            : "bg-white/15"
                        )}>
                          <MapPin className={cn(
                            "w-4 h-4",
                            isDark ? "text-black" : "text-white"
                          )} />
                        </div>
                        <span className={cn(
                          "text-sm font-semibold tracking-tight",
                          isDark ? "text-black" : "text-white"
                        )}>
                          {slide.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex justify-center items-center gap-6 mt-6">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300"
            aria-label="Slide précédente"
          >
            <ChevronLeft className="w-5 h-5 text-[#ffd600]" />
          </button>
          <span className="text-muted-foreground text-sm">{activeIndex + 1} / {slides.length}</span>
          <button
            onClick={goToNext}
            className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300"
            aria-label="Slide suivante"
          >
            <ChevronRight className="w-5 h-5 text-[#ffd600]" />
          </button>
        </div>

        {/* Desktop Carousel with Arrows */}
        <div className="hidden md:flex items-center justify-center gap-4 md:gap-8">
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="z-10 p-3 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300 group"
            aria-label="Slide précédente"
          >
            <ChevronLeft className="w-6 h-6 text-[#ffd600] group-hover:scale-110 transition-transform" />
          </button>

          {/* Card */}
          <div 
            className="relative w-full max-w-3xl min-h-[450px] md:min-h-[500px] rounded-2xl overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: currentSlide.bgColor }}
          >
            {/* Glow Effect - no yellow on dark backgrounds */}
            {currentSlide.bgColor !== "#232323" && (
              <div className={cn(
                "absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500",
                isMainEvent ? "bg-[#ffd600]/20" : "bg-[#ffd600]/10"
              )} />
            )}

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center"
                >
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <img 
                      src={slideLogos[currentSlide.id].src} 
                      alt="Logo" 
                      className={`${slideLogos[currentSlide.id].desktopSizeClass} w-auto object-contain`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "text-3xl md:text-4xl font-black uppercase tracking-wide mb-6 text-center",
                    currentSlide.textColor === "dark" ? "text-black" : "text-white"
                  )}>
                    {currentSlide.title}
                  </h3>

                  {/* Text */}
                  <div className="space-y-3 mb-8 max-w-2xl">
                    {currentSlide.text.map((paragraph, idx) => (
                      <p key={idx} className={cn(
                        "text-base md:text-lg leading-relaxed text-center",
                        currentSlide.textColor === "dark" ? "text-black/70" : "text-white/70"
                      )}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Location Pin */}
                  {currentSlide.location && (
                    <div className={cn(
                      "flex items-center gap-3 pt-4 border-t",
                      currentSlide.textColor === "dark" ? "border-black/10" : "border-white/20"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                        currentSlide.textColor === "dark" 
                          ? "bg-black/10" 
                          : "bg-white/15"
                      )}>
                        <MapPin className={cn(
                          "w-5 h-5",
                          currentSlide.textColor === "dark" ? "text-black" : "text-white"
                        )} />
                      </div>
                      <span className={cn(
                        "text-base md:text-lg font-semibold tracking-tight",
                        currentSlide.textColor === "dark" ? "text-black" : "text-white"
                      )}>
                        {currentSlide.location}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="z-10 p-3 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300 group"
            aria-label="Slide suivante"
          >
            <ChevronRight className="w-6 h-6 text-[#ffd600] group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeagueFormatSection;
