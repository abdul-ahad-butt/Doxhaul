import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PricingModalContextType {
  isOpen: boolean;
  openPricing: (role?: string) => void;
  closePricing: (navigateUrl?: string) => void;
  selectedRole: string | null;
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(undefined);

export const PricingModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Listen for ?pricing=true or ?pricing=carrier/shipper/broker in URL query
  useEffect(() => {
    const pricingParam = searchParams.get('pricing');
    if (pricingParam !== null) {
      setIsOpen(true);
      if (pricingParam && pricingParam !== 'true') {
        setSelectedRole(pricingParam.toUpperCase());
      }
    }
  }, [searchParams]);

  const openPricing = (role?: string) => {
    if (role) {
      setSelectedRole(role.toUpperCase());
    }
    setIsOpen(true);
  };

  const closePricing = (navigateUrl?: string) => {
    setIsOpen(false);
    setSelectedRole(null);
    if (!navigateUrl && searchParams.has('pricing')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('pricing');
      setSearchParams(newParams, { replace: true });
    }
  };

  return (
    <PricingModalContext.Provider value={{ isOpen, openPricing, closePricing, selectedRole }}>
      {children}
    </PricingModalContext.Provider>
  );
};

export const usePricingModal = () => {
  const context = useContext(PricingModalContext);
  if (!context) {
    throw new Error('usePricingModal must be used within a PricingModalProvider');
  }
  return context;
};
