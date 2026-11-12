import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#101C2C] text-[#F5F1E8] border-t border-[#1A2B40] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Institutional Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#D6AD60] text-[#101C2C] flex items-center justify-center font-serif font-black text-lg">
                40
              </div>
              <span className="font-serif font-bold text-lg text-white">
                FORTY YEARS OF FEES
              </span>
            </div>
            <p className="text-xs text-[#788391] leading-relaxed max-w-md">
              A comprehensive academic research monograph and interactive financial analytics platform
              developed for Greenwich University, Karachi, under the <strong>Journey 40</strong> initiative.
              Demonstrating four decades (1987–2026) of higher education costs, inflation trends,
              and purchasing power dynamics.
            </p>
            <div className="p-3 bg-[#1A2B40]/60 rounded-lg border border-[#D6AD60]/20 text-[11px] text-[#F5F1E8]/70 leading-relaxed font-mono">
              <strong className="text-[#D6AD60]">Research Disclosure:</strong> Complete historical fee records for all 40 years
              are not officially available. The initial dataset comprises realistic simulated models
              for research methodology testing and institutional financial analytics.
            </div>
          </div>

          {/* Research Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D6AD60] font-mono mb-3">
              Analytics Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#F5F1E8]/80">
              <li><Link to="/fees" className="hover:text-[#D6AD60] transition-colors">Historical Fee Explorer</Link></li>
              <li><Link to="/comparison" className="hover:text-[#D6AD60] transition-colors">Programme Growth Comparison</Link></li>
              <li><Link to="/inflation" className="hover:text-[#D6AD60] transition-colors">PBS CPI Inflation Analysis</Link></li>
              <li><Link to="/ai-insights" className="hover:text-[#D6AD60] transition-colors">Gemini AI Research Analyst</Link></li>
              <li><Link to="/funding" className="hover:text-[#D6AD60] transition-colors">Karachi Education Philanthropy</Link></li>
            </ul>
          </div>

          {/* Institutional Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D6AD60] font-mono mb-3">
              Institutional Context
            </h4>
            <ul className="space-y-2 text-xs text-[#F5F1E8]/80">
              <li><Link to="/methodology" className="hover:text-[#D6AD60] transition-colors">Methodology & Formulae</Link></li>
              <li><Link to="/sources" className="hover:text-[#D6AD60] transition-colors">PBS Gazette & Archival Sources</Link></li>
              <li><Link to="/about" className="hover:text-[#D6AD60] transition-colors">About Journey 40</Link></li>
              <li>
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D6AD60] transition-colors flex items-center gap-1 text-[#D6AD60]"
                >
                  <span>Admin Verification Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
            <div className="mt-4 text-[11px] text-[#788391]">
              Greenwich University Main Campus:<br />
              Clifton Block 1 / DHA Phase VI, Karachi, Pakistan.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1A2B40] flex flex-col sm:flex-row items-center justify-between text-xs text-[#788391] gap-3">
          <p>© 1987–2026 Greenwich University, Karachi. Journey 40 Research Platform.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Powered by Google Gemini 2.5</span>
            <span>·</span>
            <span>PBS CPI Reference Series</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
