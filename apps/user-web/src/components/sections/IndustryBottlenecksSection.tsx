import React from 'react';
import { Clock, ShieldAlert, Split, AlertTriangle, ArrowDownRight } from 'lucide-react';

interface BottleneckCard {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'amber' | 'rose' | 'cyan';
  statusTag: string;
}

const BOTTLENECKS: BottleneckCard[] = [
  {
    title: 'Cashflow Paralysis',
    category: 'WORKING CAPITAL DRAIN',
    metric: '30 to 60-Day Terms',
    metricLabel: 'Average Payment Lag Across Brokerages',
    bullets: [
      'Factoring fees drain 3%–5% carrier margin on every haul.',
      'Manual audit disputes stall payroll, diesel fuel capital, and preventative fleet maintenance.',
    ],
    icon: Clock,
    accentColor: 'amber',
    statusTag: 'Liquidity Chokehold',
  },
  {
    title: 'Double-Brokering Fraud',
    category: 'IDENTITY & CARGO THEFT',
    metric: '$700M+ Annual Loss',
    metricLabel: 'Stolen Freight & Spoofed Rate Cons in North America',
    bullets: [
      'Unauthorized cargo re-brokering across unregulated ghost dispatchers.',
      'Spoofed carrier identities and forged insurance certificates evade standard vetting.',
    ],
    icon: ShieldAlert,
    accentColor: 'rose',
    statusTag: 'Systemic Vulnerability',
  },
  {
    title: 'Opaque Intermediaries',
    category: 'MARGIN EXTRACTION',
    metric: '15% to 25% Margins',
    metricLabel: 'Middleman Spread Skimmed from Gross Linehaul',
    bullets: [
      'Hidden broker spreads concealed by non-disclosed spot negotiations.',
      'Manual phone tag and fragmented information silos create artificial capacity crunches.',
    ],
    icon: Split,
    accentColor: 'cyan',
    statusTag: 'Zero Price Discovery',
  },
];

export const IndustryBottlenecksSection: React.FC = () => {
  return (
    <section className="bg-[#050811] py-20 px-6 sm:px-12 border-t border-slate-900 relative overflow-hidden">
      {/* Background cyber radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-lg shadow-cyan-950/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>INDUSTRY BOTTLENECKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-6">
            Legacy Freight Suffers From{' '}
            <span className="bg-gradient-to-r from-red-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              Payment Lag, Fraud,
            </span>{' '}
            and Middleman Friction.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            The multi-hundred-billion dollar truckload ecosystem is hindered by manual phone brokering,
            unsecure factoring chains, and unverified paper paperwork that drains driver liquidity and leaves shippers vulnerable.
          </p>
        </div>

        {/* 3-Column Bottlenecks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BOTTLENECKS.map((item, idx) => {
            const Icon = item.icon;
            const isAmber = item.accentColor === 'amber';
            const isRose = item.accentColor === 'rose';

            return (
              <div
                key={idx}
                className="group relative bg-slate-950/80 rounded-2xl border border-slate-800/90 p-7 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-950/20 backdrop-blur-xl"
              >
                {/* Accent top gradient glow */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] transition-opacity duration-300 ${
                    isAmber
                      ? 'bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60 group-hover:opacity-100'
                      : isRose
                      ? 'bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-60 group-hover:opacity-100'
                      : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100'
                  }`}
                />

                <div>
                  {/* Card Header & Tag */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        isAmber
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-105'
                          : isRose
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 group-hover:scale-105'
                          : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isAmber
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : isRose
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                      }`}
                    >
                      {item.statusTag}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono tracking-wider uppercase text-slate-500 mb-1.5 font-semibold">
                    {item.category}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Primary Callout Metric */}
                  <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <div
                      className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                        isAmber ? 'text-amber-400' : isRose ? 'text-rose-400' : 'text-cyan-400'
                      }`}
                    >
                      {item.metric}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{item.metricLabel}</div>
                  </div>

                  {/* Problem Bullets */}
                  <ul className="space-y-3.5 mb-6">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <ArrowDownRight
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isAmber ? 'text-amber-400' : isRose ? 'text-rose-400' : 'text-cyan-400'
                          }`}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Insight Indicator */}
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>PROBLEM VECTOR #{idx + 1}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Critical Impact
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustryBottlenecksSection;
