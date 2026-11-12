import React from 'react';

export const SourceCitation = ({
  sourceTitle = 'Pakistan Bureau of Statistics (PBS) CPI Index',
  year = '2026',
  url,
  isSimulated = false,
}) => {
  return (
    <div className="mt-4 pt-3 border-t border-[#E5E0D6] text-xs flex flex-wrap items-center justify-between gap-2 text-[#788391]">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-[#101C2C]">Source Reference:</span>
        <span>{sourceTitle} ({year})</span>
      </div>
      <div className="flex items-center gap-2">
        {isSimulated ? (
          <span className="font-mono text-[11px] text-[#966b1a] bg-[#D6AD60]/10 px-2 py-0.5 rounded">
            Simulated Benchmark
          </span>
        ) : (
          <span className="font-mono text-[11px] text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded">
            Official Series
          </span>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D6AD60] hover:underline font-medium"
          >
            Inspect Document →
          </a>
        )}
      </div>
    </div>
  );
};

export default SourceCitation;
