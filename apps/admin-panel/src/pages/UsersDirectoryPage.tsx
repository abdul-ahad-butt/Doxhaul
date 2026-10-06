import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { apiClient } from '../api/client';
import { Search, Eye } from 'lucide-react';
import { DocumentHistoryModal } from '../components/modals/DocumentHistoryModal';
import { DocumentViewerModal } from '../components/common/DocumentViewerModal';

export const UsersDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewDoc, setViewDoc] = useState<{ id: string, name: string, mimeType?: string } | null>(null);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/admin/users')
  });

  const users = (usersData as any[]) || [];
  const filteredUsers = users.filter((u: any) => 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
  const apiBase = ((import.meta as any).env?.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev/api').replace(/\/$/, '');
  const prefix = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

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
              className="pl-9 pr-4 py-2 w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue border bg-white"
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
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                        {user.company_name && <div className="text-xs text-gray-400 mt-0.5">{user.company_name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-brand-blue hover:text-brand-blue/80 font-medium text-sm flex items-center justify-end gap-1 ml-auto cursor-pointer"
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
      <DocumentHistoryModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onViewDocument={(doc) => setViewDoc({ 
          id: doc.id, 
          name: doc.file_name || doc.original_filename || 'Document', 
          mimeType: doc.mime_type 
        })}
      />

      {viewDoc && (
        <DocumentViewerModal
          isOpen={true}
          documentUrl={`${prefix}/documents/${viewDoc.id}/view?token=${token}`}
          documentType={viewDoc.mimeType}
          filename={viewDoc.name}
          onClose={() => setViewDoc(null)}
        />
      )}
    </div>
  );
};

export default UsersDirectoryPage;
