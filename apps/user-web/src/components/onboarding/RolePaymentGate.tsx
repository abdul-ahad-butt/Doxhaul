import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  RefreshCw, 
  Zap, 
  Check, 
  ArrowRight,
  Truck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/client';
import { useQueryClient } from '@tanstack/react-query';

interface RolePaymentGateProps {
  children?: React.ReactNode;
}

export const RolePaymentGate: React.FC<RolePaymentGateProps> = ({ children }) => {
  const { user, activeRole } = useAuth();
  const queryClient = useQueryClient();

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [roleFee, setRoleFee] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [user?.role, activeRole]);

  const fetchConfig = async () => {
    try {
      const config = await apiClient.get<any>('/wallet/config');
      if (config) {
        const fees = config.onboardingFees || {};
        const currentRole = user?.role || activeRole;
        const feeForRole = Number(fees[currentRole] ?? 0);
        setRoleFee(feeForRole);
      }
    } catch (err) {
      console.warn('Failed to fetch wallet config:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // If user is Admin, or user is not logged in yet, or config is loading, don't block
  if (!user || user.role === 'ADMIN' || loadingConfig) {
    return <>{children}</>;
  }

  // Check if onboarding fee is already paid or fee is 0
  const isPaid = Boolean((user as any).onboarding_paid);
  if (isPaid || roleFee <= 0) {
    return <>{children}</>;
  }

  const handleCheckout = async (simulated: boolean = false) => {
    setProcessing(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.post<any>('/wallet/onboarding/checkout', {
        simulated,
      });

      if (res?.paid) {
        setSuccess(true);
        // Invalidate auth query to refresh user state
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      } else if (res?.checkoutUrl && !res.checkoutUrl.startsWith('#')) {
        window.location.href = res.checkoutUrl;
      } else {
        // Fallback simulated success
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  const roleName = user.role === 'CARRIER' 
    ? 'Carrier & Driver' 
    : user.role === 'BROKER' 
    ? 'Freight Broker' 
    : 'Shipper';

  return (
    <>
      {/* Blurred background preview of the marketplace */}
      <div className="relative pointer-events-none select-none opacity-40 blur-[2px]">
        {children}
      </div>

      {/* Non-dismissible Onboarding Gate Modal */}
      <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-6 relative animate-in fade-in zoom-in-95 my-8">
          {/* Header Icon & Tag */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-blue/30">
              {user.role === 'CARRIER' ? <Truck className="w-7 h-7" /> : <Building2 className="w-7 h-7" />}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold border border-blue-100 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Account Activation Required
            </div>
            <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
              Complete {roleName} Setup
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Activate your verified {user.role.toLowerCase()} account to unlock live freight load matching and direct platform escrow payouts.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                One-Time Registration Fee
              </span>
              <span className="text-xs text-slate-400">Includes KYC compliance & escrow verification</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-navy-900 font-mono">
                ${roleFee.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium block">USD</span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>
                <strong className="text-slate-900">Direct Load Board Access:</strong> Search, bid, and instant-book verified commercial loads across North America.
              </span>
            </div>

            <div className="flex items-start gap-3 text-sm text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>
                <strong className="text-slate-900">Automated Escrow Security:</strong> Guaranteed payment hold before dispatch and immediate release upon delivery.
              </span>
            </div>

            <div className="flex items-start gap-3 text-sm text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>
                <strong className="text-slate-900">Priority Verification:</strong> Fast-track automated Persona identity and authority validation.
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Account activated successfully! Unlocking your dashboard...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => handleCheckout(false)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-blue hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-xl shadow-brand-blue/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting to Paddle Checkout...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ${roleFee.toFixed(2)} USD via Paddle Checkout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Instant Test Mode Activation */}
            <button
              type="button"
              onClick={() => handleCheckout(true)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Instant Sandbox Activation (Demo Mode)
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Powered by Paddle.com & Persona KYC. 256-bit SSL encrypted transaction.
          </p>
        </div>
      </div>
    </>
  );
};

export default RolePaymentGate;
