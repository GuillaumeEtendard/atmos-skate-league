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
    title: "Un nouveau sport",
    text: [
      "En 2026, AtmosGear va créer le Rollerball en vrai.",
      "Un genre de Rollerderby bousté avec un ballon et 4 équipes qui s'affrontent en Roller électriques. Devant 2000 personnes en physique et 100 000 en live sur Twitch.",
      "Le but ? Remettre le Roller au sommet et offrir à la communauté un vrai événement spectaculaire !"
    ],
    bgColor: "#232323",
    textColor: "light"
  },
  {
    id: 2,
    mainTitle: "PHASE 1",
    title: "Phase 1 – Qualifications",
    text: [
      "De Mars à Mai, les KOTR (King of the Road) et QOTR (Queen of the Road) servent de qualifications officielles pour dénicher les 18 meilleurs Patineur(se)s de France."
      , "Avec 6 Courses au total."
    ],
    location: "Karting Smile World – Bercy 2",
    bgColor: "#FFFFFF",
    textColor: "dark"
  },
  {
    id: 3,
    mainTitle: "PHASE 2",
    title: "Phase 2 – Constitution des équipes",
    text: [
      "En Juin, les joueurs qualifiés intègrent les 3 équipes officielles : Black NIGHT, Yellow THUNDER & White SKY.",
      "Chaque équipe sera dirigée par un gros créateur de contenu Français."
    ],
    location: "Karting Smile World – Bercy 2",
    bgColor: "#FFB03B",
    textColor: "dark"
  },
  {
    id: 4,
    mainTitle: "PHASE 3",
    title: "Phase 3 – Bootcamps",
    text: [
      "De juillet à octobre, tous les joueurs se retrouvent 3 jours par mois pour s'entraîner, se préparer et créer une cohésion d'équipe forte."
      , "Les entraînements seront filmés et rediffusés en live sur Twitch."
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
          className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory cursor-grab select-none active:cursor-grabbing items-stretch h-[480px]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {slides.map((slide, idx) => {
            const isSlideMainEvent = slide.id === 5;
            const isDark = slide.textColor === "dark";
            const isDarkBg = slide.bgColor === "#232323";
            return (
              <div key={slide.id} className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center h-full">
                <div
                  className="relative h-full rounded-2xl overflow-hidden flex flex-col"
                  style={{ backgroundColor: slide.bgColor }}
                >
                  {/* Glow Effect - no yellow on dark backgrounds */}
                  {!isDarkBg && (
                    <div className={cn(
                      "absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500",
                      isSlideMainEvent ? "bg-[#ffd600]/20" : "bg-[#ffd600]/10"
                    )} />
                  )}

                  {/* Content - centré */}
                  <div className="relative z-10 p-6 flex flex-col flex-1 min-h-0 items-center">
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
                      "text-2xl font-black uppercase tracking-wide mb-4 text-center w-full",
                      isDark ? "text-black" : "text-white"
                    )}>
                      {slide.title}
                    </h3>

                    {/* Text - prend l'espace restant, centré et plus gros */}
                    <div className="space-y-3 mb-6 flex-1 min-h-0 w-full flex flex-col items-center">
                      {slide.text.map((paragraph, pIdx) => (
                        <p key={pIdx} className={cn(
                          "text-base leading-relaxed text-center w-full max-w-md",
                          isDark ? "text-black/70" : "text-white/70"
                        )}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Location Pin - collé en bas de la carte sur mobile */}
                    {slide.location && (
                      <div className={cn(
                        "flex items-center justify-center gap-2 pt-3 border-t mt-auto flex-shrink-0 w-full",
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
                          "text-base font-semibold tracking-tight",
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
            className="relative w-full max-w-3xl min-h-[450px] md:min-h-[500px] rounded-2xl overflow-hidden transition-colors duration-500 flex flex-col"
            style={{ backgroundColor: currentSlide.bgColor }}
          >
            {/* Glow Effect - no yellow on dark backgrounds */}
            {currentSlide.bgColor !== "#232323" && (
              <div className={cn(
                "absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500",
                isMainEvent ? "bg-[#ffd600]/20" : "bg-[#ffd600]/10"
              )} />
            )}

            {/* Content - centré verticalement et horizontalement */}
            <div className="relative z-10 p-8 md:p-12 flex-1 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center max-w-2xl w-full"
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
                    "text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wide mb-6 text-center w-full",
                    currentSlide.textColor === "dark" ? "text-black" : "text-white"
                  )}>
                    {currentSlide.title}
                  </h3>

                  {/* Text - centré et plus gros */}
                  <div className="space-y-4 mb-8 max-w-2xl w-full mx-auto">
                    {currentSlide.text.map((paragraph, idx) => (
                      <p key={idx} className={cn(
                        "text-lg md:text-xl leading-relaxed text-center",
                        currentSlide.textColor === "dark" ? "text-black/70" : "text-white/70"
                      )}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Location Pin */}
                  {currentSlide.location && (
                    <div className={cn(
                      "flex items-center justify-center gap-3 pt-4 border-t w-full",
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
                        "text-lg md:text-xl font-semibold tracking-tight",
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
