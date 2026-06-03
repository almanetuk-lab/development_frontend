
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const BarChart = ({ data, title }) => (
  <div className="bg-white p-4 rounded shadow w-full">
    <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>

    {/* fixed height */}
    <ResponsiveContainer width="100%" height={300} minWidth={100} debounce={200}>
      <RechartsBar data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#2563eb" barSize={40} radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  </div>
);

export default BarChart;