"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import DashboardCardsInfo from "./_components/DashboardCardsInfo";
import { useAuthStore } from "@/store/useAuthStore";
import BarChartDashboard from "./_components/BarChartDashboard";
import type { Budget } from "@/store/userBudgetStore";
import type { Expense } from "@/store/userBudgetStore";
import { ScrollArea } from "@/components/ui/scroll-area";


function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    totalBudgets: 0,
  });

  const getDashboardData = async () => {
    try {
      const res = await axiosInstance.get("/dashboard");

      setBudgets(res.data.data.budgets);

      setRecentTransactions(res.data.data.recentTransactions || []);

      setDashboardData({
        monthlyIncome: res.data.data.monthlyIncome,
        monthlyExpense: res.data.data.monthlyExpense,
        totalBudgets: res.data.data.totalBudgets,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const res = await axiosInstance.get("/expence/get");

      setExpenseData(res.data.data);

      console.log("Expenses:", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData();
    getAllExpenses();
  }, []);

  const { authUser } = useAuthStore();

  const chartData = [
    {
      label: "Income",
      amount: dashboardData.monthlyIncome,
    },
    {
      label: "Expense",
      amount: dashboardData.monthlyExpense,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="font-bold text-3xl">
        {" "}
        Hi, <span className="capitalize">{authUser?.username}</span> 👋
      </h2>
      <p className="text-gray-500 pt-2 font-medium">
        Your complete financial overview track budgets, incomes, and expenses
        all in one place
      </p>

      <DashboardCardsInfo
        monthlyIncome={dashboardData.monthlyIncome}
        monthlyExpense={dashboardData.monthlyExpense}
        totalBudgets={dashboardData.totalBudgets}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Left Side */}
        <div className="md:col-span-2 space-y-6">
          <BarChartDashboard data={chartData} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-bold text-slate-700">
              Recent Transactions
            </h2>
          </div>

          <ScrollArea className="h-105">
            <div className="p-4 space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {transaction.category ||
                          transaction.source ||
                          "Transaction"}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} ₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-500">
                  No transactions found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
