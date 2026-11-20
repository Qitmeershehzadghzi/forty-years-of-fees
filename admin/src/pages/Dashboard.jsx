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
  ShieldCheck,
  Calendar,
  Layers,
  Activity,
  Plus
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

  const totalRecords = Number(overview?.totalRecords) || 400;
  const verifiedRecords = Number(overview?.verifiedRecords) || 0;
  const verifiedPercent = totalRecords > 0 ? Math.round((verifiedRecords / totalRecords) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Greenwich University Karachi · Journey 40 (1987–2027)
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#101C2C] mt-1">
            Administrative Research Command Center
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/fees/new"
            className="px-4 py-2 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#D6AD60]" />
            <span>+ Add Fee Record</span>
          </Link>
          <Link
            to="/import"
            className="px-4 py-2 rounded-xl bg-[#D6AD60] text-[#101C2C] hover:bg-[#C49B4C] text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Programmes */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-mono uppercase">Faculties</span>
            <BookOpen className="w-4 h-4 text-[#D6AD60]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#101C2C]">
            {overview?.totalProgrammes ?? '10'}
          </div>
          <div className="text-[10px] text-[#23865B] font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#23865B]" />
            <span>100% Active Span</span>
          </div>
        </div>

        {/* Total Fee Records */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-mono uppercase">Fee Records</span>
            <Receipt className="w-4 h-4 text-[#101C2C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#101C2C]">
            {overview?.totalRecords ?? '400+'}
          </div>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            Annual & Component
          </span>
        </div>

        {/* Verified Records */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#23865B] mb-2">
            <span className="text-[11px] font-mono uppercase">Verified</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#23865B]">
            {overview?.verifiedRecords ?? '0'}
          </div>
          <span className="text-[10px] text-[#23865B] font-mono mt-1 block">
            Gazette Certified
          </span>
        </div>

        {/* Simulated Models */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#966B1A] mb-2">
            <span className="text-[11px] font-mono uppercase">Simulated</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#966B1A]">
            {overview?.simulatedRecords ?? '400+'}
          </div>
          <span className="text-[10px] text-[#D6AD60] font-mono mt-1 block">
            Benchmark Model
          </span>
        </div>

        {/* Available CPI Records */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-mono uppercase">CPI Series</span>
            <TrendingUp className="w-4 h-4 text-[#D6AD60]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#101C2C]">
            {overview?.cpiRecords ?? '40'}
          </div>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            1987–2027 Coverage
          </span>
        </div>

        {/* Document Sources */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-mono uppercase">Sources</span>
            <Database className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#101C2C]">
            {overview?.totalSources ?? '4'}
          </div>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            Gazette Citations
          </span>
        </div>

      </div>

      {/* Verification Status Gauge Bar */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#23865B]" />
            <span className="font-bold text-[#101C2C] uppercase">
              Archival Authentication Progress Ratio
            </span>
          </div>
          <span className="font-bold text-[#23865B]">
            {verifiedRecords} Verified / {totalRecords} Records ({verifiedPercent}%)
          </span>
        </div>

        {/* Dual Progress Bar */}
        <div className="w-full h-3 bg-[#F8FAFC] rounded-full overflow-hidden flex border border-[#E2E8F0]">
          <div
            className="h-full bg-[#23865B] transition-all duration-500"
            style={{ width: `${Math.max(verifiedPercent, 1)}%` }}
            title={`Verified: ${verifiedRecords} records`}
          />
          <div
            className="h-full bg-[#D6AD60]/40 transition-all duration-500"
            style={{ width: `${100 - verifiedPercent}%` }}
            title={`Simulated: ${totalRecords - verifiedRecords} records`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#23865B]" />
            <span>Authenticated Gazette Receipts ({verifiedPercent}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6AD60]" />
            <span>Simulated Econometric Baseline ({100 - verifiedPercent}%)</span>
          </span>
        </div>
      </div>

      {/* Main Two-Column Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Faculty Coverage Matrix */}
        <div className="lg:col-span-8 bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between bg-[#101C2C] text-[#F8FAFC] gap-2">
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Faculty 40-Year Data Coverage Matrix (1987–2027)
              </h3>
              <p className="text-xs text-[#D6AD60] font-mono">
                Continuous academic cycle verification and simulated vs verified distribution
              </p>
            </div>
            <Link
              to="/import"
              className="text-xs font-mono text-[#D6AD60] hover:underline flex items-center gap-1"
            >
              <span>Bulk Ingestion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E0D6] text-[11px] uppercase">
                  <th className="py-3.5 px-4 font-semibold">Faculty / Discipline</th>
                  <th className="py-3.5 px-4 font-semibold">Expected</th>
                  <th className="py-3.5 px-4 font-semibold">Available</th>
                  <th className="py-3.5 px-4 font-semibold">Coverage</th>
                  <th className="py-3.5 px-4 font-semibold text-[#23865B]">Verified</th>
                  <th className="py-3.5 px-4 font-semibold text-[#966B1A]">Simulated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {dataQuality?.programmeCoverage?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#101C2C]">
                      <span className="text-[#966B1A] mr-2 px-1.5 py-0.5 rounded bg-[#D6AD60]/10 border border-[#D6AD60]/20 text-[11px]">
                        {row.code}
                      </span>
                      <span className="font-sans font-medium">{row.programme}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{row.totalExpectedYears} yrs</td>
                    <td className="py-3.5 px-4 font-bold text-[#101C2C]">{row.availableYears} yrs</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20">
                        {row.coveragePercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#23865B]">{row.verifiedCount}</td>
                    <td className="py-3.5 px-4 font-medium text-[#966B1A]">{row.simulatedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Assistant Widget & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Research Assistant Widget */}
          <div className="bg-[#101C2C] text-[#F8FAFC] rounded-2xl p-6 border border-[#1A2B40] shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#D6AD60] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Research Assistant</span>
            </div>
            
            <h4 className="font-serif font-bold text-lg text-white">
              Instant Historical Data Synthesis
            </h4>
            
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
              Perform autonomous statistical reasoning over 40 years of records: CAGR rankings, inflation adjustments, and executive monograph drafting.
            </p>
            
            <div className="pt-2">
              <Link
                to="/ai"
                className="w-full py-2.5 px-4 rounded-xl bg-[#D6AD60] text-[#101C2C] hover:bg-[#C49B4C] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Launch Assistant Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Administrative Shortcuts */}
          <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-4 text-xs font-mono">
            <h4 className="font-serif font-bold text-base text-[#101C2C]">
              Operational Shortcuts
            </h4>
            
            <div className="space-y-2 font-mono">
              <Link
                to="/fees"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#101C2C] font-semibold transition-colors border border-[#E2E8F0]"
              >
                <span>Browse All Fee Records (400+)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </Link>
              
              <Link
                to="/inflation"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#101C2C] font-semibold transition-colors border border-[#E2E8F0]"
              >
                <span>Manage PBS CPI Series</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </Link>
              
              <Link
                to="/research"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#101C2C] font-semibold transition-colors border border-[#E2E8F0]"
              >
                <span>Edit Research Monographs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </Link>
              
              <Link
                to="/audit"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#101C2C] font-semibold transition-colors border border-[#E2E8F0]"
              >
                <span>View Security Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
