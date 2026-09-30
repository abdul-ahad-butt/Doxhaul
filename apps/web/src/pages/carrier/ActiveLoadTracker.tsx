import React, { useState } from 'react';
import { Load } from '../../types';

interface Props {
  load: Load;
  onMarkDelivered: (podFile: File) => Promise<void>;
}

export const ActiveLoadTracker: React.FC<Props> = ({ load, onMarkDelivered }) => {
  const [isUploadingPOD, setIsUploadingPOD] = useState(false);
  const [podFile, setPodFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPodFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null); // PDF or other
      }
    }
  };

  const handleSubmit = async () => {
    if (podFile) {
      await onMarkDelivered(podFile);
      setIsUploadingPOD(false);
    }
  };

  return (
    <div className="bg-white border rounded shadow p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Active Trip: {load.title}</h2>
      <p className="mb-4">Current Status: <span className="font-semibold text-blue-600">{load.status}</span></p>

      {load.status === 'IN_TRANSIT' && (
        <button 
          onClick={() => setIsUploadingPOD(true)} 
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Mark Delivered (Upload POD)
        </button>
      )}

      {isUploadingPOD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Upload Proof of Delivery (POD)</h3>
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              capture="environment"
              onChange={handleFileChange}
              className="mb-4 w-full"
            />
            {previewUrl && (
              <img src={previewUrl} alt="POD Preview" className="mb-4 w-full h-48 object-cover rounded" />
            )}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsUploadingPOD(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={handleSubmit} 
                disabled={!podFile}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Submit POD & Mark Delivered
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
