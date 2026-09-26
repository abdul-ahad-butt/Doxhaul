import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PostLoadModal } from '../components/PostLoadModal';

const LoadBoardPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: loads, isLoading } = useQuery({
    queryKey: ['loads'],
    queryFn: () => apiClient.get<{items: any[], total: number}>('/loads')
  });

  const bookMutation = useMutation({
    mutationFn: (loadId: string) => apiClient.post(`/loads/${loadId}/book`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      alert('Load booked successfully!');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to book load');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Load Board</h2>
        {(user?.role === 'SHIPPER' || user?.role === 'BROKER') && (
          <Button onClick={() => setIsModalOpen(true)}>Post New Load</Button>
        )}
      </div>
      
      <PostLoadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-navy-100">
        <div className="flex-1">
          <Input 
            placeholder="Search by city, state, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary">Filter</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {loads?.items?.map((load) => (
            <Card key={load.id} className="hover:border-brand-blue transition-colors group cursor-pointer">
              <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                
                {/* Route Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-navy-500">ID: {load.id.substring(0,8).toUpperCase()}</span>
                    <StatusBadge status={load.status} />
                  </div>
                  
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-navy-200"></div>
                    
                    <div className="relative">
                      <div className="absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-brand-blue bg-white top-1"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-navy-900">{load.origin_city}, {load.origin_state}</h4>
                        <div className="flex items-center text-sm text-navy-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(load.pickup_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-brand-purple bg-brand-purple top-1"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-navy-900">{load.destination_city}, {load.destination_state}</h4>
                        <div className="flex items-center text-sm text-navy-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(load.delivery_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="flex flex-col justify-between md:items-end min-w-[200px] border-t md:border-t-0 md:border-l border-navy-100 pt-4 md:pt-0 md:pl-6">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center text-navy-700">
                      <Package className="w-4 h-4 mr-2 text-navy-400" />
                      <span className="text-sm">{load.weight} lbs • {load.equipment_type}</span>
                    </div>
                    <div className="flex items-center text-navy-700">
                      <DollarSign className="w-4 h-4 mr-2 text-brand-green" />
                      <span className="text-xl font-bold">${parseFloat(load.rate).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    {user?.role === 'CARRIER' && load.status === 'OPEN' ? (
                      <Button 
                        className="w-full"
                        onClick={(e) => { e.stopPropagation(); bookMutation.mutate(load.id); }}
                        isLoading={bookMutation.isPending && bookMutation.variables === load.id}
                      >
                        Book Now
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full">View Details</Button>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))}
          {(!loads?.items || loads.items.length === 0) && (
            <div className="text-center py-12 text-navy-500 bg-white rounded-lg border border-dashed border-navy-300">
              No loads found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadBoardPage;
