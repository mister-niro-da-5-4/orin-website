import { motion } from 'framer-motion';

/**
 * ORIN Logo System
 *
 * The "O" is the logomark — a graph node with an orbital ring.
 * The inner core is a coin-spinning disc with a specular highlight
 * that sweeps across as it rotates on its vertical axis.
 * It breathes. It's alive.
 *
 * Variants:
 *  - "full"    → Logomark + ORIN wordmark
 *  - "mark"    → Just the O logomark
 *  - "lockup"  → LXDS // ORIN with logomark replacing the O
 */
const ORANGE = '#FF4F00';

function Mark({ s = 1, uid = 'logo', animate = false }: { s?: number; uid?: string; animate?: boolean }) {
  const r = 14 * s;
  const cx = 16 * s;
  const cy = 16 * s;
  const svgSize = 32 * s;
  const coreR = 3.2 * s;

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`${uid}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={4 * s} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id={`${uid}-sphere`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffad73" />
          <stop offset="40%" stopColor={ORANGE} />
          <stop offset="100%" stopColor="#7a2500" />
        </radialGradient>

        <linearGradient id={`${uid}-spec`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.7" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r={coreR} />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        stroke={ORANGE}
        strokeWidth={1.5 * s}
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={animate ? { duration: 1, ease: [0.22, 1, 0.36, 1] } : undefined}
      />

      {/* Orbital ring */}
      <motion.ellipse
        cx={cx} cy={cy}
        rx={r * 0.85}
        ry={r * 0.35}
        stroke={ORANGE}
        strokeWidth={0.75 * s}
        strokeOpacity={0.35}
        fill="none"
        transform={`rotate(-30 ${cx} ${cy})`}
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={animate ? { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] } : undefined}
      />

      {/* === THE LIVING CORE === */}

      {/* Ambient glow — breathes */}
      <motion.circle
        cx={cx} cy={cy}
        r={coreR * 1.8}
        fill={ORANGE}
        opacity={0.12}
        filter={`url(#${uid}-glow)`}
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3D sphere base */}
      <motion.circle
        cx={cx} cy={cy}
        r={coreR}
        fill={`url(#${uid}-sphere)`}
        initial={animate ? { scale: 0, opacity: 0 } : undefined}
        animate={animate ? { scale: 1, opacity: 1 } : undefined}
        transition={animate ? { delay: 0.8, type: 'spring', stiffness: 300 } : undefined}
      />

      {/* Coin-spin highlight */}
      <g clipPath={`url(#${uid}-clip)`}>
        <motion.ellipse
          cx={cx} cy={cy}
          rx={coreR}
          ry={coreR * 1.2}
          fill={`url(#${uid}-spec)`}
          animate={{
            x: [coreR * 1.2, -coreR * 1.2, coreR * 1.2],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </g>

      {/* Thin edge highlight */}
      <motion.circle
        cx={cx} cy={cy}
        r={coreR}
        fill="none"
        stroke="white"
        strokeWidth={0.4 * s}
        animate={{
          strokeOpacity: [0.05, 0.25, 0.05],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center hot spot */}
      <circle
        cx={cx - coreR * 0.25}
        cy={cy - coreR * 0.3}
        r={0.6 * s}
        fill="white"
        opacity={0.5}
      />
    </svg>
  );
}

export default function OrinLogo({
  variant = 'full',
  size = 32,
  animate = false,
  className = '',
}: {
  variant?: 'full' | 'mark' | 'lockup';
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const scale = size / 32;
  const uid = `logo-${variant}-${size}`;

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Mark s={scale} uid={uid} animate={animate} />
      </div>
    );
  }

  if (variant === 'lockup') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <span
          className="font-bold tracking-widest text-white"
          style={{ fontSize: size * 0.6 }}
        >
          LXDS
        </span>
        <span style={{ color: ORANGE, fontSize: size * 0.6 }} className="font-bold mx-1">
          //
        </span>
        <div className="inline-flex items-center">
          <Mark s={scale * 0.7} uid={`${uid}-lock`} animate={animate} />
          <span
            className="font-bold tracking-[0.15em] text-white -ml-0.5"
            style={{ fontSize: size * 0.6 }}
          >
            RIN
          </span>
        </div>
      </div>
    );
  }

  // variant === 'full'
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Mark s={scale} uid={uid} animate={animate} />
      <span
        className="font-bold tracking-[0.15em] text-white -ml-1"
        style={{ fontSize: size * 0.65 }}
      >
        RIN
      </span>
    </div>
  );
}
