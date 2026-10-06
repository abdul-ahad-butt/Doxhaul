import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Truck, 
  Activity, 
  CheckCircle, 
  TrendingUp, 
  Lock, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { VerificationAlertBanner } from '../components/dashboard/VerificationAlertBanner';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const role = (user?.role || 'CARRIER').toUpperCase();

  // Real live queries to Cloudflare D1
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

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => apiClient.get<Array<{
      id: string;
      title: string;
      description: string;
      timestamp: string;
    }>>('/dashboard/activity')
  });

  const currentStatus = (statsData?.verificationStatus || profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION').toUpperCase();
  const rejectionReason = statsData?.rejectionReason || profile?.rejection_reason || (user as any)?.rejection_reason || null;
  const activities = activityData || [];

  const isVerified = currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';

  // Role-customized stat labels
  const getStats = () => {
    if (role === 'SHIPPER') {
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
          label: 'Delivered', 
          value: statsLoading ? '...' : (statsData?.delivered ?? 0).toString(), 
          icon: CheckCircle, 
          color: 'text-brand-green', 
          bg: 'bg-brand-green/10' 
        },
        { 
          label: 'Freight Spend', 
          value: statsLoading ? '...' : `$${Number(statsData?.totalSpendRevenue ?? 0).toLocaleString()}`, 
          icon: TrendingUp, 
          color: 'text-brand-amber', 
          bg: 'bg-yellow-50' 
        },
      ];
    } else if (role === 'CARRIER') {
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
    } else {
      return [
        { 
          label: 'Active Loads', 
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
          label: 'Delivered', 
          value: statsLoading ? '...' : (statsData?.delivered ?? 0).toString(), 
          icon: CheckCircle, 
          color: 'text-brand-green', 
          bg: 'bg-brand-green/10' 
        },
        { 
          label: 'Spend / Revenue', 
          value: statsLoading ? '...' : `$${Number(statsData?.totalSpendRevenue ?? 0).toLocaleString()}`, 
          icon: TrendingUp, 
          color: 'text-brand-amber', 
          bg: 'bg-yellow-50' 
        },
      ];
    }
  };

  const stats = getStats();

  const handlePostLoadClick = () => {
    if (!isVerified) {
      navigate('/profile');
      return;
    }
    navigate('/loads?action=post');
  };

  const handleBookLoadClick = () => {
    navigate('/loads');
  };

  return (
    <div className="space-y-6">
      {/* Verification Gate / Alert Banner */}
      <VerificationAlertBanner 
        status={currentStatus}
        rejectionReason={rejectionReason}
        role={role} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
            Welcome back, {profile?.first_name || user?.email.split('@')[0]}
          </h2>
          <p className="text-sm text-navy-500 capitalize">
            {role.toLowerCase()} portal • {isVerified ? 'Fully verified' : 'Pending verification'}
          </p>
        </div>
        <div className="text-sm text-navy-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
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

      {/* Main Grid: Role Views & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-navy-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-navy-900">
              {role === 'SHIPPER' ? 'Recent Shipment Activity' : role === 'CARRIER' ? 'Recent Dispatch & Loads' : 'Recent Platform Activity'}
            </h3>
            <button 
              onClick={() => navigate('/loads')} 
              className="text-sm text-brand-blue hover:text-brand-blue/80 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="p-8 text-center text-navy-500 text-sm">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-navy-500 text-sm flex flex-col items-center justify-center">
                <Package className="w-10 h-10 text-navy-300 mb-2 stroke-1" />
                <p className="font-semibold text-navy-800">No active shipments yet.</p>
                <p className="text-navy-500 text-xs mt-1">
                  {role === 'SHIPPER' 
                    ? 'Post your first freight load to receive competitive bids from certified carriers.'
                    : 'Search our real-time load board to bid on available freight.'}
                </p>
                {role === 'SHIPPER' ? (
                  <button 
                    onClick={handlePostLoadClick} 
                    className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    {!isVerified && <Lock size={12} />} Post a New Load
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/loads')} 
                    className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    Explore Load Board
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-navy-100">
                {activities.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center hover:bg-navy-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-navy-900">{item.title}</p>
                      <p className="text-sm text-navy-500">{item.description}</p>
                    </div>
                    <div className="text-xs text-navy-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel customized by Role */}
        <Card>
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="text-lg font-medium text-navy-900">Role Tools & Actions</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {role === 'SHIPPER' && (
              <>
                <button 
                  onClick={handlePostLoadClick} 
                  className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                    isVerified 
                      ? 'bg-brand-blue hover:bg-brand-blueHover text-white cursor-pointer' 
                      : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer'
                  }`}
                >
                  {isVerified ? (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post a New Load
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4 text-amber-600" />
                      Post Load (Unlock with Verification)
                    </>
                  )}
                </button>

                <button 
                  onClick={() => navigate('/loads')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Package className="mr-2 h-4 w-4 text-navy-500" />
                  My Shipments
                </button>

                <button 
                  onClick={() => navigate('/invoices')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <TrendingUp className="mr-2 h-4 w-4 text-navy-500" />
                  Invoices & Spend
                </button>
              </>
            )}

            {role === 'CARRIER' && (
              <>
                <button 
                  onClick={handleBookLoadClick} 
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Loads (Load Board)
                </button>

                <button 
                  onClick={() => navigate('/trips')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Truck className="mr-2 h-4 w-4 text-navy-500" />
                  My Active Hauls
                </button>

                <button 
                  onClick={() => navigate('/profile')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-navy-500" />
                  Compliance & Documents
                </button>
              </>
            )}

            {role === 'BROKER' && (
              <>
                <button 
                  onClick={() => navigate('/loads?action=post')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Manage & Dispatch Loads
                </button>
                <button 
                  onClick={() => navigate('/loads')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Users className="mr-2 h-4 w-4 text-navy-500" />
                  Carrier Network
                </button>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <button 
                  onClick={() => navigate('/admin/verifications')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verifications Queue
                </button>
                <button 
                  onClick={() => navigate('/admin/users')} 
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <Users className="mr-2 h-4 w-4 text-navy-500" />
                  Users Directory
                </button>
              </>
            )}

            {!isVerified && role !== 'ADMIN' && (
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
