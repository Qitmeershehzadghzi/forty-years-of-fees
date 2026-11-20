import React, { useState } from 'react';
import { Calculator, Database, Scale, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatPKR } from '../utils/currencyFormatter.js';

const CPI = {
  1987: 10.45, 1990: 13.45, 1995: 23.14, 2000: 33.48, 2005: 43.12,
  2010: 75.40, 2015: 109.28, 2016: 100.00, 2020: 127.95, 2024: 275.53,
  2026: 370.64, 2027: 412.50,
};

const PILLARS = [
  {
    icon: Database,
    title: 'The fee series is synthetic',
    text: 'Official fee registers for all 41 years are not available in one place. The dataset is generated from programme-specific starting fees and growth profiles. Every row is tagged as illustrative.',
  },
  {
    icon: Scale,
    title: 'The CPI series follows PBS',
    text: 'The price index is built on Pakistan Bureau of Statistics benchmarks, normalised to 2016 = 100. It is an illustrative series, not a certified statistical release.',
  },
  {
    icon: Calculator,
    title: 'Growth is measured with CAGR',
    text: 'CAGR turns a start and end value into a steady yearly rate: (final ÷ initial)^(1 ÷ years) − 1. Real CAGR does the same with inflation-adjusted fees.',
  },
  {
    icon: RefreshCw,
    title: 'Verified records can replace estimates',
    text: 'The admin portal can store a verified fee against the same programme and year. Verified rows supersede illustrative ones when the records are reviewed.',
  },
];

export const Methodology = () => {
  const [nominal, setNominal] = useState(5000);
  const [fromYear, setFromYear] = useState(1987);
  const [baseYear, setBaseYear] = useState(2027);

  const fromCPI = CPI[fromYear] || 10.45;
  const baseCPI = CPI[baseYear] || 412.50;
  const realValue = Math.round(Number(nominal || 0) * (baseCPI / fromCPI));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          Methodology
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          How the numbers are adjusted
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          One equation does most of the work. The rest is about being honest about what the data is.
        </p>
      </div>

      {/* Formula */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#12231F]">The deflator equation</h2>
        <div className="rounded-lg bg-[#F6F7F4] border border-[#E2E7E2] p-4 text-center">
          <p className="text-base sm:text-lg font-semibold text-[#12231F]">
            Real fee = Historical fee × (CPI<sub>base year</sub> ÷ CPI<sub>historical year</sub>)
          </p>
        </div>
        <p className="text-sm text-[#5C6B66] leading-relaxed">
          The historical fee is the rupee amount for that year. The two CPI values place both years
          on the same price scale. The result is what that fee would be in the base year's rupees.
        </p>
      </div>

      {/* Calculator */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#0F5C4E]" />
          <h2 className="text-sm font-semibold text-[#12231F]">Try it</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">Fee (PKR)</span>
            <input
              type="number"
              min="0"
              value={nominal}
              onChange={e => setNominal(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm tabular-nums focus:outline-none focus:border-[#0F5C4E]"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">Fee year</span>
            <select
              value={fromYear}
              onChange={e => setFromYear(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
            >
              {Object.keys(CPI).map(year => (
                <option key={year} value={year}>{year} (CPI {CPI[year]})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">In rupees of</span>
            <select
              value={baseYear}
              onChange={e => setBaseYear(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
            >
              {Object.keys(CPI).map(year => (
                <option key={year} value={year}>{year} (CPI {CPI[year]})</option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-lg bg-[#EDF5F2] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="block text-xs text-[#0F5C4E]">Calculation</span>
            <span className="block text-sm text-[#12231F] mt-0.5 tabular-nums">
              {Number(nominal).toLocaleString()} × ({baseCPI} ÷ {fromCPI}) = {Number(nominal).toLocaleString()} × {(baseCPI / fromCPI).toFixed(3)}
            </span>
          </div>
          <div className="sm:text-right">
            <span className="block text-xs text-[#0F5C4E]">Real fee</span>
            <span className="block text-2xl font-bold text-[#12231F] tabular-nums">{formatPKR(realValue)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-[#E2E7E2] bg-white p-5">
            <div className="w-9 h-9 rounded-lg bg-[#EDF5F2] text-[#0F5C4E] flex items-center justify-center mb-3">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#12231F]">{title}</h3>
            <p className="mt-1 text-sm text-[#5C6B66] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 rounded-xl border border-[#F0E0BC] bg-[#FDF6E7] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" />
        <p className="text-sm text-[#6B5A32] leading-relaxed">
          This is an educational research project. The figures are illustrative and must not be
          used as official transcripts, invoices or admission advice. Contact the university
          registrar for certified fee information.
        </p>
      </div>

    </div>
  );
};

export default Methodology;
