import { useNavigate } from 'react-router-dom';

interface VerificationAlertBannerProps {
  status: string; // 'PENDING' | 'PENDING_VERIFICATION' | 'REJECTED' | 'VERIFIED' | 'APPROVED'
  documentsUploaded?: boolean;
  role?: string;
}

export const VerificationAlertBanner = ({ status, documentsUploaded, role }: VerificationAlertBannerProps) => {
  const navigate = useNavigate();
  const s = (status || '').toUpperCase();

  // Admin users don't need compliance verification banner
  if (role === 'ADMIN') {
    return null;
  }

  // If rejected by admin
  if (s === 'REJECTED') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
        <div>
          <h3 className="text-sm font-bold text-red-800 flex items-center gap-1.5">
            <span>❌</span> Verification Request Rejected
          </h3>
          <p className="text-xs text-red-700 mt-1">
            Your submitted compliance documents were rejected by the admin. Please wait 3 days to re-apply or contact our support team.
          </p>
        </div>
        <button 
          onClick={() => navigate('/profile')} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
        >
          View Details & Re-apply
        </button>
      </div>
    );
  }

  // If already verified or approved, do not show any alert banner
  if (s === 'VERIFIED' || s === 'APPROVED') {
    return null;
  }

  // If unverified, pending verification, or documents not uploaded
  if (s === 'PENDING' || s === 'PENDING_VERIFICATION' || documentsUploaded === false) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
        <div>
          <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
            <span>⚠️</span> Account Verification Required
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            Your account is not verified yet. Please upload your driver's license and compliance documents to unlock load posting and booking.
          </p>
        </div>
        <button 
          onClick={() => navigate('/profile')} 
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
        >
          Upload Documents
        </button>
      </div>
    );
  }

  return null;
};
