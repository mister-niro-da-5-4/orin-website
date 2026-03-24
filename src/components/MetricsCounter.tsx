import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const METRICS: Metric[] = [
  { label: 'Hours of seat-time eliminated', value: 4200, suffix: '+', prefix: '' },
  { label: 'WCAG compliance rate', value: 98.7, suffix: '%', prefix: '' },
  { label: 'Avg. compilation time', value: 0.8, suffix: 's', prefix: '' },
  { label: 'Stakeholder waste blocked', value: 2.4, suffix: 'M', prefix: '$' },
];

function AnimatedNumber({ value, suffix, prefix = '', inView }: Metric & { inView: boolean }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, value]);

  const formatted = value >= 100
    ? Math.round(display).toLocaleString()
    : display.toFixed(1);

  return (
    <span className="text-4xl md:text-5xl font-extrabold text-white tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function MetricsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <AnimatedNumber {...m} inView={inView} />
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-3">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
