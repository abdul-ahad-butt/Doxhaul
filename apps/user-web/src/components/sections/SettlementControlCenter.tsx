import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Lock,
  Activity,
  Truck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface SettlementFeedItem {
  id: string;
  lane: string;
  amount: string;
  carrier: string;
  time: string;
  protocol: string;
  status: 'SETTLED' | 'INSTANT_PAID' | 'ESCROWED';
}

const RECENT_SETTLEMENTS: SettlementFeedItem[] = [
  {
    id: 'DX-8921',
    lane: 'Dallas, TX → Memphis, TN',
    amount: '$3,450.00',
    carrier: 'Apex Logistics LLC',
    time: '2 mins ago',
    protocol: 'FedNow / RTP',
    status: 'INSTANT_PAID',
  },
  {
    id: 'DX-8894',
    lane: 'Atlanta, GA → Charlotte, NC',
    amount: '$1,820.00',
    carrier: 'Blue Ridge Freight',
    time: '14 mins ago',
    protocol: 'Smart Escrow Release',
    status: 'SETTLED',
  },
  {
    id: 'DX-8879',
    lane: 'Los Angeles, CA → Phoenix, AZ',
    amount: '$2,200.00',
    carrier: 'Pacific Inland Express',
    time: '38 mins ago',
    protocol: 'Instant ACH Core',
    status: 'SETTLED',
  },
  {
    id: 'DX-8851',
    lane: 'Chicago, IL → Detroit, MI',
    amount: '$1,650.00',
    carrier: 'Great Lakes Hauling',
    time: '1 hour ago',
    protocol: 'FedNow / RTP',
    status: 'INSTANT_PAID',
  },
];

type Milestone = 'Booked' | 'In Transit' | 'POD' | 'Paid';

export const SettlementControlCenter: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Milestone>('POD');
  const [isSimulating, setIsSimulating] = useState(false);
  const [settledSuccess, setSettledSuccess] = useState(false);

  const steps: { name: Milestone; label: string; desc: string; time: string }[] = [
    { name: 'Booked', label: 'Rate Con Locked', desc: 'Escrow funded via shipper ACH', time: '10:14 AM' },
    { name: 'In Transit', label: 'GPS Geofenced', desc: 'Real-time ELD telemetry verified', time: '02:45 PM' },
    { name: 'POD', label: 'Optical Scan AI', desc: 'Clean bill of lading verified', time: '04:18 PM' },
    { name: 'Paid', label: '0.0s Payout', desc: 'Direct carrier deposit via RTP', time: '04:19 PM' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.name === activeStep);

  const handleSimulateInstantPayout = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveStep('Paid');
      setIsSimulating(false);
      setSettledSuccess(true);
      setTimeout(() => setSettledSuccess(false), 4000);
    }, 750);
  };

  return (
    <section className="bg-slate-950 py-20 px-6 sm:px-12 border-t border-slate-900 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-lg shadow-cyan-950/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PITCH DECK SLIDE 3: SETTLEMENT ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-5">
            Interactive Settlement{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Control Center
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Automating freight payments with cryptographic escrow. Shipper funds lock upon dispatch, and AI milestone verification releases instant payouts to carriers the moment the POD is confirmed.
          </p>
        </div>

        {/* Top Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Available to Settle</p>
              <p className="text-2xl font-black font-mono text-cyan-400 mt-1">$48,240</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">In Escrow</p>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-1">$18,600</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Loads in Transit</p>
              <p className="text-2xl font-black font-mono text-indigo-400 mt-1">07 Corridors</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Control Center Mockup Window */}
        <div className="bg-[#050811]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
          {/* Mockup Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/90 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">
                ESCROW_ENGINE // PROTOCOL_V3.8 // CHICAGO-HUB
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SMART ESCROW ACTIVE
              </span>

              <button
                onClick={handleSimulateInstantPayout}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Simulate Instant Release</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Active Escrow Load Card & Stepper */}
            <div className="lg:col-span-7 space-y-6">
              {/* Active Escrow Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">LOAD #DX-9402</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        REEFER 53'
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                      <span>Chicago, IL</span>
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                      <span>Columbus, OH</span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Escrow Locked</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                      $2,980.00
                    </span>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3 text-xs font-mono text-slate-400">
                    <span>DISPATCH MILESTONE PROGRESS</span>
                    <span className="text-cyan-400">
                      Step {currentStepIndex + 1} of 4 ({activeStep})
                    </span>
                  </div>

                  {/* Stepper bar */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {steps.map((step, idx) => {
                      const isComplete = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <button
                          key={step.name}
                          onClick={() => setActiveStep(step.name)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isCurrent
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                              : isComplete
                              ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                              : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[11px] font-bold uppercase font-mono ${
                                isCurrent
                                  ? 'text-cyan-300'
                                  : isComplete
                                  ? 'text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.name}
                            </span>
                            {isComplete && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">{step.label}</span>
                          <span className="text-[10px] font-mono text-slate-500 block mt-1">{step.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Milestone Details Callout */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {activeStep === 'Paid'
                          ? 'Escrow Settled: Funds Disbursed to Carrier Account'
                          : activeStep === 'POD'
                          ? 'Optical POD Verified by Gemini AI OCR'
                          : activeStep === 'In Transit'
                          ? 'Continuous GPS Telemetry Tracking Live'
                          : 'Rate Confirmation Executed & Escrow Funded'}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        {activeStep === 'Paid'
                          ? 'Direct ACH / RTP transfer confirmation #TRX-99418721'
                          : 'Automated release trigger will execute immediately upon consignee sign-off.'}
                      </p>
                    </div>
                  </div>

                  {settledSuccess && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs animate-bounce">
                      $2,980 Released!
                    </span>
                  )}
                </div>
              </div>

              {/* AI Verification Badges Strip */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AI Pre-Vetted Verification Trust Stack</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Verified CDL Identity</p>
                      <p className="text-[10px] text-slate-400 font-mono">Biometric FMCSA Match</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Insurance COI</p>
                      <p className="text-[10px] text-slate-400 font-mono">$1.0M Auto + $250k Cargo</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Carrier Profile</p>
                      <p className="text-[10px] text-slate-400 font-mono">0% Double-Broker Risk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Recent Settlements Real-Time Feed */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                      Recent Settlements Feed
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>

                <div className="space-y-3.5 flex-1 overflow-hidden">
                  {RECENT_SETTLEMENTS.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono text-slate-400 font-semibold">{tx.id}</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">{tx.amount}</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">{tx.lane}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tx.carrier}</span>
                        <span className="text-cyan-400 font-mono text-[10px]">{tx.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Settlement Guarantee Banner */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="font-mono text-slate-500">AVERAGE PAYOUT LATENCY:</span>
                  <span className="font-mono text-cyan-400 font-bold">&lt; 3.2 SECONDS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettlementControlCenter;
