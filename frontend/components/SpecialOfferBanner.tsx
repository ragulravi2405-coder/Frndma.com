'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Users,
  Video,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  AlertTriangle,
  Mail,
  RefreshCw,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const SpecialOfferBanner: React.FC = () => {
  const router = useRouter();

  // Offer config from backend (persistent 24-hr countdown)
  const [offer, setOffer] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isExpired: boolean;
  }>({
    hours: '23',
    minutes: '59',
    seconds: '59',
    isExpired: false,
  });

  // User auth and credits
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<{
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
  }>({
    totalCredits: 0,
    usedCredits: 0,
    remainingCredits: 0,
  });

  // Payment states
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'cancelled' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Load offer status and user credits on mount
  useEffect(() => {
    loadOfferAndUserData();
  }, []);

  const loadOfferAndUserData = async () => {
    try {
      // 1. Fetch persistent offer status
      const offerRes = await fetchApi('/payments/offer-status');
      if (offerRes.success && offerRes.data) {
        setOffer(offerRes.data);
      }

      // 2. Fetch current user
      const userRes = await fetchApi('/auth/me');
      if (userRes.success && userRes.data?.user) {
        setUser(userRes.data.user);

        // 3. Fetch user's credits
        const creditsRes = await fetchApi('/unlocks/my-credits');
        if (creditsRes.success && creditsRes.data) {
          setCredits(creditsRes.data);
        }
      }
    } catch (err) {
      console.error('Error loading offer data:', err);
    }
  };

  // 2. Continuous real-time countdown timer derived from backend expiresAt
  useEffect(() => {
    if (!offer?.expiresAt) return;

    const targetTime = new Date(offer.expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isExpired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [offer?.expiresAt]);

  // 3. Handle ₹999 CTA click
  const handleUnlockOfferClick = () => {
    // A. Check authentication
    if (!user) {
      router.push('/login?redirect=/');
      return;
    }

    // B. Check expiry
    if (timeLeft.isExpired) {
      setPaymentState('error');
      setStatusMessage('This ₹999 limited-time offer has expired.');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const hasActiveCredits = credits.remainingCredits > 0;

  return (
    <section className="relative my-8 sm:my-14 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="relative rounded-3xl overflow-hidden glass-card border border-primary/40 bg-gradient-to-br from-[#1c0d24] via-[#120a17] to-[#0a0710] p-6 sm:p-10 shadow-glow-lg">
        {/* Subtle Ambient Glowing Spheres */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Offer Details & Benefits */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Offer Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-pink-300 text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>🔥 LIMITED TIME OFFER</span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
                Unlock 3 Verified Contacts for <span className="text-gradient">₹999</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                Connect directly with 3 genuine verified profiles. Enjoy direct meeting & video call without any hidden fees.
              </p>
            </div>

            {/* Key Inclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">3 Contact Unlocks</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">100% Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">Direct Meeting Allowed</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">Video Call Allowed</span>
              </div>
            </div>

            {/* Direct Meeting & Trust Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span>🤝 Direct Meeting & Video Call Included</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Direct meeting and video call do not require any additional payment from Frndma. Communicate and arrange meetings mutually & safely.
              </p>
            </div>

            {/* Anti-Scam Notice */}
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/25 flex items-start gap-2.5 text-[11px] text-zinc-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-semibold">⚠️ Safety Notice: </strong>
                Frndma does not ask users to make additional payments for direct meetings or video calls. If anyone asks you for extra money claiming it is required to unlock a meeting, video call, or contact, please report them.
              </div>
            </div>
          </div>

          {/* Right Column: Timer & Pricing Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl glass-card border border-white/15 bg-black/60 backdrop-blur-xl shadow-glow-md text-center space-y-5">
              {/* Timer Header */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {timeLeft.isExpired ? 'Offer Status' : '24-Hour Special Offer Ends In'}
                </span>

                {/* Countdown Timer Display */}
                {!timeLeft.isExpired ? (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-white/10 px-3 py-2 rounded-2xl border border-white/10 min-w-[58px]">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[9px] uppercase font-semibold text-zinc-400 mt-1">HOURS</span>
                    </div>
                    <span className="text-2xl font-bold text-primary pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-white/10 px-3 py-2 rounded-2xl border border-white/10 min-w-[58px]">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[9px] uppercase font-semibold text-zinc-400 mt-1">MINUTES</span>
                    </div>
                    <span className="text-2xl font-bold text-primary pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-white/10 px-3 py-2 rounded-2xl border border-white/10 min-w-[58px]">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[9px] uppercase font-semibold text-zinc-400 mt-1">SECONDS</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 px-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-sm font-bold text-zinc-400">
                    Offer Expired
                  </div>
                )}
              </div>

              {/* Price Tag */}
              <div className="py-3 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] text-zinc-400 block">Offer Bundle</span>
                  <span className="text-xs font-semibold text-white">3 Verified Unlocks</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-white font-heading">₹999</span>
                  <span className="text-[10px] text-zinc-400 block line-through">Regular ₹1,197</span>
                </div>
              </div>

              {/* User Credit Status or Action Button */}
              {hasActiveCredits ? (
                /* Already purchased user state */
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Credits Active in Account</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Contact Unlocks: <span className="text-emerald-400 text-base">{credits.remainingCredits}</span> Remaining
                    <span className="text-xs text-zinc-400 block font-normal mt-0.5">({credits.totalCredits} Total Purchased)</span>
                  </div>
                  <Link
                    href="/discover"
                    className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Browse Verified Profiles to Unlock</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                /* Main Unlock CTA Button */
                <div className="space-y-3">
                  <button
                    onClick={handleUnlockOfferClick}
                    disabled={loading || timeLeft.isExpired}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary via-rose-600 to-primary hover:from-primary-hover hover:to-rose-500 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting to Razorpay...</span>
                      </>
                    ) : timeLeft.isExpired ? (
                      <span>Offer Expired</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Unlock 3 Contacts — ₹999</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-zinc-400">
                    Verified Razorpay 256-bit encryption • Instant credit activation
                  </p>
                </div>
              )}

              {/* Status Message Display (Success, Cancelled, Failed) */}
              <AnimatePresence>
                {paymentState !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3.5 rounded-2xl text-xs text-left ${
                      paymentState === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                        : paymentState === 'cancelled'
                        ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                        : 'bg-rose-950/50 border border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5 mb-1">
                      {paymentState === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {paymentState === 'cancelled' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                      {paymentState === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                      <span>
                        {paymentState === 'success' && '✓ Payment Successful'}
                        {paymentState === 'cancelled' && 'Payment Cancelled'}
                        {paymentState === 'error' && 'Payment Notice'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{statusMessage}</p>
                    {paymentState === 'success' && (
                      <Link
                        href="/discover"
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-white underline hover:text-emerald-300"
                      >
                        <span>Browse Verified Profiles Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Support Contact Footer */}
              <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400">
                Need help? Contact Frndma Support:{' '}
                <a
                  href="mailto:frndma.com@gmail.com"
                  className="text-pink-400 hover:text-pink-300 font-semibold underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  frndma.com@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Verified Link Payment Modal for ₹999 Offer */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        type="offer_999"
        amount={999}
        onSuccess={(details) => {
          setIsPaymentModalOpen(false);
          if (details?.credits) {
            setCredits(details.credits);
          }
          loadOfferAndUserData();
          setPaymentState('success');
          setStatusMessage('₹999 payment verified! 3 contact unlocks have been added to your account.');
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }}
      />
    </section>
  );
};
