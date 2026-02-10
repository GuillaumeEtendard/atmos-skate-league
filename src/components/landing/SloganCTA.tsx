import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SloganCTA = () => {
  const handleInscription = () => {
    const planningSection = document.getElementById('planning');
    if (planningSection) {
      planningSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Electric flicker animation - gentler, less jarring
  const electricFlicker = {
    opacity: [1, 0.85, 1, 0.95, 1],
    x: [0, -0.5, 0, 0.5, 0],
  };

  // Lightning bolt positions
  const lightningBolts = [
    { left: '8%', top: '25%', size: 'w-10 h-20', delay: 0.5, repeatDelay: 2.5 },
    { left: '15%', top: '45%', size: 'w-6 h-12', delay: 1.2, repeatDelay: 3.2 },
    { left: '22%', top: '30%', size: 'w-8 h-16', delay: 0.8, repeatDelay: 4 },
    { right: '8%', top: '28%', size: 'w-10 h-20', delay: 1.8, repeatDelay: 2.8 },
    { right: '16%', top: '50%', size: 'w-7 h-14', delay: 0.3, repeatDelay: 3.5 },
    { right: '24%', top: '35%', size: 'w-6 h-12', delay: 2.2, repeatDelay: 2.2 },
    { left: '30%', top: '60%', size: 'w-5 h-10', delay: 1.5, repeatDelay: 3.8 },
    { right: '32%', top: '55%', size: 'w-5 h-10', delay: 0.9, repeatDelay: 4.2 },
    { left: '40%', top: '20%', size: 'w-6 h-12', delay: 2.5, repeatDelay: 3 },
    { right: '42%', top: '65%', size: 'w-4 h-8', delay: 1.1, repeatDelay: 2.6 },
  ];

  // Zap icon positions
  const zapIcons = [
    { left: '5%', top: '40%', size: 32, delay: 0.2, repeatDelay: 2 },
    { left: '12%', top: '60%', size: 24, delay: 1.4, repeatDelay: 3.4 },
    { right: '5%', top: '35%', size: 28, delay: 0.7, repeatDelay: 2.8 },
    { right: '12%', top: '58%', size: 20, delay: 2.1, repeatDelay: 3.1 },
    { left: '25%', top: '70%', size: 18, delay: 1.8, repeatDelay: 4.5 },
    { right: '28%', top: '22%', size: 22, delay: 0.4, repeatDelay: 3.8 },
  ];

  return (
    <section className="section-container texture-overlay relative overflow-hidden pt-8 md:pt-12">
      {/* Electric sparks - reduced and smoother */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Horizontal electric lines - fewer, smoother */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`spark-h-${i}`}
            className="absolute h-[1.5px] bg-gradient-to-r from-transparent via-[#ffd600]/70 to-transparent"
            style={{
              top: `${25 + (i * 10)}%`,
              left: `${10 + (i % 3) * 30}%`,
              width: `${50 + Math.random() * 40}px`,
            }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              scaleX: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.25,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 3,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
        
        {/* Vertical electric sparks - fewer, smoother */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`spark-v-${i}`}
            className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#ffd600]/70 to-transparent"
            style={{
              left: `${15 + i * 18}%`,
              top: `${30 + (i % 2) * 20}%`,
              height: `${35 + Math.random() * 35}px`,
            }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              scaleY: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2.5 + Math.random() * 2.5,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Diagonal electric arcs - fewer */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`arc-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#ffd600]/60 to-transparent"
            style={{
              top: `${35 + (i % 2) * 20}%`,
              left: `${20 + i * 18}%`,
              width: `${70 + Math.random() * 50}px`,
              transform: `rotate(${i % 2 === 0 ? 35 : -35}deg)`,
            }}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
              scaleX: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 3,
              delay: Math.random() * 4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Lightning bolt SVGs - fewer, smoother */}
        {lightningBolts.slice(0, 6).map((bolt, i) => (
          <motion.svg
            key={`bolt-${i}`}
            className={`absolute ${bolt.size} text-[#ffd600]/80`}
            style={{ left: bolt.left, right: bolt.right, top: bolt.top }}
            viewBox="0 0 24 48"
            fill="currentColor"
            animate={{ opacity: [0, 0.8, 0.8, 0], scale: [0.8, 1, 1, 0.8] }}
            transition={{ 
              duration: 0.3, 
              repeat: Infinity, 
              repeatDelay: bolt.repeatDelay + 1, 
              delay: bolt.delay,
              ease: "easeOut",
            }}
          >
            <path d="M13 0L0 24h10L8 48l16-28H14L13 0z" />
          </motion.svg>
        ))}

        {/* Zap icons from lucide - fewer, smoother */}
        {zapIcons.slice(0, 4).map((zap, i) => (
          <motion.div
            key={`zap-${i}`}
            className="absolute text-[#ffd600]/70"
            style={{ left: zap.left, right: zap.right, top: zap.top }}
            animate={{ 
              opacity: [0, 0.7, 0.7, 0], 
              scale: [0.7, 1, 1, 0.7],
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity, 
              repeatDelay: zap.repeatDelay + 1, 
              delay: zap.delay,
              ease: "easeOut",
            }}
          >
            <Zap size={zap.size} fill="currentColor" />
          </motion.div>
        ))}

        {/* Electric particle dots - fewer, smoother */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#ffd600]/70 rounded-full"
            style={{
              left: `${10 + i * 9}%`,
              top: `${30 + (i % 4) * 12}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1.2, 1, 0.5],
              y: [0, -8, -16],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 3,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Slogan */}
        <div className="mb-12">
          <motion.h2 
            className="mb-2 text-6xl font-bold uppercase tracking-wider text-foreground md:text-8xl lg:text-9xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            animate={electricFlicker}
          >
            ROLL FAST.
          </motion.h2>
          <motion.h2 
            className="text-6xl font-bold uppercase tracking-wider md:text-8xl lg:text-9xl text-[#ffd600]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            animate={{
              ...electricFlicker,
              x: [0, 0.3, 0, -0.3, 0],
            }}
          >
            RACE HARD.
          </motion.h2>
        </div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="rounded-full px-10 py-6 text-lg border-2 border-[#ffd600] text-[#ffd600] bg-transparent font-semibold uppercase tracking-wide transition-all hover:bg-[#ffd600]/10 hover:shadow-[0_0_30px_-5px_#ffd600]"
            onClick={handleInscription}
          >
            REJOINS LA COURSE
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SloganCTA;
