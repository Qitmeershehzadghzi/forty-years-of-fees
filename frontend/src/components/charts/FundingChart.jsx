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
    { name: 'Zakat funds', value: 42, color: '#0F5C4E' },
    { name: 'Waqf endowments', value: 28, color: '#4E8F7F' },
    { name: 'Church education trusts', value: 16, color: '#A9C9C0' },
    { name: 'Temple education trusts', value: 14, color: '#B7791F' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0];
      return (
        <div className="bg-white border border-[#E2E7E2] p-2.5 rounded-lg text-xs shadow-lg">
          <div className="font-semibold text-[#12231F]">{row.name}</div>
          <div className="text-[#0F5C4E] mt-1">Estimated share: {row.value}%</div>
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
            innerRadius={60}
            outerRadius={96}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={40}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundingChart;
