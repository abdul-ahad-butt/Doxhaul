import React, { useState } from 'react';

export const CreateLoad: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    origin_city: '',
    origin_state: '',
    origin_zip: '',
    destination_city: '',
    destination_state: '',
    destination_zip: '',
    rate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Creating load...', formData);
    // In a real implementation, it would POST to /api/loads
    // The backend will automatically calculate the mileage and rate_per_mile based on origin_zip and destination_zip.
    alert('Load Created successfully!');
  };

  return (
    <div className="bg-white border rounded shadow p-6 max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Create New Load</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Origin City</label>
            <input required name="origin_city" value={formData.origin_city} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origin Zip</label>
            <input required name="origin_zip" value={formData.origin_zip} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Destination City</label>
            <input required name="destination_city" value={formData.destination_city} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination Zip</label>
            <input required name="destination_zip" value={formData.destination_zip} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rate ($)</label>
          <input required type="number" name="rate" value={formData.rate} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">
          Post Load
        </button>
      </form>
    </div>
  );
};
