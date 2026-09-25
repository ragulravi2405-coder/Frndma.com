'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, MessageCircle, Crown } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { MatchModal } from '@/components/MatchModal';

export default function LikesPage() {
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<{ isOpen: boolean; matchId: string; user: any }>({
    isOpen: false,
    matchId: '',
    user: null,
  });

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    const res = await fetchApi('/likes');
    if (res.success && res.data) {
      setLikes(res.data);
    }
    setLoading(false);
  };

  const handleLikeBack = async (likedItem: any) => {
    const res = await fetchApi('/likes', {
      method: 'POST',
      body: JSON.stringify({ targetUserId: likedItem.userId }),
    });

    if (res.success && res.data?.isMatch) {
      setMatchData({
        isOpen: true,
        matchId: res.data.matchId,
        user: likedItem,
      });
      loadLikes();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Interest</span>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Likes Received ({likes.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            People who are interested in connecting with you. Like them back to match!
          </p>
        </div>

        <Link
          href="/pricing"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-500/50 transition-all"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Unlock Priority Visibility</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : likes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likes.map((like) => (
            <motion.div
              key={like.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-card border border-white/10 bg-[#120a17] overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={
                    like.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={like.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold font-heading">
                    {like.displayName}, {like.age || 20}
                  </h3>
                  <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{like.city || 'Chennai'}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-zinc-400 italic line-clamp-2 mb-4">
                  &quot;{like.bio || 'Looking forward to meeting someone genuine.'}&quot;
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${like.username}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-xs font-semibold text-zinc-300"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleLikeBack(like)}
                    className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Match</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Likes Yet</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Make sure your profile is complete with photos and interests to attract genuine adult connections.
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Start Discovering People
          </Link>
        </div>
      )}

      {/* Match Celebration Modal */}
      {matchData.user && (
        <MatchModal
          isOpen={matchData.isOpen}
          onClose={() => setMatchData({ isOpen: false, matchId: '', user: null })}
          matchedUserName={matchData.user.displayName}
          matchedUserAvatar={matchData.user.avatarUrl}
          matchId={matchData.matchId}
        />
      )}
    </div>
  );
}
