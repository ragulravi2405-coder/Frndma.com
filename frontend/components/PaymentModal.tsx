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

/**
 * Loads Razorpay checkout.js SDK dynamically if not already loaded
 */
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  // Link payment tracking
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentIdInput, setPaymentIdInput] = useState('');
  const [showPopupOption, setShowPopupOption] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setUnlockedData(null);
      setCreditsData(null);
      setLoading(false);
      setHasOpenedLink(false);
      setPaymentPhone('');
      setPaymentIdInput('');
      setShowPopupOption(false);
    }
  }, [isOpen, targetProfileId]);

  if (!isOpen) return null;

  /**
   * ⚡ Opens razorpay.me/@ravirahul601 directly for UPI / Payment Gateway
   */
  const handleOpenPaymentLink = () => {
    window.open(RAZORPAY_PAYMENT_LINK, '_blank');
    setHasOpenedLink(true);
    setErrorMessage('');
  };

  /**
   * ⚡ Strict Verification for razorpay.me/@ravirahul601 payment
   * Queries Razorpay API — contact ONLY unlocks if a genuine captured payment is verified!
   */
  const handleVerifyLinkPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const res = await fetchApi('/payments/verify-link-payment', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetProfileId: isOffer ? undefined : targetProfileId,
          planId,
          amount: payableAmount,
          phone: paymentPhone.trim() || undefined,
          paymentId: paymentIdInput.trim() || undefined,
        }),
      });

      setLoading(false);

      if (res.success && (res.data?.unlockedDetails || res.data?.credits)) {
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
      } else {
        setStatus('error');
        setErrorMessage(
          res.message ||
            `No completed payment of ₹${payableAmount} detected on Razorpay yet. Please complete your payment on razorpay.me/@ravirahul601 before unlocking.`
        );
      }
    } catch (err) {
      setLoading(false);
      setStatus('error');
      setErrorMessage((err as Error).message || 'Verification check failed.');
    }
  };

  /**
   * Optional on-page Razorpay Checkout Popup
   */
  const handleRazorpayCheckout = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setLoading(false);
        setErrorMessage('Failed to load Razorpay payment gateway. Please check your internet connection.');
        return;
      }

      const orderRes = await fetchApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetProfileId: isOffer ? undefined : targetProfileId,
          planId,
          amount: payableAmount,
        }),
      });

      if (!orderRes.success || !orderRes.data?.orderId) {
        setLoading(false);
        setErrorMessage(orderRes.message || 'Failed to initiate payment. Please try again.');
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TE7YcORlglXZe6',
        amount: orderAmount,
        currency: currency || 'INR',
        name: 'Frndma',
        description: isOffer
          ? '20 Verified Contacts Package'
          : `Unlock Contact - ${targetProfileName || 'Member'}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            setLoading(true);
            const verifyRes = await fetchApi('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            setLoading(false);

            if (verifyRes.success && (verifyRes.data?.unlockedDetails || verifyRes.data?.credits)) {
              setStatus('success');
              setUnlockedData(verifyRes.data.unlockedDetails || null);
              setCreditsData(verifyRes.data.credits || null);

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
                onSuccess(verifyRes.data);
              }
            } else {
              setStatus('error');
              setErrorMessage(verifyRes.message || 'Payment verification failed.');
            }
          } catch (vErr) {
            setLoading(false);
            setStatus('error');
            setErrorMessage((vErr as Error).message || 'Payment verification check failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        theme: {
          color: '#e11d48',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setLoading(false);
        setStatus('error');
        setErrorMessage(resp.error?.description || 'Payment was not completed. Contact remains locked.');
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      setErrorMessage((err as Error).message || 'Unable to open payment gateway.');
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
                  ) : (
                    <Lock className="w-5 h-5" />
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
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    Official Gateway: <span className="text-emerald-400 font-mono font-semibold">razorpay.me/@ravirahul601</span>
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
                    <span className="text-[10px] text-emerald-400 font-medium">Verified Payment Required</span>
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
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">How it works:</p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      1. Click <strong className="text-pink-300">"1. Pay ₹{payableAmount} on razorpay.me/@ravirahul601"</strong> to open Razorpay payment gateway (Google Pay, PhonePe, Paytm, UPI, Cards).
                    </p>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      2. After paying, click <strong className="text-emerald-400">"2. Verify & Reveal Contact"</strong> below. Contact unlocks only after confirmed payment!
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

              {/* Step 1: Open Razorpay.me Gateway Button */}
              <div className="space-y-3">
                <button
                  onClick={handleOpenPaymentLink}
                  className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-primary via-rose-600 to-primary hover:opacity-95 shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.98]"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                  <span>⚡ 1. Pay ₹{payableAmount} on razorpay.me/@ravirahul601</span>
                </button>

                {/* Step 2: Verification Panel */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Step 2: Confirm Payment</span>
                    </span>
                    {hasOpenedLink && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        Link Opened
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
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
                        className="w-full pl-11 pr-3 py-2.5 bg-black/60 border border-white/20 focus:border-primary rounded-xl text-sm text-white placeholder-zinc-500 font-mono outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Razorpay Payment ID (Optional, e.g. pay_...)
                    </label>
                    <input
                      type="text"
                      value={paymentIdInput}
                      onChange={(e) => setPaymentIdInput(e.target.value)}
                      placeholder="pay_xxxxxxxxxxxxxx"
                      className="w-full bg-black/60 border border-white/20 focus:border-primary rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleVerifyLinkPayment}
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
                        <span>
                          {isOffer
                            ? `✅ 2. I Have Paid ₹${payableAmount} — Claim 20 Credits`
                            : `✅ 2. I Have Paid ₹${payableAmount} — Reveal Contact Now`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact is strictly locked until verified payment on Razorpay</span>
                </p>

                {/* Optional Popup Gateway */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setShowPopupOption(!showPopupOption)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Or pay via on-page Razorpay Checkout popup?</span>
                    {showPopupOption ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showPopupOption && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleRazorpayCheckout}
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Open On-Page Razorpay Gateway Popup</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success State - Only revealed upon verified Razorpay payment */}
          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Confirmed!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-2">
                Your payment of <strong className="text-emerald-400">₹{payableAmount}</strong> on Razorpay is confirmed!
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

          {/* Error State - When payment is not verified on Razorpay */}
          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-glow-md">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Required</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
                {errorMessage || 'Contact cannot be unlocked because no completed payment was detected on Razorpay.'}
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
