import React, { useEffect, useState } from 'react';
import {
  History,
  ShieldCheck,
  Filter,
  User,
  Clock,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Server,
  FileText
} from 'lucide-react';
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
      const params = { page, limit: 25 };
      if (actionFilter) params.action = actionFilter;
      const res = await getAuditLogs(params);
      setLogs(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error('Failed to fetch security audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, page]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#D6AD60]/15 text-[#966b1a] border border-[#D6AD60]/30">
              <History className="w-3 h-3 text-[#D6AD60]" />
              Immutable Provenance
            </span>
            <span className="text-xs font-mono text-[#788391]">Institutional Compliance</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
            Security & Audit Trail
          </h1>
          <p className="text-xs text-[#788391] mt-1 font-sans max-w-xl">
            Cryptographically sealed activity record of administrative actions, CSV ingestion events, fee revisions, and authentication events across Journey 40.
          </p>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-[#788391]" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="bg-white border border-[#E5E0D6] rounded-xl px-3.5 py-2 text-xs font-mono text-[#101C2C] shadow-sm focus:outline-none focus:border-[#D6AD60]"
          >
            <option value="">All Action Types</option>
            <option value="CREATE">CREATE (Record Creation)</option>
            <option value="UPDATE">UPDATE (Ledger Mutation)</option>
            <option value="DELETE">DELETE (Record Removal)</option>
            <option value="IMPORT">IMPORT (Bulk CSV Ingestion)</option>
            <option value="AUTH">AUTH (Operator Login)</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#788391]">Audit Ledger Depth</span>
          <div className="text-2xl font-serif font-bold text-[#101C2C]">{meta?.total || logs.length} Events</div>
          <p className="text-[11px] font-mono text-[#788391]">Append-only MongoDB collection</p>
        </div>
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#788391]">Current Filter</span>
          <div className="text-2xl font-serif font-bold text-[#D6AD60]">{actionFilter || 'Unfiltered'}</div>
          <p className="text-[11px] font-mono text-[#788391]">Displaying page {page} of {meta?.pages || 1}</p>
        </div>
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#788391]">Audit Compliance</span>
          <div className="text-2xl font-serif font-bold text-[#23865B]">SOC-2 Aligned</div>
          <p className="text-[11px] font-mono text-[#788391]">IP address + timestamp attribution</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Retrieving immutable event entries...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <History className="w-8 h-8 text-[#788391] mx-auto opacity-50" />
            <p className="font-mono text-xs text-[#788391]">No audit events matching current criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-4 px-5">Timestamp (PKT)</th>
                  <th className="py-4 px-5">Action</th>
                  <th className="py-4 px-5">Target Entity</th>
                  <th className="py-4 px-5">Entity ID</th>
                  <th className="py-4 px-5">Actor Attribution</th>
                  <th className="py-4 px-5">IP / Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#F5F1E8]/50 transition-colors">
                    <td className="py-4 px-5 text-[#788391] text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-4 px-5 font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        log.action === 'CREATE' ? 'bg-[#23865B]/15 text-[#23865B] border border-[#23865B]/30' :
                        log.action === 'UPDATE' ? 'bg-[#D6AD60]/15 text-[#966b1a] border border-[#D6AD60]/30' :
                        log.action === 'DELETE' ? 'bg-[#C75A5A]/15 text-[#C75A5A] border border-[#C75A5A]/30' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-bold text-[#101C2C]">
                      {log.entity}
                    </td>

                    <td className="py-4 px-5 text-[#788391] text-[11px] font-mono">
                      {log.entityId ? `${log.entityId.slice(0, 10)}...` : 'N/A'}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-xs text-[#101C2C]">
                        <User className="w-3.5 h-3.5 text-[#788391]" />
                        <span>{log.userId?.email || log.userId?.name || (typeof log.userId === 'string' ? log.userId.slice(-6) : 'System')}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-[#788391] text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {meta && meta.pages > 1 && (
          <div className="p-4 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
            <span className="text-[#788391]">
              Showing page {meta.page} of {meta.pages} ({meta.total} records total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E5E0D6] hover:bg-[#F5F1E8] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= meta.pages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-[#E5E0D6] hover:bg-[#F5F1E8] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AuditLogs;
