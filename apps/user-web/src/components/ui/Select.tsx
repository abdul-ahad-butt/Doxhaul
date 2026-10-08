import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, name, options, ...props }, ref) => {
    const selectId = id || (name ? `select-${name}` : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-navy-700 mb-1 cursor-pointer">
            {label}
          </label>
        )}
        <select
          id={selectId}
          name={name}
          aria-label={props['aria-label'] || label}
          ref={ref}
          className={`input-field ${error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : ''} ${className}`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-brand-red">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
