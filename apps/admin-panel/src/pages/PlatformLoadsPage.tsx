import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { apiClient } from '../api/client';
import { Search, Package, Calendar, DollarSign } from 'lucide-react';

export const PlatformLoadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: loadsData, isLoading } = useQuery({
    queryKey: ['admin-loads'],
    queryFn: () => apiClient.get<any>('/loads?limit=100')
  });

  const loads: any[] = loadsData?.loads || loadsData?.items || (Array.isArray(loadsData) ? loadsData : []);
  const filteredLoads = (Array.isArray(loads) ? loads : []).filter((load: any) => 
    (load.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.origin_city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.origin_state || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.destination_city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.destination_state || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.equipment_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (load.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Platform Loads</h1>
          <p className="text-sm text-navy-500 mt-1">Live monitoring of all freight shipments posted on Doxhaul.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city, state, ID, or equipment..."
            className="pl-9 pr-4 py-2 w-full text-xs border-gray-300 rounded-lg shadow-sm focus:ring-brand-blue focus:border-brand-blue border bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-navy-500">Loading platform loads...</div>
          ) : filteredLoads.length === 0 ? (
            <div className="text-center py-12 text-navy-500">
              <Package className="w-12 h-12 text-navy-300 mx-auto mb-3" />
              <p className="font-semibold text-navy-700">No platform loads found.</p>
              <p className="text-xs text-navy-400 mt-1">Loads created on the shipper website will appear here in real time.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredLoads.map((load: any) => (
                <div key={load.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-navy-900 text-sm">
                        #{load.reference_number || load.id.substring(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={load.status} />
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {load.equipment_type}
                      </span>
                      {load.weight && (
                        <span className="text-xs text-slate-500">
                          {Number(load.weight).toLocaleString()} lbs
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-navy-700">
                      <span className="font-semibold">{load.origin_city}, {load.origin_state}</span>
                      <span className="text-gray-400">➔</span>
                      <span className="font-semibold">{load.destination_city}, {load.destination_state}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Pickup: {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : 'Flexible'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Delivery: {load.delivery_date ? new Date(load.delivery_date).toLocaleDateString() : 'Flexible'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-lg font-bold text-emerald-600 flex items-center">
                      <DollarSign size={16} className="-mr-0.5" />
                      {Number(load.rate || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Posted: {new Date(load.created_at || Date.now()).toLocaleDateString()}
                    </span>
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

export default PlatformLoadsPage;
