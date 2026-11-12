import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function FeeChart({ rows, money }) {
  return (
<ResponsiveContainer width="100%" height={330}>
                      <LineChart data={rows}>
                        <CartesianGrid strokeDasharray="3 5" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis width={80} />
                        <Tooltip formatter={money} />
                        <Legend />
                        <Line
                          name={rows.some(r=>r.isDemo)?"Synthetic demo fee":"Published fee"}
                          type="linear"
                          dataKey="amount"
                          stroke="#174c44"
                          strokeWidth={2}
                          connectNulls={false}
                        />
                        <Line
                          name="Inflation adjusted"
                          type="linear"
                          dataKey="real"
                          stroke="#b7773c"
                          strokeWidth={2}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
  );
}
