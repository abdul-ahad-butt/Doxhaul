import { Outlet, Navigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { DoxhaulLogo } from '../components/common/DoxhaulLogo';

// Fallback for development if not provided in .env
// @ts-ignore
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '238804830152-7ujv7jkeeslmcjipae1dqk53vkgc2qgh.apps.googleusercontent.com';

export const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'CARRIER') return <Navigate to="/loads" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
};

