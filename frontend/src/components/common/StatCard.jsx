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
    <div className={`bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#788391] uppercase">
            {title}
          </p>
          <div className="mt-2 text-2xl lg:text-3xl font-bold font-mono text-[#101C2C]">
            {value}
          </div>
        </div>
        {Icon && (
          <div className="p-2.5 bg-[#F5F1E8] text-[#101C2C] rounded-lg border border-[#E5E0D6]/60">
            <Icon className="w-5 h-5 text-[#D6AD60]" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtext && <span className="text-[#788391]">{subtext}</span>}
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono ${
            badgeType === 'verified'
              ? 'bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20'
              : 'bg-[#D6AD60]/15 text-[#966b1a] border border-[#D6AD60]/30'
          }`}>
            {badge}
          </span>
        )}
        {trend && (
          <span className={`font-mono font-medium ${trend.startsWith('+') ? 'text-[#C75A5A]' : 'text-[#23865B]'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
