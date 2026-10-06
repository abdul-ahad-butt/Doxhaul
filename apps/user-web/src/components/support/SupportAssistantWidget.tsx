import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Paperclip } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/client';

export const SupportAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { user, profile, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
    email: user?.email || '',
    category: 'DOCUMENT_VERIFICATION',
    message: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  // 1. Hide completely on the public landing page ('/')
  if (location.pathname === '/' || location.pathname === '') {
    return null;
  }

  // 2. Hide on public auth pages ('/login', '/register', '/signup')
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/signup' ||
    location.pathname === '/complete-profile'
  ) {
    return null;
  }

  // 3. Only show when user is logged in
  if (!isAuthenticated && !user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const data = new FormData();
      const userName = formData.name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'User';
      const userEmail = formData.email || user?.email || '';
      
      data.append('name', userName);
      data.append('firstName', userName.split(' ')[0] || '');
      data.append('lastName', userName.split(' ').slice(1).join(' ') || '');
      data.append('email', userEmail);
      data.append('category', formData.category);
      data.append('message', formData.message);
      if (file) {
        data.append('file', file);
      }
      
      await apiClient.post('/tickets', data);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Support ticket submission error:', err);
      setError(err.message || 'Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-brand-blue hover:bg-brand-blueHover text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        title="Need Help? Chat with Admin"
      >
        <MessageSquare size={20} />
        <span className="font-medium text-sm">Need Help? Chat with Admin</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-navy-900 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Doxhaul Support Assistant
          </h3>
          <p className="text-xs text-gray-300 ml-4">We usually respond within 24 hours.</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Ticket submitted!</h4>
            <p className="text-sm text-gray-600">
              Our admin team has received your message and screenshot. We'll be in touch soon.
            </p>
            <button 
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => {
                  setIsSuccess(false);
                  setFormData(prev => ({ ...prev, message: '' }));
                  setFile(null);
                }, 300);
              }}
              className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue px-3 py-2 border bg-white" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue px-3 py-2 border bg-white" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue px-3 py-2 border bg-white"
              >
                <option value="TECHNICAL">🛠️ Technical</option>
                <option value="BILLING">💳 Billing</option>
                <option value="DOCUMENT_VERIFICATION">📄 Document Verification</option>
                <option value="PLATFORM">💡 Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                required 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                rows={3} 
                placeholder="Explain your problem or question..." 
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue px-3 py-2 border bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Attachment (Screenshot)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Paperclip className="w-6 h-6 mb-2 text-gray-500" />
                    <p className="mb-2 text-xs text-gray-500 text-center px-2">
                      <span className="font-semibold">Click to upload</span> screenshot or error image
                    </p>
                    {file && <p className="text-xs text-brand-blue truncate max-w-[200px]">{file.name}</p>}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blueHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const SupportChatWidget = SupportAssistantWidget;
export default SupportAssistantWidget;
