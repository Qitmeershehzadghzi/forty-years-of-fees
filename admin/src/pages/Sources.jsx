import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  Calendar,
  Search,
  X,
  FileText
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getSources,
  createSource,
  updateSource,
  deleteSource
} from '../services/sourceService.js';

export const Sources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    publicationYear: 2027,
    documentType: 'Prospectus',
    documentUrl: '',
    pageNumber: '',
    description: '',
    verificationStatus: 'VERIFIED',
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await getSources({ search: search || undefined });
      setSources(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingSource(null);
    setFormData({
      title: '',
      institution: 'Greenwich University Karachi',
      publicationYear: 2027,
      documentType: 'Prospectus',
      documentUrl: '',
      pageNumber: '',
      description: '',
      verificationStatus: 'VERIFIED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (src) => {
    setEditingSource(src);
    setFormData({
      title: src.title,
      institution: src.institution,
      publicationYear: src.publicationYear,
      documentType: src.documentType,
      documentUrl: src.documentUrl || '',
      pageNumber: src.pageNumber || '',
      description: src.description || '',
      verificationStatus: src.verificationStatus,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        publicationYear: Number(formData.publicationYear),
        pageNumber: formData.pageNumber ? Number(formData.pageNumber) : undefined,
      };
      if (editingSource) {
        await updateSource(editingSource._id, payload);
      } else {
        await createSource(payload);
      }
      setIsModalOpen(false);
      fetchSources();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSource(deleteTarget._id);
      setDeleteTarget(null);
      fetchSources();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Archival Gazette Provenance
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            Bibliographic Sources & Citations
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Archival Source</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search documents by title or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-9 py-2 text-xs text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60] font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#101C2C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className="text-xs font-mono text-[#64748B]">
          {sources.length} Documents Registered
        </span>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs font-mono text-[#64748B]">
          Loading bibliographic sources...
        </div>
      ) : sources.length === 0 ? (
        <div className="p-16 text-center text-xs font-mono text-[#64748B] bg-white rounded-2xl border border-[#E5E0D6]">
          No documents match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sources.map((s) => (
            <div
              key={s._id}
              className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#D6AD60]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1]">
                    {s.documentType}
                  </span>
                  <StatusBadge status={s.verificationStatus} size="xs" />
                </div>
                
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#101C2C] leading-snug">
                  {s.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
                  <Building2 className="w-3.5 h-3.5 text-[#D6AD60]" />
                  <span>{s.institution}</span>
                </div>
                
                {s.description && (
                  <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">
                  Published: {s.publicationYear} {s.pageNumber ? `· Pg ${s.pageNumber}` : ''}
                </span>
                
                <div className="flex items-center gap-2">
                  {s.documentUrl && (
                    <a
                      href={s.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#966B1A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                      title="Inspect Document Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-[#2563EB] hover:bg-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
                    title="Edit Source"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                    title="Delete Source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT SOURCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E5E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                {editingSource ? 'Edit Archival Source' : 'Register Archival Source'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#101C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PBS Monthly Statistical Bulletin"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Authoring Institution</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Pakistan Bureau of Statistics"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Document Type</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                  >
                    <option value="Prospectus">Prospectus</option>
                    <option value="PBS Statistical Bulletin">PBS Statistical Bulletin</option>
                    <option value="Official Gazette">Official Gazette</option>
                    <option value="Financial Report">Financial Report</option>
                    <option value="Charitable Trust Record">Charitable Trust Record</option>
                    <option value="Simulated Benchmark Model">Simulated Benchmark Model</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Publication Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Page Number (Optional)</label>
                  <input
                    type="number"
                    value={formData.pageNumber}
                    onChange={(e) => setFormData({ ...formData, pageNumber: e.target.value })}
                    placeholder="e.g. 14"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Document URL / Archive Reference</label>
                <input
                  type="url"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Verification Classification</label>
                <select
                  value={formData.verificationStatus}
                  onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                >
                  <option value="VERIFIED">VERIFIED (Authentic Official Publication)</option>
                  <option value="SIMULATED">SIMULATED (Illustrative Academic Model)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40] shadow-sm cursor-pointer"
                >
                  Save Source Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Archival Source"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? Any linked fee records will lose their primary bibliographic reference.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default Sources;
