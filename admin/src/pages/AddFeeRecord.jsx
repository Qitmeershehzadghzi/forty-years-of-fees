import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  ArrowLeft,
  ShieldAlert,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  Banknote,
  FileText,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { createFee } from '../services/feeService.js';
import { getProgrammes } from '../services/programmeService.js';
import { getSites } from '../services/siteService.js';
import { getSources } from '../services/sourceService.js';

export const AddFeeRecord = () => {
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState([]);
  const [sites, setSites] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    programmeId: '',
    siteId: '',
    year: 2027,
    feeType: 'Total Annual Fee',
    amount: '',
    dataType: 'SIMULATED',
    verificationStatus: 'SIMULATED',
    sourceId: '',
    notes: 'Manually logged administrative entry',
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [progs, siteList, srcList] = await Promise.all([
          getProgrammes(),
          getSites(),
          getSources(),
        ]);
        setProgrammes(progs);
        setSites(siteList);
        setSources(srcList.data || []);
        if (progs.length > 0) setFormData(prev => ({ ...prev, programmeId: progs[0]._id }));
        if (siteList.length > 0) setFormData(prev => ({ ...prev, siteId: siteList[0]._id }));
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.programmeId || !formData.siteId || !formData.amount) {
      setError('Programme, Campus Site, and Fee Amount are mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      await createFee({
        ...formData,
        amount: Number(formData.amount),
        year: Number(formData.year),
        sourceId: formData.sourceId || undefined,
      });
      navigate('/fees');
    } catch (err) {
      setError(err.message || 'Failed to create fee record. A record for this programme, year, and site may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProg = programmes.find(p => p._id === formData.programmeId);
  const selectedSite = sites.find(s => s._id === formData.siteId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#D6AD60]/15 text-[#966b1a] border border-[#D6AD60]/30">
              <PlusCircle className="w-3 h-3 text-[#D6AD60]" />
              Archival Cataloguing
            </span>
            <span className="text-xs font-mono text-[#788391]">Audit Verified Ledger</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
            Append Historical Fee Record
          </h1>
          <p className="text-xs text-[#788391] mt-1 font-sans max-w-xl">
            Register a new longitudinal fee entry across Greenwich University faculties (1987–2027) with institutional provenance and source verification.
          </p>
        </div>
        <Link
          to="/fees"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E0D6] text-xs font-mono text-[#101C2C] hover:bg-[#F5F1E8] hover:border-[#D6AD60] transition-all shadow-sm group self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#788391] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Ledger</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[#C75A5A]/10 border border-[#C75A5A]/30 rounded-xl text-xs font-mono text-[#C75A5A] flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Provenance Conflict / Validation Failure</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Archival Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Section 1: Academic Locus */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D6]">
            <GraduationCap className="w-4 h-4 text-[#D6AD60]" />
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#101C2C]">
              1. Academic Locus & Campus Jurisdiction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Degree Programme <span className="text-[#C75A5A]">*</span>
              </label>
              <select
                required
                value={formData.programmeId}
                onChange={(e) => setFormData({ ...formData, programmeId: e.target.value })}
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60] transition-colors"
              >
                {programmes.map((p) => (
                  <option key={p._id} value={p._id}>
                    [{p.code}] {p.name} ({p.faculty || p.degreeLevel})
                  </option>
                ))}
              </select>
              {selectedProg && (
                <p className="text-[11px] font-mono text-[#788391] mt-1.5">
                  Degree Level: <span className="font-semibold text-[#101C2C]">{selectedProg.degreeLevel}</span> · Normal Duration: <span className="font-semibold text-[#101C2C]">{selectedProg.durationYears} Years</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Campus Site <span className="text-[#C75A5A]">*</span>
              </label>
              <select
                required
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60] transition-colors"
              >
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {selectedSite && (
                <p className="text-[11px] font-mono text-[#788391] mt-1.5 truncate">
                  Location: <span className="font-semibold text-[#101C2C]">{selectedSite.address}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Fiscal Specifics */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D6]">
            <Banknote className="w-4 h-4 text-[#D6AD60]" />
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#101C2C]">
              2. Fiscal Valuation & Schedule Type
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Academic Year <span className="text-[#C75A5A]">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#788391] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="1987"
                  max="2027"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#101C2C] font-mono font-bold focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
                />
              </div>
              <p className="text-[10px] font-mono text-[#788391] mt-1">Research Span: 1987 – 2027</p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Fee Classification <span className="text-[#C75A5A]">*</span>
              </label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
              >
                <option value="Total Annual Fee">Total Annual Fee (Composite)</option>
                <option value="Tuition Fee">Tuition Fee (Per Semester/Annum)</option>
                <option value="Admission Fee">Admission Fee (One-Time)</option>
                <option value="Examination Fee">Examination & Assessment Fee</option>
                <option value="Registration Fee">Registration & Matriculation</option>
                <option value="Other Charges">Laboratory & Ancillary Dues</option>
              </select>
              <p className="text-[10px] font-mono text-[#788391] mt-1">Total Annual Fee is standard benchmark</p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Nominal Amount (PKR) <span className="text-[#C75A5A]">*</span>
              </label>
              <div className="relative">
                <span className="text-xs font-mono font-bold text-[#788391] absolute left-3 top-3">₨</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  placeholder="e.g. 185000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#101C2C] font-mono font-bold focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
                />
              </div>
              <p className="text-[10px] font-mono text-[#788391] mt-1">
                {formData.amount ? `Formatted: PKR ${Number(formData.amount).toLocaleString('en-PK')}` : 'Enter numerical amount'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Archival Provenance */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D6]">
            <FileText className="w-4 h-4 text-[#D6AD60]" />
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#101C2C]">
              3. Archival Provenance & Data Confidence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Confidence Classification
              </label>
              <select
                value={formData.dataType}
                onChange={(e) => {
                  const dt = e.target.value;
                  setFormData({
                    ...formData,
                    dataType: dt,
                    verificationStatus: dt === 'VERIFIED' ? 'VERIFIED' : 'SIMULATED',
                  });
                }}
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
              >
                <option value="SIMULATED">SIMULATED — Econometric PBS Polynomial Model</option>
                <option value="VERIFIED">VERIFIED — Physical Archival Prospectus / Ledger</option>
              </select>
              <p className="text-[10px] font-mono text-[#788391] mt-1">
                {formData.dataType === 'VERIFIED' ? 'Audit verified badge will appear on public portals.' : 'Econometric model benchmark indicator will appear.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
                Bibliographic Source Reference
              </label>
              <select
                value={formData.sourceId}
                onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
              >
                <option value="">None / Internal Archival Calculation</option>
                {sources.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} ({s.publicationYear}) [{s.type}]
                  </option>
                ))}
              </select>
              <p className="text-[10px] font-mono text-[#788391] mt-1">
                Attach official prospectus, gazette, or university registrar gazette
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-[#788391] mb-2">
              Archival Notes & Research Justification
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Recorded from Prospectus 2014-15 Page 42, Faculty of Management Sciences Council Resolution #88..."
              className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-sans focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
            />
          </div>
        </div>

        {/* Live Ledger Preview Pill */}
        <div className="p-4 bg-[#101C2C] text-[#F5F1E8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono border border-[#1A2B40]">
          <div className="space-y-1">
            <span className="text-[10px] text-[#D6AD60] uppercase tracking-wider font-bold">Preview Ledger Row</span>
            <p className="font-bold text-white">
              {formData.year} · {selectedProg?.code || 'PROG'} · {formData.feeType}
            </p>
            <p className="text-[11px] text-[#F5F1E8]/70">
              {formData.amount ? `PKR ${Number(formData.amount).toLocaleString('en-PK')}` : 'PKR 0'} · Status: {formData.dataType}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              formData.dataType === 'VERIFIED' ? 'bg-[#23865B]/30 text-[#4EBA87] border border-[#23865B]/50' : 'bg-[#D6AD60]/20 text-[#D6AD60] border border-[#D6AD60]/40'
            }`}>
              {formData.dataType}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
          <Link
            to="/fees"
            className="px-5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs font-mono font-semibold text-[#788391] hover:text-[#101C2C] hover:bg-[#F5F1E8] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D6AD60]" />
            <span>{loading ? 'Committing to MongoDB...' : 'Save Historical Fee Record'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddFeeRecord;
