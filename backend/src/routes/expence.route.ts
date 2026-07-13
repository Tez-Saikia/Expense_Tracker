import { Router } from "express";
import { AuthVerify } from "../middlewares/verify.middleware.js";
import {
  addBudgetExpense,
  addUserExpence,
  deleteUserExpence,
  downloadUserExpenceData,
  getAllUserExpence,
  getBudgetExpenses,
  getUserExpenceOverview,
  updateUserExpence,
} from "../controllers/expence.controller.js";

const expenceRouter = Router();

expenceRouter.post("/add", AuthVerify, addUserExpence);
expenceRouter.post("/budget/:id", AuthVerify, addBudgetExpense);
expenceRouter.get("/budget/:id", AuthVerify, getBudgetExpenses);
expenceRouter.get("/get", AuthVerify, getAllUserExpence);
expenceRouter.patch("/update/:id", AuthVerify, updateUserExpence);
expenceRouter.delete("/delete/:id", AuthVerify, deleteUserExpence);
expenceRouter.get("/download", AuthVerify, downloadUserExpenceData);
expenceRouter.get("/overview", AuthVerify, getUserExpenceOverview);

export default expenceRouter;
