import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Building2,
  Truck,
  Package
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const OnboardingPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user: authUser } = useAuth();

  const emailParam = searchParams.get('email') || authUser?.email || '';
  const roleParam = searchParams.get('role') || authUser?.role || 'CARRIER';
  const feeParam = searchParams.get('fee');

  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch live user onboarding status and required fee from backend
  const { data: statusData } = useQuery({
    queryKey: ['onboarding-status', emailParam],
    queryFn: async () => {
      if (!emailParam) return null;
      try {
        return await apiClient.get<any>(`/onboarding/status?email=${encodeURIComponent(emailParam)}`);
      } catch {
        return null;
      }
    },
    enabled: !!emailParam,
    staleTime: 30 * 1000,
  });

  const effectiveRole = statusData?.role || roleParam;
  const effectiveFee = statusData?.requiredFee ?? (feeParam ? parseFloat(feeParam) : (effectiveRole === 'BROKER' ? 50 : effectiveRole === 'CARRIER' ? 25 : 30));

  // If status is already ACTIVE and paid, auto-redirect
  useEffect(() => {
    if (statusData && !statusData.isPendingPayment && statusData.onboarding_paid === 1) {
      setPaymentSuccess(true);
    }
  }, [statusData]);

  const handleSimulatePayment = async () => {
    setPaying(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.post<any>('/onboarding/simulate-payment', {
        email: emailParam,
        role: effectiveRole,
      });

      if (res && res.token && res.user) {
        login(res.token, res.user);
      }

      setPaymentSuccess(true);
      setTimeout(() => {
        if (effectiveRole === 'CARRIER') {
          navigate('/loads');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const getRoleIcon = () => {
    if (effectiveRole === 'CARRIER') return <Truck className="w-5 h-5 text-emerald-600" />;
    if (effectiveRole === 'BROKER') return <Building2 className="w-5 h-5 text-indigo-600" />;
    return <Package className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue border border-blue-100 shadow-sm mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Activate Your {effectiveRole} Account
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Complete the required onboarding compliance fee to unlock marketplace load booking, dispatch tools, and credentials.
        </p>
      </div>

      {paymentSuccess ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Onboarding Payment Confirmed!</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your {effectiveRole} account has been activated with full marketplace privileges. Redirecting you to your portal...
          </p>
          <Button
            onClick={() => {
              if (effectiveRole === 'CARRIER') navigate('/loads');
              else navigate('/dashboard');
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Enter Marketplace Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Order / Fee Summary Header */}
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  {getRoleIcon()}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Role</div>
                  <div className="text-base font-bold text-navy-950">{effectiveRole}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Pending Activation
                </span>
              </div>
            </div>

            {emailParam && (
              <div className="pt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Registered Email:</span>
                <span className="font-semibold text-slate-900 font-mono">{emailParam}</span>
              </div>
            )}
          </div>

          {/* Pricing breakdown */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{effectiveRole} Onboarding & Verification Fee</span>
                <span className="font-semibold text-slate-900">${effectiveFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Platform Compliance & Identity Validation</span>
                <span className="font-semibold text-emerald-600">Included ($0.00)</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold text-navy-950">
                <span>Total Due Today:</span>
                <span className="text-xl text-brand-blue">${effectiveFee.toFixed(2)} USD</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Payment Error</p>
                  <p className="text-xs mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Simulated Payment Action */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={paying}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Payment (${effectiveFee})...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Simulate Live Payment (${effectiveFee} USD)
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>256-Bit Encrypted &middot; Instant Account Unlock &middot; Powered by Doxhaul D1</span>
              </div>
            </div>

            {/* Back to sign in link */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-brand-blue transition-colors">
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPaymentPage;
