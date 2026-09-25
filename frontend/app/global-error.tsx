'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Application Error</h2>
        <p className="text-zinc-400 text-xs mb-6">A critical error occurred.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-semibold"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
