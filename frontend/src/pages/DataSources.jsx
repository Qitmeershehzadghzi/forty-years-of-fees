import React, { useEffect, useState, useMemo } from 'react';
import { Search, X, Building2, ExternalLink, Landmark, BookOpen, ShieldCheck } from 'lucide-react';
import DataBadge from '../components/common/DataBadge.jsx';
import Loading from '../components/common/Loading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

import { getSources } from '../services/researchService.js';

const ANCHORS = [
  {
    icon: Landmark,
    title: 'Pakistan Bureau of Statistics',
    text: 'Source of the monthly CPI bulletins used to build the deflator series.',
  },
  {
    icon: BookOpen,
    title: 'University prospectuses',
    text: 'Published fee schedules and academic catalogues from the Clifton campus.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust and endowment records',
    text: 'Registered charitable trusts that fund tuition and scholarships in Karachi.',
  },
];

export const DataSources = () => {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
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

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q ||
        s.title?.toLowerCase().includes(q) ||
        s.institution?.toLowerCase().includes(q) ||
        s.documentType?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q);
      const matchesType = !docTypeFilter || s.documentType === docTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [sources, search, docTypeFilter]);

  const uniqueDocTypes = useMemo(() => {
    return Array.from(new Set(sources.map(s => s.documentType).filter(Boolean)));
  }, [sources]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-7">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          Sources and archives
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          Where the numbers come from
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C6B66] leading-relaxed max-w-2xl">
          The project draws on official statistical bulletins, university prospectuses and
          registered trust records. Each entry below records what it is and who published it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ANCHORS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-[#E2E7E2] bg-white p-4">
            <Icon className="w-4 h-4 text-[#0F5C4E] mb-2" />
            <h2 className="text-sm font-semibold text-[#12231F]">{title}</h2>
            <p className="mt-1 text-xs text-[#5C6B66] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <label className="relative block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8A9A94]" />
          <input
            type="text"
            placeholder="Search a title, institution or document type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#E2E7E2] bg-white pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-[#8A9A94] hover:text-[#12231F]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </label>

        {uniqueDocTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDocTypeFilter('')}
              className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                !docTypeFilter
                  ? 'border-[#0F5C4E] bg-[#EDF5F2] text-[#0F5C4E] font-semibold'
                  : 'border-[#E2E7E2] bg-white text-[#5C6B66] hover:bg-[#F6F7F4]'
              }`}
            >
              All ({sources.length})
            </button>
            {uniqueDocTypes.map(t => (
              <button
                key={t}
                onClick={() => setDocTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                  docTypeFilter === t
                    ? 'border-[#0F5C4E] bg-[#EDF5F2] text-[#0F5C4E] font-semibold'
                    : 'border-[#E2E7E2] bg-white text-[#5C6B66] hover:bg-[#F6F7F4]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16"><Loading text="Loading sources..." /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No sources match"
          description="Try clearing the search or the document type filter."
          actionText="Clear filters"
          onAction={() => { setSearch(''); setDocTypeFilter(''); }}
        />
      ) : (
        <div className="divide-y divide-[#E2E7E2] border border-[#E2E7E2] rounded-xl bg-white overflow-hidden">
          {filtered.map(src => (
            <article key={src._id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-[#12231F] max-w-2xl">{src.title}</h2>
                <DataBadge status={src.verificationStatus} size="xs" />
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C6B66]">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {src.institution}
                </span>
                <span>{src.documentType || 'Document'}</span>
                <span>{src.publicationYear}</span>
                {src.pageNumber && <span>p. {src.pageNumber}</span>}
              </div>

              {src.description && (
                <p className="mt-2 text-sm text-[#5C6B66] leading-relaxed">{src.description}</p>
              )}

              {src.documentUrl && (
                <a
                  href={src.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0F5C4E] hover:underline"
                >
                  View document
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-[#5C6B66] leading-relaxed">
        CPI figures reference the Pakistan Bureau of Statistics series with 2015-16 as the base
        (2016 = 100). Historical years before that base are linked geometrically. The fee series
        itself is illustrative, not an official university ledger.
      </p>

    </div>
  );
};

export default DataSources;
