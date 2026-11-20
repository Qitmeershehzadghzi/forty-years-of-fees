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
  height = 360,
  title = 'Annual growth rate (CAGR): nominal vs real',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#5C6B66]">
        No growth data yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-white border border-[#E2E7E2] p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-1.5 border-b border-[#E2E7E2] pb-1">
            {row.name} ({row.code})
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-[#5C6B66]">Nominal CAGR</span>
              <span className="font-semibold">{row.nominalCAGR}% / yr</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#5C6B66]">Real CAGR</span>
              <span className="font-semibold text-[#0F5C4E]">{row.realCAGR}% / yr</span>
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
          <BarChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE8" vertical={false} />
            <XAxis
              dataKey="code"
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
              tickFormatter={(v) => `${v}%`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
            <Bar dataKey="nominalCAGR" name="Nominal CAGR" fill="#0F5C4E" radius={[3, 3, 0, 0]} />
            <Bar dataKey="realCAGR" name="Real CAGR" fill="#B9D4CC" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeeGrowthChart;
