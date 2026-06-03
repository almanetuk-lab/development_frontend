import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const StackedBarChart = ({ data = [], title }) => {
  if (!data || data.length === 0) return null;

  const dataKeys = Object.keys(data[0]).filter((key) => key !== "label");

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>

      {/*  FIX: fixed height */}
      <ResponsiveContainer width="100%" height={350} minWidth={100} debounce={200}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />

          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;