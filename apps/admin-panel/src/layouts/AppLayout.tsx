import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/layout/Sidebar';

export const AppLayout = () => {
  const { user, profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-navy-900 text-white flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold tracking-wide">Marketplace</h1>
            {profile?.verification_status === 'VERIFIED' && (
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-green/20 text-brand-green border border-brand-green/30">
                Verified Account
              </span>
            )}
            {profile?.verification_status === 'PENDING' && (
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
                Pending Verification
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-navy-200">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
