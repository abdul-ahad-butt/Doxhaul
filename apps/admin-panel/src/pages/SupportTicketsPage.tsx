import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { apiClient } from '../api/client';
import { LifeBuoy, X, Check, Clock, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SupportTicketsPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth() as any;

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['admin-tickets', filter, statusFilter],
    queryFn: () => apiClient.get(`/admin/tickets?category=${filter}&status=${statusFilter}`)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      apiClient.patch(`/admin/tickets/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    }
  });

  const tickets = (ticketsData as any[]) || [];
  
  const openCount = tickets.filter((t: any) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t: any) => t.status === 'RESOLVED').length;

  const categoryLabels: Record<string, string> = {
    TECHNICAL: 'Technical',
    BILLING: 'Billing',
    DOCUMENT_VERIFICATION: 'Verification',
    PLATFORM_INQUIRY: 'Platform'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">User Issues & Support</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-lg"><LifeBuoy size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-amber/10 text-brand-amber rounded-lg"><Clock size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Open Issues</p>
                <p className="text-2xl font-bold text-gray-900">{openCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg"><Check size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="flex flex-row items-center justify-between border-b border-gray-100 p-6 pb-4">
          <div className="flex gap-2">
            {['ALL', 'TECHNICAL', 'BILLING', 'DOCUMENT_VERIFICATION', 'PLATFORM_INQUIRY'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filter === cat ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : categoryLabels[cat]}
              </button>
            ))}
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading tickets...</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No support tickets found.</td></tr>
                ) : (
                  tickets.map((ticket: any) => (
                    <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{ticket.first_name} {ticket.last_name}</div>
                        <div className="text-gray-500">{ticket.email}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(ticket.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {categoryLabels[ticket.category] || ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-gray-900 whitespace-pre-wrap">{ticket.message}</p>
                        {ticket.screenshot_r2_key && (
                          <button
                            onClick={() => {
                               const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev';
                               setViewImage(`${BASE_URL}/api/tickets/${ticket.id}/view-screenshot`);
                            }}
                            className="mt-2 text-brand-blue text-xs flex items-center gap-1 hover:underline font-medium"
                          >
                            <Eye size={12} /> View Attached Screenshot
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: ticket.id, status: e.target.value })}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer ${
                            ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href={`mailto:${ticket.email}`} className="text-gray-500 hover:text-brand-blue text-sm font-medium">
                          Email User
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {viewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy-900">Attached Screenshot</h2>
              <button onClick={() => setViewImage(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 p-4 flex justify-center items-center">
              <img 
                src={`${viewImage}?token=${token}`} 
                alt="Support Ticket Attachment" 
                crossOrigin="anonymous"
                className="max-w-full max-h-full object-contain rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
