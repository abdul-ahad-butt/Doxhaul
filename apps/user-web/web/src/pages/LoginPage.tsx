import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<{token: string, user: any}>('/auth/login', { email, password });
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      if (data.user.role === 'ADMIN') navigate('/admin');
      else if (data.user.role === 'CARRIER') navigate('/loads');
      else navigate('/dashboard');
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  });

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError('Password is required');
      return false;
    } else if (val.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
  };

  const handleEmailBlur = () => validateEmail(email);
  const handlePasswordBlur = () => validatePassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) return;

    setError('');
    loginMutation.mutate();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        
        <Input
          id="email"
          name="email"
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={emailError}
          placeholder="you@company.com"
        />
        
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={passwordError}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-700">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-brand-blue hover:text-brand-blue/80">
          Create an account
        </Link>
      </div>
      
      {/* Demo Credentials Alert */}
      <div className="mt-8 bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-5">
        <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Quick Demo Access
        </h3>
        <p className="text-xs text-slate-600 mb-4">Click a role below to auto-fill credentials.</p>
        <div className="space-y-2">
          <button 
            type="button" 
            onClick={() => { setEmail('sarah@acmecorp.dev'); setPassword('Password123!'); setEmailError(''); setPasswordError(''); }}
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Shipper</span> &middot; sarah@acmecorp.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
          <button 
            type="button" 
            onClick={() => { setEmail('carlos@swiftlogistics.dev'); setPassword('Password123!'); setEmailError(''); setPasswordError(''); }}
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Carrier</span> &middot; carlos@swiftlogistics.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
          <button 
            type="button" 
            onClick={() => { setEmail('tom@apexbrokerage.dev'); setPassword('Password123!'); setEmailError(''); setPasswordError(''); }}
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Broker</span> &middot; tom@apexbrokerage.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
