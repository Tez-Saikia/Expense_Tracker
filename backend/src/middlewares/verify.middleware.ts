import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

export const AuthVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "You are not authorized to access this resource");
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (!decoded?._id) {
      throw new ApiError(401, "Invalid token payload!");
    }

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  }
);
