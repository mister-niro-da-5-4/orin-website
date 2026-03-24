import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const smoothPos = useRef({ x: -100, y: -100 });

  // Don't render on touch devices
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (isTouch) return;
    let raf: number;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const lerp = 0.15;
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * lerp;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * lerp;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${smoothPos.current.x - 20}px, ${smoothPos.current.y - 20}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#FF4F00]/40 pointer-events-none z-[9999] mix-blend-screen"
        style={{ transition: 'width 0.2s, height 0.2s' }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF4F00] pointer-events-none z-[9999]"
        style={{ boxShadow: '0 0 12px rgba(255, 79, 0, 0.6), 0 0 4px rgba(255, 79, 0, 0.9)' }}
      />
    </>
  );
}
