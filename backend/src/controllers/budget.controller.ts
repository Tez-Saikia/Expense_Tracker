import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import XLSX from "xlsx";
import getDateRange, { type DateRange } from "../utils/dataFilter.js";
import Budget from "../models/budget.model.js";
import Expence from "../models/expence.model.js";

const isDateRange = (value: unknown): value is DateRange => {
  return (
    typeof value === "string" &&
    ["daily", "weekly", "monthly", "yearly"].includes(value)
  );
};

const addUserBudget = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { amount, icon, category, startDate, endDate } = req.body;

  if (
    !icon ||
    !category ||
    typeof amount !== "number" ||
    !startDate ||
    !endDate
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (new Date(endDate) < new Date(startDate)) {
    throw new ApiError(400, "End date must be after start date");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  const newBudget = new Budget({
    userId,
    amount,
    icon,
    category,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });
  await newBudget.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Budget added successfully", newBudget));
});

const getAllUserBudget = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

  const budgetWithStats = await Promise.all(
    budgets.map(async (budget) => {
      const expenses = await Expence.find({
        userId,
        category: budget.category,
      });

      const totalSpent = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const itemCount = expenses.length;

      const remainingAmount = budget.amount - totalSpent;

      const percentage =
        budget.amount > 0
          ? Math.min((totalSpent / budget.amount) * 100, 100)
          : 0;

      return {
        ...budget.toObject(),

        totalSpent,
        itemCount,
        remainingAmount,
        percentage,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Budget fetched successfully", budgetWithStats));
});

const getUserBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Invalid budget id");
  }

  const budget = await Budget.findOne({
    _id: id,
    userId,
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  const expenses = await Expence.find({
    userId,
    category: budget.category,
  });

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const itemCount = expenses.length;
  const remainingAmount = budget.amount - totalSpent;

  const percentage =
    budget.amount > 0 ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;

  res.status(200).json(
    new ApiResponse(200, "Budget fetched successfully", {
      ...budget.toObject(),
      expenses,
      totalSpent,
      itemCount,
      remainingAmount,
      percentage,
    })
  );
});

const updateUserBudget = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Invalid budget id");
  }

  const { category, amount, icon, startDate, endDate } = req.body;

  if (
    !category?.trim() ||
    typeof amount !== "number" ||
    !icon ||
    !startDate ||
    !endDate
  ) {
    throw new ApiError(400, "Please provide valid data");
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, "Start date cannot be after end date");
  }

  const budget = await Budget.findOne({
    _id: id,
    userId,
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  budget.$set({
    category,
    amount,
    icon,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  await budget.save();

  await Expence.updateMany(
    {
      budgetId: id,
      userId,
    },
    {
      category,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Budget updated successfully", budget));
});

const deleteUserBudget = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Invalid budget id");
  }

  const budget = await Budget.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  await Expence.deleteMany({
    budgetId: id,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Budget deleted successfully", null));
});

const downloadUserBudget = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const budget = await Budget.find({ userId }).sort({ startDate: -1 });

  if (budget.length === 0) {
    throw new ApiError(404, "No budget data found");
  }

  const data = budget.map((budget) => ({
    Icon: budget.icon,
    Amount: budget.amount,
    Category: budget.category,
    StartDate: budget.startDate.toLocaleDateString(),
    EndDate: budget.endDate.toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget Data");

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
});

const getUserBudgetOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const range: DateRange = isDateRange(req.query.range)
      ? req.query.range
      : "monthly";

    const { start, end } = getDateRange(range);

    const budget = await Budget.find({
      userId,
      startDate: {
        $gte: start,
        $lte: end,
      },
    }).sort({ startDate: -1 });

    const totalBudget = budget.reduce((acc, cur) => acc + cur.amount, 0);
    const averageBudget = budget.length > 0 ? totalBudget / budget.length : 0;
    const numberOfTransactions = budget.length;

    const recentTransactions = budget.slice(0, 9);

    res.status(200).json(
      new ApiResponse(200, "Budget overview fetched", {
        totalBudget,
        averageBudget,
        numberOfTransactions,
        recentTransactions,
        range,
      })
    );
  }
);

export {
  addUserBudget,
  getAllUserBudget,
  getUserBudgetById,
  updateUserBudget,
  deleteUserBudget,
  downloadUserBudget,
  getUserBudgetOverview,
};
