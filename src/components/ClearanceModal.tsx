import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrinLogo from './OrinLogo';

const ROLES = [
  { id: 'architect', label: 'Learning Architect' },
  { id: 'director', label: 'L&D Director' },
  { id: 'executive', label: 'Executive Sponsor' },
  { id: 'engineering', label: 'Engineering / Dev' },
  { id: 'other', label: 'Other' },
];

type Step = 'classify' | 'identify' | 'intent' | 'confirmed';

export default function ClearanceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && <ClearanceModalInner onClose={onClose} />}
    </AnimatePresence>
  );
}

function ClearanceModalInner({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('classify');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [intent, setIntent] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const intentRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus fields
  useEffect(() => {
    if (step === 'identify') setTimeout(() => nameRef.current?.focus(), 300);
    if (step === 'intent') setTimeout(() => intentRef.current?.focus(), 300);
  }, [step]);

  const handleSubmit = async () => {
    setStep('confirmed');
    try {
      await fetch('/api/clearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, org, role, intent }),
      });
    } catch {
      // Silently fail — the user already sees the confirmation.
      // Better UX than blocking on a network error.
    }
  };

  return (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[101] bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden font-mono"
          >
            {/* Scan line accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FF4F00] to-transparent opacity-60" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF4F00] animate-pulse" />
                <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                  {step === 'confirmed' ? 'Clearance Logged' : 'Clearance Request'}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-8 min-h-[320px]">
              <AnimatePresence mode="wait">

                {/* STEP 1: Classification */}
                {step === 'classify' && (
                  <motion.div
                    key="classify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#FF4F00] text-xs tracking-[0.2em] uppercase mb-2">
                      Step 01 / Classification
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Identify your designation.
                    </p>
                    <div className="flex flex-col gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setRole(r.label);
                            setStep('identify');
                          }}
                          className={`text-left px-4 py-3 border rounded text-sm transition-all duration-200
                            ${role === r.label
                              ? 'border-[#FF4F00]/60 text-[#FF4F00] bg-[#FF4F00]/5'
                              : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200 hover:bg-white/[0.02]'
                            }`}
                        >
                          <span className="text-gray-600 mr-3">&gt;</span>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Identification */}
                {step === 'identify' && (
                  <motion.div
                    key="identify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#FF4F00] text-xs tracking-[0.2em] uppercase mb-2">
                      Step 02 / Identification
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Authorization requires identity verification.
                    </p>
                    <div className="flex flex-col gap-4">
                      <TerminalInput
                        ref={nameRef}
                        label="Name"
                        value={name}
                        onChange={setName}
                        placeholder="full name"
                      />
                      <TerminalInput
                        label="Email"
                        value={email}
                        onChange={setEmail}
                        placeholder="work email"
                        type="email"
                      />
                      <TerminalInput
                        label="Org"
                        value={org}
                        onChange={setOrg}
                        placeholder="organization"
                      />
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep('classify')}
                        className="px-4 py-2 text-xs text-gray-500 border border-white/5 rounded hover:border-white/20 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('intent')}
                        disabled={!name || !email}
                        className="px-6 py-2 text-xs text-black bg-[#FF4F00] rounded font-bold tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Intent */}
                {step === 'intent' && (
                  <motion.div
                    key="intent"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#FF4F00] text-xs tracking-[0.2em] uppercase mb-2">
                      Step 03 / Intent
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      State your purpose. What are you trying to build?
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-600 text-sm">&gt;</span>
                      <textarea
                        ref={intentRef}
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        placeholder="describe your learning challenge..."
                        rows={4}
                        className="w-full bg-transparent border border-white/10 rounded px-4 pl-8 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:border-[#FF4F00]/40 focus:outline-none resize-none transition-colors"
                      />
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep('identify')}
                        className="px-4 py-2 text-xs text-gray-500 border border-white/5 rounded hover:border-white/20 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2 text-xs text-black bg-[#FF4F00] rounded font-bold tracking-wider uppercase hover:bg-white transition-colors"
                      >
                        Submit Request
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Confirmed */}
                {step === 'confirmed' && (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <OrinLogo variant="mark" size={48} animate />
                    <div className="mt-8 space-y-3 text-sm text-gray-400">
                      <p className="text-[#FF4F00] font-bold tracking-wider">
                        CLEARANCE REQUEST LOGGED.
                      </p>
                      <div className="text-left inline-block space-y-1 mt-4">
                        <p><span className="text-gray-600">DESIGNATION:</span> <span className="text-gray-200">{name}</span></p>
                        <p><span className="text-gray-600">CLASSIFICATION:</span> <span className="text-gray-200">{role}</span></p>
                        {org && <p><span className="text-gray-600">SECTOR:</span> <span className="text-gray-200">{org}</span></p>}
                      </div>
                      <div className="h-[1px] bg-white/5 my-6 w-full" />
                      <p className="text-gray-500 text-xs">
                        RESPONSE ETA: 24 HOURS.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-8 px-6 py-2 text-xs text-gray-400 border border-white/10 rounded hover:border-[#FF4F00]/40 hover:text-[#FF4F00] transition-colors"
                    >
                      Close Terminal
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer status bar */}
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 tracking-wider">
              <span>ORIN // LXDS</span>
              <span>
                {step === 'classify' && '01/03'}
                {step === 'identify' && '02/03'}
                {step === 'intent' && '03/03'}
                {step === 'confirmed' && 'COMPLETE'}
              </span>
            </div>
          </motion.div>
        </>
  );
}

/** Terminal-styled input field with > prefix */
const TerminalInput = forwardRef<
  HTMLInputElement,
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }
>(({ label, value, onChange, placeholder, type = 'text' }, ref) => (
  <div>
    <label className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mb-1 block">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">&gt;</span>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-white/10 rounded px-4 pl-8 py-2.5 text-sm text-gray-200 placeholder:text-gray-700 focus:border-[#FF4F00]/40 focus:outline-none transition-colors"
      />
    </div>
  </div>
));
TerminalInput.displayName = 'TerminalInput';
