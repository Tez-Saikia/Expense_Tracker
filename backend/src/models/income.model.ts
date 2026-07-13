import mongoose, { model, Schema, Document, Model, Types } from "mongoose";

export interface IIncome extends Document {
  description: string;
  amount: number;
  date: Date;
  userId: Types.ObjectId;
  type: string;
  icon: string;
}

const incomeSchema = new Schema<IIncome>(
  {
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
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
      default: "income",
    },
  },
  {
    timestamps: true,
  }
);

const Income: Model<IIncome> =
  mongoose.models?.Income || model<IIncome>("Income", incomeSchema);

export default Income;  
