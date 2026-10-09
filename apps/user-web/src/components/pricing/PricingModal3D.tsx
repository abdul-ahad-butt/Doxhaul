import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  Package, 
  Smartphone, 
  Radio, 
  Globe2, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { usePricingModal } from '../../context/PricingModalContext';

export interface PlatformPolicies {
  carrierFee: number;
  shipperFee: number;
  brokerFee: number;
  commissionPercent: number;
}

interface TierCardProps {
  role: 'CARRIER' | 'SHIPPER' | 'BROKER';
  badge: string;
  title: string;
  fee: number;
  subtext: string;
  features: { icon: React.ReactNode; title: string; desc: string }[];
  highlight?: boolean;
  ctaText: string;
  onSelect: () => void;
  isLoading: boolean;
}

const TierCard3D: React.FC<TierCardProps> = ({
  role,
  badge,
  title,
  fee,
  subtext,
  features,
  highlight = false,
  ctaText,
  onSelect,
  isLoading,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    // Subtle 3D tilt
    setRotateY(xPct * 16);
    setRotateX(-yPct * 16);

    // Glare position
    setGlarePos({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="h-full flex"
    >
      <div
        ref={cardRef}
        data-role={role}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        className={`relative flex flex-col justify-between w-full rounded-2xl p-6 sm:p-7 transition-all duration-300 transform-gpu overflow-hidden backdrop-blur-xl ${
          highlight
            ? 'bg-gradient-to-b from-slate-900/95 via-[#070d1e]/90 to-[#050811]/95 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20'
            : 'bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 shadow-xl shadow-black/60'
        }`}
      >
        {/* Dynamic mouse glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(34, 211, 238, ${glarePos.opacity}), transparent 60%)`,
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-32 blur-3xl pointer-events-none rounded-full ${
            highlight ? 'bg-cyan-500/20' : 'bg-blue-600/10'
          }`}
        />

        {/* Header Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                highlight
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {highlight && <Sparkles className="w-3 h-3 text-cyan-400" />}
              {badge}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{subtext}</p>

          {/* Pricing Display */}
          <div className="mt-5 mb-6 pb-6 border-b border-slate-800/70">
            {isLoading ? (
              <div className="h-10 w-28 bg-slate-800/60 animate-pulse rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {fee > 0 ? `$${fee}` : 'Free'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {fee > 0 ? 'one-time gate & KYC' : 'no verification fee'}
                </span>
              </div>
            )}
            <p className="text-[11px] text-cyan-400/90 font-mono mt-1">
              ✓ Lifetime marketplace credentials
            </p>
          </div>

          {/* Unlocked Services List */}
          <div className="space-y-3.5 mb-6">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Unlocked Capabilities:
            </p>
            {features.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 group-hover:border-cyan-500/40 text-cyan-400 transition-colors shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 pt-4 border-t border-slate-800/50 mt-auto">
          <button
            type="button"
            data-cta={`onboard-${role.toLowerCase()}`}
            onClick={onSelect}
            className={`w-full group inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer ${
              highlight
                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 hover:brightness-110 shadow-cyan-500/25 hover:shadow-cyan-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-cyan-500/40 shadow-black/40'
            }`}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PricingModal3D: React.FC = () => {
  const { isOpen, closePricing, selectedRole } = usePricingModal();
  const navigate = useNavigate();

  // Fetch live Platform & Onboarding Financial Policies from backend
  const { data: policies, isLoading } = useQuery<PlatformPolicies>({
    queryKey: ['platform-policies'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>('/platform/policies');
        return {
          commissionPercent: Number(res.commissionPercent ?? 8),
          carrierFee: Number(res.carrierFee ?? 25),
          shipperFee: Number(res.shipperFee ?? 30),
          brokerFee: Number(res.brokerFee ?? 50),
        };
      } catch {
        return { commissionPercent: 8, carrierFee: 25, shipperFee: 30, brokerFee: 50 };
      }
    },
    enabled: isOpen,
    staleTime: 0, // Always reflect real-time updates from Admin Panel
    refetchOnMount: true,
  });

  const carrierFee = policies?.carrierFee ?? 25;
  const shipperFee = policies?.shipperFee ?? 30;
  const brokerFee = policies?.brokerFee ?? 50;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePricing();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closePricing]);

  const handleRoleSelect = (roleParam: string) => {
    const target = `/register?role=${roleParam.toLowerCase()}`;
    closePricing(target);
    navigate(target);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closePricing()}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
          />

          {/* Modal Dialog Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#050811]/95 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl overflow-hidden my-auto"
          >
            {/* Background cyber radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-[120px] pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 px-6 sm:px-10 pt-7 pb-4 flex items-start justify-between border-b border-slate-800/80">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TRANSPARENT ONBOARDING POLICIES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ecosystem Access & Verified Onboarding
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  One-time identity underwriting and federal verification fees. No extortionate subscriptions or predatory factoring discounts.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => closePricing()}
                aria-label="Close pricing modal"
                className="p-2 sm:p-2.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 3D Grid */}
            <div className="relative z-10 p-6 sm:p-10 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                {/* 1. CARRIER CARD */}
                <TierCard3D
                  role="CARRIER"
                  badge="DRIVER & FLEET GATE"
                  title="Carriers & Drivers"
                  fee={carrierFee}
                  subtext="Get verified once. Haul with guaranteed instant liquidity."
                  highlight={selectedRole === 'CARRIER'}
                  isLoading={isLoading}
                  ctaText="Onboard as Carrier"
                  onSelect={() => handleRoleSelect('carrier')}
                  features={[
                    {
                      icon: <Zap className="w-4 h-4" />,
                      title: "Instant Settlement via RTP/FedNow",
                      desc: "24-hr payouts with 0% factoring fees.",
                    },
                    {
                      icon: <Package className="w-4 h-4" />,
                      title: "Pre-Funded Escrow Loads",
                      desc: "Direct access to 10,000+ verified dry van, reefer & flatbed loads.",
                    },
                    {
                      icon: <Smartphone className="w-4 h-4" />,
                      title: "Automated e-BOL & POD Processing",
                      desc: "1-click mobile upload with instant consignee verification.",
                    },
                    {
                      icon: <Radio className="w-4 h-4" />,
                      title: "Free Telematics & HOS Sync",
                      desc: "Direct integration with Samsara & KeepTruckin (Motive).",
                    },
                  ]}
                />

                {/* 2. SHIPPER CARD */}
                <TierCard3D
                  role="SHIPPER"
                  badge="DIRECT FREIGHT POSTING"
                  title="Shippers"
                  fee={shipperFee}
                  subtext="Eliminate middleman friction and secure dedicated capacity."
                  highlight={selectedRole === 'SHIPPER' || !selectedRole}
                  isLoading={isLoading}
                  ctaText="Onboard as Shipper"
                  onSelect={() => handleRoleSelect('shipper')}
                  features={[
                    {
                      icon: <ShieldCheck className="w-4 h-4" />,
                      title: "Programmatic Escrow Protection",
                      desc: "Funds held in trust; only released upon signed delivery.",
                    },
                    {
                      icon: <CheckCircle2 className="w-4 h-4" />,
                      title: "100% Pre-Vetted Carriers",
                      desc: "Automated CDL and active COI ($1M Auto + $250k Cargo) checks.",
                    },
                    {
                      icon: <Globe2 className="w-4 h-4" />,
                      title: "Real-Time 3D Spatial Radar",
                      desc: "High-frequency GPS tracking with 500m geofence milestone alerts.",
                    },
                    {
                      icon: <TrendingUp className="w-4 h-4" />,
                      title: "Smart Freight Benchmarking",
                      desc: "AI lane rate forecasting and instant digital rate confirmations.",
                    },
                  ]}
                />

                {/* 3. BROKER CARD */}
                <TierCard3D
                  role="BROKER"
                  badge="ENTERPRISE SCALE & COMPLIANCE"
                  title="Freight Brokers"
                  fee={brokerFee}
                  subtext="Scale lane execution with automated compliance and zero fraud."
                  highlight={selectedRole === 'BROKER'}
                  isLoading={isLoading}
                  ctaText="Onboard as Broker"
                  onSelect={() => handleRoleSelect('broker')}
                  features={[
                    {
                      icon: <Zap className="w-4 h-4" />,
                      title: "< 12ms AI Carrier Matching",
                      desc: "Algorithmic load-to-truck pairing across high-density corridors.",
                    },
                    {
                      icon: <ShieldCheck className="w-4 h-4" />,
                      title: "Zero Double-Brokering Guarantee",
                      desc: "Real-time FMCSA SAFER checks and carrier identity graph.",
                    },
                    {
                      icon: <Layers className="w-4 h-4" />,
                      title: "Multi-Leg Dispatch Orchestration",
                      desc: "Centralized multi-shipper billing and digital margin protection.",
                    },
                    {
                      icon: <FileText className="w-4 h-4" />,
                      title: "Automated Accounting Feeds",
                      desc: "Native sync with QuickBooks Enterprise and TMS software.",
                    },
                  ]}
                />
              </div>

              {/* Bottom Assurance Banner */}
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  All onboarding fees directly cover third-party identity KYC (Persona), federal FMCSA SAFER safety audits, and automated COI certificate underwriting. Zero recurring subscription traps.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
