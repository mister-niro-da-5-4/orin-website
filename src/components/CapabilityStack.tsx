import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Network, Cpu, ShieldAlert, Activity } from 'lucide-react';

/**
 * Each glyph has its own idle animation that reflects its function:
 *  - SIGNAL:    terminal cursor blink (opacity pulse)
 *  - BLUEPRINT: network hum (subtle continuous rotation)
 *  - STUDIO:    processing spin (slow clockwise rotation)
 *  - GOVERN:    shield scan (vertical Y oscillation, like scanning)
 *  - PULSE:     heartbeat (scale pulse in a cardiac rhythm)
 */
const GLYPH_ANIMATIONS: Record<string, {
  animate: Record<string, number[]>;
  transition: Record<string, unknown>;
}> = {
  signal: {
    animate: { opacity: [1, 0.3, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'steps(2)' },
  },
  blueprint: {
    animate: { rotate: [0, 360] },
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
  studio: {
    animate: { rotate: [0, 90, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  govern: {
    animate: { y: [-1.5, 1.5, -1.5] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    // Cardiac rhythm: quick double-beat then rest
    animate: { scale: [1, 1.25, 1, 1.15, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut', times: [0, 0.15, 0.3, 0.45, 1] },
  },
};

const LAYERS = [
  { id: '01', key: 'signal', name: 'SIGNAL', icon: <Terminal size={18} />, hex: '#8B5CF6', glow: 'rgba(139,92,246,0.15)', desc: 'AI Intake Gateway. Filters waste and calculates cognitive load before a single dollar is spent.' },
  { id: '02', key: 'blueprint', name: 'BLUEPRINT', icon: <Network size={18} />, hex: '#3B82F6', glow: 'rgba(59,130,246,0.15)', desc: 'Spatial Physics Canvas. Magnetically repels bad design and enforces behavioral transfer.' },
  { id: '03', key: 'studio', name: 'STUDIO', icon: <Cpu size={18} />, hex: '#FF4F00', glow: 'rgba(255,79,0,0.25)', desc: 'WebGPU Compilation Engine. Generates AAA-quality IDE sandboxes. Zero development time.', active: true },
  { id: '04', key: 'govern', name: 'GOVERN', icon: <ShieldAlert size={18} />, hex: '#10B981', glow: 'rgba(16,185,129,0.15)', desc: 'Global Dependency Grid. Propagate policy patches across the entire enterprise ecosystem instantly.' },
  { id: '05', key: 'pulse', name: 'PULSE', icon: <Activity size={18} />, hex: '#22D3EE', glow: 'rgba(34,211,238,0.15)', desc: 'Telemetry Vault. Extract real-time xAPI data to map enterprise risk and hesitation latency.' },
];

export default function CapabilityStack() {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Filaments containerRef={gridRef} />
      <div ref={gridRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAYERS.map((layer, idx) => (
          <motion.div
            key={layer.id}
            data-stack-card
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 0 40px ${layer.glow}`,
              transition: { duration: 0.2 },
            }}
            className="relative group p-8 bg-white/[0.02] backdrop-blur-md rounded-2xl transition-colors"
            style={{
              border: `1px solid ${layer.hex}20`,
            }}
          >
            {/* Active top accent for STUDIO */}
            {layer.active && (
              <div
                className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
                style={{ background: layer.hex, boxShadow: `0 0 10px ${layer.hex}` }}
              />
            )}

            {/* Node indicator — the dot + ring, matching the logo language */}
            <div className="relative mb-5 w-10 h-10 flex items-center justify-center">
              {/* Orbital ring accent */}
              <svg width={40} height={40} viewBox="0 0 40 40" className="absolute opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <circle cx={20} cy={20} r={18} fill="none" stroke={layer.hex} strokeWidth={0.75} />
                <ellipse cx={20} cy={20} rx={16} ry={6} fill="none" stroke={layer.hex} strokeWidth={0.5} transform="rotate(-25 20 20)" />
              </svg>

              {/* Core dot */}
              <div
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-shadow duration-300"
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${layer.hex}25, transparent 70%)`,
                  border: `1px solid ${layer.hex}30`,
                  boxShadow: `0 0 12px ${layer.hex}10`,
                }}
              >
                <motion.span
                  style={{ color: layer.hex, display: 'inline-flex' }}
                  animate={GLYPH_ANIMATIONS[layer.key].animate}
                  transition={GLYPH_ANIMATIONS[layer.key].transition}
                  className="group-hover:scale-110 transition-transform duration-200"
                >
                  {layer.icon}
                </motion.span>
              </div>
            </div>

            {/* Label */}
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
              <span className="text-gray-600 text-sm mr-1.5">{layer.id}</span>
              <span style={{ color: layer.active ? layer.hex : undefined }}>
                {layer.name}
              </span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{layer.desc}</p>

            {/* Bottom scan line on hover */}
            <div
              className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-500 rounded-full"
              style={{ background: `linear-gradient(to right, ${layer.hex}, transparent)` }}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}

/** SVG filaments connecting sequential cards */
import { useEffect, useState } from 'react';

interface Line {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

function Filaments({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cards = container.querySelectorAll('[data-stack-card]');
      if (cards.length < 2) return;

      const rect = container.getBoundingClientRect();
      const centers = Array.from(cards).map((card) => {
        const r = card.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - rect.left,
          y: r.top + r.height / 2 - rect.top,
        };
      });

      const newLines: Line[] = [];
      for (let i = 0; i < centers.length - 1; i++) {
        newLines.push({
          x1: centers[i].x, y1: centers[i].y,
          x2: centers[i + 1].x, y2: centers[i + 1].y,
          color: LAYERS[i].hex,
        });
      }
      // Cross-connections for depth
      if (centers.length >= 5) {
        newLines.push({ x1: centers[0].x, y1: centers[0].y, x2: centers[4].x, y2: centers[4].y, color: 'rgba(255,255,255,0.03)' });
        newLines.push({ x1: centers[1].x, y1: centers[1].y, x2: centers[3].x, y2: centers[3].y, color: 'rgba(255,255,255,0.03)' });
      }
      setLines(newLines);
    };

    compute();
    window.addEventListener('resize', compute);
    // Recompute after scroll-triggered animations settle
    const delayed = setTimeout(compute, 1500);
    return () => { window.removeEventListener('resize', compute); clearTimeout(delayed); };
  }, [containerRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % Math.max(lines.length, 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [lines.length]);

  if (lines.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <filter id="stack-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map((line, i) => (
        <g key={i}>
          <line
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke={line.color}
            strokeWidth={0.5}
            strokeOpacity={0.15}
            strokeDasharray="4 8"
          />
          {i === pulseIdx && (
            <circle r="2.5" fill="#FF4F00" opacity={0.5} filter="url(#stack-glow)">
              <animateMotion
                dur="1.5s"
                repeatCount="1"
                path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}
