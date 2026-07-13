import mongoose, { model, Schema, Document, Model, Types } from "mongoose";

export interface IBudget extends Document {
  icon: string;
  amount: number;
  category: string;
  startDate: Date;
  endDate: Date;
  userId: Types.ObjectId;
  type: string;
}

const budgetSchema = new Schema<IBudget>(
  {
    icon: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      default: "budget",
    },
  },
  {
    timestamps: true,
  }
);

const Budget: Model<IBudget> =
  mongoose.models?.Budget || model<IBudget>("Budget", budgetSchema);

export default Budget;
