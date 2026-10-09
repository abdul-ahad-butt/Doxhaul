import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  BarChart3,
  Clock,
  UserPlus,
  FileSearch,
  Banknote,
  Star,
  MapPin,
  Globe,
  Package,
  Zap,
  Radio,
  Search,
  CheckCircle2,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { DoxhaulLogo } from '../components/common/DoxhaulLogo';
import {
  Stakeholder3DCards,
  HubTelemetryWidget,
  CanvasErrorBoundary,
  GLOBAL_HUBS,
  LOGISTICS_ROUTES,
  HubData
} from '../components/3d';
import {
  IndustryBottlenecksSection,
  SettlementControlCenter,
  MarketOpportunitySection,
  IntegrationsTicker
} from '../components/sections';

// Code-split 3D WebGL engine to avoid downloading 600KB+ Three.js bundle on auth/dashboard routes
const LogisticsGlobe3D = React.lazy(() => import('../components/3d/LogisticsGlobe3D'));
import { usePricingModal } from '../context/PricingModalContext';
import { Footer } from '../components/layout/Footer';

const RevealCard = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal-up h-full" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const LandingPage = () => {
  const { openPricing } = usePricingModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [hoveredHub, setHoveredHub] = useState<HubData | null>(null);
  const [selectedHub, setSelectedHub] = useState<HubData | null>(GLOBAL_HUBS[0]);
  const [toolTipPosition, setToolTipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 sm:px-12 flex justify-between items-center text-white ${
          isScrolled
            ? 'bg-[#050811]/90 backdrop-blur-md shadow-2xl border-b border-slate-800/80'
            : 'bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center focus:outline-none">
          <DoxhaulLogo variant="white" height={26} alt="Doxhaul Logo" />
        </Link>
        <div className="space-x-4 flex items-center relative z-20 pointer-events-auto">
          <button
            type="button"
            id="nav-pricing-btn"
            onClick={() => openPricing()}
            className="text-slate-300 hover:text-cyan-300 font-medium text-sm transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <Link
            to="/login"
            id="nav-login-btn"
            className="text-slate-300 hover:text-cyan-300 font-medium text-sm transition-colors cursor-pointer"
          >
            Log In
          </Link>
          <Link
            to="/register"
            id="nav-get-started-btn"
            className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 ease-out hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white h-10 px-5 text-sm cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Interactive 3D Logistics Hero Section */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between bg-[#050811] text-white pt-28 pb-12 px-6 sm:px-12 overflow-hidden select-none">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-[140px] pointer-events-none" />

        {/* 3D WebGL Canvas Layer - Unobstructed 3D Globe with offset right on desktop */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <CanvasErrorBoundary fallback={<div className="w-full h-full bg-[#050811] animate-pulse" />}>
            <Suspense fallback={<div className="w-full h-full bg-[#050811] animate-pulse" />}>
              <LogisticsGlobe3D
                activeRoleFilter={activeRoleFilter}
                selectedHub={selectedHub}
                setSelectedHub={setSelectedHub}
                hoveredHub={hoveredHub}
                setHoveredHub={setHoveredHub}
                setToolTipPosition={setToolTipPosition}
              />
            </Suspense>
          </CanvasErrorBoundary>
        </div>

        {/* Smooth bottom gradient mask */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050811] to-transparent pointer-events-none z-10" />

        {/* Hub Hover Tooltip Overlay */}
        {hoveredHub && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-150"
            style={{ left: `${toolTipPosition.x}px`, top: `${toolTipPosition.y}px` }}
          >
            <div className="bg-slate-900/95 border border-cyan-500/50 backdrop-blur-xl p-4 rounded-2xl shadow-2xl shadow-cyan-950/60 min-w-[220px]">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {hoveredHub.name}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  {hoveredHub.country}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between text-slate-400">
                  <span>Throughput:</span>
                  <span className="text-white font-mono font-medium">{hoveredHub.volume}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Fleets:</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    {hoveredHub.activeFleets.toLocaleString()} units
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-cyan-400 font-medium">{hoveredHub.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop 2-Column Responsive Hero Grid */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto pt-6 lg:pt-8">
          {/* Left Column (55% width / col-span-7): Copy & Controls */}
          <div className="lg:col-span-7 pointer-events-none">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-xs font-medium text-cyan-400 mb-6 shadow-xl pointer-events-auto">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Autonomous Supply Chain Orchestration</span>
            </div>

            {/* Headline with clamped sizing to preserve viewport fold */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] mb-6">
              Move Freight with Confidence Across{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Global Corridors
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-xl backdrop-blur-sm bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              The verified digital freight network connecting trusted shippers, brokers, and carriers with real-time 3D spatial routing, instant rate settlements, and complete operational transparency.
            </p>

            {/* Stakeholder Perspective Switcher */}
            <div className="mb-8 pointer-events-auto">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Ecosystem Perspective:</span>
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { id: 'all', label: 'Global Corridor View', icon: Globe },
                  { id: 'shipper', label: 'Shippers', icon: Package },
                  { id: 'broker', label: 'Freight Brokers', icon: Zap },
                  { id: 'carrier', label: 'Carriers & Fleets', icon: Truck },
                ].map((role) => {
                  const Icon = role.icon;
                  const isActive = activeRoleFilter === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setActiveRoleFilter(role.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-md border ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pointer-events-auto">
              <Link
                to="/register"
                id="hero-join-network-btn"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>Post Freight Load</span>
              </Link>

              <Link
                to="/load-board"
                id="hero-find-loads-btn"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-white font-semibold text-sm backdrop-blur-md transition-all hover:border-cyan-500/40"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Find Available Loads</span>
              </Link>

              <Link
                to="/register"
                id="hero-fleet-network-btn"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-slate-300 text-sm font-medium transition-all"
              >
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Join Fleet Network</span>
              </Link>

              <Link
                to="/login"
                id="hero-sign-in-btn"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-cyan-300 text-sm font-medium transition-all"
              >
                <span>Sign In</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* Right Column (45% width / col-span-5): Clean framing with docked Telemetry */}
          <div className="lg:col-span-5 flex justify-end items-start pointer-events-none relative min-h-[340px] lg:min-h-[460px]">
            {/* Docked Hub Telemetry Widget with glassmorphic backdrop */}
            <div className="pointer-events-auto w-full max-w-sm ml-auto">
              <HubTelemetryWidget
                selectedHub={selectedHub}
                routes={LOGISTICS_ROUTES}
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-cyan-950/40"
              />
            </div>
          </div>
        </div>

        {/* Bottom Platform Live Statistics Bar */}
        <div className="relative z-20 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-4 border-t border-slate-800/80 backdrop-blur-md bg-slate-950/50 rounded-2xl p-4">
          {[
            { label: 'Gross Volume Moved', value: '$4.2 Billion+', icon: BarChart3, change: '+24% YoY' },
            { label: 'Avg Rate Match Time', value: '< 12ms', icon: Zap, change: 'Instant AI' },
            { label: 'Active Freight Hubs', value: '180 Port Nodes', icon: Globe, change: 'Global Cover' },
            { label: 'Dispatch Accuracy', value: '99.4% On-Time', icon: CheckCircle2, change: 'SLA Guaranteed' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold font-mono text-white">{stat.value}</span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dark-Mode Enterprise Integrations Ticker */}
      <IntegrationsTicker />

      {/* Pitch Deck Slide 2: Industry Bottlenecks Section */}
      <IndustryBottlenecksSection />

      {/* Pitch Deck Slide 3: Interactive Settlement Control Center Mockup */}
      <SettlementControlCenter />

      {/* Pitch Deck Slide 4: Market Opportunity Section */}
      <MarketOpportunitySection />

      {/* Interactive 3D Perspective Stakeholder Section */}
      <div className="bg-[#050811] border-b border-slate-800/80">
        <Stakeholder3DCards />
      </div>

      {/* How It Works - High-Tech Dark Cyber Theme */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <span>OPERATIONAL WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            How Doxhaul Works
          </h2>
          <p className="text-base text-slate-400">
            A frictionless three-stage cycle engineered to eliminate middleman delays and secure immediate settlement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/40 to-cyan-500/20 -z-10 -translate-y-1/2" />

          <RevealCard delay={0}>
            <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800/90 shadow-xl text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-cyan-500/40 group backdrop-blur-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 text-lg font-black shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <UserPlus className="w-7 h-7 text-cyan-400 mx-auto mb-4 group-hover:-rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-white mb-3">Instant KYC & Compliance</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect your MC/DOT, upload insurance certificates, and let automated optical audits verify your credentials in seconds.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={100}>
            <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800/90 shadow-xl text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-cyan-500/40 group backdrop-blur-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 text-lg font-black shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <FileSearch className="w-7 h-7 text-cyan-400 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-white mb-3">AI Corridor Matching</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Shippers lock spot rates into programmable escrow; vetted carriers instantly book transparent hauls with zero double-brokering risk.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={200}>
            <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800/90 shadow-xl text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-cyan-500/40 group backdrop-blur-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 text-lg font-black shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <Banknote className="w-7 h-7 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-white mb-3">Real-Time POD & Payout</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Upload your delivery receipt at destination. AI validates the consignee signature and triggers immediate RTP escrow disbursement.
              </p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 px-6 sm:px-12 bg-slate-950 border-t border-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevealCard delay={0}>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group cursor-default">
              <ShieldCheck className="w-10 h-10 mx-auto text-cyan-400 mb-4 group-hover:scale-110 transition-all duration-300" />
              <h4 className="text-base font-bold mb-2 text-white">Verified Identity & CDL</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every carrier and driver is authenticated with live FMCSA databases and fraud prevention guards.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={100}>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group cursor-default">
              <BarChart3 className="w-10 h-10 mx-auto text-cyan-400 mb-4 group-hover:scale-110 transition-all duration-300" />
              <h4 className="text-base font-bold mb-2 text-white">Algorithmic Rate Parity</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fair market pricing calculated from spatial lane demand, eliminating hidden 25% brokerage markups.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={200}>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group cursor-default">
              <ShieldCheck className="w-10 h-10 mx-auto text-cyan-400 mb-4 group-hover:scale-110 transition-all duration-300" />
              <h4 className="text-base font-bold mb-2 text-white">Automated Smart Escrow</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Funds are reserved upfront and released automatically upon delivery without 30-day factoring lags.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={300}>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group cursor-default">
              <Clock className="w-10 h-10 mx-auto text-cyan-400 mb-4 group-hover:scale-110 transition-all duration-300" />
              <h4 className="text-base font-bold mb-2 text-white">High-Frequency Telemetry</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Real-time ELD integration gives shippers minute-by-minute ETA precision across every active corridor.
              </p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Live Load Board Preview - Dark Cyber Theme */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <span>REAL-TIME SPOT MARKET</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Live Load Board Feed</h2>
          <p className="text-base text-slate-400">
            Thousands of verified loads posted daily across North American freight lanes.
          </p>
        </div>

        <div className="relative rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/90 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                  <th className="p-4">Origin &rarr; Destination</th>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Pickup Date</th>
                  <th className="p-4 text-right">Escrow Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Dallas, TX &rarr; Chicago, IL
                  </td>
                  <td className="p-4 text-slate-300 text-sm">Reefer (53')</td>
                  <td className="p-4 text-slate-400 text-sm">Today</td>
                  <td className="p-4 text-right font-bold font-mono text-emerald-400">$2,450</td>
                </tr>
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Atlanta, GA &rarr; Miami, FL
                  </td>
                  <td className="p-4 text-slate-300 text-sm">Dry Van</td>
                  <td className="p-4 text-slate-400 text-sm">Tomorrow</td>
                  <td className="p-4 text-right font-bold font-mono text-emerald-400">$1,800</td>
                </tr>
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Los Angeles, CA &rarr; Phoenix, AZ
                  </td>
                  <td className="p-4 text-slate-300 text-sm">Flatbed</td>
                  <td className="p-4 text-slate-400 text-sm">Oct 12</td>
                  <td className="p-4 text-right font-bold font-mono text-emerald-400">$1,200</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Blurred Overlay with Cyber Auth Card */}
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] flex items-center justify-center top-1/4">
            <div className="bg-slate-900/95 p-6 rounded-2xl shadow-2xl border border-slate-800 text-center max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-2">Access 10,000+ Active Freight Hauls</h3>
              <p className="text-slate-300 text-sm mb-6">
                Create a verified free account to view detailed shipper profiles, broker ratings, and book instant loads.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl font-bold transition-all duration-150 ease-out hover:scale-[1.02] shadow-lg shadow-cyan-500/25 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 h-10 px-5 text-sm w-full"
              >
                Create Free Carrier Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Dark Theme */}
      <section className="bg-slate-950 py-24 px-6 sm:px-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
              <span>CUSTOMER VALIDATION</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Trusted by Fleets & Shippers</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <RevealCard delay={0}>
              <div className="bg-slate-900/70 p-8 rounded-2xl border border-slate-800 shadow-xl h-full transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 group">
                <div className="flex gap-1 text-amber-400 mb-4 group-hover:scale-105 origin-left transition-transform duration-300">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-base text-slate-300 font-medium mb-6 leading-relaxed italic">
                  "Doxhaul has completely transformed how we source carrier capacity. The instant smart escrow and automated POD verification have eliminated hundreds of dispute hours every single month."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center font-bold text-base">
                    SJ
                  </div>
                  <div>
                    <div className="font-bold text-white">Sarah Jenkins</div>
                    <div className="text-xs text-slate-400">VP of Logistics, Apex Freight Distribution</div>
                  </div>
                </div>
              </div>
            </RevealCard>

            <RevealCard delay={100}>
              <div className="bg-slate-900/70 p-8 rounded-2xl border border-slate-800 shadow-xl h-full transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 group">
                <div className="flex gap-1 text-amber-400 mb-4 group-hover:scale-105 origin-left transition-transform duration-300">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-base text-slate-300 font-medium mb-6 leading-relaxed italic">
                  "As an owner-operator with 4 trucks, surviving on 60-day broker invoices with 5% factoring fees was killing us. With Doxhaul, we deliver the load, upload the POD, and the payout hits our bank instantly."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-base">
                    MR
                  </div>
                  <div>
                    <div className="font-bold text-white">Mike Rodriguez</div>
                    <div className="text-xs text-slate-400">Fleet Owner, Rodriguez Transport Logistics</div>
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* FAQ Section - Dark Theme */}
      <section className="bg-slate-950 py-24 px-6 sm:px-12 border-t border-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
              <span>KNOWLEDGE BASE</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-base text-slate-400">Everything you need to know about the Doxhaul platform.</p>
          </div>

          <div className="space-y-4">
            <RevealCard delay={0}>
              <details className="group bg-slate-900/70 rounded-2xl border border-slate-800 transition-all duration-200 open:border-cyan-500/40 open:bg-slate-900/90">
                <summary className="flex justify-between items-center font-bold text-white p-6 cursor-pointer list-none">
                  <span>How quickly can I get onboarded and verified?</span>
                  <span className="transition-transform group-open:rotate-180 text-cyan-400 font-bold">&darr;</span>
                </summary>
                <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed">
                  Most carrier accounts are validated within minutes. Our automated system connects directly to FMCSA, checking your DOT/MC safety history, verifying Certificate of Insurance (COI) limits, and validating W-9 records instantaneously.
                </div>
              </details>
            </RevealCard>

            <RevealCard delay={100}>
              <details className="group bg-slate-900/70 rounded-2xl border border-slate-800 transition-all duration-200 open:border-cyan-500/40 open:bg-slate-900/90">
                <summary className="flex justify-between items-center font-bold text-white p-6 cursor-pointer list-none">
                  <span>How does Doxhaul Smart Escrow prevent payment delays?</span>
                  <span className="transition-transform group-open:rotate-180 text-cyan-400 font-bold">&darr;</span>
                </summary>
                <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed">
                  Shippers deposit freight charges into a programmatic escrow account when the rate confirmation is locked. Once the carrier arrives at the delivery hub and uploads the Proof of Delivery (POD), our AI OCR engine matches signatures and automatically disburses the funds directly to the carrier's bank account via RTP or FedNow.
                </div>
              </details>
            </RevealCard>

            <RevealCard delay={200}>
              <details className="group bg-slate-900/70 rounded-2xl border border-slate-800 transition-all duration-200 open:border-cyan-500/40 open:bg-slate-900/90">
                <summary className="flex justify-between items-center font-bold text-white p-6 cursor-pointer list-none">
                  <span>Do you support ELD tracking integrations?</span>
                  <span className="transition-transform group-open:rotate-180 text-cyan-400 font-bold">&darr;</span>
                </summary>
                <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed">
                  Yes! We integrate with major telematics and ELD providers including Samsara, KeepTruckin, and Project44, as well as providing lightweight mobile geofence updates to ensure 100% route transparency without draining battery.
                </div>
              </details>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* Final Cyber CTA */}
      <section className="bg-gradient-to-b from-[#050811] via-slate-950 to-[#050811] relative overflow-hidden text-white py-24 px-6 sm:px-12 text-center border-t border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-6">
            <span>GET STARTED TODAY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Ready to Move Freight at the Speed of Code?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of shippers, brokers, and carriers moving freight efficiently across global corridors on the Doxhaul network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl font-bold transition-all duration-150 ease-out hover:scale-105 shadow-xl shadow-cyan-500/25 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 h-12 px-8 text-base w-full sm:w-auto"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 ease-out hover:scale-[1.02] bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 h-12 px-8 text-base w-full sm:w-auto"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
