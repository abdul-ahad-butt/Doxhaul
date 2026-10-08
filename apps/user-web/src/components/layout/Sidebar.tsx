import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DoxhaulLogo } from '../common/DoxhaulLogo';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package, 
  CreditCard, 
  Building2, 
  Search, 
  Truck, 
  Tag, 
  FileText, 
  Users, 
  Wallet,
  LogOut 
} from 'lucide-react';

export interface NavItem {
  label: string;
  icon: any;
  href: string;
  badge?: string;
  external?: boolean;
}

export const Sidebar = () => {
  const { user, profile, activeRole, logout } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case 'SHIPPER':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { label: 'Post a Load', icon: PackagePlus, href: '/loads/create' },
          { label: 'My Shipments', icon: Package, href: '/my-loads' },
          { label: 'Bids & Quotes', icon: Tag, href: '/bids' },
          { label: 'Wallet & Escrow', icon: Wallet, href: '/wallet' },
          { label: 'Billing & Invoices', icon: CreditCard, href: '/invoices' },
          { label: 'Company & Profile', icon: Building2, href: '/profile' },
        ];

      case 'CARRIER':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { label: 'Load Board (Find Loads)', icon: Search, href: '/load-board' },
          { label: 'My Active Hauls', icon: Truck, href: '/active-hauls' },
          { label: 'Wallet & Payouts', icon: Wallet, href: '/wallet' },
          { label: 'Earnings & Payouts', icon: CreditCard, href: '/earnings' },
          { label: 'Documents & Compliance', icon: FileText, href: '/profile' },
        ];

      case 'BROKER':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { label: 'Post a Load', icon: PackagePlus, href: '/loads/create' },
          { label: 'Manage Loads', icon: Package, href: '/my-loads' },
          { label: 'Carrier Network', icon: Users, href: '/load-board' },
          { label: 'Wallet & Escrow', icon: Wallet, href: '/wallet' },
          { label: 'Billing & Invoices', icon: CreditCard, href: '/invoices' },
          { label: 'Company Profile', icon: Building2, href: '/profile' },
        ];

      default:
        return [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { label: 'Post a Load', icon: PackagePlus, href: '/loads/create' },
          { label: 'My Shipments', icon: Package, href: '/my-loads' },
          { label: 'Wallet & Escrow', icon: Wallet, href: '/wallet' },
          { label: 'Profile', icon: Building2, href: '/profile' },
        ];
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path.split('?')[0])) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-white border-r border-navy-100 flex flex-col flex-shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-navy-100 justify-between">
        <Link to="/dashboard" className="flex items-center focus:outline-none">
          <DoxhaulLogo variant="dark" height={22} alt="Doxhaul Logo" />
        </Link>
        <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200 uppercase tracking-wider">
          {activeRole}
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider px-3 mb-2">
          Marketplace Menu
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active 
                  ? 'bg-brand-blue text-white shadow-sm' 
                  : 'text-navy-600 hover:text-brand-blue hover:bg-brand-blue/5 hover:translate-x-1'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 transition-colors ${
                active ? 'text-white' : 'text-navy-400 group-hover:text-brand-blue'
              }`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Sign Out */}
      <div className="p-4 border-t border-navy-100 bg-gray-50/50">
        <div className="flex items-center mb-3">
          <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold border border-navy-200">
            {profile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-semibold text-navy-900 truncate">
              {profile?.company_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'My Account'}
            </p>
            <p className="text-xs text-navy-500 capitalize">{activeRole.toLowerCase()}</p>
          </div>
        </div>
        <button
          id="sign-out-btn"
          name="signOut"
          aria-label="Sign Out of Doxhaul"
          onClick={logout}
          className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:text-brand-red hover:bg-brand-red/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3 text-navy-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
