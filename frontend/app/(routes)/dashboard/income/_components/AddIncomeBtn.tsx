import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useIncomeStore } from "@/store/userIncomeStore";
function AddIncomeBtn() {
  const [icon, setIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { addIncome } = useIncomeStore();

  const handleAddIncome = async () => {
    try {
      await addIncome({
        description,
        icon,
        amount: Number(amount),
        date: Date.now(),
      });

      toast.success("Income added successfully 🎉");

      setIcon("😀");
      setDescription("");
      setAmount("");
      setDate("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Error while adding income",
        );
        console.error("Error while adding Income: ", error);
      }
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Add Income
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">Add Income</DialogTitle>

          <p className="text-sm text-muted-foreground">
            Track your earnings and assign them meaningfully.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Income Icon */}
          <Button
            size="lg"
            className="text-lg"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            variant="outline"
          >
            {icon}
          </Button>

          {/* Income Emoji Icon */}
          <div className="absolute z-20 -mt-4">
            <EmojiPicker
              open={openEmojiPicker}
              width={350}
              height={440}
              onEmojiClick={(e) => {
                setIcon(e.emoji);
                setOpenEmojiPicker(false);
              }}
            />
          </div>

          {/* Income Name */}
          <div>
            <label className="text-sm font-medium">Income Name</label>

            <Input
              className="mt-2"
              placeholder="eg: Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Income Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>

            <Input
              className="mt-2"
              type="number"
              placeholder="eg: ₹55000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Income Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>

            <Input
              className="mt-2"
              type="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button
            disabled={
              description === "" || amount === "" || icon === "" || date === ""
            }
            onClick={handleAddIncome}
            className="w-full cursor-pointer"
          >
            Save Income
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddIncomeBtn;
