import React from 'react';

export interface DoxhaulLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'full' | 'white' | 'dark' | 'icon';
  height?: number | string;
}

export const DoxhaulLogo: React.FC<DoxhaulLogoProps> = ({
  variant = 'full',
  height,
  className = '',
  alt = 'Doxhaul',
  style,
  ...props
}) => {
  const getSrc = () => {
    switch (variant) {
      case 'white':
        return '/doxhaul-logo-white.png';
      case 'dark':
        return '/doxhaul-logo-dark.png';
      case 'icon':
        return '/doxhaul-icon.png';
      case 'full':
      default:
        return '/doxhaul-logo.png';
    }
  };

  const defaultHeightClass = () => {
    switch (variant) {
      case 'full':
        return 'h-10';
      case 'white':
      case 'dark':
        return 'h-7';
      case 'icon':
        return 'h-8';
    }
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {})
  };

  return (
    <img
      src={getSrc()}
      alt={alt}
      className={`w-auto object-contain transition-opacity duration-200 ${!height ? defaultHeightClass() : ''} ${className}`}
      style={computedStyle}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
};

export default DoxhaulLogo;
