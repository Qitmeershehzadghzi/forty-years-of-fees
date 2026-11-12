import React from 'react';
import { Calendar, TrendingUp, Award, Layers } from 'lucide-react';

export const HistoricalTimeline = () => {
  const milestones = [
    {
      period: '1987 — Foundation Era',
      title: 'Greenwich University Establishes Karachi Campus',
      description: 'Inauguration of initial management and business administration faculties in Clifton. Baseline tuition established at Rs. 5,000 annually.',
      icon: Award,
    },
    {
      period: '1995 — Computing Expansion',
      title: 'Introduction of Computer Science & Software Engineering',
      description: 'Metropolitan demand for technology disciplines leads to new laboratory setups. High CPI inflation era prompts first major nominal fee revisions.',
      icon: Layers,
    },
    {
      period: '2008 — Global Macroeconomic Shift',
      title: 'Global Financial Crisis & Currency Depreciation',
      description: 'Surge in import and technology infrastructure costs across Pakistani higher education. Institutional financial aid models formalized.',
      icon: TrendingUp,
    },
    {
      period: '2016 — PBS Statistical Rebasing',
      title: 'National CPI Series Rebased to 2015-16',
      description: 'The federal benchmark for purchasing power deflators standardizes at 100.0, establishing the research platform’s base reference index.',
      icon: Calendar,
    },
    {
      period: '2026 — Journey 40 Milestone',
      title: 'Four Decades of Academic Research (Journey 40)',
      description: 'Launch of the Forty Years of Fees analytics project to systematically evaluate four decades of university economics and educational access in Karachi.',
      icon: Award,
    },
  ];

  return (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D6AD60]/40 space-y-8 my-8">
      {milestones.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div key={idx} className="relative group">
            {/* Marker point */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-[#101C2C] border-2 border-[#D6AD60] flex items-center justify-center text-[#D6AD60] group-hover:scale-110 transition-transform">
              <Icon className="w-3 h-3" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-[#D6AD60] uppercase tracking-wider">
                {m.period}
              </span>
              <h4 className="font-serif font-bold text-base text-[#101C2C] mt-0.5">
                {m.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#788391] mt-1 leading-relaxed max-w-2xl">
                {m.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoricalTimeline;
