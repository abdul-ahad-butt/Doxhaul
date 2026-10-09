import React, { useState, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Package, 
  DollarSign, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: any | null;
  onBidSubmitted?: () => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  load,
  onBidSubmitted
}) => {
  const { user, profile } = useAuth();
  const [bidAmount, setBidAmount] = useState<string>('');
  const [vehicleUnitId, setVehicleUnitId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prepopulate or sync when load changes
  React.useEffect(() => {
    if (load) {
      setBidAmount(load.rate ? String(load.rate) : '');
      setVehicleUnitId('');
      setNotes('');
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [load]);

  const currentStatus = (profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION').toUpperCase();
  const isVerified = currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';

  const postedRate = load ? parseFloat(load.rate || 0) : 0;
  const mileage = load?.mileage ? Number(load.mileage) : 0;
  const parsedBid = parseFloat(bidAmount || '0');

  // Dynamic calculations
  const dynamicRpm = useMemo(() => {
    if (!mileage || isNaN(parsedBid) || parsedBid <= 0) return null;
    return (parsedBid / mileage).toFixed(2);
  }, [parsedBid, mileage]);

  const rateDiff = useMemo(() => {
    if (isNaN(parsedBid) || parsedBid <= 0 || !postedRate) return 0;
    return parsedBid - postedRate;
  }, [parsedBid, postedRate]);

  if (!isOpen || !load) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isNaN(parsedBid) || parsedBid <= 0) {
      setErrorMessage('Please enter a valid bid amount greater than $0.');
      return;
    }

    if (!isVerified) {
      setErrorMessage('Your carrier account must be verified before submitting bids.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/loads/${load.id}/bids`, {
        amount: parsedBid,
        vehicle_unit_id: vehicleUnitId.trim() || undefined,
        notes: notes.trim() || undefined
      });

      setSuccessMessage('Bid submitted! The shipper/broker will review your offer.');
      setTimeout(() => {
        setIsSubmitting(false);
        if (onBidSubmitted) onBidSubmitted();
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit bid. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                REF #{load.reference_number || load.id.substring(0, 8).toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {load.equipment_type || 'DRY_VAN'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Submit Freight Bid / Counter-Offer
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Summary */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue" />
              <span className="font-bold text-slate-900">{load.origin_city}, {load.origin_state}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-900">{load.destination_city}, {load.destination_state}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-mono">
              🛣️ {mileage ? `${mileage} mi` : 'Route mileage pending'}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              {load.weight ? `${Number(load.weight).toLocaleString()} lbs` : 'FTL'}
            </span>
            <span className="font-bold text-slate-900">
              Target: <span className="font-mono text-emerald-700 font-bold">${postedRate.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Bid Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="bid-amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between cursor-pointer">
              <span>Your Bid Payout ($ USD) *</span>
              {rateDiff !== 0 && !isNaN(parsedBid) && parsedBid > 0 && (
                <span className={`text-[11px] font-bold ${rateDiff > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {rateDiff > 0 ? `+$${rateDiff.toFixed(2)} above target` : `-$${Math.abs(rateDiff).toFixed(2)} below target`}
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                $
              </div>
              <input
                id="bid-amount"
                name="bidAmount"
                aria-label="Your Bid Payout ($ USD)"
                type="number"
                step="0.01"
                min="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="e.g. 2350.00"
                required
                className="w-full pl-8 pr-28 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono font-bold text-base text-slate-900"
              />
              {dynamicRpm && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                    ${dynamicRpm}/mi
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Shipper posted target is <span className="font-semibold text-slate-700">${postedRate.toLocaleString()}</span>. You can submit an exact match or negotiate a higher counter-offer.
            </p>
          </div>

          <div>
            <label htmlFor="vehicle-unit-id" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
              Truck Unit # / ELD Telematics Vehicle ID (Optional)
            </label>
            <input
              id="vehicle-unit-id"
              name="vehicleUnitId"
              aria-label="Truck Unit # / ELD Telematics Vehicle ID"
              type="text"
              value={vehicleUnitId}
              onChange={(e) => setVehicleUnitId(e.target.value)}
              placeholder="e.g. TRUCK-4092 / VIN-9842"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-xs font-mono font-bold text-slate-900 placeholder:font-normal placeholder-slate-400"
            />
          </div>

          <div>
            <label htmlFor="bid-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
              Equipment & Transit Proposal Notes (Optional)
            </label>
            <textarea
              id="bid-notes"
              name="notes"
              aria-label="Equipment & Transit Proposal Notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Available for immediate pickup with 53ft air-ride reefer. Team drivers available for expedited transit."
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-xs text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Guaranteed Escrow Notice */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Guaranteed Digital Escrow:</span> Upon shipper acceptance, full freight payment is locked in platform escrow and automatically settled to your wallet upon proof-of-delivery confirmation.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="bid-cancel-btn"
              name="cancelBid"
              aria-label="Cancel bid submission"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="bid-submit-btn"
              name="submitBid"
              aria-label="Submit Bid or Counter-Offer"
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>Submitting Bid...</>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Bid / Counter-Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceBidModal;
