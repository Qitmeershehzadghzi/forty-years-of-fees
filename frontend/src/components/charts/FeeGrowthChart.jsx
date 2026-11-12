import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const FeeGrowthChart = ({
  data = [],
  height = 380,
  title = 'Annual Compound Growth Rate (CAGR): Nominal vs Real',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-mono text-[#788391]">
        No growth ranking data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#1A2B40] p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-[#D6AD60] mb-1.5 border-b border-[#1A2B40] pb-1">
            {row.name} ({row.code})
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span>Nominal CAGR:</span>
              <span className="font-bold text-white">{row.nominalCAGR}% / yr</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Real Purchasing CAGR:</span>
              <span className="font-bold text-[#D6AD60]">{row.realCAGR}% / yr</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px] text-[#788391] pt-1 border-t border-[#1A2B40]">
              <span>Cumulative Nominal:</span>
              <span>+{row.nominalGrowth}%</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px] text-[#788391]">
              <span>Cumulative Real:</span>
              <span>+{row.realGrowth}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h4 className="font-serif font-bold text-base text-[#101C2C] mb-3">{title}</h4>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D6" />
            <XAxis
              dataKey="code"
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
              tickFormatter={(v) => `${v}%`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 15, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            />
            <Bar
              dataKey="nominalCAGR"
              name="Nominal CAGR (%/yr)"
              fill="#101C2C"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="realCAGR"
              name="Real (Inflation-Adjusted) CAGR (%/yr)"
              fill="#D6AD60"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeeGrowthChart;
