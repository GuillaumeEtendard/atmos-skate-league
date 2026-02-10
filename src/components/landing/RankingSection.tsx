import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PodiumCard from './PodiumCard';
import SectionTitle from './SectionTitle';

const rankings = {
  general: [
    { rank: 1, name: 'Alex Thunder', points: 2450, team: 'Speed Demons' },
    { rank: 2, name: 'Max Velocity', points: 2280, team: 'Velocity Crew' },
    { rank: 3, name: 'Sam Storm', points: 2150, team: 'Storm Riders' },
    { rank: 4, name: 'Jordan Blaze', points: 1980, team: 'Blaze Squad' },
    { rank: 5, name: 'Taylor Swift', points: 1850, team: 'Swift Force' },
    { rank: 6, name: 'Casey Flash', points: 1720, team: 'Flash Team' },
    { rank: 7, name: 'Morgan Drift', points: 1650, team: 'Drift Kings' },
    { rank: 8, name: 'Riley Rush', points: 1580, team: 'Rush Hour' },
  ],
  course: [
    { rank: 1, name: 'Max Velocity', points: 850, team: 'Velocity Crew' },
    { rank: 2, name: 'Alex Thunder', points: 780, team: 'Speed Demons' },
    { rank: 3, name: 'Jordan Blaze', points: 720, team: 'Blaze Squad' },
  ],
  team: [
    { rank: 1, name: 'Speed Demons', points: 4580, team: '' },
    { rank: 2, name: 'Velocity Crew', points: 4320, team: '' },
    { rank: 3, name: 'Storm Riders', points: 3950, team: '' },
  ],
};

const podiumData = [
  { rank: 1, name: 'Alex Thunder', points: 2450, maxSpeed: '42 km/h', chrono: '1:23.45', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { rank: 2, name: 'Max Velocity', points: 2280, maxSpeed: '41 km/h', chrono: '1:24.12', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { rank: 3, name: 'Sam Storm', points: 2150, maxSpeed: '39 km/h', chrono: '1:25.88', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' },
];

const RankingSection = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [activeCard, setActiveCard] = useState(0);

  const handlePrev = () => {
    setActiveCard((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setActiveCard((prev) => (prev === 2 ? 0 : prev + 1));
  };

  return (
    <section className="section-container texture-overlay relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>RANKING</SectionTitle>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Ranking Table */}
          <div className="relative">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm relative z-10">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-[#ffd600] data-[state=active]:text-primary-foreground uppercase text-sm font-semibold"
                >
                  Général
                </TabsTrigger>
                <TabsTrigger
                  value="course"
                  className="data-[state=active]:bg-[#ffd600] data-[state=active]:text-primary-foreground uppercase text-sm font-semibold"
                >
                  Par course
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="data-[state=active]:bg-[#ffd600] data-[state=active]:text-primary-foreground uppercase text-sm font-semibold"
                >
                  Par team
                </TabsTrigger>
              </TabsList>

              {Object.entries(rankings).map(([key, data]) => (
                <TabsContent key={key} value={key} className="mt-0 relative z-10">
                  <div className="space-y-2">
                    {data.map((player) => (
                      <div
                        key={player.rank}
                        className="flex items-center gap-4 rounded-lg bg-muted/30 backdrop-blur-sm p-3 transition-all hover:bg-muted/50 hover:shadow-[0_0_15px_-5px_#ffd600] border border-transparent hover:border-[#ffd600]/30"
                      >
                        {/* Rank */}
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            player.rank === 1
                              ? 'bg-[#ffd600] text-primary-foreground shadow-[0_0_15px_-3px_#ffd600]'
                              : player.rank === 2
                              ? 'bg-racing-silver text-primary-foreground'
                              : player.rank === 3
                              ? 'bg-racing-bronze text-foreground'
                              : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}
                        >
                          {player.rank}
                        </div>

                        {/* Name & Team */}
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{player.name}</div>
                          {player.team && (
                            <div className="text-xs text-muted-foreground">{player.team}</div>
                          )}
                        </div>

                        {/* Points */}
                        <div className="text-lg font-bold text-[#ffd600]">{player.points} pts</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right: 3D Podium Carousel */}
          <div className="flex flex-col items-center justify-center pt-8">
            <h3 className="mb-6 text-2xl font-bold uppercase text-foreground">Last Match Podium</h3>
            
            {/* Carousel Container */}
            <div className="relative w-full flex items-center justify-center overflow-x-hidden overflow-y-visible">
              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm p-2 text-foreground transition-all hover:border-[#ffd600] hover:text-[#ffd600] hover:scale-110 hover:shadow-[0_0_20px_-5px_#ffd600]"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-[#ffd600]" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-[#ffd600]/30 bg-black/50 backdrop-blur-sm p-2 text-foreground transition-all hover:border-[#ffd600] hover:text-[#ffd600] hover:scale-110 hover:shadow-[0_0_20px_-5px_#ffd600]"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-[#ffd600]" />
              </button>

              {/* Cards Display */}
              <div className="relative w-full flex items-center justify-center pt-20 pb-4 min-h-[380px]">
                {podiumData.map((player, index) => {
                  const offset = index - activeCard;
                  const isActive = activeCard === index;
                  return (
                    <div 
                      key={player.rank} 
                      className="absolute"
                      style={{
                        opacity: isActive ? 1 : 0.2,
                        transform: `translateX(${offset * 180}px) scale(${isActive ? 1 : 0.75})`,
                        zIndex: isActive ? 20 : 10,
                        filter: isActive ? 'none' : 'grayscale(40%) blur(1.5px)',
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                    >
                      <PodiumCard {...player} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="mt-4 flex justify-center gap-3">
              {podiumData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCard(index)}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    activeCard === index 
                      ? 'bg-gradient-to-r from-[#ffd600] to-[#ffaa00] shadow-[0_0_10px_#ffd600]' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankingSection;
