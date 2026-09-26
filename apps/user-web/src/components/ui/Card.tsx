import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-b border-navy-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return (
    <h3 className={`text-lg font-medium leading-6 text-navy-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-t border-navy-100 bg-navy-50 flex items-center justify-end ${className}`}>
      {children}
    </div>
  );
};
