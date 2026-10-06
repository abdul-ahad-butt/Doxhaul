import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export type User = {
  id: string;
  email: string;
  role: 'SHIPPER' | 'BROKER' | 'CARRIER' | 'ADMIN';
  status: string;
  verification_status?: string;
  rejection_reason?: string;
};

export type Profile = {
  first_name: string;
  last_name: string;
  company_name: string;
  verification_status: string;
  rejection_reason?: string;
  verification_notes?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(apiClient.getToken());
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await apiClient.get<{user: User, profile: Profile}>('/auth/me');
      } catch (err) {
        // Handle session check failures silently
        if (token) {
          apiClient.clearToken();
          setToken(null);
        }
        return null;
      }
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      queryClient.clear();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [queryClient]);

  const login = (newToken: string, _user: User) => {
    apiClient.setToken(newToken);
    setToken(newToken);
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const logout = () => {
    apiClient.post('/auth/logout').catch(() => {});
    apiClient.clearToken();
    setToken(null);
    queryClient.clear();
  };

  const isAuthReady = !token || (!isLoading && (!!data || !!error));

  if (!isAuthReady) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div></div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user: data?.user || null,
        profile: data?.profile || null,
        isAuthenticated: !!data?.user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
