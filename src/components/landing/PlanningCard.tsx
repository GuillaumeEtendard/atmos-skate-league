import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEventSlot } from '@/contexts/EventSlotContext';

interface PlanningCardProps {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'king' | 'queen' | 'electric' | 'mixte';
  spotsRemaining: number;
  totalSpots: number;
  comingSoon?: boolean;
}

const typeStyles = {
  king: {
    gradient: 'from-racing-yellow/20 to-transparent',
    border: 'border-racing-yellow/30 hover:border-racing-yellow',
    glow: 'glow-yellow',
    badge: 'bg-racing-yellow text-primary-foreground',
    accent: 'text-racing-yellow',
  },
  queen: {
    gradient: 'from-racing-purple/20 to-transparent',
    border: 'border-racing-purple/30 hover:border-racing-purple',
    glow: 'glow-purple',
    badge: 'bg-racing-purple text-foreground',
    accent: 'text-racing-purple',
  },
  electric: {
    gradient: 'from-racing-blue/20 to-transparent',
    border: 'border-racing-blue/30 hover:border-racing-blue',
    glow: 'glow-blue',
    badge: 'bg-racing-blue text-foreground',
    accent: 'text-racing-blue',
  },
  mixte: {
    gradient: 'from-racing-red/20 to-transparent',
    border: 'border-racing-red/30 hover:border-racing-red',
    glow: 'glow-red',
    badge: 'bg-racing-red text-foreground',
    accent: 'text-racing-red',
  },
};

const PlanningCard = ({ id, date, time, title, type, spotsRemaining, totalSpots, comingSoon = false }: PlanningCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const navigate = useNavigate();
  const { setSelectedSlot } = useEventSlot();

  const styles = typeStyles[type];

  const handleRegistration = () => {
    if (comingSoon) return;
    setSelectedSlot({ id, date, time, title, type });
    navigate('/inscription');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (comingSoon || !cardRef.current) return;
    
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

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      className="card-3d group min-w-[260px] md:min-w-0"
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300',
          styles.border,
          !comingSoon && 'group-hover:' + styles.glow
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          transformStyle: 'preserve-3d',
        }}
        >
          {/* Background Gradient - pointer-events-none pour laisser les clics au contenu */}
          <div className={cn('absolute inset-0 pointer-events-none bg-gradient-to-t opacity-50', styles.gradient)} />

          {/* Floating particles effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
            <div className={cn('absolute bottom-2 left-4 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/60' : type === 'queen' ? 'bg-racing-purple/60' : type === 'electric' ? 'bg-racing-blue/60' : 'bg-racing-red/60')} style={{ animationDelay: '0s' }} />
            <div className={cn('absolute bottom-6 left-12 w-1.5 h-1.5 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/40' : type === 'queen' ? 'bg-racing-purple/40' : type === 'electric' ? 'bg-racing-blue/40' : 'bg-racing-red/40')} style={{ animationDelay: '0.5s' }} />
            <div className={cn('absolute bottom-4 right-8 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/50' : type === 'queen' ? 'bg-racing-purple/50' : type === 'electric' ? 'bg-racing-blue/50' : 'bg-racing-red/50')} style={{ animationDelay: '1s' }} />
            <div className={cn('absolute bottom-8 right-16 w-0.5 h-0.5 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/70' : type === 'queen' ? 'bg-racing-purple/70' : type === 'electric' ? 'bg-racing-blue/70' : 'bg-racing-red/70')} style={{ animationDelay: '1.5s' }} />
            <div className={cn('absolute bottom-3 left-1/2 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/45' : type === 'queen' ? 'bg-racing-purple/45' : type === 'electric' ? 'bg-racing-blue/45' : 'bg-racing-red/45')} style={{ animationDelay: '2s' }} />
          </div>

          {/* Content - z-20 et isolation pour être au-dessus du dégradé dans le contexte 3D */}
        <div className="relative z-20 isolate">
          {/* Type Badge */}
          <div className={cn('mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase', styles.badge)}>
            {title}
          </div>

          {/* Date */}
          <div className="mb-2 text-2xl font-bold uppercase text-foreground">
            {date}
          </div>

          {/* Time */}
          <div className={cn('mb-4 text-sm font-medium', styles.accent)}>
            {time}
          </div>

          {/* Spots Remaining */}
          <div className="mb-4 text-center">
            <span className={cn('text-sm font-medium', spotsRemaining === 0 ? 'text-red-500' : 'text-muted-foreground')}>
              places restantes {spotsRemaining}/{totalSpots}
            </span>
          </div>

          {/* CTA - onMouseEnter annule le tilt pour que le clic soit fiable sur desktop */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'relative z-20 w-full border-racing-yellow/50',
              comingSoon ? 'cursor-not-allowed opacity-70 text-muted-foreground' : 'cursor-pointer text-racing-yellow hover:bg-racing-yellow/10'
            )}
            disabled={spotsRemaining === 0 || comingSoon}
            onClick={handleRegistration}
            onMouseEnter={handleMouseLeave}
          >
            {comingSoon ? 'COMING SOON' : spotsRemaining === 0 ? 'COMPLET' : 'INSCRIPTION'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanningCard;
