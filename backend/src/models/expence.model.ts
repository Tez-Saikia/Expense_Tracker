import mongoose, { model, Schema, Document, Model, Types } from "mongoose";

export interface IExpence extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  userId: Types.ObjectId;
  type: string;
  budgetId: Types.ObjectId;
}

const expenceSchema = new Schema<IExpence>(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
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
      default: "expense",
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Expence: Model<IExpence> =
  mongoose.models?.IExpence || model<IExpence>("Expence", expenceSchema);

export default Expence;
