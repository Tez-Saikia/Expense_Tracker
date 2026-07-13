import mongoose, { model, Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
  avatar: string;
  cloudinaryPublicId?: string;

  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    cloudinaryPublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 11);
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },

    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10d",
    }
  );
};

const User: Model<IUser> =
  mongoose.models?.User || model<IUser>("User", userSchema);

export default User;
