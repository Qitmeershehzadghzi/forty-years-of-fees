import React from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'SIMULATED', size = 'sm' }) => {
  const norm = (status || 'SIMULATED').toUpperCase();

  const configs = {
    SIMULATED: {
      label: 'Simulated',
      classes: 'bg-[#D6AD60]/15 text-[#966b1a] border-[#D6AD60]/30',
      icon: AlertCircle,
    },
    VERIFIED: {
      label: 'Verified',
      classes: 'bg-[#23865B]/15 text-[#23865B] border-[#23865B]/30',
      icon: CheckCircle,
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      classes: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock,
    },
    UNVERIFIED: {
      label: 'Unverified',
      classes: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: Clock,
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-[#C75A5A]/15 text-[#C75A5A] border-[#C75A5A]/30',
      icon: XCircle,
    },
    PUBLISHED: {
      label: 'Published',
      classes: 'bg-[#23865B]/15 text-[#23865B] border-[#23865B]/30',
      icon: CheckCircle,
    },
    DRAFT: {
      label: 'Draft',
      classes: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: Clock,
    },
  };

  const current = configs[norm] || configs.SIMULATED;
  const Icon = current.icon;
  const sizeClasses = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border ${current.classes} ${sizeClasses}`}>
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
