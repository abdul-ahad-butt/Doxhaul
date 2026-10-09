import React from 'react';
import { BarChart2, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface MarketStat {
  value: string;
  unit?: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  growthTag: string;
  accent: 'cyan' | 'blue' | 'indigo';
}

const MARKET_STATS: MarketStat[] = [
  {
    value: '$875',
    unit: 'Billion',
    title: 'Total US Freight Market Volume',
    category: 'OVERLAND LOGISTICS TAM',
    description:
      'Overland freight represents the lifeblood of American commerce, with domestic truckload dominating over 72% of all tonnage moved nationwide.',
    details: [
      'Over 11.5 billion tons of primary freight moved annually.',
      'Unbroken demand resilient to macro-economic cycles.',
    ],
    growthTag: 'Massive Macro Scale',
    accent: 'cyan',
  },
  {
    value: '24.8%',
    unit: 'CAGR',
    title: 'Digital Freight Brokerage Expansion',
    category: 'DISRUPTIVE DIGITAL ADOPTION',
    description:
      'Legacy pen-and-paper freight dispatch is experiencing rapid digital consolidation, expanding from manual phone desks into autonomous digital platforms.',
    details: [
      'Projected to exceed $36B in digital brokerage volume by 2028.',
      'High-velocity automated matching capturing double-digit market share.',
    ],
    growthTag: 'Accelerating Shift',
    accent: 'blue',
  },
  {
    value: '92%',
    unit: 'Long-Tail',
    title: 'Fleets Operating ≤ 6 Trucks',
    category: 'UNDERSERVED CORE MARKET',
    description:
      'The overwhelming majority of carriers are independent owner-operators and small fleets lacking enterprise bargaining power and instant capital lines.',
    details: [
      'Critically dependent on immediate cashflow and quickpay liquidity.',
      'Predatory factoring firms exploit this gap with steep margin penalties.',
    ],
    growthTag: 'Critical Pain Point',
    accent: 'indigo',
  },
];

export const MarketOpportunitySection: React.FC = () => {
  return (
    <section className="bg-[#050811] py-20 px-6 sm:px-12 border-t border-slate-900 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-1/4 w-[750px] h-[450px] bg-cyan-600/10 blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-lg shadow-cyan-950/20">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>PITCH DECK SLIDE 4: MARKET OPPORTUNITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-6">
            A Multi-Billion Dollar Modernization{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Inflection Point
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Doxhaul provides the transparent spatial routing and zero-latency escrow layer required to unify
            hundreds of thousands of fragmented long-tail carriers with enterprise freight demand.
          </p>
        </div>

        {/* 3 Core Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {MARKET_STATS.map((stat, idx) => {
            return (
              <div
                key={idx}
                className="group relative bg-slate-950/80 rounded-2xl border border-slate-800/90 p-7 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-950/20 backdrop-blur-xl"
              >
                {/* Top Glowing Gradient Accent */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Category & Growth Tag */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                      {stat.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {stat.growthTag}
                    </span>
                  </div>

                  {/* Gigantic Metric Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="text-xl sm:text-2xl font-bold text-cyan-400">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 mt-2">{stat.title}</h3>
                  </div>

                  {/* Descriptive narrative */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {stat.description}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 mb-6">
                    {stat.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Micro-Meta */}
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>MARKET VECTOR #{idx + 1}</span>
                  <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Thesis</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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

export default MarketOpportunitySection;
