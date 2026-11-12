import React from 'react';
import { Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const AIInsightCard = ({
  title = 'AI Research Analysis',
  summary,
  keyFindings = [],
  trends = [],
  limitations = [],
  conclusion,
  dataStatus = 'SIMULATED',
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-br from-[#101C2C] to-[#1A2B40] text-[#F5F1E8] border border-[#D6AD60]/30 rounded-xl p-6 shadow-xl relative overflow-hidden ${className}`}>
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1A2B40]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#D6AD60]/20 rounded-lg text-[#D6AD60]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D6AD60]/20 text-[#D6AD60] border border-[#D6AD60]/40 font-semibold">
            Status: {dataStatus}
          </span>
          <span className="text-[#788391] text-[11px]">Powered by Google Gemini</span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-[#F5F1E8]/90 leading-relaxed mb-5 italic border-l-2 border-[#D6AD60] pl-3">
          "{summary}"
        </p>
      )}

      {/* Key Findings */}
      {keyFindings && keyFindings.length > 0 && (
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D6AD60] font-mono">
            Key Financial Findings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {keyFindings.map((finding, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-xs text-[#788391]">{finding.title}</div>
                <div className="text-base font-bold font-mono text-white mt-1">
                  {finding.value}
                </div>
                {finding.description && (
                  <div className="text-[11px] text-[#F5F1E8]/70 mt-1 leading-snug">
                    {finding.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {trends && trends.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D6AD60] font-mono mb-2">
            Identified Empirical Trends
          </h4>
          <ul className="space-y-1.5 text-xs text-[#F5F1E8]/85">
            {trends.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6AD60] mt-1.5 shrink-0"></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Limitations / Disclosures */}
      {limitations && limitations.length > 0 && (
        <div className="p-3 bg-black/20 rounded-lg border border-[#D6AD60]/20 text-[11px] text-[#F5F1E8]/70 space-y-1 mb-4">
          <div className="flex items-center gap-1.5 text-[#D6AD60] font-semibold font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Research Limitations & Disclosures:</span>
          </div>
          {limitations.map((lim, idx) => (
            <p key={idx}>• {lim}</p>
          ))}
        </div>
      )}

      {/* Conclusion */}
      {conclusion && (
        <div className="pt-3 border-t border-[#1A2B40] text-xs text-[#F5F1E8]/90">
          <strong className="text-[#D6AD60]">Synthesis:</strong> {conclusion}
        </div>
      )}
    </div>
  );
};

export default AIInsightCard;
