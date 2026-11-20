import React from 'react';
import {
  Server,
  Database,
  RefreshCw,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  FileCode,
  HardDrive,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-[#E5E0D6]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#101C2C] text-[#D6AD60] border border-[#D6AD60]/30">
            <Server className="w-3 h-3 text-[#D6AD60]" />
            Cluster & Stack Health
          </span>
          <span className="text-xs font-mono text-[#788391]">Production Environment</span>
        </div>
        <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
          Platform Configuration & Infrastructure Health
        </h1>
        <p className="text-xs text-[#788391] mt-1 font-sans max-w-2xl">
          Technical specifications, MongoDB Atlas cluster state, AI model connectivity, and database seeding procedures powering Forty Years of Fees (Journey 40).
        </p>
      </div>

      {/* Primary Tech Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        
        {/* Backend & API Stack */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-[#426B70]" />
              <h2 className="font-bold text-sm text-[#101C2C] font-serif">Backend Environment</h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#23865B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse"></span>
              Operational
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">REST API Base URL</span>
              <span className="font-bold text-[#101C2C]">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Runtime Framework</span>
              <span className="font-bold text-[#101C2C]">Node.js v20+ / Express 5</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Econometric AI Engine</span>
              <span className="font-bold text-[#23865B]">Google Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Inflation Deflator Baseline</span>
              <span className="font-bold text-[#101C2C]">PBS CPI 2015-16 = 100.0</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#788391]">Archival Investigation Scope</span>
              <span className="font-bold text-[#D6AD60]">1987 — 2027 (40-Year Horizon)</span>
            </div>
          </div>
        </div>

        {/* Database & Security Cluster */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#D6AD60]" />
              <h2 className="font-bold text-sm text-[#101C2C] font-serif">MongoDB Atlas Cluster</h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#23865B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#23865B]"></span>
              Cluster0 Connected
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Cluster Service Provider</span>
              <span className="font-bold text-[#23865B]">MongoDB Atlas M0/Shared</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Target Database Name</span>
              <span className="font-bold text-[#101C2C]">forty_years_of_fees</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Token Sign-off Protocol</span>
              <span className="font-bold text-[#101C2C]">JWT HS256 (7-Day Expiry)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Active Session Operator</span>
              <span className="font-bold text-[#D6AD60]">{user?.role?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#788391]">Operator Email</span>
              <span className="font-bold text-[#101C2C]">{user?.email || 'admin@greenwich.edu.pk'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* CLI & Maintenance Instructions */}
      <div className="bg-[#101C2C] text-[#F5F1E8] rounded-2xl p-6 sm:p-8 border border-[#1A2B40] space-y-5 shadow-md">
        <div className="flex items-center gap-2.5 text-[#D6AD60] font-mono font-bold text-sm">
          <Terminal className="w-4 h-4" />
          <span>Idempotent Database Reseeding Procedure</span>
        </div>

        <p className="text-xs text-[#F5F1E8]/80 leading-relaxed font-sans max-w-2xl">
          The Journey 40 database seeder parses 40 years of composite tuition schedules across Greenwich University undergraduate and postgraduate programmes, alongside Pakistan Bureau of Statistics CPI indices. Run this script in the root directory to populate or refresh benchmark data without disturbing physical archival ledger entries:
        </p>

        <div className="bg-[#0A121D] border border-white/10 rounded-xl p-4 font-mono text-xs flex items-center justify-between gap-4">
          <code className="text-[#D6AD60]">
            cd "d:\saylani work\forty-years-of-fees\backend" && npm run seed
          </code>
          <span className="text-[10px] text-[#788391] uppercase tracking-wider shrink-0">Node CLI</span>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-[#F5F1E8]/60">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#23865B]" />
            <span>Non-destructive upsert logic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#23865B]" />
            <span>Preserves verified archival records</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#23865B]" />
            <span>Aligns with PBS 2015-16 CPI index series</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
