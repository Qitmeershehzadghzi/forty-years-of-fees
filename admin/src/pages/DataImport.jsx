import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { importFeesCSV } from '../services/feeService.js';
import { importInflationCSV } from '../services/inflationService.js';

export const DataImport = () => {
  const [importType, setImportType] = useState('fees'); // 'fees' or 'inflation'
  const [csvText, setCsvText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Sample templates
  const downloadSampleTemplate = () => {
    let headers = '';
    let sample = '';
    let filename = '';

    if (importType === 'fees') {
      headers = 'programmeCode,year,feeType,amount,dataType,verificationStatus,notes\n';
      sample = 'BBA,2027,Total Annual Fee,312000,VERIFIED,VERIFIED,"Officially verified 2027 prospectus"\nBSCS,2027,Tuition Fee,228000,VERIFIED,VERIFIED,"Verified computer science fee"';
      filename = 'greenwich_fees_sample_template.csv';
    } else {
      headers = 'year,cpiValue,seriesId,baseYear,dataType,verificationStatus\n';
      sample = '2027,412.50,PBS-CPI-2015-16,2016,VERIFIED,VERIFIED\n2026,370.64,PBS-CPI-2015-16,2016,VERIFIED,VERIFIED';
      filename = 'pbs_cpi_sample_template.csv';
    }

    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteImport = async () => {
    if (!csvText.trim()) {
      setError('Please provide CSV data either by uploading a file or pasting raw CSV text.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let res;
      if (importType === 'fees') {
        res = await importFeesCSV(csvText);
      } else {
        res = await importInflationCSV(csvText);
      }
      setResults(res);
    } catch (err) {
      setError(err.message || 'CSV Import failed. Check formatting and headers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Bulk Archival Integration Engine
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            CSV Batch Ingestion & Validation
          </h2>
        </div>
        <button
          onClick={downloadSampleTemplate}
          className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs text-[#101C2C] cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Import Type Switcher */}
      <div className="flex rounded-2xl bg-white p-1 border border-[#E5E0D6] shadow-xs max-w-md font-mono text-xs">
        <button
          onClick={() => { setImportType('fees'); setResults(null); }}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            importType === 'fees'
              ? 'bg-[#101C2C] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#101C2C]'
          }`}
        >
          Historical Fee Records
        </button>
        <button
          onClick={() => { setImportType('inflation'); setResults(null); }}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            importType === 'inflation'
              ? 'bg-[#101C2C] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#101C2C]'
          }`}
        >
          PBS CPI Inflation Series
        </button>
      </div>

      {/* Upload and Paste Console */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Drag/Drop Box */}
        <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#D6AD60] rounded-2xl p-8 text-center bg-[#F8FAFC] transition-colors">
          <UploadCloud className="w-10 h-10 text-[#D6AD60] mx-auto mb-3" />
          <h4 className="font-serif font-bold text-base text-[#101C2C]">
            Upload {importType === 'fees' ? 'Fee Records' : 'CPI Index'} CSV Document
          </h4>
          <p className="text-xs text-[#64748B] mt-1 mb-4 font-sans">
            UTF-8 encoded comma-separated spreadsheet files up to 10MB supported.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            id="csvFileInput"
            className="hidden"
          />
          <label
            htmlFor="csvFileInput"
            className="px-5 py-2.5 bg-[#101C2C] text-white rounded-xl text-xs font-mono font-semibold cursor-pointer hover:bg-[#1A2B40] inline-block shadow-sm transition-all"
          >
            {selectedFile ? selectedFile.name : 'Select CSV File From Computer'}
          </label>
        </div>

        {/* Or Paste Raw CSV Text */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="block text-[#64748B] uppercase font-bold">
            Or Paste Raw CSV Data Lines:
          </label>
          <textarea
            rows="6"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`programmeCode,year,feeType,amount,dataType\nBBA,2027,Total Annual Fee,312000,VERIFIED`}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#101C2C] font-mono leading-relaxed focus:ring-2 focus:ring-[#D6AD60]"
          />
        </div>

        {error && (
          <div className="p-4 bg-[#FEE2E2] border border-[#DC2626]/30 rounded-xl text-xs font-mono text-[#DC2626]">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] font-mono text-[#64748B]">
            Validation Rule: Verified historical records will not be overwritten by simulated rows.
          </span>
          <button
            onClick={handleExecuteImport}
            disabled={loading || !csvText.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#D6AD60] text-[#101C2C] hover:bg-[#C49B4C] font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all shadow-sm cursor-pointer"
          >
            {loading ? 'Processing Validation...' : 'Execute Ingestion & Validation'}
          </button>
        </div>

      </div>

      {/* Results Report Display */}
      {results && (
        <div className="bg-white border border-[#E5E0D6] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 font-mono text-xs">
          <div className="flex items-center gap-2 text-base font-serif font-bold text-[#101C2C]">
            <CheckCircle className="w-5 h-5 text-[#23865B]" />
            <h3>Batch Ingestion Execution Report</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#23865B]/10 border border-[#23865B]/20">
              <span className="text-[11px] text-[#23865B] block font-bold">New Records Created</span>
              <span className="text-2xl font-bold text-[#23865B] mt-1 block">{results.imported}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#D6AD60]/15 border border-[#D6AD60]/30">
              <span className="text-[11px] text-[#966B1A] block font-bold">Records Updated</span>
              <span className="text-2xl font-bold text-[#966B1A] mt-1 block">{results.updated}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20">
              <span className="text-[11px] text-[#DC2626] block font-bold">Skipped / Errors</span>
              <span className="text-2xl font-bold text-[#DC2626] mt-1 block">{results.errors?.length || 0}</span>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[#DC2626] font-bold block">Validation Errors Encountered:</span>
              <div className="max-h-48 overflow-y-auto space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-[#CBD5E1]">
                {results.errors.map((errItem, idx) => (
                  <div key={idx} className="text-[#DC2626]">
                    Row {errItem.row}: {errItem.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DataImport;
