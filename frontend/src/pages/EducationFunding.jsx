import React, { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';
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
        console.error('Failed to load research notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          Education funding
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          How Karachi helps students pay
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          Fees are only half the story. Alongside tuition, four kinds of charitable funding have
          supported access to higher education in the city: zakat, waqf endowments, church education
          trusts and temple trusts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white border border-[#E2E7E2] rounded-xl p-5 sm:p-6">

        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-semibold text-[#12231F]">
            Four communal funding routes, 1987–2027
          </h2>
          <p className="text-sm text-[#5C6B66] leading-relaxed">
            Rising fees and a depreciating rupee put pressure on household budgets. In response,
            Karachi's communities have built long-running funds that pay part or all of a student's
            tuition, usually without regard to the student's background.
          </p>

          <ul className="space-y-2 text-sm text-[#12231F]">
            <li className="flex gap-2"><span className="text-[#0F5C4E]">•</span> Zakat committees pay tuition directly for eligible students.</li>
            <li className="flex gap-2"><span className="text-[#0F5C4E]">•</span> Waqf endowments use land and capital income for scholarships.</li>
            <li className="flex gap-2"><span className="text-[#0F5C4E]">•</span> Church education boards run long-standing bursary funds.</li>
            <li className="flex gap-2"><span className="text-[#0F5C4E]">•</span> Temple trusts and community guilds support university study.</li>
          </ul>
        </div>

        <div className="lg:col-span-5 bg-[#F6F7F4] border border-[#E2E7E2] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#5C6B66] border-b border-[#E2E7E2] pb-2 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-[#12231F]">
              <PieChart className="w-3.5 h-3.5 text-[#0F5C4E]" />
              Estimated share
            </span>
            <span>Illustrative</span>
          </div>
          <FundingChart height={260} />
          <p className="text-[11px] text-[#5C6B66] text-center">
            Illustrative distribution, not audited trust accounts.
          </p>
        </div>

      </div>

      <div>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#12231F]">The four mechanisms</h2>
            <p className="text-sm text-[#5C6B66] mt-0.5">Short notes on how each fund works.</p>
          </div>
          <span className="text-xs text-[#5C6B66]">{researchNotes.length} notes</span>
        </div>

        {loading ? (
          <div className="py-16"><Loading text="Loading funding notes..." /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {researchNotes.map(note => (
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

      <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 text-sm text-[#5C6B66] leading-relaxed">
        <span className="block font-semibold text-[#12231F] mb-1">A note on neutrality</span>
        This page describes funding mechanisms, not religious positions. Organisations and trust
        models are included because they appear in Karachi's documented education record.
      </div>

    </div>
  );
};

export default EducationFunding;
