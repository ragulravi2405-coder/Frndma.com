'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.success) {
      localStorage.setItem('frndma_18_confirmed', 'true');
      const token = res.data?.token || res.token;
      if (token) {
        localStorage.setItem('frndma_token', token);
      }
      if (res.data?.user) {
        localStorage.setItem('frndma_user', JSON.stringify(res.data.user));
      }
      if (res.isAdmin || res.redirectTo === '/admin' || res.data?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/discover');
      }
    } else {
      setError(res.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl glass-card border border-primary/30 bg-black/60 backdrop-blur-xl shadow-glow-lg text-white"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow-sm">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">Welcome Back</h2>
          <p className="text-xs text-zinc-400 mt-1">Log in to view and unlock genuine profiles</p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Username or Mobile Number
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Username or mobile"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-pink-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary placeholder:text-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
