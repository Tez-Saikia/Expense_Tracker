import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAccountDetails,
  updateUserAvatar,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { AuthVerify } from "../middlewares/verify.middleware.js";

const userRouter = Router();

userRouter.post("/register", upload.single("avatar"), registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", AuthVerify, logoutUser);

userRouter.get("/me", AuthVerify, getCurrentUser);

userRouter.patch("/avatar", AuthVerify, upload.single("avatar"), updateUserAvatar);

userRouter.patch("/update", AuthVerify, updateUserAccountDetails);

userRouter.patch("/password", AuthVerify, updateUserPassword);

export default userRouter;
