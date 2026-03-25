import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ImmersiveSim — the visitor becomes the learner.
 *
 * Three phases inside a single morphing container:
 *   1. Prompt card  → click "Enter the simulation"
 *   2. Terminal eval → Orin analyzes, rejects slides, compiles sandbox
 *   3. Outlook sim   → full-fidelity inbox with coaching overlay
 *
 * Below: environment gallery + analytics payoff.
 */

// ─── Terminal sequence lines ───
const TERM_LINES = [
  { text: '> Incoming: CSM de-escalation training for enterprise accounts', cls: 'req' },
  { text: 'SIGNAL: Analyzing request against behavioral taxonomy...', cls: 'signal' },
  { text: '✓ Slides rejected — behavioral gap requires practice, not information', cls: 'result' },
  { text: '✓ Simulation warranted — high-stakes interpersonal, real tools', cls: 'result' },
  { text: '✓ Environment: Outlook + CRM composite', cls: 'result' },
  { text: '✓ Scenario: Angry VP, SLA breach, $340K renewal at risk', cls: 'result' },
  { text: 'STUDIO: Compiling sandbox...', cls: 'compile' },
  { text: '__PROGRESS__', cls: 'progress' },
  { text: 'Simulation ready. Launching environment.', cls: 'ready' },
];

const TERM_DELAYS = [0, 800, 1600, 2100, 2600, 3100, 3800, 4200, 6200];

// ─── Gallery environments ───
const ENVIRONMENTS = [
  { title: 'Azure Portal', desc: 'Incident response for cloud engineers. Live alerts, runbooks, war rooms.', type: 'azure' },
  { title: 'Salesforce CRM', desc: 'Pipeline management for new sales reps. Deals, stages, discovery calls.', type: 'sf' },
  { title: 'Slack Workspace', desc: 'Cross-functional communication under pressure. Escalation, triage, tone.', type: 'slack' },
  { title: 'EHR System', desc: 'Patient intake and triage for healthcare onboarding. HIPAA-safe scenarios.', type: 'ehr' },
  { title: 'ServiceNow', desc: 'Incident escalation for IT support teams. Priority routing, SLA management.', type: 'snow' },
  { title: 'Jira', desc: 'Sprint planning and stakeholder negotiation for new PMs.', type: 'jira' },
];

// ─── Keyword detection for coaching ───
const EMPATHY_WORDS = ['understand', 'hear you', 'frustrat', 'sorry', 'apologize', 'appreciate', 'right to be'];
const OWN_WORDS = ['our fault', 'we dropped', 'on us', 'my responsibility', 'we failed', 'i own', 'we own', 'accountable', "shouldn't have", 'unacceptable on our'];
const RES_WORDS = ['call', 'meet', 'schedule', 'plan', 'next step', 'action', 'fix', 'ensure', 'prevent', 'escalat', 'dedicated', 'assign'];

function detectSignals(text: string) {
  const val = text.toLowerCase();
  const len = val.length;
  const hasEmpathy = EMPATHY_WORDS.some(w => val.includes(w));
  const hasOwn = OWN_WORDS.some(w => val.includes(w));
  const hasRes = RES_WORDS.some(w => val.includes(w));

  const empathy = hasEmpathy ? Math.min(72, 40 + len / 3) : Math.min(20, len / 5);
  const own = hasOwn ? Math.min(65, 30 + len / 4) : Math.min(10, len / 10);
  const res = hasRes ? Math.min(55, 20 + len / 5) : Math.min(5, len / 15);

  let nudge: string;
  if (len < 10) nudge = "Take a breath. Read Marcus's email again before responding. What's he actually asking for?";
  else if (hasEmpathy && !hasOwn) nudge = "You're showing empathy — good. But Marcus doesn't need comfort. He needs you to own the SLA breach. Name it explicitly.";
  else if (hasOwn && !hasRes) nudge = "Ownership acknowledged. Now give Marcus a concrete next step — a call, a plan, a timeline. Abstract promises won't save this.";
  else if (hasEmpathy && hasOwn && hasRes) nudge = "Strong response. You've hit empathy, ownership, and resolution. Consider adding a specific timeline to lock in credibility.";
  else if (!hasEmpathy && len > 30) nudge = "You're jumping to solutions without acknowledging Marcus's frustration. He needs to feel heard first.";
  else nudge = "Keep going. Marcus listed 3 specific failures: SLA breach, CSM unreachable, QBR cancelled. Address each one.";

  return { empathy: Math.round(empathy), own: Math.round(own), res: Math.round(res), nudge };
}

// ─── Mini app thumbnails for gallery ───
function MiniApp({ type }: { type: string }) {
  const s = { position: 'absolute' as const, inset: 12, borderRadius: 6, overflow: 'hidden' as const, fontFamily: "'Segoe UI', system-ui, sans-serif", boxShadow: '0 2px 12px rgba(0,0,0,0.2)' };

  if (type === 'azure') return (
    <div style={{ ...s, background: '#1e1e1e' }}>
      <div style={{ height: 24, background: '#0078d4', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Microsoft Azure — Portal</span></div>
      <div style={{ display: 'flex', height: 'calc(100% - 24px)' }}>
        <div style={{ width: 28, background: '#252526', display: 'flex', flexDirection: 'column', gap: 6, padding: '6px 4px', alignItems: 'center' }}>{[true, false, false, false].map((a, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: a ? '#0078d4' : 'rgba(255,255,255,0.1)' }} />)}</div>
        <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>{[60, 85, 45, 70, 55].map((w, i) => <div key={i} style={{ height: 4, borderRadius: 1, width: `${w}%`, background: i % 2 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)' }} />)}</div>
      </div>
    </div>
  );
  if (type === 'sf') return (
    <div style={{ ...s, background: '#f4f6f9' }}>
      <div style={{ height: 24, background: '#032d60', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Salesforce — Pipeline</span></div>
      <div style={{ padding: 8, display: 'flex', gap: 6 }}>{[1, 2, 3].map(c => <div key={c} style={{ flex: 1 }}><div style={{ background: '#fff', borderRadius: 3, padding: 6, marginBottom: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}><div style={{ height: 3, borderRadius: 1, background: '#0176d3', width: '70%', marginBottom: 3 }} /><div style={{ height: 3, borderRadius: 1, background: '#ddd', width: '90%' }} /></div></div>)}</div>
    </div>
  );
  if (type === 'slack') return (
    <div style={{ ...s, background: '#1a1d21' }}>
      <div style={{ height: 22, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}># incident-response</span></div>
      <div style={{ display: 'flex', height: 'calc(100% - 22px)' }}>
        <div style={{ width: 50, background: '#19171d', padding: '6px 4px' }}>{[false, true, false, false].map((a, i) => <div key={i} style={{ height: 4, borderRadius: 1, background: a ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)', marginBottom: 4 }} />)}</div>
        <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>{['#e74c3c', '#3498db', '#2ecc71'].map((c, i) => <div key={i} style={{ display: 'flex', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }} /><div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><div style={{ height: 3, borderRadius: 1, background: 'rgba(255,255,255,0.06)', width: 80 + i * 10 }} /></div></div>)}</div>
      </div>
    </div>
  );
  if (type === 'ehr') return (
    <div style={{ ...s, background: '#f0f4f8' }}>
      <div style={{ height: 22, background: '#2d5f8a', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: 'rgba(255,255,255,0.9)' }}>Epic EHR — Patient Chart</span></div>
      <div style={{ padding: 8, display: 'flex', gap: 6 }}>
        <div style={{ width: '40%' }}>{[70, 50, 85].map((w, i) => <div key={i} style={{ background: '#fff', border: '1px solid #dce3eb', borderRadius: 2, padding: 4, marginBottom: 3 }}><div style={{ height: 3, borderRadius: 1, background: '#dce3eb', width: `${w}%` }} /></div>)}</div>
        <div style={{ flex: 1 }}><div style={{ background: '#fff', border: '1px solid #dce3eb', borderRadius: 2, padding: 4, height: '100%' }}><div style={{ height: 3, borderRadius: 1, background: '#dce3eb', width: '90%', marginBottom: 4 }} /><div style={{ height: 3, borderRadius: 1, background: '#dce3eb', width: '60%' }} /></div></div>
      </div>
    </div>
  );
  if (type === 'snow') return (
    <div style={{ ...s, background: '#293e40' }}>
      <div style={{ height: 22, borderBottom: '1px solid #3d5a5e', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: '#81b5a1' }}>ServiceNow — Incidents</span></div>
      <div style={{ padding: 8 }}>{[['p1', 60, 40], ['p1', 50, 35], ['p2', 70, 45], ['p2', 55, 50]].map((r, i) => <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 3, alignItems: 'center' }}><div style={{ width: 16, height: 4, borderRadius: 1, background: r[0] === 'p1' ? 'rgba(239,68,68,0.4)' : 'rgba(234,179,8,0.3)' }} /><div style={{ height: 4, borderRadius: 1, background: 'rgba(255,255,255,0.06)', width: `${r[1]}%`, flex: 1 }} /><div style={{ height: 4, borderRadius: 1, background: 'rgba(255,255,255,0.06)', width: `${r[2]}%`, flex: 1 }} /></div>)}</div>
    </div>
  );
  // jira
  return (
    <div style={{ ...s, background: '#1d2125' }}>
      <div style={{ height: 22, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ fontSize: 8, color: '#579dff' }}>Jira — Sprint Board</span></div>
      <div style={{ padding: 8, display: 'flex', gap: 6 }}>{[['#9fadbc', [70, 50]], ['#579dff', [80, 40]], ['#4bce97', [60]]].map(([color, bars], i) => <div key={i} style={{ flex: 1 }}><div style={{ height: 3, borderRadius: 1, background: color as string, marginBottom: 6 }} />{(bars as number[]).map((w, j) => <div key={j} style={{ background: '#22272b', borderRadius: 3, padding: 5, marginBottom: 4 }}><div style={{ height: 3, borderRadius: 1, background: 'rgba(255,255,255,0.08)', width: `${w}%` }} /></div>)}</div>)}</div>
    </div>
  );
}

// ─── Styles ───
const S = {
  // Morph container phases
  morphBase: {
    margin: '0 auto', borderRadius: 12, overflow: 'hidden' as const,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'max-width 1s cubic-bezier(0.22,1,0.36,1), background 1s cubic-bezier(0.22,1,0.36,1), border-color 0.6s ease, box-shadow 1s ease',
  },
  prompt: { maxWidth: 620, background: 'rgba(255,255,255,0.02)' },
  terminal: { maxWidth: 620, background: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 0 60px rgba(0,0,0,0.5)' },
  flash: { maxWidth: 620, background: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,79,0,0.6)', boxShadow: '0 0 80px rgba(255,79,0,0.15), inset 0 0 40px rgba(255,79,0,0.03)' },
  sim: { maxWidth: 1100, background: '#fff', borderColor: 'rgba(255,255,255,0.06)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' },

  // Terminal line colors
  lineColors: { req: '#6b7280', signal: '#FF4F00', result: '#9ca3af', compile: '#FF4F00', ready: '#22c55e', progress: 'transparent' },
  lineBold: { signal: true, compile: true },
} as const;

export default function ImmersiveSim() {
  const [phase, setPhase] = useState<'prompt' | 'terminal' | 'flash' | 'sim'>('prompt');
  const [visibleLines, setVisibleLines] = useState(0);
  const [progressComplete, setProgressComplete] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [showBelow, setShowBelow] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [nudge, setNudge] = useState('Read the email carefully. Note the specific failures Marcus cites — each one is a signal for your response.');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  }, []);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  const signals = replyText.length > 0 ? detectSignals(replyText) : null;

  function startEval() {
    setPhase('terminal');
    // Sequence terminal lines
    TERM_DELAYS.forEach((delay, i) => {
      later(() => {
        setVisibleLines(i + 1);
        if (TERM_LINES[i].cls === 'progress') {
          later(() => setProgressComplete(true), 100);
        }
      }, delay);
    });
    // Flash
    later(() => setPhase('flash'), 6800);
    // Morph to sim
    later(() => {
      setPhase('sim');
      later(() => setShowSim(true), 50);
      later(() => setShowBelow(true), 600);
    }, 7200);
  }

  function resetAll() {
    clearTimeouts();
    setPhase('prompt');
    setVisibleLines(0);
    setProgressComplete(false);
    setShowSim(false);
    setShowBelow(false);
    setSelectedEmail(null);
    setShowCoach(false);
    setReplyText('');
    setNudge('Read the email carefully. Note the specific failures Marcus cites — each one is a signal for your response.');
  }

  function selectEmail(id: string) {
    setSelectedEmail(id);
    if (id === 'marcus') {
      setTimeout(() => setShowCoach(true), 800);
    }
    if (id === 'jamie' && showCoach) {
      setNudge("Good — you're gathering context. Jamie's internal note confirms the SLA breach and NPS drop. Use these specifics when you respond to Marcus.");
    }
  }

  function handleReply(val: string) {
    setReplyText(val);
    if (val.length > 0) {
      const s = detectSignals(val);
      setNudge(s.nudge);
    }
  }

  const phaseStyle = phase === 'prompt' ? S.prompt : phase === 'terminal' ? S.terminal : phase === 'flash' ? S.flash : S.sim;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          The environment <span className="text-[#FF4F00]">is</span> the training.
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">No slides. No abstraction. Orin reconstructs the tools your people actually use.</p>
      </motion.div>

      {/* ── Morphing container ── */}
      <div style={{ ...S.morphBase, ...phaseStyle }}>

        {/* Phase 1: Prompt */}
        {phase === 'prompt' && (
          <div style={{ padding: '48px 40px', textAlign: 'center' }}>
            <div className="inline-block px-3.5 py-1 rounded text-[10px] font-mono tracking-[0.2em] uppercase bg-[#FF4F00]/[0.08] text-[#FF4F00] border border-[#FF4F00]/15 mb-6">
              Simulation Preview
            </div>
            <p className="text-xl font-semibold text-white mb-2">Your biggest enterprise client just sent an angry email.</p>
            <p className="text-gray-500 mb-8">Their renewal is in 30 days. What do you do?</p>
            <button
              type="button"
              onClick={startEval}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#FF4F00] text-black text-sm font-bold tracking-wider uppercase rounded-md shadow-[0_0_30px_rgba(255,79,0,0.2)] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all"
            >
              Enter the simulation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Phase 2: Terminal */}
        {(phase === 'terminal' || phase === 'flash') && (
          <div style={{ padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 300 }}>
            <div className="flex gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            {TERM_LINES.map((line, i) => {
              if (line.cls === 'progress') {
                return (
                  <div key={i} style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '12px 0', overflow: 'hidden', opacity: i < visibleLines ? 1 : 0, transition: 'opacity 0.3s' }}>
                    <div style={{ height: '100%', width: progressComplete ? '100%' : '0%', background: '#FF4F00', borderRadius: 2, transition: 'width 1.8s cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 0 8px rgba(255,79,0,0.4)' }} />
                  </div>
                );
              }
              const color = S.lineColors[line.cls as keyof typeof S.lineColors] || '#9ca3af';
              const bold = (S.lineBold as Record<string, boolean>)[line.cls];
              return (
                <div key={i} style={{ color, fontWeight: bold ? 700 : 400, marginBottom: 6, lineHeight: 1.5, opacity: i < visibleLines ? 1 : 0, transform: i < visibleLines ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
                  {line.cls === 'result' && <span style={{ color: '#22c55e' }}>{line.text.charAt(0)} </span>}
                  {line.cls === 'result' ? line.text.slice(2) : line.text}
                </div>
              );
            })}
          </div>
        )}

        {/* Phase 3: Outlook */}
        {phase === 'sim' && (
          <div style={{ opacity: showSim ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#f3f3f3', borderBottom: '1px solid #e0e0e0' }}>
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} /></div>
              <span style={{ fontSize: 12, color: '#666', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Outlook — Inbox — you@company.com</span>
              <div style={{ width: 54 }} />
            </div>

            {/* Body */}
            <div style={{ display: 'flex', minHeight: 460, position: 'relative' }}>
              {/* Sidebar */}
              <div className="hidden md:block" style={{ width: 200, background: '#f8f8f8', borderRight: '1px solid #e8e8e8', padding: '12px 0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {[{ label: 'Inbox', icon: '✉', active: true, badge: '4' }, { label: 'Flagged', icon: '★' }, { label: 'Sent', icon: '➤' }, { label: 'Drafts', icon: '📃' }, { label: 'Deleted', icon: '🗑' }].map(item => (
                  <div key={item.label} style={{ padding: '8px 16px', fontSize: 13, color: item.active ? '#1a73e8' : '#333', fontWeight: item.active ? 600 : 400, background: item.active ? '#e8f0fe' : 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, opacity: 0.6, width: 20, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                    {item.badge && <span style={{ marginLeft: 'auto', background: '#1a73e8', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.badge}</span>}
                  </div>
                ))}
              </div>

              {/* Email list */}
              <div style={{ width: 340, borderRight: '1px solid #e8e8e8', overflowY: 'auto', fontFamily: "'Segoe UI', system-ui, sans-serif", flexShrink: 0 }}>
                <div style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1a1a1a', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>Focused <span style={{ fontSize: 11, fontWeight: 400, color: '#1a73e8', cursor: 'pointer' }}>Filter</span></div>
                {[
                  { id: 'marcus', sender: 'Marcus Park', time: '10:14 AM', subject: 'This is completely unacceptable.', preview: "I've been a customer for 3 years and this is the worst experience...", tag: 'ESCALATION', tagCls: 'esc', unread: true, urgent: true },
                  { id: 'jamie', sender: 'Jamie Rodriguez', time: '9:48 AM', subject: 'NovaCorp renewal docs — ready for review', preview: "Hey, I've attached the renewal package. Note the 18% uplift...", tag: 'INTERNAL', tagCls: 'int' },
                  { id: 'karen', sender: 'Karen Liu', time: '10:02 AM', subject: 'RE: Q2 Kickoff Deck', preview: "Thanks for sending this over. I'll review with the team..." },
                  { id: 'aisha', sender: 'Aisha Dewan', time: 'Fri 4:31 PM', subject: 'Quick question about tier changes', preview: "Hi! Before we sign the renewal I wanted to clarify...", tag: 'RENEWAL 30D', tagCls: 'ren', unread: true },
                ].map(email => (
                  <div
                    key={email.id}
                    onClick={() => (email.id === 'marcus' || email.id === 'jamie') ? selectEmail(email.id) : undefined}
                    style={{
                      padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
                      cursor: (email.id === 'marcus' || email.id === 'jamie') ? 'pointer' : 'default',
                      background: selectedEmail === email.id ? '#e8f0fe' : 'transparent',
                      borderLeft: email.urgent ? '3px solid #d93025' : email.unread ? '3px solid #1a73e8' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 13, color: email.unread ? '#1a1a1a' : '#555', fontWeight: email.unread ? 600 : 400, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>{email.sender} <span style={{ fontSize: 11, color: '#999', fontWeight: 400 }}>{email.time}</span></div>
                    <div style={{ fontSize: 13, color: email.unread ? '#1a1a1a' : '#555', marginBottom: 2 }}>{email.subject}</div>
                    <div style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.preview}</div>
                    {email.tag && (
                      <span style={{
                        display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, marginTop: 4,
                        background: email.tagCls === 'esc' ? '#fce8e6' : email.tagCls === 'ren' ? '#fef7e0' : '#e8f0fe',
                        color: email.tagCls === 'esc' ? '#d93025' : email.tagCls === 'ren' ? '#e37400' : '#1a73e8',
                      }}>{email.tag}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Reading pane */}
              <div style={{ flex: 1, background: '#fafafa', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
                {!selectedEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#bbb', fontSize: 14, textAlign: 'center' }}>
                    <div><div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>✉</div>Select a message to read</div>
                  </div>
                )}
                {selectedEmail === 'marcus' && (
                  <div style={{ padding: 32 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>From: Marcus Park &lt;m.park@novacorp.com&gt;</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>Marcus Park</div>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>VP Operations, NovaCorp Industries · To: you@company.com</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #eee' }}>This is completely unacceptable.</div>
                    <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7 }}>
                      <p style={{ marginBottom: 14 }}>I've been a customer for three years.</p>
                      <p style={{ marginBottom: 14 }}>Last week we filed a P1 support ticket for a production outage that affected 200+ users on our team. Your SLA guarantees a 4-hour response. <strong>We waited 48 hours.</strong> Forty-eight.</p>
                      <p style={{ marginBottom: 14 }}>I then escalated directly to your CEO because my CSM was unreachable. I've since learned that our QBR was "cancelled" — I cancelled it because there was nothing productive to discuss when basic support commitments aren't being met.</p>
                      <p style={{ marginBottom: 14 }}>We have a renewal coming up. I'll be honest — I'm evaluating alternatives. If you can't demonstrate that this is being taken seriously, and I mean <em>structurally</em> seriously, not just an apology email — we're done.</p>
                      <p>— Marcus Park<br />VP Operations, NovaCorp Industries</p>
                    </div>
                  </div>
                )}
                {selectedEmail === 'jamie' && (
                  <div style={{ padding: 32 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>From: Jamie Rodriguez &lt;j.rodriguez@company.com&gt;</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>Jamie Rodriguez</div>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>Internal · To: you@company.com</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #eee' }}>NovaCorp renewal docs — ready for review</div>
                    <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7 }}>
                      <p style={{ marginBottom: 14 }}>Hey,</p>
                      <p style={{ marginBottom: 14 }}>I've attached the renewal package for NovaCorp. A few things to flag:</p>
                      <p style={{ marginBottom: 14 }}>• We're proposing an <strong>18% uplift</strong> based on expanded seat count<br />• Their current ARR is <strong>$340K</strong><br />• Contract expires in <strong>30 days</strong><br />• NPS dropped from 78 to 62 last quarter</p>
                      <p style={{ marginBottom: 14 }}>Given the recent support issues, you may want to have a conversation with Marcus before sending this. Just a heads up.</p>
                      <p>— Jamie</p>
                    </div>
                  </div>
                )}

                {/* Coach overlay */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 300, height: '100%',
                  background: 'rgba(3,3,3,0.97)', borderLeft: '1px solid rgba(255,79,0,0.15)',
                  backdropFilter: 'blur(12px)', padding: 24, overflowY: 'auto', zIndex: 10,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transform: showCoach ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#FF4F00] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#FF4F00]">Orin Coach</span>
                  </div>

                  {[
                    { label: 'Empathy Signal', color: '#22c55e', value: signals?.empathy ?? 0 },
                    { label: 'Ownership Signal', color: '#eab308', value: signals?.own ?? 0 },
                    { label: 'Resolution Path', color: '#3b82f6', value: signals?.res ?? 0 },
                  ].map(meter => (
                    <div key={meter.label} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', color: meter.color, marginBottom: 8 }}>● {meter.label}</div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${meter.value}%`, background: meter.color, borderRadius: 2, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{meter.label === 'Empathy Signal' ? 'Acknowledged frustration' : meter.label === 'Ownership Signal' ? 'Took responsibility' : 'Concrete next steps'}</span>
                        <span>{signals ? `${meter.value}%` : 'Waiting...'}</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: 14, borderRadius: 6, border: '1px solid rgba(255,79,0,0.15)', background: 'rgba(255,79,0,0.03)', marginTop: 20 }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#FF4F00', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>▵ Mentor Nudge</div>
                    <div style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.5 }}>{nudge}</div>
                  </div>

                  <div style={{ marginTop: 20, padding: 14, borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>◆ Account Intel</div>
                    {['P1 SLA breached — 48hr on a 4hr commitment', 'VP escalated directly to CEO', 'QBR cancelled — client disengaged', '$340K ARR at risk · 30 days to renewal'].map(item => (
                      <div key={item} style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, display: 'flex', gap: 6 }}>
                        <span style={{ color: '#ef4444' }}>●</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reply bar */}
            {selectedEmail === 'marcus' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderTop: '1px solid #eee', background: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => handleReply(e.target.value)}
                  placeholder="Draft your response to Marcus..."
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#333' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Below: gallery + analytics ── */}
      <div style={{ opacity: showBelow ? 1 : 0, transform: showBelow ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s', pointerEvents: showBelow ? 'all' : 'none' }}>
        {/* Reset */}
        <div className="text-center mt-10">
          <button type="button" onClick={resetAll} className="px-6 py-2.5 text-xs font-mono tracking-wider uppercase text-gray-500 border border-white/10 rounded-md hover:border-white/30 hover:text-white transition-all">
            ← Reset Simulation
          </button>
        </div>

        {/* Gallery */}
        <div className="text-center mt-20 mb-10">
          <h3 className="text-xl font-bold text-white mb-2">Any tool. Any workflow. Any industry.</h3>
          <p className="text-sm text-gray-500">Orin reconstructs the environment your learners already work in.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENVIRONMENTS.map(env => (
            <div key={env.type} className="border border-white/[0.06] rounded-lg overflow-hidden bg-white/[0.02] hover:border-[#FF4F00]/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all">
              <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}><MiniApp type={env.type} /></div>
              <div className="p-4">
                <div className="text-sm font-semibold text-white mb-1">{env.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{env.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics */}
        <div className="mt-20 p-8 border border-white/[0.06] rounded-lg bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white mb-1.5">Then the data flows back.</h3>
          <p className="text-sm text-gray-500 mb-6">Every decision, hesitation, and recovery is captured. Your manager doesn't get a completion checkbox — they get a behavioral profile mapped to real work outcomes.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: 'B+', color: '#22c55e', label: 'Empathy\nCalibration' },
              { val: 'C', color: '#eab308', label: 'Ownership\nUnder Pressure' },
              { val: '2.4s', color: '#3b82f6', label: 'Avg. Hesitation\nBefore Response' },
              { val: '$340K', color: '#FF4F00', label: 'Account Value\nAt Risk' },
            ].map(card => (
              <div key={card.val} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-md text-center">
                <div style={{ fontSize: 24, fontWeight: 800, color: card.color, marginBottom: 4 }}>{card.val}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 leading-snug whitespace-pre-line">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
