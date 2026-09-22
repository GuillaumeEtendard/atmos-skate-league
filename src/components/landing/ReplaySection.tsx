import SectionTitle from './SectionTitle';

const ReplaySection = () => {
  return (
    <section className="section-container texture-overlay relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionTitle>REPLAY</SectionTitle>

        {/* YouTube Embed */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm transition-all hover:border-[#ffd600]/50 hover:shadow-[0_0_40px_-10px_#ffd600]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/BbV4DZQUkuw"
            title="ATMOS SKATE LEAGUE 🛼🏁 EP1 #KOTR"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default ReplaySection;
