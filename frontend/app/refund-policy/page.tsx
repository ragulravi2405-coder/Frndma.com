import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Billing</span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Refund & Cancellation Policy</h1>
        <p className="text-xs text-zinc-500 mt-1">Clear and fair transaction terms</p>
      </div>

      <div className="p-8 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Contact Unlocks</h2>
          <p>
            Contact unlocks are digital access services delivered immediately upon successful backend payment verification via Razorpay. Due to the immediate revelation of contact details, completed contact unlocks are generally non-refundable once unlocked.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Subscription Plans</h2>
          <p>
            Subscriptions grant immediate access to unlimited likes, priority visibility, and premium filters. Subscriptions can be managed or cancelled at any time before your next billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Technical Errors & Double Charges</h2>
          <p>
            In the event of a duplicate charge or technical failure where payment was captured but access was not provisioned, please contact our WhatsApp support team at <strong>9087923641</strong> with your Razorpay payment ID. Legitimate claims will be resolved and refunded within 5-7 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
