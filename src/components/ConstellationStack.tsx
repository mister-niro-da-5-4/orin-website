import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Network, Cpu, ShieldAlert, Activity, X } from 'lucide-react';

/**
 * Orbital Stack — Solar System Model
 *
 * STUDIO // ORIN is the sun: locked center, massive, pulsing.
 * The 4 other layers orbit at fixed angles around it.
 * Spring physics on all interactions. SVG filaments connect each satellite to the core.
 *
 * States:
 *  - Idle: satellites at orbital positions, gentle glow, filaments dim
 *  - Hover: node scales 10%, its filament flares, label brightens
 *  - Focus: clicked node locks, others fade to 20%, info panel slides in
 */

const SATELLITES = [
  {
    id: 'signal', name: 'SIGNAL', icon: <Terminal size={22} />,
    hex: '#8B5CF6', glow: 'rgba(139,92,246,0.3)', angle: 315,
    desc: 'AI Intake Gateway. Filters waste and calculates cognitive load before a single dollar is spent.',
  },
  {
    id: 'blueprint', name: 'BLUEPRINT', icon: <Network size={22} />,
    hex: '#3B82F6', glow: 'rgba(59,130,246,0.3)', angle: 45,
    desc: 'Spatial Physics Canvas. Magnetically repels bad design and enforces behavioral transfer.',
  },
  {
    id: 'govern', name: 'GOVERN', icon: <ShieldAlert size={22} />,
    hex: '#10B981', glow: 'rgba(16,185,129,0.3)', angle: 225,
    desc: 'Global Dependency Grid. Propagate policy patches across the entire enterprise ecosystem instantly.',
  },
  {
    id: 'pulse', name: 'PULSE', icon: <Activity size={22} />,
    hex: '#22D3EE', glow: 'rgba(34,211,238,0.3)', angle: 135,
    desc: 'Telemetry Vault. Extract real-time xAPI data to map enterprise risk and hesitation latency.',
  },
];

const ORBIT_RADIUS = 200;
const CONTAINER_SIZE = 560;
const CENTER = CONTAINER_SIZE / 2;

function satPosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ORBIT_RADIUS * Math.cos(rad),
    y: ORBIT_RADIUS * Math.sin(rad),
  };
}

export default function ConstellationStack() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeSat = SATELLITES.find((s) => s.id === activeId);

  return (
    <div
      className="relative mx-auto"
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
    >
      {/* === SVG Filaments — connecting each satellite to the core === */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox={`0 0 ${CONTAINER_SIZE} ${CONTAINER_SIZE}`}
      >
        <defs>
          <filter id="filament-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Orbital track ring */}
          <circle
            id="orbit-track"
            cx={CENTER} cy={CENTER} r={ORBIT_RADIUS}
            fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1}
            strokeDasharray="4 8"
          />
        </defs>

        {/* Orbit track */}
        <use href="#orbit-track" />

        {/* Filament lines */}
        {SATELLITES.map((sat) => {
          const pos = satPosition(sat.angle);
          const isActive = activeId === sat.id;
          const isHovered = hoveredId === sat.id;
          const isFaded = activeId !== null && !isActive;
          const lit = isActive || isHovered;

          return (
            <motion.line
              key={`line-${sat.id}`}
              x1={CENTER} y1={CENTER}
              x2={CENTER + pos.x} y2={CENTER + pos.y}
              stroke={lit ? sat.hex : '#222'}
              strokeWidth={lit ? 2 : 0.5}
              filter={lit ? 'url(#filament-glow)' : undefined}
              animate={{ opacity: isFaded ? 0.05 : lit ? 0.8 : 0.2 }}
              transition={{ duration: 0.4 }}
            />
          );
        })}

        {/* Data pulse dots traveling along filaments */}
        {SATELLITES.map((sat, i) => {
          const pos = satPosition(sat.angle);
          const isFaded = activeId !== null && activeId !== sat.id;
          if (isFaded) return null;

          return (
            <circle key={`dot-${sat.id}`} r="2.5" fill={sat.hex} opacity={0.5}>
              <animateMotion
                dur={`${2.5 + i * 0.4}s`}
                repeatCount="indefinite"
                path={`M${CENTER},${CENTER} L${CENTER + pos.x},${CENTER + pos.y}`}
              />
            </circle>
          );
        })}
      </svg>

      {/* === The Core — STUDIO // ORIN (the sun) === */}
      <motion.div
        className="absolute z-20 flex flex-col items-center"
        style={{ left: CENTER, top: CENTER, x: '-50%', y: '-50%' }}
        animate={{
          scale: activeId ? 0.85 : 1,
          opacity: activeId ? 0.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <button
          type="button"
          onClick={() => setActiveId(null)}
          className="relative flex items-center justify-center"
        >
          {/* Pulsing aura */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: 120, height: 120, background: 'rgba(255,79,0,0.08)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Ambient glow */}
          <div
            className="absolute rounded-full blur-2xl"
            style={{ width: 100, height: 100, background: 'rgba(255,79,0,0.15)' }}
          />

          {/* Core sphere */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#FF4F00]"
            style={{
              background: 'radial-gradient(circle at 40% 35%, rgba(255,79,0,0.15), rgba(0,0,0,0.9) 70%)',
              boxShadow: '0 0 40px rgba(255,79,0,0.3), inset 0 0 20px rgba(255,79,0,0.1)',
            }}
          >
            <Cpu size={28} color="#FF4F00" />
          </div>
        </button>

        <span className="mt-4 text-sm font-bold tracking-[0.2em] text-[#FF4F00]">
          STUDIO
        </span>
        <span className="text-[10px] font-mono tracking-wider text-gray-600">
          compilation engine
        </span>
      </motion.div>

      {/* === Satellites (the 4 orbiting layers) === */}
      {SATELLITES.map((sat) => {
        const pos = satPosition(sat.angle);
        const isActive = activeId === sat.id;
        const isHovered = hoveredId === sat.id;
        const isFaded = activeId !== null && !isActive;
        const lit = isActive || isHovered;

        return (
          <motion.div
            key={sat.id}
            className="absolute z-10 flex flex-col items-center"
            style={{ left: CENTER, top: CENTER }}
            animate={{
              x: `calc(-50% + ${pos.x}px)`,
              y: `calc(-50% + ${pos.y}px)`,
              scale: isActive ? 1.15 : isHovered ? 1.08 : 1,
              opacity: isFaded ? 0.15 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <button
              type="button"
              onMouseEnter={() => setHoveredId(sat.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveId(isActive ? null : sat.id)}
              title={sat.name}
              className="relative flex items-center justify-center"
            >
              {/* Glow */}
              <div
                className="absolute rounded-full blur-xl transition-opacity duration-300"
                style={{
                  width: 70,
                  height: 70,
                  background: sat.glow,
                  opacity: lit ? 0.7 : 0.15,
                }}
              />

              {/* Orbital ring accent */}
              <svg
                width={64} height={64}
                viewBox="0 0 64 64"
                className="absolute transition-opacity duration-300"
                style={{ opacity: lit ? 0.5 : 0.1 }}
              >
                <ellipse
                  cx={32} cy={32} rx={30} ry={10}
                  fill="none" stroke={sat.hex} strokeWidth={0.6}
                  transform="rotate(-25 32 32)"
                />
              </svg>

              {/* Node sphere */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center border transition-colors duration-300"
                style={{
                  borderColor: lit ? sat.hex : `${sat.hex}30`,
                  background: `radial-gradient(circle at 40% 35%, ${sat.hex}18, rgba(0,0,0,0.9) 70%)`,
                  boxShadow: lit
                    ? `0 0 25px ${sat.glow}, inset 0 0 12px ${sat.hex}10`
                    : `0 0 8px ${sat.hex}08`,
                }}
              >
                <span style={{ color: sat.hex }}>{sat.icon}</span>
              </div>
            </button>

            {/* Label */}
            <span
              className="mt-3 text-xs font-bold tracking-[0.15em] transition-colors duration-300"
              style={{ color: lit ? sat.hex : 'rgba(255,255,255,0.5)' }}
            >
              {sat.name}
            </span>
          </motion.div>
        );
      })}

      {/* === Focus Mode Info Panel === */}
      <AnimatePresence>
        {activeSat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-6 py-5 bg-black/90 border border-white/10 rounded-lg backdrop-blur-sm text-center"
            style={{ bottom: -80 }}
          >
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>

            <p
              className="text-xs font-bold tracking-[0.2em] mb-2"
              style={{ color: activeSat.hex }}
            >
              {activeSat.name}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {activeSat.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
