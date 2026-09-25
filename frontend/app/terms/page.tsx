import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Legal</span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Terms of Service</h1>
        <p className="text-xs text-zinc-500 mt-1">Effective: September 2026</p>
      </div>

      <div className="p-8 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Eligibility</h2>
          <p>
            You must be at least 18 years of age to create an account or access the Frndma platform. By registering, you warrant that you are a consenting adult.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Prohibited Conduct</h2>
          <p>
            Users must treat each other with dignity and respect. Strictly prohibited conduct includes harassment, hate speech, financial fraud/solicitation, distribution of unauthorized or non-consensual imagery, and impersonation. Violators are subject to immediate account termination and IP bans.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Account Safety</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials. Do not share your password with anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Support Contact</h2>
          <p>
            For official inquiries, contact Frndma Support via WhatsApp at <strong>9087923641</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
