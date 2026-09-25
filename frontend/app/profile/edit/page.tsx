'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Check, AlertCircle, Shield, Sparkles, Smile, Image as ImageIcon } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { MALE_CARTOON_AVATARS } from '@/lib/maleCartoonAvatars';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    displayName: '',
    age: 21,
    gender: 'female',
    city: '',
    state: '',
    bio: '',
    interests: '',
    occupation: '',
    education: '',
    languages: 'English, Tamil',
    relationshipPreference: 'Meaningful Relationship',
    contactSharing: false,
    shareableContact: '',
    avatarUrl: '',
  });

  useEffect(() => {
    loadCurrentProfile();
  }, []);

  const loadCurrentProfile = async () => {
    setLoading(true);
    const res = await fetchApi('/profile/me');
    if (res.success && res.data) {
      const p = res.data;
      setFormData({
        displayName: p.displayName || '',
        age: p.age || 21,
        gender: p.gender || 'female',
        city: p.city || '',
        state: p.state || '',
        bio: p.bio || '',
        interests: Array.isArray(p.interests) ? p.interests.join(', ') : '',
        occupation: p.occupation || '',
        education: p.education || '',
        languages: Array.isArray(p.languages) ? p.languages.join(', ') : 'English',
        relationshipPreference: p.relationshipPreference || 'Meaningful Relationship',
        contactSharing: !!p.contactSharing,
        shareableContact: p.shareableContact || '',
        avatarUrl: p.avatarUrl || '',
      });
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('photo', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/profile/photos`, {
        method: 'POST',
        credentials: 'include',
        body,
      });
      const data = await response.json();
      if (data.success && data.data?.avatarUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: data.data.avatarUrl }));
        setMessage('Profile photo updated successfully!');
      } else {
        setError(data.message || 'Photo upload failed');
      }
    } catch (err) {
      setError('Photo upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    if (formData.age < 18) {
      setError('You must be at least 18 years old.');
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      interests: formData.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      languages: formData.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    };

    const res = await fetchApi('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.success) {
      setMessage('Profile saved successfully!');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } else {
      setError(res.message || 'Could not update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Profile</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white font-heading">Edit Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Customize your presence on Frndma. Only consenting adult details are stored.
        </p>
      </div>

      {message && (
        <div className="p-3.5 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Avatar & Cartoon Character Facility */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary shadow-glow-md shrink-0 bg-white/5">
              <img
                src={
                  formData.avatarUrl ||
                  'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&skinColor=ecad80&backgroundColor=b6e3f4'
                }
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-pink-300 border border-white/20">
                Active
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                <Smile className="w-3.5 h-3.5" />
                <span>Male Cartoon Avatars Facility</span>
              </div>
              <h4 className="text-base font-bold text-white">Your Profile Picture</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-3">
                Select any of the 10 cartoon character faces below, enter a custom picture link, or upload from your device.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 border border-white/10">
                  <Upload className="w-3.5 h-3.5 text-pink-400" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 10 Male Cartoon Character Faces Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>10 Male Cartoon Character Faces (1-Click Choose)</span>
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Click any cartoon face below to instantly set it as your profile picture:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MALE_CARTOON_AVATARS.map((avatar) => {
                const isSelected = formData.avatarUrl === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, avatarUrl: avatar.url });
                      setMessage(`Selected "${avatar.name}" cartoon avatar! Click "Save Changes" below to apply.`);
                    }}
                    className={`relative p-3 rounded-2xl border text-center transition-all group flex flex-col items-center ${
                      isSelected
                        ? 'border-primary bg-primary/20 shadow-glow-sm scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-white/10'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 mb-2 group-hover:scale-105 transition-transform bg-[#1a0f24]">
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-white block truncate w-full">
                      {avatar.name}
                    </span>
                    <span className="text-[10px] text-pink-300 font-medium px-2 py-0.5 mt-1 rounded-full bg-white/5 border border-white/10 block truncate max-w-full">
                      {avatar.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image URL Option */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Or Direct Avatar Image URL</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/my-photo.jpg or DiceBear link"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">Basic Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Age (18+)</label>
              <input
                type="number"
                min={18}
                max={100}
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1b1124] border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">City / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Chennai, Bangalore"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others about yourself, what brings you here, or what you enjoy..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Interests (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Music, Travel, Movies, Technology, Food"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Extended Details */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17] space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">Additional Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Occupation</label>
              <input
                type="text"
                placeholder="e.g. Software Developer"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Education</label>
              <input
                type="text"
                placeholder="e.g. Graduate, B.E."
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Languages</label>
              <input
                type="text"
                placeholder="e.g. English, Hindi, Tamil"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Relationship Preference</label>
              <input
                type="text"
                placeholder="e.g. Meaningful Relationship"
                value={formData.relationshipPreference}
                onChange={(e) => setFormData({ ...formData, relationshipPreference: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Sharing Preferences (Consent-Based) */}
        <div className="p-6 rounded-3xl glass-card border border-primary/30 bg-[#150a1c] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Contact Sharing Preference</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Control whether verified users can unlock your contact via Razorpay.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contactSharing: !formData.contactSharing })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                formData.contactSharing ? 'bg-primary' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.contactSharing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {formData.contactSharing && (
            <div className="pt-3 border-t border-white/10">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Approved Shareable Contact (Mobile / WhatsApp)
              </label>
              <input
                type="text"
                placeholder="Leave blank to use your registered mobile number"
                value={formData.shareableContact}
                onChange={(e) => setFormData({ ...formData, shareableContact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                This number is ONLY revealed after another user completes verified payment.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Saving changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
