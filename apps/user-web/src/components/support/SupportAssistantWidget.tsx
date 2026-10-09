import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Paperclip, 
  Bot, 
  LifeBuoy, 
  CheckCircle2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const SupportAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'ticket'>('ai');

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your Doxhaul AI Logistics Assistant. Ask me anything about document verification, load posting, carrier compliance, or switch tabs to submit a ticket to our human admin team.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Ticket submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [ticketError, setTicketError] = useState('');

  const { user, profile, isAuthenticated } = useAuth();
  const location = useLocation();

  const [ticketData, setTicketData] = useState({
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
    email: user?.email || '',
    category: 'DOCUMENT_VERIFICATION',
    message: '',
  });

  // Update autofill when profile loads
  useEffect(() => {
    if (profile || user) {
      setTicketData(prev => ({
        ...prev,
        name: prev.name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || '',
        email: prev.email || user?.email || ''
      }));
    }
  }, [profile, user]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiLoading, activeTab]);

  // 1. Hide on public landing page
  if (location.pathname === '/' || location.pathname === '') {
    return null;
  }

  // 2. Hide on public auth pages
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

  const handleSendAiMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await apiClient.post<{ reply: string }>('/support/ai-chat', {
        message: text,
        role: user?.role || 'CARRIER'
      });

      const aiReply = (res as any)?.data?.reply || res?.reply || "I've logged your question. Our compliance and dispatch team will assist shortly. You can also submit a direct ticket from Tab 2!";
      
      setChatMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: "Automated scan: Compliance documents take 1-24 hours for review. If your license was declined, ensure it is clear, valid, and matches your profile name. Switch to the 'Submit Ticket' tab to connect with our admin team with screenshots.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTicketError('');

    try {
      const data = new FormData();
      const userName = ticketData.name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'User';
      const userEmail = ticketData.email || user?.email || '';

      data.append('name', userName);
      data.append('firstName', userName.split(' ')[0] || '');
      data.append('lastName', userName.split(' ').slice(1).join(' ') || '');
      data.append('email', userEmail);
      data.append('category', ticketData.category);
      data.append('message', ticketData.message);
      if (file) {
        data.append('file', file);
      }

      await apiClient.post('/tickets', data);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Support ticket submission error:', err);
      setTicketError(err.message || 'Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickQuestions = [
    "Why is my driver's license pending?",
    "How do I submit a new load?",
    "What documents are required for carriers?",
    "How does automated invoice payment work?"
  ];

  if (!isOpen) {
    return (
      <button
        id="contact-support-btn"
        name="contactSupport"
        aria-label="Contact Support Team"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-brand-blue hover:bg-brand-blueHover text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 group border border-white/20"
        title="Contact Support Team"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <MessageSquare size={19} className="group-hover:rotate-6 transition-transform" />
        <span className="font-semibold text-sm tracking-wide">Contact Support Team</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-88 sm:w-96 bg-white rounded-2xl shadow-2xl border border-navy-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-navy-900 p-4 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/40">
            <Bot className="w-4 h-4 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              Doxhaul Support & AI Assistant
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online • Instant AI & Human Help</span>
            </div>
          </div>
        </div>
        <button 
          id="support-close-btn"
          name="closeSupport"
          aria-label="Close Support Assistant"
          onClick={() => setIsOpen(false)} 
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-semibold">
        <button
          id="support-tab-ai"
          name="supportTabAi"
          aria-label="Ask AI Logistics Assistant"
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'ai' 
              ? 'bg-white text-brand-blue border-b-2 border-brand-blue font-bold shadow-xs' 
              : 'text-gray-500 hover:text-navy-900'
          }`}
        >
          <Sparkles size={14} className={activeTab === 'ai' ? 'text-brand-blue' : 'text-gray-400'} />
          Ask AI Assistant
        </button>
        <button
          id="support-tab-ticket"
          name="supportTabTicket"
          aria-label="Submit Ticket to Human Team"
          onClick={() => setActiveTab('ticket')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'ticket' 
              ? 'bg-white text-brand-blue border-b-2 border-brand-blue font-bold shadow-xs' 
              : 'text-gray-500 hover:text-navy-900'
          }`}
        >
          <LifeBuoy size={14} className={activeTab === 'ticket' ? 'text-brand-blue' : 'text-gray-400'} />
          Submit Ticket to Team
        </button>
      </div>

      {/* Tab 1: AI Assistant Chat */}
      {activeTab === 'ai' && (
        <div className="flex flex-col h-[400px] bg-slate-50">
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2 text-xs flex items-center gap-2 shadow-xs">
                  <Loader2 size={13} className="animate-spin text-brand-blue" />
                  <span className="text-slate-500">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`support-quick-${idx}`}
                name={`supportQuickQuestion${idx}`}
                aria-label={`Ask: ${q}`}
                onClick={() => handleSendAiMessage(q)}
                className="whitespace-nowrap text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors border border-slate-200"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} 
            className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center"
          >
            <label htmlFor="support-chat-input" className="sr-only">Ask anything about Doxhaul</label>
            <input
              id="support-chat-input"
              name="supportChatInput"
              aria-label="Ask anything about Doxhaul"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about Doxhaul..."
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-blue bg-slate-50"
              disabled={isAiLoading}
            />
            <button
              id="support-chat-submit"
              name="sendSupportMessage"
              aria-label="Send support question"
              type="submit"
              disabled={!chatInput.trim() || isAiLoading}
              className="bg-brand-blue hover:bg-brand-blueHover disabled:opacity-40 text-white p-2 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Submit Ticket to Human Team */}
      {activeTab === 'ticket' && (
        <div className="p-4 max-h-[400px] overflow-y-auto bg-gray-50">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Ticket Submitted Successfully!</h4>
              <p className="text-xs text-gray-600 leading-relaxed px-2">
                Our support desk has received your ticket and screenshot. We review tickets under <strong>User Issues</strong> in the admin panel and respond promptly.
              </p>
              <button 
                id="support-ticket-close-success"
                name="closeSuccessDialog"
                aria-label="Close Window"
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    setIsSuccess(false);
                    setTicketData(prev => ({ ...prev, message: '' }));
                    setFile(null);
                  }, 300);
                }}
                className="mt-5 w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              {ticketError && (
                <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-xs border border-red-200">
                  {ticketError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="support-ticket-name" className="block font-medium text-gray-700 mb-1 cursor-pointer">Your Name</label>
                  <input 
                    id="support-ticket-name"
                    name="ticketName"
                    aria-label="Your Name"
                    required 
                    type="text" 
                    value={ticketData.name} 
                    onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })} 
                    className="w-full border-gray-300 rounded-lg px-2.5 py-1.5 border bg-white focus:ring-1 focus:ring-brand-blue" 
                  />
                </div>
                <div>
                  <label htmlFor="support-ticket-email" className="block font-medium text-gray-700 mb-1 cursor-pointer">Email</label>
                  <input 
                    id="support-ticket-email"
                    name="ticketEmail"
                    aria-label="Your Email"
                    required 
                    type="email" 
                    value={ticketData.email} 
                    onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })} 
                    className="w-full border-gray-300 rounded-lg px-2.5 py-1.5 border bg-white focus:ring-1 focus:ring-brand-blue" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="support-ticket-category" className="block font-medium text-gray-700 mb-1 cursor-pointer">Category</label>
                <select 
                  id="support-ticket-category"
                  name="ticketCategory"
                  aria-label="Ticket Category"
                  value={ticketData.category} 
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })} 
                  className="w-full border-gray-300 rounded-lg px-2.5 py-1.5 border bg-white focus:ring-1 focus:ring-brand-blue cursor-pointer"
                >
                  <option value="DOCUMENT_VERIFICATION">📄 Document Verification Problem</option>
                  <option value="TECHNICAL">🛠️ Technical Issue</option>
                  <option value="BILLING">💳 Billing Issue</option>
                  <option value="PLATFORM">💡 General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="support-ticket-message" className="block font-medium text-gray-700 mb-1 cursor-pointer">Description</label>
                <textarea 
                  id="support-ticket-message"
                  name="ticketMessage"
                  aria-label="Ticket Description"
                  required 
                  rows={3}
                  value={ticketData.message} 
                  onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })} 
                  placeholder="Explain your problem or question in detail..." 
                  className="w-full border-gray-300 rounded-lg px-2.5 py-1.5 border bg-white focus:ring-1 focus:ring-brand-blue resize-none"
                ></textarea>
              </div>

              <div>
                <label htmlFor="support-ticket-file" className="block font-medium text-gray-700 mb-1 cursor-pointer">Screenshot / Error Image</label>
                <label htmlFor="support-ticket-file" className="flex flex-col items-center justify-center w-full h-18 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors p-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Paperclip size={14} />
                    <span className="text-[11px] truncate">{file ? file.name : "Attach screenshot file"}</span>
                  </div>
                  <input 
                    id="support-ticket-file"
                    name="ticketFile"
                    aria-label="Attach screenshot file"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }} 
                  />
                </label>
              </div>

              <button 
                id="support-ticket-submit"
                name="submitTicket"
                aria-label="Submit Support Ticket"
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2 px-3 rounded-lg text-white font-semibold bg-brand-blue hover:bg-brand-blueHover disabled:opacity-50 cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={13} /> Submit Support Ticket
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export const SupportChatWidget = SupportAssistantWidget;
export default SupportAssistantWidget;
