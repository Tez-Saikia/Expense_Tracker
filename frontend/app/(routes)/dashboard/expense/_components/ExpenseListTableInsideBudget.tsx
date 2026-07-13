import { Trash } from "lucide-react";
import { toast } from "sonner";
import { Expense, useExpenseStore } from "@/store/userExpenseStore";

interface ExpenseListTableProps {
  expenseItems: Expense[];
  budgetId: string;
}

function ExpenseListTable({ expenseItems, budgetId }: ExpenseListTableProps) {
  const { deleteBudgetExpense } = useExpenseStore();

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteBudgetExpense(id, budgetId);

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error while deleting an expense:", error);

      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Table Header */}
      <div className="grid grid-cols-4 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>

      {/* Table Rows */}
      {expenseItems.map((expense) => (
        <div
          key={expense._id}
          className="grid grid-cols-4 items-center border-t border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50"
        >
          <h2 className="font-medium text-slate-800">{expense.description}</h2>

          <h2 className="font-semibold text-red-500">₹{expense.amount}</h2>

          <h2 className="text-slate-500">
            {new Date(expense.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() => handleDeleteExpense(expense._id)}
            className="w-fit rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
