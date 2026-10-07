import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  DollarSign, 
  Sliders, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Sparkles,
  TrendingUp,
  Vault
} from 'lucide-react';
import { apiClient } from '../api/client';

export const IntegrationsSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Financial overview stats
  const [financials, setFinancials] = useState<{
    totalPlatformFees: number;
    totalOnboardingFees: number;
    totalSettledFreight: number;
    totalInEscrow: number;
    totalUserBalance: number;
  } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    paddle_environment: 'sandbox' as 'sandbox' | 'production',
    paddle_vendor_id: '',
    paddle_api_key: '',
    paddle_client_token: '',
    paddle_webhook_secret: '',
    platform_fee_percent: 7.5,
    carrier_onboarding_fee: 25.00,
    shipper_onboarding_fee: 0.00,
    broker_onboarding_fee: 50.00,
    persona_environment: 'sandbox' as 'sandbox' | 'production',
    persona_api_key: '',
    persona_template_id: '',
  });

  const [paddleEnv, setPaddleEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [personaEnv, setPersonaEnv] = useState<'sandbox' | 'production'>('sandbox');

  // Mask/unmask state
  const [showPaddleKey, setShowPaddleKey] = useState(false);
  const [showPaddleToken, setShowPaddleToken] = useState(false);
  const [showPaddleWebhook, setShowPaddleWebhook] = useState(false);
  const [showPersonaKey, setShowPersonaKey] = useState(false);

  // Testing status
  const [testingPaddle, setTestingPaddle] = useState(false);
  const [paddleTestResult, setPaddleTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [testingPersona, setTestingPersona] = useState(false);
  const [personaTestResult, setPersonaTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedWebhook, setCopiedWebhook] = useState(false);

  useEffect(() => {
    fetchSettingsAndFinancials();
  }, []);

  const fetchSettingsAndFinancials = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [settingsRes, financialsRes] = await Promise.all([
        apiClient.get<any>('/admin/settings'),
        apiClient.get<any>('/admin/financials').catch(() => null),
      ]);

      if (settingsRes) {
        const pEnv = (settingsRes.paddle_environment === 'production' ? 'production' : 'sandbox');
        const perEnv = (settingsRes.persona_environment === 'production' ? 'production' : 'sandbox');
        setPaddleEnv(pEnv);
        setPersonaEnv(perEnv);
        setSettings({
          paddle_environment: pEnv,
          paddle_vendor_id: settingsRes.paddle_vendor_id || '',
          paddle_api_key: settingsRes.paddle_api_key || '',
          paddle_client_token: settingsRes.paddle_client_token || '',
          paddle_webhook_secret: settingsRes.paddle_webhook_secret || '',
          platform_fee_percent: Number(settingsRes.platform_fee_percent ?? 7.5),
          carrier_onboarding_fee: Number(settingsRes.carrier_onboarding_fee ?? 25.0),
          shipper_onboarding_fee: Number(settingsRes.shipper_onboarding_fee ?? 0.0),
          broker_onboarding_fee: Number(settingsRes.broker_onboarding_fee ?? 50.0),
          persona_environment: perEnv,
          persona_api_key: settingsRes.persona_api_key || '',
          persona_template_id: settingsRes.persona_template_id || '',
        });
      }

      if (financialsRes) {
        setFinancials(financialsRes);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const payload = {
        ...settings,
        paddle_environment: paddleEnv,
        persona_environment: personaEnv,
      };
      const updated = await apiClient.put<any>('/admin/settings', payload);
      if (updated) {
        const pEnv = (updated.paddle_environment === 'production' ? 'production' : 'sandbox');
        const perEnv = (updated.persona_environment === 'production' ? 'production' : 'sandbox');
        setPaddleEnv(pEnv);
        setPersonaEnv(perEnv);
        setSettings(prev => ({
          ...prev,
          ...updated,
          paddle_environment: pEnv,
          persona_environment: perEnv,
          platform_fee_percent: Number(updated.platform_fee_percent ?? 7.5),
          carrier_onboarding_fee: Number(updated.carrier_onboarding_fee ?? 25.0),
          shipper_onboarding_fee: Number(updated.shipper_onboarding_fee ?? 0.0),
          broker_onboarding_fee: Number(updated.broker_onboarding_fee ?? 50.0),
        }));
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestPaddle = async () => {
    setTestingPaddle(true);
    setPaddleTestResult(null);
    try {
      const res = await apiClient.post<any>('/admin/settings/test-paddle', {
        paddle_api_key: settings.paddle_api_key,
        paddle_environment: paddleEnv,
      });
      setPaddleTestResult(res);
    } catch (err: any) {
      setPaddleTestResult({
        success: false,
        message: err.message || 'Paddle connection failed',
      });
    } finally {
      setTestingPaddle(false);
    }
  };

  const handleTestPersona = async () => {
    setTestingPersona(true);
    setPersonaTestResult(null);
    try {
      const res = await apiClient.post<any>('/admin/settings/test-persona', {
        persona_api_key: settings.persona_api_key,
        persona_template_id: settings.persona_template_id,
        persona_environment: personaEnv,
      });
      setPersonaTestResult(res);
    } catch (err: any) {
      setPersonaTestResult({
        success: false,
        message: err.message || 'Persona connection failed',
      });
    } finally {
      setTestingPersona(false);
    }
  };

  const copyWebhookUrl = () => {
    const liveWebhook = 'https://doxhaul.abdulahadbutt420.workers.dev/api/webhooks/paddle';
    navigator.clipboard.writeText(liveWebhook);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
          <p className="text-sm font-medium text-slate-500">Loading Integration Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
              <Sliders className="w-3.5 h-3.5" /> Financial & Compliance Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Integrations & Financial Settings
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Manage dynamic Paddle.com payment keys, automated Persona KYC identity verification, 
              platform commission splits, and role-based onboarding monetization.
            </p>
          </div>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-brand-blue/30 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Alerts */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium">Platform settings successfully updated and live in Cloudflare D1!</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Financial Overview Metrics */}
      {financials && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Revenue</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${financials.totalPlatformFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total earned commissions</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Escrow</span>
              <div className="p-2 rounded-lg bg-blue-50 text-brand-blue">
                <Vault className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${financials.totalInEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Locked freight in transit</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Onboarding Revenue</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${financials.totalOnboardingFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Registration fees collected</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Balances</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${financials.totalUserBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Available in user wallets</p>
          </div>
        </div>
      )}

      {/* Section A: Paddle Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-brand-blue border border-blue-100">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Section A: Paddle.com Payment Configuration</h2>
              <p className="text-sm text-slate-500">
                Configure Paddle Billing v2 for role onboarding payments, wallet top-ups, and customer invoicing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestPaddle}
            disabled={testingPaddle || !settings.paddle_api_key}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40 self-start sm:self-auto cursor-pointer"
          >
            {testingPaddle ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-brand-blue" />}
            Test Paddle Connection
          </button>
        </div>

        {paddleTestResult && (
          <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
            paddleTestResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {paddleTestResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{paddleTestResult.success ? 'Paddle Connection Succeeded' : 'Paddle Connection Failed'}</p>
              <p className="text-xs mt-0.5">{paddleTestResult.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Selector */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paddle Environment
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                paddleEnv === 'sandbox'
                  ? 'border-brand-blue bg-blue-50/50 text-brand-blue shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="paddle_environment"
                  value="sandbox"
                  checked={paddleEnv === 'sandbox'}
                  onChange={() => {
                    setPaddleEnv('sandbox');
                    setSettings(s => ({ ...s, paddle_environment: 'sandbox' }));
                  }}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Sandbox (Testing)
              </label>

              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                paddleEnv === 'production'
                  ? 'border-brand-blue bg-blue-50/50 text-brand-blue shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="paddle_environment"
                  value="production"
                  checked={paddleEnv === 'production'}
                  onChange={() => {
                    setPaddleEnv('production');
                    setSettings(s => ({ ...s, paddle_environment: 'production' }));
                  }}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Production (Live)
              </label>
            </div>
          </div>

          {/* Vendor ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paddle Vendor ID
            </label>
            <input
              type="text"
              placeholder="e.g. 123456"
              value={settings.paddle_vendor_id}
              onChange={(e) => setSettings(s => ({ ...s, paddle_vendor_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-800 placeholder-slate-400 font-mono"
            />
          </div>

          {/* Client Token */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paddle Client Token (Frontend SDK)
            </label>
            <div className="relative">
              <input
                type={showPaddleToken ? 'text' : 'password'}
                placeholder="test_... or live_..."
                value={settings.paddle_client_token}
                onChange={(e) => setSettings(s => ({ ...s, paddle_client_token: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-800 placeholder-slate-400 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPaddleToken(!showPaddleToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPaddleToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Secret API Key */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paddle API Secret Key
            </label>
            <div className="relative">
              <input
                type={showPaddleKey ? 'text' : 'password'}
                placeholder="pdl_api_..."
                value={settings.paddle_api_key}
                onChange={(e) => setSettings(s => ({ ...s, paddle_api_key: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-800 placeholder-slate-400 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPaddleKey(!showPaddleKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPaddleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Webhook Secret */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paddle Webhook Secret (Signature Validation)
            </label>
            <div className="relative">
              <input
                type={showPaddleWebhook ? 'text' : 'password'}
                placeholder="pdl_ntfset_..."
                value={settings.paddle_webhook_secret}
                onChange={(e) => setSettings(s => ({ ...s, paddle_webhook_secret: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-800 placeholder-slate-400 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPaddleWebhook(!showPaddleWebhook)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPaddleWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Webhook Destination URL copy box */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="truncate">
                <span className="font-semibold text-slate-700">Webhook Notification URL:</span>{' '}
                <code className="text-brand-blue">https://doxhaul.abdulahadbutt420.workers.dev/api/webhooks/paddle</code>
              </div>
              <button
                type="button"
                onClick={copyWebhookUrl}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex-shrink-0 cursor-pointer"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                {copiedWebhook ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Platform & Onboarding Fees */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Section B: Platform & Onboarding Financial Policies</h2>
            <p className="text-sm text-slate-500">
              Set the commission percentage deducted automatically upon load delivery and registration gate fees per role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Platform Fee Percent */}
          <div className="lg:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Platform Commission (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.platform_fee_percent}
                onChange={(e) => setSettings(s => ({ ...s, platform_fee_percent: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-900 font-bold pr-10"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Deducted from completed load payouts into platform revenue.</p>
          </div>

          {/* Carrier Onboarding Fee */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Carrier Onboarding Fee
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={settings.carrier_onboarding_fee}
                onChange={(e) => setSettings(s => ({ ...s, carrier_onboarding_fee: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-900 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Driver registration & verification fee in USD.</p>
          </div>

          {/* Shipper Onboarding Fee */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Shipper Onboarding Fee
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={settings.shipper_onboarding_fee}
                onChange={(e) => setSettings(s => ({ ...s, shipper_onboarding_fee: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-900 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Registration fee in USD (set to 0 for free).</p>
          </div>

          {/* Broker Onboarding Fee */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Broker Onboarding Fee
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={settings.broker_onboarding_fee}
                onChange={(e) => setSettings(s => ({ ...s, broker_onboarding_fee: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-slate-900 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Broker registration & compliance fee in USD.</p>
          </div>
        </div>
      </div>

      {/* Section C: Persona Identity Verification Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Section C: Persona Automated Identity Verification</h2>
              <p className="text-sm text-slate-500">
                Configure Persona KYC for automated driver license and DOT/MC government ID validation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestPersona}
            disabled={testingPersona || !settings.persona_api_key}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40 self-start sm:self-auto cursor-pointer"
          >
            {testingPersona ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
            Test Persona Connection
          </button>
        </div>

        {personaTestResult && (
          <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
            personaTestResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {personaTestResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{personaTestResult.success ? 'Persona Connection Succeeded' : 'Persona Connection Failed'}</p>
              <p className="text-xs mt-0.5">{personaTestResult.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Persona Environment */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Persona Environment
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                personaEnv === 'sandbox'
                  ? 'border-purple-600 bg-purple-50/50 text-purple-700 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="persona_environment"
                  value="sandbox"
                  checked={personaEnv === 'sandbox'}
                  onChange={() => {
                    setPersonaEnv('sandbox');
                    setSettings(s => ({ ...s, persona_environment: 'sandbox' }));
                  }}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Sandbox (Test KYC)
              </label>

              <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                personaEnv === 'production'
                  ? 'border-purple-600 bg-purple-50/50 text-purple-700 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="persona_environment"
                  value="production"
                  checked={personaEnv === 'production'}
                  onChange={() => {
                    setPersonaEnv('production');
                    setSettings(s => ({ ...s, persona_environment: 'production' }));
                  }}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Production (Live KYC)
              </label>
            </div>
          </div>

          {/* Persona API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Persona Secret API Key
            </label>
            <div className="relative">
              <input
                type={showPersonaKey ? 'text' : 'password'}
                placeholder="persona_key_..."
                value={settings.persona_api_key}
                onChange={(e) => setSettings(s => ({ ...s, persona_api_key: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-sm text-slate-800 placeholder-slate-400 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPersonaKey(!showPersonaKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPersonaKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Persona Template ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Persona KYC Template ID
            </label>
            <input
              type="text"
              placeholder="itmpl_..."
              value={settings.persona_template_id}
              onChange={(e) => setSettings(s => ({ ...s, persona_template_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-sm text-slate-800 placeholder-slate-400 font-mono"
            />
          </div>

          {/* Persona Webhook Endpoint info */}
          <div className="col-span-full">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="truncate">
                <span className="font-semibold text-slate-700">Persona Webhook Callback URL:</span>{' '}
                <code className="text-purple-600">https://doxhaul.abdulahadbutt420.workers.dev/api/webhooks/persona</code>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://doxhaul.abdulahadbutt420.workers.dev/api/webhooks/persona');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex-shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Floating Bottom Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => fetchSettingsAndFinancials()}
          className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
        >
          Reset to Saved
        </button>
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IntegrationsSettingsPage;
