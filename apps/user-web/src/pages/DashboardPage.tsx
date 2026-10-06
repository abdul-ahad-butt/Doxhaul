import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  TrendingUp, 
  Lock, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { VerificationAlertBanner } from '../components/dashboard/VerificationAlertBanner';

interface ShipmentItem {
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
  status: 'OPEN' | 'BIDDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';
  created_at: string;
}

export const DashboardPage = () => {
  const { user, profile, activeRole } = useAuth();

  // Live queries to Cloudflare D1
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get<{
      activeLoads: number;
      inTransit: number;
      delivered: number;
      totalSpendRevenue: number;
      verificationStatus?: string;
      rejectionReason?: string | null;
    }>('/dashboard/stats')
  });

  // For shipper, fetch their live active shipments
  const { data: shipmentsData, isLoading: shipmentsLoading } = useQuery({
    queryKey: ['dashboard', 'shipments', activeRole],
    queryFn: async () => {
      if (activeRole === 'SHIPPER') {
        const res = await apiClient.get<{ loads: ShipmentItem[], total: number }>('/loads?ownerOnly=true&pageSize=5');
        return (res as any)?.loads || (Array.isArray(res) ? res : []);
      }
      return [];
    },
    enabled: activeRole === 'SHIPPER'
  });

  const isAdmin = user?.role === 'ADMIN';
  const currentStatus = (statsData?.verificationStatus || profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION').toUpperCase();
  const rejectionReason = statsData?.rejectionReason || profile?.rejection_reason || (user as any)?.rejection_reason || null;
  const isVerified = isAdmin || currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';

  const shipments: ShipmentItem[] = shipmentsData || [];

  // Metrics based on active role
  const getStats = () => {
    if (activeRole === 'SHIPPER') {
      return [
        { 
          label: 'Active Shipments', 
          value: statsLoading ? '...' : (statsData?.activeLoads ?? 0).toString(), 
          icon: Package, 
          color: 'text-brand-blue', 
          bg: 'bg-brand-blue/10' 
        },
        { 
          label: 'In Transit', 
          value: statsLoading ? '...' : (statsData?.inTransit ?? 0).toString(), 
          icon: Truck, 
          color: 'text-brand-purple', 
          bg: 'bg-brand-purple/10' 
        },
        { 
          label: 'Delivered Loads', 
          value: statsLoading ? '...' : (statsData?.delivered ?? 0).toString(), 
          icon: CheckCircle, 
          color: 'text-brand-green', 
          bg: 'bg-brand-green/10' 
        },
        { 
          label: 'Total Freight Spend', 
          value: statsLoading ? '...' : `$${Number(statsData?.totalSpendRevenue ?? 0).toLocaleString()}`, 
          icon: TrendingUp, 
          color: 'text-brand-amber', 
          bg: 'bg-yellow-50' 
        },
      ];
    } else {
      return [
        { 
          label: 'Available Loads', 
          value: statsLoading ? '...' : (statsData?.activeLoads ?? 0).toString(), 
          icon: Search, 
          color: 'text-brand-blue', 
          bg: 'bg-brand-blue/10' 
        },
        { 
          label: 'Active Hauls', 
          value: statsLoading ? '...' : (statsData?.inTransit ?? 0).toString(), 
          icon: Truck, 
          color: 'text-brand-purple', 
          bg: 'bg-brand-purple/10' 
        },
        { 
          label: 'Completed Trips', 
          value: statsLoading ? '...' : (statsData?.delivered ?? 0).toString(), 
          icon: CheckCircle, 
          color: 'text-brand-green', 
          bg: 'bg-brand-green/10' 
        },
        { 
          label: 'Total Earnings', 
          value: statsLoading ? '...' : `$${Number(statsData?.totalSpendRevenue ?? 0).toLocaleString()}`, 
          icon: TrendingUp, 
          color: 'text-brand-amber', 
          bg: 'bg-yellow-50' 
        },
      ];
    }
  };

  const stats = getStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Open</span>;
      case 'BIDDING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Bidding</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Assigned</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">In Transit</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Gate / Alert Banner (only for non-admin accounts pending verification) */}
      {!isAdmin && (
        <VerificationAlertBanner 
          status={currentStatus}
          rejectionReason={rejectionReason}
          role={activeRole} 
        />
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
            Welcome back, {profile?.first_name || user?.email.split('@')[0]}
          </h2>
          <p className="text-sm text-navy-500 capitalize">
            {activeRole.toLowerCase()} portal • {isVerified ? 'Fully verified' : 'Pending verification'}
          </p>
        </div>

        {/* Primary Call to Action for Shipper: Large Post a New Load Button */}
        {activeRole === 'SHIPPER' ? (
          <Link
            to="/loads/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-blue hover:bg-brand-blueHover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>➕ Post a New Load</span>
          </Link>
        ) : (
          <Link
            to="/load-board"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-blue hover:bg-brand-blueHover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Find Loads on Board</span>
          </Link>
        )}
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-navy-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-navy-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Active Shipments Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-navy-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-navy-900">
              {activeRole === 'SHIPPER' ? 'Active Shipments' : 'Available Load Board Freight'}
            </h3>
            <Link 
              to={activeRole === 'SHIPPER' ? '/my-loads' : '/load-board'} 
              className="text-sm text-brand-blue hover:text-brand-blue/80 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <CardContent className="p-0">
            {activeRole === 'SHIPPER' ? (
              shipmentsLoading ? (
                <div className="p-8 text-center text-navy-500 text-sm">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mx-auto mb-2"></div>
                  Loading shipments from database...
                </div>
              ) : shipments.length === 0 ? (
                <div className="p-8 text-center text-navy-500 text-sm flex flex-col items-center justify-center">
                  <Package className="w-12 h-12 text-navy-300 mb-2 stroke-1" />
                  <p className="font-semibold text-navy-800">No active shipments yet.</p>
                  <p className="text-navy-500 text-xs mt-1 max-w-sm">
                    Post your first freight shipment to receive competitive bids from certified carriers.
                  </p>
                  <Link 
                    to="/loads/create" 
                    className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    <PlusCircle size={14} /> Post a New Load
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy-50/50 border-b border-navy-100 text-navy-600 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-4">Ref & Title</th>
                        <th className="py-2.5 px-4">Route</th>
                        <th className="py-2.5 px-4">Equipment</th>
                        <th className="py-2.5 px-4">Rate</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100 text-navy-800">
                      {shipments.map((load) => (
                        <tr key={load.id} className="hover:bg-navy-50/40 transition-colors">
                          <td className="py-2.5 px-4">
                            <span className="font-mono font-bold text-brand-blue block">
                              {load.reference_number || load.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="text-navy-900 truncate max-w-xs block">
                              {load.title}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1 text-navy-700">
                              <MapPin className="w-3 h-3 text-navy-400" />
                              <span>{load.origin_city}, {load.origin_state} → {load.destination_city}, {load.destination_state}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            {load.equipment_type?.replace('_', ' ')} • {Number(load.weight || 0).toLocaleString()} lbs
                          </td>
                          <td className="py-2.5 px-4 font-bold text-navy-900">
                            ${Number(load.rate || 0).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            {getStatusBadge(load.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="p-8 text-center text-navy-500 text-sm flex flex-col items-center justify-center">
                <Truck className="w-12 h-12 text-navy-300 mb-2 stroke-1" />
                <p className="font-semibold text-navy-800">Ready to haul?</p>
                <p className="text-navy-500 text-xs mt-1 max-w-sm">
                  Search live loads available on the Doxhaul freight network and submit instant bids.
                </p>
                <Link 
                  to="/load-board" 
                  className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <Search size={14} /> Search Load Board
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel customized strictly by Active Role */}
        <Card>
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="text-lg font-medium text-navy-900">Role Tools & Actions</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {activeRole === 'SHIPPER' && (
              <>
                <Link 
                  to="/loads/create" 
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a New Load
                </Link>

                <Link 
                  to="/my-loads" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Package className="mr-2 h-4 w-4 text-navy-500" />
                  My Shipments
                </Link>

                <Link 
                  to="/bids" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Clock className="mr-2 h-4 w-4 text-navy-500" />
                  Bids & Quotes
                </Link>

                <Link 
                  to="/invoices" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <TrendingUp className="mr-2 h-4 w-4 text-navy-500" />
                  Invoices & Spend
                </Link>
              </>
            )}

            {activeRole === 'CARRIER' && (
              <>
                <Link 
                  to="/load-board" 
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Loads (Load Board)
                </Link>

                <Link 
                  to="/active-hauls" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Truck className="mr-2 h-4 w-4 text-navy-500" />
                  My Active Hauls
                </Link>

                <Link 
                  to="/earnings" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <TrendingUp className="mr-2 h-4 w-4 text-navy-500" />
                  Earnings & Payouts
                </Link>

                <Link 
                  to="/profile" 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-navy-500" />
                  Compliance & Documents
                </Link>
              </>
            )}

            {!isVerified && !isAdmin && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                <p className="font-semibold flex items-center gap-1">
                  <Lock size={12} /> Marketplace Access Locked
                </p>
                <p className="mt-0.5 text-amber-700">
                  Submit your required documents to enable load booking and instant dispatch.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
