import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { apiClient } from '../api/client';
import { Search, Eye, X } from 'lucide-react';
import { DocumentViewerModal } from '../components/common/DocumentViewerModal';

export const UsersDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewDoc, setViewDoc] = useState<{ id: string, name: string } | null>(null);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/admin/users')
  });

  const { data: userDocsData, isLoading: docsLoading } = useQuery({
    queryKey: ['admin-user-docs', selectedUser?.id],
    queryFn: () => apiClient.get(`/admin/users/${selectedUser?.id}/documents`),
    enabled: !!selectedUser
  });

  const users = usersData?.data || [];
  const filteredUsers = users.filter((u: any) => 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Users Directory</h1>

      <Card>
        <div className="flex flex-row items-center justify-between border-b border-gray-100 p-6 pb-4">
          <h2 className="text-lg font-semibold text-navy-900">All Registered Users ({users.length})</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                        <div className="text-gray-500">{user.email}</div>
                        {user.company_name && <div className="text-xs text-gray-400 mt-0.5">{user.company_name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status === 'ACTIVE' ? 'VERIFIED' : user.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-brand-blue hover:text-brand-blue/80 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                        >
                          <Eye size={16} /> View History
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* History Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Document History: {selectedUser.first_name} {selectedUser.last_name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {docsLoading ? (
                <div className="text-center py-8">Loading document history...</div>
              ) : !userDocsData?.data?.length ? (
                <div className="text-center py-8 text-gray-500">No documents found for this user.</div>
              ) : (
                <div className="space-y-4">
                  {userDocsData.data.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{doc.document_type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
                        {doc.rejection_reason && (
                          <p className="text-xs text-red-600 mt-1">Reason: {doc.rejection_reason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={doc.status} />
                        <button
                          onClick={() => setViewDoc({ id: doc.id, name: doc.original_filename })}
                          className="text-brand-blue text-sm hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDoc && (
        <DocumentViewerModal
          isOpen={true}
          documentUrl={`${(import.meta as any).env?.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev'}/api/admin/documents/${viewDoc.id}/view`}
          filename={viewDoc.name}
          onClose={() => setViewDoc(null)}
        />
      )}
    </div>
  );
};
