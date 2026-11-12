import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

export const ErrorState = ({
  message = 'Failed to load research data',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-[#C75A5A]/30 rounded-xl p-8 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 bg-[#C75A5A]/10 rounded-full flex items-center justify-center mx-auto text-[#C75A5A] mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-lg text-[#101C2C]">Data Notice</h3>
      <p className="text-xs text-[#788391] mt-1 mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button size="sm" variant="primary" icon={RefreshCw} onClick={onRetry}>
          Retry Query
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
