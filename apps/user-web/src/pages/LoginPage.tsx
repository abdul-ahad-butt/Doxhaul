import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { UserX, CreditCard, X } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  
  // Modals state
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [notFoundEmail, setNotFoundEmail] = useState('');

  const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);
  const [paymentRequiredData, setPaymentRequiredData] = useState<{
    fee: number;
    role: string;
    email: string;
  }>({ fee: 0, role: '', email: '' });

  const navigate = useNavigate();
  const { login } = useAuth();

  const googleLoginMutation = useMutation({
    mutationFn: async (tokenResponse: any) => {
      return apiClient.post<any>('/auth/google', { token: tokenResponse.access_token });
    },
    onSuccess: (data) => {
      if (data.status === 'PROFILE_INCOMPLETE') {
        navigate('/complete-profile', { state: { email: data.email, googleToken: data.googleToken, googleId: data.googleId } });
      } else {
        login(data.token, data.user);
        if (data.user.role === 'CARRIER') navigate('/loads');
        else navigate('/dashboard');
      }
    },
    onError: (err: any) => {
      if (err.code === 'USER_NOT_REGISTERED' || err.status === 404) {
        setNotFoundEmail('');
        setShowNotFoundModal(true);
        return;
      }
      if (err.code === 'PAYMENT_REQUIRED' || (err.status === 403 && (err.fee !== undefined || err.details?.fee !== undefined))) {
        const fee = err.fee ?? err.details?.fee ?? 0;
        const role = err.role ?? err.details?.role ?? 'Member';
        const targetEmail = err.email ?? err.details?.email ?? '';
        setPaymentRequiredData({ fee, role, email: targetEmail });
        setShowPaymentRequiredModal(true);
        return;
      }
      setError(err.message || 'Google Login failed.');
    }
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => googleLoginMutation.mutate(tokenResponse),
    onError: () => setError('Google Login failed.')
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<{token: string, user: any}>('/auth/login', { email, password });
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      if (data.user.role === 'CARRIER') navigate('/loads');
      else navigate('/dashboard');
    },
    onError: (err: any) => {
      // 1. Intercept 404 / USER_NOT_REGISTERED -> Trigger Account Not Found Modal
      if (err.code === 'USER_NOT_REGISTERED' || err.status === 404 || err.message?.includes('No account found')) {
        setNotFoundEmail(email);
        setShowNotFoundModal(true);
        return;
      }
      
      // 2. Intercept 403 / PAYMENT_REQUIRED -> Trigger Payment Required Modal
      if (err.code === 'PAYMENT_REQUIRED' || (err.status === 403 && (err.fee !== undefined || err.details?.fee !== undefined))) {
        const fee = err.fee ?? err.details?.fee ?? 0;
        const role = err.role ?? err.details?.role ?? 'Member';
        const targetEmail = err.email ?? err.details?.email ?? email;
        setPaymentRequiredData({ fee, role, email: targetEmail });
        setShowPaymentRequiredModal(true);
        return;
      }

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
      
      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm text-slate-500">or</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <div className="mt-6">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
          onClick={() => handleGoogleLogin()}
          isLoading={googleLoginMutation.isPending}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>
      </div>
      
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
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group cursor-pointer"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Shipper</span> &middot; sarah@acmecorp.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
          <button 
            type="button" 
            onClick={() => { setEmail('carlos@swiftlogistics.dev'); setPassword('Password123!'); setEmailError(''); setPasswordError(''); }}
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group cursor-pointer"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Carrier</span> &middot; carlos@swiftlogistics.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
          <button 
            type="button" 
            onClick={() => { setEmail('tom@apexbrokerage.dev'); setPassword('Password123!'); setEmailError(''); setPasswordError(''); }}
            className="w-full text-left px-3 py-2 text-xs rounded border border-slate-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex justify-between items-center group cursor-pointer"
          >
            <div><span className="font-bold text-navy-900 group-hover:text-brand-blue">Broker</span> &middot; tom@apexbrokerage.dev</div>
            <div className="text-slate-400 group-hover:text-brand-blue">&rarr;</div>
          </button>
        </div>
      </div>

      {/* Modal 1: Account Not Found Modal */}
      {showNotFoundModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-not-found-title"
          onClick={() => setShowNotFoundModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setShowNotFoundModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <UserX className="w-7 h-7" />
            </div>

            <h3 id="account-not-found-title" className="text-xl font-bold text-navy-950 mb-2">
              Account Not Found
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              It looks like you don't have an account on Doxhaul yet. Please register first to access the marketplace.
            </p>

            {notFoundEmail && (
              <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 break-all text-left">
                Attempted login with: <span className="font-semibold text-slate-900">{notFoundEmail}</span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowNotFoundModal(false)}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNotFoundModal(false);
                  navigate(`/register?email=${encodeURIComponent(notFoundEmail)}`);
                }}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Register Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Payment Required Modal */}
      {showPaymentRequiredModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-required-title"
          onClick={() => setShowPaymentRequiredModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setShowPaymentRequiredModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue border border-blue-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CreditCard className="w-7 h-7" />
            </div>

            <h3 id="payment-required-title" className="text-xl font-bold text-navy-950 mb-2">
              Payment Required
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Your <span className="font-bold text-navy-900">{paymentRequiredData.role}</span> registration is pending activation. Please complete the <span className="font-bold text-brand-blue">${paymentRequiredData.fee}</span> onboarding fee to unlock your credentials.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentRequiredModal(false)}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentRequiredModal(false);
                  navigate(`/onboarding-payment?email=${encodeURIComponent(paymentRequiredData.email)}&role=${paymentRequiredData.role}&fee=${paymentRequiredData.fee}`);
                }}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
