import React from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

const tooltipStyle = {
  background: "#111a2e", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", fontSize: "12px", color: "#fff",
};

export const TrendLineChart = ({ data, dataKey = "score", xKey = "month", color = "#22d3ee", height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip contentStyle={tooltipStyle} />
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} />
    </LineChart>
  </ResponsiveContainer>
);

export const ComparisonBarChart = ({ data, bars = [{ key: "value", color: "#22d3ee" }], xKey = "name", height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={tooltipStyle} />
      {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      {bars.map((b) => (
        <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[6, 6, 0, 0]} name={b.label || b.key} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export const RiskPieChart = ({ data, height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
        {data.map((d, i) => <Cell key={i} fill={d.color} />)}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </PieChart>
  </ResponsiveContainer>
);
