import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { formatPKR } from '../../utils/currencyFormatter.js';
import { getProgrammeColor } from '../../utils/chartHelpers.js';

export const ProgrammeComparisonChart = ({
  data = [],
  programmes = [],
  mode = 'nominal', // 'nominal' or 'real'
  height = 420,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-mono text-[#788391]">
        No comparison records available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#1A2B40] p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-[#D6AD60] mb-2 border-b border-[#1A2B40] pb-1">
            Academic Year {label} ({mode === 'real' ? 'Real 2026 PKR' : 'Nominal PKR'})
          </div>
          <div className="space-y-1">
            {payload.map((entry, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}:
                </span>
                <span className="font-bold">{formatPKR(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
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
          {programmes.map((p, idx) => {
            const dataKey = mode === 'real' ? `${p.code}_real` : p.code;
            return (
              <Line
                key={p.code}
                type="monotone"
                dataKey={dataKey}
                name={`${p.name} (${p.code})`}
                stroke={getProgrammeColor(p.code, idx)}
                strokeWidth={2.4}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgrammeComparisonChart;
