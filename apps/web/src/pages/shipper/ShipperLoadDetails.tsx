import React, { useState } from 'react';
import { Load } from '../../types';

interface Props {
  load: Load;
  podDocumentUrl?: string; // Signed URL to view the POD
}

export const ShipperLoadDetails: React.FC<Props> = ({ load, podDocumentUrl }) => {
  const [isViewingPOD, setIsViewingPOD] = useState(false);

  return (
    <div className="bg-white border rounded shadow p-6 mt-4">
      <h1 className="text-2xl font-bold mb-2">{load.title}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold text-lg">{load.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rate</p>
          <p className="font-semibold text-lg">${load.rate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Mileage</p>
          <p className="font-medium">{load.mileage ? `${load.mileage} mi` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rate/Mile</p>
          <p className="font-medium">{load.rate_per_mile ? `$${load.rate_per_mile.toFixed(2)}/mi` : 'N/A'}</p>
        </div>
      </div>

      {load.status === 'DELIVERED' && load.pod_document_id && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Delivery Documentation</h3>
          <button 
            onClick={() => setIsViewingPOD(true)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            View Signed Bill of Lading (POD)
          </button>
        </div>
      )}

      {isViewingPOD && podDocumentUrl && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Proof of Delivery</h2>
              <button onClick={() => setIsViewingPOD(false)} className="text-gray-500 hover:text-black">Close</button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {/* If it's a PDF, we might use an iframe or react-pdf, if image, just img tag */}
              <iframe src={podDocumentUrl} className="w-full h-full border-0" title="POD Viewer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
