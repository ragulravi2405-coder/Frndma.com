import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Standards</span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Community Guidelines</h1>
        <p className="text-xs text-zinc-500 mt-1">Fostering respectful and authentic connections</p>
      </div>

      <div className="p-8 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Mutual Respect & Consent</h2>
          <p>
            Every user is entitled to their boundaries. Consent is paramount in every message and interaction. "No" always means no.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Authentic Profiles</h2>
          <p>
            Do not create fake identities, upload photos of celebrities or other people without permission, or misrepresent your age.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Zero Tolerance for Illegal Activity</h2>
          <p>
            Underage activity, non-consensual imagery, scams, prostitution, and hate speech result in immediate permanent bans and reporting to legal authorities.
          </p>
        </section>
      </div>
    </div>
  );
}
