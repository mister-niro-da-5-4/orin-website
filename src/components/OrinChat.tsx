import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrinLogo from './OrinLogo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function OrinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || 'Signal layer unavailable. Try again.',
      };
      setMessages([...updated, assistantMsg]);
    } catch {
      setMessages([
        ...updated,
        { role: 'assistant', content: 'Connection to Signal interrupted. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full flex items-center justify-center border border-[#FF4F00]/40 bg-black/90 backdrop-blur-sm shadow-[0_0_30px_rgba(255,79,0,0.15)]"
        aria-label="Open Orin chat"
      >
        {open ? (
          <span className="text-[#FF4F00] text-lg font-mono">×</span>
        ) : (
          <OrinLogo variant="mark" size={28} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[90] w-[380px] max-h-[520px] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden font-mono shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#FF4F00] animate-pulse" />
              <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                Signal // Orin Intelligence Layer
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[380px]">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-xs text-gray-500 space-y-3">
                  <p className="text-[#FF4F00] font-bold">SIGNAL ACTIVE.</p>
                  <p>Describe a learning challenge. I'll show you how Orin architects the solution.</p>
                  <div className="space-y-1 text-gray-600">
                    <p className="text-[10px] tracking-wider">TRY:</p>
                    <button
                      type="button"
                      onClick={() => { setInput('I need a compliance training for 500 engineers'); }}
                      className="block text-left text-gray-500 hover:text-[#FF4F00] transition-colors"
                    >
                      → "I need a compliance training for 500 engineers"
                    </button>
                    <button
                      type="button"
                      onClick={() => { setInput('How is Orin different from Articulate?'); }}
                      className="block text-left text-gray-500 hover:text-[#FF4F00] transition-colors"
                    >
                      → "How is Orin different from Articulate?"
                    </button>
                    <button
                      type="button"
                      onClick={() => { setInput('My stakeholder wants a 1-hour PowerPoint converted to eLearning'); }}
                      className="block text-left text-gray-500 hover:text-[#FF4F00] transition-colors"
                    >
                      → "Convert a 1-hour PowerPoint to eLearning"
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                  {msg.role === 'user' ? (
                    <div className="inline-block text-left max-w-[85%] px-3 py-2 rounded-lg bg-white/5 text-gray-300 text-xs">
                      <span className="text-gray-600 text-[10px] block mb-1">YOU</span>
                      {msg.content}
                    </div>
                  ) : (
                    <div className="max-w-[95%] text-xs text-gray-300 leading-relaxed">
                      <span className="text-[#FF4F00] text-[10px] font-bold block mb-1">▌ ORIN</span>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="text-xs">
                  <span className="text-[#FF4F00] text-[10px] font-bold block mb-1">▌ ORIN</span>
                  <span className="text-gray-500 animate-pulse">Processing through Signal layer...</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/5 p-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm shrink-0">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  placeholder="Describe your challenge..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="text-[10px] tracking-wider text-[#FF4F00] font-bold disabled:opacity-30 hover:text-white transition-colors"
                >
                  SEND
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 text-[9px] text-gray-700 tracking-wider flex justify-between">
              <span>ORIN // LXDS</span>
              <span>SIGNAL LAYER</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
