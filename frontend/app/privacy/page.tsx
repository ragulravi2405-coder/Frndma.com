import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Legal</span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Privacy Policy</h1>
        <p className="text-xs text-zinc-500 mt-1">Last updated: September 2026</p>
      </div>

      <div className="p-8 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Strict 18+ Adult Policy</h2>
          <p>
            Frndma is strictly intended for consenting adults aged 18 and older. We do not knowingly allow or collect data from individuals under the age of 18.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Information We Never Collect or Disclose</h2>
          <p>
            We strictly protect your real-world identity. We <strong>never collect, store, or display your exact home address</strong>, private physical locations, or government identity cards on public profiles. Only broad location indicators (such as City and State) are shared.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Consent-Based Contact Unlock</h2>
          <p>
            Contact sharing on Frndma is strictly consent-driven. Your phone number or WhatsApp contact is <strong>never disclosed automatically</strong>, even if another user has purchased a contact unlock, unless you have explicitly toggled <em>Contact Sharing: ON</em> in your profile settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Payment & Financial Data</h2>
          <p>
            All payment transactions are handled through our certified payment gateway partner, <strong>Razorpay</strong>. Frndma does not store or process your credit/debit card numbers, UPI PINs, or bank passwords.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Dedicated Support Inquiries</h2>
          <p>
            For privacy requests, data deletion, or questions, you can reach out directly to our official WhatsApp support channel at <strong>9087923641</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
