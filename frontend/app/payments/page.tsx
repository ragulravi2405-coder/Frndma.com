'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Unlock, MessageSquare, ArrowLeft, Phone, Compass } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pRes, uRes] = await Promise.all([
      fetchApi('/payments/history'),
      fetchApi('/unlocks/my-unlocks'),
    ]);

    if (pRes.success && pRes.data) setPayments(pRes.data);
    if (uRes.success && uRes.data) setUnlocks(uRes.data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Access & Billing</span>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Unlocked Contacts & Receipts</h1>
        </div>

        <Link
          href="/discover"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
        >
          <Compass className="w-4 h-4" />
          <span>Browse More</span>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Unlocked Contacts Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5 text-emerald-400" />
            <span>Unlocked Phone & WhatsApp ({unlocks.length})</span>
          </h2>

          {unlocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlocks.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-3xl glass-card border border-emerald-500/30 bg-[#120a17] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={u.displayName}
                      className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{u.displayName}</h4>
                      <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{u.contactNumber}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">📍 {u.city || 'Verified'}</p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/91${u.contactNumber}?text=Hi%20${encodeURIComponent(u.displayName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-card border border-white/5 bg-[#120a17] text-center text-xs text-zinc-400">
              No unlocked contacts yet. Click &quot;Unlock Contact&quot; on any girl&apos;s profile to view their verified WhatsApp number.
            </div>
          )}
        </div>

        {/* Payment History Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Razorpay Transaction History</span>
          </h2>

          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-2xl glass-card border border-white/5 bg-[#120a17] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white capitalize block">
                      {p.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Order: {p.razorpayOrderId}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-white block">₹{p.amount}</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'captured'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl glass-card border border-white/5 bg-[#120a17] text-center text-xs text-zinc-400">
              No transactions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
