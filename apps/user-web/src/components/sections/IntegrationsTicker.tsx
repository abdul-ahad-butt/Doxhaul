import React from 'react';
import { Cpu, Database, Radio, RefreshCw, Zap } from 'lucide-react';

interface Partner {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: Partner[] = [
  { name: 'Samsara', category: 'Telematics & ELD', icon: Radio },
  { name: 'KeepTruckin', category: 'Fleet Management', icon: Zap },
  { name: 'QuickBooks', category: 'Enterprise Accounting', icon: Database },
  { name: 'Project44', category: 'Supply Chain Visibility', icon: RefreshCw },
  { name: 'TruckStop', category: 'Load Board Ecosystem', icon: Cpu },
];

export const IntegrationsTicker: React.FC = () => {
  return (
    <section className="bg-slate-950/80 border-y border-slate-900 py-8 overflow-hidden relative">
      {/* Subtle edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050811] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050811] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <p className="text-center text-xs font-bold text-slate-500 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Enterprise TMS, ELD & Financial Integrations
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {PARTNERS.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 cursor-default"
              >
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/40 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-base sm:text-lg font-black tracking-tight text-slate-400 group-hover:text-white transition-colors">
                    {partner.name}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500 group-hover:text-cyan-400/80 transition-colors">
                    {partner.category}
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

export default IntegrationsTicker;
