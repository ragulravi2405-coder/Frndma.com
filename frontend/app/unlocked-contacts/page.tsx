'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Unlock, MessageSquare, ArrowLeft, Phone, Compass } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function UnlockedContactsPage() {
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnlocks();
  }, []);

  const loadUnlocks = async () => {
    setLoading(true);
    const res = await fetchApi('/unlocks/my-unlocks');
    if (res.success && res.data) {
      setUnlocks(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Your Contacts</span>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-1">
            Unlocked Contacts ({unlocks.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Verified WhatsApp and phone numbers you have unlocked with payment.
          </p>
        </div>

        <Link
          href="/discover"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
        >
          <Compass className="w-4 h-4" />
          <span>Browse More</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : unlocks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unlocks.map((u) => (
            <div
              key={u.id}
              className="p-5 rounded-3xl glass-card border border-emerald-500/30 bg-[#120a17] flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    u.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={u.displayName}
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{u.displayName}</h4>
                  <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">{u.contactNumber}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">📍 {u.city || 'Verified'}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/91${u.contactNumber}?text=Hi%20${encodeURIComponent(u.displayName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Unlock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Unlocked Contacts</h3>
          <p className="text-xs text-zinc-400 mb-6">
            When you unlock any girl&apos;s contact details on the Discover page, they will be permanently accessible here.
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Discover Girls Profiles
          </Link>
        </div>
      )}
    </div>
  );
}
