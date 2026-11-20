import React from 'react';

export const SourceCitation = ({
  sourceTitle = 'Pakistan Bureau of Statistics (PBS) CPI Index',
  year = '2027',
  url,
  isSimulated = false,
}) => {
  return (
    <div className="mt-4 pt-3 border-t border-[#E2E7E2] text-xs flex flex-wrap items-center justify-between gap-2 text-[#5C6B66]">
      <div>
        <span className="font-medium text-[#12231F]">Source:</span>{' '}
        <span>{sourceTitle} ({year})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded ${isSimulated ? 'bg-[#FDF6E7] text-[#8A5A12]' : 'bg-[#EDF5F2] text-[#0F5C4E]'}`}>
          {isSimulated ? 'Illustrative series' : 'Official series'}
        </span>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#0F5C4E] hover:underline font-medium">
            View document
          </a>
        )}
      </div>
    </div>
  );
};

export default SourceCitation;
