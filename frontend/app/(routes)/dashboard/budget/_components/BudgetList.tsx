"use client";

import CreateBudget from "./CreateBudget";
import { useEffect } from "react";
import BudgetItems from "./BudgetItems";
import { useBudgetStore } from "@/store/userBudgetStore";

function BudgetList() {
  const { budget, isLoading, fetchBudget } = useBudgetStore();

  useEffect(() => {
    fetchBudget();
  }, []);

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        <CreateBudget />

        {isLoading ? (
          [1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-slate-200 rounded-lg w-full h-56 animate-pulse"
            />
          ))
        ) : budget.length > 0 ? (
          budget.map((budget) => (
            <BudgetItems key={budget._id} budget={budget} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed p-10">
            <p className="text-slate-500">
              No budget categories yet. Create your first budget.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetList;
