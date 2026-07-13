"use client";

import { useEffect, useState } from "react";
import AddIncomeBtn from "./_components/AddIncomeBtn";
import IncomeBarChart from "./_components/IncomeBarChart";
import DownloadIncomeData from "./_components/DownloadIncomeData";
import { Trash, TrendingUp } from "lucide-react";
import { useIncomeStore } from "@/store/userIncomeStore";

function Income() {
  const [range, setRange] = useState("monthly");
  const incomeData = useIncomeStore((state) => state.income);
  const overview = useIncomeStore((state) => state.overview);
  const { fetchIncome, fetchOverview, deleteIncome } = useIncomeStore();

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  useEffect(() => {
    fetchOverview(range);
  }, [range, fetchOverview]);

  const handleDeleteIncome = async (id: string) => {
    await deleteIncome(id);

    fetchIncome();
    fetchOverview(range);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-700">Income Overview</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Record your earnings, track growth, and balance your finances with
            ease.
          </p>
        </div>
        <AddIncomeBtn />
      </div>

      <div className="flex items-center gap-3 mt-3">
        <label className="text-sm font-medium text-slate-600">Filter:</label>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="daily">Day</option>
          <option value="weekly">Week</option>
          <option value="monthly">Month</option>
          <option value="yearly">Year</option>
        </select>
      </div>

      <div className="mt-14">
        <IncomeBarChart data={overview?.chartData ?? []} />
      </div>

      <div className="mt-24">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-700">All incomes</h1>

          <DownloadIncomeData />
        </div>

        {/* Global Income Table ⬇ */}

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {incomeData.map((income) => {
            console.log(income);
            return (
              <div
                key={income._id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                    {income.icon || "💰"}
                  </div>

                  <div>
                    {income.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {income.description}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(income.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-red-50 px-3 py-2">
                    <div className="flex items-center gap-2 text-green-500">
                      <span className="font-semibold">+ ₹{income.amount}</span>
                      <TrendingUp size={16} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteIncome(income._id)}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Income;
