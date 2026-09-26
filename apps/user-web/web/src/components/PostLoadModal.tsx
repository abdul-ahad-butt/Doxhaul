import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '../api/client';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { X } from 'lucide-react';

interface PostLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostLoadModal: React.FC<PostLoadModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    pickupDate: '',
    deliveryDate: '',
    equipmentType: 'DRY_VAN',
    weight: '',
    rate: '',
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/loads', {
        ...formData,
        weight: Number(formData.weight),
        rate: Number(formData.rate),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      onClose();
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Failed to post load.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-navy-100">
          <h2 className="text-xl font-bold text-navy-900">Post New Load</h2>
          <button onClick={onClose} className="text-navy-500 hover:text-navy-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <Input label="Title" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Pallets of Water" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Origin City" name="originCity" required value={formData.originCity} onChange={handleChange} />
            <Input label="Origin State" name="originState" required value={formData.originState} onChange={handleChange} placeholder="TX" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Destination City" name="destinationCity" required value={formData.destinationCity} onChange={handleChange} />
            <Input label="Destination State" name="destinationState" required value={formData.destinationState} onChange={handleChange} placeholder="CA" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pickup Date" name="pickupDate" type="date" required value={formData.pickupDate} onChange={handleChange} />
            <Input label="Delivery Date" name="deliveryDate" type="date" required value={formData.deliveryDate} onChange={handleChange} />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Select 
              label="Equipment" 
              name="equipmentType" 
              value={formData.equipmentType} 
              onChange={handleChange}
              options={[
                { value: 'DRY_VAN', label: 'Dry Van' },
                { value: 'REEFER', label: 'Reefer' },
                { value: 'FLATBED', label: 'Flatbed' }
              ]}
            />
            <Input label="Weight (lbs)" name="weight" type="number" required value={formData.weight} onChange={handleChange} />
            <Input label="Rate ($)" name="rate" type="number" required value={formData.rate} onChange={handleChange} />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-navy-100">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={mutation.isPending}>Post Load</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
