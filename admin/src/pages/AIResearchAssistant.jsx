import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Scale,
  Send,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  GraduationCap,
  Download,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import {
  askAIChat,
  analyzeProgrammeAI,
  generateExecutiveReportAI
} from '../services/adminOperations.js';
import { getProgrammes } from '../services/programmeService.js';

export const AIResearchAssistant = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProg, setSelectedProg] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
        if (progs.length > 0) setSelectedProg(progs[0]._id);
      } catch (err) {
        console.error('Failed to load programmes:', err);
      }
    }
    load();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomQuery = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await askAIChat(prompt);
      setResponse({
        title: `Analytical Query: "${prompt}"`,
        content: res.answer,
        status: res.dataStatus || 'SIMULATED',
        timestamp: new Date().toLocaleTimeString(),
        model: 'Gemini 2.5 Flash / Econometric RAG'
      });
    } catch (err) {
      alert(`AI Query Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSelected = async () => {
    if (!selectedProg || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await analyzeProgrammeAI(selectedProg, 2027);
      const progObj = programmes.find(p => p._id === selectedProg);
      setResponse({
        title: `Econometric Deep Dive: ${progObj?.code || ''} — ${progObj?.name || 'Programme'}`,
        content: typeof res === 'string' ? res : (res.analysis || JSON.stringify(res, null, 2)),
        parsed: typeof res === 'object' ? res : null,
        status: res.dataStatus || 'SIMULATED',
        timestamp: new Date().toLocaleTimeString(),
        model: 'Gemini 2.5 Flash / Longitudinal Analysis'
      });
    } catch (err) {
      alert(`Programme analysis error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const rep = await generateExecutiveReportAI();
      setResponse({
        title: rep.title || 'Forty-Year Longitudinal Executive Synthesis (1987–2027)',
        content: rep.reportContent,
        status: rep.dataStatus || 'SIMULATED',
        timestamp: new Date().toLocaleTimeString(),
        model: 'Gemini 2.5 Flash / Institutional Synthesis'
      });
    } catch (err) {
      alert(`Report synthesis error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQueries = [
    'Compute nominal vs real fee inflation CAGR across Greenwich MBA programme from 1987 to 2027.',
    'How do Karachi private higher education fee escalations correlate with Pakistan CPI food vs non-food spikes?',
    'Summarize institutional scholarship and Qarz-e-Hasna safety nets for working students in Sindh.',
    'Evaluate real purchasing power parity (PPP) erosion on BS Computer Science tuition fees over 20 years.'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#23865B]/15 text-[#23865B] border border-[#23865B]/30">
              <Sparkles className="w-3 h-3 text-[#23865B]" />
              AI Intelligence Suite
            </span>
            <span className="text-xs font-mono text-[#788391]">Grounding: MongoDB Atlas + PBS CPI</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
            Archival Research Intelligence
          </h1>
          <p className="text-xs text-[#788391] mt-1 font-sans max-w-2xl">
            Leverage Google Gemini 2.5 Flash and RAG grounding on four decades of Greenwich University fee archives and Pakistan Bureau of Statistics indices.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-[#D6AD60]" />
          <span>{loading ? 'Synthesizing...' : 'Generate 40-Yr Executive Report'}</span>
        </button>
      </div>

      {/* Control Strip & Operational Workbenches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Faculty Analyzer */}
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <GraduationCap className="w-4 h-4 text-[#D6AD60]" />
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#101C2C]">
              Faculty Deep Dive Analyzer
            </h2>
          </div>
          <p className="text-xs text-[#788391] font-sans">
            Run an automated longitudinal econometrics audit on an individual degree programme.
          </p>
          <div className="space-y-3">
            <label className="block text-[11px] font-mono font-semibold uppercase text-[#788391]">
              Select Academic Discipline
            </label>
            <select
              value={selectedProg}
              onChange={(e) => setSelectedProg(e.target.value)}
              className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
            >
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAnalyzeSelected}
              disabled={loading || !selectedProg}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#101C2C] text-[#101C2C] hover:bg-[#101C2C] hover:text-[#F5F1E8] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-[#D6AD60]" />
              <span>Analyze Trajectory</span>
            </button>
          </div>
        </div>

        {/* Right Col: Custom Research Prompt Console */}
        <div className="lg:col-span-2 bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#D6AD60]" />
              <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#101C2C]">
                Natural Language Research Console
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#788391]">Zero-Hallucination Guardrails</span>
          </div>

          <form onSubmit={handleCustomQuery} className="space-y-3">
            <div className="relative">
              <textarea
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask any empirical question regarding 1987–2027 fee trajectories, CPI indexation, or faculty inflation..."
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl p-3.5 text-xs text-[#101C2C] font-sans focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60]"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#788391]">
                <Cpu className="w-3.5 h-3.5 text-[#23865B]" />
                <span>Grounding: 400+ DB Records</span>
              </div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#D6AD60]" />
                <span>{loading ? 'Executing...' : 'Dispatch Query'}</span>
              </button>
            </div>
          </form>

          {/* Prompt Suggestion Chips */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#788391] block mb-2 font-bold">
              Archival Query Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestQueries(suggestedQueries, (q) => { setPrompt(q); })}
            </div>
          </div>
        </div>

      </div>

      {/* Output / Results Card */}
      {loading && (
        <div className="p-12 bg-white border border-[#E5E0D6] rounded-2xl text-center space-y-3 shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-[#101C2C] text-[#D6AD60] flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <p className="font-mono text-xs font-bold text-[#101C2C]">
            Synthesizing Archival Ledger & PBS CPI Indices...
          </p>
          <p className="text-xs text-[#788391] font-sans">
            Computing compound annual growth rates, real fee deflations, and econometric historical milestones.
          </p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
          {/* Response Meta Header */}
          <div className="bg-[#101C2C] text-[#F5F1E8] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2B40]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-[#D6AD60]/20 text-[#D6AD60] border border-[#D6AD60]/40">
                  {response.status}
                </span>
                <span className="text-[11px] font-mono text-[#F5F1E8]/70">
                  Model: {response.model} · {response.timestamp}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                {response.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(response.content)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A2B40] hover:bg-[#22354d] text-xs font-mono text-[#F5F1E8] transition-colors border border-white/10 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#23865B]" /> : <Copy className="w-3.5 h-3.5 text-[#D6AD60]" />}
                <span>{copied ? 'Copied' : 'Copy Synthesis'}</span>
              </button>
            </div>
          </div>

          {/* Response Markdown / Content Body */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="prose prose-sm max-w-none text-xs leading-relaxed text-[#101C2C] font-sans whitespace-pre-line">
              {response.content}
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-[#788391]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#D6AD60]" />
                <span>Grounding: Archival records from Greenwich University & Pakistan Bureau of Statistics</span>
              </div>
              <span>Journey 40 Research Analytics Engine</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function suggestQueries(queries, onSelect) {
  return queries.map((q, idx) => (
    <button
      key={idx}
      type="button"
      onClick={() => onSelect(q)}
      className="text-left text-[11px] font-sans px-3 py-1.5 rounded-lg bg-[#F5F1E8] hover:bg-[#E5E0D6] text-[#101C2C] transition-colors border border-[#E5E0D6] cursor-pointer"
    >
      "{q.length > 60 ? q.slice(0, 60) + '...' : q}"
    </button>
  ));
}

export default AIResearchAssistant;
