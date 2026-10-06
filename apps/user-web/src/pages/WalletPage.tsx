import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  PlusCircle, 
  ChevronRight, 
  TrendingUp, 
  Receipt 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';

interface WalletData {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  currency: string;
  totalEarned: number;
  totalSpent: number;
  totalFees: number;
  recentTransactions: any[];
}

export const WalletPage: React.FC = () => {
  const { activeRole } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState<number>(250);
  const [depositing, setDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [payoutMethod, setPayoutMethod] = useState<'BANK_ACH' | 'PAYPAL' | 'STRIPE_CONNECT' | 'WIRE'>('BANK_ACH');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletAndTransactions();
  }, [filterType]);

  const fetchWalletAndTransactions = async () => {
    setLoading(true);
    try {
      const [walletRes, txnsRes] = await Promise.all([
        apiClient.get<WalletData>('/wallet'),
        apiClient.get<{ items: any[] }>(`/wallet/transactions?type=${filterType}`),
      ]);
      setWallet(walletRes);
      setTransactions(txnsRes.items || []);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletAndTransactions();
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositing(true);
    setDepositError(null);
    setDepositSuccess(null);

    try {
      const res = await apiClient.post<any>('/wallet/deposit', {
        amount: Number(depositAmount),
        mode: 'direct_sandbox', // Allows instant top-up in testing environment
      });

      if (res?.checkoutUrl && !res.checkoutUrl.startsWith('#')) {
        window.location.href = res.checkoutUrl;
        return;
      }

      setDepositSuccess(`Successfully added $${Number(depositAmount).toFixed(2)} USD to your wallet!`);
      setTimeout(() => {
        setShowDepositModal(false);
        setDepositSuccess(null);
        fetchWalletAndTransactions();
      }, 1500);
    } catch (err: any) {
      setDepositError(err.message || 'Deposit failed');
    } finally {
      setDepositing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawing(true);
    setWithdrawError(null);
    setWithdrawSuccess(null);

    try {
      await apiClient.post<any>('/wallet/withdraw', {
        amount: Number(withdrawAmount),
        payoutMethod,
        accountDetails: accountDetails.trim() || 'Bank Account ending in 4242',
      });

      setWithdrawSuccess(`Payout request for $${Number(withdrawAmount).toFixed(2)} USD submitted!`);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(null);
        fetchWalletAndTransactions();
      }, 1500);
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal request failed');
    } finally {
      setWithdrawing(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return `$${Number(amt || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Deposit</span>;
      case 'ESCROW_LOCK':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Escrow Hold</span>;
      case 'ESCROW_RELEASE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-brand-blue border border-blue-200">Escrow Release</span>;
      case 'PLATFORM_FEE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Platform Fee</span>;
      case 'PAYOUT_WITHDRAWAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Withdrawal</span>;
      case 'ONBOARDING_FEE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Onboarding Fee</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">{type}</span>;
    }
  };

  if (loading && !wallet) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
          <p className="text-sm font-medium text-slate-500">Loading Secure Wallet...</p>
        </div>
      </div>
    );
  }

  const isCarrier = activeRole === 'CARRIER';
  const isShipperOrBroker = activeRole === 'SHIPPER' || activeRole === 'BROKER';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" /> Doxhaul Automated Escrow Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
            {isCarrier ? 'Carrier Wallet & Earnings' : 'Freight Wallet & Escrow'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time balance, guaranteed freight escrow holds, and instant transparent settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {isShipperOrBroker && (
            <button
              onClick={() => setShowDepositModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-sm shadow-md shadow-brand-blue/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Funds
            </button>
          )}

          {isCarrier && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={Number(wallet?.balance || 0) <= 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-40"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Request Payout
            </button>
          )}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-navy-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-40 h-40 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Balance</span>
              <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                {formatCurrency(wallet?.balance || 0)}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {isCarrier ? 'Ready for immediate withdrawal' : 'Available for load booking & commitments'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Currency: USD</span>
            {isCarrier ? (
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={Number(wallet?.balance || 0) <= 0}
                className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                Withdraw Funds <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowDepositModal(true)}
                className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                Deposit Funds <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Escrow Balance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Escrow (Protected)</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 font-mono">
                {formatCurrency(wallet?.escrowBalance || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Locked freight funds currently in transit
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" /> Guaranteed Payout
            </span>
            <span className="text-slate-400 font-medium">Auto-released on POD</span>
          </div>
        </div>

        {/* Total Earned / Total Spent */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isCarrier ? 'Total Freight Earned' : 'Total Freight Settled'}
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-brand-blue">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 font-mono">
                {formatCurrency(isCarrier ? (wallet?.totalEarned || 0) : (wallet?.totalSpent || 0))}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isCarrier ? 'Lifetime net freight earnings' : 'Lifetime completed haul volume'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Platform Commission:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(wallet?.totalFees || 0)}</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header & Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Financial Ledger & Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete transparent record of load escrow holds, payouts, deposits, and fees.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Activity' },
              { id: 'ESCROW_RELEASE', label: 'Payouts' },
              { id: 'ESCROW_LOCK', label: 'Escrow Holds' },
              { id: 'DEPOSIT', label: 'Deposits' },
              { id: 'PAYOUT_WITHDRAWAL', label: 'Withdrawals' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No transactions recorded yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isShipperOrBroker
                  ? 'Add funds to your wallet to start booking loads with guaranteed platform escrow.'
                  : 'Complete your first haul to see earnings and automated escrow payouts.'}
              </p>
              {isShipperOrBroker && (
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Funds Now
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Reference / Load</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                  <th className="py-3.5 px-6 text-right">Fee</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isPositive = tx.type === 'DEPOSIT' || (tx.type === 'ESCROW_RELEASE' && isCarrier);
                  const isNegative = tx.type === 'PAYOUT_WITHDRAWAL' || tx.type === 'ESCROW_LOCK';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getTypeBadge(tx.type)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-800">
                        {tx.load_reference ? (
                          <span className="font-semibold text-brand-blue">
                            {tx.load_reference}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 max-w-xs truncate">
                        {tx.notes || tx.load_title || 'Transaction processed'}
                      </td>
                      <td className={`py-4 px-6 font-mono text-xs font-bold text-right whitespace-nowrap ${
                        isPositive ? 'text-emerald-600' : isNegative ? 'text-slate-900' : 'text-slate-800'
                      }`}>
                        {isPositive ? '+' : isNegative ? '-' : ''}{formatCurrency(tx.amount)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400 text-right whitespace-nowrap">
                        {Number(tx.fee_deducted || 0) > 0 ? formatCurrency(tx.fee_deducted) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : tx.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL: ADD FUNDS (PADDLE / SANDBOX TOP-UP) */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-900">Add Funds to Wallet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fund your account securely via Paddle checkout to hold load payments in platform escrow.
                </p>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {depositSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {depositSuccess}
              </div>
            )}

            {depositError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                {depositError}
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Quick Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        depositAmount === amt
                          ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Or Custom Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Available Balance:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(wallet?.balance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Amount:</span>
                  <span className="font-semibold text-emerald-600">+{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>New Balance:</span>
                  <span>{formatCurrency((wallet?.balance || 0) + Number(depositAmount))}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={depositing || depositAmount <= 0}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {depositing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add ${Number(depositAmount).toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST PAYOUT / WITHDRAWAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-900">Request Payout</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Withdraw your available freight earnings directly to your bank account or payment provider.
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {withdrawSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {withdrawSuccess}
              </div>
            )}

            {withdrawError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Amount ($ USD)
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(Number(wallet?.balance || 0))}
                    className="text-xs text-brand-blue hover:underline font-semibold"
                  >
                    Withdraw All ({formatCurrency(wallet?.balance || 0)})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={wallet?.balance || 0}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'BANK_ACH', label: 'Bank Direct ACH' },
                    { id: 'PAYPAL', label: 'PayPal Instant' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayoutMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        payoutMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  {payoutMethod === 'PAYPAL' ? 'PayPal Email Address' : 'Bank Routing & Account Details'}
                </label>
                <input
                  type="text"
                  placeholder={payoutMethod === 'PAYPAL' ? 'driver@example.com' : 'Routing: 121000358, Acct: ****4242'}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing || withdrawAmount <= 0 || withdrawAmount > Number(wallet?.balance || 0)}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {withdrawing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      Withdraw ${Number(withdrawAmount).toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
