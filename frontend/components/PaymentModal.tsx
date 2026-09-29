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

const LOCKED_AMOUNT = 399; // Default fallback amount
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
    const cleanPhone = paymentPhone.replace(/\D/g, '').slice(-10);
    const cleanPid = paymentIdInput.trim();

    if (autoChecking && isOpen && status === 'idle' && targetProfileId && (cleanPhone.length === 10 || cleanPid.length > 5)) {
      interval = setInterval(async () => {
        const ok = await checkPaymentVerification(true);
        if (ok) {
          clearInterval(interval);
        }
      }, 5000);
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
    const cleanPhone = paymentPhone.replace(/\D/g, '').slice(-10);
    const cleanPid = paymentIdInput.trim();

    // Frontend validation: User must enter a 10-digit number or payment ID to verify
    if (!cleanPid && cleanPhone.length !== 10) {
      if (!silent) {
        setStatus('error');
        setErrorMessage('Please enter the 10-digit mobile number you used while paying on Razorpay so we can verify your payment.');
      }
      return false;
    }

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
          phone: cleanPhone,
          paymentId: cleanPid,
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
              `No ₹${payableAmount} payment detected on Razorpay yet for mobile ${cleanPhone || 'entered'}. Please complete payment of ₹${payableAmount} on razorpay.me/@ravirahul601 first.`
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
                  <p className="text-xs text-zinc-400">Official Razorpay Verification • Instant Contact Reveal</p>
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

              {/* Step 1: Razorpay Payment Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">Step 1: Pay via Official Razorpay Link</p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Pay <strong className="text-emerald-400">₹{payableAmount}</strong> using Google Pay, PhonePe, Paytm, UPI, Cards, or NetBanking:
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold mt-1">
                      <span>razorpay.me/@ravirahul601</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenPaymentLink}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary via-rose-600 to-primary hover:opacity-95 shadow-glow-sm transition-all flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>⚡ Pay ₹{payableAmount} on razorpay.me/@ravirahul601</span>
                </button>
              </div>

              {/* Step 2: Enter Phone Number */}
              <div className="p-4 rounded-2xl bg-white/5 border border-primary/20 space-y-2 mb-4">
                <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Step 2: Mobile Number Used on Razorpay</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Required</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-11 pr-3 py-2.5 bg-black/50 border border-white/20 focus:border-primary rounded-xl text-sm text-white placeholder-zinc-500 font-mono outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  Our system verifies your ₹{payableAmount} payment on Razorpay using this mobile number before unlocking.
                </p>
              </div>

              {/* Main Action Button: Check & Reveal */}
              <div className="space-y-3">
                {autoChecking && (
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-xs text-pink-300 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Listening for your ₹{payableAmount} payment on Razorpay...</span>
                  </div>
                )}

                <button
                  onClick={() => checkPaymentVerification(false)}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying ₹{payableAmount} Payment on Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>✅ I Have Paid ₹{payableAmount} — Reveal Contact Now</span>
                    </>
                  )}
                </button>

                {/* Optional Expandable Payment ID */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <span>Have Razorpay Payment ID? (Optional)</span>
                    {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showAdvanced && (
                    <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                          Razorpay Payment ID (e.g. pay_...)
                        </label>
                        <input
                          type="text"
                          value={paymentIdInput}
                          onChange={(e) => setPaymentIdInput(e.target.value)}
                          placeholder="pay_xxxxxxxxxxxxxx"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact is strictly locked until ₹{payableAmount} payment is confirmed</span>
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

          {/* Error State - When payment is not verified on Razorpay */}
          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1 text-white">Payment Not Detected</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-4 leading-relaxed">{errorMessage}</p>

              {/* Mobile Number correction right here */}
              <div className="p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-left">
                <label className="text-[11px] text-zinc-300 font-semibold block mb-1">
                  Mobile Number used on Razorpay:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-11 pr-3 py-2 bg-black/60 border border-white/20 focus:border-primary rounded-lg text-xs text-white placeholder-zinc-500 font-mono outline-none"
                  />
                </div>
              </div>

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
                  className="w-full py-2.5 px-6 rounded-2xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Check Payment Again</span>
                </button>

                <button
                  onClick={() => setStatus('idle')}
                  className="w-full py-2 px-6 rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white bg-transparent transition-all"
                >
                  Back to Details
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
