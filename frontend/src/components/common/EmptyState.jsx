import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button.jsx';

export const EmptyState = ({
  title = 'No records found',
  description = 'Nothing matches the selected filters.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white border border-[#E2E7E2] rounded-xl p-10 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 bg-[#F3F6F3] rounded-full flex items-center justify-center mx-auto text-[#5C6B66] mb-3">
        <Database className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-base text-[#12231F]">{title}</h3>
      <p className="text-sm text-[#5C6B66] mt-1 mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
