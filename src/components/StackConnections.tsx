import { useEffect, useRef, useState } from 'react';

const COLORS = [
  'rgba(139, 92, 246, 0.3)',  // violet - SIGNAL
  'rgba(59, 130, 246, 0.3)',  // blue - BLUEPRINT
  'rgba(255, 79, 0, 0.5)',    // orange - STUDIO
  'rgba(16, 185, 129, 0.3)',  // emerald - GOVERN
  'rgba(34, 211, 238, 0.3)',  // cyan - PULSE
];

interface Line {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

export default function StackConnections({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cards = container.querySelectorAll('[data-stack-card]');
      if (cards.length < 2) return;

      const containerRect = container.getBoundingClientRect();
      const centers = Array.from(cards).map((card) => {
        const r = card.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        };
      });

      const newLines: Line[] = [];
      // Connect sequential layers
      for (let i = 0; i < centers.length - 1; i++) {
        newLines.push({
          x1: centers[i].x, y1: centers[i].y,
          x2: centers[i + 1].x, y2: centers[i + 1].y,
          color: COLORS[i],
        });
      }
      // Cross-connections for depth
      if (centers.length >= 5) {
        newLines.push({ x1: centers[0].x, y1: centers[0].y, x2: centers[4].x, y2: centers[4].y, color: 'rgba(255,255,255,0.05)' });
        newLines.push({ x1: centers[1].x, y1: centers[1].y, x2: centers[3].x, y2: centers[3].y, color: 'rgba(255,255,255,0.05)' });
      }
      setLines(newLines);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [containerRef]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % Math.max(lines.length, 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [lines.length]);

  if (lines.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id="glow">
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
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {i === pulseIdx && (
            <circle r="3" fill="#FF4F00" filter="url(#glow)">
              <animateMotion
                dur="1.2s"
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
