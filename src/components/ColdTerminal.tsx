import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ColdTerminal — the live system feed.
 *
 * Phase 1: The initial dramatic rejection (typed, with override + progress).
 * Phase 2: After the first sequence completes, cycles through more stakeholder
 *          requests — each intercepted and transformed. Fades between panels.
 *          The system never stops working.
 */

interface Scenario {
  request: string;
  override: string;
  lines: string[];
  ready: string;
}

const SCENARIOS: Scenario[] = [
  {
    request: '> Requesting: Convert this PowerPoint deck to eLearning...',
    override: 'INTERCEPTED: Mapping objectives to behavioral outcomes.',
    lines: [
      '→ 47 slides analyzed — 38 redundant',
      '→ 9 core concepts extracted',
      '→ Branching scenario generated with 4 decision points',
      '→ Cognitive load: reduced 72%',
    ],
    ready: 'Experience compiled. Zero slides.',
  },
  {
    request: '> Requesting: 1-hour safety training by Friday...',
    override: 'REDIRECTED: Calculating optimal learning architecture.',
    lines: [
      '→ Seat-time analysis: 12 min effective, 48 min wasted',
      '→ Spaced repetition sequence: 4×8 min over 2 weeks',
      '→ Retention model: +340% vs single session',
      '→ OSHA compliance: mapped to 6 objectives',
    ],
    ready: 'Microlearning sequence deployed. 32 min total.',
  },
  {
    request: '> Requesting: Just add a quiz at the end...',
    override: 'REJECTED: Assessment without alignment is noise.',
    lines: [
      '→ 5 learning objectives detected — 0 assessed',
      '→ Retrieval practice injected at nodes 3, 7, 11',
      '→ Item analysis: mapped to Bloom\'s L3–L5',
      '→ Mastery threshold: 85% per objective',
    ],
    ready: 'Assessment topology validated. Every question earns its place.',
  },
  {
    request: '> Requesting: Make it look like the last course...',
    override: 'OVERRULED: Analyzing learner performance data.',
    lines: [
      '→ Last course: 23% completion, 2.1 min avg engagement',
      '→ Drop-off point: slide 4 (text wall, no interaction)',
      '→ Redesigned: problem-first with simulation at node 2',
      '→ Predicted completion: 89%',
    ],
    ready: 'Evidence-based design applied. Not a copy — an upgrade.',
  },
  {
    request: '> Requesting: We need a video-based module...',
    override: 'INTERCEPTED: Format follows function, not preference.',
    lines: [
      '→ Content analysis: procedural skill (hands-on)',
      '→ Video efficacy for this type: 31% transfer',
      '→ Interactive simulation efficacy: 78% transfer',
      '→ Hybrid: 90-sec context video + sandbox practice',
    ],
    ready: 'Modality matched to science. Not stakeholder habit.',
  },
];

const CYCLE_INTERVAL = 6000; // ms between scenario transitions

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

  // Phase 2: cycling scenarios
  const [phase, setPhase] = useState<'initial' | 'cycling'>('initial');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioVisible, setScenarioVisible] = useState(true);

  const INITIAL_OVERRIDE = 'SYSTEM OVERRIDE: Orin compiling behavioral sandbox.';
  const INITIAL_LINES = [
    '→ 12 interactive nodes generated',
    '→ Cognitive load: optimal (3.2 elements)',
    '→ WCAG 2.2 AA: passed',
    '→ Behavioral transfer topology: validated',
  ];

  // Phase 1: The Cold Takeover sequence
  useEffect(() => {
    if (!isRejected) return;

    setBorderFlash(true);
    const t0 = setTimeout(() => setBorderFlash(false), 300);

    let charIdx = 0;
    const t1 = setTimeout(() => {
      const typing = setInterval(() => {
        charIdx++;
        setOverrideText(INITIAL_OVERRIDE.substring(0, charIdx));
        if (charIdx >= INITIAL_OVERRIDE.length) {
          clearInterval(typing);
          setShowProgress(true);
          INITIAL_LINES.forEach((_, i) => {
            setTimeout(() => setVisibleLines(i + 1), 800 + i * 400);
          });
          setTimeout(() => setShowReady(true), 800 + INITIAL_LINES.length * 400 + 300);

          // Transition to cycling phase after the initial sequence completes
          const totalInitialTime = 800 + INITIAL_LINES.length * 400 + 300 + 2500;
          setTimeout(() => setPhase('cycling'), totalInitialTime);
        }
      }, 35);
    }, 600);

    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [isRejected]);

  // Phase 2: Cycle through scenarios
  const advanceScenario = useCallback(() => {
    setScenarioVisible(false);
    setTimeout(() => {
      setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
      setScenarioVisible(true);
    }, 500); // fade gap
  }, []);

  useEffect(() => {
    if (phase !== 'cycling') return;
    setScenarioVisible(true);
    const interval = setInterval(advanceScenario, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [phase, advanceScenario]);

  const scenario = SCENARIOS[scenarioIdx];

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
      {/* Top accent line */}
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

      <AnimatePresence mode="wait">
        {/* === PHASE 0: Typing === */}
        {!isRejected && (
          <motion.div key="typing" exit={{ opacity: 0 }}>
            <p className="text-gray-400">
              {typedText}<span className="animate-pulse">_</span>
            </p>
          </motion.div>
        )}

        {/* === PHASE 1: Initial Cold Takeover === */}
        {isRejected && phase === 'initial' && (
          <motion.div key="initial" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
            <p className="text-red-500/40 line-through decoration-2">{fullText}</p>

            {overrideText && (
              <p className="mt-3 text-[#FF4F00] font-bold flex items-start gap-2"
                 style={{ textShadow: '0 0 10px rgba(255, 79, 0, 0.25)' }}>
                <span className="shrink-0 mt-0.5">▌</span>
                <span>
                  {overrideText}
                  {overrideText.length < INITIAL_OVERRIDE.length && (
                    <span className="animate-pulse">_</span>
                  )}
                </span>
              </p>
            )}

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

            {INITIAL_LINES.slice(0, visibleLines).map((line, i) => (
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
          </motion.div>
        )}

        {/* === PHASE 2: Cycling Scenarios === */}
        {phase === 'cycling' && scenarioVisible && (
          <motion.div
            key={`scenario-${scenarioIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
          >
            {/* Dead request */}
            <p className="text-red-500/40 line-through decoration-2 text-sm">
              {scenario.request}
            </p>

            {/* Override */}
            <p className="mt-3 text-[#FF4F00] font-bold flex items-start gap-2 text-sm"
               style={{ textShadow: '0 0 10px rgba(255, 79, 0, 0.25)' }}>
              <span className="shrink-0 mt-0.5">▌</span>
              {scenario.override}
            </p>

            {/* Confirmation lines */}
            <div className="mt-3">
              {scenario.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  className="text-gray-500 text-xs mt-1"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Ready */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-emerald-500/70 text-xs mt-3 flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              {scenario.ready}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
