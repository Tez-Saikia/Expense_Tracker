"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartDashboardProps {
  data: {
    label: string;
    amount: number;
  }[];
}

function BarChartDashboard({ data }: BarChartDashboardProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Financial Overview</h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare your income and expenses this month
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 13,
                fill: "#64748b",
              }}
            />

            <YAxis
              width={90}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 13,
                fill: "#64748b",
              }}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Tooltip
              cursor={{ fill: "rgba(70,133,236,0.08)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Amount",
              ]}
            />

            <Bar
              dataKey="amount"
              fill="#4685ec"
              radius={[10, 10, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartDashboard;
