import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE = ['o', 'r', 'i', 'n'];

export default function EasterEgg() {
  const [, setBuffer] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      setBuffer((prev) => {
        const next = [...prev, e.key.toLowerCase()].slice(-4);
        if (next.join('') === SEQUENCE.join('')) {
          setTriggered(true);
          setTimeout(() => setTriggered(false), 4000);
          return [];
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 pointer-events-none"
        >
          {/* Scan lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,79,0,0.1) 2px, rgba(255,79,0,0.1) 4px)',
            }}
          />

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FF4F00] to-[#FF4F00]/20 leading-none"
            >
              ORIN
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 font-mono text-sm text-[#FF4F00]/70 tracking-[0.3em] uppercase"
            >
              Learning Experience Design System
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 font-mono text-xs text-gray-600"
            >
              ORIN // COGNITIVE OPERATING SYSTEM INITIALIZED
            </motion.div>

            {/* Radiating rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ delay: 0.3 * ring, duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#FF4F00]/30"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
