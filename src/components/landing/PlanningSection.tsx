import { useRef, useState } from 'react';
import PlanningCard from './PlanningCard';
import SectionTitle from './SectionTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';

const events = [
  { id: 'king-14-mars', date: 'Samedi 14 mars', time: '19h30 / 21h30', title: 'King of the Road', type: 'king' as const, spotsRemaining: 20, totalSpots: 20 },
  { id: 'queen-28-mars', date: 'Samedi 28 mars', time: '19h30 / 21h30', title: 'Queen of the Road', type: 'queen' as const, spotsRemaining: 20, totalSpots: 20 },
  { id: 'king-11-avril', date: 'Samedi 11 avril', time: '19h30 / 21h30', title: 'King of the Road', type: 'king' as const, spotsRemaining: 20, totalSpots: 20 },
  { id: 'queen-25-avril', date: 'Samedi 25 avril', time: '19h30 / 21h30', title: 'Queen of the Road', type: 'queen' as const, spotsRemaining: 20, totalSpots: 20 },
  { id: 'electric-9-mai', date: 'Samedi 9 mai', time: '19h30 / 21h30', title: 'Électrique', type: 'electric' as const, spotsRemaining: 20, totalSpots: 20 },
  { id: 'mixte-23-mai', date: 'Samedi 23 mai', time: '19h30 / 21h30', title: 'Mixte', type: 'mixte' as const, spotsRemaining: 20, totalSpots: 20 },
];

const PlanningSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useDragScroll(sliderRef);

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
