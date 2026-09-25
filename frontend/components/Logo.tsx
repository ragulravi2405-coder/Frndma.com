import React, { useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ compact = false, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Brand Icon from /logo.png */}
      <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-primary/40 p-1 shadow-glow-sm group-hover:shadow-glow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
        {!imgError ? (
          <img
            src="/logo.png?v=6"
            alt="Frndma"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-bold">
            FM
          </div>
        )}
        <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-2xl" />
      </div>

      {!compact && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white font-heading">
              Frnd<span className="text-primary">ma</span>
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/25 text-pink-300 border border-primary/40 shadow-glow-sm">
              18+
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase text-pink-200/70 font-semibold -mt-0.5 hidden sm:block">
            Real People • Genuine Connections
          </span>
        </div>
      )}
    </Link>
  );
};
