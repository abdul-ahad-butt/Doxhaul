import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CountryPhoneInput } from '../components/ui/CountryPhoneInput';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Check location state first, or session storage if page was refreshed, or dev fallback
  const stateData = location.state || {};
  const [sessionAuth] = useState(() => {
    try {
      const saved = sessionStorage.getItem('doxhaul_pending_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const email = stateData.email || sessionAuth?.email || searchParams?.get('email') || 'ekedmy.com@gmail.com';
  const googleToken = stateData.googleToken || sessionAuth?.googleToken || searchParams?.get('token') || 'dev-google-token';
  const googleId = stateData.googleId || sessionAuth?.googleId || searchParams?.get('googleId') || 'dev-google-id';
  const name = stateData.name || sessionAuth?.name || searchParams?.get('name') || 'Steve Scott';

  useEffect(() => {
    if (stateData.email && stateData.googleToken) {
      try {
        sessionStorage.setItem('doxhaul_pending_profile', JSON.stringify({
          email: stateData.email,
          googleToken: stateData.googleToken,
          googleId: stateData.googleId,
          name: stateData.name
        }));
      } catch {}
    }
  }, [stateData]);

  // Pre-fill name if we got it
  const defaultFirstName = name ? name.split(' ')[0] : '';
  const defaultLastName = name ? name.split(' ').slice(1).join(' ') : '';

  const [formData, setFormData] = useState({
    firstName: defaultFirstName, 
    lastName: defaultLastName, 
    phone: '',
    phoneNumber: '',
    companyName: '', 
    role: 'SHIPPER',
    dotNumber: '', 
    mcNumber: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  // Protect route
  if (!googleToken || !email) {
    return <Navigate to="/login" replace />;
  }

  const completeMutation = useMutation({
    mutationFn: async () => {
      const finalPhone = formData.phoneNumber || formData.phone;
      return apiClient.post<{token: string, user: any}>('/auth/google-complete', { 
        ...formData,
        phone: finalPhone,
        phoneNumber: finalPhone,
        email,
        googleId,
        googleToken
      });
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      if (data.user.role === 'ADMIN') navigate('/admin');
      else if (data.user.role === 'CARRIER') navigate('/loads');
      else navigate('/dashboard');
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Registration failed. Please check your inputs.');
    }
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (!value && name !== 'mcNumber') {
      errorMsg = 'This field is required';
    } else if (name === 'phone' || name === 'phoneNumber') {
      const digits = (value || '').replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        errorMsg = 'Please enter a valid phone number (7-15 digits)';
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg,
      ...(name === 'phone' ? { phoneNumber: errorMsg } : {}),
      ...(name === 'phoneNumber' ? { phone: errorMsg } : {})
    }));
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
    
    // Validate all fields
    let isValid = true;
    const phoneVal = formData.phoneNumber || formData.phone;
    if (!validateField('phoneNumber', phoneVal)) {
      isValid = false;
    }

    Object.keys(formData).forEach(key => {
      if (key === 'phone' || key === 'phoneNumber') return;
      if (key === 'mcNumber' && formData.role === 'SHIPPER') return;
      if (key === 'dotNumber' && formData.role !== 'CARRIER') return;
      
      const fieldValid = validateField(key, (formData as any)[key]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) return;

    completeMutation.mutate();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-navy-900">Complete your profile</h3>
        <p className="text-sm text-slate-500 mt-2">
          You're signing in with <span className="font-semibold text-slate-700">{email}</span>. Just a few more details to get you started!
        </p>
      </div>
      
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
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number <span className="text-brand-red">*</span>
          </label>
          <CountryPhoneInput
            value={formData.phoneNumber || formData.phone}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, phone: val, phoneNumber: val }));
              if (errors.phoneNumber || errors.phone) {
                validateField('phoneNumber', val);
              }
            }}
            onBlur={() => validateField('phoneNumber', formData.phoneNumber || formData.phone)}
            error={errors.phoneNumber || errors.phone}
          />
        </div>
        
        <Select 
          label="I am a..." 
          name="role" 
          value={formData.role} 
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'SHIPPER', label: 'Shipper' },
            { value: 'BROKER', label: 'Broker' },
            { value: 'CARRIER', label: 'Carrier' }
          ]}
        />
        
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
        
        <Button type="submit" className="w-full mt-6" isLoading={completeMutation.isPending}>
          Complete Registration
        </Button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
