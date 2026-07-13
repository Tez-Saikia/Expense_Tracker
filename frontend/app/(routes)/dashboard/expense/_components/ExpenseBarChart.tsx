"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useMemo } from "react";

interface Expense {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  budgetId?: {
    icon: string;
    category: string;
  };
}

interface ExpenseBarChartProps {
  expenses: Expense[];
}

function ExpenseBarChart({ expenses }: ExpenseBarChartProps) {
  const chartData = useMemo(() => {
    return expenses.map((expense, index) => ({
      id: index + 1,
      amount: expense.amount,
      label: `${new Date(expense.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })}`,
    }));
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <div className="mt-8 flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">
          No expense data available for this range 📉
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 h-87.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={12}
            tick={{ fontSize: 12 }}
          />

          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />

          <Tooltip formatter={(value) => [`₹${Number(value)}`, "Expense"]} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseBarChart;
