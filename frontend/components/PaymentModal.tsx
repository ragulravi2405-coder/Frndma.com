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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact_unlock' | 'subscription';
  targetProfileId?: string;
  targetProfileName?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  onSuccess?: (details: any) => void;
}

const LOCKED_AMOUNT = 399; // Fixed non-editable amount of ₹399
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
  const payableAmount = amount || LOCKED_AMOUNT;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [unlockedData, setUnlockedData] = useState<any>(null);

  // Auto-checking state
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [autoChecking, setAutoChecking] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Phone / Payment ID for matching
  const [paymentPhone, setPaymentPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = JSON.parse(localStorage.getItem('frndma_user') || '{}');
        return u.mobileNumber || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [paymentIdInput, setPaymentIdInput] = useState('');

  // Auto-poll to detect payment as soon as user pays on razorpay.me/@ravirahul601
  useEffect(() => {
    let interval: any = null;
    if (autoChecking && isOpen && status === 'idle' && targetProfileId) {
      interval = setInterval(async () => {
        const ok = await checkPaymentVerification(true);
        if (ok) {
          clearInterval(interval);
        }
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoChecking, isOpen, status, targetProfileId, paymentPhone, paymentIdInput]);

  if (!isOpen) return null;

  const handleOpenPaymentLink = () => {
    window.open(RAZORPAY_PAYMENT_LINK, '_blank');
    setHasOpenedLink(true);
    setAutoChecking(true);
    setErrorMessage('');
  };

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
          targetProfileId,
          planId,
          amount: payableAmount,
          phone: paymentPhone.trim(),
          paymentId: paymentIdInput.trim(),
        }),
      });

      if (!silent) setLoading(false);

      if (res.success && res.data?.unlockedDetails) {
        setAutoChecking(false);
        setStatus('success');
        setUnlockedData(res.data.unlockedDetails);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
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
              `No ₹${payableAmount} payment detected on razorpay.me/@ravirahul601 yet. Please pay ₹${payableAmount} and click Check again.`
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
                  {type === 'contact_unlock' ? <Lock className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading">
                    {type === 'contact_unlock'
                      ? `Unlock ${targetProfileName || 'User'}'s Contact`
                      : `Upgrade to ${planName || 'Premium'}`}
                  </h3>
                  <p className="text-xs text-zinc-400">Official Razorpay Payment • Instant Contact Reveal</p>
                </div>
              </div>

              {/* Fixed Locked Amount Display */}
              <div className="flex items-center justify-between p-4 mb-4 rounded-2xl bg-gradient-to-r from-primary/15 via-rose-500/10 to-transparent border border-primary/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-300 block">Required Payment</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Exact Amount: ₹{payableAmount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    ₹{payableAmount}
                  </span>
                </div>
              </div>

              {/* Razorpay.me Payment Instructions Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">Payment via Official Razorpay Link:</p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Pay <strong className="text-emerald-400">₹{payableAmount}</strong> using PhonePe, Google Pay, Paytm, UPI, Cards, or NetBanking on our verified Razorpay handle:
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold mt-1">
                      <span>razorpay.me/@ravirahul601</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-3">
                {/* 1. Open Razorpay Link */}
                <button
                  onClick={handleOpenPaymentLink}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary via-rose-600 to-primary hover:opacity-95 shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>⚡ Pay ₹{payableAmount} on razorpay.me/@ravirahul601</span>
                </button>

                {/* Auto Checking Indicator */}
                {autoChecking && (
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-xs text-pink-300 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Listening for your ₹{payableAmount} payment on Razorpay...</span>
                  </div>
                )}

                {/* 2. Check & Reveal Contact Button */}
                <button
                  onClick={() => checkPaymentVerification(false)}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Checking Razorpay for ₹{payableAmount} Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>✅ I Have Paid ₹{payableAmount} — Reveal Contact Now</span>
                    </>
                  )}
                </button>

                {/* Optional Expandable Details (Phone / Payment ID) */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <span>Change phone number or enter Payment ID</span>
                    {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showAdvanced && (
                    <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                          Phone Number Used on Razorpay
                        </label>
                        <input
                          type="text"
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                          Payment ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={paymentIdInput}
                          onChange={(e) => setPaymentIdInput(e.target.value)}
                          placeholder="e.g. pay_..."
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Number is only revealed once ₹{payableAmount} payment is confirmed</span>
                </p>
              </div>
            </div>
          )}

          {/* Success State - Only shown when ₹399 payment is verified */}
          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Confirmed!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-2">
                Your payment of <strong className="text-emerald-400">₹{payableAmount}</strong> was verified on Razorpay.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold mb-5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Contact Unlocked & Verified</span>
              </div>

              {unlockedData && (
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
              )}

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-glow-sm transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Error State - When ₹399 payment is not detected */}
          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1 text-white">Payment Required</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed">{errorMessage}</p>

              <div className="space-y-2.5">
                <button
                  onClick={handleOpenPaymentLink}
                  className="w-full py-3 px-6 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:opacity-95 shadow-glow-sm flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>⚡ Pay ₹{payableAmount} on razorpay.me/@ravirahul601</span>
                </button>

                <button
                  onClick={() => checkPaymentVerification(false)}
                  disabled={loading}
                  className="w-full py-2.5 px-6 rounded-2xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Check Payment Again</span>
                </button>

                <button
                  onClick={() => setStatus('idle')}
                  className="w-full py-2 px-6 rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white bg-transparent transition-all"
                >
                  Back to Options
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
