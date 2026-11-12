import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  Landmark,
  BookOpen,
  Scale,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import FundingCategoryCard from '../components/research/FundingCategoryCard.jsx';
import FundingChart from '../components/charts/FundingChart.jsx';
import Loading from '../components/common/Loading.jsx';

import { getResearchNotes } from '../services/researchService.js';

export const EducationFunding = () => {
  const [researchNotes, setResearchNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true);
        const data = await getResearchNotes();
        setResearchNotes(data);
      } catch (err) {
        console.error('Failed to load research monographs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HEADER */}
      <div>
        <SectionHeading
          badge="Educational Philanthropy in Karachi"
          title="Charitable Higher Education Funding Mechanisms"
          subtitle="How Zakat, Waqf endowments, Church Education Boards, and Hindu Temple Trusts cushion Karachi students against rising university fees."
        />
      </div>

      {/* OVERVIEW INTRO & PIE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E5E0D6] rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-[#D6AD60]">
            Social Safety Nets in Tertiary Education
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#101C2C]">
            Four Decades of Communal Educational Philanthropy
          </h3>
          <p className="text-xs sm:text-sm text-[#788391] leading-relaxed">
            In metropolitan Karachi, rapid population growth and currency depreciation have historically
            strained family budgets. Religious and communal educational trusts have served as vital
            financial equalizers, enabling talented students from low- and middle-income backgrounds to
            pursue higher education in private and public degree-awarding institutions.
          </p>
          <div className="p-3 bg-[#F5F1E8] rounded-lg border border-[#E5E0D6] text-xs text-[#101C2C] space-y-1">
            <strong>Key Philanthropic Pillars:</strong>
            <ul className="list-disc list-inside text-[#788391] space-y-0.5">
              <li>Direct tuition fee waivers disbursed by institutional Zakat committees</li>
              <li>Perpetual capital and land yields generated through Islamic Waqf instruments</li>
              <li>Century-old scholastic scholarship boards established by Christian dioceses</li>
              <li>Community education trusts organized by the Hindu community across Sindh</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#F5F1E8]/50 p-6 rounded-xl border border-[#E5E0D6] text-center">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#788391] font-mono mb-2">
            Estimated Philanthropic Share in Karachi
          </h4>
          <FundingChart height={260} />
          <span className="text-[11px] font-mono text-[#788391] block mt-2">
            Illustrative distribution based on Karachi philanthropic trust research.
          </span>
        </div>
      </div>

      {/* THE FOUR CATEGORIES */}
      <div className="space-y-6">
        <h3 className="font-serif font-bold text-xl text-[#101C2C]">
          Detailed Institutional Monograph Categories
        </h3>

        {loading ? (
          <div className="py-16">
            <Loading text="Loading educational funding monographs..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchNotes.map((note) => (
              <FundingCategoryCard
                key={note._id}
                category={note.category}
                title={note.title}
                summary={note.summary}
                content={note.content}
                sources={note.sourceIds}
              />
            ))}
          </div>
        )}
      </div>

      {/* RESEARCH STANDARDS CALLOUT */}
      <div className="p-6 bg-[#101C2C] text-[#F5F1E8] rounded-xl border border-[#1A2B40] text-xs leading-relaxed flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#D6AD60] shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <strong className="text-white font-serif text-sm">
            Scholarly Standards & Attribution Guidelines
          </strong>
          <p className="text-[#F5F1E8]/80">
            This section documents structural funding mechanisms without making unsubstantiated claims
            regarding specific religious organizations or private finances. All referenced institutions
            and trust models reflect verifiable historical documentation archived in the Sindh Higher Education
            Commission and Karachi trust gazettes.
          </p>
        </div>
      </div>

    </div>
  );
};

export default EducationFunding;
