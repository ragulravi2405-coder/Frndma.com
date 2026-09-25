'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ArrowLeft, MessageSquare, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber }),
    });

    setSubmitted(true);
    setMessage(res.message || 'Guidance has been generated.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl glass-card border border-primary/30 bg-[#120a17] text-white"
      >
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <h2 className="text-2xl font-bold font-heading mb-2">Reset Password</h2>
        <p className="text-xs text-zinc-400 mb-6">
          Enter your registered mobile number or contact WhatsApp support directly.
        </p>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>

            <a
              href="https://wa.me/919087923641?text=Hello%20Frndma%20Support%2C%20I%20need%20to%20reset%20my%20password."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp for Password Reset</span>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Registered Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-sm"
            >
              Submit Reset Request
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
