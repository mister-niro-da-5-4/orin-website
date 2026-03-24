import { useEffect, useRef } from 'react';

/**
 * Spatial Graph Background — the living constellation mesh.
 *
 * Canvas + requestAnimationFrame, completely outside React's render cycle.
 * - Tri-color node swarm (cyan, orange, dark gray)
 * - Dependency grid: filaments connect nodes within 150px, brightness = proximity
 * - Orange-node connections glow hotter
 * - Blast shield: mouse repulsion pushes nodes away
 */

const COLORS = ['#06B6D4', '#FF4F00', '#333333']; // Cyan, Orange, Dark Gray
const CONNECTION_DISTANCE = 150;
const MOUSE_REPULSION_RADIUS = 120;

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf: number;
    const mouse = { x: -1000, y: -1000 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    // Fewer particles on mobile to save battery
    const isMobile = width < 768;
    const count = isMobile
      ? Math.min(30, Math.floor((width * height) / 20000))
      : Math.min(80, Math.floor((width * height) / 12000));
    const x = new Float32Array(count);
    const y = new Float32Array(count);
    const vx = new Float32Array(count);
    const vy = new Float32Array(count);
    const radii = new Float32Array(count);
    const color: string[] = [];

    for (let i = 0; i < count; i++) {
      x[i] = Math.random() * width;
      y[i] = Math.random() * height;
      vx[i] = (Math.random() - 0.5) * 1.5;
      vy[i] = (Math.random() - 0.5) * 1.5;
      radii[i] = Math.random() * 2 + 1;
      color[i] = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        // Wall bounce
        if (x[i] < 0 || x[i] > width) vx[i] *= -1;
        if (y[i] < 0 || y[i] > height) vy[i] *= -1;

        // Blast shield — mouse repulsion
        const dx = mouse.x - x[i];
        const dy = mouse.y - y[i];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPULSION_RADIUS && dist > 0) {
          const force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
          x[i] -= (dx / dist) * force * 5;
          y[i] -= (dy / dist) * force * 5;
        }

        // Apply velocity
        x[i] += vx[i];
        y[i] += vy[i];

        // Draw node
        ctx!.beginPath();
        ctx!.arc(x[i], y[i], radii[i], 0, Math.PI * 2);
        ctx!.fillStyle = color[i];
        ctx!.fill();

        // Dependency grid — filaments between nearby nodes
        for (let j = i + 1; j < count; j++) {
          const fdx = x[i] - x[j];
          const fdy = y[i] - y[j];
          const fdist = Math.sqrt(fdx * fdx + fdy * fdy);

          if (fdist < CONNECTION_DISTANCE) {
            const opacity = 1 - fdist / CONNECTION_DISTANCE;
            const isOrange = color[i] === '#FF4F00' || color[j] === '#FF4F00';

            ctx!.beginPath();
            ctx!.strokeStyle = isOrange
              ? `rgba(255, 79, 0, ${opacity * 0.5})`
              : `rgba(100, 100, 100, ${opacity * 0.3})`;
            ctx!.lineWidth = 1;
            ctx!.moveTo(x[i], y[i]);
            ctx!.lineTo(x[j], y[j]);
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6, mixBlendMode: 'screen' }}
    />
  );
}
