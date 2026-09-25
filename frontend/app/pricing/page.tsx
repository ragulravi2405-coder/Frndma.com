'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const res = await fetchApi('/support/plans');
    if (res.success && res.data && res.data.length > 0) {
      setPlans(res.data);
    } else {
      // Fallback matching mockup
      setPlans([
        {
          _id: 'plan_free',
          name: 'Free',
          price: 0,
          interval: 'month',
          description: 'Basic connection features to get started.',
          features: ['10 Likes per day', 'Standard Discovery Browsing', 'Mutual Match Chat'],
          isPopular: false,
        },
        {
          _id: 'plan_premium',
          name: 'Premium',
          price: 399,
          interval: 'month',
          description: 'Most popular for passionate daters.',
          features: [
            'Unlimited Likes',
            'See Who Liked You',
            'Advanced Filters (City, Age, Interests)',
            'Priority Profile Visibility',
            '1 Contact Unlock credit included',
          ],
          isPopular: true,
        },
        {
          _id: 'plan_plus',
          name: 'Premium Plus',
          price: 199,
          interval: 'month',
          description: 'The ultimate VIP romantic connection tier.',
          features: [
            'All Premium features included',
            '5 Contact Unlock credits included',
            'Read receipts & Message highlights',
            'VIP Profile Badge & Spotlight',
            'Dedicated WhatsApp VIP Support',
          ],
          isPopular: false,
        },
      ]);
    }
    setLoading(false);
  };

  const handleSelectPlan = (plan: any) => {
    if (plan.price === 0) {
      window.location.href = '/discover';
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-pink-300 border border-primary/30 text-xs font-semibold mb-4">
          <Crown className="w-3.5 h-3.5 text-primary" />
          <span>Membership Upgrades</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Unlock More Connections
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400">
          Find someone who truly gets you with enhanced discovery, unlimited likes, and consent-based contact access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
              plan.isPopular
                ? 'glass-card border-2 border-primary shadow-glow-md bg-[#180c20]'
                : 'glass-card border border-white/10 hover:border-white/20'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-glow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-xs text-zinc-400 min-h-[36px]">{plan.description}</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white font-heading">₹{plan.price}</span>
                <span className="text-xs text-zinc-400 font-medium">/{plan.interval || 'month'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features?.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-center transition-all ${
                plan.isPopular
                  ? 'bg-primary text-white hover:bg-primary-hover shadow-glow-sm'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              {plan.price === 0 ? 'Current Free Tier' : `Get ${plan.name} (₹${plan.price})`}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="p-8 rounded-3xl glass-card border border-white/10 bg-[#120a17] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Bank-Grade 256-Bit Payment Security</h4>
            <p className="text-xs text-zinc-400 mt-1">
              All transactions are encrypted and processed through <strong>Razorpay</strong>. We never store payment credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400">
          <span>UPI</span>
          <span>•</span>
          <span>Google Pay</span>
          <span>•</span>
          <span>PhonePe</span>
          <span>•</span>
          <span>Cards</span>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          type="subscription"
          planId={selectedPlan._id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          onSuccess={() => {
            alert(`Congratulations! You have upgraded to ${selectedPlan.name}.`);
          }}
        />
      )}
    </div>
  );
}
