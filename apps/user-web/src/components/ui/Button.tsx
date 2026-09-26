import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'outline-white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 ease-out hover:scale-[1.03] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none';
    
    const variants = {
      primary: 'bg-brand-blue text-white hover:bg-brand-blueHover focus:ring-brand-blue',
      secondary: 'bg-white text-navy-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200',
      danger: 'bg-brand-red text-white hover:bg-brand-red/90 focus:ring-brand-red',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-navy-900 focus:ring-slate-200',
      outline: 'bg-transparent text-navy-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200',
      'outline-white': 'bg-transparent text-white border border-white/30 hover:bg-white/10 focus:ring-white',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
