import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import SectionTitle from './SectionTitle';

const videos = [
  { id: 1, title: 'Finals Highlights', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop' },
  { id: 2, title: 'Best Overtakes', thumbnail: 'https://images.unsplash.com/photo-1617336246116-dd9c6afeeabf?w=400&h=700&fit=crop' },
  { id: 3, title: 'Winner Interview', thumbnail: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=700&fit=crop' },
  { id: 4, title: 'Race Day Vibes', thumbnail: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=400&h=700&fit=crop' },
];

const HighlightsSection = () => {
  return (
    <section className="section-container texture-overlay relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle>HIGHLIGHTS</SectionTitle>

        {/* Video Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-border hover:border-[#ffd600] hover:shadow-[0_0_30px_-5px_#ffd600]"
              style={{ transition: 'border-color 0.3s ease, box-shadow 0.4s ease' }}
            >
              {/* Thumbnail */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
                style={{ transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />

              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80"
                style={{ transition: 'opacity 0.4s ease' }}
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd600]/90 text-primary-foreground opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_30px_-3px_#ffd600]"
                  style={{ transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease' }}
                >
                  <Play className="h-8 w-8 fill-current text-black ml-1" />
                </div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-base font-semibold text-foreground drop-shadow-lg">{video.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-10 text-center">
          <Button variant="outline" className="border-2 border-[#ffd600] text-[#ffd600] bg-transparent hover:bg-[#ffd600]/10 hover:shadow-[0_0_20px_-5px_#ffd600] transition-all px-8 py-6 text-lg uppercase font-semibold tracking-wide">
            Voir plus de vidéos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
