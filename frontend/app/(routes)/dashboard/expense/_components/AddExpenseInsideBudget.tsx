"use client";

import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface AddExpenseProps {
  onExpenseAdded: () => void;
}

function AddExpense({ onExpenseAdded }: AddExpenseProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const { id: budgetId } = useParams();
  console.log("budgetId:", budgetId);

  const handleAddExpense = async () => {
    try {
      const result = await axiosInstance.post(`/expence/budget/${budgetId}`, {
        description: name,
        amount,
      });
      onExpenseAdded();
      
      toast.success(result.data.message || "Budget created successfully 🎉");
      console.log(result.data);

      setName("");
      setAmount("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to add new Expense!",
        );
        console.error("Error while adding expense :", error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Add Expense</h2>

      <div className="mt-2 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Expense Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Home Decor"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Expense Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. ₹250"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name || amount === ""}
          onClick={() => handleAddExpense()}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default AddExpense;
