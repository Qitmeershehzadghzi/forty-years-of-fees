import React from 'react';
import { Settings as SettingsIcon, Server, Database, Key, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-[#E5E0D6] pb-4">
        <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">System Administration</span>
        <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
          Platform Configuration & Health
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        
        {/* Environment Status */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#101C2C]">
            <Server className="w-4 h-4 text-[#426B70]" />
            <h3>Backend Environment</h3>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#E5E0D6]">
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">API Endpoint:</span>
              <span className="font-bold text-[#101C2C]">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">AI Engine:</span>
              <span className="font-bold text-[#23865B]">Google Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Inflation Baseline:</span>
              <span className="font-bold text-[#101C2C]">PBS CPI 2015-16 = 100.0</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#788391]">Research Span:</span>
              <span className="font-bold text-[#D6AD60]">1987 — 2026 (40 Years)</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#101C2C]">
            <Database className="w-4 h-4 text-[#D6AD60]" />
            <h3>MongoDB Cluster Status</h3>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#E5E0D6]">
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Database Service:</span>
              <span className="font-bold text-[#23865B]">MongoDB Atlas Connected</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Database Name:</span>
              <span className="font-bold text-[#101C2C]">forty_years_of_fees</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E5E0D6]">
              <span className="text-[#788391]">Authentication Strategy:</span>
              <span className="font-bold text-[#101C2C]">JWT HS256 (7-Day Expiry)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#788391]">Current Operator:</span>
              <span className="font-bold text-[#D6AD60]">{user?.email} ({user?.role})</span>
            </div>
          </div>
        </div>

      </div>

      {/* RE-SEEDING INSTRUCTIONS */}
      <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-6 border border-[#1A2B40] space-y-3">
        <div className="flex items-center gap-2 text-[#D6AD60] font-mono font-bold text-sm">
          <RefreshCw className="w-4 h-4" />
          <span>Idempotent Database Reseeding Command</span>
        </div>
        <p className="text-xs text-[#F5F1E8]/80 leading-relaxed font-sans">
          To re-run the 400 synthetic fee records and CPI seed without deleting existing verified records:
        </p>
        <div className="p-3 bg-[#1A2B40] rounded-lg font-mono text-xs text-[#D6AD60]">
          npm run seed
        </div>
      </div>

    </div>
  );
};

export default Settings;
