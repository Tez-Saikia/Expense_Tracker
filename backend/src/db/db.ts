import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionStatus = await mongoose.connect(
      `${process.env.MONGODB_URL!}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB is connected to ${connectionStatus.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
