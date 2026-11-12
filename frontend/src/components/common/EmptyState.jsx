import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button.jsx';

export const EmptyState = ({
  title = 'No records found',
  description = 'No historical data matches the specified filters.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white border border-[#E5E0D6] rounded-xl p-10 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 bg-[#F5F1E8] rounded-full flex items-center justify-center mx-auto text-[#788391] mb-3">
        <Database className="w-6 h-6 text-[#D6AD60]" />
      </div>
      <h3 className="font-serif font-bold text-lg text-[#101C2C]">{title}</h3>
      <p className="text-xs text-[#788391] mt-1 mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
