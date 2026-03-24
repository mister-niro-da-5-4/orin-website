import { motion } from 'framer-motion';

const KILLS = [
  {
    dead: '"Preview" as a separate mode',
    alive: "You're always looking at the real thing.",
  },
  {
    dead: 'Tab navigation to switch contexts',
    alive: 'Tools come to you.',
  },
  {
    dead: '"Save" as a manual action',
    alive: 'Everything auto-saves. Versions are automatic.',
  },
  {
    dead: '"Generate" as a button that replaces everything',
    alive: 'AI suggests and refines. Never overwrites.',
  },
  {
    dead: 'Loading spinners longer than 500ms',
    alive: 'The tool is instant. Background work stays in the background.',
  },
  {
    dead: 'Modal dialogs for simple choices',
    alive: 'Inline. Contextual. Dismissible.',
  },
  {
    dead: 'Empty states with no guidance',
    alive: 'Every blank canvas has an invitation, not a void.',
  },
];

export default function WhatDies() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-32 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-4">What Orin kills.</h2>
        <p className="text-gray-500 max-w-xl">
          Every convention the industry accepted as normal. Eliminated.
        </p>
      </motion.div>

      <div className="space-y-0">
        {KILLS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="group border-b border-white/5 py-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center"
          >
            {/* The dead convention */}
            <motion.div
              initial={{ x: 0 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.p
                initial={{ opacity: 0.9, textDecorationColor: 'transparent' }}
                whileInView={{ opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-red-400 line-through decoration-2 decoration-red-500/60 text-sm md:text-base md:text-right"
              >
                {item.dead}
              </motion.p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              className="hidden md:flex items-center justify-center"
            >
              <span className="text-[#FF4F00]/40 text-lg">→</span>
            </motion.div>

            {/* The replacement */}
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-white/80 text-sm md:text-base font-medium"
            >
              {item.alive}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
