import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  RotateCcw, 
  ArrowUpDown, 
  DollarSign, 
  Calendar, 
  Truck, 
  Box,
  Compass,
  SlidersHorizontal
} from 'lucide-react';

export interface FilterState {
  origin: string;
  deadheadRadius: string;
  destination: string;
  anywhere: boolean;
  equipment: string[];
  loadSize: string;
  pickupDate: string;
  minRate: string;
  minRpm: string;
  sort: string;
}

export const INITIAL_FILTERS: FilterState = {
  origin: '',
  deadheadRadius: '100',
  destination: '',
  anywhere: false,
  equipment: ['ALL'],
  loadSize: 'ALL',
  pickupDate: 'ALL',
  minRate: '',
  minRpm: '',
  sort: 'NEWEST',
};

const EQUIPMENT_OPTIONS = [
  { id: 'ALL', label: 'All Equipment', code: 'ALL' },
  { id: 'DRY_VAN', label: 'Dry Van', code: 'V' },
  { id: 'FLATBED', label: 'Flatbed', code: 'F' },
  { id: 'REEFER', label: 'Reefer', code: 'R' },
  { id: 'STEP_DECK', label: 'Step Deck', code: 'SD' },
  { id: 'POWER_ONLY', label: 'Power Only', code: 'PO' },
  { id: 'BOX_TRUCK', label: 'Box Truck', code: 'SB' },
];

interface DATFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  totalLoadsCount?: number;
}

export const DATFilterBar: React.FC<DATFilterBarProps> = ({
  filters,
  onChange,
  onSearch,
  onReset,
  isLoading = false,
  totalLoadsCount,
}) => {
  const handleToggleEquipment = (eqId: string) => {
    if (eqId === 'ALL') {
      onChange({ ...filters, equipment: ['ALL'] });
      return;
    }

    const withoutAll = filters.equipment.filter((e) => e !== 'ALL');
    let nextEquipment: string[];

    if (withoutAll.includes(eqId)) {
      nextEquipment = withoutAll.filter((e) => e !== eqId);
      if (nextEquipment.length === 0) {
        nextEquipment = ['ALL'];
      }
    } else {
      nextEquipment = [...withoutAll, eqId];
    }

    onChange({ ...filters, equipment: nextEquipment });
  };

  const isEquipActive = (eqId: string) => {
    if (eqId === 'ALL') {
      return filters.equipment.includes('ALL') || filters.equipment.length === 0;
    }
    return filters.equipment.includes(eqId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const activeFilterCount = [
    Boolean(filters.origin.trim()),
    Boolean(filters.destination.trim() && !filters.anywhere),
    filters.anywhere,
    !filters.equipment.includes('ALL') && filters.equipment.length > 0,
    filters.loadSize !== 'ALL',
    filters.pickupDate !== 'ALL',
    Boolean(filters.minRate),
    Boolean(filters.minRpm),
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 transition-all">
      {/* Top Filter Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-navy-900 text-white">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              DAT One Freight Search
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                  {activeFilterCount} active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">Live North American freight dispatch & carrier load board</p>
          </div>
        </div>

        {totalLoadsCount !== undefined && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
            Loads Available: <span className="font-bold text-navy-900">{totalLoadsCount}</span>
          </div>
        )}
      </div>

      {/* Row 1: Origin & Destination Routing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        {/* Origin */}
        <div className="md:col-span-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-blue" /> Origin (City, State, or ZIP)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Chicago, IL or 60601"
              value={filters.origin}
              onChange={(e) => onChange({ ...filters, origin: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Deadhead Radius */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-500" /> D/H Radius
          </label>
          <select
            value={filters.deadheadRadius}
            onChange={(e) => onChange({ ...filters, deadheadRadius: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
          >
            <option value="25">25 mi</option>
            <option value="50">50 mi</option>
            <option value="100">100 mi</option>
            <option value="150">150 mi</option>
            <option value="250">250 mi</option>
          </select>
        </div>

        {/* Destination */}
        <div className="md:col-span-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-purple-600" /> Destination
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={filters.anywhere ? 'Anywhere in North America' : 'e.g. Dallas, TX or 75001'}
              value={filters.destination}
              disabled={filters.anywhere}
              onChange={(e) => onChange({ ...filters, destination: e.target.value })}
              onKeyDown={handleKeyDown}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm transition-all ${
                filters.anywhere
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed italic'
                  : 'border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue'
              }`}
            />
            <Navigation className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Anywhere Checkbox */}
        <div className="md:col-span-2 flex items-center md:justify-center md:pt-6">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors w-full justify-center">
            <input
              type="checkbox"
              checked={filters.anywhere}
              onChange={(e) => onChange({ ...filters, anywhere: e.target.checked })}
              className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">Anywhere</span>
          </label>
        </div>
      </div>

      {/* Row 2: Equipment & Load Specs */}
      <div className="space-y-4 pt-1">
        {/* Equipment Selector Pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-slate-500" /> Equipment Types (Select Multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => {
              const active = isEquipActive(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => handleToggleEquipment(eq.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-navy-900 text-white shadow-sm ring-2 ring-navy-900/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{eq.label}</span>
                  {eq.code !== 'ALL' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {eq.code}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specs: Load Size, Pickup Date, Min Rate, Min RPM */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Load Size */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <Box className="w-3.5 h-3.5 text-slate-500" /> Load Size
            </label>
            <select
              value={filters.loadSize}
              onChange={(e) => onChange({ ...filters, loadSize: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
            >
              <option value="ALL">All Sizes</option>
              <option value="FTL">Full (FTL)</option>
              <option value="LTL">Partial (LTL)</option>
            </select>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Pickup Date
            </label>
            <select
              value={filters.pickupDate}
              onChange={(e) => onChange({ ...filters, pickupDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="TOMORROW">Tomorrow</option>
              <option value="NEXT_3_DAYS">Next 3 Days</option>
              <option value="NEXT_7_DAYS">Next 7 Days</option>
            </select>
          </div>

          {/* Min Rate ($) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Min Rate ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="0"
                value={filters.minRate}
                onChange={(e) => onChange({ ...filters, minRate: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-mono transition-all"
              />
            </div>
          </div>

          {/* Min Rate Per Mile ($/mi) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Min $/Mile
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="0.25"
                placeholder="0.00"
                value={filters.minRpm}
                onChange={(e) => onChange({ ...filters, minRpm: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-mono transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Actions & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" /> Sort By:
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="HIGHEST_RATE">Highest Rate ($)</option>
            <option value="RPM">Rate per Mile ($/mi)</option>
            <option value="EARLIEST_PICKUP">Earliest Pickup</option>
            <option value="DEADHEAD">Deadhead Distance</option>
          </select>
        </div>

        {/* Buttons: Reset & Search Loads */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Filters
          </button>

          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            {isLoading ? 'Searching...' : 'Search Loads'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DATFilterBar;
