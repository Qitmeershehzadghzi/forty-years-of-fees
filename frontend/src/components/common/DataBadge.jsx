import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const DataBadge = ({ status = 'SIMULATED', size = 'sm', className = '' }) => {
  const norm = (status || 'SIMULATED').toUpperCase();

  const configs = {
    SIMULATED: {
      label: 'Simulated Data',
      icon: AlertCircle,
      classes: 'bg-[#D6AD60]/15 text-[#966b1a] border-[#D6AD60]/30',
      tooltip: 'Generated illustrative model. Not official Greenwich University records.',
    },
    VERIFIED: {
      label: 'Verified Record',
      icon: CheckCircle2,
      classes: 'bg-[#23865B]/15 text-[#23865B] border-[#23865B]/30',
      tooltip: 'Cross-checked against documented institutional archives or PBS gazette.',
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      icon: Clock,
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      tooltip: 'Submitted record awaiting formal verification committee review.',
    },
  };

  const current = configs[norm] || configs.SIMULATED;
  const Icon = current.icon;

  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      title={current.tooltip}
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border ${current.classes} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};

export default DataBadge;
