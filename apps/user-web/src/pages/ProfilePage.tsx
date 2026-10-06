import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileUp, CheckCircle, Clock, AlertCircle, ShieldCheck, ExternalLink, Zap } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DocumentViewerModal } from '../components/common/DocumentViewerModal';

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState('INSURANCE_CERTIFICATE');
  const [uploadError, setUploadError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const [startingPersona, setStartingPersona] = useState(false);
  const [personaMsg, setPersonaMsg] = useState<string | null>(null);

  const handleStartPersona = async () => {
    setStartingPersona(true);
    setPersonaMsg(null);
    try {
      const res = await apiClient.post<any>('/profile/persona-inquiry');
      if (res?.redirectUrl) {
        window.open(res.redirectUrl, '_blank', 'noopener,noreferrer');
        setPersonaMsg('Persona verification opened in a new tab. Complete your ID check there.');
      }
    } catch (err: any) {
      setPersonaMsg(err.message || 'Failed to initialize Persona inquiry');
    } finally {
      setStartingPersona(false);
    }
  };

  const handleSimulatePersona = async () => {
    setStartingPersona(true);
    try {
      await apiClient.post<any>('/profile/simulate-persona-verify');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setPersonaMsg('Sandbox verification approved successfully!');
    } catch (err: any) {
      setPersonaMsg(err.message || 'Simulation failed');
    } finally {
      setStartingPersona(false);
    }
  };

  const handleViewDocument = (doc: any) => {
    const token = apiClient.getToken() || localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    const baseUrl = ((import.meta as any).env?.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev/api').replace(/\/$/, '');
    setSelectedDocUrl(`${baseUrl}/documents/${doc.id}/view?token=${token}`);
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => apiClient.get<any[]>('/documents')
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', selectedDocType);
      
      return apiClient.post('/documents', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setUploadError('');
    },
    onError: (err: any) => {
      setUploadError(err.message || 'Failed to upload document');
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File must be less than 10MB');
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  const renderBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          ✕ Declined / Rejected
        </span>
      );
    }
    if (s === 'APPROVED' || s === 'VERIFIED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          ✓ Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        ⏳ Pending Verification
      </span>
    );
  };

  const getDocTypeIcon = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'APPROVED':
      case 'VERIFIED':
        return <CheckCircle className="text-brand-green h-5 w-5" />;
      case 'REJECTED': 
        return <AlertCircle className="text-brand-red h-5 w-5" />;
      default: 
        return <Clock className="text-brand-amber h-5 w-5" />;
    }
  };

  const currentStatus = profile?.verification_status || (user as any)?.verification_status || user?.status || 'PENDING_VERIFICATION';
  const rejectionReason = profile?.verification_notes || (user as any)?.rejection_reason || null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Company Profile & Compliance</h2>
        {renderBadge(currentStatus)}
      </div>

      {(currentStatus === 'REJECTED' || (currentStatus || '').toUpperCase() === 'REJECTED') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800">Verification Application Declined</h3>
              <p className="mt-1 text-sm text-red-700">
                Your submitted document was not approved. Please wait 3 days before re-applying, or click the support assistant in the bottom-right corner to speak with our support team.
              </p>
              {rejectionReason && (
                <p className="mt-2 text-xs font-medium text-red-700 font-semibold">
                  Reason: {rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500">Company Name</label>
            <div className="mt-1 text-navy-900">{profile?.company_name || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500">Account Role</label>
            <div className="mt-1 text-navy-900 capitalize">{user?.role?.toLowerCase() || 'Carrier'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500">Primary Contact</label>
            <div className="mt-1 text-navy-900">{profile?.first_name} {profile?.last_name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500">Email Address</label>
            <div className="mt-1 text-navy-900">{user?.email}</div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Persona Identity Verification */}
      <Card className="border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100/60 text-brand-blue">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Automated Persona Identity Verification</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your driver's license (CDL), government photo ID, or operating authority instantly.
                </p>
              </div>
            </div>
            {renderBadge(currentStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Persona KYC & Driver License Validation
              </p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
                Complete a guided 60-second mobile ID capture to verify your credentials without manual waiting.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <Button
                onClick={handleStartPersona}
                isLoading={startingPersona}
                className="bg-brand-blue hover:bg-blue-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Start Persona Check
              </Button>
              <Button
                variant="outline"
                onClick={handleSimulatePersona}
                disabled={startingPersona}
                title="Sandbox test instant approval"
              >
                <Zap className="w-4 h-4 mr-1.5 text-amber-500" />
                Demo Verify
              </Button>
            </div>
          </div>

          {personaMsg && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              {personaMsg}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-navy-600 mb-4">
              Upload your required compliance documents below. Our team reviews all documents within 24 hours.
            </p>
            
            {uploadError && (
              <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-4 py-3 rounded text-sm mb-4">
                {uploadError}
              </div>
            )}

            <div className="flex items-end gap-4 bg-navy-50 p-4 rounded-lg border border-navy-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy-700 mb-1">Document Type</label>
                <select 
                  className="w-full px-3 py-2 border border-navy-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white"
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                >
                  <option value="INSURANCE_CERTIFICATE">Certificate of Insurance</option>
                  <option value="W9">W-9 Form</option>
                  <option value="MC_CERTIFICATE">MC Operating Authority</option>
                  <option value="DOT_CERTIFICATE">DOT Certificate</option>
                  <option value="DRIVER_LICENSE">Driver's License (CDL)</option>
                  <option value="BUSINESS_LICENSE">Business License</option>
                </select>
              </div>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploadMutation.isPending}
              >
                <FileUp className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-navy-500">Loading documents...</div>
            ) : documents?.length === 0 ? (
              <div className="text-center py-8 text-navy-500 bg-white border border-dashed border-navy-300 rounded-lg">
                No documents uploaded yet.
              </div>
            ) : (
              documents?.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-navy-200 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    {getDocTypeIcon(doc.status)}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-navy-900">
                        {doc.document_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-navy-500">
                        Uploaded on {new Date(doc.created_at || doc.uploaded_at).toLocaleDateString()}
                      </p>
                      {doc.rejection_reason && (
                        <p className="text-xs text-red-600 mt-0.5 font-medium">
                          Reason: {doc.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {renderBadge(doc.status)}
                    <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentUrl={selectedDocUrl}
        documentType={selectedDoc?.mime_type}
        filename={selectedDoc?.file_name || selectedDoc?.original_filename}
      />
    </div>
  );
};

export default ProfilePage;
