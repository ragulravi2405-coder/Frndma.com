'use client';

import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface WhatsAppSupportProps {
  className?: string;
  variant?: 'card' | 'badge' | 'float';
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({
  className = '',
  variant = 'card',
}) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '9087923641';
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(
    'Hello Frndma Support team, I need assistance with my account.'
  )}`;

  if (variant === 'float') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group hover:scale-105 ${className}`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-semibold tracking-wide">WhatsApp Support</span>
      </a>
    );
  }

  return (
    <div
      className={`glass-card p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-surface-card flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Need help?</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Our support team is available directly on WhatsApp:{' '}
            <span className="text-emerald-400 font-bold">{whatsappNumber}</span>
          </p>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <MessageSquare className="w-4 h-4 fill-current" />
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
};
