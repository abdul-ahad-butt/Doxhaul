import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const BookingsPage = () => {
  const { user: _user } = useAuth();
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiClient.get<any[]>('/bookings')
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">My Bookings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active and Historical Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="text-center py-8 text-navy-500">Loading bookings...</div>
          ) : bookings?.length === 0 ? (
            <div className="text-center py-12 text-navy-500 bg-navy-50 border border-dashed border-navy-300 m-4 rounded-lg">
              No bookings found.
            </div>
          ) : (
            <div className="divide-y divide-navy-100">
              {bookings?.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-navy-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-navy-900">Load #{booking.load_id.substring(0,8).toUpperCase()}</span>
                        <StatusBadge status={booking.status} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-brand-blue mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs font-semibold text-navy-500 uppercase">Pickup</p>
                            <p className="text-sm text-navy-900">{booking.origin_city}, {booking.origin_state}</p>
                            <p className="text-xs text-navy-500">{new Date(booking.pickup_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-brand-purple mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs font-semibold text-navy-500 uppercase">Delivery</p>
                            <p className="text-sm text-navy-900">{booking.destination_city}, {booking.destination_state}</p>
                            <p className="text-xs text-navy-500">{new Date(booking.delivery_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-2 border-t md:border-t-0 md:border-l border-navy-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-xl font-bold text-brand-green">
                        ${parseFloat(booking.rate || 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-navy-500 mb-2">
                        Booked {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      <Button variant="secondary" size="sm">
                        View Trip Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
