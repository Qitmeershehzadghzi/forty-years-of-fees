import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowRight
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
      sample = 'BBA,2026,Total Annual Fee,285000,VERIFIED,VERIFIED,"Officially verified 2026 prospectus"\nBSCS,2026,Tuition Fee,210000,VERIFIED,VERIFIED,"Verified computer science fee"';
      filename = 'greenwich_fees_sample_template.csv';
    } else {
      headers = 'year,cpiValue,seriesId,baseYear,dataType,verificationStatus\n';
      sample = '2026,370.64,PBS-CPI-2015-16,2016,VERIFIED,VERIFIED\n2025,325.12,PBS-CPI-2015-16,2016,VERIFIED,VERIFIED';
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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D6] pb-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Bulk Data Integration</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            CSV Archival Import Engine
          </h2>
        </div>
        <button
          onClick={downloadSampleTemplate}
          className="px-3.5 py-2 rounded-lg bg-white border border-[#E5E0D6] hover:bg-[#F5F1E8] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm text-[#101C2C] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* IMPORT TYPE SWITCHER */}
      <div className="flex rounded-xl bg-white p-1 border border-[#E5E0D6] shadow-sm max-w-md font-mono text-xs">
        <button
          onClick={() => { setImportType('fees'); setResults(null); }}
          className={`flex-1 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            importType === 'fees' ? 'bg-[#101C2C] text-white shadow-sm' : 'text-[#788391] hover:text-[#101C2C]'
          }`}
        >
          Historical Fee Records
        </button>
        <button
          onClick={() => { setImportType('inflation'); setResults(null); }}
          className={`flex-1 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            importType === 'inflation' ? 'bg-[#101C2C] text-white shadow-sm' : 'text-[#788391] hover:text-[#101C2C]'
          }`}
        >
          PBS CPI Inflation Series
        </button>
      </div>

      {/* UPLOAD & PASTE CONTAINER */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Drag/Drop Box */}
        <div className="border-2 border-dashed border-[#E5E0D6] hover:border-[#D6AD60] rounded-xl p-8 text-center bg-[#F5F1E8]/40 transition-colors">
          <UploadCloud className="w-10 h-10 text-[#D6AD60] mx-auto mb-3" />
          <h4 className="font-serif font-bold text-base text-[#101C2C]">
            Upload {importType === 'fees' ? 'Fee Records' : 'CPI Index'} CSV Document
          </h4>
          <p className="text-xs text-[#788391] mt-1 mb-4">
            UTF-8 encoded comma-separated files up to 10MB supported.
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
            className="px-4 py-2 bg-[#101C2C] text-white rounded-lg text-xs font-mono font-semibold cursor-pointer hover:bg-[#1A2B40] inline-block shadow-sm"
          >
            {selectedFile ? selectedFile.name : 'Select CSV File From Computer'}
          </label>
        </div>

        {/* Or Paste Raw CSV */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="block text-[#788391] uppercase font-semibold">
            Or Paste Raw CSV Lines Below:
          </label>
          <textarea
            rows="6"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`programmeCode,year,feeType,amount,dataType\nBBA,2026,Total Annual Fee,285000,VERIFIED`}
            className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg p-3 text-xs text-[#101C2C] font-mono leading-relaxed"
          />
        </div>

        {error && (
          <div className="p-3 bg-[#C75A5A]/10 border border-[#C75A5A]/30 rounded-lg text-xs font-mono text-[#C75A5A]">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[#788391]">
            Validation Rule: Verified records will never be overwritten by simulated rows.
          </span>
          <button
            onClick={handleExecuteImport}
            disabled={loading || !csvText.trim()}
            className="px-6 py-2.5 rounded-lg bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {loading ? 'Processing Import...' : 'Execute Import Validation'}
          </button>
        </div>

      </div>

      {/* RESULTS DISPLAY */}
      {results && (
        <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-base font-serif font-bold text-[#101C2C]">
            <CheckCircle className="w-5 h-5 text-[#23865B]" />
            <h3>Import Execution Report</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-[#23865B]/10 border border-[#23865B]/20">
              <span className="text-[11px] text-[#23865B] block">New Records Created</span>
              <span className="text-xl font-bold text-[#23865B]">{results.imported}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#D6AD60]/10 border border-[#D6AD60]/20">
              <span className="text-[11px] text-[#966b1a] block">Existing Records Updated</span>
              <span className="text-xl font-bold text-[#966b1a]">{results.updated}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#C75A5A]/10 border border-[#C75A5A]/20">
              <span className="text-[11px] text-[#C75A5A] block">Rows Skipped / Errors</span>
              <span className="text-xl font-bold text-[#C75A5A]">{results.errors?.length || 0}</span>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[#C75A5A] font-bold block">Validation Errors Encountered:</span>
              <div className="max-h-40 overflow-y-auto space-y-1 bg-[#F5F1E8] p-3 rounded border border-[#E5E0D6]">
                {results.errors.map((errItem, idx) => (
                  <div key={idx} className="text-[#C75A5A]">
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
