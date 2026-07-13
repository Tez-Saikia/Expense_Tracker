import { Router } from "express";
import { AuthVerify } from "../middlewares/verify.middleware.js";
import {
  addUserIncome,
  deleteUserIncome,
  downloadUserIncomeData,
  getAllUserIncome,
  getUserIncomeOverview,
  updateUserIncome,
} from "../controllers/income.controller.js";

const incomeRouter = Router();

incomeRouter.post("/add", AuthVerify, addUserIncome);
incomeRouter.get("/get", AuthVerify, getAllUserIncome);
incomeRouter.patch("/update/:id", AuthVerify, updateUserIncome);
incomeRouter.delete("/delete/:id", AuthVerify, deleteUserIncome);
incomeRouter.get("/download", AuthVerify, downloadUserIncomeData);
incomeRouter.get("/overview", AuthVerify, getUserIncomeOverview);

export default incomeRouter;
