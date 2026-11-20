import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-12 h-12 bg-[#EDF5F2] text-[#0F5C4E] rounded-xl flex items-center justify-center font-bold text-lg mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-[#12231F]">Page not found</h1>
      <p className="text-sm text-[#5C6B66] max-w-md mt-2 mb-6">
        The page you asked for is not part of the Forty Years of Fees site.
      </p>
      <div className="flex items-center gap-3">
        <Button to="/" variant="primary" icon={Home}>
          Back to overview
        </Button>
        <Button to="/fees" variant="secondary" icon={ArrowLeft}>
          Browse fees
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
