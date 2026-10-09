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
  Mail,
  MessageSquare,
  AlertCircle,
  Lock,
  Send,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../api/client';

interface ManageBidsModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: any | null;
  onBidAccepted?: () => void;
}

interface RevealedContacts {
  carrier: {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    is_verified: number;
    vehicle_unit_id?: string;
  };
  shipper: {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    is_verified: number;
  };
  facility: {
    pickup_address: string;
    delivery_address: string;
    special_instructions?: string;
  };
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

  // Active chat state
  const [activeChatBid, setActiveChatBid] = useState<any | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatWarning, setChatWarning] = useState<string | null>(null);

  // Revealed contacts modal state
  const [revealedContacts, setRevealedContacts] = useState<RevealedContacts | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const { data: bids = [], isLoading, refetch } = useQuery({
    queryKey: ['bids', load?.id],
    queryFn: async () => {
      if (!load?.id) return [];
      const res = await apiClient.get<any[]>(`/loads/${load.id}/bids`);
      return Array.isArray(res) ? res : ((res as any)?.data || []);
    },
    enabled: !!load?.id && isOpen
  });

  // Query messages for activeChatBid
  const { data: chatMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['bid-messages', activeChatBid?.id],
    queryFn: async () => {
      if (!activeChatBid?.id) return [];
      const res = await apiClient.get<any[]>(`/bids/${activeChatBid.id}/messages`);
      return Array.isArray(res) ? res : ((res as any)?.data || []);
    },
    enabled: !!activeChatBid?.id,
    refetchInterval: activeChatBid ? 4000 : false
  });

  const acceptMutation = useMutation({
    mutationFn: async (bidId: string) => {
      return apiClient.patch(`/bids/${bidId}/accept`);
    },
    onSuccess: async (_, bidId) => {
      setActionSuccess('Bid accepted! Carrier assigned and freight escrow locked.');
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['bids', load?.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (onBidAccepted) onBidAccepted();
      
      // Auto-fetch unlocked contacts
      try {
        const contactRes = await apiClient.get<RevealedContacts>(`/bids/${bidId}/contacts`);
        const payload = (contactRes as any)?.data || contactRes;
        if (payload?.carrier) {
          setRevealedContacts(payload);
        }
      } catch {
        // Fallback or retry via button
      }
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

  const handleOpenContacts = async (bidId: string) => {
    setIsLoadingContacts(true);
    setActionError(null);
    try {
      const res = await apiClient.get<RevealedContacts>(`/bids/${bidId}/contacts`);
      const payload = (res as any)?.data || res;
      setRevealedContacts(payload);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load counterparty contacts');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatBid || !chatMessageInput.trim() || isSendingMessage) return;

    setIsSendingMessage(true);
    setChatWarning(null);

    try {
      await apiClient.post(`/bids/${activeChatBid.id}/messages`, {
        message: chatMessageInput.trim()
      });
      setChatMessageInput('');
      refetchMessages();
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.includes('prohibited') || errMsg.includes('circumvention') || err.code === 'CIRCUMVENTION_DETECTED') {
        setChatWarning('⚠️ Circumvention Blocked: Sharing phone numbers, emails, or off-platform payment talk is strictly prohibited during bidding.');
      } else {
        setChatWarning(errMsg || 'Failed to send message. Please retry.');
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!isOpen || !load) return null;

  const postedRate = Number(load.rate || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
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

        {/* Step 4: Pre-Award Anti-Circumvention Security Banner */}
        <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-semibold leading-relaxed">
            🔒 Secure Bidding Channel: Phone numbers, emails, and off-platform channels are blocked to guarantee escrow protection. Direct counterparty contacts unlock upon bid acceptance.
          </span>
        </div>

        {/* Load Meta Info */}
        <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
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
          <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
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
                        
                        {/* Verified badge with green tick */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          5.0
                        </span>
                      </div>

                      {/* Scoped Information: Zero PII Leaks during Bidding */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {bid.dot_number && <span>DOT: {bid.dot_number}</span>}
                        {bid.mc_number && <span>MC: {bid.mc_number}</span>}
                        {bid.vehicle_unit_id && (
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                            Unit #{bid.vehicle_unit_id}
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

                      {/* Chat & Negotiation Trigger */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveChatBid(bid);
                            setChatWarning(null);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blueHover hover:underline cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Negotiate in Monitored Chat</span>
                        </button>
                      </div>
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
                      ) : isAccepted ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ACCEPTED • ESCROW LOCKED
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenContacts(bid.id)}
                            disabled={isLoadingContacts}
                            className="px-3 py-1.5 rounded-xl bg-brand-blue text-white hover:bg-brand-blueHover text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>View Unlocked Contacts & Facility</span>
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
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

        {/* In-Modal Monitored Chat Drawer */}
        {activeChatBid && (
          <div className="mt-6 p-4 rounded-2xl border border-blue-200 bg-blue-50/40 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-blue" />
                <h4 className="text-sm font-bold text-slate-900">
                  Pre-Award Negotiation with {activeChatBid.company_name || 'Carrier'} (${Number(activeChatBid.amount).toLocaleString()})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveChatBid(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-blue-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Anti-Circumvention Alert if triggered */}
            {chatWarning && (
              <div className="mt-3 p-3 rounded-xl bg-red-100/80 border border-red-300 text-red-900 text-xs flex items-start gap-2 animate-in shake">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{chatWarning}</span>
              </div>
            )}

            {/* Messages Log */}
            <div className="mt-3 max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-white border border-slate-200">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">
                  No negotiation messages yet. Type below to discuss rate specs or schedule.
                </p>
              ) : (
                chatMessages.map((msg: any) => (
                  <div key={msg.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-700">{msg.sender_name || 'Participant'} ({msg.sender_role})</span>
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-800">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Send Input */}
            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                placeholder="Discuss transit terms or offer counter rate..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                disabled={isSendingMessage}
              />
              <button
                type="submit"
                disabled={!chatMessageInput.trim() || isSendingMessage}
                className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {isSendingMessage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* Revealed Contacts Modal (Post-Award Phase) */}
        {revealedContacts && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Post-Award Dispatch Unlocked
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Direct Freight Dispatch & Facility Access
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRevealedContacts(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {/* Awarded Carrier Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-2">
                    Awarded Carrier & Driver
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{revealedContacts.carrier.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </h4>
                      <p className="text-xs text-slate-500">{revealedContacts.carrier.company || 'Carrier Fleet'}</p>
                    </div>
                    {revealedContacts.carrier.vehicle_unit_id && (
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                        Unit #{revealedContacts.carrier.vehicle_unit_id}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a 
                      href={`tel:${revealedContacts.carrier.phone}`} 
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:text-brand-blue transition-colors font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{revealedContacts.carrier.phone || 'Phone on file'}</span>
                    </a>
                    <a 
                      href={`mailto:${revealedContacts.carrier.email}`} 
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:text-brand-blue transition-colors font-medium truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                      <span className="truncate">{revealedContacts.carrier.email || 'Email on file'}</span>
                    </a>
                  </div>
                </div>

                {/* Physical Freight Facility & Warehouse Addresses */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block">
                    Physical Freight Facility Addresses
                  </span>
                  
                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-semibold">Origin Pickup Dock:</strong>
                      <span className="text-slate-600">{revealedContacts.facility.pickup_address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPin className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-semibold">Destination Receiver Warehouse:</strong>
                      <span className="text-slate-600">{revealedContacts.facility.delivery_address}</span>
                    </div>
                  </div>

                  {revealedContacts.facility.special_instructions && (
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                      <strong>Dock Instructions:</strong> {revealedContacts.facility.special_instructions}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setRevealedContacts(null)}
                  className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

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
