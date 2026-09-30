import React from 'react';
import { Bid, Load } from '../../types';

interface Props {
  load: Load;
  bids: Bid[];
  onAcceptBid: (bidId: string) => Promise<void>;
  onRejectBid: (bidId: string) => Promise<void>;
}

export const ManageLoadBids: React.FC<Props> = ({ load, bids, onAcceptBid, onRejectBid }) => {
  return (
    <div className="bg-white border rounded shadow p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Review Bids for {load.title}</h2>
      {bids.length === 0 ? (
        <p className="text-gray-500">No bids submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => (
            <div key={bid.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">${bid.amount} {bid.currency}</p>
                <p className="text-sm text-gray-600">Carrier ID: {bid.carrier_id}</p>
                {bid.notes && <p className="text-sm mt-2 italic text-gray-700">"{bid.notes}"</p>}
                <p className="text-sm text-gray-500">Status: {bid.status}</p>
              </div>
              {bid.status === 'PENDING' && (
                <div className="space-x-2 flex">
                  <button onClick={() => onRejectBid(bid.id)} className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Reject</button>
                  <button onClick={() => onAcceptBid(bid.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Accept Bid</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
