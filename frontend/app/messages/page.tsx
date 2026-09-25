'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Search, CheckCheck, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';

export default function MessagesListPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'matches' | 'unread'>('all');
  const [search, setSearch] = useState('');

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

  const filteredMatches = matches.filter((m) => {
    const matchesSearch =
      m.user.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.user.username.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Inbox</span>
          <h1 className="text-3xl font-extrabold text-white font-heading">Messages</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#140c1c] border border-white/5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filter === 'all' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('matches')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filter === 'matches' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
        />
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-3">
          {filteredMatches.map((m) => (
            <Link
              key={m.matchId}
              href={`/messages/${m.matchId}`}
              className="p-4 rounded-2xl glass-card border border-white/5 hover:border-primary/40 bg-[#120a17] flex items-center justify-between gap-4 transition-all group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-primary/30 shrink-0">
                  <img
                    src={m.user.avatarUrl}
                    alt={m.user.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {m.user.isOnline && (
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#120a17]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {m.user.displayName}
                    </h3>
                    <span className="text-[11px] text-zinc-500">@{m.user.username}</span>
                  </div>

                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {m.lastMessage || 'Say hello to start the conversation! ❤️'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 text-right">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(m.lastMessageAt || new Date())}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-pink-300">
                  Chat
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Messages Yet</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Private conversations are unlocked when you mutually match with other profiles.
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Discover People
          </Link>
        </div>
      )}
    </div>
  );
}
