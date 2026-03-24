import { useEffect, useRef } from 'react';

const LOGS = [
  'SIGNAL: 14 intake requests filtered — 9 rejected (cognitive overload detected)',
  'BLUEPRINT: Objective cluster #7 recalculated — Bloom\'s depth increased to L4',
  'STUDIO: Sandbox compiled in 0.8s — 12 interactive nodes generated',
  'GOVERN: Policy patch GV-2026-041 propagated to 847 active packages',
  'PULSE: Hesitation latency anomaly detected — Module 3, Node 14 flagged',
  'SIGNAL: Stakeholder request rejected — insufficient behavioral justification',
  'BLUEPRINT: Transfer topology validated — 3 reinforcement loops confirmed',
  'STUDIO: WebGPU render pipeline initialized — 60fps target locked',
  'GOVERN: WCAG 2.2 AA sweep complete — 0 violations across 23 courses',
  'PULSE: xAPI telemetry stream active — 2,847 events/sec ingested',
  'SIGNAL: Cost model updated — $4.2M annual waste projection eliminated',
  'BLUEPRINT: Spaced repetition intervals recalibrated from PULSE decay curves',
];

export default function StatusTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let raf: number;

    const scroll = () => {
      pos -= speed;
      if (pos <= -el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(scroll);
    };
    raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...LOGS, ...LOGS];

  return (
    <div className="w-full overflow-hidden bg-white/[0.02] border-b border-white/5 py-2">
      <div ref={containerRef} className="flex whitespace-nowrap gap-12">
        {doubled.map((log, i) => (
          <span key={i} className="text-[11px] font-mono tracking-wide text-gray-600 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF4F00]/60 animate-pulse" />
            {log}
          </span>
        ))}
      </div>
    </div>
  );
}
