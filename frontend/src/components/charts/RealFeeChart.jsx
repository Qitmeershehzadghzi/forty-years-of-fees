import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { formatPKR } from '../../utils/currencyFormatter.js';

export const RealFeeChart = ({
  data = [],
  programmeName = 'Selected programme',
  baseYear = 2027,
  height = 420,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#5C6B66]">
        No fee data to chart yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-white text-[#12231F] border border-[#E2E7E2] p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2 border-b border-[#E2E7E2] pb-1">
            {label}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-[#5C6B66]">Nominal fee</span>
              <span className="font-semibold">{formatPKR(row.nominalAmount)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#0F5C4E]">Real fee ({baseYear} PKR)</span>
              <span className="font-semibold text-[#0F5C4E]">{formatPKR(row.realAmount)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-[#E2E7E2] text-[11px] text-[#5C6B66]">
              <span>CPI {label}</span>
              <span>{row.cpi}</span>
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
          <h4 className="font-semibold text-base text-[#12231F]">
            Nominal vs real fee — {programmeName}
          </h4>
          <p className="text-xs text-[#5C6B66] mt-0.5">
            Real fees are adjusted to {baseYear} rupees using the CPI.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#5C6B66]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#12231F]" /> Nominal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0F5C4E]" /> Real
          </span>
        </div>
      </div>

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
              stroke="#8A9A94"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatPKR(v, { compact: true })}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="realAmount"
              name={`Real fee (${baseYear} PKR)`}
              fill="#0F5C4E"
              fillOpacity={0.08}
              stroke="#0F5C4E"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="nominalAmount"
              name="Nominal fee"
              stroke="#12231F"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealFeeChart;
