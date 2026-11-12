import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Scale,
  Send,
  AlertCircle
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

  useEffect(() => {
    async function load() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
        if (progs.length > 0) setSelectedProg(progs[0]._id);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleCustomQuery = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await askAIChat(prompt);
      setResponse({
        title: `Query: "${prompt}"`,
        content: res.answer,
        status: res.dataStatus || 'SIMULATED',
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
      const res = await analyzeProgrammeAI(selectedProg, 2026);
      setResponse({
        title: res.title,
        content: JSON.stringify(res, null, 2),
        parsed: res,
        status: res.dataStatus,
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
        title: rep.title,
        content: rep.reportContent,
        status: rep.dataStatus,
      });
    } catch (err) {
      alert(`Report error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D6] pb-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Administrative Intelligence</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Gemini AI Research Assistant
          </h2>
        </div>
        <span className="text-xs font-mono bg-[#101C2C] text-[#D6AD60] px-3 py-1.5 rounded-lg border border-[#1A2B40]">
          Gemini 2.5 Flash Connected
        </span>
      </div>

      {/* ACTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-[#101C2C]">
            <BookOpen className="w-4 h-4 text-[#426B70]" />
            <h3>Faculty Econometric Analysis</h3>
          </div>
          <p className="text-xs text-[#788391]">
            Select an individual academic faculty to generate a structured 40-year CAGR, purchasing power, and nominal analysis.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <select
              value={selectedProg}
              onChange={(e) => setSelectedProg(e.target.value)}
              className="flex-1 bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono text-[#101C2C]"
            >
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAnalyzeSelected}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#101C2C] text-white hover:bg-[#1A2B40] text-xs font-mono font-semibold cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-[#101C2C]">
            <FileText className="w-4 h-4 text-[#23865B]" />
            <h3>Comprehensive Monograph Synthesis</h3>
          </div>
          <p className="text-xs text-[#788391]">
            Synthesizes all 400 fee records, 40 CPI index years, and Karachi educational philanthropy into an executive monograph.
          </p>
          <div className="pt-2">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Drafting Synthesis...' : 'Generate 40-Year Executive Monograph'}
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOM PROMPT CHAT INPUT */}
      <form onSubmit={handleCustomQuery} className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#D6AD60] shrink-0" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a custom research question across the 40-year historical dataset..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-[#101C2C] focus:outline-none font-mono"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 rounded-lg bg-[#101C2C] text-white text-xs font-mono font-semibold hover:bg-[#1A2B40] cursor-pointer disabled:opacity-50"
        >
          Submit
        </button>
      </form>

      {/* AI RESULT DISPLAY */}
      {response && (
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {response.title}
            </h3>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#D6AD60]/15 text-[#966b1a] border border-[#D6AD60]/30 font-bold">
              Status: {response.status}
            </span>
          </div>

          {response.parsed ? (
            <div className="space-y-4 font-mono text-xs">
              <p className="text-sm font-sans italic text-[#426B70] leading-relaxed border-l-2 border-[#D6AD60] pl-3">
                "{response.parsed.summary}"
              </p>
              {response.parsed.keyFindings && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {response.parsed.keyFindings.map((f, i) => (
                    <div key={i} className="p-3 bg-[#F5F1E8] rounded-lg border border-[#E5E0D6]">
                      <span className="text-[#788391] block text-[11px]">{f.title}</span>
                      <span className="text-sm font-bold text-[#101C2C] block mt-1">{f.value}</span>
                      <span className="text-[11px] text-[#788391] mt-1 block">{f.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-[#101C2C] leading-relaxed whitespace-pre-line font-sans">
              {response.content}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AIResearchAssistant;
