import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useEventSlot } from '@/contexts/EventSlotContext';
import { Trophy, Users } from 'lucide-react';

interface PlanningCardProps {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'king' | 'queen' | 'electric' | 'mixte';
  spotsRemaining: number;
  totalSpots: number;
  comingSoon?: boolean;
  isPast?: boolean;
  /** Mode compact pour la grille mobile (3 cartes par ligne). */
  compact?: boolean;
  /** Logo partenaire affiché à côté du logo type (ex. deeps). */
  partnerLogo?: string;
}

const TYPE_LOGOS: Record<'king' | 'queen' | 'electric' | 'mixte', string> = {
  king: '/atmos-uploads/king.png',
  queen: '/atmos-uploads/queen.png',
  electric: '/atmos-uploads/electric.png',
  mixte: '/atmos-uploads/mixte.png',
};

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

const PlanningCard = ({ id, date, time, title, type, spotsRemaining, totalSpots, comingSoon = false, isPast = false, compact = false, partnerLogo }: PlanningCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { setSelectedSlot } = useEventSlot();

  const styles = typeStyles[type];

  const handleRegistration = () => {
    if (comingSoon) return;
    setSelectedSlot({ id, date, time, title, type });
    setShowPopup(true);
  };

  const handleChallenger = () => {
    setShowPopup(false);
    navigate(`/inscription/${id}`);
  };

  const handleSpectateur = () => {
    setShowPopup(false);
    navigate(`/inscription-spectateur/${id}`);
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
      className={cn(
        'card-3d group relative overflow-visible',
        compact ? 'min-w-0 w-full' : 'min-w-[260px] md:min-w-0',
        isPast && 'opacity-50'
      )}
      style={{ perspective: '1000px' }}
    >
      {/* Logo type (et logo partenaire si présent) en haut à droite, débordant */}
      <div
        className={cn(
          'absolute -top-2 -right-2 z-20 pointer-events-none flex items-end',
          partnerLogo ? 'flex-col gap-0.5 md:flex-row md:gap-1' : '',
          compact && '-top-1 -right-1'
        )}
      >
        {partnerLogo && (
          <img
            src={partnerLogo}
            alt=""
            className={cn(
              'w-auto object-contain drop-shadow-lg',
              type === 'electric' ? 'h-24 md:h-32' : 'h-16 md:h-24',
              'md:max-w-32'
            )}
          />
        )}
        <img
          src={TYPE_LOGOS[type]}
          alt=""
          className={cn(
            'w-auto object-contain drop-shadow-lg',
            partnerLogo
              ? type === 'electric' ? 'h-24 md:h-32' : 'h-16 md:h-24'
              : compact ? (type === 'electric' ? 'h-14' : 'h-12') : type === 'electric' ? 'h-28 md:h-32' : 'h-20 md:h-24'
          )}
        />
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-xl border bg-card transition-all duration-300',
          compact ? 'p-3' : 'p-6',
          styles.border,
          !comingSoon && 'group-hover:' + styles.glow
        )}
        style={{
          transform: compact ? undefined : `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          transformStyle: 'preserve-3d',
        }}
        >
          {/* Background Gradient - pointer-events-none pour laisser les clics au contenu */}
          <div className={cn('absolute inset-0 pointer-events-none bg-gradient-to-t opacity-50', styles.gradient)} />

          {/* Floating particles effect at bottom - masqué en compact */}
          {!compact && (
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
            <div className={cn('absolute bottom-2 left-4 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/60' : type === 'queen' ? 'bg-racing-purple/60' : type === 'electric' ? 'bg-racing-blue/60' : 'bg-racing-red/60')} style={{ animationDelay: '0s' }} />
            <div className={cn('absolute bottom-6 left-12 w-1.5 h-1.5 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/40' : type === 'queen' ? 'bg-racing-purple/40' : type === 'electric' ? 'bg-racing-blue/40' : 'bg-racing-red/40')} style={{ animationDelay: '0.5s' }} />
            <div className={cn('absolute bottom-4 right-8 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/50' : type === 'queen' ? 'bg-racing-purple/50' : type === 'electric' ? 'bg-racing-blue/50' : 'bg-racing-red/50')} style={{ animationDelay: '1s' }} />
            <div className={cn('absolute bottom-8 right-16 w-0.5 h-0.5 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/70' : type === 'queen' ? 'bg-racing-purple/70' : type === 'electric' ? 'bg-racing-blue/70' : 'bg-racing-red/70')} style={{ animationDelay: '1.5s' }} />
            <div className={cn('absolute bottom-3 left-1/2 w-1 h-1 rounded-full animate-float', type === 'king' ? 'bg-racing-yellow/45' : type === 'queen' ? 'bg-racing-purple/45' : type === 'electric' ? 'bg-racing-blue/45' : 'bg-racing-red/45')} style={{ animationDelay: '2s' }} />
          </div>
          )}

          {/* Content - z-20 et isolation pour être au-dessus du dégradé dans le contexte 3D */}
        <div className="relative z-20 isolate">
          {/* Type Badge */}
          <div className={cn(
            'inline-block rounded-full font-bold uppercase',
            compact ? 'mb-2 px-2 py-0.5 text-[10px]' : 'mb-4 px-3 py-1 text-xs',
            styles.badge
          )}>
            {title}
          </div>

          {/* Date */}
          <div className={cn(
            'font-bold uppercase text-foreground',
            compact ? 'mb-1 text-sm leading-tight' : 'mb-2 text-2xl'
          )}>
            {date}
          </div>

          {/* Time */}
          <div className={cn(
            'font-medium',
            compact ? 'mb-2 text-[10px]' : 'mb-4 text-sm',
            styles.accent
          )}>
            {time}
          </div>

          {/* Spots Remaining — invisible si l'événement est passé (garde la hauteur) */}
          <div className={cn('text-center', compact ? 'mb-2' : 'mb-4', isPast && 'invisible')}>
            <span className={cn(
              'font-medium',
              compact ? 'text-[10px]' : 'text-sm',
              spotsRemaining === 0 ? 'text-red-500' : 'text-muted-foreground'
            )}>
              Places restantes {spotsRemaining}/{totalSpots}
            </span>
          </div>

          {/* CTA */}
          {isPast ? (
            <div className={cn(
              'relative z-20 flex w-full items-center justify-center rounded-md border border-border/40 bg-muted/20 text-muted-foreground',
              compact ? 'h-8 text-[10px]' : 'h-9 text-sm'
            )}>
              Événement passé
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'relative z-20 w-full border-racing-yellow/50',
                compact && 'h-8 text-xs',
                comingSoon ? 'cursor-not-allowed opacity-70 text-muted-foreground' : 'cursor-pointer text-racing-yellow hover:bg-racing-yellow'
              )}
              disabled={comingSoon}
              onClick={handleRegistration}
              onMouseEnter={handleMouseLeave}
            >
              {comingSoon
                ? 'COMING SOON'
                : spotsRemaining === 0
                  ? 'INSCRIPTION SPECTATEUR →'
                  : 'INSCRIPTION'}
            </Button>
          )}

          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="max-w-sm border-racing-yellow/30 bg-background">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold uppercase tracking-wider text-racing-yellow">
                  Mode d'inscription
                </DialogTitle>
                <DialogDescription className="text-center text-sm text-muted-foreground">
                  {date} · {time}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <div
                  className={cn(
                    'flex items-center gap-4 rounded-lg border p-4 text-left transition-all',
                    spotsRemaining === 0
                      ? 'cursor-not-allowed border-border/30 bg-muted/20 opacity-50'
                      : 'group cursor-pointer border-racing-yellow/30 bg-racing-yellow/5 hover:border-racing-yellow hover:bg-racing-yellow/10'
                  )}
                  onClick={spotsRemaining > 0 ? handleChallenger : undefined}
                  role={spotsRemaining > 0 ? 'button' : undefined}
                  tabIndex={spotsRemaining > 0 ? 0 : undefined}
                  onKeyDown={spotsRemaining > 0 ? (e) => e.key === 'Enter' && handleChallenger() : undefined}
                >
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    spotsRemaining === 0 ? 'bg-muted text-muted-foreground' : 'bg-racing-yellow/20 text-racing-yellow'
                  )}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">S'inscrire en challenger</p>
                    <p className="text-xs text-muted-foreground">
                      {spotsRemaining === 0 ? 'Complet — plus de places disponibles' : 'Participe à la compétition (35€)'}
                    </p>
                  </div>
                  {spotsRemaining === 0 && (
                    <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400 border border-red-500/30">Complet</span>
                  )}
                </div>
                <button
                  onClick={handleSpectateur}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4 text-left transition-all hover:border-foreground/30 hover:bg-card"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-muted/80">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">S'inscrire en spectateur</p>
                    <p className="text-xs text-muted-foreground">Viens supporter et profiter de l'événement</p>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PlanningCard;
