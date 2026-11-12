import React, { useEffect, useState } from 'react';
import {
  FileText,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import DataBadge from '../components/common/DataBadge.jsx';
import Loading from '../components/common/Loading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

import { getSources } from '../services/researchService.js';

export const DataSources = () => {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        setLoading(true);
        const res = await getSources();
        setSources(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  const filtered = sources.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.institution?.toLowerCase().includes(search.toLowerCase()) ||
    s.documentType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <SectionHeading
            badge="Archival Provenance"
            title="Statistical Gazettes & Institutional Sources"
            subtitle="Catalog of verified government publications, university prospectuses, and research monographs grounding the 40-year analysis."
            className="mb-0"
          />
        </div>
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-[#788391] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search source titles, institutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E5E0D6] rounded-lg pl-9 pr-3 py-2 text-xs text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            />
          </div>
        </div>
      </div>

      {/* SOURCES DIRECTORY GRID */}
      {loading ? (
        <div className="py-20">
          <Loading text="Loading research source catalogue..." />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No sources match your search"
          description="Try searching for 'PBS', 'Prospectus', or 'Waqf'."
          actionText="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((src) => (
            <div
              key={src._id}
              className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-[#F5F1E8] border border-[#E5E0D6] text-[#788391]">
                    {src.documentType || 'Official Document'}
                  </span>
                  <DataBadge status={src.verificationStatus} size="xs" />
                </div>

                <h3 className="font-serif font-bold text-base text-[#101C2C] leading-snug">
                  {src.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-[#788391] font-mono">
                  <Building2 className="w-3.5 h-3.5 text-[#D6AD60]" />
                  <span>{src.institution}</span>
                </div>

                {src.description && (
                  <p className="text-xs text-[#788391] leading-relaxed">
                    {src.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
                <span className="text-[#788391]">
                  Published: {src.publicationYear} {src.pageNumber ? `· Page ${src.pageNumber}` : ''}
                </span>
                {src.documentUrl ? (
                  <a
                    href={src.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D6AD60] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Gazette</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#788391] italic">Archival Physical Copy</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PBS CITATION BANNER */}
      <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-6 border border-[#1A2B40] text-xs leading-relaxed space-y-2">
        <strong className="text-[#D6AD60] font-mono text-sm block">
          Primary Deflator Attribution:
        </strong>
        <p className="text-[#F5F1E8]/80">
          Consumer Price Index (CPI) baseline figures are referenced from the official statistical bulletins
          of the <strong>Pakistan Bureau of Statistics (PBS), Ministry of Planning, Development & Special Initiatives</strong>,
          Government of Pakistan (Series 2015-16 = 100.0). Historical data before 2015 are linked via standard econometric chaining.
        </p>
      </div>

    </div>
  );
};

export default DataSources;
