'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShieldAlert,
  CreditCard,
  Heart,
  MessageCircle,
  Unlock,
  Search,
  UserX,
  UserCheck,
  Trash2,
  LogOut,
  RefreshCw,
  Plus,
  Edit3,
  Phone,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
  X,
  Code2,
  MapPin,
  Briefcase,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const PRESET_PHOTOS = [
  { name: 'Portrait 1 (Priya style)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait Denim Flower (Ananya style)', url: 'https://images.unsplash.com/photo-1611771707777-b18858881e77?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait 3 (Sneha style)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait 4 (Kavya style)', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait 5 (Divya style)', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait 6 (Meera style)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Portrait 7 (Keerthi style)', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [girls, setGirls] = useState<any[]>([]);
  const [tab, setTab] = useState<'girls' | 'overview' | 'users' | 'reports' | 'payments'>('girls');
  const [userSearch, setUserSearch] = useState('');
  const [girlSearch, setGirlSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncingCode, setSyncingCode] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Girl Modal State
  const [girlModalOpen, setGirlModalOpen] = useState(false);
  const [editingGirl, setEditingGirl] = useState<any>(null);
  const [savingGirl, setSavingGirl] = useState(false);
  const [girlFormData, setGirlFormData] = useState({
    displayName: '',
    age: 21,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: '',
    occupation: 'Professional',
    avatarUrl: '',
    shareableContact: '',
    interests: 'Music, Travel, Coffee',
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const [sRes, uRes, rRes, pRes, gRes] = await Promise.all([
      fetchApi('/admin/stats'),
      fetchApi('/admin/users'),
      fetchApi('/admin/reports'),
      fetchApi('/admin/payments'),
      fetchApi('/admin/girls'),
    ]);

    if (!sRes.success) {
      router.push('/admin/login');
      return;
    }

    if (sRes.success && sRes.data) setStats(sRes.data);
    if (uRes.success && uRes.data) setUsers(uRes.data);
    if (rRes.success && rRes.data) setReports(rRes.data);
    if (pRes.success && pRes.data) setPayments(pRes.data);
    if (gRes.success && gRes.data) setGirls(gRes.data);

    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingGirl(null);
    setGirlFormData({
      displayName: '',
      age: 21,
      city: 'Chennai',
      state: 'Tamil Nadu',
      bio: 'Loves cheerful conversations, coffee and good movies ✨',
      occupation: 'Student / Professional',
      avatarUrl: PRESET_PHOTOS[0].url,
      shareableContact: '',
      interests: 'Music, Travel, Coffee',
    });
    setGirlModalOpen(true);
  };

  const handleOpenEditModal = (girl: any) => {
    setEditingGirl(girl);
    setGirlFormData({
      displayName: girl.displayName || '',
      age: girl.age || 20,
      city: girl.city || 'Chennai',
      state: girl.state || 'Tamil Nadu',
      bio: girl.bio || '',
      occupation: girl.occupation || '',
      avatarUrl: girl.avatarUrl || '',
      shareableContact: girl.shareableContact || '',
      interests: Array.isArray(girl.interests) ? girl.interests.join(', ') : '',
    });
    setGirlModalOpen(true);
  };

  const handleSaveGirl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!girlFormData.displayName || !girlFormData.avatarUrl) {
      alert('Name and Image URL are required!');
      return;
    }

    setSavingGirl(true);
    let res;
    if (editingGirl) {
      res = await fetchApi(`/admin/girls/${editingGirl.id}`, {
        method: 'PUT',
        body: JSON.stringify(girlFormData),
      });
    } else {
      res = await fetchApi('/admin/girls', {
        method: 'POST',
        body: JSON.stringify(girlFormData),
      });
    }
    setSavingGirl(false);

    if (res.success) {
      setGirlModalOpen(false);
      // Reload girls list
      const gRes = await fetchApi('/admin/girls');
      if (gRes.success && gRes.data) setGirls(gRes.data);
    } else {
      alert(res.message || 'Failed to save profile');
    }
  };

  const handleDeleteGirl = async (girl: any) => {
    if (!confirm(`Are you sure you want to delete profile: ${girl.displayName}?`)) return;

    const res = await fetchApi(`/admin/girls/${girl.id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      setGirls(girls.filter((g) => g.id !== girl.id));
    } else {
      alert(res.message || 'Failed to delete profile');
    }
  };

  const handleSyncFromCode = async () => {
    if (!confirm('Sync all profiles from backend/src/config/girlsProfiles.ts into the database?')) return;
    setSyncingCode(true);
    setSyncMessage('');

    const res = await fetchApi('/admin/girls/sync', {
      method: 'POST',
    });
    setSyncingCode(false);

    if (res.success) {
      setSyncMessage(res.message || 'Profiles synced from code!');
      setTimeout(() => setSyncMessage(''), 5000);
      const gRes = await fetchApi('/admin/girls');
      if (gRes.success && gRes.data) setGirls(gRes.data);
    } else {
      alert(res.message || 'Failed to sync');
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    if (!confirm(`Are you sure you want to perform action: ${action}?`)) return;

    const res = await fetchApi(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });

    if (res.success) {
      loadAdminData();
    } else {
      alert(res.message || 'Action failed');
    }
  };

  const handleAdminLogout = async () => {
    await fetchApi('/admin/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredGirls = girls.filter((g) => {
    const q = girlSearch.toLowerCase();
    return (
      g.displayName?.toLowerCase().includes(q) ||
      g.city?.toLowerCase().includes(q) ||
      g.shareableContact?.includes(q) ||
      g.username?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Admin Control Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-1">Platform Administration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Admin Profile & Contact Management • Logged in securely
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Code Space Notice Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-black/60 border border-pink-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Code-Level Girls Profiles Config Available</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold">
                backend/src/config/girlsProfiles.ts
              </span>
            </h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              Code-layum girls image, WhatsApp number, details direct-ah edit pannalam. Change pannitu keezha irukkura <strong>&apos;Sync from Code&apos;</strong> click pannunga!
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncFromCode}
          disabled={syncingCode}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-glow-sm transition-all disabled:opacity-50"
        >
          {syncingCode ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Sync from Code (girlsProfiles.ts)</span>
        </button>
      </div>

      {syncMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-3 overflow-x-auto">
        <button
          onClick={() => setTab('girls')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            tab === 'girls' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🌸 Girls Profiles & Contacts ({girls.length})</span>
        </button>
        <button
          onClick={() => setTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            tab === 'overview' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            tab === 'users' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Registered Users ({users.length})
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            tab === 'reports' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Reports ({reports.filter((r) => r.status === 'pending').length} pending)
        </button>
        <button
          onClick={() => setTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            tab === 'payments' ? 'bg-primary text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Payments ({payments.length})
        </button>
      </div>

      {/* TAB 1: 🌸 GIRLS PROFILES MANAGEMENT (Admin Exclusive) */}
      {tab === 'girls' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search girls by name, city, phone number..."
                value={girlSearch}
                onChange={(e) => setGirlSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 shadow-glow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Girl Profile</span>
              </button>
            </div>
          </div>

          {/* Girls Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGirls.map((girl) => (
              <div
                key={girl.id}
                className="rounded-3xl glass-card border border-white/10 bg-[#120a17] overflow-hidden flex flex-col hover:border-pink-500/40 transition-all group"
              >
                {/* Photo Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <img
                    src={girl.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={girl.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-transparent" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active</span>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white">
                    Age {girl.age}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-lg font-bold text-white font-heading">{girl.displayName}</h3>
                    <div className="flex items-center gap-1.5 text-zinc-300 text-xs mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{girl.city}, {girl.state}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  {/* Contact / WhatsApp Box */}
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                        Contact / WhatsApp (Revealed on Unlock)
                      </span>
                      <span className="text-xs font-bold text-white tracking-wider">
                        {girl.shareableContact || 'No contact set'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Occupation & Bio */}
                  {girl.occupation && (
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{girl.occupation}</span>
                    </div>
                  )}

                  {girl.bio && (
                    <p className="text-xs text-zinc-300 line-clamp-2 italic leading-relaxed">
                      &ldquo;{girl.bio}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(girl)}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGirl(girl)}
                      className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGirls.length === 0 && (
            <div className="p-12 text-center glass-card rounded-3xl border border-white/5 text-zinc-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-400 opacity-60" />
              <p className="text-sm font-semibold text-white">No profiles found</p>
              <p className="text-xs text-zinc-500 mt-1">
                Add your first girl profile or click &apos;Sync from Code&apos; to load the default profiles!
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                + Add Girl Profile
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overview Tab */}
      {tab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-white/5 bg-[#120a17]">
              <span className="text-zinc-400 text-xs block mb-1">Girls Profiles Active</span>
              <span className="text-3xl font-bold text-pink-400 font-heading">{girls.length}</span>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/5 bg-[#120a17]">
              <span className="text-zinc-400 text-xs block mb-1">Total Users</span>
              <span className="text-3xl font-bold text-white font-heading">{stats.totalUsers}</span>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/5 bg-[#120a17]">
              <span className="text-zinc-400 text-xs block mb-1">Contact Unlocks (₹399)</span>
              <span className="text-3xl font-bold text-emerald-400 font-heading">{stats.contactUnlocksCount}</span>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/5 bg-[#120a17]">
              <span className="text-zinc-400 text-xs block mb-1">Total Revenue</span>
              <span className="text-3xl font-bold text-emerald-400 font-heading">₹{stats.totalRevenue}</span>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by username or mobile..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-2xl glass-card border border-white/5 bg-[#120a17] overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 text-zinc-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users
                  .filter(
                    (u) =>
                      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.mobileNumber?.includes(userSearch)
                  )
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-white">@{u.username}</td>
                      <td className="p-4">{u.mobileNumber}</td>
                      <td className="p-4">
                        {u.isBanned ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-900/40 text-rose-300">
                            Banned
                          </span>
                        ) : u.isSuspended ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-900/40 text-amber-300">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-900/40 text-emerald-300">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.isBanned ? (
                            <button
                              onClick={() => handleUserAction(u._id, 'unban')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300"
                              title="Unban User"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(u._id, 'ban')}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300"
                              title="Ban User"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(u._id, 'delete')}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-300"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className="p-4 rounded-2xl glass-card border border-white/5 bg-[#120a17] flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white">Reason: {r.reason}</span>
                    <p className="text-xs text-zinc-400 mt-1">{r.description || 'No detailed description.'}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      r.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center glass-card rounded-2xl text-zinc-400 text-xs">
              No reports reported.
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {tab === 'payments' && (
        <div className="rounded-2xl glass-card border border-white/5 bg-[#120a17] overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="p-4 text-white font-bold">@{p.userId?.username || 'user'}</td>
                  <td className="p-4 font-mono">{p.razorpayOrderId}</td>
                  <td className="p-4 capitalize">{p.type.replace('_', ' ')}</td>
                  <td className="p-4 font-bold text-white">₹{p.amount}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-900/40 text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT GIRL MODAL */}
      {girlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 p-6 sm:p-8 rounded-3xl glass-card border border-white/10 bg-[#0d0714] text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-heading">
                  {editingGirl ? 'Edit Girl Profile' : 'Add New Girl Profile'}
                </h3>
              </div>
              <button
                onClick={() => setGirlModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGirl} className="space-y-4">
              {/* Image Preview & URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Girl Photo / Image URL <span className="text-pink-400">*</span>
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    {girlFormData.avatarUrl ? (
                      <img
                        src={girlFormData.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    required
                    value={girlFormData.avatarUrl}
                    onChange={(e) => setGirlFormData({ ...girlFormData, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">Or choose a curated portrait preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGirlFormData({ ...girlFormData, avatarUrl: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                          girlFormData.avatarUrl === preset.url
                            ? 'bg-pink-600 border-pink-500 text-white'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Display Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={girlFormData.displayName}
                    onChange={(e) => setGirlFormData({ ...girlFormData, displayName: e.target.value })}
                    placeholder="e.g. Priya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Age (18+) <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={60}
                    required
                    value={girlFormData.age}
                    onChange={(e) => setGirlFormData({ ...girlFormData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Contact / WhatsApp Details */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <label className="block text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp / Phone Number (Revealed on Unlock)</span>
                </label>
                <input
                  type="text"
                  required
                  value={girlFormData.shareableContact}
                  onChange={(e) => setGirlFormData({ ...girlFormData, shareableContact: e.target.value })}
                  placeholder="e.g. 9876543210 (10-digit number)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400 placeholder:text-zinc-500"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  User ₹399 Razorpay payment pannum pothu intha number thaan contact & WhatsApp link-la show aagum.
                </span>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={girlFormData.city}
                    onChange={(e) => setGirlFormData({ ...girlFormData, city: e.target.value })}
                    placeholder="e.g. Chennai, Coimbatore"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">State</label>
                  <input
                    type="text"
                    value={girlFormData.state}
                    onChange={(e) => setGirlFormData({ ...girlFormData, state: e.target.value })}
                    placeholder="Tamil Nadu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Occupation</label>
                <input
                  type="text"
                  value={girlFormData.occupation}
                  onChange={(e) => setGirlFormData({ ...girlFormData, occupation: e.target.value })}
                  placeholder="e.g. UI Designer, College Student, IT Analyst"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bio / About Profile</label>
                <textarea
                  rows={2}
                  value={girlFormData.bio}
                  onChange={(e) => setGirlFormData({ ...girlFormData, bio: e.target.value })}
                  placeholder="Tell something attractive and pleasant..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Interests (Comma separated)</label>
                <input
                  type="text"
                  value={girlFormData.interests}
                  onChange={(e) => setGirlFormData({ ...girlFormData, interests: e.target.value })}
                  placeholder="Travel, Music, Coffee, Photography"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary placeholder:text-zinc-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGirlModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGirl}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 text-white text-xs font-bold shadow-glow-sm transition-all disabled:opacity-50"
                >
                  {savingGirl ? 'Saving...' : editingGirl ? 'Update Profile' : 'Save Girl Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
