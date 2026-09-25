'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Unlock,
  Crown,
  User,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [unlocksCount, setUnlocksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const [meRes, matchesRes, likesRes, unlocksRes] = await Promise.all([
      fetchApi('/auth/me'),
      fetchApi('/matches'),
      fetchApi('/likes'),
      fetchApi('/unlocks/my-unlocks'),
    ]);

    if (meRes.success && meRes.data) {
      setUser(meRes.data.user);
      setProfile(meRes.data.profile);
    }
    if (matchesRes.success && matchesRes.data) setMatchesCount(matchesRes.data.length);
    if (likesRes.success && likesRes.data) setLikesCount(likesRes.data.length);
    if (unlocksRes.success && unlocksRes.data) setUnlocksCount(unlocksRes.data.length);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl glass-card border border-primary/30 bg-gradient-to-r from-[#210c28] via-[#140a1c] to-[#100717] mb-8 shadow-glow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Dashboard</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
              Welcome back, {profile?.displayName || user?.username}!
            </h1>
            <p className="text-xs text-zinc-300 mt-2 max-w-lg leading-relaxed">
              Your adult connection hub. Explore discovered profiles, respond to likes, and initiate safe conversations.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-6 py-3 rounded-full text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Discover People</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/likes"
          className="p-5 rounded-3xl glass-card border border-white/5 hover:border-primary/40 bg-[#120a17] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-extrabold text-white font-heading">{likesCount}</span>
          <span className="text-xs text-zinc-400 block mt-0.5">Likes Received</span>
        </Link>

        <Link
          href="/matches"
          className="p-5 rounded-3xl glass-card border border-white/5 hover:border-pink-500/40 bg-[#120a17] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-white font-heading">{matchesCount}</span>
          <span className="text-xs text-zinc-400 block mt-0.5">Mutual Matches</span>
        </Link>

        <Link
          href="/payments"
          className="p-5 rounded-3xl glass-card border border-white/5 hover:border-emerald-500/40 bg-[#120a17] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Unlock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-white font-heading">{unlocksCount}</span>
          <span className="text-xs text-zinc-400 block mt-0.5">Unlocked Contacts</span>
        </Link>

        <Link
          href="/pricing"
          className="p-5 rounded-3xl glass-card border border-white/5 hover:border-amber-500/40 bg-[#120a17] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Crown className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold text-white font-heading">Free</span>
          <span className="text-xs text-zinc-400 block mt-0.5">Membership Plan</span>
        </Link>
      </div>

      {/* Profile Completeness & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
          <h3 className="text-base font-bold text-white mb-2">Profile Status</h3>
          <p className="text-xs text-zinc-400 mb-4">
            A complete profile with interests and bio receives up to 4x more mutual likes!
          </p>
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden mb-4">
            <div className="bg-primary h-full w-[80%] rounded-full shadow-glow-sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">80% Completed</span>
            <Link href="/profile/edit" className="text-primary font-bold hover:underline">
              Complete Profile →
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Contact Sharing</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Your contact sharing preference is currently{' '}
              <strong className={profile?.contactSharing ? 'text-emerald-400' : 'text-zinc-400'}>
                {profile?.contactSharing ? 'ENABLED' : 'DISABLED'}
              </strong>
              .
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold text-center block"
          >
            Manage Privacy Preferences
          </Link>
        </div>
      </div>
    </div>
  );
}
