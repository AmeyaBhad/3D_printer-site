import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { api } from '../api';

const INITIAL_MESSAGE = {
    from: 'bot',
    text: "Hi! I'm Dimi, your Printed Dimensions assistant. Ask me about products, prices, shipping, or anything else.",
    suggestions: ['Show me products', 'Shipping info', 'Custom orders', 'Contact'],
};

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, thinking, open]);

    const send = useCallback(async (text) => {
        const trimmed = (text ?? '').trim();
        if (!trimmed || thinking) return;
        setMessages(prev => [...prev, { from: 'user', text: trimmed }]);
        setInput('');
        setThinking(true);
        try {
            const res = await api.chat(trimmed);
            setMessages(prev => [...prev, { from: 'bot', text: res.reply, suggestions: res.suggestions }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                from: 'bot',
                text: `Sorry, I hit an error: ${err.message || 'unknown'}. Try again in a moment.`,
            }]);
        } finally {
            setThinking(false);
        }
    }, [thinking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        send(input);
    };

    return (
        <>
            {/* Floating button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setOpen(o => !o)}
                aria-label={open ? 'Close chat' : 'Open chat'}
                className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/40 flex items-center justify-center transition-colors"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <X size={26} />
                        </motion.span>
                    ) : (
                        <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <MessageCircle size={26} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="fixed bottom-24 right-6 z-[90] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold leading-tight">Dimi</p>
                                <p className="text-amber-100 text-xs">Usually replies instantly</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/40">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}
                                >
                                    <div
                                        className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                                            m.from === 'user'
                                                ? 'bg-amber-500 text-white rounded-br-sm'
                                                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                                        }`}
                                    >
                                        {m.text}
                                        {m.from === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {m.suggestions.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => send(s)}
                                                        className="text-xs bg-gray-800 hover:bg-gray-600 text-amber-300 px-2 py-1 rounded-full border border-gray-600 transition-colors"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {thinking && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-700 px-3 py-2 rounded-lg rounded-bl-sm">
                                        <div className="flex items-center gap-1">
                                            {[0, 0.15, 0.3].map((delay, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }}
                                                    className="w-1.5 h-1.5 rounded-full bg-amber-300"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-gray-700 bg-gray-800">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                maxLength={500}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!input.trim() || thinking}
                                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                                aria-label="Send"
                            >
                                <Send size={18} />
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
