import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { formatPercent } from '../../utils/currencyFormatter.js';

export const InflationChart = ({
  data = [],
  height = 400,
  title = 'Pakistan Bureau of Statistics (PBS) CPI & Annual Inflation Trends',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-mono text-[#788391]">
        No inflation trend data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#1A2B40] p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-[#D6AD60] mb-2 border-b border-[#1A2B40] pb-1">
            Year {label}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span>CPI Index:</span>
              <span className="font-bold text-[#D6AD60]">{row.cpi?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Annual Inflation Rate:</span>
              <span className={`font-bold ${row.inflationRate > 15 ? 'text-[#C75A5A]' : 'text-[#23865B]'}`}>
                {formatPercent(row.inflationRate)}
              </span>
            </div>
            <div className="text-[10px] text-[#788391] pt-1 border-t border-[#1A2B40]">
              Series: {row.seriesId} · Base: {row.baseYear}
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
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D6" />
            <XAxis
              dataKey="year"
              stroke="#788391"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
              dy={10}
            />
            {/* Left Axis: CPI Index */}
            <YAxis
              yAxisId="left"
              stroke="#D6AD60"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
              dx={-5}
            />
            {/* Right Axis: Annual Inflation Rate % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#426B70"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              dx={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 15, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            />
            <Bar
              yAxisId="right"
              dataKey="inflationRate"
              name="Annual Inflation Rate (%)"
              fill="#426B70"
              opacity={0.65}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cpi"
              name="CPI Index (Base 2016=100)"
              stroke="#D6AD60"
              strokeWidth={2.8}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InflationChart;
