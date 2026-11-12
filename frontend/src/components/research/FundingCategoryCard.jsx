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
    <article className={`bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] border border-[#E5E0D6] flex items-center justify-center text-[#D6AD60]">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-semibold text-[#966b1a] uppercase tracking-wider">
            {category}
          </span>
          <h3 className="font-serif font-bold text-lg text-[#101C2C]">
            {title}
          </h3>
        </div>
      </div>

      {summary && (
        <p className="text-sm font-medium text-[#426B70] mb-3 leading-relaxed">
          {summary}
        </p>
      )}

      <div className="text-xs text-[#788391] leading-relaxed space-y-2 whitespace-pre-line mb-4">
        {content}
      </div>

      {sources && sources.length > 0 && (
        <div className="pt-3 border-t border-[#E5E0D6] text-[11px] text-[#788391]">
          <span className="font-semibold text-[#101C2C]">Referenced Sources:</span>
          <div className="mt-1 space-y-1">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span>• {s.title || s} ({s.publicationYear || '2024'})</span>
                {s.documentUrl && (
                  <a
                    href={s.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D6AD60] hover:underline flex items-center gap-0.5"
                  >
                    <span>View</span>
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
