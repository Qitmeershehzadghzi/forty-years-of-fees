import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
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
    year: 2026,
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
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.programmeId || !formData.siteId || !formData.amount) {
      setError('Programme, Campus Site, and Amount are required.');
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
      setError(err.message || 'Failed to create fee record. Duplicate entry ممکن ہے۔');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Archival Entry</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Add Historical Fee Record
          </h2>
        </div>
        <Link
          to="/fees"
          className="px-3.5 py-1.5 rounded-lg border border-[#E5E0D6] text-xs font-mono text-[#788391] hover:text-[#101C2C] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Records</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-[#C75A5A]/10 border border-[#C75A5A]/30 rounded-lg text-xs font-mono text-[#C75A5A]">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-5 text-xs font-mono">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Programme</label>
            <select
              required
              value={formData.programmeId}
              onChange={(e) => setFormData({ ...formData, programmeId: e.target.value })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            >
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Campus Site</label>
            <select
              required
              value={formData.siteId}
              onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            >
              {sites.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Academic Year</label>
            <input
              type="number"
              min="1987"
              max="2026"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            />
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Fee Category</label>
            <select
              value={formData.feeType}
              onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            >
              <option value="Total Annual Fee">Total Annual Fee</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Examination Fee">Examination Fee</option>
              <option value="Registration Fee">Registration Fee</option>
              <option value="Other Charges">Other Charges</option>
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Amount (PKR)</label>
            <input
              type="number"
              min="0"
              required
              placeholder="e.g. 185000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C] font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Data Classification</label>
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
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            >
              <option value="SIMULATED">SIMULATED (Econometric Benchmark)</option>
              <option value="VERIFIED">VERIFIED (Archival Physical Record)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1 font-semibold">Source Reference Document</label>
            <select
              value={formData.sourceId}
              onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
            >
              <option value="">None / Internal Audit</option>
              {sources.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title} ({s.publicationYear})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#788391] uppercase mb-1 font-semibold">Evidence / Audit Notes</label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Details on fee prospectus page number, council resolution, or simulated seed parameters..."
            className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C] font-sans"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
          <Link
            to="/fees"
            className="px-4 py-2 rounded-lg text-[#788391] hover:bg-[#F5F1E8]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40] transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Writing to MongoDB...' : 'Save Historical Fee Record'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddFeeRecord;
