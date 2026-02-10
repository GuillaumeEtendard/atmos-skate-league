import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import kartingTrack from '@/assets/karting-track.png';

const LocationSection = () => {
  return (
    <section className="section-container texture-overlay relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>LIEU DE L'ÉVÉNEMENT</SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image à gauche */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-2xl overflow-hidden border border-border hover:border-[#ffd600]/30 hover:shadow-[0_0_30px_-10px_#ffd600]"
            style={{ transition: 'border-color 0.4s ease, box-shadow 0.5s ease' }}
          >
            <img
              src={kartingTrack}
              alt="Circuit de karting Smile World"
              className="w-full h-64 md:h-80 lg:h-96 object-contain bg-background/50"
            />
            {/* Pictogramme lieu intégré */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full border border-[#ffd600]/30">
              <MapPin className="w-5 h-5 text-[#ffd600]" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Lieu</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Texte à droite */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl border border-border hover:border-[#ffd600]/30 bg-card/80 backdrop-blur-sm p-8 relative overflow-hidden hover:shadow-[0_0_30px_-10px_#ffd600]" style={{ transition: 'border-color 0.4s ease, box-shadow 0.5s ease' }}>
              {/* Card glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ffd600]/10 rounded-full blur-[50px]" />
              
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-foreground relative z-10 mb-4">
                Centre Commercial Bercy 2
                <span className="block text-[#ffd600] mt-1">Dernier étage</span>
              </h3>

              <div className="flex items-start gap-3 text-muted-foreground relative z-10">
                <MapPin className="w-5 h-5 text-[#ffd600] mt-1 flex-shrink-0" />
                <p className="text-lg">
                  4 Place de l'Europe,<br />
                  94220 Charenton-le-Pont
                </p>
              </div>

              {/* Decorative line */}
              <div className="mt-6 h-1 w-20 bg-gradient-to-r from-[#ffd600] to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
