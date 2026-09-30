import React, { useState } from 'react';
import { Load } from '../../types';

interface Props {
  load: Load;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (amount: number, notes: string) => Promise<void>;
}

export const LoadDetailsModal: React.FC<Props> = ({ load, isOpen, onClose, onSubmitBid }) => {
  const [bidAmount, setBidAmount] = useState(load.rate);
  const [notes, setNotes] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{load.title}</h2>
        <div className="mb-4">
          <p><strong>Route:</strong> {load.origin_city}, {load.origin_state} to {load.destination_city}, {load.destination_state}</p>
          <p><strong>Original Rate:</strong> ${load.rate}</p>
          {load.mileage && <p><strong>Mileage:</strong> {load.mileage} mi</p>}
          {load.rate_per_mile && <p><strong>Rate/Mile:</strong> ${load.rate_per_mile.toFixed(2)}/mi</p>}
        </div>

        {isBidding ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Bid Amount ($)</label>
              <input 
                type="number" 
                value={bidAmount} 
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsBidding(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={() => {
                  onSubmitBid(bidAmount, notes);
                  setIsBidding(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Bid
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
            <button onClick={() => setIsBidding(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Submit Bid / Counter-Offer</button>
          </div>
        )}
      </div>
    </div>
  );
};
