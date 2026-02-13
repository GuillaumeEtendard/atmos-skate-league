import { useState, useEffect } from 'react';
import PlanningCard from './PlanningCard';
import SectionTitle from './SectionTitle';
import { EVENTS } from '@/data/events';

/** Plafond "places restantes" affiché : on affiche au plus ce nombre ; s'il en reste moins (plus d'inscrits), on affiche le nombre réel. */
const MAX_SPOTS_REMAINING_DISPLAYED: Record<string, number> = {
  'king-15-mars': 10,
  'queen-28-mars': 15,
  'electric-9-mai': 18,
};

const PlanningSection = () => {
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const eventIds = EVENTS.map((e) => e.id).join(',');
    fetch(`/api/get-participant-counts?eventIds=${encodeURIComponent(eventIds)}`)
      .then((res) => res.ok ? res.json() : {})
      .then((counts: Record<string, number>) => setParticipantCounts(counts))
      .catch(() => {});
  }, []);

  const events = EVENTS.map((event) => {
    const rawCount = participantCounts[event.id] ?? 0;
    const actualRemaining = Math.max(0, event.totalSpots - rawCount);
    const maxDisplayed = MAX_SPOTS_REMAINING_DISPLAYED[event.id];
    const spotsRemaining = maxDisplayed != null
      ? Math.min(maxDisplayed, actualRemaining)
      : actualRemaining;
    return {
      ...event,
      spotsRemaining,
    };
  });

  return (
    <section id="planning" className="section-container texture-overlay relative py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>PLANNING</SectionTitle>

        {/* Mobile: même taille de cartes qu'en carousel, 3 par ligne puis les 3 suivantes en dessous */}
        <div className="relative">
          <div className="md:hidden flex flex-col gap-4 overflow-x-auto overflow-y-visible px-4 pb-4 pt-24" style={{ WebkitOverflowScrolling: 'touch' }}>
            {Array.from({ length: Math.ceil(events.length / 3) }, (_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4 flex-shrink-0">
                {events.slice(rowIndex * 3, rowIndex * 3 + 3).map((event) => (
                  <div key={event.id} className="min-w-[280px] flex-shrink-0 overflow-visible">
                    <PlanningCard {...event} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id}>
                <PlanningCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanningSection;
