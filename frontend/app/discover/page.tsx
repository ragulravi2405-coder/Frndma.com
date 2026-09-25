'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Lock,
  Unlock,
  Eye,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

/**
 * ============================================================================
 * 🌸 5 GIRLS DISCOVER PROFILES CONFIGURATION (CHANGE CODE HERE) 🌸
 * ============================================================================
 * 📌 TAMIL / TANGLISH GUIDE:
 * Intha 5 edathula neenga unga 5 girls images & details change pannikkalam!
 * 1. avatarUrl -> Girls photo link (Unsplash, Cloudinary, etc.)
 * 2. shareableContact -> Girls WhatsApp / Phone number
 * 3. displayName, age, city, bio -> Profile details
 * ============================================================================
 */
const DISCOVER_5_GIRLS_LIST = [
  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 1] - PRIYA (Chennai)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_1',
    userId: 'girl_user_1',
    displayName: 'Priya',
    age: 21,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'UI Designer',
    bio: 'Coffee, books, travel and meaningful conversations. Looking forward to meeting pleasant people! ✨',
    interests: ['Travel', 'Music', 'Books', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543211',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 2] - ANANYA (Coimbatore) - Saree Sunset
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_2',
    userId: 'girl_user_2',
    displayName: 'Ananya',
    age: 23,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    occupation: 'Software Engineer',
    bio: 'Lover of sunsets, indie music, and weekend drives in Western Ghats. Positive vibes only! 🌅',
    interests: ['Sunsets', 'Road Trips', 'Music', 'Nature'],
    avatarUrl: '/images/girl2_sari_sun.jpg',
    shareableContact: '9876543212',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 3] - SNEHA (Madurai) - Black & White Dress
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_3',
    userId: 'girl_user_3',
    displayName: 'Sneha',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    occupation: 'Digital Marketer',
    bio: 'Madurai girl with a cheerful smile, fashion lover, and weekend cafe explorer. Love genuine talks! 🤍',
    interests: ['Fashion', 'Photography', 'Food', 'Cafes'],
    avatarUrl: 'https://images.unsplash.com/photo-1646539741099-7ac3cc927e54?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543213',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 4] - KAVYA (Tiruchirappalli) - Saree Pose
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_4',
    userId: 'girl_user_4',
    displayName: 'Kavya',
    age: 22,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    occupation: 'Architect',
    bio: 'Classical saree lover, fond of traditional temple architecture and artistic photography. 🪷',
    interests: ['Architecture', 'Photography', 'Heritage', 'Reading'],
    avatarUrl: 'https://images.unsplash.com/photo-1729101146492-006e4d9c82f4?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543214',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 5] - DIVYA (Salem) - Red Top Wall
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_5',
    userId: 'girl_user_5',
    displayName: 'Divya',
    age: 25,
    city: 'Salem',
    state: 'Tamil Nadu',
    occupation: 'HR Executive',
    bio: 'Bold & independent. Love fitness, mountain trekking, and warm evening coffee. ❤️',
    interests: ['Fitness', 'Trekking', 'Coffee', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967795457-d6ace6343c59?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543215',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 6] - MEENAKSHI (Thanjavur) - Traditional South Indian
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_6',
    userId: 'girl_user_6',
    displayName: 'Meenakshi',
    age: 28,
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    occupation: 'Classical Music Teacher',
    bio: 'Rooted in Tamil tradition, Carnatic music enthusiast, and classical Tanjore art connoisseur. 🌸',
    interests: ['Carnatic Music', 'Art', 'Culture', 'Temples'],
    avatarUrl: '/images/girl6_south_indian.jpg',
    shareableContact: '9876543216',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 7] - RITHIKA (Tirunelveli) - Curly Hair Sunglasses
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_7',
    userId: 'girl_user_7',
    displayName: 'Rithika',
    age: 23,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    occupation: 'Graphic Designer',
    bio: 'Curly hair, chic sunglasses, and adventurous road trips. Sweet like Tirunelveli Halwa! 🕶️',
    interests: ['Design', 'Road Trips', 'Movies', 'Fashion'],
    avatarUrl: 'https://images.unsplash.com/photo-1784360432673-ad3f7727ef09?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543217',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 8] - SHALINI (Erode) - Curly Hair Tree
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_8',
    userId: 'girl_user_8',
    displayName: 'Shalini',
    age: 26,
    city: 'Erode',
    state: 'Tamil Nadu',
    occupation: 'Botanist / Researcher',
    bio: 'Nature lover, passionate about eco-friendly living and peaceful greenery. Looking for true friendship. 🌿',
    interests: ['Nature', 'Gardening', 'Environment', 'Peace'],
    avatarUrl: 'https://images.unsplash.com/photo-1759854881836-53a85959f628?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543218',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 9] - NITHYA (Vellore) - White Top & Jeans
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_9',
    userId: 'girl_user_9',
    displayName: 'Nithya',
    age: 27,
    city: 'Vellore',
    state: 'Tamil Nadu',
    occupation: 'Financial Analyst',
    bio: 'Smart casual vibes, modern outlook, loves reading novels and long chats with thoughtful minds. 📖',
    interests: ['Reading', 'Economics', 'Podcasts', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1781551928573-cd7b9b7a433a?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543219',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 10] - DEEPA (Kanyakumari) - Purple & Blue Saree
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_10',
    userId: 'girl_user_10',
    displayName: 'Deepa',
    age: 29,
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    occupation: 'Marine Biologist',
    bio: 'Ocean lover, calm and thoughtful. Cherishing sunsets and sunrise at the southern tip of India. 🌊',
    interests: ['Ocean', 'Marine Life', 'Sunsets', 'Yoga'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967074923-2b3ebe6171c3?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543220',
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 11] - REVATHI (Dindigul) - Red & Green Saree
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_11',
    userId: 'girl_user_11',
    displayName: 'Revathi',
    age: 31,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    occupation: 'College Professor',
    bio: 'Elegant, kind-hearted, and loves traditional cooking and family gatherings. Looking for meaningful bonds. 🥻',
    interests: ['Literature', 'Cooking', 'Teaching', 'Poetry'],
    avatarUrl: 'https://images.unsplash.com/photo-1735331467260-0153c5fbd31d?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543221',
    contactSharing: true,
  },
];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>(DISCOVER_5_GIRLS_LIST);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [city, setCity] = useState('');

  // Unlocked IDs list
  const [unlockedIds, setUnlockedIds] = useState<Record<string, string>>({});

  // Payment Modal state
  const [paymentData, setPaymentData] = useState<{
    isOpen: boolean;
    targetProfileId?: string;
    targetProfileName?: string;
  }>({
    isOpen: false,
  });

  // Quick View Profile Modal
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [minAge, maxAge, city]);

  const loadData = async () => {
    setLoading(true);
    let query = `?minAge=${minAge}&maxAge=${maxAge}&gender=female`;
    if (city) query += `&city=${encodeURIComponent(city)}`;

    const [profilesRes, unlocksRes] = await Promise.all([
      fetchApi(`/discover${query}`),
      fetchApi('/unlocks/my-unlocks'),
    ]);

    if (profilesRes.success && profilesRes.data && profilesRes.data.length > 0) {
      setProfiles(profilesRes.data);
    } else {
      // Default to the 5 configured girls profiles if query has no database results or offline
      setProfiles(DISCOVER_5_GIRLS_LIST);
    }

    if (unlocksRes.success && unlocksRes.data) {
      const map: Record<string, string> = {};
      unlocksRes.data.forEach((u: any) => {
        map[u.profileOwnerId] = u.contactNumber;
      });
      setUnlockedIds(map);
    }

    setLoading(false);
  };

  const handleUnlockClick = (profile: any) => {
    setPaymentData({
      isOpen: true,
      targetProfileId: profile.userId || profile.id,
      targetProfileName: profile.displayName,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Female Profiles
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
            Discover Girls Profiles
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Click any profile to view full pictures and details. Contact is protected until unlocked.
          </p>
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
            filtersOpen
              ? 'bg-primary text-white border-primary shadow-glow-sm'
              : 'glass-card border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter by City / Age</span>
        </button>
      </div>

      {/* Filter Drawer */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 rounded-3xl glass-card border border-primary/20 bg-[#140b1a] text-xs text-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 mb-2 font-semibold">
                Maximum Age: <span className="text-white font-bold">{maxAge} yrs</span>
              </label>
              <input
                type="range"
                min="18"
                max="50"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 font-semibold">City</label>
              <input
                type="text"
                placeholder="Type city (e.g. Chennai, Bangalore, Mumbai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Profiles 3D Grid */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-400">Loading verified profiles...</span>
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [perspective:1000px]">
          {profiles.map((profile) => {
            const profileId = profile.userId || profile.id;
            const isUnlocked = !!unlockedIds[profileId];
            const unlockedNumber = unlockedIds[profileId] || profile.shareableContact;

            return (
              <motion.div
                key={profile.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-primary/50 bg-[#120a17] transition-all shadow-glow-sm hover:shadow-glow-md flex flex-col justify-between group"
              >
                {/* Photo Area (Click to Open Details) */}
                <div
                  onClick={() => setSelectedProfile(profile)}
                  className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-transparent" />

                  {/* Top Status Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified</span>
                  </div>

                  {/* Lock Indicator */}
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xl font-bold font-heading">{profile.displayName}</h3>
                      <span className="text-base text-zinc-300">({profile.age})</span>
                    </div>
                    <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                    </p>
                  </div>
                </div>

                {/* Card Bio & Action Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-zinc-300 italic line-clamp-2 mb-3">
                      &quot;{profile.bio || 'Love meeting real people and having pleasant conversations.'}&quot;
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {profile.interests?.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-pink-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {isUnlocked ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs px-2 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/30 text-emerald-300">
                          <span className="font-mono font-bold">{unlockedNumber}</span>
                          <span className="text-[10px] uppercase font-bold text-emerald-400">Unlocked</span>
                        </div>
                        <a
                          href={`https://wa.me/91${unlockedNumber}?text=${encodeURIComponent(
                            `Hi ${profile.displayName}, saw your profile on Frndma!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockClick(profile)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-sm transition-all hover:scale-[1.02]"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Contact (₹399)</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>View Full Details</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Profiles Found</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Try adjusting your age or city filter to see more profiles.
          </p>
          <button
            onClick={() => {
              setMaxAge(45);
              setCity('');
            }}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quick View Profile Modal */}
      {selectedProfile && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-card border border-primary/30 bg-[#140b1a] text-white shadow-glow-lg max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-glow-sm shrink-0">
                  <img
                    src={selectedProfile.avatarUrl}
                    alt={selectedProfile.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading">{selectedProfile.displayName}, {selectedProfile.age}</h3>
                  <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedProfile.city}{selectedProfile.state ? `, ${selectedProfile.state}` : ''}</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {selectedProfile.occupation || 'Private Professional'}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
                <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-1">About Her</h4>
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &quot;{selectedProfile.bio || 'Love meeting real people and having pleasant conversations.'}&quot;
                </p>
              </div>

              {/* Interests */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.interests?.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-pink-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Unlock Status in Modal */}
              <div className="p-5 rounded-2xl glass-card border border-primary/40 bg-gradient-to-br from-[#1e0e26] to-[#120a17]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Contact Status</span>
                  </div>
                  {unlockedIds[selectedProfile.userId] ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      LOCKED
                    </span>
                  )}
                </div>

                {unlockedIds[selectedProfile.userId] ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/40 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {unlockedIds[selectedProfile.userId]}
                      </span>
                      <a
                        href={`https://wa.me/91${unlockedIds[selectedProfile.userId]}?text=Hi%20${encodeURIComponent(
                          selectedProfile.displayName
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                      Unlock direct phone number & WhatsApp contact for <strong>{selectedProfile.displayName}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedProfile(null);
                        handleUnlockClick(selectedProfile);
                      }}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock Contact Details (₹399 via Razorpay)</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Razorpay Payment Modal */}
      <PaymentModal
        isOpen={paymentData.isOpen}
        onClose={() => setPaymentData({ isOpen: false })}
        type="contact_unlock"
        targetProfileId={paymentData.targetProfileId}
        targetProfileName={paymentData.targetProfileName}
        amount={399}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
