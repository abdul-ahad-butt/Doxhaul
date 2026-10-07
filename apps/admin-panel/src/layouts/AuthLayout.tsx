import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="h-screen w-screen overflow-y-auto bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center text-3xl font-bold text-navy-950 tracking-tight">
          Doxhaul<span className="text-brand-blue">.</span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10 border border-navy-100 transition-all duration-300 hover:shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
