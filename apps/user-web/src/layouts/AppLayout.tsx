import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/layout/Sidebar';
import { RolePaymentGate } from '../components/onboarding/RolePaymentGate';

export const AppLayout = () => {
  const { user, profile, isAuthenticated, activeRole, switchRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin users are never blocked by pending verification
  if (user?.role !== 'ADMIN' && user?.status === 'PENDING_VERIFICATION' && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  const isVerified = user?.role === 'ADMIN' || 
    profile?.verification_status === 'VERIFIED' || 
    profile?.verification_status === 'APPROVED' || 
    (user as any)?.verification_status === 'APPROVED' || 
    (user as any)?.verification_status === 'VERIFIED';

  return (
    <div className="flex h-screen bg-background text-slate-900 overflow-hidden">
      {/* Role-Based Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Subtle Admin Testing Banner */}
        {user?.role === 'ADMIN' && (
          <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex justify-between items-center z-20 border-b border-slate-800 flex-shrink-0">
            <span>Logged in with Admin Account — Testing as <strong className="text-white uppercase font-bold">{activeRole}</strong></span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => switchRole(activeRole === 'SHIPPER' ? 'CARRIER' : 'SHIPPER')} 
                className="hover:text-white underline cursor-pointer text-slate-300"
              >
                Switch to {activeRole === 'SHIPPER' ? 'Carrier' : 'Shipper'} View
              </button>
              <a 
                href="https://doxhaul-adminpanel.pages.dev" 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Open Admin Panel ↗
              </a>
            </div>
          </div>
        )}

        {/* Top Header */}
        <header className="h-16 bg-navy-900 text-white flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold tracking-wide">Marketplace</h1>
            {isVerified ? (
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-green/20 text-brand-green border border-brand-green/30">
                Verified Account
              </span>
            ) : (
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
        <div className="flex-1 overflow-auto p-6 bg-[#f8fafc]">
          <RolePaymentGate>
            <Outlet />
          </RolePaymentGate>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
