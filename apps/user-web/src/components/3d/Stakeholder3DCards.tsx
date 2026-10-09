import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Zap,
  Truck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface CardTiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

const StakeholderCardItem: React.FC<{
  title: string;
  role: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  accentColor: string;
  features: string[];
  metrics: { label: string; value: string }[];
  ctaText: string;
  ctaLink: string;
  graphicComponent: React.ReactNode;
}> = ({
  title,
  role,
  subtitle,
  badge,
  badgeColor,
  icon: Icon,
  accentColor,
  features,
  metrics,
  ctaText,
  ctaLink,
  graphicComponent
}) => {

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<CardTiltState>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (clamped to max +/- 10 degrees)
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glowX, glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  return (
    <div
      ref={cardRef}
      data-role={role}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl p-[1px] transition-all duration-300 ease-out group"
      style={{
        perspective: '1200px'
      }}
    >
      {/* 3D Tilting Card Container */}
      <div
        className="relative h-full flex flex-col justify-between rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 group-hover:border-cyan-500/50 p-7 sm:p-8 transition-all duration-200 overflow-hidden shadow-2xl shadow-slate-950/50"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Cursor-tracking dynamic spotlight reflection */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-3xl"
          style={{
            background: `radial-gradient(circle 350px at ${tilt.glowX}% ${tilt.glowY}%, rgba(14, 165, 233, 0.15), transparent 70%)`
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${accentColor}`}
        />

        <div className="relative z-10">
          {/* Header Row: Badge & Icon */}
          <div className="flex items-center justify-between mb-6">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeColor}`}
            >
              {badge}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all duration-300 shadow-inner">
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-2">
            <span>{title}</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            {subtitle}
          </p>

          {/* 3D Visual Accent Artifact */}
          <div className="my-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 relative overflow-hidden group-hover:border-slate-700 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5 pointer-events-none" />
            {graphicComponent}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60"
              >
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  {metric.label}
                </div>
                <div className="text-base font-mono font-bold text-white mt-0.5">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2.5 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80">
          <Link
            to={ctaLink}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-slate-200 hover:text-white border border-slate-800 hover:border-transparent text-xs font-bold tracking-wide uppercase transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/20"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* 3D Metallic Cargo Container Graphic Accent */
const MetallicCargoContainerGraphic = () => (
  <div className="h-28 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 280 110" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="containerFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="containerTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="containerSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
      </defs>

      {/* 3D Isometric Intermodal Container */}
      {/* Top Face */}
      <polygon points="50,42 190,16 230,28 90,54" fill="url(#containerTop)" opacity="0.9" />
      {/* Right Face */}
      <polygon points="190,16 230,28 230,76 190,64" fill="url(#containerSide)" opacity="0.95" />
      {/* Front Face */}
      <polygon points="50,42 190,16 190,64 50,90" fill="url(#containerFront)" />

      {/* Corrugation ribs */}
      {[70, 90, 110, 130, 150, 170].map((x, idx) => (
        <line
          key={idx}
          x1={x}
          y1={42 - (x - 50) * 0.18}
          x2={x}
          y2={90 - (x - 50) * 0.18}
          stroke="#38bdf8"
          strokeWidth="2"
          opacity="0.35"
        />
      ))}

      {/* Corner Casings & Locks */}
      <rect x="48" y="40" width="4" height="50" fill="#bae6fd" opacity="0.8" />
      <rect x="187" y="15" width="4" height="49" fill="#7dd3fc" opacity="0.8" />

      {/* Telemetry Tag */}
      <g transform="translate(100, 58)">
        <rect x="0" y="0" width="75" height="18" rx="4" fill="#0f172a" opacity="0.85" stroke="#38bdf8" strokeWidth="1" />
        <text x="6" y="12" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
          TEU-9402 • SEALED
        </text>
      </g>
    </svg>
  </div>
);

/* 3D Dispatch Route Grid Topology Graphic Accent */
const DispatchRouteGridGraphic = () => (
  <div className="h-28 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 280 110" className="w-full h-full drop-shadow-2xl">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Grid Network Lines */}
      <path
        d="M 40,75 Q 100,20 160,50 T 240,35"
        fill="none"
        stroke="#0284c7"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.6"
      />
      <path
        d="M 40,75 L 110,85 L 190,80 L 240,35"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M 110,85 L 160,50 L 190,80"
        fill="none"
        stroke="#818cf8"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Network Nodes */}
      {[
        { x: 40, y: 75, r: 4, label: 'CHI' },
        { x: 100, y: 35, r: 3, label: 'DAL' },
        { x: 110, y: 85, r: 5, label: 'ATL' },
        { x: 160, y: 50, r: 6, label: 'NYC' },
        { x: 190, y: 80, r: 4, label: 'MIA' },
        { x: 240, y: 35, r: 5, label: 'LON' }
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r={node.r * 2.2} fill="url(#nodeGlow)" />
          <circle cx={node.x} cy={node.y} r={node.r} fill="#38bdf8" />
          <text
            x={node.x}
            y={node.y - 8}
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Match Confirmation Badge */}
      <g transform="translate(130, 20)">
        <rect x="0" y="0" width="86" height="18" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
        <text x="6" y="12" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="bold">
          MATCHED: $2,840
        </text>
      </g>
    </svg>
  </div>
);

/* 3D Aerodynamic Semi-Truck Trailer Graphic Accent */
const FreightSemiTruckGraphic = () => (
  <div className="h-28 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 280 110" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="cabGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="trailerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Velocity / Airflow Streamlines */}
      <path d="M 10,45 Q 60,40 120,45" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
      <path d="M 20,30 Q 80,25 150,28" fill="none" stroke="#00f2fe" strokeWidth="1.5" opacity="0.4" />
      <path d="M 30,60 Q 90,55 140,58" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.25" />

      {/* 53' Dry Van Trailer */}
      <rect x="60" y="30" width="130" height="42" rx="3" fill="url(#trailerGrad)" stroke="#334155" strokeWidth="1.5" />
      <line x1="60" y1="50" x2="190" y2="50" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />

      {/* Aerodynamic Class 8 Tractor Cab */}
      <path
        d="M 192,42 L 210,32 Q 225,32 232,46 L 244,56 L 244,72 L 192,72 Z"
        fill="url(#cabGrad)"
      />
      {/* Windshield */}
      <polygon points="212,36 226,36 230,48 214,48" fill="#0f172a" opacity="0.8" />
      {/* Aero Fairing Roof Cap */}
      <path d="M 190,30 Q 205,25 218,32 L 190,32 Z" fill="#0284c7" />

      {/* Chassis & Wheels */}
      <rect x="55" y="70" width="185" height="4" fill="#0f172a" />
      {/* Trailer Wheels */}
      <circle cx="85" cy="74" r="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
      <circle cx="103" cy="74" r="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
      {/* Tractor Drive Wheels */}
      <circle cx="204" cy="74" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="222" cy="74" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

      {/* Telemetry Live Speed Pill */}
      <g transform="translate(150, 16)">
        <rect x="0" y="0" width="78" height="16" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <text x="5" y="11" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
          68 MPH • ON-SCHEDULE
        </text>
      </g>
    </svg>
  </div>
);

export const Stakeholder3DCards: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative select-none">
      {/* Section Background Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-4 shadow-lg shadow-cyan-950/20">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Unified Logistics Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
          Architected for Every Side of Freight
        </h2>
        <p className="text-base sm:text-lg text-slate-300">
          Eliminate intermediaries and reduce transit variance with purpose-built tooling calibrated for high-volume shippers, agile brokers, and enterprise carriers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {/* Card 1: Shippers */}
        <StakeholderCardItem
          title="Shippers"
          role="shipper"
          subtitle="Instant lane quoting, guaranteed equipment availability, and real-time shipment monitoring across North American and maritime corridors."
          badge="Enterprise Shippers"
          badgeColor="bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
          icon={Package}
          accentColor="bg-cyan-500"
          graphicComponent={<MetallicCargoContainerGraphic />}
          metrics={[
            { label: 'Booking Speed', value: '< 90 sec' },
            { label: 'Fulfillment Rate', value: '99.8%' }
          ]}
          features={[
            'Direct load posting with automated rate benchmarks',
            'Full GPS milestones & temperature telemetry',
            'Instant e-BOL generation & digital POD retrieval'
          ]}
          ctaText="Post Freight Load"
          ctaLink="/loads/create"
        />

        {/* Card 2: Brokers */}
        <StakeholderCardItem
          title="Brokers"
          role="broker"
          subtitle="Scale gross transaction volume with instant carrier credential validation, multi-leg dispatch orchestration, and digital margin protection."
          badge="Freight Brokerages"
          badgeColor="bg-blue-500/10 text-blue-300 border-blue-500/30"
          icon={Zap}
          accentColor="bg-blue-600"
          graphicComponent={<DispatchRouteGridGraphic />}
          metrics={[
            { label: 'Carrier Matching', value: '12ms AI' },
            { label: 'Gross Margin Boost', value: '+18.4%' }
          ]}
          features={[
            'Real-time FMCSA safety, DOT & COI verification',
            'Automated carrier dispatch & lane rate bidding',
            'Centralized multi-shipper customer billing portal'
          ]}
          ctaText="Explore Broker Board"
          ctaLink="/load-board"
        />

        {/* Card 3: Carriers */}
        <StakeholderCardItem
          title="Carriers"
          role="carrier"
          subtitle="Maximize revenue per mile with zero deadhead return routes, transparent broker rating indices, and guaranteed 24-hour QuickPay."
          badge="Carriers & Fleets"
          badgeColor="bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          icon={Truck}
          accentColor="bg-emerald-500"
          graphicComponent={<FreightSemiTruckGraphic />}
          metrics={[
            { label: 'QuickPay SLA', value: 'Same Day' },
            { label: 'Empty Miles Cut', value: '-34%' }
          ]}
          features={[
            'Access 10,000+ verified dry van, reefer & flatbed loads',
            'Instant Book without phone negotiations',
            '1-Click automated invoice factor settlement'
          ]}
          ctaText="Join Fleet Network"
          ctaLink="/register"
        />
      </div>
    </section>
  );
};

export default Stakeholder3DCards;
