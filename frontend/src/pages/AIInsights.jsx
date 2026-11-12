import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Scale,
  RefreshCw
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Button from '../components/common/Button.jsx';
import AIInsightCard from '../components/dashboard/AIInsightCard.jsx';
import Loading from '../components/common/Loading.jsx';

import {
  askAIChat,
  analyzeProgrammeAI,
  compareProgrammesAI,
  generateExecutiveReportAI
} from '../services/aiService.js';
import { getProgrammes } from '../services/programmeService.js';

const SUGGESTED_PROMPTS = [
  "What happened to BBA fees between 1987 and 2026?",
  "Which programme had the highest simulated nominal fee growth?",
  "How did inflation affect the purchasing power of university fees?",
  "Compare Computer Science and BBA fees.",
  "Which years had the largest changes in simulated annual fees?",
  "Explain the difference between nominal and real tuition growth in Karachi.",
];

export const AIInsights = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'programme', 'report'

  // Chat state
  const [inputQuestion, setInputQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Welcome to the Journey 40 AI Research Assistant. I analyze Greenwich University historical fee and inflation records directly from the MongoDB research database. What would you like to investigate today?',
      dataStatus: 'SIMULATED',
      timestamp: new Date(),
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Structured Analysis state
  const [structuredAnalysis, setStructuredAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Executive report state
  const [executiveReport, setExecutiveReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

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

  // Handle chat submission
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
        {
          sender: 'ai',
          text: res.answer,
          dataStatus: res.dataStatus || 'SIMULATED',
          timestamp: new Date(),
        }
      ]);
    } catch (err) {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Query error: ${err.message}. Please check your backend connection and GEMINI_API_KEY.`,
          dataStatus: 'ERROR',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Run structured programme analysis
  const handleRunProgrammeAnalysis = async () => {
    if (!selectedProgrammeId || analysisLoading) return;
    setAnalysisLoading(true);
    setStructuredAnalysis(null);
    try {
      const result = await analyzeProgrammeAI(selectedProgrammeId, 2026);
      setStructuredAnalysis(result);
    } catch (err) {
      alert(`Analysis error: ${err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Run executive report generator
  const handleGenerateReport = async () => {
    if (reportLoading) return;
    setReportLoading(true);
    setExecutiveReport(null);
    try {
      const rep = await generateExecutiveReportAI();
      setExecutiveReport(rep);
    } catch (err) {
      alert(`Report generation error: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <SectionHeading
            badge="Google Gemini AI Integration"
            title="AI Financial Research Assistant"
            subtitle="Autonomous econometric reasoning over Greenwich University 40-year historical and inflation records."
            className="mb-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#D6AD60] bg-[#101C2C] px-3 py-1.5 rounded-lg border border-[#1A2B40]">
            Model: Gemini 2.5 Flash
          </span>
        </div>
      </div>

      {/* DISCLOSURE */}
      <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#D6AD60]/30 rounded-xl p-4 flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-[#D6AD60] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#D6AD60] font-mono uppercase tracking-wider">
            Deterministic Grounding Architecture
          </span>
          <p className="text-[#F5F1E8]/80 leading-relaxed">
            The AI does not calculate raw numerical metrics on its own. Authoritative growth percentages,
            CAGR, and real purchasing values are computed by backend JavaScript algorithms from MongoDB
            records, which are then passed to Gemini for qualitative academic synthesis.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-[#E5E0D6] space-x-6 text-sm font-mono font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'border-[#D6AD60] text-[#101C2C]'
              : 'border-transparent text-[#788391] hover:text-[#101C2C]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D6AD60]" />
          <span>Interactive AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('programme')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'programme'
              ? 'border-[#D6AD60] text-[#101C2C]'
              : 'border-transparent text-[#788391] hover:text-[#101C2C]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#426B70]" />
          <span>Faculty Deep-Dive Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'report'
              ? 'border-[#D6AD60] text-[#101C2C]'
              : 'border-transparent text-[#788391] hover:text-[#101C2C]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#23865B]" />
          <span>Executive Monograph Report</span>
        </button>
      </div>

      {/* TAB 1: CHAT INTERFACE */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          
          {/* Suggested Prompts Chips */}
          <div>
            <span className="text-xs font-semibold text-[#788391] uppercase font-mono block mb-2">
              Suggested Research Questions:
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(promptText)}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#E5E0D6] text-xs text-[#101C2C] hover:border-[#D6AD60] hover:bg-[#F5F1E8] transition-all cursor-pointer font-sans text-left"
                >
                  "{promptText}"
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 bg-[#101C2C] text-[#F5F1E8] border-b border-[#1A2B40] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-[#23865B]"></span>
                <span className="font-bold text-white">Journey 40 Research Assistant</span>
              </div>
              <span className="text-[11px] font-mono text-[#D6AD60]">
                Dataset: 400 Records (1987–2026)
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F5F1E8]/30">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#101C2C] text-white font-medium'
                        : 'bg-white text-[#101C2C] border border-[#E5E0D6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] font-mono opacity-70">
                      <span>{msg.sender === 'user' ? 'You' : 'Gemini Research Analyst'}</span>
                      {msg.dataStatus && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {msg.dataStatus}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 text-xs font-mono text-[#788391] flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D6AD60] animate-ping"></div>
                    <span>Querying MongoDB & formulating academic answer...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              className="p-3 bg-white border-t border-[#E5E0D6] flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Ask about historical tuition fees, inflation effects, or programme comparisons..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={chatLoading}
                className="flex-1 bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60]"
              />
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={chatLoading || !inputQuestion.trim()}
                icon={Send}
              >
                Ask AI
              </Button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 2: FACULTY DEEP-DIVE ANALYSIS */}
      {activeTab === 'programme' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-1 max-w-md">
              <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
                Select Programme for Econometric Evaluation
              </label>
              <select
                value={selectedProgrammeId}
                onChange={(e) => setSelectedProgrammeId(e.target.value)}
                className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C]"
              >
                {programmes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              disabled={analysisLoading}
              onClick={handleRunProgrammeAnalysis}
            >
              {analysisLoading ? 'Analyzing...' : 'Generate AI Econometric Report'}
            </Button>
          </div>

          {analysisLoading ? (
            <div className="py-20">
              <Loading text="Extracting 40-year fee data, calculating CAGR, and generating structured JSON analysis..." />
            </div>
          ) : structuredAnalysis ? (
            <AIInsightCard
              title={structuredAnalysis.title}
              summary={structuredAnalysis.summary}
              keyFindings={structuredAnalysis.keyFindings}
              trends={structuredAnalysis.trends}
              limitations={structuredAnalysis.limitations}
              conclusion={structuredAnalysis.conclusion}
              dataStatus={structuredAnalysis.dataStatus}
            />
          ) : (
            <div className="p-12 text-center bg-white border border-[#E5E0D6] rounded-xl text-xs font-mono text-[#788391]">
              Select an academic programme above and click "Generate AI Econometric Report" to view structured insights.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXECUTIVE REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-base text-[#101C2C]">
                Journey 40 Institutional Monograph Generator
              </h4>
              <p className="text-xs text-[#788391]">
                Generates a multi-page academic monograph synthesizing 40 years of fee data, inflation trends, and philanthropy.
              </p>
            </div>
            <Button
              variant="gold"
              size="md"
              icon={FileText}
              disabled={reportLoading}
              onClick={handleGenerateReport}
            >
              {reportLoading ? 'Drafting Monograph...' : 'Generate Executive Report'}
            </Button>
          </div>

          {reportLoading ? (
            <div className="py-20">
              <Loading text="Synthesizing four decades of university economics into institutional monograph..." />
            </div>
          ) : executiveReport ? (
            <div className="bg-white border border-[#E5E0D6] rounded-xl p-8 shadow-sm space-y-6 font-serif">
              <div className="border-b border-[#E5E0D6] pb-4">
                <span className="text-xs font-mono uppercase text-[#D6AD60] tracking-widest block mb-1">
                  Institutional Research Monograph · Journey 40
                </span>
                <h3 className="text-2xl font-bold text-[#101C2C]">
                  {executiveReport.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono text-[#788391] mt-2">
                  <span>Greenwich University, Karachi</span>
                  <span>·</span>
                  <span>Status: {executiveReport.dataStatus}</span>
                  <span>·</span>
                  <span>Generated: {new Date(executiveReport.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-[#101C2C]/90 leading-relaxed font-sans whitespace-pre-line space-y-4">
                {executiveReport.reportContent}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E5E0D6] rounded-xl text-xs font-mono text-[#788391]">
              Click "Generate Executive Report" to synthesize the complete 40-year dataset monograph.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AIInsights;
