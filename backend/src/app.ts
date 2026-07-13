import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import incomeRouter from "./routes/income.route.js";
import expenceRouter from "./routes/expence.route.js";
import dashBoardRouter from "./routes/dashBoard.route.js";


//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/income", incomeRouter)
app.use("/api/v1/expence", expenceRouter)
app.use("/api/v1/dashboard", dashBoardRouter)
app.use("/api/v1/budget", budgetRouter)

import type { Request, Response, NextFunction } from "express";
import budgetRouter from "./routes/budget.router.js";

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };
