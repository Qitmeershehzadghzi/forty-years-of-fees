import React from 'react';
import {
  Scale,
  Calculator,
  Database,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';

export const Methodology = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HEADER */}
      <div>
        <SectionHeading
          badge="Econometric Framework"
          title="Research & Analytical Methodology"
          subtitle="Detailed documentation of mathematical formulas, synthetic dataset modeling, CPI rebasing, and verification protocols."
        />
      </div>

      {/* CORE FORMULA SHOWCASE */}
      <div className="bg-[#101C2C] text-[#F5F1E8] rounded-2xl p-8 sm:p-10 border border-[#D6AD60]/40 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-[#D6AD60] font-mono text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Core Inflation Deflator Equation</span>
        </div>

        <div className="bg-[#1A2B40] rounded-xl p-6 border border-[#D6AD60]/20 font-mono text-center sm:text-left space-y-3">
          <div className="text-lg sm:text-2xl font-bold text-[#D6AD60]">
            Real Fee (Base Year) = Historical Fee × (CPI Base Year / CPI Historical Year)
          </div>
          <p className="text-xs text-[#F5F1E8]/70 font-sans">
            Where <strong>Historical Fee</strong> is the nominal rupee amount recorded in that year, 
            <strong>CPI Historical Year</strong> is the national Consumer Price Index for that year, and 
            <strong>CPI Base Year</strong> is the index value of the selected benchmark year (e.g. 2016 = 100.0 or 2026).
          </p>
        </div>

        {/* Worked Numerical Example */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-[#788391] block">Historical Point (1987)</span>
            <span className="text-sm font-bold text-white block mt-1">Nominal Fee: Rs. 5,000</span>
            <span className="text-[#D6AD60] text-[11px] block mt-0.5">1987 CPI: 10.45</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-[#788391] block">Target Base Year (2026)</span>
            <span className="text-sm font-bold text-white block mt-1">2026 CPI: 370.64</span>
            <span className="text-[#D6AD60] text-[11px] block mt-0.5">Deflator Ratio: 35.46×</span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-[#788391] block">Real Purchasing Equivalent</span>
            <span className="text-sm font-bold text-[#D6AD60] block mt-1">Real Fee: Rs. 177,340</span>
            <span className="text-white/70 text-[11px] block mt-0.5">5,000 × (370.64 / 10.45)</span>
          </div>
        </div>
      </div>

      {/* METHODOLOGICAL PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Synthetic Dataset Generation */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#101C2C] font-serif font-bold text-lg">
            <Database className="w-5 h-5 text-[#D6AD60]" />
            <h3>1. Synthetic Dataset Modeling</h3>
          </div>
          <p className="text-xs text-[#788391] leading-relaxed">
            Because continuous historical accounting books covering 1987 to 2026 are not available
            in unified digital form, the Journey 40 initiative generates an initial deterministic synthetic
            dataset for all 10 academic programmes (400 annual tuition records + components).
          </p>
          <ul className="text-xs text-[#101C2C] space-y-1.5 list-disc list-inside">
            <li>Anchored to plausible 1987 starting values (Rs. 4,500 to Rs. 8,000)</li>
            <li>Programme-specific annual growth curves reflecting technology laboratory costs</li>
            <li>Deterministic seeded pseudorandom variations to ensure reproducible datasets</li>
            <li>All synthetic rows explicitly tagged with <span className="font-mono text-[#966b1a]">SIMULATED</span> metadata</li>
          </ul>
        </div>

        {/* CPI Selection & Base Year */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#101C2C] font-serif font-bold text-lg">
            <Scale className="w-5 h-5 text-[#D6AD60]" />
            <h3>2. CPI Selection & Statistical Rebasing</h3>
          </div>
          <p className="text-xs text-[#788391] leading-relaxed">
            Inflation adjustments utilize the Pakistan Bureau of Statistics (PBS) Consumer Price Index (CPI)
            series. Pakistan's official statistical series underwent periodic base-year revisions (1980-81, 1990-91,
            2000-01, 2007-08, and 2015-16).
          </p>
          <ul className="text-xs text-[#101C2C] space-y-1.5 list-disc list-inside">
            <li>Standardized against the 2015-16 base year (2016 = 100.0)</li>
            <li>Spliced backward to 1987 to create a continuous purchasing-power index</li>
            <li>Accounts for structural inflation spikes in 1994-1996, 2008-2010, and 2022-2024</li>
            <li>Allows visitors to dynamically toggle any base year between 1987 and 2026</li>
          </ul>
        </div>

        {/* Compound Annual Growth Rate */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#101C2C] font-serif font-bold text-lg">
            <Calculator className="w-5 h-5 text-[#D6AD60]" />
            <h3>3. Compound Annual Growth Rate (CAGR)</h3>
          </div>
          <p className="text-xs text-[#788391] leading-relaxed">
            To compare programmes across decades with different inception points and rates,
            we compute Compound Annual Growth Rate:
          </p>
          <div className="p-3 bg-[#F5F1E8] rounded-lg font-mono text-xs text-[#101C2C]">
            CAGR = ((Final Fee / Initial Fee) ^ (1 / Number of Years) - 1) × 100
          </div>
          <p className="text-xs text-[#788391] leading-relaxed">
            CAGR smooths annual fee fluctuations, isolating the sustained annual rate of nominal
            and real tuition expansion.
          </p>
        </div>

        {/* Archival Replacement Workflow */}
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#101C2C] font-serif font-bold text-lg">
            <RefreshCw className="w-5 h-5 text-[#23865B]" />
            <h3>4. In-Place Archival Verification</h3>
          </div>
          <p className="text-xs text-[#788391] leading-relaxed">
            The platform architecture allows verified historical receipts, fee books, and academic council minutes
            to be imported into MongoDB through the Admin Panel.
          </p>
          <ul className="text-xs text-[#101C2C] space-y-1.5 list-disc list-inside">
            <li>Verified records supersede simulated estimates in all charts and API endpoints</li>
            <li>Bulk CSV import validates data rows against duplicate entries and invalid ranges</li>
            <li>Audit logs track all modifications, ensuring research provenance</li>
            <li>System recalculates deflators dynamically without changing database schemas</li>
          </ul>
        </div>

      </div>

      {/* RESEARCH LIMITATIONS & ETHICAL NOTICE */}
      <div className="p-6 bg-[#F5F1E8] border border-[#E5E0D6] rounded-xl text-xs text-[#788391] space-y-2">
        <div className="flex items-center gap-2 text-[#101C2C] font-serif font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-[#D6AD60]" />
          <span>Research Scope & Empirical Limitations</span>
        </div>
        <p>
          The financial metrics displayed on this platform are produced for educational analysis,
          economic research methodology demonstration, and archival preservation. The simulated values
          must not be cited as binding legal records of Greenwich University. Researchers and journalists
          requiring official fee schedules must consult the Registrar’s Office and officially published gazettes.
        </p>
      </div>

    </div>
  );
};

export default Methodology;
