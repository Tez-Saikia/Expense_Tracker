import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import User from "../models/user.model.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateRefreshAndAccessTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh & Access tokens"
    );
  }
};

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if ([email, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill in all fields");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }

  if (!validator.isLength(password, { min: 6 })) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (username.length < 5) {
    throw new ApiError(400, "Username must be at least 5 characters long");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  } as any);

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  let avatarUrl: string;

  const avatarLocalPath = req.file?.path;

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required!");
    }

    avatarUrl = avatar.secure_url;
  } else {
    avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username
    )}&background=random&size=200`;
  }

  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatarUrl,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "User not found");
  }

const { accessToken, refreshToken } =
  await generateRefreshAndAccessTokens(user._id.toString());

return res
  .status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(201, "User created successfully 🎉", {
      user: createdUser,
      accessToken,
      refreshToken,
    })
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Please enter your email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPaswordValid = await user.comparePassword(password);

  if (!isPaswordValid) {
    throw new ApiError(401, "Invalid user credentials!");
  }

  const { refreshToken, accessToken } = await generateRefreshAndAccessTokens(
    user._id.toString()
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully!", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(400, "User not found!");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: "",
    },
  });

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully!", null));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Current User fetched successfully!", req.user));
});

const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded!");
  }
  if (!req.user) {
    throw new ApiError(401, "User not found!");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  if (user.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(user.cloudinaryPublicId);
    } catch (error) {
      const err = error as Error;
      console.error("Old image delete failed: ", err.message);
      throw new ApiError(500, "Something went wrong while updating avatar");
    }
  }

  const uploadAvatar = await uploadOnCloudinary(req.file.path);

  if (!uploadAvatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  user.avatar = uploadAvatar.secure_url;
  user.cloudinaryPublicId = uploadAvatar.public_id;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", user));
});

const updateUserAccountDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    if (username && username !== user.username) {
      user.username = username.toLowerCase();
    }

    if (email && email !== user.email) {
      user.email = email.toLowerCase();
    }

    await user.save();

    const updatedUser = await User.findById(user._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User account details updated successfully!",
          updatedUser
        )
      );
  }
);

const updateUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please enter current and new password");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from current password"
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", null));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserAccountDetails,
  updateUserPassword,
  getCurrentUser,
};
