'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Lock,
  Unlock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Eye,
  Heart,
  UserCheck,
  Clock,
  Flame,
  MessageSquare,
  Phone,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@ravirahul601';

export default function HomePage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // 24 Hours Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Package Offer & Unlock State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimedContacts, setClaimedContacts] = useState<any[] | null>(null);

  useEffect(() => {
    // 24-hour cycle timer
    const STORAGE_KEY = 'frndma_pack999_cycle';
    let endTime = Number(localStorage.getItem(STORAGE_KEY));
    if (!endTime || isNaN(endTime) || endTime < Date.now()) {
      endTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(endTime));
    }

    const updateTimer = () => {
      const diff = Math.max(0, endTime - Date.now());
      if (diff <= 0) {
        endTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(endTime));
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimOffer = async () => {
    setClaiming(true);
    try {
      const res = await fetchApi('/payments/claim-package-999', {
        method: 'POST',
      });
      if (res.success && res.data?.contacts && res.data.contacts.length > 0) {
        setClaimedContacts(res.data.contacts);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else {
        // Payment required: open Razorpay modal
        setPaymentModalOpen(true);
      }
    } catch {
      setPaymentModalOpen(true);
    }
    setClaiming(false);
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    const faqRes = await fetchApi('/support/faqs');
    if (faqRes.success && faqRes.data) {
      setFaqs(faqRes.data);
    }

    const profilesRes = await fetchApi('/discover?gender=female&limit=8');
    if (profilesRes.success && profilesRes.data) {
      setFeaturedProfiles(profilesRes.data);
    }
  };

  const steps = [
    {
      num: '1',
      title: 'Browse Verified Profiles',
      desc: 'Discover authentic, 18+ adult profiles across Chennai, Bangalore, Mumbai & more.',
      icon: Compass,
    },
    {
      num: '2',
      title: 'View Photos & Bio',
      desc: 'Explore lifestyle interests, pictures, and background details.',
      icon: Eye,
    },
    {
      num: '3',
      title: 'Unlock Direct Contact',
      desc: 'Instant, secure contact unlock via UPI & Scanner (Phone & WhatsApp).',
      icon: Unlock,
    },
    {
      num: '4',
      title: 'Connect Directly',
      desc: 'Reach out straight on WhatsApp or phone call without middleman delays.',
      icon: Heart,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-transparent">
        {/* Ambient Neon Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-neon-magenta/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-primary/30 backdrop-blur-md mb-6 shadow-glow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-semibold text-pink-200 uppercase tracking-wider">
                  Real People • Direct Connections • 18+ Only
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.1] mb-6">
                Discover Genuine Profiles. <br />
                <span className="text-gradient">Connect Directly</span>{' '}
                <span className="inline-block text-primary animate-pulse">❤️</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-zinc-300 max-w-xl mb-8 leading-relaxed">
                Browse verified adult profiles, view full photos & bio details, and unlock direct phone / WhatsApp contact via instant secure payment.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/discover"
                  className="px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  <span>Browse Girls Profiles</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-10 flex items-center gap-4 pt-6 border-t border-white/10 w-full sm:w-auto">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Priya"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Ananya"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Sneha"
                  />
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold text-white">100% Genuine Profiles</span> with verified contact unlock access.
                </div>
              </div>
            </motion.div>

            {/* Right 3D Visual Brand Showcase (Priya Card Removed, replaced with Frndma 3D Emblem) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center [perspective:1000px]"
            >
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-primary/40 p-4 shadow-glow-lg transition-transform duration-500 hover:[transform:rotateY(6deg)_rotateX(-4deg)_scale(1.02)] flex flex-col justify-between bg-gradient-to-b from-[#1c0d24] via-[#120a17] to-[#08060b]">
                {/* Responsive Background image inside card: Mobile View vs Windows View */}
                <div className="relative w-full h-[65%] rounded-2xl overflow-hidden">
                  {/* Mobile View Image */}
                  <img
                    src="/images/frndma-mobile-bg.png"
                    alt="Frndma Mobile View"
                    className="w-full h-full object-cover object-top block md:hidden transition-transform duration-700 hover:scale-105"
                  />
                  {/* Windows / Desktop View Image */}
                  <img
                    src="/images/frndma-windows-bg.jpg"
                    alt="Frndma Windows View"
                    className="w-full h-full object-cover object-center hidden md:block transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-black/30" />

                  {/* Brand Icon Badge */}
                  <div className="absolute top-4 left-4 p-2 rounded-2xl bg-black/70 backdrop-blur-md border border-primary/40 flex items-center gap-2">
                    <img src="/logo.png?v=6" alt="Frndma Icon" className="w-8 h-8 rounded-xl object-contain" />
                    <span className="text-xs font-bold text-white font-heading">Frndma</span>
                  </div>

                  {/* Glowing Neon Heart */}
                  <div className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-primary/40 text-primary shadow-glow-md">
                    <Heart className="w-6 h-6 fill-primary animate-pulse" />
                  </div>
                </div>

                {/* Card Bottom Highlights */}
                <div className="p-2 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-semibold text-white">Genuine Adult Connections</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Verified 18+
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Browse real girls profiles, view full photos & bio details, and unlock verified WhatsApp contacts directly.
                  </p>

                  <Link
                    href="/discover"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-sm transition-all"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore All Profiles</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== 24-HOUR PACKAGE OFFER (UNLOCK 3 PROFILES AT ₹999) ===================== */}
      <section id="offer-24h" className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-black via-rose-950/20 to-black border-y border-rose-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-pink-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#1c0f24] to-[#0f0714] border-2 border-pink-500/30 p-6 sm:p-10 shadow-2xl shadow-pink-950/50 backdrop-blur-xl overflow-hidden">
            {/* Ambient Corner Glows */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badges & Countdown */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
                  Limited Time Mega Deal
                </span>
              </div>

              {/* 24h Countdown Timer */}
              <div className="flex items-center gap-2 bg-black/60 border border-pink-500/30 px-4 py-2 rounded-2xl shadow-inner">
                <Clock className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs text-zinc-400 font-semibold mr-1">Offer Ends In:</span>
                <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black">
                  <span className="bg-pink-950/80 text-pink-200 border border-pink-500/40 px-2 py-0.5 rounded-lg shadow-sm">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span className="text-pink-400 font-bold">:</span>
                  <span className="bg-pink-950/80 text-pink-200 border border-pink-500/40 px-2 py-0.5 rounded-lg shadow-sm">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span className="text-pink-400 font-bold">:</span>
                  <span className="bg-rose-950/90 text-rose-300 border border-rose-500/50 px-2 py-0.5 rounded-lg shadow-sm animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            {/* Offer Header & Pricing */}
            <div className="text-center mt-6 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Unlock 3 Profiles at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400">₹999 Offer</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Special 24-hour promotion! Get direct verified phone numbers and instant WhatsApp chat for any 3 girls.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-zinc-500 text-lg line-through font-semibold">₹2,499</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">₹999</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SAVE 60% TODAY
                </span>
              </div>
            </div>

            {/* 3 Featured Profiles Preview in this Pack */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              {[
                {
                  name: 'Nandhini, 23',
                  city: 'Salem, Tamil Nadu',
                  img: '/profiles/girl_14.jpg',
                  status: 'Active Now',
                  bio: 'Loves evening coffee & honest long talks ❤️',
                },
                {
                  name: 'Keerthi, 24',
                  city: 'Madurai, Tamil Nadu',
                  img: '/profiles/girl_15.jpg',
                  status: 'Online',
                  bio: 'College graduate looking for genuine adult friendship 🌟',
                },
                {
                  name: 'Deepika, 22',
                  city: 'Tirunelveli, Tamil Nadu',
                  img: '/profiles/girl_16.jpg',
                  status: 'Verified 18+',
                  bio: 'Fun-loving, sweet & friendly companion ✨',
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-black/50 border border-white/10 hover:border-pink-500/40 p-3 transition-all duration-200 group flex items-center gap-3 sm:flex-col sm:text-center"
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 mx-auto border border-pink-500/30">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black shadow" />
                  </div>
                  <div className="flex-1 sm:mt-2">
                    <div className="flex items-center sm:justify-center gap-1">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 inline" />
                    </div>
                    <span className="text-[11px] text-zinc-400 block">{p.city}</span>
                    <p className="text-[10px] text-zinc-500 italic mt-0.5 line-clamp-1">{p.bio}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {p.status}
                    </span>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center sm:justify-center gap-1.5 text-[10px] text-pink-300 font-mono">
                      <Lock className="w-3 h-3 text-pink-400" />
                      <span>+91 98765 XXXXX (Locked)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Unlocked Contacts Section (Shown after claiming or pre-unlocked) */}
            {claimedContacts && claimedContacts.length > 0 && (
              <div className="my-6 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">
                      🎉 3 Contacts Successfully Unlocked!
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Direct Access Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {claimedContacts.map((contact, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={contact.avatarUrl || '/profiles/girl_14.jpg'}
                          alt={contact.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-400/40"
                        />
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1">
                            {contact.displayName}
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {contact.city || 'Tamil Nadu'}
                          </div>
                          <div className="text-[11px] font-mono font-bold text-emerald-300 tracking-wide mt-0.5">
                            +91 {contact.contact}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <a
                          href={`https://wa.me/91${contact.contact}?text=${encodeURIComponent(
                            `Hi ${contact.displayName}, I got your contact via Frndma 24-hr Offer! Nice to meet you.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:+91${contact.contact}`}
                          className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[10px] flex items-center justify-center gap-1 border border-white/10 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs: Razorpay Link & Direct Unlock */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={RAZORPAY_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Pay ₹999 with Razorpay</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">Instant</span>
              </a>

              <button
                type="button"
                onClick={handleClaimOffer}
                disabled={claiming}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-900/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
              >
                <Unlock className="w-4 h-4" />
                <span>{claiming ? 'Unlocking 3 Profiles...' : 'Unlock 3 Profiles Now (₹999)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Custom Credits / Razorpay QR</span>
              </button>
            </div>

            {/* Safety & Guarantee micro-text */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Real Phone Numbers
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Direct WhatsApp Chat
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                Secure Razorpay Checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-20 bg-black/40 backdrop-blur-md border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Direct & Transparent</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-2">
              How to Unlock & Connect
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Zero complicated matching or waiting. Find someone you like and get direct contact access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/40 relative flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-glow-sm mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-pink-400 mb-1">Step {step.num}</span>
                  <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PROFILES WITH 3D TILT ===================== */}
      <section className="py-24 bg-black/30 backdrop-blur-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-primary">Explore</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
                Featured Profiles
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Click any profile to view full details and unlock verified contact information.
              </p>
            </div>

            <Link
              href="/discover"
              className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span>View All Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredProfiles.length > 0
              ? featuredProfiles
              : [
                  {
                    username: 'priya_21',
                    displayName: 'Priya',
                    age: 21,
                    city: 'Chennai',
                    bio: 'Coffee, books, travel and meaningful conversations.',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                    interests: ['Travel', 'Music', 'Design'],
                  },
                  {
                    username: 'ananya_23',
                    displayName: 'Ananya',
                    age: 23,
                    city: 'Bangalore',
                    bio: 'Software engineer who loves indie music and weekend road trips.',
                    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
                    interests: ['Music', 'Road Trips', 'Fitness'],
                  },
                  {
                    username: 'sneha_24',
                    displayName: 'Sneha',
                    age: 24,
                    city: 'Mumbai',
                    bio: 'Fashion designer and yoga lover. Believer in destiny.',
                    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
                    interests: ['Fashion', 'Yoga', 'Photography'],
                  },
                  {
                    username: 'kavya_22',
                    displayName: 'Kavya',
                    age: 22,
                    city: 'Chennai',
                    bio: 'Loves photography, food hopping and meaningful talks.',
                    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
                    interests: ['Art', 'Coffee', 'Movies'],
                  },
                ]
            ).map((profile) => (
              <Link
                key={profile.username}
                href={`/profile/${profile.username}`}
                className="group rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-primary/50 bg-[#120a17] transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-md flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-pink-400 border border-white/10">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-heading">
                      {profile.displayName}, {profile.age}
                    </h3>
                    <p className="text-xs text-zinc-300">📍 {profile.city}</p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 italic line-clamp-2 mb-4">
                    &quot;{profile.bio}&quot;
                  </p>

                  <div className="w-full py-2.5 rounded-xl bg-primary/20 group-hover:bg-primary text-pink-200 group-hover:text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <Lock className="w-3.5 h-3.5" />
                    <span>View & Unlock Contact</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ===================== FAQS ===================== */}
      <section className="py-20 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-white font-heading mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {(faqs.length > 0
              ? faqs
              : [
                  {
                    question: 'How do I unlock a contact on Frndma?',
                    answer:
                      'Simply click on any profile and choose "Unlock Contact Details". Complete the payment of ₹399 via UPI (Google Pay, PhonePe, Paytm, or QR Scanner), and the verified phone number and direct WhatsApp button will be revealed immediately.',
                  },
                  {
                    question: 'Can I see the contact details again after unlocking?',
                    answer:
                      'Yes! All contacts you have unlocked are permanently saved in your "Unlocked Contacts" page so you can access them anytime.',
                  },
                  {
                    question: 'Is my exact home address ever shown?',
                    answer:
                      'Never. We only display broad city indicators. Exact home addresses and sensitive private IDs are never collected or shown.',
                  },
                ]
            ).map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-primary transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform ${
                      activeFaq === index ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 border-t border-white/5 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-black/60 backdrop-blur-xl border-t border-white/10 py-12 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png?v=6" alt="Frndma Logo" className="w-8 h-8 rounded-xl object-contain" />
                <span className="text-xl font-bold text-white font-heading">
                  Frnd<span className="text-primary">ma</span>
                </span>
              </div>
              <p className="text-zinc-500 leading-relaxed">
                Real People. Genuine Connections. Direct verified adult contact unlocks.
              </p>
              <div className="inline-flex items-center px-2 py-1 rounded bg-pink-950/40 text-pink-300 border border-pink-500/20 text-[10px] font-bold">
                18+ Adult Platform
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/discover" className="hover:text-white">Discover Girls</Link></li>
                <li><Link href="/payments" className="hover:text-white">Unlocked Contacts</Link></li>
                <li><Link href="/profile" className="hover:text-white">My Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Safety & Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
            <p>© {new Date().getFullYear()} Frndma. All rights reserved. Exclusively for adults (18+).</p>
            <p>Designed with ❤️ for genuine human connections.</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        type="contact_unlock"
        amount={999}
      />
    </div>
  );
}
