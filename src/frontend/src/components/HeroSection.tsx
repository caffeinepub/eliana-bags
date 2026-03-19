import { motion } from "motion/react";

interface HeroSectionProps {
  onShopClick: () => void;
}

export default function HeroSection({ onShopClick }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "520px" }}
      aria-label="Hero banner"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-banner.dim_1400x700.jpg')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-lg"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4">
            New Collection 2026
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white hero-text-shadow leading-tight mb-4">
            Crafted for the
            <br />
            Modern Woman
          </h1>
          <p className="text-base text-white/80 mb-8 max-w-sm leading-relaxed">
            Timeless elegance meets contemporary design. Each piece is
            handcrafted with the finest Italian leather.
          </p>
          <button
            type="button"
            onClick={onShopClick}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-accent/90 transition-colors rounded-sm"
            data-ocid="hero.primary_button"
          >
            Shop the Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
