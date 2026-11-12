import React, { useEffect, useState } from 'react';
import { History, ShieldCheck, Filter, User } from 'lucide-react';
import { getAuditLogs } from '../services/adminOperations.js';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 30 };
      if (actionFilter) params.action = actionFilter;
      const res = await getAuditLogs(params);
      setLogs(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, page]);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D6] pb-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Security & Provenance</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Immutable Security Audit Trail
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="bg-white border border-[#E5E0D6] rounded-lg px-3 py-2 text-[#101C2C]"
          >
            <option value="">All Audit Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="IMPORT">IMPORT</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading security audit history...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#788391]">
            No audit events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#F5F1E8]/50">
                    <td className="py-3 px-4 text-[#788391] text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        log.action === 'CREATE' ? 'bg-[#23865B]/10 text-[#23865B]' :
                        log.action === 'UPDATE' ? 'bg-[#D6AD60]/15 text-[#966b1a]' :
                        log.action === 'DELETE' ? 'bg-[#C75A5A]/10 text-[#C75A5A]' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#101C2C]">
                      {log.entity}
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px]">
                      {log.entityId}
                    </td>
                    <td className="py-3 px-4 text-[#101C2C]">
                      {log.performedBy?.name || 'System Initializer'}
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="p-3 bg-[#F5F1E8] border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
            <span className="text-[#788391]">
              Page {meta.page} of {meta.totalPages} ({meta.total} events recorded)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPrev}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded bg-white border border-[#E5E0D6] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={!meta.hasNext}
                onClick={() => setPage(p => p + 1)}
                className="px-2.5 py-1 rounded bg-white border border-[#E5E0D6] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AuditLogs;
