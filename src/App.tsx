import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParticleField from './components/ParticleField';
import StatusTicker from './components/StatusTicker';
import MetricsCounter from './components/MetricsCounter';
import CustomCursor from './components/CustomCursor';
import EasterEgg from './components/EasterEgg';
import ColdTerminal from './components/ColdTerminal';
import RequestFlow from './components/RequestFlow';
import PhilosophyCards from './components/PhilosophyCards';
import WhatDies from './components/WhatDies';
import ComparisonMatrix from './components/ComparisonMatrix';
import OrinLogo from './components/OrinLogo';
import ClearanceModal from './components/ClearanceModal';

export default function OrinVision() {
  const [clearanceOpen, setClearanceOpen] = useState(false);

  // Scroll-driven parallax refs
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const { scrollYProgress: footerScroll } = useScroll({ target: footerRef, offset: ['start end', 'start 0.5'] });
  const footerY = useTransform(footerScroll, [0, 1], [60, 0]);


  return (
    <div className="min-h-screen bg-[#030303] text-gray-300 font-sans selection:bg-[#FF4F00] selection:text-white overflow-hidden cursor-none">

      {/* === Global Layers === */}
      <ParticleField />
      <CustomCursor />
      <EasterEgg />

      {/* === Status Ticker === */}
      <StatusTicker />

      {/* === Navigation — classification stamp === */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-10 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <OrinLogo variant="mark" size={28} animate />
          <span className="text-sm font-bold tracking-widest text-white">ORIN</span>
          <span className="text-gray-600 font-light mx-0.5">|</span>
          <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">LXDS</span>
        </div>
        <button
          type="button"
          onClick={() => setClearanceOpen(true)}
          className="px-5 py-2 text-sm uppercase tracking-wider border border-[#FF4F00]/50 text-[#FF4F00] hover:bg-[#FF4F00] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,79,0,0.2)] hover:shadow-[0_0_30px_rgba(255,79,0,0.4)]"
        >
          Request Clearance
        </button>
      </nav>

      {/* === Hero Section with Parallax === */}
      <motion.main
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center"
      >
        {/* LXDS brow — the classification */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] font-mono tracking-[0.4em] text-gray-500 uppercase mb-6"
        >
          Learning Experience Design System
        </motion.p>

        {/* ORIN — the name, massive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <OrinLogo variant="full" size={80} animate />
        </motion.div>

        {/* The provocation — hits right after the logo, no buffer */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mt-10 mb-6"
        >
          Stop building courses.<br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-100"
          >
            Start architecting performance.
          </motion.span>
        </motion.h1>

        {/* The Terminal — Cold Takeover */}
        <ColdTerminal />
      </motion.main>

      {/* === Request Flow — the story of one request through all 5 layers === */}
      <RequestFlow />

      {/* === Philosophy — the four non-negotiable principles === */}
      <PhilosophyCards />

      {/* === What Dies — the manifesto === */}
      <WhatDies />

      {/* === Comparison Matrix — the proof === */}
      <ComparisonMatrix />

      {/* === Metrics Counter === */}
      <MetricsCounter />

      {/* === Footer CTA with Slide-up === */}
      <motion.footer
        ref={footerRef}
        style={{ y: footerY }}
        className="relative z-10 py-32 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-black"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          The legacy authoring era is over.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 mb-10 text-lg"
        >
          Build what they said was impossible. Ship it before lunch.
        </motion.p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 79, 0, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setClearanceOpen(true)}
          className="px-10 py-5 bg-[#FF4F00] text-black font-bold tracking-widest uppercase hover:bg-white transition-colors text-lg"
        >
          Initiate Deployment
        </motion.button>

        <div className="mt-20 flex flex-col items-center gap-4">
          <OrinLogo variant="mark" size={24} />
          <span className="text-[10px] font-mono tracking-[0.35em] text-gray-600 uppercase">L X D S</span>
          <span className="text-xs font-mono text-gray-700 tracking-widest">
            ORIN — The first Learning Experience Design System.
          </span>
          <span className="text-[10px] text-gray-600 tracking-wide mt-2">
            An <span className="text-gray-400 font-medium">Artie Ai</span> Company
          </span>
        </div>
      </motion.footer>

      {/* === Clearance Modal === */}
      <ClearanceModal open={clearanceOpen} onClose={() => setClearanceOpen(false)} />
    </div>
  );
}
