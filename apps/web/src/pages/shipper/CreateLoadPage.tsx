import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackagePlus, 
  MapPin, 
  Calendar, 
  Truck, 
  DollarSign, 
  Weight, 
  FileText, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { Card, CardContent } from '../../components/ui/Card';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
  'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

export const CreateLoadPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    commodity: 'General Merchandise',
    originCity: '',
    originState: 'IL',
    originZip: '',
    destinationCity: '',
    destinationState: 'TX',
    destinationZip: '',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    equipmentType: 'DRY_VAN' as 'DRY_VAN' | 'REEFER' | 'FLATBED' | 'STEP_DECK' | 'BOX_TRUCK' | 'TANKER' | 'LOWBOY' | 'OTHER',
    weight: '38000',
    rate: '2400',
    specialInstructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Please enter a load title or reference description.');
      }
      if (!formData.originCity || !formData.destinationCity) {
        throw new Error('Both Origin City and Destination City are required.');
      }
      const weightNum = parseFloat(formData.weight);
      const rateNum = parseFloat(formData.rate);

      if (isNaN(weightNum) || weightNum <= 0) {
        throw new Error('Please enter a valid positive weight in lbs.');
      }
      if (isNaN(rateNum) || rateNum <= 0) {
        throw new Error('Please enter a valid target rate in USD.');
      }

      const payload = {
        title: formData.title.trim(),
        commodity: formData.commodity.trim(),
        originCity: formData.originCity.trim(),
        originState: formData.originState,
        originZip: formData.originZip.trim() || undefined,
        originCountry: 'US',
        destinationCity: formData.destinationCity.trim(),
        destinationState: formData.destinationState,
        destinationZip: formData.destinationZip.trim() || undefined,
        destinationCountry: 'US',
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        equipmentType: formData.equipmentType,
        weight: weightNum,
        weightUnit: 'LBS',
        rate: rateNum,
        currency: 'USD',
        rateType: 'FLAT',
        specialInstructions: formData.specialInstructions.trim() || undefined,
      };

      await apiClient.post('/loads', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-loads');
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to post load. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg border border-navy-200 bg-white hover:bg-navy-50 text-navy-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
              <PackagePlus className="w-7 h-7 text-brand-blue" />
              Post a New Freight Load
            </h1>
            <p className="text-sm text-navy-500">
              Broadcast your freight shipment to certified carriers across the platform.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-semibold">Unable to submit load</p>
            <p className="text-xs mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">Load successfully broadcasted!</p>
            <p className="text-xs text-emerald-700 mt-0.5">Redirecting to My Shipments tracking table...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Load Info */}
        <Card>
          <div className="px-6 py-4 border-b border-navy-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-semibold text-navy-900">Load Details & Commodity</h2>
          </div>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
                Load Title / Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 53' Dry Van Palletized Goods - Chicago to Dallas"
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
                Commodity Type
              </label>
              <input
                type="text"
                name="commodity"
                value={formData.commodity}
                onChange={handleChange}
                placeholder="e.g. Packaged Consumer Goods, Electronics, Auto Parts"
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
                Equipment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="equipmentType"
                value={formData.equipmentType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="DRY_VAN">Dry Van (53ft)</option>
                <option value="REEFER">Refrigerated (Reefer)</option>
                <option value="FLATBED">Flatbed</option>
                <option value="STEP_DECK">Step Deck</option>
                <option value="BOX_TRUCK">Box Truck</option>
                <option value="TANKER">Tanker</option>
                <option value="LOWBOY">Lowboy</option>
                <option value="OTHER">Other / Specialized</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Route / Origin & Destination */}
        <Card>
          <div className="px-6 py-4 border-b border-navy-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-semibold text-navy-900">Routing & Schedule</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Origin */}
            <div className="p-4 bg-navy-50/50 rounded-xl border border-navy-100">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-3">
                📍 Origin (Pickup Point)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="originCity"
                    required
                    value={formData.originCity}
                    onChange={handleChange}
                    placeholder="e.g. Chicago"
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">State *</label>
                  <select
                    name="originState"
                    value={formData.originState}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {US_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="originZip"
                    value={formData.originZip}
                    onChange={handleChange}
                    placeholder="e.g. 60601"
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-navy-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-navy-400" /> Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  required
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full md:w-64 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="p-4 bg-navy-50/50 rounded-xl border border-navy-100">
              <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-3">
                🏁 Destination (Delivery Point)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="destinationCity"
                    required
                    value={formData.destinationCity}
                    onChange={handleChange}
                    placeholder="e.g. Dallas"
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">State *</label>
                  <select
                    name="destinationState"
                    value={formData.destinationState}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {US_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="destinationZip"
                    value={formData.destinationZip}
                    onChange={handleChange}
                    placeholder="e.g. 75201"
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-navy-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-navy-400" /> Delivery Date *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full md:w-64 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Specifications */}
        <Card>
          <div className="px-6 py-4 border-b border-navy-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-semibold text-navy-900">Weight & Freight Rate</h2>
          </div>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Weight className="w-4 h-4 text-navy-500" /> Weight (lbs) *
              </label>
              <input
                type="number"
                name="weight"
                required
                min="100"
                max="80000"
                value={formData.weight}
                onChange={handleChange}
                placeholder="38000"
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-navy-400 mt-1 block">Maximum legal gross 45,000 lbs for standard Dry Van</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Target Rate (USD Flat) *
              </label>
              <input
                type="number"
                name="rate"
                required
                min="50"
                value={formData.rate}
                onChange={handleChange}
                placeholder="2400"
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-navy-400 mt-1 block">Fixed flat payout offered to booking carriers</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
                Special Handling / Driver Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                rows={3}
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="e.g. Liftgate required at delivery. Driver must call shipper 2 hours prior to arrival. Dock 4."
                className="w-full px-3.5 py-2.5 bg-white border border-navy-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blueHover disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Broadcasting Load...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                Broadcast Load to Marketplace
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoadPage;
