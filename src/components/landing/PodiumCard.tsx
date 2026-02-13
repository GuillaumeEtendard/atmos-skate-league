import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Timer } from 'lucide-react';

interface PodiumCardProps {
  rank: number;
  name: string;
  points: number;
  maxSpeed: string;
  chrono: string;
  avatar?: string;
}

const rankStyles = {
  1: {
    // Gold
    background: 'bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-600',
    shimmer: 'bg-gradient-to-r from-transparent via-white/40 to-transparent',
    border: 'border-yellow-400/50',
    glow: 'shadow-[0_0_60px_-10px_hsl(45_100%_50%/0.6),inset_0_1px_0_0_rgba(255,255,255,0.3)]',
    text: 'text-yellow-950',
    textMuted: 'text-yellow-900/70',
    valueText: 'text-yellow-950',
    icon: '🥇',
    overlay: 'from-yellow-200/20 via-transparent to-yellow-600/30',
    imageShadow: 'drop-shadow-[0_20px_40px_rgba(234,179,8,0.5)]',
    avatarRing: 'ring-yellow-400',
    avatarGlow: 'bg-yellow-400',
    statBg: 'bg-yellow-900/20',
  },
  2: {
    // Silver
    background: 'bg-gradient-to-br from-gray-200 via-white to-gray-400',
    shimmer: 'bg-gradient-to-r from-transparent via-white/60 to-transparent',
    border: 'border-gray-300/50',
    glow: 'shadow-[0_0_60px_-10px_hsl(0_0%_75%/0.6),inset_0_1px_0_0_rgba(255,255,255,0.5)]',
    text: 'text-gray-800',
    textMuted: 'text-gray-600',
    valueText: 'text-gray-900',
    icon: '🥈',
    overlay: 'from-white/30 via-transparent to-gray-500/20',
    imageShadow: 'drop-shadow-[0_20px_40px_rgba(156,163,175,0.6)]',
    avatarRing: 'ring-gray-400',
    avatarGlow: 'bg-gray-400',
    statBg: 'bg-gray-800/20',
  },
  3: {
    // Bronze
    background: 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-700',
    shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
    border: 'border-orange-400/50',
    glow: 'shadow-[0_0_60px_-10px_hsl(30_80%_45%/0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)]',
    text: 'text-orange-950',
    textMuted: 'text-orange-900/70',
    valueText: 'text-orange-950',
    icon: '🥉',
    overlay: 'from-orange-200/20 via-transparent to-orange-700/30',
    imageShadow: 'drop-shadow-[0_20px_40px_rgba(234,88,12,0.5)]',
    avatarRing: 'ring-orange-400',
    avatarGlow: 'bg-orange-500',
    statBg: 'bg-orange-900/20',
  },
};

const PodiumCard = ({ rank, name, points, maxSpeed, chrono, avatar }: PodiumCardProps) => {
  const showPlaceholder = !avatar;
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const styles = rankStyles[rank as keyof typeof rankStyles] || rankStyles[1];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -12;
    const rotateYValue = (mouseX / (rect.width / 2)) * 12;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Independent 3D for the avatar - moves opposite to card for parallax effect
  const imageRotateX = rotateX * -0.5;
  const imageRotateY = rotateY * -0.5;

  return (
    <div
      ref={cardRef}
      className="group w-[280px] cursor-pointer md:w-[320px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <div
        className={cn(
          'relative overflow-visible rounded-2xl border-2 pb-8 pt-32 px-6 transition-all duration-500',
          styles.background,
          styles.border,
          styles.glow
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '20px' : '0'}) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Shimmer container - clipped to card bounds */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div 
            className={cn(
              'absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]',
              styles.shimmer
            )}
          />
        </div>

        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Diagonal Light Streak */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br pointer-events-none rounded-2xl',
          styles.overlay
        )} />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 rounded-full bg-white/60 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-8 right-6 w-1 h-1 rounded-full bg-white/40 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-12 left-8 w-0.5 h-0.5 rounded-full bg-white/50 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Rank Badge */}
        <div 
          className="absolute right-3 top-3 text-2xl z-20"
          style={{ 
            transform: `translateZ(50px) rotateX(${imageRotateX}deg) rotateY(${imageRotateY}deg)`,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        >
          {styles.icon}
        </div>

        {/* PLAYER AVATAR - Independent 3D */}
        <div 
          className="absolute -top-14 left-1/2 z-30 w-32 h-32 md:w-36 md:h-36"
          style={{ 
            transform: `translateX(-50%) translateZ(60px) rotateX(${imageRotateX * 1.5}deg) rotateY(${imageRotateY * 1.5}deg) scale(${isHovered ? 1.1 : 1})`,
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className={cn(
            'w-full h-full rounded-full ring-4 overflow-hidden flex items-center justify-center',
            styles.avatarRing,
            styles.imageShadow,
            showPlaceholder && 'bg-white'
          )}>
            {showPlaceholder ? (
              <span className={cn(
                'text-5xl md:text-6xl font-bold select-none',
                styles.text,
                isHovered && 'scale-110'
              )} style={{ transition: 'transform 0.4s' }}>
                ?
              </span>
            ) : (
              <img 
                src={avatar} 
                alt={name}
                className={cn(
                  'w-full h-full object-cover transition-all duration-500',
                  isHovered && 'scale-110'
                )}
              />
            )}
          </div>
          
          {/* Glow ring under avatar */}
          <div 
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full blur-xl transition-opacity duration-300',
              styles.avatarGlow,
              isHovered ? 'opacity-70' : 'opacity-40'
            )}
            style={{ transform: 'translateY(15px) translateZ(-20px)' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
          {/* Name */}
          <h3 className={cn('text-xl font-bold uppercase text-center mb-2', styles.text)}>
            {name}
          </h3>
          
          {/* Points */}
          <p className={cn('text-3xl font-black text-center mb-4', styles.valueText)}>
            {points} pts
          </p>
          
          {/* Stats */}
          <div className="flex gap-3 justify-center">
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg', styles.statBg)}>
              <Zap className={cn('w-4 h-4', styles.text)} />
              <span className={cn('text-sm font-semibold', styles.text)}>{maxSpeed}</span>
            </div>
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg', styles.statBg)}>
              <Timer className={cn('w-4 h-4', styles.text)} />
              <span className={cn('text-sm font-semibold', styles.text)}>{chrono}</span>
            </div>
          </div>
        </div>

        {/* Edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-2xl" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-l-2xl" />
      </div>
    </div>
  );
};

export default PodiumCard;
