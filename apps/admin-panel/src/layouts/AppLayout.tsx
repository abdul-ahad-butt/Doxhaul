import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Package, Users, Truck, LayoutDashboard, FileText, Contact, LifeBuoy } from 'lucide-react';

export const AppLayout = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [];
  
  if (user?.role === 'ADMIN') {
    navItems.push(
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'Users & Verification', icon: Users, href: '/admin/verifications' },
      { label: 'Users Directory', icon: Contact, href: '/admin/users' },
      { label: 'Platform Loads', icon: Package, href: '/admin/loads' },
      { label: 'User Issues', icon: LifeBuoy, href: '/admin/tickets' }
    );
  } else if (user?.role === 'SHIPPER' || user?.role === 'BROKER') {
    navItems.push(
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'My Loads', icon: Package, href: '/loads' },
      { label: 'Documents', icon: FileText, href: '/profile' }
    );
  } else if (user?.role === 'CARRIER') {
    navItems.push(
      { label: 'Load Board', icon: LayoutDashboard, href: '/loads' },
      { label: 'My Bookings', icon: Package, href: '/bookings' },
      { label: 'Active Trips', icon: Truck, href: '/trips' },
      { label: 'Documents', icon: FileText, href: '/profile' }
    );
  }

  return (
    <div className="flex h-screen bg-background text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-navy-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-navy-100">
          <span className="text-xl font-bold text-navy-900 tracking-tight">Doxhaul<span className="text-brand-blue">.</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-navy-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-all duration-200 hover:translate-x-1 group"
            >
              <item.icon className="h-5 w-5 mr-3 text-navy-400 group-hover:text-brand-blue transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-medium">
              {profile?.first_name?.[0] || user?.email[0].toUpperCase()}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-navy-900 truncate">{profile?.company_name || 'My Company'}</p>
              <p className="text-xs text-navy-500 capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-navy-600 hover:text-brand-red hover:bg-brand-red/10 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-navy-400" />
            Sign Out
          </button>
        </div>
      </aside>

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
