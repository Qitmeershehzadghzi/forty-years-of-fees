import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  Calendar,
  Search
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
    publicationYear: 2026,
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
      publicationYear: 2026,
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
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Gazette Provenance</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Sources & Archival Citations
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Archival Source</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#788391] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by document title or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg pl-9 pr-3 py-2 text-xs text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
          />
        </div>
        <span className="text-xs font-mono text-[#788391]">
          {sources.length} Documents Indexed
        </span>
      </div>

      {/* SOURCES GRID */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono text-[#788391]">
          Loading sources catalogue...
        </div>
      ) : sources.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#788391]">
          No sources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((s) => (
            <div key={s._id} className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F5F1E8] text-[#788391] border border-[#E5E0D6]">
                    {s.documentType}
                  </span>
                  <StatusBadge status={s.verificationStatus} size="xs" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#101C2C]">
                  {s.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#788391] font-mono">
                  <Building2 className="w-3.5 h-3.5 text-[#D6AD60]" />
                  <span>{s.institution}</span>
                </div>
                {s.description && (
                  <p className="text-xs text-[#788391] leading-relaxed">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
                <span className="text-[#788391]">
                  Year {s.publicationYear} {s.pageNumber ? `· Pg ${s.pageNumber}` : ''}
                </span>
                <div className="flex items-center gap-2">
                  {s.documentUrl && (
                    <a
                      href={s.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#D6AD60] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-[#426B70] hover:bg-[#F5F1E8] rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 text-[#C75A5A] hover:bg-[#C75A5A]/10 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingSource ? 'Edit Archival Source' : 'Add Archival Source'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PBS Monthly Statistical Bulletin"
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Authoring Institution</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Pakistan Bureau of Statistics"
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Document Type</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
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
                  <label className="block text-[#788391] uppercase mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Page Number (Optional)</label>
                  <input
                    type="number"
                    value={formData.pageNumber}
                    onChange={(e) => setFormData({ ...formData, pageNumber: e.target.value })}
                    placeholder="e.g. 14"
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Document URL / PDF Reference</label>
                <input
                  type="url"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Verification Classification</label>
                <select
                  value={formData.verificationStatus}
                  onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                >
                  <option value="VERIFIED">VERIFIED (Authentic Official Publication)</option>
                  <option value="SIMULATED">SIMULATED (Illustrative Academic Model)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-[#788391] hover:bg-[#F5F1E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40]"
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
