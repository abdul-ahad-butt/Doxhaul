import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-navy-100 text-navy-800',
    success: 'bg-green-100 text-green-700 font-medium',
    warning: 'bg-yellow-100 text-yellow-700 font-medium',
    danger: 'bg-red-100 text-red-700 font-medium',
    info: 'bg-brand-blue/10 text-brand-blue font-medium',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const s = (status || '').toUpperCase();

  if (s === 'REJECTED' || s === 'SUSPENDED' || s === 'BANNED') {
    return <Badge variant="danger">Declined / Rejected</Badge>;
  }

  if (s === 'VERIFIED' || s === 'APPROVED' || s === 'ACTIVE' || s === 'COMPLETED') {
    return <Badge variant="success">Verified</Badge>;
  }

  if (s === 'PENDING' || s === 'PENDING_VERIFICATION') {
    return <Badge variant="warning">Pending Verification</Badge>;
  }

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
  }

  return <Badge variant={variant}>{label}</Badge>;
};
