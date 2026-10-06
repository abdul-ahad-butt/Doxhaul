import { useNavigate } from 'react-router-dom';

interface VerificationAlertBannerProps {
  status: string; // 'PENDING' | 'PENDING_VERIFICATION' | 'REJECTED' | 'VERIFIED' | 'APPROVED'
  rejectionReason?: string | null;
  documentsUploaded?: boolean;
  role?: string;
}

export const VerificationAlertBanner = ({ 
  status, 
  rejectionReason, 
  documentsUploaded, 
  role 
}: VerificationAlertBannerProps) => {
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
            <span>❌</span> Verification Request Declined
          </h3>
          <p className="text-xs text-red-700 mt-1">
            Your submitted document was not approved. Please wait 3 days to re-apply or contact our support team.
          </p>
          {rejectionReason && (
            <p className="text-xs text-red-800 font-semibold mt-1">
              Reason: {rejectionReason}
            </p>
          )}
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

  // If unverified or pending verification
  if (s === 'PENDING' || s === 'PENDING_VERIFICATION' || documentsUploaded === false) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
        <div>
          <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
            <span>⚠️</span> Profile Pending Verification
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            Upload your required compliance documents to activate booking.
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

export default VerificationAlertBanner;
