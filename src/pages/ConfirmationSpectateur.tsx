import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEventSlot } from '@/contexts/EventSlotContext';
import { cn } from '@/lib/utils';

const typeStyles = {
  king:     { bg: 'bg-racing-yellow/10', border: 'border-racing-yellow/30', text: 'text-racing-yellow' },
  queen:    { bg: 'bg-racing-purple/10', border: 'border-racing-purple/30', text: 'text-racing-purple' },
  electric: { bg: 'bg-racing-blue/10',   border: 'border-racing-blue/30',   text: 'text-racing-blue'   },
  mixte:    { bg: 'bg-racing-red/10',    border: 'border-racing-red/30',    text: 'text-racing-red'    },
};

const ConfirmationSpectateur = () => {
  const navigate = useNavigate();
  const { selectedSlot } = useEventSlot();

  const slotStyles = selectedSlot ? typeStyles[selectedSlot.type] : null;

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffd600 1px, transparent 1px), linear-gradient(90deg, #ffd600 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-[#ffd600]/6 rounded-full blur-[150px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-[#ffd600] mb-2">Inscription confirmée !</h1>
              <p className="text-muted-foreground">
                Tu es inscrit en tant que spectateur à l'Atmos Skate League.
              </p>
            </div>

            {selectedSlot && slotStyles && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={cn('rounded-lg border p-5 text-left space-y-3', slotStyles.bg, slotStyles.border)}
              >
                <div className={cn('inline-block rounded-full px-3 py-1 text-xs font-bold uppercase', slotStyles.text, slotStyles.bg)}>
                  {selectedSlot.title}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">{selectedSlot.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">{selectedSlot.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">Atmos Skate League</span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-[#ffd600]/10 border border-[#ffd600]/30 rounded-lg p-4"
            >
              <p className="text-[#ffd600] font-semibold">
                On t'attend à la course
                {selectedSlot ? ` — ${selectedSlot.title} · ${selectedSlot.date} à ${selectedSlot.time}` : ''} !
              </p>
            </motion.div>

            <Button
              onClick={() => navigate('/')}
              className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold"
            >
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationSpectateur;
