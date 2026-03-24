import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Network, Cpu, ShieldAlert, Activity } from 'lucide-react';

const STEPS = [
  {
    layer: 'SIGNAL',
    color: '#8b5cf6',
    icon: <Terminal size={18} />,
    trigger: 'A director requests a 30-minute compliance module.',
    action: 'Signal rejects the format. Calculates cognitive load at 14.2 elements — triple the safe threshold. Returns a counter-proposal: 4 micro-experiences, spaced over 2 weeks.',
    visual: 'intake',
  },
  {
    layer: 'BLUEPRINT',
    color: '#3b82f6',
    icon: <Network size={18} />,
    trigger: 'Counter-proposal accepted. Blueprint receives the intent.',
    action: 'Generates an objective topology with 6 behavioral outcomes mapped to Bloom\'s L3–L5. Calculates spaced repetition intervals from Cepeda et al. decay curves. Enforces transfer: every node must connect to a real-world task.',
    visual: 'topology',
  },
  {
    layer: 'STUDIO',
    color: '#FF4F00',
    icon: <Cpu size={18} />,
    trigger: 'Topology locked. Studio begins compilation.',
    action: '12 interactive nodes compiled in 0.8 seconds. Branching scenario with 3 decision points. Simulation sandbox generated. Zero development time — the designer edits, never builds.',
    visual: 'compile',
  },
  {
    layer: 'GOVERN',
    color: '#10b981',
    icon: <ShieldAlert size={18} />,
    trigger: 'Compilation complete. Govern sweeps the package.',
    action: 'WCAG 2.2 AA audit: 0 violations. Color contrast ratios verified. Focus order validated. Alt text coverage: 100%. Policy patch GV-2026-041 applied automatically.',
    visual: 'sweep',
  },
  {
    layer: 'PULSE',
    color: '#22d3ee',
    icon: <Activity size={18} />,
    trigger: 'Package cleared. Pulse initializes telemetry.',
    action: 'xAPI statement templates bound to every state transition. Hesitation latency tracking enabled. Behavioral risk mapping active. The course is measuring before a single learner touches it.',
    visual: 'telemetry',
  },
];

function FlowVisual({ type, color }: { type: string; color: string }) {
  // Abstract animated visuals for each layer
  const variants = {
    intake: (
      // Filtering animation — lines getting rejected
      <div className="relative w-full h-24 flex items-center justify-center gap-3 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: i < 3 ? 0.15 : 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="h-[2px] rounded-full"
            style={{
              width: i < 3 ? '40px' : '60px',
              backgroundColor: i < 3 ? '#ef4444' : color,
              textDecoration: i < 3 ? 'line-through' : 'none',
            }}
          />
        ))}
      </div>
    ),
    topology: (
      // Nodes forming connections
      <div className="relative w-full h-24 flex items-center justify-center">
        <svg width="200" height="80" viewBox="0 0 200 80">
          {/* Nodes */}
          {[[40, 20], [100, 15], [160, 25], [60, 60], [130, 55]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r="4"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            />
          ))}
          {/* Edges */}
          {[[40, 20, 100, 15], [100, 15, 160, 25], [40, 20, 60, 60], [100, 15, 130, 55], [160, 25, 130, 55]].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={`e${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            />
          ))}
        </svg>
      </div>
    ),
    compile: (
      // Progress blocks filling
      <div className="relative w-full h-24 flex items-end justify-center gap-1.5 pb-4">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: 16 + Math.random() * 40, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="w-2.5 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    ),
    sweep: (
      // Checkmarks appearing
      <div className="relative w-full h-24 flex items-center justify-center gap-6">
        {['WCAG', 'Focus', 'Contrast', 'Alt text'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.1, type: 'spring', stiffness: 300 }}
              className="w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1"
              style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
            >
              <span style={{ color }} className="text-xs">✓</span>
            </motion.div>
            <span className="text-[9px] uppercase tracking-wider text-gray-600">{label}</span>
          </motion.div>
        ))}
      </div>
    ),
    telemetry: (
      // Pulsing signal waves
      <div className="relative w-full h-24 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute w-12 h-12 rounded-full border"
            style={{ borderColor: `${color}30` }}
            initial={{ scale: 0.5, opacity: 0.8 }}
            whileInView={{ scale: 1.5 + ring * 0.5, opacity: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ring * 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        ))}
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    ),
  };

  return variants[type as keyof typeof variants] || null;
}

export default function RequestFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Follow the signal.</h2>
        <p className="text-gray-500 max-w-xl">One request. Five layers. Watch a vague stakeholder ask become a measurable behavioral experience.</p>
      </motion.div>

      {/* The vertical flow line */}
      <div ref={containerRef} className="relative">
        <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-violet-500/20 via-[#FF4F00]/20 to-cyan-400/20" />

        {STEPS.map((step) => (
          <motion.div
            key={step.layer}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative pl-14 md:pl-16 pb-20 last:pb-0"
          >
            {/* Layer dot on the line */}
            <div
              className="absolute left-2.5 md:left-3.5 top-1 w-3 h-3 rounded-full border-2"
              style={{
                borderColor: step.color,
                backgroundColor: '#030303',
                boxShadow: `0 0 8px ${step.color}40`,
              }}
            />

            {/* Layer label */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: step.color }}>{step.icon}</span>
              <span
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: step.color }}
              >
                {step.layer}
              </span>
            </div>

            {/* Trigger — what happened */}
            <p className="text-white/60 text-sm italic mb-2">{step.trigger}</p>

            {/* Action — what the layer does */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.action}</p>

            {/* Abstract visual */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden">
              <FlowVisual type={step.visual} color={step.color} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
