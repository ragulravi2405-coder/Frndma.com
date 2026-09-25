'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Sparkles, CheckCircle2, AlertCircle, X, CreditCard } from 'lucide-react';
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
  amount: number;
  onSuccess?: (details: any) => void;
}

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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [unlockedData, setUnlockedData] = useState<any>(null);

  if (!isOpen) return null;

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

  const handlePayment = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // 1. Create order on backend
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

      // 2. Load script
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        setStatus('error');
        setErrorMessage('Unable to load Razorpay payment gateway. Please check your network and retry.');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay checkout
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
          await completeVerification({
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
      setErrorMessage((err as Error).message || 'Payment failed to initialize.');
      setLoading(false);
    }
  };

  const completeVerification = async (verifyPayload: any) => {
    try {
      const verifyRes = await fetchApi('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(verifyPayload),
      });

      setLoading(false);
      if (verifyRes.success) {
        setStatus('success');
        setUnlockedData(verifyRes.data?.unlockedDetails);
        if (onSuccess) {
          onSuccess(verifyRes.data);
        }
      } else {
        setStatus('error');
        setErrorMessage(verifyRes.message || 'Backend verification rejected.');
      }
    } catch (err) {
      setLoading(false);
      setStatus('error');
      setErrorMessage('Verification failed.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-primary/30 bg-[#120a17] shadow-glow-lg text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {status === 'idle' && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  {type === 'contact_unlock' ? <Lock className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading">
                    {type === 'contact_unlock' ? 'Unlock Contact Information' : `Upgrade to ${planName}`}
                  </h3>
                  <p className="text-xs text-zinc-400">Consent-based • Verified & Protected</p>
                </div>
              </div>

              {type === 'contact_unlock' && (
                <div className="p-4 mb-6 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Contact details are only shared because <strong>{targetProfileName}</strong> has explicitly enabled Contact Sharing.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Exact addresses are never shared. Verified mobile / WhatsApp will be revealed immediately.</span>
                  </div>
                </div>
              )}

              {/* Price summary */}
              <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-zinc-300">Total Payable Amount</span>
                <span className="text-2xl font-extrabold text-white">₹{amount}</span>
              </div>

              {/* Pay Button */}
              <button
                disabled={loading}
                onClick={handlePayment}
                className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{amount} via Razorpay</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-2 text-center">
                <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure 256-bit encrypted payments powered by <strong>Razorpay</strong></span>
                </p>
                <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">
                  <span>UPI</span>
                  <span>•</span>
                  <span>Cards</span>
                  <span>•</span>
                  <span>NetBanking</span>
                  <span>•</span>
                  <span>Wallets</span>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">Payment Successful!</h3>
              <p className="text-sm text-zinc-300 mb-6">
                Your payment of ₹{amount} has been verified and recorded.
              </p>

              {unlockedData && (
                <div className="p-4 mb-6 rounded-2xl bg-white/5 border border-primary/30 text-left">
                  <h4 className="text-xs uppercase tracking-wider text-pink-400 font-semibold mb-2">
                    Unlocked Contact
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{unlockedData.displayName}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{unlockedData.contact}</p>
                    </div>
                    <a
                      href={`https://wa.me/91${unlockedData.contact}?text=Hi%20${encodeURIComponent(unlockedData.displayName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-glow-sm"
              >
                Done
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1 text-white">Payment Issue</h3>
              <p className="text-sm text-zinc-300 mb-6">{errorMessage || 'Something went wrong.'}</p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-3 px-6 rounded-2xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20"
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
