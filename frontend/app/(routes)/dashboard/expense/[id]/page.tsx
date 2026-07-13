"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import BudgetItems from "../../budget/_components/BudgetItems";
import { useBudgetStore } from "@/store/userBudgetStore";
import AddExpense from "../_components/AddExpenseInsideBudget";
import { toast } from "sonner";
import ExpenseListTable from "../_components/ExpenseListTableInsideBudget";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditBudget from "../_components/EditBudget";
import { useExpenseStore } from "@/store/userExpenseStore";

function ExpensesIndividuaScreen() {
  const { budgetExpenses, fetchBudgetExpenses } = useExpenseStore();

  const router = useRouter();

  const { id } = useParams();

  const budgetInfo = useBudgetStore((state) => state.budgetInfo);

  const fetchBudgetById = useBudgetStore((state) => state.fetchBudgetById);

  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const refreshData = async () => {
    if (!id) return;

    await fetchBudgetById(id as string);
    await fetchBudgetExpenses(id as string);
  };

  useEffect(() => {
    if (!id) return;

    fetchBudgetById(id as string);
    fetchBudgetExpenses(id as string);
  }, [id, fetchBudgetById, fetchBudgetExpenses]);

  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(id as string);

      toast.success("Budget deleted successfully!");
      router.replace("/dashboard/budget");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">My Expense</h1>

        <div className="flex gap-3 items-center">
          <EditBudget budgetInfo={budgetInfo} onBudgetUpdated={refreshData} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="flex gap-3 cursor-pointer"
                variant="destructive"
              >
                <Trash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget and expenses from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBudget}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-7 gap-7 items-start">
        {budgetInfo ? <BudgetItems budget={budgetInfo} /> : <p>Loading...</p>}

        <AddExpense onExpenseAdded={refreshData} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Latest Expenses</h2>

        <ExpenseListTable expenseItems={budgetExpenses} 
        budgetId={id as string}
        />
      </div>
    </div>
  );
}

export default ExpensesIndividuaScreen;
