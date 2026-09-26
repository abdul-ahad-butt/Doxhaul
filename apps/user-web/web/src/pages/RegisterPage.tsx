import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', companyName: '', role: 'SHIPPER',
    dotNumber: '', mcNumber: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<{token: string, user: any}>('/auth/register', formData);
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/dashboard'); 
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Registration failed. Please check your inputs.');
    }
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (!value && name !== 'mcNumber') {
      errorMsg = 'This field is required';
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
          <Input label="Phone Number" name="phone" required value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} />
        </div>
        
        <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
        
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
        
        <Button type="submit" className="w-full mt-6" isLoading={registerMutation.isPending}>
          Create Account
        </Button>
      </form>
      
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
              firstName: 'Demo', lastName: 'User', email: `demo${Math.floor(Math.random()*1000)}@example.com`, phone: '(555) 123-4567',
              password: 'Password123!', companyName: 'Demo Logistics LLC', role: 'SHIPPER',
              dotNumber: '', mcNumber: ''
            }); 
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
