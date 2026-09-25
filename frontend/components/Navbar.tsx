'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Logo } from './Logo';
import {
  Compass,
  Unlock,
  LogOut,
  PhoneCall,
  Menu,
  X,
  User,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const checkUser = async () => {
    const res = await fetchApi('/auth/me');
    if (res.success && res.data?.user) {
      setCurrentUser(res.data.user);
    } else {
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    await fetchApi('/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Discover Profiles', href: '/discover' },
    { name: 'Unlocked Contacts', href: '/payments' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </NextLink>
            );
          })}
        </nav>

        {/* Right: Actions / Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Quick WhatsApp Support Hotline */}
          <a
            href="https://wa.me/919087923641?text=Hello%20Frndma%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors"
            title="Chat with official WhatsApp Support"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Support: 9087923641</span>
          </a>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <NextLink
                href="/profile"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-light border border-white/10 hover:border-primary/40 text-sm font-medium text-white transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {currentUser.username[0]?.toUpperCase()}
                </div>
                <span>{currentUser.username}</span>
              </NextLink>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <NextLink
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </NextLink>
              <NextLink
                href="/register"
                className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
              >
                Sign Up
              </NextLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NextLink
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                pathname === link.href ? 'bg-primary text-white' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span>{link.name}</span>
            </NextLink>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="https://wa.me/919087923641?text=Hello%20Frndma%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Support: 9087923641</span>
            </a>
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <NextLink
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-sm font-medium text-white bg-white/5 rounded-xl"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-sm font-semibold text-white bg-primary rounded-xl"
                >
                  Sign Up
                </NextLink>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="py-2 text-center text-sm font-medium text-rose-400 bg-rose-950/20 rounded-xl"
              >
                Logout ({currentUser.username})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
