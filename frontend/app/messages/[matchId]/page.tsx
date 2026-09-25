'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  ShieldAlert,
  Flag,
  Lock,
  Unlock,
  Check,
  CheckCheck,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { PaymentModal } from '@/components/PaymentModal';

export default function ChatWindowPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.matchId as string;

  const [matchData, setMatchData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    initChat();
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const initChat = async () => {
    setLoading(true);

    // 1. Fetch current user
    const meRes = await fetchApi('/auth/me');
    if (meRes.success && meRes.data?.user) {
      setCurrentUser(meRes.data.user);
    }

    // 2. Fetch match info
    const matchRes = await fetchApi(`/matches/${matchId}`);
    if (matchRes.success && matchRes.data) {
      setMatchData(matchRes.data);
    }

    // 3. Fetch messages history
    const msgRes = await fetchApi(`/messages/${matchId}`);
    if (msgRes.success && msgRes.data) {
      setMessages(msgRes.data);
    }

    setLoading(false);

    // 4. Setup Socket.IO
    const socket = getSocket();
    socket.emit('join_match', { matchId });

    socket.on('new_message', (newMsg: any) => {
      if (newMsg.matchId === matchId) {
        setMessages((prev) => [...prev, newMsg]);
        socket.emit('mark_read', { matchId });
      }
    });

    socket.on('user_typing', (data: any) => {
      if (data.matchId === matchId) {
        setPartnerTyping(data.isTyping);
      }
    });

    return () => {
      socket.emit('leave_match', { matchId });
      socket.off('new_message');
      socket.off('user_typing');
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const socket = getSocket();

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { matchId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { matchId });
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const socket = getSocket();
    socket.emit('typing_stop', { matchId });

    // Send via socket
    socket.emit('send_message', { matchId, text });

    // Also persist via REST fallback
    const res = await fetchApi('/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, text }),
    });

    if (res.success && res.data) {
      // Add if socket hasn't immediately echoed
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
    }
  };

  const handleBlockUser = async () => {
    if (!matchData?.user?.id) return;
    if (!confirm(`Are you sure you want to block ${matchData.user.displayName}?`)) return;

    await fetchApi('/support/block', {
      method: 'POST',
      body: JSON.stringify({ blockedUserId: matchData.user.id }),
    });

    alert('User blocked.');
    router.push('/messages');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Conversation Unavailable</h2>
        <p className="text-xs text-zinc-400 mb-6">
          You must have an active mutual match to access this chat room.
        </p>
        <Link href="/messages" className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold">
          Back to Messages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 h-[85vh] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 rounded-3xl glass-card border border-white/10 bg-[#120a17] flex items-center justify-between gap-4 mb-4 shrink-0 shadow-glow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/messages" className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link href={`/profile/${matchData.user.username}`} className="relative">
            <img
              src={matchData.user.avatarUrl}
              alt={matchData.user.displayName}
              className="w-11 h-11 rounded-2xl object-cover border border-primary/40"
            />
            {matchData.user.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#120a17]" />
            )}
          </Link>

          <div className="min-w-0">
            <Link
              href={`/profile/${matchData.user.username}`}
              className="text-sm font-bold text-white hover:text-primary transition-colors truncate block"
            >
              {matchData.user.displayName}
            </Link>
            <span className="text-[11px] text-zinc-400">
              {partnerTyping ? (
                <span className="text-primary font-semibold animate-pulse">Typing...</span>
              ) : matchData.user.isOnline ? (
                <span className="text-emerald-400">Online</span>
              ) : (
                <span>📍 {matchData.user.city || 'Chennai'}</span>
              )}
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/40 border border-primary/30 text-pink-300 text-xs font-semibold hover:bg-pink-900/40"
            title="Unlock Direct Contact"
          >
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>Unlock Contact</span>
          </button>

          <button
            onClick={handleBlockUser}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Block User"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl glass-card border border-white/5 bg-[#0e0714] space-y-3.5">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            <p className="mb-2">No messages yet.</p>
            <p className="text-pink-300">Break the ice and send the first message! ❤️</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-primary to-rose-600 text-white rounded-br-xs shadow-glow-sm'
                      : 'glass-card border border-white/10 bg-[#1a0e22] text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500 px-1">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3 h-3 text-pink-400 inline" />
                      ) : (
                        <Check className="w-3 h-3 text-zinc-500 inline" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {partnerTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 w-fit text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{matchData.user.displayName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary placeholder:text-zinc-500 glass-card"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-glow-sm disabled:opacity-40 transition-all shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Contact Unlock Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="contact_unlock"
        targetProfileId={matchData.user.id}
        targetProfileName={matchData.user.displayName}
        amount={399}
      />
    </div>
  );
}
