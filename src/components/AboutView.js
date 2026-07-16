import { motion } from 'framer-motion';

export default function AboutView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-16 pb-20">
      
      {/* --- 1. Bio Section --- */}
      <header>
        <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
          About Me
        </h2>
        <div className="h-1 w-12 bg-kinpaku mt-2 rounded-full mb-10"></div>
        <section className="leading-loose text-lg text-text-muted space-y-6">
          <p>
            Hi, I'm <span className="text-ink-accent font-bold">Chien Huang (黃芊)</span> — from Taiwan, based at National Cheng Kung University.
          </p>
          <p>
            I'm currently pursuing my Master's degree at the Digital IC Design Lab. This is where I share my life and some of the things I learn along the way.
          </p>
          <p className="font-bold text-champagne">
            Enjoy.
          </p>
        </section>
      </header>

    </motion.div>
  );
}