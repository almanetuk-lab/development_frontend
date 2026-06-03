
import {
  PieChart as RechartsPie,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const PieChart = ({ data = [], title }) => {
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>

      {/*  FIX: give fixed height to ResponsiveContainer */}
      <ResponsiveContainer width="100%" height={300} minWidth={100} debounce={200}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="label"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;