import React from 'react';
import { BookOpen, Landmark, HeartHandshake, ExternalLink } from 'lucide-react';

export const FundingCategoryCard = ({
  category,
  title,
  summary,
  content,
  sources = [],
  className = '',
}) => {
  const icons = {
    Zakat: HeartHandshake,
    Waqf: Landmark,
    'Church Education Trusts': BookOpen,
    'Temple Education Trusts': Landmark,
  };

  const Icon = icons[category] || BookOpen;

  return (
    <article className={`bg-white border border-[#E2E7E2] rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#EDF5F2] flex items-center justify-center text-[#0F5C4E]">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-[#0F5C4E] uppercase tracking-wide">
            {category}
          </span>
          <h3 className="text-sm font-semibold text-[#12231F] leading-snug">{title}</h3>
        </div>
      </div>

      {summary && (
        <p className="text-sm text-[#12231F] mb-2 leading-relaxed">{summary}</p>
      )}

      <div className="text-xs text-[#5C6B66] leading-relaxed whitespace-pre-line">
        {content}
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#E2E7E2] text-[11px] text-[#5C6B66]">
          <span className="font-semibold text-[#12231F]">Referenced sources</span>
          <div className="mt-1 space-y-1">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span>• {s.title || s} ({s.publicationYear || '—'})</span>
                {s.documentUrl && (
                  <a
                    href={s.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0F5C4E] hover:underline inline-flex items-center gap-0.5"
                  >
                    View
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default FundingCategoryCard;
