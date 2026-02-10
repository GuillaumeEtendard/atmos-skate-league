import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import SectionTitle from './SectionTitle';

const CommunitySection = () => {
  return (
    <section className="section-container texture-overlay relative overflow-hidden py-16 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>COMMUNITY</SectionTitle>

        {/* Centered Rules Card */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border hover:border-[#ffd600]/30 bg-card/80 backdrop-blur-sm p-6 md:p-8 relative overflow-hidden transition-all hover:shadow-[0_0_30px_-10px_#ffd600]">
            {/* Card glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#ffd600]/10 rounded-full blur-[50px]" />
            
            <h3 className="mb-6 text-2xl font-bold uppercase text-foreground relative z-10 text-center">
              Règlement
            </h3>

            {/* Download Button */}
            <Button className="mb-8 w-full rounded-lg py-6 text-lg relative z-10 font-bold uppercase tracking-wide transition-all hover:shadow-[0_0_20px_-5px_#ffd600]" style={{
              background: 'linear-gradient(135deg, #ffd600 0%, #ffaa00 100%)',
              color: '#0a0a0a'
            }}>
              <Download className="mr-2 h-5 w-5" />
              TÉLÉCHARGER LE RULESET
            </Button>

            {/* Info Text */}
            <div className="space-y-3 text-muted-foreground relative z-10 text-center text-sm md:text-base">
              <p className="text-pretty">Retrouvez ici toutes les règles nécessaires pour la course.</p>
              <p className="text-pretty">Utilisez votre propre matériel et protections. Le port du casque est obligatoire.</p>
              <p className="flex items-center justify-center gap-2">
                <span className="text-[#ffd600]">📍</span>
                <span className="text-pretty">Circuit de karting <span className="font-semibold text-[#ffd600]">Smile World Bercy 2</span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
