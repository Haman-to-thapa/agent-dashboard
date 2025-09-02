import mongoose from "mongoose";

export const connectDB = async (mongoURI: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURI); // connects using the URI from .env
    console.log("✅ MongoDB connected");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ MongoDB connection error:", err.message);
    } else {
      console.error("❌ MongoDB connection error:", err);
    }
    process.exit(1); // exit the process if connection fails
  }
};
