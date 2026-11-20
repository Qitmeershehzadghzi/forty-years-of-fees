import React, { useState, useEffect } from 'react';
import { Sparkles, Send, BookOpen, FileText, Copy, Check } from 'lucide-react';
import Loading from '../components/common/Loading.jsx';

import {
  askAIChat,
  analyzeProgrammeAI,
  compareProgrammesAI,
  generateExecutiveReportAI
} from '../services/aiService.js';
import { getProgrammes } from '../services/programmeService.js';

const SUGGESTED_PROMPTS = [
  'What happened to BBA fees between 1987 and 2027?',
  'Which programme had the highest nominal fee growth?',
  'How did inflation affect the real value of tuition?',
  'Compare Computer Science and Business Administration.',
  'Which years saw the sharpest fee increases?',
];

const TABS = [
  { id: 'chat', label: 'Ask a question', icon: Sparkles },
  { id: 'programme', label: 'Programme deep-dive', icon: BookOpen },
  { id: 'report', label: 'Executive report', icon: FileText },
];

export const AIInsights = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const [inputQuestion, setInputQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Hello. Ask me about the 1987–2027 fee series. All figures come from the illustrative dataset and are checked against the PBS-based CPI series.',
      dataStatus: 'SIMULATED',
      timestamp: new Date(),
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [structuredAnalysis, setStructuredAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [executiveReport, setExecutiveReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProgs() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
        if (progs.length > 0) setSelectedProgrammeId(progs[0]._id);
      } catch (err) {
        console.error(err);
      }
    }
    loadProgs();
  }, []);

  const handleSendChat = async (questionToSend) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || chatLoading) return;

    setInputQuestion('');
    setChatLog(prev => [...prev, { sender: 'user', text: q, timestamp: new Date() }]);
    setChatLoading(true);

    try {
      const res = await askAIChat(q);
      setChatLog(prev => [
        ...prev,
        { sender: 'ai', text: res.answer, dataStatus: res.dataStatus || 'SIMULATED', timestamp: new Date() }
      ]);
    } catch (err) {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Could not get an answer: ${err.message}. Check that the backend is running and GEMINI_API_KEY is set.`,
          dataStatus: 'ERROR',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunProgrammeAnalysis = async () => {
    if (!selectedProgrammeId || analysisLoading) return;
    setAnalysisLoading(true);
    setStructuredAnalysis(null);
    try {
      const result = await analyzeProgrammeAI(selectedProgrammeId, 2027);
      setStructuredAnalysis(result);
    } catch (err) {
      alert(`Analysis error: ${err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (reportLoading) return;
    setReportLoading(true);
    setExecutiveReport(null);
    try {
      const rep = await generateExecutiveReportAI();
      setExecutiveReport(rep);
    } catch (err) {
      alert(`Report error: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!executiveReport?.reportContent) return;
    navigator.clipboard.writeText(executiveReport.reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          AI research assistant
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          Ask the fee dataset a question
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          The assistant uses the same 10 programmes and 41 years of records shown elsewhere on the
          site. It does not invent numbers: growth rates and real fees are calculated by the backend first.
        </p>
      </div>

      <div className="flex gap-1 border-b border-[#E2E7E2] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2.5 text-sm border-b-2 transition-colors ${
                active
                  ? 'border-[#0F5C4E] text-[#0F5C4E] font-semibold'
                  : 'border-transparent text-[#5C6B66] hover:text-[#12231F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(promptText)}
                className="rounded-full border border-[#E2E7E2] bg-white px-3 py-1.5 text-xs text-[#12231F] hover:bg-[#F6F7F4] transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#E2E7E2] rounded-xl overflow-hidden flex flex-col h-[520px]">
            <div className="px-4 py-3 border-b border-[#E2E7E2] flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-[#12231F]">
                <span className="w-2 h-2 rounded-full bg-[#0F5C4E]" />
                Journey 40 assistant
              </span>
              <span className="text-[11px] text-[#5C6B66]">1987–2027 · illustrative data</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFBFA]">
              {chatLog.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0F5C4E] text-white'
                        : 'bg-white text-[#12231F] border border-[#E2E7E2]'
                    }`}
                  >
                    {msg.sender === 'ai' && msg.dataStatus && (
                      <span className="block text-[10px] uppercase tracking-wide text-[#8A9A94] mb-1">
                        {msg.dataStatus === 'ERROR' ? 'Error' : 'Illustrative data'}
                      </span>
                    )}
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E7E2] rounded-xl px-4 py-3 text-xs text-[#5C6B66]">
                    Reading the dataset...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              className="p-3 border-t border-[#E2E7E2] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about fees, inflation or programmes..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={chatLoading}
                className="flex-1 rounded-lg border border-[#E2E7E2] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputQuestion.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F5C4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B443A] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Programme analysis */}
      {activeTab === 'programme' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end gap-3">
            <label className="flex-1 block">
              <span className="block text-xs font-medium text-[#5C6B66] mb-1">Programme</span>
              <select
                value={selectedProgrammeId}
                onChange={(e) => setSelectedProgrammeId(e.target.value)}
                className="w-full rounded-lg border border-[#E2E7E2] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F5C4E]"
              >
                {programmes.map(p => (
                  <option key={p._id} value={p._id}>{p.code} — {p.name}</option>
                ))}
              </select>
            </label>
            <button
              onClick={handleRunProgrammeAnalysis}
              disabled={analysisLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F5C4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B443A] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {analysisLoading ? 'Analysing...' : 'Analyse programme'}
            </button>
          </div>

          {analysisLoading ? (
            <div className="py-16"><Loading text="Calculating growth and real fees..." /></div>
          ) : structuredAnalysis ? (
            <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E7E2]">
                <h2 className="text-lg font-semibold text-[#12231F]">
                  {structuredAnalysis.title || 'Programme analysis'}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF5F2] text-[#0F5C4E]">
                  {structuredAnalysis.dataStatus}
                </span>
              </div>
              <p className="text-sm text-[#12231F] leading-relaxed whitespace-pre-line">
                {structuredAnalysis.synthesis || structuredAnalysis.summary || JSON.stringify(structuredAnalysis, null, 2)}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2E7E2] bg-white p-10 text-center">
              <p className="text-sm font-medium text-[#12231F]">Pick a programme and run the analysis.</p>
              <p className="text-xs text-[#5C6B66] mt-1">You will get a short written summary of its 41-year path.</p>
            </div>
          )}
        </div>
      )}

      {/* Report */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#12231F]">Generate an executive report</h2>
              <p className="text-xs text-[#5C6B66] mt-0.5">
                A single brief covering all 10 programmes, growth rankings and inflation.
              </p>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F5C4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B443A] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {reportLoading ? 'Generating...' : 'Generate report'}
            </button>
          </div>

          {reportLoading ? (
            <div className="py-16"><Loading text="Compiling the report..." /></div>
          ) : executiveReport ? (
            <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E7E2]">
                <h2 className="text-lg font-semibold text-[#12231F]">
                  {executiveReport.title || 'Executive report'}
                </h2>
                <button
                  onClick={handleCopyReport}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E7E2] px-3 py-1.5 text-xs text-[#12231F] hover:bg-[#F6F7F4]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0F5C4E]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="text-sm text-[#12231F] leading-relaxed whitespace-pre-wrap bg-[#FAFBFA] p-5 rounded-lg border border-[#E2E7E2]">
                {executiveReport.reportContent}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2E7E2] bg-white p-10 text-center">
              <p className="text-sm font-medium text-[#12231F]">No report yet.</p>
              <p className="text-xs text-[#5C6B66] mt-1">Generate one to see the full summary.</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[#5C6B66] leading-relaxed">
        AI answers describe an illustrative dataset. Do not treat them as official university
        records or as financial advice.
      </p>

    </div>
  );
};

export default AIInsights;
