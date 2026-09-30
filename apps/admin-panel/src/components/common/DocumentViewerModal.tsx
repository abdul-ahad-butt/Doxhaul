import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType?: string; // 'application/pdf', 'image/jpeg', etc.
  filename?: string;
}

export const DocumentViewerModal = ({
  isOpen,
  onClose,
  documentUrl,
  documentType = 'image/jpeg', // Default to image if unknown
  filename = 'Document',
}: DocumentViewerModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setZoom(1);
    setRotation(0);
  }, [documentUrl]);

  if (!isOpen) return null;

  const isPdf = documentType?.toLowerCase().includes('pdf') || filename?.toLowerCase().endsWith('.pdf');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-navy-900 truncate max-w-md">{filename}</h3>
          <div className="flex items-center gap-3">
            {!isPdf && !hasError && (
              <>
                <button onClick={handleZoomOut} className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-md transition-colors" title="Zoom Out">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button onClick={handleZoomIn} className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-md transition-colors" title="Zoom In">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={handleRotate} className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-md transition-colors" title="Rotate">
                  <RotateCw className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
              </>
            )}
            
            <a 
              href={documentUrl} 
              download={filename}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors ml-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-100 relative flex items-center justify-center p-4">
          {isPdf ? (
            <iframe 
              src={`${documentUrl}#toolbar=0`} 
              className="w-full h-full rounded shadow-sm bg-white"
              title="PDF Document Viewer"
            />
          ) : hasError ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm max-w-md border border-gray-200">
              <p className="font-semibold text-gray-700 text-base">Unable to load document image.</p>
              <p className="text-xs text-gray-500 mt-2">File key may be missing from R2 bucket. Please ask user to re-upload.</p>
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
              <img 
                src={documentUrl} 
                alt={filename || "Document Preview"} 
                onError={(e) => {
                  console.error("Image load error:", e);
                  setHasError(true);
                }}
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out shadow-sm bg-white"
                style={{ 
                  transform: `scale(${zoom}) rotate(${rotation}deg)` 
                }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
