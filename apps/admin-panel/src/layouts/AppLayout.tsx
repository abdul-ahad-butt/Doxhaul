import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/layout/Sidebar';

export const AppLayout = () => {
  const { user, profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    // 1. Outer viewport wrapper: locked to 100vh with NO window scroll
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* 2. Fixed Sidebar: independent scroll only if menu items exceed height */}
      <Sidebar />

      {/* 3. Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header: Fixed height, does not scroll */}
        <header className="h-16 shrink-0 bg-navy-900 text-white flex items-center justify-between px-6 shadow-sm z-10 overflow-hidden">
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

        {/* 4. THE ONLY SCROLL CONTAINER ON THE PAGE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
