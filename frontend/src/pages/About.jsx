import React from 'react';
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Button from '../components/common/Button.jsx';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HEADER */}
      <div>
        <SectionHeading
          badge="Institutional Monograph"
          title="About Forty Years of Fees & Journey 40"
          subtitle="Documenting four decades of higher education history, institutional governance, and financial dynamics at Greenwich University, Karachi."
        />
      </div>

      {/* HERO STORY */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D6AD60]">
            The Journey 40 Initiative (1987–2026)
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#101C2C]">
            Four Decades of Higher Education Leadership in Karachi
          </h3>
          <p className="text-sm text-[#788391] leading-relaxed">
            Established in 1987 in Karachi's coastal Clifton quarter, Greenwich University has spent four decades
            educating thousands of leaders in business management, computing technologies, software engineering,
            social sciences, and media communications.
          </p>
          <p className="text-sm text-[#788391] leading-relaxed">
            As part of the university's landmark 40th anniversary celebration—termed <strong>Journey 40</strong>—the
            institution commissioned this research analytics platform to answer a vital retrospective question:
            <em className="text-[#101C2C] font-serif block my-2 text-base">
              "How have the true economic costs of tertiary education evolved across four turbulent decades of inflation,
              currency devaluation, and metropolitan expansion?"
            </em>
          </p>
        </div>

        {/* THREE CORE RESEARCH OBJECTIVES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E5E0D6]">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#F5F1E8] text-[#D6AD60] flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h4 className="font-serif font-bold text-base text-[#101C2C]">
              Econometric Deflation
            </h4>
            <p className="text-xs text-[#788391] leading-relaxed">
              Moving beyond superficial nominal rupee amounts by calculating constant-currency purchasing power
              against national CPI benchmarks.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#F5F1E8] text-[#D6AD60] flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h4 className="font-serif font-bold text-base text-[#101C2C]">
              Cross-Disciplinary Tracking
            </h4>
            <p className="text-xs text-[#788391] leading-relaxed">
              Analyzing how emerging disciplines like Computer Science and Software Engineering experienced
              different capital and tuition trajectories than traditional faculties.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#F5F1E8] text-[#D6AD60] flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h4 className="font-serif font-bold text-base text-[#101C2C]">
              Philanthropic Safeguards
            </h4>
            <p className="text-xs text-[#788391] leading-relaxed">
              Highlighting the crucial role played by Zakat, Islamic Waqf, Church Education Boards,
              and Temple Trusts in maintaining higher education access in Karachi.
            </p>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL CAMPUS PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-8 border border-[#1A2B40] space-y-4">
          <Building2 className="w-8 h-8 text-[#D6AD60]" />
          <h4 className="font-serif font-bold text-xl text-white">
            Main Campus: Clifton Block 1
          </h4>
          <p className="text-xs sm:text-sm text-[#F5F1E8]/80 leading-relaxed">
            Located at DK-10, 38th Street, Darakshan, Phase VI, DHA / Clifton Block 1, Karachi.
            The Clifton campus has housed Greenwich University's core faculties, academic libraries,
            computing research labs, and executive development centers since the late 1980s.
          </p>
          <div className="pt-2 text-xs font-mono text-[#D6AD60]">
            Chartered by the Government of Sindh · Recognized by HEC Pakistan
          </div>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-8 shadow-sm space-y-4">
          <ShieldCheck className="w-8 h-8 text-[#23865B]" />
          <h4 className="font-serif font-bold text-xl text-[#101C2C]">
            Archival Preservation Commitment
          </h4>
          <p className="text-xs sm:text-sm text-[#788391] leading-relaxed">
            This digital platform serves as a living institutional repository. Alumni and former faculty members
            possessing historical prospectuses, fee receipts, or semester registers from 1987 to 2026 are encouraged
            to contact the Journey 40 archivist to verify and replace simulated benchmark figures.
          </p>
          <Button to="/sources" variant="outline" size="sm" icon={ArrowRight}>
            Inspect Current Sources
          </Button>
        </div>
      </div>

    </div>
  );
};

export default About;
