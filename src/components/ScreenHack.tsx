import { useEffect, useState } from 'react';

/**
 * Contained hack effect scoped to its parent element.
 * Layers: flash → static → scan lines → RGB split → screen shake.
 * Entire sequence runs ~1.6s, then cleans up.
 */
export default function ScreenHack({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<'idle' | 'flash' | 'glitch' | 'settle'>('idle');

  useEffect(() => {
    if (!active) return;

    setPhase('flash');
    const t1 = setTimeout(() => setPhase('glitch'), 200);
    const t2 = setTimeout(() => setPhase('settle'), 1400);
    const t3 = setTimeout(() => setPhase('idle'), 1800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);

  const isGlitching = phase === 'flash' || phase === 'glitch';

  return (
    <div className="relative">
      {/* The content — gets RGB-split + shake during glitch */}
      <div
        style={phase === 'glitch' ? { animation: 'rgb-split 0.15s steps(2) infinite, hack-shake 0.1s linear infinite' } : undefined}
      >
        {children}
      </div>

      {/* === OVERLAY LAYERS (absolute, scoped to this container) === */}

      {/* Hard flash */}
      {phase === 'flash' && (
        <div
          className="absolute inset-0 z-50 pointer-events-none rounded-lg"
          style={{ animation: 'hard-flash 0.2s steps(3) forwards' }}
        />
      )}

      {/* Static noise */}
      {isGlitching && <StaticNoise />}

      {/* Horizontal scan lines */}
      {isGlitching && (
        <div
          className="absolute inset-0 z-50 pointer-events-none rounded-lg opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,79,0,0.12) 2px, rgba(255,79,0,0.12) 4px)',
            animation: 'scanline-scroll 0.3s linear infinite',
          }}
        />
      )}

      {/* Glitch bars */}
      {phase === 'glitch' && <GlitchBars />}

      {/* Settling vignette */}
      {phase === 'settle' && (
        <div
          className="absolute inset-0 z-50 pointer-events-none rounded-lg"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(255,79,0,0.1) 100%)',
            animation: 'fade-out 0.4s ease-out forwards',
          }}
        />
      )}
    </div>
  );
}

/** Canvas-based TV static overlay — sized to parent */
function StaticNoise() {
  useEffect(() => {
    const canvas = document.getElementById('hack-static') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement!;
    let raf: number;

    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() > 0.95 ? 255 : 0;
        d[i] = v;
        d[i + 1] = v * 0.3;
        d[i + 2] = 0;
        d[i + 3] = Math.random() * 50;
      }
      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      id="hack-static"
      className="absolute inset-0 z-50 pointer-events-none rounded-lg"
      style={{ mixBlendMode: 'screen', opacity: 0.7 }}
    />
  );
}

/** Random horizontal tear bars — contained */
function GlitchBars() {
  const bars = Array.from({ length: 5 }, (_, i) => ({
    top: Math.random() * 100,
    height: Math.random() * 4 + 1,
    offset: (Math.random() - 0.5) * 20,
    delay: Math.random() * 0.3,
    color: i % 2 === 0 ? 'rgba(255,79,0,0.2)' : 'rgba(255,0,0,0.15)',
  }));

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-lg">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="absolute left-0 w-full"
          style={{
            top: `${bar.top}%`,
            height: `${bar.height}%`,
            backgroundColor: bar.color,
            transform: `translateX(${bar.offset}px)`,
            animation: `glitch-bar 0.15s steps(2) ${bar.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
