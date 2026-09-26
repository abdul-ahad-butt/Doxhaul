import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const TripsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', 'active'],
    queryFn: () => apiClient.get<any[]>('/bookings')
  });

  const activeTrips = bookings?.filter(b => 
    b.status === 'HEADING_TO_PICKUP' || 
    b.status === 'PICKED_UP' || 
    b.status === 'IN_TRANSIT'
  ) || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      apiClient.post(`/loads/${id}/status`, { status, location_update: 'GPS Coordinates 34.05,-118.24' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const handleNextStatus = (booking: any) => {
    let nextStatus = '';
    if (booking.status === 'HEADING_TO_PICKUP') nextStatus = 'PICKED_UP';
    else if (booking.status === 'PICKED_UP') nextStatus = 'IN_TRANSIT';
    else if (booking.status === 'IN_TRANSIT') nextStatus = 'DELIVERED';

    if (nextStatus) {
      updateStatusMutation.mutate({ id: booking.load_id, status: nextStatus });
    }
  };

  const getNextActionLabel = (status: string) => {
    if (status === 'HEADING_TO_PICKUP') return 'Confirm Picked Up';
    if (status === 'PICKED_UP') return 'Start Transit';
    if (status === 'IN_TRANSIT') return 'Confirm Delivered';
    return '';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Active Trips</h2>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-8 text-navy-500">Loading trips...</div>
        ) : activeTrips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-navy-300" />
              </div>
              <h3 className="text-lg font-medium text-navy-900 mb-2">No Active Trips</h3>
              <p className="text-navy-500 max-w-sm mb-6">
                You don't have any loads currently in transit. Head over to the Load Board to find your next shipment.
              </p>
              {user?.role === 'CARRIER' && (
                <Button onClick={() => window.location.href = '/loads'}>Find Loads</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          activeTrips.map((trip) => (
            <Card key={trip.id} className="border-l-4 border-l-brand-purple">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Trip Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-navy-900">Trip FL-{trip.load_id.substring(0,6).toUpperCase()}</span>
                        <StatusBadge status={trip.status} />
                      </div>
                      <div className="text-sm font-medium text-navy-500">
                        Carrier: {trip.carrier?.company_name || 'My Trucking Co'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-start mb-4">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center mr-3 shrink-0">
                            <MapPin className="h-4 w-4 text-brand-blue" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-1">Pickup</p>
                            <p className="text-base font-medium text-navy-900">{trip.origin_city}, {trip.origin_state}</p>
                            <p className="text-sm text-navy-500">{new Date(trip.pickup_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start mb-4">
                          <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center mr-3 shrink-0">
                            <MapPin className="h-4 w-4 text-brand-purple" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-1">Delivery</p>
                            <p className="text-base font-medium text-navy-900">{trip.destination_city}, {trip.destination_state}</p>
                            <p className="text-sm text-navy-500">{new Date(trip.delivery_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col justify-between lg:w-64 border-t lg:border-t-0 lg:border-l border-navy-100 pt-4 lg:pt-0 lg:pl-6 bg-navy-50/50 rounded-r-lg -my-6 -mr-6 p-6">
                    <div>
                      <h4 className="text-sm font-medium text-navy-900 mb-4">Trip Management</h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-navy-600">
                          <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
                          Load Booked
                        </div>
                        <div className={`flex items-center text-sm ${trip.status !== 'ASSIGNED' ? 'text-navy-600' : 'text-navy-400'}`}>
                          <CheckCircle className={`h-4 w-4 mr-2 ${trip.status !== 'ASSIGNED' ? 'text-brand-green' : 'text-navy-300'}`} />
                          Carrier Dispatched
                        </div>
                        <div className={`flex items-center text-sm ${trip.status === 'IN_TRANSIT' ? 'text-navy-600' : 'text-navy-400'}`}>
                          <CheckCircle className={`h-4 w-4 mr-2 ${trip.status === 'IN_TRANSIT' ? 'text-brand-green' : 'text-navy-300'}`} />
                          In Transit
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {(user?.role === 'CARRIER' || user?.role === 'ADMIN') && getNextActionLabel(trip.status) && (
                        <Button 
                          className="w-full shadow-sm"
                          onClick={() => handleNextStatus(trip)}
                          isLoading={updateStatusMutation.isPending && updateStatusMutation.variables?.id === trip.load_id}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          {getNextActionLabel(trip.status)}
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TripsPage;
