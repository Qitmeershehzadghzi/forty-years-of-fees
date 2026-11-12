import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-16 h-16 bg-[#101C2C] text-[#D6AD60] rounded-2xl flex items-center justify-center font-serif font-black text-2xl mb-4 shadow-lg">
        404
      </div>
      <h2 className="text-3xl font-serif font-bold text-[#101C2C]">
        Historical Page Not Found
      </h2>
      <p className="text-sm text-[#788391] max-w-md mt-2 mb-8">
        The research document or archival record you are looking for does not exist in the Forty Years of Fees index.
      </p>
      <div className="flex items-center gap-4">
        <Button to="/" variant="gold" icon={Home}>
          Return to Overview
        </Button>
        <Button to="/fees" variant="outline" icon={ArrowLeft}>
          Browse Fee Archive
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
