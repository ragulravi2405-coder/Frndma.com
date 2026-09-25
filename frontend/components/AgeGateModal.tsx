'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Heart } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const isConfirmed = localStorage.getItem('frndma_18_confirmed');
    if (!isConfirmed) {
      setShowGate(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('frndma_18_confirmed', 'true');
    setShowGate(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showGate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl glass-card border border-primary/40 bg-[#100916] text-center shadow-glow-lg text-white"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-glow-sm">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider uppercase text-pink-300 bg-pink-950/60 rounded-full border border-pink-500/30">
            Age Verification Required
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-1">
            Welcome to Frndma
          </h2>

          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Frndma is an adult-only dating and social connection platform. By entering, you certify that you are at least <strong>18 years old</strong> and agree to our safe community guidelines.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm transition-all"
            >
              I am 18 or older — Enter
            </button>
            <button
              onClick={handleDecline}
              className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              I am under 18 — Exit
            </button>
          </div>

          <p className="mt-5 text-[11px] text-zinc-500">
            We value your privacy. We never expose your exact home address or private identity without your consent.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
