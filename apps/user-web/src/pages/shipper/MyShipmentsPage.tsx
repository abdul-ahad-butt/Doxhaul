import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  PlusCircle, 
  Search, 
  MapPin, 
  Calendar, 
  Truck, 
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { Card, CardContent } from '../../components/ui/Card';

interface LoadItem {
  id: string;
  reference_number: string;
  title: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  equipment_type: string;
  weight: number;
  rate: number;
  status: 'OPEN' | 'BIDDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
}

export const MyShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['loads', 'my-shipments'],
    queryFn: async () => {
      const res = await apiClient.get<{ loads: LoadItem[], total: number }>('/loads?ownerOnly=true&pageSize=50');
      return res;
    }
  });

  const loads: LoadItem[] = (data as any)?.loads || (Array.isArray(data) ? data : []);

  const filteredLoads = loads.filter(l => {
    const matchesTab = activeTab === 'ALL' || l.status === activeTab;
    const matchesSearch = !searchTerm || 
      l.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.origin_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.destination_city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Open for Bids</span>;
      case 'BIDDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Active Bids</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Carrier Assigned</span>;
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">In Transit</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-brand-blue" />
            My Shipments & Freight Dispatch
          </h1>
          <p className="text-sm text-navy-500">
            Track live carrier assignments, in-transit status, and freight delivery confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-lg border border-navy-200 bg-white hover:bg-navy-50 text-navy-600 transition-colors"
            title="Refresh shipments"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/loads/create"
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post a New Load
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: 'All Loads' },
            { key: 'OPEN', label: 'Open' },
            { key: 'ASSIGNED', label: 'Assigned' },
            { key: 'IN_TRANSIT', label: 'In Transit' },
            { key: 'DELIVERED', label: 'Delivered' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-navy-600 hover:bg-navy-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ref, city, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-navy-50/50 border border-navy-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Table or Cards */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-navy-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-3"></div>
              Loading your shipments from live database...
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Package className="w-12 h-12 text-navy-300 mb-3 stroke-1" />
              <h3 className="text-base font-semibold text-navy-900">No shipments found</h3>
              <p className="text-xs text-navy-500 max-w-md mt-1 mb-5">
                {searchTerm || activeTab !== 'ALL'
                  ? 'No loads match your active filters. Try resetting the search or status tab.'
                  : 'You have not posted any freight loads yet. Create your first shipment to receive bids from verified carriers.'}
              </p>
              <button
                onClick={() => navigate('/loads/create')}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Post a Load Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-navy-50/60 border-b border-navy-100 text-navy-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Ref & Title</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Equipment & Weight</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 text-navy-800">
                  {filteredLoads.map((load) => (
                    <tr key={load.id} className="hover:bg-navy-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-brand-blue text-[11px] block">
                          {load.reference_number || load.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="font-medium text-navy-900 block truncate max-w-xs text-xs">
                          {load.title}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-navy-400" />
                          <span>{load.origin_city}, {load.origin_state}</span>
                          <span className="text-navy-400">→</span>
                          <span>{load.destination_city}, {load.destination_state}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-navy-600">
                          <Calendar className="w-3.5 h-3.5 text-navy-400" />
                          <span>{load.pickup_date}</span>
                          <span className="text-navy-400">to</span>
                          <span>{load.delivery_date}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-navy-700">
                          <Truck className="w-3.5 h-3.5 text-navy-400" />
                          <span>{load.equipment_type?.replace('_', ' ')}</span>
                          <span className="text-navy-400">•</span>
                          <span>{Number(load.weight || 0).toLocaleString()} lbs</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-navy-900">
                        ${Number(load.rate || 0).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(load.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyShipmentsPage;
