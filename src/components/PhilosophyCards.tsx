import { motion } from 'framer-motion';

const PRINCIPLES = [
  {
    title: 'One Studio, Not Eight',
    line: 'Tools come to you. You never navigate to a tool.',
    detail: 'Click text — typography controls appear. Select an animation — timing surfaces. Deselect — everything disappears. The workspace reshapes itself around your intent.',
    accent: '#8b5cf6',
    visual: 'converge',
  },
  {
    title: 'What You See Is What You Edit',
    line: 'The preview IS the editor.',
    detail: 'No separate preview mode. No code view as the default surface. Every piece of content is clickable and editable on the live canvas. What the learner sees is what you shape.',
    accent: '#3b82f6',
    visual: 'mirror',
  },
  {
    title: 'Ambient Intelligence',
    line: "Orin doesn't wait to be asked.",
    detail: 'Mirror: always show what the learner sees. Validate: continuously check against learning science. Inspire: when stuck, bring domain-aware ideas grounded in your actual content.',
    accent: '#FF4F00',
    visual: 'pulse',
  },
  {
    title: 'Two Modes, One Soul',
    line: 'Chaos for creation. Zen for refinement.',
    detail: 'Chaos mode: the workshop. Everything visible, validation silent, creative flow uninterrupted. Zen mode: one slide, clean, quiet, validation active. Toggle is a filter, not a transformation.',
    accent: '#22d3ee',
    visual: 'duality',
  },
];

function PrincipleVisual({ type, color }: { type: string; color: string }) {
  if (type === 'converge') {
    // 8 dots converging to 1
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 40;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
              initial={{
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                opacity: 0.3,
              }}
              whileInView={{
                x: 0,
                y: 0,
                opacity: 0.8,
              }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }}
        />
      </div>
    );
  }

  if (type === 'mirror') {
    // Two rectangles mirroring each other
    return (
      <div className="relative w-full h-32 flex items-center justify-center gap-4">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            className="w-20 h-16 rounded border flex flex-col gap-1.5 p-2"
            style={{ borderColor: `${color}30` }}
          >
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="h-1.5 rounded-full"
                style={{
                  backgroundColor: `${color}${j === 0 ? '60' : '20'}`,
                  width: `${70 + j * 10}%`,
                }}
              />
            ))}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute text-xs font-mono"
          style={{ color }}
        >
          ≡
        </motion.div>
      </div>
    );
  }

  if (type === 'pulse') {
    // Three concentric rings pulsing
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        {['Mirror', 'Validate', 'Inspire'].map((label, i) => (
          <motion.div
            key={label}
            className="absolute rounded-full border flex items-center justify-center"
            style={{
              width: 40 + i * 32,
              height: 40 + i * 32,
              borderColor: `${color}${30 - i * 8}`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            {i === 0 && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
          </motion.div>
        ))}
        {['Mirror', 'Validate', 'Inspire'].map((label, i) => (
          <motion.span
            key={label}
            className="absolute text-[8px] uppercase tracking-widest"
            style={{
              color: `${color}80`,
              top: `${50 + (i - 1) * 28}%`,
              left: i === 1 ? '72%' : i === 0 ? '64%' : '78%',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            {label}
          </motion.span>
        ))}
      </div>
    );
  }

  // duality — split panel
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <div className="flex w-48 h-20 rounded overflow-hidden border" style={{ borderColor: `${color}20` }}>
        {/* Chaos side */}
        <motion.div
          className="w-1/2 p-2 flex flex-wrap gap-1 items-start content-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ backgroundColor: `${color}08` }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 6 + Math.random() * 10,
                height: 4 + Math.random() * 6,
                backgroundColor: `${color}${20 + Math.floor(Math.random() * 30)}`,
              }}
            />
          ))}
        </motion.div>
        {/* Divider */}
        <div className="w-[1px]" style={{ backgroundColor: `${color}30` }} />
        {/* Zen side */}
        <motion.div
          className="w-1/2 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="w-8 h-5 rounded-sm"
            style={{ backgroundColor: `${color}25`, border: `1px solid ${color}30` }}
          />
        </motion.div>
      </div>
      <div className="absolute bottom-0 flex justify-center w-full gap-16 text-[8px] uppercase tracking-widest" style={{ color: `${color}50` }}>
        <span>Chaos</span>
        <span>Zen</span>
      </div>
    </div>
  );
}

export default function PhilosophyCards() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-4">The philosophy.</h2>
        <p className="text-gray-500 max-w-xl">Four principles. Non-negotiable. Every pixel, every interaction, every line of code answers to these.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRINCIPLES.map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="bg-white/[0.02] border border-white/5 rounded-lg p-8 relative overflow-hidden group"
          >
            {/* Accent top line */}
            <div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{ background: `linear-gradient(to right, ${p.accent}40, transparent)` }}
            />

            {/* Visual */}
            <PrincipleVisual type={p.visual} color={p.accent} />

            {/* Title */}
            <h3 className="text-xl font-bold text-white mt-4 mb-2">{p.title}</h3>

            {/* Core line — the one-liner */}
            <p className="text-sm font-medium mb-3" style={{ color: `${p.accent}cc` }}>
              {p.line}
            </p>

            {/* Detail */}
            <p className="text-xs text-gray-500 leading-relaxed">{p.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
