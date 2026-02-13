import { useRef, useState, useEffect } from 'react';
import PlanningCard from './PlanningCard';
import SectionTitle from './SectionTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { EVENTS } from '@/data/events';

/** Plafond "places restantes" affiché : on affiche au plus ce nombre ; s'il en reste moins (plus d'inscrits), on affiche le nombre réel. */
const MAX_SPOTS_REMAINING_DISPLAYED: Record<string, number> = {
  'king-15-mars': 10,
  'queen-28-mars': 15,
  'electric-9-mai': 18,
};

const PlanningSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const drag = useDragScroll(sliderRef);

  useEffect(() => {
    const eventIds = EVENTS.map((e) => e.id).join(',');
    fetch(`/api/get-participant-counts?eventIds=${encodeURIComponent(eventIds)}`)
      .then((res) => res.ok ? res.json() : {})
      .then((counts: Record<string, number>) => setParticipantCounts(counts))
      .catch(() => {});
  }, []);

  const events = EVENTS.map((event) => {
    const rawCount = participantCounts[event.id] ?? 0;
    const actualRemaining = Math.max(0, event.totalSpots - rawCount);
    const maxDisplayed = MAX_SPOTS_REMAINING_DISPLAYED[event.id];
    const spotsRemaining = maxDisplayed != null
      ? Math.min(maxDisplayed, actualRemaining)
      : actualRemaining;
    return {
      ...event,
      spotsRemaining,
    };
  });

  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = 280 + 16; // card width + gap
    sliderRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? events.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === events.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = 280 + 16;
    const newIndex = Math.round(sliderRef.current.scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < events.length) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <section id="planning" className="section-container texture-overlay relative py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>PLANNING</SectionTitle>

        {/* Desktop Grid / Mobile Slider */}
        <div className="relative">
          {/* Cards - Mobile Slider */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onPointerDown={drag.onPointerDown}
            onPointerMove={drag.onPointerMove}
            onPointerUp={drag.onPointerUp}
            onPointerCancel={drag.onPointerCancel}
            onPointerLeave={drag.onPointerLeave}
            className="md:hidden scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 cursor-grab select-none active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {events.map((event) => (
              <div key={event.id} className="min-w-[280px] flex-shrink-0 snap-center">
                <PlanningCard {...event} />
              </div>
            ))}
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
            <span className="text-muted-foreground text-sm">{activeIndex + 1} / {events.length}</span>
            <button
              onClick={goToNext}
              className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300"
              aria-label="Slide suivante"
            >
              <ChevronRight className="w-5 h-5 text-[#ffd600]" />
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id}>
                <PlanningCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanningSection;
