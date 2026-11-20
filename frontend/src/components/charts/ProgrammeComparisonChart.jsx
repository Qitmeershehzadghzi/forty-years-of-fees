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
  mode = 'nominal',
  baseYear = 2027,
  height = 420,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#5C6B66]">
        No comparison data to chart yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-[#12231F] border border-[#E2E7E2] p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2 border-b border-[#E2E7E2] pb-1">
            {label} · {mode === 'real' ? `real ${baseYear} PKR` : 'nominal PKR'}
          </div>
          <div className="space-y-1">
            {payload.map((entry, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#5C6B66]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold">{formatPKR(entry.value)}</span>
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
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE8" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="#8A9A94"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#8A9A94"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatPKR(v, { compact: true })}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
          {programmes.map((p, idx) => {
            const dataKey = mode === 'real' ? `${p.code}_real` : p.code;
            return (
              <Line
                key={p.code}
                type="monotone"
                dataKey={dataKey}
                name={`${p.code} — ${p.name}`}
                stroke={getProgrammeColor(p.code, idx)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgrammeComparisonChart;
