import Link from "next/link";
import type { Budget } from "@/store/userBudgetStore";

interface BudgetItemsProps {
  budget: Budget;
}

function BudgetItems({ budget }: BudgetItemsProps) {
  return (
    <Link href={`/dashboard/expense/${budget._id}`}>
      <div className="group p-5 mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-purple-100 text-xl shadow-sm">
              {budget.icon}
            </div>

            <div>
              <h2 className="font-semibold text-slate-800 text-base">
                {budget.category}
              </h2>

              <p className="text-xs text-slate-500">
                {new Date(budget.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
                {" - "}
                {new Date(budget.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[.7rem] text-slate-500">Budget</p>
            <h2 className="text-lg font-extrabold text-primary">
              ₹{budget.amount}
            </h2>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Spent</p>
            <h3 className="text-sm font-semibold text-red-500">
              ₹{budget.totalSpent}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Left</p>
            <h3 className="text-sm font-semibold text-green-600">
              ₹{budget.remainingAmount}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Purchases</p>
            <h3 className="text-sm font-semibold text-slate-800">
              {budget.itemCount}
            </h3>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">
              Budget Usage
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {Math.round(budget.percentage)}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-primary  transition-all duration-700"
              style={{
                width: `${budget.percentage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItems;
