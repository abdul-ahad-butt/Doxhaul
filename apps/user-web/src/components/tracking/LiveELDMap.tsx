import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Breadcrumb {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  recordedAt?: string;
}

interface LiveELDMapProps {
  loadId: string;
  origin: { city: string; state: string; coordinates: Coordinates };
  destination: { city: string; state: string; coordinates: Coordinates };
  currentLocation: Coordinates;
  headingDegrees?: number;
  speedMph?: number;
  breadcrumbs?: Breadcrumb[];
  inDestinationGeofence?: boolean;
  onSimulateStep?: () => Promise<void>;
  onSimulateGeofence?: () => Promise<void>;
  onResetSimulation?: () => Promise<void>;
  className?: string;
}

export const LiveELDMap: React.FC<LiveELDMapProps> = ({
  loadId,
  origin,
  destination,
  currentLocation,
  headingDegrees = 90,
  speedMph = 62,
  breadcrumbs = [],
  inDestinationGeofence = false,
  onSimulateStep,
  onSimulateGeofence,
  onResetSimulation,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);

  // Stop auto play when truck hits destination geofence
  useEffect(() => {
    if (inDestinationGeofence && isPlaying) {
      setIsPlaying(false);
    }
  }, [inDestinationGeofence]);

  // Handle continuous simulation playback
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = window.setInterval(async () => {
        if (onSimulateStep && !isProcessing) {
          setIsProcessing(true);
          try {
            await onSimulateStep();
          } finally {
            setIsProcessing(false);
          }
        }
      }, 1600);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isProcessing, onSimulateStep]);

  // Map 2D Coordinate Normalization bounds
  const lats = [origin.coordinates.lat, destination.coordinates.lat, currentLocation.lat, ...breadcrumbs.map(b => b.lat)];
  const lngs = [origin.coordinates.lng, destination.coordinates.lng, currentLocation.lng, ...breadcrumbs.map(b => b.lng)];

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add 15% padding
  const padLat = Math.max(0.4, (maxLat - minLat) * 0.18);
  const padLng = Math.max(0.4, (maxLng - minLng) * 0.18);

  const boundMinLat = minLat - padLat;
  const boundMaxLat = maxLat + padLat;
  const boundMinLng = minLng - padLng;
  const boundMaxLng = maxLng + padLng;

  // Projection helper: SVG ViewBox (800 x 480)
  const project = (lat: number, lng: number) => {
    const x = ((lng - boundMinLng) / (boundMaxLng - boundMinLng)) * 740 + 30;
    const y = 450 - ((lat - boundMinLat) / (boundMaxLat - boundMinLat)) * 400;
    return { x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(460, y)) };
  };

  const originPt = project(origin.coordinates.lat, origin.coordinates.lng);
  const destPt = project(destination.coordinates.lat, destination.coordinates.lng);
  const truckPt = project(currentLocation.lat, currentLocation.lng);

  // Polyline corridor
  const breadcrumbPts = breadcrumbs.map(b => project(b.lat, b.lng));
  const fullPathPoints = [originPt, ...breadcrumbPts, truckPt];
  const polylineStr = fullPathPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div id={`live-eld-map-${loadId}`} data-load-id={loadId} className={`relative bg-[#050811] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${className}`}>
      {/* Top Map HUD Controls & Status */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            RADAR GPS // {origin.city} &rarr; {destination.city}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 ml-1">
            {currentLocation.lat.toFixed(4)}°, {currentLocation.lng.toFixed(4)}°
          </span>
        </div>

        {/* Action Controls for Simulator */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1.5 rounded-xl shadow-lg">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30'
            }`}
            title="Auto-Play Telematics Stream"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'SIMULATE'}</span>
          </button>

          <button
            onClick={async () => {
              if (onSimulateStep && !isProcessing) {
                setIsProcessing(true);
                try {
                  await onSimulateStep();
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Step GPS Forward"
          >
            <FastForward className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={async () => {
              if (onSimulateGeofence && !isProcessing) {
                setIsProcessing(true);
                try {
                  await onSimulateGeofence();
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            disabled={isProcessing}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
            title="Test 500m Delivery Geofence Arrival"
          >
            TEST GEOFENCE
          </button>

          <button
            onClick={async () => {
              setIsPlaying(false);
              if (onResetSimulation) {
                await onResetSimulation();
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Geofence Alert Overlay Banner */}
      {inDestinationGeofence && (
        <div className="absolute top-16 left-4 right-4 z-20 animate-fade-in pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 backdrop-blur-xl flex items-center justify-between text-xs text-amber-200 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="font-bold text-amber-300">
                GEOFENCE TRIGGERED: Vehicle within 500m of Destination ({destination.city}).
              </span>
              <span className="text-slate-300 hidden sm:inline">
                Milestone advanced to ARRIVED_AT_DESTINATION. Prompting driver for e-POD.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              500m RADIUS
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas Map */}
      <div className="w-full h-[420px] sm:h-[480px] relative select-none">
        <svg
          viewBox="0 0 800 480"
          className="w-full h-full bg-gradient-to-b from-[#050811] via-slate-950 to-[#050811]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.6" />
            </pattern>
            {/* Radial Glow Gradient */}
            <radialGradient id="geofence-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dest-geofence-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="800" height="480" fill="url(#radar-grid)" />

          {/* Planned Highway Route Line (Dashed) */}
          <line
            x1={originPt.x}
            y1={originPt.y}
            x2={destPt.x}
            y2={destPt.y}
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="6,6"
          />

          {/* Completed Trail Polyline */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          />

          {/* Origin Marker & 500m Geofence Ring */}
          <g transform={`translate(${originPt.x}, ${originPt.y})`}>
            <circle r="42" fill="url(#geofence-glow)" />
            <circle r="42" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
            <circle r="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
            <circle r="3" fill="#38bdf8" />
            <text x="14" y="4" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {origin.city} (ORIGIN)
            </text>
            <text x="14" y="16" fill="#64748b" fontSize="9" fontFamily="monospace">
              500m Geofence Ring
            </text>
          </g>

          {/* Destination Marker & 500m Geofence Ring */}
          <g transform={`translate(${destPt.x}, ${destPt.y})`}>
            <circle r="48" fill="url(#dest-geofence-glow)" />
            <circle
              r="48"
              fill="none"
              stroke={inDestinationGeofence ? '#fbbf24' : '#38bdf8'}
              strokeWidth={inDestinationGeofence ? '2' : '1.2'}
              strokeDasharray={inDestinationGeofence ? 'none' : '4,4'}
              className={inDestinationGeofence ? 'animate-pulse' : ''}
            />
            <circle r="9" fill="#0f172a" stroke={inDestinationGeofence ? '#fbbf24' : '#38bdf8'} strokeWidth="2.5" />
            <circle r="3.5" fill={inDestinationGeofence ? '#fbbf24' : '#38bdf8'} />
            <text x="16" y="4" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {destination.city} (CONSIGNEE)
            </text>
            <text x="16" y="16" fill="#06b6d4" fontSize="9" fontFamily="monospace">
              500m Delivery Geofence
            </text>
          </g>

          {/* Active Truck Marker with Directional Heading Angle */}
          <g
            transform={`translate(${truckPt.x}, ${truckPt.y})`}
            className="transition-transform duration-700 ease-out"
          >
            {/* Pulsing Signal Wave */}
            <circle r="22" fill="#06b6d4" opacity="0.2" className="animate-ping" />
            <circle r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />

            {/* Rotated Truck / Navigation Arrow Heading */}
            <g transform={`rotate(${headingDegrees - 45})`}>
              <polygon
                points="0,-9 7,7 0,3 -7,7"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="1"
              />
            </g>

            {/* Truck Info Tooltip Tag */}
            <g transform="translate(18, -12)">
              <rect
                width="118"
                height="34"
                rx="6"
                fill="#0f172a"
                stroke="#06b6d4"
                strokeWidth="1"
                opacity="0.95"
              />
              <text x="8" y="14" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                TRUCK // {Math.round(speedMph)} MPH
              </text>
              <text x="8" y="27" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                Heading {Math.round(headingDegrees)}°
              </text>
            </g>
          </g>
        </svg>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Completed Trail
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-b border-dashed border-slate-500 inline-block" /> Planned Interstate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 border-dashed inline-block" /> 500m Geofence
            </span>
          </div>
          <span className="text-cyan-400">Precision GPS: ± 3.4m</span>
        </div>
      </div>
    </div>
  );
};

export default LiveELDMap;
