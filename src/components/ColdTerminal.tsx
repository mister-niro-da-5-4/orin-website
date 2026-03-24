import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * ColdTerminal — behaves like a real terminal session.
 *
 * Each scenario plays as a full sequence:
 *   cursor blinks → request types in char by char → pause →
 *   border flash → strikethrough → override types in → lines appear →
 *   ready → hold → clear screen → next prompt starts typing
 *
 * No fades. No transitions. The typing IS the animation.
 */

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
  {
    request: '> Requesting: New hire onboarding course for IT team...',
    override: 'SIGNAL: Analyzing request against existing resources.',
    lines: [
      '→ Knowledge base scan: 94% of content already documented',
      '→ Existing wiki covers 11 of 12 onboarding tasks',
      '→ Gap: 1 process (VPN setup) — needs 90-sec walkthrough',
      '→ Training ROI: negative. Course would duplicate the wiki.',
    ],
    ready: 'No training needed. Send them the wiki. Orin saved you $14,000.',
  },
];

export default function ColdTerminal() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [requestChars, setRequestChars] = useState(0);
  const [isRejected, setIsRejected] = useState(false);
  const [overrideChars, setOverrideChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [borderFlash, setBorderFlash] = useState(false);
  const [cleared, setCleared] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = SCENARIOS[scenarioIdx];

  const clearTimers = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  }, []);

  // Run full sequence whenever scenarioIdx changes
  useEffect(() => {
    clearTimers();

    // Reset all state
    setRequestChars(0);
    setIsRejected(false);
    setOverrideChars(0);
    setVisibleLines(0);
    setShowReady(false);
    setBorderFlash(false);
    setCleared(false);

    // Small initial delay so the cleared screen is visible for a beat
    later(() => {
      // === STEP 1: Type the request ===
      let rIdx = 0;
      const reqInterval = setInterval(() => {
        rIdx++;
        setRequestChars(rIdx);
        if (rIdx >= scenario.request.length) {
          clearInterval(reqInterval);

          // === STEP 2: Pause, then reject ===
          later(() => {
            setBorderFlash(true);
            setIsRejected(true);
            later(() => setBorderFlash(false), 300);

            // === STEP 3: Type the override ===
            later(() => {
              let oIdx = 0;
              const ovrInterval = setInterval(() => {
                oIdx++;
                setOverrideChars(oIdx);
                if (oIdx >= scenario.override.length) {
                  clearInterval(ovrInterval);

                  // === STEP 4: Show lines one by one ===
                  scenario.lines.forEach((_, i) => {
                    later(() => setVisibleLines(i + 1), 500 + i * 300);
                  });

                  // === STEP 5: Show ready ===
                  const linesEnd = 500 + scenario.lines.length * 300 + 200;
                  later(() => setShowReady(true), linesEnd);

                  // === STEP 6: Hold, clear, advance ===
                  later(() => {
                    setCleared(true);
                    later(() => {
                      setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
                    }, 400);
                  }, linesEnd + 3000);
                }
              }, 25); // Override types faster — the system is more fluent
              intervalsRef.current.push(ovrInterval);
            }, 400);
          }, 800);
        }
      }, 45);
      intervalsRef.current.push(reqInterval);
    }, 300);

    return clearTimers;
  }, [scenarioIdx, scenario, clearTimers, later]);

  const showingOverride = overrideChars > 0;
  const typingRequest = requestChars > 0 && requestChars < scenario.request.length;
  const typingOverride = showingOverride && overrideChars < scenario.override.length;

  return (
    <div
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

      {/* Terminal content — no transitions, just state */}
      {!cleared && (
        <div className="text-sm">
          {/* The request — typing or struck through */}
          {!isRejected ? (
            <p className="text-gray-400">
              {scenario.request.substring(0, requestChars)}
              {(typingRequest || requestChars === 0) && (
                <span className="animate-pulse">_</span>
              )}
              {/* Blinking cursor during the pause after typing finishes */}
              {requestChars >= scenario.request.length && (
                <span className="animate-pulse">_</span>
              )}
            </p>
          ) : (
            <p className="text-red-500/40 line-through decoration-2">
              {scenario.request}
            </p>
          )}

          {/* The override — types character by character */}
          {showingOverride && (
            <p className="mt-3 text-[#FF4F00] font-bold flex items-start gap-2"
               style={{ textShadow: '0 0 10px rgba(255, 79, 0, 0.25)' }}>
              <span className="shrink-0 mt-0.5">▌</span>
              <span>
                {scenario.override.substring(0, overrideChars)}
                {typingOverride && <span className="animate-pulse">_</span>}
              </span>
            </p>
          )}

          {/* Confirmation lines — appear one by one */}
          {visibleLines > 0 && (
            <div className="mt-3">
              {scenario.lines.slice(0, visibleLines).map((line, i) => (
                <p key={i} className="text-gray-500 text-xs mt-1">{line}</p>
              ))}
            </div>
          )}

          {/* Ready */}
          {showReady && (
            <p className="text-emerald-500/70 text-xs mt-3 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              {scenario.ready}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
