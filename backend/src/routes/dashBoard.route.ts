import { Router } from "express";
import { AuthVerify } from "../middlewares/verify.middleware.js";
import { getDashboard } from "../controllers/dashBoard.controller.js";

const dashBoardRouter = Router();

dashBoardRouter.get("/", AuthVerify, getDashboard);

export default dashBoardRouter;