import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';

const OBJECTIVES = [
  {
    title: 'Put fees next to inflation',
    text: 'Move past raw rupee amounts and compare each year in the same purchasing power.',
  },
  {
    title: 'Follow each programme',
    text: 'Computing, business, media and social science fees do not grow at the same rate.',
  },
  {
    title: 'Record the safety nets',
    text: 'Zakat, waqf, church and temple trusts are part of how students afford university.',
  },
];

export const About = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          About
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          Forty Years of Fees
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          A Journey 40 research project at Greenwich University, Karachi.
        </p>
      </div>

      <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-7 space-y-4">
        <p className="text-sm sm:text-base text-[#12231F] leading-relaxed">
          The university has been teaching in Karachi since 1987. In four decades the rupee has
          lost most of its purchasing power, and the fees printed in a prospectus have changed
          beyond recognition. Yet the two have rarely been shown on the same page.
        </p>
        <p className="text-sm sm:text-base text-[#12231F] leading-relaxed">
          This project tabulates an illustrative fee for every programme and year from 1987 to
          2027, adjusts it with a PBS-based price index, and charts the real cost. It also records
          how zakat, waqf, church education trusts and temple trusts have helped students meet
          that cost.
        </p>
        <blockquote className="border-l-2 border-[#0F5C4E] pl-4 text-sm sm:text-base text-[#5C6B66] italic">
          What did higher education cost in 1987 — and what does that fee look like in today's rupees?
        </blockquote>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#12231F] mb-3">Three questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OBJECTIVES.map((item, idx) => (
            <div key={item.title} className="rounded-xl border border-[#E2E7E2] bg-white p-5">
              <span className="block text-xs font-semibold text-[#0F5C4E] mb-1">0{idx + 1}</span>
              <h3 className="text-sm font-semibold text-[#12231F]">{item.title}</h3>
              <p className="mt-1 text-sm text-[#5C6B66] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#E2E7E2] bg-white p-5">
          <Building2 className="w-4 h-4 text-[#0F5C4E] mb-2" />
          <h2 className="text-sm font-semibold text-[#12231F]">Clifton Block 1</h2>
          <p className="mt-1 text-sm text-[#5C6B66] leading-relaxed">
            The main campus has housed the core faculties, library and computing laboratories.
            A second team may extend the project to another site.
          </p>
        </div>

        <div className="rounded-xl border border-[#E2E7E2] bg-white p-5">
          <ShieldCheck className="w-4 h-4 text-[#0F5C4E] mb-2" />
          <h2 className="text-sm font-semibold text-[#12231F]">An honest dataset</h2>
          <p className="mt-1 text-sm text-[#5C6B66] leading-relaxed">
            Every fee here is a dummy estimate, clearly labelled. The admin portal can hold
            verified records when prospectuses or receipts are found.
          </p>
          <Link
            to="/sources"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5C4E] hover:underline"
          >
            See the sources
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <p className="text-xs text-[#5C6B66] leading-relaxed">
        Research period: 1987–2027 · 10 programmes · Clifton Block 1, Karachi. For illustration
        and research only; not official university fee information.
      </p>

    </div>
  );
};

export default About;
