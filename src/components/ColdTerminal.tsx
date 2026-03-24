import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  request: string;
  override: string;
  lines: string[];
  ready: string;
}

const SCENARIOS: Scenario[] = [
  {
    request: '> Requesting: 30-min compliance SCORM package...',
    override: 'SYSTEM OVERRIDE: Orin compiling behavioral sandbox.',
    lines: [
      '→ 12 interactive nodes generated',
      '→ Cognitive load: optimal (3.2 elements)',
      '→ WCAG 2.2 AA: passed',
      '→ Behavioral transfer topology: validated',
    ],
    ready: 'Sandbox ready. Deploy when ready.',
  },
  {
    request: '> Requesting: Convert this PowerPoint deck to eLearning...',
    override: 'INTERCEPTED: Mapping objectives to behavioral outcomes.',
    lines: [
      '→ 47 slides analyzed — 38 redundant',
      '→ 9 core concepts extracted',
      '→ Branching scenario: 4 decision points',
      '→ Cognitive load: reduced 72%',
    ],
    ready: 'Experience compiled. Zero slides.',
  },
  {
    request: '> Requesting: 1-hour safety training by Friday...',
    override: 'REDIRECTED: Calculating optimal learning architecture.',
    lines: [
      '→ Seat-time analysis: 12 min effective, 48 min wasted',
      '→ Spaced repetition: 4×8 min over 2 weeks',
      '→ Retention model: +340% vs single session',
      '→ OSHA compliance: mapped to 6 objectives',
    ],
    ready: 'Microlearning sequence deployed. 32 min total.',
  },
  {
    request: '> Requesting: Just add a quiz at the end...',
    override: 'REJECTED: Assessment without alignment is noise.',
    lines: [
      '→ 5 learning objectives — 0 currently assessed',
      '→ Retrieval practice injected at nodes 3, 7, 11',
      '→ Item analysis: mapped to Bloom\'s L3–L5',
      '→ Mastery threshold: 85% per objective',
    ],
    ready: 'Assessment topology validated.',
  },
  {
    request: '> Requesting: Make it look like the last course...',
    override: 'OVERRULED: Analyzing learner performance data.',
    lines: [
      '→ Last course: 23% completion, 2.1 min avg engagement',
      '→ Drop-off: slide 4 (text wall, no interaction)',
      '→ Redesigned: problem-first with simulation at node 2',
      '→ Predicted completion: 89%',
    ],
    ready: 'Evidence-based design applied. Not a copy — an upgrade.',
  },
];

type AnimPhase = 'typing' | 'pause' | 'rejected' | 'override' | 'lines' | 'ready' | 'hold' | 'fadeout';

export default function ColdTerminal() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('typing');
  const [typedText, setTypedText] = useState('');
  const [overrideText, setOverrideText] = useState('');
  const [visibleLines, setVisibleLines] = useState(0);
  const [borderFlash, setBorderFlash] = useState(false);
  const [visible, setVisible] = useState(true);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = SCENARIOS[scenarioIdx];

  // Clear all pending timeouts
  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeouts.current.push(t);
    return t;
  };

  // Run the full animation sequence for the current scenario
  useEffect(() => {
    clearAllTimeouts();
    setTypedText('');
    setOverrideText('');
    setVisibleLines(0);
    setBorderFlash(false);
    setVisible(true);
    setAnimPhase('typing');

    const req = scenario.request;
    const ovr = scenario.override;

    // 1. Type the request
    let charIdx = 0;
    const typeReq = setInterval(() => {
      charIdx++;
      setTypedText(req.substring(0, charIdx));
      if (charIdx >= req.length) {
        clearInterval(typeReq);

        // 2. Pause to let them read it
        setAnimPhase('pause');
        later(() => {
          // 3. Flash + reject
          setBorderFlash(true);
          setAnimPhase('rejected');
          later(() => setBorderFlash(false), 300);

          // 4. Type the override
          later(() => {
            setAnimPhase('override');
            let ovrIdx = 0;
            const typeOvr = setInterval(() => {
              ovrIdx++;
              setOverrideText(ovr.substring(0, ovrIdx));
              if (ovrIdx >= ovr.length) {
                clearInterval(typeOvr);

                // 5. Show lines one by one
                setAnimPhase('lines');
                scenario.lines.forEach((_, i) => {
                  later(() => setVisibleLines(i + 1), 600 + i * 350);
                });

                // 6. Show ready
                const linesTime = 600 + scenario.lines.length * 350 + 200;
                later(() => setAnimPhase('ready'), linesTime);

                // 7. Hold, then fade out and advance
                later(() => {
                  setAnimPhase('fadeout');
                  setVisible(false);
                  later(() => {
                    setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
                  }, 600);
                }, linesTime + 2500);
              }
            }, 30);
          }, 500);
        }, 800);
      }
    }, 45);

    return () => {
      clearInterval(typeReq);
      clearAllTimeouts();
    };
  }, [scenarioIdx]);

  const isRejected = animPhase !== 'typing' && animPhase !== 'pause';

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
        <motion.div
          key={scenarioIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* The request — typing or struck through */}
          {!isRejected ? (
            <p className="text-gray-400 text-sm">
              {typedText}<span className="animate-pulse">_</span>
            </p>
          ) : (
            <p className="text-red-500/40 line-through decoration-2 text-sm">
              {scenario.request}
            </p>
          )}

          {/* The override — types in after rejection */}
          {overrideText && (
            <p className="mt-3 text-[#FF4F00] font-bold flex items-start gap-2 text-sm"
               style={{ textShadow: '0 0 10px rgba(255, 79, 0, 0.25)' }}>
              <span className="shrink-0 mt-0.5">▌</span>
              <span>
                {overrideText}
                {overrideText.length < scenario.override.length && (
                  <span className="animate-pulse">_</span>
                )}
              </span>
            </p>
          )}

          {/* Confirmation lines */}
          {scenario.lines.slice(0, visibleLines).map((line, i) => (
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

          {/* Ready */}
          {(animPhase === 'ready' || animPhase === 'hold' || animPhase === 'fadeout') && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-emerald-500/70 text-xs mt-3 flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              {scenario.ready}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
