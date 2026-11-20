import React from 'react';
import { Calendar } from 'lucide-react';

export const YearRangeFilter = ({
  startYear = 1987,
  endYear = 2027,
  onStartChange,
  onEndChange,
  minYear = 1987,
  maxYear = 2027,
  className = '',
}) => {
  const years = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#788391] uppercase tracking-wider font-mono">
        <Calendar className="w-3.5 h-3.5 text-[#D6AD60]" />
        <span>Research Period</span>
      </label>
      <div className="flex items-center gap-2">
        <select
          value={startYear}
          onChange={(e) => onStartChange && onStartChange(Number(e.target.value))}
          className="bg-white border border-[#E5E0D6] rounded-lg px-2.5 py-2 text-xs font-mono font-medium text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60] shadow-sm flex-1"
        >
          {years.filter(y => y <= endYear).map((y) => (
            <option key={`start-${y}`} value={y}>{y}</option>
          ))}
        </select>
        <span className="text-xs text-[#788391] font-mono font-semibold">to</span>
        <select
          value={endYear}
          onChange={(e) => onEndChange && onEndChange(Number(e.target.value))}
          className="bg-white border border-[#E5E0D6] rounded-lg px-2.5 py-2 text-xs font-mono font-medium text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60] shadow-sm flex-1"
        >
          {years.filter(y => y >= startYear).map((y) => (
            <option key={`end-${y}`} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default YearRangeFilter;
