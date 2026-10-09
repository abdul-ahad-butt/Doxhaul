import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  // North American Freight Lanes (Priority)
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },

  // Global Freight Hubs & Major Corridors
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },

  // Additional Global Trading Partners
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
];

export interface CountryPhoneInputProps {
  value: string; // Full E.164 number (e.g., "+15551234567") or raw national number
  onChange: (fullNumber: string) => void;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Format national digits based on dial code
 */
function formatNationalNumber(digits: string, dialCode: string): string {
  if (!digits) return '';

  // US/Canada (+1) NANP formatting: (XXX) XXX-XXXX
  if (dialCode === '+1') {
    const clean = digits.slice(0, 10);
    if (clean.length <= 3) {
      return clean.length === 3 ? `(${clean}) ` : `(${clean}`;
    }
    if (clean.length <= 6) {
      return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    }
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
  }

  // General international formatting with readable chunks
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)}`;
}

/**
 * Parse an incoming full value (E.164 or raw) to determine country and national digits
 */
function parseIncomingValue(
  value: string,
  currentCountry: Country
): { matchedCountry: Country; nationalDigits: string } {
  if (!value) {
    return { matchedCountry: currentCountry, nationalDigits: '' };
  }

  const trimmed = value.trim();

  // If value starts with '+'
  if (trimmed.startsWith('+')) {
    // Sort by dial code length descending so +971 is checked before +9, etc.
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (trimmed.startsWith(c.dialCode)) {
        const rawRest = trimmed.slice(c.dialCode.length).replace(/\D/g, '');
        return { matchedCountry: c, nationalDigits: rawRest };
      }
    }
    // If unknown plus prefix, fallback to current country with stripped digits
    return { matchedCountry: currentCountry, nationalDigits: trimmed.replace(/\D/g, '') };
  }

  // If raw numbers without '+' (e.g. "2456785485" or "(245) 678-5485")
  const cleaned = trimmed.replace(/\D/g, '');
  return { matchedCountry: currentCountry, nationalDigits: cleaned };
}

export const CountryPhoneInput = forwardRef<HTMLInputElement, CountryPhoneInputProps>(
  (
    {
      value = '',
      onChange,
      label,
      id,
      name = 'phone',
      required = false,
      disabled = false,
      error,
      className = '',
      placeholder,
      onBlur,
    },
    ref
  ) => {
    // Default country is United States (+1)
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
    const [nationalDigits, setNationalDigits] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const nationalInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => nationalInputRef.current as HTMLInputElement);

    // Sync state when external value changes
    useEffect(() => {
      const { matchedCountry, nationalDigits: parsedDigits } = parseIncomingValue(
        value,
        selectedCountry
      );
      if (matchedCountry.code !== selectedCountry.code) {
        setSelectedCountry(matchedCountry);
      }
      setNationalDigits(parsedDigits);
    }, [value]);

    // Handle clicks outside dropdown to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
          setSearchQuery('');
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);

    // Auto-focus search input when dropdown opens
    useEffect(() => {
      if (isDropdownOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isDropdownOpen]);

    // Filtered countries based on search
    const filteredCountries = useMemo(() => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return COUNTRIES;
      return COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.dialCode.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query)
      );
    }, [searchQuery]);

    // Format current national number
    const formattedDisplay = useMemo(() => {
      return formatNationalNumber(nationalDigits, selectedCountry.dialCode);
    }, [nationalDigits, selectedCountry.dialCode]);

    // Emit E.164 string to parent
    const emitChange = (newDigits: string, country: Country) => {
      setNationalDigits(newDigits);
      if (!newDigits) {
        onChange('');
      } else {
        const fullE164 = `${country.dialCode}${newDigits}`;
        onChange(fullE164);
      }
    };

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      setSearchQuery('');
      emitChange(nationalDigits, country);
      if (nationalInputRef.current) {
        nationalInputRef.current.focus();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      // Detect if user typed/pasted a '+' with country dial code
      if (rawInput.includes('+')) {
        const { matchedCountry, nationalDigits: parsedDigits } = parseIncomingValue(
          rawInput,
          selectedCountry
        );
        setSelectedCountry(matchedCountry);
        emitChange(parsedDigits, matchedCountry);
        return;
      }

      const digitsOnly = rawInput.replace(/\D/g, '');
      const cappedDigits =
        selectedCountry.dialCode === '+1' ? digitsOnly.slice(0, 10) : digitsOnly.slice(0, 15);

      emitChange(cappedDigits, selectedCountry);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };

    const inputId = id || (name ? `input-${name}` : 'phone-input');

    return (
      <div className={`w-full relative ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-navy-700 mb-1 cursor-pointer"
          >
            {label}
            {required && <span className="text-brand-red ml-0.5">*</span>}
          </label>
        )}

        {/* Input Container Wrapper */}
        <div
          className={`flex items-center w-full rounded-md border bg-white transition-all shadow-sm ${
            error
              ? 'border-brand-red ring-1 ring-brand-red focus-within:ring-2 focus-within:ring-brand-red focus-within:border-brand-red'
              : 'border-slate-200 hover:border-slate-300 focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-brand-blue'
          } ${disabled ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}
        >
          {/* Country Selector Button */}
          <button
            type="button"
            id={`${inputId}-country-btn`}
            aria-label={`Select country code, currently ${selectedCountry.name} (${selectedCountry.dialCode})`}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            disabled={disabled}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 rounded-l-md transition-colors text-slate-800 text-sm font-medium focus:outline-none flex-shrink-0 select-none"
          >
            <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="text-xs text-slate-700 font-semibold tracking-tight">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {/* National Phone Number Input */}
          <input
            ref={nationalInputRef}
            type="tel"
            id={inputId}
            name={name}
            value={formattedDisplay}
            onChange={handleInputChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            autoComplete="tel-national"
            placeholder={
              placeholder || (selectedCountry.dialCode === '+1' ? '(555) 123-4567' : '123 456 789')
            }
            className="flex-1 w-full px-3 py-2 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none rounded-r-md disabled:cursor-not-allowed"
          />
        </div>

        {/* Dropdown Floating Popover */}
        {isDropdownOpen && (
          <div
            className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up"
            role="listbox"
            aria-label="Country selection"
          >
            {/* Search Input Box */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Country Option List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 scrollbar-thin">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const isSelected = country.code === selectedCountry.code;
                  return (
                    <button
                      key={`${country.code}-${country.dialCode}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50 ${
                        isSelected ? 'bg-blue-50/70 text-brand-blue font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="text-base leading-none" role="img" aria-label={country.name}>
                          {country.flag}
                        </span>
                        <span className="truncate">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {country.dialCode}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-blue ml-1" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  No countries found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && <p className="mt-1 text-xs text-brand-red font-medium">{error}</p>}
      </div>
    );
  }
);

CountryPhoneInput.displayName = 'CountryPhoneInput';
export default CountryPhoneInput;
