"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBudgetStore } from "@/store/userBudgetStore";
import { useExpenseStore } from "@/store/userExpenseStore";



function AddExpInGlobalExp() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState("");

  const budgets = useBudgetStore((state) => state.budget);
  const fetchBudget = useBudgetStore((state) => state.fetchBudget);
  const addExpense = useExpenseStore((state) => state.addExpense);

  useEffect(() => {
    if (!budgets.length) {
      fetchBudget();
    }
  }, [budgets.length, fetchBudget]);

  const handleAddExpenseBtn = async () => {
    try {
      await addExpense({
        description,
        amount: Number(amount),
        budgetId,
        date: Date.now(),
      });

      toast.success("Expense added successfully!");

      setDescription("");
      setAmount("");
      setBudgetId("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to add an expense!",
        );
      }

      console.error(error);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">Add Expense</DialogTitle>

          <p className="text-sm text-muted-foreground">
            Record a new expense and assign it to a budget category.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expense Name */}
          <div>
            <label className="text-sm font-medium">Expense Name</label>

            <Input
              className="mt-2"
              placeholder="eg: Netflix"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>

            <Input
              className="mt-2"
              type="number"
              placeholder="eg: 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium">Budget Category</label>

            <div className="mt-2">
              <Select
                value={budgetId}
                onValueChange={(value) => {
                  setBudgetId(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget._id} value={budget._id}>
                      {budget.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              No category found? Create a budget first.
            </p>
          </div>

          <Button
            disabled={description === "" || amount === "" || budgetId === ""}
            onClick={handleAddExpenseBtn}
            className="w-full cursor-pointer"
          >
            Save Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpInGlobalExp;
