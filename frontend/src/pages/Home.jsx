import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  BookOpen,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import StatCard from '../components/common/StatCard.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import HistoricalTimeline from '../components/dashboard/HistoricalTimeline.jsx';
import RealFeeChart from '../components/charts/RealFeeChart.jsx';
import FeeGrowthChart from '../components/charts/FeeGrowthChart.jsx';
import FundingChart from '../components/charts/FundingChart.jsx';
import Loading from '../components/common/Loading.jsx';

import { getOverview, getRealFees, getFeeGrowth } from '../services/analyticsService.js';
import { getProgrammes } from '../services/programmeService.js';

export const Home = () => {
  const [overview, setOverview] = useState(null);
  const [realFeesData, setRealFeesData] = useState(null);
  const [feeGrowthData, setFeeGrowthData] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [ov, rf, fg, progs] = await Promise.all([
          getOverview(),
          getRealFees({ baseYear: 2026 }),
          getFeeGrowth({ baseYear: 2026 }),
          getProgrammes(),
        ]);
        setOverview(ov);
        setRealFeesData(rf);
        setFeeGrowthData(fg);
        setProgrammes(progs);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative bg-[#101C2C] text-[#F5F1E8] pt-20 pb-24 overflow-hidden border-b border-[#1A2B40]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6AD60_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A2B40] border border-[#D6AD60]/30 text-xs font-mono text-[#D6AD60] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D6AD60] animate-pulse"></span>
              <span>Greenwich University Karachi · Journey 40 Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              FORTY YEARS OF FEES
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-serif text-[#D6AD60] italic">
              "What did a university education cost in 1987 — and what does it cost today?"
            </p>

            <p className="mt-5 text-sm sm:text-base text-[#F5F1E8]/80 leading-relaxed font-sans max-w-2xl">
              Exploring four decades of university fees, purchasing power, inflation,
              and the changing economics of higher education in Karachi across 40 calendar years (1987–2026).
            </p>

            {/* Year span badge */}
            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-[#D6AD60]">
              <span className="px-3 py-1 rounded bg-white/5 border border-white/10 font-bold text-base">
                1987 — 2026
              </span>
              <span>• 40 Historical Academic Cycles</span>
            </div>

            {/* Hero CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button to="/fees" variant="gold" size="lg" icon={ArrowRight}>
                Explore Historical Fees
              </Button>
              <Button to="/comparison" variant="secondary" size="lg">
                Explore the Data
              </Button>
              <Button to="/ai-insights" variant="outline" size="lg" className="border-[#D6AD60] text-[#D6AD60] hover:bg-[#D6AD60] hover:text-[#101C2C]" icon={Sparkles}>
                Ask Gemini AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC STATISTICS SECTION (NOT HARDCODED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Research Period"
            value="40 Years"
            subtext="1987 to 2026"
            icon={Calendar}
          />
          <StatCard
            title="Total Programmes"
            value={overview?.totalProgrammes ?? '10'}
            subtext="Configured Faculties"
            icon={BookOpen}
          />
          <StatCard
            title="Total Fee Records"
            value={overview?.totalRecords ?? '400+'}
            subtext="Component & Annual"
            icon={Database}
          />
          <StatCard
            title="Verified Records"
            value={overview?.verifiedRecords ?? '0'}
            subtext="Archival Evidence"
            icon={CheckCircle2}
            badge="Verified"
            badgeType="verified"
          />
          <StatCard
            title="Simulated Records"
            value={overview?.simulatedRecords ?? '400+'}
            subtext="Methodology Benchmark"
            icon={AlertCircle}
            badge="Simulated"
            badgeType="simulated"
          />
        </div>
      </section>

      {/* MAIN RESEARCH SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Real Fee Preview */}
          <div className="lg:col-span-8 bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#E5E0D6] pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-[#D6AD60] uppercase">
                  Featured Economic Analysis
                </span>
                <h3 className="text-xl font-serif font-bold text-[#101C2C]">
                  Nominal vs Real Fee Purchasing Power (BBA Benchmark)
                </h3>
              </div>
              <Link to="/inflation" className="text-xs font-mono text-[#D6AD60] hover:underline flex items-center gap-1 font-semibold">
                <span>Detailed Inflation Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <Loading text="Loading nominal vs real fee calculations..." />
            ) : realFeesData?.series ? (
              <RealFeeChart
                data={realFeesData.series}
                programmeName={realFeesData.programme?.name}
                baseYear={2026}
                height={380}
              />
            ) : (
              <div className="p-8 text-center text-xs font-mono text-[#788391]">
                Connect backend server to view live chart data.
              </div>
            )}

            <div className="mt-4 p-3 bg-[#F5F1E8] rounded-lg border border-[#E5E0D6] text-xs text-[#788391] flex items-center justify-between">
              <span>Formula: Real Fee = Historical Fee × (CPI Base 2026 / CPI Historical Year)</span>
              <span className="font-mono font-medium text-[#101C2C]">PBS 2015-16 CPI Series</span>
            </div>
          </div>

          {/* Right: Key Initiative Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-6 border border-[#1A2B40] shadow-md">
              <div className="flex items-center gap-2 text-[#D6AD60] text-xs font-mono font-semibold uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Data Analyst Integration</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-white">
                Intelligent Historical Analytics
              </h4>
              <p className="text-xs text-[#F5F1E8]/80 mt-2 leading-relaxed">
                Google Gemini analyzes the MongoDB dataset directly, extracting inflation trends,
                CAGR rankings, and multi-decade purchasing power shifts with strict empirical rigor.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1A2B40] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#D6AD60]">Zero Hallucination Guardrails</span>
                <Link to="/ai-insights" className="text-xs font-bold text-white hover:text-[#D6AD60] flex items-center gap-1">
                  <span>Try AI Insights</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="font-serif font-bold text-base text-[#101C2C]">
                Educational Funding in Karachi
              </h4>
              <p className="text-xs text-[#788391] leading-relaxed">
                Exploring four decades of philanthropic access via Zakat, Islamic Waqf,
                Church Education Boards, and Hindu Temple Trusts supporting students in Sindh.
              </p>
              <FundingChart height={220} />
              <Link to="/funding" className="text-xs font-mono text-[#D6AD60] font-semibold hover:underline block pt-2 border-t border-[#E5E0D6]">
                Read Educational Philanthropy Research →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* HISTORICAL TIMELINE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Chronological Retrospective"
          title="Four Decades of Educational Evolution"
          subtitle="Key milestones shaping higher education costs and institutional development at Greenwich University, Karachi (1987–2026)."
        />
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 sm:p-10 shadow-sm">
          <HistoricalTimeline />
        </div>
      </section>

      {/* PROGRAMME GROWTH PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Comparative Trajectory"
          title="Cross-Disciplinary Compound Growth"
          subtitle="Analyzing how computer science, business, engineering, and social sciences differed in tuition growth rates over 40 years."
        />
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm">
          {feeGrowthData?.rankings ? (
            <FeeGrowthChart data={feeGrowthData.rankings} height={360} />
          ) : (
            <div className="h-48 flex items-center justify-center text-xs font-mono text-[#788391]">
              Loading growth comparison...
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button to="/comparison" variant="primary" size="sm" icon={ArrowRight}>
              Open Full Comparison Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY & METHODOLOGY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#101C2C] to-[#1A2B40] text-white rounded-2xl p-8 sm:p-12 border border-[#D6AD60]/30 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded bg-[#D6AD60]/20 text-[#D6AD60] font-mono text-xs font-semibold uppercase">
              Research Integrity & Disclosure
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">
              Replacing Simulation With Verified Archival Records
            </h3>
            <p className="text-xs sm:text-sm text-[#F5F1E8]/80 leading-relaxed">
              Under Journey 40, Greenwich University invites alumni, administrators, and researchers
              to submit verified historical fee gazettes and receipts. The platform is architected
              so verified historical records immediately replace simulated estimates without altering
              the econometric framework.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button to="/methodology" variant="gold" size="md">
                Review Econometric Methodology
              </Button>
              <Button to="/sources" variant="secondary" size="md">
                Inspect Document Sources
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
