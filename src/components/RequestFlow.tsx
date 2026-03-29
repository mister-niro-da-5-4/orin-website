import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Terminal, Network, Cpu, ShieldAlert, Activity } from 'lucide-react';

const STEPS = [
  {
    layer: 'SIGNAL',
    prefix: '> ',
    color: '#8b5cf6',
    Icon: Terminal,
    trigger: 'A director requests a 30-minute compliance module.',
    action:
      'Signal rejects the format. Calculates cognitive load at 14.2 elements — triple the safe threshold. Returns a counter-proposal: 4 micro-experiences, spaced over 2 weeks.',
    visual: 'intake',
  },
  {
    layer: 'BLUEPRINT',
    prefix: ':: ',
    color: '#3b82f6',
    Icon: Network,
    trigger: 'Counter-proposal accepted. Blueprint receives the intent.',
    action:
      "Generates an objective topology with 6 behavioral outcomes mapped to Bloom's L3–L5. Calculates spaced repetition intervals from Cepeda et al. decay curves. Enforces transfer: every node must connect to a real-world task.",
    visual: 'topology',
  },
  {
    layer: 'STUDIO',
    prefix: '/// ',
    color: '#FF4F00',
    Icon: Cpu,
    trigger: 'Topology locked. Studio begins compilation.',
    action:
      '12 interactive nodes compiled in 0.8 seconds. Branching scenario with 3 decision points. Simulation sandbox generated. Zero development time — the designer edits, never builds.',
    visual: 'compile',
  },
  {
    layer: 'GOVERN',
    prefix: '✓ ',
    color: '#10b981',
    Icon: ShieldAlert,
    trigger: 'Compilation complete. Govern sweeps the package.',
    action:
      'WCAG 2.2 AA audit: 0 violations. Color contrast ratios verified. Focus order validated. Alt text coverage: 100%. Policy patch GV-2026-041 applied automatically.',
    visual: 'sweep',
  },
  {
    layer: 'PULSE',
    prefix: '~ ',
    color: '#22d3ee',
    Icon: Activity,
    trigger: 'Package cleared. Pulse initializes telemetry.',
    action:
      'xAPI statement templates bound to every state transition. Hesitation latency tracking enabled. Behavioral risk mapping active. The course is measuring before a single learner touches it.',
    visual: 'telemetry',
  },
];

// ── Typewriter ──────────────────────────────────────────────────────────────

function TypewriterText({
  text,
  inView,
  speed = 45,
  className = '',
}: {
  text: string;
  inView: boolean;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && inView && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="inline-block align-middle ml-[1px]"
          style={{ width: 2, height: '0.85em', backgroundColor: 'currentColor' }}
        />
      )}
    </span>
  );
}

// ── Node ────────────────────────────────────────────────────────────────────

function StepNode({ color, inView }: { color: string; inView: boolean }) {
  return (
    // Centered on line: node left-[10px] + w-3(12px)/2 = 16px = left-4 on line
    <div
      className="absolute left-[10px] md:left-[14px] top-0.5"
      style={{ width: 12, height: 12 }}
    >
      {/* Expanding pulse rings on enter */}
      {inView &&
        [0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ inset: -3, border: `1px solid ${color}` }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3 + i * 1.5, opacity: 0 }}
            transition={{ delay: i * 0.3, duration: 0.9 + i * 0.2, ease: 'easeOut' }}
          />
        ))}

      {/* Core dot — spring pop */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: color,
          backgroundColor: '#030303',
          boxShadow: `0 0 10px ${color}50`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.08 }}
      />

      {/* Breathing inner glow */}
      {inView && (
        <motion.div
          className="absolute rounded-full"
          style={{ inset: 3, backgroundColor: color }}
          animate={{ opacity: [0.9, 0.3, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ── Per-layer visuals ────────────────────────────────────────────────────────

function FlowVisual({
  type,
  color,
  inView,
}: {
  type: string;
  color: string;
  inView: boolean;
}) {
  const variants: Record<string, React.ReactNode> = {
    // Signal → terminal output lines
    intake: (
      <div className="w-full px-4 py-4 font-mono text-[11px] leading-5 space-y-0.5 min-h-[88px]">
        {[
          { text: '> analyzing request...', color: '#6b7280', delay: 0.2 },
          { text: '> format: 30-min module   ✗  REJECTED', color: '#ef4444', delay: 0.6 },
          { text: '> cognitive_load: 14.2 elements', color: '#6b7280', delay: 1.0 },
          { text: '> safe_threshold: 4.7   ← exceeded 3×', color: '#f59e0b', delay: 1.4 },
          { text: '> counter_proposal: ready  ✓', color, delay: 1.8 },
        ].map(({ text, color: c, delay }, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay, duration: 0.3 }}
            style={{ color: c }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    ),

    // Blueprint → node graph drawing in
    topology: (
      <div className="relative w-full flex items-center justify-center min-h-[88px]">
        <svg width="220" height="80" viewBox="0 0 220 80">
          {/* Edges first */}
          {[
            [40, 18, 110, 14],
            [110, 14, 178, 22],
            [40, 18, 65, 60],
            [110, 14, 140, 56],
            [178, 22, 140, 56],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={`e${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.35"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
            />
          ))}
          {/* Nodes */}
          {[[40, 18], [110, 14], [178, 22], [65, 60], [140, 56]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={i === 1 ? 5 : 3.5}
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 0.85 } : {}}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 350 }}
            />
          ))}
          {/* Labels */}
          {[
            [40, 10, 'Intent'],
            [110, 6, 'Objectives'],
            [178, 14, 'Transfer'],
          ].map(([x, y, label], i) => (
            <motion.text
              key={`l${i}`}
              x={x} y={y}
              fontSize="7"
              fill={color}
              fillOpacity="0.5"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              {label as string}
            </motion.text>
          ))}
        </svg>
      </div>
    ),

    // Studio → bar chart compiling
    compile: (
      <div className="relative w-full flex items-end justify-center gap-1.5 pb-4 pt-6 min-h-[88px]">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="w-2.5 rounded-sm"
            style={{ backgroundColor: color }}
            initial={{ height: 0, opacity: 0 }}
            animate={inView ? { height: 14 + ((i * 9 + 11) % 38), opacity: 0.75 } : {}}
            transition={{ delay: 0.2 + i * 0.055, duration: 0.35, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="absolute bottom-2 right-4 font-mono text-[9px]"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.2 }}
        >
          12 nodes / 0.8s
        </motion.div>
      </div>
    ),

    // Govern → validation checks
    sweep: (
      <div className="relative w-full flex items-center justify-center gap-5 min-h-[88px] py-4">
        {['WCAG', 'Focus', 'Contrast', 'Alt'].map((label, i) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.18 }}
          >
            <motion.div
              className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1.5"
              style={{
                backgroundColor: `${color}18`,
                border: `1px solid ${color}40`,
              }}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{
                delay: 0.3 + i * 0.18,
                type: 'spring',
                stiffness: 320,
              }}
            >
              <span style={{ color }} className="text-sm leading-none">✓</span>
            </motion.div>
            <span className="text-[9px] uppercase tracking-wider text-gray-600 font-mono">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    ),

    // Pulse → expanding signal rings
    telemetry: (
      <div className="relative w-full flex items-center justify-center min-h-[88px]">
        {inView &&
          [0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border"
              style={{ borderColor: `${color}40`, width: 44, height: 44 }}
              animate={{ scale: [1, 2.5 + ring * 0.8], opacity: [0.7, 0] }}
              transition={{
                delay: ring * 0.35,
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 1.8,
                ease: 'easeOut',
              }}
            />
          ))}
        <motion.div
          className="w-3 h-3 rounded-full relative z-10"
          style={{ backgroundColor: color, boxShadow: `0 0 14px ${color}` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 350 }}
        />
      </div>
    ),
  };

  return (variants[type] ?? null) as React.ReactElement | null;
}

// ── Step item ────────────────────────────────────────────────────────────────

function StepItem({
  step,
}: {
  step: (typeof STEPS)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div ref={ref} className="relative pl-14 md:pl-16 pb-24 last:pb-0">
      <StepNode color={step.color} inView={inView} />

      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Layer label + typewriter */}
        <motion.div variants={item} className="flex items-center gap-2 mb-3">
          <step.Icon size={14} style={{ color: step.color }} />
          <span
            className="text-xs font-bold tracking-[0.22em] uppercase font-mono"
            style={{ color: step.color }}
          >
            <span style={{ opacity: 0.45 }}>{step.prefix}</span>
            <TypewriterText text={step.layer} inView={inView} speed={60} />
          </span>
        </motion.div>

        {/* Trigger */}
        <motion.p variants={item} className="text-white/45 text-sm italic mb-2 leading-relaxed">
          {step.trigger}
        </motion.p>

        {/* Action */}
        <motion.p variants={item} className="text-gray-400 text-sm leading-relaxed mb-4">
          {step.action}
        </motion.p>

        {/* Visual card */}
        <motion.div
          variants={item}
          className="rounded-lg overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <FlowVisual type={step.visual} color={step.color} inView={inView} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function RequestFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.35'],
  });

  // Line draws top → bottom as you scroll through the section
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Follow the signal.</h2>
        <p className="text-gray-500 max-w-xl">
          One request. Five layers. Watch a vague stakeholder ask become a measurable behavioral
          experience.
        </p>
      </motion.div>

      <div ref={containerRef} className="relative">
        {/* Dim static track */}
        <div
          className="absolute top-1.5 bottom-0 w-px left-4 md:left-5"
          style={{
            background:
              'linear-gradient(to bottom, #8b5cf620, #3b82f620, #FF4F0020, #10b98120, #22d3ee20)',
          }}
        />

        {/* Scroll-driven colored fill — grows as you scroll */}
        <motion.div
          className="absolute top-1.5 bottom-0 w-px left-4 md:left-5"
          style={{
            background:
              'linear-gradient(to bottom, #8b5cf6, #3b82f6, #FF4F00, #10b981, #22d3ee)',
            scaleY: lineScaleY,
            originY: 0,
          }}
        />

        {STEPS.map((step) => (
          <StepItem key={step.layer} step={step} />
        ))}
      </div>
    </section>
  );
}
