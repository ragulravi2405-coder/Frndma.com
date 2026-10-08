'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Unlock, MessageSquare, ArrowLeft, Phone, Compass, Sparkles, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pRes, uRes, cRes] = await Promise.all([
      fetchApi('/payments/history'),
      fetchApi('/unlocks/my-unlocks'),
      fetchApi('/unlocks/my-credits'),
    ]);

    if (pRes.success && pRes.data) setPayments(pRes.data);
    if (uRes.success && uRes.data) setUnlocks(uRes.data);
    if (cRes.success && cRes.data) setCredits(cRes.data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      <div className="flex items-center justify-between mb-6">
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

      {/* Credit Balance Notice */}
      {credits && credits.remainingCredits > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">
                You have <span className="text-emerald-400 font-extrabold text-base">{credits.remainingCredits}</span> Contact Unlock Credits remaining!
              </p>
              <p className="text-[11px] text-zinc-300">
                You can use these credits to unlock contacts on the Discover page at zero extra cost.
              </p>
            </div>
          </div>
          <Link
            href="/discover"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors"
          >
            Use Credit
          </Link>
        </div>
      )}

      {/* Direct Meeting & Trust Safety Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs text-zinc-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">🤝 Direct Meeting & Video Call Included</p>
          <p className="text-[11px] leading-relaxed">
            Direct meeting and video call do not require any additional payment from Frndma. If anyone asks you for extra money claiming it is required for meeting or video call, please report them immediately to Frndma Support at{' '}
            <a href="mailto:frndma.com@gmail.com" className="text-pink-400 hover:underline font-bold inline-flex items-center gap-1">
              <Mail className="w-3 h-3" />
              frndma.com@gmail.com
            </a>
          </p>
        </div>
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
            <span>Payment & Transaction History</span>
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
                      Ref: {p.notes?.utr ? `UTR: ${p.notes.utr}` : p.razorpayOrderId}
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
