import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  HeartHandshake,
  Layers,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import RealFeeChart from '../components/charts/RealFeeChart.jsx';
import Loading from '../components/common/Loading.jsx';
import StatCard from '../components/common/StatCard.jsx';
import { getOverview, getRealFees } from '../services/analyticsService.js';
import { formatPKR } from '../utils/currencyFormatter.js';

const START_YEAR = 1987;
const END_YEAR = 2027;

// Illustrative CPI series (PBS 2015-16 = 100). Used only for the quick converter.
const CPI = {
  1987: 10.45, 1988: 11.38, 1989: 12.33, 1990: 13.45, 1991: 15.15,
  1992: 16.60, 1993: 18.23, 1994: 20.48, 1995: 23.14, 1996: 25.64,
  1997: 28.56, 1998: 30.34, 1999: 32.07, 2000: 33.48, 2001: 34.52,
  2002: 35.65, 2003: 36.75, 2004: 39.46, 2005: 43.12, 2006: 46.53,
  2007: 50.11, 2008: 60.28, 2009: 68.48, 2010: 75.40, 2011: 84.38,
  2012: 92.58, 2013: 99.43, 2014: 106.58, 2015: 109.28, 2016: 100.00,
  2017: 104.15, 2018: 108.21, 2019: 115.54, 2020: 127.95, 2021: 139.34,
  2022: 170.21, 2023: 220.42, 2024: 275.53, 2025: 325.12, 2026: 370.64,
  2027: 412.50,
};

const YEARS = Object.keys(CPI).map(Number);

const QUICK_LINKS = [
  {
    to: '/comparison',
    icon: Layers,
    title: 'Compare programmes',
    text: 'See how business, computing, media and social science fees moved apart.',
  },
  {
    to: '/inflation',
    icon: Scale,
    title: 'Inflation deflator',
    text: 'Convert any fee into constant rupees and read the change correctly.',
  },
  {
    to: '/funding',
    icon: HeartHandshake,
    title: 'Education funding',
    text: 'How zakat, waqf, church and temple trusts help Karachi students.',
  },
  {
    to: '/ai-insights',
    icon: Sparkles,
    title: 'AI research assistant',
    text: 'Ask plain-language questions about fees and the CPI behind them.',
  },
];

export const Home = () => {
  const [overview, setOverview] = useState(null);
  const [realFeesData, setRealFeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [amount, setAmount] = useState(5000);
  const [fromYear, setFromYear] = useState(START_YEAR);
  const [toYear, setToYear] = useState(END_YEAR);

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        setLoading(true);
        setLoadError(false);
        const [ov, rf] = await Promise.all([
          getOverview(),
          getRealFees({ baseYear: END_YEAR }),
        ]);
        if (!active) return;
        setOverview(ov);
        setRealFeesData(rf);
      } catch (err) {
        console.error('Error fetching home data:', err);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHomeData();
    return () => { active = false; };
  }, []);

  const converted = Math.round(Number(amount || 0) * (CPI[toYear] / CPI[fromYear]));

  return (
    <div className="pb-4">

      {/* Hero */}
      <section className="bg-white border-b border-[#E2E7E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
                Greenwich University · Journey 40
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12231F] leading-[1.1]">
                Forty years of fees,
                <br className="hidden sm:block" />
                in plain numbers.
              </h1>
              <p className="text-base sm:text-lg text-[#5C6B66] leading-relaxed max-w-2xl">
                University fees in Karachi since 1987, set side by side with inflation.
                This project shows how to turn old rupees into today's rupees — and what
                that changes about the cost of a degree.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/fees"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0F5C4E] text-white text-sm font-semibold hover:bg-[#0B443A] transition-colors"
                >
                  View fee history
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/methodology"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#E2E7E2] text-[#12231F] text-sm font-semibold hover:bg-[#F6F7F4] transition-colors"
                >
                  See the method
                </Link>
              </div>

              <p className="flex items-start gap-2 pt-1 text-xs text-[#8A5A12] bg-[#FDF6E7] border border-[#F0E0BC] rounded-lg px-3 py-2 max-w-xl">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  Every fee on this site is a dummy, illustrative estimate. It is not an
                  official Greenwich University fee record.
                </span>
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#F6F7F4] border border-[#E2E7E2] rounded-xl p-6">
                <h2 className="text-sm font-semibold text-[#12231F] mb-4">At a glance</h2>
                <dl className="space-y-3 text-sm">
                  {[
                    ['Research period', '1987 – 2027 (41 years)'],
                    ['Programmes', '10 degree programmes'],
                    ['Fee items per year', 'Tuition, admission, exam, registration, other'],
                    ['Main campus', 'Clifton Block 1, Karachi'],
                    ['Data status', 'Illustrative / synthetic'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 pb-3 border-b border-[#E2E7E2] last:border-0 last:pb-0">
                      <dt className="text-[#5C6B66]">{label}</dt>
                      <dd className="font-medium text-[#12231F] text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  to="/sources"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5C4E] hover:underline"
                >
                  Where the numbers come from
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Research period" value="41 years" subtext="1987 to 2027" />
          <StatCard
            title="Programmes"
            value={overview?.totalProgrammes ?? 10}
            subtext="Degree programmes"
          />
          <StatCard
            title="Fee records"
            value={overview?.totalRecords ? overview.totalRecords.toLocaleString() : '2,460'}
            subtext="Illustrative estimates"
          />
          <StatCard
            title="CPI years"
            value={overview?.cpiRecords ?? 41}
            subtext="PBS series, 2016 = 100"
          />
        </div>
      </section>

      {/* Chart + converter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 bg-white border border-[#E2E7E2] rounded-xl p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="text-lg font-semibold text-[#12231F]">Fees vs inflation</h2>
                <p className="text-sm text-[#5C6B66] mt-0.5">
                  The dark line is the fee paid. The green line is the same fee in 2027 rupees.
                </p>
              </div>
              <Link
                to="/inflation"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5C4E] hover:underline"
              >
                Open deflator
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <Loading text="Loading fee and CPI data..." />
            ) : loadError ? (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-[#12231F]">Live data is not available.</p>
                <p className="text-xs text-[#5C6B66] mt-1">
                  Start the backend on port 5000 to load the chart.
                </p>
              </div>
            ) : realFeesData?.series ? (
              <RealFeeChart
                data={realFeesData.series}
                programmeName={realFeesData.programme?.name}
                baseYear={END_YEAR}
                height={360}
              />
            ) : (
              <div className="py-16 text-center text-xs text-[#5C6B66]">
                No chart data returned.
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E2E7E2] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-[#0F5C4E]" />
              <h2 className="text-lg font-semibold text-[#12231F]">Quick converter</h2>
            </div>
            <p className="text-sm text-[#5C6B66] mb-4">
              What would an old fee cost in another year's rupees?
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs font-medium text-[#5C6B66] mb-1">Fee amount (PKR)</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0F5C4E]/20 focus:border-[#0F5C4E]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-medium text-[#5C6B66] mb-1">From year</span>
                  <select
                    value={fromYear}
                    onChange={(e) => setFromYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
                  >
                    {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-[#5C6B66] mb-1">To year</span>
                  <select
                    value={toYear}
                    onChange={(e) => setToYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
                  >
                    {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-[#EDF5F2]">
              <span className="block text-xs text-[#0F5C4E] mb-1">
                {fromYear} rupees → {toYear} rupees
              </span>
              <span className="block text-2xl font-bold text-[#12231F] tabular-nums">
                {formatPKR(converted)}
              </span>
              <span className="block mt-1 text-[11px] text-[#5C6B66]">
                {formatPKR(amount)} × ({CPI[toYear]} ÷ {CPI[fromYear]})
              </span>
            </div>

            <Link
              to="/methodology"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5C4E] hover:underline"
            >
              How this is calculated
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Where to go next */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-[#12231F] mb-1">Where to go next</h2>
        <p className="text-sm text-[#5C6B66] mb-5">
          Four ways into the same 41-year dataset.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white border border-[#E2E7E2] rounded-xl p-5 hover:border-[#0F5C4E]/40 hover:bg-[#FBFCFB] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EDF5F2] text-[#0F5C4E] flex items-center justify-center mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#12231F] group-hover:text-[#0F5C4E]">
                {title}
              </h3>
              <p className="mt-1 text-xs text-[#5C6B66] leading-relaxed">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclosure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#FDF6E7] border border-[#F0E0BC] rounded-xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#12231F]">About the numbers</h2>
          <p className="mt-1.5 text-sm text-[#6B5A32] leading-relaxed max-w-4xl">
            Continuous official fee records for all 41 years do not exist in one place. The fee
            series here is generated from programme-specific baselines and growth profiles, then
            deflated with an illustrative CPI series based on PBS benchmarks. Use it to learn the
            method of inflation adjustment — not as a statement of what the university actually charged.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
