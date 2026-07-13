"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useBudgetStore } from "@/store/userBudgetStore";

function CreateBudget() {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { createBudget } = useBudgetStore();

  const handleCreateNewBudget = async () => {
    try {
      await createBudget({
        amount: Number(budgetAmount),
        icon: emojiIcon,
        category: budgetName,
        startDate,
        endDate,
      });

      toast.success("Budget created successfully 🎉");

      setBudgetName("");
      setBudgetAmount("");
      setStartDate("");
      setEndDate("");
      setEmojiIcon("😀");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to create new budget!",
        );
        console.error("Failed to create new Budget: ", error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-56 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
            <span className="text-2xl text-slate-500">+</span>
          </div>

          <h2 className="text-lg font-medium text-slate-600">
            Create New Budget
          </h2>

          <p className="text-xs text-slate-500 mt-1">Add a new budget</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <div className="mt-6">
            <Button
              size="lg"
              className="text-lg"
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              variant="outline"
            >
              {emojiIcon}
            </Button>
            <div className="absolute z-20">
              <EmojiPicker
                open={openEmojiPicker}
                width={350}
                height={400}
                onEmojiClick={(e) => {
                  setEmojiIcon(e.emoji);
                  setOpenEmojiPicker(false);
                }}
              />
            </div>

            <div className="mt-2">
              <h1 className="text-black my-1 font-medium">Budget Name</h1>
              <Input
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="e.g. Grocery"
                required
              />
            </div>

            <div className="mt-2">
              <h1 className="text-black my-1 font-medium">Budget Amount</h1>
              <Input
                value={budgetAmount}
                type="number"
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="e.g. ₹250"
                required
              />
            </div>

            <div className="mt-2">
              <h1 className="text-black my-1 font-medium">Budget Period</h1>

              <label className="text-sm text-gray-500">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label className="text-sm text-gray-500 mt-2 block">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Button
              onClick={() => handleCreateNewBudget()}
              className="mt-6 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={!budgetName || !budgetAmount || !startDate || !endDate}
            >
              Create Budget
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBudget;
