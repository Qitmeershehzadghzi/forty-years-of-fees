import React, { useEffect, useState } from 'react';
import { AlertTriangle, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getFees, exportFeesCSV } from '../services/feeService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR } from '../utils/currencyFormatter.js';
import DataBadge from '../components/common/DataBadge.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

const START_YEAR = 1987;
const END_YEAR = 2027;

const fieldClass = 'w-full rounded-lg border border-[#E2E7E2] bg-white px-3 py-2.5 text-sm text-[#12231F] focus:outline-none focus:border-[#0F5C4E] focus:ring-2 focus:ring-[#0F5C4E]/20';

export default function HistoricalFees() {
  const [programmes, setProgrammes] = useState([]);
  const [programmeId, setProgrammeId] = useState('');
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [dataType, setDataType] = useState('');
  const [startYear, setStartYear] = useState(START_YEAR);
  const [endYear, setEndYear] = useState(END_YEAR);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProgrammes().then(setProgrammes).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const params = { page, limit: 20, startYear, endYear };
    if (programmeId) params.programmeId = programmeId;
    if (feeType) params.feeType = feeType;
    if (dataType) params.dataType = dataType;

    getFees(params)
      .then(res => {
        if (!active) return;
        setRecords(res.data || []);
        setMeta(res.meta || null);
      })
      .catch(err => { if (active) setError(err.message || 'Fee records could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [programmeId, feeType, dataType, startYear, endYear, page]);

  const shown = records.filter(record => {
    const q = search.trim().toLowerCase();
    return !q || [record.programmeId?.code, record.programmeId?.name, record.year, record.feeType]
      .some(value => String(value || '').toLowerCase().includes(q));
  });

  const reset = () => {
    setProgrammeId('');
    setFeeType('Total Annual Fee');
    setDataType('');
    setStartYear(START_YEAR);
    setEndYear(END_YEAR);
    setSearch('');
    setPage(1);
  };

  return (
    <main className="pb-8">

      {/* Header */}
      <section className="bg-white border-b border-[#E2E7E2]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
            Greenwich University · Journey 40
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
            Fee history, 1987–2027
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5C6B66] leading-relaxed">
            Browse illustrative annual fees for every programme and year. Filter by programme,
            fee item or record type, then download the rows you need.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">

        {/* Data notice */}
        <div className="flex gap-3 rounded-xl border border-[#F0E0BC] bg-[#FDF6E7] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" />
          <p className="text-sm text-[#6B5A32] leading-relaxed">
            <span className="font-semibold text-[#12231F]">Dummy figures.</span>{' '}
            These fees are generated for research and teaching. They are not actual Greenwich
            University fee records and should not be used for billing or admission decisions.
          </p>
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-5" aria-label="Fee filters">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#12231F]">Filter records</h2>
            <button
              onClick={reset}
              className="text-xs font-semibold text-[#0F5C4E] hover:underline"
            >
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="text-xs font-medium text-[#5C6B66] lg:col-span-2">
              Programme
              <select
                className={`${fieldClass} mt-1`}
                value={programmeId}
                onChange={e => { setProgrammeId(e.target.value); setPage(1); }}
              >
                <option value="">All programmes</option>
                {programmes.map(p => (
                  <option key={p._id} value={p._id}>{p.code} · {p.name}</option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium text-[#5C6B66]">
              Fee item
              <select
                className={`${fieldClass} mt-1`}
                value={feeType}
                onChange={e => { setFeeType(e.target.value); setPage(1); }}
              >
                <option>Total Annual Fee</option>
                <option>Tuition Fee</option>
                <option>Admission Fee</option>
                <option>Examination Fee</option>
                <option>Registration Fee</option>
                <option>Other Charges</option>
                <option value="">All items</option>
              </select>
            </label>

            <label className="text-xs font-medium text-[#5C6B66]">
              Record type
              <select
                className={`${fieldClass} mt-1`}
                value={dataType}
                onChange={e => { setDataType(e.target.value); setPage(1); }}
              >
                <option value="">All records</option>
                <option value="SIMULATED">Illustrative</option>
                <option value="VERIFIED">Verified</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3 lg:col-span-1">
              <label className="text-xs font-medium text-[#5C6B66]">
                From
                <input
                  className={`${fieldClass} mt-1`}
                  type="number"
                  min={START_YEAR}
                  max={END_YEAR}
                  value={startYear}
                  onChange={e => { setStartYear(Number(e.target.value)); setPage(1); }}
                />
              </label>
              <label className="text-xs font-medium text-[#5C6B66]">
                To
                <input
                  className={`${fieldClass} mt-1`}
                  type="number"
                  min={START_YEAR}
                  max={END_YEAR}
                  value={endYear}
                  onChange={e => { setEndYear(Number(e.target.value)); setPage(1); }}
                />
              </label>
            </div>
          </div>

          <label className="relative mt-3 block sm:max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#8A9A94]" />
            <span className="sr-only">Search this page</span>
            <input
              className={`${fieldClass} pl-9`}
              placeholder="Search this page by programme or year"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-xl border border-[#E2E7E2] bg-white" aria-label="Fee records">
          <div className="flex flex-col gap-3 border-b border-[#E2E7E2] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-[#12231F]">Annual fee records</h2>
              <p className="mt-0.5 text-xs text-[#5C6B66]">
                {meta?.total != null ? meta.total.toLocaleString() : shown.length} matching records
              </p>
            </div>
            <button
              onClick={() => exportFeesCSV({ programmeId, feeType, dataType, startYear, endYear })}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0F5C4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B443A] transition-colors"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>

          {loading ? (
            <div className="py-16"><Loading text="Loading fee records..." /></div>
          ) : error ? (
            <ErrorState message={error} />
          ) : shown.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-medium text-[#12231F]">No matching records</p>
              <p className="mt-1 text-sm text-[#5C6B66]">Try another programme, year range or search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#F6F7F4] text-xs uppercase tracking-wide text-[#5C6B66]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Year</th>
                    <th className="px-5 py-3 font-semibold">Programme</th>
                    <th className="px-5 py-3 font-semibold">Fee item</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount (PKR)</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1EE]">
                  {shown.map(record => (
                    <tr key={record._id} className="hover:bg-[#FAFBFA]">
                      <td className="whitespace-nowrap px-5 py-3.5 font-semibold tabular-nums text-[#12231F]">
                        {record.year}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="mr-2 inline-flex rounded bg-[#EDF5F2] px-1.5 py-0.5 text-[11px] font-semibold text-[#0F5C4E]">
                          {record.programmeId?.code || '—'}
                        </span>
                        <span className="text-[#12231F]">{record.programmeId?.name || 'Programme'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[#5C6B66]">{record.feeType}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums text-[#12231F]">
                        {formatPKR(record.amount)}
                      </td>
                      <td className="px-5 py-3.5"><DataBadge status={record.dataType} size="xs" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta?.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E2E7E2] px-5 py-3.5">
              <span className="text-sm text-[#5C6B66]">Page {meta.page} of {meta.totalPages}</span>
              <div className="flex gap-2">
                <button
                  aria-label="Previous page"
                  disabled={!meta.hasPrev}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[#E2E7E2] text-[#12231F] hover:bg-[#F6F7F4] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next page"
                  disabled={!meta.hasNext}
                  onClick={() => setPage(p => p + 1)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[#E2E7E2] text-[#12231F] hover:bg-[#F6F7F4] disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
