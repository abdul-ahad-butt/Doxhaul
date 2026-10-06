import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CreditCard, DollarSign, Download, ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import { VerificationAlertBanner } from '../components/dashboard/VerificationAlertBanner';

export const InvoicesPage = () => {
  const { user, profile } = useAuth();
  const role = (user?.role || 'CARRIER').toUpperCase();
  const isShipperOrBroker = role === 'SHIPPER' || role === 'BROKER';

  const verificationStatus = profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING';

  return (
    <div className="space-y-6">
      <VerificationAlertBanner 
        status={verificationStatus}
        role={role}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            {isShipperOrBroker ? 'Invoices & Spend' : 'Billing & Payouts'}
          </h1>
          <p className="text-sm text-navy-500 mt-1">
            Manage your settlement statements, invoices, and payment tracking.
          </p>
        </div>
        <button 
          onClick={() => alert('Exporting statement as CSV...')}
          className="inline-flex items-center px-4 py-2 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 shadow-sm cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4 mr-2 text-navy-500" />
          Export Statements
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-brand-blue/10 text-brand-blue">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy-500">
                  {isShipperOrBroker ? 'Total Billed (YTD)' : 'Total Earnings (YTD)'}
                </p>
                <p className="text-2xl font-bold text-navy-900">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-brand-amber/10 text-brand-amber">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy-500">
                  {isShipperOrBroker ? 'Pending Invoices' : 'Pending Payouts'}
                </p>
                <p className="text-2xl font-bold text-navy-900">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-brand-green/10 text-brand-green">
                <Receipt className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-navy-500">Settled Invoices</p>
                <p className="text-2xl font-bold text-navy-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-navy-100 flex flex-row items-center justify-between">
          <CardTitle>Recent Invoices & Transactions</CardTitle>
          <span className="text-xs text-navy-400">Automated freight settlement</span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mb-3">
              {isShipperOrBroker ? (
                <ArrowUpRight className="w-6 h-6 text-navy-400" />
              ) : (
                <ArrowDownLeft className="w-6 h-6 text-navy-400" />
              )}
            </div>
            <p className="text-base font-semibold text-navy-800">No invoices generated yet</p>
            <p className="text-sm text-navy-500 mt-1 max-w-sm text-center">
              Invoices are automatically created upon delivery confirmation and Bill of Lading (BOL) verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
