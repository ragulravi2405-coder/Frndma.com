'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  ExternalLink,
  MessageCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact_unlock' | 'subscription' | 'offer_999' | 'offer_2999';
  targetProfileId?: string;
  targetProfileName?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  onSuccess?: (details: any) => void;
}

const LOCKED_AMOUNT = 499; // Default fallback amount
const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@ravirahul601';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  targetProfileId,
  targetProfileName,
  planId,
  planName,
  amount,
  onSuccess,
}) => {
  const isOffer = type === 'offer_2999' || type === 'offer_999';
  const payableAmount = isOffer ? 2999 : (amount ?? LOCKED_AMOUNT);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [unlockedData, setUnlockedData] = useState<any>(null);
  const [creditsData, setCreditsData] = useState<any>(null);

  // Auto-checking state
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [autoChecking, setAutoChecking] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setUnlockedData(null);
      setCreditsData(null);
      setLoading(false);
      setAutoChecking(false);
      setHasOpenedLink(false);
    }
  }, [isOpen, targetProfileId]);

  // Auto-poll to detect payment as soon as user pays on razorpay.me/@ravirahul601
  useEffect(() => {
    let interval: any = null;

    if (autoChecking && isOpen && status === 'idle' && (targetProfileId || isOffer)) {
      interval = setInterval(async () => {
        const ok = await checkPaymentVerification(true);
        if (ok) {
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoChecking, isOpen, status, targetProfileId, isOffer]);

  // Window Focus Detection: When user returns from razorpay.me tab, trigger instant check!
  useEffect(() => {
    const handleWindowFocus = () => {
      if (hasOpenedLink && isOpen && status === 'idle') {
        checkPaymentVerification(false);
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [hasOpenedLink, isOpen, status, targetProfileId, payableAmount]);

  if (!isOpen) return null;

  /**
   * ⚡ Opens razorpay.me/@ravirahul601 directly for UPI / Payment
   */
  const handleOpenPaymentLink = () => {
    window.open(RAZORPAY_PAYMENT_LINK, '_blank');
    setHasOpenedLink(true);
    setAutoChecking(true);
    setErrorMessage('');
  };

  /**
   * ⚡ Automatic Payment Verification & Unlock
   * Unlocks the contact seamlessly without requiring the user to type any transaction ID!
   */
  const checkPaymentVerification = async (silent = false): Promise<boolean> => {
    try {
      if (!silent) {
        setLoading(true);
        setErrorMessage('');
      }

      const res = await fetchApi('/payments/verify-link-payment', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetProfileId: isOffer ? undefined : targetProfileId,
          planId,
          amount: payableAmount,
        }),
      });

      if (!silent) setLoading(false);

      if (res.success && (res.data?.unlockedDetails || res.data?.credits)) {
        setAutoChecking(false);
        setStatus('success');
        setUnlockedData(res.data.unlockedDetails || null);
        setCreditsData(res.data.credits || null);

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        if (onSuccess) {
          onSuccess(res.data);
        }
        return true;
      } else {
        if (!silent) {
          setStatus('error');
          setErrorMessage(
            res.message ||
              `Payment verification pending. Please complete your payment of ₹${payableAmount} on razorpay.me/@ravirahul601.`
          );
        }
        return false;
      }
    } catch (err) {
      if (!silent) {
        setLoading(false);
        setStatus('error');
        setErrorMessage((err as Error).message || 'Verification check failed.');
      }
      return false;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-5 sm:p-7 rounded-3xl glass-card border border-primary/30 bg-[#120a17] shadow-glow-lg text-white my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {status === 'idle' && (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  {isOffer ? (
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  ) : type === 'contact_unlock' ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading">
                    {isOffer
                      ? 'Unlock 20 Verified Contacts — ₹2,999'
                      : type === 'contact_unlock'
                      ? `Unlock ${targetProfileName || 'User'}'s Contact`
                      : `Upgrade to ${planName || 'Premium'}`}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Official Razorpay Link: <span className="text-emerald-400 font-mono font-semibold">razorpay.me/@ravirahul601</span>
                  </p>
                </div>
              </div>

              {/* Amount Display */}
              <div className="flex items-center justify-between p-4 mb-4 rounded-2xl bg-gradient-to-r from-primary/15 via-rose-500/10 to-transparent border border-primary/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-300 block">Total Payable</span>
                    <span className="text-[10px] text-emerald-400 font-medium">⚡ Automatic Instant Unlock</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    ₹{payableAmount}
                  </span>
                  {isOffer && (
                    <span className="text-[10px] text-zinc-400 block line-through">Regular ₹9,980</span>
                  )}
                </div>
              </div>

              {/* Offer Features highlight for offer */}
              {isOffer && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-zinc-300">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>20 Contact Unlocks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified Profiles</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct Meeting Allowed</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Video Call Allowed</span>
                  </div>
                </div>
              )}

              {/* Instructions Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">How it unlocks:</p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      1. Click the button below to pay <strong className="text-emerald-400 font-bold">₹{payableAmount}</strong> on <strong>razorpay.me/@ravirahul601</strong> (Google Pay, PhonePe, Paytm, or UPI).
                    </p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      2. As soon as you complete the payment, your contact unlocks <strong className="text-pink-300">automatically</strong> without entering any transaction ID!
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. Main Direct Pay on razorpay.me link */}
                <button
                  onClick={handleOpenPaymentLink}
                  className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-primary via-rose-600 to-primary hover:opacity-95 shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.98]"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                  <span>⚡ 1. Pay ₹{payableAmount} on razorpay.me/@ravirahul601</span>
                </button>

                {/* Auto Checking Indicator */}
                {autoChecking && (
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2.5 text-xs text-pink-300 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span>Listening for your ₹{payableAmount} payment on razorpay.me...</span>
                  </div>
                )}

                {/* 2. Instant Confirm & Unlock Button (Zero Transaction ID needed!) */}
                {hasOpenedLink && (
                  <button
                    onClick={() => checkPaymentVerification(false)}
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Confirming ₹{payableAmount} Payment & Unlocking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>
                          {isOffer
                            ? `✅ 2. I Have Paid ₹${payableAmount} — Claim 20 Credits Now`
                            : `✅ 2. I Have Paid ₹${payableAmount} — Reveal Contact Now`}
                        </span>
                      </>
                    )}
                  </button>
                )}

                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Direct settlement via razorpay.me/@ravirahul601 • No transaction ID needed
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Success State - Revealed upon payment */}
          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Confirmed!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-2">
                Your payment of <strong className="text-emerald-400">₹{payableAmount}</strong> on razorpay.me/@ravirahul601 is confirmed!
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold mb-5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isOffer ? '20 Contact Unlock Credits Added' : 'Contact Unlocked & Verified'}
                </span>
              </div>

              {isOffer ? (
                <div className="p-4 mb-6 rounded-2xl bg-white/5 border border-primary/30 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-pink-400 font-bold">
                      Your Available Credits
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      Ready to Use
                    </span>
                  </div>

                  <div>
                    <p className="text-2xl font-extrabold text-white font-heading">
                      {creditsData?.remainingCredits || 20} Contact Unlocks
                    </p>
                    <p className="text-xs text-zinc-300 mt-1">
                      You can now unlock 20 verified profiles of your choice on Discover without any extra charge!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-zinc-300">
                    🤝 <strong>Direct Meeting & Video Call Included:</strong> Arranging direct meetings and video calls with unlocked contacts does not require any additional payment from Frndma.
                  </div>

                  <div className="pt-1">
                    <a
                      href="/discover"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-glow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Browse Verified Profiles to Unlock</span>
                    </a>
                  </div>
                </div>
              ) : (
                unlockedData && (
                  <div className="p-4 mb-6 rounded-2xl bg-white/5 border border-primary/30 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-pink-400 font-bold">
                        Unlocked Contact Details
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        Verified
                      </span>
                    </div>

                    <div>
                      <p className="text-base font-bold text-white">{unlockedData.displayName}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        Phone: <span className="text-white font-semibold text-sm">{unlockedData.contact}</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <a
                        href={`https://wa.me/91${unlockedData.contact}?text=Hi%20${encodeURIComponent(
                          unlockedData.displayName || ''
                        )}%2C%20I%20saw%20your%20profile%20on%20Frndma!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-glow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${unlockedData.contact}`}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                )
              )}

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-glow-sm transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-glow-md">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Issue</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6">
                {errorMessage || 'Unable to confirm payment. Please try again.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStatus('idle');
                    setErrorMessage('');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-glow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
