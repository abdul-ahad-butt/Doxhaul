import React from 'react';
import {
  Gauge,
  Thermometer,
  Clock,
  Compass
} from 'lucide-react';

interface TelemetryGaugesProps {
  speedMph: number;
  headingDegrees: number;
  temperatureFahrenheit?: number;
  isReefer?: boolean;
  hosStatus?: 'OFF_DUTY' | 'SLEEPER' | 'DRIVING' | 'ON_DUTY';
  hosHoursRemaining?: number;
  providerSource?: string;
  inDestinationGeofence?: boolean;
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({
  speedMph = 62,
  headingDegrees = 90,
  temperatureFahrenheit = -2.4,
  isReefer = true,
  hosStatus = 'DRIVING',
  hosHoursRemaining = 8.5,
  providerSource = 'Samsara ELD',
  inDestinationGeofence = false,
}) => {
  // Convert heading degrees to cardinal direction
  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return directions[index];
  };

  // Format HOS hours into hours & minutes
  const totalMinutes = Math.round(hosHoursRemaining * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hosPercent = Math.min(100, Math.max(0, (hosHoursRemaining / 11.0) * 100));

  const isColdChainOptimal =
    temperatureFahrenheit !== undefined && temperatureFahrenheit <= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Hours of Service (HOS) Gauge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Driver HOS Duty Status
            </span>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              hosStatus === 'DRIVING'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : hosStatus === 'ON_DUTY'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {hosStatus}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-black font-mono text-white">
              {hours}h {minutes}m
            </span>
            <span className="text-[11px] text-slate-400 ml-1">drive time left</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">11h Rule Cap</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hosHoursRemaining > 3
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                : hosHoursRemaining > 1
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : 'bg-gradient-to-r from-rose-500 to-red-400'
            }`}
            style={{ width: `${hosPercent}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 flex items-center justify-between">
          <span>FMCSA Mandate Compliance</span>
          <span className="text-emerald-400 font-mono">30-Min Rest Ready</span>
        </p>
      </div>

      {/* 2. Cold-Chain Reefer Telemetry Gauge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              {isReefer ? 'Cold-Chain Telemetry' : 'Cargo Bay Climate'}
            </span>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              isColdChainOptimal
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isColdChainOptimal ? 'OPTIMAL FREEZE' : 'STANDARD'}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-black font-mono text-cyan-300">
              {temperatureFahrenheit !== undefined ? `${temperatureFahrenheit.toFixed(1)}°F` : '68.0°F'}
            </span>
            <span className="text-[11px] text-slate-400 ml-1.5">
              [Set Point: -0.0°F]
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">±0.2° Deviation</span>
        </div>

        {/* Temperature Range Indicator */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full w-[85%]" />
        </div>

        <p className="text-[10px] text-slate-400 flex items-center justify-between">
          <span>Continuous Air Stream Log</span>
          <span className="text-cyan-400 font-mono">FSMA Certified</span>
        </p>
      </div>

      {/* 3. Velocity, Heading & ELD Sync Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Velocity & Heading
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SYNC
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-black font-mono text-white">
              {Math.round(speedMph)} MPH
            </span>
            <span className="text-[11px] text-slate-400 ml-1.5">
              Bearing {Math.round(headingDegrees)}° {getCardinalDirection(headingDegrees)}
            </span>
          </div>
          <Compass className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Road condition status */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            style={{ width: `${Math.min(100, (speedMph / 75) * 100)}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 flex items-center justify-between">
          <span className="truncate">Provider: {providerSource.toUpperCase()}</span>
          {inDestinationGeofence ? (
            <span className="text-amber-400 font-mono font-bold">500m Geofence</span>
          ) : (
            <span className="text-slate-400 font-mono">99.9% Uptime</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TelemetryGauges;
