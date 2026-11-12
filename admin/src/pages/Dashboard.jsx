import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Receipt,
  Database,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { getAnalyticsOverview, getDataQuality } from '../services/adminOperations.js';

export const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [dataQuality, setDataQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDash() {
      try {
        setLoading(true);
        const [ov, dq] = await Promise.all([
          getAnalyticsOverview(),
          getDataQuality(),
        ]);
        setOverview(ov);
        setDataQuality(dq);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDash();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase tracking-wider">
            Greenwich University · Journey 40 (1987–2026)
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#101C2C]">
            Administrative Research Command Center
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/fees/new"
            className="px-3.5 py-2 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Add Fee Record</span>
          </Link>
          <Link
            to="/import"
            className="px-3.5 py-2 rounded-lg bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
        </div>
      </div>

      {/* OVERVIEW METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">Programmes</span>
          <div className="text-2xl font-bold font-mono text-[#101C2C] mt-1">
            {overview?.totalProgrammes ?? '10'}
          </div>
          <span className="text-[10px] text-[#23865B] font-mono">100% Active</span>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">Total Fees</span>
          <div className="text-2xl font-bold font-mono text-[#101C2C] mt-1">
            {overview?.totalRecords ?? '400+'}
          </div>
          <span className="text-[10px] text-[#788391] font-mono">Component & Total</span>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">Verified Records</span>
          <div className="text-2xl font-bold font-mono text-[#23865B] mt-1">
            {overview?.verifiedRecords ?? '0'}
          </div>
          <span className="text-[10px] text-[#23865B] font-mono">Gazette Documented</span>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">Simulated</span>
          <div className="text-2xl font-bold font-mono text-[#966b1a] mt-1">
            {overview?.simulatedRecords ?? '400+'}
          </div>
          <span className="text-[10px] text-[#D6AD60] font-mono">Benchmark Model</span>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">CPI Series</span>
          <div className="text-2xl font-bold font-mono text-[#101C2C] mt-1">
            {overview?.cpiRecords ?? '40'}
          </div>
          <span className="text-[10px] text-[#788391] font-mono">1987–2026 Years</span>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-[#788391] uppercase">Sources</span>
          <div className="text-2xl font-bold font-mono text-[#101C2C] mt-1">
            {overview?.totalSources ?? '4'}
          </div>
          <span className="text-[10px] text-[#788391] font-mono">Referenced Gazettes</span>
        </div>

      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Data Quality & Coverage Matrix */}
        <div className="lg:col-span-8 bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E5E0D6] flex items-center justify-between bg-[#101C2C] text-white">
            <div>
              <h3 className="font-serif font-bold text-base">
                Faculty 40-Year Data Coverage Matrix (1987–2026)
              </h3>
              <p className="text-[11px] text-[#D6AD60] font-mono">
                Verifying annual fee presence and simulated vs verified distribution
              </p>
            </div>
            <Link to="/import" className="text-xs font-mono text-[#D6AD60] hover:underline flex items-center gap-1">
              <span>Bulk Upload</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#F5F1E8] text-[#788391] border-b border-[#E5E0D6] text-[11px] uppercase">
                  <th className="py-3 px-4">Faculty Programme</th>
                  <th className="py-3 px-4">Expected</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Coverage</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Simulated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {dataQuality?.programmeCoverage?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F1E8]/50">
                    <td className="py-3 px-4 font-bold text-[#101C2C]">
                      <span className="text-[#D6AD60] mr-2">{row.code}</span>
                      <span className="font-sans font-medium">{row.programme}</span>
                    </td>
                    <td className="py-3 px-4 text-[#788391]">{row.totalExpectedYears} yrs</td>
                    <td className="py-3 px-4 font-bold text-[#101C2C]">{row.availableYears} yrs</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#23865B]/10 text-[#23865B]">
                        {row.coveragePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#23865B]">{row.verifiedCount}</td>
                    <td className="py-3 px-4 text-[#966b1a]">{row.simulatedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fast Actions & AI Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Research Assistant Widget */}
          <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-5 border border-[#1A2B40] shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#D6AD60] text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Research Assistant</span>
            </div>
            <h4 className="font-serif font-bold text-base text-white">
              Instant Historical Data Synthesis
            </h4>
            <p className="text-xs text-[#F5F1E8]/75 leading-relaxed">
              Generate structured academic monographs, compare cross-programme CAGR, and audit data anomalies
              powered by Google Gemini.
            </p>
            <div className="pt-2">
              <Link
                to="/ai"
                className="w-full py-2.5 px-3 rounded-lg bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3 text-xs font-mono">
            <h4 className="font-serif font-bold text-sm text-[#101C2C]">
              Quick Administrative Actions
            </h4>
            <div className="space-y-2">
              <Link to="/fees" className="block p-2.5 rounded-lg bg-[#F5F1E8] hover:bg-[#ece6d9] text-[#101C2C] font-semibold transition-colors">
                → Browse All Fee Records (400+)
              </Link>
              <Link to="/inflation" className="block p-2.5 rounded-lg bg-[#F5F1E8] hover:bg-[#ece6d9] text-[#101C2C] font-semibold transition-colors">
                → Manage PBS CPI Series (1987–2026)
              </Link>
              <Link to="/research" className="block p-2.5 rounded-lg bg-[#F5F1E8] hover:bg-[#ece6d9] text-[#101C2C] font-semibold transition-colors">
                → Edit Karachi Philanthropy Monographs
              </Link>
              <Link to="/audit" className="block p-2.5 rounded-lg bg-[#F5F1E8] hover:bg-[#ece6d9] text-[#101C2C] font-semibold transition-colors">
                → View Security Audit Log Trail
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
