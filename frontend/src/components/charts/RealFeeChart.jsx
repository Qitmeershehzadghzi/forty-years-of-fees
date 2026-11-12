import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';
import { formatPKR } from '../../utils/currencyFormatter.js';

export const RealFeeChart = ({
  data = [],
  programmeName = 'Selected Programme',
  baseYear = 2026,
  height = 420,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-mono text-[#788391]">
        No historical comparison data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#1A2B40] p-3.5 rounded-lg shadow-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-[#D6AD60] mb-2 border-b border-[#1A2B40] pb-1">
            Academic Year {label}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-[#F5F1E8]/70">Nominal Fee Paid:</span>
              <span className="font-bold text-white">{formatPKR(row.nominalAmount)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#D6AD60]">Real Fee ({baseYear} PKR):</span>
              <span className="font-bold text-[#D6AD60]">{formatPKR(row.realAmount)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-[#1A2B40] text-[11px] text-[#788391]">
              <span>Historical CPI ({label}):</span>
              <span>{row.cpi}</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px] text-[#788391]">
              <span>Base CPI ({baseYear}):</span>
              <span>{row.baseCPI}</span>
            </div>
            <div className="mt-1 text-[10px] text-[#966b1a]">
              Status: {row.dataType}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h4 className="font-serif font-bold text-base text-[#101C2C]">
            Nominal vs Real (Inflation-Adjusted) Fee
          </h4>
          <p className="text-xs text-[#788391]">
            Comparing actual nominal fee paid against purchasing power adjusted to Base Year {baseYear}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#101C2C]"></span> Nominal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#D6AD60]"></span> Real ({baseYear})
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D6" />
            <XAxis
              dataKey="year"
              stroke="#788391"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="#788391"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
              tickFormatter={(v) => formatPKR(v, { compact: true })}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 15, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            />
            <Area
              type="monotone"
              dataKey="realAmount"
              name={`Real Fee (${baseYear} Purchasing Power)`}
              fill="#D6AD60"
              fillOpacity={0.12}
              stroke="#D6AD60"
              strokeWidth={2.5}
            />
            <Line
              type="monotone"
              dataKey="nominalAmount"
              name="Nominal Historical Fee"
              stroke="#101C2C"
              strokeWidth={2.5}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealFeeChart;
