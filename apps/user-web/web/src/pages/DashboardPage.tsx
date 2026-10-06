import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Truck, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import { Card, CardContent } from '../components/ui/Card';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
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

  const stats = [
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

  const currentStatus = statsData?.verificationStatus || profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION';
  const rejectionReason = statsData?.rejectionReason || profile?.rejection_reason || (user as any)?.rejection_reason || null;
  const activities = activityData || [];

  return (
    <div className="space-y-6">
      {/* Verification Gate / Alert Banner */}
      {user?.role !== 'ADMIN' && currentStatus === 'REJECTED' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-red-800 flex items-center gap-1.5">
              <span>❌</span> Verification Request Declined
            </h3>
            <p className="text-xs text-red-700 mt-1">
              Your submitted document was not approved. Please wait 3 days to re-apply or contact our support team.
            </p>
            {rejectionReason && (
              <p className="text-xs text-red-800 font-semibold mt-1">Reason: {rejectionReason}</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            View Details & Re-apply
          </button>
        </div>
      )}

      {user?.role !== 'ADMIN' && currentStatus !== 'REJECTED' && currentStatus !== 'APPROVED' && currentStatus !== 'VERIFIED' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <span>⚠️</span> Profile Pending Verification
            </h3>
            <p className="text-xs text-amber-700 mt-1">
              Upload your required compliance documents to activate booking.
            </p>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            Upload Documents
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
          Welcome back, {profile?.first_name || user?.email.split('@')[0]}
        </h2>
        <div className="text-sm text-navy-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-navy-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-navy-900">Recent Activity</h3>
            <button 
              onClick={() => navigate('/loads')} 
              className="text-sm text-brand-blue hover:text-brand-blue/80 font-medium cursor-pointer"
            >
              View All
            </button>
          </div>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="p-8 text-center text-navy-500 text-sm">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-navy-500 text-sm flex flex-col items-center justify-center">
                <Package className="w-10 h-10 text-navy-300 mb-2 stroke-1" />
                <p className="font-medium text-navy-700">No active loads yet.</p>
                <p className="text-navy-500 text-xs mt-1">Post a load or explore the load board to get started.</p>
                <button 
                  onClick={() => navigate('/loads')} 
                  className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blueHover cursor-pointer transition-colors shadow-sm"
                >
                  Explore Load Board
                </button>
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

        <Card>
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="text-lg font-medium text-navy-900">Quick Actions</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {user?.role === 'SHIPPER' || user?.role === 'BROKER' ? (
              <button 
                onClick={() => navigate('/loads')} 
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blueHover cursor-pointer transition-colors"
              >
                <Package className="mr-2 h-4 w-4" />
                Post New Load
              </button>
            ) : null}
            <button 
              onClick={() => navigate('/loads')} 
              className="w-full flex items-center justify-center px-4 py-2 border border-navy-200 rounded-md shadow-sm text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 cursor-pointer transition-colors"
            >
              <Truck className="mr-2 h-4 w-4" />
              Find Loads
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
