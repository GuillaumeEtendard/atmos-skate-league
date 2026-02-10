import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Calendar, Users, Dumbbell, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    icon: Trophy,
    title: "L'Atmos Skate League en résumé",
    text: [
      "L'Atmos Skate League est la compétition de fin de saison.",
      "Elle réunit uniquement les vainqueurs de la KOTR (King Of The Road) et de la QOTR (Queen Of The Road) pour un affrontement final entre les meilleurs."
    ]
  },
  {
    id: 2,
    icon: Calendar,
    title: "Phase 1 – KOTR (Saison régulière)",
    text: [
      "La KOTR se déroule de mars à mai 2026.",
      "C'est la saison régulière de l'Atmos Skate League et elle sert à qualifier les 18 meilleurs Patineur(se)s de France.",
      "Chaque KOTR sert de qualification pour la grande finale."
    ]
  },
  {
    id: 3,
    icon: Users,
    title: "Phase 2 – Choix des équipes",
    text: [
      "À la fin de chaque KOTR, les vainqueurs composent les équipes.",
      "Le gagnant choisit en premier son équipe parmi : Black Night, Yellow Thunder ou White Sky.",
      "Le deuxième choisit parmi les équipes restantes, et ainsi de suite.",
      "Les 4 Équipes officielles qui participeront à l'ASL (BN, YT, WS, All Star) seront définitives à l'issue de cette phase."
    ]
  },
  {
    id: 4,
    icon: Dumbbell,
    title: "Phase 3 – Bootcamps",
    text: [
      "Après la saison régulière, les gagnants entrent dans une préparation intense.",
      "Pendant 4 mois, ils participent à des bootcamps à raison de 3 jours par mois.",
      "Nourris et logés par Atmosgear, ils s'entraînent avec des créateurs de contenu à la tête de chaque équipe."
    ]
  },
  {
    id: 5,
    icon: Crown,
    title: "Phase 4 – Le grand jour",
    text: [
      "Le tournoi final.",
      "L'affrontement ultime entre les équipes.",
      "Une seule victoire possible.",
      "À la clé : une place dans la légende de l'Atmos Skate League."
    ]
  }
];

const LeagueExplanationSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    if (index < 0) {
      setActiveIndex(slides.length - 1);
    } else if (index >= slides.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };

  const currentSlide = slides[activeIndex];
  const IconComponent = currentSlide.icon;

  return (
    <section className="section-container py-20 md:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffd600]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="mb-16 text-center text-3xl font-bold uppercase tracking-wide text-foreground md:text-5xl relative">
          <span className="text-gradient-yellow drop-shadow-[0_0_30px_hsl(45_100%_50%/0.3)]">
            L'Atmos Skate League, c'est quoi ?
          </span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-racing-yellow to-transparent rounded-full" />
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => goToSlide(activeIndex - 1)}
            className="absolute left-0 top-1/2 z-20 flex -translate-y-1/2 -translate-x-2 md:-translate-x-12 rounded-full border border-border bg-card/80 backdrop-blur-sm p-2 md:p-3 text-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 hover:shadow-[0_0_20px_-5px_hsl(45_100%_50%/0.5)]"
            aria-label="Slide précédente"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={() => goToSlide(activeIndex + 1)}
            className="absolute right-0 top-1/2 z-20 flex -translate-y-1/2 translate-x-2 md:translate-x-12 rounded-full border border-border bg-card/80 backdrop-blur-sm p-2 md:p-3 text-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 hover:shadow-[0_0_20px_-5px_hsl(45_100%_50%/0.5)]"
            aria-label="Slide suivante"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Slide Content */}
          <div className="relative min-h-[280px] md:min-h-[350px] flex items-center justify-center px-8 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-6 md:p-12 overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd600]/10 rounded-full blur-[80px]" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#ffd600]/5 rounded-full blur-[80px]" />

                  {/* Phase indicator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffd600] to-[#ffaa00] shadow-[0_0_20px_#ffd600/30]">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-[#ffd600]">
                      {activeIndex === 0 ? 'Vue d\'ensemble' : `Phase ${activeIndex}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-3xl font-bold uppercase tracking-wide text-foreground mb-4">
                    {currentSlide.title}
                  </h3>

                  {/* Text content */}
                  <div className="space-y-3">
                    {currentSlide.text.map((paragraph, idx) => (
                      <p key={idx} className="text-sm md:text-lg text-muted-foreground leading-relaxed text-pretty">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="mt-8 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  activeIndex === index
                    ? 'w-10 bg-gradient-to-r from-[#ffd600] to-[#ffaa00] shadow-[0_0_10px_#ffd600]'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-muted-foreground">
              <span className="text-[#ffd600] font-bold">{activeIndex + 1}</span> / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeagueExplanationSection;
