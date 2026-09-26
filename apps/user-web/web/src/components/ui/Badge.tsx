import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-navy-100 text-navy-800',
    success: 'bg-brand-green/10 text-brand-green',
    warning: 'bg-brand-amber/10 text-brand-amber',
    danger: 'bg-brand-red/10 text-brand-red',
    info: 'bg-brand-blue/10 text-brand-blue',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  let variant: BadgeProps['variant'] = 'default';
  let label = status;

  switch (status) {
    case 'OPEN':
      variant = 'success';
      break;
    case 'ASSIGNED':
      variant = 'info';
      break;
    case 'HEADING_TO_PICKUP':
      variant = 'warning';
      label = 'Heading to Pickup';
      break;
    case 'PICKED_UP':
      variant = 'info';
      label = 'Picked Up';
      break;
    case 'IN_TRANSIT':
      variant = 'info';
      label = 'In Transit';
      break;
    case 'DELIVERED':
      variant = 'success';
      break;
    case 'CANCELLED':
      variant = 'danger';
      break;
    case 'PENDING_VERIFICATION':
    case 'PENDING':
      variant = 'warning';
      label = 'Pending Verification';
      break;
    case 'VERIFIED':
    case 'ACTIVE':
    case 'APPROVED':
    case 'COMPLETED':
      variant = 'success';
      break;
    case 'REJECTED':
    case 'SUSPENDED':
    case 'BANNED':
      variant = 'danger';
      break;
  }

  return <Badge variant={variant}>{label}</Badge>;
};
