import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const DataBadge = ({ status = 'SIMULATED', size = 'sm', className = '' }) => {
  const norm = (status || 'SIMULATED').toUpperCase();

  const configs = {
    SIMULATED: {
      label: 'Illustrative',
      icon: AlertCircle,
      classes: 'bg-[#FDF6E7] text-[#8A5A12] border-[#F0E0BC]',
      tooltip: 'Synthetic, illustrative estimate. Not an official Greenwich University fee record.',
    },
    VERIFIED: {
      label: 'Verified',
      icon: CheckCircle2,
      classes: 'bg-[#EDF5F2] text-[#0F5C4E] border-[#CFE4DD]',
      tooltip: 'Cross-checked against a documented institutional archive or PBS gazette.',
    },
    PENDING_REVIEW: {
      label: 'Pending review',
      icon: Clock,
      classes: 'bg-[#F3F6F3] text-[#5C6B66] border-[#E2E7E2]',
      tooltip: 'Submitted record awaiting verification committee review.',
    },
  };

  const current = configs[norm] || configs.SIMULATED;
  const Icon = current.icon;
  const sizeClasses = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      title={current.tooltip}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${current.classes} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};

export default DataBadge;
