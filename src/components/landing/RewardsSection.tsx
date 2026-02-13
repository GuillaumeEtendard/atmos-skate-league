import { useRef, useState } from 'react';
import { Ticket } from 'lucide-react';
import RewardCard from './RewardCard';
import { Button } from '@/components/ui/button';
import SectionTitle from './SectionTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import rollerPrizeGold from '@/assets/roller-prize.png';
import cinnarollPrize from '@/assets/cinnaroll-prize.png';
import smileWorldPrize from '@/assets/smile-world-prize.png';
import aslLogo from '@/assets/asl-logo-white.png';
const rewards = [{
  title: 'Rollers Électriques Atmos',
  value: '750€',
  image: rollerPrizeGold
}, {
  title: 'Platines Atmos 4x80mm',
  value: '150€',
  image: cinnarollPrize
}, {
  title: '2 sessions Karting offertes',
  value: '40€',
  image: smileWorldPrize
}];
const RewardsSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useDragScroll(sliderRef);

  const handleInscription = () => {
    const planningSection = document.getElementById('planning');
    if (planningSection) {
      planningSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = 340;
    const containerWidth = sliderRef.current.offsetWidth;
    const scrollPosition = cardWidth * index - containerWidth / 2 + cardWidth / 2;
    sliderRef.current.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });
  };
  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? rewards.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };
  const goToNext = () => {
    const newIndex = activeIndex === rewards.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = 340;
    const containerWidth = sliderRef.current.offsetWidth;
    const scrollCenter = sliderRef.current.scrollLeft + containerWidth / 2;
    const newIndex = Math.round((scrollCenter - cardWidth / 2) / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < rewards.length) {
      setActiveIndex(newIndex);
    }
  };
  const goToIndex = (index: number) => {
    setActiveIndex(index);
    scrollToSlide(index);
  };
  return <section className="section-container texture-overlay overflow-visible pt-24 md:pt-28 pb-20 md:pb-28 relative">
      <div className="relative z-10">
        <SectionTitle>RÉCOMPENSES</SectionTitle>


        {/* Slider Container */}
        <div className="relative">
          {/* Cards Slider */}
          <div ref={sliderRef} onScroll={handleScroll} onPointerDown={drag.onPointerDown} onPointerMove={drag.onPointerMove} onPointerUp={drag.onPointerUp} onPointerCancel={drag.onPointerCancel} onPointerLeave={drag.onPointerLeave} className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-visible px-4 pt-16 pb-4 md:justify-center md:overflow-visible md:pt-0 cursor-grab select-none active:cursor-grabbing" style={{
          WebkitOverflowScrolling: 'touch'
        }}>
            {rewards.map((reward, index) => <div key={reward.title} className="snap-center flex-shrink-0">
                <RewardCard {...reward} index={index} />
              </div>)}
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="md:hidden flex justify-center items-center gap-6 mt-6">
            <button onClick={goToPrev} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Slide précédente">
              <ChevronLeft className="w-5 h-5 text-[#ffd600]" />
            </button>
            <span className="text-muted-foreground text-sm">{activeIndex + 1} / {rewards.length}</span>
            <button onClick={goToNext} className="p-2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300" aria-label="Slide suivante">
              <ChevronRight className="w-5 h-5 text-[#ffd600]" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center items-center gap-6 mt-8">
            <button onClick={goToPrev} className="p-3 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300 group" aria-label="Slide précédente">
              <ChevronLeft className="w-6 h-6 text-[#ffd600] group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-3">
              {rewards.map((_, index) => <button key={index} onClick={() => goToIndex(index)} className={`h-2 w-8 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-gradient-to-r from-[#ffd600] to-[#ffaa00] shadow-[0_0_10px_#ffd600]' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} aria-label={`Go to reward ${index + 1}`} />)}
            </div>

            <button onClick={goToNext} className="p-3 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm hover:bg-[#ffd600]/10 hover:border-[#ffd600]/60 transition-all duration-300 group" aria-label="Slide suivante">
              <ChevronRight className="w-6 h-6 text-[#ffd600] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Featured ASL Card - Main Reward */}
        <div className="mb-8 md:mb-16 mt-16">
          {/* Title above the featured card */}
          <h3 className="text-xl md:text-3xl font-bold text-center mb-6 md:mb-8 uppercase tracking-wide">
            <span className="text-gradient-yellow drop-shadow-[0_0_20px_hsl(45_100%_50%/0.4)]">
              Remporte ta place pour l'Atmos Skate League
            </span>
          </h3>

          {/* Featured Golden Card */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-yellow-600/20 backdrop-blur-sm p-6 md:p-12 shadow-[0_0_60px_-10px_hsl(45_100%_50%/0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              
              {/* Animated shimmer */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent" />
              </div>

              {/* Noise texture */}
              <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-2xl" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />

              {/* Floating golden particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-yellow-300/70 animate-float" style={{
                animationDelay: '0s'
              }} />
                <div className="absolute top-10 right-16 w-2 h-2 rounded-full bg-yellow-400/50 animate-float" style={{
                animationDelay: '0.5s'
              }} />
                <div className="absolute bottom-12 left-20 w-1 h-1 rounded-full bg-amber-300/60 animate-float" style={{
                animationDelay: '1s'
              }} />
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-200/50 animate-float" style={{
                animationDelay: '1.5s'
              }} />
                <div className="absolute bottom-8 right-24 w-1 h-1 rounded-full bg-yellow-400/60 animate-float" style={{
                animationDelay: '2s'
              }} />
                <div className="absolute top-16 left-1/3 w-1 h-1 rounded-full bg-amber-200/50 animate-float" style={{
                animationDelay: '2.5s'
              }} />
              </div>

              {/* Diagonal light streak */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-transparent to-yellow-600/15 pointer-events-none rounded-2xl" />

              {/* Edge highlights */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent rounded-t-2xl" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-yellow-300/50 via-transparent to-transparent rounded-l-2xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
              {/* Main text */}
                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-yellow-100 mb-8 max-w-2xl leading-relaxed text-pretty">
                  Les 3 gagnants de chaque course remportent leur place pour l'<span className="text-[#ffd600] drop-shadow-[0_0_10px_hsl(45_100%_50%/0.6)]">Atmos Skate League</span>, l'événement de fin de saison.
                </p>

                {/* ASL Logo */}
                <div className="relative">
                  <img src={aslLogo} alt="Atmos Skate League" className="h-24 md:h-32 lg:h-40 w-auto drop-shadow-[0_0_30px_rgba(255,214,0,0.4)]" />
                  {/* Glow under logo */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-yellow-400/30 blur-xl rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="btn-gradient-yellow rounded-full px-10 py-6 text-lg font-bold uppercase tracking-wide"
            onClick={handleInscription}
          >
            <Ticket className="w-5 h-5 mr-2" />
            Je m'inscris !
          </Button>
        </div>
      </div>
    </section>;
};
export default RewardsSection;