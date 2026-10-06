import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  Lock, 
  MapPin, 
  Truck, 
  Navigation, 
  Compass, 
  X, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PostLoadModal } from '../components/PostLoadModal';
import { VerificationAlertBanner } from '../components/dashboard/VerificationAlertBanner';
import { DATFilterBar, FilterState, INITIAL_FILTERS } from '../components/loadboard/DATFilterBar';

export const LoadBoardPage = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // DAT Filter Bar State
  const [filters, setFilters] = useState<FilterState>(() => ({
    origin: searchParams.get('origin') || '',
    deadheadRadius: searchParams.get('deadhead') || '100',
    destination: searchParams.get('destination') || '',
    anywhere: searchParams.get('anywhere') === 'true',
    equipment: searchParams.get('equipment') ? searchParams.get('equipment')!.split(',') : ['ALL'],
    loadSize: searchParams.get('loadSize') || 'ALL',
    pickupDate: searchParams.get('pickupDate') || 'ALL',
    minRate: searchParams.get('minRate') || '',
    minRpm: searchParams.get('minRpm') || '',
    sort: searchParams.get('sort') || 'NEWEST',
  }));

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedLoadForDetails, setSelectedLoadForDetails] = useState<any | null>(null);

  const currentStatus = (profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION').toUpperCase();
  const isVerified = currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';

  useEffect(() => {
    if (searchParams.get('action') === 'post') {
      if (isVerified) {
        setIsPostModalOpen(true);
      } else {
        navigate('/profile');
      }
    }
  }, [searchParams, isVerified, navigate]);

  // Construct query string for API
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.origin.trim()) params.set('origin', filters.origin.trim());
    if (filters.deadheadRadius) params.set('deadhead', filters.deadheadRadius);
    if (!filters.anywhere && filters.destination.trim()) {
      params.set('destination', filters.destination.trim());
    }
    if (filters.anywhere) params.set('anywhere', 'true');
    if (!filters.equipment.includes('ALL') && filters.equipment.length > 0) {
      params.set('equipment', filters.equipment.join(','));
    }
    if (filters.loadSize !== 'ALL') params.set('loadSize', filters.loadSize);
    if (filters.pickupDate !== 'ALL') params.set('pickupDate', filters.pickupDate);
    if (filters.minRate) params.set('minRate', filters.minRate);
    if (filters.minRpm) params.set('minRpm', filters.minRpm);
    if (filters.sort) params.set('sort', filters.sort);
    return params.toString();
  }, [filters]);

  const { data: loadsResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['loads', queryString],
    queryFn: () => apiClient.get<{ items: any[]; total: number }>(`/loads${queryString ? `?${queryString}` : ''}`),
  });

  const loadsList: any[] = loadsResponse?.items || (Array.isArray(loadsResponse) ? loadsResponse : []);
  const totalCount = loadsResponse?.total ?? loadsList.length;

  const bookMutation = useMutation({
    mutationFn: (loadId: string) => {
      if (!isVerified) {
        throw new Error('Your profile is pending verification. Please complete document submission to unlock load booking.');
      }
      return apiClient.post(`/loads/${loadId}/book`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSelectedLoadForDetails(null);
      alert('Load booked successfully! Escrow terms initialized.');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to book load');
      if (!isVerified) {
        navigate('/profile');
      }
    }
  });

  const handlePostClick = () => {
    if (!isVerified) {
      navigate('/profile');
      return;
    }
    setIsPostModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <VerificationAlertBanner 
        status={currentStatus}
        role={user?.role}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            Load Board
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live DAT Network
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time North American commercial freight marketplace with guaranteed digital escrow.
          </p>
        </div>

        {(user?.role === 'SHIPPER' || user?.role === 'BROKER') && (
          <Button 
            onClick={handlePostClick} 
            className={`shadow-md ${!isVerified ? 'bg-gray-600 hover:bg-gray-700' : 'bg-brand-blue hover:bg-blue-600'}`}
          >
            {!isVerified && <Lock className="w-4 h-4 mr-1.5" />}
            Post New Load
          </Button>
        )}
      </div>

      {/* Post Load Modal */}
      <PostLoadModal 
        isOpen={isPostModalOpen} 
        onClose={() => {
          setIsPostModalOpen(false);
          if (searchParams.get('action') === 'post') {
            searchParams.delete('action');
            setSearchParams(searchParams);
          }
        }} 
      />

      {/* Industry-Standard DAT One / Truckstop Filter Bar */}
      <DATFilterBar
        filters={filters}
        onChange={setFilters}
        onSearch={() => refetch()}
        onReset={handleResetFilters}
        isLoading={isLoading || isFetching}
        totalLoadsCount={totalCount}
      />

      {/* Loads Listing */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
          <p className="text-sm font-medium text-slate-500">Searching active DAT freight loads...</p>
        </div>
      ) : loadsList.length === 0 ? (
        /* Sleek DAT-style Empty State Card */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue border border-blue-100 flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">No active loads matching your criteria</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              No active loads matching your origin and radius. Try expanding your deadhead miles or checking <span className="font-semibold text-slate-700">'Anywhere'</span>.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loadsList.map((load: any) => {
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

            return (
              <Card 
                key={load.id} 
                className="hover:border-brand-blue/50 hover:shadow-md transition-all group cursor-pointer bg-white overflow-hidden border border-slate-200 rounded-2xl"
                onClick={() => setSelectedLoadForDetails(load)}
              >
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row justify-between gap-6">
                  {/* Route Column */}
                  <div className="flex-1 space-y-4">
                    {/* Top load meta bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          REF #{load.reference_number || load.id.substring(0, 8).toUpperCase()}
                        </span>
                        {load.owner_company_name && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {load.owner_company_name}
                          </span>
                        )}
                      </div>
                      <StatusBadge status={load.status} />
                    </div>

                    {/* Routing Stepper */}
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
                  <div className="flex flex-col justify-between lg:items-end min-w-[240px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-4">
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

                    {/* Action Button */}
                    <div className="w-full pt-1">
                      {user?.role === 'CARRIER' && load.status === 'OPEN' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            bookMutation.mutate(load.id);
                          }}
                          disabled={bookMutation.isPending && bookMutation.variables === load.id}
                          className="w-full py-2.5 px-4 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {bookMutation.isPending && bookMutation.variables === load.id ? (
                            'Booking Load...'
                          ) : (
                            <>
                              Book Instant Haul
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLoadForDetails(load);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                        >
                          View Full Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Load Details Modal */}
      {selectedLoadForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  REF #{selectedLoadForDetails.reference_number || selectedLoadForDetails.id.substring(0, 8).toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedLoadForDetails.title || `${selectedLoadForDetails.origin_city} to ${selectedLoadForDetails.destination_city}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLoadForDetails(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Route */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pickup Location</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedLoadForDetails.origin_city}, {selectedLoadForDetails.origin_state} {selectedLoadForDetails.origin_zip || ''}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Date: {selectedLoadForDetails.pickup_date ? new Date(selectedLoadForDetails.pickup_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Delivery Location</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedLoadForDetails.destination_city}, {selectedLoadForDetails.destination_state} {selectedLoadForDetails.destination_zip || ''}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Date: {selectedLoadForDetails.delivery_date ? new Date(selectedLoadForDetails.delivery_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Equipment</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedLoadForDetails.equipment_type}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Weight</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedLoadForDetails.weight} lbs</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Rate Payout</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5 font-mono">
                    ${parseFloat(selectedLoadForDetails.rate || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Distance</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">
                    {selectedLoadForDetails.mileage ? `${selectedLoadForDetails.mileage} mi` : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedLoadForDetails.special_instructions && (
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-1">Special Handling Instructions:</span>
                  {selectedLoadForDetails.special_instructions}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLoadForDetails(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              {user?.role === 'CARRIER' && selectedLoadForDetails.status === 'OPEN' && (
                <button
                  type="button"
                  onClick={() => bookMutation.mutate(selectedLoadForDetails.id)}
                  disabled={bookMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {bookMutation.isPending ? 'Booking...' : 'Book This Load'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadBoardPage;
