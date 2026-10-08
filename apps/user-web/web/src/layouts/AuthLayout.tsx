import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DoxhaulLogo } from '../components/common/DoxhaulLogo';

export const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user?.role === 'CARRIER') return <Navigate to="/loads" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6 focus:outline-none">
          <DoxhaulLogo variant="full" height={40} alt="Doxhaul - Smarter Freight. Stronger Together." />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-navy-950">
          Welcome to the Marketplace
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10 border border-navy-100 transition-all duration-300 hover:shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
