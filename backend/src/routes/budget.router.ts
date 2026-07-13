import { Router } from "express";
import { AuthVerify } from "../middlewares/verify.middleware.js";
import {
  addUserBudget,
  deleteUserBudget,
  downloadUserBudget,
  getAllUserBudget,
  getUserBudgetById,
  getUserBudgetOverview,
  updateUserBudget,
} from "../controllers/budget.controller.js";

const budgetRouter = Router();

budgetRouter.post("/add", AuthVerify, addUserBudget);
budgetRouter.get("/get", AuthVerify, getAllUserBudget);
budgetRouter.get("/:id", AuthVerify, getUserBudgetById);
budgetRouter.patch("/update/:id", AuthVerify, updateUserBudget);
budgetRouter.delete("/delete/:id", AuthVerify, deleteUserBudget);
budgetRouter.get("/download", AuthVerify, downloadUserBudget);
budgetRouter.get("/overview", AuthVerify, getUserBudgetOverview);

export default budgetRouter;
