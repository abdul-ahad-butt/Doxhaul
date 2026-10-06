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

  const users: any[] = Array.isArray(usersData) 
    ? usersData 
    : ((usersData as any)?.users || (usersData as any)?.data || []);

  const filteredUsers = users.filter((u: any) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.email || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.first_name || '').toLowerCase().includes(q) ||
      (u.last_name || '').toLowerCase().includes(q) ||
      (u.company_name || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const getRoleBadge = (role: string) => {
    const r = (role || '').toUpperCase();
    switch (r) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">ADMIN</span>;
      case 'CARRIER':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">CARRIER</span>;
      case 'SHIPPER':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">SHIPPER</span>;
      case 'BROKER':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">BROKER</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">{role}</span>;
    }
  };

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
                  filteredUsers.map((user: any) => {
                    const displayName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                    const initial = (displayName || user.email || 'U')[0].toUpperCase();
                    const joinedFormatted = user.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : 'N/A';

                    return (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{displayName}</div>
                              <div className="text-gray-500 text-xs">{user.email}</div>
                              {user.company_name && <div className="text-xs text-slate-400 mt-0.5">{user.company_name}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                          {joinedFormatted}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="text-brand-blue hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye size={16} /> View History
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
