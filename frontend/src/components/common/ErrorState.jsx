import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

export const ErrorState = ({
  message = 'Could not load this data',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-[#E2E7E2] rounded-xl p-8 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 bg-[#FDF6E7] rounded-full flex items-center justify-center mx-auto text-[#B7791F] mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-base text-[#12231F]">Something went wrong</h3>
      <p className="text-sm text-[#5C6B66] mt-1 mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
