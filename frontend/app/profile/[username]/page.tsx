'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Flag,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Languages,
  Sparkles,
  Phone,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    const res = await fetchApi(`/profile/${username}`);
    setLoading(false);

    if (res.success && res.data) {
      setProfile(res.data);
    } else {
      setError(res.message || 'Profile not found or currently unavailable.');
    }
  };

  const handleBlock = async () => {
    if (!profile?.userId) return;
    if (!confirm(`Are you sure you want to block ${profile.displayName}?`)) return;

    const res = await fetchApi('/support/block', {
      method: 'POST',
      body: JSON.stringify({ blockedUserId: profile.userId }),
    });

    if (res.success) {
      alert('User has been blocked.');
      router.push('/discover');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.userId) return;

    const res = await fetchApi('/support/report', {
      method: 'POST',
      body: JSON.stringify({
        reportedUserId: profile.userId,
        reason: reportReason,
        details: reportDetails,
      }),
    });

    if (res.success) {
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Profile Unavailable</h2>
        <p className="text-xs text-zinc-400 mb-6">{error || 'This user profile could not be loaded.'}</p>
        <Link href="/discover" className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold">
          Return to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image & Direct Action */}
        <div className="md:col-span-5 flex flex-col items-center [perspective:1000px]">
          <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden glass-card border border-primary/30 relative shadow-glow-md mb-6 group transition-transform duration-500 hover:[transform:rotateY(4deg)_scale(1.02)]">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0714] via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-heading">{profile.displayName}, {profile.age}</h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-sm" title="Verified" />
              </div>
              <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
              </p>
            </div>
          </div>

          {/* Quick Unlock Action Button */}
          {!profile.isContactUnlocked && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-md transition-all flex items-center justify-center gap-2 mb-4 hover:scale-[1.02]"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Contact Number (₹399)</span>
            </button>
          )}

          {/* Report & Block links */}
          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2">
            <button
              onClick={() => setShowReportModal(true)}
              className="hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Flag className="w-3 h-3" />
              <span>Report Profile</span>
            </button>
            <span>•</span>
            <button
              onClick={handleBlock}
              className="hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Block</span>
            </button>
          </div>
        </div>

        {/* Right Column: Bio, Interests, Details, and Contact Unlock Status */}
        <div className="md:col-span-7 space-y-6">
          {/* Bio */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">About Her</h3>
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              &quot;{profile.bio || 'Love meeting real people and having pleasant conversations.'}&quot;
            </p>
          </div>

          {/* Interests */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-pink-200"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500">No interests specified.</span>
              )}
            </div>
          </div>

          {/* Background Info */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17]">
            <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-4">Background</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-white/5">
                <span className="text-zinc-500 block">Occupation</span>
                <span className="font-semibold text-white">{profile.occupation || 'Private'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5">
                <span className="text-zinc-500 block">Education</span>
                <span className="font-semibold text-white">{profile.education || 'Private'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5">
                <span className="text-zinc-500 block">Languages</span>
                <span className="font-semibold text-white">
                  {profile.languages ? profile.languages.join(', ') : 'English'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5">
                <span className="text-zinc-500 block">Location</span>
                <span className="font-semibold text-white">{profile.city}</span>
              </div>
            </div>
          </div>

          {/* ================= DIRECT CONTACT UNLOCK CARD ================= */}
          <div className="p-6 rounded-3xl glass-card border border-primary/30 bg-gradient-to-br from-[#1c0e24] to-[#120a17] shadow-glow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-white">Direct Contact Access</h3>
              </div>
              {profile.isContactUnlocked ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  UNLOCKED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  PROTECTED
                </span>
              )}
            </div>

            {profile.isContactUnlocked && profile.shareableContact ? (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Verified WhatsApp / Phone</span>
                    <span className="text-base font-bold text-white font-mono">{profile.shareableContact}</span>
                  </div>
                  <a
                    href={`https://wa.me/91${profile.shareableContact}?text=${encodeURIComponent(
                      `Hi ${profile.displayName}, saw your profile on Frndma!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Contact unlocked with verified payment. Saved in your Unlocked Contacts page.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                  To view verified phone number and direct WhatsApp link for <strong>{profile.displayName}</strong>, complete the secure one-time unlock payment (₹399) via UPI / Scanner.
                </p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 px-6 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Contact (₹399 via UPI)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal for Contact Unlock */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="contact_unlock"
        targetProfileId={profile.userId}
        targetProfileName={profile.displayName}
        amount={399}
        onSuccess={() => {
          loadProfile();
        }}
      />

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-white/10 bg-[#120a17] text-white">
            <h3 className="text-lg font-bold font-heading mb-1">Report {profile.displayName}</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Our safety team reviews all reports within 24 hours.
            </p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center font-semibold">
                Report submitted successfully. Thank you for keeping Frndma safe.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  >
                    <option value="spam">Spam or commercial behavior</option>
                    <option value="fake_profile">Fake profile or impersonation</option>
                    <option value="harassment">Harassment or abusive behavior</option>
                    <option value="scam">Scam or financial solicitation</option>
                    <option value="inappropriate_content">Inappropriate content</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional details..."
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
