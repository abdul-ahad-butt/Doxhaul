import React from 'react';

export interface DoxhaulLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * - 'full': Full horizontal logo with blue gradient 'D' icon, dark navy "Doxhaul" wordmark, and "SMARTER FREIGHT. STRONGER TOGETHER." tagline (light backgrounds, Auth/Register page).
   * - 'white': Horizontal logo with blue gradient 'D' icon and high-contrast white "Doxhaul" wordmark (no tagline, dark backgrounds, Navbar & Footer).
   * - 'dark': Horizontal logo with blue gradient 'D' icon and dark navy "Doxhaul" wordmark (no tagline, light sidebars).
   * - 'icon': Blue gradient 'D' arrow-truck icon mark only.
   */
  variant?: 'full' | 'white' | 'dark' | 'icon';
  /**
   * Optional custom height in pixels or CSS units.
   */
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
        return 'h-10'; // ~40px
      case 'white':
      case 'dark':
        return 'h-7'; // ~28px
      case 'icon':
        return 'h-8'; // ~32px
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
