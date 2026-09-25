'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserAvatar?: string;
  matchedUserName: string;
  matchedUserAvatar: string;
  matchId: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  currentUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  matchedUserName,
  matchedUserAvatar,
  matchId,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger romantic confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff2d78', '#f43f5e', '#ff70a5', '#ffffff'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-md p-8 text-center rounded-3xl glass-card border border-primary/40 bg-gradient-to-b from-[#210c26] to-[#0d0714] shadow-glow-lg overflow-hidden"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider uppercase text-pink-300 bg-pink-900/40 rounded-full border border-pink-500/30">
              Mutual Connection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              It&apos;s a Match! ❤️
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              You and <span className="font-semibold text-primary-light">{matchedUserName}</span> liked each other.
            </p>
          </motion.div>

          {/* Dual Avatars with Neon Heart in between */}
          <div className="relative flex items-center justify-center gap-4 my-8">
            {/* User Avatar */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary shadow-glow-md"
            >
              <img
                src={currentUserAvatar}
                alt="Your Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Glowing Center Heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-glow-lg"
            >
              <Heart className="w-6 h-6 fill-current" />
            </motion.div>

            {/* Matched Avatar */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-pink-400 shadow-glow-md"
            >
              <img
                src={matchedUserAvatar}
                alt={matchedUserName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 mt-6">
            <Link
              href={`/messages/${matchId}`}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start Chatting →</span>
            </Link>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Keep Discovering
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
