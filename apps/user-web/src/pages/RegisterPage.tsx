import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { apiClient, ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CountryPhoneInput } from '../components/ui/CountryPhoneInput';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const roleQuery = searchParams.get('role')?.toUpperCase();
  const initialRole = (roleQuery === 'CARRIER' || roleQuery === 'BROKER' || roleQuery === 'SHIPPER') 
    ? roleQuery 
    : 'SHIPPER';
  const initialEmail = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: initialEmail, phone: '',
    password: '', companyName: '', role: initialRole,
    dotNumber: '', mcNumber: ''
  });

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'CARRIER' || roleParam === 'BROKER' || roleParam === 'SHIPPER') {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  // Fetch live Platform & Onboarding Financial Policies
  const { data: policies } = useQuery({
    queryKey: ['platform-policies'],
    queryFn: async () => {
      try {
        return await apiClient.get<{ commissionPercent: number, carrierFee: number, shipperFee: number, brokerFee: number }>('/platform/policies');
      } catch {
        return { commissionPercent: 8, carrierFee: 25, shipperFee: 30, brokerFee: 50 };
      }
    },
    staleTime: 60 * 1000,
  });

  const carrierFee = policies?.carrierFee ?? 25;
  const shipperFee = policies?.shipperFee ?? 30;
  const brokerFee = policies?.brokerFee ?? 50;

  const currentRoleFee = formData.role === 'CARRIER' 
    ? carrierFee 
    : formData.role === 'BROKER' 
      ? brokerFee 
      : shipperFee;

  const [lastGoogleToken, setLastGoogleToken] = useState('');

  const googleLoginMutation = useMutation({
    mutationFn: async (payload: any) => {
      const token = typeof payload === 'string' ? payload : (payload.token || payload.access_token);
      setLastGoogleToken(token);
      return apiClient.post<any>('/auth/google', { token, intent: 'register' });
    },
    onSuccess: (data) => {
      if (data.status === 'PROFILE_INCOMPLETE') {
        navigate('/complete-profile', { state: { email: data.email, googleToken: data.googleToken, googleId: data.googleId, name: data.name } });
      } else {
        login(data.token, data.user);
        if (data.user?.role === 'CARRIER') navigate('/loads');
        else navigate('/dashboard');
      }
    },
    onError: (err: any) => {
      if (err.code === 'USER_NOT_REGISTERED') {
        const profile = err.googleProfile || err.details?.googleProfile;
        navigate('/complete-profile', {
          state: {
            email: profile?.email || err.email,
            googleToken: lastGoogleToken,
            googleId: profile?.sub,
            name: profile?.name
          }
        });
        return;
      }
      if (err.code === 'PAYMENT_REQUIRED') {
        navigate(`/onboarding-payment?email=${encodeURIComponent(err.email || '')}&role=${err.role || ''}&fee=${err.fee || currentRoleFee}`);
        return;
      }
      setError(err.message || 'Google Login failed.');
    }
  });

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      if (!tokenResponse?.access_token) {
        setError('Failed to receive access token from Google.');
        return;
      }
      googleLoginMutation.mutate({ token: tokenResponse.access_token });
    },
    onError: (errorResponse: any) => {
      console.error('Google Sign-in Popup Error:', errorResponse);
      if (errorResponse?.error === 'popup_closed_by_user') {
        setError('Sign-in cancelled. Please complete authentication in the popup.');
      } else if (errorResponse?.error === 'access_denied') {
        setError('Access was denied. Please ensure your email is added as an approved test user.');
      } else {
        setError(`Google Sign-in failed: ${errorResponse?.error_description || errorResponse?.error || 'Unknown error'}`);
      }
    },
    flow: 'implicit',
  });

  const handleGoogleClick = () => {
    if (!termsAccepted) {
      setError('Please agree to the Doxhaul Terms of Service and Privacy Policy before continuing with Google.');
      return;
    }
    setError('');
    triggerGoogleLogin();
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<{ token: string, user: any }>('/auth/register', {
        ...formData,
        termsAccepted: true
      });
    },
    onSuccess: (data) => {
      const user = data.user;
      const userRole = user?.role || formData.role;
      const feeToPay = userRole === 'CARRIER' ? carrierFee : userRole === 'BROKER' ? brokerFee : shipperFee;

      // Role Onboarding Fee Gate: If fee > $0, redirect to onboarding payment screen
      if (user?.onboarding_payment_status === 'PENDING_PAYMENT' || feeToPay > 0) {
        navigate(`/onboarding-payment?email=${encodeURIComponent(user?.email || formData.email)}&role=${userRole}&fee=${feeToPay}`);
      } else {
        login(data.token, data.user);
        navigate('/dashboard');
      }
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Registration failed. Please check your inputs.');
    }
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (!value && name !== 'mcNumber') {
      errorMsg = 'This field is required';
    } else if (name === 'phone') {
      const digits = (value || '').replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        errorMsg = 'Please enter a valid phone number (7-15 digits)';
      }
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMsg = 'Please enter a valid email address';
    } else if (name === 'password' && value.length < 8) {
      errorMsg = 'Password must be at least 8 characters';
    }
    
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!termsAccepted) {
      setError('You must agree to the Doxhaul Terms of Service and Privacy Policy to create an account.');
      return;
    }

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (key === 'mcNumber' && formData.role === 'SHIPPER') return;
      if (key === 'dotNumber' && formData.role !== 'CARRIER') return;
      
      const fieldValid = validateField(key, (formData as any)[key]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) return;

    registerMutation.mutate();
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-navy-900 mb-6 text-center">Create your account</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} />
          <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} />
        </div>
        
        <Input label="Company Name" name="companyName" required value={formData.companyName} onChange={handleChange} onBlur={handleBlur} error={errors.companyName} />
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Email Address" type="email" name="email" required value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
          <div>
            <CountryPhoneInput
              label="Phone Number"
              name="phone"
              required
              value={formData.phone}
              onChange={(val) => {
                setFormData(prev => ({ ...prev, phone: val }));
                if (errors.phone) validateField('phone', val);
              }}
              onBlur={() => validateField('phone', formData.phone)}
              error={errors.phone}
            />
          </div>
        </div>
        
        <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
        
        <div>
          <Select 
            label="I am a..." 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'SHIPPER', label: `Shipper ($${shipperFee} Fee)` },
              { value: 'BROKER', label: `Broker ($${brokerFee} Fee)` },
              { value: 'CARRIER', label: `Carrier ($${carrierFee} Fee)` }
            ]}
          />
          <div className="mt-2 flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Onboarding Activation Gate:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
              ${currentRoleFee} USD
            </span>
          </div>
        </div>
        
        {formData.role === 'CARRIER' && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md border border-slate-200">
            <Input label="DOT Number" name="dotNumber" required value={formData.dotNumber} onChange={handleChange} onBlur={handleBlur} error={errors.dotNumber} />
            <Input label="MC Number" name="mcNumber" value={formData.mcNumber} onChange={handleChange} onBlur={handleBlur} error={errors.mcNumber} />
          </div>
        )}
        
        {formData.role === 'BROKER' && (
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <Input label="MC Number" name="mcNumber" required value={formData.mcNumber} onChange={handleChange} onBlur={handleBlur} error={errors.mcNumber} />
          </div>
        )}

        {/* Terms & Conditions Agreement Checkbox */}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            required
          />
          <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none">
            I agree to the <a href="/terms" target="_blank" rel="noreferrer" className="text-blue-600 underline">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noreferrer" className="text-blue-600 underline">Privacy Policy</a>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          isLoading={registerMutation.isPending}
          disabled={!termsAccepted || registerMutation.isPending}
        >
          Create Account
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
          onClick={handleGoogleClick}
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
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-blue hover:text-brand-blue/80">
          Sign In
        </Link>
      </div>

      {/* Demo Auto-fill */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <button 
          type="button" 
          onClick={() => { 
            setFormData({
              firstName: 'Demo', lastName: 'User', email: `demo${Math.floor(Math.random()*1000)}@example.com`, phone: '+15551234567',
              password: 'Password123!', companyName: 'Demo Logistics LLC', role: 'SHIPPER',
              dotNumber: '', mcNumber: ''
            }); 
            setTermsAccepted(true);
            setErrors({}); 
          }}
          className="w-full text-center px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
        >
          Auto-fill with Demo Data
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
