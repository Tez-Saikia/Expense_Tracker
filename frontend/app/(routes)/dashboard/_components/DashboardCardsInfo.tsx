import { PiggyBank, ReceiptText, Wallet } from "lucide-react";

interface DashboardCardsInfoProps {
  monthlyIncome: number;
  monthlyExpense: number;
  totalBudgets: number;
}

function DashboardCardsInfo({
  monthlyIncome,
  monthlyExpense,
  totalBudgets,
}: DashboardCardsInfoProps) {
  return (
    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center justify-between rounded-lg border p-7">
        <div>
          <h2 className="text-sm">Monthly Income</h2>
          <h2 className="text-2xl font-bold">
            ₹{monthlyIncome.toLocaleString("en-IN")}
          </h2>
        </div>

        <PiggyBank className="bg-primary h-12 w-12 rounded-full p-3 text-white" />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-7">
        <div>
          <h2 className="text-sm">Monthly Expense</h2>
          <h2 className="text-2xl font-bold">
            ₹{monthlyExpense.toLocaleString("en-IN")}
          </h2>
        </div>

        <ReceiptText className="bg-primary h-12 w-12 rounded-full p-3 text-white" />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-7">
        <div>
          <h2 className="text-sm">No. Of Budgets</h2>
          <h2 className="text-2xl font-bold">{totalBudgets}</h2>
        </div>

        <Wallet className="bg-primary h-12 w-12 rounded-full p-3 text-white" />
      </div>
    </div>
  );
}

export default DashboardCardsInfo;
