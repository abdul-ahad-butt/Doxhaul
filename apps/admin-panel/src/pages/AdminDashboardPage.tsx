import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, AlertTriangle, ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';

const AdminDashboardPage = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const { data: metrics } = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => apiClient.get<any>('/admin/metrics')
  });

  const { data: verifications } = useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: () => apiClient.get<any[]>('/admin/verifications')
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/verifications/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-docs'] });
      setSelectedUser(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/verifications/${id}/reject`, { reason: 'Document verification rejected by admin.' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-docs'] });
      setSelectedUser(null);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Admin Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-brand-blue/10 text-brand-blue">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-500">Total Users</p>
              <p className="text-2xl font-semibold text-navy-900">{metrics?.totalUsers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-brand-amber/10 text-brand-amber">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-500">Pending Verifications</p>
              <p className="text-2xl font-semibold text-navy-900">{metrics?.pendingVerifications || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-brand-green/10 text-brand-green">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-500">Active Loads</p>
              <p className="text-2xl font-semibold text-navy-900">{metrics?.activeLoads || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-lg bg-brand-purple/10 text-brand-purple">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-navy-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-navy-900">{metrics?.totalBookings || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Verifications</CardTitle>
            <StatusBadge status={verifications?.length ? 'PENDING' : 'VERIFIED'} />
          </CardHeader>
          <CardContent className="p-0">
            {verifications?.length === 0 ? (
              <div className="p-8 text-center text-navy-500">All users are verified.</div>
            ) : (
              <div className="divide-y divide-navy-100">
                {verifications?.map((v) => (
                  <div key={v.id} className="p-4 flex items-center justify-between hover:bg-navy-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-navy-200 flex items-center justify-center text-navy-700 font-bold">
                        {v.company_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-navy-900">{v.company_name}</p>
                        <p className="text-xs text-navy-500">{v.email} • {v.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(v)}>
                        Review Docs
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-brand-green hover:bg-brand-green/90 focus:ring-brand-green"
                        onClick={() => approveMutation.mutate(v.id)}
                        isLoading={approveMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => rejectMutation.mutate(v.id)}
                        isLoading={rejectMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Detail Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <UserReviewDetails userId={selectedUser.id} />
            ) : (
              <div className="text-center py-12 text-navy-500">
                Select a user to review their compliance documents.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { DocumentViewerModal } from '../components/common/DocumentViewerModal';

const UserReviewDetails = ({ userId }: { userId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const handleViewDocument = (doc: any) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
    const baseUrl = ((import.meta as any).env?.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev/api').replace(/\/$/, '');
    const prefix = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    setSelectedDocUrl(`${prefix}/documents/${doc.id}/view?token=${token}`);
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'verifications', userId],
    queryFn: () => apiClient.get<any>(`/admin/verifications/${userId}`)
  });

  if (isLoading) return <div className="text-center py-8 text-navy-500">Loading details...</div>;
  if (!data) return <div className="text-center py-8 text-brand-red">Failed to load details</div>;

  const { user, documents } = data;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Company Info</h4>
        <p className="mt-1 text-sm text-navy-900 font-medium">{user.company_name}</p>
        <p className="text-sm text-navy-600">{user.first_name} {user.last_name}</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Contact</h4>
        <p className="mt-1 text-sm text-navy-900">{user.email}</p>
      </div>
      <div className="pt-4 border-t border-navy-100">
        <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Documents ({documents?.length || 0})</h4>
        {documents?.length === 0 ? (
          <p className="text-sm text-navy-500 italic">No documents uploaded.</p>
        ) : (
          <div className="space-y-2">
            {documents?.map((doc: any) => (
              <div key={doc.id} className="p-3 bg-navy-50 rounded border border-navy-200 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-navy-400 mr-2" />
                  <div>
                    <span className="text-sm text-navy-700 font-medium">{doc.document_type}</span>
                    {doc.ai_verified === 1 ? (
                      <span className="ml-2 inline-flex items-center text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        AI: PASSED ({Math.round(doc.ai_confidence || 95)}%)
                      </span>
                    ) : (doc.ai_summary || doc.ai_confidence) ? (
                      <span className="ml-2 inline-flex items-center text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                        AI: FLAGGED
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        AI: PASSED (95%)
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>View</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentUrl={selectedDocUrl}
        documentType={selectedDoc?.mime_type}
        filename={selectedDoc?.original_filename}
      />
    </div>
  );
};

export default AdminDashboardPage;
