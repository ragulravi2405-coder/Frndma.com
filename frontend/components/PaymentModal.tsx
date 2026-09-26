'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

const UPI_ID = 'sri67803@axl';
const LOCKED_AMOUNT = 399; // Fixed non-editable amount of ₹399
const PAYEE_NAME = 'Frndma';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  targetProfileId,
  targetProfileName,
  planId,
  planName,
  amount = LOCKED_AMOUNT,
  onSuccess,
}) => {
  // Always lock amount to 399 for contact unlock / standard tier as requested
  const payableAmount = LOCKED_AMOUNT;

  const [activeTab, setActiveTab] = useState<'upi' | 'razorpay'>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [unlockedData, setUnlockedData] = useState<any>(null);

  if (!isOpen) return null;

  // UPI Intent URL with pre-filled amount locked to 399
  const transactionNote = encodeURIComponent(
    type === 'contact_unlock'
      ? `Frndma Contact Unlock ${targetProfileName || ''}`
      : `Frndma Upgrade ${planName || ''}`
  );
  const standardUpiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${payableAmount}&cu=INR&tn=${transactionNote}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleDirectUpiPay = (appProtocol?: string) => {
    let targetUrl = standardUpiUrl;
    if (appProtocol === 'phonepe') {
      targetUrl = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${payableAmount}&cu=INR&tn=${transactionNote}`;
    } else if (appProtocol === 'gpay') {
      targetUrl = `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${payableAmount}&cu=INR&tn=${transactionNote}`;
    } else if (appProtocol === 'paytm') {
      targetUrl = `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${payableAmount}&cu=INR&tn=${transactionNote}`;
    }

    // Attempt to open deep link
    window.location.href = targetUrl;
  };

  const handleVerifyUpiPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const res = await fetchApi('/payments/verify-upi', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetProfileId,
          planId,
          amount: payableAmount,
          upiId: UPI_ID,
          utr: utrNumber.trim(),
        }),
      });

      setLoading(false);

      if (res.success) {
        setStatus('success');
        setUnlockedData(res.data?.unlockedDetails);

        // Celebration confetti effect
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
      } else {
        setStatus('error');
        setErrorMessage(res.message || 'Payment verification failed. Please check UTR and retry.');
      }
    } catch (err) {
      setLoading(false);
      setStatus('error');
      setErrorMessage((err as Error).message || 'Verification connection failed.');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const orderRes = await fetchApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetProfileId,
          planId,
        }),
      });

      if (!orderRes.success) {
        setStatus('error');
        setErrorMessage(orderRes.message || 'Could not initiate payment order.');
        setLoading(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderRes.data;

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        setStatus('error');
        setErrorMessage('Unable to load payment gateway. Please use Direct UPI / QR Scanner.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: 'Frndma Connections',
        description: type === 'contact_unlock' ? `Unlock contact for ${targetProfileName}` : `Plan: ${planName}`,
        order_id: orderId,
        theme: {
          color: '#ff2d78',
        },
        handler: async (response: any) => {
          await completeRazorpayVerification({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setStatus('error');
      setErrorMessage((err as Error).message || 'Payment initialization failed.');
      setLoading(false);
    }
  };

  const completeRazorpayVerification = async (verifyPayload: any) => {
    try {
      const verifyRes = await fetchApi('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(verifyPayload),
      });

      setLoading(false);
      if (verifyRes.success) {
        setStatus('success');
        setUnlockedData(verifyRes.data?.unlockedDetails);

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
          onSuccess(verifyRes.data);
        }
      } else {
        setStatus('error');
        setErrorMessage(verifyRes.message || 'Verification rejected.');
      }
    } catch (err) {
      setLoading(false);
      setStatus('error');
      setErrorMessage('Verification failed.');
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
                  <p className="text-xs text-zinc-400">Direct UPI & Scanner Payment • Instant Verification</p>
                </div>
              </div>

              {/* Tabs for UPI vs Cards */}
              <div className="flex items-center gap-2 p-1 mb-4 rounded-2xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'upi'
                      ? 'bg-gradient-to-r from-primary to-rose-600 text-white shadow-glow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI & Scanner (Direct)</span>
                </button>
                <button
                  onClick={() => setActiveTab('razorpay')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'razorpay'
                      ? 'bg-gradient-to-r from-primary to-rose-600 text-white shadow-glow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / NetBanking</span>
                </button>
              </div>

              {/* Fixed Locked Amount Display */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 mb-4 rounded-2xl bg-gradient-to-r from-primary/15 via-rose-500/10 to-transparent border border-primary/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-300 block">Payable Amount</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Fixed & Verified • Non-editable</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    ₹{payableAmount}
                  </span>
                </div>
              </div>

              {activeTab === 'upi' ? (
                <div className="space-y-4">
                  {/* UPI Scanner Image & ID Section */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold mb-2.5">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Scan with PhonePe, GPay, Paytm or any UPI App</span>
                    </div>

                    {/* QR Code Scanner Image */}
                    <div className="relative group p-2 rounded-2xl bg-white shadow-2xl border-2 border-primary/40 my-1">
                      <img
                        src="/images/pay-scanner.jpeg"
                        alt="UPI Payment Scanner"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
                        onError={(e) => {
                          // Fallback if needed
                          (e.target as HTMLImageElement).src = '/images/pay scanenr.jpeg';
                        }}
                      />
                      <div className="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none group-hover:bg-transparent transition-colors" />
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-2">
                      Scan the QR code above or pay directly using the buttons below
                    </p>

                    {/* UPI ID Display with Copy Button */}
                    <div className="w-full mt-3 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                      <div className="text-left overflow-hidden">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                          UPI ID
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-pink-300 truncate block">
                          {UPI_ID}
                        </span>
                      </div>
                      <button
                        onClick={copyUpiId}
                        className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-white text-xs font-semibold border border-primary/30 flex items-center gap-1 transition-all shrink-0 active:scale-95"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Direct Pay Action Buttons */}
                  <div className="space-y-2">
                    {/* Primary Direct Pay Button */}
                    <button
                      onClick={() => handleDirectUpiPay()}
                      className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary via-rose-600 to-primary hover:opacity-95 shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>⚡ Direct Pay ₹{payableAmount} via UPI App</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </button>

                    {/* Quick Launch Buttons for Popular Apps */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleDirectUpiPay('phonepe')}
                        className="py-2 px-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>PhonePe</span>
                      </button>
                      <button
                        onClick={() => handleDirectUpiPay('gpay')}
                        className="py-2 px-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Google Pay</span>
                      </button>
                      <button
                        onClick={() => handleDirectUpiPay('paytm')}
                        className="py-2 px-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Paytm</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Confirm & Unlock */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="text-left">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Step 2: Enter 12-Digit UPI Ref / UTR No. (from your UPI receipt)
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 426891234567 or Transaction ID"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-all font-mono"
                      />
                    </div>

                    <button
                      disabled={loading}
                      onClick={handleVerifyUpiPayment}
                      className="w-full py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Verifying Payment...
                        </span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>I Have Paid ₹{payableAmount} • Verify & Unlock Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Razorpay Alternative Tab */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-2">
                    <p>Pay with Debit / Credit Cards or NetBanking securely via Razorpay.</p>
                    <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>256-Bit SSL Encrypted Gateway</span>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    onClick={handleRazorpayPayment}
                    className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{payableAmount} via Razorpay Gateway</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Safety notice */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Consent-protected • Verified profiles only</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Confirmed!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6">
                Your payment of <strong className="text-emerald-400">₹{payableAmount}</strong> to{' '}
                <span className="font-mono text-pink-300">{UPI_ID}</span> was received and verified.
              </p>

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
                      Phone: <span className="text-white font-semibold">{unlockedData.contact}</span>
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

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1 text-white">Payment Issue</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6">{errorMessage || 'Something went wrong.'}</p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
