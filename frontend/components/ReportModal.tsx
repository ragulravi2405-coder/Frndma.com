'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  X,
  AlertTriangle,
  CheckCircle2,
  Mail,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileId: string;
  targetProfileName: string;
}

const REPORT_REASONS = [
  {
    id: 'asking_extra_payment',
    label: '🚨 Asking for extra payment (Meeting / Video call / Unlock)',
    isHighlight: true,
  },
  {
    id: 'fake_profile',
    label: '👤 Fake profile / Impersonation',
    isHighlight: false,
  },
  {
    id: 'scam',
    label: '⚠️ Scam / Fraud',
    isHighlight: false,
  },
  {
    id: 'harassment',
    label: '🚫 Harassment / Abuse',
    isHighlight: false,
  },
  {
    id: 'inappropriate_behaviour',
    label: '⚡ Inappropriate behaviour',
    isHighlight: false,
  },
  {
    id: 'suspicious_activity',
    label: '🔍 Suspicious activity',
    isHighlight: false,
  },
  {
    id: 'other',
    label: '📝 Other',
    isHighlight: false,
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetProfileId,
  targetProfileName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('asking_extra_payment');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setErrorMessage('Please select a reason for reporting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetchApi('/support/report', {
        method: 'POST',
        body: JSON.stringify({
          reportedUserId: targetProfileId,
          reason: selectedReason,
          details: details.trim(),
        }),
      });

      setLoading(false);

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.message || 'Failed to submit report. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Error submitting report.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setSelectedReason('asking_extra_payment');
    setDetails('');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-5 sm:p-7 rounded-3xl glass-card border border-rose-500/30 bg-[#140b1a] shadow-glow-lg text-white my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                    Report {targetProfileName || 'Profile'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Confidential • Reviewed strictly within 24 hours by Frndma Moderation
                  </p>
                </div>
              </div>

              {/* Safety Policy Notice */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 mb-4 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-300 leading-relaxed">
                  <strong className="text-rose-300 font-semibold block mb-0.5">⚠️ Zero Tolerance Policy</strong>
                  Frndma strictly prohibits members from asking for extra money for direct meetings or video calls. Your identity is never revealed to the reported user.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason Selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Select Reason:
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {REPORT_REASONS.map((r) => (
                      <label
                        key={r.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedReason === r.id
                            ? r.isHighlight
                              ? 'bg-rose-950/60 border-rose-500 text-white font-bold shadow-sm'
                              : 'bg-primary/20 border-primary text-white font-semibold'
                            : r.isHighlight
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200 hover:bg-rose-950/40'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          value={r.id}
                          checked={selectedReason === r.id}
                          onChange={() => setSelectedReason(r.id)}
                          className="accent-primary"
                        />
                        <span className="flex-1">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional Description */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Tell us what happened (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide any relevant details, messages, or context..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 resize-none"
                    maxLength={1000}
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Report...</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </form>

              {/* Direct Support Contact */}
              <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-zinc-400">
                Need urgent help? Contact Frndma Support directly:{' '}
                <a
                  href="mailto:frndma.com@gmail.com"
                  className="text-pink-400 hover:text-pink-300 underline font-medium inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  frndma.com@gmail.com
                </a>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold font-heading text-white">Report Submitted</h4>
                <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you. Your report has been submitted to Frndma Support.
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Our safety team will investigate and take strict action within 24 hours.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 max-w-sm mx-auto">
                Have screenshots or extra evidence? Email us at:{' '}
                <a
                  href="mailto:frndma.com@gmail.com?subject=Report%20Evidence%20for%20Profile"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  frndma.com@gmail.com
                </a>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
