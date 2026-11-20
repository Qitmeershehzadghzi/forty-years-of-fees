import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const EXPLORE = [
  { to: '/fees', label: 'Fee history' },
  { to: '/comparison', label: 'Compare programmes' },
  { to: '/inflation', label: 'Inflation deflator' },
  { to: '/funding', label: 'Education funding' },
];

const RESEARCH = [
  { to: '/ai-insights', label: 'AI research assistant' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/sources', label: 'Sources & archives' },
  { to: '/about', label: 'About Journey 40' },
];

export const Footer = () => {
  return (
    <footer className="bg-[#0F2E28] text-[#D7E2DD] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D7E2DD] text-[#0F2E28] flex items-center justify-center text-sm font-bold">
                40
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-bold text-white">Forty Years of Fees</span>
                <span className="block text-[11px] text-[#A9C0B8]">Greenwich University · Journey 40</span>
              </div>
            </div>
            <p className="text-sm text-[#A9C0B8] leading-relaxed max-w-sm">
              An open research project charting tuition fees from 1987 to 2027 against inflation,
              and the charitable trusts that help Karachi students afford university.
            </p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#D7E2DD]">
              All fee figures are illustrative (dummy) estimates — not official fee records.
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A9C0B8]">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              {EXPLORE.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[#D7E2DD] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A9C0B8]">Research</h4>
            <ul className="space-y-1.5 text-sm">
              {RESEARCH.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[#D7E2DD] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#D7E2DD] hover:text-white transition-colors"
                >
                  Admin portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
            <p className="pt-2 text-[11px] text-[#8FA79E] leading-relaxed">
              Clifton Block 1, Karachi · CPI series: PBS 2015-16 = 100
            </p>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8FA79E]">
          <span>© 1987–2027 Greenwich University, Karachi. Journey 40 research project.</span>
          <span>For illustration and research only.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
