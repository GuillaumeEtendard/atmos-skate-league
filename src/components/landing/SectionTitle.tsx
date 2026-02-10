import { motion } from 'framer-motion';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle = ({ children, className = '' }: SectionTitleProps) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`mb-12 md:mb-16 text-center text-4xl md:text-5xl font-bold uppercase tracking-wide text-foreground relative ${className}`}
    >
      <span className="text-gradient-yellow drop-shadow-[0_0_25px_rgba(255,214,0,0.25)]">
        {children}
      </span>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#ffd600] to-transparent rounded-full" />
    </motion.h2>
  );
};

export default SectionTitle;
