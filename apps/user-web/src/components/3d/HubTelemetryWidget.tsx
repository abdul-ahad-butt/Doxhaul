import React from 'react';
import {
  Activity,
  MapPin,
  Navigation,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export interface HubData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  role: 'shipper' | 'broker' | 'carrier';
  volume: string;
  status: string;
  activeFleets: number;
}

export interface LogisticsRoute {
  from: string;
  to: string;
  role: 'shipper' | 'broker' | 'carrier';
  rate: string;
  weight: string;
}

interface HubTelemetryWidgetProps {
  selectedHub: HubData | null;
  routes: LogisticsRoute[];
  onSelectRoute?: (route: LogisticsRoute) => void;
  className?: string;
}

export const HubTelemetryWidget: React.FC<HubTelemetryWidgetProps> = ({
  selectedHub,
  routes,
  onSelectRoute,
  className = ''
}) => {
  if (!selectedHub) return null;

  const connectedRoutes = routes.filter(
    (r) => r.from === selectedHub.id || r.to === selectedHub.id
  );

  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-2xl border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-5 shadow-2xl shadow-cyan-950/30 transition-all duration-300 text-slate-100 ${className}`}
    >
      {/* Header telemetry status */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Hub Telemetry
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Live Dispatch Feed</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>99.9% SYNC</span>
        </div>
      </div>

      {/* Selected Terminal Card */}
      <div className="space-y-3.5">
        <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Active Terminal
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {selectedHub.role.toUpperCase()}
            </span>
          </div>
          <p className="text-base font-extrabold text-white tracking-tight">{selectedHub.name}</p>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
            <span className="text-cyan-400 font-medium">{selectedHub.country}</span>
            <span className="font-mono text-[11px] text-slate-500">
              {selectedHub.lat.toFixed(2)}°, {selectedHub.lng.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Throughput</p>
            <p className="font-mono font-bold text-white text-sm mt-1">{selectedHub.volume}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>Optimal flow</span>
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Active Fleets</p>
            <p className="font-mono font-bold text-white text-sm mt-1">
              {selectedHub.activeFleets.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 mt-0.5">
              <Cpu className="w-2.5 h-2.5" />
              <span>{selectedHub.status}</span>
            </div>
          </div>
        </div>

        {/* Connected Trade Corridors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              Connected Corridors ({connectedRoutes.length})
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Spot Rates</span>
          </div>

          <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
            {connectedRoutes.length === 0 ? (
              <p className="text-[11px] text-slate-500 py-2 text-center bg-slate-950/40 rounded-lg">
                No active routes for selected filter
              </p>
            ) : (
              connectedRoutes.map((r, i) => {
                const isOrigin = r.from === selectedHub.id;
                return (
                  <div
                    key={`${r.from}-${r.to}-${i}`}
                    onClick={() => onSelectRoute?.(r)}
                    className="flex items-center justify-between text-[11px] p-2.5 bg-slate-950/60 hover:bg-slate-950 rounded-xl border border-slate-800/60 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10">
                        <Navigation className={`w-3 h-3 ${isOrigin ? '' : 'rotate-180'} transition-transform`} />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-1">
                          <span className="capitalize">{r.from}</span>
                          <span className="text-slate-600">→</span>
                          <span className="capitalize">{r.to}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 group-hover:text-cyan-400/80 transition-colors">
                          {r.weight}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-300 font-mono font-bold text-xs">{r.rate}</div>
                      <div className="text-[9px] text-slate-500 capitalize">{r.role}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Route Settlement Action */}
        <div className="pt-1">
          <button
            onClick={() => {
              const el = document.getElementById('hero-sign-in-btn') || document.getElementById('nav-login-btn');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-cyan-950/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lock Instant Lane Capacity</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubTelemetryWidget;
