import React from 'react';
import { Link } from 'react-router-dom';
import { DoxhaulLogo } from '../common/DoxhaulLogo';
import { usePricingModal } from '../../context/PricingModalContext';

export const Footer: React.FC = () => {
  const { openPricing } = usePricingModal();

  return (
    <footer className="bg-[#050811] border-t border-slate-900 text-white pt-16 pb-8 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4 focus:outline-none">
            <DoxhaulLogo variant="white" height={28} alt="Doxhaul Logo" />
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-xs">
            Connecting the world's supply chain through verified 3D spatial routing, instant rate settlements, and complete operational transparency.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white text-sm">Product</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button 
                type="button"
                onClick={() => openPricing('SHIPPER')} 
                className="hover:text-cyan-400 transition-colors text-left cursor-pointer"
              >
                For Shippers
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => openPricing('BROKER')} 
                className="hover:text-cyan-400 transition-colors text-left cursor-pointer"
              >
                For Brokers
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => openPricing('CARRIER')} 
                className="hover:text-cyan-400 transition-colors text-left cursor-pointer"
              >
                For Carriers
              </button>
            </li>
            <li>
              <button
                type="button"
                id="footer-pricing-btn"
                onClick={() => openPricing()}
                className="text-slate-400 hover:text-cyan-400 text-xs transition-colors text-left font-medium cursor-pointer"
              >
                Pricing
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white text-sm">Company</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Careers
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Blog
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Contact
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white text-sm">Legal & Compliance</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Security
              </button>
            </li>
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                Compliance
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Doxhaul Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
