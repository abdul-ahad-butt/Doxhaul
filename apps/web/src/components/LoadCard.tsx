import React from 'react';
import { Load } from '../types';

interface Props {
  load: Load;
  onClick?: () => void;
}

export const LoadCard: React.FC<Props> = ({ load, onClick }) => {
  return (
    <div 
      className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{load.title}</h3>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">${load.rate}</p>
          {load.rate_per_mile && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 font-semibold">
              ${load.rate_per_mile.toFixed(2)}/mi
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <p>📍 {load.origin_city}, {load.origin_state} &rarr; {load.destination_city}, {load.destination_state}</p>
          <p>🗓️ Pick up: {load.pickup_date}</p>
        </div>
        <div className="text-right">
          {load.mileage && <p>🛣️ {load.mileage} miles</p>}
          <p>🚛 {load.equipment_type}</p>
        </div>
      </div>
    </div>
  );
};
