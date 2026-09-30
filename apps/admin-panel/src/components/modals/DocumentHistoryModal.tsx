import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onViewDocument: (doc: any) => void;
}

export const DocumentHistoryModal = ({
  isOpen,
  onClose,
  user,
  onViewDocument,
}: DocumentHistoryModalProps) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['admin-user-docs', user?.id],
    queryFn: () => apiClient.get<any[]>(`/admin/users/${user?.id}/documents`),
    enabled: isOpen && !!user?.id,
  });

  if (!isOpen || !user) return null;

  const renderBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'REJECTED') {
      return (
        <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium text-xs">
          Declined / Rejected
        </span>
      );
    }
    if (s === 'APPROVED' || s === 'VERIFIED') {
      return (
        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">
          Verified
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium text-xs">
        Pending Verification
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-navy-900">
              Document History: {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading document history...</div>
          ) : !documents?.length ? (
            <div className="text-center py-8 text-gray-500">No documents found for this user.</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900 uppercase tracking-wide text-sm">
                      {doc.document_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                    </p>
                    {doc.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        Reason: {doc.rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {renderBadge(doc.status)}
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="text-brand-blue text-sm hover:underline font-medium cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
