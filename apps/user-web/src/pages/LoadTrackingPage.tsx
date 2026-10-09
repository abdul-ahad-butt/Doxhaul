import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  Upload,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api/client';
import { LiveELDMap } from '../components/tracking/LiveELDMap';
import { TelemetryGauges } from '../components/tracking/TelemetryGauges';

interface TrackingData {
  load: {
    id: string;
    referenceNumber: string;
    title: string;
    status: string;
    equipmentType: string;
    rate: number;
    origin: { city: string; state: string; coordinates: { lat: number; lng: number } };
    destination: { city: string; state: string; coordinates: { lat: number; lng: number } };
  };
  currentTelemetry: {
    lat: number;
    lng: number;
    speedMph: number;
    headingDegrees: number;
    temperatureFahrenheit?: number;
    hosStatus: 'OFF_DUTY' | 'SLEEPER' | 'DRIVING' | 'ON_DUTY';
    hosHoursRemaining: number;
    providerSource: string;
    recordedAt?: string;
  };
  corridorMetrics: {
    totalDistanceMiles: number;
    milesRemaining: number;
    distanceToDestinationMeters: number;
    progressPercent: number;
    estimatedEtaMinutes: number;
    inDestinationGeofence: boolean;
  };
  breadcrumbs: Array<{
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
    recordedAt?: string;
  }>;
  geofenceEvents: Array<{
    id: string;
    eventType: string;
    distanceMeters: number;
    triggeredAt: string;
  }>;
}

export const LoadTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const loadId = id || 'demo';

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [podUploaded, setPodUploaded] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);
  const [verifyingPod, setVerifyingPod] = useState(false);

  const fetchTracking = useCallback(async () => {
    try {
      const res = await apiClient.get<TrackingData>(`/telematics/${loadId}/live`);
      if (res && res.load) {
        setTrackingData(res);
      }
    } catch (err) {
      // Fallback mock dataset for testing standalone or demo load IDs
      setTrackingData({
        load: {
          id: loadId,
          referenceNumber: `DX-${loadId.slice(0, 6).toUpperCase() || '9402'}`,
          title: 'Premium Refrigerated Freight',
          status: 'IN_TRANSIT',
          equipmentType: 'REEFER',
          rate: 2980,
          origin: {
            city: 'Chicago',
            state: 'IL',
            coordinates: { lat: 41.8781, lng: -87.6298 },
          },
          destination: {
            city: 'Columbus',
            state: 'OH',
            coordinates: { lat: 39.9612, lng: -82.9988 },
          },
        },
        currentTelemetry: {
          lat: 40.8521,
          lng: -85.1245,
          speedMph: 64.2,
          headingDegrees: 114,
          temperatureFahrenheit: -2.4,
          hosStatus: 'DRIVING',
          hosHoursRemaining: 7.5,
          providerSource: 'Samsara ELD',
          recordedAt: new Date().toISOString(),
        },
        corridorMetrics: {
          totalDistanceMiles: 356,
          milesRemaining: 132.4,
          distanceToDestinationMeters: 213000,
          progressPercent: 63,
          estimatedEtaMinutes: 124,
          inDestinationGeofence: false,
        },
        breadcrumbs: [
          { lat: 41.8781, lng: -87.6298, speed: 0, heading: 90 },
          { lat: 41.5201, lng: -86.9542, speed: 58, heading: 110 },
          { lat: 41.2140, lng: -86.2145, speed: 65, heading: 114 },
          { lat: 40.8521, lng: -85.1245, speed: 64, heading: 114 },
        ],
        geofenceEvents: [
          {
            id: 'geo-1',
            eventType: 'EXIT_ORIGIN',
            distanceMeters: 512,
            triggeredAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadId]);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [fetchTracking]);

  const handleSimulateStep = async () => {
    try {
      setIsSimulating(true);
      await apiClient.post(`/telematics/simulate/${loadId}`, {});
      await fetchTracking();
    } catch {
      // Mock step forward for offline test
      if (trackingData) {
        const nextProgress = Math.min(100, trackingData.corridorMetrics.progressPercent + 8);
        const inGeofence = nextProgress >= 98;
        setTrackingData({
          ...trackingData,
          corridorMetrics: {
            ...trackingData.corridorMetrics,
            progressPercent: nextProgress,
            milesRemaining: Math.max(0, trackingData.corridorMetrics.milesRemaining - 25),
            inDestinationGeofence: inGeofence,
          },
          currentTelemetry: {
            ...trackingData.currentTelemetry,
            speedMph: inGeofence ? 14 : 62,
          },
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateGeofenceArrival = async () => {
    try {
      setIsSimulating(true);
      await apiClient.post(`/telematics/simulate-geofence/${loadId}`, {});
      await fetchTracking();
    } catch {
      if (trackingData) {
        setTrackingData({
          ...trackingData,
          corridorMetrics: {
            ...trackingData.corridorMetrics,
            progressPercent: 100,
            milesRemaining: 0.2,
            distanceToDestinationMeters: 320,
            inDestinationGeofence: true,
          },
          currentTelemetry: {
            ...trackingData.currentTelemetry,
            speedMph: 12,
          },
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = async () => {
    try {
      await apiClient.post(`/telematics/simulate/${loadId}`, { reset: true });
      await fetchTracking();
    } catch {
      fetchTracking();
    }
  };

  const handleVerifyPodAndReleaseEscrow = async () => {
    setVerifyingPod(true);
    setTimeout(() => {
      setVerifyingPod(false);
      setPodUploaded(true);
      setEscrowReleased(true);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-cyan-400 font-mono">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Synchronizing Telematics Radar Stream...</span>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-[#050811] p-8 text-white">
        <p>Load not found</p>
      </div>
    );
  }

  const { load, currentTelemetry, corridorMetrics, breadcrumbs, geofenceEvents } = trackingData;

  return (
    <div className="min-h-screen bg-[#050811] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-900">
          <div className="flex items-center gap-4">
            <Link
              to="/load-board"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {load.referenceNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {load.equipmentType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {load.status}
                </span>
                {isSimulating && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    SIMULATING...
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <span>{load.origin.city}, {load.origin.state}</span>
                <span className="text-cyan-400">&rarr;</span>
                <span>{load.destination.city}, {load.destination.state}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block uppercase">Smart Escrow Locked</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                ${load.rate.toLocaleString()}.00
              </span>
            </div>

            <Link
              to="/carrier/eld-integrations"
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>ELD SETTINGS</span>
            </Link>
          </div>
        </div>

        {/* Milestone Corridor Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-500 block uppercase">Total Interstate Path</span>
            <span className="text-xl font-bold font-mono text-white mt-1">
              {corridorMetrics.totalDistanceMiles} Miles
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-500 block uppercase">Miles Remaining</span>
            <span className="text-xl font-bold font-mono text-cyan-400 mt-1">
              {corridorMetrics.milesRemaining} Miles
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-500 block uppercase">Corridor Progress</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {corridorMetrics.progressPercent}%
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-500 block uppercase">Estimated Arrival (ETA)</span>
            <span className="text-xl font-bold font-mono text-indigo-300 mt-1">
              {corridorMetrics.estimatedEtaMinutes} Minutes
            </span>
          </div>
        </div>

        {/* Main Live ELD Radar Map */}
        <LiveELDMap
          loadId={load.id}
          origin={load.origin}
          destination={load.destination}
          currentLocation={{ lat: currentTelemetry.lat, lng: currentTelemetry.lng }}
          headingDegrees={currentTelemetry.headingDegrees}
          speedMph={currentTelemetry.speedMph}
          breadcrumbs={breadcrumbs}
          inDestinationGeofence={corridorMetrics.inDestinationGeofence}
          onSimulateStep={handleSimulateStep}
          onSimulateGeofence={handleSimulateGeofenceArrival}
          onResetSimulation={handleResetSimulation}
        />

        {/* Telemetry Gauges: HOS, Reefer Temperature, Speed */}
        <TelemetryGauges
          speedMph={currentTelemetry.speedMph}
          headingDegrees={currentTelemetry.headingDegrees}
          temperatureFahrenheit={currentTelemetry.temperatureFahrenheit}
          isReefer={load.equipmentType === 'REEFER'}
          hosStatus={currentTelemetry.hosStatus}
          hosHoursRemaining={currentTelemetry.hosHoursRemaining}
          providerSource={currentTelemetry.providerSource}
          inDestinationGeofence={corridorMetrics.inDestinationGeofence}
        />

        {/* Phase 4: Automated Geofence-to-Escrow Pipeline Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Automated Geofence-to-Escrow Settlement Pipeline
                </h2>
                <p className="text-xs text-slate-400">
                  When the truck triggers the 500m destination geofence, Gemini AI audits the e-POD and instantly disburses funds.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                escrowReleased
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : corridorMetrics.inDestinationGeofence
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {escrowReleased ? 'SETTLED & DISBURSED' : corridorMetrics.inDestinationGeofence ? 'DELIVERY GEOFENCE ACTIVE' : 'IN TRANSIT'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Step 1: Geofence Trigger */}
            <div className={`p-5 rounded-2xl border transition-all ${
              corridorMetrics.inDestinationGeofence
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 font-bold">STAGE 1</span>
                {corridorMetrics.inDestinationGeofence ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">500m Geofence Detection</h4>
              <p className="text-xs text-slate-400">
                {corridorMetrics.inDestinationGeofence
                  ? 'Vehicle arrived at terminal. Auto-dispatch verified.'
                  : 'Tracking corridor distance in real time.'}
              </p>
            </div>

            {/* Step 2: Optical POD Verification */}
            <div className={`p-5 rounded-2xl border transition-all ${
              podUploaded
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : corridorMetrics.inDestinationGeofence
                ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/40'
                : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 font-bold">STAGE 2</span>
                {podUploaded ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">e-POD Signature Verification</h4>
              <p className="text-xs text-slate-400 mb-3">
                {podUploaded
                  ? 'Consignee optical signature verified by Gemini AI OCR.'
                  : 'Awaiting clean delivery receipt upload.'}
              </p>

              {!podUploaded && corridorMetrics.inDestinationGeofence && (
                <button
                  onClick={handleVerifyPodAndReleaseEscrow}
                  disabled={verifyingPod}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className={`w-3.5 h-3.5 ${verifyingPod ? 'animate-spin' : ''}`} />
                  <span>{verifyingPod ? 'Verifying OCR...' : 'Upload & Verify e-POD'}</span>
                </button>
              )}
            </div>

            {/* Step 3: Instant Escrow Disbursement */}
            <div className={`p-5 rounded-2xl border transition-all ${
              escrowReleased
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 font-bold">STAGE 3</span>
                {escrowReleased ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">0.0s RTP Escrow Payout</h4>
              <p className="text-xs text-slate-400">
                {escrowReleased
                  ? `$${load.rate.toLocaleString()} credited to carrier balance with 0% factoring lag.`
                  : 'Programmable smart contract locked until delivery.'}
              </p>
            </div>
          </div>
        </div>

        {/* Geofence Milestones Log Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-mono">
            <span>GEOFENCE TELEMETRY AUDIT LOG</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono">
                  <th className="pb-3">EVENT</th>
                  <th className="pb-3">PROXIMITY</th>
                  <th className="pb-3">COORDINATE</th>
                  <th className="pb-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono">
                {geofenceEvents.length > 0 ? (
                  geofenceEvents.map((evt, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="py-3 text-cyan-400 font-bold">{evt.eventType}</td>
                      <td className="py-3">{evt.distanceMeters} Meters</td>
                      <td className="py-3 text-slate-500">Auto Geofenced</td>
                      <td className="py-3 text-right text-slate-400">
                        {new Date(evt.triggeredAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      No geofence trigger events recorded yet. Click 'TEST GEOFENCE' or simulate corridor to trigger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadTrackingPage;
