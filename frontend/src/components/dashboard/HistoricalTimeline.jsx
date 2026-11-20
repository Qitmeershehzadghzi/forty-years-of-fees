import React from 'react';
import { Award, Layers, TrendingUp, Landmark, Sparkles } from 'lucide-react';

export const HistoricalTimeline = () => {
  const milestones = [
    {
      period: '1987',
      title: 'The Clifton campus opens',
      description: 'The first management and business faculties are established. The illustrative baseline fee starts at around Rs. 5,000 a year.',
      icon: Award,
    },
    {
      period: '1995',
      title: 'Computing and software arrive',
      description: 'Demand for technology programmes leads to new laboratories. A period of high inflation prompts the first major fee revisions.',
      icon: Layers,
    },
    {
      period: '2008',
      title: 'Currency and cost pressure',
      description: 'Global financial stress and rupee depreciation raise the cost of imported equipment. Fee support and endowment models become more formal.',
      icon: TrendingUp,
    },
    {
      period: '2016',
      title: 'A new CPI baseline',
      description: 'The national price index is rebased to 2015-16 = 100, giving this project its reference point for real-rupee calculations.',
      icon: Landmark,
    },
    {
      period: '2027',
      title: 'Journey 40',
      description: 'The research platform brings 41 years of illustrative fees, inflation and education funding into one place.',
      icon: Sparkles,
    },
  ];

  return (
    <ol className="relative border-l border-[#E2E7E2] space-y-7 ml-3">
      {milestones.map((m, idx) => {
        const Icon = m.icon;
        return (
          <li key={idx} className="relative pl-7">
            <span className="absolute -left-[15px] top-0.5 w-7 h-7 rounded-full bg-white border border-[#E2E7E2] flex items-center justify-center text-[#0F5C4E]">
              <Icon className="w-3.5 h-3.5" />
            </span>
            <span className="block text-xs font-semibold text-[#0F5C4E]">{m.period}</span>
            <h3 className="mt-0.5 text-sm font-semibold text-[#12231F]">{m.title}</h3>
            <p className="mt-1 text-sm text-[#5C6B66] leading-relaxed max-w-3xl">{m.description}</p>
          </li>
        );
      })}
    </ol>
  );
};

export default HistoricalTimeline;
