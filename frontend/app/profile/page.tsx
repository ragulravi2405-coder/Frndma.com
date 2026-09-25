'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Heart,
  Edit,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Smile,
  Check,
  X,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { MALE_CARTOON_AVATARS } from '@/lib/maleCartoonAvatars';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const meRes = await fetchApi('/auth/me');
    if (meRes.success && meRes.data) {
      setUser(meRes.data.user);
      setProfile(meRes.data.profile);
    }
    setLoading(false);
  };

  const handleSelectCartoonAvatar = async (url: string, name: string) => {
    try {
      setAvatarSaving(true);
      const res = await fetchApi('/profile/me', {
        method: 'PUT',
        body: JSON.stringify({ avatarUrl: url }),
      });
      if (res.success) {
        setProfile((prev: any) => ({ ...prev, avatarUrl: url }));
        setAvatarMessage(`Applied "${name}" avatar!`);
        setTimeout(() => {
          setAvatarMessage('');
          setShowAvatarModal(false);
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Please Log In</h2>
        <p className="text-xs text-zinc-400 mb-6">You need to log in to view and manage your profile.</p>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Account</span>
          <h1 className="text-3xl font-extrabold text-white font-heading">My Profile</h1>
        </div>
        <Link
          href="/profile/edit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm transition-all"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 flex flex-col items-center text-center p-6 rounded-3xl glass-card border border-primary/20 bg-[#120a17]">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary shadow-glow-md mb-2 group">
            <img
              src={
                profile?.avatarUrl ||
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&skinColor=ecad80&backgroundColor=b6e3f4'
              }
              alt={profile?.displayName || user.username}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-pink-300 hover:text-white text-xs font-semibold transition-all border border-pink-500/30 hover:border-primary shadow-glow-sm cursor-pointer"
          >
            <Smile className="w-3.5 h-3.5 text-primary" />
            <span>🎭 10 Cartoon Faces</span>
          </button>

          <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
            <span>{profile?.displayName || user.username}</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </h3>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">@{user.username}</p>

          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{profile?.city || 'City Not Set'}</span>
            <span>•</span>
            <span>{profile?.age || 18} yrs</span>
          </div>

          {/* Contact Sharing Status Card */}
          <div className="w-full mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white">Contact Sharing</span>
              {profile?.contactSharing ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ENABLED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                  DISABLED
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              {profile?.contactSharing
                ? 'Consenting users can unlock your contact via Razorpay.'
                : 'Your contact details remain completely private.'}
            </p>
          </div>
        </div>

        {/* Right Column: Bio, Interests & Detailed Attributes */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Card */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-3">About Me</h4>
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              &quot;{profile?.bio || 'No bio written yet. Click Edit Profile to tell others about yourself!'}&quot;
            </p>
          </div>

          {/* Interests Tags */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-3">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile?.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest: string, i: number) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-pink-200"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500">No interests added yet.</span>
              )}
            </div>
          </div>

          {/* Personal Details Grid */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-4">Profile Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-zinc-500 block">Occupation</span>
                  <span className="font-semibold text-white">{profile?.occupation || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-zinc-500 block">Education</span>
                  <span className="font-semibold text-white">{profile?.education || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Languages className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-zinc-500 block">Languages</span>
                  <span className="font-semibold text-white">
                    {profile?.languages ? profile.languages.join(', ') : 'English'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Heart className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-zinc-500 block">Looking For</span>
                  <span className="font-semibold text-white">
                    {profile?.relationshipPreference || 'Meaningful Relationship'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 10 Male Cartoon Character Faces Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#150a1d] border border-white/20 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-primary/20 text-primary">
                <Smile className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Choose Male Cartoon Avatar</h3>
                <p className="text-xs text-zinc-400">10 Stylish Character Faces — 1-Click to apply instantly</p>
              </div>
            </div>

            {avatarMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{avatarMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {MALE_CARTOON_AVATARS.map((avatar) => {
                const isSelected = profile?.avatarUrl === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    disabled={avatarSaving}
                    onClick={() => handleSelectCartoonAvatar(avatar.url, avatar.name)}
                    className={`relative p-3 rounded-2xl border text-center transition-all flex flex-col items-center group cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/20 shadow-glow-sm scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-white/10'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 mb-2 group-hover:scale-105 transition-transform bg-[#1a0f24]">
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-white block truncate w-full">
                      {avatar.name}
                    </span>
                    <span className="text-[9px] text-pink-300 font-medium px-1.5 py-0.5 mt-1 rounded-full bg-white/5 border border-white/10 block truncate max-w-full">
                      {avatar.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Selected avatar saves instantly to your profile.</span>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
