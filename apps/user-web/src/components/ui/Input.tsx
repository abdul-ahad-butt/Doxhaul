import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-navy-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`input-field ${error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-brand-red">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
