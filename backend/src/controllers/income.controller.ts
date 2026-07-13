import Income from "../models/income.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import XLSX from "xlsx";
import getDateRange, { type DateRange } from "../utils/dataFilter.js";

const isDateRange = (value: unknown): value is DateRange => {
  return (
    typeof value === "string" &&
    ["daily", "weekly", "monthly", "yearly"].includes(value)
  );
};

const addUserIncome = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { icon, amount, description, date } = req.body;

  if (!description || !icon || typeof amount !== "number" || !date) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  const incomeDate = new Date(date);

  if (incomeDate > new Date()) {
    throw new ApiError(400, "Future dates are not allowed");
  }

  const newIncome = new Income({
    userId,
    amount,
    description,
    icon,
    date: new Date(date),
  });

  await newIncome.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Income added successfully 🎉", newIncome));
});

const getAllUserIncome = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const income = await Income.find({ userId }).sort({ date: -1 });

  return res.status(200).json(new ApiResponse(200, "Income fetched", income));
});

const updateUserIncome = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Invalid income id");
  }

  const { description, amount } = req.body;

  if (!description?.trim() || typeof amount !== "number") {
    throw new ApiError(400, "Please provide valid data");
  }

  const income = await Income.findOne({
    _id: id,
    userId,
  });

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  income.$set({
    description,
    amount,
  });

  await income.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Income updated successfully", income));
});

const deleteUserIncome = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Invalid income id");
  }

  const income = await Income.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Income deleted successfully", null));
});

const downloadUserIncomeData = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (incomes.length === 0) {
      throw new ApiError(404, "No income data found");
    }

    const data = incomes.map((income) => ({
      Description: income.description,
      Amount: income.amount,
      Date: income.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Data");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="income_data.xlsx"'
    );

    return res.send(buffer);
  }
);

const getUserIncomeOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const range: DateRange = isDateRange(req.query.range)
      ? req.query.range
      : "monthly";

    const { start, end } = getDateRange(range);

    const incomes = await Income.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: 1 });

    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

    const numberOfTransactions = incomes.length;

    const recentTransactions = [...incomes]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 9);

    const grouped = incomes.reduce((acc: Record<string, number>, income) => {
      let key = "";

      switch (range) {
        case "daily":
          key = income.date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            hour12: true,
          });
          break;

        case "weekly":
          key = income.date.toLocaleDateString("en-IN", {
            weekday: "short",
          });
          break;

        case "monthly":
          key = income.date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });
          break;

        case "yearly":
          key = income.date.toLocaleDateString("en-IN", {
            month: "short",
          });
          break;

        default:
          key = income.date.toLocaleDateString("en-IN");
      }

      acc[key] = (acc[key] || 0) + income.amount;

      return acc;
    }, {});

    const chartData = Object.entries(grouped).map(([label, income]) => ({
      label,
      income,
    }));

    return res.status(200).json(
      new ApiResponse(200, "Income overview fetched", {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
        chartData,
        range,
      })
    );
  }
);

export {
  addUserIncome,
  getAllUserIncome,
  updateUserIncome,
  deleteUserIncome,
  downloadUserIncomeData,
  getUserIncomeOverview,
};
