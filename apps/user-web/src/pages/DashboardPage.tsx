// Unused import removed
import { Package, Truck, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/Card';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  
  // Example queries (we would have endpoints for these)
  // For now, static data representation for demo
  const stats = [
    { label: 'Active Loads', value: '12', icon: Package, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'In Transit', value: '4', icon: Truck, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    { label: 'Delivered', value: '48', icon: CheckCircle, color: 'text-brand-green', bg: 'bg-brand-green/10' },
    { label: 'Spend / Revenue', value: '$24.5k', icon: TrendingUp, color: 'text-brand-amber', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
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
            <button className="text-sm text-brand-blue hover:text-brand-blue/80 font-medium">View All</button>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-navy-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center hover:bg-navy-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-navy-900">Load FL-{1000 + i} status updated</p>
                    <p className="text-sm text-navy-500">Status changed from Assigned to Heading to Pickup</p>
                  </div>
                  <div className="text-xs text-navy-400">
                    {i * 2} hours ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="text-lg font-medium text-navy-900">Quick Actions</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {user?.role === 'SHIPPER' || user?.role === 'BROKER' ? (
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blueHover">
                <Package className="mr-2 h-4 w-4" />
                Post New Load
              </button>
            ) : null}
            <button className="w-full flex items-center justify-center px-4 py-2 border border-navy-200 rounded-md shadow-sm text-sm font-medium text-navy-700 bg-white hover:bg-navy-50">
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
