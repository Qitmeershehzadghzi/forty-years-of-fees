import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeType = 'default',
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#E2E7E2] rounded-xl p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-wide text-[#5C6B66] uppercase">
          {title}
        </p>
        {Icon && <Icon className="w-4 h-4 text-[#8A9A94] shrink-0" />}
      </div>

      <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#12231F] tabular-nums">
        {value}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5C6B66]">
        {subtext && <span>{subtext}</span>}
        {badge && (
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            badgeType === 'verified'
              ? 'bg-[#EDF5F2] text-[#0F5C4E]'
              : 'bg-[#FDF6E7] text-[#8A5A12]'
          }`}>
            {badge}
          </span>
        )}
        {trend && (
          <span className={`font-semibold ${trend.startsWith('+') ? 'text-[#B42318]' : 'text-[#0F5C4E]'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
