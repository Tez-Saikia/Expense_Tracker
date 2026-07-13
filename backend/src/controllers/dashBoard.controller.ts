import type { Request, Response } from "express";
import Income from "../models/income.model.js";
import Expence from "../models/expence.model.js";
import Budget from "../models/budget.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const now = new Date();
    const startingMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [incomes, expenses, totalBudgets, budgets] = await Promise.all([
      Income.find({
        userId,
        date: {
          $gte: startingMonth,
          $lte: now,
        },
      }).lean(),

      Expence.find({
        userId,
        date: {
          $gte: startingMonth,
          $lte: now,
        },
      }).lean(),

      Budget.countDocuments({ userId }),

      Budget.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
    ]);

    const monthlyIncome = incomes.reduce(
      (total, income) => total + Number(income.amount || 0),
      0
    );

    const monthlyExpense = expenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );

    const savings = monthlyIncome - monthlyExpense;

    const savingsRate =
      monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
      ...incomes.map((income) => ({
        ...income,
        type: "income",
      })),
      ...expenses.map((expense) => ({
        ...expense,
        type: "expense",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 10);

    const spendByCategory: Record<string, number> = {};

    for (const expense of expenses) {
      const category = expense.category || "Other";

      spendByCategory[category] =
        (spendByCategory[category] || 0) +
        Number(expense.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage:
          monthlyExpense === 0
            ? 0
            : Math.round((amount / monthlyExpense) * 100),
      })
    );

    return res.status(200).json(
      new ApiResponse(200, "Dashboard fetched successfully", {
        monthlyIncome,
        monthlyExpense,
        savings,
        savingsRate,
        totalBudgets,
        budgets, // 👈 added
        recentTransactions,
        expenseDistribution,
      })
    );
  }
);