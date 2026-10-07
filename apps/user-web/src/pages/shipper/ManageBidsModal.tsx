import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  X, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Star,
  Building2,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../../api/client';

interface ManageBidsModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: any | null;
  onBidAccepted?: () => void;
}

export const ManageBidsModal: React.FC<ManageBidsModalProps> = ({
  isOpen,
  onClose,
  load,
  onBidAccepted
}) => {
  const queryClient = useQueryClient();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: bids = [], isLoading, refetch } = useQuery({
    queryKey: ['bids', load?.id],
    queryFn: async () => {
      if (!load?.id) return [];
      const res = await apiClient.get<any[]>(`/loads/${load.id}/bids`);
      return Array.isArray(res) ? res : ((res as any)?.data || []);
    },
    enabled: !!load?.id && isOpen
  });

  const acceptMutation = useMutation({
    mutationFn: async (bidId: string) => {
      return apiClient.patch(`/bids/${bidId}/accept`);
    },
    onSuccess: () => {
      setActionSuccess('Bid accepted! Carrier assigned and freight escrow locked.');
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['bids', load?.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (onBidAccepted) onBidAccepted();
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to accept bid');
    }
  });

  const declineMutation = useMutation({
    mutationFn: async (bidId: string) => {
      return apiClient.patch(`/bids/${bidId}/decline`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids', load?.id] });
      refetch();
    },
    onError: (err: any) => {
      setActionError(err.message || 'Failed to decline bid');
    }
  });

  if (!isOpen || !load) return null;

  const postedRate = Number(load.rate || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                REF #{load.reference_number || load.id.substring(0, 8).toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {bids.length} {bids.length === 1 ? 'Bid Received' : 'Bids Received'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Carrier Bids & Rate Counter-Offers
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Load Meta Info */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <MapPin className="w-4 h-4 text-brand-blue" />
            <span>{load.origin_city}, {load.origin_state} → {load.destination_city}, {load.destination_state}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Posted Target: <strong className="text-slate-900 font-mono font-bold">${postedRate.toLocaleString()}</strong></span>
            <span>Equipment: <strong className="text-slate-900">{load.equipment_type || 'DRY_VAN'}</strong></span>
          </div>
        </div>

        {/* Notification alerts */}
        {actionSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{actionError}</span>
          </div>
        )}

        {/* Bids List */}
        <div className="mt-5 space-y-4">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2" />
              Loading carrier bids...
            </div>
          ) : bids.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2 stroke-1" />
              <h4 className="text-sm font-bold text-slate-800">No Bids Submitted Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your shipment is active on the Doxhaul Marketplace. Verified carriers are reviewing your route specs.
              </p>
            </div>
          ) : (
            bids.map((bid: any) => {
              const amountNum = Number(bid.amount || 0);
              const diff = amountNum - postedRate;
              const isPending = bid.status === 'PENDING';
              const isAccepted = bid.status === 'ACCEPTED';
              const isRejected = bid.status === 'REJECTED';

              return (
                <div 
                  key={bid.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    isAccepted 
                      ? 'border-emerald-300 bg-emerald-50/30' 
                      : isRejected
                        ? 'border-slate-200 bg-slate-50/60 opacity-60'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* Carrier Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          {bid.company_name || `${bid.first_name || ''} ${bid.last_name || ''}`.trim() || 'Verified Carrier'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          Verified
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          5.0
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {bid.dot_number && <span>DOT: {bid.dot_number}</span>}
                        {bid.mc_number && <span>MC: {bid.mc_number}</span>}
                        {bid.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {bid.phone}
                          </span>
                        )}
                        <span className="text-slate-400">
                          {new Date(bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {bid.notes && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span>"{bid.notes}"</span>
                        </div>
                      )}
                    </div>

                    {/* Financial Offer & Action Buttons */}
                    <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="sm:text-right">
                        <div className="text-2xl font-black text-slate-900 font-mono">
                          ${amountNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {diff !== 0 && (
                          <span className={`text-[11px] font-bold ${diff > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {diff > 0 ? `+$${diff.toFixed(2)} vs target` : `-$${Math.abs(diff).toFixed(2)} vs target`}
                          </span>
                        )}
                      </div>

                      {/* Status Badges or Action Buttons */}
                      {isPending ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => declineMutation.mutate(bid.id)}
                            disabled={declineMutation.isPending || acceptMutation.isPending}
                            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => acceptMutation.mutate(bid.id)}
                            disabled={acceptMutation.isPending || declineMutation.isPending}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {acceptMutation.isPending ? 'Accepting...' : 'Accept Bid'}
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isAccepted 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {bid.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Digital Escrow applies upon bid acceptance.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBidsModal;
