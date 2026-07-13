"use client";

import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import type { Budget } from "@/store/userBudgetStore";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";

interface EditBudgetProps {
  budgetInfo: Budget | null;
  onBudgetUpdated: () => Promise<void>;
}

function EditBudget({ budgetInfo, onBudgetUpdated }: EditBudgetProps) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo.icon);
      setBudgetName(budgetInfo.category);
      setBudgetAmount(String(budgetInfo.amount));
      setStartDate(budgetInfo.startDate.split("T")[0]);
      setEndDate(budgetInfo.endDate.split("T")[0]);
    }
  }, [budgetInfo]);

  const handleUpdateBudget = async () => {
    try {
      const res = await axiosInstance.patch(
        `/budget/update/${budgetInfo?._id}`,
        {
          category: budgetName,
          amount: Number(budgetAmount),
          icon: emojiIcon,
          startDate,
          endDate,
        },
      );
      toast.success(res.data.message || "Budget updated successfully");
      await onBudgetUpdated();
    } catch (error) {
      console.error("Error while updating budget: ", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Error while updating budget",
        );
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 cursor-pointer">
          <PenBox />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
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
              onClick={() => handleUpdateBudget()}
              className="mt-6 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={!budgetName || !budgetAmount || !startDate || !endDate}
            >
              Update Budget
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditBudget;
