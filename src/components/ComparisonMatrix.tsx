import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Support = 'full' | 'partial' | 'none' | 'planned';

interface Feature {
  category: string;
  name: string;
  orin: Support;
  orinNote?: string;
  competitors: Record<string, { level: Support; note?: string }>;
}

const COMPETITORS = ['Sana Learn', 'Articulate 360', 'Captivate', 'Lectora', 'iSpring', 'Elucidat'];

const FEATURES: Feature[] = [
  // Architecture
  {
    category: 'Architecture',
    name: 'Graph-based course model',
    orin: 'full',
    orinNote: 'Directed acyclic graph with conditional edges',
    competitors: {
      'Sana Learn': { level: 'none', note: 'Linear content blocks' },
      'Articulate 360': { level: 'none', note: 'Linear slides' },
      'Captivate': { level: 'none', note: 'Linear slides' },
      'Lectora': { level: 'none', note: 'Linear slides' },
      'iSpring': { level: 'none', note: 'PowerPoint plugin' },
      'Elucidat': { level: 'none', note: 'Template blocks' },
    },
  },
  {
    category: 'Architecture',
    name: 'State machine engine',
    orin: 'full',
    orinNote: 'XState hierarchical actors — deterministic, inspectable',
    competitors: {
      'Sana Learn': { level: 'none' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  {
    category: 'Architecture',
    name: 'Spatial canvas authoring',
    orin: 'full',
    orinNote: 'Orbit → Module → Slide (3 zoom levels)',
    competitors: {
      'Sana Learn': { level: 'none' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  // Authoring
  {
    category: 'Authoring',
    name: 'Live WYSIWYG editing',
    orin: 'full',
    orinNote: 'The preview IS the editor — no separate mode',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'Block-based editor' },
      'Articulate 360': { level: 'partial', note: 'Separate preview' },
      'Captivate': { level: 'partial', note: 'Separate preview' },
      'Lectora': { level: 'partial', note: 'Separate preview' },
      'iSpring': { level: 'partial', note: 'Via PowerPoint' },
      'Elucidat': { level: 'full', note: 'WYSIWYG' },
    },
  },
  {
    category: 'Authoring',
    name: 'Branching scenarios',
    orin: 'full',
    orinNote: 'Native — graph edges with conditions',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'Basic paths, not scenario-first' },
      'Articulate 360': { level: 'partial', note: 'Storyline only, manual' },
      'Captivate': { level: 'partial', note: 'Limited' },
      'Lectora': { level: 'partial', note: 'Supported' },
      'iSpring': { level: 'partial', note: 'Clunky, limited' },
      'Elucidat': { level: 'partial', note: 'Supported + role selectors' },
    },
  },
  {
    category: 'Authoring',
    name: 'Custom interactive simulations',
    orin: 'full',
    orinNote: 'Sandboxed web components via message-passing API',
    competitors: {
      'Sana Learn': { level: 'none', note: 'Template-bound' },
      'Articulate 360': { level: 'partial', note: 'JS triggers' },
      'Captivate': { level: 'partial', note: 'Screen recording' },
      'Lectora': { level: 'partial', note: 'Custom HTML' },
      'iSpring': { level: 'partial', note: 'Limited, no failure paths' },
      'Elucidat': { level: 'partial', note: 'Systems simulations + games' },
    },
  },
  // Intelligence
  {
    category: 'Intelligence',
    name: 'Learning science engine',
    orin: 'full',
    orinNote: 'Mayer, Sweller, Bloom\'s, spaced repetition — real-time validation',
    competitors: {
      'Sana Learn': { level: 'none' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  {
    category: 'Intelligence',
    name: 'Cognitive load analysis',
    orin: 'full',
    orinNote: 'Per-node, real-time, with threshold warnings',
    competitors: {
      'Sana Learn': { level: 'none' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  {
    category: 'Intelligence',
    name: 'AI co-authoring',
    orin: 'full',
    orinNote: 'Ambient: validates, inspires, generates — never overwrites',
    competitors: {
      'Sana Learn': { level: 'full', note: 'AI-native: generate from docs, AI tutor' },
      'Articulate 360': { level: 'partial', note: 'Drafts, alt text, captions' },
      'Captivate': { level: 'partial', note: 'Avatars, TTS, image gen' },
      'Lectora': { level: 'partial', note: 'AI-assisted content' },
      'iSpring': { level: 'partial', note: 'AI voiceover' },
      'Elucidat': { level: 'partial', note: 'Auto-translate' },
    },
  },
  {
    category: 'Intelligence',
    name: 'Domain-aware RAG pipeline',
    orin: 'full',
    orinNote: 'Learns your brand, learners, domain, and taste',
    competitors: {
      'Sana Learn': { level: 'full', note: 'RAG grounded in org docs, Slack, manuals' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  // Accessibility
  {
    category: 'Accessibility',
    name: 'Ambient accessibility engine',
    orin: 'full',
    orinNote: 'Always-on WCAG 2.2 AA',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'Basic' },
      'Articulate 360': { level: 'partial', note: 'Manual checks, no ambient' },
      'Captivate': { level: 'partial', note: 'Manual tools + checker, no ambient' },
      'Lectora': { level: 'partial', note: 'Strong — 508 check tool + WCAG 2.2' },
      'iSpring': { level: 'partial', note: 'Basic' },
      'Elucidat': { level: 'partial', note: 'Basic' },
    },
  },
  {
    category: 'Accessibility',
    name: 'Visual accessibility overlay',
    orin: 'full',
    orinNote: 'Tab order badges, ARIA labels, focus indicators — on the canvas',
    competitors: {
      'Sana Learn': { level: 'none' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  // Output & Data
  {
    category: 'Output & Data',
    name: 'Auto xAPI telemetry',
    orin: 'full',
    orinNote: 'Emitted from state transitions — zero configuration',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'Platform analytics only' },
      'Articulate 360': { level: 'partial', note: 'Custom xAPI triggers (Storyline)' },
      'Captivate': { level: 'partial', note: 'Manual config' },
      'Lectora': { level: 'partial', note: 'Manual config' },
      'iSpring': { level: 'partial', note: 'Basic' },
      'Elucidat': { level: 'partial', note: 'xAPI labelling (2025)' },
    },
  },
  {
    category: 'Output & Data',
    name: 'First-class learning objectives',
    orin: 'full',
    orinNote: 'Per-node mastery tracking, mapped to assessments',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'AI-generated assessments' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'none' },
      'Lectora': { level: 'partial', note: 'Supported' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'none' },
    },
  },
  {
    category: 'Output & Data',
    name: 'Output formats',
    orin: 'full',
    orinNote: 'SCORM 1.2, 2004, xAPI, LTI 1.3, standalone',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'Platform-locked, SCORM import only' },
      'Articulate 360': { level: 'full', note: 'SCORM, xAPI, AICC, cmi5' },
      'Captivate': { level: 'full', note: 'SCORM, xAPI, AICC' },
      'Lectora': { level: 'full', note: 'SCORM, xAPI, AICC, cmi5, HTML5' },
      'iSpring': { level: 'full', note: 'SCORM, xAPI' },
      'Elucidat': { level: 'full', note: 'SCORM, SCORM 2004, xAPI' },
    },
  },
  // Collaboration
  {
    category: 'Collaboration',
    name: 'Real-time multiplayer',
    orin: 'full',
    orinNote: 'CRDTs, offline-first',
    competitors: {
      'Sana Learn': { level: 'full', note: 'Real-time collaborative authoring' },
      'Articulate 360': { level: 'none', note: 'Review comments only' },
      'Captivate': { level: 'none', note: 'Cloud review links' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'partial', note: 'Cloud editing, not multiplayer' },
    },
  },
  {
    category: 'Collaboration',
    name: 'Stakeholder review surface',
    orin: 'full',
    orinNote: 'Dedicated linear feed — comment, flag, voice note',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'In-platform comments' },
      'Articulate 360': { level: 'partial', note: 'Review 360' },
      'Captivate': { level: 'partial', note: 'Cloud review' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'none' },
      'Elucidat': { level: 'partial', note: 'Comments' },
    },
  },
  {
    category: 'Collaboration',
    name: 'Competitor file import',
    orin: 'planned',
    orinNote: '.story, Rise, Captivate — even 80% saves weeks',
    competitors: {
      'Sana Learn': { level: 'partial', note: 'SCORM, PDF, image import' },
      'Articulate 360': { level: 'none' },
      'Captivate': { level: 'partial', note: 'PowerPoint import' },
      'Lectora': { level: 'none' },
      'iSpring': { level: 'partial', note: 'PowerPoint' },
      'Elucidat': { level: 'none' },
    },
  },
];

const CATEGORIES = [...new Set(FEATURES.map((f) => f.category))];

function Pip({ level }: { level: Support }) {
  if (level === 'full') {
    return (
      <div className="w-4 h-4 rounded-full bg-[#FF4F00] shadow-[0_0_8px_rgba(255,79,0,0.4)]" />
    );
  }
  if (level === 'partial') {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-gray-500 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-500" />
      </div>
    );
  }
  if (level === 'planned') {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-[#FF4F00]/50 border-dashed" />
    );
  }
  return <div className="w-4 h-4 rounded-full border border-white/10" />;
}

export default function ComparisonMatrix() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-4">The landscape.</h2>
        <p className="text-gray-500 max-w-xl">
          Not a fair fight. But here's how the industry's best stack up against a system that was designed to replace them.
        </p>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-2"><Pip level="full" /> <span>Native</span></div>
          <div className="flex items-center gap-2"><Pip level="partial" /> <span>Partial</span></div>
          <div className="flex items-center gap-2"><Pip level="planned" /> <span>Planned</span></div>
          <div className="flex items-center gap-2"><Pip level="none" /> <span>None</span></div>
        </div>
      </motion.div>

      {/* Matrix */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[900px] border-collapse">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 pr-4 text-sm font-bold text-white w-[240px] sticky left-0 bg-[#030303] z-10">
                Capability
              </th>
              <th className="py-4 px-3 text-center w-[90px]">
                <span className="text-xs font-bold text-[#FF4F00] tracking-wider">ORIN</span>
              </th>
              {COMPETITORS.map((c) => (
                <th key={c} className="py-4 px-3 text-center w-[90px]">
                  <span className="text-[10px] font-mono text-gray-500 tracking-wide leading-tight block">
                    {c}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {CATEGORIES.map((cat) => (
              <CategoryGroup
                key={cat}
                category={cat}
                features={FEATURES.filter((f) => f.category === cat)}
                expanded={expanded}
                setExpanded={setExpanded}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CategoryGroup({
  category,
  features,
  expanded,
  setExpanded,
}: {
  category: string;
  features: Feature[];
  expanded: string | null;
  setExpanded: (id: string | null) => void;
}) {
  return (
    <>
      {/* Category header */}
      <tr>
        <td
          colSpan={8}
          className="pt-8 pb-3 text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase bg-[#030303]"
        >
          {category}
        </td>
      </tr>

      {features.map((feat) => {
        const rowId = `${feat.category}-${feat.name}`;
        const isOpen = expanded === rowId;

        return (
          <motion.tr
            key={rowId}
            className="border-b border-white/5 group"
            initial={false}
          >
            {/* Feature name — clickable to expand */}
            <td
              className="py-3 pr-4 text-sm text-gray-300 sticky left-0 bg-[#030303] z-10 cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : rowId)}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  className="text-[10px] text-gray-600"
                >
                  ▶
                </motion.span>
                <span className="group-hover:text-white transition-colors">{feat.name}</span>
              </div>
              <AnimatePresence>
                {isOpen && feat.orinNote && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[11px] text-[#FF4F00]/70 mt-1 ml-5 overflow-hidden"
                  >
                    {feat.orinNote}
                  </motion.p>
                )}
              </AnimatePresence>
            </td>

            {/* Orin pip */}
            <td className="py-3 px-3 text-center">
              <div className="flex justify-center">
                <Pip level={feat.orin} />
              </div>
            </td>

            {/* Competitor pips */}
            {COMPETITORS.map((c) => {
              const comp = feat.competitors[c];
              return (
                <td key={c} className="py-3 px-3 text-center relative group/cell">
                  <div className="flex justify-center">
                    <Pip level={comp.level} />
                  </div>
                  {/* Tooltip on hover */}
                  {comp.note && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none z-20">
                      {comp.note}
                    </div>
                  )}
                </td>
              );
            })}
          </motion.tr>
        );
      })}
    </>
  );
}
