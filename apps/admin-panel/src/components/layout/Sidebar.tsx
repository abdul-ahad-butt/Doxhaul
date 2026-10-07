import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Contact, 
  Users, 
  Package, 
  LifeBuoy, 
  Sliders, 
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Users Directory', icon: Contact, href: '/admin/users' },
    { label: 'Verifications Queue', icon: Users, href: '/admin/verifications' },
    { label: 'Platform Loads', icon: Package, href: '/admin/loads' },
    { label: 'User Issues', icon: LifeBuoy, href: '/admin/tickets' },
    { label: 'API & Financial Settings', icon: Sliders, href: '/admin/integrations' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && location.pathname === '/admin') return true;
    if (href !== '/admin' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-64 h-full shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
      {/* Brand */}
      <div className="h-16 shrink-0 flex items-center px-6 border-b border-slate-200 justify-between">
        <Link to="/admin" className="text-xl font-bold text-navy-900 tracking-tight">
          Doxhaul<span className="text-brand-blue">.</span>
        </Link>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-navy-900 text-white tracking-wider uppercase">
          Admin
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-navy-900 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80 hover:translate-x-0.5'
              }`}
            >
              <item.icon className={`h-4 w-4 mr-3 transition-colors ${
                active ? 'text-white' : 'text-slate-400 group-hover:text-navy-900'
              }`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 shrink-0">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
            {profile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {profile?.company_name || profile?.first_name || 'Super Admin'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2.5 text-slate-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
