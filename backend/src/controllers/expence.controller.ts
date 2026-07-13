import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Expence from "../models/expence.model.js";
import XLSX from "xlsx";
import getDateRange, { type DateRange } from "../utils/dataFilter.js";
import Budget from "../models/budget.model.js";

const isDateRange = (value: unknown): value is DateRange => {
  return (
    typeof value === "string" &&
    ["daily", "weekly", "monthly", "yearly"].includes(value)
  );
};

const addUserExpence = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { amount, description, date, budgetId } = req.body;

  if (!description || typeof amount !== "number" || !date) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const budget = await Budget.findOne({
    _id: budgetId,
    userId,
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  const newExpence = new Expence({
    userId,
    budgetId,
    amount,
    description,
    category: budget.category,
    date: new Date(date),
  });

  await newExpence.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Expence added successfully", newExpence));
});

const addBudgetExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id: budgetId } = req.params;
  const { description, amount } = req.body;

  if (!description || typeof amount !== "number") {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!budgetId) {
    throw new ApiError(400, "Please provide budget id");
  }

  const budget = await Budget.findOne({
    _id: budgetId,
    userId,
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  const newExpense = new Expence({
    userId,
    budgetId,
    description,
    amount,
    category: budget.category,
    date: new Date(),
  });

  await newExpense.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Expense added successfully", newExpense));
});

const getBudgetExpenses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id: budgetId } = req.params;

  if (!budgetId) {
    throw new ApiError(400, "Please provide budget id");
  }

  const expense = await Expence.find({
    userId,
    budgetId,
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Expenses fetched successfully", expense));
});

const getAllUserExpence = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const expence = await Expence.find({ userId })
    .populate("budgetId", "icon category")
    .sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Expence fetched successfully", expence));
});

const updateUserExpence = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Invalid expence id");
  }

  const { description, amount } = req.body;

  if (!description?.trim() || typeof amount !== "number") {
    throw new ApiError(400, "Please provide valid data");
  }

  const expence = await Expence.findOne({
    _id: id,
    userId,
  });

  if (!expence) {
    throw new ApiError(404, "Expence not found");
  }

  expence.$set({
    description,
    amount,
  });

  await expence.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Expence updated successfully", expence));
});

const deleteUserExpence = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Invalid expence id");
  }

  const expence = await Expence.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!expence) {
    throw new ApiError(404, "Expence not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Expence deleted successfully", null));
});

const downloadUserExpenceData = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const expence = await Expence.find({ userId }).sort({ date: -1 });

    if (expence.length === 0) {
      throw new ApiError(404, "No expense data found");
    }

    const data = expence.map((expence) => ({
      Description: expence.description,
      Amount: expence.amount,
      Category: expence.category,
      Date: expence.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expence Data");

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
      'attachment; filename="expense_data.xlsx"'
    );

    return res.send(buffer);
  }
);

const getUserExpenceOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const range: DateRange = isDateRange(req.query.range)
      ? req.query.range
      : "monthly";

    const { start, end } = getDateRange(range);

    const expence = await Expence.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("budgetId", "icon category")
      .sort({ date: -1 });

    const totalExpence = expence.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpence =
      expence.length > 0 ? totalExpence / expence.length : 0;
    const numberOfTransactions = expence.length;

    const recentTransactions = expence.slice(0, 9);

    res.status(200).json(
      new ApiResponse(200, "Expence overview fetched", {
        totalExpence,
        averageExpence,
        numberOfTransactions,
        recentTransactions,
        range,
      })
    );
  }
);

export {
  addUserExpence,
  addBudgetExpense,
  getBudgetExpenses,
  getAllUserExpence,
  updateUserExpence,
  deleteUserExpence,
  downloadUserExpenceData,
  getUserExpenceOverview,
};
