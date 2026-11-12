import React from 'react';
import { BookOpen } from 'lucide-react';

export const ProgrammeSelector = ({
  programmes = [],
  selectedId,
  onChange,
  label = 'Academic Programme',
  showAllOption = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#788391] uppercase tracking-wider font-mono">
          <BookOpen className="w-3.5 h-3.5 text-[#D6AD60]" />
          <span>{label}</span>
        </label>
      )}
      <select
        value={selectedId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#E5E0D6] rounded-lg px-3 py-2 text-sm text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60] focus:border-transparent font-medium shadow-sm"
      >
        {showAllOption && <option value="">All Programmes (Aggregate)</option>}
        {programmes.map((p) => (
          <option key={p._id || p.id} value={p._id || p.id}>
            {p.name} ({p.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProgrammeSelector;
