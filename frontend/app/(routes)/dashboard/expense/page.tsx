"use client";

import ExpenseBarChart from "./_components/ExpenseBarChart";
import { useState, useEffect } from "react";
import AddExpInGlobalExp from "./_components/AddExpInGlobalExp";
import DownloadExpenseData from "./_components/DownloadExpenseData";
import { Trash, TrendingDown } from "lucide-react";
import { useExpenseStore } from "@/store/userExpenseStore";

function Expense() {
  const {
  range,
  setRange,
  expenses,
  overview,
  fetchExpenses,
  fetchOverview,
  deleteExpense,
} = useExpenseStore();

useEffect(() => {
  fetchExpenses();
}, [fetchExpenses]);

useEffect(() => {
  fetchOverview(range);
}, [range, fetchOverview]);

const handleDeleteExpense = async (id: string) => {
  await deleteExpense(id);
};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-700">Expense Overview</h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Your complete expense history at a glance — monitor, analyze, and
            refine your financial decisions effortlessly.
          </p>
        </div>

        <AddExpInGlobalExp/>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">Filter:</label>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm"
        >
          <option value="daily">Day</option>
          <option value="weekly">Week</option>
          <option value="monthly">Month</option>
          <option value="yearly">Year</option>
        </select>
      </div>

      <div className="mt-14">
        <ExpenseBarChart expenses={overview?.recentTransactions ?? []} />
      </div>

      <div className="mt-24">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-700">All Expenses</h1>

          <DownloadExpenseData />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  {expense.budgetId?.icon || "💰"}
                </div>

                <div>
                  <p className="font-medium text-slate-800">
                    {expense.category}
                  </p>

                  {expense.description && (
                    <p className="mt-1 text-sm text-slate-600">
                      {expense.description}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-red-50 px-3 py-2">
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="font-semibold">- ₹{expense.amount}</span>

                    <TrendingDown size={16} />
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Expense;
