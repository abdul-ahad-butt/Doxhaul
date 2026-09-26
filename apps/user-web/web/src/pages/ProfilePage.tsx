import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileUp, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState('INSURANCE');
  const [uploadError, setUploadError] = useState('');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => apiClient.get<any[]>('/documents')
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', selectedDocType);
      
      return apiClient.post('/documents', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      setUploadError('');
    },
    onError: (err: any) => {
      setUploadError(err.message || 'Failed to upload document');
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File must be less than 5MB');
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  const getDocTypeIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="text-brand-green h-5 w-5" />;
      case 'PENDING': return <Clock className="text-brand-amber h-5 w-5" />;
      case 'REJECTED': return <AlertCircle className="text-brand-red h-5 w-5" />;
      default: return <FileText className="text-navy-400 h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Company Profile & Compliance</h2>
        <StatusBadge status={profile?.verification_status || 'PENDING'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500">Company Name</label>
            <div className="mt-1 text-navy-900">{profile?.company_name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500">Account Role</label>
            <div className="mt-1 text-navy-900 capitalize">{user?.role.toLowerCase()}</div>
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
                  <option value="INSURANCE">Certificate of Insurance</option>
                  <option value="W9">W-9 Form</option>
                  <option value="MC_AUTHORITY">MC Operating Authority</option>
                  <option value="CDL">Driver's License (CDL)</option>
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
              documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-navy-200 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    {getDocTypeIcon(doc.status)}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-navy-900">
                        {doc.document_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-navy-500">
                        Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={doc.status} />
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.file_url)}>
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
