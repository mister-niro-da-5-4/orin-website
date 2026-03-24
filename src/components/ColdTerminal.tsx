import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OVERRIDE_TEXT = 'SYSTEM OVERRIDE: Orin compiling behavioral sandbox.';
const CONFIRM_LINES = [
  '→ 12 interactive nodes generated',
  '→ Cognitive load: optimal (3.2 elements)',
  '→ WCAG 2.2 AA: passed',
  '→ Behavioral transfer topology: validated',
];

export default function ColdTerminal({
  fullText,
  typedText,
  isRejected,
}: {
  fullText: string;
  typedText: string;
  isRejected: boolean;
}) {
  const [borderFlash, setBorderFlash] = useState(false);
  const [overrideText, setOverrideText] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showReady, setShowReady] = useState(false);

  // The Cold Takeover sequence
  useEffect(() => {
    if (!isRejected) return;

    // 1. Single clean border flash (0ms)
    setBorderFlash(true);
    const t0 = setTimeout(() => setBorderFlash(false), 300);

    // 2. Override types itself in after a beat (600ms)
    let charIdx = 0;
    const t1 = setTimeout(() => {
      const typing = setInterval(() => {
        charIdx++;
        setOverrideText(OVERRIDE_TEXT.substring(0, charIdx));
        if (charIdx >= OVERRIDE_TEXT.length) {
          clearInterval(typing);

          // 3. Progress bar appears after override finishes
          setShowProgress(true);

          // 4. Confirmation lines appear one by one — it was already building
          CONFIRM_LINES.forEach((_, i) => {
            setTimeout(() => setVisibleLines(i + 1), 800 + i * 400);
          });

          // 5. Final ready state
          setTimeout(() => setShowReady(true), 800 + CONFIRM_LINES.length * 400 + 300);
        }
      }, 35); // Slightly faster than the user's typing — the system is more fluent
    }, 600);

    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [isRejected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mt-12 w-full max-w-2xl rounded-lg p-6 text-left font-mono shadow-2xl relative overflow-hidden backdrop-blur-sm"
      style={{
        height: 260,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: borderFlash
          ? '1px solid rgba(255, 60, 60, 0.8)'
          : isRejected
            ? '1px solid rgba(255, 79, 0, 0.15)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: borderFlash
          ? '0 0 30px rgba(255, 60, 60, 0.15), inset 0 0 30px rgba(255, 60, 60, 0.03)'
          : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Top accent line — shifts from neutral to Orin orange after takeover */}
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{
          background: isRejected
            ? 'linear-gradient(to right, transparent, rgba(255, 79, 0, 0.5), transparent)'
            : 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transition: 'background 0.6s ease',
        }}
      />

      {/* Terminal dots */}
      <div className="flex gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      </div>

      {!isRejected ? (
        /* STATE A: Harmless typing */
        <p className="text-gray-400">
          {typedText}<span className="animate-pulse">_</span>
        </p>
      ) : (
        /* STATE B: The Cold Takeover */
        <div>
          {/* Dead request — instant, no animation. The decision was already made. */}
          <p className="text-red-500/40 line-through decoration-2">{fullText}</p>

          {/* The override types itself in — deliberate, not panicked */}
          {overrideText && (
            <p className="mt-3 text-[#FF4F00] font-bold flex items-start gap-2"
               style={{ textShadow: '0 0 10px rgba(255, 79, 0, 0.25)' }}>
              <span className="shrink-0 mt-0.5">▌</span>
              <span>
                {overrideText}
                {overrideText.length < OVERRIDE_TEXT.length && (
                  <span className="animate-pulse">_</span>
                )}
              </span>
            </p>
          )}

          {/* Progress bar — smooth, confident, already running */}
          {showProgress && (
            <div className="mt-4 mb-3">
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-[#FF4F00]/60 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Confirmation lines — the system was already building while you were reading */}
          {CONFIRM_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-500 text-xs mt-1"
            >
              {line}
            </motion.p>
          ))}

          {/* Final ready — quiet confidence */}
          {showReady && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-emerald-500/70 text-xs mt-3 flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              Sandbox ready. Deploy when ready.
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}
