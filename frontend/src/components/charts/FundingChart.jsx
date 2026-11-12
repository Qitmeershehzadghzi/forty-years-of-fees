import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

export const FundingChart = ({ height = 320 }) => {
  const data = [
    { name: 'Institutional Zakat Funds', value: 42, color: '#23865B' },
    { name: 'Waqf Perpetual Endowments', value: 28, color: '#D6AD60' },
    { name: 'Church Education Trusts', value: 16, color: '#426B70' },
    { name: 'Temple Education Trusts', value: 14, color: '#8C3A3A' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0];
      return (
        <div className="bg-[#101C2C] text-[#F5F1E8] border border-[#1A2B40] p-2.5 rounded-lg text-xs font-mono">
          <div className="font-bold text-white">{row.name}</div>
          <div className="text-[#D6AD60] mt-1">Est. Share: {row.value}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundingChart;
