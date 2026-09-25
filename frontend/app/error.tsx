'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white font-heading mb-2">Something went wrong</h2>
      <p className="text-zinc-400 text-xs max-w-sm mb-6">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}
