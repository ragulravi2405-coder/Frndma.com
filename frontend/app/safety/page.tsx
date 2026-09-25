import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, Lock, EyeOff } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Protection</span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Dating & Connection Safety</h1>
        <p className="text-xs text-zinc-500 mt-1">Best practices for a secure experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Keep Financial Info Private</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Never send money, wire transfers, cryptocurrency, or bank credentials to anyone you meet online, regardless of the emergency they claim.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Protect Sensitive Information</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Do not share your home address, workplace address, or daily routine with strangers until a strong basis of mutual trust is established.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Meet in Public Spaces</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            When meeting an online connection in person for the first time, choose well-lit public venues like cafes or restaurants. Inform a trusted friend or family member.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Use Block & Report Tools</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            If anyone behaves aggressively, disrespectfully, or suspiciously, block and report their profile immediately. Our team acts swiftly.
          </p>
        </div>
      </div>
    </div>
  );
}
