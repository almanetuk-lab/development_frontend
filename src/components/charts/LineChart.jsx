

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineChart = ({ data = [], title }) => (
  <div className="bg-white p-4 rounded shadow w-full">
    <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>

    {/* ✅ FIX: fixed height */}
    <ResponsiveContainer width="100%" height={300} minWidth={100} debounce={200}>
      <RechartsLine data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </RechartsLine>
    </ResponsiveContainer>
  </div>
);

export default LineChart;