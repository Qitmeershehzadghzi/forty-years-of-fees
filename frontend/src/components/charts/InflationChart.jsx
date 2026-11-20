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
  height = 380,
  title = 'CPI index and annual inflation',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#5C6B66]">
        No inflation data yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-white border border-[#E2E7E2] p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2 border-b border-[#E2E7E2] pb-1">Year {label}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-[#5C6B66]">CPI index</span>
              <span className="font-semibold">{row.cpi?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#5C6B66]">Inflation</span>
              <span className="font-semibold">{formatPercent(row.inflationRate)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && <h4 className="font-semibold text-base text-[#12231F] mb-3">{title}</h4>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 10 }}>
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
              yAxisId="left"
              stroke="#8A9A94"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#8A9A94"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
            <Bar
              yAxisId="right"
              dataKey="inflationRate"
              name="Annual inflation (%)"
              fill="#B7791F"
              opacity={0.4}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cpi"
              name="CPI (2016 = 100)"
              stroke="#0F5C4E"
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InflationChart;
