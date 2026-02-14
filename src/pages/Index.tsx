import { useEffect } from 'react';
import HeroVideo from '@/components/landing/HeroVideo';
import LeagueFormatSection from '@/components/landing/LeagueFormatSection';
import EventExplanation from '@/components/landing/EventExplanation';
import HighlightsSection from '@/components/landing/HighlightsSection';
import RewardsSection from '@/components/landing/RewardsSection';
import TeamSection from '@/components/landing/TeamSection';
import PlanningSection from '@/components/landing/PlanningSection';
import EntryFeesSection from '@/components/landing/EntryFeesSection';
import SloganCTA from '@/components/landing/SloganCTA';
import RankingSection from '@/components/landing/RankingSection';
import ReplaySection from '@/components/landing/ReplaySection';
import LocationSection from '@/components/landing/LocationSection';
import BackToTop from '@/components/landing/BackToTop';
import CommunitySection from '@/components/landing/CommunitySection';

const Index = () => {
  // Scroll vers la section planning quand on arrive depuis l'inscription avec #planning
  useEffect(() => {
    if (window.location.hash !== '#planning') return;
    const t = setTimeout(() => {
      document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffd600 1px, transparent 1px), linear-gradient(90deg, #ffd600 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Animated gradient orbs - smoother */}
        <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-[#ffd600]/6 rounded-full blur-[150px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#ffd600]/5 rounded-full blur-[130px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '2s' }} />
        <div className="absolute top-[70%] left-[20%] w-[400px] h-[400px] bg-[#ffd600]/4 rounded-full blur-[120px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '4s' }} />
        <div className="absolute top-[90%] right-[10%] w-[500px] h-[500px] bg-[#ffd600]/5 rounded-full blur-[140px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '3s' }} />
        
        {/* Diagonal racing stripes */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 150px, #ffd600 150px, #ffd600 152px)'
        }} />
        
        {/* Floating particles */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-[#ffd600]/30 rounded-full animate-float" />
        <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-[#ffd600]/25 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[45%] left-[5%] w-1 h-1 bg-[#ffd600]/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[55%] right-[8%] w-2 h-2 bg-[#ffd600]/25 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[75%] left-[15%] w-1.5 h-1.5 bg-[#ffd600]/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[85%] right-[20%] w-1 h-1 bg-[#ffd600]/20 rounded-full animate-float" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroVideo />
        {false && <LeagueFormatSection />}
        
        <EventExplanation />
        <LocationSection />
        <PlanningSection />
        <EntryFeesSection />
        {false && <HighlightsSection />}
        <RewardsSection />
        <TeamSection />
        <SloganCTA />
        <RankingSection />
        <ReplaySection />
        {false && <CommunitySection />}
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-8 text-center backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            © 2026 Atmos Skate League by AtmosGear. Tous droits réservés.
          </p>
        </footer>

        <BackToTop />
      </div>
    </div>
  );
};

export default Index;
