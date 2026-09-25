'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    const res = await fetchApi('/matches');
    if (res.success && res.data) {
      setMatches(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Connections</span>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Your Matches ({matches.length})
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Mutual connections where both of you liked each other. Start a private conversation!
        </p>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((item) => (
            <motion.div
              key={item.matchId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl glass-card border border-primary/20 bg-[#120a17] hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/30 shrink-0">
                  <img
                    src={item.user.avatarUrl}
                    alt={item.user.displayName}
                    className="w-full h-full object-cover"
                  />
                  {item.user.isOnline && (
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#120a17]" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    {item.user.displayName}, {item.user.age || 21}
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{item.user.city || 'Chennai'}</span>
                  </p>
                </div>
              </div>

              {item.lastMessage ? (
                <p className="text-xs text-zinc-400 line-clamp-1 italic mb-4">
                  &quot;{item.lastMessage}&quot;
                </p>
              ) : (
                <p className="text-xs text-pink-300 font-medium mb-4 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>You&apos;re connected! Say hello.</span>
                </p>
              )}

              <Link
                href={`/messages/${item.matchId}`}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Chat</span>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Matches Yet</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Keep discovering and liking profiles. When someone likes you back, they will appear here!
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Explore Discover
          </Link>
        </div>
      )}
    </div>
  );
}
