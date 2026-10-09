import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Truck, 
  Package, 
  ArrowRight, 
  Building2, 
  Tag, 
  Navigation,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface LoadCardProps {
  load: any;
  onBookNow: (load: any) => void;
  onPlaceBid: (load: any) => void;
  onClick?: (load: any) => void;
  isBooking?: boolean;
  userRole?: string;
}

export const LoadCard: React.FC<LoadCardProps> = ({
  load,
  onBookNow,
  onPlaceBid,
  onClick,
  isBooking = false,
  userRole = 'CARRIER'
}) => {
  const originCity = load.origin_city || 'Origin';
  const originState = load.origin_state || '';
  const destCity = load.destination_city || 'Destination';
  const destState = load.destination_state || '';
  const rateNum = parseFloat(load.rate || 0);
  const rpm = load.rate_per_mile 
    ? Number(load.rate_per_mile) 
    : load.mileage && rateNum > 0 
      ? rateNum / load.mileage 
      : null;

  const isBiddable = (load.status === 'OPEN' || load.status === 'BIDDING');

  return (
    <Card 
      className="hover:border-brand-blue/50 hover:shadow-md transition-all group cursor-pointer bg-white overflow-hidden border border-slate-200 rounded-2xl"
      onClick={() => onClick && onClick(load)}
    >
      <div className="p-5 sm:p-6 flex flex-col lg:flex-row justify-between gap-6">
        {/* Route Column */}
        <div className="flex-1 space-y-4">
          {/* Top load meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                REF #{load.reference_number || load.id?.substring(0, 8).toUpperCase()}
              </span>
              {load.owner_company_name && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {load.owner_company_name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Doxhaul Escrow
              </span>
            </div>
            <StatusBadge status={load.status} />
          </div>

          {/* Routing Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Origin Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-brand-blue flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Origin / Pickup</p>
                <h4 className="text-base font-bold text-slate-900">
                  {originCity}, {originState}
                </h4>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : 'Immediate'}
                </div>
              </div>
            </div>

            {/* Destination Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 flex-shrink-0 mt-0.5">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Destination / Drop</p>
                <h4 className="text-base font-bold text-slate-900">
                  {destCity}, {destState}
                </h4>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {load.delivery_date ? new Date(load.delivery_date).toLocaleDateString() : 'Flexible'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Freight Specs & Financial Action Column */}
        <div className="flex flex-col justify-between lg:items-end min-w-[260px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-4">
          {/* Rate & RPM */}
          <div className="space-y-1.5 lg:text-right">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              ${rateNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex flex-wrap items-center lg:justify-end gap-2 text-xs">
              {rpm !== null && rpm > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold font-mono border border-emerald-200">
                  ${rpm.toFixed(2)}/mi
                </span>
              )}
              {load.mileage && (
                <span className="text-slate-500 font-medium font-mono">
                  {load.mileage} mi
                </span>
              )}
            </div>
          </div>

          {/* Specs Pills */}
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              {load.equipment_type || 'DRY_VAN'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              {load.weight ? `${Number(load.weight).toLocaleString()} lbs` : 'FTL'}
            </span>
          </div>

          {/* Action Buttons: Book Now & Submit Bid */}
          <div className="w-full pt-1 flex flex-col sm:flex-row gap-2">
            {userRole === 'CARRIER' && isBiddable ? (
              <>
                <button
                  id={`bid-btn-${load.id}`}
                  name="placeBid"
                  aria-label={`Submit Bid or Counter-Offer for load ${load.reference_number || load.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaceBid(load);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl border border-blue-300 bg-blue-50/60 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Submit Bid / Counter-Offer
                </button>
                <button
                  id={`book-btn-${load.id}`}
                  name="bookNow"
                  aria-label={`Book Load Now for $${rateNum.toLocaleString()}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookNow(load);
                  }}
                  disabled={isBooking}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                >
                  {isBooking ? (
                    'Booking...'
                  ) : (
                    <>
                      Book Now (${rateNum.toLocaleString()})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  to={`/loads/${load.id}/tracking`}
                  onClick={(e) => e.stopPropagation()}
                  className="py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  title="View Live ELD Telematics & GPS Radar"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>Live Radar</span>
                </Link>
                <button
                  id={`details-btn-${load.id}`}
                  name="viewDetails"
                  aria-label={`View Full Details for load ${load.reference_number || load.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClick) onClick(load);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer text-center"
                >
                  View Full Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoadCard;
